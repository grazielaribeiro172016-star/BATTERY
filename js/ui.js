/* ═══════════════════════════════════════════
   ui.js — Navegação, renderização e utilitários visuais
═══════════════════════════════════════════ */

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('global-toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Confetti ── */
function fireConfetti(x, y) {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#e84040','#f5a623','#4caf50','#ffffff','#f5a623'];
  const particles = Array.from({length:40}, () => ({
    x, y,
    vx: (Math.random()-.5)*8,
    vy: -(Math.random()*6+3),
    r:  Math.random()*5+3,
    color: colors[Math.floor(Math.random()*colors.length)],
    alpha: 1, gravity: .18,
  }));
  let frame;
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.alpha-=0.02;
      ctx.save(); ctx.globalAlpha=Math.max(0,p.alpha); ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
    });
    if (particles.some(p=>p.alpha>0)) frame=requestAnimationFrame(animate);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); cancelAnimationFrame(frame); }
  }
  animate();
}

/* ── Sons (Web Audio API — sem arquivos externos) ── */
/*
  Cada bateria tem um "sabor" sonoro sutil:
    tech        → bip eletrônico limpo       (programacao)
    cash        → acorde brilhante           (vendas, financas, negociacao, empreend)
    human       → nota calorosa e suave      (comunicacao, lideranca, emocional)
    spark       → faísca energética curta    (produtividade, marketing)
    zen         → tom puro e sereno          (saude)
    default     → ding neutro satisfatório   (qualquer outra)

  Mapa batId → sabor:
*/
const SOUND_MAP = {
  programacao:  'tech',
  vendas:       'cash',
  financas:     'cash',
  negociacao:   'cash',
  empreend:     'cash',
  comunicacao:  'human',
  lideranca:    'human',
  emocional:    'human',
  produtividade:'spark',
  marketing:    'spark',
  saude:        'zen',
  ingles:       'default',
};

function playSound(batId) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const type = SOUND_MAP[batId] || 'default';
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.18, ctx.currentTime); /* bem sutil */
    master.connect(ctx.destination);

    if (type === 'tech') {
      /* bip eletrônico: dois tons rápidos subindo */
      [880, 1320].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        g.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
        o.connect(g); g.connect(master);
        o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.12);
      });

    } else if (type === 'cash') {
      /* acorde brilhante: tríade maior */
      [523, 659, 784].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);
        g.gain.setValueAtTime(0.5, ctx.currentTime + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.4);
        o.connect(g); g.connect(master);
        o.start(ctx.currentTime + i * 0.04);
        o.stop(ctx.currentTime + i * 0.04 + 0.4);
      });

    } else if (type === 'human') {
      /* nota calorosa: senoide suave com leve vibrato */
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(4, ctx.currentTime);
      lfo.connect(lfoGain); lfoGain.connect(o.frequency);
      o.type = 'sine';
      o.frequency.setValueAtTime(528, ctx.currentTime);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      o.connect(g); g.connect(master);
      lfo.start(ctx.currentTime); o.start(ctx.currentTime);
      lfo.stop(ctx.currentTime + 0.55); o.stop(ctx.currentTime + 0.55);

    } else if (type === 'spark') {
      /* faísca: nota curta com pitch descendo rápido */
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1000, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      o.connect(g); g.connect(master);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.18);

    } else if (type === 'zen') {
      /* bowl tibetano simplificado: senoide pura com decay longo */
      [396, 792].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(i === 0 ? 0.5 : 0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        o.connect(g); g.connect(master);
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 1.2);
      });

    } else {
      /* default: ding neutro — dois sinos rápidos */
      [660, 880].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        g.gain.setValueAtTime(0.5, ctx.currentTime + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
        o.connect(g); g.connect(master);
        o.start(ctx.currentTime + i * 0.1);
        o.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    }

    /* fecha o contexto após os sons terminarem */
    setTimeout(() => ctx.close(), 2000);

  } catch(e) { /* silencia qualquer erro — o app continua funcionando */ }
}

/* ── Navegação ── */
const MAIN_SCREENS = ['home','baterias','progresso','perfil'];
let currentMain = 'home';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.target === id);
  });
  if (MAIN_SCREENS.includes(id)) currentMain = id;
}

function showDetail(batId) {
  renderDetail(batId);
  showScreen('detail');
}

/* ── Renderização de Cards ── */
function renderBatCard(bat, container) {
  const p = STATE.progress[bat.id] || {pct:0, completed:new Set()};
  const card = document.createElement('div');
  card.className = 'bat-card ' + getBatState(p.pct);
  card.innerHTML = `
    <div class="bat-card-top">
      <div class="bat-card-left">
        <div class="bat-card-icon">${bat.icon}</div>
        <div>
          <div class="bat-card-name">${bat.name}</div>
          <div class="bat-card-lessons">${p.completed.size}/${bat.lessons.length} habilidades</div>
        </div>
      </div>
      <div class="bat-pct-label">${Math.round(p.pct)}%</div>
    </div>
    <div class="bat-track"><div class="bat-fill" style="width:${p.pct}%"></div></div>`;
  card.addEventListener('click', () => showDetail(bat.id));
  container.appendChild(card);
}

/* ── Home ── */
function renderHome() {
  const lv   = getLevel();
  const next = getNextLevel();
  document.getElementById('home-level-name').textContent = lv.name;
  document.getElementById('home-streak').textContent = `🔥 ${STATE.streak} dias`;
  const xpInLevel = next ? STATE.xp - lv.min : 9999;
  const xpToNext  = next ? next.min - lv.min : 9999;
  const pct = next ? Math.min(100,(xpInLevel/xpToNext)*100) : 100;
  document.getElementById('home-xp-bar').style.width = pct + '%';
  document.getElementById('home-xp-label').textContent = STATE.xp + ' XP';
  const list = document.getElementById('home-bat-list');
  list.innerHTML = '';
  getMyBatteries().forEach(b => renderBatCard(b, list));
}

/* ── Baterias (todas) ── */
function renderAllBats() {
  const list = document.getElementById('all-bat-list');
  list.innerHTML = '';
  BATTERIES.forEach(b => {
    const isSelected = STATE.selectedBatteries.includes(b.id);
    const p = STATE.progress[b.id] || {pct:0, completed:new Set()};
    const card = document.createElement('div');
    card.className = 'bat-card ' + getBatState(p.pct);
    card.innerHTML = `
      <div class="bat-card-top">
        <div class="bat-card-left">
          <div class="bat-card-icon">${b.icon}</div>
          <div>
            <div class="bat-card-name">${b.name}</div>
            <div class="bat-card-lessons">${isSelected ? p.completed.size+'/'+b.lessons.length+' habilidades' : 'Toque para ativar'}</div>
          </div>
        </div>
        <div class="bat-pct-label">${Math.round(p.pct)}%</div>
      </div>
      <div class="bat-track"><div class="bat-fill" style="width:${p.pct}%"></div></div>`;
    card.addEventListener('click', () => {
      if (!isSelected) {
        STATE.selectedBatteries.push(b.id);
        if (!STATE.progress[b.id]) STATE.progress[b.id] = {pct:0, completed:new Set()};
        saveState(); renderAllBats();
        showToast('⚡ Bateria ' + b.name + ' ativada!');
      } else {
        showDetail(b.id);
      }
    });
    list.appendChild(card);
  });
}

/* ── Detail ── */
function renderDetail(batId) {
  const bat = BATTERIES.find(b => b.id === batId);
  if (!bat) return;
  const p = STATE.progress[batId] || {pct:0, completed:new Set()};
  document.getElementById('detail-name').textContent = bat.name;
  document.getElementById('detail-fill').style.width = p.pct + '%';
  document.getElementById('detail-fill').style.background = getBatColor(p.pct);
  document.getElementById('detail-pct').textContent = Math.round(p.pct) + '%';
  document.getElementById('detail-pct').style.color = getBatColor(p.pct);
  const list = document.getElementById('lessons-list');
  list.innerHTML = '';
  bat.lessons.forEach((lesson, idx) => {
    const done = p.completed.has(idx);
    const row = document.createElement('div');
    row.className = 'lesson-row' + (done?' completed':'');
    row.innerHTML = `
      <div class="check-circle${done?' done':''}"> ${done?'✓':''} </div>
      <div class="lesson-row-text">${lesson}</div>
      <div class="lesson-xp">${done?'+10 XP ✓':'+10 XP'}</div>`;
    row.addEventListener('click', () => openReader(batId, idx));
    list.appendChild(row);
  });
}

/* ── Progresso ── */
function renderProgresso() {
  document.getElementById('prog-xp').textContent      = STATE.xp;
  document.getElementById('prog-streak').textContent  = STATE.streak;
  document.getElementById('prog-lessons').textContent = STATE.totalLessons;
  document.getElementById('prog-bats').textContent    = STATE.selectedBatteries.length;
  const grid = document.getElementById('streak-days-grid');
  grid.innerHTML = '';
  const days  = ['D','S','T','Q','Q','S','S'];
  const today = new Date().getDay();
  for (let i=6; i>=0; i--) {
    const dayIdx  = (today-i+7)%7;
    const cell    = document.createElement('div');
    cell.className = 'streak-day'+(i<STATE.streak?' done':'')+(i===0?' today':'');
    cell.textContent = days[dayIdx];
    grid.appendChild(cell);
  }
  const list = document.getElementById('prog-bat-list');
  list.innerHTML = '';
  getMyBatteries().forEach(b => renderBatCard(b, list));
}

/* ── Perfil ── */
function renderPerfil() {
  const lv = getLevel();
  document.getElementById('avatar-initials').textContent    = STATE.userName ? STATE.userName[0].toUpperCase() : '?';
  document.getElementById('profile-name').textContent       = STATE.userName || 'Usuário';
  document.getElementById('profile-level-text').textContent = lv.name;
  const grid = document.getElementById('badges-grid');
  grid.innerHTML = '';
  BADGES_DEF.forEach(bd => {
    const earned = STATE.badges.includes(bd.id);
    const box = document.createElement('div');
    box.className = 'badge-box'+(earned?'':' locked');
    box.innerHTML = `<div class="badge-emoji">${bd.emoji}</div><div class="badge-name-small">${bd.name}</div>`;
    grid.appendChild(box);
  });
  if (STATE.totalLessons >= 3) document.getElementById('login-nudge-wrap').style.display = 'block';
}

function refreshScreens() {
  renderHome();
  renderAllBats();
  renderProgresso();
  renderPerfil();
}
