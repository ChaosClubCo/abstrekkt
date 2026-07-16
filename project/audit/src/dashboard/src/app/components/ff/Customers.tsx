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

const VERTICALS = [
  {
    code: "GA",
    name: "Grand Appliance",
    sub: "20-location regional retailer · IL/WI/IA/IN",
    founded: "Est. 1930",
    revenue: "$50M–$100M+ ARR",
    tag: "ENTERPRISE PILOT",
    tagColor: "var(--ff-neon)",
    useCases: [
      "Post-purchase lifecycle agent",
      "Price match automation",
      "Delivery coordination",
      "Sales floor intelligence",
      "Service & warranty OS",
    ],
    quote: "The independent appliance retail category has 200+ regional retailers. One successful pilot becomes the template for every one of them.",
    opportunity: "$5K–150K annual engagement",
  },
  {
    code: "TSR",
    name: "The Sole Revival",
    sub: "Corporate custom shoe events · Chicago, IL",
    founded: "Est. 2011",
    revenue: "~$1M ARR · 2 employees",
    tag: "FORTUNE 500 CLIENTS",
    tagColor: "#e040fb",
    useCases: [
      "Activation OS for events",
      "Fortune 500 order automation",
      "Client communication agent",
      "Inventory + fulfillment",
      "Post-event analytics",
    ],
    quote: "2 employees serving Amex, Capital One, PepsiCo, Dell, Comcast. An agent platform multiplies their capacity 10×.",
    opportunity: "$5K–50K custom build",
  },
  {
    code: "CE",
    name: "Centerline Equipment",
    sub: "Aerospace & military manufacturing · Est. 1983",
    founded: "cline.com",
    revenue: "Defense, aerospace, IoT clients",
    tag: "REGULATED INDUSTRY",
    tagColor: "#22c55e",
    useCases: [
      "RFQ parsing automation",
      "MIL-SPEC compliance docs",
      "Quoting system agent",
      "Customer portal",
      "Supplier communication",
    ],
    quote: "A 40-year aerospace manufacturer on Claude with full RLS and audit logging. The exact case study Anthropic needs for regulated industries.",
    opportunity: "Anthropic case study + $30K engagement",
  },
  {
    code: "RP",
    name: "Relish Print Shop",
    sub: "Screen printing · Lindenhurst, IL",
    founded: "Custom printing",
    revenue: "Local SMB",
    tag: "SMB BEACHHEAD",
    tagColor: "#c084fc",
    useCases: [
      "Order intake agent",
      "Proof approval automation",
      "Production scheduling",
      "Customer status updates",
      "Reorder reminders",
    ],
    quote: "Custom print shops run on manual emails and spreadsheets. An order-to-delivery agent OS is a $20K build that saves 10 hours/week.",
    opportunity: "$5K–20K build + $99/mo",
  },
];

function VerticalCard({ v, delay }: { v: typeof VERTICALS[0]; delay: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="ff-interactive"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(191,0,255,0.35)" : "rgba(123,0,255,0.18)"}`,
        background: hovered ? "rgba(123,0,255,0.05)" : "rgba(7,0,16,0.5)",
        backdropFilter: "blur(16px)",
        padding: "2rem",
        position: "relative",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px)",
        transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease, border-color 0.3s, background 0.3s`,
      }}
    >
      {/* Code + tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.2rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: v.tagColor,
            textShadow: hovered ? `0 0 20px ${v.tagColor}` : "none",
            transition: "text-shadow 0.3s",
            opacity: 0.6,
          }}
        >
          {v.code}
        </div>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.48rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: v.tagColor,
            border: `1px solid ${v.tagColor}`,
            padding: "0.15rem 0.45rem",
            opacity: 0.8,
          }}
        >
          {v.tag}
        </span>
      </div>

      {/* Name + sub */}
      <h3
        style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "var(--ff-white)",
          letterSpacing: "0.04em",
          marginBottom: "0.3rem",
        }}
      >
        {v.name}
      </h3>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6rem",
          color: "rgba(232,213,255,0.35)",
          letterSpacing: "0.05em",
          marginBottom: "0.2rem",
        }}
      >
        {v.sub}
      </p>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.58rem",
          color: v.tagColor,
          opacity: 0.7,
          marginBottom: "1.5rem",
        }}
      >
        {v.revenue}
      </p>

      {/* Use cases */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {v.useCases.map((u, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.7rem",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(232,213,255,0.6)",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: v.tagColor, flexShrink: 0, opacity: 0.7 }}>//</span>
            {u}
          </li>
        ))}
      </ul>

      {/* Quote */}
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.78rem",
          color: "rgba(232,213,255,0.4)",
          lineHeight: 1.7,
          fontStyle: "italic",
          borderTop: "1px solid rgba(123,0,255,0.15)",
          paddingTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        "{v.quote}"
      </p>

      {/* Opportunity */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: v.tagColor,
          opacity: 0.7,
        }}
      >
        {v.opportunity}
      </div>
    </div>
  );
}

export function Customers() {
  const { ref: titleRef, inView: titleIn } = useInView(0.3);

  return (
    <section
      id="customers"
      style={{
        padding: "8rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            // First Customers
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
            The Verticals We're{" "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1px var(--ff-neon)",
              }}
            >
              Building For
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(232,213,255,0.45)",
              marginTop: "1.2rem",
              maxWidth: "500px",
              margin: "1.2rem auto 0",
              lineHeight: 1.8,
            }}
          >
            Every vertical where AI agents can replace manual workflows. Each pilot becomes a template for hundreds of similar businesses.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2px",
          }}
        >
          {VERTICALS.map((v, i) => (
            <VerticalCard key={v.code} v={v} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
