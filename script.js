/* Firebase compat shim: provide modular-like helpers over compat API when using -compat CDN builds. */
(function(){
  const fb = window.firebase;
  if (!fb) return;
  if (typeof fb.auth === 'function') {
    if (!fb.auth.getAuth) fb.auth.getAuth = function(){ return fb.auth(); };
    if (!fb.auth.onAuthStateChanged) fb.auth.onAuthStateChanged = function(auth, cb){ return auth.onAuthStateChanged(cb); };
    if (!fb.auth.signInAnonymously) fb.auth.signInAnonymously = function(auth){ return auth.signInAnonymously(); };
    if (!fb.auth.signOut) fb.auth.signOut = function(auth){ return auth.signOut(); };
    if (!fb.auth.createUserWithEmailAndPassword) fb.auth.createUserWithEmailAndPassword = function(auth, email, pass){ return auth.createUserWithEmailAndPassword(email, pass); };
    if (!fb.auth.signInWithEmailAndPassword) fb.auth.signInWithEmailAndPassword = function(auth, email, pass){ return auth.signInWithEmailAndPassword(email, pass); };
  }
  if (typeof fb.firestore === 'function') {
    if (!fb.firestore.getFirestore) fb.firestore.getFirestore = function(){ return fb.firestore(); };
    if (!fb.firestore.collection) fb.firestore.collection = function(db, path){ return db.collection(path); };
    if (!fb.firestore.doc) fb.firestore.doc = function(db, path, id){ return (id != null) ? db.collection(path).doc(id) : db.doc(path); };
    if (!fb.firestore.addDoc) fb.firestore.addDoc = function(colRef, data){ return colRef.add(data); };
    if (!fb.firestore.getDoc) fb.firestore.getDoc = function(docRef){ return docRef.get(); };
    if (!fb.firestore.getDocs) fb.firestore.getDocs = function(q){ return q.get(); };
    if (!fb.firestore.updateDoc) fb.firestore.updateDoc = function(docRef, data){ return docRef.update(data); };
    if (!fb.firestore.setDoc) fb.firestore.setDoc = function(docRef, data, options){ return docRef.set(data, options); };
    if (!fb.firestore.increment) fb.firestore.increment = function(n){ return fb.firestore.FieldValue.increment(n); };
    if (!fb.firestore.where) fb.firestore.where = function(field, op, value){ return function(ref){ return ref.where(field, op, value); }; };
    if (!fb.firestore.orderBy) fb.firestore.orderBy = function(field, dir){ return function(ref){ return ref.orderBy(field, dir); }; };
    if (!fb.firestore.limit) fb.firestore.limit = function(n){ return function(ref){ return ref.limit(n); }; };
    if (!fb.firestore.query) fb.firestore.query = function(ref, ...clauses){ return clauses.reduce((acc, fn)=>fn(acc), ref); };
    if (!fb.firestore.onSnapshot) fb.firestore.onSnapshot = function(ref, cb){ return ref.onSnapshot(cb); };
    if (!fb.firestore.runTransaction) fb.firestore.runTransaction = function(db, fn){ return db.runTransaction(fn); };
  }
})();

// Aliases expected by the app code (modular-like names mapped to compat)
const initializeApp = window.firebase && window.firebase.initializeApp;
const getAuth = window.firebase && window.firebase.auth && window.firebase.auth.getAuth;
const onAuthStateChanged = window.firebase && window.firebase.auth && window.firebase.auth.onAuthStateChanged;
const signInAnonymously = window.firebase && window.firebase.auth && window.firebase.auth.signInAnonymously;
const signOut = window.firebase && window.firebase.auth && window.firebase.auth.signOut;
const createUserWithEmailAndPassword = window.firebase && window.firebase.auth && window.firebase.auth.createUserWithEmailAndPassword;
const signInWithEmailAndPassword = window.firebase && window.firebase.auth && window.firebase.auth.signInWithEmailAndPassword;

const getFirestore = window.firebase && window.firebase.firestore && window.firebase.firestore.getFirestore;
const collection = window.firebase && window.firebase.firestore && window.firebase.firestore.collection;
const onSnapshot = window.firebase && window.firebase.firestore && window.firebase.firestore.onSnapshot;
const doc = window.firebase && window.firebase.firestore && window.firebase.firestore.doc;
const getDoc = window.firebase && window.firebase.firestore && window.firebase.firestore.getDoc;
const getDocs = window.firebase && window.firebase.firestore && window.firebase.firestore.getDocs;
const query = window.firebase && window.firebase.firestore && window.firebase.firestore.query;
const where = window.firebase && window.firebase.firestore && window.firebase.firestore.where;
const addDoc = window.firebase && window.firebase.firestore && window.firebase.firestore.addDoc;
const orderBy = window.firebase && window.firebase.firestore && window.firebase.firestore.orderBy;
const limit = window.firebase && window.firebase.firestore && window.firebase.firestore.limit;
const updateDoc = window.firebase && window.firebase.firestore && window.firebase.firestore.updateDoc;
const setDoc = window.firebase && window.firebase.firestore && window.firebase.firestore.setDoc;
const increment = window.firebase && window.firebase.firestore && window.firebase.firestore.increment;
const runTransaction = window.firebase && window.firebase.firestore && window.firebase.firestore.runTransaction;

// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCF5lyEIFkKhzgc4kOMebWZ7oZrxWDNw2Y",
    authDomain: "app-aeff2.firebaseapp.com",
    projectId: "app-aeff2",
    storageBucket: "app-aeff2.firebasestorage.app",
    messagingSenderId: "12229598213",
    appId: "1:12229599999:web:80555d9d22c30b69ddd06c",
    measurementId: "G-ZMQN0D6D4S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// --- Elementos del DOM ---
const appContainer = document.getElementById('app-container');
const homeScreen = document.getElementById('home-screen');
const moviesScreen = document.getElementById('movies-screen');
const seriesScreen = document.getElementById('series-screen');
const profileScreen = document.getElementById('profile-screen');
const detailsScreen = document.getElementById('details-screen');
const favoritesScreen = document.getElementById('favorites-screen');
const requestScreen = document.getElementById('request-screen');
const privacyScreen = document.getElementById('privacy-screen');
const termsScreen = document.getElementById('terms-screen');
const helpScreen = document.getElementById('help-screen');
const settingsScreen = document.getElementById('settings-screen');
const authScreen = document.getElementById('auth-screen');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const screenButtons = document.querySelectorAll('[data-screen]');
const searchIconTop = document.getElementById('search-icon');
const videoModal = document.getElementById('video-modal');
const videoPlayer = document.getElementById('video-player');
const closeButtons = document.querySelectorAll('.close-button');
const detailsPosterTop = document.getElementById('details-poster-top');
const detailsTitle = document.getElementById('details-title');
const detailsYear = document.getElementById('details-year');
const detailsGenres = document.getElementById('details-genres');
const detailsSinopsis = document.getElementById('details-sinopsis');
const directorName = document.getElementById('director-name');
const actorsList = document.getElementById('actors-list');
const genresButton = document.getElementById('genres-button');
const seriesGenresButton = document.getElementById('series-genres-button');
const genresModal = document.getElementById('genres-modal');
const genresList = document.getElementById('genres-list');
const allMoviesGrid = document.getElementById('all-movies-grid');
const allSeriesGrid = document.getElementById('all-series-grid');
const bannerList = document.getElementById('banner-list');
const loader = document.getElementById('loader');
const premiumInfoModal = document.getElementById('premium-info-modal');
const premiumInfoCtaButton = document.getElementById('premium-info-cta');
const premiumInfoCloseButton = document.getElementById('premium-info-close');
const premiumInfoLoginLink = document.getElementById('premium-info-login-link');
// ELIMINADO: const paymentModal = document.getElementById('payment-modal');

// NUEVOS ELEMENTOS DEL MODAL DE PAGO
const paymentMethodModal = document.getElementById('payment-method-modal');
const buyMethodButtons = document.querySelectorAll('.buy-method-button'); // Botones para ELEGIR PLAN
const paymentOptionsContainer = document.getElementById('payment-options-container'); // Contenedor de métodos (PayPal/Telegram)
const plansContainerMethod = document.getElementById('plans-container-method'); // Contenedor de selección de plan
const btnPayPaypal = document.getElementById('btn-pay-paypal');
const btnPayTelegram = document.getElementById('btn-pay-telegram');
const btnBackToPlans = document.getElementById('btn-back-to-plans');
const selectedPlanTitle = document.getElementById('selected-plan-title');
const selectedPlanDetail = document.getElementById('selected-plan-detail');
let currentSelectedPlan = null; // Variable para almacenar el plan elegido
const TELEGRAM_PREMIUM_CONTACT_URL = "https://t.me/sala_cine_premiun";


const proStatusButton = document.getElementById('pro-status-button');
const signoutButton = document.getElementById('signout-button');
const movieRequestInput = document.getElementById('movie-request-input');
const submitRequestButton = document.getElementById('submit-request-button');
const favoritesGrid = document.getElementById('favorites-grid');
const profileLoggedIn = document.getElementById('profile-logged-in');
const profileLoggedOut = document.getElementById('profile-logged-out');
const profileLoginLink = document.getElementById('profile-login-link');
const createAccountButton = document.getElementById('create-account-button');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');
const socialLoginButtons = document.querySelectorAll('.social-button');
const profileMyList = document.getElementById('profile-my-list');
const profilePrivacy = document.getElementById('profile-privacy');
const profileTerms = document.getElementById('profile-terms');
const profileSubscription = document.getElementById('profile-subscription');
const profileHelpCenter = document.getElementById('profile-help-center');
const authBackButton = document.getElementById('auth-back-button');
const authLoginLink = document.getElementById('auth-login-link');
const buyWithPaypalButton = document.getElementById('buy-with-paypal');
const buyWithBinanceButton = document.getElementById('buy-with-binance');
const seasonsContainer = document.getElementById('seasons-container');
const episodesContainer = document.getElementById('episodes-container');
const playButtonContainer = document.getElementById('details-play-button-container');
const embeddedPlayerContainer = document.getElementById('embedded-player-container');
const freeAdModal = document.getElementById('free-ad-modal');
const verGratisButton = document.getElementById('ver-gratis-button');
const verProButton = document.getElementById('ver-pro-button');
const freeModalCloseButton = document.querySelector('.free-modal-close-button');
const seeMoreButtons = document.querySelectorAll('.see-more-btn');
const proRestrictionModal = document.getElementById('pro-restriction-modal');
const proModalCta = document.getElementById('pro-modal-cta');
const proModalText = document.getElementById('pro-modal-text');
const historyList = document.getElementById('history-list');
const historySection = document.getElementById('history-section');
const searchFilters = document.getElementById('search-filters');
const filterButtons = document.querySelectorAll('.filter-button');

// --- Elementos del Rediseño de la Barra Superior y Social (REQs 1, 2, 3, 4) ---
const btnToggleTheme = document.getElementById('btn-toggle-theme');
const btnDownloadApp = document.getElementById('btn-download-app');
const downloadAppModal = document.getElementById('download-app-modal');
const btnOpenSearch = document.getElementById('btn-open-search');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchButton = document.getElementById('close-search-button');
const searchInput = document.getElementById('search-input'); // Usamos el input dentro del overlay
const btnQuickPremiumAccess = document.getElementById('btn-quick-premium-access'); // NUEVO: Botón de corona
const membershipInfoModal = document.getElementById('membership-info-modal'); // NUEVO: Modal de gestión PRO

// ELEMENTOS SOCIALES REUBICADOS
const viewCountDisplay = document.getElementById('view-count-display'); // Ahora en movie-metadata
const likeCountDisplayText = document.getElementById('like-count-display-text'); // Contenedor de Like
const favoriteButton = document.getElementById('favorite-button'); // Heart icon in movie-actions
const commentInput = document.getElementById('comment-input');
const btnPostComment = document.getElementById('btn-post-comment');
const commentsFeed = document.getElementById('comments-feed');
const noCommentsMessage = document.getElementById('no-comments-message');
const relatedMoviesContainer = document.getElementById('related-movies'); // Contenedor de Similares

// ELEMENTOS DE PESTAÑAS (TABS)
const detailsTabsHeader = document.getElementById('details-tabs-header');
const detailsTabsContent = document.getElementById('details-tabs-content');

// CRÍTICO: BOTÓN DE COMUNIDAD EN TELEGRAM
const btnOpenCommunity = document.getElementById('btn-open-community');

// --- ELEMENTOS AGREGADOS PARA NUEVOS REQUERIMIENTOS ---
// REQUERIMIENTO: Errores amigables
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');
const requestMessage = document.getElementById('request-message');
const detailsRequestMessage = document.getElementById('details-request-message');
// REQUERIMIENTO: Notificaciones y Eventos (SOLO CONSUMO)
const btnOpenNotifications = document.getElementById('btn-open-avisos'); // El botón de la campana
const userNotificationsModal = document.getElementById('user-notifications-modal');
const btnClearAllNotifications = document.getElementById('btn-clear-all-notifications');
const notificationsClose = document.getElementById('notifications-close');
const contentPublishingModal = document.getElementById('admin-avisos-modal');
const btnPubSaveNotify = document.getElementById('btn-save-notify-app-new');

// ELEMENTOS DE LA SECCIÓN TV (Referenciados desde index.html)
const tv_video = document.getElementById('tv-video-player');
const tv_channel_grid = document.getElementById('tv-channel-grid');
const tv_current_name = document.getElementById('tv-current-channel-name');
const premium_wall = document.getElementById('premium-wall');
const country_nav = document.getElementById('country-nav');
let tv_currentItem = null;
let hls_instance = null;
let currentActiveCountryCode = 'MX'; // NUEVA VARIABLE: Guarda el código del país/categoría activo


let moviesData = [];
let seriesData = [];
let bannerMovies = [];
let allMovieGenres = {};
let allTvGenres = {};
let bannerInterval;
let resumeAutoScrollTimeout;
let currentUser = null;
let currentMovieOrSeries = null;
let currentFullTMDBItem = null; // Variable para guardar el objeto TMDB completo
let lastSearchResults = [];

// ======================================================================
// LÓGICA DE NOTIFICACIONES (REAL-TIME Y LIMPIEZA) - SIN CAMBIOS
// ======================================================================

let notificationsData = [];

function showAppMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `auth-message-box ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function updateNotificationIndicator() {
    const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;

    notificationsData = notificationsData.filter(n => {
        const timestampMs = n.timestamp.toDate ? n.timestamp.toDate().getTime() : n.timestamp;
        return (Date.now() - timestampMs) <= twoDaysInMs;
    });

    const unreadCount = notificationsData.filter(n => !n.isRead).length;
    const indicatorElement = document.getElementById('notification-indicator');

    if (indicatorElement) {
        if (unreadCount > 0) {
            indicatorElement.classList.remove('hidden');
        } else {
            indicatorElement.classList.add('hidden');
        }
    }
}

function renderNotifications() {
    const listElement = document.getElementById('notifications-list');
    const emptyMessage = document.getElementById('empty-notifications-message');
    const clearButton = document.getElementById('btn-clear-all-notifications');
    if (!listElement || !emptyMessage || !clearButton) return;

    listElement.innerHTML = '';

    if (notificationsData.length === 0) {
        emptyMessage.textContent = "Aún no tienes notificaciones.";
        emptyMessage.classList.remove('hidden');
        clearButton.classList.add('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');
    clearButton.classList.remove('hidden');

    notificationsData.forEach(notification => {
        const item = document.createElement('div');
        const docId = notification.docId;

        const timestampDate = notification.timestamp.toDate ? notification.timestamp.toDate() : new Date(notification.timestamp);
        const timeString = timestampDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        item.className = `notification-item ${!notification.isRead ? 'unread' : ''}`;

        item.innerHTML = `
            <img src="${notification.image}" alt="${notification.title}" onerror="this.onerror=null;this.src='https://placehold.co/50x70?text=IMG'">
            <div class="notification-item-text">
                <strong>${notification.title}</strong>
                <small>${notification.description} - ${timeString}</small>
            </div>
        `;

        item.addEventListener('click', async () => {
            if (!notification.isRead && docId) {
                const notifRef = doc(db, 'userNotifications', docId);
                try {
                    await updateDoc(notifRef, { isRead: true });
                } catch (error) {
                    console.error("Error al marcar como leído:", error);
                }
            }

            closeModal(userNotificationsModal);
            if (notification.targetScreen) {
                switchScreen(notification.targetScreen);
            }
        });

        listElement.appendChild(item);
    });
}

function setupRealtimeNotificationsListener() {
    const notificationsColRef = collection(db, 'userNotifications');
    const q = query(notificationsColRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        notificationsData = snapshot.docs.map(doc => ({
            docId: doc.id,
            ...doc.data()
        }));

        updateNotificationIndicator();

        if (userNotificationsModal.classList.contains('active')) {
            renderNotifications();
        }

    }, (error) => {
        console.error("Error al obtener notificaciones en tiempo real:", error);
    });
}
// ======================================================================
// FIN: LÓGICA DE NOTIFICACIONES (REAL-TIME Y LIMPIEZA)
// ======================================================================


// --- Funciones de Utilidad ---

// --- Custom Alert Modal ---
const customAlertModal = document.getElementById('custom-alert-modal');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertCloseButton = document.getElementById('custom-alert-close-button');

function showCustomAlert(message) {
    if (customAlertModal && customAlertMessage) {
        customAlertMessage.textContent = message;
        showModal(customAlertModal);
    }
}

if (customAlertCloseButton) {
    customAlertCloseButton.addEventListener('click', () => {
        closeModal(customAlertModal);
    });
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}
function showModal(modal) {
    if (modal) {
        modal.classList.add('active');
    }
}

function showLoader() {
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    if (loader) loader.style.display = 'none';
}

function closeAllModals() {
    const modalsToClose = [
        document.getElementById('video-modal'),
        document.getElementById('premium-info-modal'),
        paymentMethodModal, // CAMBIO: Usar el nuevo modal de pagos
        document.getElementById('free-ad-modal'),
        document.getElementById('pro-restriction-modal'),
        document.getElementById('download-app-modal'),
        userNotificationsModal,
        contentPublishingModal,
        customAlertModal, // Asegurar que el modal de alerta se cierre también
        membershipInfoModal // NUEVO: Asegurar que se cierre el modal de gestión PRO
    ].filter(Boolean);

    modalsToClose.forEach(modal => closeModal(modal));
}

closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = event.target.closest('.modal') || event.target.closest('.modal-from-bottom');
        if (modal) {
            closeModal(modal);
        }
    });
});
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal') || event.target.classList.contains('modal-from-bottom')) {
        closeModal(event.target);
    }
});

// --- NUEVA FUNCIÓN PARA LEER PARÁMETROS DE LA URL (Telegram Mini Apps) ---
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
// --- FIN FUNCIÓN DE UTILIDAD ---

// [NUEVA LÓGICA] Función para detener y resetear el reproductor
function resetEmbeddedPlayer() {
    if (embeddedPlayerContainer) {
        // Detener la reproducción borrando el iframe
        embeddedPlayerContainer.innerHTML = '';
        embeddedPlayerContainer.style.display = 'none';
    }
    detailsPosterTop.style.backgroundColor = 'transparent';
    detailsPosterTop.style.backgroundImage = '';
    playButtonContainer.style.display = 'flex';

    // [LÓGICA TV] Si existe una instancia HLS, destrúyela al salir de la pantalla de detalles
    if (hls_instance) {
        hls_instance.destroy();
        hls_instance = null;
    }
    if (tv_video) {
        tv_video.pause();
        tv_video.removeAttribute('src');
    }
}


// --- Lógica del Tema Dual ---

function applyTheme(mode) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(mode);

    if (btnToggleTheme) {
        const icon = btnToggleTheme.querySelector('i');
        if (mode === 'dark-mode') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

function initializeTheme() {
    const storedMode = localStorage.getItem('theme');

    if (storedMode) {
        applyTheme(storedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark-mode');
    } else {
        applyTheme('light-mode');
    }
}

if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
        const currentMode = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        const newMode = currentMode === 'dark-mode' ? 'light-mode' : 'dark-mode';

        applyTheme(newMode);
        localStorage.setItem('theme', newMode);
    });
}

// --- Funciones de Reproducción y Lógica de Vistas/Likes Únicos ---

// CORREGIDO: Función para obtener el contador de Vistas o Likes global (Ahora llama al servidor)
async function getCount(tmdbId, field = 'likes') {
    try {
        // Nuevo endpoint en su servidor para obtener métricas
        const response = await fetch(`https://serivisios.onrender.com/api/get-metrics?id=${tmdbId}&field=${field}`);
        if (!response.ok) {
            // Si el servidor no encuentra el dato (404), tratamos como 0
            if (response.status === 404) return 0;
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data.count || 0; // El servidor debe retornar { count: N }
    } catch (e) {
        console.error(`Error fetching ${field} count:`, e);
        return 0;
    }
}

// CORREGIDO: Lógica de VISTAS (Ahora llama al servidor para incrementar en MongoDB)
async function incrementViewCount(tmdbId) {
    if (!tmdbId) return;
    try {
        // Nuevo endpoint en su servidor para incrementar vistas
        await fetch(`https://serivisios.onrender.com/api/increment-views`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId: tmdbId.toString() })
        });
    } catch (e) {
        console.error(`Error al registrar la vista para ${tmdbId}:`, e);
    }
}


// LÓGICA DE LIKES ÚNICOS Y PERSISTENTES
async function checkUserLiked(tmdbId) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return false;
    }
    const userId = auth.currentUser.uid;
    // Esta consulta requiere un índice: userId + tmdbId
    const q = query(collection(db, 'movieLikes'),
        where('userId', '==', userId),
        where('tmdbId', '==', tmdbId.toString()),
        limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

async function renderLikeState(tmdbId) {
    if (favoriteButton) {
        const hasLiked = await checkUserLiked(tmdbId);
        // Toglea entre ícono hueco (far) y sólido (fas)
        if (hasLiked) {
            favoriteButton.classList.remove('far');
            favoriteButton.classList.add('fas', 'liked');
        } else {
            favoriteButton.classList.remove('fas', 'liked');
            favoriteButton.classList.add('far');
        }
    }
}

// CORREGIDO: Lógica de Like (Ahora incrementa el total a través del servidor)
async function handleLike(tmdbId) {
    if (!currentUser || currentUser.isAnonymous) {
        // FIX 1: Al requerir login, empujamos el estado actual (details) al historial
        // Guardamos el objeto TMDB completo (currentFullTMDBItem) para la restauración.
        history.pushState({
            screen: 'auth-screen',
            previousScreen: 'details-screen',
            previousItem: currentFullTMDBItem,
            previousType: currentFullTMDBItem.type
        }, '', '');
        switchScreen('auth-screen');
        return;
    }

    const userId = auth.currentUser.uid;
    const hasLiked = await checkUserLiked(tmdbId);

    if (hasLiked) {
        showCustomAlert('Ya has dado "Me Gusta" a este contenido.');
        return;
    }

    try {
        // 1. **NUEVO PASO:** Incrementa el contador total en el servidor (MongoDB)
        await fetch(`https://serivisios.onrender.com/api/increment-likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId: tmdbId.toString() })
        });

        // 2. Registra el like del usuario en Firebase para que sea persistente (Para evitar doble like)
        await addDoc(collection(db, 'movieLikes'), {
            userId: userId,
            tmdbId: tmdbId.toString(),
            timestamp: new Date()
        });

        // Actualiza la interfaz
        renderLikeState(tmdbId); // Llama a la función para ponerlo sólido

        // Obtiene y muestra el nuevo contador real desde el servidor
        const newLikeCount = await getCount(tmdbId, 'likes');

        if (likeCountDisplayText) {
             likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${newLikeCount} Me Gusta`;
        }

    } catch (e) {
        console.error("Error al registrar like:", e);
        showCustomAlert('Hubo un error al registrar tu "Me Gusta".');
    }
}

// NUEVO LISTENER: Se adjunta la función de like al icono de corazón en movie-actions
if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            handleLike(currentMovieOrSeries.tmdbId);
        }
    });
}


function showFreeAdModal(freeEmbedCode) {
    showModal(freeAdModal);
    setupFreeAdModalButtons(freeEmbedCode);
}

function setupFreeAdModalButtons(freeEmbedCode) {
    verGratisButton.onclick = () => {
        closeModal(freeAdModal);
        playEmbeddedVideo(freeEmbedCode, false, currentUser, currentMovieOrSeries);
    };

    verProButton.onclick = () => {
        closeModal(freeAdModal);
        // CAMBIO: Usar el nuevo modal de selección de pago
        showModal(paymentMethodModal);
        // Mostrar la primera vista de planes por defecto
        showPlanSelectionView();
    };

    freeModalCloseButton.onclick = () => {
        closeModal(freeAdModal);
    };
}
function showProRestrictionModal() {
    showModal(proRestrictionModal);
}
proModalCta.addEventListener('click', () => {
    closeModal(proRestrictionModal);
    // CAMBIO: Usar el nuevo modal de selección de pago
    showModal(paymentMethodModal);
    // Mostrar la primera vista de planes por defecto
    showPlanSelectionView();
});

async function addMovieToHistory(item) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return;
    }
    try {
        const historyRef = collection(db, 'history');
        // Esta consulta requiere un índice: userId + tmdbId
        const existingDocs = await getDocs(query(historyRef, where('userId', '==', auth.currentUser.uid), where('tmdbId', '==', item.id)));
        if (existingDocs.empty) {
            await addDoc(historyRef, {
                userId: auth.currentUser.uid,
                tmdbId: item.id,
                title: item.title || item.name,
                poster_path: item.poster_path,
                type: item.media_type || 'movie',
                timestamp: new Date()
            });
        }
    } catch (e) {
        console.error("Error al agregar al historial: ", e);
    }
}

function playEmbeddedVideo(embedCode, isPremium, currentUser, item) {
    if (isPremium && (!currentUser || !currentUser.isPro)) {
        showProRestrictionModal();
    } else {
        detailsPosterTop.style.backgroundImage = 'none';
        detailsPosterTop.style.backgroundColor = '#000';
        playButtonContainer.style.display = 'none';
        embeddedPlayerContainer.style.display = 'block';

        // CORRECCIÓN CRÍTICA 2: Ajustamos el iframe para GodStream y tu WebView
        const isEmbedUrl = embedCode.startsWith('http') || embedCode.startsWith('//');
        if (isEmbedUrl) {
             embeddedPlayerContainer.innerHTML = `<iframe src="${embedCode}" FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=100% HEIGHT=100% allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>`;
        } else {
             // Si no es URL (es el código iframe completo), lo incrustamos directamente.
             embeddedPlayerContainer.innerHTML = embedCode;
        }

        // SE MANTIENE LA LLAMADA A INCREMENTAR VISTAS AL INICIAR LA REPRODUCCIÓN
        incrementViewCount(currentMovieOrSeries.tmdbId);
        addMovieToHistory(item);
    }
}

// *** FUNCIÓN renderMoviePlayButtons (Sin cambios, ya estaba optimizada) ***
async function renderMoviePlayButtons(localMovie, tmdbMovie) {
    playButtonContainer.innerHTML = '';
    showLoader(); // Muestra el loader mientras verificamos disponibilidad

    let embedCodeAvailable = false;
    const tmdbIdToUse = tmdbMovie.id;

    try {
        // 1. Hacemos una llamada para verificar si existe CUALQUIER embed.
        const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${tmdbIdToUse}&isPro=false`);

        if (response.ok) {
            embedCodeAvailable = true;
        } else if (response.status === 404) {
            embedCodeAvailable = false;
        } else {
             console.warn(`Error de servidor (${response.status}) al verificar disponibilidad. Mostrando Pedir.`);
             embedCodeAvailable = false;
        }

        if (embedCodeAvailable) {
            const playButton = document.createElement('button');
            playButton.className = 'play-button';
            playButton.innerHTML = `<i class="fas fa-play"></i>`;

            playButton.onclick = async () => {
                showLoader();
                try {
                     const isProUser = currentUser && currentUser.isPro;
                     let finalEmbedCode = null;

                     // Intento PRO
                     let resp = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${tmdbIdToUse}&isPro=true`);
                     finalEmbedCode = resp.ok ? (await resp.json()).embedCode : null;

                     // Fallback a GRATIS
                     if (!finalEmbedCode) {
                         resp = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${tmdbIdToUse}&isPro=false`);
                         finalEmbedCode = resp.ok ? (await resp.json()).embedCode : null;
                     }


                    if (finalEmbedCode) {
                        // Lógica Unificada: Si es PRO, reproduce directamente (bypass publicidad). Si es GRATIS, muestra modal.
                        if (isProUser) {
                            playEmbeddedVideo(finalEmbedCode, true, currentUser, tmdbMovie);
                        } else {
                            showFreeAdModal(finalEmbedCode);
                        }
                    } else {
                        showProRestrictionModal();
                    }
                } catch (error) {
                    console.error('Error al obtener el código del reproductor:', error);
                    showCustomAlert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
                } finally {
                    hideLoader();
                }
            };
            playButtonContainer.appendChild(playButton);

        } else {
            renderRequestButton(tmdbMovie);
        }
    } catch (error) {
        console.error('Error de disponibilidad:', error);
        renderRequestButton(tmdbMovie);
    } finally {
        hideLoader();
    }
}

// *** FUNCIÓN CORREGIDA Y OPTIMIZADA: renderSeriesButtons ***
async function renderSeriesButtons(localSeries, tmdbSeries) {
    showLoader(); // Mostrar loader al iniciar la carga de temporadas/episodios
    const tmdbIdToUse = tmdbSeries.id;

    try {
        playButtonContainer.innerHTML = '';
        seasonsContainer.style.display = 'block';
        seasonsContainer.innerHTML = '<h3>Temporadas</h3>';
        episodesContainer.innerHTML = ''; // Limpiar episodios al inicio

        const seriesDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}`);

        if (!seriesDetails || !seriesDetails.seasons) {
             throw new Error("No seasons data available for this series.");
        }

        seriesDetails.seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.className = 'season-button';
            seasonButton.textContent = `Temporada ${season.season_number}`;

            seasonButton.onclick = async () => {
                showLoader(); // Mostrar loader al seleccionar temporada
                episodesContainer.innerHTML = '<h3>Episodios</h3><div class="episodes-grid"></div>';
                const episodesGrid = episodesContainer.querySelector('.episodes-grid');
                const seasonNumber = season.season_number;
                const seasonDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}/season/${seasonNumber}`);

                if (!seasonDetails || !seasonDetails.episodes) {
                    hideLoader();
                    showCustomAlert('No se encontraron episodios para esta temporada.');
                    return;
                }

                // === CÓDIGO CRÍTICO PARA LA OPTIMIZACIÓN (LLAMADA ÚNICA) ===
                const availabilityResponse = await fetch(`https://serivisios.onrender.com/api/check-season-availability?id=${tmdbIdToUse}&season=${seasonNumber}`);
                const availabilityData = await availabilityResponse.json();
                // availabilityData.availableEpisodes es un mapa { "1": true, "2": false, ... }
                const availableEpisodes = availabilityData.availableEpisodes || {};
                // ==========================================================

                for (const episode of seasonDetails.episodes) {
                    const episodeNumber = episode.episode_number;

                    // 1. USO INSTANTÁNEO DE LA DISPONIBILIDAD (NO BLOQUEANTE)
                    const isAvailable = availableEpisodes[episodeNumber.toString()] === true;

                    const episodeButton = document.createElement('button');
                    episodeButton.className = 'episode-button';
                    episodeButton.textContent = `E${episode.episode_number}`;

                    if (isAvailable) {
                        // El episodio está en MongoDB. Configura el botón Play.
                        episodeButton.onclick = async () => {
                            showLoader();
                            try {
                                const isProUser = currentUser && currentUser.isPro;
                                let finalEmbedCode = null;

                                // Intento PRO
                                let resp = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${tmdbIdToUse}&season=${seasonNumber}&episode=${episodeNumber}&isPro=true`);
                                finalEmbedCode = resp.ok ? (await resp.json()).embedCode : null;

                                // Fallback a GRATIS
                                if (!finalEmbedCode) {
                                    resp = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${tmdbIdToUse}&season=${seasonNumber}&episode=${episodeNumber}&isPro=false`);
                                    finalEmbedCode = resp.ok ? (await resp.json()).embedCode : null;
                                }

                                if (finalEmbedCode) {
                                    if (isProUser) {
                                        // Premium: Reproducción directa (BYPASS PUBLICIDAD)
                                        playEmbeddedVideo(finalEmbedCode, true, currentUser, episode);
                                    } else {
                                        // Gratuito: Muestra modal de publicidad/opción PRO
                                        showFreeAdModal(finalEmbedCode);
                                    }
                                } else {
                                    showProRestrictionModal();
                                }
                            } catch(error) {
                                console.error('Error al obtener el código del reproductor:', error);
                                showCustomAlert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
                            } finally {
                                hideLoader();
                            }
                        };
                    } else {
                        // El episodio NO está en MongoDB. Configura el botón Pedir.
                        episodeButton.classList.add('request-episode-button');
                        episodeButton.textContent = `E${episode.episode_number} (Pedir)`;
                        episodeButton.onclick = () => {
                            // Al hacer clic en Pedir, se limpia la acción Play de la película principal
                            playButtonContainer.innerHTML = '';
                            renderRequestButton(tmdbSeries);
                        };
                    }

                    episodesGrid.appendChild(episodeButton);
                } // End of for...of loop
                hideLoader(); // Ocultar loader después de renderizar episodios
            };
            seasonsContainer.appendChild(seasonButton);
        });
    } catch (error) {
        console.error('Error al renderizar los botones de temporadas:', error);
        seasonsContainer.innerHTML = '<p>No se encontraron temporadas para esta serie.</p>';
        renderRequestButton(tmdbSeries);
    } finally {
        hideLoader(); // Asegurar que el loader se oculte al finalizar la carga inicial
    }
}


function renderRequestButton(tmdbItem) {
    const requestButton = document.createElement('button');
    requestButton.className = 'request-movie-button';
    requestButton.innerHTML = `<i class="fas fa-paper-plane"></i> Pedir ahora`;
    requestButton.onclick = async () => {
        if (!auth.currentUser || auth.currentUser.isAnonymous) {
            showCustomAlert('Debes iniciar sesión para solicitar un contenido.');
            switchScreen('auth-screen');
            return;
        }
        try {
            // El endpoint de solicitud se mantiene.
            const response = await fetch('https://serivisios.onrender.com/request-movie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: tmdbItem.title || tmdbItem.name,
                    poster_path: tmdbItem.poster_path,
                    tmdbId: tmdbItem.id
                })
            });
            if (response.ok) {
                const successMsg = "Tu solicitud fue enviada. Si eres usuario gratuito, espera 3 a 6 horas. Si eres usuario premium, espera alrededor de 2 horas.";
                const detailsRequestMessage = document.getElementById('details-request-message');
                if (detailsRequestMessage) {
                    showAppMessage(detailsRequestMessage, successMsg, 'success');
                } else {
                    showCustomAlert(successMsg);
                }
            } else {
                showCustomAlert('Hubo un error al enviar la solicitud. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al solicitar el contenido:', error);
            showCustomAlert('No se pudo conectar con el servidor para enviar la solicitud.');
        }
    };
    playButtonContainer.appendChild(requestButton);
}

// --- Funciones Sociales (Comentarios) ---

async function postComment(tmdbId, text) {
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    if (text.trim() === "") {
        return;
    }

    try {
        await addDoc(collection(db, "comments"), {
            tmdbId: tmdbId.toString(),
            userId: currentUser.uid,
            // Usar email o un nombre de usuario más amigable
            userName: currentUser.email ? currentUser.email.split('@')[0] : 'Usuario',
            text: text.trim(),
            timestamp: new Date()
        });
        commentInput.value = '';
        // Cierra el teclado y restablece el banner
        detailsScreen.classList.remove('writing-comment');
        commentInput.blur();
    } catch (e) {
        console.error("Error al publicar comentario:", e);
        showCustomAlert('No se pudo publicar el comentario.');
    }
}

if (btnPostComment) {
    btnPostComment.addEventListener('click', () => {
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            postComment(currentMovieOrSeries.tmdbId, commentInput.value);
        }
    });
}

// FIX 2: Ocultar Banner de Reproducción al enfocarse en el comentario Y FIX 3 (Redirección)
if (commentInput) {
    commentInput.addEventListener('focus', () => {
        // NUEVA LÓGICA: Si no está logueado, redirige y sale.
        if (!currentUser || currentUser.isAnonymous) {
            // Guardamos el estado actual para regresar aquí sin el error 404
            history.pushState({
                screen: 'auth-screen',
                previousScreen: 'details-screen',
                previousItem: currentFullTMDBItem,
                previousType: currentFullTMDBItem.type
            }, '', '');
            switchScreen('auth-screen');
            commentInput.blur(); // Quita el foco para evitar que el teclado se quede abierto
            return;
        }

        // Si está logueado, procede a ocultar el banner
        detailsScreen.classList.add('writing-comment');
    });
    commentInput.addEventListener('blur', () => {
        // Solo restaura si no se está enviando el comentario
        if (!commentInput.value) {
            detailsScreen.classList.remove('writing-comment');
        }
    });
}


function renderComments(tmdbId) {
    const commentsColRef = collection(db, 'comments');
    const q = query(commentsColRef, where("tmdbId", "==", tmdbId.toString()), orderBy("timestamp", "desc"));

    // Configurar listener en tiempo real (Fix Comentarios)
    onSnapshot(q, (snapshot) => {
        commentsFeed.innerHTML = '';
        if (snapshot.empty) {
            // Asegurar que el mensaje de "no comentarios" se vea correctamente
            const emptyMessageElement = document.createElement('p');
            emptyMessageElement.id = 'no-comments-message';
            emptyMessageElement.style.color = '#888';
            emptyMessageElement.textContent = 'Sé el primero en comentar.';
            commentsFeed.appendChild(emptyMessageElement);
            return;
        }

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-user">${data.userName || 'Usuario Anónimo'}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <p class="comment-text">${data.text}</p>
            `;
            commentsFeed.appendChild(commentItem);
        });
    }, (error) => {
        console.error("Error al obtener comentarios:", error);
    });
}


// --- Lógica de Pestañas (TABS) ---
function setupDetailsTabs(tmdbItem, type) {
    // CRITICAL FIX 1: Safety check for tab containers
    if (!detailsTabsHeader || !detailsTabsContent) {
        console.error("Tab containers not found in DOM.");
        return; // Exit function gracefully if elements are missing
    }

    const tabButtons = detailsTabsHeader.querySelectorAll('.tab-button');
    const tabPanes = detailsTabsContent.querySelectorAll('.tab-pane');

    // Limpiar listeners anteriores
    tabButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    const newTabButtons = detailsTabsHeader.querySelectorAll('.tab-button');

    newTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetTabId = e.target.getAttribute('data-tab');

            newTabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });

            const targetPane = document.getElementById(targetTabId);
            if (targetPane) {
                targetPane.classList.add('active');

                // Si la pestaña es 'Similares' (related-content-pane), renderizar el contenido
                if (targetTabId === 'related-content-pane') {
                    // Carga forzada al hacer clic
                    if (relatedMoviesContainer.children.length === 0) {
                        fetchRelatedContent(tmdbItem, type);
                    }
                }
            }
        });
    });

    // Iniciar con la pestaña de Similares (related-content-pane) activa (el primer botón)
    document.getElementById('related-content-pane').classList.add('active');
    document.getElementById('comments-content-pane').classList.remove('active');
    document.querySelector('.tab-button[data-tab="related-content-pane"]').classList.add('active');
    document.querySelector('.tab-button[data-tab="comments-content-pane"]').classList.remove('active');
}

async function fetchRelatedContent(item, type) {
    try {
        // CORRECCIÓN CLAVE: Usar el tipo de endpoint correcto (movie o tv)
        const tmdbEndpointType = type === 'movie' ? 'movie' : 'tv';
        const related = await fetchFromTMDB(`${tmdbEndpointType}/${item.id}/similar`);
        renderCarousel('related-movies', related, type);
    } catch (error) {
        console.error("Error fetching related content:", error);
        relatedMoviesContainer.innerHTML = '<p style="padding: 10px;">No se encontraron contenidos similares.</p>';
    }
}

// --- Modificación de showDetailsScreen (Integración de toda la lógica) ---
async function showDetailsScreen(item, type) {
    if (searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        moviesScreen.classList.remove('search-active');
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    detailsScreen.classList.add('active');
    appContainer.scrollTo({ top: 0, behavior: 'smooth' });
    showLoader();

    // --- CORRECCIÓN CLAVE APLICADA: Asegura la visibilidad de las barras al regresar del login/otras pantallas ocultas. ---
    document.querySelector('.top-nav').style.display = 'flex';
    document.querySelector('.bottom-nav').style.display = 'flex';
    document.getElementById('app-container').style.paddingBottom = '70px';
    // --- FIN CORRECCIÓN ---

    // LIMPIEZA INICIAL DE CONTENEDORES
    seasonsContainer.innerHTML = '';
    episodesContainer.innerHTML = '';
    seasonsContainer.style.display = 'none';
    relatedMoviesContainer.innerHTML = ''; // Limpiar relacionados al cargar
    resetEmbeddedPlayer(); // LLAMADA CRÍTICA: Asegura que el reproductor anterior esté detenido

    try {
        // Guardamos el objeto TMDB completo que se está mostrando para la restauración del login
        currentFullTMDBItem = item;

        const posterPath = item.backdrop_path || item.poster_path;
        const posterUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}` : 'https://placehold.co/500x750?text=No+Poster';

        detailsPosterTop.style.backgroundImage = `url('${posterUrl}')`;

        detailsTitle.textContent = item.title || item.name;
        detailsSinopsis.textContent = item.overview || 'Sin sinopsis disponible.';
        detailsYear.textContent = (item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).substring(0, 4) : '';

        const genreNames = item.genre_ids ? item.genre_ids.map(id => (type === 'movie' ? allMovieGenres[id] : allTvGenres[id])).filter(Boolean).join(', ') : '';
        detailsGenres.textContent = genreNames;

        // CORRECCIÓN CLAVE: Determinar el endpoint de TMDB basado en el tipo
        const tmdbEndpointType = type === 'movie' ? 'movie' : 'tv';

        const credits = await fetchFromTMDB(`${tmdbEndpointType}/${item.id}/credits`);

        const director = credits.crew.find(c => c.job === 'Director');
        directorName.textContent = director ? director.name : 'No disponible';
        const actors = credits.cast.slice(0, 3).map(a => a.name).join(', ');
        actorsList.textContent = actors || 'No disponible';

        // --- Carga Estática de datos para la película actual ---
        const localData = (type === 'movie' ? moviesData : seriesData).find(d => d.tmdbId === item.id.toString());
        // --------------------------------------------------------

        currentMovieOrSeries = localData || { tmdbId: item.id, type: type }; // Asegurar que tenga el tmdbId

        if (type === 'movie') {
            // Usa la función CORREGIDA de Play/Pedir
            await renderMoviePlayButtons(localData, item);
        } else if (type === 'tv') {
            // La lógica de temporadas debe ejecutarse ANTES de la carga de pestañas
            await renderSeriesButtons(localData, item);
        }

        // --- INICIALIZACIÓN DE LA SECCIÓN SOCIAL Y PESTAÑAS ---
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            // 1. Vistas (AHORA LLAMA AL SERVIDOR)
            const viewCount = await getCount(currentMovieOrSeries.tmdbId, 'views');
            if (viewCountDisplay) {
                viewCountDisplay.innerHTML = `<i class="fas fa-eye"></i> ${viewCount.toLocaleString()} Vistas`;
            }

            // 2. Likes (AHORA LLAMA AL SERVIDOR)
            const likeCount = await getCount(currentMovieOrSeries.tmdbId, 'likes');
            if (likeCountDisplayText) {
                likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${likeCount} Me Gusta`;
            }
            renderLikeState(currentMovieOrSeries.tmdbId); // Establece el ícono de corazón (hollow/solid)

            // 3. Comentarios (REAL-TIME)
            renderComments(currentMovieOrSeries.tmdbId);
        }

        // 4. Configurar TABS (Pestañas)
        setupDetailsTabs(item, type);

        // Carga forzada de Similares si es la pestaña activa por defecto
        const defaultTab = document.querySelector('.tab-button[data-tab="related-content-pane"]');
        if (defaultTab && defaultTab.classList.contains('active')) {
             fetchRelatedContent(item, type);
        }


    } catch (error) {
        console.error("Error showing details:", error);
        showCustomAlert('Hubo un error al cargar los detalles. Intenta de nuevo.');

        resetEmbeddedPlayer();
        history.back();

    } finally {
        hideLoader();
    }
}

async function fetchFromTMDB(endpoint, query = '') {
    const API_KEY = "5eb8461b85d0d88c46d77cfe5436291f";
    const BASE_URL = 'https://api.themoviedb.org/3/';

    let url = `${BASE_URL}${endpoint}`;

    if (url.includes('?')) {
        url += `&api_key=${API_KEY}&language=es-ES`;
    } else {
        url += `?api_key=${API_KEY}&language=es-ES`;
    }

    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Si hay un error 404, lanzamos el error
            throw new Error(`Error de la API: ${response.status}`);
        }
        const data = await response.json();
        // Modificación para manejar la estructura de retorno de la API, ya que TMDB puede devolver el objeto raíz o .results
        return data.results || data.items || data;
    } catch (error) {
        console.error("Error en la llamada a fetchFromTMDB:", error);
        throw error;
    }
}

function createMovieCard(movie, type = 'movie') {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';

    let badgeHtml = '';
    const isPopular = movie.popularity > 100;
    if (isPopular) {
        badgeHtml = `<div class="badge">TOP</div>`;
    }

    const mediaTypeLabel = movie.media_type ? `<div class="media-type-label">${movie.media_type === 'movie' ? 'Película' : 'Serie'}</div>` : '';

    movieCard.innerHTML = `
        ${badgeHtml}
        ${mediaTypeLabel}
        <img src="${posterUrl}" alt="${movie.title || movie.name}" class="movie-poster">
    `;

    // CORRECCIÓN CLAVE: Pasar el tipo de contenido dinámicamente
    movieCard.addEventListener('click', () => {
        // Guardar el estado de búsqueda antes de navegar a los detalles
        const currentState = history.state || { screen: 'home-screen' };

        // Usamos el flag 'searchActive' del estado actual (que es 'movies-screen' con resultados de búsqueda)
        const isComingFromSearch = currentState.searchActive === true;

        history.pushState({
            screen: 'details-screen',
            item: movie,
            type: type || movie.media_type,
            // Guardamos el estado de dónde venimos para restaurarlo
            previousState: currentState
        }, '', '');
        showDetailsScreen(movie, movie.media_type || type)
    });
    return movieCard;
}

function createBannerItem(movie) {
    const bannerItem = document.createElement('div');
    bannerItem.className = 'banner-item';
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://placehold.co/1080x600?text=No+Banner';
    bannerItem.style.backgroundImage = `url('${backdropUrl}')`;

    const localMovie = moviesData.find(m => m.tmdbId === movie.id);
    const isPremium = localMovie && localMovie.isPremium;
    const hasEmbedCode = localMovie && (localMovie.freeEmbedCode || localMovie.proEmbedCode);

    let buttonHtml = '';
    // Aunque localMovie ya no tiene datos, mantenemos esta lógica solo para el botón del banner,
    // que es menos crítico que el de los detalles.
    if (hasEmbedCode) {
        const buttonText = isPremium ? '<i class="fas fa-play"></i> Ver ahora (Versión PRO)' : '<i class="fas fa-play"></i> Ver ahora';
        buttonHtml = `<button class="banner-button red">${buttonText}</button>`;
    }

    bannerItem.innerHTML = `
        <div class="banner-buttons-container">
            ${buttonHtml}
            ${isPremium ? `<span class="pro-badge">PRO</span>` : ''}
        </div>
    `;

    const playButton = bannerItem.querySelector('.red');
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            history.pushState({ screen: 'details-screen', item: movie, type: movie.media_type || 'movie' }, '', '');
            showDetailsScreen(movie, movie.media_type || 'movie');
        });
    }

    bannerItem.addEventListener('click', () => {
        history.pushState({ screen: 'details-screen', item: movie, type: movie.media_type || 'movie' }, '', '');
        showDetailsScreen(movie, movie.media_type || 'movie')
    });
    return bannerItem;
}

function renderCarousel(containerId, movies, type = 'movie') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, movie.media_type || type));
    });
}

function renderGrid(container, movies, type = 'movie') {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, type));
    });
}

async function fetchHistory() {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        historySection.style.display = 'none';
        return;
    }
    try {
        const q = query(collection(db, "history"), where("userId", "==", auth.currentUser.uid), orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => doc.data());
        if (history.length > 0) {
            historySection.style.display = 'block';
            renderCarousel('history-list', history, 'movie');
        } else {
            historySection.style.display = 'none';
        }
    } catch (e) {
        console.error("Error al obtener el historial: ", e);
        historySection.style.display = 'none';
    }
}

async function fetchHomeContent() {
    showLoader();
    try {
        await fetchHistory();

        const popularMovies = await fetchFromTMDB('movie/popular');
        renderCarousel('populares-movies', popularMovies, 'movie');

        const trendingContent = await fetchFromTMDB('trending/all/day');
        renderCarousel('tendencias-movies', trendingContent);

        const actionMovies = await fetchFromTMDB('discover/movie?with_genres=28');
        renderCarousel('accion-movies', actionMovies, 'movie');

        const terrorMovies = await fetchFromTMDB('discover/movie?with_genres=27,9648');
        renderCarousel('terror-movies', terrorMovies, 'movie');

        const animacionMovies = await fetchFromTMDB('discover/movie?with_genres=16');
        renderCarousel('animacion-movies', animacionMovies, 'movie');

        const documentalesMovies = await fetchFromTMDB('discover/movie?with_genres=99');
        renderCarousel('documentales-movies', documentalesMovies, 'movie');

        const scifiMovies = await fetchFromTMDB('discover/movie?with-genres=878');
        renderCarousel('scifi-movies', scifiMovies, 'movie');

        const popularSeries = await fetchFromTMDB('tv/popular');
        renderCarousel('populares-series', popularSeries, 'tv');

        bannerMovies = trendingContent.filter(m => m.backdrop_path);
        renderBannerCarousel();
    } catch (error) {
        console.error("Error fetching home content:", error);
    } finally {
        hideLoader();
    }
}

function renderBannerCarousel() {
    bannerList.innerHTML = '';
    bannerMovies.forEach(movie => {
        bannerList.appendChild(createBannerItem(movie));
    });
    startBannerAutoScroll();
}

function stopBannerAutoScroll() {
    clearInterval(bannerInterval);
    if (resumeAutoScrollTimeout) {
        clearTimeout(resumeAutoScrollTimeout);
    }
}

function startBannerAutoScroll() {
    let currentIndex = 0;
    const scrollAmount = bannerList.clientWidth;
    stopBannerAutoScroll();
    bannerInterval = setInterval(() => {
        if (currentIndex < bannerMovies.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        bannerList.scrollTo({
            left: currentIndex * scrollAmount,
            behavior: 'smooth'
        });
    }, 3000);
}

bannerList.addEventListener('mousedown', stopBannerAutoScroll);
bannerList.addEventListener('mouseup', () => {
    resumeAutoScrollTimeout = setTimeout(startBannerAutoScroll, 10000); // 10 segundos
});
bannerList.addEventListener('touchstart', stopBannerAutoScroll);
bannerList.addEventListener('touchend', () => {
    resumeAutoScrollTimeout = setTimeout(startBannerAutoScroll, 10000); // 10 segundos
});

async function fetchAllGenres(type = 'movie') {
    try {
        const genres = await fetchFromTMDB(`genre/${type}/list`);
        const genreMap = {};
        genres.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
        if (type === 'movie') {
            allMovieGenres = genreMap;
        } else {
            allTvGenres = genreMap;
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

function renderGenresModal(type) {
    genresList.innerHTML = '';
    const currentGenres = type === 'movie' ? allMovieGenres : allTvGenres;
    for (const id in currentGenres) {
        const genreButton = document.createElement('button');
        genreButton.className = 'button secondary';
        genreButton.textContent = currentGenres[id];
        genreButton.onclick = () => {
            fetchFromTMDB(`discover/${type}?with_genres=${id}`).then(items => {
                renderGrid(type === 'movie' ? allMoviesGrid : allSeriesGrid, items, type);
                document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
                if (type === 'movie') moviesScreen.classList.add('active');
                else seriesScreen.classList.add('active');
                closeModal(genresModal);
            });
        };
        genresList.appendChild(genreButton);
    }
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch(searchInput.value);
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        handleSearch(query);
    } else if (query.length === 0) {
        moviesScreen.classList.remove('search-active');
        switchScreen('home-screen');
    }
});

function renderSearchResults(results, filterType = 'all') {
    allMoviesGrid.innerHTML = '';

    const filteredResults = results.filter(item => {
        if (filterType === 'all') {
            return true;
        }
        return item.media_type === filterType;
    });

    filteredResults.forEach(item => {
        if (item.media_type === 'movie' || item.media_type === 'tv') {
            const card = createMovieCard(item, item.media_type);
            allMoviesGrid.appendChild(card);
        }
    });

    if (filteredResults.length === 0) {
        allMoviesGrid.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}

async function handleSearch(query) {
    if (query.length > 2) {
        showLoader();
        try {
            const searchResults = await fetchFromTMDB('search/multi', query);
            lastSearchResults = searchResults.filter(m => m.media_type !== 'person' && m.poster_path);

            renderSearchResults(lastSearchResults);

            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            moviesScreen.classList.add('active', 'search-active');

            document.querySelector('.top-nav').style.display = 'none';
            document.querySelector('.bottom-nav').style.display = 'flex';
            appContainer.style.paddingBottom = '70px';

            history.replaceState({ screen: 'movies-screen', searchActive: true, query: searchInput.value, results: lastSearchResults }, '', `?screen=movies-screen&search=${encodeURIComponent(searchInput.value)}`);

        } catch (error) {
            console.error("Error performing search:", error);
            showCustomAlert('Hubo un error en la búsqueda. Por favor, intenta de nuevo.');
        } finally {
            hideLoader();
        }
    } else if (query.length === 0) {
        moviesScreen.classList.remove('search-active');
        switchScreen('home-screen');
    }
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterType = button.getAttribute('data-filter');
        renderSearchResults(lastSearchResults, filterType);
    });
});

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    moviesScreen.classList.remove('search-active');

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
        if (navItem) navItem.classList.add('active');
        if (!history.state || history.state.screen !== screenId) {
             history.pushState({ screen: screenId }, '', `?screen=${screenId}`);
        }
    }

    // [CRÍTICO]: DETENER EL REPRODUCTOR AL SALIR DE DETAILS O TV
    resetEmbeddedPlayer();
    // La lógica de detener HLS ya está en resetEmbeddedPlayer, pero aquí aseguramos que se detiene el video normal también.
    if (tv_video) {
        tv_video.pause();
    }


    if (screenId === 'movies-screen') {
        if (!searchOverlay.classList.contains('active')) {
            renderAllMovies();
            searchFilters.style.display = 'none';
        }
    } else if (screenId === 'series-screen') {
        renderAllSeries();
        searchFilters.style.display = 'none';
    } else if (screenId === 'home-screen') {
        fetchHomeContent();
        searchFilters.style.display = 'none';
    } else if (screenId === 'favorites-screen') {
        fetchFavorites();
        searchFilters.style.display = 'none';
    } else if (screenId === 'events-screen') {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('profile-screen').classList.add('active');
        searchFilters.style.display = 'none';
    }
    // [LÓGICA TV] NUEVA PANTALLA
    else if (screenId === 'tv-live-screen') {
        // Lógica de inicialización de TV
        if (country_nav.children.length === 0) {
            renderCountryButtons();
        }
        // Llamamos al filtro por defecto (MX) if not hay uno activo
        if (document.querySelector('#country-nav .country-button.active') === null || tv_channel_grid.children.length === 0) {
            tv_filterChannels('MX');
        }
        searchFilters.style.display = 'none';
    }


    const topNav = document.querySelector('.top-nav');
    const bottomNav = document.querySelector('.bottom-nav');
    const isSearchActive = searchOverlay.classList.contains('active');

    if (screenId === 'auth-screen') {
        topNav.style.display = 'none';
        bottomNav.style.display = 'none';
        appContainer.style.paddingBottom = '0';
    } else if (isSearchActive) {
        topNav.style.display = 'none';
        bottomNav.style.display = 'flex';
        appContainer.style.paddingBottom = '70px';
        if (screenId === 'movies-screen') {
            moviesScreen.classList.add('search-active');
        }
    } else {
        topNav.style.display = 'flex';
        // Asegura que las barras se vean en todas las pantallas de contenido (incluyendo TV)
        if (screenId === 'home-screen' || screenId === 'movies-screen' || screenId === 'series-screen' || screenId === 'profile-screen' || screenId === 'details-screen' || screenId === 'events-screen' || screenId === 'tv-live-screen') {
            bottomNav.style.display = 'flex';
            appContainer.style.paddingBottom = '70px';
        } else {
            bottomNav.style.display = 'none';
            appContainer.style.paddingBottom = '0';
        }
    }
}

window.addEventListener('popstate', async (event) => {
    const state = event.state;

    // [CRÍTICO]: LLAMAR A resetEmbeddedPlayer() en el popstate para manejar la navegación hacia atrás
    resetEmbeddedPlayer();

    closeAllModals();

    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));

    if (state) {
        if (state.screen === 'details-screen') {
            const item = state.item;
            const type = state.type;
            if (item && type) {
                showDetailsScreen(item, type);
            } else {
                switchScreen('home-screen');
            }
        } else {
            const previousStateIsSearch = state.searchActive;

            if (previousStateIsSearch) {
                searchOverlay.classList.add('active');
                moviesScreen.classList.add('active');
                moviesScreen.classList.add('search-active');

                searchInput.value = state.query || '';
                if (state.results) {
                    lastSearchResults = state.results;
                    renderSearchResults(lastSearchResults, 'all');
                }

                document.querySelector('.top-nav').style.display = 'none';
                document.querySelector('.bottom-nav').style.display = 'flex';
                appContainer.style.paddingBottom = '70px';
                searchFilters.style.display = 'flex';

            } else {
                searchOverlay.classList.remove('active');
                moviesScreen.classList.remove('search-active');
                switchScreen(state.screen);
            }
        }
    } else {
        switchScreen('home-screen');
    }
});


// Listener para Abrir Búsqueda
if (btnOpenSearch) {
    btnOpenSearch.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();

        document.querySelector('.top-nav').style.display = 'none';
        document.querySelector('.bottom-nav').style.display = 'flex';
        appContainer.style.paddingBottom = '70px';

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        moviesScreen.classList.add('active', 'search-active');
        searchFilters.style.display = 'flex';

        if (lastSearchResults.length > 0) {
            renderSearchResults(lastSearchResults);
        } else {
            allMoviesGrid.innerHTML = '';
        }

        history.pushState({ screen: 'movies-screen', searchActive: true, query: searchInput.value, results: lastSearchResults }, '', `?screen=movies-screen&search=${encodeURIComponent(searchInput.value)}`);
    });
}

// Listener para Cerrar Búsqueda
if (closeSearchButton) {
    closeSearchButton.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        moviesScreen.classList.remove('search-active');

        searchInput.value = '';
        lastSearchResults = [];
        renderSearchResults(lastSearchResults);

        switchScreen('home-screen');
    });
}

// ======================================================================
// ✅ NUEVA IMPLEMENTACIÓN: BOTÓN DE ACCESO RÁPIDO PREMIUM (Corona)
// ======================================================================
if (btnQuickPremiumAccess) {
    btnQuickPremiumAccess.addEventListener('click', () => {
        // Verifica si el usuario está autenticado Y si su estado es PRO
        const isPro = currentUser && currentUser.isPro;

        if (isPro) {
            // Caso 1: Usuario Premium - Muestra el modal de gestión/beneficios
            showModal(membershipInfoModal);
        } else {
            // Caso 2: Usuario Gratuito o Anónimo - Muestra el modal de promoción/compra
            showModal(premiumInfoModal);
        }
    });
}
// ======================================================================
// ❌ FIN NUEVA IMPLEMENTACIÓN
// ======================================================================


document.querySelectorAll('.nav-item, .profile-button[data-screen]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreenId = e.currentTarget.getAttribute('data-screen');
        if (targetScreenId) {
            switchScreen(targetScreenId);
        }
    });
});

// [NUEVO LISTENER] Para que el botón de Telegram use el deep link de Android
if (btnOpenCommunity) {
    btnOpenCommunity.addEventListener('click', (e) => {
        e.preventDefault(); // Detiene la acción por defecto del enlace
        // Esta URL activa la lógica de Telegram en MainActivity.kt
        window.location.href = 'https://t.me/+cSG-iHxIneg5YjAx';
    });
}


authBackButton.addEventListener('click', (e) => {
    e.preventDefault();
    history.back();
});

seeMoreButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const endpoint = e.currentTarget.getAttribute('data-endpoint');
        const type = e.currentTarget.getAttribute('data-type');

        showLoader();
        try {
            const items = await fetchFromTMDB(endpoint);
            if (type === 'movie') {
                renderGrid(allMoviesGrid, items, 'movie');
                switchScreen('movies-screen');
            } else {
                renderGrid(allSeriesGrid, items, 'tv');
                switchScreen('series-screen');
            }
        } catch (error) {
            console.error("Error loading 'See more' content:", error);
            showCustomAlert('No se pudo cargar el contenido. Intenta de nuevo.');
        } finally {
            hideLoader();
        }
    });
});

genresButton.addEventListener('click', () => {
    renderGenresModal('movie');
    showModal(genresModal);
});
seriesGenresButton.addEventListener('click', () => {
    renderGenresModal('tv');
    showModal(genresModal);
});

async function renderAllMovies() {
    showLoader();
    try {
        const movies = await fetchFromTMDB('discover/movie?sort_by=popularity.desc');
        renderGrid(allMoviesGrid, movies, 'movie');
    } catch (error) {
        console.error("Error rendering all movies:", error);
        showCustomAlert('No se pudieron cargar las películas. Intenta de nuevo.');
    } finally {
        hideLoader();
    }
}

async function renderAllSeries() {
    showLoader();
    try {
        const series = await fetchFromTMDB('discover/tv?sort_by=popularity.desc');
        renderGrid(allSeriesGrid, series, 'tv');
    } catch (error) {
        console.error("Error rendering all series:", error);
        showCustomAlert('No se pudieron cargar las series. Intenta de nuevo.');
    } finally {
        hideLoader();
    }
}

async function addToFavorites(movie) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    try {
        await addDoc(collection(db, "favorites"), {
            userId: auth.currentUser.uid,
            tmdbId: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            type: movie.media_type || 'movie'
        });
        showCustomAlert('Añadido a Mi lista');
    } catch (e) {
        console.error("Error adding favorite: ", e);
        showCustomAlert('No se pudo añadir a la lista.');
    }
}

async function fetchFavorites() {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }
    showLoader();
    try {
        const q = query(collection(db, "favorites"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const favorites = querySnapshot.docs.map(doc => doc.data());
        renderGrid(favoritesGrid, favorites, 'movie');
    } catch (e) {
        console.error("Error fetching favorites: ", e);
        showCustomAlert('No se pudieron cargar los favoritos.');
    } finally {
        hideLoader();
    }
}

async function playAd() {
    return new Promise((resolve) => {
        console.log("Simulating ad playback...");
        showCustomAlert('Anuncio: El video comenzará en breve.');
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

submitRequestButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        switchScreen('auth-screen');
        return;
    }

    const movieTitle = movieRequestInput.value.trim();
    if (movieTitle === '') {
        showAppMessage(requestMessage, 'Por favor, ingresa el título de la película.', 'error');
        return;
    }

    try {
        await addDoc(collection(db, "requests"), {
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName || 'Anónimo',
            movieTitle: movieTitle,
            requestedAt: new Date()
        });

        const successMsg = "Tu solicitud fue enviada. Si eres usuario gratuito, espera 3 a 6 horas. Si eres usuario premium, espera alrededor de 2 horas.";
        showAppMessage(requestMessage, successMsg, 'success');
        movieRequestInput.value = '';
    } catch (e) {
        console.error("Error adding movie request: ", e);
        showAppMessage(requestMessage, 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.', 'error');
    }
});

const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
    });
});

proStatusButton.addEventListener('click', async () => {
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
    } else {
        // CAMBIO: Usar el nuevo modal de selección de pago
        showModal(paymentMethodModal);
        showPlanSelectionView(); // Asegura mostrar los planes primero
    }
});

if (createAccountButton) {
    createAccountButton.addEventListener('click', () => {
        switchScreen('auth-screen');
        loginForm.classList.remove('active-form');
        signupForm.classList.add('active-form');
    });
}

if (profileLoginLink) {
    profileLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('auth-screen');
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
    });
}

if(authLoginLink){
    authLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
    });
}

premiumInfoCtaButton.addEventListener('click', () => {
    closeModal(premiumInfoModal);
    // CAMBIO: Usar el nuevo modal de selección de pago
    showModal(paymentMethodModal);
    showPlanSelectionView(); // Asegura mostrar los planes primero
});

premiumInfoLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(premiumInfoModal);
    switchScreen('auth-screen');
    loginForm.classList.add('active-form');
    signupForm.classList.remove('active-form');
});

profileMyList.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.isAnonymous) {
        switchScreen('auth-screen');
    } else {
        switchScreen('favorites-screen');
    }
});
profilePrivacy.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('privacy-screen');
});
profileTerms.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('terms-screen');
});
profileSubscription.addEventListener('click', (e) => {
    e.preventDefault();
    // CAMBIO: Usar el nuevo modal de selección de pago
    showModal(paymentMethodModal);
    showPlanSelectionView();
});
profileHelpCenter.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen('help-screen');
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active-form');
    signupForm.classList.add('active-form');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active-form');
    loginForm.classList.add('active-form');
});

signupButton.addEventListener('click', async () => {
    signupMessage.style.display = 'none';
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!termsAccepted) {
        showAppMessage(signupMessage, 'Debes aceptar los términos y condiciones para continuar.', 'error');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showAppMessage(signupMessage, '¡Registro exitoso! Por favor, activa tu Cuenta Premium.', 'success');
        switchScreen('profile-screen');
        // CAMBIO: Usar el nuevo modal de selección de pago
        showModal(paymentMethodModal);
        showPlanSelectionView();
    } catch (error) {
        console.error("Signup error:", error);
        let userMessage = 'Error al registrarse. Intenta de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
             userMessage = 'Este correo ya está registrado. ¿Quieres iniciar sesión?';
        } else if (error.code === 'auth/weak-password') {
             userMessage = 'La contraseña debe tener al menos 6 caracteres.';
        }
        showAppMessage(signupMessage, userMessage, 'error');
    }
});

loginButton.addEventListener('click', async () => {
    loginMessage.style.display = 'none';
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAppMessage(loginMessage, '¡Inicio de sesión exitoso!', 'success');
        switchScreen('profile-screen');
    } catch (error) {
        console.error("Login error:", error);
        let userMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
            userMessage = 'Correo no registrado o inválido.';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            userMessage = 'Contraseña incorrecta.';
        }
        showAppMessage(loginMessage, userMessage, 'error');
    }
});

socialLoginButtons.forEach(button => {
    button.addEventListener('click', () => {
        showCustomAlert('Esta funcionalidad aún no está disponible.');
    });
});

// ======================================================================
// ✅ NUEVA LÓGICA DE PAGO POR MÉTODO
// ======================================================================

function showPlanSelectionView() {
    plansContainerMethod.style.display = 'flex';
    paymentOptionsContainer.style.display = 'none';
    currentSelectedPlan = null;
    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('active-plan'));
}

function showPaymentOptionsView(plan, amount) {
    const planName = plan === 'monthly' ? 'Plan Mensual' : 'Plan Anual';
    plansContainerMethod.style.display = 'none';
    paymentOptionsContainer.style.display = 'flex';
    selectedPlanTitle.textContent = planName;
    selectedPlanDetail.textContent = `$${amount} (${plan === 'monthly' ? '1 mes' : '1 año'})`;
    currentSelectedPlan = { plan: plan, amount: amount };

    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('active-plan'));
    document.querySelector(`.plan-card[data-plan="${plan}"]`).classList.add('active-plan');
}

// 1. Manejo del botón de elección de plan
buyMethodButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const plan = e.target.getAttribute('data-plan');
        const amount = e.target.getAttribute('data-amount');

        if (!currentUser || currentUser.isAnonymous) {
            closeModal(paymentMethodModal);
            switchScreen('auth-screen');
            return;
        }

        showPaymentOptionsView(plan, amount);
    });
});

// 2. Manejo del botón de regreso a planes
btnBackToPlans.addEventListener('click', showPlanSelectionView);

// 3. Manejo del pago por PayPal
btnPayPaypal.addEventListener('click', async () => {
    if (!currentSelectedPlan) return;

    const { plan, amount } = currentSelectedPlan;

    try {
        // Redirección a la URL de tu servidor (Mismo endpoint de antes)
        const response = await fetch('https://serivisios.onrender.com/create-paypal-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan: plan,
                amount: amount,
                userId: currentUser.uid
            })
        });

        const data = await response.json();

        if (response.ok && data.approval_url) {
            window.location.href = data.approval_url;
        } else {
            showCustomAlert('Error al iniciar el pago con PayPal. Verifica la configuración en tu servidor.');
        }
    } catch (error) {
        console.error("Error processing PayPal payment:", error);
        showCustomAlert('Hubo un error al procesar tu pago con PayPal. Intenta de nuevo.');
    }
});

// 4. Manejo del pago por Telegram
btnPayTelegram.addEventListener('click', () => {
    if (!currentSelectedPlan) return;

    const planName = currentSelectedPlan.plan === 'monthly' ? 'Plan Mensual' : 'Plan Anual';
    const amount = currentSelectedPlan.amount;
    const userEmail = currentUser.email || 'Usuario No Registrado';
    const userId = currentUser.uid;

    const message = `Hola, quiero activar mi Plan ${planName} de $${amount}. Mi correo es ${userEmail} y mi ID de usuario es ${userId}. Por favor, envíame los métodos de pago alternativos (Tarjeta, Binance, etc.).`;

    const telegramUrl = `${TELEGRAM_PREMIUM_CONTACT_URL}?text=${encodeURIComponent(message)}`;

    closeModal(paymentMethodModal);
    showCustomAlert('Redirigiendo a Telegram. Envía el mensaje preescrito para recibir asistencia personalizada.');
    window.open(telegramUrl, '_blank');
});

// --- Integración con botones antiguos que abren el modal ---
if (profileSubscription) {
    profileSubscription.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(paymentMethodModal);
        showPlanSelectionView();
    });
}
// ======================================================================
// ❌ FIN NUEVA LÓGICA DE PAGO POR MÉTODO
// ======================================================================

signoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showCustomAlert('Has cerrado sesión.');
        window.location.reload();
    } catch (error) {
        console.error("Sign out error:", error);
        showCustomAlert('No se pudo cerrar sesión. Intenta de nuevo.');
    }
});

// --- LISTENERS DE NOTIFICACIONES Y EVENTOS ---

if (btnOpenNotifications) {
    btnOpenNotifications.addEventListener('click', () => {
        renderNotifications();
        showModal(userNotificationsModal);
    });
}
if (notificationsClose) {
    notificationsClose.addEventListener('click', () => {
        closeModal(userNotificationsModal);
    });
}

if (btnClearAllNotifications) {
    btnClearAllNotifications.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que quieres borrar todas tus notificaciones?')) {
            showLoader();
            try {
                const batch = db.batch();
                notificationsData.forEach(notif => {
                    if (notif.docId) {
                        const notifRef = doc(db, 'userNotifications', notif.docId);
                        batch.delete(notifRef);
                    }
                });
                await batch.commit();
                showCustomAlert('Se han borrado todas tus notificaciones.');
            } catch (error) {
                console.error("Error al borrar notificaciones:", error);
                showCustomAlert('Hubo un error al borrar las notificaciones. Intenta de nuevo.');
            } finally {
                hideLoader();
            }
        }
    });
}

if (btnPubSaveNotify) {
    btnPubSaveNotify.addEventListener('click', async () => {
        const embedLink = document.getElementById('admin-embed-input').value || 'Link_Simulado_PRO';

        try {
            await addDoc(collection(db, "userNotifications"), {
                title: '¡Nueva Película Publicada!',
                description: `Contenido nuevo disponible: ${embedLink.substring(0, 15)}...`,
                image: 'https://placehold.co/50x70?text=NEW',
                timestamp: new Date(),
                isRead: false,
                type: 'movie',
                targetScreen: 'details-screen'
            });

            showCustomAlert('Película guardada y notificación enviada a los usuarios. (Simulado)');
            closeModal(contentPublishingModal);

        } catch (error) {
             console.error("Error al simular notificación real:", error);
             showCustomAlert('Error: No se pudo conectar a la colección de notificaciones. Revisa Firebase.');
        }
    });
}

// NUEVA FUNCIÓN: Carga estática de películas y series
async function fetchAppData() {
    try {
        // CORRECCIÓN CRÍTICA: Eliminamos la lectura de Firebase Firestore
        // El catálogo principal ahora se carga dinámicamente con TMDB y tu servidor.
        moviesData = [];
        seriesData = [];
    } catch (e) {
        console.error("Error fetching app data statically:", e);
    }
}


let isInitialized = false;
onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    // Lógica de autenticación y estado PRO (siempre debe ejecutarse para actualizar la UI)
    const quickPremiumIcon = document.querySelector('#btn-quick-premium-access i');
    if (user && !user.isAnonymous) {
        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'block';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'none';
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (((typeof userDocSnap.exists === 'function') ? userDocSnap.exists() : !!userDocSnap.exists) && userDocSnap.data().isPro) {
            currentUser.isPro = true;

            // ===================================================
            // INICIO: LLAMADA NATIVA CORREGIDA (PREMIUM)
            // ===================================================
            if (window.Android) {
                console.log("Notificando a Android: setPremiumStatus(true)");
                window.Android.setPremiumStatus(true);
            }
            // ===================================================

            if (proStatusButton) {
                proStatusButton.textContent = 'Cuenta Premium Activada';
                proStatusButton.disabled = true;
            }
            // ✅ Corona con estilo de color activo (rojo brillante)
            if(quickPremiumIcon) quickPremiumIcon.classList.add('premium-active');

        } else {
            currentUser.isPro = false;

            // ===================================================
            // INICIO: LLAMADA NATIVA CORREGIDA (NO PREMIUM)
            // ===================================================
            if (window.Android) {
                console.log("Notificando a Android: setPremiumStatus(false)");
                window.Android.setPremiumStatus(false);
            }
            // ===================================================

            if (proStatusButton) {
                proStatusButton.textContent = 'Activar Cuenta Premium';
                proStatusButton.disabled = false;
            }
            // ❌ Corona con color por defecto (gris)
            if(quickPremiumIcon) quickPremiumIcon.classList.remove('premium-active');
        }
    } else {
        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'none';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'block';
        }

        // ===================================================
        // INICIO: LLAMADA NATIVA CORREGIDA (ANÓNIMO/LOGOUT)
        // ===================================================
        if (window.Android) {
            console.log("Notificando a Android: setPremiumStatus(false)");
            window.Android.setPremiumStatus(false);
        }
        // ===================================================

        if (!user) {
             // Si Firebase no se inicializa, signInAnonymously falla.
             // La función signInAnonymously debe estar disponible globalmente.
             if (window.firebase && window.firebase.auth && window.firebase.auth.signInAnonymously) {
                 window.firebase.auth.signInAnonymously(auth);
             }
        }
        // ❌ Corona con color por defecto (gris)
        if(quickPremiumIcon) quickPremiumIcon.classList.remove('premium-active');
    }

    if (!isInitialized) {
        // 1. Mostrar el loader inmediatamente como primer paso de inicialización
        showLoader();

        // [CRÍTICO] Temporizador de seguridad para forzar la visualización si Firebase falla
        const safetyTimeout = setTimeout(() => {
            console.error("TIMEOUT: Firebase/API excedió el tiempo límite. Forzando la visualización del contenido.");
            hideLoader();
            appContainer.style.display = 'block'; // Asegura que el contenedor principal esté visible
            switchScreen('home-screen'); // Forzar la navegación para quitar el spinner
        }, 5000); // 5 segundos de espera máxima


        // 2. Realizar todas las tareas de configuración y carga de datos
        isInitialized = true;
        setupRealtimeNotificationsListener();

        initializeTheme();

        // CORRECCIÓN CRÍTICA: Cargamos estáticamente todos los datos al inicio.
        await fetchAppData();

        await fetchAllGenres('movie');
        await fetchAllGenres('tv');
        updateNotificationIndicator(); // Inicializar el indicador de notificaciones

        // 3. Ocultar el loader y mostrar el contenedor principal de la aplicación.
        appContainer.style.display = 'block';
        hideLoader();

        // [CRÍTICO] Limpia el temporizador si la carga fue exitosa
        clearTimeout(safetyTimeout);

        // === LÓGICA CORREGIDA: Manejar el ID de Telegram MiniApp ===
        const startAppId = getURLParameter('startapp');
        if (startAppId) {
            try {
                // El endpoint de TMDB /details devuelve el objeto de detalle directamente.
                // Intentamos buscar primero como película.
                let fullItem = await fetchFromTMDB(`movie/${startAppId}`);
                let type = 'movie';

                // Si no es una película válida (el endpoint devuelve un error), intentamos como serie de TV.
                if (!fullItem || fullItem.status_code === 34 || !fullItem.id) {
                     fullItem = await fetchFromTMDB(`tv/${startAppId}`);
                     type = 'tv';
                }

                if (fullItem && fullItem.id) {
                    // Aseguramos que el objeto tenga el tipo para que showDetailsScreen funcione
                    fullItem.media_type = type;

                    // Empujamos el estado de detalles antes de mostrar
                    history.pushState({ screen: 'details-screen', item: fullItem, type: type }, '', '');
                    showDetailsScreen(fullItem, type);
                } else {
                    // Si no se encuentra, ir a la pantalla de inicio por defecto
                    switchScreen('home-screen');
                }
            } catch (error) {
                console.error("Error al cargar contenido desde Telegram:", error);
                // Si hay error, vamos al inicio como fallback
                switchScreen('home-screen');
            }
        } else {
            // 4. Navegar a la pantalla principal por defecto
            switchScreen('home-screen');
        }
    }
});


// ======================================================================
// LÓGICA DE TV EN VIVO (M3U) - BLOQUE PRINCIPAL DE LA INTEGRACIÓN
// ======================================================================

// 1. LISTA DE FUENTES EXTERNAS (Global)
const country_sources = {
    MX: { name: "México", url: "https://iptv-org.github.io/iptv/countries/mx.m3u" },
    EC: { name: "Ecuador", url: "https://iptv-org.github.io/iptv/countries/ec.m3u" },
    AR: { name: "Argentina", url: "https://iptv-org.github.io/iptv/countries/ar.m3u" },
    CL: { name: "Chile", url: "https://iptv-org.github.io/iptv/countries/cl.m3u" },
    MUSIC: { name: "Música", url: "https://iptv-org.github.io/iptv/categories/music.m3u" },
    DOCS: { name: "Documentales", url: "https://iptv-org.github.io/iptv/categories/documentaries.m3u" },
    ALL: { name: "Todos", url: "https://iptv-org.github.io/iptv/index.m3u" },
    SPORTS: { name: "Deportes (Premium)", url: "https://iptv-org.github.io/iptv/categories/sports.m3u", premium: true }
};

let cached_channels = {};

/**
 * @brief Función para cargar y reproducir un canal.
 */
function tv_loadChannel(item, index, countryCode) {
    const channels = cached_channels[countryCode];
    if (!channels || channels.length === 0) return;

    const channel = channels[index];
    const url = channel.url;
    const name = channel.name;

    tv_current_name.textContent = `Reproduciendo: ${name} (${countryCode})`;

    if (tv_currentItem) {
        tv_currentItem.classList.remove('active');
    }
    // Usamos el elemento clicado
    const currentItem = document.querySelector(`.tv-grid-item[data-index="${index}"][data-country="${countryCode}"]`);
    if (currentItem) {
         currentItem.classList.add('active');
         tv_currentItem = currentItem;
    }

    if (hls_instance) {
        hls_instance.destroy();
        hls_instance = null;
    }

    // Es CRÍTICO asegurar que window.Hls exista (se carga en index.html)
    if (window.Hls && Hls.isSupported() && (url.endsWith('.m3u8') || url.includes('.m3u8'))) {
        hls_instance = new Hls();
        hls_instance.attachMedia(tv_video);
        hls_instance.on(Hls.Events.MEDIA_ATTACHED, function () {
            hls_instance.loadSource(url);
            hls_instance.on(Hls.Events.MANIFEST_PARSED, function () {
                tv_video.play().catch(e => console.log("Error de auto-play:", e));
            });
            hls_instance.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    tv_current_name.textContent = `❌ ERROR: ${name} (Stream caído)`;
                    hls_instance.destroy();
                }
            });
        });
    } else if (tv_video.canPlayType('application/vnd.apple.mpegurl')) {
        tv_video.src = url;
        tv_video.addEventListener('loadedmetadata', function () { tv_video.play().catch(e => console.log("Error de auto-play nativo:", e)); });
    } else {
        tv_video.src = url;
        tv_video.play().catch(e => {
            tv_current_name.textContent = `⚠️ ADVERTENCIA: Error al iniciar ${name} (URL no soportada)`;
        });
    }
}

/**
 * @brief Renderiza los canales en la cuadrícula.
 */
function tv_renderChannelGrid(channels, countryCode) {
    if (!tv_channel_grid) return;
    tv_channel_grid.style.display = 'grid';
    if (premium_wall) premium_wall.style.display = 'none';

    let htmlContent = '';
    channels.forEach((channel, index) => {
        const name = channel.name;
        const info = channel.info || 'HD/SD';
        // CRÍTICO: El index es relativo al arreglo de canales que se está mostrando.
        // Si la búsqueda reduce la lista, el índice ya no corresponde al caché global.
        // Para simplificar y mantener la referencia a la lista filtrada, usamos el índice local.
        htmlContent += `
            <div class="tv-grid-item" data-index="${index}" data-country="${countryCode}" onclick="tv_loadChannel(this, ${index}, '${countryCode}')">
                <div class="tv-grid-item-content">
                    <div class="tv-grid-item-title">${name}</div>
                    <div class="tv-grid-item-info">${info} | En vivo</div>
                </div>
            </div>
        `;
    });
    tv_channel_grid.innerHTML = htmlContent;
}

/**
 * @brief Analiza el contenido de un archivo M3U para extraer el nombre del canal de forma robusta.
 */
function parseM3U(m3uContent, categoryName) {
    const channels = [];
    const lines = m3uContent.split('\n');
    let currentChannel = {};

    for (const line of lines) {
        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            let channelName = 'Canal Desconocido';

            if (parts.length > 1) {
                channelName = parts[parts.length - 1].trim();
            }

            let info = categoryName;
            const qualityMatch = line.match(/\s(\d+p|HD|SD|FHD)\b/i);
            if (qualityMatch) {
                info = qualityMatch[1].toUpperCase();
            }

            channelName = channelName.replace(/\s*\[.*?\]\s*/g, '').replace(/\s*\(.*?\)\s*/g, '').trim();

            if (channelName === '') {
                const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
                channelName = tvgNameMatch ? tvgNameMatch[1].trim() : 'Canal Desconocido';
            }

            const tvgIDMatch = line.match(/tvg-id="([^"]*)"/);
            const tvgID = tvgIDMatch ? tvgIDMatch[1].trim() : '';

            currentChannel = {
                name: channelName,
                info: info,
                tvgId: tvgID
            };
        } else if (line.startsWith('http') || line.startsWith('https')) {
            if (currentChannel.name) {
                currentChannel.url = line.trim();
                // Filtramos streams con aviso de geobloqueo
                if (!currentChannel.name.includes('[Geo-blocked]') && !currentChannel.name.includes('[Not 24/7]')) {
                    channels.push(currentChannel);
                }
            }
            currentChannel = {};
        }
    }
    return channels;
}


/**
 * @brief Filtra y carga los canales por país/categoría, manejando la lógica Premium.
 */
async function tv_filterChannels(countryCode) {
    // 1. Manejo de la botonera activa
    if (country_nav) {
        document.querySelectorAll('#country-nav .country-button').forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.country-button[data-country="${countryCode}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // NUEVA LÍNEA: Actualiza la variable global con el código activo
    currentActiveCountryCode = countryCode;

    const source = country_sources[countryCode];

    // 2. Lógica de Muro Premium (Integración Real)
    // currentUser.isPro es establecido en onAuthStateChanged
    if (source.premium && (!currentUser || !currentUser.isPro)) {
        if (tv_channel_grid) tv_channel_grid.style.display = 'none';
        if (premium_wall) premium_wall.style.display = 'block';
        if (tv_current_name) tv_current_name.textContent = "¡Sección Premium! Activa tu plan.";
        if (hls_instance) hls_instance.destroy();
        if (tv_video) tv_video.src = '';
        return;
    }

    // Ocultar muro de pago y mostrar la cuadrícula
    if (premium_wall) premium_wall.style.display = 'none';
    if (tv_channel_grid) {
        tv_channel_grid.style.display = 'grid';
        tv_channel_grid.innerHTML = '<p style="color:#E50914; text-align:center; padding-top:20px;">Cargando canales, espera un momento...</p>';
    }
    if (tv_current_name) tv_current_name.textContent = `Cargando: ${source.name}...`;

    let channelsToRender = [];

    if (cached_channels[countryCode]) {
        channelsToRender = cached_channels[countryCode];
    } else {
        try {
            const response = await fetch(source.url);
            if (!response.ok) throw new Error('Error al cargar la lista M3U');

            const m3uContent = await response.text();
            channelsToRender = parseM3U(m3uContent, source.name);

            cached_channels[countryCode] = channelsToRender;

        } catch (error) {
            console.error("Fallo al obtener o parsear el M3U:", error);
            if (tv_channel_grid) tv_channel_grid.innerHTML = `<p style="color:#f00; text-align:center; padding-top:20px;">❌ Error al cargar canales de ${source.name}.</p>`;
            if (tv_current_name) tv_current_name.textContent = `ERROR: No se pudo cargar ${source.name}.`;
            if (hls_instance) hls_instance.destroy();
            if (tv_video) tv_video.src = '';
            return;
        }
    }

    // 4. Renderizar y cargar el primer canal
    tv_renderChannelGrid(channelsToRender, countryCode);

    const firstChannel = document.querySelector(`#tv-channel-grid .tv-grid-item[data-country="${countryCode}"]`);
    if (firstChannel && channelsToRender.length > 0) {
        // Carga el primer canal de la lista CREADA por tv_renderChannelGrid
        tv_loadChannel(firstChannel, 0, countryCode);
    } else {
        if (tv_current_name) tv_current_name.textContent = `No se encontraron canales disponibles para ${source.name}.`;
        if (tv_channel_grid) tv_channel_grid.innerHTML = `<p style="color:#aaa; text-align:center; padding-top:20px;">No hay canales en esta sección. Intenta con otra o recarga la página.</p>`;
        if (hls_instance) hls_instance.destroy();
        if (tv_video) tv_video.src = '';
    }
}

/**
 * @brief Filtra los canales de TV por texto de búsqueda en tiempo real. (Implementación solicitada)
 */
function tv_searchChannels(query) {
    const countryCode = currentActiveCountryCode;
    const allChannels = cached_channels[countryCode] || [];

    // Si la búsqueda está vacía, renderiza todos los canales de la categoría actual
    if (!query || query.trim() === "") {
        tv_renderChannelGrid(allChannels, countryCode);
        return;
    }

    const lowerCaseQuery = query.toLowerCase().trim();
    const filteredChannels = allChannels.filter(channel =>
        channel.name.toLowerCase().includes(lowerCaseQuery)
    );

    tv_renderChannelGrid(filteredChannels, countryCode);

    // Muestra un mensaje si no hay resultados
    if (filteredChannels.length === 0) {
        if (tv_channel_grid) {
            tv_channel_grid.innerHTML = `<p style="color:#aaa; text-align:center; padding-top:20px;">No se encontraron canales que coincidan con "${query}".</p>`;
        }
    }
}


/**
 * @brief Renderiza los botones de país en el elemento #country-nav.
 */
function renderCountryButtons() {
    if (!country_nav) return;
    country_nav.innerHTML = '';
    for (const code in country_sources) {
        const source = country_sources[code];
        const button = document.createElement('button');
        button.className = `country-button ${code === 'MX' ? 'active' : ''} ${source.premium ? 'premium' : ''}`;
        button.textContent = source.name;
        button.setAttribute('data-country', code);
        // CRÍTICO: Usa window.tv_filterChannels para que el onClick sea global
        button      .onclick = () => window.tv_filterChannels(code);
        country_nav.appendChild(button);
    }
}

// ======================================================================
// [PASO CRÍTICO] HACER FUNCIONES DE TV GLOBALES PARA EL ONCLICK DEL HTML
// ======================================================================
window.tv_loadChannel = tv_loadChannel;
window.tv_filterChannels = tv_filterChannels;
window.renderCountryButtons = renderCountryButtons;
window.switchScreen = switchScreen;
// ======================================================================
// FIN BLOQUE TV
// ======================================================================

// --- LISTENER DE BÚSQUEDA DE TV EN VIVO (Implementación solicitada) ---
const tvSearchInput = document.getElementById('tv-search-input');
if (tvSearchInput) {
    tvSearchInput.addEventListener('input', (e) => {
        tv_searchChannels(e.target.value);
    });
}
