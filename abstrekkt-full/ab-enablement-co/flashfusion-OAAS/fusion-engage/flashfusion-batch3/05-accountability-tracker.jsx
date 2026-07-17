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

const USAGE_FREQUENCIES = ["Daily","Several times a week","Once a week","Less than weekly","Not using yet"];
const USE_CASES = [
  "Writing / editing","Research / summarization","Coding / debugging",
  "Data analysis","Meeting prep / notes","Email drafting",
  "Brainstorming","Process documentation","Customer communication","Other",
];
const BLOCKER_TYPES = ["Technical issue","Prompt skill gap","Not enough time","Use case uncertainty","No blockers"];

const EMPTY_FORM = {
  name:"", weekOf:"",
  usageFrequency:"", useCases:[],
  highlight:"", blockers:[], blockerNotes:"",
  nextWeekGoal:"", confidenceRating:"",
};

function ConfidenceSlider({ value, onChange }) {
  const colors = ["","#c05050","#c05050","#d4893a","#d4893a","#7ab878","#7ab878","#5a9c5a","#5a9c5a","#5a9c5a","#7ab878"];
  return (
    <div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"6px" }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => onChange(String(n))}
                  style={{
                    flex:1, height:"28px", fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px",
                    background: Number(value) >= n ? colors[n] : "#181815",
                    border:`1px solid ${Number(value) >= n ? colors[n] : "#232320"}`,
                    borderRadius:"2px", color: Number(value) >= n ? "#0c0c0b" : "#3a3835",
                    cursor:"pointer", transition:"all 0.15s", fontWeight: Number(value) === n ? 700 : 400,
                  }}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", color:"#807c74" }}>
        {!value ? "Select confidence level (1 = no use, 10 = daily power user)" :
         Number(value) <= 3 ? "Low — needs support" :
         Number(value) <= 6 ? "Building — progressing" :
         Number(value) <= 8 ? "Confident — consistent use" : "Expert — self-sufficient"}
      </div>
    </div>
  );
}

export default function AccountabilityTracker() {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [records, setRecords] = useState([]);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState(null);
  const [view, setView]       = useState("checkin");
  const [focusedField, setFocusedField] = useState(null);
  const [expandedRec, setExpandedRec]   = useState(null);
  const [filterName, setFilterName]     = useState("");

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
        const r = await window.storage.get("checkin-records-v1");
        setRecords(r ? JSON.parse(r.value) : []);
      } catch { setRecords([]); }
    })();
    // Default week-of to current Monday
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    setForm(f => ({ ...f, weekOf: monday.toISOString().split("T")[0] }));
  }, []);

  const toggleArr = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name required.";
    if (!form.weekOf) return "Week date required.";
    if (!form.usageFrequency) return "Usage frequency required.";
    if (!form.confidenceRating) return "Confidence rating required.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError(null);
    try {
      const record = { id:`checkin-${Date.now()}`, ts: new Date().toISOString(), ...form };
      const next = [record, ...records];
      const result = await window.storage.set("checkin-records-v1", JSON.stringify(next));
      if (!result) throw new Error("Storage write failed.");
      setRecords(next);
      const now = new Date();
      const day = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      setForm({ ...EMPTY_FORM, weekOf: monday.toISOString().split("T")[0] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setView("history");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredRecords = filterName
    ? records.filter(r => r.name.toLowerCase().includes(filterName.toLowerCase()))
    : records;

  // Derive unique names for filter
  const uniqueNames = [...new Set(records.map(r => r.name))].sort();

  const FREQ_COLORS = {
    "Daily":T.green,"Several times a week":T.mono,"Once a week":T.mono2,
    "Less than weekly":T.text2,"Not using yet":T.red,
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
    input: (f) => ({
      background:T.surface, border:`1px solid ${f ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%",
      transition:`border-color ${tr}`,
    }),
    select: (f) => ({
      background:T.surface, border:`1px solid ${f ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%", cursor:"pointer",
      transition:`border-color ${tr}`,
    }),
    textarea: (f) => ({
      background:T.surface, border:`1px solid ${f ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"9px 12px", fontSize:"13px",
      color:T.text, fontFamily:F.sans, outline:"none", width:"100%",
      resize:"vertical", minHeight:"68px", transition:`border-color ${tr}`,
    }),
    multiGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px", marginTop:"4px" },
    multiBtn:(active) => ({
      padding:"6px 10px", fontSize:"12px", textAlign:"left",
      background: active ? T.tag : "transparent",
      border:`1px solid ${active ? T.accent : T.border}`,
      borderRadius:radius, color: active ? T.accent : T.text2, cursor:"pointer",
      transition:`color ${tr}, border-color ${tr}, background ${tr}`,
    }),
    btn: (dis) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: dis ? T.text3 : T.bg,
      background: dis ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: dis ? "not-allowed" : "pointer",
      marginTop:"20px", transition:`background ${tr}`,
    }),
    err: { background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    ok:  { background:T.tag, border:`1px solid ${T.green}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.green, marginBottom:"16px", fontFamily:F.mono },
    recCard:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
              padding:"13px", marginBottom:"8px", cursor:"pointer",
              transition:`border-color ${tr}` },
    badge:(c) => ({
      display:"inline-block", fontFamily:F.mono, fontSize:"10px",
      color:c||T.text2, background:T.tag, padding:"2px 6px", borderRadius:radius, marginRight:"4px",
    }),
    confBar:{ display:"flex", gap:"2px", marginTop:"6px" },
    confFill:(n, val) => ({
      height:"4px", flex:1, borderRadius:"1px",
      background: Number(val) >= n ? (Number(val) <= 3 ? T.red : Number(val) <= 6 ? T.mono2 : T.green) : T.border,
      transition:`background ${tr}`,
    }),
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Accountability Tracker</div>
        <div style={s.sub}>ARTIFACT 05 · checkin-records-v1 · {records.length} check-ins · Notion sync enabled</div>
      </div>

      <div style={s.tabs}>
        {["checkin","history"].map(v => (
          <button key={v} style={s.tab(view===v)} onClick={() => setView(v)}>
            {v === "checkin" ? "Weekly Check-In" : `History (${records.length})`}
          </button>
        ))}
      </div>

      {view === "checkin" && (
        <>
          {error && <div style={s.err}>✗ {error}</div>}
          {saved  && <div style={s.ok}>◆ Check-in saved.</div>}

          <div style={s.grid2}>
            <div style={s.group}>
              <label style={s.label}>Your Name</label>
              <input type="text" value={form.name} placeholder="Full name"
                     style={s.input(focusedField==="name")}
                     onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                     onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={s.group}>
              <label style={s.label}>Week of</label>
              <input type="date" value={form.weekOf}
                     style={s.input(focusedField==="week")}
                     onFocus={() => setFocusedField("week")} onBlur={() => setFocusedField(null)}
                     onChange={e => setForm(f => ({ ...f, weekOf: e.target.value }))} />
            </div>
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Usage Frequency</label>
            <select value={form.usageFrequency} style={s.select(focusedField==="freq")}
                    onFocus={() => setFocusedField("freq")} onBlur={() => setFocusedField(null)}
                    onChange={e => setForm(f => ({ ...f, usageFrequency: e.target.value }))}>
              <option value="">How often did you use Claude this week?</option>
              {USAGE_FREQUENCIES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Use Cases This Week</label>
            <div style={s.multiGrid}>
              {USE_CASES.map(uc => (
                <button key={uc} style={s.multiBtn(form.useCases.includes(uc))}
                        onClick={() => toggleArr("useCases", uc)}>
                  {form.useCases.includes(uc) ? "◆" : "◇"} {uc}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Highlight / Win This Week</label>
            <textarea placeholder="Best thing Claude helped you with this week…"
                      value={form.highlight} style={s.textarea(focusedField==="highlight")}
                      onFocus={() => setFocusedField("highlight")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))} />
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Blockers</label>
            <div style={s.multiGrid}>
              {BLOCKER_TYPES.map(bt => (
                <button key={bt} style={s.multiBtn(form.blockers.includes(bt))}
                        onClick={() => toggleArr("blockers", bt)}>
                  {form.blockers.includes(bt) ? "◆" : "◇"} {bt}
                </button>
              ))}
            </div>
          </div>

          {form.blockers.some(b => b !== "No blockers") && (
            <div style={{ ...s.group, marginBottom:"14px" }}>
              <label style={s.label}>Blocker Details</label>
              <textarea placeholder="Describe the blockers…"
                        value={form.blockerNotes} style={s.textarea(focusedField==="blockerNotes")}
                        onFocus={() => setFocusedField("blockerNotes")} onBlur={() => setFocusedField(null)}
                        onChange={e => setForm(f => ({ ...f, blockerNotes: e.target.value }))} />
            </div>
          )}

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Goal for Next Week</label>
            <textarea placeholder="What will you try or improve next week?"
                      value={form.nextWeekGoal} style={s.textarea(focusedField==="goal")}
                      onFocus={() => setFocusedField("goal")} onBlur={() => setFocusedField(null)}
                      onChange={e => setForm(f => ({ ...f, nextWeekGoal: e.target.value }))} />
          </div>

          <div style={{ ...s.group, marginBottom:"14px" }}>
            <label style={s.label}>Confidence Rating (1–10)</label>
            <ConfidenceSlider value={form.confidenceRating}
                              onChange={v => setForm(f => ({ ...f, confidenceRating: v }))} />
          </div>

          <button style={s.btn(saving)} disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "◆ Submit Check-In"}
          </button>
        </>
      )}

      {view === "history" && (
        <div>
          {uniqueNames.length > 1 && (
            <select value={filterName} style={{ ...s.select(false), marginBottom:"16px" }}
                    onChange={e => setFilterName(e.target.value)}>
              <option value="">All employees</option>
              {uniqueNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}
          {filteredRecords.length === 0 && (
            <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>◌ No check-ins yet.</div>
          )}
          {filteredRecords.map(rec => (
            <div key={rec.id}
                 style={{ ...s.recCard, ...(expandedRec===rec.id ? { borderColor:T.borderHi } : {}) }}
                 onClick={() => setExpandedRec(expandedRec===rec.id ? null : rec.id)}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <span style={{ fontFamily:F.serif, fontSize:"14px", color:T.text }}>{rec.name}</span>
                  <span style={{ fontFamily:F.mono, fontSize:"11px", color:T.text2, marginLeft:"10px" }}>
                    Week of {rec.weekOf}
                  </span>
                </div>
                <span style={{ fontFamily:F.mono, fontSize:"12px",
                               color: Number(rec.confidenceRating) <= 3 ? T.red :
                                      Number(rec.confidenceRating) <= 6 ? T.mono2 : T.green }}>
                  {rec.confidenceRating}/10
                </span>
              </div>
              <div style={s.confBar}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <div key={n} style={s.confFill(n, rec.confidenceRating)} />
                ))}
              </div>
              <div style={{ marginTop:"8px" }}>
                <span style={s.badge(FREQ_COLORS[rec.usageFrequency])}>{rec.usageFrequency}</span>
                {rec.blockers.filter(b => b !== "No blockers").length > 0 && (
                  <span style={s.badge(T.red)}>
                    {rec.blockers.filter(b => b !== "No blockers").length} blocker(s)
                  </span>
                )}
              </div>
              {expandedRec === rec.id && (
                <div style={{ marginTop:"10px", borderTop:`1px solid ${T.border}`, paddingTop:"10px" }}>
                  {rec.useCases.length > 0 && (
                    <div style={{ marginBottom:"8px" }}>
                      <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3,
                                    textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>
                        Use Cases
                      </div>
                      {rec.useCases.map(uc => <span key={uc} style={s.badge(T.text2)}>{uc}</span>)}
                    </div>
                  )}
                  {rec.highlight && (
                    <div style={{ marginBottom:"8px" }}>
                      <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3,
                                    textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>
                        Highlight
                      </div>
                      <div style={{ fontSize:"12px", color:T.text2, lineHeight:"1.5" }}>{rec.highlight}</div>
                    </div>
                  )}
                  {rec.blockerNotes && (
                    <div style={{ marginBottom:"8px" }}>
                      <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.red,
                                    textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>
                        Blocker Notes
                      </div>
                      <div style={{ fontSize:"12px", color:T.text2, lineHeight:"1.5" }}>{rec.blockerNotes}</div>
                    </div>
                  )}
                  {rec.nextWeekGoal && (
                    <div>
                      <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3,
                                    textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>
                        Next Week Goal
                      </div>
                      <div style={{ fontSize:"12px", color:T.text2, lineHeight:"1.5" }}>{rec.nextWeekGoal}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
