/* ═══════════════════════════════════════════════════════════════════
   ABSTREKKT — Chapter Reader · state machine & treatments
   ═══════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const KEY = "abstrekkt.reader.v1";
  const vp = document.getElementById("viewport");
  const stateSel = document.getElementById("stateSel");
  const illum = document.getElementById("illum");
  const contrast = document.getElementById("contrast");
  const spotlight = document.getElementById("spotlight");

  // ── persisted prefs ──
  let prefs = { state:"chronology", illum:"flat", contrast:"normal" };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch(e){}
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch(e){} }

  function applyState(s){
    prefs.state = s; vp.setAttribute("data-state", s);
    stateSel.value = s;
    save(); drawConnectors();
  }
  function applyIllum(v){
    prefs.illum = v;
    [...illum.children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
    document.documentElement.style.setProperty("--spot", v === "spot" ? "1" : "0");
    save();
  }
  function applyContrast(v){
    prefs.contrast = v; vp.setAttribute("data-contrast", v);
    [...contrast.children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
    save();
  }

  stateSel.addEventListener("change", e => applyState(e.target.value));
  illum.addEventListener("click", e => { const b = e.target.closest("button"); if(b) applyIllum(b.dataset.v); });
  contrast.addEventListener("click", e => { const b = e.target.closest("button"); if(b) applyContrast(b.dataset.v); });

  // keyboard: [ ] cycle states
  const order = ["chronology","sensory","construction","hud","schematic","collage","forensic","blueprint"];
  document.addEventListener("keydown", e => {
    if(e.target.tagName === "SELECT") return;
    if(e.key === "]" || e.key === "["){
      const i = order.indexOf(prefs.state);
      const n = e.key === "]" ? (i+1)%order.length : (i-1+order.length)%order.length;
      applyState(order[n]);
    }
  });

  // ── spotlight follows pointer + scroll ──
  let px = 50, py = 42;
  window.addEventListener("pointermove", e => {
    px = (e.clientX / window.innerWidth) * 100;
    py = (e.clientY / window.innerHeight) * 100;
    spotlight.style.setProperty("--spot-x", px + "%");
    spotlight.style.setProperty("--spot-y", py + "%");
  }, { passive:true });

  // ── starfield (construction state) ──
  const cv = document.getElementById("starfield");
  const ctx = cv.getContext("2d");
  let stars = [], raf = null;
  function sizeStars(){
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const n = Math.floor((cv.width*cv.height)/9000);
    stars = Array.from({length:n}, () => ({
      x:Math.random()*cv.width, y:Math.random()*cv.height,
      r:Math.random()*1.3+0.2, a:Math.random()*0.6+0.1,
      tw:Math.random()*0.02+0.004, p:Math.random()*Math.PI*2
    }));
  }
  function tickStars(){
    raf = requestAnimationFrame(tickStars);
    if(prefs.state !== "construction"){ ctx.clearRect(0,0,cv.width,cv.height); return; }
    ctx.clearRect(0,0,cv.width,cv.height);
    for(const s of stars){
      s.p += s.tw;
      const a = s.a * (0.6 + 0.4*Math.sin(s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,226,171,${a})`;
      ctx.fill();
    }
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  sizeStars();
  if(!reduce) tickStars(); else { /* draw once */ for(const s of stars){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,226,171,${s.a})`; ctx.fill(); } }
  window.addEventListener("resize", () => { sizeStars(); drawConnectors(); }, { passive:true });

  // ── connector lines (schematic state): link side notes to their anchor sections ──
  const connector = document.getElementById("connector");
  function drawConnectors(){
    if(prefs.state !== "schematic"){ connector.innerHTML = ""; return; }
    const canvas = connector.closest(".canvas");
    const cb = canvas.getBoundingClientRect();
    connector.setAttribute("viewBox", `0 0 ${cb.width} ${cb.height}`);
    connector.setAttribute("width", cb.width);
    connector.setAttribute("height", cb.height);
    let svg = "";
    document.querySelectorAll("[data-anchor]").forEach(node => {
      const target = document.getElementById(node.dataset.anchor);
      if(!target) return;
      const nb = node.getBoundingClientRect(), tb = target.getBoundingClientRect();
      const x1 = (node.offsetParent ? nb.left : nb.left) - cb.left + (nb.left < cb.left + cb.width/2 ? nb.width : 0);
      const y1 = nb.top - cb.top + nb.height/2;
      const x2 = tb.left - cb.left + (nb.left < cb.left + cb.width/2 ? 0 : tb.width);
      const y2 = tb.top - cb.top + 24;
      const mx = (x1+x2)/2;
      svg += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="color-mix(in srgb,var(--secondary) 45%, transparent)" stroke-width="1" stroke-dasharray="3 4"/>`;
      svg += `<circle cx="${x1}" cy="${y1}" r="2.5" fill="var(--secondary)"/><circle cx="${x2}" cy="${y2}" r="2.5" fill="var(--secondary)"/>`;
    });
    connector.innerHTML = svg;
  }
  window.addEventListener("scroll", () => { if(prefs.state === "schematic") drawConnectors(); }, { passive:true });

  // ── figure: canvas-drawn lamp-lit desk of scraps (no external asset) ──
  const fig = document.getElementById("figscene");
  function paintFigure(){
    const w = fig.clientWidth || 600, h = fig.clientHeight || 450;
    const c = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w*dpr; c.height = h*dpr;
    const x = c.getContext("2d"); x.scale(dpr,dpr);
    // dark desk
    x.fillStyle = "#0a0908"; x.fillRect(0,0,w,h);
    // lamp cone from top
    const cone = x.createRadialGradient(w*0.5, h*0.05, 10, w*0.5, h*0.55, h*0.85);
    cone.addColorStop(0, "rgba(255,226,171,0.55)");
    cone.addColorStop(0.35, "rgba(255,191,0,0.14)");
    cone.addColorStop(1, "rgba(255,191,0,0)");
    x.fillStyle = cone; x.beginPath();
    x.moveTo(w*0.5, 0); x.lineTo(w*0.5 - w*0.42, h); x.lineTo(w*0.5 + w*0.42, h); x.closePath(); x.fill();
    // hot bulb
    x.fillStyle = "rgba(255,238,200,0.95)"; x.beginPath(); x.arc(w*0.5, h*0.06, 3.5, 0, Math.PI*2); x.fill();
    // scattered "photos / scraps" as faint parallelograms on the desk
    const scraps = [[0.34,0.62,70,52,-8],[0.46,0.7,84,58,5],[0.6,0.64,64,46,12],[0.52,0.58,58,40,-4],[0.42,0.78,76,50,3]];
    for(const [fx,fy,sw,sh,rot] of scraps){
      x.save();
      x.translate(w*fx, h*fy); x.rotate(rot*Math.PI/180);
      const lit = 0.10 + 0.22*(1 - Math.abs(fx-0.5)*1.4);
      x.fillStyle = `rgba(220,205,180,${lit})`;
      x.fillRect(-sw/2, -sh/2, sw, sh);
      x.strokeStyle = `rgba(255,226,171,${lit*0.6})`; x.lineWidth = 0.5;
      x.strokeRect(-sw/2, -sh/2, sw, sh);
      x.restore();
    }
    // vignette
    const vig = x.createRadialGradient(w*0.5, h*0.5, h*0.3, w*0.5, h*0.5, h*0.85);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.7)");
    x.fillStyle = vig; x.fillRect(0,0,w,h);
    fig.style.backgroundImage = `url(${c.toDataURL("image/png")})`;
    fig.style.backgroundSize = "cover";
    fig.style.backgroundPosition = "center";
  }

  // ── init ──
  applyState(prefs.state);
  applyIllum(prefs.illum);
  applyContrast(prefs.contrast);
  paintFigure();
  // connectors need a tick after layout settles
  requestAnimationFrame(() => requestAnimationFrame(drawConnectors));
  let rt = null;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { paintFigure(); drawConnectors(); }, 150); });
})();
