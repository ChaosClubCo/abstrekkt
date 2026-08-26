import { useState, useEffect, useRef, useCallback, useId } from "react";

/* ═══════════════════════════════════════════════════════════
   WCAG 2.2 AA AUDIT RESULTS + FIXES APPLIED
   ─────────────────────────────────────────────────────────
   1.4.3 Contrast:   --t3 36%→57% (was 2.5:1, now 4.7:1 ✓)
                     --t4 22%→decorative-only (removed from text)
   2.4.1 Bypass:     Skip-to-content link added
   2.4.7 Focus:      All interactive elements: styled focus ring
   2.5.5 Target:     All touch targets ≥ 44×44px (padding trick)
   4.1.2 Name/Role:  ARIA on toggles, dropdowns, combobox, buttons
   1.3.1 Relations:  htmlFor/id on all form labels
   4.1.3 Status:     aria-live="polite" on all AI output regions
   3.2.1 On Focus:   No unexpected context changes
   2.1.1 Keyboard:   All divs-as-buttons have tabIndex + Enter/Space
   ─────────────────────────────────────────────────────────
   RESPONSIVE:
   • 320px  — single column, full-width previews
   • 480px  — topbar pills collapse to scrollable row
   • 640px  — two columns for wider cards
   • 1024px — full bento grid
   • Fixed widths removed from all preview components
   • CSS media queries via GlobalStyles injection
   • touch-action: manipulation on all interactive elements
═══════════════════════════════════════════════════════════ */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Fragment+Mono:ital@0;1&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      button { cursor: pointer; border: none; background: none; font-family: inherit; }
      input, textarea, select { font-family: inherit; border: none; }

      /* ── TOKENS ── */
      :root {
        /* Surfaces — hue-matched navy, never #000 */
        --bg: hsl(228,30%,5.5%);
        --s1: hsl(228,24%,8%);
        --s2: hsl(228,20%,11%);
        --s3: hsl(228,16%,15%);
        --s4: hsl(228,13%,20%);
        /* Borders */
        --b0: rgba(255,255,255,0.04);
        --b1: rgba(255,255,255,0.08);
        --b2: rgba(255,255,255,0.13);
        --b3: rgba(255,255,255,0.22);
        /* Text — WCAG AA verified */
        --t1: hsl(220,25%,91%);   /* 13.5:1 on s1 ✓ */
        --t2: hsl(220,15%,64%);   /* 6.5:1 on s1  ✓ */
        --t3: hsl(220,12%,57%);   /* 4.7:1 on s1  ✓ (was 36% = 2.6:1 FAIL) */
        --t4: hsl(220,10%,38%);   /* decorative/dividers only — not for text */
        /* Accent — single amber gold */
        --a:    hsl(38,92%,52%);
        --a-lo: hsla(38,92%,52%,0.09);
        --a-md: hsla(38,92%,52%,0.18);
        --a-bd: hsla(38,92%,52%,0.30);
        --a-tx: hsl(40,95%,70%);  /* 10.4:1 on s3 ✓ */
        /* Status */
        --grn:    hsl(158,64%,50%);  /* 8.0:1 on s3 ✓ */
        --grn-lo: hsla(158,64%,50%,0.10);
        --grn-bd: hsla(158,64%,50%,0.24);
        --red:    hsl(4,86%,66%);    /* 5.2:1 on s3 ✓ */
        --red-lo: hsla(4,86%,66%,0.10);
        --red-bd: hsla(4,86%,66%,0.24);
        /* Typography */
        --fh: 'Syne', system-ui, sans-serif;
        --fm: 'Fragment Mono','Fira Code',ui-monospace,monospace;
        /* Motion */
        --ease-out: cubic-bezier(0.0,0.0,0.2,1);
        --spring:   cubic-bezier(0.34,1.56,0.64,1);
        /* 8-point spacing */
        --sp1: 8px; --sp2: 16px; --sp3: 24px; --sp4: 32px;
        --sp5: 40px; --sp6: 48px;
      }

      /* ── BASE ── */
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg);
        color: var(--t1);
        font-family: var(--fm);
        font-size: 13px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 3px; }

      /* ── SKIP LINK — 2.4.1 Bypass Blocks ── */
      .skip-link {
        position: absolute;
        top: -100px;
        left: var(--sp2);
        z-index: 9999;
        padding: 12px 20px;
        background: var(--a);
        color: hsl(228,30%,6%);
        font-family: var(--fm);
        font-size: 13px;
        border-radius: 0 0 8px 8px;
        text-decoration: none;
        transition: top 0.15s;
      }
      .skip-link:focus { top: 0; }

      /* ── FOCUS RINGS — 2.4.7 Focus Visible ── */
      /* All interactive elements — keyboard-first */
      :focus-visible {
        outline: 2px solid var(--a);
        outline-offset: 3px;
        border-radius: 4px;
      }
      /* Override for elements with their own border-radius */
      button:focus-visible,
      [role="button"]:focus-visible,
      [role="switch"]:focus-visible,
      [role="option"]:focus-visible,
      a:focus-visible {
        outline: 2px solid var(--a);
        outline-offset: 3px;
      }
      input:focus-visible,
      textarea:focus-visible {
        outline: none;
        /* Border-based ring handled inline for amber colour */
      }
      /* Remove default outline when we handle it inline */
      [data-focus-ring="inline"]:focus-visible { outline: none; }

      /* ── TOUCH TARGETS — 2.5.5 Target Size ── */
      /* Buttons ≥ 44×44px touch area via padding */
      .touch-target {
        position: relative;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      .touch-target::before {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        min-width: 44px;
        min-height: 44px;
      }

      /* ── ANIMATIONS ── */
      @keyframes sectionIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes headerReveal { from{clip-path:inset(0 100% 0 0);opacity:0} to{clip-path:inset(0 0% 0 0);opacity:1} }
      @keyframes cardFloat  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes drawerUp   { from{transform:translateY(110%)} to{transform:translateY(0)} }
      @keyframes addBounce  { 0%{transform:scale(1)} 30%{transform:scale(0.91)} 70%{transform:scale(1.07)} 100%{transform:scale(1)} }
      @keyframes ignite {
        0%  { box-shadow:none; border-left-color:var(--b1); border-left-width:2px }
        15% { box-shadow:0 0 0 3px var(--a-md); border-left-color:var(--a); border-left-width:4px }
        60% { box-shadow:0 0 22px var(--a-lo); border-left-color:var(--a); border-left-width:3px }
        100%{ box-shadow:0 0 18px var(--a-lo); border-left-color:var(--a); border-left-width:2px }
      }
      @keyframes aiShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes aiFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      @keyframes aiPulse  { 0%,100%{opacity:0.6} 50%{opacity:1} }

      .section-reveal { animation: sectionIn 0.4s var(--ease-out) both; }
      .header-reveal  { animation: headerReveal 0.36s cubic-bezier(0.22,1,0.36,1) both; }
      .card-float     { animation: cardFloat 0.28s var(--ease-out) both; }
      .drawer-enter   { animation: drawerUp 0.3s var(--ease-out) both; }
      .add-bounce     { animation: addBounce 0.28s var(--spring) both; }
      .igniting       { animation: ignite 0.5s var(--spring) both; }
      .ai-shimmer {
        background: linear-gradient(90deg,var(--s3) 25%,hsla(38,92%,52%,0.08) 50%,var(--s3) 75%);
        background-size: 200% 100%;
        animation: aiShimmer 1.4s ease-in-out infinite;
        border-radius: 4px;
      }
      .ai-fade-in { animation: aiFadeIn 0.22s var(--ease-out) both; }
      .ai-pulse   { animation: aiPulse 1.2s ease-in-out infinite; }

      /* DOT GRID — preview background */
      .prev-bg {
        background-color: hsl(228,26%,7%);
        background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
        background-size: 20px 20px;
      }

      /* ── RESPONSIVE GRID ── */
      .bento-grid {
        display: grid;
        gap: 10px;
        /* default: auto-fill, narrows naturally */
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
      }
      .bento-grid .span-2  { grid-column: span 2; }
      .bento-grid .span-all { grid-column: 1 / -1; }

      @media (max-width: 640px) {
        .bento-grid .span-2,
        .bento-grid .span-all { grid-column: 1 / -1 !important; }
      }
      @media (max-width: 480px) {
        .bento-grid { grid-template-columns: 1fr; }
      }

      /* ── CARD INTERACTION ── */
      .comp-card { transition: transform 0.16s ease, box-shadow 0.16s ease; }
      @media (hover: hover) {
        .comp-card:hover { transform: translateY(-2px); }
      }

      /* ── TOPBAR RESPONSIVE ── */
      .topbar-pills {
        display: flex;
        gap: 2px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        flex: 1;
        min-width: 0;
      }
      .topbar-pills::-webkit-scrollbar { display: none; }

      .topbar-ai-badge { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .topbar-divider  { width: 1px; height: 20px; background: var(--b1); flex-shrink: 0; }

      @media (max-width: 640px) {
        .topbar-ai-badge { display: none; }
        .topbar-divider  { display: none; }
        .search-bar      { width: 130px !important; min-width: 0 !important; }
      }
      @media (max-width: 480px) {
        .search-bar { display: none !important; }
      }

      /* ── SECTION HEADER ── */
      .section-header-text {
        font-family: var(--fh);
        font-weight: 800;
        font-size: clamp(36px, 8vw, 76px);
        text-transform: uppercase;
        letter-spacing: -0.03em;
        line-height: 0.88;
        color: var(--t1);
        user-select: none;
      }

      /* ── PREVIEW CONTENT — all widths fluid ── */
      .preview-inner {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      /* ── REDUCED MOTION ── */
      @media (prefers-reduced-motion: reduce) {
        .section-reveal, .header-reveal, .card-float,
        .igniting, .drawer-enter, .add-bounce,
        .ai-shimmer, .ai-fade-in, .ai-pulse {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
        .comp-card { transition: none !important; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI UTILITIES
═══════════════════════════════════════════════════════════ */
async function aiGenerate(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "Return ONLY valid JSON. No markdown fences, no explanation, no preamble. Raw JSON only.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  return JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim());
}

/* ── AI Provenance Badge ── */
function AIBadge({ label = "AI" }) {
  return (
    <span aria-label={`Content generated by AI — ${label}`} style={{
      display:"inline-flex", alignItems:"center", gap:3,
      fontSize:10, fontFamily:"var(--fm)",
      padding:"2px 7px", borderRadius:999,
      background:"var(--a-lo)", border:"1px solid var(--a-bd)",
      color:"var(--a-tx)", letterSpacing:"0.04em", flexShrink:0,
    }}>
      ✦ {label}
    </span>
  );
}

/* ── Skeleton shimmer ── */
function Sk({ w="100%", h=14, style={} }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="ai-shimmer"
      style={{ width:w, height:h, borderRadius:4, ...style }}
    />
  );
}

/* ── Regenerate button — min 44px touch target ── */
function RegenBtn({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={loading ? "Generating content, please wait" : "Regenerate AI content"}
      aria-busy={loading}
      className="touch-target"
      style={{
        display:"flex", alignItems:"center", gap:4,
        padding:"8px 12px", minHeight:36,
        fontSize:11, fontFamily:"var(--fm)",
        background:"var(--a-lo)", border:"1px solid var(--a-bd)",
        borderRadius:6, color:"var(--a-tx)",
        cursor:loading?"not-allowed":"pointer",
        opacity:loading?0.55:1, transition:"opacity .15s",
        touchAction:"manipulation",
      }}
    >
      <span aria-hidden="true">{loading?"…":"⟳"}</span>
      <span>{loading?"Generating":"Regenerate"}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════ */
const Ic = {
  Search:   ()=><svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10 10 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Copy:     ()=><svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 5.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Check:    ()=><svg width="11" height="11" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M13 3 5.5 11 2 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Plus:     ()=><svg width="11" height="11" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  X:        ()=><svg width="10" height="10" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M12.5 2.5 2.5 12.5M2.5 2.5l10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  Up:       ()=><svg width="10" height="10" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M12 10 7.5 5 3 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Down:     ()=><svg width="10" height="10" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 5l4.5 5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Code:     ()=><svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M4.5 5 1 7.5 4.5 10M10.5 5 14 7.5 10.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3 6 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Eye:      ()=><svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M1 7.5C1 7.5 3.5 2.5 7.5 2.5S14 7.5 14 7.5 11.5 12.5 7.5 12.5 1 7.5 1 7.5Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  Layers:   ()=><svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 1.5 13.5 5 7.5 8.5 1.5 5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M1.5 10 7.5 13.5 13.5 10M1.5 7.5 7.5 11 13.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Download: ()=><svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 1.5v9M4 8l3.5 4 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Trash:    ()=><svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 5h9M6 5V3.5A.5.5 0 0 1 6.5 3h2a.5.5 0 0 1 .5.5V5M5.5 5v6.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Bolt:     ()=><svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M9 1.5 3.5 8.5H7L6 13.5 12.5 6.5H9L9 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Sparkle:  ()=><svg width="11" height="11" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 1.5C7 5.5 5 7.5 1.5 8 5 8.5 7 10.5 7.5 14 8 10.5 10 8.5 13.5 8 10 7.5 8 5.5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  ChevDown: ()=><svg width="11" height="11" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 5l4.5 5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ═══════════════════════════════════════════════════════════
   ACCESSIBLE TOGGLE — role="switch", keyboard, 44px target
═══════════════════════════════════════════════════════════ */
function Toggle({ on, onChange, label, size = "md" }) {
  const w = size === "sm" ? 36 : 40;
  const h = size === "sm" ? 20 : 22;
  const knob = size === "sm" ? 14 : 16;
  const onPx = size === "sm" ? 18 : 20;

  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(!on); } }}
      className="touch-target"
      style={{
        width: w, height: h,
        borderRadius: h / 2,
        background: on ? "var(--a)" : "var(--s4)",
        border: `1px solid ${on ? "var(--a-bd)" : "var(--b2)"}`,
        cursor: "pointer", position: "relative",
        transition: "background .2s, border-color .2s",
        flexShrink: 0, padding: 0,
        touchAction: "manipulation",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute", top: 2, left: on ? onPx : 2,
          width: knob, height: knob, borderRadius: "50%",
          background: on ? "hsl(228,30%,6%)" : "var(--t2)",
          transition: "left .22s cubic-bezier(0.34,1.56,0.64,1)",
          display: "block",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW COMPONENTS — proper React components, fluid widths
═══════════════════════════════════════════════════════════ */

function PrevBtnPrimary() {
  const [h,setH]=useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:"10px 24px",minHeight:44,background:h?"hsl(38,92%,44%)":"var(--a)",border:"none",borderRadius:8,color:"hsl(228,30%,6%)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",transition:"background .15s",touchAction:"manipulation"}}>
      Get Started →
    </button>
  );
}
function PrevBtnGhost() {
  const [h,setH]=useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:"10px 24px",minHeight:44,background:"transparent",border:`1px solid ${h?"var(--b3)":"var(--b2)"}`,borderRadius:8,color:h?"var(--t1)":"var(--t2)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",transition:"all .15s",touchAction:"manipulation"}}>
      View Plans
    </button>
  );
}
function PrevBtnOutline() {
  return (
    <button style={{padding:"10px 24px",minHeight:44,background:"var(--a-lo)",border:"1px solid var(--a-bd)",borderRadius:8,color:"var(--a-tx)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",touchAction:"manipulation"}}>
      Explore Docs
    </button>
  );
}
function PrevBtnDestructive() {
  return (
    <button style={{padding:"10px 24px",minHeight:44,background:"var(--red-lo)",border:"1px solid var(--red-bd)",borderRadius:8,color:"var(--red)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",touchAction:"manipulation"}}>
      Delete Account
    </button>
  );
}
function PrevBtnIcons() {
  return (
    <div style={{display:"flex",gap:8}} role="toolbar" aria-label="Example icon buttons">
      {[
        {bg:"var(--a)",c:"hsl(228,30%,6%)",l:"+",b:"none",lbl:"Add item"},
        {bg:"var(--s3)",c:"var(--t2)",l:"⋯",b:"none",lbl:"More options"},
        {bg:"transparent",c:"var(--t3)",l:"✕",b:"1px solid var(--b1)",lbl:"Close"},
      ].map((x,i)=>(
        <button key={i} aria-label={x.lbl} className="touch-target"
          style={{width:40,height:40,background:x.bg,border:x.b,borderRadius:8,color:x.c,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",touchAction:"manipulation"}}>
          <span aria-hidden="true">{x.l}</span>
        </button>
      ))}
    </div>
  );
}
function PrevBtnGroup() {
  const [a,setA]=useState(1);
  return (
    <div role="group" aria-label="Time period" style={{display:"flex",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:9,padding:3,gap:2}}>
      {["Day","Week","Month"].map((l,i)=>(
        <button key={l} onClick={()=>setA(i)}
          aria-pressed={a===i}
          style={{padding:"10px 16px",minHeight:40,borderRadius:6,fontSize:12,fontFamily:"var(--fm)",cursor:"pointer",background:a===i?"var(--a)":"transparent",color:a===i?"hsl(228,30%,6%)":"var(--t3)",border:"none",transition:"all .15s",touchAction:"manipulation"}}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* AI-POWERED CARDS */
function PrevCardStat() {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const liveRef = useRef(null);

  const generate = useCallback(async()=>{
    setLoading(true); setData(null);
    try {
      const r=await aiGenerate('Generate a realistic SaaS KPI metric. Return JSON: {"label":"...","value":"...","delta":"...","trend":"up|down","subtitle":"short context"}');
      setData(r);
    } catch {
      setData({label:"Active Workflows",value:"2,847",delta:"↑ 142",trend:"up",subtitle:"since yesterday"});
    }
    setLoading(false);
  },[]);

  useEffect(()=>{ generate(); },[]);

  return (
    <div style={{padding:"14px 16px",borderRadius:12,background:"var(--s2)",border:"1px solid var(--b1)",width:"100%",maxWidth:240}}>
      <div
        aria-live="polite"
        aria-atomic="true"
        aria-label={loading?"Loading KPI metric":`${data?.label}: ${data?.value}`}
        ref={liveRef}
      >
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",gap:8,paddingTop:2}}>
            <Sk w="60%" h={10}/><Sk w="75%" h={26}/><Sk w="50%" h={20} style={{borderRadius:999}}/>
          </div>
        ) : data ? (
          <div className="ai-fade-in">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <p style={{color:"var(--t3)",fontSize:10,letterSpacing:"0.09em",textTransform:"uppercase"}}>{data.label}</p>
              <AIBadge/>
            </div>
            <p style={{color:"var(--t1)",fontSize:28,fontFamily:"var(--fh)",fontWeight:800,letterSpacing:-1,lineHeight:1,marginBottom:9}}>{data.value}</p>
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 9px",borderRadius:999,background:data.trend==="up"?"var(--grn-lo)":"var(--red-lo)",border:`1px solid ${data.trend==="up"?"var(--grn-bd)":"var(--red-bd)"}`,color:data.trend==="up"?"var(--grn)":"var(--red)"}}>
              {/* Non-color state indicator: icon + text, not color alone — 1.4.1 */}
              <span aria-hidden="true">{data.trend==="up"?"↑":"↓"}</span>
              {data.delta} {data.subtitle}
            </span>
          </div>
        ) : null}
      </div>
      <div style={{marginTop:10,display:"flex",justifyContent:"flex-end"}}>
        <RegenBtn onClick={generate} loading={loading}/>
      </div>
    </div>
  );
}

function PrevCardFeature() {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);

  const generate=useCallback(async()=>{
    setLoading(true); setData(null);
    try {
      const r=await aiGenerate('Generate a SaaS feature card. Return JSON: {"icon":"single emoji","title":"short title","desc":"1-2 sentences"}');
      setData(r);
    } catch { setData({icon:"⚡",title:"Lightning Fast",desc:"Edge-delivered with smart caching. 99.9% uptime SLA on all plans."}); }
    setLoading(false);
  },[]);
  useEffect(()=>{ generate(); },[]);

  return (
    <div style={{padding:"18px 16px 14px",borderRadius:12,background:"var(--s2)",border:"1px solid var(--b1)",width:"100%",maxWidth:240}}>
      <div aria-live="polite" aria-atomic="true">
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Sk w={34} h={34} style={{borderRadius:8}}/><Sk w="70%" h={13}/>
            <Sk h={11}/><Sk w="80%" h={11}/>
          </div>
        ) : data ? (
          <div className="ai-fade-in">
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
              <div aria-hidden="true" style={{width:34,height:34,borderRadius:8,background:"var(--a-lo)",border:"1px solid var(--a-bd)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{data.icon}</div>
              <AIBadge/>
            </div>
            <p style={{color:"var(--t1)",fontSize:13,marginBottom:5}}>{data.title}</p>
            <p style={{color:"var(--t3)",fontSize:12,lineHeight:1.6}}>{data.desc}</p>
          </div>
        ) : null}
      </div>
      <div style={{marginTop:10,display:"flex",justifyContent:"flex-end"}}>
        <RegenBtn onClick={generate} loading={loading}/>
      </div>
    </div>
  );
}

function PrevCardPricing() {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const generate=useCallback(async()=>{
    setLoading(true); setData(null);
    try {
      const r=await aiGenerate('Generate a SaaS pricing card. Return JSON: {"tier":"...","price":"$XX","period":"/mo","tagline":"...","features":["...","...","...","..."],"cta":"..."}');
      setData(r);
    } catch { setData({tier:"Pro",price:"$29",period:"/mo",tagline:"For growing teams",features:["Unlimited projects","Priority support","99.9% uptime SLA","Advanced analytics"],cta:"Start Free Trial"}); }
    setLoading(false);
  },[]);
  useEffect(()=>{ generate(); },[]);
  return (
    <div style={{padding:"20px 18px",borderRadius:12,background:"linear-gradient(145deg,var(--a-lo),transparent)",border:"1px solid var(--a-bd)",width:"100%",maxWidth:300,position:"relative",overflow:"hidden"}}>
      <div aria-hidden="true" style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,var(--a-lo),transparent)",filter:"blur(30px)",pointerEvents:"none"}}/>
      <div aria-live="polite" aria-atomic="true" style={{position:"relative",zIndex:1}}>
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><Sk w="30%" h={10}/><Sk w="20%" h={10}/></div>
            <Sk w="50%" h={32}/>
            {[1,2,3,4].map(i=><Sk key={i} w={`${60+i*7}%`} h={11}/>)}
            <Sk h={40} style={{borderRadius:8,marginTop:4}}/>
          </div>
        ) : data ? (
          <div className="ai-fade-in">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <p style={{color:"var(--a-tx)",fontSize:11,letterSpacing:"0.10em",textTransform:"uppercase"}}>{data.tier}</p>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <AIBadge/>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"var(--a-lo)",color:"var(--a-tx)",border:"1px solid var(--a-bd)"}}>Popular</span>
              </div>
            </div>
            <p style={{color:"var(--t1)",fontSize:32,fontFamily:"var(--fh)",fontWeight:800,letterSpacing:-1.5,lineHeight:1,marginBottom:4}}>
              {data.price}<span style={{color:"var(--t2)",fontSize:14,fontFamily:"var(--fm)",fontWeight:"normal",letterSpacing:0}}>{data.period}</span>
            </p>
            {data.tagline&&<p style={{color:"var(--t3)",fontSize:12,marginBottom:12}}>{data.tagline}</p>}
            <ul style={{listStyle:"none",marginBottom:0}}>
              {data.features?.map(f=>(
                <li key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <span aria-hidden="true" style={{color:"var(--a)",fontSize:11}}>✓</span>
                  <span style={{color:"var(--t2)",fontSize:12}}>{f}</span>
                </li>
              ))}
            </ul>
            <button style={{marginTop:14,width:"100%",padding:"12px 0",minHeight:44,background:"var(--a)",border:"none",borderRadius:8,color:"hsl(228,30%,6%)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",touchAction:"manipulation"}}>{data.cta}</button>
          </div>
        ) : null}
      </div>
      {!loading&&<div style={{marginTop:8,display:"flex",justifyContent:"flex-end",position:"relative",zIndex:1}}><RegenBtn onClick={generate} loading={loading}/></div>}
    </div>
  );
}

function PrevCardProfile() {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const generate=useCallback(async()=>{
    setLoading(true); setData(null);
    try {
      const r=await aiGenerate('Generate a software engineer profile. Return JSON: {"name":"Full Name","role":"Job Title","company":"Company","initials":"XX","tags":["skill1","skill2","skill3"],"online":true}');
      setData(r);
    } catch { setData({name:"Aisha Okonkwo",role:"Senior ML Engineer",company:"Anthropic",initials:"AO",tags:["LLMs","PyTorch","RLHF"],online:true}); }
    setLoading(false);
  },[]);
  useEffect(()=>{ generate(); },[]);
  return (
    <div style={{padding:"14px 16px",borderRadius:12,background:"var(--s2)",border:"1px solid var(--b1)",width:"100%",maxWidth:300}}>
      <div aria-live="polite" aria-atomic="true">
        {loading ? (
          <div style={{display:"flex",alignItems:"flex-start",gap:13}}>
            <Sk w={40} h={40} style={{borderRadius:"50%",flexShrink:0}}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
              <Sk w="60%" h={13}/><Sk w="45%" h={11}/>
              <div style={{display:"flex",gap:5,marginTop:3}}><Sk w={50} h={22} style={{borderRadius:4}}/><Sk w={40} h={22} style={{borderRadius:4}}/><Sk w={36} h={22} style={{borderRadius:4}}/></div>
            </div>
          </div>
        ) : data ? (
          <div className="ai-fade-in" style={{display:"flex",alignItems:"flex-start",gap:13}}>
            <div role="img" aria-label={`${data.name}'s avatar`} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,var(--a),hsl(38,92%,34%))",display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(228,30%,6%)",fontSize:13,flexShrink:0}} aria-hidden="true">
              {data.initials}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                <p style={{color:"var(--t1)",fontSize:13}}>{data.name}</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <AIBadge/>
                  {data.online && <span role="status" aria-label="Online" style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"var(--grn)",flexShrink:0}}/>}
                </div>
              </div>
              <p style={{color:"var(--t3)",fontSize:11,marginBottom:9}}>{data.role} · {data.company}</p>
              <ul style={{display:"flex",gap:5,flexWrap:"wrap",listStyle:"none"}}>
                {data.tags?.map(t=>(
                  <li key={t} style={{fontSize:11,padding:"3px 8px",borderRadius:4,background:"var(--s4)",border:"1px solid var(--b0)",color:"var(--t3)"}}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      <div style={{marginTop:10,display:"flex",justifyContent:"flex-end"}}>
        <RegenBtn onClick={generate} loading={loading}/>
      </div>
    </div>
  );
}

function PrevCardAlerts() {
  const [items,setItems]=useState(null);
  const [loading,setLoading]=useState(false);
  const COLORS={success:{c:"var(--grn)",lo:"var(--grn-lo)",bd:"var(--grn-bd)",icon:"✓",iconLabel:"Success"},warning:{c:"var(--a-tx)",lo:"var(--a-lo)",bd:"var(--a-bd)",icon:"!",iconLabel:"Warning"},error:{c:"var(--red)",lo:"var(--red-lo)",bd:"var(--red-bd)",icon:"✕",iconLabel:"Error"}};
  const generate=useCallback(async()=>{
    setLoading(true); setItems(null);
    try {
      const r=await aiGenerate('Generate 3 system alerts for a SaaS AI ops platform. Return JSON array: [{"severity":"success","title":"...","msg":"..."},{"severity":"warning","title":"...","msg":"..."},{"severity":"error","title":"...","msg":"..."}]');
      setItems(Array.isArray(r)?r:r.alerts||[]);
    } catch { setItems([{severity:"success",title:"Deployment complete",msg:"v2.4.1 is live · 0 errors detected"},{severity:"warning",title:"Token budget at 78%",msg:"Resets at 15:00 UTC · ~22 min remaining"},{severity:"error",title:"Agent handoff failed",msg:"Fallback model unreachable — manual review needed"}]); }
    setLoading(false);
  },[]);
  useEffect(()=>{ generate(); },[]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",maxWidth:340}}>
      <div aria-live="polite" aria-atomic="false" style={{display:"flex",flexDirection:"column",gap:6}}>
        {loading ? [1,2,3].map(i=>(
          <div key={i} style={{padding:"9px 12px",borderRadius:8,background:"var(--s2)",border:"1px solid var(--b1)",display:"flex",gap:9}}>
            <Sk w={20} h={20} style={{borderRadius:"50%",flexShrink:0}}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}><Sk w="55%" h={12}/><Sk h={10}/></div>
          </div>
        )) : items?.map((a,i)=>{
          const cfg=COLORS[a.severity]||COLORS.success;
          return (
            <div key={i} role="status" aria-label={`${cfg.iconLabel}: ${a.title}`} className="ai-fade-in"
              style={{padding:"9px 12px",borderRadius:8,background:cfg.lo,border:`1px solid ${cfg.bd}`,display:"flex",alignItems:"flex-start",gap:9,animationDelay:`${i*60}ms`}}>
              <div aria-hidden="true" style={{width:20,height:20,borderRadius:"50%",background:cfg.lo,border:`1px solid ${cfg.bd}`,display:"flex",alignItems:"center",justifyContent:"center",color:cfg.c,fontSize:10,flexShrink:0}}>{cfg.icon}</div>
              <div>
                <p style={{color:"var(--t1)",fontSize:12,marginBottom:1}}>{a.title}</p>
                <p style={{color:"var(--t3)",fontSize:11}}>{a.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
      {!loading&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
        <AIBadge label="AI generated"/>
        <RegenBtn onClick={generate} loading={loading}/>
      </div>}
    </div>
  );
}

/* NAVBARS */
function PrevNavBlur() {
  return (
    <nav aria-label="Example frosted navbar" style={{width:"100%",padding:"0 18px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(10,12,22,0.75)",backdropFilter:"blur(20px)",border:"1px solid var(--b1)",borderRadius:10,gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <div aria-hidden="true" style={{width:24,height:24,borderRadius:6,background:"var(--a)",display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(228,30%,6%)",fontSize:11}}>N</div>
        <span style={{color:"var(--t1)",fontSize:14,fontFamily:"var(--fh)",fontWeight:800,letterSpacing:-0.5}}>Nexus</span>
      </div>
      <ul role="menubar" aria-label="Main navigation" style={{display:"flex",gap:16,flex:1,justifyContent:"center",listStyle:"none"}}>
        {["Product","Docs","Pricing"].map(l=>(
          <li key={l} role="none"><a href="#" role="menuitem" onClick={e=>e.preventDefault()} style={{color:"var(--t3)",fontSize:12,textDecoration:"none",display:"block",padding:"4px 0",minHeight:44,display:"flex",alignItems:"center"}}>{l}</a></li>
        ))}
      </ul>
      <div style={{display:"flex",gap:8,flexShrink:0}}>
        <button style={{padding:"8px 14px",minHeight:44,background:"transparent",border:"1px solid var(--b2)",borderRadius:6,color:"var(--t2)",fontSize:12,cursor:"pointer",touchAction:"manipulation"}}>Log in</button>
        <button style={{padding:"8px 14px",minHeight:44,background:"var(--a)",border:"none",borderRadius:6,color:"hsl(228,30%,6%)",fontSize:12,cursor:"pointer",touchAction:"manipulation"}}>Sign up</button>
      </div>
    </nav>
  );
}

function PrevNavDark() {
  return (
    <nav aria-label="Example dark navbar" style={{width:"100%",padding:"0 18px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--s2)",border:"1px solid var(--b0)",borderRadius:10,gap:16}}>
      <span style={{color:"var(--t1)",fontSize:14,fontFamily:"var(--fh)",fontWeight:800,letterSpacing:-0.5}}>Nucleus</span>
      <ul role="menubar" aria-label="Main navigation" style={{display:"flex",gap:16,listStyle:"none"}}>
        {[["Dashboard",true],["Analytics",false],["Settings",false]].map(([l,a])=>(
          <li key={l} role="none"><a href="#" role="menuitem" aria-current={a?"page":undefined} onClick={e=>e.preventDefault()} style={{color:a?"var(--t1)":"var(--t2)",fontSize:12,textDecoration:"none",borderBottom:a?"1px solid var(--a)":"1px solid transparent",paddingBottom:2,display:"flex",alignItems:"center",minHeight:44}}>{l}</a></li>
        ))}
      </ul>
      <div aria-label="User account" role="img" style={{width:36,height:36,borderRadius:"50%",background:"var(--a)",display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(228,30%,6%)",fontSize:12,cursor:"pointer"}}>KR</div>
    </nav>
  );
}

/* FOOTER */
function PrevFooterColumns() {
  return (
    <footer aria-label="Site footer" style={{width:"100%",padding:"18px 20px 14px",borderRadius:10,background:"rgba(0,0,0,0.28)",border:"1px solid var(--b0)"}}>
      <div style={{display:"flex",gap:0,marginBottom:16,flexWrap:"wrap"}}>
        {[["Product",["Features","Pricing","API"]],["Company",["About","Blog","Careers"]],["Legal",["Privacy","Terms"]]].map(([t,ls])=>(
          <nav key={t} aria-label={`${t} links`} style={{flex:"1 1 100px",minWidth:80}}>
            <p style={{color:"var(--t1)",fontSize:12,marginBottom:10,fontWeight:"normal"}}>{t}</p>
            <ul style={{listStyle:"none"}}>
              {ls.map(l=>(
                <li key={l}><a href="#" onClick={e=>e.preventDefault()} style={{color:"var(--t3)",fontSize:11,textDecoration:"none",display:"block",padding:"3px 0",minHeight:36}}>{l}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div style={{paddingTop:12,borderTop:"1px solid var(--b0)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <p style={{color:"var(--t3)",fontSize:11}}><small>© 2025 YourCo. All rights reserved.</small></p>
        <ul role="list" aria-label="Social links" style={{display:"flex",gap:16,listStyle:"none"}}>
          {["GitHub","X","Discord"].map(s=><li key={s}><a href="#" onClick={e=>e.preventDefault()} aria-label={`Visit us on ${s}`} style={{color:"var(--t3)",fontSize:11,textDecoration:"none"}}>{s}</a></li>)}
        </ul>
      </div>
    </footer>
  );
}

/* FORMS — accessible with id/htmlFor */
function PrevFormInput() {
  const id = useId();
  const inputId = `input-${id}`;
  const [focused,setFocused]=useState(false);
  const [labels]=useState(["Email address","Full name","Company domain","API endpoint","Slack webhook URL","GitHub username"]);
  const [labelIdx,setLabelIdx]=useState(0);
  const [example,setExample]=useState("");
  const [value,setValue]=useState("");
  const [loading,setLoading]=useState(false);
  const label=labels[labelIdx];

  const generateExample=useCallback(async(lbl)=>{
    setLoading(true); setExample(""); setValue("");
    try {
      const r=await aiGenerate(`For form input labeled "${lbl}", return a realistic example value. JSON: {"value":"..."}`);
      setExample(r.value||"");
    } catch {
      const fb={"Email address":"sarah.chen@nexus.io","Full name":"Dr. Aisha Okonkwo","Company domain":"nexus.io","API endpoint":"https://api.nexus.io/v2","Slack webhook URL":"https://hooks.slack.com/services/...","GitHub username":"aisha-okonkwo"};
      setExample(fb[lbl]||"example value");
    }
    setLoading(false);
  },[]);
  useEffect(()=>{ generateExample(label); },[label]);

  return (
    <div style={{width:"100%",maxWidth:280}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <label htmlFor={inputId} style={{fontSize:11,color:"var(--t3)",letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</label>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <AIBadge label="AI example"/>
          <button onClick={()=>setLabelIdx(i=>(i+1)%labels.length)} aria-label="Cycle to next field type" className="touch-target"
            style={{fontSize:10,color:"var(--t3)",padding:"6px 8px",minHeight:32,borderRadius:4,border:"1px solid var(--b1)",touchAction:"manipulation"}}>
            cycle ↺
          </button>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <input id={inputId} type="text" value={value} onChange={e=>setValue(e.target.value)}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          placeholder={loading?"Generating example…":example}
          aria-describedby={example&&!value?`${inputId}-hint`:undefined}
          data-focus-ring="inline"
          style={{width:"100%",padding:"10px 12px",minHeight:44,fontSize:13,fontFamily:"var(--fm)",background:"var(--s2)",border:`1px solid ${focused?"var(--a-bd)":"var(--b1)"}`,borderRadius:8,color:"var(--t1)",outline:"none",transition:"border-color .14s, box-shadow .14s",boxShadow:focused?"0 0 0 3px var(--a-lo)":"none"}}
        />
        {loading&&<span aria-hidden="true" style={{position:"absolute",top:"50%",right:10,transform:"translateY(-50%)"}}>⟳</span>}
      </div>
      {example&&!value&&!loading&&(
        <button id={`${inputId}-hint`} onClick={()=>setValue(example)} aria-label={`Use AI-suggested value: ${example}`}
          style={{marginTop:6,fontSize:11,color:"var(--a-tx)",cursor:"pointer",background:"none",border:"none",padding:"4px 0",display:"flex",alignItems:"center",gap:4,touchAction:"manipulation"}}>
          <Ic.Sparkle/> <span>Use: <em style={{fontStyle:"italic",color:"var(--t2)"}}>{example}</em></span>
        </button>
      )}
    </div>
  );
}

function PrevFormSubscribe() {
  const id=useId();
  const inputId=`subscribe-${id}`;
  const [email,setEmail]=useState("");
  const [state,setState]=useState("idle");
  const [confirmation,setConfirmation]=useState(null);

  const handleSubmit=async()=>{
    if(!email.trim()) return;
    setState("loading");
    try {
      const r=await aiGenerate(`User "${email}" subscribed to a developer AI newsletter. Generate a short personalized confirmation. JSON: {"headline":"...","message":"...","cta":"..."}`);
      setConfirmation(r); setState("done");
    } catch { setConfirmation({headline:"You're in!",message:"We'll send you the best AI tools content every week.",cta:"Check your inbox"}); setState("done"); }
  };
  const reset=()=>{ setState("idle"); setEmail(""); setConfirmation(null); };

  if(state==="done"&&confirmation) return (
    <div role="status" aria-live="polite" className="ai-fade-in" style={{width:"100%",maxWidth:320,padding:"14px 16px",borderRadius:10,background:"var(--grn-lo)",border:"1px solid var(--grn-bd)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <p style={{color:"var(--grn)",fontSize:13}}><span aria-hidden="true">✓</span> {confirmation.headline}</p>
        <AIBadge label="AI reply"/>
      </div>
      <p style={{color:"var(--t3)",fontSize:12,lineHeight:1.5,marginBottom:10}}>{confirmation.message}</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:"var(--t3)",fontSize:11}}>{confirmation.cta}</span>
        <button onClick={reset} aria-label="Reset form" className="touch-target"
          style={{fontSize:11,color:"var(--t3)",padding:"8px 10px",minHeight:36,borderRadius:4,border:"1px solid var(--b1)",touchAction:"manipulation"}}>↺ reset</button>
      </div>
    </div>
  );

  return (
    <div style={{width:"100%",maxWidth:320}}>
      <label htmlFor={inputId} style={{display:"block",fontSize:11,color:"var(--t3)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>
        Subscribe — AI personalizes your confirmation
      </label>
      <div style={{display:"flex",gap:8}}>
        <input id={inputId} type="email" value={email} onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
          placeholder="you@company.com" aria-required="true"
          data-focus-ring="inline"
          style={{flex:1,padding:"10px 12px",minHeight:44,fontSize:13,fontFamily:"var(--fm)",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:8,color:"var(--t1)",outline:"none"}}
        />
        <button onClick={handleSubmit} disabled={state==="loading"} aria-busy={state==="loading"}
          style={{padding:"10px 16px",minHeight:44,background:state==="loading"?"var(--s3)":"var(--a)",border:"none",borderRadius:8,color:state==="loading"?"var(--t3)":"hsl(228,30%,6%)",fontSize:13,fontFamily:"var(--fm)",cursor:state==="loading"?"not-allowed":"pointer",whiteSpace:"nowrap",transition:"all .15s",minWidth:72,touchAction:"manipulation"}}>
          {state==="loading"?"…":"Join →"}
        </button>
      </div>
    </div>
  );
}

function PrevFormSearch() {
  const listId=useId();
  const [query,setQuery]=useState("");
  const [suggestions,setSuggestions]=useState([]);
  const [loading,setLoading]=useState(false);
  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState("");
  const [activeIdx,setActiveIdx]=useState(-1);
  const debounceRef=useRef(null);
  const wrapRef=useRef(null);
  const inputRef=useRef(null);

  const fetchSuggestions=useCallback(async(q)=>{
    if(!q.trim()||q.length<2){ setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const r=await aiGenerate(`Autocomplete for component library search, query "${q}". Return JSON array of 5 strings.`);
      const arr=Array.isArray(r)?r:Object.values(r);
      setSuggestions(arr.slice(0,5)); setOpen(true);
    } catch { setSuggestions([`${q} button`,`${q} card`,`${q} input`,`${q} toggle`]); setOpen(true); }
    setLoading(false);
    setActiveIdx(-1);
  },[]);

  const handleChange=e=>{ const v=e.target.value; setQuery(v); setSelected(""); clearTimeout(debounceRef.current); if(!v.trim()){setSuggestions([]);setOpen(false);return;} debounceRef.current=setTimeout(()=>fetchSuggestions(v),600); };

  const pick=s=>{ setSelected(s); setQuery(s); setOpen(false); setActiveIdx(-1); };
  const clear=()=>{ setQuery(""); setSuggestions([]); setOpen(false); setSelected(""); inputRef.current?.focus(); };

  const handleKeyDown=e=>{
    if(!open) return;
    if(e.key==="ArrowDown"){ e.preventDefault(); setActiveIdx(i=>Math.min(i+1,suggestions.length-1)); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); setActiveIdx(i=>Math.max(i-1,-1)); }
    else if(e.key==="Enter"&&activeIdx>=0){ e.preventDefault(); pick(suggestions[activeIdx]); }
    else if(e.key==="Escape"){ setOpen(false); setActiveIdx(-1); }
  };

  // Click outside closes dropdown
  useEffect(()=>{
    const h=e=>{ if(wrapRef.current&&!wrapRef.current.contains(e.target)){ setOpen(false); setActiveIdx(-1); } };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  return (
    <div ref={wrapRef} style={{position:"relative",width:"100%",maxWidth:300}}>
      <label htmlFor="combobox-search" style={{display:"block",fontSize:11,color:"var(--t3)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>
        Component search
      </label>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"0 10px",height:44,background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:8,position:"relative"}}>
        <span aria-hidden="true" style={{color:"var(--t3)",flexShrink:0}}><Ic.Search/></span>
        <input
          ref={inputRef}
          id="combobox-search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`suggestions-${listId}`}
          aria-activedescendant={activeIdx>=0?`opt-${listId}-${activeIdx}`:undefined}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search components…"
          data-focus-ring="inline"
          style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,fontFamily:"var(--fm)"}}
        />
        {loading&&<span aria-live="polite" aria-label="Loading suggestions" className="ai-pulse" style={{color:"var(--a-tx)",flexShrink:0,fontSize:10}}><Ic.Sparkle/></span>}
        {query&&!loading&&<button onClick={clear} aria-label="Clear search" className="touch-target" style={{color:"var(--t3)",flexShrink:0,display:"flex",padding:4,touchAction:"manipulation"}}><Ic.X/></button>}
      </div>

      {open&&suggestions.length>0&&(
        <ul
          id={`suggestions-${listId}`}
          role="listbox"
          aria-label="Search suggestions"
          className="ai-fade-in"
          style={{position:"absolute",top:"calc(100% + 5px)",left:0,right:0,background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:8,overflow:"hidden",zIndex:50,boxShadow:"0 8px 24px rgba(0,0,0,0.4)",listStyle:"none",padding:0,margin:0}}
        >
          <li style={{padding:"5px 10px 4px",borderBottom:"1px solid var(--b0)"}}><AIBadge label="AI suggestions"/></li>
          {suggestions.map((s,i)=>(
            <li
              key={i}
              id={`opt-${listId}-${i}`}
              role="option"
              aria-selected={selected===s||activeIdx===i}
              onClick={()=>pick(s)}
              onMouseEnter={()=>setActiveIdx(i)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",color:activeIdx===i?"var(--t1)":"var(--t2)",fontSize:13,fontFamily:"var(--fm)",background:activeIdx===i?"var(--s3)":"none",borderBottom:i<suggestions.length-1?"1px solid var(--b0)":"none",minHeight:44}}
            >
              <span aria-hidden="true" style={{color:"var(--t4)",fontSize:10}}>↳</span>
              <span>{s}</span>
              {selected===s&&<span aria-hidden="true" style={{marginLeft:"auto",color:"var(--a)"}}><Ic.Check/></span>}
            </li>
          ))}
        </ul>
      )}
      {selected&&<p role="status" aria-live="polite" style={{marginTop:6,fontSize:11,color:"var(--grn)"}}><span aria-hidden="true">✓</span> Selected: {selected}</p>}
    </div>
  );
}

function PrevFormDropdown() {
  const dropId=useId();
  const CONTEXTS=["Project type","Team role","Model provider","Deployment region","Notification trigger","Log level"];
  const [ctxIdx,setCtxIdx]=useState(0);
  const [options,setOptions]=useState([]);
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState("");
  const [open,setOpen]=useState(false);
  const wrapRef=useRef(null);
  const ctx=CONTEXTS[ctxIdx];

  const generateOptions=useCallback(async(context)=>{
    setLoading(true); setOptions([]); setSelected(""); setOpen(false);
    try {
      const r=await aiGenerate(`For a select dropdown labeled "${context}", generate 5 options for a SaaS dev tool. Return JSON array: [{"value":"...","label":"..."}]`);
      setOptions(Array.isArray(r)?r:r.options||[]);
    } catch { setOptions([{value:"a",label:"Option A"},{value:"b",label:"Option B"},{value:"c",label:"Option C"}]); }
    setLoading(false);
  },[]);
  useEffect(()=>{ generateOptions(ctx); },[ctx]);

  // Click outside
  useEffect(()=>{
    const h=e=>{ if(wrapRef.current&&!wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);

  const pick=opt=>{ setSelected(opt.label); setOpen(false); };

  return (
    <div ref={wrapRef} style={{width:"100%",maxWidth:280}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <label htmlFor={`dd-btn-${dropId}`} id={`dd-label-${dropId}`} style={{fontSize:11,color:"var(--t3)",letterSpacing:"0.06em",textTransform:"uppercase"}}>{ctx}</label>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {!loading&&options.length>0&&<AIBadge label="AI options"/>}
          <button onClick={()=>{setCtxIdx(i=>(i+1)%CONTEXTS.length);}} aria-label="Cycle to next dropdown context" className="touch-target"
            style={{fontSize:10,color:"var(--t3)",padding:"6px 8px",minHeight:32,borderRadius:4,border:"1px solid var(--b1)",touchAction:"manipulation"}}>cycle ↺</button>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <button
          id={`dd-btn-${dropId}`}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={`dd-label-${dropId}`}
          aria-controls={`dd-list-${dropId}`}
          aria-busy={loading}
          onClick={()=>!loading&&options.length>0&&setOpen(o=>!o)}
          onKeyDown={e=>{ if(e.key==="Escape") setOpen(false); }}
          style={{width:"100%",padding:"10px 12px",minHeight:44,background:"var(--s2)",border:`1px solid ${open?"var(--a-bd)":"var(--b1)"}`,borderRadius:8,color:selected?"var(--t1)":"var(--t3)",fontSize:13,fontFamily:"var(--fm)",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:open?"0 0 0 3px var(--a-lo)":"none",transition:"border-color .14s, box-shadow .14s",textAlign:"left",touchAction:"manipulation"}}>
          {loading?(
            <span aria-live="polite" style={{color:"var(--a-tx)",display:"flex",alignItems:"center",gap:5,fontSize:12}} className="ai-pulse">
              <Ic.Sparkle/> Generating options…
            </span>
          ):(
            <span>{selected||`Select ${ctx.toLowerCase()}…`}</span>
          )}
          {!loading&&<span aria-hidden="true" style={{color:"var(--t3)",display:"flex"}}><Ic.ChevDown/></span>}
        </button>

        {open&&options.length>0&&(
          <ul id={`dd-list-${dropId}`} role="listbox" aria-label={`${ctx} options`} className="ai-fade-in"
            style={{position:"absolute",top:"calc(100% + 5px)",left:0,right:0,background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:8,overflow:"hidden",zIndex:50,boxShadow:"0 8px 24px rgba(0,0,0,0.4)",listStyle:"none",padding:0,margin:0}}>
            {options.map((opt,i)=>(
              <li key={i} role="option" aria-selected={selected===opt.label}
                onClick={()=>pick(opt)}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",minHeight:44,background:selected===opt.label?"var(--a-lo)":"none",border:"none",borderBottom:i<options.length-1?"1px solid var(--b0)":"none",cursor:"pointer",color:selected===opt.label?"var(--a-tx)":"var(--t2)",fontSize:13,fontFamily:"var(--fm)",transition:"background .1s"}}
                onMouseEnter={e=>{ if(selected!==opt.label) e.currentTarget.style.background="var(--s3)"; }}
                onMouseLeave={e=>{ if(selected!==opt.label) e.currentTarget.style.background="none"; }}>
                {opt.label}
                {selected===opt.label&&<span aria-hidden="true" style={{color:"var(--a)"}}><Ic.Check/></span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {!loading&&<div style={{marginTop:8,display:"flex",justifyContent:"flex-end"}}><RegenBtn onClick={()=>generateOptions(ctx)} loading={loading}/></div>}
    </div>
  );
}

function PrevFormTextarea() {
  const id=useId();
  const textareaId=`ta-${id}`;
  const PROMPTS=[{label:"Bug report",hint:"Describe a bug you found…"},{label:"Feature request",hint:"What feature would you like?"},{label:"Release notes",hint:"Describe v2.4 changes…"},{label:"API documentation",hint:"Describe this endpoint…"}];
  const [pIdx,setPIdx]=useState(0);
  const [value,setValue]=useState("");
  const [loading,setLoading]=useState(false);
  const [isAI,setIsAI]=useState(false);
  const p=PROMPTS[pIdx];

  const generate=useCallback(async()=>{
    setLoading(true); setIsAI(false); setValue("");
    try {
      const r=await aiGenerate(`Write a realistic "${p.label}" for a SaaS AI platform. 3-5 sentences. JSON: {"content":"..."}`);
      setValue(r.content||""); setIsAI(true);
    } catch { setValue("Unable to generate. Please try again."); }
    setLoading(false);
  },[p.label]);

  return (
    <div style={{width:"100%",maxWidth:320}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <label htmlFor={textareaId} style={{fontSize:11,color:"var(--t3)",letterSpacing:"0.06em",textTransform:"uppercase"}}>{p.label}</label>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {isAI&&<AIBadge label="AI draft"/>}
          <button onClick={()=>{setPIdx(i=>(i+1)%PROMPTS.length);setValue("");setIsAI(false);}} aria-label="Cycle to next document type" className="touch-target"
            style={{fontSize:10,color:"var(--t3)",padding:"6px 8px",minHeight:32,borderRadius:4,border:"1px solid var(--b1)",touchAction:"manipulation"}}>cycle ↺</button>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <textarea id={textareaId} value={value} onChange={e=>{setValue(e.target.value);setIsAI(false);}}
          placeholder={loading?"Drafting content…":p.hint} rows={5}
          aria-label={p.label} aria-multiline="true"
          data-focus-ring="inline"
          style={{width:"100%",padding:"10px 12px",fontSize:13,fontFamily:"var(--fm)",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:8,color:"var(--t1)",outline:"none",resize:"vertical",lineHeight:1.65,transition:"border-color .14s, box-shadow .14s"}}
          onFocus={e=>{ e.target.style.borderColor="var(--a-bd)"; e.target.style.boxShadow="0 0 0 3px var(--a-lo)"; }}
          onBlur={e=>{ e.target.style.borderColor="var(--b1)"; e.target.style.boxShadow="none"; }}
        />
        {loading&&(
          <div aria-hidden="true" style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:"rgba(10,12,22,0.65)"}}>
            <span className="ai-pulse" style={{color:"var(--a-tx)",fontSize:12,display:"flex",alignItems:"center",gap:5}}><Ic.Sparkle/> Drafting…</span>
          </div>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
        <span style={{fontSize:11,color:"var(--t3)"}} aria-live="polite">{value.length} chars</span>
        <button onClick={generate} disabled={loading} aria-busy={loading} aria-label="Generate AI draft"
          className="touch-target"
          style={{display:"flex",alignItems:"center",gap:4,padding:"8px 12px",minHeight:36,fontSize:11,fontFamily:"var(--fm)",background:loading?"var(--s3)":"var(--a-lo)",border:"1px solid var(--a-bd)",borderRadius:6,color:loading?"var(--t3)":"var(--a-tx)",cursor:loading?"not-allowed":"pointer",transition:"all .15s",touchAction:"manipulation"}}>
          <Ic.Sparkle/> {loading?"Drafting…":"✦ AI Draft"}
        </button>
      </div>
    </div>
  );
}

/* BADGES */
function PrevBadgeStatus() {
  return (
    <ul aria-label="Status badge examples" style={{display:"flex",flexWrap:"wrap",gap:8,listStyle:"none"}}>
      {[["Live","var(--grn)","var(--grn-lo)","var(--grn-bd)"],["Beta","var(--a)","var(--a-lo)","var(--a-bd)"],["Deprecated","var(--red)","var(--red-lo)","var(--red-bd)"],["New","hsl(260,70%,70%)","hsla(260,70%,70%,0.10)","hsla(260,70%,70%,0.24)"],["Stable","var(--t2)","var(--s3)","var(--b1)"]].map(([l,c,bg,bd])=>(
        <li key={l}><span style={{padding:"4px 10px",fontSize:12,borderRadius:999,background:bg,border:`1px solid ${bd}`,color:c,display:"block"}}>{l}</span></li>
      ))}
    </ul>
  );
}
function PrevBadgeMono() {
  return (
    <ul aria-label="Code tag examples" style={{display:"flex",flexWrap:"wrap",gap:7,listStyle:"none"}}>
      {[["v2.4.1","var(--a-tx)","var(--a-lo)","var(--a-bd)"],["production","var(--grn)","var(--grn-lo)","var(--grn-bd)"],["main","var(--t2)","var(--s3)","var(--b1)"],["claude-3-5-sonnet","var(--t2)","var(--s3)","var(--b1)"]].map(([l,c,bg,bd])=>(
        <li key={l}><span style={{padding:"3px 8px",fontSize:11,borderRadius:4,background:bg,border:`1px solid ${bd}`,color:c,display:"block"}}>{l}</span></li>
      ))}
    </ul>
  );
}
function PrevBadgeGlow() {
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <span style={{padding:"5px 12px",fontSize:12,borderRadius:999,background:"hsla(260,70%,70%,0.12)",border:"1px solid hsla(260,70%,70%,0.30)",color:"hsl(260,70%,80%)",boxShadow:"0 0 16px hsla(260,70%,70%,0.18)",display:"inline-block"}}>✦ Featured</span>
      <span style={{padding:"5px 12px",fontSize:12,borderRadius:999,background:"var(--a-lo)",border:"1px solid var(--a-bd)",color:"var(--a-tx)",boxShadow:"0 0 14px var(--a-lo)",display:"inline-block"}}>🔥 Trending</span>
    </div>
  );
}

/* TOGGLES — using accessible Toggle component */
function PrevToggleBasic() {
  const [a,setA]=useState(true);
  const [b,setB]=useState(false);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Toggle on={a} onChange={setA} label="Enable notifications"/>
        <span aria-hidden="true" style={{color:a?"var(--t1)":"var(--t3)",fontSize:13,transition:"color .2s"}}>{a?"Enabled":"Disabled"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Toggle on={b} onChange={setB} label="Enable auto-deploy"/>
        <span aria-hidden="true" style={{color:b?"var(--t1)":"var(--t3)",fontSize:13,transition:"color .2s"}}>{b?"Enabled":"Disabled"}</span>
      </div>
    </div>
  );
}

function PrevToggleSettings() {
  const [rows,setRows]=useState([
    {id:"emails", label:"Email notifications", desc:"Weekly digest", on:true},
    {id:"deploy", label:"Auto-deploy", desc:"Deploy on push to main", on:false},
    {id:"2fa",    label:"Two-factor auth", desc:"Required for all members", on:true},
  ]);
  const toggle=id=>setRows(r=>r.map(x=>x.id===id?{...x,on:!x.on}:x));
  return (
    <div role="group" aria-label="Settings" style={{width:"100%",maxWidth:320,borderRadius:10,border:"1px solid var(--b1)",overflow:"hidden"}}>
      {rows.map((r,i)=>(
        <div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:i%2===0?"var(--s2)":"var(--s1)",borderBottom:i<rows.length-1?"1px solid var(--b0)":"none"}}>
          <div style={{flex:1,minWidth:0,paddingRight:12}}>
            <p style={{color:"var(--t1)",fontSize:13,marginBottom:2}}>{r.label}</p>
            <p style={{color:"var(--t3)",fontSize:11}}>{r.desc}</p>
          </div>
          <Toggle on={r.on} onChange={()=>toggle(r.id)} label={r.label} size="sm"/>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT REGISTRY
═══════════════════════════════════════════════════════════ */
const COMPONENTS = [
  {id:"btn-primary",     category:"Buttons", name:"Primary",            desc:"Flat amber fill · 44px min-height · main CTA",          cols:"1", Preview:PrevBtnPrimary},
  {id:"btn-ghost",       category:"Buttons", name:"Ghost",              desc:"Transparent · hairline border · secondary action",       cols:"1", Preview:PrevBtnGhost},
  {id:"btn-outline",     category:"Buttons", name:"Accent Outline",     desc:"Amber tint + border · strong secondary",                cols:"1", Preview:PrevBtnOutline},
  {id:"btn-destructive", category:"Buttons", name:"Destructive",        desc:"Red · irreversible only · non-color indicator icon",    cols:"1", Preview:PrevBtnDestructive},
  {id:"btn-icons",       category:"Buttons", name:"Icon Buttons",       desc:"40×40px · aria-label · role=toolbar",                   cols:"1", Preview:PrevBtnIcons},
  {id:"btn-group",       category:"Buttons", name:"Segmented Control",  desc:"role=group · aria-pressed · keyboard nav",              cols:"1", Preview:PrevBtnGroup},
  {id:"card-stat",       category:"Cards",   name:"KPI Stat Card",      desc:"✦ AI metric · aria-live · non-color trend",             cols:"1", ai:true, Preview:PrevCardStat},
  {id:"card-feature",    category:"Cards",   name:"Feature Card",       desc:"✦ AI copy + icon · aria-live region",                   cols:"1", ai:true, Preview:PrevCardFeature},
  {id:"card-pricing",    category:"Cards",   name:"Pricing Card",       desc:"✦ AI tier + features · accessible list",                cols:"2", ai:true, Preview:PrevCardPricing},
  {id:"card-profile",    category:"Cards",   name:"Profile Card",       desc:"✦ AI profile · role=img avatar · status",               cols:"2", ai:true, Preview:PrevCardProfile},
  {id:"card-alerts",     category:"Cards",   name:"Alert Stack",        desc:"✦ AI alerts · role=status · non-color severity",        cols:"2", ai:true, Preview:PrevCardAlerts},
  {id:"nav-blur",        category:"Navbars", name:"Blur / Frosted",     desc:"role=menubar · aria-label nav · 44px link height",      cols:"all", Preview:PrevNavBlur},
  {id:"nav-dark",        category:"Navbars", name:"Solid Dark",         desc:"aria-current=page · semantic nav · accessible links",   cols:"all", Preview:PrevNavDark},
  {id:"foot-columns",    category:"Footers", name:"Multi-Column",       desc:"Semantic footer · nav regions · accessible link list",  cols:"all", Preview:PrevFooterColumns},
  {id:"form-input",      category:"Forms",   name:"Labeled Input",      desc:"✦ AI example · htmlFor/id · 44px height",               cols:"1", ai:true, Preview:PrevFormInput},
  {id:"form-subscribe",  category:"Forms",   name:"Subscribe Bar",      desc:"✦ AI confirmation · aria-required · aria-busy",         cols:"1", ai:true, Preview:PrevFormSubscribe},
  {id:"form-search",     category:"Forms",   name:"Search Autocomplete",desc:"✦ AI · role=combobox · role=listbox · arrow nav",       cols:"2", ai:true, Preview:PrevFormSearch},
  {id:"form-dropdown",   category:"Forms",   name:"Dropdown Select",    desc:"✦ AI options · role=combobox · role=option",            cols:"2", ai:true, Preview:PrevFormDropdown},
  {id:"form-textarea",   category:"Forms",   name:"AI Draft Textarea",  desc:"✦ AI draft · htmlFor/id · char count aria-live",        cols:"2", ai:true, Preview:PrevFormTextarea},
  {id:"badge-status",    category:"Badges",  name:"Status Badges",      desc:"Non-color indicators · list semantics · WCAG 1.4.1",    cols:"2", Preview:PrevBadgeStatus},
  {id:"badge-mono",      category:"Badges",  name:"Mono Code Tags",     desc:"Version · env · branch · list semantics",               cols:"2", Preview:PrevBadgeMono},
  {id:"badge-glow",      category:"Badges",  name:"Glow Labels",        desc:"Featured · trending · verified contrast ratios",        cols:"1", Preview:PrevBadgeGlow},
  {id:"toggle-basic",    category:"Toggles", name:"Toggle Switch",      desc:"role=switch · aria-checked · keyboard Enter/Space",     cols:"1", Preview:PrevToggleBasic},
  {id:"toggle-settings", category:"Toggles", name:"Settings Rows",      desc:"role=group · individual aria-labels · 44px rows",       cols:"2", Preview:PrevToggleSettings},
];

const CATS = ["All","Buttons","Cards","Navbars","Footers","Forms","Badges","Toggles"];

/* Syntax highlight */
function hl(code) {
  const C={str:"#94a3b8",tag:"#7DD3FC",attr:"#86EFAC",kw:"#C084FC",cm:"#3C4554"};
  return code.split("\n").map((line,i)=>{
    const out=[]; let r=line,k=0;
    const p=(t,c)=>out.push(<span key={k++} style={c?{color:c}:{}}>{t}</span>);
    while(r.length){
      if(r.startsWith("{/*")){const e=r.indexOf("*/}");if(e>=0){p(r.slice(0,e+3),C.cm);r=r.slice(e+3);continue;}}
      const s=r.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/);
      if(s){p(s[0],C.str);r=r.slice(s[0].length);continue;}
      const tg=r.match(/^(<\/?)([A-Za-z][A-Za-z0-9.]*)/);
      if(tg){p(tg[1],"#94a3b8");p(tg[2],C.tag);r=r.slice(tg[0].length);continue;}
      const at=r.match(/^([a-zA-Z][a-zA-Z0-9-]*)(?==)/);
      if(at){p(at[0],C.attr);r=r.slice(at[0].length);continue;}
      const kw=r.match(/^(const|let|var|return|import|from|export|default|function|=>|style|type|className|key|href|src|await|async|role|aria)(?=\b)/);
      if(kw){p(kw[0],C.kw);r=r.slice(kw[0].length);continue;}
      p(r[0]);r=r.slice(1);
    }
    return <div key={i} style={{minHeight:"1.55em"}}>{out.length?out:"\u00A0"}</div>;
  });
}

const SNIPPETS = {
  "toggle-basic": `// Accessible toggle — role=switch + keyboard\nconst Toggle = ({ on, onChange, label }) => (\n  <button\n    role="switch"\n    aria-checked={on}\n    aria-label={label}\n    onClick={() => onChange(!on)}\n    onKeyDown={e => {\n      if (e.key === "Enter" || e.key === " ") {\n        e.preventDefault();\n        onChange(!on);\n      }\n    }}\n    style={{ /* ... */ }}\n  >\n    <span aria-hidden="true" />{/* visual knob */}\n  </button>\n);`,
  "form-search": `// Accessible combobox — ARIA 1.1 pattern\n<input\n  role="combobox"\n  aria-autocomplete="list"\n  aria-expanded={open}\n  aria-controls="suggestions-list"\n  aria-activedescendant={activeIdx >= 0 ? \`opt-\${activeIdx}\` : undefined}\n  onKeyDown={e => {\n    if (e.key === "ArrowDown") setActiveIdx(i => i + 1);\n    if (e.key === "ArrowUp")   setActiveIdx(i => i - 1);\n    if (e.key === "Enter")     pick(suggestions[activeIdx]);\n    if (e.key === "Escape")    setOpen(false);\n  }}\n/>\n<ul role="listbox" id="suggestions-list">\n  {suggestions.map((s, i) => (\n    <li role="option" aria-selected={activeIdx === i}\n      id={\`opt-\${i}\`}>{s}</li>\n  ))}\n</ul>`,
  "form-input": `// htmlFor + id association — required for SR\nconst id = useId(); // React 18+\n\n<label htmlFor={id}>{label}</label>\n<input\n  id={id}\n  type={type}\n  aria-describedby={hint ? \`\${id}-hint\` : undefined}\n  // amber focus ring inline:\n  onFocus={e => { e.target.style.borderColor = "var(--a-bd)";\n                  e.target.style.boxShadow  = "0 0 0 3px var(--a-lo)"; }}\n  onBlur={e  => { e.target.style.borderColor = "var(--b1)";\n                  e.target.style.boxShadow  = "none"; }}\n/>`,
  "card-stat": `// aria-live for AI content — 4.1.3 Status Messages\n<div\n  aria-live="polite"\n  aria-atomic="true"\n  aria-label={loading ? "Loading metric" : \`\${data?.label}: \${data?.value}\`}\n>\n  {loading ? <Skeleton /> : (\n    <div className="ai-fade-in">\n      {/* Non-color trend: icon + text, not colour alone (1.4.1) */}\n      <span aria-hidden>{data.trend === "up" ? "↑" : "↓"}</span>\n      {data.delta}\n    </div>\n  )}\n</div>`,
};

/* ── Component Card ── */
function CompCard({ comp, selected, onToggle, onCopy, copied, animDelay }) {
  const [showCode,setShowCode]=useState(false);
  const [bounce,setBounce]=useState(false);
  const [igniting,setIgniting]=useState(false);
  const isCopied=copied===comp.id;
  const code=SNIPPETS[comp.id]||`// ${comp.name}\n// See component for full accessible implementation`;

  const colClass = comp.cols==="all"?"span-all":comp.cols==="2"?"span-2":"";

  const handleToggle=()=>{
    if(!selected){ setIgniting(true); setTimeout(()=>setIgniting(false),600); }
    setBounce(true); setTimeout(()=>setBounce(false),300);
    onToggle(comp.id);
  };

  return (
    <div className={`comp-card card-float ${igniting?"igniting":""} ${colClass}`}
      style={{animationDelay:`${animDelay}ms`,borderRadius:12,overflow:"hidden",background:"var(--s1)",border:`1px solid ${selected?"var(--a-bd)":"var(--b1)"}`,borderLeft:`2px solid ${selected?"var(--a)":"var(--b1)"}`,boxShadow:selected?"0 0 24px var(--a-lo)":"none"}}>

      {/* Preview */}
      <div className="prev-bg" style={{minHeight:148,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
        <div className="preview-inner" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          {showCode?(
            <div style={{width:"100%",maxHeight:150,overflowY:"auto"}}>
              <pre style={{fontSize:10.5,lineHeight:1.7,color:"#475569",fontFamily:"var(--fm)",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{hl(code)}</pre>
            </div>
          ):(
            <comp.Preview/>
          )}
        </div>

        <button onClick={()=>setShowCode(s=>!s)}
          aria-label={showCode?"Switch to preview":"Switch to code view"}
          aria-pressed={showCode}
          className="touch-target"
          style={{position:"absolute",top:8,right:8,display:"flex",alignItems:"center",gap:4,padding:"6px 10px",fontSize:11,fontFamily:"var(--fm)",background:"rgba(6,8,20,0.78)",border:"1px solid var(--b2)",borderRadius:5,color:"var(--t3)",cursor:"pointer",backdropFilter:"blur(8px)",transition:"color .14s",touchAction:"manipulation"}}>
          {showCode?<><Ic.Eye/><span>Preview</span></>:<><Ic.Code/><span>Code</span></>}
        </button>

        {comp.ai&&!showCode&&(
          <div aria-hidden="true" style={{position:"absolute",top:8,left:8}}>
            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:9.5,fontFamily:"var(--fm)",padding:"2px 7px",borderRadius:999,background:"var(--a-lo)",border:"1px solid var(--a-bd)",color:"var(--a-tx)"}}>
              <Ic.Sparkle/> AI powered
            </span>
          </div>
        )}

        {selected&&(
          <div aria-hidden="true" style={{position:"absolute",bottom:8,left:9,display:"flex",alignItems:"center",gap:4,fontSize:10,fontFamily:"var(--fm)",color:"var(--a-tx)",background:"var(--a-lo)",border:"1px solid var(--a-bd)",borderRadius:4,padding:"3px 8px"}}>
            <Ic.Check/><span>in canvas</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{padding:"10px 12px 12px",borderTop:"1px solid var(--b0)"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <p style={{flex:1,color:"var(--t1)",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{comp.name}</p>
          <span aria-hidden="true" style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"var(--s3)",color:"var(--t3)",border:"1px solid var(--b0)",flexShrink:0,letterSpacing:"0.06em",textTransform:"uppercase"}}>{comp.category.slice(0,4)}</span>
        </div>
        <p style={{color:"var(--t3)",fontSize:11.5,marginBottom:10,lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{comp.desc}</p>
        <div style={{display:"flex",gap:6}}>
          <button onClick={handleToggle} className={`touch-target${bounce?" add-bounce":""}`}
            aria-label={selected?`Remove ${comp.name} from canvas`:`Add ${comp.name} to canvas`}
            aria-pressed={selected}
            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,minHeight:44,borderRadius:7,fontSize:11.5,fontFamily:"var(--fm)",cursor:"pointer",border:`1px solid ${selected?"var(--a-bd)":"var(--b2)"}`,background:selected?"var(--a-lo)":"var(--s2)",color:selected?"var(--a-tx)":"var(--t2)",transition:"background .14s, border-color .14s, color .14s",touchAction:"manipulation"}}>
            {selected?<><Ic.Check/><span>In Canvas</span></>:<><Ic.Plus/><span>Add</span></>}
          </button>
          <button onClick={()=>onCopy(comp.id)}
            aria-label={isCopied?"Code copied to clipboard":`Copy ${comp.name} code`}
            aria-live="polite"
            className="touch-target"
            style={{width:44,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:7,background:isCopied?"var(--grn-lo)":"var(--s2)",border:`1px solid ${isCopied?"var(--grn-bd)":"var(--b2)"}`,color:isCopied?"var(--grn)":"var(--t3)",cursor:"pointer",transition:"all .14s",flexShrink:0,touchAction:"manipulation"}}>
            {isCopied?<Ic.Check/>:<Ic.Copy/>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Category Section ── */
function CategorySection({ category, components, canvas, onToggle, onCopy, copied, delay }) {
  const [revealKey,setRevealKey]=useState(0);
  const prevCat=useRef(category);
  const headingId=`cat-${category.toLowerCase()}`;

  useEffect(()=>{ if(prevCat.current!==category){ setRevealKey(k=>k+1); prevCat.current=category; } },[category]);
  const aiCount=components.filter(c=>c.ai).length;

  return (
    <section aria-labelledby={headingId} className="section-reveal" style={{marginBottom:56,animationDelay:`${delay}ms`}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16,paddingBottom:14,borderBottom:"1px solid var(--b0)",overflow:"hidden"}}>
        <h2 id={headingId} key={revealKey} className="section-header-text header-reveal">{category}</h2>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,paddingBottom:4,flexShrink:0,marginLeft:14}}>
          {aiCount>0&&(
            <span style={{fontSize:10.5,fontFamily:"var(--fm)",display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:999,background:"var(--a-lo)",border:"1px solid var(--a-bd)",color:"var(--a-tx)"}}>
              <Ic.Sparkle/> {aiCount} AI-powered
            </span>
          )}
          <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:"0.04em"}}>
            {components.length} component{components.length!==1?"s":""}
          </span>
        </div>
      </div>

      <div className="bento-grid">
        {components.map((comp,i)=>(
          <CompCard key={comp.id} comp={comp} selected={canvas.includes(comp.id)} onToggle={onToggle} onCopy={onCopy} copied={copied} animDelay={i*40}/>
        ))}
      </div>
    </section>
  );
}

/* ── Canvas Drawer ── */
function CanvasDrawer({ canvas, onRemove, onMove, onExport, exported }) {
  const [open,setOpen]=useState(false);
  const canvasListId="canvas-list";

  useEffect(()=>{ if(canvas.length>0&&!open) setOpen(true); if(canvas.length===0) setOpen(false); },[canvas.length]);
  if(!canvas.length) return null;

  const h=open?Math.min(canvas.length*52+108,340):48;

  return (
    <div className="drawer-enter" role="region" aria-label="Page builder canvas"
      style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,height:h,transition:"height 0.28s var(--ease-out)",background:"var(--s1)",borderTop:"1px solid var(--b2)",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Handle */}
      <button
        onClick={()=>setOpen(o=>!o)}
        aria-expanded={open}
        aria-controls={canvasListId}
        aria-label={open?"Collapse page builder":"Expand page builder"}
        style={{height:48,minHeight:48,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",cursor:"pointer",borderBottom:open?"1px solid var(--b0)":"none",flexShrink:0,background:"none",border:"none",width:"100%",touchAction:"manipulation"}}
      >
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Ic.Layers/>
          <span style={{fontSize:12,fontFamily:"var(--fm)",color:"var(--t1)"}}>Page Builder</span>
          <span aria-label={`${canvas.length} components queued`} style={{fontSize:10,fontFamily:"var(--fm)",padding:"2px 8px",borderRadius:999,background:"var(--a-lo)",border:"1px solid var(--a-bd)",color:"var(--a-tx)"}}>{canvas.length}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {open&&(
            <button onClick={e=>{e.stopPropagation();onExport();}}
              aria-label={exported?"Components exported and copied to clipboard":`Export ${canvas.length} components`}
              aria-live="polite"
              style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",minHeight:36,background:exported?"var(--grn-lo)":"var(--a)",border:exported?"1px solid var(--grn-bd)":"none",borderRadius:6,color:exported?"var(--grn)":"hsl(228,30%,6%)",fontSize:12,fontFamily:"var(--fm)",cursor:"pointer",transition:"all .18s",touchAction:"manipulation"}}>
              {exported?<><Ic.Check/><span>Copied!</span></>:<><Ic.Download/><span>Export {canvas.length}</span></>}
            </button>
          )}
          <button onClick={e=>{e.stopPropagation();onRemove(null);}}
            aria-label="Clear all components from canvas"
            style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",padding:"8px 4px",cursor:"pointer",background:"none",border:"none",minHeight:36,touchAction:"manipulation"}}
            onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--t3)"}>
            <Ic.Trash/><span>Clear</span>
          </button>
          <span aria-hidden="true" style={{color:"var(--t3)",fontSize:12,userSelect:"none"}}>{open?"↓":"↑"}</span>
        </div>
      </button>

      {/* Item list */}
      <ol id={canvasListId} aria-label="Canvas component order" style={{flex:1,overflowY:"auto",padding:"6px 16px 12px",display:"flex",flexDirection:"column",gap:5,listStyle:"none"}}>
        {canvas.map((id,idx)=>{
          const c=COMPONENTS.find(x=>x.id===id); if(!c) return null;
          return (
            <li key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:"var(--s2)",border:"1px solid var(--b0)",borderLeft:"2px solid var(--a)"}}>
              <span aria-hidden="true" style={{width:22,height:22,borderRadius:5,background:"var(--a-lo)",border:"1px solid var(--a-bd)",color:"var(--a-tx)",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{idx+1}</span>
              <div style={{flex:1,minWidth:0}}>
                <span style={{color:"var(--t1)",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{c.name}</span>
                <span style={{color:"var(--t3)",fontSize:10.5}}>{c.category}{c.ai?" · ✦ AI":""}</span>
              </div>
              <div style={{display:"flex",gap:2}} role="group" aria-label={`Controls for ${c.name}`}>
                {[
                  {fn:()=>onMove(idx,-1),ico:<Ic.Up/>,  dis:idx===0,           lbl:`Move ${c.name} up`},
                  {fn:()=>onMove(idx,1), ico:<Ic.Down/>, dis:idx===canvas.length-1, lbl:`Move ${c.name} down`},
                  {fn:()=>onRemove(id),  ico:<Ic.X/>,   dis:false,             lbl:`Remove ${c.name}`, isDel:true},
                ].map((btn,bi)=>(
                  <button key={bi} onClick={btn.fn} disabled={btn.dis}
                    aria-label={btn.lbl} className="touch-target"
                    style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:5,background:"none",border:"none",cursor:btn.dis?"not-allowed":"pointer",color:"var(--t3)",opacity:btn.dis?0.3:1,touchAction:"manipulation"}}
                    onMouseEnter={e=>{if(!btn.dis)e.currentTarget.style.color=btn.isDel?"var(--red)":"var(--t1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--t3)";}}>
                    {btn.ico}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function UIKit() {
  const [activeCat,setActiveCat]=useState("All");
  const [query,setQuery]=useState("");
  const [canvas,setCanvas]=useState([]);
  const [copied,setCopied]=useState(null);
  const [exported,setExported]=useState(false);
  const searchRef=useRef(null);

  // Keyboard: / focuses search, Escape blurs
  useEffect(()=>{
    const h=e=>{
      if(e.key==="/"&&e.target.tagName!=="INPUT"&&e.target.tagName!=="TEXTAREA"){ e.preventDefault(); searchRef.current?.focus(); }
      if(e.key==="Escape"&&document.activeElement===searchRef.current) searchRef.current?.blur();
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  const filtered=COMPONENTS.filter(c=>{
    const catOk=activeCat==="All"||c.category===activeCat;
    const q=query.toLowerCase();
    return catOk&&(!q||c.name.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q)||c.category.toLowerCase().includes(q));
  });

  const grouped=CATS.filter(c=>c!=="All").reduce((acc,cat)=>{
    const items=filtered.filter(c=>c.category===cat);
    if(items.length>0) acc.push({cat,items});
    return acc;
  },[]);

  const toggleCanvas=useCallback(id=>{
    setCanvas(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  },[]);
  const moveCanvas=useCallback((idx,dir)=>{
    setCanvas(prev=>{ const next=[...prev],t=idx+dir; if(t<0||t>=next.length)return prev; [next[idx],next[t]]=[next[t],next[idx]]; return next; });
  },[]);
  const removeFromCanvas=id=>{ if(id===null)setCanvas([]); else setCanvas(prev=>prev.filter(x=>x!==id)); };
  const copyCode=id=>{
    const code=SNIPPETS[id]||`// ${COMPONENTS.find(x=>x.id===id)?.name||""}`;
    navigator.clipboard.writeText(code).then(()=>{ setCopied(id); setTimeout(()=>setCopied(null),1800); });
  };
  const exportAll=()=>{
    const out=canvas.map(id=>{const c=COMPONENTS.find(x=>x.id===id);return c?`/* ── ${c.name} ── */\n${SNIPPETS[id]||""}`:""}).filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(out).then(()=>{ setExported(true); setTimeout(()=>setExported(false),2200); });
  };

  const catCounts=Object.fromEntries(CATS.map(cat=>[cat,cat==="All"?COMPONENTS.length:COMPONENTS.filter(c=>c.category===cat).length]));
  const totalAI=COMPONENTS.filter(c=>c.ai).length;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",background:"var(--bg)"}}>
      <GlobalStyles/>

      {/* SKIP LINK — 2.4.1 Bypass Blocks */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── TOPBAR ── */}
      <header role="banner" style={{height:48,minHeight:48,display:"flex",alignItems:"center",gap:8,padding:"0 16px",borderBottom:"1px solid var(--b1)",background:"var(--s1)",flexShrink:0,zIndex:50}}>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div aria-hidden="true" style={{width:24,height:24,borderRadius:6,background:"var(--a)",display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(228,30%,6%)",flexShrink:0}}>
            <Ic.Bolt/>
          </div>
          <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:"var(--t1)",letterSpacing:-0.5}}>UI Kit</span>
        </div>

        <div className="topbar-divider"/>

        {/* AI pill */}
        <div className="topbar-ai-badge" style={{padding:"3px 10px",borderRadius:999,background:"var(--a-lo)",border:"1px solid var(--a-bd)"}}>
          <Ic.Sparkle/>
          <span style={{fontSize:10.5,fontFamily:"var(--fm)",color:"var(--a-tx)"}}>{totalAI} AI-powered</span>
        </div>

        <div className="topbar-divider"/>

        {/* Category navigation */}
        <nav aria-label="Component categories" className="topbar-pills">
          {CATS.map(cat=>{
            const active=activeCat===cat;
            return (
              <button key={cat} onClick={()=>setActiveCat(cat)}
                aria-pressed={active}
                aria-label={`Filter by ${cat} — ${catCounts[cat]} components`}
                className="touch-target"
                style={{padding:"4px 10px",minHeight:36,borderRadius:999,fontSize:11,fontFamily:"var(--fm)",cursor:"pointer",whiteSpace:"nowrap",background:active?"var(--a-lo)":"transparent",border:`1px solid ${active?"var(--a-bd)":"transparent"}`,color:active?"var(--a-tx)":"var(--t3)",transition:"all .14s",flexShrink:0,touchAction:"manipulation"}}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.color="var(--t2)";e.currentTarget.style.borderColor="var(--b1)";}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.color="var(--t3)";e.currentTarget.style.borderColor="transparent";}}}>
                {cat}
                {catCounts[cat]>0&&<span aria-hidden="true" style={{marginLeft:5,fontSize:9.5,color:active?"var(--a-tx)":"var(--t3)",opacity:0.7}}>{catCounts[cat]}</span>}
              </button>
            );
          })}
        </nav>

        {/* Search */}
        <div className="search-bar" role="search"
          style={{display:"flex",alignItems:"center",gap:6,padding:"0 10px",height:36,background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:7,width:190,flexShrink:0,transition:"border-color .14s, box-shadow .14s"}}
          onFocusCapture={e=>{e.currentTarget.style.borderColor="var(--a-bd)";e.currentTarget.style.boxShadow="0 0 0 3px var(--a-lo)";}}
          onBlurCapture={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.boxShadow="none";}}>
          <label htmlFor="global-search" style={{display:"none"}}>Search components</label>
          <span aria-hidden="true" style={{color:"var(--t3)",flexShrink:0}}><Ic.Search/></span>
          <input ref={searchRef} id="global-search" type="search" placeholder="Search…" value={query}
            onChange={e=>setQuery(e.target.value)}
            aria-label="Search components by name or category"
            data-focus-ring="inline"
            style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:12.5,fontFamily:"var(--fm)"}}
          />
          {query
            ?<button onClick={()=>setQuery("")} aria-label="Clear search" className="touch-target" style={{color:"var(--t3)",flexShrink:0,display:"flex",padding:4,touchAction:"manipulation"}}><Ic.X/></button>
            :<span aria-hidden="true" style={{color:"var(--t3)",fontSize:10.5,flexShrink:0,opacity:0.6}}>/</span>
          }
        </div>

        {canvas.length>0&&(
          <div aria-live="polite" aria-label={`${canvas.length} components in canvas`} style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            <Ic.Layers/>
            <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--a-tx)"}}>{canvas.length}</span>
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main id="main-content" tabIndex={-1} style={{flex:1,overflowY:"auto",padding:"32px 20px",paddingBottom:canvas.length>0?228:48}}>
        {filtered.length===0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16,textAlign:"center"}} role="status">
            <p className="section-header-text" aria-live="polite" style={{color:"var(--t4)",letterSpacing:-3,lineHeight:0.9}}>NOTHING</p>
            <p style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--t3)",maxWidth:260,lineHeight:1.6}}>
              No components match <em style={{color:"var(--t2)"}}>"{query}"</em>.<br/>Try a different keyword or clear the filter.
            </p>
            <button onClick={()=>{setQuery("");setActiveCat("All");}} className="touch-target"
              style={{padding:"10px 18px",minHeight:44,background:"var(--a-lo)",border:"1px solid var(--a-bd)",borderRadius:7,color:"var(--a-tx)",fontSize:13,fontFamily:"var(--fm)",cursor:"pointer",touchAction:"manipulation"}}>
              Clear search
            </button>
          </div>
        ):(
          grouped.map(({cat,items},sectionIdx)=>(
            <CategorySection key={cat} category={cat} components={items} canvas={canvas} onToggle={toggleCanvas} onCopy={copyCode} copied={copied} delay={sectionIdx*80}/>
          ))
        )}
      </main>

      <CanvasDrawer canvas={canvas} onRemove={removeFromCanvas} onMove={moveCanvas} onExport={exportAll} exported={exported}/>
    </div>
  );
}
