import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Terminal, Compass } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month OpenAI mastery arc
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'GROUND TRUTH',
    subtitle: 'Current-state APIs. Structured outputs. Reasoning models when they earn their cost.',
    months: [
      {
        n: 1,
        title: 'Responses API + current-state fluency',
        why: 'OpenAI has multiple overlapping APIs. Pick a default, learn it cold, migrate one real prompt.',
        weeks: [
          'Map the API landscape: Responses API vs. Chat Completions vs. Assistants. Pick your default.',
          'SDK fluency in Python and JS. First production call from your stack.',
          'Migrate one Claude prompt to OpenAI. Diff outputs. Write the migration notes.',
          'Cost + latency baseline against Claude on the same task.',
        ],
        gate: 'A working OpenAI-backed feature in your stack. Not a notebook — a feature.',
      },
      {
        n: 2,
        title: 'Structured outputs + function calling, OpenAI-native',
        why: 'OpenAI structured outputs differ from Claude tool use in subtle, expensive ways. Learn the differences.',
        weeks: [
          'response_format: json_schema vs json_object. Strict mode behaviors.',
          'Tool calling: single, parallel, choice-forced. Latency implications.',
          'Schema authoring discipline: Pydantic/Zod-first, then JSON Schema export.',
          'Build a 5-tool agent with strict schema compliance. 100 adversarial inputs.',
        ],
        gate: 'A 5-tool agent with strict schema compliance under adversarial load.',
      },
      {
        n: 3,
        title: 'o-series reasoning models',
        why: 'Reasoning models unlock problem classes Claude and Gemini cannot always match. Knowing when is the skill.',
        weeks: [
          'Model selection: o-series tiers, when each makes sense.',
          'Reasoning effort tuning. The cost vs. quality curve, measured.',
          'Tasks where reasoning models beat non-reasoning by ≥20%. Identify yours.',
          'Move one real workload to a reasoning model. Document the win.',
        ],
        gate: 'One workload measurably better on a reasoning model than on standard.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'BUILD MUSCLE',
    subtitle: 'Agents SDK. Realtime API. Multimodal patterns.',
    months: [
      {
        n: 4,
        title: 'OpenAI Agents SDK',
        why: 'OpenAI\'s native agent framework. Required for any serious multi-agent OpenAI work.',
        weeks: [
          'Agents SDK primitives: agent, tool, runner, session.',
          'Handoffs and routing patterns.',
          'Sessions and state persistence.',
          'Tracing + debugging at the agent level. Build a 3-agent system with handoffs.',
        ],
        gate: 'A multi-agent system with at least two clean handoffs. Traced and recoverable.',
      },
      {
        n: 5,
        title: 'Realtime API — voice and streaming',
        why: 'OpenAI\'s Realtime API is genuinely best-in-class for voice agents. Underused even by veterans.',
        weeks: [
          'WebRTC vs. WebSocket transport. Pick by use case.',
          'Voice agent fundamentals: turn-taking, interruption, barge-in.',
          'Latency budgeting. Where the milliseconds go and how to claw them back.',
          'Ship one working voice agent prototype. Real microphone, real responses.',
        ],
        gate: 'A working voice agent prototype. Sub-700ms turn latency.',
      },
      {
        n: 6,
        title: 'Vision + multimodal',
        why: 'Vision is now table stakes. Multimodal agents are the next plateau.',
        weeks: [
          'Image input patterns. Detail levels. Token costs at high-detail mode.',
          'Image generation: gpt-image / DALL·E. When to use which.',
          'Audio in and out. STT + TTS pipelines vs. native multimodal.',
          'Ship one multimodal feature. Not a demo — a feature.',
        ],
        gate: 'A multimodal feature shipped to real users.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GO WIDE',
    subtitle: 'Fine-tuning. Evals. Provider portability.',
    months: [
      {
        n: 7,
        title: 'Fine-tuning + distillation',
        why: 'Most engineers reach for fine-tuning when prompting would have worked. Learn when it actually wins.',
        weeks: [
          'Decision framework: when fine-tuning beats prompting. The honest version.',
          'Data prep + dataset hygiene. The 80% of the work.',
          'SFT vs. DPO. Method selection by problem shape.',
          'Run one fine-tune. Evaluate against the prompted baseline.',
        ],
        gate: 'One fine-tune that beats prompting on a clear, measurable metric.',
      },
      {
        n: 8,
        title: 'OpenAI Evals + production observability',
        why: 'Without evals, every prompt change is a guess. This is the discipline gap.',
        weeks: [
          'OpenAI Evals platform. Custom graders.',
          'LLM-as-judge for OpenAI specifically. Calibration patterns.',
          'Production observability: cost telemetry, latency p95, quality drift.',
          'Build an eval suite that runs on every prompt change. CI integration.',
        ],
        gate: 'An eval suite that runs on every prompt change with regression alerts.',
      },
      {
        n: 9,
        title: 'Provider-portable patterns',
        why: 'This is where your Claude + Gemini work compounds. Multi-provider fluency is the partner-network differentiator.',
        weeks: [
          'Portability layers: BAML, Vercel AI SDK, LangChain abstractions. Honest tradeoffs.',
          'Cost / latency / quality routing. Build the policy.',
          'Build a provider router: same logic, OpenAI / Claude / Gemini backends.',
          'Document the comparison. This becomes a publishable artifact.',
        ],
        gate: 'A working provider router with documented routing policy. Switch is a config change.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SHIP + TEACH',
    subtitle: 'Multi-provider capstone. Specialization. The comparative playbook.',
    months: [
      {
        n: 10,
        title: 'Multi-provider capstone',
        why: 'The single artifact that proves you are a multi-model practitioner, not a single-vendor enthusiast.',
        weeks: [
          'Spec a system: OpenAI primary, Claude/Gemini fallback by policy.',
          'Build it. Real users. Real failure modes.',
          'Instrument cost telemetry. Tune the routing policy on real traffic.',
          'ADR + cost report. Public-shareable.',
        ],
        gate: 'Multi-provider system in production with measurable cost optimization.',
      },
      {
        n: 11,
        title: 'Specialization or recognized depth',
        why: 'OpenAI does not currently offer an official cert. Pivot to a deep specialization that produces a public artifact.',
        weeks: [
          'Pick a specialty: voice agents, fine-tuning, evals, or realtime/multimodal.',
          'Go deep. Produce a definitive artifact in that lane.',
          'Engage publicly: forum posts, GitHub repo, a workshop.',
          'Land recognition: cited, used, or referenced by someone outside your circle.',
        ],
        gate: 'Recognized depth in one OpenAI specialty. Public artifact with reach.',
      },
      {
        n: 12,
        title: 'Publish the multi-provider playbook',
        why: 'You now have Claude + Gemini + OpenAI in production. That comparative knowledge is rare. Publish it.',
        weeks: [
          'Synthesize 12+ months of cross-provider learning. The honest version.',
          'Publish: long-form guide, talk, or workshop series. Pick one channel.',
          'Run a workshop: "Claude vs. Gemini vs. OpenAI for technical teams" — at CLC, Intinc, or a meetup.',
          'Retrospective. Define Y2: deeper in one provider, or platform-agnostic architect track?',
        ],
        gate: 'A definitive multi-provider practitioner guide. Yours, public, dated, cited.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — OpenAI / mint-cyan variant
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #07100c;
  --bg-2: #0c1612;
  --fg: #e2efe9;
  --fg-dim: #8da89e;
  --accent: #5ee0c0;
  --accent-2: #8af0d6;
  --warn: #e8a85a;
  --muted: #4a5e54;
  --card: #101a16;
  --border: #1d2a24;
  --border-bright: #2c3d35;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(94, 224, 192, 0.07), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(232, 168, 90, 0.04), transparent 70%),
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
  background: linear-gradient(90deg, rgba(232, 168, 90, 0.08), rgba(232, 168, 90, 0.01));
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
  background: rgba(94, 224, 192, 0.06);
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
  text-decoration-color: rgba(94, 224, 192, 0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed var(--warn);
  background: rgba(232, 168, 90, 0.04);
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
  background: rgba(94, 224, 192, 0.1);
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

export default function OpenAIArc() {
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
              <p className="kicker"><Terminal size={12} /> Learning Ops // Portfolio Rounding Lane</p>
              <h1 className="title-serif">The <em>OpenAI</em> Arc.</h1>
              <p className="title-sub">
                12 months. The lingua franca play. From Responses API and reasoning models through
                the Agents SDK, Realtime voice, fine-tuning, and a multi-provider capstone. Four phases,
                forty-eight weekly sprints, twelve gated checkpoints.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert target: <strong>Specialization, M11</strong></div>
            </div>
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — portfolio rounding, brand dilution risk.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                OpenAI is the largest API ecosystem in AI engineering. Speaking that language opens doors.
                But this is the arc most likely to dilute your "Claude practitioner" personal brand if you
                broadcast it loud.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Most market-share platform — every enterprise buyer recognizes the name</li>
                    <li>Function calling and Realtime API are best-in-class for what they do</li>
                    <li>Provider portability story for Partner Network: "we are model-agnostic"</li>
                    <li>o-series reasoning unlocks problem classes Claude/Gemini cannot always match</li>
                    <li>Multi-provider capstone is a portfolio differentiator nobody else has</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>~4–6 hrs/week off your Claude depth — direct opportunity cost</li>
                    <li>OpenAI roadmap moves fastest — features deprecate quickly, costs ramp</li>
                    <li>"Claude practitioner" brand gets noisier if you publish OpenAI content too loudly</li>
                    <li>No official cert as of cutoff — credential payoff is via artifacts, not a logo</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Recommended sequencing:</strong> this is the round-out arc, not a primary.
                Run AFTER Claude arc Q1 closes (Architect Foundations passed). Do not start while studying for two exams.
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
                <strong style={{ color: 'var(--fg)' }}>OpenAI cert path is unstable.</strong> No official cert exists as of
                cutoff. Month 11 is structured around <code>artifact-based</code> credibility — if a cert launches mid-arc,
                redirect M11 to it.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>API surface area moves fastest in the industry.</strong> Responses API,
                Assistants API, and Chat Completions all coexist with overlapping capabilities. Pick a default in M1 and
                re-verify the choice quarterly.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Pricing volatility is real.</strong> o-series reasoning models can be
                10–60× more expensive than baseline. M3 cost analysis is the gating decision before any production rollout.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Multi-provider capstone is the actual deliverable.</strong> If you only
                ship one thing from this arc, ship M10. The router pattern + cost report is the rare-skill artifact.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Brand discipline matters.</strong> If you run this arc alongside Claude,
                publish OpenAI work under "multi-provider practitioner" framing — not as standalone OpenAI advocacy. Otherwise
                you confuse the market about what you sell.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
