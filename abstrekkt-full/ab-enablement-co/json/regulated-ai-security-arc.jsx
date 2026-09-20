import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, ShieldCheck } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FRAMEWORKS',
    subtitle: 'The four compliance frameworks mastered as language and as architectural constraint.',
    months: [
      {
        n: 1,
        title: 'HIPAA + HITECH for AI workloads',
        why: 'HIPAA is the most common regulatory framework for AI in healthcare, and the most misunderstood by AI practitioners. M1 builds genuine HIPAA fluency: what PHI is, what BAA agreements require, what the Security Rule says about technical safeguards, and how AI workloads (training data, inference logs, model outputs) intersect with the rule. Most AI practitioners can fake HIPAA in conversation; the specialist actually knows it.',
        weeks: [
          'HIPAA Privacy Rule and Security Rule fundamentals from primary source documents — HHS guidance, not blog posts. Privacy Rule defines what PHI is and how it can be used. Security Rule defines the technical, physical, and administrative safeguards. Read both. Take notes. The primary sources are dense but they are what compliance teams cite.',
          'Business Associate Agreements (BAA) for AI vendors — when a BAA is required, what it must contain, what happens when one is missing. Most AI tools (OpenAI, Anthropic via Bedrock, Claude through AWS) have specific HIPAA-eligible configurations. Learn which products under which conditions are HIPAA-eligible and which are not.',
          'AI-specific HIPAA considerations — training data PHI contamination, inference logs containing PHI, model outputs that might constitute PHI, the de-identification standard (Safe Harbor and Expert Determination). These are the questions that come up in actual healthcare AI deployments and that most practitioners cannot answer correctly.',
          'HIPAA breach scenarios — when does an AI deployment failure constitute a breach? The 500-individual threshold for HHS reporting, the state-level breach notification laws that often go further. Map specific AI failure modes (inference log leak, training data exposure, prompt injection extracting PHI) to specific breach reporting obligations.',
        ],
        gate: 'Verified HIPAA fluency — able to answer specific questions about PHI handling, BAA requirements, Security Rule technical safeguards, and AI-specific failure modes without reference to a blog post. The first compliance dialect is now in your fingers.',
      },
      {
        n: 2,
        title: 'FedRAMP + ATO for AI in federal contexts',
        why: 'FedRAMP is the federal cloud security framework, and AI in federal contexts is increasingly significant — DOD, civilian agencies, federal contractors. FedRAMP is more bureaucratic than HIPAA and rewards practitioners who can navigate the language. M2 builds the FedRAMP fluency that turns "we cannot work with you" responses into "we can work with you under these conditions" responses.',
        weeks: [
          'FedRAMP baseline (Low, Moderate, High) and the authorization process — how cloud services become FedRAMP-authorized, what the JAB and agency authorization paths look like, what an ATO (Authority to Operate) is. The vocabulary matters more than the depth at this stage.',
          'AI services in FedRAMP — Azure OpenAI Service in Government Cloud, AWS Bedrock with FedRAMP-eligible configurations, the specific authorization status of each major AI vendor in federal contexts. Most practitioners assume "the cloud is FedRAMP" without knowing which specific service in which specific region under which specific configuration.',
          'NIST AI Risk Management Framework (AI RMF) — the framework most federal AI deployments cite. The four functions (Govern, Map, Measure, Manage), what each requires, how it maps to actual technical implementation. Federal AI work increasingly references AI RMF; specialists know what each function entails.',
          'CMMC and AI in DoD contexts — for defense industrial base contractors using AI, the CMMC framework adds another layer. Understanding when CMMC applies, what level (1, 2, 3), and what AI deployment patterns satisfy each level is specialized knowledge that produces measurable engagement value.',
        ],
        gate: 'Verified FedRAMP and federal AI fluency — able to navigate authorization status of major AI services, cite NIST AI RMF functions accurately, and articulate CMMC implications for AI in DoD contexts. The federal compliance dialect is now operational.',
      },
      {
        n: 3,
        title: 'SOC 2 + ISO 27001 + GDPR-AI',
        why: 'M3 covers the broader compliance landscape — SOC 2 (the de facto enterprise audit standard), ISO 27001 (international), and GDPR\'s AI-specific implications. Most enterprise clients cite these even when they are not the primary regulatory framework. The specialist navigates all of them, not just the primary one.',
        weeks: [
          'SOC 2 Type I vs Type II audits, the five Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy), how AI workloads are typically scoped. SOC 2 is the audit most B2B AI vendors pursue first; understanding what auditors look for is specialized knowledge.',
          'ISO 27001 ISMS framework, ISO 27017 (cloud-specific), ISO 27018 (PII in cloud), and the new ISO/IEC 42001 (AI management systems, published 2023). ISO/IEC 42001 in particular is the first AI-specific international management system standard — early specialization here is rare and valuable.',
          'GDPR Article 22 (automated decision-making), the right to explanation, Data Protection Impact Assessments (DPIA) for AI systems, the EU AI Act intersection with GDPR. Most US-based AI practitioners avoid GDPR; the regulated-AI specialist embraces it because European and global clients require it.',
          'Cross-framework mapping — when a deployment must satisfy HIPAA + SOC 2 + GDPR simultaneously, where do the requirements align, where do they conflict, what controls satisfy multiple frameworks at once? The cross-framework expertise is what enterprise clients actually need; single-framework expertise is commoditized.',
        ],
        gate: 'Verified fluency across SOC 2, ISO 27001/27017/27018/42001, and GDPR-AI. Cross-framework mapping for at least one realistic deployment scenario documented. The four major compliance dialects are now operational, not theoretical.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'ARCHITECTURE',
    subtitle: 'AI architectures that satisfy each framework. Reference patterns built. Compliance posture documented.',
    months: [
      {
        n: 4,
        title: 'HIPAA-compliant AI architecture patterns',
        why: 'M1 built the HIPAA fluency. M4 builds the actual architectures — the specific deployment patterns that satisfy HIPAA Security Rule technical safeguards while delivering AI value. The architecture is the deliverable that turns compliance knowledge into engagement value. Without architectures, you can talk about HIPAA; with them, you can deliver under HIPAA.',
        weeks: [
          'HIPAA-compliant RAG architecture — Azure OpenAI in HIPAA-eligible configuration, AI Search with private endpoints and security trimming, audit logging through Purview or equivalent, BAA in place. The end-to-end pattern that satisfies the Security Rule for a HIPAA RAG deployment. Build it as a reference architecture diagram.',
          'PHI de-identification in AI pipelines — the technical patterns for Safe Harbor de-identification at ingestion, the Expert Determination pathway, the residual risk management. Most HIPAA AI deployments fail at de-identification; the architecture that handles it correctly is rare.',
          'Audit logging and access controls for HIPAA AI — every inference logged with user identity, every training data access logged, every model output logged. The audit infrastructure that a HIPAA breach investigation would require. Build the logging architecture explicitly.',
          'Incident response runbook for HIPAA AI failures — when inference logs leak, when training data is exposed, when prompt injection extracts PHI. The 60-day breach notification clock starts; the runbook tells the client what to do. The runbook is itself a deliverable.',
        ],
        gate: 'A documented HIPAA-compliant AI reference architecture (RAG end-to-end), a de-identification pipeline pattern, audit logging architecture, and incident response runbook. The HIPAA architecture is now a reusable engagement artifact.',
      },
      {
        n: 5,
        title: 'FedRAMP + federal AI architecture patterns',
        why: 'M5 builds the federal equivalent — AI architectures for FedRAMP-authorized environments. The constraints are different (Government Cloud regions, specific service authorizations, additional logging requirements), and the architecture patterns that work in commercial cloud often do not translate directly.',
        weeks: [
          'Azure Government Cloud AI architecture — Azure OpenAI Service in Gov Cloud, AI Search in Gov Cloud, networking patterns that satisfy FedRAMP Moderate or High. The architecture is similar to commercial but with specific service variants and additional control overlays.',
          'AWS GovCloud AI architecture — Bedrock availability in GovCloud, ITAR considerations, the differences from commercial AWS. For DoD contractors, GovCloud is often required; the architectural pattern that delivers AI value in GovCloud is specialized knowledge.',
          'NIST AI RMF as architectural framework — the four functions (Govern, Map, Measure, Manage) translated into specific architectural and operational requirements. Most federal AI engagements require an AI RMF artifact; learning to produce one is specialist territory.',
          'Continuous monitoring and POAM management — FedRAMP requires continuous monitoring and Plan of Action & Milestones (POAM) management. For AI workloads, the monitoring includes model drift detection, training data integrity, inference quality drift. The continuous monitoring architecture is the long-tail FedRAMP requirement.',
        ],
        gate: 'A documented FedRAMP-compliant AI reference architecture (Azure Gov Cloud or AWS GovCloud), NIST AI RMF artifact template, and continuous monitoring architecture for federal AI workloads. The federal architecture is now a reusable engagement artifact.',
      },
      {
        n: 6,
        title: 'Financial services and ISO/IEC 42001 architecture patterns',
        why: 'M6 builds the architectures for the remaining major regulated industries — financial services (FFIEC, OCC, FINRA guidance for AI) and the emerging ISO/IEC 42001 AI management system pattern. Financial services AI is a meaningful market with specific regulatory expectations; ISO/IEC 42001 is the new international standard that enterprise clients will increasingly require.',
        weeks: [
          'FFIEC and bank regulatory AI guidance — OCC Bulletin 2021-7 (model risk management), the FFIEC Authentication guidance and AI, the SR 11-7 model risk framework. Financial services AI must satisfy these even though they are guidance, not regulation in the same sense as HIPAA. Architecture patterns that document model risk explicitly are specialist territory.',
          'AI architecture for financial services — model risk management overlay (independent validation, performance monitoring, challenger models), fair lending considerations, the explainability requirements that regulators increasingly expect. The architecture incorporates the model risk management discipline that bank examiners look for.',
          'ISO/IEC 42001 AI Management System architecture — the published standard\'s requirements for AI governance, AI policy, AI risk management, AI impact assessment. The architecture that implements ISO/IEC 42001 is rare because the standard is new (2023). Early specialists here have a window to establish positioning.',
          'Cross-framework architecture summary — at end of Q2, produce a single reference document that maps the four frameworks against the architectural patterns. The document becomes a Q3 marketing artifact and the foundation for the M11 published guide. The Q2 capstone is this synthesis.',
        ],
        gate: 'Documented architectures for financial services AI (model risk management overlay) and ISO/IEC 42001 AI management system. Cross-framework architecture summary produced. Four reference architectures now exist as reusable engagement artifacts.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'ENGAGEMENT',
    subtitle: 'First regulated-industry engagement (audit, advisory, or implementation). External reviewer validation. Pipeline.',
    months: [
      {
        n: 7,
        title: 'First regulated-industry engagement secured',
        why: 'M7 is where the specialization produces revenue. The first regulated-industry engagement comes from positioning, network, or Partner Network referral — and the engagement validates that the M1-M6 work translates into market demand. Most specialization arcs fail here, by either not pursuing the first engagement actively enough or by accepting non-regulated work and breaking the niche discipline.',
        weeks: [
          'Engagement pipeline activation — outreach to specific regulated-industry contacts (healthcare CIOs/CISOs, financial services AI leads, federal contractors), Partner Network referral requests, Intinc internal opportunities. The pipeline is built deliberately, not waited for.',
          'Engagement format options — compliance-focused AI audit (1-2 weeks, $15-30K), advisory engagement (4-8 weeks, $30-80K), implementation engagement (8-16 weeks, $80-250K). The format depends on client need and your appetite. Document the three options as separate service line offerings.',
          'First engagement closed — proposal, contract, kickoff. The engagement is in scope of the regulated-AI niche. Document the close, the price, the format, and the specific compliance framework(s) in scope.',
          'Engagement execution begins — the engagement uses the M4-M6 architectures and frameworks. The execution itself produces real artifacts (audit report, advisory deliverable, or implementation) that become Q4 case study material.',
        ],
        gate: 'First regulated-industry engagement closed and kicked off. Service line offerings documented for the three engagement formats. Engagement execution in progress with reference architectures applied.',
      },
      {
        n: 8,
        title: 'External reviewer validation — the credential that compliance teams trust',
        why: 'M8 is the credibility-validation month. Regulated-industry buyers do not trust self-claimed expertise; they trust credentialed expertise. M8 secures an external validation — an industry certification, a published framework, a recognized credential, or a documented review by a known compliance authority — that turns "I know HIPAA" into "I am credentialed in HIPAA AI."',
        weeks: [
          'Credential option assessment — HCISPP for healthcare information security, CCSP for cloud security, CIPP for privacy, ISACA AI security credentials. Each has different time investment and recognition. Pick one based on which most directly serves the niche choice.',
          'Credential pursuit — exam prep or formal certification process. Some credentials require documented experience hours; document your existing Series 1-2 work as evidence. The credential is the multi-week commitment.',
          'Alternative validation — published framework or guide submitted to a respected venue (IAPP, HCISPP community, ISACA Journal, a HIMSS or FinTech Connect publication). The published artifact serves as credential-adjacent validation. Submit during this month.',
          'External review by compliance authority — a compliance officer, a HIPAA Security Officer, or a federal cybersecurity contact reviews your reference architectures and provides documented feedback. The review is itself credential-adjacent — "reviewed by X authority" carries weight.',
        ],
        gate: 'Active credential pursuit (exam scheduled or in process) OR published framework submission OR documented external review by a recognized compliance authority. The expertise is now validated by something other than self-claim.',
      },
      {
        n: 9,
        title: 'Pipeline expansion and second engagement',
        why: 'M9 is where one engagement becomes a practice. The first engagement winding down produces a case study candidate; the M7 pipeline work and the M8 credential together produce the second engagement. Two regulated-industry engagements in one year is the volume that signals "this is what they do" rather than "they did one of these."',
        weeks: [
          'First engagement wrap-up — final deliverables, client signoff, payment collection, retrospective notes for the case study. The engagement closes cleanly and produces an explicit client testimonial or case study permission.',
          'Pipeline review — what conversations are in flight from M7 outreach and M8 credential surface area? Rate likelihood, identify next action for each. The pipeline shapes the M10-M11 work.',
          'Second engagement closed — same niche, possibly different framework focus or different engagement format. Close, contract, kickoff. The second close is the signal that the first was not luck.',
          'Continued pipeline development — even with one engagement winding down and another beginning, the pipeline work continues. Q4 close-month engagement requires Q3 pipeline work.',
        ],
        gate: 'First engagement closed with client testimonial or case study permission. Second regulated-industry engagement closed and kicked off. Pipeline maintained for Q4 close possibilities. Two engagements is now the floor, not the ceiling.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'POSITIONING',
    subtitle: 'Three case studies published. Specialization visible in market. Y2 strategic decision on depth or breadth.',
    months: [
      {
        n: 10,
        title: 'Case studies published — three regulated-industry artifacts in market',
        why: 'M10 is the case study production month. Three case studies from Q3 engagements (sanitized to client comfort) are published with the compliance framework specifics highlighted. The case studies turn the specialization from claim to evidence — the most durable Partner Network and direct-pipeline asset.',
        weeks: [
          'First case study published — from the first engagement, with client permission. Specific to the framework (HIPAA, FedRAMP, financial services, or ISO/IEC 42001), specific to the architecture pattern used, specific about the results delivered. The framework specificity is what differentiates this case study from generic AI consulting case studies.',
          'Second case study published — from the second engagement or from anonymized Q1-Q2 internal work. Cross-references the first case study; the pattern of regulated-industry expertise becomes visible across multiple artifacts.',
          'Third case study published — either from a third engagement or from a synthesized cross-engagement learning piece. By M10 close, three published artifacts demonstrate regulated-AI specialization.',
          'Distribution — case studies cross-posted in IAPP, HIMSS, HCISPP community, FedRAMP-adjacent newsletters, ISACA Journal. The distribution venues are niche-specific and produce higher inbound quality than generic LinkedIn posts.',
        ],
        gate: 'Three regulated-industry case studies published with specific compliance framework and architecture content. Distributed across niche-specific venues. The specialization is now backed by three pieces of public evidence.',
      },
      {
        n: 11,
        title: 'Published framework or guide — the credential-adjacent asset',
        why: 'M11 publishes the comprehensive framework or guide that the M1-M10 work has produced — "Practitioner\'s Guide to HIPAA-Compliant AI Architecture" or "FedRAMP for AI Workloads" or a cross-framework synthesis. The published guide is the highest-leverage asset for inbound; it produces conversations for years after publication.',
        weeks: [
          'Guide scope decision — single framework deep (one compliance framework, comprehensive treatment) vs cross-framework practical (the four frameworks, how to navigate clients that span multiple). The depth choice depends on the M11 cumulative engagement profile.',
          'Guide drafting — synthesis of M1-M10 work. The cross-framework architecture summary from M6, the case study patterns from M10, the credentialed perspective from M8. 8,000-15,000 words plus reference architectures. The guide is substantial.',
          'Polish and review — external review by the M8 compliance authority contact, by a peer practitioner, by a sample target reader. The review catches positioning issues, technical errors, and gaps. Implement feedback before publication.',
          'Publication — on kylerosebrook.com (or FlashFusion site), with PDF download, with submission to relevant industry publications. The guide is positioned as a definitive practitioner reference. The aspiration is for the guide to be cited and referenced by other practitioners for 2-3 years after publication.',
        ],
        gate: 'A published comprehensive guide or framework on regulated-AI architecture. Externally reviewed, professionally produced, distributed to niche venues. The specialist asset that produces inbound for years.',
      },
      {
        n: 12,
        title: 'Y2 strategic decision and portfolio integration',
        why: 'M12 closes the year with the strategic decision — deepen the same specialization in Y2 (one framework taken even deeper), broaden into adjacent frameworks (the cross-framework specialist), or move toward a different specialization. The Y1 data shapes the choice; the choice shapes Y2 and beyond.',
        weeks: [
          'Y1 aggregate analysis — total engagements, total revenue, source breakdown (Partner / referral / direct / Intinc internal), specialization depth assessment honest. The data shapes the Y2 decision.',
          'Three Y2 scenarios written: Deepen (same niche, fewer larger engagements, premium positioning) — Broaden (cross-framework specialist for enterprise clients spanning multiple regulatory contexts) — Pivot (move toward different specialization based on Y1 signal). Each with specific tradeoffs.',
          'Strategic conversation with Daniel, Anthropic Partner team, and external compliance authority. Three perspectives on the data and the choice.',
          'Y2 decision documented and committed. The decision shapes M12 close work, the Personal Brand arc Q4 work, and the AIaaS arc strategic positioning. The decision is binding with one review point in Y2 Q2.',
        ],
        gate: 'Y1 aggregate analysis documented. Three Y2 scenarios written with tradeoffs. Strategic conversations completed. Y2 decision committed. Portfolio integration complete across Brand, AIaaS, Partner Network surfaces.',
      },
    ],
  },
];

const STAGES = [
  { label: 'Framework 1', name: 'HIPAA',     sub: 'Healthcare · M1',          fill: 100 },
  { label: 'Framework 2', name: 'FedRAMP',   sub: 'Federal + NIST AI RMF · M2', fill: 90 },
  { label: 'Framework 3', name: 'SOC 2',     sub: 'Enterprise audit · M3',    fill: 75 },
  { label: 'Framework 4', name: 'GDPR-AI',   sub: 'EU + ISO 42001 · M3',      fill: 80 },
  { label: 'Track 5',     name: 'Industry',  sub: 'FinServ + DoD · M6',       fill: 85 },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #170608; --bg-2: #22090c; --fg: #f5dadc; --fg-dim: #a8767a;
  --accent: #dc2626; --accent-2: #f87171; --accent-dim: #991b1b;
  --gate: #d4a843; --muted: #3a1316; --card: #22090c; --border: #2d0f12; --border-bright: #421518;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220,38,38,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(212,168,67,0.05), transparent 65%), var(--bg); padding: 48px 24px 96px; }
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
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(220,38,38,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(220,38,38,0.07), rgba(220,38,38,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.dialect-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(220,38,38,0.03); font-size: 12.5px; color: var(--fg); }
.dialect-note strong { color: var(--accent); }
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
.week.done { border-left-color: var(--accent); background: rgba(220,38,38,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(220,38,38,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(212,168,67,0.3); background: rgba(212,168,67,0.04); align-items: start; }
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
.claims code { color: var(--accent-2); background: rgba(220,38,38,0.1); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function RegulatedAiSecurityArc() {
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
              <p className="kicker"><ShieldCheck size={12} /> Learning Ops // Specialization Lane</p>
              <h1 className="title-serif">The <em>Regulated</em> Arc.</h1>
              <p className="title-sub">
                12 months. From SecAI+/CAISP-credentialed AI security practitioner to the person
                healthcare CIOs, federal contractors, and financial services compliance teams call
                when they need AI deployed under genuine regulatory constraint. HIPAA, FedRAMP,
                SOC 2, GDPR-AI, ISO/IEC 42001 as fluent dialects. Reference architectures, three
                case studies, a published practitioner\'s guide.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Lane: <strong>A · Specialization · pick ONE</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Guide + credentialed niche</strong></div>
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
              <h3>Tradeoff flag — compliance language is the gate, not the architecture.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Practitioners with strong AI architecture lose regulated-industry engagements to
                practitioners who can speak the compliance dialect. The compliance team in the room
                is not evaluating your technical depth — they are evaluating whether you understand
                their world. The architecture is the deliverable; the compliance language is the
                gate that gets you to the deliverable. The arc front-loads compliance fluency (Q1)
                before architecture (Q2) deliberately, because most practitioners do it the other
                way around and never clear the gate.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Unique market positioning — regulated-AI is materially underserved by practitioners who can speak both compliance and AI fluently. The market for compliant AI deployment is significant and growing</li>
                    <li>Higher engagement values — regulated-industry engagements bill at <code>$200-400/hr</code> vs <code>$150-250/hr</code> for unregulated work because the risk and complexity justify the premium</li>
                    <li>Durable specialization — compliance frameworks change slowly. Investment in HIPAA expertise compounds for 5-10 years. The depth is not commoditized by the next model release</li>
                    <li>The published guide (M11) is a long-tail asset — regulated-industry practitioners cite reference guides for years. Becomes one of the most durable brand artifacts possible</li>
                    <li>Compounds with Security arc (Series 1), Eval arc (Series 2), and AIaaS arc directly — the credentials and engagements build cumulative depth that the broader portfolio amplifies</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load (10-15 hrs/week) — Q1 compliance fluency requires reading dense primary sources, not just blog summaries. The work is unglamorous but cumulative</li>
                    <li>The other two Lane A specializations are explicitly closed — Eval & Safety and Enterprise Architect become Y2+ options only. Lane A is genuinely "pick one"</li>
                    <li>Regulated-industry sales cycles are 3-6 months minimum — Q1-Q2 produce minimal revenue, with all revenue compounding into Q3-Q4 and Y2</li>
                    <li>Engagement risk profile is higher — regulated-industry mistakes have legal and financial consequences. The work is consequential in a way that unregulated AI consulting is not</li>
                  </ul>
                </div>
              </div>
              <div className="dialect-note">
                <strong>The compliance-dialect rule that determines whether this specialization closes engagements:</strong>{' '}
                in the discovery call with a regulated-industry buyer, the first 15 minutes are
                evaluating whether you understand their world. The compliance team is asking
                themselves "does this person understand HIPAA enough that I will not have to
                translate?" The dialect is in the specific terminology, the specific citations, the
                specific knowledge of which authorization status applies to which AI service in
                which configuration. Architecture depth without the dialect produces lost deals.
                Dialect fluency without architecture produces dishonest engagements. Both required.
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
                          <div className="gate-label">Compliance gate · M{m.n}</div>
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
              <li><strong style={{ color: 'var(--fg)' }}>HIGH load (10-15 hrs/week) with significant primary-source reading.</strong> Q1 compliance fluency requires reading HHS guidance, NIST publications, ISO standards directly — not blog summaries. The work is unglamorous but accumulates into actual fluency that lets you hold a compliance-team conversation without bluffing.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This is genuinely "pick one" — the other Lane A arcs are closed for Y1.</strong> Eval & Safety Expert and Enterprise Architect are deferred to Y2+ when this arc is chosen. The depth path defeats its own purpose if multiple specializations are pursued in parallel. The Y1 commitment is binding.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Sales cycles are 3-6 months — Q1-Q2 produce minimal revenue.</strong> Regulated-industry buyers move slowly. Compliance reviews extend sales cycles materially. Most arc revenue compounds into Q3-Q4 and substantially into Y2. The arc that quits at M6 because "the revenue is not there yet" misses the late-Y1 and Y2 compounding.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The Security arc (Series 1) is a hard prerequisite.</strong> SecAI+ and CAISP credentials from Series 1 are the foundation this arc builds on. Without them, the Q1 compliance fluency takes twice as long and the M8 credential validation has nothing to build on. If Series 1 Security arc is incomplete, sequence it first or accept the arc compresses badly.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Engagement values are higher than typical AI consulting.</strong> Regulated-industry engagements bill <code>$200-400/hr</code> with engagement values typically <code>$15-30K (audit)</code>, <code>$30-80K (advisory)</code>, or <code>$80-250K (implementation)</code>. The math justifies the load if even two engagements close in Y1.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The published guide (M11) is the highest-leverage long-tail asset in this arc.</strong> Regulated-industry practitioners cite reference guides for 2-5 years after publication. The guide produces inbound conversations long after the arc ends. Plan it as a durable artifact, not a moment-in-time blog post.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
