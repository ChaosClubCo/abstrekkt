import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, LineChart } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month AI Product Strategy Arc
// Kyle-specific: from "I build AI systems" to "I advise on which AI systems to build."
// PRDs for agentic features, AI metrics, roadmapping, advisory-layer positioning.
// The fastest path to Head of AIaaS strategic layer.
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATIONS',
    subtitle: 'Product thinking as a distinct discipline, AI discovery methods, the artifact library.',
    months: [
      {
        n: 1,
        title: 'Product thinking — the discipline most engineers underweight',
        why: 'You can build production AI systems. That is a different skill from deciding which AI systems to build, for whom, with what success criteria. Most engineers conflate "I would use this" with "users will value this" — the discipline of product thinking is the rigor that prevents the conflation. M1 is the foundation, learned deliberately rather than absorbed accidentally.',
        weeks: [
          'Read the core canon: "Inspired" (Cagan), "Continuous Discovery Habits" (Torres), "Lean Startup" (Ries) — the chapters on validated learning. Take notes on the frameworks: opportunity-solution tree, JTBD, problem-solution-validation. This is the vocabulary every later month uses.',
          'Product vs. engineering thinking: the differences in default questions, success metrics, and time horizons. Engineers ask "can we build it?" PMs ask "should we build it, for whom, and how will we know it worked?" Build a side-by-side comparison from your own builds — what was the engineering answer vs. the product question that was actually missed?',
          'AI-specific product thinking: what changes when the system is non-deterministic, when the cost model is per-token, when the user has to learn a new interaction paradigm. Most product frameworks assume deterministic systems — the AI adaptations are what separates "PM" from "AI PM."',
          'The audit: pick three things you have built (Bitwarden migration, Drive automation, one Customization Service deliverable). For each, write the PRD you should have written before building. Notice every assumption you made that a PRD would have surfaced. The audit is the case for the rest of the arc.',
        ],
        gate: 'A documented framework for AI product thinking applied to three of your own past builds. The retrospective PRDs reveal at least five assumptions per build that the engineering work skipped. The case for product discipline is now written in your own examples.',
      },
      {
        n: 2,
        title: 'Discovery — the work that happens before the build',
        why: 'Most AI engagements start with a solution ("build an agent that does X") and skip the discovery that would have produced a better question. M2 is the discovery toolkit — user interviews, JTBD, opportunity assessment — applied to AI specifically. The interviews that produce real signal rather than confirmation bias.',
        weeks: [
          'User interview methodology: the difference between leading and non-leading questions, the JTBD interview structure ("walk me through the last time you..."), the contextual inquiry pattern. Most engineers conduct user interviews badly — leading the witness, asking about features instead of problems. The methodology matters more than the willingness.',
          'Run three real interviews: an Intinc internal user about an AI workflow, a Customization Service client about their actual problem, a CLC contact about how they think about AI. Not pitches, not feedback sessions — discovery interviews. Document what surprised you.',
          'Opportunity-solution tree: Teresa Torres\' framework for connecting business outcomes to user opportunities to solution experiments. Build one for a real Intinc AIaaS opportunity. The exercise of mapping opportunities first, solutions second, is the discipline that prevents premature solution lock-in.',
          'Synthesis pattern: from three interviews to a single insight. The "what did we hear, what surprised us, what does it mean?" workflow. Most discovery dies at the data collection step — synthesis is what turns interviews into decisions. Build the pattern once on the real interviews from week 2.',
        ],
        gate: 'A complete opportunity-solution tree for one real AIaaS opportunity, built from three documented user interviews. The synthesis identifies at least one opportunity Daniel had not articulated and at least one solution candidate that was not yet on the table.',
      },
      {
        n: 3,
        title: 'The PRD as a product artifact',
        why: 'Every AI product engagement should start with a PRD. Most do not — the work happens in conversation and Slack and gets reconstructed from memory three months in. M3 is the PRD as a deliberate artifact. The format, the depth, the audience, and the discipline of writing it before building rather than after explaining it.',
        weeks: [
          'PRD formats: the one-page PRD (Amazon working backwards), the structured PRD (Linear-style), the longer narrative PRD (Stripe-style). Each is right for different contexts. Build templates for all three. The template is not the PRD — the discipline of using it is.',
          'AI-specific PRD sections: model selection rationale, latency requirements, cost-per-request modeling, evaluation criteria, failure modes and recovery, observability requirements, governance posture. These sections are not in standard PRD templates and they are the sections that prevent the worst engineering surprises.',
          'Write a real PRD: for one current Intinc AIaaS opportunity or one Customization Service deliverable, write the PRD you would want before building. Test it against Daniel or the client — does it answer the questions a thoughtful stakeholder would ask? Iterate until it does.',
          'PRD review patterns: the structured walkthrough, the silent reading + reactions pattern (Amazon-style), the assumption-challenge pass. Build the review protocol that catches gaps before the build, not after. The discipline of "let me push back on this PRD" is the moment product thinking earns its weight.',
        ],
        gate: 'A real PRD written for a real AIaaS opportunity, reviewed by at least one stakeholder, with documented changes from the review. PRD templates for three formats stored as reusable artifacts. The PRD discipline is now a starting move, not a retroactive explanation.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'METRICS + ROADMAPPING',
    subtitle: 'AI-specific success metrics. AI roadmapping under uncertainty. The first strategy document.',
    months: [
      {
        n: 4,
        title: 'AI metrics — defining what success means for non-deterministic systems',
        why: 'Standard product metrics (DAU, retention, conversion) translate badly to AI products. Was the agent\'s answer good? Did the user\'s job get done? Is the system getting better over time? M4 is the AI-specific metric layer — what to measure, how to define "good," and how to track quality improvement without conflating it with engagement.',
        weeks: [
          'AI metric taxonomy: outcome metrics (user job done), output metrics (quality of AI response), usage metrics (engagement with AI features), efficiency metrics (cost per task completed), quality drift metrics (is the system getting worse?). For each category, define one concrete metric for a real Intinc AIaaS use case.',
          'The "AI success" problem: when the model produces good output that nobody uses, the AI failed at the product level even if it succeeded at the model level. Build the framework for diagnosing "is this an AI quality problem, a product fit problem, or an adoption problem?" Most "the AI isn\'t working" complaints are not AI quality complaints.',
          'North-star and counter-metrics: every AI product needs both. North-star is the metric that defines success. Counter-metrics prevent the perverse incentives — "shorter responses" alone produces unhelpfully terse outputs; balance with "task completion rate" prevents it. Build north-star + counter for one real product.',
          'Cross-arc tie: the Eval arc M3 metrics work covers engineering eval metrics. This month covers product metrics. Both layers needed; both layers different. Document the layer separation explicitly so the engineering team and the product team are not running different metrics for the same system.',
        ],
        gate: 'A documented AI metrics framework for one real AIaaS use case: outcome, output, usage, efficiency, and drift metrics defined. North-star + counter-metrics articulated. The product-vs-engineering metric layer distinction made explicit.',
      },
      {
        n: 5,
        title: 'AI roadmapping under uncertainty',
        why: 'Traditional roadmapping assumes feature deterministic outcomes. AI roadmaps face two uncertainties most products do not: model capability uncertainty (will GPT-5 make this whole feature obsolete?) and user adoption uncertainty (will users actually use voice AI?). M5 is roadmapping discipline under these uncertainties.',
        weeks: [
          'Now-next-later roadmapping vs feature-list roadmapping: the format that survives the inevitable changes vs the one that needs constant updating. Build one now-next-later roadmap for an Intinc AIaaS service line. The format itself constrains overcommitting to dates.',
          'Bet-sizing under model capability uncertainty: "what would change if Claude 5 doubles in capability?" vs "what would change if frontier model capability stalls?" The scenario planning that prevents over-investing in capability moats that will not last and under-investing in product moats that compound.',
          'Adoption assumption surfacing: every roadmap has implicit adoption assumptions. "Users will pay for this" is an assumption, not a fact. Surface the assumptions, rate confidence in each, design validation work for the lowest-confidence ones. The roadmap that does not surface its assumptions is theatre.',
          'The opportunity backlog: a prioritized list of opportunities (not solutions) for an AIaaS service line. Each with a brief, a confidence rating, and a "what would have to be true for this to be worth doing?" Document the top 10 opportunities; rank by WSJF (the prioritization framework you already use).',
        ],
        gate: 'A now-next-later roadmap for one Intinc AIaaS service line with explicit scenario planning, surfaced adoption assumptions, and a WSJF-prioritized opportunity backlog of at least 10 items. The roadmap is one Daniel can act on, not one that needs additional context to be useful.',
      },
      {
        n: 6,
        title: 'The first strategy document',
        why: 'M1-M5 builds the toolkit. M6 ships the first real strategy document — a written artifact that takes a real AIaaS opportunity from problem space to recommended path. Not a PRD (that comes after strategy). Not a deck (that comes for the audience). The strategy document is the artifact that captures the thinking before either is needed.',
        weeks: [
          'Pick the opportunity: an Intinc AIaaS service line that does not yet have a strategy document, a Customization Service direction that needs explicit positioning, or a personal FlashFusion brand direction that needs strategy clarity. The opportunity has real stakes and a real decision-maker.',
          'Draft the strategy document: problem statement, who experiences the problem, current alternatives, our differentiation, the bet we are making, what would have to be true for it to work, the path from current state to bet-validated. 5-10 pages, written in narrative prose, not slide-deck bullets.',
          'Review and iterate: read it to Daniel (or the relevant stakeholder), capture every question, gap, and pushback. The questions are the diagnostic — they reveal the weak parts of the strategy. Iterate based on the questions, not the surface feedback.',
          'Decision and commitment: the strategy document is not done until it produces a decision. Yes, we are pursuing this with these constraints. No, we are not pursuing this because of these reasons. The strategy document that does not lead to a decision was a writing exercise — push for the decision moment.',
        ],
        gate: 'A complete strategy document for a real AIaaS opportunity, reviewed by Daniel or the relevant decision-maker, with documented questions/gaps from review and a recorded decision outcome (proceed, defer, kill). The strategy artifact produced a strategic decision, not just a document.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'ADVISORY PRACTICE',
    subtitle: 'Multiple PRDs shipped. AI product audits. Advisory engagement patterns. Cross-arc product reviews.',
    months: [
      {
        n: 7,
        title: 'Shipping multiple PRDs — the pattern that proves the discipline scales',
        why: 'M3 shipped one PRD. M7 ships three more in one month — different AI use cases, different stakeholders, different formats. The volume reveals which parts of the discipline transfer cleanly and which parts require domain-specific adaptation. The pattern that proves the practice scales, not just the example.',
        weeks: [
          'PRD #2: a fully-internal Intinc PRD — likely something around AI tooling, internal productivity, or operational efficiency. Different audience than the M3 client-facing PRD. Document the differences in format, depth, and stakeholder expectations.',
          'PRD #3: a FlashFusion Customization Service deliverable PRD. Even though Customization Service is more execution than product, a real PRD before each engagement prevents scope creep and surface assumptions. Apply the discipline to the format Customization Service actually needs.',
          'PRD #4: an external pitch PRD — for a prospect, not an existing client. The audience does not yet trust you. The PRD format and depth that builds credibility with a stranger differs from the format that works with Daniel. Adapt explicitly.',
          'PRD review pass on all four: what transferred cleanly? What had to be adapted? Where is the discipline now muscle memory, and where does it still require deliberate effort? The retrospective is the calibration the next quarter\'s work builds on.',
        ],
        gate: 'Four real PRDs shipped across different contexts (M3 + three new in M7). Documented retrospective on what transferred and what required adaptation. The discipline is now demonstrably reusable, not a one-off output.',
      },
      {
        n: 8,
        title: 'AI product audits — the advisory engagement pattern',
        why: 'Most AIaaS work is implementation. Higher-leverage work is advisory — the audit, the recommendation, the strategic critique that comes before the implementation. M8 builds the audit deliverable that lets you bill for thinking rather than building. The leverage shift that moves your hourly value substantially.',
        weeks: [
          'The audit format: scope (what we reviewed), method (how we reviewed it), findings (what we found), recommendations (what to do), priorities (what first), risks (what we cannot evaluate). The structure that produces actionable audits, not vague critiques.',
          'AI-specific audit dimensions: model selection, prompt architecture, retrieval pattern (if RAG), evaluation discipline, observability layer, cost model, governance posture, scalability ceiling. Each dimension has specific questions to ask and specific failure patterns to look for.',
          'Run a real audit: of one existing Intinc AI system (Copilot deployment, custom Foundry project, automation workflow) or one Customization Service deliverable. Apply the audit dimensions, write the findings, present to the system owner. The audit produces specific actionable items, not vague suggestions.',
          'Audit as service line: package the audit deliverable as a billable Intinc/FlashFusion service. Format (1-2 weeks), price (defined by audit depth), deliverable (written report + presentation), follow-on (implementation engagement). The audit is the wedge into higher-value advisory work.',
        ],
        gate: 'A complete AI product audit delivered for one real system with documented findings and accepted recommendations. The audit packaged as a named billable service line with format, price, and deliverable defined.',
      },
      {
        n: 9,
        title: 'Cross-arc product reviews — applying the discipline to your own portfolio',
        why: 'By M9 you have multiple arc artifacts in flight — Full-Stack apps, voice agents, edge AI deployments, MCP servers. Most practitioners ship these and move on. M9 applies the product discipline retroactively to your own portfolio — what does the product layer look like for each, and where are the gaps the engineering work skipped?',
        weeks: [
          'Portfolio inventory: list every "product" you have shipped across all arcs in the past 12 months. Full-Stack apps, voice agents, edge AI deployments, MCP servers, Customization Service deliverables. Each gets a product audit treatment in this month.',
          'Product audits, applied: for each portfolio item, the audit dimensions from M8 applied. Where is the product layer thin? Where is the user understanding shallow? Where are success metrics undefined? The discipline applied to your own work reveals what you would have caught earlier with M1-M3 in place.',
          'Cross-arc product roadmap: which portfolio items are worth deepening? Which are worth retiring? Which need product layer rebuild even if the engineering layer is solid? The roadmap that turns scattered builds into a coherent portfolio.',
          'The PM-self conversation: the documented retrospective on what changed in your engineering work when product discipline arrived. Where did you make different decisions than you would have without M1-M3? Where do you still default to engineering thinking? The honest self-assessment that calibrates Y2 work.',
        ],
        gate: 'Product audits completed for at least 5 portfolio items spanning multiple arcs. A cross-arc product roadmap identifying which to deepen, retire, or rebuild. A written self-assessment of how product discipline changed engineering decisions over the prior 12 months.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'POSITION + INFLUENCE',
    subtitle: 'The strategy advisory service line. Internal Intinc positioning. The published framework.',
    months: [
      {
        n: 10,
        title: 'The strategy advisory service line — packaged and priced',
        why: 'Twelve months of strategy work. M10 turns the practice into a formal Intinc/FlashFusion service line — packaged, priced, marketed, sold. The advisory layer that lets Intinc bill for thinking before building, which is where the higher-leverage revenue lives.',
        weeks: [
          'Service line definition: "AI Strategy Advisory" with three tiers — 1-day strategic workshop, 1-week strategy sprint, 4-week strategy engagement. Each with defined scope, deliverable, price, target client profile. The packaged service that turns advisory from "we also do strategy" into a primary offering.',
          'Pitch materials: a one-pager for each tier, a deck template, a sample deliverable (sanitized from M6 or M9 work). The materials a Daniel or a prospect can use to evaluate the service offering without needing additional context from you.',
          'First strategy advisory engagement (or paid pitch): pitch the service line to one warm prospect or close one internal Intinc engagement. The first dollar of advisory-only revenue validates the service line, even if it is a discounted introductory engagement.',
          'Pricing validation: what do comparable AI strategy advisory engagements cost from competing consultants and firms? Adjust if you are more than 30% off market without a reason you can articulate. The price signals positioning as much as it signals revenue.',
        ],
        gate: 'A formally defined AI Strategy Advisory service line with three tiers, pricing, deliverables, and pitch materials. At least one paid advisory engagement closed (or paid commitment received). The service line is now generating revenue separately from implementation work.',
      },
      {
        n: 11,
        title: 'Internal Intinc positioning + Head of AIaaS pathway',
        why: 'The Head of AIaaS pathway is partly about credentials (which this arc and the others produce) and partly about internal positioning (which has to be deliberate, not assumed). M11 is the conversation series with Daniel, Dave, and Jackie that positions you for the role rather than waiting to be considered for it.',
        weeks: [
          'Strategy briefing for Daniel: a formal presentation of the AIaaS strategic landscape — current state, opportunities, recommended bets, what Intinc would have to commit to for each. Not a status update, a strategic document delivered as the kind of brief a Head of AIaaS would deliver to a leadership team.',
          'Cross-functional positioning: similar briefings adapted for Dave and Jackie. Each cares about different things — operational fit, financial model, client implications. The same strategic content, three different presentations, three different conversations. Run them in the same week.',
          'The Head of AIaaS conversation: the explicit conversation with Daniel about the path to the role. What evidence does he need? What additional credentials, engagements, or experience? What is the realistic timeline? Get the answer in writing, not assumed. The conversation is the path; the silence is not.',
          'Personal brand integration: the strategy advisory work and the Head of AIaaS conversation become content for the Personal Brand arc Q4 work. The published reflections, the LinkedIn posts about advisory practice, the Prompt edition on AIaaS strategy. The brand work that signals the role before the title.',
        ],
        gate: 'Strategic briefings delivered to Daniel, Dave, and Jackie. A documented Head of AIaaS conversation with Daniel including required evidence, timeline, and decision criteria. Personal brand content drafted that signals the strategic positioning publicly.',
      },
      {
        n: 12,
        title: 'The published framework + year retrospective',
        why: 'M12 publishes the framework that compresses the year of strategy work into a reusable artifact. "Building AI Products: A Practitioner\'s Framework" or similar — the published artifact that turns the practice into brand asset and influences how other practitioners think about AI product strategy.',
        weeks: [
          'Draft the framework: the discovery-to-decision workflow for AI products, the PRD adaptations for AI specifically, the metric framework, the roadmapping under capability uncertainty, the audit dimensions. The intellectual content of the year compressed into a usable artifact.',
          'Polish and publish: long-form post or Substack standalone, GitHub repo with PRD templates and audit checklists, slide deck for the framework that can be delivered as a talk. The artifact other practitioners reference when thinking about AI product strategy.',
          'Distribution: cross-post in relevant practitioner communities (Mind the Product, Product School AI track, Pragmatic Engineer audience), submit to relevant newsletters, present the framework at one external venue (conference talk, podcast guest, internal Intinc all-hands).',
          'Year retrospective: what changed in your understanding when strategy became a discipline? What does Y2 look like — deeper specialization in regulated-industry AI strategy, formal product leadership role, or expanded advisory practice? The retrospective is the year\'s closing artifact and the bridge to whatever comes next.',
        ],
        gate: 'The AI product strategy framework published with at least one external distribution venue secured. Year retrospective written and integrated into Personal Brand arc and AIaaS arc Q4 work. The advisory practice is now demonstrable on a public artifact, not just engagement history.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STRATEGY STRIP — four product disciplines + one advisory practice
// ---------------------------------------------------------------------------
const STRATEGY_LANES = [
  { type: 'discipline', label: 'Discipline', name: 'Discovery',  sub: 'Interviews · M2',       fill: 90  },
  { type: 'discipline', label: 'Discipline', name: 'PRDs',       sub: 'Spec discipline · M3',  fill: 100 },
  { type: 'discipline', label: 'Discipline', name: 'Roadmapping', sub: 'Strategic plan · M5',  fill: 75  },
  { type: 'discipline', label: 'Discipline', name: 'Metrics',    sub: 'Success criteria · M4', fill: 80  },
  { type: 'practice',   label: 'Practice',   name: 'Advisory',   sub: 'Service line · M8–M10', fill: 95  },
];

// ---------------------------------------------------------------------------
// STYLES — AI Product Strategy Arc / rose-red on warm dark
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #110608;
  --bg-2:         #1d0a10;
  --fg:           #f5e6e9;
  --fg-dim:       #b8848e;
  --accent:       #f43f5e;
  --accent-2:     #fb7185;
  --accent-dim:   #be123c;
  --gate:         #84cc16;
  --practice:     #fda4af;
  --muted:        #4a1a25;
  --card:         #1a0a10;
  --border:       #2a1018;
  --border-bright:#3d1825;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(244,63,94,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(132,204,22,0.05), transparent 65%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }

.strategy-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.strategy-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.strategy-item:last-child { border-right: none; }
.strategy-item.is-practice { background: rgba(253,164,175,0.05); border-left: 1px solid rgba(253,164,175,0.22); }

.strategy-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.strategy-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-discipline .strategy-name { color: var(--accent); }
.is-practice   .strategy-name { color: var(--practice); }
.strategy-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-discipline .strategy-sub { color: rgba(244,63,94,0.65); }
.is-practice   .strategy-sub { color: rgba(253,164,175,0.7); }
.strategy-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-discipline .strategy-bar-fill { background: var(--accent);   height: 100%; opacity: 0.85; }
.is-practice   .strategy-bar-fill { background: var(--practice); height: 100%; opacity: 0.80; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(244,63,94,0.07), rgba(244,63,94,0.01));
  padding: 20px 24px; margin-bottom: 56px;
  display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400;
}
.tradeoff-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px;
}
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.thinking-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(244,63,94,0.03);
  font-size: 12.5px; color: var(--fg);
}
.thinking-note strong { color: var(--accent); }

.quarter-rail {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.qtab {
  padding: 20px 18px; cursor: pointer; background: transparent; border: none;
  border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim);
  transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative;
}
.qtab:last-child { border-right: none; }
.qtab:hover  { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before {
  content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent);
}
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open  { border-color: var(--accent); }

.month-head {
  padding: 20px 24px; cursor: pointer;
  display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none;
}
.month-num {
  font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1;
  color: var(--accent); font-style: italic; font-weight: 400;
}
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why   { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev  { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }

.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(244,63,94,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(244,63,94,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(132,204,22,0.3); background: rgba(132,204,22,0.04); align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text {
  font-size: 13px; color: var(--fg);
  font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45;
}

.progress-wrap {
  position: sticky; top: 0; background: var(--bg);
  padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

.claims {
  margin-top: 72px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(244,63,94,0.1); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }
.stagger > *:nth-child(4) { animation-delay: 0.22s; }
.stagger > *:nth-child(5) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .strategy-strip { grid-template-columns: 1fr 1fr; }
  .strategy-item:nth-child(2) { border-right: none; }
  .strategy-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function AiProductStrategyArc() {
  const [activeQ,   setActiveQ]   = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done,      setDone]      = useState(new Set());

  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);

  const toggleWeek = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
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
              <p className="kicker"><LineChart size={12} /> Learning Ops // Strategy Lane</p>
              <h1 className="title-serif">The <em>Strategy</em> Arc.</h1>
              <p className="title-sub">
                12 months. From "I build AI systems" to "I advise on which AI systems to build."
                Discovery as a discipline, PRDs as starting moves, AI-specific metrics, roadmapping
                under uncertainty, audit deliverables, and the formal strategy advisory service line
                that turns thinking into billable revenue separate from implementation. The fastest
                path to the Head of AIaaS strategic layer.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Service line: <strong>Advisory · M10</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Framework · positioning</strong></div>
            </div>
          </div>

          <div className="strategy-strip stagger">
            {STRATEGY_LANES.map((s) => (
              <div key={s.name} className={`strategy-item is-${s.type}`}>
                <div className="strategy-label">{s.label}</div>
                <div className="strategy-name">{s.name}</div>
                <div className="strategy-sub">{s.sub}</div>
                <div className="strategy-bar">
                  <div className="strategy-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — the deliverable is thinking, not building.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Every other arc in the series ships visible artifacts — code, deployments, content.
                This one ships frameworks, decisions, and judgment. The output is harder to see, harder
                to demonstrate, and harder to bill for. The compounding return is enormous when it
                lands — but it lands months later than the engineering arcs do, and the validation
                arrives through promotion conversations and advisory contracts rather than deploy logs.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The advisory layer that the Head of AIaaS role requires — the gap between "implements AI" and "decides which AI to build" is the role gap, and this arc closes it</li>
                    <li>Higher hourly leverage — strategy advisory billable rates are typically 2-3x implementation rates because the deliverable affects larger downstream decisions</li>
                    <li>Compounds with every other arc — the engineering work becomes more valuable when paired with the product layer that decides what to build</li>
                    <li>The intellectual artifacts (frameworks, audits, strategies) are durable in a way that code is not — they outlast the specific stacks and model versions they were built on</li>
                    <li>The published framework (M12) is one of the highest-leverage brand artifacts in the entire series — practitioners reference it for years after</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>LOW load (3–5 hrs/week) but the work is unfamiliar — engineers default to building, and resisting that pull while doing thinking work takes deliberate effort</li>
                    <li>The output is invisible to your audience for most of the year — the M11-M12 publication is what makes the year of work visible, but until then most of the work is private documents</li>
                    <li>Strategy is harder to demonstrate than code — a deployed app proves itself in 60 seconds; a strategy document requires the reader to engage seriously with it before its value is visible</li>
                    <li>Most engineers underestimate how different product thinking is from engineering thinking — the year requires a genuine identity adjustment, not just a skill addition</li>
                  </ul>
                </div>
              </div>
              <div className="thinking-note">
                <strong>The discipline that determines whether this arc actually changes anything:</strong>{' '}
                product thinking is not "engineering thinking but slower." It is a different default
                question, a different success criterion, and a different time horizon. The engineer
                asks "can we build it?" The PM asks "should we build it, for whom, and how will we
                know it worked?" The arc fails when you smuggle engineering thinking into product
                work — confirming what you wanted to build instead of testing whether it should be
                built. The discipline is in catching yourself when the smuggling happens, not in
                avoiding the temptation to smuggle.
              </div>
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
                          const key    = `${m.n}-${wi}`;
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
                                : <Circle       size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Decision gate · M{m.n}</div>
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
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              CLAIMS &amp; ASSUMPTIONS
            </h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This is the lowest-load arc in the series but the hardest to do well.</strong>{' '}
                3-5 hrs/week is sustainable. The challenge is that the work is unfamiliar — engineers
                default to building, and resisting the pull to "just ship something" while doing
                thinking work takes deliberate effort. Most engineers who attempt product thinking
                give up by M3 because the work feels less satisfying than building. Plan for that.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The arc cross-leverages every other arc in the series.</strong> Every Full-Stack
                app could use a PRD before being built. Every voice agent needs success metrics
                defined before deployment. Every MCP server has a target user whose needs were never
                interviewed. Running this arc alongside engineering arcs makes both better — the
                engineering work has clearer specs, and the strategy work has real artifacts to
                reference.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The validation arrives later than for engineering arcs.</strong> Engineering
                arc value lands month-by-month with each deploy. Strategy arc value lands in clusters:
                M6 (first strategy document → decision), M10 (first paid advisory engagement), M11
                (Head of AIaaS conversation), M12 (published framework). Most months produce private
                artifacts that compound into the cluster moments. The compounding is real but it
                requires patience that engineering work does not require.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The Head of AIaaS pathway requires this arc, not just credentials.</strong>{' '}
                The other arcs produce credentials (certs, deployments, brand artifacts). This arc
                produces the strategic capability the role requires. A Head of AIaaS who can implement
                AI but cannot decide which AI to build is the failure mode the role most often falls
                into. The M11 conversations with Daniel, Dave, and Jackie are the explicit positioning
                work — they do not happen on their own.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Strategy advisory billable rates are higher than implementation rates.</strong>{' '}
                Typical market rates: implementation engagements bill at <code>$150-300/hr</code>.
                Strategy advisory engagements bill at <code>$300-600/hr</code> or daily/project rates
                that work out to similar leverage. The M10 service line definition should reflect
                this — pricing the advisory tier the same as implementation undersells it. The price
                signals positioning as much as it signals revenue.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The M12 published framework is the highest-compounding brand artifact in the series.</strong>{' '}
                Engineering content (a Cloudflare guide, an MCP server, a voice agent) ages out as
                stacks change. Strategy frameworks compound because they are about durable thinking
                patterns, not specific tools. A practitioner who reads your framework in 2027 will
                still find it useful in 2029. Plan the framework as a durable artifact, not a moment-in-time
                blog post.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
