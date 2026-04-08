/* ═══════════════════════════════════════════
   index.js — Monta BATTERY_CONTENT + inicializa o app
   Carregue APÓS todos os outros scripts
═══════════════════════════════════════════ */

// Usar window evita SyntaxError se outro arquivo declarar BATTERY_CONTENT
window.BATTERY_CONTENT = {
  ingles:        CONTENT_INGLES,
  vendas:        CONTENT_VENDAS,
  comunicacao:   CONTENT_COMUNICACAO,
  lideranca:     CONTENT_LIDERANCA,
  marketing:     CONTENT_MARKETING,
  financas:      CONTENT_FINANCAS,
  produtividade: CONTENT_PRODUTIVIDADE,
  emocional:     CONTENT_EMOCIONAL,
  programacao:   CONTENT_PROGRAMACAO,
  saude:         CONTENT_SAUDE,
  negociacao:    CONTENT_NEGOCIACAO,
  empreend:      CONTENT_EMPREEND,
};

/* ── Boot ── */
loadState();

if (STATE.onboarded) {
  document.getElementById('bottom-nav').classList.add('visible');
  refreshScreens();
  showScreen('home');
  setTimeout(() => {
    document.getElementById('screen-splash').classList.remove('active');
    document.getElementById('screen-home').classList.add('active');
  }, 1000);
} else {
  setTimeout(() => {
    initPickScreen();
    showScreen('pick');
  }, 1800);
}

/* ── Navegação ── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    refreshScreens();
    showScreen(item.dataset.target);
  });
});

document.getElementById('back-btn').addEventListener('click', () => {
  refreshScreens();
  showScreen(currentMain);
});

/* Service Worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
