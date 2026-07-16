import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const STEPS = [
  { step: "01", action: "Apply at claude.com/partners", status: "FREE · OPEN NOW", color: "#22c55e" },
  { step: "02", action: "Get Claude Certified Architect", status: "EXAM READY", color: "#a3e635" },
  { step: "03", action: "List in MCP Connector Directory", status: "DISTRIBUTION", color: "var(--ff-neon)" },
  { step: "04", action: "Build 1 live external product", status: "PROOF POINT", color: "#e040fb" },
  { step: "05", action: "Apply with live customer proof", status: "PARTNERSHIP", color: "#c084fc" },
];

export function AnthropicBadge() {
  const { ref: wrapRef, inView } = useInView(0.15);

  return (
    <section
      id="partners"
      style={{
        padding: "8rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        ref={wrapRef}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(40px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Main block */}
        <div
          style={{
            border: "1px solid rgba(191,0,255,0.3)",
            background: "rgba(18,0,45,0.5)",
            backdropFilter: "blur(20px)",
            padding: "3rem",
            position: "relative",
            clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
          }}
        >
          {/* Corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 24px 24px 0",
              borderColor: "transparent var(--ff-neon) transparent transparent",
              filter: "drop-shadow(-2px 2px 8px var(--ff-neon))",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--ff-neon)",
                  textShadow: "var(--ff-glow-sm)",
                  marginBottom: "1rem",
                }}
              >
                // Anthropic Claude Partner Network
              </p>
              <h2
                style={{
                  fontFamily: "'Syncopate', sans-serif",
                  fontSize: "clamp(1.3rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  lineHeight: 1.08,
                  color: "var(--ff-white)",
                  marginBottom: "1rem",
                }}
              >
                The{" "}
                <span style={{ color: "var(--ff-neon)", textShadow: "var(--ff-glow-sm)" }}>
                  $100M
                </span>{" "}
                partner ecosystem — and the gap nobody fills
              </h2>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(232,213,255,0.5)",
                  lineHeight: 1.8,
                  maxWidth: "520px",
                }}
              >
                Anthropic launched the Claude Partner Network on March 12, 2026 with
                a $100M commitment. Current anchor partners — Accenture, Deloitte,
                Cognizant, Infosys — all serve enterprises. Nobody serves{" "}
                <span style={{ color: "var(--ff-white)" }}>builders and SMBs</span>.
                That's FlashFusion's entry point.
              </p>
            </div>

            {/* Stats block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                minWidth: "160px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Syncopate', sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "var(--ff-neon)",
                    textShadow: "var(--ff-glow-md)",
                    lineHeight: 1,
                  }}
                >
                  $100M
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(232,213,255,0.4)",
                    marginTop: "0.3rem",
                  }}
                >
                  2026 Partner Fund
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Syncopate', sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "var(--ff-flash)",
                    textShadow: "0 0 32px rgba(224,64,251,0.5)",
                    lineHeight: 1,
                  }}
                >
                  FREE
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(232,213,255,0.4)",
                    marginTop: "0.3rem",
                  }}
                >
                  Membership Cost
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Syncopate', sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "#c084fc",
                    lineHeight: 1,
                  }}
                >
                  5×
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(232,213,255,0.4)",
                    marginTop: "0.3rem",
                  }}
                >
                  Partner Team Growth
                </div>
              </div>
            </div>
          </div>

          {/* Step roadmap */}
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(123,0,255,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(232,213,255,0.35)",
                marginBottom: "0.5rem",
              }}
            >
              Partnership Roadmap
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
              }}
            >
              {STEPS.map((s) => (
                <div key={s.step} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.48rem",
                      letterSpacing: "0.15em",
                      color: s.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.step} · {s.status}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "0.75rem",
                      color: "rgba(232,213,255,0.65)",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
