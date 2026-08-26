import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};
const SC={"Active":T.g,"Paused":T.a,"Complete":T.m,"Prospect":T.t3};
export default function CohortManager(){
  const [cohorts,setCohorts]=useState([]);const [sel,setSel]=useState(null);const [view,setView]=useState("list");
  const [form,setForm]=useState({name:"",client:"",tier:"growth",status:"Active",emp:10,startDate:"",notes:""});
  const [ready,setReady]=useState(false);
  useEffect(()=>{ld("cohorts-v1").then(c=>{const list=c||[];setCohorts(list);if(list.length)setSel(list[0].id);setReady(true);});},[]);
  const cur=cohorts.find(c=>c.id===sel);
  const save=async()=>{
    const rec={...form,id:Date.now(),intakeKey:`cohort-${Date.now()}-intakes`,outcomeKey:`cohort-${Date.now()}-outcomes`,checkinKey:`cohort-${Date.now()}-checkins`,createdAt:new Date().toISOString()};
    const next=[...cohorts,rec];setCohorts(next);await sv("cohorts-v1",next);setSel(rec.id);setView("detail");setForm({name:"",client:"",tier:"growth",status:"Active",emp:10,startDate:"",notes:""});
  };
  const updateStatus=async(id,status)=>{const next=cohorts.map(c=>c.id===id?{...c,status}:c);setCohorts(next);await sv("cohorts-v1",next);};
  const archive=async(id)=>{if(!confirm("Archive this cohort?"))return;const next=cohorts.filter(c=>c.id!==id);setCohorts(next);await sv("cohorts-v1",next);if(sel===id)setSel(next[0]?.id||null);setView("list");};
  const TIERS={starter:"$99/mo",growth:"$149/mo",scale:"$299/mo"};
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  if(!ready)return<div style={{minHeight:"100vh",background:T.bg,color:T.t2,fontFamily:"'IBM Plex Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",...mn,fontSize:10}}>Loading cohorts…</div>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,display:"flex"}}>
    <div style={{width:220,flexShrink:0,borderRight:`1px solid ${T.b}`,padding:"10px 0",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"8px 14px 10px",borderBottom:`1px solid ${T.b}`}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700}}>Cohorts</div>
        <div style={{...mn,fontSize:9,color:T.t2,marginTop:1}}>◆ {cohorts.length} total</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
        {cohorts.map(c=><div key={c.id} onClick={()=>{setSel(c.id);setView("detail");}} style={{padding:"7px 14px",cursor:"pointer",background:sel===c.id?T.tg:"transparent",borderLeft:`2px solid ${sel===c.id?T.a:"transparent"}`,transition:"all .1s"}}>
          <div style={{fontSize:11,fontWeight:500,color:sel===c.id?T.t:T.t2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
          <div style={{...mn,fontSize:9,color:SC[c.status]||T.t3,marginTop:1}}>{c.status} · {c.emp} employees</div>
        </div>)}
        {!cohorts.length&&<div style={{padding:"12px 14px",...mn,fontSize:9,color:T.t3}}>No cohorts yet</div>}
      </div>
      <div style={{padding:"8px 10px",borderTop:`1px solid ${T.b}`}}>
        <button onClick={()=>setView("new")} style={{width:"100%",background:"transparent",border:`1px solid ${T.a}`,borderRadius:2,color:T.a,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 0",cursor:"pointer"}}>+ New Cohort</button>
      </div>
    </div>
    <div style={{flex:1,overflowY:"auto"}}>
      {view==="new"&&<div style={{padding:"14px 18px",maxWidth:580}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>New Cohort</div>
        {[["Cohort Name","name","text","e.g. Acme Corp - Q3 2026"],["Client / Company","client","text","Acme Corp"],["Employees","emp","number","10"],["Start Date","startDate","date",""]].map(([l,k,type,ph])=><div key={k}><div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:3}}>{l}</div><input type={type} value={form[k]} onChange={e=>sf(k,e.target.value)} placeholder={ph} style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,marginBottom:7,outline:"none",fontFamily:"'IBM Plex Sans',sans-serif"}} /></div>)}
        <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:3}}>Tier</div>
        <div style={{display:"flex",gap:4,marginBottom:7}}>{Object.entries(TIERS).map(([k,p])=><button key={k} onClick={()=>sf("tier",k)} style={{flex:1,background:"transparent",border:`1px solid ${form.tier===k?T.a:T.h}`,borderRadius:2,color:form.tier===k?T.a:T.t2,...mn,fontSize:9,padding:"5px 0",cursor:"pointer"}}>{k}<br/><span style={{color:T.t3}}>{p}</span></button>)}</div>
        <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:3}}>Status</div>
        <div style={{display:"flex",gap:4,marginBottom:10}}>{["Prospect","Active","Paused","Complete"].map(s=><button key={s} onClick={()=>sf("status",s)} style={{flex:1,background:"transparent",border:`1px solid ${form.status===s?T.a:T.h}`,borderRadius:2,color:form.status===s?T.a:T.t2,...mn,fontSize:9,padding:"4px 0",cursor:"pointer"}}>{s}</button>)}</div>
        <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:3}}>Notes</div>
        <textarea value={form.notes} onChange={e=>sf("notes",e.target.value)} style={{width:"100%",background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"7px 9px",resize:"vertical",minHeight:52,outline:"none",marginBottom:10}} />
        <div style={{display:"flex",gap:6}}><button onClick={save} disabled={!form.name.trim()} style={{background:"transparent",border:`1px solid ${form.name.trim()?T.a:T.h}`,borderRadius:2,color:form.name.trim()?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 14px",cursor:form.name.trim()?"pointer":"not-allowed"}}>Create Cohort →</button><button onClick={()=>setView("list")} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:10,padding:"6px 12px",cursor:"pointer"}}>Cancel</button></div>
      </div>}
      {view==="detail"&&cur&&<div style={{padding:"14px 18px",maxWidth:680}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600}}>{cur.name}</div><div style={{...mn,fontSize:9,color:T.t3,marginTop:2}}>{cur.client} · Started {cur.startDate||"TBD"}</div></div>
          <div style={{display:"flex",gap:4}}>
            {["Active","Paused","Complete"].map(s=><button key={s} onClick={()=>updateStatus(cur.id,s)} style={{background:"transparent",border:`1px solid ${cur.status===s?T.a:T.h}`,borderRadius:2,color:cur.status===s?T.a:T.t2,...mn,fontSize:9,padding:"3px 7px",cursor:"pointer"}}>{s}</button>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
          {[["Tier",cur.tier,T.m],["Price",TIERS[cur.tier]||"—",T.a],["Employees",cur.emp,T.t],["Status",cur.status,SC[cur.status]]].map(([l,v,c])=><div key={l} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:2,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:500,color:c}}>{v}</div><div style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t3,marginTop:2}}>{l}</div></div>)}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:7}}>Storage Keys</div>
          <div style={{fontSize:11,color:T.t2,marginBottom:3}}>This cohort has isolated storage. Use these keys in the Facilitator Suite when working with this client:</div>
          {[["Intakes",cur.intakeKey],["Outcomes",cur.outcomeKey],["Check-ins",cur.checkinKey]].map(([l,k])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.tg}`}}><span style={{...mn,fontSize:9,color:T.t3}}>{l}</span><code style={{...mn,fontSize:9,color:T.m}}>{k}</code></div>)}
        </div>
        {cur.notes&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 14px",marginBottom:8}}><div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>NOTES</div><div style={{fontSize:12,color:T.t2}}>{cur.notes}</div></div>}
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>archive(cur.id)} style={{background:"transparent",border:`1px solid rgba(192,80,80,.4)`,borderRadius:2,color:T.r,...mn,fontSize:9,padding:"4px 10px",cursor:"pointer"}}>Archive</button>
        </div>
      </div>}
      {view==="list"&&!cohorts.length&&<div style={{padding:"40px 18px",textAlign:"center",...mn,fontSize:11,color:T.t2}}>No cohorts yet.<br/>Create one for each client program.</div>}
    </div>
  </div></>;
}
