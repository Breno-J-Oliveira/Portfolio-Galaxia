/**
 * ARQON - ENGINE DE GESTÃO DO COFRE LATERAL (botaocarrinho.js)
 * Versão Homologada com Correções de Escopo, Fluxo Financeiro e Rotas
 */

window.arqonOpenCart = window.arqonOpenCart || function() {
    console.warn('[ARQON] A interface do cofre lateral ainda não foi totalmente inicializada pelo Maestro.');
};

function initCartSystem() {
    console.log("[ARQON VAULT] Ativando barramento lógico do carrinho lateral...");

    const cartOverlay = document.getElementById('rentCartOverlay');
    const btnClose = document.getElementById('closeCartBtn');
    const backdrop = document.getElementById('closeCartBackdrop');
    const btnContinue = document.getElementById('btnContinueShopping');
    const checkoutBtn = document.getElementById('btnProceedCheckout');
    const cartItemsList = document.getElementById('cartItemsList');

    // =========================================================
    // 1. FUNÇÕES DE CONTROLO DE INTERFACE (ABRIR/FECHAR)
    // =========================================================
    function openCart() {
        if (cartOverlay) {
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloqueia o scroll da página ao fundo
            renderCartItems(); // Força a atualização visual dos itens persistidos ao abrir
        }
    }

    function closeCart() {
        if (cartOverlay) {
            cartOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Desbloqueia o scroll
        }
    }

    // 🌟 CORREÇÃO 4: EVENT LISTENERS PARA FECHAR A GAVETA
    if (btnClose) btnClose.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);
    if (btnContinue) btnContinue.addEventListener('click', closeCart);

    // =========================================================
    // 2. LÓGICA DE RENDERIZAÇÃO DOS ITENS (ARTEFATOS)
    // =========================================================
    function renderCartItems() {
        if (!cartItemsList) return;
        
        let cartData = JSON.parse(localStorage.getItem('arqon_cart')) || [];
        cartItemsList.innerHTML = ''; // Limpa a lista antes de desenhar
        
        if (cartData.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-message" style="text-align: center; color: #888; padding: 40px 20px;">
                    <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 15px; color: #444;"></i>
                    <p>O seu cofre está vazio.</p>
                </div>`;
            atualizarResumo(0, 0, 0); // Zera os valores
            
            if (checkoutBtn) checkoutBtn.disabled = true; // Desativa o botão de checkout
            
            // Atualiza a bolinha do header se estiver aberto
            if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        let subtotal = 0;
        let caucaoTotal = 0;

        cartData.forEach((item, index) => {
            // Cálculos fictícios para o exemplo (ajusta conforme a tua lógica de preços)
            const precoItem = parseFloat(item.preco || 0);
            subtotal += precoItem * (item.quantidade || 1);
            caucaoTotal += precoItem * 0.2; // Exemplo: Caução é 20% do valor

            const itemHTML = `
                <div class="cart-item">
                    <div class="item-info">
                        <h4 class="item-name" style="color: #fff;">${item.nome || 'Artefato Desconhecido'}</h4>
                        <span class="item-price" style="color: #E7B93F;">R$ ${precoItem.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removerItemDoCofre(${index})" title="Remover do Cofre" style="background: none; border: none; color: #ff4c4c; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Taxa fixa de higienização
        const taxaHigienizacao = 35.00;
        
        atualizarResumo(subtotal, taxaHigienizacao, caucaoTotal);
        
        // Atualiza a bolinha do header global
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    }

    // =========================================================
    // 3. ATUALIZAÇÃO DOS VALORES NO RESUMO
    // =========================================================
    function atualizarResumo(subtotal, taxaHigienizacao, caucaoTotal) {
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartCleaningFee = document.getElementById('cartCleaningFee');
        const cartSecurityDeposit = document.getElementById('cartSecurityDeposit');
        const cartTotal = document.getElementById('cartTotal');

        const totalFinal = subtotal + taxaHigienizacao + caucaoTotal;

        if (cartSubtotal) cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (cartCleaningFee) cartCleaningFee.textContent = `R$ ${subtotal > 0 ? taxaHigienizacao.toFixed(2) : '0.00'}`;
        if (cartSecurityDeposit) cartSecurityDeposit.textContent = `R$ ${caucaoTotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `R$ ${subtotal > 0 ? totalFinal.toFixed(2) : '0.00'}`;
    }

    // =========================================================
    // 4. ANIMAÇÃO E REDIRECIONAMENTO DO CHECKOUT
    // =========================================================
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const btnText = this.querySelector('.btn-text');
            const btnIcon = this.querySelector('.btn-icon');
            
            if (btnText) btnText.textContent = 'CRIPTOGRAFANDO...';
            if (btnIcon) btnIcon.textContent = '⟳';
            
            setTimeout(() => {
                this.style.background = '#4caf50';
                this.style.color = '#fff';
                if (btnText) btnText.textContent = 'AUTORIZADO';
                if (btnIcon) btnIcon.textContent = '✓';
                
                setTimeout(() => {
                    // Redireciona para a página de checkout real
                    window.location.href = "/PROJETO-ARQUON/public/checkout.html";
                }, 400);
            }, 1500);
        });
    }

    // Expor a função de abrir o carrinho globalmente
    window.arqonOpenCart = openCart;
    
    // Tornar renderCartItems acessível globalmente (útil se outro script precisar forçar refresh)
    window.renderCartItems = renderCartItems;

    // Executa a carga inicial síncrona dos itens do cofre
    renderCartItems();
}

// =========================================================
// HANDLER GLOBAL PARA REMOVER ITEM (Disparado pelo botão da lixeira)
// =========================================================
window.removerItemDoCofre = function(index) {
    let cartData = JSON.parse(localStorage.getItem('arqon_cart')) || [];
    cartData.splice(index, 1);
    localStorage.setItem('arqon_cart', JSON.stringify(cartData));
    
    // Força a renderização para atualizar os valores e a lista na tela
    if (typeof window.renderCartItems === 'function') {
        window.renderCartItems();
    }
};

// =========================================================
// HANDLER GLOBAL PARA ADICIONAR ITEM AO COFRE
// =========================================================
window.adicionarAoCofre = function(id, nome, preco, imagem, categoria, tamanho) {
    // 1. Puxa os itens que já estão no cofre
    let cartData = JSON.parse(localStorage.getItem('arqon_cart')) || [];
    
    // 2. Verifica se este artefato já está no cofre
    let itemExistente = cartData.find(item => item.id === id);
    
    if (itemExistente) {
        // Se já existir, apenas aumenta a quantidade
        itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
        // Se não existir, adiciona como um novo artefato
        cartData.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem,
            categoria: categoria,
            tamanho: tamanho,
            quantidade: 1
        });
    }
    
    // 3. Salva de volta no banco de dados do navegador (localStorage)
    localStorage.setItem('arqon_cart', JSON.stringify(cartData));
    
    // 4. Atualiza a bolinha vermelha/dourada no Header
    if (typeof atualizarBadgeCarrinho === 'function') {
        atualizarBadgeCarrinho();
    }
    
    // 5. Atualiza o HTML do carrinho lateral por baixo dos panos
    if (typeof window.renderCartItems === 'function') {
        window.renderCartItems();
    }
    
    // 6. Abre a gaveta lateral automaticamente para o utilizador ver o item lá dentro!
    if (typeof window.arqonOpenCart === 'function') {
        window.arqonOpenCart();
    }
    
    console.log(`[ARQON VAULT] Artefato ${nome} guardado no cofre com sucesso.`);
};