import { useEffect, useRef } from "react";

export function Scene() {
  const gridRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const shardsNearRef = useRef<HTMLDivElement>(null);
  const shardsMidRef = useRef<HTMLDivElement>(null);
  const shardsFarRef = useRef<HTMLDivElement>(null);
  const boltsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Spawn shards
  useEffect(() => {
    const spawnShards = (container: HTMLDivElement | null, count: number) => {
      if (!container) return;
      container.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "ff-shard";
        const w = Math.random() * 80 + 18;
        const h = w * (Math.random() * 1.8 + 0.5);
        const r = Math.floor(123 + Math.random() * 68);
        const g2 = Math.floor(Math.random() * 40);
        const b = Math.floor(200 + Math.random() * 55);
        const a = (Math.random() * 0.38 + 0.1).toFixed(2);
        s.style.cssText = `
          width:${w}px;height:${h}px;
          left:${Math.random() * 112 - 6}%;
          top:${Math.random() * 112 - 6}%;
          transform:rotate(${Math.random() * 360}deg);
          opacity:${(Math.random() * 0.38 + 0.05).toFixed(2)};
          border-color:rgba(${r},${g2},${b},${a});
        `;
        container.appendChild(s);
      }
    };

    spawnShards(shardsNearRef.current, 5);
    spawnShards(shardsMidRef.current, 9);
    spawnShards(shardsFarRef.current, 14);
  }, []);

  // Spawn bolts
  useEffect(() => {
    const container = boltsRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const b = document.createElement("div");
      b.className = "ff-bolt";
      b.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 60}%;
        height:${Math.random() * 200 + 80}px;
        animation-delay:${Math.random() * 6}s;
        animation-duration:${Math.random() * 4 + 3}s;
      `;
      container.appendChild(b);
    }
  }, []);

  // Spawn particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 32; i++) {
      const p = document.createElement("div");
      p.className = "ff-particle";
      const size = Math.random() > 0.7 ? 3 : 2;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${size}px;
        height:${size}px;
        animation-duration:${Math.random() * 6 + 4}s;
        animation-delay:${Math.random() * 6}s;
      `;
      container.appendChild(p);
    }
  }, []);

  // Parallax
  useEffect(() => {
    const layers: { el: HTMLElement; depth: number }[] = [];
    const allLayers = document.querySelectorAll<HTMLElement>(".ff-layer[data-depth]");
    allLayers.forEach((el) => {
      layers.push({ el, depth: parseFloat(el.dataset.depth || "0") });
    });

    let tX = 0, tY = 0, pX = 0, pY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      tX = (e.clientX / window.innerWidth - 0.5) * 2;
      tY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const anim = () => {
      pX += (tX - pX) * 0.05;
      pY += (tY - pY) * 0.05;
      layers.forEach(({ el, depth }) => {
        el.style.transform = `translate3d(${pX * depth * 120}px,${pY * depth * 80}px,0)`;
      });
      rafId = requestAnimationFrame(anim);
    };
    anim();

    const onScroll = () => {
      const sy = window.scrollY;
      if (orbARef.current) orbARef.current.style.transform = `translateY(${sy * 0.22}px)`;
      if (orbBRef.current) orbBRef.current.style.transform = `translateY(${-sy * 0.16}px)`;
      if (gridRef.current) {
        const factor = 1 + sy * 0.0003;
        gridRef.current.style.backgroundSize = `${Math.min(140, 60 * factor)}px ${Math.min(140, 60 * factor)}px`;
      }
    };

    document.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    willChange: "transform",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Grid */}
      <div
        ref={gridRef}
        className="ff-layer"
        data-depth="0.12"
        style={{
          position: "absolute",
          inset: "-20%",
          width: "140%",
          height: "140%",
          backgroundImage:
            "linear-gradient(rgba(123,0,255,0.065) 1px, transparent 1px), linear-gradient(90deg, rgba(123,0,255,0.065) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          willChange: "transform, background-size",
        }}
      />

      {/* Orbs */}
      <div className="ff-layer" data-depth="0.07" style={layerStyle}>
        <div
          ref={orbARef}
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.55,
            willChange: "transform",
            width: "620px",
            height: "620px",
            background: "radial-gradient(circle, #7b00ff 0%, transparent 70%)",
            top: "-12%",
            left: "-16%",
          }}
        />
        <div
          ref={orbBRef}
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.38,
            willChange: "transform",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #bf00ff 0%, transparent 70%)",
            bottom: "-6%",
            right: "-10%",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.22,
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, #e040fb 0%, transparent 70%)",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Shards - near, mid, far */}
      <div ref={shardsNearRef} className="ff-layer" data-depth="0.28" style={layerStyle} />
      <div ref={shardsMidRef} className="ff-layer" data-depth="0.16" style={layerStyle} />
      <div ref={shardsFarRef} className="ff-layer" data-depth="0.06" style={layerStyle} />

      {/* Bolts */}
      <div ref={boltsRef} className="ff-layer" data-depth="0.05" style={layerStyle} />

      {/* Particles */}
      <div ref={particlesRef} className="ff-layer" data-depth="0.22" style={layerStyle} />

      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(191,0,255,0.018) 3px, rgba(191,0,255,0.018) 4px)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 38%, rgba(3,0,10,0.88) 100%)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />

      {/* Noise */}
      <div className="ff-noise" />
    </div>
  );
}
