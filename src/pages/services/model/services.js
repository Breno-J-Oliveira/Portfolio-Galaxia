/* ============================================================
   SERVICES.JS — Lógica da página de serviços
   Usa Utils compartilhados + FAQ accordion específico.
============================================================ */
(function () {
  'use strict';

  Utils.initPage();

  /* ── FAQ ACCORDION ─────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function(item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o) { o.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();
