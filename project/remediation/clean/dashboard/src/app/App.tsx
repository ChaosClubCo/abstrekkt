import { useEffect, useState } from "react";
import "../styles/cursor-fix.css";
import { BootScreen } from "./components/ff/BootScreen";
import { Scene } from "./components/ff/Scene";
import { SignalCanvas } from "./components/ff/SignalCanvas";
import { CustomCursor } from "./components/ff/CustomCursor";
import { HudOverlay } from "./components/ff/HudOverlay";
import { Nav } from "./components/ff/Nav";
import { Hero } from "./components/ff/Hero";
import { Stats } from "./components/ff/Stats";
import { Features } from "./components/ff/Features";
import { Differentiators } from "./components/ff/Differentiators";
import { Customers } from "./components/ff/Customers";
import { AnthropicBadge } from "./components/ff/AnthropicBadge";
import { Pricing } from "./components/ff/Pricing";
import { CtaSection } from "./components/ff/CtaSection";
import { Footer } from "./components/ff/Footer";

export default function App() {
  const [booted, setBooted] = useState(false);

  // Enable the custom cursor only where it's safe (fine pointer + motion ok).
  const [fancyCursor, setFancyCursor] = useState(false);
  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFancyCursor(ok);
    if (ok) document.documentElement.classList.add("ff-custom-cursor");
    return () => document.documentElement.classList.remove("ff-custom-cursor");
  }, []);

  return (
    <div
      style={{
        background: "var(--ff-void)",
        color: "var(--ff-white)",
        fontFamily: "'Syne', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Fixed background layer */}
      <Scene />

      {/* Signal trail canvas */}
      <SignalCanvas />

      {/* Custom cursor — only on fine-pointer, motion-ok devices */}
      {fancyCursor && <CustomCursor />}

      {/* HUD overlay */}
      <HudOverlay visible={booted} />

      {/* Boot screen */}
      <BootScreen onComplete={() => setBooted(true)} />

      {/* Navigation */}
      <Nav visible={booted} />

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Hero visible={booted} />
        <Stats />

        {/* Market context divider */}
        <SectionDivider label="// Core Platform" />
        <Features />

        <SectionDivider label="// Why FlashFusion Wins" />
        <Differentiators />

        <SectionDivider label="// Verticals We're Building" />
        <Customers />

        <SectionDivider label="// Partnership Path" />
        <AnthropicBadge />

        <SectionDivider label="// Pricing" />
        <Pricing />

        <CtaSection />
        <Footer />
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "0 2.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(123,0,255,0.3))",
        }}
      />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(191,0,255,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(123,0,255,0.3), transparent)",
        }}
      />
    </div>
  );
}
