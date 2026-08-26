/**
 * Claude Enablement Suite — 03: Employee Self-Service Setup Guide
 * Design: Reading Room at Midnight — Variant B
 * Storage: self-setup-v1
 */
import { useState, useEffect } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",red:"#c05050",mono2:"#78afc8",tag:"#1e1e1a"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25);color:#ddd8ce}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;

const Eyebrow=({children,color,style={}})=><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;
const Mono=({children,size=11,color,style={}})=><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:size,color:color||T.text2,...style}}>{children}</span>;
const Tag=({children,color})=><span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:color||T.text2,padding:"2px 7px",display:"inline-block"}}>{children}</span>;
const Heading=({children,size=22})=><div style={{fontFamily:"'Playfair Display',serif",fontSize:size,fontWeight:700,color:T.text}}>{children}</div>;

const STEPS=[
  {id:"account",title:"Create your account",sub:"Sign up at claude.ai with your work email",plan:null,
    items:[{id:"a1",t:"Go to claude.ai and click Sign up",c:true},{id:"a2",t:"Use your work email address",c:true},{id:"a3",t:"Verify email and complete onboarding",c:true},{id:"a4",t:"Download desktop app from claude.com/download",c:false},{id:"a5",t:"Install mobile app (iOS or Android)",c:false}],
    tip:"Work email keeps your account separate and enables org features later."},
  {id:"plan",title:"Check your plan",sub:"Pro unlocks most useful features",plan:null,
    items:[{id:"p1",t:"Open Settings (avatar, bottom-left)",c:true},{id:"p2",t:"Navigate to Plan — note your tier",c:true},{id:"p3",t:"If Free: check with manager about Pro ($20/mo)",c:false}],
    tip:"Free: basic chat. Pro: Projects, Memory, Connectors, file creation.",planNote:"Pro recommended"},
  {id:"memory",title:"Enable Memory",sub:"Claude remembers context across conversations",plan:null,
    items:[{id:"m1",t:"Settings → Memory & Integrations",c:true},{id:"m2",t:"Toggle Memory ON",c:true},{id:"m3",t:"Toggle Memory from chat history ON",c:true},{id:"m4",t:"Click Manage Memories — review what's there",c:false}],
    tip:"Memory means Claude doesn't start from scratch every conversation."},
  {id:"edits",title:"Write memory edits",sub:"Tell Claude the essentials about you",plan:null,
    items:[{id:"me1",t:"Manage Memories → Add edit",c:true},{id:"me2",t:"Write: 'User is [Name], [Role] at [Org].'",c:true},{id:"me3",t:"Add 1-2 more: preferences, tone, domain",c:true},{id:"me4",t:"Test in a new conversation",c:true},{id:"me5",t:"Add current projects or recurring focus",c:false}],
    tip:"Memory edits are your persistent instructions to Claude.",
    examples:["User is [Name], Operations Manager at [Org]. Always respond concisely.","User works primarily in Excel and Teams.","User's current focus is Q3 planning."]},
  {id:"project",title:"Create your first Project",sub:"Each Project is its own AI workspace",plan:"pro",
    items:[{id:"pr1",t:"Left sidebar → + New Project",c:true},{id:"pr2",t:"Name it for your primary work context",c:true},{id:"pr3",t:"Gear icon → set Project instructions",c:true},{id:"pr4",t:"Test: open conversation in project",c:true},{id:"pr5",t:"Pin 1-2 reference files",c:false}],
    tip:"Custom instructions are your persistent system prompt."},
  {id:"connectors",title:"Connect your tools",sub:"Claude reads and acts on your actual work data",plan:"pro",
    items:[{id:"c1",t:"Settings → Connectors",c:true},{id:"c2",t:"Connect Google Drive or OneDrive",c:true},{id:"c3",t:"Connect Notion, Slack, or Teams if used",c:false},{id:"c4",t:"Test: 'search my Drive for [recent doc]'",c:true},{id:"c5",t:"403 error fix: disconnect and reconnect",c:false}],
    tip:"Connectors let Claude reference your real documents instead of making things up."},
  {id:"style",title:"Set your writing style",sub:"Make Claude write in your voice",plan:null,
    items:[{id:"s1",t:"Settings → Writing style (or picker in conversation)",c:false},{id:"s2",t:"Try the Concise preset",c:false},{id:"s3",t:"Or write a custom description of your tone",c:false}],
    tip:"Override the style in any conversation without changing your default."},
  {id:"first",title:"Your first real task",sub:"Use Claude on something you actually need done today",plan:null,
    items:[{id:"f1",t:"Open a conversation in your new Project",c:true},{id:"f2",t:"Ask Claude to help with a real work task",c:true},{id:"f3",t:"Upload a file and ask Claude to summarize",c:false},{id:"f4",t:"Ask a web search question about your industry",c:false},{id:"f5",t:"Build something in Artifacts",c:false}],
    tip:"Don't start with test prompts — start with something you actually need done."},
];

export default function SelfSetup(){
  const[checkState,setCheckState]=useState({});
  const[expanded,setExpanded]=useState({account:true});
  const[plan,setPlan]=useState("pro");

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("self-setup-v1");if(r){const d=JSON.parse(r.value);if(d.checkState)setCheckState(d.checkState);if(d.plan)setPlan(d.plan)}}catch(e){}})()},[]);

  const persist=async(cs,pl)=>{try{await window.storage.set("self-setup-v1",JSON.stringify({checkState:cs,plan:pl}))}catch(e){}};
  const check=(sid,iid)=>setCheckState(p=>{const n={...p,[sid]:{...(p[sid]||{}),[iid]:!p[sid]?.[iid]}};persist(n,plan);return n});
  const toggle=id=>setExpanded(p=>({...p,[id]:!p[id]}));

  const stepProg=s=>{const cr=s.items.filter(i=>i.c);const d=cr.filter(i=>checkState[s.id]?.[i.id]).length;return{d,t:cr.length}};
  const stepDone=s=>{const{d,t}=stepProg(s);return!t||d===t};
  const totalCr=STEPS.flatMap(s=>s.items.filter(i=>i.c)).length;
  const totalDone=STEPS.reduce((a,s)=>a+s.items.filter(i=>i.c&&checkState[s.id]?.[i.id]).length,0);
  const pct=Math.round(totalDone/totalCr*100);
  const planOK=req=>!req||(plan==="pro"||plan==="team");

  return (<><style>{CSS}</style>
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13.5,lineHeight:1.65,color:T.text}}>
      {/* Header */}
      <header style={{padding:"24px 40px 18px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
            <div><Eyebrow style={{marginBottom:6}}>Claude Setup Guide</Eyebrow><Heading>Get Started</Heading></div>
            <select value={plan} onChange={e=>{setPlan(e.target.value);persist(checkState,e.target.value)}} style={{background:T.surface,color:T.accent,border:`1px solid ${T.borderHi}`,borderRadius:2,padding:"4px 8px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,cursor:"pointer",outline:"none"}}>
              <option value="free">Free</option><option value="pro">Pro</option><option value="team">Team / Enterprise</option>
            </select>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <Mono size={10} color={T.text3}>Setup progress</Mono>
            <Mono size={10} color={pct===100?T.green:T.text3}>{totalDone}/{totalCr} required · {pct}%</Mono>
          </div>
          <div style={{height:3,background:T.border,borderRadius:1}}><div style={{height:"100%",background:pct===100?T.green:T.accent,borderRadius:1,width:pct+"%",transition:"width 0.4s"}}/></div>
        </div>
      </header>

      <main style={{maxWidth:680,margin:"0 auto",padding:"20px 40px"}}>
        {pct===100&&<div style={{background:T.card,border:`1px solid ${T.green}`,borderLeft:`3px solid ${T.green}`,borderRadius:3,padding:"14px 18px",marginBottom:16,textAlign:"center"}}>
          <Mono size={14} color={T.green} style={{fontWeight:500}}>◆ Setup complete</Mono>
          <div style={{color:T.text2,fontSize:12,marginTop:4}}>Return here when you upgrade plans or add new tools.</div>
        </div>}

        {STEPS.map(step=>{
          const isOpen=expanded[step.id];
          const done=stepDone(step);
          const{d,t}=stepProg(step);
          const locked=step.plan&&!planOK(step.plan);
          return (
            <div key={step.id} style={{background:T.card,border:`1px solid ${done?T.green+"44":T.border}`,borderRadius:3,marginBottom:8,overflow:"hidden",opacity:locked?0.5:1}}>
              <div onClick={()=>!locked&&toggle(step.id)} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,cursor:locked?"default":"pointer",borderLeft:done?`3px solid ${T.green}`:"3px solid transparent"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:done?T.green:T.text}}>{step.title}</span>
                    {step.plan&&<Tag color={locked?T.text3:T.mono2}>{step.planNote||"Requires Pro"}</Tag>}
                    {locked&&<Mono size={10} color={T.text3}>upgrade to unlock</Mono>}
                  </div>
                  <div style={{fontSize:12,color:T.text2,marginTop:2}}>{step.sub}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  {t>0&&<Mono size={11} color={done?T.green:T.text3}>{d}/{t}</Mono>}
                  {!locked&&<Mono size={10} color={T.text3}>{isOpen?"▲":"▼"}</Mono>}
                </div>
              </div>

              {isOpen&&!locked&&<div style={{padding:"0 16px 14px",borderTop:`1px solid ${T.border}`,marginTop:0}}>
                <div style={{paddingTop:12}}>
                  {step.items.map(item=>{const on=!!checkState[step.id]?.[item.id];return (
                    <div key={item.id} onClick={()=>check(step.id,item.id)} style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:7,padding:"5px 8px",borderRadius:2,background:on?T.tag:"transparent",transition:"background 0.15s"}}>
                      <div style={{width:14,height:14,borderRadius:2,flexShrink:0,marginTop:2,background:on?T.green:"transparent",border:`1px solid ${on?T.green:T.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{on&&<span style={{color:T.bg,fontSize:9}}>✓</span>}</div>
                      <span style={{fontSize:12,color:on?T.green:T.text,flex:1,lineHeight:1.5}}>
                        {item.c&&<Mono size={10} color={T.accent} style={{marginRight:5}}>★</Mono>}
                        {item.t}
                        {!item.c&&<Mono size={9} color={T.text3} style={{marginLeft:6}}>optional</Mono>}
                      </span>
                    </div>
                  )})}

                  {step.examples&&<div style={{marginTop:8,background:T.bg,border:`1px solid ${T.border}`,borderRadius:2,padding:10}}>
                    <Eyebrow color={T.text3} style={{marginBottom:6,fontSize:9}}>Example edits</Eyebrow>
                    {step.examples.map((ex,i)=><div key={i} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:T.text2,marginBottom:3,padding:"3px 8px",background:T.card,borderRadius:2,border:`1px solid ${T.border}`}}>"{ex}"</div>)}
                  </div>}

                  <div style={{marginTop:10,padding:"8px 12px",background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,borderLeft:`2px solid ${T.accent}`}}>
                    <Mono size={11} color={T.accent}>◇</Mono><span style={{fontSize:11,color:T.text2,marginLeft:8}}>{step.tip}</span>
                  </div>
                </div>
              </div>}
            </div>
          );
        })}

        <div style={{textAlign:"center",marginTop:18,padding:14,background:T.card,borderRadius:3,border:`1px solid ${T.border}`}}>
          <Mono size={10} color={T.text3}>Progress auto-saved to this device · ★ required · other items recommended</Mono>
        </div>
      </main>
    </div>
  </>);
}
