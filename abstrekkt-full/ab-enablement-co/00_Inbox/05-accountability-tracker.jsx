/**
 * Claude Enablement Suite — 05: Accountability Tracker
 * Design: Reading Room at Midnight — Variant B
 * Storage: checkin-records-v1 | Reads: intake-records-v1
 */
import { useState, useEffect, useCallback } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",mono:"#7ab878",mono2:"#78afc8",red:"#c05050",green:"#5a9c5a",tag:"#1e1e1a"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;
const sf={sans:{fontFamily:"'IBM Plex Sans', sans-serif"},mono:{fontFamily:"'IBM Plex Mono', monospace"},head:{fontFamily:"'Playfair Display', serif",fontWeight:700}};

function Eyebrow({children,color,style={}}){return <div style={{...sf.mono,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;}
function Mono({children,size=11,color,style={}}){return <span style={{...sf.mono,fontSize:size,color:color||T.text2,lineHeight:1,...style}}>{children}</span>;}
function Tag({children,color}){return <span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,...sf.mono,fontSize:9.5,color:color||T.text2,padding:"2px 7px",display:"inline-block"}}>{children}</span>;}
function Card({children,style={}}){return <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"16px 20px",...style}}>{children}</div>;}
function Btn({children,onClick,disabled,accent}){return <button onClick={onClick} disabled={disabled} style={{background:"transparent",border:`1px solid ${accent?T.accent:T.borderHi}`,borderRadius:2,color:disabled?T.text3:accent?T.accent:T.text2,...sf.mono,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",cursor:disabled?"not-allowed":"pointer",transition:"color 0.15s"}}>{children}</button>;}

const inputStyle={width:"100%",padding:"7px 10px",borderRadius:2,border:`1px solid ${T.borderHi}`,fontSize:12,...sf.sans,outline:"none",background:T.bg,color:T.text,marginBottom:10};
const FREQ=[{v:"daily",l:"Daily",g:"\u25C6\u25C6\u25C6",c:T.green},{v:"few_week",l:"Few/wk",g:"\u25C6\u25C6",c:T.green},{v:"once_week",l:"Once/wk",g:"\u25C6",c:T.mono2},{v:"once_few",l:"Rarely",g:"\u25C7",c:T.accent},{v:"not_yet",l:"Not yet",g:"\u2014",c:T.red}];
const USE_TAGS=["Email","Documents","Summarizing","Research","Meeting prep","Code/technical","Process docs","Data analysis","Planning","Customer comms","Learning","Other"];
const BLOCKER_TAGS=["Forgot","Didn't know how","Prompt failed","Too busy","Not useful","Accuracy","Tech issue","No use case","Other"];

function getMonday(){const d=new Date();const day=d.getDay();d.setDate(d.getDate()-day+(day===0?-6:1));return d.toISOString().split("T")[0];}
function tog(arr,v){return arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];}
const EMPTY={name:"",weekOf:getMonday(),frequency:"",useCases:[],blockers:[],biggestWin:"",stuckOn:"",nextWeekGoal:"",confidence:3};

export default function AccountabilityTracker(){
  const[checkins,setCheckins]=useState([]);const[intakes,setIntakes]=useState([]);const[form,setForm]=useState(EMPTY);const[view,setView]=useState("checkin");const[done,setDone]=useState(false);const[filterN,setFilterN]=useState("all");
  useEffect(()=>{(async()=>{try{const[cr,ir]=await Promise.allSettled([window.storage.get("checkin-records-v1"),window.storage.get("intake-records-v1")]);if(cr.status==="fulfilled"&&cr.value)setCheckins(JSON.parse(cr.value.value));if(ir.status==="fulfilled"&&ir.value)setIntakes(JSON.parse(ir.value.value));}catch(e){}})();},[]);
  const save=useCallback(async recs=>{try{await window.storage.set("checkin-records-v1",JSON.stringify(recs));}catch(e){}},[]);
  function set(f,v){setForm(p=>({...p,[f]:v}));}
  async function submit(){if(!form.name||!form.frequency)return;const rec={...form,id:Date.now(),createdAt:new Date().toISOString()};const next=[rec,...checkins];setCheckins(next);await save(next);setDone(true);}
  function newCI(){setForm({...EMPTY,weekOf:getMonday()});setDone(false);setView("checkin");}
  const empNames=[...new Set(checkins.map(c=>c.name))];const filtered=filterN==="all"?checkins:checkins.filter(c=>c.name===filterN);
  const wrap=c=><><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg,...sf.sans,fontSize:13.5,color:T.text}}>{c}</div></>;

  if(done)return wrap(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{textAlign:"center"}}><Mono size={24} color={T.green}>{"\u25C6"}</Mono><div style={{...sf.head,fontSize:18,marginTop:12}}>Check-in submitted</div><div style={{color:T.text2,fontSize:12,marginTop:6,marginBottom:20}}>Your facilitator will review before next session.</div><div style={{display:"flex",gap:8,justifyContent:"center"}}><Btn onClick={newCI} accent>Another</Btn><Btn onClick={()=>{setDone(false);setView("log");}}>History</Btn></div></div></div>);

  if(view==="facilitator"){const byE={};checkins.forEach(c=>{if(!byE[c.name])byE[c.name]=[];byE[c.name].push(c);});
  return wrap(<><header style={{padding:"22px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}><div><Eyebrow style={{marginBottom:6}}>Facilitator View</Eyebrow><div style={{...sf.head,fontSize:22}}>Check-in Review</div></div><Btn onClick={newCI} accent>{"\u2190"} Form</Btn></header>
  <main style={{padding:"24px 40px",maxWidth:820}}>{!Object.keys(byE).length?<Mono color={T.text3}>no check-ins</Mono>:Object.entries(byE).map(([name,recs])=>{const latest=recs[0];const freq=FREQ.find(f=>f.v===latest.frequency);const avgC=Math.round(recs.reduce((a,r)=>a+r.confidence,0)/recs.length*10)/10;
  return (<Card key={name} style={{marginBottom:10}}>
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}><div><div style={{...sf.head,fontSize:16}}>{name}</div><Mono size={10} color={T.text3}>{recs.length} check-in{recs.length!==1?"s":""}</Mono></div><div style={{display:"flex",gap:10}}><div style={{textAlign:"center"}}><Mono size={14} color={freq?.c}>{freq?.g}</Mono><div style={{...sf.mono,fontSize:8.5,color:T.text3,textTransform:"uppercase",marginTop:2}}>this wk</div></div><div style={{textAlign:"center"}}><Mono size={14} color={T.mono2}>{avgC}</Mono><div style={{...sf.mono,fontSize:8.5,color:T.text3,textTransform:"uppercase",marginTop:2}}>conf</div></div></div></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
  {latest.biggestWin&&<div style={{background:T.bg,border:`1px solid ${T.border}`,borderLeft:`2px solid ${T.green}`,borderRadius:2,padding:8}}><Eyebrow color={T.green} style={{fontSize:9,marginBottom:4}}>Win</Eyebrow><div style={{fontSize:11,color:T.text2}}>{latest.biggestWin}</div></div>}
  {latest.stuckOn&&<div style={{background:T.bg,border:`1px solid ${T.border}`,borderLeft:`2px solid ${T.accent}`,borderRadius:2,padding:8}}><Eyebrow color={T.accent} style={{fontSize:9,marginBottom:4}}>Stuck</Eyebrow><div style={{fontSize:11,color:T.text2}}>{latest.stuckOn}</div></div>}
  </div>
  {latest.nextWeekGoal&&<div style={{background:T.bg,border:`1px solid ${T.border}`,borderLeft:`2px solid ${T.mono2}`,borderRadius:2,padding:8,marginBottom:8}}><Eyebrow color={T.mono2} style={{fontSize:9,marginBottom:3}}>Goal</Eyebrow><div style={{fontSize:11,color:T.text2}}>{latest.nextWeekGoal}</div></div>}
  {latest.blockers.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{latest.blockers.map((b,i)=><Tag key={i} color={T.red}>{b}</Tag>)}</div>}
  </Card>);})}</main></>);}

  if(view==="log")return wrap(<><header style={{padding:"22px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}><div><Eyebrow style={{marginBottom:6}}>History</Eyebrow><div style={{...sf.head,fontSize:22}}>{filtered.length} Records</div></div><div style={{display:"flex",gap:8}}><Btn onClick={()=>setView("facilitator")}>Facilitator</Btn><Btn onClick={newCI} accent>+ Check In</Btn></div></header>
  <main style={{padding:"24px 40px",maxWidth:760}}>
  {empNames.length>1&&<div style={{display:"flex",gap:5,marginBottom:14}}>{["all",...empNames].map(n=><button key={n} onClick={()=>setFilterN(n)} style={{padding:"3px 10px",borderRadius:2,border:`1px solid ${filterN===n?T.accent:T.border}`,background:filterN===n?T.accent+"15":"transparent",color:filterN===n?T.accent:T.text2,...sf.sans,fontSize:11,cursor:"pointer"}}>{n==="all"?"All":n}</button>)}</div>}
  {!filtered.length?<Mono color={T.text3}>no check-ins</Mono>:filtered.map(rec=>{const freq=FREQ.find(f=>f.v===rec.frequency);return (
  <Card key={rec.id} style={{marginBottom:6,padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}><Mono size={14} color={freq?.c}>{freq?.g}</Mono><div style={{flex:1}}><span style={{fontWeight:500,color:T.text}}>{rec.name}</span> <Mono size={10} color={T.text3}>{"\u00B7"} {new Date(rec.weekOf).toLocaleDateString()} {"\u00B7"} conf. {rec.confidence}/5</Mono></div></div>
  {rec.biggestWin&&<div style={{fontSize:11,color:T.green,background:T.green+"0a",padding:"3px 8px",borderRadius:2,marginBottom:3}}>{"\u25C6"} {rec.biggestWin}</div>}
  {rec.stuckOn&&<div style={{fontSize:11,color:T.accent,background:T.accent+"0a",padding:"3px 8px",borderRadius:2}}>{"\u25C6"} {rec.stuckOn}</div>}
  </Card>);})}
  </main></>);

  return wrap(<><header style={{padding:"22px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}><div><Eyebrow style={{marginBottom:6}}>Weekly Check-In</Eyebrow><div style={{...sf.head,fontSize:22}}>How's it going?</div></div><div style={{display:"flex",gap:8}}>{checkins.length>0&&<Btn onClick={()=>setView("facilitator")}>Facilitator</Btn>}{checkins.length>0&&<Btn onClick={()=>setView("log")}>History</Btn>}</div></header>
  <main style={{padding:"24px 40px",maxWidth:620}}>
  <div style={{color:T.text3,fontSize:12,marginBottom:18,textAlign:"center"}}>~2 minutes. Helps your facilitator prepare.</div>

  <Card style={{marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
  <div><div style={{...sf.mono,fontSize:9.5,color:T.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Name *</div>
  {intakes.length>0?<select value={form.name} onChange={e=>set("name",e.target.value)} style={{...inputStyle,cursor:"pointer"}}><option value="">Select...</option>{[...new Set(intakes.map(i=>i.name))].map(n=><option key={n} value={n}>{n}</option>)}</select>:<input value={form.name} onChange={e=>set("name",e.target.value)} style={inputStyle} placeholder="Your name"/>}</div>
  <div><div style={{...sf.mono,fontSize:9.5,color:T.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Week Of</div><input value={form.weekOf} onChange={e=>set("weekOf",e.target.value)} type="date" style={inputStyle}/></div>
  </div></Card>

  <Card style={{marginBottom:12}}><div style={{...sf.head,fontSize:14,color:T.text,marginBottom:10}}>How often this week? *</div>
  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{FREQ.map(f=>(
  <button key={f.v} onClick={()=>set("frequency",f.v)} style={{padding:"8px 14px",borderRadius:2,border:`1px solid ${form.frequency===f.v?T.accent:T.border}`,background:form.frequency===f.v?T.accent+"15":"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
  <Mono size={14} color={form.frequency===f.v?f.c:T.text3}>{f.g}</Mono>
  <div style={{...sf.sans,fontSize:11,color:form.frequency===f.v?T.text:T.text3,marginTop:3}}>{f.l}</div>
  </button>))}</div></Card>

  <Card style={{marginBottom:12}}><div style={{...sf.head,fontSize:14,color:T.text,marginBottom:8}}>What for?</div>
  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{USE_TAGS.map(tag=>{const sel=form.useCases.includes(tag);return <button key={tag} onClick={()=>set("useCases",tog(form.useCases,tag))} style={{padding:"3px 10px",borderRadius:2,border:`1px solid ${sel?T.green:T.border}`,background:sel?T.green+"15":"transparent",color:sel?T.green:T.text2,...sf.sans,fontSize:11,cursor:"pointer"}}>{sel?"\u25C6 ":""}{tag}</button>;})}</div></Card>

  <Card style={{marginBottom:12}}><div style={{...sf.head,fontSize:14,color:T.text,marginBottom:4}}>Biggest win</div>
  <textarea value={form.biggestWin} onChange={e=>set("biggestWin",e.target.value)} style={{...inputStyle,height:55,resize:"vertical",marginTop:6,marginBottom:0}} placeholder="Time saved, task helped"/></Card>

  <Card style={{marginBottom:12}}><div style={{...sf.head,fontSize:14,color:T.text,marginBottom:8}}>Blockers</div>
  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>{BLOCKER_TAGS.map(tag=>{const sel=form.blockers.includes(tag);return <button key={tag} onClick={()=>set("blockers",tog(form.blockers,tag))} style={{padding:"3px 10px",borderRadius:2,border:`1px solid ${sel?T.red:T.border}`,background:sel?T.red+"15":"transparent",color:sel?T.red:T.text2,...sf.sans,fontSize:11,cursor:"pointer"}}>{tag}</button>;})}</div>
  <textarea value={form.stuckOn} onChange={e=>set("stuckOn",e.target.value)} style={{...inputStyle,height:45,resize:"vertical",marginBottom:0}} placeholder="What didn't work?"/></Card>

  <Card style={{marginBottom:16}}>
  <div style={{...sf.head,fontSize:14,color:T.text,marginBottom:8}}>Confidence: <Mono size={16} color={T.accent}>{form.confidence}</Mono><Mono size={11} color={T.text3}>/5</Mono></div>
  <input type="range" min="1" max="5" value={form.confidence} onChange={e=>set("confidence",+e.target.value)} style={{width:"100%",accentColor:T.accent,marginBottom:4}}/>
  <div style={{display:"flex",justifyContent:"space-between",...sf.mono,fontSize:9,color:T.text3}}><span>1 learning</span><span>3 getting it</span><span>5 confident</span></div>
  <div style={{marginTop:14}}><div style={{...sf.mono,fontSize:9.5,color:T.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Next week goal</div>
  <textarea value={form.nextWeekGoal} onChange={e=>set("nextWeekGoal",e.target.value)} style={{...inputStyle,height:45,resize:"vertical",marginBottom:0}} placeholder="e.g. Connect Notion"/></div></Card>

  <div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={submit} disabled={!form.name||!form.frequency} accent>Submit {"\u2192"}</Btn></div>
  </main></>);
}
