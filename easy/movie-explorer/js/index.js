// ── Config ──
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE  = 'https://image.tmdb.org/t/p/w500';
const STORAGE_KEY = 'cinescope_api_key';

const GENRE_NAMES = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
  99:'Documentary', 18:'Drama', 10751:'Family', 14:'Fantasy', 36:'History',
  27:'Horror', 10402:'Music', 9648:'Mystery', 10749:'Romance', 878:'Sci-Fi',
  53:'Thriller', 10752:'War', 37:'Western'
};

// ── State ──
let apiKey = localStorage.getItem(STORAGE_KEY) || '';
let allMovies = [];
let sortedDesc = false;
let currentGenre = '';
let currentCount = 12;

// ── DOM refs ──
const genreSelect    = document.getElementById('genreSelect');
const countInput     = document.getElementById('countInput');
const fetchBtn       = document.getElementById('fetchBtn');
const mainContent    = document.getElementById('mainContent');
const resultsBar     = document.getElementById('resultsBar');
const resultsInfo    = document.getElementById('resultsInfo');
const sortToggle     = document.getElementById('sortToggle');
const apikeySection  = document.getElementById('apikeySection');
const apikeyInput    = document.getElementById('apikeyInput');
const apikeyBtn      = document.getElementById('apikeyBtn');

// ── Init ──
function init() {
  if (!apiKey) {
    showApiKeyPrompt();
  } else {
    showWelcomeState();
  }

  fetchBtn.addEventListener('click', handleFetch);
  sortToggle.addEventListener('click', toggleSort);
  apikeyBtn.addEventListener('click', saveApiKey);
  apikeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });
}

function saveApiKey() {
  const val = apikeyInput.value.trim();
  if (!val) return;
  apiKey = val;
  localStorage.setItem(STORAGE_KEY, apiKey);
  apikeySection.style.display = 'none';
  handleFetch();
}

function showApiKeyPrompt() {
  apikeySection.style.display = 'block';
  showEmptyState('🔑', 'API Key Needed', 'Enter your free TMDB API key above to start exploring movies.');
}

function showWelcomeState() {
  showEmptyState('🎬', 'Ready to Explore', 'Choose a genre and hit Explore Movies to discover top-rated films.');
}

// ── Fetch ──
async function handleFetch() {
  if (!apiKey) { showApiKeyPrompt(); return; }

  currentGenre = genreSelect.value;
  currentCount = Math.max(4, Math.min(40, parseInt(countInput.value) || 12));
  countInput.value = currentCount;

  const genreName = GENRE_NAMES[currentGenre] || 'Movies';

  showLoading(currentCount);
  resultsBar.style.display = 'none';
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Loading...';

  try {
    // Calculate pages needed (TMDB returns 20 per page)
    const pagesNeeded = Math.ceil(currentCount / 20);
    const requests = [];
    for (let p = 1; p <= pagesNeeded; p++) {
      requests.push(fetchPage(currentGenre, p));
    }

    const pages = await Promise.all(requests);
    allMovies = pages.flatMap(p => p.results || []).slice(0, currentCount);

    if (allMovies.length === 0) {
      showEmptyState('🎭', 'No Movies Found', 'Try a different genre or adjust your filters.');
      return;
    }

    sortedDesc = false;
    sortToggle.classList.remove('active');
    renderMovies(allMovies);
    resultsBar.style.display = 'flex';
    resultsInfo.innerHTML = `Showing <strong>${allMovies.length}</strong> movies in <strong>${genreName}</strong>`;

  } catch (err) {
    if (err.message.includes('401')) {
      localStorage.removeItem(STORAGE_KEY);
      apiKey = '';
      showEmptyState('🔑', 'Invalid API Key', 'Your TMDB API key was rejected. Please check and re-enter it.');
      apikeySection.style.display = 'block';
    } else if (err.message.includes('Failed to fetch')) {
      showEmptyState('📡', 'Connection Error', 'Could not reach TMDB. Check your internet connection and try again.');
    } else {
      showEmptyState('⚠️', 'Something Went Wrong', err.message || 'An unexpected error occurred.');
    }
    resultsBar.style.display = 'none';
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.innerHTML = '<span>🎬</span> Explore Movies';
  }
}

async function fetchPage(genreId, page) {
  const url = `${TMDB_BASE}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=100&page=${page}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ── Sort ──
function toggleSort() {
  if (allMovies.length === 0) return;
  sortedDesc = !sortedDesc;
  sortToggle.classList.toggle('active', sortedDesc);

  const sorted = [...allMovies].sort((a, b) =>
    sortedDesc ? b.vote_average - a.vote_average : a.vote_average - b.vote_average
  );
  renderMovies(sorted);
}

// ── Render ──
function renderMovies(movies) {
  const grid = document.createElement('div');
  grid.className = 'movie-grid';

  movies.forEach((movie, i) => {
    const card = createCard(movie, i);
    grid.appendChild(card);
  });

  mainContent.innerHTML = '';
  mainContent.appendChild(grid);
}

function createCard(movie, index) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;

  const rating = movie.vote_average || 0;
  const ratingClass = rating >= 7.5 ? 'rating-high' : rating >= 6 ? 'rating-mid' : 'rating-low';
  const ratingPct = (rating / 10) * 100;
  const barColor = rating >= 7.5 ? '#e8b84b' : rating >= 6 ? '#e8c04b' : '#6b7a99';
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const overview = movie.overview || 'No overview available.';
  const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '';

  card.innerHTML = `
    ${posterUrl
      ? `<img class="card-poster" src="${posterUrl}" alt="${escHtml(movie.title)}" loading="lazy">`
      : `<div class="poster-placeholder">🎬<span>No Poster</span></div>`
    }
    <div class="card-overlay">
      <p class="overlay-overview">${escHtml(overview)}</p>
    </div>
    <div class="card-info">
      <div class="card-title">${escHtml(movie.title || 'Untitled')}</div>
      <div class="card-meta">
        <div class="card-rating ${ratingClass}">
          <span class="star-icon">★</span>
          <span>${rating ? rating.toFixed(1) : 'N/A'}</span>
        </div>
        <div class="card-year">${year}</div>
      </div>
      <div class="rating-bar-track">
        <div class="rating-bar-fill" style="width:0%; background:${barColor}" data-width="${ratingPct}"></div>
      </div>
    </div>
  `;

  // Animate rating bar after insert
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = card.querySelector('.rating-bar-fill');
      if (bar) bar.style.width = bar.dataset.width + '%';
    }, 100 + index * 30);
  });

  return card;
}

// ── Loading / Empty States ──
function showLoading(count) {
  const grid = document.createElement('div');
  grid.className = 'skeleton-grid';
  for (let i = 0; i < count; i++) {
    grid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-poster"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line shorter"></div>
        </div>
      </div>`;
  }
  mainContent.innerHTML = '';
  mainContent.appendChild(grid);
}

function showEmptyState(icon, title, msg) {
  mainContent.innerHTML = `
    <div class="state-container">
      <div class="state-icon">${icon}</div>
      <div class="state-title">${title}</div>
      <p class="state-msg">${msg}</p>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();