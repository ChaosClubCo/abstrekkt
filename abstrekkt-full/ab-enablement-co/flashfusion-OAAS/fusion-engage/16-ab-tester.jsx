import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const api=async(msgs,max=1000,sys,model="claude-sonnet-4-6")=>{const b={model,max_tokens:max,messages:msgs};if(sys)b.system=sys;const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");};
export default function ABTester(){
  const [promptA,setPromptA]=useState("");const [promptB,setPromptB]=useState("");const [scenario,setScenario]=useState("");
  const [resA,setResA]=useState("");const [resB,setResB]=useState("");const [scoreA,setScoreA]=useState(null);const [scoreB,setScoreB]=useState(null);
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const run=async()=>{
    if(!promptA.trim()||!promptB.trim()||!scenario.trim())return;
    setLoading(true);setErr("");setResA("");setResB("");setScoreA(null);setScoreB(null);
    try{
      const[a,b]=await Promise.all([api([{role:"user",content:scenario}],800,promptA),api([{role:"user",content:scenario}],800,promptB)]);
      setResA(a);setResB(b);
      const evalSys=`You are a prompt quality evaluator. Score each response 1-5 on: accuracy, clarity, conciseness, usefulness, format. Return ONLY JSON no fences: {"a":{"accuracy":N,"clarity":N,"conciseness":N,"usefulness":N,"format":N,"total":N,"notes":""},"b":{"accuracy":N,"clarity":N,"conciseness":N,"usefulness":N,"format":N,"total":N,"notes":""},"winner":"a or b or tie","reasoning":"one sentence"}`;
      const evalMsg=`Scenario: "${scenario}"\n\nPrompt A system prompt:\n${promptA}\n\nResponse A:\n${a}\n\nPrompt B system prompt:\n${promptB}\n\nResponse B:\n${b}\n\nEvaluate both.`;
      const evalRaw=await api([{role:"user",content:evalMsg}],500,evalSys);
      const parsed=JSON.parse(evalRaw.replace(/```json|```/g,"").trim());
      setScoreA(parsed.a);setScoreB(parsed.b);
    }catch(e){setErr(e.message);}
    setLoading(false);
  };
  const ScoreCard=({label,score,color})=>score?<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
    {Object.entries(score).filter(([k])=>!["total","notes"].includes(k)).map(([k,v])=><div key={k} style={{background:T.sf,borderRadius:2,padding:"3px 7px",textAlign:"center"}}><div style={{fontSize:12,fontWeight:500,color:v>=4?T.g:v>=3?T.a:T.r}}>{v}</div><div style={{...mn,fontSize:7,color:T.t3}}>{k}</div></div>)}
    <div style={{background:color+"20",border:`1px solid ${color}`,borderRadius:2,padding:"3px 9px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:600,color}}>{score.total}</div><div style={{...mn,fontSize:7,color:T.t3}}>TOTAL</div></div>
  </div>:null;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Prompt A/B Tester</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Same scenario, two system prompts, AI-scored comparison</div>
    </div>
    <div style={{padding:"14px 18px"}}>
      <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
        <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:4}}>Test Scenario (user message sent to both prompts)</div>
        <textarea value={scenario} onChange={e=>setScenario(e.target.value)} placeholder="e.g. Write a follow-up email after a sales discovery call" style={{width:"100%",background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"7px 9px",resize:"vertical",minHeight:52,outline:"none"}} />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
        {[["A",promptA,setPromptA,resA,scoreA,T.m],["B",promptB,setPromptB,resB,scoreB,T.a]].map(([label,prompt,setPrompt,res,score,color])=><div key={label}>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 13px",marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{...mn,fontSize:9,color,letterSpacing:"0.1em"}}>PROMPT {label}</div>
              {score&&<div style={{...mn,fontSize:11,fontWeight:500,color}}>{score.total}/25</div>}
            </div>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={`System prompt ${label}…`} rows={5} style={{width:"100%",background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,color:T.t,...mn,fontSize:11,padding:"7px 9px",resize:"vertical",outline:"none"}} />
          </div>
          {res&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 13px"}}>
            <div style={{...mn,fontSize:9,color:T.t3,marginBottom:4}}>RESPONSE {label}</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.6,whiteSpace:"pre-wrap",maxHeight:200,overflowY:"auto"}}>{res}</div>
            <ScoreCard label={label} score={score} color={color} />
            {score?.notes&&<div style={{fontSize:10,color:T.t3,marginTop:5,fontStyle:"italic"}}>{score.notes}</div>}
          </div>}
        </div>)}
      </div>
      {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:2,padding:"7px 10px",marginBottom:7}}><span style={{...mn,fontSize:9,color:T.r}}>✗ {err}</span></div>}
      <div style={{display:"flex",justifyContent:"center",gap:8}}>
        <button onClick={run} disabled={loading||!promptA.trim()||!promptB.trim()||!scenario.trim()} style={{background:"transparent",border:`1px solid ${!loading&&promptA.trim()&&promptB.trim()&&scenario.trim()?T.a:T.h}`,borderRadius:2,color:!loading?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"6px 18px",cursor:loading?"not-allowed":"pointer"}}>{loading?"◌ Running both prompts + evaluating…":"Run A/B Test →"}</button>
      </div>
      {scoreA&&scoreB&&<div style={{background:T.sf,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 14px",marginTop:10,textAlign:"center"}}>
        <div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>WINNER</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:scoreA.total>scoreB.total?T.m:scoreA.total<scoreB.total?T.a:T.g}}>{scoreA.total>scoreB.total?"Prompt A":scoreA.total<scoreB.total?"Prompt B":"Tie"}</div>
        <div style={{fontSize:11,color:T.t2,marginTop:4}}>A: {scoreA.total}/25 vs B: {scoreB.total}/25 · Δ{Math.abs(scoreA.total-scoreB.total)}</div>
      </div>}
    </div>
  </div></>;
}
