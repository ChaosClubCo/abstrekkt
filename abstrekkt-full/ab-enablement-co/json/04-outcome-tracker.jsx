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

const QC_GATES = [
  "Memory enabled and tested",
  "1+ Project created with custom instructions",
  "Writing style configured",
  "Employee can open a conversation in their project",
  "Employee demonstrated at least one useful prompt",
  "Follow-up session or self-study plan confirmed",
];

const OUTCOME_OPTIONS = ["Fully onboarded","Partial — follow-up needed","Blocked — tech issue","No-show / rescheduled"];
const CONFIDENCE_LEVELS = ["1 — No confidence","2 — Some exposure","3 — Basic proficiency","4 — Comfortable","5 — Self-sufficient"];

const EMPTY_FORM = {
  employeeName:"", sessionDate:"", facilitator:"",
  outcome:"", confidenceLevel:"", qcGates:{},
  openGaps:"", nextSteps:"", sessionNotes:"",
};

export default function OutcomeTracker() {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [records, setRecords] = useState([]);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState(null);
  const [view, setView]       = useState("log");
  const [focusedField, setFocusedField] = useState(null);
  const [expandedRec, setExpandedRec]   = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("outcome-records-v1");
        setRecords(r ? JSON.parse(r.value) : []);
      } catch { setRecords([]); }
    })();
    // Pre-fill today's date
    setForm(f => ({ ...f, sessionDate: new Date().toISOString().split("T")[0] }));
  }, []);

  const validate = () => {
    if (!form.employeeName.trim()) return "Employee name required.";
    if (!form.sessionDate) return "Session date required.";
    if (!form.outcome) return "Session outcome required.";
    if (!form.confidenceLevel) return "Confidence level required.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError(null);
    try {
      const qcPassed = QC_GATES.filter((_, i) => form.qcGates[i]).length;
      const record = {
        id: `outcome-${Date.now()}`,
        ts: new Date().toISOString(),
        qcScore: `${qcPassed}/${QC_GATES.length}`,
        ...form,
      };
      const next = [record, ...records];
      const result = await window.storage.set("outcome-records-v1", JSON.stringify(next));
      if (!result) throw new Error("Storage write failed.");
      setRecords(next);
      setForm({ ...EMPTY_FORM, sessionDate: new Date().toISOString().split("T")[0] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setView("records");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const qcPassed = QC_GATES.filter((_, i) => form.qcGates[i]).length;

  const OUTCOME_COLORS = {
    "Fully onboarded": T.green,
    "Partial — follow-up needed": T.mono2,
    "Blocked — tech issue": T.red,
    "No-show / rescheduled": T.text3,
  };

  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px" },
    tabs:  { display:"flex", marginBottom:"24px", borderBottom:`1px solid ${T.border}` },
    tab:   (a) => ({
      padding:"8px 14px", fontSize:"11px", fontFamily:F.mono, letterSpacing:"0.06em",
      color: a ? T.accent : T.text2, background:"transparent", border:"none",
      borderBottom: a ? `1px solid ${T.accent}` : "1px solid transparent",
      cursor:"pointer", textTransform:"uppercase", marginBottom:"-1px",
      transition:`color ${tr}, border-color ${tr}`,
    }),
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" },
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
      resize:"vertical", minHeight:"72px", transition:`border-color ${tr}`,
    }),
    qcSection:{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:radius,
                padding:"14px", marginBottom:"14px" },
    qcTitle:{ fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase",
              color:T.text3, marginBottom:"10px" },
    qcScore:{ fontFamily:F.mono, fontSize:"13px",
              color: qcPassed === QC_GATES.length ? T.green : qcPassed >= 4 ? T.mono2 : T.accent },
    qcItem:{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 0",
             borderBottom:`1px solid ${T.border}`, cursor:"pointer" },
    checkBox:(done) => ({
      width:"13px", height:"13px", minWidth:"13px",
      border:`1px solid ${done ? T.green : T.border}`,
      background: done ? T.green : "transparent",
      borderRadius:"1px", display:"flex", alignItems:"center", justifyContent:"center",
      transition:`background ${tr}, border-color ${tr}`,
    }),
    qcText:(done) => ({ fontSize:"12px", color: done ? T.text : T.text2, lineHeight:"1.4" }),
    btn: (dis) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: dis ? T.text3 : T.bg,
      background: dis ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: dis ? "not-allowed" : "pointer",
      transition:`background ${tr}`,
    }),
    err: { background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    ok:  { background:T.tag, border:`1px solid ${T.green}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.green, marginBottom:"16px", fontFamily:F.mono },
    recCard:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
              padding:"14px", marginBottom:"8px", cursor:"pointer",
              transition:`border-color ${tr}` },
    recName:{ fontFamily:F.serif, fontSize:"15px", color:T.text, marginBottom:"4px" },
    recMeta:{ fontFamily:F.mono, fontSize:"11px", color:T.text2, marginBottom:"6px" },
    badge:(c) => ({
      display:"inline-block", fontFamily:F.mono, fontSize:"10px",
      color:c||T.text2, background:T.tag, padding:"2px 6px", borderRadius:radius, marginRight:"4px",
    }),
    expandBody:{ marginTop:"10px", borderTop:`1px solid ${T.border}`, paddingTop:"10px" },
    expandLabel:{ fontFamily:F.mono, fontSize:"10px", color:T.text3, textTransform:"uppercase",
                  letterSpacing:"0.06em", marginBottom:"3px" },
    expandText:{ fontSize:"12px", color:T.text2, lineHeight:"1.5", marginBottom:"10px" },
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Session Outcome Tracker</div>
        <div style={s.sub}>ARTIFACT 04 · outcome-records-v1 · {records.length} records · Notion sync enabled</div>
      </div>

      <div style={s.tabs}>
        {["log","records"].map(v => (
          <button key={v} style={s.tab(view===v)} onClick={() => setView(v)}>
            {v === "log" ? "Log Outcome" : `Records (${records.length})`}
          </button>
        ))}
      </div>

      {view === "log" && (
        <>
          {error && <div style={s.err}>✗ {error}</div>}
          {saved  && <div style={s.ok}>◆ Outcome saved.</div>}

          <div style={s.grid2}>
            <div style={s.group}>
              <label style={s.label}>Employee Name</label>
              <input type="text" value={form.employeeName}
                     style={s.input(focusedField==="name")}
                     placeholder="Full name"
                     onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                     onChange={e => setForm(f => ({ ...f, employeeName: e.target.value }))} />
            </div>
            <div style={s.group}>
              <label style={s.label}>Session Date</label>
              <input type="date" value={form.sessionDate}
                     style={s.input(focusedField==="date")}
                     onFocus={() => setFocusedField("date")} onBlur={() => setFocusedField(null)}
                     onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))} />
            </div>
          </div>

          <div style={s.grid2}>
            <div style={s.group}>
              <label style={s.label}>Facilitator</label>
              <input type="text" value={form.facilitator}
                     style={s.input(focusedField==="fac")}
                     placeholder="Your name"
                     onFocus={() => setFocusedField("fac")} onBlur={() => setFocusedField(null)}
                     onChange={e => setForm(f => ({ ...f, facilitator: e.target.value }))} />
            </div>
            <div style={s.group}>
              <label style={s.label}>Session Outcome</label>
              <select value={form.outcome} style={s.select(focusedField==="outcome")}
                      onFocus={() => setFocusedField("outcome")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                <option value="">Select…</option>
                {OUTCOME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Employee Confidence Level (1–5)</label>
            <select value={form.confidenceLevel} style={s.select(focusedField==="conf")}
                    onFocus={() => setFocusedField("conf")} onBlur={() => setFocusedField(null)}
                    onChange={e => setForm(f => ({ ...f, confidenceLevel: e.target.value }))}>
              <option value="">Select…</option>
              {CONFIDENCE_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* QC Gate */}
          <div style={s.qcSection}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={s.qcTitle}>QC Gate</div>
              <div style={s.qcScore}>{qcPassed}/{QC_GATES.length} passed</div>
            </div>
            {QC_GATES.map((gate, i) => (
              <div key={i} style={{ ...s.qcItem, borderBottom: i < QC_GATES.length-1 ? `1px solid ${T.border}` : "none" }}
                   onClick={() => setForm(f => ({
                     ...f, qcGates: { ...f.qcGates, [i]: !f.qcGates[i] }
                   }))}>
                <div style={s.checkBox(!!form.qcGates[i])}>
                  {form.qcGates[i] && <span style={{ fontSize:"8px", color:T.bg, fontWeight:700 }}>✓</span>}
                </div>
                <span style={s.qcText(!!form.qcGates[i])}>{gate}</span>
              </div>
            ))}
          </div>

          {[
            ["openGaps","Open Gaps / Blockers","Items not completed, issues encountered…"],
            ["nextSteps","Next Steps","Follow-up actions, homework, next session date…"],
            ["sessionNotes","Session Notes","General observations for the record…"],
          ].map(([key,lbl,ph]) => (
            <div key={key} style={{ ...s.group, marginBottom:"14px" }}>
              <label style={s.label}>{lbl}</label>
              <textarea placeholder={ph} value={form[key]}
                        style={s.textarea(focusedField===key)}
                        onFocus={() => setFocusedField(key)} onBlur={() => setFocusedField(null)}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}

          <button style={s.btn(saving)} disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "◆ Save Outcome Record"}
          </button>
        </>
      )}

      {view === "records" && (
        <div>
          {records.length === 0 && (
            <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>◌ No outcome records yet.</div>
          )}
          {records.map(rec => (
            <div key={rec.id} style={{ ...s.recCard, ...(expandedRec===rec.id ? { borderColor:T.borderHi } : {}) }}
                 onClick={() => setExpandedRec(expandedRec===rec.id ? null : rec.id)}>
              <div style={s.recName}>{rec.employeeName}</div>
              <div style={s.recMeta}>
                {rec.facilitator && `${rec.facilitator} · `}
                {rec.sessionDate} · QC {rec.qcScore}
              </div>
              <div>
                <span style={s.badge(OUTCOME_COLORS[rec.outcome])}>{rec.outcome}</span>
                <span style={s.badge(T.text2)}>{rec.confidenceLevel?.split("—")[0]?.trim()}</span>
              </div>
              {expandedRec === rec.id && (
                <div style={s.expandBody}>
                  {rec.openGaps && <>
                    <div style={s.expandLabel}>Open Gaps</div>
                    <div style={s.expandText}>{rec.openGaps}</div>
                  </>}
                  {rec.nextSteps && <>
                    <div style={s.expandLabel}>Next Steps</div>
                    <div style={s.expandText}>{rec.nextSteps}</div>
                  </>}
                  {rec.sessionNotes && <>
                    <div style={s.expandLabel}>Session Notes</div>
                    <div style={s.expandText}>{rec.sessionNotes}</div>
                  </>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
