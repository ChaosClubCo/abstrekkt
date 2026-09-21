import { useState, useEffect, useRef } from "react";

const GF = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');";
const T = { bg:"#0c0c0b",sf:"#111110",cd:"#181815",b:"#232320",bh:"#303030",ac:"#d4893a",ah:"#e8a050",tx:"#ddd8ce",t2:"#807c74",t3:"#3a3835",gn:"#5a9c5a",m2:"#78afc8",rd:"#c05050",tg:"#1e1e1a" };
const S = {
  app:{ minHeight:"100vh", background:T.bg, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, lineHeight:1.65, color:T.tx },
  hd:{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:T.tx },
  mn:{ fontFamily:"'IBM Plex Mono',monospace" },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const MODELS = [
  { name:"Claude Opus 4.7",  str:"claude-opus-4-7",             pricing:"$5 / $25",  ctx:"1M",   badge:"Most capable", bc:T.gn },
  { name:"Claude Sonnet 4.6",str:"claude-sonnet-4-6",           pricing:"$3 / $15",  ctx:"1M",   badge:"Recommended",  bc:T.ac },
  { name:"Claude Haiku 4.5", str:"claude-haiku-4-5-20251001",   pricing:"$0.80 / $4",ctx:"200K", badge:"Fast / cheap",  bc:T.m2 },
];

const BREAKING = [
  { title:"budget_tokens removed", before:"thinking: {type: 'enabled', budget_tokens: 32000}", after:"thinking: {type: 'adaptive'} + effort: 'xhigh'", note:"Adaptive thinking is OFF by default — must opt in explicitly." },
  { title:"temperature / top_p / top_k → 400 error", before:"temperature: 0.7, top_p: 0.9", after:"Omit entirely — these params return HTTP 400 on Opus 4.7", note:"No workaround. Remove from all API calls targeting 4.7." },
  { title:"New tokenizer — 1.0×–1.35× more tokens", before:"Same text, old token count", after:"Same text may cost up to 35% more tokens", note:"Update max_tokens estimates. Prompt caching still cuts input 90%." },
  { title:"Thinking off by default", before:"Previous models thought automatically on hard tasks", after:"Must pass thinking: {type: 'adaptive'} to enable", note:"Sonnet 4.6 unaffected — these changes are Opus 4.7 only." },
];

const PLANS = [
  { plan:"Free",       price:"$0",         features:"Chat, web search, limited messages, basic file handling" },
  { plan:"Pro",        price:"$20/mo",      features:"Projects, Memory, Connectors, Artifacts storage, file creation, Cowork, extended thinking" },
  { plan:"Max",        price:"$100–200/mo", features:"All Pro + highest usage limits, priority access" },
  { plan:"Team",       price:"Per seat",    features:"All Pro + admin controls, team workspaces, centralized billing" },
  { plan:"Enterprise", price:"Custom",      features:"SSO/SAML, SCIM, admin console, data retention, SOC 2 Type II, dedicated support" },
];

const COMPETITIVE = [
  { label:"Top model",       claude:"Opus 4.7",          gpt:"GPT-5.4",         gem:"Gemini 3.1 Pro" },
  { label:"SWE-bench",       claude:"82%+ (Opus 4.7)",   gpt:"~57.7%",          gem:"Not reported" },
  { label:"Context",         claude:"1M tokens",          gpt:"128K",            gem:"1M+" },
  { label:"MCP / plugins",   claude:"MCP open standard", gpt:"Plugins (closed)",gem:"Extensions (closed)" },
  { label:"Pricing (Opus)",  claude:"$5/$25 per 1M",     gpt:"$15/$60",         gem:"$7/$21" },
  { label:"Ad-free",         claude:"Yes (claude.ai)",   gpt:"Some surfaces",   gem:"Some surfaces" },
];

const STEPS = [
  { id:1,  label:"Create Claude account",               desc:"claude.ai — sign up or log in.",                                         plan:"free", cat:"Foundation" },
  { id:2,  label:"Understand your plan",                desc:"Free → Pro → Team → Enterprise. Know the unlock gates.",                 plan:"free", cat:"Foundation" },
  { id:3,  label:"Upgrade to Pro (recommended)",        desc:"$20/mo. Required for Projects, memory, connectors.",                    plan:"pro",  cat:"Foundation" },
  { id:4,  label:"Explore the interface",               desc:"Send test messages. Try drafting something from your work.",             plan:"free", cat:"Foundation" },
  { id:5,  label:"Create your first Project",           desc:"Settings → Projects → New Project. Persistent context per workflow.",   plan:"pro",  cat:"Projects & Memory" },
  { id:6,  label:"Write Project custom instructions",   desc:"Add your role, preferences, working style. Use the prompt package.",    plan:"pro",  cat:"Projects & Memory" },
  { id:7,  label:"Configure memory",                    desc:"Settings → Memory. Review and curate what Claude captures.",            plan:"pro",  cat:"Projects & Memory" },
  { id:8,  label:"Add 3–5 memory edits",                desc:"Format: 'User is [role] at [company]. Prefers [style].'",              plan:"pro",  cat:"Projects & Memory" },
  { id:9,  label:"Install a connector",                 desc:"Settings → Connectors. Connect a tool you use daily.",                  plan:"pro",  cat:"Connectors" },
  { id:10, label:"Test connector with a live query",    desc:"Ask Claude something using real data. Verify accuracy.",                plan:"pro",  cat:"Connectors" },
  { id:11, label:"Practice your #1 use case",           desc:"Use Claude for the highest-impact task. Do it for real.",               plan:"free", cat:"Real Work" },
  { id:12, label:"Build your first Artifact",           desc:"Ask Claude to create a doc, table, or code snippet.",                   plan:"free", cat:"Real Work" },
  { id:13, label:"Try web search",                      desc:"Enable on Pro/Max. Ask something current. Check citations.",            plan:"pro",  cat:"Real Work" },
  { id:14, label:"Submit first weekly check-in",        desc:"Open the Employee Suite. Log how Claude is going.",                    plan:"free", cat:"Accountability" },
  { id:15, label:"Set a recurring Claude habit",        desc:"Block 10 min/week. One new use case. Track in check-ins.",             plan:"free", cat:"Accountability" },
];

const TOOLS = [
  { id:"flowchart", num:"00", title:"Enablement Flowchart",   role:"facilitator", key:"claude-enablement-v1",   when:"During every session",       note:"Run during live session to track progress in real time." },
  { id:"intake",    num:"01", title:"Pre-Session Intake",     role:"facilitator", key:"intake-records-v1",      when:"Before every session",       note:"Employee profile → session brief. Opens Prompt Builder." },
  { id:"prompts",   num:"02", title:"Prompt Package Builder", role:"facilitator", key:"prompt-packages-v1",     when:"Before / during session",    note:"Load from intake. Generates 6 tailored prompts via API." },
  { id:"self",      num:"03", title:"Self-Service Setup",     role:"employee",    key:"self-setup-v1",          when:"Employee bookmarks post-session", note:"15-step checklist. Locked to plan. Saves progress." },
  { id:"outcomes",  num:"04", title:"Outcome Tracker",        role:"facilitator", key:"outcome-records-v1",     when:"After every session",        note:"QC gate (7 items, 4 critical). Dashboard + log views." },
  { id:"checkins",  num:"05", title:"Accountability Tracker", role:"employee",    key:"checkin-records-v1",     when:"Weekly, between sessions",   note:"Frequency, confidence, win/stuck/goal. Reviewed by facilitator." },
  { id:"obj",       num:"06", title:"Objection Handler",      role:"facilitator", key:"— (stateless)",          when:"During session, on demand",  note:"8-item library + live AI chat for anything not covered." },
  { id:"report",    num:"07", title:"Program Health Report",  role:"facilitator", key:"— (reads all)",          when:"Weekly / stakeholder updates",note:"AI narrative from all program data. Sonnet 4.6, 1200 tokens." },
];

const SYS = `You are a Claude expert embedded in the Claude Enablement Suite. You help facilitators and employees understand Claude's capabilities, plans, API, and best practices.

Key facts (May 2026):
Models: Opus 4.7 ($5/$25, 1M ctx), Sonnet 4.6 ($3/$15, 1M ctx), Haiku 4.5 ($0.80/$4, 200K ctx).
Opus 4.7 breaking changes (API only): budget_tokens removed → use thinking:{type:'adaptive'}+effort:'xhigh'. temperature/top_p/top_k return 400 → omit. New tokenizer adds up to 35% more tokens. Thinking is OFF by default.
Deprecating June 15 2026: claude-opus-4-20250514, claude-sonnet-4-20250514.
Plans: Free, Pro ($20/mo), Max ($100-200/mo), Team (per seat), Enterprise (custom).
Pro unlocks: Projects, Memory, Connectors, Artifacts storage, file creation, Cowork, Claude Code.
Competitive: Opus 4.7 82%+ SWE-bench vs GPT-5.4 ~57.7%. MCP open standard vs closed plugins. $5/$25 vs $15/$60 (GPT-5.4). Claude products are ad-free.
Be direct, specific, and practical. Under 150 words per response unless the question genuinely requires more.`;

const ld = async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sv = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };

// ─── ATOMS ─────────────────────────────────────────────────────────────────────

function Btn({ children, onClick, disabled, accent, style={} }) {
  return <button onClick={onClick} disabled={disabled} style={{ background:"transparent", border:`1px solid ${accent&&!disabled?T.ac:T.bh}`, borderRadius:2, color:disabled?T.t3:accent?T.ac:T.t2, ...S.mn, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 12px", cursor:disabled?"not-allowed":"pointer", transition:"all .15s", ...style }}>{children}</button>;
}
function Card({ children, style={} }) {
  return <div style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, padding:"12px 14px", marginBottom:8, ...style }}>{children}</div>;
}
function Tag({ children, color }) {
  return <span style={{ background:T.tg, border:`1px solid ${T.bh}`, borderRadius:2, ...S.mn, fontSize:9, padding:"1px 6px", color:color||T.t2 }}>{children}</span>;
}
function SH({ children, size=14, mb=8 }) {
  return <div style={{ ...S.hd, fontSize:size, marginBottom:mb }}>{children}</div>;
}
function MN({ children, color, size=10 }) {
  return <span style={{ ...S.mn, fontSize:size, color:color||T.t2 }}>{children}</span>;
}
function TH(props) {
  return <th style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t2, textAlign:"left", padding:"5px 10px", borderBottom:`1px solid ${T.b}`, ...props.style }}>{props.children}</th>;
}
function TD(props) {
  return <td style={{ padding:"7px 10px", borderBottom:`1px solid ${T.tg}`, fontSize:12, verticalAlign:"top", ...props.style }}>{props.children}</td>;
}

// ─── TABS ──────────────────────────────────────────────────────────────────────

function NavigatorTab() {
  const [open, setOpen] = useState({});
  const tog = id => setOpen(p => ({...p,[id]:!p[id]}));
  return <div>
    <SH>Suite Navigator</SH>
    <p style={{ fontSize:11, color:T.t2, marginBottom:14 }}>All 8 artifacts, their storage keys, and when to use them. Facilitator-facing artifacts in the Facilitator Suite. Employee-facing in the Employee Suite.</p>

    <Card style={{ marginBottom:12, borderColor:T.bh }}>
      <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3, marginBottom:8 }}>Session Flow</div>
      {[
        ["Before","01 → Intake → generates brief · 02 → loads intake → generates prompts"],
        ["During","00 → Flowchart (live tracker) · 06 → Objections (on demand)"],
        ["After","04 → Log outcome + QC gate"],
        ["Employee","03 → Self-service setup checklist · 05 → Weekly check-in"],
        ["Stakeholder","07 → AI-generated health report from all data"],
      ].map(([phase, desc]) => <div key={phase} style={{ display:"flex", gap:10, marginBottom:5 }}>
        <span style={{ ...S.mn, fontSize:9, color:T.ac, width:72, flexShrink:0, textTransform:"uppercase", letterSpacing:"0.06em" }}>{phase}</span>
        <span style={{ fontSize:11, color:T.t2 }}>{desc}</span>
      </div>)}
    </Card>

    {TOOLS.map(t => {
      const isOpen = open[t.id];
      return <div key={t.id} style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, overflow:"hidden", marginBottom:4 }}>
        <div onClick={()=>tog(t.id)} style={{ padding:"9px 13px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <MN color={T.ac}>{t.num}</MN>
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:500, fontSize:12, color:T.tx }}>{t.title}</span>
            {!isOpen && <span style={{ fontSize:11, color:T.t3, marginLeft:8 }}>{t.when}</span>}
          </div>
          <Tag color={t.role==="facilitator"?T.m2:T.gn}>{t.role}</Tag>
          <span style={{ ...S.mn, fontSize:8, color:T.t3 }}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen && <div style={{ padding:"0 13px 12px", borderTop:`1px solid ${T.b}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 12px", marginTop:9, fontSize:11 }}>
            <MN color={T.t3}>Storage</MN><span style={{ color:T.m2, fontFamily:"monospace", fontSize:10 }}>{t.key}</span>
            <MN color={T.t3}>When</MN><span style={{ color:T.t2 }}>{t.when}</span>
            <MN color={T.t3}>Notes</MN><span style={{ color:T.t2 }}>{t.note}</span>
          </div>
        </div>}
      </div>;
    })}

    <Card style={{ marginTop:12 }}>
      <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3, marginBottom:8 }}>API Usage Summary</div>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr><TH>Artifact</TH><TH>Purpose</TH><TH>Max tokens</TH></tr></thead>
        <tbody>
          {[["02","Prompt generation","3,000"],["06","Objection AI chat","350"],["07","Health report","1,200"],["Hub","Ask Claude chat","varies"]].map(([a,p,t])=><tr key={a}><TD><MN color={T.ac}>{a}</MN></TD><TD style={{color:T.t2}}>{p}</TD><TD><MN color={T.m2}>{t}</MN></TD></tr>)}
        </tbody>
      </table>
      <div style={{ marginTop:8, padding:"7px 10px", background:T.sf, borderRadius:2, border:`1px solid #3e2020` }}>
        <MN color={T.rd}>⚠ Deprecation: </MN><span style={{ fontSize:11, color:T.t2 }}>claude-opus-4-20250514 and claude-sonnet-4-20250514 retire June 15, 2026. All suite artifacts use claude-sonnet-4-6.</span>
      </div>
    </Card>
  </div>;
}

function EcosystemTab() {
  const [open, setOpen] = useState({});
  return <div>
    <SH>Claude Ecosystem Reference</SH>
    <p style={{ fontSize:11, color:T.t2, marginBottom:14 }}>Current as of May 2026. Verify at claude.ai/pricing for plan changes.</p>

    <SH size={12} mb={7}>Active Models</SH>
    <div style={{ marginBottom:14 }}>
      {MODELS.map(m => <div key={m.str} style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, padding:"11px 13px", marginBottom:4 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <div style={{ fontWeight:500, fontSize:13, color:T.tx }}>{m.name}</div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ ...S.mn, fontSize:10, color:T.m2 }}>{m.pricing} per 1M</span>
            <Tag color={m.bc}>{m.badge}</Tag>
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <span style={{ fontFamily:"monospace", fontSize:10, color:T.t2 }}>{m.str}</span>
          <span style={{ ...S.mn, fontSize:10, color:T.t3 }}>ctx: {m.ctx}</span>
        </div>
      </div>)}
      <Card style={{ marginTop:8, background:T.sf, borderColor:"#3e2020" }}>
        <MN color={T.rd} size={9}>DEPRECATING JUNE 15 2026 · </MN>
        <MN size={10}>claude-opus-4-20250514 · claude-sonnet-4-20250514</MN>
      </Card>
    </div>

    <SH size={12} mb={7}>Opus 4.7 Breaking API Changes</SH>
    <p style={{ fontSize:11, color:T.t2, marginBottom:10 }}>Affects API callers only. Claude.ai and Managed Agents users are unaffected.</p>
    {BREAKING.map((b, i) => {
      const isOpen = open[`b${i}`];
      return <div key={i} style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, overflow:"hidden", marginBottom:4 }}>
        <div onClick={()=>setOpen(p=>({...p,[`b${i}`]:!p[`b${i}`]}))} style={{ padding:"9px 13px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
          <div style={{ fontWeight:500, fontSize:12, color:T.tx }}>{b.title}</div>
          <span style={{ ...S.mn, fontSize:8, color:T.t3 }}>{isOpen?"▲":"▼"}</span>
        </div>
        {isOpen && <div style={{ padding:"0 13px 12px", borderTop:`1px solid ${T.b}` }}>
          <div style={{ marginTop:9, display:"grid", gap:6 }}>
            <div>
              <MN color={T.t3} size={9}>BEFORE</MN>
              <div style={{ background:T.sf, border:`1px solid #3e2020`, borderRadius:2, padding:"6px 9px", fontFamily:"monospace", fontSize:11, color:T.rd, marginTop:3, whiteSpace:"pre-wrap" }}>{b.before}</div>
            </div>
            <div>
              <MN color={T.t3} size={9}>AFTER</MN>
              <div style={{ background:T.sf, border:`1px solid #2a3a2a`, borderRadius:2, padding:"6px 9px", fontFamily:"monospace", fontSize:11, color:T.gn, marginTop:3, whiteSpace:"pre-wrap" }}>{b.after}</div>
            </div>
            <div style={{ fontSize:11, color:T.t2, padding:"4px 0" }}>◆ {b.note}</div>
          </div>
        </div>}
      </div>;
    })}

    <SH size={12} mb={7} style={{ marginTop:14 }}>Plans & Pricing</SH>
    <Card style={{ padding:0, overflow:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr><TH>Plan</TH><TH>Price</TH><TH>Key Features</TH></tr></thead>
        <tbody>{PLANS.map(p=><tr key={p.plan}><TD style={{fontWeight:500,color:T.tx}}>{p.plan}</TD><TD><MN color={T.m2}>{p.price}</MN></TD><TD style={{color:T.t2,fontSize:11}}>{p.features}</TD></tr>)}</tbody>
      </table>
    </Card>

    <SH size={12} mb={7} style={{ marginTop:14 }}>Competitive Snapshot</SH>
    <Card style={{ padding:0, overflow:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr><TH></TH><TH style={{color:T.ac}}>Claude</TH><TH>GPT / OpenAI</TH><TH>Gemini / Google</TH></tr></thead>
        <tbody>{COMPETITIVE.map(r=><tr key={r.label}><TD><MN color={T.t3}>{r.label}</MN></TD><TD style={{color:T.ac,fontSize:11}}>{r.claude}</TD><TD style={{color:T.t2,fontSize:11}}>{r.gpt}</TD><TD style={{color:T.t2,fontSize:11}}>{r.gem}</TD></tr>)}</tbody>
      </table>
    </Card>
  </div>;
}

function SetupTab({ mode }) {
  const KEY = mode === "facilitator" ? "facilitator-ref-setup-v1" : "self-setup-v1";
  const [checks, setChecks] = useState({});
  const [plan, setPlan] = useState("pro");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ld(KEY).then(s => { if (s) { setChecks(s.checkState||{}); setPlan(s.plan||"pro"); } setReady(true); });
  }, [KEY]);
  const planIdx = { free:0, pro:1, max:2, team:3, enterprise:4 };
  const myPlanIdx = planIdx[plan] ?? 0;
  const unlocked = s => (planIdx[s.plan] ?? 0) <= myPlanIdx;
  const toggle = async id => {
    const next = {...checks, [id]:!checks[id]};
    setChecks(next);
    await sv(KEY, { checkState:next, plan });
  };
  const changePlan = async p => { setPlan(p); await sv(KEY, { checkState:checks, plan:p }); };
  const done = Object.values(checks).filter(Boolean).length;
  const pct = Math.round(done / STEPS.length * 100);
  const cats = [...new Set(STEPS.map(s => s.cat))];
  if (!ready) return <div style={{ ...S.mn, fontSize:10, color:T.t2, padding:12 }}>Loading…</div>;
  return <div>
    <SH>15-Step Setup Checklist</SH>
    <p style={{ fontSize:11, color:T.t2, marginBottom:12 }}>
      {mode==="facilitator" ? "Walk employees through this during or after their first session." : "Complete these steps to fully configure Claude for your work."}
    </p>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
      <MN>{done}/{STEPS.length} complete</MN>
      <MN color={pct===100?T.gn:T.ac}>{pct}%</MN>
    </div>
    <div style={{ background:T.tg, borderRadius:2, height:3, marginBottom:12 }}>
      <div style={{ height:3, background:pct===100?T.gn:T.ac, borderRadius:2, width:`${pct}%`, transition:"width 0.3s" }} />
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <MN size={9} color={T.t3}>PLAN</MN>
      <div style={{ display:"flex", gap:3 }}>
        {[["free","Free"],["pro","Pro"],["max","Max"],["team","Team"],["enterprise","Ent"]].map(([v,l])=><button key={v} onClick={()=>changePlan(v)} style={{ background:"transparent", border:`1px solid ${plan===v?T.ac:T.b}`, borderRadius:2, color:plan===v?T.ac:T.t2, ...S.mn, fontSize:9, padding:"2px 8px", cursor:"pointer", transition:"all .15s" }}>{l}</button>)}
      </div>
      <Btn onClick={async()=>{ setChecks({}); await sv(KEY,{checkState:{},plan}); }} style={{ padding:"2px 8px" }}>Reset</Btn>
    </div>
    {cats.map(cat => {
      const catSteps = STEPS.filter(s=>s.cat===cat);
      const catDone = catSteps.filter(s=>checks[s.id]).length;
      return <div key={cat} style={{ marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
          <MN size={9} color={T.t2}>{cat.toUpperCase()}</MN>
          <MN size={9} color={catDone===catSteps.length?T.gn:T.t3}>{catDone}/{catSteps.length}</MN>
        </div>
        <div style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, overflow:"hidden" }}>
          {catSteps.map((s, si) => {
            const lock = !unlocked(s);
            const done = !!checks[s.id];
            return <div key={s.id} onClick={()=>!lock&&toggle(s.id)} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 13px", borderBottom:si<catSteps.length-1?`1px solid ${T.tg}`:"none", cursor:lock?"default":"pointer", background:done?T.sf:"transparent", opacity:lock?0.45:1, transition:"background .15s" }}>
              <div style={{ width:13, height:13, flexShrink:0, marginTop:1, border:`1px solid ${done?T.gn:T.bh}`, borderRadius:2, background:done?"#1a2a1a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:T.gn }}>{done?"◆":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:12, color:done?T.t2:T.tx, textDecoration:done?"line-through":"none" }}>{s.label}</div>
                <div style={{ fontSize:11, color:T.t3, marginTop:2 }}>{s.desc}</div>
                {s.plan!=="free"&&!lock&&<MN size={9} color={T.m2}>{s.plan.charAt(0).toUpperCase()+s.plan.slice(1)} plan</MN>}
                {lock&&<MN size={9} color={T.t3}>Upgrade to {s.plan} to unlock</MN>}
              </div>
              <MN color={T.t3}>{s.id.toString().padStart(2,"0")}</MN>
            </div>;
          })}
        </div>
      </div>;
    })}
    {pct===100&&<Card style={{borderColor:"#2a3a2a",textAlign:"center"}}><MN color={T.gn}>◆ Setup complete</MN></Card>}
  </div>;
}

function AskTab() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const threadRef = useRef(null);
  const send = async () => {
    const text = input.trim(); if (!text || loading) return;
    setInput(""); setLoading(true);
    const um = { role:"user", content:text };
    setMsgs(p => [...p, um]);
    try {
      const allMsgs = [...msgs, um];
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:600, system:SYS, messages:allMsgs })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
      const reply = d.content.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      setMsgs(p => [...p, { role:"assistant", content:reply }]);
    } catch(e) {
      setMsgs(p => [...p, { role:"assistant", content:`Error: ${e.message}`, error:true }]);
    }
    setLoading(false);
    setTimeout(() => { if (threadRef.current) threadRef.current.scrollTop=threadRef.current.scrollHeight; }, 50);
  };
  const clear = () => setMsgs([]);
  const STARTERS = ["What's the difference between Sonnet 4.6 and Opus 4.7?","Which plan do I need for Projects and Connectors?","How do I migrate from claude-sonnet-4-20250514?","What are the Opus 4.7 breaking changes?","How does MCP compare to OpenAI plugins?"];
  return <div>
    <SH>Ask Claude</SH>
    <p style={{ fontSize:11, color:T.t2, marginBottom:12 }}>Live Sonnet 4.6. Full ecosystem context loaded. Ask about models, plans, API changes, or anything in the suite.</p>
    {!msgs.length && <div style={{ marginBottom:12 }}>
      <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3, marginBottom:7 }}>Starter questions</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {STARTERS.map(s=><button key={s} onClick={()=>{setInput(s);}} style={{ background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.t2, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:11, padding:"5px 10px", cursor:"pointer", textAlign:"left", transition:"border-color .15s" }}>{s}</button>)}
      </div>
    </div>}
    <div ref={threadRef} style={{ minHeight:240, maxHeight:360, overflowY:"auto", display:"flex", flexDirection:"column", gap:6, padding:"2px 0", marginBottom:10 }}>
      {msgs.map((m,i)=><div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
        <div style={{ padding:"8px 10px", borderRadius:2, fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap", maxWidth:"88%", background:m.role==="user"?"rgba(212,137,58,.1)":T.sf, border:`1px solid ${m.role==="user"?"rgba(212,137,58,.2)":m.error?`rgba(192,80,80,.3)`:T.b}`, color:m.error?T.rd:T.tx }}>{m.content}</div>
      </div>)}
      {loading&&<div style={{ display:"flex" }}><div style={{ padding:"8px 10px", borderRadius:2, fontSize:12, background:T.sf, border:`1px solid ${T.b}`, color:T.t3 }}>◌ thinking…</div></div>}
    </div>
    <div style={{ display:"flex", gap:6 }}>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about Claude models, plans, API, connectors…" style={{ flex:1, padding:"7px 10px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx }} />
      <Btn onClick={send} disabled={!input.trim()||loading} accent={!!input.trim()}>→</Btn>
      {msgs.length>0&&<Btn onClick={clear}>Clear</Btn>}
    </div>
  </div>;
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────

export default function ReferenceHub() {
  const [mode, setMode] = useState("facilitator");
  const [tab, setTab] = useState("ecosystem");
  const FACILITATOR_TABS = [["navigator","Suite Navigator"],["ecosystem","Ecosystem"],["setup","Setup"],["ask","Ask Claude"]];
  const CLIENT_TABS = [["ecosystem","Ecosystem"],["setup","Setup"],["ask","Ask Claude"]];
  const TABS = mode==="facilitator" ? FACILITATOR_TABS : CLIENT_TABS;
  // Reset to valid tab when switching modes
  const switchMode = m => { setMode(m); if (m==="client"&&tab==="navigator") setTab("ecosystem"); };
  return <>
    <style>{GF}{`
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#0c0c0b}
      ::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}
      ::selection{background:rgba(212,137,58,.2);color:#ddd8ce}
    `}</style>
    <div style={S.app}>
      <header style={{ padding:"14px 22px 11px", borderBottom:`1px solid ${T.b}`, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ ...S.hd, fontSize:18 }}>Reference Hub</div>
          <div style={{ ...S.mn, fontSize:10, color:T.t2, marginTop:2 }}>◆ Claude Enablement Suite · Variant B · May 2026</div>
        </div>
        <div style={{ display:"flex", gap:0, border:`1px solid ${T.bh}`, borderRadius:2, overflow:"hidden" }}>
          {[["facilitator","Facilitator"],["client","Client"]].map(([m,l])=><button key={m} onClick={()=>switchMode(m)} style={{ background:mode===m?T.ac+"20":"transparent", border:"none", borderRight:m==="facilitator"?`1px solid ${T.bh}`:"none", padding:"5px 14px", ...S.mn, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", color:mode===m?T.ac:T.t2, transition:"all .15s" }}>{l}</button>)}
        </div>
      </header>
      <div style={{ display:"flex", borderBottom:`1px solid ${T.b}`, padding:"0 22px", overflowX:"auto" }}>
        {TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===id?T.ac:"transparent"}`, cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:500, padding:"8px 12px", color:tab===id?T.tx:T.t2, marginBottom:-1, whiteSpace:"nowrap", transition:"color .15s,border-color .15s" }}>{l}</button>)}
      </div>
      <div style={{ padding:"16px 22px", maxWidth:860 }}>
        {tab==="navigator" && <NavigatorTab />}
        {tab==="ecosystem" && <EcosystemTab />}
        {tab==="setup"     && <SetupTab mode={mode} />}
        {tab==="ask"       && <AskTab />}
      </div>
    </div>
  </>;
}
