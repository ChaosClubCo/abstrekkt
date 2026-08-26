import React, { useState } from 'react';
import { ChevronRight, Compass, Flag, AlertCircle, Layers } from 'lucide-react';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&family=Geist:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0d0a0b;
  --bg-2: #1a1416;
  --bg-3: #241a1d;
  --fg: #f0e8e8;
  --fg-dim: #95898a;
  --fg-mute: #5e5455;
  --border: #2a1f22;
  --border-bright: #38292d;
  --accent: #e11d48;
  --accent-soft: #fb7185;
  --accent-bg: rgba(225,29,72,0.06);
  --gate: #fda4af;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'Geist', -apple-system, sans-serif;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(225,29,72,0.06), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1180px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 36px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
  font-family: 'Geist Mono', monospace;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(48px, 6.2vw, 76px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 14.5px; color: var(--fg-dim); margin: 18px 0 0; max-width: 64ch; line-height: 1.65; }
.meta {
  text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em;
  font-family: 'Geist Mono', monospace;
}
.meta strong { color: var(--fg); font-weight: 500; }

.strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--border); border: 1px solid var(--border); margin-bottom: 36px;
}
.strip-cell {
  padding: 16px 18px; background: var(--bg-2);
  display: grid; grid-template-rows: auto auto auto; gap: 6px;
}
.strip-label {
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-mute);
  font-family: 'Geist Mono', monospace;
}
.strip-value {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 26px; color: var(--accent); line-height: 1; font-weight: 400;
}
.strip-note { font-size: 11px; color: var(--fg-dim); line-height: 1.45; }

.tradeoff {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border); margin-bottom: 20px;
}
.tradeoff-cell { padding: 22px 24px; background: var(--bg-2); }
.tradeoff-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 12px; font-family: 'Geist Mono', monospace;
}
.tradeoff-text { font-size: 14px; color: var(--fg); line-height: 1.7; }
.tradeoff-text strong { color: var(--fg); font-weight: 600; }

.principle {
  margin-bottom: 36px; padding: 16px 24px;
  border: 1px dashed var(--border-bright); background: var(--accent-bg);
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 18px; color: var(--accent-soft); line-height: 1.5;
}
.principle-label {
  font-family: 'Geist Mono', monospace; font-style: normal;
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 8px; display: block;
}

.progress-wrap {
  margin-bottom: 28px; padding: 14px 20px; background: var(--bg-2);
  border: 1px solid var(--border); position: sticky; top: 20px; z-index: 5;
  display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;
}
.progress-bar { height: 6px; background: var(--bg-3); position: relative; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }
.progress-meta { font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--fg-dim); letter-spacing: 0.1em; }
.progress-meta strong { color: var(--accent); font-weight: 600; }

.quarters { display: grid; gap: 14px; }
.quarter {
  border: 1px solid var(--border); background: var(--bg-2);
  border-left: 3px solid var(--accent);
}
.quarter-head {
  padding: 14px 20px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
}
.quarter-num { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 30px; color: var(--accent); line-height: 1; }
.quarter-title { font-size: 15px; color: var(--fg); font-weight: 600; }
.quarter-sub { font-size: 11.5px; color: var(--fg-dim); margin-top: 3px; }
.quarter-chevron { color: var(--fg-mute); transition: transform 0.2s; }
.quarter.open .quarter-chevron { transform: rotate(90deg); }

.months { display: grid; }
.month { padding: 14px 20px; border-top: 1px solid var(--border); }
.month-head { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; cursor: pointer; }
.month-num { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--accent-soft); min-width: 44px; }
.month-gate-label { font-family: 'Geist Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gate); margin-bottom: 4px; }
.month-gate-text { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 16px; color: var(--fg); line-height: 1.4; }
.month-check { width: 18px; height: 18px; border: 1.5px solid var(--fg-mute); cursor: pointer; margin-top: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.month-check.done { background: var(--accent); border-color: var(--accent); color: var(--bg); }

.weeks { display: grid; gap: 6px; margin-top: 12px; padding-left: 58px; }
.week { display: grid; grid-template-columns: 32px 1fr 16px; gap: 12px; align-items: start; padding: 8px 10px; background: var(--bg-3); cursor: pointer; border-left: 2px solid transparent; transition: background 0.12s; }
.week:hover { background: var(--bg); }
.week.done { border-left-color: var(--accent); opacity: 0.65; }
.week.done .week-text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
.week-label { font-family: 'Geist Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--accent); font-weight: 600; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.5; }
.week-check { width: 14px; height: 14px; border: 1.5px solid var(--fg-mute); display: flex; align-items: center; justify-content: center; }
.week.done .week-check { background: var(--accent); border-color: var(--accent); }

.claims {
  margin-top: 40px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 12px; color: var(--fg-dim); line-height: 1.75;
}
.claims h4 { font-family: 'Geist Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 12px; }
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
    num: 'Q1', title: 'Marketplace distribution', sub: 'May → Jul 2026 · claude-code-plugins-plus has shipped, the question is who finds it',
    months: [
      {
        m: 1, gate: 'Marketplace distribution strategy decision · launch path locked',
        weeks: [
          'Audit claude-code-plugins-plus current state. Confirm 244 plugins installable.',
          'Distribution path decision: marketplace listing vs blog launch vs Anthropic partnership.',
          'README + landing page polish for whichever path is chosen. Demo flow recorded.',
          'Launch sequence drafted. Outreach list built. Date locked.',
        ],
      },
      {
        m: 2, gate: 'Launch executed · first 100 installs measured · feedback loop active',
        weeks: [
          'Launch day execution. Coordinated post + outreach + community shares.',
          'Week 2 metrics review. Install count, install-to-active ratio.',
          'First wave of feedback triaged. Top 5 plugin issues identified.',
          'Top issues patched. Second outreach wave to fence-sitters.',
        ],
      },
      {
        m: 3, gate: 'Marketplace gets to first stable state · plugin contribution path opens',
        weeks: [
          'Plugin contribution guide drafted. PR template + review process.',
          'First external contributor onboarded. PR merged.',
          'Plugin spotlight content: write up 5 best plugins as standalone posts.',
          'Q1 retro: distribution honest assessment. Marketplace viable solo product or feeder?',
        ],
      },
    ],
  },
  {
    num: 'Q2', title: 'Ample MVP', sub: 'Aug → Oct 2026 · scope locked, Figma file activated, ship to closed beta',
    months: [
      {
        m: 4, gate: 'Ample scope locked · v1 spec written · Figma file aligned to spec',
        weeks: [
          'Ample current state audit. What exists vs what is in the Figma file.',
          'Scope decision: v1 minimum surface area. Cut everything optional.',
          'Spec written: features in, features out, what success looks like.',
          'Figma file synced to v1 spec. Designer-engineer handoff doc.',
        ],
      },
      {
        m: 5, gate: 'Ample core feature shipped · 5 closed beta users active',
        weeks: [
          'Core feature build W1: foundation + auth.',
          'Core feature build W2: primary user flow shipped end-to-end.',
          'Core feature build W3: feedback capture mechanism built in.',
          '5 closed beta users invited. Feedback loop activated.',
        ],
      },
      {
        m: 6, gate: 'Mid-year: Ample v1 stable · marketplace at 500+ installs · brand voice draft',
        weeks: [
          'Ample week 1 production feedback. Top 3 bugs triaged.',
          'Bug fixes + UX polish based on beta data.',
          'Marketplace 500-install gate check. Trajectory honest review.',
          'Brand voice doc first draft. 14 pillars activated or pruned with evidence.',
        ],
      },
    ],
  },
  {
    num: 'Q3', title: 'FissionPrompt + portfolio shape', sub: 'Nov 2026 → Jan 2027 · second product proves the portfolio thesis',
    months: [
      {
        m: 7, gate: 'FissionPrompt v0.2 scope locked · sequencing vs Ample decided',
        weeks: [
          'FissionPrompt current state audit (last commit Nov 2025).',
          'Sequencing decision: parallel with Ample or sequential after Ample stable?',
          'v0.2 scope written. Cut everything not on the critical path.',
          'Build kickoff. Resource allocation against FF + Memoir lanes documented.',
        ],
      },
      {
        m: 8, gate: 'FissionPrompt closed alpha · 3 video generations shipped publicly',
        weeks: [
          'Alpha build W1: core generation pipeline operational.',
          'Alpha build W2: 3 example videos shipped publicly with case-study framing.',
          'Alpha user onboarding: 3 trusted testers invited.',
          'Alpha feedback triage. Top issues prioritized.',
        ],
      },
      {
        m: 9, gate: 'Portfolio thesis tested · Chaos Collective vs ChaosClubCo decision',
        weeks: [
          'Three products evaluated against actual use + revenue + brand fit.',
          'Chaos Collective vs ChaosClubCo brand question: rebrand, separate surface, or kill?',
          'Decision documented with evidence. Brand voice doc updated to reflect.',
          'Q3 retro: which product earns more investment, which gets sunset.',
        ],
      },
    ],
  },
  {
    num: 'Q4', title: 'Consolidation + Y2 strategic clarity', sub: 'Feb → Apr 2027 · one flagship surfaces or the portfolio shape rejected honestly',
    months: [
      {
        m: 10, gate: 'Brand voice doc finalized · 14 pillars resolved (kept, reworded, dropped)',
        weeks: [
          'Brand voice doc audit. Three flagged pillars (#6, #7, #13) resolved.',
          'Brand voice integrated into all marketplace + Ample + FissionPrompt surfaces.',
          'Content style guide finalized: post structure, voice rules, lane discipline.',
          'Brand audit external review (Lafu or trusted reader).',
        ],
      },
      {
        m: 11, gate: 'One flagship surfaces · investment concentration decision',
        weeks: [
          'Three-product evaluation: distribution, use, revenue (if any), strategic leverage.',
          'Flagship decision: marketplace, Ample, FissionPrompt, or new product entirely.',
          'Investment concentration: 70% to flagship, 30% maintenance to others.',
          'Y2 portfolio shape written. Decision rationale captured.',
        ],
      },
      {
        m: 12, gate: 'Y2 strategy locked · lane discipline retrospective · ChaosClubCo identity stable',
        weeks: [
          'Y2 strategy first draft. Single-product vs portfolio reaffirmed.',
          'Lane discipline retrospective: any FF or Memoir bleed during the year?',
          'ChaosClubCo identity statement finalized. Public-facing positioning consolidated.',
          'Y2 plan locked. Year-one closing reflection captured for the project file.',
        ],
      },
    ],
  },
];

export default function ChaosClubCoArc() {
  const [openQ, setOpenQ] = useState('Q1');
  const [openM, setOpenM] = useState(1);
  const [doneMonths, setDoneMonths] = useState(new Set());
  const [doneWeeks, setDoneWeeks] = useState(new Set());

  const completedWeeks = doneWeeks.size;
  const pct = Math.round((completedWeeks / 48) * 100);

  const toggleMonth = (m) => { setDoneMonths(prev => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; }); };
  const toggleWeek = (key) => { setDoneWeeks(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; }); };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid">
            <div>
              <p className="kicker"><Compass size={12} /> ChaosClubCo // Content + Software Portfolio</p>
              <h1 className="title-serif">The <em>ChaosClubCo</em> Arc.</h1>
              <p className="title-sub">
                Twelve months under a parent org that has three products and no flagship. Marketplace distribution → Ample MVP → FissionPrompt → consolidation. The May 2026 pivot dropped peer-support framing entirely. This arc tests whether the portfolio thesis holds or whether one product earns the focus and the rest sunset.
              </p>
            </div>
            <div className="meta">
              <div>Lane <strong>ChaosClubCo</strong></div>
              <div style={{marginTop: 4}}>Horizon <strong>May 2026 → Apr 2027</strong></div>
              <div style={{marginTop: 4}}>Products <strong>3 active</strong> (mktplc, Ample, Fission)</div>
              <div style={{marginTop: 4}}>Brand <strong>#e11d48</strong></div>
            </div>
          </div>

          <div className="strip">
            <div className="strip-cell">
              <div className="strip-label">Q1 focus</div>
              <div className="strip-value">Distribute</div>
              <div className="strip-note">244 plugins, no audience</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q2 focus</div>
              <div className="strip-value">Ship Ample</div>
              <div className="strip-note">scope-locked MVP</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q3 focus</div>
              <div className="strip-value">FissionPrompt</div>
              <div className="strip-note">portfolio test</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q4 focus</div>
              <div className="strip-value">Consolidate</div>
              <div className="strip-note">flagship decision</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Y1 question</div>
              <div className="strip-value">Portfolio?</div>
              <div className="strip-note">or single flagship</div>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">
                <strong>Optionality on flagship</strong> — three products tested in market beats picking one cold. <strong>Content/media + software dual identity</strong> proven as a real shape, not just an org name. <strong>Distribution learning</strong> from three different go-to-market motions that the FF lane can borrow.
              </div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">
                <strong>Flagship clarity</strong> — three products dilute attention three ways. <strong>Compounding speed</strong> — a single product gets a year of investment instead of four months. <strong>Brand simplicity</strong> — ChaosClubCo as parent org is harder to position than ChaosClubCo as a product.
              </div>
            </div>
          </div>

          <div className="principle">
            <span className="principle-label">Operating principle</span>
            Ship products, not pillars. The 14 brand pillars are voice scaffolding, not deliverables. Distribution beats craftsmanship at this stage — a shipped product with 100 users teaches more than a perfect product with 5.
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <strong>{completedWeeks}</strong> / 48 weeks · {pct}% complete · Q1 distribution
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
                              <div>
                                <div className="month-gate-label">Gate</div>
                                <div className="month-gate-text">{month.gate}</div>
                              </div>
                              <div className={`month-check ${doneMonths.has(month.m) ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); toggleMonth(month.m); }}>
                                {doneMonths.has(month.m) && <Flag size={11} />}
                              </div>
                            </div>
                            {monthOpen && (
                              <div className="weeks">
                                {month.weeks.map((w, wi) => {
                                  const key = `${month.m}-${wi+1}`;
                                  const isDone = doneWeeks.has(key);
                                  return (
                                    <div key={wi} className={`week ${isDone ? 'done' : ''}`} onClick={() => toggleWeek(key)}>
                                      <div className="week-label">W{wi+1}</div>
                                      <div className="week-text">{w}</div>
                                      <div className="week-check">{isDone && <Flag size={9} />}</div>
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
              <li><strong>The marketplace is built, not distributed.</strong> 244 plugins exist and are installable. Zero distribution motion has happened. M1 picks the distribution path — that picks everything downstream. WSJF score for this decision: highest in Q1.</li>
              <li><strong>Ample is scope-uncertain.</strong> The Figma file exists ("Figma UI for Ample" Published). The repo exists. What v1 actually is hasn't been locked. M4 forces that decision. If scope isn't locked at M4, the M5 gate slips by definition.</li>
              <li><strong>FissionPrompt last commit was November 2025.</strong> Six months dormant. The M7 decision is sequencing-aware: parallel with Ample is unrealistic on Kyle's bandwidth. Sequential after Ample stable is the honest scope.</li>
              <li><strong>Three flagged brand pillars (#6, #7, #13) survived the pivot but may be mental-health-adjacent.</strong> The M10 brand voice doc resolves them — keep, reword, or drop. Open until then.</li>
              <li><strong>"Chaos Collective" vs ChaosClubCo is an unresolved brand question.</strong> M9 makes that decision with evidence (use, distribution, fit). Don't carry the ambiguity past Q3.</li>
              <li><strong>What this arc explicitly excludes:</strong> kidcreator / StoryWeaver (personal gift project for Kinsley, not in the commercial portfolio). Any product accidentally drifting toward peer-support / mental-health framing — flag and excise immediately.</li>
              <li><strong>Lane bleed risk:</strong> Content production for ChaosClubCo overlaps with FlashFusion content + Memoir excavation in voice. Three distinct voices required — if ChaosClubCo voice borrows FlashFusion's consulting language or Memoir's literary register, the lane discipline is failing. M10 brand voice doc is the corrective.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
