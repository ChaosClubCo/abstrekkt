import { useState, useEffect } from "react";

// ─── Config ──────────────────────────────────────────────────────────────────
const BUILD_TYPES = [
  "React Artifact","Live Artifact (API-powered)","Prompting Toolkit",
  "Base44 App","n8n Workflow","API / Backend","Chrome Extension","Other",
];
const SCOPES = ["LITE","STANDARD","FULL"];
const TABS = [
  { key: "outcome_contract",      label: "Outcome"     },
  { key: "states",                label: "States"      },
  { key: "data_contract",         label: "Data"        },
  { key: "failure_taxonomy",      label: "Failures"    },
  { key: "platform_constraints",  label: "Platform"    },
  { key: "adversarial_questions", label: "Adversarial" },
  { key: "unknown_unknowns",      label: "Unknowns"    },
];

// ─── Phase 1 prompts (spec generation) ──────────────────────────────────────
const SPEC_PROMPTS = {
  outcome_contract:`Return ONLY valid JSON. No markdown fences, no preamble.
{"outcome_contract":{"working":"success in one sentence","failure":"failure — wrong UX, missing state, bad output, not just crashes","context":"who uses it, in what environment, how often"}}`,
  states:`Return ONLY valid JSON. No markdown fences, no preamble.
Enumerate every state this system can be in — including async and edge states.
{"states":["state description"]}
LITE=4. STANDARD=6-7. FULL=exhaustive.`,
  data_contract:`Return ONLY valid JSON. No markdown fences, no preamble.
{"data_contract":{"inputs":["name:type:validation rule"],"outputs":["name:format:nullable?"],"source":"source of truth","constraints":["size, rate, or format limits"]}}
LITE=3-4 per array. STANDARD=5-7. FULL=exhaustive.`,
  failure_taxonomy:`Return ONLY valid JSON. No markdown fences, no preamble.
Categories: Network, API, Data, Input, UI, Platform, Auth, Cost, Race.
{"failure_taxonomy":[{"mode":"what fails","cat":"Category","fix":"specific mitigation"}]}
LITE=4. STANDARD=6-7. FULL=exhaustive. Be specific to the build type.`,
  platform_constraints:`Return ONLY valid JSON. No markdown fences, no preamble.
React Artifact: no localStorage/sessionStorage, no runtime npm, CORS blocks external, React state only, bundled libs only
Live Artifact: no client API key, max_tokens is a real output limit, streaming interruption must be handled
Base44: bearer auth, n8n webhook integration, Supabase data layer
n8n: node execution order, credential scoping, webhook URL exposure, error branches required
Prompting Toolkit: injection surface, output variability, eval criteria, model version pinning
Chrome Extension: MV3 service worker lifecycle, CSP restrictions, cross-origin messaging limits
API/Backend: auth/session, injection vectors, rate limiting, secret exposure via bundle
{"platform_constraints":["concrete gotcha for the declared build type only"]}
LITE=3-4. STANDARD=5-7. FULL=exhaustive.`,
  adversarial_questions:`Return ONLY valid JSON. No markdown fences, no preamble.
{"adversarial_questions":["specific question about this build"]}
Cover: what breaks in 5 min, what was assumed handled, input/output extremes, worst user action.
LITE=4. STANDARD=5-6. FULL=7+.`,
  unknown_unknowns:`Return ONLY valid JSON. No markdown fences, no preamble.
{"unknown_unknowns":["specific overlooked thing — not generic advice"]}
LITE=3-4. STANDARD=5-7. FULL=exhaustive.`,
};

// ─── Phase 2 prompts (artifact generation) ───────────────────────────────────
const ARTIFACT_CONFIG = {
  outcome_contract: {
    label: "Build Prompt",
    useFullSpec: true,
    hint: "Ready-to-paste context for your actual build session",
    system: `You receive a complete build spec. Produce a ready-to-paste build prompt for a new Claude session that will do the actual implementation.

Structure it as plain text in this order:
1. What is being built — specific, one sentence
2. Build type and environment
3. Done looks like — exact success criteria
4. Broken looks like — what the build must handle and recover from
5. States to implement — every state listed
6. Failure modes to handle — each category with its mitigation approach
7. Platform hard constraints — non-negotiable limits
8. Data contract — inputs with validation, outputs with format
9. Pre-mortem — the top unknown unknowns to address proactively

Output plain text only. No JSON. No markdown headers. Write as a tech lead briefing a developer who has not read the spec.`,
  },
  states: {
    label: "State Scaffold",
    hint: "useReducer / state machine with every state typed",
    system: `You receive a list of states and a build type. Produce a production-ready state management scaffold.

React Artifact or Live Artifact:
- TypeScript useReducer with a Status union type covering every listed state
- A typed State object with status, data, and error fields
- An Action discriminated union for each transition
- An initial state constant
- The reducer function with a case for each action

API/Backend:
- TypeScript enum for all states
- A typed StateContext object
- Allowed transition map
- A transition() function that validates and applies transitions

n8n Workflow or Base44:
- JSON schema describing workflow state
- Field comments describing what triggers each state

Output TypeScript/JavaScript code only. Comments explain the purpose of each state and transition.`,
  },
  data_contract: {
    label: "Type Definitions",
    hint: "TypeScript interfaces + Zod schema + parse function",
    system: `You receive a data contract with inputs, outputs, source of truth, and constraints. Produce:

1. A TypeScript Input interface with JSDoc on each field including the validation rule
2. A TypeScript Output interface with JSDoc on each field including nullability
3. A Zod input schema with all constraints applied (.min, .max, .regex, .refine, .optional, .nullable as appropriate)
4. A typed parseInput function that validates and returns Input or throws with a descriptive ZodError message
5. A typed parseOutput function that validates the output shape

Output TypeScript code only. Import zod as z. No prose.`,
  },
  failure_taxonomy: {
    label: "Error Scaffold",
    hint: "Error class, classifier, per-category handlers, user message map",
    system: `You receive a failure taxonomy with mode, category, and mitigation. Produce a production-ready error handling scaffold.

Include:
1. An AppError class extending Error with a category field typed as a union of all categories in the taxonomy
2. A classifyError(err: unknown): AppError function that maps raw errors to the right category
3. Per-category handler stubs — body of each is a comment with the exact mitigation strategy from the spec
4. A USER_MESSAGES record mapping each category to a clear, non-technical user-facing string
5. For React builds: an ErrorBoundary component that catches, classifies, and displays the user message

Output TypeScript code only. Mitigation comments must be specific and actionable, not just restatements of the category name.`,
  },
  platform_constraints: {
    label: "Pre-Ship Checklist",
    hint: "Verify-before-merge checklist grouped by severity",
    system: `You receive platform constraints for a software build. Produce a pre-ship checklist in Markdown.

Format each item exactly as:
- [ ] **Short constraint name** — why it will break if ignored — how to verify it (specific test or check)

Group into two sections:
## Critical
(items that will cause silent bugs or breakage in production)

## Important
(items that cause degraded UX, missing functionality, or future pain)

Output Markdown only. No intro sentence. Each item must have all three parts: name, why, and how to verify.`,
  },
  adversarial_questions: {
    label: "Test Scenarios",
    hint: "Test file with describe/it stubs, one block per question",
    system: `You receive adversarial questions about a software build. Produce a JavaScript test file using describe/it/expect syntax (compatible with Jest, the vite test runner, or any xUnit-style framework).

For each question:
- One describe() block named after the question (verbatim)
- Two to three it() stubs that exercise the scenario from different angles
- // SETUP: comment describing the test fixture needed
- // ACTION: comment describing what to call or trigger
- An expect() placeholder with // ASSERT: comment

At the top: add the appropriate import for describe, it, expect, and vi/jest mock utilities.
Mark any it() requiring a mock with // MOCK: and describe what needs to be mocked.

Output code only. Stubs must be syntactically valid (empty bodies are fine).`,
  },
  unknown_unknowns: {
    label: "Task List",
    hint: "Structured pre-mortem tickets with acceptance criteria",
    system: `You receive a list of unknown unknowns for a software build. Produce a structured Markdown task list.

For each item produce:

### [Action-oriented title — starts with a verb: "Handle", "Validate", "Audit", "Add", etc.]
- **Why it matters:** one sentence
- **Acceptance criteria:**
  - testable condition 1
  - testable condition 2
  - testable condition 3
- **First action:** one concrete step to take right now

Output Markdown only. No intro. Every title must be action-oriented. Acceptance criteria must be testable, not vague.`,
  },
};

// ─── Misc ────────────────────────────────────────────────────────────────────
const CAT_COLOR = {
  Network:"#f59e0b", API:"#3b82f6", Data:"#10b981", Input:"#60a5fa",
  UI:"#6b7280", Platform:"#a78bfa", Auth:"#ef4444", Cost:"#f59e0b", Race:"#ef4444",
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── API helpers ─────────────────────────────────────────────────────────────
async function fetchSection(key, userMsg) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
      system:SPEC_PROMPTS[key], messages:[{role:"user",content:userMsg}] }),
  });
  if (!resp.ok) { const b = await resp.json().catch(()=>({})); throw new Error(b?.error?.message||`HTTP ${resp.status}`); }
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  const raw = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
  if (s===-1||e<s) throw new Error("no JSON in response");
  try { const p = JSON.parse(raw.slice(s,e+1)); return p[key]!==undefined ? p[key] : p; }
  catch(err) { throw new Error(`parse: ${err.message}`); }
}

async function fetchArtifact(system, userMsg) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
      system, messages:[{role:"user",content:userMsg}] }),
  });
  if (!resp.ok) { const b = await resp.json().catch(()=>({})); throw new Error(b?.error?.message||`HTTP ${resp.status}`); }
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function App() {
  const [desc,setDesc]         = useState("");
  const [btype,setBtype]       = useState("React Artifact");
  const [scope,setScope]       = useState("STANDARD");
  const [running,setRunning]   = useState(false);
  const [current,setCurrent]   = useState("");
  const [done,setDone]         = useState(0);
  const [spec,setSpec]         = useState(null);
  const [errs,setErrs]         = useState({});
  const [tab,setTab]           = useState(0);
  const [copied,setCopied]     = useState(null);
  // Phase 2: { [key]: { status:'idle'|'loading'|'done'|'error', output:string, error:string } }
  const [artifacts,setArtifacts] = useState({});

  useEffect(()=>{
    const link=document.createElement("link"); link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return ()=>{ try{document.head.removeChild(link);}catch(_){} };
  },[]);

  // ── Phase 1: generate spec ──────────────────────────────────────────────
  const generateSpec = async () => {
    if (!desc.trim()||running) return;
    setRunning(true); setDone(0); setSpec({}); setErrs({}); setArtifacts({}); setTab(0);
    const msg = `Build: ${desc}\nType: ${btype}\nScope: ${scope}`;
    for (let i=0;i<TABS.length;i++) {
      const {key,label}=TABS[i]; setCurrent(label);
      try { const v=await fetchSection(key,msg); setSpec(prev=>({...prev,[key]:v})); }
      catch(e) { setErrs(prev=>({...prev,[key]:e.message})); }
      setDone(i+1);
      if (i<TABS.length-1) await sleep(300);
    }
    setCurrent(""); setRunning(false);
  };

  // ── Phase 2: generate artifact for a section ───────────────────────────
  const generateArtifact = async (key) => {
    if (!spec?.[key]) return;
    const cfg = ARTIFACT_CONFIG[key];
    setArtifacts(prev=>({...prev,[key]:{status:"loading",output:null,error:null}}));
    const userMsg = cfg.useFullSpec
      ? `Build: ${desc}\nType: ${btype}\nScope: ${scope}\n\nFull Spec:\n${JSON.stringify(spec,null,2)}`
      : `Build: ${desc}\nType: ${btype}\nScope: ${scope}\n\nSection data:\n${JSON.stringify(spec[key],null,2)}`;
    try {
      const output = await fetchArtifact(cfg.system, userMsg);
      setArtifacts(prev=>({...prev,[key]:{status:"done",output,error:null}}));
    } catch(e) {
      setArtifacts(prev=>({...prev,[key]:{status:"error",output:null,error:e.message}}));
    }
  };

  const doCopy = (content,id) => {
    navigator.clipboard.writeText(typeof content==="string"?content:JSON.stringify(content,null,2));
    setCopied(id); setTimeout(()=>setCopied(null),1800);
  };

  // ── Style atoms ────────────────────────────────────────────────────────
  const sans = {fontFamily:"'IBM Plex Sans', system-ui, sans-serif"};
  const mono = {fontFamily:"'IBM Plex Mono', monospace"};
  const inputS = {...sans,background:"#08080f",border:"1px solid #1e1e30",borderRadius:7,padding:"8px 12px",color:"#e5e7eb",fontSize:13,outline:"none"};
  const ghostS = {...sans,background:"transparent",border:"1px solid #1e1e30",borderRadius:5,padding:"3px 9px",color:"#555570",fontSize:11,cursor:"pointer"};
  const rowS   = {fontSize:13,color:"#c5cae8",padding:"7px 11px",background:"#0c0c1c",borderRadius:6,marginBottom:5,display:"flex",gap:9,lineHeight:1.5};
  const tabBtn = (active,state) => ({...sans,padding:"9px 13px",background:"transparent",border:"none",
    borderBottom:`2px solid ${active?"#4ade80":"transparent"}`,
    color:active?"#4ade80":state==="error"?"#ef4444":state==="done"?"#9ca3af":"#3a3a55",
    fontSize:12,fontWeight:active?500:400,cursor:"pointer",whiteSpace:"nowrap"});

  // ── Spec section renderer ──────────────────────────────────────────────
  const renderSpec = (key) => {
    if (!spec) return null;
    if (errs[key]) return <div style={{fontSize:13,color:"#fca5a5",padding:"8px 12px",background:"rgba(239,68,68,0.07)",borderRadius:6}}>Failed: {errs[key]}</div>;
    if (spec[key]===undefined) return (
      <div style={{display:"flex",gap:10,alignItems:"center",padding:"12px 0"}}>
        <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid #1e1e30",borderTopColor:"#4ade80",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
        <span style={{...mono,fontSize:12,color:"#3a3a55"}}>waiting…</span>
      </div>
    );
    const val = spec[key];
    if (!val) return <div style={{color:"#555570",fontSize:13}}>No data.</div>;

    if (key==="outcome_contract") return Object.entries(val).map(([k,v])=>(
      <div key={k} style={{marginBottom:10,padding:"10px 13px",background:"#0c0c1c",borderRadius:8,borderLeft:"2px solid #4ade80"}}>
        <div style={{...mono,fontSize:11,color:"#4ade80",opacity:.7,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{k.replace(/_/g," ")}</div>
        <div style={{fontSize:13,color:"#d1d5db",lineHeight:1.6}}>{v}</div>
      </div>
    ));

    if (key==="data_contract") return Object.entries(val).map(([k,v])=>(
      <div key={k} style={{marginBottom:14}}>
        <div style={{fontSize:11,color:"#555570",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,fontWeight:500}}>{k.replace(/_/g," ")}</div>
        {Array.isArray(v)
          ? v.map((item,i)=><div key={i} style={rowS}><span style={{color:"#4ade80",flexShrink:0}}>›</span>{item}</div>)
          : <div style={{...rowS,display:"block"}}>{v}</div>}
      </div>
    ));

    if (key==="failure_taxonomy") return (val||[]).map((item,i)=>(
      <div key={i} style={{marginBottom:8,padding:"10px 13px",background:"#0c0c1c",borderRadius:8,borderLeft:`2px solid ${CAT_COLOR[item.cat]||"#4b5563"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{fontSize:13,color:"#e5e7eb",fontWeight:500,lineHeight:1.4}}>{item.mode}</div>
          <span style={{...mono,fontSize:10,padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap",flexShrink:0,
            background:`${CAT_COLOR[item.cat]||"#4b5563"}18`,color:CAT_COLOR[item.cat]||"#6b7280",
            border:`1px solid ${CAT_COLOR[item.cat]||"#4b5563"}30`}}>{item.cat}</span>
        </div>
        <div style={{fontSize:12,color:"#6b7280",marginTop:5}}>↳ {item.fix||item.mitigation}</div>
      </div>
    ));

    const items = Array.isArray(val)?val:[String(val)];
    return items.map((item,i)=>(
      <div key={i} style={rowS}><span style={{color:"#4ade80",flexShrink:0}}>›</span><span>{item}</span></div>
    ));
  };

  // ── Artifact output renderer ───────────────────────────────────────────
  const renderArtifact = (key) => {
    const a = artifacts[key];
    const cfg = ARTIFACT_CONFIG[key];
    if (!spec?.[key] && !errs[key]) return null; // section hasn't loaded yet

    return (
      <div style={{marginTop:16,borderTop:"1px solid #1a1a2e",paddingTop:16}}>
        {/* Generate button or status */}
        {(!a || a.status==="idle") && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{...mono,fontSize:11,color:"#3a3a55"}}>{cfg.hint}</div>
            <button onClick={()=>generateArtifact(key)} style={{
              ...sans,padding:"5px 14px",background:"rgba(74,222,128,0.08)",
              border:"1px solid rgba(74,222,128,0.2)",borderRadius:6,
              color:"#4ade80",fontSize:12,fontWeight:500,cursor:"pointer"}}>
              Generate {cfg.label} →
            </button>
          </div>
        )}

        {a?.status==="loading" && (
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid #1e1e30",borderTopColor:"#4ade80",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
            <span style={{...mono,fontSize:12,color:"#3a3a55"}}>generating {cfg.label.toLowerCase()}…</span>
          </div>
        )}

        {a?.status==="error" && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div style={{fontSize:12,color:"#fca5a5"}}>Failed: {a.error}</div>
            <button onClick={()=>generateArtifact(key)} style={{...ghostS,fontSize:11}}>retry</button>
          </div>
        )}

        {a?.status==="done" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{...mono,fontSize:11,color:"#4ade80",opacity:.7,textTransform:"uppercase",letterSpacing:"0.07em"}}>{cfg.label}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>generateArtifact(key)} style={ghostS}>regenerate</button>
                <button onClick={()=>doCopy(a.output,key+"_artifact")} style={ghostS}>
                  {copied===key+"_artifact"?"✓ copied":"copy"}
                </button>
              </div>
            </div>
            <pre style={{
              ...mono,fontSize:12,color:"#c5cae8",background:"#0a0a18",
              border:"1px solid #1a1a2e",borderRadius:8,padding:"14px 16px",
              margin:0,overflowX:"auto",whiteSpace:"pre-wrap",wordBreak:"break-word",
              lineHeight:1.65,maxHeight:420,overflowY:"auto"}}>
              {a.output}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // ── Docs ───────────────────────────────────────────────────────────────
  const DOCS=[
    {h:"Two phases",body:"Phase 1 generates the spec — 7 sequential calls, one section each. Phase 2 generates the artifact — one more call that turns each section into something actionable: code, a prompt, a checklist, or a task list. The artifact is what you actually use during the build."},
    {h:"What each section produces",rows:[
      ["Outcome","Build Prompt — ready-to-paste context for your actual build session. Uses the full spec so it references states, failures, and constraints."],
      ["States","State Scaffold — useReducer with every state typed, or a state machine for backend/workflow builds."],
      ["Data","Type Definitions — TypeScript interfaces + Zod schema + parse functions with all validation rules applied."],
      ["Failures","Error Scaffold — AppError class, classifier function, per-category handler stubs, user message map, ErrorBoundary for React."],
      ["Platform","Pre-Ship Checklist — markdown checklist grouped by severity with how-to-verify for each item."],
      ["Adversarial","Test Scenarios — test file with describe/it stubs, one block per adversarial question."],
      ["Unknowns","Task List — structured pre-mortem tickets with acceptance criteria and first action per item."],
    ]},
    {h:"Workflow",rows:[
      ["1. Generate spec","Describe your build, pick type and scope, hit Generate."],
      ["2. Read Unknowns first","The most valuable section. Treat each item as a ticket."],
      ["3. Generate artifacts","Click Generate in each section to produce the code/doc/prompt."],
      ["4. Copy Build Prompt","Paste it at the top of your actual build session as context."],
      ["5. Use the scaffolds","Paste state scaffold, type defs, and error scaffold into your project before writing feature code."],
    ]},
  ];
  const renderDocs=()=>(
    <div>{DOCS.map((s,i)=>(
      <div key={i} style={{marginBottom:24}}>
        <div style={{...mono,fontSize:11,color:"#4ade80",opacity:.8,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>{s.h}</div>
        {s.body&&<div style={{fontSize:13,color:"#9ca3b8",lineHeight:1.7}}>{s.body}</div>}
        {s.rows&&s.rows.map(([l,t],j)=>(
          <div key={j} style={{marginBottom:7,padding:"9px 12px",background:"#0c0c1c",borderRadius:7,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{...mono,fontSize:11,color:"#4ade80",whiteSpace:"nowrap",marginTop:1,minWidth:90}}>{l}</div>
            <div style={{fontSize:13,color:"#9ca3b8",lineHeight:1.6}}>{t}</div>
          </div>
        ))}
      </div>
    ))}</div>
  );

  const sectionState = (key) => {
    if (errs[key]) return "error";
    if (spec?.[key]!==undefined) return "done";
    return "pending";
  };
  const hasContent = spec!==null && (Object.keys(spec).length>0||Object.keys(errs).length>0);
  const currentTab = TABS[tab];

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{...sans,background:"#080810",color:"#e5e7eb",minHeight:"100vh",padding:20,boxSizing:"border-box"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{marginBottom:20,display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:"#f0f0ff",letterSpacing:"-0.01em"}}>Pre-Build Spec</div>
          <div style={{fontSize:11,color:"#3a3a55",marginTop:3}}>spec → scaffold → build</div>
        </div>
        <div style={{...mono,fontSize:11,color:"#2a2a40"}}>7 sections · 2 phases</div>
      </div>

      {/* Input */}
      <div style={{background:"#10101e",border:"1px solid #1e1e30",borderRadius:10,padding:16,marginBottom:14}}>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey)generateSpec();}}
          placeholder="Describe what you're building — data sources, user interactions, integrations, outputs, known edge cases..."
          rows={4} style={{...inputS,width:"100%",boxSizing:"border-box",lineHeight:1.6,resize:"vertical",marginBottom:12,padding:"10px 12px"}}/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <select value={btype} onChange={e=>setBtype(e.target.value)} style={{...inputS,flex:1,minWidth:150}}>
            {BUILD_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={scope} onChange={e=>setScope(e.target.value)} style={{...inputS,width:110}}>
            {SCOPES.map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={generateSpec} disabled={running||!desc.trim()} style={{
            ...sans,padding:"8px 20px",border:"none",borderRadius:7,fontSize:13,fontWeight:600,transition:"all 0.15s",
            background:running||!desc.trim()?"#1e1e30":"#4ade80",
            color:running||!desc.trim()?"#3a3a55":"#080810",
            cursor:running||!desc.trim()?"not-allowed":"pointer"}}>
            {running?`${done}/7 — ${current}`:"Generate spec"}
          </button>
        </div>
      </div>

      {/* Output panel */}
      <div style={{background:"#10101e",border:"1px solid #1e1e30",borderRadius:10,overflow:"hidden"}}>

        {/* Tab bar */}
        <div style={{display:"flex",borderBottom:"1px solid #1e1e30",overflowX:"auto",padding:"0 4px"}}>
          {(hasContent||running) && TABS.map(({key,label},i)=>(
            <button key={key} onClick={()=>setTab(i)} style={tabBtn(tab===i,sectionState(key))}>
              {label}
              {running&&sectionState(key)==="pending"&&<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#2a2a40",marginLeft:5,verticalAlign:"middle"}}/>}
            </button>
          ))}
          <button onClick={()=>setTab(7)} style={{...tabBtn(tab===7,"done"),marginLeft:(hasContent||running)?"auto":0}}>
            ? Docs
          </button>
        </div>

        {/* Content */}
        <div style={{padding:16}}>
          {tab===7 ? renderDocs() : (hasContent||running) ? (
            <>
              {/* Section header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{...mono,fontSize:11,color:"#3a3a55",textTransform:"uppercase",letterSpacing:"0.07em"}}>
                  {currentTab?.label}
                </div>
                {spec?.[currentTab?.key] && (
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>doCopy(spec[currentTab.key],currentTab.key)} style={ghostS}>
                      {copied===currentTab.key?"✓":"copy"}
                    </button>
                    <button onClick={()=>doCopy(spec,"all")} style={ghostS}>
                      {copied==="all"?"✓ all":"copy all JSON"}
                    </button>
                  </div>
                )}
              </div>

              {/* Spec items */}
              {renderSpec(currentTab?.key)}

              {/* Phase 2 artifact generation */}
              {currentTab && ARTIFACT_CONFIG[currentTab.key] && renderArtifact(currentTab.key)}
            </>
          ) : renderDocs()}
        </div>
      </div>

      <div style={{...mono,marginTop:16,fontSize:11,color:"#1e1e30",textAlign:"center"}}>⌘↵ to generate spec</div>
    </div>
  );
}
