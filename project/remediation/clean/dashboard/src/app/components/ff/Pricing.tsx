import { useEffect, useRef, useState } from "react";

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

const PLANS = [
  {
    name: "Signal",
    price: "$0",
    period: "/mo",
    label: "FREE TIER",
    desc: "Explore the platform. Prove the concept. No credit card.",
    features: [
      "1 active project",
      "50K tokens/mo",
      "3 model endpoints",
      "Community support",
      "FlashFusion branding",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pulse",
    price: "$99",
    period: "/mo",
    label: "MOST POPULAR",
    desc: "For builders launching real products. Full platform access.",
    features: [
      "10 active projects",
      "5M tokens/mo",
      "18+ model endpoints",
      "SecurityScan + AuditLog",
      "Plugin marketplace access",
      "Prompt A/B testing",
      "Priority support",
    ],
    cta: "Get Pulse",
    highlight: true,
  },
  {
    name: "Fusion",
    price: "$299",
    period: "/mo",
    label: "ENTERPRISE",
    desc: "For vertical builders and agencies shipping at scale.",
    features: [
      "Unlimited projects",
      "50M tokens/mo",
      "All 18+ endpoints",
      "Full compliance suite",
      "Custom plugin registry",
      "SLA guarantee 99.97%",
      "Dedicated architect",
      "White-label ready",
    ],
    cta: "Get Fusion",
    highlight: false,
  },
];

function PlanCard({ plan, delay }: { plan: typeof PLANS[0]; delay: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="ff-interactive"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "2.5rem 2rem",
        border: plan.highlight
          ? "1px solid var(--ff-neon)"
          : `1px solid ${hovered ? "rgba(191,0,255,0.35)" : "rgba(123,0,255,0.2)"}`,
        background: plan.highlight
          ? "rgba(123,0,255,0.08)"
          : hovered
          ? "rgba(123,0,255,0.04)"
          : "rgba(7,0,16,0.5)",
        backdropFilter: "blur(16px)",
        position: "relative",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(50px)",
        transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease, border-color 0.3s, background 0.3s`,
        clipPath: plan.highlight
          ? "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)"
          : "none",
        boxShadow: plan.highlight ? "0 0 40px rgba(191,0,255,0.12), inset 0 0 40px rgba(123,0,255,0.04)" : "none",
      }}
    >
      {plan.highlight && (
        <>
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
              filter: "drop-shadow(-2px 2px 6px var(--ff-neon))",
            }}
          />
          {/* Top shimmer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--ff-neon), transparent)",
            }}
          />
        </>
      )}

      {/* Label */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: plan.highlight ? "var(--ff-neon)" : "rgba(191,0,255,0.5)",
          textShadow: plan.highlight ? "var(--ff-glow-sm)" : "none",
          marginBottom: "1.2rem",
        }}
      >
        {plan.label}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: plan.highlight ? "var(--ff-neon)" : "var(--ff-white)",
          letterSpacing: "0.05em",
          marginBottom: "0.5rem",
        }}
      >
        {plan.name}
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.2rem",
          marginBottom: "0.8rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "2.8rem",
            fontWeight: 700,
            color: plan.highlight ? "var(--ff-neon)" : "var(--ff-white)",
            textShadow: plan.highlight ? "var(--ff-glow-md)" : "none",
            lineHeight: 1,
          }}
        >
          {plan.price}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(232,213,255,0.4)",
          }}
        >
          {plan.period}
        </span>
      </div>

      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.82rem",
          color: "rgba(232,213,255,0.45)",
          lineHeight: 1.7,
          marginBottom: "1.8rem",
          borderBottom: "1px solid rgba(123,0,255,0.15)",
          paddingBottom: "1.8rem",
        }}
      >
        {plan.desc}
      </p>

      {/* Features */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem" }}>
        {plan.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.8rem",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.03em",
              color: "rgba(232,213,255,0.65)",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: plan.highlight ? "var(--ff-neon)" : "rgba(123,0,255,0.8)", flexShrink: 0 }}>
              //
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className="ff-interactive"
        style={{
          width: "100%",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "0.85rem 1rem",
          background: plan.highlight ? "var(--ff-neon)" : "transparent",
          color: plan.highlight ? "var(--ff-void)" : "var(--ff-neon)",
          border: plan.highlight ? "none" : "1px solid rgba(191,0,255,0.4)",
          cursor: "pointer",
          fontWeight: 700,
          clipPath: plan.highlight
            ? "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
            : "none",
          transition: "box-shadow 0.2s, transform 0.15s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (plan.highlight) {
            el.style.boxShadow = "var(--ff-glow-lg)";
          } else {
            el.style.background = "rgba(191,0,255,0.08)";
            el.style.borderColor = "var(--ff-neon)";
          }
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = "none";
          el.style.transform = "none";
          if (!plan.highlight) {
            el.style.background = "transparent";
            el.style.borderColor = "rgba(191,0,255,0.4)";
          }
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}

export function Pricing() {
  const { ref: titleRef, inView: titleIn } = useInView(0.3);

  return (
    <section
      id="pricing"
      style={{
        padding: "8rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
            // Pricing
          </p>
          <h2
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: "clamp(1.6rem, 4vw, 3rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.05,
              color: "var(--ff-white)",
            }}
          >
            Democratize the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Agent Stack
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(232,213,255,0.45)",
              marginTop: "1.2rem",
              lineHeight: 1.8,
            }}
          >
            Enterprise-class agent infrastructure. Not enterprise prices.
          </p>
        </div>

        {/* Plans */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2px",
          }}
        >
          {PLANS.map((p, i) => (
            <PlanCard key={p.name} plan={p} delay={i * 100} />
          ))}
        </div>

        {/* Services note */}
        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "rgba(232,213,255,0.35)",
            }}
          >
            Custom vertical builds also available as services engagements.{" "}
            <span style={{ color: "var(--ff-neon)", cursor: "pointer" }}>
              Contact for enterprise pilot pricing →
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
