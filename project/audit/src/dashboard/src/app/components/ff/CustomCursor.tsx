import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let rx = cx, ry = cy;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
    };

    const animCursor = () => {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      rafId = requestAnimationFrame(animCursor);
    };
    animCursor();

    const onDown = () => document.body.classList.add("ff-clicking");
    const onUp = () => document.body.classList.remove("ff-clicking");

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const expand = () => {
      if (!cursorRef.current || !ringRef.current) return;
      cursorRef.current.style.width = "18px";
      cursorRef.current.style.height = "18px";
      ringRef.current.style.width = "56px";
      ringRef.current.style.height = "56px";
      ringRef.current.style.borderColor = "rgba(191,0,255,0.9)";
    };
    const shrink = () => {
      if (!cursorRef.current || !ringRef.current) return;
      cursorRef.current.style.width = "10px";
      cursorRef.current.style.height = "10px";
      ringRef.current.style.width = "36px";
      ringRef.current.style.height = "36px";
      ringRef.current.style.borderColor = "rgba(191,0,255,0.5)";
    };

    const targets = document.querySelectorAll(".ff-interactive");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    const observer = new MutationObserver(() => {
      const all = document.querySelectorAll(".ff-interactive");
      all.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "var(--ff-neon)",
          boxShadow: "var(--ff-glow-md)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.18s, height 0.18s, background 0.2s",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(191,0,255,0.5)",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "width 0.18s, height 0.18s, border-color 0.2s",
        }}
      />
    </>
  );
}
