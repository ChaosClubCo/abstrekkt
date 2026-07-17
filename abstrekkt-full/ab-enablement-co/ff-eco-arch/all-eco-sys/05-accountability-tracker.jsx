/**
 * Claude Enablement Suite — 5/7: Between-Session Accountability Tracker
 *
 * Weekly check-in form for employees. Logs usage, wins, blockers.
 * Facilitator reviews before each session to inform next-session focus.
 * Stores check-ins in "checkin-records-v1" (shared:true — visible to facilitator health report).
 * Reads intake records for employee pre-fill.
 */

import { useState, useEffect, useCallback } from "react";

const C = {
  primary: "#156082", accent: "#E97132", done: "#15803d",
  navy: "#0E2841", muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc",
  blocked: "#dc2626", active: "#7c3aed",
};

const FREQUENCY_OPTIONS = [
  { value: "daily",    label: "Daily",        emoji: "🔥" },
  { value: "few_week", label: "Few times/wk", emoji: "⚡" },
  { value: "once_week",label: "Once a week",  emoji: "👍" },
  { value: "once_few", label: "Once in a few weeks", emoji: "🙂" },
  { value: "not_yet",  label: "Not yet this week", emoji: "😬" },
];

const USE_CASE_TAGS = [
  "Email drafting", "Document writing", "Summarizing", "Research",
  "Meeting prep", "Code / technical", "Process docs", "Data analysis",
  "Planning", "Customer comms", "Learning something new", "Other",
];

const BLOCKER_TAGS = [
  "Forgot it exists", "Didn't know how to start", "Prompt didn't work well",
  "Too busy", "Results weren't useful", "Concerns about accuracy",
  "Technical issue / error", "No use case came up", "Other",
];

const EMPTY_FORM = {
  name: "", weekOf: getMonday(), frequency: "", useCases: [], blockers: [],
  biggestWin: "", stuckOn: "", nextWeekGoal: "", confidence: 3,
};

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function AccountabilityTracker() {
  const [checkins,  setCheckins]  = useState([]);
  const [intakes,   setIntakes]   = useState([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [view,      setView]      = useState("checkin");   // checkin | log | facilitator
  const [submitted, setSubmitted] = useState(false);
  const [filterName,setFilterName]= useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [cr, ir] = await Promise.allSettled([
          window.storage.get("checkin-records-v1", true),
          window.storage.get("intake-records-v1", true),
        ]);
        if (cr.status === "fulfilled" && cr.value) setCheckins(JSON.parse(cr.value.value));
        if (ir.status === "fulfilled" && ir.value) setIntakes(JSON.parse(ir.value.value));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const save = useCallback(async (recs) => {
    try { await window.storage.set("checkin-records-v1", JSON.stringify(recs), true); } catch (e) { console.error(e); }
  }, []);

  function set(field, val) { setForm(prev => ({ ...prev, [field]: val })); }

  async function submit() {
    if (!form.name || !form.frequency) return;
    const rec = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const next = [rec, ...checkins];
    setCheckins(next);
    await save(next);
    setSubmitted(true);
  }

  function newCheckin() { setForm({ ...EMPTY_FORM, weekOf: getMonday() }); setSubmitted(false); setView("checkin"); }

  const employeeNames = [...new Set(checkins.map(c => c.name))];
  const filtered = filterName === "all" ? checkins : checkins.filter(c => c.name === filterName);

  // ── Submitted confirmation ──
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.done, marginBottom: 8 }}>Check-in submitted!</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Thanks {form.name}. Your facilitator will review this before your next session.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={newCheckin} style={{ ...btn, background: C.primary, padding: "8px 16px", fontSize: 12 }}>Submit another</button>
            <button onClick={() => setView("log")} style={{ ...btn, background: "#334155", padding: "8px 16px", fontSize: 12 }}>View my history</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Facilitator view ──
  if (view === "facilitator") {
    const byEmployee = {};
    checkins.forEach(c => {
      if (!byEmployee[c.name]) byEmployee[c.name] = [];
      byEmployee[c.name].push(c);
    });
    const empList = Object.entries(byEmployee);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>🔍 Facilitator View</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("checkin")} style={btn}>← Check-in Form</button>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 18px" }}>
          {!empList.length
            ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>No check-ins yet.</div>
            : empList.map(([name, recs]) => {
              const latest = recs[0];
              const freqColor = latest.frequency === "daily" || latest.frequency === "few_week" ? C.done : latest.frequency === "not_yet" ? C.blocked : C.accent;
              const avgConfidence = Math.round(recs.reduce((acc, r) => acc + r.confidence, 0) / recs.length * 10) / 10;
              return (
                <div key={name} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{recs.length} check-in{recs.length !== 1 ? "s" : ""} · Latest: {new Date(latest.weekOf).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ textAlign: "center", padding: "6px 10px", background: freqColor + "11", borderRadius: 4, border: `1px solid ${freqColor}33` }}>
                        <div style={{ fontSize: 14 }}>{FREQUENCY_OPTIONS.find(f => f.value === latest.frequency)?.emoji}</div>
                        <div style={{ fontSize: 9, color: freqColor, fontWeight: 700, textTransform: "uppercase" }}>This week</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 10px", background: C.primary + "11", borderRadius: 4, border: `1px solid ${C.primary}22` }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{avgConfidence}</div>
                        <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" }}>Avg conf.</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    {latest.biggestWin && (
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.done, marginBottom: 4, textTransform: "uppercase" }}>Latest Win</div>
                        <div style={{ fontSize: 11, color: "#134e4a" }}>{latest.biggestWin}</div>
                      </div>
                    )}
                    {latest.stuckOn && (
                      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 4, padding: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 4, textTransform: "uppercase" }}>Stuck On</div>
                        <div style={{ fontSize: 11, color: "#7c2d12" }}>{latest.stuckOn}</div>
                      </div>
                    )}
                  </div>

                  {latest.nextWeekGoal && (
                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 4, padding: 8, marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.primary, marginBottom: 3, textTransform: "uppercase" }}>Their next goal → your session focus</div>
                      <div style={{ fontSize: 11, color: "#1e3a8a" }}>{latest.nextWeekGoal}</div>
                    </div>
                  )}

                  {latest.blockers.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {latest.blockers.map((b, i) => (
                        <span key={i} style={{ fontSize: 10, padding: "2px 7px", background: "#fef2f2", color: C.blocked, borderRadius: 3, border: "1px solid #fca5a5" }}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  // ── Log view ──
  if (view === "log") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>📋 Check-in History</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("facilitator")} style={{ ...btn, background: "#334155" }}>🔍 Facilitator View</button>
          <button onClick={newCheckin} style={{ ...btn, background: C.done }}>+ Check In</button>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 18px" }}>
          {employeeNames.length > 1 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["all", ...employeeNames].map(n => (
                <button key={n} onClick={() => setFilterName(n)}
                  style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${filterName === n ? C.primary : C.border}`, background: filterName === n ? C.primary + "11" : "#fff", color: filterName === n ? C.primary : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "system-ui" }}>
                  {n === "all" ? "All" : n}
                </button>
              ))}
            </div>
          )}
          {!filtered.length
            ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>No check-ins yet.</div>
            : filtered.map(rec => {
              const freq = FREQUENCY_OPTIONS.find(f => f.value === rec.frequency);
              return (
                <div key={rec.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{freq?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{rec.name} · Week of {new Date(rec.weekOf).toLocaleDateString()}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{freq?.label} · Confidence: {rec.confidence}/5</div>
                    </div>
                  </div>
                  {rec.biggestWin && <div style={{ fontSize: 11, color: "#134e4a", background: "#f0fdf4", padding: "4px 8px", borderRadius: 3, marginBottom: 4 }}>✅ {rec.biggestWin}</div>}
                  {rec.stuckOn && <div style={{ fontSize: 11, color: "#7c2d12", background: "#fff7ed", padding: "4px 8px", borderRadius: 3 }}>⚠ {rec.stuckOn}</div>}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  // ── CHECK-IN FORM ──
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>⚡ Weekly Claude Check-In</span>
        <div style={{ flex: 1 }}/>
        {checkins.length > 0 && <button onClick={() => setView("facilitator")} style={{ ...btn, background: "#334155" }}>🔍 Facilitator View</button>}
        {checkins.length > 0 && <button onClick={() => setView("log")} style={{ ...btn, background: "#334155" }}>📋 History</button>}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 18px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted }}>
            Takes about 2 minutes. Helps your facilitator prepare for your next session.
          </div>
        </div>

        {/* Name + week */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <div>
              <div style={labelStyle}>Your Name *</div>
              {intakes.length > 0 ? (
                <select value={form.name} onChange={e => set("name", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select name…</option>
                  {[...new Set(intakes.map(i => i.name))].map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="__custom__">Other (type below)</option>
                </select>
              ) : (
                <input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="Your name"/>
              )}
              {form.name === "__custom__" && <input value="" onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="Type your name"/>}
            </div>
            <div>
              <div style={labelStyle}>Week of</div>
              <input value={form.weekOf} onChange={e => set("weekOf", e.target.value)} type="date" style={inputStyle}/>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>How often did you use Claude this week? *</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FREQUENCY_OPTIONS.map(f => (
              <button key={f.value} onClick={() => set("frequency", f.value)}
                style={{ padding: "8px 14px", borderRadius: 6, border: `2px solid ${form.frequency === f.value ? C.primary : C.border}`, background: form.frequency === f.value ? C.primary + "11" : "#fff", cursor: "pointer", fontFamily: "system-ui", transition: "all 0.1s" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{f.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: form.frequency === f.value ? C.primary : "#334155" }}>{f.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Use cases this week */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>What did you use it for?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {USE_CASE_TAGS.map(tag => {
              const sel = form.useCases.includes(tag);
              return (
                <button key={tag} onClick={() => set("useCases", toggleArr(form.useCases, tag))}
                  style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${sel ? C.done : C.border}`, background: sel ? C.done + "11" : "#fff", color: sel ? C.done : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: sel ? 700 : 400 }}>
                  {sel ? "✓ " : ""}{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Win */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Biggest win this week</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>A task Claude helped with, time saved, or something that worked well.</div>
          <textarea value={form.biggestWin} onChange={e => set("biggestWin", e.target.value)}
            style={{ ...inputStyle, height: 60, resize: "vertical", marginBottom: 0 }} placeholder="e.g. 'Drafted the Q3 update email in 5 minutes instead of 30'"/>
        </div>

        {/* Blockers */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>What got in the way?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BLOCKER_TAGS.map(tag => {
              const sel = form.blockers.includes(tag);
              return (
                <button key={tag} onClick={() => set("blockers", toggleArr(form.blockers, tag))}
                  style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${sel ? C.blocked : C.border}`, background: sel ? "#fef2f2" : "#fff", color: sel ? C.blocked : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: sel ? 700 : 400 }}>
                  {tag}
                </button>
              );
            })}
          </div>
          <textarea value={form.stuckOn} onChange={e => set("stuckOn", e.target.value)} style={{ ...inputStyle, height: 50, resize: "vertical", marginTop: 8, marginBottom: 0 }} placeholder="What specifically were you trying to do when it didn't work?"/>
        </div>

        {/* Confidence + goal */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Confidence using Claude: {form.confidence}/5</div>
            <input type="range" min="1" max="5" value={form.confidence} onChange={e => set("confidence", +e.target.value)}
              style={{ width: "100%", accentColor: C.primary }}/>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 2 }}>
              <span>1 — Still learning</span><span>3 — Getting it</span><span>5 — Confident</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>What do you want to try next week?</div>
            <textarea value={form.nextWeekGoal} onChange={e => set("nextWeekGoal", e.target.value)}
              style={{ ...inputStyle, height: 50, resize: "vertical", marginBottom: 0 }} placeholder="e.g. 'I want to try connecting Notion and searching my docs through Claude'"/>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={submit} disabled={!form.name || !form.frequency}
            style={{ padding: "10px 24px", borderRadius: 4, border: "none", cursor: form.name && form.frequency ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, fontFamily: "system-ui", background: form.name && form.frequency ? C.done : "#e2e8f0", color: form.name && form.frequency ? "#fff" : C.muted }}>
            Submit Check-In →
          </button>
        </div>
      </div>
    </div>
  );
}

const btn        = { padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", color: "#fff" };
const labelStyle = { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 };
const inputStyle = { width: "100%", padding: "7px 9px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none", marginBottom: 10 };
