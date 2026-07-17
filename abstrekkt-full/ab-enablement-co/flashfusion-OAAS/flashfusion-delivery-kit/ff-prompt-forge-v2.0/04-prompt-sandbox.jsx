import { useState, useEffect, useRef } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const api=async(msgs,max=1500,sys)=>{
  const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);
  return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");
};
const STARTER_PROMPTS=[
  {name:"Email Drafter",category:"Writing",prompt:"You are an expert business email writer.\n\n<task>Draft a professional email for the following situation:</task>\n<situation>{describe your situation here}</situation>\n<tone>Professional but direct</tone>\n<length>Under 150 words</length>"},
  {name:"Meeting Notes → Action Items",category:"Operations",prompt:"You are a meeting notes analyst.\n\n<transcript>{paste meeting notes or transcript here}</transcript>\n\nExtract:\n1. Key decisions made\n2. Action items (owner + deadline)\n3. Open questions\n4. Next meeting agenda suggestions\n\nFormat clearly. Be concise."},
  {name:"Document Summarizer",category:"Research",prompt:"Summarize the following document for a busy executive.\n\n<document>{paste document here}</document>\n\nProvide:\n- 3-sentence executive summary\n- 5 key points (bullets)\n- One recommended action\n\nMax 200 words total."},
  {name:"SOP Writer",category:"Operations",prompt:"Write a standard operating procedure for:\n\n<process>{describe the process}</process>\n<team>{who performs this}</team>\n<frequency>{how often}</frequency>\n\nFormat: numbered steps, max 15 steps. Include a \"When to escalate\" section at the end."},
  {name:"Code Reviewer",category:"Technical",prompt:"Review the following code for quality, bugs, and improvements.\n\n<code>\n{paste code here}\n</code>\n\nReport:\n1. Critical issues (if any)\n2. Potential bugs\n3. Suggested improvements (top 3)\n4. Overall quality rating 1-10 with brief justification"},
];
export default function PromptSandbox(){
  const [prompts,setPrompts]=useState(STARTER_PROMPTS);const [sel,setSel]=useState(null);
  const [sys,setSys]=useState("");const [input,setInput]=useState("");
  const [msgs,setMsgs]=useState([]);const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");const [packages,setPackages]=useState({});const [pkgSel,setPkgSel]=useState("");
  const threadRef=useRef(null);
  useEffect(()=>{ld("prompt-packages-v1").then(p=>{if(p)setPackages(p);});},[]);
  const allPrompts=[...prompts,...Object.values(packages).flatMap(pkg=>(pkg.prompts||[]).map(p=>({...p,fromPackage:true})))];
  const loadPrompt=p=>{setSel(p);setInput(p.prompt);setSys("");setMsgs([]);setErr("");};
  const send=async()=>{
    const txt=input.trim();if(!txt||loading)return;
    const um={role:"user",content:txt};const next=[...msgs,um];
    setMsgs(next);setLoading(true);setErr("");
    try{const reply=await api(next,1500,sys||undefined);setMsgs([...next,{role:"assistant",content:reply}]);}
    catch(e){setErr(e.message);setMsgs([...next,{role:"assistant",content:"Error: "+e.message,error:true}]);}
    setLoading(false);
    setTimeout(()=>{if(threadRef.current)threadRef.current.scrollTop=threadRef.current.scrollHeight;},50);
  };
  const clear=()=>{setMsgs([]);setInput(sel?.prompt||"");setErr("");};
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`,flexShrink:0}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Prompt Testing Sandbox</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Live practice · Sonnet 4.6 · multi-turn</div>
    </div>
    <div style={{flex:1,display:"grid",gridTemplateColumns:"240px 1fr",overflow:"hidden"}}>
      <div style={{borderRight:`1px solid ${T.b}`,overflowY:"auto",padding:"10px"}}>
        <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:7}}>Starter Prompts</div>
        {allPrompts.map((p,i)=><div key={i} onClick={()=>loadPrompt(p)} style={{padding:"6px 8px",borderRadius:2,cursor:"pointer",marginBottom:3,border:`1px solid ${sel===p?T.a:T.b}`,background:sel===p?T.tg:"transparent",transition:"all .12s"}}>
          <div style={{fontSize:11,fontWeight:500,color:sel===p?T.t:T.t2}}>{p.name}</div>
          <div style={{...mn,fontSize:9,color:T.t3,marginTop:1}}>{p.category}{p.fromPackage?" · pkg":""}</div>
        </div>)}
        {Object.keys(packages).length>0&&<div style={{...mn,fontSize:9,color:T.g,marginTop:8}}>◆ {Object.values(packages).reduce((a,p)=>a+(p.prompts?.length||0),0)} package prompts loaded</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,flexShrink:0}}>
          <div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>SYSTEM PROMPT (optional)</div>
          <input value={sys} onChange={e=>setSys(e.target.value)} placeholder="You are an expert…" style={{width:"100%",padding:"5px 8px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:11,...mn,background:T.sf,color:T.t,outline:"none"}} />
        </div>
        <div ref={threadRef} style={{flex:1,overflowY:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:8}}>
          {!msgs.length&&<div style={{...mn,fontSize:10,color:T.t3,textAlign:"center",paddingTop:20}}>Select a prompt from the sidebar or write your own below. Hit Enter or Send.</div>}
          {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{padding:"8px 11px",borderRadius:3,fontSize:12,lineHeight:1.65,whiteSpace:"pre-wrap",maxWidth:"82%",background:m.role==="user"?"rgba(212,137,58,.1)":T.c,border:`1px solid ${m.role==="user"?"rgba(212,137,58,.2)":T.b}`,color:m.error?T.r:T.t}}>{m.content}</div>
          </div>)}
          {loading&&<div style={{display:"flex"}}><div style={{padding:"8px 11px",borderRadius:3,fontSize:12,background:T.c,border:`1px solid ${T.b}`,color:T.t3,...mn}}>◌ Thinking…</div></div>}
        </div>
        {err&&<div style={{padding:"6px 14px",background:"rgba(192,80,80,.06)",borderTop:`1px solid rgba(192,80,80,.2)`}}><span style={{...mn,fontSize:9,color:T.r}}>✗ {err}</span></div>}
        <div style={{padding:"10px 14px",borderTop:`1px solid ${T.b}`,flexShrink:0}}>
          <div style={{display:"flex",gap:6}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault();send();}}} placeholder={sel?"Edit the prompt above, then send…":"Write or paste a prompt…"} style={{flex:1,background:T.sf,border:`1px solid ${T.h}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"7px 9px",resize:"none",height:72,outline:"none"}} />
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <button onClick={send} disabled={!input.trim()||loading} style={{background:"transparent",border:`1px solid ${input.trim()&&!loading?T.a:T.h}`,borderRadius:2,color:input.trim()&&!loading?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 12px",cursor:input.trim()&&!loading?"pointer":"not-allowed",flex:1}}>Send</button>
              <button onClick={clear} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"4px 8px",cursor:"pointer"}}>Clear</button>
            </div>
          </div>
          <div style={{...mn,fontSize:9,color:T.t3,marginTop:5}}>⌘↵ to send · Multi-turn — history persists until Clear · Prompts pulled from your packages</div>
        </div>
      </div>
    </div>
  </div></>;
}
