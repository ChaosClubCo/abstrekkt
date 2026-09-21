import { useState, useEffect } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const f=(r,...k)=>{for(const key of k)if(r[key]!=null)return r[key];return"";};
function Bar({pct,color,height=8}){return <div style={{background:T.tg,borderRadius:2,height,flex:1}}><div style={{height,background:color||T.a,borderRadius:2,width:Math.min(100,Math.max(0,pct))+"%",transition:"width .4s"}} /></div>;}
function Stat({label,value,sub,color}){return <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 12px"}}><div style={{fontSize:22,fontWeight:500,color:color||T.t,fontFamily:"'Playfair Display',serif"}}>{value}</div><div style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t3,marginTop:3}}>{label}</div>{sub&&<div style={{fontSize:10,color:T.t2,marginTop:2}}>{sub}</div>}</div>;}
export default function Analytics(){
  const [ins,setIns]=useState([]);const [outs,setOuts]=useState([]);const [ci,setCi]=useState([]);const [pkgs,setPkgs]=useState({});const [ready,setReady]=useState(false);const [tab,setTab]=useState("overview");
  useEffect(()=>{Promise.all([ld("intake-records-v1"),ld("outcome-records-v1"),ld("checkin-records-v1"),ld("prompt-packages-v1")]).then(([i,o,c,p])=>{setIns(i||[]);setOuts(o||[]);setCi(c||[]);setPkgs(p||{});setReady(true);});},[]);
  if(!ready)return<div style={{minHeight:"100vh",background:T.bg,color:T.t2,...mn,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>Loading analytics…</div>;
  const comp=outs.filter(o=>f(o,"st","status")==="Completed").length;
  const compPct=outs.length?Math.round(comp/outs.length*100):0;
  const pro=outs.filter(o=>["pro","max","team","enterprise"].includes(f(o,"pl","plan"))).length;
  const proPct=ins.length?Math.round(pro/ins.length*100):0;
  const fu=outs.filter(o=>f(o,"st","status")==="Needs Follow-up").length;
  const avgConf=ci.length?Math.round(ci.reduce((a,c)=>a+(+f(c,"conf","confidence")||0),0)/ci.length*10)/10:0;
  const litDist=Object.entries(ins.reduce((a,i)=>{const l=f(i,"li","literacy")||"unknown";a[l]=(a[l]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);
  const qcDist=outs.reduce((a,o)=>{const n=Object.values(o.qc||{}).filter(Boolean).length;a[n]=(a[n]||0)+1;return a;},{});
  const planDist=Object.entries(ins.reduce((a,i)=>{const p=f(i,"pl","plan")||"unknown";a[p]=(a[p]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);
  const freqDist=Object.entries(ci.reduce((a,c)=>{const fr=f(c,"fr","frequency")||"?";a[fr]=(a[fr]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);
  const FREQ_LABELS={daily:"Daily",few_week:"Few/week",once_week:"Weekly",once_few:"Occasional",not_yet:"Not yet"};
  const recentCi=[...ci].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const recentOut=[...outs].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const TABS=[["overview","Overview"],["adoption","Adoption"],["quality","Quality"],["engagement","Engagement"]];
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Program Analytics</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ {ins.length} employees · {outs.length} sessions · {ci.length} check-ins · {Object.keys(pkgs).length} packages</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"0 18px"}}>{TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===id?T.a:"transparent"}`,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,fontWeight:500,padding:"8px 11px",color:tab===id?T.t:T.t2,marginBottom:-1,transition:"color .12s,border-color .12s"}}>{l}</button>)}</div>
    <div style={{padding:"14px 18px",maxWidth:860}}>
      {tab==="overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
          <Stat label="Enrolled" value={ins.length} />
          <Stat label="Sessions" value={outs.length} />
          <Stat label="Completion" value={compPct+"%"} color={compPct>=70?T.g:compPct>=40?T.a:T.r} sub={comp+" complete"} />
          <Stat label="Follow-up" value={fu} color={fu>0?T.r:T.t3} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:10}}>
          <Stat label="Pro+ Plan" value={proPct+"%"} color={T.m} sub={pro+" on paid plan"} />
          <Stat label="Packages Built" value={Object.keys(pkgs).length} color={T.a} />
          <Stat label="Avg Confidence" value={avgConf||"—"} color={avgConf>=4?T.g:avgConf>=3?T.a:T.r} sub="from check-ins (1-5)" />
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Recent Sessions</div>
          {recentOut.length?recentOut.map((o,i)=>{const st=f(o,"st","status");const sc={Completed:T.g,"In Progress":T.m,"Needs Follow-up":T.a,"No Show":T.r,Scheduled:T.m};return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<recentOut.length-1?`1px solid ${T.tg}`:"none"}}><div><div style={{fontWeight:500,fontSize:12}}>{f(o,"n","name","employeeName")}</div><div style={{...mn,fontSize:9,color:T.t3}}>{f(o,"dt","sessionDate")||"—"}</div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{...mn,fontSize:9,color:T.t2}}>{Object.values(o.qc||{}).filter(Boolean).length}/7 QC</div><span style={{...mn,fontSize:9,color:sc[st]||T.t2}}>{st}</span></div></div>);}:<div style={{...mn,fontSize:10,color:T.t3}}>No sessions yet</div>}
        </div>
      </>}
      {tab==="adoption"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Literacy Distribution</div>
            {litDist.length?litDist.map(([l,n])=><div key={l} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:T.t2,textTransform:"capitalize"}}>{l}</span><span style={{...mn,fontSize:9,color:T.a}}>{n} ({Math.round(n/ins.length*100)}%)</span></div><Bar pct={n/ins.length*100} color={T.a} /></div>):<div style={{...mn,fontSize:10,color:T.t3}}>No data</div>}
          </div>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Plan Distribution</div>
            {planDist.length?planDist.map(([l,n])=><div key={l} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{...mn,fontSize:10,color:T.m,textTransform:"uppercase"}}>{l}</span><span style={{...mn,fontSize:9,color:T.t2}}>{n} ({Math.round(n/ins.length*100)}%)</span></div><Bar pct={n/ins.length*100} color={T.m} /></div>):<div style={{...mn,fontSize:10,color:T.t3}}>No data</div>}
          </div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Claude Usage Frequency (Check-ins)</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
            {["daily","few_week","once_week","once_few","not_yet"].map(fr=>{const n=freqDist.find(([k])=>k===fr)?.[1]||0;const pct=ci.length?Math.round(n/ci.length*100):0;return<div key={fr} style={{textAlign:"center"}}><div style={{background:T.sf,borderRadius:2,padding:"10px 6px"}}><div style={{fontSize:18,fontWeight:500,color:fr==="not_yet"?T.r:fr==="daily"?T.g:T.a}}>{n}</div><div style={{...mn,fontSize:8,color:T.t3,marginTop:2,textTransform:"uppercase"}}>{FREQ_LABELS[fr]||fr}</div></div><div style={{...mn,fontSize:9,color:T.t3,marginTop:3}}>{pct}%</div></div>;})}
          </div>
        </div>
      </>}
      {tab==="quality"&&<>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:8}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>QC Score Distribution (0-7)</div>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:80}}>
            {[0,1,2,3,4,5,6,7].map(n=>{const count=qcDist[n]||0;const max=Math.max(...Object.values(qcDist),1);return<div key={n} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{...mn,fontSize:8,color:T.t3}}>{count}</div><div style={{width:"100%",background:n>=5?T.g:n>=3?T.a:T.r,borderRadius:"2px 2px 0 0",height:count?Math.max(8,count/max*60):0,transition:"height .3s"}} /><div style={{...mn,fontSize:8,color:T.t3}}>{n}</div></div>;})}
          </div>
          <div style={{...mn,fontSize:9,color:T.t3,marginTop:6}}>Critical QC items: q1-q4 (login, project, memory, prompts)</div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Open Gaps by Session</div>
          {outs.filter(o=>f(o,"ga","gaps","openGaps")).slice(0,6).map((o,i)=><div key={i} style={{padding:"6px 0",borderBottom:i<5?`1px solid ${T.tg}`:"none"}}><div style={{...mn,fontSize:9,color:T.t3,marginBottom:1}}>{f(o,"n","name","employeeName")}</div><div style={{fontSize:11,color:T.a}}>{f(o,"ga","gaps","openGaps")}</div></div>)}
          {!outs.filter(o=>f(o,"ga","gaps","openGaps")).length&&<div style={{...mn,fontSize:10,color:T.t3}}>No open gaps logged</div>}
        </div>
      </>}
      {tab==="engagement"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Check-in Confidence (1-5)</div>
            {[5,4,3,2,1].map(n=>{const cnt=ci.filter(c=>(+f(c,"conf","confidence"))||0===n).length;return<div key={n} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}><span style={{...mn,fontSize:9,color:T.t3,flexShrink:0,width:12}}>{n}</span><Bar pct={ci.length?cnt/ci.length*100:0} color={n>=4?T.g:n>=3?T.a:T.r} /><span style={{...mn,fontSize:9,color:T.t3,flexShrink:0,width:20}}>{cnt}</span></div>;})}
          </div>
          <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Recent Check-ins</div>
            {recentCi.length?recentCi.map((c,i)=><div key={i} style={{padding:"5px 0",borderBottom:i<recentCi.length-1?`1px solid ${T.tg}`:"none"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:500}}>{f(c,"nm","name")}</span><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(n=><div key={n} style={{width:6,height:6,borderRadius:"50%",background:n<=(+f(c,"conf","confidence")||0)?T.a:T.b}} />)}</div></div><div style={{fontSize:10,color:T.t3,...mn}}>{c.weekOf}</div></div>):<div style={{...mn,fontSize:10,color:T.t3}}>No check-ins yet</div>}
          </div>
        </div>
        {ci.filter(c=>f(c,"win","biggestWin")).length>0&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:7}}>Recent Wins</div>
          {ci.filter(c=>f(c,"win","biggestWin")).slice(0,5).map((c,i)=><div key={i} style={{padding:"6px 0",borderBottom:i<4?`1px solid ${T.tg}`:"none"}}><div style={{...mn,fontSize:9,color:T.g,marginBottom:1}}>◆ {f(c,"nm","name")} · {c.weekOf}</div><div style={{fontSize:11,color:T.t2}}>{f(c,"win","biggestWin")}</div></div>)}
        </div>}
      </>}
    </div>
  </div></>;
}
