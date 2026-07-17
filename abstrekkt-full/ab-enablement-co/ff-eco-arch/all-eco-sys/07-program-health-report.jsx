/**
 * Claude Enablement Suite — 7/7: Program Health Report Generator
 *
 * Reads all suite storage keys, synthesizes program data,
 * and generates a formatted stakeholder report using Claude API.
 * Also shows a live dashboard view of the full program state.
 *
 * Reads:
 *   "intake-records-v1"    — employee profiles from artifact 1
 *   "outcome-records-v1"   — session outcomes from artifact 4
 *   "checkin-records-v1"   — weekly check-ins from artifact 5
 *   "prompt-packages-v1"   — packages from artifact 2
 */

import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#156082", accent: "#E97132", done: "#15803d",
  navy: "#0E2841", muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc",
  blocked: "#dc2626", active: "#7c3aed",
};

const AI_REPORT_SYSTEM = `You are an expert program analyst for an AI enablement program. 
Write a clear, concise stakeholder report based on the data provided.

Format:
- Executive Summary (3-4 sentences, plain English)
- Program Status (completion rate, plan adoption, QC pass rate)
- Highlights (2-3 specific wins with employee context)
- Gaps & Risks (2-3 specific items that need attention)
- Recommended Actions (3 concrete next steps, prioritized)
- Metrics Table (markdown table with key numbers)

Tone: Professional, factual, no hype. Suitable for a VP or C-suite audience.
Be specific — use real names, real numbers from the data. No generic AI filler.
If data is sparse, say so and focus on what's available.`;

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: 14, flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || C.navy }}>{value ?? "—"}</div>
      {sub && <div style={{ fontSize: 12, fontWeight: 700, color: color || C.navy }}>{sub}</div>}
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginTop: 3 }}>{label}</div>
    </div>
  );
}

function PlanBadge({ plan }) {
  const colors = { free: "#94a3b8", pro: C.active, max: C.accent, team: C.primary, enterprise: C.navy, unknown: "#94a3b8" };
  const c = colors[plan] || "#94a3b8";
  return <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 2, background: c + "22", color: c }}>{plan?.toUpperCase()}</span>;
}

export default function ProgramHealthReport() {
  const [intakes,   setIntakes]   = useState([]);
  const [outcomes,  setOutcomes]  = useState([]);
  const [checkins,  setCheckins]  = useState([]);
  const [packages,  setPackages]  = useState({});
  const [loading,   setLoading]   = useState(true);
  const [report,    setReport]    = useState(null);
  const [generating,setGenerating]= useState(false);
  const [error,     setError]     = useState(null);
  const [view,      setView]      = useState("dashboard");  // dashboard | report
  const [copied,    setCopied]    = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [ir, or, cr, pr] = await Promise.allSettled([
          window.storage.get("intake-records-v1"),
          window.storage.get("outcome-records-v1"),
          window.storage.get("checkin-records-v1", true),
          window.storage.get("prompt-packages-v1"),
        ]);
        if (ir.status === "fulfilled" && ir.value) setIntakes(JSON.parse(ir.value.value));
        if (or.status === "fulfilled" && or.value) setOutcomes(JSON.parse(or.value.value));
        if (cr.status === "fulfilled" && cr.value) setCheckins(JSON.parse(cr.value.value));
        if (pr.status === "fulfilled" && pr.value) setPackages(JSON.parse(pr.value.value));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    return () => abortRef.current?.abort();
  }, []);

  // ── Computed metrics ──
  const totalIntakes   = intakes.length;
  const totalOutcomes  = outcomes.length;
  const totalCheckins  = checkins.length;
  const totalPackages  = Object.keys(packages).length;
  const completed      = outcomes.filter(o => o.status === "Completed").length;
  const onProPlus      = outcomes.filter(o => ["pro","max","team","enterprise"].includes(o.plan)).length;
  const qcPassed       = outcomes.filter(o => {
    const criticals = ["q1","q2","q3","q4"];
    return criticals.every(id => o.qc?.[id] === "pass");
  }).length;
  const needsFollowup  = outcomes.filter(o => o.status === "Needs Follow-up").length;
  const compRate       = totalOutcomes ? Math.round((completed / totalOutcomes) * 100) : 0;
  const proRate        = totalOutcomes ? Math.round((onProPlus / totalOutcomes) * 100) : 0;
  const qcRate         = totalOutcomes ? Math.round((qcPassed / totalOutcomes) * 100) : 0;

  const latestCheckinsByEmployee = {};
  checkins.forEach(c => {
    if (!latestCheckinsByEmployee[c.name]) latestCheckinsByEmployee[c.name] = c;
  });
  const avgConfidence = Object.values(latestCheckinsByEmployee).length
    ? (Object.values(latestCheckinsByEmployee).reduce((acc, c) => acc + c.confidence, 0) / Object.values(latestCheckinsByEmployee).length).toFixed(1)
    : null;
  const activeUsers = Object.values(latestCheckinsByEmployee).filter(c => c.frequency !== "not_yet").length;

  // Build data payload for AI
  function buildReportPayload() {
    const outcomeRows = outcomes.map(o => ({
      name: o.employeeName, role: o.role, plan: o.plan,
      session: o.sessionNumber, status: o.status,
      qcCriticals: ["q1","q2","q3","q4"].filter(id => o.qc?.[id] === "pass").length + "/4 ★",
      gaps: o.openGaps, nextFocus: o.nextSessionFocus, notes: o.notes,
    }));

    const checkinRows = Object.values(latestCheckinsByEmployee).map(c => ({
      name: c.name, frequency: c.frequency, confidence: c.confidence,
      biggestWin: c.biggestWin, stuckOn: c.stuckOn, nextGoal: c.nextWeekGoal,
      blockers: c.blockers,
    }));

    return {
      summary: {
        totalEmployeesIntaked: totalIntakes,
        totalSessionsLogged: totalOutcomes,
        completionRate: compRate + "%",
        proAdoptionRate: proRate + "%",
        qcPassRate: qcRate + "%",
        totalPromptPackages: totalPackages,
        needsFollowup,
        activeUsers,
        avgConfidence: avgConfidence ? avgConfidence + "/5" : "no data",
      },
      sessionOutcomes: outcomeRows,
      latestCheckins: checkinRows,
    };
  }

  async function generateReport() {
    setGenerating(true);
    setError(null);
    abortRef.current = new AbortController();

    try {
      const payload = buildReportPayload();
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          system: AI_REPORT_SYSTEM,
          messages: [{
            role: "user",
            content: `Generate a program health report from this data:\n\n${JSON.stringify(payload, null, 2)}\n\nToday's date: ${new Date().toLocaleDateString()}`,
          }],
        }),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error?.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setReport(data.content?.[0]?.text || "No report generated.");
      setView("report");
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function copyReport() {
    if (!report) return;
    navigator.clipboard.writeText(report).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.muted, fontSize: 13 }}>Loading program data…</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>📊 Program Health Report</span>
        <div style={{ flex: 1 }}/>
        {view === "report" && report && (
          <button onClick={copyReport} style={{ ...btn, background: "#334155" }}>{copied ? "✓ Copied" : "📋 Copy Report"}</button>
        )}
        <button onClick={() => setView("dashboard")} style={{ ...btn, background: view === "dashboard" ? C.primary : "#334155" }}>Dashboard</button>
        <button onClick={view === "report" && report ? () => setView("report") : generateReport}
          disabled={generating || (!totalOutcomes && !totalCheckins)}
          style={{ ...btn, background: view === "report" && report ? C.active : (totalOutcomes || totalCheckins) && !generating ? C.accent : "#334155", opacity: generating ? 0.7 : 1 }}>
          {generating ? "Generating…" : view === "report" && report ? "View Report" : "⚡ Generate Report"}
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 18px" }}>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: 12, marginBottom: 14, fontSize: 12, color: C.blocked }}>
            ⚠ {error}
          </div>
        )}

        {!totalIntakes && !totalOutcomes && !totalCheckins && (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>No program data yet</div>
            <div style={{ fontSize: 12, color: C.muted }}>Run intake sessions (artifact 1) and log outcomes (artifact 4) to populate this dashboard.</div>
          </div>
        )}

        {/* ── DASHBOARD VIEW ── */}
        {view === "dashboard" && (totalIntakes > 0 || totalOutcomes > 0 || totalCheckins > 0) && (
          <>
            {/* Top stats */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <StatCard label="Intakes"        value={totalIntakes}  color={C.navy} />
              <StatCard label="Sessions"       value={totalOutcomes} color={C.navy} />
              <StatCard label="Completion"     value={compRate + "%"} color={compRate >= 70 ? C.done : C.accent} />
              <StatCard label="On Pro+"        value={onProPlus}     sub={proRate + "%"} color={C.primary} />
              <StatCard label="QC ★ Passed"    value={qcPassed}      sub={qcRate + "%"} color={qcRate >= 80 ? C.done : C.accent} />
              <StatCard label="Needs Follow-up" value={needsFollowup} color={needsFollowup > 0 ? C.accent : C.done} />
              <StatCard label="Check-ins"      value={totalCheckins} color={C.navy} />
              <StatCard label="Active Users"   value={activeUsers}   sub={avgConfidence ? `${avgConfidence}/5 conf.` : undefined} color={C.active} />
            </div>

            {/* Progress bar */}
            {totalOutcomes > 0 && (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: C.navy }}>Program Progress</span>
                  <span style={{ color: C.muted }}>{completed}/{totalOutcomes} sessions complete</span>
                </div>
                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4 }}>
                  <div style={{ height: "100%", background: C.done, borderRadius: 4, width: compRate + "%", transition: "width 0.4s" }}/>
                </div>
              </div>
            )}

            {/* Employees table */}
            {totalOutcomes > 0 && (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Employee Cohort</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {["Name","Role","Plan","Sessions","QC","Latest Check-in","Freq","Status"].map(h => (
                        <th key={h} style={{ padding: "7px 10px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.3px", textAlign: "left", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outcomes.map((o, i) => {
                      const checkin = latestCheckinsByEmployee[o.employeeName];
                      const qcCount = ["q1","q2","q3","q4"].filter(id => o.qc?.[id] === "pass").length;
                      const statusColors = { "Completed": C.done, "In Progress": C.active, "Needs Follow-up": C.accent, "Scheduled": C.primary, "No Show": C.blocked };
                      const sc = statusColors[o.status] || C.muted;
                      return (
                        <tr key={o.id} style={{ borderBottom: i < outcomes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "#0f172a" }}>{o.employeeName}</td>
                          <td style={{ padding: "8px 10px", color: "#475569" }}>{o.role}</td>
                          <td style={{ padding: "8px 10px" }}><PlanBadge plan={o.plan}/></td>
                          <td style={{ padding: "8px 10px", color: C.muted }}>#{o.sessionNumber}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ color: qcCount === 4 ? C.done : C.accent, fontWeight: 700 }}>{qcCount}/4</span>
                          </td>
                          <td style={{ padding: "8px 10px", color: C.muted, fontSize: 11 }}>
                            {checkin ? new Date(checkin.weekOf).toLocaleDateString() : "—"}
                          </td>
                          <td style={{ padding: "8px 10px", fontSize: 16 }}>
                            {checkin ? ({"daily":"🔥","few_week":"⚡","once_week":"👍","once_few":"🙂","not_yet":"😬"}[checkin.frequency] || "—") : "—"}
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: sc + "22", color: sc }}>{o.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Open gaps */}
            {outcomes.some(o => o.openGaps) && (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Open Gaps</div>
                {outcomes.filter(o => o.openGaps).map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, padding: "6px 8px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 11, color: C.accent, flexShrink: 0 }}>{o.employeeName}</span>
                    <span style={{ fontSize: 11, color: "#7c2d12" }}>{o.openGaps}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Check-in wins */}
            {Object.values(latestCheckinsByEmployee).some(c => c.biggestWin) && (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Latest Wins</div>
                {Object.values(latestCheckinsByEmployee).filter(c => c.biggestWin).map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, padding: "6px 8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 11, color: C.done, flexShrink: 0 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "#134e4a" }}>{c.biggestWin}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Suite coverage */}
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Suite Data Coverage</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { label: "Intakes", icon: "📋", count: totalIntakes, store: "intake-records-v1" },
                  { label: "Outcomes", icon: "📊", count: totalOutcomes, store: "outcome-records-v1" },
                  { label: "Check-ins", icon: "✅", count: totalCheckins, store: "checkin-records-v1" },
                  { label: "Pkg Builds", icon: "📦", count: totalPackages, store: "prompt-packages-v1" },
                ].map(({ label, icon, count }) => (
                  <div key={label} style={{ textAlign: "center", padding: 10, background: count > 0 ? C.done + "11" : C.bg, borderRadius: 4, border: `1px solid ${count > 0 ? C.done + "44" : C.border}` }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: count > 0 ? C.done : "#94a3b8" }}>{count}</div>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── REPORT VIEW ── */}
        {view === "report" && report && (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, background: C.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>Program Health Report</div>
                <div style={{ fontSize: 11, color: C.muted }}>Generated {new Date().toLocaleDateString()} · {totalOutcomes} sessions · {totalCheckins} check-ins</div>
              </div>
              <button onClick={() => generateReport()} disabled={generating}
                style={{ ...btn, background: generating ? "#334155" : "#e2e8f0", color: generating ? "#fff" : "#475569" }}>
                {generating ? "…" : "↻ Regenerate"}
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {/* Render markdown-ish report */}
              {report.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginTop: i === 0 ? 0 : 18, marginBottom: 6 }}>{line.slice(3)}</h2>;
                if (line.startsWith("# "))  return <h1 key={i} style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{line.slice(2)}</h1>;
                if (line.startsWith("- "))  return <div key={i} style={{ fontSize: 12, color: "#334155", marginBottom: 4, paddingLeft: 14, position: "relative" }}><span style={{ position: "absolute", left: 4, color: C.primary }}>•</span>{line.slice(2)}</div>;
                if (line.startsWith("|"))   return <div key={i} style={{ fontSize: 11, fontFamily: "monospace", background: C.bg, padding: "2px 6px", marginBottom: 1, borderRadius: 2, color: "#334155" }}>{line}</div>;
                if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{line.slice(2, -2)}</div>;
                if (!line.trim()) return <div key={i} style={{ height: 6 }}/>;
                return <p key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, marginBottom: 6 }}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const btn = { padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", color: "#fff", background: "#334155" };
