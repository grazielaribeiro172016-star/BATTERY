/* ═══════════════════════════════════════════
   onboarding.js — Fluxo de primeiro acesso
═══════════════════════════════════════════ */

const PICK_OPTIONS = BATTERIES.slice(0, 8);
let currentFirstWinBat = null;
let firstWinDone = false;

function initPickScreen() {
  const grid = document.getElementById('pick-grid');
  grid.innerHTML = '';
  let selected = [];

  PICK_OPTIONS.forEach(bat => {
    const btn = document.createElement('button');
    btn.className = 'pick-btn';
    btn.innerHTML = `<div class="pick-icon">${bat.icon}</div><div class="pick-name">${bat.name}</div>`;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selected = selected.filter(id => id !== bat.id);
      } else {
        if (selected.length >= 3) { showToast('Máximo 3 baterias para começar'); return; }
        btn.classList.add('selected');
        selected.push(bat.id);
      }
      document.getElementById('pick-count').textContent = selected.length;
      document.getElementById('btn-start-pick').disabled = selected.length === 0;
    });
    grid.appendChild(btn);
  });

  document.getElementById('btn-start-pick').addEventListener('click', () => {
    if (selected.length === 0) return;
    STATE.selectedBatteries = selected;
    selected.forEach(id => {
      if (!STATE.progress[id]) STATE.progress[id] = {pct:0, completed:new Set()};
    });
    currentFirstWinBat = BATTERIES.find(b => b.id === selected[0]);
    document.getElementById('first-win-bat-name').textContent = currentFirstWinBat.name.toUpperCase();
    document.getElementById('first-lesson-text').textContent  = currentFirstWinBat.lessons[0];
    showScreen('first-win');
  });
}

document.getElementById('first-lesson-item').addEventListener('click', () => {
  if (firstWinDone) return;
  firstWinDone = true;

  const check = document.getElementById('first-check');
  check.classList.add('done','check-bounce');
  check.textContent = '✓';
  document.getElementById('first-lesson-item').classList.add('tapped');

  setTimeout(() => {
    const fill = document.getElementById('big-bat-fill');
    fill.style.width      = '10%';
    fill.textContent      = '10%';
    fill.style.background = 'var(--red)';
  }, 300);

  setTimeout(() => {
    document.getElementById('reward-toast').classList.add('show');
    fireConfetti(window.innerWidth/2, window.innerHeight/2);
  }, 800);

  if (currentFirstWinBat) {
    const batId = currentFirstWinBat.id;
    STATE.progress[batId] = STATE.progress[batId] || {pct:0, completed:new Set()};
    STATE.progress[batId].completed.add(0);
    STATE.progress[batId].pct = 10;
    STATE.xp           = 10;
    STATE.totalLessons = 1;
    STATE.streak       = 1;
    STATE.lastActivity = new Date().toISOString();
    saveState();
  }

  setTimeout(() => { document.getElementById('btn-enter-app').style.display = 'block'; }, 1600);
});

document.getElementById('btn-enter-app').addEventListener('click', () => {
  STATE.onboarded = true;
  saveState();
  document.getElementById('bottom-nav').classList.add('visible');
  refreshScreens();
  showScreen('home');
});
