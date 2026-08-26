/**
 * Claude Enablement Suite — 01: Pre-Session Intake Form
 * Design: Reading Room at Midnight — Variant B
 * Storage: intake-records-v1
 */
import { useState, useEffect, useCallback } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",red:"#c05050",mono2:"#78afc8",tag:"#1e1e1a"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25);color:#ddd8ce}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;

const Eyebrow=({children,color,style={}})=><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;
const Mono=({children,size=11,color,style={}})=><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:size,color:color||T.text2,...style}}>{children}</span>;
const Tag=({children,color})=><span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:color||T.text2,padding:"2px 7px",letterSpacing:"0.04em",display:"inline-block"}}>{children}</span>;
const Card=({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"18px 22px",...style}}>{children}</div>;
const Btn=({children,onClick,disabled,accent,style={}})=><button onClick={onClick} disabled={disabled} style={{background:"transparent",borderRadius:2,cursor:disabled?"not-allowed":"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",transition:"border-color 0.15s,color 0.15s",border:`1px solid ${accent&&!disabled?T.accent:T.borderHi}`,color:disabled?T.text3:accent?T.accent:T.text2,...style}}>{children}</button>;
const Heading=({children,size=22})=><div style={{fontFamily:"'Playfair Display',serif",fontSize:size,fontWeight:700,color:T.text}}>{children}</div>;

const TOOLS=["Microsoft 365","Google Workspace","Slack","Microsoft Teams","Notion","Jira / Confluence","GitHub / GitLab","Salesforce / HubSpot","Asana / Linear / Monday","Zapier / Make / n8n","Figma / Canva","Power BI / Tableau","VS Code / IDE","Terminal / CLI","Python / JavaScript"];
const LITERACY=[{v:"none",l:"None",d:"Never used an AI tool"},{v:"casual",l:"Casual",d:"Used ChatGPT or similar a few times"},{v:"regular",l:"Regular",d:"Uses AI tools weekly"},{v:"power",l:"Power",d:"Builds prompts, uses Projects/memory"},{v:"advanced",l:"Advanced",d:"API, Claude Code, agents, MCP"}];
const GOALS=["Save time on repetitive writing","Improve document quality","Speed up research","Automate manual processes","Learn prompting","Use AI for coding/technical","Integrate into existing workflows","Understand AI capabilities","Train/enable team members","Build internal tools"];
const PAINS=["Email and comms drafting","Meeting prep and follow-up","Report/document writing","Data analysis","Research and competitive intel","Code writing or debugging","Process documentation","Customer/stakeholder comms","Learning new tools","Managing and organizing info"];
const EMPTY={name:"",role:"",department:"",manager:"",email:"",plan:"pro",firstSession:true,literacy:"",tools:[],goals:[],painPoints:[],notes:"",sessionDate:new Date().toISOString().split("T")[0]};

const inp={width:"100%",padding:"7px 10px",borderRadius:2,border:`1px solid ${T.borderHi}`,fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif",outline:"none",background:T.bg,color:T.text,marginBottom:10};
const lbl={fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,letterSpacing:"0.12em",textTransform:"uppercase",color:T.text3,marginBottom:4};

function Check({on,toggle,label}){return (
  <label onClick={toggle} style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer",marginBottom:5,fontSize:12,color:on?T.text:T.text2}}>
    <div style={{width:14,height:14,borderRadius:2,flexShrink:0,marginTop:2,background:on?T.accent:"transparent",border:`1px solid ${on?T.accent:T.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{on&&<span style={{color:T.bg,fontSize:9}}>✓</span>}</div>
    <span>{label}</span>
  </label>
)}

export default function IntakeForm(){
  const[form,setForm]=useState(EMPTY);
  const[records,setRecords]=useState([]);
  const[view,setView]=useState("form");
  const[selRec,setSelRec]=useState(null);
  const[init,setInit]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("intake-records-v1");if(r)setRecords(JSON.parse(r.value))}catch(e){}finally{setInit(true)}})()},[]);
  const save=useCallback(async recs=>{try{await window.storage.set("intake-records-v1",JSON.stringify(recs))}catch(e){}},[]);
  const set=(f,v)=>setForm(p=>({...p,[f]:v}));
  const tog=(f,v)=>setForm(p=>{const a=p[f];return{...p,[f]:a.includes(v)?a.filter(x=>x!==v):[...a,v]}});
  const ok=()=>form.name.trim()&&form.role.trim()&&form.literacy;
  const submit=async()=>{if(!ok())return;const rec={...form,id:Date.now(),createdAt:new Date().toISOString()};const next=[rec,...records];setRecords(next);await save(next);setSelRec(rec);setView("brief")};
  const reset=()=>{setForm({...EMPTY,sessionDate:new Date().toISOString().split("T")[0]});setView("form")};

  const wrap=(header,body)=>(<><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13.5,lineHeight:1.65,color:T.text}}><header style={{padding:"24px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>{header}</header><main style={{padding:"24px 40px",maxWidth:760}}>{body}</main></div></>);

  // ── BRIEF ──
  if(view==="brief"&&selRec){
    const lit=LITERACY.find(l=>l.v===selRec.literacy);
    const track=selRec.literacy==="advanced"||selRec.tools.some(t=>t.includes("VS Code")||t.includes("Python")||t.includes("GitHub"))?"Developer":"Standard";
    const copy=()=>{navigator.clipboard.writeText([`# Session Brief — ${selRec.name}`,`${selRec.role} | ${selRec.plan?.toUpperCase()} | ${lit?.l} | ${track} Track`,`Date: ${selRec.sessionDate}`,"","## Tools",selRec.tools.join(", "),"","## Goals",selRec.goals.map(g=>`- ${g}`).join("\n"),"","## Pain Points",selRec.painPoints.map(p=>`- ${p}`).join("\n"),"","## Notes",selRec.notes||"None"].join("\n")).catch(()=>{})};
    return wrap(
      <><div><Eyebrow style={{marginBottom:6}}>Session Brief</Eyebrow><Heading>{selRec.name}</Heading></div><div style={{display:"flex",gap:8}}><Btn onClick={copy}>Copy</Btn><Btn onClick={()=>setView("list")}>Records</Btn><Btn onClick={reset} accent>+ New</Btn></div></>,
      <>
        <div style={{display:"flex",gap:8,marginBottom:12}}>{[{l:"Plan",v:selRec.plan?.toUpperCase()},{l:"Literacy",v:lit?.l},{l:"Track",v:track,c:track==="Developer"?T.mono2:T.accent},{l:"Session",v:selRec.firstSession?"First":"Follow-up"}].map(s=><Card key={s.l} style={{flex:1,padding:"10px 14px"}}><Eyebrow color={T.text3} style={{marginBottom:4,fontSize:9}}>{s.l}</Eyebrow><Mono size={14} color={s.c||T.text}>{s.v}</Mono></Card>)}</div>
        <Card style={{marginBottom:10,padding:14}}><Eyebrow color={T.text3} style={{marginBottom:6}}>Literacy</Eyebrow><div style={{color:T.text2,fontSize:12}}>{lit?.d}</div></Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <Card style={{padding:14}}><Eyebrow style={{marginBottom:8}}>Goals</Eyebrow>{selRec.goals.length?selRec.goals.map((g,i)=><div key={i} style={{fontSize:12,color:T.text2,marginBottom:4,paddingLeft:10,borderLeft:`2px solid ${T.accent}`}}>{g}</div>):<Mono color={T.text3}>None</Mono>}</Card>
          <Card style={{padding:14}}><Eyebrow style={{marginBottom:8}}>Pain Points</Eyebrow>{selRec.painPoints.length?selRec.painPoints.map((p,i)=><div key={i} style={{fontSize:12,color:T.text2,marginBottom:4,paddingLeft:10,borderLeft:`2px solid ${T.mono2}`}}>{p}</div>):<Mono color={T.text3}>None</Mono>}</Card>
        </div>
        {selRec.tools.length>0&&<Card style={{padding:14,marginBottom:10}}><Eyebrow style={{marginBottom:8}}>Tool Stack</Eyebrow><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{selRec.tools.map((t,i)=><Tag key={i}>{t}</Tag>)}</div></Card>}
        {selRec.notes&&<Card style={{borderLeft:`2px solid ${T.accent}`,padding:14}}><Eyebrow style={{marginBottom:6}}>Notes</Eyebrow><div style={{fontSize:12,color:T.text2}}>{selRec.notes}</div></Card>}
      </>
    );
  }

  // ── LIST ──
  if(view==="list") return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Intake Records</Eyebrow><Heading>{records.length} Employee{records.length!==1?"s":""}</Heading></div><Btn onClick={reset} accent>+ New</Btn></>,
    !records.length?<Mono color={T.text3}>No intakes yet.</Mono>:records.map(r=>(
      <Card key={r.id} onClick={()=>{setSelRec(r);setView("brief")}} style={{marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:14,padding:"11px 18px"}}>
        <Mono size={16} color={T.accent} style={{width:24,textAlign:"center"}}>{r.name.charAt(0).toUpperCase()}</Mono>
        <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13}}>{r.name}</div><Mono size={10} color={T.text3}>{r.role} · {r.plan?.toUpperCase()} · {r.literacy}</Mono></div>
        <Mono size={10} color={T.text3}>{new Date(r.createdAt).toLocaleDateString()}</Mono>
      </Card>
    ))
  );

  // ── FORM ──
  return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Pre-Session Intake</Eyebrow><Heading>Employee Profile</Heading></div>{records.length>0&&<Btn onClick={()=>setView("list")}>Records ({records.length})</Btn>}</>,
    <>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:12}}>Identity</Eyebrow>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
          <div><div style={lbl}>Full Name <span style={{color:T.red}}>*</span></div><input value={form.name} onChange={e=>set("name",e.target.value)} style={inp} placeholder="Jane Smith"/></div>
          <div><div style={lbl}>Role <span style={{color:T.red}}>*</span></div><input value={form.role} onChange={e=>set("role",e.target.value)} style={inp} placeholder="Service Desk Manager"/></div>
          <div><div style={lbl}>Department</div><input value={form.department} onChange={e=>set("department",e.target.value)} style={inp} placeholder="IT Operations"/></div>
          <div><div style={lbl}>Manager</div><input value={form.manager} onChange={e=>set("manager",e.target.value)} style={inp}/></div>
          <div><div style={lbl}>Email</div><input value={form.email} onChange={e=>set("email",e.target.value)} style={inp} type="email"/></div>
          <div><div style={lbl}>Session Date</div><input value={form.sessionDate} onChange={e=>set("sessionDate",e.target.value)} style={inp} type="date"/></div>
          <div><div style={lbl}>Plan</div><select value={form.plan} onChange={e=>set("plan",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="free">Free</option><option value="pro">Pro</option><option value="max">Max</option><option value="team">Team</option><option value="enterprise">Enterprise</option><option value="unknown">Unknown</option></select></div>
          <div><div style={lbl}>Session Type</div><select value={form.firstSession?"first":"followup"} onChange={e=>set("firstSession",e.target.value==="first")} style={{...inp,cursor:"pointer"}}><option value="first">First session</option><option value="followup">Follow-up</option></select></div>
        </div>
      </Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:12}}>AI Literacy <span style={{color:T.red}}>*</span></Eyebrow>
        {LITERACY.map(l=><div key={l.v} onClick={()=>set("literacy",l.v)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:2,background:form.literacy===l.v?T.tag:"transparent",border:`1px solid ${form.literacy===l.v?T.accent:T.border}`,marginBottom:4,transition:"all 0.15s"}}>
          <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${form.literacy===l.v?T.accent:T.text3}`,background:form.literacy===l.v?T.accent:"transparent"}}/>
          <Mono size={12} color={form.literacy===l.v?T.accent:T.text2}>{l.l}</Mono><span style={{fontSize:11,color:T.text3}}>{l.d}</span>
        </div>)}
      </Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:4}}>Tool Stack</Eyebrow><div style={{color:T.text3,fontSize:11,marginBottom:10}}>Daily tools — check all that apply</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>{TOOLS.map(t=><Check key={t} on={form.tools.includes(t)} toggle={()=>tog("tools",t)} label={t}/>)}</div></Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:4}}>Session Goals</Eyebrow><div style={{color:T.text3,fontSize:11,marginBottom:10}}>What does this employee want from AI?</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>{GOALS.map(g=><Check key={g} on={form.goals.includes(g)} toggle={()=>tog("goals",g)} label={g}/>)}</div></Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:4}}>Time Drains</Eyebrow><div style={{color:T.text3,fontSize:11,marginBottom:10}}>Highest-impact use cases</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>{PAINS.map(p=><Check key={p} on={form.painPoints.includes(p)} toggle={()=>tog("painPoints",p)} label={p}/>)}</div></Card>
      <Card style={{marginBottom:14}}><Eyebrow style={{marginBottom:8}}>Facilitator Notes</Eyebrow><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} style={{...inp,height:70,resize:"vertical",marginBottom:0}} placeholder="Prior context, specific asks, constraints"/></Card>
      <div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={submit} disabled={!ok()||!init} accent={ok()&&init} style={{padding:"8px 22px",fontSize:11}}>Generate Brief →</Btn></div>
    </>
  );
}
