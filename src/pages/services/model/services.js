/* Serviços e dúvidas usam o conteúdo central do portfólio. */
(function () {
  'use strict';
  const data = window.PORTFOLIO_DATA;
  const grid = document.getElementById('services-grid');
  if (grid) grid.innerHTML = data.services.map((s, i) => `
    <article class="service-card c${i + 1} reveal">
      <span class="service-icon" aria-hidden="true">${s.icon}</span>
      <h3 class="service-name">${s.title}</h3><p class="service-desc">${s.description}</p>
      <ul class="service-includes">${s.includes.map(item => `<li>${item}</li>`).join('')}</ul>
      <a class="info-link" href="contact.html">CONVERSAR SOBRE O ESCOPO →</a>
    </article>`).join('');
  const faq = document.getElementById('faq-list');
  if (faq) faq.innerHTML = data.faq.map((item, i) => `
    <div class="faq-item">
      <button class="faq-question reveal" type="button" aria-expanded="false" aria-controls="faq-answer-${i}">
        <span>${item.q}</span><span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${i}" hidden><div class="faq-answer-inner">${item.a}</div></div>
    </div>`).join('');
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('.faq-question').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        other.closest('.faq-item').classList.remove('open');
        document.getElementById(other.getAttribute('aria-controls')).hidden = true;
      });
      button.setAttribute('aria-expanded', String(open));
      button.closest('.faq-item').classList.toggle('open', open);
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
  });
  const briefForm=document.getElementById('brief-form');
  const goal=document.getElementById('brief-goal');
  const summary=document.getElementById('brief-summary');
  const choices={site:'Site ou landing page',app:'Aplicação web',api:'API e backend',automation:'Automação e integração'};
  function updateBrief(){
    const selected=[...briefForm.querySelectorAll('[name="scope"]:checked')].map(input=>input.value);
    summary.textContent=[`Projeto: ${choices[document.getElementById('brief-type').value]}`,`Escopo: ${selected.length?selected.join('; '):'A definir em conjunto'}`,`Prazo: ${document.getElementById('brief-deadline').value}`,`Objetivo: ${goal.value.trim() || 'Quero entender as possibilidades.'}`].join('\n\n');
    document.getElementById('brief-guidance').textContent=selected.includes('Integração com outra ferramenta')?'Na conversa, vamos identificar a ferramenta e quais dados precisam ser integrados.':selected.includes('Migração ou importação de dados')?'Vale trazer um exemplo dos dados e do formato atual para dimensionar a migração.':'Começar com os fluxos essenciais ajuda a definir uma primeira entrega.';
    document.getElementById('brief-status').textContent='';
  }
  briefForm.addEventListener('input',updateBrief);briefForm.addEventListener('change',updateBrief);briefForm.addEventListener('reset',()=>queueMicrotask(updateBrief));updateBrief();
  document.getElementById('copy-brief').addEventListener('click',async()=>{document.getElementById('brief-status').textContent=await PortfolioUI.copy(summary.textContent)?'Briefing copiado.':'Não foi possível copiar. Selecione o resumo e copie manualmente.';});
  document.getElementById('send-brief').addEventListener('click',()=>{
    try{sessionStorage.setItem('portfolio:brief',summary.textContent);location.href='contact.html?intent=freelance';}
    catch(_){document.getElementById('brief-status').textContent='Não foi possível guardar o briefing. Copie o resumo e cole na página de contato.';}
  });
  Utils.initPage();
})();
