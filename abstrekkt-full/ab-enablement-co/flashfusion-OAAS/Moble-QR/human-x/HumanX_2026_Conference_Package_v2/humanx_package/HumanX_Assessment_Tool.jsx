import { useState, useEffect, useRef } from "react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#080b10",
  s1: "#0f1318",
  s2: "#161b23",
  s3: "#1d2530",
  border: "#252d3a",
  border2: "#2d3748",
  tx: "#e2e8f0",
  tx2: "#8892a4",
  tx3: "#5a6478",
  teal: "#2dd4bf",
  tealDim: "rgba(45,212,191,0.12)",
  tealGlow: "rgba(45,212,191,0.06)",
  or: "#f27a1a",
  orDim: "rgba(242,122,26,0.12)",
  green: "#34d399",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#a78bfa",
};

// ─── Vendor data ──────────────────────────────────────────────────────────────
const VENDORS = [
  { id: "snowflake", name: "Snowflake", focus: "Multi-tenant governance + Iceberg/Parquet" },
  { id: "cockroachdb", name: "CockroachDB", focus: "Distributed SQL with tenant isolation" },
  { id: "planetscale", name: "PlanetScale", focus: "Serverless MySQL + branching patterns" },
  { id: "aws", name: "AWS Native", focus: "RLS + IAM + Private Link + CMK" },
  { id: "azure", name: "Azure", focus: "Confidential computing + VNet isolation" },
  { id: "gcp", name: "Google Cloud", focus: "Confidential VMs + BQ encryption + VPC-SC" },
  { id: "rubrik", name: "Rubrik", focus: "Data security + backup-to-AI activation" },
  { id: "ontrust", name: "OneTrust", focus: "Privacy + compliance automation" },
  { id: "skyflow", name: "Skyflow", focus: "PII vault + tokenization ($195K/yr)" },
];

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "tenants",
    q: "How many client tenants do you manage?",
    opts: ["1–10", "11–50", "51–100", "100+"],
    icon: "🏢",
  },
  {
    id: "compliance",
    q: "Which compliance frameworks apply?",
    opts: ["HIPAA", "SOC 2", "CMMC", "PCI-DSS", "GDPR", "None yet"],
    multi: true,
    icon: "🔒",
  },
  {
    id: "isolation",
    q: "What's your current data isolation pattern?",
    opts: [
      "Shared DB (RLS)",
      "Schema per tenant",
      "DB per tenant",
      "Dedicated infra",
      "No formal isolation",
      "Not sure",
    ],
    icon: "🗄️",
  },
  {
    id: "aiStatus",
    q: "Are you running AI workloads on client data today?",
    opts: ["Yes, in production", "Piloting / testing", "Planning to", "Not yet"],
    icon: "🤖",
  },
  {
    id: "cloud",
    q: "What's your primary cloud platform?",
    opts: ["AWS", "Azure", "Google Cloud", "Multi-cloud", "On-prem", "Hybrid"],
    icon: "☁️",
  },
  {
    id: "contact",
    q: "Get your full report via email",
    icon: "📬",
    isContact: true,
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600&display=swap');

  .ha-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ha-root {
    font-family: 'DM Sans', sans-serif;
    background: ${T.bg};
    color: ${T.tx};
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ha-shell {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* ── Welcome ── */
  .ha-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    text-align: center;
    gap: 0;
  }
  .ha-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${T.teal};
    background: ${T.tealDim};
    border: 1px solid rgba(45,212,191,0.25);
    border-radius: 20px;
    padding: 5px 14px;
    margin-bottom: 28px;
    display: inline-block;
  }
  .ha-logo {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, ${T.tealDim}, ${T.orDim});
    border: 1px solid ${T.border2};
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 24px;
  }
  .ha-welcome h1 {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }
  .ha-welcome h1 em {
    font-style: normal;
    color: ${T.teal};
  }
  .ha-welcome p {
    font-size: 14px;
    color: ${T.tx2};
    line-height: 1.65;
    margin-bottom: 32px;
  }
  .ha-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    width: 100%;
  }
  .ha-btn-primary {
    background: ${T.teal};
    color: #000;
  }
  .ha-btn-primary:hover { filter: brightness(1.08); }
  .ha-btn-primary:active { transform: scale(0.98); }
  .ha-btn-ghost {
    background: transparent;
    border: 1px solid ${T.border};
    color: ${T.tx2};
    font-size: 13px;
    padding: 10px 20px;
  }
  .ha-btn-ghost:hover { border-color: ${T.border2}; color: ${T.tx}; }
  .ha-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
  }
  .ha-trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: ${T.tx3};
    font-weight: 500;
  }
  .ha-trust-item span:first-child { color: ${T.teal}; }

  /* ── Progress ── */
  .ha-progress-bar {
    height: 2px;
    background: ${T.s2};
    position: relative;
  }
  .ha-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${T.teal}, ${T.or});
    transition: width 0.4s ease;
  }
  .ha-progress-text {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 4px;
    font-size: 11px;
    color: ${T.tx3};
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── Wizard ── */
  .ha-wizard {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ha-question {
    flex: 1;
    padding: 28px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .ha-q-icon { font-size: 32px; }
  .ha-q-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${T.teal};
    margin-bottom: 6px;
  }
  .ha-q-text {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }
  .ha-opts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ha-opt {
    padding: 13px 16px;
    background: ${T.s1};
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    font-family: inherit;
    color: ${T.tx};
  }
  .ha-opt:hover {
    border-color: ${T.border2};
    background: ${T.s2};
  }
  .ha-opt.selected {
    border-color: ${T.teal};
    background: ${T.tealDim};
    color: ${T.tx};
  }
  .ha-multi-hint {
    font-size: 11px;
    color: ${T.tx3};
    margin-top: -8px;
  }
  .ha-nav {
    display: flex;
    gap: 10px;
    padding: 16px 20px 24px;
  }
  .ha-nav .ha-btn { flex: 1; }
  .ha-back {
    flex: 0 0 auto !important;
    width: 46px !important;
    padding: 14px 0 !important;
  }

  /* ── Contact ── */
  .ha-contact-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ha-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .ha-field label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${T.tx2};
  }
  .ha-field input {
    padding: 11px 14px;
    background: ${T.s1};
    border: 1.5px solid ${T.border};
    border-radius: 8px;
    font-size: 14px;
    color: ${T.tx};
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }
  .ha-field input:focus { border-color: ${T.teal}; }
  .ha-field input::placeholder { color: ${T.tx3}; }
  .ha-skip-link {
    text-align: center;
    font-size: 12px;
    color: ${T.tx3};
    cursor: pointer;
    padding: 4px;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .ha-skip-link:hover { color: ${T.tx2}; }

  /* ── Processing ── */
  .ha-processing {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    text-align: center;
    gap: 32px;
  }
  .ha-spinner-wrap {
    position: relative;
    width: 80px;
    height: 80px;
  }
  .ha-spinner {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid ${T.border};
    border-top-color: ${T.teal};
    animation: ha-spin 1s linear infinite;
  }
  .ha-spinner-inner {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    border: 2px solid ${T.border};
    border-bottom-color: ${T.or};
    animation: ha-spin 1.5s linear infinite reverse;
  }
  @keyframes ha-spin { to { transform: rotate(360deg); } }
  .ha-proc-title {
    font-size: 20px;
    font-weight: 700;
  }
  .ha-proc-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 300px;
  }
  .ha-proc-step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: ${T.tx3};
    transition: color 0.3s;
  }
  .ha-proc-step.done { color: ${T.teal}; }
  .ha-proc-step.active { color: ${T.tx}; }
  .ha-proc-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${T.border2};
    flex-shrink: 0;
    transition: background 0.3s;
  }
  .ha-proc-step.done .ha-proc-dot { background: ${T.teal}; }
  .ha-proc-step.active .ha-proc-dot { background: ${T.or}; animation: ha-pulse 1s ease infinite; }
  @keyframes ha-pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

  /* ── Results ── */
  .ha-results {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ha-results-header {
    padding: 20px;
    border-bottom: 1px solid ${T.border};
    background: ${T.s1};
  }
  .ha-results-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .ha-results-sub {
    font-size: 12px;
    color: ${T.tx2};
  }
  .ha-results-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px 80px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Score cards */
  .ha-score-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .ha-score-card {
    background: ${T.s1};
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 14px;
  }
  .ha-score-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: ${T.tx2};
    margin-bottom: 8px;
  }
  .ha-score-val {
    font-size: 28px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
    margin-bottom: 8px;
  }
  .ha-score-bar {
    height: 4px;
    background: ${T.border};
    border-radius: 2px;
    overflow: hidden;
  }
  .ha-score-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s ease;
  }

  /* Risk pill */
  .ha-risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .ha-risk-HIGH { background: rgba(248,113,113,0.15); color: ${T.red}; border: 1px solid rgba(248,113,113,0.3); }
  .ha-risk-MEDIUM { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .ha-risk-LOW { background: rgba(52,211,153,0.15); color: ${T.green}; border: 1px solid rgba(52,211,153,0.3); }

  /* Section headers */
  .ha-section-head {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${T.tx3};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .ha-section-head::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${T.border};
  }

  /* Vendors */
  .ha-vendor-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ha-vendor-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: ${T.s1};
    border: 1px solid ${T.border};
    border-radius: 10px;
  }
  .ha-vendor-rank {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${T.s3};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-vendor-rank.r1 { background: ${T.tealDim}; color: ${T.teal}; }
  .ha-vendor-rank.r2 { background: ${T.orDim}; color: ${T.or}; }
  .ha-vendor-rank.r3 { background: rgba(96,165,250,0.1); color: ${T.blue}; }
  .ha-vendor-name { font-size: 14px; font-weight: 700; }
  .ha-vendor-reason { font-size: 12px; color: ${T.tx2}; line-height: 1.4; }
  .ha-vendor-match {
    margin-left: auto;
    font-size: 15px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
  }

  /* Findings */
  .ha-findings {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ha-finding {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    background: ${T.s1};
    border: 1px solid ${T.border};
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.5;
    color: ${T.tx2};
  }
  .ha-finding-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${T.teal};
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* Next steps */
  .ha-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    counter-reset: step;
  }
  .ha-step {
    display: flex;
    gap: 12px;
    padding: 12px 14px;
    background: ${T.s1};
    border: 1px solid ${T.border};
    border-radius: 10px;
    counter-increment: step;
  }
  .ha-step-num {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: ${T.orDim};
    color: ${T.or};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-step-text { font-size: 13px; line-height: 1.5; color: ${T.tx2}; }

  /* Executive summary */
  .ha-exec {
    background: ${T.s1};
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 16px;
    font-size: 13px;
    line-height: 1.7;
    color: ${T.tx2};
  }

  /* CTA bar */
  .ha-cta-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    padding: 12px 20px;
    background: rgba(8,11,16,0.95);
    backdrop-filter: blur(16px);
    border-top: 1px solid ${T.border};
    display: flex;
    gap: 8px;
    z-index: 10;
  }
  .ha-cta-bar .ha-btn { flex: 1; font-size: 13px; padding: 12px 16px; }

  /* Error */
  .ha-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 10px;
    padding: 14px;
    font-size: 13px;
    color: ${T.red};
    line-height: 1.5;
  }

  .ha-divider { height: 1px; background: ${T.border}; }
`;

// ─── Score color ──────────────────────────────────────────────────────────────
function scoreColor(val) {
  if (val >= 4) return T.green;
  if (val >= 3) return T.teal;
  if (val >= 2) return "#fbbf24";
  return T.red;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | wizard | processing | results | error
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", email: "", company: "", role: "" });
  const [procStep, setProcStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const PROC_STEPS = [
    "Evaluating isolation patterns...",
    "Mapping compliance requirements...",
    "Scoring vendor alignment...",
    "Generating architecture recommendations...",
    "Preparing findings...",
  ];

  // ── Wizard logic ──────────────────────────────────────────────────────────
  const q = QUESTIONS[step];

  function toggleOpt(val) {
    if (q.multi) {
      const cur = answers[q.id] || [];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      setAnswers({ ...answers, [q.id]: val });
    }
  }

  function canAdvance() {
    if (q.isContact) return true;
    const val = answers[q.id];
    if (q.multi) return val && val.length > 0;
    return !!val;
  }

  function advance() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      runAssessment();
    }
  }

  function back() {
    if (step === 0) setScreen("welcome");
    else setStep(step - 1);
  }

  // ── API call ──────────────────────────────────────────────────────────────
  async function runAssessment() {
    setScreen("processing");
    setProcStep(0);

    // Animate proc steps
    let s = 0;
    intervalRef.current = setInterval(() => {
      s++;
      if (s < PROC_STEPS.length) setProcStep(s);
    }, 900);

    const profile = {
      tenants: answers.tenants || "Unknown",
      compliance: answers.compliance?.join(", ") || "None specified",
      isolation: answers.isolation || "Unknown",
      aiStatus: answers.aiStatus || "Unknown",
      cloud: answers.cloud || "Unknown",
    };

    const prompt = `You are an enterprise data architect specializing in multi-tenant isolation for MSP environments. Assess this infrastructure profile and return ONLY a valid JSON object (no markdown, no explanation).

Profile:
- Client tenants: ${profile.tenants}
- Compliance frameworks: ${profile.compliance}
- Current isolation pattern: ${profile.isolation}
- AI workload status: ${profile.aiStatus}
- Cloud platform: ${profile.cloud}

Score their current architecture across these 6 dimensions (1.0–5.0 scale, one decimal):
1. tenant_isolation — strength of data boundaries between tenants
2. encryption_depth — at-rest, in-transit, CMK support
3. ai_exposure_risk — risk of cross-tenant data exposure via AI (INVERTED: 5=low risk, 1=high risk)
4. compliance_readiness — audit trails, HIPAA/SOC2 readiness
5. integration_surface — open standards vs proprietary lock-in
6. msp_fit — suitability for multi-client MSP operations

Also provide:
- overall_score: weighted average (0–100 integer)
- exposure_risk_level: "HIGH" | "MEDIUM" | "LOW"
- top_vendors: array of 3 objects with { name, match_pct (integer 60-99), reason (15 words max) }
  Choose from: Snowflake, CockroachDB, PlanetScale, AWS Native, Azure, Google Cloud, Rubrik, OneTrust, Skyflow
- key_findings: array of 4 strings (each 20-30 words, specific to their profile)
- next_steps: array of 3 strings (each 15-25 words, actionable)
- exec_summary: 2 sentences (40-60 words total), professional tone

Return ONLY the JSON object. No markdown fences, no explanation.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      clearInterval(intervalRef.current);
      setProcStep(PROC_STEPS.length - 1);

      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setTimeout(() => setScreen("results"), 500);
    } catch (e) {
      clearInterval(intervalRef.current);
      setError("Assessment failed: " + (e.message || "Unknown error"));
      setScreen("error");
    }
  }

  function restart() {
    setScreen("welcome");
    setStep(0);
    setAnswers({});
    setContact({ name: "", email: "", company: "", role: "" });
    setResult(null);
    setError("");
    setProcStep(0);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="ha-root">
        <div className="ha-shell">
          {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("wizard")} />}
          {screen === "wizard" && (
            <WizardScreen
              q={q}
              step={step}
              total={QUESTIONS.length}
              answers={answers}
              contact={contact}
              setContact={setContact}
              onToggle={toggleOpt}
              onAdvance={advance}
              onBack={back}
              canAdvance={canAdvance}
            />
          )}
          {screen === "processing" && (
            <ProcessingScreen steps={PROC_STEPS} currentStep={procStep} />
          )}
          {screen === "results" && result && (
            <ResultsScreen result={result} answers={answers} onRestart={restart} />
          )}
          {screen === "error" && <ErrorScreen msg={error} onRestart={restart} />}
        </div>
      </div>
    </>
  );
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <div className="ha-welcome">
      <span className="ha-badge">HumanX 2026 × INT Inc.</span>
      <div className="ha-logo">🏛️</div>
      <h1>
        How Secure Is Your<br />
        <em>Multi-Tenant</em><br />
        AI Architecture?
      </h1>
      <p>
        Answer 6 questions and get a personalized assessment of your data isolation patterns,
        compliance readiness, and top vendor recommendations — in 90 seconds.
      </p>
      <button className="ha-btn ha-btn-primary" onClick={onStart}>
        Start Assessment →
      </button>
      <div className="ha-trust" style={{ marginTop: 20 }}>
        <span className="ha-trust-item"><span>✓</span><span>SOC 2 Type II</span></span>
        <span className="ha-trust-item"><span>✓</span><span>No data stored</span></span>
        <span className="ha-trust-item"><span>✓</span><span>Powered by Claude</span></span>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────
function WizardScreen({ q, step, total, answers, contact, setContact, onToggle, onAdvance, onBack, canAdvance }) {
  const pct = ((step + 1) / total) * 100;
  const val = answers[q.id];

  return (
    <div className="ha-wizard">
      <div className="ha-progress-text">
        <span>Question {step + 1} of {total}</span>
        <span style={{ color: T.teal }}>{Math.round(pct)}%</span>
      </div>
      <div className="ha-progress-bar">
        <div className="ha-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="ha-question">
        <div className="ha-q-icon">{q.icon}</div>
        <div>
          <div className="ha-q-label">Question {step + 1}</div>
          <div className="ha-q-text">{q.q}</div>
        </div>

        {!q.isContact ? (
          <>
            {q.multi && <p className="ha-multi-hint">Select all that apply</p>}
            <div className="ha-opts">
              {q.opts.map((opt) => (
                <button
                  key={opt}
                  className={`ha-opt ${
                    q.multi ? (val || []).includes(opt) : val === opt ? "selected" : ""
                  }`}
                  onClick={() => onToggle(opt)}
                >
                  {q.multi && (
                    <span style={{ marginRight: 10, color: (val || []).includes(opt) ? T.teal : T.border2 }}>
                      {(val || []).includes(opt) ? "☑" : "☐"}
                    </span>
                  )}
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="ha-contact-form">
            <p style={{ fontSize: 13, color: T.tx2, lineHeight: 1.5 }}>
              We'll email your full PDF report. Skip if you prefer to view results on-screen only.
            </p>
            {[
              ["name", "Your Name", "text"],
              ["email", "Email Address", "email"],
              ["company", "Company / MSP Name", "text"],
              ["role", "Your Role", "text"],
            ].map(([field, ph, type]) => (
              <div className="ha-field" key={field}>
                <label>{ph}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={contact[field]}
                  onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                />
              </div>
            ))}
            <span className="ha-skip-link" onClick={onAdvance}>
              Skip — view results on screen only
            </span>
          </div>
        )}
      </div>

      <div className="ha-nav">
        <button className="ha-btn ha-btn-ghost ha-back" onClick={onBack}>←</button>
        <button
          className="ha-btn ha-btn-primary"
          onClick={onAdvance}
          disabled={!canAdvance()}
          style={{ opacity: canAdvance() ? 1 : 0.4 }}
        >
          {step === QUESTIONS.length - 1 ? "Generate Assessment →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Processing ───────────────────────────────────────────────────────────────
function ProcessingScreen({ steps, currentStep }) {
  return (
    <div className="ha-processing">
      <div className="ha-spinner-wrap">
        <div className="ha-spinner" />
        <div className="ha-spinner-inner" />
      </div>
      <div>
        <div className="ha-proc-title">Analyzing your architecture...</div>
        <div style={{ fontSize: 13, color: T.tx2, marginTop: 8 }}>
          Claude is scoring your infrastructure across 6 dimensions
        </div>
      </div>
      <div className="ha-proc-steps">
        {steps.map((label, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "";
          return (
            <div key={i} className={`ha-proc-step ${state}`}>
              <div className="ha-proc-dot" />
              {i < currentStep ? `✓ ${label}` : label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function ResultsScreen({ result, answers, onRestart }) {
  const scores = [
    { key: "tenant_isolation", label: "Tenant Isolation" },
    { key: "encryption_depth", label: "Encryption Depth" },
    { key: "ai_exposure_risk", label: "AI Data Safety" },
    { key: "compliance_readiness", label: "Compliance Ready" },
    { key: "integration_surface", label: "Integration Surface" },
    { key: "msp_fit", label: "MSP Fit" },
  ];

  return (
    <div className="ha-results">
      <div className="ha-results-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="ha-results-title">Your Architecture Assessment</div>
            <div className="ha-results-sub">
              {answers.tenants || "?"} tenants · {answers.cloud || "?"} · {answers.isolation || "?"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: scoreColor(result.overall_score / 20) }}>
              {result.overall_score}
            </div>
            <div style={{ fontSize: 10, color: T.tx3, textTransform: "uppercase", letterSpacing: 1 }}>
              / 100
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: T.tx3 }}>AI Exposure Risk:</span>
          <span className={`ha-risk-badge ha-risk-${result.exposure_risk_level}`}>
            {result.exposure_risk_level}
          </span>
        </div>
      </div>

      <div className="ha-results-body">
        {/* Executive Summary */}
        <div>
          <div className="ha-section-head">Executive Summary</div>
          <div className="ha-exec">{result.exec_summary}</div>
        </div>

        {/* Scores */}
        <div>
          <div className="ha-section-head">Architecture Scores</div>
          <div className="ha-score-grid">
            {scores.map(({ key, label }) => {
              const val = result[key] || 0;
              const color = scoreColor(val);
              return (
                <div className="ha-score-card" key={key}>
                  <div className="ha-score-label">{label}</div>
                  <div className="ha-score-val" style={{ color }}>
                    {val.toFixed(1)}
                    <span style={{ fontSize: 14, color: T.tx3 }}>/5</span>
                  </div>
                  <div className="ha-score-bar">
                    <div
                      className="ha-score-fill"
                      style={{ width: `${(val / 5) * 100}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendor Recommendations */}
        {result.top_vendors?.length > 0 && (
          <div>
            <div className="ha-section-head">Vendor Recommendations</div>
            <div className="ha-vendor-list">
              {result.top_vendors.slice(0, 3).map((v, i) => (
                <div className="ha-vendor-item" key={i}>
                  <div className={`ha-vendor-rank r${i + 1}`}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ha-vendor-name">{v.name}</div>
                    <div className="ha-vendor-reason">{v.reason}</div>
                  </div>
                  <div className="ha-vendor-match" style={{ color: i === 0 ? T.teal : i === 1 ? T.or : T.blue }}>
                    {v.match_pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Findings */}
        {result.key_findings?.length > 0 && (
          <div>
            <div className="ha-section-head">Key Findings</div>
            <div className="ha-findings">
              {result.key_findings.map((f, i) => (
                <div className="ha-finding" key={i}>
                  <div className="ha-finding-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {result.next_steps?.length > 0 && (
          <div>
            <div className="ha-section-head">Recommended Next Steps</div>
            <div className="ha-steps">
              {result.next_steps.map((s, i) => (
                <div className="ha-step" key={i}>
                  <div className="ha-step-num">{i + 1}</div>
                  <div className="ha-step-text">{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INT CTA */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.tealGlow}, ${T.orDim})`,
            border: `1px solid ${T.border2}`,
            borderRadius: 12,
            padding: 18,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            Want a full architecture deep-dive?
          </div>
          <div style={{ fontSize: 12, color: T.tx2, lineHeight: 1.5, marginBottom: 12 }}>
            INT Inc. builds purpose-built data isolation tools for MSPs. SOC 2 Type II certified.
            25+ years of MSP expertise.
          </div>
          <div style={{ fontSize: 11, color: T.teal, fontWeight: 600, letterSpacing: 0.5 }}>
            📍 Find Kyle at INT Inc. booth · HumanX 2026
          </div>
        </div>
      </div>

      <div className="ha-cta-bar">
        <button className="ha-btn ha-btn-ghost" onClick={onRestart} style={{ flex: "0 0 auto", width: "auto", padding: "12px 16px" }}>
          ↺ Retake
        </button>
        <button className="ha-btn ha-btn-primary" onClick={() => window.print()}>
          📥 Save Results
        </button>
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function ErrorScreen({ msg, onRestart }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20 }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Assessment Failed</div>
      <div className="ha-error">{msg}</div>
      <button className="ha-btn ha-btn-primary" onClick={onRestart} style={{ width: "100%" }}>
        Try Again
      </button>
    </div>
  );
}
