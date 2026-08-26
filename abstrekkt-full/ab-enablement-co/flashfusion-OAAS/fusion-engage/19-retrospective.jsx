import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const api=async(msgs,max=2500,sys)=>{const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");};
export default function Retrospective(){
  const [ins,setIns]=useState([]);const [outs,setOuts]=useState([]);const [ci,setCi]=useState([]);const [pkgs,setPkgs]=useState({});
  const [rdy,setRdy]=useState(false);const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [focus,setFocus]=useState("full");
  useEffect(()=>{Promise.all([ld("intake-records-v1"),ld("outcome-records-v1"),ld("checkin-records-v1"),ld("prompt-packages-v1")]).then(([a,b,c,d])=>{setIns(a||[]);setOuts(b||[]);setCi(c||[]);setPkgs(d||{});setRdy(true);});},[]);
  const comp=outs.filter(o=>f(o,"st","status")==="Completed").length;
  const fu=outs.filter(o=>f(o,"st","status")==="Needs Follow-up").length;
  const avgQC=outs.length?Math.round(outs.reduce((a,o)=>a+Object.values(o.qc||{}).filter(Boolean).length,0)/outs.length*10)/10:0;
  const avgConf=ci.length?Math.round(ci.reduce((a,c2)=>a+(+f(c2,"conf","confidence")||0),0)/ci.length*10)/10:0;
  const wins=ci.filter(c2=>f(c2,"win","biggestWin")).map(c2=>({name:f(c2,"nm","name"),win:f(c2,"win","biggestWin")}));
  const stucks=ci.filter(c2=>f(c2,"stuck","stuckOn")).map(c2=>({name:f(c2,"nm","name"),stuck:f(c2,"stuck","stuckOn")}));
  const gaps=outs.filter(o=>f(o,"ga","gaps","openGaps")).map(o=>({name:f(o,"n","name","employeeName"),gap:f(o,"ga","gaps","openGaps")}));
  const generate=async()=>{
    setLoading(true);setErr("");setResult("");
    const FOCUS_MAP={full:"Full program retrospective covering what worked, what didn't, employee outcomes, facilitator insights, and recommendations for the next cohort.",wins:"Focus on wins and successes — what worked, who excelled, repeatable patterns.",risks:"Focus on what went wrong, at-risk employees, unresolved gaps, and lessons learned.",next:"Focus on recommendations for the next cohort — what to change, what to keep, what to add."};
    const sys=`You are an AI enablement program analyst writing retrospective reports. Write honest, data-driven retrospectives — celebrate real wins, be candid about failures, give specific recommendations. Use markdown. Under 1000 words.`;
    const prompt=`Write a program retrospective.\n\nFocus: ${FOCUS_MAP[focus]}\n\nProgram Data:\n- ${ins.length} enrolled, ${outs.length} sessions, ${comp} completed, ${fu} need follow-up\n- Avg QC: ${avgQC}/7, Avg confidence: ${avgConf}/5\n- ${Object.keys(pkgs).length} prompt packages built, ${ci.length} check-ins submitted\n- Top wins: ${wins.slice(0,5).map(w=>w.name+": "+w.win).join("; ")||"none logged"}\n- Stuck points: ${stucks.slice(0,5).map(s=>s.name+": "+s.stuck).join("; ")||"none logged"}\n- Open gaps: ${gaps.slice(0,5).map(g=>g.name+": "+g.gap).join("; ")||"none"}\n\nSections:\n## What Worked (specific, with data)\n## What Didn't (honest, with root cause)\n## Employee Highlights (top performers + at-risk)\n## Key Metrics Summary (table)\n## Recommendations for Next Cohort (5 specific actions)\n## Open Questions (things we still don't know)`;
    try{const r=await api([{role:"user",content:prompt}],2500,sys);setResult(r);}catch(e){setErr(e.message);}
    setLoading(false);
  };
  if(!rdy)return<div style={{minHeight:"100vh",background:T.bg,color:T.t2,...mn,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>Loading…</div>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Program Retrospective</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ End-of-program analysis from all stored data · claude-sonnet-4-6</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:result?1000:600,display:result?"grid":"block",gridTemplateColumns:result?"280px 1fr":"1fr",gap:16}}>
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6,marginBottom:8}}>
          {[["Enrolled",ins.length,T.t],["Sessions",outs.length,T.t],["Complete",comp,T.g],["Follow-up",fu,fu?T.r:T.t3],["Avg QC",avgQC+"/7",avgQC>=5?T.g:T.a],["Avg Conf",avgConf+"/5",avgConf>=3.5?T.g:T.a],["Packages",Object.keys(pkgs).length,T.m],["Check-ins",ci.length,T.m]].map(([l,v,c])=><div key={l} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:2,padding:"7px 9px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:500,color:c}}>{v}</div><div style={{...mn,fontSize:8,color:T.t3,marginTop:2}}>{l}</div></div>)}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>Retro Focus</div>
          {[["full","Full Retrospective","Everything: wins, failures, metrics, recommendations"],["wins","Wins & Successes","What worked, who excelled, repeatable patterns"],["risks","Risks & Failures","What went wrong, at-risk employees, lessons learned"],["next","Next Cohort Plan","What to change, keep, add for the next group"]].map(([id,l,d])=><label key={id} onClick={()=>setFocus(id)} style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer",padding:"6px 8px",borderRadius:3,border:`1px solid ${focus===id?T.a:T.b}`,background:focus===id?T.tg:"transparent",marginBottom:4,transition:"all .12s"}}>
            <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${focus===id?T.a:T.t3}`,background:focus===id?T.a:"transparent",flexShrink:0,marginTop:3}} />
            <div><div style={{fontWeight:500,fontSize:12,color:focus===id?T.t:T.t2}}>{l}</div><div style={{fontSize:10,color:T.t3,marginTop:1}}>{d}</div></div>
          </label>)}
        </div>
        <button onClick={generate} disabled={loading||!ins.length} style={{width:"100%",background:"transparent",border:`1px solid ${!loading&&ins.length?T.a:T.h}`,borderRadius:2,color:!loading&&ins.length?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"7px 0",cursor:!loading&&ins.length?"pointer":"not-allowed"}}>{loading?"◌ Analyzing program data…":"Generate Retrospective →"}</button>
        {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:2,padding:"7px 10px",marginTop:6}}><span style={{...mn,fontSize:9,color:T.r}}>✗ {err}</span></div>}
      </div>
      {result&&<div style={{overflowY:"auto",maxHeight:"85vh"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Retrospective</div>
          <div style={{display:"flex",gap:5}}><button onClick={()=>navigator.clipboard.writeText(result).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Copy</button><button onClick={generate} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Regen</button></div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"14px 16px"}}>
          {result.split("\n").map((line,i)=>{
            if(line.startsWith("## "))return<div key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:T.t,marginTop:14,marginBottom:5,paddingBottom:4,borderBottom:`1px solid ${T.b}`}}>{line.replace("## ","")}</div>;
            if(line.startsWith("### "))return<div key={i} style={{fontWeight:500,fontSize:12,color:T.a,marginTop:8,marginBottom:3}}>{line.replace("### ","")}</div>;
            if(line.startsWith("| "))return<div key={i} style={{...mn,fontSize:10,color:T.t2,padding:"2px 0",borderBottom:`1px solid ${T.tg}`}}>{line}</div>;
            if(line.trim().startsWith("- "))return<div key={i} style={{display:"flex",gap:6,fontSize:12,color:T.t2,marginBottom:2,paddingLeft:8}}><span style={{color:T.g}}>◆</span>{line.replace(/^-\s*/,"")}</div>;
            if(!line.trim())return<div key={i} style={{height:5}} />;
            return<div key={i} style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:2}}>{line}</div>;
          })}
        </div>
      </div>}
    </div>
  </div></>;
}
