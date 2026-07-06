/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - MOTOR DE CUSTÓDIA FEMININA v2.0 (Techwear & Neo-Tailoring)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const FEM_API_BASE_URL = '/api';

// Cache de Estado Global Tático
let femCacheProdutos = []; 
let femFiltrosAtivos = { 
    categoria: 'all', 
    estilo: 'all',
    marca: 'all',
    status: 'all',
    ordenacao: 'recentes',
    precoMax: 5000
};

/**
 * 🚀 DISPARO IMEDIATO DO ECOSSISTEMA
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log('[ARQON VAULT] Ativando Motor Tático Feminino v2.0...');

    await inicializarComponentesMestres();
    configurarSensoresDeInterface();
    carregarAcervoFeminino();
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
async function carregarAcervoFeminino() {
    const grid = document.getElementById('fem-grid'); 
    if (!grid) {
        console.error('[ARQON ERROR] Grelha "fem-grid" não encontrada no HTML!');
        return;
    }

    // Injeta Skeletons Táticos para fluidez visual
    renderizarMascSkeletons(grid, 6);

    try {
        const resposta = await fetch(`${FEM_API_BASE_URL}/produtos`);
        if (!resposta.ok) throw new Error(`Falha HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        const todosProdutos = Array.isArray(dados) ? dados : (dados.data || []);

        // FILTRO ESTRITO: Captura apenas o universo feminino (CORRIGIDO)
        femCacheProdutos = todosProdutos.filter(p => {
            const gen = (p.genero || 'Unissex').toLowerCase();
            return gen.includes('feminin') || gen.includes('unissex');
        });

        if (femCacheProdutos.length === 0) {
            // Fallback se não encontrar nada categorizado
            femCacheProdutos = todosProdutos.slice(0, 6);
            console.warn('[ARQON] Nenhum item feminino estrito encontrado. Exibindo acervo geral.');
        }

        aplicarDiretrizesTaticas();

    } catch (erro) {
        console.error('[ARQON CRITICAL] Falha na comunicação do cofre:', erro);
        exibirFalhaCritica(grid);
    }
}

/**
 * ⚙️ MOTOR DE PROCESSAMENTO DE FILTROS E ORDENAÇÃO (CORRIGIDO)
 */
function aplicarDiretrizesTaticas() {
    let produtosProcessados = [...femCacheProdutos];

    // 1. Filtragem por Categoria
    if (femFiltrosAtivos.categoria !== 'all') {
        const filtro = femFiltrosAtivos.categoria.toLowerCase();
        produtosProcessados = produtosProcessados.filter(p => {
            const cat = (p.categoria || '').toLowerCase();
            return cat.includes(filtro);
        });
    }

    // 2. Filtragem por Estilo
    if (femFiltrosAtivos.estilo !== 'all') {
        const filtro = femFiltrosAtivos.estilo.toLowerCase();
        produtosProcessados = produtosProcessados.filter(p => {
            const est = (p.estilo || '').toLowerCase();
            return est.includes(filtro);
        });
    }

    // 3. Filtragem por Marca
    if (femFiltrosAtivos.marca !== 'all') {
        const filtro = femFiltrosAtivos.marca.toLowerCase();
        produtosProcessados = produtosProcessados.filter(p => {
            const marca = (p.marca || '').toLowerCase();
            return marca.includes(filtro);
        });
    }

    // 4. Filtro por status de disponibilidade
    if (femFiltrosAtivos.status && femFiltrosAtivos.status !== 'all') {
        const s = femFiltrosAtivos.status;
        const querDisp = (s === '1' || s === 'disponivel');
        produtosProcessados = produtosProcessados.filter(p => {
            const disponivel = (typeof p.disponivel === 'boolean')
                ? p.disponivel
                : (p.status_venda == 1 && (p.estoque_disponivel > 0 || p.qtd_disponivel > 0));
            return querDisp ? disponivel : !disponivel;
        });
    }

    // 5. Filtro por preço máximo
    if (femFiltrosAtivos.precoMax) {
        produtosProcessados = produtosProcessados.filter(p =>
            getValorReal(p) <= femFiltrosAtivos.precoMax
        );
    }

    // 6. Ordenação
    switch (femFiltrosAtivos.ordenacao) {
        case 'menor-preco':
            produtosProcessados.sort((a, b) => getValorReal(a) - getValorReal(b));
            break;
        case 'maior-preco':
            produtosProcessados.sort((a, b) => getValorReal(b) - getValorReal(a));
            break;
        case 'nome-az':
            produtosProcessados.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
            break;
        default:
            break;
    }

    renderizarArtefatosFemininos(produtosProcessados);
}

/**
 * 🎨 RENDERIZAÇÃO DOM (CONSTRUÇÃO DOS CARDS NO PADRÃO CATÁLOGO)
 */
function renderizarArtefatosFemininos(produtos) {
    const grid = document.getElementById('fem-grid');
    const contador = document.getElementById('fem-counter');
    
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
        // Resolve imagem com fallback
        let imagem = 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON+VAULT';
        if (p.foto_url || p.foto_principal_url) {
            const foto = p.foto_url || p.foto_principal_url;
            imagem = foto.startsWith('http') ? foto : `/public/uploads/${foto}`;
        } else if (p.imagem_url) {
            imagem = p.imagem_url.startsWith('http') ? p.imagem_url : `/public/uploads/${p.imagem_url}`;
        }
        
        const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getValorReal(p));
        const marca = p.marca_nome || p.marca || 'ARQON';
        const status = p.status || 'Disponível';
        
        const cardHTML = `
            <div class="arq-card" data-id="${p.id}">
                <div class="card-image-box">
                    <img src="${imagem}" alt="${p.nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500/0a0107/dcb23c?text=IMAGEM+INDISPONÍVEL'">
                    <div class="card-badges">
                        <div class="badge-status">
                            <span class="pulse-dot"></span> ${status}
                        </div>
                    </div>
                    <button class="btn-wishlist" onclick="alternarWishlistCard(${p.id})" style="position:absolute;top:15px;right:15px;z-index:3;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(4px);transition:all .3s;">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="card-info">
                    <div class="card-brand">${marca}</div>
                    <h3 class="card-title">${p.nome}</h3>
                    <div class="card-price-row">
                        <div class="price-block">
                            <span class="price-label">Diária</span>
                            <span class="price-value highlight">${preco}</span>
                        </div>
                    </div>
                </div>
                <div class="card-hover-actions">
                    <button class="action-btn" onclick="window.location.href='produto.html?id=${p.id}'">
                        <i class="fas fa-arrow-right"></i> VER DETALHES
                    </button>
                </div>
            </div>
        `;

        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * 🎛️ CAPTURA DE EVENTOS (FILTROS) - CORRIGIDO
 */
function configurarSensoresDeInterface() {
    // Categoria
    document.querySelectorAll('#fem-filter-category li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#fem-filter-category li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            femFiltrosAtivos.categoria = li.dataset.value;
            aplicarDiretrizesTaticas();
        });
    });

    // Estilo
    document.querySelectorAll('#fem-filter-estilo li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#fem-filter-estilo li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            femFiltrosAtivos.estilo = li.dataset.value;
            aplicarDiretrizesTaticas();
        });
    });

    // Marca
    document.querySelectorAll('#fem-filter-marca li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#fem-filter-marca li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            femFiltrosAtivos.marca = li.dataset.value;
            aplicarDiretrizesTaticas();
        });
    });

    // Status de disponibilidade
    document.querySelectorAll('#fem-filter-status li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#fem-filter-status li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            femFiltrosAtivos.status = li.dataset.value;
            aplicarDiretrizesTaticas();
        });
    });

    // Ordenação
    document.querySelectorAll('#fem-filter-order li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#fem-filter-order li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            femFiltrosAtivos.ordenacao = li.dataset.value;
            aplicarDiretrizesTaticas();
        });
    });

    // Slider de preço
    const slider = document.getElementById('fem-price-slider');
    const display = document.getElementById('fem-price-display');
    if (slider && display) {
        slider.addEventListener('input', () => {
            femFiltrosAtivos.precoMax = parseInt(slider.value);
            display.textContent = `R$ ${parseInt(slider.value).toLocaleString('pt-BR')}`;
            aplicarDiretrizesTaticas();
        });
    }

    // Limpar
    const btnClear = document.getElementById('fem-btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            femFiltrosAtivos = { categoria: 'all', estilo: 'all', marca: 'all', status: 'all', ordenacao: 'recentes', precoMax: 5000 };
            document.querySelectorAll('.fem-filter-options li').forEach(li => {
                li.classList.toggle('active', li.dataset.value === 'all');
            });
            if (slider) slider.value = 5000;
            if (display) display.textContent = 'R$ 5.000';
            aplicarDiretrizesTaticas();
        });
    }
}

/**
 * 🧮 HELPER: CONVERSOR DE PREÇOS
 */
function getValorReal(produto) {
    return parseFloat(produto.valor_diaria || produto.preco_diaria || produto.preco || 0);
}

/**
 * 🦴 SKELETONS TÁTICOS (ESTADOS DE CARREGAMENTO)
 */
function renderizarMascSkeletons(grid, qtd) {
    let skeletons = '';
    for (let i = 0; i < qtd; i++) {
        skeletons += `
            <div class="skeleton-card"><div class="skeleton-img-placeholder"></div><div class="skeleton-content"><div class="skeleton-line short"></div><div class="skeleton-line medium"></div><div class="skeleton-line button-placeholder"></div></div></div>`;
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
            <h3 style="letter-spacing:1px; font-size:16px;">SINAL DO COFRE PERDIDO</h3>
            <p style="font-size:13px; margin-top:5px; color:rgba(255,255,255,0.5);">A criptografia da base de dados falhou ou o servidor está offline.</p>
        </div>`;
}

/**
 * Alterna wishlist (card)
 */
function alternarWishlistCard(produtoId) {
    const token = localStorage.getItem('arqon_token');
    const btn = event.target.closest('.btn-wishlist');
    
    // Fallback localStorage para usuários não logados
    if (!token) {
        let favoritos = JSON.parse(localStorage.getItem('arqon_vault_wishlist')) || [];
        const index = favoritos.indexOf(produtoId);
        
        if (index === -1) {
            favoritos.push(produtoId);
            if (btn) {
                btn.classList.add('active');
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
            }
        } else {
            favoritos.splice(index, 1);
            if (btn) {
                btn.classList.remove('active');
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
            }
        }
        
        localStorage.setItem('arqon_vault_wishlist', JSON.stringify(favoritos));
        return;
    }

    // API call para usuários logados
    if (btn) btn.disabled = true;

    fetch(`${FEM_API_BASE_URL}/wishlist/verificar?id_produto=${produtoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(result => {
        if (result.status === 'success' && result.na_wishlist) {
            // Remove
            return fetch(`${FEM_API_BASE_URL}/wishlist?id_produto=${produtoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } else {
            // Adiciona
            return fetch(`${FEM_API_BASE_URL}/wishlist`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_produto: produtoId })
            });
        }
    })
    .then(r => r.json())
    .then(result => {
        if (result.status === 'success') {
            if (btn) {
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        }
    })
    .catch(error => {
        console.error('[ARQON WISHLIST] Erro:', error);
    })
    .finally(() => {
        if (btn) btn.disabled = false;
    });

}