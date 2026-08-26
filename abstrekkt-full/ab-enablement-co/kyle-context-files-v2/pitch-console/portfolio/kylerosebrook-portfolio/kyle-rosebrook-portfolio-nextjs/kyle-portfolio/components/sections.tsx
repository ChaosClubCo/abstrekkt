"use client";

import { useEffect, useRef } from "react";

// ── Shared reveal hook ──────────────────────────────────────────────────────
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Shared section label ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--ff-mono,'Space Mono',monospace)",
      fontSize: ".65rem", letterSpacing: ".25em",
      color: "var(--cyan)", textTransform: "uppercase",
      marginBottom: "1rem",
      display: "flex", alignItems: "center", gap: "1rem",
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: "var(--border)", maxWidth: 60, display: "block" }} />
    </p>
  );
}

// ── ABOUT ───────────────────────────────────────────────────────────────────
export function About() {
  useReveal();

  const skills = [
    "Claude","Supabase","Cloudflare","Vercel","GitHub",
    "n8n","Make","Zapier","Stripe","PostHog",
    "Notion","Resend","Google AI","TypeScript",
    "React","Next.js","Node.js","Java",
  ];

  const stats = [
    { num: "529+", label: "Unit tests shipped" },
    { num: "13+", label: "Active MCP configs" },
    { num: "500+", label: "GitHub repos" },
    { num: "3", label: "Newsletter tiers" },
  ];

  return (
    <section id="about" style={{
      padding: "7rem 3.5rem",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "5rem",
      alignItems: "start",
    }}>
      <div className="reveal">
        <SectionLabel>About</SectionLabel>
        <h2 style={{
          fontFamily: "var(--ff-display,'Syne',sans-serif)",
          fontWeight: 800,
          fontSize: "clamp(2.2rem,5vw,4rem)",
          lineHeight: 1, letterSpacing: "-.02em",
        }}>
          Building at the<br />intersection of<br />
          <span style={{ color: "var(--cyan)" }}>security &amp; AI.</span>
        </h2>
        <div style={{ marginTop: "2rem", color: "var(--text-dim)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "42ch" }}>
          <p>Staff Engineer at Intinc — a Lincolnshire, IL managed services firm. I own AppSec, platform engineering, and AI enablement. My job is to make sure the systems we build are fast, secure, and actually adopted.</p>
          <p style={{ marginTop: "1.2rem" }}>Background in hospitality management, quality control, and retail before pivoting hard into computer science and AI. I build with Claude, Supabase, Cloudflare, n8n, Vercel, GitHub, and whatever else gets the job done securely.</p>
          <p style={{ marginTop: "1.2rem" }}>I write <em>The Prompt</em> — a weekly AI intelligence brief covering what's actually changing in the AI ecosystem and what it means for teams building on top of it.</p>
        </div>
      </div>

      <div className="reveal reveal-delay-2" style={{ paddingTop: "1rem" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "1px", background: "var(--border)",
          border: "1px solid var(--border)", marginBottom: "2.5rem",
        }}>
          {stats.map(({ num, label }) => (
            <div key={label} style={{ background: "var(--surface)", padding: "1.8rem 1.5rem" }}>
              <div style={{ fontFamily: "var(--ff-display,'Syne',sans-serif)", fontSize: "2.5rem", fontWeight: 800, color: "var(--cyan)", lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--text-muted)", textTransform: "uppercase", marginTop: ".4rem" }}>{label}</div>
            </div>
          ))}
        </div>

        <SectionLabel>Stack</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "1.5rem" }}>
          {skills.map((s) => (
            <span key={s} className="skill-tag" style={{
              fontFamily: "var(--ff-mono,'Space Mono',monospace)",
              fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase",
              color: "var(--text-muted)", border: "1px solid var(--border)",
              padding: ".35rem .85rem", borderRadius: "1px", cursor: "default",
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WORK ────────────────────────────────────────────────────────────────────
const projects = [
  {
    num: "01", title: "INT AI Platform",
    desc: "Enterprise AI strategy and enablement infrastructure for Intinc. Includes Claude-native workflows, IDP builder, KB article generator, and headset troubleshooter—deployed to internal staff.",
    tags: ["Claude", "AppSec", "n8n", "Notion"],
  },
  {
    num: "02", title: "Intinc Deployment Kit",
    desc: "GitHub + Notion + n8n orchestrator that auto-advances through 6 deployment phases. Built for repeatable, auditable client onboarding without manual overhead.",
    tags: ["GitHub", "n8n", "Notion", "Automation"],
  },
  {
    num: "03", title: "Supabase Security Audit",
    desc: "Full RLS audit of production Supabase project. Identified and closed violations on invite_codes and api_keys tables. Full E2E HTTP audit covering null byte injection, missing headers, and rate limiting gaps.",
    tags: ["Supabase", "RLS", "OWASP", "AppSec"],
  },
  {
    num: "04", title: "Persona Simulation Testing",
    desc: "AI agent testing framework using k6, Playwright, and adversarial probing to simulate user personas at scale. Built for stress and behavioral testing of internal INT tooling.",
    tags: ["k6", "Playwright", "AI Agents", "Testing"],
  },
  {
    num: "05", title: "MCP Architecture",
    desc: "13+ active Model Context Protocol configurations wired into local Claude setup. Includes Playwright MCP scoping, web_fetch SPA handling, Cloudflare, GitHub, Supabase, Slack, and custom skill packs.",
    tags: ["MCP", "Claude", "Cloudflare", "GitHub"],
  },
  {
    num: "06", title: "The Prompt Newsletter",
    desc: "Weekly AI intelligence brief with a 3-tier audience structure. Covers Anthropic, Google, OpenAI, and Microsoft ecosystem shifts. Research, draft, edit, and format pipeline built entirely in Claude.",
    tags: ["AI Research", "Claude", "n8n", "Editorial"],
  },
];

export function Work() {
  return (
    <section id="work" style={{ padding: "5rem 3.5rem 7rem" }}>
      <div className="reveal"><SectionLabel>Work</SectionLabel></div>
      <h2 className="reveal reveal-delay-1" style={{
        fontFamily: "var(--ff-display,'Syne',sans-serif)", fontWeight: 800,
        fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1, letterSpacing: "-.02em",
      }}>
        Selected projects &amp;<br />platforms built.
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
        gap: "1px", background: "var(--border)",
        border: "1px solid var(--border)", marginTop: "4rem",
      }}>
        {projects.map(({ num, title, desc, tags }, i) => (
          <WorkCard key={num} num={num} title={title} desc={desc} tags={tags} delay={i % 3} />
        ))}
      </div>
    </section>
  );
}

function WorkCard({ num, title, desc, tags, delay }: {
  num: string; title: string; desc: string; tags: string[]; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!ref.current) return;
    ref.current.style.background = "var(--surface2)";
    const arrow = ref.current.querySelector<HTMLDivElement>(".work-card-arrow");
    const titleEl = ref.current.querySelector<HTMLDivElement>(".card-title");
    if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateY(0)"; arrow.style.borderColor = "var(--cyan-dim)"; arrow.style.color = "var(--cyan)"; }
    if (titleEl) titleEl.style.color = "var(--cyan)";
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.background = "var(--surface)";
    const arrow = ref.current.querySelector<HTMLDivElement>(".work-card-arrow");
    const titleEl = ref.current.querySelector<HTMLDivElement>(".card-title");
    if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateY(4px)"; arrow.style.borderColor = "var(--border)"; arrow.style.color = "var(--text-muted)"; }
    if (titleEl) titleEl.style.color = "var(--text)";
  };

  return (
    <div
      ref={ref}
      className={`work-card reveal${delay > 0 ? ` reveal-delay-${delay}` : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ background: "var(--surface)", padding: "2.5rem", position: "relative", overflow: "hidden", transition: "background .3s" }}
    >
      <div style={{ fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--text-muted)", marginBottom: "2rem" }}>{num}</div>
      <div className="card-title" style={{ fontFamily: "var(--ff-display,'Syne',sans-serif)", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "-.01em", marginBottom: ".75rem", color: "var(--text)", transition: "color .2s" }}>{title}</div>
      <div style={{ fontSize: ".9rem", color: "var(--text-dim)", lineHeight: 1.7, maxWidth: "36ch" }}>{desc}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "1.5rem" }}>
        {tags.map((t) => (
          <span key={t} style={{
            fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--cyan)", background: "rgba(0,200,240,.08)",
            border: "1px solid rgba(0,200,240,.2)", padding: ".25rem .65rem", borderRadius: "1px",
          }}>{t}</span>
        ))}
      </div>
      <div className="work-card-arrow" style={{
        position: "absolute", bottom: "2rem", right: "2rem",
        width: 36, height: 36, border: "1px solid var(--border)", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-muted)", fontSize: ".9rem",
        transition: "all .25s", opacity: 0, transform: "translateY(4px)",
      }}>↗</div>
    </div>
  );
}

// ── WRITING ─────────────────────────────────────────────────────────────────
const editions = [
  { vol: "VOL.12", title: "Ecosystem Shift: Agents Want Tools", sub: "Anthropic · Google · OpenAI · Microsoft — what the tool-use surge means for platform teams" },
  { vol: "VOL.11", title: "The MCP Consolidation", sub: "Why Model Context Protocol is becoming the de facto agent integration layer" },
  { vol: "VOL.10", title: "Claude 4 & The Reasoning Divide", sub: "What extended thinking changes for production AppSec workflows" },
  { vol: "VOL.09", title: "Agentic Security Surface", sub: "Threat modeling AI agents before they hit prod — a practitioner framework" },
];

export function Writing() {
  return (
    <section id="writing" style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      padding: "7rem 3.5rem",
    }}>
      <div className="reveal"><SectionLabel>Writing</SectionLabel></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", marginTop: "4rem", alignItems: "center" }}>
        <div className="reveal">
          <h3 style={{ fontFamily: "var(--ff-display,'Syne',sans-serif)", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            The Prompt —<br />AI intelligence,<br /><span style={{ color: "var(--cyan)" }}>without the noise.</span>
          </h3>
          <p style={{ color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.8, maxWidth: "40ch" }}>
            Weekly briefing covering what's actually shifting in the AI ecosystem. Three tiers: executive summary, practitioner depth, and technical implementation notes. No hype. No filler.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", gap: ".6rem",
              background: "var(--cyan)", color: "var(--void)",
              fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".72rem", fontWeight: 700,
              letterSpacing: ".12em", textTransform: "uppercase",
              textDecoration: "none", padding: ".85rem 2rem", borderRadius: "2px",
            }}>Subscribe ↗</a>
          </div>
        </div>

        <div className="reveal reveal-delay-2">
          <div style={{ border: "1px solid var(--border)" }}>
            {editions.map(({ vol, title, sub }, i) => (
              <div key={vol} style={{
                padding: "1.5rem", borderBottom: i < editions.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex", gap: "1.5rem", alignItems: "flex-start",
                transition: "background .2s",
                cursor: "default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".65rem", letterSpacing: ".1em", color: "var(--cyan)", minWidth: "3.5rem", paddingTop: ".15rem" }}>{vol}</div>
                <div>
                  <div style={{ fontSize: ".95rem", fontWeight: 400, color: "var(--text)", marginBottom: ".3rem" }}>{title}</div>
                  <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ─────────────────────────────────────────────────────────────────
export function Contact() {
  return (
    <section id="contact" style={{ textAlign: "center", padding: "9rem 3.5rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
          <SectionLabel>Contact</SectionLabel>
        </div>
        <h2 className="reveal reveal-delay-1" style={{
          fontFamily: "var(--ff-display,'Syne',sans-serif)", fontWeight: 800,
          fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-.02em", lineHeight: 1.1,
        }}>
          Let's build<br />something serious.
        </h2>
        <a
          href="mailto:kyle@krosebrook.com"
          className="reveal reveal-delay-2"
          style={{
            display: "block",
            fontFamily: "var(--ff-display,'Syne',sans-serif)", fontWeight: 700,
            fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-.02em",
            color: "var(--text)", textDecoration: "none",
            borderBottom: "2px solid var(--border)",
            paddingBottom: ".75rem", margin: "2.5rem 0",
            transition: "color .2s, border-color .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--cyan)"; e.currentTarget.style.borderColor = "var(--cyan)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          kyle@krosebrook.com
        </a>
        <p className="reveal reveal-delay-3" style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
          Based in Chicago-Land Area &nbsp;·&nbsp; Open to collaboration and consulting
        </p>
        <div className="reveal reveal-delay-4" style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
          {[
            ["https://github.com/Krosebrook", "GitHub"],
            ["#writing", "Newsletter"],
            ["https://linkedin.com", "LinkedIn"],
          ].map(([href, label]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} style={{
              fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".68rem", letterSpacing: ".15em", textTransform: "uppercase",
              color: "var(--text-muted)", textDecoration: "none",
              display: "flex", alignItems: "center", gap: ".5rem",
              transition: "color .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "block" }} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{
      padding: "2.5rem 3.5rem",
      borderTop: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "var(--ff-mono,'Space Mono',monospace)", fontSize: ".62rem", letterSpacing: ".12em",
      color: "var(--text-muted)", textTransform: "uppercase",
    }}>
      <span>© 2026 Kyle Rosebrook</span>
      <div style={{ display: "flex", gap: "2rem" }}>
        {[["#hero", "Back to top ↑"], ["https://github.com/Krosebrook", "GitHub"], ["#contact", "Contact"]].map(([href, label]) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} style={{
            color: "var(--text-muted)", textDecoration: "none", transition: "color .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >{label}</a>
        ))}
      </div>
    </footer>
  );
}
