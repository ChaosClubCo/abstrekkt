import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, GraduationCap } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'CURRICULUM',
    subtitle: 'Course thesis, audience definition, curriculum architecture, first lessons validated with beta students.',
    months: [
      {
        n: 1,
        title: 'Course thesis and audience definition',
        why: 'The Teaching arc built curriculum content. The Course arc turns it into a business — and the business begins not with lessons but with a clear thesis about who pays for this course and why. Most failed courses have great curriculum and no audience. M1 is the audience-and-thesis work that most course creators skip and pay for later.',
        weeks: [
          'The thesis statement: in one sentence, what does the course teach, to whom, and what changes in their work or career after completion? The sentence is hard. The sentence is the work. Test it against five potential students — they should be able to paraphrase it back accurately.',
          'Audience interviews — five conversations with people who match the target student profile. Not pitches. Discovery interviews using the JTBD methodology from the Strategy arc M2: "walk me through the last time you tried to learn this..." Document what surprises you about their actual constraints, budgets, and learning preferences.',
          'Competitive landscape: every other course teaching adjacent content — Maven cohorts, Udemy courses, YouTube channels, bootcamps, individual coaches. What are they charging? What are they leaving out? Where is the underserved gap that your specific perspective fills? Write the landscape.',
          'Positioning document: thesis, audience, competitive position, and the specific "why this course, why now, why from you" pitch. Three pages, written, dated. Every later decision references this document. Without it, course development drifts toward "everything I know" rather than "what this specific audience needs."',
        ],
        gate: 'A written positioning document with thesis statement, audience interview synthesis, competitive landscape, and explicit differentiation. Five potential students can paraphrase the thesis back accurately. The course has a reason to exist beyond "I have knowledge to share."',
      },
      {
        n: 2,
        title: 'Curriculum architecture — syllabus and lesson plan',
        why: 'M1 produced the thesis. M2 produces the curriculum that delivers on the thesis. The architecture matters more than any single lesson — a great lesson in a broken curriculum produces a frustrated student; a decent lesson in a clear curriculum produces a satisfied one. M2 is the architecture work that prevents M4 platform decisions from becoming structural rewrites.',
        weeks: [
          'Learning outcomes — what specifically can a student do at the end of the course that they could not do at the beginning? Outcomes are skills demonstrated, not topics covered. "Understand RAG" is not an outcome; "Design and deploy a production RAG system with eval metrics" is. Write 4-6 specific outcomes.',
          'Module structure — how do the outcomes break into modules? Most cohort-based courses are 4-8 weeks with one module per week. Self-paced courses can be 6-12 modules. Pick the format based on the M4 platform decision (preliminary), and structure outcomes into modules.',
          'Lesson plan per module — for each module, list the 4-8 lessons that build to the module outcome. Each lesson has a specific learning objective. Lessons are 15-45 minutes of content; modules are 2-4 hours of work for students including exercises.',
          'Exercise design — for each module, the practical exercise that proves the outcome was achieved. The exercise is more important than the lesson; students learn from doing, not from watching. Document exercise design with specific success criteria.',
        ],
        gate: 'Complete curriculum architecture: learning outcomes, module structure, per-module lesson plans, and per-module exercises with success criteria. The course is now a buildable artifact, not a teaching concept.',
      },
      {
        n: 3,
        title: 'First lessons built and beta-tested',
        why: 'The curriculum architecture is theoretical until students actually engage with the lessons. M3 builds the first module to delivery quality and runs it past 5-10 free beta students. The beta is not for the students\' benefit — it is for the data on what actually works, what bores, what confuses, what lands.',
        weeks: [
          'Build module 1 to delivery quality — videos recorded, exercises drafted, written materials produced. The first module is the test of the production workflow. Most courses underestimate how long lesson production takes; the first module reveals the real number.',
          'Recruit 5-10 beta students from M1 audience interviews and adjacent networks. Free access in exchange for honest feedback and willingness to engage with exercises. The recruitment is structured; "anyone want to try my course?" produces the wrong audience.',
          'Run beta cohort through module 1 — synchronous if cohort-based, async if self-paced. Observe what students actually do, where they get stuck, which exercises produce real learning, which feel like busywork. Document patterns, not just feedback.',
          'Beta retrospective and architecture revision — what worked? What needs restructuring? What does the curriculum architecture from M2 need to change based on real student data? Adjust the M4-onwards plan before committing to platform and pricing.',
        ],
        gate: 'Module 1 built to delivery quality and beta-tested with 5-10 students. Documented patterns of what worked vs what needs adjustment. Curriculum architecture updated based on beta data, not assumptions.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'PLATFORM + LAUNCH',
    subtitle: 'Platform decision. Pricing model. Full curriculum built. First paid cohort soft-launched at $5-15K revenue.',
    months: [
      {
        n: 4,
        title: 'Platform decision, pricing, sales funnel',
        why: 'The course economics live or die on these three decisions: where it runs, what it costs, how students find it. M4 is the decision month — preliminary signals from beta inform real platform commitment, real pricing, and the funnel that turns interest into enrollment.',
        weeks: [
          'Platform decision tree: Maven (cohort-based, built-in audience, 10-15% rev share, premium positioning), Teachable/Thinkific (self-hosted, full control, lower price points), Substack-as-course (audience-driven, lower production overhead), or fully custom (most control, most operational burden). Pick based on cohort vs self-paced, audience, and operations capacity.',
          'Pricing model: cohort courses typically $500-2,500. Self-paced typically $99-500. Premium / executive variants $2,500-10K. The price signals positioning as much as the price extracts revenue. Underpriced courses are often perceived as lower value than fairly-priced ones. Decide based on positioning, not on "what feels comfortable."',
          'Sales funnel architecture: landing page, email capture, nurture sequence, sales page, checkout. Each is its own discipline. Most course creators build a funnel that works for them but doesn\'t convert strangers. Borrow proven structures (Maven\'s built-in funnel, or established self-pub frameworks like the "About → Free Resource → Email → Pitch" sequence).',
          'Launch date set for M6 cohort — backwards-plan from the date. Marketing window is M5 (lead generation), M6 first 2 weeks (sales push), M6 last 2 weeks (cohort starts). Without a date, the launch perpetually slides; with a date, the work shapes around the constraint.',
        ],
        gate: 'Platform chosen and configured. Pricing set. Sales funnel built end-to-end with at least a landing page, email capture, and checkout flow live. Launch date for M6 cohort set and committed.',
      },
      {
        n: 5,
        title: 'Full curriculum built + lead generation',
        why: 'M5 has two parallel tracks: finish building the curriculum, and start generating leads for the M6 launch. Curriculum-only months produce great content that no one buys. Marketing-only months produce demand for a product that doesn\'t exist. M5 is the discipline of running both simultaneously.',
        weeks: [
          'Curriculum production track: modules 2-N built to delivery quality. The M3 beta calibrated production pace; M5 is execution at that pace. If pace is slower than projected, reduce module count rather than reduce module quality.',
          'Lead generation track: weekly content on the platform where the audience lives (LinkedIn for B2B/practitioner, YouTube for skills, Twitter for community). Each piece of content references the course landing page. The goal is 200-500 email subscribers by M6 launch.',
          'Curriculum production: continued. Mid-month checkpoint: is curriculum on track for M6 first-week-of-cohort delivery? If module N is at risk, decide now to defer it to "bonus" content or pull it from the cohort scope.',
          'Lead generation: continued + waitlist activation. Email subscribers get a waitlist signup with early-bird pricing. The waitlist conversion is typically 5-15% — calibrate launch expectations against waitlist size, not raw subscriber count.',
        ],
        gate: 'Curriculum built to cohort-ready quality across all modules. Email subscriber base of 200-500 with a waitlist of 30-100 names. The M6 launch has the product to ship and the audience to ship it to.',
      },
      {
        n: 6,
        title: 'First paid cohort soft launch — $5-15K revenue',
        why: 'The first paid cohort is the validation moment. Real students paying real money for the actual course. Most courses fail to launch at all — building forever, polishing forever, never charging. M6 is the discipline of launching when the course is good enough, not perfect.',
        weeks: [
          'Launch week — landing page live with pricing, email sequence active, sales push to waitlist and email list. Target: 10-20 paid enrollments for the first cohort. The first cohort is intentionally small; small cohorts produce better student outcomes and better feedback.',
          'Cohort week 1 — first module delivered, students engaged, first exercises completed. Observe everything. The first cohort\'s experience tells you what marketing claims need to match and what curriculum claims need adjustment.',
          'Cohort weeks 2-3 — continued delivery. Daily or weekly check-ins with students. Document what questions come up repeatedly, what exercises produce learning, where students get stuck. The data is the product roadmap.',
          'Cohort close + retrospective. What worked? What did students actually achieve? What do they say in NPS surveys and unprompted feedback? The retrospective shapes M7 cohort #2 — every iteration should be measurably better than the last.',
        ],
        gate: 'First paid cohort completed with 10-20 students paying $5-15K total revenue. Documented retrospective with student outcomes, NPS, and specific curriculum/delivery adjustments for M7 cohort #2.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'MARKETING ENGINE',
    subtitle: 'Cohort #2 + #3 with marketing system operational. Revenue compounds. Course-market fit signals emerge.',
    months: [
      {
        n: 7,
        title: 'Cohort #2 with marketing system spinning up',
        why: 'M6 proved the course can be sold. M7 builds the marketing engine that sells it repeatedly. Without an engine, each cohort requires the same heroic launch effort. With an engine, cohorts launch more efficiently and grow predictably. M7 is the systematizing work most course creators avoid because it is less satisfying than teaching.',
        weeks: [
          'Marketing system audit: what worked in M6 launch? Specific channels, specific posts, specific email sequences. Document the conversion data — landing page conversion %, email open rates, waitlist-to-purchase conversion. The data is the system.',
          'Content engine: a sustainable weekly content cadence that drives leads without burning out the creator. 1-2 LinkedIn posts per week, one long-form piece per month, occasional video. The cadence is calibrated to sustain across the year, not just spike for cohort #2.',
          'M6 cohort alumni: testimonials, case studies, referrals. The first cohort is the strongest marketing asset for cohort #2. Capture testimonials with specifics ("after the course I built X" beats "the course was great"). Alumni referrals are typically the highest-conversion channel.',
          'Cohort #2 launch — target 20-30 students, $10-25K revenue. Marketing system carries more of the load than in M6. The creator-time-per-enrollment ratio should be measurably lower.',
        ],
        gate: 'Marketing system documented and operational. Cohort #2 launched with 20-30 students and $10-25K revenue. Creator-time-per-enrollment measurably lower than M6 (the engine is doing more of the work).',
      },
      {
        n: 8,
        title: 'Cohort retrospective and product-market fit signals',
        why: 'Two cohorts is enough data to start reading PMF signals honestly. Are students completing the course? Are they getting outcomes? Are they referring others? Are repeat-buy signals (advanced course, coaching, community) present? M8 is the honest assessment that determines whether to scale, refine, or rebuild.',
        weeks: [
          'Aggregate retrospective: completion rates, outcome rates, NPS, referral rates, repeat-purchase signals. Compare M6 and M7 cohorts honestly. What is the trend? PMF signals are improving completion, improving NPS, increasing referrals.',
          'Course refinement based on data: which modules need work? Which exercises don\'t produce learning? What gaps did both cohorts surface? The refinement is data-driven, not preference-driven.',
          'Alumni community design: an alumni Slack or Discord, periodic alumni events, a referral program. The alumni community is both a retention asset and a marketing asset. Most course businesses neglect this — those who don\'t compound faster.',
          'Strategic decision: scale (cohort #3 larger), refine (smaller cohort #3 with improved curriculum), or pivot (different audience or different format). The decision is documented, not drifted. Sometimes the right answer is "this course is not the right business" — M8 is when that signal would surface.',
        ],
        gate: 'Aggregate retrospective document with completion, outcome, NPS, and referral data from M6 and M7 cohorts. Course refinements implemented. Alumni community structure live. Documented strategic decision for M9 cohort #3.',
      },
      {
        n: 9,
        title: 'Cohort #3 — revenue compounds',
        why: 'M9 is the cohort where the marketing system, the alumni network, and the iterated curriculum compound. This is the cohort that proves the course is a real business, not just three one-off launches. Target revenue: $15-30K, with meaningfully higher cohort size and meaningfully better student outcomes.',
        weeks: [
          'Cohort #3 launch — marketing system operating at higher efficiency. Alumni referrals contributing meaningfully (20%+ of enrollments). Waitlist from continued content engine. Target 30-50 students.',
          'Cohort delivery — operational discipline now mattering as much as teaching quality. Multi-cohort overhead (alumni community + active cohort + waitlist for next cohort + content engine) is real. The systems work designed in M7 carries this.',
          'Mid-cohort signals — are completion rates improving? Are alumni continuing to engage? Is the course delivering on the M1 thesis at increasing scale? The signals confirm or contradict the M8 strategic decision.',
          'Q3 close: $30-70K total revenue across three cohorts. Cohort #3 metrics documented. Year-end revenue projection updated based on M10-M12 cohort pace. The course is provably a business by Q3 close.',
        ],
        gate: 'Cohort #3 completed with 30-50 students and $15-30K revenue. Total Q3 revenue: $30-70K across three cohorts. Documented compounding from alumni referrals and content engine. The course is operationally a business.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SCALE OR REFINE',
    subtitle: 'Cohort #4. Year 1 gross revenue $50-200K. Y2 strategic decision: scale, sustain, or sunset.',
    months: [
      {
        n: 10,
        title: 'Cohort #4 — operational discipline at scale',
        why: 'Cohort #4 tests whether the business holds together at higher volume. Three cohorts done well looks promising; four cohorts done well with sustained quality and continued alumni engagement is a business. M10 is the operational discipline month — systems holding up, not just being demonstrated.',
        weeks: [
          'Cohort #4 launch with mature marketing system. Target 40-60 students. The marketing system should produce enrollments with less creator-direct involvement than M6. If creator time per enrollment is not trending down, the system isn\'t actually a system.',
          'Multi-cohort operations: cohort #4 delivery + alumni community + content engine + cohort #5 marketing. The operational load is real. Either the creator is doing the work, or a TA / community manager is supporting. Document what is creator-only vs delegatable.',
          'Quality discipline: cohort #4 student outcomes need to match or exceed cohort #1 outcomes. Quality regression at scale is the failure mode. Compare M10 student NPS and outcome data against M6 explicitly.',
          'Pricing review: is the price still right? Most successful courses increase prices in year 1 by 30-100% as positioning strengthens. The increase signals confidence and filters for serious students. Decide for M11 cohort #5 pricing.',
        ],
        gate: 'Cohort #4 completed with 40-60 students and quality metrics matching or exceeding M6 baseline. Multi-cohort operations stable. Pricing decision for M11 documented.',
      },
      {
        n: 11,
        title: 'Y2 strategic decision — scale, sustain, or sunset',
        why: 'M11 is the binary decision point. Four cohorts of data, four iterations of the curriculum, a marketing engine, an alumni community. The honest assessment determines whether this is a Y2 business worth scaling, a sustainable Y2 income stream worth maintaining, or a Y1 experiment that should sunset before consuming Y2 energy.',
        weeks: [
          'Aggregate Y1 data: total revenue, total students, completion rate, NPS, referral rate, creator-hours invested, dollar-per-creator-hour. The dollar-per-hour number is the honest signal of whether this is leverage or hidden labor.',
          'Three Y2 scenarios written: (1) Scale — higher prices, larger cohorts, possible team hire, $200-500K target. (2) Sustain — same cadence, modest growth, $100-200K target. (3) Sunset — wind down after one final cohort, archive curriculum, redirect energy. Each scenario with specific tradeoffs documented.',
          'Decision conversation with trusted advisor (Daniel, a peer course creator, or a business coach). The decision is consequential enough to deserve outside perspective. The conversation is structured, not just "what do you think?"',
          'Y2 decision documented and committed. The decision shapes M12 work and the Personal Brand arc Q4 work. The decision is binding for Y2 with one review point at Y2 Q2.',
        ],
        gate: 'Y1 aggregate data documented. Three Y2 scenarios written with tradeoffs. External advisor conversation completed. Y2 decision (scale, sustain, or sunset) documented and committed with one review point scheduled.',
      },
      {
        n: 12,
        title: 'Year retrospective + brand integration',
        why: 'M12 closes the year by integrating the course into the broader portfolio. Year 1 gross revenue is one number; what the course did for Partner Network credibility, brand authority, AIaaS service line credibility, and personal growth is a separate set of values. M12 makes those values explicit and integrates them across the portfolio.',
        weeks: [
          'Y1 financial close: gross revenue, costs (platform fees, contractor costs, marketing), net revenue, taxes set aside. The financial picture is documented for tax purposes and for honest portfolio assessment.',
          'Brand integration: the course is now a credential on LinkedIn, in Partner Network listings, in AIaaS service line pitches, in The Prompt author bio. The credential is leveraged everywhere it can be, deliberately.',
          'Alumni assets: testimonials curated, case studies written, alumni network documented as a referral and advisory asset for future work. The alumni are the most valuable Y2 asset regardless of the M11 decision.',
          'Year retrospective published as a Prompt edition or LinkedIn long-form post. What changed when the course existed? What did you learn about teaching, marketing, operations, and yourself? The retrospective is both closure and the bridge to Y2.',
        ],
        gate: 'Y1 financial close documented. Brand integration complete across LinkedIn, Partner Network, AIaaS, and The Prompt. Alumni network formalized as an asset. Year retrospective published. The course is now portfolio infrastructure, not a single launch.',
      },
    ],
  },
];

const STAGES = [
  { label: 'Element 1', name: 'Curriculum',  sub: 'Outcomes + lessons · M2-M5', fill: 100 },
  { label: 'Element 2', name: 'Platform',    sub: 'Maven / self-hosted · M4',   fill: 75  },
  { label: 'Element 3', name: 'Marketing',   sub: 'Engine + funnel · M5-M7',    fill: 95  },
  { label: 'Element 4', name: 'Cohort',      sub: '4 cohorts shipped · M6-M10', fill: 100 },
  { label: 'Element 5', name: 'Operations',  sub: 'Multi-cohort · M8-M12',      fill: 85  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #061418; --bg-2: #0a1f24; --fg: #e0f4f7; --fg-dim: #689da6;
  --accent: #0891b2; --accent-2: #67e8f9; --accent-dim: #155e75;
  --gate: #fbbf24; --muted: #1a3f4a; --card: #0a1f24; --border: #163036; --border-bright: #1f4048;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(8,145,178,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(251,191,36,0.05), transparent 65%), var(--bg); padding: 48px 24px 96px; }
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
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(8,145,178,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(8,145,178,0.07), rgba(8,145,178,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.engine-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(8,145,178,0.03); font-size: 12.5px; color: var(--fg); }
.engine-note strong { color: var(--accent); }
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
.week.done { border-left-color: var(--accent); background: rgba(8,145,178,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(8,145,178,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(251,191,36,0.3); background: rgba(251,191,36,0.04); align-items: start; }
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
.claims code { color: var(--accent-2); background: rgba(8,145,178,0.1); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function CourseArc() {
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
              <p className="kicker"><GraduationCap size={12} /> Learning Ops // Output Lane</p>
              <h1 className="title-serif">The <em>Course</em> Arc.</h1>
              <p className="title-sub">
                12 months. From curriculum content to a real course business — Maven cohort or
                self-paced platform, four paid cohorts shipped, alumni community, marketing engine
                operating, $50-200K Y1 gross revenue. The Teaching arc built the curriculum; this
                arc turns it into the first business that does not require Kyle in every billable
                hour.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Target: <strong>$50-200K · Y1 gross</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>4 cohorts · alumni · Y2 plan</strong></div>
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
              <h3>Tradeoff flag — marketing is the bottleneck, not curriculum.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Most failed courses have great curriculum and no audience. Most successful courses
                have decent curriculum and a working marketing system. Practitioner-creators default
                to spending 80% of time on curriculum (the familiar work) and 20% on marketing (the
                unfamiliar work). The successful course business inverts that ratio. The arc forces
                the inversion deliberately, in M5-M7, before bad habits compound.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The first business in your portfolio that scales without proportional Kyle-time — cohort #4 generates revenue with measurably less per-enrollment effort than cohort #1</li>
                    <li>$50-200K Y1 gross revenue depending on price point and cohort size — meaningful income separate from Intinc paycheck and Customization Service one-offs</li>
                    <li>Alumni network as a Y2+ asset — referrals, advisory engagements, future course launches, Partner Network amplification</li>
                    <li>Teaching credentials at scale — the course existing makes you the "person who teaches X" in a way that 50 LinkedIn posts cannot</li>
                    <li>Compounds with Teaching arc and Brand arc directly — alumni become brand amplifiers, course IP becomes brand asset</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>MED-HIGH load (8-12 hrs/week) consistent across the year — cohort delivery weeks spike to 12-16 hrs, build months can be lighter</li>
                    <li>The marketing learning curve is real and unfamiliar — most practitioner-creators underestimate how different "marketing a course" is from "teaching a topic"</li>
                    <li>The first cohort emotional cost is high — first paid cohort means real students depending on the course working. Imposter syndrome spikes in M6</li>
                    <li>Out-of-pocket costs: platform fees (<code>$0-10K</code> depending on Maven vs self-hosted), contractor costs (<code>$2-8K</code> for video editor, designer), marketing spend (<code>$0-5K</code>)</li>
                  </ul>
                </div>
              </div>
              <div className="engine-note">
                <strong>The marketing-engine rule that determines whether this arc scales:</strong>{' '}
                by M7 cohort #2, the creator-time-per-enrollment should be measurably lower than M6
                cohort #1. By M9 cohort #3, it should be lower again. If the per-enrollment effort
                is flat or rising, the marketing system isn\'t actually a system — it is heroic
                repeated effort. The discipline is in measuring the ratio, not in just running
                cohorts.
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
                          <div className="gate-label">Revenue gate · M{m.n}</div>
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
              <li><strong style={{ color: 'var(--fg)' }}>MED-HIGH load (8-12 hrs/week) with cohort delivery weeks spiking.</strong> Build months (M2-M5) average 8-10 hrs/week on curriculum + content. Cohort delivery weeks (M6-M10) spike to 12-16 hrs/week including live sessions, exercise review, and student support. Plan the calendar accordingly.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Revenue thresholds are realistic but not guaranteed.</strong> The numbers (Q1: $0 / Q2: $5-15K / Q3: $30-70K / Q4 cumulative $50-200K) assume a B2B/practitioner audience at price points of $500-2,500. Lower price points produce different math; higher prices require stronger positioning. Calibrate by M4 pricing decision.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The Maven path is the recommended platform for this arc.</strong> Maven\'s built-in audience, premium positioning, and cohort-first model match the arc structure. Self-hosted is viable but adds 20-30% more operational overhead. Substack-as-course works for established audiences only. Choose at M4 based on existing audience size — under 1,000 email subscribers, Maven advantage is real; over 5,000, self-hosted economics improve.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The marketing-engine work is the unfamiliar work for practitioner-creators.</strong> Most engineers who attempt course businesses fail at marketing, not curriculum. The arc forces marketing discipline in M5-M7. If marketing work feels uncomfortable or low-priority during those months, the arc is doing what it was designed to do.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This arc compounds with Teaching arc, Brand arc, AIaaS arc, and Partner Network Anchor arc.</strong> Teaching arc provides curriculum source material. Brand arc audience becomes course audience. AIaaS service line gets credibility boost from course-as-credential. Partner Network Anchor arc gets alumni as referral source. Sequencing all five over Y1-Y2 produces the highest leverage.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The M11 strategic decision is binding and non-trivial.</strong> "Scale, sustain, or sunset" is a real fork. Most course creators default to "sustain" without explicit choice and end up in a stagnant Y2. The discipline is in making the explicit choice — including "sunset" if the data doesn\'t support continuation. M11 conversation with external advisor is not optional.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
