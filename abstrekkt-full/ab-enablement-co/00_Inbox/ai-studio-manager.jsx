import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Settings, BookOpen, Play, GitCompare, Clock, Plus, Trash2, Copy, ExternalLink, Tag, Cpu, ChevronDown, X, Check, RefreshCw, Star, AlertTriangle, Search } from "lucide-react";

// ─── TOKENS ────────────────────────────────────────────────────────
const V = {
  s0:"#000000", s1:"#080D12", s2:"#0F1720", s3:"#172030", s4:"#1D2A3A",
  border:"rgba(66,165,245,0.15)", borderHi:"rgba(66,165,245,0.4)",
  blue:"#4285F4", green:"#34A853", yellow:"#FBBC04", red:"#EA4335",
  teal:"#00BCD4", violet:"#7C4DFF", cyan:"#26C6DA",
  t1:"#FFFFFF", t2:"#C8D6E5", t3:"#7A9AB5", t4:"#3D5A73",
  gemini:"linear-gradient(135deg,#4285F4 0%,#9C27B0 50%,#EA4335 100%)",
};

const MODELS = [
  {id:"gemini-2.0-flash",     label:"Gemini 2.0 Flash",     badge:"2.0",  color:V.blue,   fast:true},
  {id:"gemini-2.0-flash-lite",label:"Gemini 2.0 Flash-Lite", badge:"2.0L", color:V.teal,   fast:true},
  {id:"gemini-1.5-pro",       label:"Gemini 1.5 Pro",        badge:"1.5P", color:V.violet, fast:false},
  {id:"gemini-1.5-flash",     label:"Gemini 1.5 Flash",      badge:"1.5F", color:V.cyan,   fast:true},
  {id:"gemini-1.5-flash-8b",  label:"Gemini 1.5 Flash-8B",   badge:"8B",   color:V.green,  fast:true},
];

const DEFAULT_TAGS = ["system","few-shot","chain-of-thought","roleplay","analysis","code","creative","summarize","extract","classify"];

// ─── GEMINI API ─────────────────────────────────────────────────────
async function callGemini(apiKey, modelId, userPrompt, systemPrompt="", temp=0.7, maxTokens=2048) {
  if(!apiKey) throw new Error("No API key. Add it in Setup.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  const body = {
    contents:[{role:"user",parts:[{text:userPrompt}]}],
    generationConfig:{temperature:parseFloat(temp),maxOutputTokens:parseInt(maxTokens)},
    ...(systemPrompt?{systemInstruction:{parts:[{text:systemPrompt}]}}:{}),
  };
  const res = await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!text) throw new Error("Empty response from Gemini");
  const usage = data.usageMetadata || {};
  return {text, inputTokens: usage.promptTokenCount||0, outputTokens: usage.candidatesTokenCount||0};
}

// ─── HELPERS ───────────────────────────────────────────────────────
const pill = (label, color, bg, size=10) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:99,fontSize:size,fontWeight:500,color,background:bg,lineHeight:1.4,whiteSpace:"nowrap"}}>{label}</span>
);
const Spinner = ({c=V.blue}) => (
  <span style={{display:"inline-block",width:11,height:11,border:`1.5px solid ${V.t4}`,borderTop:`1.5px solid ${c}`,borderRadius:"50%",animation:"spin 0.7s linear infinite",flexShrink:0}}/>
);
const ms = n => n < 1000 ? `${n}ms` : `${(n/1000).toFixed(1)}s`;
const fmtTokens = (i,o) => i||o ? `↑${i} ↓${o} tokens` : "";

// ─── MAIN ────────────────────────────────────────────────────────────
export default function AIStudioManager() {
  const [tab, setTab] = useState("setup");
  const [config, setConfig] = useState({apiKey:"",defaultModel:"gemini-2.0-flash",defaultSystem:"",temp:0.7,maxTokens:2048,projectName:"AI Studio"});
  const [prompts, setPrompts] = useState([]);
  const [history, setHistory] = useState([]);
  const [studio, setStudio] = useState({prompt:"",system:"",model:"gemini-2.0-flash",output:"",loading:false,error:"",elapsed:0,tokens:{i:0,o:0}});
  const [compare, setCompare] = useState({prompt:"",system:"",models:["gemini-2.0-flash","gemini-1.5-pro"],results:{},loading:{},errors:{}});
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState("");
  const [newPrompt, setNewPrompt] = useState({title:"",prompt:"",system:"",tags:[],notes:"",starred:false});
  const [showNewForm, setShowNewForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const startRef = useRef(0);

  // ── STORAGE ──────────────────────────────────────────────────────
  useEffect(()=>{
    document.head.insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"><style>@keyframes spin{to{transform:rotate(360deg)}}@keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:${V.s1}}::-webkit-scrollbar-thumb{background:${V.border};border-radius:3px}</style>`);
    async function load(){
      try{
        const [pc,pp,ph] = await Promise.all([
          window.storage.get("ais-config-v1"),
          window.storage.get("ais-prompts-v1"),
          window.storage.get("ais-history-v1"),
        ]);
        if(pc) setConfig(JSON.parse(pc.value));
        if(pp) setPrompts(JSON.parse(pp.value));
        if(ph) setHistory(JSON.parse(ph.value));
      }catch{}
    }
    load();
  },[]);

  const persist = useCallback(async(cfg,prm,hst)=>{
    try{
      await Promise.all([
        cfg!==undefined && window.storage.set("ais-config-v1",JSON.stringify(cfg??config)),
        prm!==undefined && window.storage.set("ais-prompts-v1",JSON.stringify(prm??prompts)),
        hst!==undefined && window.storage.set("ais-history-v1",JSON.stringify(hst??history)),
      ].filter(Boolean));
      setSaved(true); setTimeout(()=>setSaved(false),1400);
    }catch{}
  },[config,prompts,history]);

  const saveConfig = c => { setConfig(c); persist(c,undefined,undefined); };

  // ── PROMPT CRUD ───────────────────────────────────────────────────
  const savePrompt = ()=>{
    if(!newPrompt.title.trim()||!newPrompt.prompt.trim()) return;
    let next;
    if(editId){
      next = prompts.map(p=>p.id===editId?{...p,...newPrompt,updatedAt:Date.now()}:p);
    } else {
      next = [{...newPrompt,id:`p-${Date.now()}`,createdAt:Date.now(),runs:0},...prompts];
    }
    setPrompts(next); persist(undefined,next,undefined);
    setNewPrompt({title:"",prompt:"",system:"",tags:[],notes:"",starred:false});
    setShowNewForm(false); setEditId(null);
  };

  const deletePrompt = id => {
    const next = prompts.filter(p=>p.id!==id);
    setPrompts(next); persist(undefined,next,undefined);
  };

  const starPrompt = id => {
    const next = prompts.map(p=>p.id===id?{...p,starred:!p.starred}:p);
    setPrompts(next); persist(undefined,next,undefined);
  };

  const loadToStudio = p => {
    setStudio(s=>({...s,prompt:p.prompt,system:p.system||config.defaultSystem,model:config.defaultModel,output:"",error:""}));
    setTab("studio");
  };

  const loadToCompare = p => {
    setCompare(c=>({...c,prompt:p.prompt,system:p.system||""}));
    setTab("compare");
  };

  // ── RUN STUDIO ────────────────────────────────────────────────────
  const runStudio = async()=>{
    if(!studio.prompt.trim()) return;
    setStudio(s=>({...s,loading:true,output:"",error:"",elapsed:0}));
    startRef.current = Date.now();
    try{
      const r = await callGemini(config.apiKey,studio.model,studio.prompt,studio.system,config.temp,config.maxTokens);
      const elapsed = Date.now()-startRef.current;
      setStudio(s=>({...s,loading:false,output:r.text,elapsed,tokens:{i:r.inputTokens,o:r.outputTokens}}));
      const entry = {id:`h-${Date.now()}`,model:studio.model,prompt:studio.prompt.slice(0,120),output:r.text,elapsed,tokens:r,at:Date.now()};
      const nextH = [entry,...history].slice(0,100);
      setHistory(nextH); persist(undefined,undefined,nextH);
    }catch(e){
      setStudio(s=>({...s,loading:false,error:e.message}));
    }
  };

  // ── RUN COMPARE ───────────────────────────────────────────────────
  const runCompare = async()=>{
    if(!compare.prompt.trim()) return;
    const mids = compare.models;
    setCompare(c=>({...c,loading:Object.fromEntries(mids.map(m=>[m,true])),results:{},errors:{}}));
    await Promise.all(mids.map(async modelId=>{
      const t0 = Date.now();
      try{
        const r = await callGemini(config.apiKey,modelId,compare.prompt,compare.system,config.temp,config.maxTokens);
        const elapsed = Date.now()-t0;
        setCompare(c=>({...c,results:{...c.results,[modelId]:{text:r.text,elapsed,tokens:r}},loading:{...c.loading,[modelId]:false}}));
      }catch(e){
        setCompare(c=>({...c,errors:{...c.errors,[modelId]:e.message},loading:{...c.loading,[modelId]:false}}));
      }
    }));
  };

  const copy = (text,key)=>{ navigator.clipboard.writeText(text).catch(()=>{}); setCopied(key); setTimeout(()=>setCopied(""),1800); };

  // ── FILTERED PROMPTS ──────────────────────────────────────────────
  const filteredPrompts = useMemo(()=>prompts.filter(p=>{
    if(filterTag!=="all"&&!p.tags?.includes(filterTag)) return false;
    if(search&&!p.title.toLowerCase().includes(search.toLowerCase())&&!p.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>(b.starred?1:0)-(a.starred?1:0)||b.createdAt-a.createdAt),[prompts,filterTag,search]);

  const allTags = useMemo(()=>{
    const t=new Set(); prompts.forEach(p=>p.tags?.forEach(tag=>t.add(tag)));
    return ["all",...Array.from(t)];
  },[prompts]);

  // ── SHARED STYLES ─────────────────────────────────────────────────
  const card = {background:V.s2,border:`1px solid ${V.border}`,borderRadius:10,padding:"14px 16px"};
  const inp = {background:V.s3,border:`1px solid ${V.border}`,borderRadius:6,color:V.t2,fontSize:12,padding:"6px 10px",outline:"none",fontFamily:"inherit",width:"100%"};
  const sel = {...inp,cursor:"pointer"};
  const outBox = {background:V.s3,border:`1px solid ${V.border}`,borderRadius:8,padding:"12px",fontFamily:"'Geist Mono',monospace",fontSize:11,color:V.t2,lineHeight:1.7,minHeight:120,whiteSpace:"pre-wrap",wordBreak:"break-word",overflowY:"auto"};

  // ── SETUP TAB ─────────────────────────────────────────────────────
  const renderSetup = ()=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {/* API Key */}
      <div style={{...card,gridColumn:"1/-1",borderColor:`rgba(66,133,244,0.3)`}}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:V.gemini,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:700}}>Google AI Studio</span>
          <span style={{color:V.t4}}>— Configuration</span>
          {config.apiKey && pill("API key set ✓",V.green,"rgba(52,168,83,0.12)")}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>API Key <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color:V.blue,fontSize:9}}>↗ Get key</a></label>
            <input type="password" value={config.apiKey} onChange={e=>saveConfig({...config,apiKey:e.target.value})}
              placeholder="AIza…" style={inp}/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Project name</label>
            <input value={config.projectName} onChange={e=>saveConfig({...config,projectName:e.target.value})} style={inp} placeholder="My AI Studio"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Default model</label>
            <select style={sel} value={config.defaultModel} onChange={e=>saveConfig({...config,defaultModel:e.target.value})}>
              {MODELS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Temperature ({config.temp})</label>
            <input type="range" min="0" max="2" step="0.1" value={config.temp}
              onChange={e=>saveConfig({...config,temp:parseFloat(e.target.value)})} style={{width:"100%",accentColor:V.blue}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Max output tokens</label>
            <input type="number" value={config.maxTokens} onChange={e=>saveConfig({...config,maxTokens:e.target.value})} style={inp} min="256" max="8192"/>
          </div>
          <div>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:4}}>Default system instruction</label>
            <input value={config.defaultSystem} onChange={e=>saveConfig({...config,defaultSystem:e.target.value})} style={inp} placeholder="You are a helpful assistant…"/>
          </div>
        </div>
        {config.apiKey && (
          <div style={{...card,background:V.s3,borderColor:"rgba(52,168,83,0.2)",marginTop:8}}>
            <div style={{fontSize:11,color:V.green,fontWeight:500,marginBottom:4}}>Ready to run</div>
            <div style={{fontSize:10,color:V.t4}}>Key stored in artifact storage. Calls go directly to <code style={{color:V.blue}}>generativelanguage.googleapis.com</code> — never proxied.</div>
          </div>
        )}
        {!config.apiKey && (
          <div style={{...card,background:"rgba(234,67,53,0.06)",borderColor:"rgba(234,67,53,0.2)",marginTop:8}}>
            <div style={{fontSize:11,color:V.red,fontWeight:500,marginBottom:2}}>API key required</div>
            <div style={{fontSize:10,color:V.t4}}>Get your key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color:V.blue}}>aistudio.google.com/app/apikey</a>. Free tier available.</div>
          </div>
        )}
      </div>
      {/* Models reference */}
      <div style={card}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>Available Models</div>
        {MODELS.map(m=>(
          <div key={m.id} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${V.border}33`}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:m.color,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:V.t1,fontWeight:500}}>{m.label}</div>
              <div style={{fontSize:9,color:V.t4,fontFamily:"monospace"}}>{m.id}</div>
            </div>
            {m.fast && pill("fast",V.green,"rgba(52,168,83,0.12)",9)}
            {m.id===config.defaultModel && pill("default",V.blue,"rgba(66,133,244,0.12)",9)}
          </div>
        ))}
      </div>
      {/* Stats */}
      <div style={card}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>Workspace Stats</div>
        {[
          {label:"Saved prompts",val:prompts.length,color:V.blue},
          {label:"Runs logged",val:history.length,color:V.green},
          {label:"Starred prompts",val:prompts.filter(p=>p.starred).length,color:V.yellow},
          {label:"Unique tags",val:allTags.length-1,color:V.violet},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${V.border}22`,fontSize:11}}>
            <span style={{color:V.t3}}>{s.label}</span>
            <span style={{color:s.color,fontWeight:700}}>{s.val}</span>
          </div>
        ))}
        <div style={{marginTop:12,display:"flex",gap:8}}>
          <button onClick={()=>setTab("library")} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid ${V.blue}44`,background:`${V.blue}14`,color:V.blue,fontSize:11,cursor:"pointer"}}>Go to Library</button>
          <button onClick={()=>setTab("studio")} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid rgba(52,168,83,0.4)`,background:"rgba(52,168,83,0.1)",color:V.green,fontSize:11,cursor:"pointer"}}>Open Studio</button>
        </div>
      </div>
    </div>
  );

  // ── LIBRARY TAB ────────────────────────────────────────────────────
  const renderLibrary = ()=>(
    <div>
      {/* Toolbar */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 180px"}}>
          <Search size={11} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:V.t4}}/>
          <input placeholder="Search prompts…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,paddingLeft:26}}/>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {allTags.map(t=>(
            <button key={t} onClick={()=>setFilterTag(t)}
              style={{padding:"3px 9px",borderRadius:99,border:`1px solid ${filterTag===t?V.blue:"rgba(255,255,255,0.08)"}`,background:filterTag===t?`${V.blue}22`:"transparent",color:filterTag===t?V.blue:V.t4,fontSize:10,cursor:"pointer"}}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={()=>{setShowNewForm(!showNewForm);setEditId(null);setNewPrompt({title:"",prompt:"",system:"",tags:[],notes:"",starred:false});}}
          style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${V.blue}44`,background:`${V.blue}14`,color:V.blue,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",gap:5,alignItems:"center",whiteSpace:"nowrap"}}>
          <Plus size={12}/> New Prompt
        </button>
      </div>

      {/* New/Edit form */}
      {showNewForm && (
        <div style={{...card,borderColor:`${V.blue}44`,marginBottom:14,animation:"fade 0.2s ease"}}>
          <div style={{fontSize:12,fontWeight:600,color:V.t1,marginBottom:12}}>{editId?"Edit Prompt":"New Prompt"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Title*</label>
              <input value={newPrompt.title} onChange={e=>setNewPrompt(p=>({...p,title:e.target.value}))} style={inp} placeholder="Prompt title…"/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Prompt*</label>
              <textarea value={newPrompt.prompt} onChange={e=>setNewPrompt(p=>({...p,prompt:e.target.value}))}
                style={{...inp,height:100,resize:"vertical",lineHeight:1.6}} placeholder="User prompt…"/>
            </div>
            <div>
              <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>System instruction (optional)</label>
              <textarea value={newPrompt.system} onChange={e=>setNewPrompt(p=>({...p,system:e.target.value}))}
                style={{...inp,height:60,resize:"vertical",lineHeight:1.6}} placeholder="You are…"/>
            </div>
            <div>
              <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:3}}>Notes</label>
              <textarea value={newPrompt.notes} onChange={e=>setNewPrompt(p=>({...p,notes:e.target.value}))}
                style={{...inp,height:60,resize:"vertical",lineHeight:1.6}} placeholder="When to use, context…"/>
            </div>
          </div>
          {/* Tags */}
          <div style={{marginBottom:10}}>
            <label style={{fontSize:10,color:V.t4,display:"block",marginBottom:5}}>Tags</label>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {DEFAULT_TAGS.map(t=>(
                <button key={t} onClick={()=>setNewPrompt(p=>({...p,tags:p.tags?.includes(t)?p.tags.filter(x=>x!==t):[...(p.tags||[]),t]}))}
                  style={{padding:"2px 8px",borderRadius:99,border:`1px solid ${newPrompt.tags?.includes(t)?V.blue:"rgba(255,255,255,0.08)"}`,background:newPrompt.tags?.includes(t)?`${V.blue}22`:"transparent",color:newPrompt.tags?.includes(t)?V.blue:V.t4,fontSize:10,cursor:"pointer"}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={savePrompt} style={{padding:"6px 16px",borderRadius:6,border:`1px solid ${V.blue}44`,background:`${V.blue}22`,color:V.blue,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              {editId?"Save Changes":"Add to Library"}
            </button>
            <button onClick={()=>{setShowNewForm(false);setEditId(null);}} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${V.border}`,background:"transparent",color:V.t4,fontSize:11,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Prompt cards */}
      {filteredPrompts.length===0 && (
        <div style={{...card,textAlign:"center",padding:"40px",borderStyle:"dashed"}}>
          <BookOpen size={28} style={{margin:"0 auto 10px",color:V.t4}}/>
          <div style={{color:V.t2,fontSize:13,fontWeight:500,marginBottom:6}}>No prompts yet</div>
          <div style={{color:V.t4,fontSize:11}}>Click "New Prompt" to add your first, or run something in the Studio to auto-save.</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
        {filteredPrompts.map(p=>(
          <div key={p.id} style={{...card,transition:"border-color 0.2s",cursor:"default"}}>
            <div style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:V.t1,lineHeight:1.3}}>{p.title}</div>
                {p.notes && <div style={{fontSize:10,color:V.t4,marginTop:2}}>{p.notes}</div>}
              </div>
              <button onClick={()=>starPrompt(p.id)} style={{color:p.starred?V.yellow:V.t4,background:"none",border:"none",cursor:"pointer",padding:"2px",flexShrink:0}}>
                <Star size={13} fill={p.starred?V.yellow:"none"}/>
              </button>
            </div>
            <pre style={{fontSize:10,color:V.t3,lineHeight:1.6,fontFamily:"monospace",margin:"0 0 8px",overflow:"hidden",maxHeight:80,maskImage:"linear-gradient(to bottom,#fff 60%,transparent)"}}>{p.prompt}</pre>
            {p.tags?.length>0 && (
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {p.tags.map(t=>pill(t,V.blue,`${V.blue}15`,9))}
              </div>
            )}
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <button onClick={()=>loadToStudio(p)}
                style={{padding:"3px 9px",borderRadius:5,border:`1px solid rgba(52,168,83,0.4)`,background:"rgba(52,168,83,0.1)",color:V.green,fontSize:10,cursor:"pointer",display:"flex",gap:4,alignItems:"center"}}>
                <Play size={9}/> Run
              </button>
              <button onClick={()=>loadToCompare(p)}
                style={{padding:"3px 9px",borderRadius:5,border:`1px solid rgba(124,77,255,0.4)`,background:"rgba(124,77,255,0.1)",color:V.violet,fontSize:10,cursor:"pointer",display:"flex",gap:4,alignItems:"center"}}>
                <GitCompare size={9}/> Compare
              </button>
              <button onClick={()=>{setEditId(p.id);setNewPrompt({title:p.title,prompt:p.prompt,system:p.system||"",tags:p.tags||[],notes:p.notes||"",starred:p.starred});setShowNewForm(true);}}
                style={{padding:"3px 8px",borderRadius:5,border:`1px solid ${V.border}`,background:"transparent",color:V.t4,fontSize:10,cursor:"pointer"}}>Edit</button>
              <button onClick={()=>copy(p.prompt,p.id+"cp")}
                style={{padding:"3px 8px",borderRadius:5,border:`1px solid ${V.border}`,background:"transparent",color:copied===p.id+"cp"?V.green:V.t4,fontSize:10,cursor:"pointer"}}>
                {copied===p.id+"cp"?"✓":"Copy"}
              </button>
              <button onClick={()=>deletePrompt(p.id)}
                style={{marginLeft:"auto",color:V.t4,background:"none",border:"none",cursor:"pointer",padding:"2px"}}>
                <Trash2 size={11}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── STUDIO TAB ─────────────────────────────────────────────────────
  const renderStudio = ()=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {/* Input panel */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={card}>
          <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Prompt</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select style={{...sel,width:"auto",fontSize:10,padding:"3px 7px",color:MODELS.find(m=>m.id===studio.model)?.color||V.t2}}
                value={studio.model} onChange={e=>setStudio(s=>({...s,model:e.target.value}))}>
                {MODELS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:9,color:V.t4,display:"block",marginBottom:3}}>System instruction</label>
            <textarea value={studio.system} onChange={e=>setStudio(s=>({...s,system:e.target.value}))}
              placeholder={config.defaultSystem||"Optional system instruction…"}
              style={{...inp,height:56,resize:"vertical",lineHeight:1.6,fontSize:11}}/>
          </div>
          <textarea value={studio.prompt} onChange={e=>setStudio(s=>({...s,prompt:e.target.value}))}
            placeholder="Enter your prompt…" style={{...inp,height:180,resize:"vertical",lineHeight:1.6,marginBottom:10}}/>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={runStudio} disabled={studio.loading||!studio.prompt.trim()||!config.apiKey}
              style={{flex:1,padding:"8px",borderRadius:7,border:"none",background:studio.loading||!config.apiKey?V.s3:"linear-gradient(135deg,#4285F4,#34A853)",color:studio.loading||!config.apiKey?V.t4:"white",fontSize:12,fontWeight:600,cursor:studio.loading||!config.apiKey?"not-allowed":"pointer",display:"flex",gap:8,alignItems:"center",justifyContent:"center"}}>
              {studio.loading?<><Spinner c="white"/> Running…</>:<><Play size={13}/> Run</>}
            </button>
            {studio.output && (
              <button onClick={()=>{
                const id=`p-${Date.now()}`;
                const np={id,title:`Prompt ${new Date().toLocaleDateString()}`,prompt:studio.prompt,system:studio.system,tags:[],notes:"",starred:false,createdAt:Date.now(),runs:1};
                const next=[np,...prompts]; setPrompts(next); persist(undefined,next,undefined);
              }} style={{padding:"8px 12px",borderRadius:7,border:`1px solid ${V.blue}44`,background:`${V.blue}14`,color:V.blue,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>
                Save to Library
              </button>
            )}
          </div>
          {!config.apiKey && <div style={{fontSize:10,color:V.red,marginTop:6}}>Add API key in Setup to run prompts.</div>}
        </div>
        {/* Prompt templates */}
        {prompts.slice(0,4).length>0 && (
          <div style={card}>
            <div style={{fontSize:11,fontWeight:500,color:V.t3,marginBottom:8}}>Quick load from library</div>
            {prompts.slice(0,4).map(p=>(
              <button key={p.id} onClick={()=>loadToStudio(p)}
                style={{display:"block",width:"100%",textAlign:"left",padding:"5px 8px",borderRadius:5,border:`1px solid ${V.border}22`,background:"transparent",color:V.t3,fontSize:10,cursor:"pointer",marginBottom:4}}>
                {p.title}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Output panel */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{...card,flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Output</span>
            <div style={{display:"flex",gap:8,alignItems:"center",fontSize:10,color:V.t4}}>
              {studio.elapsed>0 && <span>{ms(studio.elapsed)}</span>}
              {(studio.tokens.i||studio.tokens.o)>0 && <span>{fmtTokens(studio.tokens.i,studio.tokens.o)}</span>}
              {studio.output && (
                <button onClick={()=>copy(studio.output,"studio")}
                  style={{padding:"2px 8px",borderRadius:4,border:`1px solid ${V.border}`,background:"transparent",color:copied==="studio"?V.green:V.t4,fontSize:10,cursor:"pointer"}}>
                  {copied==="studio"?"Copied!":"Copy"}
                </button>
              )}
            </div>
          </div>
          {studio.loading && (
            <div style={{display:"flex",gap:10,alignItems:"center",padding:"20px 0",color:V.t3,fontSize:12}}>
              <Spinner/> Generating with {MODELS.find(m=>m.id===studio.model)?.label}…
            </div>
          )}
          {studio.error && (
            <div style={{...outBox,color:V.red,background:"rgba(234,67,53,0.08)",borderColor:"rgba(234,67,53,0.3)"}}>
              Error: {studio.error}
            </div>
          )}
          {studio.output && !studio.loading && (
            <div style={{...outBox,flex:1,maxHeight:460,animation:"fade 0.2s ease"}}>{studio.output}</div>
          )}
          {!studio.output && !studio.loading && !studio.error && (
            <div style={{...outBox,color:V.t4,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",flex:1}}>
              Output will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── COMPARE TAB ───────────────────────────────────────────────────
  const renderCompare = ()=>(
    <div>
      <div style={{...card,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:V.t2,marginBottom:10}}>Prompt</div>
        <div style={{marginBottom:8}}>
          <label style={{fontSize:9,color:V.t4,display:"block",marginBottom:3}}>System instruction</label>
          <input value={compare.system} onChange={e=>setCompare(c=>({...c,system:e.target.value}))}
            style={inp} placeholder="Optional…"/>
        </div>
        <textarea value={compare.prompt} onChange={e=>setCompare(c=>({...c,prompt:e.target.value}))}
          placeholder="Prompt to run across all selected models…"
          style={{...inp,height:100,resize:"vertical",lineHeight:1.6,marginBottom:10}}/>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {MODELS.map(m=>(
              <button key={m.id} onClick={()=>setCompare(c=>({...c,models:c.models.includes(m.id)?c.models.filter(x=>x!==m.id):[...c.models,m.id]}))}
                style={{padding:"3px 9px",borderRadius:5,border:`1px solid ${compare.models.includes(m.id)?m.color:"rgba(255,255,255,0.08)"}`,background:compare.models.includes(m.id)?`${m.color}22`:"transparent",color:compare.models.includes(m.id)?m.color:V.t4,fontSize:10,cursor:"pointer"}}>
                {m.badge}
              </button>
            ))}
          </div>
          <button onClick={runCompare} disabled={!compare.prompt.trim()||compare.models.length===0||!config.apiKey||Object.values(compare.loading).some(Boolean)}
            style={{padding:"7px 20px",borderRadius:7,border:"none",background:!compare.prompt.trim()||!config.apiKey?"transparent":"linear-gradient(135deg,#4285F4,#9C27B0)",color:!compare.prompt.trim()||!config.apiKey?V.t4:"white",fontSize:12,fontWeight:600,cursor:!compare.prompt.trim()||!config.apiKey?"not-allowed":"pointer",display:"flex",gap:8,alignItems:"center"}}>
            {Object.values(compare.loading).some(Boolean)?<><Spinner c="white"/> Running…</>:<><GitCompare size={12}/> Compare ({compare.models.length})</>}
          </button>
        </div>
        {!config.apiKey && <div style={{fontSize:10,color:V.red,marginTop:6}}>Add API key in Setup.</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(compare.models.length,3)},1fr)`,gap:10}}>
        {compare.models.map(modelId=>{
          const m = MODELS.find(x=>x.id===modelId);
          const res = compare.results[modelId];
          const err = compare.errors[modelId];
          const isLoading = compare.loading[modelId];
          return (
            <div key={modelId} style={{...card,borderColor:`${m?.color||V.blue}33`}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:m?.color||V.blue,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:600,color:m?.color||V.blue}}>{m?.label}</span>
                {res && <span style={{marginLeft:"auto",fontSize:9,color:V.t4}}>{ms(res.elapsed)} · {fmtTokens(res.tokens?.inputTokens,res.tokens?.outputTokens)}</span>}
                {res && <button onClick={()=>copy(res.text,modelId+"cmp")} style={{color:copied===modelId+"cmp"?V.green:V.t4,background:"none",border:"none",cursor:"pointer"}}><Copy size={11}/></button>}
              </div>
              {isLoading && <div style={{display:"flex",gap:8,alignItems:"center",color:V.t3,fontSize:11,padding:"12px 0"}}><Spinner c={m?.color}/> Generating…</div>}
              {err && <div style={{fontSize:10,color:V.red,lineHeight:1.6}}>{err}</div>}
              {res && <div style={{...outBox,fontSize:10,maxHeight:320,animation:"fade 0.2s ease"}}>{res.text}</div>}
              {!isLoading&&!err&&!res && <div style={{...outBox,color:V.t4,textAlign:"center",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>Waiting…</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── HISTORY TAB ────────────────────────────────────────────────────
  const renderHistory = ()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:12,color:V.t3}}>{history.length} runs logged</span>
        {history.length>0 && (
          <button onClick={()=>{if(confirm("Clear run history?")){ setHistory([]); persist(undefined,undefined,[]); }}}
            style={{padding:"4px 10px",borderRadius:5,border:`1px solid rgba(234,67,53,0.3)`,background:"transparent",color:V.red,fontSize:11,cursor:"pointer"}}>
            Clear history
          </button>
        )}
      </div>
      {history.length===0 && (
        <div style={{...card,textAlign:"center",padding:"40px",borderStyle:"dashed"}}>
          <Clock size={28} style={{margin:"0 auto 10px",color:V.t4}}/>
          <div style={{color:V.t2,fontSize:13,fontWeight:500,marginBottom:6}}>No runs yet</div>
          <div style={{color:V.t4,fontSize:11}}>Runs from Studio and Compare will appear here automatically.</div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {history.map(h=>{
          const m=MODELS.find(x=>x.id===h.model);
          return (
            <div key={h.id} style={card}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                {pill(m?.badge||h.model,m?.color||V.blue,`${m?.color||V.blue}18`)}
                <span style={{fontSize:10,color:V.t4}}>{new Date(h.at).toLocaleString()}</span>
                <span style={{fontSize:10,color:V.t4}}>{ms(h.elapsed)}</span>
                {h.tokens && <span style={{fontSize:10,color:V.t4}}>{fmtTokens(h.tokens.inputTokens,h.tokens.outputTokens)}</span>}
                <button onClick={()=>{ setStudio(s=>({...s,prompt:h.prompt,output:"",error:"",model:h.model})); setTab("studio"); }}
                  style={{marginLeft:"auto",padding:"2px 8px",borderRadius:4,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:9,cursor:"pointer"}}>
                  Re-run in Studio
                </button>
                <button onClick={()=>copy(h.output,h.id)}
                  style={{padding:"2px 8px",borderRadius:4,border:`1px solid ${V.border}`,background:"transparent",color:copied===h.id?V.green:V.t4,fontSize:9,cursor:"pointer"}}>
                  {copied===h.id?"Copied!":"Copy output"}
                </button>
              </div>
              <div style={{fontSize:10,color:V.t3,marginBottom:6,fontFamily:"monospace",lineHeight:1.5,maxHeight:36,overflow:"hidden",maskImage:"linear-gradient(to right,#fff 80%,transparent)"}}>
                ↑ {h.prompt}
              </div>
              <div style={{fontSize:10,color:V.t2,lineHeight:1.6,maxHeight:80,overflow:"hidden",maskImage:"linear-gradient(to bottom,#fff 60%,transparent)"}}>
                {h.output}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── ROOT ─────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:V.s1,fontFamily:"'Geist',system-ui,sans-serif",color:V.t2,position:"relative"}}>
      <div style={{background:V.s2,borderBottom:`1px solid ${V.border}`,padding:"14px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:15,letterSpacing:-0.3}}>
            <span style={{background:V.gemini,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI Studio</span>
            <span style={{color:V.t4,fontWeight:400,fontSize:12}}> / {config.projectName}</span>
          </span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved && <span style={{fontSize:10,color:V.green}}>Saved ✓</span>}
            {!config.apiKey && pill("No API key",V.red,"rgba(234,67,53,0.12)")}
            <a href="https://aistudio.google.com" target="_blank" rel="noreferrer"
              style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${V.border}`,background:"transparent",color:V.t3,fontSize:11,display:"flex",gap:5,alignItems:"center",textDecoration:"none"}}>
              <ExternalLink size={11}/> Open AI Studio
            </a>
          </div>
        </div>
        <div style={{display:"flex",gap:0}}>
          {[
            {id:"setup",icon:<Settings size={12}/>,label:"Setup"},
            {id:"library",icon:<BookOpen size={12}/>,label:`Library (${prompts.length})`},
            {id:"studio",icon:<Play size={12}/>,label:"Studio"},
            {id:"compare",icon:<GitCompare size={12}/>,label:"Compare"},
            {id:"history",icon:<Clock size={12}/>,label:`History (${history.length})`},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"7px 14px",border:"none",borderBottom:tab===t.id?`2px solid ${V.blue}`:"2px solid transparent",borderRadius:"5px 5px 0 0",background:tab===t.id?V.s1:"transparent",color:tab===t.id?V.t1:V.t4,fontSize:11,fontWeight:tab===t.id?600:400,cursor:"pointer",display:"flex",gap:5,alignItems:"center",transition:"all 0.15s"}}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 20px 48px"}}>
        {tab==="setup"   && renderSetup()}
        {tab==="library" && renderLibrary()}
        {tab==="studio"  && renderStudio()}
        {tab==="compare" && renderCompare()}
        {tab==="history" && renderHistory()}
      </div>
    </div>
  );
}
