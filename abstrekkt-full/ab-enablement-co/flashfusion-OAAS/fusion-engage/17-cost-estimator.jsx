import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const MODELS={"claude-sonnet-4-6":{n:"Sonnet 4.6",i:3,o:15},"claude-opus-4-7":{n:"Opus 4.7",i:5,o:25},"claude-haiku-4-5-20251001":{n:"Haiku 4.5",i:0.80,o:4}};
const PLANS={free:{cost:0,l:"Free"},pro:{cost:20,l:"Pro"},max:{cost:100,l:"Max"},team:{cost:30,l:"Team"},enterprise:{cost:0,l:"Enterprise (custom)"}};
const ACTIONS=[
  {id:"intake",name:"Intake Processing",inTok:500,outTok:800,model:"claude-sonnet-4-6",freq:"per employee",desc:"Session brief generation from intake form"},
  {id:"prompts",name:"Prompt Package Build",inTok:600,outTok:3000,model:"claude-sonnet-4-6",freq:"per employee",desc:"6 tailored prompts via API"},
  {id:"report",name:"Health Report",inTok:400,outTok:1200,model:"claude-sonnet-4-6",freq:"per month",desc:"AI stakeholder narrative from program data"},
  {id:"objection",name:"Objection AI Chat",inTok:200,outTok:350,model:"claude-sonnet-4-6",freq:"per query",desc:"Live AI for pushback handling"},
  {id:"learning",name:"Learning Path Build",inTok:500,outTok:2000,model:"claude-sonnet-4-6",freq:"per employee",desc:"4-week personalized roadmap"},
  {id:"proposal",name:"Proposal Generation",inTok:600,outTok:2000,model:"claude-sonnet-4-6",freq:"per client",desc:"Full SOW with pricing and deliverables"},
  {id:"handoff",name:"Handoff Document",inTok:800,outTok:2500,model:"claude-sonnet-4-6",freq:"per cohort",desc:"End-of-engagement deliverable"},
  {id:"eval",name:"Prompt Evaluation",inTok:1000,outTok:600,model:"claude-sonnet-4-6",freq:"per scenario",desc:"Rubric-scored evaluation per test"},
  {id:"sandbox",name:"Sandbox Message",inTok:300,outTok:1500,model:"claude-sonnet-4-6",freq:"per message",desc:"Live practice message in sandbox"},
];
const fmt=n=>n>=1?'$'+n.toFixed(2):n>=0.01?'$'+n.toFixed(3):'$'+n.toFixed(4);
const fmtK=n=>n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(0)+'K':String(n);
export default function CostEstimator(){
  const [emp,setEmp]=useState(10);const [plan,setPlan]=useState("pro");const [months,setMonths]=useState(6);
  const [sessPerEmp,setSessPerEmp]=useState(3);const [queriesPerSess,setQueriesPerSess]=useState(5);const [sandboxMsgs,setSandboxMsgs]=useState(10);
  const actions=ACTIONS.map(a=>{
    let count=0;
    if(a.freq==="per employee")count=emp;
    else if(a.freq==="per month")count=months;
    else if(a.freq==="per query")count=emp*sessPerEmp*queriesPerSess;
    else if(a.freq==="per client")count=1;
    else if(a.freq==="per cohort")count=1;
    else if(a.freq==="per scenario")count=emp*2;
    else if(a.freq==="per message")count=emp*sandboxMsgs;
    const m=MODELS[a.model];
    const inCost=(a.inTok*count/1000000)*m.i;
    const outCost=(a.outTok*count/1000000)*m.o;
    return{...a,count,inCost,outCost,total:inCost+outCost,totalTok:(a.inTok+a.outTok)*count};
  });
  const totalAPI=actions.reduce((a,x)=>a+x.total,0);
  const totalTok=actions.reduce((a,x)=>a+x.totalTok,0);
  const planCost=emp*(PLANS[plan]?.cost||0)*months;
  const grandTotal=totalAPI+planCost;
  const perEmpPerMonth=months>0&&emp>0?grandTotal/(emp*months):0;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Cost Estimator</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Token usage + spend projection per cohort</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:880}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          {[["Employees",emp,setEmp,1,200,1],["Sessions per Employee",sessPerEmp,setSessPerEmp,1,10,1],["Program Length (months)",months,setMonths,1,12,1],["Queries per Session (avg)",queriesPerSess,setQueriesPerSess,1,20,1],["Sandbox Messages per Employee",sandboxMsgs,setSandboxMsgs,0,50,5]].map(([l,v,set,min,max,step])=><div key={l} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3}}>{l}</span><span style={{...mn,fontSize:12,color:T.a}}>{v}</span></div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:T.a}} />
          </div>)}
        </div>
        <div>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
            <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>Claude Plan</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{Object.entries(PLANS).map(([k,v])=><button key={k} onClick={()=>setPlan(k)} style={{background:"transparent",border:`1px solid ${plan===k?T.a:T.h}`,borderRadius:2,color:plan===k?T.a:T.t2,...mn,fontSize:9,padding:"4px 8px",cursor:"pointer"}}>{v.l}</button>)}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
            {[["API Spend",fmt(totalAPI),T.m],["Plan Spend","$"+Math.round(planCost),T.a],["Total","$"+Math.round(grandTotal),T.t],["Per Emp/Mo",fmt(perEmpPerMonth),T.g],["Total Tokens",fmtK(totalTok),T.t2],["Actions",actions.reduce((a,x)=>a+x.count,0),T.t2]].map(([l,v,c])=><div key={l} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:2,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:16,fontWeight:500,color:c}}>{v}</div><div style={{...mn,fontSize:8,color:T.t3,marginTop:2}}>{l}</div></div>)}
          </div>
        </div>
      </div>
      <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Action","Count","In Tokens","Out Tokens","Model","Cost"].map(h=><th key={h} style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t2,textAlign:"left",padding:"6px 9px",borderBottom:`1px solid ${T.b}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{actions.map(a=><tr key={a.id}><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,fontSize:12,color:T.t,fontWeight:500}}>{a.name}<div style={{...mn,fontSize:8,color:T.t3}}>{a.desc}</div></td><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,...mn,fontSize:10,color:T.t2}}>{a.count}</td><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,...mn,fontSize:10,color:T.t2}}>{fmtK(a.inTok*a.count)}</td><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,...mn,fontSize:10,color:T.t2}}>{fmtK(a.outTok*a.count)}</td><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,...mn,fontSize:9,color:T.m}}>{MODELS[a.model]?.n}</td><td style={{padding:"6px 9px",borderBottom:`1px solid ${T.tg}`,...mn,fontSize:10,color:T.a}}>{fmt(a.total)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  </div></>;
}
