/* ═══════════════════════════════════════════
   index.js — Monta BATTERY_CONTENT + inicializa o app
═══════════════════════════════════════════ */

// Função de segurança para evitar que variáveis faltantes travem o site
const safeGet = (variable) => typeof variable !== 'undefined' ? variable : [];

const BATTERY_CONTENT = {
  ingles:        safeGet(window.CONTENT_INGLES),
  vendas:        safeGet(window.CONTENT_VENDAS),
  comunicacao:   safeGet(window.CONTENT_COMUNICACAO),
  lideranca:     safeGet(window.CONTENT_LIDERANCA),
  marketing:     safeGet(window.CONTENT_MARKETING),
  financas:      safeGet(window.CONTENT_FINANCAS),
  produtividade: safeGet(window.CONTENT_PRODUTIVIDADE),
  emocional:     safeGet(window.CONTENT_EMOCIONAL),
  programacao:   safeGet(window.CONTENT_PROGRAMACAO),
  saude:         safeGet(window.CONTENT_SAUDE),
  negociacao:    safeGet(window.CONTENT_NEGOCIACAO),
  empreend:      safeGet(window.CONTENT_EMPREEND),
};

/* ── Boot ── */
// Garante que o estado seja carregado antes de decidir a tela
if (typeof loadState === 'function') {
  loadState();
}

const splash = document.getElementById('screen-splash');
const bottomNav = document.getElementById('bottom-nav');

if (typeof STATE !== 'undefined' && STATE.onboarded) {
  if (bottomNav) bottomNav.classList.add('visible');
  if (typeof refreshScreens === 'function') refreshScreens();
  
  setTimeout(() => {
    if (splash) splash.classList.remove('active');
    showScreen('home');
  }, 1000);
} else {
  setTimeout(() => {
    if (typeof initPickScreen === 'function') initPickScreen();
    showScreen('pick');
  }, 1800);
}

/* ── Navegação ── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (typeof refreshScreens === 'function') refreshScreens();
    showScreen(item.dataset.target);
  });
});

const backBtn = document.getElementById('back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (typeof refreshScreens === 'function') refreshScreens();
    showScreen(typeof currentMain !== 'undefined' ? currentMain : 'home');
  });
}

/* Service Worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
