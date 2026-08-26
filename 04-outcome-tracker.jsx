/**
 * Claude Enablement Suite — 04: Session Outcome Tracker
 * Design: Reading Room at Midnight — Variant B
 * Storage: outcome-records-v1 | Reads: intake-records-v1
 */
import { useState, useEffect, useCallback } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",red:"#c05050",mono2:"#78afc8",tag:"#1e1e1a",mono:"#7ab878"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25);color:#ddd8ce}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;

const Eyebrow=({children,color,style={}})=><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;
const Mono=({children,size=11,color,style={}})=><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:size,color:color||T.text2,...style}}>{children}</span>;
const Tag=({children,color})=><span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:color||T.text2,padding:"2px 7px",display:"inline-block"}}>{children}</span>;
const Card=({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"18px 22px",...style}}>{children}</div>;
const Btn=({children,onClick,disabled,accent,style={}})=><button onClick={onClick} disabled={disabled} style={{background:"transparent",borderRadius:2,cursor:disabled?"not-allowed":"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",transition:"border-color 0.15s,color 0.15s",border:`1px solid ${accent&&!disabled?T.accent:T.borderHi}`,color:disabled?T.text3:accent?T.accent:T.text2,...style}}>{children}</button>;
const Heading=({children,size=22})=><div style={{fontFamily:"'Playfair Display',serif",fontSize:size,fontWeight:700,color:T.text}}>{children}</div>;
const inp={width:"100%",padding:"7px 10px",borderRadius:2,border:`1px solid ${T.borderHi}`,fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif",outline:"none",background:T.bg,color:T.text,marginBottom:10};
const lbl={fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,letterSpacing:"0.12em",textTransform:"uppercase",color:T.text3,marginBottom:4};

const STATUSES=["Completed","In Progress","Scheduled","Needs Follow-up","No Show"];
const SC={"Completed":"#5a9c5a","In Progress":"#78afc8","Scheduled":"#78afc8","Needs Follow-up":"#d4893a","No Show":"#c05050"};
const PC={free:"#3a3835",pro:"#78afc8",max:"#d4893a",team:"#7ab878",enterprise:"#807c74",unknown:"#3a3835"};
const QC=[{id:"q1",l:"Can log in independently",c:true},{id:"q2",l:"1+ Project with instructions",c:true},{id:"q3",l:"Memory configured",c:true},{id:"q4",l:"Prompt package delivered",c:true},{id:"q5",l:"1+ connector connected",c:false},{id:"q6",l:"Identified #1 weekly use case",c:false},{id:"q7",l:"Next session date agreed",c:false}];
const EMPTY={employeeName:"",role:"",plan:"pro",sessionDate:new Date().toISOString().split("T")[0],sessionNumber:1,status:"Completed",qc:{},openGaps:"",nextSessionDate:"",nextSessionFocus:"",notes:""};

export default function OutcomeTracker(){
  const[outcomes,setOutcomes]=useState([]);const[intakes,setIntakes]=useState([]);const[view,setView]=useState("dashboard");const[form,setForm]=useState(EMPTY);const[filter,setFilter]=useState("all");
  useEffect(()=>{(async()=>{try{const[or,ir]=await Promise.allSettled([window.storage.get("outcome-records-v1"),window.storage.get("intake-records-v1")]);if(or.status==="fulfilled"&&or.value)setOutcomes(JSON.parse(or.value.value));if(ir.status==="fulfilled"&&ir.value)setIntakes(JSON.parse(ir.value.value))}catch(e){}})()},[]);
  const save=useCallback(async recs=>{try{await window.storage.set("outcome-records-v1",JSON.stringify(recs))}catch(e){}},[]);
  const setQC=(id,v)=>setForm(p=>({...p,qc:{...p.qc,[id]:v===p.qc[id]?null:v}}));
  const submit=async()=>{if(!form.employeeName)return;const rec={...form,id:Date.now(),createdAt:new Date().toISOString()};const next=[rec,...outcomes];setOutcomes(next);await save(next);setView("dashboard");setForm(EMPTY)};
  const wrap=(hdr,body)=>(<><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13.5,lineHeight:1.65,color:T.text}}><header style={{padding:"24px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>{hdr}</header><main style={{padding:"24px 40px",maxWidth:920}}>{body}</main></div></>);

  if(view==="log") return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Log Outcome</Eyebrow><Heading>Session Record</Heading></div><Btn onClick={()=>setView("dashboard")}>← Back</Btn></>,
    <>
      {intakes.length>0&&<Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:8}}>Load from Intake</Eyebrow><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{intakes.slice(0,8).map(r=><Btn key={r.id} onClick={()=>setForm(p=>({...p,employeeName:r.name,role:r.role,plan:r.plan||"pro"}))} style={{padding:"4px 10px"}}>{r.name}</Btn>)}</div></Card>}
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:12}}>Session Info</Eyebrow>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 12px"}}>
          <div><div style={lbl}>Employee *</div><input value={form.employeeName} onChange={e=>setForm(p=>({...p,employeeName:e.target.value}))} style={inp}/></div>
          <div><div style={lbl}>Role</div><input value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={inp}/></div>
          <div><div style={lbl}>Date</div><input value={form.sessionDate} onChange={e=>setForm(p=>({...p,sessionDate:e.target.value}))} type="date" style={inp}/></div>
          <div><div style={lbl}>Plan</div><select value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))} style={{...inp,cursor:"pointer"}}>{["free","pro","max","team","enterprise","unknown"].map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div><div style={lbl}>Session #</div><input value={form.sessionNumber} onChange={e=>setForm(p=>({...p,sessionNumber:+e.target.value}))} type="number" min="1" style={inp}/></div>
          <div><div style={lbl}>Status</div><select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{...inp,cursor:"pointer"}}>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        </div>
      </Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:10}}>QC Gate</Eyebrow>
        {QC.map(q=>{const v=form.qc[q.id];return (<div key={q.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,padding:"5px 8px",borderRadius:2,background:v==="pass"||v==="fail"?T.tag:"transparent"}}>
          <Mono size={10} color={q.c?T.accent:T.text3}>{q.c?"★":"◇"}</Mono>
          <span style={{flex:1,fontSize:12,color:T.text2}}>{q.l}</span>
          <div style={{display:"flex",gap:3}}>{["pass","fail","skip","n/a"].map(x=><button key={x} onClick={()=>setQC(q.id,x)} style={{padding:"3px 7px",borderRadius:2,border:"none",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,background:v===x?(x==="pass"?"#5a9c5a":x==="fail"?"#c05050":"#3a3835"):"#232320",color:v===x?"#0c0c0b":"#3a3835",transition:"all 0.15s"}}>{x}</button>)}</div>
        </div>)})}
      </Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:10}}>Follow-up</Eyebrow>
        <div><div style={lbl}>Open Gaps</div><textarea value={form.openGaps} onChange={e=>setForm(p=>({...p,openGaps:e.target.value}))} style={{...inp,height:55,resize:"vertical"}}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}><div><div style={lbl}>Next Date</div><input value={form.nextSessionDate} onChange={e=>setForm(p=>({...p,nextSessionDate:e.target.value}))} type="date" style={inp}/></div><div><div style={lbl}>Next Focus</div><input value={form.nextSessionFocus} onChange={e=>setForm(p=>({...p,nextSessionFocus:e.target.value}))} style={inp}/></div></div>
        <div><div style={lbl}>Notes</div><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...inp,height:55,resize:"vertical"}}/></div>
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={submit} disabled={!form.employeeName} accent={!!form.employeeName} style={{padding:"8px 22px",fontSize:11}}>Save Outcome</Btn></div>
    </>
  );

  const total=outcomes.length;const completed=outcomes.filter(o=>o.status==="Completed").length;const filtered=filter==="all"?outcomes:outcomes.filter(o=>o.status===filter);
  return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Session Outcomes</Eyebrow><Heading>Cohort Dashboard</Heading></div><Btn onClick={()=>setView("log")} accent>+ Log Session</Btn></>,
    <>
      {total>0&&<div style={{display:"flex",gap:8,marginBottom:16}}>{[{l:"Sessions",v:total},{l:"Complete",v:completed,c:T.green},{l:"Follow-up",v:outcomes.filter(o=>o.status==="Needs Follow-up").length,c:T.accent},{l:"QC Passed",v:outcomes.filter(o=>["q1","q2","q3","q4"].every(id=>o.qc?.[id]==="pass")).length,c:T.mono2}].map(s=><Card key={s.l} style={{flex:1,padding:"12px 14px",textAlign:"center"}}><Mono size={22} color={s.c||T.text}>{s.v}</Mono><div style={{marginTop:3}}><Eyebrow color={T.text3} style={{fontSize:9}}>{s.l}</Eyebrow></div></Card>)}</div>}
      <div style={{display:"flex",gap:5,marginBottom:12}}>{["all",...STATUSES].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"3px 10px",borderRadius:2,border:`1px solid ${filter===f?(SC[f]||T.accent):T.border}`,background:filter===f?T.tag:"transparent",color:filter===f?(SC[f]||T.accent):T.text3,fontSize:11,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",transition:"all 0.15s"}}>{f==="all"?"All":f}</button>)}</div>
      {!filtered.length?<Card style={{textAlign:"center",padding:40}}><Mono color={T.text3}>No sessions logged.</Mono></Card>:<Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["employee","role","plan","#","qc ★","status","next"].map(h=><th key={h} style={{padding:"8px 14px",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",textAlign:"left",borderBottom:`1px solid ${T.border}`,fontWeight:500}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map((o,i)=>{const qc=["q1","q2","q3","q4"].filter(id=>o.qc?.[id]==="pass").length;return (<tr key={o.id} style={{borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none"}}><td style={{padding:"9px 14px"}}><div style={{fontWeight:500,fontSize:12}}>{o.employeeName}</div><Mono size={9} color={T.text3}>{new Date(o.sessionDate).toLocaleDateString()}</Mono></td><td style={{padding:"9px 14px",color:T.text2,fontSize:12}}>{o.role}</td><td style={{padding:"9px 14px"}}><Tag color={PC[o.plan]}>{o.plan?.toUpperCase()}</Tag></td><td style={{padding:"9px 14px"}}><Mono size={11} color={T.text3}>#{o.sessionNumber}</Mono></td><td style={{padding:"9px 14px"}}><Mono size={11} color={qc===4?T.green:T.accent}>{qc}/4</Mono></td><td style={{padding:"9px 14px"}}><Tag color={SC[o.status]}>{o.status}</Tag></td><td style={{padding:"9px 14px"}}>{o.nextSessionDate?<Mono size={10} color={T.text3}>{new Date(o.nextSessionDate).toLocaleDateString()}</Mono>:<Mono size={10} color={T.text3}>—</Mono>}</td></tr>)})}</tbody></table>
      </Card>}
    </>
  );
}
