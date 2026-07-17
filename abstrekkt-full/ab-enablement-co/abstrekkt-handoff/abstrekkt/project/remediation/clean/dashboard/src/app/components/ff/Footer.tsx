export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(123,0,255,0.15)",
        padding: "3rem 2.5rem",
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        background: "rgba(3,0,10,0.6)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo + tagline */}
      <div>
        <div
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--ff-neon)",
            textShadow: "var(--ff-glow-sm)",
            letterSpacing: "0.08em",
            marginBottom: "0.3rem",
          }}
        >
          FLASHFUSION
        </div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(232,213,255,0.3)",
          }}
        >
          Build the agent internet. Any vertical. Ship in days.
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {["Features", "Pricing", "Partners", "Docs"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(232,213,255,0.35)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--ff-neon)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(232,213,255,0.35)")}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            color: "rgba(232,213,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          © 2026 FlashFusion · flashfusion.co · Pre-launch
        </div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.08em",
            color: "rgba(191,0,255,0.3)",
            marginTop: "0.2rem",
          }}
        >
          Claude-native · MCP-ready · Security-first
        </div>
      </div>
    </footer>
  );
}
