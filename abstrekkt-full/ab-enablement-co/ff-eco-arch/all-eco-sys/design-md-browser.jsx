import { useState, useCallback, useMemo, useEffect } from "react";

const S = {
  base: "#0a0a0f", raised: "#111118", overlay: "#18181f",
  border: "#2a2a38", borderSub: "#1e1e28",
  accent: "hsl(262,83%,68%)", accentDim: "hsl(262,60%,45%)", accentGlow: "hsla(262,83%,68%,0.15)",
  text: "#f0f0f5", textSec: "#9898a8", textTer: "#52525e",
  success: "#22c55e", successBg: "rgba(34,197,94,0.12)",
  fontHead: "'Space Grotesk','DM Sans',sans-serif",
  fontBody: "'Inter','DM Sans',system-ui,sans-serif",
  fontMono: "'IBM Plex Mono','Fira Code',monospace",
};

const RAW = "https://raw.githubusercontent.com/Krosebrook/awesome-design-md/main/design-md";

const BRANDS = [
  { id:"airbnb",      name:"Airbnb",       cat:"E-Commerce",   desc:"Warm coral accent, photography-driven, rounded UI",                    bg:"#FFFFFF", accent:"#FF5A5F" },
  { id:"airtable",    name:"Airtable",     cat:"Design",       desc:"Colorful, friendly, structured data aesthetic",                         bg:"#F7F7F7", accent:"#FFB200" },
  { id:"apple",       name:"Apple",        cat:"Media",        desc:"Premium white space, SF Pro, cinematic full-bleed imagery",             bg:"#FFFFFF", accent:"#0071E3" },
  { id:"binance",     name:"Binance",      cat:"Fintech",      desc:"Bold yellow on monochrome, trading-floor urgency",                      bg:"#0B0E11", accent:"#F3BA2F" },
  { id:"bmw",         name:"BMW",          cat:"Automotive",   desc:"Dark premium surfaces, precise German engineering",                      bg:"#1A1A1A", accent:"#0066CC" },
  { id:"bmw-m",       name:"BMW M",        cat:"Automotive",   desc:"Motorsport contrast, M tri-color accents, precision layout",            bg:"#0A0A0A", accent:"#C0392B" },
  { id:"bugatti",     name:"Bugatti",      cat:"Automotive",   desc:"Cinema-black canvas, monochrome austerity, monumental display type",    bg:"#000000", accent:"#C9A84C" },
  { id:"cal",         name:"Cal.com",      cat:"Productivity", desc:"Open-source scheduling, neutral UI, developer-oriented simplicity",     bg:"#FFFFFF", accent:"#292929" },
  { id:"claude",      name:"Claude",       cat:"AI & LLM",     desc:"Warm terracotta accent on cream, clean editorial layout",               bg:"#FAF0EB", accent:"#D97949" },
  { id:"clay",        name:"Clay",         cat:"Design",       desc:"Organic shapes, soft gradients, art-directed layout",                   bg:"#F9F5FF", accent:"#C084FC" },
  { id:"clickhouse",  name:"ClickHouse",   cat:"Backend",      desc:"Fast analytics DB, yellow-accented technical documentation style",      bg:"#1A1A1A", accent:"#FAFF69" },
  { id:"cohere",      name:"Cohere",       cat:"AI & LLM",     desc:"Vibrant gradients, data-rich enterprise dashboard aesthetic",           bg:"#0A0B0D", accent:"#39B5FF" },
  { id:"coinbase",    name:"Coinbase",     cat:"Fintech",      desc:"Clean blue identity, trust-focused, institutional feel",                bg:"#FFFFFF", accent:"#0052FF" },
  { id:"composio",    name:"Composio",     cat:"Backend",      desc:"Tool integration platform, modern dark with colorful icons",            bg:"#0D0D0D", accent:"#FF6B35" },
  { id:"cursor",      name:"Cursor",       cat:"Dev Tools",    desc:"AI-first code editor, sleek dark interface, gradient accents",          bg:"#0A0A0F", accent:"#5B5BFF" },
  { id:"elevenlabs",  name:"ElevenLabs",   cat:"AI & LLM",     desc:"Dark cinematic UI, audio-waveform aesthetics, stark contrast",         bg:"#0D0D0D", accent:"#F5F5F5" },
  { id:"expo",        name:"Expo",         cat:"Dev Tools",    desc:"React Native platform, dark theme, tight tracking, code-centric",       bg:"#111111", accent:"#FFFFFF" },
  { id:"ferrari",     name:"Ferrari",      cat:"Automotive",   desc:"Chiaroscuro editorial, Ferrari Red with extreme sparseness",            bg:"#0A0A0A", accent:"#D40000" },
  { id:"figma",       name:"Figma",        cat:"Design",       desc:"Vibrant multi-color system, playful yet professional",                  bg:"#0A0A0A", accent:"#A259FF" },
  { id:"framer",      name:"Framer",       cat:"Design",       desc:"Bold black and blue, motion-first, design-forward",                    bg:"#0A0A0A", accent:"#0099FF" },
  { id:"hashicorp",   name:"HashiCorp",    cat:"Backend",      desc:"Infrastructure automation, enterprise-clean black and white",           bg:"#FFFFFF", accent:"#000000" },
  { id:"ibm",         name:"IBM",          cat:"Media",        desc:"Carbon design system, structured blue palette, dense documentation",    bg:"#161616", accent:"#0F62FE" },
  { id:"intercom",    name:"Intercom",     cat:"Productivity", desc:"Friendly blue palette, conversational UI patterns",                    bg:"#FFFFFF", accent:"#1F8DED" },
  { id:"kraken",      name:"Kraken",       cat:"Fintech",      desc:"Purple-accented dark UI, data-dense trading dashboards",               bg:"#121218", accent:"#5741D9" },
  { id:"lamborghini", name:"Lamborghini",  cat:"Automotive",   desc:"True black cathedral, gold accent, custom Neo-Grotesk LamboType",      bg:"#000000", accent:"#C9A84C" },
  { id:"linear.app",  name:"Linear",       cat:"Productivity", desc:"Ultra-minimal, software-craft dense, lavender-blue signature accent",   bg:"#010102", accent:"#5E6AD2" },
  { id:"lovable",     name:"Lovable",      cat:"Dev Tools",    desc:"AI full-stack builder, playful gradients, friendly dev aesthetic",      bg:"#0F0F1A", accent:"#FF6B9D" },
  { id:"mastercard",  name:"Mastercard",   cat:"Fintech",      desc:"Warm cream canvas, orbital pill shapes, editorial warmth",              bg:"#F7F2EB", accent:"#EB001B" },
  { id:"meta",        name:"Meta",         cat:"E-Commerce",   desc:"Photography-first, binary light/dark surfaces, Meta Blue CTAs",        bg:"#FFFFFF", accent:"#0866FF" },
  { id:"minimax",     name:"Minimax",      cat:"AI & LLM",     desc:"Bold dark interface with neon accents and model-provider energy",       bg:"#0A0A0A", accent:"#00FF9D" },
  { id:"mintlify",    name:"Mintlify",     cat:"Productivity", desc:"Documentation platform, green-accented, reading-optimized",            bg:"#FFFFFF", accent:"#16A34A" },
  { id:"miro",        name:"Miro",         cat:"Design",       desc:"Bright yellow accent, infinite-canvas collaboration aesthetic",         bg:"#FFFFFF", accent:"#FFD02F" },
  { id:"mistral.ai",  name:"Mistral AI",   cat:"AI & LLM",     desc:"French-engineered minimalism, purple-toned, open-weight LLM energy",   bg:"#1A1A2E", accent:"#7B5EA7" },
  { id:"mongodb",     name:"MongoDB",      cat:"Backend",      desc:"Green leaf branding, developer documentation focus, document-first",    bg:"#001E2B", accent:"#00ED64" },
  { id:"nike",        name:"Nike",         cat:"E-Commerce",   desc:"Monochrome UI, massive uppercase Futura, full-bleed photography",       bg:"#FFFFFF", accent:"#111111" },
  { id:"notion",      name:"Notion",       cat:"Productivity", desc:"Warm minimalism, serif headings, soft neutral surfaces",                bg:"#FFFFFF", accent:"#000000" },
  { id:"nvidia",      name:"NVIDIA",       cat:"Media",        desc:"Green-black energy, technical power aesthetic, GPU computing brand",    bg:"#0A0A0A", accent:"#76B900" },
  { id:"ollama",      name:"Ollama",       cat:"AI & LLM",     desc:"Run LLMs locally, terminal-first, monochrome simplicity",               bg:"#111111", accent:"#F0F0F0" },
  { id:"opencode.ai", name:"OpenCode AI",  cat:"AI & LLM",     desc:"AI coding platform, developer-centric dark theme",                     bg:"#0F0F0F", accent:"#61DAFB" },
  { id:"pinterest",   name:"Pinterest",    cat:"Media",        desc:"Red accent, masonry grid, visual discovery image-first",                bg:"#FFFFFF", accent:"#E60023" },
  { id:"playstation", name:"PlayStation",  cat:"Media",        desc:"Three-surface channel layout, cyan hover-scale interaction",            bg:"#0A0A0A", accent:"#00439C" },
  { id:"posthog",     name:"PostHog",      cat:"Backend",      desc:"Playful hedgehog branding, developer-friendly dark UI, analytics",      bg:"#1D1E21", accent:"#FF5E24" },
  { id:"raycast",     name:"Raycast",      cat:"Dev Tools",    desc:"Productivity launcher, sleek dark chrome, vibrant gradient accents",    bg:"#1A1A2E", accent:"#FF6363" },
  { id:"renault",     name:"Renault",      cat:"Automotive",   desc:"Vivid aurora gradients, NouvelR typeface, zero-radius buttons",         bg:"#1A1A1A", accent:"#EFDF00" },
  { id:"replicate",   name:"Replicate",    cat:"AI & LLM",     desc:"Run ML models via API, clean white canvas, code-forward",              bg:"#FFFFFF", accent:"#000000" },
  { id:"resend",      name:"Resend",       cat:"Productivity", desc:"Email API for developers, minimal dark theme, monospace accents",       bg:"#000000", accent:"#FFFFFF" },
  { id:"revolut",     name:"Revolut",      cat:"Fintech",      desc:"Sleek dark interface, gradient cards, fintech precision",               bg:"#0A0A14", accent:"#7654FF" },
  { id:"runwayml",    name:"Runway",       cat:"AI & LLM",     desc:"Cinematic dark heroes, paper-white reading bands, film-festival feel",  bg:"#0A0A0A", accent:"#FFFFFF" },
  { id:"sanity",      name:"Sanity",       cat:"Backend",      desc:"Dark editorial, IBM Plex Mono eyebrows, coral-red CTA",                 bg:"#101010", accent:"#F03E2F" },
  { id:"sentry",      name:"Sentry",       cat:"Backend",      desc:"Error monitoring, dark data-dense dashboard, pink-purple accent",       bg:"#1A1A2E", accent:"#8B44FF" },
  { id:"shopify",     name:"Shopify",      cat:"E-Commerce",   desc:"Dark-first cinematic, neon green accent, ultra-light display type",     bg:"#0A0A0A", accent:"#95BF47" },
  { id:"slack",       name:"Slack",        cat:"Productivity", desc:"Deep aubergine primary, cream-lavender hero gradients, pill CTAs",      bg:"#4A154B", accent:"#ECB22E" },
  { id:"spacex",      name:"SpaceX",       cat:"Media",        desc:"Stark black and white, full-bleed imagery, futuristic minimalism",      bg:"#000000", accent:"#FFFFFF" },
  { id:"spotify",     name:"Spotify",      cat:"Media",        desc:"Vibrant green on dark, bold type, album-art-driven layouts",            bg:"#000000", accent:"#1DB954" },
  { id:"starbucks",   name:"Starbucks",    cat:"E-Commerce",   desc:"Four-tier earth-green system, warm cream canvas, proprietary SoDoSans", bg:"#FAF3E0", accent:"#00704A" },
  { id:"stripe",      name:"Stripe",       cat:"Fintech",      desc:"Signature indigo gradients, weight-300 elegance, tabular money type",   bg:"#FFFFFF", accent:"#533AFD" },
  { id:"supabase",    name:"Supabase",     cat:"Backend",      desc:"Firebase alternative, dark emerald theme, code-first, open-source",     bg:"#1C1C1C", accent:"#3ECF8E" },
  { id:"superhuman",  name:"Superhuman",   cat:"Dev Tools",    desc:"Premium dark UI, keyboard-first, purple glow, email perfection",        bg:"#0A0A14", accent:"#7B55FF" },
  { id:"tesla",       name:"Tesla",        cat:"Automotive",   desc:"Radical subtraction, cinematic full-viewport photography, Universal Sans", bg:"#000000", accent:"#E82127" },
  { id:"theverge",    name:"The Verge",    cat:"Media",        desc:"Acid-mint and ultraviolet accents, Manuka display type, tech editorial", bg:"#1B002A", accent:"#00E7FF" },
  { id:"together.ai", name:"Together AI",  cat:"AI & LLM",     desc:"Open-source AI infrastructure, technical blueprint-style design",       bg:"#0C1225", accent:"#5B8CFF" },
  { id:"uber",        name:"Uber",         cat:"Media",        desc:"Bold black and white, tight type, urban energy, mobility precision",    bg:"#FFFFFF", accent:"#000000" },
  { id:"vercel",      name:"Vercel",       cat:"Dev Tools",    desc:"Black and white precision, Geist font, shadow-as-border technique",     bg:"#000000", accent:"#FFFFFF" },
  { id:"vodafone",    name:"Vodafone",     cat:"Media",        desc:"Monumental uppercase display, Vodafone Red chapter bands",               bg:"#FFFFFF", accent:"#E60000" },
  { id:"voltagent",   name:"VoltAgent",    cat:"AI & LLM",     desc:"Void-black canvas, emerald accent, terminal-native agent framework",    bg:"#000000", accent:"#10B981" },
  { id:"warp",        name:"Warp",         cat:"Dev Tools",    desc:"Modern terminal, dark IDE-like interface, block-based command UI",       bg:"#0E1117", accent:"#01A9FF" },
  { id:"webflow",     name:"Webflow",      cat:"Design",       desc:"Blue-accented, polished marketing site aesthetic, visual web builder",   bg:"#020917", accent:"#146EF5" },
  { id:"wired",       name:"WIRED",        cat:"Media",        desc:"Paper-white broadsheet density, custom serif, ink-blue links",           bg:"#FFFFFF", accent:"#0C2340" },
  { id:"wise",        name:"Wise",         cat:"Fintech",      desc:"International transfers, bright teal-green accent, friendly and clear",  bg:"#FFFFFF", accent:"#00B9A5" },
  { id:"x.ai",        name:"xAI",          cat:"AI & LLM",     desc:"Elon Musk's AI lab, stark monochrome, futuristic minimalism",           bg:"#000000", accent:"#FFFFFF" },
  { id:"zapier",      name:"Zapier",       cat:"Productivity", desc:"Automation platform, warm orange, friendly illustration-driven",         bg:"#FFFFFF", accent:"#FF4A00" },
];

const CATS = ["All", ...Array.from(new Set(BRANDS.map(b => b.cat))).sort()];

function luma(hex) {
  const h = hex.replace("#","");
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0,2),16)/255;
  const g = parseInt(h.slice(2,4),16)/255;
  const b = parseInt(h.slice(4,6),16)/255;
  return 0.299*r + 0.587*g + 0.114*b;
}

function BrandCard({ brand, selected, onClick }) {
  const [hov, setHov] = useState(false);
  const dark = luma(brand.bg) < 0.45;
  const textCol = dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 8,
        border: selected
          ? `1px solid ${S.accent}`
          : `1px solid ${hov ? "#3a3a50" : S.border}`,
        overflow:"hidden", cursor:"pointer",
        background: selected ? "#16162a" : hov ? "#13131e" : S.raised,
        transition:"border-color 120ms, background 120ms, transform 120ms",
        transform: hov && !selected ? "translateY(-1px)" : "none",
        boxShadow: selected ? `0 0 0 1px ${S.accent}, 0 4px 20px hsla(262,83%,68%,0.12)` : "none",
      }}
    >
      <div style={{
        height: 56, background: brand.bg,
        display:"flex", alignItems:"center", padding:"0 12px", gap:8,
        borderBottom:`1px solid ${S.borderSub}`,
      }}>
        <span style={{
          width:12, height:12, borderRadius:"50%",
          background: brand.accent, flexShrink:0,
          boxShadow: luma(brand.bg) < 0.3 ? `0 0 8px ${brand.accent}88` : "none",
        }}/>
        <span style={{
          fontSize:13, fontWeight:600, color:textCol,
          fontFamily:S.fontHead, letterSpacing:"-0.2px",
          overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
        }}>{brand.name}</span>
      </div>
      <div style={{ padding:"10px 12px" }}>
        <span style={{
          display:"inline-block", fontSize:10, fontWeight:500,
          color:S.accentDim, background:"hsla(262,60%,45%,0.15)",
          padding:"2px 7px", borderRadius:99, letterSpacing:"0.04em",
          textTransform:"uppercase", marginBottom:6,
        }}>{brand.cat}</span>
        <p style={{
          margin:0, fontSize:11, color:S.textSec, lineHeight:1.55,
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden",
          fontFamily:S.fontBody,
        }}>{brand.desc}</p>
      </div>
    </div>
  );
}

function Viewer({ brand, onClose }) {
  const [md, setMd] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("raw");

  useEffect(() => {
    setLoading(true); setErr(null); setMd(""); setView("raw");
    fetch(`${RAW}/${brand.id}/DESIGN.md`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(t => { setMd(t); setLoading(false); })
      .catch(e => { setErr(e.message); setLoading(false); });
  }, [brand.id]);

  const handleCopy = useCallback(async () => {
    if (!md) return;
    try { await navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard blocked */ }
  }, [md]);

  const rendered = useMemo(() => {
    if (!md) return "";
    let h = md
      .replace(/^---[\s\S]*?---\n?/, "")
      .replace(/^#### (.+)$/gm, '<h4 style="margin:16px 0 6px;font-size:13px;font-weight:600;color:#f0f0f5;font-family:Space Grotesk,sans-serif">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 style="margin:20px 0 8px;font-size:14px;font-weight:600;color:#f0f0f5;font-family:Space Grotesk,sans-serif;border-bottom:1px solid #1e1e28;padding-bottom:6px">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="margin:28px 0 10px;font-size:16px;font-weight:700;color:#f0f0f5;font-family:Space Grotesk,sans-serif;letter-spacing:-0.3px">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#f0f0f5;font-family:Space Grotesk,sans-serif;letter-spacing:-0.5px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#d0d0e0;font-weight:600">$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="font-family:IBM Plex Mono,monospace;font-size:11px;background:#1e1e2e;color:#a9b1d6;padding:1px 5px;border-radius:4px">$1</code>')
      .replace(/^\| (.+) \|$/gm, (row) => {
        const cells = row.slice(2,-2).split(" | ");
        const isHeader = false;
        return `<tr>${cells.map(c => `<td style="padding:5px 10px;border-bottom:1px solid #1e1e28;font-size:12px;color:#9898a8;vertical-align:top">${c.trim()}</td>`).join("")}</tr>`;
      })
      .replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0;font-size:13px;color:#9898a8;line-height:1.55">$1</li>')
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="margin:8px 0;padding-left:20px">$&</ul>')
      .replace(/<\/li>\n<li/g, '</li><li')
      .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, '<table style="width:100%;border-collapse:collapse;margin:12px 0">$&</table>')
      .replace(/^(?!<)((?!\n).+)$/gm, '<p style="margin:4px 0;font-size:13px;color:#9898a8;line-height:1.6">$1</p>')
      .replace(/\n{2,}/g, "\n");
    return h;
  }, [md]);

  const dark = luma(brand.bg) < 0.45;
  const textCol = dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)";

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:S.base }}>
      <div style={{
        padding:"12px 16px", borderBottom:`1px solid ${S.border}`,
        display:"flex", alignItems:"center", gap:12, flexShrink:0,
      }}>
        <div style={{
          width:40, height:40, borderRadius:8,
          background:brand.bg, border:`1px solid ${S.border}`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          <span style={{ width:14, height:14, borderRadius:"50%", background:brand.accent }}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:S.fontHead, fontWeight:700, fontSize:15, color:S.text, letterSpacing:"-0.3px" }}>{brand.name}</div>
          <div style={{ fontSize:11, color:S.textTer, marginTop:1 }}>{brand.cat}</div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button
            onClick={() => setView(v => v==="raw" ? "rendered" : "raw")}
            style={{
              padding:"5px 10px", borderRadius:6, fontSize:11, cursor:"pointer",
              background:"transparent", border:`1px solid ${S.border}`,
              color:S.textSec, fontFamily:S.fontBody, fontWeight:500,
            }}
          >{view==="raw" ? "Preview" : "Raw"}</button>
          <button
            onClick={handleCopy}
            disabled={loading || !!err}
            style={{
              padding:"5px 10px", borderRadius:6, fontSize:11, cursor:loading||err?"not-allowed":"pointer",
              background: copied ? S.successBg : "transparent",
              border:`1px solid ${copied ? S.success : S.border}`,
              color: copied ? S.success : S.textSec,
              fontFamily:S.fontBody, fontWeight:500, transition:"all 150ms",
            }}
          >{copied ? "✓ Copied!" : "Copy"}</button>
          <button
            onClick={onClose}
            style={{
              width:28, height:28, borderRadius:6, cursor:"pointer",
              background:"transparent", border:`1px solid ${S.border}`,
              color:S.textTer, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >×</button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:20 }}>
        {loading && (
          <div style={{ display:"flex", gap:8, alignItems:"center", padding:"24px 0", color:S.textTer, fontSize:13, fontFamily:S.fontBody }}>
            <span style={{ display:"inline-block", width:14, height:14, border:`2px solid ${S.border}`, borderTopColor:S.accent, borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
            Loading DESIGN.md…
          </div>
        )}
        {err && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:16, fontSize:13, color:"#ef4444", fontFamily:S.fontBody }}>
            <strong>Fetch error:</strong> {err}
            <br/><span style={{ color:S.textSec, fontSize:11 }}>Check: {RAW}/{brand.id}/DESIGN.md</span>
          </div>
        )}
        {!loading && !err && md && view === "raw" && (
          <pre style={{
            margin:0, fontSize:12, lineHeight:1.65, color:"#c9d1d9",
            fontFamily:S.fontMono, whiteSpace:"pre-wrap", wordBreak:"break-word",
          }}>{md}</pre>
        )}
        {!loading && !err && md && view === "rendered" && (
          <div
            style={{ fontSize:13, lineHeight:1.6, color:S.textSec, fontFamily:S.fontBody }}
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function DesignMDBrowser() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => BRANDS.filter(b => {
    const matchCat = cat === "All" || b.cat === cat;
    const q = search.toLowerCase();
    const matchQ = !q || b.name.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q);
    return matchCat && matchQ;
  }), [search, cat]);

  const handleSelect = useCallback((brand) => {
    setSelected(s => s?.id === brand.id ? null : brand);
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:S.base, color:S.text, fontFamily:S.fontBody, overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2a38;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#3a3a50}
        input::placeholder{color:#52525e}
        input:focus{outline:none;border-color:hsl(262,83%,68%)!important;box-shadow:0 0 0 2px hsla(262,83%,68%,0.15)}
      `}</style>

      <header style={{
        padding:"14px 20px", borderBottom:`1px solid ${S.border}`,
        display:"flex", alignItems:"center", gap:16, flexShrink:0,
        background:S.raised,
      }}>
        <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
          <span style={{ fontFamily:S.fontHead, fontWeight:700, fontSize:16, color:S.text, letterSpacing:"-0.4px" }}>
            awesome-design-md
          </span>
          <span style={{ fontSize:11, color:S.textTer }}>{BRANDS.length} design systems</span>
        </div>
        <div style={{ flex:1, maxWidth:340 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brands, categories, aesthetics…"
            style={{
              width:"100%", padding:"7px 12px",
              background:S.base, border:`1px solid ${S.border}`,
              borderRadius:6, color:S.text, fontSize:13, transition:"border-color 150ms, box-shadow 150ms",
            }}
          />
        </div>
        <span style={{
          fontSize:11, color:S.textTer, marginLeft:"auto",
          fontFamily:S.fontMono,
        }}>
          {filtered.length} / {BRANDS.length}
        </span>
      </header>

      <div style={{
        display:"flex", gap:6, padding:"10px 20px",
        borderBottom:`1px solid ${S.border}`, flexWrap:"wrap", flexShrink:0,
        background:S.base,
      }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding:"3px 11px", borderRadius:99, fontSize:11, cursor:"pointer",
            border:`1px solid ${cat===c ? S.accent : S.border}`,
            background: cat===c ? "hsla(262,60%,45%,0.2)" : "transparent",
            color: cat===c ? S.accent : S.textSec,
            fontFamily:S.fontBody, fontWeight:500, letterSpacing:"0.02em",
            transition:"all 120ms",
          }}>{c}</button>
        ))}
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{
          flex: selected ? "0 0 380px" : "1",
          overflowY:"auto", padding:16,
          borderRight: selected ? `1px solid ${S.border}` : "none",
          transition:"flex 200ms ease",
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"40px 0", textAlign:"center", color:S.textTer, fontSize:13 }}>
              No matches for "{search}"
            </div>
          ) : (
            <div style={{
              display:"grid",
              gridTemplateColumns: selected
                ? "repeat(auto-fill, minmax(170px, 1fr))"
                : "repeat(auto-fill, minmax(200px, 1fr))",
              gap:10,
            }}>
              {filtered.map(b => (
                <BrandCard
                  key={b.id}
                  brand={b}
                  selected={selected?.id === b.id}
                  onClick={() => handleSelect(b)}
                />
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div style={{ flex:1, overflow:"hidden" }}>
            <Viewer brand={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
