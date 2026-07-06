/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - MOTOR DE CUSTÓDIA MASCULINA v2.0 (Techwear & Neo-Tailoring)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const MASC_API_BASE_URL = '/PROJETO-ARQUON/index.php/api';

// Cache de Estado Global Tático
let mascCacheProdutos = []; 
let mascFiltrosAtivos = { 
    categoria: 'all', 
    ordenacao: 'rarity', 
    prontaEntrega: false 
};

/**
 * 🚀 DISPARO IMEDIATO DO ECOSSISTEMA
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log('[ARQON VAULT] Ativando Motor Tático Masculino v2.0...');

    await inicializarComponentesMestres();
    configurarSensoresDeInterface();
    carregarAcervoMasculino();
});

/**
 * 🧩 INJEÇÃO DE COMPONENTES GLOBAIS
 */
async function inicializarComponentesMestres() {
    async function loadComponent(id, file) {
        try {
            const el = document.getElementById(id);
            if (!el) return;
            const res = await fetch(file);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            el.innerHTML = await res.text();
            
            if (id === 'header' && !el.classList.contains("arqon-header")) {
                el.classList.add("arqon-header");
            }
        } catch (error) {
            console.warn(`[ARQON] Falha tática ao injetar ${file}.`, error);
        }
    }

    await loadComponent("header", "components/header.html");
    await loadComponent("footer", "components/footer.html");
}

/**
 * 📡 LIGAÇÃO COM A BASE DE DADOS E EXTRAÇÃO
 */
async function carregarAcervoMasculino() {
    const grid = document.getElementById('masc-grid'); 
    if (!grid) {
        console.error('[ARQON ERROR] Grelha "masc-grid" não encontrada no HTML!');
        return;
    }

    // Injeta Skeletons Táticos para fluidez visual
    renderizarMascSkeletons(grid, 6);

    try {
        const resposta = await fetch(`${MASC_API_BASE_URL}/produtos`);
        if (!resposta.ok) throw new Error(`Falha HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        const todosProdutos = Array.isArray(dados) ? dados : (dados.data || []);

        // FILTRO ESTRITO: Captura apenas o universo masculino
        mascCacheProdutos = todosProdutos.filter(p => {
            const cat = (p.categoria || '').toLowerCase();
            const nome = (p.nome || '').toLowerCase();
            return cat.includes('masculin') || 
                   cat.includes('streetwear') || 
                   cat.includes('techwear') || 
                   nome.includes('homem') || 
                   nome.includes('masculino');
        });

        if (mascCacheProdutos.length === 0) {
            // Fallback se não encontrar nada categorizado
            mascCacheProdutos = todosProdutos.slice(0, 6);
            console.warn('[ARQON] Nenhum item masculino estrito encontrado. Exibindo acervo geral.');
        }

        aplicarDiretrizesTaticas();

    } catch (erro) {
        console.error('[ARQON CRITICAL] Falha na comunicação do cofre:', erro);
        exibirFalhaCritica(grid);
    }
}

/**
 * ⚙️ MOTOR DE PROCESSAMENTO DE FILTROS E ORDENAÇÃO
 */
function aplicarDiretrizesTaticas() {
    let produtosProcessados = [...mascCacheProdutos];

    // 1. Filtragem por Categoria Tática
    if (mascFiltrosAtivos.categoria !== 'all') {
        produtosProcessados = produtosProcessados.filter(p => {
            const cat = (p.categoria || '').toLowerCase();
            const nome = (p.nome || '').toLowerCase();
            
            if (mascFiltrosAtivos.categoria === 'techwear') {
                return cat.includes('tech') || nome.includes('tátic') || nome.includes('impermeável');
            }
            if (mascFiltrosAtivos.categoria === 'tailoring') {
                return cat.includes('tailor') || nome.includes('blazer') || nome.includes('smoking') || nome.includes('alfaiataria');
            }
            if (mascFiltrosAtivos.categoria === 'avant') {
                return cat.includes('avant') || nome.includes('escultural') || nome.includes('colete');
            }
            return true;
        });
    }

    // 2. Ordenação Tática
    if (mascFiltrosAtivos.ordenacao === 'price-asc') {
        produtosProcessados.sort((a, b) => getValorReal(a) - getValorReal(b));
    } else if (mascFiltrosAtivos.ordenacao === 'price-desc') {
        produtosProcessados.sort((a, b) => getValorReal(b) - getValorReal(a));
    } else if (mascFiltrosAtivos.ordenacao === 'rarity') {
        produtosProcessados.sort((a, b) => getValorReal(b) - getValorReal(a));
    }

    // Renderização Final
    renderizarArtefatosMasculinos(produtosProcessados);
}

/**
 * 🎨 RENDERIZAÇÃO DOM (CONSTRUÇÃO DOS CARDS NO PADRÃO CATÁLOGO)
 */
function renderizarArtefatosMasculinos(produtos) {
    const grid = document.getElementById('masc-grid');
    const contador = document.getElementById('masc-counter');
    
    if (!grid) return;
    grid.innerHTML = '';

    if (contador) {
        contador.innerHTML = `${produtos.length} ARTEFATOS ENCONTRADOS`;
    }

    if (produtos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 60px; color: var(--color-tertiary);">
                <i class="fas fa-radar" style="font-size: 40px; margin-bottom: 15px; color: var(--color-secondary);"></i>
                <h3 style="letter-spacing:1px; font-size:16px;">NENHUM ARTEFATO CORRESPONDE ÀS DIRETRIZES</h3>
            </div>`;
        return;
    }

    produtos.forEach(p => {
        // 1. O SEGREDO DAS IMAGENS: RESOLUÇÃO DE CAMINHO IDÊNTICO AO CATÁLOGO
        let urlImagem = 'https://placehold.co/400x500/100a14/E7B93F?text=ARQON+VAULT';
        if (p.foto_url) {
            urlImagem = p.foto_url.startsWith('http') ? p.foto_url : `/PROJETO-ARQUON/public/uploads/${p.foto_url}`;
        } else if (p.imagem) {
            urlImagem = p.imagem.startsWith('http') ? p.imagem : `/PROJETO-ARQUON/public/uploads/${p.imagem}`;
        }

        // 2. MATEMÁTICA DE CUSTÓDIA
        const valorDiaria = getValorReal(p);
        const valorCaucao = p.valor_mercado ? (parseFloat(p.valor_mercado) * 0.5) : (valorDiaria * 15 * 0.5); 
        
        const diariaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorDiaria);
        const caucaoFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorCaucao);
        
        // 3. RARIDADE TÁTICA
        let raridadeBadge = 'RARIDADE A';
        if (valorDiaria > 200) raridadeBadge = 'RARIDADE S';
        if (valorDiaria > 500) raridadeBadge = 'EXCLUSIVO';

        // 4. HTML BLINDADO (CLONE DO CATÁLOGO .arq-card)
        const cardHTML = `
            <div class="arq-card">
                <div class="card-image-box" onclick="window.location.href='produto.html?id=${p.id}'" style="cursor: pointer;">
                    <div class="card-badges">
                        <span class="badge-status">${raridadeBadge}</span>
                    </div>
                    <img src="${urlImagem}" alt="${p.nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500/100a14/E7B93F?text=IMAGEM+INDISPONÍVEL'">
                </div>
                
                <div class="card-info">
                    <p class="card-brand">AQ-M-${(p.id || '0').toString().padStart(4, '0')}</p>
                    <h3 class="card-title">${p.nome}</h3>
                    
                    <div class="card-price-row">
                        <div class="price-block">
                            <span class="price-label">Custódia Diária</span>
                            <span class="price-value highlight">${diariaFormatada}</span>
                        </div>
                        <div class="price-block">
                            <span class="price-label">Caução</span>
                            <span class="price-value" style="color: var(--color-tertiary);">${caucaoFormatada}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-hover-actions">
                    <button class="action-btn" onclick="window.location.href='produto.html?id=${p.id}'">
                        <i class="fas fa-vault"></i> REQUISITAR COFRE
                    </button>
                </div>
            </div>
        `;

        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * 🎛️ CAPTURA DE EVENTOS (FILTROS)
 */
function configurarSensoresDeInterface() {
    const categoryOptions = document.querySelectorAll('#masc-filter-category li, #filter-category li');
    categoryOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            categoryOptions.forEach(opt => opt.classList.remove('active'));
            e.currentTarget.classList.add('active');
            mascFiltrosAtivos.categoria = e.currentTarget.getAttribute('data-value');
            aplicarDiretrizesTaticas();
        });
    });

    const selectOrdenacao = document.getElementById('masc-filter-order') || document.querySelector('.m-cyber-select');
    if (selectOrdenacao) {
        selectOrdenacao.addEventListener('change', (e) => {
            mascFiltrosAtivos.ordenacao = e.target.value;
            aplicarDiretrizesTaticas();
        });
    }

    const btnClear = document.getElementById('masc-btn-clear') || document.getElementById('btn-clear-filters');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            mascFiltrosAtivos.categoria = 'all';
            mascFiltrosAtivos.ordenacao = 'rarity';
            
            if(selectOrdenacao) selectOrdenacao.value = 'rarity';
            categoryOptions.forEach(opt => opt.classList.remove('active'));
            const elmAll = document.querySelector('[data-value="all"]');
            if(elmAll) elmAll.classList.add('active');
            
            aplicarDiretrizesTaticas();
        });
    }
}

/**
 * 🦴 SKELETONS TÁTICOS (CORRIGIDO PARA O PADRÃO CATÁLOGO)
 */
function renderizarMascSkeletons(grid, qtd) {
    let skeletons = '';
    for (let i = 0; i < qtd; i++) {
        skeletons += `
            <div class="arq-card skeleton-box" style="height: 480px; display: flex; flex-direction: column; background: rgba(10, 6, 18, 0.4); border: 1px solid rgba(255,255,255,0.03); border-radius: 8px;">
                <div class="skel-img" style="width: 100%; height: 300px; background: rgba(255,255,255,0.05);"></div>
                <div class="skel-text" style="padding: 20px; flex-grow: 1;">
                    <div style="height: 10px; width: 40%; background: rgba(255,255,255,0.05); margin-bottom: 15px; border-radius: 2px;"></div>
                    <div style="height: 15px; width: 80%; background: rgba(255,255,255,0.05); margin-bottom: 20px; border-radius: 2px;"></div>
                    <div style="height: 25px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 2px;"></div>
                </div>
            </div>`;
    }
    grid.innerHTML = skeletons;
}

/**
 * ❌ FALHA DE COMUNICAÇÃO (ERROR STATE)
 */
function exibirFalhaCritica(grid) {
    if (!grid) return;
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px; color: #ff5268; border: 1px dashed rgba(255,82,104,0.3); border-radius: 8px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 15px;"></i>
            <h3 style="letter-spacing:2px; font-size:16px;">LINK DE CUSTÓDIA ROMPIDO</h3>
            <p style="font-size: 12px; color: var(--color-tertiary); margin-top:10px;">Não foi possível autenticar o acervo com os servidores centrais da ARQON.</p>
        </div>`;
}

/**
 * 🛠️ UTILS
 */
function getValorReal(produto) {
    return parseFloat(produto.valor_diaria || produto.preco_diaria || produto.preco || 0);
}