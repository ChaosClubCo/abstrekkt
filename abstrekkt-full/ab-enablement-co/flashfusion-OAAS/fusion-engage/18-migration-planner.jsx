import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const api=async(msgs,max=1500,sys)=>{const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");};
const SOURCES=[
  {id:"chatgpt",name:"ChatGPT / GPT-4o",icon:"◆",features:["Custom GPTs","DALL-E","Voice mode","Plugins"],migrate:["Export custom GPT instructions → Claude Project instructions","Conversation history: not transferable (start fresh)","DALL-E workflows: no direct equivalent — use Stability AI or SDXL","Plugins → MCP connectors (50+ available, open standard)"]},
  {id:"copilot",name:"GitHub Copilot",icon:"◇",features:["Code completion","Chat in IDE","PR summaries"],migrate:["Copilot code completion: Claude Code CLI + skills replace this","In-IDE chat: Claude Code terminal or Cursor with Claude backend","PR summaries: Claude Code with code-review skill","Copilot Workspace → Claude Code agents + subagents"]},
  {id:"gemini",name:"Gemini / Google AI",icon:"◌",features:["Workspace integration","1M context","Grounding"],migrate:["Workspace integration: Claude MCP connectors for Google Drive, Gmail, Calendar","NotebookLM-style research: Claude Projects with uploaded docs","Grounding with search: Claude web search tool (Pro/Max)","Gemini API calls: swap model string, adjust token handling"]},
  {id:"copilot365",name:"Microsoft 365 Copilot",icon:"▣",features:["Word/Excel/PPT AI","Teams integration","Graph API"],migrate:["Word/Excel AI: Claude artifacts (.docx, .xlsx generation via skills)","Teams integration: Claude Slack MCP or Teams MCP connector","Email drafting: Claude Gmail/Outlook MCP","Graph API access: Claude MCP custom server or Zapier bridge"]},
];
const PHASES=[
  {n:1,title:"Assessment",dur:"Week 1",tasks:["Inventory current AI tools and spend","Map which teams use what, how often","Identify top 3 use cases per team","Document custom GPTs / agents / workflows to migrate","Calculate current monthly spend"]},
  {n:2,title:"Pilot",dur:"Weeks 2–3",tasks:["Set up Claude Pro/Team accounts for pilot group (5–10 users)","Migrate top custom GPT → Claude Project (1:1)","Run enablement Session 1 for pilot group","Collect feedback after 1 week of parallel use","Compare output quality on identical tasks"]},
  {n:3,title:"Migration",dur:"Weeks 4–6",tasks:["Roll out Claude accounts to full group","Migrate remaining custom GPTs / agents","Connect MCP connectors to replace plugins","Distribute prompt packages per role","Decommission old tool accounts (don't delete yet — archive)"]},
  {n:4,title:"Optimization",dur:"Weeks 7–8",tasks:["Run QC gate on all migrated employees","Build learning paths for anyone below 70% readiness","Set up analytics (PostHog or internal tracking)","Generate first program health report","Schedule monthly cadence for ongoing check-ins"]},
];
export default function MigrationPlanner(){
  const [source,setSource]=useState("chatgpt");const [tab,setTab]=useState("map");
  const [planResult,setPlanResult]=useState("");const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [teamSize,setTeamSize]=useState(15);const [currentSpend,setCurrentSpend]=useState(300);const [topUCs,setTopUCs]=useState("");
  const src=SOURCES.find(s=>s.id===source);
  const genPlan=async()=>{
    setLoading(true);setErr("");setPlanResult("");
    try{const r=await api([{role:"user",content:`Generate a detailed migration plan for moving ${teamSize} users from ${src.name} to Claude.\n\nCurrent monthly spend: $${currentSpend}\nTop use cases: ${topUCs||"general knowledge work"}\n\nInclude: week-by-week timeline, risk mitigation, rollback plan, success criteria, cost comparison (before vs after). Format in clear markdown sections. Under 800 words. Specific, not generic.`}],1500,"You are a B2B AI migration consultant. Write specific, actionable migration plans — not generic advice. Include risk mitigation and rollback procedures.");
      setPlanResult(r);
    }catch(e){setErr(e.message);}
    setLoading(false);
  };
  const TABS=[["map","Feature Map"],["phases","Migration Phases"],["custom","Custom Plan"]];
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Migration Planner</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ ChatGPT / Copilot / Gemini → Claude · structured transition plan</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"0 18px",gap:0}}>
      <div style={{display:"flex",gap:4,padding:"8px 0",marginRight:16}}>
        {SOURCES.map(s=><button key={s.id} onClick={()=>setSource(s.id)} style={{background:"transparent",border:`1px solid ${source===s.id?T.a:T.b}`,borderRadius:3,color:source===s.id?T.a:T.t2,...mn,fontSize:10,padding:"4px 10px",cursor:"pointer"}}>{s.icon} {s.name}</button>)}
      </div>
      <div style={{display:"flex",borderLeft:`1px solid ${T.b}`,paddingLeft:12}}>
        {TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===id?T.a:"transparent"}`,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,fontWeight:500,padding:"8px 10px",color:tab===id?T.t:T.t2,marginBottom:-1,transition:".12s"}}>{l}</button>)}
      </div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:860}}>
      {tab==="map"&&src&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:4}}>Migrating from {src.name} to Claude</div>
        <p style={{fontSize:11,color:T.t2,marginBottom:12}}>Feature-by-feature mapping and migration path for each capability.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{...mn,fontSize:9,color:T.r,marginBottom:6}}>{src.name} FEATURES</div>
            {src.features.map((f,i)=><div key={i} style={{display:"flex",gap:6,fontSize:12,color:T.t2,marginBottom:4}}><span style={{color:T.r}}>◇</span>{f}</div>)}
          </div>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{...mn,fontSize:9,color:T.g,marginBottom:6}}>CLAUDE EQUIVALENT</div>
            {["Projects + persistent memory","MCP connectors (50+ open standard)","Claude Code CLI + skills","Web search + citations","Artifacts (docs, code, data)","Extended thinking (Opus 4.7)"].map((f,i)=><div key={i} style={{display:"flex",gap:6,fontSize:12,color:T.t2,marginBottom:4}}><span style={{color:T.g}}>◆</span>{f}</div>)}
          </div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{...mn,fontSize:9,color:T.a,marginBottom:8}}>MIGRATION STEPS</div>
          {src.migrate.map((m,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:i<src.migrate.length-1?`1px solid ${T.tg}`:"none"}}>
            <span style={{...mn,fontSize:9,color:T.a,flexShrink:0,marginTop:2}}>{String(i+1).padStart(2,"0")}</span>
            <span style={{fontSize:12,color:T.t2,lineHeight:1.55}}>{m}</span>
          </div>)}
        </div>
      </div>}
      {tab==="phases"&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>4-Phase Migration Framework</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {PHASES.map(p=><div key={p.n} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{background:T.sf,borderBottom:`1px solid ${T.b}`,padding:"8px 12px"}}>
              <div style={{...mn,fontSize:9,color:T.a,marginBottom:2}}>PHASE {p.n}</div>
              <div style={{fontWeight:600,fontSize:13}}>{p.title}</div>
              <div style={{...mn,fontSize:9,color:T.t3,marginTop:1}}>{p.dur}</div>
            </div>
            <div style={{padding:"8px 12px"}}>{p.tasks.map((t,i)=><div key={i} style={{display:"flex",gap:6,padding:"4px 0",borderBottom:i<p.tasks.length-1?`1px solid ${T.tg}`:"none"}}>
              <span style={{color:T.g,flexShrink:0,fontSize:9,marginTop:2}}>◆</span>
              <span style={{fontSize:11,color:T.t2,lineHeight:1.5}}>{t}</span>
            </div>)}</div>
          </div>)}
        </div>
      </div>}
      {tab==="custom"&&<div style={{maxWidth:600}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Custom Migration Plan</div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Team Size</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><input type="range" min={1} max={100} value={teamSize} onChange={e=>setTeamSize(+e.target.value)} style={{flex:1,accentColor:T.a}} /><span style={{...mn,fontSize:14,color:T.a,minWidth:30}}>{teamSize}</span></div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Current Monthly AI Spend ($)</div>
          <input value={currentSpend} onChange={e=>setCurrentSpend(+e.target.value)} type="number" style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,outline:"none",...mn}} />
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:10}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Top Use Cases</div>
          <textarea value={topUCs} onChange={e=>setTopUCs(e.target.value)} placeholder="Email drafting, code review, meeting notes, research…" style={{width:"100%",background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"7px 9px",resize:"vertical",minHeight:52,outline:"none"}} />
        </div>
        <button onClick={genPlan} disabled={loading} style={{width:"100%",background:"transparent",border:`1px solid ${!loading?T.a:T.h}`,borderRadius:2,color:!loading?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"7px 0",cursor:loading?"not-allowed":"pointer",marginBottom:8}}>{loading?"◌ Generating custom plan…":"Generate Migration Plan →"}</button>
        {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:2,padding:"7px 10px",marginBottom:7}}><span style={{...mn,fontSize:9,color:T.r}}>✗ {err}</span></div>}
        {planResult&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}><button onClick={()=>navigator.clipboard.writeText(planResult).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Copy</button></div>
          {planResult.split("\n").map((line,i)=>{
            if(line.startsWith("## "))return<div key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:T.t,marginTop:12,marginBottom:5,paddingBottom:4,borderBottom:`1px solid ${T.b}`}}>{line.replace("## ","")}</div>;
            if(line.startsWith("### "))return<div key={i} style={{fontWeight:500,fontSize:12,color:T.a,marginTop:8,marginBottom:3}}>{line.replace("### ","")}</div>;
            if(line.trim().startsWith("- "))return<div key={i} style={{display:"flex",gap:6,fontSize:12,color:T.t2,marginBottom:2,paddingLeft:8}}><span style={{color:T.g}}>◆</span>{line.replace(/^-\s*/,"")}</div>;
            if(!line.trim())return<div key={i} style={{height:4}} />;
            return<div key={i} style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:2}}>{line}</div>;
          })}
        </div>}
      </div>}
    </div>
  </div></>;
}
