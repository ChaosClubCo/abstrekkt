import { useState } from "react";

const PROMPTS = [
  {
    id: "01",
    name: "AI Opportunity Mapper",
    status: "production",
    source: "epb-use-case-discovery.jsx",
    model: "claude-sonnet-4-20250514",
    version: "1.0",
    updated: "2026-05-13",
    cost: "~$0.022/gen",
    latency: "P50 <40s, P95 <75s",
    summary: "Two-pass API system. Pass 1 runs 3 live web searches. Pass 2 generates 8 use cases grounded in those sources. Every use case indexes back to a real URL.",
    systemPrompt: {
      pass1: "No system prompt. Pass 1 is a bare user message — the model acts as a search orchestrator, not an analyst. Giving it a persona risks synthesis. Bare prompt + web_search tool keeps it mechanical.",
      pass2: `You are an Anthropic ecosystem expert generating Claude AI use cases.`,
      pass2Note: "Intentionally minimal. The structured user message does the heavy lifting (context + sources + output schema). Expanding the system prompt risks personality drift in JSON output."
    },
    taskSpec: {
      pass1: `Search the web for current information on these topics. Run all 3 searches:\n\n1. "Anthropic Claude {industryName} use cases 2025 2026"\n2. "Claude AI enterprise {domainLabel} real world examples"\n3. "Anthropic Claude new features capabilities MCP 2026"\n\nAfter searching, respond with ONLY the text "SEARCH_COMPLETE" and nothing else.`,
      pass2: `Generate 8 specific, actionable use cases. For each:\n- title: Under 10 words\n- description: 2-3 sentences (audience-tier appropriate)\n- domain: implementation|prompts|governance|training\n- trending: true/false\n- priority/effort/impact: High|Medium|Low\n- timeframe: Quick Win|Short-term|Medium-term|Long-term\n- claudeFeatures: Array of Claude capabilities from sources\n- risks: Brief risk note\n- quickStart: One concrete first step (1 sentence)\n- sourceIndices: Array of ints referencing VERIFIED SOURCES list`
    },
    variables: [
      { name: "tierDescription", effect: "Controls output register — enduser (plain English), tech (implementation details), ai (architecture-level)" },
      { name: "sourceContext", effect: "Numbered list of [N] \"Title\" — URL. sourceIndices map back here. Empty fallback instructs model to use training knowledge." },
      { name: "domainFocus", effect: "\"Cover all four domains\" or a single label. Controls distribution across implementation/prompts/governance/training." }
    ],
    apiConfig: [
      { pass: "Pass 1", maxTokens: 1000, tools: "web_search_20250305", note: "Search only. No analysis." },
      { pass: "Pass 2", maxTokens: 6000, tools: "None", note: "8 use cases × ~500 tokens. 4000 truncates at UC #7 → malformed JSON → parse failure → fallback results." }
    ],
    fragilities: [
      "SEARCH_COMPLETE instruction sometimes ignored on rich results — model appends a summary. Cosmetic (source extraction still works) but adds latency.",
      "Hidden Gems data is hardcoded (30+ items). Won't reflect new Claude capabilities without manual source file update.",
      "JSON parse failure falls through to hardcoded examples tagged with real URLs but not grounded in current session's search results.",
      "Three fixed search queries don't adapt beyond {industryName} and {domainLabel} substitution."
    ],
    guard: `parsed.useCases = parsed.useCases.map(uc => ({\n  ...uc,\n  sourceIndices: (uc.sourceIndices || []).filter(\n    i => typeof i === 'number' && i >= 0 && i < extractedSources.length\n  )\n}));`,
    guardNote: "Strips hallucinated indices before they reach the UI. Required — without it, source links break when model invents index 12 in a 5-source list.",
    tests: [
      { type: "happy", desc: "role=developer, industry=technology — 8 UCs, valid JSON, all sourceIndices in range" },
      { type: "edge", desc: "Zero search results (network failure) — graceful fallback, sourceIndices: [] on all UCs" },
      { type: "adversarial", desc: "Niche industry (government) — watch for hallucinated Claude features (\"Claude Vision API\", \"Claude Realtime API\")" }
    ],
    gaps: [
      "No feedback loop — no mechanism to record which use cases clients actually acted on",
      "Search quality varies — technology/healthcare strong, manufacturing/government thin",
      "Timeout at 90s — combined P95 is ~55s, but model slowdowns and rate-limit back-pressure happen"
    ]
  },
  {
    id: "02",
    name: "ROI Failure Diagnostic",
    status: "draft",
    source: "INT-AI-ROI-Positioning-Narrative.html",
    model: "claude-sonnet-4-20250514",
    version: "1.0",
    updated: "2026-05-13",
    cost: "~$0.008/gen",
    latency: "P50 <4s",
    summary: "Maps a client's AI situation to one of three documented root causes of ROI failure. Returns a structured diagnosis with sourced evidence and a recommended FlashFusion service path. Built for sales discovery calls and Lumina kickoffs.",
    systemPrompt: {
      pass1: null,
      pass2: "FlashFusion AI ROI diagnostic specialist. Three root causes baked into the system prompt with sourced evidence (IBM Q4 2025, Gartner 2026, MIT GenAI Divide 2025, Epic IT 2026, NVIDIA 2025).",
      pass2Note: "The system prompt IS the IP — it contains the entire three-cause framework with evidence. Minimal role description, maximum structured knowledge."
    },
    causes: [
      {
        num: 1,
        name: "Measurement Failure",
        signal: "\"We know it's helping but can't quantify it.\" Adoption rates cited instead of outcomes. 3-6 months in, no ROI number.",
        source: "79% report productivity gains, only 29% can measure ROI (IBM Q4 2025). 42% show zero measurable ROI due to measurement failures (Gartner/ByteIota, Jan 2026).",
        service: "Lumina AI Readiness Audit"
      },
      {
        num: 2,
        name: "Organizational Moat Failure",
        signal: "Copilot only. CRM/ERP/finance are separate systems. Gains limited to one-off tasks (emails, summaries). No workflow changes in a year.",
        source: "42% abandoned most AI projects in 2025 — organizational constraints, not tech (IBM Q4 2025). \"Your AI governance stops at M365\" (Epic IT, 2026).",
        service: "Lumina + Nexus Agentic Integration"
      },
      {
        num: 3,
        name: "Security Architecture Failure",
        signal: "Agents/automations running. No approval gates or audit trails. Security/legal not involved. Moving fast, proud of it.",
        source: "40% of agentic projects cancelled by 2027 — poor risk controls (Gartner/FP&A Trends, Feb 2026). Attack categories: memory poisoning, jailbreaks, PII exposure (NVIDIA, Dec 2025).",
        service: "Guardian Managed AI Ops"
      }
    ],
    taskSpec: {
      pass1: null,
      pass2: "Identify: PRIMARY CAUSE (one, not a hedge), EVIDENCE MATCH (2-3 signals quoting client's own words), SEVERITY (Low/Med/High), RECOMMENDED SERVICE, NEXT QUESTION (advances discovery, not already answered)."
    },
    tests: [
      { type: "happy", desc: "8 months Copilot, no ROI number, no agents → Cause 1, Lumina, severity Medium" },
      { type: "edge", desc: "All three causes present — model picks most urgent (likely Cause 3 if agents running without review)" },
      { type: "adversarial", desc: "Vague input (\"we want to be more innovative\") — specific next_question, not \"tell me more about your AI journey\"" }
    ],
    gaps: [
      "Framework is FlashFusion IP, not publicly validated — clients may recognize it as a sales funnel structure",
      "No validation against real outcomes — logical but not empirically validated against FF client data (no longitudinal data yet)",
      "agents_deployed is self-reported — clients often don't know if their tools run agents (Copilot Agents, Zapier AI, etc.)",
      "No severity weighting by industry — Cause 3 in healthcare (HIPAA) is categorically different from the same in a marketing agency"
    ]
  },
  {
    id: "03",
    name: "AI Setup Audit Scorecard",
    status: "spec",
    source: "Base44 app 69c440b10249984f1114bc4b",
    model: "claude-sonnet-4-20250514",
    version: "1.0",
    updated: "2026-05-13",
    cost: "~$0.012/gen",
    latency: "P50 <6s",
    summary: "Scores a completed Lumina audit intake (30 questions, 6 dimensions) into a composite readiness score, gap analysis, and 90-day roadmap. This is the deliverable engine behind the $15K Lumina AI Readiness Audit.",
    systemPrompt: {
      pass1: null,
      pass2: "FlashFusion AI readiness assessor. Scores against a six-dimension framework. Does not inflate. Does not soften.",
      pass2Note: "The calibration benchmark is the key element. Without it, Claude compresses scores to 60-72 regardless of input. Explicit distribution anchors scoring to FlashFusion's client baseline."
    },
    dimensions: [
      { name: "Tool Coverage & Integration", weight: "20%", drivers: "+cross-system, +production, +API/MCP", detractors: "-single-tool, -no integration, -consumer tools" },
      { name: "Governance & Security", weight: "20%", drivers: "+written policy, +security team, +audit trail", detractors: "-no policy, -shadow AI, -no review" },
      { name: "Team Capability & Training", weight: "18%", drivers: "+role-specific, +adoption tracked, +gaps mapped", detractors: "-one-time generic, -no tracking" },
      { name: "Use Case Clarity", weight: "17%", drivers: "+documented, +ROI projections, +workflow-specific", detractors: "-vague, -no docs, -no prioritization" },
      { name: "Measurement & ROI Tracking", weight: "15%", drivers: "+baseline established, +leading indicators, +P&L attribution", detractors: "-no baseline, -activity metrics only" },
      { name: "Roadmap & Executive Alignment", weight: "10%", drivers: "+documented roadmap, +exec sponsor, +committed budget", detractors: "-no roadmap, -grassroots only" }
    ],
    calibration: [
      { range: "0-39", tier: "Pre-AI", desc: "Most SMBs with <6 months AI exposure" },
      { range: "40-59", tier: "Early Stage", desc: "Experimentation, limited operational integration" },
      { range: "60-74", tier: "Developing", desc: "Some production use, governance gaps, inconsistent adoption" },
      { range: "75-84", tier: "Advancing", desc: "Operational integration, measurable outcomes, some governance" },
      { range: "85-100", tier: "Leading", desc: "Enterprise-grade governance, measurable ROI, documented playbooks" }
    ],
    taskSpec: {
      pass1: null,
      pass2: "Score each dimension 0-100 with key_evidence and finding. Calculate weighted composite. Assign maturity_tier. Identify 5 gaps (ranked by ROI impact), 3 quick_wins (<30 days, zero budget), 90-day roadmap (3 phases), exec_summary (3-4 sentences for a non-technical reader)."
    },
    tests: [
      { type: "happy", desc: "Complete 30-response set, clear patterns (strong governance, weak measurement) — composite = weighted average ±2pt" },
      { type: "edge", desc: "Weak responses, generic answers — composite ≤ 45. Red flag if ≥60 on weak inputs (calibration not holding)" },
      { type: "adversarial", desc: "Client self-rates 5/5 on Likert, but free text reveals no docs/policy/baseline — model overrides self-report, scores 30-50" }
    ],
    gaps: [
      "30 intake questions don't exist yet — Base44 FreeAssessment form is untested end-to-end. Input format is theoretical.",
      "Calibration is theoretical — \"most SMBs score 40-65\" is a hypothesis, not FlashFusion client data. Needs recalibration after first 10-15 real audits.",
      "No handling for incomplete submissions — partial submissions silently ignored instead of flagged.",
      "Self-reported data reliability — companies consistently overrate governance, underrate measurement."
    ]
  }
];

const STATUS = {
  production: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.3)", label: "PRODUCTION" },
  draft: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.3)", label: "DRAFT" },
  spec: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", border: "rgba(168,85,247,0.3)", label: "SPEC" }
};

const TEST_TYPE = {
  happy: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#86efac", label: "HAPPY PATH" },
  edge: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", text: "#fde68a", label: "EDGE CASE" },
  adversarial: { bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)", text: "#f9a8d4", label: "ADVERSARIAL" }
};

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", textAlign: "left", background: "rgba(168,85,247,0.06)",
        border: "1px solid rgba(168,85,247,0.15)", borderRadius: 10, padding: "10px 16px",
        color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "space-between", fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600,
        transition: "all 0.15s ease"
      }}>
        <span>{title}</span>
        <span style={{ color: "#A855F7", fontSize: 16, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▸</span>
      </button>
      {open && <div style={{ padding: "14px 16px 8px", borderLeft: "2px solid rgba(168,85,247,0.2)", marginLeft: 16, marginTop: 4 }}>{children}</div>}
    </div>
  );
};

const Code = ({ children }) => (
  <pre style={{
    background: "rgba(0,0,0,0.4)", border: "1px solid rgba(168,85,247,0.15)",
    borderRadius: 8, padding: "12px 14px", fontSize: 11.5, lineHeight: 1.55,
    color: "#94a3b8", fontFamily: "JetBrains Mono, monospace", overflowX: "auto",
    whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "8px 0"
  }}>{children}</pre>
);

const Tag = ({ text, color = "#A855F7" }) => (
  <span style={{
    display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
    textTransform: "uppercase", padding: "3px 8px", borderRadius: 6,
    background: `${color}18`, color, border: `1px solid ${color}30`, marginRight: 6, marginBottom: 4
  }}>{text}</span>
);

const Pill = ({ text, style: s }) => (
  <span style={{
    display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 8px",
    borderRadius: 4, background: s.bg, color: s.text, border: `1px solid ${s.border}`,
    letterSpacing: "0.05em", textTransform: "uppercase"
  }}>{text}</span>
);

const Gap = ({ text }) => (
  <div style={{
    display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8,
    padding: "8px 10px", background: "rgba(244,114,182,0.04)",
    border: "1px solid rgba(244,114,182,0.1)", borderRadius: 8
  }}>
    <span style={{ color: "#F472B6", fontSize: 12, flexShrink: 0, marginTop: 1 }}>⚠</span>
    <span style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{text}</span>
  </div>
);

export default function FFPromptRegistry() {
  const [active, setActive] = useState("01");
  const prompt = PROMPTS.find(p => p.id === active);
  const st = STATUS[prompt.status];

  return (
    <div style={{
      minHeight: "100vh", background: "#0F0618", color: "#F8FAFC",
      fontFamily: "Inter, system-ui, sans-serif", padding: 0
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F0618; }
        ::-webkit-scrollbar-thumb { background: #251443; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(168,85,247,0.08) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(168,85,247,0.15)", padding: "28px 24px 20px"
      }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#A855F7", padding: "3px 10px", borderRadius: 20,
              background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)"
            }}>FlashFusion</span>
            <span style={{ fontSize: 10, color: "#64748B", letterSpacing: "0.05em" }}>PROMPT REGISTRY v2.0</span>
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Production Prompt Library
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4, lineHeight: 1.5 }}>
            Three prompts documented from source. Each grounded in a real file in this project.
          </p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PROMPTS.map(p => {
            const s = STATUS[p.status];
            const isActive = p.id === active;
            return (
              <button key={p.id} onClick={() => setActive(p.id)} style={{
                background: isActive ? "rgba(168,85,247,0.15)" : "rgba(15,6,24,0.6)",
                border: `1px solid ${isActive ? "rgba(168,85,247,0.4)" : "rgba(168,85,247,0.1)"}`,
                borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                transition: "all 0.15s", flex: "1 1 200px", textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#A855F7", fontWeight: 600 }}>{p.id}</span>
                  <Pill text={s.label} style={s} />
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: isActive ? "#F8FAFC" : "#94a3b8" }}>{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 24px 60px" }}>

        {/* Header card */}
        <div style={{
          background: "rgba(15,6,24,0.6)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: "20px 22px", marginBottom: 20
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>{prompt.name}</h2>
                <Pill text={st.label} style={st} />
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, maxWidth: 600 }}>{prompt.summary}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 150 }}>
              {[
                ["Source", prompt.source],
                ["Model", prompt.model],
                ["Version", `v${prompt.version}`],
                ["Cost", prompt.cost],
                ["Latency", prompt.latency],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 11, color: "#CBD5E1", fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <Section title="System Prompt / Role" defaultOpen={true}>
          {prompt.systemPrompt.pass1 && (
            <div style={{ marginBottom: 12 }}>
              <Tag text="Pass 1" />
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginTop: 6 }}>{prompt.systemPrompt.pass1}</p>
            </div>
          )}
          <div>
            {prompt.systemPrompt.pass1 && <Tag text="Pass 2" />}
            <Code>{prompt.systemPrompt.pass2}</Code>
            <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, fontStyle: "italic" }}>{prompt.systemPrompt.pass2Note}</p>
          </div>
        </Section>

        {/* Task Specification */}
        <Section title="Task Specification">
          {prompt.taskSpec.pass1 && (
            <div style={{ marginBottom: 14 }}>
              <Tag text="Pass 1" />
              <Code>{prompt.taskSpec.pass1}</Code>
            </div>
          )}
          <div>
            {prompt.taskSpec.pass1 && <Tag text="Pass 2" />}
            <Code>{prompt.taskSpec.pass2}</Code>
          </div>
        </Section>

        {/* Prompt-specific sections */}
        {prompt.causes && (
          <Section title="Three Root Causes Framework">
            {prompt.causes.map(c => (
              <div key={c.num} style={{
                background: "rgba(0,0,0,0.2)", border: "1px solid rgba(168,85,247,0.1)",
                borderRadius: 10, padding: "14px 16px", marginBottom: 10
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 700,
                    background: "rgba(168,85,247,0.2)", color: "#A855F7"
                  }}>{c.num}</span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  <Tag text={c.service} color="#22D3EE" />
                </div>
                <div style={{ fontSize: 12, color: "#CBD5E1", marginBottom: 6, lineHeight: 1.5 }}>
                  <strong style={{ color: "#F472B6" }}>Signal: </strong>{c.signal}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>
                  <strong style={{ color: "#94a3b8" }}>Source: </strong>{c.source}
                </div>
              </div>
            ))}
          </Section>
        )}

        {prompt.dimensions && (
          <Section title="Six Scoring Dimensions">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
              {prompt.dimensions.map((d, i) => (
                <div key={i} style={{
                  background: "rgba(0,0,0,0.2)", border: "1px solid rgba(168,85,247,0.1)",
                  borderRadius: 10, padding: "12px 14px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600, color: "#F8FAFC" }}>{d.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#A855F7", fontFamily: "JetBrains Mono, monospace" }}>{d.weight}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 2 }}>{d.drivers}</div>
                  <div style={{ fontSize: 11, color: "#f87171" }}>{d.detractors}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {prompt.calibration && (
          <Section title="Calibration Benchmark">
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 10, lineHeight: 1.5, fontStyle: "italic" }}>
              Most SMB clients score 40-65 at first Lumina assessment. Without this anchor, Claude compresses all scores to 60-72.
            </p>
            {prompt.calibration.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "6px 0",
                borderBottom: i < prompt.calibration.length - 1 ? "1px solid rgba(168,85,247,0.06)" : "none"
              }}>
                <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#A855F7", fontWeight: 600, minWidth: 50 }}>{c.range}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F8FAFC", minWidth: 90 }}>{c.tier}</span>
                <span style={{ fontSize: 11, color: "#64748B" }}>{c.desc}</span>
              </div>
            ))}
          </Section>
        )}

        {prompt.variables && (
          <Section title="Key Variables">
            {prompt.variables.map((v, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <code style={{ fontSize: 12, color: "#22D3EE", fontFamily: "JetBrains Mono, monospace" }}>{`{${v.name}}`}</code>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, lineHeight: 1.5 }}>{v.effect}</p>
              </div>
            ))}
          </Section>
        )}

        {prompt.apiConfig && (
          <Section title="API Configuration">
            {prompt.apiConfig.map((c, i) => (
              <div key={i} style={{
                background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 8,
                border: "1px solid rgba(168,85,247,0.08)"
              }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <Tag text={c.pass} />
                  <Tag text={`max_tokens: ${c.maxTokens}`} color="#22D3EE" />
                  <Tag text={`tools: ${c.tools}`} color="#F472B6" />
                </div>
                <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{c.note}</p>
              </div>
            ))}
          </Section>
        )}

        {prompt.guard && (
          <Section title="Client-Side Guard">
            <Code>{prompt.guard}</Code>
            <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, fontStyle: "italic" }}>{prompt.guardNote}</p>
          </Section>
        )}

        {prompt.fragilities && (
          <Section title="Known Fragilities">
            {prompt.fragilities.map((f, i) => (
              <div key={i} style={{
                fontSize: 12, color: "#CBD5E1", lineHeight: 1.5, marginBottom: 8,
                paddingLeft: 12, borderLeft: "2px solid rgba(251,191,36,0.3)"
              }}>{f}</div>
            ))}
          </Section>
        )}

        {/* Testing */}
        <Section title="Testing Strategy">
          {prompt.tests.map((t, i) => {
            const tt = TEST_TYPE[t.type];
            return (
              <div key={i} style={{
                background: tt.bg, border: `1px solid ${tt.border}`,
                borderRadius: 8, padding: "10px 14px", marginBottom: 8
              }}>
                <Pill text={tt.label} style={{ bg: "transparent", text: tt.text, border: tt.border }} />
                <p style={{ fontSize: 12, color: "#CBD5E1", marginTop: 6, lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            );
          })}
        </Section>

        {/* Gaps */}
        <Section title="Gaps & Blindspots">
          {prompt.gaps.map((g, i) => <Gap key={i} text={g} />)}
        </Section>

      </div>
    </div>
  );
}
