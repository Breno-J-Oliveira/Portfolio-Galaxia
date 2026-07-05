/* ============================================================
   TRANSITIONS.JS — Transição de página com efeito warp
   Intercepta cliques em links internos e aplica overlay
============================================================ */
(function () {
  'use strict';

  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Entrada da página
  window.addEventListener('load', () => {
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('leaving'), 400);
  });

  // Interceptar cliques em links internos
  var transitioning = false;
  document.addEventListener('click', function(e) {
    if (transitioning) return;
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('data:')) return;
    e.preventDefault();
    transitioning = true;
    overlay.classList.add('entering');
    setTimeout(function() { window.location.href = href; }, 500);
  });
})();
