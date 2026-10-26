(function () {
  'use strict';
  const keys = {g:'index.html',a:'about.html',p:'projects.html',s:'services.html',c:'contact.html'};
  let help;
  function openHelp() {
    if (!help) {
      help = document.createElement('dialog'); help.className = 'preferences-panel'; help.setAttribute('aria-labelledby','shortcuts-title');
      help.innerHTML = '<h2 id="shortcuts-title">Atalhos de navegação</h2><p>Combine Alt + Shift com a letra da página.</p><ul class="shortcut-list"><li>G — Galáxia</li><li>A — Sobre</li><li>P — Projetos</li><li>S — Serviços</li><li>C — Contato</li></ul><p>Escape fecha esta ajuda. Os atalhos podem ser desativados em Preferências.</p><button type="button" class="ui-button">Fechar ajuda</button>';
      help.querySelector('button').addEventListener('click', () => help.close()); document.body.appendChild(help);
    }
    if (!help.open) help.showModal();
  }
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (event.defaultPrevented || target.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open], #project-modal.open')) return;
    if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {event.preventDefault();openHelp();return;}
    if (!PortfolioUI.storage.get('shortcuts',true) || !event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
    const href = keys[event.key.toLowerCase()]; if (href) {event.preventDefault();location.href=href;}
  });
})();
