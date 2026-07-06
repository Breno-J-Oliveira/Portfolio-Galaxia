/* cart.js (Envolvido em DOMContentLoaded para garantir a execução) */

document.addEventListener('DOMContentLoaded', () => {
    
    function initCartSystem() {
        const cartOverlay = document.getElementById('rentCartOverlay');
        const btnClose = document.getElementById('closeCartBtn');
        const backdrop = document.getElementById('closeCartBackdrop');
        const btnContinue = document.getElementById('btnContinueShopping');
        const removeBtns = document.querySelectorAll('.btn-remove-item');
        const checkoutBtn = document.getElementById('btnProceedCheckout');
        const testBtn = document.getElementById('testOpenCartBtn'); // Botão de teste

        // Funções de Abrir/Fechar
        function openCart() {
            if(cartOverlay) {
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Evita scroll do fundo
            }
        }

        function closeCart() {
            if(cartOverlay) {
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Listeners de Abertura/Fechamento
        if(testBtn) testBtn.addEventListener('click', openCart);
        if(btnClose) btnClose.addEventListener('click', closeCart);
        if(backdrop) backdrop.addEventListener('click', closeCart);
        if(btnContinue) btnContinue.addEventListener('click', closeCart);

        // Lógica Visual de Remover Item
        if(removeBtns.length > 0) {
            removeBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const item = e.target.closest('.cart-item');
                    
                    item.style.transform = 'translateX(50px)';
                    item.style.opacity = '0';
                    
                    setTimeout(() => {
                        item.remove();
                        updateCartTotals(); 
                        checkEmptyCart();
                    }, 400);
                });
            });
        }

        // Atualização de Valores
        function updateCartTotals() {
            const items = document.querySelectorAll('.cart-item');
            let subtotal = 0;

            items.forEach(item => {
                const priceText = item.querySelector('.item-price').textContent;
                const priceVal = parseFloat(priceText.replace('R$', '').replace('.', '').trim());
                if(!isNaN(priceVal)) subtotal += priceVal;
            });

            const subtotalEl = document.getElementById('cartSubtotal');
            const totalEl = document.getElementById('cartTotal');

            if(subtotalEl && totalEl) {
                const ecoFee = items.length > 0 ? 80 : 0;
                const deposit = items.length > 0 ? 500 : 0;
                const total = subtotal + ecoFee + deposit;

                subtotalEl.textContent = `R$ ${subtotal.toLocaleString('pt-BR')}`;
                totalEl.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
            }
        }

        // Verifica carrinho vazio
        function checkEmptyCart() {
            const container = document.getElementById('cartItemsList');
            const items = container.querySelectorAll('.cart-item');
            
            if(items.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding: 50px 0; opacity: 0.5;">
                        <span style="font-family: var(--font-tech, monospace); font-size: 2rem; color: var(--primary, #E7B93F);">00</span>
                        <p style="font-family: var(--font-tech, monospace); font-size: 0.8rem; letter-spacing: 2px; margin-top: 15px; color:#fff;">YOUR VAULT IS EMPTY</p>
                    </div>
                `;
                if(checkoutBtn) {
                    checkoutBtn.disabled = true;
                    checkoutBtn.style.opacity = '0.3';
                    checkoutBtn.style.cursor = 'not-allowed';
                }
            }
        }

        // Efeito de Checkout
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if(this.disabled) return;
                
                const originalText = this.querySelector('.btn-text').textContent;
                this.querySelector('.btn-text').textContent = 'ENCRYPTING...';
                this.querySelector('.btn-icon').textContent = '⟳';
                
                setTimeout(() => {
                    this.style.background = '#4caf50';
                    this.style.color = '#fff';
                    this.querySelector('.btn-text').textContent = 'AUTHORIZED';
                    this.querySelector('.btn-icon').textContent = '✓';
                }, 1500);
            });
        }

        // Expõe a função globalmente caso outro script precise chamar o carrinho
        window.arqonOpenCart = openCart;
    }

    initCartSystem();

});