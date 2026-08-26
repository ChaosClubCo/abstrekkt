import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Microscope } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'METHODOLOGY',
    subtitle: 'The canon read. The research niche selected. Methodology design that meets independent-practitioner bar.',
    months: [
      {
        n: 1,
        title: 'The canon — read the field, not the headlines',
        why: 'AI safety and eval is a small field with a deep canon and a much louder periphery of takes. The work that earns standing reads the canon directly — Anthropic safety papers, OpenAI red-team reports, Apollo Research, METR, Redwood, AISI publications, academic AI safety work. M1 is the deliberate reading month that gives you the vocabulary, the open questions, and the methodological standards the community actually operates by.',
        weeks: [
          'Foundational reading set — Anthropic\'s Constitutional AI and Responsible Scaling Policy papers, OpenAI\'s GPT-4 system card and red-team report, Apollo Research deception evaluations, METR autonomy evaluations, Redwood Research alignment papers, AISI\'s pre-deployment evaluation methodology. Read the actual papers, take structured notes, build vocabulary.',
          'The methodology canon — the specific papers that defined how AI safety eval is done well. "Sleeper Agents," "Discovering Language Model Behaviors with Model-Written Evaluations," recent red-teaming papers from the major labs. The methodological standards are what differentiate rigorous from journalistic work in this field.',
          'The active research landscape — what are Anthropic Alignment, OpenAI Superalignment (and successor teams), DeepMind Safety, Apollo Research, METR, MIRI, BlueDot, AISI currently working on? Active research areas are documented in public papers, conference talks, and AI Safety Camp / MATS / SERI MATS outputs. Map the landscape.',
          'The open questions — by end of M1, you can name 8-12 specific open research questions in the field with one-sentence summaries of what is known and what is contested. Without this map, M2 niche selection is guessing. The map is the prerequisite for everything else.',
        ],
        gate: 'A documented reading log covering 25-40 primary sources. A written landscape map of active research areas and the labs/teams working on each. A list of 8-12 specific open research questions with current state summarized. The canon is now in your head, not on your reading list.',
      },
      {
        n: 2,
        title: 'Niche selection — which specific subproblem',
        why: 'Eval & safety is too broad to specialize in as a whole. M2 picks the specific subproblem that becomes the focus for the year — red-teaming a specific model family, evaluating a specific capability, methodology research on a specific eval design problem, alignment research on a specific phenomenon. The narrower the niche, the more credible the depth.',
        weeks: [
          'Niche candidates — from the M1 open questions map, list 5-8 candidate niches. For each: what is the current state, what would your unique contribution be, what is the audience for the work (which labs, which conferences, which communities), and what does a 12-month research output look like.',
          'Niche feasibility audit — for each candidate, what infrastructure access is required (frontier model API access at sufficient scale, compute, specific datasets)? Independent practitioners face material access constraints. The niche must be feasible without lab-internal access.',
          'Niche differentiation — what does an independent practitioner bring that lab researchers do not? Often: outside perspective, willingness to publish findings labs would not, focus on practical deployment failure modes vs theoretical alignment problems. The differentiation is the angle.',
          'Niche decision — pick one. Document the choice with: the specific research question, the target audience, the expected output format (paper, lengthy blog post, code repository with reproducible methodology), and the success criteria for M11. The decision is binding for the year.',
        ],
        gate: 'Documented research niche with specific question, target audience, expected output, and M11 success criteria. Feasibility audit confirms infrastructure access is realistic for an independent practitioner. The niche is narrow enough to defend but broad enough to produce 12 months of work.',
      },
      {
        n: 3,
        title: 'Methodology design — the higher bar',
        why: 'M3 is where the arc differentiates from amateur red-teaming and online "I jailbroke X" posts. The methodology is what makes independent research credible. Reproducibility, pre-registration of hypotheses, clear specification of model versions and inference settings, statistical analysis where applicable, conservative claim language. The bar is higher than what most online safety content meets.',
        weeks: [
          'Methodology standards survey — for your chosen niche, what methodology standards do the leading published works use? Pre-registration patterns, sample sizes, model version specifications, statistical analysis approaches, threat modeling for adversarial setups. Document the standards.',
          'Your methodology design — for your specific research question, write the methodology section as if for publication. Hypothesis, predictions, experimental design, what counts as evidence for vs against, statistical analysis plan, limitations. The document is 1,500-3,000 words.',
          'External review — submit the methodology to 2-3 reviewers (peer researchers, members of the AI safety community, an academic contact if available). The review is to catch methodology weaknesses before running the studies, not after. The pre-study review is what independent researchers usually skip and labs do as standard practice.',
          'Methodology iteration — incorporate review feedback. Some reviewers will suggest changes that materially affect the study design; accept those. The methodology is final by end of M3 and becomes the binding plan for M4-M6 studies.',
        ],
        gate: 'A documented methodology that meets the standards of leading published works in the niche. External review completed with feedback incorporated. The methodology is ready to execute, not still being designed during the studies.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'STUDIES',
    subtitle: 'Three studies executed end-to-end. Findings documented at publishable rigor. Adversarial campaign run.',
    months: [
      {
        n: 4,
        title: 'Study 1 — small scope, full methodology',
        why: 'Study 1 is the methodology test. Small enough in scope to complete in one month, comprehensive enough to exercise every step of the M3 methodology. The point is not the finding — the point is proving the methodology works end-to-end before scaling to harder studies. Most independent research fails by starting too ambitious.',
        weeks: [
          'Study 1 setup — pre-register hypotheses (publicly if comfortable, in a private document otherwise), specify model versions and inference settings, prepare datasets or prompt sets, configure logging infrastructure. The setup is unglamorous and is where most studies fail.',
          'Study 1 execution — run the experiments. Document everything. Log every prompt, every response, every parameter. The logging cost feels excessive until you need to reproduce something three months later, at which point it is the difference between credible and dismissible.',
          'Study 1 analysis — apply the M3 statistical or qualitative analysis plan. Do not deviate from the pre-registered plan; if the data suggests a different analysis would be more interesting, that is a finding for a future study, not a justification for shifting this one. The discipline is in the constraint.',
          'Study 1 write-up — draft the findings document at publication quality. Methods, results, limitations, implications. The document is 2,500-5,000 words. It will be revised through Q3, but the first draft exists by end of M4.',
        ],
        gate: 'Study 1 executed end-to-end with documented methodology, results, and limitations. First draft of findings document complete. The methodology has been tested in practice; weaknesses identified for studies 2 and 3.',
      },
      {
        n: 5,
        title: 'Study 2 — building methodology repertoire',
        why: 'Study 2 is the variation test. Same niche, different angle or different model family. The point is to develop methodology repertoire — your eval and red-team toolkit becomes broader, not just deeper. The cross-study patterns are what published work eventually highlights.',
        weeks: [
          'Study 2 design — either a different angle on the same research question (multiple methodologies converging on one finding) or the same methodology applied to a different model family (testing generalization). Pre-register again. The pre-registration discipline is now habit.',
          'Study 2 execution — run the experiments. By this point the operational patterns from Study 1 are muscle memory. Pace is faster but quality should not drop. If quality drops, the pace is wrong, not the standard.',
          'Study 2 analysis — apply analysis plan. Compare findings to Study 1 where applicable. Cross-study patterns are noted but not over-claimed; two studies is not a meta-analysis.',
          'Study 2 write-up — first draft of findings document. By end of M5, two studies exist as draft documents. The cross-study comparison sketches the structure of the M7 publication.',
        ],
        gate: 'Study 2 executed end-to-end. Two studies now exist with documented methodology, results, and limitations. Cross-study comparison sketched. The body of work is now plural, not singular.',
      },
      {
        n: 6,
        title: 'Study 3 — adversarial campaign',
        why: 'M6 is the adversarial study — a structured red-team or jailbreak campaign that is more ambitious than Study 1 or 2. The campaign tests whether the methodology holds up under harder conditions and produces findings substantial enough to be the centerpiece of M7 publication.',
        weeks: [
          'Campaign design — a structured adversarial test of a specific capability or safety property. Scope is larger than Study 1 or 2 (multiple prompt families, multiple model variants if available, multiple jailbreak vectors). The campaign is documented with the same methodology rigor as the smaller studies.',
          'Campaign execution — runs over 2-3 weeks. Document every successful and unsuccessful attempt. The unsuccessful attempts matter — they bound the claims. Most red-team writeups omit the failures, which is why most are dismissible.',
          'Campaign analysis — what is the finding? What patterns emerged? What are the limitations? Be conservative — independent researchers without institutional backing get scrutinized more, not less. The conservatism is the credibility.',
          'Q2 capstone synthesis — three studies now exist as drafts. Sketch the M7 publication structure: which findings are most novel, which methodology insights are most transferable, which limitations require explicit acknowledgment. The Q2 close is the publication blueprint.',
        ],
        gate: 'Adversarial campaign executed with documented successes and failures. Three studies now exist in draft form. M7 publication structure sketched with novel findings, transferable methodology insights, and acknowledged limitations identified.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'PUBLICATION',
    subtitle: 'Two publications drafted, reviewed, submitted to venues. Revisions completed. First publications live.',
    months: [
      {
        n: 7,
        title: 'Primary publication drafted to submission quality',
        why: 'M7 turns three studies into one cohesive publication — either a paper for a workshop venue, a substantial post for the AI Alignment Forum or LessWrong, or a structured guide on a research-adjacent platform. The publication is the credentialing event for independent research. M7 is where the writing quality has to match the methodology quality.',
        weeks: [
          'Publication venue decision — academic workshop (NeurIPS SafeAI, ICML AI Safety, conference-adjacent), AI Alignment Forum / LessWrong (community-vetted, no formal peer review but high signal), Apollo / METR / AISI-adjacent venues (community blogs that produce inbound from labs), or own platform (kylerosebrook.com, with strong distribution plan). Pick based on niche audience.',
          'Primary publication draft — abstract, introduction, related work, methodology, results across three studies, discussion, limitations, conclusion. The structure follows academic conventions even for non-academic venues; the discipline produces credible work. Word target depends on venue (3,000-8,000 typical).',
          'Polish pass 1 — voice, structure, clarity. Read aloud. Most research writing is over-jargoned; aim for clear prose that a thoughtful non-specialist could follow with effort. The clarity is itself a methodology signal.',
          'Submission to external reviewers — 2-4 reviewers from the M3 review pool plus new contacts. Substantive review before venue submission. Plan 2-3 weeks for review responses. Reviewers may identify methodology weaknesses that require returning to M4-M6 data; budget for that possibility.',
        ],
        gate: 'Primary publication drafted to submission quality. External review pass complete with documented feedback. Venue selected and submission requirements understood. The publication is ready for the M8 submission round.',
      },
      {
        n: 8,
        title: 'Submission, revision, and second publication started',
        why: 'M8 is the submission and revision month. Primary publication goes to its venue. Reviewer feedback arrives; revisions are made. In parallel, the second publication starts drafting — derivative work from the three studies or methodology-focused work that complements the primary publication.',
        weeks: [
          'Primary publication submitted to chosen venue. Submission process varies — academic venues have formal portals, community venues require posting in specific formats. Follow the venue conventions exactly; departures from convention are read as carelessness.',
          'Reviewer feedback handling — most submissions receive substantive feedback. Treat it seriously even when it feels wrong. The reviewer who points out a methodology weakness is helping the work, not attacking it. Revise with intellectual humility, not defensiveness.',
          'Second publication started — methodology paper or shorter community post. Builds from the primary publication. The second publication is faster to draft because the methodology work is done; it is repackaging and extending.',
          'Q3 mid-point assessment — by end of M8, primary publication is in revision or has been accepted/rejected. Second publication is in draft. The publication pipeline is now real, not aspirational.',
        ],
        gate: 'Primary publication submitted with reviewer feedback being addressed. Second publication drafted to first-pass quality. The publication pipeline is operating with multiple artifacts in flight simultaneously.',
      },
      {
        n: 9,
        title: 'First publications live — the credential moment',
        why: 'M9 is the publication moment. The primary publication goes live — either accepted at the chosen venue or published on the chosen community platform. The second publication follows shortly after. Independent research credibility shifts from "I am doing research" to "I have published research" — a meaningful threshold.',
        weeks: [
          'Primary publication goes live — venue publication, community post live, or own platform with launch distribution. The launch is structured: announcement on relevant community channels (AI Alignment Forum, relevant Slack/Discord communities, Twitter/X if you maintain that surface, LinkedIn niche post).',
          'Community engagement — respond to comments, questions, critiques in the days after publication. Most research posts die without engagement; the ones where the author engages substantively produce ongoing conversations. The post-publication engagement is part of the work.',
          'Second publication launch — usually 1-2 weeks after the primary. Cross-references the primary. The pattern of "this practitioner publishes credible research, multiple pieces" becomes visible.',
          'Q3 close metrics — readership, citations or references in community discussion, direct outreach from labs or research-adjacent organizations. The metrics are honest signals of whether the work is landing in the community or sitting unread.',
        ],
        gate: 'Primary publication live with documented engagement metrics. Second publication live with cross-reference structure. Direct outreach from at least 2-3 research-adjacent contacts received. The publication credential is now real.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'COMMUNITY',
    subtitle: 'Community standing built. Speaking, podcasts, expert roundtables. Y2 research agenda framed.',
    months: [
      {
        n: 10,
        title: 'Community engagement — talks, podcasts, expert venues',
        why: 'M10 turns the publications into community standing. The publications are the credential; the active engagement is what compounds the credential into recognition. Speaking, podcasts, expert roundtables, peer-review participation. Most independent researchers publish and disappear; the ones who become known engage continuously.',
        weeks: [
          'Speaking circuit pursuit — submit to relevant venues (NeurIPS SafeAI workshop, ICML AI Safety workshop, BlueDot AI safety community events, AI Alignment Forum LessWrong meetups, MATS or SERI MATS-adjacent gatherings). Submission is the work; selection is the outcome.',
          'Podcast pursuit — AI safety podcasts (80,000 Hours, Future of Life Institute, Cognitive Revolution, individual researcher podcasts). Reach out with specific pitches tied to your publications. Most pitches do not land; the ones that do produce ongoing visibility.',
          'Expert roundtables and community participation — join AI safety community discussions, contribute to AI Alignment Forum comment threads on relevant papers, review papers in your niche when invited. The participation is unglamorous but accumulates standing.',
          'Mid-quarter assessment — by mid-M10, what speaking, podcast, and community engagement has materialized? If little, M11 doubles down on community participation; if substantial, M11 builds on it.',
        ],
        gate: 'At least 2 speaking submissions made (selection pending or accepted), at least 3 podcast pitches made, active participation in AI safety community discussions documented. Community standing is now actively building.',
      },
      {
        n: 11,
        title: 'Third publication or expanded methodology framework',
        why: 'M11 ships either a third publication (extending the research arc) or a methodology framework document that synthesizes Q1-Q3 work into a reusable artifact. The framework version is often higher leverage — other researchers reference methodology frameworks years after the originating studies are forgotten.',
        weeks: [
          'Framework or third-publication decision — based on which has higher leverage given Q4 community engagement. If the speaking circuit and podcasts are surfacing specific methodology gaps in the community, the framework is the higher leverage move.',
          'Drafting — synthesis of Q1-Q3 work. Methodology decisions justified, results referenced, transferable insights extracted. The framework is 5,000-12,000 words plus reproducible code repository if applicable. The substantial nature is part of the credential.',
          'Review and polish — external review by the same reviewer pool plus new contacts gained from M9-M10 community engagement. The review pool is itself a credential signal; the reviewers who agree to read your work are validating the quality.',
          'Publication and distribution — same launch motion as M9 but scaled by the community standing now in place. The framework should produce inbound from labs, research organizations, and academic contacts.',
        ],
        gate: 'Third publication or methodology framework published with external review documented. Distribution leveraging the M10 community standing. The body of work is now four pieces deep: three studies plus one synthesis artifact.',
      },
      {
        n: 12,
        title: 'Y2 research agenda and strategic decision',
        why: 'M12 closes the year with the strategic question: is this a Y2 sustained research practice (eventually leading to formal research roles at labs, academic positions, or independent research funding), an ongoing side practice alongside consulting work, or a one-year specialization that has now been demonstrated and can be deprioritized? The Y1 reception shapes the answer.',
        weeks: [
          'Y1 reception analysis — citations, references, direct outreach quality, speaking and podcast outcomes, community standing assessment. The data is honest. Independent research with low reception is a signal to either deepen further or pivot — staying at the same level for Y2 produces diminishing returns.',
          'Three Y2 scenarios — Deepen (Y2 fully committed to research, possibly toward formal research role applications, lab grants, or alignment research fellowships) — Sustain (research as ongoing side practice alongside consulting/Intinc work, 1-2 publications per year) — Pivot (research credential established, primary work returns to consulting/AIaaS with safety expertise as differentiator). Each scenario with specific tradeoffs.',
          'External strategic conversation — with someone in the AI safety community (a researcher contact, a BlueDot-adjacent advisor, an MATS-affiliated mentor). The Y2 decision deserves outside perspective from inside the community.',
          'Y2 decision committed. The decision shapes the Personal Brand arc Q4 work, the AIaaS service line positioning, and any potential career pivots toward research-adjacent roles. The decision is binding for Y2 with one explicit review point.',
        ],
        gate: 'Y1 reception data documented. Three Y2 scenarios written with tradeoffs. External strategic conversation completed. Y2 decision committed. Research credential integrated into broader portfolio (Brand, AIaaS, Partner Network surfaces).',
      },
    ],
  },
];

const STAGES = [
  { label: 'Dimension 1', name: 'Red-team',     sub: 'Adversarial campaigns · M6',    fill: 95  },
  { label: 'Dimension 2', name: 'Jailbreak',    sub: 'Capability bypasses · M5',      fill: 85  },
  { label: 'Dimension 3', name: 'Alignment',    sub: 'Behavioral evals · M4-M5',      fill: 80  },
  { label: 'Dimension 4', name: 'Methodology',  sub: 'Reproducible rigor · M3',       fill: 100 },
  { label: 'Dimension 5', name: 'Publication',  sub: '3 pieces shipped · M7-M11',     fill: 95  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #0c0618; --bg-2: #150a26; --fg: #ebe0f5; --fg-dim: #9382b0;
  --accent: #7c3aed; --accent-2: #a78bfa; --accent-dim: #5b21b6;
  --gate: #fef3c7; --muted: #251539; --card: #150a26; --border: #1f0f33; --border-bright: #2a154a;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(254,243,199,0.04), transparent 65%), var(--bg); padding: 48px 24px 96px; }
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
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(124,58,237,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(124,58,237,0.07), rgba(124,58,237,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.rigor-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(124,58,237,0.03); font-size: 12.5px; color: var(--fg); }
.rigor-note strong { color: var(--accent); }
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
.week.done { border-left-color: var(--accent); background: rgba(124,58,237,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(124,58,237,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(254,243,199,0.25); background: rgba(254,243,199,0.04); align-items: start; }
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
.claims code { color: var(--accent-2); background: rgba(124,58,237,0.1); padding: 1px 6px; font-size: 11px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function EvalSafetyExpertArc() {
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
              <p className="kicker"><Microscope size={12} /> Learning Ops // Specialization Lane</p>
              <h1 className="title-serif">The <em>Safety</em> Arc.</h1>
              <p className="title-sub">
                12 months. From AI eval practitioner to independent practitioner researcher in AI
                safety. The canon read in Q1. Three studies executed end-to-end in Q2. Two publications
                shipped to community venues in Q3. Community standing built in Q4. The path to
                being known in the small but increasingly consequential AI safety research community —
                Anthropic, OpenAI, Apollo, METR, AISI-adjacent. Distinct from the Series 2 Eval arc:
                that built eval practice; this builds research credibility.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Lane: <strong>A · Specialization · pick ONE</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>3 publications + community standing</strong></div>
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
              <h3>Tradeoff flag — independent research must clear a higher bar than lab research.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Without institutional backing, independent practitioner research gets scrutinized
                more aggressively. The methodology has to be more rigorous, the claims more
                conservative, the reproducibility more complete. Lab researchers can afford a
                wobbly methodology section because the institutional brand carries it; independent
                researchers cannot. The arc front-loads methodology (Q1) deliberately because the
                higher bar is non-negotiable and most independent research fails the bar.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Standing in a small but consequential community — AI safety research is increasingly central to AI policy, deployment decisions, and frontier model release timing. Standing here is durable</li>
                    <li>Optional pathways to research roles — lab safety teams (Anthropic, OpenAI, DeepMind), AI safety organizations (Apollo, METR, AISI, RAND, MIRI), or academic affiliations. The Y1 credentials open Y2+ doors that other Lane A specializations do not</li>
                    <li>Publications are durable — research papers and methodology frameworks get cited for years. The body of work compounds in a way that engagements do not</li>
                    <li>The work is independently meaningful — AI safety is consequential beyond personal career. Practitioners who care about AI going well find this arc rewarding in ways the business-focused arcs cannot match</li>
                    <li>Builds directly on Series 2 Eval arc, Series 1 Security arc — the existing eval and security depth feeds the research methodology immediately</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load (12-15 hrs/week) and substantial frontier-model API costs (<code>$200-1000/month</code> at scale for serious red-team or eval studies)</li>
                    <li>Low immediate revenue — independent research does not directly generate consulting revenue. Year 1 is investment in credential, not revenue. Y2+ revenue paths are research-adjacent (advisory, lab work, fellowships)</li>
                    <li>The other Lane A specializations are explicitly closed. Regulated AI Security and Enterprise Architect become Y2+ options only</li>
                    <li>Community standing is unforgiving — sloppy methodology or over-claimed findings damage credibility durably. The discipline of conservative claim language is constant</li>
                  </ul>
                </div>
              </div>
              <div className="rigor-note">
                <strong>The rigor rule that determines whether this specialization produces standing:</strong>{' '}
                every claim is made conservatively. Every limitation is acknowledged explicitly.
                Every model version, every inference setting, every dataset is specified. Reproducibility
                is treated as a hard constraint, not a polish item. The discipline that produces
                this rigor is the same discipline that lab researchers operate under — but the
                independent researcher gets less benefit of the doubt, so the bar is higher.
                Practitioners who do not internalize this produce work that gets quietly dismissed;
                practitioners who do produce work that gets cited.
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
                          <div className="gate-label">Research gate · M{m.n}</div>
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
              <li><strong style={{ color: 'var(--fg)' }}>HIGH load (12-15 hrs/week) with API costs.</strong> Frontier model API usage at scale for serious red-team or eval studies runs <code>$200-1000/month</code>. The load includes reading, methodology design, study execution, writing, and community engagement. Plan for substantial sustained commitment.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Low immediate revenue.</strong> Independent research does not generate consulting revenue directly. Y1 is investment in credential and community standing. Y2+ revenue paths are research-adjacent: advisory engagements with safety-conscious orgs, lab consulting work, alignment research fellowships (BlueDot, MATS, SERI MATS), or transition to formal research roles.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Series 1 Security arc and Series 2 Eval arc are prerequisites.</strong> The methodology rigor builds on existing eval and security depth. Without those arcs, M3 methodology design is shallow. If those arcs are incomplete, sequence them first or accept significantly steeper Q1 ramp.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The rigor bar is real and unforgiving.</strong> Independent researchers do not get benefit of the doubt. Sloppy methodology or over-claimed findings damage credibility durably and are remembered. The discipline of conservative claim language and explicit limitation acknowledgment is constant. Practitioners uncomfortable with this temperament should choose a different Lane A specialization.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The community is small, which cuts both ways.</strong> 200-500 practitioners deeply engaged in AI safety research globally. Standing is easier to build because everyone notices a credible new voice; standing is also easier to lose because everyone notices methodology failures. The intimacy is the asset and the risk.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Y2+ optionality is genuinely different from other Lane A arcs.</strong> Research credentials open formal lab research positions, fellowships, AI policy advisory work, and academic affiliations in ways that Regulated Security or Enterprise Architect credentials do not. If the Y1 reception is strong, Y2 may include a serious conversation about full transition to research-adjacent work.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
