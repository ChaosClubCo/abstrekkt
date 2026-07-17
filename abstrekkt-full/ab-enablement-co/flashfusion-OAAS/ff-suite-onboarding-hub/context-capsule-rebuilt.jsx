import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .btn:hover{filter:brightness(1.12);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
  textarea:focus,input:focus{outline:none!important;border-color:#6366f155!important;box-shadow:0 0 0 2px #6366f111}
  .field-card:hover{border-color:#1e293b!important}
  .tag-pill:hover{background:#1e293b!important;color:#94a3b8!important}
`;

// ── SESSION SEED ─────────────────────────────────────────────────────────────
const SESSION_SEED = {
  meta: {
    sessionTitle: "FlashFusion Design System + UI Artifact Sprint — May 2026",
    sourceProject: "FlashFusion / Kyle Rosebrook — Claude Design & UI Project",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
  },

  built: [
    {
      id: "b1",
      name: "FlashFusionHero.jsx",
      type: "component",
      file: "FlashFusionHero.jsx",
      description: "WebGL2 fragment-shader hero. Four layered electricity treatments: gated lightning bolts with procedural branching, domain-warped flow-field wave (FF palette), plasma contour tracing (dual counter-flowing bands), mesh gradient backdrop + particle spark field. Parallax: scroll (0.3 strength, UV.y) + mouse warp (0.04) — both shader-side, no DOM shifts. DPR capped at 2, render scale 0.85x (~70% pixel count). IntersectionObserver pauses RAF offscreen. prefers-reduced-motion → CSS gradient fallback. Single fullscreen triangle (3 vertices). Benchmarked: ~120fps M1 Air, ~55fps Intel UHD 620, ~60fps iPhone 13.",
      status: "shipped",
    },
    {
      id: "b2",
      name: "standalone.html",
      type: "embed",
      file: "standalone.html (234 lines)",
      description: "Portable WordPress / iframe embed version of the FF Hero. Drop-in for Custom HTML block (no wrappers needed), full-page iframe, or any host that can't run React. Fully self-contained — fonts, styles, shader, animation loop.",
      status: "shipped",
    },
    {
      id: "b3",
      name: "wix-velo-element.js",
      type: "custom-element",
      file: "wix-velo-element.js (266 lines)",
      description: "Wix Custom Element via Velo Dev Mode. Tag: flashfusion-hero. Source: public/flashfusion-hero.js. Handles Velo iframe sandboxing + WebGL2 fallback. Known blocker: provision API may return 500 on Dev Mode enable — retry in separate session. Parent section needs overflow:hidden.",
      status: "shipped",
    },
    {
      id: "b4",
      name: "fonts-selfhosted.css",
      type: "asset",
      file: "fonts-selfhosted.css",
      description: "Self-hosted font declarations for FF stack: Poppins (display), Inter (body), JetBrains Mono (code/labels). Drop-in replacement for Google Fonts CDN when CSP blocks external font loads.",
      status: "shipped",
    },
    {
      id: "b5",
      name: "flashfusion-colors.md",
      type: "design-token",
      file: "flashfusion-colors.md",
      description: "Canonical FF color token system. 11 core tokens: --ff-void (#0A0A0F) through --ff-text-muted (#94A3B8). 4 semantic tokens (success/warning/danger/info). Gradient treatments, shadow/glow recipes, usage rules, anti-patterns. Source of truth for all FF UI work. No pure white (#FFFFFF) in palette.",
      status: "shipped",
    },
    {
      id: "b6",
      name: "README.md — Hero Integration Guide",
      type: "docs",
      file: "README.md",
      description: "Full integration guide for all 3 deployment targets. React/Next.js (with App Router 'use client' note), WordPress (Block editor + full-page iframe paths), Wix (Dev Mode step-by-step with known blockers). Design token table. Performance notes. A11y compliance notes.",
      status: "shipped",
    },
    {
      id: "b7",
      name: "project-evolution.jsx",
      type: "artifact",
      file: "project-evolution.jsx (304 lines)",
      description: "Interactive project timeline component. 7 phases: Foundation (Pre-2025), INT Lane (Late 2025), Personal Brand (Late 2025–Early 2026), Flash-n-Frame (shelved Mar 2026), FlashFusion Ecosystem (Early–Mid 2026), Orchestrator AI (Mar–Apr 2026), chaosclub.co (Apr 2026–Present). Each phase: color, tagline, summary, projects, throughline. Click to expand. Georgia serif editorial aesthetic (intentionally different from FF glass palette).",
      status: "shipped",
    },
    {
      id: "b8",
      name: "flashfusion-growth-os.jsx",
      type: "artifact",
      file: "flashfusion-growth-os.jsx (480 lines)",
      description: "Radial ring strategy chart for FlashFusion, May 2026. 5 rings: Target Market, Personas (Flash/Fusion/INT), Insights, Impact, Distribution. Status codes: good/moderate/poor/critical with color-coded fills. Click-to-expand segment detail panel. Real strategic data: solo operators primary, no paid acquisition, WF-05 gap blocking market signals, Wix store shipping blocked by API bug.",
      status: "shipped",
    },
    {
      id: "b9",
      name: "tangled_words.jsx",
      type: "artifact",
      file: "tangled_words.jsx (400 lines)",
      description: "Connections-style word puzzle game. 16 words, 4 hidden categories, 2 decoy words. Categories: Whiskey varieties, Types of bread, ___ tape, Iconic Scottish things. Tone system: amber/wheat/sage/plum. Shuffle, lives tracking, solve animation, trophy/skull end states.",
      status: "shipped",
    },
    {
      id: "b10",
      name: "build-sheets-5-10.html",
      type: "content",
      file: "build-sheets-5-10.html (1103 lines)",
      description: "Build Sheets — Systems 05–10. Reference docs for the publishing ladder. Instrument Serif + IBM Plex Sans/Mono type stack. Amber/zinc dark palette. Structured build reference format.",
      status: "shipped",
    },
    {
      id: "b11",
      name: "flashfusion-style-guide.html",
      type: "docs",
      file: "flashfusion-style-guide.html (1002 lines)",
      description: "Full FF design system style guide as standalone HTML. Covers: color tokens, typography scale, component patterns, glassmorphism treatment, spacing system.",
      status: "shipped",
    },
    {
      id: "b12",
      name: "holographic-hero.html",
      type: "artifact",
      file: "holographic-hero.html (434 lines)",
      description: "Holographic hero variant — standalone HTML. Different visual treatment from WebGL2 shader hero. Exploratory direction.",
      status: "shipped",
    },
    {
      id: "b13",
      name: "skill-browser.html",
      type: "tool",
      file: "skill-browser.html (236 lines)",
      description: "Skill Browser — searchable/filterable view of Kyle's Claude skill library. FF palette (Poppins/Inter/JetBrains Mono). Lightweight standalone HTML.",
      status: "shipped",
    },
    {
      id: "b14",
      name: "knowledge-worker-reclassified.html",
      type: "content",
      file: "knowledge-worker-reclassified.html (854 lines)",
      description: "'The Knowledge Worker Isn't Being Replaced' — long-form article. Kyle's contrarian angle: the augmentor framing vs replacement narrative. Scope expansion > speed gains as the defensible positioning.",
      status: "shipped",
    },
    {
      id: "b15",
      name: "productivity-diagnostic.html",
      type: "tool",
      file: "productivity-diagnostic.html (877 lines)",
      description: "'Productivity Diagnostic — Pick Your Operating System' — interactive decision tool. Helps users identify which AI productivity system matches their work pattern.",
      status: "shipped",
    },
    {
      id: "b16",
      name: "productivity-systems.html",
      type: "content",
      file: "productivity-systems.html (928 lines)",
      description: "'AI-Augmented Productivity Systems — Comparison' — structured comparison of AI productivity approaches.",
      status: "shipped",
    },
    {
      id: "b17",
      name: "the-u-curve-nobody-is-talking-about.html",
      type: "content",
      file: "the-u-curve-nobody-is-talking-about.html (414 lines)",
      description: "'The U-Curve Nobody's Talking About' — essay by Kyle Rosebrook. Contrarian take on AI adoption curve and what happens to knowledge workers at inflection.",
      status: "shipped",
    },
  ],

  decisions: [
    {
      id: "d1",
      decision: "Three-target deployment architecture for FF Hero (React + standalone HTML + Wix Velo)",
      rationale: "Each target serves a real integration path: React for chaosclub.co / FF admin UIs, standalone for WordPress.com (Blog ID 253504189), Velo for the active Wix store (4cad8458). One shader, three wrappers = maximum reuse.",
      alternatives: "React-only and document manual extraction for other platforms",
    },
    {
      id: "d2",
      decision: "WebGL2 fragment shader over Canvas2D or CSS animation",
      rationale: "The four-layer treatment (lightning + flow wave + plasma + particle field) requires per-pixel math that Canvas2D can't do at 60fps. CSS animations can't approximate branching procedural lightning. WebGL2 is the only path to the visual quality bar.",
      alternatives: "Canvas2D (perf ceiling too low), Lottie (no procedural branching), CSS keyframes (static, no scroll-parallax shader)",
    },
    {
      id: "d3",
      decision: "Single fullscreen triangle over screen-aligned quad",
      rationale: "Triangle avoids the diagonal seam artifact on the quad's diagonal split, saves 1 vertex, and eliminates the wasted fragment corner overhead. No downside for a fullscreen pass.",
      alternatives: "Two-triangle quad (standard but wastes fragments at corners)",
    },
    {
      id: "d4",
      decision: "DPR capped at 2 + render scale 0.85x",
      rationale: "~70% pixel count vs native. Barely perceptible quality difference on shader output; meaningful fps gain on Intel/mobile. M1 doesn't need it but Intel UHD 620 goes from ~40fps to ~55fps with the combined cap.",
      alternatives: "Native DPR (too expensive on mid-range GPU), DPR cap only (still ~80% pixels)",
    },
    {
      id: "d5",
      decision: "prefers-reduced-motion → static CSS gradient fallback (no shader compile)",
      rationale: "Accessibility requirement. Compiling the shader program itself (not just animation) causes a visible CPU spike that violates the spirit of reduced-motion. Full bypass is cleaner than a 'static first frame' approach.",
      alternatives: "Compile shader, disable RAF (still uses GPU memory), CSS static gradient only",
    },
    {
      id: "d6",
      decision: "FF color palette locks no pure white (#FFFFFF)",
      rationale: "Pure white on --ff-void creates 21:1 contrast that reads as 'undesigned' and breaks the dark-glass aesthetic. --ff-text (#F8FAFC, 19:1) and --ff-bright (#E0E7FF, 16.8:1) satisfy WCAG AAA while maintaining palette cohesion.",
      alternatives: "Allow #FFFFFF for emphasis (rejected: blows out the dark aesthetic, anti-pattern documented)",
    },
    {
      id: "d7",
      decision: "project-evolution.jsx uses Georgia serif (not FF palette)",
      rationale: "Editorial / memoir aesthetic intentional — this component represents Kyle's personal narrative arc, not FlashFusion product UI. Georgia gives it a magazine/longform feel that differentiates it from the glassmorphism product work.",
      alternatives: "FF palette with Poppins (would make it look like another product UI — wrong register)",
    },
    {
      id: "d8",
      decision: "Growth OS as radial ring chart (not flat table/bar chart)",
      rationale: "The ring structure maps directly to the mental model: markets → personas → signals → impact → distribution as concentric layers of the same business. Reading outward = reading downstream consequences. A flat chart loses the layered dependency logic.",
      alternatives: "Table view (loses the concentric relationship), bar chart (same problem), spider chart (harder to read segment counts per ring)",
    },
    {
      id: "d9",
      decision: "Two versions of project_evolution exist (project-evolution.jsx + project_evolution.jsx)",
      rationale: "Naming inconsistency — likely an iterative session where the newer one (304 lines, hyphen) is canonical. The older (235 lines, underscore) is an earlier draft. NOT a deliberate fork.",
      alternatives: "N/A — this is debt, not a decision. Consolidate: keep project-evolution.jsx, delete project_evolution.jsx.",
    },
    {
      id: "d10",
      decision: "Content articles use self-contained HTML (not React components)",
      rationale: "Articles (knowledge-worker, u-curve, productivity-systems) are publishing targets for kylerosebrook.com (WordPress) and future LinkedIn / newsletter repurposing. Standalone HTML = no build step, paste-into-WP-block, no React dependency.",
      alternatives: "React components (adds build step, harder to paste into WordPress custom HTML blocks)",
    },
  ],

  openThreads: [
    {
      id: "t1",
      thread: "project_evolution.jsx consolidation",
      priority: "low",
      context: "Two files exist: project-evolution.jsx (304 lines, newer, canonical) and project_evolution.jsx (235 lines, underscore naming, earlier draft). Creates confusion in project knowledge.",
      nextAction: "Delete project_evolution.jsx. Verify project-evolution.jsx is the version used everywhere.",
    },
    {
      id: "t2",
      thread: "chaosclub.co — OAuth consent screen blocker",
      priority: "high",
      context: "Legacy Google Cloud project blocking OAuth consent screen approval for chaosclub.co. Platform architecture complete (React 19 + Firebase + Cloudflare R2 + Gemini + Stripe). 100+ lyrics ready. This is the last unlock before go-live.",
      nextAction: "Migrate to new Google Cloud project or resolve legacy consent screen review. Check Firebase console for any pending verification requirements.",
    },
    {
      id: "t3",
      thread: "Wix store — 3 API-blocked manual steps",
      priority: "medium",
      context: "FlashFusion Wix store (4cad8458, ~20 products). Three steps blocked by Wix API limitations: Velo Dev Mode provision 500 error, shipping rate API, click tracking endpoint doesn't exist. Store is otherwise live.",
      nextAction: "Retry Velo Dev Mode provision in fresh session. For click tracking: use Wix Ascend or GTM injection workaround instead of API endpoint. Document shipping API limitation for workaround path.",
    },
    {
      id: "t4",
      thread: "n8n WF-05 Morning Briefing — Priority 1",
      priority: "high",
      context: "4/9 n8n workflows active. WF-05 is the morning briefing/market signals workflow — the gap that leaves Market Signals at 'poor' status in the Growth OS. Without it, Kyle has no structured competitive or trend monitoring loop.",
      nextAction: "Build WF-05. Inputs: web search, Ahrefs MCP, RSS. Output: daily digest to Slack/email. Estimated: 2-3 hour build.",
    },
    {
      id: "t5",
      thread: "First client acquisition — Sole Revival + CSTMPRNT",
      priority: "high",
      context: "Sole Customizer demo (Base44 app 6990d794) is demo-ready. Sequencing: Sole Revival first (warm intro), CSTMPRNT simultaneous. FlashFusion hybrid pricing decided: $99–149/mo base + per-AI-action fee. Nothing booked yet.",
      nextAction: "Send Sole Revival outreach. Schedule demo. Prepare CSTMPRNT simultaneous pitch deck.",
    },
    {
      id: "t6",
      thread: "Content / social publishing cadence — Critical gap",
      priority: "high",
      context: "Skills built for content (generating-social-posts, drafting-multi-format-content). Multiple articles shipped (knowledge-worker, u-curve, productivity-systems, productivity-diagnostic). Zero publishing cadence established. Audience growth flagged Critical across all channels.",
      nextAction: "Define minimum cadence: 2x LinkedIn/week + 1x newsletter/week. Activate The Prompt (Substack + email). Use finished HTML articles as source material for first 4 posts.",
    },
    {
      id: "t7",
      thread: "n8n WF-06–09 — Multi-OAuth MCP blocker",
      priority: "medium",
      context: "WF-06–09 blocked by multi-OAuth MCP limitation. 7 inactive OAI workflows also need HTTP wiring (IDs: JErzPwjEoqxgMRUR, iRYUUgbGXoILsNK4, kLeTXNrAb3NHAmu4, Nxbib8ZjIqBjl27b, 4v2bcTMOuY6oG0F4, otATfw4PYkkMOBGc, fk1RKSu2sBoYvOuL). 11 inactive workflows need Base44 Bearer creds.",
      nextAction: "Resolve multi-OAuth: check n8n credential isolation options per-workflow. Seed Base44 Bearer to unlock 11 workflows. Wire 7 OAI workflows via HTTP node.",
    },
    {
      id: "t8",
      thread: "holographic-hero.html — decision: use or archive",
      priority: "low",
      context: "Holographic hero variant exists (434 lines) as an exploratory direction alongside the WebGL2 shader hero. No documented use case. Creates confusion about which hero is canonical.",
      nextAction: "Decide: is this an alternate for a specific page (chaosclub.co vs FF landing vs WP blog)? If no assigned target in 2 weeks, archive.",
    },
    {
      id: "t9",
      thread: "Publishing ladder — workbook format sequence B→C→A",
      priority: "medium",
      context: "Format D disqualified. Active sequence: B→C→A. Build sheets 05-10 shipped. Content articles (u-curve, knowledge-worker, productivity systems) are pre-publishing-ladder assets that can feed it.",
      nextAction: "Map which articles align to which workbook format. Start Format B build.",
    },
  ],

  projectKnowledge: [
    {
      id: "k1",
      file: "flashfusion-colors.md",
      relevance: "high",
      keyInsights: "11 core tokens + 4 semantic tokens. No pure white. --ff-void (#0A0A0F) page bg, --ff-deep (#141328) elevated surface, --ff-primary (#8B5CF6) brand fill, --ff-electric (#06B6D4) accent. Shadow/glow recipes. Anti-patterns section prevents palette drift.",
      usedFor: "Source of truth for all FF UI components in this session and every future one. Copy tokens verbatim.",
    },
    {
      id: "k2",
      file: "FlashFusionHero.jsx",
      relevance: "high",
      keyInsights: "WebGL2 shader architecture: program compile, single-triangle draw, uniform injection (time/resolution/mouse/scroll). IntersectionObserver pattern for RAF pause. Context-loss handler. prefers-reduced-motion guard. These patterns are reusable for any future animated shader component.",
      usedFor: "Canonical WebGL2 pattern for FF. Reuse: extract shader utils to ff-webgl-utils.js if a second shader component is needed.",
    },
    {
      id: "k3",
      file: "project-evolution.jsx",
      relevance: "high",
      keyInsights: "7-phase project narrative. Canonical account of what was built and in what order. Flash-n-Frame explicitly shelved Mar 2026. Orchestrator AI is the most architecturally mature thing shipped. chaosclub.co described as 'where memoir voice + aesthetic + platform-building converge — this one feels different.'",
      usedFor: "Cold-start context for any Claude instance needing Kyle's project history. Primary source for About/bio content.",
    },
    {
      id: "k4",
      file: "flashfusion-growth-os.jsx",
      relevance: "high",
      keyInsights: "Growth OS May 2026 snapshot: solo operators/indie devs = primary market (good). Fusion/agency = undertouched (moderate). INT/MSP = nothing shipped (poor). Market Signals ring = poor (WF-05 gap). Revenue = opportunity-blocked not effort-blocked. Automation ROI = good. Distribution = critical (no organic content loop).",
      usedFor: "Current strategic state. Any business planning, prioritization, or investor-facing content should reference this.",
    },
    {
      id: "k5",
      file: "README.md (hero integration guide)",
      relevance: "medium",
      keyInsights: "WordPress integration: Custom HTML block, no wrappers, self-contained paste. Wix known blocker: 500 on Dev Mode provision — retry in new session. Next.js: needs 'use client' or dynamic import ssr:false. Performance benchmarks documented.",
      usedFor: "Deployment instructions for kylerosebrook.com (WP), chaosclub.co (React), Wix store (Velo).",
    },
    {
      id: "k6",
      file: "knowledge-worker-reclassified.html + the-u-curve-nobody-is-talking-about.html",
      relevance: "medium",
      keyInsights: "Two fully written articles representing Kyle's contrarian positioning: scope expansion > speed gains as the defensible AI productivity stance. Kyle's L1→senior-scope proof point is the concrete example. U-curve article addresses inflection dynamics. Both are publishing-ready.",
      usedFor: "First LinkedIn posts. Newsletter issue 1-2. Workbook Format B source material.",
    },
    {
      id: "k7",
      file: "productivity-diagnostic.html + productivity-systems.html",
      relevance: "medium",
      keyInsights: "Interactive diagnostic tool + comparison article. Together these form a mini-funnel: comparison article drives top of funnel, diagnostic converts to 'here's your system' → newsletter opt-in. Can be embedded in kylerosebrook.com.",
      usedFor: "Lead magnet / mini-funnel for The Prompt newsletter. WordPress embed.",
    },
  ],

  nextSessionPrimer: "",
  tags: [
    "flashfusion", "webgl2", "shader-hero", "design-tokens", "ff-palette",
    "wix-velo", "wordpress", "react", "chaosclub", "project-evolution",
    "growth-os", "radial-chart", "content-publishing", "kyle-rosebrook",
    "skill-browser", "tangled-words", "build-sheets", "publishing-ladder",
    "context-capsule", "three-layer-brand"
  ],
};

// ── COMPONENTS ──────────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1e293b", color:"#475569", fontFamily:"'Space Mono',monospace" }}>{count}</span>
      )}
    </div>
  );
}

function PriorityBadge({ p }) {
  const c = p==="high"?"#ef4444":p==="medium"?"#f59e0b":"#22d3ee";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}44`, fontFamily:"'Space Mono',monospace" }}>{p}</span>;
}

function StatusBadge({ s }) {
  const c = s==="shipped"?"#10b981":s==="in-progress"?"#22d3ee":"#6366f1";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, fontFamily:"'Space Mono',monospace" }}>{s}</span>;
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="" }) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
        padding:"8px 10px", color:"#94a3b8", fontSize:12, lineHeight:1.6, resize:"vertical",
        fontFamily:mono?"'Space Mono',monospace":"'Syne',sans-serif", transition:"border-color .2s" }}
    />
  );
}

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function ContextCapsule() {
  const [capsule, setCapsule] = useState(SESSION_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);

  function update(path, value) {
    setCapsule(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
      obj[keys[keys.length-1]] = value;
      return next;
    });
  }

  function updateArrayItem(arr, id, field, value) {
    setCapsule(prev => ({
      ...prev,
      [arr]: prev[arr].map(item => item.id===id ? {...item,[field]:value} : item)
    }));
  }

  function addItem(arr, template) {
    setCapsule(prev => ({ ...prev, [arr]: [...prev[arr], { ...template, id: arr[0]+Date.now() }] }));
  }

  function removeItem(arr, id) {
    setCapsule(prev => ({ ...prev, [arr]: prev[arr].filter(i=>i.id!==id) }));
  }

  function addTag(tag) {
    if (tag && !capsule.tags.includes(tag))
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  }

  function removeTag(tag) {
    setCapsule(prev => ({ ...prev, tags: prev.tags.filter(t=>t!==tag) }));
  }

  async function generatePrimer() {
    setGeneratingPrimer(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:
            `You are writing a cold-start primer for the NEXT Claude instance that will receive this session handoff.

Write a dense, efficient 150-200 word primer that:
1. Establishes what was built and the current state
2. Flags the most important open thread to execute first
3. Lists 3 specific things Claude should do proactively in the new session
4. Notes any key constraints or decisions NOT to re-litigate

Session built: ${capsule.built.map(b=>b.name+": "+b.description).join(" | ")}
Key decisions: ${capsule.decisions.map(d=>d.decision).join(" | ")}
Top open threads: ${capsule.openThreads.filter(t=>t.priority==="high").map(t=>t.thread+": "+t.context).join(" | ")}
Tags: ${capsule.tags.join(", ")}

Write as a direct instruction to the next Claude instance. Terse, no filler.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch {
      update("nextSessionPrimer", "Failed to generate — write manually.");
    }
    setGeneratingPrimer(false);
  }

  function exportJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `context-capsule-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(()=>setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" } };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const NAV = [
    { id:"overview",   label:"Overview",          icon:"◈" },
    { id:"built",      label:"Built",             icon:"📦", count: capsule.built.length },
    { id:"decisions",  label:"Decisions",         icon:"⚖️", count: capsule.decisions.length },
    { id:"threads",    label:"Open Threads",      icon:"🧵", count: capsule.openThreads.length },
    { id:"knowledge",  label:"Project Knowledge", icon:"📚", count: capsule.projectKnowledge.length },
    { id:"primer",     label:"Next Session",      icon:"🚀" },
    { id:"export",     label:"Export",            icon:"⬇" },
  ];

  const completeness = [
    capsule.meta.sessionTitle,
    capsule.meta.destinationProject,
    capsule.built.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    capsule.nextSessionPrimer,
  ].filter(Boolean).length;

  const pct = Math.round((completeness / 6) * 100);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#020817", fontFamily:"'Syne',sans-serif", color:"#e2e8f0",
        display:"flex", flexDirection:"column",
        backgroundImage:"radial-gradient(#0d1525 1px, transparent 1px)", backgroundSize:"24px 24px" }}>

        {/* Top Bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1a2744", background:"#030912cc",
          backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:100,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#6366f1", fontFamily:"'Space Mono',monospace", flexShrink:0 }}>◈ CAPSULE</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {capsule.meta.sessionTitle || "Untitled Session"}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:80, height:3, background:"#1e293b", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:pct===100?"#10b981":"#6366f1", borderRadius:2, transition:"width .4s ease" }}/>
            </div>
            <span style={{ fontSize:10, color:pct===100?"#10b981":"#475569", fontFamily:"'Space Mono',monospace" }}>{pct}%</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn" onClick={copyJSON}
              style={{ background:"transparent", border:"1px solid #1e293b", borderRadius:7, padding:"6px 12px", color:copied?"#10b981":"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
              {copied ? "✓ copied" : "⎘ copy"}
            </button>
            <button className="btn" onClick={exportJSON}
              style={{ background:exported?"#10b98122":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:7, padding:"6px 14px", color:exported?"#10b981":"#fff", cursor:"pointer", fontSize:11, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
              {exported ? "✓ exported" : "⬇ Export JSON"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Sidebar */}
          <div style={{ width:188, flexShrink:0, borderRight:"1px solid #0d1525", padding:"16px 12px", display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={()=>setActiveSection(n.id)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8,
                background: activeSection===n.id ? "#1e293b" : "transparent",
                border:`1px solid ${activeSection===n.id?"#6366f133":"transparent"}`,
                color: activeSection===n.id ? "#e2e8f0" : "#475569",
                cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                fontWeight: activeSection===n.id ? 600 : 400, transition:"all .15s", textAlign:"left"
              }}>
                <span style={{ fontSize:13 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                {n.count !== undefined && <span style={{ fontSize:9, color:"#334155", fontFamily:"'Space Mono',monospace" }}>{n.count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflow:"auto", padding:"24px 28px", animation:"fadeUp .3s ease" }}>

            {/* OVERVIEW */}
            {activeSection==="overview" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="◈" label="Session Overview"/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"SESSION TITLE", key:"meta.sessionTitle" },
                    { label:"SOURCE PROJECT", key:"meta.sourceProject" },
                    { label:"DESTINATION PROJECT", key:"meta.destinationProject", placeholder:"Where this capsule travels next →" },
                  ].map(f => (
                    <div key={f.key} className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                      <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:8 }}>{f.label}</label>
                      <input value={f.key.split(".").reduce((o,k)=>o[k], capsule)} onChange={e=>update(f.key, e.target.value)}
                        placeholder={f.placeholder || ""}
                        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"8px 10px", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", transition:"border-color .2s" }}
                      />
                    </div>
                  ))}

                  {/* Stats row */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {[
                      { label:"ARTIFACTS", val: capsule.built.length },
                      { label:"DECISIONS", val: capsule.decisions.length },
                      { label:"OPEN THREADS", val: capsule.openThreads.length },
                      { label:"KB FILES", val: capsule.projectKnowledge.length },
                    ].map(s => (
                      <div key={s.label} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:8, padding:"12px", textAlign:"center" }}>
                        <div style={{ fontSize:22, fontWeight:800, color:"#6366f1", fontFamily:"'Space Mono',monospace" }}>{s.val}</div>
                        <div style={{ fontSize:9, color:"#334155", letterSpacing:1, marginTop:4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                    <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:10 }}>TAGS</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                      {capsule.tags.map(tag => (
                        <span key={tag} className="tag-pill" onClick={()=>removeTag(tag)} title="click to remove"
                          style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"#1a2744", color:"#64748b", cursor:"pointer", border:"1px solid #1e293b", transition:"all .15s" }}>
                          #{tag} ×
                        </span>
                      ))}
                    </div>
                    <input placeholder="Add tag + Enter" onKeyDown={e=>{ if(e.key==="Enter"){ addTag(e.target.value.trim().replace(/\s+/g,"-").toLowerCase()); e.target.value=""; }}}
                      style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"6px 10px", color:"#64748b", fontSize:12, fontFamily:"'Space Mono',monospace", width:160 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BUILT */}
            {activeSection==="built" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="📦" label="What Was Built" count={capsule.built.length}/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.built.map(item => (
                    <div key={item.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={item.name} onChange={e=>updateArrayItem("built",item.id,"name",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:700 }}/>
                        <StatusBadge s={item.status}/>
                        <button onClick={()=>removeItem("built",item.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>TYPE</div>
                          <input value={item.type} onChange={e=>updateArrayItem("built",item.id,"type",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                        <div style={{ flex:2 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>FILE / ARTIFACT</div>
                          <input value={item.file} onChange={e=>updateArrayItem("built",item.id,"file",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>DESCRIPTION</div>
                      <EditableText value={item.description} rows={3} onChange={v=>updateArrayItem("built",item.id,"description",v)}/>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("built",{ name:"New Item", type:"artifact", file:"", description:"", status:"in-progress" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add item
                  </button>
                </div>
              </div>
            )}

            {/* DECISIONS */}
            {activeSection==="decisions" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="⚖️" label="Key Decisions" count={capsule.decisions.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Locked. Don't re-litigate in the next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.decisions.map(d => (
                    <div key={d.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:"3px solid #6366f1", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                        <input value={d.decision} onChange={e=>updateArrayItem("decisions",d.id,"decision",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <button onClick={()=>removeItem("decisions",d.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14, flexShrink:0 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>RATIONALE</div>
                          <EditableText value={d.rationale} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#f59e0b", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>ALTERNATIVES CONSIDERED</div>
                          <EditableText value={d.alternatives} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("decisions",{ decision:"New Decision", rationale:"", alternatives:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add decision
                  </button>
                </div>
              </div>
            )}

            {/* THREADS */}
            {activeSection==="threads" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="🧵" label="Open Threads" count={capsule.openThreads.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Sorted by priority. High = execute first in next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[...capsule.openThreads].sort((a,b)=>{ const o={high:0,medium:1,low:2}; return o[a.priority]-o[b.priority]; }).map(t => (
                    <div key={t.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:`3px solid ${t.priority==="high"?"#ef4444":t.priority==="medium"?"#f59e0b":"#22d3ee"}`, borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={t.thread} onChange={e=>updateArrayItem("openThreads",t.id,"thread",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <PriorityBadge p={t.priority}/>
                        <button onClick={()=>removeItem("openThreads",t.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>CONTEXT</div>
                          <EditableText value={t.context} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#22d3ee", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>NEXT ACTION</div>
                          <EditableText value={t.nextAction} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("openThreads",{ thread:"New Thread", priority:"medium", context:"", nextAction:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add thread
                  </button>
                </div>
              </div>
            )}

            {/* PROJECT KNOWLEDGE */}
            {activeSection==="knowledge" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="📚" label="Project Knowledge Used" count={capsule.projectKnowledge.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Which project files carry the most leverage. Pull these first in the next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.projectKnowledge.map(k => (
                    <div key={k.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={k.file} onChange={e=>updateArrayItem("projectKnowledge",k.id,"file",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#94a3b8", fontSize:12, fontFamily:"'Space Mono',monospace" }}/>
                        <select value={k.relevance} onChange={e=>updateArrayItem("projectKnowledge",k.id,"relevance",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <button onClick={()=>removeItem("projectKnowledge",k.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>KEY INSIGHTS</div>
                          <EditableText value={k.keyInsights} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#6366f1", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>USED FOR</div>
                          <EditableText value={k.usedFor} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("projectKnowledge",{ file:"", relevance:"medium", keyInsights:"", usedFor:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add file
                  </button>
                </div>
              </div>
            )}

            {/* PRIMER */}
            {activeSection==="primer" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="🚀" label="Next Session Primer"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  Dense cold-start message for the next Claude instance. Paste as first message in the new project.
                </div>
                <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px" }}>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"24px 0" }}>
                      <div style={{ color:"#334155", fontSize:13, marginBottom:16 }}>No primer yet.</div>
                      <button className="btn" onClick={generatePrimer}
                        style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", cursor:"pointer", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
                        ✨ Generate AI Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 0", color:"#6366f1", fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                      <div style={{ width:14, height:14, border:"2px solid #6366f133", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                      Synthesizing session context...
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:8, display:"flex", justifyContent:"space-between" }}>
                        <span>PRIMER TEXT {primerGenerated && <span style={{ color:"#10b981" }}>· AI GENERATED</span>}</span>
                        <button className="btn" onClick={generatePrimer} style={{ background:"transparent", border:"none", color:"#6366f1", cursor:"pointer", fontSize:10, fontFamily:"'Space Mono',monospace" }}>↺ regenerate</button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} rows={10} onChange={v=>update("nextSessionPrimer",v)}/>
                      <button className="btn" onClick={()=>{ navigator.clipboard.writeText(capsule.nextSessionPrimer); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ marginTop:10, background:"transparent", border:"1px solid #1e293b", borderRadius:6, padding:"6px 14px", color:"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                        {copied?"✓ copied":"⎘ copy primer text"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* EXPORT */}
            {activeSection==="export" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬇" label="Export Capsule"/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"JSON File", desc:"Full structured capsule. Import back into this tool or feed to Claude API / Flash-n-Frame.", action: exportJSON, btn: exported?"✓ Exported":"⬇ Download JSON", color:"linear-gradient(135deg,#1d4ed8,#0ea5e9)" },
                    { label:"Copy to Clipboard", desc:"Paste directly into next Claude session as context. Combine with primer text for best cold-start.", action: copyJSON, btn: copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
                  ].map(opt => (
                    <div key={opt.label} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#475569", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action}
                        style={{ background:opt.color, border:"none", borderRadius:8, padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700, flexShrink:0, transition:"all .2s" }}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Migration checklist */}
                  <div style={{ background:"#031a0f", border:"1px solid #10b98133", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:10 }}>MIGRATION CHECKLIST</div>
                    {[
                      ["Session title filled in",           !!capsule.meta.sessionTitle],
                      ["Destination project named",         !!capsule.meta.destinationProject],
                      ["All built artifacts documented",    capsule.built.length > 0],
                      ["Key decisions recorded",            capsule.decisions.length > 0],
                      ["Open threads prioritized",          capsule.openThreads.length > 0],
                      ["Primer generated and copied",       !!capsule.nextSessionPrimer],
                      ["JSON exported",                     exported],
                    ].map(([label, done]) => (
                      <div key={label} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                        <span style={{ color:done?"#10b981":"#1e293b", fontSize:12 }}>{done?"✓":"○"}</span>
                        <span style={{ color:done?"#6ee7b7":"#334155", fontSize:12 }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Schema preview */}
                  <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:10, letterSpacing:1 }}>JSON SCHEMA</div>
                    <pre style={{ color:"#475569", fontSize:11, lineHeight:1.6, fontFamily:"'Space Mono',monospace", overflow:"auto" }}>{
`{
  "meta": { sessionTitle, sourceProject, destinationProject, date },
  "built": [{ name, type, file, description, status }],
  "decisions": [{ decision, rationale, alternatives }],
  "openThreads": [{ thread, priority, context, nextAction }],
  "projectKnowledge": [{ file, relevance, keyInsights, usedFor }],
  "nextSessionPrimer": "...",
  "tags": []
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
