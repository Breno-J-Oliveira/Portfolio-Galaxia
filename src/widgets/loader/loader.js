/* ============================================================
   LOADER.JS — Lógica da tela de loading
   Exporta window.LoaderWidget para uso por galaxy.js
============================================================ */
(function () {
  'use strict';

  window.LoaderWidget = {
    run(onComplete) {
      const lc = document.getElementById('loader-canvas');
      if (!lc) { onComplete && onComplete(); return; }
      const lctx = lc.getContext('2d');
      lc.width = window.innerWidth;
      lc.height = window.innerHeight;

      const lParticles = Array.from({ length: 160 }, () => ({
        x: Math.random() * lc.width,
        y: Math.random() * lc.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '0,255,255' : '180,79,255',
      }));

      let lAnimId;
      function animLoader() {
        lctx.clearRect(0, 0, lc.width, lc.height);
        for (const p of lParticles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = lc.width;
          if (p.x > lc.width) p.x = 0;
          if (p.y < 0) p.y = lc.height;
          if (p.y > lc.height) p.y = 0;
          lctx.beginPath();
          lctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          lctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
          lctx.fill();
        }
        lAnimId = requestAnimationFrame(animLoader);
      }
      animLoader();
      window._stopLoaderCanvas = function() { cancelAnimationFrame(lAnimId); };

      const bar       = document.getElementById('loader-bar');
      const pct       = document.getElementById('loader-percent');
      const statusMsg = document.getElementById('loader-status-msg');
      const dots = [0,1,2,3,4].map(function(i) { return document.getElementById('ldot-' + i); });

      const tasks = [
        { label: 'Carregando estrelas…',  target: 20, dur: 350 },
        { label: 'Gerando galáxia…',       target: 45, dur: 500 },
        { label: 'Mapeando nebulosas…',    target: 65, dur: 400 },
        { label: 'Calibrando órbitas…',    target: 82, dur: 300 },
        { label: 'Sistema online.',        target: 100, dur: 450 },
      ];

      let progress = 0, ti = 0;

      function updateDots(idx) {
        dots.forEach(function(d, i) { if (d) d.classList.toggle('active', i <= idx); });
      }

      function nextTask() {
        if (ti >= tasks.length) { setTimeout(function() { onComplete && onComplete(); }, 400); return; }
        const task = tasks[ti];
        if (statusMsg) statusMsg.textContent = task.label;
        updateDots(ti);
        const start = progress, end = task.target;
        const startTime = performance.now();
        ti++;
        var tick = function(now) {
          var e2 = Math.min((now - startTime) / task.dur, 1);
          var ease = 1 - Math.pow(1 - e2, 3);
          progress = start + (end - start) * ease;
          if (bar) bar.style.width = progress + '%';
          if (pct) pct.textContent = Math.round(progress) + '%';
          if (e2 < 1) requestAnimationFrame(tick); else nextTask();
        };
        requestAnimationFrame(tick);
      }
      nextTask();
    }
  };
})();
