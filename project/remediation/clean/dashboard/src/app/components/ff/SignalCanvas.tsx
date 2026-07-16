import { useEffect, useRef } from "react";

interface Ping {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  maxR: number;
}

export function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const spring = { x: mouse.x, y: mouse.y, vx: 0, vy: 0 };
    const trace: { x: number; y: number }[] = [];
    const MAX_T = 52;
    let mouseActive = false;
    const pings: Ping[] = [];

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouseActive = true;
    };

    const onClick = (e: MouseEvent) => {
      for (let r = 0; r < 3; r++) {
        pings.push({
          x: e.clientX,
          y: e.clientY,
          radius: r * 18,
          alpha: 1 - r * 0.22,
          speed: 2.8 + r * 0.9,
          maxR: 200 + r * 50,
        });
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseActive) {
        spring.vx += (mouse.x - spring.x) * 0.11;
        spring.vy += (mouse.y - spring.y) * 0.11;
        spring.vx *= 0.7;
        spring.vy *= 0.7;
        spring.x += spring.vx;
        spring.y += spring.vy;
        trace.push({ x: spring.x, y: spring.y });
        if (trace.length > MAX_T) trace.shift();
      }

      if (trace.length > 2) {
        for (let i = 1; i < trace.length; i++) {
          const t = i / trace.length;
          ctx.beginPath();
          ctx.moveTo(trace[i - 1].x, trace[i - 1].y);
          ctx.lineTo(trace[i].x, trace[i].y);
          ctx.strokeStyle = `rgba(191,0,255,${t * 0.58})`;
          ctx.lineWidth = t * 2.8;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        const tip = trace[trace.length - 1];
        const g = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 14);
        g.addColorStop(0, "rgba(224,64,251,0.7)");
        g.addColorStop(1, "rgba(191,0,255,0)");
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.radius += p.speed;
        p.alpha = Math.max(0, 1 - p.radius / p.maxR);
        if (p.alpha <= 0) { pings.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(191,0,255,${p.alpha * 0.72})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (p.radius > 25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.42, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(224,64,251,${p.alpha * 0.38})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8,
        pointerEvents: "none",
      }}
    />
  );
}
