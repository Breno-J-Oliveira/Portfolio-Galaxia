/**
 * ============================================================================
 * ARQON | PAINEL DE CONTROLO DE CUSTÓDIA MESTRE (profile-enhanced.js)
 * Conectado às novas APIs REST
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Verifica Acesso Seguro e Configura Tokens
    const token = localStorage.getItem('arqon_token');
    if (!token) {
        window.location.replace('login.html');
        return;
    }

    const headersAutenticados = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Variáveis Globais de Estado
    let globalLocacoes = [];
    let isPrivacyMode = false;
    window.cropperInstance = null;
    let cropperTargetInput = null;

    // 2. Inicializa o Painel
    inicializarCofre();

    async function inicializarCofre() {
        logTerminal('Iniciando handshake seguro com a base central...', 'warning');
        ativarNavegacaoSPA();
        ativarInteracoesExtras();
        ativarCropperAvatar();

        await carregarDadosCadastrais();
        await carregarMetricasDashboard();
        await carregarLocacoes();
        await carregarWishlist();
        await carregarEnderecos();
    }

    // ========================================================================
    // CROPPER AVATAR
    // ========================================================================

    function ativarCropperAvatar() {
        const avatarInput = document.getElementById('arqon-avatar-input');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const f = e.target.files[0];
                if (f) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        abrirModalCropper(event.target.result, e.target);
                    };
                    reader.readAsDataURL(f);
                }
            });
        }
    }

    function abrirModalCropper(imageSrc, targetInput) {
        const modal = document.getElementById('modal-cropper');
        const img = document.getElementById('cropper-image');

        img.src = imageSrc;
        cropperTargetInput = targetInput;

        modal.style.display = 'flex';

        img.onload = function() {
            if (cropperInstance) {
                cropperInstance.destroy();
            }

            cropperInstance = new Cropper(img, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
        };
    }

    function fecharModalCropper() {
        const modal = document.getElementById('modal-cropper');
        modal.style.display = 'none';

        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }

        cropperTargetInput = null;
    }

    function aplicarRecorte() {
        console.log('[ARQON AVATAR] aplicarRecorte chamado. cropperInstance=', !!cropperInstance, 'cropperTargetInput=', !!cropperTargetInput);
        if (!cropperInstance || !cropperTargetInput) {
            logTerminal('Erro ao aplicar recorte: cropper não inicializado', 'error');
            console.error('[ARQON AVATAR] cropperInstance ou cropperTargetInput ausente');
            return;
        }

        const canvas = cropperInstance.getCroppedCanvas({
            maxWidth: 512,
            maxHeight: 512,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });
        console.log('[ARQON AVATAR] Canvas gerado:', !!canvas);

        if (canvas) {
            canvas.toBlob((blob) => {
                console.log('[ARQON AVATAR] Blob gerado:', !!blob, 'size:', blob?.size);
                if (!blob) {
                    logTerminal('Erro ao gerar blob da imagem', 'error');
                    return;
                }
                const file = new File([blob], 'avatar-cropped.jpg', { type: 'image/jpeg' });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                cropperTargetInput.files = dataTransfer.files;

                // Update avatar display
                const avatarContainer = document.getElementById('agent-display-avatar');
                if (avatarContainer) {
                    avatarContainer.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                }

                // Upload the cropped avatar
                console.log('[ARQON AVATAR] Chamando uploadAvatar...');
                uploadAvatar(file);

                logTerminal('Avatar recortado com sucesso', 'success');
                fecharModalCropper();
            }, 'image/jpeg', 0.9);
        } else {
            logTerminal('Erro ao gerar imagem recortada', 'error');
        }
    }

    async function uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            console.log('[ARQON AVATAR] Iniciando upload...');
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/me/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('arqon_token')}`
                },
                body: formData
            });

            const result = await response.json();
            console.log('[ARQON AVATAR] Resposta:', result);
            if (result.status === 'success') {
                const novaFoto = result.foto_url;
                console.log('[ARQON AVATAR] novaFoto:', novaFoto);
                if (novaFoto) {
                    localStorage.setItem('arqon_user_foto', novaFoto);
                    // Atualiza header em todas as páginas abertas
                    if (typeof atualizarInterfaceUsuario === 'function') {
                        atualizarInterfaceUsuario();
                    }
                    // Atualiza avatar na sidebar do profile
                    const sidebarAvatar = document.getElementById('agent-display-avatar');
                    if (sidebarAvatar) {
                        sidebarAvatar.innerHTML = `<img src="${novaFoto}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                    }
                }
                logTerminal('Avatar atualizado com sucesso', 'success');
                toast('Avatar atualizado com sucesso!', 'success');
            } else {
                logTerminal(`Erro ao atualizar avatar: ${result.message}`, 'error');
                toast(result.message || 'Erro ao atualizar avatar', 'error');
            }
        } catch (error) {
            console.error('[ARQON] Erro ao fazer upload de avatar:', error);
            logTerminal('Erro ao fazer upload de avatar', 'error');
            toast('Erro ao fazer upload de avatar', 'error');
        }
    }

    // Expor funções globalmente
    window.abrirModalCropper = abrirModalCropper;
    window.fecharModalCropper = fecharModalCropper;
    window.aplicarRecorte = aplicarRecorte;

    // ========================================================================
    // CHAMADAS À API (BACKEND)
    // ========================================================================

    async function carregarDadosCadastrais() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/me`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                const user = result.data;
                
                // Preenche o Cabeçalho do Sidebar
                const elNome = document.getElementById('agent-display-name');
                const elEmail = document.getElementById('agent-display-email');
                const elAvatarContainer = document.getElementById('agent-display-avatar');
                
                if (elNome) {
                    elNome.textContent = user.nome.toUpperCase();
                    elNome.setAttribute('data-text', user.nome.toUpperCase());
                }
                if (elEmail) elEmail.textContent = user.email;
                
                // Avatar
                if (elAvatarContainer) {
                    if (user.foto_url && user.foto_url !== 'null' && user.foto_url !== 'undefined') {
                        const avatarSrc = window.arqonImageUrl ? window.arqonImageUrl(user.foto_url) : user.foto_url;
                        const fallbackSvg = `<div class="arqon-header-avatar-fallback"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block; color: currentColor;"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/><path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/></svg></div>`;
                        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome || 'A')}&background=E7B93F&color=000&size=256`;
                        elAvatarContainer.innerHTML = `<img src="${avatarSrc}" alt="${user.nome}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.onerror=null;this.src='${fallbackUrl}';if(!this.src.includes('ui-avatars'))this.parentElement.innerHTML='${fallbackSvg.replace(/"/g, '&quot;')}';">`;
                    } else {
                        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome || 'A')}&background=E7B93F&color=000&size=256`;
                        elAvatarContainer.innerHTML = `<img src="${fallbackUrl}" alt="${user.nome}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                    }
                }

                // Preenche os Inputs da aba "Dados de Acesso"
                const regNome = document.getElementById('reg-nome');
                const regEmail = document.getElementById('reg-email');
                if (regNome) regNome.value = user.nome;
                if (regEmail) regEmail.value = user.email;

                logTerminal(`Identidade reconhecida: Agente ${user.id}.`, 'success');
            } else {
                logTerminal(`Erro de Identidade: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error("[ARQON] Erro de rede no Perfil:", error);
            logTerminal('Falha crítica ao conectar com matriz de identidade.', 'error');
        }
    }
    
    async function carregarMetricasDashboard() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/user/metricas`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                const metrics = result.data;
                
                document.getElementById('dash-custodias-ativas').textContent = metrics.locacoes_ativas;
                document.getElementById('dash-caucao-retida').textContent = formatarMoeda(metrics.valor_gasto * 0.5); // Estimativa de caução
                document.getElementById('dash-total-gasto').textContent = formatarMoeda(metrics.valor_gasto);
                
                logTerminal('Métricas do cofre atualizadas.', 'success');
            }
        } catch (error) {
            console.error("[ARQON] Erro ao carregar métricas:", error);
        }
    }

    async function carregarLocacoes() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/locacoes`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                globalLocacoes = result.data;
                renderizarLocacoes(globalLocacoes);
                atualizarBadgesLocacoes(globalLocacoes);
                logTerminal(`${globalLocacoes.length} protocolos de locação carregados.`, 'success');
            }
        } catch (error) {
            console.error("[ARQON] Erro ao carregar locações:", error);
        }
    }

    async function carregarWishlist() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                renderizarWishlist(result.data);
                logTerminal(`${result.data.length} artefatos na wishlist.`, 'success');
            }
        } catch (error) {
            console.error("[ARQON] Erro ao carregar wishlist:", error);
        }
    }

    async function carregarEnderecos() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                renderizarEnderecos(result.data);
                logTerminal(`${result.data.length} vetores logísticos carregados.`, 'success');
            }
        } catch (error) {
            console.error("[ARQON] Erro ao carregar endereços:", error);
        }
    }

    // ========================================================================
    // RENDERIZAÇÃO
    // ========================================================================

    function renderizarLocacoes(locacoes) {
        const container = document.getElementById('orders-display-list');
        if (!container) return;

        if (locacoes.length === 0) {
            container.innerHTML = '<p style="color: var(--color-tertiary); text-align: center; padding: 40px;">Nenhuma locação encontrada.</p>';
            return;
        }

        container.innerHTML = locacoes.map(l => {
            // Tratamento robusto de imagem com fallback
            let imagemUrl = 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
            if (l.foto_url) {
                if (typeof window.arqonImageUrl === 'function') {
                    imagemUrl = window.arqonImageUrl(l.foto_url);
                } else if (l.foto_url.startsWith('http') || l.foto_url.startsWith('/')) {
                    imagemUrl = l.foto_url;
                } else {
                    imagemUrl = '/public/uploads/' + l.foto_url;
                }
            }
            
            return `
            <div class="order-premium-card" data-status="${l.status_pedido}">
                <div class="order-card-header">
                    <strong>#${l.id}</strong>
                    <span class="status-pill pill-${l.status_pedido}">${l.status_pedido.toUpperCase()}</span>
                </div>
                <div class="order-card-body">
                    <img class="order-item-img" src="${imagemUrl}" alt="${l.produto_nome}" onerror="this.src='https://placehold.co/400x500/0a0107/dcb23c?text=ARQON'">
                    <div class="order-item-detail">
                        <h4 class="order-item-title">${l.produto_nome}</h4>
                        <span class="order-item-meta">${new Date(l.data_inicio).toLocaleDateString('pt-BR')} → ${new Date(l.data_fim).toLocaleDateString('pt-BR')}</span>
                        <span class="status-pill pill-${l.status_pedido}">${l.status_pedido.toUpperCase()}</span>
                    </div>
                    <div class="order-item-pricing">
                        <span class="order-item-price">${formatarMoeda(l.valor_aluguel)}</span>
                        <button class="btn-order-action" onclick="irParaLocacao(${l.id})">VER DETALHES</button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    function atualizarBadgesLocacoes(locacoes) {
        const badgePendente = document.getElementById('badge-count-pendente');
        const badgePago = document.getElementById('badge-count-pago');
        const badgeEnviado = document.getElementById('badge-count-enviado');
        const badgeConcluido = document.getElementById('badge-count-concluido');

        if (badgePendente) badgePendente.textContent = locacoes.filter(l => l.status_pedido === 'pendente').length;
        if (badgePago) badgePago.textContent = locacoes.filter(l => l.status_pedido === 'pago').length;
        if (badgeEnviado) badgeEnviado.textContent = locacoes.filter(l => ['enviado', 'entregue'].includes(l.status_pedido)).length;
        if (badgeConcluido) badgeConcluido.textContent = locacoes.filter(l => ['devolvido', 'concluido'].includes(l.status_pedido)).length;
    }

    function renderizarWishlist(wishlist) {
        const container = document.getElementById('favorites-display-grid');
        if (!container) return;

        if (wishlist.length === 0) {
            container.innerHTML = '<p style="color: var(--color-tertiary); text-align: center; padding: 40px;">Sua wishlist está vazia.</p>';
            return;
        }

        container.innerHTML = wishlist.map(item => {
            // Tratamento robusto de imagem com fallback
            let imagemUrl = 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
            if (item.foto_url) {
                if (typeof window.arqonImageUrl === 'function') {
                    imagemUrl = window.arqonImageUrl(item.foto_url);
                } else if (item.foto_url.startsWith('http') || item.foto_url.startsWith('/')) {
                    imagemUrl = item.foto_url;
                } else {
                    imagemUrl = '/public/uploads/' + item.foto_url;
                }
            }
            
            return `
            <div class="fav-item-card">
                <img src="${imagemUrl}" alt="${item.nome}" onerror="this.src='https://placehold.co/400x500/0a0107/dcb23c?text=ARQON'">
                <div class="fav-info">
                    <h4 class="fav-title">${item.nome}</h4>
                    <p>${item.marca || 'ARQON'}</p>
                    <p class="fav-price">${formatarMoeda(item.valor_diaria)} /diária</p>
                </div>
                <div class="fav-actions">
                    <button class="btn-fav-view" onclick="irParaProduto(${item.id})">VER</button>
                    <button class="btn-fav-view" onclick="removerWishlist(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        }).join('');
    }

    function renderizarEnderecos(enderecos) {
        const container = document.getElementById('address-display-grid');
        if (!container) return;

        if (enderecos.length === 0) {
            container.innerHTML = '<p style="color: var(--color-tertiary); text-align: center; padding: 40px;">Nenhum endereço cadastrado.</p>';
            return;
        }

        const tipoLabel = { casa: 'CASA', trabalho: 'TRABALHO', outro: 'OUTRO' };
        const tipoIcon = { casa: 'fa-home', trabalho: 'fa-briefcase', outro: 'fa-map-marker-alt' };

        container.innerHTML = enderecos.map(e => `
            <div class="address-card ${(e.padrao || e.padrao_entrega) ? 'default' : ''}">
                <div class="address-header">
                    <h4><i class="fas ${tipoIcon[e.tipo] || 'fa-map-marker-alt'}"></i>${tipoLabel[e.tipo] || 'ENDEREÇO'}</h4>
                    ${(e.padrao || e.padrao_entrega) ? '<span class="badge-default">PADRÃO</span>' : ''}
                </div>
                <div class="address-body">
                    <p class="addr-street">${e.logradouro}, ${e.numero}${e.complemento ? ' — ' + e.complemento : ''}</p>
                    <p>${e.bairro}</p>
                    <p>${e.cidade} — ${e.estado} &nbsp;|&nbsp; CEP ${e.cep}</p>
                </div>
                <div class="address-actions">
                    <button class="btn-address-action" onclick="editarEndereco(${e.id})"><i class="fas fa-pen"></i> EDITAR</button>
                    <button class="btn-address-action btn-gold" onclick="definirEnderecoPadrao(${e.id})"><i class="fas fa-check"></i> PADRÃO</button>
                    <button class="btn-address-action btn-remove" onclick="removerEndereco(${e.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    // ========================================================================
    // AÇÕES
    // ========================================================================

    window.irParaLocacao = (id) => {
        // Implementar visualização de detalhes da locação
        alert(`Detalhes da locação #${id} - Em desenvolvimento`);
    };

    window.irParaProduto = (id) => {
        window.location.href = `produto.html?id=${id}`;
    };

    window.removerWishlist = async (idProduto) => {
        if (!confirm('Remover este artefato da wishlist?')) return;

        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist?id_produto=${idProduto}`, {
                method: 'DELETE',
                headers: headersAutenticados
            });
            
            if (response.ok) {
                await carregarWishlist();
                logTerminal('Artefato removido da wishlist.', 'success');
            }
        } catch (error) {
            console.error('[ARQON] Erro ao remover da wishlist:', error);
        }
    };

    window.definirEnderecoPadrao = async (id) => {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos/padrao`, {
                method: 'PUT',
                headers: headersAutenticados,
                body: JSON.stringify({ id })
            });
            
            if (response.ok) {
                await carregarEnderecos();
                logTerminal('Endereço definido como padrão.', 'success');
            }
        } catch (error) {
            console.error('[ARQON] Erro ao definir endereço padrão:', error);
        }
    };

    window.removerEndereco = async (id) => {
        if (!confirm('Remover este endereço?')) return;

        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos?id=${id}`, {
                method: 'DELETE',
                headers: headersAutenticados
            });
            
            if (response.ok) {
                await carregarEnderecos();
                logTerminal('Endereço removido.', 'success');
            }
        } catch (error) {
            console.error('[ARQON] Erro ao remover endereço:', error);
        }
    };

    // ========================================================================
    // FORMULÁRIOS
    // ========================================================================

    const formUpdateProfile = document.getElementById('form-update-profile');
    if (formUpdateProfile) {
        formUpdateProfile.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('reg-nome').value;
            
            try {
                const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/user/perfil`, {
                    method: 'PUT',
                    headers: headersAutenticados,
                    body: JSON.stringify({ nome })
                });
                
                const result = await response.json();
                if (result.status === 'success') {
                    alert('Perfil atualizado com sucesso!');
                    localStorage.setItem('arqon_user_nome', nome);
                    if (typeof atualizarInterfaceUsuario === 'function') {
                        atualizarInterfaceUsuario();
                    }
                    // Atualiza nome na sidebar do profile
                    const sidebarNome = document.getElementById('agent-display-name');
                    if (sidebarNome) sidebarNome.textContent = nome;
                    await carregarDadosCadastrais();
                    logTerminal('Dados cadastrais atualizados.', 'success');
                } else {
                    alert(result.message || 'Erro ao atualizar perfil.');
                }
            } catch (error) {
                console.error('[ARQON] Erro ao atualizar perfil:', error);
                alert('Erro ao atualizar perfil.');
            }
        });
    }

    const formChangePassword = document.getElementById('form-change-password');
    if (formChangePassword) {
        formChangePassword.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const senhaAtual = document.getElementById('pass-current').value;
            const novaSenha = document.getElementById('pass-new').value;
            const confirmarSenha = document.getElementById('pass-confirm').value;
            
            if (novaSenha !== confirmarSenha) {
                alert('Senhas não conferem.');
                return;
            }
            
            if (novaSenha.length < 8) {
                alert('Senha deve ter no mínimo 8 caracteres.');
                return;
            }
            
            try {
                const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/user/alterar-senha`, {
                    method: 'POST',
                    headers: headersAutenticados,
                    body: JSON.stringify({
                        senha_atual: senhaAtual,
                        nova_senha: novaSenha,
                        confirmar_senha: confirmarSenha
                    })
                });
                
                const result = await response.json();
                if (result.status === 'success') {
                    alert('Senha alterada com sucesso!');
                    formChangePassword.reset();
                    logTerminal('Chave de segurança atualizada.', 'success');
                } else {
                    alert(result.message || 'Erro ao alterar senha.');
                }
            } catch (error) {
                console.error('[ARQON] Erro ao alterar senha:', error);
                alert('Erro ao alterar senha.');
            }
        });
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if (!confirm('Encerrar sessão?')) return;
            
            try {
                await fetch(`${ARQON_CONFIG.apiBaseUrl}/logout`, {
                    method: 'POST',
                    headers: headersAutenticados
                });
            } catch (error) {
                console.error('[ARQON] Erro ao fazer logout:', error);
            }
            
            localStorage.removeItem('arqon_token');
            window.location.href = 'login.html';
        });
    }

    // ========================================================================
    // NAVEGAÇÃO SPA
    // ========================================================================

    function ativarNavegacaoSPA() {
        const tabs = document.querySelectorAll('.vault-tab-btn');
        const contents = document.querySelectorAll('.vault-tab-content');

        function ativarTab(targetTab) {
            const tabBtn = document.querySelector(`.vault-tab-btn[data-tab="${targetTab}"]`);
            if (tabBtn) {
                tabs.forEach(t => t.classList.remove('active'));
                tabBtn.classList.add('active');
                contents.forEach(content => {
                    content.classList.remove('active-tab');
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add('active-tab');
                    }
                });
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                ativarTab(tab.getAttribute('data-tab'));
            });
        });

        // Verifica parâmetro ?tab= na URL
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
            ativarTab(tabParam);
        }
    }

    function ativarInteracoesExtras() {
        // Filtro de locações por status
        const pipelineTabs = document.querySelectorAll('.pipeline-tab');
        pipelineTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                pipelineTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const status = tab.getAttribute('data-status');
                const locacoesFiltradas = status === 'all' 
                    ? globalLocacoes 
                    : status === 'enviado'
                        ? globalLocacoes.filter(l => ['enviado', 'entregue'].includes(l.status_pedido))
                        : status === 'concluido'
                            ? globalLocacoes.filter(l => ['devolvido', 'concluido'].includes(l.status_pedido))
                            : globalLocacoes.filter(l => l.status_pedido === status);
                
                renderizarLocacoes(locacoesFiltradas);
            });
        });

        // Modo privacidade
        const btnPrivacy = document.getElementById('btn-privacy-mode');
        if (btnPrivacy) {
            btnPrivacy.addEventListener('click', () => {
                isPrivacyMode = !isPrivacyMode;
                document.querySelectorAll('.privacy-blur').forEach(el => {
                    el.style.filter = isPrivacyMode ? 'blur(5px)' : 'none';
                });
                btnPrivacy.classList.toggle('active', isPrivacyMode);
            });
        }
    }

    // ========================================================================
    // MODAL ENDEREÇO
    // ========================================================================

    const btnNovoEndereco = document.querySelector('#tab-enderecos .btn-primary-glow');
    if (btnNovoEndereco) {
        btnNovoEndereco.addEventListener('click', () => abrirModalEndereco());
    }

    window.abrirModalEndereco = function(endereco = null) {
        const modal = document.getElementById('modal-endereco');
        if (!modal) return;
        document.getElementById('modal-endereco-titulo').textContent = endereco ? 'Editar Endereço' : 'Novo Endereço';
        document.getElementById('endereco-id').value = endereco ? endereco.id : '';
        document.getElementById('endereco-tipo').value = endereco ? (endereco.tipo || 'casa') : 'casa';
        document.getElementById('endereco-cep').value = endereco ? (endereco.cep || '') : '';
        document.getElementById('endereco-logradouro').value = endereco ? (endereco.logradouro || '') : '';
        document.getElementById('endereco-numero').value = endereco ? (endereco.numero || '') : '';
        document.getElementById('endereco-complemento').value = endereco ? (endereco.complemento || '') : '';
        document.getElementById('endereco-bairro').value = endereco ? (endereco.bairro || '') : '';
        document.getElementById('endereco-cidade').value = endereco ? (endereco.cidade || '') : '';
        document.getElementById('endereco-estado').value = endereco ? (endereco.estado || '') : '';
        document.getElementById('endereco-padrao').checked = endereco ? (endereco.padrao == 1) : false;
        modal.style.display = 'flex';
    };

    window.fecharModalEndereco = function() {
        const modal = document.getElementById('modal-endereco');
        if (modal) modal.style.display = 'none';
    };

    window.salvarEndereco = async function(e) {
        e.preventDefault();
        const id = document.getElementById('endereco-id').value;
        const payload = {
            tipo: document.getElementById('endereco-tipo').value,
            cep: document.getElementById('endereco-cep').value.replace(/\D/g, ''),
            logradouro: document.getElementById('endereco-logradouro').value,
            numero: document.getElementById('endereco-numero').value,
            complemento: document.getElementById('endereco-complemento').value,
            bairro: document.getElementById('endereco-bairro').value,
            cidade: document.getElementById('endereco-cidade').value,
            estado: document.getElementById('endereco-estado').value,
            padrao: document.getElementById('endereco-padrao').checked ? 1 : 0
        };
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos${id ? '?id=' + id : ''}`, {
                method: id ? 'PUT' : 'POST',
                headers: headersAutenticados,
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.status === 'success') {
                toast('Endereço salvo com sucesso!', 'success');
                fecharModalEndereco();
                await carregarEnderecos();
            } else {
                toast(result.details || result.message || 'Erro ao salvar endereço', 'error');
            }
        } catch (err) {
            toast('Erro de conexão ao salvar endereço', 'error');
        }
    };

    window.buscarCepEndereco = async function(cep) {
        const clean = cep.replace(/\D/g, '');
        if (clean.length !== 8) return;
        try {
            const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
            const d = await r.json();
            if (d.erro) return;
            document.getElementById('endereco-logradouro').value = d.logradouro || '';
            document.getElementById('endereco-bairro').value = d.bairro || '';
            document.getElementById('endereco-cidade').value = d.localidade || '';
            document.getElementById('endereco-estado').value = d.uf || '';
            document.getElementById('endereco-numero').focus();
        } catch (e) {}
    };

    window.editarEndereco = function(id) {
        const endereco = globalEnderecos.find(e => e.id == id);
        if (endereco) abrirModalEndereco(endereco);
    };

    let globalEnderecos = [];
    const _origRenderizarEnderecos = renderizarEnderecos;
    renderizarEnderecos = function(enderecos) {
        globalEnderecos = enderecos || [];
        _origRenderizarEnderecos(enderecos);
    };

    // ========================================================================
    // UTILITÁRIOS
    // ========================================================================

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function logTerminal(mensagem, tipo = 'info') {
        const container = document.getElementById('terminal-logs-container');
        if (!container) return;

        const linha = document.createElement('div');
        linha.className = `terminal-line log-${tipo}`;
        linha.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${mensagem}`;
        
        container.appendChild(linha);
        container.scrollTop = container.scrollHeight;
    }
});
