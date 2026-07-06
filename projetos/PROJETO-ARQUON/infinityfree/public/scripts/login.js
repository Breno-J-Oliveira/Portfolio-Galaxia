// scripts/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Se já está logado, joga para a tela correta baseada na Role salva
    if (localStorage.getItem('arqon_token')) {
        const role = localStorage.getItem('arqon_role');
        if (role === 'TOTAL_CONTROL' || role === 'VAULT_MGMT' || role === 'ADMIN') {
            window.location.href = 'admin.html'; 
        } else if (role === 'VENDOR') {
            window.location.href = 'fornecedor.html';
        } else {
            window.location.href = 'profile.html';
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

      <div class="arqon-input-group" style="margin-bottom: 25px;">
        <label style="position: static; font-size: 11px; color: var(--arqon-gold); letter-spacing: 2px; display: block; margin-bottom: 8px;">FOTO DE PERFIL (OPCIONAL)</label>
        <div id="avatar-preview-wrap" style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">
            <div id="avatar-preview" style="width:64px;height:64px;border-radius:50%;overflow:hidden;border:2px solid var(--arqon-gold);background:#0a0612;display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-user" style="color:#A0A0A0;font-size:1.5rem;"></i>
            </div>
            <button type="button" class="btn-outline" onclick="document.getElementById('arqon-avatar-hidden').click()" style="padding:8px 16px;font-size:.75rem;"><i class="fas fa-camera"></i> Selecionar Foto</button>
        </div>
        <input type="file" id="arqon-avatar-hidden" accept="image/png, image/jpeg, image/webp" style="display:none;">
        <input type="hidden" id="arqon-avatar-cropped" name="profile_picture">
        <span class="arqon-error-msg" id="error-avatar"></span>
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
    window.cropperLogin = null;
    let croppedBlob = null;

    function renderForm() {
      form.innerHTML = mode === "login" ? loginTemplate : registerTemplate;
      form.classList.remove('fade-in');
      void form.offsetWidth; // Trigger reflow
      form.classList.add('fade-in');

      if (mode === 'register') {
        ativarCropperLogin();
      }
  
      document.getElementById('toggle-mode').addEventListener('click', (e) => {
        e.preventDefault();
        mode = mode === "login" ? "register" : "login";
        renderForm();
      });
    }

    function ativarCropperLogin() {
        const input = document.getElementById('arqon-avatar-hidden');
        if (!input) return;
        input.addEventListener('change', (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = document.getElementById('cropper-image-login');
                document.getElementById('modal-cropper-login').style.display = 'flex';
                if (window.cropperLogin) { window.cropperLogin.destroy(); window.cropperLogin = null; }
                img.src = ev.target.result;
                img.onload = () => {
                    requestAnimationFrame(() => {
                        window.cropperLogin = new Cropper(img, { aspectRatio: 1, viewMode: 1, dragMode: 'move', autoCropArea: 0.9, guides: true, center: true, cropBoxMovable: true, cropBoxResizable: true });
                    });
                };
            };
            reader.readAsDataURL(f);
        });
    }

    window.fecharCropperLogin = function() {
        document.getElementById('modal-cropper-login').style.display = 'none';
        if (window.cropperLogin) { window.cropperLogin.destroy(); window.cropperLogin = null; }
    };

    window.aplicarCropperLogin = function() {
        if (!window.cropperLogin) return;
        const canvas = window.cropperLogin.getCroppedCanvas({ width: 256, height: 256 });
        canvas.toBlob((blob) => {
            croppedBlob = blob;
            const preview = document.getElementById('avatar-preview');
            if (preview) preview.innerHTML = `<img src="${canvas.toDataURL()}" style="width:100%;height:100%;object-fit:cover;">`;
            fecharCropperLogin();
        }, 'image/jpeg', 0.9);
    };
  
    renderForm();
  
    // =========================
    // INTEGRAÇÃO BACKEND V8 (SUBMIT)
    // =========================
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Limpa erros antigos de todos os campos
      document.querySelectorAll('.arqon-error-msg').forEach(el => el.textContent = '');
  
      if (mode === "login") {
        await processarLogin();
      } else {
        // 🚀 AGORA INTEGRADO: Chama a execução do fluxo de cadastro
        await processarCadastro();
      }
    });

    // ===================================
    // METODO: AUTENTICAÇÃO / LOGIN
    // ===================================
    async function processarLogin() {
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

        const formData = {
            email: email,
            password: senha
        };

        const originalBtnText = btnText.textContent;
        submitBtn.classList.add('loading');
        btnText.textContent = "AUTENTICANDO...";
        submitBtn.style.pointerEvents = 'none';

        try {
            const apiBase = window.ARQON_API_BASE || '/api';
            const response = await fetch(`${apiBase}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.details || data.message || "Credenciais inválidas.");
            }

            if (data.status === 'success' && data.token) {
                localStorage.setItem('arqon_token', data.token);
                localStorage.setItem('arqon_role', data.role);
                
                if (data.user) {
                    localStorage.setItem('arqon_user_nome', data.user.nome);
                    localStorage.setItem('arqon_user_foto', data.user.foto_url);
                }

                if (!localStorage.getItem('arqon_carrinho')) {
                    localStorage.setItem('arqon_carrinho', JSON.stringify([]));
                }

                submitBtn.classList.remove('loading');
                btnText.textContent = 'ACESSO LIBERADO';
                submitBtn.style.background = 'var(--arqon-gold)';
                submitBtn.style.color = 'var(--arqon-bg-dark)';
                submitBtn.style.border = 'none';

                setTimeout(() => {
                    const destino = data.redirect || resolverDestinoPorRole(data.role);
                    window.location.assign(destino);
                }, 1200);

            } else {
                throw new Error("Resposta inesperada do servidor mestre.");
            }

        } catch (error) {
            console.error("[V8 AUTH ERROR]:", error);
            showError(passwordInput, error.message);
            
            submitBtn.classList.remove('loading');
            btnText.textContent = originalBtnText;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.background = 'transparent';
        }
    }
  
    // ===================================
    // 👑 NOVO MÉTODO: SOLICITAÇÃO DE CADASTRO
    // ===================================
    async function processarCadastro() {
        const nameInput = document.getElementById('arqon-name');
        const emailInput = document.getElementById('arqon-email');
        const passwordInput = document.getElementById('arqon-password');
        const confirmInput = document.getElementById('arqon-password-confirm');
        const submitBtn = form.querySelector('.arqon-btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');

        if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
            console.error("[V8 REGISTRATION ERROR]: Elementos estruturais do formulário ausentes.");
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const senha = passwordInput.value.trim();
        const confirmacao = confirmInput.value.trim();

        // Validações locais em tempo de execução
        if (!name || !email || !senha || !confirmacao) {
            showError(passwordInput, "Por favor, preencha todos os campos do artefato.");
            return;
        }

        if (name.split(' ').length < 2) {
            showError(nameInput, "Insira seu nome completo (Nome e Sobrenome).");
            return;
        }

        if (senha.length < 8) {
            showError(passwordInput, "A senha deve conter no mínimo 8 caracteres.");
            return;
        }

        if (senha !== confirmacao) {
            showError(confirmInput, "As senhas informadas não coincidem.");
            return;
        }

        // 📦 Empacotamento multipart via FormData (Essencial para transmissão de mídias/arquivos)
        const payload = new FormData();
        payload.append('name', name);
        payload.append('email', email);
        payload.append('password', senha);

        if (croppedBlob) {
            payload.append('profile_picture', croppedBlob, 'avatar.jpg');
        }

        // Feedback Visual de Processamento Premium
        const originalBtnText = btnText.textContent;
        submitBtn.classList.add('loading');
        btnText.textContent = "ENVIANDO CREDENCIAIS...";
        submitBtn.style.pointerEvents = 'none';

        try {
            // Requisição disparada diretamente ao interceptor mapeado
            const apiBase = window.ARQON_API_BASE || '/api';
            const response = await fetch(`${apiBase}/register`, { 
              method: 'POST',
              // Ao enviar FormData, não defina o Content-Type. O browser cuida do boundary.
              body: payload
            });

            const data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(data.details || data.message || "Erro interno ao processar cadastro.");
            }

            if (data.status === 'success') {
                submitBtn.classList.remove('loading');
                btnText.textContent = 'ACESSO CONCEDIDO';
                submitBtn.style.background = 'var(--arqon-gold)';
                submitBtn.style.color = 'var(--arqon-bg-dark)';
                submitBtn.style.border = 'none';

                // Altera dinamicamente o estado da SPA de volta para o login para acesso seguro
                setTimeout(() => {
                    mode = "login";
                    renderForm();
                    
                    // Injeta de forma cômoda o e-mail recém cadastrado no input
                    const newEmailInput = document.getElementById('arqon-email');
                    if (newEmailInput) newEmailInput.value = email;
                }, 1600);
            }

        } catch (error) {
            console.error("[V8 REGISTRATION ERROR]:", error);
            
            // Tratamento inteligente: exibe erro no input correspondente
            if (error.message.toLowerCase().includes('e-mail') || error.message.toLowerCase().includes('email')) {
                showError(emailInput, error.message);
            } else if (error.message.toLowerCase().includes('imagem') || error.message.toLowerCase().includes('formato') || error.message.toLowerCase().includes('avatar')) {
                showError(document.getElementById('arqon-avatar-hidden') || passwordInput, error.message);
            } else {
                showError(passwordInput, error.message);
            }
            
            // Reverte o estado visual do botão primordial
            submitBtn.classList.remove('loading');
            btnText.textContent = originalBtnText;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.background = 'transparent';
        }
    }

    // ===================================
    // HELPER FUNCTIONS
    // ===================================
    function isAdminRole(role) {
        return role === 'TOTAL_CONTROL' || role === 'VAULT_MGMT' || role === 'ADMIN';
    }

    function resolverDestinoPorRole(role) {
        if (role === 'TOTAL_CONTROL' || role === 'VAULT_MGMT' || role === 'ADMIN') {
            return 'admin.html';
        }
        if (role === 'VENDOR') {
            return 'fornecedor.html';
        }
        return 'profile.html';
    }

    function showError(inputElement, message) {
      const errorSpan = inputElement.parentElement.querySelector('.arqon-error-msg');
      if (errorSpan) {
        errorSpan.textContent = message;
      }
      inputElement.style.borderColor = 'var(--arqon-error)';
      
      inputElement.addEventListener('input', function() {
        this.style.borderColor = 'var(--arqon-border)';
        if(errorSpan) errorSpan.textContent = '';
      }, { once: true });
    }
});