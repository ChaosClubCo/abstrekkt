import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Terminal, Compass } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Microsoft Copilot mastery arc
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'GROUND TRUTH',
    subtitle: 'M365 Copilot fluency. Copilot Studio fundamentals beyond what you already ship.',
    months: [
      {
        n: 1,
        title: 'M365 Copilot fluency',
        why: 'Most of Intinc lives here. If you cannot teach Word, Excel, Outlook, and Teams Copilot cold, the AIaaS pitch dies.',
        weeks: [
          'M365 Copilot Chat patterns: work data scope, web grounding, prompt patterns by app.',
          'In-app Copilot fluency: Word drafting, Excel analysis, Outlook triage, Teams meeting recap.',
          'Copilot Pages — collaborative AI documents. Where it shines, where it fails.',
          'Onboard a 5-person team. Watch them. Document the friction.',
        ],
        gate: 'A team of 5+ daily users you personally onboarded. Adoption documented.',
      },
      {
        n: 2,
        title: 'Copilot Studio agent fundamentals — beyond what you already know',
        why: 'You shipped LastPass→Bitwarden. Now go deeper than the happy path.',
        weeks: [
          'Agent designer architecture: when to use the visual designer vs. authoring directly.',
          'Topics vs. generative answers: the strategic decision and its tradeoffs.',
          'System prompts at production grade. Channels (Teams, web, M365 Copilot).',
          'Ship one new non-trivial agent at Intinc beyond the migration agent.',
        ],
        gate: 'A second production Copilot Studio agent shipped at Intinc. Different domain.',
      },
      {
        n: 3,
        title: 'Knowledge sources mastery',
        why: 'Knowledge grounding is where most enterprise Copilot deployments fail quietly.',
        weeks: [
          'SharePoint connections: indexing, permissions, freshness. The real-world traps.',
          'Dataverse-backed knowledge: when structured data beats documents.',
          'Web sources + filtering. Allow-listing and trust patterns.',
          'Document upload patterns + versioning. Build a knowledge governance posture.',
        ],
        gate: 'An agent grounded in 4+ knowledge source types with measured retrieval quality.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'BUILD MUSCLE',
    subtitle: 'Custom agents. Plugins. Power Platform integration.',
    months: [
      {
        n: 4,
        title: 'Declarative vs. custom agents — the strategic choice',
        why: 'Pick wrong here and you are rebuilding in 6 months. This is the architecture decision that compounds.',
        weeks: [
          'Declarative agents (M365 surface): when they win.',
          'Custom agents (Copilot Studio): when the extra surface area pays back.',
          'Decision framework: cost, governance, capability, reach. Document it.',
          'Migrate one existing agent if the original choice was wrong.',
        ],
        gate: 'A decision framework Daniel could sign off on. Documented in writing.',
      },
      {
        n: 5,
        title: 'Plugins, connectors, custom actions',
        why: 'The surface area where Copilot Studio stops being a chatbot and starts being a platform.',
        weeks: [
          'Connector library: what is prebuilt, what to never trust without testing.',
          'Custom connectors: building, certifying, sharing.',
          'HTTP actions: the escape hatch when no connector exists.',
          'Auth patterns: OAuth, API keys, service principals, managed identity.',
        ],
        gate: 'Three custom connectors in production. One of them used by another team.',
      },
      {
        n: 6,
        title: 'Power Platform integration',
        why: 'Copilot Studio without Power Automate is a toy. With it, it is an enterprise automation platform.',
        weeks: [
          'Power Automate flows triggered from agents. Sync vs. async patterns.',
          'Dataverse as agent memory and state store.',
          'AI Builder for prebuilt models (form processing, sentiment, etc.).',
          'Power Apps for agent-fronting UIs. When to build one.',
        ],
        gate: 'An agent that triggers a multi-step automation across 3+ MS services.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GO WIDE',
    subtitle: 'Governance. Security. Azure AI Foundry as the graduation path.',
    months: [
      {
        n: 7,
        title: 'Governance + ALM',
        why: 'This is where enterprise Copilot Studio gets serious — and where most agencies fall flat.',
        weeks: [
          'Environments + solutions: the foundational pattern most people skip.',
          'Managed environments: when the premium pays back.',
          'CoE Starter Kit: deploy it, learn what it surfaces.',
          'Deployment pipelines from dev to test to prod with sign-offs.',
        ],
        gate: 'ALM workflow that promotes from dev to test to prod with documented sign-offs.',
      },
      {
        n: 8,
        title: 'Security + compliance for AI',
        why: 'This is your AppSec edge expressed in Microsoft language. CISOs will hire you for this.',
        weeks: [
          'Purview + DLP for Copilot. Sensitivity labels and AI inheritance.',
          'Customer Lockbox + data residency for Copilot.',
          'Audit logs for agents: what gets logged, what does not, what to alert on.',
          'Build a compliance posture document. CISO-ready.',
        ],
        gate: 'A compliance posture document you would ship to a CISO. Reviewed by Dave or Jackie.',
      },
      {
        n: 9,
        title: 'Azure AI Foundry — when to graduate',
        why: 'Knowing when Copilot Studio is the wrong tool is a more valuable skill than knowing how to use it.',
        weeks: [
          'Foundry vs. Copilot Studio: decision matrix on cost, control, capability.',
          'Prompt flow: the more code-forward authoring path.',
          'Model catalog: Anthropic, OpenAI, Mistral, others — inside Microsoft.',
          'Bring-your-own-model patterns. Migrate one workload deliberately.',
        ],
        gate: 'One workload migrated from Copilot Studio to Foundry with documented rationale.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SHIP + TEACH',
    subtitle: 'Enterprise capstone. Microsoft cert. The AIaaS playbook lands.',
    months: [
      {
        n: 10,
        title: 'Enterprise capstone — multi-agent rollout',
        why: 'The Head of AIaaS proof point. This is the artifact that justifies the role.',
        weeks: [
          'Spec the rollout. Stakeholders, success metrics, risk register.',
          'Deploy in stages. Pilot, expand, generalize.',
          'Instrument adoption: who uses it, when, for what.',
          'Manage change. Document the friction. Fix the bottom 20%.',
        ],
        gate: '50+ active users at Intinc. Adoption telemetry public to leadership.',
      },
      {
        n: 11,
        title: 'Microsoft AI cert',
        why: 'Logos matter for the AIaaS pitch. Two paths, one decision.',
        weeks: [
          'Decide path: AI-102 (Azure AI Engineer Associate, broader) vs. MB-820 (Copilot Studio Maker, focused).',
          'Practice exam loop. Track scores. Identify gaps.',
          'Close gaps. No new material in week 4.',
          'Sit the exam.',
        ],
        gate: 'MS cert in hand. Logos updated everywhere.',
      },
      {
        n: 12,
        title: 'Build the AIaaS playbook',
        why: 'Twelve months of work either becomes a service line — or it does not. This is where you make it real.',
        weeks: [
          'Synthesize the year into a service-line offering. Pricing, packaging, delivery.',
          'SOW templates. Discovery script. Implementation runbook.',
          'Pitch to Daniel + Dave + Jackie internally. Get the AIaaS dept on the roadmap.',
          'Teach it: train the next person at Intinc to do what you do.',
        ],
        gate: 'AIaaS service line proposal in front of leadership. Decision: yes, no, or pilot.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — Copilot / steel blue variant
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #08090d;
  --bg-2: #0d1018;
  --fg: #e6ebf2;
  --fg-dim: #8d99ae;
  --accent: #6ba8e8;
  --accent-2: #94c4f5;
  --warn: #f59e3b;
  --muted: #4a5568;
  --card: #11161e;
  --border: #1e2530;
  --border-bright: #2e3848;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(107, 168, 232, 0.07), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(245, 158, 59, 0.04), transparent 70%),
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
  background: linear-gradient(90deg, rgba(245, 158, 59, 0.08), rgba(245, 158, 59, 0.01));
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
  background: rgba(107, 168, 232, 0.06);
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
  text-decoration-color: rgba(107, 168, 232, 0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed var(--warn);
  background: rgba(245, 158, 59, 0.04);
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
  background: rgba(107, 168, 232, 0.1);
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

export default function CopilotArc() {
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
              <p className="kicker"><Terminal size={12} /> Learning Ops // Intinc Production Lane</p>
              <h1 className="title-serif">The <em>Copilot</em> Arc.</h1>
              <p className="title-sub">
                12 months. The paycheck lane. From M365 fluency through Copilot Studio depth,
                Power Platform integration, governance, and the AIaaS service-line pitch.
                Four phases, forty-eight weekly sprints, twelve gated checkpoints.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert target: <strong>AI-102 or MB-820, M11</strong></div>
            </div>
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — closed ecosystem, fastest ROI.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                This is where Intinc lives and where the Head of AIaaS role gets justified.
                It is also the lane with the least personal-brand portability outside MS shops.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Direct ROI on day one — every week of work has Intinc value</li>
                    <li>The clearest path to Head of AIaaS positioning</li>
                    <li>Microsoft AI cert is a recognized credential at every enterprise buyer</li>
                    <li>Copilot Studio is unbeatable for enterprise rollouts in M365 shops</li>
                    <li>Governance + security depth here makes you genuinely rare</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>Closed ecosystem — Microsoft owns the roadmap, pricing, and feature gates</li>
                    <li>Skills less portable to non-MS shops (limits FlashFusion client reach)</li>
                    <li>Personal brand muddier — "Copilot Studio expert" reads as MS partner, not AI thought leader</li>
                    <li>Pace of change is corporate, not bleeding edge — less to publish about</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Recommended sequencing:</strong> non-negotiable if Head of
                AIaaS is the goal. Run in parallel with one model-provider arc (Claude OR OpenAI), not both.
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
                <strong style={{ color: 'var(--fg)' }}>Microsoft licensing terms shift quarterly.</strong> Pricing assumptions
                in this arc are not modeled — verify Copilot Studio per-message pricing and M365 Copilot per-seat costs at Intinc's
                actual contracted tier before any rollout commits.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Cert path decision is real.</strong> <code>AI-102</code> is broader and more
                portable. <code>MB-820</code> is more focused on Copilot Studio specifically. Pick by intent, not by ease.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Foundry vs. Copilot Studio is unstable.</strong> Microsoft is actively
                rationalizing this product surface. Verify current architecture guidance at the start of M9, not now.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Capstone success depends on adoption, not features.</strong> The 50+
                user gate is a lagging indicator of doing change management well. Plan for that work explicitly in M10W3.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The AIaaS pitch in M12 is the actual deliverable.</strong> If leadership
                does not commit to the service line by M12, you have data — not failure — to inform Y2 direction.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
