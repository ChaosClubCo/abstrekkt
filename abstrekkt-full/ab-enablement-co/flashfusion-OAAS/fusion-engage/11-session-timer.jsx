import { useState, useEffect, useRef } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const AGENDA=[
  {id:1,label:"Check-in & login confirm",min:5,phase:"open"},
  {id:2,label:"Review last session / gaps",min:5,phase:"open"},
  {id:3,label:"Walk through prompt package",min:10,phase:"core"},
  {id:4,label:"Live practice — #1 use case",min:15,phase:"core"},
  {id:5,label:"Configure memory or connector",min:5,phase:"setup"},
  {id:6,label:"QC gate walkthrough",min:3,phase:"close"},
  {id:7,label:"Set next session goal + date",min:2,phase:"close"},
];
const QCI=[["q1","Logs in independently",true],["q2","1+ Project with instructions",true],["q3","Memory configured",true],["q4","Prompt package delivered",true],["q5","Connector connected",false],["q6","#1 use case identified",false],["q7","Next session agreed",false]];
const PC={open:T.m,core:T.a,setup:T.g,close:"#b07ab0"};
const fmt=s=>{const m=Math.floor(s/60);const sec=s%60;return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");};
export default function SessionTimer(){
  const [active,setActive]=useState(-1);const [elapsed,setElapsed]=useState(0);const [running,setRunning]=useState(false);
  const [notes,setNotes]=useState({});const [qc,setQc]=useState({});const [totalElapsed,setTotalElapsed]=useState(0);
  const [sessionRunning,setSessionRunning]=useState(false);const iRef=useRef(null);const sRef=useRef(null);
  useEffect(()=>{if(running){iRef.current=setInterval(()=>setElapsed(p=>p+1),1000);return()=>clearInterval(iRef.current);}else{clearInterval(iRef.current);}},[running]);
  useEffect(()=>{if(sessionRunning){sRef.current=setInterval(()=>setTotalElapsed(p=>p+1),1000);return()=>clearInterval(sRef.current);}else{clearInterval(sRef.current);}},[sessionRunning]);
  const startItem=i=>{setActive(i);setElapsed(0);setRunning(true);if(!sessionRunning)setSessionRunning(true);};
  const stopItem=()=>{setRunning(false);};
  const nextItem=()=>{if(active<AGENDA.length-1){startItem(active+1);}else{setRunning(false);setSessionRunning(false);}};
  const togQC=id=>setQc(p=>({...p,[id]:!p[id]}));
  const totalPlanned=AGENDA.reduce((a,i)=>a+i.min,0);
  const qcPassed=Object.values(qc).filter(Boolean).length;
  const copyNotes=()=>{const txt=AGENDA.map((a,i)=>`[${a.label}]\n${notes[i]||"(no notes)"}`).join("\n\n")+`\n\nQC: ${qcPassed}/${QCI.length} passed\n${QCI.map(([id,l])=>`${qc[id]?"✓":"☐"} ${l}`).join("\n")}`;navigator.clipboard.writeText(txt).catch(()=>{});};
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Session Timer</div><div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Live facilitator tool · {totalPlanned} min planned</div></div>
      <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
        <div style={{textAlign:"right"}}><div style={{...mn,fontSize:28,color:sessionRunning?T.a:T.t3,fontWeight:500}}>{fmt(totalElapsed)}</div><div style={{...mn,fontSize:9,color:T.t3}}>TOTAL SESSION</div></div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",height:"calc(100vh - 60px)"}}>
      <div style={{overflowY:"auto",padding:"14px 18px"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>Agenda</div>
        {AGENDA.map((a,i)=>{const isActive=active===i;const itemColor=PC[a.phase]||T.a;const over=isActive&&elapsed>a.min*60;
        return<div key={a.id} style={{background:isActive?T.sf:T.c,border:`1px solid ${isActive?itemColor:T.b}`,borderRadius:3,padding:"10px 13px",marginBottom:5,transition:"all .2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isActive?8:0}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{...mn,fontSize:9,color:itemColor,flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
              <span style={{fontWeight:500,fontSize:12,color:isActive?T.t:T.t2}}>{a.label}</span>
              <span style={{...mn,fontSize:9,color:T.t3}}>{a.min}m</span>
            </div>
            <div style={{display:"flex",gap:4}}>
              {!isActive&&<button onClick={()=>startItem(i)} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Start</button>}
              {isActive&&running&&<button onClick={stopItem} style={{background:"transparent",border:`1px solid ${T.r}`,borderRadius:2,color:T.r,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Pause</button>}
              {isActive&&!running&&<button onClick={()=>setRunning(true)} style={{background:"transparent",border:`1px solid ${T.g}`,borderRadius:2,color:T.g,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Resume</button>}
              {isActive&&<button onClick={nextItem} style={{background:"transparent",border:`1px solid ${T.a}`,borderRadius:2,color:T.a,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>{i<AGENDA.length-1?"Next →":"Finish"}</button>}
            </div>
          </div>
          {isActive&&<>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{...mn,fontSize:22,fontWeight:500,color:over?T.r:itemColor}}>{fmt(elapsed)}</div>
              <div style={{flex:1,height:4,background:T.tg,borderRadius:2}}><div style={{height:4,background:over?T.r:itemColor,borderRadius:2,width:Math.min(100,elapsed/(a.min*60)*100)+"%",transition:"width 1s"}} /></div>
              <span style={{...mn,fontSize:9,color:over?T.r:T.t3}}>{over?"OVER TIME":fmt(a.min*60-elapsed)+" left"}</span>
            </div>
            <textarea value={notes[i]||""} onChange={e=>setNotes(p=>({...p,[i]:e.target.value}))} placeholder="Session notes for this step…" style={{width:"100%",background:T.bg,border:`1px solid ${T.h}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"6px 9px",resize:"vertical",minHeight:48,outline:"none"}} />
          </>}
        </div>;})}
      </div>
      <div style={{borderLeft:`1px solid ${T.b}`,overflowY:"auto",padding:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>QC Gate</div>
        {QCI.map(([id,label,crit])=><div key={id} onClick={()=>togQC(id)} style={{display:"flex",gap:7,alignItems:"flex-start",padding:"6px 8px",borderRadius:2,cursor:"pointer",background:qc[id]?"rgba(90,156,90,.08)":"transparent",marginBottom:3}}>
          <div style={{width:12,height:12,flexShrink:0,marginTop:1,border:`1px solid ${qc[id]?T.g:T.h}`,borderRadius:2,background:qc[id]?"#1a2a1a":"transparent",display:"flex",alignItems:"center",justifyContent:"center",...mn,fontSize:7,color:T.g}}>{qc[id]?"◆":""}</div>
          <span style={{fontSize:11,color:qc[id]?T.t2:T.t,textDecoration:qc[id]?"line-through":"none"}}>{label}{crit&&<span style={{color:T.r,...mn,fontSize:8}}> ★</span>}</span>
        </div>)}
        <div style={{...mn,fontSize:9,color:T.t3,marginTop:5,marginBottom:14}}>★ critical · {qcPassed}/{QCI.length}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Session Notes</div>
        {AGENDA.map((a,i)=>notes[i]?<div key={i} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:2,padding:"6px 9px",marginBottom:4}}>
          <div style={{...mn,fontSize:8,color:PC[a.phase]||T.t3,marginBottom:2}}>{a.label}</div>
          <div style={{fontSize:11,color:T.t2}}>{notes[i]}</div>
        </div>:null)}
        <div style={{marginTop:10}}><button onClick={copyNotes} style={{width:"100%",background:"transparent",border:`1px solid ${T.a}`,borderRadius:2,color:T.a,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 0",cursor:"pointer"}}>Copy All Notes + QC</button></div>
      </div>
    </div>
  </div></>;
}
