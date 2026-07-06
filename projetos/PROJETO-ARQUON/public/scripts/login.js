// scripts/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Se já está logado, joga para a tela correta baseada na Role salva
    if (localStorage.getItem('arqon_token')) {
        const role = localStorage.getItem('arqon_role');
        if (role === 'TOTAL_CONTROL' || role === 'VAULT_MGMT') {
            window.location.href = 'admin.html'; // 👑 Admin vai pro painel dele
        } else {
            window.location.href = 'profile.html'; // Cliente normal vai pro cofre dele
        }
        return;
    }

    const form = document.getElementById('arqon-auth-form');
    let mode = "login"; // Inicia na tela de login por padrão

    // =========================
    // TEMPLATES SPA (Mantendo seu visual original)
    // =========================
    
    const registerTemplate = `
      <div class="arqon-form-header">
        <h2>JOIN THE ELITE</h2>
      </div>
  
      <div class="arqon-input-group">
        <input type="text" id="arqon-name" name="name" required placeholder=" ">
        <label for="arqon-name">NOME COMPLETO</label>
        <span class="arqon-error-msg" id="error-name"></span>
      </div>
  
      <div class="arqon-input-group">
        <input type="email" id="arqon-email" name="email" required placeholder=" ">
        <label for="arqon-email">E-MAIL</label>
        <span class="arqon-error-msg" id="error-email"></span>
      </div>
  
      <div class="arqon-input-group">
        <input type="password" id="arqon-password" name="password" required placeholder=" ">
        <label for="arqon-password">SENHA</label>
        <span class="arqon-error-msg" id="error-password"></span>
      </div>
  
      <div class="arqon-input-group">
        <input type="password" id="arqon-password-confirm" name="password-confirm" required placeholder=" ">
        <label for="arqon-password-confirm">CONFIRMAR SENHA</label>
        <span class="arqon-error-msg" id="error-password-confirm"></span>
      </div>
  
      <button type="submit" class="arqon-btn-submit">
        <span class="btn-text">SOLICITAR ACESSO</span>
      </button>
  
      <div class="arqon-form-footer">
        Já possui a chave do cofre? <a href="#" id="toggle-mode" class="arqon-link">Acessar</a>
      </div>
    `;
  
    const loginTemplate = `
      <div class="arqon-form-header">
        <h2>ENTER THE VAULT</h2>
      </div>
  
      <div class="arqon-input-group">
        <input type="email" id="arqon-email" name="email" required placeholder=" ">
        <label for="arqon-email">E-MAIL</label>
        <span class="arqon-error-msg" id="error-email"></span>
      </div>
  
      <div class="arqon-input-group">
        <input type="password" id="arqon-password" name="password" required placeholder=" ">
        <label for="arqon-password">SENHA</label>
        <span class="arqon-error-msg" id="error-password"></span>
      </div>
  
      <div class="arqon-form-options">
        <label class="arqon-checkbox">
          <input type="checkbox" name="remember">
          <span class="checkmark"></span>
          Lembrar acesso
        </label>
        <a href="#" class="arqon-link-muted">Esqueceu a senha?</a>
      </div>
  
      <button type="submit" class="arqon-btn-submit">
        <span class="btn-text">DESTRAVAR COFRE</span>
      </button>
  
      <div class="arqon-form-footer">
        Ainda não é membro? <a href="#" id="toggle-mode" class="arqon-link">Aplicar agora</a>
      </div>
    `;
  
    // =========================
    // LÓGICA DE RENDERIZAÇÃO
    // =========================
    function renderForm() {
      // Injeta o template correto no HTML
      form.innerHTML = mode === "login" ? loginTemplate : registerTemplate;
      form.classList.remove('fade-in');
      void form.offsetWidth; // Trigger reflow
      form.classList.add('fade-in');
  
      // Re-aplica o evento de alternar tela
      document.getElementById('toggle-mode').addEventListener('click', (e) => {
        e.preventDefault();
        mode = mode === "login" ? "register" : "login";
        renderForm();
      });
    }
  
    // Renderiza a primeira vez
    renderForm();
  
    // =========================
    // INTEGRAÇÃO BACKEND V8 (SUBMIT)
    // =========================
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Limpa erros antigos
      document.querySelectorAll('.arqon-error-msg').forEach(el => el.textContent = '');
  
      if (mode === "login") {
        await processarLogin();
      } else {
        // Lógica de cadastro (Implementar depois quando o endpoint de criar conta existir)
        alert("Cadastro na V8 em desenvolvimento!");
      }
    });

    async function processarLogin() {
        // 1. Captura os elementos do formulário baseando-se no ID ou Name (padrão arqon)
        const emailInput = document.getElementById('arqon-email') || form.querySelector('input[type="email"]');
        const passwordInput = document.getElementById('arqon-password') || form.querySelector('input[type="password"]');
        const submitBtn = form.querySelector('.arqon-btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        
        if (!emailInput || !passwordInput) {
            console.error("[V8 AUTH ERROR]: Inputs de email ou senha não foram localizados na página.");
            return;
        }

        const email = emailInput.value.trim();
        const senha = passwordInput.value.trim();

        if (!email || !senha) {
            showError(passwordInput, "Por favor, preencha todos os campos.");
            return;
        }

        // 2. Monta o payload exatamente como o AuthController.php espera ler:
        const formData = {
            email: email,
            password: senha
        };

        // Feedback Visual (Loading)
        const originalBtnText = btnText.textContent;
        submitBtn.classList.add('loading');
        btnText.textContent = "AUTENTICANDO...";
        submitBtn.style.pointerEvents = 'none';

        try {
            // 3. Dispara a requisição para a raiz de forma relativa segura
            const response = await fetch('../index.php/api/login', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(formData) // Transforma o objeto em string JSON estruturada
            });

            const data = await response.json();

            // Se o backend retornar status de erro (como o 400 ou 401)
            if (!response.ok || data.status === 'error') {
                throw new Error(data.details || data.message || "Credenciais inválidas.");
            }

            if (data.status === 'success' && data.token) {
                // 🔐 SUCESSO! Salva os dados no padrão do sistema
                localStorage.setItem('arqon_token', data.token);
                localStorage.setItem('arqon_role', data.role); // 👑 Guarda a role vital aqui!
                
                if (data.user) {
                    localStorage.setItem('arqon_user_nome', data.user.nome);
                    localStorage.setItem('arqon_user_foto', data.user.foto_url);
                }

                // Inicia carrinho se não existir
                if (!localStorage.getItem('arqon_carrinho')) {
                    localStorage.setItem('arqon_carrinho', JSON.stringify([]));
                }

                // Animação de Sucesso no Botão
                submitBtn.classList.remove('loading');
                btnText.textContent = 'ACESSO LIBERADO';
                submitBtn.style.background = 'var(--arqon-gold)';
                submitBtn.style.color = 'var(--arqon-bg-dark)';
                submitBtn.style.border = 'none';

                // 🚀 REDIRECIONAMENTO DINÂMICO BASEADO NO BACKEND
                setTimeout(() => {
                    if (data.redirect) {
                        window.location.assign(data.redirect); // Vai para admin.html ou profile.html enviado pelo PHP
                    } else {
                        window.location.assign('profile.html'); // Fallback de segurança
                    }
                }, 1200);

            } else {
                // Captura retornos sem status de sucesso
                throw new Error("Resposta inesperada do servidor mestre.");
            }

        } catch (error) {
            // Se falhar, reverte o estado do botão e exibe o erro na tela
            console.error("[V8 AUTH ERROR]:", error);
            showError(passwordInput, error.message);
            
            submitBtn.classList.remove('loading');
            btnText.textContent = originalBtnText;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.background = 'transparent';
        }
    }
  
    function showError(inputElement, message) {
      const errorSpan = inputElement.parentElement.querySelector('.arqon-error-msg');
      if (errorSpan) {
        errorSpan.textContent = message;
      }
      inputElement.style.borderColor = 'var(--arqon-error)';
      
      // Reseta a borda depois de digitar de novo
      inputElement.addEventListener('input', function() {
        this.style.borderColor = 'var(--arqon-border)';
        if(errorSpan) errorSpan.textContent = '';
      }, { once: true });
    }
});