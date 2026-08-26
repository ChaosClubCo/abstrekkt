/**
 * Session Timer v2.0
 * INT Claude Enablement — facilitator-facing
 *
 * Upgrades over v1:
 *   - Persistent timer state (start timestamp pattern, survives reload)
 *   - Phase manual navigation (prev/next with confirm)
 *   - document.title updates (visible from claude.ai tab)
 *   - Audio cues via Web Audio API (no assets, mutable)
 *   - Live notes stream with relative-time stamps
 *   - Past sessions view with stats
 *   - Keyboard shortcuts (space=play/pause, n=next phase, b=back phase)
 *
 * Storage:
 *   "timer-state-v1" → in-progress session: {format, startedAt, pausedElapsed, paused, ...}
 *   "timer-log-v1"   → completed sessions array (extended with notes)
 */

import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  primary: "#156082", accent: "#E97132", navy: "#0E2841", done: "#15803d",
  muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  active: "#7c3aed", blocked: "#dc2626", warning: "#d97706",
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const FORMATS = {
  express: {
    id: "express", label: "Express", duration: 30,
    description: "Tech-savvy employee. Setup focus only.",
    phases: [
      { name: "Login + Plan check",       start: 0,  end: 3,  detail: "Confirm Pro, not Free." },
      { name: "Projects setup",           start: 3,  end: 12, detail: "Name, write 3-line instructions, test." },
      { name: "Prompt package delivery",  start: 12, end: 20, detail: "Walk through 2–3 prompts, run one live." },
      { name: "QC gate",                  start: 20, end: 27, detail: "Run q1–q4 only (critical items)." },
      { name: "Next session",             start: 27, end: 30, detail: "Set date + #1 use case." },
    ],
    cuts: "Memory, connectors, advanced features deferred to session 2.",
  },
  standard: {
    id: "standard", label: "Standard", duration: 60,
    description: "Most employees. Recommended default.",
    phases: [
      { name: "Intake review",            start: 0,  end: 3,  detail: "Role, goals, current pain points." },
      { name: "Login + Plan check",       start: 3,  end: 7,  detail: "Address upgrade path if Free." },
      { name: "Mental model — Projects",  start: 7,  end: 12, detail: "'Claude has amnesia without a Project.' Demo." },
      { name: "Projects setup",           start: 12, end: 25, detail: "Make-or-break phase. Don't rush." },
      { name: "Memory configuration",     start: 25, end: 30, detail: "Enable, write 3 memory edits live." },
      { name: "Prompt package delivery",  start: 30, end: 45, detail: "All 6 prompts, run 2 live." },
      { name: "Connector setup",          start: 45, end: 52, detail: "Connect 1 relevant tool." },
      { name: "QC gate + gaps",           start: 52, end: 58, detail: "All 7 items. Log fails as gaps." },
      { name: "Next session",             start: 58, end: 60, detail: "Confirm #1 weekly use case." },
    ],
    cuts: "If behind by Memory phase: cut connectors, not Projects.",
  },
  full: {
    id: "full", label: "Full", duration: 90,
    description: "Skeptics, execs, complex use cases.",
    phases: [
      { name: "Intake deep-dive",         start: 0,  end: 5,  detail: "Role, goals, pain points, tool stack." },
      { name: "Login + Plan check",       start: 5,  end: 10, detail: "If exec: address Team/Enterprise path." },
      { name: "Mental model — full demo", start: 10, end: 18, detail: "Before/after demo without vs. with setup." },
      { name: "Projects setup",           start: 18, end: 33, detail: "Detailed instructions. Iterate." },
      { name: "Memory configuration",     start: 33, end: 40, detail: "Enable, write 5 edits, verify." },
      { name: "Prompt package delivery",  start: 40, end: 58, detail: "All 6, run 3 live, customize 1 together." },
      { name: "Connector setup",          start: 58, end: 68, detail: "Connect 2–3 tools, test 1 live." },
      { name: "Advanced feature preview", start: 68, end: 78, detail: "Artifacts, Deep Research, or extended thinking." },
      { name: "QC gate",                  start: 78, end: 86, detail: "All 7 items. Fails → next session agenda." },
      { name: "Next session",             start: 86, end: 90, detail: "Set date + 3-week focus plan." },
    ],
    cuts: "Don't default to Full — only when skepticism or complex use case is real.",
  },
};

const NON_NEGOTIABLES = [
  { id: "n1", label: "Project with working custom instructions (tested)" },
  { id: "n2", label: "One prompt package prompt run live" },
  { id: "n3", label: "Next session date confirmed (on calendar)" },
];

const STOP_CRITERIA = [
  "Employee on Free plan + can't or won't upgrade — nothing material can be set up",
  "claude.ai blocked by corporate proxy — IT must fix first",
  "Employee actively disengaged or hostile — pause, flag to manager, resume later",
  "Session 20% over time with major phases unfinished — better two clean than one rushed",
];

// ─── COMPONENT ─────────────────────────────────────────────────────

export default function SessionTimer() {
  // Session state (persisted)
  const [format, setFormat] = useState(null);
  const [startedAt, setStartedAt] = useState(null);   // ms timestamp when current run started
  const [pausedElapsed, setPausedElapsed] = useState(0); // accumulated seconds at start of current run
  const [paused, setPaused] = useState(true);
  const [employeeName, setEmployeeName] = useState("");
  const [nonNeg, setNonNeg] = useState({});
  const [phaseOverride, setPhaseOverride] = useState(null); // null | seconds offset for manual nav
  const [notes, setNotes] = useState([]);             // [{tAt, text}]

  // Local UI state
  const [view, setView] = useState("session"); // formatPicker | session | history
  const [tick, setTick] = useState(0);
  const [showStopCriteria, setShowStopCriteria] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [audioOn, setAudioOn] = useState(true);
  const [history, setHistory] = useState([]);
  const audioCtxRef = useRef(null);
  const lastWarnedPhaseRef = useRef({ idx: -1, kind: null });
  const noteInputRef = useRef(null);

  // ── Init: restore state ──
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("timer-state-v1");
        if (r) {
          const s = JSON.parse(r.value);
          if (s.format) {
            setFormat(s.format);
            setStartedAt(s.startedAt || null);
            setPausedElapsed(s.pausedElapsed || 0);
            setPaused(s.paused !== false);
            setEmployeeName(s.employeeName || "");
            setNonNeg(s.nonNeg || {});
            setPhaseOverride(s.phaseOverride ?? null);
            setNotes(s.notes || []);
            setView("session");
            return;
          }
        }
      } catch (e) { /* fresh */ }
      setView("formatPicker");
    })();
  }, []);

  // ── Tick ──
  useEffect(() => {
    if (!format || paused) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [format, paused]);

  // ── Compute elapsed ──
  const elapsed = !format ? 0
    : paused ? pausedElapsed
    : pausedElapsed + Math.floor((Date.now() - (startedAt || Date.now())) / 1000);

  // ── Persist state ──
  const persistState = useCallback(async (override) => {
    if (!format) return;
    const state = {
      format, startedAt, pausedElapsed, paused, employeeName, nonNeg, phaseOverride, notes,
      ...override,
    };
    try { await window.storage.set("timer-state-v1", JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, [format, startedAt, pausedElapsed, paused, employeeName, nonNeg, phaseOverride, notes]);

  useEffect(() => { persistState(); }, [persistState]);

  // ── History load ──
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("timer-log-v1");
        if (r) setHistory(JSON.parse(r.value) || []);
      } catch (e) { /* ignore */ }
    })();
  }, [view]);

  // ── Format picker ──
  function pickFormat(id) {
    setFormat(id); setStartedAt(null); setPausedElapsed(0); setPaused(true);
    setNonNeg({}); setPhaseOverride(null); setNotes([]); setView("session");
    lastWarnedPhaseRef.current = { idx: -1, kind: null };
  }

  function clearSession() {
    setFormat(null); setStartedAt(null); setPausedElapsed(0); setPaused(true);
    setEmployeeName(""); setNonNeg({}); setPhaseOverride(null); setNotes([]);
    setView("formatPicker");
    window.storage.delete?.("timer-state-v1").catch(() => {});
  }

  // ── Run controls ──
  function toggleRun() {
    if (paused) {
      // Resume / start
      setStartedAt(Date.now());
      setPaused(false);
      ensureAudio();
    } else {
      // Pause: bank elapsed, freeze
      setPausedElapsed(elapsed);
      setStartedAt(null);
      setPaused(true);
    }
  }
  function resetTimer() {
    if (!confirm("Reset elapsed time and non-negotiables?")) return;
    setStartedAt(null); setPausedElapsed(0); setPaused(true);
    setNonNeg({}); setPhaseOverride(null); setNotes([]);
    lastWarnedPhaseRef.current = { idx: -1, kind: null };
  }

  async function endSession() {
    if (!format) return;
    if (!confirm("End and log this session?")) return;
    const fmt = FORMATS[format];
    const allDone = NON_NEGOTIABLES.every(n => nonNeg[n.id]);
    const record = {
      id: Date.now(),
      endedAt: new Date().toISOString(),
      format,
      formatLabel: fmt.label,
      plannedDuration: fmt.duration * 60,
      actualDuration: elapsed,
      employeeName: employeeName || "(unnamed)",
      nonNegotiables: { ...nonNeg },
      notes: [...notes],
      completion: allDone ? "complete" : "needs-followup",
    };
    try {
      const r = await window.storage.get("timer-log-v1");
      const log = r ? JSON.parse(r.value) : [];
      log.unshift(record);
      await window.storage.set("timer-log-v1", JSON.stringify(log.slice(0, 50)));
      setHistory(log.slice(0, 50));
    } catch (e) { /* ignore */ }
    clearSession();
  }

  // ── Phase derivation ──
  const fmt = format ? FORMATS[format] : null;
  const elapsedMin = elapsed / 60;
  const totalSeconds = fmt ? fmt.duration * 60 : 0;
  const overrun = elapsed > totalSeconds;
  const overallProgress = totalSeconds ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;

  const naturalIdx = fmt ? fmt.phases.findIndex(p => elapsedMin >= p.start && elapsedMin < p.end) : -1;
  const currentPhaseIdx = phaseOverride != null ? phaseOverride : naturalIdx;
  const currentPhase = fmt && currentPhaseIdx >= 0 && currentPhaseIdx < fmt.phases.length
    ? fmt.phases[currentPhaseIdx] : null;

  function phaseTimeRemaining() {
    if (!currentPhase) return 0;
    if (phaseOverride != null) {
      // In override mode, show full phase duration (we don't know real elapsed in this phase)
      return currentPhase.end - currentPhase.start;
    }
    return Math.max(0, currentPhase.end - elapsedMin);
  }
  const phaseRem = phaseTimeRemaining();
  const phaseProgress = currentPhase && phaseOverride == null
    ? Math.min(100, ((elapsedMin - currentPhase.start) / (currentPhase.end - currentPhase.start)) * 100)
    : 0;
  const phaseWarning = phaseProgress > 80 && phaseProgress <= 100;
  const phaseOverrunFlag = phaseProgress > 100;

  // ── Audio cues on phase transitions ──
  useEffect(() => {
    if (!fmt || paused || phaseOverride != null) return;
    if (currentPhaseIdx < 0) return;
    if (phaseWarning && lastWarnedPhaseRef.current.idx === currentPhaseIdx && lastWarnedPhaseRef.current.kind === "warn") return;
    if (phaseOverrunFlag && lastWarnedPhaseRef.current.idx === currentPhaseIdx && lastWarnedPhaseRef.current.kind === "over") return;
    if (phaseWarning && lastWarnedPhaseRef.current.kind !== "warn") {
      beep(880, 0.15);
      lastWarnedPhaseRef.current = { idx: currentPhaseIdx, kind: "warn" };
    } else if (phaseOverrunFlag && lastWarnedPhaseRef.current.kind !== "over") {
      beep(440, 0.3);
      lastWarnedPhaseRef.current = { idx: currentPhaseIdx, kind: "over" };
    } else if (!phaseWarning && !phaseOverrunFlag && lastWarnedPhaseRef.current.idx !== currentPhaseIdx) {
      lastWarnedPhaseRef.current = { idx: currentPhaseIdx, kind: null };
    }
  }, [phaseProgress, currentPhaseIdx, paused, phaseOverride, fmt]);

  function ensureAudio() {
    if (!audioOn) return;
    if (!audioCtxRef.current) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      } catch (e) { /* ignore */ }
    }
  }
  function beep(freq, duration) {
    if (!audioOn || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* ignore */ }
  }

  // ── document.title sync ──
  useEffect(() => {
    if (!fmt) { document.title = "Session Timer · INT"; return; }
    const phaseName = currentPhase ? currentPhase.name : "—";
    const time = formatTime(elapsed);
    document.title = `${paused ? "⏸" : "⏱"} ${time} · ${phaseName} · INT`;
    return () => { document.title = "Session Timer · INT"; };
  }, [fmt, elapsed, currentPhase, paused]);

  // ── Phase navigation ──
  function jumpPhase(delta) {
    if (!fmt) return;
    const target = (phaseOverride != null ? phaseOverride : naturalIdx) + delta;
    if (target < 0 || target >= fmt.phases.length) return;
    setPhaseOverride(target);
  }
  function clearPhaseOverride() { setPhaseOverride(null); }

  // ── Notes ──
  function addNote() {
    const t = noteInput.trim(); if (!t) return;
    setNotes([{ tAt: elapsed, text: t, ts: new Date().toISOString() }, ...notes]);
    setNoteInput("");
  }
  function deleteNote(i) { setNotes(notes.filter((_, idx) => idx !== i)); }

  // ── Keyboard shortcuts ──
  useEffect(() => {
    function onKey(e) {
      // Don't fire when typing in inputs/textareas
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (view !== "session" || !fmt) return;
      if (e.key === " ") { e.preventDefault(); toggleRun(); }
      else if (e.key === "n" || e.key === "N") { jumpPhase(1); }
      else if (e.key === "b" || e.key === "B") { jumpPhase(-1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ─────────────────────────────────────────────────────────────────
  // FORMAT PICKER
  // ─────────────────────────────────────────────────────────────────
  if (view === "formatPicker") {
    return (
      <Frame title="Session Timer" rightSlot={
        <BtnSecondary dark onClick={() => setView("history")}>History ({history.length})</BtnSecondary>
      }>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.55 }}>
          Pick a session format. Timer + phase tracker will guide you through.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {Object.values(FORMATS).map(f => (
            <button key={f.id} onClick={() => pickFormat(f.id)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: 20, cursor: "pointer", textAlign: "left", fontFamily: FONT,
                transition: "all 150ms", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,23,42,0.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)"; }}>
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
      </Frame>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────────
  if (view === "history") {
    const totalSessions = history.length;
    const completeCount = history.filter(h => h.completion === "complete").length;
    const completeRate = totalSessions ? Math.round((completeCount / totalSessions) * 100) : 0;
    const avgOverrun = totalSessions
      ? Math.round(history.reduce((acc, h) => acc + Math.max(0, h.actualDuration - h.plannedDuration), 0) / totalSessions / 60 * 10) / 10
      : 0;

    return (
      <Frame title="Past sessions" rightSlot={
        <BtnSecondary dark onClick={() => setView(format ? "session" : "formatPicker")}>
          ← Back
        </BtnSecondary>
      }>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
          <Stat label="Sessions logged" value={totalSessions} />
          <Stat label="Completion rate" value={`${completeRate}%`} accent />
          <Stat label="Avg overrun" value={`${avgOverrun} min`} warn={avgOverrun > 5} />
        </div>
        {history.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
            padding: 32, textAlign: "center", fontSize: 13, color: C.muted }}>
            No sessions logged yet. Run and end a session to see history.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map(h => {
              const fmtRec = FORMATS[h.format];
              const overrunSec = h.actualDuration - h.plannedDuration;
              const nonNegCount = NON_NEGOTIABLES.filter(n => h.nonNegotiables?.[n.id]).length;
              return (
                <div key={h.id} style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{h.employeeName}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
                        letterSpacing: "0.06em", fontFamily: FONT_MONO,
                        background: h.completion === "complete" ? "#dcfce7" : "#fee2e2",
                        color: h.completion === "complete" ? "#14532d" : "#7f1d1d",
                      }}>
                        {h.completion === "complete" ? "COMPLETE" : "FOLLOWUP"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT_MONO, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span>{fmtRec?.label || h.format}</span>
                      <span>{formatTime(h.actualDuration)} / {formatTime(h.plannedDuration)}</span>
                      <span style={{ color: overrunSec > 0 ? C.warning : C.muted }}>
                        {overrunSec > 0 ? `+${Math.ceil(overrunSec / 60)}m over` : `${Math.floor(-overrunSec / 60)}m under`}
                      </span>
                      <span>{nonNegCount}/3 non-neg</span>
                      <span>{new Date(h.endedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {h.notes && h.notes.length > 0 && (
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT_MONO,
                      background: "#f1f5f9", padding: "4px 10px", borderRadius: 3 }}>
                      {h.notes.length} note{h.notes.length === 1 ? "" : "s"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Frame>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // SESSION VIEW
  // ─────────────────────────────────────────────────────────────────
  const allNonNeg = NON_NEGOTIABLES.every(n => nonNeg[n.id]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy, paddingBottom: 120 }}>
      <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "16px 32px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={clearSession}
              style={{ background: "transparent", border: `1px solid #334155`, borderRadius: 4,
                padding: "5px 10px", color: "#cbd5e1", cursor: "pointer", fontSize: 12, fontFamily: FONT }}>
              ← Format
            </button>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase" }}>
                {fmt.label} · {fmt.duration} min
              </div>
              <input value={employeeName} onChange={e => setEmployeeName(e.target.value)}
                placeholder="Employee name (optional)"
                style={{ background: "transparent", border: "none", color: "#fff",
                  fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: "2px 0",
                  outline: "none", width: 240, marginTop: 2 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => { setAudioOn(a => !a); ensureAudio(); }} title={audioOn ? "Mute alerts" : "Enable alerts"}
              style={{ background: "transparent", border: "1px solid #334155", borderRadius: 4,
                padding: "8px 12px", color: audioOn ? C.accent : "#94a3b8", cursor: "pointer",
                fontSize: 14, fontFamily: FONT }}>
              {audioOn ? "🔔" : "🔕"}
            </button>
            <button onClick={() => setView("history")}
              style={{ background: "transparent", border: "1px solid #334155", borderRadius: 4,
                padding: "8px 14px", color: "#cbd5e1", cursor: "pointer",
                fontSize: 12, fontFamily: FONT, fontWeight: 500 }}>History</button>
            <button onClick={resetTimer}
              style={{ background: "transparent", border: "1px solid #334155", borderRadius: 4,
                padding: "8px 14px", color: "#cbd5e1", cursor: "pointer",
                fontSize: 12, fontFamily: FONT, fontWeight: 500 }}>Reset</button>
            <button onClick={endSession}
              style={{ background: C.blocked, border: "none", borderRadius: 4,
                padding: "8px 14px", color: "#fff", cursor: "pointer",
                fontSize: 12, fontFamily: FONT, fontWeight: 600 }}>End</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 32px" }}>
        {/* TIMER DISPLAY */}
        <div style={{
          background: C.surface, border: `1px solid ${overrun ? C.blocked : C.border}`,
          borderRadius: 8, padding: 24, marginBottom: 16,
          boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
                Elapsed {paused && elapsed > 0 && <span style={{ color: C.warning, marginLeft: 4 }}>· PAUSED</span>}
              </div>
              <div style={{ fontSize: 56, fontWeight: 700, fontFamily: FONT_MONO, letterSpacing: "-0.02em",
                color: overrun ? C.blocked : C.navy, lineHeight: 1 }}>
                {formatTime(elapsed)}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFamily: FONT_MONO }}>
                of {formatTime(totalSeconds)} total {overrun && <span style={{ color: C.blocked, fontWeight: 600 }}>· OVER</span>}
              </div>
            </div>
            <button onClick={toggleRun}
              style={{ background: !paused ? C.warning : C.accent, color: "#fff",
                border: "none", borderRadius: 999, padding: "16px 32px",
                fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
                letterSpacing: "0.04em",
                boxShadow: !paused ? `0 0 0 4px ${C.warning}33` : `0 0 0 4px ${C.accent}33`,
                transition: "all 150ms" }}>
              {!paused ? "⏸ PAUSE" : elapsed === 0 ? "▶ START" : "▶ RESUME"}
            </button>
          </div>
          <div style={{ marginTop: 20, height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overallProgress}%`,
              background: overrun ? C.blocked : C.primary, transition: "width 1s linear" }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: C.muted, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>
            SHORTCUTS · SPACE play/pause · N next phase · B prev phase
          </div>
        </div>

        {/* CURRENT PHASE */}
        {currentPhase && (
          <div style={{
            background: phaseOverrunFlag ? "#fee2e2" : phaseWarning ? "#fef3c7" : C.surface,
            border: `2px solid ${phaseOverrunFlag ? C.blocked : phaseWarning ? C.warning : C.primary}`,
            borderRadius: 6, padding: "16px 18px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: phaseOverrunFlag ? C.blocked : phaseWarning ? C.warning : C.primary, marginBottom: 4,
                  display: "flex", gap: 8, alignItems: "center" }}>
                  Current phase
                  {phaseOverrunFlag && <span>· OVER</span>}
                  {phaseWarning && !phaseOverrunFlag && <span>· WRAPPING UP</span>}
                  {phaseOverride != null && <span style={{ color: C.muted }}>· MANUAL</span>}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
                  {currentPhase.name}
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{currentPhase.detail}</div>
              </div>
              <div style={{ textAlign: "right", fontFamily: FONT_MONO }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Remaining</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: phaseOverrunFlag ? C.blocked : C.navy, letterSpacing: "-0.01em" }}>
                  {phaseRem > 0 ? `${Math.ceil(phaseRem)}m` : "0m"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => jumpPhase(-1)} disabled={currentPhaseIdx <= 0}
                style={navBtn(currentPhaseIdx <= 0)}>◀ Prev phase</button>
              <button onClick={() => jumpPhase(1)} disabled={currentPhaseIdx >= fmt.phases.length - 1}
                style={navBtn(currentPhaseIdx >= fmt.phases.length - 1)}>Next phase ▶</button>
              {phaseOverride != null && (
                <button onClick={clearPhaseOverride} style={{
                  background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "5px 10px", fontSize: 11, color: C.muted, cursor: "pointer", fontFamily: FONT,
                }}>↺ Sync to elapsed</button>
              )}
            </div>
            {phaseOverride == null && (
              <div style={{ marginTop: 12, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, phaseProgress)}%`,
                  background: phaseOverrunFlag ? C.blocked : phaseWarning ? C.warning : C.primary,
                  transition: "width 1s linear" }} />
              </div>
            )}
          </div>
        )}

        {/* PHASE LIST */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
          {fmt.phases.map((p, i) => {
            const passed = elapsedMin >= p.end;
            const active = i === currentPhaseIdx;
            return (
              <button key={i} onClick={() => setPhaseOverride(i)}
                style={{
                  width: "100%", textAlign: "left", padding: "11px 16px",
                  borderBottom: i < fmt.phases.length - 1 ? `1px solid ${C.border}` : "none",
                  background: active ? "#eff6ff" : passed ? "#fafbfc" : C.surface,
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
                  fontFamily: FONT,
                }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  background: passed ? C.done : active ? C.primary : "#e2e8f0",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, fontFamily: FONT_MONO }}>
                  {passed ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? C.navy : passed ? C.muted : C.navy,
                    textDecoration: passed && !active ? "line-through" : "none" }}>
                    {p.name}
                  </div>
                  {active && (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{p.detail}</div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: C.muted, flexShrink: 0, textAlign: "right" }}>
                  {p.start}–{p.end}m
                </div>
              </button>
            );
          })}
        </div>

        {/* CUTS */}
        <div style={{ background: "#fef3c7", border: `1px solid ${C.warning}55`, borderLeft: `3px solid ${C.warning}`,
          borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
          <strong>If running over:</strong> {fmt.cuts}
        </div>

        {/* NOTES */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
            Live notes <span style={{ color: C.muted, fontWeight: 400, fontSize: 11, marginLeft: 6 }}>· timestamped to elapsed time, saved with session</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: notes.length > 0 ? 12 : 0 }}>
            <input ref={noteInputRef} value={noteInput} onChange={e => setNoteInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addNote(); } }}
              placeholder="Observation, blocker, follow-up... (Enter to add)"
              style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addNote}
              style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 4,
                padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              Add
            </button>
          </div>
          {notes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {notes.map((n, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "8px 10px", borderRadius: 4,
                  background: "#fafbfc", border: `1px solid ${C.border}`, fontSize: 13,
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.primary,
                    fontWeight: 600, flexShrink: 0, paddingTop: 2 }}>
                    {formatTime(n.tAt)}
                  </span>
                  <span style={{ flex: 1, color: C.navy, lineHeight: 1.4 }}>{n.text}</span>
                  <button onClick={() => deleteNote(i)} title="Delete note"
                    style={{ background: "transparent", border: "none", color: C.muted,
                      cursor: "pointer", fontSize: 14, padding: "0 4px" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STOP CRITERIA */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 16 }}>
          <button onClick={() => setShowStopCriteria(s => !s)}
            style={{ width: "100%", textAlign: "left", background: "transparent", border: "none",
              padding: "12px 16px", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: C.navy,
              fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>When to stop and reschedule</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{showStopCriteria ? "−" : "+"}</span>
          </button>
          {showStopCriteria && (
            <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${C.border}` }}>
              <ul style={{ margin: "12px 0 0 0", padding: 0, listStyle: "none" }}>
                {STOP_CRITERIA.map((s, i) => (
                  <li key={i} style={{ padding: "8px 0", fontSize: 13, color: C.navy, lineHeight: 1.5,
                    borderBottom: i < STOP_CRITERIA.length - 1 ? `1px dashed ${C.border}` : "none",
                    display: "flex", gap: 10, alignItems: "flex-start" }}>
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

// ─── SHARED ────────────────────────────────────────────────────────

function Frame({ title, rightSlot, children }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy }}>
      <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "20px 32px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              INT Claude Enablement
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
              {title}
            </h1>
          </div>
          {rightSlot}
        </div>
      </header>
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 80px" }}>{children}</main>
      <footer style={{ maxWidth: 980, margin: "32px auto 0", padding: "16px 32px",
        borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted,
        fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>
        INT CLAUDE ENABLEMENT · SESSION TIMER v2.0
      </footer>
    </div>
  );
}

function Stat({ label, value, accent, warn }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: FONT_MONO, letterSpacing: "-0.01em",
        color: warn ? C.warning : accent ? C.accent : C.navy }}>
        {value}
      </div>
    </div>
  );
}

function BtnSecondary({ children, onClick, dark }) {
  return (
    <button onClick={onClick}
      style={{ background: "transparent", border: `1px solid ${dark ? "#334155" : C.border}`,
        borderRadius: 4, padding: "7px 14px", fontSize: 12, fontWeight: 500,
        color: dark ? "#cbd5e1" : C.navy, cursor: "pointer", fontFamily: FONT }}>
      {children}
    </button>
  );
}

function navBtn(disabled) {
  return {
    background: disabled ? "#f1f5f9" : "#fff", border: `1px solid ${C.border}`, borderRadius: 4,
    padding: "5px 10px", fontSize: 11, fontWeight: 600, color: disabled ? C.muted : C.navy,
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: FONT, letterSpacing: "0.04em",
    opacity: disabled ? 0.6 : 1,
  };
}

const inputStyle = {
  boxSizing: "border-box", background: "#fff", border: `1px solid ${C.border}`,
  borderRadius: 4, padding: "9px 12px", fontSize: 13, fontFamily: FONT, color: C.navy,
  transition: "border-color 120ms", outline: "none",
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
