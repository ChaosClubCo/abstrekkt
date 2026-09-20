/**
 * FlashFusion Background Engine v1.0
 * Drop-in parallax background for all FlashFusion pages.
 *
 * Effects:
 *   1. Starfield         — deep static stars, slow parallax
 *   2. Glinting sparkles — full color wheel, 4-point cross, twinkling
 *   3. Streaking comets  — random direction, full color wheel, motion trails
 *   4. Aurora curtains   — sinusoidal wave bands, slow hue cycle
 *   5. Nebula blobs      — large drifting radial color clouds
 *   6. Hex grid pulse    — hexagonal grid with random cell lighting
 *   7. Constellation web — drifting nodes with proximity connections
 *
 * Parallax: responds to mouse position AND scroll (independent depth per layer)
 *
 * Usage:
 *   <script src="bg-engine.js"></script>
 *   FlashFusionBG.init()               // auto-attach to body
 *   FlashFusionBG.init('#my-container') // or a specific element
 *   FlashFusionBG.destroy()            // clean teardown
 */

(function(global) {
  'use strict';

  // ── CONFIG ────────────────────────────────────────────────────────────────
  const CFG = {
    // Starfield
    STAR_COUNT:       120,
    STAR_DEPTH_SPEED: 0.03,   // parallax depth — moves least

    // Glints
    GLINT_MAX:        28,
    GLINT_DEPTH:      0.18,
    GLINT_LIFESPAN:   [800, 2200],  // ms min/max
    GLINT_SIZE:       [4, 14],

    // Comets
    COMET_MAX:        14,
    COMET_DEPTH:      0.40,
    COMET_SPEED:      [2.5, 7.0],
    COMET_TAIL:       [80, 220],    // trail length px

    // Aurora
    AURORA_BANDS:     2,
    AURORA_DEPTH:     0.12,

    // Nebula
    NEBULA_COUNT:     5,
    NEBULA_DEPTH:     0.06,

    // Hex grid
    HEX_SIZE:         48,
    HEX_DEPTH:        0.10,
    HEX_PULSE_RATE:   0.0008,  // cells lit per ms

    // Constellation
    NODE_COUNT:       32,
    NODE_DEPTH:       0.22,
    NODE_CONNECT_D:   140,     // px connection distance

    // Mouse parallax sensitivity
    MOUSE_SENSITIVITY: 60,     // max px offset at edge of screen
    SCROLL_SENSITIVITY: 0.15,  // scroll px → parallax px ratio
  };

  // ── STATE ─────────────────────────────────────────────────────────────────
  let canvas, ctx, raf, W, H;
  let mouseX = 0, mouseY = 0;
  let scrollY = 0;
  let startTime = 0;
  let lastTime = 0;
  let attached = false;
  let lastFrame = 0;
  const FRAME_MS = 1000 / 30;   // ~30fps cap (Perf — choice #1)

  const layers = {
    stars:         [],
    glints:        [],
    comets:        [],
    aurora:        { phase: 0, hue: 0 },
    nebula:        [],
    hexPulses:     [],
    nodes:         [],
  };

  // ── MATH HELPERS ─────────────────────────────────────────────────────────
  const R  = (a, b) => Math.random() * (b - a) + a;
  const Ri = (a, b) => Math.floor(R(a, b));
  const TAU = Math.PI * 2;
  const hsl = (h, s, l, a = 1) => `hsla(${h % 360},${s}%,${l}%,${a})`;
  const randHue = () => Math.random() * 360;

  // ── PARALLAX OFFSET ───────────────────────────────────────────────────────
  function layerOffset(depth) {
    const mx = ((mouseX / W) - 0.5) * 2;  // -1 to 1
    const my = ((mouseY / H) - 0.5) * 2;
    return {
      x: mx * CFG.MOUSE_SENSITIVITY * depth,
      y: my * CFG.MOUSE_SENSITIVITY * depth
          - scrollY * CFG.SCROLL_SENSITIVITY * depth,
    };
  }

  // ── RESIZE ────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildHexGrid();
  }

  // ── 1. STARFIELD ──────────────────────────────────────────────────────────
  function initStars() {
    layers.stars = Array.from({ length: CFG.STAR_COUNT }, () => ({
      x:     R(0, W || 1920),
      y:     R(0, H || 1080),
      r:     R(0.25, 1.4),
      hue:   randHue(),
      alpha: R(0.15, 0.55),
      drift: R(0.005, 0.02),
      ddir: Math.random() < 0.5 ? 1 : -1,
    }));
  }

  function drawStars(dt, o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    layers.stars.forEach(s => {
      s.x += s.drift * s.ddir;
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, TAU);
      ctx.fillStyle = hsl(s.hue, 40, 90, s.alpha);
      ctx.fill();
    });
    ctx.restore();
  }

  // ── 2. GLINTING SPARKLES ──────────────────────────────────────────────────
  function spawnGlint(now) {
    return {
      x:      R(0, W),
      y:      R(0, H),
      size:   R(...CFG.GLINT_SIZE),
      hue:    randHue(),
      born:   now,
      life:   R(...CFG.GLINT_LIFESPAN),
      rot:    R(0, Math.PI / 4),
    };
  }

  function drawGlints(now, dt, o) {
    // Spawn new glints
    while (layers.glints.length < CFG.GLINT_MAX) {
      layers.glints.push(spawnGlint(now));
    }

    ctx.save();
    ctx.translate(o.x, o.y);

    layers.glints = layers.glints.filter(g => {
      const age = now - g.born;
      if (age > g.life) return false;

      // Alpha envelope: quick in, long sustain, quick out
      const t = age / g.life;
      const alpha = t < 0.15
        ? t / 0.15
        : t > 0.75
          ? 1 - (t - 0.75) / 0.25
          : 1;

      const sz = g.size;
      const a  = alpha * 0.9;

      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot);

      // Outer bloom
      const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 2.5);
      bloom.addColorStop(0,   hsl(g.hue, 100, 95, a * 0.5));
      bloom.addColorStop(0.4, hsl(g.hue, 100, 70, a * 0.15));
      bloom.addColorStop(1,   hsl(g.hue, 100, 60, 0));
      ctx.beginPath();
      ctx.arc(0, 0, sz * 2.5, 0, TAU);
      ctx.fillStyle = bloom;
      ctx.fill();

      // 4-point cross arms
      ctx.strokeStyle = hsl(g.hue, 100, 92, a);
      ctx.lineWidth = Math.max(0.5, sz * 0.12);
      ctx.lineCap = 'round';

      const arms = [[0, -sz, 0, sz], [-sz, 0, sz, 0]];
      arms.forEach(([x1,y1,x2,y2]) => {
        const armGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        armGrad.addColorStop(0,   hsl(g.hue, 100, 95, 0));
        armGrad.addColorStop(0.5, hsl(g.hue, 100, 98, a));
        armGrad.addColorStop(1,   hsl(g.hue, 100, 95, 0));
        ctx.strokeStyle = armGrad;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 45° diagonal arms (shorter)
      const d2 = sz * 0.55;
      const arms2 = [[-d2,-d2,d2,d2], [d2,-d2,-d2,d2]];
      arms2.forEach(([x1,y1,x2,y2]) => {
        const g2 = ctx.createLinearGradient(x1, y1, x2, y2);
        g2.addColorStop(0,   hsl(g.hue, 100, 95, 0));
        g2.addColorStop(0.5, hsl(g.hue, 100, 96, a * 0.6));
        g2.addColorStop(1,   hsl(g.hue, 100, 95, 0));
        ctx.strokeStyle = g2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Hard center dot
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.12, 0, TAU);
      ctx.fillStyle = hsl(g.hue, 20, 100, a);
      ctx.fill();

      ctx.restore();
      return true;
    });

    ctx.restore();
  }

  // ── 3. STREAKING COMETS ───────────────────────────────────────────────────
  function spawnComet() {
    const angle = R(0, TAU);
    const speed = R(...CFG.COMET_SPEED);
    // Spawn from edges
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -20 : W + 20;
      y = R(0, H);
    } else {
      x = R(0, W);
      y = Math.random() < 0.5 ? -20 : H + 20;
    }
    // Aim roughly toward center with variance
    const toX = W * 0.5 + R(-W * 0.4, W * 0.4) - x;
    const toY = H * 0.5 + R(-H * 0.4, H * 0.4) - y;
    const d   = Math.sqrt(toX * toX + toY * toY);
    return {
      x, y,
      vx:   (toX / d) * speed,
      vy:   (toY / d) * speed,
      tail: R(...CFG.COMET_TAIL),
      hue:  randHue(),
      w:    R(0.8, 2.5),
      history: [],
      dead: false,
    };
  }

  function drawComets(dt, o) {
    while (layers.comets.length < CFG.COMET_MAX) {
      layers.comets.push(spawnComet());
    }

    ctx.save();
    ctx.translate(o.x, o.y);

    layers.comets = layers.comets.filter(c => {
      // Move
      c.x += c.vx;
      c.y += c.vy;
      c.history.push({ x: c.x, y: c.y });
      if (c.history.length > 60) c.history.shift();

      // Kill off-screen
      if (c.x < -300 || c.x > W + 300 || c.y < -300 || c.y > H + 300) {
        return false;
      }

      if (c.history.length < 2) return true;

      // Draw trail
      for (let i = 1; i < c.history.length; i++) {
        const t = i / c.history.length;
        const a = t * t * 0.85;
        const w = c.w * t * 1.5;
        ctx.beginPath();
        ctx.moveTo(c.history[i - 1].x, c.history[i - 1].y);
        ctx.lineTo(c.history[i].x, c.history[i].y);
        ctx.strokeStyle = hsl(c.hue, 100, 70, a);
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Head glow
      const head = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 8);
      head.addColorStop(0, hsl(c.hue, 100, 98, 0.9));
      head.addColorStop(0.4, hsl(c.hue, 100, 80, 0.4));
      head.addColorStop(1, hsl(c.hue, 100, 60, 0));
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, TAU);
      ctx.fillStyle = head;
      ctx.fill();

      return true;
    });

    ctx.restore();
  }

  // ── 4. AURORA CURTAINS ────────────────────────────────────────────────────
  function drawAurora(elapsed, o) {
    ctx.save();
    ctx.translate(o.x * 0.5, o.y * 0.5);  // aurora barely moves
    const bands = CFG.AURORA_BANDS;

    for (let b = 0; b < bands; b++) {
      const hue     = (elapsed * 0.006 + b * 120) % 360;
      const yBase   = H * (0.3 + b * 0.22);
      const amp     = H * 0.08;
      const freq    = 0.0018 + b * 0.0005;
      const phase   = elapsed * 0.00035 + b * 2.1;

      ctx.beginPath();
      ctx.moveTo(-40, H + 40);

      // Bottom fill anchor
      for (let x = -40; x <= W + 40; x += 8) {
        const y = yBase + Math.sin(x * freq + phase) * amp
                         + Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 40, H + 40);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, yBase - amp * 2, 0, yBase + amp * 2);
      grad.addColorStop(0,   hsl(hue, 85, 65, 0));
      grad.addColorStop(0.35, hsl(hue, 85, 65, 0.045));
      grad.addColorStop(0.6,  hsl(hue, 85, 55, 0.03));
      grad.addColorStop(1,   hsl(hue, 85, 50, 0));
      ctx.fillStyle = grad;
      ctx.fill();

      // Bright crest line
      ctx.beginPath();
      ctx.moveTo(-40, yBase);
      for (let x = -40; x <= W + 40; x += 4) {
        const y = yBase + Math.sin(x * freq + phase) * amp
                         + Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hsl(hue, 100, 85, 0.07);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── 5. NEBULA BLOBS ───────────────────────────────────────────────────────
  function initNebula() {
    layers.nebula = Array.from({ length: CFG.NEBULA_COUNT }, () => ({
      x:    R(0, W || 1920),
      y:    R(0, H || 1080),
      r:    R(W * 0.12, W * 0.28),
      hue:  randHue(),
      dh:   R(0.01, 0.04),       // hue drift speed
      vx:   R(-0.08, 0.08),
      vy:   R(-0.06, 0.06),
      alpha: R(0.04, 0.11),
    }));
  }

  function drawNebula(dt, o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    layers.nebula.forEach(n => {
      n.hue = (n.hue + n.dh) % 360;
      n.x  += n.vx;
      n.y  += n.vy;
      if (n.x < -n.r * 2) n.x = W + n.r;
      if (n.x > W + n.r)  n.x = -n.r;
      if (n.y < -n.r * 2) n.y = H + n.r;
      if (n.y > H + n.r)  n.y = -n.r;

      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0,    hsl(n.hue, 90, 60, n.alpha));
      g.addColorStop(0.45, hsl(n.hue, 80, 50, n.alpha * 0.4));
      g.addColorStop(1,    hsl(n.hue, 70, 40, 0));
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, TAU);
      ctx.fillStyle = g;
      ctx.fill();
    });

    ctx.restore();
  }

  // ── 6. HEX GRID PULSE ─────────────────────────────────────────────────────
  let hexCells = [];

  function buildHexGrid() {
    hexCells = [];
    const s  = CFG.HEX_SIZE;
    const w  = s * Math.sqrt(3);
    const h  = s * 2;
    const cols = Math.ceil(W / w) + 3;
    const rows = Math.ceil(H / (h * 0.75)) + 3;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * w + (row % 2 === 0 ? 0 : w * 0.5);
        const y = row * h * 0.75;
        hexCells.push({ x, y, hue: 0, alpha: 0, live: false });
      }
    }
  }

  function drawHex(x, y, s, ctx) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30);
      const px = x + s * Math.cos(a);
      const py = y + s * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHexGrid(elapsed, dt, o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    // Randomly light cells
    if (Math.random() < CFG.HEX_PULSE_RATE * dt) {
      const cell = hexCells[Ri(0, hexCells.length)];
      if (!cell.live) {
        cell.live  = true;
        cell.hue   = randHue();
        cell.alpha = R(0.08, 0.22);
        cell.decay = R(0.00025, 0.0008);
      }
    }

    hexCells.forEach(cell => {
      // Faint always-visible grid
      drawHex(cell.x, cell.y, CFG.HEX_SIZE, ctx);
      ctx.strokeStyle = 'rgba(139,92,246,0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Pulsed cell
      if (cell.live) {
        cell.alpha -= cell.decay * dt;
        if (cell.alpha <= 0) { cell.live = false; cell.alpha = 0; return; }

        drawHex(cell.x, cell.y, CFG.HEX_SIZE, ctx);
        ctx.strokeStyle = hsl(cell.hue, 100, 70, cell.alpha * 1.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        drawHex(cell.x, cell.y, CFG.HEX_SIZE * 0.85, ctx);
        ctx.fillStyle = hsl(cell.hue, 100, 60, cell.alpha * 0.35);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // ── 7. CONSTELLATION WEB ──────────────────────────────────────────────────
  function initNodes() {
    layers.nodes = Array.from({ length: CFG.NODE_COUNT }, () => ({
      x:    R(0, W || 1920),
      y:    R(0, H || 1080),
      vx:   R(-0.18, 0.18),
      vy:   R(-0.14, 0.14),
      r:    R(1, 3),
      hue:  randHue(),
      alpha: R(0.3, 0.7),
    }));
  }

  function drawNodes(dt, o) {
    ctx.save();
    ctx.translate(o.x, o.y);

    layers.nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.x = Math.max(0, Math.min(W, n.x));
      n.y = Math.max(0, Math.min(H, n.y));
    });

    // Connections
    for (let i = 0; i < layers.nodes.length; i++) {
      for (let j = i + 1; j < layers.nodes.length; j++) {
        const a = layers.nodes[i], b = layers.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.NODE_CONNECT_D) {
          const t = 1 - dist / CFG.NODE_CONNECT_D;
          const lineAlpha = t * t * 0.18;
          const midHue = (a.hue + b.hue) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hsl(midHue, 80, 70, lineAlpha);
          ctx.lineWidth = t * 1.2;
          ctx.stroke();
        }
      }
    }

    // Nodes
    layers.nodes.forEach(n => {
      // Glow
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      g.addColorStop(0, hsl(n.hue, 100, 80, n.alpha * 0.6));
      g.addColorStop(1, hsl(n.hue, 100, 60, 0));
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, TAU);
      ctx.fillStyle = g;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, TAU);
      ctx.fillStyle = hsl(n.hue, 80, 90, n.alpha);
      ctx.fill();
    });

    ctx.restore();
  }

  // ── RENDER LOOP ───────────────────────────────────────────────────────────
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (ts - lastFrame < FRAME_MS) return;   // ~30fps cap (Perf — choice #1)
    lastFrame = ts;
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const dt      = Math.min(ts - lastTime, 50);  // cap at 50ms (tab switch protection)
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);

    // Tuned to 4 subtle layers (choice #1). Hex grid / comets / glints disabled for tone + perf.
    drawNebula(dt, layerOffset(CFG.NEBULA_DEPTH));
    drawStars(dt, layerOffset(CFG.STAR_DEPTH_SPEED));
    drawAurora(elapsed, layerOffset(CFG.AURORA_DEPTH));
    drawNodes(dt, layerOffset(CFG.NODE_DEPTH));
  }

  // ── EVENT HANDLERS ────────────────────────────────────────────────────────
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onScroll() {
    scrollY = window.scrollY;
  }

  function onResize() {
    resize();
  }

  // Pause the rAF loop when the tab is hidden — no wasted CPU/battery (Perf audit P1)
  function onVisibility() {
    if (!attached) return;
    if (document.hidden) {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    } else if (raf == null) {
      lastTime = 0; lastFrame = 0;        // dt capped at 50ms; reset frame gate so resume draws immediately
      raf = requestAnimationFrame(loop);
    }
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  const FlashFusionBG = {
    init(selector) {
      if (attached) return;

      // Motion-accessibility gate: honor OS reduced-motion (audit P1 — JS loop is not covered by the CSS guard)
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('[FlashFusionBG] reduced-motion set — animation skipped');
        return;
      }

      // Mobile / coarse-pointer gate: skip the canvas on small or touch screens (Perf — choice #1: mobile-off)
      if (window.matchMedia && (window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches)) {
        console.log('[FlashFusionBG] mobile/touch — animation skipped');
        return;
      }

      canvas = document.createElement('canvas');
      canvas.style.cssText = [
        'position:fixed',
        'inset:0',
        'width:100%',
        'height:100%',
        'pointer-events:none',
        'z-index:0',
        'display:block',
      ].join(';');

      const target = selector
        ? document.querySelector(selector)
        : document.body;

      // Insert as first child so content renders above
      target.insertBefore(canvas, target.firstChild);

      ctx = canvas.getContext('2d');

      resize();
      initStars();
      initNebula();
      initNodes();

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('scroll',    onScroll,    { passive: true });
      window.addEventListener('resize',    onResize,    { passive: true });
      document.addEventListener('visibilitychange', onVisibility);

      raf = requestAnimationFrame(loop);
      attached = true;

      console.log('[FlashFusionBG] 4 layers running ✓');
    },

    destroy() {
      if (!attached) return;
      cancelAnimationFrame(raf);
      canvas.remove();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('resize',    onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      attached = false;
      console.log('[FlashFusionBG] destroyed');
    },

    // Expose config for runtime tuning
    config: CFG,
  };

  global.FlashFusionBG = FlashFusionBG;

})(typeof window !== 'undefined' ? window : global);
