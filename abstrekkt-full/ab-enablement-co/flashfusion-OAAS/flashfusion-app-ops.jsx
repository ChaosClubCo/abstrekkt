import { useState, useMemo, useEffect, useCallback } from "react";
import { LayoutDashboard, Trash2, Zap, CheckCircle, Archive, ArrowRightLeft, Search as SearchIcon, ExternalLink, Copy, ChevronDown, AlertTriangle, TrendingUp, Activity, Box, RefreshCw, Tag, Star, Flame } from "lucide-react";

// ─── TOKENS ────────────────────────────────────────────────────────
const V = {
  s1:"#0B0B14", s2:"#13131F", s3:"#1C1C2E", s4:"#222235",
  border:"rgba(139,92,246,0.15)", borderHi:"rgba(139,92,246,0.4)",
  violet:"#A855F7", violetDim:"#8B5CF6",
  magenta:"#EC4899", cyan:"#22D3EE", cyanDim:"#06B6D4",
  t1:"#FFFFFF", t2:"#C7C7D1", t3:"#8A8A96", t4:"#4A4A58",
  green:"#22C55E", red:"#EF4444", amber:"#F59E0B", orange:"#FB923C",
};

const LANES = {
  ff:   {label:"FF Consulting",    color:V.violet,   bg:"rgba(168,85,247,0.12)"},
  cc:   {label:"Chaos Club",       color:V.magenta,  bg:"rgba(236,72,153,0.12)"},
  afs:  {label:"AffordableStuff",  color:V.cyan,     bg:"rgba(34,211,238,0.12)"},
  int:  {label:"INT/Internal",     color:"#818CF8",  bg:"rgba(129,140,248,0.12)"},
  exp:  {label:"Experimental",     color:V.amber,    bg:"rgba(245,158,11,0.12)"},
  park: {label:"Parked/Archive",   color:V.t4,       bg:"rgba(74,74,88,0.15)"},
};
const DECISIONS = {
  keep:        {label:"Keep",        color:V.green,  bg:"rgba(34,197,94,0.12)"},
  archive:     {label:"Archive",     color:V.red,    bg:"rgba(239,68,68,0.12)"},
  migrate:     {label:"Migrate",     color:V.cyan,   bg:"rgba(34,211,238,0.12)"},
  investigate: {label:"Investigate", color:V.amber,  bg:"rgba(245,158,11,0.12)"},
};
const PRIORITIES = {
  P0:{color:V.red,    bg:"rgba(239,68,68,0.18)"},
  P1:{color:V.orange, bg:"rgba(251,146,60,0.18)"},
  P2:{color:V.amber,  bg:"rgba(245,158,11,0.18)"},
  P3:{color:V.t3,     bg:"rgba(138,138,150,0.18)"},
};
const STATUS_COLOR = {prod:V.violet,active:V.green,zombie:V.red,parked:V.t4};

// ─── APP DATA ──────────────────────────────────────────────────────
const APPS = [
  // BASE44 – 46
  {id:"b-aud",n:"audit",dn:"Invoke / Audit Platform",p:"b44",l:"ff",v:null,e:null,url:"https://audit.flashfusion.co",s:"prod",f:["primary"]},
  {id:"b-ff",n:"FlashFusion",dn:"FlashFusion Brand App",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-con",n:"Continuum",dn:"Continuum",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-fai",n:"Fusion AI",dn:"Fusion AI",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-epb",n:"AI Ops Concierge",dn:"AI Ops Concierge (EPB)",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-eh",n:"Enterprise Hub",dn:"Enterprise Hub",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-eag",n:"Enterprise AI App Generator",dn:"Enterprise AI App Generator",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-oai",n:"Orchestrator AI",dn:"Orchestrator AI",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-arc",n:"Archon Orchestrator",dn:"Archon Orchestrator",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-nex",n:"Nexus Copilot",dn:"Nexus Copilot",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-ast",n:"AI Studio",dn:"AI Studio",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-kos",n:"Knowledge OS",dn:"Knowledge OS",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-agt",n:"agentrus",dn:"Agentrus",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-cdt",n:"Conduit",dn:"Conduit",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-gst",n:"Graph Studio",dn:"Graph Studio",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-intel",n:"INTelligence.ai",dn:"INTelligence.ai",p:"b44",l:"int",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-itr",n:"INTeract",dn:"INTeract",p:"b44",l:"int",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-als",n:"aisalesteam",dn:"AI Sales Team",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-tsn",n:"TeamSync",dn:"TeamSync",p:"b44",l:"ff",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-cc",n:"Chaos Club",dn:"Chaos Club",p:"b44",l:"cc",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-spk",n:"SparkAcademy",dn:"SparkAcademy",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-pmo",n:"Proactive Mentor OS",dn:"Proactive Mentor OS",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-rft",n:"rifts.to",dn:"rifts.to",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-iod",n:"Inner-Odyssey",dn:"Inner-Odyssey",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-fls",n:"FlowState",dn:"FlowState",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-ssp",n:"Studio Spark",dn:"Studio Spark",p:"b44",l:"exp",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-afs",n:"AffordableStoreStuff",dn:"AffordableStoreStuff (B44)",p:"b44",l:"afs",v:null,e:null,url:null,s:"active",f:[]},
  {id:"b-bta",n:"Beta Tester Army",dn:"Beta Tester Army",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-sli",n:"SoleIgnite",dn:"SoleIgnite",p:"b44",l:"afs",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-slc",n:"Sole Customizer",dn:"Sole Customizer",p:"b44",l:"afs",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-gmc",n:"GameCraft",dn:"GameCraft",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-chb",n:"Champions Hub",dn:"Champions Hub",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-bap",n:"Battle Arena Pro",dn:"Battle Arena Pro",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-ago",n:"AI Game Day Oracle",dn:"AI Game Day Oracle",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-scr",n:"ScoutReel",dn:"ScoutReel",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-cca",n:"Card Catalog AI",dn:"Card Catalog AI",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-lsy",n:"LifeSync",dn:"LifeSync",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-dbt",n:"debate",dn:"Debate",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-asc",n:"Ascend.Ai",dn:"Ascend.Ai",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-ard",n:"ArchDesigner",dn:"ArchDesigner",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-sed",n:"Sedona Soul Sessions",dn:"Sedona Soul Sessions",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-auf",n:"AuraFlow",dn:"AuraFlow",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-crv",n:"CreditReview",dn:"CreditReview",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:[]},
  {id:"b-ts1",n:"Tessa",dn:"Tessa (v1)",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:["duplicate"]},
  {id:"b-ts2",n:"TESSA",dn:"TESSA (v2 — dupe)",p:"b44",l:"exp",v:null,e:null,url:null,s:"parked",f:["duplicate"]},
  {id:"b-sit",n:"Site",dn:"Site (unnamed)",p:"b44",l:"park",v:null,e:null,url:null,s:"parked",f:[]},
  // LOVABLE – 24
  {id:"l-ff",n:"flashfusion",dn:"flashfusion (T-shirt gen)",p:"lv",l:"afs",v:4666,e:62,url:"https://flashfusion.lovable.app",s:"zombie",f:["zombie","broken-api","brand-collision"]},
  {id:"l-cf",n:"flashfusion-commerce-forge",dn:"FF Commerce Forge",p:"lv",l:"afs",v:0,e:23,url:"https://flashfusion-commerce-forge.lovable.app",s:"parked",f:[]},
  {id:"l-lp",n:"flashfusion-launchpad",dn:"FF Marketing Hub",p:"lv",l:"ff",v:2,e:12,url:"https://flashfusion-launchpad.lovable.app",s:"active",f:[]},
  {id:"l-fg",n:"flash-guide-site",dn:"FF Launchpad (dupe)",p:"lv",l:"ff",v:2,e:8,url:"https://flash-guide-site.lovable.app",s:"parked",f:["duplicate"]},
  {id:"l-fm",n:"flash-fusion-marketing",dn:"FF Marketing Hub (79)",p:"lv",l:"ff",v:2,e:6,url:"https://flash-fusion-marketing.lovable.app",s:"parked",f:["duplicate"]},
  {id:"l-ctx",n:"cortex-ff",dn:"Cortex FF — AI Second Brain",p:"lv",l:"ff",v:13,e:209,url:"https://cortex-ff.lovable.app",s:"active",f:[]},
  {id:"l-tc",n:"tool-connect-craft",dn:"Connector Hub",p:"lv",l:"ff",v:35,e:154,url:"https://tool-connect-craft.lovable.app",s:"active",f:[]},
  {id:"l-df",n:"data-fracking",dn:"Studio Refactor Hub",p:"lv",l:"ff",v:615,e:47,url:"https://data-fracking.lovable.app",s:"active",f:["high-traffic"]},
  {id:"l-ffx",n:"fusion-flux-flow",dn:"Fusion Hub (E-commerce)",p:"lv",l:"afs",v:5,e:39,url:"https://fusion-flux-flow.lovable.app",s:"active",f:[]},
  {id:"l-ody",n:"odyssey-learns",dn:"Odyssey Learns (K-12)",p:"lv",l:"exp",v:17,e:187,url:"https://odyssey-learns.lovable.app",s:"active",f:[]},
  {id:"l-ign",n:"ignite-pixl-verse",dn:"Ignite Pixl Verse",p:"lv",l:"exp",v:1,e:120,url:"https://ignite-pixl-verse.lovable.app",s:"parked",f:[]},
  {id:"l-sbs",n:"stellar-biz-story",dn:"Enterprise Profile Studio",p:"lv",l:"ff",v:5,e:109,url:"https://stellar-biz-story.lovable.app",s:"active",f:[]},
  {id:"l-bs",n:"blindspot-beacon",dn:"Contour — Blindspot Radar",p:"lv",l:"ff",v:4,e:60,url:"https://blindspot-beacon.lovable.app",s:"parked",f:[]},
  {id:"l-ff2",n:"firm-fab",dn:"Profile Master Pro",p:"lv",l:"ff",v:4,e:8,url:"https://firm-fab.lovable.app",s:"parked",f:["duplicate"]},
  {id:"l-lpa",n:"lovable-prompt-artist",dn:"Lovable Prompt Artist",p:"lv",l:"exp",v:2,e:12,url:"https://lovable-prompt-artist.lovable.app",s:"parked",f:[]},
  {id:"l-ncs",n:"nurture-craft-shine",dn:"Build It Happy (stub)",p:"lv",l:"park",v:1,e:5,url:"https://nurture-craft-shine.lovable.app",s:"parked",f:[]},
  {id:"l-ppx",n:"pixel-perfect-clone",dn:"Pixel Perfect Replica",p:"lv",l:"exp",v:1,e:5,url:"https://pixel-perfect-clone-8825.lovable.app",s:"parked",f:[]},
  {id:"l-sw",n:"scene-weaver-66",dn:"Characterforge Imagix",p:"lv",l:"exp",v:0,e:2,url:"https://scene-weaver-66.lovable.app",s:"parked",f:[]},
  {id:"l-mmp",n:"make-my-pal",dn:"Build It Happy (stub 2)",p:"lv",l:"park",v:5,e:1,url:"https://make-my-pal.lovable.app",s:"parked",f:[]},
  {id:"l-sol",n:"sole-scaffold",dn:"SoleMuchBetter Scaffold",p:"lv",l:"afs",v:0,e:12,url:"https://sole-scaffold.lovable.app",s:"parked",f:[]},
  {id:"l-ath",n:"ai-tool-hub",dn:"AI Tool Hub",p:"lv",l:"exp",v:0,e:0,url:"https://ai-tool-hub-92085.lovable.app",s:"parked",f:[]},
  {id:"l-ssg",n:"superscale-guide",dn:"Superscale Prompt Guide",p:"lv",l:"park",v:0,e:1,url:"https://superscale-lovable-guide-33147.lovable.app",s:"parked",f:[]},
  {id:"l-prt",n:"pulse-template",dn:"Pulse Robot Template",p:"lv",l:"park",v:1,e:3,url:"https://pulse-robot-template-40849.lovable.app",s:"parked",f:[]},
  {id:"l-nff",n:"nimble-fab-flow",dn:"Nimble Fab Flow (ERP)",p:"lv",l:"park",v:0,e:1,url:null,s:"parked",f:[]},
];

// ─── COPILOT CHAIN GENERATOR ────────────────────────────────────
function buildChain(app, meta) {
  const plat = app.p === "b44" ? "Base44 (low-code, managed backend, React frontend)" : "Lovable (Vite + React + TypeScript + shadcn/ui + optional Supabase)";
  const lane = LANES[meta.lane]?.label || meta.lane;
  return `# GitHub Copilot Agent — Prompt Chain
## ${app.dn}
**Platform:** ${app.p === "b44" ? "Base44" : "Lovable"} | **Lane:** ${lane} | **Status:** ${app.s}
${app.url ? `**URL:** ${app.url}` : ""}
${meta.migration ? "**Migration target:** Next.js 15 + React 19 + TypeScript + Supabase + Vercel + Cloudflare" : ""}

---

### PROMPT 1 — Codebase Orientation
\`\`\`
You are working on "${app.dn}", built on ${plat}.
Read the entire codebase. Output a structured brief:
1. File tree (2 levels deep)
2. Main entry points and routing
3. Data models / entities / schemas
4. External API dependencies
5. Known TODOs, incomplete features, or commented-out code
Be specific. No generic descriptions.
\`\`\`

---

### PROMPT 2 — Security & Quality Audit
\`\`\`
Audit "${app.dn}" for:
1. SECURITY: hardcoded secrets, exposed keys, missing auth guards, unvalidated inputs, insecure data handling
2. TYPE SAFETY: TypeScript errors, implicit any, unsafe casts
3. PERFORMANCE: unnecessary re-renders, blocking operations, N+1 queries
4. DEAD CODE: unused components, functions, imports
5. ACCESSIBILITY: missing ARIA, keyboard nav gaps, contrast violations
Output: severity-ranked list (CRITICAL / HIGH / MEDIUM / LOW) with file + line references.
\`\`\`

---

### PROMPT 3 — Architecture Evaluation
\`\`\`
Rate "${app.dn}" across these axes (A/B/C + evidence from code):
- Auth: correctly implemented? gaps?
- Data layer: state management approach, race conditions, stale data risks
- Error handling: errors caught and surfaced properly?
- Observability: logging, analytics, error reporting present?
- Scalability: what breaks first under 10x load?
Cite specific files and patterns as evidence. No generic assessments.
\`\`\`

---

### PROMPT 4 — ${meta.migration ? "Migration Plan" : "Implementation Plan"}
\`\`\`
${meta.migration
  ? `Plan migration of "${app.dn}" to: Next.js 15 + React 19 + TypeScript + Supabase + Vercel + Cloudflare.
For each layer (routing, auth, data, UI, deploy):
- What carries forward vs. must be rewritten
- Effort estimate: S (<2h) / M (half-day) / L (full day) / XL (2+ days)
- Blockers and dependencies
Output a phased migration checklist with acceptance criteria per phase.`
  : `Based on the audit of "${app.dn}", build a ${meta.decision === "keep" ? "production hardening" : meta.decision === "investigate" ? "viability assessment" : "deprecation prep"} plan:
- Phase 1 — Immediate (<2h): critical fixes
- Phase 2 — Short-term (1–3 days): core improvements
- Phase 3 — Medium-term (1–2 weeks): full resolution
Each item: description + acceptance criteria + effort estimate.`}
\`\`\`

---

### PROMPT 5 — Test Coverage
\`\`\`
Write tests for "${app.dn}" covering:
1. Unit: 3 most critical utility/helper functions
2. Component: 3 most user-facing UI components (React Testing Library)
3. Integration: mock API calls for main data flows
4. E2E scenarios: top 3 user journeys (happy path + one error case each)
Stack: Vitest + @testing-library/react. Output runnable test files with import paths.
\`\`\``;
}

// ─── HELPERS ───────────────────────────────────────────────────────
const pill = (label, color, bg, size=11) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:99,fontSize:size,fontWeight:500,color,background:bg,lineHeight:1.4,whiteSpace:"nowrap"}}>
    {label}
  </span>
);
const btn = (label, onClick, active=false, color=V.violet, sm=false) => (
  <button onClick={onClick} style={{padding:sm?"2px 8px":"5px 12px",borderRadius:6,border:`1px solid ${active?color:"rgba(255,255,255,0.08)"}`,background:active?`${color}22`:"transparent",color:active?color:V.t3,fontSize:sm?10:12,fontWeight:500,cursor:"pointer",transition:"all 0.15s"}}>
    {label}
  </button>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function AppOpsCenter() {
  const [tab, setTab] = useState("dashboard");
  const [meta, setMeta] = useState(() =>
    Object.fromEntries(APPS.map(a => [a.id, {decision:null,priority:null,lane:a.l,migration:false,notes:"",wsjf:null}]))
  );
  const [filters, setFilters] = useState({platform:"all",lane:"all",status:"all",decision:"all",q:""});
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    async function load() {
      try {
        const r = await window.storage.get("ff-app-ops-v1");
        if (r) {
          const saved = JSON.parse(r.value);
          setMeta(prev => {
            const m = {...prev};
            Object.entries(saved).forEach(([id,v]) => { if(m[id]) m[id]={...m[id],...v}; });
            return m;
          });
        }
      } catch{}
    }
    load();
  }, []);

  const persist = useCallback(async (nextMeta) => {
    try { await window.storage.set("ff-app-ops-v1", JSON.stringify(nextMeta)); setSaved(true); setTimeout(()=>setSaved(false),1500); } catch{}
  }, []);

  const updateMeta = useCallback((id, patch) => {
    setMeta(prev => {
      const next = {...prev, [id]:{...prev[id],...patch}};
      persist(next);
      return next;
    });
  }, [persist]);

  const setAllDecision = useCallback((ids, decision) => {
    setMeta(prev => {
      const next = {...prev};
      ids.forEach(id => { next[id]={...next[id],decision}; });
      persist(next);
      return next;
    });
  }, [persist]);

  const filt = useMemo(() => APPS.filter(a => {
    const m = meta[a.id];
    if(filters.platform !== "all" && a.p !== filters.platform) return false;
    if(filters.lane !== "all" && m.lane !== filters.lane) return false;
    if(filters.status !== "all" && a.s !== filters.status) return false;
    if(filters.decision !== "all" && m.decision !== filters.decision) return false;
    if(filters.q && !a.dn.toLowerCase().includes(filters.q.toLowerCase()) && !a.n.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [filters, meta]);

  const stats = useMemo(() => ({
    total: APPS.length,
    b44: APPS.filter(a=>a.p==="b44").length,
    lv: APPS.filter(a=>a.p==="lv").length,
    traffic: APPS.reduce((s,a)=>s+(a.v||0),0),
    zombies: APPS.filter(a=>a.s==="zombie").length,
    dupes: APPS.filter(a=>a.f.includes("duplicate")).length,
    decided: APPS.filter(a=>meta[a.id].decision).length,
    undecided: APPS.filter(a=>!meta[a.id].decision).length,
  }), [meta]);

  // ── EXPORTS ──────────────────────────────────────────────────────
  const genCleanup = () => {
    const lines = ["# FlashFusion App Cleanup Action List","Generated: "+new Date().toLocaleDateString(),""];
    Object.entries(DECISIONS).forEach(([d,cfg]) => {
      const apps = APPS.filter(a=>meta[a.id].decision===d);
      if(!apps.length) return;
      lines.push(`## ${cfg.label.toUpperCase()} (${apps.length})`);
      apps.forEach(a => {
        const m = meta[a.id];
        lines.push(`- **${a.dn}** [${a.p==="b44"?"B44":"Lovable"}]${m.priority?` · ${m.priority}`:""}${m.migration?" · MIGRATE":""}${a.f.length?` · flags: ${a.f.join(", ")}`:""}`);
        if(m.notes) lines.push(`  > ${m.notes}`);
        if(a.url) lines.push(`  ${a.url}`);
      });
      lines.push("");
    });
    const und = APPS.filter(a=>!meta[a.id].decision);
    if(und.length) { lines.push(`## UNDECIDED (${und.length})`); und.forEach(a=>lines.push(`- ${a.dn} [${a.p==="b44"?"B44":"Lovable"}]`)); }
    return lines.join("\n");
  };

  const genSprint = () => {
    const scored = APPS.filter(a=>meta[a.id].wsjf).sort((a,b)=>(meta[b.id].wsjf||0)-(meta[a.id].wsjf||0));
    const priOrder = APPS.filter(a=>meta[a.id].priority).sort((a,b)=>["P0","P1","P2","P3"].indexOf(meta[a.id].priority)-["P0","P1","P2","P3"].indexOf(meta[b.id].priority));
    const lines = ["# FlashFusion Sprint Backlog","Generated: "+new Date().toLocaleDateString(),"","## By WSJF Score","| Rank | App | Platform | Priority | WSJF | Decision | Migrate |","|------|-----|----------|----------|------|----------|---------|"];
    (scored.length ? scored : priOrder).forEach((a,i) => {
      const m = meta[a.id];
      lines.push(`| ${i+1} | ${a.dn} | ${a.p==="b44"?"B44":"Lovable"} | ${m.priority||"—"} | ${m.wsjf||"—"} | ${m.decision||"—"} | ${m.migration?"Yes":"No"} |`);
    });
    return lines.join("\n");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),1800);
  };

  // ── SHARED STYLES ─────────────────────────────────────────────────
  const card = {background:V.s2,border:`1px solid ${V.border}`,borderRadius:10,padding:"14px 16px"};
  const input = {background:V.s3,border:`1px solid ${V.border}`,borderRadius:6,color:V.t2,fontSize:12,padding:"6px 10px",outline:"none",fontFamily:"inherit"};
  const sel = {...input,cursor:"pointer"};

  const issues = APPS.filter(a=>a.f.length>0);

  // ── MODAL CONTENT ────────────────────────────────────────────────
  const renderModal = () => {
    if(!modal) return null;
    let content = "";
    let title = "";
    if(modal.type==="cleanup") { content=genCleanup(); title="Cleanup Action List"; }
    if(modal.type==="sprint")  { content=genSprint();  title="Sprint Backlog (WSJF)"; }
    if(modal.type==="chain") {
      const a = APPS.find(x=>x.id===modal.appId);
      if(a) { content=buildChain(a, meta[a.id]); title=`Copilot Chain — ${a.dn}`; }
    }
    return (
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.72)",zIndex:50,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",overflowY:"auto"}}>
        <div style={{...card,width:"100%",maxWidth:680,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{color:V.t1,fontWeight:600,fontSize:14}}>{title}</span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>copyToClipboard(content)} style={{...input,cursor:"pointer",color:copied?V.green:V.cyan,borderColor:copied?V.green:V.border}}>
                <Copy size={12} style={{display:"inline",marginRight:4,verticalAlign:-1}}/>{copied?"Copied!":"Copy All"}
              </button>
              <button onClick={()=>setModal(null)} style={{...input,cursor:"pointer",color:V.t3}}>✕ Close</button>
            </div>
          </div>
          <textarea readOnly value={content} style={{...input,width:"100%",height:400,resize:"vertical",fontFamily:"'Geist Mono',monospace",fontSize:11,lineHeight:1.6,color:V.t2}}/>
        </div>
      </div>
    );
  };

  // ── DASHBOARD TAB ─────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[
          {icon:<Box size={14}/>,label:"Total Apps",val:stats.total,color:V.violet},
          {icon:<Activity size={14}/>,label:"Base44",val:stats.b44,color:V.magenta},
          {icon:<Zap size={14}/>,label:"Lovable",val:stats.lv,color:V.cyan},
          {icon:<TrendingUp size={14}/>,label:"Visitors/30d",val:stats.traffic.toLocaleString(),color:V.amber},
        ].map((s,i)=>(
          <div key={i} style={{...card,textAlign:"center"}}>
            <div style={{color:s.color,display:"flex",justifyContent:"center",marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:22,fontWeight:700,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:V.t4,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Issue banner */}
      {issues.length>0 && (
        <div style={{...card,borderColor:"rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.06)",marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <AlertTriangle size={14} color={V.red}/>
          <span style={{fontSize:12,color:V.red,fontWeight:600}}>Flagged:</span>
          {issues.slice(0,6).map(a=>(
            <span key={a.id} style={{fontSize:11,color:V.t3}}>{a.dn} <span style={{color:V.red}}>({a.f.join(", ")})</span></span>
          ))}
          {issues.length>6 && <span style={{fontSize:11,color:V.t4}}>+{issues.length-6} more</span>}
        </div>
      )}
      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 160px"}}>
          <SearchIcon size={12} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:V.t4}}/>
          <input placeholder="Search apps…" value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))}
            style={{...input,paddingLeft:26,width:"100%"}}/>
        </div>
        {[
          {key:"platform",opts:[["all","All Platforms"],["b44","Base44"],["lv","Lovable"]]},
          {key:"lane",opts:[["all","All Lanes"],...Object.entries(LANES).map(([k,v])=>[k,v.label])]},
          {key:"status",opts:[["all","All Status"],["prod","Production"],["active","Active"],["zombie","Zombie"],["parked","Parked"]]},
          {key:"decision",opts:[["all","All Decisions"],["keep","Keep"],["archive","Archive"],["migrate","Migrate"],["investigate","Investigate"],["null","Undecided"]]},
        ].map(({key,opts})=>(
          <select key={key} value={filters[key]} onChange={e=>setFilters(f=>({...f,[key]:e.target.value}))} style={{...sel,flex:"0 0 auto"}}>
            {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <span style={{fontSize:11,color:V.t4,marginLeft:"auto"}}>{filt.length}/{APPS.length}</span>
      </div>
      {/* App Cards Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
        {filt.map(a => {
          const m = meta[a.id];
          const lc = LANES[m.lane];
          return (
            <div key={a.id} style={{...card,borderColor:m.decision?DECISIONS[m.decision].color+"33":V.border,transition:"border-color 0.2s"}}>
              {/* Header */}
              <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                {pill(a.p==="b44"?"B44":"Lovable", a.p==="b44"?V.violet:V.cyan, a.p==="b44"?"rgba(168,85,247,0.12)":"rgba(34,211,238,0.12)")}
                {pill(lc?.label||m.lane, lc?.color, lc?.bg)}
                {a.f.includes("zombie") && <Flame size={12} color={V.red}/>}
                {a.f.includes("duplicate") && <Copy size={12} color={V.amber}/>}
                {a.f.includes("high-traffic") && <TrendingUp size={12} color={V.green}/>}
                {a.f.includes("primary") && <Star size={12} color={V.violet}/>}
              </div>
              {/* Name */}
              <div style={{fontWeight:600,fontSize:12,color:V.t1,marginBottom:3,lineHeight:1.3}}>{a.dn}</div>
              <div style={{fontSize:10,color:V.t4,marginBottom:8,fontFamily:"monospace"}}>{a.n}</div>
              {/* Metrics */}
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{fontSize:10,color:V.t3}}><span style={{color:STATUS_COLOR[a.s]||V.t3,fontWeight:600}}>●</span> {a.s}</div>
                {a.v!==null && <div style={{fontSize:10,color:V.t3}}><TrendingUp size={9} style={{display:"inline",marginRight:2}}/>{a.v.toLocaleString()}/mo</div>}
                {a.e!==null && <div style={{fontSize:10,color:V.t3}}><RefreshCw size={9} style={{display:"inline",marginRight:2}}/>{a.e} edits</div>}
              </div>
              {/* Decision buttons */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {Object.entries(DECISIONS).map(([d,cfg])=>(
                  <button key={d} onClick={()=>updateMeta(a.id,{decision:m.decision===d?null:d})}
                    style={{padding:"2px 8px",borderRadius:5,border:`1px solid ${m.decision===d?cfg.color:"rgba(255,255,255,0.06)"}`,background:m.decision===d?cfg.bg:"transparent",color:m.decision===d?cfg.color:V.t4,fontSize:10,cursor:"pointer"}}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              {/* Priority + actions */}
              <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                {Object.entries(PRIORITIES).map(([p,cfg])=>(
                  <button key={p} onClick={()=>updateMeta(a.id,{priority:m.priority===p?null:p})}
                    style={{padding:"1px 6px",borderRadius:4,border:`1px solid ${m.priority===p?cfg.color:"rgba(255,255,255,0.06)"}`,background:m.priority===p?cfg.bg:"transparent",color:m.priority===p?cfg.color:V.t4,fontSize:10,cursor:"pointer",fontWeight:600}}>
                    {p}
                  </button>
                ))}
                <button onClick={()=>updateMeta(a.id,{migration:!m.migration})}
                  style={{padding:"1px 6px",borderRadius:4,border:`1px solid ${m.migration?V.cyan:"rgba(255,255,255,0.06)"}`,background:m.migration?"rgba(34,211,238,0.12)":"transparent",color:m.migration?V.cyan:V.t4,fontSize:10,cursor:"pointer",marginLeft:"auto"}}>
                  <ArrowRightLeft size={9} style={{display:"inline",marginRight:3,verticalAlign:-1}}/>Migrate
                </button>
                <button onClick={()=>setModal({type:"chain",appId:a.id})}
                  style={{padding:"1px 6px",borderRadius:4,border:`1px solid rgba(255,255,255,0.06)`,background:"transparent",color:V.t3,fontSize:10,cursor:"pointer"}}>
                  Chain
                </button>
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{color:V.t4,display:"inline-flex"}}><ExternalLink size={11}/></a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── CLEANUP TAB ───────────────────────────────────────────────────
  const renderCleanup = () => {
    const groupedIssues = {
      zombie: APPS.filter(a=>a.s==="zombie"),
      duplicate: APPS.filter(a=>a.f.includes("duplicate")),
      brandCollision: APPS.filter(a=>a.f.includes("brand-collision")),
    };
    return (
      <div>
        {/* Issue panels */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
          {[
            {key:"zombie",label:"Zombies",color:V.red,icon:<Flame size={13}/>},
            {key:"duplicate",label:"Duplicates",color:V.amber,icon:<Copy size={13}/>},
            {key:"brandCollision",label:"Brand Collisions",color:V.magenta,icon:<AlertTriangle size={13}/>},
          ].map(({key,label,color,icon})=>(
            <div key={key} style={{...card,borderColor:`${color}33`,background:`${color}08`}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8,color}}>
                {icon}<span style={{fontWeight:600,fontSize:12}}>{label}</span>
                <span style={{marginLeft:"auto",fontWeight:700}}>{groupedIssues[key].length}</span>
              </div>
              {groupedIssues[key].map(a=>(
                <div key={a.id} style={{fontSize:11,color:V.t3,padding:"3px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  {a.dn}
                  <span style={{float:"right",color:V.t4,fontSize:10}}>{a.p==="b44"?"B44":"Lovable"}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Batch actions */}
        <div style={{...card,marginBottom:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:V.t3,fontWeight:500}}>Batch quick-assign:</span>
          {[
            {label:"Archive all zombies",ids:APPS.filter(a=>a.s==="zombie").map(a=>a.id),d:"archive",color:V.red},
            {label:"Archive all dupes",ids:APPS.filter(a=>a.f.includes("duplicate")).map(a=>a.id),d:"archive",color:V.amber},
            {label:"Keep all production",ids:APPS.filter(a=>a.s==="prod").map(a=>a.id),d:"keep",color:V.green},
            {label:"Investigate all parked",ids:APPS.filter(a=>a.s==="parked").map(a=>a.id),d:"investigate",color:V.t3},
          ].map(({label,ids,d,color})=>(
            <button key={label} onClick={()=>setAllDecision(ids,d)}
              style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${color}44`,background:`${color}11`,color,fontSize:11,cursor:"pointer"}}>
              {label} ({ids.length})
            </button>
          ))}
        </div>

        {/* Decision table */}
        <div style={{...card,padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${V.border}`}}>
                  {["App","Platform","Lane","Decision","Priority","Migrate","WSJF","Actions"].map(h=>(
                    <th key={h} style={{padding:"10px 12px",textAlign:"left",color:V.t4,fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {APPS.map(a => {
                  const m = meta[a.id];
                  const lc = LANES[m.lane];
                  return (
                    <tr key={a.id} style={{borderBottom:`1px solid ${V.border}11`,transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=V.s3}
                      onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <td style={{padding:"8px 12px"}}>
                        <div style={{color:V.t1,fontWeight:500,lineHeight:1.3,maxWidth:180}}>{a.dn}</div>
                        {a.f.length>0 && <div style={{fontSize:9,color:V.red,marginTop:2}}>{a.f.join(" · ")}</div>}
                      </td>
                      <td style={{padding:"8px 12px",whiteSpace:"nowrap"}}>
                        {pill(a.p==="b44"?"B44":"Lovable",a.p==="b44"?V.violet:V.cyan,a.p==="b44"?"rgba(168,85,247,0.12)":"rgba(34,211,238,0.12)")}
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <select value={m.lane} onChange={e=>updateMeta(a.id,{lane:e.target.value})}
                          style={{...sel,fontSize:10,padding:"2px 6px",color:lc?.color}}>
                          {Object.entries(LANES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {Object.entries(DECISIONS).map(([d,cfg])=>(
                            <button key={d} onClick={()=>updateMeta(a.id,{decision:m.decision===d?null:d})}
                              style={{padding:"1px 5px",borderRadius:4,border:`1px solid ${m.decision===d?cfg.color:"rgba(255,255,255,0.06)"}`,background:m.decision===d?cfg.bg:"transparent",color:m.decision===d?cfg.color:V.t4,fontSize:9,cursor:"pointer"}}>
                              {cfg.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <select value={m.priority||""} onChange={e=>updateMeta(a.id,{priority:e.target.value||null})}
                          style={{...sel,fontSize:10,padding:"2px 6px",color:m.priority?PRIORITIES[m.priority].color:V.t4}}>
                          <option value="">—</option>
                          {["P0","P1","P2","P3"].map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td style={{padding:"8px 12px",textAlign:"center"}}>
                        <input type="checkbox" checked={m.migration} onChange={e=>updateMeta(a.id,{migration:e.target.checked})}
                          style={{accentColor:V.cyan,cursor:"pointer"}}/>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <input type="number" min="1" max="21" placeholder="1-21" value={m.wsjf||""}
                          onChange={e=>updateMeta(a.id,{wsjf:e.target.value?parseInt(e.target.value):null})}
                          style={{...input,width:50,textAlign:"center",padding:"2px 6px"}}/>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <div style={{display:"flex",gap:4,alignItems:"center"}}>
                          <button onClick={()=>setModal({type:"chain",appId:a.id})}
                            style={{padding:"2px 7px",borderRadius:4,border:`1px solid rgba(168,85,247,0.3)`,background:"rgba(168,85,247,0.08)",color:V.violet,fontSize:9,cursor:"pointer"}}>
                            Chain
                          </button>
                          {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{color:V.t4}}><ExternalLink size={10}/></a>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── SPRINT TAB ────────────────────────────────────────────────────
  const renderSprint = () => {
    const byPriority = (p) => APPS.filter(a=>meta[a.id].priority===p).sort((a,b)=>(meta[b.id].wsjf||0)-(meta[a.id].wsjf||0));
    const unassigned = APPS.filter(a=>!meta[a.id].priority);
    const topWSJF = [...APPS].filter(a=>meta[a.id].wsjf).sort((a,b)=>(meta[b.id].wsjf||0)-(meta[a.id].wsjf||0)).slice(0,8);
    const migCandidates = APPS.filter(a=>meta[a.id].migration);

    return (
      <div>
        {/* Summary row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {Object.entries(PRIORITIES).map(([p,cfg])=>(
            <div key={p} style={{...card,borderColor:`${cfg.color}44`,textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:cfg.color}}>{byPriority(p).length}</div>
              <div style={{fontSize:11,color:cfg.color,fontWeight:600}}>{p}</div>
            </div>
          ))}
        </div>

        {/* WSJF + Priority columns */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:14}}>
          {/* Priority board */}
          <div style={{...card}}>
            <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10,display:"flex",justifyContent:"space-between"}}>
              <span>Priority Board</span>
              <span style={{fontSize:10,color:V.t4}}>{APPS.length-unassigned.length} assigned</span>
            </div>
            {Object.entries(PRIORITIES).map(([p,cfg])=>{
              const apps = byPriority(p);
              return (
                <div key={p} style={{marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:cfg.color,marginBottom:4,display:"flex",justifyContent:"space-between"}}>
                    {p} <span style={{color:V.t4}}>{apps.length} apps</span>
                  </div>
                  {apps.length===0 ? <div style={{fontSize:10,color:V.t4,padding:"4px 0"}}>— none assigned</div> :
                    apps.map(a=>(
                      <div key={a.id} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0",borderBottom:`1px solid ${V.border}44`}}>
                        <span style={{fontSize:10,color:V.t2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.dn}</span>
                        {meta[a.id].wsjf && <span style={{fontSize:9,color:cfg.color,fontWeight:600}}>W{meta[a.id].wsjf}</span>}
                        <span style={{fontSize:9,color:a.p==="b44"?V.violet:V.cyan}}>{a.p==="b44"?"B44":"LV"}</span>
                      </div>
                    ))
                  }
                </div>
              );
            })}
          </div>

          {/* WSJF Leaderboard + Migration */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{...card,flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>WSJF Leaderboard</div>
              {topWSJF.length===0
                ? <div style={{fontSize:11,color:V.t4}}>Set WSJF scores in the Cleanup tab to build the backlog.</div>
                : topWSJF.map((a,i)=>{
                  const m = meta[a.id];
                  return (
                    <div key={a.id} style={{display:"flex",gap:8,alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${V.border}33`}}>
                      <span style={{fontSize:10,color:V.t4,minWidth:16,fontFamily:"monospace"}}>#{i+1}</span>
                      <span style={{fontSize:10,color:V.t1,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.dn}</span>
                      <span style={{fontSize:11,fontWeight:700,color:V.cyan}}>{m.wsjf}</span>
                      {m.priority && pill(m.priority,PRIORITIES[m.priority].color,PRIORITIES[m.priority].bg,9)}
                    </div>
                  );
                })
              }
            </div>
            <div style={{...card}}>
              <div style={{fontSize:12,fontWeight:600,color:V.cyan,marginBottom:8,display:"flex",gap:6,alignItems:"center"}}>
                <ArrowRightLeft size={13}/> Migration Candidates ({migCandidates.length})
              </div>
              {migCandidates.length===0
                ? <div style={{fontSize:11,color:V.t4}}>Toggle "Migrate" on app cards to flag candidates.</div>
                : migCandidates.map(a=>(
                  <div key={a.id} style={{display:"flex",gap:6,alignItems:"center",padding:"3px 0"}}>
                    <span style={{fontSize:10,color:V.t2,flex:1}}>{a.dn}</span>
                    <span style={{fontSize:9,color:a.p==="b44"?V.violet:V.cyan}}>{a.p==="b44"?"B44":"Lovable"}</span>
                    <button onClick={()=>setModal({type:"chain",appId:a.id})}
                      style={{padding:"1px 6px",borderRadius:3,border:`1px solid rgba(34,211,238,0.3)`,background:"rgba(34,211,238,0.08)",color:V.cyan,fontSize:9,cursor:"pointer"}}>
                      Chain
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Unassigned pool */}
        <div style={{...card}}>
          <div style={{fontSize:12,fontWeight:600,color:V.t3,marginBottom:10}}>
            Unassigned ({unassigned.length}) — assign priority in Cleanup tab or click inline
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:6}}>
            {unassigned.map(a=>{
              const m = meta[a.id];
              return (
                <div key={a.id} style={{background:V.s3,border:`1px solid ${V.border}`,borderRadius:7,padding:"8px 10px"}}>
                  <div style={{fontSize:11,color:V.t2,fontWeight:500,marginBottom:5,lineHeight:1.3}}>{a.dn}</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {["P0","P1","P2","P3"].map(p=>(
                      <button key={p} onClick={()=>updateMeta(a.id,{priority:p})}
                        style={{padding:"1px 5px",borderRadius:3,border:`1px solid ${PRIORITIES[p].color}44`,background:"transparent",color:PRIORITIES[p].color,fontSize:9,cursor:"pointer",fontWeight:600}}>
                        {p}
                      </button>
                    ))}
                    <button onClick={()=>setModal({type:"chain",appId:a.id})}
                      style={{padding:"1px 5px",borderRadius:3,border:`1px solid rgba(168,85,247,0.3)`,background:"transparent",color:V.violet,fontSize:9,cursor:"pointer",marginLeft:"auto"}}>
                      Chain
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:V.s1,fontFamily:"'Geist',system-ui,sans-serif",color:V.t2,position:"relative"}}>
      {/* Header */}
      <div style={{background:V.s2,borderBottom:`1px solid ${V.border}`,padding:"16px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <span style={{fontWeight:700,fontSize:15,color:V.t1,letterSpacing:-0.3}}>
              <span style={{background:`linear-gradient(135deg,${V.violet},${V.magenta})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                FlashFusion
              </span>{" "}App Ops Center
            </span>
            <span style={{fontSize:11,color:V.t4,marginLeft:10}}>70 apps · B44 × Lovable</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved && <span style={{fontSize:10,color:V.green}}>Saved ✓</span>}
            <button onClick={()=>setModal({type:"cleanup"})} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:11,cursor:"pointer"}}>
              Export Cleanup
            </button>
            <button onClick={()=>setModal({type:"sprint"})} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:11,cursor:"pointer"}}>
              Export Sprint
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:0}}>
          {[
            {id:"dashboard",icon:<LayoutDashboard size={13}/>,label:"Dashboard"},
            {id:"cleanup",icon:<Trash2 size={13}/>,label:`Cleanup · ${stats.decided}/${stats.total} decided`},
            {id:"sprint",icon:<Zap size={13}/>,label:"Sprint Board"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"8px 16px",borderRadius:"6px 6px 0 0",border:"none",borderBottom:tab===t.id?`2px solid ${V.violet}`:"2px solid transparent",background:tab===t.id?V.s1:"transparent",color:tab===t.id?V.t1:V.t4,fontSize:12,fontWeight:tab===t.id?600:400,cursor:"pointer",display:"flex",gap:6,alignItems:"center",transition:"all 0.15s"}}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"18px 20px 40px"}}>
        {tab==="dashboard" && renderDashboard()}
        {tab==="cleanup"   && renderCleanup()}
        {tab==="sprint"    && renderSprint()}
      </div>

      {/* Modal */}
      {modal && renderModal()}
    </div>
  );
}
