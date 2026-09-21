"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.5rem 3.5rem",
    fontFamily: "var(--ff-mono, 'Space Mono', monospace)",
    fontSize: ".7rem",
    letterSpacing: ".12em",
    textTransform: "uppercase" as const,
    transition: "border-color .4s, background .4s, backdrop-filter .4s",
    borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
    background: scrolled ? "rgba(4,10,18,.7)" : "transparent",
    backdropFilter: scrolled ? "blur(16px)" : "none",
  };

  return (
    <nav style={navStyle}>
      <Link href="#hero" style={{ color: "var(--cyan)", fontWeight: 700, fontSize: ".75rem", textDecoration: "none", letterSpacing: ".16em" }}>
        KR
      </Link>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {[["#about", "About"], ["#work", "Work"], ["#writing", "Writing"], ["#contact", "Contact"]].map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              style={{ color: "var(--text-muted)", textDecoration: "none", letterSpacing: ".12em", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
