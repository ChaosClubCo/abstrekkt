import { useEffect, useRef, useState } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "FLASHFUSION_OS v2.0.0 ── SIGNAL ROUTER KERNEL",
  "LOADING MODEL ENDPOINTS [18/18] ── OK",
  "ROUTING ENGINE ── ONLINE",
  "LATENCY BASELINE ── 12ms ── ACTIVE",
  "COST OPTIMIZER ── LOADED",
  "FALLBACK CHAINS ── ARMED",
];
const READY_LINE = "▸ SYSTEM READY ─────────────────────────────";

// Show the cinematic boot at most once per browser session.
const SEEN_KEY = "ff_booted";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  // Skip entirely if the user has seen it this session OR prefers reduced motion.
  const skip =
    typeof window !== "undefined" &&
    (sessionStorage.getItem(SEEN_KEY) === "1" || prefersReducedMotion());

  const [visible, setVisible] = useState(!skip);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (skip) {
      onComplete();
      return;
    }
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}

    timers.current.push(
      setTimeout(() => {
        setExiting(true);
        timers.current.push(
          setTimeout(() => { setVisible(false); onComplete(); }, 600),
        );
      }, 2400),
    );
    return () => { timers.current.forEach(clearTimeout); };
  }, [skip, onComplete]);

  const finish = () => {
    timers.current.forEach(clearTimeout);
    setVisible(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="System boot sequence"
      style={{
        position: "fixed", inset: 0, zIndex: 1000, background: "var(--ff-void)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
        opacity: exiting ? 0 : 1, transition: "opacity 0.6s ease",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        <div style={{
          fontFamily: "'Syncopate', sans-serif", fontSize: "2.8rem", fontWeight: 700,
          color: "var(--ff-neon)", textShadow: "var(--ff-glow-md)", marginBottom: "2.5rem",
          letterSpacing: "0.08em", animation: "ff-boot-logo-in 0.5s ease both",
        }}>FF_</div>

        <div style={{ marginBottom: "1.8rem" }}>
          {BOOT_LINES.map((line, i) => (
            <div key={i} className="ff-bl" style={{ animationDelay: `${0.35 + i * 0.22}s` }}>{line}</div>
          ))}
          <div className="ff-bl ff-bl-ready" style={{ animationDelay: "1.72s" }}>{READY_LINE}</div>
        </div>

        <div style={{ height: "1px", background: "rgba(123,0,255,0.18)" }}>
          <div style={{
            height: "100%", background: "var(--ff-neon)", boxShadow: "var(--ff-glow-sm)",
            width: 0, animation: "ff-boot-fill 1.5s 0.4s ease-out forwards",
          }} />
        </div>

        {/* Always offer an escape. */}
        <button
          onClick={finish}
          style={{
            marginTop: "2rem", background: "transparent", border: "1px solid rgba(191,0,255,0.4)",
            color: "rgba(232,213,255,0.7)", fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "0.5rem 1.2rem", cursor: "pointer",
          }}
        >
          Skip ▸
        </button>
      </div>
    </div>
  );
}
