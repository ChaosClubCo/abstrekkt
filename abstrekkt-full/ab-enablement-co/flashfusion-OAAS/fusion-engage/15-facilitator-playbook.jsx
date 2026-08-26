import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const SCENARIOS=[
  {id:"first",title:"First Session — New Employee",trigger:"Employee has intake but no sessions yet",steps:[
    {q:"Can they log in?",yes:"Move to Projects setup",no:"Walk through account creation. If org uses SSO, contact IT first."},
    {q:"Do they have Pro plan?",yes:"Create their first Project",no:"Explain value of Pro ($20/mo). If org pays: escalate. If personal: help them decide."},
    {q:"Do they have a clear use case?",yes:"Go to Prompt Package → live practice with their actual work",no:"Run Use Case Discovery Wizard (artifact 06). Pick top 1."},
    {q:"Did they practice with real work?",yes:"Configure memory + check QC gate",no:"Do one live task now. Even 5 min of real work beats 30 min of demos."},
    {q:"QC gate: ≥4/7 critical items?",yes:"Set next session date. You're done.",no:"Log which items failed. Set follow-up within 1 week."},
  ]},
  {id:"followup",title:"Follow-up Session — Returning Employee",trigger:"Has 1+ prior sessions logged",steps:[
    {q:"Did they submit a check-in?",yes:"Review wins, stuck points, and confidence score",no:"Ask: how's it going? Get a verbal check-in. Log it for them."},
    {q:"Are they using Claude regularly?",yes:"Focus on depth: second use case, advanced features, connectors",no:"Diagnose: time? value? confusion? fear? Address the actual blocker."},
    {q:"Did they complete last session's gaps?",yes:"Move to next QC items or advanced use case",no:"Re-attempt the gaps. Don't skip — they compound."},
    {q:"QC gate: 7/7?",yes:"Employee is self-sufficient. Move to monthly cadence or complete.",no:"Focus remaining session time on the incomplete items."},
  ]},
  {id:"resistant",title:"Resistant Employee",trigger:"Employee is skeptical, dismissive, or passive",steps:[
    {q:"Is the resistance about time?",yes:"\"10 min covers 80%. Let's try one task right now.\" Do it live.",no:"Continue diagnosing →"},
    {q:"Is it about job security?",yes:"\"Claude handles the parts you don't want to do. The judgment calls stay with you.\"",no:"Continue →"},
    {q:"Is it about trust / accuracy?",yes:"\"Let's test it. Pick something you already know the answer to. See if Claude gets it right.\"",no:"Continue →"},
    {q:"Is it about relevance to their work?",yes:"Run Use Case Discovery Wizard. Show role-specific examples from their actual industry.",no:"Continue →"},
    {q:"Have you tried everything above?",yes:"Log as 'Needs Follow-up'. Brief their manager (if appropriate). Schedule a 15-min check-in in 2 weeks.",no:"Try one more approach: ask them to teach YOU something. Then show how Claude could help them explain it to others."},
  ]},
  {id:"noshow",title:"No-Show Employee",trigger:"Missed a scheduled session",steps:[
    {q:"First no-show?",yes:"Send a brief, no-pressure follow-up: \"No worries — want to reschedule?\"",no:"This is a pattern →"},
    {q:"Responded to follow-up?",yes:"Reschedule within the week. Don't wait.",no:"Escalate to their manager or program sponsor. Not punitively — just visibility."},
    {q:"Is the employee still enrolled?",yes:"Log as No Show in outcomes. Set next attempt date.",no:"Archive in cohort manager. Move on."},
  ]},
  {id:"advanced",title:"Advanced / Power User",trigger:"Employee has QC 7/7 and uses Claude daily",steps:[
    {q:"Are they using Projects effectively?",yes:"Introduce MCP connectors if not already connected",no:"Help them restructure: one Project per work area, not one mega-project."},
    {q:"Have they tried Claude Code or Cowork?",yes:"Discuss skills library. Show /plugin install for relevant workflows.",no:"Demo one: Claude Code for a script they'd manually write, or Cowork for a repeating task."},
    {q:"Are they creating value for their team?",yes:"Document their wins. Use for program report and case studies.",no:"Challenge: \"Can you teach one colleague your top use case this week?\""},
    {q:"Ready to graduate?",yes:"Generate handoff document. Move to monthly check-in cadence. Celebrate.",no:"Set a specific milestone. Don't leave it open-ended."},
  ]},
];
export default function Playbook(){
  const [sel,setSel]=useState("first");const [step,setStep]=useState(0);const [path,setPath]=useState([]);
  const sc=SCENARIOS.find(s=>s.id===sel);const cur=sc?.steps[step];
  const answer=(ans)=>{setPath(p=>[...p,{q:cur.q,a:ans,detail:ans==="yes"?cur.yes:cur.no}]);if(step<sc.steps.length-1)setStep(s=>s+1);};
  const reset=()=>{setStep(0);setPath([]);};
  const copyPath=()=>{const txt=`Scenario: ${sc.title}\n\n${path.map((p,i)=>`${i+1}. ${p.q}\n   → ${p.a.toUpperCase()}: ${p.detail}`).join("\n\n")}`;navigator.clipboard.writeText(txt).catch(()=>{});};
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Facilitator Playbook</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Decision tree for every session scenario</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",height:"calc(100vh - 52px)"}}>
      <div style={{borderRight:`1px solid ${T.b}`,overflowY:"auto",padding:"10px 0"}}>
        <div style={{padding:"6px 14px",...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:5}}>Scenarios</div>
        {SCENARIOS.map(s=><div key={s.id} onClick={()=>{setSel(s.id);reset();}} style={{padding:"8px 14px",cursor:"pointer",background:sel===s.id?T.tg:"transparent",borderLeft:`2px solid ${sel===s.id?T.a:"transparent"}`,transition:"all .1s"}}>
          <div style={{fontSize:11,fontWeight:500,color:sel===s.id?T.t:T.t2}}>{s.title}</div>
          <div style={{...mn,fontSize:9,color:T.t3,marginTop:1}}>{s.trigger}</div>
        </div>)}
      </div>
      <div style={{overflowY:"auto",padding:"14px 18px",maxWidth:680}}>
        {sc&&<>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:4}}>{sc.title}</div>
          <div style={{...mn,fontSize:9,color:T.t3,marginBottom:14}}>{sc.trigger}</div>
          {path.map((p,i)=><div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 13px",marginBottom:6,borderLeft:`3px solid ${p.a==="yes"?T.g:T.a}`}}>
            <div style={{fontWeight:500,fontSize:12,marginBottom:4}}>{p.q}</div>
            <div style={{...mn,fontSize:9,color:p.a==="yes"?T.g:T.a,marginBottom:3}}>→ {p.a.toUpperCase()}</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.55}}>{p.detail}</div>
          </div>)}
          {cur&&step<sc.steps.length&&!(path.length>=sc.steps.length)&&<div style={{background:T.sf,border:`1px solid rgba(212,137,58,.3)`,borderRadius:3,padding:"14px 16px",marginBottom:8}}>
            <div style={{...mn,fontSize:9,color:T.a,marginBottom:4}}>STEP {step+1} OF {sc.steps.length}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>{cur.q}</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>answer("yes")} style={{flex:1,background:"rgba(90,156,90,.08)",border:`1px solid ${T.g}`,borderRadius:3,color:T.g,...mn,fontSize:11,padding:"8px 0",cursor:"pointer"}}>Yes</button>
              <button onClick={()=>answer("no")} style={{flex:1,background:"rgba(212,137,58,.08)",border:`1px solid ${T.a}`,borderRadius:3,color:T.a,...mn,fontSize:11,padding:"8px 0",cursor:"pointer"}}>No</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
              <div style={{fontSize:11,color:T.t3}}><span style={{...mn,fontSize:8,color:T.g}}>IF YES:</span><br/>{cur.yes}</div>
              <div style={{fontSize:11,color:T.t3}}><span style={{...mn,fontSize:8,color:T.a}}>IF NO:</span><br/>{cur.no}</div>
            </div>
          </div>}
          {path.length>=sc.steps.length&&<div style={{background:T.c,border:`1px solid rgba(90,156,90,.3)`,borderRadius:3,padding:"12px 14px",textAlign:"center"}}>
            <div style={{...mn,fontSize:9,color:T.g,marginBottom:5}}>◆ DECISION TREE COMPLETE</div>
            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
              <button onClick={copyPath} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:10,padding:"5px 12px",cursor:"pointer"}}>Copy Path</button>
              <button onClick={reset} style={{background:"transparent",border:`1px solid ${T.a}`,borderRadius:2,color:T.a,...mn,fontSize:10,padding:"5px 12px",cursor:"pointer"}}>Restart</button>
            </div>
          </div>}
        </>}
      </div>
    </div>
  </div></>;
}
