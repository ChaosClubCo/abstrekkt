import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const api=async(msgs,max=2000,sys)=>{
  const b={model:"claude-sonnet-4-6",max_tokens:max,messages:msgs};if(sys)b.system=sys;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"HTTP "+r.status);
  return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");
};
const TIERS=[{id:"starter",label:"Starter",price:"$99/mo",includes:"Up to 5 employees · 2 sessions/mo · prompt packages · email support"},{id:"growth",label:"Growth",price:"$149/mo",includes:"Up to 15 employees · 4 sessions/mo · prompt packages · Slack support · monthly report"},{id:"scale",label:"Scale",price:"$299/mo",includes:"Up to 50 employees · unlimited sessions · full integration suite · dedicated support"}];
const INDUSTRIES=["SaaS / Tech","Professional Services","Healthcare","Finance / Legal","Retail / E-commerce","Manufacturing","Education","Non-profit","Agency","Other"];
const PAINS=["Low AI adoption","No ROI visibility","Lack of internal expertise","Tool sprawl / cost","Security concerns","Onboarding bottleneck","No prompt standards"];
function Label({children}){return <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:3}}>{children}</div>;}
function Inp({value,onChange,placeholder,style={}}){return <input value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif",background:T.bg,color:T.t,marginBottom:7,outline:"none",...style}} />;}
export default function ProposalGen(){
  const [form,setForm]=useState({co:"",contact:"",emp:10,industry:"SaaS / Tech",pain:[],tier:"growth",start:"",notes:""});
  const [res,setRes]=useState("");const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const togPain=p=>set("pain",form.pain.includes(p)?form.pain.filter(x=>x!==p):[...form.pain,p]);
  const ok=form.co.trim()&&form.contact.trim();
  const tier=TIERS.find(t=>t.id===form.tier);
  const generate=async()=>{
    setLoading(true);setErr("");setRes("");
    const sys=`You are a B2B AI enablement consultant writing proposals for FlashFusion clients. Write clear, outcome-focused proposals — no buzzwords, specific ROI math, concrete deliverables. Format with clean sections using markdown headers. End with a clear signature block.`;
    const prompt=`Write a complete client proposal for:\n\nCompany: ${form.co}\nContact: ${form.contact}\nEmployees to Enroll: ${form.emp}\nIndustry: ${form.industry}\nKey Pain Points: ${form.pain.join(", ")||"not specified"}\nSelected Tier: ${tier?.label} (${tier?.price}) — ${tier?.includes}\nDesired Start: ${form.start||"TBD"}\nAdditional Context: ${form.notes||"none"}\n\nProposal Structure:\n## Executive Summary (2-3 sentences, outcome-focused, name the specific ROI math)\n## What We'll Build Together (4-6 bullets, concrete deliverables)\n## Program Structure (3-phase: Foundation → Practice → Optimize, with timeline)\n## Investment (tier details, what's included, what's not)\n## ROI Projection (conservative/realistic/optimistic using ${form.emp} employees)\n## How We Work (process, communication cadence, HITL at each stage)\n## Next Steps (3 action items with clear ownership)\n\nWrite in founder voice — direct, specific, no corporate-speak. Under 800 words.`;
    try{const r=await api([{role:"user",content:prompt}],2000,sys);setRes(r);}
    catch(e){setErr(e.message);}
    setLoading(false);
  };
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Program Proposal Generator</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ FlashFusion AI Enablement · SOW Generator · claude-sonnet-4-6</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:820,display:"grid",gridTemplateColumns:res?"1fr 1fr":"1fr",gap:16}}>
      <div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>Client Information</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
            <div><Label>Company *</Label><Inp value={form.co} onChange={e=>set("co",e.target.value)} placeholder="Acme Corp" /></div>
            <div><Label>Primary Contact *</Label><Inp value={form.contact} onChange={e=>set("contact",e.target.value)} placeholder="Jane Smith, VP Ops" /></div>
            <div><Label>Employees to Enroll</Label><Inp value={form.emp} onChange={e=>set("emp",+e.target.value)} placeholder="10" style={{marginBottom:7}} /></div>
            <div><Label>Industry</Label><select value={form.industry} onChange={e=>set("industry",e.target.value)} style={{width:"100%",padding:"6px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,background:T.bg,color:T.t,marginBottom:7,outline:"none"}}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
          </div>
          <div><Label>Target Start Date</Label><Inp value={form.start} onChange={e=>set("start",e.target.value)} placeholder="June 2026" /></div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:7}}>Pain Points</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {PAINS.map(p=><button key={p} onClick={()=>togPain(p)} style={{background:"transparent",border:`1px solid ${form.pain.includes(p)?T.a:T.b}`,borderRadius:2,color:form.pain.includes(p)?T.a:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>{form.pain.includes(p)?"◆ ":""}{p}</button>)}
          </div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:7}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:7}}>Program Tier</div>
          {TIERS.map(ti=><label key={ti.id} onClick={()=>set("tier",ti.id)} style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer",padding:"7px 9px",borderRadius:2,border:`1px solid ${form.tier===ti.id?T.a:T.b}`,background:form.tier===ti.id?T.tg:"transparent",marginBottom:4,transition:"all .12s"}}>
            <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${form.tier===ti.id?T.a:T.t3}`,background:form.tier===ti.id?T.a:"transparent",flexShrink:0,marginTop:2}} />
            <div><div style={{display:"flex",gap:8,alignItems:"baseline"}}><span style={{fontWeight:500,fontSize:12}}>{ti.label}</span><span style={{...mn,fontSize:10,color:T.a}}>{ti.price}</span></div><div style={{fontSize:11,color:T.t3,marginTop:1}}>{ti.includes}</div></div>
          </label>)}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px",marginBottom:10}}>
          <Label>Additional Context</Label>
          <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Existing tools, constraints, specific goals, history with AI…" style={{width:"100%",background:T.sf,border:`1px solid ${T.b}`,borderRadius:2,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,padding:"7px 9px",resize:"vertical",minHeight:52,outline:"none"}} />
        </div>
        <div style={{textAlign:"right"}}><button onClick={generate} disabled={!ok||loading} style={{background:"transparent",border:`1px solid ${ok&&!loading?T.a:T.h}`,borderRadius:2,color:ok&&!loading?T.a:T.t3,...mn,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 16px",cursor:ok&&!loading?"pointer":"not-allowed"}}>{loading?"◌ Generating…":"Generate Proposal →"}</button></div>
        {err&&<div style={{background:T.c,border:"1px solid rgba(192,80,80,.4)",borderRadius:3,padding:"8px 12px",marginTop:7}}><span style={{...mn,fontSize:10,color:T.r}}>✗ {err}</span></div>}
      </div>
      {res&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Proposal — {form.co}</div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>navigator.clipboard.writeText(res).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 9px",cursor:"pointer"}}>Copy MD</button>
            <button onClick={generate} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 9px",cursor:"pointer"}}>Regenerate</button>
          </div>
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"12px 14px",overflowY:"auto",maxHeight:"80vh"}}>
          {res.split("\n").map((line,i)=>{
            const h2=line.startsWith("## ");const h3=line.startsWith("### ");const bullet=line.trim().startsWith("- ")||line.trim().startsWith("• ");
            if(h2)return<div key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:T.t,marginTop:14,marginBottom:5,paddingBottom:4,borderBottom:`1px solid ${T.b}`}}>{line.replace("## ","")}</div>;
            if(h3)return<div key={i} style={{fontWeight:500,fontSize:12,color:T.a,marginTop:8,marginBottom:3}}>{line.replace("### ","")}</div>;
            if(bullet)return<div key={i} style={{fontSize:12,color:T.t2,marginBottom:3,paddingLeft:12}}>◆ {line.replace(/^[-•]\s*/,"")}</div>;
            if(!line.trim())return<div key={i} style={{height:6}} />;
            return<div key={i} style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:3}}>{line}</div>;
          })}
        </div>
        <div style={{background:T.c,border:"1px solid rgba(90,156,90,.25)",borderRadius:3,padding:"7px 12px",marginTop:6}}><span style={{...mn,fontSize:9,color:T.g}}>◆ Copy markdown → paste into Notion, Gamma, or Google Docs</span></div>
      </div>}
    </div>
  </div></>;
}
