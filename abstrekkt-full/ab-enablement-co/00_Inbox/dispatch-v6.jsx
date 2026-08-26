/* ── PRO MOVE COMPATIBILITY NOTES ─────────────────────────────────────────────
 * DEFERRED: Weekly digest mode — requires accumulation data model incompatible
 *   with current 4-field structure. Tracked: ROADMAP.weeklyDigest.
 * DEFERRED: Persistent true sidebar for history — implemented as collapsible
 *   panel (full-width, below output). Sidebar requires min-width ~1100px;
 *   mobile-first directive (< 768 = single column) wins. Deferred to v2.
 * ─────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback, Component } from "react";

// ── BRAND CONFIG — all tokens isolated here; swap once for white-label ────────
const BRAND = {
  name:       "Kyle's Dispatch",
  subtitle:   "What you built → LinkedIn + X, ready to post",
  badge:      "DISPATCH // BUILDING IN PUBLIC",
  version:    "1.0.0",
  ink:        "#1C1917", surface:    "#231F1C", surface2:   "#2C2723",
  borderSub:  "#2E2924", borderMid:  "#3D3630", borderAct:  "#5A4A36",
  brass:      "#C8A86A", brassDark:  "#8B6E3E", brassAct:   "#A88B4A",
  sage:       "#6BAA8A", terra:      "#B85A3A",
  dim1:       "#5C4E42", dim2:       "#7A6654", dim3:       "#9E876D",
  textLight:  "#C4A882", textBody:   "#D4BF9E", textInput:  "#E8D8C0",
  textBright: "#F8F0E4", textWhite:  "#FDF8F2",
  fontDisplay:"'Fraunces', Georgia, serif",
  fontBody:   "'Crimson Pro', Georgia, serif",
  fontMono:   "'JetBrains Mono', 'Courier New', monospace",
};
// Client-mode neutral brand — swapped in when clientMode === true
const BRAND_CLIENT = {
  ...BRAND,
  name:    "Dispatch",
  subtitle:"Work notes → published posts",
  badge:   "DISPATCH",
};

// ── DATA ───────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:"flashfusion", label:"FlashFusion",  emoji:"⚡", safe:true  },
  { id:"ai-learning", label:"AI / Tooling", emoji:"🧠", safe:true  },
  { id:"intinc",      label:"Intinc (NDA)", emoji:"🔒", safe:false },
];
// clientMode strips internal identities — neutral labels for client-facing use
const CLIENT_PROJECTS = [
  { id:"project-a", label:"Project A", emoji:"◆", safe:true  },
  { id:"project-b", label:"Project B", emoji:"◆", safe:true  },
  { id:"project-c", label:"Project C", emoji:"◆", safe:false },
];

const TONES = [
  { id:"raw",        label:"Raw"        },
  { id:"technical",  label:"Technical"  },
  { id:"reflective", label:"Reflective" },
];

const FIELDS = [
  { key:"built",   label:"What I built / did",      placeholder:"Mapped 7 buyer personas to Wix store collections...",     required:true  },
  { key:"broke",   label:"What broke or was hard",  placeholder:"updateDeliveryCarrier API silently rejects appId...",     required:false },
  { key:"learned", label:"What I actually learned", placeholder:"Wix V1 Catalog has a completely different API surface...",required:false },
  { key:"next",    label:"What's next",             placeholder:"Manual shipping config — no REST endpoints for this...",  required:false },
];

const TONE_MAP = {
  raw:`Direct, honest, like a senior engineer texting a peer. Short punchy sentences. Admits when things went sideways.
PROHIBIT: "I'm grateful", "this journey", "excited to share", passive voice, vague lessons not tied to actual work.`,
  technical:`Technically precise. Specific tool names, API names, error codes, architecture decisions.
PROHIBIT: "AI-powered" without naming the model/API, broad lessons from narrow findings, abstracting details away.`,
  reflective:`Connects this specific event to a broader pattern. Direct — not preachy, not motivational.
PROHIBIT: Philosophical tangents ungrounded in the work, rhetorical questions as decoration, ending with a quote.`,
};

// Mock data — served in MOCK and FALLBACK modes
const MOCK_POSTS = {
  flashfusion:{
    linkedin:`Mapped 7 buyer personas to Wix store collections this week.\n\nWhat started as a simple taxonomy task became a full content audit. Most products weren't categorized for how buyers think — they were organized for how inventory was managed.\n\nThe Wix REST API doesn't always fail gracefully. Got a silent 200 on updateDeliveryCarrier that cost me two hours. Lesson: test your API error surface explicitly before trusting the happy path.\n\nHow do you handle APIs that lie to you?\n\n#BuildingInPublic`,
    twitter:`updateDeliveryCarrier returns 200 and does nothing. No error. No message. Test your API error surface before you trust the happy path.`,
  },
  "ai-learning":{
    linkedin:`Built a two-phase Drive search flow inside a Claude artifact this week.\n\nPhase 1: broad search returns 3 docs. Phase 2: selecting a doc triggers clarifier generation specific to that document — not a generic questionnaire.\n\nGeneric clarifiers are useless. Questions should come from the content. Most AI tools make users adapt to the tool. The better move is making the tool adapt to the content.\n\nAre you building tools that adapt to input or tools that expect input to conform?\n\n#AITooling #BuildingInPublic`,
    twitter:`Generic clarifiers are noise. Built a doc-specific clarifier generator today — questions from the content, not the template. Same architecture, completely different quality.`,
  },
  intinc:{
    linkedin:`Found a divergence between batch and real-time normalization paths in production this week.\n\nThe batch path handled edge cases with a fallback. The real-time path didn't. Both "correct" in isolation — neither had telemetry on the decision point.\n\nFixed in 10 minutes once found. Took hours to find. The root cause wasn't the bug — it was the missing instrumentation.\n\nWhat do you instrument proactively vs. only add after something breaks?\n\n#Engineering`,
    twitter:`Batch and real-time normalization paths diverged in production. No telemetry on the decision point. Fixed in 10 min, took 3 hrs to find. Instrument before you need to debug.`,
  },
};

const MOCK_SUGGESTIONS = [
  { title:"FlashFusion Session Notes — Client Build", summary:"Running log of decisions made during a client AI enablement engagement", angle:"The real decision-making behind an engagement — what you chose, why, and what you'd change", type:"doc" },
  { title:"Abstrekkt Weekly Build Log", summary:"Aggregate notes from a week of building across all lanes", angle:"The cumulative week is more honest than individual posts — shows the actual shape of a builder's work", type:"note" },
  { title:"Tool Audit — What Got Cut and Why", summary:"Documentation of a skills and tool library cleanup session", angle:"Pruning is underrated content. Most people document what they added, not what they removed and why", type:"doc" },
];

const MOCK_CLARIFIERS = [
  { question:"What was the most surprising thing you discovered?",                                         answer:"" },
  { question:"Who is the primary audience for this specific insight?",                                     answer:"" },
  { question:"What decision did you make that you second-guessed?",                                        answer:"" },
  { question:"What would someone with 5 years less experience not know from reading this?",                answer:"" },
];

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
// LinkedIn: 372k post analysis (AuthoredUp); X: <100 chars = +17% engagement
const LI_OPTIMAL_LOW  = 1300;
const LI_OPTIMAL_HIGH = 1900;
const LI_HARD_CAP     = 3000;
const X_TARGET        = 270;
const DRIVE_MCP = { type:"url", url:"https://drivemcp.googleapis.com/mcp/v1", name:"google-drive" };

const MODES = {
  live:    { label:"LIVE",     color:"#6BAA8A", tip:"API responding. Posts are generated by Claude in real time." },
  mock:    { label:"MOCK",     color:"#C8A86A", tip:"Demo mode active. Serving curated example posts — no API calls." },
  fallback:{ label:"FALLBACK", color:"#B85A3A", tip:"API unreachable after 3 retries. Serving mock content until connection restored." },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ls = {
  get:(k)=>{ try{ return localStorage.getItem(k); }catch{ return null; } },
  set:(k,v)=>{ try{ localStorage.setItem(k,v); }catch{} },
  rm:(k)=>{ try{ localStorage.removeItem(k); }catch{} },
};

const extractJSON = (raw) => {
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
  if (s===-1||e===-1) throw new Error("No JSON object in model response");
  return JSON.parse(raw.substring(s,e+1));
};

// Exponential backoff: 1s → 2s → 4s
const withRetry = async (fn, maxAttempts=3) => {
  let lastErr;
  for (let i=0; i<maxAttempts; i++) {
    try { return await fn(); }
    catch(err) { lastErr=err; if(i<maxAttempts-1) await new Promise(r=>setTimeout(r,1000*(2**i))); }
  }
  throw lastErr;
};

// API key injected here only — never logged, never rendered to DOM
const callAPI = async (messages, {maxTokens=1000, mcpServers, apiKey}={}) => {
  const headers = {"Content-Type":"application/json"};
  if (apiKey) headers["x-api-key"] = apiKey; // only applied, never logged
  const body = {model:"claude-sonnet-4-6", max_tokens:maxTokens, messages};
  if (mcpServers) body.mcp_servers = mcpServers;
  const res = await fetch("https://api.anthropic.com/v1/messages", {method:"POST", headers, body:JSON.stringify(body)});
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};

const scanNDA = (text) => {
  const pat = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Co\.?|Group|Solutions|Services|Technologies|Systems|Management)\b/g;
  return [...text.matchAll(pat)].map(m=>m[0]).filter(m=>!["FlashFusion","Abstrekkt"].includes(m.split(" ")[0]));
};

const liZone = (n) => {
  if (n<800)               return {label:"TOO SHORT", color:"#ef4444"};
  if (n<LI_OPTIMAL_LOW)   return {label:"BUILDING",  color:"#C8A86A"};
  if (n<=LI_OPTIMAL_HIGH) return {label:"OPTIMAL ✓", color:"#6BAA8A"};
  if (n<=2500)             return {label:"LONG",      color:"#C8A86A"};
  if (n<=LI_HARD_CAP)     return {label:"NEAR LIMIT",color:"#B85A3A"};
  return                          {label:"OVER LIMIT",color:"#ef4444"};
};
const xZone = (n) => {
  if (n===0)      return {label:"EMPTY", color:"#5C4E42"};
  if (n<=100)     return {label:"PUNCHY",color:"#6BAA8A"};
  if (n<=200)     return {label:"GOOD",  color:"#C8A86A"};
  if (n<=X_TARGET)return {label:"OK",    color:"#9E876D"};
  return                 {label:"OVER",  color:"#ef4444"};
};

const BASE_BTN = {
  fontFamily:BRAND.fontMono, cursor:"pointer", letterSpacing:"0.08em",
  textTransform:"uppercase", minHeight:"44px", transition:"all 0.15s", border:"none",
};

// ── ERROR BOUNDARY — prevents blank screen on render crash ───────────────────
class ErrorBoundary extends Component {
  state = {hasError:false, msg:""};
  static getDerivedStateFromError(err) { return {hasError:true, msg:err.message}; }
  componentDidCatch(err) { console.error("[Dispatch] Render error:", err.message); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{minHeight:"100vh",background:BRAND.ink,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",fontFamily:BRAND.fontMono}}>
        <div style={{maxWidth:"480px",width:"100%",padding:"32px",background:BRAND.surface,border:`1px solid ${BRAND.borderSub}`,borderRadius:"4px",borderLeft:`3px solid ${BRAND.terra}`}}>
          <div style={{fontSize:"10px",color:BRAND.terra,letterSpacing:"0.15em",marginBottom:"12px"}}>RENDER ERROR</div>
          <p style={{fontSize:"14px",color:BRAND.textBright,margin:"0 0 8px",fontFamily:BRAND.fontBody}}>{this.state.msg || "An unexpected error occurred."}</p>
          <p style={{fontSize:"11px",color:BRAND.dim2,margin:"0 0 20px"}}>Check the browser console for details.</p>
          <button onClick={()=>this.setState({hasError:false,msg:""})}
            style={{...BASE_BTN,padding:"10px 20px",background:BRAND.brass,color:BRAND.ink,borderRadius:"3px",fontSize:"12px",fontWeight:"700",minHeight:"40px"}}>
            ↺ RELOAD COMPONENT
          </button>
        </div>
      </div>
    );
  }
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({message,type,onDone}) {
  useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t);},[onDone]);
  const c={
    success:{bg:"rgba(107,170,138,0.1)",border:"rgba(107,170,138,0.3)",text:"#6BAA8A"},
    error:  {bg:"rgba(239,68,68,0.08)", border:"rgba(239,68,68,0.2)",  text:"#f87171"},
    info:   {bg:"rgba(200,168,106,0.08)",border:"rgba(200,168,106,0.2)",text:"#C8A86A"},
  }[type]||{};
  return (
    <div role="status" aria-live="polite" aria-atomic="true"
      style={{position:"fixed",bottom:"24px",right:"24px",padding:"10px 16px",borderRadius:"4px",
        background:c.bg,border:`1px solid ${c.border}`,color:c.text,
        fontSize:"12px",fontFamily:BRAND.fontMono,letterSpacing:"0.06em",
        zIndex:9999,animation:"slideIn 0.2s ease",maxWidth:"320px"}}>
      {message}
    </div>
  );
}

// ── MODE INDICATOR — shows LIVE / MOCK / FALLBACK with tooltip ────────────────
function ModeIndicator({mode, onConfigure}) {
  const [tip,setTip] = useState(false);
  const m = MODES[mode]||MODES.live;
  return (
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",gap:"6px"}}
      onMouseEnter={()=>setTip(true)} onMouseLeave={()=>setTip(false)}>
      <div style={{width:"6px",height:"6px",borderRadius:"50%",background:m.color,boxShadow:`0 0 6px ${m.color}80`}} />
      <span style={{fontSize:"9px",color:m.color,letterSpacing:"0.12em",fontFamily:BRAND.fontMono}}>{m.label}</span>
      {mode!=="live" && onConfigure && (
        <button onClick={onConfigure} className="btn-hover"
          style={{...BASE_BTN,padding:"2px 8px",background:"transparent",border:`1px solid ${m.color}40`,
            borderRadius:"2px",color:m.color,fontSize:"9px",minHeight:"22px",marginLeft:"4px"}}>
          CONFIG
        </button>
      )}
      {tip && (
        <div role="tooltip" style={{position:"absolute",top:"calc(100% + 8px)",right:0,
          padding:"8px 12px",background:BRAND.surface2,border:`1px solid ${BRAND.borderMid}`,
          borderRadius:"3px",fontSize:"11px",color:BRAND.textBody,fontFamily:BRAND.fontBody,
          lineHeight:"1.5",zIndex:1000,width:"240px",boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}>
          {m.tip}
        </div>
      )}
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({apiKey,onSetKey,onRevokeKey,apiMode,onForceMode,clientMode,onToggleClientMode,onExportState,onClearHistory,onClose,version}) {
  const [keyInput,setKeyInput] = useState("");
  const handleSetKey = () => {
    if (!keyInput.trim()) return;
    onSetKey(keyInput.trim());
    setKeyInput("");
  };
  const S = {
    section: {marginBottom:"24px",paddingBottom:"20px",borderBottom:`1px solid ${BRAND.borderSub}`},
    label:   {fontSize:"10px",color:BRAND.dim2,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"6px",fontFamily:BRAND.fontMono},
    note:    {fontSize:"11px",color:BRAND.dim1,fontFamily:BRAND.fontBody,lineHeight:"1.5",marginTop:"6px"},
    input:   {width:"100%",background:BRAND.ink,border:`1px solid ${BRAND.borderMid}`,borderRadius:"3px",
              padding:"9px 12px",color:BRAND.textInput,fontSize:"12px",boxSizing:"border-box",
              fontFamily:BRAND.fontMono,minHeight:"40px"},
    row:     {display:"flex",gap:"8px",alignItems:"stretch"},
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(28,25,23,0.85)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:"60px 20px 20px"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:BRAND.surface,border:`1px solid ${BRAND.borderSub}`,borderRadius:"4px",
        width:"100%",maxWidth:"360px",padding:"28px",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
          <h2 style={{margin:0,fontSize:"12px",color:BRAND.brass,letterSpacing:"0.15em",fontFamily:BRAND.fontMono,textTransform:"uppercase"}}>Settings</h2>
          <span style={{fontSize:"10px",color:BRAND.dim1,fontFamily:BRAND.fontMono}}>v{version}</span>
        </div>

        {/* API Key */}
        <div style={S.section}>
          <span style={S.label}>Claude API Key</span>
          <div style={S.row}>
            <input type="password" value={keyInput} onChange={e=>setKeyInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")handleSetKey();}}
              placeholder="sk-ant-... (optional — leave blank for runtime auth)"
              aria-label="Claude API key input"
              style={S.input} />
            <button onClick={handleSetKey} disabled={!keyInput.trim()}
              style={{...BASE_BTN,padding:"0 14px",borderRadius:"3px",minHeight:"40px",fontSize:"11px",
                background:keyInput.trim()?BRAND.brass:"transparent",color:keyInput.trim()?BRAND.ink:BRAND.dim1,
                border:`1px solid ${keyInput.trim()?BRAND.brass:BRAND.borderMid}`,flexShrink:0}}>
              SET
            </button>
          </div>
          <div style={{marginTop:"8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:"11px",color:apiKey?BRAND.sage:BRAND.dim2,fontFamily:BRAND.fontMono}}>
              {apiKey ? "✓ Key configured" : "Using runtime auth"}
            </span>
            {apiKey && (
              <button onClick={onRevokeKey} className="btn-hover"
                style={{...BASE_BTN,padding:"2px 8px",background:"transparent",border:`1px solid ${BRAND.borderMid}`,
                  borderRadius:"2px",color:BRAND.dim3,fontSize:"9px",minHeight:"24px"}}>
                REVOKE
              </button>
            )}
          </div>
          <p style={S.note}>The key lives in React state only — never logged or rendered. Leave blank to use the Claude artifact runtime.</p>
        </div>

        {/* Mode override */}
        <div style={S.section}>
          <span style={S.label}>Mode</span>
          <div style={{display:"flex",gap:"6px"}}>
            {["live","mock"].map(m=>(
              <button key={m} onClick={()=>onForceMode(m)}
                style={{...BASE_BTN,flex:1,padding:"8px",borderRadius:"3px",fontSize:"10px",minHeight:"36px",
                  border:`1px solid ${apiMode===m?MODES[m].color:BRAND.borderMid}`,
                  background:apiMode===m?`${MODES[m].color}10`:"transparent",
                  color:apiMode===m?MODES[m].color:BRAND.dim2}}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>
          <p style={S.note}>LIVE makes real API calls. MOCK serves example posts — useful for demos or offline use. FALLBACK is set automatically when the API is unreachable.</p>
        </div>

        {/* Client-safe mode */}
        <div style={S.section}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
            <span style={S.label}>Client-safe mode</span>
            <button onClick={onToggleClientMode}
              style={{...BASE_BTN,padding:"4px 12px",borderRadius:"2px",fontSize:"10px",minHeight:"28px",
                border:`1px solid ${clientMode?BRAND.brass:BRAND.borderMid}`,
                background:clientMode?`${BRAND.brass}15`:"transparent",
                color:clientMode?BRAND.brass:BRAND.dim2}}>
              {clientMode?"ON":"OFF"}
            </button>
          </div>
          <p style={S.note}>Strips personal branding and project identities. Safe for screen sharing or client presentations.</p>
        </div>

        {/* Export + Clear */}
        <div>
          <span style={S.label}>State</span>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            <button onClick={onExportState} className="btn-hover"
              style={{...BASE_BTN,padding:"9px 14px",borderRadius:"3px",fontSize:"11px",minHeight:"36px",
                border:`1px solid ${BRAND.borderMid}`,background:"transparent",color:BRAND.dim3,textAlign:"left"}}>
              ↗ Export current fields as JSON
            </button>
            <button onClick={onClearHistory} className="btn-hover"
              style={{...BASE_BTN,padding:"9px 14px",borderRadius:"3px",fontSize:"11px",minHeight:"36px",
                border:"1px solid rgba(239,68,68,0.2)",background:"transparent",color:"rgba(239,68,68,0.6)",textAlign:"left"}}>
              ✕ Clear dispatch history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SUGGESTION CARD ───────────────────────────────────────────────────────────
function SuggestionCard({s,index,selected,dimmed,onSelect,isMock}) {
  const summary = s.summary?.length>110 ? s.summary.substring(0,107)+"..." : s.summary;
  return (
    <button type="button" onClick={()=>onSelect(index)} aria-pressed={selected}
      style={{width:"100%",textAlign:"left",display:"block",padding:"14px 16px",
        background:selected?"rgba(200,168,106,0.06)":BRAND.surface,
        border:selected?`1px solid rgba(200,168,106,0.5)`:`1px solid ${BRAND.borderSub}`,
        borderRadius:"3px",cursor:dimmed?"not-allowed":"pointer",
        fontFamily:BRAND.fontMono,transition:"all 0.15s",minHeight:"auto",opacity:dimmed?0.5:1}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
        <span style={{fontSize:"10px",color:selected?BRAND.brass:BRAND.dim1,letterSpacing:"0.1em",textTransform:"uppercase"}}>
          {selected?"✓ SELECTED":`OPTION ${index+1}`}
        </span>
        <div style={{display:"flex",gap:"6px"}}>
          {isMock && <span style={{fontSize:"9px",color:BRAND.brassAct,letterSpacing:"0.08em",textTransform:"uppercase"}}>MOCK</span>}
          <span style={{fontSize:"10px",color:BRAND.borderMid,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.type||"doc"}</span>
        </div>
      </div>
      <p style={{margin:"0 0 4px",fontSize:"13px",color:selected?BRAND.textBright:BRAND.textBody,fontFamily:BRAND.fontBody,lineHeight:"1.4",textTransform:"none",letterSpacing:"normal"}}>{s.title}</p>
      {summary && <p style={{margin:"0 0 4px",fontSize:"11px",color:BRAND.dim3,fontFamily:BRAND.fontBody,lineHeight:"1.4",textTransform:"none",letterSpacing:"normal"}}>{summary}</p>}
      <p style={{margin:0,fontSize:"11px",color:BRAND.dim2,fontFamily:BRAND.fontMono,lineHeight:"1.5",textTransform:"none",letterSpacing:"normal",fontStyle:"italic"}}>→ {s.angle}</p>
    </button>
  );
}

// ── POST CARD ─────────────────────────────────────────────────────────────────
function PostCard({platform,content,isLI,onCopy,isMock,ndaWarnings}) {
  const count = content?.length||0;
  const zone  = isLI ? liZone(count) : xZone(count);
  const limit = isLI ? LI_HARD_CAP : X_TARGET;
  const note  = isLI
    ? `Optimal: ${LI_OPTIMAL_LOW.toLocaleString()}–${LI_OPTIMAL_HIGH.toLocaleString()} · Cap: ${LI_HARD_CAP.toLocaleString()}`
    : "Target: <100 chars for best engagement · Cap: 270";
  return (
    <article aria-label={`${platform} post`} className="post-card"
      style={{background:BRAND.surface,border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",
        padding:"20px",borderLeft:`2px solid ${zone.color}50`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px",flexWrap:"wrap",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <h3 style={{margin:0,fontSize:"10px",color:BRAND.brass,letterSpacing:"0.15em",fontFamily:BRAND.fontMono,textTransform:"uppercase"}}>{platform}</h3>
          <span style={{fontSize:"9px",color:zone.color,letterSpacing:"0.1em",fontFamily:BRAND.fontMono,textTransform:"uppercase",
            padding:"2px 6px",background:`${zone.color}12`,borderRadius:"2px",border:`1px solid ${zone.color}30`}}>
            {zone.label}
          </span>
          {isMock && <span style={{fontSize:"9px",color:BRAND.brassAct,letterSpacing:"0.08em",fontFamily:BRAND.fontMono,textTransform:"uppercase",padding:"2px 6px",border:`1px solid ${BRAND.brassAct}40`,borderRadius:"2px"}}>MOCK</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{fontSize:"10px",color:count>limit?"#ef4444":BRAND.dim1,fontFamily:BRAND.fontMono}}>
            {count.toLocaleString()} / {limit.toLocaleString()}
          </span>
          <button onClick={()=>onCopy(content,platform)} aria-label={`Copy ${platform} post`}
            className="btn-hover"
            style={{...BASE_BTN,padding:"4px 12px",borderRadius:"3px",border:`1px solid ${BRAND.borderMid}`,
              background:"transparent",color:BRAND.dim3,fontSize:"11px",minHeight:"32px"}}>
            COPY
          </button>
        </div>
      </div>
      {isLI && (
        <div aria-hidden="true" style={{height:"2px",background:BRAND.borderSub,borderRadius:"1px",marginBottom:"6px",position:"relative"}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:"1px",
            width:`${Math.min(count/LI_HARD_CAP*100,100)}%`,background:zone.color,transition:"width 0.3s ease"}} />
          <div style={{position:"absolute",left:`${LI_OPTIMAL_LOW/LI_HARD_CAP*100}%`,top:"-3px",width:"1px",height:"8px",background:"#6BAA8A50"}} />
          <div style={{position:"absolute",left:`${LI_OPTIMAL_HIGH/LI_HARD_CAP*100}%`,top:"-3px",width:"1px",height:"8px",background:"#6BAA8A50"}} />
        </div>
      )}
      <p style={{fontSize:"11px",color:BRAND.dim1,fontFamily:BRAND.fontMono,letterSpacing:"0.04em",margin:"0 0 12px"}}>{note}</p>
      <p style={{fontSize:"14px",lineHeight:"1.75",color:BRAND.textBody,margin:0,whiteSpace:"pre-wrap",fontFamily:BRAND.fontBody}}>
        {content}
      </p>
      {ndaWarnings?.length>0 && (
        <div role="alert" style={{marginTop:"10px",padding:"8px 12px",background:"rgba(239,68,68,0.05)",
          border:"1px solid rgba(239,68,68,0.2)",borderRadius:"3px",fontSize:"10px",color:"#f87171",fontFamily:BRAND.fontMono,letterSpacing:"0.04em"}}>
          ⚠ Possible NDA exposure: {ndaWarnings.join(", ")} — review before posting
        </div>
      )}
    </article>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
function DispatchApp() {
  // Runtime + environment
  const [apiMode,      setApiMode]      = useState("live");   // live | mock | fallback
  const [apiKey,       setApiKey]       = useState("");        // React state only — never logged
  const [clientMode,   setClientMode]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Form state
  const [inputMode,   setInputMode]   = useState("manual");
  const [project,     setProject]     = useState("ai-learning");
  const [tone,        setTone]        = useState("raw");
  const [fields,      setFields]      = useState({built:"",broke:"",learned:"",next:""});
  const [fieldErrors, setFieldErrors] = useState({});
  const [output,      setOutput]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [toast,       setToast]       = useState(null);
  const [history,     setHistory]     = useState([]);
  const [driveSource, setDriveSource] = useState(null);

  // Drive state — two-phase
  const [searchHint,      setSearchHint]      = useState("");
  const [driveStatus,     setDriveStatus]     = useState("idle");
  const [suggestions,     setSuggestions]     = useState([]);
  const [selectedIdx,     setSelectedIdx]     = useState(null);
  const [clarifiers,      setClarifiers]      = useState([]);
  const [clarifierStatus, setClarifierStatus] = useState("idle");

  const firstFieldRef = useRef(null);
  const outputRef     = useRef(null);
  const liveRef       = useRef(null);

  const brand = clientMode ? BRAND_CLIENT : BRAND;
  const projects = clientMode ? CLIENT_PROJECTS : PROJECTS;
  const selectedProject = projects.find(p=>p.id===project) || projects[0];

  // ── Mount: fonts, viewport, storage, env log ────────────────────────────────
  useEffect(() => {
    // Font injection — @import in React <style> blocked by some sandbox CSPs
    if (!document.getElementById("dispatch-fonts")) {
      const link = document.createElement("link");
      link.id = "dispatch-fonts"; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9,400;144,300;144,400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap";
      document.head.appendChild(link);
    }
    // Viewport detection
    const checkVp = () => setIsMobile(window.innerWidth<768);
    checkVp();
    window.addEventListener("resize", checkVp);
    // Persistent state
    const d=ls.get("dispatch-draft"); if(d){try{setFields(JSON.parse(d));}catch{}}
    const h=ls.get("dispatch-history"); if(h){try{setHistory(JSON.parse(h));}catch{}}
    return ()=>window.removeEventListener("resize", checkVp);
  }, []);

  // Env log on mode change — key presence only, never key value
  useEffect(()=>{
    console.log("[Dispatch] Env:", {
      mode:apiMode, clientMode, viewport:isMobile?"mobile":"desktop",
      version:BRAND.version, keyPresent:!!apiKey,
    });
  }, [apiMode, clientMode, isMobile, apiKey]);

  // Draft + history persistence
  useEffect(()=>{ if(Object.values(fields).some(v=>v)) ls.set("dispatch-draft",JSON.stringify(fields)); },[fields]);
  useEffect(()=>{ if(history.length) ls.set("dispatch-history",JSON.stringify(history.slice(0,8))); },[history]);

  const announce = (msg) => { if(liveRef.current) liveRef.current.textContent=msg; };

  const copyToClipboard = useCallback(async(text,label)=>{
    try{ await navigator.clipboard.writeText(text); setToast({message:`✓ ${label} copied`,type:"success"}); announce(`${label} copied`); }
    catch{ setToast({message:"Copy failed — select text manually",type:"error"}); }
  },[]);

  // ── Settings handlers ──────────────────────────────────────────────────────
  const handleSetKey = (k) => { setApiKey(k); setApiMode("live"); setToast({message:"API key set — LIVE mode active",type:"success"}); };
  const handleRevokeKey = () => { setApiKey(""); setToast({message:"Key revoked — using runtime auth",type:"info"}); };
  const handleForceMode = (m) => { setApiMode(m); setToast({message:`Mode set to ${m.toUpperCase()}`,type:"info"}); setShowSettings(false); };
  const handleToggleClientMode = () => setClientMode(c=>!c);
  const handleExportState = async () => {
    const state = {fields,project,tone,version:BRAND.version,ts:new Date().toISOString()};
    try{ await navigator.clipboard.writeText(JSON.stringify(state,null,2)); setToast({message:"State copied as JSON",type:"success"}); }
    catch{ setToast({message:"Copy failed — open console for state",type:"error"}); console.log("[Dispatch] State export:",JSON.stringify(state)); }
  };
  const handleClearHistory = () => {
    setHistory([]); ls.rm("dispatch-history");
    setToast({message:"History cleared",type:"info"}); setShowSettings(false);
  };

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(()=>{
    const h=(e)=>{
      if(showSettings){if(e.key==="Escape")setShowSettings(false); return;}
      if(!e.target.matches("textarea,input")){
        if(e.key==="1") setProject(projects[0]?.id);
        if(e.key==="2") setProject(projects[1]?.id);
        if(e.key==="3") setProject(projects[2]?.id);
        if(e.key==="r"||e.key==="R") setTone("raw");
        if(e.key==="t"||e.key==="T") setTone("technical");
        if(e.key==="f"||e.key==="F") setTone("reflective");
      }
      if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();if(!loading&&inputMode==="manual")handleGenerate();}
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="C"){e.preventDefault();reset();}
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="L"){e.preventDefault();if(output?.linkedin)copyToClipboard(output.linkedin,"LinkedIn");}
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="X"){e.preventDefault();if(output?.twitter)copyToClipboard(output.twitter,"X/Twitter");}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[showSettings,loading,output,inputMode,copyToClipboard,fields,project,tone,driveSource,projects]);

  // ── Mock output helper ─────────────────────────────────────────────────────
  const getMockOutput = () => ({...(MOCK_POSTS[project]||MOCK_POSTS["ai-learning"]),_mock:true});

  // ── Drive search — Phase 1 ─────────────────────────────────────────────────
  const runDriveSearch = async () => {
    if (apiMode==="mock") {
      // Mock drive search — show mock suggestions without API call
      setSuggestions(MOCK_SUGGESTIONS); setSelectedIdx(null); setClarifiers([]);
      setClarifierStatus("idle"); setDriveStatus("ready");
      announce("Mock suggestions loaded. Select one for clarifiers.");
      return;
    }
    setDriveStatus("searching");
    setSuggestions([]); setSelectedIdx(null); setClarifiers([]); setClarifierStatus("idle");
    announce("Searching Google Drive...");
    const prompt = `You have access to Kyle's Google Drive. Search for recent files and documents.
Active project: ${selectedProject.label}${searchHint?`\nFocus: "${searchHint}"`:""}
Search broadly — recently modified docs, session notes, build logs. Return ONLY this JSON:
{"suggestions":[{"title":"...","summary":"...","angle":"...","type":"..."},{"title":"...","summary":"...","angle":"...","type":"..."},{"title":"...","summary":"...","angle":"...","type":"..."}]}`;
    try {
      let messages=[{role:"user",content:prompt}]; let finalText=null;
      for(let r=0;r<6;r++){
        const data=await withRetry(()=>callAPI(messages,{maxTokens:1500,mcpServers:[DRIVE_MCP],apiKey}));
        const tb=data.content?.find(b=>b.type==="text");
        if(tb&&tb.text.includes('"suggestions"')){finalText=tb.text;break;}
        const hasTool=data.content?.some(b=>b.type==="tool_use"||b.type==="mcp_tool_use");
        if(hasTool||data.stop_reason==="tool_use"){
          messages.push({role:"assistant",content:data.content});
          const res=(data.content||[]).filter(b=>b.type==="tool_use"||b.type==="mcp_tool_use").map(b=>({type:"tool_result",tool_use_id:b.id,content:b.content||"executed"}));
          if(res.length)messages.push({role:"user",content:res}); continue;
        }
        if(tb&&r<4){messages.push({role:"assistant",content:data.content});messages.push({role:"user",content:"Respond with ONLY the JSON object."});continue;}
        break;
      }
      if(!finalText)throw new Error("No suggestions returned from Drive search");
      const parsed=extractJSON(finalText);
      setSuggestions(parsed.suggestions||[]);
      setDriveStatus("ready");
      announce(`Found ${parsed.suggestions?.length||0} suggestions. Select one for clarifiers.`);
    } catch(err) {
      console.error("[Dispatch] Drive search error:",err.message);
      setDriveStatus("error");
    }
  };

  // ── Generate clarifiers — Phase 2 ─────────────────────────────────────────
  const generateClarifiers = async (idx) => {
    const s=suggestions[idx];
    if(!s)return;
    setSelectedIdx(idx); setClarifierStatus("loading"); setClarifiers([]);
    announce(`Loading clarifiers for "${s.title}"...`);
    if (apiMode==="mock") {
      // Slight delay for realism, then serve mock clarifiers
      await new Promise(r=>setTimeout(r,600));
      setClarifiers(MOCK_CLARIFIERS.map(c=>({...c,answer:""})));
      setClarifierStatus("ready"); announce("Mock clarifiers ready."); return;
    }
    const prompt = `Kyle selected a Drive document for a building-in-public post.
Document: "${s.title}" — ${s.summary}
Angle: ${s.angle} | Project: ${selectedProject.label}
Generate 4 specific clarifying questions about THIS document — concrete, not generic.
Respond ONLY: {"clarifiers":["Q1?","Q2?","Q3?","Q4?"]}`;
    try {
      const data=await withRetry(()=>callAPI([{role:"user",content:prompt}],{maxTokens:400,apiKey}));
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=extractJSON(raw);
      setClarifiers((parsed.clarifiers||[]).map(q=>({question:q,answer:""})));
      setClarifierStatus("ready");
      announce("4 clarifiers ready.");
    } catch(err) {
      console.error("[Dispatch] Clarifier error:",err.message);
      setClarifierStatus("error");
    }
  };

  // ── Apply suggestion → fields ──────────────────────────────────────────────
  const applySuggestion = () => {
    if(selectedIdx===null)return;
    const s=suggestions[selectedIdx];
    const answered=clarifiers.filter(c=>c.answer.trim()).map(c=>({q:c.question,a:c.answer}));
    setFields({built:s.title,broke:"",learned:s.angle,next:""});
    setDriveSource({title:s.title,angle:s.angle,suggestion:s,clarifiers:answered});
    setInputMode("manual"); setOutput(null);
    announce("Fields pre-filled. Review in Manual mode.");
    setTimeout(()=>firstFieldRef.current?.focus(),100);
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errors={};
    if(!fields.built.trim())                errors.built="Required.";
    else if(fields.built.trim().length<10)  errors.built="Too short — add more detail.";
    setFieldErrors(errors); return !Object.keys(errors).length;
  };

  // ── Generate ───────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if(!validate()){firstFieldRef.current?.focus();return;}
    // Serve mock without API call
    if(apiMode==="mock"){setOutput(getMockOutput());announce("Mock posts served.");setTimeout(()=>{outputRef.current?.focus();outputRef.current?.scrollIntoView({behavior:"smooth",block:"start"});},100);return;}
    setLoading(true);setOutput(null);announce("Generating dispatch posts...");
    const ndaNote=!selectedProject.safe?"CRITICAL NDA FILTER: strip all client names, org names, internal tool names, proprietary system names.":"";
    const filled=Object.entries(fields).filter(([,v])=>v.trim()).map(([k,v])=>`${k.toUpperCase()}: ${v}`).join("\n");
    const driveCtx=driveSource?`\n\nDRIVE_SOURCE: "${driveSource.title}"\nSELECTED_ANGLE: "${driveSource.angle}"${driveSource.clarifiers?.length?`\nCONTEXT_ANSWERS: ${driveSource.clarifiers.map(c=>`${c.q} → ${c.a}`).join(" | ")}`:""}` : "";
    const prompt=`Write building-in-public posts for Kyle, a Staff Engineer and AI builder.
VOICE: ${TONE_MAP[tone]}
PROJECT: ${selectedProject.label}
${ndaNote}
CONTENT:
${filled}${driveCtx}

POST 1 — LINKEDIN
Target: 1,300–1,600 chars. Hook in first 140 chars (mobile cutoff). Start with action/observation — NEVER a pronoun, "Today", "Excited", "I". No "excited to share", no "today I learned", no em-dash decoration. Close with ONE genuine question. Max 2 hashtags after question.

POST 2 — X/TWITTER
HARD 270-char limit. Target 100–200 chars. Single punchy observation. No hashtags.

Respond ONLY with: {"linkedin":"...","twitter":"..."}`;
    try {
      const data=await withRetry(()=>callAPI([{role:"user",content:prompt}],{maxTokens:1200,apiKey}));
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=extractJSON(raw);
      if(!selectedProject.safe){const w=scanNDA((parsed.linkedin||"")+" "+(parsed.twitter||""));if(w.length)parsed._ndaWarnings=w;}
      setOutput(parsed);
      const entry={id:Date.now(),project:selectedProject.label,tone,built:fields.built.substring(0,55)+(fields.built.length>55?"...":""),linkedin:parsed.linkedin,twitter:parsed.twitter,ts:new Date().toLocaleTimeString(),fromDrive:driveSource?driveSource.title.substring(0,40):null};
      setHistory(h=>[entry,...h].slice(0,8));
      ls.rm("dispatch-draft"); announce("Posts ready.");
      setTimeout(()=>{outputRef.current?.focus();outputRef.current?.scrollIntoView({behavior:"smooth",block:"start"});},100);
    } catch(err) {
      console.error("[Dispatch] Generate error:",err.message);
      // Auto-fallback to mock after retries exhausted
      setApiMode("fallback");
      setOutput({...getMockOutput(),_fallbackReason:"API unreachable after 3 retries"});
      setToast({message:"API unreachable — showing mock content",type:"info"});
    }
    setLoading(false);
  };

  const handleRegenerate = ()=>{if(!loading)handleGenerate();};

  const reset = () => {
    setFields({built:"",broke:"",learned:"",next:""});
    setOutput(null);setFieldErrors({});setDriveSource(null);
    setDriveStatus("idle");setSuggestions([]);setSelectedIdx(null);
    setClarifiers([]);setClarifierStatus("idle");setSearchHint("");
    ls.rm("dispatch-draft");
    setToast({message:"Cleared",type:"info"});
    setTimeout(()=>firstFieldRef.current?.focus(),50);
  };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const M = isMobile; // shorthand
  const sLabel  = {fontSize:"10px",color:BRAND.dim1,letterSpacing:"0.15em",textTransform:"uppercase",display:"block",marginBottom:"10px",fontFamily:BRAND.fontMono};
  const fLabel  = (err)=>({fontSize:"10px",color:err?"#ef4444":BRAND.dim2,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"6px",fontFamily:BRAND.fontMono});
  const taStyle = (val,err)=>({width:"100%",background:BRAND.ink,border:err?"1px solid rgba(239,68,68,0.5)":val?`1px solid ${BRAND.borderAct}`:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",padding:"10px 14px",color:BRAND.textInput,fontSize:"13px",resize:"vertical",boxSizing:"border-box",fontFamily:BRAND.fontMono,lineHeight:"1.6",minHeight:"44px"});
  const inpStyle = (val)=>({width:"100%",background:BRAND.ink,border:val?`1px solid ${BRAND.borderAct}`:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",padding:"10px 14px",color:BRAND.textInput,fontSize:"13px",boxSizing:"border-box",fontFamily:BRAND.fontMono,minHeight:"44px"});
  const chip = (active)=>({...BASE_BTN,padding:"6px 12px",borderRadius:"3px",border:active?`1px solid ${BRAND.brass}`:`1px solid ${BRAND.borderSub}`,background:active?"rgba(200,168,106,0.08)":"rgba(44,39,35,0.4)",color:active?BRAND.brass:BRAND.dim2,fontSize:"11px"});
  const toneBtn = (active)=>({...BASE_BTN,padding:"6px 12px",borderRadius:"3px",border:active?`1px solid rgba(200,168,106,0.5)`:`1px solid ${BRAND.borderSub}`,background:active?"rgba(200,168,106,0.05)":"transparent",color:active?BRAND.brassAct:BRAND.dim1,fontSize:"11px"});
  const spinner = <span style={{display:"inline-block",width:"10px",height:"10px",border:`2px solid ${BRAND.borderMid}`,borderTopColor:BRAND.brass,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />;
  const isMock = output?._mock || output?._fallbackReason;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .post-card{animation:fadeUp 0.25s ease forwards}
        .btn-hover:hover{opacity:0.75!important}
        .btn-ctx:hover{border-color:rgba(200,168,106,0.4)!important;color:#C4A882!important}
        .btn-primary:hover:not(:disabled){filter:brightness(1.1)}
        *:focus-visible{outline:3px solid rgba(200,168,106,0.6)!important;outline-offset:2px!important}
        textarea:focus,input:focus{outline:3px solid rgba(200,168,106,0.5)!important;border-color:#C8A86A!important}
        textarea::placeholder,input::placeholder{color:#5A4A36}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#3D3630;border-radius:2px}
      `}</style>

      <a href="#main" style={{position:"absolute",top:"-80px",left:"16px",background:BRAND.brass,color:BRAND.ink,padding:"8px 16px",borderRadius:"3px",fontSize:"12px",fontFamily:BRAND.fontMono,fontWeight:"700",zIndex:10000,transition:"top 0.15s"}}
        onFocus={e=>{e.target.style.top="16px";}} onBlur={e=>{e.target.style.top="-80px";}}>
        Skip to main content
      </a>
      <div ref={liveRef} aria-live="assertive" aria-atomic="true" style={{position:"absolute",width:"1px",height:"1px",overflow:"hidden",clip:"rect(0,0,0,0)"}} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={()=>setToast(null)} />}
      {showSettings && (
        <SettingsPanel
          apiKey={apiKey} onSetKey={handleSetKey} onRevokeKey={handleRevokeKey}
          apiMode={apiMode} onForceMode={handleForceMode}
          clientMode={clientMode} onToggleClientMode={handleToggleClientMode}
          onExportState={handleExportState} onClearHistory={handleClearHistory}
          onClose={()=>setShowSettings(false)} version={BRAND.version} />
      )}

      <div id="main" style={{minHeight:"100vh",background:BRAND.ink,color:BRAND.textBright,fontFamily:BRAND.fontMono}}>
        <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)"}} />

        <div style={{position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto",padding:M?"24px 16px 60px":"40px 20px 80px"}}>

          {/* ── Header ──────────────────────────────────────────────── */}
          <header style={{marginBottom:"28px",borderBottom:`1px solid ${BRAND.borderSub}`,paddingBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px",flexWrap:"wrap",gap:"8px"}}>
                  <div aria-hidden="true" style={{width:"6px",height:"6px",borderRadius:"50%",background:BRAND.brass,boxShadow:`0 0 10px ${BRAND.brass}`,flexShrink:0}} />
                  <span style={{fontSize:"10px",letterSpacing:"0.2em",color:BRAND.dim1,textTransform:"uppercase"}}>{brand.badge}</span>
                  <ModeIndicator mode={apiMode} onConfigure={()=>setShowSettings(true)} />
                </div>
                <h1 style={{fontSize:M?"22px":"28px",fontWeight:"400",margin:"0 0 3px",color:BRAND.textWhite,letterSpacing:"-0.01em",fontFamily:BRAND.fontDisplay}}>
                  {brand.name}
                  <span aria-hidden="true" style={{display:"inline-block",width:"6px",height:M?"12px":"14px",background:BRAND.brass,marginLeft:"3px",verticalAlign:"middle",animation:"blink 1s step-end infinite",boxShadow:`0 0 8px ${BRAND.brass}`}} />
                </h1>
                <p style={{fontSize:"11px",color:BRAND.dim2,margin:0,letterSpacing:"0.04em",fontFamily:BRAND.fontBody}}>{brand.subtitle}</p>
              </div>
              <button onClick={()=>setShowSettings(s=>!s)} aria-label="Settings"
                className="btn-hover"
                aria-expanded={showSettings}
                style={{...BASE_BTN,padding:"8px 10px",background:showSettings?`rgba(200,168,106,0.08)`:"transparent",border:`1px solid ${showSettings?BRAND.brass:BRAND.borderSub}`,borderRadius:"3px",color:showSettings?BRAND.brass:BRAND.dim2,fontSize:"14px",minHeight:"40px",flexShrink:0}}>
                ⚙
              </button>
            </div>
          </header>

          {/* ── FALLBACK banner ──────────────────────────────────────── */}
          {apiMode==="fallback" && (
            <div role="alert" style={{marginBottom:"20px",padding:"10px 14px",background:"rgba(184,90,58,0.06)",border:`1px solid ${BRAND.terra}40`,borderRadius:"3px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
              <span style={{fontSize:"11px",color:BRAND.terra,fontFamily:BRAND.fontMono,letterSpacing:"0.04em"}}>API unreachable after 3 retries — serving mock content</span>
              <button onClick={()=>handleForceMode("live")} className="btn-hover"
                style={{...BASE_BTN,padding:"4px 10px",background:"transparent",border:`1px solid ${BRAND.terra}50`,borderRadius:"2px",color:BRAND.terra,fontSize:"9px",minHeight:"28px",flexShrink:0}}>
                RETRY LIVE
              </button>
            </div>
          )}

          <main id="main-content">
            {/* ── Context bar — project + tone, always visible ─────── */}
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",marginBottom:"20px",padding:"8px 12px",background:BRAND.surface,border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px"}}>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",flex:1}}>
                {projects.map(p=>(
                  <button key={p.id} type="button" onClick={()=>setProject(p.id)} aria-pressed={project===p.id}
                    className="btn-ctx"
                    style={chip(project===p.id)}>
                    <span aria-hidden="true">{p.emoji}</span> {p.label}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:"4px",flexShrink:0}}>
                {TONES.map(t=>(
                  <button key={t.id} type="button" onClick={()=>setTone(t.id)} aria-pressed={tone===t.id}
                    className="btn-ctx"
                    style={toneBtn(tone===t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {!selectedProject.safe && (
              <div role="status" style={{marginBottom:"16px",padding:"8px 12px",background:"rgba(200,168,106,0.04)",border:"1px solid rgba(200,168,106,0.12)",borderRadius:"3px",fontSize:"11px",color:BRAND.dim2,letterSpacing:"0.03em",fontFamily:BRAND.fontMono}}>
                ⚠ NDA filter active — output scanned for corporate identifiers before display
              </div>
            )}

            {/* ── Mode toggle ──────────────────────────────────────── */}
            <div role="group" aria-label="Input mode" style={{display:"flex",marginBottom:"28px",border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",overflow:"hidden"}}>
              {[{id:"manual",label:"✏ Manual"},{id:"drive",label:"📂 From Drive"}].map((m,i)=>(
                <button key={m.id} type="button" onClick={()=>setInputMode(m.id)} aria-pressed={inputMode===m.id}
                  style={{...BASE_BTN,flex:1,padding:"11px 16px",border:"none",borderRight:i===0?`1px solid ${BRAND.borderSub}`:"none",
                    background:inputMode===m.id?"rgba(200,168,106,0.08)":BRAND.surface,
                    color:inputMode===m.id?BRAND.brass:BRAND.dim1,fontSize:"12px"}}>
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={e=>{e.preventDefault();handleGenerate();}} noValidate aria-label="Dispatch generator">

              {/* ════ DRIVE PANEL ════════════════════════════════════ */}
              {inputMode==="drive" && (
                <section aria-labelledby="drive-h" style={{marginBottom:"28px"}}>
                  <h2 id="drive-h" style={sLabel}>Search Google Drive</h2>
                  <p style={{fontSize:"12px",color:BRAND.dim2,marginBottom:"16px",lineHeight:"1.6",fontFamily:BRAND.fontBody,textTransform:"none",letterSpacing:"normal"}}>
                    {apiMode==="mock"
                      ? "MOCK mode — showing example suggestions. Configure an API key in Settings for real Drive search."
                      : "Claude searches your Drive for recent work, returns 3 suggestions, then generates document-specific clarifiers after you pick one."}
                  </p>

                  <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexDirection:M?"column":"row"}}>
                    <div style={{flex:1}}>
                      <label htmlFor="hint" style={fLabel(false)}>Search hint (optional)</label>
                      <input id="hint" type="text" value={searchHint} onChange={e=>setSearchHint(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();runDriveSearch();}}}
                        placeholder='"this week", "Wix", "session notes"'
                        style={inpStyle(searchHint)} />
                    </div>
                    <div style={{display:"flex",alignItems:"flex-end"}}>
                      <button type="button" onClick={runDriveSearch} disabled={driveStatus==="searching"}
                        className="btn-primary"
                        style={{...BASE_BTN,padding:"0 20px",height:"44px",border:"none",
                          background:driveStatus==="searching"?BRAND.borderSub:`linear-gradient(135deg,${BRAND.brassDark},${BRAND.brass})`,
                          color:driveStatus==="searching"?BRAND.dim1:BRAND.ink,
                          fontSize:"12px",borderRadius:"3px",fontWeight:"700",whiteSpace:"nowrap",width:M?"100%":"auto"}}>
                        {driveStatus==="searching"?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>{spinner} SEARCHING</span>:"SEARCH DRIVE"}
                      </button>
                    </div>
                  </div>

                  {driveStatus==="error" && (
                    <div role="alert" style={{padding:"12px 14px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"3px",marginBottom:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
                      <span style={{fontSize:"11px",color:"#f87171",fontFamily:BRAND.fontMono}}>✗ Drive search failed — check Google Drive is connected in Claude</span>
                      <button type="button" onClick={runDriveSearch} className="btn-hover"
                        style={{...BASE_BTN,padding:"4px 12px",background:"transparent",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"2px",color:"#f87171",fontSize:"10px",minHeight:"28px",flexShrink:0}}>
                        RETRY
                      </button>
                    </div>
                  )}

                  {driveStatus==="ready" && suggestions.length>0 && (
                    <>
                      <div style={{...sLabel,marginTop:"4px"}}>3 Suggestions — click to load specific clarifiers</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
                        {suggestions.map((s,i)=>(
                          <SuggestionCard key={i} s={s} index={i}
                            selected={selectedIdx===i}
                            dimmed={clarifierStatus==="loading"&&selectedIdx!==i}
                            onSelect={generateClarifiers}
                            isMock={apiMode!=="live"} />
                        ))}
                      </div>

                      {selectedIdx!==null && (
                        <div style={{padding:"16px",background:"rgba(44,39,35,0.5)",border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",marginBottom:"20px"}}>
                          <div style={{...sLabel,marginBottom:"12px"}}>
                            Clarifiers for Option {selectedIdx+1}
                          </div>
                          {clarifierStatus==="loading" && (
                            <div style={{display:"flex",alignItems:"center",gap:"10px",fontSize:"11px",color:BRAND.dim2,fontFamily:BRAND.fontMono}}>
                              {spinner} Generating document-specific clarifiers...
                            </div>
                          )}
                          {clarifierStatus==="error" && (
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <span style={{fontSize:"11px",color:"#f87171",fontFamily:BRAND.fontMono}}>✗ Clarifier generation failed</span>
                              <button type="button" onClick={()=>generateClarifiers(selectedIdx)} className="btn-hover"
                                style={{...BASE_BTN,padding:"4px 12px",background:"transparent",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"2px",color:"#f87171",fontSize:"10px",minHeight:"28px"}}>
                                RETRY
                              </button>
                            </div>
                          )}
                          {clarifierStatus==="ready" && (
                            <>
                              <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"16px"}}>
                                {clarifiers.map((c,i)=>(
                                  <div key={i}>
                                    <label htmlFor={`cl-${i}`} style={fLabel(false)}>{`${i+1}. ${c.question}`}</label>
                                    <input id={`cl-${i}`} type="text" value={c.answer}
                                      onChange={e=>setClarifiers(cs=>cs.map((x,j)=>j===i?{...x,answer:e.target.value}:x))}
                                      placeholder="Your answer..."
                                      style={inpStyle(c.answer)} />
                                  </div>
                                ))}
                              </div>
                              <button type="button" onClick={applySuggestion}
                                className="btn-primary"
                                style={{...BASE_BTN,width:"100%",padding:"12px",border:"none",
                                  background:`linear-gradient(135deg,${BRAND.brassDark},${BRAND.brass})`,
                                  color:BRAND.ink,fontSize:"12px",fontWeight:"700",borderRadius:"3px"}}>
                                APPLY OPTION {selectedIdx+1} → FILL MANUAL FIELDS
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* ════ MANUAL PANEL ═══════════════════════════════════ */}
              {inputMode==="manual" && (
                <>
                  {/* Drive source badge */}
                  {driveSource && (
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px",padding:"8px 12px",background:"rgba(107,170,138,0.04)",border:"1px solid rgba(107,170,138,0.15)",borderRadius:"3px",flexWrap:"wrap"}}>
                      <span style={{fontSize:"9px",color:BRAND.sage,letterSpacing:"0.1em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:BRAND.fontMono}}>PRE-FILLED FROM DRIVE</span>
                      <span style={{fontSize:"11px",color:BRAND.dim3,fontFamily:BRAND.fontBody,textTransform:"none",letterSpacing:"normal",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{driveSource.title}</span>
                      <button type="button" onClick={()=>setDriveSource(null)} aria-label="Clear Drive source"
                        style={{...BASE_BTN,padding:"2px 8px",background:"transparent",border:"1px solid rgba(107,170,138,0.2)",borderRadius:"2px",color:BRAND.sage,fontSize:"9px",minHeight:"24px",flexShrink:0}}>
                        CLEAR
                      </button>
                    </div>
                  )}

                  <fieldset style={{border:"none",padding:0,margin:"0 0 24px"}}>
                    <legend style={sLabel}>What happened</legend>
                    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                      {FIELDS.map(({key,label,placeholder,required},i)=>{
                        const err=fieldErrors[key];
                        return (
                          <div key={key}>
                            <label htmlFor={`f-${key}`} style={fLabel(err)}>
                              <span aria-hidden="true">&gt; </span>{label}
                              {required?<span aria-hidden="true" style={{color:BRAND.brass,marginLeft:"4px"}}>*</span>:<span style={{color:BRAND.borderMid,marginLeft:"8px",fontSize:"9px"}}>OPTIONAL</span>}
                            </label>
                            <textarea id={`f-${key}`} ref={i===0?firstFieldRef:undefined}
                              value={fields[key]}
                              onChange={e=>{setFields(f=>({...f,[key]:e.target.value}));if(fieldErrors[key])setFieldErrors(fe=>({...fe,[key]:null}));}}
                              placeholder={placeholder} rows={2}
                              required={required} aria-required={required}
                              aria-describedby={err?`err-${key}`:undefined} aria-invalid={!!err}
                              style={taStyle(fields[key],err)} />
                            {err && <p id={`err-${key}`} role="alert" style={{margin:"4px 0 0",fontSize:"10px",color:"#ef4444",letterSpacing:"0.04em",fontFamily:BRAND.fontMono}}>✗ {err}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div style={{display:"flex",gap:"8px",marginBottom:"32px",flexDirection:M?"column":"row"}}>
                    <button type="submit" disabled={loading}
                      className="btn-primary"
                      style={{...BASE_BTN,flex:1,padding:"14px",border:"none",
                        background:loading?BRAND.borderSub:`linear-gradient(135deg,${BRAND.brassDark},${BRAND.brass})`,
                        color:loading?BRAND.dim1:BRAND.ink,fontSize:"13px",fontWeight:"700",borderRadius:"3px",cursor:loading?"not-allowed":"pointer"}}>
                      {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>{spinner} TRANSMITTING...</span>
                        :apiMode==="mock"?"▶ GENERATE (MOCK)":"▶ GENERATE DISPATCH"}
                    </button>
                      <button type="button" onClick={reset} aria-label="Clear all fields"
                      className="btn-hover"
                      style={{...BASE_BTN,padding:"14px 18px",border:`1px solid ${BRAND.borderMid}`,background:"transparent",color:BRAND.dim3,fontSize:"11px",borderRadius:"3px",width:M?"100%":"auto"}}>
                      CLR
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* ── Output ──────────────────────────────────────────── */}
            {output && !output.error && (
              <section aria-labelledby="out-h" ref={outputRef} tabIndex={-1} style={{outline:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"8px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span aria-hidden="true" style={{color:isMock?BRAND.brassAct:BRAND.sage}}>●</span>
                    <h2 id="out-h" style={{margin:0,fontSize:"10px",color:BRAND.dim2,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:BRAND.fontMono,fontWeight:"normal"}}>
                      {isMock?"MOCK OUTPUT":"OUTPUT READY"}
                    </h2>
                    {output._fallbackReason && <span style={{fontSize:"9px",color:BRAND.terra,fontFamily:BRAND.fontMono,letterSpacing:"0.08em"}}>FALLBACK ACTIVE</span>}
                  </div>
                  <button type="button" onClick={handleRegenerate} disabled={loading} className="btn-hover"
                    style={{...BASE_BTN,padding:"6px 14px",border:`1px solid ${BRAND.borderSub}`,background:"transparent",color:BRAND.dim2,fontSize:"11px",borderRadius:"3px",minHeight:"36px",cursor:loading?"not-allowed":"pointer"}}>
                    ↺ REGENERATE
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  <PostCard platform="LINKEDIN" content={output.linkedin} isLI={true} onCopy={copyToClipboard} isMock={!!isMock} ndaWarnings={output._ndaWarnings} />
                  <PostCard platform="X / TWITTER" content={output.twitter} isLI={false} onCopy={copyToClipboard} isMock={!!isMock} />
                </div>
                <div style={{marginTop:"10px",padding:"10px 12px",background:"rgba(44,39,35,0.4)",border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",fontSize:"10px",color:BRAND.dim1,letterSpacing:"0.06em",fontFamily:BRAND.fontMono}}>
                  ⌘⇧L / ⌘⇧X = copy · Adjust fields + ↺ for a different angle
                  {isMock && " · Switch to LIVE mode in Settings for real generation"}
                </div>
              </section>
            )}

            {output?.error && (
              <div role="alert" style={{padding:"16px",borderRadius:"3px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
                <span style={{color:"#f87171",fontSize:"12px",fontFamily:BRAND.fontMono,letterSpacing:"0.05em"}}>✗ {output.message}</span>
                <button type="button" onClick={handleGenerate} disabled={loading} className="btn-hover"
                  style={{...BASE_BTN,padding:"6px 14px",background:"transparent",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"3px",color:"#f87171",fontSize:"11px",minHeight:"36px"}}>
                  RETRY
                </button>
              </div>
            )}

            {/* ── History ─────────────────────────────────────────── */}
            {history.length>0 && (
              <section aria-labelledby="hist-h" style={{marginTop:"44px"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"12px",marginBottom:"10px"}}>
                  <h2 id="hist-h" style={{...sLabel,margin:0}}>SESSION HISTORY</h2>
                  <span style={{fontSize:"9px",color:BRAND.borderMid,fontFamily:BRAND.fontMono,letterSpacing:"0.06em",textTransform:"uppercase"}}>{history.length} entries · persists across reloads</span>
                </div>
                <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"6px"}}>
                  {history.map(h=>(
                    <li key={h.id} style={{padding:"10px 12px",background:BRAND.surface,border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:M?"wrap":"nowrap"}}>
                      <div style={{minWidth:0,flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"2px",flexWrap:"wrap"}}>
                          <span style={{fontSize:"10px",color:BRAND.brass,letterSpacing:"0.08em",fontFamily:BRAND.fontMono}}>{h.project}</span>
                          <span style={{fontSize:"9px",color:BRAND.borderMid}}>·</span>
                          <span style={{fontSize:"9px",color:BRAND.dim1,letterSpacing:"0.06em",fontFamily:BRAND.fontMono}}>{h.tone}</span>
                          {h.fromDrive && <span style={{fontSize:"9px",color:BRAND.sage,letterSpacing:"0.05em",fontFamily:BRAND.fontMono}}>· 📂 {h.fromDrive}</span>}
                        </div>
                        <span style={{fontSize:"11px",color:BRAND.dim2,fontFamily:BRAND.fontMono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{h.built}</span>
                      </div>
                      <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                        {[["LI",h.linkedin,"LinkedIn"],["X",h.twitter,"X/Twitter"]].map(([lbl,txt,full])=>(
                          <button key={lbl} onClick={()=>copyToClipboard(txt,full)} aria-label={`Copy ${full} from ${h.ts}`}
                            className="btn-hover"
                            style={{...BASE_BTN,padding:"4px 8px",background:"transparent",border:`1px solid ${BRAND.borderSub}`,borderRadius:"3px",color:BRAND.dim1,fontSize:"9px",minHeight:"36px",minWidth:"36px"}}>
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          <footer style={{marginTop:"60px",paddingTop:"20px",borderTop:`1px solid ${BRAND.borderSub}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",fontSize:"10px",color:BRAND.borderMid,letterSpacing:"0.1em",fontFamily:BRAND.fontMono}}>
            <span>DISPATCH v{BRAND.version} — {brand.name}</span>
            <span>LI 1,300–1,900 optimal · X target 270 · WCAG 2.2 AA</span>
          </footer>
        </div>
      </div>
    </>
  );
}

// Error boundary wraps the full component — no blank screen on render crash
export default function Dispatch() {
  return <ErrorBoundary><DispatchApp /></ErrorBoundary>;
}
