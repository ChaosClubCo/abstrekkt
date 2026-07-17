import React, { useState, useMemo } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Terminal, Compass } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month prompt engineering + Google AI Studio mastery arc
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'GROUND TRUTH',
    subtitle: 'Establish rigor. Build the evaluation mindset.',
    months: [
      {
        n: 1,
        title: 'Prompt engineering as a discipline',
        why: 'Before any platform, treat prompts as engineered artifacts with tests, not incantations.',
        weeks: [
          'Rebuild vocabulary: context vs. prompt vs. instruction vs. system message. Write your own definitions.',
          'Advanced patterns: CoT, few-shot, self-consistency, role-based, task decomposition. One example each, from your own work.',
          'Structured output comparative: JSON mode, Pydantic/Zod schemas, grammars. Same task, three providers.',
          'Build your first eval harness: 20 prompts, pass/fail rubric, version-controlled.',
        ],
        gate: 'You can defend any prompt with evidence, not aesthetics.',
      },
      {
        n: 2,
        title: 'Gemini API fundamentals via AI Studio',
        why: 'Leave the playground. Make Gemini a first-class citizen in your stack.',
        weeks: [
          'AI Studio tour: model lineup, safety settings, token counter, get/generate APIs.',
          'SDK integration (Python + JS). First production call from n8n or a Cloudflare Worker.',
          'System instructions, temperature/top-k/top-p calibration. Document what actually moves output.',
          'Migrate one existing Claude prompt to Gemini. Diff results. Write the migration notes.',
        ],
        gate: 'Ship one working Gemini-powered feature inside FlashFusion or Intinc.',
      },
      {
        n: 3,
        title: 'Structured output + function calling',
        why: 'This is where production agents live or die. Learn both providers cold.',
        weeks: [
          'response_schema deep dive. Pydantic/Zod-first authoring workflow.',
          'Function calling: single tool, multi-tool, parallel tool use.',
          'Gemini vs. Claude tool-use bake-off: latency, reliability, schema adherence, cost per turn.',
          'Build a provider-agnostic tool-calling agent. Same logic, two backends.',
        ],
        gate: 'Portable agent pattern documented and runnable on either provider.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'BUILD MUSCLE',
    subtitle: 'Move from fundamentals into applied agentic patterns.',
    months: [
      {
        n: 4,
        title: 'Agentic prompting patterns',
        why: 'Single-shot is done. Multi-step, reflection, and recovery are the real skill.',
        weeks: [
          'ReAct, plan-and-execute, reflection loops. Implement each from scratch before reaching for a framework.',
          'Thinking models: Gemini Thinking vs. Claude extended thinking. When does reasoning budget pay off?',
          'Error handling, retries, fallback chains. Fail modes you will actually see in prod.',
          'Build a 3-step agent with guardrails. Instrument it.',
        ],
        gate: 'Your agent recovers from its own mistakes at least 80% of the time.',
      },
      {
        n: 5,
        title: 'Context engineering + long context',
        why: 'Context caching is the single biggest cost lever in Gemini. Most people miss it.',
        weeks: [
          'Context windows in practice: what fits, what retrieves better, when to chunk.',
          'Gemini context caching: how it works, when it pays back, how to monitor hit rate.',
          'Files API: documents, images, video, audio. Pick one non-text modality and ship something.',
          'Long-doc agent comparison: 1M+ tokens full-context vs. retrieval. Measure and decide.',
        ],
        gate: 'Cost model for long-context workloads, in a spreadsheet, defensible to Daniel.',
      },
      {
        n: 6,
        title: 'Evaluation + red-teaming',
        why: 'This connects to your AppSec/SecAI+ track. Dual-purpose month.',
        weeks: [
          'Promptfoo or LangSmith. Pick one, learn it deeply. Stop rotating tools.',
          'LLM-as-judge patterns. Rubric design. Inter-rater reliability.',
          'OWASP LLM Top 10 as a red-team checklist. Run it against your own prompts.',
          'Jailbreak resistance + safety setting tuning. Document the tradeoffs.',
        ],
        gate: 'Public write-up: "What I broke in my own prompts." The Prompt edition-worthy.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GO WIDE',
    subtitle: 'Platform mastery. Vertex AI ramp. Provider portability.',
    months: [
      {
        n: 7,
        title: 'Vertex AI ramp (GCP foundation)',
        why: 'This is the 3–6 month GCP ramp you already flagged. Start it here, not later.',
        weeks: [
          'GCP fundamentals: IAM, projects, billing, quotas. Mirror what you know from Azure.',
          'Vertex AI vs. AI Studio. Decision matrix for when to use which.',
          'Model Garden + deployment basics. Endpoint vs. serverless.',
          'First Google ML Engineer practice exam. Record baseline score honestly.',
        ],
        gate: 'Baseline cert score recorded. Gap list written.',
      },
      {
        n: 8,
        title: 'Advanced Gemini features',
        why: 'The features nobody else is using yet. Early-mover differentiation.',
        weeks: [
          'Grounding with Google Search. Measure when it helps and when it hurts.',
          'Live API (multimodal streaming). Prototype one voice or video use case.',
          'Code execution tool. Compare to Claude code interpreter behavior.',
          'Batch API for cost-heavy workflows. Plug into one real job.',
        ],
        gate: 'One advanced feature shipped in production, not in a demo.',
      },
      {
        n: 9,
        title: 'Multi-provider + prompt versioning',
        why: 'The discipline that separates hobbyist from platform-aware practitioner.',
        weeks: [
          'Prompt portability layers (BAML, Inspect, LangChain abstractions). Weigh tradeoffs honestly.',
          'Prompt versioning in git. Eval regression tests on every change.',
          'Cost/latency/quality routing between Gemini, Claude, GPT. Write the router.',
          'Build a provider-agnostic prompt library for your own use across lanes.',
        ],
        gate: 'Switching providers is a config change, not a rewrite.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SHIP + TEACH',
    subtitle: 'Synthesis. Cert. Publish. Teach what you know.',
    months: [
      {
        n: 10,
        title: 'Capstone build',
        why: 'Everything before this was practice. This is the proof.',
        weeks: [
          'Spec a real production system. FlashFusion agent, newsletter automation, or Intinc internal tool.',
          'Build it. Real data, real users, real failure modes.',
          'Evaluate it with the harness from Month 1. Ship with monitoring.',
          'Write the architecture decision record. This becomes a portfolio artifact.',
        ],
        gate: 'System running in production with telemetry and a rollback plan.',
      },
      {
        n: 11,
        title: 'Google Professional ML Engineer cert',
        why: 'Already on your list. This is the month to close it.',
        weeks: [
          'Practice exam loops. Rotate question pools.',
          'Address remaining gaps: pipelines, feature stores, MLOps concepts.',
          'Schedule the exam. Public commitment to yourself.',
          'Take it. Pass it.',
        ],
        gate: 'Cert in hand. Second GCP credential warranted? Decide.',
      },
      {
        n: 12,
        title: 'Teach + publish',
        why: 'You do not own knowledge until you can transfer it without the safety net.',
        weeks: [
          'Synthesize: what actually changed in your mental model over 12 months?',
          'Publish a prompt engineering guide. LinkedIn series or Substack, your choice.',
          'Run one workshop: "Gemini vs. Claude for technical teams" — at CLC or Intinc.',
          'Retrospective. What is the next 12-month arc? (Advanced Architect? Deeper MLOps? Pivot?)',
        ],
        gate: 'You can teach this. You have credible, current, shipped work to point to.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — inline to avoid Tailwind compiler issues
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0a0d0b;
  --bg-2: #0f1311;
  --fg: #ede7d3;
  --fg-dim: #a8a28e;
  --lime: #c6f432;
  --amber: #ff6b35;
  --muted: #5a6259;
  --card: #141816;
  --border: #232a25;
  --border-bright: #3a4338;
}

body, .arc-root {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(198, 244, 50, 0.06), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255, 107, 53, 0.04), transparent 70%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

/* ---- HEADER ---- */
.header-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: end;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}
.kicker {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: var(--lime);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0;
  font-weight: 400;
  color: var(--fg);
}
.title-serif em { color: var(--lime); font-style: italic; }
.title-sub {
  font-size: 13px;
  color: var(--fg-dim);
  margin: 16px 0 0;
  max-width: 54ch;
}
.meta {
  text-align: right;
  font-size: 11px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.meta strong { color: var(--lime); font-weight: 500; }

/* ---- TRADEOFF CALLOUT ---- */
.tradeoff {
  border: 1px solid var(--amber);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(255, 107, 53, 0.08), rgba(255, 107, 53, 0.01));
  padding: 20px 24px;
  margin-bottom: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--amber); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--amber);
  font-weight: 400;
}
.tradeoff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
  font-size: 12.5px;
}
.tradeoff-grid h4 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--fg-dim);
  margin: 0 0 6px;
}
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }

/* ---- QUARTER TABS ---- */
.quarter-rail {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 40px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.qtab {
  padding: 20px 18px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  text-align: left;
  color: var(--fg-dim);
  transition: background 0.2s, color 0.2s;
  font-family: 'JetBrains Mono', monospace;
  position: relative;
}
.qtab:last-child { border-right: none; }
.qtab:hover { background: var(--bg-2); color: var(--fg); }
.qtab.active { color: var(--fg); background: var(--bg-2); }
.qtab.active::before {
  content: '';
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 2px;
  background: var(--lime);
}
.qtab-num {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--lime);
  text-transform: uppercase;
}
.qtab-phase {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.1;
  margin: 6px 0 4px;
  color: inherit;
  font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub {
  font-size: 11px;
  color: var(--fg-dim);
  line-height: 1.4;
}

/* ---- MONTH CARDS ---- */
.months {
  display: grid;
  gap: 16px;
}
.month {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 0.2s;
}
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--lime); }

.month-head {
  padding: 20px 24px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  align-items: center;
  user-select: none;
}
.month-num {
  font-family: 'Instrument Serif', serif;
  font-size: 48px;
  line-height: 1;
  color: var(--lime);
  font-style: italic;
  font-weight: 400;
}
.month-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--fg);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.month-why {
  font-size: 12px;
  color: var(--fg-dim);
  margin: 0;
  max-width: 64ch;
}
.month-chev {
  color: var(--fg-dim);
  transition: transform 0.25s;
}
.month.open .month-chev { transform: rotate(90deg); color: var(--lime); }

.month-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.month.open .month-body { max-height: 800px; }

.month-body-inner {
  padding: 4px 24px 24px;
  border-top: 1px dashed var(--border);
  margin-top: 4px;
}

.weeks {
  display: grid;
  gap: 8px;
  margin: 16px 0 20px;
}
.week {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 10px 12px;
  background: var(--bg-2);
  border-left: 2px solid var(--border-bright);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--lime); }
.week.done {
  border-left-color: var(--lime);
  background: rgba(198, 244, 50, 0.04);
}
.week-label {
  font-size: 10px;
  color: var(--fg-dim);
  letter-spacing: 0.14em;
  padding-top: 3px;
  white-space: nowrap;
}
.week-text {
  font-size: 12.5px;
  color: var(--fg);
  line-height: 1.55;
}
.week.done .week-text {
  color: var(--fg-dim);
  text-decoration: line-through;
  text-decoration-color: rgba(198, 244, 50, 0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--lime); }

.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed var(--amber);
  background: rgba(255, 107, 53, 0.04);
  align-items: start;
}
.gate-icon { color: var(--amber); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--amber);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

/* ---- PROGRESS BAR ---- */
.progress-wrap {
  position: sticky;
  top: 0;
  background: var(--bg);
  padding: 12px 0 16px;
  margin-bottom: 24px;
  z-index: 10;
  border-bottom: 1px solid var(--border);
}
.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.progress-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--fg-dim);
  text-transform: uppercase;
}
.progress-val {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--lime);
}
.progress-track {
  height: 2px;
  background: var(--border);
  position: relative;
  overflow: hidden;
}
.progress-fill {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  background: var(--lime);
  transition: width 0.4s ease;
}

/* ---- CLAIMS FOOTER ---- */
.claims {
  margin-top: 72px;
  padding: 24px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  font-size: 11.5px;
  color: var(--fg-dim);
  line-height: 1.7;
}
.claims h4 {
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--fg);
  text-transform: uppercase;
  margin: 0 0 10px;
}
.claims code {
  color: var(--lime);
  background: rgba(198, 244, 50, 0.08);
  padding: 1px 6px;
  font-size: 11px;
}
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

/* ---- stagger entrance ---- */
@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.stagger > * {
  opacity: 0;
  animation: rise 0.55s ease forwards;
}
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.12s; }
.stagger > *:nth-child(3) { animation-delay: 0.2s; }
.stagger > *:nth-child(4) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .tradeoff-grid { grid-template-columns: 1fr; }
  .quarter-rail { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; }
  .month-num { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function MasteryArc() {
  const [activeQ, setActiveQ] = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done, setDone] = useState(new Set());

  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);

  const toggleWeek = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Terminal size={12} /> Learning Ops // Personal Brand Lane</p>
              <h1 className="title-serif">
                The <em>Gemini</em> Arc.
              </h1>
              <p className="title-sub">
                12 months. Prompt engineering as a discipline. Google AI Studio + Vertex to mastery.
                Four phases, twelve months, forty-eight weekly sprints, twelve gated checkpoints.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert target: <strong>GCP ML Engineer, M11</strong></div>
            </div>
          </div>

          {/* TRADEOFF CALLOUT — per standing instruction */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — read this before you commit.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                This arc pulls time and attention away from your current Claude-heavy focus
                (Architect cert, Community Ambassador, FlashFusion). Not a reason to skip it — a reason
                to see the math clearly.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Second platform credential (GCP ML Engineer) — already on your list</li>
                    <li>Prompt engineering as a transferable discipline, not a Claude-specific habit</li>
                    <li>Provider portability → Partner Network positioning ("we do multi-model")</li>
                    <li>Gemini context caching + grounding are genuine cost/quality levers</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>~4–6 hrs/week that would otherwise compound on Claude depth</li>
                    <li>Risk of diluting your "Claude practitioner" personal brand mid-build</li>
                    <li>Q1–Q2 of this arc overlaps with Architect Foundations exam window — collision risk</li>
                    <li>Google ecosystem fluency is a 3–6 month ramp, not a side project</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Recommended sequencing:</strong> finish
                Architect Foundations before starting M2 of this arc. Don't run both exams in parallel.
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* QUARTER TABS */}
          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button
                key={q.quarter}
                className={`qtab ${i === activeQ ? 'active' : ''}`}
                onClick={() => setActiveQ(i)}
              >
                <div className="qtab-num">{q.quarter} · Months {q.months[0].n}–{q.months[q.months.length - 1].n}</div>
                <div className="qtab-phase">{q.phase}</div>
                <div className="qtab-sub">{q.subtitle}</div>
              </button>
            ))}
          </div>

          {/* MONTHS */}
          <div className="months">
            {quarter.months.map((m) => {
              const isOpen = openMonth === m.n;
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div
                    className="month-head"
                    onClick={() => setOpenMonth(isOpen ? null : m.n)}
                  >
                    <div className="month-num">M{String(m.n).padStart(2, '0')}</div>
                    <div>
                      <h3 className="month-title">{m.title}</h3>
                      <p className="month-why">{m.why}</p>
                    </div>
                    <ChevronRight className="month-chev" size={20} />
                  </div>
                  <div className="month-body">
                    <div className="month-body-inner">
                      <div className="weeks">
                        {m.weeks.map((w, wi) => {
                          const key = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          return (
                            <div
                              key={key}
                              className={`week ${isDone ? 'done' : ''}`}
                              onClick={() => toggleWeek(key)}
                            >
                              <span className="week-label">W{wi + 1}</span>
                              <span className="week-text">{w}</span>
                              {isDone ? (
                                <CheckCircle2 size={16} className="week-check" />
                              ) : (
                                <Circle size={16} className="week-check" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Checkpoint gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CLAIMS FOOTER */}
          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> CLAIMS &amp; ASSUMPTIONS</h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Load assumption:</strong> ~4–6 hrs/week sustained. If your real load
                is 2–3 hrs, stretch this to 18–24 months and cut the capstone scope, not the eval rigor.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Tool lock-in:</strong> I recommended picking <code>promptfoo</code> OR <code>LangSmith</code>.
                Not both. If you already have a preference, ignore the recommendation and commit.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Model-state volatility:</strong> Gemini model names, feature availability,
                and pricing move quarterly. Re-check current model list at the start of each month, not now.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Cert exam scope:</strong> Google Professional ML Engineer content is updated
                periodically. Pull the current exam guide before M7, not from any stale study set.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Capstone is the artifact:</strong> If you only do one thing from this arc,
                do the Month 10 capstone and its ADR. That is what recruiters, Partner Network reviewers,
                and Daniel will look at — not your checkbox count.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Progress state:</strong> Checkbox progress is kept in memory only (React state).
                Refreshing the page clears it. By design — this is a planning artifact, not a tracker. If you want
                persistent tracking, move this into Notion or Craft with a weekly review cadence.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
