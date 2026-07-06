/* ============================================================
   ABOUT.JS — Lógica da página "Sobre"
   Usa Utils compartilhados + contadores, skill bars,
   smooth scroll, parallax, pills e section dots.
============================================================ */
(function () {
  'use strict';

  const D = window.PORTFOLIO_DATA || {};

  /* ── RENDER: SKILLS POR CATEGORIA ─────────────────────── */
  function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid || !D.skills) return;
    const labels = D.skillCategories || {};
    const order = ['frontend', 'backend', 'database', 'devops', 'security', 'languages'];
    grid.innerHTML = order.filter(k => D.skills[k]).map((key, i) => {
      const rows = D.skills[key].map(s => `
            <div class="skill-row">
              <div class="skill-row-head">
                <span class="skill-row-name">${s.name}</span>
                <span class="skill-row-pct">${s.level}%</span>
              </div>
              <div class="skill-bar-wrap"><div class="skill-bar" data-width="${s.level}"></div></div>
            </div>`).join('');
      return `
        <div class="skill-card reveal${i ? ' reveal-delay-' + Math.min(i, 3) : ''}">
          <div class="skill-cat">${labels[key] || key}</div>
          <div class="skill-rows">${rows}</div>
        </div>`;
    }).join('');
  }

  /* ── RENDER: TIMELINE ─────────────────────────────────── */
  function renderTimeline() {
    const wrap = document.getElementById('timeline-list');
    if (!wrap || !D.timeline) return;
    wrap.innerHTML = D.timeline.map(t => {
      const ach = (t.achievements || []).map(a => `<div class="timeline-achievement">${a}</div>`).join('');
      const stack = (t.stack || []).map(s => `<span class="timeline-skill">${s}</span>`).join('');
      return `
        <div class="timeline-item tl-c${t.tone || 1}">
          <div class="timeline-node"><div class="timeline-dot"></div></div>
          <div class="timeline-header">
            <div>
              <div class="timeline-role">${t.role}${t.current ? ' <span class="tl-badge">ATUAL</span>' : ''}</div>
              <div class="timeline-company">${t.company}</div>
            </div>
            <div class="timeline-year">${t.period}</div>
          </div>
          <div class="timeline-body">
            <p class="timeline-desc">${t.desc}</p>
            ${ach ? `<div class="timeline-achievements">${ach}</div>` : ''}
            ${stack ? `<div class="timeline-skills">${stack}</div>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  /* ── RENDER: EDUCAÇÃO (accordion) ─────────────────────── */
  function renderEducation() {
    const list = document.getElementById('education-list');
    if (!list || !D.education) return;
    const typeLabel = { graduation: 'Formação', course: 'Curso', certification: 'Certificação' };
    list.innerHTML = D.education.map(e => {
      const photos = (e.photos || []).map(p => `<img class="edu-photo" src="${p}" alt="${e.title}" loading="lazy">`).join('');
      return `
        <div class="edu-item reveal">
          <button class="edu-head" aria-expanded="false">
            <div class="edu-head-main">
              <span class="edu-type">${typeLabel[e.type] || 'Formação'}</span>
              <span class="edu-title">${e.title}</span>
              <span class="edu-school">${e.school} · ${e.year}</span>
            </div>
            <span class="edu-icon" aria-hidden="true">+</span>
          </button>
          <div class="edu-body">
            <div class="edu-body-inner">
              ${e.description ? `<p class="edu-desc">${e.description}</p>` : ''}
              ${photos ? `<div class="edu-photos">${photos}</div>` : '<p class="edu-empty">Fotos e detalhes em breve.</p>'}
              ${e.link && e.link !== '#' ? `<a class="edu-link" href="${e.link}" target="_blank" rel="noopener">Ver credencial →</a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
    list.querySelectorAll('.edu-head').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.edu-item');
        const open = item.classList.toggle('open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
        head.querySelector('.edu-icon').textContent = open ? '−' : '+';
      });
    });
  }

  /* ── RENDER: POLIGLOTA ────────────────────────────────── */
  function renderPolyglot() {
    const grid = document.getElementById('polyglot-grid');
    if (!grid || !D.polyglot) return;
    grid.innerHTML = D.polyglot.languages.map((l, i) => `
        <div class="lang-card reveal${i ? ' reveal-delay-' + Math.min(i, 3) : ''}">
          <div class="lang-flag">${l.flag || '🎧'}</div>
          <div class="lang-name">${l.name}</div>
          <div class="lang-level">${l.level}</div>
          <audio class="lang-audio" controls preload="none" src="${l.audio}"></audio>
        </div>`).join('');
  }

  /* Renderiza antes dos observers, para as animações capturarem os novos nós */
  renderSkills();
  renderTimeline();
  renderEducation();
  renderPolyglot();

  /* ── AVATAR: foto real com fallback ───────────────────── */
  (function setAvatar() {
    const wrap = document.querySelector('.avatar-img');
    const photo = D.owner && D.owner.photo;
    if (!wrap || !photo) return;
    const img = new Image();
    img.onload = () => {
      const ph = wrap.querySelector('.avatar-placeholder');
      if (ph) ph.style.display = 'none';
      const el = document.createElement('img');
      el.src = photo;
      el.alt = (D.owner && D.owner.name) || 'Foto';
      el.className = 'avatar-photo';
      wrap.insertBefore(el, wrap.firstChild);
    };
    img.src = photo;
  })();

  Utils.initPage({ revealSelector: '.reveal, .timeline-item' });

  /* ── CONSUMIR PORTFOLIO_DATA ──────────────────────────── */
  if (window.PORTFOLIO_DATA) {
    var stats = PORTFOLIO_DATA.stats;
    var statNumEls = document.querySelectorAll('.stat-num[data-target]');
    statNumEls.forEach(function(el, i) {
      if (stats[i]) {
        el.dataset.target = stats[i].value;
        el.dataset.suffix = stats[i].suffix || '';
      }
    });
  }

  /* ── ANIMATED COUNTER ──────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statObs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const dur = 2000;
        const t0 = performance.now();
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

  /* ── SKILL BAR ANIMATION ───────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar[data-width]');
  const barObs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
        barObs.unobserve(bar);
      }
    }
  }, { threshold: 0.5 });
  skillBars.forEach(b => barObs.observe(b));

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target2 = document.getElementById(id);
      if (target2) {
        e.preventDefault();
        target2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── PARALLAX ON HERO AVATAR ───────────────────────────── */
  var avatarWrap = document.querySelector('.avatar-wrap');
  if (avatarWrap) {
    window.addEventListener('mousemove', function(e) {
      var dx = (e.clientX / window.innerWidth - 0.5) * 20;
      var dy = (e.clientY / window.innerHeight - 0.5) * 12;
      avatarWrap.style.transform = 'translate(' + (dx * 0.5) + 'px, ' + (dy * 0.5) + 'px)';
    });
  }

  /* ── TOOL PILL HOVER ───────────────────────────────────── */
  document.querySelectorAll('.tool-pill').forEach((pill) => {
    pill.addEventListener('mouseenter', () => { pill.style.transform = 'translateY(-2px) scale(1.02)'; });
    pill.addEventListener('mouseleave', () => { pill.style.transform = ''; });
  });

  /* ── SECTION DOTS ──────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const dotsNav = document.getElementById('section-dots');
  if (dotsNav && sections.length) {
    sections.forEach(section => {
      const btn = document.createElement('button');
      btn.className = 'section-dot';
      btn.setAttribute('aria-label', `Ir para ${section.id}`);
      btn.title = section.querySelector('h2')?.textContent || section.id;
      btn.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
      dotsNav.appendChild(btn);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const idx = [...sections].indexOf(entry.target);
        const dot = dotsNav.children[idx];
        if (dot) dot.classList.toggle('active', entry.isIntersecting);
      });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
  }
})();
