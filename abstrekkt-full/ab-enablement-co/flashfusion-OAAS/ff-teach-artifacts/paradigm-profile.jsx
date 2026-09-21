import { useState } from "react";

const paradigms = [
  {
    id: "event-driven",
    name: "Event-Driven / Reactive",
    fit: 95,
    color: "#00C9A7",
    icon: "⚡",
    summary: "When X happens → do Y. Your brain's native language.",
    evidence: [
      "n8n workflows with webhook triggers and conditional branching",
      "Zapier/Make chains reacting to form submissions, payments, deploys",
      "Intinc Deployment Kit auto-advancing through 6 phases on events",
      "Supabase Auth event hooks, Stripe webhook handlers",
    ],
    languages: ["JavaScript (async/await, event listeners)", "n8n / Zapier / Make (visual)", "Node.js event emitters"],
    learnNext: "RxJS or event-driven microservices — you already think this way, just formalize it.",
    desc: "You don't start with 'what is the data structure?' — you start with 'what triggers this?' That's event-driven thinking. Most automation-first engineers land here naturally because the entire no-code world is built on this paradigm."
  },
  {
    id: "declarative",
    name: "Declarative / Config-Driven",
    fit: 88,
    color: "#6C63FF",
    icon: "📋",
    summary: "Describe WHAT you want, not HOW to do it.",
    evidence: [
      "Notion databases as config layers for the Deployment Kit",
      "YAML/JSON configs for MCP servers, skill definitions, CI pipelines",
      "Cloudflare, Vercel, and Supabase declarative infrastructure",
      "Prompt engineering — literally declaring desired outcomes",
    ],
    languages: ["SQL", "YAML / JSON configs", "React JSX", "Terraform / IaC"],
    learnNext: "Terraform or Pulumi — your infra-as-code instincts are already strong.",
    desc: "You configure systems more than you code them. Your stack choices (Vercel, Supabase, Cloudflare) are all declarative-first platforms. You tell the system what you want and it figures out how."
  },
  {
    id: "pipeline",
    name: "Pipeline / Data Flow",
    fit: 82,
    color: "#FF6B6B",
    icon: "🔄",
    summary: "Input → Transform → Transform → Output. Assembly line thinking.",
    evidence: [
      "spec → arch → code gen → test → deploy → monitor → iterate workflow",
      "n8n multi-step orchestrations with data passing between nodes",
      "Knowledge extraction system: export → parse → organize → artifact",
      "FlashFusion waitlist: signup → magic link → Stripe → PostHog → Redis",
    ],
    languages: ["Unix pipes (bash)", "n8n / Make data transforms", "JavaScript .map().filter().reduce()"],
    learnNext: "Functional programming basics — pipe(), compose(), and array methods will click instantly.",
    desc: "Your mental model is a conveyor belt. Data enters, gets shaped at each station, and exits as something useful. This is why your n8n workflows are so clean — you naturally think in stages."
  },
  {
    id: "procedural",
    name: "Procedural / Sequential",
    fit: 65,
    color: "#FFA726",
    icon: "📝",
    summary: "Step 1, Step 2, Step 3. The notebook approach.",
    evidence: [
      "Physical notebook practice for snippets and cheat sheets",
      "6-phase deployment process with ordered gates",
      "Runbooks, SOPs, and KB articles — all sequential by nature",
    ],
    languages: ["Python scripts", "Bash scripts", "Java (your current study)"],
    learnNext: "This is where Java training will strengthen you — but don't force everything into this mold.",
    desc: "You use this paradigm for documentation and process definition, but it's not your primary coding instinct. Your brain wants to jump to triggers and flows, not step-by-step sequences. That's okay — procedural is a tool, not an identity."
  },
  {
    id: "oop",
    name: "Object-Oriented (OOP)",
    fit: 45,
    color: "#78909C",
    icon: "🧱",
    summary: "Model the world as interacting objects with state and behavior.",
    evidence: [
      "Java training is introducing you to this formally",
      "You use object-like structures in configs and data models",
      "Supabase tables with RLS = objects with access control",
    ],
    languages: ["Java (learning)", "TypeScript classes", "Python classes"],
    learnNext: "Focus on composition over inheritance. Your instinct to compose small tools is already better than deep class hierarchies.",
    desc: "This is what CS programs teach first, but it's actually not how most modern systems work — especially in the automation/platform space you operate in. Learn it for literacy, but don't let it override your natural event-driven instincts."
  },
];

const FitBar = ({ value, color, animate }) => (
  <div style={{
    width: "100%",
    height: 8,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    overflow: "hidden",
    position: "relative",
  }}>
    <div style={{
      width: animate ? `${value}%` : "0%",
      height: "100%",
      background: `linear-gradient(90deg, ${color}, ${color}88)`,
      borderRadius: 99,
      transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow: `0 0 12px ${color}44`,
    }} />
  </div>
);

const Badge = ({ children, color }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}30`,
    margin: "2px 3px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  }}>{children}</span>
);

export default function ParadigmProfile() {
  const [selected, setSelected] = useState(null);
  const [animated, setAnimated] = useState(false);

  useState(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  });

  const active = selected !== null ? paradigms[selected] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0E14",
      color: "#E8ECF1",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "32px 20px",
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            color: "#00C9A7",
            textTransform: "uppercase",
            marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
          }}>PARADIGM FIT PROFILE</div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #E8ECF1, #00C9A7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>You're a Systems Orchestrator</h1>
          <p style={{
            fontSize: 15,
            color: "#8B95A5",
            marginTop: 10,
            lineHeight: 1.6,
            maxWidth: 600,
          }}>
            Your thinking style maps to <strong style={{ color: "#00C9A7" }}>event-driven</strong> and{" "}
            <strong style={{ color: "#6C63FF" }}>declarative</strong> paradigms — not the OOP-first
            path CS programs teach. That's not a gap. It's an advantage in modern platform engineering.
          </p>
        </div>

        {/* Paradigm Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {paradigms.map((p, i) => {
            const isActive = selected === i;
            return (
              <div
                key={p.id}
                onClick={() => setSelected(isActive ? null : i)}
                style={{
                  background: isActive ? `${p.color}08` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? p.color + "40" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12,
                  padding: isActive ? "20px 22px" : "16px 22px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Row: icon + name + fit bar + percentage */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 6,
                    }}>
                      <span style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: isActive ? p.color : "#E8ECF1",
                        transition: "color 0.3s",
                      }}>{p.name}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        fontWeight: 700,
                        color: p.color,
                      }}>{p.fit}%</span>
                    </div>
                    <FitBar value={p.fit} color={p.color} animate={animated} />
                  </div>
                </div>

                {/* Summary always visible */}
                <div style={{
                  fontSize: 13,
                  color: "#8B95A5",
                  marginTop: 8,
                  marginLeft: 36,
                }}>{p.summary}</div>

                {/* Expanded detail */}
                {isActive && (
                  <div style={{
                    marginTop: 18,
                    marginLeft: 36,
                    animation: "fadeSlide 0.3s ease",
                  }}>
                    <p style={{
                      fontSize: 14,
                      color: "#C0C7D2",
                      lineHeight: 1.65,
                      margin: "0 0 16px 0",
                    }}>{p.desc}</p>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}>Evidence from your stack</div>
                      {p.evidence.map((e, j) => (
                        <div key={j} style={{
                          fontSize: 13,
                          color: "#A0A9B8",
                          padding: "5px 0",
                          borderBottom: j < p.evidence.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          display: "flex",
                          gap: 8,
                        }}>
                          <span style={{ color: p.color, flexShrink: 0 }}>→</span>
                          {e}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}>Languages & tools that match</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                        {p.languages.map((l, j) => (
                          <Badge key={j} color={p.color}>{l}</Badge>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      background: `${p.color}10`,
                      border: `1px solid ${p.color}25`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      fontSize: 13,
                      color: "#C0C7D2",
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ color: p.color }}>Next step:</strong> {p.learnNext}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom insight */}
        <div style={{
          marginTop: 28,
          padding: "20px 22px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            color: "#FFA726",
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: "'JetBrains Mono', monospace",
          }}>KEY INSIGHT FOR YOUR JAVA STUDY</div>
          <p style={{
            fontSize: 14,
            color: "#C0C7D2",
            lineHeight: 1.65,
            margin: 0,
          }}>
            Java will teach you OOP, and that's valuable for literacy and enterprise codebases. But don't let it
            convince you that everything needs to be a class hierarchy. Your natural instinct — <em>compose small,
            trigger-based units into larger workflows</em> — is exactly how modern cloud-native and platform
            engineering works. Learn Java's patterns, then translate them back through your event-driven lens.
            That combination is what makes a Staff Engineer dangerous (in the best way).
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
