/**
 * ====================================================================
 * ARQON | THE VAULT - CONTROLLER MESTRE DO PERFIL (V9.2)
 * Funcionalidades: Correção de IDs, SVG Dinâmico com Variáveis CSS e Abas
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. BLINDAGEM DE SESSÃO: Verifica se o utilizador está realmente logado
    const token = localStorage.getItem('arqon_token');
    if (!token) {
        window.location.replace('login.html');
        return;
    }

    const headersAutenticados = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Ajuste dinâmico de rota caso mude de diretório
    const API_ENDPOINT = '/PROJETO-ARQUON/api/profile.php';

    // 2. INICIAR O MOTOR DO PAINEL
    inicializarCofre();

    async function inicializarCofre() {
        await carregarDadosCadastrais();
        await carregarHistoricoEFavoritos();
    }

    // ----------------------------------------------------------------
    // FUNÇÕES DE CARREGAMENTO DE DADOS (GET)
    // ----------------------------------------------------------------

    async function carregarDadosCadastrais() {
        try {
            const response = await fetch(`${API_ENDPOINT}?action=perfil`, {
                method: 'GET',
                headers: headersAutenticados
            });
            const resultado = await response.json();

            if (resultado.status === 'success') {
                const usuario = resultado.data;
                
                // Mapeamento blindado para suportar qualquer ID do seu HTML (Profile.html)
                const elNomeDisplay = document.getElementById('perfil-nome-display') || document.getElementById('user-display-name');
                const elWelcomeName = document.getElementById('welcome-name');
                
                if (elNomeDisplay) elNomeDisplay.textContent = usuario.nome;
                if (elWelcomeName) elWelcomeName.textContent = usuario.nome.split(' ')[0];
                
                // Preenchimento dos campos de formulários se existirem
                const inputNome = document.getElementById('prof-nome');
                const inputEmail = document.getElementById('prof-email');
                const inputFoto = document.getElementById('prof-foto');

                if (inputNome) inputNome.value = usuario.nome;
                if (inputEmail) inputEmail.value = usuario.email;
                if (inputFoto) inputFoto.value = usuario.foto_url || '';

                // GERENCIADOR DE AVATAR INTELIGENTE (Injeta o SVG editável se não houver foto)
                gerenciarExibicaoAvatar(usuario.foto_url);
            }
        } catch (erro) {
            console.error("[ARQON ERROR]: Falha ao carregar perfil mestre.", erro);
        }
    }

    /**
     * Remove a imagem ou injeta o código SVG customizável por variáveis CSS
     */
    function gerenciarExibicaoAvatar(fotoUrl) {
        // Busca a tag de imagem original ou o container dela
        const avatarImg = document.getElementById('user-avatar');
        
        if (!avatarImg) return;
        
        const container = avatarImg.parentElement;

        if (fotoUrl && fotoUrl !== 'null' && fotoUrl.trim() !== '') {
            // Se o usuário tem foto cadastrada, exibe a imagem normalmente
            avatarImg.src = fotoUrl;
            avatarImg.style.display = 'block';
            
            // Remove o SVG padrão caso ele tenha sido criado antes
            const svgExistente = container.querySelector('.arqon-svg-avatar');
            if (svgExistente) svgExistente.remove();
        } else {
            // Se NÃO tem foto, oculta a tag <img> e injeta o inline SVG customizável
            avatarImg.style.display = 'none';
            
            // Evita duplicar o SVG se ele já estiver na tela
            if (!container.querySelector('.arqon-svg-avatar')) {
                const svgHTML = `
                    <svg class="arqon-svg-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 80px; height: 80px; border-radius: 50%; padding: 4px; border: 1px solid var(--color-secondary, #E7B93F);">
                        <circle cx="12" cy="12" r="11" fill="none" stroke="var(--color-secondary, #E7B93F)" stroke-width="1"/>
                        <circle cx="12" cy="8.5" r="3.5" fill="var(--color-secondary, #E7B93F)"/>
                        <path d="M12 14c-4 0-7.5 2-7.5 5v1h15v-1c0-3-3.5-5-7.5-5z" fill="var(--color-secondary, #E7B93F)"/>
                    </svg>
                `;
                container.insertAdjacentHTML('beforeend', svgHTML);
            }
        }
    }

    async function carregarHistoricoEFavoritos() {
        try {
            const response = await fetch(`${API_ENDPOINT}?action=dashboard_dados`, {
                method: 'GET',
                headers: headersAutenticados
            });
            const resultado = await response.json();

            if (resultado.status === 'success') {
                renderizarPedidos(resultado.pedidos || []);
                renderizarFavoritos(resultado.favoritos || []);
            }
        } catch (error) {
            console.error("[ARQON ERROR]: Falha ao buscar tabelas do painel:", error);
        }
    }

    // ----------------------------------------------------------------
    // RENDERIZADORES VISUAIS DA LOGÍSTICA
    // ----------------------------------------------------------------

    function renderizarPedidos(pedidos) {
        const tbody = document.getElementById('lista-alugueis-vazio'); 
        const contador = document.getElementById('metric-artifacts-count');
        
        if (!tbody) return;

        if (pedidos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding: 20px; color: var(--color-tertiary);">
                        Nenhum artefato sob a sua custódia no momento.
                    </td>
                </tr>`;
            if (contador) contador.textContent = '0 Sob Custódia';
            return;
        }

        if (contador) contador.textContent = `${pedidos.length} Sob Custódia`;
        tbody.innerHTML = '';

        pedidos.forEach(item => {
            const tr = document.createElement('tr');
            const dataLocacao = new Date(item.data_locacao).toLocaleDateString('pt-BR');
            const statusPagamento = item.status_pagamento ? item.status_pagamento.toUpperCase() : 'PENDENTE';
            const statusEnvio = item.status_envio ? item.status_envio.toUpperCase() : 'A PROCESSAR';

            tr.innerHTML = `
                <td><strong>Pedido #${item.id}</strong></td>
                <td>${dataLocacao}</td>
                <td><span class="status-tag">${statusPagamento}</span></td>
                <td><span class="status-tag">${statusEnvio}</span></td>
                <td>R$ ${parseFloat(item.total).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderizarFavoritos(favoritos) {
        const grid = document.querySelector('.favoritos-grid'); 
        if (!grid) return;

        if (favoritos.length === 0) {
            grid.innerHTML = `<p style="color: var(--color-tertiary); padding: 20px;">Sua lista de desejos está vazia.</p>`;
            return;
        }

        grid.innerHTML = favoritos.map(f => `
            <div class="p-metric-card" style="display:flex; flex-direction:column; align-items: center; text-align: center; border: 1px solid var(--arqon-border); padding: 15px; border-radius: 8px;">
                <img src="${f.imagem_url || '../assets/images/placeholder.png'}" alt="${f.nome}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                <h4 style="font-size: 0.85rem; margin-bottom: 5px;">${f.nome}</h4>
                <p style="color: var(--color-secondary); font-size: 0.8rem; font-weight: 600; margin-bottom: 10px;">R$ ${parseFloat(f.preco_diaria).toFixed(2)} / dia</p>
                <a href="produto.html?id=${f.id}" class="btn-save-vault" style="padding: 5px 10px; font-size: 0.75rem; text-decoration:none;">VER</a>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------
    // SPA: GERENCIADOR DE ABAS E ENVIOS
    // ----------------------------------------------------------------
    const abasBotoes = document.querySelectorAll('.vault-tab-btn:not(.logout-action)');
    const conteudosAbas = document.querySelectorAll('.vault-tab-content');

    abasBotoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const alvo = btn.getAttribute('data-tab');

            abasBotoes.forEach(b => b.classList.remove('active'));
            conteudosAbas.forEach(c => c.classList.remove('active-tab'));

            btn.classList.add('active');
            const painelAlvo = document.getElementById(`tab-${alvo}`);
            if (painelAlvo) painelAlvo.classList.add('active-tab');
        });
    });

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm("Deseja realmente trancar o cofre e terminar a sessão?")) {
                localStorage.clear();
                window.location.replace('login.html');
            }
        });
    }
});