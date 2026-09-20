import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Briefcase, Compass, TrendingUp } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month AIaaS Business Arc
// Kyle-specific: FlashFusion customization service + Intinc dept formation
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'DEFINE',
    subtitle: 'Name what you sell. Build the evidence base. Systematize the proposal.',
    months: [
      {
        n: 1,
        title: 'Service architecture — what you actually sell',
        why: 'Most consultants never clearly define their offer. Vague services attract vague clients and produce variable margins. You have 45+ builds. Pick three to five things you will actually sell — not "AI consulting."',
        weeks: [
          'Service taxonomy: name 3–5 specific SKUs with defined deliverables, timelines, and out-of-scope clauses. Not categories — sellable units.',
          'Pricing model decision: project-based vs. retainer vs. productized service. Pick one as your primary motion and write down why.',
          'Ideal client profile: who can write the check, who benefits, who signs the SOW. Not demographics — write the pain profile in their words.',
          'Competitive positioning: why you over a Big 4 AI practice, a freelancer, or an internal hire. Write it in two sentences. If you cannot, the positioning is not clear yet.',
        ],
        gate: 'A one-page service catalog: 3 SKUs, each with a price, a deliverable, and what is explicitly not included.',
      },
      {
        n: 2,
        title: 'Build the evidence base',
        why: 'You have 45+ products. Almost none of them are positioned as case studies. Every pitch without proof is a trust ask. Every pitch with proof is a demonstration.',
        weeks: [
          'Portfolio audit: identify the 5 builds that best demonstrate AIaaS value. Score each on: measurable outcome, client recognizability, and replicability.',
          'Write a case study for each of the top 3: problem stated in client language, approach in one paragraph, outcome with a number — even an internal estimate.',
          'Build the credibility stack: cert logos, case study PDFs, 2–3 testimonial-style quotes from real colleagues or stakeholders.',
          'One-page capability brief — the thing you send before a discovery call. Problem you solve → proof you can → next step. No more than one page.',
        ],
        gate: '3 publishable case studies and a capability brief you would not be embarrassed to send to Dave or Jackie.',
      },
      {
        n: 3,
        title: 'Proposal and SOW infrastructure',
        why: 'Every hour you spend writing a custom proposal from scratch is margin erosion. The proposal is a product. Build it once, deploy it repeatedly.',
        weeks: [
          'Discovery call script: 10 questions that qualify AND scope simultaneously. The goal is to walk out knowing whether to write a proposal.',
          'SOW template per SKU: fixed scope, explicit change order protocol, acceptance criteria, payment schedule. One template per SKU from month 1.',
          'Proposal deck template: 8 slides max. Problem → approach → proof → team → pricing → timeline → risk → next step.',
          'Mock run: run a discovery call + proposal cycle against a real or simulated client need. Time it. Fix what is slow.',
        ],
        gate: 'A proposal packet — discovery script, SOW template, deck — that you could send Monday morning without editing the structure.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'PITCH',
    subtitle: 'The Intinc business case. The pilot engagement. The delivery operating system.',
    months: [
      {
        n: 4,
        title: 'The Intinc AIaaS business case',
        why: 'The department does not exist until leadership approves it. This month is the political and financial work. Daniel is the first gate. Dave and Jackie are the second. You need a business case, not a conversation.',
        weeks: [
          'Market framing: what is the addressable opportunity for an AIaaS service line inside a mid-sized engineering org? Use real numbers — Gartner 75%/50% stats are verified; use them.',
          'Internal audit: how much AI work is Intinc doing today that is unbilled or under-leveraged? Estimate the revenue gap.',
          'Department structure proposal: headcount year one, reporting line under Daniel, cost center vs. profit center decision, success metrics for 12 months.',
          'Present to Daniel. This is a real meeting with a real proposal document. Document the outcome, objections, and what he needs to see next.',
        ],
        gate: 'A written business case in front of Daniel with a clear yes / no / revisit decision recorded.',
      },
      {
        n: 5,
        title: 'Pilot engagement — real client, real scope',
        why: 'Theory about what you sell is worthless without a real engagement. The pilot client can be an internal Intinc team, CLC, or a warm external contact — but it must involve a real deliverable and a real timeline.',
        weeks: [
          'Identify the pilot client. Low risk, high learning. Internal teams count if they have a real problem. CLC is a natural warm relationship.',
          'Run the discovery call using your script from M3. Document what you learned versus what you assumed going in.',
          'Deliver the engagement. Track actual hours versus estimated. Note every scope-creep moment.',
          'Post-mortem: what was the real margin? Where did scope creep? What would you change in the SOW? Write it down before you forget.',
        ],
        gate: 'One completed pilot engagement with a written post-mortem. Margin calculated on actual hours, not estimate.',
      },
      {
        n: 6,
        title: 'Delivery systems and repeatability',
        why: 'A freelancer delivers work. A service line delivers a repeatable experience. The difference is a delivery system. This month you build the operating system for every future engagement.',
        weeks: [
          'Project management framework: kickoff agenda, weekly check-in format, status report template, close-out process. One document.',
          'Quality checklist per SKU: what does "done" look like? Who signs off? What does the client receive at the end?',
          'Subcontracting model: if volume exceeds your capacity, what does bringing in help look like? Rate, vetting criteria, client communication protocol.',
          'Client onboarding and offboarding templates: the experience from first invoice to final deliverable. Someone else should be able to run it.',
        ],
        gate: 'A delivery playbook another person could use to run an engagement without you in the room for 80% of it.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'EARN',
    subtitle: 'First external client. Price on real data. Partner Network as a lead source.',
    months: [
      {
        n: 7,
        title: 'First external client acquisition',
        why: 'Internal and warm leads are training wheels. An external client tests the full market proposition — cold positioning, real objection handling, competitive pressure. You need this data regardless of outcome.',
        weeks: [
          'Outreach channel decision: LinkedIn, Partner Network directory, referral from existing contact. Pick one and commit — do not spread thin across all three.',
          'First 5 qualified discovery conversations. Not pitches. Discovery calls where you ask all 10 questions and listen more than you talk.',
          'First external proposal sent. Track time from discovery to proposal, time to response, objections raised, and decision-maker access.',
          'Close or lose — document why either way. A lost deal with documented objections is worth more than a won deal you do not understand.',
        ],
        gate: 'A closed or formally lost external deal with documented objections and a one-page deal debrief.',
      },
      {
        n: 8,
        title: 'Pricing optimization — adjust on real data',
        why: 'Your M1 prices were informed guesses. After a pilot and an external deal, you have actual data on margin, perceived value, and what clients push back on. Use it.',
        weeks: [
          'Margin analysis across all delivered work so far. Actual hours versus estimated, scope delivered versus scoped, effective hourly rate per engagement.',
          'Value pricing calibration: what would the pilot client have paid for the outcome if they had known the result in advance? Compare to what you charged.',
          'Raise at least one SKU price or create a premium tier. Document the rationale — not "I deserve more" but "the market data supports this."',
          'Update all SOW templates, proposal decks, and the service catalog to reflect new pricing. Old pricing documents are a liability.',
        ],
        gate: 'At least one SKU repriced upward with a written rationale based on actual margin and value data.',
      },
      {
        n: 9,
        title: 'Partner Network and referral infrastructure',
        why: 'The Claude Partner Network directory is a passive lead source. Referrals from complementary practitioners are an active one. Both require infrastructure you do not currently have.',
        weeks: [
          'Claude Partner Network profile: complete, specific, case study links live. Not a placeholder. The kind of profile an enterprise buyer would click.',
          'Referral partner map: who else serves your ideal client without competing directly? Systems integrators, IT consultancies, fractional CTOs.',
          'First referral partner conversation: informal, exploratory. What would a mutual referral arrangement look like for both sides?',
          'CLC and community pipeline: convert the teaching relationship and ambassador credibility into client conversations. One explicit ask.',
        ],
        gate: 'One active referral relationship documented and a Partner Network profile a stranger could use to evaluate you.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SCALE',
    subtitle: 'Revenue milestone. Department decision. Systems for Y2.',
    months: [
      {
        n: 10,
        title: 'Revenue milestone — the real number',
        why: 'You set a target of $300K–$500K Y1. This month you compare reality to that target, understand the gap, and decide whether the model works or needs to change. Numbers are not judgment — they are information.',
        weeks: [
          'Revenue audit: total billed in months 1–9, categorized by SKU, client type (internal/external), and acquisition channel. Build a simple spreadsheet.',
          'Pipeline review: every active deal by stage, estimated close date, and deal size. What is the realistic 90-day number?',
          'Gap analysis: if you are behind the $300K target, what would close the gap — more volume, higher price, a different SKU mix, or a different client profile?',
          'Course correction decision: adjust one variable deliberately. Not everything. One lever, clearly stated, for Q4 execution.',
        ],
        gate: 'A revenue number you can defend to Daniel with a source spreadsheet. Gap to target stated plainly.',
      },
      {
        n: 11,
        title: 'Department formation pitch — Dave and Jackie',
        why: 'The AIaaS department either forms this year or it does not. You now have 10 months of real data — case studies, margins, a pipeline, and a delivery system. This is the pitch that matters.',
        weeks: [
          'Updated business case for Dave and Jackie: what happened in months 1–10? Real numbers, real clients, real outcomes. Not projections — actuals.',
          'Department charter draft: formal name, scope, headcount plan for Y2, first hire criteria and role description, reporting line.',
          'Full leadership presentation: 15 slides max. Market opportunity → Intinc position → what you built → what it costs to scale → what leadership decides today.',
          'The meeting. Document the decision and the exact conditions attached to it — even a "yes with conditions" is a yes.',
        ],
        gate: 'A formal decision from Dave and/or Jackie: yes (department forms), no (stay as internal practice), or pilot (time-boxed with named conditions).',
      },
      {
        n: 12,
        title: 'Systems, playbook, and Y2 plan',
        why: 'A department without documentation is a person. Build the operating system for what you created — so it can survive a busy quarter, a new hire, or a week you are sick.',
        weeks: [
          'Documentation sprint: all templates, processes, delivery checklists, and pricing in one organized location. Notion, Craft, or a SharePoint folder — pick one.',
          'Y2 revenue target and product roadmap: which new SKUs, which new client segments, which new acquisition channels. With assumptions exposed.',
          'Hire or partner plan: if the department forms, who is the first hire? What is the job description? If not, what is the subcontracting plan?',
          'Retrospective: what changed in your mental model of what this business is? What did you get wrong in M1 that you know now?',
        ],
        gate: 'A Y2 plan with a target, three stated assumptions, and the first three actions to execute in January.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — AIaaS Business Arc / warm amber on deep brown-black
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0c0905;
  --bg-2: #13100a;
  --fg: #f2e8d6;
  --fg-dim: #a8967a;
  --accent: #e8962a;
  --accent-2: #f5b85a;
  --green: #4ade80;
  --muted: #5a4e38;
  --card: #181309;
  --border: #2a2215;
  --border-bright: #3d3220;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,150,42,0.08), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(74,222,128,0.03), transparent 70%),
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

/* ---- MILESTONE STRIP ---- */
.milestone-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 48px;
  border: 1px solid var(--border);
}
.milestone {
  padding: 16px 18px;
  border-right: 1px solid var(--border);
}
.milestone:last-child { border-right: none; }
.milestone-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 6px;
}
.milestone-val {
  font-family: 'Instrument Serif', serif;
  font-size: 22px;
  font-style: italic;
  color: var(--accent);
  font-weight: 400;
  margin-bottom: 2px;
}
.milestone-sub {
  font-size: 11px;
  color: var(--fg-dim);
  line-height: 1.4;
}

/* ---- TRADEOFF ---- */
.tradeoff {
  border: 1px solid var(--accent);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(232,150,42,0.08), rgba(232,150,42,0.01));
  padding: 20px 24px;
  margin-bottom: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--accent);
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
.tension-box {
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px dashed var(--border-bright);
  background: rgba(232,150,42,0.03);
  font-size: 12.5px;
  color: var(--fg);
}
.tension-box strong { color: var(--accent); }

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
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

/* ---- MONTH CARDS ---- */
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
.month.open .month-body { max-height: 900px; }
.month-body-inner {
  padding: 4px 24px 24px;
  border-top: 1px dashed var(--border);
  margin-top: 4px;
}

/* ---- WEEKS ---- */
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
  background: rgba(232,150,42,0.05);
}
.week-label {
  font-size: 10px;
  color: var(--fg-dim);
  letter-spacing: 0.14em;
  padding-top: 3px;
  white-space: nowrap;
}
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text {
  color: var(--fg-dim);
  text-decoration: line-through;
  text-decoration-color: rgba(232,150,42,0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* ---- GATE ---- */
.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(74,222,128,0.3);
  background: rgba(74,222,128,0.04);
  align-items: start;
}
.gate-icon { color: var(--green); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--green);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

/* ---- PROGRESS ---- */
.progress-wrap {
  position: sticky;
  top: 0;
  background: var(--bg);
  padding: 12px 0 16px;
  margin-bottom: 24px;
  z-index: 10;
  border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--accent);
}
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: var(--accent);
  transition: width 0.4s ease;
}

/* ---- CLAIMS ---- */
.claims {
  margin-top: 72px;
  padding: 24px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  font-size: 11.5px;
  color: var(--fg-dim);
  line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent); background: rgba(232,150,42,0.1); padding: 1px 6px; font-size: 11px; }
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
  .milestone-strip { grid-template-columns: 1fr 1fr; }
  .milestone:nth-child(2) { border-right: none; }
  .milestone:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
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

export default function AIaaSArc() {
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

  const MILESTONES = [
    { label: 'Y1 revenue target', val: '$300K–500K', sub: 'Billed, not projected' },
    { label: 'SKUs defined', val: '3–5', sub: 'Specific, not categories' },
    { label: 'Case studies', val: '3 live', sub: 'Published, with numbers' },
    { label: 'Dept decision', val: 'M11', sub: 'Yes / no / pilot from Dave + Jackie' },
  ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Briefcase size={12} /> Learning Ops // Business Lane</p>
              <h1 className="title-serif">The <em>AIaaS</em> Arc.</h1>
              <p className="title-sub">
                12 months. The business lane. From a vague "AI consulting" offer to a defined
                service line, a closed pilot, an external client, and a formal department decision
                from Intinc leadership. Four phases, forty-eight weekly activities, twelve gated
                business checkpoints.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Lane: <strong>FlashFusion + Intinc</strong></div>
              <div style={{ marginTop: 4 }}>Stakeholders: <strong>Daniel · Dave · Jackie</strong></div>
              <div style={{ marginTop: 4 }}>Gate: <strong>Dept formation decision, M11</strong></div>
            </div>
          </div>

          {/* MILESTONE STRIP */}
          <div className="milestone-strip stagger">
            {MILESTONES.map((m) => (
              <div key={m.label} className="milestone">
                <div className="milestone-label">{m.label}</div>
                <div className="milestone-val">{m.val}</div>
                <div className="milestone-sub">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* TRADEOFF — the FlashFusion vs. Intinc tension is unique to this arc */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — this arc has a structural tension the others do not.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                FlashFusion and Intinc are two different business contexts. The service line work
                benefits both, but the department formation is Intinc-specific. The external client
                acquisition is FlashFusion-specific. Read both columns — and the tension note below.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>A defined, sellable service line — not "I do AI stuff"</li>
                    <li>Real margin data from real engagements, not estimates</li>
                    <li>A formal department decision from leadership — yes or no is both valid</li>
                    <li>Partner Network directory listing with actual case studies behind it</li>
                    <li>The Head of AIaaS role becomes a job description, not a vague aspiration</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>~4 hrs/week on business development, proposal writing, and admin vs. building</li>
                    <li>Political capital at Intinc — asking for a department costs something</li>
                    <li>If the external client work runs hot, the day job feels it</li>
                    <li>Pricing transparency creates anchoring that is hard to walk back</li>
                  </ul>
                </div>
              </div>
              <div className="tension-box">
                <strong>The structural tension:</strong> Intinc wants an internal AIaaS practice that serves their clients.
                FlashFusion is your independent brand that serves different clients. These can coexist — but only if you
                are explicit with Daniel about the boundary. Ambiguity here is the single biggest risk to this arc.
                Resolve it in writing before M4. The conversation is: "Here is what I do for Intinc, here is what
                I do independently, here is how they do not conflict."
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly activities complete</span>
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
                              {isDone
                                ? <CheckCircle2 size={16} className="week-check" />
                                : <Circle size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Business gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              CLAIMS &amp; ASSUMPTIONS
            </h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The $300K–$500K target is from your own playbook.</strong> It is
                an aspiration, not a validated market number. M10 is the first time you will know if the model supports
                it. Do not let the target drive bad pricing decisions before you have margin data.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The Intinc / FlashFusion boundary must be resolved before M4.</strong>
                This arc assumes you have an explicit, written agreement with Daniel about what is Intinc work and what is
                yours. Without it, M4's business case pitch is politically risky and M7's external client work is ambiguous.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Pilot client ≠ free work.</strong> The M5 pilot should be scoped and
                invoiced even if at a reduced rate. The margin data you get from an unpaid engagement is not valid for pricing
                decisions. Charge something.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>A "no" from Dave and Jackie in M11 is data, not failure.</strong>
                It tells you the department path is closed at Intinc and the independent FlashFusion path is the real one.
                Plan for both outcomes now so M11 does not feel like a crisis either way.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Load is LOW vs. the tech arcs —</strong> approximately <code>3–5
                hrs/week</code> of business development and administrative work. But it competes with the same calendar
                that holds your technical arc work. Business tasks expand to fill available time. Time-box them.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc is not a substitute for technical depth.</strong> Run it
                alongside Claude + Copilot arcs at minimum. A strong service line pitch with no technical credibility behind
                it is sales without a product.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
