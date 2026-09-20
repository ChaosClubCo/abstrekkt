import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, ClipboardCheck } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Agentic Evaluation Arc
// Kyle-specific: makes eval a first-class discipline, not a byproduct.
// LangSmith or Braintrust mastered, golden dataset design as practice,
// LLM-as-judge calibration, CI/CD eval gates, multi-agent trace evaluation.
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATIONS',
    subtitle: 'Eval mental model, dataset design as the highest-leverage skill, metrics fundamentals.',
    months: [
      {
        n: 1,
        title: 'The discipline of evaluation — taxonomy and why',
        why: 'Your existing builds use eval implicitly: did the migration agent route this case correctly? Is the new prompt better? This arc makes eval a deliberate discipline. Most practitioners conflate "I tested it" with "I evaluated it." The difference is the methodology behind whether you can trust the answer when it changes.',
        weeks: [
          'Read the foundational material: Anthropic\'s evaluation cookbook, OpenAI\'s evals repo, the eval chapters of the major LLM textbooks. Take notes on the taxonomy: offline vs online, scalar vs preference, exact vs semantic, single-step vs trajectory. The vocabulary is the foundation for every later month.',
          'The eval categories mapped: offline (run-against-fixed-dataset), online (score-production-traffic), A/B (compare-two-systems-on-same-input), human (manual-review), model-graded (LLM-as-judge). For each, write down one example from your existing builds where it would have caught a real failure.',
          'Survey of tooling: LangSmith, Braintrust, Promptfoo, custom-built. For each, read the docs deeply enough to answer: what data model does it use? How does it integrate with your stack? What is the cost model? Don\'t pick yet — survey first.',
          'The first eval audit: pick one production agent you have shipped (Bitwarden migration, Drive automation, or a Customization Service workflow). Without writing code, list every silent regression that would currently slip past you. The list is the case for the rest of the arc.',
        ],
        gate: 'A written eval taxonomy mapped to your existing builds. A documented audit of one production agent showing at least 5 silent regression risks that current testing does not catch. The case for eval as a discipline written in your own words.',
      },
      {
        n: 2,
        title: 'Golden dataset design — the underrated highest-leverage skill',
        why: 'Most practitioners think "eval = pick LangSmith and run it." The actual value is in the dataset that captures the right edge cases. A great tool with a bad dataset measures nothing. A simple harness with a great dataset catches real regressions for years. M2 is where eval discipline either becomes serious or stays superficial.',
        weeks: [
          'Dataset sourcing: production logs (real distribution, real edge cases), synthetic generation (cheap volume, suspect realism), hand-curated (highest signal, lowest scale). Build one example dataset using all three sources for the same task. Compare what each catches and what each misses.',
          'Edge case taxonomy: for any LLM task, the failure modes cluster — input length extremes, ambiguous queries, adversarial prompts, format violations, language mixing, malformed structured output. Build a checklist for each task category. Use the checklist to find the cases your current dataset is missing.',
          'Dataset versioning: like code, with changelogs and reasoning. Every change to a golden dataset is a measurement system change. Build a v1 dataset for one task, then a v1.1 with three intentional additions. Document the reasoning for each addition. The versioning discipline matters as much as the dataset itself.',
          'Holdout discipline: dev set for iteration, holdout set for unbiased measurement, never test against the holdout during development. The cardinal eval sin is leaking the holdout into your dev loop. Build the workflow that makes the leak structurally hard.',
        ],
        gate: 'A versioned golden dataset for one production agent task with at least 50 cases including edge cases derived from real production logs. Dev/holdout split documented with the workflow that prevents leakage.',
      },
      {
        n: 3,
        title: 'Metrics fundamentals — what you measure, why, and the calibration problem',
        why: 'A metric is a measurement system. Bad metrics produce confident wrong answers — the worst possible outcome. This month you build the discipline of choosing the right metric for the task and validating that the metric correlates with what you actually care about.',
        weeks: [
          'Task-specific metrics survey: exact match, F1, BLEU, ROUGE, semantic similarity (embedding-based), structural validity (does the JSON parse?), executable correctness (does the code run?). For each, write down: when it works, when it fails, what kind of error it misses.',
          'Production metrics: latency (p50, p95, p99), cost per request, error rate, hallucination rate (specifically), user satisfaction proxies. The metrics that matter for production are different from the metrics that matter for development. Map both layers.',
          'The calibration problem: how do you know your metric is measuring the right thing? Build a small calibration study — for one task, score 30 examples with both your chosen metric and a human gold label. Compute the agreement. If it\'s below 70%, the metric is broken even if it produces clean numbers.',
          'Metric composition: most useful eval signals are composite — a weighted score across multiple individual metrics. Build one composite metric for one task with documented weights and the reasoning. Pressure-test it against examples where individual metrics would mislead.',
        ],
        gate: 'Metric specifications documented for one production agent task — task-specific, production, and composite. Calibration study run against human labels with documented agreement rates. The metric is defensible, not just plausible.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'TOOLING & FIRST SUITE',
    subtitle: 'Platform mastered. First real eval suite shipping against production agents. LLM-as-judge calibrated.',
    months: [
      {
        n: 4,
        title: 'Pick a platform — LangSmith vs Braintrust deep evaluation',
        why: 'After M1 surveying, M4 is the commit. LangSmith ties tightly into the LangChain ecosystem and prioritizes traces. Braintrust is more dataset-and-eval-first, framework-agnostic. Both are real tools. The pick matters less than the depth — most practitioners shop platforms forever and master none. This month you pick one and master it.',
        weeks: [
          'Decision framework: build a comparison matrix across the dimensions that matter for your work — tracing depth, dataset management, LLM-as-judge support, CI/CD integration, cost model, framework-agnostic vs LangChain-tied. Pick based on your stack, not on what other practitioners use.',
          'Tracing setup: every model call in one production agent flows into the chosen platform with proper metadata — input, output, latency, cost, parent-child relationships for multi-step calls. The trace is the foundation; if traces are missing, evals built on top are blind.',
          'Dataset creation in the platform: import the M2 golden dataset into LangSmith or Braintrust as a managed dataset. Connect to versioning. Run one experiment that produces scores. The first end-to-end run is the proof the platform setup is real.',
          'Power-user mode: SDK depth, programmatic dataset management, custom evaluators, the API patterns that go beyond the UI. The UI is for exploration; the SDK is for the production discipline. Spend a week using only the SDK.',
        ],
        gate: 'One platform chosen with a written decision rationale. Traces flowing from one production agent. Datasets managed in the platform. One experiment run end-to-end producing scores. The SDK in your fingers, not just the UI.',
      },
      {
        n: 5,
        title: 'First real eval suite — applied to one production agent',
        why: 'M1-M4 builds the foundation. M5 ships the first real eval suite. Pick one production agent — the Bitwarden migration agent, the Drive automation chain, or a Customization Service workflow — and build the eval harness that catches regressions on every change. This is the proof that the discipline works.',
        weeks: [
          'Define the eval contract for the chosen agent: what tasks does it perform, what should pass, what should fail, what edge cases are non-negotiable? Write the contract before writing the eval code. The contract is the spec.',
          'Build the test cases: at least 30 covering the happy path, edge cases, adversarial inputs, format violations, and known historical bugs. Each test case includes input, expected output (or expected behavior), the metric used to score, and the rationale for inclusion.',
          'Run baseline evals: score the current production agent against the suite. Document the baseline. The first baseline is the bar — every later change is measured against it.',
          'Make one intentional change to the agent and re-run the suite. Did scores go up? Down? On which cases? The first time you see a regression you wouldn\'t have caught otherwise is the moment eval discipline earns its weight.',
        ],
        gate: 'A complete eval suite for one production agent with 30+ cases, documented baseline scores, and one demonstrated regression catch. The discipline is proven on a real artifact, not a tutorial example.',
      },
      {
        n: 6,
        title: 'LLM-as-judge calibration — the hardest part of eval',
        why: 'For tasks without exact-match ground truth — open-ended generation, summarization, conversational quality — LLM-as-judge is often the only viable evaluator. It is also the easiest place to fool yourself. Bias, position effects, length preferences, and self-preference all corrupt the scores. This month you build a calibrated judge or you build evals that lie to you.',
        weeks: [
          'The judge taxonomy: pairwise (A vs B preference), scalar (1-10 score), rubric (structured criteria evaluation), reference-based (matches gold answer). For one task, build all four and run them on the same 30 examples. Compare the conclusions each draws — they often disagree, and the disagreement is the signal.',
          'Bias diagnosis: position bias (judge prefers first answer), length bias (judge prefers longer), self-preference (judge prefers outputs from its own model family), verbosity-equals-quality. Run controlled experiments to detect each bias in your chosen judge configuration.',
          'Calibration with human reference: hand-label 30 examples with the correct judgment, run the LLM judge on the same 30, compute agreement rate (Cohen\'s kappa or similar). If agreement is below 70%, the judge is unreliable. Iterate on the judge prompt until it climbs.',
          'Multi-judge ensembles and disagreement as signal: when single judges are unreliable, ensembles of differently-prompted judges produce more stable scores. The cases where judges disagree are the cases worth human review. Build the disagreement-flagging workflow.',
        ],
        gate: 'A calibrated LLM-as-judge configuration for one open-ended task with documented bias diagnosis and at least 70% agreement with human reference labels. A disagreement-flagging workflow that surfaces the cases needing human review.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'CI/CD & PRODUCTION',
    subtitle: 'Eval gates in CI/CD. Online eval and drift detection. Multi-agent trace evaluation.',
    months: [
      {
        n: 7,
        title: 'CI/CD integration — eval gates on every change',
        why: 'Eval that runs only when you remember to run it is theater. Eval that runs automatically on every change is discipline. This month integrates the M5 eval suite into CI/CD so every PR is scored, every regression is caught before merge, and the eval becomes infrastructure rather than ritual.',
        weeks: [
          'CI/CD pipeline design: which evals run on every PR (fast, cheap, high-signal), which run nightly (expensive, comprehensive), which run weekly (full suite with human review). The cost-vs-coverage tradeoff has to be explicit — running everything everywhere is unaffordable.',
          'GitHub Actions or Cloud Build integration: eval suite triggered by PR, results posted as a PR comment, threshold-based pass/fail. Build the workflow end-to-end. The first time a PR fails because of an eval regression is the cultural moment.',
          'Threshold strategy: hard gates (regression beyond threshold blocks merge) vs soft gates (regression flagged but mergeable with reviewer override). Start with soft, move to hard after the team trusts the system. Hard gates on a noisy eval suite kill the team\'s trust faster than no gates.',
          'Cost management: eval runs cost API spend. Track cost per PR, cost per merge, cost per month. The eval budget should be defensible — every dollar spent on eval is a dollar of debug time saved later, but the trade has to be visible.',
        ],
        gate: 'CI/CD pipeline running evals on every PR with documented threshold strategy. At least one PR has been blocked by an eval failure that the team agreed was correct. The cost per PR is tracked and within budget.',
      },
      {
        n: 8,
        title: 'Online eval — scoring production traffic in real time',
        why: 'Offline evals catch regressions before deploy. Online evals catch the gap between dev distribution and production reality. The data your dev set didn\'t represent — the queries you didn\'t anticipate — only shows up in production. This month adds the online eval layer that watches production directly.',
        weeks: [
          'Sampling strategy: random sample of production traffic (cheap, broad coverage), anomaly-triggered (expensive, high-signal), user-flagged (highest signal, lowest volume). Pick a strategy and configure it. The right sampling rate balances cost against latency-of-detection.',
          'Online judge configuration: the LLM-as-judge from M6 deployed against sampled production traffic. The traces flow into LangSmith or Braintrust with online scores attached. Set up the dashboards.',
          'Drift detection and alerting: when online eval scores trend down, what triggers? Statistical drift detection on the score distribution, alerting threshold, the on-call workflow when drift fires. The first drift alert that isn\'t a false positive is the moment online eval earns its weight.',
          'The drift runbook: alert fires → triage (is this real drift, or noise?) → root cause (model change, traffic shift, new data?) → decide (rollback, retrain, accept). Build the runbook before drift fires, not during.',
        ],
        gate: 'Online eval running against production traffic for at least one production agent. Drift detection configured with documented thresholds. A written runbook for "drift alert fired — what now." One drift event handled (real or simulated).',
      },
      {
        n: 9,
        title: 'Multi-agent and trace-level evaluation',
        why: 'Most production agents are multi-step: tool calls, retrieval, multi-turn conversations, planning. Single-step eval misses the failures that emerge from agent trajectories. This month builds the harness for evaluating multi-step agents — the eval discipline that almost no practitioner has yet.',
        weeks: [
          'The trajectory eval problem: when an agent takes 5 steps to answer a question, where do you score? Per-step (catches local errors) vs end-to-end (catches global drift) vs a mix. Most production systems need both. Build the harness for both layers on one multi-step agent.',
          'Per-step evaluation: tool call correctness, retrieval relevance, intermediate reasoning quality. Build evals for each component independently. The component evals catch class-of-failure early.',
          'Trajectory evaluation: full-conversation outcome scoring, planning quality, recovery from intermediate errors. The trajectory eval is the integration test — does the whole thing work, given the parts work?',
          'Agentic eval patterns: success rate at completing a goal, average steps to completion, error recovery rate, tool selection accuracy. The metrics that matter for agents are different from the metrics that matter for single-call models. Document the metrics for at least two agent types.',
        ],
        gate: 'A multi-agent eval harness covering per-step and trajectory-level evaluation on at least one production agent. Documented agent-specific metrics. The patterns are reusable for the next agent you eval, not just the first.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'PUBLISH & LEVERAGE',
    subtitle: 'The playbook drafted, public traces published, eval as an AIaaS service line, brand integration.',
    months: [
      {
        n: 10,
        title: 'Second eval suite + the playbook drafted',
        why: 'One eval suite is a project. Two is a discipline. This month applies M5–M9 to a second production agent — different domain, different failure modes — and writes the playbook that captures the cross-cutting lessons. The second suite proves the practice generalizes; the playbook proves you can teach it.',
        weeks: [
          'Pick the second agent — different domain from the M5 agent. If M5 was the Bitwarden migration agent, M10 is the Drive automation chain or a Customization Service workflow. The domain difference is the test of generalization.',
          'Apply the M2-M3 dataset and metric design to the new agent. Document what was reusable from M5 work and what was domain-specific. The reusability map is the heart of the playbook.',
          'Build the second eval suite end-to-end: dataset, metrics, judge, CI/CD integration, online eval, trace evaluation. Faster than M5 because the patterns are now in your fingers. Document the velocity delta — how much faster is the second suite than the first?',
          'Draft the playbook: the practitioner\'s guide to agentic evaluation. Sections for dataset design, metric selection, judge calibration, CI/CD integration, online eval, multi-agent eval. Specific examples from your two suites. Not academic — operational.',
        ],
        gate: 'A second eval suite shipping against a different production agent. A playbook draft of 5,000+ words covering dataset design, metrics, judges, CI/CD, online, and multi-agent eval. Velocity delta between suite 1 and suite 2 documented.',
      },
      {
        n: 11,
        title: 'Public traces and the playbook published',
        why: 'The eval discipline is invisible work. The playbook and public traces make it visible. This month publishes the playbook, shares public LangSmith or Braintrust traces (with sensitive data redacted) that demonstrate the methodology, and turns the discipline into a brand asset that recruiters, clients, and Anthropic Partner Network actually see.',
        weeks: [
          'Trace curation: from your two eval suites, select 5–10 traces that best demonstrate methodology — not the cleanest results, the most pedagogically useful ones. Redact sensitive data. Add narrative annotations explaining why each trace matters.',
          'Playbook polish: from M10 draft to publishable. Hire an editor or do three brutal self-edit passes. Add diagrams. Cut every section that summarizes content available elsewhere. What remains is the work nobody else has written.',
          'Publish: LinkedIn long-form article series (3 parts), Prompt edition with the executive summary, GitHub repo with the example code and trace links, Partner Network profile updated to feature "agentic evaluation" as a named service offering.',
          'Distribution: cross-post in relevant practitioner communities (LangChain, Braintrust user groups, ML Twitter/X if applicable), submit the playbook URL to relevant newsletters and aggregators, present the methodology at one external event (conference talk, meetup, podcast).',
        ],
        gate: 'A published agentic eval playbook of 5,000+ words. 5+ public traces with annotations. Partner Network profile updated. At least one external distribution venue (talk, podcast, newsletter feature).',
      },
      {
        n: 12,
        title: 'Eval as a billable AIaaS service line + retrospective',
        why: 'Twelve months of eval discipline. The credential exists, the playbook exists, the proof exists. This month turns the practice into a business asset — a billable AIaaS service offering, a Partner Network differentiator, and the retrospective that ties the arc to the next year of work.',
        weeks: [
          'Service line definition: "Agentic Eval as a Service" as an Intinc/FlashFusion offering. The deliverable (eval suite + harness + runbook), the format (8-week engagement), the price, the target client. Most enterprises do not eval their AI systems — that is the market.',
          'First paid engagement (or paid commitment): pitch the eval service line to one Intinc client or FlashFusion lead. Even a discounted first engagement is validation. The deliverable from M5 or M10 is the demonstrable artifact in the pitch.',
          'Year retrospective: what changed in your engineering practice when eval became a discipline? What does the next 12 months look like — deeper specialization, broader teaching, an open-source eval framework? The retro feeds the Personal Brand arc Q4 work directly.',
          'Cross-arc integration audit: the eval discipline applied retroactively to the Full-Stack arc apps, the GCP Vertex AI work, the MCP servers from the MCP Builder arc. By M12 you should have eval coverage across at least 5 production artifacts spanning multiple arcs.',
        ],
        gate: 'Eval-as-a-service line defined with at least one paid engagement (or paid commitment) closed. Year retrospective published. Eval coverage across 5+ production artifacts spanning multiple arcs. The discipline is now leverage, not just a credential.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// EVAL STRIP — three method dimensions + two tooling dimensions
// ---------------------------------------------------------------------------
const EVAL_DIMS = [
  { type: 'method', label: 'Method', name: 'Datasets',  sub: 'Golden + edge cases · M2',     fill: 100 },
  { type: 'method', label: 'Method', name: 'Metrics',   sub: 'Task + production · M3',       fill: 88  },
  { type: 'method', label: 'Method', name: 'Judges',    sub: 'LLM-as-judge calibrated · M6', fill: 80  },
  { type: 'tool',   label: 'Tools',  name: 'Platform',  sub: 'LangSmith · Braintrust · M4',  fill: 65  },
  { type: 'tool',   label: 'Tools',  name: 'CI/CD',     sub: 'Eval gates · M7–M8',           fill: 50  },
];

// ---------------------------------------------------------------------------
// STYLES — Agentic Evaluation Arc / bright yellow on deep warm-dark
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0d0b06;
  --bg-2:         #181308;
  --fg:           #f5ecd6;
  --fg-dim:       #998c6a;
  --accent:       #eab308;
  --accent-2:     #facc15;
  --accent-dim:   #a16207;
  --gate:         #3b82f6;
  --tool:         #d4a648;
  --muted:        #4a3f1a;
  --card:         #14110a;
  --border:       #2a2210;
  --border-bright:#3a3018;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(234,179,8,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(59,130,246,0.05), transparent 65%),
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

.eval-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.eval-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.eval-item:last-child { border-right: none; }
.eval-item.is-tool { background: rgba(212,166,72,0.04); }

.eval-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.eval-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-method .eval-name { color: var(--accent); }
.is-tool   .eval-name { color: var(--tool); }
.eval-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-method .eval-sub { color: rgba(234,179,8,0.65); }
.is-tool   .eval-sub { color: rgba(212,166,72,0.7); }
.eval-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-method .eval-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.is-tool   .eval-bar-fill { background: var(--tool);   height: 100%; opacity: 0.75; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(234,179,8,0.07), rgba(234,179,8,0.01));
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
.invisible-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(234,179,8,0.03);
  font-size: 12.5px; color: var(--fg);
}
.invisible-note strong { color: var(--accent); }

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
.week.done  { border-left-color: var(--accent); background: rgba(234,179,8,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(234,179,8,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(59,130,246,0.3); background: rgba(59,130,246,0.04); align-items: start;
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
.claims code { color: var(--accent-2); background: rgba(234,179,8,0.1); padding: 1px 6px; font-size: 11px; }
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
  .eval-strip { grid-template-columns: 1fr 1fr; }
  .eval-item:nth-child(2) { border-right: none; }
  .eval-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function AgenticEvaluationArc() {
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
              <p className="kicker"><ClipboardCheck size={12} /> Learning Ops // Quality Lane</p>
              <h1 className="title-serif">The <em>Eval</em> Arc.</h1>
              <p className="title-sub">
                12 months. Eval becomes a first-class discipline rather than a byproduct. Golden
                dataset design as practice, LangSmith or Braintrust mastered, LLM-as-judge calibrated
                against human reference, CI/CD eval gates on every change, online drift detection,
                and a published playbook that turns the discipline into both brand asset and
                billable AIaaS service line.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Eval suites: <strong>2 production</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Playbook · service line</strong></div>
            </div>
          </div>

          <div className="eval-strip stagger">
            {EVAL_DIMS.map((s) => (
              <div key={s.name} className={`eval-item is-${s.type}`}>
                <div className="eval-label">{s.label}</div>
                <div className="eval-name">{s.name}</div>
                <div className="eval-sub">{s.sub}</div>
                <div className="eval-bar">
                  <div className="eval-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — eval is the most invisible work in your stack.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Every other technical arc ships visible artifacts: a deployed app, a passed cert, a
                published agent. Eval ships discipline. Nobody sees a regression caught before it
                shipped. The risk is investing 12 months in infrastructure that gets bypassed when
                deadline pressure hits. The arc has to fight that gravity by making eval visible
                and consequential — through CI/CD gates, public traces, and the playbook.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The rare discipline that lets you defend "this agent is working" with evidence rather than confidence — the credential that closes enterprise sales</li>
                    <li>A published playbook becomes the most-cited brand artifact in your Partner Network profile, more durable than any individual project</li>
                    <li>Eval-as-a-service is a billable AIaaS line with low fulfillment cost — most enterprises do not eval their AI systems and that is the market</li>
                    <li>CI/CD eval gates from M7 protect every later build across every other arc — a one-time investment that compounds across the full portfolio</li>
                    <li>Multi-agent eval skill from M9 is genuinely scarce — almost no practitioner outside Anthropic, OpenAI, and a few applied ML labs has it</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>MED load (4–6 hrs/week) but the work is mentally taxing — eval requires the most rigorous thinking of any arc</li>
                    <li>Most of the value comes from M2 dataset design, the easiest month to under-invest in. Resist the temptation to skip to M4 tooling</li>
                    <li>LLM-as-judge calibration in M6 is genuinely hard. Plan for it taking 3 weeks rather than 1, and budget judge API spend accordingly</li>
                    <li>Until the M11 publication, the work is invisible to your audience. The brand return arrives in Q4, not month-by-month</li>
                  </ul>
                </div>
              </div>
              <div className="invisible-note">
                <strong>The rule that prevents the worst failure mode:</strong> the highest-leverage
                month in this arc is M2 (dataset design), not M4 (tooling). Most practitioners pick
                LangSmith or Braintrust first and assume the dataset is the easy part. The dataset is
                the entire game. A great tool with a bad dataset measures noise. A simple harness with
                a great dataset catches real regressions for years. Spend the M2 weeks on the dataset
                like the rest of the arc depends on it — because it does.
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
                          <div className="gate-label">Verification gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>This is a MED-load arc that is mentally taxing.</strong> 4–6 hrs/week, but
                the work requires the most rigorous thinking of any arc in the series. Eval discipline
                fails when practitioners try to do it casually — it punishes hand-waving more than
                any other practice. Plan for full-attention sessions, not background-during-other-work
                sessions.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The highest-leverage month is M2, not M4.</strong> Most practitioners spend
                weeks comparing LangSmith vs Braintrust and minutes thinking about their dataset.
                That ratio is inverted. The dataset is the measurement system. The tool is the
                instrument. A great instrument measuring nothing useful is still measuring nothing.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>API spend on this arc is real and underestimated.</strong> Run-the-eval-suite
                costs add up: <code>$50–150/month</code> through Q1–Q2, spiking to <code>$200–400/month</code>
                in Q3 when CI/CD eval runs on every PR plus online sampling fires continuously. Build
                cost tracking into M4 platform setup and review monthly.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The brand return is Q4, not month-by-month.</strong> Until the M11 publication,
                this arc is invisible to your audience. The Personal Brand arc Q3 flagship cannot be
                this playbook unless eval discipline arc starts before Personal Brand M7. Sequence
                accordingly — running this arc before or alongside Personal Brand maximizes the
                cross-arc leverage.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc directly feeds three other arcs.</strong> CI/CD eval gates from M7
                protect every Full-Stack arc app and every MCP server. Multi-agent eval from M9
                applies to every n8n workflow with non-trivial logic. The published playbook becomes
                Personal Brand arc M7 flagship long-form material if the timing aligns. Build the
                eval discipline once, leverage it across the portfolio.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>LangSmith vs Braintrust is not a permanent commitment.</strong> Both platforms
                support data export. The M4 commitment is to one platform for the year — long enough
                to develop fluency, short enough that switching in Y2 is reasonable if the market
                shifts. Most practitioners who never pick a platform never develop the fluency that
                makes either platform useful.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
