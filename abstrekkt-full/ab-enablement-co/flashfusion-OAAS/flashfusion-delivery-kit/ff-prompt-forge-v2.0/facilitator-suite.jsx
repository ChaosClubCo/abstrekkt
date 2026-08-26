import { useState, useEffect, useRef, useCallback } from "react";

const GF = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');";
const T = { bg:"#0c0c0b",sf:"#111110",cd:"#181815",b:"#232320",bh:"#303030",ac:"#d4893a",ah:"#e8a050",tx:"#ddd8ce",t2:"#807c74",t3:"#3a3835",gn:"#5a9c5a",m2:"#78afc8",rd:"#c05050",tg:"#1e1e1a" };
const S = {
  app:{ minHeight:"100vh", background:T.bg, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, lineHeight:1.65, color:T.tx },
  hd:{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:T.tx },
  mn:{ fontFamily:"'IBM Plex Mono',monospace" },
};

const LIT=[{v:"none",l:"None",d:"Never used AI"},{v:"casual",l:"Casual",d:"Tried ChatGPT"},{v:"regular",l:"Regular",d:"Weekly user"},{v:"power",l:"Power",d:"Projects + prompts"},{v:"advanced",l:"Advanced",d:"API / agents"}];
const PAINS=["Email & comms","Meeting notes","Report writing","Research","Data analysis","Process docs","Code writing","Customer comms"];
const UCS=["Email drafting","Report writing","Meeting notes","Presentations","Summarizing docs","Competitor intel","SOPs","Project planning","Code writing","Code review"];
const QCI=[{id:"q1",l:"Logs in independently",c:true},{id:"q2",l:"1+ Project with instructions",c:true},{id:"q3",l:"Memory configured",c:true},{id:"q4",l:"Prompt package delivered",c:true},{id:"q5",l:"Connector connected",c:false},{id:"q6",l:"#1 use case identified",c:false},{id:"q7",l:"Next session agreed",c:false}];
const SC={"Completed":T.gn,"In Progress":T.m2,"Scheduled":T.m2,"Needs Follow-up":T.ac,"No Show":T.rd};
const QA=[
  {id:1,cat:"Time",q:"I don't have time to learn this",a:"10 minutes covers 80% of daily use. One high-impact use case this week — not mastering everything."},
  {id:2,cat:"Jobs",q:"Will AI replace my job?",a:"Claude handles low-judgment volume work. Skilled decisions stay with you."},
  {id:3,cat:"Security",q:"IT won't approve this.",a:"SOC 2 Type II, no-training agreements on Team/Enterprise. Direct IT to trust.anthropic.com."},
  {id:4,cat:"Trust",q:"It gave me wrong information.",a:"Hallucination happens with all models. Fix: verification + web search + citations. Treat output as first draft."},
  {id:5,cat:"Skill",q:"I'm not technical enough.",a:"Highest-value users aren't technical. Writing, summarizing, formatting — no tech skills needed."},
  {id:6,cat:"Delay",q:"I'll wait for proper training.",a:"This is the training. Setup takes 20 minutes. Waiting just delays your ramp."},
  {id:7,cat:"Value",q:"I'm already productive.",a:"Most find 2–3 hrs/week in the first session — time currently on low-judgment tasks."},
  {id:8,cat:"Privacy",q:"What happens to my data?",a:"On Team/Enterprise: conversations aren't used to train models. Full details at trust.anthropic.com."},
];

const ld = async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sv = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
const api = async (msgs, max=1200, sys=null) => {
  const body = { model:"claude-sonnet-4-6", max_tokens:max, messages:msgs };
  if (sys) body.system = sys;
  const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
  return d.content.filter(b => b.type === "text").map(b => b.text).join("");
};

function Btn({ children, onClick, disabled, accent, style={} }) {
  return <button onClick={onClick} disabled={disabled} style={{ background:"transparent", border:`1px solid ${accent&&!disabled?T.ac:T.bh}`, borderRadius:2, color:disabled?T.t3:accent?T.ac:T.t2, ...S.mn, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 12px", cursor:disabled?"not-allowed":"pointer", transition:"all .15s", ...style }}>{children}</button>;
}
function Card({ children, style={} }) {
  return <div style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, padding:"12px 14px", marginBottom:7, ...style }}>{children}</div>;
}
function Eyebrow({ children, color }) {
  return <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:color||T.ac, marginBottom:5 }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ ...S.mn, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:T.t3, marginBottom:3 }}>{children}</div>;
}
function Inp({ value, onChange, placeholder, type="text", style={} }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type} style={{ width:"100%", padding:"6px 9px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx, marginBottom:6, ...style }} />;
}
function Sel({ value, onChange, options, style={} }) {
  return <select value={value} onChange={onChange} style={{ width:"100%", padding:"6px 9px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx, marginBottom:6, cursor:"pointer", ...style }}>
    {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
  </select>;
}
function Tag({ children, color }) {
  return <span style={{ background:T.tg, border:`1px solid ${T.bh}`, borderRadius:2, ...S.mn, fontSize:9, padding:"1px 5px", color:color||T.t2 }}>{children}</span>;
}
function Stat({ label, value, color }) {
  return <div style={{ background:T.sf, borderRadius:2, padding:"9px 10px", textAlign:"center" }}>
    <div style={{ fontSize:20, fontWeight:500, color:color||T.tx }}>{value}</div>
    <div style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t3, marginTop:3 }}>{label}</div>
  </div>;
}

function computeNext(intakes, outcomes, packages) {
  if (!intakes.length) return { cls:"ac", f:"01", t:"Begin with intake", d:"No employee profiles yet.", tab:"intake" };
  const um = intakes.filter(i => !outcomes.find(o => (o.name||o.employeeName) === i.name));
  if (um.length) return { cls:"ac", f:"04", t:`${um.length} intake(s) without outcome`, d:um.map(i=>i.name).join(", "), tab:"outcomes" };
  const np = intakes.filter(i => !Object.values(packages).find(p => p.employeeName === i.name));
  if (np.length) return { cls:"ac", f:"02", t:`${np.length} need prompt package`, d:np.map(i=>i.name).join(", "), tab:"prompts" };
  const fu = outcomes.filter(o => o.status === "Needs Follow-up");
  if (fu.length) return { cls:"rd", f:"04", t:`${fu.length} follow-up(s) needed`, d:fu.map(o=>o.name||o.employeeName).join(", "), tab:"outcomes" };
  return { cls:"gn", f:"✓", t:"Program up to date", d:`${intakes.length} employees · ${outcomes.filter(o=>o.status==="Completed").length} complete` };
}

function DashTab({ intakes, outcomes, packages, onNav }) {
  const comp = outcomes.filter(o => o.status === "Completed").length;
  const pro = outcomes.filter(o => ["pro","max","team","enterprise"].includes(o.plan)).length;
  const n = computeNext(intakes, outcomes, packages);
  const nc = {ac:T.ac, rd:T.rd, gn:T.gn}[n.cls]||T.ac;
  const nb = {ac:"rgba(212,137,58,.06)", rd:"rgba(192,80,80,.06)", gn:"rgba(90,156,90,.05)"}[n.cls]||"rgba(212,137,58,.06)";
  return <div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:12 }}>
      <Stat label="Employees" value={intakes.length} />
      <Stat label="Sessions" value={outcomes.length} />
      <Stat label="Complete" value={outcomes.length ? Math.round(comp/outcomes.length*100)+"%" : "—"} color={comp?T.gn:T.t3} />
      <Stat label="Pro+" value={outcomes.length ? Math.round(pro/outcomes.length*100)+"%" : "—"} color={T.m2} />
    </div>
    <div onClick={() => n.tab && onNav(n.tab)} style={{ borderLeft:`3px solid ${nc}`, padding:"8px 12px", background:nb, borderRadius:"0 2px 2px 0", marginBottom:12, cursor:n.tab?"pointer":"default" }}>
      <div style={{ ...S.mn, fontSize:9, color:nc, marginBottom:2 }}>◆ WHAT'S NEXT · {n.f}</div>
      <div style={{ fontSize:13, fontWeight:500, color:T.tx }}>{n.t}</div>
      {n.d && <div style={{ fontSize:11, color:T.t2, marginTop:1 }}>{n.d}</div>}
    </div>
    {intakes.length ? <><div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Recent intakes</div>
      <Card style={{ padding:0, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Employee","Role","Plan","Literacy"].map(h=><th key={h} style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t2, textAlign:"left", padding:"5px 9px", borderBottom:`1px solid ${T.b}` }}>{h}</th>)}</tr></thead>
          <tbody>{intakes.slice(0,5).map(r=><tr key={r.id}><td style={{ fontWeight:500, color:T.tx, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.name}</td><td style={{ color:T.t2, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.role}</td><td style={{ ...S.mn, color:T.m2, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{(r.plan||"?").toUpperCase()}</td><td style={{ color:T.t2, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.literacy||"?"}</td></tr>)}</tbody>
        </table>
      </Card></> : <Card style={{ color:T.t2 }}>No intakes yet. Use the Intake tab to get started.</Card>}
  </div>;
}

function IntakeTab({ intakes, onAdd }) {
  const blank = { name:"", role:"", plan:"pro", literacy:"", pains:[], notes:"", date:new Date().toISOString().slice(0,10) };
  const [form, setForm] = useState(blank);
  const [brief, setBrief] = useState(null);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));
  const tog = (k,v) => setForm(p => { const a=p[k]; return {...p,[k]:a.includes(v)?a.filter(x=>x!==v):[...a,v]}; });
  const ok = form.name.trim() && form.role.trim() && form.literacy;
  const submit = async () => {
    const rec = {...form, id:Date.now(), createdAt:new Date().toISOString()};
    const next = [rec, ...intakes];
    await sv("intake-records-v1", next);
    onAdd(next);
    setBrief(rec);
  };
  const copy = () => { if (!brief) return; const li=LIT.find(l=>l.v===brief.literacy); navigator.clipboard.writeText(`SESSION BRIEF — ${brief.name}\n${brief.role} | ${brief.plan.toUpperCase()} | ${li?.l||brief.literacy}\nDate: ${brief.date}\nTime Drains: ${brief.pains.join(", ")||"Not specified"}\nNotes: ${brief.notes||"None"}`).catch(()=>{}); };
  if (brief) {
    const li = LIT.find(l => l.v === brief.literacy);
    return <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
        <div style={{ ...S.hd, fontSize:14 }}>Session Brief — {brief.name}</div>
        <div style={{ display:"flex", gap:5 }}><Btn onClick={copy}>Copy</Btn><Btn onClick={() => { setBrief(null); setForm(blank); }}>← New</Btn></div>
      </div>
      <Card style={{ background:T.sf }}>
        <pre style={{ ...S.mn, fontSize:11, lineHeight:1.6, whiteSpace:"pre-wrap", color:T.tx }}>{`SESSION BRIEF — ${brief.name}\n${brief.role} | ${brief.plan.toUpperCase()} | ${li?.l||brief.literacy}\nDate: ${brief.date}\nTime Drains: ${brief.pains.join(", ")||"Not specified"}\nNotes: ${brief.notes||"None"}`}</pre>
      </Card>
      <Card style={{ marginTop:5, borderColor:"#2a3a2a" }}><span style={{ ...S.mn, fontSize:10, color:T.gn }}>◆ Saved · intake-records-v1</span></Card>
    </div>;
  }
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Employee Profile</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:11 }}>Capture before the session. Generates a session brief on submit.</p>
    <Card style={{ marginBottom:7 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px" }}>
        <div><Label>Name *</Label><Inp value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jane Smith" /></div>
        <div><Label>Role *</Label><Inp value={form.role} onChange={e=>set("role",e.target.value)} placeholder="IT Manager" /></div>
        <div><Label>Plan</Label><Sel value={form.plan} onChange={e=>set("plan",e.target.value)} options={[["free","Free"],["pro","Pro"],["max","Max"],["team","Team"],["enterprise","Enterprise"]]} /></div>
        <div><Label>Session Date</Label><Inp value={form.date} onChange={e=>set("date",e.target.value)} type="date" /></div>
      </div>
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>AI Literacy *</Label>
      {LIT.map(l => <label key={l.v} onClick={()=>set("literacy",l.v)} style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", padding:"5px 7px", borderRadius:2, border:`1px solid ${form.literacy===l.v?T.ac:T.b}`, background:form.literacy===l.v?T.tg:"transparent", marginBottom:3, transition:"all .15s" }}>
        <div style={{ width:10, height:10, borderRadius:"50%", border:`2px solid ${form.literacy===l.v?T.ac:T.t3}`, background:form.literacy===l.v?T.ac:"transparent", flexShrink:0 }} />
        <span style={{ ...S.mn, fontSize:11, color:form.literacy===l.v?T.ac:T.m2 }}>{l.l}</span>
        <span style={{ fontSize:11, color:T.t3 }}>{l.d}</span>
      </label>)}
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>Time Drains</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
        {PAINS.map(p => <label key={p} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", marginBottom:4, fontSize:12, color:form.pains.includes(p)?T.tx:T.t2 }}>
          <input type="checkbox" checked={form.pains.includes(p)} onChange={()=>tog("pains",p)} style={{ accentColor:T.ac }} />{p}
        </label>)}
      </div>
    </Card>
    <Card style={{ marginBottom:9 }}>
      <Label>Notes</Label>
      <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Prior context, constraints…" style={{ width:"100%", background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.tx, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, padding:"7px 9px", resize:"vertical", minHeight:52, outline:"none" }} />
    </Card>
    <div style={{ textAlign:"right" }}><Btn onClick={submit} disabled={!ok} accent={!!ok}>Generate Brief →</Btn></div>
  </div>;
}

function PromptsTab({ intakes, packages, onPkgUpdate }) {
  const [sel, setSel] = useState("");
  const [ucs, setUcs] = useState([]);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const togUC = uc => setUcs(p => p.includes(uc) ? p.filter(x=>x!==uc) : [...p,uc]);
  const generate = async () => {
    setLoading(true); setErr("");
    const emp = intakes.find(i => i.name === sel);
    const role = emp?.role || "employee";
    const lit = emp ? LIT.find(l=>l.v===emp.literacy)?.l||"regular" : "regular";
    try {
      const txt = await api([{role:"user",content:`Generate exactly 6 tailored Claude prompts. Role: ${role}, Literacy: ${lit}, Use cases: ${ucs.join(", ")}. Each: name ≤6 words, category, full prompt with XML tags, 1-sentence description, 2 tips. JSON only no fences: {"prompts":[{"name":"","category":"","prompt":"","description":"","tips":[""]}]}`}], 3000);
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      setRes(parsed);
      if (emp) { const next={...packages,[emp.name]:{employeeName:emp.name,...parsed,createdAt:new Date().toISOString()}}; await sv("prompt-packages-v1",next); onPkgUpdate(next); }
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Prompt Package Builder</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:11 }}>Select employee + use cases. Generates 6 tailored prompts via Sonnet 4.6.</p>
    {intakes.length > 0 && <Card style={{ marginBottom:7 }}>
      <Label>Load from intake</Label>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {intakes.slice(0,6).map(i => <Btn key={i.id} onClick={()=>setSel(i.name)} accent={sel===i.name}>{i.name}</Btn>)}
      </div>
    </Card>}
    <Card style={{ marginBottom:7 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <Label>Use Cases</Label><span style={{ ...S.mn, fontSize:10, color:T.t2 }}>{ucs.length} selected</span>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {UCS.map(uc => <button key={uc} onClick={()=>togUC(uc)} style={{ background:"transparent", border:`1px solid ${ucs.includes(uc)?T.ac:T.b}`, borderRadius:2, color:ucs.includes(uc)?T.ac:T.t2, ...S.mn, fontSize:10, padding:"3px 8px", cursor:"pointer", transition:"all .15s" }}>{ucs.includes(uc)?"◆ ":""}{uc}</button>)}
      </div>
    </Card>
    {err && <Card style={{ borderColor:"rgba(192,80,80,.4)", marginBottom:7 }}><span style={{ ...S.mn, fontSize:10, color:T.rd }}>✗ {err}</span></Card>}
    {loading ? <Card><span style={{ ...S.mn, fontSize:10, color:T.m2 }}>◌ Generating 6 prompts…</span></Card>
    : res ? <div>
        <div style={{ ...S.hd, fontSize:14, marginTop:4, marginBottom:7 }}>Generated Prompts</div>
        {res.prompts.map((pr,i) => <Card key={i} style={{ marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <div><Tag>{pr.category}</Tag><div style={{ fontSize:13, fontWeight:500, color:T.tx, marginTop:4 }}>{pr.name}</div></div>
            <span style={{ ...S.mn, fontSize:10, color:T.t2 }}>{i+1}/6</span>
          </div>
          <div style={{ fontSize:11, color:T.t2, marginBottom:6 }}>{pr.description}</div>
          <div style={{ background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, padding:"7px 8px", fontSize:11, fontFamily:"'IBM Plex Mono',monospace", whiteSpace:"pre-wrap" }}>{pr.prompt}</div>
          {pr.tips?.length > 0 && <div style={{ fontSize:10, color:T.t3, marginTop:5 }}>{pr.tips.map(t=>`◆ ${t}`).join(" · ")}</div>}
        </Card>)}
        <div style={{ textAlign:"right" }}><Btn onClick={()=>{setRes(null);setUcs([]);}}>Clear</Btn></div>
      </div>
    : <div style={{ textAlign:"right" }}><Btn onClick={generate} disabled={!ucs.length} accent={ucs.length>0}>Generate →</Btn></div>}
  </div>;
}

function OutcomesTab({ intakes, outcomes, onUpdate }) {
  const [view, setView] = useState("log");
  const blank = { name:"", plan:"pro", status:"Completed", date:new Date().toISOString().slice(0,10), qc:{}, gaps:"" };
  const [form, setForm] = useState(blank);
  const setF = (k,v) => setForm(p => ({...p,[k]:v}));
  const togQC = id => setForm(p => ({...p,qc:{...p.qc,[id]:!p.qc[id]}}));
  const submit = async () => {
    const rec = {...form, id:Date.now(), employeeName:form.name, createdAt:new Date().toISOString()};
    const next = [rec, ...outcomes];
    await sv("outcome-records-v1", next);
    onUpdate(next);
    setForm(blank);
    setView("dash");
  };
  if (view === "dash") {
    const comp = outcomes.filter(o=>o.status==="Completed").length;
    return <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
        <div style={{ ...S.hd, fontSize:14 }}>Session Outcomes ({outcomes.length})</div>
        <Btn onClick={()=>setView("log")} accent>+ Log</Btn>
      </div>
      {outcomes.length ? <Card style={{ padding:0, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Employee","Status","Plan","QC","Date"].map(h=><th key={h} style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t2, textAlign:"left", padding:"5px 9px", borderBottom:`1px solid ${T.b}` }}>{h}</th>)}</tr></thead>
          <tbody>{outcomes.map(r=><tr key={r.id}><td style={{ fontWeight:500, color:T.tx, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.name||r.employeeName}</td><td style={{ color:SC[r.status]||T.t2, fontSize:11, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.status}</td><td style={{ ...S.mn, color:T.m2, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{(r.plan||"?").toUpperCase()}</td><td style={{ color:T.t2, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{Object.values(r.qc||{}).filter(Boolean).length}/{QCI.length}</td><td style={{ ...S.mn, color:T.t3, padding:"6px 9px", borderBottom:`1px solid ${T.tg}` }}>{r.date||"—"}</td></tr>)}</tbody>
        </table>
      </Card> : <Card style={{ color:T.t2 }}>No sessions logged yet.</Card>}
    </div>;
  }
  const ok = form.name.trim();
  return <div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
      <div style={{ ...S.hd, fontSize:14 }}>Log Session</div>
      <Btn onClick={()=>setView("dash")}>← Dashboard</Btn>
    </div>
    {intakes.length > 0 && <Card style={{ marginBottom:7 }}>
      <Label>Load from intake</Label>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {intakes.slice(0,5).map(i => <Btn key={i.id} onClick={()=>setForm(p=>({...p,name:i.name,plan:i.plan||"pro"}))}>{i.name}</Btn>)}
      </div>
    </Card>}
    <Card style={{ marginBottom:7 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px" }}>
        <div><Label>Employee *</Label><Inp value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Jane Smith" /></div>
        <div><Label>Status</Label><Sel value={form.status} onChange={e=>setF("status",e.target.value)} options={["Completed","In Progress","Scheduled","Needs Follow-up","No Show"].map(s=>[s,s])} /></div>
        <div><Label>Plan</Label><Sel value={form.plan} onChange={e=>setF("plan",e.target.value)} options={[["free","Free"],["pro","Pro"],["max","Max"],["team","Team"],["enterprise","Enterprise"]]} /></div>
        <div><Label>Date</Label><Inp value={form.date} onChange={e=>setF("date",e.target.value)} type="date" /></div>
      </div>
    </Card>
    <Card style={{ marginBottom:7 }}>
      <Label>QC Gate</Label>
      {QCI.map(q => <div key={q.id} onClick={()=>togQC(q.id)} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"8px 11px", borderBottom:`1px solid ${T.tg}`, cursor:"pointer", background:form.qc[q.id]?T.sf:"transparent" }}>
        <div style={{ width:13, height:13, flexShrink:0, marginTop:1, border:`1px solid ${form.qc[q.id]?T.gn:T.bh}`, borderRadius:2, background:form.qc[q.id]?"#1a2a1a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:T.gn }}>{form.qc[q.id]?"◆":""}</div>
        <span style={{ fontSize:12, fontWeight:500, color:form.qc[q.id]?T.t2:T.tx, textDecoration:form.qc[q.id]?"line-through":"none" }}>{q.l}{q.c&&<span style={{ fontSize:9, color:T.rd }}> ★</span>}</span>
      </div>)}
      <div style={{ fontSize:10, color:T.t3, marginTop:6 }}>★ critical · {Object.values(form.qc).filter(Boolean).length}/{QCI.length} passed</div>
    </Card>
    <Card style={{ marginBottom:9 }}>
      <Label>Open Gaps</Label>
      <textarea value={form.gaps} onChange={e=>setF("gaps",e.target.value)} placeholder="Anything unresolved or needing follow-up…" style={{ width:"100%", background:T.sf, border:`1px solid ${T.b}`, borderRadius:2, color:T.tx, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, padding:"7px 9px", resize:"vertical", minHeight:52, outline:"none" }} />
    </Card>
    <div style={{ textAlign:"right" }}><Btn onClick={submit} disabled={!ok} accent={!!ok}>Save →</Btn></div>
  </div>;
}

function ObjectionsTab() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [expanded, setExpanded] = useState({});
  const [tab, setTab] = useState("lib");
  const [msgs, setMsgs] = useState([]);
  const [ai, setAi] = useState("");
  const [loading, setLoading] = useState(false);
  const threadRef = useRef(null);
  const cats = ["all", ...new Set(QA.map(x=>x.cat))];
  const res = QA.filter(x => (cat==="all"||x.cat===cat) && (!query||x.q.toLowerCase().includes(query.toLowerCase())||x.a.toLowerCase().includes(query.toLowerCase())));
  const sendAI = async () => {
    const input = ai.trim(); if (!input || loading) return;
    setAi(""); setLoading(true);
    const um = {role:"user",content:input};
    setMsgs(p => [...p, um]);
    try {
      const allMsgs = [...msgs, um];
      const reply = await api(allMsgs, 350, "Claude enablement expert. Handle employee pushback about Claude adoption. Direct, practical, under 100 words.");
      setMsgs(p => [...p, {role:"assistant",content:reply}]);
    } catch(e) { setMsgs(p => [...p, {role:"assistant",content:`Error: ${e.message}`,error:true}]); }
    setLoading(false);
    setTimeout(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, 50);
  };
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Objection Handler</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:11 }}>Searchable library + AI for anything not covered.</p>
    <div style={{ display:"flex", border:`1px solid ${T.bh}`, borderRadius:2, overflow:"hidden", width:"fit-content", marginBottom:11 }}>
      {[["lib","Library"],["ai","Ask AI"]].map(([id,l]) => <button key={id} onClick={()=>setTab(id)} style={{ background:"transparent", border:"none", borderRight:id==="lib"?`1px solid ${T.bh}`:"none", padding:"5px 12px", ...S.mn, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", color:tab===id?T.ac:T.t2, transition:"color .15s" }}>{l}</button>)}
    </div>
    {tab === "lib" ? <div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search objections…" style={{ width:"100%", padding:"6px 9px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx, marginBottom:7 }} />
      <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:9 }}>
        {cats.map(c => <button key={c} onClick={()=>setCat(c)} style={{ background:"transparent", border:`1px solid ${cat===c?T.ac:T.b}`, borderRadius:2, color:cat===c?T.ac:T.t2, ...S.mn, fontSize:10, padding:"2px 8px", cursor:"pointer", transition:"all .15s" }}>{c==="all"?`All (${QA.length})`:c}</button>)}
      </div>
      {res.length ? res.map(item => {
        const open = expanded[item.id];
        return <div key={item.id} style={{ background:T.cd, border:`1px solid ${T.b}`, borderRadius:3, overflow:"hidden", marginBottom:4 }}>
          <div onClick={()=>setExpanded(p=>({...p,[item.id]:!p[item.id]}))} style={{ padding:"8px 12px", display:"flex", alignItems:"flex-start", gap:7, cursor:"pointer" }}>
            <Tag style={{ flexShrink:0 }}>{item.cat}</Tag>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:500, fontSize:12, color:T.tx }}>{item.q}</div>
              {!open && <div style={{ fontSize:10, color:T.t3, marginTop:2 }}>{item.a.substring(0,55)}…</div>}
            </div>
            <span style={{ fontSize:8, color:T.t3 }}>{open?"▲":"▼"}</span>
          </div>
          {open && <div style={{ padding:"0 12px 10px", borderTop:`1px solid ${T.b}` }}>
            <div style={{ fontSize:12, color:T.t2, lineHeight:1.6, paddingTop:8 }}>{item.a}</div>
          </div>}
        </div>;
      }) : <Card style={{ color:T.t2 }}>No matches</Card>}
    </div> : <div>
      <div ref={threadRef} style={{ height:250, overflowY:"auto", display:"flex", flexDirection:"column", gap:5, padding:"2px 0" }}>
        {!msgs.length && <div style={{ ...S.mn, fontSize:10, color:T.t3, textAlign:"center", padding:16 }}>Ask about any adoption challenge or pushback.</div>}
        {msgs.map((m,i) => <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
          <div style={{ padding:"7px 9px", borderRadius:2, fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap", maxWidth:"88%", background:m.role==="user"?"rgba(212,137,58,.1)":T.sf, border:`1px solid ${m.role==="user"?"rgba(212,137,58,.2)":T.b}`, color:m.error?T.rd:T.tx }}>{m.content}</div>
        </div>)}
        {loading && <div style={{ display:"flex" }}><div style={{ padding:"7px 9px", borderRadius:2, fontSize:12, background:T.sf, border:`1px solid ${T.b}`, color:T.t3 }}>◌ thinking…</div></div>}
      </div>
      <div style={{ display:"flex", gap:5, marginTop:7 }}>
        <input value={ai} onChange={e=>setAi(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAI();}}} placeholder="Ask about any pushback…" style={{ flex:1, padding:"6px 9px", borderRadius:2, border:`1px solid ${T.bh}`, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", outline:"none", background:T.bg, color:T.tx }} />
        <Btn onClick={sendAI} disabled={!ai.trim()||loading} accent={!!ai.trim()}>→</Btn>
      </div>
    </div>}
  </div>;
}

function ReportTab({ intakes, outcomes }) {
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const comp = outcomes.filter(o=>o.status==="Completed").length;
  const pro = outcomes.filter(o=>["pro","max","team","enterprise"].includes(o.plan)).length;
  const fu = outcomes.filter(o=>o.status==="Needs Follow-up");
  const gaps = [...new Set(outcomes.filter(o=>o.openGaps||o.gaps).map(o=>o.openGaps||o.gaps))].slice(0,3);
  const generate = async () => {
    setLoading(true); setErr("");
    try {
      const r = await api([{role:"user",content:`Write a brief Claude enablement program health report for stakeholders. Data: ${intakes.length} enrolled, ${outcomes.length} sessions (${outcomes.length?Math.round(comp/outcomes.length*100):0}% complete), ${pro} on Pro+, ${fu.length} need follow-up. Open gaps: ${gaps.join(" / ")||"none"}. Format: EXECUTIVE SUMMARY (2 sentences) | KEY METRICS | RISKS & ACTIONS (if any) | NEXT STEPS. Under 300 words. Non-technical audience.`}], 1200);
      setRes(r);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };
  return <div>
    <div style={{ ...S.hd, fontSize:14, marginBottom:7 }}>Program Health Report</div>
    <p style={{ fontSize:11, color:T.t2, marginBottom:11 }}>AI-generated stakeholder narrative from all program data.</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:12 }}>
      <Stat label="Enrolled" value={intakes.length} />
      <Stat label="Sessions" value={outcomes.length} />
      <Stat label="Complete" value={comp} color={T.gn} />
      <Stat label="Follow-up" value={fu.length} color={fu.length?T.rd:T.t3} />
    </div>
    {err && <Card style={{ borderColor:"rgba(192,80,80,.4)", marginBottom:7 }}><span style={{ ...S.mn, fontSize:10, color:T.rd }}>✗ {err}</span></Card>}
    {loading ? <Card><span style={{ ...S.mn, fontSize:10, color:T.m2 }}>◌ Generating report…</span></Card>
    : res ? <div>
        <Card style={{ background:T.sf }}><pre style={{ ...S.mn, fontSize:11, lineHeight:1.7, whiteSpace:"pre-wrap", color:T.tx }}>{res}</pre></Card>
        <div style={{ display:"flex", gap:5, justifyContent:"flex-end", marginTop:6 }}>
          <Btn onClick={()=>navigator.clipboard.writeText(res).catch(()=>{})}>Copy</Btn>
          <Btn onClick={generate}>Regenerate</Btn>
        </div>
      </div>
    : <div style={{ textAlign:"right" }}>
        <Btn onClick={generate} disabled={!intakes.length} accent={intakes.length>0}>Generate Report →</Btn>
        {!intakes.length && <Card style={{ marginTop:6, color:T.t2 }}>Add at least one intake first.</Card>}
      </div>}
  </div>;
}

export default function FacilitatorSuite() {
  const [tab, setTab] = useState("dash");
  const [intakes, setIntakes] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [packages, setPackages] = useState({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([ld("intake-records-v1"),ld("prompt-packages-v1"),ld("outcome-records-v1")]).then(([i,p,o]) => {
      setIntakes(i||[]); setPackages(p||{}); setOutcomes(o||[]); setReady(true);
    });
  }, []);
  const TABS = [["dash","Dashboard"],["intake","Intake"],["prompts","Prompts"],["outcomes","Outcomes"],["obj","Objections"],["report","Report"]];
  return <>
    <style>{GF}{`
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#0c0c0b}
      ::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}
    `}</style>
    <div style={S.app}>
      <header style={{ padding:"14px 22px 11px", borderBottom:`1px solid ${T.b}`, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ ...S.hd, fontSize:18 }}>Facilitator Suite</div>
          <div style={{ ...S.mn, fontSize:10, color:T.t2, marginTop:2 }}>◆ Claude Enablement · Reading Room at Midnight · Variant B</div>
        </div>
        {ready && <div style={{ display:"flex", gap:16 }}>
          {[["employees",intakes.length],["sessions",outcomes.length]].map(([l,v])=><div key={l} style={{ textAlign:"right" }}><div style={{ ...S.mn, fontSize:15, color:T.tx }}>{v}</div><div style={{ ...S.mn, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:T.t3 }}>{l}</div></div>)}
        </div>}
      </header>
      <div style={{ display:"flex", borderBottom:`1px solid ${T.b}`, padding:"0 22px", overflowX:"auto" }}>
        {TABS.map(([id,l]) => <button key={id} onClick={()=>setTab(id)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===id?T.ac:"transparent"}`, cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:500, padding:"8px 12px", color:tab===id?T.tx:T.t2, marginBottom:-1, whiteSpace:"nowrap", transition:"color .15s,border-color .15s" }}>{l}</button>)}
      </div>
      <div style={{ padding:"16px 22px", maxWidth:860 }}>
        {!ready ? <div style={{ ...S.mn, fontSize:10, padding:12, color:T.t2 }}>Loading program data…</div> : <>
          {tab==="dash" && <DashTab intakes={intakes} outcomes={outcomes} packages={packages} onNav={setTab} />}
          {tab==="intake" && <IntakeTab intakes={intakes} onAdd={setIntakes} />}
          {tab==="prompts" && <PromptsTab intakes={intakes} packages={packages} onPkgUpdate={setPackages} />}
          {tab==="outcomes" && <OutcomesTab intakes={intakes} outcomes={outcomes} onUpdate={setOutcomes} />}
          {tab==="obj" && <ObjectionsTab />}
          {tab==="report" && <ReportTab intakes={intakes} outcomes={outcomes} />}
        </>}
      </div>
    </div>
  </>;
}
