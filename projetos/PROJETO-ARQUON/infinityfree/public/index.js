/**
 * ARQON - HOME PAGE ENGINE (index.js)
 * Redesign 2026 - Live Stats, New Drops
 */

// ==================== COMPONENT LOADER ====================
async function loadComponent(id, file) {
    try {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[ARQON] O container #${id} não foi encontrado no HTML.`);
            return false;
        }
        
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Erro ao buscar arquivo: ${file} (Status: ${res.status})`);
        
        el.innerHTML = await res.text();
        console.log(`[ARQON] Componente ${file} injetado com sucesso em #${id}`);
        return true;
    } catch (error) {
        console.error(`[ARQON_ERROR] Falha crítica no componente:`, error);
        return false;
    }
}

// ==================== LIVE STATS COUNTER ====================
async function atualizarStatsHero() {
    const totalEl = document.getElementById('hero-total-pieces');
    const availableEl = document.getElementById('hero-available-pieces');
    const brandsEl = document.getElementById('hero-brands-count');
    
    if (!totalEl || !availableEl || !brandsEl) return;
    
    try {
        const res = await fetch('/api/estoque/stats');
        if (!res.ok) throw new Error('Falha ao buscar stats');
        
        const response = await res.json();
        const data = response.data || {};
        
        // Animação de contagem
        animateCounter(totalEl, data.total || 0);
        animateCounter(availableEl, data.disponiveis || 0);
        animateCounter(brandsEl, data.marcas || 0);
        
    } catch (error) {
        console.error('[ARQON] Erro ao carregar stats:', error);
        // Fallback values
        totalEl.textContent = '247';
        availableEl.textContent = '89';
        brandsEl.textContent = '12';
    }
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ==================== ACERVO EM DESTAQUE (HEX GRID) ====================
async function carregarAcervoDestaque() {
    const container = document.getElementById('hex-grid-editorial');
    if (!container) return;

    const apiBase = window.ARQON_API_BASE || '/api';

    try {
        const res = await fetch(`${apiBase}/produtos?limit=12&order=recentes`);
        if (!res.ok) throw new Error('Falha ao buscar produtos');

        const data = await res.json();
        const produtos = data.produtos || data.data || [];

        if (produtos.length === 0) {
            container.innerHTML = '';
            return;
        }

        const resolveImg = window.arqonImageUrl || ((p) => p);

        container.innerHTML = produtos.slice(0, 8).map((p) => {
            const foto = resolveImg(p.foto_url);
            const marca = p.marca_nome || p.marca || 'ARCHIVE';
            return `
                <div class="hex" tabindex="0" role="button" onclick="window.location.href='produto.html?id=${p.id}'">
                    <div class="hex-shape">
                        <img src="${foto}" alt="${p.nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500/0a0107/dcb23c?text=ARQON'">
                        <div class="hex-caption">
                            <h3>${p.nome}</h3>
                            <p>${marca}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('[ARQON] Erro ao carregar acervo em destaque:', error);
    }
}

function configurarSliderDrops() {
    const container = document.getElementById('drop-slider-container');
    const prevBtn = document.getElementById('drop-prev');
    const nextBtn = document.getElementById('drop-next');
    
    if (!container || !prevBtn || !nextBtn) return;
    
    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -320, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 320, behavior: 'smooth' });
    });
}

// ==================== SCROLL REVEAL ====================
function iniciarScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ==================== BRAND TICKER DUPLICATION ====================
function duplicarTicker() {
    const ticker = document.getElementById('ticker-track');
    if (!ticker) return;
    
    const content = ticker.innerHTML;
    ticker.innerHTML = content + content;
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. Injeta Header e Footer
    await loadComponent("header", "components/header.html");
    await loadComponent("footer", "components/footer.html");
    
    if (typeof iniciarHeader === 'function') {
        iniciarHeader();
    }
    
    if (typeof atualizarHeaderAuth === 'function') {
        atualizarHeaderAuth();
    }
    
    // 2. Injeta Carrinho Lateral
    const cartLoaded = await loadComponent("carrinho-container", "components/botaocarrinho.html");
    
    if (cartLoaded && typeof initCartSystem === 'function') {
        initCartSystem(); 
        console.log("[ARQON] Engine do cofre lateral ativada com sucesso.");
    }
    
    // 3. Inicializa features da Home Page
    atualizarStatsHero();
    carregarAcervoDestaque();
    duplicarTicker();
    iniciarScrollReveal();
    
    console.log("[ARQON] Home page 2026 inicializada com sucesso.");
});

function atualizarHeaderAuth() {
    const loginLinks = document.querySelectorAll('a[href="login.html"], a[href="public/login.html"]');
    const token = localStorage.getItem('arqon_token');
    const nomeUsuario = localStorage.getItem('arqon_user_nome');
    const role = localStorage.getItem('arqon_role');

    if (token && loginLinks.length > 0) {
        let destino = 'profile.html';
        if (['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN', 'DEVELOPER'].includes(role)) {
            destino = 'admin.html';
        } else if (role === 'VENDOR') {
            destino = 'fornecedor.html';
        }

        const primeiroNome = nomeUsuario ? nomeUsuario.split(' ')[0] : 'VAULT';

        loginLinks.forEach(link => {
            link.href = destino;
            link.setAttribute('title', 'Aceder ao Painel My Vault');

            // Apenas o link do HEADER recebe o icone rico; o footer mantem texto simples
            const noHeader = link.closest('.arqon-header') !== null;
            if (noHeader) {
                link.innerHTML = `
                    <i class="fa-solid fa-user-shield" style="color: #E7B93F; filter: drop-shadow(0 0 5px rgba(231,185,63,0.4));"></i>
                    <span class="login-text" style="color: #E7B93F;">${primeiroNome.toUpperCase()}</span>
                `;
            } else {
                link.textContent = 'Meu Vault';
            }

            link.onclick = function(e) {
                e.preventDefault();
                window.location.href = destino;
            };
        });
    }
}