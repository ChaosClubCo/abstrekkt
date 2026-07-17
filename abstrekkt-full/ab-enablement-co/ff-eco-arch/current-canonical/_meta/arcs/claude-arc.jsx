import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Terminal, Compass } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Anthropic / Claude mastery arc
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'GROUND TRUTH',
    subtitle: 'Close known gaps. Pass Architect Foundations. Cement the base.',
    months: [
      {
        n: 1,
        title: 'Close the exam gaps',
        why: 'You already know what you do not know. Time to fix it before the exam window closes the early-mover edge.',
        weeks: [
          'Gap audit week: Agent SDK (Task tool, hooks, fork_session), CLAUDE.md hierarchy, MCP scoping, Message Batches API.',
          'Hands-on Agent SDK: rebuild every example from docs from scratch. No copy-paste.',
          'MCP scoping deep dive — write a one-pager you could teach from.',
          'Mock exam loop. Score honestly. Identify the last 10% of weakness.',
        ],
        gate: 'Sit Claude Certified Architect Foundations. Pass at ≥720/1000.',
      },
      {
        n: 2,
        title: 'Tool design at production grade',
        why: 'This is where most agents fail in prod. Make tool interfaces a craft.',
        weeks: [
          'Tool interface design principles: shape, naming, error semantics, idempotency.',
          'Structured output mastery: XML, JSON mode, response_format, tool_choice.',
          'Error shapes + retry loops + CI/CD flags for tool-using agents.',
          'Build a 5-tool agent with a full eval harness. 100 adversarial inputs.',
        ],
        gate: 'A tool agent that survives 100 adversarial inputs without breaking.',
      },
      {
        n: 3,
        title: 'Plan mode, few-shot, escalation',
        why: 'Production agents fail gracefully. They ask for help. They do not just retry forever.',
        weeks: [
          'Plan mode: when it pays, when it costs more than it returns.',
          'Few-shot orchestration patterns. Selecting examples that actually move behavior.',
          'Escalation patterns: when the agent should stop and hand off to a human.',
          'Build a plan-and-execute agent with explicit escalation paths.',
        ],
        gate: 'An agent that fails gracefully and asks for help — not just retries.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'BUILD MUSCLE',
    subtitle: 'Agent SDK depth. MCP authorship. Skills mastery.',
    months: [
      {
        n: 4,
        title: 'Agent SDK depth',
        why: 'The Agent SDK is the rare-skill differentiator inside the Claude ecosystem right now.',
        weeks: [
          'Task tool: when to spawn, how to compose, when not to.',
          'Hooks lifecycle: pre, post, error. Build three useful ones.',
          'fork_session strategies: parallel exploration vs. context isolation.',
          'Sub-agents + delegation. Build a parent/child system with separate context.',
        ],
        gate: 'A multi-agent system where parent and child have measurably separate context.',
      },
      {
        n: 5,
        title: 'MCP server authorship',
        why: 'You have used 50+ connectors. Time to write your own and own the abstraction.',
        weeks: [
          'Build your first MCP server. Local. Working. Tested.',
          'Auth patterns + tool design for MCP. Service auth, OAuth, scoped tokens.',
          'Multi-server orchestration. Compose three of your own MCP servers in one Claude session.',
          'Publish one MCP server you actually use weekly to the registry.',
        ],
        gate: 'One MCP server live, public, used by you in production.',
      },
      {
        n: 6,
        title: 'Skills + Claude Code workflows',
        why: 'Your skill library already exists. Make it elite.',
        weeks: [
          'Skill authoring: gerund naming, progressive disclosure, trigger phrase density.',
          'skill-rules.json + hooks + SLASH commands. The full surface area.',
          'Claude Code subagents — when to use, how to scope.',
          'Audit your existing skills. Cut the bottom 30%. Promote the top 3.',
        ],
        gate: 'Three production skills you genuinely use weekly. The rest archived.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GO WIDE',
    subtitle: 'Orchestration. Evaluation. Safety as your AppSec edge.',
    months: [
      {
        n: 7,
        title: 'Multi-agent orchestration',
        why: 'Patterns most engineers reach for badly. You will reach for them well.',
        weeks: [
          'Orchestrator/worker patterns. When the overhead pays back.',
          'Routing patterns: model-as-router vs. code-as-router.',
          'Map-reduce for agents. Long-running state management.',
          'Ship a multi-agent system at Intinc OR FlashFusion.',
        ],
        gate: 'A multi-agent system shipped, instrumented, and recoverable.',
      },
      {
        n: 8,
        title: 'Evaluation + observability',
        why: 'You cannot improve what you cannot measure. This is the discipline gap.',
        weeks: [
          'Eval harness for agents (not just prompts). Trace-level evaluation.',
          'LLM-as-judge for agent traces. Rubric design + inter-rater reliability.',
          'Observability stack: Langfuse, Helicone, or a custom roll-up. Pick one.',
          'Prompt + agent versioning in git. Regression tests on every change.',
        ],
        gate: 'You can answer "did this change make it better or worse?" with data.',
      },
      {
        n: 9,
        title: 'Constitutional AI + safety as your edge',
        why: 'This is where AppSec Kyle becomes "the rare AI engineer who actually understands safety."',
        weeks: [
          'Constitutional AI mental model. Read the papers. Internalize.',
          'OWASP LLM Top 10 against your own production Claude builds.',
          'Jailbreak resistance + prompt-injection hardening. Test it.',
          'Multi-tenant isolation patterns for agentic Claude. Document the playbook.',
        ],
        gate: 'A red-team report on your own production agent. Make it public.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SHIP + TEACH',
    subtitle: 'Capstone. Advanced credential. Teach the playbook.',
    months: [
      {
        n: 10,
        title: 'Capstone — flagship multi-agent system',
        why: 'The artifact every Partner Network reviewer and every future hire will look at.',
        weeks: [
          'Spec a flagship system. Real users. Real failure modes. Real scope.',
          'Build it at Intinc OR FlashFusion. Real data, real telemetry.',
          'Production telemetry + rollback plan. Run a chaos test.',
          'Architecture Decision Record + post-mortem. Public-shareable.',
        ],
        gate: 'Running in production. Telemetry shareable. ADR linked from your bio.',
      },
      {
        n: 11,
        title: 'Advanced cert OR specialization deepening',
        why: 'When Anthropic releases the advanced track, you are first in line. Until then, deepen.',
        weeks: [
          'If advanced track is live: practice exam loop. Close gaps. Sit it.',
          'If not: pick a depth lane (agentic systems architect, evaluation, safety) and ship a public artifact.',
          'Either path: produce one piece of definitive content in that lane.',
          'Sit exam OR publish artifact.',
        ],
        gate: 'Second Anthropic credential OR equivalent shipped artifact with reach.',
      },
      {
        n: 12,
        title: 'Teach + publish the playbook',
        why: 'You do not own knowledge until you can transfer it without notes.',
        weeks: [
          'Run a workshop at CLC — your Community Ambassador anchor event.',
          'Record a talk for The Prompt + LinkedIn distribution.',
          'Write the playbook ("How I built X with Claude") — long-form.',
          'Retrospective. Define Y2 arc: deeper Claude vs. broader portfolio.',
        ],
        gate: 'You teach this without notes. Three people are using your patterns.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — Claude / terracotta variant
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0d0a08;
  --bg-2: #14110d;
  --fg: #f0e6d2;
  --fg-dim: #a89b80;
  --accent: #e07856;
  --accent-2: #f0a574;
  --warn: #d9a441;
  --muted: #5a5044;
  --card: #1a1612;
  --border: #2a241d;
  --border-bright: #3d342a;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224, 120, 86, 0.08), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(217, 164, 65, 0.04), transparent 70%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

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
  color: var(--accent);
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
.title-serif em { color: var(--accent); font-style: italic; }
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
.meta strong { color: var(--accent); font-weight: 500; }

.tradeoff {
  border: 1px solid var(--warn);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(217, 164, 65, 0.08), rgba(217, 164, 65, 0.01));
  padding: 20px 24px;
  margin-bottom: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--warn); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--warn);
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
  background: var(--accent);
}
.qtab-num {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--accent);
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

.months { display: grid; gap: 16px; }
.month {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 0.2s;
}
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--accent); }

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
  color: var(--accent);
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
.month-chev { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 800px; }
.month-body-inner {
  padding: 4px 24px 24px;
  border-top: 1px dashed var(--border);
  margin-top: 4px;
}

.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
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
.week:hover { border-left-color: var(--accent); }
.week.done {
  border-left-color: var(--accent);
  background: rgba(224, 120, 86, 0.06);
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
  text-decoration-color: rgba(224, 120, 86, 0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed var(--warn);
  background: rgba(217, 164, 65, 0.04);
  align-items: start;
}
.gate-icon { color: var(--warn); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--warn);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

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
  color: var(--accent);
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
  background: var(--accent);
  transition: width 0.4s ease;
}

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
  color: var(--accent);
  background: rgba(224, 120, 86, 0.1);
  padding: 1px 6px;
  font-size: 11px;
}
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
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

export default function ClaudeArc() {
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

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Terminal size={12} /> Learning Ops // Personal Brand Lane</p>
              <h1 className="title-serif">The <em>Claude</em> Arc.</h1>
              <p className="title-sub">
                12 months. The deepening play. From Architect Foundations through Agent SDK,
                MCP authorship, multi-agent orchestration, and a public capstone. Four phases,
                forty-eight weekly sprints, twelve gated checkpoints.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert target: <strong>Architect Foundations, M1</strong></div>
            </div>
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — the deepening play comes with single-vendor risk.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                This arc compounds your existing investment. That is its strength and its weakness.
                Read both columns before committing.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Architect Foundations cert closes a real early-mover credibility window</li>
                    <li>Agent SDK + MCP authorship is rare-skill territory — measurable differentiation</li>
                    <li>Direct support for both Partner Network and Community Ambassador positioning</li>
                    <li>Compounds on 12+ months of existing Claude-in-production work</li>
                    <li>Constitutional AI + safety lens leverages your AppSec edge — almost no one has this combo</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>Single-vendor dependency. Pricing, policy, and roadmap shifts hit you harder</li>
                    <li>"Claude expert" without multi-model fluency reads naive at enterprise scale</li>
                    <li>Opportunity cost of not building Gemini or OpenAI fluency at the same time</li>
                    <li>Personal brand keeps narrowing — harder to pivot if Anthropic strategy shifts</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Recommended sequencing:</strong> this is your default
                lane. The question is not whether to do it, but whether to do <em>only</em> this. Pair with
                one other arc (Gemini or OpenAI), not both.
              </p>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

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

          <div className="months">
            {quarter.months.map((m) => {
              const isOpen = openMonth === m.n;
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div className="month-head" onClick={() => setOpenMonth(isOpen ? null : m.n)}>
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
                              {isDone ? <CheckCircle2 size={16} className="week-check" /> : <Circle size={16} className="week-check" />}
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

          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> CLAIMS &amp; ASSUMPTIONS</h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This is NOT an additive arc.</strong> If you are also running the Gemini
                or OpenAI arc, the load assumption is ~4–6 hrs/week for THIS one alone. Two arcs in parallel = ~10 hrs/week minimum.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Anthropic ecosystem volatility:</strong> Agent SDK, Skills, and the cert track are
                evolving. Re-check current docs at the start of each month — last verified <code>Apr 2026</code>.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Advanced cert is conditional:</strong> Month 11 assumes the advanced track is live.
                If it is not, the alternate path (depth specialization + public artifact) is the real plan.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Capstone choice matters more than the calendar.</strong> Pick a system real users
                will touch. A flashy demo without users is the failure mode here.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Brand risk is real.</strong> If you go all-in on Claude AND your Partner Network app
                gets rejected AND Architect Foundations slips, you have concentration risk. Pair this with one model-agnostic credential.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
