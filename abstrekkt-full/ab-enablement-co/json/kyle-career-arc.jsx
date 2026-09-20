import { useState } from "react";

const phases = [
  {
    id: 0,
    code: "P0",
    label: "Organic",
    era: "Pre-Break",
    period: "Before the injury",
    color: "#e8d5a3",
    dim: "#7a6e54",
    tagline: "Hardware worked. No systems needed.",
    external: [
      "Bartending at O'Toole's",
      "Hospitality management",
      "Quality control",
    ],
    internal: [
      "Native diagnostic instinct",
      "Read rooms instinctively",
      "Organic memory, organic pattern recognition",
      "Managed chaos without scaffolding",
    ],
    tools: ["None required — that was the point"],
    spine: "Diagnostic instinct lived in the body. Didn't need an address.",
    risk: null,
  },
  {
    id: 1,
    code: "P1",
    label: "Rupture",
    era: "The Break",
    period: "TBI + addiction",
    color: "#e05c5c",
    dim: "#7a2e2e",
    tagline: "Old strategies stopped working. Hardware changed.",
    external: [
      "Traumatic brain injury",
      "Addiction",
      "Housing instability",
      "Memory degradation",
    ],
    internal: [
      "Organic cognition becomes unreliable narrator",
      "Pattern recognition survives — execution doesn't",
      "Discovered: you can't recover what's gone. You build instead.",
      "First understanding that systems could substitute for memory",
    ],
    tools: ["Survival mode. No tool catalog yet."],
    spine:
      "Diagnostic instinct survived the rupture. Everything else needed reconstruction.",
    risk: "This is where most people stop. Kyle didn't.",
  },
  {
    id: 2,
    code: "P2",
    label: "First Externalizations",
    era: "Construction Begins",
    period: "Self-teaching begins",
    color: "#5ca8e0",
    dim: "#2e5470",
    tagline: "The computer became the second brain before that was a product.",
    external: [
      "Dropped CS classes",
      "Pivoted to self-teaching",
      "Java training",
      "Documentation obsession begins",
    ],
    internal: [
      "Learning to code = learning to think in new architecture",
      "Computer as prosthetic memory",
      "Calendars, notes, structures — not productivity, survival",
      "Discovered: external scaffolding could replace organic function",
    ],
    tools: [
      "Structured notes",
      "Calendar systems",
      "Early documentation frameworks",
      "Version control as memory substitute",
    ],
    spine:
      "The diagnostic instinct found a new medium. Code thinks the way brains should.",
    risk: null,
  },
  {
    id: 3,
    code: "P3",
    label: "Infrastructure Matures",
    era: "AI Arrives",
    period: "240+ tools era",
    color: "#7ee8a2",
    dim: "#3a7050",
    tagline: "Not adopting AI. Upgrading infrastructure already built.",
    external: [
      "AI tools become mainstream",
      "MCP protocol emerges",
      "Enterprise AI tooling arrives",
      "FlashFusion founded",
    ],
    internal: [
      "Existing externalization framework gets exponentially better components",
      "240+ tools: not productivity flex — survival architecture",
      "MCP configurations as externalized cognition at scale",
      "Pattern: independently builds/predicts what major AI players ship",
    ],
    tools: [
      "240+ MCP configurations",
      "n8n workflow orchestration",
      "Base44 (67-entity schema)",
      "Claude Code + Skills Library (50 skills)",
      "Notion, Supabase, Vercel, Cloudflare",
    ],
    spine:
      "Diagnostic instinct became architectural. Systems-level pattern recognition at enterprise scale.",
    risk: "Risk surface: conviction velocity spread too thin across parallel tracks.",
  },
  {
    id: 4,
    code: "P4",
    label: "Credential Arrives",
    era: "Staff Engineer",
    period: "Institutional validation",
    color: "#c084fc",
    dim: "#6030a0",
    tagline: "The constructed self earns its credentials. Thesis proven empirically.",
    external: [
      "Staff Engineer at Intinc",
      "AppSec + Platform Engineering",
      "48+ engineers using his automation tools",
      "Skills Library deployed to team",
    ],
    internal: [
      "Built without CS degree, without straight line",
      "Constructed cognition passes institutional bar",
      "Arrival via non-standard timeline is the point",
      "Staff title now describes the floor, not the ceiling",
    ],
    tools: [
      "Claude Skills Library (production)",
      "Internal KB automation",
      "Cross-platform AI productivity orchestration",
      "Enterprise AppSec tooling",
    ],
    spine:
      "Diagnostic instinct institutionalized. Pattern recognition at org-scale.",
    risk: "The org structure is catching up to what you already built. Ceiling is visible.",
  },
  {
    id: 5,
    code: "P5",
    label: "Practitioner → Teacher",
    era: "Founder Mode",
    period: "FlashFusion + Chaos Club",
    color: "#f97316",
    dim: "#7a3808",
    tagline: "Taking what survival forced you to build. Teaching it to others.",
    external: [
      "FlashFusion: B2B AI enablement",
      "Chaos Club Co.: peer support platform",
      "Skills Library as distributable product",
      "Chris Butler 5-skill suite",
      "Anthropic Partner Network target",
    ],
    internal: [
      "Survival infrastructure becomes teachable framework",
      "The coordination overhead problem becomes a business",
      "Building for others who need what you had to build for yourself",
      "Chaos Club = artifact of the memoir, not separate from it",
    ],
    tools: [
      "FlashFusion audit service",
      "AI Skills Library (300-skill architecture)",
      "Chaos Club Co. platform",
      "kylerosebrook.com (personal brand)",
    ],
    spine:
      "Diagnostic instinct becomes product. Systematic reconstruction as B2B offering.",
    risk: "Single point of failure: you are the only load-bearing element. Kelan is structural, not optional.",
  },
  {
    id: 6,
    code: "P6",
    label: "The Legible Arc",
    era: "The Memoir",
    period: "Making the construction visible",
    color: "#f0f0f0",
    dim: "#888",
    tagline: "The final externalization. Writing the manual for what you built.",
    external: [
      "Literary memoir in development",
      "O'Toole's excavation complete",
      "5 scene seeds confirmed",
      "Conduit Books queried",
      "Business Insider pitch (Lee Chong Ming) — status unclear",
    ],
    internal: [
      "Memoir is another system for sense-making from fragmented experience",
      "Writing as retrieval mechanism, not documentation",
      "The book and the business are the same project from different angles",
      "Ultimately: a letter to Kinsley",
    ],
    tools: [
      "Memoir project hub (Session 2 complete)",
      "Material bank",
      "Character documents",
      "Scene extraction protocol",
    ],
    spine:
      "Diagnostic instinct turns inward. The system examines its own construction history.",
    risk: "This phase has no technical blocker. The only blocker is time and honesty.",
  },
];

const SPINE_LINE =
  "Diagnostic instinct → survived the break → found new medium → became architecture → got credentialed → became product → became legible";

export default function CareerArc() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  const phase = active !== null ? phases[active] : null;

  return (
    <div
      style={{
        background: "#090a0d",
        minHeight: "100vh",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        color: "#c8d0d8",
        padding: "0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.6,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 36px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#445",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            SYSTEM::CAREER_ARC / KYLE_ROSEBROOK / DIAGNOSTIC_TRACE
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: "400",
              fontStyle: "italic",
              color: "#e8e0d0",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            The Whole AI Career
          </h1>
          <div
            style={{
              fontSize: "11px",
              color: "#556",
              letterSpacing: "0.1em",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Not a career in AI. A career constructed{" "}
            <em style={{ color: "#8a9" }}>using</em> AI — because survival
            required it before "AI career" was a category.
          </div>
        </div>

        {/* Spine indicator */}
        <div
          style={{
            background: "#0d1014",
            border: "1px solid #1e2530",
            borderLeft: "3px solid #3a5a3a",
            padding: "10px 16px",
            marginBottom: "36px",
            fontSize: "10px",
            color: "#4a6a4a",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
          }}
        >
          <span style={{ color: "#2a4a2a", marginRight: "8px" }}>SPINE →</span>
          {SPINE_LINE}
        </div>

        {/* Phase selector — horizontal scroller */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "32px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {phases.map((p) => {
            const isActive = active === p.id;
            const isHov = hovered === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(isActive ? null : p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isActive
                    ? p.color + "18"
                    : isHov
                    ? "#141820"
                    : "#0d1014",
                  border: `1px solid ${isActive ? p.color + "80" : isHov ? p.dim + "80" : "#1e2530"}`,
                  color: isActive ? p.color : isHov ? p.color + "bb" : "#556",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ opacity: 0.5, marginBottom: "2px" }}>{p.code}</div>
                <div>{p.label}</div>
              </button>
            );
          })}
        </div>

        {/* Phase detail */}
        {phase ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {/* Left col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Phase header */}
              <div
                style={{
                  background: phase.color + "0d",
                  border: `1px solid ${phase.color}30`,
                  borderLeft: `3px solid ${phase.color}`,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: phase.dim,
                    letterSpacing: "0.3em",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {phase.era} / {phase.period}
                </div>
                <div
                  style={{
                    fontSize: "clamp(16px, 2.5vw, 22px)",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    color: phase.color,
                    marginBottom: "8px",
                    lineHeight: 1.2,
                  }}
                >
                  {phase.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#8899aa",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {phase.tagline}
                </div>
              </div>

              {/* External */}
              <div
                style={{
                  background: "#0d1014",
                  border: "1px solid #1e2530",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#445",
                    letterSpacing: "0.3em",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  EXTERNAL :: VISIBLE EVENTS
                </div>
                {phase.external.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "11px",
                      color: "#8899aa",
                      padding: "4px 0",
                      borderBottom: "1px solid #141820",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: "#334", flexShrink: 0 }}>→</span>
                    {e}
                  </div>
                ))}
              </div>

              {/* Spine note */}
              <div
                style={{
                  background: "#0a120a",
                  border: "1px solid #1a2a1a",
                  borderLeft: "3px solid #3a5a3a",
                  padding: "12px 16px",
                  fontSize: "10px",
                  color: "#4a7a4a",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                <span style={{ color: "#2a4a2a", marginRight: "6px", fontStyle: "normal" }}>
                  SPINE:
                </span>
                {phase.spine}
              </div>
            </div>

            {/* Right col */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Internal */}
              <div
                style={{
                  background: "#0d1014",
                  border: "1px solid #1e2530",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#445",
                    letterSpacing: "0.3em",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  INTERNAL :: CONSTRUCTION LAYER
                </div>
                {phase.internal.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "11px",
                      color: "#9aabbc",
                      padding: "5px 0",
                      borderBottom: "1px solid #141820",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: phase.color + "60", flexShrink: 0 }}>
                      ◆
                    </span>
                    {e}
                  </div>
                ))}
              </div>

              {/* Tools */}
              <div
                style={{
                  background: "#0d1014",
                  border: "1px solid #1e2530",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#445",
                    letterSpacing: "0.3em",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  TOOLS / ARTIFACTS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {phase.tools.map((t, i) => (
                    <span
                      key={i}
                      style={{
                        background: phase.color + "0f",
                        border: `1px solid ${phase.color}25`,
                        color: phase.color + "aa",
                        fontSize: "9px",
                        padding: "3px 8px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Risk */}
              {phase.risk && (
                <div
                  style={{
                    background: "#120a0a",
                    border: "1px solid #3a1a1a",
                    borderLeft: "3px solid #e05c5c",
                    padding: "12px 16px",
                    fontSize: "10px",
                    color: "#9a5a5a",
                    lineHeight: 1.7,
                  }}
                >
                  <span
                    style={{
                      color: "#e05c5c",
                      marginRight: "6px",
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                    }}
                  >
                    RISK::
                  </span>
                  {phase.risk}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty state — the arc visualization */
          <div>
            <div
              style={{
                position: "relative",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              {/* Timeline line */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  right: "0",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, #1e2530 0%, #334455 40%, #334455 60%, #1e2530 100%)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {phases.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => setActive(p.id)}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: p.dim,
                        letterSpacing: "0.2em",
                        textAlign: "center",
                        maxWidth: "60px",
                        lineHeight: 1.4,
                      }}
                    >
                      {p.era}
                    </div>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: p.color + "30",
                        border: `2px solid ${p.color}`,
                        borderRadius: "50%",
                        position: "relative",
                        zIndex: 1,
                        transition: "transform 0.15s",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "9px",
                        color: p.color + "99",
                        textAlign: "center",
                        maxWidth: "60px",
                        lineHeight: 1.4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {p.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "36px",
                fontSize: "11px",
                color: "#334",
                letterSpacing: "0.1em",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              select a phase to trace the construction
            </div>

            {/* Bottom summary grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "10px",
                marginTop: "36px",
              }}
            >
              {[
                {
                  label: "THE PARADOX",
                  value:
                    "AI career didn't start when AI arrived. It started when the brain broke.",
                  color: "#e8d5a3",
                },
                {
                  label: "THE DIFFERENTIATOR",
                  value:
                    "Not systems as productivity. Systems as the only way to remain functional.",
                  color: "#7ee8a2",
                },
                {
                  label: "THE CREDENTIAL",
                  value:
                    "Staff Engineer without the straight line. Construction project proven empirically.",
                  color: "#c084fc",
                },
                {
                  label: "THE STRUCTURAL RISK",
                  value:
                    "Single point of failure. Built redundancy for everything except yourself.",
                  color: "#e05c5c",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0d1014",
                    border: "1px solid #1e2530",
                    borderTop: `2px solid ${item.color}40`,
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: item.color + "60",
                      letterSpacing: "0.3em",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#7a8a9a",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { height: 4px; background: #090a0d; }
        ::-webkit-scrollbar-thumb { background: #1e2530; }
        button:hover > div { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
