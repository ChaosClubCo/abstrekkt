import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};
const BUILT_IN=[
  {id:"t-ops-manager",type:"prompt-package",name:"Operations Manager Starter Pack",desc:"6 prompts for meeting notes, SOPs, status reports, project planning, email triage, process docs.",role:"Operations Manager",literacy:"regular",tags:["ops","management","starter"],prompts:[
    {name:"Meeting Notes → Actions",category:"Operations",prompt:"You are a meeting notes analyst.\n\n<transcript>{paste notes here}</transcript>\n\nExtract:\n1. Key decisions made\n2. Action items (owner + deadline)\n3. Open questions\n4. Next meeting agenda\n\nFormat clearly. Be concise.",description:"Turns raw notes into structured action items.",tips:["Paste the full transcript — more context = better extraction","Review actions before sending — Claude may miss implicit assignments"]},
    {name:"SOP Writer",category:"Documentation",prompt:"Write a standard operating procedure.\n\n<process>{describe the process}</process>\n<team>{who performs this}</team>\n<frequency>{how often}</frequency>\n\nNumbered steps, max 15. Include \"When to Escalate\" section.",description:"Generates structured SOPs from a process description.",tips:["Include edge cases in the process description","Review for company-specific tools or terminology"]},
    {name:"Status Report Generator",category:"Reporting",prompt:"Generate a weekly status report.\n\n<accomplishments>{what got done}</accomplishments>\n<in_progress>{what's underway}</in_progress>\n<blockers>{what's stuck}</blockers>\n<next_week>{planned}</next_week>\n\nFormat: executive summary (2 sentences) then bullet sections. Under 200 words.",description:"Weekly status report from rough notes.",tips:["Keep accomplishments specific and measurable","Flag blockers with who can unblock them"]},
  ]},
  {id:"t-sales-rep",type:"prompt-package",name:"Sales Development Starter Pack",desc:"6 prompts for cold outreach, discovery prep, follow-ups, proposals, competitive objections, deal summaries.",role:"Sales Development Representative",literacy:"casual",tags:["sales","outreach","starter"],prompts:[
    {name:"Cold Outreach Drafter",category:"Sales",prompt:"Draft a cold outreach email.\n\n<prospect>{name, company, role}</prospect>\n<value_prop>{what we offer that matters to them}</value_prop>\n<cta>{desired next step}</cta>\n\nTone: confident, specific, not salesy. Under 120 words. No \"I hope this finds you well.\"",description:"Creates personalized cold outreach.",tips:["Include a specific reason you're reaching out (trigger event, role change, company news)","The CTA should be low-friction: 'worth a 15-min call?' not 'schedule a demo'"]},
    {name:"Discovery Prep",category:"Research",prompt:"Prepare me for a discovery call.\n\n<company>{company name}</company>\n<contact>{name, role}</contact>\n<what_we_know>{any existing context}</what_we_know>\n\nGenerate:\n1. 5 discovery questions (open-ended, insight-seeking)\n2. 3 potential pain points based on role + industry\n3. 2 objections to prepare for\n4. 1 hook — what makes our solution different for them",description:"Pre-call prep with targeted questions and positioning.",tips:["The more context you give, the sharper the output","Add their LinkedIn headline if available"]},
  ]},
  {id:"t-learning-4wk",type:"learning-path",name:"4-Week Foundation Path (Any Role)",desc:"Week 1: Setup + basics. Week 2: Projects + memory. Week 3: Use case practice. Week 4: Connectors + habits.",role:"General",literacy:"casual",tags:["learning","onboarding","foundation"],weeks:[
    {week:1,title:"Foundation",theme:"Get comfortable with Claude",days:[{day:"Mon",task:"Create account, send 5 test messages",time_min:10,category:"Setup"},{day:"Wed",task:"Try: paste a work email, ask Claude to improve it",time_min:10,category:"Practice"},{day:"Fri",task:"Ask Claude to explain something from your domain — evaluate accuracy",time_min:10,category:"Evaluation"}],milestone:"Can log in and have a productive conversation",success_metric:"3+ messages sent with work-relevant content"},
    {week:2,title:"Projects & Memory",theme:"Make Claude remember your preferences",days:[{day:"Mon",task:"Create first Project with your role in custom instructions",time_min:15,category:"Setup"},{day:"Wed",task:"Configure memory: add 3 memory edits about your work style",time_min:10,category:"Setup"},{day:"Fri",task:"Ask Claude something in your Project — does it use your context?",time_min:10,category:"Evaluation"}],milestone:"Project created with working custom instructions",success_metric:"Claude uses your role/preferences without being reminded"},
    {week:3,title:"Real Work",theme:"Apply Claude to your #1 use case",days:[{day:"Mon",task:"Use your prompt package: run your top use case with real work",time_min:15,category:"Practice"},{day:"Wed",task:"Try a second use case from your package",time_min:15,category:"Practice"},{day:"Fri",task:"Evaluate: was the output usable? What would you change?",time_min:10,category:"Evaluation"}],milestone:"Used Claude for actual deliverable",success_metric:"1+ work output created or improved with Claude"},
    {week:4,title:"Integrate",theme:"Build the habit",days:[{day:"Mon",task:"Install a connector (Google Drive, Slack, or Notion)",time_min:10,category:"Setup"},{day:"Wed",task:"Try web search on a current research question",time_min:10,category:"Practice"},{day:"Fri",task:"Submit weekly check-in. Block 10 min/day on calendar for Claude.",time_min:10,category:"Accountability"}],milestone:"Connector working + recurring habit set",success_metric:"Weekly usage established, check-in submitted"},
  ]},
  {id:"t-session-first",type:"session-template",name:"First Session — Standard Agenda",desc:"45-min template with timing, facilitator notes, and QC gate.",role:"Any",tags:["session","first","template"],agenda:[
    {step:1,title:"Welcome + Login Confirm",min:5,notes:"Verify they can access claude.ai. If SSO — confirm with IT beforehand."},
    {step:2,title:"Orientation Tour",min:5,notes:"Show: conversation, Projects, Settings (Memory, Connectors). Don't demo — let them click."},
    {step:3,title:"Create First Project",min:8,notes:"Settings → Projects → New. Paste their role from intake. Show how custom instructions work."},
    {step:4,title:"Prompt Package Walkthrough",min:7,notes:"Show 2-3 prompts from their package. Explain XML tags and variable slots."},
    {step:5,title:"Live Practice",min:12,notes:"Their #1 use case with real work. You watch. Intervene only if stuck. This is the session."},
    {step:6,title:"Configure Memory",min:4,notes:"Settings → Memory → add 3 edits: role, preferences, style. Show review/delete."},
    {step:7,title:"QC Gate + Next Steps",min:4,notes:"Walk through q1-q7. Set next session date. Goal for the week."},
  ]},
];
function Tag({children,color}){return <span style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:8,padding:"1px 5px",color:color||T.t3}}>{children}</span>;}
export default function TemplateMarketplace(){
  const [tab,setTab]=useState("browse");const [q,setQ]=useState("");const [type,setType]=useState("all");const [sel,setSel]=useState(null);
  const [custom,setCustom]=useState([]);const [rdy,setRdy]=useState(false);const [copied,setCopied]=useState("");
  useEffect(()=>{ld("ff-templates-v1").then(d=>{setCustom(d||[]);setRdy(true);});},[]);
  const all=[...BUILT_IN,...custom];
  const TYPES=["all","prompt-package","learning-path","session-template"];
  const res=all.filter(t=>(type==="all"||t.type===type)&&(!q||t.name.toLowerCase().includes(q.toLowerCase())||t.desc?.toLowerCase().includes(q.toLowerCase())||(t.tags||[]).some(tag=>tag.includes(q.toLowerCase()))));
  const typeLabel=t=>({all:"All","prompt-package":"Prompt Packages","learning-path":"Learning Paths","session-template":"Session Templates"}[t]||t);
  const typeColor=t=>({"prompt-package":T.a,"learning-path":T.m,"session-template":T.g}[t]||T.t2);
  const install=async(tmpl)=>{
    if(tmpl.type==="prompt-package"&&tmpl.prompts){
      const pkgs=await ld("prompt-packages-v1")||{};
      pkgs["template:"+tmpl.role]={employeeName:"Template: "+tmpl.role,prompts:tmpl.prompts,createdAt:new Date().toISOString()};
      await sv("prompt-packages-v1",pkgs);setCopied(tmpl.id);setTimeout(()=>setCopied(""),2000);
    }else if(tmpl.type==="learning-path"&&tmpl.weeks){
      const paths=await ld("learning-paths-v1")||{};
      paths["template:"+tmpl.role]={weeks:tmpl.weeks,employeeName:"Template: "+tmpl.role,createdAt:new Date().toISOString()};
      await sv("learning-paths-v1",paths);setCopied(tmpl.id);setTimeout(()=>setCopied(""),2000);
    }else{
      navigator.clipboard.writeText(JSON.stringify(tmpl,null,2)).catch(()=>{});
      setCopied(tmpl.id);setTimeout(()=>setCopied(""),2000);
    }
  };
  const TABS=[["browse","Browse"],["detail","Detail"]];
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Template Marketplace</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Shareable prompt packages, learning paths, session templates · {all.length} templates</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"8px 18px",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      <input value={q} onChange={e=>{setQ(e.target.value);if(sel)setSel(null);}} placeholder="Search templates, tags, roles…" style={{padding:"5px 9px",borderRadius:4,border:`1px solid ${T.h}`,fontSize:12,...mn,background:T.sf,color:T.t,outline:"none",width:220}} />
      <div style={{display:"flex",gap:3}}>{TYPES.map(t=><button key={t} onClick={()=>{setType(t);setSel(null);}} style={{background:"transparent",border:`1px solid ${type===t?T.a:T.b}`,borderRadius:3,color:type===t?T.a:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>{typeLabel(t)}</button>)}</div>
      <span style={{...mn,fontSize:9,color:T.t3,marginLeft:"auto"}}>{res.length} templates</span>
    </div>
    <div style={{padding:"12px 18px",display:sel?"grid":"block",gridTemplateColumns:sel?"1fr 1fr":"1fr",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:sel?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:7}}>
        {res.map(tmpl=><div key={tmpl.id} onClick={()=>setSel(tmpl)} style={{background:sel?.id===tmpl.id?T.sf:T.c,border:`1px solid ${sel?.id===tmpl.id?typeColor(tmpl.type):T.b}`,borderRadius:3,padding:"10px 12px",cursor:"pointer",transition:"all .12s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div><div style={{fontWeight:500,fontSize:12,color:T.t}}>{tmpl.name}</div><div style={{...mn,fontSize:9,color:typeColor(tmpl.type),marginTop:1}}>{typeLabel(tmpl.type)}</div></div>
            <button onClick={e=>{e.stopPropagation();install(tmpl);}} style={{background:"transparent",border:`1px solid ${copied===tmpl.id?T.g:T.h}`,borderRadius:2,color:copied===tmpl.id?T.g:T.t2,...mn,fontSize:9,padding:"3px 7px",cursor:"pointer",flexShrink:0}}>{copied===tmpl.id?"✓ Installed":"Install"}</button>
          </div>
          <div style={{fontSize:11,color:T.t2,lineHeight:1.5,marginBottom:6}}>{tmpl.desc}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(tmpl.tags||[]).map(tag=><Tag key={tag}>#{tag}</Tag>)}{tmpl.role&&<Tag color={T.m}>{tmpl.role}</Tag>}</div>
        </div>)}
        {!res.length&&<div style={{gridColumn:"1/-1",textAlign:"center",color:T.t2,padding:24,...mn,fontSize:11}}>No templates match "{q}"</div>}
      </div>
      {sel&&<div style={{overflowY:"auto",maxHeight:"80vh"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600}}>{sel.name}</div><div style={{...mn,fontSize:9,color:typeColor(sel.type),marginTop:2}}>{typeLabel(sel.type)}{sel.role?` · ${sel.role}`:""}{sel.literacy?` · ${sel.literacy}`:""}</div></div>
          <button onClick={()=>setSel(null)} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>✕ Close</button>
        </div>
        <div style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:10}}>{sel.desc}</div>
        {sel.type==="prompt-package"&&sel.prompts&&<>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>PROMPTS ({sel.prompts.length})</div>
          {sel.prompts.map((p,i)=><div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 12px",marginBottom:5}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div><Tag color={T.a}>{p.category}</Tag><div style={{fontWeight:500,fontSize:12,color:T.t,marginTop:3}}>{p.name}</div></div><span style={{...mn,fontSize:9,color:T.t3}}>{i+1}/{sel.prompts.length}</span></div>
            <div style={{fontSize:11,color:T.t2,marginBottom:6}}>{p.description}</div>
            <div style={{background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,padding:"7px 8px",...mn,fontSize:10,color:T.t,whiteSpace:"pre-wrap",lineHeight:1.55}}>{p.prompt}</div>
            {p.tips?.length>0&&<div style={{...mn,fontSize:9,color:T.t3,marginTop:5}}>{p.tips.map(t=>"◆ "+t).join(" · ")}</div>}
          </div>)}
        </>}
        {sel.type==="learning-path"&&sel.weeks&&<>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>WEEKS ({sel.weeks.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7}}>
            {sel.weeks.map((w,wi)=><div key={wi} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,overflow:"hidden"}}>
              <div style={{background:T.sf,borderBottom:`1px solid ${T.b}`,padding:"7px 10px"}}><div style={{...mn,fontSize:9,color:[T.a,T.m,T.g,"#b07ab0"][wi],marginBottom:1}}>WEEK {w.week}</div><div style={{fontWeight:600,fontSize:12}}>{w.title}</div><div style={{fontSize:10,color:T.t3,marginTop:1}}>{w.theme}</div></div>
              <div style={{padding:"7px 10px"}}>{(w.days||[]).map((d,di)=><div key={di} style={{padding:"4px 0",borderBottom:di<(w.days?.length||0)-1?`1px solid ${T.tg}`:"none"}}><div style={{display:"flex",justifyContent:"space-between",...mn,fontSize:9,color:T.t3}}><span>{d.day}</span><span>{d.time_min}min</span></div><div style={{fontSize:11,color:T.t2}}>{d.task}</div></div>)}</div>
            </div>)}
          </div>
        </>}
        {sel.type==="session-template"&&sel.agenda&&<>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>AGENDA ({sel.agenda.reduce((a,s)=>a+s.min,0)} min total)</div>
          {sel.agenda.map(s=><div key={s.step} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"8px 12px",marginBottom:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <div style={{display:"flex",gap:7,alignItems:"center"}}><span style={{...mn,fontSize:9,color:T.a}}>{String(s.step).padStart(2,"0")}</span><span style={{fontWeight:500,fontSize:12}}>{s.title}</span></div>
              <span style={{...mn,fontSize:9,color:T.t3}}>{s.min} min</span>
            </div>
            <div style={{fontSize:11,color:T.t2,lineHeight:1.5}}>{s.notes}</div>
          </div>)}
        </>}
        <div style={{marginTop:10}}>
          <button onClick={()=>install(sel)} style={{background:"transparent",border:`1px solid ${copied===sel.id?T.g:T.a}`,borderRadius:2,color:copied===sel.id?T.g:T.a,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 14px",cursor:"pointer"}}>{copied===sel.id?"✓ Installed to storage":"Install to Storage →"}</button>
        </div>
      </div>}
    </div>
  </div></>;
}
