import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const LIT={none:"◌ None",casual:"◆ Casual",regular:"◆◆ Regular",power:"◆◆◆ Power",advanced:"◆◆◆◆ Advanced"};
const SC={Completed:T.g,"In Progress":T.m,Scheduled:T.m,"Needs Follow-up":T.a,"No Show":T.r};
const AGENDA=["Confirm login + plan","Review last session gaps","Walk through prompt package","Live practice — top use case","Configure memory or connector","QC gate walkthrough","Set next session goal"];
const QCI=[["q1","Logs in independently",true],["q2","1+ Project with instructions",true],["q3","Memory configured",true],["q4","Prompt package delivered",true],["q5","Connector connected",false],["q6","#1 use case identified",false],["q7","Next session agreed",false]];
function Tag({children,color}){return <span style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:9,padding:"1px 5px",color:color||T.t2}}>{children}</span>;}
export default function SessionPrep(){
  const [intakes,setIntakes]=useState([]);const [outcomes,setOutcomes]=useState([]);const [packages,setPackages]=useState({});const [checkins,setCheckins]=useState([]);
  const [sel,setSel]=useState("");const [ready,setReady]=useState(false);const [checks,setChecks]=useState({});
  useEffect(()=>{
    Promise.all([ld("intake-records-v1"),ld("outcome-records-v1"),ld("prompt-packages-v1"),ld("checkin-records-v1")]).then(([i,o,p,c])=>{
      const ins=i||[];setIntakes(ins);setOutcomes(o||[]);setPackages(p||{});setCheckins(c||[]);
      if(ins.length)setSel(f(ins[0],"n","name")||"");setReady(true);
    });
  },[]);
  const emp=intakes.find(i=>f(i,"n","name")===sel);
  const oc=[...(outcomes||[])].filter(o=>f(o,"n","name","employeeName")===sel).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const lastOc=oc[0];const pkg=packages[sel];
  const ci=[...(checkins||[])].filter(c=>f(c,"nm","name")===sel).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const lastCi=ci[0];
  const prevQC=lastOc?.qc||{};const passedBefore=Object.values(prevQC).filter(Boolean).length;
  const togCheck=k=>setChecks(p=>({...p,[k]:!p[k]}));
  const sessNum=(oc.length+1);
  if(!ready)return <div style={{minHeight:"100vh",background:T.bg,color:T.t2,fontFamily:"'IBM Plex Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",...mn,fontSize:10}}>Loading session data…</div>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Session Prep</div><div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Facilitator Pre-Session View · Session {sessNum}</div></div>
      {intakes.length>0&&<select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"5px 8px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,outline:"none",...mn}}>
        {intakes.map(i=><option key={f(i,"id")||f(i,"n","name")} value={f(i,"n","name")}>{f(i,"n","name")} — {f(i,"r","role")}</option>)}
      </select>}
    </div>
    {!intakes.length?<div style={{padding:"20px 18px",color:T.t2,fontSize:12}}>No intakes found. Add employees in the Facilitator Suite first.</div>:!emp?<div style={{padding:"20px 18px",color:T.t2,fontSize:12}}>Employee not found.</div>:<div style={{padding:"14px 18px",maxWidth:820}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Employee Brief</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            <Tag color={T.m}>{(f(emp,"pl","plan")||"?").toUpperCase()}</Tag>
            <Tag color={T.a}>{LIT[f(emp,"li","literacy")]||f(emp,"li","literacy")||"?"}</Tag>
            <Tag>Session {sessNum}</Tag>
            {lastOc&&<Tag color={SC[lastOc.st||lastOc.status]}>{lastOc.st||lastOc.status}</Tag>}
          </div>
          <div style={{fontSize:11,color:T.t2,marginBottom:6}}><span style={{color:T.t3,...mn,fontSize:9}}>ROLE</span><br/>{f(emp,"r","role")||"—"}</div>
          <div style={{fontSize:11,color:T.t2,marginBottom:6}}><span style={{color:T.t3,...mn,fontSize:9}}>TIME DRAINS</span><br/>{(emp?.pa||emp?.pains||[]).join(", ")||"Not specified"}</div>
          <div style={{fontSize:11,color:T.t2}}><span style={{color:T.t3,...mn,fontSize:9}}>INTAKE DATE</span><br/>{f(emp,"dt","date")||f(emp,"createdAt","?")||"—"}</div>
          {lastOc&&<><div style={{borderTop:`1px solid ${T.b}`,marginTop:8,paddingTop:8}}><div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>LAST SESSION GAPS</div><div style={{fontSize:11,color:T.a}}>{f(lastOc,"ga","gaps","openGaps")||"None logged"}</div></div></>}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>QC Status</div>
          <div style={{background:T.sf,borderRadius:2,padding:"6px 10px",marginBottom:8,display:"flex",justifyContent:"space-between"}}>
            <span style={{...mn,fontSize:9,color:T.t3}}>Previous session</span>
            <span style={{...mn,fontSize:10,color:passedBefore>=4?T.g:passedBefore>=2?T.a:T.r}}>{lastOc?`${passedBefore}/7 passed`:"No prior session"}</span>
          </div>
          {QCI.map(([id,label,crit])=>{const prev=prevQC[id];const cur=checks[id];return<div key={id} onClick={()=>togCheck(id)} style={{display:"flex",gap:8,alignItems:"center",padding:"5px 7px",borderRadius:2,cursor:"pointer",background:cur?"rgba(90,156,90,.05)":"transparent",marginBottom:2}}>
            <div style={{width:12,height:12,flexShrink:0,border:`1px solid ${cur?T.g:prev?"rgba(90,156,90,.3)":T.h}`,borderRadius:2,background:cur?"#1a2a1a":prev?"rgba(90,156,90,.08)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",...mn,fontSize:8,color:T.g}}>{cur?"◆":prev?"·":""}</div>
            <span style={{fontSize:11,color:cur?T.t2:T.t,textDecoration:cur?"line-through":"none"}}>{label}{crit&&<span style={{...mn,fontSize:8,color:T.r}}> ★</span>}</span>
          </div>);})}
          <div style={{...mn,fontSize:9,color:T.t3,marginTop:6}}>★ critical · {Object.values(checks).filter(Boolean).length}/7 today</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Session Agenda</div>
          {AGENDA.map((item,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"5px 0",borderBottom:i<AGENDA.length-1?`1px solid ${T.tg}`:"none"}}>
            <span style={{...mn,fontSize:9,color:T.t3,flexShrink:0,marginTop:1}}>{String(i+1).padStart(2,"0")}</span>
            <span style={{fontSize:11,color:T.t2}}>{item}</span>
          </div>)}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600}}>Prompt Package</div>
            <Tag color={pkg?T.g:T.r}>{pkg?"Ready":"Not built"}</Tag>
          </div>
          {pkg?pkg.prompts?.slice(0,4).map((p,i)=><div key={i} style={{padding:"4px 0",borderBottom:i<3?`1px solid ${T.tg}`:"none"}}><div style={{fontSize:11,fontWeight:500,color:T.t}}>{p.name}</div><div style={{...mn,fontSize:9,color:T.t3}}>{p.category}</div></div>):<div style={{fontSize:11,color:T.t2}}>Build in Facilitator Suite → Prompts tab before this session.</div>}
        </div>
      </div>
      {lastCi&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:7}}>Last Check-in — {lastCi.weekOf}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[["Frequency",f(lastCi,"fr","frequency")||"—",T.m],["Confidence",f(lastCi,"conf","confidence")||"—",T.a],["Win",f(lastCi,"win","biggestWin")||"—",T.g]].map(([l,v,c])=><div key={l} style={{background:T.sf,borderRadius:2,padding:"7px 9px"}}><div style={{...mn,fontSize:9,color:T.t3,marginBottom:2}}>{l}</div><div style={{fontSize:12,color:c}}>{v}</div></div>)}
        </div>
        {f(lastCi,"stuck","stuckOn")&&<div style={{marginTop:7,fontSize:11,color:T.a}}><span style={{...mn,fontSize:9,color:T.t3}}>STILL STUCK ON: </span>{f(lastCi,"stuck","stuckOn")}</div>}
      </div>}
      <div style={{background:T.c,border:`1px solid rgba(212,137,58,.25)`,borderRadius:3,padding:"8px 12px"}}><span style={{...mn,fontSize:9,color:T.a}}>◆ Start here: confirm plan, open ${pkg?"prompt package":"Prompts tab to build package"}, check ${Object.values(checks).filter(Boolean).length}/7 QC items.</span></div>
    </div>}
  </div></>;
}
