import { useState, useEffect } from "react";

interface NavProps {
  visible: boolean;
  onEnterApp?: () => void;
}

export function Nav({ visible, onEnterApp }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "1.2rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(3,0,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(123,0,255,0.15)" : "none",
        transition: "all 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-20px)",
      }}
    >
      <div
        style={{
          fontFamily: "'Syncopate', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--ff-neon)",
          textShadow: "var(--ff-glow-sm)",
          letterSpacing: "0.08em",
          cursor: "default",
        }}
      >
        FF_
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {["Features", "Pricing", "Docs", "Partners"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="ff-interactive"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(232,213,255,0.55)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--ff-neon)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(232,213,255,0.55)")}
          >
            {item}
          </a>
        ))}
        <button
          className="ff-interactive"
          onClick={onEnterApp}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.5rem 1.2rem",
            background: "var(--ff-neon)",
            color: "var(--ff-void)",
            border: "none",
            cursor: "none",
            fontWeight: 700,
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          Enter App →
        </button>
      </div>
    </nav>
  );
}
