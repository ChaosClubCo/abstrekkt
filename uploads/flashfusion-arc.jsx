import React, { useState } from 'react';
import { Compass, TrendingUp, Flag, Zap, AlertCircle } from 'lucide-react';

const ARC = {
  title: 'The FlashFusion Arc',
  em: 'FlashFusion',
  sub: 'B2B AI enablement consultancy · revenue ladder operational',
  meta: { kicker: 'Lane 01 // Revenue critical path', target: 'Y1 honest target $222K' },
  tradeoff: {
    gain: 'A revenue engine that compounds. Audits feed Sprints feed Retainers feed vCAIO. Each rung of the ladder funds the next and produces case-study material for the rung above it. By M12, FlashFusion is a service line, not a side project.',
    giveUp: 'Pure builder mode. Every audit hour is an hour not spent on memoir or ChaosClubCo. The $4,500 floor must hold across all prospects — Ryan exception cannot leak. Service delivery quality must hold across all engagements or the case-study compounding breaks.',
    principle: 'The ladder is the discipline. Don\'t skip rungs; don\'t price below floor; don\'t deliver below quality. The $222K trajectory is realistic only if each rung produces the next.',
  },
  monthly: [
    {
      m: 1, gate: 'Ryan audit delivered · Continuum unblocked · Skills compliance fixed',
      weeks: [
        'Continuum: pay Supabase bill, reconnect Vercel GitHub app, verify last good prod deploy restorable',
        'Skills Library compliance: fix "Use when" triggers, nest version under metadata, remove hooks, least-privilege allowed-tools',
        'Ryan audit: send proposal with documented case-study trade ($3K, exception clause), confirm scope, schedule kickoff',
        'Ryan audit: deliver scorecard + report, ship recording, capture testimonial + permission for case study',
      ],
    },
    {
      m: 2, gate: 'First case study published · 2nd audit prospect engaged',
      weeks: [
        'Chris Butler permission request for case study. Draft v1 of Ryan case study while material is fresh',
        'Case study published on flashfusion.co. Distribution to LinkedIn + The Prompt + Load-Bearing teaser',
        'Audit pipeline: 5 warm-contact outreach (no Ryan exception leaks). Lee Chong Ming pitch gate-check (site live? playbook URL?)',
        '2nd audit prospect: discovery call. Ryan 30-day follow-up scheduled',
      ],
    },
    {
      m: 3, gate: 'Lee Chong Ming pitch sent · Audit #2 delivered',
      weeks: [
        'Playbook URL ships if not already (gate for Lee pitch). Lee Chong Ming pitch finalized — Moltbook competence story angle',
        'Audit #2 proposal at $4,500 floor (no exception). Audit pipeline tracking ops dashboard updated',
        'Audit #2 delivered. Capture lessons from #1 → #2 quality gaps. Sprint product positioning sketched',
        'Audit #3 inquiry → proposal. Q1 retrospective draft',
      ],
    },
    {
      m: 4, gate: '3 audits delivered · Sprint product positioning locked',
      weeks: [
        'Q1 review: audits delivered, conversion rate, what\'s working, what to drop. Adjust positioning if needed',
        'Sprint product: lock 5-day curriculum from Chris Butler suite + Ryan/Audit #2 learnings. Pricing confirmed $5K fixed',
        'First Sprint inquiry conversation. Audit #4 proposal',
        'Sprint #1 scoping + scheduling. Audit #4 delivery',
      ],
    },
    {
      m: 5, gate: 'PEAK · First Sprint delivered · Load-Bearing newsletter launch',
      weeks: [
        'Sprint #1 Day 1-2: skills foundation. Audit pipeline: 2 active proposals running parallel',
        'Sprint #1 Day 3-5: implementation week. Document gotchas in real-time for v2 curriculum',
        'Sprint #1 close: hand-off doc, capture testimonial, schedule 30-day check-in. Audit #5 inquiry',
        'Load-Bearing newsletter Edition 1 launch. Sprint #2 inquiry. Audit #5 proposal at floor',
      ],
    },
    {
      m: 6, gate: '5 audits delivered · 2 sprints in pipeline · First Retainer conversation',
      weeks: [
        'Mid-year retro begins. Audit cadence: are 5/month sustainable given Wed/Fri schedule?',
        'Retainer conversation #1: scope, deliverables, $2K/mo math, what makes the retainer worth $24K/year to a client',
        'Audit #5 delivery. Sprint #2 scoping. Newsletter Edition 2-3 cadence locked weekly',
        'Mid-year retro published as Prompt edition. Q3 plan locked. Lafu technical co-founder conversation if not yet',
      ],
    },
    {
      m: 7, gate: 'First Retainer signed · Audit + Sprint cadence operational',
      weeks: [
        'First Retainer signed. Onboarding protocol drafted. Define first-90-days deliverables',
        'Retainer client: first deliverable shipped. Audit #6 inquiry → proposal',
        'Audit #6 + Sprint #2 in parallel. Capacity check honest — what\'s breaking, where',
        'Sprint #2 close. Retainer cadence operational. Newsletter edition 7',
      ],
    },
    {
      m: 8, gate: 'Anthropic Partner application status known · Mid-year financials honest',
      weeks: [
        'Anthropic Partner Network application: portfolio review, draft submission',
        'Anthropic Ambassador application complete + submitted',
        'Audit #7. Mid-year financial check vs $222K trajectory. Honest math, no smoothing',
        'Audit #7 close. Repositioning decision if 30%+ off trajectory. Newsletter edition 11',
      ],
    },
    {
      m: 9, gate: '7-9 audits cumulative · 2-3 Sprints · 1-2 Retainers',
      weeks: [
        'Audit #8 inquiry. Lafu technical co-founder formalization conversation (if pending)',
        'Audit #8 + Sprint #3 simultaneous delivery. Quality hold-the-line',
        'Retainer #2 conversation. Use Retainer #1 6-month track record as evidence',
        'Audit #8 close. Retainer #2 signed if traction. Q3 retrospective',
      ],
    },
    {
      m: 10, gate: 'PEAK · vCAIO offer drafted · Service line maturity',
      weeks: [
        'vCAIO offer drafting: package scope, pricing ($X/mo), differentiation vs Retainer, why month 12+ not earlier',
        'Audit #9 + Sprint #4 in parallel. Audit pipeline at 5 active',
        'vCAIO offer review with Lafu (if formalized) or self-critique. Audit #9 close',
        'Audit #10. Sprint #4 close. vCAIO offer published on site but inactive — gate-keeper not order-taker',
      ],
    },
    {
      m: 11, gate: '10-12 audits cumulative · Anthropic Architect cert sit',
      weeks: [
        'Audit #11. First vCAIO conversation if prospect appears (no chasing — gate-keeper posture)',
        'Audit #11 close. Anthropic Architect cert sit. Pass or document remediation',
        'Audit #12 + Sprint #5 if pipeline supports',
        'Year flagship piece: anchor case study published. Cross-arc feed to Brand work',
      ],
    },
    {
      m: 12, gate: 'Year retrospective · $222K assessment honest · Y2 plan locked',
      weeks: [
        'Year retrospective: revenue honest. Where vs $222K. What worked, what didn\'t, what to drop',
        'Y2 plan: vCAIO activation (or not), audit pipeline depth, Sprint productization v2',
        'Y2 plan published. Anthropic Partner status update. INT subcontract Phase 2 review',
        'Year close. Q1 Y2 commitments locked. Newsletter edition 50',
      ],
    },
  ],
  yearGate: 'By M12, FlashFusion is a service line — not a side project, not an experiment, not a brand. The $222K is the honest assessment marker, not the goal. The goal is the ladder operating.',
  claims: [
    'Year 1 target of $222K reflects the math of: 12 audits × $4,500 = $54K · 5 Sprints × $5,000 = $25K · 2 Retainers × $2,000 × 6mo avg = $24K · plus repeat business, referrals, and price expansion = ~$103K + buffer to $222K. Achievable but assumes the ladder functions; $222K disappears if any rung stalls.',
    'The Ryan Anderskow $3,000 case-study trade is documented as a one-time exception in private records. It does not appear in any public artifact, pricing page, or proposal template. Exceptions that leak become floors.',
    'Weekly sprints are indicative, not prescriptive. M5 PEAK week assumes first Sprint sale by M4 — if pipeline lags, M5 shifts to M6 and the whole arc compresses. Gates are the load-bearing commitments; weekly sprints are scaffolding.',
    'The Lee Chong Ming pitch gate (flashfusion.co live + playbook URL) is structural, not motivational. Sending the pitch before the site backs it produces a bad outcome that\'s harder to recover from than waiting.',
    'Anthropic Architect cert sits in M11 — late in the year deliberately. The cert is credibility infrastructure for vCAIO, not a prerequisite for audits/sprints. Earlier-in-year cert sits compete with revenue work for the same hours.',
    'This arc is for FlashFusion only. ChaosClubCo and Memoir have their own arcs. Cross-lane items (Brand work that feeds all three, Anthropic ecosystem work that touches FF + memoir) get tracked in the highest-priority lane\'s arc with cross-feed notes — not duplicated.',
  ],
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #09090f;
  --bg-2: #14111f;
  --bg-3: #1c1830;
  --fg: #ede9f5;
  --fg-dim: #8e89a3;
  --fg-mute: #55506b;
  --border: #221c33;
  --border-bright: #2e2748;
  --accent: #7c3aed;
  --accent-soft: #a78bfa;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.6;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(124,58,237,0.10), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1100px; margin: 0 auto; }

/* HEADER */
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

/* TRADEOFF */
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
  background: rgba(124,58,237,0.06); border-top: 1px dashed var(--border-bright);
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; color: var(--accent-soft); line-height: 1.5;
}
.tradeoff-principle-label {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 9.5px; letter-spacing: 0.24em; color: var(--accent);
  text-transform: uppercase; margin-right: 12px;
}

/* MONTHS */
.months {
  border: 1px solid var(--border); background: var(--bg-2);
  margin-bottom: 36px;
}
.month {
  display: grid; grid-template-columns: 80px 1fr;
  border-top: 1px solid var(--border);
}
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
.month-gate.peak .month-gate-text { color: var(--accent-soft); }

.weeks {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
}
.week {
  display: grid; grid-template-columns: 24px 1fr; gap: 8px;
  align-items: start; padding: 6px 0;
}
.week-num {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 13px; color: var(--accent); line-height: 1.4;
}
.week-text { font-size: 11.5px; color: var(--fg-dim); line-height: 1.55; }

/* YEAR GATE */
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

/* CLAIMS */
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

export default function FlashFusionArc() {
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
              Horizon <strong>12 months</strong> · {ARC.meta.target} · Lane <strong>FlashFusion</strong>
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
            {ARC.monthly.map(m => {
              const isPeak = m.gate.startsWith('PEAK');
              return (
                <div key={m.m} className="month">
                  <div className="month-num">
                    M{m.m.toString().padStart(2, '0')}
                    <div className="month-num-sub">Q{Math.ceil(m.m/3)}</div>
                  </div>
                  <div className="month-body">
                    <div className={`month-gate ${isPeak ? 'peak' : ''}`}>
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
              );
            })}
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
