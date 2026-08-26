import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, GraduationCap } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Teaching & Curriculum Arc
// Kyle-specific: 3-tier curriculum → CLC pilot → instructor cred → AIaaS SKU
// Three tiers: Non-Technical (90 min) / Technical (3 hrs) / AI Team (6 hrs)
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'BUILD THE CURRICULUM',
    subtitle: 'All three tier packages designed, built, and piloted with at least one real audience each.',
    months: [
      {
        n: 1,
        title: 'Tier 1 — non-technical curriculum design and materials',
        why: 'The non-technical format (90 min, any audience) is your widest-reach tier. It is also the feeder into Tiers 2 and 3. "A session that gets skeptics to try Claude once" is a brief, not a curriculum. This month you turn it into a reproducible package that someone other than you could facilitate with a 30-minute briefing.',
        weeks: [
          'Learning objective design: 3–4 verifiable outcomes in SMART format. Not "understand AI" — "write a first prompt that returns something useful for their specific job and iterate it once." Test each objective against a real non-AI person: can they tell you if they achieved it at the end of 90 minutes?',
          'Workshop architecture from the playbook refined: Why this matters (their problem, not AI trends) → What Claude is (honest comparison) → Prompt fundamentals (context, clarity, iteration) → Hands-on (3 guided exercises they build themselves) → Setup → Takeaway. Time every block against a real clock, not an estimate.',
          'Slide deck and participant workbook: the deck is for the room, the workbook is for the participant to keep. The workbook must be self-contained — someone who missed the session should be able to get started from it. Ten copy-paste prompts specific to three different job types: manager, analyst, operations.',
          'Test run with 5+ real non-Claude users: facilitate, do not present. Write down every moment of confusion and every moment of visible delight. The confusion moments are the curriculum gaps. The delight moments are the format to repeat.',
        ],
        gate: 'A complete Tier 1 package — slide deck, participant workbook, facilitator guide — that another capable person could deliver after a 30-minute handoff. Tested with real non-Claude users.',
      },
      {
        n: 2,
        title: 'Tier 2 — technical department curriculum design and materials',
        why: 'The technical audience (3 hrs, developers + analysts) has one non-negotiable success condition: they must build a working integration before the session ends. A technical workshop that ends with slides and no code is a lecture with a higher registration barrier.',
        weeks: [
          'Technical learning objectives — at least one must be: "they built a working [API call / MCP connection / structured output pipeline] before they leave." The others cover API fundamentals, model selection, token math, system prompt architecture for production.',
          'Environment setup protocol: 30% of technical workshops break in the first 20 minutes because of API keys, package conflicts, or corporate network restrictions. Build a pre-workshop setup guide sent 48 hours before, a day-of troubleshooting checklist, and a fallback demo path for every live coding segment.',
          'The skeleton workflow: the 30-minute build artifact participants take home at the end of Tier 2. A minimal working integration — Claude API call from n8n, a structured output pipeline, or a simple agent loop. Simple enough to complete in 30 minutes, complex enough to adapt to a real problem. Design it and build it yourself first.',
          'Test run with real developers or analysts — not AI practitioners. Observe where they get stuck and for how long. A stack on error handling reveals a gap in the facilitation; a stack on "why would I use this" reveals a gap in the framing. Both are fixable before CLC.',
        ],
        gate: 'A complete Tier 2 package — slides, workbook, setup guide, working code skeleton, facilitator troubleshooting guide. Tested with a real technical audience. Every environment failure has a documented workaround.',
      },
      {
        n: 3,
        title: 'Tier 3 — AI team curriculum design and materials',
        why: 'The Tier 3 format (6 hours, 8–12 AI-capable people maximum) is your highest-value and most differentiated offering. This audience does not need to be convinced AI is useful. They need to leave with something deployed and a mental model for building things they could not build before.',
        weeks: [
          'Six-session architecture refined from the playbook: Architecture (single vs. multi-agent, tool use) → Extended thinking and long context → Observability (what to log, alert on, never skip) → Security posture (OWASP LLM Top 10, RLS, multi-tenant isolation) → Full build → ADR retrospective. Time every session. The security posture session is your strongest differentiator — it is not in anyone else\'s Tier 3 format.',
          'The full-day build brief: the agentic workflow the cohort builds together in session 5. Scoped to be completable in 90 minutes by a mixed group. Must include: at least one tool call, one retrieval or context step, and one explicit failure-handling path. Design it, build it yourself, time it, then cut 20% of the scope.',
          'Architecture Decision Record template: the artifact each participant produces alongside the build. What decisions did they make, why, what would they change in v2? The rubric for a strong vs. weak ADR at this level — specific tradeoffs named, not vague claims about quality.',
          'Tier 3 test run: minimum 4 people, AI-capable. The security posture session in particular needs real technical people who will push back. Document every objection raised and how you handled it — these become part of the facilitator guide.',
        ],
        gate: 'A complete Tier 3 package — six session plans, facilitator guide, build brief, ADR template, security posture session materials with objection-handling notes. Tested and timed with a real technical audience.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'DELIVER AND ITERATE',
    subtitle: 'CLC pilot delivered. Feedback systems live. Materials infrastructure built. First pricing model.',
    months: [
      {
        n: 4,
        title: 'CLC pilot — Tier 1 delivered to a real CLC audience',
        why: 'A curriculum tested with colleagues is a hypothesis. A curriculum delivered to CLC students and staff who did not choose to attend and have no professional stake in finding it useful is evidence. The CLC pilot is the moment the curriculum meets the people it was designed for.',
        weeks: [
          'Pre-event logistics: venue confirmed, A/V tested, participant workbooks printed or distributed digitally, pre-workshop setup instructions sent 48 hours before (even for Tier 1 — setup expectations matter). Every logistics failure that can happen in the first 10 minutes should fail in your checklist instead.',
          'Deliver Tier 1 at CLC. Facilitate, do not present. Run the hands-on exercises exactly as designed. Do not improvise unless something is demonstrably not working in the room. The test is: does the curriculum work, not does your improvisation work.',
          'Real-time observation notes: during or immediately after, write down every moment of visible confusion and every moment of visible engagement. The confusion moments are fixable curriculum gaps. The engagement moments tell you which exercises actually work for this audience specifically.',
          'Post-event data: standardized survey (what will you do differently after today, what was most useful, what was confusing), attendance vs. registered count, hands-on completion rate, and one verbatim quote per exercise. These four numbers become your baseline for every future delivery.',
        ],
        gate: 'Tier 1 delivered at CLC with documented outcomes — attendance, survey averages, completion rate, three verbatim quotes. Curriculum revision list from real feedback. Ambassador impact report drafted.',
      },
      {
        n: 5,
        title: 'Feedback architecture and curriculum v2',
        why: 'One delivery produces intuition. Two deliveries begin to reveal patterns. Three reveal the curriculum — the parts that work for every audience, the parts that need facilitation skill to land, and the parts that simply do not work in the format and should be cut. This month builds the infrastructure to capture that distinction systematically.',
        weeks: [
          'Second Tier 1 delivery to a different audience — Intinc non-technical staff, a professional association, or a second CLC cohort. Deliver the same curriculum version as M4. Do not improvise new content. The test is curriculum consistency, not facilitation creativity.',
          'Feedback system design: standardized post-event survey (same 3–4 questions every time), a self-assessment rubric for your own facilitation (what you would do differently, what worked better than expected, what the room needed that was not in the curriculum), and a running "what broke" log across all deliveries.',
          'Curriculum v2: apply everything from M4 and M5 deliveries. The v2 should measurably improve on the three lowest-scoring survey items from M4. Write down the specific change made for each low-scoring item and the hypothesis for why the change will help.',
          'Tier 2 pilot delivery: a small group of real developers — Intinc engineering, a warm technical contact, or a developer meetup. Not a polished delivery — a test. Every place the setup protocol fails is a place to add a fallback. Every place participants finish early is a place to add depth.',
        ],
        gate: 'Curriculum v2 with a documented change log tied to specific survey data from two deliveries. Tier 2 piloted with a real technical audience. Feedback system documented and reusable across all three tiers.',
      },
      {
        n: 6,
        title: 'Materials infrastructure — the curriculum as a handoff-able product',
        why: 'A curriculum stored in your personal Drive that only makes sense with your context is not a curriculum product. A product is versioned, accessible, reproducible, and deliverable by someone other than its author. This month you build the infrastructure and price the offering.',
        weeks: [
          'Version control and organization: every deck, workbook, facilitator guide, exercise, and setup instruction in a single folder structure with version numbers and change logs. Rule: you should be able to find the current version of any material in under 30 seconds. If you cannot, the organization is not done.',
          'Facilitator onboarding package: a document that lets a capable but AI-unfamiliar facilitator deliver Tier 1 in two weeks of preparation. It must not assume your context, your build history, or your improvisational skill. Every assumption you make in facilitation that is not in the guide is a gap.',
          'Exercise bank: 15+ exercises across all three tiers, tagged by audience type (non-technical / technical / AI team), Claude familiarity level required (0–3 / 4–7 / 8–10), time required, and whether API access is needed vs. claude.ai only. These are the most reusable curriculum elements — treat them as assets.',
          'Pricing model v1: what does each tier cost when delivered to a paying client? Not CLC (covered by Ambassador sponsorship or donated). A Tier 1 for a 30-person corporate team, a Tier 2 for a developer cohort, a Tier 3 for an AI team. Research comparable corporate AI training pricing. Write the first numbers, however uncomfortable.',
        ],
        gate: 'Materials in versioned, accessible infrastructure. Facilitator onboarding package for Tier 1 complete. Exercise bank with 15+ tagged entries. Pricing model v1 written with documented rationale.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'SCALE AND CREDENTIAL',
    subtitle: 'External pipeline active. Teaching methodology documented. Instructor credentials earned.',
    months: [
      {
        n: 7,
        title: 'External delivery pipeline',
        why: 'CLC and Intinc are safe audiences. External delivery — at companies, meetups, or conferences where you have no prior relationship — is where you learn whether the curriculum stands without your institutional context. It is also where the testimonials come from that close future sales.',
        weeks: [
          'Target pipeline: five organizations worth approaching for an AI fluency workshop in the next 6 months. One per vertical: a tech company, a professional services firm, a healthcare or financial services team, a community college or university other than CLC, and a corporate L&D department. Brief warm outreach for each that names their specific AI literacy challenge, not a generic "I do AI workshops."',
          'Workshop proposal template: a two-page document a procurement manager or L&D director can circulate internally. Problem statement → curriculum overview → three format options (Tier 1 / Tier 2 / Tier 3) → expected outcomes → evidence (portfolio) → pricing → facilitator bio → next step. Professional enough to send without editing the day of a conversation.',
          'First external outreach to one pipeline target — a warm connection through LinkedIn, the Ambassador network, or a mutual contact. The goal is a discovery call, not a closed deal. Listen for what they actually want vs. what the curriculum offers.',
          'External delivery or confirmed date: deliver to an external audience outside CLC and Intinc — a Chicago-area AI meetup, a professional association session, or a small company workshop. Collect a written testimonial or LinkedIn recommendation from the organizer or a participant.',
        ],
        gate: 'A five-organization pipeline documented. A proposal template ready to send. One external delivery completed or a confirmed external date with written agreement. One specific, attributable external testimonial.',
      },
      {
        n: 8,
        title: 'Teaching methodology — the craft underneath the content',
        why: 'Knowing Claude deeply is not the same as knowing how to teach Claude effectively. The practitioner who can facilitate an adversarial senior engineer to genuine insight has a skill that is genuinely scarce. This month is about making that skill explicit, documented, and improvable.',
        weeks: [
          'Facilitation methodology documented: the specific techniques that distinguish a workshop from a presentation. Socratic questioning in a technical context, live failure as a teaching tool (breaking something deliberately and debugging it with the audience), the difference between "I will show you" and "you are going to figure this out with my help."',
          'Adult learning principles applied to AI workshops: why a skeptical senior engineer learns differently from a curious junior developer, how to design for two standard deviations of Claude familiarity in the same room, why the "why do I need this" objection disappears when you open with their problem instead of your curriculum.',
          'Differentiation techniques: the extension exercise model — a baseline task that anyone completes plus an extension that stretches the advanced participants. Build one extension exercise per tier. The baseline keeps the room moving; the extension keeps the advanced participants engaged.',
          'Facilitation self-assessment: review detailed notes or recordings from your last four deliveries. Apply the methodology rubric you build this month. Identify two facilitation habits to build and two to eliminate. Write the specific, observable behaviors you are targeting, not vague improvement intentions.',
        ],
        gate: 'A facilitation methodology guide written from your own delivery history — not from a pedagogy textbook. A self-assessment from four deliveries with two specific, named development targets.',
      },
      {
        n: 9,
        title: 'Instructor credentials — the right credential for each context',
        why: '"Instructor" means different things in different contexts. At CLC there is a formal path to adjunct or continuing education status. At an enterprise client, the credential is your portfolio and testimonials. At the Ambassador program it is your impact reports. This month you clarify and pursue the right credential for each context simultaneously.',
        weeks: [
          'CLC formal path: the specific conversation with your math professor contact and the relevant CLC administrator about what adjunct or continuing education instructor status requires — minimum delivery hours, a formal application, background check, compensation model. Understand the actual requirements, not the assumed ones. If formal status is not the right path, document why and what informal ongoing relationship makes more sense.',
          'Workshop portfolio: a structured record of every workshop delivered — date, audience, size, tier, survey scores, and at least one specific outcome per delivery. By M9 you should have 6+ documented deliveries. This document is the credential in every context where formal credentials do not apply.',
          'Testimonial collection: a formal request to every significant delivery organizer or participant for a specific written testimonial or LinkedIn recommendation. Specific beats generic. "Kyle ran a 3-hour Tier 2 session with our backend team. Two engineers shipped a Claude integration to production the same week" is a credential. "Great presenter" is not.',
          'Partner Network instructor positioning: update your Partner Network profile to include the three-tier curriculum as a named service line, the delivery portfolio as linked evidence, and the teaching credentials (CLC status + testimonials + Ambassador impact reports) as the proof layer.',
        ],
        gate: 'CLC formal path clarified with a documented next step. A workshop portfolio of 6+ documented deliveries. Three specific, publishable testimonials. Partner Network profile updated with teaching credentials as a named service.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'CAPSTONE AND PUBLISH',
    subtitle: 'All three tiers delivered in sequence. Curriculum packaged as an AIaaS product. The guide published.',
    months: [
      {
        n: 10,
        title: 'Full-stack delivery — all three tiers, one quarter',
        why: 'Each tier has been piloted and iterated independently. This quarter you run all three — ideally in sequence with the same organization or community — to test the thing the curriculum was designed to be: a coherent progression from awareness to depth to capability. The three-tier system only proves itself when delivered as a system.',
        weeks: [
          'Tier 1 delivered to a new audience using curriculum v2 or later. Document outcomes against your M4 CLC baseline. Has the curriculum improved? What specifically moved?',
          'Tier 2 delivered to a technical audience — ideally from the same organization as Tier 1, showing the progression. Document whether participants who came through Tier 1 started Tier 2 with measurably different baseline knowledge.',
          'Tier 3 delivered to an AI-capable team — Intinc\'s internal AI team, a client engineering cohort, or a Community Ambassador event for advanced practitioners. The full 6-hour format with the build and ADR.',
          'Three-tier retrospective: what happened when all three tiers ran in the same quarter? Did the progression work as designed? What did participants carry from one tier to the next? What does the curriculum teach as a system that individual tiers cannot teach alone? This is the insight that belongs in the published guide.',
        ],
        gate: 'All three tiers delivered in Q4 with documented outcomes. A written three-tier retrospective that captures system behavior, not just individual session metrics.',
      },
      {
        n: 11,
        title: 'Curriculum as an AIaaS product — formalize the service line',
        why: 'The three-tier curriculum is not just a teaching tool — it is a billable service line. This month you formalize it as an AIaaS SKU with a price, a deliverable, a proposal template, and a conversation with Daniel about what it would take to make it a repeatable Intinc revenue line.',
        weeks: [
          'SKU definitions for all three tiers: formal title, audience description, format (duration, group size range, in-person vs. remote), deliverables the client receives (pre-workshop setup guide, participant workbook, post-workshop resources, survey report), price, and explicit out-of-scope boundaries.',
          'Proposal template: a document that sells the curriculum to a corporate L&D manager or engineering leader without you in the room. Problem → solution → format options → evidence (portfolio, testimonials) → pricing → next step. Five pages maximum. Test it by handing it to someone who has not seen your curriculum and asking if they could make a purchase decision from it.',
          'Pricing validation: what do comparable corporate AI training days cost from other providers? What does a Google or Microsoft corporate workshop cost vs. what you are charging? Adjust if you are more than 30% off market without a reason you can articulate.',
          'Daniel conversation: the three-tier curriculum as an Intinc service offering. Not just Kyle teaching workshops — a packaged training service that Intinc can attach to enterprise client relationships. What does it need to become that? A second facilitator? A platform? Formalized scope? Get his honest reaction.',
        ],
        gate: 'Three SKUs formally defined with prices. A proposal template that closes without a verbal pitch. A documented conversation with Daniel about the Intinc service line path — even a "not now" is a gate-worthy outcome if the reason is documented.',
      },
      {
        n: 12,
        title: 'Publish the curriculum guide and close the arc',
        why: 'Twelve months of curriculum design, delivery iteration, facilitation methodology, and practitioner learning. You do not own this until someone else can use it. The guide that helps other technical educators design and deliver AI workshops is the compounding asset that outlasts every individual session you ran.',
        weeks: [
          'Write the "AI workshop design guide": not your slide decks — the design principles behind the three-tier curriculum. How to write a verifiable learning objective for a non-technical audience, how to design a hands-on exercise that works on a free claude.ai account, how to handle the top five participant objections in real time, and what makes a Tier 3 security posture session land with an adversarial senior engineer.',
          'Publish: LinkedIn article series or a Substack standalone. One post per tier. The exercise bank as a public GitHub repository. The facilitator methodology as a downloadable PDF. Linked from your Partner Network profile, LinkedIn bio, and The Prompt.',
          'Final CLC delivery: if an adjunct or continuing education formal arrangement is in progress, deliver the qualifying session. If not, deliver one final CLC event as the year\'s Ambassador anchor — the session that the impact report covers and the professor can formally endorse.',
          'Retrospective: what was harder to teach than you expected? What did participants consistently misunderstand that you had not anticipated? What changed in your own understanding of how technical practitioners learn? What is Y2 — a formal CLC course, a train-the-trainer program, a productized online version, or none of the above?',
        ],
        gate: 'The curriculum design guide published with the exercise bank on GitHub. Final CLC session delivered. Year retrospective written. Three other technical educators are using something from this arc in their own teaching.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CURRICULUM STRIP — three tiers + CLC pilot + instructor cred
// ---------------------------------------------------------------------------
const CURRICULUM = [
  { type: 'tier',   tier: '1', label: 'Tier 1', name: '90 Minutes',  sub: 'Any audience · M1',     fill: 100 },
  { type: 'tier',   tier: '2', label: 'Tier 2', name: '3 Hours',     sub: 'Technical · M2',        fill: 80  },
  { type: 'tier',   tier: '3', label: 'Tier 3', name: '6 Hours',     sub: 'AI team · M3',          fill: 60  },
  { type: 'pilot',  tier: '',  label: 'Pilot',  name: 'CLC Pilot',   sub: 'Delivery gate · M4',    fill: 30  },
  { type: 'cred',   tier: '',  label: 'Cred',   name: 'Instructor',  sub: 'Credential gate · M9',  fill: 8   },
];

// ---------------------------------------------------------------------------
// STYLES — Teaching & Curriculum Arc / bright grass green on deep forest-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #040e06;
  --bg-2:         #091408;
  --fg:           #e2f5e4;
  --fg-dim:       #6a9870;
  --accent:       #4ade80;
  --accent-2:     #86efac;
  --accent-dim:   #22c55e;
  --gate:         #fcd34d;
  --pilot:        #fb923c;
  --muted:        #2a5030;
  --card:         #0c1a0e;
  --border:       #162418;
  --border-bright:#213626;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(74,222,128,0.09), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(252,211,77,0.05), transparent 65%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

/* HEADER */
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

/* CURRICULUM STRIP */
.curric-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.curric-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.curric-item:last-child { border-right: none; }
.curric-item.is-pilot { background: rgba(251,146,60,0.04); }
.curric-item.is-cred  { background: rgba(252,211,77,0.04); border-left: 1px solid rgba(252,211,77,0.22); }

.curric-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.curric-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-tier  .curric-name { color: var(--accent); }
.is-pilot .curric-name { color: var(--pilot); }
.is-cred  .curric-name { color: var(--gate); }
.curric-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-tier  .curric-sub { color: rgba(74,222,128,0.6); }
.is-pilot .curric-sub { color: rgba(251,146,60,0.65); }
.is-cred  .curric-sub { color: rgba(252,211,77,0.65); }
.curric-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-tier  .curric-bar-fill { background: var(--accent); height: 100%; opacity: 0.8; }
.is-pilot .curric-bar-fill { background: var(--pilot);  height: 100%; opacity: 0.75; }
.is-cred  .curric-bar-fill { background: var(--gate);   height: 100%; opacity: 0.8; }

/* TRADEOFF */
.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(74,222,128,0.07), rgba(74,222,128,0.01));
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
.sequence-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(74,222,128,0.03);
  font-size: 12.5px; color: var(--fg);
}
.sequence-note strong { color: var(--accent); }

/* QUARTER TABS */
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

/* MONTHS */
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

/* WEEKS */
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(74,222,128,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(74,222,128,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* GATE — warm yellow = learning landed, student changed */
.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(252,211,77,0.3); background: rgba(252,211,77,0.04); align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text {
  font-size: 13px; color: var(--fg);
  font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45;
}

/* PROGRESS */
.progress-wrap {
  position: sticky; top: 0; background: var(--bg);
  padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

/* CLAIMS */
.claims {
  margin-top: 72px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(74,222,128,0.1); padding: 1px 6px; font-size: 11px; }
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
  .curric-strip { grid-template-columns: 1fr 1fr; }
  .curric-item:nth-child(2) { border-right: none; }
  .curric-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function TeachingCurriculumArc() {
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

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><GraduationCap size={12} /> Learning Ops // Teaching Lane</p>
              <h1 className="title-serif">The <em>Teaching</em> Arc.</h1>
              <p className="title-sub">
                12 months. Three tier packages built and tested. CLC piloted. Feedback systems live.
                External delivery pipeline active. Instructor credentials earned. The three-tier
                curriculum packaged as an AIaaS SKU, the design guide published, and the exercise
                bank on GitHub for anyone who teaches what you teach.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>CLC: <strong>Pilot M4 · Cred path M9</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>All 3 tiers · Q4</strong></div>
            </div>
          </div>

          {/* CURRICULUM STRIP */}
          <div className="curric-strip stagger">
            {CURRICULUM.map((c) => (
              <div key={c.name} className={`curric-item is-${c.type}`}>
                <div className="curric-label">{c.label}</div>
                <div className="curric-name">{c.name}</div>
                <div className="curric-sub">{c.sub}</div>
                <div className="curric-bar">
                  <div className="curric-bar-fill" style={{ width: `${c.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — building the curriculum costs more time than delivering it.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                The arc is structured as Q1 build, Q2 deliver. The build quarter is the expensive
                one — slide decks, workbooks, exercises, facilitator guides, setup protocols. Once
                those exist, delivery is leverage. The risk is front-loading without shipping, or
                shipping without building the feedback system that makes iteration possible.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Three complete curriculum packages that compound every time they are delivered</li>
                    <li>CLC institutional relationship formalized — warm goodwill becomes documented partnership</li>
                    <li>The three-tier curriculum as a named AIaaS SKU closes service line proposals that need a concrete deliverable</li>
                    <li>Teaching forces you to understand what you know well enough to explain it — it deepens the technical arcs</li>
                    <li>The exercise bank and published guide are the brand artifacts that reach practitioners who never attend a live event</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>Q1 is 4–6 hrs/week on curriculum design — the least immediately visible work in the series</li>
                    <li>Workshop logistics are consistently underestimated — a 90-minute session costs 4–6 hours of prep, printing, follow-up, and reporting</li>
                    <li>External delivery (M7) requires sales conversations, not just skills — a pipeline that does not convert after 90 days needs a different strategy</li>
                    <li>Formal CLC credential path may have requirements (minimum hours, application cycles) that do not fit a 12-month arc — plan for the informal path in parallel</li>
                  </ul>
                </div>
              </div>
              <div className="sequence-note">
                <strong>The three-tier system proves itself in Q4, not Q1.</strong> Each tier is
                useful alone. The three-tier curriculum is a system — it proves its value when
                participants move through the progression from Tier 1 awareness to Tier 3 capability.
                The Q4 full-stack delivery is not a capstone checkbox. It is the first real test of
                whether the system works as designed. Do not skip it in favor of three more Tier 1
                deliveries — the system data is more valuable than the volume.
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
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
                          <div className="gate-label">Teaching gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>The Q1 build is the investment. Every delivery after is the return.</strong> Three
                complete curriculum packages built in Q1 means every Q2–Q4 delivery starts from a
                known, tested baseline. Skipping the build and improvising each delivery produces better
                individual sessions and a worse system. The system is the product.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Tier 3 security posture session is your actual differentiator.</strong> No
                other AI educator in the Lake County market is running OWASP LLM Top 10 and multi-tenant
                isolation in a workshop context. The Security Arc (M9 work especially) feeds directly
                into this session. Schedule Tier 3 to land after the Security Arc's red-team and
                posture documentation work is complete, not before.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>CLC formal instructor path has real requirements.</strong> The M9
                conversation with the administrator is not a formality — adjunct and continuing education
                instructor status typically requires a credential review, minimum contact hours, and an
                application cycle. Plan the formal path for Y2 if it cannot close in Y1, and build the
                informal ongoing relationship as the Y1 outcome.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Workshop logistics cost more time than they look like they should.</strong>
                A 90-minute Tier 1 session costs approximately: 2 hrs curriculum prep, 1 hr logistics,
                90 min delivery, 30 min follow-up, 30 min survey analysis and revision notes. Budget
                <code>~6 hours per delivery</code> until you have a streamlined system. After M6
                materials infrastructure, this should drop to ~3.5 hours.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The three-tier system data (M10) is more valuable than volume.</strong>
                Delivering Tier 1 six times is easier than delivering all three tiers in sequence.
                The sequence data — do participants who attend Tier 1 learn faster in Tier 2? does
                Tier 3 land differently with Tier 1 context? — is the proof point that makes the
                three-tier curriculum a product, not three separate workshops. Protect the Q4
                full-stack delivery against schedule pressure.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Load is LOW (3–5 hrs/week) except Q1 M1–M3 and Q2 M4–M5.</strong>
                The build quarter and the first delivery sprint are the expensive ones. Plan around them.
                Do not run Security Arc exam prep (M4–M5 of that arc) simultaneously with the
                first CLC deliveries (M4–M5 of this arc) — the week calendars will collide.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
