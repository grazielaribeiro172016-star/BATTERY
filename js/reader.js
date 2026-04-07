/* ═══════════════════════════════════════════
   reader.js — Leitor de lições e lógica de progresso
═══════════════════════════════════════════ */

let readerBatId    = null;
let readerLessonIdx = 0;

function openReader(batId, idx) {
  readerBatId     = batId;
  readerLessonIdx = idx;
  renderReader();
  showScreen('reader');
}

function renderReader() {
  const bat = BATTERIES.find(b => b.id === readerBatId);
  if (!bat) return;
  const p     = STATE.progress[readerBatId] || {pct:0, completed:new Set()};
  const idx   = readerLessonIdx;
  const total = bat.lessons.length;
  const isDone = p.completed.has(idx);

  document.getElementById('reader-bat-name').textContent  = bat.name.toUpperCase();
  document.getElementById('reader-title').textContent     = bat.lessons[idx];
  document.getElementById('reader-lesson-count').textContent = `${idx+1}/${total}`;

  const fill = document.getElementById('reader-mini-fill');
  fill.style.width      = ((idx+1)/total*100) + '%';
  fill.style.background = getBatColor(p.pct);

  const contentEl = document.getElementById('reader-content');
  const content   = BATTERY_CONTENT[readerBatId];
  contentEl.textContent = (content && content[idx]) ? content[idx].summary : bat.lessons[idx] + '\n\nConteúdo em breve.';

  const btn = document.getElementById('btn-learned');
  if (isDone) {
    btn.textContent  = '✓ Já aprendido';
    btn.className    = 'btn-learned done';
    btn.onclick      = null;
  } else {
    btn.textContent  = '⚡ Aprendi — Carregar bateria';
    btn.className    = 'btn-learned';
    btn.onclick      = () => completLessonFromReader();
  }

  document.getElementById('btn-prev-lesson').disabled = idx === 0;
  document.getElementById('btn-next-lesson').disabled = idx === total - 1;
  document.querySelector('.reader-body').scrollTop = 0;
}

function completLessonFromReader() {
  const batId = readerBatId;
  const idx   = readerLessonIdx;
  if (!STATE.progress[batId]) STATE.progress[batId] = {pct:0, completed:new Set()};
  const p = STATE.progress[batId];
  if (p.completed.has(idx)) return;

  p.completed.add(idx);
  const bat  = BATTERIES.find(b => b.id === batId);
  p.pct      = Math.min(100, p.completed.size * (100 / bat.lessons.length));
  STATE.xp  += 10;
  STATE.totalLessons++;
  markActivity();
  checkBadges();
  saveState();

  fireConfetti(window.innerWidth/2, window.innerHeight/2);
  showToast('⚡ +10 XP — energia carregada!');

  const btn = document.getElementById('btn-learned');
  btn.textContent = '✓ Já aprendido';
  btn.className   = 'btn-learned done';
  btn.onclick     = null;

  // Atualiza barra de progresso do detail atrás
  const df = document.getElementById('detail-fill');
  if (df) {
    df.style.width      = p.pct + '%';
    df.style.background = getBatColor(p.pct);
    document.getElementById('detail-pct').textContent = Math.round(p.pct) + '%';
    document.getElementById('detail-pct').style.color = getBatColor(p.pct);
  }
  document.getElementById('home-streak').textContent = `🔥 ${STATE.streak} dias`;

  // Avança automaticamente para a próxima lição
  if (idx < bat.lessons.length - 1) {
    setTimeout(() => { readerLessonIdx = idx + 1; renderReader(); }, 1200);
  }
}

/* ── Eventos do reader ── */
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
