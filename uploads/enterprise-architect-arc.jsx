import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Building2 } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATION',
    subtitle: 'Multi-cloud mastery at scale. Enterprise transformation patterns. AI governance for Fortune 500.',
    months: [
      {
        n: 1,
        title: 'Multi-cloud AI architecture mastery at enterprise scale',
        why: 'Fortune 500 AI deployments are rarely single-cloud. The architect who calls "use Azure" or "use AWS" loses to the architect who explains when each is right, how to interoperate, and how to handle the multi-cloud governance overhead. M1 deepens the multi-cloud fluency from Series 2 into the patterns that operate at Fortune 500 scale — multi-region, multi-account, multi-team, multi-billion-row.',
        weeks: [
          'Cross-cloud AI service comparison at scale — Azure OpenAI / AWS Bedrock / Vertex AI / Anthropic API direct. For each, the enterprise-tier characteristics: PTU vs on-demand, dedicated capacity, SLA terms, BAA/DPA terms, regional availability, integration patterns with existing identity providers. Build the comparison matrix.',
          'Multi-cloud interop patterns — federated identity (Entra ID + AWS IAM + Google Cloud Identity), cross-cloud networking (private connectivity, transit), data residency and sovereignty constraints, cross-cloud observability (single pane of glass across providers). The patterns most enterprise clients actually need.',
          'Enterprise-scale RAG architecture — beyond the Series 1/2 RAG arc which scoped to single-team deployments. Multi-tenant RAG with strict security boundaries, billion-document indexes with hot/warm/cold tiering, embedding model lifecycle management, retrieval evaluation at scale. The architecture that handles real enterprise document corpora.',
          'Cost modeling at enterprise scale — Fortune 500 AI deployments operate at $500K-$50M annual AI spend. The cost optimization patterns (PTU vs on-demand, cache strategies, model tier routing, prompt caching, batch APIs) become a primary architectural concern, not an afterthought. Build a cost modeling artifact.',
        ],
        gate: 'A documented multi-cloud AI architecture reference covering all three major clouds + Anthropic direct. Multi-cloud interop patterns mapped. Enterprise-scale RAG architecture diagram. Cost modeling spreadsheet at multi-million-dollar AI spend scale. The architecture fluency now operates at the scale Fortune 500 clients require.',
      },
      {
        n: 2,
        title: 'Enterprise transformation patterns — people, process, technology',
        why: 'Fortune 500 AI engagements are 70% organizational change and 30% architecture. The architect who delivers only technical reference architectures is solving 30% of the problem. M2 builds the organizational transformation fluency that turns "we built this" into "they adopted this." The pattern library most architects skip and pay for in stalled deployments.',
        weeks: [
          'AI adoption maturity models — published frameworks (Gartner AI Maturity Model, McKinsey AI Quotient, BCG AI Maturity Matrix) and the patterns common across them. Most Fortune 500 AI work starts with a maturity assessment; learning to conduct one credibly is a primary architect deliverable.',
          'Operating model patterns — centralized AI CoE vs federated AI teams vs hybrid hub-and-spoke. Each has different governance overhead, velocity tradeoffs, and adoption profiles. Most enterprises end up with hub-and-spoke; the architect who can explain why and design it well is rare.',
          'Change management for AI deployments — Prosci ADKAR or equivalent applied to AI specifically. The patterns of why AI deployments fail in production (insufficient user training, missing feedback loops, undefined ownership, poor change communication). The change management literature is a primary tool, not a soft skill.',
          'Skills transformation patterns — how enterprises upskill existing workforce for AI-augmented work, the training program designs that produce real capability rather than completion-certificate theater. The skills work is increasingly the C-suite concern; the architect who speaks to it has a seat at the C-suite table.',
        ],
        gate: 'A documented enterprise transformation toolkit: AI maturity assessment template, three operating model designs with tradeoffs, change management framework for AI deployments, skills transformation pattern library. The transformation fluency now matches the architecture fluency.',
      },
      {
        n: 3,
        title: 'Enterprise AI governance — frameworks, risk, board-level concerns',
        why: 'Fortune 500 AI governance has a board-level dimension that most architects never engage with. AI risk reporting to audit committees, AI ethics frameworks at the corporate level, AI usage policies that span tens of thousands of employees. M3 builds the governance fluency that turns the architect from technical resource into strategic advisor.',
        weeks: [
          'NIST AI RMF at enterprise scale — the Govern function specifically, which most practitioners skip. AI governance bodies, AI policy structure, AI risk registers, AI decision rights frameworks. Enterprise implementation of NIST AI RMF is a specific consulting deliverable; learn to produce it.',
          'AI ethics frameworks at corporate scale — the published frameworks (IBM AI Ethics, Microsoft Responsible AI, Google AI Principles) and how Fortune 500 enterprises adapt these into corporate policy. The pattern of "principles → policies → procedures → controls" applied to AI specifically.',
          'Board-level AI risk reporting — the audit committee and board-of-directors view of AI risk. What metrics get reported, what risk language is used, what decisions reach board level. Public disclosures from major enterprises (10-K AI risk sections, proxy statements mentioning AI oversight) are the primary source — read them.',
          'EU AI Act and global AI regulation — the EU AI Act\'s tiered risk framework, the equivalent emerging regulation in UK, Canada, Singapore, China. Fortune 500 AI must navigate global regulatory landscape; the architect who can map a deployment against EU AI Act risk categories is increasingly valuable.',
        ],
        gate: 'Documented governance toolkit: enterprise NIST AI RMF implementation template, corporate AI ethics framework, board-level AI risk reporting structure, EU AI Act risk classification methodology. The governance fluency now operates at the strategic-advisor level, not the technical-implementer level.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'REFERENCE ARCHITECTURES',
    subtitle: 'Three published reference architectures. Cited by partners or Microsoft/AWS/GCP. Service offerings defined.',
    months: [
      {
        n: 4,
        title: 'Reference architecture 1 — enterprise multi-cloud AI platform',
        why: 'M4 publishes the first comprehensive reference architecture — a multi-cloud enterprise AI platform pattern that synthesizes M1-M3 work into a single citable artifact. Reference architectures from independent architects are rare; from credible independent architects, they are referenced and amplified by cloud partners. The publication is the credentialing event.',
        weeks: [
          'Architecture scope decision — pick the specific platform pattern to document. Most useful: multi-cloud AI platform with federated identity, multi-tenant deployment, governance overlay, observability layer, and the operating model that runs it. Scope to ~30-50 pages with diagrams.',
          'Drafting — written as a reference document, not a marketing piece. Architecture diagrams in standard notation (C4, archimate, or simple AWS/Azure/GCP architecture notation). Sections on architecture, governance, operating model, cost model, scaling considerations. The format follows AWS Well-Architected, Azure CAF, or GCP Architecture Center conventions.',
          'External review — 2-4 reviewers: a cloud partner architect (AWS/Azure/GCP solutions architect contact), a peer enterprise architect, an AI infrastructure leader from an existing engagement. The review catches positioning issues and technical errors before publication.',
          'Publication — on kylerosebrook.com or a dedicated FlashFusion architecture asset. PDF download for distribution. LinkedIn long-form announcement with specific framing (not "I published an architecture" but "here\'s what we\'ve learned about enterprise multi-cloud AI"). Submit to cloud partner programs where applicable.',
        ],
        gate: 'First reference architecture published with documented external review. Distributed through LinkedIn, kylerosebrook.com, and cloud partner programs. The architecture is now a citable artifact, the first piece of Fortune 500-credible evidence.',
      },
      {
        n: 5,
        title: 'Reference architecture 2 — enterprise AI governance and risk',
        why: 'M5 publishes the second reference — the governance and risk pattern from M3 turned into a published architecture. Governance reference architectures are rare; published governance content tends to be principle-level or vendor-marketing. A practitioner reference fills a gap.',
        weeks: [
          'Architecture scope — the enterprise AI governance pattern documented as architecture: governance bodies, AI policy framework, decision rights, risk register integration, audit committee reporting structure, controls library. Includes the EU AI Act risk classification methodology from M3.',
          'Drafting — same conventions as M4 but with governance-specific frameworks (NIST AI RMF, ISO/IEC 42001 from regulated AI work, EU AI Act). The architecture is unusual in being governance-first rather than technology-first.',
          'External review — different review pool than M4. AI ethics practitioners, governance officers from regulated industries, an academic AI policy contact if available. The governance work needs different review than the architecture work.',
          'Publication — same motion as M4 but distributed in governance-adjacent venues (IAPP, AICPA AI working groups, AI Governance Alliance) in addition to architecture venues. The cross-distribution builds visibility across two audiences.',
        ],
        gate: 'Second reference architecture published in governance space. Distributed through both architecture and governance venues. The pattern of "this practitioner publishes substantive reference work" becomes visible.',
      },
      {
        n: 6,
        title: 'Reference architecture 3 + service offerings defined',
        why: 'M6 ships the third reference architecture and defines the service offerings that turn the reference work into billable engagements. Three reference architectures is the volume that establishes credibility; the service offerings are how the credibility converts to revenue.',
        weeks: [
          'Third reference architecture topic — either enterprise AI scale (multi-region, multi-billion-row, $10M+ AI spend) or industry-specific (financial services AI, healthcare AI at enterprise scale, manufacturing AI). The topic depends on Q3 engagement pipeline signals.',
          'Drafting and review — same motion as M4-M5. By M6, the production process is muscle memory; pace is faster while quality holds.',
          'Service offering definition — three offerings: AI Architecture Review ($25-50K, 2-4 weeks), AI Transformation Engagement ($150-400K, 3-6 months), Fractional Chief AI Architect ($15-30K/month, ongoing 6-12 month engagement). Each with scope, deliverables, target client profile.',
          'Service offering distribution — added to LinkedIn About section, kylerosebrook.com services page, Partner Network listing if applicable. Pitch materials drafted as one-pagers for each offering. The service line is now actively marketable.',
        ],
        gate: 'Three reference architectures published. Three service offerings defined with pricing, scope, and pitch materials. The architect-as-service practice is now operational, not theoretical.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'ENGAGEMENTS',
    subtitle: 'First Fortune 500-tier engagement pursued and closed. Execution at enterprise scale. Case study secured.',
    months: [
      {
        n: 7,
        title: 'First Fortune 500-tier engagement — pursuit and close',
        why: 'M7 is the deal pursuit month. Enterprise sales cycles are 3-9 months; M7 starts the pursuit that ideally closes in M8-M9. The work is unfamiliar to most practitioners — multi-stakeholder discovery, procurement navigation, statement-of-work negotiation. The architecture depth gets you considered; the sales cycle work is what closes deals.',
        weeks: [
          'Target identification — 10-15 specific Fortune 500 (or Fortune 2000) targets where the architecture work fits. Use LinkedIn, Intinc network, Partner Network, published reference architecture inbound. The targets are specific named accounts, not "Fortune 500 healthcare."',
          'Outreach and initial discovery — multi-touch outreach to specific named contacts (Chief Data Officer, Chief AI Officer, VP of AI Platform, sometimes CISO for governance-led engagements). Reference architectures from Q2 are the credibility currency. Initial discovery calls scheduled.',
          'Deal qualification — for conversations that materialize, qualify against BANT or MEDDIC: Budget, Authority, Need, Timeline / Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion. Most enterprise opportunities die from lack of qualification, not lack of interest.',
          'Proposal work — for qualified opportunities, formal proposals with scope, timeline, deliverables, pricing, terms. Enterprise procurement requires specific format and substantial detail. The proposal work is itself a deliverable; rushed proposals lose deals that good proposals would close.',
        ],
        gate: 'Target list of 10-15 Fortune 500 accounts. Active outreach with documented response rates. At least 2-3 qualified opportunities in formal proposal stage by end of M7. The pipeline is now in motion toward an M8-M9 close.',
      },
      {
        n: 8,
        title: 'First engagement closed and kicked off',
        why: 'M8 closes the first engagement. The close is the validation moment — proof that the M1-M7 work translates into Fortune 500 demand. Enterprise engagements are not just larger versions of mid-market engagements; the operating model, the stakeholder map, the deliverable expectations all differ. M8 onboards into that operating model.',
        weeks: [
          'Final negotiations and close — terms, pricing, statement of work, contract execution. Enterprise contracts require legal review on both sides, security questionnaires (SIG, CAIQ, custom enterprise), insurance verification. The close work is 2-3 weeks minimum.',
          'Kickoff at enterprise scale — multi-stakeholder kickoff with 10-30 attendees, formal project plan, RAID log (Risks, Assumptions, Issues, Dependencies), communication cadence definition. The kickoff is itself a deliverable; enterprises evaluate the architect on kickoff quality before evaluating delivery.',
          'Engagement execution — first weeks of substantive work. Discovery, stakeholder interviews, current-state assessment, gap analysis. The deliverable quality must match the M4-M6 reference architecture quality — clients have read those before hiring you, and the working deliverables get compared.',
          'Stakeholder management — Fortune 500 engagements have 5-15 stakeholders with different concerns. The communication cadence (weekly steering, biweekly working sessions, monthly executive readouts) is what keeps the engagement on track. Most architects underweight stakeholder communication and pay for it in stalled engagements.',
        ],
        gate: 'First Fortune 500-tier engagement closed and kicked off. Multi-stakeholder communication cadence operating. Initial discovery and current-state assessment complete. The architect-at-scale practice is now operational on a real engagement.',
      },
      {
        n: 9,
        title: 'Engagement execution + second pursuit',
        why: 'M9 runs first engagement execution at scale while pursuing the second. Enterprise engagement quality requires concentration; second pursuit requires consistent outbound. The discipline of running both in parallel is the test of whether this is a real practice or a one-engagement experiment.',
        weeks: [
          'First engagement substantive delivery — by M9, the engagement is past discovery and into deliverable production. Reference architectures applied to client context, governance frameworks adapted, transformation roadmaps drafted. The deliverable quality is documented for the M11 case study.',
          'Second engagement pursuit — continued outreach to Q1 target list plus new targets from M7-M8 reference architecture inbound. The pipeline must continue to be fed even with active engagement; the discipline of "even during execution, 4-8 hrs/week on pipeline" is what produces M10-M12 continuity.',
          'Stakeholder management discipline — the first engagement\'s stakeholder communication is operating reliably. Steering committees, executive readouts, weekly working sessions all on cadence. Most architects underweight this; the ones who do it well get re-engaged on different problems within the same enterprise.',
          'Q3 close metrics — first engagement at mid-execution with documented deliverable quality. Second engagement in qualified proposal stage. Pipeline of 5-10 additional qualified or qualifying conversations. The practice is now multi-engagement, not single-engagement.',
        ],
        gate: 'First engagement at mid-execution with deliverable quality matching M4-M6 reference architecture quality. Second engagement in formal proposal stage. Pipeline maintained alongside execution. The practice is now Fortune 500-grade operational.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'POSITIONING',
    subtitle: 'Speaking at enterprise venues. Industry recognition. Y2 decision: independent practice or Intinc Principal.',
    months: [
      {
        n: 10,
        title: 'Speaking circuit — enterprise AI venues',
        why: 'M10 turns the engagement work into industry recognition through speaking engagements at enterprise AI venues. Gartner Symposium, AWS re:Invent, Microsoft Ignite, Google Cloud Next, industry-specific venues (FinTech Connect, HIMSS, ICAS). The speaking circuit is where enterprise architects build the visibility that produces inbound, not just outbound.',
        weeks: [
          'Speaking submission portfolio — submit to 5-10 relevant venues. Each submission requires specific format (CFP responses, abstract structures, sometimes recorded sample talks). The submission work is unfamiliar to most architects and is the gate before any visibility.',
          'Direct outreach to organizers — for the most relevant venues, direct outreach to track chairs and program committees. References to the M4-M6 published architectures as credentials. The personal connections often matter more than blind submissions.',
          'Podcast and webinar circuit — enterprise AI podcasts, cloud partner webinars (Microsoft, AWS, Anthropic). The medium has lower barriers than conference speaking and produces faster visibility. Reach out with specific topic proposals tied to your published work.',
          'First speaking confirmations or scheduled appearances — by M10 close, at least 1-2 confirmed speaking opportunities and 2-3 podcast appearances scheduled or recorded. The speaking circuit is now active.',
        ],
        gate: 'At least 1-2 confirmed enterprise speaking opportunities. 2-3 podcast appearances scheduled or recorded. Direct outreach to organizers documented. The speaking circuit is now operating, with M11-M12 amplification expected.',
      },
      {
        n: 11,
        title: 'Industry recognition and second engagement case study',
        why: 'M11 amplifies the speaking work into industry recognition. Citations of the published reference architectures, partner amplification (Microsoft / AWS / Anthropic featuring your work), peer architects referencing your patterns. Second engagement (from M9 pursuit) closes and the first engagement\'s case study publishes.',
        weeks: [
          'First engagement case study — sanitized to client comfort, published with specific framework references, architecture patterns, and outcomes. Same publication motion as Partner Network arc case studies but at enterprise scale. The case study is more technical and more substantive.',
          'Second engagement close (if pursued from M9) — same close motion as M8. By M11, the close work is muscle memory; the second engagement closes faster and at higher confidence than the first.',
          'Partner amplification — outreach to Anthropic Partner team, Microsoft Partner contacts, AWS / GCP Partner channels with the published reference architectures and case study. Partners actively amplify high-quality independent architect work; the outreach unlocks that amplification.',
          'Industry visibility metrics review — citations of published work, social engagement on architecture posts, direct inbound from new enterprise contacts, speaking circuit traction. The data shapes the M12 strategic decision.',
        ],
        gate: 'First engagement case study published. Second Fortune 500 engagement closed or in late-stage proposal. Partner amplification of published work documented. Industry visibility metrics tracked.',
      },
      {
        n: 12,
        title: 'Y2 strategic decision — independent practice or Intinc Principal Architect',
        why: 'M12 is the year-defining strategic decision. The Enterprise Architect arc opens a unique Y2+ path: full transition to independent enterprise architect (rates of $400-800/hr, $200K-500K engagement values, 5-10 engagements per year), Intinc Principal Architect role internalizing the depth, or a hybrid model. The Y1 data determines which path is realistic.',
        weeks: [
          'Y1 aggregate analysis — total engagements closed, total revenue, average engagement size, sales cycle length, hours per engagement, dollar-per-hour. The financial picture is honest. Enterprise architecture work at $400-800/hr with full pipeline produces $500K-$1.5M annual revenue; the M12 question is whether the Y1 data supports that trajectory.',
          'Three Y2 scenarios — Independent (full transition out of Intinc to independent enterprise architecture practice) — Intinc Principal Architect (formal role internalizing the depth, possibly Head of Enterprise AI or similar title with comp adjustment) — Hybrid (continued Intinc role with independent engagements on side, the Customization Service-style structure). Each scenario with explicit tradeoffs.',
          'Strategic conversations — Daniel for the Intinc Principal Architect scenario, an independent consultant peer for the Independent scenario, an attorney/accountant for the structural and tax implications. Three perspectives on the data and the choice.',
          'Y2 decision committed — the most consequential Y2 decision of any Lane A arc. Documented with reasoning, timeline, decision criteria for execution. The decision shapes everything in Y2 — career structure, financial model, FlashFusion integration, Personal Brand positioning.',
        ],
        gate: 'Y1 aggregate analysis with dollar-per-hour calculated honestly. Three Y2 scenarios documented with structural implications. Strategic conversations completed with Daniel, independent peer, and structural advisors. Y2 decision committed with execution timeline.',
      },
    ],
  },
];

const STAGES = [
  { label: 'Dimension 1', name: 'Reference Arch',  sub: '3 published · M4-M6',         fill: 100 },
  { label: 'Dimension 2', name: 'Multi-cloud',     sub: 'Cross-cloud patterns · M1',   fill: 90  },
  { label: 'Dimension 3', name: 'Transformation',  sub: 'People + process · M2',       fill: 85  },
  { label: 'Dimension 4', name: 'Governance',      sub: 'Board-level + NIST · M3',     fill: 80  },
  { label: 'Dimension 5', name: 'Scale',           sub: 'F500 engagements · M7-M11',   fill: 95  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #050a18; --bg-2: #0a1228; --fg: #dee5f5; --fg-dim: #7a89ad;
  --accent: #1e40af; --accent-2: #60a5fa; --accent-dim: #1e3a8a;
  --gate: #cbd5e1; --muted: #142340; --card: #0a1228; --border: #102040; --border-bright: #1a2d54;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,64,175,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(203,213,225,0.04), transparent 65%), var(--bg); padding: 48px 24px 96px; }
.container { max-width: 1120px; margin: 0 auto; }
.header-grid { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--accent-2); margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px); line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg); }
.title-serif em { color: var(--accent-2); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent-2); font-weight: 500; }
.stages-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden; }
.stage-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.stage-item:last-child { border-right: none; }
.stage-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.stage-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px; color: var(--accent-2); }
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(96,165,250,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent-2); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent-2); border-left-width: 3px; background: linear-gradient(90deg, rgba(30,64,175,0.07), rgba(30,64,175,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent-2); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent-2); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.cycle-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(30,64,175,0.04); font-size: 12.5px; color: var(--fg); }
.cycle-note strong { color: var(--accent-2); }
.quarter-rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.qtab { padding: 20px 18px; cursor: pointer; background: transparent; border: none; border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim); transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative; }
.qtab:last-child { border-right: none; }
.qtab:hover { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent-2); }
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent-2); text-transform: uppercase; }
.qtab-phase { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400; }
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }
.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--accent-2); }
.month-head { padding: 20px 24px; cursor: pointer; display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none; }
.month-num { font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1; color: var(--accent-2); font-style: italic; font-weight: 400; }
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent-2); }
.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright); cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.week:hover { border-left-color: var(--accent-2); }
.week.done { border-left-color: var(--accent-2); background: rgba(30,64,175,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(30,64,175,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent-2); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(203,213,225,0.25); background: rgba(203,213,225,0.04); align-items: start; }
.gate-icon { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text { font-size: 13px; color: var(--fg); font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45; }
.progress-wrap { position: sticky; top: 0; background: var(--bg); padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border); }
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent-2); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent-2); transition: width 0.4s ease; }
.claims { margin-top: 72px; padding: 24px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims code { color: var(--accent-2); background: rgba(30,64,175,0.15); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function EnterpriseArchitectArc() {
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
              <p className="kicker"><Building2 size={12} /> Learning Ops // Specialization Lane</p>
              <h1 className="title-serif">The <em>Architect</em> Arc.</h1>
              <p className="title-sub">
                12 months. From AI implementation practitioner to the architect Fortune 500 clients
                call directly. Multi-cloud architecture mastery in Q1. Three reference architectures
                published in Q2. First Fortune 500-tier engagements closed in Q3. Industry recognition
                and Y2 strategic decision in Q4 — independent enterprise architect at $400-800/hr
                or Intinc Principal Architect with formal role and comp adjustment. The most consequential
                Y2 career decision of any Lane A arc.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Lane: <strong>A · Specialization · pick ONE</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>2 F500 engagements + Y2 decision</strong></div>
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
              <h3>Tradeoff flag — enterprise sales cycle is the constraint, not engineering capability.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Architects who fail at Fortune 500 work usually have strong engineering and weak
                sales-cycle muscle. The 6-12 month sales cycles, the multi-stakeholder discovery,
                the procurement navigation, the statement-of-work negotiation — these are the
                disciplines that close enterprise deals. Engineering depth gets you in the room;
                sales-cycle competence is what closes the deal. The arc front-loads architecture
                (Q1-Q2) but explicitly invests in sales-cycle discipline (Q3) because that is the
                actual constraint, not the architecture work.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The highest-leverage Lane A path — Fortune 500 architect rates of <code>$400-800/hr</code> with engagement values of <code>$200K-500K</code>, producing <code>$500K-$1.5M</code> annual revenue at full pipeline</li>
                    <li>Y2 transition optionality — independent practice, Intinc Principal Architect with formal title and comp adjustment, or hybrid. The most consequential career fork of any Lane A arc</li>
                    <li>Reference architectures are durable assets — citations, partner amplification, and inbound from Fortune 500 contacts for 2-5 years after publication. Higher leverage than case studies for this specific market</li>
                    <li>Industry recognition through speaking circuit — Gartner Symposium, AWS re:Invent, Microsoft Ignite. The visibility compounds and produces inbound that other Lane A paths do not</li>
                    <li>Builds directly on every prior arc — Series 1 platform arcs, Series 2 cloud arcs (GCP, Azure), Strategy arc, Eval arc, Security arc all feed enterprise architect depth</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load (12-18 hrs/week) with execution-week spikes to 25-30 hrs/week during active F500 engagements</li>
                    <li>Long sales cycles (3-9 months) — Q1-Q2 produce minimal direct revenue. The work compounds late in Y1 with substantial Y2+ payoff</li>
                    <li>The Y2 decision is genuinely career-altering — independent practice means leaving Intinc paycheck. The decision is consequential and unforgiving</li>
                    <li>The other two Lane A specializations are explicitly closed. Regulated AI Security and Eval & Safety become Y2+ options only</li>
                    <li>Out-of-pocket: substantial reference architecture production costs (<code>$3-8K</code> for design, editing, distribution), speaking circuit travel (<code>$2-8K</code>), enterprise insurance (<code>$2-5K/yr</code> for E&O coverage at engagement scale)</li>
                  </ul>
                </div>
              </div>
              <div className="cycle-note">
                <strong>The sales-cycle rule that determines whether this specialization produces F500 revenue:</strong>{' '}
                most architects who pursue Fortune 500 work fail because they treat the work as an
                extension of mid-market engagement patterns. Enterprise procurement is fundamentally
                different — security questionnaires (SIG, CAIQ), MSAs and SOWs that require legal
                review on both sides, payment terms (Net-60 or Net-90 is common), insurance
                requirements ($2M+ E&O minimum). The architect who learns to navigate this without
                resenting it closes deals; the architect who treats it as friction loses deals to
                competitors who have learned the navigation. Q3 is where this muscle is built or
                the arc fails.
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
                          <div className="gate-label">F500 gate · M{m.n}</div>
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
              <li><strong style={{ color: 'var(--fg)' }}>HIGH load (12-18 hrs/week) with execution spikes to 25-30 hrs/week.</strong> Active Fortune 500 engagement weeks consume significant time; the load is not steady. Multi-engagement quarters (M9-M11) are particularly demanding. Plan calendar and personal commitments accordingly.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The 24-month real project compressed to 12 months.</strong> Full Fortune 500 architect practice typically takes 18-30 months to build to steady-state. The arc compresses by being aggressive on reference architecture production (3 in Q2) and front-loading sales-cycle work (Q3). Accept that M12 likely lands at "first engagements closed with growing pipeline" rather than "steady-state $1M+ practice."</li>
              <li><strong style={{ color: 'var(--fg)' }}>Sales cycles are 3-9 months — Q1-Q2 produce minimal direct revenue.</strong> Fortune 500 procurement is structurally slow. Most Q1-Q2 work is pipeline-building and credential-establishing. Q3-Q4 is where first revenue lands, and Y2 is where the practice reaches financial sustainability if Y1 was executed well.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The Y2 decision is the most consequential of any Lane A arc.</strong> Independent practice means leaving Intinc paycheck and accepting income variability — even at high rates, the first 6-12 months of full-independent practice can be uneven. Intinc Principal Architect role internalizes the depth but requires Daniel and Intinc leadership commitment to the role. Hybrid is structurally complex but reduces risk. The decision deserves substantial strategic-conversation time in M11-M12.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The other two Lane A specializations are explicitly closed.</strong> Regulated AI Security and Eval & Safety become Y2+ options only when this arc is chosen. Lane A depth is genuinely "pick one"; pursuing multiple defeats the depth thesis entirely.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Cross-arc dependencies are substantial.</strong> Builds directly on Series 1 GCP, Series 2 Azure Foundry, AIaaS arc, Strategy arc, Security arc, Eval arc. The depth at this scale assumes the foundational arcs are largely complete. If foundational arcs are still in flight, accept that the Q1 ramp is significantly steeper and the M11-M12 outcomes may compress.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This arc compounds with Partner Network Anchor arc directly.</strong> Partner Network listing benefits enormously from Fortune 500 case studies. The combination of "Anthropic Partner with Fortune 500 architecture practice" is rare and produces inbound that neither arc alone could. If running this arc, Partner Anchor arc should be sequenced concurrently or just before to amplify Y1 inbound.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
