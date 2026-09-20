/*
 * INCOMPATIBILITIES WITH THIS BUILD — read before modifying:
 *
 * 1. LIVE mode: fetch() to api.anthropic.com works inside the claude.ai artifact iframe.
 *    When the file is opened from file:// or a non-claude.ai origin, CORS blocks the
 *    request and the app auto-falls back to MOCK with a banner.
 *    Decision: LIVE is artifact-native by design. Acceptable limitation.
 *
 * 2. CLIENT_MODE is a compile-time constant, not a runtime toggle. Changing it
 *    requires editing this file. Per directives: single-swap config, not a UI control.
 *    Trade-off: simple to audit; requires re-export for client vs internal builds.
 *
 * 3. No API key is ever written to: localStorage, sessionStorage, console.log,
 *    console.info, DOM text, or included in any string that reaches the DOM.
 *    The key lives only in React state and is transmitted only to the Anthropic API.
 */

import { useState, useEffect, useRef, useCallback, Component } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND CONFIG — swap every deployment-specific token here in one edit
// ═══════════════════════════════════════════════════════════════════════════════
const BRAND = {
  name:        "Claude Quality Demo",
  version:     "v1.1.0",
  internalTag: "INT · AI Enablement",
  apiModel:    "claude-sonnet-4-20250514",
  scenarioText: "A client VPN ticket is 4 days old with zero updates. They've escalated directly to you. Draft a reply.",
  userMessage:  "Help me draft a reply to a client. Context: VPN ticket opened 4 days ago about intermittent drops. No updates have been provided. They've now escalated directly to me.",
};

// CLIENT_MODE: true → strips internal tag, removes Stack tab, neutral header
const CLIENT_MODE = false;

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK RESPONSES — shown in MOCK mode; also served as fallback from failed LIVE calls
// ═══════════════════════════════════════════════════════════════════════════════
const MR = {
  none:`Dear [Client Name],\n\nI apologize for the delay in addressing your support ticket. We understand this situation has been frustrating, and we sincerely apologize for the inconvenience caused by the delay in our response.\n\nOur team is actively working to resolve your VPN connectivity issue as quickly as possible. We will be in touch shortly with a status update.\n\nThank you for your continued patience and understanding.\n\nBest regards,\n[Your Name]`,
  role_only:`Hi [Client Name],\n\nI wanted to personally acknowledge that a 4-day gap with no status update on your VPN ticket falls below our service standards, and I apologize for that.\n\nI've escalated this for immediate senior attention. You can expect:\n\n  • A direct response within the next 2 hours\n  • A full resolution update by end of business today\n\nI'll personally follow up to confirm progress.\n\nBest,\n[Your Name]`,
  style_only:`[Client Name], a 4-day gap with no update isn't acceptable. We're on it now and you'll hear back today.\n\nWhat's the ticket number?`,
  role_expertise:`Hi [Client Name],\n\nI apologize for the 4-day gap with no updates on your VPN ticket — that's not the level of service you should expect from us.\n\nI'm escalating this to tier-3 support now, which opens a 2-hour SLA response. Given the intermittent drop pattern you described, the senior engineer will run a full VPN diagnostic before end of day. You can expect:\n\n  • Escalation confirmation within 1 hour\n  • Diagnostic findings and resolution timeline by EOD\n\nI'll follow up directly once confirmed.\n\nBest,\n[Your Name]`,
  role_format:`Hi [Client Name],\n\nA 4-day gap with no updates on your VPN ticket is unacceptable and I apologize for that. I've escalated this to our senior team and am personally tracking it.\n\nYou can expect a direct update from me within 2 hours and a resolution timeline by end of business today.\n\nBest,\n[Your Name]`,
  role_tone:`[Client Name], four days with no update on your VPN ticket is a service failure on our end — I own that.\n\nI'm escalating this now and you'll have a status update within 2 hours with a concrete resolution timeline.`,
  near_full:`[Client Name], four days with no update on your VPN ticket is a service failure — I own that.\n\nI'm escalating to tier-3 now with a 2-hour SLA clock. They'll run a full diagnostic on the drop pattern before EOD and I'll follow up directly with a resolution timeline.`,
  full:`[Client Name], four days with no update on your VPN ticket is a service failure on our end — I own that.\n\nI'm escalating to tier-3 now with a 2-hour SLA clock. They'll run a full VPN diagnostic on the drop pattern before EOD and I'll follow up with you directly — not just a ticket notification — with a concrete resolution timeline.\n\nTicket number so I can track this personally?`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPTING LAYER DATA
// ═══════════════════════════════════════════════════════════════════════════════
const PL_DATA = [
  {
    prompt:`"Help me respond to this escalation"`,
    fill:1,
    response:`Dear [Client Name],\n\nI apologize for the delay in resolving your VPN issue and for the lack of updates. This is not the level of service we aim to provide.\n\nI have flagged your ticket as high priority and our team will reach out shortly. We appreciate your patience.\n\nBest regards, [Your Name]`,
    notes:[
      {ok:false,t:"Claude guessed the tone — you got corporate-speak by default despite full profile"},
      {ok:false,t:'"Shortly" — profile couldn\'t save you from a vague prompt\'s vague output'},
      {ok:true, t:"Profile helped: IT context partially present, no random tangents"},
      {ok:false,t:"Zero specificity — this could be for any ticket at any company"},
    ],
  },
  {
    prompt:`"Help me reply to a client — their VPN ticket is 4 days old with no updates and they're frustrated. Draft something direct."`,
    fill:2,
    response:`[Client Name], four days with no update on your VPN ticket isn't acceptable — I apologize for that.\n\nI'm escalating this now. You'll have a status update from me within 2 hours and a resolution timeline by end of business today.`,
    notes:[
      {ok:true, t:"Better: context in prompt + full profile = direct, owned response"},
      {ok:false,t:'"End of business today" is vague — no SLA language, no tier reference, profile expertise not activated'},
      {ok:false,t:"No scope awareness — Claude decided the next action without asking"},
      {ok:true, t:"Prose format respected, no filler — profile doing its job on style"},
    ],
  },
  {
    prompt:`"Task: draft a 2-3 sentence escalation reply.\nContext: VPN ticket open 4 days, no updates, client escalating to me.\nFormat: prose, direct, no filler.\nDon't include: vague timelines, bullets, closing pleasantries."`,
    fill:3,
    response:`[Client Name], four days with zero update on your VPN ticket is a service failure and I own it.\n\nI'm escalating to tier-3 now with a 2-hour SLA clock — they'll run a full diagnostic on the drop pattern before EOD. I'll follow up with you directly — not just a ticket notification — with a resolution timeline.`,
    notes:[
      {ok:true, t:"Prompt constraints + full profile = specific, technically accurate, owned"},
      {ok:true, t:"SLA language (tier-3, 2-hour clock) surfaces because both profile AND prompt set the right context"},
      {ok:false,t:"Still assuming the next action — no ask for ticket number"},
      {ok:true, t:"Prose, direct, no closing noise — all format constraints respected"},
    ],
  },
  {
    prompt:`"Role: IT support lead responding to enterprise client.\nTask: Draft a 2-3 sentence reply — de-escalate and show ownership.\nContext: VPN ticket open 4 days, intermittent drops, zero updates, client escalating directly to me.\nFormat: prose only, no bullets, no closing pleasantries.\nConstraints: give a specific next action and timeline. Ask the client for their ticket number rather than assuming it."`,
    fill:4,
    response:`[Client Name], four days with no update on your VPN ticket is a service failure on our end — I own that.\n\nI'm escalating to tier-3 now with a 2-hour SLA clock. They'll run a full VPN diagnostic on the drop pattern before EOD and I'll follow up with you directly — not just a ticket notification — with a concrete resolution timeline. What's your ticket number so I can track this personally?`,
    notes:[
      {ok:true, t:"Full framework + full profile = nothing left to chance"},
      {ok:true, t:"Scope-aware: asks for ticket number instead of assuming it"},
      {ok:true, t:"Every profile preference reflected: prose, direct, ITIL-aware, personal ownership"},
      {ok:true, t:"Every prompt constraint met: specific timeline, action-oriented, no noise"},
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STACK LAYERS
// ═══════════════════════════════════════════════════════════════════════════════
const LAYERS = [
  {n:5,name:"Plugins",state:"future",icon:"ti-plug",     adds:"Automated multi-step workflows. Claude triggers real-world actions — creates tickets, notifies engineers, logs SLAs — without you prompting each step.",example:"Client escalation auto-creates a P2 incident in your ITSM, notifies on-call via Slack, and starts the SLA clock — all from your single reply.",q:20},
  {n:4,name:"MCP",    state:"future",icon:"ti-database",  adds:"Real-time tools and data. Claude reads live systems, queries databases, and takes actions against external services mid-conversation.",example:"Claude pulls the actual ticket details, checks the client's SLA contract tier, and reviews the last 3 VPN diagnostics before you draft a word.",q:18},
  {n:3,name:"Skills", state:"future",icon:"ti-brain",     adds:"Specialized capability packs encoding domain workflows. Claude behaves like someone who has run this exact playbook before.",example:"A \"MSP Escalation\" skill encodes your SLA tiers, escalation paths, ITIL language, and client templates — used automatically.",q:17},
  {n:2,name:"Prompting",state:"next",icon:"ti-messages",  adds:"Request precision and structure. Frameworks eliminate ambiguity at the task level — profile sets the baseline, prompting structures each request.",example:"Same full profile: a vague prompt gets corporate-speak. A structured RCTF prompt gets the tier-3 SLA clock and scope-aware question you actually needed.",q:15},
  {n:1,name:"Profile",state:"current",icon:"ti-user-cog",adds:"Foundation context — who you are, what you do, how you want responses. Eliminates re-establishing context. Sets the baseline for everything above.",example:"With full profile: the 4-day VPN escalation is already framed with ITIL ownership, tier language, and direct prose — before you write a single word.",q:10},
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function buildSystemPrompt(P) {
  const parts = [];
  if (P.role)        parts.push("I am an IT support lead at a managed service provider (MSP). Draft messages on my behalf as if I am the author.");
  if (P.expertise)   parts.push("I am fluent with enterprise Windows environments, Active Directory, Cisco networking, and ITIL-aligned change management. Do not over-explain basic concepts.");
  if (P.environment) parts.push("I manage a team of 4 technicians and personally handle tier-2 and tier-3 escalations.");
  if (P.format)      parts.push("Format responses as prose only — no bullet points, numbered lists, or headers.");
  if (P.tone)        parts.push("Be direct. Eliminate filler phrases: 'I hope this finds you well', 'sincerely apologize for the inconvenience', 'please do not hesitate to reach out', and similar. No closing pleasantries.");
  if (P.constraints) parts.push("Do not decide my next action for me. If a step requires my decision — such as choosing an escalation path or committing to a specific timeline — ask me explicitly rather than assuming.");
  return parts.join("\n\n");
}

function getArchetype(P) {
  const{role:r,expertise:x,environment:e,format:f,tone:t,constraints:c}=P;
  if(r&&x&&e&&f&&t&&c) return "full";
  if(r&&(x||e)&&f&&t)  return "near_full";
  if(r&&t&&!f)          return "role_tone";
  if(r&&f&&!t)          return "role_format";
  if(r&&x&&!f&&!t)      return "role_expertise";
  if(r&&!x&&!e&&!f&&!t&&!c) return "role_only";
  if(!r&&!x&&!e&&(f||t||c)) return "style_only";
  if(r&&(f||t||x||e))   return "near_full";
  return "none";
}

function getScores(P) {
  const{role:r,expertise:x,environment:e,format:f,tone:t,constraints:c}=P;
  return{
    ctx:  Math.round(((r?3:0)+(x?2:0)+(e?2:0))/7*100),
    tone: Math.round(((t?3:0)+(c?1:0))/4*100),
    fmt:  Math.round(((f?4:0)+(t?1:0)+(c?1:0))/6*100),
    prec: Math.round(((r?1:0)+(x?1:0)+(e?1:0)+(f?1:0)+(t?1:0)+(c?1:0))/6*100),
  };
}

function getQL(prec) {
  if(prec>=90) return{label:"Optimal",    icon:"ti-circle-check", color:"var(--color-text-success)",bg:"var(--color-background-success)",border:"var(--color-border-success)"};
  if(prec>=60) return{label:"Partial",    icon:"ti-circle-half-2",color:"var(--color-text-warning)",bg:"var(--color-background-warning)",border:"var(--color-border-warning)"};
  if(prec>=30) return{label:"Limited",    icon:"ti-circle-dashed",color:"var(--color-text-info)",   bg:"var(--color-background-info)",   border:"var(--color-border-info)"};
  return        {label:"Generic",         icon:"ti-alert-circle", color:"var(--color-text-danger)",  bg:"var(--color-background-danger)", border:"var(--color-border-danger)"};
}

function getAnnotations(P) {
  const{role:r,expertise:x,environment:e,format:f,tone:t,constraints:c}=P;
  const arch = getArchetype(P);
  const issues=[], wins=[];
  if(!r&&!x&&!e){
    issues.push({sev:"high",t:"No domain context — reads as generic AI output, not an IT professional responding"});
    issues.push({sev:"high",t:"No ownership — 'our team is working on it' vs personal professional accountability"});
  }
  if(!t&&!f) issues.push({sev:"high",t:"Filler-heavy — 'sincerely apologize for the inconvenience' signals corporate-speak rather than expertise"});
  if(!f&&r&&!t) issues.push({sev:"medium",t:"Defaults to bullet list — reads as templated even when content is good"});
  if(!t&&r) issues.push({sev:"medium",t:"Closing pleasantries included — noise in a professional MSP context"});
  if(!x&&r) issues.push({sev:"low",t:"Technical depth uncalibrated — Claude doesn't know if tier-3/SLA language fits your environment"});
  if(!c&&r&&t) issues.push({sev:"low",t:"Scope unconstrained — Claude assumes the next action instead of asking"});
  if(arch==="style_only") issues.push({sev:"high",t:"Context-free directness — 'We're on it' reads differently from an unknown sender than from an IT lead at an MSP"});
  if(r) wins.push("Professional ownership and ITIL-aligned framing");
  if(x) wins.push("Correct technical depth — tier and SLA language is contextually appropriate");
  if(e) wins.push("Operationally grounded — response reflects actual team structure");
  if(f) wins.push("Prose format as configured — no bullets, no structural noise");
  if(t) wins.push("Direct voice — no filler phrases, no closing pleasantries");
  if(c) wins.push("Scope-aware — asks rather than assumes the next action");
  return{issues,wins};
}

function getComboNote(P) {
  const{role:r,expertise:x,environment:e,format:f,tone:t,constraints:c}=P;
  const sty=(f?1:0)+(t?1:0)+(c?1:0);
  if(!r&&sty>0)          return "⚠ Style without context: Claude knows how you want responses formatted but not who is sending them. Correctly styled, contextually hollow.";
  if(r&&!f&&!t&&sty===0) return "⚠ Context without style: Claude knows your role but defaults to its own format preferences — often bullets and closing pleasantries you don't want.";
  if(r&&(x||e)&&!t&&!f)  return "⚠ Deep context, no style: Strong technical grounding but Claude defaults to longer structured responses with bullets and formal closings.";
  return null;
}

// API call with exponential backoff — key is never logged, never in any string reaching the DOM
async function callAPIWithRetry(apiKey, systemPrompt, userMessage, attempt=1) {
  const MAX = 3;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model: BRAND.apiModel,
        max_tokens: 1000,
        ...(systemPrompt ? {system:systemPrompt} : {}),
        messages:[{role:"user",content:userMessage}],
      }),
    });
    if(!res.ok){
      const errData = await res.json().catch(()=>({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.content.find(b=>b.type==="text")?.text ?? "";
  } catch(err) {
    // Log error but never the API key — sanitize before logging
    console.error(`[QualityDemo] API attempt ${attempt}/${MAX}: ${err.message}`);
    if(attempt < MAX){
      await new Promise(r=>setTimeout(r, Math.pow(2,attempt)*500)); // 1s, 2s
      return callAPIWithRetry(apiKey, systemPrompt, userMessage, attempt+1);
    }
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY — catches render errors, no raw crash to blank screen
// ═══════════════════════════════════════════════════════════════════════════════
class ErrorBoundary extends Component {
  constructor(props){super(props);this.state={error:null};}
  static getDerivedStateFromError(err){return{error:err};}
  componentDidCatch(err){console.error("[QualityDemo] Uncaught render error:",err.message);}
  render(){
    if(!this.state.error) return this.props.children;
    return(
      <div style={{padding:20,border:"0.5px solid var(--color-border-danger)",borderRadius:8,background:"var(--color-background-danger)",fontFamily:"var(--font-sans)"}}>
        <div style={{fontWeight:500,fontSize:14,color:"var(--color-text-danger)",marginBottom:6}}>Render error</div>
        <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:14,fontFamily:"var(--font-mono)"}}>{this.state.error.message}</div>
        <button
          onClick={()=>this.setState({error:null})}
          style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,padding:"5px 14px",cursor:"pointer",color:"var(--color-text-secondary)",fontFamily:"var(--font-sans)",fontSize:12}}
        >Retry</button>
      </div>
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODE INDICATOR — LIVE/MOCK pill with tooltip
// ═══════════════════════════════════════════════════════════════════════════════
function ModeIndicator({mode,reason}){
  const[tip,setTip]=useState(false);
  const isLive=mode==="LIVE";
  const cfg=isLive
    ?{color:"var(--color-text-success)",bg:"var(--color-background-success)",border:"var(--color-border-success)",icon:"ti-circle-check",
      tip:"Responses are generated in real time by Claude. Your API key is stored in memory only — never logged or rendered to the DOM."}
    :{color:"var(--color-text-warning)",bg:"var(--color-background-warning)",border:"var(--color-border-warning)",icon:"ti-circle-dashed",
      tip:reason||"Showing representative example responses. Configure an API key to enable live generation."};
  return(
    <div style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={()=>setTip(s=>!s)}
        onBlur={()=>setTimeout(()=>setTip(false),150)}
        aria-label={`Mode: ${mode}. Click for details.`}
        style={{display:"flex",alignItems:"center",gap:5,background:cfg.bg,border:`0.5px solid ${cfg.border}`,borderRadius:100,padding:"2px 10px",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:11,color:cfg.color}}
      >
        <i className={`ti ${cfg.icon}`} aria-hidden="true" style={{fontSize:12}}/>
        {mode}
      </button>
      {tip&&(
        <div role="tooltip" style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,padding:"10px 12px",fontSize:12,color:"var(--color-text-secondary)",width:264,lineHeight:1.6,zIndex:20}}>
          {cfg.tip}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// API KEY CONFIG — key never rendered to DOM; password input only
// ═══════════════════════════════════════════════════════════════════════════════
function ApiKeyConfig({hasKey,onSet,onClear}){
  const[open,setOpen]=useState(false);
  const[draft,setDraft]=useState("");
  const ref=useRef(null);

  function submit(){
    if(!draft.trim()) return;
    onSet(draft.trim());
    setDraft(""); // clear draft immediately
    setOpen(false);
  }
  function onKeyDown(e){
    if(e.key==="Enter") submit();
    if(e.key==="Escape"){setOpen(false);setDraft("");}
  }

  if(hasKey) return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {/* Confirm key presence without rendering any part of its value */}
      <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>●●● configured</span>
      <button onClick={onClear} aria-label="Clear API key" style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"var(--color-text-tertiary)",padding:0}}>clear</button>
    </div>
  );

  return(
    <div style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={()=>{setOpen(o=>!o);setTimeout(()=>ref.current?.focus(),60);}}
        aria-label="Configure API key for live mode"
        aria-expanded={open}
        style={{background:"none",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:11,color:"var(--color-text-secondary)",fontFamily:"var(--font-sans)",display:"flex",alignItems:"center",gap:5}}
      >
        <i className="ti ti-key" aria-hidden="true" style={{fontSize:12}}/>
        Enable live
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,padding:12,zIndex:20,width:268}}>
          <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8,lineHeight:1.5}}>
            Anthropic API key — stored in memory only. Never logged, never rendered to the DOM.
          </div>
          <div style={{display:"flex",gap:6}}>
            <input
              ref={ref}
              type="password"
              value={draft}
              onChange={e=>setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="sk-ant-..."
              aria-label="Anthropic API key"
              autoComplete="off"
              style={{flex:1,padding:"5px 8px",fontSize:12,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:6,color:"var(--color-text-primary)",fontFamily:"var(--font-mono)",outline:"none"}}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              style={{padding:"5px 10px",fontSize:12,background:draft.trim()?"var(--color-background-info)":"var(--color-background-secondary)",border:`0.5px solid ${draft.trim()?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:6,cursor:draft.trim()?"pointer":"default",color:draft.trim()?"var(--color-text-info)":"var(--color-text-tertiary)"}}
            >Set</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK FALLBACK BANNER — shown when auto-fallback fires
// ═══════════════════════════════════════════════════════════════════════════════
function FallbackBanner({reason,onConfigure}){
  if(!reason) return null;
  return(
    <div role="status" aria-live="polite" style={{background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:8,padding:"8px 14px",fontSize:12,color:"var(--color-text-warning)",marginBottom:14,display:"flex",alignItems:"center",gap:10,lineHeight:1.5}}>
      <i className="ti ti-alert-triangle" aria-hidden="true" style={{flexShrink:0}}/>
      <span style={{flex:1}}>{reason}</span>
      <button
        onClick={onConfigure}
        aria-label="Configure API key"
        style={{background:"none",border:"0.5px solid var(--color-border-warning)",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontSize:11,color:"var(--color-text-warning)",whiteSpace:"nowrap"}}
      >Configure</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOGGLE ROW — keyboard navigable, role=switch
// ═══════════════════════════════════════════════════════════════════════════════
function ToggleRow({id,label,detail,active,onToggle}){
  return(
    <div
      role="switch"
      aria-checked={active}
      aria-label={`${label}: ${detail}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onToggle();}}}
      onFocus={e=>{e.currentTarget.style.boxShadow="0 0 0 2px var(--color-border-info)";}}
      onBlur={e=>{e.currentTarget.style.boxShadow="none";}}
      style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:8,marginBottom:6,cursor:"pointer",border:`0.5px solid ${active?"var(--color-border-info)":"var(--color-border-tertiary)"}`,background:active?"var(--color-background-info)":"transparent",transition:"background .12s, border-color .12s",outline:"none",minHeight:44}}
    >
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <span style={{fontSize:12,color:active?"var(--color-text-info)":"var(--color-text-primary)"}}>{label}</span>
        <span style={{fontSize:10,color:active?"rgba(96,165,250,0.6)":"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{detail}</span>
      </div>
      <div style={{width:28,height:16,borderRadius:100,background:active?"var(--color-text-info)":"var(--color-background-secondary)",border:`0.5px solid ${active?"transparent":"var(--color-border-secondary)"}`,position:"relative",flexShrink:0,transition:"background .12s"}}>
        <div style={{width:12,height:12,borderRadius:"50%",background:active?"#fff":"var(--color-text-tertiary)",position:"absolute",top:1.5,left:active?14:1.5,transition:"left .12s, background .12s"}}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE GRID
// ═══════════════════════════════════════════════════════════════════════════════
function ScoreGrid({P}){
  const sc=getScores(P);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:14}}>
      {[["ctx","Context","var(--color-text-info)"],["tone","Tone","var(--color-text-warning)"],["fmt","Format","var(--color-text-success)"],["prec","Precision","#a78bfa"]].map(([k,lbl,col])=>(
        <div key={k} style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:8,padding:"8px 10px"}}>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
          <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}} role="progressbar" aria-valuenow={sc[k]} aria-valuemin={0} aria-valuemax={100} aria-label={`${lbl}: ${sc[k]}%`}>
            <div style={{width:`${sc[k]}%`,height:"100%",background:col,borderRadius:2,transition:"width 0.35s ease"}}/>
          </div>
          <div style={{fontSize:11,marginTop:3,fontFamily:"var(--font-mono)",color:col}}>{sc[k]}%</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function ResponsePanel({P,mode,liveResponse,liveLoading,liveError}){
  const arch=getArchetype(P);
  const mockText=MR[arch]||MR.none;
  const displayText=mode==="LIVE"&&liveResponse ? liveResponse : mockText;
  const sc=getScores(P);
  const ql=getQL(sc.prec);
  const{issues,wins}=getAnnotations(P);
  const comboNote=getComboNote(P);

  const annLabel=issues.length>0&&wins.length>0?"What changed / what's still missing":issues.length>0?"Issues with this response":wins.length>0?"What the active elements unlock":null;

  return(
    <div>
      <div aria-busy={liveLoading} aria-live="polite" aria-atomic="false" style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,paddingBottom:10,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em"}}>
            Claude's response
            {mode==="LIVE"&&liveResponse&&<span style={{color:"var(--color-text-success)",marginLeft:6}}>· live</span>}
            {mode==="LIVE"&&!liveResponse&&!liveLoading&&<span style={{color:"var(--color-text-warning)",marginLeft:6}}>· mock fallback</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,borderRadius:100,padding:"3px 10px",border:`0.5px solid ${ql.border}`,color:ql.color,background:ql.bg}}>
            <i className={`ti ${ql.icon}`} aria-hidden="true"/>
            {ql.label}
          </div>
        </div>

        {liveLoading?(
          <div style={{display:"flex",alignItems:"center",gap:8,minHeight:100,color:"var(--color-text-tertiary)",fontSize:13}} role="status" aria-label="Generating live response">
            <i className="ti ti-loader-2" aria-hidden="true" style={{fontSize:16,animation:"spin 1s linear infinite"}}/>
            Generating live response…
          </div>
        ):(
          <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.75,whiteSpace:"pre-wrap",fontFamily:"var(--font-mono)",minHeight:100}}>
            {displayText}
          </div>
        )}

        {comboNote&&(
          <div style={{background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"var(--color-text-warning)",marginTop:10,lineHeight:1.5}}>
            {comboNote}
          </div>
        )}
      </div>

      {annLabel&&(
        <div style={{marginTop:14}}>
          <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{annLabel}</div>
          {wins.map((w,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:12,lineHeight:1.5,marginBottom:5,alignItems:"flex-start"}}>
              <i className="ti ti-check" aria-hidden="true" style={{fontSize:13,color:"var(--color-text-success)",flexShrink:0,marginTop:1}}/>
              <span style={{color:"var(--color-text-secondary)"}}>{w}</span>
            </div>
          ))}
          {issues.map((is,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:12,lineHeight:1.5,marginBottom:5,alignItems:"flex-start"}}>
              <i className="ti ti-x" aria-hidden="true" style={{fontSize:13,color:is.sev==="high"?"var(--color-text-danger)":is.sev==="medium"?"var(--color-text-warning)":"var(--color-text-tertiary)",flexShrink:0,marginTop:1}}/>
              <span style={{color:is.sev==="high"?"var(--color-text-secondary)":"var(--color-text-tertiary)"}}>{is.t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  // API key in state only — never logged, never rendered
  const[apiKey,setApiKey]=useState("");
  const[mode,setMode]=useState("MOCK");
  const[fallbackReason,setFallbackReason]=useState(null);

  const[P,setP]=useState({role:false,expertise:false,environment:false,format:false,tone:false,constraints:false});
  const[activeTab,setActiveTab]=useState(0);

  const[liveResponse,setLiveResponse]=useState(null);
  const[liveLoading,setLiveLoading]=useState(false);

  const[currentPL,setCurrentPL]=useState(0);
  const[showKeyConfig,setShowKeyConfig]=useState(false);

  // Environment detection on mount — logs resolved state, never the key
  useEffect(()=>{
    console.log("[QualityDemo]",{mode,clientMode:CLIENT_MODE,viewport:window.innerWidth,version:BRAND.version});
  },[]);

  // Fetch live response when profile changes in LIVE mode
  useEffect(()=>{
    if(mode!=="LIVE"||!apiKey) return;
    let cancelled=false;
    setLiveLoading(true);
    setLiveResponse(null);

    const sp=buildSystemPrompt(P);
    callAPIWithRetry(apiKey, sp, BRAND.userMessage)
      .then(text=>{if(!cancelled){setLiveResponse(text);setLiveLoading(false);}})
      .catch(err=>{
        if(!cancelled){
          const isCORS=err.message.includes("Failed to fetch")||err.message.includes("NetworkError")||err.message.includes("CORS");
          // Auto-fallback to MOCK with banner explaining why
          setMode("MOCK");
          setFallbackReason(
            isCORS
              ? "API unreachable from this context (CORS). LIVE mode works inside the claude.ai artifact iframe. Showing representative examples."
              : `API error: ${err.message}. Showing representative examples.`
          );
          setLiveLoading(false);
        }
      });
    return()=>{cancelled=true;};
  },[P,mode,apiKey]);

  function handleSetKey(key){
    setApiKey(key); // key in state only
    if(key){setMode("LIVE");setFallbackReason(null);}
    else setMode("MOCK");
  }
  function handleClearKey(){
    setApiKey(""); // remove from state
    setMode("MOCK");
    setLiveResponse(null);
    setFallbackReason(null);
  }
  function toggleP(key){setP(prev=>({...prev,[key]:!prev[key]}));}

  const ELEMENTS=[
    {id:"role",       group:"know", label:"Role & industry",    detail:"IT support lead, MSP"},
    {id:"expertise",  group:"know", label:"Expertise & tools",  detail:"Windows, AD, Cisco, ITIL"},
    {id:"environment",group:"know", label:"Environment context",detail:"Team of 4, tier-2/3"},
    {id:"format",     group:"style",label:"Output format",      detail:"Prose, no bullet lists"},
    {id:"tone",       group:"style",label:"Tone & voice",       detail:"Direct, no filler"},
    {id:"constraints",group:"style",label:"Scope constraints",  detail:"Don't assume my decisions"},
  ];

  // Stack tab suppressed in client mode per directives
  const tabs=CLIENT_MODE?["Profile impact","Prompting layer"]:["Profile impact","Prompting layer","The stack"];

  return(
    <ErrorBoundary>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:767px){
          .two-col{grid-template-columns:1fr !important}
          .pr-panel{grid-template-columns:1fr !important}
          .dk-row{grid-template-columns:1fr !important}
        }
        *:focus-visible{outline:2px solid var(--color-border-info);outline-offset:2px}
      `}</style>

      {/* ── SKIP LINK ── */}
      <a href="#qd-main" style={{position:"absolute",top:"-100%",left:0,padding:"8px 16px",background:"var(--color-text-primary)",color:"var(--color-background-primary)",fontSize:13,fontWeight:500,zIndex:100,textDecoration:"none",borderRadius:"0 0 8px 0"}} onFocus={e=>{e.currentTarget.style.top="0";}} onBlur={e=>{e.currentTarget.style.top="-100%";}}>Skip to main content</a>
      {/* ── PAGE TITLE (h1 for screen readers + visual) ── */}
      <h1 style={{fontSize:11,color:'var(--color-text-tertiary)',fontFamily:'var(--font-mono)',fontWeight:400,padding:'10px 0 2px',letterSpacing:'.04em'}}>
        {CLIENT_MODE ? BRAND.name : `${BRAND.internalTag} · ${BRAND.name}`}
      </h1>
      {/* ── HEADER ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12,borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {!CLIENT_MODE&&<span style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{BRAND.internalTag}</span>}
          <span style={{fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{BRAND.version}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <ApiKeyConfig hasKey={!!apiKey} onSet={handleSetKey} onClear={handleClearKey}/>
          <ModeIndicator mode={mode} reason={fallbackReason}/>
        </div>
      </div>

      {/* ── FALLBACK BANNER ── */}
      <FallbackBanner reason={fallbackReason} onConfigure={()=>document.querySelector("[aria-label='Configure API key for live mode']")?.click()}/>

      {/* ── TAB NAV ── */}
      <div role="tablist"
        style={{display:"flex",borderBottom:"0.5px solid var(--color-border-tertiary)"}}
        onKeyDown={e=>{
          if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
          e.preventDefault();
          const count=tabs.length;
          let next=activeTab;
          if(e.key==='ArrowRight') next=(activeTab+1)%count;
          if(e.key==='ArrowLeft')  next=(activeTab-1+count)%count;
          if(e.key==='Home')       next=0;
          if(e.key==='End')        next=count-1;
          if(next!==activeTab){setActiveTab(next);setTimeout(()=>{const p=document.getElementById('qd-main');if(p)p.focus();},50);}
        }}>
        {tabs.map((label,i)=>(
          <button key={i} role="tab" aria-selected={activeTab===i}
            tabIndex={activeTab===i?0:-1}
            onClick={()=>{setActiveTab(i);setTimeout(()=>{const p=document.getElementById("qd-main");if(p)p.focus();},50);}}
            style={{background:"none",border:"none",borderBottom:`2px solid ${activeTab===i?"var(--color-text-primary)":"transparent"}`,padding:"10px 18px",fontSize:13,color:activeTab===i?"var(--color-text-primary)":"var(--color-text-tertiary)",fontFamily:"var(--font-sans)",cursor:"pointer",marginBottom:-1,minHeight:44}}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB 0: PROFILE IMPACT ══ */}
      {activeTab===0&&(
        <div id="qd-main" style={{padding:"20px 0"}} role="tabpanel" aria-label="Profile impact" tabIndex={activeTab===0?0:-1}>
          <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--color-text-secondary)",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{background:"var(--color-background-info)",border:"0.5px solid var(--color-border-info)",borderRadius:8,padding:"4px 8px",fontSize:13,color:"var(--color-text-info)",flexShrink:0}} aria-hidden="true"><i className="ti ti-ticket"/></span>
            <div><strong style={{color:"var(--color-text-primary)"}}>Sample task:</strong> {BRAND.scenarioText}</div>
          </div>

          <div className="two-col" style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div role="group" aria-label="Know you — context Claude uses">
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}} aria-hidden="true">Know you</div>
              {ELEMENTS.filter(el=>el.group==="know").map(el=>(
                <ToggleRow key={el.id} id={el.id} label={el.label} detail={el.detail} active={P[el.id]} onToggle={()=>toggleP(el.id)}/>
              ))}
              </div>{/* /group: know you */}
              <div role="group" aria-label="Response style — how Claude formats output" style={{marginTop:14}}>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}} aria-hidden="true">Response style</div>
              {ELEMENTS.filter(el=>el.group==="style").map(el=>(
                <ToggleRow key={el.id} id={el.id} label={el.label} detail={el.detail} active={P[el.id]} onToggle={()=>toggleP(el.id)}/>
              ))}
              </div>{/* /group: response style */}
              <ScoreGrid P={P}/>
            </div>

            <ResponsePanel P={P} mode={mode} liveResponse={liveResponse} liveLoading={liveLoading} liveError={null}/>
          </div>
        </div>
      )}

      {/* ══ TAB 1: PROMPTING LAYER ══ */}
      {activeTab===1&&(
        <div id="qd-main" style={{padding:"20px 0"}} role="tabpanel" aria-label="Prompting layer" tabIndex={activeTab===1?0:-1}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--color-background-success)",border:"0.5px solid var(--color-border-success)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"var(--color-text-success)",marginBottom:16}}>
            <i className="ti ti-circle-check" aria-hidden="true"/>
            Full profile active — all 6 elements configured. Profile is the floor. Prompting is the multiplier.
          </div>
          <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--color-text-secondary)",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{background:"var(--color-background-info)",border:"0.5px solid var(--color-border-info)",borderRadius:8,padding:"4px 8px",fontSize:13,color:"var(--color-text-info)",flexShrink:0}} aria-hidden="true"><i className="ti ti-ticket"/></span>
            <div><strong style={{color:"var(--color-text-primary)"}}>Same task:</strong> {BRAND.scenarioText}</div>
          </div>

          <div className="pr-panel" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Prompt quality level</div>
              {PL_DATA.map((item,i)=>(
                <div key={i} role="button" tabIndex={0}
                  onClick={()=>setCurrentPL(i)}
                  onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setCurrentPL(i);}}}
                  onFocus={e=>{e.currentTarget.style.boxShadow="0 0 0 2px var(--color-border-info)";}}
                  onBlur={e=>{e.currentTarget.style.boxShadow="none";}}
                  aria-label={`Prompt level ${i+1}: ${["Vague","Basic context","Structured request","Full framework"][i]}`}
                  aria-pressed={currentPL===i}
                  style={{padding:12,border:`0.5px solid ${currentPL===i?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:8,cursor:"pointer",marginBottom:8,background:currentPL===i?"var(--color-background-info)":"transparent",outline:"none",transition:"all .12s"}}
                >
                  <div style={{fontSize:9,fontFamily:"var(--font-mono)",color:currentPL===i?"rgba(96,165,250,0.7)":"var(--color-text-tertiary)",marginBottom:3}}>Level {i+1}</div>
                  <div style={{fontSize:12,fontWeight:500,color:currentPL===i?"var(--color-text-info)":"var(--color-text-primary)",marginBottom:2}}>{["Vague","Basic context","Structured request","Full framework (RCTF)"][i]}</div>
                  <div style={{fontSize:10,color:currentPL===i?"rgba(96,165,250,0.5)":"var(--color-text-tertiary)",fontFamily:"var(--font-mono)"}}>{item.prompt.slice(0,58)}…</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>The prompt</div>
              <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:8,padding:12,fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)",whiteSpace:"pre-wrap",lineHeight:1.6,marginBottom:12,minHeight:70}}>
                {PL_DATA[currentPL].prompt}
              </div>

              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Output quality</div>
              <div style={{display:"flex",gap:5,marginBottom:12}} role="progressbar" aria-valuenow={PL_DATA[currentPL].fill} aria-valuemin={0} aria-valuemax={4} aria-label={`Prompt quality: level ${PL_DATA[currentPL].fill} of 4`}>
                {[0,1,2,3].map(j=>(
                  <div key={j} style={{flex:1,height:3,borderRadius:2,background:j<PL_DATA[currentPL].fill?"var(--color-text-info)":"rgba(255,255,255,0.06)"}}/>
                ))}
              </div>

              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Claude's response</div>
              <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"13px 15px",marginBottom:12}}>
                <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.75,whiteSpace:"pre-wrap",minHeight:80}}>
                  {PL_DATA[currentPL].response}
                </div>
              </div>

              {PL_DATA[currentPL].notes.map((n,i)=>(
                <div key={i} style={{display:"flex",gap:8,fontSize:11,lineHeight:1.5,marginBottom:5,alignItems:"flex-start"}}>
                  <i className={`ti ti-${n.ok?"check":"x"}`} aria-hidden="true" style={{fontSize:12,color:n.ok?"var(--color-text-success)":"var(--color-text-danger)",flexShrink:0,marginTop:1}}/>
                  <span style={{color:n.ok?"var(--color-text-secondary)":"var(--color-text-tertiary)"}}>{n.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next module teaser */}
          <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:16,marginTop:16,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,background:"var(--color-background-info)",border:"0.5px solid var(--color-border-info)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}} aria-hidden="true">
              <i className="ti ti-messages" style={{color:"var(--color-text-info)"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>Next module</div>
              <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:2}}>Prompting frameworks — RCTF, chain-of-thought, examples, and when each applies</div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.5}}>Profile sets the baseline. Prompting structures every individual request. The combination is multiplicative, not additive. This module covers when to use each framework, how to layer them, and the failure modes of each.</div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 2: THE STACK (suppressed in CLIENT_MODE) ══ */}
      {!CLIENT_MODE&&activeTab===2&&(
        <div id="qd-main" style={{padding:"20px 0"}} role="tabpanel" aria-label="The stack" tabIndex={!CLIENT_MODE&&activeTab===2?0:-1}>
          <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,marginBottom:20,maxWidth:580}}>
            Each layer multiplies the one below it. Profile without prompting gets you ~60% of potential. Each layer up the stack compounds the ones below.
          </div>

          {/* Quality ceiling bar */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8}}>Output quality ceiling by stack depth</div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:2,height:6,overflow:"hidden",display:"flex"}} role="img" aria-label="Quality ceiling bar: Profile 10%, Prompting 15%, Skills 17%, MCP 18%, Plugins 20%">
              {[...LAYERS].reverse().map((l,i)=>(
                <div key={i} style={{width:`${l.q}%`,height:"100%",background:["#4ade80","#60a5fa","#a78bfa","#f59e0b","#f87171"][i],borderRight:"1px solid rgba(0,0,0,0.3)"}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:4,marginTop:6}} aria-hidden="true">
              {["Profile","Prompting","Skills","MCP","Plugins"].map((l,i)=>(
                <div key={i} style={{flex:LAYERS[4-i].q,fontSize:9,color:["#4ade80","#60a5fa","#a78bfa","#f59e0b","#f87171"][i],textAlign:"center",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{l}</div>
              ))}
            </div>
          </div>

          {/* Stack layers */}
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
            {LAYERS.map(l=>(
              <div key={l.n} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:`0.5px solid ${l.state==="current"?"var(--color-border-success)":l.state==="next"?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:8,background:l.state==="current"?"var(--color-background-success)":l.state==="next"?"var(--color-background-info)":"transparent",opacity:l.state==="future"?0.5:1}}>
                <div style={{width:24,height:24,background:"var(--color-background-secondary)",border:`0.5px solid ${l.state==="current"?"var(--color-border-success)":l.state==="next"?"var(--color-border-info)":"var(--color-border-secondary)"}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:"var(--font-mono)",flexShrink:0,color:l.state==="current"?"var(--color-text-success)":l.state==="next"?"var(--color-text-info)":"var(--color-text-tertiary)"}} aria-hidden="true">{l.n}</div>
                <i className={`ti ${l.icon}`} aria-hidden="true" style={{fontSize:16,width:20,textAlign:"center",flexShrink:0,color:l.state==="current"?"var(--color-text-success)":l.state==="next"?"var(--color-text-info)":"var(--color-text-tertiary)"}}/>
                <div style={{fontSize:13,fontWeight:500,width:80,flexShrink:0,color:l.state==="current"?"var(--color-text-success)":l.state==="next"?"var(--color-text-info)":"var(--color-text-primary)"}}>{l.name}</div>
                <div style={{fontSize:12,flex:1,color:l.state==="current"?"var(--color-text-success)":l.state==="next"?"var(--color-text-info)":"var(--color-text-tertiary)",lineHeight:1.5}}>{l.adds}</div>
                {l.state==="current"&&<span style={{fontSize:10,borderRadius:100,padding:"2px 8px",border:"0.5px solid var(--color-border-success)",color:"var(--color-text-success)",background:"var(--color-background-success)",flexShrink:0}}>Complete</span>}
                {l.state==="next"&&<span style={{fontSize:10,borderRadius:100,padding:"2px 8px",border:"0.5px solid var(--color-border-info)",color:"var(--color-text-info)",background:"var(--color-background-info)",flexShrink:0}}>Next</span>}
              </div>
            ))}
          </div>

          {/* Scenario examples */}
          <div style={{background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:16}}>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>What each layer adds to the VPN escalation scenario</div>
            {LAYERS.map((l,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<LAYERS.length-1?"0.5px solid var(--color-border-tertiary)":"none"}}>
                <div style={{width:60,flexShrink:0,fontSize:11,fontWeight:500,color:l.state==="current"?"var(--color-text-success)":l.state==="next"?"var(--color-text-info)":"var(--color-text-tertiary)"}}>{l.name}</div>
                <div style={{fontSize:12,color:l.state==="future"?"var(--color-text-tertiary)":"var(--color-text-secondary)",lineHeight:1.55}}>{l.example}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
