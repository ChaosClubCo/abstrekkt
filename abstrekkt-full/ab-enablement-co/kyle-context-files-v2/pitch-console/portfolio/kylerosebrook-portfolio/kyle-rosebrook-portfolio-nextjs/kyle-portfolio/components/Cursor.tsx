"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const startedRef = useRef(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // Hidden until mouse actually enters the viewport
    cursor.style.opacity = "0";
    ring.style.opacity = "0";

    // Snap both dot and ring instantly — no lerp sweep
    const snapTo = (x: number, y: number) => {
      mouseRef.current = { x, y };
      ringPos.current = { x, y };
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
      ring.style.left = x + "px";
      ring.style.top = y + "px";
    };

    const onMove = (e: MouseEvent) => {
      if (!startedRef.current) {
        snapTo(e.clientX, e.clientY);
        cursor.style.opacity = "1";
        ring.style.opacity = "1";
        startedRef.current = true;
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    // Re-entry: snap ring to entry coords so it doesn't sweep from old position
    const onEnter = (e: MouseEvent) => {
      snapTo(e.clientX, e.clientY);
      cursor.style.opacity = "1";
      ring.style.opacity = "1";
      startedRef.current = true;
    };

    const onLeave = () => {
      cursor.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const animateRing = () => {
      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.1;
      ring.style.left = ringPos.current.x + "px";
      ring.style.top = ringPos.current.y + "px";
      rafRef.current = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
