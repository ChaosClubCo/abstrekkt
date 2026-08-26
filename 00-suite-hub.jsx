/**
 * Claude Enablement Suite — Hub v1.1
 * Design system: Reading Room at Midnight — Variant B (Dashboard)
 *
 * Fonts: Playfair Display / IBM Plex Sans / IBM Plex Mono
 * All color, typography, and spacing from the canonical design system.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:       "#0c0c0b",
  surface:  "#111110",
  card:     "#181815",
  border:   "#232320",
  borderHi: "#303030",
  accent:   "#d4893a",
  accentHi: "#e8a050",
  text:     "#ddd8ce",
  text2:    "#807c74",
  text3:    "#3a3835",
  mono:     "#7ab878",
  mono2:    "#78afc8",
  red:      "#c05050",
  green:    "#5a9c5a",
  tag:      "#1e1e1a",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: rgba(212,137,58,0.25); color: #ddd8ce; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0c0c0b; }
  ::-webkit-scrollbar-thumb { background: #303030; border-radius: 3px; }
`;

// ─── NOTION CONFIG ────────────────────────────────────────────────────────────
const TRAINING_HUB_PAGE_ID = "32eea14f-b167-8142-80e4-e8542f1936ff";
const NOTION_MCP_URL = "https://mcp.notion.com/mcp";

// ─── SUITE TOOLS ──────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "flowchart",  num: "00", title: "Enablement Flowchart",   subtitle: "Real-time session tracker",          role: "facilitator", storageKey: "claude-enablement-v1",  syncs: false, when: "During every session" },
  { id: "intake",     num: "01", title: "Pre-Session Intake",      subtitle: "Employee profile + session brief",    role: "facilitator", storageKey: "intake-records-v1",     syncs: true,  when: "Before every session" },
  { id: "packages",   num: "02", title: "Prompt Package Builder",  subtitle: "Generate tailored prompt packages",   role: "facilitator", storageKey: "prompt-packages-v1",    syncs: false, when: "Before / during session" },
  { id: "self_setup", num: "03", title: "Self-Service Setup",      subtitle: "Employee-facing setup checklist",     role: "employee",    storageKey: "self-setup-v1",         syncs: false, when: "Employee bookmarks post-session" },
  { id: "outcomes",   num: "04", title: "Outcome Tracker",         subtitle: "Session results + cohort dashboard",  role: "facilitator", storageKey: "outcome-records-v1",    syncs: true,  when: "After every session" },
  { id: "checkins",   num: "05", title: "Accountability Tracker",  subtitle: "Weekly employee check-ins",           role: "employee",    storageKey: "checkin-records-v1",    syncs: true,  when: "Weekly, between sessions" },
  { id: "objections", num: "06", title: "Objection Handler",       subtitle: "Q&A library + AI for live pushback",  role: "facilitator", storageKey: null,                    syncs: false, when: "During session, on demand" },
  { id: "report",     num: "07", title: "Program Health Report",   subtitle: "AI stakeholder report generator",     role: "facilitator", storageKey: null,                    syncs: false, when: "Weekly / stakeholder updates" },
];

// ─── STATUS & COLOR MAPS ─────────────────────────────────────────────────────
const STATUS_COLOR  = { "Completed": "#5a9c5a", "In Progress": "#78afc8", "Scheduled": "#78afc8", "Needs Follow-up": "#d4893a", "No Show": "#c05050" };
const PLAN_COLOR    = { free: "#3a3835", pro: "#78afc8", max: "#d4893a", team: "#7ab878", enterprise: "#807c74", unknown: "#3a3835" };
const SYNC_COLOR    = { idle: "#3a3835", syncing: "#78afc8", done: "#5a9c5a", error: "#c05050" };
const SYNC_LABEL    = { idle: "not synced", syncing: "syncing", done: "synced", error: "error" };
const SYNC_GLYPH    = { idle: "◇", syncing: "◌", done: "◆", error: "✗" };
const FREQ_COLOR    = { daily: "#5a9c5a", few_week: "#5a9c5a", once_week: "#78afc8", once_few: "#d4893a", not_yet: "#c05050" };
const FREQ_GLYPH    = { daily: "◆◆◆", few_week: "◆◆", once_week: "◆", once_few: "◇", not_yet: "—" };
const URGENCY_COLOR = { start: "#d4893a", action: "#d4893a", warning: "#c05050", nudge: "#78afc8", info: "#78afc8", good: "#5a9c5a" };

// ─── WHAT'S NEXT ENGINE ───────────────────────────────────────────────────────
function computeNext({ intakes, outcomes, checkins, packages }) {
  if (!intakes.length)
    return { urgency: "start",   flag: "01", title: "Begin with intake", desc: "No employee profiles yet — capture the first employee before their session." };
  const unmatched = intakes.filter(i => !outcomes.find(o => o.employeeName === i.name));
  if (unmatched.length)
    return { urgency: "action",  flag: "04", title: `${unmatched.length} intake${unmatched.length > 1 ? "s" : ""} without a logged outcome`, desc: unmatched.map(i => i.name).join(", ") };
  const noPackage = intakes.filter(i => !Object.values(packages).find(p => p.employeeName === i.name));
  if (noPackage.length)
    return { urgency: "action",  flag: "02", title: `${noPackage.length} employee${noPackage.length > 1 ? "s" : ""} without a prompt package`, desc: noPackage.map(i => i.name).join(", ") };
  const followup = outcomes.filter(o => o.status === "Needs Follow-up");
  if (followup.length)
    return { urgency: "warning", flag: "04", title: `${followup.length} session${followup.length > 1 ? "s" : ""} flagged for follow-up`, desc: followup.map(o => `${o.employeeName}${o.openGaps ? ": " + o.openGaps : ""}`).join(" · ") };
  const noCheckin = intakes.filter(i => !checkins.find(c => c.name === i.name));
  if (noCheckin.length)
    return { urgency: "nudge",   flag: "05", title: `${noCheckin.length} employee${noCheckin.length > 1 ? "s" : ""} haven't checked in`, desc: noCheckin.map(i => i.name).join(", ") };
  const upcoming = outcomes.filter(o => { if (!o.nextSessionDate) return false; const d = (new Date(o.nextSessionDate) - new Date()) / 86400000; return d >= 0 && d <= 7; });
  if (upcoming.length)
    return { urgency: "info",    flag: "00", title: `${upcoming.length} session${upcoming.length > 1 ? "s" : ""} this week`, desc: upcoming.map(o => `${o.employeeName} — ${new Date(o.nextSessionDate).toLocaleDateString()}`).join(" · ") };
  return { urgency: "good", flag: "✓", title: "Program up to date", desc: `${intakes.length} employees · ${outcomes.filter(o => o.status === "Completed").length} sessions complete` };
}

// ─── NOTION SYNC ──────────────────────────────────────────────────────────────
function syncPrompt(type, pageId) {
  const names   = { intakes: "Enablement Intakes", outcomes: "Enablement Outcomes", checkins: "Enablement Check-ins" };
  const schemas = {
    intakes:  "Name (title), Role (text), Department (text), Plan (select: free/pro/max/team/enterprise/unknown), Literacy (select: none/casual/regular/power/advanced), Session Date (date), Email (email), First Session (checkbox), Notes (text)",
    outcomes: "Employee (title), Role (text), Plan (select), Session Number (number), Session Date (date), Status (select: Completed/In Progress/Scheduled/Needs Follow-up/No Show), QC Stars Passed (number 0–4), Open Gaps (text), Next Session Date (date), Next Focus (text), Notes (text)",
    checkins: "Name (title), Week Of (date), Frequency (select: daily/few_week/once_week/once_few/not_yet), Confidence (number 1–5), Biggest Win (text), Stuck On (text), Next Goal (text)",
  };
  return `You are a Notion data entry assistant. Use the Notion MCP tool to push records.
Training Hub Page ID: ${pageId}
1. Search for a child database named "${names[type]}". Create it if absent with: ${schemas[type]}
2. For each record, check for a duplicate (same name + date). Skip if found. Create if not.
3. Respond with a plain-text summary: synced count, skipped count, any errors.`;
}

async function pushToNotion(type, records, pageId, signal) {
  if (!records.length) return { ok: true, message: "Nothing to sync." };
  const shape = {
    intakes:  r => ({ name: r.name, role: r.role, department: r.department, plan: r.plan, literacy: r.literacy, sessionDate: r.sessionDate, email: r.email, firstSession: r.firstSession, notes: r.notes }),
    outcomes: r => ({ employee: r.employeeName, role: r.role, plan: r.plan, sessionNumber: r.sessionNumber, sessionDate: r.sessionDate, status: r.status, qcStarsPassed: ["q1","q2","q3","q4"].filter(id => r.qc?.[id] === "pass").length, openGaps: r.openGaps, nextSessionDate: r.nextSessionDate, nextFocus: r.nextSessionFocus, notes: r.notes }),
    checkins: r => ({ name: r.name, weekOf: r.weekOf, frequency: r.frequency, confidence: r.confidence, biggestWin: r.biggestWin, stuckOn: r.stuckOn, nextGoal: r.nextWeekGoal }),
  };
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000,
      system: syncPrompt(type, pageId),
      messages: [{ role: "user", content: `Push these ${type}:\n\n${JSON.stringify(records.map(shape[type]), null, 2)}` }],
      mcp_servers: [{ type: "url", url: NOTION_MCP_URL, name: "notion" }],
    }),
  });
  if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${resp.status}`); }
  const data = await resp.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join(" ") || "Sync complete.";
  return { ok: true, message: text };
}

// ─── ATOM COMPONENTS ─────────────────────────────────────────────────────────
const s = {
  eyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.accent },
  heading: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: T.text },
  mono:    { fontFamily: "'IBM Plex Mono', monospace" },
  sans:    { fontFamily: "'IBM Plex Sans', sans-serif" },
};

function Eyebrow({ children, color, style = {} }) {
  return <div style={{ ...s.eyebrow, color: color || T.accent, ...style }}>{children}</div>;
}

function Mono({ children, size = 11, color, style = {} }) {
  return <span style={{ ...s.mono, fontSize: size, color: color || T.text2, lineHeight: 1, ...style }}>{children}</span>;
}

function Tag({ children, color }) {
  return (
    <span style={{ background: T.tag, border: `1px solid ${T.borderHi}`, borderRadius: 2, ...s.mono, fontSize: 9.5, color: color || T.text2, padding: "2px 7px", letterSpacing: "0.04em", display: "inline-block", lineHeight: 1.6 }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 3, padding: "16px 20px", ...style }}>{children}</div>;
}

function Btn({ children, onClick, disabled, variant = "default" }) {
  const base = { background: "transparent", borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer", ...s.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 14px", transition: "border-color 0.15s, color 0.15s" };
  const variants = {
    default:  { border: `1px solid ${T.borderHi}`, color: disabled ? T.text3 : T.text2 },
    accent:   { border: `1px solid ${T.accent}`,   color: T.accent },
    ghost:    { border: `1px solid ${T.border}`,    color: T.text3 },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...(variants[variant] || variants.default) }}>{children}</button>;
}

function MeterBar({ val, color, h = 2 }) {
  return (
    <div style={{ height: h, background: T.border, borderRadius: 1 }}>
      <div style={{ height: "100%", background: color, width: `${Math.min(100, val)}%`, transition: "width 0.4s" }}/>
    </div>
  );
}

function Rule() {
  return <div style={{ height: 1, background: T.border, margin: "0" }}/>;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function SuiteHub() {
  const [data,       setData]       = useState({ intakes: [], packages: {}, outcomes: [], checkins: [] });
  const [loading,    setLoading]    = useState(true);
  const [syncState,  setSyncState]  = useState({ intakes: "idle", outcomes: "idle", checkins: "idle" });
  const [syncMsg,    setSyncMsg]    = useState({});
  const [syncErr,    setSyncErr]    = useState({});
  const [notionId,   setNotionId]   = useState(TRAINING_HUB_PAGE_ID);
  const [showCfg,    setShowCfg]    = useState(false);
  const [tab,        setTab]        = useState("overview");
  const abortRef = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const keys = ["intake-records-v1","prompt-packages-v1","outcome-records-v1","checkin-records-v1"];
        const rs = await Promise.allSettled(keys.map(k => window.storage.get(k)));
        const [ir, pr, or, cr] = rs.map(r => r.status === "fulfilled" && r.value ? JSON.parse(r.value.value) : null);
        setData({ intakes: ir || [], packages: pr || {}, outcomes: or || [], checkins: cr || [] });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    return () => Object.values(abortRef.current).forEach(a => a?.abort());
  }, []);

  const doSync = useCallback(async (type) => {
    const recs = { intakes: data.intakes, outcomes: data.outcomes, checkins: data.checkins }[type];
    if (!recs?.length) { setSyncMsg(p => ({ ...p, [type]: "Nothing to sync." })); return; }
    setSyncState(p => ({ ...p, [type]: "syncing" }));
    setSyncMsg(p => ({ ...p, [type]: "" }));
    setSyncErr(p => ({ ...p, [type]: "" }));
    abortRef.current[type]?.abort();
    abortRef.current[type] = new AbortController();
    try {
      const res = await pushToNotion(type, recs, notionId, abortRef.current[type].signal);
      setSyncState(p => ({ ...p, [type]: "done" }));
      setSyncMsg(p => ({ ...p, [type]: res.message }));
    } catch (err) {
      if (err.name === "AbortError") return;
      setSyncState(p => ({ ...p, [type]: "error" }));
      setSyncErr(p => ({ ...p, [type]: err.message }));
    }
  }, [data, notionId]);

  const syncAll = useCallback(async () => {
    for (const t of ["intakes","outcomes","checkins"]) await doSync(t);
  }, [doSync]);

  if (loading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Mono color={T.text3} size={11}>loading program data</Mono>
      </div>
    </>
  );

  const { intakes, packages, outcomes, checkins } = data;
  const completed  = outcomes.filter(o => o.status === "Completed").length;
  const onPro      = outcomes.filter(o => ["pro","max","team","enterprise"].includes(o.plan)).length;
  const qcPassed   = outcomes.filter(o => ["q1","q2","q3","q4"].every(id => o.qc?.[id] === "pass")).length;
  const followup   = outcomes.filter(o => o.status === "Needs Follow-up").length;
  const compRate   = outcomes.length ? Math.round(completed / outcomes.length * 100) : 0;
  const proRate    = outcomes.length ? Math.round(onPro    / outcomes.length * 100) : 0;
  const qcRate     = outcomes.length ? Math.round(qcPassed / outcomes.length * 100) : 0;
  const latestCI   = {};
  checkins.forEach(c => { if (!latestCI[c.name]) latestCI[c.name] = c; });
  const active     = Object.values(latestCI).filter(c => c.frequency !== "not_yet").length;
  const empty      = !intakes.length && !outcomes.length && !checkins.length;
  const next       = computeNext(data);
  const nextColor  = URGENCY_COLOR[next.urgency];
  const COUNTS     = { intake: intakes.length, packages: Object.keys(packages).length, outcomes: outcomes.length, checkins: checkins.length };

  const SYNCABLE = [
    { type: "intakes",  label: "Enablement Intakes",   count: intakes.length,  desc: "intake profiles" },
    { type: "outcomes", label: "Enablement Outcomes",  count: outcomes.length, desc: "session records" },
    { type: "checkins", label: "Enablement Check-ins", count: checkins.length, desc: "check-in entries" },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, ...s.sans, fontSize: 13.5, lineHeight: 1.65, color: T.text }}>

        {/* HEADER */}
        <header style={{ padding: "26px 40px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <Eyebrow style={{ marginBottom: 7 }}>Claude Enablement Suite</Eyebrow>
              <div style={{ ...s.heading, fontSize: 24 }}>Program Command Center</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {!empty && [
                { label: "sessions", val: outcomes.length,  color: T.text },
                { label: "complete", val: compRate + "%",   color: compRate >= 70 ? T.mono : T.accent },
                { label: "pro+",     val: proRate + "%",    color: T.mono2 },
                { label: "active",   val: active,           color: T.green },
              ].map(m => (
                <div key={m.label} style={{ textAlign: "right" }}>
                  <Mono size={20} color={m.color}>{m.val}</Mono>
                  <div style={{ ...s.mono, fontSize: 9, color: T.text3, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 1 }}>{m.label}</div>
                </div>
              ))}
              {!empty && <div style={{ width: 1, height: 30, background: T.border }}/>}
              <Btn onClick={() => setShowCfg(p => !p)} variant={showCfg ? "accent" : "ghost"}>Config</Btn>
            </div>
          </div>
        </header>

        {/* CONFIG */}
        {showCfg && (
          <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "10px 40px", display: "flex", alignItems: "center", gap: 14 }}>
            <Eyebrow color={T.text3} style={{ flexShrink: 0 }}>Notion Hub ID</Eyebrow>
            <input value={notionId} onChange={e => setNotionId(e.target.value)}
              style={{ background: T.bg, border: `1px solid ${T.borderHi}`, borderRadius: 2, padding: "4px 10px", color: T.text, ...s.mono, fontSize: 11, outline: "none", width: 360 }}/>
            <Mono size={10} color={T.text3}>used by all Notion sync operations</Mono>
          </div>
        )}

        {/* NEXT ACTION BANNER */}
        <div style={{ borderBottom: `1px solid ${T.border}`, background: T.surface, borderLeft: `3px solid ${nextColor}` }}>
          <div style={{ padding: "11px 37px", display: "flex", alignItems: "baseline", gap: 16 }}>
            <Mono size={9} color={nextColor} style={{ textTransform: "uppercase", letterSpacing: "0.18em", flexShrink: 0 }}>
              {next.urgency === "good" ? "status" : "next →"} {next.flag}
            </Mono>
            <span style={{ fontWeight: 500, color: nextColor, fontSize: 13 }}>{next.title}</span>
            <span style={{ color: T.text2, fontSize: 12 }}>{next.desc}</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex" }}>
          {[
            { id: "overview",  label: "Overview" },
            { id: "tools",     label: "Tools" },
            { id: "sync",      label: "Notion Sync" },
            { id: "activity",  label: "Activity" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? T.accentHi : "transparent"}`, color: tab === t.id ? T.accentHi : T.text2, padding: "10px 18px", cursor: "pointer", ...s.sans, fontSize: 12.5, fontWeight: tab === t.id ? 500 : 400, transition: "color 0.15s, border-color 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MAIN */}
        <main style={{ padding: "26px 40px", maxWidth: 980 }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            empty ? (
              <Card>
                <Eyebrow style={{ marginBottom: 10 }}>Program Status</Eyebrow>
                <div style={{ ...s.heading, fontSize: 17, color: T.text2 }}>No program data yet</div>
                <div style={{ color: T.text2, fontSize: 12, marginTop: 8 }}>Open Artifact 01 to capture the first employee profile before their session.</div>
              </Card>
            ) : <>
              {/* Metric row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Completion Rate", val: compRate, color: compRate >= 70 ? T.mono : T.accent, sub: `${completed} of ${outcomes.length}` },
                  { label: "Pro+ Adoption",   val: proRate,  color: T.mono2, sub: `${onPro} on paid plan` },
                  { label: "QC Gate Clear",   val: qcRate,   color: qcRate >= 80 ? T.mono : T.accent, sub: `${qcPassed} all ★ passed` },
                  { label: "Active / Week",   val: active > 0 && Object.keys(latestCI).length > 0 ? Math.round(active / Object.keys(latestCI).length * 100) : 0, color: T.green, sub: `${active} used Claude` },
                ].map(m => (
                  <Card key={m.label} style={{ padding: "13px 16px" }}>
                    <Eyebrow color={T.text3} style={{ marginBottom: 8, fontSize: 9 }}>{m.label}</Eyebrow>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                      <Mono size={22} color={m.color}>{m.val}</Mono>
                      <Mono size={12} color={m.color}>%</Mono>
                    </div>
                    <MeterBar val={m.val} color={m.color}/>
                    <Mono size={9.5} color={T.text3} style={{ marginTop: 6, letterSpacing: "0.04em" }}>{m.sub}</Mono>
                  </Card>
                ))}
              </div>

              {/* Follow-up alert */}
              {followup > 0 && (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.accent}`, borderRadius: 3, padding: "9px 14px", marginBottom: 12, display: "flex", gap: 14, alignItems: "baseline" }}>
                  <Mono size={9} color={T.accent} style={{ textTransform: "uppercase", letterSpacing: "0.14em", flexShrink: 0 }}>needs follow-up</Mono>
                  <span style={{ color: T.text2, fontSize: 12 }}>
                    {outcomes.filter(o => o.status === "Needs Follow-up").map(o => o.employeeName + (o.openGaps ? ` — ${o.openGaps}` : "")).join(" · ")}
                  </span>
                </div>
              )}

              {/* Cohort table */}
              {outcomes.length > 0 && (
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "10px 18px", borderBottom: `1px solid ${T.border}` }}>
                    <Eyebrow>Cohort — {outcomes.length} employee{outcomes.length !== 1 ? "s" : ""}</Eyebrow>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["employee","role","plan","session","qc ★","freq","conf","status"].map(h => (
                          <th key={h} style={{ padding: "7px 14px", ...s.mono, fontSize: 9, color: T.text3, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "left", borderBottom: `1px solid ${T.border}`, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outcomes.map((o, i) => {
                        const ci  = latestCI[o.employeeName];
                        const qc  = ["q1","q2","q3","q4"].filter(id => o.qc?.[id] === "pass").length;
                        const sc  = STATUS_COLOR[o.status] || T.text2;
                        const pc  = PLAN_COLOR[o.plan]    || T.text3;
                        const fc  = FREQ_COLOR[ci?.frequency] || T.text3;
                        const fg  = FREQ_GLYPH[ci?.frequency] || "—";
                        return (
                          <tr key={o.id} style={{ borderBottom: i < outcomes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                            <td style={{ padding: "8px 14px", fontWeight: 500 }}>{o.employeeName}</td>
                            <td style={{ padding: "8px 14px", color: T.text2, fontSize: 12 }}>{o.role}</td>
                            <td style={{ padding: "8px 14px" }}><Tag color={pc}>{o.plan?.toUpperCase()}</Tag></td>
                            <td style={{ padding: "8px 14px" }}><Mono size={11} color={T.text3}>#{o.sessionNumber}</Mono></td>
                            <td style={{ padding: "8px 14px" }}><Mono size={11} color={qc === 4 ? T.green : T.accent}>{qc}/4</Mono></td>
                            <td style={{ padding: "8px 14px" }}><Mono size={11} color={fc}>{fg}</Mono></td>
                            <td style={{ padding: "8px 14px" }}><Mono size={11} color={T.text2}>{ci?.confidence ? ci.confidence + "/5" : "—"}</Mono></td>
                            <td style={{ padding: "8px 14px" }}><Tag color={sc}>{o.status}</Tag></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              )}

              {/* Wins + gaps */}
              {(outcomes.some(o => o.openGaps) || Object.values(latestCI).some(c => c.biggestWin)) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  {outcomes.some(o => o.openGaps) && (
                    <Card style={{ padding: 14 }}>
                      <Eyebrow style={{ marginBottom: 10 }}>Open Gaps</Eyebrow>
                      {outcomes.filter(o => o.openGaps).map((o, i, arr) => (
                        <div key={i} style={{ paddingBottom: 6, marginBottom: 6, borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 10 }}>
                          <Mono size={10} color={T.accent} style={{ flexShrink: 0, textTransform: "none" }}>{o.employeeName}</Mono>
                          <span style={{ color: T.text2, fontSize: 12 }}>{o.openGaps}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                  {Object.values(latestCI).some(c => c.biggestWin) && (
                    <Card style={{ padding: 14 }}>
                      <Eyebrow style={{ marginBottom: 10 }}>Latest Wins</Eyebrow>
                      {Object.values(latestCI).filter(c => c.biggestWin).map((c, i, arr) => (
                        <div key={i} style={{ paddingBottom: 6, marginBottom: 6, borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 10 }}>
                          <Mono size={10} color={T.green} style={{ flexShrink: 0 }}>{c.name}</Mono>
                          <span style={{ color: T.text2, fontSize: 12 }}>{c.biggestWin}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── TOOLS ── */}
          {tab === "tools" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TOOLS.map(tool => (
                <Card key={tool.id} style={{ display: "flex", gap: 14 }}>
                  <Mono size={18} color={T.accent} style={{ flexShrink: 0, paddingTop: 2, letterSpacing: "-0.02em" }}>{tool.num}</Mono>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                      <div style={{ ...s.heading, fontSize: 13 }}>{tool.title}</div>
                      {tool.syncs && <Mono size={9} color={T.green} style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>↑ notion</Mono>}
                    </div>
                    <div style={{ color: T.text2, fontSize: 12, marginBottom: 8 }}>{tool.subtitle}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <Tag color={tool.role === "facilitator" ? T.accent : T.mono2}>{tool.role}</Tag>
                      <Tag>{tool.when}</Tag>
                      {COUNTS[tool.id] > 0 && <Tag color={T.text}>{COUNTS[tool.id]} rec</Tag>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ── SYNC ── */}
          {tab === "sync" && (
            <>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <Eyebrow style={{ marginBottom: 7 }}>Notion Training Hub Sync</Eyebrow>
                  <div style={{ ...s.heading, fontSize: 20, marginBottom: 5 }}>Push program records to Notion</div>
                  <div style={{ color: T.text2, fontSize: 12 }}>Creates or updates databases under the Training Hub page. Skips duplicates on name + date.</div>
                </div>
                <Btn onClick={syncAll} variant="accent">Sync All →</Btn>
              </div>

              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, padding: "8px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
                <Mono size={9} color={T.text3} style={{ textTransform: "uppercase", letterSpacing: "0.14em", flexShrink: 0 }}>Hub</Mono>
                <Mono size={11} color={T.text2}>{notionId}</Mono>
              </div>

              {SYNCABLE.map(({ type, label, count, desc }) => {
                const st  = syncState[type];
                const sc  = SYNC_COLOR[st];
                const msg = syncMsg[type];
                const err = syncErr[type];
                return (
                  <Card key={type} style={{ marginBottom: 8, padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                          <div style={{ ...s.heading, fontSize: 14 }}>{label}</div>
                          <Mono size={9.5} color={T.text3}>{count} {desc}</Mono>
                        </div>
                        <Mono size={9} color={sc} style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>
                          {SYNC_GLYPH[st]} {SYNC_LABEL[st]}
                        </Mono>
                      </div>
                      <Btn onClick={() => doSync(type)} disabled={st === "syncing" || count === 0}>
                        {st === "syncing" ? "…" : "Sync"}
                      </Btn>
                    </div>
                    {msg && !err && (
                      <div style={{ marginTop: 10, padding: "6px 10px", background: T.bg, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.green}`, borderRadius: 2, ...s.mono, fontSize: 10.5, color: T.green }}>
                        {msg}
                      </div>
                    )}
                    {err && (
                      <div style={{ marginTop: 10, padding: "6px 10px", background: T.bg, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.red}`, borderRadius: 2, ...s.mono, fontSize: 10.5, color: T.red }}>
                        {err}
                      </div>
                    )}
                  </Card>
                );
              })}

              <div style={{ marginTop: 22 }}>
                <Eyebrow color={T.text3} style={{ marginBottom: 10 }}>Not synced</Eyebrow>
                {[
                  ["Prompt Packages",    "facilitator tool, not a program record"],
                  ["Self-Setup Progress","per-device employee data"],
                ].map(([label, reason]) => (
                  <div key={label} style={{ display: "flex", gap: 14, marginBottom: 5, alignItems: "baseline" }}>
                    <Mono size={10} color={T.text3} style={{ textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>{label}</Mono>
                    <span style={{ color: T.text3, fontSize: 12 }}>— {reason}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── ACTIVITY ── */}
          {tab === "activity" && (() => {
            const events = [
              ...intakes.slice(0, 5).map(r => ({ ts: r.createdAt,  type: "intake",   name: r.name, desc: r.role,          color: T.accent })),
              ...outcomes.slice(0, 5).map(r => ({ ts: r.createdAt, type: "outcome",  name: r.employeeName, desc: r.status, color: T.mono2 })),
              ...checkins.slice(0, 5).map(r => ({ ts: r.createdAt, type: "check-in", name: r.name, desc: `conf. ${r.confidence}/5`, color: T.green })),
            ].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 14);

            return !events.length
              ? <Mono color={T.text3} size={11}>no activity recorded</Mono>
              : (
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "10px 18px", borderBottom: `1px solid ${T.border}` }}>
                    <Eyebrow>Recent Activity</Eyebrow>
                  </div>
                  {events.map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 18px", borderBottom: i < events.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <Tag color={e.color}>{e.type}</Tag>
                      <Mono size={12} color={T.text} style={{ flex: "0 0 130px", fontWeight: 500 }}>{e.name}</Mono>
                      <span style={{ color: T.text2, fontSize: 12, flex: 1 }}>{e.desc}</span>
                      <Mono size={10} color={T.text3}>{new Date(e.ts).toLocaleDateString()}</Mono>
                    </div>
                  ))}
                </Card>
              );
          })()}

        </main>
      </div>
    </>
  );
}
