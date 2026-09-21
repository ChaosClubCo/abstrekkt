import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const WELCOME_STEPS=[
  {id:1,title:"Before your first session",items:["Sign up at claude.ai (or log in if you have an account)","Identify 1–2 tasks you do weekly that are repetitive or feel like low-value work","Nothing to install. Nothing to read in advance."]},
  {id:2,title:"What we'll do in Session 1",items:["Get you logged in and oriented (~5 min)","Configure Claude with your role and preferences (~10 min)","Practice your top use case live, with real work (~20 min)","Walk through your personalized prompt package (~10 min)"]},
  {id:3,title:"What you'll have after Session 1",items:["Claude configured with your working style","A prompt package tailored to your role","One habit to try this week (≤10 min/day)","A direct line to your facilitator for questions"]},
  {id:4,title:"What this program is not",items:["Not a course — you won't be reading slides or watching videos","Not a commitment to use AI for everything","Not a replacement for your team's judgment","Not permanent — you'll know if it's worth continuing by week 3"]},
];
const FAQ=[
  {q:"Do I need any technical background?",a:"No. The highest-value users of Claude are often the least technical. If you can write an email, you can use Claude."},
  {q:"Is this secure? What happens to my data?",a:"On Claude Pro and Team plans, your conversations are not used to train AI models. FlashFusion sessions use your organization's Claude instance. Review trust.anthropic.com for the full data handling policy."},
  {q:"How much time does this take?",a:"Session 1 is 45 minutes. Weekly time commitment after that is whatever you choose — most people find it adds rather than takes time."},
  {q:"What if I try it and it's not useful?",a:"That's a valid outcome. The goal of Session 1 is to test whether Claude is actually useful for your work — not to sell you on AI. We'll know by the end."},
  {q:"Can I use ChatGPT instead?",a:"Yes. The program principles apply to any frontier AI. We use Claude because of its Projects feature, 1M context window, and data privacy guarantees — but if your org uses something else, we can adapt."},
  {q:"Will this affect my job?",a:"The tasks we focus on in this program are the low-judgment, repetitive ones. Your expertise and relationships are not affected."},
];
const PLANS=[{id:"pro",label:"Pro",price:"$20/mo",desc:"Best for individuals. Projects, memory, connectors, Artifacts."},{id:"team",label:"Team",price:"$30/seat/mo",desc:"For groups. Shared Projects, admin console, no training on data."},{id:"max",label:"Max",desc:"Power users. Higher usage limits, advanced models.",price:"$100/mo"}];
export default function ClientPortal(){
  const [tab,setTab]=useState("welcome");const [name,setName]=useState("");const [faqOpen,setFaqOpen]=useState({});const [submitted,setSubmitted]=useState(false);const [ready,setReady]=useState(false);
  useEffect(()=>{ld("portal-state-v1").then(s=>{if(s){setName(s.name||"");setSubmitted(s.submitted||false);}setReady(true);});},[]);
  const submit=async()=>{const rec={name,submittedAt:new Date().toISOString(),submitted:true};await sv("portal-state-v1",rec);setSubmitted(true);setTab("prep");};
  const TABS=[["welcome","Welcome"],["about","About Claude"],["plans","Plans"],["prep","Session Prep"],["faq","FAQ"]];
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"20px 24px 14px",borderBottom:`1px solid ${T.b}`,background:T.sf}}>
      <div style={{...mn,fontSize:9,color:T.a,letterSpacing:"0.14em",marginBottom:4}}>◆ FLASHFUSION AI ENABLEMENT</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Client Onboarding Portal</div>
      <div style={{fontSize:12,color:T.t2,marginTop:4}}>Welcome to your program. This is your guide from now through Session 1{submitted&&name?`, ${name}`:""}.</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"0 24px",overflowX:"auto"}}>
      {TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===id?T.a:"transparent"}`,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,fontWeight:500,padding:"8px 12px",color:tab===id?T.t:T.t2,marginBottom:-1,whiteSpace:"nowrap",transition:"color .12s,border-color .12s"}}>{l}</button>)}
    </div>
    <div style={{padding:"16px 24px",maxWidth:720}}>
      {tab==="welcome"&&<div>
        {!submitted&&<div style={{background:T.c,border:`1px solid rgba(212,137,58,.3)`,borderRadius:3,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:6}}>Tell us your name</div>
          <div style={{display:"flex",gap:6}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your first name" style={{flex:1,padding:"7px 10px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:13,background:T.bg,color:T.t,outline:"none",fontFamily:"'IBM Plex Sans',sans-serif"}} /><button onClick={submit} disabled={!name.trim()} style={{background:"transparent",border:`1px solid ${name.trim()?T.a:T.h}`,borderRadius:2,color:name.trim()?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",padding:"0 14px",cursor:name.trim()?"pointer":"not-allowed"}}>Start →</button></div>
        </div>}
        {submitted&&<div style={{background:"rgba(90,156,90,.06)",border:"1px solid rgba(90,156,90,.25)",borderRadius:3,padding:"10px 14px",marginBottom:12}}><span style={{...mn,fontSize:10,color:T.g}}>◆ Welcome, {name}. Your facilitator has been notified.</span></div>}
        {WELCOME_STEPS.map(step=><div key={step.id} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"12px 14px",marginBottom:7}}>
          <div style={{display:"flex",gap:10,marginBottom:7}}><span style={{...mn,fontSize:9,color:T.a,flexShrink:0,marginTop:1}}>0{step.id}</span><div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600}}>{step.title}</div></div>
          {step.items.map((item,i)=><div key={i} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:i<step.items.length-1?`1px solid ${T.tg}`:"none"}}><span style={{color:T.g,flexShrink:0,marginTop:1}}>◆</span><span style={{fontSize:12,color:T.t2,lineHeight:1.55}}>{item}</span></div>)}
        </div>)}
      </div>}
      {tab==="about"&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:10}}>What Claude is (and isn't)</div>
        {[["What Claude does well",T.g,["Drafts documents, emails, SOPs, and reports at high quality","Summarizes long documents into structured, actionable briefings","Answers questions about your work with specific, grounded responses","Helps you think through problems by generating options and tradeoffs","Writes, reviews, and explains code","Researches topics and synthesizes information from multiple sources"]],["What Claude doesn't replace",T.r,["Your expertise and judgment — Claude doesn't know your industry as well as you do","Your relationships with clients, colleagues, or leadership","Decisions that require your accountability","Creative vision and taste — Claude produces competent, not exceptional, creative work by default"]],["The compounding advantage",T.a,["Claude improves as you give it more context about your role and work style","The more you use it, the better you get at directing it — like managing someone who gets faster over time","Your Projects remember your preferences so you don't re-explain yourself every session"]]].map(([title,color,items])=><div key={title} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}><div style={{...mn,fontSize:9,color,marginBottom:7,letterSpacing:"0.1em",textTransform:"uppercase"}}>{title}</div>{items.map((it,i)=><div key={i} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:i<items.length-1?`1px solid ${T.tg}`:"none"}}><span style={{color,flexShrink:0}}>◆</span><span style={{fontSize:12,color:T.t2,lineHeight:1.55}}>{it}</span></div>)}</div>)}
      </div>}
      {tab==="plans"&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:4}}>Claude Plan Options</div>
        <p style={{fontSize:12,color:T.t2,marginBottom:12}}>Your facilitator will recommend the right plan for your use case. This is for reference.</p>
        {PLANS.map(p=><div key={p.id} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"12px 14px",marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>{p.label}</div><span style={{...mn,fontSize:11,color:T.a}}>{p.price}</span></div>
          <div style={{fontSize:12,color:T.t2}}>{p.desc}</div>
        </div>)}
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{...mn,fontSize:9,color:T.t3,marginBottom:5}}>DATA PRIVACY</div>
          <div style={{fontSize:12,color:T.t2,lineHeight:1.6}}>On Pro and Team plans, Anthropic does not use your conversations to train AI models. On Team/Enterprise, data stays within your organization's account. Full policy at <a href="https://trust.anthropic.com" target="_blank" style={{color:T.m}}>trust.anthropic.com</a>.</div>
        </div>
      </div>}
      {tab==="prep"&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:10}}>Before Session 1</div>
        {[{n:1,t:"Sign up or log in",d:"Go to claude.ai. Create an account if you don't have one. Pro is recommended ($20/mo). Free works for Session 1.",done:submitted},{n:2,t:"Think of one repetitive task",d:"What's something you do every week that feels like low-value work? Email drafts? Meeting notes? Status reports? That's where we'll start.",done:false},{n:3,t:"Have 45 minutes clear",d:"No prep materials needed. Just show up with your laptop and the task you identified. We'll do everything live.",done:false}].map((s,i)=><div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7,opacity:1}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:"50%",background:s.done?"#1a2a1a":T.tg,border:`1px solid ${s.done?T.g:T.h}`,display:"flex",alignItems:"center",justifyContent:"center",...mn,fontSize:9,color:s.done?T.g:T.t3,flexShrink:0}}>{s.done?"◆":s.n}</div><div><div style={{fontWeight:500,fontSize:12,marginBottom:3}}>{s.t}</div><div style={{fontSize:11,color:T.t2,lineHeight:1.55}}>{s.d}</div></div></div>
        </div>)}
        <div style={{background:T.c,border:`1px solid rgba(212,137,58,.25)`,borderRadius:3,padding:"10px 14px"}}><span style={{...mn,fontSize:10,color:T.a}}>◆ That's it. Your facilitator handles the rest.</span></div>
      </div>}
      {tab==="faq"&&<div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:10}}>Frequently Asked Questions</div>
        {FAQ.map((item,i)=><div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,overflow:"hidden",marginBottom:5}}>
          <div onClick={()=>setFaqOpen(p=>({...p,[i]:!p[i]}))} style={{padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",cursor:"pointer"}}>
            <div style={{fontWeight:500,fontSize:12,color:T.t,flex:1}}>{item.q}</div>
            <span style={{...mn,fontSize:9,color:T.t3,flexShrink:0,marginLeft:8}}>{faqOpen[i]?"▲":"▼"}</span>
          </div>
          {faqOpen[i]&&<div style={{padding:"0 13px 11px",borderTop:`1px solid ${T.b}`}}><div style={{fontSize:12,color:T.t2,lineHeight:1.65,paddingTop:9}}>{item.a}</div></div>}
        </div>)}
      </div>}
    </div>
  </div></>;
}
