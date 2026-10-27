/* Contato: rascunho por e-mail sem simular o envio de mensagens. */
(function () {
  'use strict';
  Utils.initPage();
  const form = document.getElementById('contact-form');
  if (!form) return;
  const data = window.PORTFOLIO_DATA.contact;
  const configured = !!data.formspreeId && data.formspreeId !== 'SEU_ID_AQUI';
  const button = document.getElementById('submit-btn');
  const label = document.getElementById('submit-label');
  const status = document.getElementById('form-status');
  const draft = document.getElementById('email-draft');
  const fields = ['name', 'email', 'message'].map(id => document.getElementById(id));
  const idleLabel = configured ? 'Enviar mensagem' : 'Preparar e-mail';
  label.textContent = idleLabel;
  if (configured) document.getElementById('contact-mode').textContent = 'Envie uma mensagem pelo formulário ou use o e-mail direto.';
  function validate(field) {
    let valid = !!field.value.trim();
    if (field.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    if (field.id === 'message') valid = field.value.trim().length >= 20;
    field.classList.toggle('error', !valid);
    field.setAttribute('aria-invalid', String(!valid));
    field.setAttribute('aria-describedby', field.id + '-error');
    const error=document.getElementById(field.id + '-error');
    error.classList.toggle('visible', !valid);
    if(field.id==='message')error.textContent=field.value.trim()?'Escreva pelo menos 20 caracteres para explicar o contato.':'Escreva uma mensagem para continuar.';
    return valid;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });
  form.addEventListener('input', () => {
    draft.hidden = true;
    draft.removeAttribute('href');
    status.textContent = '';
  });
  const UI=PortfolioUI;
  const optIn=document.getElementById('save-draft');
  const draftStatus=document.getElementById('draft-status');
  const purpose=document.getElementById('project-type');
  const budget=document.getElementById('budget');
  const undo=document.getElementById('undo-draft');
  let cleared=null;
  optIn.checked=UI.storage.get('contact-save-enabled',false)===true;
  function draftData(){return {name:fields[0].value,email:fields[1].value,message:fields[2].value,purpose:purpose.value,budget:budget.value};}
  function restore(value){
    if(!value||typeof value!=='object')return;
    for(const [i,key,max] of [[0,'name',100],[1,'email',254],[2,'message',5000]])fields[i].value=String(value[key]||'').slice(0,max);
    purpose.value=[...purpose.options].some(o=>o.value===value.purpose)?value.purpose:'';
    budget.value=[...budget.options].some(o=>o.value===value.budget)?value.budget:'';
  }
  if(optIn.checked){const saved=UI.storage.get('contact-draft');if(saved){restore(saved);draftStatus.textContent='Rascunho recuperado deste navegador.';}}
  const intent=new URLSearchParams(location.search).get('intent');
  if(intent==='opportunity')purpose.value='opportunity';
  if(intent==='freelance')purpose.value='freelance';
  if(intent==='other')purpose.value='other';
  const sourceProject=window.PORTFOLIO_DATA.projects.find(project=>project.id===new URLSearchParams(location.search).get('project'));
  const sourceProjectURL=sourceProject ? new URL('projects.html?project='+encodeURIComponent(sourceProject.id), location.href).href : '';
  if(sourceProject){
    const context=document.createElement('div');context.className='contact-project-context';
    const text=document.createElement('p');text.textContent='Você veio do projeto '+sourceProject.title+'. A referência será incluída no e-mail.';
    const link=document.createElement('a');link.href=sourceProjectURL;link.textContent='Voltar aos detalhes de '+sourceProject.title;
    context.append(text,link);document.getElementById('contact-mode').before(context);
    fields[2].placeholder='O que você gostaria de conversar sobre o '+sourceProject.title+'?';
  }
  const intentButtons=[...document.querySelectorAll('[data-contact-intent]')];
  const intentContext=document.getElementById('intent-context');
  const intentCopy={
    opportunity:'Me conte sobre a vaga, o time e a forma de trabalho. Você também pode pedir meu currículo.',
    freelance:'Me conte o que você quer construir, quem vai usar e se existe um prazo. O orçamento é opcional.',
    other:'Uma dúvida, uma colaboração ou uma conversa sobre tecnologia. Fique à vontade para escrever.'
  };
  intentButtons.forEach(button=>button.addEventListener('click',()=>{
    purpose.value=button.dataset.contactIntent;
    draft.hidden=true;draft.removeAttribute('href');status.textContent='';
    const url=new URL(location.href);url.searchParams.set('intent',purpose.value);history.replaceState({},'',url);
    refreshContact();
  }));
  try{const brief=sessionStorage.getItem('portfolio:brief');if(brief){fields[2].value=(fields[2].value ? fields[2].value+'\n\n'+brief : brief).slice(0,5000);sessionStorage.removeItem('portfolio:brief');draftStatus.textContent='Briefing recebido. Você pode revisar e complementar antes de preparar o e-mail.';}}catch(_){}
  function refreshContact(){
    const showBudget=['web','backend','automation','freelance'].includes(purpose.value);budget.disabled=!showBudget;budget.closest('.form-group').hidden=!showBudget;
    const selected=showBudget?'freelance':purpose.value;
    intentButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.contactIntent===selected)));
    if(intentContext)intentContext.textContent=intentCopy[selected]||'Escreva um pouco sobre o que trouxe você até aqui.';
    document.getElementById('message-count').textContent=fields[2].value.length.toLocaleString('pt-BR')+' / 5.000 caracteres';
    if(optIn.checked){const saved=UI.storage.set('contact-draft',draftData());if(!saved)draftStatus.textContent='O navegador não permitiu salvar. Seus dados continuam no formulário.';}
  }
  form.addEventListener('input',refreshContact);purpose.addEventListener('change',refreshContact);
  optIn.addEventListener('change',()=>{UI.storage.set('contact-save-enabled',optIn.checked);if(!optIn.checked){UI.storage.remove('contact-draft');draftStatus.textContent='Salvamento desativado e cópia local apagada.';}else{refreshContact();draftStatus.textContent='Salvamento de rascunho ativado neste navegador.';}});
  document.getElementById('clear-draft').addEventListener('click',()=>{
    cleared=draftData();fields.forEach(field=>{field.value='';field.classList.remove('error');field.removeAttribute('aria-invalid');document.getElementById(field.id+'-error').classList.remove('visible');});purpose.value='';budget.value='';
    UI.storage.remove('contact-draft');draft.hidden=true;draft.removeAttribute('href');status.textContent='';undo.hidden=false;
    refreshContact();UI.storage.remove('contact-draft');draftStatus.textContent='Rascunho limpo. Você pode desfazer enquanto permanecer nesta página.';
  });
  undo.addEventListener('click',()=>{if(cleared){restore(cleared);refreshContact();draftStatus.textContent='Rascunho restaurado.';undo.hidden=true;cleared=null;}});
  document.getElementById('copy-email').addEventListener('click',async()=>{document.getElementById('copy-email-status').textContent=await UI.copy(data.emailDirect)?'E-mail copiado.':'Não foi possível copiar. Selecione o endereço acima.';});
  refreshContact();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || form.querySelector('[name="_honeypot"]').value.trim()) return;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) { fields.find(field => field.getAttribute('aria-invalid') === 'true').focus(); return; }
    if (!configured) {
      const subjectSelect = document.getElementById('project-type');
      const subject = sourceProject && ['','other'].includes(subjectSelect.value) ? 'Sobre o projeto '+sourceProject.title : subjectSelect.value ? subjectSelect.selectedOptions[0].text : 'Contato pelo portfólio';
      const budget = document.getElementById('budget');
      const body = 'Nome: ' + fields[0].value.trim() + '\nE-mail: ' + fields[1].value.trim() +
        (!budget.disabled && budget.value ? '\nOrçamento: ' + budget.selectedOptions[0].text : '') +
        (sourceProject ? '\nProjeto: '+sourceProject.title+'\nLink: '+sourceProjectURL : '') + '\n\n' + fields[2].value.trim();
      draft.href = 'mailto:' + data.emailDirect + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      draft.hidden = false;
      status.textContent = 'Rascunho preparado. Abra seu aplicativo de e-mail para revisar e enviar. Nenhuma mensagem foi enviada pelo site.';
      draft.focus();
      return;
    }
    button.disabled = true;
    label.textContent = 'Enviando…';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const payload=new FormData(form);
      if(sourceProject){payload.set('project',sourceProject.title);payload.set('project_url',sourceProjectURL);}
      const response = await fetch('https://formspree.io/f/' + encodeURIComponent(data.formspreeId), {
        method: 'POST', headers: {Accept: 'application/json'}, body: payload, signal: controller.signal
      });
      if (!response.ok) throw new Error('send-failed');
      status.textContent = 'Mensagem enviada. Obrigado pelo contato!';
      form.reset();
      PortfolioUI.storage.remove('contact-draft');
      refreshContact();
    } catch (error) {
      status.textContent = 'Não foi possível enviar. Tente novamente ou use o e-mail direto. Seus campos foram preservados.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      label.textContent = idleLabel;
    }
  });
})();
