const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const axios = require('axios');
const dotenv = require('dotenv');
const url = require('url'); // <--- AÑADIDO

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

// === CONFIGURACIONES ===
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const messaging = admin.messaging(); // <--- CRÍTICO: Inicialización del servicio de mensajería

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const GODSTREAM_API_KEY = process.env.GODSTREAM_API_KEY; // <--- AÑADIDO

// === SOLUCIÓN 1: CAMBIO DE POLLING A WEBHOOK PARA TELEGRAM ===
const RENDER_BACKEND_URL = 'https://serivisios.onrender.com';
const bot = new TelegramBot(token);
const webhookUrl = `${RENDER_BACKEND_URL}/bot${token}`;
bot.setWebHook(webhookUrl);

const ADMIN_CHAT_ID = parseInt(process.env.ADMIN_CHAT_ID, 10);
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// === CONFIGURACIÓN DE ATJOS DEL BOT ===
bot.setMyCommands([
    { command: 'start', description: 'Reiniciar el bot y ver el menú principal' },
    { command: 'subir', description: 'Subir una película o serie a la base de datos' },
    { command: 'editar', description: 'Editar los enlaces de una película o serie existente' },
    { command: 'pedidos', description: 'Ver la lista de películas solicitadas por los usuarios' }
]);

const adminState = {};

// === MIDDLEWARE ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// === RUTAS DEL SERVIDOR WEB ===
app.get('/', (req, res) => {
  res.send('¡El bot y el servidor de Sala Cine están activos!');
});

// === NUEVO ENDPOINT PARA RECIBIR ACTUALIZACIONES DEL WEBHOOK DE TELEGRAM ===
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// -------------------------------------------------------------------------
// === RUTA CRÍTICA: MANEJO DE APP LINK Y REDIRECCIÓN DE FALLO ===
// -------------------------------------------------------------------------

/* Esta ruta se activa si el usuario toca el botón "Abrir en App Nativa" 
 * y la aplicación de Android NO está instalada (App Link falla). 
 * Redirige al usuario a la tienda personalizada.
*/
app.get('/app/details/:tmdbId', (req, res) => {
    const tmdbId = req.params.tmdbId;
    
    // Si la App Nativa falla, redirigimos a la Tienda Personalizada
    if (process.env.APP_DOWNLOAD_URL) {
        console.log(`App Nativa no instalada. Redirigiendo a la Tienda Personalizada: ${process.env.APP_DOWNLOAD_URL}`);
        return res.redirect(302, process.env.APP_DOWNLOAD_URL);
    }

    // Último Fallback: Si no hay tienda definida, redirigimos a la TMA.
    if (process.env.TELEGRAM_MINIAPP_URL) {
        const tmaLink = process.env.TELEGRAM_MINIAPP_URL + '?startapp=' + tmdbId;
        console.log('APP_DOWNLOAD_URL no definida. Redirigiendo al fallback de la TMA.');
        return res.redirect(302, tmaLink);
    }

    // Fallo Total
    res.status(404).send('No se encontró la aplicación de destino ni un enlace de descarga.');
});


app.post('/request-movie', async (req, res) => {
    const movieTitle = req.body.title;
    const posterPath = req.body.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://placehold.co/500x750?text=No+Poster';
    
    const tmdbId = req.body.tmdbId;

    const message = `🔔 *Solicitud de película:* ${movieTitle}\n\nUn usuario ha solicitado esta película.`;
    
    try {
        await bot.sendPhoto(ADMIN_CHAT_ID, posterUrl, {
            caption: message,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{
                    text: '✅ Agregar ahora',
                    callback_data: `solicitud_${tmdbId}`
                }]]
            }
        });
        res.status(200).json({ message: 'Solicitud enviada al administrador.' });
    } catch (error) {
        console.error("Error al enviar notificación a Telegram:", error);
        res.status(500).json({ error: 'Error al enviar la notificación al bot.' });
    }
});

// -----------------------------------------------------------
// === ENDPOINT DE VIDEO MODIFICADO ===
// -----------------------------------------------------------

app.get('/api/get-embed-code', async (req, res) => {
  const { id, season, episode, isPro } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "ID de la película o serie no proporcionado" });
  }

  try {
    const mediaType = season && episode ? 'series' : 'movies';
    const docRef = db.collection(mediaType).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: `${mediaType} no encontrada` });
    }

    const data = doc.data();

    // LÓGICA SEPARADA PARA MANEJAR USUARIOS PRO Y GRATUITOS
    if (isPro === 'true') {
        let embedCode = mediaType === 'movies' ? data.proEmbedCode : data.seasons?.[season]?.episodes?.[episode]?.proEmbedCode;

        if (embedCode) {
            try {
                const embedUrl = new URL(embedCode);
                
                // Luego extrae el código de archivo único
                const fileCode = embedUrl.pathname.split('/').pop().split('-')[1].replace('.html', '');
                
                const apiUrl = `https://goodstream.one/api/file/direct_link?key=${GODSTREAM_API_KEY}&file_code=${fileCode}`;

                const godstreamResponse = await axios.get(apiUrl);
                const godstreamData = godstreamResponse.data;

                // <--- LÓGICA MEJORADA DE MANEJO DE ERRORES --->
                if (godstreamData.estado === 200 && godstreamData.resultado && godstreamData.resultado.versiones && godstreamData.resultado.versiones.length > 0) {
                    const videoUrl = godstreamData.resultado.versiones[0].url;
                    return res.status(200).json({
                        directLink: videoUrl
                    });
                } else {
                    // Loguea la respuesta completa para que puedas ver el error
                    console.error("Error al obtener el enlace directo de GoodStream. Respuesta de la API:", godstreamData);
                    // Retorna un error, ya que no se pudo obtener el enlace directo.
                    return res.status(500).json({
                        error: "No se pudo obtener el enlace directo de GoodStream. Por favor, revisa el log de tu servidor."
                    });
                }
            } catch (apiError) {
                // Captura el error de la llamada a la API (por ejemplo, si la URL no existe)
                console.error("Error al obtener enlace directo de GodStream:", apiError);
                return res.status(500).json({
                    error: "Error al obtener enlace directo de GoodStream. Detalles: " + apiError.message
                });
            }
        } else {
            // Si no hay código de inserción PRO, devolvemos un 404
            return res.status(404).json({ error: 'No se encontró código de reproductor PRO para este contenido.' });
        }
    }

    // Lógica para usuarios GRATUITOS (o si la lógica PRO no encontró un enlace)
    let embedCode = mediaType === 'movies' ? data.freeEmbedCode : data.seasons?.[season]?.episodes?.[episode]?.freeEmbedCode;
    
    if (embedCode) {
        return res.json({ embedCode });
    } else {
        return res.status(404).json({ error: `No se encontró código de reproductor para este contenido.` });
    }

  } catch (error) {
    console.error("Error general al obtener el código embed:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.post('/add-movie', async (req, res) => {
    try {
        const { tmdbId, title, poster_path, freeEmbedCode, proEmbedCode, isPremium } = req.body;
        
        // Verificar si el tmdbId es válido antes de intentar guardar
        if (!tmdbId) {
            console.error("Error: Intentando guardar película sin tmdbId.");
            return res.status(400).json({ error: 'tmdbId es requerido para guardar la película.' });
        }

        // Verificar si la película ya existe
        const movieRef = db.collection('movies').doc(tmdbId.toString());
        const movieDoc = await movieRef.get();

        let movieDataToSave = {};

        if (movieDoc.exists) {
            const existingData = movieDoc.data();
            // Lógica para no sobreescribir si el código es nulo
            movieDataToSave = {
                ...existingData,
                title: title,
                poster_path: poster_path,
                freeEmbedCode: freeEmbedCode !== undefined ? freeEmbedCode : existingData.freeEmbedCode,
                proEmbedCode: proEmbedCode !== undefined ? proEmbedCode : existingData.proEmbedCode,
                // Si se envía como GRATIS, se sobreescribe isPremium a false. Si se envía como PRO, se sobreesscribe a true.
                isPremium: isPremium
            };
        } else {
            // Si la película no existe, la creamos
            movieDataToSave = {
                tmdbId,
                title,
                poster_path,
                freeEmbedCode, 
                proEmbedCode,
                isPremium
            };
        }
        await movieRef.set(movieDataToSave);
        res.status(200).json({ message: 'Película agregada/actualizada en la base de datos.' });

    } catch (error) {
        console.error("Error al agregar/actualizar película en Firestore:", error);
        res.status(500).json({ error: 'Error al agregar/actualizar la película en la base de datos.' });
    }
});

app.post('/add-series-episode', async (req, res) => {
    try {
        const { tmdbId, title, poster_path, seasonNumber, episodeNumber, freeEmbedCode, proEmbedCode, isPremium } = req.body;

        const seriesRef = db.collection('series').doc(tmdbId.toString());
        const seriesDoc = await seriesRef.get();

        let seriesDataToSave = {};

        if (seriesDoc.exists) {
            const existingData = seriesDoc.data();
            const existingEpisode = existingData.seasons?.[seasonNumber]?.episodes?.[episodeNumber] || {};
            
            const newEpisodeData = {
                freeEmbedCode: freeEmbedCode !== undefined ? freeEmbedCode : existingEpisode.freeEmbedCode,
                proEmbedCode: proEmbedCode !== undefined ? proEmbedCode : existingEpisode.proEmbedCode
            };
            
            seriesDataToSave = {
                ...existingData,
                title: title,
                poster_path: poster_path,
                isPremium: isPremium,
                seasons: {
                    ...existingData.seasons,
                    [seasonNumber]: {
                        episodes: {
                            ...(existingData.seasons?.[seasonNumber]?.episodes),
                            [episodeNumber]: newEpisodeData
                        }
                    }
                }
            };
        } else {
            seriesDataToSave = {
                tmdbId,
                title,
                poster_path,
                isPremium,
                seasons: {
                    [seasonNumber]: {
                        episodes: {
                            [episodeNumber]: { freeEmbedCode, proEmbedCode }
                        }
                    }
                }
            };
        }
        await seriesRef.set(seriesDataToSave);
        res.status(200).json({ message: `Episodio ${episodeNumber} de la temporada ${seasonNumber} agregado/actualizado en la base de datos.` });
    } catch (error) {
        console.error("Error al agregar/actualizar episodio de serie en Firestore:", error);
        res.status(500).json({ error: 'Error al agregar/actualizar el episodio de la serie en la base de datos.' });
    }
});

// === MODIFICADO: Envía el userId a PayPal ===
app.post('/create-paypal-payment', (req, res) => {
    const plan = req.body.plan;
    const amount = (plan === 'annual') ? '19.99' : '1.99';
    const userId = req.body.userId; // NUEVO: Capturamos el ID de Firebase

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${RENDER_BACKEND_URL}/paypal/success`,
            "cancel_url": `${RENDER_BACKEND_URL}/paypal/cancel`
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "description": `Suscripción al plan ${plan} de Sala Cine`,
            "invoice_number": userId // NUEVO: Lo pasamos a PayPal para recuperarlo luego
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error("Error de PayPal:", error.response);
            res.status(500).json({ error: "Error al crear el pago con PayPal. Revisa los logs de tu servidor para más detalles." });
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ approval_url: payment.links[i].href });
                    return;
                }
            }
            res.status(500).json({ error: "URL de aprobación de PayPal no encontrada." });
        }
    });
});

// === CRÍTICO MODIFICADO: Ejecuta el pago y activa el Premium ===
app.get('/paypal/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    
    // 1. Ejecutar la transacción (Capturar el dinero)
    paypal.payment.execute(paymentId, { "payer_id": payerId }, async function (error, payment) {
        if (error) {
            console.error("Error al ejecutar el pago:", error.response);
            // Mensaje de error visible para el usuario
            return res.send('<html><body><h1>❌ ERROR: El pago no pudo ser procesado.</h1><p>Por favor, contacta con soporte con tu ID de transacción.</p></body></html>');
        }

        // 2. Verificar el estado y obtener el ID de usuario
        if (payment.state === 'approved' || payment.state === 'completed') {
            // El invoice_number contiene el ID de usuario de Firebase
            const userId = payment.transactions[0].invoice_number; 
            
            if (userId) {
                try {
                    // 3. Activar la cuenta Premium en Firebase
                    const userDocRef = db.collection('users').doc(userId);
                    // Usar set con merge: true para crear el documento si no existe, o actualizar si existe
                    await userDocRef.set({ isPro: true }, { merge: true });
                    
                    // Notificar al usuario que regrese a la app
                    res.send('<html><body><h1>✅ ¡Pago Exitoso! Cuenta Premium Activada.</h1><p>Vuelve a la aplicación para disfrutar de tu contenido PRO.</p></body></html>');
                } catch (dbError) {
                    console.error("Error al actualizar la base de datos de Firebase:", dbError);
                    // El pago se ejecutó, pero la base de datos falló (necesita revisión manual)
                    res.send('<html><body><h1>⚠️ Advertencia: Pago recibido, pero la cuenta Premium no se activó automáticamente.</h1><p>Por favor, contacta con soporte con el ID de transacción: ' + paymentId + '</p></body></html>');
                }
            } else {
                // El pago se ejecutó, pero el ID de usuario no fue guardado en la transacción
                 res.send('<html><body><h1>✅ ¡Pago Exitoso! Contacta a soporte para activar tu Premium</h1><p>Vuelve a la aplicación y contacta a soporte con tu ID de transacción: ' + paymentId + '</p></body></html>');
            }
        } else {
            // Estado no aprobado (puede ser "pendiente", "fallido", etc.)
            res.send('<html><body><h1>❌ ERROR: El pago no fue aprobado.</h1><p>Estado del pago: ' + payment.state + '</p></body></html>');
        }
    });
});

app.get('/paypal/cancel', (req, res) => {
    res.send('<html><body><h1>Pago con PayPal cancelado.</h1></body></html>');
});

app.post('/create-binance-payment', (req, res) => {
    res.json({ message: 'Pago con Binance simulado. Lógica de backend real necesaria.' });
});

// -----------------------------------------------------------
// === INICIO DE NUEVAS FUNCIONES Y ENDPOINT DE NOTIFICACIÓN PUSH ===
// -----------------------------------------------------------

// Función para buscar tokens y enviar notificación push con Firebase Cloud Messaging (FCM)
async function sendPushNotification(tmdbId, mediaType, contentTitle) {
    try {
        // Seleccionamos todos los usuarios que tienen un token FCM
        const tokensSnapshot = await db.collection('users').select('fcmToken').get();
        const registrationTokens = tokensSnapshot.docs
            .map(doc => doc.data().fcmToken)
            .filter(token => token); // Filtrar tokens nulos o vacíos

        if (registrationTokens.length === 0) {
            console.log("No se encontraron tokens FCM para enviar notificaciones.");
            return { success: true, message: "No hay tokens de dispositivos registrados." };
        }

        const message = {
            notification: {
                title: `🎉 ¡Nuevo Contenido Agregado!`,
                body: `¡Ya puedes ver ${contentTitle} en Sala Cine!`,
            },
            data: {
                // CRÍTICO: Enviamos el ID para que MyFirebaseMessagingService sepa dónde redirigir
                tmdbId: tmdbId.toString(), 
                mediaType: mediaType,
                action: 'open_content' 
            },
            tokens: registrationTokens // Envía a la lista de tokens
        };

        // Envía el mensaje a todos los tokens
        const response = await messaging.sendEachForMulticast(message);

        console.log('Notificación FCM enviada con éxito:', response.successCount);
        return { success: true, response: response };

    } catch (error) {
        console.error("Error al enviar notificación FCM:", error);
        return { success: false, error: error.message };
    }
}

// ENDPOINT DEDICADO: POST /api/notify
// Este es llamado por el bot de Telegram para enviar la notificación
app.post('/api/notify', async (req, res) => {
    const { tmdbId, mediaType, title } = req.body;
    
    if (!tmdbId || !mediaType || !title) {
        return res.status(400).json({ error: "Faltan parámetros: tmdbId, mediaType, o title." });
    }
    
    try {
        const result = await sendPushNotification(tmdbId, mediaType, title);
        
        if (result.success) {
            res.status(200).json({ message: 'Notificaciones push programadas para envío.', details: result.response });
        } else {
            res.status(500).json({ error: 'Error al enviar notificaciones push.', details: result.error });
        }
    } catch (error) {
        console.error("Error en el endpoint /api/notify:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar la notificación." });
    }
});

// -----------------------------------------------------------
// === FIN DE NUEVAS FUNCIONES Y ENDPOINT DE NOTIFICACIÓN PUSH ===
// -----------------------------------------------------------


// -----------------------------------------------------------
// === NUEVAS FUNCIONES PARA EL FLUJO DE PUBLICACIÓN EN CANALES ===
// -----------------------------------------------------------
/*
 * Nuevas variables de entorno requeridas:
 * - TELEGRAM_CHANNEL_A_ID: ID/username del canal principal público.
 * - TELEGRAM_CHANNEL_B_ID: ID/username del canal de la comunidad.
 * - TELEGRAM_BOT_USERNAME: Nombre de usuario de tu bot.
 * - COOLDOWN_REPUBLISH_DAYS: Número de días de espera para republicar una película.
 */
const TELEGRAM_CHANNEL_A_ID = process.env.TELEGRAM_CHANNEL_A_ID;
const TELEGRAM_CHANNEL_B_ID = process.env.TELEGRAM_CHANNEL_B_ID;
const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;
const COOLDOWN_REPUBLISH_DAYS = parseInt(process.env.COOLDOWN_REPUBLISH_DAYS, 10) || 30;

/**
 * Publica un post en el canal de la comunidad (Canal B) con un enlace al post original.
 * @param {string} permalink El enlace permanente al post en el canal A.
 * @param {object} mediaData Los datos de la película o serie para el post.
 * @param {string} mediaType Tipo de contenido ('movie' o 'series').
 * @param {string} contentTitle El título del contenido para el mensaje.
 */
async function publishToCommunityChannel(permalink, mediaData, mediaType, contentTitle) {
    try {
        const posterUrl = mediaData.poster_path ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
        const description = (mediaType === 'movie') 
            ? `🎥 ¡Nueva película agregada! Haz clic para verla en Sala Cine.`
            : `📺 ¡Nuevo episodio agregado! Haz clic para ver los detalles.`;

        const options = {
            caption: `**¡Nuevo en Sala Cine!**\n\n${description}\n\n*${contentTitle}*`,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '▶️ ver ahora ', url: permalink }]
                ]
            }
        };

        await bot.sendPhoto(TELEGRAM_CHANNEL_B_ID, posterUrl, options);
    } catch (error) {
        console.error('Error al publicar en el canal de la comunidad:', error.message);
        bot.sendMessage(ADMIN_CHAT_ID, `⚠️ Error al publicar el post de ${contentTitle} en el canal de la comunidad. Revisa los logs.`);
    }
}

/**
 * Encapsula el flujo completo de publicación:
 * 1. Publica en el canal principal (A).
 * 2. Obtiene el enlace permanente.
 * 3. Publica en el canal de la comunidad (B) con el enlace.
 * @param {object} movieData Los datos de la película a publicar.
 */
async function publishMovieToChannels(movieData) {
    const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
    const caption = `🎬 **${movieData.title}**\n\n` +
                    `${movieData.overview || 'Sin sinopsis disponible.'}\n\n` +
                    `⭐ ${movieData.isPremium ? 'Contenido PRO' : 'Contenido GRATIS/PRO'}`;

    const tmeDeepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}/?startapp=${movieData.tmdbId}`;
    const appDeepLinkFallback = `${RENDER_BACKEND_URL}/app/details/${movieData.tmdbId}`;

   const options = {
    caption: caption,
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: '🤖 Ver ahora (Android)', url: appDeepLinkFallback }],
            [{ text: '🍎 Ver ahora (iPhone)', url: tmeDeepLink }]
        ]
    }
};
    try {
        const sentMessage = await bot.sendPhoto(TELEGRAM_CHANNEL_A_ID, posterUrl, options);
        
        // Obtener el permalink del mensaje recién publicado
        const channelUsername = TELEGRAM_CHANNEL_A_ID.startsWith('@') ? TELEGRAM_CHANNEL_A_ID.substring(1) : TELEGRAM_CHANNEL_A_ID;
        const permalink = `https://t.me/${channelUsername}/${sentMessage.message_id}`;
        
        // **CRÍTICO: Añadido un retraso de 10 segundos antes de publicar en el canal de la comunidad.**
        setTimeout(async () => {
            await publishToCommunityChannel(permalink, movieData, 'movie', movieData.title);
        }, 10000); // 10,000 milisegundos = 10 segundos

        return { success: true };
    } catch (error) {
        console.error('Error al publicar película en canales:', error.message);
        bot.sendMessage(ADMIN_CHAT_ID, `⚠️ Error al publicar la película *${movieData.title}* en el canal principal. Revisa los logs.`);
        return { success: false, error: error.message };
    }
}

/**
 * Encapsula el flujo completo de publicación de un episodio de serie.
 * 1. Publica en el canal principal (A).
 * 2. Obtiene el enlace permanente.
 * 3. Publica en el canal de la comunidad (B) con el enlace.
 * @param {object} seriesData Los datos de la serie a publicar.
 */
async function publishSeriesEpisodeToChannels(seriesData) {
    const posterUrl = seriesData.poster_path ? `https://image.tmdb.org/t/p/w500${seriesData.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
    const contentTitle = seriesData.title + ` - T${seriesData.seasonNumber} E${seriesData.episodeNumber}`;
    const caption = `🆕 **¡Nuevo Episodio!**\n\n` +
                    `🎬 **${contentTitle}**\n\n` +
                    `📺 ${seriesData.overview || 'Sin sinopsis disponible.'}\n\n` +
                    `⭐ ${seriesData.isPremium ? 'Contenido PRO' : 'Contenido GRATIS/PRO'}`;

    const tmeDeepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}/?startapp=${seriesData.tmdbId}`;
    const appDeepLinkFallback = `${RENDER_BACKEND_URL}/app/details/${seriesData.tmdbId}`;

    const options = {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '▶️ Ver ahora', url: tmeDeepLink }],
                [{ text: '📱 Ver en el celular (Android)', url: appDeepLinkFallback }]
            ]
        }
    };

    try {
        const sentMessage = await bot.sendPhoto(TELEGRAM_CHANNEL_A_ID, posterUrl, options);

        // Obtener el permalink del mensaje recién publicado
        const channelUsername = TELEGRAM_CHANNEL_A_ID.startsWith('@') ? TELEGRAM_CHANNEL_A_ID.substring(1) : TELEGRAM_CHANNEL_A_ID;
        const permalink = `https://t.me/${channelUsername}/${sentMessage.message_id}`;

        // **CRÍTICO: Añadido un retraso de 10 segundos antes de publicar en el canal de la comunidad.**
        setTimeout(async () => {
            await publishToCommunityChannel(permalink, seriesData, 'series', contentTitle);
        }, 10000); // 10,000 milisegundos = 10 segundos

        return { success: true };
    } catch (error) {
        console.error('Error al publicar episodio en canales:', error.message);
        bot.sendMessage(ADMIN_CHAT_ID, `⚠️ Error al publicar el episodio *${contentTitle}* en el canal principal. Revisa los logs.`);
        return { success: false, error: error.message };
    }
}

// -----------------------------------------------------------
// === FIN DE NUEVAS FUNCIONES PARA EL FLUJO DE PUBLICACIÓN EN CANALES ===
// -----------------------------------------------------------


// === LÓGICA DEL BOT DE TELEGRAM ===
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== ADMIN_CHAT_ID) {
        bot.sendMessage(chatId, 'Lo siento, no tienes permiso para usar este bot.');
        return;
    }
    adminState[chatId] = { step: 'menu' };
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Agregar películas', callback_data: 'add_movie' }],
                [{ text: 'Agregar series', callback_data: 'add_series' }],
                [{ text: 'Eventos', callback_data: 'eventos' }], // MODIFICADO: Carrusel -> Eventos
                [{ text: 'Gestionar películas', callback_data: 'manage_movies' }],
                [{ text: 'Eliminar película', callback_data: 'delete_movie' }]
            ]
        }
    };
    bot.sendMessage(chatId, '¡Hola! ¿Qué quieres hacer hoy?', options);
});

bot.onText(/\/subir/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== ADMIN_CHAT_ID) return;
    adminState[chatId] = { step: 'menu' };
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Agregar películas', callback_data: 'add_movie' }],
                [{ text: 'Agregar series', callback_data: 'add_series' }],
                [{ text: 'Eventos', callback_data: 'eventos' }], // MODIFICADO: Carrusel -> Eventos
                [{ text: 'Gestionar películas', callback_data: 'manage_movies' }],
                [{ text: 'Eliminar película', callback_data: 'delete_movie' }]
            ]
        }
    };
    bot.sendMessage(chatId, '¡Hola! ¿Qué quieres hacer hoy?', options);
});

bot.onText(/\/editar/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== ADMIN_CHAT_ID) return;
    adminState[chatId] = { step: 'search_edit', mediaType: 'movie' };
    bot.sendMessage(chatId, 'Por favor, escribe el nombre de la película o serie que quieres editar.');
});

bot.onText(/\/pedidos/, async (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== ADMIN_CHAT_ID) return;
    try {
        const requestsRef = db.collection('requests');
        const snapshot = await requestsRef.get();
        if (snapshot.empty) {
            return bot.sendMessage(chatId, 'No hay solicitudes pendientes en este momento.');
        }
        let message = '📋 *Solicitudes de Películas:*\n\n';
        snapshot.forEach(doc => {
            const data = doc.data();
            message += `🎬 ${data.movieTitle}\n_Solicitado por: ${data.userName || 'Anónimo'} el ${data.requestedAt.toDate().toLocaleDateString()}_\n\n`;
        });
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error("Error fetching requests:", error);
        bot.sendMessage(chatId, 'Hubo un error al obtener las solicitudes.');
    }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;
    if (chatId !== ADMIN_CHAT_ID || userText.startsWith('/')) {
        return;
    }

    if (adminState[chatId] && adminState[chatId].step === 'search_movie') {
        try {
            const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(userText)}&language=es-ES`;
            const response = await axios.get(searchUrl);
            const data = response.data;
            if (data.results && data.results.length > 0) {
                const results = data.results.slice(0, 5);
                
                for (const item of results) {
                    const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
                    const title = item.title || item.name;
                    const date = item.release_date || item.first_air_date;
                    const message = `🎬 *${title}* (${date ? date.substring(0, 4) : 'N/A'})\n\n${item.overview || 'Sin sinopsis disponible.'}`;
                    
                    const docRef = db.collection('movies').doc(item.id.toString());
                    const doc = await docRef.get();
                    const existingData = doc.exists ? doc.data() : null;
                    
                    let buttons = [];
                    if (existingData) {
                        buttons.push([{ text: '✅ Gestionar', callback_data: `manage_movie_${item.id}` }]);
                    } else {
                         buttons.push([{ text: '✅ Agregar', callback_data: `add_new_movie_${item.id}` }]);
                    }
                    
                    const options = {
                        caption: message,
                        parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: buttons }
                    };
                    bot.sendPhoto(chatId, posterUrl, options);
                }
            } else {
                bot.sendMessage(chatId, `No se encontraron resultados para tu búsqueda. Intenta de nuevo.`);
            }
        } catch (error) {
            console.error("Error al buscar en TMDB:", error);
            bot.sendMessage(chatId, 'Hubo un error al buscar el contenido. Intenta de nuevo.');
        }
    } else if (adminState[chatId] && adminState[chatId].step === 'search_series') {
        try {
            const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(userText)}&language=es-ES`;
            const response = await axios.get(searchUrl);
            const data = response.data;
            if (data.results && data.results.length > 0) {
                const results = data.results.slice(0, 5);
                
                for (const item of results) {
                    const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
                    const title = item.title || item.name;
                    const date = item.first_air_date;
                    const message = `🎬 *${title}* (${date ? date.substring(0, 4) : 'N/A'})\n\n${item.overview || 'Sin sinopsis disponible.'}`;
                    
                    const docRef = db.collection('series').doc(item.id.toString());
                    const doc = await docRef.get();
                    const existingData = doc.exists ? doc.data() : null;

                    let buttons = [];
                    if (existingData) {
                        buttons.push([{ text: '✅ Gestionar', callback_data: `manage_series_${item.id}` }]);
                    } else {
                        buttons.push([{ text: '✅ Agregar', callback_data: `add_new_series_${item.id}` }]);
                    }

                    const options = {
                        caption: message,
                        parse_mode: 'Markdown',
                        reply_markup: { inline_keyboard: buttons }
                    };
                    bot.sendPhoto(chatId, posterUrl, options);
                }
            } else {
                bot.sendMessage(chatId, `No se encontraron resultados para tu búsqueda. Intenta de nuevo.`);
            }
        } catch (error) {
            console.error("Error al buscar en TMDB:", error);
            bot.sendMessage(chatId, 'Hubo un error al buscar el contenido. Intenta de nuevo.');
        }
    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_event_image') {
        if (!userText.startsWith('http')) {
            bot.sendMessage(chatId, '❌ Por favor, envía un ENLACE (URL) de imagen válido.');
            return;
        }
        adminState[chatId].imageUrl = userText;
        adminState[chatId].step = 'awaiting_event_description';
        bot.sendMessage(chatId, '¡Enlace de la fotografía recibido! Ahora, envía la DESCRIPCIÓN del evento.');

    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_event_description') {
        const { imageUrl } = adminState[chatId];
        const description = userText;
        
        try {
            await db.collection('userNotifications').add({
                title: '🎉 Nuevo Evento Publicado',
                description: description,
                image: imageUrl,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                isRead: false,
                type: 'event', 
                targetScreen: 'profile-screen'
            });

            bot.sendMessage(chatId, '✅ Evento guardado con éxito y listo para notificar a los usuarios de la aplicación.');

        } catch (error) {
            console.error("Error al guardar evento en Firestore:", error);
            bot.sendMessage(chatId, '❌ Hubo un error al guardar el evento. Revisa los logs de Firebase.');
        } finally {
            adminState[chatId] = { step: 'menu' };
        }

    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_pro_link_movie') {
        const { selectedMedia } = adminState[chatId];
        adminState[chatId].proEmbedCode = userText;
        adminState[chatId].step = 'awaiting_free_link_movie';
        bot.sendMessage(chatId, `¡Reproductor PRO recibido! Ahora, envía el reproductor GRATIS para "${selectedMedia.title}". Si no hay, escribe "no".`);
    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_free_link_movie') {
        const { selectedMedia, proEmbedCode } = adminState[chatId];
        
        if (!selectedMedia || !selectedMedia.id) {
            bot.sendMessage(chatId, '❌ ERROR CRÍTICO: El ID de la película se perdió. Reinicia el proceso de subir la película con /subir.');
            adminState[chatId] = { step: 'menu' };
            return;
        }

        const freeEmbedCode = userText !== 'no' ? userText : null;

        adminState[chatId].movieDataToSave = {
            tmdbId: selectedMedia.id.toString(), 
            title: selectedMedia.title,
            overview: selectedMedia.overview,
            poster_path: selectedMedia.poster_path,
            proEmbedCode: proEmbedCode,
            freeEmbedCode: freeEmbedCode,
            isPremium: !!proEmbedCode && !freeEmbedCode
        };

        adminState[chatId].step = 'awaiting_publish_choice';
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💾 Guardar solo en la app', callback_data: `save_only_${selectedMedia.id}` }],
                    [{ text: '🚀 Guardar y publicar en el canal', callback_data: `save_and_publish_${selectedMedia.id}` }]
                ]
            }
        };
        bot.sendMessage(chatId, `¡Reproductor GRATIS recibido! ¿Qué quieres hacer ahora?`, options);
    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_pro_link_series') {
        if (!adminState[chatId].selectedSeries) {
            bot.sendMessage(chatId, 'Error: El estado de la serie se ha perdido. Por favor, reinicia el proceso.');
            adminState[chatId] = { step: 'menu' };
            return;
        }

        const { selectedSeries, season, episode } = adminState[chatId];
        adminState[chatId].proEmbedCode = userText;
        adminState[chatId].step = 'awaiting_free_link_series';
        bot.sendMessage(chatId, `¡Reproductor PRO recibido! Ahora, envía el reproductor GRATIS para el episodio ${episode} de la temporada ${season}. Si no hay, escribe "no".`);
    } else if (adminState[chatId] && adminState[chatId].step === 'awaiting_free_link_series') {
        if (!adminState[chatId].selectedSeries) {
            bot.sendMessage(chatId, 'Error: El estado de la serie se ha perdido. Por favor, reinicia el proceso.');
            adminState[chatId] = { step: 'menu' };
            return;
        }

        const { selectedSeries, season, episode, proEmbedCode } = adminState[chatId];
        const freeEmbedCode = userText !== 'no' ? userText : null;
        
        const seriesDataToSave = {
            tmdbId: selectedSeries.tmdbId || selectedSeries.id, 
            title: selectedSeries.title || selectedSeries.name,
            poster_path: selectedSeries.poster_path,
            seasonNumber: season,
            episodeNumber: episode,
            proEmbedCode: proEmbedCode,
            freeEmbedCode: freeEmbedCode,
            isPremium: !!proEmbedCode && !freeEmbedCode
        };

        try {
            await axios.post(`${RENDER_BACKEND_URL}/add-series-episode`, seriesDataToSave);
            bot.sendMessage(chatId, `✅ Episodio ${episode} de la temporada ${season} guardado con éxito en la app.`);
            
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '➡️ Agregar Siguiente Episodio', callback_data: `add_next_episode_${seriesDataToSave.tmdbId}_${seriesDataToSave.seasonNumber}` }],
                        [{ text: '✅ Publicar en el canal y finalizar', callback_data: `save_and_publish_series_${seriesDataToSave.tmdbId}` }],
                        [{ text: '✅ Finalizar', callback_data: `finish_series_${seriesDataToSave.tmdbId}` }]
                    ]
                }
            };

            bot.sendMessage(chatId, '¿Qué quieres hacer ahora?', options);
            adminState[chatId] = { step: 'awaiting_series_action' };
        } catch (error) {
            console.error("Error al guardar el episodio:", error);
            bot.sendMessage(chatId, 'Hubo un error al guardar el episodio.');
        } finally {
        }
    } else if (adminState[chatId] && adminState[chatId].step === 'search_delete') {
          try {
            const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(userText)}&language=es-ES`;
            const response = await axios.get(searchUrl);
            const data = response.data;
            if (data.results && data.results.length > 0) {
                const results = data.results.slice(0, 5).filter(m => m.media_type === 'movie' || m.media_type === 'tv');
                
                for (const item of results) {
                    const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
                    const title = item.title || item.name;
                    const date = item.release_date || item.first_air_date;
                    const message = `🎬 *${title}* (${date ? date.substring(0, 4) : 'N/A'})\n\n${item.overview || 'Sin sinopsis disponible.'}`;
                    const options = {
                        caption: message,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [[{
                                text: '🗑️ Eliminar',
                                callback_data: `delete_select_${item.id}_${item.media_type}`
                            }]]
                        }
                    };
                    bot.sendPhoto(chatId, posterUrl, options);
                }
            } else {
                bot.sendMessage(chatId, `No se encontraron resultados para tu búsqueda. Intenta de nuevo.`);
            }
        } catch (error) {
            console.error("Error al buscar en TMDB:", error);
            bot.sendMessage(chatId, 'Hubo un error al buscar el contenido. Intenta de nuevo.');
        }
    }
});

bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg.chat.id;
    if (chatId !== ADMIN_CHAT_ID) return;

    if (data === 'add_movie') {
        adminState[chatId] = { step: 'search_movie' };
        bot.sendMessage(chatId, 'Por favor, escribe el nombre de la película que quieres agregar.');
    } else if (data === 'add_series') {
        adminState[chatId] = { step: 'search_series' };
        bot.sendMessage(chatId, 'Por favor, escribe el nombre de la serie que quieres agregar.');
    } else if (data === 'eventos') {
        adminState[chatId] = { step: 'awaiting_event_image' };
        bot.sendMessage(chatId, 'Perfecto, vamos a crear un evento. Primero, envía el ENLACE (URL) de la fotografía para el evento.');
    } else if (data.startsWith('add_new_movie_')) {
        const tmdbId = data.replace('add_new_movie_', '');
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
            const response = await axios.get(tmdbUrl);
            const mediaData = response.data;
            adminState[chatId] = { selectedMedia: mediaData, mediaType: 'movie', step: 'awaiting_pro_link_movie' };
            bot.sendMessage(chatId, `Seleccionaste "${mediaData.title}". Envía el reproductor PRO. Si no hay, escribe "no".`);
        } catch (error) {
            console.error("Error al obtener datos de TMDB:", error);
            bot.sendMessage(chatId, 'Hubo un error al obtener la información. Por favor, intenta la búsqueda de nuevo.');
        }
    } else if (data.startsWith('add_new_series_')) {
        const tmdbId = data.replace('add_new_series_', '');
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
            const response = await axios.get(tmdbUrl);
            const mediaData = response.data;
            adminState[chatId] = { selectedSeries: mediaData, mediaType: 'series', step: 'awaiting_season_selection' };
            
            const seasons = mediaData.seasons;
            if (seasons && seasons.length > 0) {
                const buttons = seasons.map(s => [{
                    text: `Temporada ${s.season_number}`,
                    callback_data: `select_season_${tmdbId}_${s.season_number}`
                }]);
                bot.sendMessage(chatId, `Seleccionaste "${mediaData.name}". Por favor, selecciona la temporada que quieres agregar:`, {
                    reply_markup: { inline_keyboard: buttons }
                });
            } else {
                bot.sendMessage(chatId, `No se encontraron temporadas para esta serie. Intenta con otra.`);
                adminState[chatId] = { step: 'menu' };
            }

        } catch (error) {
            console.error("Error al obtener datos de TMDB:", error);
            bot.sendMessage(chatId, 'Hubo un error al obtener la información. Por favor, intenta la búsqueda de nuevo.');
        }
    } else if (data.startsWith('manage_movie_')) {
        const tmdbId = data.replace('manage_movie_', '');
        const docRef = db.collection('movies').doc(tmdbId);
        const doc = await docRef.get();
        const existingData = doc.exists ? doc.data() : null;

        if (!existingData) {
            bot.sendMessage(chatId, 'Error: Película no encontrada en la base de datos.');
            return;
        }
        
        let buttons = [];
        if (!existingData.proEmbedCode) {
            buttons.push([{ text: 'Agregar PRO', callback_data: `add_pro_movie_${tmdbId}` }]);
        }
        if (!existingData.freeEmbedCode) {
            buttons.push([{ text: 'Agregar Gratis', callback_data: `add_free_movie_${tmdbId}` }]);
        }

        const options = {
            reply_markup: {
                inline_keyboard: buttons
            }
        };
        bot.sendMessage(chatId, `Gestionando "${existingData.title}". ¿Qué versión quieres agregar?`, options);
    } else if (data.startsWith('manage_series_')) {
        const tmdbId = data.replace('manage_series_', '');
        const seriesRef = db.collection('series').doc(tmdbId);
        const seriesDoc = await seriesRef.get();
        const seriesData = seriesDoc.exists ? seriesDoc.data() : null;
        
        if (!seriesData) {
            bot.sendMessage(chatId, 'Error: Serie no encontrada en la base de datos.');
            return;
        }

        let buttons = [];
        if (seriesData.seasons) {
            for (const seasonNumber in seriesData.seasons) {
                buttons.push([{
                    text: `Gestionar Temporada ${seasonNumber}`,
                    callback_data: `manage_season_${tmdbId}_${seasonNumber}`
                }]);
            }
        }
        
        buttons.push([{
            text: `Añadir nueva temporada`,
            callback_data: `add_new_season_${tmdbId}`
        }]);

        const options = {
            reply_markup: {
                inline_keyboard: buttons
            },
            parse_mode: 'Markdown'
        };
        bot.sendMessage(chatId, `Gestionando "${seriesData.title || seriesData.name}". Selecciona una temporada:`, options);

    } else if (data.startsWith('add_pro_movie_')) {
        const tmdbId = data.replace('add_pro_movie_', '');
        const docRef = db.collection('movies').doc(tmdbId);
        const doc = await docRef.get();
        const existingData = doc.data();
        adminState[chatId] = { selectedMedia: existingData, mediaType: 'movie', freeEmbedCode: existingData.freeEmbedCode };
        adminState[chatId].step = 'awaiting_pro_link_movie';
        bot.sendMessage(chatId, `Envía el reproductor PRO para "${existingData.title}".`);
    } else if (data.startsWith('add_free_movie_')) {
        const tmdbId = data.replace('add_free_movie_', '');
        const docRef = db.collection('movies').doc(tmdbId);
        const doc = await docRef.get();
        const existingData = doc.data();
        adminState[chatId] = { selectedMedia: existingData, mediaType: 'movie', proEmbedCode: existingData.proEmbedCode };
        adminState[chatId].step = 'awaiting_free_link_movie';
        bot.sendMessage(chatId, `Envía el reproductor GRATIS para "${existingData.title}".`);
    } else if (data.startsWith('add_episode_series_')) {
        const tmdbId = data.replace('add_episode_series_', '');
        const seriesRef = db.collection('series').doc(tmdbId);
        const seriesDoc = await seriesRef.get();
        const seriesData = seriesDoc.exists ? seriesDoc.data() : null;
        
        if (!seriesData) {
            bot.sendMessage(chatId, 'Error: Serie no encontrada en la base de datos.');
            return;
        }

        let lastEpisode = 0;
        if (seriesData.seasons && seriesData.seasons[1] && seriesData.seasons[1].episodes) {
            const episodes = seriesData.seasons[1].episodes;
            lastEpisode = Object.keys(episodes).length;
        }
        const nextEpisode = lastEpisode + 1;
        
        adminState[chatId] = { 
            step: 'awaiting_pro_link_series', 
            selectedSeries: seriesData, 
            season: 1, 
            episode: nextEpisode
        };
        bot.sendMessage(chatId, `Seleccionaste "${seriesData.title || seriesData.name}". Envía el reproductor PRO para el episodio ${nextEpisode} de la temporada 1. Si no hay, escribe "no".`);

    } else if (data.startsWith('add_next_episode_')) {
        const parts = data.split('_');
        const tmdbId = parts[3];
        const seasonNumber = parts[4];

        const seriesRef = db.collection('series').doc(tmdbId);
        const seriesDoc = await seriesRef.get();
        const seriesData = seriesDoc.exists ? seriesDoc.data() : null;

        if (!seriesData) {
            bot.sendMessage(chatId, 'Error: Serie no encontrada en la base de datos.');
            return;
        }
        
        let lastEpisode = 0;
        if (seriesData.seasons && seriesData.seasons[seasonNumber] && seriesData.seasons[seasonNumber].episodes) {
            const episodes = seriesData.seasons[seasonNumber].episodes;
            lastEpisode = Object.keys(episodes).length;
        }
        const nextEpisode = lastEpisode + 1;

        seriesData.tmdbId = tmdbId;

        adminState[chatId] = {
            step: 'awaiting_pro_link_series',
            selectedSeries: seriesData,
            season: parseInt(seasonNumber),
            episode: nextEpisode
        };
        bot.sendMessage(chatId, `Genial. Ahora, envía el reproductor PRO para el episodio ${nextEpisode} de la temporada ${seasonNumber}. Si no hay, escribe "no".`);

    } else if (data.startsWith('add_new_season_')) {
        const tmdbId = data.replace('add_new_season_', '');
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
            const response = await axios.get(tmdbUrl);
            const tmdbSeries = response.data;

            const seriesRef = db.collection('series').doc(tmdbId);
            const seriesDoc = await seriesRef.get();
            const existingSeasons = seriesDoc.exists && seriesDoc.data().seasons ? Object.keys(seriesDoc.data().seasons) : [];

            const availableSeasons = tmdbSeries.seasons.filter(s => !existingSeasons.includes(s.season_number.toString()));

            if (availableSeasons.length > 0) {
                const buttons = availableSeasons.map(s => [{
                    text: `Temporada ${s.season_number}`,
                    callback_data: `select_season_${tmdbId}_${s.season_number}`
                }]);
                bot.sendMessage(chatId, `Seleccionaste "${tmdbSeries.name}". ¿Qué temporada quieres agregar?`, {
                    reply_markup: { inline_keyboard: buttons }
                });
            } else {
                bot.sendMessage(chatId, 'Todas las temporadas de esta serie ya han sido agregadas.');
            }
        } catch (error) {
            console.error("Error al obtener datos de TMDB para nueva temporada:", error);
            bot.sendMessage(chatId, 'Hubo un error al obtener la información de las temporadas.');
        }

    } else if (data.startsWith('solicitud_')) {
        const tmdbId = data.replace('solicitud_', '');
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
            const response = await axios.get(tmdbUrl);
            const mediaData = response.data;
            adminState[chatId] = { selectedMedia: mediaData, mediaType: 'movie', step: 'awaiting_pro_link_movie' };
            bot.sendMessage(chatId, `Seleccionaste "${mediaData.title}". Envía el reproductor PRO. Si no hay, escribe "no".`);

            const requestsRef = db.collection('requests');
            const snapshot = await requestsRef.where('tmdbId', '==', tmdbId).get();
            snapshot.forEach(doc => {
                doc.ref.delete();
            });
        } catch (error) {
            console.error("Error al obtener datos de TMDB para solicitud:", error);
            bot.sendMessage(chatId, 'Hubo un error al obtener la información de la película. Intenta de nuevo.');
        }

    } else if (data === 'manage_movies') {
        adminState[chatId] = { step: 'search_manage' };
        bot.sendMessage(chatId, 'Por favor, escribe el nombre de la película o serie que quieres gestionar.');
    } else if (data.startsWith('delete_select_')) {
        const [_, __, tmdbId, mediaType] = data.split('_');
        bot.sendMessage(chatId, `La lógica para eliminar el contenido ${tmdbId} (${mediaType}) está lista para ser implementada.`);
    } else if (data === 'delete_movie') {
        adminState[chatId] = { step: 'search_delete' };
        bot.sendMessage(chatId, 'Por favor, escribe el nombre de la película o serie que quieres eliminar.');
    } else if (data === 'no_action') {
        bot.sendMessage(chatId, 'No se requiere ninguna acción para este contenido.');
    } else if (data.startsWith('select_season_')) {
        const [_, __, tmdbId, seasonNumber] = data.split('_'); 
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
            const response = await axios.get(tmdbUrl);
            const mediaData = response.data;
            
            mediaData.tmdbId = mediaData.id.toString();
            
            adminState[chatId] = { 
                step: 'awaiting_pro_link_series', 
                selectedSeries: mediaData, 
                season: parseInt(seasonNumber), 
                episode: 1
            };
            bot.sendMessage(chatId, `Perfecto, Temporada ${seasonNumber} seleccionada. Ahora, envía el reproductor PRO para el episodio 1. Si no hay, escribe "no".`);
        } catch (error) {
            console.error("Error al seleccionar temporada:", error);
            bot.sendMessage(chatId, 'Hubo un error al obtener la información de la temporada. Por favor, intenta de nuevo.');
        }
    } else if (data.startsWith('manage_season_')) {
        const [_, __, tmdbId, seasonNumber] = data.split('_');
        
        const seriesRef = db.collection('series').doc(tmdbId);
        const seriesDoc = await seriesRef.get();
        const selectedSeries = seriesDoc.exists ? seriesDoc.data() : null;
        
        if (!selectedSeries) {
             bot.sendMessage(chatId, 'Error: Serie no encontrada en la base de datos.');
             return;
        }

        let lastEpisode = 0;
        if (selectedSeries.seasons && selectedSeries.seasons[seasonNumber] && selectedSeries.seasons[seasonNumber].episodes) {
            const episodes = selectedSeries.seasons[seasonNumber].episodes;
            lastEpisode = Object.keys(episodes).length;
        }
        const nextEpisode = lastEpisode + 1;

        adminState[chatId] = {
            step: 'awaiting_pro_link_series',
            selectedSeries: selectedSeries, 
            season: parseInt(seasonNumber),
            episode: nextEpisode
        };
        bot.sendMessage(chatId, `Gestionando Temporada ${seasonNumber}. Envía el reproductor PRO para el episodio ${nextEpisode}. Si no hay, escribe "no".`);

    } else if (data.startsWith('save_only_')) {
        const { movieDataToSave } = adminState[chatId];
        try {
            if (!movieDataToSave || !movieDataToSave.tmdbId) {
                throw new Error("Datos de película incompletos o tmdbId faltante.");
            }
            await axios.post(`${RENDER_BACKEND_URL}/add-movie`, movieDataToSave);
            bot.sendMessage(chatId, `✅ Película "${movieDataToSave.title}" guardada con éxito en la app.`);
            adminState[chatId] = { step: 'menu' };
        } catch (error) {
            console.error("Error al guardar la película:", error);
            bot.sendMessage(chatId, 'Hubo un error al guardar la película.');
            adminState[chatId] = { step: 'menu' };
        }
    } else if (data.startsWith('save_and_publish_')) {
        const { movieDataToSave } = adminState[chatId];
        try {
            if (!movieDataToSave || !movieDataToSave.tmdbId) {
                throw new Error("Datos de película incompletos o tmdbId faltante.");
            }
            await axios.post(`${RENDER_BACKEND_URL}/add-movie`, movieDataToSave);
            bot.sendMessage(chatId, `✅ Película "${movieDataToSave.title}" guardada con éxito en la app.`);
            
            // Llama a la nueva función que maneja la publicación en ambos canales
            await publishMovieToChannels(movieDataToSave);
            
            // El mensaje de éxito lo maneja la nueva función, así que solo limpiamos el estado
            adminState[chatId] = { step: 'menu' };
        } catch (error) {
            console.error("Error al guardar/publicar la película:", error);
            bot.sendMessage(chatId, 'Hubo un error al guardar o publicar la película. Revisa el estado de la película en Firestore y reinicia con /subir.');
            adminState[chatId] = { step: 'menu' };
        }
    } else if (data.startsWith('save_only_series_')) {
        const { seriesDataToSave } = adminState[chatId];
        try {
            if (!seriesDataToSave || !seriesDataToSave.tmdbId) {
                throw new Error("Datos de la serie incompletos o tmdbId faltante.");
            }
            await axios.post(`${RENDER_BACKEND_URL}/add-series-episode`, seriesDataToSave);
            
            const tmdbId = seriesDataToSave.tmdbId;
            const seasonNumber = seriesDataToSave.seasonNumber;
            const episodeNumber = seriesDataToSave.episodeNumber;

            const seriesRef = db.collection('series').doc(tmdbId);
            const seriesDoc = await seriesRef.get();
            const seriesData = seriesDoc.exists ? seriesDoc.data() : null;

            let lastEpisode = 0;
            if (seriesData?.seasons?.[seasonNumber]?.episodes) {
                lastEpisode = Object.keys(seriesData.seasons[seasonNumber].episodes).length;
            }
            const nextEpisode = lastEpisode + 1;

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `➡️ Agregar Episodio ${nextEpisode}`, callback_data: `add_next_episode_${tmdbId}_${seasonNumber}` }],
                        [{ text: '✅ Finalizar', callback_data: `finish_series_${tmdbId}` }]
                    ]
                },
                parse_mode: 'Markdown'
            };
            
            bot.sendMessage(chatId, `✅ Episodio ${episodeNumber} de la temporada ${seasonNumber} guardado con éxito. ¿Quieres agregar el siguiente?`, options);
            adminState[chatId] = { step: 'awaiting_series_action' }; 
            
        } catch (error) {
            console.error("Error al guardar el episodio:", error);
            bot.sendMessage(chatId, 'Hubo un error al guardar el episodio.');
            adminState[chatId] = { step: 'menu' };
        }
    } else if (data.startsWith('save_and_publish_series_')) {
        const { selectedSeries, season, episode, proEmbedCode, freeEmbedCode } = adminState[chatId];
        try {
            if (!selectedSeries || !selectedSeries.tmdbId) {
                throw new Error("Datos de la serie incompletos o tmdbId faltante.");
            }
            
            const seriesDataToSave = {
                tmdbId: selectedSeries.tmdbId, 
                title: selectedSeries.title || selectedSeries.name,
                overview: selectedSeries.overview,
                poster_path: selectedSeries.poster_path,
                seasonNumber: season,
                episodeNumber: episode,
                proEmbedCode: proEmbedCode,
                freeEmbedCode: freeEmbedCode,
                isPremium: !!proEmbedCode && !freeEmbedCode
            };

            await axios.post(`${RENDER_BACKEND_URL}/add-series-episode`, seriesDataToSave);
            bot.sendMessage(chatId, `✅ Episodio ${seriesDataToSave.episodeNumber} de la temporada ${seriesDataToSave.seasonNumber} guardado y publicado con éxito.`);
            
            await publishSeriesEpisodeToChannels(seriesDataToSave);

            const tmdbId = seriesDataToSave.tmdbId;
            const seasonNumber = seriesDataToSave.seasonNumber;
            const seriesRef = db.collection('series').doc(tmdbId);
            const seriesDoc = await seriesRef.get();
            const seriesData = seriesDoc.exists ? seriesData.data() : null;

            let lastEpisode = 0;
            if (seriesData?.seasons?.[seasonNumber]?.episodes) {
                lastEpisode = Object.keys(seriesData.seasons[seasonNumber].episodes).length;
            }
            const nextEpisode = lastEpisode + 1;

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `➡️ Agregar Episodio ${nextEpisode}`, callback_data: `add_next_episode_${tmdbId}_${seasonNumber}` }],
                        [{ text: '✅ Finalizar', callback_data: `finish_series_${tmdbId}` }]
                    ]
                }
            };
            
            bot.sendMessage(chatId, '¿Quieres agregar el siguiente episodio?', options);
            adminState[chatId] = { step: 'awaiting_series_action' };
        } catch (error) {
            console.error("Error al guardar/publicar el episodio:", error);
            bot.sendMessage(chatId, 'Hubo un error al guardar o publicar el episodio.');
            adminState[chatId] = { step: 'menu' };
        }
    } else if (data.startsWith('send_push_')) {
        const parts = data.split('_');
        const tmdbId = parts[2];
        const mediaType = parts[3];
        const state = adminState[chatId];
        const title = state.title;

        if (!title) {
             bot.editMessageReplyMarkup({ inline_keyboard: [] }, { 
                 chat_id: chatId, 
                 message_id: msg.message_id
             });
             bot.sendMessage(chatId, '❌ Error: El estado de la acción se perdió. Por favor, intente /start.');
             adminState[chatId] = { step: 'menu' };
             return;
        }

        try {
            await axios.post(`${RENDER_BACKEND_URL}/api/notify`, {
                tmdbId,
                mediaType,
                title
            });
            
            bot.editMessageText(`✅ Notificaciones push para *${title}* programadas para envío.`, {
                chat_id: chatId, 
                message_id: msg.message_id,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [] }
            });

        } catch (error) {
            console.error("Error al llamar al endpoint /api/notify:", error);
            bot.editMessageText(`❌ Hubo un error al solicitar el envío de notificaciones para *${title}*. Revisa los logs.`, {
                chat_id: chatId, 
                message_id: msg.message_id,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [] }
            });
        } finally {
            adminState[chatId] = { step: 'menu' };
        }
    } else if (data.startsWith('finish_series_')) {
        const tmdbId = data.replace('finish_series_', '');
        const seriesRef = db.collection('series').doc(tmdbId);
        await seriesRef.update({ status: 'completed' });
        bot.sendMessage(chatId, '✅ Proceso de adición de episodios finalizado. Volviendo al menú principal.');
        adminState[chatId] = { step: 'menu' };
    }
});

// =======================================================================
// === NUEVA FUNCIÓN: VERIFICADOR DE ACTUALIZACIONES (/api/app-update) ===
// =======================================================================

app.get('/api/app-update', (req, res) => {
  const updateInfo = {
    "latest_version_code": 4, 
    "update_url": "https://google-play.onrender.com", 
    "force_update": true, 
    "update_message": "¡Tenemos una nueva versión (1.4) con TV en vivo y mejoras! Presiona 'Actualizar Ahora' para ir a la tienda de descarga."
  };
  
  res.status(200).json(updateInfo);
});

// =======================================================================
// === NUEVA SOLUCIÓN: ENDPOINT PARA GOOGLE APP LINKS VERIFICATION ===
// =======================================================================

app.get('/.well-known/assetlinks.json', (req, res) => {
    res.sendFile('assetlinks.json', { root: __dirname });
});

// =======================================================================

// === CÓDIGO ORIGINAL QUE DEBE VENIR DESPUÉS ===
app.listen(PORT, () => {
    console.log(`Servidor de backend de Sala Cine iniciado en el puerto ${PORT}`);
});
