/* ============================================================
   ARQON | Interface do Header (Integração Front/Back)
   ============================================================ */

// Função unificada para inicializar os elementos do Header assim que ele entra no DOM
function iniciarHeader() {
    console.log("[ARQON] Header UI inicializado no DOM dinâmico.");

    // 1. LÓGICA DE BUSCA (REFORÇADA)
    const searchInput = document.getElementById('arqon-search-input');
    const searchIcon = document.querySelector('.search-icon'); 
    
    if (searchInput) {
        // Encontra o <form> em volta do input para podermos bloqueá-lo
        const searchForm = searchInput.closest('form');

        const executarPesquisa = (termo) => {
            if (termo) {
                // Força o redirecionamento para o catálogo com o termo na URL
                window.location.href = `catalogo.html?q=${encodeURIComponent(termo)}`;
            }
        };

        // BLOQUEIO 1: Se existir um <form>, impede que ele recarregue a página
        if (searchForm) {
            searchForm.onsubmit = function(e) {
                e.preventDefault();
                executarPesquisa(searchInput.value.trim());
            };
        }

        // BLOQUEIO 2: Captura diretamente o "Enter" no teclado
        searchInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                executarPesquisa(e.target.value.trim());
            }
        };

        // BLOQUEIO 3: Permite pesquisar clicando na lupa (ou expande em mobile)
        const isMobile = window.matchMedia('(max-width: 480px)');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.onclick = (e) => {
                if (isMobile.matches && searchForm) {
                    e.stopPropagation();
                    searchForm.classList.toggle('expanded');
                    if (searchForm.classList.contains('expanded')) {
                        setTimeout(() => searchInput.focus(), 100);
                    }
                    return;
                }
                executarPesquisa(searchInput.value.trim());
            };
        }

        // Fecha busca expandida ao clicar fora ou pressionar Escape (mobile)
        if (searchForm) {
            document.addEventListener('click', (e) => {
                if (isMobile.matches && searchForm.classList.contains('expanded') && !searchForm.contains(e.target)) {
                    searchForm.classList.remove('expanded');
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchForm.classList.contains('expanded')) {
                    searchForm.classList.remove('expanded');
                }
            });
        }
    }

    // Botão de limpar busca (X)
    const btnClear = document.getElementById('clear-search');
    if (btnClear && searchInput) {
        btnClear.onclick = () => {
            searchInput.value = '';
            searchInput.focus();
        };
    }

    // 3. LÓGICA DO MENU MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    function abrirMenu() {
        if (!mainNav) return;
        mainNav.classList.add('nav-open', 'nav-open-active');
        document.body.style.overflow = 'hidden';
        if (navOverlay) navOverlay.classList.add('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'true');
            if (menuIcon) menuIcon.className = 'fa-solid fa-xmark';
        }
    }

    function fecharMenu() {
        if (!mainNav) return;
        mainNav.classList.remove('nav-open', 'nav-open-active');
        document.body.style.overflow = '';
        if (navOverlay) navOverlay.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mainNav.classList.contains('nav-open-active');
            if (isOpen) fecharMenu(); else abrirMenu();
        });

        // Fecha ao clicar no overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', fecharMenu);
        }

        // Fecha ao clicar no botao X dentro do painel
        const navClose = document.getElementById('nav-close');
        if (navClose) {
            navClose.addEventListener('click', (e) => {
                e.preventDefault();
                fecharMenu();
            });
        }

        // Fecha ao clicar em um link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', fecharMenu);
        });

        // Fecha ao pressionar Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('nav-open-active')) {
                fecharMenu();
            }
        });
    }

    // 3.1 FILTROS COLAPSAVEIS NO MOBILE (catalogo, masculino, feminino)
    const sidebarConfigs = [
        { sidebar: '.catalog-sidebar', header: '.sidebar-title' },
        { sidebar: '.masc-sidebar', header: '.masc-sidebar-header' },
        { sidebar: '.fem-sidebar', header: '.fem-sidebar-header' }
    ];
    sidebarConfigs.forEach((cfg) => {
        const sb = document.querySelector(cfg.sidebar);
        const hd = sb ? sb.querySelector(cfg.header) : null;
        if (sb && hd) {
            hd.addEventListener('click', () => {
                if (window.innerWidth <= 1024) sb.classList.toggle('filters-open');
            });
        }
    });

    // 4. LÓGICA DO USUÁRIO E CARRINHO
    atualizarInterfaceUsuario();
    atualizarBadgeCarrinho();
}

/**
 * ATUALIZA NOME E LINK DO USUÁRIO CONFORME AUTH DO BACKEND
 */
function atualizarInterfaceUsuario() {
    const token = localStorage.getItem('arqon_token');
    const nomeUsuario = localStorage.getItem('arqon_user_nome');
    const role = localStorage.getItem('arqon_role');
    const userContainer = document.getElementById('user-context-area');

    if (!userContainer) return;

    // String do SVG Padrão (Vetorizado, leve e limpo)
    // Usamos fill="currentColor" para que a cor seja controlada facilmente via CSS/Style
    const svgAvatarPadrao = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arqon-avatar-svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
            <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
    `;

    if (token && nomeUsuario) {
        // ==========================================
        // 1. ESTADO: USUÁRIO AUTENTICADO (LOGADO)
        // ==========================================
        const primeiroNome = nomeUsuario.split(' ')[0].toUpperCase();
        const fotoUrl = localStorage.getItem('arqon_user_foto');
        
        // Destino correto por role
        let destinoLink = 'profile.html';
        if (['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN', 'DEVELOPER'].includes(role)) {
            destinoLink = 'admin.html';
        } else if (role === 'VENDOR') {
            destinoLink = 'fornecedor.html';
        }

        let avatarHTML = '';
        let fotoSrc = '';
        if (fotoUrl && fotoUrl !== 'null' && fotoUrl !== 'undefined' && !fotoUrl.includes('default-avatar')) {
            fotoSrc = fotoUrl.startsWith('http') || fotoUrl.startsWith('/')
                ? fotoUrl
                : '/public/uploads/' + fotoUrl;
            avatarHTML = `<img src="${fotoSrc}" alt="Perfil" class="arqon-header-avatar">`;
        } else {
            avatarHTML = `<span class="arqon-header-avatar-svg-wrapper logado">${svgAvatarPadrao}</span>`;
        }

        userContainer.innerHTML = `
            <a href="${destinoLink}" class="login-link authenticated" title="Meu Painel" style="display: flex; align-items: center; gap: 10px;">
                ${avatarHTML}
                <span class="login-text" style="color: #E7B93F;">${primeiroNome}</span>
            </a>
        `;
    } else {
        userContainer.innerHTML = `
            <a href="login.html" class="login-link deslogado" style="display: flex; align-items: center; gap: 8px;">
                <span class="arqon-header-avatar-svg-wrapper">${svgAvatarPadrao}</span>
                <span class="login-text">Login</span>
            </a>
        `;
    }

    // Listener de segurança: redireciona para o destino correto por role
    const loginLink = userContainer.querySelector('.login-link');
    if (loginLink && token) {
        const role = localStorage.getItem('arqon_role');
        let destino = 'profile.html';
        if (['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN', 'DEVELOPER'].includes(role)) {
            destino = 'admin.html';
        } else if (role === 'VENDOR') {
            destino = 'fornecedor.html';
        }
        loginLink.href = destino;
    }
}

/**
 * ATUALIZA O NÚMERO NA BOLINHA DO CARRINHO
 */
function atualizarBadgeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('arqon_cart') || '[]');
    const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);
    const badge = document.getElementById('cart-item-count');
    
    if (badge) {
        badge.textContent = total;
        
        if (total > 0) {
            badge.classList.remove('hidden');
            badge.style.display = 'flex'; 
        } else {
            badge.classList.add('hidden');
            badge.style.display = 'none';
        }
    }
}

// Fallback de segurança: caso o script seja carregado numa página estática tradicional
if (document.getElementById('arqon-search-input')) {
    iniciarHeader();
}