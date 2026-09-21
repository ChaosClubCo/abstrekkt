import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Rocket } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATION',
    subtitle: 'Idea validation. Customer concentration decision. MVP shipped to 5-10 design partners.',
    months: [
      {
        n: 1,
        title: 'Idea validation and the customer concentration check',
        why: 'The Full-Stack arc shipped three apps; one likely has paying customers. This arc takes the strongest candidate (or starts fresh) and turns it into a real SaaS business. M1 is the validation work — and more importantly, the customer concentration decision that will shape everything. Building for one specific client produces a different product than building for the market.',
        weeks: [
          'Idea audit — for the candidate product, write the problem statement, target user, and current alternatives. Compare against the Strategy arc M2 audience-interview methodology. If the product was built on assumptions rather than interviews, M1 is where that gets caught and addressed.',
          'Customer interviews — 8-12 conversations with potential users. Document their actual pain, current workarounds, and willingness to pay. The "willingness to pay" question is the hard one: most interview subjects say yes when asked abstractly. The validation is in observing them pull out a credit card or commit to a pilot.',
          'The concentration decision: build for one anchor client (consulting-style, $50-200K ARR from one customer) or build for the market (SaaS-style, 50+ customers at $50-500/month MRR). The math, the operations, the product, and the exit options all change based on this single decision. Decide explicitly.',
          'Positioning document — for the chosen concentration path, write the positioning. For anchor-client: who is the client, what do they pay for, what does success look like at M12. For market: what segment, what price point, what acquisition channel, what does $5-50K MRR look like at M12.',
        ],
        gate: 'A written validation document with 8-12 customer interviews documented, an explicit customer-concentration decision (anchor vs market), and a positioning document for the chosen path. The product has validated demand or has had its M1 reset before building further.',
      },
      {
        n: 2,
        title: 'MVP design and tech stack decision',
        why: 'M1 validated the demand. M2 designs the MVP — the minimum product that delivers the core value, nothing more. Most failed SaaS products spent M2-M6 building features that were not needed and missing features that were. The MVP discipline is in resisting the urge to build everything you could build in favor of building only what proves the thesis.',
        weeks: [
          'MVP scope definition: the single user journey that delivers the core value. Everything else is out of scope. Write it as a user story: "User Y can do X in less than Z minutes, producing outcome W." If the MVP cannot be described in one user story, the scope is too large.',
          'Tech stack decision — Next.js + Vercel + Supabase + Stripe is the default. Use it unless there is a specific reason to deviate. Most SaaS arcs fail from over-engineered stacks; the default stack ships products that earn revenue. Document the stack and the reason for any deviation.',
          'Wireframes and key flows — not pixel-perfect designs, but clear flows. The login flow, the core feature flow, the billing flow. The wireframes communicate the product to the next month\'s build, not to investors or users.',
          'Architecture sketch: database schema, API surface, deployment plan, third-party services (Stripe for billing, Supabase Auth for auth, Resend for email, PostHog for analytics). Architecture documented in one diagram. If the architecture cannot fit in one diagram, the MVP is too complex.',
        ],
        gate: 'MVP scope defined in one user story. Tech stack decided (likely Next.js + Vercel + Supabase + Stripe). Wireframes complete for core flows. Architecture sketched in one diagram. The build for M3 is now well-defined, not exploratory.',
      },
      {
        n: 3,
        title: 'Build first version and ship to 5-10 design partners',
        why: 'M3 is the build month. The MVP gets built end-to-end and shipped to design partners — early users who get free or heavily-discounted access in exchange for feedback and willingness to be cited as customers later. Design partners are the bridge between "I built something" and "people pay for this."',
        weeks: [
          'Core build — the single user journey from M2 implemented end-to-end. Skip everything that is not on the user journey. The build should feel constrained; if it feels like there\'s room to add features, the user journey was scoped too small.',
          'Production deployment — domain, SSL, basic analytics, error monitoring (Sentry), email transactional (Resend). The infrastructure that lets real users use the product in production conditions.',
          'Design partner recruitment — from M1 interview pool, reach out to 5-10 specific people. Offer free or $20-50/month access for the first 6 months in exchange for usage and feedback. Sign a simple agreement; design partners are a real commitment on both sides.',
          'Onboarding the partners — direct, white-glove. Walk each through the product personally. Document where they get stuck, what they ask about, what they don\'t use. The friction data is the M4 product roadmap.',
        ],
        gate: 'MVP shipped to production. 5-10 design partners onboarded with documented usage patterns and friction points. The product is real, not a demo. The next quarter\'s work is informed by design-partner data.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'PAYMENTS + REVENUE',
    subtitle: 'Auth and billing infrastructure. First 3-10 paying customers. $500-2K MRR. Retention systems live.',
    months: [
      {
        n: 4,
        title: 'Auth, billing infrastructure, production readiness',
        why: 'The MVP shipped without payment in M3 — design partners are free. M4 builds the auth and billing layer that turns design partners into paying customers and lets the product accept revenue from new signups. The infrastructure is not glamorous, but it is the difference between a product and a business.',
        weeks: [
          'Auth refinement — Supabase Auth wired up with email/password and optionally Google OAuth. Password reset flow, email verification, session management. The auth layer is invisible when it works and catastrophic when it doesn\'t; spend the week getting it right.',
          'Stripe billing integration — products and prices configured in Stripe, checkout flow built, webhook handler for subscription events, customer portal for self-service management. Most billing bugs are in webhook handling; test thoroughly.',
          'Production hardening — error monitoring tightened, database backups configured, rate limiting on API endpoints, abuse prevention. The infrastructure that prevents the first paying customer from hitting a broken product.',
          'Convert design partners to paid plans — for the partners who continued using the product, present the pricing and the upgrade path. Some convert immediately; some need a few weeks. The conversion rate is data: if under 30% convert, the pricing or value prop needs adjustment.',
        ],
        gate: 'Auth and billing infrastructure live and tested. At least 30-50% of design partners converted to paying plans. Production monitoring catches errors before customers report them. The product can accept revenue from anyone, not just design partners.',
      },
      {
        n: 5,
        title: 'First paying customers — $500-2K MRR',
        why: 'M5 is the first revenue month. Real customers paying real money for the product. The number is small ($500-2K MRR is 3-10 customers at $50-500/month), but the validation is real. M5 is also when retention becomes the most important metric — keeping the first customers is harder and more valuable than acquiring them.',
        weeks: [
          'Acquisition push 1: warm network. LinkedIn audience, The Prompt subscribers, Partner Network contacts. The warm network is the easiest source of first customers and the hardest source of scalable customers. Use it for the first 5-10 paying customers; don\'t expect it to scale.',
          'Onboarding optimization — for each new paying customer, observe their first 7 days. Where do they get stuck? What do they need help with? Most SaaS products lose 40-60% of new customers in the first week from poor onboarding. The first 10 customers reveal the patterns.',
          'Customer support discipline — every support request, every email, every confused user gets responded to within 24 hours, ideally within 4. The first 10 customers should feel like they have a hotline to the founder. The support work is also product research.',
          'MRR tracking — formal MRR calculation, churn tracking, customer count, average revenue per customer. The metrics dashboard is built in M5 and refined every month. Without the dashboard, decisions get made on vibes; with it, decisions get made on data.',
        ],
        gate: '3-10 paying customers generating $500-2K MRR. Onboarding optimized based on first-week observation patterns. Customer support response time under 24 hours. MRR/churn/customer count dashboard live.',
      },
      {
        n: 6,
        title: 'Retention systems and product-market fit signals',
        why: 'Acquisition without retention is a leaky bucket. M6 builds the retention systems that keep customers around long enough to compound. Onboarding, activation, regular engagement, churn prevention — each is a discipline. M6 is also when PMF signals start to emerge or fail to emerge. The honest reading determines what Q3 looks like.',
        weeks: [
          'Onboarding system formalized — email sequence for new signups, in-product onboarding flow, "first value" milestone defined and measured. Most customers churn because they never reached first value. The system is designed to get them there in days 1-3.',
          'Activation metric defined — the specific action that predicts long-term retention. For most SaaS products, activation is a specific feature used N times in the first M days. Pick the metric, measure it, optimize for it.',
          'Churn analysis — for any customer who churned in M5, document why. Exit surveys, manual outreach, pattern recognition. The churn data is the highest-signal product research available.',
          'PMF assessment — Sean Ellis test ("how disappointed would you be if you could no longer use this?"), retention curves (do retention curves flatten or keep dropping?), word-of-mouth signals (are customers referring others?). The aggregate signal is honest, not aspirational.',
        ],
        gate: 'Onboarding system formalized with measurable first-value milestone. Activation metric defined and tracked. Churn analysis documented for any churned customers. Aggregate PMF signal assessed honestly with documented evidence.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GROWTH',
    subtitle: 'Growth channel experiments. Winning channel identified and scaled. $3-10K MRR by Q3 close.',
    months: [
      {
        n: 7,
        title: 'Growth channel experiments — 3-5 channels tested',
        why: 'The warm network is exhausted by M7. Growth now requires real channels — predictable, repeatable sources of new customers. M7 is the experimentation month: try 3-5 channels in parallel, measure honestly, and let the data identify the winner. Most SaaS arcs fail in Q3 not because nothing works but because nothing was tested rigorously enough to know what works.',
        weeks: [
          'Channel hypothesis — list 3-5 candidate growth channels for your specific product and customer. Common candidates: SEO content (long lead time but compounds), paid ads (fast but expensive), partnerships (high effort but high conversion), product-led growth (built-in virality), community-driven (slow but durable). Pick based on customer interview data, not preference.',
          'Channel #1 and #2 — first two channels launched in parallel. Each gets its own small budget, its own measurement, its own owner (likely you). Document the funnel: impressions → signups → activated → paid. The funnel data is the channel\'s signal.',
          'Channel #3 — third channel launched. By now, channels #1 and #2 have early data. The third channel is calibrated against what\'s working and what\'s not.',
          'Mid-quarter assessment — for each channel, calculate cost per acquired customer (CAC) and revenue lifetime value (LTV). The LTV:CAC ratio is the channel\'s viability signal. Under 3:1, the channel is borderline. Under 2:1, the channel is not viable at scale. Cut channels honestly.',
        ],
        gate: '3-5 growth channels tested with documented funnel data. CAC and LTV calculated per channel. Channels rated by LTV:CAC ratio. The viable channels are identified and the non-viable ones cut.',
      },
      {
        n: 8,
        title: 'Identify winning channel and double down',
        why: 'M7 produced data on multiple channels. M8 picks the winner and scales it. Most SaaS businesses succeed with one dominant channel and use others as supplementary. M8 is the focus month — go deep on the one channel that works rather than maintaining diluted effort across multiple.',
        weeks: [
          'Channel selection — based on M7 data, pick the channel with the best LTV:CAC ratio and the most scalable mechanics. The decision is data-driven, not preference-driven. Sometimes the winning channel is the one you didn\'t expect.',
          'Channel doubling-down — for the chosen channel, increase budget, increase frequency, increase quality. If SEO: more content. If paid ads: more spend. If partnerships: more outreach. The discipline is in committing fully to the channel that works rather than hedging.',
          'Conversion optimization — landing pages, signup flow, onboarding all optimized for the specific customers coming from the chosen channel. Different channels convert differently. The channel-specific optimization is where the compounding happens.',
          'Operational systems — the chosen channel run as a system, not as heroics. Content calendar, ad management cadence, partnership pipeline. The systems are what allow scale without proportional time increase.',
        ],
        gate: 'Winning channel identified and committed. Channel-specific conversion optimization complete. Operational systems for the channel documented and running. The channel is scaling, not just being tested.',
      },
      {
        n: 9,
        title: '$3-10K MRR with channel compounding',
        why: 'M9 is the revenue compounding month. The winning channel is operating, customers are signing up consistently, retention is holding from the M6 systems, and MRR is meaningfully higher than M6. $3-10K MRR is not a unicorn, but it is the threshold where the business starts looking real.',
        weeks: [
          'Channel scaling — continued investment in the winning channel. New content, new ads, new partnerships, whatever the channel is. The scaling is calibrated to LTV:CAC sustainability, not to maximize short-term growth at the expense of unit economics.',
          'Customer success motion — for new customers from the channel, the onboarding-to-activation flow runs reliably. Some customers need extra support; build the playbook for that. The customer success motion is what turns acquisition into retention.',
          'Pricing review — by M9, you have enough data to assess whether pricing is right. Are customers complaining about price? Are they paying without question? Most SaaS products underprice in year 1. The M9 review is the moment to adjust.',
          'Q3 close metrics — total customers, MRR, churn rate, LTV:CAC, customer lifetime value. The numbers shape the M10-M12 work. If MRR is at the low end ($3K), Q4 is about validating the model. If MRR is at the high end ($10K), Q4 is about scaling further.',
        ],
        gate: '$3-10K MRR by Q3 close. Channel-driven acquisition operating consistently. Customer success motion preventing the kind of churn that would offset acquisition. Pricing reviewed and adjusted based on M5-M9 data.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'OPERATIONS',
    subtitle: 'Operational maturity. Strategic Y2 decision: scale, lifestyle business, or sunset. $5-50K MRR target.',
    months: [
      {
        n: 10,
        title: 'Operational maturity and customer success automation',
        why: 'M10 is when the business stops being heroic and starts being operational. Customer support has a system, not just direct founder response. Onboarding is automated where possible and white-glove where required. The business runs without Kyle in every customer interaction. M10 is the work that determines whether the SaaS scales or stays at "lifestyle business" tier.',
        weeks: [
          'Customer support tiering — what gets answered by docs / AI / automation, what gets answered by you. The tiering reduces founder-time-per-customer as the customer base grows. Most SaaS arcs fail to scale here.',
          'Onboarding automation — for the most common customer profile, the onboarding is fully automated and produces activation reliably. White-glove onboarding reserved for high-value customers only.',
          'Documentation and self-service — the help center, the knowledge base, the in-product help. Customers who can self-serve don\'t generate support tickets. The documentation is an investment with high return.',
          'Operational dashboard — MRR, churn, NPS, support response time, infrastructure costs all visible in one place. The dashboard is the daily-check artifact that prevents drift.',
        ],
        gate: 'Customer support tiered with clear automation/AI/human boundaries. Onboarding automated for the common case. Self-service documentation comprehensive. Operational dashboard tracking all key metrics in one view.',
      },
      {
        n: 11,
        title: 'Y2 strategic decision — scale, lifestyle, or sunset',
        why: 'M11 is the binary moment. Twelve months of data. Real customers, real revenue, real operations. The honest assessment of "what is this business going to be in Y2?" determines whether to invest harder, optimize for sustained cash flow, or wind down. Most SaaS founders default to "scale" without honest examination; the discipline is in considering all three paths seriously.',
        weeks: [
          'Y1 aggregate analysis — total revenue, total customers, churn rate, LTV, CAC, founder hours, dollar-per-founder-hour. The financial picture is documented honestly. The dollar-per-hour number is the honest signal of leverage vs labor.',
          'Three Y2 scenarios written: Scale (raise prices, expand product, possibly raise capital, $50-500K MRR target) — Lifestyle (sustain current cadence, modest growth, $20-50K MRR ceiling, low ops burden) — Sunset (wind down, sell to existing customers or strategic acquirer, redirect energy). Each scenario with specific tradeoffs.',
          'External advisor conversation — an investor, a peer founder, or a strategic advisor. The decision is consequential enough to deserve outside perspective. The conversation is structured around the three scenarios.',
          'Y2 decision documented and committed. The decision is binding for Y2 with one explicit review point in Y2 Q2. The other two scenarios are explicitly closed — the lifestyle business owner isn\'t secretly trying to raise capital; the scaling business isn\'t taking the foot off growth.',
        ],
        gate: 'Y1 aggregate analysis with dollar-per-hour calculated honestly. Three Y2 scenarios documented with tradeoffs. External advisor conversation completed. Y2 decision committed with one review point scheduled.',
      },
      {
        n: 12,
        title: 'Year retrospective and portfolio integration',
        why: 'M12 closes the year by integrating the SaaS into the broader portfolio. Whether the Y2 decision is scale, lifestyle, or sunset, the SaaS becomes portfolio infrastructure — case study, credential, Partner Network asset, brand artifact. M12 makes those integrations explicit rather than implicit.',
        weeks: [
          'Y1 financial close — revenue, costs, taxes set aside, net to founder. The financial picture is documented for tax purposes and honest portfolio assessment.',
          'Case study production — what the SaaS taught about product, customers, growth, operations. The case study becomes Partner Network credibility, AIaaS service line credibility, and a Brand arc Q4 flagship piece.',
          'Brand integration — the SaaS is now a credential in your LinkedIn bio, Partner Network listing, Customization Service positioning. The credential is leveraged everywhere.',
          'Year retrospective published as a Prompt edition or long-form post. What changed when you built a real SaaS? What did you learn about product, customers, marketing, and yourself? The retrospective is both closure and the bridge to Y2.',
        ],
        gate: 'Y1 financial close documented. Case study produced and integrated. Brand assets updated everywhere. Retrospective published. The SaaS is portfolio infrastructure regardless of Y2 path.',
      },
    ],
  },
];

const STAGES = [
  { label: 'Element 1', name: 'Product',    sub: 'MVP + iteration · M2-M5',     fill: 100 },
  { label: 'Element 2', name: 'Auth',       sub: 'Supabase + flows · M4',       fill: 70  },
  { label: 'Element 3', name: 'Billing',    sub: 'Stripe + webhooks · M4',      fill: 85  },
  { label: 'Element 4', name: 'Growth',     sub: 'Channel discovery · M7-M9',   fill: 95  },
  { label: 'Element 5', name: 'Retention',  sub: 'Onboarding + success · M6-M10', fill: 90 },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #061a0e; --bg-2: #0a2515; --fg: #d8f0e2; --fg-dim: #6a9a7e;
  --accent: #15803d; --accent-2: #4ade80; --accent-dim: #14532d;
  --gate: #f97316; --muted: #1a3a26; --card: #0a2515; --border: #143a23; --border-bright: #1f4a30;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(21,128,61,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(249,115,22,0.05), transparent 65%), var(--bg); padding: 48px 24px 96px; }
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
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(21,128,61,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(21,128,61,0.07), rgba(21,128,61,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.concentration-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(21,128,61,0.03); font-size: 12.5px; color: var(--fg); }
.concentration-note strong { color: var(--accent); }
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
.week.done { border-left-color: var(--accent); background: rgba(21,128,61,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(21,128,61,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(249,115,22,0.3); background: rgba(249,115,22,0.04); align-items: start; }
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
.claims code { color: var(--accent-2); background: rgba(21,128,61,0.1); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function SaasArc() {
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
              <p className="kicker"><Rocket size={12} /> Learning Ops // Output Lane</p>
              <h1 className="title-serif">The <em>SaaS</em> Arc.</h1>
              <p className="title-sub">
                12 months. From "I shipped an app" to "I run a SaaS business." MVP validated with
                design partners, Stripe billing live, first 3-10 paying customers, growth channel
                identified and scaled, $5-50K MRR by year-end. The first business in your portfolio
                where the deliverable is software earning recurring revenue, not consulting hours.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Target: <strong>$5-50K MRR · M12</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Real SaaS business · Y2 decision</strong></div>
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
              <h3>Tradeoff flag — customer concentration vs distribution shapes everything.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                The M1 decision between building for one anchor client and building for the market
                cascades into every subsequent decision. Anchor-client products look more like
                consulting; they have one customer paying $50-200K, fewer ops, longer sales cycles,
                and limited Y2+ optionality. Market products look more like SaaS; they have 50+
                customers paying $50-500/month, more ops, faster sales cycles, real Y2+ optionality
                including acquisition. Both are valid. Choosing without naming the choice produces
                a hybrid that fails at both.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>A real software business — the first portfolio asset that earns revenue while you sleep, in a way that consulting and Customization Service cannot</li>
                    <li>$5-50K MRR is meaningful income — at the high end, it rivals or exceeds the Intinc paycheck and changes the calculation on full-time independent work</li>
                    <li>Software business credentials — investors, acquirers, peers respect "I built a SaaS doing $X MRR" in a way that "I implemented for clients" does not</li>
                    <li>Y2 optionality — scale further, sell, license, or use as foundation for second product. The asset compounds across years if maintained</li>
                    <li>Compounds with Full-Stack arc and Partner Network arc — the technical foundation is from Full-Stack; the case study and credibility feeds Partner Network</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load (10-15 hrs/week minimum) with cohort-style spikes — launch weeks, growth experimentation weeks, and Q3 channel work all spike to 15-20 hrs/week</li>
                    <li>The 24-month real-world SaaS arc compressed to 12 months — accept that M12 may be the "validation complete" milestone, with Y2 being the actual "real business" year</li>
                    <li>Out-of-pocket costs: infrastructure (<code>$50-300/mo</code>), Stripe fees (<code>2.9% + $0.30/transaction</code>), marketing spend (<code>$0-10K</code>), contractors for design/copy (<code>$1-5K</code>)</li>
                    <li>SaaS-specific emotional cost: customer churn feels personal, support load is constant, the business never sleeps. Different stress profile than consulting</li>
                  </ul>
                </div>
              </div>
              <div className="concentration-note">
                <strong>The concentration rule that determines what this business actually is:</strong>{' '}
                anchor-client is consulting-with-software. Market is software-with-customers. The
                math, the operations, the product, and the Y2+ exit options all differ. The arc that
                fails picks "both" — building for one client but trying to sell to many. Pick at
                M1, commit, and let the choice shape the rest of the arc. The hybrid path is the
                failure mode that masquerades as flexibility.
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
                          <div className="gate-label">MRR gate · M{m.n}</div>
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
              <li><strong style={{ color: 'var(--fg)' }}>This is a 24-month real project compressed to 12 months.</strong> Real SaaS businesses take 18-36 months to reach steady-state. The arc compresses by being strict on MVP scope, channel focus, and Y2 deferral. Accept that M12 likely lands at "validation complete with traction" rather than "scaled and predictable."</li>
              <li><strong style={{ color: 'var(--fg)' }}>HIGH-load arc (10-15 hrs/week minimum) with spikes.</strong> Launch weeks spike to 20+ hrs. Growth experimentation weeks spike. Customer support is constant. Plan calendar accordingly — running this arc alongside another HIGH-load arc is genuinely difficult.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The Full-Stack arc is a prerequisite.</strong> M3 build assumes Next.js + Vercel + Supabase + Stripe muscle memory. Without the Full-Stack arc done, M3 takes twice as long and M4 billing integration is fragile. If Full-Stack arc isn\'t done, sequence it first or accept M2 includes more learning time.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The M1 customer concentration decision is binding.</strong> Anchor-client vs market produces different products. The hybrid path (build for one but try to sell to many) is the most common failure mode. Pick explicitly at M1; revisit only with strong data, not with second-thoughts.</li>
              <li><strong style={{ color: 'var(--fg)' }}>MRR targets are calibrated to the market path with $50-500/mo pricing.</strong> Anchor-client path produces different math: one customer at $5-15K/month or one project at $50-200K total. Both are legitimate; the arc month gates work for both with the MRR/ARR translation. Document the path explicitly so M5/M9/M12 gates make sense.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This arc compounds with Full-Stack arc and Partner Network Anchor arc directly.</strong> Full-Stack arc provides the technical foundation. The SaaS becomes a Partner Network case study at M11. The Partner Network in turn drives some customer acquisition. Sequencing these three arcs across Y1-Y2 produces the highest compounding leverage in any productization combination.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
