import { useEffect, useRef, useState } from "react";

const HUD_DATA = {
  latency: {
    vals: ["9ms", "11ms", "12ms", "14ms", "8ms", "13ms", "10ms"],
    fills: ["94%", "88%", "90%", "84%", "97%", "86%", "91%"],
    fillId: "hf-lat",
  },
  cost: {
    vals: ["$0.0003", "$0.0004", "$0.0006", "$0.0002", "$0.0005"],
    fills: ["15%", "20%", "30%", "10%", "25%"],
    fillId: "hf-cost",
  },
  model: {
    vals: ["haiku-4", "sonnet-4", "gemini-flash", "gpt-4o-mini"],
    fills: ["60%", "82%", "72%", "50%"],
    fillId: "hf-model",
  },
  tokens: {
    vals: ["847", "1204", "632", "958", "1047", "741", "1129"],
    fills: ["42%", "60%", "32%", "48%", "52%", "37%", "56%"],
    fillId: "hf-tok",
  },
};

interface HudValue {
  val: string;
  fill: string;
  flashing: boolean;
}

interface HudState {
  latency: HudValue;
  cost: HudValue;
  model: HudValue;
  tokens: HudValue;
}

function getInitial(): HudState {
  return {
    latency: { val: "12ms", fill: "90%", flashing: false },
    cost: { val: "$0.0004", fill: "20%", flashing: false },
    model: { val: "haiku-4", fill: "60%", flashing: false },
    tokens: { val: "847", fill: "42%", flashing: false },
  };
}

interface HudTagProps {
  label: string;
  value: string;
  fill: string;
  flashing: boolean;
  style?: React.CSSProperties;
}

function HudTag({ label, value, fill, flashing, style }: HudTagProps) {
  return (
    <div className="ff-hud-tag" style={style}>
      <div
        style={{
          fontSize: "0.48rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(191,0,255,0.55)",
          marginBottom: "0.28rem",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: "var(--ff-neon)",
          textShadow: "var(--ff-glow-sm)",
          marginBottom: "0.38rem",
          fontFamily: "'Space Mono', monospace",
          opacity: flashing ? 0.2 : 1,
          transition: "opacity 0.25s",
        }}
      >
        {value}
      </div>
      <div style={{ height: "1px", background: "rgba(123,0,255,0.18)" }}>
        <div
          style={{
            height: "100%",
            background: "var(--ff-neon)",
            boxShadow: "var(--ff-glow-sm)",
            width: fill,
            transition: "width 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

interface HudOverlayProps {
  visible: boolean;
}

export function HudOverlay({ visible }: HudOverlayProps) {
  const [state, setState] = useState<HudState>(getInitial());
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!visible) return;

    const tick = () => {
      // Flash all
      setState((prev) => ({
        latency: { ...prev.latency, flashing: true },
        cost: { ...prev.cost, flashing: true },
        model: { ...prev.model, flashing: true },
        tokens: { ...prev.tokens, flashing: true },
      }));

      setTimeout(() => {
        setState(() => {
          const li = Math.floor(Math.random() * HUD_DATA.latency.vals.length);
          const ci = Math.floor(Math.random() * HUD_DATA.cost.vals.length);
          const mi = Math.floor(Math.random() * HUD_DATA.model.vals.length);
          const ti = Math.floor(Math.random() * HUD_DATA.tokens.vals.length);
          return {
            latency: { val: HUD_DATA.latency.vals[li], fill: HUD_DATA.latency.fills[li], flashing: false },
            cost: { val: HUD_DATA.cost.vals[ci], fill: HUD_DATA.cost.fills[ci], flashing: false },
            model: { val: HUD_DATA.model.vals[mi], fill: HUD_DATA.model.fills[mi], flashing: false },
            tokens: { val: HUD_DATA.tokens.vals[ti], fill: HUD_DATA.tokens.fills[ti], flashing: false },
          };
        });
      }, 240);
    };

    intervalRef.current = setInterval(tick, 3400);
    return () => clearInterval(intervalRef.current);
  }, [visible]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s 0.3s",
      }}
    >
      <HudTag
        label="LATENCY"
        value={state.latency.val}
        fill={state.latency.fill}
        flashing={state.latency.flashing}
        style={{ top: "17%", left: "6%" }}
      />
      <HudTag
        label="COST / REQ"
        value={state.cost.val}
        fill={state.cost.fill}
        flashing={state.cost.flashing}
        style={{ top: "28%", right: "5%" }}
      />
      <HudTag
        label="ACTIVE MODEL"
        value={state.model.val}
        fill={state.model.fill}
        flashing={state.model.flashing}
        style={{ top: "60%", left: "4%" }}
      />
      <HudTag
        label="TOKENS"
        value={state.tokens.val}
        fill={state.tokens.fill}
        flashing={state.tokens.flashing}
        style={{ bottom: "16%", right: "7%" }}
      />
    </div>
  );
}
