/* ============================================================
   INDEX.JS - Engine da galaxia, audio, warp e loader
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     DATA — ESTRELAS DE NAVEGAÇÃO (uma por página)
     Cores alinhadas ao tema de cada página.
  ============================================================ */
  const NAV_STARS = [
    {
      id: 'sobre',
      name: 'Sobre Mim',
      desc: 'Minha trajetória, skills full-stack e formação.',
      tags: ['Full-Stack', 'Trajetória', 'Skills'],
      color: '#b44fff',
      url: 'about.html',
      angle: 45,
      dist: 0.20,
      size: 5.4,
    },
    {
      id: 'projetos',
      name: 'Projetos',
      desc: 'Trabalhos que construí — do front ao hardware.',
      tags: ['Web', 'Backend', 'IoT'],
      color: '#3b82f6',
      url: 'projects.html',
      angle: 135,
      dist: 0.24,
      size: 5.6,
    },
    {
      id: 'servicos',
      name: 'Serviços',
      desc: 'Desenvolvimento sob medida e projetos freelance.',
      tags: ['Freelance', 'Sites', 'Sistemas'],
      color: '#00e0a0',
      url: 'services.html',
      angle: 225,
      dist: 0.21,
      size: 5.2,
    },
    {
      id: 'contato',
      name: 'Contato',
      desc: 'Vamos conversar sobre a próxima oportunidade.',
      tags: ['E-mail', 'LinkedIn', 'GitHub'],
      color: '#ff8c42',
      url: 'contact.html',
      angle: 315,
      dist: 0.23,
      size: 5.0,
    },
  ];

  /* ============================================================
     PERFORMANCE DETECTION
  ============================================================ */
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const lowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  const slowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
  const isLowPerf = isMobile || lowMemory || slowCPU;

  let animating = true;
  const visibilityObserver = new IntersectionObserver(entries => {
    animating = entries[0].isIntersecting;
  }, { threshold: 0.1 });

  /* ============================================================
     STATE
  ============================================================ */
  const state = {
    mouseX: 0, mouseY: 0,
    targetOffX: 0, targetOffY: 0,
    offX: 0, offY: 0,
    zoom: 1, targetZoom: 1,
    loaded: false,
    audioOn: false,
    hoveredStar: null,
    rotation: 0,
    frame: 0,
  };

  /* ============================================================
     WEB AUDIO ENGINE
  ============================================================ */
  let audioCtx = null;
  let ambientOsc = null;
  let ambientGain = null;

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientGain = audioCtx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(audioCtx.destination);

    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    osc1.connect(ambientGain);
    osc1.start();

    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 82.5;
    osc2.connect(ambientGain);
    osc2.start();
  }

  function toggleAudio() {
    initAudio();
    state.audioOn = !state.audioOn;
    const btn = document.getElementById('audio-btn');
    if (state.audioOn) {
      ambientGain.gain.setTargetAtTime(0.04, audioCtx.currentTime, 1);
      if (btn) { btn.classList.add('active'); btn.textContent = '◉ SOM'; }
    } else {
      ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      if (btn) { btn.classList.remove('active'); btn.textContent = '◎ SOM'; }
    }
  }
  window.toggleAudio = toggleAudio;

  function playStarHover(freq = 440) {
    if (!state.audioOn || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  }

  function playStarClick() {
    if (!state.audioOn || !audioCtx) return;
    [220, 330, 440, 660].forEach((f, i) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      }, i * 80);
    });
  }

  /* ============================================================
     CANVAS SETUP
  ============================================================ */
  const canvas = document.getElementById('galaxy-canvas');
  const conCanvas = document.getElementById('constellation-canvas');
  if (!canvas || !conCanvas) {
    console.error('[galaxy] Canvas elements not found — aborting.');
    return;
  }
  const ctx = canvas.getContext('2d');
  const conCtx = conCanvas.getContext('2d');
  visibilityObserver.observe(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    conCanvas.width = window.innerWidth;
    conCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildStars(); });

  /* ============================================================
     STAR GENERATION
  ============================================================ */
  let stars = [];
  let projectStars = [];
  let shootingStars = [];
  let dustParticles = [];

  const NUM_ARMS = 5;
  const ARM_SPIN = 4.4;

  function randNorm() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  // Colocação em espiral logarítmica.
  // t: raio normalizado 0..1, armIndex: braço, scatter: multiplicador de dispersão
  function galaxyPoint(t, armIndex, scatter) {
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.46;
    const r = Math.pow(t, 0.85) * maxRadius;
    const armAngle = (armIndex / NUM_ARMS) * Math.PI * 2;
    const theta = armAngle + t * ARM_SPIN;
    const spread = scatter * (0.05 + t * 0.14) * maxRadius;
    return {
      x: Math.cos(theta) * r + randNorm() * spread,
      y: Math.sin(theta) * r + randNorm() * spread,
    };
  }

  function starColorForRadius(t) {
    const rnd = Math.random();
    if (t < 0.22) return rnd < 0.55 ? '#bcd4ff' : '#ffffff';
    if (t < 0.55) return rnd < 0.85 ? '#ffffff' : '#dceeff';
    if (rnd < 0.10) return '#ffd9a0';
    if (rnd < 0.15) return pickNebColor();
    return '#eaf2ff';
  }

  function buildStars() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    stars = [];
    dustParticles = [];

    const bgCount = isLowPerf ? 350 : 700;
    const armCount = isLowPerf ? 260 : 620;
    const coreCount = isLowPerf ? 70 : 140;
    const dustCount = isLowPerf ? 90 : 180;

    // Background stars — campo distante com leve variação de cor
    for (let i = 0; i < bgCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * Math.min(canvas.width, canvas.height) * 0.55;
      const rnd = Math.random();
      stars.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        size: Math.random() * 1.1 + 0.15,
        brightness: Math.random() * 0.8 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: rnd < 0.08 ? '#cdd9ff' : (rnd < 0.12 ? '#ffe6c0' : '#ffffff'),
        isProject: false,
      });
    }

    // Arm stars — espiral logarítmica com temperatura de cor
    for (let i = 0; i < armCount; i++) {
      const arm = Math.floor(Math.random() * NUM_ARMS);
      const t = Math.pow(Math.random(), 0.7);
      const pt = galaxyPoint(t, arm, 1);
      stars.push({
        x: pt.x,
        y: pt.y,
        size: Math.random() * 1.5 + 0.25,
        brightness: 0.45 + Math.random() * 0.55,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColorForRadius(t),
        isProject: false,
      });
    }

    // Core bulge stars — núcleo quente e denso
    for (let i = 0; i < coreCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 2.2) * Math.min(canvas.width, canvas.height) * 0.11;
      const rnd = Math.random();
      stars.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        size: Math.random() * 2.2 + 0.5,
        brightness: 0.65 + Math.random() * 0.35,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: rnd < 0.6 ? '#fff3d6' : '#ffffff',
        isProject: false,
      });
    }

    // Dust particles
    for (let i = 0; i < dustCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * Math.min(canvas.width, canvas.height) * 0.45;
      dustParticles.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        size: Math.random() * 85 + 30,
        opacity: Math.random() * 0.04,
        color: pickNebColor(),
        speed: (Math.random() - 0.5) * 0.1,
      });
    }

    // Project stars
    projectStars = NAV_STARS.map(p => {
      const a = (p.angle * Math.PI) / 180;
      const r = p.dist * Math.min(canvas.width, canvas.height);
      return {
        ...p,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        pulsePhase: Math.random() * Math.PI * 2,
        hoverRadius: 0,
        hovered: false,
        clickRipples: [],
      };
    });

    var starCountEl = document.getElementById('star-count');
    if (starCountEl) starCountEl.textContent = (stars.length + projectStars.length).toLocaleString();
    var projectCountEl = document.getElementById('project-count');
    if (projectCountEl) projectCountEl.textContent = projectStars.length;
  }

  const NEB_COLORS = ['#00ffff','#ff00ff','#ffdd00','#00ff88','#ff4444','#4466ff','#ff8800','#88ff00'];
  function pickNebColor() {
    return NEB_COLORS[Math.floor(Math.random() * NEB_COLORS.length)];
  }

  /* ============================================================
     SHOOTING STARS
  ============================================================ */
  function spawnShootingStar() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * canvas.width; y = -10; }
    else if (edge === 1) { x = canvas.width + 10; y = Math.random() * canvas.height; }
    else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 10; }
    else { x = -10; y = Math.random() * canvas.height; }
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x) + (Math.random() - 0.5) * 1.2;
    const speed = 8 + Math.random() * 12;
    shootingStars.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLen: 80 + Math.random() * 120,
      trail: [],
      color: NEB_COLORS[Math.floor(Math.random() * NEB_COLORS.length)],
    });
  }

  setInterval(() => {
    if (state.loaded && !document.hidden && Math.random() < 0.6) spawnShootingStar();
  }, 2200);

  /* ============================================================
     DRAW HELPERS
  ============================================================ */
  function drawGlow(cx2, cy2, r, color, alpha) {
    // AS DUAS LINHAS ANTIGAS QUE ESTAVAM DANDO ERRO FORAM REMOVIDAS DAQUI
    
    const hex = color;
    const [rr, gg, bb] = hexToRgb(hex);
    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r);
    g2.addColorStop(0, `rgba(${rr},${gg},${bb},${alpha})`);
    g2.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
    ctx.fill();
}

  function hexToRgb(hex) {
    if (hex.startsWith('#')) {
      const h = hex.slice(1);
      if (h.length === 6) {
        return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
      }
    }
    return [255, 255, 255];
  }

  function drawStar(x, y, size, brightness, color = '#ffffff') {
    const [r, g, b] = hexToRgb(color);
    ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    if (size > 1.2) {
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      g2.addColorStop(0, `rgba(${r},${g},${b},${brightness * 0.4})`);
      g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ============================================================
     NEBULA CLOUDS
  ============================================================ */
  const nebulas = [];
  function buildNebulas() {
    for (let a = 0; a < NUM_ARMS; a++) {
      for (let i = 0; i < 7; i++) {
        const t = 0.08 + i * 0.12;
        const pt = galaxyPoint(t, a, 0.5);
        nebulas.push({
          x: pt.x,
          y: pt.y,
          r: 70 + Math.random() * 150,
          color: pickNebColor(),
          opacity: 0.018 + Math.random() * 0.03,
        });
      }
    }
  }

  /* ============================================================
     MAIN RENDER LOOP
  ============================================================ */
  let lastTime = 0;

  var galaxyRafId;
  function render(ts) {
    galaxyRafId = requestAnimationFrame(render);
    if (!state.loaded || !animating) return;

    const dt = Math.min((ts - lastTime) / 16.67, 3);
    lastTime = ts;
    state.frame++;

    // Smooth camera
    state.offX += (state.targetOffX - state.offX) * 0.06 * dt;
    state.offY += (state.targetOffY - state.offY) * 0.06 * dt;
    state.zoom += (state.targetZoom - state.zoom) * 0.04 * dt;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Galaxy rotation
    state.rotation += 0.00008 * dt;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background void gradient
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.7);
    bgGrad.addColorStop(0, '#0a1428');
    bgGrad.addColorStop(0.35, '#050a16');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply camera transform
    ctx.save();
    ctx.translate(cx + state.offX, cy + state.offY);
    ctx.scale(state.zoom, state.zoom);
    ctx.rotate(state.rotation);

    // Draw nebula clouds
    ctx.globalCompositeOperation = 'screen';
    for (const neb of nebulas) {
      drawGlow(neb.x, neb.y, neb.r, neb.color, neb.opacity);
    }
    ctx.globalCompositeOperation = 'source-over';

    // Draw dust
    for (const d of dustParticles) {
      const [r, g, b] = hexToRgb(d.color);
      const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
      grd.addColorStop(0, `rgba(${r},${g},${b},${d.opacity})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Núcleo galáctico — bulge luminoso e quente
    ctx.globalCompositeOperation = 'screen';
    drawGlow(0, 0, 240, '#26325f', 0.16);
    drawGlow(0, 0, 140, '#3a5fd0', 0.18);
    drawGlow(0, 0, 85, '#ffe6b0', 0.20);
    drawGlow(0, 0, 48, '#fff4d8', 0.30);
    drawGlow(0, 0, 24, '#ffffff', 0.55);
    ctx.globalCompositeOperation = 'source-over';

    // Núcleo central brilhante
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 13);
    coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    coreGrad.addColorStop(0.5, 'rgba(255,240,210,0.6)');
    coreGrad.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // Background stars
    for (const s of stars) {
      const tw = Math.sin(ts * s.twinkleSpeed * 0.001 * 60 + s.twinklePhase);
      const br = s.brightness * (0.5 + 0.5 * tw);
      drawStar(s.x, s.y, s.size, br, s.color);
    }

    ctx.restore(); // end camera

    // Shooting stars (not affected by rotation)
    ctx.save();
    ctx.translate(cx + state.offX, cy + state.offY);
    ctx.scale(state.zoom, state.zoom);

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 20) ss.trail.shift();
      ss.x += ss.vx * dt;
      ss.y += ss.vy * dt;
      ss.life -= 0.012 * dt;
      if (ss.life <= 0 || ss.x < -canvas.width/2 - 200 || ss.x > canvas.width/2 + 200 ||
          ss.y < -canvas.height/2 - 200 || ss.y > canvas.height/2 + 200) {
        shootingStars.splice(i, 1);
        continue;
      }
      if (ss.trail.length > 1) {
        const [r, g, b] = hexToRgb(ss.color);
        for (let j = 1; j < ss.trail.length; j++) {
          const alpha = (j / ss.trail.length) * ss.life * 0.9;
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = (j / ss.trail.length) * 2;
          ctx.beginPath();
          ctx.moveTo(ss.trail[j-1].x, ss.trail[j-1].y);
          ctx.lineTo(ss.trail[j].x, ss.trail[j].y);
          ctx.stroke();
        }
      }
    }

    // Project stars
    for (const ps of projectStars) {
      const pulse = Math.sin(ts * 0.002 * 60 * 0.016 + ps.pulsePhase);
      const scale = 1 + pulse * 0.15;
      const sz = ps.size * scale;
      const [r, g, b] = hexToRgb(ps.color);

      // Outer glow
      ctx.globalCompositeOperation = 'screen';
      const halo = ps.hovered ? 80 : 50;
      const haloGrad = ctx.createRadialGradient(ps.x, ps.y, 0, ps.x, ps.y, halo);
      haloGrad.addColorStop(0, `rgba(${r},${g},${b},${ps.hovered ? 0.5 : 0.25})`);
      haloGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(ps.x, ps.y, halo, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Core star
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.beginPath();
      ctx.arc(ps.x, ps.y, sz, 0, Math.PI * 2);
      ctx.fill();

      // White center
      ctx.fillStyle = `rgba(255,255,255,0.9)`;
      ctx.beginPath();
      ctx.arc(ps.x, ps.y, sz * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Cross diffraction spikes
      ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.lineWidth = 0.5;
      const spikeLen = sz * 6 + (ps.hovered ? 20 : 0);
      for (let sp = 0; sp < 4; sp++) {
        const sa = (sp / 4) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(ps.x + Math.cos(sa) * sz, ps.y + Math.sin(sa) * sz);
        ctx.lineTo(ps.x + Math.cos(sa) * spikeLen, ps.y + Math.sin(sa) * spikeLen);
        ctx.moveTo(ps.x - Math.cos(sa) * sz, ps.y - Math.sin(sa) * sz);
        ctx.lineTo(ps.x - Math.cos(sa) * spikeLen, ps.y - Math.sin(sa) * spikeLen);
        ctx.stroke();
      }

      // Hover ring
      if (ps.hovered) {
        ps.hoverRadius = Math.min(ps.hoverRadius + 1 * dt, sz * 8);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(ps.x, ps.y, ps.hoverRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ps.hoverRadius = Math.max(ps.hoverRadius - 2 * dt, 0);
      }

      // Click ripples
      for (let ri = ps.clickRipples.length - 1; ri >= 0; ri--) {
        const rip = ps.clickRipples[ri];
        rip.r += 3 * dt;
        rip.alpha -= 0.025 * dt;
        if (rip.alpha <= 0) { ps.clickRipples.splice(ri, 1); continue; }
        ctx.strokeStyle = `rgba(${r},${g},${b},${rip.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ps.x, ps.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore(); // end shooting/project stars layer

    // Constellation canvas
    drawConstellations(cx, cy);

    // Update HUD coords
    const nx = (state.mouseX - cx) / state.zoom;
    const ny = (state.mouseY - cy) / state.zoom;
    var hudCoords = document.getElementById('hud-coords');
    if (hudCoords) hudCoords.textContent =
      `X: ${nx.toFixed(0)} / Y: ${ny.toFixed(0)}`;
    const ra_h = ((Math.atan2(ny, nx) / Math.PI * 12 + 12) % 24).toFixed(1);
    const dec = (-ny / Math.min(canvas.width, canvas.height) * 180).toFixed(1);
    var hudScale = document.getElementById('hud-scale');
    if (hudScale) hudScale.textContent =
      `RA: ${ra_h}h / DEC: ${dec}°`;
    var zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) zoomLevel.textContent = `${state.zoom.toFixed(1)}x`;
  }

  /* ============================================================
     CONSTELLATION OVERLAY
  ============================================================ */
  function drawConstellations(cx, cy) {
    conCtx.clearRect(0, 0, conCanvas.width, conCanvas.height);
    if (!state.hoveredStar) return;

    const hs = state.hoveredStar;
    const sx = cx + state.offX + (Math.cos(state.rotation) * hs.x - Math.sin(state.rotation) * hs.y) * state.zoom;
    const sy = cy + state.offY + (Math.sin(state.rotation) * hs.x + Math.cos(state.rotation) * hs.y) * state.zoom;

    const nearby = stars.slice(0, 80);
    const [r, g, b] = hexToRgb(hs.color);

    for (const ns of nearby) {
      const nx2 = cx + state.offX + (Math.cos(state.rotation) * ns.x - Math.sin(state.rotation) * ns.y) * state.zoom;
      const ny2 = cy + state.offY + (Math.sin(state.rotation) * ns.x + Math.cos(state.rotation) * ns.y) * state.zoom;
      const dist = Math.hypot(sx - nx2, sy - ny2);
      if (dist < 180 && dist > 20) {
        const alpha = (1 - dist / 180) * 0.3;
        conCtx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        conCtx.lineWidth = 0.5;
        conCtx.setLineDash([3, 6]);
        conCtx.beginPath();
        conCtx.moveTo(sx, sy);
        conCtx.lineTo(nx2, ny2);
        conCtx.stroke();
        conCtx.setLineDash([]);
      }
    }
  }

  /* ============================================================
     MOUSE & TOUCH EVENTS
  ============================================================ */
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');

  let ringX = 0, ringY = 0;

  if (cursorRing && cursorDot) {
    function updateCursorRing() {
      ringX += (state.mouseX - ringX) * 0.12;
      ringY += (state.mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();
  }

  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = e.clientX + 'px'; cursorDot.style.top = e.clientY + 'px'; }

    // Parallax
    const dx = (e.clientX / window.innerWidth - 0.5) * 2;
    const dy = (e.clientY / window.innerHeight - 0.5) * 2;
    state.targetOffX = dx * -30;
    state.targetOffY = dy * -20;

    checkHover(e.clientX, e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    state.targetOffX = 0;
    state.targetOffY = 0;
  });

  // Touch support
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    state.mouseX = t.clientX;
    state.mouseY = t.clientY;
    const dx = (t.clientX / window.innerWidth - 0.5) * 2;
    const dy = (t.clientY / window.innerHeight - 0.5) * 2;
    state.targetOffX = dx * -20;
    state.targetOffY = dy * -15;
    checkHover(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    checkHover(t.clientX, t.clientY);
    handleClick(t.clientX, t.clientY);
  });

  function getStarScreenPos(ps) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rx = Math.cos(state.rotation) * ps.x - Math.sin(state.rotation) * ps.y;
    const ry = Math.sin(state.rotation) * ps.x + Math.cos(state.rotation) * ps.y;
    return {
      sx: cx + state.offX + rx * state.zoom,
      sy: cy + state.offY + ry * state.zoom,
    };
  }

  function checkHover(mx, my) {
    let found = null;
    for (const ps of projectStars) {
      const { sx, sy } = getStarScreenPos(ps);
      const dist = Math.hypot(mx - sx, my - sy);
      if (dist < ps.size * state.zoom * 10) {
        found = ps;
        break;
      }
    }
    if (found !== state.hoveredStar) {
      if (found) {
        playStarHover(220 + Math.random() * 440);
      }
      state.hoveredStar = found;
      for (const ps of projectStars) ps.hovered = false;
      if (found) found.hovered = true;
      document.body.classList.toggle('star-hover', !!found);
      updateTooltip(found, mx, my);
    } else if (found) {
      moveTooltip(mx, my);
    }
  }

  const tooltip = document.getElementById('tooltip');

  function updateTooltip(star, mx, my) {
    if (!star) {
      if (tooltip) tooltip.classList.remove('visible');
      return;
    }
    var ttLabel = document.getElementById('tt-label');
    if (ttLabel) ttLabel.textContent = `SEÇÃO — ${star.id.toUpperCase()}`;
    var ttName = document.getElementById('tt-name');
    if (ttName) { ttName.textContent = star.name; ttName.style.color = star.color; }
    var ttDesc = document.getElementById('tt-desc');
    if (ttDesc) ttDesc.textContent = star.desc;
    const tagsEl = document.getElementById('tt-tags');
    if (tagsEl) tagsEl.innerHTML = star.tags.map(t => `<span class="tooltip-tag">${t}</span>`).join('');
    moveTooltip(mx, my);
    if (tooltip) tooltip.classList.add('visible');
  }

  function moveTooltip(mx, my) {
    if (!tooltip) return;
    let tx = mx + 24;
    let ty = my - 20;
    if (tx + 250 > window.innerWidth) tx = mx - 240;
    if (ty + 200 > window.innerHeight) ty = my - 200;
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
  }

  /* ============================================================
     CLICK HANDLER
  ============================================================ */
  canvas.addEventListener('click', e => handleClick(e.clientX, e.clientY));

  function handleClick(mx, my) {
    for (const ps of projectStars) {
      const { sx, sy } = getStarScreenPos(ps);
      const dist = Math.hypot(mx - sx, my - sy);
      if (dist < ps.size * state.zoom * 12) {
        ps.clickRipples.push({ r: ps.size * 2, alpha: 1 });
        playStarClick();
        setTimeout(() => warpTo(ps.url), 600);
        return;
      }
    }
  }

  /* ============================================================
     SCROLL ZOOM
  ============================================================ */
  window.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    state.targetZoom = Math.max(0.4, Math.min(3.5, state.targetZoom * factor));
  }, { passive: false });

  /* ============================================================
     KEYBOARD NAV
  ============================================================ */
  let keyStarIdx = -1;
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      keyStarIdx = (keyStarIdx + 1) % projectStars.length;
      const ps = projectStars[keyStarIdx];
      for (const p2 of projectStars) p2.hovered = false;
      ps.hovered = true;
      state.hoveredStar = ps;
      const { sx, sy } = getStarScreenPos(ps);
      updateTooltip(ps, sx, sy);
      var hudStatus = document.getElementById('hud-status-text');
      if (hudStatus) hudStatus.textContent = ps.name.toUpperCase();
    }
    if (e.key === 'Enter' && state.hoveredStar) {
      state.hoveredStar.clickRipples.push({ r: 5, alpha: 1 });
      playStarClick();
      setTimeout(() => warpTo(state.hoveredStar.url), 600);
    }
    if (e.key === '+' || e.key === '=') state.targetZoom = Math.min(3.5, state.targetZoom * 1.15);
    if (e.key === '-') state.targetZoom = Math.max(0.4, state.targetZoom * 0.87);
  });

  /* ============================================================
     WARP TRANSITION
  ============================================================ */
  const warpOverlay = document.getElementById('warp-overlay');
  const warpCvs = document.getElementById('warp-canvas');
  const warpText = document.getElementById('warp-text');

  function warpTo(url) {
    if (!warpOverlay || !warpCvs) { window.location.href = url; return; }
    const warpCtx2 = warpCvs.getContext('2d');
    warpCvs.width = window.innerWidth;
    warpCvs.height = window.innerHeight;
    warpOverlay.classList.add('active');

    let alpha = 0;
    let t = 0;
    const warpStars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      speed: Math.random() * 3 + 1,
      color: NEB_COLORS[Math.floor(Math.random() * NEB_COLORS.length)],
    }));

    function animateWarp() {
      t++;
      alpha = Math.min(1, t / 30);
      warpOverlay.style.opacity = alpha;
      warpCtx2.fillStyle = `rgba(0,0,0,${0.15})`;
      warpCtx2.fillRect(0, 0, warpCvs.width, warpCvs.height);

      const cx2 = warpCvs.width / 2;
      const cy2 = warpCvs.height / 2;
      const progress = Math.min(t / 60, 1);

      for (const ws of warpStars) {
        const speed = ws.speed * (1 + progress * 15);
        const nx2 = ws.x + (ws.x / Math.hypot(ws.x, ws.y)) * speed * t * 0.04;
        const ny2 = ws.y + (ws.y / Math.hypot(ws.x, ws.y)) * speed * t * 0.04;
        const [r2, g2, b2] = hexToRgb(ws.color);
        const len = speed * t * 0.1 + 1;
        const ang = Math.atan2(ny2, nx2);
        warpCtx2.strokeStyle = `rgba(${r2},${g2},${b2},${0.6 * alpha})`;
        warpCtx2.lineWidth = 1;
        warpCtx2.beginPath();
        warpCtx2.moveTo(cx2 + nx2, cy2 + ny2);
        warpCtx2.lineTo(cx2 + nx2 + Math.cos(ang) * len * 3, cy2 + ny2 + Math.sin(ang) * len * 3);
        warpCtx2.stroke();
      }

      if (t === 20 && warpText) {
        warpText.style.opacity = '1';
        warpText.style.transition = 'opacity 0.5s';
      }

      if (t < 80) {
        requestAnimationFrame(animateWarp);
      } else {
        window.location.href = url;
      }
    }
    animateWarp();
  }

  /* ============================================================
     LOADING SEQUENCE
  ============================================================ */
  function runLoader() {
    if (!window.LoaderWidget) {
      console.warn('LoaderWidget não disponível — iniciando sem loader.');
      finishLoad();
      return;
    }
    window.LoaderWidget.run(finishLoad);
  }

  function finishLoad() {
    if (window._stopLoaderCanvas) window._stopLoaderCanvas();
    buildStars();
    buildNebulas();
    state.loaded = true;
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 1100);
    }
    requestAnimationFrame(render);

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(galaxyRafId);
      } else {
        galaxyRafId = requestAnimationFrame(render);
      }
    });
  }

  // Start — aguarda loader ser injetado via fetch()
  function startGalaxy() {
    runLoader();
  }

  function waitForLoader(retries) {
    if (document.getElementById('loader')) {
      startGalaxy();
    } else if (retries > 0) {
      setTimeout(() => waitForLoader(retries - 1), 50);
    } else {
      console.warn('Loader não injetado via fetch — iniciando galáxia sem loader.');
      startGalaxy();
    }
  }
  waitForLoader(40); // max 2s

  /* ============================================================
     INTEGRAÇÃO COM UTILS COMPARTILHADOS
  ============================================================ */
  if (window.Utils) {
    Utils.initCursor();
  }

})();