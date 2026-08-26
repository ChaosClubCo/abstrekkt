import React, { useState } from 'react';
import { ChevronRight, Target, Zap, Flag, AlertCircle, TrendingUp } from 'lucide-react';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #09090f;
  --bg-2: #14141f;
  --bg-3: #1c1c2c;
  --fg: #e8e9ed;
  --fg-dim: #8a8f9a;
  --fg-mute: #555a65;
  --border: #1f1f2c;
  --border-bright: #2c2c3e;
  --accent: #7c3aed;
  --accent-soft: #a78bfa;
  --accent-bg: rgba(124,58,237,0.08);
  --gate: #f0abfc;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(124,58,237,0.06), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1180px; margin: 0 auto; }

/* HEADER */
.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 36px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.title-serif {
  font-family: 'DM Serif Display', serif; font-size: clamp(48px, 6.2vw, 76px);
  line-height: 0.96; letter-spacing: -0.025em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 14.5px; color: var(--fg-dim); margin: 18px 0 0; max-width: 64ch; line-height: 1.65; font-weight: 400; }
.meta {
  text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em;
  font-family: 'JetBrains Mono', monospace;
}
.meta strong { color: var(--fg); font-weight: 500; }

/* STRIP */
.strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--border); border: 1px solid var(--border);
  margin-bottom: 36px;
}
.strip-cell {
  padding: 16px 18px; background: var(--bg-2);
  display: grid; grid-template-rows: auto auto auto; gap: 6px;
}
.strip-label {
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-mute);
  font-family: 'JetBrains Mono', monospace;
}
.strip-value {
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: 26px; color: var(--accent); line-height: 1; font-weight: 400;
}
.strip-note { font-size: 11px; color: var(--fg-dim); line-height: 1.45; }

/* TRADEOFF */
.tradeoff {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border); margin-bottom: 20px;
}
.tradeoff-cell { padding: 22px 24px; background: var(--bg-2); }
.tradeoff-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 12px; font-family: 'JetBrains Mono', monospace;
}
.tradeoff-text { font-size: 14px; color: var(--fg); line-height: 1.7; }
.tradeoff-text strong { color: var(--fg); font-weight: 600; }

.principle {
  margin-bottom: 36px; padding: 16px 24px;
  border: 1px dashed var(--border-bright); background: var(--accent-bg);
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: 18px; color: var(--accent-soft); line-height: 1.5;
}
.principle-label {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 8px; display: block;
}

/* PROGRESS */
.progress-wrap {
  margin-bottom: 28px; padding: 14px 20px; background: var(--bg-2);
  border: 1px solid var(--border); position: sticky; top: 20px; z-index: 5;
  display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;
}
.progress-bar { height: 6px; background: var(--bg-3); position: relative; }
.progress-fill {
  position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent);
  transition: width 0.4s ease;
}
.progress-meta {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-dim);
  letter-spacing: 0.1em;
}
.progress-meta strong { color: var(--accent); font-weight: 600; }

/* QUARTERS */
.quarters { display: grid; gap: 14px; }
.quarter {
  border: 1px solid var(--border); background: var(--bg-2);
  border-left: 3px solid var(--accent);
}
.quarter-head {
  padding: 14px 20px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
}
.quarter-num {
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: 30px; color: var(--accent); line-height: 1; font-weight: 400;
}
.quarter-title { font-size: 15px; color: var(--fg); font-weight: 600; letter-spacing: -0.005em; }
.quarter-sub { font-size: 11.5px; color: var(--fg-dim); margin-top: 3px; }
.quarter-chevron { color: var(--fg-mute); transition: transform 0.2s; }
.quarter.open .quarter-chevron { transform: rotate(90deg); }

.months { display: grid; }
.month {
  padding: 14px 20px 14px 20px;
  border-top: 1px solid var(--border);
}
.month-head {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  cursor: pointer; user-select: none;
}
.month-num {
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: 22px; color: var(--accent-soft); line-height: 1; font-weight: 400; min-width: 44px;
}
.month-gate { padding-top: 2px; }
.month-gate-label {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--gate); margin-bottom: 4px;
}
.month-gate-text {
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: 16px; color: var(--fg); line-height: 1.4;
}
.month-check {
  width: 18px; height: 18px; border: 1.5px solid var(--fg-mute); cursor: pointer;
  margin-top: 4px; transition: all 0.15s; display: flex; align-items: center; justify-content: center;
}
.month-check.done { background: var(--accent); border-color: var(--accent); color: var(--bg); }

.weeks { display: grid; gap: 6px; margin-top: 12px; padding-left: 58px; }
.week {
  display: grid; grid-template-columns: 32px 1fr 16px; gap: 12px; align-items: start;
  padding: 8px 10px; background: var(--bg-3);
  cursor: pointer; transition: background 0.12s;
  border-left: 2px solid transparent;
}
.week:hover { background: var(--bg); }
.week.done { border-left-color: var(--accent); opacity: 0.65; }
.week.done .week-text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
.week-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; color: var(--accent); font-weight: 600;
}
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.5; }
.week-check { width: 14px; height: 14px; border: 1.5px solid var(--fg-mute); display: flex; align-items: center; justify-content: center; }
.week.done .week-check { background: var(--accent); border-color: var(--accent); }

/* CLAIMS */
.claims {
  margin-top: 40px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 12px; color: var(--fg-dim); line-height: 1.75;
}
.claims h4 {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 12px;
}
.claims ul { margin: 6px 0; padding-left: 20px; }
.claims li { margin-bottom: 6px; }
.claims strong { color: var(--fg); font-weight: 600; }

@media (max-width: 880px) {
  .strip { grid-template-columns: 1fr 1fr; }
  .tradeoff { grid-template-columns: 1fr; }
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .weeks { padding-left: 0; }
}
`;

const QUARTERS = [
  {
    num: 'Q1', title: 'Audit motion validated', sub: 'May → Jul 2026 · floor pricing held without flinching',
    months: [
      {
        m: 1, gate: 'FreeAssessment flow operational · Ryan audit delivered · case study #1 captured',
        weeks: [
          'Confirm FreeAssessment flow end-to-end. Send Ryan delivery kickoff email.',
          'Deliver Ryan audit (exception pricing documented separately). Capture artifacts.',
          'Write Ryan case study draft. Schedule permission conversation.',
          'Ship case study to audit.flashfusion.co. Begin outreach to 2 prospects at floor.',
        ],
      },
      {
        m: 2, gate: 'First paid audit at $4,500 floor — no exceptions',
        weeks: [
          'Outreach motion: 5 warm prospects contacted with Ryan case study attached.',
          'First discovery call. Hold $4,500 floor without flinching or hedging.',
          'Audit signed at $4,500. Kickoff scheduled.',
          'Audit delivered. Case study #2 captured. Pipeline review.',
        ],
      },
      {
        m: 3, gate: 'Three audits delivered · three case studies in the bank · referral motion warm',
        weeks: [
          'Third audit prospect contacted. Discovery + pricing call.',
          'Audit #3 signed and delivered. Permission flow tightened.',
          'Three case studies live on audit.flashfusion.co. Cross-link sequence built.',
          'Q1 retro: pricing held, conversion rate measured, exception leakage check.',
        ],
      },
    ],
  },
  {
    num: 'Q2', title: 'Sprint motion launched', sub: 'Aug → Oct 2026 · $5K fixed pricing validated through delivery',
    months: [
      {
        m: 4, gate: 'First Enablement Sprint signed at $5K fixed',
        weeks: [
          'Sprint offer page drafted. Scope-locked: 4 weeks, fixed deliverable set.',
          'Audit-to-sprint upsell motion: re-engage Q1 audit clients with sprint offer.',
          'First sprint discovery call. Scope discipline: in/out negotiation.',
          'Sprint #1 signed at $5K. Kickoff scheduled. Scope locked in writing.',
        ],
      },
      {
        m: 5, gate: 'Sprint #1 delivered · testimonial + case study captured · retainer pipeline visible',
        weeks: [
          'Sprint #1 W1 delivery. Daily-cadence client comms operational.',
          'Sprint #1 W2-3 delivery. Mid-sprint check-in. Scope creep gate.',
          'Sprint #1 W4 delivery + handoff. Testimonial captured at delivery moment.',
          'Sprint #1 case study published. Retainer-fit conversations initiated with 2 sprint clients.',
        ],
      },
      {
        m: 6, gate: 'Mid-year: $50K cumulative revenue · sprint pricing validated · half-year retrospective',
        weeks: [
          'Two more sprint discovery calls. Pipeline review against $222K trajectory.',
          'Sprint #2 signed. Sprint #3 in negotiation.',
          'Sprint #2 delivery W1-2. Sprint #3 closing.',
          'Mid-year retro: revenue actual vs target, lane discipline check, Y2 framing draft.',
        ],
      },
    ],
  },
  {
    num: 'Q3', title: 'Retainer + recurring revenue', sub: 'Nov 2026 → Jan 2027 · recurring base established',
    months: [
      {
        m: 7, gate: 'Sprints #2 + #3 in delivery · retainer offer formalized at $2K/mo',
        weeks: [
          'Retainer offer page drafted. Tier definition + boundary discipline written.',
          'Sprint #2 delivered + sprint #3 W1. Retainer pitch deck to 2 strongest sprint clients.',
          'Sprint #3 W2-3 delivery. First retainer discovery call.',
          'Sprint #3 delivered. Retainer pipeline: 2 active conversations.',
        ],
      },
      {
        m: 8, gate: 'Skills Library compliance gaps closed · skill-pack productized as audit deliverable',
        weeks: [
          'Skills Library audit: confirm 4 compliance gaps. Triage fix order.',
          'Gap fix sprint W1: triggers + version-nesting fixes.',
          'Gap fix sprint W2: hooks + least-privilege fixes. Full library re-audit.',
          'Skill pack productized: included as audit deliverable. Pricing impact: keep floor.',
        ],
      },
      {
        m: 9, gate: 'First retainer signed at $2K/mo · Load-Bearing newsletter at 200 subscribers',
        weeks: [
          'Retainer #1 signed. Onboarding sequence operationalized.',
          'Retainer #1 W1-2 service delivery. Cadence + boundary discipline tested live.',
          'Load-Bearing essay #5 published. Newsletter at 200 subs measured against gate.',
          'Retainer #2 close attempt. Audit pipeline check: self-sustaining or not?',
        ],
      },
    ],
  },
  {
    num: 'Q4', title: 'vCAIO sale + Y2 planning', sub: 'Feb → Apr 2027 · advisory tier unlocked, $222K reached or path locked',
    months: [
      {
        m: 10, gate: 'Two retainers active · audit pipeline self-sustaining via referrals',
        weeks: [
          'Retainer #2 signed. Cohort cadence locked for two clients.',
          'Audit pipeline: confirm 60%+ of new audits coming from referrals.',
          'Q4 outreach focused on highest-fit prospects only. Floor + retainer ladder positioned.',
          'Retainer #1 90-day review. Renewal or churn signal. vCAIO precursor conversation.',
        ],
      },
      {
        m: 11, gate: 'First vCAIO conversation initiated with best-fit retainer client',
        weeks: [
          'vCAIO offer page drafted. Month-12+ positioning, advisory cadence defined.',
          'vCAIO discovery call with strongest retainer client. Pricing $5-8K/mo proposed.',
          'vCAIO scope negotiation. Decision: bundle or replace retainer.',
          'vCAIO signed OR formal "not now" with Y2 path. Either is a valid outcome.',
        ],
      },
      {
        m: 12, gate: '$200K+ cumulative revenue · Y2 strategy locked · lane discipline retrospective',
        weeks: [
          'Revenue actual vs $222K target measured. Honest assessment.',
          'Y2 strategy first draft: retainer-heavy vs audit-heavy vs vCAIO-heavy.',
          'Y2 strategy review against ChaosClubCo + Memoir bandwidth. Lane discipline retrospective.',
          'Y2 strategy locked. Q5 onboarding starts. Year-one closing reflection captured.',
        ],
      },
    ],
  },
];

export default function FlashFusionArc() {
  const [openQ, setOpenQ] = useState('Q1');
  const [openM, setOpenM] = useState(1);
  const [doneMonths, setDoneMonths] = useState(new Set());
  const [doneWeeks, setDoneWeeks] = useState(new Set());

  const totalWeeks = 48;
  const completedWeeks = doneWeeks.size;
  const pct = Math.round((completedWeeks / totalWeeks) * 100);

  const toggleMonth = (m) => {
    setDoneMonths(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };
  const toggleWeek = (key) => {
    setDoneWeeks(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid">
            <div>
              <p className="kicker"><Target size={12} /> FlashFusion // Revenue + Capability Arc</p>
              <h1 className="title-serif">The <em>FlashFusion</em> Arc.</h1>
              <p className="title-sub">
                Twelve months. Four-tier revenue ladder. Audit motion → sprint motion → retainer motion → vCAIO. $222K Year-1 honest target. The floor holds; the exception list does not grow. Every gate measured against actual revenue and case-study artifacts, not aspirational positioning.
              </p>
            </div>
            <div className="meta">
              <div>Lane <strong>FlashFusion</strong></div>
              <div style={{marginTop: 4}}>Horizon <strong>May 2026 → Apr 2027</strong></div>
              <div style={{marginTop: 4}}>Floor <strong>$4,500</strong> (Ryan exception isolated)</div>
              <div style={{marginTop: 4}}>Y1 target <strong>$222,000</strong></div>
            </div>
          </div>

          <div className="strip">
            <div className="strip-cell">
              <div className="strip-label">Q1 target</div>
              <div className="strip-value">3 audits</div>
              <div className="strip-note">$13.5K + 3 case studies</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q2 target</div>
              <div className="strip-value">3 sprints</div>
              <div className="strip-note">$15K + retainer pipeline</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q3 target</div>
              <div className="strip-value">2 retainers</div>
              <div className="strip-note">$4K/mo recurring</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q4 target</div>
              <div className="strip-value">1 vCAIO</div>
              <div className="strip-note">$5-8K/mo advisory</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Y1 target</div>
              <div className="strip-value">$222K</div>
              <div className="strip-note">honest baseline</div>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">
                <strong>Revenue runway</strong> that funds the other two lanes without compromise. <strong>Service-line maturity</strong> built on real case studies, not borrowed authority. <strong>Brand validation</strong> from clients who paid floor pricing and got value — the strongest signal in consulting.
              </div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">
                <strong>Bandwidth optionality</strong> — sprint delivery weeks are real time blocks. <strong>Positioning flexibility</strong> — the ladder locks in early. <strong>Exception comfort</strong> — Ryan's $3K trade is documented as one-time; the floor cannot leak or the whole pricing model collapses.
              </div>
            </div>
          </div>

          <div className="principle">
            <span className="principle-label">Operating principle</span>
            Sell the floor. Deliver beyond it. The audit at $4,500 must feel like a $9,000 audit. The sprint at $5K must feel like a $12K engagement. Revenue runway is built on delivery surprise, not pricing discounts.
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <strong>{completedWeeks}</strong> / {totalWeeks} weeks · {pct}% complete · Q1 sequence
            </div>
          </div>

          <div className="quarters">
            {QUARTERS.map(q => {
              const isOpen = openQ === q.num;
              return (
                <div key={q.num} className={`quarter ${isOpen ? 'open' : ''}`}>
                  <div className="quarter-head" onClick={() => setOpenQ(isOpen ? null : q.num)}>
                    <div className="quarter-num">{q.num}</div>
                    <div>
                      <div className="quarter-title">{q.title}</div>
                      <div className="quarter-sub">{q.sub}</div>
                    </div>
                    <ChevronRight size={18} className="quarter-chevron" />
                  </div>
                  {isOpen && (
                    <div className="months">
                      {q.months.map(month => {
                        const monthOpen = openM === month.m;
                        return (
                          <div key={month.m} className="month">
                            <div className="month-head" onClick={() => setOpenM(monthOpen ? null : month.m)}>
                              <div className="month-num">M{month.m}</div>
                              <div className="month-gate">
                                <div className="month-gate-label">Gate</div>
                                <div className="month-gate-text">{month.gate}</div>
                              </div>
                              <div
                                className={`month-check ${doneMonths.has(month.m) ? 'done' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggleMonth(month.m); }}
                              >
                                {doneMonths.has(month.m) && <Flag size={11} />}
                              </div>
                            </div>
                            {monthOpen && (
                              <div className="weeks">
                                {month.weeks.map((w, wi) => {
                                  const key = `${month.m}-${wi+1}`;
                                  const isDone = doneWeeks.has(key);
                                  return (
                                    <div
                                      key={wi}
                                      className={`week ${isDone ? 'done' : ''}`}
                                      onClick={() => toggleWeek(key)}
                                    >
                                      <div className="week-label">W{wi+1}</div>
                                      <div className="week-text">{w}</div>
                                      <div className="week-check">
                                        {isDone && <Flag size={9} />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="claims">
            <h4><AlertCircle size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Claims, gaps, assumptions</h4>
            <ul>
              <li><strong>$222K target is honest, not aspirational.</strong> Year-1 ladder math: 12 audits × $4.5K ($54K) + 8 sprints × $5K ($40K) + 6 retainer-months avg × $2K ($72K avg cumulative) + 2 vCAIO-months × $6K ($12K) + buffer for sprint volume = $178K floor / $244K stretch. $222K is the midpoint. Adjust quarterly.</li>
              <li><strong>The $4,500 floor is structural, not negotiable.</strong> Ryan Anderskow's $3,000 case-study trade is documented as a one-time exception in a separate file. If the floor leaks to a second prospect, the entire pricing model collapses. WSJF score for any "exception" conversation: deprioritize ruthlessly.</li>
              <li><strong>The audit-to-sprint-to-retainer ladder assumes ~30% conversion at each step.</strong> Three audits → one sprint. Three sprints → one retainer. Two retainers → one vCAIO conversation. If conversion is lower than that, the gate sequence needs renegotiation — not the floor.</li>
              <li><strong>Skills Library compliance gaps gate the M8 productization move.</strong> Four gaps documented (missing "Use when…" triggers, version not nested, hooks on claude.ai skills, allowed-tools not least-privilege). M8 cannot ship until these are closed.</li>
              <li><strong>Load-Bearing newsletter is in this arc but should be tracked separately.</strong> 200-subscriber gate at M9 is dependent on essay backlog and platform decision. Both are pending. If the platform decision slips, M9 gate slips with it — flag honestly.</li>
              <li><strong>What this arc does not model:</strong> Continuum blocker resolution (Supabase bill), competitor pricing pressure, INT subcontract Phase 2 timing (out of project scope), referral volatility, client churn from delivered retainers. Treat as known unknowns. Quarterly retro is the renegotiation point.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
