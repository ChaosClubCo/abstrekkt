import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Handshake } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'PROFILE',
    subtitle: 'Partner Network profile optimized. Niche selection. Initial visibility. First inbound conversations.',
    months: [
      {
        n: 1,
        title: 'Niche selection — what use case do I want to be called about?',
        why: 'The Partner Network listing exists from Series 2 capstones, but generalist listings produce generalist results. M1 forces a deliberate niche choice — the specific use case, industry, or problem you want clients to find you for. Generalists compete on price and availability. Specialists compete on fit. The niche choice determines which conversations the Partner Network produces.',
        weeks: [
          'Niche audit — list the 5-8 use cases you have demonstrable depth in (Copilot Studio implementation, agentic eval, MCP servers, regulated-industry AI, voice agents, fullstack AI products, etc.). For each, rate: depth on a 1-5 scale, market demand on a 1-5 scale, fit with Intinc positioning on a 1-5 scale, and your genuine interest in doing more of this work on a 1-5 scale.',
          'The niche decision — pick 1-2 niches based on the audit. Three is too many for a 12-month positioning sprint. One can work if the niche has enough demand. The decision is binding for the year — re-niche-ing in M6 produces a year with no clear positioning. Document the decision and the reasoning.',
          'Competitive landscape for the chosen niche — who else lists in this niche? What do their profiles say? What are they not saying that you could? The Partner Network ecosystem is small enough that the competition can be mapped specifically, not abstractly.',
          'Niche-specific value proposition — three to five sentences that articulate why a client in this niche would choose you over the alternatives. The value prop is tested against three peers or potential clients before being finalized. If they cannot paraphrase it back, it is not done.',
        ],
        gate: 'A documented niche selection with depth/demand/fit/interest ratings. A niche-specific value proposition tested with three external readers. The competitive landscape for the chosen niche mapped specifically. The positioning is now concrete, not aspirational.',
      },
      {
        n: 2,
        title: 'Partner Network profile rewritten for the niche',
        why: 'M1 chose the niche. M2 rewrites the Partner Network listing, your LinkedIn bio, your kylerosebrook.com positioning, and anywhere else the niche needs to be reflected. The profile work is the visible artifact that turns the M1 decision into something a search engine, an Anthropic Partner team member, or a potential client can actually find.',
        weeks: [
          'Partner Network listing rewrite — title, description, specializations, case study placeholders. The listing is read by humans in the Anthropic Partner team and (implicitly) by their internal routing. Every word earns its place. Submit the revision and confirm it goes live.',
          'LinkedIn headline and About rewrite — the niche is now the primary positioning, not a secondary specialty. Most LinkedIn profiles try to do everything; this one does one specific thing very well. Document and ship.',
          'kylerosebrook.com positioning — the personal site reflects the niche where relevant. Lane discipline is maintained (kylerosebrook.com and FlashFusion remain distinct), but the niche-relevant credentials are surfaced.',
          'Secondary surfaces — the bio on The Prompt, the bio in any speaking engagements, any other places your professional positioning shows up. Consistency across surfaces signals serious positioning, not casual experimentation.',
        ],
        gate: 'Partner Network listing rewritten and live. LinkedIn and personal site positioning updated. Consistent niche positioning across all professional surfaces. The niche is now visible everywhere a client might find you.',
      },
      {
        n: 3,
        title: 'First inbound activation and tracking system',
        why: 'M3 is the activation month. The positioning exists; now the question is whether it produces inbound. M3 also builds the tracking system that lets you distinguish "Partner Network sourced" from "warm network sourced" from "direct outreach sourced" — the data that drives the next 9 months of decisions.',
        weeks: [
          'Outreach to Anthropic Partner team — a specific, professional message to the relevant Partner team contact introducing the niche positioning and asking what specifically helps them route relevant work to you. Most Partners never do this; the ones who do get measurably more routing.',
          'Inbound tracking system — a spreadsheet, Notion database, or CRM with fields for source, niche fit, conversation stage, outcome. Every inbound conversation gets logged. Without tracking, the Q3 channel analysis is impossible.',
          'First conversations — the existing warm network is the first inbound source. Reach out to 5-10 contacts who could refer Partner-relevant work, with the explicit niche framing. Document the conversations in the tracking system.',
          'Q1 close — by end of M3, the positioning is live, the tracking system is running, and at least one Partner-relevant conversation has happened (warm or inbound). The "no signal yet" outcome is also data — it tells you what M4-M6 marketing work is needed.',
        ],
        gate: 'Anthropic Partner team outreach completed with documented response. Inbound tracking system live. At least one Partner-relevant conversation logged. The infrastructure for evaluating Partner-sourced work is operational.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'CASE STUDIES',
    subtitle: 'Three case studies published. Specializations claimed. Depth demonstrated publicly. Inbound starts.',
    months: [
      {
        n: 4,
        title: 'First case study — the foundational proof',
        why: 'Case studies are the most undervalued and underused Partner Network asset. Most Partners list their company; few publish detailed case studies of their work. The asymmetry is real: a single well-written case study outperforms ten LinkedIn posts in terms of inbound conversion. M4 produces the first one.',
        weeks: [
          'Case study target selection — pick the engagement (Intinc internal, Customization Service deliverable, Series 1 or 2 arc capstone) that most directly demonstrates the M1 niche. Get permission from the relevant stakeholder. If permission is unclear, anonymize but keep specifics.',
          'Case study structure — problem, approach, what was built, results, key learnings. The format matters less than the specifics. Most case studies fail by being too abstract; this one succeeds by being specific. Word target: 1,500-3,000 words plus visuals.',
          'Drafting — the case study is written in your voice, not corporate marketing voice. The reader should feel like they are getting honest reflection from a practitioner, not a sales pitch. The "what didn\'t work" section is included; it builds credibility.',
          'Publishing — case study published on kylerosebrook.com (or FlashFusion site if more relevant), linked from Partner Network listing, announced on LinkedIn with a specific angle (not "I published a case study" but "here\'s what we learned about X"). The publishing is the leverage event.',
        ],
        gate: 'First case study published with specifics, results, and key learnings. Linked from Partner Network listing and announced on LinkedIn with a specific framing. The first piece of niche depth evidence is now public.',
      },
      {
        n: 5,
        title: 'Second case study and specialization claims',
        why: 'One case study is a data point. Two case studies on related themes start to look like a specialization. M5 produces the second case study and claims the specializations on Partner Network — Anthropic\'s formal way of saying "this Partner is specifically capable of X."',
        weeks: [
          'Second case study target — different engagement, same or adjacent niche. The repetition matters: showing depth across multiple engagements is what differentiates a specialist from someone who did the work once.',
          'Specialization claims on Partner Network — Anthropic Partner Network has formal specialization designations. Apply for the relevant ones for your niche. The application is typically lightweight but produces durable signal.',
          'Second case study published — same publishing motion as M4, refined based on what worked the first time. By M5, you have a publishing rhythm, not a one-off launch.',
          'Cross-linking — both case studies cross-reference each other. The pattern is visible: "this practitioner has done this kind of work multiple times." LinkedIn announcement of the second case study explicitly references the first.',
        ],
        gate: 'Second case study published. Formal Partner Network specialization claims submitted. Cross-linking between case studies in place. The depth claim is now backed by two pieces of public evidence.',
      },
      {
        n: 6,
        title: 'Third case study and Q2 close metrics',
        why: 'Three case studies in three months is the volume that turns case studies from "occasional content" into "evidence base." M6 also closes the quarter with honest metrics: is the Partner-sourced inbound starting to come, or is the positioning still invisible? The honest read shapes Q3.',
        weeks: [
          'Third case study target and draft — another related engagement. By M6, the format and voice are muscle memory; production is faster than M4.',
          'Third case study published and cross-linked with the first two. The case study library on your site is now a real asset; potential clients researching you find three pieces of depth evidence in a row.',
          'Inbound conversation review — over Q1-Q2, how many Partner-relevant conversations have happened? From what sources? Document patterns. If Partner Network itself is not generating inbound yet, what is driving the conversations that are happening?',
          'Q2 close metrics — number of inbound conversations, source breakdown, conversion-to-discovery-call rate, deals in pipeline. The metrics are honest and inform Q3. If the metrics are weak, Q3 needs more aggressive direct outreach. If strong, Q3 scales what is working.',
        ],
        gate: 'Three case studies published. Documented inbound metrics with source breakdown. A Q3 plan that responds to actual data, not assumptions about what Partner Network would do.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'REFERRALS',
    subtitle: 'Active referral generation. First Partner-sourced revenue. Direct outreach to specific opportunities.',
    months: [
      {
        n: 7,
        title: 'Active referral generation — the warm network worked',
        why: 'Inbound from Partner Network is passive; it takes 6-12 months to compound. Active referral generation is the higher-leverage M7 work — explicit conversations with the warm network about who they could refer you to. Most Partners never ask. The ones who do measurably outperform.',
        weeks: [
          'Referral outreach list — 20-30 people in your warm network who could plausibly refer Partner-relevant work. The list is specific: not "everyone I know" but "people whose work intersects with the niche."',
          'Referral conversations — direct, specific messages to the list. Not "do you know anyone who needs help" but "here is the specific kind of work I am taking on, who comes to mind?" The specificity produces 5x the response rate of generic asks.',
          'Follow-through on referrals received — every referral that comes in is responded to within 24 hours. Most referrals die in slow founder response. The discipline of "drop everything for a referral" is what makes the referral channel work.',
          'Referral tracking — every referral logged with source, fit, conversation stage, outcome. The tracking reveals which referral sources are highest quality. By M9, you will know which 3-5 people in the warm network are your best referrers.',
        ],
        gate: 'Referral outreach completed to 20-30 warm contacts with documented responses. At least 3-5 active referrals generated. Tracking system showing source quality patterns. The referral channel is now active, not passive.',
      },
      {
        n: 8,
        title: 'First Partner-sourced or Partner-adjacent engagement closed',
        why: 'M8 is the month where the positioning produces revenue, not just conversations. The first Partner-sourced engagement (or Partner-adjacent referral) closes — billable work that came specifically from the Partner Network positioning, not from existing warm network. The first close is the validation moment.',
        weeks: [
          'Pipeline review — from Q1-Q2 conversations and Q3 referrals, what deals are in pipeline? List them, rate likelihood, identify next action for each. The pipeline review surfaces deals that are close but stalled.',
          'Close work — actively close the highest-likelihood deal in pipeline. Proposal, pricing, contract, kickoff. The close work is unglamorous but specific. Most pipeline deals die from founder neglect, not from buyer rejection.',
          'First engagement kickoff — the deal closes and the work begins. The execution is in scope of the niche, demonstrating the M1 thesis was right. The engagement itself becomes the M11 case study candidate.',
          'Pipeline replenishment — closing one deal empties the pipeline. M8 also seeds the next pipeline through continued referral outreach and content. The discipline is in maintaining pipeline at the same time as executing on closed work.',
        ],
        gate: 'First Partner-sourced or Partner-adjacent engagement closed and kicked off. Pipeline replenished with 3-5 new conversations. Documented learnings about what specifically drove the close (positioning, case studies, referral, niche fit).',
      },
      {
        n: 9,
        title: 'Direct outreach to specific opportunities',
        why: 'Inbound + referral is the foundation; direct outreach is the accelerant. M9 adds deliberate outbound work targeting specific opportunities in the niche — companies you know need this work, conversations you can initiate without waiting for inbound. The mature Partner positioning combines all three channels.',
        weeks: [
          'Target list — 30-50 companies or contacts that map specifically to the niche. Not "all consulting prospects" but "specifically these companies because of these specific signals." The list quality determines the response rate.',
          'Outreach sequences — multi-touch, niche-specific outreach with the case studies as proof points. Most outbound is generic; niche-specific outbound with concrete depth evidence converts measurably better. Sequence over 2-3 weeks.',
          'Response handling — every response (positive, negative, neutral) gets logged. Negative responses are also data; they reveal positioning gaps or wrong-fit prospects. Positive responses convert to discovery calls.',
          'Mid-quarter pipeline review — by mid-M9, the combined channels (Partner inbound + warm referrals + direct outbound) should be generating 3-5 active conversations per month. If under, the next month adjusts which channel gets more investment.',
        ],
        gate: 'Direct outreach campaign executed against 30-50 targets with documented response rates. Combined channel pipeline of 5-10 active conversations. The Partner positioning is now producing predictable conversation flow, not occasional luck.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SCALE',
    subtitle: 'Closed engagements compound. $200-500K annual run-rate. Y2 plan: deepen niche or expand specializations.',
    months: [
      {
        n: 10,
        title: 'Multiple engagements running and operational maturity',
        why: 'M10 is the operational test. Multiple engagements running simultaneously means context-switching cost, calendar management, quality maintenance across deliverables. The discipline that prevents quality drift while running 2-4 engagements in parallel is the difference between a real Partner business and a one-deal-at-a-time freelance practice.',
        weeks: [
          'Engagement portfolio review — what is in flight? Quality of each? Risk of slippage on any? The review is honest, not optimistic. Most quality issues compound silently before becoming visible; the M10 review catches them early.',
          'Operational systems — calendar discipline (focus blocks per engagement), communication discipline (per-client async cadence), invoicing discipline (monthly, not deal-end). The systems are what allow scale without proportional founder time.',
          'Quality discipline — for each active engagement, the deliverable quality bar is maintained even as engagement count grows. If quality drifts on any engagement, the engagement count is too high. The discipline is in reducing count before quality breaks.',
          'Pipeline maintenance — even with multiple engagements running, the pipeline continues to be fed. Stopping pipeline work because "you have enough" is the failure mode that produces Q1-of-Y2 deal droughts. Pipeline work continues at 20-30% of the cadence even during heavy execution months.',
        ],
        gate: '2-4 engagements running simultaneously with documented quality maintenance. Operational systems for multi-engagement work in place. Pipeline maintained despite execution load. The Partner business is now operationally mature.',
      },
      {
        n: 11,
        title: '$200-500K annual run-rate and Y2 strategic decision',
        why: 'M11 is the run-rate and strategic-decision month. By M11, the trailing-12-months Partner-sourced revenue should be in the $200-500K range depending on niche and engagement size. The exact number matters less than the trajectory — is this scaling, sustaining, or stalling? The Y2 decision flows from the honest read.',
        weeks: [
          'Y1 financial close — Partner-sourced revenue, Partner-adjacent revenue, total revenue, average engagement size, time-to-close. The data is documented for tax purposes and strategic clarity.',
          'Three Y2 scenarios written: Deepen (same niche, larger engagements, premium positioning, $300-600K target) — Expand (add a second niche, build out specializations, $400-800K target) — Sustain (current cadence, stable revenue, focus on quality of life, $250-400K target). Each scenario with specific tradeoffs.',
          'Strategic conversation with Daniel and external advisor — the decision is consequential. Daniel\'s perspective on how the Partner work intersects with Intinc and Head of AIaaS path. External advisor (peer Partner, Anthropic Partner team contact, business mentor) on what the data suggests.',
          'Y2 decision documented and committed. The decision shapes M12 work and the Personal Brand arc Q4 work. The decision is binding for Y2 with one explicit review point in Y2 Q2.',
        ],
        gate: 'Y1 financial picture documented honestly. Three Y2 scenarios with tradeoffs written. Strategic conversations completed with Daniel and external advisor. Y2 decision committed.',
      },
      {
        n: 12,
        title: 'Year retrospective and portfolio integration',
        why: 'M12 closes the year by integrating the Partner Network work into the broader portfolio. The case studies, the engagements, the referral network, the positioning all become Brand arc content, AIaaS service line credibility, and Y2+ infrastructure. M12 makes the integrations explicit.',
        weeks: [
          'Fourth case study published — from a Q3 or Q4 engagement. The case study library is now four deep; the depth claim is no longer fragile.',
          'Brand integration — the Partner Network track record is now featured on LinkedIn, on kylerosebrook.com, in Intinc internal positioning, in any other professional surface. The credential is leveraged everywhere it can be.',
          'Referral network formalization — the 5-10 highest-quality referrers from Q3-Q4 are explicitly thanked, possibly with a small gift or a formal referral acknowledgment. The relationships are Y2 infrastructure; treat them as such.',
          'Year retrospective published — what changed when the Partner Network became the primary channel? What did you learn about positioning, niches, referrals, closing? The retrospective is both closure and Y2 strategic context.',
        ],
        gate: 'Fourth case study published. Brand integration complete across all surfaces. Referral network relationships formalized. Year retrospective published. The Partner Network is now portfolio infrastructure, not a single-year experiment.',
      },
    ],
  },
];

const STAGES = [
  { label: 'Element 1', name: 'Profile',         sub: 'Partner listing · M2',         fill: 100 },
  { label: 'Element 2', name: 'Case Studies',    sub: '4 published · M4-M12',         fill: 95  },
  { label: 'Element 3', name: 'Specializations', sub: 'Niche claims · M5',            fill: 85  },
  { label: 'Element 4', name: 'Referrals',       sub: 'Warm network active · M7',     fill: 90  },
  { label: 'Element 5', name: 'Direct Pipeline', sub: 'Outbound + close · M8-M10',    fill: 80  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #150612; --bg-2: #1f0a1a; --fg: #f4dde9; --fg-dim: #a68095;
  --accent: #be185d; --accent-2: #ec4899; --accent-dim: #831843;
  --gate: #a855f7; --muted: #3a1525; --card: #1f0a1a; --border: #2a0e1f; --border-bright: #3d1530;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(190,24,93,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(168,85,247,0.05), transparent 65%), var(--bg); padding: 48px 24px 96px; }
.container { max-width: 1120px; margin: 0 auto; }
.header-grid { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px); line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg); }
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }
.stages-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden; }
.stage-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.stage-item:last-child { border-right: none; }
.stage-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.stage-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px; color: var(--accent); }
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(190,24,93,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(190,24,93,0.07), rgba(190,24,93,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.niche-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(190,24,93,0.03); font-size: 12.5px; color: var(--fg); }
.niche-note strong { color: var(--accent); }
.quarter-rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.qtab { padding: 20px 18px; cursor: pointer; background: transparent; border: none; border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim); transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative; }
.qtab:last-child { border-right: none; }
.qtab:hover { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent); }
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400; }
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }
.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--accent); }
.month-head { padding: 20px 24px; cursor: pointer; display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none; }
.month-num { font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1; color: var(--accent); font-style: italic; font-weight: 400; }
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }
.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright); cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.week:hover { border-left-color: var(--accent); }
.week.done { border-left-color: var(--accent); background: rgba(190,24,93,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(190,24,93,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(168,85,247,0.3); background: rgba(168,85,247,0.04); align-items: start; }
.gate-icon { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text { font-size: 13px; color: var(--fg); font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45; }
.progress-wrap { position: sticky; top: 0; background: var(--bg); padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border); }
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }
.claims { margin-top: 72px; padding: 24px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims code { color: var(--accent-2); background: rgba(190,24,93,0.1); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function PartnerAnchorArc() {
  const [activeQ, setActiveQ] = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done, setDone] = useState(new Set());
  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);
  const toggleWeek = (key) => { setDone((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; }); };
  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">
          <div className="header-grid">
            <div>
              <p className="kicker"><Handshake size={12} /> Learning Ops // Output Lane</p>
              <h1 className="title-serif">The <em>Anchor</em> Arc.</h1>
              <p className="title-sub">
                12 months. From Partner Network listing to Partner Network as primary revenue
                channel. Niche selection at M1, three case studies in Q2, active referral
                generation in Q3, multiple engagements running in Q4. Target: $200-500K annual
                revenue routed through Partner Network or Partner-adjacent referrals. The lowest-risk
                Lane B arc because the demand already exists — the question is positioning.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Target: <strong>$200-500K · annual</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Partner as primary channel</strong></div>
            </div>
          </div>

          <div className="stages-strip">
            {STAGES.map((s) => (
              <div key={s.name} className="stage-item">
                <div className="stage-label">{s.label}</div>
                <div className="stage-name">{s.name}</div>
                <div className="stage-sub">{s.sub}</div>
                <div className="stage-bar"><div className="stage-bar-fill" style={{ width: `${s.fill}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — findable for one specific use case vs available for everything.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Generalists compete on price and availability. Specialists compete on fit. The
                Partner Network produces dramatically different conversations depending on which
                positioning the listing represents. Generalist listings produce "could you maybe
                help with..." conversations that go nowhere. Niche listings produce "I have this
                specific problem and you came up specifically" conversations that close. The arc
                forces niche selection at M1 and commits to it for the year — including saying no
                to work outside the niche.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Partner Network as primary revenue channel — the lowest-risk Lane B path because the demand already exists; you are positioning into an existing market, not creating one</li>
                    <li>$200-500K annual revenue routed through Partner Network or Partner-adjacent referrals — meaningful income with the highest per-hour leverage of any Lane B arc</li>
                    <li>The case study library (4 published) is a durable brand asset that compounds beyond Y1 — each case study earns inbound for years after publication</li>
                    <li>Niche specialization positions you as "the person for X" rather than "an AI consultant" — the difference between being one of hundreds and being one of a handful</li>
                    <li>Compounds with every other arc — Series 1 + 2 work becomes Partner Network credibility, and Partner work feeds back into Brand and AIaaS positioning</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>LOW-MED load (4-8 hrs/week) during build months, spiking to MED-HIGH (10-15 hrs/week) during engagement execution months — variable, depends on close rate</li>
                    <li>The niche choice means actively saying no to out-of-niche work — including work that pays. Most practitioners cannot do this; the discipline is real</li>
                    <li>Inbound takes 6-12 months to compound — Q1 and Q2 may produce minimal direct Partner-sourced revenue. The work compounds late in Y1 and substantially into Y2</li>
                    <li>Out-of-pocket costs are modest (<code>$1-5K</code> total for case study production, possible design help, possible CRM upgrade) but the time cost of case study writing is significant</li>
                  </ul>
                </div>
              </div>
              <div className="niche-note">
                <strong>The niche rule that determines whether this arc produces real revenue:</strong>{' '}
                the M1 niche choice is binding for the year. Saying no to out-of-niche work is the
                discipline that makes the positioning credible. Practitioners who choose a niche and
                then accept any work outside it produce a year of "I am specialized in X but I also
                do Y and Z" — which reads to potential clients as "not actually specialized in
                anything." The discipline is in the saying no, not in the choosing.
              </div>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>

          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button key={q.quarter} className={`qtab ${i === activeQ ? 'active' : ''}`} onClick={() => setActiveQ(i)}>
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
                            <div key={key} className={`week ${isDone ? 'done' : ''}`} onClick={() => toggleWeek(key)}>
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
                          <div className="gate-label">Pipeline gate · M{m.n}</div>
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
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />CLAIMS &amp; ASSUMPTIONS</h4>
            <ul>
              <li><strong style={{ color: 'var(--fg)' }}>LOW-MED load during build months (4-8 hrs/week), spiking to MED-HIGH during execution (10-15 hrs/week).</strong> Variable based on close rate. Q1-Q2 are positioning-heavy and lower load. Q3-Q4 spike when engagements close and execute. Plan for variable load, not steady cadence.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This is the lowest-risk Lane B arc because demand already exists.</strong> Unlike Course arc (need to build audience) or SaaS arc (need to build product), the Partner Network demand exists today. The arc is about positioning into existing demand, not creating new demand. The risk profile is materially lower than the other Lane B paths.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Revenue compounds late in Y1 and substantially into Y2.</strong> The case studies, the referral network, the inbound conversations all take 6-12 months to compound. Q1-Q2 may produce minimal direct Partner-sourced revenue. The arc that quits at M6 because "nothing is happening" misses the Q3-Q4 compounding moment that justifies the year.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The niche choice is binding and the discipline of saying no is the work.</strong> Most practitioners who attempt niche positioning sabotage it by accepting out-of-niche work when offered. The discipline of saying no is what makes the positioning credible. If saying no to paid work feels impossible, the niche choice will not produce its intended effect.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The 12-18 month real project compressed to 12 months.</strong> Most successful Partner Network specialists take 18-24 months to reach the M11 run-rate. The arc compresses by being aggressive on case study production (4 in 12 months is fast) and by combining inbound + referral + direct outreach simultaneously. Accept that M12 may land at the lower end of the $200-500K range with Y2 reaching the higher end.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This arc directly feeds AIaaS arc and Brand arc Q4 work.</strong> Partner Network track record is direct AIaaS service line credibility for Intinc. Case studies are direct Brand arc Q4 content. Sequencing Partner Anchor arc alongside or just before AIaaS and Brand work produces the highest cross-arc leverage in any combination.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
