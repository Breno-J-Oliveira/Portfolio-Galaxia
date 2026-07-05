/* ============================================================
   ABOUT.JS — Lógica da página "Sobre"
   Usa Utils compartilhados + contadores, skill bars,
   smooth scroll, parallax, pills e section dots.
============================================================ */
(function () {
  'use strict';

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
