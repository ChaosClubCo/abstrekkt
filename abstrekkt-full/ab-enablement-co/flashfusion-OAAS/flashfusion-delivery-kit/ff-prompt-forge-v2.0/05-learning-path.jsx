import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const sv=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
const api=async(msgs,max,sys)=>{
  const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);
  return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");
};
const WKCOLORS=["var(--a)","var(--m)","var(--g)","#b07ab0"];
export default function LearningPath(){
  const [intakes,setIntakes]=useState([]);const [sel,setSel]=useState("");const [packages,setPackages]=useState({});
  const [paths,setPaths]=useState({});const [loading,setLoading]=useState(false);const [err,setErr]=useState("");const [ready,setReady]=useState(false);
  useEffect(()=>{Promise.all([ld("intake-records-v1"),ld("prompt-packages-v1"),ld("learning-paths-v1")]).then(([i,p,lp])=>{const ins=i||[];setIntakes(ins);setPackages(p||{});setPaths(lp||{});if(ins.length)setSel(f(ins[0],"n","name"));setReady(true);});},[]);
  const emp=intakes.find(i=>f(i,"n","name")===sel);const pkg=packages[sel];const path=paths[sel];
  const generate=async()=>{
    if(!emp)return;setLoading(true);setErr("");
    const role=f(emp,"r","role");const lit=f(emp,"li","literacy");const pains=(emp?.pa||emp?.pains||[]).join(", ");
    const ucs=pkg?pkg.prompts?.map(p=>p.name).join(", "):"not yet built";
    const sys=`You are an AI enablement learning designer. Build personalized 4-week learning paths. Return ONLY valid JSON — no markdown fences, no commentary.`;
    const prompt=`Build a personalized 4-week Claude learning path.\nEmployee: ${f(emp,"n","name")} · ${role}\nLiteracy: ${lit}\nTime drains: ${pains||"not specified"}\nPrompt package topics: ${ucs}\n\nReturn JSON: {"weeks":[{"week":1,"title":"","theme":"","days":[{"day":"Mon/Wed/Fri","task":"","time_min":10,"category":""}],"milestone":"","success_metric":""}]} — 4 weeks, 3 days each, 10-15 min tasks. Week 1=Foundation, Week 2=Practice, Week 3=Integrate, Week 4=Optimize.`;
    try{
      const txt=await api([{role:"user",content:prompt}],2000,sys);
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      const next={...paths,[sel]:{...parsed,employeeName:sel,createdAt:new Date().toISOString()}};
      setPaths(next);await sv("learning-paths-v1",next);
    }catch(e){setErr(e.message);}
    setLoading(false);
  };
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Learning Path Builder</div><div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Personalized 4-week roadmap · claude-sonnet-4-6</div></div>
      {intakes.length>0&&<select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"5px 8px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,outline:"none",...mn}}>{intakes.map(i=><option key={f(i,"id")||f(i,"n","name")} value={f(i,"n","name")}>{f(i,"n","name")}</option>)}</select>}
    </div>
    <div style={{padding:"14px 18px",maxWidth:860}}>
      {!ready?<div style={{...mn,fontSize:10,color:T.t2}}>Loading…</div>:!intakes.length?<div style={{...mn,fontSize:11,color:T.t2}}>No intakes found. Add employees in the Facilitator Suite first.</div>:<>
        {emp&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>{f(emp,"n","name")}</div>
            <span style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:9,padding:"1px 5px",color:T.m}}>{(f(emp,"pl","plan")||"?").toUpperCase()}</span>
            <span style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:9,padding:"1px 5px",color:T.a}}>{f(emp,"li","literacy")||"?"}</span>
            <span style={{fontSize:11,color:T.t2}}>{f(emp,"r","role")}</span>
          </div>
          <button onClick={generate} disabled={loading} style={{background:"transparent",border:`1px solid ${T.a}`,borderRadius:2,color:T.a,...mn,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",padding:"5px 12px",cursor:loading?"not-allowed":"pointer"}}>{loading?"◌ Building path…":path?"Regenerate":"Build Learning Path →"}</button>
        </div>}
        {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:3,padding:"8px 12px",marginBottom:8}}><span style={{...mn,fontSize:10,color:T.r}}>✗ {err}</span></div>}
        {!path&&!loading&&emp&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"24px",textAlign:"center"}}>
          <div style={{...mn,fontSize:9,color:T.t3,marginBottom:6}}>◆ NO PATH BUILT YET</div>
          <div style={{fontSize:13,color:T.t2,marginBottom:12}}>Generate a personalized 4-week roadmap based on {f(emp,"n","name")}'s role, literacy level, and time drains.</div>
          <div style={{fontSize:11,color:T.t3}}>{pkg?`✓ Prompt package loaded (${pkg.prompts?.length||0} prompts)`:"⚠ No prompt package yet — build one in Prompts tab for richer path"}</div>
        </div>}
        {path?.weeks&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {path.weeks.map((wk,wi)=><div key={wi} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,overflow:"hidden"}}>
              <div style={{background:T.sf,borderBottom:`1px solid ${T.b}`,padding:"8px 12px"}}>
                <div style={{...mn,fontSize:9,color:WKCOLORS[wi],marginBottom:2}}>WEEK {wk.week}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,color:T.t}}>{wk.title}</div>
                <div style={{fontSize:11,color:T.t3,marginTop:2}}>{wk.theme}</div>
              </div>
              <div style={{padding:"8px 12px"}}>
                {(wk.days||[]).map((d,di)=><div key={di} style={{padding:"6px 0",borderBottom:di<(wk.days?.length||0)-1?`1px solid ${T.tg}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{...mn,fontSize:9,color:T.t3}}>{d.day}</span><span style={{...mn,fontSize:9,color:WKCOLORS[wi]}}>{d.time_min}min</span></div>
                  <div style={{fontSize:11,color:T.t2}}>{d.task}</div>
                  <div style={{...mn,fontSize:8,color:T.t3,marginTop:1}}>{d.category}</div>
                </div>)}
                <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${T.b}`}}>
                  <div style={{...mn,fontSize:9,color:T.t3,marginBottom:2}}>MILESTONE</div>
                  <div style={{fontSize:11,color:WKCOLORS[wi]}}>{wk.milestone}</div>
                </div>
              </div>
            </div>)}
          </div>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 14px",marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{...mn,fontSize:9,color:T.t3}}>Generated {new Date(path.createdAt).toLocaleDateString()} · {path.weeks?.length} weeks · ~{path.weeks?.reduce((a,w)=>a+(w.days?.reduce((a2,d)=>a2+(d.time_min||0),0)||0),0)} min total</span>
            <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(path,null,2)).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Export JSON</button>
          </div>
        </div>}
      </>}
    </div>
  </div></>;
}
