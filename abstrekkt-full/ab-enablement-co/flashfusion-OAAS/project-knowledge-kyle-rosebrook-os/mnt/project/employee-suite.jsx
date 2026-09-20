import { useState, useEffect } from "react";

const GF = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');";
const T = { bg:"#0c0c0b",sf:"#111110",cd:"#181815",b:"#232320",bh:"#303030",ac:"#d4893a",tx:"#ddd8ce",t2:"#807c74",t3:"#3a3835",gn:"#5a9c5a",m2:"#78afc8",rd:"#c05050",tg:"#1e1e1a" };
const S = {
  app:{ minHeight:"100vh", background:T.bg, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, lineHeight:1.65, color:T.tx },
  hd:{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:T.tx },
  mn:{ fontFamily:"'IBM Plex Mono',monospace" },
};

const STEPS = [
  { id:1, label:"Create your Claude account", desc:"Go to claude.ai and sign up or log in.", plan:"free", cat:"Foundation" },
  { id:2, label:"Understand your plan", desc:"Free → Pro → Team → Enterprise. Pro unlocks Projects, memory, and connectors.", plan:"free", cat:"Foundation" },
  { id:3, label:"Upgrade to Pro (recommended)", desc:"$20/mo. Required for Projects, persistent memory, and connectors.", plan:"pro", cat:"Foundation" },
  { id:4, label:"Explore the interface", desc:"Send a few test messages. Try asking Claude to help draft something from your work.", plan:"free", cat:"Foundation" },
  { id:5, label:"Create your first Project", desc:"Settings → Projects → New Project. Projects give Claude persistent context for a specific area of your work.", plan:"pro", cat:"Projects & Memory" },
  { id:6, label:"Write Project custom instructions", desc:"In the Project, add your role, preferences, and working style. Use your prompt package from your facilitator.", plan:"pro", cat:"Projects & Memory" },
  { id:7, label:"Configure memory", desc:"Settings → Memory. Claude will start capturing things from your conversations. Review and curate them.", plan:"pro", cat:"Projects & Memory" },
  { id:8, label:"Add 3–5 memory edits", desc:"Edit format: 'User is [role] at [company]. Prefers [style]. Always [preference].'", plan:"pro", cat:"Projects & Memory" },
  { id:9, label:"Install a connector", desc:"Settings → Connectors. Find a tool you use daily (Google Workspace, Slack, Notion) and connect it.", plan:"pro", cat:"Connectors" },
  { id:10, label:"Test your connector with a live query", desc:"Ask Claude something using real data from the connected tool. Verify it returns accurate results.", plan:"pro", cat:"Connectors" },
  { id:11, label:"Practice your #1 use case", desc:"Use Claude for the highest-impact task your facilitator identified. Do it for real, not as a test.", plan:"free", cat:"Real Work" },
  { id:12, label:"Build your first Artifact", desc:"Ask Claude to create a document, table, or code snippet. Artifacts are persistent, editable outputs.", plan:"free", cat:"Real Work" },
  { id:13, label:"Try web search (if available)", desc:"On Pro/Max: enable web search. Ask Claude to research something current and verify the citations.", plan:"pro", cat:"Real Work" },
  { id:14, label:"Submit your first weekly check-in", desc:"Use the Check-in tab to log how Claude is going. Your facilitator reviews these before the next session.", plan:"free", cat:"Accountability" },
  { id:15, label:"Set a recurring Claude habit", desc:"Block 10 minutes in your calendar weekly to try one new Claude use case. Track it in your check-ins.", plan:"free", cat:"Accountability" },
];

const FREQ = [
  {v:"daily", l:"Daily", d:"Every day"},
  {v:"few_week", l:"A few times/week", d:"3–4 times"},
  {v:"once_week", l:"Once/week", d:"Weekly"},
  {v:"once_few", l:"Once every few weeks", d:"Occasionally"},
  {v:"not_yet", l:"Not yet", d:"Haven't started"},
];

const PLAN_GATE = { free:"Free or above", pro:"Pro or above", max:"Max or above", team:"Team or above" };

const ld = async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sv = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };

function Btn({ children, onClick, disabled, accent, style={} }) {
  return <button onClick={onClick} disabled={disabled} style={{ background:"transparent", border:`1px solid ${accent&&!disabled?T.ac:T.bh}`, borderRadius:2, color:disabled?T.t3:accent?T.ac:T.t2, ...S.mn, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 12px", cursor:disabled?"not-allowed":"pointer", transition:"all .15s", ...style }}>{children}</button>;
}
function Card({ children, style={} }) {
  return <div style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, padding:"12px 14px", marginBottom:7, ...style }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3, marginBottom:3 }}>{children}</div>;
}
function Inp({ value, onChange, placeholder, type="text" }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type} style={{ width:"100%", padding:"6px 9px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx, marginBottom:6 }} />;
}

function SetupTab({ checks, plan, onToggle, onPlanChange }) {
  const done = Object.values(checks).filter(Boolean).length;
  const pct = Math.round(done / STEPS.length * 100);
  const cats = [...new Set(STEPS.map(s => s.cat))];
  const planIdx = { free:0, pro:1, max:2, team:3, enterprise:4 };
  const myPlanIdx = planIdx[plan] ?? 0;
  const unlocked = s => (planIdx[s.plan] ?? 0) <= myPlanIdx;
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Claude Setup Checklist</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:12 }}>15 steps to fully configure Claude for your role. Check off as you complete each one.</p>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
      <span style={{ ...S.mn, fontSize:10, color:T.t2 }}>{done}/{STEPS.length} complete</span>
      <span style={{ ...S.mn, fontSize:10, color:pct===100?T.gn:T.ac }}>{pct}%</span>
    </div>
    <div style={{ background:T.tg, borderRadius:2, height:3, marginBottom:14 }}>
      <div style={{ height:3, background:pct===100?T.gn:T.ac, borderRadius:2, width:`${pct}%`, transition:"width 0.3s" }} />
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <span style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3 }}>Your Plan</span>
      <div style={{ display:"flex", gap:3 }}>
        {[["free","Free"],["pro","Pro"],["max","Max"],["team","Team"],["enterprise","Enterprise"]].map(([v,l]) => <button key={v} onClick={()=>onPlanChange(v)} style={{ background:"transparent", border:`1px solid ${plan===v?T.ac:T.b}`, borderRadius:2, color:plan===v?T.ac:T.t2, ...S.mn, fontSize:9, padding:"2px 8px", cursor:"pointer", transition:"all .15s" }}>{l}</button>)}
      </div>
    </div>
    {cats.map(cat => {
      const catSteps = STEPS.filter(s => s.cat === cat);
      const catDone = catSteps.filter(s => checks[s.id]).length;
      return <div key={cat} style={{ marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
          <span style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t2 }}>{cat}</span>
          <span style={{ ...S.mn, fontSize:9, color:catDone===catSteps.length?T.gn:T.t3 }}>{catDone}/{catSteps.length}</span>
        </div>
        <div style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, overflow:"hidden" }}>
          {catSteps.map((s, si) => {
            const lock = !unlocked(s);
            const done = !!checks[s.id];
            return <div key={s.id} onClick={()=>!lock&&onToggle(s.id)} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 13px", borderBottom:si<catSteps.length-1?`1px solid ${T.tg}`:"none", cursor:lock?"not-allowed":"pointer", background:done?T.sf:"transparent", opacity:lock?0.5:1, transition:"background .15s" }}>
              <div style={{ width:14, height:14, flexShrink:0, marginTop:1, border:`1px solid ${done?T.gn:T.bh}`, borderRadius:2, background:done?"#1a2a1a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:T.gn }}>{done?"◆":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:12, color:done?T.t2:T.tx, textDecoration:done?"line-through":"none" }}>{s.label}</div>
                <div style={{ fontSize:11, color:T.t3, marginTop:2 }}>{s.desc}</div>
                {s.plan !== "free" && <span style={{ ...S.mn, fontSize:9, color:T.m2, marginTop:3, display:"inline-block" }}>{PLAN_GATE[s.plan]}</span>}
              </div>
              <span style={{ ...S.mn, fontSize:9, color:T.t3, flexShrink:0 }}>{s.id.toString().padStart(2,"0")}</span>
            </div>;
          })}
        </div>
      </div>;
    })}
    {pct===100 && <Card style={{ borderColor:"#2a3a2a", textAlign:"center" }}>
      <div style={{ ...S.mn, fontSize:10, color:T.gn, marginBottom:3 }}>◆ Setup complete</div>
      <div style={{ fontSize:12, color:T.t2 }}>Submit a weekly check-in to keep your facilitator in the loop.</div>
    </Card>}
  </div>;
}

function CheckinTab({ checkins, onAdd }) {
  const blank = { name:"", frequency:"", confidence:0, win:"", stuck:"", goal:"" };
  const [form, setForm] = useState(blank);
  const [submitted, setSubmitted] = useState(false);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));
  const ok = form.name.trim() && form.frequency && form.confidence > 0;
  const submit = async () => {
    const rec = {...form, id:Date.now(), weekOf:new Date().toISOString().slice(0,10), createdAt:new Date().toISOString()};
    const next = [rec, ...checkins];
    await sv("checkin-records-v1", next);
    onAdd(next);
    setSubmitted(true);
    setForm(blank);
  };
  const reset = () => setSubmitted(false);
  if (submitted) return <div>
    <Card style={{ borderColor:"#2a3a2a", textAlign:"center", marginBottom:12 }}>
      <div style={{ ...S.mn, fontSize:10, color:T.gn, marginBottom:3 }}>◆ Check-in submitted</div>
      <div style={{ fontSize:12, color:T.t2, marginBottom:10 }}>Your facilitator will review this before the next session.</div>
      <Btn onClick={reset} accent>Submit Another</Btn>
    </Card>
    {checkins.length > 0 && <>
      <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Your Check-in History</div>
      {checkins.slice(0,5).map(c => <Card key={c.id}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div style={{ fontWeight:500, fontSize:12 }}>{c.name}</div>
          <div style={{ display:"flex", gap:6 }}>
            <span style={{ ...S.mn, fontSize:9, color:T.t2 }}>{c.weekOf}</span>
            <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(n=><div key={n} style={{ width:7, height:7, borderRadius:"50%", background:n<=c.confidence?T.ac:T.b }} />)}</div>
          </div>
        </div>
        {c.frequency && <div style={{ ...S.mn, fontSize:9, color:T.m2, marginBottom:5 }}>{FREQ.find(f=>f.v===c.frequency)?.l||c.frequency}</div>}
        {c.win && <div style={{ fontSize:11, color:T.t2, marginBottom:3 }}><span style={{ color:T.gn }}>◆</span> {c.win}</div>}
        {c.stuck && <div style={{ fontSize:11, color:T.t2, marginBottom:3 }}><span style={{ color:T.rd }}>◇</span> {c.stuck}</div>}
        {c.goal && <div style={{ fontSize:11, color:T.t2 }}><span style={{ color:T.m2 }}>→</span> {c.goal}</div>}
      </Card>)}
    </>}
  </div>;
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Weekly Check-in</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:12 }}>Takes 2 minutes. Your facilitator reviews this before the next session.</p>
    <Card style={{ marginBottom:7 }}>
      <Label>Your Name *</Label>
      <Inp value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jane Smith" />
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>How often are you using Claude? *</Label>
      {FREQ.map(f => <label key={f.v} onClick={()=>set("frequency",f.v)} style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", padding:"5px 7px", borderRadius:2, border:`1px solid ${form.frequency===f.v?T.ac:T.b}`, background:form.frequency===f.v?T.tg:"transparent", marginBottom:3, transition:"all .15s" }}>
        <div style={{ width:10, height:10, borderRadius:"50%", border:`2px solid ${form.frequency===f.v?T.ac:T.t3}`, background:form.frequency===f.v?T.ac:"transparent", flexShrink:0 }} />
        <span style={{ ...S.mn, fontSize:11, color:form.frequency===f.v?T.ac:T.m2 }}>{f.l}</span>
        <span style={{ fontSize:11, color:T.t3 }}>{f.d}</span>
      </label>)}
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>Confidence with Claude (1–5) *</Label>
      <div style={{ display:"flex", gap:6, marginTop:5 }}>
        {[1,2,3,4,5].map(n => <button key={n} onClick={()=>set("confidence",n)} style={{ width:36, height:36, borderRadius:2, border:`1px solid ${form.confidence===n?T.ac:T.b}`, background:form.confidence===n?T.tg:"transparent", color:form.confidence===n?T.ac:T.t2, ...S.mn, fontSize:12, cursor:"pointer", transition:"all .15s" }}>{n}</button>)}
      </div>
      <div style={{ ...S.mn, fontSize:9, color:T.t3, marginTop:5 }}>{["","Struggling","Getting started","Making progress","Comfortable","Confident"][form.confidence]||""}</div>
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>Biggest win this week</Label>
      <textarea value={form.win} onChange={e=>set("win",e.target.value)} placeholder="What did Claude help you accomplish?" style={{ width:"100%", background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.tx, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, padding:"7px 9px", resize:"vertical", minHeight:52, outline:"none" }} />
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>What are you stuck on?</Label>
      <textarea value={form.stuck} onChange={e=>set("stuck",e.target.value)} placeholder="Any blockers, confusion, or things that aren't working?" style={{ width:"100%", background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.tx, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, padding:"7px 9px", resize:"vertical", minHeight:52, outline:"none" }} />
    </Card>
    <Card style={{ marginBottom:10 }}>
      <Label>Goal for next week</Label>
      <textarea value={form.goal} onChange={e=>set("goal",e.target.value)} placeholder="What's one specific thing you'll try next week?" style={{ width:"100%", background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.tx, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, padding:"7px 9px", resize:"vertical", minHeight:52, outline:"none" }} />
    </Card>
    <div style={{ textAlign:"right" }}>
      <Btn onClick={submit} disabled={!ok} accent={!!ok}>Submit Check-in →</Btn>
    </div>
  </div>;
}

export default function EmployeeSuite() {
  const [tab, setTab] = useState("setup");
  const [checks, setChecks] = useState({});
  const [plan, setPlan] = useState("pro");
  const [checkins, setCheckins] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([ld("self-setup-v1"), ld("checkin-records-v1")]).then(([s, c]) => {
      if (s) { setChecks(s.checkState||{}); setPlan(s.plan||"pro"); }
      setCheckins(c||[]);
      setReady(true);
    });
  }, []);
  const toggle = async id => {
    const next = {...checks, [id]: !checks[id]};
    setChecks(next);
    await sv("self-setup-v1", { checkState:next, plan });
  };
  const changePlan = async p => {
    setPlan(p);
    await sv("self-setup-v1", { checkState:checks, plan:p });
  };
  const done = Object.values(checks).filter(Boolean).length;
  const pct = Math.round(done/STEPS.length*100);
  const TABS = [["setup","Setup"],["checkin","Check-in"]];
  return <>
    <style>{GF}{`
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px}
      ::-webkit-scrollbar-track{background:#0c0c0b}
      ::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}
    `}</style>
    <div style={S.app}>
      <header style={{ padding:"14px 22px 11px", borderBottom:`1px solid ${T.b}`, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ ...S.hd, fontSize:18 }}>Employee Suite</div>
          <div style={{ ...S.mn, fontSize:10, color:T.t2, marginTop:2 }}>◆ Setup Checklist · Weekly Check-in · Claude Enablement</div>
        </div>
        {ready && <div style={{ textAlign:"right" }}>
          <div style={{ ...S.mn, fontSize:15, color:pct===100?T.gn:T.ac }}>{pct}%</div>
          <div style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t3 }}>setup complete</div>
        </div>}
      </header>
      <div style={{ display:"flex", borderBottom:`1px solid ${T.b}`, padding:"0 22px" }}>
        {TABS.map(([id,l]) => <button key={id} onClick={()=>setTab(id)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===id?T.ac:"transparent"}`, cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:500, padding:"8px 12px", color:tab===id?T.tx:T.t2, marginBottom:-1, transition:"color .15s,border-color .15s" }}>{l}</button>)}
      </div>
      <div style={{ padding:"16px 22px", maxWidth:820 }}>
        {!ready ? <div style={{ ...S.mn, fontSize:10, padding:12, color:T.t2 }}>Loading…</div> : <>
          {tab==="setup" && <SetupTab checks={checks} plan={plan} onToggle={toggle} onPlanChange={changePlan} />}
          {tab==="checkin" && <CheckinTab checkins={checkins} onAdd={setCheckins} />}
        </>}
      </div>
    </div>
  </>;
}
