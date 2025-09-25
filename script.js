import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query, where, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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


let moviesData = [];
let seriesData = [];
let bannerMovies = [];
let allMovieGenres = {};
let allTvGenres = {};
let bannerInterval;
let resumeAutoScrollTimeout;
let currentUser = null;
let currentMovieOrSeries = null;
let lastSearchResults = [];

// --- Funciones para manejar Modales y Carga ---
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

// --- Funciones principales y de renderizado ---

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
        embeddedPlayerContainer.innerHTML = embedCode;
        addMovieToHistory(item);
    }
}

function renderMoviePlayButtons(localMovie, tmdbMovie) {
    playButtonContainer.innerHTML = '';
    if (localMovie && (localMovie.freeEmbedCode || localMovie.proEmbedCode)) {
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = `<i class="fas fa-play"></i>`;

        playButton.onclick = async () => {
            showLoader();
            try {
                const isProUser = currentUser && currentUser.isPro;
                let embedCode = null;
                let isPremium = false;

                if (isProUser && localMovie.proEmbedCode) {
                    // El usuario es PRO y la película tiene un reproductor PRO.
                    isPremium = true;
                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localMovie.tmdbId}&isPro=true`);
                    const data = await response.json();
                    embedCode = data.embedCode;
                } else if (localMovie.freeEmbedCode) {
                    // El usuario es gratis (o no hay reproductor PRO), y la película tiene un reproductor gratis.
                    isPremium = false;
                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localMovie.tmdbId}&isPro=false`);
                    const data = await response.json();
                    embedCode = data.embedCode;
                } else {
                    // Caso en el que el reproductor no es gratis y el usuario no es PRO.
                    showProRestrictionModal();
                    hideLoader();
                    return;
                }

                if (embedCode) {
                    if (isPremium) {
                        playEmbeddedVideo(embedCode, true, currentUser, tmdbMovie);
                    } else {
                        showFreeAdModal(embedCode);
                    }
                } else {
                    alert('No se encontró un reproductor para esta película.');
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
}

async function renderSeriesButtons(localSeries, tmdbSeries) {
    try {
        playButtonContainer.innerHTML = '';
        seasonsContainer.style.display = 'block';
        seasonsContainer.innerHTML = '<h3>Temporadas</h3>';
        
        const seriesDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}`);
        
        if (!seriesDetails || !seriesDetails.seasons) {
             throw new Error("No seasons data available for this series.");
        }
        
        seriesDetails.seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.className = 'season-button';
            seasonButton.textContent = `Temporada ${season.season_number}`;
            seasonButton.onclick = async () => {
                episodesContainer.innerHTML = '<h3>Episodios</h3><div class="episodes-grid"></div>';
                const episodesGrid = episodesContainer.querySelector('.episodes-grid');
                const seasonDetails = await fetchFromTMDB(`tv/${tmdbSeries.id}/season/${season.season_number}`);
                
                if (!seasonDetails || !seasonDetails.episodes) {
                    throw new Error("No episodes data available for this season.");
                }

                seasonDetails.episodes.forEach(episode => {
                    const episodeButton = document.createElement('button');
                    episodeButton.className = 'episode-button';
                    episodeButton.textContent = `E${episode.episode_number}`;
                    
                    const localEpisode = localSeries?.seasons?.[season.season_number]?.episodes?.[episode.episode_number];
                    
                    if (localEpisode && (localEpisode.freeEmbedCode || localEpisode.proEmbedCode)) {
                         episodeButton.onclick = async () => {
                            showLoader();
                            try {
                                const isProUser = currentUser && currentUser.isPro;
                                const hasProPlayer = !!localEpisode.proEmbedCode;
                                const hasFreePlayer = !!localEpisode.freeEmbedCode;
                                
                                if (isProUser && hasProPlayer) {
                                    const response = await fetch(`https://serivisios.onrender.com/api/get-embed-code?id=${localSeries.tmdbId}&season=${season.season_number}&episode=${episode.episode_number}&isPro=true`);
                                    const data = await response.json();
                                    if (data.embedCode) {
                                        playEmbeddedVideo(data.embedCode, true, currentUser, episode);
                                    } else {
                                        alert('No se encontró un reproductor PRO para este episodio.');
                                    }
                                } else if (hasFreePlayer) {
                                    showFreeAdModal(localEpisode.freeEmbedCode);
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
    } catch (error) {
        console.error('Error al renderizar los botones de temporadas:', error);
        seasonsContainer.innerHTML = '<p>No se encontraron temporadas para esta serie.</p>';
        playButtonContainer.innerHTML = '<p>No se encontraron reproductores.</p>';
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

async function showDetailsScreen(item, type) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    detailsScreen.classList.add('active');
    appContainer.scrollTo({ top: 0, behavior: 'smooth' });
    showLoader();
    
    seasonsContainer.innerHTML = '';
    episodesContainer.innerHTML = '';
    seasonsContainer.style.display = 'none';

    detailsPosterTop.style.backgroundImage = 'none';
    detailsPosterTop.style.backgroundColor = 'transparent';
    playButtonContainer.style.display = 'flex';
    if (document.getElementById('embedded-player-container')) {
        document.getElementById('embedded-player-container').style.display = 'none';
        document.getElementById('embedded-player-container').innerHTML = '';
    }

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
        
        // ✅ CORRECCIÓN CLAVE: Se convierte el item.id a string para la comparación
        // Esto resuelve el problema de la no visualización de los episodios
        const localData = (type === 'movie' ? moviesData : seriesData).find(d => d.tmdbId === item.id.toString());
        
        currentMovieOrSeries = localData;

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
        // Guardar el estado actual antes de navegar a los detalles
        history.pushState({ screen: 'details-screen', item: movie, type: type || movie.media_type }, '', '');
        showDetailsScreen(movie, type || movie.media_type)
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
        // ✅ LINEA CORREGIDA
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
        alert('Hubo un error al cargar el contenido principal. Por favor, recarga la página.');
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

// CORRECCIÓN CLAVE: Manejar la pausa y reanudación del carrusel.
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

searchInput.addEventListener('click', () => {
    const query = searchInput.value;
    if (query.length > 2) {
        handleSearch(query);
    }
});

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
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        homeScreen.classList.add('active');
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

            switchScreen('movies-screen');
            searchFilters.style.display = 'flex';
        } catch (error) {
            console.error("Error performing search:", error);
            alert('Hubo un error en la búsqueda. Por favor, intenta de nuevo.');
        } finally {
            hideLoader();
        }
    } else if (query.length === 0) {
        searchFilters.style.display = 'none';
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
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
        if (navItem) navItem.classList.add('active');
        history.pushState({ screen: screenId }, '', `?screen=${screenId}`);
    }

    if (screenId === 'movies-screen') {
        renderAllMovies();
        searchFilters.style.display = 'none';
    } else if (screenId === 'series-screen') {
        renderAllSeries();
        searchFilters.style.display = 'none';
    } else if (screenId === 'home-screen') {
        fetchHomeContent();
        searchFilters.style.display = 'none';
    } else if (screenId === 'favorites-screen') {
        fetchFavorites();
        searchFilters.style.display = 'none';
    }
    
    if (screenId === 'details-screen' || screenId === 'auth-screen') {
        document.querySelector('.top-nav').style.display = 'none';
        document.querySelector('.bottom-nav').style.display = 'none';
        appContainer.style.paddingBottom = '0';
    } else {
        document.querySelector('.top-nav').style.display = 'flex';
        document.querySelector('.bottom-nav').style.display = 'flex';
        appContainer.style.paddingBottom = '70px';
    }
}
window.addEventListener('popstate', async (event) => {
    const state = event.state;
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
            document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            const targetScreen = document.getElementById(state.screen);
            if (targetScreen) {
                targetScreen.classList.add('active');
                const navItem = document.querySelector(`.nav-item[data-screen="${state.screen}"]`);
                if (navItem) navItem.classList.add('active');
                if (state.screen === 'movies-screen') {
                    renderAllMovies();
                    searchFilters.style.display = 'none';
                } else if (state.screen === 'series-screen') {
                    renderAllSeries();
                    searchFilters.style.display = 'none';
                } else if (state.screen === 'home-screen') {
                    fetchHomeContent();
                    searchFilters.style.display = 'none';
                } else if (state.screen === 'favorites-screen') {
                    fetchFavorites();
                    searchFilters.style.display = 'none';
                }
                if (state.screen === 'details-screen' || state.screen === 'auth-screen') {
                    document.querySelector('.top-nav').style.display = 'none';
                    document.querySelector('.bottom-nav').style.display = 'none';
                    appContainer.style.paddingBottom = '0';
                } else {
                    document.querySelector('.top-nav').style.display = 'flex';
                    document.querySelector('.bottom-nav').style.display = 'flex';
                    appContainer.style.paddingBottom = '70px';
                }
            } else {
                switchScreen('home-screen');
            }
        }
    } else {
        // Si no hay estado, por defecto ir a la pantalla de inicio
        switchScreen('home-screen');
    }
});
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
        await addDoc(collection(db, "requests"), {
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName || 'Anónimo',
            movieTitle: movieTitle,
            requestedAt: new Date()
        });
        alert('¡Solicitud enviada! Gracias por tu sugerencia.');
        movieRequestInput.value = '';
    } catch (e) {
        console.error("Error adding movie request: ", e);
        alert('No se pudo enviar la solicitud. Intenta de nuevo.');
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
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;

    if (!termsAccepted) {
        alert('Debes aceptar los términos y condiciones para continuar.');
        return;
    }
    
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        switchScreen('profile-screen');
        showModal(paymentModal);
    } catch (error) {
        console.error("Signup error:", error);
        alert(`Error al registrarse: ${error.message}`);
    }
});

loginButton.addEventListener('click', async () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('¡Inicio de sesión exitoso!');
        switchScreen('profile-screen');
    } catch (error) {
        console.error("Login error:", error);
        alert(`Error al iniciar sesión: ${error.message}`);
    }
});

socialLoginButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Esta funcionalidad aún no está disponible.');
    });
});

buyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const plan = e.target.getAttribute('data-plan');
        const amount = (plan === 'annual') ? '19.99' : '1.99';

        if (!currentUser || currentUser.isAnonymous) {
            switchScreen('auth-screen');
            return;
        }

        try {
            const response = await fetch('https://serivisios.onrender.com/create-paypal-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: plan, amount: amount })
            });

            const data = await response.json();
            
            if (response.ok && data.approval_url) {
                window.location.href = data.approval_url;
            } else {
                alert('Error al iniciar el pago con PayPal. Verifica la configuración en tu servidor.');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert('Hubo un error al procesar tu pago. Intenta de nuevo.');
        }
    });
});

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

let isInitialized = false;
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

    if (!isInitialized) {
        isInitialized = true;
        showLoader();
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
    }
});
