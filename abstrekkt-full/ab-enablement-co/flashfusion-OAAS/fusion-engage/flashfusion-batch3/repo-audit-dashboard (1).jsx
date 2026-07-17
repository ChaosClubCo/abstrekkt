import { useState, useMemo } from "react";

const CATEGORIES = {
  "reference-fork": { label: "Reference Forks", color: "#6b7280", icon: "🔀", action: "Archive" },
  "awesome-list": { label: "Awesome Lists", color: "#9ca3af", icon: "📋", action: "Archive All" },
  "framework-fork": { label: "Framework/SDK Forks", color: "#78716c", icon: "📦", action: "Archive" },
  "base44-active": { label: "Base44 Apps (Active)", color: "#8b5cf6", icon: "⚡", action: "Keep" },
  "base44-stale": { label: "Base44 Apps (Stale)", color: "#a78bfa", icon: "💤", action: "Archive" },
  "original-active": { label: "Original (Active)", color: "#10b981", icon: "✅", action: "Keep" },
  "original-stale": { label: "Original (Stale)", color: "#6ee7b7", icon: "📁", action: "Archive" },
  "kinsley": { label: "Kinsley/Personal", color: "#f59e0b", icon: "👧", action: "Evaluate" },
  "int-public": { label: "INT (PUBLIC ⚠️)", color: "#ef4444", icon: "🚨", action: "Make Private NOW" },
  "flashfusion": { label: "FlashFusion", color: "#3b82f6", icon: "⚡", action: "Consolidate" },
  "scaffold": { label: "Lovable/Blink/v0", color: "#d1d5db", icon: "🧪", action: "Archive" },
  "replit": { label: "Replit Mirrors", color: "#e5e7eb", icon: "🔄", action: "Archive" },
  "duplicate": { label: "Duplicates", color: "#fbbf24", icon: "♻️", action: "Consolidate" },
};

const LANES = {
  flashfusion: { label: "FlashFusion", color: "#3b82f6" },
  chaosclub: { label: "Chaos Club", color: "#8b5cf6" },
  personal: { label: "Personal Brand", color: "#10b981" },
  kinsley: { label: "Kinsley", color: "#f59e0b" },
  int: { label: "INT (Private)", color: "#ef4444" },
  archive: { label: "Archive", color: "#6b7280" },
};

const SUMMARY = {
  total: 630,
  toArchive: 500,
  toPrivatize: 16,
  toKeep: 40,
  toConsolidate: 15,
  pinCandidates: 6,
};

const PIN_REPOS = [
  { name: "fusion-ai", desc: "67-entity enterprise AI platform", lane: "flashfusion" },
  { name: "upe-priority-engine", desc: "WSJF/ROI/Severity scoring", lane: "flashfusion" },
  { name: "monk", desc: "Portfolio Command Center + n8n", lane: "personal" },
  { name: "chaos-club", desc: "Mental health peer support MVP", lane: "chaosclub" },
  { name: "source-of-truth-monorepo", desc: "MONOTURBO consolidation", lane: "flashfusion" },
  { name: "odyssey-learns", desc: "Learning platform", lane: "personal" },
];

const RED_FLAGS = [
  { severity: "critical", title: "16 INT repos are PUBLIC", desc: "Intinc branding visible. Employment/brand risk. Make private today.", count: 16 },
  { severity: "high", title: "5 Castle-Builder duplicates", desc: "Same project forked 5 times. Consolidate to 1.", count: 5 },
  { severity: "high", title: "4 Dashboard generator variants", desc: "DashBoardGen, DashGenVariant, DashLib-AI, InteliBuildDashGen. Pick one.", count: 4 },
  { severity: "medium", title: "35+ awesome-list forks", desc: "Zero value on profile. Use bookmarks.", count: 35 },
  { severity: "medium", title: "Signal buried in noise", desc: "20 real repos invisible among 610 forks/experiments.", count: 610 },
];

const KEEP_REPOS = [
  { name: "fusion-ai", lane: "flashfusion", cat: "base44-active", activity: "Active" },
  { name: "intinc-platform", lane: "int", cat: "original-active", activity: "Yesterday" },
  { name: "chaos-club", lane: "chaosclub", cat: "base44-active", activity: "3 days" },
  { name: "monk", lane: "personal", cat: "original-active", activity: "20 hours" },
  { name: "cowork", lane: "flashfusion", cat: "original-active", activity: "Yesterday" },
  { name: "source-of-truth-monorepo", lane: "flashfusion", cat: "original-active", activity: "Active" },
  { name: "continuum", lane: "flashfusion", cat: "original-active", activity: "BLOCKED" },
  { name: "upe-priority-engine", lane: "flashfusion", cat: "original-active", activity: "2 weeks" },
  { name: "infinity-heroes-bedtime-chronicles", lane: "kinsley", cat: "kinsley", activity: "19 hours" },
  { name: "tessa-ai", lane: "personal", cat: "base44-active", activity: "3 days" },
  { name: "ai-pr-review-system", lane: "personal", cat: "original-active", activity: "2 days" },
  { name: "vibe-coding-workshop", lane: "personal", cat: "original-active", activity: "4 days" },
  { name: "odyssey-learns", lane: "personal", cat: "original-active", activity: "Last week" },
  { name: "interact", lane: "int", cat: "base44-active", activity: "Active" },
  { name: "skills", lane: "flashfusion", cat: "reference-fork", activity: "16 hours" },
  { name: "awesome-claude-code", lane: "personal", cat: "reference-fork", activity: "2 hours" },
  { name: "flashfusion-marketing-hub-79", lane: "flashfusion", cat: "flashfusion", activity: "Last week" },
  { name: "Flashfusionwebsitev20", lane: "flashfusion", cat: "flashfusion", activity: "2 weeks" },
  { name: "teamsync", lane: "flashfusion", cat: "base44-active", activity: "5 days" },
  { name: "pixel-perfect", lane: "personal", cat: "original-active", activity: "2 weeks" },
  { name: "n8n", lane: "flashfusion", cat: "reference-fork", activity: "4 days" },
  { name: "vibecraft", lane: "personal", cat: "reference-fork", activity: "Yesterday" },
];

const CATEGORY_COUNTS = [
  { cat: "reference-fork", count: 280 },
  { cat: "awesome-list", count: 45 },
  { cat: "framework-fork", count: 60 },
  { cat: "base44-active", count: 4 },
  { cat: "base44-stale", count: 26 },
  { cat: "original-active", count: 20 },
  { cat: "original-stale", count: 80 },
  { cat: "kinsley", count: 20 },
  { cat: "int-public", count: 16 },
  { cat: "flashfusion", count: 16 },
  { cat: "scaffold", count: 30 },
  { cat: "replit", count: 10 },
  { cat: "duplicate", count: 15 },
];

const EXECUTION_STEPS = [
  { phase: "TODAY", time: "30 min", tasks: [
    "Make 16 INT repos private (gh repo edit --visibility private)",
    "Archive 35 awesome-* forks",
    "Archive 10 Replit mirrors",
    "Archive 4 Castle-Builder duplicates",
  ]},
  { phase: "THIS WEEK", time: "2 hours", tasks: [
    "Archive 60+ major framework forks (react, next.js, django, etc.)",
    "Archive 26 stale Base44 apps",
    "Archive 15 stale Kinsley projects",
    "Archive 25+ Lovable/Blink/v0 scaffolds",
  ]},
  { phase: "THIS MONTH", time: "4 hours", tasks: [
    "Archive 30+ AI/agent framework forks",
    "Archive 50+ misc tool forks",
    "Consolidate FlashFusion repos → fusion-ai + monorepo",
    "Update GitHub profile: bio, 6 pinned repos",
    "Migrate chaos-club → ChaosClubCo org",
  ]},
];

export default function RepoAuditDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedFlag, setExpandedFlag] = useState(null);

  const archivePercent = Math.round((SUMMARY.toArchive / SUMMARY.total) * 100);
  const keepPercent = Math.round((SUMMARY.toKeep / SUMMARY.total) * 100);

  return (
    <div style={{ fontFamily: "'Space Mono', 'JetBrains Mono', monospace", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { padding: 8px 16px; border: 1px solid #1e293b; background: transparent; color: #94a3b8; cursor: pointer; font-family: inherit; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.2s; border-radius: 0; }
        .tab-btn:hover { border-color: #3b82f6; color: #e2e8f0; }
        .tab-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
        .card { background: #111118; border: 1px solid #1e293b; padding: 16px; }
        .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-top: 4px; }
        .bar { height: 6px; border-radius: 3px; background: #1e293b; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .flag-card { padding: 12px 16px; border-left: 3px solid; cursor: pointer; transition: background 0.15s; }
        .flag-card:hover { background: #1a1a24; }
        .keep-row { display: flex; align-items: center; padding: 8px 12px; border-bottom: 1px solid #1e293b; font-size: 12px; }
        .keep-row:hover { background: #1a1a24; }
        .lane-badge { display: inline-block; padding: 2px 8px; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; border-radius: 2px; }
        .exec-phase { border: 1px solid #1e293b; margin-bottom: 12px; }
        .exec-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
        .exec-task { padding: 8px 16px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #0f0f18; display: flex; gap: 8px; align-items: flex-start; }
        .pin-card { background: #111118; border: 1px solid #1e293b; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
        .pin-card:hover { border-color: #3b82f6; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24, borderBottom: "1px solid #1e293b", paddingBottom: 16 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
          REPO AUDIT <span style={{ color: "#3b82f6" }}>///</span> KROSEBROOK
        </div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, letterSpacing: "1px" }}>
          630 REPOSITORIES → CATEGORIZED • CURATED • MAPPED • CONSOLIDATED
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "flags", label: "Red Flags" },
          { id: "keep", label: "Keep List" },
          { id: "pins", label: "Pin Config" },
          { id: "execute", label: "Execution" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Top Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { num: SUMMARY.total, label: "Total Repos", color: "#e2e8f0" },
              { num: SUMMARY.toArchive, label: "To Archive", color: "#ef4444" },
              { num: SUMMARY.toPrivatize, label: "Make Private", color: "#f59e0b" },
              { num: SUMMARY.toKeep, label: "Keep Active", color: "#10b981" },
              { num: SUMMARY.toConsolidate, label: "Consolidate", color: "#3b82f6" },
              { num: SUMMARY.pinCandidates, label: "Pin on Profile", color: "#8b5cf6" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: "center" }}>
                <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Before/After Bar */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>Before → After</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span>Current: {SUMMARY.total} visible repos</span>
                <span style={{ color: "#ef4444" }}>{archivePercent}% noise</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: "100%", background: "linear-gradient(90deg, #ef4444 0%, #ef4444 79%, #f59e0b 79%, #f59e0b 82%, #10b981 82%, #10b981 88%, #3b82f6 88%)" }} />
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 9, marginTop: 4, color: "#64748b" }}>
                <span>■ Archive ({archivePercent}%)</span>
                <span style={{ color: "#f59e0b" }}>■ Privatize</span>
                <span style={{ color: "#10b981" }}>■ Keep ({keepPercent}%)</span>
                <span style={{ color: "#3b82f6" }}>■ Consolidate</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span>Target: ~{SUMMARY.toKeep} visible repos</span>
                <span style={{ color: "#10b981" }}>100% signal</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${keepPercent + 5}%`, background: "#10b981" }} />
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>Category Breakdown</div>
            {CATEGORY_COUNTS.sort((a, b) => b.count - a.count).map((c, i) => {
              const cat = CATEGORIES[c.cat];
              const pct = Math.round((c.count / SUMMARY.total) * 100);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 20, textAlign: "center" }}>{cat.icon}</div>
                  <div style={{ width: 160, fontSize: 11, color: "#94a3b8" }}>{cat.label}</div>
                  <div style={{ flex: 1 }}>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                  <div style={{ width: 40, textAlign: "right", fontSize: 12, fontWeight: 700, color: cat.color }}>{c.count}</div>
                  <div style={{ width: 80, fontSize: 9, color: "#64748b", textAlign: "right" }}>{cat.action}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Red Flags Tab */}
      {activeTab === "flags" && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>Issues Requiring Action</div>
          {RED_FLAGS.map((f, i) => (
            <div
              key={i}
              className="flag-card"
              style={{
                borderColor: f.severity === "critical" ? "#ef4444" : f.severity === "high" ? "#f59e0b" : "#3b82f6",
                background: expandedFlag === i ? "#1a1a24" : "#111118",
                marginBottom: 8,
              }}
              onClick={() => setExpandedFlag(expandedFlag === i ? null : i)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{
                    fontSize: 9, textTransform: "uppercase", letterSpacing: "1.5px", marginRight: 8,
                    color: f.severity === "critical" ? "#ef4444" : f.severity === "high" ? "#f59e0b" : "#3b82f6",
                  }}>
                    {f.severity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</span>
                </div>
                <span style={{ fontSize: 11, color: "#64748b" }}>{f.count} repos</span>
              </div>
              {expandedFlag === i && (
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, paddingLeft: 60 }}>{f.desc}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Keep List Tab */}
      {activeTab === "keep" && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>
            Repos to Keep Active ({KEEP_REPOS.length})
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="keep-row" style={{ background: "#0f0f18", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b" }}>
              <div style={{ flex: 2 }}>Repository</div>
              <div style={{ flex: 1 }}>Lane</div>
              <div style={{ flex: 1 }}>Category</div>
              <div style={{ width: 80, textAlign: "right" }}>Activity</div>
            </div>
            {KEEP_REPOS.map((r, i) => {
              const lane = LANES[r.lane];
              const cat = CATEGORIES[r.cat];
              return (
                <div key={i} className="keep-row">
                  <div style={{ flex: 2, fontFamily: "'Space Mono', monospace", color: "#e2e8f0" }}>{r.name}</div>
                  <div style={{ flex: 1 }}>
                    <span className="lane-badge" style={{ background: lane.color + "22", color: lane.color, border: `1px solid ${lane.color}44` }}>
                      {lane.label}
                    </span>
                  </div>
                  <div style={{ flex: 1, color: "#64748b" }}>{cat.label}</div>
                  <div style={{ width: 80, textAlign: "right", color: r.activity === "BLOCKED" ? "#ef4444" : "#64748b", fontSize: 11 }}>
                    {r.activity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pin Config Tab */}
      {activeTab === "pins" && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>
            Recommended Pinned Repos (6 max)
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {PIN_REPOS.map((r, i) => {
              const lane = LANES[r.lane];
              return (
                <div key={i} className="pin-card">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>📌 {r.name}</span>
                      <span className="lane-badge" style={{ background: lane.color + "22", color: lane.color, border: `1px solid ${lane.color}44` }}>
                        {lane.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.desc}</div>
                  </div>
                  <div style={{ fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#3b82f6" }}>#{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 8 }}>Recommended Bio</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.6, padding: "8px 12px", background: "#0a0a0f", border: "1px solid #1e293b" }}>
              Self-taught Staff Engineer | Building externalized cognition systems | FlashFusion.co | Chaos Club Co. | 240+ tools as prosthetic memory
            </div>
          </div>
        </div>
      )}

      {/* Execution Tab */}
      {activeTab === "execute" && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", marginBottom: 12 }}>
            Consolidation Execution Plan
          </div>
          {EXECUTION_STEPS.map((step, i) => (
            <div key={i} className="exec-phase" style={{ background: "#111118" }}>
              <div className="exec-header">
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#3b82f6" }}>
                    {step.phase}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#64748b" }}>{step.time}</span>
              </div>
              {step.tasks.map((task, j) => (
                <div key={j} className="exec-task">
                  <span style={{ color: "#3b82f6" }}>→</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="card" style={{ marginTop: 16, borderColor: "#ef4444" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "2px", color: "#ef4444", marginBottom: 8 }}>⚠️ Do First</div>
            <div style={{ fontSize: 12, color: "#e2e8f0" }}>
              The INT repos being public is the only actual risk here. Everything else is cosmetic. Run the <code style={{ background: "#1e293b", padding: "2px 6px", fontSize: 11 }}>gh repo edit --visibility private</code> commands from the audit doc before anything else.
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 24, padding: "12px 0", borderTop: "1px solid #1e293b", fontSize: 10, color: "#475569", textAlign: "center", letterSpacing: "1px" }}>
        GENERATED APR 14 2026 • FULL AUDIT IN github-repo-audit.md • 630 → ~40 TARGET
      </div>
    </div>
  );
}
