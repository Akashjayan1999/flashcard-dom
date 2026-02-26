const API = 'https://www.themealdb.com/api/json/v1/1';

const CUISINES = [
  'American','British','Canadian','Chinese','Croatian','Dutch',
  'Egyptian','French','Greek','Indian','Irish','Italian',
  'Jamaican','Japanese','Kenyan','Malaysian','Mexican','Moroccan',
  'Polish','Portuguese','Russian','Spanish','Thai','Tunisian','Turkish','Vietnamese'
];

// ── State ──
let selectedCuisine = null;
let recipeCount = 9;
let allFetched = [];

// ── DOM ──
const cuisineGrid   = document.getElementById('cuisineGrid');
const countDisplay  = document.getElementById('countDisplay');
const countDown     = document.getElementById('countDown');
const countUp       = document.getElementById('countUp');
const findBtn       = document.getElementById('findBtn');
const recipeSection = document.getElementById('recipeSection');
const recipeGrid    = document.getElementById('recipeGrid');
const sectionTitle  = document.getElementById('sectionTitle');
const sectionMeta   = document.getElementById('sectionMeta');
const loadingArea   = document.getElementById('loadingArea');
const skeletonGrid  = document.getElementById('skeletonGrid');
const stateArea     = document.getElementById('stateArea');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose    = document.getElementById('modalClose');

// ── Init ──
function init() {
  renderCuisinePills();
  countDown.addEventListener('click', () => adjustCount(-3));
  countUp.addEventListener('click', () => adjustCount(3));
  findBtn.addEventListener('click', handleFind);
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function renderCuisinePills() {
  CUISINES.forEach(c => {
    const pill = document.createElement('button');
    pill.className = 'cuisine-pill';
    pill.textContent = c;
    pill.addEventListener('click', () => selectCuisine(c, pill));
    cuisineGrid.appendChild(pill);
  });
}

function selectCuisine(name, el) {
  document.querySelectorAll('.cuisine-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  selectedCuisine = name;
}

function adjustCount(delta) {
  recipeCount = Math.max(3, Math.min(30, recipeCount + delta));
  countDisplay.value = recipeCount;
}

// ── Fetch ──
async function handleFind() {
  if (!selectedCuisine) {
    showState('🌍', 'Choose a Cuisine', 'Click one of the cuisine buttons above to get started.');
    return;
  }

  showLoading();
  findBtn.disabled = true;

  try {
    const res = await fetch(`${API}/filter.php?a=${encodeURIComponent(selectedCuisine)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const meals = data.meals;

    if (!meals || meals.length === 0) {
      showState('🍽', 'No Recipes Found', `We couldn't find any ${selectedCuisine} recipes. Try another cuisine.`);
      return;
    }

    // Shuffle and slice
    const shuffled = shuffle(meals);
    const sliced   = shuffled.slice(0, Math.min(recipeCount, meals.length));

    // Fetch full details for each in parallel (limit concurrency to 6)
    allFetched = await fetchDetails(sliced);
    renderRecipes(allFetched);

  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      showState('📡', 'No Connection', 'Check your internet and try again.');
    } else {
      showState('⚠️', 'Something Went Wrong', err.message);
    }
  } finally {
    findBtn.disabled = false;
  }
}

async function fetchDetails(meals) {
  const CHUNK = 6;
  const results = [];
  for (let i = 0; i < meals.length; i += CHUNK) {
    const batch = meals.slice(i, i + CHUNK);
    const details = await Promise.all(batch.map(m =>
      fetch(`${API}/lookup.php?i=${m.idMeal}`).then(r => r.json()).then(d => d.meals[0]).catch(() => m)
    ));
    results.push(...details);
  }
  return results;
}

// ── Render ──
function renderRecipes(meals) {
  hideAll();
  recipeSection.style.display = 'block';
  sectionTitle.textContent = `${selectedCuisine} Cuisine`;
  sectionMeta.textContent = `${meals.length} recipe${meals.length !== 1 ? 's' : ''} curated`;
  recipeGrid.innerHTML = '';

  meals.forEach((meal, i) => {
    const card = buildCard(meal, i);
    recipeGrid.appendChild(card);
  });
}

function buildCard(meal, index) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.style.animationDelay = `${Math.min(index * 0.07, 0.6)}s`;

  const desc = getDescription(meal);
  const tags = meal.strTags ? meal.strTags.split(',').slice(0, 2).map(t => t.trim()).filter(Boolean) : [];

  card.innerHTML = `
    <div class="card-image-wrap">
      <img class="card-image" src="${escHtml(meal.strMealThumb || '')}" alt="${escHtml(meal.strMeal)}" loading="lazy">
      ${meal.strCategory ? `<div class="card-category-badge">${escHtml(meal.strCategory)}</div>` : ''}
      ${meal.strArea ? `<div class="card-area-badge">${escHtml(meal.strArea)}</div>` : ''}
      <div class="card-image-overlay">
        <div class="card-overlay-text">Click to view recipe →</div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-number">No. ${String(index + 1).padStart(2, '0')}</div>
      <div class="card-title">${escHtml(meal.strMeal)}</div>
      <div class="card-desc">${escHtml(desc)}</div>
      <div class="card-footer">
        <div class="card-read-more">Read Recipe <span>→</span></div>
        <div class="card-tags">
          ${tags.map(t => `<span class="card-tag">${escHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(meal));
  return card;
}

function getDescription(meal) {
  if (meal.strInstructions) {
    // First sentence or two, max 160 chars
    const first = meal.strInstructions.replace(/\r?\n/g, ' ').trim();
    const cut = first.substring(0, 160);
    const dot = cut.lastIndexOf('.');
    return (dot > 60 ? cut.substring(0, dot + 1) : cut) + (first.length > 160 ? '…' : '');
  }
  return `A traditional ${meal.strArea || selectedCuisine} dish. Click to view the full recipe.`;
}

// ── Modal ──
function openModal(meal) {
  document.getElementById('modalImg').src = meal.strMealThumb || '';
  document.getElementById('modalImg').alt = meal.strMeal;
  document.getElementById('modalTitle').textContent = meal.strMeal;
  document.getElementById('modalCuisineTag').textContent = `${meal.strArea || selectedCuisine} · ${meal.strCategory || 'Recipe'}`;

  // Meta chips
  const metaRow = document.getElementById('modalMetaRow');
  metaRow.innerHTML = '';
  if (meal.strCategory) addChip(metaRow, 'Category', meal.strCategory);
  if (meal.strArea) addChip(metaRow, 'Cuisine', meal.strArea);
  if (meal.strTags) {
    meal.strTags.split(',').slice(0,3).forEach(t => t.trim() && addChip(metaRow, 'Tag', t.trim()));
  }

  // Ingredients
  const ingredList = document.getElementById('modalIngredients');
  ingredList.innerHTML = '';
  for (let i = 1; i <= 20; i++) {
    const ing  = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      const li = document.createElement('li');
      li.className = 'ingredient-item';
      li.innerHTML = `<span class="ingredient-measure">${escHtml((meas || '').trim())}</span><span>${escHtml(ing.trim())}</span>`;
      ingredList.appendChild(li);
    }
  }

  // Instructions
  document.getElementById('modalInstructions').textContent =
    (meal.strInstructions || 'No instructions provided.').replace(/\r\n/g, '\n').trim();

  // YouTube
  const videoWrap = document.getElementById('modalVideoWrap');
  videoWrap.innerHTML = '';
  if (meal.strYoutube) {
    const a = document.createElement('a');
    a.href = meal.strYoutube;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'modal-video-link';
    a.innerHTML = '▶ Watch on YouTube';
    videoWrap.appendChild(a);
  }

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function addChip(parent, label, value) {
  const chip = document.createElement('div');
  chip.className = 'modal-meta-chip';
  chip.innerHTML = `${label}: <strong>${escHtml(value)}</strong>`;
  parent.appendChild(chip);
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Loading ──
function showLoading() {
  hideAll();
  loadingArea.style.display = 'block';
  skeletonGrid.innerHTML = '';
  for (let i = 0; i < recipeCount; i++) {
    skeletonGrid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skel-line w50"></div>
          <div class="skel-line title w85"></div>
          <div class="skel-line w85"></div>
          <div class="skel-line w70"></div>
          <div class="skel-line w60"></div>
        </div>
      </div>`;
  }
}

function showState(emoji, heading, body) {
  hideAll();
  stateArea.innerHTML = `
    <div class="state-box">
      <div class="state-emoji">${emoji}</div>
      <div class="state-heading">${heading}</div>
      <p class="state-body">${body}</p>
    </div>`;
  stateArea.style.display = 'block';
}

function hideAll() {
  recipeSection.style.display = 'none';
  loadingArea.style.display   = 'none';
  stateArea.style.display     = 'none';
}

// ── Utilities ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

init();