/* Os links usam a navegação nativa do navegador, sem espera artificial. */
(function () {
  'use strict';
  window.addEventListener('pageshow', function () {
    const overlay = document.getElementById('page-transition');
    if (overlay) overlay.remove();
  });
})();
