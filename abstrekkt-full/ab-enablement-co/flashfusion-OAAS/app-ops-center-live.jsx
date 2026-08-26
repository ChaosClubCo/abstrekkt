import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { LayoutDashboard, Trash2, Zap, Settings, Plus, Upload, Cpu, ExternalLink, Copy, AlertTriangle, TrendingUp, Activity, Box, RefreshCw, ArrowRightLeft, Flame, Star, X, ChevronDown, Check } from "lucide-react";

// ─── TOKENS ────────────────────────────────────────────────────────
const V = {
  s0:"#000000", s1:"#0B0B14", s2:"#13131F", s3:"#1C1C2E", s4:"#232336",
  border:"rgba(139,92,246,0.15)", borderHi:"rgba(139,92,246,0.4)",
  violet:"#A855F7", magenta:"#EC4899", cyan:"#22D3EE",
  t1:"#FFFFFF", t2:"#C7C7D1", t3:"#8A8A96", t4:"#4A4A58",
  green:"#22C55E", red:"#EF4444", amber:"#F59E0B", orange:"#FB923C",
};

const DEFAULT_LANES = {
  core:   {label:"Core / Prod",    color:V.violet,  bg:"rgba(168,85,247,0.12)"},
  active: {label:"Active Dev",     color:V.green,   bg:"rgba(34,197,94,0.12)"},
  exp:    {label:"Experimental",   color:V.amber,   bg:"rgba(245,158,11,0.12)"},
  park:   {label:"Parked",         color:V.t4,      bg:"rgba(74,74,88,0.15)"},
};
const FF_LANES = {
  ff:   {label:"FF Consulting",   color:V.violet,  bg:"rgba(168,85,247,0.12)"},
  cc:   {label:"Chaos Club",      color:V.magenta, bg:"rgba(236,72,153,0.12)"},
  afs:  {label:"AffordableStuff", color:V.cyan,    bg:"rgba(34,211,238,0.12)"},
  int:  {label:"INT/Internal",    color:"#818CF8", bg:"rgba(129,140,248,0.12)"},
  exp:  {label:"Experimental",    color:V.amber,   bg:"rgba(245,158,11,0.12)"},
  park: {label:"Parked/Archive",  color:V.t4,      bg:"rgba(74,74,88,0.15)"},
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
const STATUS_COLOR = {prod:V.violet,active:V.green,zombie:V.red,parked:V.t4,unknown:V.t4};
const PLATFORMS = {
  b44:    {label:"Base44",   color:V.violet},
  lv:     {label:"Lovable",  color:V.cyan},
  next:   {label:"Next.js",  color:"#E2E8F0"},
  vercel: {label:"Vercel",   color:"#94A3B8"},
  gh:     {label:"GitHub",   color:"#94A3B8"},
  other:  {label:"Other",    color:V.t3},
};

// ─── CLAUDE API ─────────────────────────────────────────────────────
async function callClaude(prompt, maxTokens=1200) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages:[{role:"user",content:prompt}],
    }),
  });
  const data = await res.json();
  const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
  return text;
}

async function aiTriage(app, meta, lanes, projectName) {
  const laneList = Object.entries(lanes).map(([k,v])=>`${k}=${v.label}`).join(", ");
  const prompt = `You are an app portfolio consultant for "${projectName}".

App: ${app.dn} (slug: ${app.n})
Platform: ${app.p} | Status: ${app.s}
${app.v!=null?`Traffic: ${app.v} visitors/30d`:""}${app.e!=null?` | Edits: ${app.e}`:""}
${app.url?`URL: ${app.url}`:""}
${app.f?.length?`Flags: ${app.f.join(", ")}`:""}
Current lane: ${meta.lane} | Current decision: ${meta.decision||"none"}

Available lanes: ${laneList}

Return ONLY valid JSON with no explanation:
{"decision":"keep|archive|migrate|investigate","priority":"P0|P1|P2|P3","lane":"one_of_lane_keys","wsjf":1-21,"reasoning":"1 sentence"}`;
  const text = await callClaude(prompt, 300);
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

async function aiChain(app, meta, lanes, projectName) {
  const lane = lanes[meta.lane]?.label || meta.lane;
  const prompt = `Generate a 5-prompt GitHub Copilot agent chain for this app.

Project: ${projectName}
App: ${app.dn} | Platform: ${app.p} | Lane: ${lane} | Status: ${app.s}
${app.url?`URL: ${app.url}`:""}${meta.migration?" | MIGRATION TARGET: Next.js 15 + Supabase + Vercel":""}
${meta.decision?`Decision: ${meta.decision}`:""}${meta.notes?`\nNotes: ${meta.notes}`:""}

Generate a focused, specific 5-prompt chain:
PROMPT 1 — Codebase Orientation
PROMPT 2 — Security & Quality Audit  
PROMPT 3 — Architecture Evaluation
PROMPT 4 — ${meta.migration?"Migration Plan":"Implementation Plan"}
PROMPT 5 — Test Coverage

Each prompt should be a self-contained instruction block in triple backticks, specific to this app's context. No generic boilerplate.`;
  return await callClaude(prompt, 1400);
}

async function aiParseApps(rawText, projectName) {
  const prompt = `Parse this app/project list for "${projectName}" into a JSON array.

For each item, extract or infer:
- id: unique slug (lowercase, hyphens)
- n: short slug name
- dn: human-readable display name
- p: platform — "b44"|"lv"|"next"|"vercel"|"gh"|"other"
- l: lane — "core"|"active"|"exp"|"park"
- v: visitors_30d (number or null)
- e: edit_count (number or null)
- url: string or null
- s: status — "prod"|"active"|"parked"|"zombie"
- f: flags array (e.g. ["duplicate","zombie","high-traffic","primary"])

Input:
${rawText}

Return ONLY a valid JSON array. No explanation, no markdown fences.`;
  const text = await callClaude(prompt, 2000);
  const clean = text.replace(/```json|```/g,"").trim();
  const parsed = JSON.parse(clean);
  return Array.isArray(parsed) ? parsed : parsed.apps || [];
}

async function aiSprintPlan(apps, meta, lanes, projectName, n=5) {
  const undecided = apps.filter(a=>!meta[a.id]?.decision);
  const context = apps.map(a=>{
    const m = meta[a.id]||{};
    return `- ${a.dn} [${a.p}/${a.s}] decision:${m.decision||"none"} priority:${m.priority||"none"} wsjf:${m.wsjf||"?"} migrate:${m.migration?"yes":"no"}`;
  }).join("\n");
  const prompt = `You are a sprint planner for "${projectName}". Given this app portfolio:

${context}

Suggest the top ${n} highest-leverage items for the next sprint. For each:
1. Which app + what action
2. Why it's highest priority right now
3. Effort estimate (S/M/L/XL)
4. Suggested WSJF score (1-21)
5. Acceptance criteria (1 line)

Format as a numbered list, concise and actionable.`;
  return await callClaude(prompt, 1000);
}

// ─── HELPERS ────────────────────────────────────────────────────────
const pill = (label, color, bg, size=11) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:99,fontSize:size,fontWeight:500,color,background:bg,lineHeight:1.4,whiteSpace:"nowrap"}}>{label}</span>
);
const Spinner = () => (
  <span style={{display:"inline-block",width:10,height:10,border:`1px solid ${V.t4}`,borderTop:`1px solid ${V.violet}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
);

// ─── MAIN ────────────────────────────────────────────────────────────
export default function AppOpsCenter() {
  const [project, setProject] = useState({name:"My Portfolio",description:"",lanePreset:"default"});
  const [lanes, setLanes] = useState(DEFAULT_LANES);
  const [apps, setApps] = useState([]);
  const [meta, setMeta] = useState({});
  const [tab, setTab] = useState("setup");
  const [filters, setFilters] = useState({platform:"all",lane:"all",status:"all",decision:"all",q:""});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState({});
  const [saved, setSaved] = useState(false);
  const [importText, setImportText] = useState("");
  const [importErr, setImportErr] = useState("");
  const [addForm, setAddForm] = useState({n:"",dn:"",p:"other",l:"active",url:"",s:"active",v:"",e:""});
  const [sprintPlan, setSprintPlan] = useState("");
  const [copied, setCopied] = useState(false);

  // ── STORAGE ──────────────────────────────────────────────────────
  useEffect(()=>{
    document.head.insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"><style>@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:${V.s1}}::-webkit-scrollbar-thumb{background:${V.border};border-radius:2px}</style>`);
    async function load(){
      try{
        const [pa,pm,pp] = await Promise.all([
          window.storage.get("ops-apps-v2"),
          window.storage.get("ops-meta-v2"),
          window.storage.get("ops-proj-v2"),
        ]);
        if(pa) setApps(JSON.parse(pa.value));
        if(pm) setMeta(JSON.parse(pm.value));
        if(pp){ const p=JSON.parse(pp.value); setProject(p.project); setLanes(p.lanes); }
      }catch{}
    }
    load();
  },[]);

  const persist = useCallback(async(nextApps,nextMeta,nextProj,nextLanes)=>{
    try{
      await Promise.all([
        window.storage.set("ops-apps-v2",JSON.stringify(nextApps??apps)),
        window.storage.set("ops-meta-v2",JSON.stringify(nextMeta??meta)),
        window.storage.set("ops-proj-v2",JSON.stringify({project:nextProj??project,lanes:nextLanes??lanes})),
      ]);
      setSaved(true); setTimeout(()=>setSaved(false),1500);
    }catch{}
  },[apps,meta,project,lanes]);

  const getMeta = useCallback((id)=>meta[id]||{decision:null,priority:null,lane:Object.keys(lanes)[1]||"active",migration:false,notes:"",wsjf:null},[meta,lanes]);

  const updateMeta = useCallback((id,patch)=>{
    setMeta(prev=>{
      const next={...prev,[id]:{...getMeta(id),...patch}};
      persist(null,next);
      return next;
    });
  },[getMeta,persist]);

  const setLoad = (id,val) => setLoading(l=>({...l,[id]:val}));

  // ── APP CRUD ──────────────────────────────────────────────────────
  const addApp = () => {
    if(!addForm.n.trim()&&!addForm.dn.trim()) return;
    const id = `app-${Date.now()}`;
    const newApp = {
      id, n:addForm.n.trim()||addForm.dn.trim().toLowerCase().replace(/\s+/g,"-"),
      dn:addForm.dn.trim()||addForm.n.trim(), p:addForm.p,
      l:addForm.l, url:addForm.url||null, s:addForm.s,
      v:addForm.v?parseInt(addForm.v):null,
      e:addForm.e?parseInt(addForm.e):null, f:[],
    };
    const nextApps = [...apps,newApp];
    const nextMeta = {...meta,[id]:getMeta(id)};
    setApps(nextApps); setMeta(nextMeta);
    persist(nextApps,nextMeta);
    setAddForm({n:"",dn:"",p:"other",l:Object.keys(lanes)[1]||"active",url:"",s:"active",v:"",e:""});
  };

  const removeApp = (id) => {
    const nextApps = apps.filter(a=>a.id!==id);
    const nextMeta = {...meta}; delete nextMeta[id];
    setApps(nextApps); setMeta(nextMeta);
    persist(nextApps,nextMeta);
  };

  // ── AI ACTIONS ────────────────────────────────────────────────────
  const handleTriage = async(app)=>{
    setLoad(app.id+"_triage",true);
    try{
      const result = await aiTriage(app,getMeta(app.id),lanes,project.name);
      updateMeta(app.id,{decision:result.decision,priority:result.priority,lane:result.lane,wsjf:result.wsjf,notes:result.reasoning});
    }catch(e){ alert("Triage failed: "+e.message); }
    setLoad(app.id+"_triage",false);
  };

  const handleChain = async(app)=>{
    setLoad(app.id+"_chain",true);
    try{
      const chain = await aiChain(app,getMeta(app.id),lanes,project.name);
      setModal({type:"text",title:`Copilot Chain — ${app.dn}`,content:chain});
    }catch(e){ alert("Chain gen failed: "+e.message); }
    setLoad(app.id+"_chain",false);
  };

  const handleImport = async()=>{
    if(!importText.trim()) return;
    setLoad("import",true); setImportErr("");
    try{
      const parsed = await aiParseApps(importText,project.name);
      const withIds = parsed.map((a,i)=>({...a,id:a.id||`imported-${Date.now()}-${i}`}));
      const nextApps = [...apps,...withIds];
      const nextMeta = {...meta};
      withIds.forEach(a=>{ if(!nextMeta[a.id]) nextMeta[a.id]=getMeta(a.id); });
      setApps(nextApps); setMeta(nextMeta);
      persist(nextApps,nextMeta);
      setImportText(""); setTab("dashboard");
    }catch(e){ setImportErr("Parse failed. Try a cleaner list or JSON. "+e.message); }
    setLoad("import",false);
  };

  const handleBulkTriage = async()=>{
    const untriaged = apps.filter(a=>!meta[a.id]?.decision);
    for(const app of untriaged.slice(0,10)){
      setLoad(app.id+"_triage",true);
      try{
        const result = await aiTriage(app,getMeta(app.id),lanes,project.name);
        updateMeta(app.id,{decision:result.decision,priority:result.priority,lane:result.lane,wsjf:result.wsjf,notes:result.reasoning});
      }catch{}
      setLoad(app.id+"_triage",false);
    }
  };

  const handleSprintPlan = async()=>{
    setLoad("sprint",true);
    try{
      const plan = await aiSprintPlan(apps,meta,lanes,project.name);
      setSprintPlan(plan);
    }catch(e){ setSprintPlan("Sprint plan failed: "+e.message); }
    setLoad("sprint",false);
  };

  // ── EXPORTS ────────────────────────────────────────────────────────
  const genCleanup = ()=>{
    const lines=[`# ${project.name} — Cleanup Action List`,"Generated: "+new Date().toLocaleDateString(),""];
    Object.entries(DECISIONS).forEach(([d,cfg])=>{
      const list=apps.filter(a=>getMeta(a.id).decision===d);
      if(!list.length) return;
      lines.push(`## ${cfg.label.toUpperCase()} (${list.length})`);
      list.forEach(a=>{
        const m=getMeta(a.id);
        lines.push(`- **${a.dn}** [${a.p}/${a.s}]${m.priority?` · ${m.priority}`:""}${m.migration?" · MIGRATE":""}`);
        if(m.notes) lines.push(`  > ${m.notes}`);
        if(a.url) lines.push(`  ${a.url}`);
      });
      lines.push("");
    });
    const und=apps.filter(a=>!getMeta(a.id).decision);
    if(und.length){ lines.push(`## UNDECIDED (${und.length})`); und.forEach(a=>lines.push(`- ${a.dn}`)); }
    return lines.join("\n");
  };

  const genSprint = ()=>{
    const scored=[...apps].filter(a=>getMeta(a.id).wsjf).sort((a,b)=>(getMeta(b.id).wsjf||0)-(getMeta(a.id).wsjf||0));
    const lines=[`# ${project.name} — Sprint Backlog`,"Generated: "+new Date().toLocaleDateString(),"","| # | App | Platform | Priority | WSJF | Decision | Migrate |","|---|-----|----------|----------|------|----------|---------|"];
    scored.forEach((a,i)=>{
      const m=getMeta(a.id);
      lines.push(`| ${i+1} | ${a.dn} | ${a.p} | ${m.priority||"—"} | ${m.wsjf||"—"} | ${m.decision||"—"} | ${m.migration?"Yes":"No"} |`);
    });
    return lines.join("\n");
  };

  const copy = (text)=>{ navigator.clipboard.writeText(text).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),1800); };

  // ── FILTERED LIST ─────────────────────────────────────────────────
  const filt = useMemo(()=>apps.filter(a=>{
    const m=getMeta(a.id);
    if(filters.platform!=="all"&&a.p!==filters.platform) return false;
    if(filters.lane!=="all"&&m.lane!==filters.lane) return false;
    if(filters.status!=="all"&&a.s!==filters.status) return false;
    if(filters.decision!=="all"){
      if(filters.decision==="null"&&m.decision) return false;
      if(filters.decision!=="null"&&m.decision!==filters.decision) return false;
    }
    if(filters.q&&!a.dn.toLowerCase().includes(filters.q.toLowerCase())&&!a.n.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }),[apps,filters,meta,getMeta]);

  const stats = useMemo(()=>({
    total:apps.length,
    traffic:apps.reduce((s,a)=>s+(a.v||0),0),
    decided:apps.filter(a=>getMeta(a.id).decision).length,
    flagged:apps.filter(a=>(a.f||[]).length>0).length,
  }),[apps,meta,getMeta]);

  // ── STYLES ──────────────────────────────────────────────────────────
  const card = {background:V.s2,border:`1px solid ${V.border}`,borderRadius:10,padding:"14px 16px"};
  const inp = {background:V.s3,border:`1px solid ${V.border}`,borderRadius:6,color:V.t2,fontSize:12,padding:"6px 10px",outline:"none",fontFamily:"inherit",width:"100%"};
  const selSt = {...inp,cursor:"pointer"};

  // ── SETUP TAB ─────────────────────────────────────────────────────
  const renderSetup = ()=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {/* Project config */}
      <div style={{...card,gridColumn:"1/-1"}}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:12}}>Project Config</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Project name</label>
            <input value={project.name} onChange={e=>{const p={...project,name:e.target.value};setProject(p);persist(null,null,p);}} style={inp} placeholder="My Portfolio"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Description (optional)</label>
            <input value={project.description} onChange={e=>setProject(p=>({...p,description:e.target.value}))} style={inp} placeholder="What is this portfolio?"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Lane preset</label>
            <select style={selSt} value={project.lanePreset} onChange={e=>{
              const preset=e.target.value;
              const nextLanes=preset==="ff"?FF_LANES:DEFAULT_LANES;
              const p={...project,lanePreset:preset};
              setProject(p); setLanes(nextLanes); persist(null,null,p,nextLanes);
            }}>
              <option value="default">Generic (Core/Active/Exp/Park)</option>
              <option value="ff">FlashFusion (FF/CC/AFS/INT/Exp/Park)</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(lanes).map(([k,v])=>pill(v.label,v.color,v.bg))}
        </div>
      </div>

      {/* Add app manually */}
      <div style={card}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:12,display:"flex",gap:6,alignItems:"center"}}>
          <Plus size={13} color={V.violet}/> Add App Manually
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Display name*</label>
            <input value={addForm.dn} onChange={e=>setAddForm(f=>({...f,dn:e.target.value}))} style={inp} placeholder="My App"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Slug</label>
            <input value={addForm.n} onChange={e=>setAddForm(f=>({...f,n:e.target.value}))} style={inp} placeholder="my-app (auto)"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Platform</label>
            <select style={selSt} value={addForm.p} onChange={e=>setAddForm(f=>({...f,p:e.target.value}))}>
              {Object.entries(PLATFORMS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Status</label>
            <select style={selSt} value={addForm.s} onChange={e=>setAddForm(f=>({...f,s:e.target.value}))}>
              {["prod","active","parked","zombie"].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Lane</label>
            <select style={selSt} value={addForm.l} onChange={e=>setAddForm(f=>({...f,l:e.target.value}))}>
              {Object.entries(lanes).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>URL (optional)</label>
            <input value={addForm.url} onChange={e=>setAddForm(f=>({...f,url:e.target.value}))} style={inp} placeholder="https://…"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Visitors/30d</label>
            <input type="number" value={addForm.v} onChange={e=>setAddForm(f=>({...f,v:e.target.value}))} style={inp} placeholder="—"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Edit count</label>
            <input type="number" value={addForm.e} onChange={e=>setAddForm(f=>({...f,e:e.target.value}))} style={inp} placeholder="—"/>
          </div>
        </div>
        <button onClick={addApp} style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${V.violet}44`,background:`${V.violet}18`,color:V.violet,fontSize:12,fontWeight:600,cursor:"pointer",width:"100%"}}>
          + Add App
        </button>
      </div>

      {/* AI Bulk Import */}
      <div style={card}>
        <div style={{fontSize:12,fontWeight:600,color:V.cyan,marginBottom:4,display:"flex",gap:6,alignItems:"center"}}>
          <Cpu size={13}/> AI Bulk Import
        </div>
        <div style={{fontSize:11,color:V.t4,marginBottom:10}}>Paste anything — app names, JSON, a spreadsheet dump, URLs. Claude parses it.</div>
        <textarea
          value={importText}
          onChange={e=>setImportText(e.target.value)}
          placeholder={"flashfusion-launchpad — marketing site, Lovable, 2 visitors\ncortex-ff — AI second brain, Lovable, 13 visitors, 209 edits\naudit — Invoke platform, Base44, production\n..."}
          style={{...inp,height:140,resize:"vertical",fontFamily:"monospace",fontSize:11,lineHeight:1.6,marginBottom:8}}
        />
        {importErr && <div style={{fontSize:11,color:V.red,marginBottom:8}}>{importErr}</div>}
        <button onClick={handleImport} disabled={!!loading.import||!importText.trim()}
          style={{padding:"7px 16px",borderRadius:7,border:`1px solid ${V.cyan}44`,background:loading.import?V.s3:`${V.cyan}14`,color:loading.import?V.t4:V.cyan,fontSize:12,fontWeight:600,cursor:loading.import?"not-allowed":"pointer",width:"100%",display:"flex",gap:8,alignItems:"center",justifyContent:"center"}}>
          {loading.import ? <><Spinner/> Parsing with Claude…</> : <><Cpu size={12}/> AI Parse & Import</>}
        </button>
        {apps.length>0 && (
          <div style={{marginTop:10,fontSize:11,color:V.t4,textAlign:"center"}}>
            {apps.length} apps loaded · <button onClick={()=>{if(confirm("Clear all apps?")){ setApps([]); setMeta({}); persist([],{}); }}} style={{color:V.red,background:"none",border:"none",cursor:"pointer",fontSize:11,padding:0}}>Clear all</button>
          </div>
        )}
      </div>

      {/* App list */}
      {apps.length>0 && (
        <div style={{...card,gridColumn:"1/-1",maxHeight:300,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>Loaded Apps ({apps.length})</div>
          <div style={{overflowY:"auto",flex:1}}>
            {apps.map(a=>(
              <div key={a.id} style={{display:"flex",gap:8,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${V.border}33`,fontSize:11}}>
                <span style={{flex:1,color:V.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.dn}</span>
                {pill(a.p,PLATFORMS[a.p]?.color||V.t3,`${PLATFORMS[a.p]?.color||V.t3}18`)}
                {pill(a.s,STATUS_COLOR[a.s]||V.t4,`${STATUS_COLOR[a.s]||V.t4}18`)}
                {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{color:V.t4}}><ExternalLink size={10}/></a>}
                <button onClick={()=>removeApp(a.id)} style={{color:V.t4,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}><X size={11}/></button>
              </div>
            ))}
          </div>
          {apps.length>0 && (
            <button onClick={()=>setTab("dashboard")} style={{marginTop:10,padding:"6px",borderRadius:6,border:`1px solid ${V.violet}44`,background:`${V.violet}14`,color:V.violet,fontSize:12,cursor:"pointer"}}>
              → Go to Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── DASHBOARD TAB ──────────────────────────────────────────────────
  const renderDashboard = ()=>(
    <div>
      {apps.length===0 && (
        <div style={{...card,textAlign:"center",padding:"48px 20px",borderStyle:"dashed",borderColor:V.violet+"44"}}>
          <Box size={32} style={{margin:"0 auto 12px",color:V.t4}}/>
          <div style={{color:V.t2,fontSize:14,fontWeight:500,marginBottom:6}}>No apps yet</div>
          <div style={{color:V.t4,fontSize:12,marginBottom:16}}>Add apps manually or use AI import in the Setup tab</div>
          <button onClick={()=>setTab("setup")} style={{padding:"8px 20px",borderRadius:7,border:`1px solid ${V.violet}44`,background:`${V.violet}14`,color:V.violet,fontSize:12,cursor:"pointer"}}>
            Go to Setup →
          </button>
        </div>
      )}
      {apps.length>0 && (<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[
            {label:"Total Apps",val:stats.total,color:V.violet,icon:<Box size={13}/>},
            {label:"Visitors/30d",val:stats.traffic.toLocaleString(),color:V.cyan,icon:<TrendingUp size={13}/>},
            {label:"Decided",val:`${stats.decided}/${stats.total}`,color:V.green,icon:<Check size={13}/>},
            {label:"Flagged",val:stats.flagged,color:V.amber,icon:<AlertTriangle size={13}/>},
          ].map((s,i)=>(
            <div key={i} style={{...card,textAlign:"center"}}>
              <div style={{color:s.color,display:"flex",justifyContent:"center",marginBottom:4}}>{s.icon}</div>
              <div style={{fontSize:22,fontWeight:700,color:s.color}}>{s.val}</div>
              <div style={{fontSize:11,color:V.t4,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
          <input placeholder="Search…" value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))}
            style={{...inp,width:160,padding:"6px 10px"}}/>
          {[
            {key:"platform",opts:[["all","All Platforms"],...Object.entries(PLATFORMS).map(([k,v])=>[k,v.label])]},
            {key:"lane",opts:[["all","All Lanes"],...Object.entries(lanes).map(([k,v])=>[k,v.label])]},
            {key:"status",opts:[["all","All Status"],["prod","Prod"],["active","Active"],["zombie","Zombie"],["parked","Parked"]]},
            {key:"decision",opts:[["all","All Decisions"],["null","Undecided"],...Object.entries(DECISIONS).map(([k,v])=>[k,v.label])]},
          ].map(({key,opts})=>(
            <select key={key} style={{...selSt,width:"auto",flex:"0 0 auto"}} value={filters[key]} onChange={e=>setFilters(f=>({...f,[key]:e.target.value}))}>
              {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <span style={{fontSize:11,color:V.t4,marginLeft:"auto"}}>{filt.length}/{apps.length}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
          {filt.map(a=>{
            const m=getMeta(a.id);
            const lc=lanes[m.lane];
            const isTriage=loading[a.id+"_triage"];
            const isChain=loading[a.id+"_chain"];
            return (
              <div key={a.id} style={{...card,borderColor:m.decision?DECISIONS[m.decision].color+"44":V.border,transition:"border-color 0.2s"}}>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>
                  {pill(a.p,PLATFORMS[a.p]?.color||V.t3,`${PLATFORMS[a.p]?.color||V.t3}18`)}
                  {lc && pill(lc.label,lc.color,lc.bg)}
                  {(a.f||[]).includes("zombie") && <Flame size={11} color={V.red}/>}
                  {(a.f||[]).includes("high-traffic") && <TrendingUp size={11} color={V.green}/>}
                </div>
                <div style={{fontWeight:600,fontSize:12,color:V.t1,lineHeight:1.3,marginBottom:2}}>{a.dn}</div>
                <div style={{fontSize:10,color:V.t4,marginBottom:7,fontFamily:"monospace"}}>{a.n}</div>
                <div style={{display:"flex",gap:8,marginBottom:8,fontSize:10,color:V.t3}}>
                  <span style={{color:STATUS_COLOR[a.s]||V.t3,fontWeight:600}}>● {a.s}</span>
                  {a.v!=null && <span><TrendingUp size={9} style={{display:"inline",verticalAlign:-1}}/> {a.v.toLocaleString()}</span>}
                  {a.e!=null && <span><RefreshCw size={9} style={{display:"inline",verticalAlign:-1}}/> {a.e}</span>}
                </div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:7}}>
                  {Object.entries(DECISIONS).map(([d,cfg])=>(
                    <button key={d} onClick={()=>updateMeta(a.id,{decision:m.decision===d?null:d})}
                      style={{padding:"2px 7px",borderRadius:5,border:`1px solid ${m.decision===d?cfg.color:"rgba(255,255,255,0.06)"}`,background:m.decision===d?cfg.bg:"transparent",color:m.decision===d?cfg.color:V.t4,fontSize:9,cursor:"pointer"}}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>
                  {["P0","P1","P2","P3"].map(p=>(
                    <button key={p} onClick={()=>updateMeta(a.id,{priority:m.priority===p?null:p})}
                      style={{padding:"1px 5px",borderRadius:4,border:`1px solid ${m.priority===p?PRIORITIES[p].color:"rgba(255,255,255,0.06)"}`,background:m.priority===p?PRIORITIES[p].bg:"transparent",color:m.priority===p?PRIORITIES[p].color:V.t4,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                      {p}
                    </button>
                  ))}
                  <button onClick={()=>handleTriage(a)} disabled={isTriage}
                    style={{padding:"1px 6px",borderRadius:4,border:`1px solid ${V.cyan}44`,background:"transparent",color:isTriage?V.t4:V.cyan,fontSize:9,cursor:isTriage?"not-allowed":"pointer",marginLeft:"auto",display:"flex",gap:4,alignItems:"center"}}>
                    {isTriage?<><Spinner/> AI…</>:<><Cpu size={9}/> Triage</>}
                  </button>
                  <button onClick={()=>handleChain(a)} disabled={isChain}
                    style={{padding:"1px 6px",borderRadius:4,border:`1px solid rgba(255,255,255,0.06)`,background:"transparent",color:isChain?V.t4:V.t3,fontSize:9,cursor:isChain?"not-allowed":"pointer"}}>
                    {isChain?<Spinner/>:"Chain"}
                  </button>
                  {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{color:V.t4}}><ExternalLink size={10}/></a>}
                </div>
                {m.notes && <div style={{marginTop:7,fontSize:10,color:V.t4,lineHeight:1.4,borderTop:`1px solid ${V.border}`,paddingTop:6,fontStyle:"italic"}}>{m.notes}</div>}
              </div>
            );
          })}
        </div>
      </>)}
    </div>
  );

  // ── CLEANUP TAB ────────────────────────────────────────────────────
  const renderCleanup = ()=>(
    <div>
      <div style={{...card,marginBottom:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:V.t3,fontWeight:500}}>Batch quick-assign:</span>
        {[
          {label:"Archive zombies",ids:apps.filter(a=>a.s==="zombie").map(a=>a.id),d:"archive",c:V.red},
          {label:"Archive dupes",ids:apps.filter(a=>(a.f||[]).includes("duplicate")).map(a=>a.id),d:"archive",c:V.amber},
          {label:"Keep production",ids:apps.filter(a=>a.s==="prod").map(a=>a.id),d:"keep",c:V.green},
        ].filter(b=>b.ids.length>0).map(b=>(
          <button key={b.label} onClick={()=>{
            setMeta(prev=>{const next={...prev};b.ids.forEach(id=>{next[id]={...(prev[id]||getMeta(id)),decision:b.d}});persist(null,next);return next;});
          }} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${b.c}44`,background:`${b.c}11`,color:b.c,fontSize:11,cursor:"pointer"}}>
            {b.label} ({b.ids.length})
          </button>
        ))}
        <button onClick={handleBulkTriage}
          style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${V.cyan}44`,background:`${V.cyan}11`,color:V.cyan,fontSize:11,cursor:"pointer",marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <Cpu size={11}/> AI Triage Undecided ({apps.filter(a=>!getMeta(a.id).decision).length})
        </button>
      </div>
      <div style={{...card,padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto",maxHeight:520,overflowY:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead style={{position:"sticky",top:0,background:V.s2,zIndex:1}}>
              <tr style={{borderBottom:`1px solid ${V.border}`}}>
                {["App","Platform","Lane","Decision","Priority","Migrate","WSJF","AI Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 12px",textAlign:"left",color:V.t4,fontWeight:500,whiteSpace:"nowrap",fontSize:10}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(a=>{
                const m=getMeta(a.id); const lc=lanes[m.lane];
                const isTriage=loading[a.id+"_triage"];
                const isChain=loading[a.id+"_chain"];
                return (
                  <tr key={a.id} style={{borderBottom:`1px solid ${V.border}22`}}>
                    <td style={{padding:"7px 12px",minWidth:160}}>
                      <div style={{color:V.t1,fontWeight:500}}>{a.dn}</div>
                      {m.notes && <div style={{fontSize:9,color:V.t4,marginTop:2,fontStyle:"italic",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.notes}</div>}
                    </td>
                    <td style={{padding:"7px 12px"}}>{pill(a.p,PLATFORMS[a.p]?.color||V.t3,`${PLATFORMS[a.p]?.color||V.t3}18`)}</td>
                    <td style={{padding:"7px 12px"}}>
                      <select style={{...selSt,fontSize:10,padding:"2px 6px",color:lc?.color,width:120}} value={m.lane} onChange={e=>updateMeta(a.id,{lane:e.target.value})}>
                        {Object.entries(lanes).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"7px 12px"}}>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {Object.entries(DECISIONS).map(([d,cfg])=>(
                          <button key={d} onClick={()=>updateMeta(a.id,{decision:m.decision===d?null:d})}
                            style={{padding:"1px 5px",borderRadius:3,border:`1px solid ${m.decision===d?cfg.color:"rgba(255,255,255,0.06)"}`,background:m.decision===d?cfg.bg:"transparent",color:m.decision===d?cfg.color:V.t4,fontSize:9,cursor:"pointer"}}>
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td style={{padding:"7px 12px"}}>
                      <select style={{...selSt,fontSize:10,padding:"2px 6px",color:m.priority?PRIORITIES[m.priority].color:V.t4,width:60}} value={m.priority||""} onChange={e=>updateMeta(a.id,{priority:e.target.value||null})}>
                        <option value="">—</option>
                        {["P0","P1","P2","P3"].map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"7px 12px",textAlign:"center"}}>
                      <input type="checkbox" checked={m.migration} onChange={e=>updateMeta(a.id,{migration:e.target.checked})} style={{accentColor:V.cyan,cursor:"pointer"}}/>
                    </td>
                    <td style={{padding:"7px 12px"}}>
                      <input type="number" min="1" max="21" value={m.wsjf||""} placeholder="1–21"
                        onChange={e=>updateMeta(a.id,{wsjf:e.target.value?parseInt(e.target.value):null})}
                        style={{...inp,width:50,textAlign:"center",padding:"2px 5px"}}/>
                    </td>
                    <td style={{padding:"7px 12px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>handleTriage(a)} disabled={isTriage}
                          style={{padding:"2px 7px",borderRadius:4,border:`1px solid ${V.cyan}44`,background:"transparent",color:isTriage?V.t4:V.cyan,fontSize:9,cursor:isTriage?"not-allowed":"pointer",display:"flex",gap:3,alignItems:"center"}}>
                          {isTriage?<><Spinner/> …</>:<><Cpu size={9}/> Triage</>}
                        </button>
                        <button onClick={()=>handleChain(a)} disabled={isChain}
                          style={{padding:"2px 7px",borderRadius:4,border:`1px solid ${V.violet}44`,background:"transparent",color:isChain?V.t4:V.violet,fontSize:9,cursor:isChain?"not-allowed":"pointer",display:"flex",gap:3,alignItems:"center"}}>
                          {isChain?<><Spinner/> …</>:"Chain"}
                        </button>
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

  // ── SPRINT TAB ─────────────────────────────────────────────────────
  const renderSprint = ()=>{
    const byP = p => apps.filter(a=>getMeta(a.id).priority===p).sort((a,b)=>(getMeta(b.id).wsjf||0)-(getMeta(a.id).wsjf||0));
    const topWSJF = [...apps].filter(a=>getMeta(a.id).wsjf).sort((a,b)=>(getMeta(b.id).wsjf||0)-(getMeta(a.id).wsjf||0)).slice(0,8);
    const migList = apps.filter(a=>getMeta(a.id).migration);
    return (
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {Object.entries(PRIORITIES).map(([p,cfg])=>(
            <div key={p} style={{...card,borderColor:`${cfg.color}44`,textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:cfg.color}}>{byP(p).length}</div>
              <div style={{fontSize:11,color:cfg.color,fontWeight:600}}>{p}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div style={card}>
            <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>Priority Board</div>
            {Object.entries(PRIORITIES).map(([p,cfg])=>{
              const list=byP(p);
              return (
                <div key={p} style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:cfg.color,fontWeight:700,marginBottom:3,display:"flex",justifyContent:"space-between"}}>
                    {p} <span style={{color:V.t4}}>{list.length}</span>
                  </div>
                  {list.length===0 ? <div style={{fontSize:10,color:V.t4}}>— none</div> : list.map(a=>(
                    <div key={a.id} style={{display:"flex",gap:6,padding:"2px 0",borderBottom:`1px solid ${V.border}33`,fontSize:10}}>
                      <span style={{flex:1,color:V.t2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.dn}</span>
                      {getMeta(a.id).wsjf && <span style={{color:cfg.color,fontWeight:600}}>W{getMeta(a.id).wsjf}</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{...card,flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>WSJF Leaderboard</div>
              {topWSJF.length===0
                ? <div style={{fontSize:11,color:V.t4}}>Set WSJF scores in Cleanup tab to populate the backlog.</div>
                : topWSJF.map((a,i)=>{
                  const m=getMeta(a.id);
                  return (
                    <div key={a.id} style={{display:"flex",gap:8,alignItems:"center",padding:"3px 0",borderBottom:`1px solid ${V.border}22`,fontSize:10}}>
                      <span style={{color:V.t4,minWidth:16,fontFamily:"monospace"}}>#{i+1}</span>
                      <span style={{flex:1,color:V.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.dn}</span>
                      <span style={{fontWeight:700,color:V.cyan}}>{m.wsjf}</span>
                      {m.priority && pill(m.priority,PRIORITIES[m.priority].color,PRIORITIES[m.priority].bg,9)}
                    </div>
                  );
                })
              }
            </div>
            <div style={card}>
              <div style={{fontSize:12,fontWeight:600,color:V.cyan,marginBottom:8,display:"flex",gap:5,alignItems:"center"}}>
                <ArrowRightLeft size={12}/> Migration Candidates ({migList.length})
              </div>
              {migList.length===0
                ? <div style={{fontSize:11,color:V.t4}}>Toggle Migrate on cards to flag.</div>
                : migList.map(a=>(
                  <div key={a.id} style={{display:"flex",gap:6,alignItems:"center",padding:"3px 0",fontSize:10}}>
                    <span style={{flex:1,color:V.t2}}>{a.dn}</span>
                    <button onClick={()=>handleChain(a)} style={{padding:"1px 6px",borderRadius:3,border:`1px solid ${V.cyan}33`,background:"transparent",color:V.cyan,fontSize:9,cursor:"pointer"}}>Chain</button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        {/* AI Sprint Plan */}
        <div style={card}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:600,color:V.violet,display:"flex",gap:6,alignItems:"center"}}><Zap size={13}/> AI Sprint Plan</span>
            <button onClick={handleSprintPlan} disabled={!!loading.sprint||apps.length===0}
              style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${V.violet}44`,background:loading.sprint?V.s3:`${V.violet}14`,color:loading.sprint?V.t4:V.violet,fontSize:11,cursor:loading.sprint||apps.length===0?"not-allowed":"pointer",display:"flex",gap:6,alignItems:"center"}}>
              {loading.sprint?<><Spinner/> Planning…</>:<><Cpu size={11}/> Generate Top 5</>}
            </button>
            {sprintPlan && <button onClick={()=>copy(sprintPlan)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${V.border}`,background:"transparent",color:copied?V.green:V.t3,fontSize:11,cursor:"pointer"}}>{copied?"Copied!":"Copy"}</button>}
          </div>
          {sprintPlan
            ? <pre style={{fontSize:11,color:V.t2,lineHeight:1.7,fontFamily:"monospace",whiteSpace:"pre-wrap",margin:0}}>{sprintPlan}</pre>
            : <div style={{fontSize:11,color:V.t4}}>Click Generate to get Claude's sprint recommendations based on your full app portfolio and current meta state.</div>
          }
        </div>
      </div>
    );
  };

  // ── MODAL ──────────────────────────────────────────────────────────
  const renderModal = ()=>{
    if(!modal) return null;
    let content="", title="";
    if(modal.type==="text"){ content=modal.content; title=modal.title; }
    if(modal.type==="cleanup"){ content=genCleanup(); title="Cleanup Action List"; }
    if(modal.type==="sprint"){ content=genSprint(); title="Sprint Backlog (WSJF)"; }
    return (
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",zIndex:50,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",overflowY:"auto"}}>
        <div style={{...card,width:"100%",maxWidth:700}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{color:V.t1,fontWeight:600,fontSize:13}}>{title}</span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>copy(content)} style={{...inp,cursor:"pointer",color:copied?V.green:V.cyan,width:"auto",padding:"4px 12px"}}>{copied?"Copied!":"Copy All"}</button>
              <button onClick={()=>setModal(null)} style={{...inp,cursor:"pointer",color:V.t3,width:"auto",padding:"4px 10px"}}>✕</button>
            </div>
          </div>
          <textarea readOnly value={content} style={{...inp,height:420,resize:"vertical",fontFamily:"monospace",fontSize:11,lineHeight:1.6}}/>
        </div>
      </div>
    );
  };

  // ── ROOT ───────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:V.s1,fontFamily:"'Geist',system-ui,sans-serif",color:V.t2,position:"relative"}}>
      <div style={{background:V.s2,borderBottom:`1px solid ${V.border}`,padding:"14px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:15,letterSpacing:-0.3}}>
              <span style={{background:`linear-gradient(135deg,${V.violet},${V.magenta})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>App Ops</span>
              {" "}<span style={{color:V.t3,fontWeight:400,fontSize:13}}>/ {project.name}</span>
            </span>
            {apps.length>0 && <span style={{fontSize:11,color:V.t4}}>{apps.length} apps</span>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved && <span style={{fontSize:10,color:V.green}}>Saved ✓</span>}
            {apps.length>0 && <>
              <button onClick={()=>setModal({type:"cleanup"})} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:11,cursor:"pointer"}}>Cleanup</button>
              <button onClick={()=>setModal({type:"sprint"})} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:11,cursor:"pointer"}}>Sprint CSV</button>
            </>}
          </div>
        </div>
        <div style={{display:"flex",gap:0}}>
          {[
            {id:"setup",icon:<Settings size={12}/>,label:"Setup"},
            {id:"dashboard",icon:<LayoutDashboard size={12}/>,label:`Dashboard${apps.length?` · ${apps.length}`:""}` },
            {id:"cleanup",icon:<Trash2 size={12}/>,label:`Cleanup · ${stats.decided}/${stats.total}`},
            {id:"sprint",icon:<Zap size={12}/>,label:"Sprint Board"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"7px 14px",border:"none",borderBottom:tab===t.id?`2px solid ${V.violet}`:"2px solid transparent",borderRadius:"5px 5px 0 0",background:tab===t.id?V.s1:"transparent",color:tab===t.id?V.t1:V.t4,fontSize:11,fontWeight:tab===t.id?600:400,cursor:"pointer",display:"flex",gap:5,alignItems:"center",transition:"all 0.15s"}}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 20px 48px"}}>
        {tab==="setup"     && renderSetup()}
        {tab==="dashboard" && renderDashboard()}
        {tab==="cleanup"   && renderCleanup()}
        {tab==="sprint"    && renderSprint()}
      </div>
      {modal && renderModal()}
    </div>
  );
}
