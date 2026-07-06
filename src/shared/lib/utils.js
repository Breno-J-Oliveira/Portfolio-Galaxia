/* ============================================================
   UTILS.JS — Utilitários compartilhados entre todas as páginas
   Cursor customizado, partículas de fundo, barra de progresso,
   scroll reveal e entrada de página.
   Disponibiliza window.Utils para uso das páginas.
============================================================ */
(function () {
  'use strict';

  const Utils = {};

  /* ── CUSTOM CURSOR ─────────────────────────────────────── */
  Utils.initCursor = function () {
    if (document.body.classList.contains('cursor-ready')) return;
    const cursorRing = document.getElementById('cursor-ring');
    const cursorDot  = document.getElementById('cursor-dot');
    if (!cursorRing || !cursorDot) return;
    document.body.classList.add('cursor-ready');
    let cx = 0, cy = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top  = cy + 'px';
    });
    function animRing() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();
    let hoverEl = null;
    document.addEventListener('mouseover', e => {
      const match = e.target.closest('a, button, .project-card, .modal-thumb');
      if (match !== hoverEl) {
        if (hoverEl) document.body.classList.remove('link-hover');
        if (match) document.body.classList.add('link-hover');
        hoverEl = match;
      }
    });
    document.addEventListener('mouseout', e => {
      const match = e.target.closest('a, button, .project-card, .modal-thumb');
      if (match && match === hoverEl && !match.contains(e.relatedTarget)) {
        document.body.classList.remove('link-hover');
        hoverEl = null;
      }
    });
  };

  /* ── BACKGROUND PARTICLE CANVAS ────────────────────────── */
  Utils.initBgCanvas = function () {
    const bgCvs = document.getElementById('bg-canvas');
    if (!bgCvs) return;
    const bgCtx = bgCvs.getContext('2d');
    bgCvs.width = window.innerWidth;
    bgCvs.height = window.innerHeight;
    window.addEventListener('resize', () => {
      bgCvs.width = window.innerWidth;
      bgCvs.height = window.innerHeight;
    });

    const COLORS = ['#00ffff','#ff00ff','#ffdd00','#00ff88','#ff4444','#4466ff'];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      color: Math.random() < 0.15 ? COLORS[Math.floor(Math.random() * COLORS.length)] : '#ffffff',
      alpha: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    var rafId;
    function renderBg(ts) {
      rafId = requestAnimationFrame(renderBg);
      bgCtx.clearRect(0, 0, bgCvs.width, bgCvs.height);
      const grad = bgCtx.createRadialGradient(
        bgCvs.width / 2, bgCvs.height / 2, 0,
        bgCvs.width / 2, bgCvs.height / 2, Math.max(bgCvs.width, bgCvs.height)
      );
      grad.addColorStop(0, '#050b14');
      grad.addColorStop(1, '#000000');
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, bgCvs.width, bgCvs.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = bgCvs.width;
        if (p.x > bgCvs.width) p.x = 0;
        if (p.y < 0) p.y = bgCvs.height;
        if (p.y > bgCvs.height) p.y = 0;
        const tw = Math.sin(ts * p.twinkleSpeed * 0.001 * 60 + p.twinkle);
        bgCtx.globalAlpha = p.alpha * (0.5 + 0.5 * tw);
        bgCtx.fillStyle = p.color;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fill();
      }
      bgCtx.globalAlpha = 1;
    }
    rafId = requestAnimationFrame(renderBg);

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(renderBg);
      }
    });
  };

  /* ── READING PROGRESS BAR ──────────────────────────────── */
  Utils.initReadingProgress = function () {
    const progressBar = document.getElementById('read-progress');
    if (!progressBar) return;
    function updateProgress() {
      const scroll = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) progressBar.style.width = ((scroll / max) * 100) + '%';
    }
    window.addEventListener('scroll', updateProgress);
  };

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  Utils.initScrollReveal = function (selector) {
    const revealEls = document.querySelectorAll(selector || '.reveal, .timeline-item');
    if (!revealEls.length) return;
    const revealObs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
    Utils.revealObserver = revealObs;
  };

  /* ── PAGE ENTRY ────────────────────────────────────────── */
  Utils.initPageEntry = function () {
    const el = document.querySelector('.page-enter');
    if (el) el.style.animationDelay = '0.2s';
  };

  /* ── BACK TO TOP + SW REGISTRATION ─────────────────────── */
  Utils.initBackToTop = function () {
    const btt = document.getElementById('back-to-top');
    if (!btt) return;
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  Utils.registerSW = function () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
    }
  };

  /* ── SECTION PROGRESS INDICATOR ────────────────────────── */
  Utils.initSectionProgress = function () {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var indicator = document.createElement('div');
    indicator.id = 'section-progress';
    indicator.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'height:3px',
      'z-index:9998', 'pointer-events:none',
      'background:rgba(255,255,255,0.05)'
    ].join(';');
    var bar = document.createElement('div');
    bar.style.cssText = [
      'height:100%', 'width:0%',
      'background:var(--c1,#00ffff)',
      'transition:width 0.2s ease',
      'box-shadow:0 0 8px var(--c1,#00ffff)'
    ].join(';');
    indicator.appendChild(bar);
    document.body.appendChild(indicator);

    var currentLabel = document.createElement('div');
    currentLabel.style.cssText = [
      'position:fixed', 'top:8px', 'right:1rem',
      'font-family:var(--font-mono,monospace)', 'font-size:0.7rem',
      'letter-spacing:0.1em', 'color:var(--c1,#00ffff)',
      'z-index:9999', 'pointer-events:none',
      'opacity:0.7', 'text-transform:uppercase'
    ].join(';');
    document.body.appendChild(currentLabel);

    function updateSection() {
      var scrollPos = window.scrollY + window.innerHeight * 0.3;
      var activeIdx = 0;
      sections.forEach(function(section, i) {
        if (section.offsetTop <= scrollPos) activeIdx = i;
      });
      var total = sections.length;
      var pct = ((activeIdx + 1) / total) * 100;
      bar.style.width = pct + '%';
      var label = sections[activeIdx].querySelector('h2, .section-title, .hero-title, .hero-name');
      currentLabel.textContent = label ? label.textContent.trim().replace(/\s+/g, ' ').substring(0, 30) : sections[activeIdx].id;
    }
    window.addEventListener('scroll', updateSection, { passive: true });
    updateSection();
  };

  /* ── INIT ALL (convenience for sub-pages) ──────────────── */
  Utils.initPage = function (opts) {
    opts = opts || {};
    Utils.initCursor();
    if (opts.bgCanvas !== false) Utils.initBgCanvas();
    if (opts.readingProgress !== false) Utils.initReadingProgress();
    if (opts.scrollReveal !== false) Utils.initScrollReveal(opts.revealSelector);
    if (opts.pageEntry !== false) Utils.initPageEntry();
    if (opts.sectionProgress !== false) Utils.initSectionProgress();
    Utils.initBackToTop();
    Utils.registerSW();
  };

  /* ── HUD:READY — re-init cursor quando HUD é injetado ──── */
  document.addEventListener('hud:ready', function() {
    if (!document.body.classList.contains('cursor-ready')) {
      Utils.initCursor();
    }
  });

  window.Utils = Utils;
})();
