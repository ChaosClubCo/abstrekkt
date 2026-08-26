import { useState, useEffect } from "react";

const handleKeyActivate = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
};

const focusRing = {
  outline: "2px solid #A855F7",
  outlineOffset: "2px",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

const comparisons = [
  {
    task: "Legacy Code Refactoring",
    icon: "🔄",
    without: "Manual, line-by-line rewriting across files. High error rate. Days to weeks for large codebases.",
    withCode: "Context-aware multi-file refactoring. Cross-module dependency analysis. Claude reasons about architecture before changing code. Opus 4.7 agent teams can parallelize across subsystems.",
    impact: "Days → Hours",
    impactColor: "#22D3EE"
  },
  {
    task: "Code Review",
    icon: "🔍",
    without: "Manual reviews with slow feedback loops. Inconsistent coverage. Reviewer fatigue on large PRs.",
    withCode: "AI-assisted reviews with auto-suggestions. PR monitoring with auto-fix for failing CI checks. Auto-merge when all checks pass. GitHub Actions integration for headless review.",
    impact: "Hours → Minutes",
    impactColor: "#22D3EE"
  },
  {
    task: "Debugging",
    icon: "🐛",
    without: "Manual log analysis. Grep through files. Reproduce → hypothesize → test cycle. Context scattered across tools.",
    withCode: "Pipe logs directly (cat logs.txt | claude). Root cause identification across codebase. Hotfix generation with full project context. Subagents for parallel investigation.",
    impact: "Hours → Minutes",
    impactColor: "#22D3EE"
  },
  {
    task: "Test Suite Creation",
    icon: "✅",
    without: "Write each test manually. Coverage gaps. Tedious mock setup. Often skipped under deadline pressure.",
    withCode: "Automated test generation from codebase analysis. Unit, integration, and smoke tests. Context-aware assertions. /test slash command for instant generation.",
    impact: "Days → Hours",
    impactColor: "#22D3EE"
  },
  {
    task: "DevOps & CI/CD Scripts",
    icon: "⚙️",
    without: "Hand-written shell scripts. Error-prone YAML configs. Trial-and-error pipeline debugging.",
    withCode: "Automated script generation for GitHub Actions, Jenkins, etc. Claude reasons about deployment targets and dependencies. Headless mode for CI pipeline integration.",
    impact: "Hours → Minutes",
    impactColor: "#22D3EE"
  },
  {
    task: "Data Science Pipelines",
    icon: "📊",
    without: "Coding from scratch. Slow error-checking. Manual conversion from notebooks to production code.",
    withCode: "Convert research/notebook code to production pipelines. Dependency management. Schema validation built in. Batch API for bulk processing at 50% cost.",
    impact: "1-2 Days → Hours",
    impactColor: "#22D3EE"
  },
  {
    task: "Documentation",
    icon: "📄",
    without: "Written as afterthought. Out of date within weeks. Inconsistent format across repos.",
    withCode: "Auto-generated docs from codebase analysis. READMEs, API docs, inline comments. /doc slash command. Skills packages for team-standard formats.",
    impact: "Hours → Minutes",
    impactColor: "#22D3EE"
  },
  {
    task: "Multi-Project Coordination",
    icon: "🔀",
    without: "Context-switch between repos manually. Lose track of changes. No unified view of parallel work.",
    withCode: "Parallel sessions via git worktrees. Multi-repo remote sessions. Each session isolated but launchable from one GUI. Session portability across Desktop, Web, Mobile.",
    impact: "Fragmented → Unified",
    impactColor: "#A855F7"
  },
];

export default function ClaudeCodeComparison() {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? "none" : "all 0.2s";

  return (
    <div style={{
      fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#0B0B14",
      minHeight: "100vh",
      color: "#C7C7D1",
      padding: "24px"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            <span style={{
              background: "linear-gradient(135deg, #A855F7 0%, #EC4899 55%, #22D3EE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Claude Code</span>
            <span style={{ color: "#C7C7D1" }}> Impact Matrix</span>
          </h1>
          <p style={{ color: "#7E7E8A", fontSize: 13, marginTop: 6 }}>
            Before & after across {comparisons.length} core development workflows
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
            {["cards", "table"].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: viewMode === mode ? "2px solid #A855F7" : "1px solid rgba(139,92,246,0.12)",
                  background: viewMode === mode ? "rgba(168,85,247,0.1)" : "#13131F",
                  color: viewMode === mode ? "#A855F7" : "#8A8A96",
                  fontSize: 13,
                  fontWeight: viewMode === mode ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "'Geist', sans-serif"
                }}
              >
                {mode === "cards" ? "Card View" : "Table View"}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "cards" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {comparisons.map((c, i) => {
              const isExpanded = expandedIdx === i;
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${c.task} — Impact: ${c.impact}`}
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  onKeyDown={handleKeyActivate(() => setExpandedIdx(isExpanded ? null : i))}
                  onFocus={e => { Object.assign(e.currentTarget.style, focusRing); }}
                  onBlur={e => { e.currentTarget.style.outline = "none"; }}
                  style={{
                    background: "rgba(19,19,31,0.8)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 10,
                    border: isExpanded ? "1px solid rgba(168,85,247,0.35)" : "1px solid rgba(139,92,246,0.12)",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: transition
                  }}
                >
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{c.task}</span>
                    </div>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: c.impactColor,
                      background: `${c.impactColor}15`,
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontFamily: "'Geist Mono', monospace"
                    }}>
                      {c.impact}
                    </span>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{
                        padding: 16, borderRadius: 8,
                        background: "rgba(236,72,153,0.06)",
                        border: "1px solid rgba(236,72,153,0.15)"
                      }}>
                        <div style={{ fontSize: 11, color: "#EC4899", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontFamily: "'Geist Mono', monospace" }}>
                          Without Claude Code
                        </div>
                        <div style={{ fontSize: 13, color: "#8A8A96", lineHeight: 1.6 }}>{c.without}</div>
                      </div>
                      <div style={{
                        padding: 16, borderRadius: 8,
                        background: "rgba(34,211,238,0.06)",
                        border: "1px solid rgba(34,211,238,0.15)"
                      }}>
                        <div style={{ fontSize: 11, color: "#22D3EE", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontFamily: "'Geist Mono', monospace" }}>
                          With Claude Code on Desktop
                        </div>
                        <div style={{ fontSize: 13, color: "#8A8A96", lineHeight: 1.6 }}>{c.withCode}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(139,92,246,0.12)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#7E7E8A", fontWeight: 600, fontFamily: "'Geist Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>Task</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#EC4899", fontWeight: 600, fontFamily: "'Geist Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>Without</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "#22D3EE", fontWeight: 600, fontFamily: "'Geist Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>With Claude Code</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", color: "#A855F7", fontWeight: 600, fontFamily: "'Geist Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>Impact</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, whiteSpace: "nowrap", color: "#fff" }}>
                      {c.icon} {c.task}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#8A8A96", lineHeight: 1.5 }}>{c.without}</td>
                    <td style={{ padding: "12px 16px", color: "#8A8A96", lineHeight: 1.5 }}>{c.withCode}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: c.impactColor,
                        background: `${c.impactColor}15`,
                        padding: "4px 12px", borderRadius: 12,
                        fontFamily: "'Geist Mono', monospace"
                      }}>
                        {c.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Source Note */}
        <div style={{
          marginTop: 24,
          padding: "12px 16px",
          background: "rgba(168,85,247,0.06)",
          border: "1px solid rgba(168,85,247,0.15)",
          borderRadius: 8,
          fontSize: 12,
          color: "#8A8A96"
        }}>
          <strong style={{ color: "#A855F7" }}>Source note:</strong> Use case matrix adapted from Claude Code Desktop capabilities documentation. 
          Impact estimates are directional — Anthropic has not published specific multiplier benchmarks. 
          Features verified against code.claude.com/docs as of May 2026.
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#7E7E8A", fontFamily: "'Geist Mono', monospace" }}>
          FlashFusion · Claude Ecosystem Intelligence · May 2026
        </div>
      </div>
    </div>
  );
}
