/**
 * Claude Enablement Suite — 07: Program Health Report
 * Design: Reading Room at Midnight — Variant B
 * Reads: intake-records-v1, outcome-records-v1, checkin-records-v1, prompt-packages-v1
 */
import { useState, useEffect, useRef } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",red:"#c05050",mono2:"#78afc8",tag:"#1e1e1a",mono:"#7ab878"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25);color:#ddd8ce}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;

const Eyebrow=({children,color,style={}})=><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;
const Mono=({children,size=11,color,style={}})=><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:size,color:color||T.text2,...style}}>{children}</span>;
const Tag=({children,color})=><span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:color||T.text2,padding:"2px 7px",display:"inline-block"}}>{children}</span>;
const Card=({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"18px 22px",...style}}>{children}</div>;
const Btn=({children,onClick,disabled,accent,style={}})=><button onClick={onClick} disabled={disabled} style={{background:"transparent",borderRadius:2,cursor:disabled?"not-allowed":"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",transition:"border-color 0.15s,color 0.15s",border:`1px solid ${accent&&!disabled?T.accent:T.borderHi}`,color:disabled?T.text3:accent?T.accent:T.text2,...style}}>{children}</button>;
const Heading=({children,size=22})=><div style={{fontFamily:"'Playfair Display',serif",fontSize:size,fontWeight:700,color:T.text}}>{children}</div>;

const SC={"Completed":"#5a9c5a","In Progress":"#78afc8","Scheduled":"#78afc8","Needs Follow-up":"#d4893a","No Show":"#c05050"};
const PC={free:"#3a3835",pro:"#78afc8",max:"#d4893a",team:"#7ab878",enterprise:"#807c74",unknown:"#3a3835"};
const FG={daily:"\u25C6\u25C6\u25C6",few_week:"\u25C6\u25C6",once_week:"\u25C6",once_few:"\u25C7",not_yet:"\u2014"};
const FC={daily:"#5a9c5a",few_week:"#5a9c5a",once_week:"#78afc8",once_few:"#d4893a",not_yet:"#c05050"};

const AI_SYS=`You are an expert program analyst for an AI enablement program. Write a clear stakeholder report.
Format: Executive Summary (3-4 sentences) | Program Status | Highlights (2-3 wins) | Gaps & Risks (2-3 items) | Recommended Actions (3 prioritized) | Metrics Table (markdown)
Tone: Professional, factual. Use real names and numbers. If sparse, say so.`;

function MeterBar({val,color}){return <div style={{height:3,background:"#232320",borderRadius:1}}><div style={{height:"100%",background:color,width:`${Math.min(100,val)}%`,transition:"width 0.4s"}}/></div>}

export default function HealthReport(){
  const[intakes,setIntakes]=useState([]);const[outcomes,setOutcomes]=useState([]);const[checkins,setCheckins]=useState([]);const[packages,setPackages]=useState({});
  const[loading,setLoading]=useState(true);const[report,setReport]=useState(null);const[generating,setGenerating]=useState(false);const[error,setError]=useState(null);
  const[view,setView]=useState("dashboard");const[copied,setCopied]=useState(false);const abortRef=useRef(null);

  useEffect(()=>{(async()=>{try{const[ir,or,cr,pr]=await Promise.allSettled([window.storage.get("intake-records-v1"),window.storage.get("outcome-records-v1"),window.storage.get("checkin-records-v1"),window.storage.get("prompt-packages-v1")]);
    if(ir.status==="fulfilled"&&ir.value)setIntakes(JSON.parse(ir.value.value));if(or.status==="fulfilled"&&or.value)setOutcomes(JSON.parse(or.value.value));if(cr.status==="fulfilled"&&cr.value)setCheckins(JSON.parse(cr.value.value));if(pr.status==="fulfilled"&&pr.value)setPackages(JSON.parse(pr.value.value));
  }catch(e){}finally{setLoading(false)}})();return ()=>abortRef.current?.abort()},[]);

  const completed=outcomes.filter(o=>o.status==="Completed").length;const onPro=outcomes.filter(o=>["pro","max","team","enterprise"].includes(o.plan)).length;
  const qcPassed=outcomes.filter(o=>["q1","q2","q3","q4"].every(id=>o.qc?.[id]==="pass")).length;
  const compRate=outcomes.length?Math.round(completed/outcomes.length*100):0;const proRate=outcomes.length?Math.round(onPro/outcomes.length*100):0;const qcRate=outcomes.length?Math.round(qcPassed/outcomes.length*100):0;
  const latestCI={};checkins.forEach(c=>{if(!latestCI[c.name])latestCI[c.name]=c});const active=Object.values(latestCI).filter(c=>c.frequency!=="not_yet").length;
  const empty=!intakes.length&&!outcomes.length;

  async function generate(){
    setGenerating(true);setError(null);abortRef.current=new AbortController();
    const payload={summary:{intakes:intakes.length,sessions:outcomes.length,completionRate:compRate+"%",proRate:proRate+"%",qcRate:qcRate+"%",packages:Object.keys(packages).length,active},
      outcomes:outcomes.map(o=>({name:o.employeeName,role:o.role,plan:o.plan,session:o.sessionNumber,status:o.status,qc:["q1","q2","q3","q4"].filter(id=>o.qc?.[id]==="pass").length+"/4",gaps:o.openGaps,nextFocus:o.nextSessionFocus})),
      checkins:Object.values(latestCI).map(c=>({name:c.name,frequency:c.frequency,confidence:c.confidence,win:c.biggestWin,stuck:c.stuckOn,goal:c.nextWeekGoal}))};
    try{const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:abortRef.current.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,system:AI_SYS,messages:[{role:"user",content:`Generate report:\n\n${JSON.stringify(payload,null,2)}\n\nDate: ${new Date().toLocaleDateString()}`}]})});
      if(!resp.ok){const e=await resp.json().catch(()=>({}));throw new Error(e.error?.message||`HTTP ${resp.status}`)}
      const data=await resp.json();setReport(data.content?.[0]?.text||"No report.");setView("report");
    }catch(err){if(err.name==="AbortError")return;setError(err.message)}finally{setGenerating(false)}
  }

  const copy=()=>{if(!report)return;navigator.clipboard.writeText(report).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}).catch(()=>{})};
  const wrap=(hdr,body)=>(<><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13.5,lineHeight:1.65,color:T.text}}><header style={{padding:"24px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>{hdr}</header><main style={{padding:"24px 40px",maxWidth:920}}>{body}</main></div></>);

  if(loading) return wrap(<div><Eyebrow>Program Health</Eyebrow></div>,<Card><Mono color={T.text3}>Loading data...</Mono></Card>);

  if(view==="report"&&report) return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Program Health</Eyebrow><Heading>Stakeholder Report</Heading></div><div style={{display:"flex",gap:8}}><Btn onClick={copy}>{copied?"\u25C6 Copied":"Copy"}</Btn><Btn onClick={()=>setView("dashboard")}>Dashboard</Btn><Btn onClick={generate} disabled={generating}>{generating?"...":"Regenerate"}</Btn></div></>,
    <Card style={{padding:0,overflow:"hidden"}}>
      <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`}}><Mono size={10} color={T.text3}>Generated {new Date().toLocaleDateString()}</Mono></div>
      <div style={{padding:22}}>
        {report.split("\n").map((line,i)=>{
          if(line.startsWith("## "))return <div key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:T.text,marginTop:i===0?0:20,marginBottom:6}}>{line.slice(3)}</div>;
          if(line.startsWith("# "))return <div key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:T.text,marginBottom:8}}>{line.slice(2)}</div>;
          if(line.startsWith("- "))return <div key={i} style={{fontSize:12,color:T.text2,marginBottom:4,paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:4,color:T.accent}}>{"\u25C7"}</span>{line.slice(2)}</div>;
          if(line.startsWith("|"))return <div key={i} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10.5,background:T.bg,padding:"2px 8px",marginBottom:1,borderRadius:2,color:T.text2}}>{line}</div>;
          if(!line.trim())return <div key={i} style={{height:8}}/>;
          return <p key={i} style={{fontSize:12,color:T.text2,lineHeight:1.7,marginBottom:5}}>{line}</p>;
        })}
      </div>
    </Card>
  );

  return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Program Health</Eyebrow><Heading>Dashboard</Heading></div><Btn onClick={generate} disabled={generating||empty} accent={!generating&&!empty}>{generating?"Generating...":"Generate Report"}</Btn></>,
    <>
      {error&&<div style={{background:T.card,border:`1px solid ${T.red}`,borderLeft:`2px solid ${T.red}`,borderRadius:3,padding:"8px 14px",marginBottom:12,fontSize:12,color:T.red}}>{error}</div>}
      {empty?<Card style={{textAlign:"center",padding:40}}><Mono color={T.text3}>No data yet. Run intakes and log outcomes.</Mono></Card>:<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[{l:"Completion",v:compRate,c:compRate>=70?T.green:T.accent,s:`${completed}/${outcomes.length}`},{l:"Pro+",v:proRate,c:T.mono2,s:`${onPro} paid`},{l:"QC Clear",v:qcRate,c:qcRate>=80?T.green:T.accent,s:`${qcPassed} all \u2605`},{l:"Active",v:active>0&&Object.keys(latestCI).length?Math.round(active/Object.keys(latestCI).length*100):0,c:T.green,s:`${active} this week`}].map(m=>(
            <Card key={m.l} style={{padding:"13px 16px"}}><Eyebrow color={T.text3} style={{marginBottom:8,fontSize:9}}>{m.l}</Eyebrow><div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:6}}><Mono size={22} color={m.c}>{m.v}</Mono><Mono size={12} color={m.c}>%</Mono></div><MeterBar val={m.v} color={m.c}/><Mono size={9} color={T.text3} style={{marginTop:5}}>{m.s}</Mono></Card>
          ))}
        </div>
        {outcomes.length>0&&<Card style={{padding:0,overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"10px 18px",borderBottom:`1px solid ${T.border}`}}><Eyebrow>Cohort</Eyebrow></div>
          <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["employee","plan","#","qc","freq","conf","status"].map(h=><th key={h} style={{padding:"7px 14px",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:T.text3,textTransform:"uppercase",letterSpacing:"0.12em",textAlign:"left",borderBottom:`1px solid ${T.border}`,fontWeight:500}}>{h}</th>)}</tr></thead>
          <tbody>{outcomes.map((o,i)=>{const ci=latestCI[o.employeeName];const qc=["q1","q2","q3","q4"].filter(id=>o.qc?.[id]==="pass").length;return (
            <tr key={o.id} style={{borderBottom:i<outcomes.length-1?`1px solid ${T.border}`:"none"}}>
              <td style={{padding:"8px 14px",fontWeight:500,fontSize:12}}>{o.employeeName}</td>
              <td style={{padding:"8px 14px"}}><Tag color={PC[o.plan]}>{o.plan?.toUpperCase()}</Tag></td>
              <td style={{padding:"8px 14px"}}><Mono size={11} color={T.text3}>#{o.sessionNumber}</Mono></td>
              <td style={{padding:"8px 14px"}}><Mono size={11} color={qc===4?T.green:T.accent}>{qc}/4</Mono></td>
              <td style={{padding:"8px 14px"}}><Mono size={11} color={FC[ci?.frequency]||T.text3}>{FG[ci?.frequency]||"\u2014"}</Mono></td>
              <td style={{padding:"8px 14px"}}><Mono size={11}>{ci?.confidence?ci.confidence+"/5":"\u2014"}</Mono></td>
              <td style={{padding:"8px 14px"}}><Tag color={SC[o.status]}>{o.status}</Tag></td>
            </tr>
          )})}</tbody></table>
        </Card>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {outcomes.some(o=>o.openGaps)&&<Card style={{padding:14}}><Eyebrow style={{marginBottom:8}}>Gaps</Eyebrow>{outcomes.filter(o=>o.openGaps).map((o,i)=><div key={i} style={{marginBottom:5,display:"flex",gap:10}}><Mono size={10} color={T.accent}>{o.employeeName}</Mono><span style={{fontSize:12,color:T.text2}}>{o.openGaps}</span></div>)}</Card>}
          {Object.values(latestCI).some(c=>c.biggestWin)&&<Card style={{padding:14}}><Eyebrow style={{marginBottom:8}}>Wins</Eyebrow>{Object.values(latestCI).filter(c=>c.biggestWin).map((c,i)=><div key={i} style={{marginBottom:5,display:"flex",gap:10}}><Mono size={10} color={T.green}>{c.name}</Mono><span style={{fontSize:12,color:T.text2}}>{c.biggestWin}</span></div>)}</Card>}
        </div>
        <Card style={{padding:14}}><Eyebrow color={T.text3} style={{marginBottom:10}}>Data Coverage</Eyebrow>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{[{l:"Intakes",v:intakes.length},{l:"Outcomes",v:outcomes.length},{l:"Check-ins",v:checkins.length},{l:"Packages",v:Object.keys(packages).length}].map(s=><div key={s.l} style={{textAlign:"center",padding:10,background:s.v>0?T.tag:T.bg,borderRadius:2,border:`1px solid ${s.v>0?T.borderHi:T.border}`}}><Mono size={18} color={s.v>0?T.green:T.text3}>{s.v}</Mono><div><Eyebrow color={T.text3} style={{fontSize:8,marginTop:2}}>{s.l}</Eyebrow></div></div>)}</div>
        </Card>
      </>}
    </>
  );
}
