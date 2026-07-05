/* ============================================================
   PROJECTS.JS — Lógica da página de projetos
   Cursor, partículas, progresso, scroll reveal, contadores,
   dados dos projetos (PROJECTS), render dos cards, modal e filtro.

   ── COMO EDITAR UM PROJETO ──────────────────────────────────
   Cada item de PROJECTS aceita:
     id        : identificador único (string) — deve bater com a
                 pasta em projetos/<id>/ para o botão VISUALIZAR.
     title     : título do projeto
     category  : 'backend' | 'embedded' | 'automation' | 'web'
     categoryLabel : rótulo exibido (ex.: 'Backend')
     color     : 'c1'..'c6' (cor de destaque)
     featured  : true para mostrar o selo ⭐ DESTAQUE
     cover     : caminho da foto de capa do card
     gallery   : até 6 fotos -> ['assets/.../1.jpg', ...]
     video     : (opcional) .mp4 OU URL de YouTube/Vimeo (embed)
     desc      : descrição curta (card)
     longDesc  : descrição completa (modal). Use \n para parágrafos.
     tags      : array de tecnologias
     github    : URL do repositório (ou '' para esconder)
     demo      : URL do demo ao vivo (ou '' para esconder)
     live      : true  -> botão VISUALIZAR abre projetos/<id>/
                 false -> esconde o botão
                 string -> caminho/URL custom
============================================================ */
(function () {
  'use strict';

  Utils.initPage();

  /* ── ANIMATED COUNTERS ─────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statObs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const dur = 2000; const t0 = performance.now();
        const tick = function(now) {
          const elapsed = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (elapsed < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
        statObs.unobserve(el);
      }
    }
  }, { threshold: 0.5 });
  statNums.forEach(el => statObs.observe(el));

  /* ── PROJECTS DATA ─────────────────────────────────────── */
  const PROJECTS = [
    {
      id: 'arqon',
      title: 'ARQON — THE VAULT',
      category: 'fullstack', categoryLabel: 'Fullstack', color: 'c3', featured: true,
      cover: 'projetos/PROJETO-ARQUON/capturas/home.png',
      gallery: [
        'projetos/PROJETO-ARQUON/capturas/home.png',
        'projetos/PROJETO-ARQUON/capturas/catalogo.png',
        'projetos/PROJETO-ARQUON/capturas/produto.png',
        'projetos/PROJETO-ARQUON/capturas/admin-dashboard.png',
        'projetos/PROJETO-ARQUON/capturas/perfil.png',
        'projetos/PROJETO-ARQUON/capturas/login.png'
      ],
      video: '',
      desc: 'Plataforma full-stack de locação de roupas e artefatos de luxo. PHP 8.2 MVC, MySQL, API RESTful com 80+ rotas, JWT e Argon2id.',
      longDesc: 'ARQON — THE VAULT é uma plataforma web completa de locação de roupas e artefatos de luxo.\n\nFull-stack monolítico sem frameworks pesados: back-end em PHP 8.2 puro em arquitetura MVC com roteador central e API RESTful (80+ endpoints), front-end em HTML5 + CSS3 + JS ES6+ com componentes modulares carregados via fetch (navegação SPA-like).\n\nDestaques: autenticação JWT (HS256) com refresh token e blacklist, hash Argon2id, rate limiting anti brute-force, CORS controlado, 5 níveis de acesso, painel administrativo com Chart.js, mapa logístico com Leaflet, corte de imagem com Cropper.js, tema dinâmico global com 8 presets e banco MySQL com 30+ tabelas em 7 módulos.',
      tags: ['PHP 8.2','MySQL','PDO','JWT','Argon2id','Chart.js','Leaflet'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: 'projetos/PROJETO-ARQUON/public/index.html'
    },
    {
      id: 'saas-multiempresa',
      title: 'PLATAFORMA SAAS MULTIEMPRESA',
      category: 'fullstack', categoryLabel: 'Fullstack', color: 'c6', featured: true,
      cover: '',
      gallery: [],
      video: '',
      desc: 'SaaS multi-tenant com isolamento por empresa, assinaturas recorrentes e painel de gestão por cliente.',
      longDesc: '🚧 Em desenvolvimento.\n\nPlataforma SaaS multiempresa (multi-tenant) com isolamento de dados por cliente, planos de assinatura recorrente, billing, gestão de usuários por organização e dashboard administrativo. Foco em escalabilidade e segurança.',
      tags: ['Multi-tenant','Assinaturas','Billing','Backend'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'investigacao',
      title: 'SISTEMA DE INVESTIGAÇÃO CRIMINAL',
      category: 'fullstack', categoryLabel: 'Fullstack', color: 'c5', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Gestão de casos, evidências e suspeitos com relacionamentos, linha do tempo e controle de acesso.',
      longDesc: '🚧 Em desenvolvimento.\n\nSistema para gestão de investigações: cadastro de casos, evidências e suspeitos, vínculos entre entidades, linha do tempo dos acontecimentos, anexos e níveis de acesso por papel.',
      tags: ['Casos','Evidências','Suspeitos','Fullstack'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'tcc-senai',
      title: 'TCC SENAI',
      category: 'fullstack', categoryLabel: 'Fullstack', color: 'c4', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Projeto de conclusão de curso — aplicação fullstack completa do conceito ao deploy.',
      longDesc: '🚧 Em desenvolvimento.\n\nProjeto de conclusão de curso no SENAI: aplicação fullstack do levantamento de requisitos à entrega, com back-end, banco de dados e interface web.',
      tags: ['Fullstack','Banco de Dados','SENAI'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'api-auth',
      title: 'API DE AUTENTICAÇÃO PROFISSIONAL',
      category: 'backend', categoryLabel: 'Backend', color: 'c1', featured: true,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Serviço de autenticação reutilizável com JWT, refresh token, rate limiting e blacklist.',
      longDesc: '🚧 Em desenvolvimento.\n\nAPI de autenticação pronta para produção: login/registro, JWT com refresh token, rotação e blacklist de tokens, rate limiting por IP, recuperação de senha e logs de acesso. Plug-and-play e configurável por variáveis de ambiente.',
      tags: ['JWT','Refresh Token','Rate Limiting','Backend'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'dashboard-financeiro',
      title: 'DASHBOARD DE GESTÃO FINANCEIRA',
      category: 'frontend', categoryLabel: 'Frontend', color: 'c2', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Painel financeiro com gráficos interativos, filtros avançados e tabelas dinâmicas.',
      longDesc: '🚧 Em desenvolvimento.\n\nDashboard de gestão financeira com visualização de receitas e despesas, gráficos interativos, filtros por período/categoria e tabelas com ordenação e exportação.',
      tags: ['Gráficos','Filtros','Tabelas','Dashboard'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'zenith',
      title: 'ZENITH',
      category: 'frontend', categoryLabel: 'Frontend', color: 'c2', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Interface com UI/UX avançada, animações fluidas e um dashboard rico em microinterações.',
      longDesc: '🚧 Em desenvolvimento.\n\nProjeto focado em UI/UX avançada: design system próprio, animações fluidas, microinterações e um dashboard moderno com foco em experiência do usuário.',
      tags: ['UI/UX','Animações','Dashboard','Design System'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'nene',
      title: 'PORTFÓLIO DE NENE',
      category: 'frontend', categoryLabel: 'Frontend', color: 'c1', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Portfólio pessoal em React + Next.js + Tailwind, com design moderno e performance otimizada.',
      longDesc: '🚧 Em desenvolvimento.\n\nPortfólio desenvolvido em React com Next.js e Tailwind CSS: componentes reutilizáveis, SSR/SSG para performance e SEO, design moderno e responsivo.',
      tags: ['React','Next.js','Tailwind'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'landing-modelos',
      title: 'LANDING PAGE — AGÊNCIA DE MODELOS',
      category: 'frontend', categoryLabel: 'Frontend', color: 'c5', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Landing page de alto impacto para agência de modelos, com design moderno e SEO.',
      longDesc: '🚧 Em desenvolvimento.\n\nLanding page para agência de modelos: design moderno e editorial, galeria de talentos, formulário de contato, otimização de SEO e performance.',
      tags: ['Design Moderno','SEO','Landing Page'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: '',
      live: false
    },
    {
      id: 'cosmos',
      title: 'PORTFÓLIO COSMOS',
      category: 'frontend', categoryLabel: 'Frontend', color: 'c2', featured: false,
      cover: '',
      gallery: [],
      video: '',
      desc: 'Este portfólio — galáxia interativa com Canvas 2D, motor de estrelas custom e efeito warp.',
      longDesc: 'Este próprio portfólio.\n\nGaláxia interativa com Canvas 2D, motor de estrelas custom, efeito warp de transição, cursor personalizado e áudio web. 100% vanilla JS, zero dependências externas.',
      tags: ['JavaScript','Canvas 2D','Web Audio','CSS'],
      github: 'https://github.com/Breno-J-Oliveira',
      demo: 'index.html',
      live: false
    }
  ];

  /* ── RENDER CARDS ──────────────────────────────────────── */
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  function coverHTML(p) {
    const initial = p.title.charAt(0);
    const inDev = p.id !== 'arqon';
    const overlay = inDev
      ? `<div class="dev-overlay"><span class="dev-overlay-tag">🚧 EM DESENVOLVIMENTO</span></div>`
      : '';
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%230a1628" width="400" height="300"/%3E%3C/svg%3E';
    const inner = p.cover
      ? `<img src="${placeholder}" data-src="${p.cover}" alt="${p.title}" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="project-cover-fallback" style="display:none;">${initial}</div>`
      : `<div class="project-cover-fallback">${initial}</div>`;
    return `
      <div class="project-cover${inDev ? ' is-dev' : ''}">
        ${inner}
        ${overlay}
      </div>`;
  }

  function cardHTML(p, i) {
    const delay = ['', 'reveal-delay-1', 'reveal-delay-2'][i % 3];
    const badge = p.featured && p.id === 'arqon'
      ? '<div class="featured-badge">⭐ DESTAQUE</div>'
      : '';
    const tags = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    return `
      <div class="project-card clickable ${p.color} reveal ${delay}" data-category="${p.category}" data-id="${p.id}" data-tags="${(p.tags || []).join(' ').toLowerCase()}">
        ${badge}
        ${coverHTML(p)}
        <div class="project-category">${p.categoryLabel}</div>
        <div class="project-name">${p.title}</div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-open-hint">ABRIR PROJETO <span>→</span></div>
      </div>`;
  }

  function renderCards() {
    grid.innerHTML = PROJECTS.map((p, i) => cardHTML(p, i)).join('');
    if (Utils.revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => Utils.revealObserver.observe(el));
    }
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
      card.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }
  renderCards();

  /* ── LAZY LOAD IMAGES ──────────────────────────────────── */
  var imgObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        imgObs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  grid.querySelectorAll('img[data-src]').forEach(function(img) { imgObs.observe(img); });

  /* ── MODAL ─────────────────────────────────────────────── */
  let modal, modalBox, modalMedia, modalThumbs, modalCat, modalTitle, modalDesc, modalTags, modalActions;

  function initModal() {
    var existing = document.getElementById('project-modal');
    if (existing) { setupModal(existing); return; }

    var obs = new MutationObserver(function() {
      var modalEl = document.getElementById('project-modal');
      if (modalEl) {
        obs.disconnect();
        setupModal(modalEl);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
      obs.disconnect();
      if (!document.getElementById('project-modal')) {
        console.error('Modal não foi injetado em 5s — verifique o fetch de modal.html em projects.html');
      }
    }, 5000);
  }

  function setupModal(modalEl) {
    modal       = modalEl;
    modalBox    = document.getElementById('modal-box');
    modalMedia  = document.getElementById('modal-media');
    modalThumbs = document.getElementById('modal-thumbs');
    modalCat    = document.getElementById('modal-cat');
    modalTitle  = document.getElementById('modal-title');
    modalDesc   = document.getElementById('modal-desc');
    modalTags   = document.getElementById('modal-tags');
    modalActions = document.getElementById('modal-actions');

    if (!modal) return;

    modalMedia.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (img && img.src) openLightbox(img.src, img.alt);
    });

    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }
  initModal();

  function isYouTube(url) { return /youtube\.com|youtu\.be|vimeo\.com/.test(url); }

  function mediaImageHTML(src, alt) {
    return `<img src="${src}" alt="${alt}" onerror="this.style.display='none'; this.parentElement.querySelector('.modal-media-fallback').style.display='flex';" />
            <div class="modal-media-fallback" style="display:none;">✦</div>`;
  }
  function mediaVideoHTML(video) {
    if (isYouTube(video)) {
      return `<iframe src="${video}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <div class="video-badge">▶ Vídeo</div>`;
    }
    return `<video src="${video}" controls></video><div class="video-badge">▶ Vídeo</div>`;
  }

  function setMainMedia(p, type, src) {
    if (type === 'video') {
      modalMedia.innerHTML = mediaVideoHTML(src);
    } else {
      modalMedia.innerHTML = mediaImageHTML(src, p.title);
    }
  }

  function openModal(id) {
    if (!modal) return;
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;

    modalBox.className = 'modal-box ' + p.color;
    modalCat.textContent = p.categoryLabel;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.longDesc || p.desc;
    modalTags.innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

    let actions = '';
    if (p.live !== false) {
      const liveUrl = (typeof p.live === 'string' && p.live) ? p.live : `projetos/${p.id}/`;
      actions += `<a class="modal-btn featured" href="${liveUrl}" target="_blank" rel="noopener"><span>VISUALIZAR</span><span>↗</span></a>`;
    }
    if (p.demo)   actions += `<a class="modal-btn" href="${p.demo}" ${p.demo.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><span>VER AO VIVO</span><span>→</span></a>`;
    if (p.github) actions += `<a class="modal-btn" href="${p.github}" target="_blank" rel="noopener"><span>VER NO GITHUB</span><span>↗</span></a>`;
    modalActions.innerHTML = actions || '<span class="modal-tag">Em breve mais detalhes</span>';

    const medias = [];
    if (p.video) medias.push({ type: 'video', src: p.video });
    (p.gallery || []).slice(0, 6).forEach(src => medias.push({ type: 'image', src }));

    if (medias.length === 0) {
      modalMedia.innerHTML = `<div class="modal-media-fallback">${p.title.charAt(0)}</div>`;
      modalThumbs.style.display = 'none';
    } else {
      modalThumbs.style.display = 'flex';
      setMainMedia(p, medias[0].type, medias[0].src);
      modalThumbs.innerHTML = medias.map((m, i) => {
        const cls = 'modal-thumb' + (i === 0 ? ' active' : '') + (m.type === 'video' ? ' video-thumb' : '');
        const thumbImg = m.type === 'video'
          ? (isYouTube(m.src) ? '' : `<video src="${m.src}#t=0.5" muted></video>`)
          : `<img src="${m.src}" alt="" onerror="this.style.opacity=0;" />`;
        return `<div class="${cls}" data-index="${i}">${thumbImg}</div>`;
      }).join('');

      modalThumbs.querySelectorAll('.modal-thumb').forEach(th => {
        th.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
        th.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
        th.addEventListener('click', () => {
          const idx = parseInt(th.dataset.index);
          modalThumbs.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
          setMainMedia(p, medias[idx].type, medias[idx].src);
        });
      });
    }

    modal.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalMedia.innerHTML = '';
  }

  /* ── LIGHTBOX ──────────────────────────────────────────── */
  function openLightbox(imgSrc, imgAlt) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    lb.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}" style="max-width:95vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 0 40px rgba(0,255,255,0.2);">`;
    lb.addEventListener('click', () => lb.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); }
    });
    document.body.appendChild(lb);
  }

  let currentModalIndex = -1;
  document.addEventListener('keydown', e => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (currentModalIndex === -1) return;
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      currentModalIndex = (currentModalIndex + dir + PROJECTS.length) % PROJECTS.length;
      openModal(PROJECTS[currentModalIndex].id);
    }
  });

  const origOpenModal = openModal;
  openModal = function(id) {
    currentModalIndex = PROJECTS.findIndex(p => p.id === id);
    origOpenModal(id);
  };

  /* ── FILTER ────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  let activeCategory = 'all';
  let activeFilters = new Set();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  const searchInput = document.getElementById('search-projects');
  searchInput?.addEventListener('input', applyFilters);

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase();
    grid.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.category;
      const tags = card.dataset.tags || '';
      const title = (card.querySelector('.project-name')?.textContent || '').toLowerCase();
      const matchCat = activeCategory === 'all' || cat === activeCategory;
      const matchText = !query || tags.includes(query) || title.includes(query);
      const matchTags = activeFilters.size === 0 || [...activeFilters].every(t => tags.includes(t.toLowerCase()));
      card.classList.toggle('hidden', !(matchCat && matchText && matchTags));
    });
  }
})();
