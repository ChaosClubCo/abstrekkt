import { useEffect, useRef, useState } from "react";

interface HeroProps {
  visible: boolean;
}

const TAGLINE = "Route every prompt to its perfect model. Natively. Instantly. Intelligently.";
const CHARS_SCRAMBLE = "!<>-_\\/[]{}=+*^?#@$%&";

function useScramble(text: string, trigger: boolean, delay = 0) {
  const [display, setDisplay] = useState("");
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!trigger) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => {
      let frame = 0;
      const len = text.length;
      const queue = [...text].map((ch, i) => ({
        to: ch,
        start: Math.floor(Math.random() * 14),
        end: Math.floor(Math.random() * 14) + Math.floor(Math.random() * 14) + 8,
        char: "",
      }));

      const update = () => {
        let out = "";
        let done = 0;
        for (const q of queue) {
          if (frame >= q.end) {
            done++;
            out += q.to;
          } else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.3) {
              q.char = CHARS_SCRAMBLE[Math.floor(Math.random() * CHARS_SCRAMBLE.length)];
            }
            out += q.char;
          } else {
            out += " ";
          }
        }
        setDisplay(out);
        if (done < len) {
          frame++;
          rafRef.current = requestAnimationFrame(update);
        } else {
          setDisplay(text);
        }
      };
      update();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, text, delay]);

  return display;
}

export function Hero({ visible }: HeroProps) {
  const tagline = useScramble(TAGLINE, visible, 1100);
  const [showDivider, setShowDivider] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setShowDivider(true), 880);
    const t2 = setTimeout(() => setShowCta(true), 1650);
    const t3 = setTimeout(() => setShowScrollHint(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible]);

  const FLASH_CHARS = "FLASH".split("");
  const FUSION_CHARS = "FUSION".split("");

  return (
    <>
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          perspective: "900px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--ff-neon)",
              textShadow: "var(--ff-glow-sm)",
              marginBottom: "1.8rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.55s ease",
            }}
          >
            // Ignite the Signal · v2.0 · Active
          </p>

          {/* FLASH */}
          <h1
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3.6rem, 12vw, 9.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              overflow: "visible",
              margin: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", overflow: "visible", position: "relative" }}>
              {/* Ghost blur for FLASH */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  fontFamily: "'Syncopate', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3.6rem, 12vw, 9.5rem)",
                  lineHeight: 0.9,
                  display: "flex",
                  justifyContent: "center",
                  color: "var(--ff-neon)",
                  filter: "blur(36px)",
                  opacity: 0.18,
                  pointerEvents: "none",
                  zIndex: -1,
                  letterSpacing: "-0.02em",
                  alignItems: "center",
                }}
              >
                FLASH
              </div>
              {FLASH_CHARS.map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    color: "var(--ff-white)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(55px) rotateY(-50deg) scale(0.8)",
                    transition: `opacity 0.55s ${0.2 + i * 0.065}s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s ${0.2 + i * 0.065}s cubic-bezier(0.34,1.56,0.64,1)`,
                    willChange: "transform, opacity",
                    transformOrigin: "50% 50%",
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>

            {/* FUSION */}
            <div style={{ display: "flex", justifyContent: "center", overflow: "visible" }}>
              {FUSION_CHARS.map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(55px) rotateY(50deg) scale(0.8)",
                    transition: `opacity 0.55s ${0.48 + i * 0.065}s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s ${0.48 + i * 0.065}s cubic-bezier(0.34,1.56,0.64,1)`,
                    willChange: "transform, opacity",
                    transformOrigin: "50% 50%",
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </h1>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              maxWidth: "280px",
              width: "100%",
              margin: "1.4rem auto",
              overflow: "hidden",
              opacity: showDivider ? 1 : 0,
              transition: "opacity 0.25s",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, transparent, var(--ff-neon), var(--ff-flash), transparent)",
                boxShadow: "var(--ff-glow-sm)",
                transform: showDivider ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.05s",
              }}
            />
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
              color: "rgba(232,213,255,0.52)",
              maxWidth: "400px",
              lineHeight: 1.85,
              letterSpacing: "0.03em",
              opacity: visible ? 1 : 0,
              minHeight: "3.2em",
              fontFamily: "'Syne', sans-serif",
              transition: "opacity 0.3s 1.0s",
            }}
          >
            {tagline || "\u00a0"}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2.4rem",
              opacity: showCta ? 1 : 0,
              transform: showCta ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <button
              className="ff-interactive"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.9rem 2.2rem",
                background: "var(--ff-neon)",
                color: "var(--ff-void)",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--ff-glow-lg)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              Get Early Access
            </button>
            <button
              className="ff-interactive"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.9rem 2.2rem",
                background: "transparent",
                color: "var(--ff-neon)",
                border: "1px solid rgba(191,0,255,0.45)",
                cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--ff-neon)";
                el.style.boxShadow = "var(--ff-glow-sm), inset 0 0 18px rgba(191,0,255,0.1)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(191,0,255,0.45)";
                el.style.boxShadow = "none";
                el.style.transform = "none";
              }}
            >
              View Docs
            </button>
          </div>
        </div>
      </section>

      {/* Scroll hint */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          opacity: showScrollHint ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "linear-gradient(180deg, var(--ff-neon), transparent)",
            boxShadow: "var(--ff-glow-sm)",
            animation: "ff-scroll-extend 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(191,0,255,0.48)",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
      </div>
    </>
  );
}
