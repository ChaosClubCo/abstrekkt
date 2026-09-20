/**
 * Session Timer & Checklist
 * INT Claude Enablement — facilitator companion (live timing + phase tracker)
 *
 * Replaces the markdown timing guide with an active session tool:
 *   - Format selector (Express 30 / Standard 60 / Full 90)
 *   - Live elapsed timer with phase markers
 *   - Hard-stop visual warnings
 *   - 3 non-negotiables tracker (always visible)
 *   - Stop & reschedule criteria
 *   - Saves session log to window.storage ("timer-log-v1")
 */

import { useState, useEffect, useRef, useCallback } from "react";

// INT Inc. corporate palette (matches enablement suite)
const C = {
  primary: "#156082",
  accent:  "#E97132",
  navy:    "#0E2841",
  done:    "#15803d",
  muted:   "#64748b",
  border:  "#e2e8f0",
  bg:      "#f8fafc",
  surface: "#ffffff",
  active:  "#7c3aed",
  blocked: "#dc2626",
  warning: "#d97706",
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

// ───────────────────────────────────────────────────────────────────
// DATA: Session formats
// ───────────────────────────────────────────────────────────────────

const FORMATS = {
  express: {
    id: "express",
    label: "Express",
    duration: 30,
    description: "Tech-savvy employee. Setup focus only.",
    phases: [
      { name: "Login + Plan check",            start: 0,  end: 3,  hardStop: 3,  detail: "Confirm Pro, not Free." },
      { name: "Projects setup",                start: 3,  end: 12, hardStop: 9,  detail: "Name, write 3-line instructions, test." },
      { name: "Prompt package delivery",       start: 12, end: 20, hardStop: 8,  detail: "Walk through 2–3 prompts, run one live." },
      { name: "QC gate",                       start: 20, end: 27, hardStop: 7,  detail: "Run q1–q4 only (critical items)." },
      { name: "Next session",                  start: 27, end: 30, hardStop: 3,  detail: "Set date + #1 use case." },
    ],
    cuts: "Memory, connectors, advanced features deferred to session 2.",
  },
  standard: {
    id: "standard",
    label: "Standard",
    duration: 60,
    description: "Most employees. Recommended default.",
    phases: [
      { name: "Intake review",                 start: 0,  end: 3,  hardStop: 3,  detail: "Role, goals, current pain points." },
      { name: "Login + Plan check",            start: 3,  end: 7,  hardStop: 4,  detail: "Address upgrade path if Free." },
      { name: "Mental model — Projects",       start: 7,  end: 12, hardStop: 5,  detail: "'Claude has amnesia without a Project.' Demo." },
      { name: "Projects setup",                start: 12, end: 25, hardStop: 13, detail: "Make-or-break phase. Don't rush." },
      { name: "Memory configuration",          start: 25, end: 30, hardStop: 5,  detail: "Enable, write 3 memory edits live." },
      { name: "Prompt package delivery",       start: 30, end: 45, hardStop: 15, detail: "All 6 prompts, run 2 live." },
      { name: "Connector setup",               start: 45, end: 52, hardStop: 7,  detail: "Connect 1 relevant tool." },
      { name: "QC gate + gaps",                start: 52, end: 58, hardStop: 6,  detail: "All 7 items. Log fails as gaps." },
      { name: "Next session",                  start: 58, end: 60, hardStop: 2,  detail: "Confirm #1 weekly use case." },
    ],
    cuts: "If behind by Memory phase: cut connectors, not Projects.",
  },
  full: {
    id: "full",
    label: "Full",
    duration: 90,
    description: "Skeptics, execs, complex use cases.",
    phases: [
      { name: "Intake deep-dive",              start: 0,  end: 5,  hardStop: 5,  detail: "Role, goals, pain points, tool stack." },
      { name: "Login + Plan check",            start: 5,  end: 10, hardStop: 5,  detail: "If exec: address Team/Enterprise path." },
      { name: "Mental model — full demo",      start: 10, end: 18, hardStop: 8,  detail: "Before/after demo without vs. with setup." },
      { name: "Projects setup",                start: 18, end: 33, hardStop: 15, detail: "Detailed instructions. Iterate." },
      { name: "Memory configuration",          start: 33, end: 40, hardStop: 7,  detail: "Enable, write 5 edits, verify." },
      { name: "Prompt package delivery",       start: 40, end: 58, hardStop: 18, detail: "All 6, run 3 live, customize 1 together." },
      { name: "Connector setup",               start: 58, end: 68, hardStop: 10, detail: "Connect 2–3 tools, test 1 live." },
      { name: "Advanced feature preview",      start: 68, end: 78, hardStop: 10, detail: "Artifacts, Deep Research, or extended thinking." },
      { name: "QC gate",                       start: 78, end: 86, hardStop: 8,  detail: "All 7 items. Fails → next session agenda." },
      { name: "Next session",                  start: 86, end: 90, hardStop: 4,  detail: "Set date + 3-week focus plan." },
    ],
    cuts: "Don't default to Full — only when skepticism or complex use case is real.",
  },
};

const NON_NEGOTIABLES = [
  { id: "n1", label: "Project with working custom instructions (tested, not just created)" },
  { id: "n2", label: "One prompt package prompt run live (they typed it, they saw it work)" },
  { id: "n3", label: "Next session date confirmed (on the calendar before they leave)" },
];

const STOP_CRITERIA = [
  "Employee on Free plan + can't or won't upgrade — nothing material can be set up",
  "claude.ai blocked by corporate proxy — IT must fix first",
  "Employee actively disengaged or hostile — pause, flag to manager, resume later",
  "Session 20% over time with major phases unfinished — better two clean than one rushed",
];

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

export default function SessionTimer() {
  const [format, setFormat] = useState(null);     // null | "express" | "standard" | "full"
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);      // seconds
  const [employeeName, setEmployeeName] = useState("");
  const [nonNeg, setNonNeg] = useState({});       // { n1: true, n2: false, ... }
  const [showStopCriteria, setShowStopCriteria] = useState(false);
  const intervalRef = useRef(null);

  // Tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function pickFormat(id) {
    setFormat(id);
    setElapsed(0);
    setRunning(false);
    setNonNeg({});
  }

  function toggleRun() { setRunning(r => !r); }
  function reset() {
    if (!confirm("Reset the timer? This clears elapsed time and non-negotiables.")) return;
    setRunning(false);
    setElapsed(0);
    setNonNeg({});
  }
  function endSession() {
    if (!confirm("End and log this session?")) return;
    setRunning(false);
    logSession();
  }

  const logSession = useCallback(async () => {
    if (!format) return;
    try {
      const r = await window.storage.get("timer-log-v1");
      const log = r ? JSON.parse(r.value) : [];
      log.unshift({
        id: Date.now(),
        endedAt: new Date().toISOString(),
        format,
        plannedDuration: FORMATS[format].duration * 60,
        actualDuration: elapsed,
        employeeName: employeeName || "(unnamed)",
        nonNegotiables: { ...nonNeg },
        completion: NON_NEGOTIABLES.every(n => nonNeg[n.id]) ? "complete" : "needs-followup",
      });
      await window.storage.set("timer-log-v1", JSON.stringify(log.slice(0, 50)));
    } catch (e) { console.error(e); }
  }, [format, elapsed, employeeName, nonNeg]);

  // ───────────────────────────────────────────────────────────────────
  // Format picker (no format selected)
  // ───────────────────────────────────────────────────────────────────
  if (!format) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy }}>
        <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "20px 32px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              INT Claude Enablement
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
              Session Timer
            </h1>
          </div>
        </header>
        <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 80px" }}>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.55 }}>
            Pick a session format. Timer + phase tracker will guide you through.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {Object.values(FORMATS).map(f => (
              <button key={f.id} onClick={() => pickFormat(f.id)}
                style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: 20, cursor: "pointer", textAlign: "left",
                  fontFamily: FONT, transition: "all 150ms",
                  boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,23,42,0.10)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)";
                }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.navy, letterSpacing: "-0.02em", fontFamily: FONT_MONO }}>
                    {f.duration}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, fontFamily: FONT_MONO, fontWeight: 500 }}>min</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>{f.description}</div>
                <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, letterSpacing: "0.04em" }}>
                  {f.phases.length} PHASES →
                </div>
              </button>
            ))}
          </div>
          <footer style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>
            INT CLAUDE ENABLEMENT · SESSION TIMER v1.0
          </footer>
        </main>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // Active session view
  // ───────────────────────────────────────────────────────────────────
  const fmt = FORMATS[format];
  const totalSeconds = fmt.duration * 60;
  const elapsedMin = elapsed / 60;
  const overrun = elapsed > totalSeconds;
  const progressPct = Math.min(100, (elapsed / totalSeconds) * 100);

  // Determine current phase
  const currentPhaseIdx = fmt.phases.findIndex(p => elapsedMin >= p.start && elapsedMin < p.end);
  const currentPhase = currentPhaseIdx >= 0 ? fmt.phases[currentPhaseIdx] : null;

  // Time remaining in current phase
  const phaseRemainingMin = currentPhase ? currentPhase.end - elapsedMin : 0;
  const phaseDurationMin = currentPhase ? currentPhase.end - currentPhase.start : 0;
  const phaseProgressPct = currentPhase ? ((elapsedMin - currentPhase.start) / phaseDurationMin) * 100 : 0;
  const phaseWarning = currentPhase && phaseProgressPct > 80;
  const phaseOverrun = currentPhase && phaseProgressPct > 100;

  const allNonNeg = NON_NEGOTIABLES.every(n => nonNeg[n.id]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy, paddingBottom: 120 }}>
      {/* HEADER */}
      <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "16px 32px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => pickFormat(null)}
              style={{
                background: "transparent", border: `1px solid #334155`, borderRadius: 4,
                padding: "5px 10px", color: "#cbd5e1", cursor: "pointer", fontSize: 12,
                fontFamily: FONT,
              }}>← Format</button>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase" }}>
                {fmt.label} · {fmt.duration} min
              </div>
              <input value={employeeName} onChange={e => setEmployeeName(e.target.value)}
                placeholder="Employee name (optional)"
                style={{
                  background: "transparent", border: "none", color: "#fff",
                  fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: "2px 0",
                  outline: "none", width: 240, marginTop: 2,
                }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={reset}
              style={{
                background: "transparent", border: "1px solid #334155", borderRadius: 4,
                padding: "8px 14px", color: "#cbd5e1", cursor: "pointer",
                fontSize: 12, fontFamily: FONT, fontWeight: 500,
              }}>Reset</button>
            <button onClick={endSession}
              style={{
                background: C.blocked, border: "none", borderRadius: 4,
                padding: "8px 14px", color: "#fff", cursor: "pointer",
                fontSize: 12, fontFamily: FONT, fontWeight: 600,
              }}>End</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 32px" }}>

        {/* TIMER DISPLAY */}
        <div style={{
          background: C.surface, border: `1px solid ${overrun ? C.blocked : C.border}`,
          borderRadius: 8, padding: 24, marginBottom: 16, position: "relative",
          boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
                Elapsed
              </div>
              <div style={{
                fontSize: 56, fontWeight: 700, fontFamily: FONT_MONO, letterSpacing: "-0.02em",
                color: overrun ? C.blocked : C.navy, lineHeight: 1,
              }}>
                {formatTime(elapsed)}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFamily: FONT_MONO }}>
                of {formatTime(totalSeconds)} total {overrun && <span style={{ color: C.blocked, fontWeight: 600 }}>· OVER</span>}
              </div>
            </div>
            <button onClick={toggleRun}
              style={{
                background: running ? C.warning : C.accent, color: "#fff",
                border: "none", borderRadius: 999, padding: "16px 32px",
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
                letterSpacing: "0.04em", boxShadow: running
                  ? `0 0 0 4px ${C.warning}33`
                  : `0 0 0 4px ${C.accent}33`,
                transition: "all 150ms",
              }}>
              {running ? "⏸ PAUSE" : elapsed === 0 ? "▶ START" : "▶ RESUME"}
            </button>
          </div>
          {/* Overall progress bar */}
          <div style={{ marginTop: 20, height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progressPct}%`,
              background: overrun ? C.blocked : C.primary,
              transition: "width 1s linear",
            }} />
          </div>
        </div>

        {/* CURRENT PHASE — sticky highlight */}
        {currentPhase && (
          <div style={{
            background: phaseOverrun ? "#fee2e2" : phaseWarning ? "#fef3c7" : C.surface,
            border: `2px solid ${phaseOverrun ? C.blocked : phaseWarning ? C.warning : C.primary}`,
            borderRadius: 6, padding: "16px 18px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: phaseOverrun ? C.blocked : phaseWarning ? C.warning : C.primary, marginBottom: 4 }}>
                  Current phase {phaseOverrun ? "· OVER" : phaseWarning ? "· WRAPPING UP" : ""}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
                  {currentPhase.name}
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  {currentPhase.detail}
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: FONT_MONO }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Remaining</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: phaseOverrun ? C.blocked : C.navy, letterSpacing: "-0.01em" }}>
                  {phaseRemainingMin > 0 ? `${Math.ceil(phaseRemainingMin)}m` : "0m"}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${Math.min(100, phaseProgressPct)}%`,
                background: phaseOverrun ? C.blocked : phaseWarning ? C.warning : C.primary,
                transition: "width 1s linear",
              }} />
            </div>
          </div>
        )}

        {/* PHASE LIST */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
          {fmt.phases.map((p, i) => {
            const passed = elapsedMin >= p.end;
            const active = i === currentPhaseIdx;
            return (
              <div key={i} style={{
                padding: "11px 16px", borderBottom: i < fmt.phases.length - 1 ? `1px solid ${C.border}` : "none",
                background: active ? "#eff6ff" : passed ? "#fafbfc" : C.surface,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  background: passed ? C.done : active ? C.primary : "#e2e8f0",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, fontFamily: FONT_MONO,
                }}>
                  {passed ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? C.navy : passed ? C.muted : C.navy,
                    textDecoration: passed ? "line-through" : "none",
                  }}>
                    {p.name}
                  </div>
                  {active && (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>
                      {p.detail}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: C.muted, flexShrink: 0, textAlign: "right" }}>
                  {p.start}–{p.end}m
                </div>
              </div>
            );
          })}
        </div>

        {/* CUTS NOTE */}
        <div style={{
          background: "#fef3c7", border: `1px solid ${C.warning}55`, borderLeft: `3px solid ${C.warning}`,
          borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#78350f", lineHeight: 1.5,
        }}>
          <strong>If running over:</strong> {fmt.cuts}
        </div>

        {/* STOP CRITERIA */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 16 }}>
          <button onClick={() => setShowStopCriteria(s => !s)}
            style={{
              width: "100%", textAlign: "left", background: "transparent",
              border: "none", padding: "12px 16px", cursor: "pointer",
              fontFamily: FONT, fontSize: 13, color: C.navy, fontWeight: 600,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
            <span>When to stop and reschedule</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{showStopCriteria ? "−" : "+"}</span>
          </button>
          {showStopCriteria && (
            <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${C.border}` }}>
              <ul style={{ margin: "12px 0 0 0", padding: 0, listStyle: "none" }}>
                {STOP_CRITERIA.map((s, i) => (
                  <li key={i} style={{
                    padding: "8px 0", fontSize: 13, color: C.navy, lineHeight: 1.5,
                    borderBottom: i < STOP_CRITERIA.length - 1 ? `1px dashed ${C.border}` : "none",
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <span style={{ color: C.blocked, fontWeight: 700, flexShrink: 0 }}>✕</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* STICKY NON-NEGOTIABLES BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: C.navy, borderTop: `3px solid ${allNonNeg ? C.done : C.accent}`,
        padding: "12px 32px", zIndex: 100,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.15)",
      }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: allNonNeg ? C.done : C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Non-negotiables {allNonNeg && "· ALL DONE"}
            </div>
            <div style={{ display: "flex", gap: 16, flex: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {NON_NEGOTIABLES.map(n => {
                const checked = !!nonNeg[n.id];
                return (
                  <label key={n.id} style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    fontSize: 12, color: checked ? "#cbd5e1" : "#94a3b8",
                    textDecoration: checked ? "line-through" : "none",
                  }}>
                    <input type="checkbox" checked={checked}
                      onChange={() => setNonNeg(s => ({ ...s, [n.id]: !s[n.id] }))}
                      style={{ width: 16, height: 16, accentColor: C.accent, cursor: "pointer" }} />
                    {n.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
