// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Reemplaza con tu clave
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInAnonymously
} = auth;
const {
    doc,
    collection,
    getDoc,
    onSnapshot,
    query,
    where,
    limit,
    getDocs
} = db;


// --- Variables Globales ---
let currentUser = null;
let currentScreen = 'home-screen';
let moviesData = [];
let seriesData = [];
let genres = {
    movie: [],
    tv: []
};

// --- Elementos del DOM ---
const appContainer = document.getElementById('app-container');
const loader = document.getElementById('loader');
const navLinks = document.querySelectorAll('.nav-link');
const screens = document.querySelectorAll('.screen');
const authTabs = document.querySelectorAll('.auth-tab');

// Auth Screen Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupButton = document.getElementById('signup-button');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

// Profile & Premium Elements
const profileLoggedIn = document.getElementById('profile-logged-in');
const profileLoggedOut = document.getElementById('profile-logged-out');
const proStatusButton = document.getElementById('pro-status-button');
const profileButton = document.getElementById('profile-button');
const logoutButton = document.getElementById('logout-button');
const profileEmail = document.getElementById('profile-email');
const profileUsername = document.getElementById('profile-username');
const profileStatus = document.getElementById('profile-status');

// Request Screen Elements
const movieRequestInput = document.getElementById('movie-request-input');
const submitRequestButton = document.getElementById('submit-request-button');

// Modal Elements
const paymentModal = document.getElementById('payment-modal');
const closeModalButton = paymentModal ? paymentModal.querySelector('.close-button') : null;
const planCards = document.querySelectorAll('.plan-card');

// NUEVOS Elementos de Nombre de Usuario
const usernameSetupScreen = document.getElementById('username-setup-screen');
const usernameInput = document.getElementById('username-input');
const saveUsernameButton = document.getElementById('save-username-button');
const usernameError = document.getElementById('username-error');
const trialButton = document.getElementById('trial-button'); // NUEVO Botón de Prueba


// --- Funciones de Utilidad ---

function showLoader() {
    loader.style.display = 'flex';
}

function hideLoader() {
    loader.style.display = 'none';
}

function switchScreen(screenId, targetData = null) {
    currentScreen = screenId;
    screens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === screenId) {
            screen.classList.add('active');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-screen') === screenId) {
            link.classList.add('active');
        }
    });

    if (screenId === 'detail-screen' && targetData) {
        renderDetailScreen(targetData);
    }
    if (screenId === 'profile-screen') {
        renderProfileScreen();
    }
}

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// --- Renderizado de Contenido ---

function renderContentCarousel(title, items, type) {
    const categorySection = document.getElementById('content-categories');
    const carouselHTML = `
        <div class="content-row">
            <h3>${title}</h3>
            <div class="carousel-container">
                <div class="carousel-content">
                    ${items.map(item => `
                        <div class="content-card" data-id="${item.id}" data-type="${type}">
                            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                            <p>${item.title || item.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    categorySection.insertAdjacentHTML('beforeend', carouselHTML);
}

function renderDetailScreen(item) {
    const detailContent = document.getElementById('detail-content');
    const type = item.title ? 'movie' : 'tv';
    
    detailContent.innerHTML = `
        <div class="detail-backdrop" style="background-image: url('https://image.tmdb.org/t/p/w1280${item.backdrop_path}')"></div>
        <div class="detail-info">
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" class="detail-poster">
            <div class="detail-text">
                <h1>${item.title || item.name}</h1>
                <p class="detail-genres">${item.genres.map(g => g.name || g).join(' | ')}</p>
                <p class="detail-rating">⭐ ${item.vote_average.toFixed(1)}</p>
                <p class="detail-overview">${item.overview}</p>
                <p class="detail-release">Lanzamiento: ${item.release_date || item.first_air_date || 'N/A'}</p>
                <button class="button primary">Ver Ahora</button>
                <button class="button secondary">Agregar a Lista</button>
            </div>
        </div>
    `;
}

function renderProfileScreen() {
    if (!currentUser || currentUser.isAnonymous) {
        profileEmail.textContent = 'N/A';
        profileUsername.textContent = 'Anónimo';
        profileStatus.textContent = 'Gratis';
        return;
    }
    
    profileEmail.textContent = currentUser.email || 'N/A';
    profileUsername.textContent = currentUser.username || 'No establecido';
    
    let statusText = 'Gratis';
    if (currentUser.isPro) {
        statusText = 'Premium';
    } else if (currentUser.emailVerified) {
        statusText = 'Verificado (Gratis)';
    }

    profileStatus.textContent = statusText;
}


// --- Lógica de la Aplicación ---

async function fetchHomeContent() {
    // Implementación simple de carruseles de inicio
    const categorySection = document.getElementById('content-categories');
    categorySection.innerHTML = ''; // Limpiar carruseles

    // Ejemplo de Carrusel 1: Películas Populares
    renderContentCarousel('Películas Destacadas', moviesData.slice(0, 10), 'movie');
    
    // Ejemplo de Carrusel 2: Series de TV
    renderContentCarousel('Series Imperdibles', seriesData.slice(0, 10), 'tv');
}

async function fetchAllGenres(type) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.TMDB_API_KEY}&language=es`);
        const data = await response.json();
        genres[type] = data.genres;
    } catch (error) {
        console.error(`Error fetching ${type} genres:`, error);
    }
}


// --- Event Listeners ---

// Navegación de pantalla
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const screenId = link.getAttribute('data-screen');
        switchScreen(screenId);
    });
});

// Cambios de pestaña de autenticación
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        loginForm.classList.remove('active-form');
        signupForm.classList.remove('active-form');
        document.getElementById(tab.getAttribute('data-form')).classList.add('active-form');
    });
});

// Clic en tarjetas de contenido para ir a detalle
appContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.content-card');
    if (card) {
        const itemId = card.getAttribute('data-id');
        const itemType = card.getAttribute('data-type');
        
        const dataArray = itemType === 'movie' ? moviesData : seriesData;
        const item = dataArray.find(i => i.id === itemId);

        if (item) {
            switchScreen('detail-screen', item);
        }
    }
});

// Botón de Perfil
if (profileButton) {
    profileButton.addEventListener('click', () => {
        switchScreen('profile-screen');
    });
}

// Botón de Cerrar Sesión
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            switchScreen('home-screen');
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
}

// Botón Premium (Abre modal de pago)
if (proStatusButton) {
    proStatusButton.addEventListener('click', () => {
        if (!currentUser || currentUser.isAnonymous) {
            alert('Debes iniciar sesión para ver los planes.');
            switchScreen('auth-screen');
            return;
        }
        openModal(paymentModal);
    });
}

// Botones de Modal de Pago (Seleccionar Plan)
planCards.forEach(card => {
    card.querySelector('.select-plan').addEventListener('click', async () => {
        if (!currentUser || currentUser.isAnonymous) return;

        const plan = card.getAttribute('data-plan');
        const amount = card.getAttribute('data-amount');
        
        try {
            const response = await fetch('https://serivisios.onrender.com/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, plan, userId: currentUser.uid })
            });

            const data = await response.json();
            if (data.approval_url) {
                window.open(data.approval_url, '_blank');
            } else {
                alert('Error al iniciar el pago con PayPal.');
            }
        } catch (error) {
            console.error("Error al iniciar pago:", error);
            alert('Error al conectar con el servidor de pagos.');
        }
    });
});

// Cierre del modal de pago
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => closeModal(paymentModal));
}
window.addEventListener('click', (event) => {
    if (event.target === paymentModal) {
        closeModal(paymentModal);
    }
});

// Lógica de Registro (Modificado para usar el servidor y verificación de email)
signupButton.addEventListener('click', async () => {
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!termsAccepted) {
        alert('Debes aceptar los términos y condiciones para continuar.');
        return;
    }
    
    try {
        // Llamada al servidor para registro y envío de email.
        const response = await fetch('https://serivisios.onrender.com/register', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message + ' Por favor, revisa tu correo y luego inicia sesión.');
            // Muestra el formulario de inicio de sesión después del registro exitoso
            loginForm.classList.add('active-form');
            signupForm.classList.remove('active-form');
        } else {
             alert(`Error al registrarse: ${data.error}`);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert('Hubo un error al conectar con el servidor. Intenta de nuevo.');
    }
});

// Lógica de Solicitud de Película (Modificado para enviar userId)
submitRequestButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        alert('Debes iniciar sesión para solicitar un contenido.');
        switchScreen('auth-screen');
        return;
    }

    const movieTitle = movieRequestInput.value.trim();
    if (movieTitle === '') {
        alert('Por favor, ingresa el título de la película.');
        return;
    }

    try {
        // ENVIAR EL userId al backend para priorizar el pedido
        const response = await fetch('https://serivisios.onrender.com/request-movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: movieTitle,
                userId: auth.currentUser.uid // ENVIAMOS EL ID DEL USUARIO
            })
        });
        
        if (response.ok) {
            alert('¡Solicitud enviada! Gracias por tu sugerencia.');
            movieRequestInput.value = '';
        } else {
            alert('Hubo un error al enviar la solicitud. Intenta de nuevo.');
        }
    } catch (error) {
        console.error("Error adding movie request: ", error);
        alert('No se pudo enviar la solicitud. Intenta de nuevo.');
    }
});


// ----------------------------------------------------
// Lógica de Nombre de Usuario (NUEVA)
// ----------------------------------------------------

saveUsernameButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username.length < 3) {
        usernameError.textContent = 'El nombre debe tener al menos 3 caracteres.';
        usernameError.style.display = 'block';
        return;
    }
    
    if (!currentUser || currentUser.isAnonymous) return;

    try {
        const response = await fetch('https://serivisios.onrender.com/update-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.uid, username: username })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser.username = data.username; // Actualiza el objeto de usuario local
            usernameError.style.display = 'none';
            // Recarga el estado para asegurar la correcta navegación
            window.location.reload(); 
        } else {
            usernameError.textContent = data.error; // Muestra error de duplicado
            usernameError.style.display = 'block';
        }
    } catch (error) {
        console.error("Error al guardar nombre:", error);
        usernameError.textContent = 'Error de conexión al servidor.';
        usernameError.style.display = 'block';
    }
});


// ----------------------------------------------------
// Lógica de Prueba Gratuita (NUEVA)
// ----------------------------------------------------
if (trialButton) {
    trialButton.addEventListener('click', async () => {
        if (!currentUser || currentUser.isAnonymous) {
            alert('Debes iniciar sesión para activar la prueba.');
            switchScreen('auth-screen');
            return;
        }

        try {
            const response = await fetch('https://serivisios.onrender.com/activate-trial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.uid })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                closeModal(paymentModal);
                window.location.reload(); // Recarga para actualizar el estado del usuario
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al activar la prueba:', error);
            alert('Hubo un error al conectar con el servidor. Intenta de nuevo.');
        }
    });
}


// --- Lógica Principal de Autenticación y Estado (Modificada) ---

let isInitialized = false;
auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    
    if (user && !user.isAnonymous) {
        profileLoggedIn.style.display = 'block';
        profileLoggedOut.style.display = 'none';
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let isProStatus = false;
        let isVerified = false;
        
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // 1. Obtener estados
            isVerified = userData.isVerified;
            currentUser.username = userData.username;

            // Lógica de Prueba Gratuita y Premium
            const today = new Date();
            const trialEndDate = userData.trialEndDate ? userData.trialEndDate.toDate() : null;
            
            // El usuario es PRO si: 1) Compró el plan (isPro) O 2) Su prueba no ha expirado
            const isTrialActive = userData.hasFreeTrial && trialEndDate && trialEndDate > today;
            isProStatus = userData.isPro || isTrialActive;

            currentUser.isPro = isProStatus;
            
            // 2. PRIORIDAD 1: Forzar Verificación de Correo
            if (!isVerified) {
                if (proStatusButton) {
                    proStatusButton.textContent = 'Verifica tu Correo 📧';
                    proStatusButton.disabled = true;
                }
                // Si el usuario llega a otra pantalla sin verificar, lo alertamos
                if (document.querySelector('.screen.active').id !== 'auth-screen') {
                     alert('Por favor, revisa tu correo electrónico y haz clic en el enlace para verificar tu cuenta.');
                }
                // Si está en la pantalla de inicio de sesión, permitimos que se quede ahí.
                return; 
            }
            
            // 3. PRIORIDAD 2: Forzar Nombre de Usuario
            if (isVerified && !currentUser.username && document.querySelector('.screen.active').id !== 'username-setup-screen') {
                switchScreen('username-setup-screen');
                return; // Detiene el proceso hasta que establezca el nombre.
            }
            
            // 4. Actualizar Botón de Estado
            if (proStatusButton) {
                if (isProStatus) {
                    let statusText = 'Cuenta Premium Activada';
                    if (isTrialActive) {
                         // Usamos Moment.js para mostrar el tiempo restante de forma legible
                         statusText = `Prueba Gratuita Activa (Expira ${moment(trialEndDate).fromNow()})`;
                    }
                    proStatusButton.textContent = statusText;
                    proStatusButton.disabled = true;
                    // Ocultar botón de prueba si ya está activa
                    if (trialButton) trialButton.style.display = 'none';
                } else if (userData.hasFreeTrial) {
                     // Prueba expirada, forzamos la compra
                    proStatusButton.textContent = 'Prueba Expirada. ¡Comprar Plan!';
                    proStatusButton.disabled = false;
                    if (trialButton) trialButton.style.display = 'none';
                } else {
                    // Usuario Gratis (puede activar prueba o comprar)
                    proStatusButton.textContent = 'Activar Cuenta Premium';
                    proStatusButton.disabled = false;
                    if (trialButton) trialButton.style.display = 'block';
                }
            }
        }
    } else {
        // Lógica de usuario anónimo o deslogueado
        profileLoggedIn.style.display = 'none';
        profileLoggedOut.style.display = 'block';
        if (!user) {
             await signInAnonymously(auth);
        }
    }

    if (!isInitialized) {
        isInitialized = true;
        showLoader();
        // Cargar datos y finalizar la inicialización
        const moviesColRef = collection(db, 'movies');
        onSnapshot(moviesColRef, (snapshot) => {
            moviesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            fetchHomeContent();
        });
        
        const seriesColRef = collection(db, 'series');
        onSnapshot(seriesColRef, (snapshot) => {
            seriesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        });
        
        await fetchAllGenres('movie');
        await fetchAllGenres('tv');
        switchScreen('home-screen');
        hideLoader();
    }
});
