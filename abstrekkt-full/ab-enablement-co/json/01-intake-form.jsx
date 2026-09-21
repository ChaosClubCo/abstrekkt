import { useState, useEffect, useCallback } from "react";

const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const EXPERIENCE_LEVELS = ["No prior AI use","Occasional (chat only)","Regular (prompting)","Advanced (workflows/APIs)"];
const SESSION_GOALS = [
  "Profile & memory setup","Prompt engineering basics","Tool/connector walkthrough",
  "Workflow automation","Advanced use-case design","Team enablement strategy",
];
const DEPARTMENTS = ["Engineering","Product","Marketing","Sales","Operations","Finance","HR","Executive","Other"];

const EMPTY_FORM = {
  name:"", role:"", department:"", email:"",
  experience:"", sessionGoals:[], notes:"", facilitator:"",
};

export default function IntakeForm() {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [records, setRecords] = useState([]);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState(null);
  const [view, setView]       = useState("form"); // "form" | "records"
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  const loadRecords = useCallback(async () => {
    try {
      const r = await window.storage.get("intake-records-v1");
      setRecords(r ? JSON.parse(r.value) : []);
    } catch { setRecords([]); }
  }, []);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const toggleGoal = (goal) => {
    setForm(f => ({
      ...f,
      sessionGoals: f.sessionGoals.includes(goal)
        ? f.sessionGoals.filter(g => g !== goal)
        : [...f.sessionGoals, goal],
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Employee name required.";
    if (!form.role.trim()) return "Role required.";
    if (!form.department) return "Department required.";
    if (!form.experience) return "Experience level required.";
    if (form.sessionGoals.length === 0) return "Select at least one session goal.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError(null);
    try {
      const record = {
        id: `intake-${Date.now()}`,
        ts: new Date().toISOString(),
        ...form,
      };
      const next = [record, ...records];
      const result = await window.storage.set("intake-records-v1", JSON.stringify(next));
      if (!result) throw new Error("Storage write failed.");
      setRecords(next);
      setForm(EMPTY_FORM);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── styles ────────────────────────────────────────────────────────────────
  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px", letterSpacing:"0.04em" },
    tabs:  { display:"flex", gap:"0", marginBottom:"24px", borderBottom:`1px solid ${T.border}` },
    tab:   (a) => ({
      padding:"8px 14px", fontSize:"11px", fontFamily:F.mono, letterSpacing:"0.06em",
      color: a ? T.accent : T.text2, background:"transparent", border:"none",
      borderBottom: a ? `1px solid ${T.accent}` : "1px solid transparent",
      cursor:"pointer", textTransform:"uppercase",
      transition:`color ${tr}, border-color ${tr}`, marginBottom:"-1px",
    }),
    grid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" },
    group: { display:"flex", flexDirection:"column", gap:"6px" },
    label: { fontSize:"11px", fontFamily:F.mono, color:T.text2, letterSpacing:"0.06em", textTransform:"uppercase" },
    input: (focused) => ({
      background:T.surface, border:`1px solid ${focused ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%",
      transition:`border-color ${tr}`,
    }),
    select: (focused) => ({
      background:T.surface, border:`1px solid ${focused ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%", cursor:"pointer",
      transition:`border-color ${tr}`,
    }),
    textarea: (focused) => ({
      background:T.surface, border:`1px solid ${focused ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%",
      resize:"vertical", minHeight:"80px", transition:`border-color ${tr}`,
    }),
    goalGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginTop:"4px" },
    goalBtn:(active) => ({
      padding:"7px 10px", fontSize:"12px", fontFamily:F.sans, textAlign:"left",
      background: active ? T.tag : "transparent",
      border:`1px solid ${active ? T.accent : T.border}`,
      borderRadius:radius, color: active ? T.accent : T.text2, cursor:"pointer",
      transition:`color ${tr}, border-color ${tr}, background ${tr}`,
    }),
    btn: (disabled) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: disabled ? T.text3 : T.bg,
      background: disabled ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: disabled ? "not-allowed" : "pointer",
      transition:`background ${tr}`,
    }),
    err: { background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    ok:  { background:T.tag, border:`1px solid ${T.green}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.green, marginBottom:"16px", fontFamily:F.mono },
    recordCard:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
                 padding:"14px", marginBottom:"10px" },
    recordName:{ fontFamily:F.serif, fontSize:"15px", color:T.text, marginBottom:"4px" },
    recordMeta:{ fontFamily:F.mono, fontSize:"11px", color:T.text2, marginBottom:"8px" },
    tagChip:(c) => ({
      display:"inline-block", fontFamily:F.mono, fontSize:"10px",
      color:c||T.text2, background:T.tag, padding:"2px 6px", borderRadius:radius,
      marginRight:"4px", marginBottom:"2px",
    }),
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Pre-Session Intake</div>
        <div style={s.sub}>ARTIFACT 01 · intake-records-v1 · {records.length} records</div>
      </div>

      <div style={s.tabs}>
        {["form","records"].map(v => (
          <button key={v} style={s.tab(view===v)} onClick={() => setView(v)}>
            {v === "form" ? "New Intake" : `Records (${records.length})`}
          </button>
        ))}
      </div>

      {view === "form" && (
        <>
          {error && <div style={s.err}>✗ {error}</div>}
          {saved  && <div style={s.ok}>◆ Intake saved to storage.</div>}

          <div style={{ ...s.grid, marginBottom:"16px" }}>
            {[
              ["name","Employee Name","text","Full name"],
              ["role","Role / Title","text","e.g. Senior Designer"],
              ["facilitator","Facilitator","text","Your name"],
              ["email","Email (optional)","email","work@org.com"],
            ].map(([key,lbl,type,ph]) => (
              <div key={key} style={s.group}>
                <label style={s.label}>{lbl}</label>
                <input
                  type={type} placeholder={ph} value={form[key]}
                  style={s.input(focusedField===key)}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
            <div style={s.group}>
              <label style={s.label}>Department</label>
              <select value={form.department} style={s.select(focusedField==="dept")}
                      onFocus={() => setFocusedField("dept")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={s.group}>
              <label style={s.label}>AI Experience Level</label>
              <select value={form.experience} style={s.select(focusedField==="exp")}
                      onFocus={() => setFocusedField("exp")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
                <option value="">Select…</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...s.group, marginBottom:"16px" }}>
            <label style={s.label}>Session Goals</label>
            <div style={s.goalGrid}>
              {SESSION_GOALS.map(goal => (
                <button key={goal} style={s.goalBtn(form.sessionGoals.includes(goal))}
                        onClick={() => toggleGoal(goal)}>
                  {form.sessionGoals.includes(goal) ? "◆" : "◇"} {goal}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...s.group, marginBottom:"24px" }}>
            <label style={s.label}>Additional Notes</label>
            <textarea placeholder="Context, blockers, specific asks…"
                      value={form.notes} style={s.textarea(focusedField==="notes")}
                      onFocus={() => setFocusedField("notes")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <button style={s.btn(saving)} disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "◆ Save Intake Record"}
          </button>
        </>
      )}

      {view === "records" && (
        <div>
          {records.length === 0 && (
            <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>
              ◌ No intake records yet.
            </div>
          )}
          {records.map(rec => (
            <div key={rec.id} style={s.recordCard}>
              <div style={s.recordName}>{rec.name}</div>
              <div style={s.recordMeta}>
                {rec.role} · {rec.department} · {new Date(rec.ts).toLocaleDateString()}
              </div>
              <div style={{ marginBottom:"6px" }}>
                <span style={s.tagChip(T.mono2)}>{rec.experience}</span>
                {rec.sessionGoals.map(g => <span key={g} style={s.tagChip(T.text2)}>{g}</span>)}
              </div>
              {rec.notes && <div style={{ fontSize:"12px", color:T.text2 }}>{rec.notes}</div>}
              {rec.facilitator && (
                <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3, marginTop:"6px" }}>
                  Facilitator: {rec.facilitator}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
