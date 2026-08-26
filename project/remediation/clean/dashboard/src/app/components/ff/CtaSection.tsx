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

export function CtaSection() {
  const { ref, inView } = useInView(0.2);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="cta"
      style={{
        padding: "10rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(40px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ff-neon)",
            border: "1px solid rgba(191,0,255,0.3)",
            padding: "0.4rem 1rem",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--ff-neon)",
              boxShadow: "var(--ff-glow-sm)",
              animation: "ff-blink 1.2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          Pre-launch · Early Access
        </div>

        <h2
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            lineHeight: 0.95,
            color: "var(--ff-white)",
            marginBottom: "1.5rem",
          }}
        >
          Build the{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Agent Internet
          </span>
        </h2>

        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1rem",
            color: "rgba(232,213,255,0.5)",
            lineHeight: 1.8,
            marginBottom: "3rem",
            maxWidth: "480px",
            margin: "0 auto 3rem",
          }}
        >
          Any vertical. Ship in days. Secure by default.
          Join the waitlist for early access to FlashFusion — the production infrastructure layer for the agent internet.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "480px", margin: "0 auto" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.05em",
                padding: "0.9rem 1.2rem",
                background: "rgba(7,0,16,0.7)",
                border: "1px solid rgba(123,0,255,0.35)",
                borderRight: "none",
                color: "var(--ff-white)",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--ff-neon)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(123,0,255,0.35)")}
            />
            <button
              type="submit"
              className="ff-interactive"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.9rem 1.6rem",
                background: "var(--ff-neon)",
                color: "var(--ff-void)",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                whiteSpace: "nowrap",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--ff-glow-lg)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
            >
              Ignite →
            </button>
          </form>
        ) : (
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: "var(--ff-neon)",
              textShadow: "var(--ff-glow-sm)",
              padding: "1rem 2rem",
              border: "1px solid rgba(191,0,255,0.3)",
              background: "rgba(123,0,255,0.06)",
              textTransform: "uppercase",
              animation: "ff-fade-up 0.5s ease both",
            }}
          >
            ▸ Signal received. You're on the list.
          </div>
        )}

        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            color: "rgba(232,213,255,0.25)",
            marginTop: "1.5rem",
          }}
        >
          No spam. No noise. Just signal when we're ready.
        </p>
      </div>
    </section>
  );
}
