import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, addDoc, orderBy, limit, updateDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCF5lyEIFkKhzgc4kOMebWZ7oZrxWDNw2Y",
    authDomain: "app-aeff2.firebaseapp.com",
    projectId: "app-aeff2",
    storageBucket: "app-aeff2.firebasestorage.app",
    messagingSenderId: "12229598213",
    appId: "1:12229599999:web:80555d9999999999999",
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
const paymentModal = document.getElementById('payment-modal'); 
const proStatusButton = document.getElementById('pro-status-button');
const signoutButton = document.getElementById('signout-button');
const buyButtons = document.querySelectorAll('.buy-button');
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
const osSelectionModal = document.getElementById('os-selection-modal');
const osModalTitle = document.getElementById('os-modal-title');
const osModalText = document.getElementById('os-modal-text');
const osModalCta = document.getElementById('os-modal-cta');
const selectedPlanName = document.getElementById('selected-plan-name');
const osModalCloseButton = document.querySelector('#os-selection-modal .close-button');
const btnToggleTheme = document.getElementById('btn-toggle-theme');
const btnDownloadApp = document.getElementById('btn-download-app'); 
const downloadAppModal = document.getElementById('download-app-modal');
const btnOpenSearch = document.getElementById('btn-open-search');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchButton = document.getElementById('close-search-button');
const searchInput = document.getElementById('search-input'); 
const viewCountDisplay = document.getElementById('view-count-display'); 
const likeCountDisplayText = document.getElementById('like-count-display-text'); 
const favoriteButton = document.getElementById('favorite-button'); 
const commentInput = document.getElementById('comment-input');
const btnPostComment = document.getElementById('btn-post-comment');
const commentsFeed = document.getElementById('comments-feed');
const noCommentsMessage = document.getElementById('no-comments-message');
const relatedMoviesContainer = document.getElementById('related-movies'); 
const detailsTabsHeader = document.getElementById('details-tabs-header');
const detailsTabsContent = document.getElementById('details-tabs-content');
const tv_video = document.getElementById('tv-video-player');
const tv_channel_grid = document.getElementById('tv-channel-grid');
const tv_current_name = document.getElementById('tv-current-channel-name');
const premium_wall = document.getElementById('premium-wall');
const country_nav = document.getElementById('country-nav');
let tv_currentItem = null;
let hls_instance = null;
let currentActiveCountryCode = 'MX'; 

const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');
const requestMessage = document.getElementById('request-message');
const detailsRequestMessage = document.getElementById('details-request-message');
const btnOpenNotifications = document.getElementById('btn-open-avisos'); 
const userNotificationsModal = document.getElementById('user-notifications-modal');
const btnClearAllNotifications = document.getElementById('btn-clear-all-notifications');
const notificationsClose = document.getElementById('notifications-close');
const contentPublishingModal = document.getElementById('admin-avisos-modal');
const btnPubSaveNotify = document.getElementById('btn-save-notify-app-new'); 

let moviesData = []; 
let seriesData = []; 
let bannerMovies = [];
let allMovieGenres = {};
let allTvGenres = {};
let bannerInterval;
let resumeAutoScrollTimeout;
let currentUser = null; 
let currentMovieOrSeries = null;
let currentFullTMDBItem = null; 
let lastSearchResults = [];

// --- Funciones de Utilidad de OS ---

function isiOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isAndroidFocus() {
    return !isiOS();
}
// --- Fin nuevos elementos para la lógica de OS ---


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
                <small>${timeString}</small>
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
        document.getElementById('payment-modal'),
        document.getElementById('free-ad-modal'),
        document.getElementById('pro-restriction-modal'),
        document.getElementById('download-app-modal'),
        userNotificationsModal,
        contentPublishingModal,
        osSelectionModal
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

function showOSSelectionModal(plan) {
    closeModal(paymentModal); 
    const planName = plan === 'annual' ? 'Anual' : 'Mensual';
    
    if (isiOS()) {
        osModalTitle.innerHTML = `<i class="fab fa-apple"></i> ¡Atención, Usuario iPhone!`;
        osModalText.textContent = 'Lamentamos informarte que la activación Premium para usuarios de iPhone aún no está disponible. Estará lista muy pronto.';
        osModalCta.textContent = 'Entendido, ¡espero!';
        osModalCta.onclick = () => {
            closeModal(osSelectionModal);
        };
    } else {
        osModalTitle.innerHTML = `<i class="fas fa-desktop"></i> Continuar con la compra`;
        osModalText.textContent = `Seleccionaste el plan ${planName}. Serás redirigido a la pasarela de pago para completar la activación de tu cuenta.`;
        osModalCta.textContent = 'Continuar a Pago';
        osModalCta.onclick = () => {
            closeModal(osSelectionModal);
            initPaypalPayment(plan); 
        };
    }
    
    selectedPlanName.textContent = planName;
    showModal(osSelectionModal);
}

if (osModalCloseButton) {
    osModalCloseButton.onclick = () => {
        closeModal(osSelectionModal);
    };
}


function getURLParameter(name) {
    if (name === 'startapp' && 
        window.Telegram && 
        window.Telegram.WebApp && 
        window.Telegram.WebApp.initDataUnsafe && 
        window.Telegram.WebApp.initDataUnsafe.start_param) {
        
        return window.Telegram.WebApp.initDataUnsafe.start_param; 
    }
    
    const urlParams = new URLSearchParams(window.location.search); 
    return urlParams.get(name);
}

function resetDetailsPlayer() {
    if (embeddedPlayerContainer) {
        embeddedPlayerContainer.style.display = 'none';
        embeddedPlayerContainer.innerHTML = '';
    }
    detailsPosterTop.style.backgroundColor = 'transparent';
    detailsPosterTop.style.backgroundImage = ''; 
    playButtonContainer.style.display = 'flex';
}

// --- Lógica del Tema Dual (Sin cambios) ---

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
        // Llama al endpoint de MongoDB/Server
        const response = await fetch(`https://serivisios.onrender.com/api/get-metrics?id=${tmdbId}&field=${field}`);
        if (!response.ok) {
            if (response.status === 404) return 0;
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data.count || 0; 
    } catch (e) {
        console.error(`Error fetching ${field} count:`, e);
        return 0;
    }
}

// CORREGIDO: Lógica de VISTAS (Ahora llama al servidor para incrementar en MongoDB)
async function incrementViewCount(tmdbId) {
    if (!tmdbId) return;
    try {
        // Llama al endpoint de MongoDB/Server
        await fetch(`https://serivisios.onrender.com/api/increment-views`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId: tmdbId.toString() })
        });
    } catch (e) {
        console.error(`Error al registrar la vista para ${tmdbId}:`, e);
    }
}

// LÓGICA DE LIKES ÚNICOS Y PERSISTENTES (Mantenida en Firebase para tracking individual)
async function checkUserLiked(tmdbId) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return false;
    }
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'movieLikes'), 
        where('userId', '==', userId), 
        where('tmdbId', '==', tmdbId.toString()),
        limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

async function renderLikeState(tmdbId) {
    const hasLiked = await checkUserLiked(tmdbId);
    if (favoriteButton) {
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
        alert('Ya has dado "Me Gusta" a este contenido.');
        return;
    }

    try {
        // 1. Incrementa el contador total en el servidor (MongoDB)
        await fetch(`https://serivisios.onrender.com/api/increment-likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId: tmdbId.toString() })
        });
        
        // 2. Registra el like del usuario en Firebase (Baja frecuencia)
        await addDoc(collection(db, 'movieLikes'), {
            userId: userId,
            tmdbId: tmdbId.toString(),
            timestamp: new Date()
        });

        renderLikeState(tmdbId); 
        
        const newCount = await getCount(tmdbId, 'likes');
        if (likeCountDisplayText) {
            likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${newCount} Me Gusta`;
        }
    } catch (e) {
        console.error("Error al registrar like:", e);
        alert('Hubo un error al registrar tu "Me Gusta".');
    }
}

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
        showModal(paymentModal);
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
    showModal(paymentModal);
});

async function addMovieToHistory(item) {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        return;
    }
    try {
        const historyRef = collection(db, 'history');
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
        
        const isEmbedUrl = embedCode.startsWith('http') || embedCode.startsWith('//');
        if (isEmbedUrl) {
             embeddedPlayerContainer.innerHTML = `<iframe src="${embedCode}" FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=100% HEIGHT=100% allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>`;
        } else {
             embeddedPlayerContainer.innerHTML = embedCode;
        }

        incrementViewCount(currentMovieOrSeries.tmdbId);
        addMovieToHistory(item);
    }
}

// *** FUNCIÓN CORREGIDA: renderMoviePlayButtons (On-demand check + Bypass Premium) ***
async function renderMoviePlayButtons(localMovie, tmdbMovie) {
    playButtonContainer.innerHTML = '';
    showLoader(); 

    let embedCodeAvailable = false;
    const tmdbIdToUse = tmdbMovie.id;

    try {
        // 1. Verificación de disponibilidad contra el servidor/MongoDB
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
                    alert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
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
    showLoader(); 
    const tmdbIdToUse = tmdbSeries.id;

    try {
        playButtonContainer.innerHTML = '';
        seasonsContainer.style.display = 'block';
        seasonsContainer.innerHTML = '<h3>Temporadas</h3>';
        episodesContainer.innerHTML = ''; 

        const seriesDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}`);

        if (!seriesDetails || !seriesDetails.seasons) {
             throw new Error("No seasons data available for this series.");
        }

        seriesDetails.seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.className = 'season-button';
            seasonButton.textContent = `Temporada ${season.season_number}`;
            
            seasonButton.onclick = async () => {
                showLoader(); 
                episodesContainer.innerHTML = '<h3>Episodios</h3><div class="episodes-grid"></div>';
                const episodesGrid = episodesContainer.querySelector('.episodes-grid');
                const seasonNumber = season.season_number;
                const seasonDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}/season/${seasonNumber}`);

                if (!seasonDetails || !seasonDetails.episodes) {
                    hideLoader();
                    alert('No se encontraron episodios para esta temporada.');
                    return;
                }

                // === CÓDIGO CRÍTICO PARA LA OPTIMIZACIÓN (LLAMADA ÚNICA AL SERVIDOR) ===
                const availabilityResponse = await fetch(`https://serivisios.onrender.com/api/check-season-availability?id=${tmdbIdToUse}&season=${seasonNumber}`);
                const availabilityData = await availabilityResponse.json();
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
                                alert('Hubo un error al cargar el reproductor. Intenta de nuevo.');
                            } finally {
                                hideLoader();
                            }
                        };
                    } else {
                        // El episodio NO está en MongoDB. Configura el botón Pedir.
                        episodeButton.classList.add('request-episode-button');
                        episodeButton.textContent = `E${episode.episode_number} (Pedir)`;
                        episodeButton.onclick = () => {
                            playButtonContainer.innerHTML = '';
                            renderRequestButton(tmdbSeries);
                        };
                    }

                    episodesGrid.appendChild(episodeButton);
                } 
                hideLoader(); 
            };
            seasonsContainer.appendChild(seasonButton);
        });
    } catch (error) {
        console.error('Error al renderizar los botones de temporadas:', error);
        seasonsContainer.innerHTML = '<p>No se encontraron temporadas para esta serie.</p>';
        renderRequestButton(tmdbSeries);
    } finally {
        hideLoader(); 
    }
}


function renderRequestButton(tmdbItem) {
    const requestButton = document.createElement('button');
    requestButton.className = 'request-movie-button';
    requestButton.innerHTML = `<i class="fas fa-paper-plane"></i> Pedir ahora`;
    requestButton.onclick = async () => {
        if (!auth.currentUser || auth.currentUser.isAnonymous) {
            alert('Debes iniciar sesión para solicitar un contenido.');
            switchScreen('auth-screen');
            return;
        }
        try {
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
                    alert(successMsg);
                }
            } else {
                alert('Hubo un error al enviar la solicitud. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al solicitar el contenido:', error);
            alert('No se pudo conectar con el servidor para enviar la solicitud.');
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
            userName: currentUser.email ? currentUser.email.split('@')[0] : 'Usuario', 
            text: text.trim(),
            timestamp: new Date()
        });
        commentInput.value = '';
        detailsScreen.classList.remove('writing-comment');
        commentInput.blur();
    } catch (e) {
        console.error("Error al publicar comentario:", e);
        alert('No se pudo publicar el comentario.');
    }
}

if (btnPostComment) {
    btnPostComment.addEventListener('click', () => {
        if (currentMovieOrSeries && currentMovieOrSeries.tmdbId) {
            postComment(currentMovieOrSeries.tmdbId, commentInput.value);
        }
    });
}

if (commentInput) {
    commentInput.addEventListener('focus', () => {
        if (!currentUser || currentUser.isAnonymous) {
            history.pushState({ 
                screen: 'auth-screen', 
                previousScreen: 'details-screen', 
                previousItem: currentFullTMDBItem, 
                previousType: currentFullTMDBItem.type
            }, '', '');
            switchScreen('auth-screen');
            commentInput.blur(); 
            return;
        }

        detailsScreen.classList.add('writing-comment');
    });
    commentInput.addEventListener('blur', () => {
        if (!commentInput.value) {
            detailsScreen.classList.remove('writing-comment');
        }
    });
}

function renderComments(tmdbId) {
    const commentsColRef = collection(db, 'comments');
    const q = query(commentsColRef, where("tmdbId", "==", tmdbId.toString()), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        commentsFeed.innerHTML = '';
        if (snapshot.empty) {
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

// --- Funciones Auxiliares TMDB (Sin cambios) ---
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
            throw new Error(`Error de la API: ${response.status}`);
        }
        const data = await response.json();
        return data.results || data.items || data;
    } catch (error) {
        console.error("Error en la llamada a fetchFromTMDB:", error);
        throw error;
    }
}
function setupDetailsTabs(tmdbItem, type) {
    if (!detailsTabsHeader || !detailsTabsContent) {
        console.error("Tab containers not found in DOM.");
        return; 
    }
    
    const tabButtons = detailsTabsHeader.querySelectorAll('.tab-button');
    const tabPanes = detailsTabsContent.querySelectorAll('.tab-pane');
    
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
                
                if (targetTabId === 'related-content-pane') {
                    if (relatedMoviesContainer.children.length === 0) {
                        fetchRelatedContent(tmdbItem, type);
                    }
                }
            }
        });
    });
    
    document.getElementById('related-content-pane').classList.add('active');
    document.getElementById('comments-content-pane').classList.remove('active');
    document.querySelector('.tab-button[data-tab="related-content-pane"]').classList.add('active');
    document.querySelector('.tab-button[data-tab="comments-content-pane"]').classList.remove('active');
}

async function fetchRelatedContent(item, type) {
    try {
        const tmdbEndpointType = type === 'movie' ? 'movie' : 'tv';
        const related = await fetchFromTMDB(`${tmdbEndpointType}/${item.id}/similar`);
        renderCarousel('related-movies', related, type);
    } catch (error) {
        console.error("Error fetching related content:", error);
        relatedMoviesContainer.innerHTML = '<p style="padding: 10px;">No se encontraron contenidos similares.</p>';
    }
}

// ** FUNCIÓN ORIGINAL CAUSANTE DEL ERROR (Ahora renombrada en el backend para evitar conflicto) **
// La función original era fetchAllGenres.
async function getTMDBGenres(type = 'movie') {
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
                renderGrid(allMoviesGrid, items, type);
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
            alert('Hubo un error en la búsqueda. Por favor, intenta de nuevo.');
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

    if (screenId === 'movies-screen') {
        if (!searchOverlay.classList.contains('active')) {
            renderAllMovies();
            searchFilters.style.display = 'none';
        }
    } else if (screenId === 'series-screen') {
        renderAllSeries();
        searchFilters.style.display = 'none';
    } else if (screenId === 'home-screen') {
        fetchHomeContent(); // 👈 Función CRÍTICA añadida
        searchFilters.style.display = 'none';
    } else if (screenId === 'favorites-screen') {
        fetchFavorites();
        searchFilters.style.display = 'none';
    } else if (screenId === 'events-screen') {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('profile-screen').classList.add('active'); 
        searchFilters.style.display = 'none';
    }
    // [Lógica TV]
    else if (screenId === 'tv-live-screen') {
        if (country_nav.children.length === 0) {
            renderCountryButtons();
        }
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
    
    resetDetailsPlayer(); 
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


// Listener para el botón de Descarga (CORREGIDO: Usando la variable renombrada)
if (btnDownloadApp) {
    btnDownloadApp.addEventListener('click', () => {
        showModal(downloadAppModal);
    });
}

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


document.querySelectorAll('.nav-item, .profile-button[data-screen]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreenId = e.currentTarget.getAttribute('data-screen');
        if (targetScreenId) {
            switchScreen(targetScreenId);
        }
    });
});
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
            // Aseguramos que la navegación a la pantalla correcta se realice después de cargar
            if (type === 'movie') {
                renderGrid(allMoviesGrid, items, 'movie');
                switchScreen('movies-screen');
            } else {
                renderGrid(allSeriesGrid, items, 'tv');
                switchScreen('series-screen');
            }
        } catch (error) {
            console.error("Error loading 'See more' content:", error);
            alert('No se pudo cargar el contenido. Intenta de nuevo.');
        } finally {
            hideLoader();
        }
    });
});

genresButton.addEventListener('click', () => {
    getTMDBGenres('movie');
    renderGenresModal('movie');
    showModal(genresModal);
});
seriesGenresButton.addEventListener('click', () => {
    getTMDBGenres('tv');
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
        alert('No se pudieron cargar las películas. Intenta de nuevo.');
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
        alert('No se pudieron cargar las series. Intenta de nuevo.');
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
        alert('Añadido a Mi lista');
    } catch (e) {
        console.error("Error adding favorite: ", e);
        alert('No se pudo añadir a la lista.');
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
        alert('No se pudieron cargar los favoritos.');
    } finally {
        hideLoader();
    }
}

async function playAd() {
    return new Promise((resolve) => {
        console.log("Simulating ad playback...");
        alert('Anuncio: El video comenzará en breve.');
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
        showModal(paymentModal);
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
    showModal(paymentModal);
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
    showModal(paymentModal);
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
        showModal(paymentModal);
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
        alert('Esta funcionalidad aún no está disponible.');
    });
});

// === NUEVA LÓGICA: Redirigir a ventana de selección de OS antes de iniciar pago ===
buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!currentUser || currentUser.isAnonymous) {
            switchScreen('auth-screen');
            return;
        }
        const plan = e.target.getAttribute('data-plan');
        showOSSelectionModal(plan);
    });
});

async function initPaypalPayment(plan) {
    if (!currentUser || currentUser.isAnonymous) return;

    try {
        const amount = (plan === 'annual') ? '19.99' : '1.99';
        
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
            alert('Error al iniciar el pago con PayPal. Verifica la configuración en tu servidor.');
        }
    } catch (error) {
        console.error("Error processing PayPal payment:", error);
        alert('Hubo un error al procesar tu pago con PayPal. Intenta de nuevo.');
    }
}

if (buyWithPaypalButton) {
    buyWithPaypalButton.addEventListener('click', () => {
        alert('Selecciona un plan antes de continuar con el pago.');
    });
}
if (buyWithBinanceButton) {
    buyWithBinanceButton.addEventListener('click', () => {
        alert('Redirigiendo a Binance... (Funcionalidad simulada)');
    });
}

signoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('Has cerrado sesión.');
        window.location.reload();
    } catch (error) {
        console.error("Sign out error:", error);
        alert('No se pudo cerrar sesión. Intenta de nuevo.');
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
                alert('Se han borrado todas tus notificaciones.');
            } catch (error) {
                console.error("Error al borrar notificaciones:", error);
                alert('Hubo un error al borrar las notificaciones. Intenta de nuevo.');
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
            
            alert('Película guardada y notificación enviada a los usuarios. (Simulado)');
            closeModal(contentPublishingModal); 

        } catch (error) {
             console.error("Error al simular notificación real:", error);
             alert('Error: No se pudo conectar a la colección de notificaciones. Revisa Firebase.');
        }
    });
}

// NUEVA FUNCIÓN: Carga estática de películas y series (VACIADA para usar TMDB)
async function fetchAppData() {
    // CORRECCIÓN CRÍTICA: Se vacía la carga de catálogo masivo de Firebase.
    moviesData = [];
    seriesData = [];
}

// ======================================================================
// 📌 FUNCIONES AGREGADAS PARA CORREGIR ReferenceError (fetchHomeContent, renderGrid, etc.)
// ======================================================================

// --- Base Rendering Functions (Fixes renderGrid not defined) ---

function createMovieCard(item, type) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Check if the item is a full TMDB item or a simplified favorite
    const itemId = item.id || item.tmdbId;
    const itemType = item.media_type || type;
    const itemTitle = item.title || item.name;
    const posterPath = item.poster_path;

    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${itemTitle}" class="movie-poster" onerror="this.onerror=null;this.src='https://placehold.co/130x195?text=No+Poster'">
        ${item.vote_average ? `<span class="badge">${item.vote_average.toFixed(1)}</span>` : ''}
        ${itemType === 'tv' ? '<span class="media-type-label">Serie</span>' : '<span class="media-type-label">Película</span>'}
    `;

    card.addEventListener('click', async () => {
        showLoader();
        try {
            // Fetch full details since card data is often partial
            let fullItem = await fetchFromTMDB(`${itemType}/${itemId}`);
            if (fullItem) {
                 fullItem.media_type = itemType; 
                 currentMovieOrSeries = { tmdbId: itemId, type: itemType, title: itemTitle };
                 history.pushState({ screen: 'details-screen', item: fullItem, type: itemType }, '', `?screen=details-screen&id=${itemId}&type=${itemType}`);
                 showDetailsScreen(fullItem, itemType);
            }
        } catch (error) {
             console.error("Error al cargar detalles:", error);
             alert('No se pudo cargar la información detallada.');
        } finally {
             hideLoader();
        }
    });

    return card;
}

function renderGrid(containerElement, items, type) {
    if (!containerElement) return;
    containerElement.innerHTML = '';
    
    // Filter out items without posters
    const filteredItems = Array.isArray(items) ? items.filter(item => item.poster_path) : [];

    filteredItems.forEach(item => {
        const card = createMovieCard(item, type);
        containerElement.appendChild(card);
    });

    if (filteredItems.length === 0) {
        containerElement.innerHTML = '<p style="padding: 20px;">No se encontraron resultados para mostrar.</p>';
    }
}

// --- Detail Screen Helper Functions ---

async function fetchMovieCastAndDirector(tmdbId, type) {
    try {
        const credits = await fetchFromTMDB(`${type}/${tmdbId}/credits`);
        const cast = credits.cast.slice(0, 5).map(c => c.name).join(', ');
        
        let director = 'N/A';
        const directorCrew = credits.crew.find(crew => crew.job === 'Director');
        if (directorCrew) {
            director = directorCrew.name;
        }

        return { cast, director };
    } catch (error) {
        console.error("Error fetching cast/director:", error);
        return { cast: 'N/A', director: 'N/A' };
    }
}

async function updateMetricsDisplay(tmdbId) {
    try {
        const views = await getCount(tmdbId, 'views');
        const likes = await getCount(tmdbId, 'likes');

        if (viewCountDisplay) {
            viewCountDisplay.innerHTML = `<i class="fas fa-eye"></i> ${views} Vistas`;
        }
        if (likeCountDisplayText) {
            likeCountDisplayText.innerHTML = `<i class="fas fa-heart"></i> ${likes} Me Gusta`;
        }
    } catch (e) {
        console.error("Error al actualizar métricas:", e);
    }
}

async function showDetailsScreen(item, type) {
    currentFullTMDBItem = item;
    currentMovieOrSeries = { tmdbId: item.id, type: type, title: item.title || item.name };
    resetDetailsPlayer();
    
    // UI Updates
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    detailsScreen.classList.add('active');
    appContainer.scrollTo(0, 0);

    // Populate Info
    detailsTitle.textContent = item.title || item.name;
    detailsYear.textContent = item.release_date ? item.release_date.substring(0, 4) : (item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A');
    detailsSinopsis.textContent = item.overview || 'Sinopsis no disponible.';

    const genreNames = (item.genres || []).map(g => g.name).join(', ');
    detailsGenres.textContent = genreNames;

    const posterUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : 'https://placehold.co/800x450?text=No+Image';
    detailsPosterTop.style.backgroundImage = `url(${posterUrl})`;
    
    // Cast & Director
    const { cast, director } = await fetchMovieCastAndDirector(item.id, type);
    directorName.textContent = director;
    actorsList.textContent = cast;
    
    // Tabs & Metrics
    setupDetailsTabs(item, type);
    updateMetricsDisplay(item.id);
    renderLikeState(item.id);
    renderComments(item.id);

    // Play Buttons (The critical part)
    if (type === 'movie') {
        seasonsContainer.style.display = 'none';
        episodesContainer.innerHTML = '';
        renderMoviePlayButtons(null, item);
    } else { // type === 'tv'
        seasonsContainer.style.display = 'block';
        renderSeriesButtons(null, item);
    }
}

// Making showDetailsScreen globally available (for onclick in createMovieCard and banner)
window.showDetailsScreen = showDetailsScreen;

// --- Home Screen Content Loading Functions (Fixes fetchHomeContent not defined) ---

// Función para simplificar la carga y renderizado de un carrusel
async function fetchAndRenderCarousel(endpoint, containerId, type) {
    try {
        const items = await fetchFromTMDB(endpoint);
        // Maneja la estructura de respuesta de TMDB
        const dataToRender = Array.isArray(items) ? items : (items.results ? items.results : []);
        // Filtra para asegurar que haya un poster
        renderCarousel(containerId, dataToRender.filter(i => i.poster_path), type);
    } catch (error) {
        console.warn(`Error al cargar carrusel ${containerId}:`, error);
    }
}

// Función para renderizar el contenido en un carrusel horizontal
function renderCarousel(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
        const card = createMovieCard(item, item.media_type || type); 
        container.appendChild(card);
    });
}

// Función para renderizar el carrusel de banners superiores
function renderBanner(items) {
    const bannerList = document.getElementById('banner-list');
    if (!bannerList) return;
    bannerList.innerHTML = '';
    
    items.forEach(item => {
        const banner = document.createElement('div');
        banner.className = 'banner-item';
        // Usa backdrop_path para las imágenes de banner
        const imagePath = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : 'https://placehold.co/800x450?text=No+Image';
        banner.style.backgroundImage = `url(${imagePath})`;
        
        const itemType = item.media_type || (item.title ? 'movie' : 'tv');
        const itemTitle = item.title || item.name;

        // FIX CRÍTICO: Escapar el título para el onclick para evitar errores con comillas simples (ej. "King's Man")
        const safeTitle = (itemTitle || '').replace(/'/g, "\\'"); 
        const safePoster = (item.poster_path || '').replace(/'/g, "\\'"); 
        
        banner.innerHTML = `
            <div class="banner-buttons-container">
                 <div class="pro-badge">PRO</div>
                <button class="banner-button red" onclick="showDetailsScreen({id: ${item.id}, title: '${safeTitle}', name: '${safeTitle}', media_type: '${itemType}'}, '${itemType}')"><i class="fas fa-play"></i> Ver Ahora</button>
                <button class="banner-button" onclick="addToFavorites({id: ${item.id}, title: '${safeTitle}', poster_path: '${safePoster}', type: '${itemType}'})"><i class="fas fa-plus"></i> Mi Lista</button>
            </div>
        `;
        bannerList.appendChild(banner);
    });
    
    // Start auto-scrolling only if there are banners
    if (items.length > 0) {
        startBannerAutoScroll();
    }
}

function startBannerAutoScroll() {
    let currentBannerIndex = 0;
    const bannerList = document.getElementById('banner-list');
    const bannerItems = bannerList.querySelectorAll('.banner-item');

    if (bannerItems.length < 2) return;

    // Clear any existing interval to prevent overlap
    if (bannerInterval) clearInterval(bannerInterval);

    bannerInterval = setInterval(() => {
        currentBannerIndex = (currentBannerIndex + 1) % bannerItems.length;
        bannerList.scrollTo({
            left: currentBannerIndex * bannerItems[0].offsetWidth,
            behavior: 'smooth'
        });
    }, 5000); // Change banner every 5 seconds
    
    // Stop scrolling on user interaction
    bannerList.addEventListener('pointerdown', pauseBannerAutoScroll);
    bannerList.addEventListener('scroll', resetBannerAutoScroll);
}

function pauseBannerAutoScroll() {
    if (bannerInterval) clearInterval(bannerInterval);
}

function resetBannerAutoScroll() {
    if (resumeAutoScrollTimeout) clearTimeout(resumeAutoScrollTimeout);
    resumeAutoScrollTimeout = setTimeout(startBannerAutoScroll, 10000); // Resume after 10 seconds of no scrolling
}

async function fetchHomeContent() {
    showLoader();
    try {
        // Cargar el banner principal (tendencias de la semana)
        const trendingBanners = await fetchFromTMDB('trending/movie/week'); 
        if (trendingBanners && Array.isArray(trendingBanners.results)) {
             // FIX CRÍTICO: Quitamos el filtro 'backdrop_path' aquí para asegurar que siempre haya elementos, 
             // dejando que renderBanner use la imagen placeholder si es necesario.
             renderBanner(trendingBanners.results.slice(0, 5)); 
        }

        // Cargar los carruseles de categorías (usando los IDs del index.html)
        await fetchAndRenderCarousel('movie/popular', 'populares-movies', 'movie');
        await fetchAndRenderCarousel('trending/all/day', 'tendencias-movies', 'movie');
        await fetchAndRenderCarousel('discover/movie?with_genres=28', 'accion-movies', 'movie'); 
        await fetchAndRenderCarousel('discover/movie?with_genres=27,9648', 'terror-movies', 'movie'); 
        await fetchAndRenderCarousel('discover/movie?with_genres=16', 'animacion-movies', 'movie'); 
        await fetchAndRenderCarousel('discover/movie?with_genres=99', 'documentales-movies', 'movie'); 
        await fetchAndRenderCarousel('discover/movie?with_genres=878', 'scifi-movies', 'movie'); 
        await fetchAndRenderCarousel('tv/popular', 'populares-series', 'tv');

        // Lógica para mostrar/ocultar el historial (history-section)
        const historySection = document.getElementById('history-section');
        if (currentUser && !currentUser.isAnonymous) {
             if(historySection) historySection.style.display = 'block';
             // Asumiendo que existe una función fetchHistory()
             // fetchHistory(); 
        } else {
             if(historySection) historySection.style.display = 'none';
        }

    } catch (error) {
        console.error("Error al cargar contenido de la pantalla de inicio:", error);
    } finally {
        hideLoader();
    }
}
// ======================================================================
// 📌 FIN FUNCIONES AGREGADAS
// ======================================================================

let isInitialized = false;
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    // Lógica de autenticación y estado PRO (sin cambios)
    if (user && !user.isAnonymous) {
        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'block';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'none';
        }
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().isPro) {
            currentUser.isPro = true;
            if (proStatusButton) {
                proStatusButton.textContent = 'Cuenta Premium Activada';
                proStatusButton.disabled = true;
            }
        } else {
            currentUser.isPro = false;
            if (proStatusButton) {
                proStatusButton.textContent = 'Activar Cuenta Premium';
                proStatusButton.disabled = false;
            }
        }
    } else {
        if (currentUser) {
             currentUser.isPro = false;
        }

        if (profileLoggedIn) {
            profileLoggedIn.style.display = 'none';
        }
        if (profileLoggedOut) {
            profileLoggedOut.style.display = 'block';
        }
        if (!user) {
             await signInAnonymously(auth);
        }
    }

    if (!isInitialized) {
        showLoader();

        isInitialized = true;
        setupRealtimeNotificationsListener(); 
        initializeTheme();
        
        await fetchAppData(); 

        await getTMDBGenres('movie');
        await getTMDBGenres('tv');
        updateNotificationIndicator(); 
        
        appContainer.style.display = 'block';
        hideLoader();

        const startAppId = getURLParameter('startapp');
        if (startAppId) {
            try {
                let fullItem = await fetchFromTMDB(`movie/${startAppId}`);
                let type = 'movie';

                if (!fullItem || fullItem.status_code === 34 || !fullItem.id) {
                     fullItem = await fetchFromTMDB(`tv/${startAppId}`);
                     type = 'tv';
                }

                if (fullItem && fullItem.id) {
                    fullItem.media_type = type; 
                    history.pushState({ screen: 'details-screen', item: fullItem, type: type }, '', '');
                    showDetailsScreen(fullItem, type);
                } else {
                    switchScreen('home-screen');
                }
            } catch (error) {
                console.error("Error al cargar contenido desde Telegram:", error);
                switchScreen('home-screen');
            }
        } else {
            switchScreen('home-screen');
        }
    }
});

// ======================================================================
// LÓGICA DE TV EN VIVO (M3U) - SIN CAMBIOS SIGNIFICATIVOS
// ======================================================================

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
    const currentItem = document.querySelector(`.tv-grid-item[data-index="${index}"][data-country="${countryCode}"]`);
    if (currentItem) {
         currentItem.classList.add('active');
         tv_currentItem = currentItem;
    }

    if (hls_instance) {
        hls_instance.destroy();
        hls_instance = null;
    }
    
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

function tv_renderChannelGrid(channels, countryCode) {
    tv_channel_grid.style.display = 'grid';
    premium_wall.style.display = 'none';

    let htmlContent = '';
    channels.forEach((channel, index) => {
        const name = channel.name; 
        const info = channel.info || 'HD/SD';

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
                if (!currentChannel.name.includes('[Geo-blocked]') && !currentChannel.name.includes('[Not 24/7]')) {
                    channels.push(currentChannel);
                }
            }
            currentChannel = {};
        }
    }
    return channels;
}


async function tv_filterChannels(countryCode) {
    document.querySelectorAll('#country-nav .country-button').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`.country-button[data-country="${countryCode}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const source = country_sources[countryCode];
    
    if (source.premium && (!currentUser || !currentUser.isPro)) {
        tv_channel_grid.style.display = 'none';
        premium_wall.style.display = 'block';
        tv_current_name.textContent = "¡Sección Premium! Activa tu plan.";
        if (hls_instance) hls_instance.destroy();
        tv_video.src = '';
        return;
    }

    premium_wall.style.display = 'none';
    tv_channel_grid.style.display = 'grid';
    tv_channel_grid.innerHTML = '<p style="color:#E50914; text-align:center; padding-top:20px;">Cargando canales, espera un momento...</p>';
    tv_current_name.textContent = `Cargando: ${source.name}...`;

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
            tv_channel_grid.innerHTML = `<p style="color:#f00; text-align:center; padding-top:20px;">❌ Error al cargar canales de ${source.name}.</p>`;
            tv_current_name.textContent = `ERROR: No se pudo cargar ${source.name}.`;
            if (hls_instance) hls_instance.destroy();
            tv_video.src = '';
            return;
        }
    }

    tv_renderChannelGrid(channelsToRender, countryCode);

    const firstChannel = document.querySelector(`#tv-channel-grid .tv-grid-item[data-country="${countryCode}"]`);
    if (firstChannel) {
        tv_loadChannel(firstChannel, 0, countryCode); 
    } else {
        tv_current_name.textContent = `No se encontraron canales disponibles para ${source.name}.`;
        tv_channel_grid.innerHTML = `<p style="color:#aaa; text-align:center; padding-top:20px;">No hay canales en esta sección. Intenta con otra o recarga la página.</p>`;
        if (hls_instance) hls_instance.destroy();
        tv_video.src = '';
    }
}

function tv_searchChannels(query) {
    const countryCode = currentActiveCountryCode;
    const allChannels = cached_channels[countryCode] || [];

    if (!query || query.trim() === "") {
        tv_renderChannelGrid(allChannels, countryCode);
        return;
    }

    const lowerCaseQuery = query.toLowerCase().trim();
    const filteredChannels = allChannels.filter(channel =>
        channel.name.toLowerCase().includes(lowerCaseQuery)
    );

    tv_renderChannelGrid(filteredChannels, countryCode);

    if (filteredChannels.length === 0) {
        if (tv_channel_grid) {
            tv_channel_grid.innerHTML = `<p style="color:#aaa; text-align:center; padding-top:20px;">No se encontraron canales que coincidan con "${query}".</p>`;
        }
    }
}


function renderCountryButtons() {
    if (!country_nav) return;
    country_nav.innerHTML = '';
    for (const code in country_sources) {
        const source = country_sources[code];
        const button = document.createElement('button');
        button.className = `country-button ${code === 'MX' ? 'active' : ''} ${source.premium ? 'premium' : ''}`;
        button.textContent = source.name;
        button.setAttribute('data-country', code);
        button.onclick = () => window.tv_filterChannels(code);
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
