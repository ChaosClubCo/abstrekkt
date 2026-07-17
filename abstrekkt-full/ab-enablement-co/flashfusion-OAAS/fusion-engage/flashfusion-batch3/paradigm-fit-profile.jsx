import { useState } from "react";

const paradigms = [
  {
    name: "Functional / Pipeline",
    fit: 95,
    color: "#00e5a0",
    icon: "⟶",
    verdict: "YOUR NATIVE LANGUAGE",
    description:
      "Data flows through a chain of transformations. No hidden state, no surprises. What you see is what you get.",
    yourStyle: [
      "Your n8n workflows ARE functional pipelines — each node transforms data and passes it forward",
      "spec → arch → code → deploy → monitor → iterate is a pure pipeline",
      "The Intinc Deployment Kit's 6 auto-advancing phases = function composition in disguise",
    ],
    languages: ["JavaScript (map/filter/reduce)", "Python", "Elixir", "Clojure"],
    tryThis:
      "In your next JS project, try chaining .map().filter().reduce() instead of for-loops. You'll feel instantly at home.",
    codeExample: `// This IS how you already think:
const deploy = pipe(
  validateConfig,
  buildAssets,
  runTests,
  pushToVercel,
  notifySlack
);

// n8n node chain = same concept:
// Webhook → Transform → Filter → Supabase → Resend`,
  },
  {
    name: "Reactive / Event-Driven",
    fit: 82,
    color: "#ffa726",
    icon: "⚡",
    verdict: "STRONG SECONDARY FIT",
    description:
      "Systems respond to events and state changes. When X happens, trigger Y. Perfect for real-time, async workflows.",
    yourStyle: [
      "n8n webhooks, Supabase realtime, and PostHog event tracking = reactive patterns",
      "Your 'when X happens, do Y' trigger thinking maps directly here",
      "Stripe webhooks → fulfillment flows in the Customization Service POC",
    ],
    languages: ["JavaScript (async/await, Promises)", "RxJS", "Node.js event emitters"],
    tryThis:
      "Supabase Realtime subscriptions are pure reactive programming. You're already doing this.",
    codeExample: `// Your Stripe webhook flow:
supabase
  .channel('orders')
  .on('INSERT', (payload) => {
    processOrder(payload.new)
      .then(generateLabel)
      .then(notifyCustomer)
  })
  .subscribe();`,
  },
  {
    name: "Imperative / Procedural",
    fit: 60,
    color: "#42a5f5",
    icon: "▶",
    verdict: "FAMILIAR BUT NOT NATIVE",
    description:
      "Step-by-step instructions telling the computer exactly what to do. The 'recipe' approach.",
    yourStyle: [
      "Your bartending/hospitality background trained you in procedures and SOPs",
      "Java training is teaching you this paradigm right now",
      "MDT imaging workflows and deployment checklists are procedural thinking",
    ],
    languages: ["Java", "C", "Python (procedural style)", "Bash scripts"],
    tryThis:
      "You naturally reach for this when writing Bash scripts and deployment steps. It works — but you'll notice you often want to refactor into pipelines.",
    codeExample: `// How Java wants you to think:
List<String> results = new ArrayList<>();
for (Config config : configs) {
  if (config.isValid()) {
    String result = process(config);
    results.add(result);
  }
}
// vs how YOU want to think:
// configs.stream().filter(Config::isValid)
//   .map(this::process).collect(toList())`,
  },
  {
    name: "Object-Oriented (OOP)",
    fit: 45,
    color: "#ab47bc",
    icon: "◆",
    verdict: "USEFUL TOOL, NOT YOUR WIRING",
    description:
      "Model the world as objects with state and behavior. Nouns become classes, verbs become methods.",
    yourStyle: [
      "Java training is immersing you in OOP right now — inheritance, polymorphism, encapsulation",
      "Your frustration with 'too many layers' = the classic OOP abstraction pain point",
      "You use objects for data modeling (Supabase schemas) but don't naturally think in class hierarchies",
    ],
    languages: ["Java", "C#", "TypeScript (class-heavy)", "Python (class-based)"],
    tryThis:
      "Use OOP for data modeling and API structure, but don't force everything into classes. Your instinct to keep it flat is correct.",
    codeExample: `// OOP wants you to build this:
class DeploymentPhase extends Phase {
  constructor(config) {
    super(config);
    this.validator = new ConfigValidator();
  }
  execute() { /* 4 layers deep... */ }
}

// You'd rather just:
const executePhase = (config) =>
  validate(config) |> build |> test |> deploy`,
  },
  {
    name: "Declarative / Config-Driven",
    fit: 78,
    color: "#ec407a",
    icon: "☰",
    verdict: "STEALTH STRENGTH",
    description:
      "Describe WHAT you want, not HOW to do it. The system figures out the implementation.",
    yourStyle: [
      "Notion databases, Supabase RLS policies, Vercel config = declarative thinking",
      "Your YAML/JSON config approach to the Deployment Kit is declarative architecture",
      "SQL queries describe results, not procedures — and you lean into this naturally",
    ],
    languages: ["SQL", "HTML/CSS", "Terraform", "YAML configs", "React JSX"],
    tryThis:
      "Next time you reach for imperative code, ask: 'Can I describe the desired state instead?' Your RLS policies already do this.",
    codeExample: `// You already write declarative code:
// Supabase RLS Policy
CREATE POLICY "org_access" ON documents
  USING (org_id = auth.jwt()->>'org_id');

// Vercel config
{ "rewrites": [
  { "source": "/api/:path*",
    "destination": "/api/:path*" }
]}`,
  },
];

const insights = [
  {
    title: "Why Java Feels Heavy",
    body: "Your Java training is teaching OOP + imperative style — the two paradigms that score lowest for your wiring. This isn't a weakness. Understanding paradigms that DON'T match your thinking makes you a more versatile engineer. The key: use Java's Stream API and functional interfaces to bring pipeline thinking into Java.",
    icon: "☕",
  },
  {
    title: "Your Secret Advantage",
    body: "Most self-taught devs learn one paradigm and get stuck. Your n8n/Zapier background gave you functional and reactive intuitions BEFORE you had the vocabulary for them. Now that you're formalizing your CS knowledge, you can name and sharpen what you already do instinctively.",
    icon: "🔑",
  },
  {
    title: "Staff Engineer Implication",
    body: "Pipeline/functional thinkers excel at system design and data architecture — exactly where Staff Engineers spend their time. Your instinct to 'map the data flow first' is the #1 skill for designing scalable systems at Intinc and beyond.",
    icon: "📐",
  },
];

export default function ParadigmProfile() {
  const [selected, setSelected] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [tab, setTab] = useState("paradigms");
  const p = paradigms[selected];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e8e6e3",
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
        padding: "0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "32px 32px 0",
          borderBottom: "1px solid #1a1a2e",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#00e5a0",
              fontWeight: 600,
            }}
          >
            Paradigm Fit Profile
          </span>
          <span style={{ fontSize: "11px", color: "#555" }}>v1.0</span>
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 300,
            fontFamily: "'Georgia', serif",
            margin: "8px 0 20px",
            color: "#fff",
            letterSpacing: "-0.5px",
          }}
        >
          How Your Brain Writes Code
        </h1>

        {/* Tab Nav */}
        <div style={{ display: "flex", gap: "0" }}>
          {["paradigms", "insights"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 24px",
                background: tab === t ? "#1a1a2e" : "transparent",
                border: "1px solid #1a1a2e",
                borderBottom: tab === t ? "1px solid #1a1a2e" : "1px solid #1a1a2e",
                borderRadius: "8px 8px 0 0",
                color: tab === t ? "#fff" : "#666",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: "-1px",
                transition: "all 0.2s",
              }}
            >
              {t === "paradigms" ? "Paradigm Map" : "Key Insights"}
            </button>
          ))}
        </div>
      </div>

      {tab === "paradigms" ? (
        <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
          {/* Left: Paradigm List */}
          <div
            style={{
              width: "280px",
              minWidth: "280px",
              borderRight: "1px solid #1a1a2e",
              padding: "16px 0",
              background: "#0d0d14",
            }}
          >
            {paradigms.map((item, i) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelected(i);
                  setShowCode(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "14px 20px",
                  background: selected === i ? "#1a1a2e" : "transparent",
                  border: "none",
                  borderLeft: selected === i ? `3px solid ${item.color}` : "3px solid transparent",
                  color: selected === i ? "#fff" : "#888",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  textAlign: "left",
                  transition: "all 0.15s",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "18px", opacity: 0.8 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: selected === i ? 600 : 400 }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "4px",
                        background: "#1a1a2e",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.fit}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: "2px",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "11px", color: item.color, fontWeight: 700 }}>
                      {item.fit}%
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detail Panel */}
          <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
            {/* Verdict Badge */}
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: `${p.color}18`,
                border: `1px solid ${p.color}40`,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                color: p.color,
                marginBottom: "16px",
              }}
            >
              {p.verdict}
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: 300, fontFamily: "'Georgia', serif", color: "#fff", margin: "0 0 8px" }}>
              {p.icon} {p.name}
            </h2>
            <p style={{ color: "#999", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "560px" }}>
              {p.description}
            </p>

            {/* How You Already Use This */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#666",
                  marginBottom: "14px",
                  fontWeight: 600,
                }}
              >
                How You Already Use This
              </h3>
              {p.yourStyle.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: "#ccc",
                  }}
                >
                  <span style={{ color: p.color, flexShrink: 0 }}>›</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Code Toggle */}
            <button
              onClick={() => setShowCode(!showCode)}
              style={{
                padding: "8px 18px",
                background: showCode ? "#1a1a2e" : "transparent",
                border: `1px solid ${p.color}50`,
                borderRadius: "6px",
                color: p.color,
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: "20px",
                transition: "all 0.2s",
              }}
            >
              {showCode ? "Hide" : "Show"} Code Example
            </button>

            {showCode && (
              <pre
                style={{
                  background: "#111118",
                  border: "1px solid #1a1a2e",
                  borderRadius: "8px",
                  padding: "20px",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  color: "#b8b5b0",
                  overflow: "auto",
                  marginBottom: "24px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {p.codeExample}
              </pre>
            )}

            {/* Languages */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#666", marginBottom: "10px", fontWeight: 600 }}>
                Languages That Fit
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {p.languages.map((l) => (
                  <span
                    key={l}
                    style={{
                      padding: "5px 12px",
                      background: "#1a1a2e",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Item */}
            <div
              style={{
                background: `${p.color}08`,
                border: `1px solid ${p.color}25`,
                borderRadius: "8px",
                padding: "16px 20px",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#ccc",
              }}
            >
              <strong style={{ color: p.color }}>Try This →</strong> {p.tryThis}
            </div>
          </div>
        </div>
      ) : (
        /* Insights Tab */
        <div style={{ padding: "32px", maxWidth: "680px" }}>
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                background: "#111118",
                border: "1px solid #1a1a2e",
                borderRadius: "10px",
                padding: "24px 28px",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>{ins.icon}</span>
                <h3 style={{ fontSize: "16px", fontWeight: 500, color: "#fff", margin: 0, fontFamily: "'Georgia', serif" }}>
                  {ins.title}
                </h3>
              </div>
              <p style={{ color: "#aaa", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{ins.body}</p>
            </div>
          ))}

          {/* Summary Card */}
          <div
            style={{
              marginTop: "28px",
              background: "linear-gradient(135deg, #00e5a015, #0a0a0f)",
              border: "1px solid #00e5a030",
              borderRadius: "10px",
              padding: "24px 28px",
            }}
          >
            <h3 style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#00e5a0", marginBottom: "12px", fontWeight: 600 }}>
              Your Paradigm Stack
            </h3>
            <p style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#fff" }}>Primary:</strong> Functional / Pipeline — your default mode.{" "}
              <strong style={{ color: "#fff" }}>Secondary:</strong> Reactive + Declarative — your force multipliers.{" "}
              <strong style={{ color: "#fff" }}>Growth edge:</strong> OOP via Java — builds versatility without replacing your core wiring.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
