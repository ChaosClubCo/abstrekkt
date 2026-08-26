import { useEffect, useRef, useState } from "react";

const STATS = [
  { number: "12ms", label: "Avg routing latency", index: "01" },
  { number: "99.97%", label: "Uptime SLA", index: "02" },
  { number: "18+", label: "Model endpoints", index: "03" },
  { number: "60%", label: "Cost reduction avg", index: "04" },
];

interface StatCardProps {
  number: string;
  label: string;
  index: string;
  delay: number;
}

function StatCard({ number, label, index, delay }: StatCardProps) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="ff-interactive"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "2.5rem 2rem",
        border: `1px solid ${hovered ? "rgba(191,0,255,0.5)" : "rgba(123,0,255,0.22)"}`,
        background: hovered ? "rgba(123,0,255,0.08)" : "rgba(123,0,255,0.04)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, background 0.3s`,
      }}
    >
      {/* Top shimmer on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--ff-neon), transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      {/* Index label */}
      <div
        style={{
          position: "absolute",
          top: "0.8rem",
          right: "1rem",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.5rem",
          color: "rgba(191,0,255,0.3)",
          letterSpacing: "0.1em",
        }}
      >
        {index}
      </div>
      <div
        style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: "3rem",
          fontWeight: 700,
          color: "var(--ff-neon)",
          textShadow: "var(--ff-glow-md)",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(232,213,255,0.5)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section
      id="stats"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2px",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {STATS.map((s, i) => (
          <StatCard key={s.index} {...s} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
