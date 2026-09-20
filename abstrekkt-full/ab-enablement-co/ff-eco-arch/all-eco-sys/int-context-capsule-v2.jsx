import { useState, useEffect, useRef, useCallback } from "react";

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* Reduced motion — gate animations */
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}

/* Focus ring — 2px teal, visible only on keyboard */
:focus-visible{outline:2px solid #0d9488;outline-offset:2px;border-radius:4px}
:focus:not(:focus-visible){outline:none}

/* Skip link */
.skip-link{position:absolute;left:-9999px;top:8px;z-index:9999;background:#040b09;color:#5eead4;padding:8px 16px;border:1px solid #0d9488;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:12px;text-decoration:none;white-space:nowrap}
.skip-link:focus{left:8px}

/* Scrollbar */
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#07100e}
::-webkit-scrollbar-thumb{background:#0f2923;border-radius:2px}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Interactive states */
.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
.field-card{transition:border-color .2s}.field-card:hover{border-color:#0f3028!important}
.nav-btn{transition:all .15s}.nav-btn:hover{background:#0a1f1a!important;color:#5eead4!important}
textarea:focus-visible,input:focus-visible,select:focus-visible{border-color:#0d9488!important;box-shadow:0 0 0 2px #0d948818!important}
.tag-pill:hover{background:#0f2923!important;color:#5eead4!important}
.filter-pill{cursor:pointer;transition:all .15s;border:none;font-family:'JetBrains Mono',monospace}
.filter-pill:hover{filter:brightness(1.2)}
.toast-item{animation:toastIn .2s ease}
.collapse-btn:hover{color:#5eead4!important}

/* Responsive */
@media(max-width:639px){
  .sidebar-desktop{display:none!important}
  .bottom-tabs{display:flex!important}
  .content-area{padding:16px 12px 80px!important}
  .two-col{grid-template-columns:1fr!important}
  .three-col{grid-template-columns:1fr!important}
  .four-stat{grid-template-columns:1fr 1fr!important}
  .topbar-title{font-size:11px!important;max-width:140px!important}
}
@media(min-width:640px){.bottom-tabs{display:none!important}}
`;

// ── TOKEN MAPS ────────────────────────────────────────────────────────────────
const STATUS_C = {
  live:{bg:"#052e16",text:"#4ade80",border:"#166534"},
  pilot:{bg:"#042f2e",text:"#2dd4bf",border:"#0f766e"},
  deployed:{bg:"#042f2e",text:"#34d399",border:"#065f46"},
  draft:{bg:"#1c1917",text:"#a8a29e",border:"#292524"},
  spec:{bg:"#1e1b4b",text:"#a5b4fc",border:"#3730a3"},
  unbuilt:{bg:"#431407",text:"#fb923c",border:"#9a3412"},
  planning:{bg:"#1c1917",text:"#78716c",border:"#292524"},
  created:{bg:"#082f49",text:"#38bdf8",border:"#0369a1"},
  reference:{bg:"#131211",text:"#78716c",border:"#292524"},
};
const PRIORITY_C = {
  high:{bg:"#450a0a",text:"#f87171",border:"#7f1d1d"},
  medium:{bg:"#422006",text:"#fb923c",border:"#7c2d12"},
  low:{bg:"#042f2e",text:"#5eead4",border:"#0f766e"},
};
const HORIZON_C = {
  immediate:{bg:"#450a0a",text:"#fca5a5",border:"#7f1d1d"},
  near:{bg:"#1a2e05",text:"#86efac",border:"#365314"},
  mid:{bg:"#082f49",text:"#7dd3fc",border:"#075985"},
};
const STATUSES = Object.keys(STATUS_C);

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const INT_SEED = {
  meta:{
    sessionTitle:"INT Inc. AI Platform Transformation — Live Context",
    sourceProject:"INT Inc. Claude Project",
    destinationProject:"",
    date:new Date().toISOString().split("T")[0],
    version:"1.0",
    owner:"Kyle Rosebrook — Staff Engineer (AppSec + Platform)",
    customInstructionsVersion:"v2.2 (deployed March 3, 2026)",
  },
  assets:[
    {id:"a1",name:"Newsletter System — 3-Tier Company-Wide",track:"Newsletter",status:"pilot",
     description:"Non-Tech / Tech Dept / AI Team editions. Weekly. 19 editions from shared research corpus via n8n. Pilot Wks 11–12: InfoSec, Sales, Content.",
     nextMilestone:"Week 16 → 9 depts. Week 20 → full 16-dept coverage.",blockers:"None — on schedule."},
    {id:"a2",name:"Platform Explorer v4.0",track:"Platform Explorer",status:"draft",
     description:"40KB single-file HTML, 16 AI platforms, 5 tabs. Audit: 75/100 (Master), 15/100 (PWA). Superseded by v5.x.",
     nextMilestone:"No further work — deprecated.",blockers:"None."},
    {id:"a3",name:"Platform Explorer v5.1",track:"Platform Explorer",status:"spec",
     description:"Spec refreshed (Assets 3–6). v5.1 audited — production blockers identified. ~10hrs to ship. Strategic pivot to platform-agnostic enterprise navigator.",
     nextMilestone:"~10hr hardening block to reach production.",blockers:"~10hrs unscheduled. Required before v6.0."},
    {id:"a4",name:"AIaaS Dashboard Generator",track:"Dashboard",status:"unbuilt",
     description:"Fully specced exec decision support. TCO modeling, CPRA metrics, agentic governance. All blockers resolved. HIGHEST-LEVERAGE unblocked asset.",
     nextMilestone:"Build. Spec is complete.",blockers:"None — all prior blockers resolved."},
    {id:"a5",name:"72-Persona Library",track:"Personas",status:"reference",
     description:"23 client + 49 internal personas across 7 service lines. Refreshed with 3 new. Not validated against real interactions.",
     nextMilestone:"Validation against client interaction data.",blockers:"No validation methodology defined."},
    {id:"a6",name:"Prompt Engineering System v2.0",track:"Infrastructure",status:"created",
     description:"5 templates, test suite, CI/CD config. R-I-S-E, F-L-O-W, 4-Agent validation. Created but NOT deployed — CI/CD not running.",
     nextMilestone:"Deploy CI/CD pipeline. Confirm tests run.",blockers:"Deployment not scheduled."},
    {id:"a7",name:"Custom Instructions v2.2",track:"Infrastructure",status:"deployed",
     description:"Deployed March 3, 2026. Security-first, analogy-driven, 4-Agent validation pattern. Next review May 21, 2026.",
     nextMilestone:"Quarterly review May 21, 2026.",blockers:"None."},
    {id:"a8",name:"Universal Dashboard Engine",track:"Dashboard",status:"planning",
     description:"22-week timeline. 13 departments, 63KB roadmap, ~$377K estimate. No implementation started.",
     nextMilestone:"Unblocked after AIaaS Dashboard Generator ships.",blockers:"Sequenced after Dashboard Generator."},
    {id:"a9",name:"Platform Explorer v6.0 (concept)",track:"Platform Explorer",status:"spec",
     description:"Platform-agnostic Enterprise Multi-Platform Edition. Longer-horizon build. Requires v5.1 as prerequisite.",
     nextMilestone:"Define spec after v5.1 ships.",blockers:"Blocked until v5.1 production-ready."},
    {id:"a10",name:"Customer-Facing Sales Infrastructure",track:"GTM",status:"unbuilt",
     description:"Gap: sales decks, service catalogs, ROI calculators, AI readiness assessment. Internal platform strong — revenue conversion is the bottleneck.",
     nextMilestone:"Sales deck → service catalog → ROI calculator (in order).",blockers:"Not yet in active sprint."},
  ],
  decisions:[
    {id:"d1",decision:"Platform-agnostic over Claude-specialist positioning",rationale:"Enterprises need multi-platform guidance. Claude-specialist = ceiling. Platform-agnostic = compounding moat.",alternatives:"Double down on Claude expertise as primary differentiator.",locked:true},
    {id:"d2",decision:"3-dept pilot before full 16-dept newsletter rollout",rationale:"De-risks n8n pipeline and prompt logic before scaling. W11-12 pilot → W16 at 9 → W20 full.",alternatives:"Launch all 16 departments simultaneously.",locked:true},
    {id:"d3",decision:"AIaaS Dashboard Generator = highest-leverage next build",rationale:"Fully specced, no blockers. Every week unbuilt is missed revenue. Precedes Universal Dashboard Engine.",alternatives:"v5.1 Platform Explorer hardening first.",locked:false},
    {id:"d4",decision:"Sales infrastructure gap = highest-priority strategic risk",rationale:"Internal platforms are strong. The bottleneck is converting capability into external revenue.",alternatives:"Continue internal tooling before customer-facing assets.",locked:false},
    {id:"d5",decision:"v5.1 hardening before v6.0 multi-platform build",rationale:"Can't build v6.0 on a spec/draft foundation. v5.1 10hr scope is bounded.",alternatives:"Greenfield v6.0 and deprecate v5.x entirely.",locked:true},
    {id:"d6",decision:"Revenue: 60% managed services / 20% SaaS / 20% partner channel",rationale:"Managed services provides stable base while SaaS and partner channels scale toward $12M ARR.",alternatives:"Pure SaaS pivot.",locked:true},
    {id:"d7",decision:"Prompts are production systems — versioned, tested, auditable",rationale:"Ad hoc prompts = technical debt. CI/CD pipeline ensures consistency across all 72 personas.",alternatives:"Treat prompts as ephemeral operational tools.",locked:true},
  ],
  openThreads:[
    {id:"t1",thread:"BUILD: AIaaS Dashboard Generator",priority:"high",horizon:"immediate",context:"Fully specced. TCO modeling, CPRA, agentic governance. All blockers resolved. Open spec and build — no further planning needed.",nextAction:"Open AIaaS Dashboard Generator spec. Build.",owner:"Kyle"},
    {id:"t2",thread:"Platform Explorer v5.1 — production hardening",priority:"high",horizon:"immediate",context:"~10hrs of fixes from audit. Scope is bounded. Must ship before v6.0.",nextAction:"Schedule 10-hour block. Execute against identified blockers.",owner:"Kyle"},
    {id:"t3",thread:"HumanX Conference Prep (April 6–9)",priority:"high",horizon:"immediate",context:"Confirmed gaps: multi-tenant isolation, Gemini API (image gen, TTS, video), InVelo. Hard deadline.",nextAction:"Identify sessions. Build prep materials for confirmed gaps.",owner:"Kyle"},
    {id:"t4",thread:"Customer-facing sales infrastructure",priority:"high",horizon:"near",context:"Gap: sales decks, catalogs, ROI calcs, AI readiness tools. High ROI on modest investment.",nextAction:"Sales deck first. Then service catalog. Then ROI calculator.",owner:"Kyle"},
    {id:"t5",thread:"Newsletter rollout: pilot → full coverage",priority:"medium",horizon:"near",context:"W11-12: 3-dept pilot. W16: 9 depts. W20: 16 depts. n8n powers 19 editions from one corpus.",nextAction:"Evaluate pilot at Wk 12. Confirm Wk 16 expansion list.",owner:"Kyle"},
    {id:"t6",thread:"Prompt Engineering System — deploy CI/CD",priority:"medium",horizon:"near",context:"Created (5 templates, test suite, CI/CD config) but NOT deployed. Contradicts 'prompts are prod systems' decision.",nextAction:"Deploy CI/CD. Run test suite. Confirm production operation.",owner:"Kyle"},
    {id:"t7",thread:"Platform Explorer v6.0 — multi-platform enterprise",priority:"medium",horizon:"mid",context:"Blocked until v5.1 ships. Requires new spec post v5.1.",nextAction:"Blocked. Revisit after v5.1 ships.",owner:"Kyle"},
    {id:"t8",thread:"Skyflow + Gemini API implementation",priority:"medium",horizon:"mid",context:"Gaps: Skyflow data vault patterns, Gemini image gen/TTS/video code. Relevant for HumanX + consulting.",nextAction:"Skyflow first (compliance). Gemini second (HumanX gap).",owner:"Kyle"},
    {id:"t9",thread:"InVelo — pre-validation to launch",priority:"medium",horizon:"mid",context:"Pre-validation stage. Moving toward launch. Validation criteria not yet defined.",nextAction:"Define validation criteria. Build validation test plan.",owner:"Kyle"},
  ],
  projectKnowledge:[
    {id:"k1",file:"Custom Instructions v2.1 / v2.2",type:"Custom Instructions",relevance:"high",keyInsights:"8-tier response framework. ZDR, RBAC, RLS, prompt injection defense non-negotiable. No compliance certs — flag before claiming in client materials. No prod assets deployed for client use.",usedFor:"Governs every Claude session. Auto-search on 6 trigger patterns. Auto-flag data >60 days stale."},
    {id:"k2",file:"n8n Newsletter Pipeline",type:"Pipeline Config",relevance:"high",keyInsights:"Single shared research corpus → 19 dept-specific editions. Claude API for dept prompt gen. Pilot: InfoSec, Sales, Content (Wks 11-12).",usedFor:"Powers newsletter system. Expandable to full 16-dept coverage by Wk 20."},
    {id:"k3",file:"Newsletter System Reference Doc",type:"Reference Doc",relevance:"high",keyInsights:"19 editions. 3-tier company-wide + 16-dept. Pilot 3 depts (W11-12) → 9 (W16) → 16 (W20). Refreshed Assets 3-6.",usedFor:"Rollout planning and n8n pipeline config."},
    {id:"k4",file:"AIaaS Dashboard Generator Spec v4.0",type:"Spec Doc",relevance:"high",keyInsights:"TCO modeling. CPRA metrics. Agentic governance. Executive decision support. Fully specced — ready to build.",usedFor:"Blueprint for next build. Open immediately when starting Dashboard session."},
    {id:"k5",file:"Universal Dashboard Engine Roadmap (63KB)",type:"Roadmap",relevance:"medium",keyInsights:"13 departments, 10 phases, 22-week timeline, ~$377K estimate. No implementation started.",usedFor:"Long-range planning. Reference after Dashboard Generator ships."},
    {id:"k6",file:"72-Persona Library",type:"Reference Doc",relevance:"medium",keyInsights:"23 client + 49 internal personas. 7 service lines. Not validated against real interactions — flag in client materials.",usedFor:"Newsletter personalization, sales targeting, prompt engineering system."},
    {id:"k7",file:"Strategic Expansion Analysis",type:"Reference Doc",relevance:"medium",keyInsights:"5 opportunities: AI Compliance Automation, Cloud FinOps, Internal AI, Enterprise AI Consulting, Fractional CMO. ROI projections are models — unvalidated.",usedFor:"Sales positioning, GTM strategy, HumanX conference prep."},
    {id:"k8",file:"MCP Server Connections (25+)",type:"Pipeline Config",relevance:"medium",keyInsights:"Active: Atlassian, Cloudflare, Stripe, Canva, Notion, Sentry, Intercom, Zapier, Netlify, Figma, n8n, Linear, HubSpot, Vercel, Plaid, Monday.com, Playwright, Supabase + more.",usedFor:"Integration orchestration. n8n as primary automation layer."},
  ],
  nextSessionPrimer:"",
  tags:["int-inc","msp-to-aipaas","newsletter","platform-explorer","aiass-dashboard","personas","appsec","n8n","custom-instructions","gtm-gap","humanx-2026"],
};

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function filterItems(items, filterMap, search, searchFields) {
  return items.filter(item => {
    for (const [k,v] of Object.entries(filterMap)) {
      if (v !== "all" && item[k] !== v) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return searchFields.some(f => (item[f]||"").toLowerCase().includes(q));
    }
    return true;
  });
}

function moveItem(arr, id, dir) {
  const idx = arr.findIndex(i => i.id === id);
  if (dir === "up" && idx === 0) return arr;
  if (dir === "down" && idx === arr.length - 1) return arr;
  const next = [...arr];
  const swap = dir === "up" ? idx - 1 : idx + 1;
  [next[idx], next[swap]] = [next[swap], next[idx]];
  return next;
}

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
function SkipLink() {
  return <a href="#main-content" className="skip-link">Skip to main content</a>;
}

function ToastItem({ t, onDismiss }) {
  const colors = t.type === "warn"
    ? { bg:"#422006", border:"#7c2d12", text:"#fed7aa" }
    : { bg:"#042f2e", border:"#0f766e", text:"#a7f3d0" };
  return (
    <div role="status" aria-live="polite" className="toast-item" style={{
      background:colors.bg, border:`1px solid ${colors.border}`, borderRadius:8,
      padding:"10px 14px", display:"flex", alignItems:"center", gap:10,
      fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:colors.text,
      maxWidth:320, boxShadow:"0 4px 20px #000a",
    }}>
      <span style={{flex:1}}>{t.msg}</span>
      {t.action && (
        <button type="button" onClick={()=>{t.action.fn();onDismiss(t.id);}}
          style={{background:"transparent",border:`1px solid ${colors.border}`,borderRadius:4,
            padding:"3px 8px",color:colors.text,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
          {t.action.label}
        </button>
      )}
      <button type="button" aria-label="Dismiss notification" onClick={()=>onDismiss(t.id)}
        style={{background:"transparent",border:"none",color:colors.text,cursor:"pointer",fontSize:14,padding:"0 2px"}}>
        ×
      </button>
    </div>
  );
}

function ToastList({ toasts, onDismiss }) {
  return (
    <div aria-label="Notifications" style={{
      position:"fixed", bottom:80, right:16, zIndex:500,
      display:"flex", flexDirection:"column", gap:6,
    }}>
      {toasts.map(t => <ToastItem key={t.id} t={t} onDismiss={onDismiss} />)}
    </div>
  );
}

function Badge({ label, colors }) {
  return (
    <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,
      background:colors.bg,color:colors.text,border:`1px solid ${colors.border}`,
      fontFamily:"'JetBrains Mono',monospace",letterSpacing:.5,flexShrink:0,whiteSpace:"nowrap"}}>
      {label}
    </span>
  );
}

function FieldLabel({ children, id }) {
  return (
    <label htmlFor={id} style={{
      display:"block", fontSize:9, color:"#14b8a6",
      fontFamily:"'JetBrains Mono',monospace", marginBottom:5,
      letterSpacing:1.2, textTransform:"uppercase", cursor:"default",
    }}>
      {children}
    </label>
  );
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="", ariaLabel, fieldId }) {
  return (
    <textarea id={fieldId} value={value} onChange={e=>onChange(e.target.value)}
      rows={rows} placeholder={placeholder} aria-label={ariaLabel}
      style={{width:"100%",background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,
        padding:"9px 11px",color:"#94a3b8",fontSize:12,lineHeight:1.65,resize:"vertical",
        fontFamily:mono?"'JetBrains Mono',monospace":"'Bricolage Grotesque',sans-serif",
        transition:"border-color .2s", minHeight:36*rows}}
    />
  );
}

function FilterBar({ label, filters, setFilters, options, search, setSearch, searchPlaceholder }) {
  return (
    <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        {options.map(({key,values}) => (
          <div key={key} style={{display:"flex",gap:4,flexWrap:"wrap"}} role="group" aria-label={`Filter by ${key}`}>
            {["all",...values].map(v => {
              const active = filters[key]===v;
              return (
                <button key={v} type="button" className="filter-pill"
                  aria-pressed={active}
                  onClick={()=>setFilters(p=>({...p,[key]:v}))}
                  style={{padding:"4px 10px",borderRadius:20,fontSize:9,
                    background:active?"#0f766e22":"#0a1f1a",
                    color:active?"#5eead4":"#64748b",
                    border:`1px solid ${active?"#0f766e":"#0f2420"}`,
                    letterSpacing:.5}}>
                  {v}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {setSearch && (
        <div style={{position:"relative"}}>
          <label htmlFor={`search-${label}`} style={{position:"absolute",left:-9999}}>Search {label}</label>
          <input id={`search-${label}`} type="search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder={searchPlaceholder||`Search ${label}…`}
            style={{width:"100%",maxWidth:320,background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,
              padding:"6px 10px 6px 28px",color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}
          />
          <span aria-hidden="true" style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#1e4039",fontSize:11}}>⌕</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, label, count }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
      <span aria-hidden="true" style={{fontSize:16}}>{icon}</span>
      <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,color:"#e2e8f0",fontSize:15,letterSpacing:"-.3px"}}>{label}</h2>
      {count!==undefined && (
        <span aria-label={`${count} items`} style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:"#0a1f1a",color:"#2dd4bf",
          fontFamily:"'JetBrains Mono',monospace",border:"1px solid #0f3028"}}>{count}</span>
      )}
    </div>
  );
}

function AddButton({ onClick, label="+ add" }) {
  return (
    <button type="button" className="btn" onClick={onClick} style={{
      background:"transparent",border:"1px dashed #0f3028",borderRadius:10,
      padding:"12px",color:"#1e4039",cursor:"pointer",fontSize:12,
      fontFamily:"'JetBrains Mono',monospace",transition:"all .2s",width:"100%",
      minHeight:44}}>
      {label}
    </button>
  );
}


// ── DELETE BUTTON (module scope) ──────────────────────────────────────────────
function DeleteBtn({arr,id,label,confirmingDelete,onDelete,onRequest,onCancel}) {
  const key=`${arr}-${id}`;
  const isConfirming=confirmingDelete===key;
  return isConfirming ? (
    <div style={{display:"flex",gap:4}}>
      <button type="button" onClick={()=>onDelete(arr,id)}
        aria-label={`Confirm remove ${label}`}
        style={{fontSize:9,padding:"3px 7px",borderRadius:4,background:"#450a0a",border:"1px solid #7f1d1d",color:"#f87171",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>
        del?
      </button>
      <button type="button" onClick={onCancel}
        aria-label="Cancel remove"
        style={{fontSize:9,padding:"3px 7px",borderRadius:4,background:"#042f2e",border:"1px solid #0f766e",color:"#5eead4",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>
        &#x2715;
      </button>
    </div>
  ) : (
    <button type="button" onClick={()=>onRequest(arr,id)}
      aria-label={`Remove ${label}`}
      style={{background:"transparent",border:"none",color:"#1e4039",cursor:"pointer",fontSize:14,padding:"4px 6px",borderRadius:4,minWidth:28,minHeight:28}}
      className="collapse-btn">&#x00D7;</button>
  );
}

// ── COLLAPSIBLE CARD (module scope) ───────────────────────────────────────────
function CollapsibleCard({id,headerContent,children,isCollapsed,onToggle,extraStyle}) {
  const contentId=`card-content-${id}`;
  const s=extraStyle||{};
  return (
    <div className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,overflow:"hidden",
      ...s}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 18px",cursor:"pointer"}}
        onClick={()=>onToggle(id)}>
        <button type="button" className="collapse-btn"
          aria-expanded={!isCollapsed} aria-controls={contentId}
          aria-label={isCollapsed?"Expand card":"Collapse card"}
          onClick={e=>{e.stopPropagation();onToggle(id);}}
          style={{background:"transparent",border:"none",color:"#1e4039",cursor:"pointer",
            fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:"2px 4px",
            transform:isCollapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform .2s",
            minWidth:20,minHeight:20,flexShrink:0}}>
          &#x25BE;
        </button>
        {headerContent}
      </div>
      <div id={contentId} hidden={isCollapsed} style={{padding:"0 18px 16px"}}>
        {children}
      </div>
    </div>
  );
}

// ── NAV SIDEBAR (module scope) ────────────────────────────────────────────────
function NavSidebar({NAV,activeSection,setActiveSection,liveCount,unbuiltCount,highCount,onSelect}) {
  return (
    <nav aria-label="Section navigation" role="navigation">
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {NAV.map(n=>(
          <button key={n.id} type="button" className="nav-btn"
            aria-current={activeSection===n.id?"page":undefined}
            onClick={()=>{setActiveSection(n.id);if(onSelect)onSelect();}}
            style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:7,
              background:activeSection===n.id?"#0a1f1a":"transparent",
              border:"1px solid "+(activeSection===n.id?"#0f3028":"transparent"),
              color:activeSection===n.id?"#5eead4":"#64748b",
              cursor:"pointer",fontSize:12,fontFamily:"'Bricolage Grotesque',sans-serif",
              fontWeight:activeSection===n.id?600:400,textAlign:"left",
              minHeight:40,width:"100%"}}>
            <span aria-hidden="true" style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{n.icon}</span>
            <span style={{flex:1}}>{n.label}</span>
            {n.count!==undefined&&<span aria-hidden="true" style={{fontSize:9,color:"#1e4039",fontFamily:"'JetBrains Mono',monospace"}}>{n.count}</span>}
            {n.hint&&<span style={{fontSize:8,color:n.hint==="ready"?"#4ade80":"#f87171",fontFamily:"'JetBrains Mono',monospace"}}>{n.hint}</span>}
          </button>
        ))}
      </div>
      <div style={{marginTop:16,paddingTop:12,borderTop:"1px solid #0a1f1a",display:"flex",flexDirection:"column",gap:5}}>
        {[{l:"live/pilot",v:liveCount,c:"#10b981"},{l:"unbuilt",v:unbuiltCount,c:"#f87171"},{l:"high pri",v:highCount,c:"#fbbf24"}]
          .map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:9,color:"#1e4039",fontFamily:"'JetBrains Mono',monospace"}}>{s.l}</span>
              <span style={{fontSize:11,color:s.c,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{s.v}</span>
            </div>
          ))}
        <div style={{marginTop:6}}>
          <div style={{fontSize:8,color:"#1e4039",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>&#x2190; &#x2192; keys navigate</div>
        </div>
      </div>
    </nav>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function INTContextCapsule() {
  const [capsule, setCapsule] = useState(INT_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobile, setIsMobile] = useState(typeof window!=="undefined" && window.innerWidth<640);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [assetFilters, setAssetFilters] = useState({status:"all",track:"all"});
  const [threadFilters, setThreadFilters] = useState({priority:"all",horizon:"all"});
  const [assetSearch, setAssetSearch] = useState("");
  const [threadSearch, setThreadSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);
  const toastCounter = useRef(0);
  const mainRef = useRef(null);

  // Responsive
  useEffect(()=>{
    const onResize = ()=>setIsMobile(window.innerWidth<640);
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);

  // Keyboard nav between sections
  const NAV_IDS = ["overview","assets","decisions","threads","knowledge","primer","export"];
  useEffect(()=>{
    const onKey = e=>{
      if(["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName)) return;
      if(e.key==="ArrowRight"||e.key==="ArrowDown") {
        e.preventDefault();
        setActiveSection(s=>{const i=NAV_IDS.indexOf(s);return NAV_IDS[Math.min(i+1,NAV_IDS.length-1)];});
      } else if(e.key==="ArrowLeft"||e.key==="ArrowUp") {
        e.preventDefault();
        setActiveSection(s=>{const i=NAV_IDS.indexOf(s);return NAV_IDS[Math.max(i-1,0)];});
      } else if(e.key==="Escape") {
        setDrawerOpen(false);
        setConfirmingDelete(null);
      }
    };
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[]);

  // ── STATE HELPERS ──
  function addToast(msg, type="success", action=null) {
    const id=++toastCounter.current;
    setToasts(p=>[...p,{id,msg,type,action}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), type==="warn"?5000:2500);
    return id;
  }
  const dismissToast = id=>setToasts(p=>p.filter(t=>t.id!==id));

  function update(path,value){
    setCapsule(prev=>{
      const next=JSON.parse(JSON.stringify(prev));
      const keys=path.split(".");let obj=next;
      for(let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
      obj[keys[keys.length-1]]=value;
      return next;
    });
  }

  function updateArrItem(arr,id,field,value){
    setCapsule(prev=>({...prev,[arr]:prev[arr].map(item=>item.id===id?{...item,[field]:value}:item)}));
  }

  function addItem(arr,template){
    const newId=arr[0]+Date.now();
    setCapsule(prev=>({...prev,[arr]:[...prev[arr],{...template,id:newId}]}));
    setCollapsed(p=>({...p,[newId]:false}));
  }

  function requestDelete(arr,id){
    setConfirmingDelete(`${arr}-${id}`);
    setTimeout(()=>setConfirmingDelete(c=>c===`${arr}-${id}`?null:c),3000);
  }

  function doDelete(arr,id){
    const item=capsule[arr].find(i=>i.id===id);
    setCapsule(prev=>({...prev,[arr]:prev[arr].filter(i=>i.id!==id)}));
    setConfirmingDelete(null);
    const toastId=++toastCounter.current;
    setToasts(p=>[...p,{id:toastId,msg:"Item removed",type:"warn",action:{label:"Undo",fn:()=>{
      setCapsule(prev=>({...prev,[arr]:[...prev[arr],item]}));
      dismissToast(toastId);
      addToast("Restored","success");
    }}}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==toastId)),5000);
  }

  function moveThread(id,dir){
    setCapsule(prev=>({...prev,openThreads:moveItem(prev.openThreads,id,dir)}));
  }

  function addTag(){
    const t=tagInput.trim().toLowerCase().replace(/\s+/g,"-");
    if(t&&!capsule.tags.includes(t)) setCapsule(prev=>({...prev,tags:[...prev.tags,t]}));
    setTagInput("");
  }

  function toggleCollapsed(id){
    setCollapsed(p=>({...p,[id]:!p[id]}));
  }

  async function generatePrimer(){
    setGeneratingPrimer(true);
    try{
      const highThreads=capsule.openThreads.filter(t=>t.priority==="high");
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:
`Write a cold-start primer for the next Claude instance inheriting this INT Inc. AI transformation session.

CONTEXT:
- Owner: Kyle Rosebrook, Staff Engineer (AppSec+Platform), INT Inc. (55-person women-owned MSP, Lincolnshire IL)
- Mission: Transform INT Inc. MSP → hybrid AI Platform Services (AIaaS)
- Custom Instructions: ${capsule.meta.customInstructionsVersion}
- Security floor: ZDR for client data, RBAC+RLS, prompt injection defense, no hallucinations in client materials
- Response pattern: TL;DR → Analogy → Business Context → Architecture → Implementation → Quality Gates → Gaps → Critique → Sources

ACTIVE ASSETS (${capsule.assets.length} total):
${capsule.assets.slice(0,6).map(a=>`- ${a.name} [${a.status.toUpperCase()}]: ${a.description.slice(0,100)}`).join("\n")}

TOP OPEN THREADS (immediate):
${highThreads.map(t=>`- ${t.thread}: ${t.context.slice(0,120)}`).join("\n")}

LOCKED DECISIONS (do NOT re-litigate):
${capsule.decisions.filter(d=>d.locked).map(d=>`- ${d.decision}`).join("\n")}

Write 200-250 word cold-start primer:
1. Who Kyle is + INT Inc. mission (2 sentences)
2. Current build priority = AIaaS Dashboard Generator
3. 3 immediate open threads with specific next actions
4. 3 locked decisions not to re-litigate
5. HumanX hard deadline (April 6-9)
6. Custom Instructions version + key security floor
7. End: "Start here — do not re-derive context."

Direct, terse, no filler. Single paragraph block.`}]
        })
      });
      const d=await r.json();
      const txt=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      update("nextSessionPrimer",txt);
      setPrimerGenerated(true);
      addToast("Primer generated","success");
    }catch(e){
      update("nextSessionPrimer","Generation failed — write manually.");
      addToast("Generation failed","warn");
    }
    setGeneratingPrimer(false);
  }

  function exportJSON(){
    const payload={...capsule,meta:{...capsule.meta,exportedAt:new Date().toISOString(),schema:"int-context-capsule-v2"}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`int-context-capsule-${capsule.meta.date}.json`;a.click();
    URL.revokeObjectURL(url);
    setExported(true);setTimeout(()=>setExported(false),2000);
    addToast("JSON exported","success");
  }

  function copyJSON(){
    const payload={...capsule,meta:{...capsule.meta,exportedAt:new Date().toISOString(),schema:"int-context-capsule-v2"}};
    navigator.clipboard.writeText(JSON.stringify(payload,null,2));
    setCopied(true);setTimeout(()=>setCopied(false),2000);
    addToast("Copied to clipboard","success");
  }

  function copyPrimer(){
    navigator.clipboard.writeText(capsule.nextSessionPrimer);
    addToast("Primer copied","success");
  }

  // ── NAV CONFIG ──
  const liveCount=capsule.assets.filter(a=>["live","pilot","deployed"].includes(a.status)).length;
  const unbuiltCount=capsule.assets.filter(a=>a.status==="unbuilt").length;
  const highCount=capsule.openThreads.filter(t=>t.priority==="high").length;
  const completeness=[!!capsule.meta.sessionTitle,!!capsule.meta.destinationProject,
    capsule.assets.length>0,capsule.decisions.length>0,capsule.openThreads.length>0,!!capsule.nextSessionPrimer].filter(Boolean).length;
  const pct=Math.round((completeness/6)*100);

  const NAV=[
    {id:"overview",label:"Overview",icon:"◈",hint:null},
    {id:"assets",label:"Assets",icon:"⬡",count:capsule.assets.length,hint:unbuiltCount>0?`${unbuiltCount} unbuilt`:null},
    {id:"decisions",label:"Decisions",icon:"⊕",count:capsule.decisions.length},
    {id:"threads",label:"Open Threads",icon:"↻",count:capsule.openThreads.length,hint:highCount>0?`${highCount} high`:null},
    {id:"knowledge",label:"Project Knowledge",icon:"◎",count:capsule.projectKnowledge.length},
    {id:"primer",label:"Session Primer",icon:"▶",hint:capsule.nextSessionPrimer?"ready":null},
    {id:"export",label:"Export",icon:"↓",hint:pct===100?"✓":null},
  ];

  // ── DERIVED DATA ──
  const filteredAssets=filterItems(capsule.assets,assetFilters,assetSearch,["name","description","track","blockers"]);
  const filteredThreads=filterItems(capsule.openThreads,threadFilters,threadSearch,["thread","context","nextAction"]);
  const allTracks=[...new Set(capsule.assets.map(a=>a.track).filter(Boolean))];


  // ── LAYOUT ──
  return (
    <>
      <style>{CSS}</style>
      <SkipLink />

      {/* Mobile Drawer */}
      {isMobile&&drawerOpen&&(
        <>
          <div role="presentation" aria-hidden="true" onClick={()=>setDrawerOpen(false)}
            style={{position:"fixed",inset:0,background:"#000000aa",zIndex:200,animation:"fadeUp .15s ease"}}/>
          <div role="dialog" aria-modal="true" aria-label="Navigation menu"
            style={{position:"fixed",top:0,left:0,bottom:0,width:220,background:"#040b09",
              borderRight:"1px solid #0a1f1a",zIndex:201,animation:"slideInLeft .2s ease",
              padding:"16px 12px",overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:9,color:"#0d9488",fontFamily:"'JetBrains Mono',monospace",letterSpacing:3}}>INT.INC</span>
              <button type="button" aria-label="Close navigation" onClick={()=>setDrawerOpen(false)}
                style={{background:"transparent",border:"1px solid #0f3028",borderRadius:6,
                  color:"#5eead4",cursor:"pointer",fontSize:14,padding:"4px 8px",minWidth:32,minHeight:32}}>
                ×
              </button>
            </div>
            <NavSidebar NAV={NAV} activeSection={activeSection} setActiveSection={setActiveSection} liveCount={liveCount} unbuiltCount={unbuiltCount} highCount={highCount} onSelect={()=>setDrawerOpen(false)}/>
          </div>
        </>
      )}

      {/* Main wrapper */}
      <div lang="en" style={{minHeight:"100vh",background:"#040b09",fontFamily:"'Bricolage Grotesque',sans-serif",
        color:"#e2e8f0",display:"flex",flexDirection:"column",
        backgroundImage:"radial-gradient(circle at 20% 20%,#0d2e2422 0%,transparent 60%),radial-gradient(circle at 80% 80%,#0a1f1a33 0%,transparent 60%)"}}>

        {/* Top bar */}
        <header style={{padding:"11px 16px",borderBottom:"1px solid #0a1f1a",background:"#040b09ee",
          backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:100,
          display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          {isMobile&&(
            <button type="button" aria-label="Open navigation menu" aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
              onClick={()=>setDrawerOpen(true)}
              style={{background:"transparent",border:"1px solid #0f3028",borderRadius:6,
                color:"#5eead4",cursor:"pointer",padding:"6px 10px",fontSize:14,
                minWidth:44,minHeight:44,flexShrink:0}}>
              ☰
            </button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
            <span aria-hidden="true" style={{fontSize:9,letterSpacing:3,color:"#0d9488",fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>INT.INC</span>
            <div aria-hidden="true" style={{width:1,height:14,background:"#0a1f1a",flexShrink:0}}/>
            <p className="topbar-title" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,
              color:"#e2e8f0",fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",margin:0}}>
              {capsule.meta.sessionTitle}
            </p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
              aria-label={`Capsule completeness ${pct}%`}
              style={{width:64,height:2,background:"#0a1f1a",borderRadius:1}}>
              <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#10b981":"#0d9488",borderRadius:1,transition:"width .4s ease"}}/>
            </div>
            <span aria-hidden="true" style={{fontSize:9,color:pct===100?"#10b981":"#2dd4bf",fontFamily:"'JetBrains Mono',monospace"}}>{pct}%</span>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button type="button" className="btn" onClick={copyJSON}
              style={{background:"transparent",border:"1px solid #0f3028",borderRadius:6,
                padding:"6px 12px",color:copied?"#10b981":"#64748b",cursor:"pointer",
                fontSize:11,fontFamily:"'JetBrains Mono',monospace",transition:"all .2s",
                minHeight:36}}>
              {copied?"✓ copied":"⎘ copy json"}
            </button>
            <button type="button" className="btn" onClick={exportJSON}
              style={{background:exported?"#052e1666":"linear-gradient(135deg,#0f766e,#0d9488)",
                border:"none",borderRadius:6,padding:"6px 14px",
                color:exported?"#10b981":"#fff",cursor:"pointer",
                fontSize:11,fontFamily:"'Bricolage Grotesque',sans-serif",
                fontWeight:700,transition:"all .2s",minHeight:36}}>
              {exported?"✓ exported":"↓ Export JSON"}
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* Desktop sidebar */}
          <div className="sidebar-desktop" style={{width:172,flexShrink:0,borderRight:"1px solid #0a1f1a",
            padding:"16px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
            <NavSidebar NAV={NAV} activeSection={activeSection} setActiveSection={setActiveSection} liveCount={liveCount} unbuiltCount={unbuiltCount} highCount={highCount}/>
          </div>

          {/* Content */}
          <main id="main-content" ref={mainRef} tabIndex={-1}
            className="content-area"
            style={{flex:1,overflow:"auto",padding:"24px 28px",animation:"fadeUp .25s ease"}}>

            {/* ── OVERVIEW ── */}
            {activeSection==="overview"&&(
              <section aria-label="Session overview">
                <SectionHeader icon="◈" label="Session Overview"/>
                <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                  {[
                    {label:"SESSION TITLE",path:"meta.sessionTitle",rows:1},
                    {label:"DESTINATION PROJECT",path:"meta.destinationProject",rows:1,ph:"e.g. INT Inc. Q2 Sprint / HumanX Prep"},
                    {label:"OWNER",path:"meta.owner",rows:1},
                    {label:"CUSTOM INSTRUCTIONS",path:"meta.customInstructionsVersion",rows:1},
                  ].map(f=>{
                    const fid=`field-${f.path.replace(/\./g,"-")}`;
                    const val=f.path.split(".").reduce((o,k)=>o[k],capsule);
                    return (
                      <div key={f.path} className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"14px 16px"}}>
                        <FieldLabel id={fid}>{f.label}</FieldLabel>
                        <EditableText fieldId={fid} value={val} onChange={v=>update(f.path,v)} rows={f.rows||2} placeholder={f.ph||""} ariaLabel={f.label}/>
                      </div>
                    );
                  })}
                </div>

                <div className="four-stat" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
                  {[
                    {label:"Total Assets",value:capsule.assets.length,sub:"tracked",color:"#5eead4"},
                    {label:"Live / Pilot",value:liveCount,sub:"in production",color:"#4ade80"},
                    {label:"Unbuilt",value:unbuiltCount,sub:"need building",color:"#f87171"},
                    {label:"High Priority",value:highCount,sub:"open threads",color:"#fbbf24"},
                  ].map(s=>(
                    <div key={s.label} className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                      <div aria-label={`${s.value} ${s.label}`} style={{fontSize:28,fontWeight:800,color:s.color,fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{s.value}</div>
                      <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginTop:4}}>{s.label}</div>
                      <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"16px"}}>
                  <FieldLabel>TAGS</FieldLabel>
                  <div role="list" aria-label="Session tags" style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                    {capsule.tags.map(t=>(
                      <button key={t} type="button" role="listitem" className="tag-pill"
                        aria-label={`Remove tag: ${t}`}
                        onClick={()=>setCapsule(prev=>({...prev,tags:prev.tags.filter(x=>x!==t)}))}
                        style={{fontSize:10,padding:"5px 10px",borderRadius:20,background:"#0a1f1a",color:"#2dd4bf",
                          border:"1px solid #0f3028",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",
                          transition:"all .15s",minHeight:28}}>
                        {t} ×
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <label htmlFor="tag-input" style={{position:"absolute",left:-9999}}>Add new tag</label>
                    <input id="tag-input" type="text" value={tagInput}
                      onChange={e=>setTagInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTag();}}}
                      placeholder="add tag + enter"
                      style={{flex:1,background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,
                        padding:"6px 10px",color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace",
                        minHeight:36}}
                    />
                    <button type="button" className="btn" onClick={addTag} aria-label="Add tag"
                      style={{background:"#0f766e22",border:"1px solid #0f3028",borderRadius:6,
                        padding:"6px 12px",color:"#2dd4bf",cursor:"pointer",fontSize:14,minWidth:44,minHeight:44}}>
                      +
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ── ASSETS ── */}
            {activeSection==="assets"&&(
              <section aria-label="Asset registry">
                <SectionHeader icon="⬡" label="Asset Registry" count={filteredAssets.length}/>
                <FilterBar label="assets"
                  filters={assetFilters} setFilters={setAssetFilters}
                  options={[{key:"status",values:STATUSES},{key:"track",values:allTracks}]}
                  search={assetSearch} setSearch={setAssetSearch}
                  searchPlaceholder="Search assets…"/>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {filteredAssets.map(a=>(
                    <CollapsibleCard key={a.id} id={a.id} isCollapsed={!!collapsed[a.id]} onToggle={toggleCollapsed}
                      headerContent={
                        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#94a3b8",
                            flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {a.name}
                          </span>
                          <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap"}}>
                            <Badge label={a.track} colors={{bg:"#0a1f1a",text:"#5eead4",border:"#0f3028"}}/>
                            <Badge label={a.status} colors={STATUS_C[a.status]||STATUS_C.draft}/>
                          </div>
                          <DeleteBtn arr="assets" id={a.id} label={a.name}
                  confirmingDelete={confirmingDelete}
                  onDelete={doDelete} onRequest={requestDelete}
                  onCancel={()=>setConfirmingDelete(null)}/>
                        </div>
                      }>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10,marginBottom:10}}>
                        <div>
                          <FieldLabel id={`a-name-${a.id}`}>NAME</FieldLabel>
                          <EditableText fieldId={`a-name-${a.id}`} value={a.name} onChange={v=>updateArrItem("assets",a.id,"name",v)} rows={1} mono ariaLabel="Asset name"/>
                        </div>
                        <div>
                          <FieldLabel id={`a-status-${a.id}`}>STATUS</FieldLabel>
                          <label htmlFor={`a-status-sel-${a.id}`} style={{position:"absolute",left:-9999}}>Status</label>
                          <select id={`a-status-sel-${a.id}`} value={a.status} onChange={e=>updateArrItem("assets",a.id,"status",e.target.value)}
                            style={{width:"100%",background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,
                              padding:"8px",color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace",
                              minHeight:36}}>
                            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <FieldLabel id={`a-desc-${a.id}`}>DESCRIPTION</FieldLabel>
                        <EditableText fieldId={`a-desc-${a.id}`} value={a.description} onChange={v=>updateArrItem("assets",a.id,"description",v)} rows={3} ariaLabel="Description"/>
                      </div>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div>
                          <FieldLabel id={`a-next-${a.id}`}>NEXT MILESTONE</FieldLabel>
                          <EditableText fieldId={`a-next-${a.id}`} value={a.nextMilestone} onChange={v=>updateArrItem("assets",a.id,"nextMilestone",v)} rows={2} ariaLabel="Next milestone"/>
                        </div>
                        <div>
                          <FieldLabel id={`a-blk-${a.id}`}>BLOCKERS</FieldLabel>
                          <EditableText fieldId={`a-blk-${a.id}`} value={a.blockers} onChange={v=>updateArrItem("assets",a.id,"blockers",v)} rows={2} ariaLabel="Blockers"/>
                        </div>
                      </div>
                    </CollapsibleCard>
                  ))}
                  {filteredAssets.length===0&&(
                    <p style={{color:"#1e4039",fontSize:12,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",padding:24}}>No assets match current filters.</p>
                  )}
                  <AddButton onClick={()=>addItem("assets",{name:"New Asset",track:"",status:"spec",description:"",nextMilestone:"",blockers:""})} label="+ add asset"/>
                </div>
              </section>
            )}

            {/* ── DECISIONS ── */}
            {activeSection==="decisions"&&(
              <section aria-label="Key decisions">
                <SectionHeader icon="⊕" label="Key Decisions" count={capsule.decisions.length}/>
                <p style={{fontSize:11,color:"#64748b",marginBottom:16,fontFamily:"'JetBrains Mono',monospace"}}>
                  🔒 Locked = do not re-litigate in new sessions
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {capsule.decisions.map(d=>(
                    <CollapsibleCard key={d.id} id={d.id} isCollapsed={!!collapsed[d.id]} onToggle={toggleCollapsed}
                      headerContent={
                        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {d.decision||"Untitled decision"}
                          </span>
                          <button type="button" onClick={e=>{e.stopPropagation();updateArrItem("decisions",d.id,"locked",!d.locked);}}
                            aria-pressed={d.locked}
                            aria-label={d.locked?"Unlock decision":"Lock decision"}
                            style={{background:d.locked?"#052e1666":"transparent",border:`1px solid ${d.locked?"#166534":"#0f3028"}`,
                              borderRadius:6,padding:"3px 8px",color:d.locked?"#4ade80":"#1e4039",cursor:"pointer",
                              fontSize:10,fontFamily:"'JetBrains Mono',monospace",flexShrink:0,minHeight:28}}>
                            {d.locked?"🔒":"○"}
                          </button>
                          <DeleteBtn arr="decisions" id={d.id} label={d.decision||"decision"}
                  confirmingDelete={confirmingDelete}
                  onDelete={doDelete} onRequest={requestDelete}
                  onCancel={()=>setConfirmingDelete(null)}/>
                        </div>
                      }>
                      <div style={{marginBottom:10}}>
                        <FieldLabel id={`d-dec-${d.id}`}>DECISION</FieldLabel>
                        <EditableText fieldId={`d-dec-${d.id}`} value={d.decision} onChange={v=>updateArrItem("decisions",d.id,"decision",v)} rows={2} mono ariaLabel="Decision statement"/>
                      </div>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div>
                          <FieldLabel id={`d-rat-${d.id}`}>RATIONALE</FieldLabel>
                          <EditableText fieldId={`d-rat-${d.id}`} value={d.rationale} onChange={v=>updateArrItem("decisions",d.id,"rationale",v)} rows={3} ariaLabel="Rationale"/>
                        </div>
                        <div>
                          <FieldLabel id={`d-alt-${d.id}`}>ALTERNATIVES CONSIDERED</FieldLabel>
                          <EditableText fieldId={`d-alt-${d.id}`} value={d.alternatives} onChange={v=>updateArrItem("decisions",d.id,"alternatives",v)} rows={3} ariaLabel="Alternatives considered"/>
                        </div>
                      </div>
                    </CollapsibleCard>
                  ))}
                  <AddButton onClick={()=>addItem("decisions",{decision:"",rationale:"",alternatives:"",locked:false})} label="+ add decision"/>
                </div>
              </section>
            )}

            {/* ── THREADS ── */}
            {activeSection==="threads"&&(
              <section aria-label="Open threads">
                <SectionHeader icon="↻" label="Open Threads" count={filteredThreads.length}/>
                <FilterBar label="threads"
                  filters={threadFilters} setFilters={setThreadFilters}
                  options={[{key:"priority",values:["high","medium","low"]},{key:"horizon",values:["immediate","near","mid"]}]}
                  search={threadSearch} setSearch={setThreadSearch}
                  searchPlaceholder="Search threads…"/>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {filteredThreads.map((t,idx)=>(
                    <CollapsibleCard key={t.id} id={t.id} isCollapsed={!!collapsed[t.id]} onToggle={toggleCollapsed}
                      headerContent={
                        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0,flexWrap:"wrap"}}>
                          <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
                            <button type="button" onClick={e=>{e.stopPropagation();moveThread(t.id,"up");}}
                              aria-label={`Move up: ${t.thread}`}
                              disabled={idx===0}
                              style={{background:"transparent",border:"none",color:idx===0?"#0a1f1a":"#1e4039",cursor:idx===0?"default":"pointer",fontSize:10,lineHeight:1,padding:"1px 3px",minWidth:20}}>▲</button>
                            <button type="button" onClick={e=>{e.stopPropagation();moveThread(t.id,"down");}}
                              aria-label={`Move down: ${t.thread}`}
                              disabled={idx===filteredThreads.length-1}
                              style={{background:"transparent",border:"none",color:idx===filteredThreads.length-1?"#0a1f1a":"#1e4039",cursor:idx===filteredThreads.length-1?"default":"pointer",fontSize:10,lineHeight:1,padding:"1px 3px",minWidth:20}}>▼</button>
                          </div>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {t.thread}
                          </span>
                          <div style={{display:"flex",gap:5,flexShrink:0}}>
                            <Badge label={t.priority} colors={PRIORITY_C[t.priority]||PRIORITY_C.medium}/>
                            <Badge label={t.horizon||"near"} colors={HORIZON_C[t.horizon]||HORIZON_C.near}/>
                          </div>
                          <DeleteBtn arr="openThreads" id={t.id} label={t.thread}
                  confirmingDelete={confirmingDelete}
                  onDelete={doDelete} onRequest={requestDelete}
                  onCancel={()=>setConfirmingDelete(null)}/>
                        </div>
                      }>
                      <div style={{marginBottom:10}}>
                        <FieldLabel id={`t-title-${t.id}`}>THREAD</FieldLabel>
                        <EditableText fieldId={`t-title-${t.id}`} value={t.thread} onChange={v=>updateArrItem("openThreads",t.id,"thread",v)} rows={1} mono ariaLabel="Thread title"/>
                      </div>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div>
                          <label htmlFor={`t-pri-${t.id}`} style={{display:"block",fontSize:9,color:"#14b8a6",fontFamily:"'JetBrains Mono',monospace",marginBottom:5,letterSpacing:1.2,textTransform:"uppercase"}}>PRIORITY</label>
                          <select id={`t-pri-${t.id}`} value={t.priority} onChange={e=>updateArrItem("openThreads",t.id,"priority",e.target.value)}
                            style={{width:"100%",background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,padding:"8px",color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace",minHeight:36}}>
                            <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`t-hor-${t.id}`} style={{display:"block",fontSize:9,color:"#14b8a6",fontFamily:"'JetBrains Mono',monospace",marginBottom:5,letterSpacing:1.2,textTransform:"uppercase"}}>HORIZON</label>
                          <select id={`t-hor-${t.id}`} value={t.horizon||"near"} onChange={e=>updateArrItem("openThreads",t.id,"horizon",e.target.value)}
                            style={{width:"100%",background:"#050e0c",border:"1px solid #0f2420",borderRadius:6,padding:"8px",color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace",minHeight:36}}>
                            <option value="immediate">immediate</option><option value="near">near</option><option value="mid">mid</option>
                          </select>
                        </div>
                      </div>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:10}}>
                        <div>
                          <FieldLabel id={`t-ctx-${t.id}`}>CONTEXT</FieldLabel>
                          <EditableText fieldId={`t-ctx-${t.id}`} value={t.context} onChange={v=>updateArrItem("openThreads",t.id,"context",v)} rows={3} ariaLabel="Context"/>
                        </div>
                        <div>
                          <FieldLabel id={`t-next-${t.id}`}>NEXT ACTION</FieldLabel>
                          <EditableText fieldId={`t-next-${t.id}`} value={t.nextAction} onChange={v=>updateArrItem("openThreads",t.id,"nextAction",v)} rows={3} ariaLabel="Next action"/>
                        </div>
                      </div>
                    </CollapsibleCard>
                  ))}
                  {filteredThreads.length===0&&(
                    <p style={{color:"#1e4039",fontSize:12,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",padding:24}}>No threads match current filters.</p>
                  )}
                  <AddButton onClick={()=>addItem("openThreads",{thread:"",priority:"medium",horizon:"near",context:"",nextAction:"",owner:"Kyle"})} label="+ add thread"/>
                </div>
              </section>
            )}

            {/* ── KNOWLEDGE ── */}
            {activeSection==="knowledge"&&(
              <section aria-label="Project knowledge">
                <SectionHeader icon="◎" label="Project Knowledge" count={capsule.projectKnowledge.length}/>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {capsule.projectKnowledge.map(k=>(
                    <CollapsibleCard key={k.id} id={k.id} isCollapsed={!!collapsed[k.id]} onToggle={toggleCollapsed}
                      headerContent={
                        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,minWidth:0,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {k.file}
                          </span>
                          <Badge label={k.type||"doc"} colors={{bg:"#0a1f1a",text:"#5eead4",border:"#0f3028"}}/>
                          <Badge label={k.relevance} colors={k.relevance==="high"?PRIORITY_C.high:PRIORITY_C.medium}/>
                          <DeleteBtn arr="projectKnowledge" id={k.id} label={k.file}
                  confirmingDelete={confirmingDelete}
                  onDelete={doDelete} onRequest={requestDelete}
                  onCancel={()=>setConfirmingDelete(null)}/>
                        </div>
                      }>
                      <div style={{marginBottom:10}}>
                        <FieldLabel id={`k-file-${k.id}`}>FILE / DOCUMENT</FieldLabel>
                        <EditableText fieldId={`k-file-${k.id}`} value={k.file} onChange={v=>updateArrItem("projectKnowledge",k.id,"file",v)} rows={1} mono ariaLabel="File or document name"/>
                      </div>
                      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <div>
                          <FieldLabel id={`k-ins-${k.id}`}>KEY INSIGHTS</FieldLabel>
                          <EditableText fieldId={`k-ins-${k.id}`} value={k.keyInsights} onChange={v=>updateArrItem("projectKnowledge",k.id,"keyInsights",v)} rows={4} ariaLabel="Key insights"/>
                        </div>
                        <div>
                          <FieldLabel id={`k-use-${k.id}`}>USED FOR</FieldLabel>
                          <EditableText fieldId={`k-use-${k.id}`} value={k.usedFor} onChange={v=>updateArrItem("projectKnowledge",k.id,"usedFor",v)} rows={4} ariaLabel="Used for"/>
                        </div>
                      </div>
                    </CollapsibleCard>
                  ))}
                  <AddButton onClick={()=>addItem("projectKnowledge",{file:"",type:"Reference Doc",relevance:"medium",keyInsights:"",usedFor:""})} label="+ add doc"/>
                </div>
              </section>
            )}

            {/* ── PRIMER ── */}
            {activeSection==="primer"&&(
              <section aria-label="Next session primer" style={{maxWidth:680}}>
                <SectionHeader icon="▶" label="Next Session Primer"/>
                <p style={{fontSize:12,color:"#64748b",marginBottom:16,lineHeight:1.65}}>
                  Cold-start message for the next Claude instance. Paste as your first message in a new project. INT-aware: injects security floor, Custom Instructions version, and locked decisions automatically.
                </p>
                <div className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"20px"}}>
                  {!capsule.nextSessionPrimer&&!generatingPrimer&&(
                    <div style={{textAlign:"center",padding:"32px 0"}}>
                      <p style={{color:"#1e4039",fontSize:13,marginBottom:18}}>No primer generated yet.</p>
                      <button type="button" className="btn" onClick={generatePrimer}
                        aria-busy={generatingPrimer}
                        style={{background:"linear-gradient(135deg,#0f766e,#0d9488)",border:"none",
                          borderRadius:8,padding:"12px 24px",color:"#fff",cursor:"pointer",
                          fontSize:13,fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,
                          transition:"all .2s",minHeight:44}}>
                        ✦ Generate INT-Aware Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer&&(
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"24px 0",
                      color:"#0d9488",fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>
                      <div style={{width:14,height:14,border:"2px solid #0d948833",borderTopColor:"#0d9488",
                        borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                      Synthesizing INT Inc. context...
                    </div>
                  )}
                  {capsule.nextSessionPrimer&&(
                    <>
                      <div style={{fontSize:9,color:"#1e4039",fontFamily:"'JetBrains Mono',monospace",
                        marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span>PRIMER {primerGenerated&&<span style={{color:"#0d9488"}}>· AI GENERATED · INT-AWARE</span>}</span>
                        <button type="button" className="btn" onClick={generatePrimer}
                          style={{background:"transparent",border:"none",color:"#0d9488",cursor:"pointer",
                            fontSize:10,fontFamily:"'JetBrains Mono',monospace"}}>
                          &#x21BA; regenerate
                        </button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} onChange={v=>update("nextSessionPrimer",v)}
                        rows={12} placeholder="Write or generate primer..." ariaLabel="Session primer"/>
                      <div style={{display:"flex",gap:8,marginTop:10}}>
                        <button type="button" className="btn" onClick={copyPrimer}
                          style={{background:"transparent",border:"1px solid #0f3028",borderRadius:6,
                            padding:"7px 16px",color:"#2dd4bf",cursor:"pointer",
                            fontSize:11,fontFamily:"'JetBrains Mono',monospace",transition:"all .2s",minHeight:36}}>
                          {copied?"\u2713 copied":"\u2398 copy primer"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* \u2500\u2500 EXPORT \u2500\u2500 */}
            {activeSection==="export"&&(
              <section aria-label="Export capsule" style={{maxWidth:600}}>
                <SectionHeader icon="\u2193" label="Export Capsule"/>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {label:"JSON \u2014 n8n / Claude API",desc:"Full structured capsule. Feed to Claude API, n8n pipeline, or Git version control.",action:exportJSON,btn:exported?"\u2713 Exported":"\u2193 Download JSON",color:"linear-gradient(135deg,#0f766e,#0891b2)"},
                    {label:"Copy to Clipboard",desc:"Paste as first message into new Claude session. Best combined with primer text.",action:copyJSON,btn:copied?"\u2713 Copied":"\u2398 Copy JSON",color:"linear-gradient(135deg,#0d9488,#0f766e)"},
                  ].map(opt=>(
                    <div key={opt.label} className="field-card"
                      style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"18px 20px",
                        display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                      <div>
                        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,color:"#e2e8f0",fontSize:14,marginBottom:4}}>{opt.label}</div>
                        <div style={{color:"#64748b",fontSize:12,lineHeight:1.5}}>{opt.desc}</div>
                      </div>
                      <button type="button" className="btn" onClick={opt.action}
                        style={{background:opt.color,border:"none",borderRadius:8,padding:"10px 18px",
                          color:"#fff",cursor:"pointer",fontSize:12,
                          fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,
                          flexShrink:0,transition:"all .2s",minHeight:44}}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Migration checklist */}
                  <div className="field-card" style={{background:"#031a10",border:"1px solid #10b98133",borderRadius:10,padding:"18px 20px"}}>
                    <div style={{fontSize:9,color:"#10b981",fontFamily:"'JetBrains Mono',monospace",marginBottom:12,letterSpacing:1}}>MIGRATION CHECKLIST</div>
                    {[
                      {label:"Session title filled in",check:!!capsule.meta.sessionTitle},
                      {label:"Destination project named",check:!!capsule.meta.destinationProject},
                      {label:"Assets documented",check:capsule.assets.length>0},
                      {label:"Key decisions recorded",check:capsule.decisions.length>0},
                      {label:"Open threads prioritized",check:capsule.openThreads.length>0},
                      {label:"Primer generated + copied",check:!!capsule.nextSessionPrimer},
                      {label:"JSON exported",check:exported},
                    ].map((item,i)=>(
                      <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
                        <span style={{color:item.check?"#10b981":"#1e4039",fontSize:12}}>{item.check?"\u2713":"\u25cb"}</span>
                        <span style={{color:item.check?"#6ee7b7":"#64748b",fontSize:12}}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Schema preview */}
                  <div className="field-card" style={{background:"#060d0b",border:"1px solid #0a1f1a",borderRadius:10,padding:"18px 20px"}}>
                    <div style={{fontSize:9,color:"#1e4039",fontFamily:"'JetBrains Mono',monospace",marginBottom:10,letterSpacing:1}}>JSON SCHEMA</div>
                    <pre style={{color:"#2dd4bf44",fontSize:10,lineHeight:1.7,fontFamily:"'JetBrains Mono',monospace",overflow:"auto"}}>
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
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <nav aria-label="Mobile section navigation" className="bottom-tabs"
        style={{position:"fixed",bottom:0,left:0,right:0,background:"#040b09",
          borderTop:"1px solid #0a1f1a",zIndex:100,height:56,
          alignItems:"stretch",overflowX:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} type="button"
            aria-current={activeSection===n.id?"page":undefined}
            onClick={()=>setActiveSection(n.id)}
            style={{flex:"0 0 auto",minWidth:52,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:2,padding:"6px 8px",
              background:"transparent",border:"none",
              color:activeSection===n.id?"#5eead4":"#1e4039",
              cursor:"pointer",fontSize:16}}>
            <span aria-hidden="true">{n.icon}</span>
            <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",
              color:activeSection===n.id?"#5eead4":"#1e4039",whiteSpace:"nowrap"}}>
              {n.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </nav>

      <ToastList toasts={toasts} onDismiss={dismissToast}/>
    </>
  );
}
