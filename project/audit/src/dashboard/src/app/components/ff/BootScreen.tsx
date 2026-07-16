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

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Boot sequence ends at ~2.2s then exit
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 600);
    }, 2400);

    return () => clearTimeout(timerRef.current);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "var(--ff-void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "2.8rem",
            fontWeight: 700,
            color: "var(--ff-neon)",
            textShadow: "var(--ff-glow-md)",
            marginBottom: "2.5rem",
            letterSpacing: "0.08em",
            animation: "ff-boot-logo-in 0.5s ease both",
          }}
        >
          FF_
        </div>

        {/* Boot lines */}
        <div style={{ marginBottom: "1.8rem" }}>
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className="ff-bl"
              style={{
                animationDelay: `${0.35 + i * 0.22}s`,
              }}
            >
              {line}
            </div>
          ))}
          <div
            className="ff-bl ff-bl-ready"
            style={{ animationDelay: "1.72s" }}
          >
            {READY_LINE}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "1px",
            background: "rgba(123,0,255,0.18)",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--ff-neon)",
              boxShadow: "var(--ff-glow-sm)",
              width: 0,
              animation: "ff-boot-fill 1.5s 0.4s ease-out forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
}
