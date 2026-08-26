
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
    summary: "Hired at Intinc outside the normal CSR path — brought in for hybrid tech + people skills. Started self-initiating AI/automation work on top of L1 duties. First platform builds shipped.",
    projects: ["Flash-n-Frame (shelved later)", "AffordableStoreStuff multi-platform seller app"],
    themes: ["L1 Service Desk", "Self-initiated AI work", "First Base44 experiments", "People + tech fusion"],
    shift: "From hospitality instincts → applied to systems and tools",
  },
  {
    id: "tools",
    era: "Tooling & Skills",
    period: "Mid 2023 – 2024",
    label: "Building the Craft Layer",
    color: "#0f766e",
    accent: "#34d399",
    summary: "The work shifted from 'build products' to 'build infrastructure that builds products.' 330 Intinc skills, Claude skill ecosystem, audit systems, smart triage. Institutional-grade work, self-initiated.",
    projects: [
      "INT Smart Triage AI tool",
      "GitHub repo audit system",
      "330-skill Intinc build (phases 1–5, validated)",
      "Claude skill ecosystem (gerund-naming, WSJF queue)",
      "Prompt frameworks (R-I-S-E, F-L-O-W, R-O-S-E)",
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
    summary: "Focus broadened to personal brand, commerce, and public-facing work. kylerosebrook.com redesigned. FlashFusion Wix store live with 20 products. Newsletter 'The Prompt' launched. INT business case drafted ($300K–$500K Y1).",
    projects: [
      "kylerosebrook.com redesign (dark palette, WCAG AA)",
      "FlashFusion Wix store (20 products, 10 collections)",
      "INT Customization Service SPIKE POC",
      "The Prompt newsletter",
      "Claude Ambassador / Architect applications",
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
    summary: "Stack consolidated around agent orchestration. Orchestrator AI / Fusion AI platform on Base44 with 101 entities, multi-tenant schema, audit trail, token budget tracking. n8n wired via WebhookBridge. Memoir project surfaces publicly.",
    projects: [
      "Orchestrator AI / Fusion AI platform (Base44, 101 entities)",
      "69+ agent definitions (personal, universal, MCP, platform)",
      "n8n WebhookBridge wiring (WIR + OAI workflows)",
      "Memoir pitch to Business Insider",
      "chaosclub.co concept (lyric/audio platform, domain acquired)",
    ],
    themes: ["Multi-agent orchestration", "Multi-tenant arch", "Audit trails", "Token budgets", "Memoir as narrative anchor"],
    shift: "From platforms → orchestrated intelligence + personal narrative",
  },
  {
    id: "hardening",
    era: "Production Hardening",
    period: "Late 2025 – Apr 2026",
    label: "Ship & Stabilize",
    color: "#065f46",
    accent: "#6ee7b7",
    summary: "Consolidation across the whole stack. Skill audit killed 19 dead skills, WSJF repair queue produced. FlashFusion 3 blockers resolved + deployment guides written. chaosclub.co architecture finalized. Memory and identity audited and corrected.",
    projects: [
      "Skill library audit (30 survivors, S-Tier mapped, WSJF queue)",
      "FlashFusion Wix 3 blocker fixes + deployment guides",
      "Intinc Deployment Kit (deploy-ready)",
      "chaosclub.co full arch spec (React 19 + Firebase + Cloudflare R2 + Gemini + Stripe)",
      "Memory audit: corrected tool count, role framing, contradictions",
    ],
    themes: ["Quality gates", "Production readiness", "Institutional cleanup", "Identity accuracy", "chaosclub as flagship"],
    shift: "From building → stabilizing, shipping, and clarifying what you're actually building",
  },
];

export default function ProjectEvolution() {
  const [active, setActive] = useState("hardening");
  const phase = phases.find((p) => p.id === active);
  const activeIdx = phases.findIndex((p) => p.id === active);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#e5e7eb", padding: "24px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Project Focus Evolution</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f9fafb" }}>Kyle Rosebrook · Pre-Tech → Apr 2026</h1>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Reconstructed from memory + conversation history · {phases.length} phases</div>
        </div>

        {/* Timeline pills */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 24 }}>
          {phases.map((p) => (
            <button key={p.id} onClick={() => setActive(p.id)} style={{
              padding: "5px 12px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
              border: `1.5px solid ${active === p.id ? p.accent : "#2d2d2d"}`,
              background: active === p.id ? p.color + "30" : "transparent",
              color: active === p.id ? p.accent : "#6b7280",
              fontSize: 11, fontWeight: active === p.id ? 700 : 400,
            }}>
              {p.period}
            </button>
          ))}
        </div>

        {/* Active card */}
        {phase && (
          <div style={{
            borderRadius: 12,
            border: `1.5px solid ${phase.color}44`,
            background: `${phase.color}12`,
            padding: 24, marginBottom: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: phase.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>{phase.era} · {phase.period}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb" }}>{phase.label}</div>
              </div>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {phases.map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= activeIdx ? phase.accent : "#2d2d2d", transition: "background 0.2s" }} />
                ))}
              </div>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.75, color: "#d1d5db", margin: "0 0 16px 0" }}>{phase.summary}</p>

            {phase.shift && (
              <div style={{ fontSize: 12, color: phase.accent, borderLeft: `2px solid ${phase.accent}`, paddingLeft: 12, marginBottom: 16, fontStyle: "italic", lineHeight: 1.6 }}>
                {phase.shift}
              </div>
            )}

            {phase.projects.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Key Deliverables</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {phase.projects.map((proj, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "#e5e7eb" }}>
                      <span style={{ color: phase.accent, flexShrink: 0, marginTop: 1 }}>▸</span>
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>Themes</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {phase.themes.map((t, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: phase.color + "30", color: phase.accent, border: `1px solid ${phase.color}44` }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Condensed list */}
        <div>
          <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Full Arc</div>
          {phases.map((p, i) => (
            <div key={p.id} onClick={() => setActive(p.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 8, cursor: "pointer",
              background: active === p.id ? p.color + "20" : "transparent",
              border: `1px solid ${active === p.id ? p.color + "44" : "transparent"}`,
              marginBottom: 2,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: "#6b7280", width: 120, flexShrink: 0 }}>{p.period}</div>
              <div style={{ fontSize: 13, color: active === p.id ? "#f9fafb" : "#9ca3af", fontWeight: active === p.id ? 600 : 400 }}>{p.label}</div>
              {i < phases.length - 1 && <div style={{ marginLeft: "auto", fontSize: 10, color: "#374151" }}>↓</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: "#374151", textAlign: "center", marginTop: 20 }}>
          [GENERATED] · memory + conversation history · May 2026
        </div>
      </div>
    </div>
  );
}
