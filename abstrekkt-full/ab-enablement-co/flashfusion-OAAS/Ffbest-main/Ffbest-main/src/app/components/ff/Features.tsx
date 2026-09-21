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

export function Features() {
  const { ref: leftRef, inView: leftIn } = useInView();
  const { ref: rightRef, inView: rightIn } = useInView();

  const FEATURES = [
    "Semantic routing via embedding similarity",
    "Cost-aware model selection with budget caps",
    "Fallback chains with zero cold-start penalty",
    "Unified API — one key, every provider",
    "Full observability with PostHog + structured logs",
  ];

  return (
    <section
      id="features"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: "1020px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div
          ref={leftRef}
          style={{
            opacity: leftIn ? 1 : 0,
            transform: leftIn ? "none" : "translateX(-70px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--ff-neon)",
              textShadow: "var(--ff-glow-sm)",
              marginBottom: "1rem",
            }}
          >
            // Core Intelligence
          </div>
          <h2
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.08,
              marginBottom: "1.5rem",
              color: "var(--ff-white)",
            }}
          >
            Route with{" "}
            <em
              style={{
                fontStyle: "normal",
                color: "var(--ff-neon)",
                textShadow: "var(--ff-glow-sm)",
              }}
            >
              precision.
            </em>
            <br />
            Scale without limits.
          </h2>
          <p
            style={{
              color: "rgba(232,213,255,0.52)",
              fontSize: "0.93rem",
              lineHeight: 1.85,
              marginBottom: "2rem",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            FlashFusion's intelligent router analyzes prompt complexity, cost
            constraints, and latency requirements in real time — then fires to
            the optimal model endpoint, every time.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {FEATURES.map((f, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.04em",
                  color: "rgba(232,213,255,0.68)",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "var(--ff-neon)",
                    textShadow: "var(--ff-glow-sm)",
                    flexShrink: 0,
                  }}
                >
                  //
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Code panel */}
        <div
          ref={rightRef}
          style={{
            border: "1px solid rgba(123,0,255,0.3)",
            background: "rgba(18,0,45,0.45)",
            backdropFilter: "blur(20px)",
            padding: "2rem",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
            position: "relative",
            opacity: rightIn ? 1 : 0,
            transform: rightIn ? "none" : "translateX(70px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* Corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 20px 20px 0",
              borderColor: "transparent var(--ff-neon) transparent transparent",
              filter: "drop-shadow(-2px 2px 8px var(--ff-neon))",
            }}
          />
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--ff-neon)",
              marginBottom: "1.2rem",
              textShadow: "var(--ff-glow-sm)",
            }}
          >
            // router.ts — live
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.73rem",
              lineHeight: 1.95,
              color: "rgba(232,213,255,0.78)",
            }}
          >
            <span style={{ color: "var(--ff-flash)" }}>const</span> result ={" "}
            <span style={{ color: "var(--ff-flash)" }}>await</span>{" "}
            <span style={{ color: "#c084fc" }}>flash</span>.
            <span style={{ color: "#c084fc" }}>route</span>({"{"}<br />
            &nbsp;&nbsp;prompt: userInput,<br />
            &nbsp;&nbsp;strategy:{" "}
            <span style={{ color: "#a3e635" }}>"cost_optimized"</span>,<br />
            &nbsp;&nbsp;budget:{" "}
            <span style={{ color: "#a3e635" }}>"$0.002"</span>,<br />
            &nbsp;&nbsp;fallback: [<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a3e635" }}>"claude-sonnet-4"</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a3e635" }}>"gemini-pro"</span><br />
            &nbsp;&nbsp;]<br />
            {"}"});<br />
            <br />
            <span style={{ color: "rgba(232,213,255,0.28)", fontStyle: "italic" }}>
              // → routed to claude-haiku-4
            </span>
            <br />
            <span style={{ color: "rgba(232,213,255,0.28)", fontStyle: "italic" }}>
              // → latency: 11ms · cost: $0.0004
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
