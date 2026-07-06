/* ============================================================
   ARQON | Interface do Header (Integração Front/Back)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    iniciarHeader();
});

function iniciarHeader() {
    console.log("[ARQON] Header UI inicializado.");

    // 1. LÓGICA DE BUSCA (REDIRECIONAMENTO)
    const searchInput = document.getElementById('arqon-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Impede do formulário tentar enviar via POST/GET nativo
                const termo = e.target.value.trim();
                if (termo) {
                    // Envia para o catálogo com a pesquisa na URL (ex: catalogo.html?q=calça)
                    window.location.href = `catalogo.html?q=${encodeURIComponent(termo)}`;
                }
            }
        });
    }

    // Botão de limpar busca (se existir no front)
    const btnClear = document.getElementById('clear-search');
    if (btnClear && searchInput) {
        btnClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
        });
    }

    // 2. LÓGICA DO USUÁRIO (NOME E FOTO)
    atualizarInterfaceUsuario();

    // 3. LÓGICA DO CARRINHO (BADGE/BOLINHA)
    atualizarBadgeCarrinho();
}

/**
 * ATUALIZA O NOME E FOTO DO USUÁRIO LOGADO
 */
function atualizarInterfaceUsuario() {
    // Puxa as informações salvas no localStorage no momento em que o Backend fez o Login
    const token = localStorage.getItem('arqon_token');
    const nomeCompleto = localStorage.getItem('arqon_user_nome');
    const fotoUrl = localStorage.getItem('arqon_user_foto');

    // Pega os elementos do seu header.html
    const loginText = document.querySelector('.login-text');
    const loginIcon = document.querySelector('.fa-circle-user'); 
    const loginLink = document.querySelector('.user-context-area a, .header-column a[href*="login"]'); 

    // Se existe um token (Usuário está logado)
    if (token) {
        // 1. Troca o texto "Login" pelo primeiro nome do usuário
        if (loginText && nomeCompleto) {
            const primeiroNome = nomeCompleto.split(' ')[0];
            loginText.textContent = primeiroNome; 
        }

        // 2. Troca o ícone padrão pela foto do usuário
        if (loginIcon && fotoUrl) {
            const imgAvatar = document.createElement('img');
            imgAvatar.src = fotoUrl;
            imgAvatar.className = 'user-avatar'; // Aplica o estilo que você já tem no header.css
            imgAvatar.alt = 'Avatar do Usuário';
            
            // Substitui o ícone FontAwesome (<i class="fa-solid...">) pela Imagem
            loginIcon.replaceWith(imgAvatar);
        }

        // 3. Muda a rota: Quando ele clicar no nome/foto, vai pro painel ao invés de login
        if (loginLink) {
            loginLink.href = 'dashboard.html'; // ou 'perfil.html' (ajuste conforme seu projeto)
        }
    }
}

/**
 * ATUALIZA O NÚMERO NA BOLINHA DO CARRINHO
 */
function atualizarBadgeCarrinho() {
    // Puxa o carrinho do localStorage (ou cria um array vazio se não existir nada)
    const carrinho = JSON.parse(localStorage.getItem('arqon_carrinho') || '[]');
    
    // Calcula quantos itens tem no carrinho no total
    const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);

    const badge = document.getElementById('cart-item-count');
    if (badge) {
        badge.textContent = total;
        
        // Se tiver itens, mostra a bolinha. Se não, oculta (usando a classe hidden).
        if (total > 0) {
            badge.classList.remove('hidden');
            badge.style.display = 'block';
        } else {
            badge.classList.add('hidden');
            badge.style.display = 'none';
        }
    }
}

/**
 * ABRE O MENU LATERAL DO CARRINHO
 * Essa função será ativada pelo onclick="abrirCarrinho()" lá no header.html
 */
window.abrirCarrinho = function(e) {
    if(e) e.preventDefault(); // Evita que a página pule pro topo

    // O script botãocarrinho.js exporta a função 'arqonOpenCart'. Nós a chamamos aqui:
    if (typeof window.arqonOpenCart === 'function') {
        window.arqonOpenCart();
    } else {
        console.warn("[ARQON] O arquivo botãocarrinho.js não foi carregado corretamente na página.");
    }
};