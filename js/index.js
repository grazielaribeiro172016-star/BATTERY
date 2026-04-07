/* ═══════════════════════════════════════════
   index.js — Inicializa o app
═══════════════════════════════════════════ */

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
