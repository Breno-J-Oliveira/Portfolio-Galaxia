/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - MOTOR DE CATÁLOGO UNIVERSAL ALTA COSTURA v7.5 (Paginação + Wishlist)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const API_BASE_URL = '/PROJETO-ARQUON/index.php/api';

let arqonCacheProdutos = []; 
let produtosFiltradosCache = [];
let filtrosAtivos = { category: 'all', brand: 'all', style: 'all', status: 'all', maxPrice: 5000, q: '' };
let ordenacaoAtual = 'recentes'; // Nova feature

// Configuração de Paginação
let paginaAtual = 1;
const ITENS_POR_PAGINA = 9; 

/**
 * 🚀 DISPARO IMEDIATO E SEGURO
 */
function inicializarEcossistemaCatalogo() {
    console.log('[ARQON VAULT] Ativando Motor do Catálogo de Luxo v7.5...');

    const gridHome = document.getElementById('new-drops-grid');
    const gridVitrine = document.getElementById('catalog-grid');

    if (gridHome) {
        renderSkeletons(gridHome, 6);
        carregarProdutosHome();
    }

    if (gridVitrine) {
        renderSkeletons(gridVitrine, 8);
        configurarEIniciarVitrine();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEcossistemaCatalogo);
} else {
    inicializarEcossistemaCatalogo();
}

/**
 * CARREGA EXCLUSIVAMENTE OS LANÇAMENTOS DA HOME (Sem paginação)
 */
async function carregarProdutosHome() {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos?limit=6`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const resultado = await response.json();
        const produtos = resultado.data || resultado;
        
        arqonCacheProdutos = Array.isArray(produtos) ? produtos : [];
        // Chamando o renderizador avisando que NÃO usa paginação (false)
        renderizarGridArtefatos(arqonCacheProdutos, 'new-drops-grid', false);
    } catch (err) {
        exibirMensagemErroGrid('new-drops-grid');
    }
}

/**
 * CONFIGURA E SINCRO_INICIAL DA VITRINE COMPLETA
 */
async function configurarEIniciarVitrine() {
    lerFiltrosDaUrl();
    await Promise.all([
        carregarMetadadosFiltros(),
        sincronizarProdutosCofre()
    ]);
    configurarEventosSidebar();
}

/**
 * POPULA AS OPÇÕES DA SIDEBAR DINAMICAMENTE
 */
async function carregarMetadadosFiltros() {
    try {
        const [resMarcas, resCategorias, resEstilos] = await Promise.all([
            fetch(`${API_BASE_URL}/marcas`).then(r => r.json()).catch(() => null),
            fetch(`${API_BASE_URL}/categorias`).then(r => r.json()).catch(() => null),
            fetch(`${API_BASE_URL}/estilos`).then(r => r.json()).catch(() => null)
        ]);

        if (resMarcas) popularListaFiltro('filter-brand', resMarcas.data || resMarcas, filtrosAtivos.brand);
        if (resCategorias) popularListaFiltro('filter-category', resCategorias.data || resCategorias, filtrosAtivos.category);
        if (resEstilos) popularListaFiltro('filter-style', resEstilos.data || resEstilos, filtrosAtivos.style);
    } catch (err) {
        console.warn('[ARQON] Metadados dinâmicos indisponíveis:', err);
    }
}

function popularListaFiltro(elementId, dados, valorAtivo) {
    const container = document.getElementById(elementId);
    if (!container || !Array.isArray(dados)) return;

    const itemTodos = container.querySelector('li[data-value="all"]');
    container.innerHTML = '';
    if (itemTodos) container.appendChild(itemTodos);

    dados.forEach(item => {
        const id = item.id;
        const nome = item.nome;
        if (!id || !nome) return;

        const li = document.createElement('li');
        li.setAttribute('data-value', id);
        li.textContent = nome;

        if (String(valorAtivo) === String(id)) {
            if (itemTodos) itemTodos.classList.remove('active');
            li.classList.add('active');
        }
        container.appendChild(li);
    });
}

/**
 * PUXA OS PRODUTOS VIA API
 */
async function sincronizarProdutosCofre() {
    let url = `${API_BASE_URL}/produtos`;
    
    if (filtrosAtivos.q) {
        url += `?q=${encodeURIComponent(filtrosAtivos.q)}`;
        const titulo = document.getElementById('catalog-main-title');
        if (titulo) titulo.textContent = `BUSCA: "${filtrosAtivos.q.toUpperCase()}"`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const resultado = await response.json();
        const produtos = resultado.data || resultado;
        
        arqonCacheProdutos = Array.isArray(produtos) ? produtos : [];
        ejecutarFiltragemCruzada();

    } catch (error) {
        exibirMensagemErroGrid('catalog-grid');
    }
}

/**
 * ESCUTADORES DA SIDEBAR
 */
function configurarEventosSidebar() {
    const secoes = ['category', 'brand', 'style', 'status'];

    secoes.forEach(tipo => {
        const container = document.getElementById(`filter-${tipo}`);
        if (!container) return;

        container.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            container.querySelectorAll('li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            filtrosAtivos[tipo] = li.getAttribute('data-value');
            atualizarUrlNavegador();
            ejecutarFiltragemCruzada();
        });
    });

    const slider = document.getElementById('price-slider');
    const displayPreco = document.getElementById('price-max-display');
    if (slider && displayPreco) {
        slider.value = filtrosAtivos.maxPrice;
        displayPreco.textContent = filtrosAtivos.maxPrice >= 5000 ? 'R$ 5.000+' : `R$ ${filtrosAtivos.maxPrice}`;

        slider.addEventListener('input', (e) => {
            const valor = parseInt(e.target.value);
            displayPreco.textContent = valor >= 5000 ? 'R$ 5.000+' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
            filtrosAtivos.maxPrice = valor;
            ejecutarFiltragemCruzada();
        });
        
        slider.addEventListener('change', atualizarUrlNavegador);
    }

    const btnClear = document.getElementById('btn-clear-filters');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            filtrosAtivos = { category: 'all', brand: 'all', style: 'all', status: 'all', maxPrice: 5000, q: '' };
            
            secoes.forEach(tipo => {
                const c = document.getElementById(`filter-${tipo}`);
                if (!c) return;
                c.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                const defaultLi = c.querySelector('li[data-value="all"]');
                if (defaultLi) defaultLi.classList.add('active');
            });

            if (slider && displayPreco) {
                slider.value = 5000;
                displayPreco.textContent = 'R$ 5.000+';
            }

            const titulo = document.getElementById('catalog-main-title');
            if (titulo) titulo.textContent = "THE VAULT";

            atualizarUrlNavegador();
            ejecutarFiltragemCruzada();
        });
    }
}

/**
 * ALGORITMO DE FILTRAGEM CRUZADA E ORDENAÇÃO
 */
function ejecutarFiltragemCruzada() {
    let resultado = [...arqonCacheProdutos];

    if (filtrosAtivos.category && filtrosAtivos.category !== 'all') {
        resultado = resultado.filter(p => String(p.id_categoria) === String(filtrosAtivos.category) || (p.categoria && p.categoria.toLowerCase() === String(filtrosAtivos.category).toLowerCase()));
    }
    if (filtrosAtivos.brand && filtrosAtivos.brand !== 'all') {
        resultado = resultado.filter(p => String(p.id_marca) === String(filtrosAtivos.brand) || (p.marca && p.marca.toLowerCase() === String(filtrosAtivos.brand).toLowerCase()));
    }
    if (filtrosAtivos.style && filtrosAtivos.style !== 'all') {
        resultado = resultado.filter(p => String(p.id_estilo) === String(filtrosAtivos.style) || (p.estilo && p.estilo.toLowerCase() === String(filtrosAtivos.style).toLowerCase()));
    }
    if (filtrosAtivos.status && filtrosAtivos.status !== 'all') {
        resultado = resultado.filter(p => String(p.status_venda) === String(filtrosAtivos.status));
    }

    resultado = resultado.filter(p => parseFloat(p.valor_diaria || 0) <= filtrosAtivos.maxPrice);

    // Sistema de Ordenação (Novo)
    if (ordenacaoAtual === 'menor-preco') resultado.sort((a, b) => a.valor_diaria - b.valor_diaria);
    if (ordenacaoAtual === 'maior-preco') resultado.sort((a, b) => b.valor_diaria - a.valor_diaria);

    // Salva no cache global e reseta a paginação
    produtosFiltradosCache = resultado;
    paginaAtual = 1;

    // Aciona a renderização com paginação ativada (true)
    renderizarGridArtefatos(produtosFiltradosCache, 'catalog-grid', true);
}

/**
 * 🎨 RENDERIZADOR DO TEMPLATE DE ALTA COSTURA (Design Limpo - Sem Inline Styles)
 */
function renderizarGridArtefatos(produtosArr, containerId, usarPaginacao = false) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    // Atualiza Contador
    const counter = document.getElementById('catalog-counter');
    if (counter && containerId === 'catalog-grid') {
        counter.textContent = `${produtosArr.length} ${produtosArr.length === 1 ? 'artefato' : 'artefatos'}`;
    }

    // Corta o array para Paginação (Apenas se usarPaginacao for true)
    let produtosParaMostrar = produtosArr;
    if (usarPaginacao) {
        produtosParaMostrar = produtosArr.slice(0, paginaAtual * ITENS_POR_PAGINA);
    }

    if (produtosArr.length === 0) {
        grid.innerHTML = `
            <div class="vault-empty-state">
                <i class="fas fa-fingerprint"></i>
                <h3>NENHUM ARTEFATO LOCALIZADO</h3>
                <p>Nenhuma peça corresponde aos parâmetros atuais do cofre.</p>
            </div>
        `;
        removerBotaoCarregarMais();
        return;
    }

    // Carrega Wishlist do LocalStorage
    const wishlist = JSON.parse(localStorage.getItem('arqon_wishlist') || '[]');

    grid.innerHTML = produtosParaMostrar.map(p => {
        let urlImagem = 'https://cdn-icons-png.flaticon.com/512/3514/3514491.png';
        if (p.foto_url) {
            urlImagem = p.foto_url.startsWith('http') ? p.foto_url : `/PROJETO-ARQUON/public/uploads/${p.foto_url}`;
        }

        const precoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor_diaria || 0);
        
        const badgeStatus = parseInt(p.status_venda) === 1
            ? `<div class="badge-status status-disponivel"><span class="pulse-dot"></span>DISPONÍVEL</div>`
            : `<div class="badge-status status-indisponivel"><span class="solid-dot"></span>EM CUSTÓDIA</div>`;

        const isFavorito = wishlist.includes(p.id);

        return `
            <article class="arq-card" onclick="abrirProduto(${p.id})">
                <div class="card-img">
                    ${badgeStatus}
                    <button class="btn-wishlist ${isFavorito ? 'active' : ''}" onclick="toggleWishlist(event, ${p.id}, this)" title="Wishlist">
                        <i class="${isFavorito ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <img src="${urlImagem}" alt="${p.nome}" loading="lazy" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3514/3514491.png'" />
                </div>
                <div class="card-info">
                    <span class="card-brand">${p.marca || 'ARQON VAULT'}</span>
                    <h3 class="card-name">${p.nome || 'Artefato não catalogado'}</h3>
                    <div class="card-price-row">
                        <div class="price-container">
                            <span class="price-label">Taxa de Custódia</span>
                            <span class="card-price">${precoFormatado} <small>/ dia</small></span>
                        </div>
                        <button class="btn-add-cart" onclick="adicionarAoCarrinho(event, ${p.id})" title="Adicionar ao Carrinho">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    if (usarPaginacao) {
        gerenciarBotaoCarregarMais();
    }
}

/**
 * 📦 LÓGICA DO BOTÃO "CARREGAR MAIS" (PAGINAÇÃO)
 */
function gerenciarBotaoCarregarMais() {
    let containerPai = document.querySelector('.catalog-main-content');
    if (!containerPai) return;

    removerBotaoCarregarMais(); 

    if (produtosFiltradosCache.length > paginaAtual * ITENS_POR_PAGINA) {
        const btnContainer = document.createElement('div');
        btnContainer.id = 'load-more-container';
        btnContainer.style.cssText = 'text-align: center; padding: 40px 0; grid-column: 1 / -1; width: 100%;';
        
        btnContainer.innerHTML = `<button id="btn-load-more" class="btn-load-more">DECODIFICAR MAIS ARTEFATOS</button>`;
        containerPai.appendChild(btnContainer);

        document.getElementById('btn-load-more').addEventListener('click', () => {
            paginaAtual++;
            renderizarGridArtefatos(produtosFiltradosCache, 'catalog-grid', true); 
        });
    }
}

function removerBotaoCarregarMais() {
    const btn = document.getElementById('load-more-container');
    if (btn) btn.remove();
}

/**
 * 💖 SISTEMA DE WISHLIST (FAVORITOS DE LUXO)
 */
function toggleWishlist(event, produtoId, btnElement) {
    event.stopPropagation(); // Impede de abrir a página
    let wishlist = JSON.parse(localStorage.getItem('arqon_wishlist') || '[]');
    
    const index = wishlist.indexOf(produtoId);
    if (index === -1) {
        wishlist.push(produtoId);
        btnElement.classList.add('active');
        btnElement.querySelector('i').classList.replace('far', 'fas');
        showAlert('Artefato adicionado ao seu Personal Vault 💖', 'success');
    } else {
        wishlist.splice(index, 1);
        btnElement.classList.remove('active');
        btnElement.querySelector('i').classList.replace('fas', 'far');
    }
    
    localStorage.setItem('arqon_wishlist', JSON.stringify(wishlist));
}

// ==============================================================================
// FUNÇÕES UTILITÁRIAS (Carrinho, URL e Alertas mantidos idênticos do original)
// ==============================================================================

function lerFiltrosDaUrl() {
    const params = new URLSearchParams(window.location.search);
    filtrosAtivos.category = params.get('category') || 'all';
    filtrosAtivos.brand = params.get('brand') || 'all';
    filtrosAtivos.style = params.get('style') || 'all';
    filtrosAtivos.status = params.get('status') || 'all';
    filtrosAtivos.maxPrice = parseInt(params.get('price')) || 5000;
    filtrosAtivos.q = params.get('q') || '';
}

function atualizarUrlNavegador() {
    const params = new URLSearchParams();
    if (filtrosAtivos.category !== 'all') params.set('category', filtrosAtivos.category);
    if (filtrosAtivos.brand !== 'all') params.set('brand', filtrosAtivos.brand);
    if (filtrosAtivos.style !== 'all') params.set('style', filtrosAtivos.style);
    if (filtrosAtivos.status !== 'all') params.set('status', filtrosAtivos.status);
    if (filtrosAtivos.maxPrice !== 5000) params.set('price', filtrosAtivos.maxPrice);
    if (filtrosAtivos.q) params.set('q', filtrosAtivos.q);

    const novoLink = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, '', novoLink);
}

function abrirProduto(id) { window.location.href = `produto.html?id=${id}`; }

function adicionarAoCarrinho(event, produtoId) {
    event.stopPropagation();
    const token = localStorage.getItem('arqon_token');
    if (!token) {
        showAlert('⚠️ Autenticação necessária para reservar artefatos.', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1600);
        return;
    }
    const produto = arqonCacheProdutos.find(p => p.id === produtoId);
    if (!produto) { showAlert('❌ Artefato não localizado.', 'error'); return; }
    
    let carrinho = JSON.parse(localStorage.getItem('arqon_carrinho') || '[]');
    const itemExistente = carrinho.find(item => item.id === produtoId);
    if (itemExistente) { itemExistente.quantidade++; } else {
        carrinho.push({ id: produtoId, nome: produto.nome, preco: produto.valor_diaria, marca: produto.marca, foto: produto.foto_url, quantidade: 1 });
    }
    localStorage.setItem('arqon_carrinho', JSON.stringify(carrinho));
    showAlert(`✅ ${produto.nome.toUpperCase()} adicionado ao Carrinho!`, 'success');
    atualizarBadgeCarrinho();
}

function atualizarBadgeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('arqon_carrinho') || '[]');
    const total = carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'block' : 'none';
    }
}

function renderSkeletons(container, qtd) {
    let skeletons = '';
    if (!document.getElementById('arqon-shimmer-styles')) {
        const style = document.createElement('style');
        style.id = 'arqon-shimmer-styles';
        style.textContent = `@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`;
        document.head.appendChild(style);
    }
    for (let i = 0; i < qtd; i++) {
        skeletons += `
            <div class="skeleton-card" style="background: rgba(10,6,18,0.4); border: 1px solid rgba(255,255,255,0.03); border-radius: 8px; height: 450px; display: flex; flex-direction: column; overflow: hidden;">
                <div style="width: 100%; aspect-ratio: 3/4; background: linear-gradient(90deg, #120c1c 25%, #1c1429 50%, #120c1c 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite linear;"></div>
                <div style="padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                    <div style="height: 12px; width: 40%; background: rgba(255,255,255,0.05);"></div>
                    <div style="height: 12px; width: 80%; background: rgba(255,255,255,0.05);"></div>
                </div>
            </div>`;
    }
    container.innerHTML = skeletons;
}

function exibirMensagemErroGrid(containerId) {
    const grid = document.getElementById(containerId);
    if (grid) {
        grid.innerHTML = `
            <div class="vault-error-state" style="grid-column: 1/-1; text-align:center; padding: 60px; color: var(--color-primary-light);">
                <i class="fas fa-shield-alt" style="font-size: 40px; margin-bottom: 15px;"></i>
                <h3 style="letter-spacing:1px; font-size:16px;">CONEXÃO INTERROMPIDA</h3>
            </div>`;
    }
}

function showAlert(message, type = 'info') {
    const cores = { 'success': '#E7B93F', 'error': '#50132D', 'warning': '#B99432', 'info': '#A0A0A0' };
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed; top: 110px; right: 30px; background: #0A0612; color: #FFF;
        padding: 16px 28px; border-radius: 2px; border-left: 4px solid ${cores[type]};
        z-index: 10000; font-family: var(--font-main); font-size: 13px; letter-spacing: 1px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7); transition: 0.4s;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => { alert.style.transform = 'translateX(120%)'; setTimeout(() => alert.remove(), 400); }, 3500);
}

window.addEventListener('load', atualizarBadgeCarrinho);