/* ============================================================
   CONTACT.JS — Lógica da página de contato
   Usa Utils compartilhados + validação/envio do formulário.
============================================================ */
(function () {
  'use strict';

  Utils.initPage();

  /* ── FORM VALIDATION & SUBMIT ──────────────────────────── */
  const form        = document.getElementById('contact-form');
  const submitBtn   = document.getElementById('submit-btn');
  const submitLabel = document.getElementById('submit-label');
  const formSuccess = document.getElementById('form-success');

  if (!form) return;

  function validateField(input) {
    const id    = input.id;
    const error = document.getElementById(id + '-error');
    let valid   = true;

    if (input.required && !input.value.trim()) {
      valid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else if (id === 'message' && input.value.trim().length < 20) {
      valid = false;
    }

    input.classList.toggle('error', !valid);
    if (error) error.classList.toggle('visible', !valid);
    return valid;
  }

  /* Validação em tempo real */
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(el); });
  });

  var submitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;

    /* Honeypot */
    const honeypot = form.querySelector('[name="_honeypot"]');
    if (honeypot && honeypot.value.trim()) { showSuccess(); return; }

    /* Valida campos obrigatórios */
    const nameOk  = validateField(document.getElementById('name'));
    const emailOk = validateField(document.getElementById('email'));
    const msgOk   = validateField(document.getElementById('message'));
    if (!nameOk || !emailOk || !msgOk) return;

    /* Loading */
    submitting = true;
    submitBtn.disabled = true;
    submitLabel.textContent = 'ENVIANDO...';

    try {
      const formspreeId = (window.PORTFOLIO_DATA && PORTFOLIO_DATA.contact && PORTFOLIO_DATA.contact.formspreeId)
        || 'SEU_ID_AQUI';
      if (formspreeId === 'SEU_ID_AQUI') {
        await simulateSend();
      } else {
        const response = await fetch('https://formspree.io/f/' + formspreeId, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });
        if (!response.ok) throw new Error('Send failed');
      }
      showSuccess();
    } catch (err) {
      submitting = false;
      submitBtn.disabled = false;
      submitLabel.textContent = 'ENVIAR MENSAGEM';
      console.error('Erro no envio:', err);
    }
  });

  function simulateSend() {
    return new Promise(resolve => setTimeout(resolve, 1800));
  }

  function showSuccess() {
    form.style.transition = 'opacity .4s';
    form.style.opacity = '0';
    setTimeout(() => {
      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  }

})();
