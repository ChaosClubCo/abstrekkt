import React, { useState } from "react";
import {
  Github,
  FileText,
  Zap,
  MessageSquare,
  CreditCard,
  Cpu,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  User,
  Layers,
  GitBranch,
  Database,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  name: string;
  useCase: string;
  integrations: string[];
  template: string;
  model: string;
  budget: number;
}

interface Props {
  onComplete: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const USE_CASES = [
  { id: "ai-workflows", label: "AI Workflows", desc: "Orchestrate multi-model pipelines", icon: Cpu },
  { id: "code-automation", label: "Code Automation", desc: "GitHub hooks, PR bots, CI/CD", icon: GitBranch },
  { id: "data-pipelines", label: "Data Pipelines", desc: "ETL, streaming, transformations", icon: Database },
  { id: "team-docs", label: "Team Docs", desc: "AI-powered documentation & wikis", icon: BookOpen },
];

const INTEGRATIONS = [
  { id: "github", label: "GitHub", desc: "Repos, PRs, Issues", icon: Github, color: "#e4e6f0" },
  { id: "notion", label: "Notion", desc: "Docs & databases", icon: FileText, color: "#a78bfa" },
  { id: "slack", label: "Slack", desc: "Notifications & alerts", icon: MessageSquare, color: "#22c55e" },
  { id: "linear", label: "Linear", desc: "Issues & sprints", icon: Layers, color: "#5e6ad2" },
  { id: "stripe", label: "Stripe", desc: "Payment triggers", icon: CreditCard, color: "#635bff" },
  { id: "claude", label: "Claude API", desc: "Anthropic AI models", icon: Sparkles, color: "#e07b39" },
];

const TEMPLATES = [
  { id: "gh-slack", label: "GitHub → Slack", desc: "Post alerts when PRs open or CI fails", trigger: "New PR / CI event", action: "Slack message", color: "#5e6ad2" },
  { id: "form-notion", label: "Form → Notion", desc: "Save form submissions as Notion pages", trigger: "Form submission", action: "Create Notion page", color: "#a78bfa" },
  { id: "stripe-email", label: "Stripe → Email", desc: "Send receipts and upsells on payment", trigger: "Payment success", action: "Send email", color: "#22c55e" },
  { id: "ai-doc", label: "AI Doc Generator", desc: "Auto-generate docs from code changes", trigger: "Commit pushed", action: "Generate via Claude", color: "#e07b39" },
];

const MODELS = [
  { id: "haiku", label: "Claude Haiku", desc: "Fastest · lowest cost", cost: "$0.25 / MTok", recommended: false },
  { id: "sonnet", label: "Claude Sonnet 4.6", desc: "Best balance of speed + intelligence", cost: "$3 / MTok", recommended: true },
  { id: "opus", label: "Claude Opus", desc: "Most capable · highest cost", cost: "$15 / MTok", recommended: false },
];

const BUDGET_STEPS = [50_000, 200_000, 500_000, 1_000_000, 5_000_000, 10_000_000];

function fmtBudget(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1_000}K`;
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const neonBtn: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  padding: "0.85rem 2.4rem",
  background: "var(--ff-neon)",
  color: "var(--ff-void)",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
  transition: "box-shadow 0.2s, transform 0.15s",
};

const ghostBtn: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  padding: "0.85rem 2rem",
  background: "transparent",
  color: "rgba(191,0,255,0.6)",
  border: "1px solid rgba(191,0,255,0.3)",
  cursor: "pointer",
  transition: "border-color 0.2s, color 0.2s",
};

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────

function StepWelcome({ data, onChange, onNext }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void; onNext: () => void }) {
  return (
    <div style={{ animation: "ff-fade-up 0.45s ease both" }}>
      <StepLabel step={1} />
      <h2 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.6rem)", fontWeight: 700, textTransform: "uppercase", color: "var(--ff-white)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Welcome to{" "}
        <span style={{ background: "linear-gradient(135deg, #bf00ff 0%, #e040fb 55%, #7b00ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          FlashFusion
        </span>
      </h2>
      <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(232,213,255,0.5)", fontSize: "0.92rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
        Let's set up your workspace. Takes 60 seconds.
      </p>

      {/* Name */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(191,0,255,0.55)", display: "block", marginBottom: "0.6rem" }}>
          // Your name
        </label>
        <div style={{ position: "relative" }}>
          <User size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(191,0,255,0.4)" }} />
          <input
            autoFocus
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && data.name.trim() && onNext()}
            placeholder="e.g. Jordan Lee"
            style={{ width: "100%", paddingLeft: "2.5rem", padding: "0.8rem 0.9rem 0.8rem 2.5rem", background: "rgba(7,0,16,0.6)", border: "1px solid rgba(123,0,255,0.3)", color: "var(--ff-white)", fontFamily: "'Syne', sans-serif", fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--ff-neon)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(123,0,255,0.3)")}
          />
        </div>
      </div>

      {/* Use case */}
      <div style={{ marginBottom: "2.5rem" }}>
        <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(191,0,255,0.55)", display: "block", marginBottom: "0.8rem" }}>
          // Primary use case
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {USE_CASES.map(({ id, label, desc, icon: Icon }) => {
            const active = data.useCase === id;
            return (
              <button key={id} onClick={() => onChange({ useCase: id })} style={{ textAlign: "left", padding: "0.9rem 1rem", background: active ? "rgba(123,0,255,0.1)" : "rgba(7,0,16,0.5)", border: `1px solid ${active ? "var(--ff-neon)" : "rgba(123,0,255,0.2)"}`, cursor: "pointer", transition: "all 0.18s", boxShadow: active ? "var(--ff-glow-sm)" : "none" }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.45)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,0,255,0.2)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                  <Icon size={13} style={{ color: active ? "var(--ff-neon)" : "rgba(191,0,255,0.5)" }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: active ? "var(--ff-neon)" : "rgba(232,213,255,0.8)", fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", color: "rgba(232,213,255,0.38)", margin: 0 }}>{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onNext} disabled={!data.name.trim() || !data.useCase} style={{ ...neonBtn, opacity: data.name.trim() && data.useCase ? 1 : 0.4 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--ff-glow-lg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Connect ──────────────────────────────────────────────────────────

function StepConnect({ data, onChange, onNext, onBack }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }) {
  const toggle = (id: string) => {
    const cur = data.integrations;
    onChange({ integrations: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };

  return (
    <div style={{ animation: "ff-fade-up 0.45s ease both" }}>
      <StepLabel step={2} />
      <h2 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, textTransform: "uppercase", color: "var(--ff-white)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Connect your stack
      </h2>
      <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(232,213,255,0.5)", fontSize: "0.88rem", marginBottom: "2rem", lineHeight: 1.7 }}>
        Select the services you use. You can always add more in Settings.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.7rem", marginBottom: "2.5rem" }}>
        {INTEGRATIONS.map(({ id, label, desc, icon: Icon, color }) => {
          const active = data.integrations.includes(id);
          return (
            <button key={id} onClick={() => toggle(id)} style={{ position: "relative", textAlign: "left", padding: "1.1rem 1rem", background: active ? "rgba(123,0,255,0.08)" : "rgba(7,0,16,0.5)", border: `1px solid ${active ? "var(--ff-neon)" : "rgba(123,0,255,0.18)"}`, cursor: "pointer", transition: "all 0.18s", boxShadow: active ? "var(--ff-glow-sm)" : "none" }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.4)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,0,255,0.18)"; }}>
              {active && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: "50%", background: "var(--ff-neon)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={9} style={{ color: "var(--ff-void)" }} />
                </div>
              )}
              <Icon size={18} style={{ color: active ? color : "rgba(191,0,255,0.4)", marginBottom: "0.55rem", display: "block" }} />
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: active ? "var(--ff-white)" : "rgba(232,213,255,0.75)", fontWeight: 700, marginBottom: "0.25rem" }}>{label}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.68rem", color: "rgba(232,213,255,0.35)", margin: 0 }}>{desc}</p>
            </button>
          );
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue →" nextDisabled={data.integrations.length === 0} skipLabel="Skip for now" onSkip={onNext} />
    </div>
  );
}

// ─── Step 3: First Workflow ───────────────────────────────────────────────────

function StepTemplate({ data, onChange, onNext, onBack }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div style={{ animation: "ff-fade-up 0.45s ease both" }}>
      <StepLabel step={3} />
      <h2 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, textTransform: "uppercase", color: "var(--ff-white)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Your first workflow
      </h2>
      <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(232,213,255,0.5)", fontSize: "0.88rem", marginBottom: "2rem", lineHeight: 1.7 }}>
        Pick a template to deploy immediately. Customize it anytime.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2.5rem" }}>
        {TEMPLATES.map(({ id, label, desc, trigger, action, color }) => {
          const active = data.template === id;
          return (
            <button key={id} onClick={() => onChange({ template: id })} style={{ textAlign: "left", padding: "1.2rem", background: active ? "rgba(123,0,255,0.08)" : "rgba(7,0,16,0.5)", border: `1px solid ${active ? "var(--ff-neon)" : "rgba(123,0,255,0.18)"}`, cursor: "pointer", transition: "all 0.18s", boxShadow: active ? "var(--ff-glow-sm)" : "none", position: "relative" }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.4)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,0,255,0.18)"; }}>
              {active && (
                <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderRadius: "50%", background: "var(--ff-neon)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={9} style={{ color: "var(--ff-void)" }} />
                </div>
              )}
              <p style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: active ? "var(--ff-neon)" : "var(--ff-white)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", color: "rgba(232,213,255,0.45)", marginBottom: "1rem", lineHeight: 1.6 }}>{desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", padding: "0.2rem 0.55rem", background: `${color}18`, color, border: `1px solid ${color}40` }}>{trigger}</span>
                <ArrowRight size={10} style={{ color: "rgba(191,0,255,0.4)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", padding: "0.2rem 0.55rem", background: "rgba(94,106,210,0.12)", color: "#8b99f5", border: "1px solid rgba(94,106,210,0.25)" }}>{action}</span>
              </div>
            </button>
          );
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue →" nextDisabled={!data.template} skipLabel="Skip for now" onSkip={onNext} />
    </div>
  );
}

// ─── Step 4: AI Model ─────────────────────────────────────────────────────────

function StepModel({ data, onChange, onNext, onBack }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }) {
  const budgetIdx = BUDGET_STEPS.indexOf(data.budget) === -1 ? 1 : BUDGET_STEPS.indexOf(data.budget);

  return (
    <div style={{ animation: "ff-fade-up 0.45s ease both" }}>
      <StepLabel step={4} />
      <h2 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, textTransform: "uppercase", color: "var(--ff-white)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Configure AI
      </h2>
      <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(232,213,255,0.5)", fontSize: "0.88rem", marginBottom: "2rem", lineHeight: 1.7 }}>
        Set your default model and monthly token budget.
      </p>

      {/* Model selector */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(191,0,255,0.55)", display: "block", marginBottom: "0.8rem" }}>
          // Default model
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {MODELS.map(({ id, label, desc, cost, recommended }) => {
            const active = data.model === id;
            return (
              <button key={id} onClick={() => onChange({ model: id })} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.1rem", background: active ? "rgba(123,0,255,0.1)" : "rgba(7,0,16,0.5)", border: `1px solid ${active ? "var(--ff-neon)" : "rgba(123,0,255,0.2)"}`, cursor: "pointer", transition: "all 0.18s", textAlign: "left", boxShadow: active ? "var(--ff-glow-sm)" : "none" }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.4)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,0,255,0.2)"; }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? "var(--ff-neon)" : "rgba(123,0,255,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: active ? "var(--ff-glow-sm)" : "none" }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ff-neon)" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: active ? "var(--ff-neon)" : "var(--ff-white)", fontWeight: 700 }}>{label}</span>
                    {recommended && (
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.15em", padding: "0.15rem 0.5rem", background: "rgba(191,0,255,0.15)", color: "var(--ff-neon)", border: "1px solid rgba(191,0,255,0.35)", textTransform: "uppercase" }}>★ Recommended</span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", color: "rgba(232,213,255,0.4)", margin: "0.2rem 0 0" }}>{desc}</p>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(232,213,255,0.35)", flexShrink: 0 }}>{cost}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget slider */}
      <div style={{ marginBottom: "2.5rem" }}>
        <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(191,0,255,0.55)", display: "block", marginBottom: "0.6rem" }}>
          // Monthly token budget
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input type="range" min={0} max={BUDGET_STEPS.length - 1} value={budgetIdx} onChange={(e) => onChange({ budget: BUDGET_STEPS[Number(e.target.value)] })}
            style={{ flex: 1, accentColor: "var(--ff-neon)", height: 4 }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "var(--ff-neon)", textShadow: "var(--ff-glow-sm)", minWidth: 50, textAlign: "right" }}>
            {fmtBudget(data.budget)}
          </span>
        </div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.68rem", color: "rgba(232,213,255,0.3)", marginTop: "0.4rem" }}>
          You can adjust this anytime in Settings → API Keys
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Continue →" nextDisabled={false} />
    </div>
  );
}

// ─── Step 5: Launch ───────────────────────────────────────────────────────────

function StepLaunch({ data, onComplete }: { data: OnboardingData; onComplete: () => void }) {
  const [launching, setLaunching] = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(onComplete, 1200);
  };

  const templateLabel = TEMPLATES.find((t) => t.id === data.template)?.label;
  const modelLabel = MODELS.find((m) => m.id === data.model)?.label;

  return (
    <div style={{ animation: "ff-fade-up 0.45s ease both", textAlign: "center" }}>
      <StepLabel step={5} centered />

      {/* Neon circle emblem */}
      <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid var(--ff-neon)", boxShadow: "var(--ff-glow-md)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.8rem", animation: "ff-hud-breathe 3s ease-in-out infinite" }}>
        <Sparkles size={28} style={{ color: "var(--ff-neon)" }} />
      </div>

      <h2 style={{ fontFamily: "'Syncopate', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 700, textTransform: "uppercase", color: "var(--ff-white)", lineHeight: 1.1, marginBottom: "0.6rem" }}>
        {data.name ? `Ready, ${data.name.split(" ")[0]}` : "You're ready"}
      </h2>
      <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(232,213,255,0.45)", fontSize: "0.88rem", marginBottom: "2rem", lineHeight: 1.7 }}>
        Your workspace is configured. Here's what was set up:
      </p>

      {/* Summary */}
      <div style={{ background: "rgba(7,0,16,0.6)", border: "1px solid rgba(123,0,255,0.2)", padding: "1.4rem 1.6rem", marginBottom: "2.5rem", textAlign: "left" }}>
        {[
          { label: "Use case", value: USE_CASES.find((u) => u.id === data.useCase)?.label ?? "—" },
          { label: "Integrations", value: data.integrations.length ? data.integrations.map((i) => INTEGRATIONS.find((x) => x.id === i)?.label).join(", ") : "None selected" },
          { label: "First workflow", value: templateLabel ?? "None selected" },
          { label: "Default model", value: modelLabel ?? "—" },
          { label: "Token budget", value: `${fmtBudget(data.budget)} / month` },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", paddingBottom: "0.6rem", borderBottom: "1px solid rgba(123,0,255,0.1)", marginBottom: "0.6rem" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(191,0,255,0.45)", width: 110, flexShrink: 0 }}>{label}</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.82rem", color: "rgba(232,213,255,0.75)" }}>{value}</span>
          </div>
        ))}
      </div>

      <button onClick={handleLaunch} disabled={launching} style={{ ...neonBtn, opacity: launching ? 0.7 : 1, minWidth: 240, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}
        onMouseEnter={(e) => { if (!launching) { (e.currentTarget as HTMLElement).style.boxShadow = "var(--ff-glow-lg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; } }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
        {launching ? (
          <>
            <span style={{ animation: "ff-blink 0.6s ease-in-out infinite" }}>▸</span>
            Initializing…
          </>
        ) : (
          <>Launch FlashFusion →</>
        )}
      </button>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StepLabel({ step, centered }: { step: number; centered?: boolean }) {
  return (
    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ff-neon)", textShadow: "var(--ff-glow-sm)", marginBottom: "1rem", textAlign: centered ? "center" : "left" }}>
      // Step {step} of 5
    </p>
  );
}

function NavButtons({ onBack, onNext, nextLabel, nextDisabled, skipLabel, onSkip }: { onBack: () => void; onNext: () => void; nextLabel: string; nextDisabled: boolean; skipLabel?: string; onSkip?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={onBack} style={{ ...ghostBtn, padding: "0.8rem 1.4rem" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.6)"; (e.currentTarget as HTMLElement).style.color = "var(--ff-neon)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(191,0,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(191,0,255,0.6)"; }}>
        ← Back
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {skipLabel && onSkip && (
          <button onClick={onSkip} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(232,213,255,0.28)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(232,213,255,0.55)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,213,255,0.28)")}>
            {skipLabel}
          </button>
        )}
        <button onClick={onNext} disabled={nextDisabled} style={{ ...neonBtn, opacity: nextDisabled ? 0.4 : 1 }}
          onMouseEnter={(e) => { if (!nextDisabled) { (e.currentTarget as HTMLElement).style.boxShadow = "var(--ff-glow-lg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export function OnboardingOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    useCase: "",
    integrations: [],
    template: "",
    model: "sonnet",
    budget: 200_000,
  });

  const update = (partial: Partial<OnboardingData>) => setData((d) => ({ ...d, ...partial }));
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const progressPct = (step / 5) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(3,0,10,0.97)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      {/* Noise texture */}
      <div className="ff-noise" />

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(123,0,255,0.12)", zIndex: 61 }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #7b00ff, #bf00ff, #e040fb)", transition: "width 0.55s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "var(--ff-glow-sm)" }} />
      </div>

      {/* Step counter HUD tag */}
      <div className="ff-hud-tag" style={{ position: "fixed", top: "1.2rem", right: "1.8rem", zIndex: 61 }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(191,0,255,0.45)", margin: 0 }}>STEP</p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--ff-neon)", textShadow: "var(--ff-glow-sm)", margin: "0.1rem 0 0" }}>{step} / 5</p>
      </div>

      {/* Dot indicators */}
      <div style={{ position: "fixed", bottom: "1.8rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 61 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} style={{ width: s === step ? 20 : 6, height: 6, borderRadius: 3, background: s <= step ? "var(--ff-neon)" : "rgba(123,0,255,0.2)", boxShadow: s === step ? "var(--ff-glow-sm)" : "none", transition: "all 0.35s ease" }} />
        ))}
      </div>

      {/* Content panel */}
      <div style={{ width: "100%", maxWidth: 560, padding: "2rem 2rem 5rem", position: "relative" }}>
        {step === 1 && <StepWelcome data={data} onChange={update} onNext={next} />}
        {step === 2 && <StepConnect data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 3 && <StepTemplate data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 4 && <StepModel data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 5 && <StepLaunch data={data} onComplete={onComplete} />}
      </div>
    </div>
  );
}
