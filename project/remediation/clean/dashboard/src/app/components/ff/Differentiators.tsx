import { useEffect, useRef, useState } from "react";

const DIFFS = [
  {
    icon: "🔐",
    title: "Security-First by Design",
    badge: "01",
    desc: "Production-grade RLS enforcement, audit logging, SecurityScan, ComplianceReport — all built in. While Moltbook leaked 1.5M API keys, FlashFusion makes that architecturally impossible.",
    tag: "PROD-HARDENED",
    tagColor: "#22c55e",
  },
  {
    icon: "⚡",
    title: "Claude-Native by Design",
    badge: "02",
    desc: "Not model-agnostic. All-in on the Anthropic ecosystem. Claude Partner Network ready. Built to unlock MCP-native distribution and co-marketing as the ecosystem grows.",
    tag: "CLAUDE-NATIVE",
    tagColor: "var(--ff-neon)",
  },
  {
    icon: "🧪",
    title: "Prompt A/B Testing as Primitive",
    badge: "03",
    desc: "PromptExperiment and PromptTemplateVersion are native entities — not an afterthought. Run statistically significant prompt tests across model endpoints in production.",
    tag: "NATIVE A/B",
    tagColor: "#e040fb",
  },
  {
    icon: "🧩",
    title: "Plugin Marketplace as Moat",
    badge: "04",
    desc: "MCP-compatible tool registry built into the platform architecture. Every plugin extends every agent. Network effects compound with every builder who joins.",
    tag: "MCP-READY",
    tagColor: "#c084fc",
  },
  {
    icon: "🎯",
    title: "Visual Workflow Orchestration",
    badge: "05",
    desc: "Non-technical vertical builders can wire agent workflows without code. PipelineConfig and AgentWorkflow entities power multi-step orchestration for any industry.",
    tag: "NO-CODE POWER",
    tagColor: "#7b00ff",
  },
];

function useInView(threshold = 0.15) {
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

function DiffCard({ diff, delay }: { diff: typeof DIFFS[0]; delay: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="ff-interactive"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(191,0,255,0.4)" : "rgba(123,0,255,0.18)"}`,
        background: hovered ? "rgba(123,0,255,0.06)" : "rgba(7,0,16,0.5)",
        backdropFilter: "blur(16px)",
        padding: "2rem",
        position: "relative",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px)",
        transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease, border-color 0.3s, background 0.3s`,
        clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
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
          borderWidth: "0 16px 16px 0",
          borderColor: `transparent ${hovered ? "var(--ff-neon)" : "rgba(123,0,255,0.4)"} transparent transparent`,
          transition: "border-color 0.3s",
          filter: hovered ? "drop-shadow(-1px 1px 6px var(--ff-neon))" : "none",
        }}
      />
      {/* Badge */}
      <div
        style={{
          position: "absolute",
          top: "0.8rem",
          left: "1rem",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.48rem",
          color: "rgba(191,0,255,0.35)",
          letterSpacing: "0.15em",
        }}
      >
        {diff.badge}
      </div>

      <div
        style={{
          fontSize: "1.6rem",
          marginBottom: "1rem",
          marginTop: "0.5rem",
        }}
      >
        {diff.icon}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          marginBottom: "0.8rem",
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--ff-white)",
            letterSpacing: "0.04em",
          }}
        >
          {diff.title}
        </h3>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: diff.tagColor,
            border: `1px solid ${diff.tagColor}`,
            padding: "0.15rem 0.4rem",
            opacity: 0.85,
          }}
        >
          {diff.tag}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.82rem",
          lineHeight: 1.8,
          color: "rgba(232,213,255,0.5)",
        }}
      >
        {diff.desc}
      </p>
    </div>
  );
}

export function Differentiators() {
  const { ref: titleRef, inView: titleIn } = useInView(0.3);

  return (
    <section
      id="differentiators"
      style={{
        padding: "8rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Title */}
        <div
          ref={titleRef}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            opacity: titleIn ? 1 : 0,
            transform: titleIn ? "none" : "translateY(30px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p
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
            // The 5 Moats
          </p>
          <h2
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 3rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.05,
              color: "var(--ff-white)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            What nobody else{" "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1px var(--ff-neon)",
                textShadow: "none",
              }}
            >
              can replicate
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(232,213,255,0.45)",
              marginTop: "1.2rem",
              maxWidth: "480px",
              margin: "1.2rem auto 0",
              lineHeight: 1.8,
            }}
          >
            No competitor delivers all five simultaneously. Each one alone is a feature. Together, they're an architectural moat.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2px",
          }}
        >
          {DIFFS.map((d, i) => (
            <DiffCard key={d.badge} diff={d} delay={i * 80} />
          ))}
        </div>

        {/* The gap no one fills */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            border: "1px solid rgba(191,0,255,0.25)",
            background: "rgba(123,0,255,0.04)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              color: "rgba(232,213,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            Market verdict —{" "}
            <span style={{ color: "var(--ff-neon)", textShadow: "var(--ff-glow-sm)" }}>
              $8.03B AI agents market (2025) → $251B by 2034 · 46.6% CAGR
            </span>
            {" "}· Developer adoption of agent frameworks:{" "}
            <span style={{ color: "var(--ff-neon)" }}>920% YoY surge</span>
          </p>
        </div>
      </div>
    </section>
  );
}
