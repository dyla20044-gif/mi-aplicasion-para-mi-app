import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCF5lyEIFkKhzgc4kOMebWZ7oZrxWDNw2Y",
    authDomain: "app-aeff2.firebaseapp.com",
    projectId: "app-aeff2",
    storageBucket: "app-aeff2.firebasestorage.app",
    messagingSenderId: "12229598213",
    appId: "1:12229598213:web:80555d9d22c30b69ddd06c",
    measurementId: "G-ZMQN0D6D4S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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
const searchInput = document.getElementById('search-input');
const searchIconTop = document.getElementById('search-icon');
const videoModal = document.getElementById('video-modal');
const videoPlayer = document.getElementById('video-player');
const closeButtons = document.querySelectorAll('.close-button');
const detailsPosterTop = document.getElementById('details-poster-top');
const detailsPlayButton = document.getElementById('details-play-button');
const detailsTitle = document.getElementById('details-title');
const detailsYear = document.getElementById('details-year');
const detailsGenres = document.getElementById('details-genres');
const detailsSinopsis = document.getElementById('details-sinopsis');
const directorName = document.getElementById('director-name');
const actorsList = document.getElementById('actors-list');
const relatedMoviesContainer = document.getElementById('related-movies');
const genresButton = document.getElementById('genres-button');
const seriesGenresButton = document.getElementById('series-genres-button');
const genresModal = document.getElementById('genres-modal');
const genresList = document.getElementById('genres-list');
const allMoviesGrid = document.getElementById('all-movies-grid');
const allSeriesGrid = document.getElementById('all-series-grid');
const bannerList = document.getElementById('banner-list');
const loader = document.getElementById('loader');
const seeMoreButtons = document.querySelectorAll('.see-more-btn');
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
const requestMovieButton = document.getElementById('request-movie-button');
const seasonsContainer = document.getElementById('seasons-container');
const episodesContainer = document.getElementById('episodes-container');
const playButtonContainer = document.getElementById('details-play-button-container');

let moviesData = [];
let seriesData = [];
let bannerMovies = [];
let allMovieGenres = {};
let allTvGenres = {};
let bannerInterval;
let currentUser = null;
let currentScreen = 'home-screen';
let previousScreen = '';

// --- Funciones para manejar Modales y Carga ---
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        if (modal.id === 'video-modal') {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        }
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

// --- Funciones de Renderizado ---
function createMovieCard(movie, type = 'movie') {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Poster';
    
    // Agrega el badge "Top" a las películas populares
    let badgeHtml = '';
    const isPopular = movie.popularity > 100; // Puedes ajustar el valor de popularidad
    if (isPopular) {
        badgeHtml = `<div class="badge">TOP</div>`;
    }
    
    movieCard.innerHTML = `
        ${badgeHtml}
        <img src="${posterUrl}" alt="${movie.title || movie.name}" class="movie-poster">
    `;
    
    movieCard.addEventListener('click', () => showDetailsScreen(movie, type));
    return movieCard;
}

function createBannerItem(movie) {
    const bannerItem = document.createElement('div');
    bannerItem.className = 'banner-item';
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://placehold.co/1080x600?text=No+Banner';
    bannerItem.style.backgroundImage = `url('${backdropUrl}')`;
    
    const localMovie = moviesData.find(m => m.tmdbId === movie.id);
    const isPremium = localMovie && localMovie.isPremium;
    const hasMirrors = localMovie && localMovie.mirrors && localMovie.mirrors.length > 0;

    let buttonHtml = '';
    if (hasMirrors) {
        buttonHtml = `<button class="banner-button red"><i class="fas fa-play"></i> ${isPremium ? 'Ver Premium' : 'Ver ahora'}</button>`;
    }

    bannerItem.innerHTML = `
        <div class="banner-buttons-container">
            ${buttonHtml}
        </div>
    `;
    
    const playButton = bannerItem.querySelector('.red');
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            playVideoWithMirrors(localMovie.mirrors, isPremium, currentUser);
        });
    }

    bannerItem.addEventListener('click', () => showDetailsScreen(movie, movie.media_type || 'movie'));
    return bannerItem;
}

function renderCarousel(containerId, movies, type = 'movie') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, type));
    });
}

function renderGrid(container, movies, type = 'movie') {
    if (!container) return;
    container.innerHTML = '';
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie, type));
    });
}

// === LÓGICA DE REPRODUCCIÓN Y SERVIDORES (MODIFICADO) ===
async function fetchDirectVideoUrl(mirrorUrl) {
    try {
        const response = await fetch('https://serivisios.onrender.com/api/extract-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: mirrorUrl })
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        return data.videoUrl;
    } catch (error) {
        console.error('Error al extraer el enlace del video:', error);
        return null;
    }
}

async function playVideoWithMirrors(mirrors, isPremium, currentUser) {
    if (!mirrors || mirrors.length === 0) {
        alert('No hay enlaces de video disponibles para este contenido.');
        return;
    }

    showLoader();
    let videoUrl = null;
    let successfulMirror = null;
    let quality = 'SD';
    
    // Primero intenta con 1080p Pro si existe
    const proMirror = mirrors.find(m => m.quality === '1080p_pro');
    if (proMirror) {
        videoUrl = await fetchDirectVideoUrl(proMirror.url);
        if (videoUrl) {
            successfulMirror = proMirror;
            quality = '1080p Pro';
        }
    }

    // Si no funcionó el 1080p, intenta con los demás
    if (!videoUrl) {
        const otherMirrors = mirrors.filter(m => m.quality !== '1080p_pro');
        for (const mirror of otherMirrors) {
            videoUrl = await fetchDirectVideoUrl(mirror.url);
            if (videoUrl) {
                successfulMirror = mirror;
                quality = mirror.quality;
                break;
            }
        }
    }
    
    hideLoader();

    if (videoUrl) {
        if (isPremium && (!currentUser || !currentUser.isPro)) {
            alert('Este contenido es Premium. Suscríbete para ver el video completo.');
            showModal(premiumInfoModal);
        } else if (!isPremium && (!currentUser || !currentUser.isPro)) {
            playAd().then(() => {
                videoPlayer.src = videoUrl;
                showModal(videoModal);
                videoPlayer.play();
            });
        } else {
            videoPlayer.src = videoUrl;
            showModal(videoModal);
            videoPlayer.play();
        }
    } else {
        alert('No se pudo encontrar un enlace de reproducción válido. Intenta de nuevo más tarde.');
    }
}

async function showDetailsScreen(item, type = 'movie') {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    detailsScreen.classList.add('active');
    appContainer.scrollTo({ top: 0, behavior: 'smooth' });
    showLoader();
    
    // Ocultar la botonera de series por defecto
    seasonsContainer.innerHTML = '';
    episodesContainer.innerHTML = '';
    seasonsContainer.style.display = 'none';

    try {
        const posterPath = item.backdrop_path || item.poster_path;
        const posterUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}` : 'https://placehold.co/500x750?text=No+Poster';
        detailsPosterTop.style.backgroundImage = `url('${posterUrl}')`;

        detailsTitle.textContent = item.title || item.name;
        detailsSinopsis.textContent = item.overview || 'Sin sinopsis disponible.';
        detailsYear.textContent = (item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).substring(0, 4) : '';
        
        const genreNames = item.genre_ids ? item.genre_ids.map(id => (type === 'movie' ? allMovieGenres[id] : allTvGenres[id])).filter(Boolean).join(', ') : '';
        detailsGenres.textContent = genreNames;

        const credits = await fetchFromTMDB(type === 'movie' ? `movie/${item.id}/credits` : `tv/${item.id}/credits`);
        
        const director = credits.crew.find(c => c.job === 'Director');
        directorName.textContent = director ? director.name : 'No disponible';
        const actors = credits.cast.slice(0, 3).map(a => a.name).join(', ');
        actorsList.textContent = actors || 'No disponible';
        
        const localData = (type === 'movie' ? moviesData : seriesData).find(d => d.tmdbId === item.id);
        
        // Renderizar la botonera de películas o de series
        if (type === 'movie') {
            renderMoviePlayButtons(localData, item);
        } else if (type === 'tv') {
            await renderSeriesButtons(localData, item);
        }

        const related = await fetchFromTMDB(type === 'movie' ? `movie/${item.id}/similar` : `tv/${item.id}/similar`);
        renderCarousel('related-movies', related, type);

    } catch (error) {
        console.error("Error showing details:", error);
        alert('Hubo un error al cargar los detalles. Intenta de nuevo.');
    } finally {
        hideLoader();
    }
}

// === NUEVA LÓGICA DE REPRODUCCIÓN (PELÍCULAS) ===
function renderMoviePlayButtons(localMovie, tmdbMovie) {
    playButtonContainer.innerHTML = ''; // Limpia el contenedor
    
    // Botón de 1080p Pro
    const proMirror = localMovie && localMovie.mirrors ? localMovie.mirrors.find(m => m.quality === '1080p_pro') : null;
    if (proMirror) {
        const proButton = document.createElement('button');
        proButton.className = 'play-button';
        proButton.innerHTML = `<i class="fas fa-play"></i> 1080p Pro`;
        proButton.onclick = () => playVideoWithMirrors([proMirror], localMovie.isPremium, currentUser);
        playButtonContainer.appendChild(proButton);
    }
    
    // Botón de Play principal
    if (localMovie && localMovie.mirrors && localMovie.mirrors.length > 0) {
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = `<i class="fas fa-play"></i> ${localMovie.isPremium ? 'Ver Premium' : 'Ver ahora'}`;
        playButton.onclick = () => playVideoWithMirrors(localMovie.mirrors, localMovie.isPremium, currentUser);
        playButtonContainer.appendChild(playButton);
    } else {
        renderRequestButton(tmdbMovie);
    }
}

// === LÓGICA DE REPRODUCCIÓN (SERIES) ===
async function renderSeriesButtons(localSeries, tmdbSeries) {
    playButtonContainer.innerHTML = '';
    seasonsContainer.style.display = 'block';
    seasonsContainer.innerHTML = '<h3>Temporadas</h3>';
    
    const seriesDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}`);
    
    seriesDetails.seasons.forEach(season => {
        const seasonButton = document.createElement('button');
        seasonButton.className = 'season-button';
        seasonButton.textContent = `Temporada ${season.season_number}`;
        seasonButton.onclick = async () => {
            episodesContainer.innerHTML = '<h3>Episodios</h3><div class="episodes-grid"></div>';
            const episodesGrid = episodesContainer.querySelector('.episodes-grid');
            const seasonDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}/season/${season.season_number}`);
            
            seasonDetails.episodes.forEach(episode => {
                const episodeButton = document.createElement('button');
                episodeButton.className = 'episode-button';
                episodeButton.textContent = `E${episode.episode_number}`;
                
                const localEpisode = localSeries && localSeries.seasons && localSeries.seasons[season.season_number] && localSeries.seasons[season.season_number].episodes[episode.episode_number];
                
                if (localEpisode) {
                    episodeButton.onclick = () => playVideoWithMirrors(localEpisode.mirrors, localSeries.isPremium, currentUser);
                } else {
                    episodeButton.disabled = true;
                    episodeButton.textContent = `E${episode.episode_number} (Próximamente)`;
                    episodeButton.style.backgroundColor = '#333';
                    episodeButton.style.cursor = 'not-allowed';
                }
                episodesGrid.appendChild(episodeButton);
            });
        };
        seasonsContainer.appendChild(seasonButton);
    });
}

// === BOTÓN PEDIR AHORA (MODIFICADO) ===
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
                alert('¡Solicitud enviada! Nos pondremos a trabajar en ello.');
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

// ... (El resto de tu código que no cambia) ...

// --- Initialization ---
showLoader();
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
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

    hideLoader();
});
