import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const SYSTEM_PROMPT = `You are an enablement program analyst writing a stakeholder report on a Claude AI adoption program.

Output a structured report in plain markdown (no code fences). Use these exact section headers:
## Executive Summary
## Program Metrics
## Adoption Highlights
## Blockers & Risks
## Recommendations
## Next Period Focus

Rules:
- Be specific, not generic. Use the actual numbers and names from the data.
- Highlight real patterns in the check-in data (confidence trends, blockers, frequency).
- Identify outliers (employees with low confidence, repeated blockers).
- Recommendations must be actionable — not just "continue training."
- Keep total length under 600 words.
- Write for a non-technical manager or executive audience.`;

export default function ProgramHealthReport() {
  const [data, setData]       = useState(null);
  const [report, setReport]   = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [reportDate, setReportDate] = useState("");
  const abortRef = useRef(null);

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
    setReportDate(new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" }));
    (async () => {
      setLoading(true);
      const snapshot = {};
      const stores = [
        ["intake-records-v1","intakeRecords"],
        ["outcome-records-v1","outcomeRecords"],
        ["checkin-records-v1","checkinRecords"],
        ["prompt-packages-v1","promptPackages"],
      ];
      for (const [key, label] of stores) {
        try {
          const r = await window.storage.get(key);
          snapshot[label] = r ? JSON.parse(r.value) : (label === "promptPackages" ? {} : []);
        } catch { snapshot[label] = label === "promptPackages" ? {} : []; }
      }
      setData(snapshot);
      setLoading(false);
    })();
  }, []);

  const computeMetrics = (d) => {
    const intakes   = d.intakeRecords || [];
    const outcomes  = d.outcomeRecords || [];
    const checkins  = d.checkinRecords || [];
    const packages  = d.promptPackages || {};

    const fullyOnboarded = outcomes.filter(o => o.outcome === "Fully onboarded").length;
    const needsFollowUp  = outcomes.filter(o => o.outcome === "Partial — follow-up needed").length;
    const blocked        = outcomes.filter(o => o.outcome === "Blocked — tech issue").length;

    const confScores = checkins.map(c => Number(c.confidenceRating)).filter(n => !isNaN(n));
    const avgConf = confScores.length > 0
      ? (confScores.reduce((a,b) => a+b, 0) / confScores.length).toFixed(1)
      : null;

    const freqCounts = {};
    checkins.forEach(c => { freqCounts[c.usageFrequency] = (freqCounts[c.usageFrequency] || 0) + 1; });
    const topFreq = Object.entries(freqCounts).sort((a,b) => b[1]-a[1])[0];

    const blockerCounts = {};
    checkins.forEach(c => (c.blockers || []).filter(b => b !== "No blockers").forEach(b => {
      blockerCounts[b] = (blockerCounts[b] || 0) + 1;
    }));
    const topBlockers = Object.entries(blockerCounts).sort((a,b) => b[1]-a[1]).slice(0,3);

    const qcScores = outcomes.map(o => {
      const match = o.qcScore?.match(/(\d+)\/(\d+)/);
      return match ? { passed: Number(match[1]), total: Number(match[2]) } : null;
    }).filter(Boolean);
    const avgQC = qcScores.length > 0
      ? (qcScores.reduce((a,b) => a + b.passed/b.total, 0) / qcScores.length * 100).toFixed(0)
      : null;

    return {
      totalEmployees: intakes.length,
      sessionsLogged: outcomes.length,
      fullyOnboarded, needsFollowUp, blocked,
      checkInsSubmitted: checkins.length,
      packagesGenerated: Object.keys(packages).length,
      avgConfidence: avgConf,
      topFrequency: topFreq ? `${topFreq[0]} (${topFreq[1]})` : null,
      topBlockers,
      avgQCPass: avgQC,
    };
  };

  const generateReport = async () => {
    if (!data) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setGenerating(true); setError(null); setReport(null);

    try {
      const metrics = computeMetrics(data);
      const { intakeRecords, outcomeRecords, checkinRecords } = data;

      const dataBlob = `PROGRAM DATA — Report Date: ${reportDate}

METRICS:
- Total employees intaked: ${metrics.totalEmployees}
- Sessions logged: ${metrics.sessionsLogged}
- Fully onboarded: ${metrics.fullyOnboarded}
- Partial / needs follow-up: ${metrics.needsFollowUp}
- Blocked: ${metrics.blocked}
- Check-ins submitted: ${metrics.checkInsSubmitted}
- Prompt packages generated: ${metrics.packagesGenerated}
- Average confidence rating: ${metrics.avgConfidence ?? "n/a"}/10
- Average QC pass rate: ${metrics.avgQCPass ?? "n/a"}%
- Most common usage frequency: ${metrics.topFrequency ?? "n/a"}
- Top blockers: ${metrics.topBlockers.map(([b,n]) => `${b} (${n})`).join(", ") || "none"}

RECENT OUTCOMES (last 5):
${outcomeRecords.slice(0,5).map(o =>
  `- ${o.employeeName} | ${o.outcome} | Confidence: ${o.confidenceLevel} | QC: ${o.qcScore} | Gaps: ${o.openGaps || "none"}`
).join("\n") || "none"}

RECENT CHECK-INS (last 5):
${checkinRecords.slice(0,5).map(c =>
  `- ${c.name} | Week of ${c.weekOf} | Freq: ${c.usageFrequency} | Confidence: ${c.confidenceRating}/10 | Blockers: ${(c.blockers||[]).join(", ")||"none"}`
).join("\n") || "none"}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:2000,
          system: SYSTEM_PROMPT,
          messages:[{ role:"user", content: dataBlob }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`API ${res.status}: ${errData.error?.message || res.statusText}`);
      }

      const respData = await res.json();
      const text = respData.content.filter(b => b.type==="text").map(b => b.text).join("");
      setReport(text);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const renderMarkdown = (md) => {
    return md.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return <div key={i} style={{ fontFamily:F.serif, fontSize:"17px", fontWeight:700,
                                     color:T.accent, margin:"20px 0 8px", paddingTop:"16px",
                                     borderTop:`1px solid ${T.border}` }}>{line.slice(3)}</div>;
      }
      if (line.startsWith("- ")) {
        return <div key={i} style={{ fontSize:"13px", color:T.text, padding:"3px 0 3px 14px",
                                     borderLeft:`2px solid ${T.border}`, marginBottom:"3px" }}>
          {line.slice(2)}
        </div>;
      }
      if (line.trim() === "") return <div key={i} style={{ height:"8px" }} />;
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} style={{ fontFamily:F.mono, fontSize:"11px", color:T.text2,
                                     textTransform:"uppercase", letterSpacing:"0.06em", marginTop:"10px" }}>
          {line.replace(/\*\*/g,"")}
        </div>;
      }
      return <div key={i} style={{ fontSize:"13px", color:T.text, lineHeight:"1.7", marginBottom:"4px" }}>{line}</div>;
    });
  };

  const metrics = data ? computeMetrics(data) : null;

  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px" },
    metricsGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:"10px",
                  marginBottom:"24px" },
    metricCard:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius, padding:"12px" },
    metricVal:{ fontFamily:F.mono, fontSize:"22px", fontWeight:500, color:T.accent, lineHeight:1 },
    metricLabel:{ fontFamily:F.mono, fontSize:"10px", color:T.text3, textTransform:"uppercase",
                  letterSpacing:"0.06em", marginTop:"4px" },
    btn:(dis) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: dis ? T.text3 : T.bg,
      background: dis ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: dis ? "not-allowed" : "pointer",
      transition:`background ${tr}`, marginBottom:"20px",
    }),
    err:{ background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
          padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    reportBox:{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:radius, padding:"20px" },
    reportHdr:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                marginBottom:"20px", paddingBottom:"16px", borderBottom:`1px solid ${T.border}` },
    reportTitle:{ fontFamily:F.serif, fontSize:"20px", fontWeight:700, color:T.text },
    reportDate:{ fontFamily:F.mono, fontSize:"11px", color:T.text2 },
    loading:{ fontFamily:F.mono, fontSize:"12px", color:T.text2, padding:"20px 0" },
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Program Health Report</div>
        <div style={s.sub}>ARTIFACT 07 · claude-sonnet-4-6 · 2,000 max tokens · reads all stores</div>
      </div>

      {loading && <div style={s.loading}>◌ Loading program data…</div>}

      {!loading && metrics && (
        <>
          {/* Metrics snapshot */}
          <div style={s.metricsGrid}>
            {[
              [metrics.totalEmployees, "Employees"],
              [metrics.sessionsLogged, "Sessions"],
              [metrics.fullyOnboarded, "Onboarded"],
              [metrics.needsFollowUp, "Needs Follow-up"],
              [metrics.checkInsSubmitted, "Check-ins"],
              [metrics.packagesGenerated, "Pkg Generated"],
              [metrics.avgConfidence ?? "—", "Avg Confidence"],
              [metrics.avgQCPass ? metrics.avgQCPass+"%" : "—", "QC Pass Rate"],
            ].map(([val, label]) => (
              <div key={label} style={s.metricCard}>
                <div style={s.metricVal}>{val}</div>
                <div style={s.metricLabel}>{label}</div>
              </div>
            ))}
          </div>

          {metrics.topBlockers.length > 0 && (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
                          padding:"12px 14px", marginBottom:"20px" }}>
              <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.red,
                            textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
                Top Blockers
              </div>
              {metrics.topBlockers.map(([b,n]) => (
                <div key={b} style={{ display:"flex", justifyContent:"space-between",
                                      fontSize:"12px", color:T.text2, padding:"2px 0" }}>
                  <span>{b}</span>
                  <span style={{ fontFamily:F.mono, color:T.red }}>{n}</span>
                </div>
              ))}
            </div>
          )}

          {error && <div style={s.err}>✗ {error}</div>}

          <button style={s.btn(generating || !data)}
                  disabled={generating || !data}
                  onClick={generateReport}>
            {generating ? "Generating report…" : "◆ Generate Stakeholder Report"}
          </button>

          {generating && <div style={s.loading}>◌ Analyzing program data and generating narrative…</div>}

          {report && (
            <div style={s.reportBox}>
              <div style={s.reportHdr}>
                <div style={s.reportTitle}>Claude Enablement Program — Health Report</div>
                <div style={s.reportDate}>{reportDate}</div>
              </div>
              {renderMarkdown(report)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
