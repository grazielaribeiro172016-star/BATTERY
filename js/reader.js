/* ═══════════════════════════════════════════
   reader.js — Tela de leitura 80/20
═══════════════════════════════════════════ */

/* ── Monta BATTERY_CONTENT a partir das variáveis de cada arquivo ── */
const BATTERY_CONTENT = {};

function registerContent(map) {
  Object.assign(BATTERY_CONTENT, map);
}

/* ── Estado do reader ── */
let readerBatId    = null;
let readerLessonIdx = 0;

/* ── Abre o reader ── */
function openReader(batId, idx) {
  readerBatId     = batId;
  readerLessonIdx = idx;
  renderReader();
  showScreen('reader');
}

/* ── Renderiza o reader ── */
function renderReader() {
  const bat = BATTERIES.find(b => b.id === readerBatId);
  if (!bat) return;

  const p      = STATE.progress[readerBatId] || { pct: 0, completed: new Set() };
  const idx    = readerLessonIdx;
  const total  = bat.lessons.length;
  const isDone = p.completed.has(idx);

  /* header */
  document.getElementById('reader-bat-name').textContent    = bat.name.toUpperCase();
  document.getElementById('reader-title').textContent       = bat.lessons[idx];
  document.getElementById('reader-lesson-count').textContent = `${idx + 1}/${total}`;

  /* mini progress bar */
  const fill = document.getElementById('reader-mini-fill');
  fill.style.width      = ((idx + 1) / total * 100) + '%';
  fill.style.background = getBatColor(p.pct);

  /* conteúdo */
  const contentEl = document.getElementById('reader-content');
  const batContent = BATTERY_CONTENT[readerBatId];

  if (batContent && batContent[idx] && batContent[idx].summary) {
    contentEl.textContent = batContent[idx].summary;
  } else {
    contentEl.textContent = bat.lessons[idx] + '\n\nConteúdo em breve.';
  }

  /* botão aprendido */
  const btn = document.getElementById('btn-learned');
  if (isDone) {
    btn.textContent = '✓ Já aprendido';
    btn.className   = 'btn-learned done';
    btn.onclick     = null;
  } else {
    btn.textContent = '⚡ Aprendi — Carregar bateria';
    btn.className   = 'btn-learned';
    btn.onclick     = completLessonFromReader;
  }

  /* botões de navegação */
  document.getElementById('btn-prev-lesson').disabled = idx === 0;
  document.getElementById('btn-next-lesson').disabled = idx === total - 1;

  /* scroll ao topo */
  const body = document.querySelector('.reader-body');
  if (body) body.scrollTop = 0;
}

/* ── Marca lição como concluída pelo reader ── */
function completLessonFromReader() {
  const batId = readerBatId;
  const idx   = readerLessonIdx;

  if (!STATE.progress[batId]) STATE.progress[batId] = { pct: 0, completed: new Set() };
  const p = STATE.progress[batId];
  if (p.completed.has(idx)) return;

  const bat  = BATTERIES.find(b => b.id === batId);
  const step = 100 / bat.lessons.length;

  p.completed.add(idx);
  p.pct = Math.min(100, p.completed.size * step);

  STATE.xp++;
  STATE.xp += 9; /* total +10 */
  STATE.totalLessons++;
  markActivity();
  checkBadges();
  saveState();

  playSound(batId); /* ⚡ som sutil ao carregar bateria */
  fireConfetti(window.innerWidth / 2, window.innerHeight / 2);
  showToast('⚡ +10% de energia mental');

  /* atualiza botão */
  const btn       = document.getElementById('btn-learned');
  btn.textContent = '✓ Já aprendido';
  btn.className   = 'btn-learned done';
  btn.onclick     = null;

  /* avança automaticamente para o próximo após 1.2s */
  if (idx < bat.lessons.length - 1) {
    setTimeout(() => {
      readerLessonIdx = idx + 1;
      renderReader();
    }, 1200);
  }

  /* atualiza barra de detalhe (se aberta atrás) */
  const detailFill = document.getElementById('detail-fill');
  const detailPct  = document.getElementById('detail-pct');
  if (detailFill) {
    detailFill.style.width      = p.pct + '%';
    detailFill.style.background = getBatColor(p.pct);
  }
  if (detailPct) {
    detailPct.textContent  = Math.round(p.pct) + '%';
    detailPct.style.color  = getBatColor(p.pct);
  }

  const homeStreak = document.getElementById('home-streak');
  if (homeStreak) homeStreak.textContent = `🔥 ${STATE.streak} dias`;
}

/* ── Listeners de navegação ── */
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('btn-prev-lesson').addEventListener('click', () => {
    if (readerLessonIdx > 0) { readerLessonIdx--; renderReader(); }
  });

  document.getElementById('btn-next-lesson').addEventListener('click', () => {
    const bat = BATTERIES.find(b => b.id === readerBatId);
    if (bat && readerLessonIdx < bat.lessons.length - 1) { readerLessonIdx++; renderReader(); }
  });

  document.getElementById('reader-back-btn').addEventListener('click', () => {
    renderDetail(readerBatId);
    showScreen('detail');
  });

});
