/**
 * Claude Enablement Suite — 02: Prompt Package Builder
 * Design: Reading Room at Midnight — Variant B
 * Storage: prompt-packages-v1 | Reads: intake-records-v1
 */
import { useState, useEffect, useRef } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",red:"#c05050",mono2:"#78afc8",tag:"#1e1e1a",mono:"#7ab878"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25);color:#ddd8ce}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;

const Eyebrow=({children,color,style={}})=><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;
const Mono=({children,size=11,color,style={}})=><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:size,color:color||T.text2,...style}}>{children}</span>;
const Tag=({children,color})=><span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:color||T.text2,padding:"2px 7px",letterSpacing:"0.04em",display:"inline-block"}}>{children}</span>;
const Card=({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"18px 22px",...style}}>{children}</div>;
const Btn=({children,onClick,disabled,accent,style={}})=><button onClick={onClick} disabled={disabled} style={{background:"transparent",borderRadius:2,cursor:disabled?"not-allowed":"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",transition:"border-color 0.15s,color 0.15s",border:`1px solid ${accent&&!disabled?T.accent:T.borderHi}`,color:disabled?T.text3:accent?T.accent:T.text2,...style}}>{children}</button>;
const Heading=({children,size=22})=><div style={{fontFamily:"'Playfair Display',serif",fontSize:size,fontWeight:700,color:T.text}}>{children}</div>;
const inp={width:"100%",padding:"7px 10px",borderRadius:2,border:`1px solid ${T.borderHi}`,fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif",outline:"none",background:T.bg,color:T.text,marginBottom:10};
const lbl={fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,letterSpacing:"0.12em",textTransform:"uppercase",color:T.text3,marginBottom:4};

const USECASES={
  "Writing & Communication":["Draft professional emails from bullet points","Rewrite for conciseness","Summarize long threads","Draft announcements","Write meeting agendas"],
  "Documents & Reports":["Convert notes to structured reports","Draft executive summaries","Create status updates","Generate templates","Proofread and improve"],
  "Research & Analysis":["Research and summarize","Compare with pros/cons","Extract data from docs","Synthesize multiple sources","Fact-check claims"],
  "Planning & Organization":["Break down projects","Build meeting agendas","Create weekly plans","Prioritize a backlog","Draft OKRs from strategy"],
  "Technical":["Write or debug code","Generate test cases","Document a codebase","Draft runbook steps","Explain tech to non-tech"],
  "Customer & Stakeholder":["Draft complaint responses","Create FAQs","Prepare talking points","Write change comms","Summarize calls for CRM"],
};

const SYS=(role,uc,pp,tools,lit)=>`You are a Claude prompt engineering expert. Generate a prompt package for:
Role: ${role} | Literacy: ${lit} | Tools: ${tools.join(", ")||"General"} | Use cases: ${uc.join(", ")} | Pain points: ${pp.join(", ")}
Generate exactly 6 prompts. Each: name (≤6 words), category, full prompt text, 1-sentence description, 1-2 tips.
Calibrate to ${lit} literacy. Cover the pain points. Include XML tags where structure helps.
Respond ONLY with valid JSON, no markdown fences:
{"prompts":[{"name":"","category":"","prompt":"","description":"","tips":[""]}]}`;

export default function PromptBuilder(){
  const[intakes,setIntakes]=useState([]);
  const[packages,setPackages]=useState({});
  const[form,setForm]=useState({name:"",role:"",literacy:"regular",tools:[],useCases:[],painPoints:[]});
  const[pkg,setPkg]=useState(null);
  const[view,setView]=useState("setup");
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const[editIdx,setEditIdx]=useState(null);
  const abortRef=useRef(null);

  useEffect(()=>{(async()=>{try{const[ir,pr]=await Promise.allSettled([window.storage.get("intake-records-v1"),window.storage.get("prompt-packages-v1")]);if(ir.status==="fulfilled"&&ir.value)setIntakes(JSON.parse(ir.value.value));if(pr.status==="fulfilled"&&pr.value)setPackages(JSON.parse(pr.value.value))}catch(e){}})();return ()=>abortRef.current?.abort()},[]);

  const togUC=uc=>setForm(p=>({...p,useCases:p.useCases.includes(uc)?p.useCases.filter(x=>x!==uc):[...p.useCases,uc]}));
  const loadIntake=r=>setForm({name:r.name,role:r.role,literacy:r.literacy||"regular",tools:r.tools||[],useCases:r.painPoints||[],painPoints:r.painPoints||[]});

  async function generate(){
    if(!form.name||!form.role)return;
    setLoading(true);setError(null);setView("generating");
    abortRef.current=new AbortController();
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:abortRef.current.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:4000,messages:[{role:"user",content:SYS(form.role,form.useCases,form.painPoints,form.tools,form.literacy)}]})});
      if(!resp.ok){const e=await resp.json().catch(()=>({}));throw new Error(e.error?.message||`HTTP ${resp.status}`)}
      const data=await resp.json();const text=data.content?.[0]?.text||"";const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      setPkg({...parsed,employeeName:form.name,role:form.role,createdAt:new Date().toISOString()});setView("review");
    }catch(err){if(err.name==="AbortError")return;setError(err.message);setView("setup")}finally{setLoading(false)}
  }

  async function savePkg(){
    if(!pkg)return;const key=pkg.employeeName+"-"+Date.now();const next={...packages,[key]:pkg};setPackages(next);
    try{await window.storage.set("prompt-packages-v1",JSON.stringify(next))}catch(e){}
  }
  function copyAll(){if(!pkg)return;navigator.clipboard.writeText([`# Prompt Package — ${pkg.employeeName}`,...pkg.prompts.map((p,i)=>`\n## ${i+1}. ${p.name}\n${p.category} | ${p.description}\n\n${p.prompt}\n\nTips: ${p.tips?.join(" | ")}`)].join("\n")).catch(()=>{})}

  const wrap=(hdr,body)=>(<><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13.5,lineHeight:1.65,color:T.text}}><header style={{padding:"24px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>{hdr}</header><main style={{padding:"24px 40px",maxWidth:820}}>{body}</main></div></>);

  // Generating
  if(view==="generating") return wrap(
    <div><Eyebrow style={{marginBottom:6}}>Generating</Eyebrow><Heading>Building package for {form.name}</Heading></div>,
    <Card style={{textAlign:"center",padding:40}}><Mono size={13} color={T.accent}>Generating 6 tailored prompts…</Mono></Card>
  );

  // Review
  if(view==="review"&&pkg) return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Prompt Package</Eyebrow><Heading>{pkg.employeeName}</Heading></div><div style={{display:"flex",gap:8}}><Btn onClick={copyAll}>Copy All</Btn><Btn onClick={savePkg} accent>Save</Btn><Btn onClick={()=>{setPkg(null);setView("setup")}}>Rebuild</Btn></div></>,
    <>
      <Card style={{marginBottom:14,padding:"12px 18px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}><Mono size={12} color={T.text}>{pkg.role}</Mono><Mono size={10} color={T.text3} style={{marginLeft:10}}>{pkg.prompts.length} prompts · {new Date(pkg.createdAt).toLocaleDateString()}</Mono></div>
        <Tag color={T.green}>ready</Tag>
      </Card>
      {pkg.prompts.map((p,i)=>(
        <Card key={i} style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
            <div><Mono size={10} color={T.accent} style={{marginRight:8}}>{String(i+1).padStart(2,"0")}</Mono><span style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700}}>{p.name}</span><div style={{color:T.text3,fontSize:11,marginTop:3}}>{p.description}</div></div>
            <div style={{display:"flex",gap:6,flexShrink:0}}><Tag color={T.mono2}>{p.category}</Tag><Btn onClick={()=>setEditIdx(editIdx===i?null:i)} style={{padding:"2px 8px"}}>{editIdx===i?"Done":"Edit"}</Btn><Btn onClick={()=>navigator.clipboard.writeText(p.prompt).catch(()=>{})} style={{padding:"2px 8px"}}>Copy</Btn></div>
          </div>
          {editIdx===i
            ?<textarea value={p.prompt} onChange={e=>{const n=[...pkg.prompts];n[i]={...p,prompt:e.target.value};setPkg(v=>({...v,prompts:n}))}} style={{width:"100%",height:140,padding:"8px 10px",borderRadius:2,border:`1px solid ${T.accent}`,fontSize:12,fontFamily:"'IBM Plex Mono',monospace",outline:"none",resize:"vertical",background:T.bg,color:T.text}}/>
            :<div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:2,padding:"10px 12px",fontSize:12,fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"pre-wrap",lineHeight:1.6,color:T.text2,maxHeight:150,overflowY:"auto"}}>{p.prompt}</div>
          }
          {p.tips?.length>0&&<div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>{p.tips.map((t,ti)=><div key={ti} style={{fontSize:10.5,color:T.accent,background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,padding:"2px 8px"}}>◇ {t}</div>)}</div>}
        </Card>
      ))}
    </>
  );

  // Packages list
  if(view==="packages"){const list=Object.entries(packages);return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Saved Packages</Eyebrow><Heading>{list.length} Package{list.length!==1?"s":""}</Heading></div><Btn onClick={()=>setView("setup")} accent>+ Build New</Btn></>,
    !list.length?<Mono color={T.text3}>No packages saved.</Mono>:list.map(([k,p])=>(
      <Card key={k} style={{marginBottom:6,display:"flex",alignItems:"center",gap:14,padding:"12px 18px"}}>
        <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13}}>{p.employeeName}</div><Mono size={10} color={T.text3}>{p.role} · {p.prompts?.length} prompts</Mono></div>
        <Btn onClick={()=>{setPkg(p);setView("review")}}>View</Btn><Btn onClick={()=>{const l=[`# ${p.employeeName}`,...p.prompts.map((q,i)=>`\n## ${i+1}. ${q.name}\n${q.prompt}`)];navigator.clipboard.writeText(l.join("\n")).catch(()=>{})}}>Copy</Btn>
      </Card>
    ))
  )}

  // Setup
  return wrap(
    <><div><Eyebrow style={{marginBottom:6}}>Prompt Package Builder</Eyebrow><Heading>Build Tailored Prompts</Heading></div>{Object.keys(packages).length>0&&<Btn onClick={()=>setView("packages")}>Saved ({Object.keys(packages).length})</Btn>}</>,
    <>
      {error&&<div style={{background:T.card,border:`1px solid ${T.red}`,borderLeft:`2px solid ${T.red}`,borderRadius:3,padding:"8px 14px",marginBottom:12,fontSize:12,color:T.red}}>{error}</div>}
      {intakes.length>0&&<Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:8}}>Load from Intake</Eyebrow><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{intakes.slice(0,8).map(r=><Btn key={r.id} onClick={()=>loadIntake(r)} style={{padding:"4px 10px"}}>{r.name}</Btn>)}</div></Card>}
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:12}}>Employee</Eyebrow>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 14px"}}>
          <div><div style={lbl}>Name *</div><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp} placeholder="Jane Smith"/></div>
          <div><div style={lbl}>Role *</div><input value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={inp} placeholder="Service Desk Manager"/></div>
          <div><div style={lbl}>Literacy</div><select value={form.literacy} onChange={e=>setForm(p=>({...p,literacy:e.target.value}))} style={{...inp,cursor:"pointer"}}><option value="none">None</option><option value="casual">Casual</option><option value="regular">Regular</option><option value="power">Power</option><option value="advanced">Advanced</option></select></div>
        </div>
      </Card>
      <Card style={{marginBottom:10}}><Eyebrow style={{marginBottom:4}}>Use Cases</Eyebrow><div style={{color:T.text3,fontSize:11,marginBottom:10}}>Select use cases to build prompts around</div>
        {Object.entries(USECASES).map(([cat,items])=><div key={cat} style={{marginBottom:10}}>
          <Eyebrow color={T.text3} style={{marginBottom:5,fontSize:9}}>{cat}</Eyebrow>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{items.map(uc=>{const sel=form.useCases.includes(uc);return <button key={uc} onClick={()=>togUC(uc)} style={{padding:"4px 8px",borderRadius:2,border:`1px solid ${sel?T.accent:T.border}`,background:sel?T.tag:"transparent",color:sel?T.accent:T.text3,fontSize:11,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",transition:"all 0.15s"}}>{sel?"◆ ":"◇ "}{uc}</button>})}</div>
        </div>)}
        <Mono size={10} color={T.text3}>{form.useCases.length} selected — Claude generates 6 prompts covering these</Mono>
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={generate} disabled={!form.name||!form.role||loading} accent={!!(form.name&&form.role&&!loading)} style={{padding:"8px 22px",fontSize:11}}>Generate for {form.name||"Employee"}</Btn></div>
    </>
  );
}
