import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const api=async(msgs,max=2500,sys)=>{const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");};
export default function HandoffDoc(){
  const [ins,setIns]=useState([]);const [outs,setOuts]=useState([]);const [ci,setCi]=useState([]);const [pkgs,setPkgs]=useState({});
  const [rdy,setRdy]=useState(false);const [result,setResult]=useState("");const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [client,setClient]=useState("");const [facilitator,setFacilitator]=useState("FlashFusion Enablement Team");
  useEffect(()=>{Promise.all([ld("intake-records-v1"),ld("outcome-records-v1"),ld("checkin-records-v1"),ld("prompt-packages-v1")]).then(([a,b,c,d])=>{setIns(a||[]);setOuts(b||[]);setCi(c||[]);setPkgs(d||{});setRdy(true);});},[]);
  const comp=outs.filter(o=>f(o,"st","status")==="Completed").length;
  const pro=outs.filter(o=>["pro","max","team","enterprise"].includes(f(o,"pl","plan"))).length;
  const qcAvg=outs.length?Math.round(outs.reduce((a,o)=>a+Object.values(o.qc||{}).filter(Boolean).length,0)/outs.length*10)/10:0;
  const avgConf=ci.length?Math.round(ci.reduce((a,c2)=>a+(+f(c2,"conf","confidence")||0),0)/ci.length*10)/10:0;
  const generate=async()=>{
    setLoading(true);setErr("");setResult("");
    const sys=`You are a B2B AI enablement consultant writing a client handoff document. Write a comprehensive but scannable document that the client's internal team can use to maintain the AI program independently after the engagement ends. Professional but direct. Use markdown headers and tables.`;
    const data={enrolled:ins.length,sessions:outs.length,completed:comp,proPlus:pro,avgQC:qcAvg,avgConfidence:avgConf,checkins:ci.length,packages:Object.keys(pkgs).length,
      employees:ins.map(e=>({name:f(e,"n","name"),role:f(e,"r","role"),plan:f(e,"pl","plan"),literacy:f(e,"li","literacy")})),
      recentWins:ci.filter(c2=>f(c2,"win","biggestWin")).slice(0,5).map(c2=>({name:f(c2,"nm","name"),win:f(c2,"win","biggestWin")})),
      openGaps:outs.filter(o=>f(o,"ga","gaps","openGaps")).map(o=>({name:f(o,"n","name","employeeName"),gap:f(o,"ga","gaps","openGaps")})),
    };
    const prompt=`Generate a complete Client Handoff Document.\n\nClient: ${client||"[Client Name]"}\nFacilitator: ${facilitator}\nProgram Data: ${JSON.stringify(data)}\n\nDocument Structure:\n## Executive Summary (3-4 sentences: what we did, what was achieved, what happens next)\n## Program Results (table: metric, value, benchmark)\n## Employee Status (table: name, role, plan, QC score, status)\n## What's Working (top wins from check-ins)\n## Open Items (unresolved gaps, at-risk employees)\n## Maintenance Guide (how to continue without FlashFusion: weekly check-in rhythm, QC gate process, when to bring us back)\n## Recommended Next Steps (3-5 specific actions for the client's internal team)\n## Appendix: Prompt Packages Delivered (list by employee)\n\nKeep under 1200 words. Data-driven, not aspirational.`;
    try{const r=await api([{role:"user",content:prompt}],2500,sys);setResult(r);}catch(e){setErr(e.message);}
    setLoading(false);
  };
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Handoff Document Generator</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ End-of-engagement deliverable · reads all program data · claude-sonnet-4-6</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:result?1100:600,display:result?"grid":"block",gridTemplateColumns:result?"320px 1fr":"1fr",gap:16}}>
      <div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Client Name</div>
          <input value={client} onChange={e=>setClient(e.target.value)} placeholder="Acme Corp" style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,outline:"none",fontFamily:"'IBM Plex Sans',sans-serif",marginBottom:7}} />
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Facilitator</div>
          <input value={facilitator} onChange={e=>setFacilitator(e.target.value)} style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,outline:"none",fontFamily:"'IBM Plex Sans',sans-serif"}} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6,marginBottom:7}}>
          {[["Enrolled",ins.length,T.t],["Sessions",outs.length,T.t],["Complete",comp,T.g],["Avg QC",qcAvg+"/7",T.a],["Packages",Object.keys(pkgs).length,T.m],["Check-ins",ci.length,T.m],["Pro+",pro,T.m],["Avg Conf",avgConf+"/5",avgConf>=3.5?T.g:T.a]].map(([l,v,c])=><div key={l} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:2,padding:"7px 9px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:500,color:c}}>{v}</div><div style={{...mn,fontSize:8,color:T.t3,marginTop:2}}>{l}</div></div>)}
        </div>
        <button onClick={generate} disabled={loading||!ins.length} style={{width:"100%",background:"transparent",border:`1px solid ${ins.length&&!loading?T.a:T.h}`,borderRadius:2,color:ins.length&&!loading?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"7px 0",cursor:ins.length&&!loading?"pointer":"not-allowed"}}>{loading?"◌ Generating document…":"Generate Handoff Document →"}</button>
        {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:2,padding:"7px 10px",marginTop:6}}><span style={{...mn,fontSize:9,color:T.r}}>✗ {err}</span></div>}
      </div>
      {result&&<div style={{overflowY:"auto",maxHeight:"85vh"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Handoff Document — {client||"Client"}</div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>navigator.clipboard.writeText(result).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Copy MD</button>
            <button onClick={generate} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Regenerate</button>
          </div>
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
