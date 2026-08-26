import { useState, useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   STYLE INJECTION — Fonts + tokens + utilities
═══════════════════════════════════════════════════════════ */
function StyleInject() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:         #09090E;
        --surface:    #0E101A;
        --elevated:   #161922;
        --hover:      #1C2130;
        --border:     rgba(255,255,255,0.055);
        --border-md:  rgba(255,255,255,0.09);
        --border-hi:  rgba(255,255,255,0.15);
        --text-1:     #DDE3EF;
        --text-2:     #6C7587;
        --text-3:     #333A4C;
        --accent:     #4F7CFF;
        --accent-dim: rgba(79,124,255,0.11);
        --green:      #2DCDA0;
        --amber:      #F5A524;
        --red:        #F87171;
        --purple:     #A78BFA;
        --cyan:       #22D3EE;
        --ff-d: 'Bricolage Grotesque', system-ui, sans-serif;
        --ff-b: 'Outfit', system-ui, sans-serif;
        --ff-m: 'JetBrains Mono', 'Fira Code', monospace;
      }

      /* Category color palette — drives left-border system */
      :root {
        --cat-Buttons: #4F7CFF;
        --cat-Cards:   #2DCDA0;
        --cat-Navbars: #F5A524;
        --cat-Footers: #A78BFA;
        --cat-Forms:   #F87171;
        --cat-Badges:  #22D3EE;
        --cat-Toggles: #34D399;
      }

      body { font-family: var(--ff-b); background: var(--bg); -webkit-font-smoothing: antialiased; }

      /* Scrollbar */
      .scr::-webkit-scrollbar { width: 3px; }
      .scr::-webkit-scrollbar-track { background: transparent; }
      .scr::-webkit-scrollbar-thumb { background: var(--border-md); border-radius: 3px; }

      /* Card lift on hover */
      .comp-card { transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease; }
      .comp-card:hover { transform: translateY(-2px); }

      /* Preview area — graph paper canvas feel */
      .preview-bg {
        background-color: #0B0D14;
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
        background-size: 40px 40px, 40px 40px, 8px 8px, 8px 8px;
      }

      /* Syntax highlight tokens */
      .tok-tag    { color: #7DD3FC; }
      .tok-attr   { color: #86EFAC; }
      .tok-str    { color: #FCA5A5; }
      .tok-kw     { color: #C084FC; }
      .tok-cm     { color: #4B5563; font-style: italic; }

      @keyframes popIn {
        0%   { transform: scale(0.88); opacity: 0; }
        65%  { transform: scale(1.04); }
        100% { transform: scale(1);    opacity: 1; }
      }
      .pop-in { animation: popIn 0.2s ease forwards; }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .slide-in { animation: slideDown 0.16s ease forwards; }

      /* Focus ring */
      button:focus-visible, input:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS — clean 15×15 SVGs, stroke-only
═══════════════════════════════════════════════════════════ */
const I = {
  Search:   () => <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Copy:     () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Check:    () => <svg width="12" height="12" viewBox="0 0 15 15" fill="none"><path d="M13 3L5.5 11 2 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Plus:     () => <svg width="12" height="12" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  X:        () => <svg width="10" height="10" viewBox="0 0 15 15" fill="none"><path d="M13 2L2 13M2 2l11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ChevUp:   () => <svg width="11" height="11" viewBox="0 0 15 15" fill="none"><path d="M12 10L7.5 5 3 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevDown: () => <svg width="11" height="11" viewBox="0 0 15 15" fill="none"><path d="M3 5l4.5 5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Code:     () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M4 5L1 7.5 4 10M11 5l3 2.5L11 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3L6 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Eye:      () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M1 7.5C1 7.5 3.5 2.5 7.5 2.5S14 7.5 14 7.5 11.5 12.5 7.5 12.5 1 7.5 1 7.5Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  Layers:   () => <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L13.5 5 7.5 8.5 1.5 5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M1.5 10L7.5 13.5 13.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 7.5L7.5 11 13.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Zap:      () => <svg width="12" height="12" viewBox="0 0 15 15" fill="none"><path d="M9 1.5L3 8.5h5L6 13.5l7-8H8L9 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Download: () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M7.5 1v9M4 7l3.5 4 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 11.5v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Trash:    () => <svg width="12" height="12" viewBox="0 0 15 15" fill="none"><path d="M2.5 4.5h10M6 4.5V3h3v1.5M5.5 4.5v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Sparkle:  () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5C7 5 5 7 1.5 7.5 5 8 7 10 7.5 13.5 8 10 10 8 13.5 7.5 10 7 8 5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Grid:     () => <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>,
  Toggle:   () => <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="1" y="4" width="13" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="4.5" cy="7.5" r="2" fill="currentColor"/></svg>,
  Ellipsis: () => <svg width="12" height="12" viewBox="0 0 15 15" fill="none"><circle cx="3.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.2" fill="currentColor"/></svg>,
};

/* ═══════════════════════════════════════════════════════════
   CATEGORY CONFIG
═══════════════════════════════════════════════════════════ */
const CAT_COLOR = {
  Buttons: "#4F7CFF",
  Cards:   "#2DCDA0",
  Navbars: "#F5A524",
  Footers: "#A78BFA",
  Forms:   "#F87171",
  Badges:  "#22D3EE",
  Toggles: "#34D399",
};

const CATS = ["All", "Buttons", "Cards", "Navbars", "Footers", "Forms", "Badges", "Toggles"];

/* ═══════════════════════════════════════════════════════════
   COMPONENTS DATA
═══════════════════════════════════════════════════════════ */
const COMPONENTS = [

  /* ── BUTTONS ─────────────────────────────────────────── */
  {
    id: "btn-primary", category: "Buttons",
    name: "Primary Button",
    desc: "Flat indigo fill — main CTA with press feedback",
    preview: () => (
      <button style={{ padding: "9px 20px", background: "#4F7CFF", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer", transition: "opacity .15s" }}
        onMouseEnter={e => e.target.style.opacity = .85} onMouseLeave={e => e.target.style.opacity = 1}>
        Get Started →
      </button>
    ),
    code: `<button
  style={{
    padding: "9px 20px",
    background: "#4F7CFF",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Get Started →
</button>`,
  },
  {
    id: "btn-ghost", category: "Buttons",
    name: "Ghost Button",
    desc: "Transparent with hairline border — secondary actions",
    preview: () => (
      <button style={{ padding: "9px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "#9BA8BF", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 500, cursor: "pointer" }}>
        View Plans
      </button>
    ),
    code: `<button
  style={{
    padding: "9px 20px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8,
    color: "#9BA8BF",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  }}
>
  View Plans
</button>`,
  },
  {
    id: "btn-outline", category: "Buttons",
    name: "Accent Outline",
    desc: "Indigo border with tint fill — strong secondary state",
    preview: () => (
      <button style={{ padding: "9px 20px", background: "rgba(79,124,255,0.08)", border: "1px solid rgba(79,124,255,0.45)", borderRadius: 8, color: "#93ABFF", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer" }}>
        Explore Docs
      </button>
    ),
    code: `<button
  style={{
    padding: "9px 20px",
    background: "rgba(79,124,255,0.08)",
    border: "1px solid rgba(79,124,255,0.45)",
    borderRadius: 8,
    color: "#93ABFF",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Explore Docs
</button>`,
  },
  {
    id: "btn-destructive", category: "Buttons",
    name: "Destructive Button",
    desc: "Red fill — irreversible actions only",
    preview: () => (
      <button style={{ padding: "9px 20px", background: "rgba(248,113,113,0.9)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer" }}>
        Delete Account
      </button>
    ),
    code: `<button
  style={{
    padding: "9px 20px",
    background: "rgba(248,113,113,0.9)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Delete Account
</button>`,
  },
  {
    id: "btn-icon", category: "Buttons",
    name: "Icon Button",
    desc: "Square 32×32 — toolbar actions, top bars, inline controls",
    preview: () => (
      <div style={{ display: "flex", gap: 8 }}>
        {[["#4F7CFF","rgba(79,124,255,0.12)"], ["transparent","rgba(255,255,255,0.09)"]].map(([bg, border], i) => (
          <button key={i} style={{ width: 32, height: 32, background: bg, border: `1px solid ${border}`, borderRadius: 7, color: i === 0 ? "#fff" : "#9BA8BF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {i === 0 ? "+" : "⋯"}
          </button>
        ))}
      </div>
    ),
    code: `{/* filled variant */}
<button style={{ width: 32, height: 32, background: "#4F7CFF", border: "none", borderRadius: 7, color: "#fff", cursor: "pointer" }}>
  +
</button>

{/* ghost variant */}
<button style={{ width: 32, height: 32, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 7, color: "#9BA8BF", cursor: "pointer" }}>
  ⋯
</button>`,
  },

  /* ── CARDS ───────────────────────────────────────────── */
  {
    id: "card-feature", category: "Cards",
    name: "Feature Card",
    desc: "Icon + headline + copy — feature grid workhorse",
    preview: () => (
      <div style={{ padding: "18px 18px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: 210 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(79,124,255,0.12)", border: "1px solid rgba(79,124,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: "#7CA8FF", fontSize: 16 }}>⚡</div>
        <p style={{ color: "#DDE3EF", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 6 }}>Lightning Fast</p>
        <p style={{ color: "#6C7587", fontSize: 12, fontFamily: "'Outfit',sans-serif", lineHeight: 1.55 }}>Edge-delivered with smart caching. 99.9% uptime SLA included.</p>
      </div>
    ),
    code: `<div style={{
  padding: "18px 18px 16px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
}}>
  <div style={{ width: 34, height: 34, borderRadius: 8,
    background: "rgba(79,124,255,0.12)",
    border: "1px solid rgba(79,124,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 12 }}>
    {/* Icon */}
  </div>
  <p style={{ color: "#DDE3EF", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Title</p>
  <p style={{ color: "#6C7587", fontSize: 12, lineHeight: 1.55 }}>Description</p>
</div>`,
  },
  {
    id: "card-stat", category: "Cards",
    name: "KPI / Stat Card",
    desc: "Metric + trend delta — dashboard and analytics context",
    preview: () => (
      <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: 190 }}>
        <p style={{ color: "#6C7587", fontSize: 10.5, fontFamily: "'Outfit',sans-serif", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>MRR</p>
        <p style={{ color: "#DDE3EF", fontSize: 24, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.1 }}>$48,231</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", padding: "2px 7px", borderRadius: 999, background: "rgba(45,205,160,0.10)", border: "1px solid rgba(45,205,160,0.22)", color: "#2DCDA0" }}>↑ 12.4%</span>
      </div>
    ),
    code: `<div style={{
  padding: "14px 16px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
}}>
  <p style={{ color: "#6C7587", fontSize: 10.5, fontWeight: 500,
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
    {label}
  </p>
  <p style={{ color: "#DDE3EF", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{value}</p>
  <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 999,
    background: "rgba(45,205,160,0.10)", border: "1px solid rgba(45,205,160,0.22)",
    color: "#2DCDA0" }}>
    ↑ {delta}
  </span>
</div>`,
  },
  {
    id: "card-pricing", category: "Cards",
    name: "Pricing Card — Featured",
    desc: "Pro tier with accent border and feature list",
    preview: () => (
      <div style={{ padding: "18px 16px", borderRadius: 12, background: "rgba(79,124,255,0.06)", border: "1px solid rgba(79,124,255,0.28)", width: 190, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,124,255,0.22),transparent)", filter: "blur(20px)" }} />
        <p style={{ color: "#7CA8FF", fontSize: 10.5, fontFamily: "'Outfit',sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Pro</p>
        <p style={{ color: "#DDE3EF", fontSize: 22, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, letterSpacing: -0.5, marginBottom: 12 }}>$29<span style={{ color: "#6C7587", fontSize: 12, fontWeight: 400, letterSpacing: 0 }}>/mo</span></p>
        {["Unlimited projects","Priority support","Advanced analytics"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <span style={{ color: "#2DCDA0", fontSize: 11 }}>✓</span>
            <span style={{ color: "#9BA8BF", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>{f}</span>
          </div>
        ))}
        <button style={{ marginTop: 12, width: "100%", padding: "8px 0", background: "#4F7CFF", border: "none", borderRadius: 7, color: "#fff", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer" }}>Start Free Trial</button>
      </div>
    ),
    code: `<div style={{
  padding: "18px 16px", borderRadius: 12,
  background: "rgba(79,124,255,0.06)",
  border: "1px solid rgba(79,124,255,0.28)",
  position: "relative", overflow: "hidden",
}}>
  <p style={{ color: "#7CA8FF", fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Pro</p>
  <p style={{ color: "#DDE3EF", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
    \${price}<span style={{ color: "#6C7587", fontSize: 12, fontWeight: 400 }}>/mo</span>
  </p>
  {features.map(f => (
    <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
      <span style={{ color: "#2DCDA0" }}>✓</span>
      <span style={{ color: "#9BA8BF", fontSize: 12 }}>{f}</span>
    </div>
  ))}
  <button style={{ marginTop: 12, width: "100%", padding: "8px 0",
    background: "#4F7CFF", borderRadius: 7, color: "#fff", fontWeight: 600 }}>
    Start Free Trial
  </button>
</div>`,
  },
  {
    id: "card-profile", category: "Cards",
    name: "Profile Card",
    desc: "Avatar + name + role + skill tags — team directory",
    preview: () => (
      <div style={{ padding: "14px 14px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: 220, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#4F7CFF,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>KR</div>
        <div>
          <p style={{ color: "#DDE3EF", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 2 }}>Kyle Rosebrook</p>
          <p style={{ color: "#6C7587", fontSize: 11, fontFamily: "'Outfit',sans-serif", marginBottom: 8 }}>Staff Engineer</p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["AppSec","AI","Platform"].map(t => (
              <span key={t} style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 999, background: "rgba(79,124,255,0.10)", border: "1px solid rgba(79,124,255,0.2)", color: "#7CA8FF", fontFamily: "'Outfit',sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    code: `<div style={{
  padding: "14px", borderRadius: 12,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex", alignItems: "flex-start", gap: 12,
}}>
  <div style={{ width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(135deg,#4F7CFF,#A78BFA)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 13, fontWeight: 700 }}>
    {initials}
  </div>
  <div>
    <p style={{ color: "#DDE3EF", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{name}</p>
    <p style={{ color: "#6C7587", fontSize: 11, marginBottom: 8 }}>{role}</p>
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {tags.map(t => <span key={t} style={{ fontSize: 10.5, padding: "2px 7px",
        borderRadius: 999, background: "rgba(79,124,255,0.10)",
        border: "1px solid rgba(79,124,255,0.2)", color: "#7CA8FF" }}>{t}</span>)}
    </div>
  </div>
</div>`,
  },
  {
    id: "card-alert", category: "Cards",
    name: "Alert / Toast — Success",
    desc: "Green-tinted with icon — also available in warning / error / info",
    preview: () => (
      <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(45,205,160,0.07)", border: "1px solid rgba(45,205,160,0.22)", width: 240, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(45,205,160,0.15)", border: "1px solid rgba(45,205,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2DCDA0", fontSize: 11 }}>✓</div>
        <div>
          <p style={{ color: "#DDE3EF", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 2 }}>Deployment successful</p>
          <p style={{ color: "#6C7587", fontSize: 11.5, fontFamily: "'Outfit',sans-serif" }}>v2.4.1 is live · 0 errors detected</p>
        </div>
      </div>
    ),
    code: `{/* Swap RGBA values per variant: green/amber/red/blue */}
<div style={{
  padding: "12px 14px", borderRadius: 10,
  background: "rgba(45,205,160,0.07)",
  border: "1px solid rgba(45,205,160,0.22)",
  display: "flex", alignItems: "flex-start", gap: 10,
}}>
  <div style={{ width: 22, height: 22, borderRadius: "50%",
    background: "rgba(45,205,160,0.15)", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#2DCDA0" }}>✓</div>
  <div>
    <p style={{ color: "#DDE3EF", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{title}</p>
    <p style={{ color: "#6C7587", fontSize: 11.5 }}>{message}</p>
  </div>
</div>`,
  },

  /* ── NAVBARS ─────────────────────────────────────────── */
  {
    id: "nav-blur", category: "Navbars",
    name: "Blur / Frosted Navbar",
    desc: "Sticky with backdrop-filter blur — transparent until scrolled",
    preview: () => (
      <div style={{ width: 280, padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.09)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#4F7CFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="3.5" height="3.5" rx="0.8" fill="white"/><rect x="5.5" y="1" width="3.5" height="3.5" rx="0.8" fill="white" opacity=".45"/><rect x="1" y="5.5" width="3.5" height="3.5" rx="0.8" fill="white" opacity=".45"/><rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.8" fill="white" opacity=".45"/></svg>
          </div>
          <span style={{ color: "#DDE3EF", fontSize: 13, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700 }}>Nexus</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Docs","Pricing"].map(l => <span key={l} style={{ color: "#6C7587", fontSize: 12, cursor: "pointer" }}>{l}</span>)}
        </div>
        <button style={{ padding: "6px 12px", background: "#4F7CFF", border: "none", borderRadius: 6, color: "#fff", fontSize: 11.5, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer" }}>Sign up</button>
      </div>
    ),
    code: `<nav style={{
  position: "sticky", top: 0, zIndex: 50,
  padding: "12px 24px",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
}}>
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 28, height: 28, borderRadius: 7, background: "#4F7CFF" }} />
    <span style={{ color: "#DDE3EF", fontSize: 15, fontWeight: 700 }}>Brand</span>
  </div>
  <div style={{ display: "flex", gap: 24 }}>
    {links.map(l => (
      <a key={l} href="#" style={{ color: "#6C7587", fontSize: 14,
        textDecoration: "none" }}>{l}</a>
    ))}
  </div>
  <button style={{ padding: "8px 16px", background: "#4F7CFF",
    border: "none", borderRadius: 7, color: "#fff", fontWeight: 600 }}>
    Sign up
  </button>
</nav>`,
  },
  {
    id: "nav-solid", category: "Navbars",
    name: "Solid Dark Navbar",
    desc: "High-contrast surface with underline active state — dashboard-ready",
    preview: () => (
      <div style={{ width: 280, padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#10121A", border: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ color: "#DDE3EF", fontSize: 13, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700 }}>Nucleus</span>
        <div style={{ display: "flex", gap: 12 }}>
          {[["Features", true], ["Docs", false]].map(([l, active]) => (
            <span key={l} style={{ color: active ? "#DDE3EF" : "#6C7587", fontSize: 12, borderBottom: active ? "1px solid #4F7CFF" : "1px solid transparent", paddingBottom: 1, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <button style={{ padding: "6px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 6, color: "#9BA8BF", fontSize: 11.5, fontFamily: "'Outfit',sans-serif", cursor: "pointer" }}>Login</button>
      </div>
    ),
    code: `<nav style={{
  padding: "14px 24px",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "#10121A",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
}}>
  <span style={{ color: "#DDE3EF", fontSize: 15, fontWeight: 700 }}>Brand</span>
  <div style={{ display: "flex", gap: 24 }}>
    {links.map(link => (
      <a key={link.href} href={link.href} style={{
        color: link.active ? "#DDE3EF" : "#6C7587",
        borderBottom: link.active ? "1px solid #4F7CFF" : "1px solid transparent",
        paddingBottom: 2, textDecoration: "none", fontSize: 14,
      }}>{link.label}</a>
    ))}
  </div>
  <button style={{ padding: "8px 16px", background: "transparent",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: 7,
    color: "#9BA8BF" }}>Login</button>
</nav>`,
  },

  /* ── FOOTERS ─────────────────────────────────────────── */
  {
    id: "footer-columns", category: "Footers",
    name: "Multi-Column Footer",
    desc: "Three-column sitemap + copyright — standard SaaS layout",
    preview: () => (
      <div style={{ width: 280, padding: "14px 16px", borderRadius: 10, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          {[["Product",["Features","Pricing","API"]], ["Company",["About","Blog"]], ["Legal",["Privacy","Terms"]]].map(([t, ls]) => (
            <div key={t} style={{ flex: 1 }}>
              <p style={{ color: "#DDE3EF", fontSize: 11.5, fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 8 }}>{t}</p>
              {ls.map(l => <p key={l} style={{ color: "#333A4C", fontSize: 11, fontFamily: "'Outfit',sans-serif", marginBottom: 6, cursor: "pointer" }}>{l}</p>)}
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#333A4C", fontSize: 10.5, fontFamily: "'Outfit',sans-serif" }}>© 2025 YourCo</span>
          <span style={{ color: "#333A4C", fontSize: 10.5, fontFamily: "'Outfit',sans-serif" }}>Built with care</span>
        </div>
      </div>
    ),
    code: `<footer style={{
  padding: "40px 32px 24px",
  background: "rgba(0,0,0,0.25)",
  borderTop: "1px solid rgba(255,255,255,0.06)",
}}>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, marginBottom: 32 }}>
    {sections.map(section => (
      <div key={section.title}>
        <p style={{ color: "#DDE3EF", fontWeight: 600, marginBottom: 12 }}>{section.title}</p>
        {section.links.map(link => (
          <a key={link} href="#" style={{ display: "block", color: "#4B5563",
            fontSize: 14, marginBottom: 8, textDecoration: "none" }}>{link}</a>
        ))}
      </div>
    ))}
  </div>
  <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex", justifyContent: "space-between" }}>
    <span style={{ color: "#374151", fontSize: 13 }}>© 2025 YourCo</span>
    <span style={{ color: "#374151", fontSize: 13 }}>All rights reserved</span>
  </div>
</footer>`,
  },
  {
    id: "footer-minimal", category: "Footers",
    name: "Minimal Footer Bar",
    desc: "One-line copyright + social links — minimal marketing sites",
    preview: () => (
      <div style={{ width: 280, padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#333A4C", fontSize: 11, fontFamily: "'Outfit',sans-serif" }}>© 2025 YourBrand</span>
        <div style={{ display: "flex", gap: 14 }}>
          {["GitHub","X","Discord"].map(s => <span key={s} style={{ color: "#333A4C", fontSize: 11, fontFamily: "'Outfit',sans-serif", cursor: "pointer" }}>{s}</span>)}
        </div>
      </div>
    ),
    code: `<footer style={{
  padding: "16px 32px",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "rgba(255,255,255,0.025)",
  borderTop: "1px solid rgba(255,255,255,0.06)",
}}>
  <span style={{ color: "#4B5563", fontSize: 13 }}>© 2025 YourBrand</span>
  <div style={{ display: "flex", gap: 24 }}>
    {socialLinks.map(link => (
      <a key={link} href="#" style={{ color: "#4B5563", fontSize: 13,
        textDecoration: "none" }}>{link}</a>
    ))}
  </div>
</footer>`,
  },

  /* ── FORMS ───────────────────────────────────────────── */
  {
    id: "form-input", category: "Forms",
    name: "Labeled Input",
    desc: "Label + placeholder + indigo focus ring",
    preview: () => (
      <div style={{ width: 220 }}>
        <label style={{ display: "block", fontSize: 11.5, fontFamily: "'Outfit',sans-serif", fontWeight: 500, color: "#6C7587", marginBottom: 6, letterSpacing: "0.01em" }}>Email address</label>
        <input type="email" placeholder="kyle@intinc.com" readOnly style={{ width: "100%", padding: "8px 11px", fontSize: 12.5, fontFamily: "'Outfit',sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 8, color: "#DDE3EF", outline: "none" }} />
      </div>
    ),
    code: `<div>
  <label style={{ display: "block", fontSize: 11.5, fontWeight: 500,
    color: "#6C7587", marginBottom: 6 }}>{label}</label>
  <input
    type={type}
    placeholder={placeholder}
    style={{
      width: "100%",
      padding: "8px 12px",
      fontSize: 13,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.11)",
      borderRadius: 8,
      color: "#DDE3EF",
      outline: "none",
    }}
    onFocus={e => e.target.style.borderColor = "rgba(79,124,255,0.6)"}
    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.11)"}
  />
</div>`,
  },
  {
    id: "form-subscribe", category: "Forms",
    name: "Email Subscribe Bar",
    desc: "Inline input + CTA — newsletter and waitlist captures",
    preview: () => (
      <div style={{ display: "flex", gap: 7, width: 240 }}>
        <input type="email" placeholder="you@company.com" readOnly style={{ flex: 1, padding: "8px 11px", fontSize: 12, fontFamily: "'Outfit',sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 8, color: "#DDE3EF", outline: "none" }} />
        <button style={{ padding: "8px 14px", background: "#4F7CFF", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Join →</button>
      </div>
    ),
    code: `<div style={{ display: "flex", gap: 8 }}>
  <input type="email" placeholder="you@company.com"
    style={{
      flex: 1, padding: "10px 14px", fontSize: 14,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 8, color: "#DDE3EF", outline: "none",
    }}
  />
  <button style={{ padding: "10px 18px", background: "#4F7CFF",
    border: "none", borderRadius: 8, color: "#fff", fontWeight: 600 }}>
    Subscribe →
  </button>
</div>`,
  },

  /* ── BADGES ──────────────────────────────────────────── */
  {
    id: "badge-status", category: "Badges",
    name: "Status Badges",
    desc: "Semantic pill — live, beta, deprecated, new variants",
    preview: () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {[
          ["Live",    "#2DCDA0", "rgba(45,205,160,0.10)",  "rgba(45,205,160,0.25)"],
          ["Beta",    "#F5A524", "rgba(245,165,36,0.10)",   "rgba(245,165,36,0.25)"],
          ["Error",   "#F87171", "rgba(248,113,113,0.10)",  "rgba(248,113,113,0.25)"],
          ["New",     "#A78BFA", "rgba(167,139,250,0.10)",  "rgba(167,139,250,0.25)"],
        ].map(([l, c, bg, bo]) => (
          <span key={l} style={{ padding: "3px 9px", fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 999, background: bg, border: `1px solid ${bo}`, color: c }}>{l}</span>
        ))}
      </div>
    ),
    code: `{/* Swap color values per variant */}
<span style={{ padding: "3px 9px", fontSize: 11, fontWeight: 600, borderRadius: 999,
  background: "rgba(45,205,160,0.10)", border: "1px solid rgba(45,205,160,0.25)",
  color: "#2DCDA0" }}>
  Live
</span>
<span style={{ padding: "3px 9px", fontSize: 11, fontWeight: 600, borderRadius: 999,
  background: "rgba(245,165,36,0.10)", border: "1px solid rgba(245,165,36,0.25)",
  color: "#F5A524" }}>
  Beta
</span>`,
  },
  {
    id: "badge-glow", category: "Badges",
    name: "Glow Label Badge",
    desc: "Box-shadow glow for featured / promoted labels",
    preview: () => (
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ padding: "4px 11px", fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 999, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#C4B5FD", boxShadow: "0 0 14px rgba(167,139,250,0.2)" }}>✦ Featured</span>
        <span style={{ padding: "4px 11px", fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 999, background: "rgba(245,165,36,0.10)", border: "1px solid rgba(245,165,36,0.28)", color: "#FCD34D", boxShadow: "0 0 12px rgba(245,165,36,0.15)" }}>🔥 Trending</span>
      </div>
    ),
    code: `<span style={{
  padding: "4px 11px", fontSize: 11, fontWeight: 700, borderRadius: 999,
  background: "rgba(167,139,250,0.12)",
  border: "1px solid rgba(167,139,250,0.3)",
  color: "#C4B5FD",
  boxShadow: "0 0 14px rgba(167,139,250,0.2)",
}}>
  ✦ Featured
</span>`,
  },
  {
    id: "badge-mono", category: "Badges",
    name: "Mono Numeric Badge",
    desc: "Monospace version count / env labels — code and ops interfaces",
    preview: () => (
      <div style={{ display: "flex", gap: 6 }}>
        {[["v2.4.1","rgba(79,124,255,0.10)","rgba(79,124,255,0.25)","#7CA8FF"],["production","rgba(45,205,160,0.10)","rgba(45,205,160,0.25)","#2DCDA0"],["patch","rgba(255,255,255,0.05)","rgba(255,255,255,0.10)","#6C7587"]].map(([l,bg,bo,c]) => (
          <span key={l} style={{ padding: "3px 8px", fontSize: 10.5, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, borderRadius: 4, background: bg, border: `1px solid ${bo}`, color: c }}>{l}</span>
        ))}
      </div>
    ),
    code: `{/* version / env / release tags */}
<span style={{ padding: "3px 8px", fontSize: 10.5,
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, borderRadius: 4,
  background: "rgba(79,124,255,0.10)", border: "1px solid rgba(79,124,255,0.25)",
  color: "#7CA8FF" }}>
  v2.4.1
</span>`,
  },

  /* ── TOGGLES ─────────────────────────────────────────── */
  {
    id: "toggle-basic", category: "Toggles",
    name: "Toggle Switch",
    desc: "Animated on/off — settings pages, feature flags, preferences",
    preview: () => {
      const [on, setOn] = useState(true);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => setOn(o => !o)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? "#4F7CFF" : "rgba(255,255,255,0.08)", border: `1px solid ${on ? "rgba(79,124,255,0.4)" : "rgba(255,255,255,0.12)"}`, cursor: "pointer", position: "relative", transition: "background .2s, border-color .2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s cubic-bezier(.34,1.56,.64,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
          </div>
          <span style={{ color: on ? "#DDE3EF" : "#6C7587", fontSize: 12.5, fontFamily: "'Outfit',sans-serif", fontWeight: 500, transition: "color .2s" }}>{on ? "Enabled" : "Disabled"}</span>
        </div>
      );
    },
    code: `const [enabled, setEnabled] = useState(false);

<div onClick={() => setEnabled(e => !e)}
  style={{
    width: 40, height: 22, borderRadius: 11,
    background: enabled ? "#4F7CFF" : "rgba(255,255,255,0.08)",
    cursor: "pointer", position: "relative",
    transition: "background .2s",
  }}>
  <div style={{
    position: "absolute",
    top: 2, left: enabled ? 20 : 2,
    width: 16, height: 16, borderRadius: "50%",
    background: "#fff",
    transition: "left .2s cubic-bezier(.34,1.56,.64,1)",
  }} />
</div>`,
  },
  {
    id: "toggle-settings", category: "Toggles",
    name: "Settings Row Toggle",
    desc: "Label + description inline with toggle — settings/preferences list",
    preview: () => {
      const [on, setOn] = useState(false);
      return (
        <div style={{ width: 260, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#DDE3EF", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 500, marginBottom: 2 }}>Email notifications</p>
            <p style={{ color: "#6C7587", fontSize: 11.5, fontFamily: "'Outfit',sans-serif" }}>Receive weekly summary</p>
          </div>
          <div onClick={() => setOn(o => !o)} style={{ width: 38, height: 21, borderRadius: 10.5, background: on ? "#4F7CFF" : "rgba(255,255,255,0.08)", border: `1px solid ${on ? "rgba(79,124,255,0.4)" : "rgba(255,255,255,0.12)"}`, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2.5, left: on ? 18 : 2.5, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left .2s cubic-bezier(.34,1.56,.64,1)" }} />
          </div>
        </div>
      );
    },
    code: `<div style={{
  padding: "12px 16px", borderRadius: 10,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  display: "flex", alignItems: "center", justifyContent: "space-between",
}}>
  <div>
    <p style={{ color: "#DDE3EF", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</p>
    <p style={{ color: "#6C7587", fontSize: 12 }}>{description}</p>
  </div>
  <div onClick={() => setEnabled(e => !e)} style={{
    width: 38, height: 21, borderRadius: 10.5,
    background: enabled ? "#4F7CFF" : "rgba(255,255,255,0.08)",
    cursor: "pointer", position: "relative", transition: "background .2s",
  }}>
    <div style={{
      position: "absolute", top: 3,
      left: enabled ? 18 : 3, width: 14, height: 14,
      borderRadius: "50%", background: "#fff",
      transition: "left .2s cubic-bezier(.34,1.56,.64,1)",
    }} />
  </div>
</div>`,
  },
];

/* ═══════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHT — tokenizes JSX code string for preview
═══════════════════════════════════════════════════════════ */
function highlight(code) {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const tokens = [];
    let rem = line;
    while (rem.length > 0) {
      // Comment
      if (rem.startsWith("{/*")) {
        const end = rem.indexOf("*/}");
        if (end !== -1) {
          tokens.push(<span key={tokens.length} className="tok-cm">{rem.slice(0, end + 3)}</span>);
          rem = rem.slice(end + 3); continue;
        }
      }
      // String (double or single quote)
      const strMatch = rem.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
      if (strMatch) {
        tokens.push(<span key={tokens.length} className="tok-str">{strMatch[0]}</span>);
        rem = rem.slice(strMatch[0].length); continue;
      }
      // Tag name <Foo or </Foo
      const tagMatch = rem.match(/^(<\/?[A-Za-z][A-Za-z0-9.]*)/);
      if (tagMatch) {
        tokens.push(<span key={tokens.length} className="tok-tag">{tagMatch[0]}</span>);
        rem = rem.slice(tagMatch[0].length); continue;
      }
      // JSX attribute name
      const attrMatch = rem.match(/^([a-zA-Z][a-zA-Z0-9-]*)(?==)/);
      if (attrMatch) {
        tokens.push(<span key={tokens.length} className="tok-attr">{attrMatch[0]}</span>);
        rem = rem.slice(attrMatch[0].length); continue;
      }
      // Keyword
      const kwMatch = rem.match(/^(const|let|var|return|import|from|export|default|function|=>|style|type|className)(?=\b)/);
      if (kwMatch) {
        tokens.push(<span key={tokens.length} className="tok-kw">{kwMatch[0]}</span>);
        rem = rem.slice(kwMatch[0].length); continue;
      }
      tokens.push(rem[0]);
      rem = rem.slice(1);
    }
    return <div key={i}>{tokens.length ? tokens : "\u00A0"}</div>;
  });
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function ComponentLibrary() {
  const [activeCat, setActiveCat]     = useState("All");
  const [query, setQuery]             = useState("");
  const [canvas, setCanvas]           = useState([]);
  const [codeView, setCodeView]       = useState({});
  const [copied, setCopied]           = useState(null);
  const [exportCopied, setExportCopied] = useState(false);
  const searchRef = useRef(null);

  /* ── Keyboard shortcut: / to focus search ── */
  useEffect(() => {
    const handler = e => {
      if ((e.key === "/" || (e.metaKey && e.key === "k")) && e.target.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") searchRef.current?.blur();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = COMPONENTS.filter(c => {
    const catOk = activeCat === "All" || c.category === activeCat;
    const q = query.toLowerCase();
    const searchOk = !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const inCanvas = id => canvas.includes(id);

  const toggleCanvas = useCallback(id =>
    setCanvas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);

  const move = useCallback((idx, dir) => {
    setCanvas(prev => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const copyCode = id => {
    const c = COMPONENTS.find(x => x.id === id);
    if (!c) return;
    navigator.clipboard.writeText(c.code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const exportAll = () => {
    const out = canvas.map(id => {
      const c = COMPONENTS.find(x => x.id === id);
      return c ? `/* ── ${c.name} ── */\n${c.code}` : "";
    }).filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(out).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2200);
    });
  };

  const catCounts = Object.fromEntries(
    CATS.map(cat => [cat, cat === "All" ? COMPONENTS.length : COMPONENTS.filter(c => c.category === cat).length])
  );

  /* ── BASE STYLES ── */
  const s = {
    app: { display: "flex", height: "100vh", overflow: "hidden", color: "var(--text-1)", background: "var(--bg)", fontFamily: "var(--ff-b)", fontSize: 13 },
    sidebar: { width: 200, minWidth: 200, display: "flex", flexDirection: "column", padding: "0 8px 12px", borderRight: "1px solid var(--border)" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    canvas: { width: 256, minWidth: 256, display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)" },
    topBar: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--surface)" },
    grid: { flex: 1, overflowY: "auto", padding: "14px 14px" },
  };

  return (
    <div style={s.app}>
      <StyleInject />

      {/* ══ SIDEBAR ════════════════════════════════════════ */}
      <aside style={s.sidebar}>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 8px 12px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#4F7CFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <I.Grid />
          </div>
          <div>
            <p style={{ color: "var(--text-1)", fontSize: 13, fontFamily: "var(--ff-d)", fontWeight: 700, lineHeight: 1.2 }}>UI Kit</p>
            <p style={{ color: "var(--text-3)", fontSize: 10.5, fontFamily: "var(--ff-m)" }}>{COMPONENTS.length} components</p>
          </div>
        </div>

        {/* Category label */}
        <p style={{ color: "var(--text-3)", fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", padding: "0 8px", marginBottom: 5 }}>Categories</p>

        {/* Category list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {CATS.map(cat => {
            const active = activeCat === cat;
            const color = cat === "All" ? "#4F7CFF" : (CAT_COLOR[cat] || "#4F7CFF");
            return (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", borderRadius: 7, border: "none",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  background: active ? `${color}14` : "transparent",
                  color: active ? color : "var(--text-2)",
                  fontFamily: "var(--ff-b)", fontSize: 12.5, fontWeight: active ? 600 : 400,
                  transition: "background .12s, color .12s",
                }}>
                {/* Category color dot */}
                {cat !== "All" && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: active ? color : "var(--text-3)", flexShrink: 0, transition: "background .12s" }} />
                )}
                {cat === "All" && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: active ? color : "var(--text-3)", flexShrink: 0, transition: "background .12s" }} />
                )}
                <span style={{ flex: 1 }}>{cat}</span>
                <span style={{ fontSize: 10.5, fontFamily: "var(--ff-m)", color: active ? color : "var(--text-3)", padding: "1px 5px", borderRadius: 4, background: active ? `${color}18` : "rgba(255,255,255,0.04)" }}>
                  {catCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Canvas summary card */}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div style={{ padding: "12px", borderRadius: 10, background: "var(--elevated)", border: "1px solid var(--border-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <I.Layers />
              <span style={{ color: "var(--text-2)", fontSize: 11.5, fontWeight: 500 }}>Canvas</span>
            </div>
            <p style={{ color: "var(--text-1)", fontSize: 22, fontFamily: "var(--ff-d)", fontWeight: 700, lineHeight: 1 }}>{canvas.length}</p>
            <p style={{ color: "var(--text-3)", fontSize: 10.5, marginTop: 3 }}>component{canvas.length !== 1 ? "s" : ""} queued</p>
            {/* Mini layer bars */}
            {canvas.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
                {canvas.slice(0, 4).map((id, i) => {
                  const c = COMPONENTS.find(x => x.id === id);
                  const col = c ? (CAT_COLOR[c.category] || "#4F7CFF") : "#4F7CFF";
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", gap: 5, opacity: 1 - i * 0.15 }}>
                      <div style={{ width: 12, height: 3, borderRadius: 2, background: col, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--ff-b)" }}>{c?.name}</span>
                    </div>
                  );
                })}
                {canvas.length > 4 && <span style={{ fontSize: 10, color: "var(--text-3)" }}>+{canvas.length - 4} more</span>}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ════════════════════════════════════════════ */}
      <main style={s.main}>

        {/* Search / topbar */}
        <div style={s.topBar}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "0 10px", height: 32, background: "var(--elevated)", border: "1px solid var(--border-md)", borderRadius: 8, transition: "border-color .14s" }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(79,124,255,0.5)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border-md)"}>
            <span style={{ color: "var(--text-3)" }}><I.Search /></span>
            <input ref={searchRef} type="text" placeholder="Search components…" value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-1)", fontSize: 12.5, fontFamily: "var(--ff-b)" }} />
            {query
              ? <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center" }}><I.X /></button>
              : <span style={{ fontSize: 10.5, color: "var(--text-3)", fontFamily: "var(--ff-m)", flexShrink: 0 }}>/</span>
            }
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-3)", fontSize: 11, fontFamily: "var(--ff-m)", flexShrink: 0 }}>
            <I.Sparkle />
            <span>{filtered.length} shown</span>
          </div>
        </div>

        {/* Grid */}
        <div className="scr" style={s.grid}>
          {filtered.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--elevated)", border: "1px solid var(--border-md)", display: "flex", alignItems: "center", justifyContent: "center" }}><I.Search /></div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>No results for "{query}"</p>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>Try a different category or keyword</p>
              </div>
              <button onClick={() => setQuery("")} style={{ padding: "5px 14px", fontSize: 12, background: "var(--accent-dim)", border: "1px solid rgba(79,124,255,0.25)", borderRadius: 6, color: "#7CA8FF", cursor: "pointer", fontFamily: "var(--ff-b)", marginTop: 4 }}>Clear search</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(258px, 1fr))", gap: 10 }}>
              {filtered.map(comp => {
                const selected = inCanvas(comp.id);
                const showCode = !!codeView[comp.id];
                const isCopied = copied === comp.id;
                const catColor = CAT_COLOR[comp.category] || "#4F7CFF";

                return (
                  <div key={comp.id} className="comp-card"
                    style={{
                      borderRadius: 12, overflow: "hidden",
                      background: "var(--surface)",
                      /* The signature element: left border encodes category + selected state */
                      border: `1px solid ${selected ? catColor + "55" : "var(--border)"}`,
                      borderLeft: `2px solid ${selected ? catColor : "var(--border)"}`,
                      boxShadow: selected ? `0 0 22px ${catColor}15` : "none",
                    }}>

                    {/* Preview / Code */}
                    <div className="preview-bg" style={{ minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
                      {showCode ? (
                        <pre style={{ width: "100%", maxHeight: 130, overflow: "auto", fontSize: 10.5, lineHeight: 1.65, color: "#8B9CB5", fontFamily: "var(--ff-m)", whiteSpace: "pre-wrap" }} className="scr">
                          {highlight(comp.code)}
                        </pre>
                      ) : (
                        <comp.preview />
                      )}

                      {/* View toggle */}
                      <button onClick={() => setCodeView(prev => ({ ...prev, [comp.id]: !prev[comp.id] }))}
                        style={{ position: "absolute", top: 7, right: 7, display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", fontSize: 11, fontFamily: "var(--ff-b)", background: "rgba(0,0,0,0.6)", border: "1px solid var(--border-md)", borderRadius: 5, color: "var(--text-2)", cursor: "pointer", backdropFilter: "blur(8px)" }}>
                        {showCode ? <><I.Eye /><span>Preview</span></> : <><I.Code /><span>Code</span></>}
                      </button>

                      {/* Category color dot */}
                      <div style={{ position: "absolute", top: 9, left: 9, width: 6, height: 6, borderRadius: "50%", background: catColor, opacity: 0.8 }} />

                      {/* Selected badge */}
                      {selected && (
                        <div className="pop-in" style={{ position: "absolute", bottom: 7, left: 7, display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", fontSize: 10.5, fontFamily: "var(--ff-b)", fontWeight: 600, background: `${catColor}22`, border: `1px solid ${catColor}44`, borderRadius: 5, color: catColor }}>
                          <I.Check /><span>In canvas</span>
                        </div>
                      )}
                    </div>

                    {/* Meta + actions */}
                    <div style={{ padding: "11px 13px 12px", borderTop: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "var(--text-1)", fontSize: 12.5, fontWeight: 600, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{comp.name}</p>
                          <p style={{ color: "var(--text-2)", fontSize: 11.5, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{comp.desc}</p>
                        </div>
                        <span style={{ fontSize: 10, fontFamily: "var(--ff-b)", fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: `${catColor}12`, color: catColor, flexShrink: 0, border: `1px solid ${catColor}25`, marginTop: 1 }}>{comp.category}</span>
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => toggleCanvas(comp.id)}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 28, borderRadius: 7, fontSize: 11.5, fontFamily: "var(--ff-b)", fontWeight: 600, cursor: "pointer", border: `1px solid ${selected ? catColor + "44" : "var(--border-md)"}`, background: selected ? `${catColor}10` : "var(--elevated)", color: selected ? catColor : "var(--text-2)", transition: "all .13s" }}>
                          {selected ? <><I.Check /><span>In Canvas</span></> : <><I.Plus /><span>Add to Canvas</span></>}
                        </button>
                        <button onClick={() => copyCode(comp.id)}
                          style={{ width: 30, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7, fontSize: 11.5, cursor: "pointer", border: `1px solid ${isCopied ? "rgba(45,205,160,0.35)" : "var(--border-md)"}`, background: isCopied ? "rgba(45,205,160,0.10)" : "var(--elevated)", color: isCopied ? "#2DCDA0" : "var(--text-2)", transition: "all .13s", flexShrink: 0 }}>
                          {isCopied ? <I.Check /> : <I.Copy />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ══ CANVAS PANEL ════════════════════════════════════ */}
      <aside style={s.canvas}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 48, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <I.Layers />
          <span style={{ flex: 1, fontSize: 13, fontFamily: "var(--ff-d)", fontWeight: 700, color: "var(--text-1)" }}>Page Builder</span>
          {canvas.length > 0 && (
            <button onClick={() => setCanvas([])} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--ff-b)", padding: "3px 6px", borderRadius: 5 }}
              onMouseEnter={e => { e.currentTarget.style.color = "#F87171"; e.currentTarget.style.background = "rgba(248,113,113,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.background = "none"; }}>
              <I.Trash /><span>Clear</span>
            </button>
          )}
        </div>

        {/* Canvas items */}
        <div className="scr" style={{ flex: 1, overflowY: "auto", padding: canvas.length > 0 ? "8px 8px" : 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {canvas.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 20px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--elevated)", border: "1px solid var(--border-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
                <I.Layers />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>Canvas is empty</p>
                <p style={{ fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 }}>Add components from the grid to build your page stack</p>
              </div>
            </div>
          ) : (
            canvas.map((id, idx) => {
              const comp = COMPONENTS.find(c => c.id === id);
              if (!comp) return null;
              const col = CAT_COLOR[comp.category] || "#4F7CFF";
              return (
                <div key={id} className="slide-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "var(--elevated)", border: "1px solid var(--border)", borderLeft: `2px solid ${col}` }}>
                  {/* Numbered badge */}
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: `${col}18`, border: `1px solid ${col}28`, color: col, fontSize: 10, fontFamily: "var(--ff-m)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{idx + 1}</span>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "var(--text-1)", fontSize: 11.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comp.name}</p>
                    <p style={{ color: "var(--text-3)", fontSize: 10.5 }}>{comp.category}</p>
                  </div>

                  {/* Controls — visible on hover via group approach */}
                  <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    {[
                      { action: () => move(idx, -1), icon: <I.ChevUp />, disabled: idx === 0 },
                      { action: () => move(idx, 1),  icon: <I.ChevDown />, disabled: idx === canvas.length - 1 },
                      { action: () => toggleCanvas(id), icon: <I.X />, isDelete: true },
                    ].map((btn, bi) => (
                      <button key={bi} onClick={btn.disabled ? undefined : btn.action}
                        style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, background: "none", border: "none", cursor: btn.disabled ? "not-allowed" : "pointer", color: btn.disabled ? "var(--text-3)" : "var(--text-2)", opacity: btn.disabled ? 0.3 : 1 }}
                        onMouseEnter={e => { if (!btn.disabled) e.currentTarget.style.color = btn.isDelete ? "#F87171" : "var(--text-1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = btn.disabled ? "var(--text-3)" : "var(--text-2)"; }}>
                        {btn.icon}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Export */}
        {canvas.length > 0 && (
          <div style={{ padding: "10px 10px 12px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            <button onClick={exportAll}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 34, borderRadius: 8, fontSize: 12.5, fontFamily: "var(--ff-b)", fontWeight: 600, cursor: "pointer", transition: "all .18s", border: exportCopied ? "1px solid rgba(45,205,160,0.35)" : "none", background: exportCopied ? "rgba(45,205,160,0.10)" : "#4F7CFF", color: exportCopied ? "#2DCDA0" : "#fff" }}>
              {exportCopied ? <><I.Check /><span>Copied!</span></> : <><I.Download /><span>Export {canvas.length} Component{canvas.length !== 1 ? "s" : ""}</span></>}
            </button>
            <p style={{ textAlign: "center", fontSize: 10.5, color: "var(--text-3)", marginTop: 6, fontFamily: "var(--ff-b)" }}>Copies combined JSX to clipboard</p>
          </div>
        )}
      </aside>
    </div>
  );
}
