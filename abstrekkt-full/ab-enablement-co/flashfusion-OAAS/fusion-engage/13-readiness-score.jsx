import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const PLAN_SCORE={free:1,pro:3,max:4,team:4,enterprise:5};
const LIT_SCORE={none:1,casual:2,regular:3,power:4,advanced:5};
const FREQ_SCORE={not_yet:0,once_few:1,once_week:2,few_week:4,daily:5};
function Ring({pct,color,size=64,stroke=5,label}){
  const r=(size-stroke)/2;const c=2*Math.PI*r;const off=c-(pct/100)*c;
  return<div style={{position:"relative",width:size,height:size}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.tg} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset .6s"}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{...mn,fontSize:14,fontWeight:500,color}}>{Math.round(pct)}</div>{label&&<div style={{...mn,fontSize:7,color:T.t3}}>{label}</div>}</div>
  </div>;
}
export default function ReadinessScore(){
  const [ins,setIns]=useState([]);const [outs,setOuts]=useState([]);const [ci,setCi]=useState([]);const [rdy,setRdy]=useState(false);
  useEffect(()=>{Promise.all([ld("intake-records-v1"),ld("outcome-records-v1"),ld("checkin-records-v1")]).then(([a,b,c])=>{setIns(a||[]);setOuts(b||[]);setCi(c||[]);setRdy(true);});},[]);
  const score=(emp)=>{
    const name=f(emp,"n","name");
    const plan=PLAN_SCORE[f(emp,"pl","plan")]||1;
    const lit=LIT_SCORE[f(emp,"li","literacy")]||1;
    const empOuts=outs.filter(o=>f(o,"n","name","employeeName")===name);
    const lastOc=empOuts.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0];
    const qcPassed=lastOc?Object.values(lastOc.qc||{}).filter(Boolean).length:0;
    const sessionCount=empOuts.length;
    const empCi=ci.filter(c=>f(c,"nm","name")===name).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    const lastCi=empCi[0];
    const conf=lastCi?(+f(lastCi,"conf","confidence")||0):0;
    const freq=FREQ_SCORE[f(lastCi||{},"fr","frequency")]||0;
    const hasPackage=!!f(emp,"hasPackage");
    const planS=plan/5*15;const litS=lit/5*10;const qcS=qcPassed/7*25;const sessS=Math.min(sessionCount,3)/3*15;const confS=conf/5*15;const freqS=freq/5*15;const ciS=empCi.length>0?5:0;
    const total=Math.round(planS+litS+qcS+sessS+confS+freqS+ciS);
    const risks=[];
    if(plan<=1)risks.push("Free plan — limited features");
    if(qcPassed<4&&sessionCount>0)risks.push("QC gate: "+qcPassed+"/7 critical items incomplete");
    if(freq<=1&&empCi.length>0)risks.push("Low usage frequency: "+(f(lastCi,"fr","frequency")||"not yet"));
    if(conf<=2&&empCi.length>0)risks.push("Low confidence: "+conf+"/5");
    if(sessionCount===0)risks.push("No sessions completed yet");
    if(empCi.length===0)risks.push("No check-ins submitted");
    const status=total>=70?"On Track":total>=40?"Needs Attention":"At Risk";
    const statusColor=total>=70?T.g:total>=40?T.a:T.r;
    return{name,role:f(emp,"r","role"),plan:f(emp,"pl","plan"),total,planS:Math.round(planS),litS:Math.round(litS),qcS:Math.round(qcS),sessS:Math.round(sessS),confS:Math.round(confS),freqS:Math.round(freqS),ciS:Math.round(ciS),risks,status,statusColor,sessionCount,qcPassed,conf,freq:f(lastCi||{},"fr","frequency")||"—"};
  };
  const scores=ins.map(score).sort((a,b)=>a.total-b.total);
  const avg=scores.length?Math.round(scores.reduce((a,s)=>a+s.total,0)/scores.length):0;
  const atRisk=scores.filter(s=>s.total<40).length;
  const onTrack=scores.filter(s=>s.total>=70).length;
  if(!rdy)return<div style={{minHeight:"100vh",background:T.bg,color:T.t2,...mn,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>Loading…</div>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Employee Readiness Scores</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Composite score from intake + outcomes + check-ins · {scores.length} employees</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:880}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
        {[["Avg Score",avg,avg>=70?T.g:avg>=40?T.a:T.r],["On Track",onTrack,T.g],["Needs Attention",scores.filter(s=>s.total>=40&&s.total<70).length,T.a],["At Risk",atRisk,atRisk?T.r:T.t3]].map(([l,v,c])=><div key={l} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:500,color:c}}>{v}</div><div style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t3,marginTop:3}}>{l}</div></div>)}
      </div>
      {!scores.length?<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:20,textAlign:"center",color:T.t2}}>No employees enrolled yet.</div>:
      scores.map(s=><div key={s.name} style={{background:T.c,border:`1px solid ${s.total<40?"rgba(192,80,80,.3)":T.b}`,borderRadius:3,padding:"12px 14px",marginBottom:7}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Ring pct={s.total} color={s.statusColor} size={52} stroke={4} label="/100" />
            <div>
              <div style={{fontWeight:500,fontSize:13}}>{s.name}</div>
              <div style={{...mn,fontSize:9,color:T.t3,marginTop:1}}>{s.role} · {(s.plan||"?").toUpperCase()} · {s.sessionCount} session{s.sessionCount!==1?"s":""}</div>
            </div>
          </div>
          <div style={{background:s.total>=70?T.gnS:s.total>=40?"rgba(212,137,58,.12)":"rgba(192,80,80,.12)",border:`1px solid ${s.statusColor}`,borderRadius:3,...mn,fontSize:9,padding:"3px 8px",color:s.statusColor}}>{s.status}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:8}}>
          {[["Plan",s.planS,15,T.m],["Literacy",s.litS,10,T.m],["QC Gate",s.qcS,25,T.a],["Sessions",s.sessS,15,T.a],["Confidence",s.confS,15,T.g],["Frequency",s.freqS,15,T.g],["Check-ins",s.ciS,5,T.g]].map(([l,v,max,c])=><div key={l} style={{textAlign:"center"}}><div style={{height:30,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{width:"100%",background:c,borderRadius:"2px 2px 0 0",height:max>0?Math.max(2,v/max*28):0,opacity:.7,transition:"height .4s"}} /></div><div style={{...mn,fontSize:7,color:T.t3,marginTop:2}}>{l}</div><div style={{...mn,fontSize:9,color:c}}>{v}/{max}</div></div>)}
        </div>
        {s.risks.length>0&&<div style={{borderTop:`1px solid ${T.b}`,paddingTop:6}}>
          {s.risks.map((r2,i)=><div key={i} style={{display:"flex",gap:6,fontSize:11,color:T.r,marginBottom:2}}><span>⚠</span>{r2}</div>)}
        </div>}
      </div>)}
    </div>
  </div></>;
}
