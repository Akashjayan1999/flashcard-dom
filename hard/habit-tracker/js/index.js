const STORAGE_KEY = 'habit_tracker_v1';

const defaultData = {
  categories: [
    {
      id: 'morning',
      label: 'Morning Routine',
      className: 'morning',
      habits: [
        { id: 'h1', name: 'Drink a glass of water', status: 'todo' },
        { id: 'h2', name: 'Meditate for 10 minutes', status: 'todo' },
        { id: 'h3', name: 'Morning stretch', status: 'inprogress' },
        { id: 'h4', name: 'Journaling', status: 'done' },
      ]
    },
    {
      id: 'work',
      label: 'Work Focus',
      className: 'work',
      habits: [
        { id: 'h5', name: 'Review daily goals', status: 'todo' },
        { id: 'h6', name: 'Deep work block (2h)', status: 'inprogress' },
        { id: 'h7', name: 'Check emails', status: 'done' },
      ]
    },
    {
      id: 'evening',
      label: 'Evening Wind-down',
      className: 'evening',
      habits: [
        { id: 'h8', name: 'No screens after 9pm', status: 'todo' },
        { id: 'h9', name: 'Read for 30 minutes', status: 'todo' },
        { id: 'h10', name: 'Plan tomorrow', status: 'inprogress' },
      ]
    }
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
  } catch {
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function uid() {
  return 'h' + Math.random().toString(36).slice(2, 8);
}

let state = loadData();
let dragItem = null; // { catId, habitId }
let addFormOpen = null; // catId

// Set date
document.getElementById('dateBadge').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
});

function getStats(cat) {
  const total = cat.habits.length;
  const done = cat.habits.filter(h => h.status === 'done').length;
  const inProgress = cat.habits.filter(h => h.status === 'inprogress').length;
  return { total, done, inProgress, pct: total ? Math.round((done / total) * 100) : 0 };
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  state.categories.forEach(cat => {
    const stats = getStats(cat);
    const section = document.createElement('div');
    section.className = `category ${cat.className}`;
    section.dataset.catId = cat.id;

    const byStatus = { todo: [], inprogress: [], done: [] };
    cat.habits.forEach(h => (byStatus[h.status] || byStatus.todo).push(h));

    const isAddOpen = addFormOpen === cat.id;

    section.innerHTML = `
      <div class="category-header">
        <div class="category-title">
          <span class="cat-dot"></span>
          ${cat.label}
        </div>
        <button class="add-habit-btn" data-cat="${cat.id}">
          <span>+</span> Add Habit
        </button>
      </div>
      <div class="columns">
        ${['todo','inprogress','done'].map(status => {
          const items = byStatus[status];
          const labelMap = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
          const labelClass = { todo: 'todo-label', inprogress: 'progress-label', done: 'done-label' };
          return `
            <div class="column" data-cat="${cat.id}" data-status="${status}">
              <div class="col-label ${labelClass[status]}">
                ${labelMap[status]}
                <span class="count">${items.length}</span>
              </div>
              ${items.length === 0
                ? `<div class="empty-state">drop here</div>`
                : items.map(h => `
                <div class="habit-card ${status === 'done' ? 'done-card' : ''}"
                     draggable="true"
                     data-cat="${cat.id}"
                     data-habit="${h.id}">
                  <span class="drag-handle">⠿</span>
                  <span class="habit-name">${escHtml(h.name)}</span>
                  <button class="delete-btn" data-cat="${cat.id}" data-habit="${h.id}" title="Delete">✕</button>
                </div>`).join('')
              }
            </div>`;
        }).join('')}
      </div>
      <div class="add-form ${isAddOpen ? 'visible' : ''}" data-cat="${cat.id}">
        <div style="padding:12px 16px 16px">
          <div class="add-form-inner">
            <input class="habit-input" placeholder="Type a new habit…" data-cat="${cat.id}" maxlength="80" />
            <button class="confirm-btn" data-cat="${cat.id}">Add</button>
            <button class="cancel-btn" data-cat="${cat.id}">Cancel</button>
          </div>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat">Done: <span class="val">${stats.done}/${stats.total}</span></div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${stats.pct}%"></div>
        </div>
        <div class="stat">${stats.pct}%</div>
      </div>
    `;

    app.appendChild(section);
  });

  bindEvents();

  // Focus input if add form is open
  if (addFormOpen) {
    const inp = document.querySelector(`.habit-input[data-cat="${addFormOpen}"]`);
    if (inp) setTimeout(() => inp.focus(), 30);
  }
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function bindEvents() {
  // Add habit button
  document.querySelectorAll('.add-habit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addFormOpen = addFormOpen === btn.dataset.cat ? null : btn.dataset.cat;
      render();
    });
  });

  // Confirm add
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmAdd(btn.dataset.cat));
  });

  // Cancel add
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => { addFormOpen = null; render(); });
  });

  // Enter key in input
  document.querySelectorAll('.habit-input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmAdd(inp.dataset.cat);
      if (e.key === 'Escape') { addFormOpen = null; render(); }
    });
  });

  // Delete
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const { cat, habit } = btn.dataset;
      const catObj = state.categories.find(c => c.id === cat);
      if (catObj) catObj.habits = catObj.habits.filter(h => h.id !== habit);
      saveData(state);
      render();
    });
  });

  // Drag events on cards
  document.querySelectorAll('.habit-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      dragItem = { catId: card.dataset.cat, habitId: card.dataset.habit };
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  // Drop zones
  document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', e => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!dragItem) return;
      const targetCatId = col.dataset.cat;
      const targetStatus = col.dataset.status;

      // Find and move habit
      let habit = null;
      const srcCat = state.categories.find(c => c.id === dragItem.catId);
      if (srcCat) {
        const idx = srcCat.habits.findIndex(h => h.id === dragItem.habitId);
        if (idx !== -1) {
          habit = { ...srcCat.habits[idx] };
          srcCat.habits.splice(idx, 1);
        }
      }
      if (habit) {
        habit.status = targetStatus;
        const tgtCat = state.categories.find(c => c.id === targetCatId);
        if (tgtCat) tgtCat.habits.push(habit);
      }
      dragItem = null;
      saveData(state);
      render();
    });
  });
}

function confirmAdd(catId) {
  const inp = document.querySelector(`.habit-input[data-cat="${catId}"]`);
  if (!inp) return;
  const name = inp.value.trim();
  if (!name) return;
  const cat = state.categories.find(c => c.id === catId);
  if (cat) cat.habits.push({ id: uid(), name, status: 'todo' });
  addFormOpen = null;
  saveData(state);
  render();
}

render();