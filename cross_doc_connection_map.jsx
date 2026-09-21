import { useState } from "react";

// Smoke test: click any colored line → detail panel appears below diagram
// All 5 edges clickable, FlashFusion node renders as ghost/dashed

const N = {
  memoir: { id: "memoir", cx: 350, cy: 95,  label: "Memoir Project",       sub: "PERSONAL",    color: "#f59a2a" },
  kb:     { id: "kb",     cx: 130, cy: 330,  label: "INT KB Automation",    sub: "INT",         color: "#8b5cf6" },
  ai:     { id: "ai",     cx: 570, cy: 330,  label: "AI Model Comparison",  sub: "CROSS",       color: "#22d3ee" },
  ff:     { id: "ff",     cx: 350, cy: 490,  label: "FlashFusion",          sub: "implied",     color: "#a855f7", ghost: true },
};

const EDGES = [
  {
    id: "prosthetic",
    from: "memoir", to: "kb",
    path: "M 318 153 C 240 215 158 258 130 308",
    lx: 210, ly: 220,
    color: "#22d3ee",
    label: "Prosthetic Architecture",
    badge: "★ Most Unexpected",
    headline: "The org has your brain",
    short:
      "Same failure mode (memory collapse) → same architectural response (external capture), expressed at personal and organizational scale simultaneously.",
    detail: `Memoir behavioral evidence: 240+ tools as "prosthetics for a brain that can't be trusted to remember."

INT KB automation goal: "Institutional knowledge walks out the door at ticket close."
The pipeline removes the memory dependency entirely.

Pipeline structures are identical:
  Personal:  event occurs → tool captures state → searchable later
  INT KB:    ticket resolves → webhook → LLM → structured KB article

You've been solving the same problem at two scales without naming the connection.
The memoir's central thesis is already running in production at INT.`,
    docs: [
      'Memoir: "Technology as scaffolding for a brain that can\'t be trusted to remember"',
      'KB Doc: "Institutional knowledge walks out the door at ticket close"',
    ],
  },
  {
    id: "constitutional",
    from: "memoir", to: "ai",
    path: "M 382 153 C 460 215 542 258 570 308",
    lx: 492, ly: 222,
    color: "#8b5cf6",
    label: "Constitutional DNA",
    badge: "Cross-Lane Pattern",
    headline: "Your cognitive requirements = Constitutional AI training goals",
    short:
      "Kyle's damage-response design requirements and Anthropic's Constitutional AI targets are aimed at identical outcomes — arrived at from completely different starting points.",
    detail: `Memoir behavioral evidence documents Kyle's system requirements:
  • "No placeholders" — reality must be checkable
  • "Explicit uncertainty labeling" — won't accept vague information
  • "Anti-hallucination fixation" — verification gates on every output
  • "Won't flip position without new evidence"

AI Comparison report on Claude's Constitutional AI:
  • "Position Stability" — refuses to change answer under pressure without evidence
  • "Uncertainty Calibration" — explicitly admits confidence limits
  • "Honest Pushback" — won't validate flawed logic to maintain approval

Same requirements. You arrived at them from cognitive necessity.
Anthropic arrived at them from training philosophy.
You didn't choose Claude because you read the whitepapers.
You chose it because it's built like you are.`,
    docs: [
      'Memoir: "Anti-hallucination fixation as epistemic adaptation"',
      'AI Compare: "Position Stability: Refuses to change an answer under pressure"',
    ],
  },
  {
    id: "knowledgeos",
    from: "kb", to: "ai",
    path: "M 204 338 C 312 378 428 378 496 338",
    lx: 350, ly: 381,
    color: "#f59a2a",
    label: "Knowledge OS",
    badge: "Same Concept × 2 Docs",
    headline: "The theory and the running build are the same project",
    short:
      "The AI comparison frames \"Knowledge OS\" as aspirational enterprise architecture. The KB automation is building exactly that, right now, for $1-5/month.",
    detail: `AI Comparison report: "AI evolving into a Knowledge OS — ingesting disparate
data sources, identifying non-obvious through-lines across them."
Framed as future enterprise architecture worth strategic investment.

INT KB Business Case: building that exact system on existing stack.
Ticket data in → structured knowledge out → searchable institutionally.
Both documents written by you. Neither references the other.

Positioning upgrade available:
  Frame the INT KB pipeline not as "service desk automation"
  but as "Knowledge OS implementation."

That's the vocabulary that makes this a FlashFusion-tier engagement
rather than a ticket in Kyle's personal backlog.`,
    docs: [
      'AI Compare: "AI evolving from chat interface into a Knowledge OS"',
      'KB Doc: "structured internal KB article in under 90 seconds"',
    ],
  },
  {
    id: "proofofconcept",
    from: "kb", to: "ff",
    path: "M 163 352 C 200 425 278 458 318 480",
    lx: 228, ly: 425,
    color: "#a855f7",
    label: "Proof of Concept Live",
    badge: "→ Revenue Path",
    headline: "INT is FlashFusion's first case study — and the client is you",
    short:
      "The INT KB pipeline is structurally identical to a FlashFusion AI enablement deliverable. The business case you wrote internally is the FlashFusion proposal template.",
    detail: `INT KB pipeline:
  trigger → webhook → LLM → structured article → FreshService API

FlashFusion AI enablement deliverable:
  client trigger → integration → LLM → structured output → client platform API

The business case already includes:
  • Stakeholder analysis (5-persona review)
  • Cost model ($9,500+/yr savings vs. Freddy AI)
  • Risk register with mitigations
  • Phased implementation plan
  • Pre-build verification checklist

That's a FlashFusion proposal template.
You've already built the proof, validated the ROI, and cleared an approval chain.

What INT paid in build time, FlashFusion can scope as a $3–8K engagement
with a live case study from a real MSP client.`,
    docs: [
      'KB Doc: "Estimated monthly cost: $1-5 (LLM tokens only)"',
      'Memory: "INT KB automation is structurally equivalent to a FlashFusion PoC"',
    ],
  },
  {
    id: "samethesis",
    from: "memoir", to: "ff",
    path: "M 322 153 C 248 272 262 390 322 478",
    lx: 260, ly: 316,
    color: "#10b981",
    label: "Same Thesis",
    badge: "Deep Structural Pattern",
    headline: "The memoir and the business are the same argument",
    short:
      '"Building for others what built for self" -- the memoir\'s conclusion and FlashFusion\'s premise are the same transfer of methodology running at different altitudes.',
    detail: `Memoir conclusion: "Chaos Club isn't separate from Kyle's story -- it's an artifact of it."
FlashFusion premise: AI enablement consulting and tooling for teams.

Both argue: external systems aren't workarounds -- they're legitimate architecture.

  Memoir scale:      "Here's how I survived by building systems instead of recovering"
  FlashFusion scale: "Here's how your org can build instead of burning out"

The evidence base is identical: your behavioral patterns across thousands of AI
interactions, documented as proof that construction works.

The book is the proof of concept.
The business is the product.
They're the same argument at different scales -- and neither is the other's footnote.`,
    docs: [
      'Memoir: "Chaos Club isn\'t separate from Kyle\'s story -- it\'s an artifact of it"',
      'Memoir: "a book that helps others who\'ve had to construct rather than recover"',
    ],
  },
];

function edgeOpacity(edgeId, selected, hovered) {
  if (!selected && !hovered) return 0.65;
  if (edgeId === selected || edgeId === hovered) return 1;
  return 0.15;
}

export default function ConnectionMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const sel = EDGES.find((e) => e.id === selected);

  return (
    <div
      style={{
        background: "hsl(240 8% 6%)",
        minHeight: "100vh",
        padding: "24px 20px",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "hsl(240 5% 92%)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .edge-hit { cursor: pointer; }
        .detail-panel { animation: fadeUp 0.18s ease; }
        pre { margin: 0; }
        button:hover { background: hsl(240 8% 16%) !important; color: hsl(240 5% 75%) !important; }
        .edge-badge { display: inline-block; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ fontSize: "17px", fontWeight: 700, fontFamily: "'Space Grotesk', system-ui, sans-serif", margin: 0, letterSpacing: "-0.3px" }}>
          Cross-Document Pattern Analysis
        </h1>
        <p style={{ fontSize: "12px", color: "hsl(240 4% 48%)", margin: "4px 0 0" }}>
          3 Drive documents &nbsp;·&nbsp; 5 structural connections &nbsp;·&nbsp; Click any edge to explore
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "14px" }}>
        {Object.values(N).map((n) => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: n.color, opacity: n.ghost ? 0.55 : 1 }} />
            <span style={{ fontSize: "11px", color: "hsl(240 4% 55%)", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {n.label}{n.ghost ? " *" : ""}
            </span>
          </div>
        ))}
        <span style={{ fontSize: "11px", color: "hsl(240 4% 38%)", marginLeft: "4px" }}>* opportunity node, not a doc</span>
      </div>

      {/* SVG Diagram */}
      <svg
        viewBox="0 0 700 555"
        style={{ width: "100%", maxWidth: "700px", display: "block", overflow: "visible" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Edges */}
        {EDGES.map((e) => {
          const n2 = N[e.to];
          const active = e.id === selected || e.id === hovered;
          const op = edgeOpacity(e.id, selected, hovered);
          return (
            <g key={e.id}>
              {/* Wide invisible hit area */}
              <path
                d={e.path}
                stroke="transparent"
                strokeWidth="22"
                fill="none"
                className="edge-hit"
                onClick={() => setSelected(selected === e.id ? null : e.id)}
                onMouseEnter={() => setHovered(e.id)}
                onMouseLeave={() => setHovered(null)}
              />
              {/* Visible stroke */}
              <path
                d={e.path}
                stroke={e.color}
                strokeWidth={active ? 2.5 : 1.5}
                fill="none"
                opacity={op}
                strokeDasharray={n2.ghost ? "6 4" : undefined}
                style={{ transition: "all 0.18s ease", pointerEvents: "none" }}
              />
              {/* Arrowhead approximation — small circle at destination */}
              {active && (
                <circle
                  cx={parseFloat(e.path.split(" ").at(-2))}
                  cy={parseFloat(e.path.split(" ").at(-1))}
                  r="4"
                  fill={e.color}
                  opacity={0.85}
                  style={{ pointerEvents: "none" }}
                />
              )}
              {/* Edge label */}
              <text
                x={e.lx}
                y={e.ly}
                textAnchor="middle"
                fill={e.color}
                fontSize="10"
                fontFamily="'Space Grotesk', system-ui, sans-serif"
                fontWeight="600"
                opacity={op}
                style={{ transition: "opacity 0.18s ease", pointerEvents: "none" }}
              >
                {e.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {Object.values(N).map((n) => (
          <g key={n.id} opacity={n.ghost ? 0.65 : 1}>
            {/* Node card */}
            <rect
              x={n.cx - 74}
              y={n.cy - 32}
              width={148}
              height={64}
              rx="9"
              fill="hsl(240 8% 11%)"
              stroke={n.color}
              strokeWidth={n.ghost ? 1.2 : 2}
              strokeDasharray={n.ghost ? "5 3" : undefined}
            />
            {/* Lane pill */}
            <rect
              x={n.cx - 32}
              y={n.cy - 22}
              width={64}
              height={13}
              rx="3"
              fill={n.color}
              opacity={0.18}
            />
            <text
              x={n.cx}
              y={n.cy - 11}
              textAnchor="middle"
              fill={n.color}
              fontSize="9"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontWeight="700"
              letterSpacing="0.5"
            >
              {n.sub.toUpperCase()}
            </text>
            {/* Node label */}
            <text
              x={n.cx}
              y={n.cy + 10}
              textAnchor="middle"
              fill="hsl(240 5% 92%)"
              fontSize="12"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontWeight="600"
            >
              {n.label}
            </text>
            {n.ghost && (
              <text
                x={n.cx}
                y={n.cy + 24}
                textAnchor="middle"
                fill="hsl(240 4% 42%)"
                fontSize="10"
                fontFamily="'Inter', system-ui, sans-serif"
              >
                opportunity node
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Detail panel */}
      {sel ? (
        <div
          className="detail-panel"
          style={{
            marginTop: "14px",
            maxWidth: "700px",
            background: "hsl(240 8% 10%)",
            border: `1px solid ${sel.color}30`,
            borderRadius: "10px",
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                background: sel.color,
                color: "#000",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "4px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {sel.badge}
            </span>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                color: "hsl(240 5% 92%)",
                lineHeight: 1.3,
              }}
            >
              {sel.headline}
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "hsl(240 4% 68%)", margin: "0 0 12px", lineHeight: 1.65 }}>
            {sel.short}
          </p>
          <pre
            style={{
              fontSize: "12px",
              color: "hsl(240 4% 60%)",
              background: "hsl(240 8% 7%)",
              borderRadius: "6px",
              padding: "14px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.7,
              fontFamily: "'Inter', 'SF Mono', monospace",
              border: "1px solid hsl(240 8% 14%)",
            }}
          >
            {sel.detail}
          </pre>
          {/* Source refs */}
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {sel.docs.map((d, i) => (
              <div key={i} style={{ fontSize: "11px", color: "hsl(240 4% 42%)", fontFamily: "'Inter', system-ui, sans-serif" }}>
                <span style={{ color: "hsl(240 4% 30%)", marginRight: "6px" }}>▸</span>
                {d}
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginTop: "14px",
              background: "transparent",
              border: "1px solid hsl(240 8% 20%)",
              color: "hsl(240 4% 45%)",
              borderRadius: "5px",
              padding: "5px 12px",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: "all 0.15s ease",
            }}
          >
            ← close
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "12px",
            maxWidth: "700px",
            padding: "12px 16px",
            background: "hsl(240 8% 9%)",
            borderRadius: "8px",
            border: "1px solid hsl(240 8% 14%)",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px", color: "hsl(240 4% 40%)", lineHeight: 1.5 }}>
            Click any connection line to explore the pattern. Dashed lines point toward the implied FlashFusion opportunity.
          </p>
        </div>
      )}

      {/* Data quality flag */}
      <div
        style={{
          marginTop: "14px",
          maxWidth: "700px",
          padding: "13px 18px",
          background: "hsl(32 70% 7%)",
          borderRadius: "8px",
          border: "1px solid hsl(32 70% 20%)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "hsl(32 90% 62%)",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            marginBottom: "5px",
            letterSpacing: "0.2px",
          }}
        >
          ⚠ Data Quality Flag — AI Comparison Report
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "hsl(32 50% 58%)", lineHeight: 1.65 }}>
          This document contains at least one verifiable hallucination:{" "}
          <strong style={{ color: "hsl(32 90% 70%)" }}>
            "Claude Buddy, a Tamagotchi-style terminal pet with CHAOS and SNARK stats"
          </strong>{" "}
          does not exist in Claude Code. The report appears to be AI-generated (likely ChatGPT — structural tells: confident fabrications mixed with real Kyle-specific observations, framing that positions Claude as a competitor). Real observations about your setup are present, but unverified specifics (8.2 GB image size, 70+ MCP risk claims) require independent confirmation before use in any external or enterprise document.
        </p>
      </div>
    </div>
  );
}
