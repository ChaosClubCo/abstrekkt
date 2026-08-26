import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg:'#0F0618', raised:'#1A0B2E', overlay:'#251443',
  p:'#A855F7', pk:'#F472B6', cy:'#22D3EE',
  t1:'#F8FAFC', t2:'#CBD5E1', t3:'#64748B',
  grad:'linear-gradient(90deg,#A855F7 0%,#F472B6 55%,#22D3EE 100%)',
  bord:'rgba(168,85,247,0.2)', bordA:'rgba(168,85,247,0.4)',
  glow:'0 0 20px rgba(168,85,247,0.4)',
};

// ─── CANVAS HOOK ─────────────────────────────────────────────────────────────
// wrapRef = sized container; canvasRef = canvas inside it.
// Tries every sizing method; falls back to 400×300 so content always renders.
function useCanvas(draw) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const fn = useRef(draw);
  fn.current = draw;

  useEffect(() => {
    const wrap = wrapRef.current;
    const c    = canvasRef.current;
    if (!wrap || !c) return;
    const ctx = c.getContext('2d');
    let raf;

    function sz() {
      const r = wrap.getBoundingClientRect();
      const w = (r.width  > 1 ? r.width  : wrap.offsetWidth  || wrap.clientWidth  || 400) | 0;
      const h = (r.height > 1 ? r.height : wrap.offsetHeight || wrap.clientHeight || 300) | 0;
      return { w: w || 400, h: h || 300 };
    }

    function loop(t) {
      const { w, h } = sz();
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      fn.current(ctx, c, t);
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { wrapRef, canvasRef };
}

// ─── TEMPLATES ───────────────────────────────────────────────────────────────
const TEMPLATES = [
  {id:'dotted',    label:'Dotted Attractor'},
  {id:'shader',    label:'Shader Gradient'},
  {id:'lamp',      label:'Lamp Animation'},
  {id:'lelo',      label:'LeLo SaaS Landing'},
  {id:'gallery3d', label:'3D Gallery'},
  {id:'artslider', label:'Art Gallery Slider'},
  {id:'ascii',     label:'ASCII Ripple'},
  {id:'aistates',  label:'AI States'},
  {id:'martian',   label:'Martian Parallax'},
  {id:'infinite',  label:'Infinite Scroll'},
  {id:'v2ascii',   label:'Video to ASCII'},
  {id:'spotlight', label:'Spotlight'},
  {id:'jellyfish', label:'Jellyfish'},
  {id:'apple3d',   label:'Apple 3D Explode'},
  {id:'badge',     label:'Event Badge'},
  {id:'graphene',  label:'Graphene 3D'},
  {id:'cardscan',  label:'Card Scan'},
  {id:'sensory',   label:'Sensory Playground'},
  {id:'liquid',    label:'Viscous Liquid'},
  {id:'pathfollow',label:'Follow Path'},
  {id:'studio3d',  label:'3D Studio'},
  {id:'chatbot',   label:'AI Chatbot'},
  {id:'scrollpage',label:'Scroll Page'},
];

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.35); border-radius: 2px; }
.glass { background: rgba(15,6,24,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(168,85,247,0.2); border-radius: 16px; }
@keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
@keyframes pGlow   { 0%,100%{box-shadow:0 0 20px rgba(168,85,247,0.3)} 50%{box-shadow:0 0 55px rgba(168,85,247,0.9)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes marq    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes marqR   { from{transform:translateX(-50%)} to{transform:translateX(0)} }
@keyframes scan    { 0%{top:-4px} 100%{top:105%} }
@keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes slidein { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
@keyframes sdot    { to{transform:rotate(360deg)} }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:0.01ms!important; transition-duration:0.01ms!important } }
`;

// Absolute-fill wrapper, forwards all props including event handlers
const Fill = ({ children, style = {}, ...rest }) => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden', ...style }} {...rest}>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 01  DOTTED SURFACE ATTRACTOR
// ─────────────────────────────────────────────────────────────────────────────
function DottedAttractor() {
  const mouseRef  = useRef({ x:-9999, y:-9999 });
  const ripplesRef = useRef([]);
  const dotsRef   = useRef([]);
  const prevSz    = useRef({ w:0, h:0 });

  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    const { width:W, height:H } = c;
    if (W !== prevSz.current.w || H !== prevSz.current.h) {
      dotsRef.current = [];
      const COLS=34, ROWS=20;
      for (let i=0;i<COLS;i++) for (let j=0;j<ROWS;j++) {
        const ox=(i/(COLS-1))*W, oy=(j/(ROWS-1))*H;
        dotsRef.current.push({ ox,oy,x:ox,y:oy,vx:0,vy:0 });
      }
      prevSz.current = { w:W, h:H };
    }
    ctx.clearRect(0,0,W,H);
    const { x:mx, y:my } = mouseRef.current;
    ripplesRef.current = ripplesRef.current.filter(r => r.age < 110);
    ripplesRef.current.forEach(r => r.age++);
    dotsRef.current.forEach(d => {
      const dx=mx-d.x, dy=my-d.y, dist=Math.hypot(dx,dy);
      if (dist<150&&dist>0) { const f=(1-dist/150)*0.3; d.vx+=dx*f; d.vy+=dy*f; }
      ripplesRef.current.forEach(r => {
        const rdx=d.x-r.x, rdy=d.y-r.y, rd=Math.hypot(rdx,rdy);
        const wave=r.age*3.5, diff=Math.abs(rd-wave);
        if (diff<20&&rd>0) { const s=(1-diff/20)*(1-r.age/110)*5; d.vx+=(rdx/rd)*s; d.vy+=(rdy/rd)*s; }
      });
      d.vx+=(d.ox-d.x)*0.06; d.vy+=(d.oy-d.y)*0.06;
      d.vx*=0.83; d.vy*=0.83; d.x+=d.vx; d.y+=d.vy;
      const disp=Math.min(Math.hypot(d.x-d.ox,d.y-d.oy)/38,1);
      ctx.beginPath(); ctx.arc(d.x,d.y,1.4+disp*2.6,0,Math.PI*2);
      ctx.fillStyle=`rgba(${Math.round(168+disp*80)},${Math.round(85+disp*30)},${Math.round(247-disp*70)},${0.3+disp*0.7})`;
      ctx.fill();
    });
    ripplesRef.current.forEach(r => {
      ctx.beginPath(); ctx.arc(r.x,r.y,r.age*3.5,0,Math.PI*2);
      ctx.strokeStyle=`rgba(168,85,247,${Math.max(0,0.5-r.age/110)})`;
      ctx.lineWidth=1.5; ctx.stroke();
    });
  });

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const mv = e => { const r=c.getBoundingClientRect(); mouseRef.current={x:e.clientX-r.left,y:e.clientY-r.top}; };
    const cl = e => { const r=c.getBoundingClientRect(); ripplesRef.current.push({x:e.clientX-r.left,y:e.clientY-r.top,age:0}); };
    c.addEventListener('mousemove',mv); c.addEventListener('click',cl);
    c.addEventListener('mouseleave',()=>{ mouseRef.current={x:-9999,y:-9999}; });
    return () => { c.removeEventListener('mousemove',mv); c.removeEventListener('click',cl); };
  }, []);

  return (
    <Fill style={{ background:C.bg, cursor:'crosshair' }}>
      <div ref={wrapRef} style={{ position:'absolute', inset:0 }}>
        <canvas ref={canvasRef} style={{ display:'block' }} />
      </div>
      <p style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', fontFamily:'JetBrains Mono', fontSize:10, color:C.t3, letterSpacing:'0.1em', pointerEvents:'none', whiteSpace:'nowrap' }}>HOVER · CLICK TO RIPPLE</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02  SHADER GRADIENT
// ─────────────────────────────────────────────────────────────────────────────
function ShaderGradient() {
  const t = useRef(0);
  const BLOBS = [
    {cx:0.28,cy:0.3,r:0.42,sx:0.7,sy:0.5,ph:0,col:[168,85,247]},
    {cx:0.72,cy:0.2,r:0.38,sx:0.5,sy:0.8,ph:2.1,col:[244,114,182]},
    {cx:0.5,cy:0.7,r:0.46,sx:0.6,sy:0.4,ph:4.2,col:[34,211,238]},
    {cx:0.2,cy:0.6,r:0.34,sx:0.9,sy:0.6,ph:1.0,col:[168,85,247]},
    {cx:0.8,cy:0.75,r:0.36,sx:0.4,sy:0.7,ph:3.1,col:[244,114,182]},
  ];
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    t.current += 0.005; const T=t.current;
    const {width:W,height:H}=c;
    ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    BLOBS.forEach(b => {
      const cx=W*(b.cx+0.17*Math.sin(T*b.sx+b.ph)), cy=H*(b.cy+0.17*Math.cos(T*b.sy+b.ph));
      const r=Math.min(W,H)*(b.r+0.07*Math.sin(T*0.4+b.ph));
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,`rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.36)`);
      g.addColorStop(1,`rgba(${b.col[0]},${b.col[1]},${b.col[2]},0)`);
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });
    for(let i=0;i<240;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.014})`;ctx.fillRect(Math.random()*W,Math.random()*H,1,1);}
  });
  return (
    <Fill>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}>
        <canvas ref={canvasRef} style={{display:'block'}}/>
      </div>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none',gap:8}}>
        <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:46,lineHeight:1,textAlign:'center',background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Shader<br/>Gradient</div>
        <div style={{fontFamily:'Inter',fontSize:11,color:C.t2,letterSpacing:'0.12em'}}>ANIMATED MESH · PAPER GRAIN</div>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03  LAMP ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
function LampAnim() {
  const [open,setOpen]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setOpen(true),500);return()=>clearTimeout(t);},[]);
  const sp=open?175:18, ht=open?290:55;
  return (
    <Fill style={{background:'#030109',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:2,height:70,background:`linear-gradient(${C.t3},rgba(168,85,247,0.5))`,position:'absolute',top:0,left:'50%',transform:'translateX(-50%)'}}/>
      <div style={{position:'absolute',top:66,left:'50%',transform:'translateX(-50%)',animation:'pGlow 3s ease-in-out infinite'}}>
        <svg width="100" height="80" viewBox="0 0 100 80" overflow="visible">
          <defs><linearGradient id="shg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#251443"/><stop offset="100%" stopColor="#1A0B2E"/></linearGradient></defs>
          <line x1="50" y1="68" x2="10" y2="10" stroke="rgba(168,85,247,0.55)" strokeWidth="1.5"
            style={{transformOrigin:'50px 68px',transform:open?'rotate(0)':'rotate(28deg)',transition:'transform 1.3s cubic-bezier(0.34,1.56,0.64,1)'}}/>
          <line x1="50" y1="68" x2="90" y2="10" stroke="rgba(168,85,247,0.55)" strokeWidth="1.5"
            style={{transformOrigin:'50px 68px',transform:open?'rotate(0)':'rotate(-28deg)',transition:'transform 1.3s cubic-bezier(0.34,1.56,0.64,1)'}}/>
          <polygon points="50,68 10,10 90,10" fill="url(#shg)" stroke="rgba(168,85,247,0.4)" strokeWidth="1"
            style={{transformOrigin:'50px 68px',transform:open?'scaleX(1)':'scaleX(0.08)',transition:'transform 1.3s cubic-bezier(0.34,1.56,0.64,1)'}}/>
          <circle cx="50" cy="68" r="6" fill={C.p} style={{filter:`drop-shadow(0 0 ${open?14:3}px ${C.p})`,transition:'filter 1s ease'}}/>
        </svg>
      </div>
      <div style={{position:'absolute',top:144,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:`${sp}px solid transparent`,borderRight:`${sp}px solid transparent`,borderTop:`${ht}px solid rgba(168,85,247,0.07)`,filter:'blur(10px)',transition:'border-width 1.4s cubic-bezier(0.34,1.56,0.64,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:144,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:`${Math.round(sp*0.45)}px solid transparent`,borderRight:`${Math.round(sp*0.45)}px solid transparent`,borderTop:`${Math.round(ht*0.88)}px solid rgba(168,85,247,0.14)`,filter:'blur(4px)',transition:'border-width 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.08s',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',height:22,width:open?310:36,background:'radial-gradient(ellipse,rgba(168,85,247,0.26),transparent 70%)',transition:'width 1.4s cubic-bezier(0.34,1.56,0.64,1)',filter:'blur(6px)',pointerEvents:'none'}}/>
      <button onClick={()=>setOpen(p=>!p)} style={{position:'absolute',bottom:14,padding:'5px 18px',borderRadius:7,background:'transparent',border:`1px solid ${C.bord}`,color:C.t3,fontFamily:'Inter',fontSize:11,cursor:'pointer'}}>{open?'CLOSE':'OPEN'}</button>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 04  LELO SAAS LANDING
// ─────────────────────────────────────────────────────────────────────────────
function LeLoSaas() {
  const words=['automate.','execute.','ship.','scale.'];
  const [wi,setWi]=useState(0); const [fade,setFade]=useState(true);
  useEffect(()=>{
    const t=setInterval(()=>{setFade(false);setTimeout(()=>{setWi(p=>(p+1)%words.length);setFade(true);},200);},2000);
    return()=>clearInterval(t);
  },[]);
  const feats=[{i:'⚡',t:'Instant Deploy',d:'One-click to prod'},{i:'🧠',t:'AI Orchestration',d:'Agents run your stack'},{i:'📈',t:'Zero-cost Scale',d:'Pay only on use'}];
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,gap:13}}>
      <div style={{position:'absolute',top:'5%',left:'8%',width:220,height:220,borderRadius:'50%',background:'rgba(168,85,247,0.07)',filter:'blur(55px)',animation:'float 7s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'5%',right:'8%',width:175,height:175,borderRadius:'50%',background:'rgba(34,211,238,0.05)',filter:'blur(45px)',animation:'float 9s ease-in-out infinite 2s',pointerEvents:'none'}}/>
      <div style={{position:'relative',display:'inline-flex',alignItems:'center',gap:5,padding:'4px 13px',borderRadius:999,background:'rgba(168,85,247,0.1)',border:`1px solid ${C.bord}`,fontSize:9,letterSpacing:'0.14em',color:C.p,fontFamily:'JetBrains Mono'}}>✦ NOW IN BETA</div>
      <div style={{position:'relative',textAlign:'center'}}>
        <h1 style={{fontFamily:'Poppins',fontWeight:700,fontSize:32,lineHeight:1.15,color:C.t1}}>Build AI products that</h1>
        <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:32,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',opacity:fade?1:0,transition:'opacity 0.2s',minHeight:42}}>{words[wi]}</div>
      </div>
      <div style={{position:'relative',display:'flex',gap:9}}>
        <button style={{padding:'9px 21px',borderRadius:11,background:C.grad,color:'#fff',fontFamily:'Poppins',fontWeight:600,fontSize:12,border:'none',cursor:'pointer',boxShadow:C.glow}}>Get Started Free</button>
        <button style={{padding:'9px 19px',borderRadius:11,background:'transparent',color:C.t2,fontFamily:'Inter',fontSize:12,border:`1px solid ${C.bord}`,cursor:'pointer'}}>View Demo →</button>
      </div>
      <div style={{position:'relative',display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',maxWidth:440}}>
        {feats.map((f,i)=>(
          <div key={i} className="glass" style={{padding:'12px 14px',flex:1,minWidth:110,animation:`fadeUp 0.4s ${i*0.08+0.1}s both`}}>
            <div style={{fontSize:18,marginBottom:5}}>{f.i}</div>
            <div style={{fontFamily:'Poppins',fontWeight:600,fontSize:11,color:C.t1,marginBottom:2}}>{f.t}</div>
            <div style={{fontSize:10,color:C.t3}}>{f.d}</div>
          </div>
        ))}
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05  3D GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function Gallery3D() {
  const items=[
    {label:'Neon Series',bg:'linear-gradient(135deg,#A855F7,#0F0618)'},
    {label:'Midnight',   bg:'linear-gradient(135deg,#F472B6,#1A0B2E)'},
    {label:'Cyan Depths',bg:'linear-gradient(135deg,#22D3EE,#0F0618)'},
    {label:'Aurora',     bg:'linear-gradient(135deg,#A855F7,#22D3EE)'},
    {label:'Static',     bg:'linear-gradient(135deg,#F472B6,#A855F7)'},
  ];
  const [active,setActive]=useState(0); const N=items.length;
  const cStyle=i=>{
    const off=((i-active)%N+N)%N, norm=off>N/2?off-N:off;
    return {position:'absolute',width:162,height:220,borderRadius:14,background:items[i].bg,border:`1px solid ${C.bord}`,
      transform:`perspective(800px) rotateY(${norm*(360/N)}deg) translateZ(-148px) scale(${off===0?1:0.72})`,
      opacity:off===0?1:Math.abs(norm)===1?0.5:0.18,transition:'all 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
      cursor:'pointer',display:'flex',alignItems:'flex-end',padding:11,boxShadow:off===0?C.glow:'none'};
  };
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:22}}>
      <h3 style={{fontFamily:'Poppins',fontWeight:700,fontSize:17,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Photography</h3>
      <div style={{position:'relative',width:240,height:250,display:'flex',alignItems:'center',justifyContent:'center'}}>
        {items.map((item,i)=>(
          <div key={i} style={cStyle(i)} onClick={()=>setActive(i)}>
            <span style={{fontFamily:'Poppins',fontWeight:600,fontSize:10,color:'rgba(255,255,255,0.8)'}}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button onClick={()=>setActive(p=>(p-1+N)%N)} style={{width:32,height:32,borderRadius:'50%',background:C.raised,border:`1px solid ${C.bord}`,color:C.t1,cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        {items.map((_,i)=><div key={i} onClick={()=>setActive(i)} style={{width:6,height:6,borderRadius:'50%',background:i===active?C.p:C.overlay,border:`1px solid ${C.bord}`,cursor:'pointer',transition:'all 0.2s'}}/>)}
        <button onClick={()=>setActive(p=>(p+1)%N)} style={{width:32,height:32,borderRadius:'50%',background:C.raised,border:`1px solid ${C.bord}`,color:C.t1,cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 06  ART GALLERY SLIDER
// ─────────────────────────────────────────────────────────────────────────────
function ArtSlider() {
  const trackRef=useRef(null);
  const drag=useRef({on:false,startX:0,startScroll:0,vel:0,lastX:0});
  const rafRef=useRef(null);
  const panels=[
    {t:'Void I',   s:'Abstract',bg:'radial-gradient(circle at 30% 50%,#A855F7,#0F0618 65%)'},
    {t:'Bloom II', s:'Macro',   bg:'radial-gradient(circle at 70% 30%,#F472B6,#1A0B2E 65%)'},
    {t:'Depth III',s:'Long Exp',bg:'radial-gradient(circle at 50% 70%,#22D3EE,#050210 65%)'},
    {t:'Neon IV',  s:'Urban',   bg:'radial-gradient(circle at 20% 80%,#A855F7,#F472B6 40%,#0F0618 70%)'},
    {t:'Static V', s:'Digital', bg:'radial-gradient(circle at 80% 20%,#22D3EE,#A855F7 50%,#0F0618 70%)'},
  ];
  useEffect(()=>{
    const loop=()=>{if(!drag.current.on&&Math.abs(drag.current.vel)>0.3&&trackRef.current){trackRef.current.scrollLeft+=drag.current.vel;drag.current.vel*=0.92;}rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(rafRef.current);
  },[]);
  const dn=e=>{drag.current={on:true,startX:e.clientX,startScroll:trackRef.current.scrollLeft,vel:0,lastX:e.clientX};};
  const mv=e=>{if(!drag.current.on)return;drag.current.vel=(drag.current.lastX-e.clientX)*0.6;drag.current.lastX=e.clientX;trackRef.current.scrollLeft=drag.current.startScroll+(drag.current.startX-e.clientX);};
  const mask='linear-gradient(90deg,transparent,black 12%,black 88%,transparent)';
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <div style={{padding:'0 20px 12px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <h3 style={{fontFamily:'Poppins',fontWeight:700,fontSize:16,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Gallery</h3>
        <span style={{fontFamily:'JetBrains Mono',fontSize:9,color:C.t3,letterSpacing:'0.12em'}}>DRAG</span>
      </div>
      <div ref={trackRef} onMouseDown={dn} onMouseMove={mv} onMouseUp={()=>{drag.current.on=false;}} onMouseLeave={()=>{drag.current.on=false;}}
        style={{display:'flex',gap:12,padding:'0 20px 20px',overflowX:'auto',cursor:'grab',userSelect:'none',scrollbarWidth:'none',maskImage:mask,WebkitMaskImage:mask}}>
        {panels.map((p,i)=>(
          <div key={i} style={{flexShrink:0,width:178,height:248,borderRadius:14,background:p.bg,border:`1px solid ${C.bord}`,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:13}}>
            <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:13,color:C.t1}}>{p.t}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',fontFamily:'Inter',marginTop:2}}>{p.s}</div>
          </div>
        ))}
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 07  ASCII WATER RIPPLE
// ─────────────────────────────────────────────────────────────────────────────
function AsciiRipple() {
  const rRef=useRef([]); const tRef=useRef(0); const CHARS=' .·:;+*#@';
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    tRef.current+=0.036; const T=tRef.current, {width:W,height:H}=c;
    ctx.clearRect(0,0,W,H);
    const CW=10, CH=14; ctx.font=`${CH-2}px 'JetBrains Mono',monospace`;
    const cols=Math.floor(W/CW), rows=Math.floor(H/CH);
    rRef.current=rRef.current.filter(r=>r.age<95); rRef.current.forEach(r=>r.age++);
    for(let row=0;row<rows;row++) for(let col=0;col<cols;col++){
      const px=col*CW, py=row*CH;
      let v=(Math.sin(col*0.27+T)*Math.cos(row*0.27+T*0.63)+1)*0.14;
      rRef.current.forEach(r=>{const d=Math.hypot(px-r.x,py-r.y);const amp=Math.max(0,1-r.age/95)*Math.max(0,1-d/210);v+=Math.max(0,amp*Math.sin(d*0.13-r.age*0.38)*2.2);});
      v=Math.min(Math.max(v,0),1);
      const ci=Math.min(Math.floor(v*CHARS.length),CHARS.length-1);
      ctx.fillStyle=`rgba(${Math.round(168+v*80)},${Math.round(85+v*30)},${Math.round(247-v*80)},${0.22+v*0.78})`;
      ctx.fillText(CHARS[ci],px,py+CH);
    }
  });
  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const cl=e=>{const r=c.getBoundingClientRect();rRef.current.push({x:e.clientX-r.left,y:e.clientY-r.top,age:0});};
    c.addEventListener('click',cl); return()=>c.removeEventListener('click',cl);
  },[]);
  return (
    <Fill style={{background:C.bg,cursor:'crosshair'}}>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      <p style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em',pointerEvents:'none'}}>CLICK TO RIPPLE</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 08  AI ANIMATION STATES
// ─────────────────────────────────────────────────────────────────────────────
function AIStates() {
  const STATES=['idle','thinking','responding','complete'];
  const [st,setSt]=useState('idle'); const stRef=useRef('idle'); stRef.current=st;
  const tRef=useRef(0);
  const COL={idle:[168,85,247],thinking:[244,114,182],responding:[34,211,238],complete:[74,222,128]};
  const LABEL={idle:'● Idle',thinking:'◌ Thinking…',responding:'◎ Responding',complete:'✓ Complete'};
  const CCSS={idle:C.p,thinking:C.pk,responding:C.cy,complete:'#4ade80'};
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    tRef.current+=0.042; const T=tRef.current; const {width:W,height:H}=c;
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2-14, s=stRef.current, [cr,cg,cb]=COL[s];
    const orbR=s==='thinking'?30+Math.sin(T*3)*5:28;
    const og=ctx.createRadialGradient(cx,cy,0,cx,cy,orbR);
    og.addColorStop(0,`rgba(${cr},${cg},${cb},0.95)`); og.addColorStop(0.5,`rgba(${cr},${cg},${cb},0.4)`); og.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);
    ctx.beginPath(); ctx.arc(cx,cy,orbR,0,Math.PI*2); ctx.fillStyle=og; ctx.fill();
    const rings=s==='responding'?5:s==='thinking'?3:2;
    for(let i=0;i<rings;i++){
      const ph=T*(s==='responding'?1.6:1.2)+i*(Math.PI*2/rings);
      const rr=orbR+18+i*14+Math.sin(T*2+i)*4;
      ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${cr},${cg},${cb},${Math.max(0,0.38-i*0.07+0.1*Math.sin(T+i))})`; ctx.lineWidth=1.5; ctx.stroke();
      if(s==='thinking'){ctx.beginPath();ctx.arc(cx+Math.cos(ph)*rr,cy+Math.sin(ph)*rr,4,0,Math.PI*2);ctx.fillStyle='rgba(244,114,182,0.9)';ctx.fill();}
    }
    if(s==='complete'){ctx.strokeStyle='rgba(74,222,128,0.8)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx-10,cy);ctx.lineTo(cx-3,cy+8);ctx.lineTo(cx+12,cy-9);ctx.stroke();}
  });
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:13}}>
      <div style={{width:'100%',height:190,position:'relative',flexShrink:0}}>
        <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      </div>
      <div style={{fontFamily:'JetBrains Mono',fontSize:12,color:CCSS[st]}}>{LABEL[st]}</div>
      <div style={{display:'flex',gap:7,flexWrap:'wrap',justifyContent:'center'}}>
        {STATES.map(s=><button key={s} onClick={()=>setSt(s)} style={{padding:'6px 13px',borderRadius:7,fontSize:11,fontFamily:'Inter',cursor:'pointer',background:st===s?'rgba(168,85,247,0.12)':'transparent',border:`1px solid ${st===s?CCSS[s]:C.bord}`,color:st===s?CCSS[s]:C.t3,transition:'all 0.2s'}}>{s}</button>)}
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 09  MARTIAN PARALLAX  — explicit JSX layers, no helper function
// ─────────────────────────────────────────────────────────────────────────────
function MartianParallax() {
  const target=useRef({x:0,y:0}); const cur=useRef({x:0,y:0});
  const [pos,setPos]=useState({x:0,y:0}); const rafRef=useRef(null);
  const stars=useMemo(()=>Array.from({length:70},(_,i)=>({x:`${(i*43+11)%100}%`,y:`${(i*57+7)%100}%`,s:i%3===0?2:1})),[]);
  useEffect(()=>{
    const loop=()=>{cur.current.x+=(target.current.x-cur.current.x)*0.055;cur.current.y+=(target.current.y-cur.current.y)*0.055;setPos({x:cur.current.x,y:cur.current.y});rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop); return()=>cancelAnimationFrame(rafRef.current);
  },[]);
  const onMove=e=>{const r=e.currentTarget.getBoundingClientRect();target.current={x:(e.clientX-r.left-r.width/2)/r.width,y:(e.clientY-r.top-r.height/2)/r.height};};
  const lyr=(d,s={})=>({position:'absolute',inset:'-8%',width:'116%',height:'116%',transform:`translate(${pos.x*d*22}px,${pos.y*d*14}px)`,willChange:'transform',...s});
  return (
    <Fill style={{background:'#030109',cursor:'crosshair'}} onMouseMove={onMove}>
      {/* Stars */}
      <div style={lyr(0.08)}>
        {stars.map((s,i)=><div key={i} style={{position:'absolute',left:s.x,top:s.y,width:s.s,height:s.s,borderRadius:'50%',background:'rgba(255,255,255,0.55)'}}/>)}
      </div>
      {/* Fog */}
      <div style={lyr(0.22,{display:'flex',alignItems:'center',justifyContent:'center'})}>
        <div style={{width:470,height:175,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(168,85,247,0.07),transparent)',filter:'blur(24px)'}}/>
      </div>
      {/* Planet */}
      <div style={lyr(0.7,{display:'flex',alignItems:'flex-start',justifyContent:'flex-end'})}>
        <div style={{width:92,height:92,borderRadius:'50%',background:'radial-gradient(circle at 35% 35%,#3b1863,#0F0618)',boxShadow:'0 0 30px rgba(168,85,247,0.3)',marginTop:'14%',marginRight:'14%'}}/>
      </div>
      {/* Rocks */}
      <div style={lyr(0.48,{display:'flex',alignItems:'flex-end'})}>
        <svg width="100%" height="175" viewBox="0 0 800 175" preserveAspectRatio="none">
          <polygon points="0,175 95,50 200,175" fill="#1A0B2E" opacity="0.9"/>
          <polygon points="165,175 320,13 480,175" fill="#251443" opacity="0.8"/>
          <polygon points="435,175 565,66 680,175" fill="#1A0B2E" opacity="0.9"/>
          <polygon points="615,175 730,30 800,104 800,175" fill="#251443" opacity="0.7"/>
        </svg>
      </div>
      {/* Text */}
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none',transform:`translate(${pos.x*2.5}px,${pos.y*2}px)`}}>
        <h2 style={{fontFamily:'Poppins',fontWeight:700,fontSize:28,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',textAlign:'center'}}>Beyond the Void</h2>
        <p style={{color:C.t3,fontSize:10,letterSpacing:'0.18em',marginTop:8,fontFamily:'JetBrains Mono'}}>MOVE CURSOR</p>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10  INFINITE SCROLLING
// ─────────────────────────────────────────────────────────────────────────────
function InfiniteScroll() {
  const row1=[{bg:'linear-gradient(135deg,#A855F7,#1A0B2E)',l:'Studio A'},{bg:'linear-gradient(135deg,#F472B6,#251443)',l:'Bloom'},{bg:'linear-gradient(135deg,#22D3EE,#0F0618)',l:'Depths'},{bg:'linear-gradient(135deg,#A855F7,#22D3EE)',l:'Aurora'},{bg:'linear-gradient(135deg,#F472B6,#A855F7)',l:'Static'},{bg:'linear-gradient(135deg,#22D3EE,#F472B6)',l:'Wave'}];
  const mask='linear-gradient(90deg,transparent,black 14%,black 86%,transparent)';
  const Card=({item})=>(<div style={{flexShrink:0,width:144,height:95,borderRadius:10,background:item.bg,border:`1px solid ${C.bord}`,display:'flex',alignItems:'flex-end',padding:8,margin:'0 5px'}}><span style={{fontFamily:'Poppins',fontWeight:600,fontSize:9,color:'rgba(255,255,255,0.7)'}}>{item.l}</span></div>);
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',justifyContent:'center',gap:10}}>
      <div style={{textAlign:'center'}}><h3 style={{fontFamily:'Poppins',fontWeight:700,fontSize:15,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>FlashFusion Gallery</h3></div>
      {[row1,[...row1].reverse()].map((row,ri)=>(
        <div key={ri} style={{overflow:'hidden',maskImage:mask,WebkitMaskImage:mask}}>
          <div style={{display:'flex',animation:`${ri===0?'marq':'marqR'} ${ri===0?26:32}s linear infinite`}}>
            {[...row,...row].map((item,i)=><Card key={i} item={item}/>)}
          </div>
        </div>
      ))}
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11  VIDEO TO ASCII  — demo mode only
// ─────────────────────────────────────────────────────────────────────────────
function VideoASCII() {
  const canvasRef=useRef(null); const tRef=useRef(0); const CHARS=' .:-=+*#%@';
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return; const ctx=c.getContext('2d'); let raf;
    const loop=()=>{
      const p=c.parentElement; c.width=Math.max(p.offsetWidth||p.clientWidth||400,1); c.height=Math.max(p.offsetHeight||p.clientHeight||300,1);
      const W=c.width,H=c.height; ctx.clearRect(0,0,W,H);
      tRef.current+=0.028; const T=tRef.current;
      const CW=8,CH=12,cols=Math.floor(W/CW),rows=Math.floor(H/CH);
      ctx.font=`${CH-1}px 'JetBrains Mono',monospace`;
      for(let r=0;r<rows;r++) for(let col=0;col<cols;col++){
        const nx=(col/cols)*2-1, ny=(r/rows)*2-1;
        const bri=Math.max(0,Math.min(1,(1-Math.abs(Math.hypot(nx*1.1,ny)-0.72+Math.sin(nx*8+T)*Math.cos(ny*8+T*0.7)*0.5))*0.85+0.1));
        const ci=Math.min(Math.floor(bri*CHARS.length),CHARS.length-1);
        ctx.fillStyle=`rgba(168,85,247,${0.18+bri*0.82})`; ctx.fillText(CHARS[ci],col*CW,r*CH+CH);
      }
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop); return()=>cancelAnimationFrame(raf);
  },[]);
  return (
    <Fill style={{background:C.bg}}>
      <div style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      <p style={{position:'absolute',top:12,left:'50%',transform:'translateX(-50%)',fontFamily:'JetBrains Mono',fontSize:9,color:C.t3,letterSpacing:'0.1em',pointerEvents:'none',whiteSpace:'nowrap'}}>ASCII DEMO</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12  ANIMATED SPOTLIGHT
// ─────────────────────────────────────────────────────────────────────────────
function Spotlight() {
  const [spot,setSpot]=useState({x:'50%',y:'45%'});
  const onMove=e=>{const r=e.currentTarget.getBoundingClientRect();setSpot({x:`${e.clientX-r.left}px`,y:`${e.clientY-r.top}px`});};
  return (
    <Fill style={{background:'#020108',cursor:'none'}} onMouseMove={onMove}>
      <div style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gridTemplateRows:'repeat(4,1fr)',gap:3,padding:8}}>
        {Array.from({length:20},(_,i)=>(
          <div key={i} className="glass" style={{borderRadius:8,padding:8,display:'flex',flexDirection:'column',gap:4}}>
            <div style={{height:6,width:'60%',borderRadius:3,background:'rgba(168,85,247,0.2)'}}/>
            <div style={{height:5,width:'80%',borderRadius:3,background:'rgba(168,85,247,0.1)'}}/>
            <div style={{height:5,width:'45%',borderRadius:3,background:'rgba(168,85,247,0.1)'}}/>
          </div>
        ))}
      </div>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:`radial-gradient(circle 150px at ${spot.x} ${spot.y},transparent 0%,rgba(2,1,8,0.97) 100%)`}}/>
      <div style={{position:'absolute',left:spot.x,top:spot.y,width:9,height:9,borderRadius:'50%',background:'rgba(168,85,247,0.9)',boxShadow:'0 0 16px rgba(168,85,247,0.7)',transform:'translate(-50%,-50%)',pointerEvents:'none'}}/>
      <p style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',fontFamily:'JetBrains Mono',fontSize:10,color:'rgba(100,116,139,0.45)',letterSpacing:'0.1em',pointerEvents:'none',whiteSpace:'nowrap'}}>MOVE TO REVEAL</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13  JELLYFISH
// ─────────────────────────────────────────────────────────────────────────────
function Jellyfish() {
  const tRef=useRef(0);
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    tRef.current+=0.022; const T=tRef.current, {width:W,height:H}=c;
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H*0.42+Math.sin(T*0.55)*13, bellR=50+Math.sin(T*1.1)*9, bellH=bellR*0.6;
    const halo=ctx.createRadialGradient(cx,cy,bellR*0.8,cx,cy,bellR*1.8);
    halo.addColorStop(0,'rgba(168,85,247,0.1)'); halo.addColorStop(1,'rgba(168,85,247,0)');
    ctx.beginPath(); ctx.arc(cx,cy,bellR*1.8,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
    const bg=ctx.createRadialGradient(cx,cy-bellH*0.3,0,cx,cy,bellR);
    bg.addColorStop(0,'rgba(244,114,182,0.9)'); bg.addColorStop(0.45,'rgba(168,85,247,0.65)'); bg.addColorStop(1,'rgba(168,85,247,0.04)');
    ctx.beginPath(); ctx.ellipse(cx,cy-bellH/2,bellR,bellH,0,0,Math.PI); ctx.fillStyle=bg; ctx.fill();
    const hi=ctx.createRadialGradient(cx-bellR*0.2,cy-bellH*0.6,0,cx,cy-bellH*0.2,bellR*0.5);
    hi.addColorStop(0,'rgba(255,255,255,0.18)'); hi.addColorStop(1,'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.ellipse(cx,cy-bellH/2,bellR*0.5,bellH*0.45,0,0,Math.PI*2); ctx.fillStyle=hi; ctx.fill();
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI,bx=cx+Math.cos(a)*(bellR*0.38);ctx.beginPath();ctx.moveTo(bx,cy);for(let s=0;s<28;s++)ctx.lineTo(bx+Math.sin(T*2.2+s*0.45+i)*9,cy+s*3.2);ctx.strokeStyle=`rgba(244,114,182,${0.25+0.14*Math.sin(T+i)})`;ctx.lineWidth=1.8;ctx.stroke();}
    for(let i=0;i<10;i++){const ax=((i/9)*bellR*1.9-bellR*0.95)+cx,len=55+i%3*25;ctx.beginPath();ctx.moveTo(ax,cy);for(let s=0;s<len;s++)ctx.lineTo(ax+Math.sin(T*1.7+s*0.28+i*0.75)*13*(1-s/len),cy+s*2.4);ctx.strokeStyle=`rgba(168,85,247,${0.11+0.09*Math.sin(T*0.5+i)})`;ctx.lineWidth=1;ctx.stroke();}
  });
  return (
    <Fill style={{background:'radial-gradient(ellipse at 50% 20%,#0d0520,#030109 70%)'}}>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 14  APPLE 3D EXPLODE
// ─────────────────────────────────────────────────────────────────────────────
function Apple3D() {
  const [pct,setPct]=useState(0); const scrollRef=useRef(null);
  const layers=[{l:'UI Layer',col:'rgba(168,85,247,0.65)',zm:2.5},{l:'Application',col:'rgba(244,114,182,0.55)',zm:1.5},{l:'Framework',col:'rgba(168,85,247,0.45)',zm:0.5},{l:'Kernel',col:'rgba(34,211,238,0.45)',zm:-0.5},{l:'Hardware',col:'rgba(34,211,238,0.65)',zm:-1.5}];
  return (
    <Fill style={{background:C.bg}}>
      <div ref={scrollRef} onScroll={()=>{const e=scrollRef.current;if(e)setPct(Math.min(e.scrollTop/360,1));}} style={{position:'absolute',inset:0,overflowY:'scroll',zIndex:10}}>
        <div style={{height:480,opacity:0,pointerEvents:'none'}}/>
      </div>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',perspective:'680px',pointerEvents:'none'}}>
        <div style={{position:'relative',width:210,height:210,transformStyle:'preserve-3d',transform:`rotateX(${12+pct*14}deg) rotateY(${pct*8}deg)`}}>
          {layers.map((l,i)=>(
            <div key={i} style={{position:'absolute',inset:0,transform:`translateZ(${l.zm*pct*55}px)`,background:l.col,border:'1px solid rgba(168,85,247,0.4)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontFamily:'Poppins',fontWeight:600,fontSize:12,color:'rgba(255,255,255,0.9)'}}>{l.l}</span>
            </div>
          ))}
        </div>
        <p style={{marginTop:22,fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em'}}>SCROLL TO EXPLODE</p>
        <div style={{marginTop:8,width:100,height:2,background:C.raised,borderRadius:1}}><div style={{height:'100%',width:`${pct*100}%`,background:C.grad}}/></div>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 15  EVENT BADGE
// ─────────────────────────────────────────────────────────────────────────────
function EventBadge() {
  const [flipped,setFlipped]=useState(false);
  const qr=useMemo(()=>Array.from({length:25},()=>Math.random()>0.48),[]);
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,perspective:'900px'}}>
      <div onClick={()=>setFlipped(p=>!p)} style={{width:246,height:358,position:'relative',transformStyle:'preserve-3d',transition:'transform 0.72s cubic-bezier(0.34,1.56,0.64,1)',transform:flipped?'rotateY(180deg)':'rotateY(0deg)',cursor:'pointer'}}>
        <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',borderRadius:20,overflow:'hidden',background:`linear-gradient(135deg,${C.raised},${C.overlay})`,border:`1px solid ${C.bordA}`,boxShadow:'0 0 34px rgba(168,85,247,0.22)'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(244,114,182,0.07),rgba(34,211,238,0.1))',backgroundSize:'300%',animation:'marq 4s linear infinite'}}/>
          <div style={{position:'absolute',left:0,right:0,height:3,background:'linear-gradient(90deg,transparent,rgba(34,211,238,0.9),transparent)',animation:'scan 2.4s linear infinite',zIndex:4}}/>
          <div style={{padding:22,position:'relative',zIndex:2,height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'JetBrains Mono',fontSize:9,color:C.cy,letterSpacing:'0.18em',marginBottom:12}}>FLASHFUSION / 2025</div>
              <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:18,color:C.t1,lineHeight:1.3}}>FlashFusion<br/>Summit</div>
              <div style={{height:1,background:C.bord,margin:'11px 0'}}/>
              <div style={{fontSize:11,color:C.t3,fontFamily:'Inter',lineHeight:1.9}}><div style={{color:C.t2}}>NOV 14 · 2025</div><div>San Francisco, CA</div><div style={{marginTop:5,color:C.p,fontWeight:500}}>VIP ACCESS</div></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:3}}>
              {qr.map((on,i)=><div key={i} style={{height:8,borderRadius:2,background:on?C.p:'transparent',border:`1px solid ${C.bord}`}}/>)}
            </div>
          </div>
        </div>
        <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',transform:'rotateY(180deg)',borderRadius:20,background:`linear-gradient(135deg,${C.overlay},${C.raised})`,border:`1px solid ${C.bord}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:22}}>
          <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:14,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>FlashFusion</div>
          <div style={{width:84,height:84,borderRadius:12,background:C.raised,border:`1px solid ${C.bordA}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30}}>⚡</div>
          <div style={{fontFamily:'JetBrains Mono',fontSize:9,color:C.t3,textAlign:'center',letterSpacing:'0.06em',lineHeight:1.8}}>SCAN TO VERIFY<br/>ATTENDANCE</div>
          <div style={{fontFamily:'JetBrains Mono',fontSize:9,color:C.cy}}>#FF-2025-VIP-0042</div>
        </div>
      </div>
      <p style={{fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em'}}>CLICK TO FLIP</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16  GRAPHENE 3D
// ─────────────────────────────────────────────────────────────────────────────
function Graphene() {
  const tRef=useRef(0); const mRef=useRef({x:0,y:0});
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    tRef.current+=0.007; const T=tRef.current, {width:W,height:H}=c;
    ctx.clearRect(0,0,W,H); ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    const rX=T*0.44+mRef.current.y*0.35, rY=T*0.27+mRef.current.x*-0.5;
    const R=Math.min(W,H)*0.055;
    const COLS=Math.ceil(W/(R*1.76))+2, ROWS=Math.ceil(H/(R*1.54))+2;
    for(let ri=0;ri<ROWS;ri++) for(let ci=0;ci<COLS;ci++){
      const ox=W/2+(ci-COLS/2)*R*1.76+(ri%2)*R*0.88, oy=H/2+(ri-ROWS/2)*R*1.54;
      const pulse=Math.sin(T*2.2-(ri*0.3+ci*0.28))*0.5+0.5;
      const pts=[];
      for(let vi=0;vi<6;vi++){
        const va=vi*Math.PI/3;
        let lx=ox+Math.cos(va)*(R-1.5), ly=oy+Math.sin(va)*(R-1.5), lz=Math.sin(T+ri*0.2+ci*0.2)*R*0.3;
        const ny=ly*Math.cos(rX)-lz*Math.sin(rX); lz=ly*Math.sin(rX)+lz*Math.cos(rX); ly=ny;
        lx=lx*Math.cos(rY)+lz*Math.sin(rY); pts.push([lx,ly]);
      }
      const rr=Math.round(168+pulse*80),g2=Math.round(85+pulse*30),b2=Math.round(247-pulse*65);
      ctx.beginPath(); pts.forEach(([px,py],j)=>j===0?ctx.moveTo(px,py):ctx.lineTo(px,py)); ctx.closePath();
      ctx.strokeStyle=`rgba(${rr},${g2},${b2},${0.15+pulse*0.55})`; ctx.lineWidth=1; ctx.stroke();
      if(pulse>0.72){ctx.fillStyle=`rgba(${rr},${g2},${b2},${(pulse-0.72)*0.24})`; ctx.fill();}
    }
  });
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return;
    const mv=e=>{const r=c.getBoundingClientRect();mRef.current={x:(e.clientX-r.left-c.width/2)/c.width*2,y:(e.clientY-r.top-c.height/2)/c.height*2};};
    c.addEventListener('mousemove',mv); return()=>c.removeEventListener('mousemove',mv);
  },[]);
  return (
    <Fill style={{background:C.bg}}>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      <p style={{position:'absolute',top:12,left:'50%',transform:'translateX(-50%)',fontFamily:'Poppins',fontWeight:700,fontSize:12,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',pointerEvents:'none',whiteSpace:'nowrap'}}>Graphene Lattice 3D</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 17  CARD SCAN
// ─────────────────────────────────────────────────────────────────────────────
function CardScan() {
  const cards=[{name:'FlashFusion Pro',sub:'Premium',num:'•••• •••• •••• 0042',exp:'12/27',acc:C.p},{name:'Creator Pass',sub:'Unlimited',num:'•••• •••• •••• 1138',exp:'08/26',acc:C.pk},{name:'Beta Member',sub:'Early Access',num:'•••• •••• •••• 7755',exp:'03/28',acc:C.cy}];
  const [idx,setIdx]=useState(0); const [scanning,setScanning]=useState(false); const cc=cards[idx];
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
      <div style={{position:'relative',width:265,height:158,borderRadius:18,overflow:'hidden',background:`linear-gradient(135deg,${C.raised},${C.overlay})`,border:`1px solid ${cc.acc}44`,boxShadow:`0 0 22px ${cc.acc}1a`,transition:'all 0.35s'}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.05) 50%,transparent 70%)',backgroundSize:'200%',animation:'marq 4s ease-in-out infinite'}}/>
        {scanning&&<div style={{position:'absolute',left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${cc.acc},transparent)`,animation:'scan 1.8s linear',zIndex:4}}/>}
        <div style={{padding:17,position:'relative',zIndex:2,height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div><div style={{fontFamily:'Poppins',fontWeight:700,fontSize:12,color:C.t1}}>{cc.name}</div><div style={{fontSize:9,color:cc.acc,fontFamily:'JetBrains Mono',marginTop:2,letterSpacing:'0.1em'}}>{cc.sub}</div></div>
            <div style={{width:34,height:23,borderRadius:4,background:`${cc.acc}1a`,border:`1px solid ${cc.acc}33`}}/>
          </div>
          <div><div style={{fontFamily:'JetBrains Mono',fontSize:11,color:C.t2,letterSpacing:'0.12em',marginBottom:6}}>{cc.num}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <div><div style={{fontSize:7,color:C.t3,marginBottom:2,letterSpacing:'0.08em'}}>EXPIRES</div><div style={{fontSize:10,fontFamily:'JetBrains Mono',color:C.t2}}>{cc.exp}</div></div>
              <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:12,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>FF</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button onClick={()=>setIdx(p=>(p-1+cards.length)%cards.length)} style={{width:32,height:32,borderRadius:'50%',background:C.raised,border:`1px solid ${C.bord}`,color:C.t1,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <button onClick={()=>{if(!scanning){setScanning(true);setTimeout(()=>setScanning(false),1900);}}} style={{padding:'7px 19px',borderRadius:9,background:scanning?C.raised:C.grad,color:'#fff',fontFamily:'Poppins',fontWeight:600,fontSize:11,border:scanning?`1px solid ${cc.acc}`:'none',cursor:'pointer',transition:'all 0.2s'}}>{scanning?'Scanning…':'NFC Scan ⚡'}</button>
        <button onClick={()=>setIdx(p=>(p+1)%cards.length)} style={{width:32,height:32,borderRadius:'50%',background:C.raised,border:`1px solid ${C.bord}`,color:C.t1,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </div>
      <div style={{display:'flex',gap:6}}>{cards.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:6,height:6,borderRadius:'50%',background:i===idx?C.p:C.overlay,border:`1px solid ${C.bord}`,cursor:'pointer',transition:'all 0.2s'}}/>)}</div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 18  SENSORY PLAYGROUND
// ─────────────────────────────────────────────────────────────────────────────
function Sensory() {
  const ptRef=useRef([]); const drawRef=useRef(false);
  const spawn=(x,y,n=18)=>{const COLS=[[168,85,247],[244,114,182],[34,211,238]];for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=1.2+Math.random()*4;ptRef.current.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-0.8,life:1,decay:0.013+Math.random()*0.018,r:2+Math.random()*4,col:COLS[i%3]});}};
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    ctx.fillStyle='rgba(15,6,24,0.16)'; ctx.fillRect(0,0,c.width,c.height);
    ptRef.current=ptRef.current.filter(p=>p.life>0.02);
    ptRef.current.forEach(p=>{p.vy+=0.06;p.vx*=0.97;p.vy*=0.97;p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;const[r,g,b]=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${p.life})`;ctx.fill();});
  });
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return;
    const gxy=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
    const cl=e=>{const{x,y}=gxy(e);spawn(x,y);};
    const dn=e=>{drawRef.current=true;const{x,y}=gxy(e);spawn(x,y,22);};
    const mv=e=>{if(!drawRef.current)return;if(Math.random()<0.35){const{x,y}=gxy(e);spawn(x,y,8);}};
    const up=()=>{drawRef.current=false;};
    c.addEventListener('click',cl);c.addEventListener('mousedown',dn);c.addEventListener('mousemove',mv);c.addEventListener('mouseup',up);
    return()=>{c.removeEventListener('click',cl);c.removeEventListener('mousedown',dn);c.removeEventListener('mousemove',mv);c.removeEventListener('mouseup',up);};
  },[]);
  return (
    <Fill style={{background:C.bg,cursor:'crosshair'}}>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      <p style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em',pointerEvents:'none',whiteSpace:'nowrap'}}>CLICK · DRAG TO PAINT</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 19  VISCOUS LIQUID
// ─────────────────────────────────────────────────────────────────────────────
function ViscousLiquid() {
  const tRef=useRef(0); const mRef=useRef({x:0.5,y:0.5}); const offRef=useRef(null);
  const BLOBS=[{bx:0.3,by:0.4,r:0.22,sx:0.7,sy:0.5,ph:0,col:[168,85,247]},{bx:0.65,by:0.5,r:0.19,sx:0.5,sy:0.8,ph:2.1,col:[244,114,182]},{bx:0.5,by:0.28,r:0.17,sx:0.9,sy:0.4,ph:4.2,col:[34,211,238]},{bx:0.2,by:0.65,r:0.15,sx:0.6,sy:0.6,ph:1.5,col:[168,85,247]}];
  const { wrapRef, canvasRef } = useCanvas((ctx, c) => {
    tRef.current+=0.011; const T=tRef.current, {width:W,height:H}=c;
    if(!offRef.current)offRef.current=document.createElement('canvas');
    const off=offRef.current, ow=Math.max(1,W>>1), oh=Math.max(1,H>>1);
    off.width=ow; off.height=oh;
    const oc=off.getContext('2d'); oc.clearRect(0,0,ow,oh);
    BLOBS.forEach(b=>{
      const cx=ow*(b.bx+0.16*Math.sin(T*b.sx+b.ph)+0.08*(mRef.current.x-0.5)), cy=oh*(b.by+0.16*Math.cos(T*b.sy+b.ph)+0.08*(mRef.current.y-0.5));
      const r=Math.min(ow,oh)*(b.r+0.04*Math.sin(T*0.7+b.ph));
      const g=oc.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,`rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.72)`); g.addColorStop(0.5,`rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.36)`); g.addColorStop(1,`rgba(${b.col[0]},${b.col[1]},${b.col[2]},0)`);
      oc.fillStyle=g; oc.fillRect(0,0,ow,oh);
    });
    const id=oc.getImageData(0,0,ow,oh), d=id.data;
    for(let i=0;i<d.length;i+=4){const a=d[i+3];if(a>55){const t2=Math.min((a-55)/80,1);d[i+3]=Math.round(60+t2*195);}else{d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=0;}}
    oc.putImageData(id,0,0); ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H); ctx.drawImage(off,0,0,W,H);
  });
  useEffect(()=>{const c=canvasRef.current;if(!c)return;const mv=e=>{const r=c.getBoundingClientRect();mRef.current={x:(e.clientX-r.left)/c.width,y:(e.clientY-r.top)/c.height};};c.addEventListener('mousemove',mv);return()=>c.removeEventListener('mousemove',mv);},[]);
  return (
    <Fill style={{background:C.bg,cursor:'crosshair'}}>
      <div ref={wrapRef} style={{position:'absolute',inset:0}}><canvas ref={canvasRef} style={{display:'block'}}/></div>
      <p style={{position:'absolute',top:12,left:'50%',transform:'translateX(-50%)',fontFamily:'Poppins',fontWeight:600,fontSize:12,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',pointerEvents:'none',whiteSpace:'nowrap'}}>Viscous Liquid — MOVE CURSOR</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 20  PRODUCT FOLLOW PATH
// ─────────────────────────────────────────────────────────────────────────────
function FollowPath() {
  const [pct,setPct]=useState(0); const scrollRef=useRef(null); const pathRef=useRef(null); const [dot,setDot]=useState({x:150,y:24});
  const onScroll=()=>{const el=scrollRef.current;if(!el)return;const p=Math.min(el.scrollTop/360,1);setPct(p);if(pathRef.current){try{const len=pathRef.current.getTotalLength();const pt=pathRef.current.getPointAtLength(p*len);setDot({x:pt.x,y:pt.y});}catch(e){}}};
  const D="M 150 24 C 270 55 40 120 150 168 C 260 215 40 268 150 316";
  return (
    <Fill style={{background:C.bg}}>
      <div ref={scrollRef} onScroll={onScroll} style={{position:'absolute',inset:0,overflowY:'scroll',zIndex:10}}><div style={{height:580,opacity:0}}/></div>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
        <svg width="300" height="340" viewBox="0 0 300 340" style={{overflow:'visible'}}>
          <path d={D} fill="none" stroke="rgba(168,85,247,0.18)" strokeWidth="2" strokeDasharray="5 4"/>
          <path ref={pathRef} d={D} fill="none" stroke={C.p} strokeWidth="2.5" strokeDasharray={`${pct*590} 590`} strokeLinecap="round" opacity="0.85"/>
          {[{x:36,y:48,l:'DISCOVER'},{x:210,y:147,l:'BUILD'},{x:36,y:251,l:'LAUNCH'}].map((s,i)=><text key={i} x={s.x} y={s.y} fill={C.t3} fontSize="10" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">{s.l}</text>)}
          <circle cx={dot.x} cy={dot.y} r="11" fill={C.raised} stroke={C.p} strokeWidth="2"/>
          <text x={dot.x} y={dot.y+5} textAnchor="middle" fontSize="11">⚡</text>
        </svg>
        <p style={{marginTop:10,fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em'}}>SCROLL TO ANIMATE</p>
        <div style={{marginTop:8,width:100,height:2,background:C.raised,borderRadius:1}}><div style={{height:'100%',width:`${pct*100}%`,background:C.grad}}/></div>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 21  IMMERSIVE 3D STUDIO
// Standard CSS cube: all faces translateZ(+S/2) with appropriate rotations
// ─────────────────────────────────────────────────────────────────────────────
function Studio3D() {
  const target=useRef({x:0,y:0}); const cur=useRef({x:0,y:0});
  const [rot,setRot]=useState({x:0,y:0}); const rafRef=useRef(null);
  useEffect(()=>{const loop=()=>{cur.current.x+=(target.current.x-cur.current.x)*0.05;cur.current.y+=(target.current.y-cur.current.y)*0.05;setRot({x:cur.current.y*14,y:cur.current.x*-20});rafRef.current=requestAnimationFrame(loop);};rafRef.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(rafRef.current);},[]);
  const onMove=e=>{const r=e.currentTarget.getBoundingClientRect();target.current={x:(e.clientX-r.left-r.width/2)/r.width*2,y:(e.clientY-r.top-r.height/2)/r.height*2};};
  const S=210, H=S/2;
  const face={position:'absolute',width:S,height:S};
  return (
    <Fill style={{background:'#020108',display:'flex',alignItems:'center',justifyContent:'center',perspective:'640px',cursor:'none'}} onMouseMove={onMove}>
      <div style={{transformStyle:'preserve-3d',transform:`rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,width:S,height:S,position:'relative'}}>
        {/* Back: rotateY(180°) translateZ(S/2) */}
        <div style={{...face,transform:`rotateY(180deg) translateZ(${H}px)`,background:`linear-gradient(180deg,${C.bg},${C.raised})`,border:`1px solid ${C.bord}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontFamily:'Poppins',fontWeight:700,fontSize:12,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',transform:'rotateY(180deg)'}}>FLASHFUSION</span>
        </div>
        {/* Floor (bottom): rotateX(90°) translateZ(S/2) → y=+S/2 */}
        <div style={{...face,transform:`rotateX(90deg) translateZ(${H}px)`,background:`linear-gradient(180deg,${C.raised},#050210)`,border:`1px solid ${C.bord}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:70,height:70,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,0.22),transparent)',filter:'blur(8px)'}}/>
        </div>
        {/* Ceiling: rotateX(-90°) translateZ(S/2) → y=-S/2 */}
        <div style={{...face,transform:`rotateX(-90deg) translateZ(${H}px)`,background:`linear-gradient(180deg,#050210,${C.raised})`,border:`1px solid ${C.bord}`}}/>
        {/* Left: rotateY(90°) translateZ(S/2) → x=-S/2 */}
        <div style={{...face,transform:`rotateY(90deg) translateZ(${H}px)`,background:`linear-gradient(90deg,${C.bg},${C.overlay})`,border:`1px solid ${C.bord}`}}/>
        {/* Right: rotateY(-90°) translateZ(S/2) → x=+S/2 */}
        <div style={{...face,transform:`rotateY(-90deg) translateZ(${H}px)`,background:`linear-gradient(-90deg,${C.bg},${C.overlay})`,border:`1px solid ${C.bord}`}}/>
        {/* Floating orb */}
        <div style={{position:'absolute',left:'50%',top:'42%',transform:'translate(-50%,-50%)',animation:'float 3s ease-in-out infinite',zIndex:10}}>
          <div style={{width:42,height:42,borderRadius:'50%',background:C.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:C.glow}}>⚡</div>
        </div>
      </div>
      <p style={{position:'absolute',bottom:14,fontFamily:'JetBrains Mono',fontSize:10,color:C.t3,letterSpacing:'0.1em'}}>MOVE CURSOR TO ORBIT</p>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 22  AI CHATBOT
// ─────────────────────────────────────────────────────────────────────────────
function Chatbot() {
  const REPLIES=["Analyzing your FlashFusion workflow… found 3 optimization paths.","I can scaffold that as a Base44 + n8n webhook chain. Want me to?","Architecture looks solid. One risk: token rate limits at scale.","Generating agent config now. ETA 2s.","Done — check your n8n dashboard. Workflow ready to test."];
  const [msgs,setMsgs]=useState([{role:'ai',text:"Hey! FlashFusion AI here. What are we building today?"}]);
  const [input,setInput]=useState(''); const [streaming,setStreaming]=useState(''); const [busy,setBusy]=useState(false);
  const listRef=useRef(null); const ri=useRef(0);
  useEffect(()=>{if(listRef.current)listRef.current.scrollTop=listRef.current.scrollHeight;},[msgs,streaming]);
  const send=()=>{
    if(!input.trim()||busy)return;
    const txt=input.trim(); setMsgs(p=>[...p,{role:'user',text:txt}]); setInput(''); setBusy(true);
    const reply=REPLIES[ri.current%REPLIES.length]; ri.current++;
    let i=0,acc='';
    const tick=()=>{if(i<reply.length){acc+=reply[i++];setStreaming(acc);setTimeout(tick,22+Math.random()*18);}else{setMsgs(p=>[...p,{role:'ai',text:reply}]);setStreaming('');setBusy(false);}};
    setTimeout(tick,500);
  };
  return (
    <Fill style={{background:C.bg,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'9px 13px',borderBottom:`1px solid ${C.bord}`,display:'flex',alignItems:'center',gap:9,background:C.raised,flexShrink:0}}>
        <div style={{width:27,height:27,borderRadius:'50%',background:C.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,boxShadow:C.glow}}>⚡</div>
        <div><div style={{fontFamily:'Poppins',fontWeight:600,fontSize:12,color:C.t1}}>FlashFusion AI</div><div style={{fontSize:9,color:'#4ade80',fontFamily:'Inter'}}>● Online</div></div>
      </div>
      <div ref={listRef} style={{flex:1,overflowY:'auto',padding:10,display:'flex',flexDirection:'column',gap:9,minHeight:0}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',animation:'slidein 0.22s ease-out both'}}>
            <div style={{maxWidth:'80%',padding:'8px 11px',fontSize:12,fontFamily:'Inter',lineHeight:1.55,color:C.t1,borderRadius:m.role==='user'?'13px 13px 3px 13px':'13px 13px 13px 3px',background:m.role==='user'?C.grad:C.raised,border:m.role==='ai'?`1px solid ${C.bord}`:'none'}}>{m.text}</div>
          </div>
        ))}
        {streaming&&<div style={{display:'flex',justifyContent:'flex-start'}}><div style={{maxWidth:'80%',padding:'8px 11px',fontSize:12,fontFamily:'Inter',lineHeight:1.55,color:C.t1,borderRadius:'13px 13px 13px 3px',background:C.raised,border:`1px solid ${C.bord}`}}>{streaming}<span style={{animation:'blink 0.65s step-end infinite'}}>▊</span></div></div>}
        {busy&&!streaming&&<div style={{display:'flex',gap:5,padding:'10px 11px',background:C.raised,borderRadius:'13px 13px 13px 3px',border:`1px solid ${C.bord}`,width:52,alignSelf:'flex-start'}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:'50%',background:C.p,animation:`sdot 0.9s ${i*0.16}s linear infinite`,transformOrigin:'2.5px 2.5px'}}/>)}</div>}
      </div>
      <div style={{padding:9,borderTop:`1px solid ${C.bord}`,display:'flex',gap:7,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask FlashFusion AI…" style={{flex:1,background:C.overlay,border:`1px solid ${C.bord}`,borderRadius:9,padding:'7px 11px',color:C.t1,fontFamily:'Inter',fontSize:12,outline:'none'}}/>
        <button onClick={send} disabled={busy||!input.trim()} style={{padding:'7px 13px',borderRadius:9,background:C.grad,border:'none',color:'#fff',fontFamily:'Poppins',fontWeight:600,fontSize:11,cursor:busy?'default':'pointer',opacity:busy?0.6:1,transition:'opacity 0.2s'}}>Send</button>
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 23  SCROLL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ScrollPage() {
  const containerRef=useRef(null); const [vis,setVis]=useState({}); const secRefs=useRef([]);
  useEffect(()=>{
    const root=containerRef.current; if(!root)return;
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setVis(p=>({...p,[e.target.dataset.i]:true}));});},{root,threshold:0.2});
    secRefs.current.forEach(el=>el&&obs.observe(el)); return()=>obs.disconnect();
  },[]);
  const secs=[{icon:'✦',tag:'01',title:'Design System',desc:'Every pixel intentional. Every token locked. FlashFusion ships distinctive UI — never templates.'},{icon:'⚡',tag:'02',title:'AI Orchestration',desc:'Claude as silent OS. Agents route your data, run your stack, and scale your ops automatically.'},{icon:'🚀',tag:'03',title:'Build & Ship',desc:'Idea to production in a single session. Zero scaffolding. No placeholders. No excuses.'},{icon:'📈',tag:'04',title:'Grow Revenue',desc:'Monetization-first architecture. Every component traces back to a business outcome.'}];
  return (
    <Fill>
      <div ref={containerRef} style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg}}>
        {secs.map((s,i)=>(
          <div key={i} ref={el=>secRefs.current[i]=el} data-i={i}
            style={{minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center',padding:20,opacity:vis[i]?1:0,transform:vis[i]?'translateY(0)':'translateY(22px)',transition:`opacity 0.52s ease ${i*0.04}s,transform 0.52s ease ${i*0.04}s`}}>
            <div className="glass" style={{maxWidth:355,padding:25,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-20,right:-6,fontSize:62,opacity:0.05,fontFamily:'Poppins',fontWeight:700,color:C.p,pointerEvents:'none'}}>{s.tag}</div>
              <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:'JetBrains Mono',fontSize:9,color:C.p,letterSpacing:'0.18em',marginBottom:7}}>{s.tag} / FEATURE</div>
              <h3 style={{fontFamily:'Poppins',fontWeight:700,fontSize:19,background:C.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>{s.title}</h3>
              <p style={{fontSize:13,color:C.t2,lineHeight:1.65,fontFamily:'Inter'}}>{s.desc}</p>
              <div style={{marginTop:14,height:2,borderRadius:1,background:C.grad,opacity:vis[i]?1:0,transition:'opacity 0.6s ease 0.3s'}}/>
            </div>
          </div>
        ))}
      </div>
    </Fill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP + APP SHELL
// ─────────────────────────────────────────────────────────────────────────────
const MAP={dotted:DottedAttractor,shader:ShaderGradient,lamp:LampAnim,lelo:LeLoSaas,gallery3d:Gallery3D,artslider:ArtSlider,ascii:AsciiRipple,aistates:AIStates,martian:MartianParallax,infinite:InfiniteScroll,v2ascii:VideoASCII,spotlight:Spotlight,jellyfish:Jellyfish,apple3d:Apple3D,badge:EventBadge,graphene:Graphene,cardscan:CardScan,sensory:Sensory,liquid:ViscousLiquid,pathfollow:FollowPath,studio3d:Studio3D,chatbot:Chatbot,scrollpage:ScrollPage};

export default function App() {
  const [active,setActive]=useState('dotted');
  const [navOpen,setNavOpen]=useState(false);
  const Active=MAP[active];
  const idx=TEMPLATES.findIndex(t=>t.id===active);
  const go=useCallback(id=>{setActive(id);setNavOpen(false);},[]);

  return (
    <>
      <style>{CSS}</style>
      {/*
        position:fixed; inset:0 — more reliable than height:100vh in artifact iframes.
        Fills viewport regardless of iframe scroll height.
      */}
      <div style={{position:'fixed',inset:0,display:'flex',overflow:'hidden',background:C.bg,fontFamily:'Inter,system-ui,sans-serif'}}>
        {/* Sidebar */}
        <div style={{width:navOpen?205:0,minWidth:navOpen?205:0,overflow:'hidden',background:C.raised,borderRight:`1px solid ${C.bord}`,display:'flex',flexDirection:'column',transition:'width 0.26s ease,min-width 0.26s ease',flexShrink:0,zIndex:30}}>
          <div style={{padding:'11px 13px 8px',borderBottom:`1px solid ${C.bord}`,whiteSpace:'nowrap',flexShrink:0}}>
            <div style={{fontFamily:'Poppins',fontWeight:700,fontSize:12,background:'linear-gradient(90deg,#A855F7,#F472B6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>FlashFusion</div>
            <div style={{fontSize:8,color:C.t3,marginTop:1,fontFamily:'JetBrains Mono',letterSpacing:'0.1em'}}>ANIMATION SHOWCASE</div>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:4,display:'flex',flexDirection:'column',gap:1}}>
            {TEMPLATES.map((t,i)=>(
              <button key={t.id} onClick={()=>go(t.id)}
                style={{display:'block',padding:'5px 10px',borderRadius:6,border:'none',cursor:'pointer',textAlign:'left',whiteSpace:'nowrap',transition:'all 0.15s',
                  background:active===t.id?'rgba(168,85,247,0.14)':'transparent',
                  color:active===t.id?C.p:C.t2,fontSize:11,fontFamily:'Inter',fontWeight:active===t.id?600:400}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
          {/* Topbar */}
          <div style={{height:40,background:C.raised,borderBottom:`1px solid ${C.bord}`,display:'flex',alignItems:'center',padding:'0 10px',gap:7,flexShrink:0,zIndex:20}}>
            <button onClick={()=>setNavOpen(p=>!p)} style={{width:26,height:26,borderRadius:6,border:`1px solid ${navOpen?C.bordA:C.bord}`,background:navOpen?'rgba(168,85,247,0.12)':'transparent',color:C.t2,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>☰</button>
            <div style={{flex:1,fontFamily:'Poppins',fontWeight:600,fontSize:12,color:C.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{TEMPLATES[idx]?.label}</div>
            <div style={{display:'flex',gap:2,alignItems:'center',flexShrink:0}}>
              <button onClick={()=>go(TEMPLATES[(idx-1+TEMPLATES.length)%TEMPLATES.length].id)} style={{width:24,height:24,borderRadius:5,background:'transparent',border:`1px solid ${C.bord}`,color:C.t3,cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
              <span style={{width:32,textAlign:'center',fontSize:9,color:C.t3,fontFamily:'JetBrains Mono'}}>{idx+1}/{TEMPLATES.length}</span>
              <button onClick={()=>go(TEMPLATES[(idx+1)%TEMPLATES.length].id)} style={{width:24,height:24,borderRadius:5,background:'transparent',border:`1px solid ${C.bord}`,color:C.t3,cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
            </div>
          </div>
          {/*
            Canvas area: position:relative so <Active> (Fill = position:absolute;inset:0)
            sizes itself against this div. flex:1 + minHeight:0 gives it remaining height.
          */}
          <div style={{flex:1,position:'relative',minHeight:0,overflow:'hidden'}}>
            <Active key={active}/>
          </div>
        </div>
      </div>
    </>
  );
}
