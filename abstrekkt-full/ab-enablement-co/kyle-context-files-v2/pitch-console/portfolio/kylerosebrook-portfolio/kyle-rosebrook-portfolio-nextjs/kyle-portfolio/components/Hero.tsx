export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 3.5rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,200,240,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,240,0.04) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 70% 60% at 60% 40%,black 20%,transparent 80%)",
      }} />

      {/* Orbs */}
      <div style={{
        position: "absolute",
        width: 500, height: 500,
        top: -80, right: -100,
        borderRadius: "50%",
        filter: "blur(100px)",
        background: "radial-gradient(circle,rgba(0,180,220,0.18),transparent 70%)",
        animation: "orbFloat 12s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 300, height: 300,
        bottom: "10%", left: "5%",
        borderRadius: "50%",
        filter: "blur(100px)",
        background: "radial-gradient(circle,rgba(0,140,180,0.1),transparent 70%)",
        animation: "orbFloat 12s -5s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <p style={{
          fontFamily: "var(--ff-mono,'Space Mono',monospace)",
          fontSize: ".68rem", letterSpacing: ".2em",
          color: "var(--cyan)", textTransform: "uppercase",
          marginBottom: "1.5rem",
          opacity: 0, transform: "translateY(16px)",
          animation: "fadeUp .8s .2s forwards",
        }}>
          Staff Engineer &nbsp;·&nbsp; AppSec &amp; Platform &nbsp;·&nbsp; AI SME
        </p>

        <h1 style={{
          fontFamily: "var(--ff-display,'Syne',sans-serif)",
          fontSize: "clamp(4rem,10vw,9.5rem)",
          fontWeight: 800, lineHeight: ".92",
          letterSpacing: "-.03em",
          color: "var(--text)",
          opacity: 0, transform: "translateY(24px)",
          animation: "fadeUp .9s .35s forwards",
        }}>
          Kyle<br />
          <span style={{ color: "var(--cyan)" }}>Rose</span>brook
        </h1>

        <p style={{
          marginTop: "2rem",
          fontSize: "clamp(.9rem,1.5vw,1.1rem)",
          color: "var(--text-dim)",
          maxWidth: "44ch",
          opacity: 0, transform: "translateY(16px)",
          animation: "fadeUp .8s .55s forwards",
        }}>
          Security-first platform engineer building production AI systems, automation, and internal platforms that actually work.
        </p>

        <div style={{
          marginTop: "3rem",
          display: "flex", gap: "1.5rem", alignItems: "center",
          opacity: 0, transform: "translateY(16px)",
          animation: "fadeUp .8s .75s forwards",
        }}>
          <a
            href="#work"
            style={{
              display: "inline-flex", alignItems: "center", gap: ".6rem",
              background: "var(--cyan)", color: "var(--void)",
              fontFamily: "var(--ff-mono,'Space Mono',monospace)",
              fontSize: ".72rem", fontWeight: 700,
              letterSpacing: ".12em", textTransform: "uppercase",
              textDecoration: "none",
              padding: ".85rem 2rem", borderRadius: "2px",
              transition: "background .2s, box-shadow .2s, transform .15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#00dfff";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0,200,240,.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--cyan)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Selected Work ↓
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--ff-mono,'Space Mono',monospace)",
              fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase",
              color: "var(--text-muted)", textDecoration: "none",
              borderBottom: "1px solid var(--border)", paddingBottom: "2px",
              transition: "color .2s, border-color .2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--cyan)";
              e.currentTarget.style.borderColor = "var(--cyan)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2.5rem", right: "3.5rem",
        display: "flex", flexDirection: "column", alignItems: "center", gap: ".75rem",
        fontFamily: "var(--ff-mono,'Space Mono',monospace)",
        fontSize: ".6rem", letterSpacing: ".2em",
        color: "var(--text-muted)", textTransform: "uppercase",
        opacity: 0, animation: "fadeUp .8s 1.1s forwards",
      }}>
        <div style={{
          width: 1, height: 60,
          background: "linear-gradient(to bottom,transparent,var(--cyan))",
          animation: "scrollPulse 2s 1.5s infinite",
        }} />
        Scroll
      </div>

      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(20px,-30px) scale(1.04); }
          66% { transform: translate(-15px,20px) scale(0.97); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: .3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
