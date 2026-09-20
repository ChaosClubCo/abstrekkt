import { useState, useEffect, useCallback } from "react";

const WEBHOOK_DEFAULT = "https://krosebrook.app.n8n.cloud/webhook/portfolio-sync";
const PLATFORMS = ["Vercel","Firebase","Base44","GitHub","Replit","Supabase","Lovable","Cloudflare","Other"];
const STATUSES  = ["Active","Planning","Blocked","Archived","Sunset"];

const SEED_PROJECTS = [
  // Active platforms
  { id:"continuum-001",    name:"Continuum",              status:"Active",   platform:"Vercel",   techDebt:2, businessValue:5, monthlyCost:20,  lastActivity:"2026-03-23", repo:"https://github.com/Krosebrook/continuum",   auditChecks:{hasTests:true,  hasCI:true,  hasDocs:false}, notes:"Next.js 16 / Supabase / Tailwind 4. 90+ dependabot PRs — batch-merge strategy. Claude-powered discovery API committed. Last good prod deploy 2026-03-23." },
  { id:"chaos-club-app",   name:"Chaos Club Co. App",     status:"Active",   platform:"Firebase", techDebt:2, businessValue:5, monthlyCost:25,  lastActivity:"2026-03-26", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:true},  notes:"Peer support & wellness platform. MVP concept complete. Firebase Studio full spec exists. BLOCKED on legal foundation (must complete first). Rebel AI raccoon mascot w/ crisis detection." },
  { id:"chaos-club-book1", name:"BTBS Book 1",             status:"Active",   platform:"Other",    techDebt:1, businessValue:4, monthlyCost:0,   lastActivity:"2026-03-26", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:true},  notes:"'Breathe Through the Bullsh*t' — manuscript COMPLETE (76K chars). Build script written (build_manuscript.js) but NOT executed. Chapters 1-6 appear twice in source — exclude duplicate. Waiting for docx build + delivery." },
  { id:"memoir-001",       name:"The Memoir",              status:"Planning", platform:"Other",    techDebt:1, businessValue:5, monthlyCost:0,   lastActivity:"2026-03-26", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:true},  notes:"Literary nonfiction. Thesis locked: construction vs. recovery. Voice DNA v2 artifact built. Letter-to-Kinsley frame is load-bearing. Phase: early excavation. No chapters drafted. Next: hospitality years excavation session." },
  { id:"kylerosebrook-001",name:"kylerosebrook.com",       status:"Planning", platform:"Vercel",   techDebt:1, businessValue:5, monthlyCost:0,   lastActivity:"2026-03-26", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:true},  notes:"WordPress.com Business plan (site ID 253504189). Launch pending: disable Coming Soon, set static homepage, confirm custom domain. Currently blocked from crawl (robots.txt). 'Staff Engineer' removed from all copy. Honest early-collaborator positioning." },
  { id:"flashfusion-co",   name:"flashfusion.co",          status:"Active",   platform:"Base44",   techDebt:2, businessValue:4, monthlyCost:0,   lastActivity:"2026-03-20", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:false}, notes:"Currently points to Base44 'Fusion AI' app (id: 68dd8e79ca073475565c8e16). 67-entity enterprise AI schema. Commercial path: Sole Revival as first customer, CSTMPRNT simultaneous." },
  // Archived / low-activity
  { id:"flashfusion-001",  name:"FlashFusion-Unified",     status:"Archived", platform:"Vercel",   techDebt:4, businessValue:4, monthlyCost:20,  lastActivity:"2025-09-01", repo:"https://github.com/Krosebrook/FlashFusion", auditChecks:{hasTests:false, hasCI:false, hasDocs:false}, notes:"Archived at 60-70% completion. Vite/Vercel. B2B AI enablement — audits, consulting, skills. Revival contingent on first customer (Sole Revival). Context: do not confuse with ChaosClub or Intinc." },
  { id:"kidcreator-001",   name:"KidCreator / Kinsley App",status:"Planning", platform:"GitHub",   techDebt:2, businessValue:4, monthlyCost:0,   lastActivity:"2025-11-01", repo:"",                                          auditChecks:{hasTests:false, hasCI:false, hasDocs:false}, notes:"Educational creative sandbox for Kinsley (ages 8-10). Voice-powered. Concept only — no spec docs exist. Google AI Studio game template identified as base. Development not started." },
];

const calcHealth = (p) => {
  const days = p.lastActivity ? Math.floor((Date.now()-new Date(p.lastActivity))/86400000) : 999;
  let s = 100;
  if (days>180) s-=40; else if (days>90) s-=25; else if (days>30) s-=10;
  s -= ((p.techDebt||3)-1)*8;
  if (p.status==="Blocked") s-=20;
  if (p.status==="Archived"||p.status==="Sunset") s-=30;
  s += ((p.businessValue||3)-3)*5;
  s += Object.values(p.auditChecks||{}).filter(Boolean).length*2;
  return Math.max(0,Math.min(100,Math.round(s)));
};

const hc = (h) => h>=75?"#3fb950":h>=50?"#d29922":h>=30?"#f0883e":"#da3633";
const hl = (h) => h>=75?"Healthy":h>=50?"Fair":h>=30?"At Risk":"Critical";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c10;--s:#0d1117;--s2:#161b22;--s3:#21262d;
  --b:#21262d;--b2:#30363d;--t:#e6edf3;--t2:#8b949e;--t3:#484f58;
  --a:#7c3aed;--a2:#a855f7;--ag:rgba(124,58,237,0.15);
  --green:#3fb950;--yellow:#d29922;--orange:#f0883e;--red:#da3633;--blue:#388bfd;
}
body{background:var(--bg);color:var(--t);font-family:'IBM Plex Sans',sans-serif;font-size:13px;min-height:100vh}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
.mono{font-family:'IBM Plex Mono',monospace}
.btn{cursor:pointer;border:none;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;padding:6px 14px;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.btn:hover{filter:brightness(1.15)} .btn:active{transform:scale(0.97)}
.btn-primary{background:var(--a);color:#fff}
.btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--b2)}
.btn-ghost:hover{color:var(--t);border-color:var(--t2)}
.btn-sm{padding:4px 10px;font-size:11px}
.inp{background:var(--s);border:1px solid var(--b2);border-radius:6px;color:var(--t);font-family:inherit;font-size:12px;padding:7px 10px;outline:none;width:100%;transition:border-color 0.15s}
.inp:focus{border-color:var(--a)} select.inp{cursor:pointer}
.card{background:var(--s2);border:1px solid var(--b);border-radius:10px;padding:16px}
.pbar{height:4px;background:var(--s3);border-radius:2px;overflow:hidden}
.pfill{height:100%;border-radius:2px;transition:width 0.6s}
.sl{font-size:10px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'IBM Plex Mono',monospace}
.badge{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px;text-transform:uppercase;letter-spacing:0.5px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;backdrop-filter:blur(4px)}
.modal{background:var(--s2);border:1px solid var(--b2);border-radius:12px;padding:24px;width:540px;max-width:100%;max-height:90vh;overflow-y:auto}
.spin{animation:spin 1s linear infinite;display:inline-block}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fade{animation:fade 0.25s ease}
@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
`;

const SBadge = ({status}) => {
  const c = {Active:"#3fb950",Planning:"#388bfd",Blocked:"#da3633",Archived:"#484f58",Sunset:"#8b949e"}[status]||"#8b949e";
  return <span className="badge" style={{background:c+"22",color:c,border:`1px solid ${c}44`}}>{status}</span>;
};

const HBar = ({score}) => (
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div className="pbar" style={{flex:1}}><div className="pfill" style={{width:`${score}%`,background:hc(score)}}/></div>
    <span className="mono" style={{fontSize:11,color:hc(score),minWidth:24,textAlign:"right"}}>{score}</span>
  </div>
);

const Stat = ({label,value,sub,color,icon}) => (
  <div className="card" style={{padding:"14px 16px"}}>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <div>
        <div className="sl" style={{marginBottom:3}}>{label}</div>
        <div className="mono" style={{fontSize:24,fontWeight:600,color:color||"var(--t)",lineHeight:1}}>{value}</div>
        {sub&&<div style={{fontSize:11,color:"var(--t2)",marginTop:3}}>{sub}</div>}
      </div>
      {icon&&<div style={{fontSize:18,opacity:0.4}}>{icon}</div>}
    </div>
  </div>
);

function ProjectModal({project,onSave,onClose}) {
  const [p,setP] = useState({...project});
  const s = (k,v) => setP(x=>({...x,[k]:v}));
  const sa = (k,v) => setP(x=>({...x,auditChecks:{...x.auditChecks,[k]:v}}));
  const repoUrl = p.repo?.startsWith("http") ? p.repo : p.repo ? `https://github.com/${p.repo}` : null;
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade" style={{width:620}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <b style={{fontSize:15}}>{p.id?"Edit Project":"New Project"}</b>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div><div className="sl">Name</div><input className="inp" value={p.name} onChange={e=>s("name",e.target.value)} placeholder="Project name"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div className="sl">Status</div><select className="inp" value={p.status} onChange={e=>s("status",e.target.value)}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></div>
            <div><div className="sl">Platform</div><select className="inp" value={p.platform} onChange={e=>s("platform",e.target.value)}>{PLATFORMS.map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div className="sl">Tech Debt (1–5)</div><input className="inp" type="number" min={1} max={5} value={p.techDebt} onChange={e=>s("techDebt",+e.target.value)}/></div>
            <div><div className="sl">Business Value (1–5)</div><input className="inp" type="number" min={1} max={5} value={p.businessValue} onChange={e=>s("businessValue",+e.target.value)}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div className="sl">Monthly Cost ($)</div><input className="inp" type="number" min={0} value={p.monthlyCost} onChange={e=>s("monthlyCost",+e.target.value)}/></div>
            <div><div className="sl">Last Activity</div><input className="inp" type="date" value={p.lastActivity} onChange={e=>s("lastActivity",e.target.value)}/></div>
          </div>
          <div>
            <div className="sl">Repo / URL</div>
            <div style={{display:"flex",gap:6}}>
              <input className="inp" value={p.repo||""} onChange={e=>s("repo",e.target.value)} placeholder="https://github.com/org/repo"/>
              {repoUrl&&<button className="btn btn-ghost btn-sm" style={{flexShrink:0,whiteSpace:"nowrap"}} onClick={()=>window.open(repoUrl,"_blank")}>↗ Open</button>}
            </div>
          </div>
          <div>
            <div className="sl">Notes / Current State</div>
            <textarea className="inp" style={{minHeight:80,fontSize:12,resize:"vertical"}} value={p.notes||""} onChange={e=>s("notes",e.target.value)} placeholder="Current status, blockers, next actions..."/>
          </div>
          <div>
            <div className="sl" style={{marginBottom:8}}>Audit Checks</div>
            <div style={{display:"flex",gap:16}}>
              {["hasTests","hasCI","hasDocs"].map(k=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"var(--t2)"}}>
                  <input type="checkbox" checked={!!p.auditChecks?.[k]} onChange={e=>sa(k,e.target.checked)} style={{accentColor:"var(--a)"}}/>
                  {k.replace("has","")}
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>onSave(p)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({webhookUrl,githubToken,onSave,onClose}) {
  const [url,setUrl] = useState(webhookUrl);
  const [token,setToken] = useState(githubToken);
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade" style={{width:480}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <b style={{fontSize:15}}>Settings</b>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div className="sl">n8n Webhook URL</div>
            <input className="inp mono" value={url} onChange={e=>setUrl(e.target.value)} style={{fontSize:11}}/>
          </div>
          <div>
            <div className="sl">GitHub Token (optional)</div>
            <input className="inp mono" type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="ghp_..." style={{fontSize:11}}/>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>onSave(url,token)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [projects,setProjects] = useState(()=>{
    try{const s=localStorage.getItem("pcc_p_v2");return s?JSON.parse(s):SEED_PROJECTS;}catch{return SEED_PROJECTS;}
  });
  const [webhookUrl,setWebhookUrl] = useState(()=>localStorage.getItem("pcc_wh")||WEBHOOK_DEFAULT);
  const [githubToken,setGithubToken] = useState(()=>localStorage.getItem("pcc_gt")||"");
  const [syncData,setSyncData] = useState(null);
  const [syncing,setSyncing] = useState(false);
  const [syncError,setSyncError] = useState("");
  const [lastSync,setLastSync] = useState(null);
  const [editP,setEditP] = useState(null);
  const [showNew,setShowNew] = useState(false);
  const [showSettings,setShowSettings] = useState(false);
  const [filter,setFilter] = useState("All");
  const [tab,setTab] = useState("pipeline");

  useEffect(()=>{
    try{localStorage.setItem("pcc_p_v2",JSON.stringify(projects));}catch{}
  },[projects]);

  const saveSettings = (url,token) => {
    const u = url||WEBHOOK_DEFAULT;
    setWebhookUrl(u); setGithubToken(token);
    localStorage.setItem("pcc_wh",u); localStorage.setItem("pcc_gt",token);
    setShowSettings(false);
  };

  const sync = useCallback(async()=>{
    if(syncing) return;
    setSyncing(true); setSyncError("");
    try {
      const res = await fetch(webhookUrl,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          projects: projects.map(p=>({
            id:p.id,name:p.name,status:p.status,platform:p.platform,
            techDebt:p.techDebt,businessValue:p.businessValue,
            monthlyCost:p.monthlyCost,lastActivity:p.lastActivity,
            repo:p.repo||"",auditChecks:p.auditChecks||{}
          })),
          githubToken: githubToken||"",
          meta:{requestedAt:new Date().toISOString(),source:"pcc-ui"}
        })
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if(data.success){
        setSyncData(data); setLastSync(new Date());
        if(data.enrichedProjects?.length){
          const em = Object.fromEntries(data.enrichedProjects.map(e=>[e.id,e]));
          setProjects(prev=>prev.map(p=>{
            const e=em[p.id]; if(!e) return p;
            return {...p,githubData:e.githubData||p.githubData,lastActivity:e.lastActivity||p.lastActivity};
          }));
        }
      } else {
        setSyncError(data.error||"Sync failed");
      }
    } catch(err){
      setSyncError(err.message||"Network error — check webhook URL in Settings");
    } finally {
      setSyncing(false);
    }
  },[projects,webhookUrl,githubToken,syncing]);

  const saveProject = (p) => {
    if(!p.id) p.id=`proj-${Date.now()}`;
    setProjects(prev=>{const i=prev.findIndex(x=>x.id===p.id);if(i>=0){const n=[...prev];n[i]=p;return n;}return [...prev,p];});
    setEditP(null); setShowNew(false);
  };

  const deleteProject = (id) => { if(confirm("Delete?")) setProjects(prev=>prev.filter(p=>p.id!==id)); };

  const wh = projects.map(p=>({...p,health:calcHealth(p)}));
  const filtered = filter==="All"?wh:wh.filter(p=>p.status===filter);
  const sum = syncData?.summary||{
    total:projects.length,
    avgHealth:Math.round(wh.reduce((s,p)=>s+p.health,0)/(wh.length||1)),
    totalMonthlyCost:projects.reduce((s,p)=>s+(p.monthlyCost||0),0),
    needsMigration:projects.filter(p=>p.platform==="Base44"||p.platform==="Bolt").length,
    activeCount:projects.filter(p=>p.status==="Active").length,
    blockedCount:projects.filter(p=>p.status==="Blocked").length,
    unhealthyCount:wh.filter(p=>p.health<40).length,
  };
  const criticals = wh.filter(p=>p.health<40||p.status==="Blocked").sort((a,b)=>a.health-b.health);

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:"var(--bg)"}}>

        {/* Header */}
        <div style={{background:"var(--s)",borderBottom:"1px solid var(--b)",padding:"11px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:26,height:26,borderRadius:6,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⬡</div>
            <div>
              <div className="mono" style={{fontWeight:600,fontSize:13}}>Portfolio Command Center</div>
              <div className="mono" style={{fontSize:9,color:"var(--t3)"}}>
                {lastSync?`synced ${lastSync.toLocaleTimeString()}`:"not synced · hit Sync Now"}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {syncError&&<span style={{fontSize:11,color:"var(--red)",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>⚠ {syncError}</span>}
            <button className="btn btn-ghost btn-sm" title="Reset to default seed projects" onClick={()=>{if(window.confirm("Reset to default project list? Local edits will be lost.")){localStorage.removeItem("pcc_p_v2");setProjects(SEED_PROJECTS);setSyncData(null);setLastSync(null);setFilter("All");setTab("pipeline");}}}>↺ Reset</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowSettings(true)}>⚙</button>
            <button className="btn btn-primary" onClick={sync} disabled={syncing} style={{minWidth:96}}>
              {syncing?<><span className="spin">↻</span> Syncing…</>:<>↻ Sync Now</>}
            </button>
          </div>
        </div>

        <div style={{padding:"20px",maxWidth:1200,margin:"0 auto"}}>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            <Stat label="Avg Health" value={sum.avgHealth} sub={hl(sum.avgHealth)} color={hc(sum.avgHealth)} icon="♥"/>
            <Stat label="Projects" value={sum.total} sub={`${sum.activeCount} active`} icon="◈"/>
            <Stat label="Monthly Cost" value={`$${sum.totalMonthlyCost}`} sub={sum.needsMigration>0?`${sum.needsMigration} need migration`:"no migrations needed"} color={sum.needsMigration>0?"var(--yellow)":undefined} icon="$"/>
            <Stat label="Issues" value={sum.blockedCount+sum.unhealthyCount} sub={`${sum.blockedCount} blocked · ${sum.unhealthyCount} unhealthy`} color={(sum.blockedCount+sum.unhealthyCount)>0?"var(--red)":"var(--green)"} icon="⚡"/>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:14}}>
            {["pipeline","health","alerts"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"'IBM Plex Mono'",fontSize:11,fontWeight:500,background:tab===t?"var(--a)":"transparent",color:tab===t?"#fff":"var(--t2)"}}>
                {t}
              </button>
            ))}
            <div style={{flex:1}}/>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowNew(true)}>+ Add</button>
          </div>

          {/* Pipeline */}
          {tab==="pipeline"&&(
            <div className="fade">
              <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                {["All",...STATUSES].map(s=>(
                  <button key={s} onClick={()=>setFilter(s)} style={{padding:"3px 12px",borderRadius:100,border:"1px solid",cursor:"pointer",fontFamily:"inherit",fontSize:11,borderColor:filter===s?"var(--a)":"var(--b2)",background:filter===s?"var(--ag)":"transparent",color:filter===s?"var(--a2)":"var(--t2)"}}>
                    {s}
                  </button>
                ))}
                <span style={{fontSize:11,color:"var(--t3)",alignSelf:"center",marginLeft:4}}>{filtered.length}</span>
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid var(--b)"}}>
                      {["Project","Status","Platform","Health","Activity","Cost/mo","Links",""].map(h=>(
                        <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",fontFamily:"'IBM Plex Mono'",textTransform:"uppercase",letterSpacing:"0.6px"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p,i)=>{
                      const repoUrl = p.repo ? (p.repo.startsWith("http") ? p.repo : `https://github.com/${p.repo}`) : null;
                      return (
                        <tr key={p.id} style={{borderBottom:i<filtered.length-1?"1px solid var(--b)":"none",background:i%2===1?"rgba(255,255,255,0.01)":"transparent"}}>
                          <td style={{padding:"10px 14px",maxWidth:200}}>
                            <div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                            {p.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:190}} title={p.notes}>{p.notes}</div>}
                            {p.githubData?.language&&<div style={{fontSize:10,color:"var(--t3)",fontFamily:"'IBM Plex Mono'"}}>{p.githubData.language}</div>}
                          </td>
                          <td style={{padding:"10px 14px"}}><SBadge status={p.status}/></td>
                          <td style={{padding:"10px 14px",fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'"}}>{p.platform}</td>
                          <td style={{padding:"10px 14px",minWidth:120}}><HBar score={p.health}/></td>
                          <td style={{padding:"10px 14px",fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'",whiteSpace:"nowrap"}}>{p.lastActivity||"—"}</td>
                          <td style={{padding:"10px 14px",fontSize:11,color:p.monthlyCost>0?"var(--t)":"var(--t3)",fontFamily:"'IBM Plex Mono'"}}>{p.monthlyCost>0?`$${p.monthlyCost}`:"free"}</td>
                          <td style={{padding:"10px 14px"}}>
                            <div style={{display:"flex",gap:4}}>
                              {repoUrl&&<button className="btn btn-ghost btn-sm" onClick={()=>window.open(repoUrl,"_blank")} title={p.repo} style={{fontSize:11,padding:"3px 8px"}}>↗ repo</button>}
                            </div>
                          </td>
                          <td style={{padding:"10px 14px"}}>
                            <div style={{display:"flex",gap:4}}>
                              <button className="btn btn-ghost btn-sm" onClick={()=>setEditP(p)}>Edit</button>
                              <button className="btn btn-ghost btn-sm" style={{color:"var(--red)"}} onClick={()=>deleteProject(p.id)}>✕</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--t3)"}}>No projects</div>}
              </div>
            </div>
          )}

          {/* Health */}
          {tab==="health"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:8}}>
              {[...wh].sort((a,b)=>a.health-b.health).map(p=>{
                const repoUrl = p.repo ? (p.repo.startsWith("http") ? p.repo : `https://github.com/${p.repo}`) : null;
                return (
                  <div key={p.id} className="card" style={{padding:"12px 16px",borderLeft:`3px solid ${hc(p.health)}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontWeight:500}}>{p.name}</span>
                          <SBadge status={p.status}/>
                          <span style={{fontSize:10,color:"var(--t3)",fontFamily:"'IBM Plex Mono'"}}>{p.platform}</span>
                          {repoUrl&&<button className="btn btn-ghost btn-sm" style={{fontSize:10,padding:"1px 6px"}} onClick={()=>window.open(repoUrl,"_blank")}>↗</button>}
                        </div>
                        <HBar score={p.health}/>
                        {p.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:5,lineHeight:1.4}}>{p.notes.slice(0,120)}{p.notes.length>120?"…":""}</div>}
                      </div>
                      <div style={{textAlign:"right",minWidth:72}}>
                        <div className="mono" style={{fontSize:22,fontWeight:600,color:hc(p.health),lineHeight:1}}>{p.health}</div>
                        <div style={{fontSize:10,color:"var(--t3)"}}>{hl(p.health)}</div>
                      </div>
                      {p.githubData&&(
                        <div style={{display:"flex",gap:10,fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'"}}>
                          <span>★{p.githubData.stars}</span>
                          {p.githubData.openIssues>0&&<span style={{color:"var(--orange)"}}>⚠{p.githubData.openIssues}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Alerts */}
          {tab==="alerts"&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",gap:8}}>
              {criticals.length===0?(
                <div className="card" style={{padding:32,textAlign:"center"}}>
                  <div style={{fontSize:24,marginBottom:6}}>✓</div>
                  <div style={{color:"var(--green)",fontWeight:500}}>All clear</div>
                  <div style={{color:"var(--t3)",fontSize:11,marginTop:4}}>Sync to get latest scores</div>
                </div>
              ):criticals.map(p=>{
                const repoUrl = p.repo ? (p.repo.startsWith("http") ? p.repo : `https://github.com/${p.repo}`) : null;
                return (
                  <div key={p.id} className="card" style={{borderColor:"var(--red)",background:"rgba(218,54,51,0.05)",padding:"13px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,marginRight:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontWeight:600,color:"var(--red)"}}>⚠ {p.name}</span>
                          <SBadge status={p.status}/>
                          {repoUrl&&<button className="btn btn-ghost btn-sm" style={{fontSize:10,padding:"1px 6px"}} onClick={()=>window.open(repoUrl,"_blank")}>↗ repo</button>}
                        </div>
                        <div style={{fontSize:11,color:"var(--t2)"}}>
                          {p.status==="Blocked"&&"Blocked — needs unblocking. "}
                          {`Health ${p.health}/100`}
                          {p.lastActivity&&` · Last active ${p.lastActivity}`}
                        </div>
                        {p.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:5,lineHeight:1.4}}>{p.notes.slice(0,160)}{p.notes.length>160?"…":""}</div>}
                      </div>
                      <div className="mono" style={{fontSize:26,fontWeight:700,color:"var(--red)",flexShrink:0}}>{p.health}</div>
                    </div>
                  </div>
                );
              })}
              {sum.needsMigration>0&&(
                <div className="card" style={{borderColor:"var(--yellow)",background:"rgba(210,153,34,0.05)",padding:"13px 16px"}}>
                  <span style={{color:"var(--yellow)",fontWeight:600}}>⚡ </span>
                  <span style={{fontSize:12,color:"var(--t2)"}}>{sum.needsMigration} project{sum.needsMigration>1?"s":""} on Base44/Bolt need migration</span>
                </div>
              )}
            </div>
          )}

          {!lastSync&&(
            <div style={{marginTop:18,padding:"11px 16px",background:"var(--ag)",border:"1px solid var(--a)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div style={{fontSize:12,color:"var(--a2)"}}>Hit <strong>Sync Now</strong> to push your portfolio to n8n for health analysis</div>
              <div className="mono" style={{fontSize:10,color:"var(--t3)",whiteSpace:"nowrap"}}>{webhookUrl.replace("https://","")}</div>
            </div>
          )}
        </div>
      </div>

      {(editP||showNew)&&(
        <ProjectModal
          project={editP||{id:"",name:"",status:"Active",platform:"Vercel",techDebt:3,businessValue:3,monthlyCost:0,lastActivity:new Date().toISOString().split("T")[0],repo:"",notes:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:false}}}
          onSave={saveProject}
          onClose={()=>{setEditP(null);setShowNew(false);}}
        />
      )}
      {showSettings&&<SettingsModal webhookUrl={webhookUrl} githubToken={githubToken} onSave={saveSettings} onClose={()=>setShowSettings(false)}/>}
    </>
  );
}
