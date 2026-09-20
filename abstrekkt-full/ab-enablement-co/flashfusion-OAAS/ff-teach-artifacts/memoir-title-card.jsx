import { useState, useEffect } from "react";

const THESIS = "How does a person whose mind has been broken — by choice, by injury, by circumstance — rebuild agency not through recovery of what was lost, but through construction of what never existed?";

const SCENES = [
  { label: "Age Oscillation", status: "confirmed", note: "19 or 21 — memory as unreliable narrator" },
  { label: "Relief Line", status: "confirmed", note: '"No one tells you that relief is the most addictive feeling of all."' },
  { label: "Late-Night Walk, Age 17", status: "needs verification", note: "Counting streetlights. Pattern-seeking before it had a name." },
  { label: "Couch Permission Scene", status: "confirmed", note: "Not peer pressure — permission. First use as silence." },
  { label: "Monitor Reflection", status: "confirmed", note: "Dark screen to lit screen. The constructed self arriving." },
];

const REJECTED = [
  { label: "Breathe Through the Bullshit", reason: "Chaos Club Book 1 title — belongs there" },
  { label: "Built, Not Recovered", reason: "Accurate, less accessible" },
  { label: "Obstacle-overcoming frame", reason: "Recovery arc — wrong thesis" },
  { label: "Dr. Eleanor Chen", reason: "AI-fabricated character — never existed" },
  { label: '"Eliza"', reason: "AI-invented name for Kinsley's mother — protected territory" },
  { label: "TEDx Talk chapter", reason: "AI hallucination — never happened" },
];

const THREADS = [
  { num: "01", label: "Before the Break", desc: "Hospitality years. Competence when memory worked. O'Toole's diagnostic instinct." },
  { num: "02", label: "The Rupture", desc: "TBI. Dependency. The moment old strategies stopped working." },
  { num: "03", label: "The Attack on the Hardware", desc: "Michael relationship. Gaslighting a man whose memory was already compromised." },
  { num: "04", label: "The Construction Project", desc: "240+ tools as prosthetic cognition. External memory as survival infrastructure." },
  { num: "05", label: "Late-Life Emergence", desc: "Self-taught to staff engineer. What the constructed self can actually do." },
  { num: "06", label: "Parallel Constructions", desc: "Kinsley. Chaos Club. The memoir itself. All the same project." },
];

export default function MemoirTitleCard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#e8e0d4",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2520",
        padding: "48px 40px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grain texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.4,
          pointerEvents: "none",
        }} />

        <div style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#5a5048",
          marginBottom: "20px",
          fontFamily: "'Courier New', monospace",
        }}>
          Literary Memoir — Title Locked Apr 14, 2026
        </div>

        <div style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: "400",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            margin: "0 0 8px",
            color: "#f0e8dc",
          }}>
            240 Ways to Remember
          </h1>
          <div style={{
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "#7a6e62",
            fontStyle: "italic",
            letterSpacing: "0.01em",
          }}>
            A Memoir
          </div>
        </div>

        <div style={{
          marginTop: "24px",
          fontSize: "13px",
          color: "#4a4038",
          fontFamily: "'Courier New', monospace",
          lineHeight: "1.6",
          maxWidth: "560px",
        }}>
          Genre: Literary nonfiction &nbsp;·&nbsp; Frame: Letter to Kinsley &nbsp;·&nbsp; Spine: Diagnostic instinct
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #1a1612",
        padding: "0 40px",
        gap: "0",
      }}>
        {["overview", "scenes", "threads", "rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "1px solid #c8a96e" : "1px solid transparent",
              color: activeTab === tab ? "#c8a96e" : "#4a4038",
              padding: "14px 20px",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              transition: "color 0.2s",
              marginBottom: "-1px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "40px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{
              borderLeft: "2px solid #3a3028",
              paddingLeft: "24px",
              marginBottom: "40px",
            }}>
              <div style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#4a4038",
                fontFamily: "'Courier New', monospace",
                marginBottom: "12px",
              }}>Working Thesis</div>
              <p style={{
                fontSize: "15px",
                lineHeight: "1.75",
                color: "#9a8e82",
                fontStyle: "italic",
                margin: 0,
              }}>
                {THESIS}
              </p>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <div style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#4a4038",
                fontFamily: "'Courier New', monospace",
                marginBottom: "16px",
              }}>Title Rationale</div>
              <div style={{
                display: "grid",
                gap: "12px",
              }}>
                {[
                  { aspect: "The number", value: "Implies scale, obsession, survival — without explaining any of it" },
                  { aspect: '"ways to remember"', value: "Reframes 240+ tools as memory infrastructure, not productivity" },
                  { aspect: "No subtitle", value: "The title carries the full weight. Explanation weakens it." },
                  { aspect: "Differentiation", value: "Centers the engineering response to cognitive disruption — not the medical/emotional journey" },
                ].map(({ aspect, value }) => (
                  <div key={aspect} style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid #1a1612",
                  }}>
                    <div style={{
                      fontSize: "12px",
                      color: "#c8a96e",
                      fontFamily: "'Courier New', monospace",
                    }}>{aspect}</div>
                    <div style={{ fontSize: "13px", color: "#7a6e62", lineHeight: "1.5" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "#110e0b",
              border: "1px solid #2a2520",
              padding: "20px 24px",
              borderRadius: "2px",
            }}>
              <div style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#4a4038",
                fontFamily: "'Courier New', monospace",
                marginBottom: "10px",
              }}>Comp Titles</div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {["The Noonday Demon", "Brain on Fire", "In the Realm of Hungry Ghosts", "The Body Keeps the Score"].map(t => (
                  <div key={t} style={{
                    fontSize: "12px",
                    color: "#5a5048",
                    fontFamily: "'Courier New', monospace",
                    padding: "4px 10px",
                    border: "1px solid #2a2520",
                    borderRadius: "2px",
                  }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCENES */}
        {activeTab === "scenes" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#4a4038",
              fontFamily: "'Courier New', monospace",
              marginBottom: "24px",
            }}>Confirmed Scene Seeds</div>
            <div style={{ display: "grid", gap: "0" }}>
              {SCENES.map((scene, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr auto",
                  gap: "20px",
                  padding: "20px 0",
                  borderBottom: "1px solid #1a1612",
                  alignItems: "start",
                }}>
                  <div style={{
                    fontSize: "12px",
                    color: "#3a3028",
                    fontFamily: "'Courier New', monospace",
                    paddingTop: "2px",
                  }}>0{i + 1}</div>
                  <div>
                    <div style={{
                      fontSize: "15px",
                      color: "#e8e0d4",
                      marginBottom: "6px",
                      fontWeight: "400",
                    }}>{scene.label}</div>
                    <div style={{
                      fontSize: "13px",
                      color: "#5a5048",
                      lineHeight: "1.5",
                      fontStyle: scene.note.startsWith('"') ? "italic" : "normal",
                    }}>{scene.note}</div>
                  </div>
                  <div style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "'Courier New', monospace",
                    color: scene.status === "confirmed" ? "#4a7c59" : "#7c6a3a",
                    padding: "4px 8px",
                    border: `1px solid ${scene.status === "confirmed" ? "#2a4a34" : "#4a3a1a"}`,
                    borderRadius: "2px",
                    whiteSpace: "nowrap",
                    marginTop: "2px",
                  }}>
                    {scene.status}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "24px",
              padding: "16px 20px",
              background: "#110e0b",
              border: "1px solid #2a2520",
              fontSize: "12px",
              color: "#4a4038",
              fontFamily: "'Courier New', monospace",
              lineHeight: "1.6",
            }}>
              SESSION 3 NOT YET DONE: Tool Archaeology — chronological mapping of 240+ tools needed.
            </div>
          </div>
        )}

        {/* THREADS */}
        {activeTab === "threads" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#4a4038",
              fontFamily: "'Courier New', monospace",
              marginBottom: "24px",
            }}>Narrative Threads — Emerging Architecture</div>
            <div style={{ display: "grid", gap: "0" }}>
              {THREADS.map((thread) => (
                <div key={thread.num} style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "20px",
                  padding: "24px 0",
                  borderBottom: "1px solid #1a1612",
                }}>
                  <div style={{
                    fontSize: "28px",
                    color: "#2a2520",
                    fontFamily: "'Courier New', monospace",
                    lineHeight: "1",
                  }}>{thread.num}</div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      color: "#e8e0d4",
                      marginBottom: "8px",
                    }}>{thread.label}</div>
                    <div style={{
                      fontSize: "13px",
                      color: "#5a5048",
                      lineHeight: "1.6",
                    }}>{thread.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "24px",
              padding: "16px 20px",
              background: "#110e0b",
              border: "1px solid #3a2a1a",
              fontSize: "12px",
              color: "#7c6a3a",
              fontFamily: "'Courier New', monospace",
              lineHeight: "1.6",
            }}>
              NOTE: Thread 03 (Michael relationship) is primary source confirmed but not in any existing outline. Handwritten journals archived. High narrative value — gaslighting a man whose memory is already compromised is not a side story.
            </div>
          </div>
        )}

        {/* REJECTED */}
        {activeTab === "rejected" && (
          <div style={{ maxWidth: "680px" }}>
            <div style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#4a4038",
              fontFamily: "'Courier New', monospace",
              marginBottom: "24px",
            }}>Rejected — Decisions Locked</div>
            <div style={{ display: "grid", gap: "0" }}>
              {REJECTED.map((item, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  padding: "16px 0",
                  borderBottom: "1px solid #1a1612",
                }}>
                  <div style={{
                    fontSize: "14px",
                    color: "#3a3028",
                    textDecoration: "line-through",
                    textDecorationColor: "#3a3028",
                  }}>{item.label}</div>
                  <div style={{
                    fontSize: "12px",
                    color: "#4a4038",
                    lineHeight: "1.5",
                  }}>{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
