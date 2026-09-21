import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#07100e}
  ::-webkit-scrollbar-thumb{background:#0f2923;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  .btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
  .btn:active{transform:translateY(0)}
  .field-card:hover{border-color:#0f3028!important}
  .nav-btn:hover{background:#0a1f1a!important;color:#5eead4!important}
  textarea:focus,input:focus{outline:none!important;border-color:#0d9488!important;box-shadow:0 0 0 2px #0d948818}
  .tag-pill:hover{background:#0f2923!important;color:#5eead4!important}
`;

// ── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  live:       { bg:"#052e16", text:"#4ade80", border:"#166534" },
  pilot:      { bg:"#042f2e", text:"#2dd4bf", border:"#0f766e" },
  deployed:   { bg:"#042f2e", text:"#34d399", border:"#065f46" },
  draft:      { bg:"#1c1917", text:"#a8a29e", border:"#292524" },
  spec:       { bg:"#1e1b4b", text:"#a5b4fc", border:"#3730a3" },
  unbuilt:    { bg:"#431407", text:"#fb923c", border:"#9a3412" },
  planning:   { bg:"#1c1917", text:"#78716c", border:"#292524" },
  created:    { bg:"#082f49", text:"#38bdf8", border:"#0369a1" },
  reference:  { bg:"#0c0a09", text:"#57534e", border:"#1c1917" },
};

const PRIORITY_COLORS = {
  high:    { bg:"#450a0a", text:"#f87171", border:"#7f1d1d" },
  medium:  { bg:"#422006", text:"#fb923c", border:"#7c2d12" },
  low:     { bg:"#042f2e", text:"#5eead4", border:"#0f766e" },
};

const HORIZON_COLORS = {
  immediate: { bg:"#450a0a", text:"#fca5a5", border:"#7f1d1d" },
  near:      { bg:"#1a2e05", text:"#86efac", border:"#365314" },
  mid:       { bg:"#082f49", text:"#7dd3fc", border:"#075985" },
};

// ── SEED DATA ────────────────────────────────────────────────────────────────
const INT_SEED = {
  meta: {
    sessionTitle: "INT Inc. AI Platform Transformation — Live Context",
    sourceProject: "INT Inc. Claude Project",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
    owner: "Kyle Rosebrook — Staff Engineer (AppSec + Platform)",
    customInstructionsVersion: "v2.2 (deployed March 3, 2026)",
  },
  assets: [
    {
      id: "a1",
      name: "Newsletter System — 3-Tier Company-Wide",
      track: "Newsletter",
      status: "pilot",
      description: "Non-Tech / Tech Department / AI Team editions. Weekly cadence. 19 total editions from a single shared research corpus via n8n pipeline. Pilot phase active (Weeks 11–12): Information Security, Sales, Content as first three departments.",
      nextMilestone: "Week 16 — expand to 9 departments. Week 20 — full 16-department coverage.",
      blockers: "None — rollout is on schedule per pilot results.",
    },
    {
      id: "a2",
      name: "Platform Explorer v4.0",
      track: "Platform Explorer",
      status: "draft",
      description: "Single-file HTML (40KB), 16 AI platforms, 5 tabs, zero dependencies. Audited Jan 12, 2026: Master Audit 75/100 (C+), PWA Resilience 15/100 (F). Lacks state persistence, analytics, error handling, offline capability.",
      nextMilestone: "Superseded by v5.1 track — no further work planned on v4.",
      blockers: "None — deprecated in favor of v5.x.",
    },
    {
      id: "a3",
      name: "Platform Explorer v5.1",
      track: "Platform Explorer",
      status: "spec",
      description: "Spec refreshed (Assets 3–6 update). v5.1 audited — production blockers identified. Estimated ~10 hours of fixes to reach production-ready. Strategic direction: pivot toward platform-agnostic enterprise navigator.",
      nextMilestone: "~10 hours of production hardening to ship v5.1.",
      blockers: "~10 hours unscheduled work. Must precede v6.0 build.",
    },
    {
      id: "a4",
      name: "AIaaS Dashboard Generator",
      track: "Dashboard",
      status: "unbuilt",
      description: "Fully specced executive decision support system. Defines TCO modeling, CPRA metrics, agentic governance framework. Previously blocked by context limits + parallel work. Blockers now resolved. Identified as HIGHEST-LEVERAGE unblocked asset.",
      nextMilestone: "Build. Spec is complete and ready to implement.",
      blockers: "None — all prior blockers (context limits, truncation) resolved.",
    },
    {
      id: "a5",
      name: "72-Persona Library",
      track: "Personas",
      status: "reference",
      description: "23 client-facing + 49 internal personas across 7 service lines + support functions. Recently refreshed with 3 new personas (Assets 3–6 update). Not validated against actual client interactions.",
      nextMilestone: "Validation against real client interaction data.",
      blockers: "No validation methodology defined yet.",
    },
    {
      id: "a6",
      name: "Prompt Engineering System v2.0",
      track: "Infrastructure",
      status: "created",
      description: "5 prompt templates with test suite code and CI/CD config files. R-I-S-E, F-L-O-W, 4-Agent validation pattern implemented. Created but NOT deployed — CI/CD not running, tests not confirmed in production.",
      nextMilestone: "Deploy CI/CD pipeline. Confirm tests run in production.",
      blockers: "Deployment not scheduled. Needs explicit work session.",
    },
    {
      id: "a7",
      name: "Custom Instructions v2.2",
      track: "Infrastructure",
      status: "deployed",
      description: "Deployed March 3, 2026. Security-first, analogy-driven, tool-aware protocols with 4-Agent validation pattern. Scope: INT Inc. only. Supersedes v2.1 (Feb 21, 2026). Next review: May 21, 2026.",
      nextMilestone: "Quarterly review May 21, 2026.",
      blockers: "None.",
    },
    {
      id: "a8",
      name: "Universal Dashboard Engine",
      track: "Dashboard",
      status: "planning",
      description: "22-week build timeline. Comprehensive roadmap exists (63KB document covering all 13 departments). ~$377K budget estimate. No implementation started.",
      nextMilestone: "Unblocked after AIaaS Dashboard Generator is built (proof of concept).",
      blockers: "Sequenced after AIaaS Dashboard Generator build.",
    },
    {
      id: "a9",
      name: "Platform Explorer v6.0 (concept)",
      track: "Platform Explorer",
      status: "spec",
      description: "Strategic pivot from Claude-only ecosystem navigator to platform-agnostic Enterprise Multi-Platform Edition. Longer-horizon build. Requires v5.1 production hardening as prerequisite.",
      nextMilestone: "Define spec after v5.1 ships.",
      blockers: "Blocked until v5.1 is production-ready.",
    },
    {
      id: "a10",
      name: "Customer-Facing Sales Infrastructure",
      track: "GTM",
      status: "unbuilt",
      description: "Gap identified: sales decks, service catalogs, ROI calculators, AI readiness assessment tools. Internal platform strength is strong — external revenue enablement is the bottleneck. Projected high ROI on relatively modest investment.",
      nextMilestone: "Build sales deck → service catalog → ROI calculator (in that order).",
      blockers: "Not yet prioritized into active sprint.",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "Platform-agnostic positioning over Claude-specialist positioning",
      rationale: "Enterprises need multi-platform guidance, not single-vendor advocacy. Claude-specialist = ceiling. Platform-agnostic = compounding moat. Compounds with every new enterprise AI entrant.",
      alternatives: "Double down on Claude expertise as primary differentiator.",
      locked: true,
    },
    {
      id: "d2",
      decision: "Newsletter: 3-department pilot before full 16-department rollout",
      rationale: "Pilot (InfoSec, Sales, Content) de-risks the n8n pipeline and department-specific prompt logic before scaling to all 16. Week 11-12 pilot → Week 16 at 9 depts → Week 20 full coverage.",
      alternatives: "Launch all 16 departments simultaneously.",
      locked: true,
    },
    {
      id: "d3",
      decision: "AIaaS Dashboard Generator = highest-leverage next build",
      rationale: "Fully specced, no blockers, highest ROI potential. Prior blockers (context limits, truncation) resolved. Every week it sits unbuilt is a missed revenue opportunity. Precedes Universal Dashboard Engine.",
      alternatives: "v5.1 Platform Explorer hardening first.",
      locked: false,
    },
    {
      id: "d4",
      decision: "Sales infrastructure gap = highest-priority strategic risk",
      rationale: "Internal platforms are strong. The bottleneck is converting internal capability into external revenue. Sales decks, service catalogs, ROI calculators are the missing conversion layer.",
      alternatives: "Continue building internal tooling before customer-facing assets.",
      locked: false,
    },
    {
      id: "d5",
      decision: "v5.1 hardening before v6.0 multi-platform enterprise build",
      rationale: "Cannot build v6.0 on a draft/spec foundation. v5.1 ~10-hour fix scope is defined and bounded. Sequence: v5.1 production → v6.0 spec → v6.0 build.",
      alternatives: "Greenfield v6.0 and deprecate v5.x entirely.",
      locked: true,
    },
    {
      id: "d6",
      decision: "Three revenue streams: 60% managed services / 20% SaaS / 20% partner channel",
      rationale: "Managed services provides stable base while SaaS and partner channels scale toward $12M ARR target over three years. Avoids over-dependence on any single stream.",
      alternatives: "Pure SaaS pivot; managed services as legacy wind-down.",
      locked: true,
    },
    {
      id: "d7",
      decision: "Prompts are production systems — versioned, tested, auditable",
      rationale: "Ad hoc prompts create technical debt identical to ad hoc code. Prompt Engineering System v2.0 establishes the framework. CI/CD pipeline ensures consistency across 72-persona library and newsletter system.",
      alternatives: "Treat prompts as ephemeral operational tools.",
      locked: true,
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "BUILD: AIaaS Dashboard Generator",
      priority: "high",
      horizon: "immediate",
      context: "Fully specced executive decision support system. TCO modeling, CPRA metrics, agentic governance. All prior blockers resolved (context limits, truncation). Identified as highest-leverage unblocked asset. Next build session should open here.",
      nextAction: "Open AIaaS Dashboard Generator spec. Build. No further planning needed.",
      owner: "Kyle",
    },
    {
      id: "t2",
      thread: "Platform Explorer v5.1 — production hardening",
      priority: "high",
      horizon: "immediate",
      context: "~10 hours of fixes identified from audit. Production blockers documented. Must ship before v6.0 work begins. Scope is bounded and well-defined — this is execution, not discovery.",
      nextAction: "Schedule 10-hour work block. Execute against identified blockers.",
      owner: "Kyle",
    },
    {
      id: "t3",
      thread: "HumanX Conference Prep (April 6–9)",
      priority: "high",
      horizon: "immediate",
      context: "Confirmed content gaps: multi-tenant isolation patterns, Gemini API capabilities (image gen, text-to-speech, video), Data Venue/InVelo content. Preparation materials and conference strategy not yet built. Hard deadline.",
      nextAction: "Identify specific sessions/tracks. Build prep materials for confirmed gaps.",
      owner: "Kyle",
    },
    {
      id: "t4",
      thread: "Customer-facing sales infrastructure build",
      priority: "high",
      horizon: "near",
      context: "Gap: sales decks, service catalogs, ROI calculators, AI readiness assessment tools. High ROI on modest investment. This is the revenue conversion layer — internal strength means nothing without it.",
      nextAction: "Build sales deck first. Then service catalog. Then ROI calculator.",
      owner: "Kyle",
    },
    {
      id: "t5",
      thread: "Newsletter rollout: pilot → full coverage",
      priority: "medium",
      horizon: "near",
      context: "Week 11-12: 3-dept pilot (InfoSec, Sales, Content). Week 16 target: 9 departments. Week 20 target: full 16-department coverage. n8n pipeline drives 19 editions from single research corpus.",
      nextAction: "Evaluate pilot results at Week 12. Confirm Week 16 expansion list.",
      owner: "Kyle",
    },
    {
      id: "t6",
      thread: "Prompt Engineering System — deploy CI/CD",
      priority: "medium",
      horizon: "near",
      context: "System created (5 templates, test suite, CI/CD config) but NOT deployed. Tests not confirmed running in production. Decision: prompts are production systems — this gap contradicts that principle.",
      nextAction: "Deploy CI/CD pipeline. Run test suite. Confirm production operation.",
      owner: "Kyle",
    },
    {
      id: "t7",
      thread: "Platform Explorer v6.0 — multi-platform enterprise edition",
      priority: "medium",
      horizon: "mid",
      context: "Strategic pivot from Claude-only to platform-agnostic enterprise navigator. Longer-horizon build. Blocked until v5.1 ships. Requires new spec post v5.1.",
      nextAction: "Blocked. Revisit after v5.1 ships.",
      owner: "Kyle",
    },
    {
      id: "t8",
      thread: "Skyflow data vault patterns + Gemini API implementation",
      priority: "medium",
      horizon: "mid",
      context: "Confirmed gaps: Skyflow data vault patterns and Gemini API implementation code (image generation, text-to-speech, video). Relevant for HumanX prep and enterprise AI consulting positioning.",
      nextAction: "Source or build. Skyflow first (compliance angle). Gemini second (HumanX gap).",
      owner: "Kyle",
    },
    {
      id: "t9",
      thread: "InVelo — pre-validation to launch",
      priority: "medium",
      horizon: "mid",
      context: "Currently in pre-validation stage. Moving toward launch. No specific blockers documented but validation criteria not yet defined.",
      nextAction: "Define validation criteria. Build validation test plan.",
      owner: "Kyle",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "Custom Instructions v2.1 / v2.2",
      type: "Custom Instructions",
      relevance: "high",
      keyInsights: "8-tier response framework. Security floor non-negotiable (ZDR, RBAC, RLS, prompt injection defense). Verified Deloitte stats (2026). Market sizing range $8.4B–$16.4B — cite source, never cherry-pick. INT Inc. holds no compliance certifications — flag before claiming in client materials. No production assets deployed for client-facing use.",
      usedFor: "Governs every Claude session. Auto-search project knowledge on 6 trigger patterns. Auto-flag stale data >60 days.",
    },
    {
      id: "k2",
      file: "n8n Newsletter Pipeline",
      type: "Pipeline Config",
      relevance: "high",
      keyInsights: "Single shared research corpus → 19 department-specific editions. Claude API for department-specific prompt generation. 16 departments + 3 company-wide tiers. Pilot: InfoSec, Sales, Content (Weeks 11-12).",
      usedFor: "Powers newsletter system. Expandable to full 16-dept coverage by Week 20.",
    },
    {
      id: "k3",
      file: "Newsletter System Reference Doc (refreshed)",
      type: "Reference Doc",
      relevance: "high",
      keyInsights: "19 total editions. 3-tier company-wide + 16-department editions. Pilot sequencing: 3 depts (W11-12) → 9 depts (W16) → 16 depts (W20). Refreshed as part of Assets 3-6 update.",
      usedFor: "Rollout planning and n8n pipeline configuration.",
    },
    {
      id: "k4",
      file: "AIaaS Dashboard Generator Spec v4.0",
      type: "Spec Doc",
      relevance: "high",
      keyInsights: "TCO modeling. CPRA metrics. Agentic governance framework. Executive decision support system. Fully specced — ready to build. No implementation exists. Identified as highest-leverage unblocked asset.",
      usedFor: "Blueprint for next build. Open immediately when starting Dashboard Generator session.",
    },
    {
      id: "k5",
      file: "Universal Dashboard Engine Roadmap (63KB)",
      type: "Roadmap",
      relevance: "medium",
      keyInsights: "13 departments, 10 phases, 22-week timeline, ~$377K budget estimate. No implementation started. Sequenced after AIaaS Dashboard Generator as proof-of-concept predecessor.",
      usedFor: "Long-range planning. Reference after Dashboard Generator ships.",
    },
    {
      id: "k6",
      file: "72-Persona Library (refreshed)",
      type: "Reference Doc",
      relevance: "medium",
      keyInsights: "23 client-facing + 49 internal personas. 7 service lines + support functions. 3 new personas added in Assets 3-6 refresh. Not validated against actual client interactions — flag when using in client materials.",
      usedFor: "Newsletter personalization, sales material targeting, prompt engineering system.",
    },
    {
      id: "k7",
      file: "Strategic Expansion Analysis",
      type: "Reference Doc",
      relevance: "medium",
      keyInsights: "5 opportunities: AI Compliance Automation, Cloud FinOps, Internal AI, Enterprise AI Consulting, Fractional CMO. Updated with 3 new opportunities (Assets 3-6). ROI projections are strategic models — unvalidated. Cite as estimates.",
      usedFor: "Sales positioning, GTM strategy, HumanX conference preparation.",
    },
    {
      id: "k8",
      file: "MCP Server Connections (25+)",
      type: "Pipeline Config",
      relevance: "medium",
      keyInsights: "Active: Atlassian, Cloudflare, Stripe, Canva, Notion, Sentry, Intercom, Zapier, Netlify, Figma, n8n, Linear, HubSpot, Vercel, Plaid, Monday.com, Playwright, Excalidraw, Context7, Gamma, Wix, AWS Marketplace, Hugging Face, Supabase, Close, Cloudinary, Fireflies, Stytch.",
      usedFor: "Integration orchestration. n8n as primary automation layer. Supabase for multi-tenant data.",
    },
  ],
  nextSessionPrimer: "",
  tags: ["int-inc", "msp-to-aipaas", "newsletter", "platform-explorer", "aiass-dashboard", "personas", "appsec", "n8n", "custom-instructions", "gtm-gap", "humanx-2026"],
};

// ── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Badge({ label, colors }) {
  return (
    <span style={{
      fontSize:9, padding:"2px 8px", borderRadius:20,
      background:colors.bg, color:colors.text, border:`1px solid ${colors.border}`,
      fontFamily:"'JetBrains Mono',monospace", letterSpacing:.5, flexShrink:0,
    }}>{label}</span>
  );
}

function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15, letterSpacing:-.3 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:9, padding:"2px 8px", borderRadius:20, background:"#0a1f1a", color:"#2dd4bf", fontFamily:"'JetBrains Mono',monospace", border:"1px solid #0f3028" }}>{count}</span>
      )}
    </div>
  );
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="" }) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{
        width:"100%", background:"#050e0c", border:"1px solid #0f2420", borderRadius:6,
        padding:"9px 11px", color:"#94a3b8", fontSize:12, lineHeight:1.65, resize:"vertical",
        fontFamily:mono?"'JetBrains Mono',monospace":"'Bricolage Grotesque',sans-serif",
        transition:"border-color .2s",
      }}
    />
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize:9, color:"#0d9488", fontFamily:"'JetBrains Mono',monospace", marginBottom:5, letterSpacing:1.2, textTransform:"uppercase" }}>
      {children}
    </div>
  );
}

function Card({ children, style={} }) {
  return (
    <div className="field-card" style={{
      background:"#060d0b", border:"1px solid #0a1f1a", borderRadius:10,
      padding:"18px 20px", transition:"border-color .2s", ...style,
    }}>
      {children}
    </div>
  );
}

function AddButton({ onClick, label="+ add" }) {
  return (
    <button className="btn" onClick={onClick} style={{
      background:"transparent", border:"1px dashed #0f3028", borderRadius:10,
      padding:"12px", color:"#1e4039", cursor:"pointer", fontSize:12,
      fontFamily:"'JetBrains Mono',monospace", transition:"all .2s", width:"100%",
    }}>{label}</button>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function INTContextCapsule() {
  const [capsule, setCapsule] = useState(INT_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);
  const [tagInput, setTagInput] = useState("");

  function update(path, value) {
    setCapsule(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateArrayItem(arr, id, field, value) {
    setCapsule(prev => ({
      ...prev,
      [arr]: prev[arr].map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  }

  function addItem(arr, template) {
    setCapsule(prev => ({ ...prev, [arr]: [...prev[arr], { ...template, id: arr[0] + Date.now() }] }));
  }

  function removeItem(arr, id) {
    setCapsule(prev => ({ ...prev, [arr]: prev[arr].filter(i => i.id !== id) }));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !capsule.tags.includes(t)) {
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput("");
  }

  async function generatePrimer() {
    setGeneratingPrimer(true);
    try {
      const highThreads = capsule.openThreads.filter(t => t.priority === "high");
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are writing a cold-start primer for the next Claude instance inheriting this INT Inc. AI transformation session.

CONTEXT:
- Owner: Kyle Rosebrook, Staff Engineer (AppSec + Platform), INT Inc. (55-person women-owned MSP in Lincolnshire, IL)
- Mission: Transform INT Inc. from MSP → hybrid AI Platform Services Company (AIaaS model)
- Custom Instructions: ${capsule.meta.customInstructionsVersion}
- Security floor: Input validation, ZDR for client data, RBAC+RLS, prompt injection defense, no hallucinations
- Response pattern: TL;DR → Analogy → Business Context → Architecture → Implementation → Quality Gates → Gaps → Critique → Sources

ACTIVE ASSETS (${capsule.assets.length} total):
${capsule.assets.map(a => `- ${a.name} [${a.status.toUpperCase()}]: ${a.description.slice(0,120)}...`).join("\n")}

TOP OPEN THREADS (immediate priority):
${highThreads.map(t => `- ${t.thread}: ${t.context.slice(0,150)}`).join("\n")}

KEY LOCKED DECISIONS (do NOT re-litigate):
${capsule.decisions.filter(d => d.locked).map(d => `- ${d.decision}`).join("\n")}

Write a 200-250 word cold-start primer that:
1. Establishes who Kyle is and INT Inc.'s transformation mission in 2 sentences
2. States the current build priority (AIaaS Dashboard Generator = highest-leverage unblocked asset)
3. Lists the 3 immediate open threads with their specific next actions
4. Names the 3 locked decisions Claude should NOT re-litigate
5. Calls out the HumanX hard deadline (April 6-9)
6. Notes the Custom Instructions version and key security floor requirements
7. Ends with: "Start here — do not re-derive context."

Write as a direct instruction to Claude. Terse, dense, zero filler. No headers. Single block of text.`
          }],
        }),
      });
      const d = await r.json();
      const txt = d.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch (e) {
      update("nextSessionPrimer", "Generation failed — paste your context manually here.");
    }
    setGeneratingPrimer(false);
  }

  function exportJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "int-context-capsule-v1" } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `int-context-capsule-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "int-context-capsule-v1" } };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyPrimer() {
    navigator.clipboard.writeText(capsule.nextSessionPrimer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const NAV = [
    { id: "overview",  label: "Overview",         icon: "◈" },
    { id: "assets",    label: "Assets",            icon: "⬡", count: capsule.assets.length },
    { id: "decisions", label: "Decisions",         icon: "⊕", count: capsule.decisions.length },
    { id: "threads",   label: "Open Threads",      icon: "↻", count: capsule.openThreads.length },
    { id: "knowledge", label: "Project Knowledge", icon: "◎", count: capsule.projectKnowledge.length },
    { id: "primer",    label: "Session Primer",    icon: "▶" },
    { id: "export",    label: "Export",            icon: "↓" },
  ];

  const completeness = [
    !!capsule.meta.sessionTitle,
    !!capsule.meta.destinationProject,
    capsule.assets.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    !!capsule.nextSessionPrimer,
  ].filter(Boolean).length;
  const pct = Math.round((completeness / 6) * 100);

  const highCount = capsule.openThreads.filter(t => t.priority === "high").length;
  const liveCount = capsule.assets.filter(a => ["live","pilot","deployed"].includes(a.status)).length;
  const blockedCount = capsule.assets.filter(a => a.status === "unbuilt").length;

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        minHeight: "100vh", background: "#040b09", fontFamily: "'Bricolage Grotesque',sans-serif",
        color: "#e2e8f0", display: "flex", flexDirection: "column",
        backgroundImage: "radial-gradient(circle at 20% 20%, #0d2e2422 0%, transparent 60%), radial-gradient(circle at 80% 80%, #0a1f1a33 0%, transparent 60%)",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{
          padding: "11px 20px", borderBottom: "1px solid #0a1f1a", background: "#040b09ee",
          backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9, letterSpacing: 3, color: "#0d9488",
              fontFamily: "'JetBrains Mono',monospace", flexShrink: 0,
            }}>INT.INC</div>
            <div style={{
              width: 1, height: 14, background: "#0a1f1a", flexShrink: 0,
            }}/>
            <div style={{
              fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700,
              color: "#e2e8f0", fontSize: 13, whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {capsule.meta.sessionTitle}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 72, height: 2, background: "#0a1f1a", borderRadius: 1 }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: pct === 100 ? "#10b981" : "#0d9488",
                borderRadius: 1, transition: "width .4s ease",
              }}/>
            </div>
            <span style={{ fontSize: 9, color: pct === 100 ? "#10b981" : "#2dd4bf", fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn" onClick={copyJSON} style={{
              background: "transparent", border: "1px solid #0f3028", borderRadius: 6,
              padding: "6px 12px", color: copied ? "#10b981" : "#334155",
              cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", transition: "all .2s",
            }}>{copied ? "✓ copied" : "⎘ copy json"}</button>
            <button className="btn" onClick={exportJSON} style={{
              background: exported ? "#052e1666" : "linear-gradient(135deg,#0f766e,#0d9488)",
              border: "none", borderRadius: 6, padding: "6px 14px",
              color: exported ? "#10b981" : "#fff", cursor: "pointer",
              fontSize: 11, fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 700, transition: "all .2s",
            }}>{exported ? "✓ exported" : "↓ Export JSON"}</button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Sidebar */}
          <div style={{
            width: 172, flexShrink: 0, borderRight: "1px solid #0a1f1a",
            padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2,
          }}>
            {NAV.map(n => (
              <button key={n.id} className="nav-btn" onClick={() => setActiveSection(n.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                borderRadius: 7, background: activeSection === n.id ? "#0a1f1a" : "transparent",
                border: `1px solid ${activeSection === n.id ? "#0f3028" : "transparent"}`,
                color: activeSection === n.id ? "#5eead4" : "#334155",
                cursor: "pointer", fontSize: 12,
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: activeSection === n.id ? 600 : 400,
                transition: "all .15s", textAlign: "left",
              }}>
                <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{n.icon}</span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.count !== undefined && (
                  <span style={{ fontSize: 9, color: "#1e4039", fontFamily: "'JetBrains Mono',monospace" }}>{n.count}</span>
                )}
              </button>
            ))}

            {/* Sidebar footer stats */}
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #0a1f1a", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "live/pilot", value: liveCount, color: "#10b981" },
                { label: "unbuilt", value: blockedCount, color: "#f87171" },
                { label: "high priority", value: highCount, color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#1e4039", fontFamily: "'JetBrains Mono',monospace" }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: s.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: "24px 28px", animation: "fadeUp .25s ease" }}>

            {/* ── OVERVIEW ── */}
            {activeSection === "overview" && (
              <div>
                <SectionHeader icon="◈" label="Session Overview" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "SESSION TITLE", path: "meta.sessionTitle", rows: 1 },
                    { label: "DESTINATION PROJECT", path: "meta.destinationProject", rows: 1, placeholder: "e.g. INT Inc. Q2 Sprint / HumanX Prep" },
                    { label: "OWNER", path: "meta.owner", rows: 1 },
                    { label: "CUSTOM INSTRUCTIONS", path: "meta.customInstructionsVersion", rows: 1 },
                  ].map(f => (
                    <Card key={f.path}>
                      <FieldLabel>{f.label}</FieldLabel>
                      <EditableText value={f.path.split(".").reduce((o,k)=>o[k],capsule)} onChange={v=>update(f.path,v)} rows={f.rows} placeholder={f.placeholder||""} />
                    </Card>
                  ))}
                </div>

                {/* Status strip */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Total Assets", value: capsule.assets.length, sub: "tracked", color: "#5eead4" },
                    { label: "Live / Pilot", value: liveCount, sub: "in production", color: "#4ade80" },
                    { label: "Unbuilt", value: blockedCount, sub: "need building", color: "#f87171" },
                    { label: "High Priority", value: highCount, sub: "open threads", color: "#fbbf24" },
                  ].map(s => (
                    <Card key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{s.sub}</div>
                    </Card>
                  ))}
                </div>

                {/* Tags */}
                <Card>
                  <FieldLabel>TAGS</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {capsule.tags.map(t => (
                      <span key={t} className="tag-pill" onClick={() => setCapsule(prev => ({ ...prev, tags: prev.tags.filter(x=>x!==t) }))}
                        style={{ fontSize:10, padding:"3px 10px", borderRadius:20, background:"#0a1f1a", color:"#2dd4bf", border:"1px solid #0f3028", cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", transition:"all .15s" }}>
                        {t} ×
                      </span>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <input value={tagInput} onChange={e=>setTagInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")addTag()}}
                      placeholder="add tag + enter"
                      style={{ flex:1, background:"#050e0c", border:"1px solid #0f2420", borderRadius:6, padding:"6px 10px", color:"#94a3b8", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}
                    />
                    <button className="btn" onClick={addTag} style={{ background:"#0f766e22", border:"1px solid #0f3028", borderRadius:6, padding:"6px 12px", color:"#2dd4bf", cursor:"pointer", fontSize:11 }}>+</button>
                  </div>
                </Card>
              </div>
            )}

            {/* ── ASSETS ── */}
            {activeSection === "assets" && (
              <div>
                <SectionHeader icon="⬡" label="Asset Registry" count={capsule.assets.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {capsule.assets.map(a => (
                    <Card key={a.id}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <EditableText value={a.name} onChange={v=>updateArrayItem("assets",a.id,"name",v)} rows={1} mono />
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <Badge label={a.track} colors={{ bg:"#0a1f1a", text:"#5eead4", border:"#0f3028" }} />
                          <Badge label={a.status} colors={STATUS_COLORS[a.status] || STATUS_COLORS.draft} />
                          <button onClick={()=>removeItem("assets",a.id)} style={{ background:"transparent", border:"none", color:"#1e4039", cursor:"pointer", fontSize:12, padding:"0 4px" }}>×</button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                        <div>
                          <FieldLabel>DESCRIPTION</FieldLabel>
                          <EditableText value={a.description} onChange={v=>updateArrayItem("assets",a.id,"description",v)} rows={3} />
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          <div>
                            <FieldLabel>STATUS</FieldLabel>
                            <select value={a.status} onChange={e=>updateArrayItem("assets",a.id,"status",e.target.value)}
                              style={{ width:"100%", background:"#050e0c", border:"1px solid #0f2420", borderRadius:6, padding:"6px 8px", color:"#94a3b8", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>
                              {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <FieldLabel>TRACK</FieldLabel>
                            <EditableText value={a.track} onChange={v=>updateArrayItem("assets",a.id,"track",v)} rows={1} mono />
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
                        <div>
                          <FieldLabel>NEXT MILESTONE</FieldLabel>
                          <EditableText value={a.nextMilestone} onChange={v=>updateArrayItem("assets",a.id,"nextMilestone",v)} rows={2} />
                        </div>
                        <div>
                          <FieldLabel>BLOCKERS</FieldLabel>
                          <EditableText value={a.blockers} onChange={v=>updateArrayItem("assets",a.id,"blockers",v)} rows={2} />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={()=>addItem("assets",{ name:"New Asset", track:"", status:"spec", description:"", nextMilestone:"", blockers:"" })} label="+ add asset" />
                </div>
              </div>
            )}

            {/* ── DECISIONS ── */}
            {activeSection === "decisions" && (
              <div>
                <SectionHeader icon="⊕" label="Key Decisions" count={capsule.decisions.length} />
                <div style={{ fontSize:12, color:"#334155", marginBottom:16, fontFamily:"'JetBrains Mono',monospace" }}>
                  🔒 Locked = do not re-litigate in new sessions
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.decisions.map(d => (
                    <Card key={d.id}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <FieldLabel>DECISION</FieldLabel>
                          <EditableText value={d.decision} onChange={v=>updateArrayItem("decisions",d.id,"decision",v)} rows={2} mono />
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <button onClick={()=>updateArrayItem("decisions",d.id,"locked",!d.locked)}
                            style={{ background:d.locked?"#052e1666":"transparent", border:`1px solid ${d.locked?"#166534":"#0f3028"}`, borderRadius:6, padding:"3px 8px", color:d.locked?"#4ade80":"#1e4039", cursor:"pointer", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>
                            {d.locked?"🔒 locked":"○ open"}
                          </button>
                          <button onClick={()=>removeItem("decisions",d.id)} style={{ background:"transparent", border:"none", color:"#1e4039", cursor:"pointer", fontSize:12, padding:"0 4px" }}>×</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <FieldLabel>RATIONALE</FieldLabel>
                          <EditableText value={d.rationale} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)} rows={3} />
                        </div>
                        <div>
                          <FieldLabel>ALTERNATIVES CONSIDERED</FieldLabel>
                          <EditableText value={d.alternatives} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)} rows={3} />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={()=>addItem("decisions",{ decision:"", rationale:"", alternatives:"", locked:false })} label="+ add decision" />
                </div>
              </div>
            )}

            {/* ── OPEN THREADS ── */}
            {activeSection === "threads" && (
              <div>
                <SectionHeader icon="↻" label="Open Threads" count={capsule.openThreads.length} />
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.openThreads.map(t => (
                    <Card key={t.id}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <EditableText value={t.thread} onChange={v=>updateArrayItem("openThreads",t.id,"thread",v)} rows={1} mono />
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <Badge label={t.priority} colors={PRIORITY_COLORS[t.priority]||PRIORITY_COLORS.medium} />
                          <Badge label={t.horizon||"near"} colors={HORIZON_COLORS[t.horizon]||HORIZON_COLORS.near} />
                          <button onClick={()=>removeItem("openThreads",t.id)} style={{ background:"transparent", border:"none", color:"#1e4039", cursor:"pointer", fontSize:12, padding:"0 4px" }}>×</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                        <div>
                          <FieldLabel>PRIORITY</FieldLabel>
                          <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                            style={{ width:"100%", background:"#050e0c", border:"1px solid #0f2420", borderRadius:6, padding:"6px 8px", color:"#94a3b8", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>
                            <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
                          </select>
                        </div>
                        <div>
                          <FieldLabel>HORIZON</FieldLabel>
                          <select value={t.horizon||"near"} onChange={e=>updateArrayItem("openThreads",t.id,"horizon",e.target.value)}
                            style={{ width:"100%", background:"#050e0c", border:"1px solid #0f2420", borderRadius:6, padding:"6px 8px", color:"#94a3b8", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>
                            <option value="immediate">immediate</option><option value="near">near</option><option value="mid">mid</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:10 }}>
                        <div>
                          <FieldLabel>CONTEXT</FieldLabel>
                          <EditableText value={t.context} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)} rows={3} />
                        </div>
                        <div>
                          <FieldLabel>NEXT ACTION</FieldLabel>
                          <EditableText value={t.nextAction} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)} rows={3} />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={()=>addItem("openThreads",{ thread:"", priority:"medium", horizon:"near", context:"", nextAction:"", owner:"Kyle" })} label="+ add thread" />
                </div>
              </div>
            )}

            {/* ── PROJECT KNOWLEDGE ── */}
            {activeSection === "knowledge" && (
              <div>
                <SectionHeader icon="◎" label="Project Knowledge" count={capsule.projectKnowledge.length} />
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.projectKnowledge.map(k => (
                    <Card key={k.id}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <FieldLabel>FILE / DOCUMENT</FieldLabel>
                          <EditableText value={k.file} onChange={v=>updateArrayItem("projectKnowledge",k.id,"file",v)} rows={1} mono />
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <Badge label={k.type||"doc"} colors={{ bg:"#0a1f1a", text:"#5eead4", border:"#0f3028" }} />
                          <Badge label={k.relevance} colors={k.relevance==="high"?PRIORITY_COLORS.high:PRIORITY_COLORS.medium} />
                          <button onClick={()=>removeItem("projectKnowledge",k.id)} style={{ background:"transparent", border:"none", color:"#1e4039", cursor:"pointer", fontSize:12, padding:"0 4px" }}>×</button>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <FieldLabel>KEY INSIGHTS</FieldLabel>
                          <EditableText value={k.keyInsights} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)} rows={4} />
                        </div>
                        <div>
                          <FieldLabel>USED FOR</FieldLabel>
                          <EditableText value={k.usedFor} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)} rows={4} />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={()=>addItem("projectKnowledge",{ file:"", type:"Reference Doc", relevance:"medium", keyInsights:"", usedFor:"" })} label="+ add doc" />
                </div>
              </div>
            )}

            {/* ── PRIMER ── */}
            {activeSection === "primer" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="▶" label="Next Session Primer" />
                <div style={{ fontSize:12, color:"#334155", marginBottom:16, lineHeight:1.65 }}>
                  Cold-start message for the next Claude instance. Paste this as your first message in a new project — eliminates re-derivation of context. INT-aware: injects security floor, Custom Instructions version, and locked decisions.
                </div>
                <Card>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"32px 0" }}>
                      <div style={{ color:"#1e4039", fontSize:13, marginBottom:18 }}>No primer generated yet.</div>
                      <button className="btn" onClick={generatePrimer} style={{
                        background:"linear-gradient(135deg,#0f766e,#0d9488)", border:"none",
                        borderRadius:8, padding:"11px 22px", color:"#fff", cursor:"pointer",
                        fontSize:13, fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:700, transition:"all .2s",
                      }}>✦ Generate INT-Aware Primer</button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"24px 0", color:"#0d9488", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>
                      <div style={{ width:14, height:14, border:"2px solid #0d948833", borderTopColor:"#0d9488", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                      Synthesizing INT Inc. context...
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:9, color:"#1e4039", fontFamily:"'JetBrains Mono',monospace", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>PRIMER {primerGenerated && <span style={{ color:"#0d9488" }}>· AI GENERATED · INT-AWARE</span>}</span>
                        <button className="btn" onClick={generatePrimer} style={{ background:"transparent", border:"none", color:"#0d9488", cursor:"pointer", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>↺ regenerate</button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} onChange={v=>update("nextSessionPrimer",v)} rows={12} placeholder="Write or generate primer..." />
                      <div style={{ display:"flex", gap:8, marginTop:10 }}>
                        <button className="btn" onClick={copyPrimer} style={{
                          background:"transparent", border:"1px solid #0f3028", borderRadius:6,
                          padding:"7px 16px", color:"#2dd4bf", cursor:"pointer",
                          fontSize:11, fontFamily:"'JetBrains Mono',monospace", transition:"all .2s",
                        }}>{copied?"✓ copied":"⎘ copy primer"}</button>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}

            {/* ── EXPORT ── */}
            {activeSection === "export" && (
              <div style={{ maxWidth:600 }}>
                <SectionHeader icon="↓" label="Export Capsule" />
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

                  {[
                    { label:"JSON — n8n / Claude API", desc:"Full structured capsule. Feed directly to Claude API, n8n pipeline ingestion, or Git version control.", action:exportJSON, btn:exported?"✓ Exported":"↓ Download JSON", color:"linear-gradient(135deg,#0f766e,#0891b2)" },
                    { label:"Copy to Clipboard", desc:"Paste as first message into new Claude session. Best combined with primer text.", action:copyJSON, btn:copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#0d9488,#0f766e)" },
                  ].map(opt => (
                    <Card key={opt.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#334155", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action} style={{
                        background:opt.color, border:"none", borderRadius:8, padding:"10px 18px",
                        color:"#fff", cursor:"pointer", fontSize:12,
                        fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:700,
                        flexShrink:0, transition:"all .2s",
                      }}>{opt.btn}</button>
                    </Card>
                  ))}

                  {/* Migration checklist */}
                  <Card style={{ background:"#031a10", borderColor:"#10b98133" }}>
                    <div style={{ fontSize:9, color:"#10b981", fontFamily:"'JetBrains Mono',monospace", marginBottom:12, letterSpacing:1 }}>MIGRATION CHECKLIST</div>
                    {[
                      { label:"Session title filled in", check:!!capsule.meta.sessionTitle },
                      { label:"Destination project named", check:!!capsule.meta.destinationProject },
                      { label:"All assets documented", check:capsule.assets.length > 0 },
                      { label:"Key decisions recorded (locked = don't re-litigate)", check:capsule.decisions.length > 0 },
                      { label:"Open threads prioritized", check:capsule.openThreads.length > 0 },
                      { label:"Primer generated + copied", check:!!capsule.nextSessionPrimer },
                      { label:"JSON exported", check:exported },
                    ].map((item,i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
                        <span style={{ color:item.check?"#10b981":"#1e4039", fontSize:12 }}>{item.check?"✓":"○"}</span>
                        <span style={{ color:item.check?"#6ee7b7":"#334155", fontSize:12 }}>{item.label}</span>
                      </div>
                    ))}
                  </Card>

                  {/* Schema preview */}
                  <Card>
                    <div style={{ fontSize:9, color:"#1e4039", fontFamily:"'JetBrains Mono',monospace", marginBottom:10, letterSpacing:1 }}>JSON SCHEMA</div>
                    <pre style={{ color:"#2dd4bf44", fontSize:10, lineHeight:1.7, fontFamily:"'JetBrains Mono',monospace", overflow:"auto" }}>
{`{
  "meta": { sessionTitle, owner, customInstructionsVersion,
            sourceProject, destinationProject, date },
  "assets": [{ name, track, status, description,
               nextMilestone, blockers }],
  "decisions": [{ decision, rationale, alternatives, locked }],
  "openThreads": [{ thread, priority, horizon,
                    context, nextAction, owner }],
  "projectKnowledge": [{ file, type, relevance,
                         keyInsights, usedFor }],
  "nextSessionPrimer": "...",
  "tags": []
}`}
                    </pre>
                  </Card>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
