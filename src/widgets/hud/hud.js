/* ============================================================
   HUD.JS — Inicializa o HUD após injeção via fetch()
   Marca o link ativo com base em window.HUD_ACTIVE
============================================================ */
(function () {
  'use strict';

  function initHUD() {
    // Marcar link ativo
    const active = window.HUD_ACTIVE || '';
    document.querySelectorAll('.hud-nav a[data-page]').forEach(link => {
      if (link.dataset.page === active) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
    });

    // Notifica que o HUD foi injetado (utils re-inicializa o cursor)
    document.dispatchEvent(new CustomEvent('hud:ready'));
  }

  // Inicializar quando o HUD for injetado
  initHUD();
})();
