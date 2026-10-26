(function () {
  'use strict';
  const UI = window.PortfolioUI;
  const trigger = document.createElement('button');
  trigger.className = 'preferences-trigger'; trigger.type = 'button';
  trigger.textContent = 'Preferências'; trigger.setAttribute('aria-label','Preferências'); trigger.setAttribute('aria-haspopup', 'dialog');
  const panel = document.createElement('dialog');
  panel.className = 'preferences-panel'; panel.setAttribute('aria-labelledby', 'preferences-title');
  panel.innerHTML = `<div class="panel-heading"><h2 id="preferences-title">Sua navegação</h2><button type="button" data-close aria-label="Fechar preferências">✕</button></div>
    <p>Ajuste a experiência neste navegador.</p>
    <label class="preference-row"><input id="motion-setting" type="checkbox"> Pausar animações e efeitos contínuos</label>
    <label class="preference-row"><input id="shortcuts-setting" type="checkbox"> Ativar atalhos com Alt + Shift</label>
    <p class="content-note">Alt + Shift + G: início · A: sobre · P: projetos · S: serviços · C: contato. Use ? para ver a ajuda.</p>
    <button type="button" class="ui-button" id="share-portfolio">Compartilhar portfólio</button>
    <button type="button" class="ui-button" id="install-portfolio" hidden>Instalar portfólio</button>
    <p id="preferences-status" role="status" aria-live="polite"></p>`;
  const offline = document.createElement('p'); offline.className = 'offline-status'; offline.role = 'status'; offline.hidden = navigator.onLine;
  offline.textContent = 'Você está offline. O conteúdo já salvo continua disponível.';
  document.body.append(trigger, panel, offline);
  const motion = panel.querySelector('#motion-setting'); motion.checked = UI.paused();
  const shortcuts = panel.querySelector('#shortcuts-setting'); shortcuts.checked = UI.storage.get('shortcuts', true);
  trigger.addEventListener('click', () => panel.showModal());
  panel.querySelector('[data-close]').addEventListener('click', () => panel.close());
  panel.addEventListener('click', event => { if (event.target === panel) { const box = panel.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) panel.close(); } });
  panel.addEventListener('close', () => trigger.focus());
  motion.addEventListener('change', () => {
    UI.storage.set('motion', motion.checked ? 'paused' : 'active');
    document.documentElement.dataset.motion = motion.checked ? 'paused' : 'active';
    document.dispatchEvent(new Event('portfolio:motion'));
  });
  shortcuts.addEventListener('change', () => UI.storage.set('shortcuts', shortcuts.checked));
  const status = panel.querySelector('#preferences-status');
  panel.querySelector('#share-portfolio').addEventListener('click', async () => {
    const url = new URL('index.html', location.href).href;
    try {
      if (navigator.share) { await navigator.share({title:'Breno J. Oliveira · Full Stack',url}); status.textContent = 'Compartilhamento concluído.'; }
      else status.textContent = await UI.copy(url) ? 'Link do portfólio copiado.' : 'Não foi possível copiar. Use o endereço do navegador.';
    } catch (error) { status.textContent = error.name === 'AbortError' ? 'Compartilhamento cancelado.' : 'Não foi possível compartilhar. Use o endereço do navegador.'; }
  });
  const install = panel.querySelector('#install-portfolio');
  function updateInstall() { install.hidden = !UI.installPrompt; }
  document.addEventListener('portfolio:install-ready', updateInstall); updateInstall();
  install.addEventListener('click', async () => {
    if (!UI.installPrompt) return;
    const prompt = UI.installPrompt; UI.installPrompt = null; updateInstall();
    try { await prompt.prompt(); const result = await prompt.userChoice; status.textContent = result.outcome === 'accepted' ? 'Instalação solicitada ao navegador.' : 'Você pode continuar usando pelo navegador.'; }
    catch (_) { status.textContent = 'A instalação não está disponível neste momento.'; }
  });
  window.addEventListener('offline', () => {offline.hidden = false;});
  window.addEventListener('online', () => {offline.hidden = true;});
})();
