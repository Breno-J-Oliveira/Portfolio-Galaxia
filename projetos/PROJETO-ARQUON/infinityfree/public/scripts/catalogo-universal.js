/**
 * ARQON — CATÁLOGO UNIVERSAL ENGINE v3.0
 * Corrige: filtros não funcionando, pesquisa redirecionando, estoque limitado por tamanho
 */

class ArqonCatalogEngine {
  constructor(config = {}) {
    this.config = {
      apiBase: window.ARQON_API_BASE || '/api',
      containerId: config.containerId || 'products-grid',
      skeletonCount: config.skeletonCount || 8,
      mode: config.mode || 'catalog', // 'catalog' | 'home' | 'masculino' | 'feminino'
      ...config
    };
    
    this.allProducts = [];
    this.filteredProducts = [];
    this.activeFilters = {
      category: 'all',
      brand: 'all',
      style: 'all',
      status: 'all',
      gender: 'all',
      size: 'all',
      maxPrice: 99999,
      search: '',
      order: 'recentes'
    };
    
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    this.showSkeletons();
    await this.loadProducts();
    this.bindFilters();
    this.bindSearch();

    // Se veio de redirecionamento de busca do header, applyFilters() já foi chamado em bindSearch()
    // Caso contrário, aplica filtros padrão (inclui modo masc/fem baseado em categoria)
    this.applyFilters();
  }

  showSkeletons() {
    const container = document.getElementById(this.config.containerId);
    if (!container) return;
    
    container.innerHTML = Array.from({ length: this.config.skeletonCount }, () => `
      <div class="arqon-skeleton-card">
        <div class="skel-img"></div>
        <div class="skel-body">
          <div class="skel-line short"></div>
          <div class="skel-line medium"></div>
          <div class="skel-line long"></div>
        </div>
      </div>
    `).join('');
  }

  async loadProducts() {
    try {
      const params = new URLSearchParams();
      if (this.config.mode === 'masculino') params.set('genero', 'Masculino');
      if (this.config.mode === 'feminino') params.set('genero', 'Feminino');
      params.set('limit', '200'); // Carrega tudo para filtrar client-side

      const res = await fetch(`${this.config.apiBase}/produtos?${params}`);
      if (!res.ok) throw new Error('Falha ao carregar produtos');
      
      const data = await res.json();
      this.allProducts = data.produtos || data.data || [];
      this.filteredProducts = [...this.allProducts];
      
      // Popula filtros dinâmicos
      this.populateDynamicFilters();
      
    } catch (err) {
      console.error('[ARQON] Erro ao carregar produtos:', err);
      this.allProducts = [];
      this.filteredProducts = [];
    }
  }

  populateDynamicFilters() {
    // Extrai valores únicos
    const categories = [...new Set(this.allProducts.map(p => p.categoria_nome || p.categoria).filter(Boolean))];
    const brands = [...new Set(this.allProducts.map(p => p.marca_nome || p.marca).filter(Boolean))];
    const styles = [...new Set(this.allProducts.map(p => p.estilo_nome || p.estilo).filter(Boolean))];

    // Popula listas de filtro no DOM
    this.populateFilterList('filter-category', categories, 'category');
    this.populateFilterList('filter-brand', brands, 'brand');
    this.populateFilterList('filter-style', styles, 'style');
  }

  populateFilterList(elementId, values, filterKey) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    // Mantém o "Todos" primeiro
    const existing = el.querySelector('[data-value="all"]');
    const allItem = existing || this.createFilterItem('all', 'Todos', filterKey);
    allItem.classList.add('active');
    
    el.innerHTML = '';
    el.appendChild(allItem);
    
    values.forEach(val => {
      el.appendChild(this.createFilterItem(val, val, filterKey));
    });
  }

  createFilterItem(value, label, filterKey) {
    const li = document.createElement('li');
    li.dataset.value = value;
    li.textContent = label;
    li.addEventListener('click', () => this.setFilter(filterKey, value, li));
    return li;
  }

  bindFilters() {
    // Bind para listas de filtro (delegação de eventos no container pai)
    const filterMaps = {
      'filter-category': 'category',
      'filter-brand': 'brand',
      'filter-style': 'style',
      'filter-status': 'status',
      'filter-gender': 'gender',
      'filter-size': 'size',
      // Variantes para masculino/feminino
      'masc-filter-category': 'category',
      'masc-filter-status': 'status',
      'masc-filter-order': 'order',
      'fem-filter-category': 'category',
      'fem-filter-status': 'status',
      'fem-filter-order': 'order'
    };

    Object.entries(filterMaps).forEach(([id, filterKey]) => {
      const el = document.getElementById(id);
      if (!el) return;
      
      // Usa event delegation no UL
      el.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        
        // Remove active de todos, adiciona no clicado
        el.querySelectorAll('li').forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        
        this.setFilter(filterKey, li.dataset.value, null);
      });
    });

    // Price slider
    const priceSlider = document.getElementById('price-slider') || 
                        document.getElementById('masc-price-slider') ||
                        document.getElementById('fem-price-slider');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.activeFilters.maxPrice = val;
        
        // Atualiza display
        const display = document.getElementById('price-max-display') || 
                        document.getElementById('masc-price-display') ||
                        document.getElementById('fem-price-display');
        if (display) display.textContent = `R$ ${val.toLocaleString('pt-BR')}`;
        
        this.applyFilters();
      });
    }

    // Hero tags (filtros rápidos no topo das páginas masculino/feminino)
    document.querySelectorAll('.masc-tag, .fem-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('.masc-tag, .fem-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        const filterVal = tag.dataset.filter;
        if (filterVal === 'all') {
          this.setFilter('category', 'all', null);
        } else {
          this.setFilter('category', filterVal, null);
        }
      });
    });

    // Botão limpar — usa event listener ao invés de onclick inline
    const clearBtns = document.querySelectorAll(
      '#btn-clear-filters, #masc-btn-clear, #fem-btn-clear, .arqon-btn-secondary'
    );
    clearBtns.forEach(btn => {
      btn.addEventListener('click', () => this.clearAllFilters());
    });
  }

  bindSearch() {
    // Search no header (redireciona para catálogo com query)
    const headerSearch = document.getElementById('arqon-search-form');
    const headerInput = document.getElementById('arqon-search-input');
    
    if (headerSearch && headerInput) {
      headerSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = headerInput.value.trim();
        if (query) {
          // Se já está no catálogo, filtra in-place
          const isCatalog = window.location.pathname.includes('catalogo');
          const isMasc = window.location.pathname.includes('masculino');
          const isFem = window.location.pathname.includes('feminino');
          
          if (isCatalog || isMasc || isFem) {
            this.setFilter('search', query, null);
            // Foca o campo de busca local se existir
            const localInput = document.getElementById('local-search-input');
            if (localInput) {
              localInput.value = query;
              localInput.focus();
            }
          } else {
            // Redireciona para catálogo com a query preservada
            window.location.href = `catalogo.html?q=${encodeURIComponent(query)}`;
          }
        }
      });
      
      // Busca em tempo real com debounce
      let debounceTimer;
      headerInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const isCatalog = window.location.pathname.includes('catalogo') ||
                            window.location.pathname.includes('masculino') ||
                            window.location.pathname.includes('feminino');
          if (isCatalog) {
            this.setFilter('search', e.target.value.trim(), null);
          }
        }, 350);
      });
    }
    
    // Busca local dentro do catálogo (input "Buscar artefato...")
    const localSearchInput = document.getElementById('local-search-input');
    if (localSearchInput) {
      let localDebounce;
      localSearchInput.addEventListener('input', (e) => {
        clearTimeout(localDebounce);
        localDebounce = setTimeout(() => {
          this.setFilter('search', e.target.value.trim(), null);
        }, 300);
      });
      
      // Também permite buscar com Enter
      localSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.setFilter('search', e.target.value.trim(), null);
        }
      });
    }
    
    // Lê query da URL ao carregar (para quando redireciona da home)
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam) {
      this.activeFilters.search = qParam;
      if (headerInput) headerInput.value = qParam;
      if (localSearchInput) localSearchInput.value = qParam;
      // CRUCIAL: aplica o filtro de busca para que o termo tenha efeito
      this.applyFilters();
    }
  }

  setFilter(key, value, activatedElement) {
    this.activeFilters[key] = value;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allProducts];

    // Filtro de categoria
    if (this.activeFilters.category !== 'all') {
      result = result.filter(p => {
        const cat = (p.categoria_nome || p.categoria || '').toLowerCase();
        return cat.includes(this.activeFilters.category.toLowerCase());
      });
    }

    // Filtro de marca
    if (this.activeFilters.brand !== 'all') {
      result = result.filter(p => {
        const brand = p.marca_nome || p.marca || '';
        return brand === this.activeFilters.brand;
      });
    }

    // Filtro de estilo
    if (this.activeFilters.style !== 'all') {
      result = result.filter(p => {
        const style = (p.estilo_nome || p.estilo || '').toLowerCase();
        return style.includes(this.activeFilters.style.toLowerCase());
      });
    }

    // Filtro de status (disponibilidade)
    // Suporta tanto valores numéricos ('1'/'0') quanto string ('disponivel'/'esgotado'/'indisponivel')
    if (this.activeFilters.status !== 'all') {
      const s = this.activeFilters.status;
      const querDisponivel = (s === '1' || s === 'disponivel');
      result = result.filter(p => {
        // Usa o flag 'disponivel' computado pelo backend (boolean) se existir;
        // fallback para lógica legada de status_venda + estoque
        const disponivel = (typeof p.disponivel === 'boolean')
          ? p.disponivel
          : (p.status_venda == 1 && (p.estoque_disponivel > 0 || p.qtd_disponivel > 0));
        return querDisponivel ? disponivel : !disponivel;
      });
    }

    // Filtro de gênero (baseado na categoria, pois 'genero' não existe como campo)
    if (this.activeFilters.gender !== 'all') {
      const genderFilter = this.activeFilters.gender.toLowerCase();
      result = result.filter(p => {
        const cat = (p.categoria_nome || p.categoria || '').toLowerCase();
        return cat.includes(genderFilter) || cat.includes('unissex');
      });
    }

    // Filtro de modo (masculino/feminino) aplicado automaticamente pela página
    if (this.config.mode === 'masculino') {
      result = result.filter(p => {
        const cat = (p.categoria_nome || p.categoria || '').toLowerCase();
        return cat.includes('masculino') || cat.includes('unissex');
      });
    } else if (this.config.mode === 'feminino') {
      result = result.filter(p => {
        const cat = (p.categoria_nome || p.categoria || '').toLowerCase();
        return cat.includes('feminino') || cat.includes('unissex');
      });
    }

    // Filtro de tamanho — verifica nos SKUs disponíveis
    if (this.activeFilters.size !== 'all') {
      result = result.filter(p => {
        const tamanhos = (p.tamanhos || '').split(',').map(t => t.trim());
        return tamanhos.includes(this.activeFilters.size);
      });
    }

    // Filtro de preço
    result = result.filter(p => {
      const price = parseFloat(p.valor_diaria || 0);
      return price <= this.activeFilters.maxPrice;
    });

    // Filtro de busca textual
    if (this.activeFilters.search) {
      const query = this.activeFilters.search.toLowerCase();
      result = result.filter(p => {
        return (
          (p.nome || '').toLowerCase().includes(query) ||
          (p.marca_nome || p.marca || '').toLowerCase().includes(query) ||
          (p.descricao || '').toLowerCase().includes(query) ||
          (p.categoria_nome || p.categoria || '').toLowerCase().includes(query) ||
          (p.sku || '').toLowerCase().includes(query)
        );
      });
    }

    // Ordenação
    if (this.activeFilters.order === 'menor-preco') {
      result.sort((a, b) => parseFloat(a.valor_diaria) - parseFloat(b.valor_diaria));
    } else if (this.activeFilters.order === 'maior-preco') {
      result.sort((a, b) => parseFloat(b.valor_diaria) - parseFloat(a.valor_diaria));
    } else {
      // Mais recentes (padrão)
      result.sort((a, b) => b.id - a.id);
    }

    this.filteredProducts = result;
    this.render();
    this.updateCounter();
  }

  clearAllFilters() {
    this.activeFilters = {
      category: 'all',
      brand: 'all',
      style: 'all',
      status: 'all',
      gender: 'all',
      size: 'all',
      maxPrice: 99999,
      search: '',
      order: 'recentes'
    };

    // Reset visual dos filtros
    document.querySelectorAll('.filter-options li, .masc-filter-options li, .fem-filter-options li').forEach(li => {
      li.classList.remove('active');
      if (li.dataset.value === 'all') li.classList.add('active');
    });

    // Reset price sliders
    document.querySelectorAll('#price-slider, #masc-price-slider, #fem-price-slider').forEach(slider => {
      if (slider && slider.max) slider.value = slider.max;
    });
    document.querySelectorAll('#price-max-display, #masc-price-display, #fem-price-display').forEach(el => {
      if (el) el.textContent = 'R$ 5.000';
    });

    // Reset search inputs
    document.querySelectorAll('#arqon-search-input, #local-search-input').forEach(input => {
      input.value = '';
    });

    this.applyFilters();
  }

  updateCounter() {
    const counterEl = document.getElementById('masc-counter') || 
                      document.getElementById('fem-counter') ||
                      document.getElementById('catalog-counter');
    if (counterEl) {
      const total = this.filteredProducts.length;
      counterEl.textContent = `${total} artefato${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    }
  }

  render() {
    const container = document.getElementById(this.config.containerId);
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="vault-empty-state" style="grid-column: 1/-1; text-align:center; padding: 60px 20px;">
          <i class="fas fa-search" style="font-size: 40px; color: var(--color-gold); margin-bottom: 20px;"></i>
          <h3 style="color: #fff; letter-spacing: 2px; margin-bottom: 10px;">NENHUM ARTEFATO ENCONTRADO</h3>
          <p style="color: var(--text-muted);">Tente ajustar os filtros ou ampliar a busca.</p>
          <button onclick="window.arqonCatalog.clearAllFilters()" style="margin-top: 20px; padding: 10px 24px; background: var(--color-gold); border: none; color: #000; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 2px; cursor: pointer; border-radius: 4px;">LIMPAR FILTROS</button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProducts.map(p => this.renderCard(p)).join('');
    
    // Anima cards ao entrar
    requestAnimationFrame(() => {
      container.querySelectorAll('.arqon-product-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
        card.classList.add('card-enter');
      });
    });
  }

  renderCard(produto) {
    let foto = produto.foto_url || produto.foto_principal_url || 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
    
    // Add prefix for relative paths
    if (foto && !foto.startsWith('http') && !foto.startsWith('/') && !foto.startsWith('https://placehold.co')) {
      foto = `/public/uploads/${foto}`;
    }
    
    const nome = produto.nome || 'Sem nome';
    const marca = produto.marca_nome || produto.marca || '';
    const preco = parseFloat(produto.valor_diaria || 0);
    const disponivel = produto.status_venda == 1 && (produto.estoque_disponivel > 0 || produto.qtd_disponivel > 0 || produto.estoque_disponivel === undefined);
    
    // Calcula badge de estoque limitado (característico de luxo)
    const estoqueTotal = parseInt(produto.qtd_estoque || produto.estoque_total || 0);
    const estoqueDisp = parseInt(produto.estoque_disponivel || produto.qtd_disponivel || estoqueTotal);
    
    let stockBadge = '';
    if (disponivel) {
      if (estoqueDisp <= 2) {
        stockBadge = `<span class="stock-badge ultra-rare">ÚLTIMA UNIDADE</span>`;
      } else if (estoqueDisp <= 5) {
        stockBadge = `<span class="stock-badge rare">POUCAS UNIDADES</span>`;
      }
    }

    // Tamanhos disponíveis como indicadores
    const tamanhos = (produto.tamanhos || '').split(',').map(t => t.trim()).filter(Boolean);
    const tamanhosHtml = tamanhos.length > 0 ? `
      <div class="card-sizes">
        ${tamanhos.slice(0, 5).map(tam => {
          // Verifica disponibilidade por tamanho baseado nos SKUs
          const tamDisp = produto.tamanhos_disponiveis ? 
            produto.tamanhos_disponiveis.includes(tam) : disponivel;
          return `<span class="size-dot ${tamDisp ? 'available' : 'unavailable'}">${tam}</span>`;
        }).join('')}
        ${tamanhos.length > 5 ? `<span class="size-dot more">+${tamanhos.length - 5}</span>` : ''}
      </div>
    ` : '';

    const statusClass = disponivel ? 'status-available' : 'status-rented';
    const statusText = disponivel ? 'Disponível' : 'Em Custódia';

    return `
      <div class="arqon-product-card ${!disponivel ? 'card-unavailable' : ''}" onclick="window.location.href='produto.html?id=${produto.id}'">
        <div class="card-image-wrap">
          <img src="${foto}" alt="${nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500/0a0107/dcb23c?text=ARQON'">
          <div class="card-overlay">
            <button class="btn-quick-view" onclick="event.stopPropagation(); window.location.href='produto.html?id=${produto.id}'">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-wishlist-card" onclick="event.stopPropagation(); toggleWishlist(${produto.id}, this)">
              <i class="far fa-heart"></i>
            </button>
          </div>
          <div class="card-status-bar ${statusClass}">
            <i class="fas fa-circle"></i>
            <span>${statusText}</span>
          </div>
        </div>

        <div class="card-badges">
          ${stockBadge}
          ${produto.is_new ? '<span class="stock-badge new-badge">NEW DROP</span>' : ''}
        </div>

        <div class="card-body">
          <div class="card-brand">${marca}</div>
          <h3 class="card-name">${nome}</h3>
          ${tamanhosHtml}

          <div class="card-footer">
            <div class="card-price">
              <span class="price-value">R$ ${preco.toFixed(2).replace('.', ',')}</span>
              <span class="price-period">/diária</span>
            </div>
            ${disponivel ? `
              <button class="btn-add-cart" onclick="event.stopPropagation(); adicionarAoCarrinho(${produto.id})">
                <i class="fas fa-plus"></i>
              </button>
            ` : `
              <button class="btn-notify" onclick="event.stopPropagation(); arqonToast('Artefato em custódia', 'info')">
                <i class="fas fa-bell"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }
}

// Instância global
window.arqonCatalog = null;

// ============================================================
// HANDLERS GLOBAIS DOS CARDS (carrinho + wishlist)
// Referenciados pelo HTML gerado em renderCard()
// ============================================================
window.adicionarAoCarrinho = function (id) {
  const engine = window.arqonCatalog;
  const produto = engine && engine.allProducts
    ? engine.allProducts.find(p => String(p.id) === String(id))
    : null;

  if (!produto) {
    if (typeof window.arqonToast === 'function') {
      window.arqonToast('Não foi possível localizar o artefato.', 'error');
    }
    return;
  }

  let foto = produto.foto_url;
  if (typeof window.arqonImageUrl === 'function') {
    foto = window.arqonImageUrl(foto);
  }

  const categoria = produto.categoria_nome || produto.categoria || '';
  const tamanhos = (produto.tamanhos || '').split(',').map(t => t.trim()).filter(Boolean);
  const tamanho = tamanhos[0] || 'U';

  if (typeof window.adicionarAoCofre === 'function') {
    window.adicionarAoCofre(produto.id, produto.nome, produto.valor_diaria, foto, categoria, tamanho);
    if (typeof window.arqonToast === 'function') {
      window.arqonToast(`${produto.nome} guardado no cofre.`, 'success');
    }
  } else {
    console.warn('[ARQON] Sistema de carrinho não inicializado.');
  }
};

window.toggleWishlist = function (id, btn) {
  const token = localStorage.getItem('arqon_token');
  const apiBase = window.ARQON_API_BASE || '/api';

  const aplicarVisual = (ativo) => {
    if (!btn) return;
    const icon = btn.querySelector('i');
    btn.classList.toggle('active', ativo);
    if (icon) {
      icon.classList.toggle('far', !ativo);
      icon.classList.toggle('fas', ativo);
    }
  };

  // Sem login: persiste localmente
  if (!token) {
    let favoritos = JSON.parse(localStorage.getItem('arqon_vault_wishlist')) || [];
    const index = favoritos.findIndex(f => String(f) === String(id));
    let ativo;
    if (index === -1) { favoritos.push(id); ativo = true; }
    else { favoritos.splice(index, 1); ativo = false; }
    localStorage.setItem('arqon_vault_wishlist', JSON.stringify(favoritos));
    aplicarVisual(ativo);
    if (typeof window.arqonToast === 'function') {
      window.arqonToast(ativo ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', 'info');
    }
    return;
  }

  // Logado: sincroniza com a API
  if (btn) btn.disabled = true;
  fetch(`${apiBase}/wishlist/verificar?id_produto=${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(result => {
      if (result.status === 'success' && result.na_wishlist) {
        return fetch(`${apiBase}/wishlist?id_produto=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(() => aplicarVisual(false));
      }
      return fetch(`${apiBase}/wishlist`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_produto: id })
      }).then(() => aplicarVisual(true));
    })
    .catch(error => console.error('[ARQON WISHLIST] Erro:', error))
    .finally(() => { if (btn) btn.disabled = false; });
};

// CSS para os cards — injetado dinamicamente
const CARD_STYLES = `
  /* ===== ARQON PRODUCT CARDS ===== */
  @keyframes cardEnter {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  .card-enter {
    animation: cardEnter 0.4s ease forwards;
    opacity: 0;
  }

  .arqon-skeleton-card {
    background: var(--color-surface, #0E081A);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(231, 185, 63, 0.08);
  }
  .skel-img { height: 320px; background: linear-gradient(90deg, #1a1025 25%, #251838 50%, #1a1025 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  .skel-body { padding: 16px; }
  .skel-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #1a1025 25%, #251838 50%, #1a1025 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 10px; }
  .skel-line.short { width: 40%; }
  .skel-line.medium { width: 70%; }
  .skel-line.long { width: 90%; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  .arqon-product-card {
    position: relative;
    background: var(--color-surface, #0E081A);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(231, 185, 63, 0.08);
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .arqon-product-card:hover {
    transform: translateY(-6px);
    border-color: rgba(231, 185, 63, 0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(231,185,63,0.08);
  }
  .arqon-product-card.card-unavailable { opacity: 0.7; }

  .card-image-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/4;
    background: #0d0920;
  }
  .card-image-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .arqon-product-card:hover .card-image-wrap img { transform: scale(1.07); }

  .card-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center; gap: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .arqon-product-card:hover .card-overlay { opacity: 1; }

  .btn-quick-view, .btn-wishlist-card {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(231,185,63,0.4);
    color: var(--color-gold, #E7B93F);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
  }
  .btn-quick-view:hover, .btn-wishlist-card:hover {
    background: var(--color-gold, #E7B93F);
    color: #000;
    transform: scale(1.1);
  }
  .btn-wishlist-card.active { background: #e74c3c; border-color: #e74c3c; color: #fff; }

  .card-badges {
    position: absolute; top: 12px; left: 12px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .stock-badge {
    padding: 3px 8px;
    font-size: 0.6rem;
    letter-spacing: 1.5px;
    font-weight: 700;
    border-radius: 3px;
    text-transform: uppercase;
  }
  .stock-badge.ultra-rare { background: #e74c3c; color: #fff; }
  .stock-badge.rare { background: rgba(231,185,63,0.9); color: #000; }
  .stock-badge.new-badge { background: rgba(100,24,56,0.9); color: var(--color-gold, #E7B93F); border: 1px solid var(--color-gold,#E7B93F); }

  .card-status-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 5px 12px;
    font-size: 0.65rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
  }
  .card-status-bar.status-available {
    background: rgba(76,175,80,0.15);
    color: #4caf50;
    border-top: 1px solid rgba(76,175,80,0.2);
  }
  .card-status-bar.status-rented {
    background: rgba(244,67,54,0.1);
    color: #f44336;
    border-top: 1px solid rgba(244,67,54,0.2);
  }
  .card-status-bar i { font-size: 0.45rem; }

  .card-body { padding: 16px; }
  .card-brand { font-size: 0.7rem; color: var(--color-gold, #E7B93F); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .card-name { font-size: 0.95rem; color: #fff; font-weight: 500; margin-bottom: 10px; line-height: 1.3; }

  .card-sizes {
    display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px;
  }
  .size-dot {
    padding: 2px 7px;
    font-size: 0.65rem;
    border-radius: 3px;
    border: 1px solid;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .size-dot.available { border-color: rgba(231,185,63,0.4); color: var(--color-gold, #E7B93F); background: rgba(231,185,63,0.05); }
  .size-dot.unavailable { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.25); background: transparent; text-decoration: line-through; }
  .size-dot.more { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.4); }

  .card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .card-price { display: flex; flex-direction: column; }
  .price-value { font-size: 1rem; font-weight: 700; color: var(--color-gold, #E7B93F); }
  .price-period { font-size: 0.65rem; color: var(--text-muted, #A0A0A0); letter-spacing: 1px; }

  .btn-add-cart, .btn-notify {
    width: 40px; height: 40px;
    border-radius: 8px;
    border: 1px solid;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    font-size: 0.85rem;
  }
  .btn-add-cart {
    background: rgba(231,185,63,0.15);
    border-color: rgba(231,185,63,0.4);
    color: var(--color-gold, #E7B93F);
  }
  .btn-add-cart:hover {
    background: var(--color-gold, #E7B93F);
    color: #000;
    transform: scale(1.05);
  }
  .btn-notify {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
  }
  .btn-notify:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
`;

// Injeta CSS
if (!document.getElementById('arqon-card-styles')) {
  const style = document.createElement('style');
  style.id = 'arqon-card-styles';
  style.textContent = CARD_STYLES;
  document.head.appendChild(style);
}