import { useState } from "react";

const phases = [
  {
    id: "roots",
    era: "Pre-Tech",
    period: "Before 2022",
    label: "The Foundation",
    color: "#7c3aed",
    accent: "#a78bfa",
    summary: "Hospitality, bartending, crisis management, people skills. Also: music, ghost-writing, poetry. Not engineering — but pattern recognition, reading the room, serving exactly what's needed. You were doing 'context engineering' before you had words for it.",
    projects: [],
    themes: ["Hospitality mgmt", "Bartending", "Ghost-writing", "Crisis mgmt", "Music / poetry"],
    shift: null,
  },
  {
    id: "entry",
    era: "Tech Entry",
    period: "2022 – Early 2023",
    label: "Bridging the Gap",
    color: "#1d4ed8",
    accent: "#60a5fa",
    summary: "Hired at Intinc outside the normal CSR path — brought in specifically because of hybrid tech + people skills. Started self-initiating AI/automation work on top of L1 duties. First platform builds shipped.",
    projects: ["Flash-n-Frame (shelved later)", "AffordableStoreStuff multi-platform seller app"],
    themes: ["L1 Service Desk", "Self-initiated AI work", "First Base44 experiments", "People skills + tech fusion"],
    shift: "From hospitality instincts → applied to systems and tools",
  },
  {
    id: "tools",
    era: "Tooling & Skills Era",
    period: "Mid 2023 – 2024",
    label: "Building the Craft Layer",
    color: "#0f766e",
    accent: "#34d399",
    summary: "The work shifted from 'build products' to 'build the infrastructure that builds products.' 330 Intinc skills, Claude skill ecosystem, audit systems, smart triage. You were creating reusable, institutional-grade work on your own initiative.",
    projects: [
      "INT Smart Triage AI tool",
      "GitHub repo audit system",
      "330-skill Intinc build (phases 1–5, 100% validated)",
      "Claude skill ecosystem (gerund-naming, WSJF queue)",
      "Prompt engineering frameworks (R-I-S-E, F-L-O-W, R-O-S-E)",
    ],
    themes: ["Institutional AI tooling", "Skill architecture", "Security-first patterns", "AppSec / OWASP lens"],
    shift: "From individual builds → reusable systems and frameworks",
  },
  {
    id: "brand",
    era: "Brand & Platform",
    period: "Late 2024 – Early 2025",
    label: "Identity + Commerce",
    color: "#b45309",
    accent: "#fbbf24",
    summary: "Focus broadened to personal brand, commerce, and public-facing work. kylerosebrook.com redesigned with full accessibility (WCAG AA). FlashFusion Wix store live with 20 products. The newsletter 'The Prompt' launched. A business case for INT ($300K–$500K Y1 target) drafted.",
    projects: [
      "kylerosebrook.com redesign (Assembler theme, dark palette, accessibility)",
      "FlashFusion Wix store (20 products, 10 collections, persona coupons)",
      "INT Customization Service SPIKE POC",
      "The Prompt newsletter",
      "Claude Design blog post + Ambassador / Architect applications",
    ],
    themes: ["Personal brand", "Commerce", "Newsletter / content", "Accessibility (WCAG AA)", "MSP positioning"],
    shift: "From internal tools → public identity and revenue surface",
  },
  {
    id: "agents",
    era: "Agent Platform Era",
    period: "Mid 2025",
    label: "Going Agentic",
    color: "#be123c",
    accent: "#fb7185",
    summary: "The stack consolidated around agent orchestration. Orchestrator AI / Fusion AI agent platform stood up on Base44 with 101 entities, multi-tenant schema, audit trail, token budget tracking. n8n wired to Base44 via WebhookBridge. Memoir project surfaces publicly (Business Insider pitch).",
    projects: [
      "Orchestrator AI / Fusion AI platform (Base44, app ID 68dd8e79ca073475565c8e16)",
      "69+ agent definitions (personal, universal, MCP-based, platform specialists)",
      "n8n WebhookBridge wiring (WIR + OAI workflows)",
      "Memoir pitch to Business Insider",
      "ChaosClub.co concept (gaming / lyric platform, domain acquired)",
    ],
    themes: ["Multi-agent orchestration", "Multi-tenant architecture", "Audit trails", "Token budget tracking", "Memoir as narrative anchor"],
    shift: "From platforms → orchestrated intelligence + personal narrative",
  },
  {
    id: "hardening",
    era: "Production Hardening",
    period: "Late 2025 – Apr 2026",
    label: "Ship & Stabilize",
    color: "#065f46",
    accent: "#6ee7b7",
    summary: "Consolidation and cleanup across the whole stack. Skill audit killed 19 dead skills, produced WSJF repair queue. 11 YAML mismatches mapped. FlashFusion 3 blockers resolved + deployment guides written. Intinc Deployment Kit ready. chaosclub.co architecture finalized (React 19 + Firebase + Cloudflare R2 + Gemini + Stripe). Memory system audited and corrected.",
    projects: [
      "Skill library audit (30 survivors, S-Tier mapped, WSJF queue)",
      "FlashFusion Wix 3 blocker fixes + deployment guides",
      "Intinc Deployment Kit (ready to deploy)",
      "chaosclub.co full arch spec (React 19 + Vite + Firebase + Cloudflare R2 + Gemini + Stripe)",
      "Memory audit: corrected tool count, role framing, contradictions",
      "Troubleshooting Claude Desktop / Cowork (RPC errors, disk-full)",
    ],
    themes: ["Quality gates", "Production readiness", "Institutional cleanup", "Identity accuracy", "chaosclub as flagship"],
    shift: "From building → stabilizing, shipping, and clarifying what you're actually building",
  },
];

const DOTS = "●●●●●";

export default function ProjectEvolution() {
  const [active, setActive] = useState("hardening");
  const phase = phases.find((p) => p.id === active);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#e5e7eb", padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>Project Focus Evolution</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#f9fafb" }}>Kyle Rosebrook · Pre-Tech → Apr 2026</h1>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 6 }}>
            Reconstructed from memory + conversation history · {phases.length} phases
          </div>
        </div>

        {/* Timeline nav */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${active === p.id ? p.accent : "#374151"}`,
                background: active === p.id ? p.color + "22" : "transparent",
                color: active === p.id ? p.accent : "#9ca3af",
                fontSize: 12,
                fontWeight: active === p.id ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p.period}
            </button>
          ))}
        </div>

        {/* Active phase card */}
        {phase && (
          <div style={{
            borderRadius: 12,
            border: `1.5px solid ${phase.color}55`,
            background: `linear-gradient(135deg, ${phase.color}18 0%, #111827 100%)`,
            padding: 28,
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: phase.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{phase.era} · {phase.period}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb" }}>{phase.label}</div>
              </div>
              <div style={{ fontSize: 22 }}>
                {[...DOTS].map((d, i) => (
                  <span key={i} style={{ color: i < Math.round((phases.findIndex(p => p.id === active) + 1) / phases.length * 5) ? phase.accent : "#374151" }}>{d}</span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d5db", margin: "0 0 20px 0" }}>{phase.summary}</p>

            {phase.shift && (
              <div style={{ fontSize: 13, color: phase.accent, borderLeft: `2px solid ${phase.accent}`, paddingLeft: 12, marginBottom: 20, fontStyle: "italic" }}>
                {phase.shift}
              </div>
            )}

            {phase.projects.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Key Projects / Deliverables</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phase.projects.map((proj, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#e5e7eb" }}>
                      <span style={{ color: phase.accent, marginTop: 2, flexShrink: 0 }}>▸</span>
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Themes</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {phase.themes.map((t, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: "3px 10px", borderRadius: 20,
                    background: phase.color + "33", color: phase.accent, border: `1px solid ${phase.color}55`
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All-phases condensed overview */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Full Arc at a Glance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {phases.map((p, i) => (
              <div
                key={p.id}
                onClick={() => setActive(p.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 8, cursor: "pointer",
                  background: active === p.id ? p.color + "22" : "transparent",
                  border: `1px solid ${active === p.id ? p.color + "55" : "transparent"}`,
                  transition: "background 0.1s",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#9ca3af", width: 130, flexShrink: 0 }}>{p.period}</div>
                <div style={{ fontSize: 13, color: active === p.id ? "#f9fafb" : "#d1d5db", fontWeight: active === p.id ? 600 : 400 }}>{p.label}</div>
                {i < phases.length - 1 && (
                  <div style={{ marginLeft: "auto", fontSize: 11, color: "#4b5563" }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#4b5563", textAlign: "center", marginTop: 24 }}>
          [GENERATED] from userMemories + conversation search · Apr 24, 2026
        </div>
      </div>
    </div>
  );
}
