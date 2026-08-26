import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ROLES=[["Executive / C-Suite","Strategy, decisions, briefings"],["Operations / Manager","Processes, reports, coordination"],["Sales / BD","Outreach, proposals, follow-ups"],["Marketing","Content, campaigns, research"],["Customer Success","Emails, tickets, onboarding"],["Finance / Legal","Analysis, summaries, compliance"],["HR / People Ops","Policies, comms, recruiting"],["Engineering / Technical","Code, docs, debugging"],["Product / Design","Specs, research, feedback"],["Other",""]]
const TASKS=[["Writing & editing","drafts, reports, emails, SOPs"],["Research & analysis","summaries, competitive intel, data interpretation"],["Planning & organization","agendas, timelines, project briefs"],["Customer communication","responses, follow-ups, onboarding"],["Technical work","code, debugging, documentation"],["Internal comms","memos, updates, all-hands prep"],["Learning & upskilling","explanations, examples, study aids"]];
const TIME=[["< 1 hr/week","Minimal opportunity"],["1–3 hrs","Low–medium impact"],["3–5 hrs","Strong ROI case"],["5–10 hrs","High priority"],["10+ hrs","Critical to address"]];
const COMFORT=[["Never tried AI","Starting from zero"],["Tried ChatGPT a few times","Some exposure"],["Use AI weekly","Regular user"],["Power user (Projects, prompts)","Advanced"],["Build/script AI workflows","Expert"]];
const GOALS=[["Save time on repetitive work"],["Improve quality of my output"],["Handle higher volume"],["Learn a competitive skill"],["Better research / synthesis"],["Reduce context-switching"]];
const UC_MAP={
  "Executive / C-Suite":["Executive briefing generator","Board deck summarizer","Decision memo writer","Competitive landscape analyst","Strategic Q&A prep"],
  "Operations / Manager":["SOP writer","Process documentation","Status report generator","Meeting notes → actions","Vendor email drafter"],
  "Sales / BD":["Cold outreach sequence","Proposal writer","Discovery prep","Follow-up email drafter","Competitive objection handler"],
  "Marketing":["Blog post drafts","Social caption batching","SEO brief generator","Campaign brief writer","Competitor analysis"],
  "Customer Success":["Response templates","Onboarding email sequences","Ticket summarizer","Renewal prep briefing","QBR slide content"],
  "Finance / Legal":["Document summarizer","Data interpretation","Compliance checklist","Contract review prep","Financial narrative writer"],
  "HR / People Ops":["Job description writer","Policy draft generator","Interview question builder","All-hands memo writer","Offboarding checklist"],
  "Engineering / Technical":["Code reviewer","Bug description writer","Technical doc generator","PR summary writer","Architecture explainer"],
  "Product / Design":["PRD writer","User story generator","Research synthesis","Feedback analysis","Release notes writer"],
  "Other":["Email drafting","Meeting notes","Document summarizer","Research assistant","General writing aid"]
};
function Pill({label,sub,selected,onClick}){return <div onClick={onClick} style={{padding:"7px 10px",borderRadius:3,cursor:"pointer",border:`1px solid ${selected?T.a:T.b}`,background:selected?T.tg:"transparent",marginBottom:4,transition:"all .12s"}}>
  <div style={{fontSize:12,fontWeight:500,color:selected?T.t:T.t2}}>{label}</div>
  {sub&&<div style={{fontSize:10,color:T.t3,marginTop:1}}>{sub}</div>}
</div>}
export default function UCDiscovery(){
  const [step,setStep]=useState(0);const [ans,setAns]=useState({role:"",tasks:[],time:"",comfort:"",goals:[]});
  const [done,setDone]=useState(false);
  const set=(k,v)=>setAns(p=>({...p,[k]:v}));
  const tog=(k,v)=>setAns(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));
  const STEPS=[
    {q:"What's your primary role?",type:"single",key:"role",opts:ROLES},
    {q:"What types of work take up most of your time?",type:"multi",key:"tasks",opts:TASKS},
    {q:"How much time per week do you spend on tasks that feel repetitive or low-judgment?",type:"single",key:"time",opts:TIME},
    {q:"How comfortable are you with AI tools right now?",type:"single",key:"comfort",opts:COMFORT},
    {q:"What's your primary goal with Claude?",type:"multi",key:"goals",opts:GOALS},
  ];
  const cur=STEPS[step];const canNext=cur?.type==="single"?!!ans[cur.key]:ans[cur.key]?.length>0;
  const recs=UC_MAP[ans.role]||UC_MAP["Other"];
  if(done)return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Your Claude Use Cases</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Based on your role and workflow</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:780}}>
      <div style={{background:T.c,border:`1px solid rgba(90,156,90,.3)`,borderRadius:3,padding:"11px 14px",marginBottom:10}}>
        <div style={{...mn,fontSize:9,color:T.g,marginBottom:5}}>◆ PROFILE</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["Role",ans.role],["Time Drains",ans.time],["Comfort",ans.comfort]].map(([l,v])=>v&&<div key={l} style={{background:T.sf,borderRadius:2,padding:"4px 8px"}}><div style={{...mn,fontSize:9,color:T.t3}}>{l}</div><div style={{fontSize:11,color:T.t}}>{v}</div></div>)}
        </div>
      </div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>Recommended Use Cases</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
        {recs.map((uc,i)=><div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 13px"}}>
          <div style={{...mn,fontSize:9,color:T.a,marginBottom:2}}>◆ USE CASE {String(i+1).padStart(2,"0")}</div>
          <div style={{fontWeight:500,fontSize:12,color:T.t}}>{uc}</div>
          <div style={{fontSize:10,color:T.t3,marginTop:2}}>Build a Project for this · ask facilitator for prompt</div>
        </div>)}
      </div>
      <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 14px",marginBottom:8}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:6}}>Your Stated Goals</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ans.goals.map(g=><span key={g} style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:9,padding:"2px 7px",color:T.m}}>{g}</span>)}</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>navigator.clipboard.writeText(`Role: ${ans.role}\nTime: ${ans.time}\nComfort: ${ans.comfort}\nGoals: ${ans.goals.join(", ")}\n\nRecommended use cases:\n${recs.map((u,i)=>`${i+1}. ${u}`).join("\n")}`).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:10,padding:"5px 11px",cursor:"pointer"}}>Copy Summary</button>
        <button onClick={()=>{setStep(0);setAns({role:"",tasks:[],time:"",comfort:"",goals:[]});setDone(false);}} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:10,padding:"5px 11px",cursor:"pointer"}}>Restart</button>
      </div>
    </div>
  </div></>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Use Case Discovery</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ 5-step wizard · finds your highest-impact Claude use cases</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:580}}>
      <div style={{display:"flex",gap:4,marginBottom:14}}>
        {STEPS.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?T.a:T.tg,transition:"background .2s"}} />)}
      </div>
      <div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>STEP {step+1} OF {STEPS.length}</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>{cur.q}</div>
      {cur.opts.map(([l,sub])=>{const selected=cur.type==="single"?ans[cur.key]===l:ans[cur.key]?.includes(l);return <Pill key={l} label={l} sub={sub} selected={selected} onClick={()=>cur.type==="single"?set(cur.key,l):tog(cur.key,l)} />;  })}
      {cur.type==="multi"&&<div style={{...mn,fontSize:9,color:T.t3,marginTop:4}}>{ans[cur.key]?.length||0} selected</div>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
        <button onClick={()=>step>0&&setStep(s=>s-1)} disabled={step===0} style={{background:"transparent",border:`1px solid ${step>0?T.h:"transparent"}`,borderRadius:2,color:step>0?T.t2:T.t3,...mn,fontSize:10,padding:"5px 11px",cursor:step>0?"pointer":"default"}}>← Back</button>
        <button onClick={()=>step<STEPS.length-1?setStep(s=>s+1):setDone(true)} disabled={!canNext} style={{background:"transparent",border:`1px solid ${canNext?T.a:T.h}`,borderRadius:2,color:canNext?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"5px 12px",cursor:canNext?"pointer":"not-allowed"}}>{step===STEPS.length-1?"See My Use Cases →":"Next →"}</button>
      </div>
    </div>
  </div></>;
}
