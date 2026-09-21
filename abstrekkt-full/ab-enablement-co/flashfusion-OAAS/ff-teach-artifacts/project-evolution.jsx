import { useState } from "react";

const phases = [
  {
    id: "foundation",
    period: "Pre-2025",
    label: "The Foundation",
    tag: "ORIGIN",
    color: "#6b7280",
    accent: "#9ca3af",
    tagline: "Hospitality → Tech. People skills meet systems thinking.",
    summary: "Bartending and hospitality management wired in crisis management, pattern recognition under pressure, and reading people fast. These became the substrate for everything after.",
    projects: [
      { name: "Career pivot into IT", type: "role", note: "L1 Service Desk @ Intinc — hired outside normal CSR track due to hybrid tech+people profile" },
      { name: "Prompt engineering frameworks", type: "framework", note: "R-I-S-E, F-L-O-W, R-O-S-E — personal methodology codified early" },
      { name: "Security-first mindset", type: "mindset", note: "OWASP, AppSec lens baked in from the start" },
    ],
    throughline: "Built the pattern-recognition and people instincts that now show up in how you architect systems and write personas.",
  },
  {
    id: "int",
    period: "Late 2025",
    label: "INT Lane",
    tag: "BUILDER",
    color: "#0ea5e9",
    accent: "#38bdf8",
    tagline: "Self-initiated AI tooling on top of a day job. Nobody asked. You built anyway.",
    summary: "330 Intinc skills (phases 1–5, 100% validated). INT Smart Triage AI. Comprehensive prompt library and Claude skill ecosystem. All self-directed, none assigned.",
    projects: [
      { name: "INT Smart Triage AI", type: "tool", note: "AI-assisted ticket triage for L1 — real operational use" },
      { name: "330-skill Intinc library", type: "library", note: "5 phases, fully validated, gerund-naming compliant" },
      { name: "Threat Modeling / AI Eval Rubric", type: "docs", note: "Enterprise-grade frameworks built for a non-engineering org" },
      { name: "Claude skill ecosystem", type: "system", note: "~30 hands-on skills; WSJF repair queue; custom YAML specs" },
    ],
    throughline: "Established that you operate at a level above your title. INT work is where the methodology got proven.",
  },
  {
    id: "brand",
    period: "Late 2025 – Early 2026",
    label: "Personal Brand",
    tag: "VOICE",
    color: "#8b5cf6",
    accent: "#a78bfa",
    tagline: "Built the platform for the person, not just the projects.",
    summary: "kylerosebrook.com launched. The Prompt newsletter started. Claude Community Ambassador and Certified Architect applications filed. Memoir pitch drafted to Business Insider.",
    projects: [
      { name: "kylerosebrook.com", type: "site", note: "WordPress, Assembler theme, dark monochromatic — Claude Design blog post, WCAG AA fixes" },
      { name: "The Prompt newsletter", type: "content", note: "AI-focused, multi-tier audience" },
      { name: "Claude Ambassador / Architect applications", type: "credential", note: "Both filed — recognizing the depth of the Claude ecosystem work" },
      { name: "Memoir (active)", type: "creative", note: "Survival/transformation narrative. Songs as structural anchors. Pitched to Business Insider." },
    ],
    throughline: "The brand work is the container for everything else — it's what makes the projects cohere into a story.",
  },
  {
    id: "flashnframe",
    period: "Early 2026 → Shelved Mar 2026",
    label: "Flash-n-Frame",
    tag: "SHELVED",
    color: "#ef4444",
    accent: "#f87171",
    tagline: "AI model router SaaS. Pre-seed ambitions. Real product. Wrong timing.",
    summary: "Intelligent LLM routing infrastructure — Cloudflare for AI inference. Full landing page, beta tester materials, $250K–$500K raise target. Shelved March 2026.",
    projects: [
      { name: "flashnframe.com SPA", type: "product", note: "React + Vite, working features, AI routing core" },
      { name: "Pre-seed pitch materials", type: "biz", note: "Targeting AI engineers and platform teams" },
      { name: "Cloudflare WAF/Worker work", type: "infra", note: "site-toggle.sh, ongoing infra maintenance even post-shelf" },
    ],
    throughline: "Flash-n-Frame proved you can go from 0 → product. The routing architecture thinking resurfaced directly in Orchestrator AI.",
  },
  {
    id: "flashfusion",
    period: "Early–Mid 2026",
    label: "FlashFusion Ecosystem",
    tag: "OPERATOR",
    color: "#f59e0b",
    accent: "#fbbf24",
    tagline: "E-commerce operator. Multiple revenue experiments. High surface area.",
    summary: "Wix store (20 products, 10 collections), AffordableStoreStuff multi-platform seller, INT Customization Service SPIKE ($300K–$500K Y1 target). 17 Vercel projects spawned during this period.",
    projects: [
      { name: "FlashFusion Wix Store", type: "store", note: "Catalog V1, persona coupons, 3 remaining manual blockers (Velo, Shipping, Click tracking)" },
      { name: "AffordableStoreStuff", type: "store", note: "Multi-platform seller, Base44 backend migration" },
      { name: "INT Customization Service SPIKE", type: "concept", note: "45 products, hybrid booth+fulfillment model, serious Y1 revenue target" },
      { name: "17 Vercel experiments", type: "lab", note: "skydda-ai-sentinel, vibe-coding-workshop, int-sysdesigngen, harmoniq, continuum, etc." },
    ],
    throughline: "Operator mode. High output, high surface area. Some experiments landed (store infrastructure), some didn't (several Vercel projects now orphaned).",
  },
  {
    id: "orchestrator",
    period: "Mar–Apr 2026",
    label: "Orchestrator AI",
    tag: "PLATFORM",
    color: "#10b981",
    accent: "#34d399",
    tagline: "Production-grade agent orchestration platform. Multi-tenant. SOC2-oriented.",
    summary: "Base44 app starting at 60 entities, audited and rebuilt to 101+ with multi-tenancy, audit trail, token budget, credential vault, cycle detection, and execution layer. 7 n8n maintenance workflows wired.",
    projects: [
      { name: "Orchestrator AI (Base44)", type: "platform", note: "App ID: 68dd8e79ca073475565c8e16 — canonical agent platform as of Apr 2026" },
      { name: "n8n WebhookBridge wiring", type: "infra", note: "7 maintenance workflows; 4 WIR + 7 OAI still pending Base44 Bearer creds + SCH-02 field" },
      { name: "Drive Automation Chain 1+2", type: "system", note: "Google Drive classification + routing pipeline, Supabase audit trail" },
      { name: "ascend-ai deal pipeline", type: "tool", note: "Firecrawl → Tavily → Claude Haiku → Supabase; production, running daily" },
    ],
    throughline: "This is the most architecturally mature thing you've shipped. The DB-ARCH skill, multi-tenant patterns, and audit trail thinking here reflect genuine platform engineering.",
  },
  {
    id: "chaosclub",
    period: "Apr 2026 – Present",
    label: "chaosclub.co",
    tag: "CREATIVE",
    color: "#ec4899",
    accent: "#f472b6",
    tagline: "Lyric/audio platform. Your aesthetic voice gets a product.",
    summary: "Versery-clone lyric/audio experience. 100+ original lyrics. 'Reading Room at Midnight' editorial dark aesthetic. Full arch spec: React 19 + Firebase + Cloudflare R2 + Gemini + Stripe.",
    projects: [
      { name: "chaosclub.co platform", type: "product", note: "Architecture complete; OAuth consent screen issues (legacy Google Cloud project) being resolved" },
      { name: "Reading Room at Midnight aesthetic", type: "design", note: "Dark editorial — your most fully-formed design identity yet" },
      { name: "Gemini AI integration", type: "feature", note: "Lyria 3 Pro/Clip for audio, Imagen 4 for visuals, Flash for mood tagging" },
      { name: "Stripe $4.99/mo premium", type: "biz", note: "Monetization model defined; implementation pending" },
    ],
    throughline: "chaosclub.co is where the memoir voice, the aesthetic sensibility, and the technical platform-building all converge. This one feels different.",
  },
];

const typeColors = {
  role: "#6b7280", framework: "#8b5cf6", mindset: "#0ea5e9", tool: "#0ea5e9",
  library: "#10b981", docs: "#f59e0b", system: "#ec4899", site: "#8b5cf6",
  content: "#6b7280", credential: "#f59e0b", creative: "#ec4899",
  product: "#0ea5e9", biz: "#f59e0b", infra: "#6b7280", store: "#f59e0b",
  concept: "#8b5cf6", lab: "#6b7280", platform: "#10b981", feature: "#0ea5e9",
  design: "#ec4899",
};

export default function ProjectEvolution() {
  const [active, setActive] = useState(null);

  const activePhase = phases.find((p) => p.id === active);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0a0a0f",
      color: "#e2e0dc",
      minHeight: "100vh",
      padding: "40px 32px",
      maxWidth: 900,
      margin: "0 auto",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#6b7280", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>
          KYLE ROSEBROOK · PROJECT EVOLUTION
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 400, color: "#f5f3ef", letterSpacing: "-0.02em" }}>
          How the focus has shifted
        </h1>
        <p style={{ margin: "12px 0 0", color: "#9ca3af", fontSize: 14, lineHeight: 1.6, maxWidth: 560, fontFamily: "sans-serif" }}>
          Seven phases across roughly two years. Click any phase to expand the details.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Spine */}
        <div style={{
          position: "absolute", left: 100, top: 0, bottom: 0,
          width: 1, background: "linear-gradient(to bottom, transparent, #2d2d3a 60px, #2d2d3a calc(100% - 60px), transparent)",
        }} />

        {phases.map((phase, i) => {
          const isActive = active === phase.id;
          return (
            <div key={phase.id} style={{ display: "flex", gap: 0, marginBottom: isActive ? 0 : 4, position: "relative" }}>
              {/* Period label */}
              <div style={{
                width: 95, flexShrink: 0, textAlign: "right", paddingRight: 16,
                paddingTop: 14, fontSize: 10, color: "#4b5563", lineHeight: 1.3,
                fontFamily: "monospace", letterSpacing: "0.05em",
              }}>
                {phase.period}
              </div>

              {/* Node */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: isActive ? phase.color : "#2d2d3a",
                border: `2px solid ${phase.color}`,
                marginTop: 17, zIndex: 1,
                transition: "background 0.2s",
                boxShadow: isActive ? `0 0 12px ${phase.color}66` : "none",
              }} />

              {/* Card */}
              <button
                onClick={() => setActive(isActive ? null : phase.id)}
                style={{
                  flex: 1, marginLeft: 16, background: isActive ? `${phase.color}0d` : "#12121a",
                  border: `1px solid ${isActive ? phase.color + "44" : "#1e1e2e"}`,
                  borderRadius: 8, padding: "14px 18px", cursor: "pointer",
                  color: "#e2e0dc", textAlign: "left", marginBottom: 6,
                  transition: "all 0.2s", fontFamily: "inherit",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 9, letterSpacing: "0.15em", fontFamily: "monospace",
                      background: `${phase.color}22`, color: phase.color,
                      padding: "2px 7px", borderRadius: 3, border: `1px solid ${phase.color}33`,
                    }}>
                      {phase.tag}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 400, color: isActive ? phase.accent : "#e2e0dc" }}>
                      {phase.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace" }}>
                    {isActive ? "▲" : "▼"}
                  </span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ca3af", lineHeight: 1.5, fontFamily: "sans-serif" }}>
                  {phase.tagline}
                </p>

                {/* Expanded content */}
                {isActive && (
                  <div style={{ marginTop: 20, borderTop: `1px solid ${phase.color}22`, paddingTop: 18 }}>
                    <p style={{ margin: "0 0 18px", fontSize: 13, color: "#c9c7c3", lineHeight: 1.7, fontFamily: "sans-serif" }}>
                      {phase.summary}
                    </p>

                    {/* Projects grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                      {phase.projects.map((proj) => (
                        <div key={proj.name} style={{
                          background: "#0a0a0f", border: "1px solid #1e1e2e",
                          borderRadius: 6, padding: "10px 12px",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{
                              width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                              background: typeColors[proj.type] || "#6b7280",
                            }} />
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#e2e0dc", fontFamily: "sans-serif" }}>
                              {proj.name}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: 11, color: "#6b7280", lineHeight: 1.5, fontFamily: "sans-serif", paddingLeft: 12 }}>
                            {proj.note}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Throughline */}
                    <div style={{
                      background: `${phase.color}0a`, border: `1px solid ${phase.color}22`,
                      borderRadius: 6, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start",
                    }}>
                      <span style={{ fontSize: 11, color: phase.color, fontFamily: "monospace", flexShrink: 0, marginTop: 1 }}>
                        THROUGHLINE
                      </span>
                      <p style={{ margin: 0, fontSize: 12, color: "#c9c7c3", lineHeight: 1.6, fontFamily: "sans-serif", fontStyle: "italic" }}>
                        {phase.throughline}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pattern analysis */}
      <div style={{
        marginTop: 48, padding: "24px 28px",
        background: "#0e0e18", border: "1px solid #1e1e2e", borderRadius: 10,
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#6b7280", textTransform: "uppercase", marginBottom: 14, fontFamily: "monospace" }}>
          PATTERN ANALYSIS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { label: "The recurring instinct", text: "Build the infrastructure before the product. Every project has a schema, a routing layer, or a skill system underneath it." },
            { label: "The creative tension", text: "Technical depth vs. aesthetic voice. Orchestrator AI and chaosclub.co are pulling in opposite directions — and that's probably healthy." },
            { label: "The throughline", text: "All of it starts with people — the bartender who read the room. That instinct for what lands shows up in copy, in UX, and in how you pitch." },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginBottom: 6, letterSpacing: "0.05em" }}>
                {item.label}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.7, fontFamily: "sans-serif" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 10, color: "#374151", fontFamily: "monospace", textAlign: "right" }}>
        sourced from chat history + memory · apr 2026
      </div>
    </div>
  );
}
