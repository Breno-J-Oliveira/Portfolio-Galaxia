/**
 * ARQON — THE VAULT | HOME ENGINE 2026 (home-engine.js)
 * Alimenta o redesign da Home (.vh-home) com dados reais da API.
 * Seções: stats do hero, marquee de marcas, new drop, bento de categorias,
 * limited collection, sustentabilidade, newsletter, reveal.
 */
(function () {
  const API = window.ARQON_API_BASE || '/api';
  const img = (p) => {
    if (!p) return 'https://placehold.co/600x800/0a0107/dcb23c?text=ARQON';
    let foto = '';
    if (typeof p === 'object') {
        foto = p.foto_url || p.foto_principal_url || p.imagem_url || '';
    } else if (typeof p === 'string') {
        foto = p;
    }
    foto = foto || 'https://placehold.co/600x800/0a0107/dcb23c?text=ARQON';
    if (foto && !foto.startsWith('http') && !foto.startsWith('data:') && !foto.startsWith('https://placehold.co')) {
      foto = `/public/uploads/${foto}`;
    }
    return foto;
  };
  const PLACEHOLDER = 'https://placehold.co/600x800/0a0107/dcb23c?text=ARQON';

  const money = (v) =>
    Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let CACHE_PRODUTOS = null;

  async function getProdutos() {
    if (CACHE_PRODUTOS) return CACHE_PRODUTOS;
    try {
      const res = await fetch(`${API}/produtos?limit=200`);
      const data = await res.json();
      const lista = data.produtos || data.data || [];
      CACHE_PRODUTOS = Array.isArray(lista) ? lista.filter(p => p && typeof p === 'object' && p.id) : [];
    } catch (e) {
      console.error('[ARQON HOME] produtos:', e);
      CACHE_PRODUTOS = [];
    }
    return CACHE_PRODUTOS;
  }

  // ==================== CONTADORES ANIMADOS ====================
  function animateCounter(el, target, suffix = '') {
    const dur = 1800, start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  async function initStats() {
    const elTotal = document.getElementById('stat-total');
    const elDisp = document.getElementById('stat-disponiveis');
    const elMarcas = document.getElementById('stat-marcas');
    if (!elTotal && !elDisp && !elMarcas) return;
    try {
      const res = await fetch(`${API}/estoque/stats`);
      const d = (await res.json()).data || {};
      if (elTotal) animateCounter(elTotal, d.total || 0);
      if (elDisp) animateCounter(elDisp, d.disponiveis || 0);
      if (elMarcas) animateCounter(elMarcas, d.marcas || 0);
    } catch (e) {
      if (elTotal) elTotal.textContent = '10';
      if (elDisp) elDisp.textContent = '10';
      if (elMarcas) elMarcas.textContent = '5';
    }
  }

  // Contadores com data-target (sustentabilidade) via observer
  function initDataCounters() {
    const nodes = document.querySelectorAll('.vh-sustain-stat .num[data-target]');
    if (!nodes.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        animateCounter(el, parseInt(el.dataset.target, 10), el.dataset.suffix || '');
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    nodes.forEach((n) => obs.observe(n));
  }

  // ==================== MARQUEE ====================
  async function initMarquee() {
    const track = document.getElementById('vh-marquee-track');
    if (!track) return;
    try {
      const res = await fetch(`${API}/marcas`);
      const data = await res.json();
      const marcas = Array.isArray(data) ? data : (data.data || data.marcas || []);
      if (marcas.length >= 3) {
        const html = ['ARQON', ...marcas.map((m) => m.nome)]
          .map((n) => `<span>${n}</span>`).join('');
        track.innerHTML = html;
      }
    } catch (e) { /* mantém estático */ }
    // Duplica para loop infinito contínuo
    if (!p) return '';
    track.innerHTML = erHTML + track.innerHTML;
  }

  // ==================== NEW DROP (SLIDER) ====================
  function productCard(p) {
    const foto = img(p.foto_url);
    const marca = p.marca_nome || p.marca || 'ARCHIVE';
    const disp = (typeof p.disponivel === 'boolean') ? p.disponivel
      : (p.status_venda == 1 && (p.estoque_disponivel > 0 || p.qtd_disponivel > 0));
    const qtdDisp = parseInt(p.qtd_disponivel ?? p.estoque_disponivel ?? 0, 10);

    // Badges de escassez (luxo)
    let badge = '';
    let statusOverlay = '';
    if (!disp) {
      badge = `<span class="vh-pc-badge" style="background:rgba(244,67,54,.9);color:#fff;">EM CUSTÓDIA</span>`;
      statusOverlay = `<div class="vh-pc-custody"><span>EM CUSTÓDIA</span></div>`;
    } else if (qtdDisp === 1) {
      badge = `<span class="vh-pc-badge" style="background:#e74c3c;color:#fff;">ÚLTIMA UNIDADE</span>`;
    } else if (qtdDisp <= 3) {
      badge = `<span class="vh-pc-badge" style="background:rgba(231,185,63,.9);color:#1a0d05;">POUCAS UNIDADES</span>`;
    }

    // Tamanhos disponíveis como dots
    const tams = p.tamanhos_disponiveis || ((p.tamanhos || '').split(',').map(t => t.trim()).filter(Boolean));
    const tamanhosHtml = tams.length ? `
      <div class="vh-pc-sizes">
        ${tams.slice(0, 5).map(t => `<span class="vh-pc-size">${t}</span>`).join('')}
        ${tams.length > 5 ? `<span class="vh-pc-size">+${tams.length - 5}</span>` : ''}
      </div>` : '';

    return `
      <article class="vh-product-card ${!disp ? 'vh-pc-unavailable' : ''}" onclick="window.location.href='produto.html?id=${p.id}'">
        <div class="vh-pc-img">
          <img src="${foto}" alt="${p.nome}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
          ${badge}
          ${statusOverlay}
        </div>
        <div class="vh-pc-body">
          <span class="vh-pc-brand">${marca}</span>
          <h3 class="vh-pc-name">${p.nome}</h3>
          ${tamanhosHtml}
          <div class="vh-pc-foot">
            <span class="vh-pc-price">R$ ${money(p.valor_diaria)} <small>/dia</small></span>
            <i class="fa-solid fa-arrow-right-long" style="color:var(--vh-gold)"></i>
          </div>
        </div>
      </article>`;
  }

  async function initNewDrops() {
    const track = document.getElementById('vh-newdrop-track');
    if (!track) {
      console.log('[HOME] New Drop track não encontrado');
      return;
    }
    const produtos = (await getProdutos()).slice().sort((a, b) => b.id - a.id).slice(0, 10);
    console.log('[HOME] New Drop - produtos carregados:', produtos.length);
    if (!produtos.length) {
      console.log('[HOME] New Drop - nenhum produto encontrado');
      track.innerHTML = '<p style="color: var(--color-text); padding: 20px;">Nenhum produto disponível</p>';
      return;
    }
    track.innerHTML = produtos.map(productCard).join('');
    console.log('[HOME] New Drop - renderizado com sucesso');

    const prev = document.getElementById('drop-prev');
    const next = document.getElementById('drop-next');
    const step = 324;
    let pos = 0;
    const maxPos = () => Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    const apply = () => { track.style.transform = `translateX(-${pos}px)`; };
    if (next) next.addEventListener('click', () => { pos = Math.min(pos + step * 2, maxPos()); apply(); });
    if (prev) prev.addEventListener('click', () => { pos = Math.max(pos - step * 2, 0); apply(); });

    // Touch / swipe support para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = track.parentElement;
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            pos = Math.min(pos + step * 2, maxPos());
          } else {
            pos = Math.max(pos - step * 2, 0);
          }
          apply();
        }
      }, { passive: true });
    }
  }

  // ==================== HEXAGON GALLERY ====================
  function hexCard(p) {
    const foto = img(p.foto_url);
    const marca = p.marca_nome || p.marca || 'ARCHIVE';
    const disp = (typeof p.disponivel === 'boolean') ? p.disponivel
      : (p.status_venda == 1 && (p.estoque_disponivel > 0 || p.qtd_disponivel > 0));

    return `
      <div class="hex" tabindex="0" role="button" onclick="window.location.href='produto.html?id=${p.id}'">
        <div class="hex-shape">
          <img src="${foto}" alt="${p.nome}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
          <div class="hex-caption">
            <h3>${p.nome}</h3>
            <p>${marca}</p>
          </div>
        </div>
      </div>`;
  }

  async function initHexGallery() {
    const grid = document.getElementById('vh-hex-grid');
    if (!grid) return;
    const produtos = (await getProdutos()).slice().sort((a, b) => b.id - a.id).slice(0, 14);
    if (!produtos.length) { grid.innerHTML = ''; return; }
    grid.innerHTML = produtos.map(hexCard).join('');
  }

  async function initHexVault() {
    const grid = document.getElementById('vh-hex-grid');
    if (!grid) return;
    const produtos = (await getProdutos()).slice().sort((a, b) => b.id - a.id).slice(0, 12);
    if (!produtos.length) { grid.innerHTML = ''; return; }
    grid.innerHTML = produtos.map(hexCard).join('');
  }

  // ==================== BENTO CATEGORIAS ====================
  async function initBento() {
    const grid = document.getElementById('vh-bento-grid');
    if (!grid) return;
    let categorias = [];
    try {
      const res = await fetch(`${API}/categorias`);
      const data = await res.json();
      categorias = Array.isArray(data) ? data : (data.data || []);
    } catch (e) { /* */ }
    if (!categorias.length) { grid.parentElement.parentElement.style.display = 'none'; return; }

    const produtos = await getProdutos();
    const fotoDaCategoria = (catNome) => {
      const p = produtos.find((x) => (x.categoria === catNome || x.categoria_nome === catNome) && x.foto_url);
      return p ? img(p.foto_url) : PLACEHOLDER;
    };

    const sizes = ['big', 'wide', '', '', 'wide', ''];
    grid.innerHTML = categorias.map((c, i) => `
      <a class="vh-bento-card ${sizes[i % sizes.length]}" href="catalogo.html?categoria=${encodeURIComponent(c.nome)}">
        <img src="${fotoDaCategoria(c.nome)}" alt="${c.nome}" loading="lazy" onerror="this.style.display='none'">
        <div class="vh-bento-label">
          <span class="cat">${c.nome}</span>
          <span class="go">Explorar &rarr;</span>
        </div>
      </a>`).join('');
  }

  // ==================== LIMITED COLLECTION ====================
  async function initLimited() {
    const grid = document.getElementById('vh-limited-grid');
    if (!grid) return;
    const produtos = (await getProdutos()).slice()
      .sort((a, b) => parseFloat(b.valor_mercado || 0) - parseFloat(a.valor_mercado || 0))
      .slice(0, 5);
    if (!produtos.length) { grid.parentElement.parentElement.style.display = 'none'; return; }
    grid.innerHTML = produtos.map((p, i) => `
      <a class="vh-limited-item ${i === 0 ? 'tall' : ''}" href="produto.html?id=${p.id}">
        <img src="${img(p.foto_url)}" alt="${p.nome}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
        <div class="vh-limited-cap">
          <span>${p.marca_nome || p.marca || 'ARQON'}</span>
          <h3>${p.nome}</h3>
          <span>R$ ${money(p.valor_diaria)} / dia</span>
        </div>
      </a>`).join('');
  }

  // ==================== COLEÇÕES ====================
  async function initColecoes() {
    const section = document.getElementById('vh-colecoes-section');
    const grid = document.getElementById('vh-colecoes-grid');
    if (!section || !grid) return;
    try {
      const res = await fetch(`${API}/colecoes`);
      const data = await res.json();
      const cols = data.data || [];
      if (!cols.length) { section.style.display = 'none'; return; }
      section.style.display = '';
      grid.innerHTML = cols.slice(0, 3).map(c => `
        <a class="vh-colecao-card" href="catalogo.html">
          <img src="${img(c.foto_url)}" alt="${c.nome}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
          <div class="vh-colecao-cap">
            <h3>${c.nome}</h3>
            <p>${c.descricao || ''}</p>
            <span class="vh-colecao-count">${(c.produtos || []).length} peças</span>
          </div>
        </a>`).join('');
    } catch (e) { section.style.display = 'none'; }
  }

  // ==================== HEX VAULT GALLERY ====================
  async function initHexGallery() {
    const grid = document.getElementById('vh-hex-grid');
    if (!grid) return;
    const produtos = (await getProdutos()).slice(0, 7);
    if (!produtos.length) { grid.innerHTML = ''; return; }
    grid.innerHTML = produtos.map((p, i) => `
      <div class="vh-hex-item ${i === 0 ? 'hex-large' : ''}" onclick="window.location.href='produto.html?id=${p.id}'">
        <div class="vh-hex-inner">
          <img src="${img(p.foto_url)}" alt="${p.nome}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
          <div class="vh-hex-overlay">
            <span class="vh-hex-brand">${p.marca_nome || p.marca || 'ARQON'}</span>
            <span class="vh-hex-name">${p.nome}</span>
          </div>
        </div>
      </div>`).join('');
  }

  // ==================== SCROLL REVEAL ====================
  function initReveal() {
    const els = document.querySelectorAll('.vh-reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => obs.observe(el));
  }

  // ==================== NEWSLETTER ====================
  function initNewsletter() {
    const form = document.getElementById('vh-news-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (typeof window.arqonToast === 'function') {
        window.arqonToast('Inscrição confirmada. Bem-vindo ao Vault.', 'success');
      }
      if (input) input.value = '';
    });
  }

  // ==================== INIT ====================
  function boot() {
    // Só roda na home
    if (!document.querySelector('.vh-home')) return;
    initStats();
    initDataCounters();
    initMarquee();
    initNewDrops();
    initBento();
    initLimited();
    initColecoes();
    initReveal();
    initNewsletter();
    console.log('[ARQON] Home Vault 2026 inicializada.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
