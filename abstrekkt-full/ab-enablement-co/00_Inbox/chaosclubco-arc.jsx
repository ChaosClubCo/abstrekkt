import React from 'react';
import { Compass, TrendingUp, Flag, AlertCircle } from 'lucide-react';

const ARC = {
  title: 'The ChaosClubCo Arc',
  em: 'ChaosClubCo',
  sub: 'Content/media + software parent org · post-pivot trajectory · no peer-support / mental-health framing',
  meta: { kicker: 'Lane 02 // Parent org definition', target: 'Y1 = distribution decisions made, scope locked, first revenue any amount' },
  tradeoff: {
    gain: 'A coherent parent org with shipped products, defined voice, and at least one distribution surface. The 244-plugin marketplace deployed. Ample scoped or shelved. Brand statement that doesn\'t reference peer-support, mental-health, or therapy. A flagship candidate by M12, even if not the final flagship.',
    giveUp: 'The old framing (crisis routing, peer matching, premium audio gating) — completely. The comfort of having a clear mission narrative; this lane is in scope-definition mode, not optimization mode. Time from FlashFusion. Some products will be shelved (FissionPrompt likely). Decision-pace fatigue.',
    principle: 'Decide first, optimize second. The lane has more open decisions than execution items — answer the decisions, then the work becomes obvious. Don\'t build in the absence of scope.',
  },
  monthly: [
    {
      m: 1, gate: 'claude-code-plugins-plus distribution decision made',
      weeks: [
        'Distribution analysis: marketplace listing vs blog launch vs direct outreach vs Anthropic partnership — pros/cons matrix',
        'Distribution decision committed. Document rationale for future Claude sessions (in PROJECT_STATE.md)',
        'Distribution path execution starts. README polish, marketing copy, install instructions clean',
        'Path executes. Track first 30-day response: installs, mentions, inbound conversations',
      ],
    },
    {
      m: 2, gate: 'First public surface for ChaosClubCo brand under new framing',
      weeks: [
        'Distribution metrics review: what\'s working, what\'s noise. Iterate on the active path',
        'ChaosClubCo brand statement drafted under content/media + software framing — explicit anti-references to old peer-support direction',
        '14 brand pillars review: keep, reword, or drop the three flagged for potential mental-health adjacency',
        'First public surface ships (GitHub org README, landing page, or content piece). Lane discipline check: zero peer-support language',
      ],
    },
    {
      m: 3, gate: 'Ample scope locked · FissionPrompt fate decided',
      weeks: [
        'Ample scope conversation: what is it, who is it for, what does it do, does the Figma file match',
        'Ample scope locked or explicitly shelved. FissionPrompt audit: Nov 2025 last commit, current state, resurrection effort estimate',
        'FissionPrompt decision: resuscitate, shelve, or transition to maintenance-only. Document either way',
        'Q1 review: ChaosClubCo trajectory honest. Persist with current direction or pivot again',
      ],
    },
    {
      m: 4, gate: 'Ample MVP shipped (if active) · Content surface launched',
      weeks: [
        'Ample architecture work if scope active. Or alternative: scope-reduction sprint',
        'Ample MVP scope: minimum thing that ships. No premature features. Match Figma if possible',
        'Ample build sprint. Document gotchas — these become future blog material',
        'Ample shipped (any tier) or scope reduced honestly. Content surface idea-generation: format, voice, cadence',
      ],
    },
    {
      m: 5, gate: 'First content output under ChaosClubCo voice',
      weeks: [
        'Content surface decision: format (essays / videos / mixed / newsletter), voice, reader profile',
        'First content piece drafted. Voice consistency check: anti-references to old framing intact',
        'First content piece polished. Distribution motion across channels',
        'Published. Engagement baseline measured. Lane discipline preserved — zero peer-support drift',
      ],
    },
    {
      m: 6, gate: 'Mid-year audit · Chaos Collective decision · Pillars resolved',
      weeks: [
        'Mid-year ChaosClubCo audit honest. What works, what doesn\'t, what to drop',
        'Chaos Collective decision: rebrand of ChaosClubCo, separate publishing surface, or shelve entirely',
        'Three flagged brand pillars (6, 7, 13): keep as-written, reword to remove mental-health adjacency, or remove',
        'Mid-year decisions documented in PROJECT_STATE.md. Q3 plan locked. Lane discipline reconfirmed',
      ],
    },
    {
      m: 7, gate: 'Software product #2 activity (Ample iteration or new)',
      weeks: [
        'Software product #2 path: Ample v2 iteration, FissionPrompt resuscitation (if M3 voted yes), or new build',
        'Build sprint. Architecture-first. Document gotchas',
        'Build sprint continued. Mid-sprint quality check honest',
        'Product #2 shipped or paused with rationale. No silent abandonment',
      ],
    },
    {
      m: 8, gate: 'Content cadence locked · Distribution partner conversation initiated',
      weeks: [
        'Content cadence decision: weekly / biweekly / monthly. Lock for Y1. Sustainability over ambition',
        'Distribution partner candidates: who could amplify ChaosClubCo? List 3-5',
        'Partner outreach. Personalized, not blast. Track responses',
        'Partner response tracking. Cadence first edition under locked schedule',
      ],
    },
    {
      m: 9, gate: 'First distribution partnership or feature attempt',
      weeks: [
        'Partner conversation #1. Scope: amplification, feature, collaboration, or referral',
        'Partnership scope agreed or no-go documented. First feature attempt if active',
        'Partnership execution. Content + product cadence continues parallel',
        'Q3 retrospective. Distribution metrics honest',
      ],
    },
    {
      m: 10, gate: 'First revenue from ChaosClubCo (any amount)',
      weeks: [
        'First revenue conversation: who would pay for ChaosClubCo product, what price point feels right',
        'Pricing model decision: one-time, subscription, sponsorship, paid distribution',
        'First paid conversation. Accept any honest amount — the milestone is "revenue exists"',
        'First revenue closed (any tier). Document in PROJECT_STATE.md. Frame for Y2 planning',
      ],
    },
    {
      m: 11, gate: 'Year flagship release · Substantial product or content moment',
      weeks: [
        'Year flagship decision: what is the substantial release that defines Y1 for the lane',
        'Flagship build sprint. Architecture / structural work complete',
        'Flagship polish. Distribution motion prepared',
        'Flagship release. Maximum distribution push. Cross-arc feed: this surfaces in FlashFusion brand work too',
      ],
    },
    {
      m: 12, gate: 'Year retrospective · Y2 plan · Flagship status decided',
      weeks: [
        'Year retrospective: ChaosClubCo trajectory honest. Did the pivot stabilize? What surfaces work?',
        'Flagship product status: keep + invest, evolve, or shelve. No silent maintenance',
        'Y2 plan: ChaosClubCo trajectory locked. Lane discipline rules updated based on Y1 drift',
        'Year close. Q1 Y2 commitments. Chaos Collective resolution documented if still pending',
      ],
    },
  ],
  yearGate: 'By M12, ChaosClubCo is a coherent parent org with at least two shipped/maintained products, a defined content surface, a brand statement that survives any "peer support? mental health?" question, and at least one revenue conversation closed. The flagship may not exist yet — but the conditions for a flagship do.',
  claims: [
    'This arc operates from the May 2026 pivot baseline — no peer-support, mental-health, or therapy-adjacent framing in any output, public surface, or product description. Three brand pillars (6, 7, 13) are flagged as possible adjacency risks and need M6 resolution.',
    'The 244-plugin claude-code-plugins-plus marketplace is built and installable. Y1 question is distribution, not development. Building more before the existing catalog has distribution is misallocation.',
    'Ample scope is "in flux" per project state. The arc treats this as an M3 decision, not an indefinite ambiguity. Either Ample gets scoped and shipped, or it gets shelved cleanly and Ample-time goes elsewhere.',
    'FissionPrompt last commit Nov 2025. By M3 the arc forces a decision: resuscitate (with what level of investment?), shelve (clean exit), or maintenance-only. Long-term shelving without decision is technical debt the lane carries.',
    'kidcreator / StoryWeaver is explicitly out of this arc. It\'s under the GitHub org for hosting only, framed as a personal gift project for Kinsley. It does not factor into commercial trajectory.',
    'The "first revenue" milestone in M10 is deliberately framed as "any amount." A $50 sponsorship counts. The point is the revenue infrastructure existing, not the magnitude — magnitude is a Y2 conversation.',
    'Chaos Collective remains an open decision tracked into M6. The arc does not assume which way it resolves. If Chaos Collective becomes a separate publishing surface, the lane scope expands; if it\'s a rebrand of ChaosClubCo, the lane stays unified.',
    'Cross-arc feeds: the M11 flagship release feeds FlashFusion brand work (Load-Bearing newsletter, audit case studies). Both lanes benefit. Tracking happens here, with cross-feed notes — not duplicated in the FlashFusion arc.',
  ],
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0a0508;
  --bg-2: #160a10;
  --bg-3: #1f1018;
  --fg: #f3e8ee;
  --fg-dim: #a08a96;
  --fg-mute: #6b5663;
  --border: #2a121e;
  --border-bright: #381828;
  --accent: #e11d48;
  --accent-soft: #fb7185;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.6;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(225,29,72,0.10), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1100px; margin: 0 auto; }

.header { padding-bottom: 28px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent-soft); margin: 0 0 16px;
  display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(48px, 7vw, 96px);
  line-height: 0.94; letter-spacing: -0.025em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13.5px; color: var(--fg-dim); margin: 16px 0 0; max-width: 64ch; line-height: 1.6; }
.title-meta {
  font-size: 10.5px; color: var(--fg-mute); margin-top: 16px;
  letter-spacing: 0.15em; text-transform: uppercase;
}
.title-meta strong { color: var(--accent-soft); font-weight: 500; }

.tradeoff {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border);
  margin-bottom: 36px;
}
.tradeoff-cell { background: var(--bg-2); padding: 20px 24px; }
.tradeoff-label {
  font-size: 9.5px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--fg-mute); margin-bottom: 10px;
}
.tradeoff-text { font-size: 12.5px; color: var(--fg); line-height: 1.6; }
.tradeoff-principle {
  grid-column: 1 / -1; padding: 16px 24px;
  background: rgba(225,29,72,0.06); border-top: 1px dashed var(--border-bright);
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; color: var(--accent-soft); line-height: 1.5;
}
.tradeoff-principle-label {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 9.5px; letter-spacing: 0.24em; color: var(--accent);
  text-transform: uppercase; margin-right: 12px;
}

.months { border: 1px solid var(--border); background: var(--bg-2); margin-bottom: 36px; }
.month { display: grid; grid-template-columns: 80px 1fr; border-top: 1px solid var(--border); }
.month:first-child { border-top: none; }
.month-num {
  padding: 18px 16px; background: var(--bg-3);
  border-right: 1px solid var(--border);
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 28px; color: var(--accent); line-height: 1;
}
.month-num-sub {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 9px; letter-spacing: 0.18em; color: var(--fg-mute);
  text-transform: uppercase; margin-top: 6px;
}
.month-body { padding: 18px 22px; }
.month-gate {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  padding-bottom: 14px; border-bottom: 1px dashed var(--border-bright);
}
.month-gate-icon { color: var(--accent); opacity: 0.7; }
.month-gate-label {
  font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-mute); margin-right: 4px;
}
.month-gate-text {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 15px; color: var(--fg); line-height: 1.4;
}

.weeks { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.week {
  display: grid; grid-template-columns: 24px 1fr; gap: 8px;
  align-items: start; padding: 6px 0;
}
.week-num {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 13px; color: var(--accent); line-height: 1.4;
}
.week-text { font-size: 11.5px; color: var(--fg-dim); line-height: 1.55; }

.year-gate {
  padding: 24px 28px; margin-bottom: 36px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
}
.year-gate-label {
  font-size: 10px; letter-spacing: 0.24em; color: var(--accent);
  text-transform: uppercase; margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.year-gate-text {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; color: var(--fg); line-height: 1.4;
}

.claims {
  padding: 22px 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 {
  font-size: 10px; letter-spacing: 0.24em; color: var(--fg);
  text-transform: uppercase; margin: 0 0 12px;
  display: flex; align-items: center; gap: 8px;
}
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 6px; }
.claims strong { color: var(--fg); font-weight: 500; }

@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.45s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }

@media (max-width: 820px) {
  .tradeoff { grid-template-columns: 1fr; }
  .month { grid-template-columns: 60px 1fr; }
  .month-num { padding: 14px 10px; font-size: 22px; }
  .weeks { grid-template-columns: 1fr; }
}
`;

export default function ChaosClubCoArc() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container stagger">

          <div className="header">
            <p className="kicker"><Compass size={12} /> {ARC.meta.kicker}</p>
            <h1 className="title-serif">The <em>{ARC.em}</em> Arc.</h1>
            <p className="title-sub">{ARC.sub}</p>
            <div className="title-meta">
              Horizon <strong>12 months</strong> · {ARC.meta.target} · Lane <strong>ChaosClubCo</strong>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">{ARC.tradeoff.gain}</div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">{ARC.tradeoff.giveUp}</div>
            </div>
            <div className="tradeoff-principle">
              <span className="tradeoff-principle-label">Operating principle</span>
              {ARC.tradeoff.principle}
            </div>
          </div>

          <div className="months">
            {ARC.monthly.map(m => (
              <div key={m.m} className="month">
                <div className="month-num">
                  M{m.m.toString().padStart(2, '0')}
                  <div className="month-num-sub">Q{Math.ceil(m.m/3)}</div>
                </div>
                <div className="month-body">
                  <div className="month-gate">
                    <Flag size={14} className="month-gate-icon" />
                    <span className="month-gate-label">Gate</span>
                    <span className="month-gate-text">{m.gate}</span>
                  </div>
                  <div className="weeks">
                    {m.weeks.map((w, i) => (
                      <div key={i} className="week">
                        <span className="week-num">W{i+1}</span>
                        <span className="week-text">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="year-gate">
            <div className="year-gate-label">
              <TrendingUp size={11} /> Year gate
            </div>
            <div className="year-gate-text">{ARC.yearGate}</div>
          </div>

          <div className="claims">
            <h4><AlertCircle size={11} /> Claims & limits</h4>
            <ul>
              {ARC.claims.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
