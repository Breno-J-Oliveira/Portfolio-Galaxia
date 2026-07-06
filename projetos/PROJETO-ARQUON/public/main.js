/**
 * ARQON - FRONT-END DATA ENGINE (main.js)
 * Conexão Segura com "The Vault" (API)
 */

const API_URL = '/PROJETO-ARQUON/api/produtos';

// ==========================================
// 1. MOTOR PRINCIPAL DE BUSCA (THE VAULT)
// ==========================================
async function fetchHomeData() {
    // Procura o container na Home (pode ser o dynamic-drops ou feed-container dependendo do seu HTML)
    const grid = document.getElementById('dynamic-drops-grid') || document.getElementById('feed-container');
    if (!grid) {
        console.warn("[ARQON] Container de produtos não encontrado na página atual.");
        return;
    }

    // 1. Mostra o Skeleton Loading (Design Dark Luxury)
    renderSkeletons(grid, 6);

    try {
        console.log("[ARQON] Solicitando acesso ao Cofre...", API_URL);
        
        // 2. Chama a API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const json = await response.json();

        // 3. Processa e Renderiza os Dados
        if (json.status === "success" && Array.isArray(json.data)) {
            const produtos = json.data;
            grid.innerHTML = ''; // Limpa os skeletons
            
            if (produtos.length > 0) {
                // Monta os cards dos produtos
                produtos.forEach(produto => renderProductCard(produto, grid));
                
                // Monta a barra de categorias dinamicamente
                renderDynamicCategories(produtos);
                
                // Re-inicializa as animações de scroll para os novos itens
                setTimeout(initScrollReveal, 100); 
            } else {
                grid.innerHTML = '<p style="color:var(--text-dim); text-align:center; width:100%; grid-column: 1/-1;">O cofre está vazio no momento.</p>';
            }
        } else {
            throw new Error(json.error || "Formato de resposta inválido.");
        }
    } catch (error) {
        console.error("[ARQON_CRITICAL] Falha na comunicação com o Backend:", error);
        grid.innerHTML = '<p style="color:#ff4444; text-align:center; width:100%; grid-column: 1/-1;">O Cofre está temporariamente inacessível.</p>';
    }
}

// ==========================================
// 2. RENDERIZAÇÃO DE UI (CARDS E CATEGORIAS)
// ==========================================

function renderProductCard(produto, container) {
    const valorFormatado = parseFloat(produto.valor_diaria).toFixed(2).replace('.', ',');
    // Fallback de imagem caso a API ainda não retorne a foto
    const imgUrl = produto.imagem_principal || 'assets/img/placeholder.webp'; 
    const categoria = produto.categoria || 'EXCLUSIVE';
    const marca = produto.marca || 'ARQON';
    
    // Lógica Simulada de Badges baseada no valor de mercado (Luxo = Hot)
    let badgeHTML = '';
    if (parseFloat(produto.valor_mercado) > 10000) badgeHTML = `<span class="badge hot">HIGH LUXURY</span>`;
    else badgeHTML = `<span class="badge new">NEW DROP</span>`;

    const cardHTML = `
        <article class="proto-card reveal-section" style="opacity:0; transition: opacity 0.5s ease;">
            ${badgeHTML}
            <div class="p-image-wrap" onclick="goTo('produto', ${produto.id})" style="cursor:pointer; height:250px; background:#111; overflow:hidden;">
                <img src="${imgUrl}" alt="${produto.nome}" class="proto-card-img" loading="lazy" style="width:100%; height:100%; object-fit:cover; opacity: 0.6; transition: 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">
            </div>
            <div class="proto-card-info" style="padding: 15px;">
                <span class="proto-card-cat" style="color:var(--proto-gold, #dcb23c); font-size: 0.7rem; letter-spacing: 1px;">
                    ${marca.toUpperCase()} | ${categoria.toUpperCase()}
                </span>
                <h4 class="proto-card-title" style="margin: 8px 0; font-size: 1.1rem; color: #fff;">${produto.nome}</h4>
                <div class="proto-card-price" style="font-family: Arial, sans-serif; font-size: 1rem; color: #fff;">
                    R$ ${valorFormatado} <span style="font-size: 0.7rem; color:#aaa;">/ dia</span>
                </div>
                <button class="btn-alugar" onclick="addToCart(${produto.id})" style="margin-top:15px; width:100%; background:transparent; border:1px solid #dcb23c; color:#dcb23c; padding:10px; cursor:pointer; text-transform:uppercase; font-weight:bold; transition: 0.3s;" onmouseover="this.style.background='#dcb23c'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='#dcb23c';">
                    Reservar Peça
                </button>
            </div>
        </article>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHTML);
}

function renderDynamicCategories(produtos) {
    const container = document.getElementById('category-container');
    if (!container) return;
    
    // Extrai categorias únicas do JSON de produtos
    const categoriasUnicas = [...new Set(produtos.map(p => p.categoria))].filter(Boolean);
    
    let html = `<span class="cat-link" onclick="goTo('home')" style="cursor:pointer; margin-right:15px;">HOME</span>`;
    html += `<span class="cat-link" onclick="goTo('catalogo')" style="cursor:pointer; margin-right:15px; color:var(--proto-gold, #dcb23c);">VER TUDO</span>`;
    
    categoriasUnicas.forEach(cat => {
        html += `<span class="cat-link" onclick="goToCategoria('${cat}')" style="cursor:pointer; margin-right:15px;">${cat.toUpperCase()}</span>`;
    });
    
    container.innerHTML = html;
}

function renderSkeletons(container, qtd) {
    let skeletons = '';
    const anim = `
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
    `;
    // Injeta a keyframe caso não exista no CSS
    if(!document.getElementById('skeleton-styles')) {
        document.head.insertAdjacentHTML('beforeend', `<style id="skeleton-styles">${anim}</style>`);
    }

    for (let i = 0; i < qtd; i++) {
        skeletons += `
            <div class="skeleton-card" style="background:#121212; border:1px solid #222; border-radius:4px; height:420px; overflow:hidden;">
                <div style="height:250px; background:linear-gradient(to right, #1a1a1a 0%, #2a2a2a 20%, #1a1a1a 40%, #1a1a1a 100%); background-size:1000px 100%; animation: shimmer 2s infinite linear forwards;"></div>
                <div style="height:15px; width:40%; background:#222; margin:15px; border-radius:2px;"></div>
                <div style="height:20px; width:80%; background:#222; margin:10px 15px; border-radius:2px;"></div>
                <div style="height:35px; width:90%; background:#1a1a1a; margin:20px 15px; border-radius:2px;"></div>
            </div>
        `;
    }
    container.innerHTML = skeletons;
}

// ==========================================
// 3. AUXILIARES E INTERAÇÕES
// ==========================================

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                // entry.target.classList.add('is-visible'); // Caso use a classe no CSS
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-section').forEach(section => {
        observer.observe(section);
    });
}

// Função base chamada pelo index.js quando o app carrega
function renderMain() {
    console.log("[ARQON] Iniciando motor de dados (renderMain)...");
    fetchHomeData();
}

function goTo(route, id = null) {
    let url = `${route}.html`;
    if (id) url += `?id=${id}`;
    console.log(`[ARQON ROUTER] Navegando para: ${url}`);
    window.location.href = url; // Ativado para uso real
}

function goToCategoria(categoria) {
    console.log(`[ARQON ROUTER] Filtrando categoria: ${categoria}`);
    window.location.href = `catalogo.html?category=${encodeURIComponent(categoria)}`;
}

function addToCart(id) {
    console.log("Produto adicionado ao carrinho:", id);
    alert("Peça adicionada ao Vault (Carrinho de Reserva)!");
}