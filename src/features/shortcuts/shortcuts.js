/* ============================================================
   SHORTCUTS.JS — Atalhos de teclado globais
   G=Galáxia, A=Sobre, P=Projetos, S=Serviços, C=Contato
   ? = mostra overlay de ajuda, ESC = fecha overlay
============================================================ */
(function () {
  'use strict';

  const shortcuts = {
    'g': 'index.html',
    'p': 'projects.html',
    'a': 'about.html',
    's': 'services.html',
    'c': 'contact.html',
  };

  let helpVisible = false;

  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === '?') {
      e.preventDefault();
      toggleHelp();
      return;
    }

    if (e.key === 'Escape' && helpVisible) {
      closeHelp();
      return;
    }

    const dest = shortcuts[e.key.toLowerCase()];
    if (dest) {
      const overlay = document.getElementById('page-transition');
      if (overlay) {
        overlay.classList.add('entering');
        setTimeout(function() { window.location.href = dest; }, 500);
      } else {
        window.location.href = dest;
      }
    }
  });

  function toggleHelp() {
    helpVisible ? closeHelp() : openHelp();
  }

  function openHelp() {
    helpVisible = true;
    const modal = document.createElement('div');
    modal.id = 'shortcut-help';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
    modal.innerHTML = `
      <div style="background:var(--surface,#0a1628);border:1px solid var(--c1);border-radius:12px;padding:2rem 2.5rem;text-align:center;font-family:var(--font-body,sans-serif);max-width:400px;">
        <h3 style="font-family:var(--font-display,monospace);color:var(--c1);font-size:1.1rem;letter-spacing:0.15em;margin-bottom:1.5rem;">⌨️ ATALHOS DE TECLADO</h3>
        <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:0.6rem;font-family:var(--font-mono,monospace);font-size:0.85rem;color:var(--dim,#8899aa);">
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">G</kbd> — Galáxia (Home)</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">A</kbd> — Sobre mim</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">P</kbd> — Projetos</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">S</kbd> — Serviços</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">C</kbd> — Contato</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">?</kbd> — Esta ajuda</li>
          <li><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:var(--c1);">ESC</kbd> — Fechar</li>
        </ul>
        <button onclick="document.getElementById('shortcut-help').remove()" style="margin-top:1.5rem;padding:0.5rem 1.5rem;background:var(--c1);color:#000;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:var(--font-mono,monospace);letter-spacing:0.1em;">FECHAR</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function closeHelp() {
    helpVisible = false;
    const el = document.getElementById('shortcut-help');
    if (el) el.remove();
  }
})();
