import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Terminal, Compass, BookOpen } from 'lucide-react';

// ---------------------------------------------------------------------------
// PLATFORM CONFIG
// ---------------------------------------------------------------------------
const PLATFORMS = {
  C:  { label: 'Claude',   color: '#e07856', bg: 'rgba(224,120,86,0.14)'  },
  G:  { label: 'Gemini',   color: '#c6f432', bg: 'rgba(198,244,50,0.12)'  },
  CP: { label: 'Copilot',  color: '#6ba8e8', bg: 'rgba(107,168,232,0.14)' },
  O:  { label: 'OpenAI',   color: '#5ee0c0', bg: 'rgba(94,224,192,0.12)'  },
  ALL:{ label: 'All',      color: '#d4a843', bg: 'rgba(212,168,67,0.14)'  },
};

const LOAD_CONFIG = {
  LOW:  { label: 'LOW',  sub: '4–6 hrs/wk',  color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  MED:  { label: 'MED',  sub: '7–9 hrs/wk',  color: '#facc15', bg: 'rgba(250,204,21,0.1)'  },
  HIGH: { label: 'HIGH', sub: '10–12 hrs/wk', color: '#fb923c', bg: 'rgba(251,146,60,0.1)'  },
  PEAK: { label: 'PEAK', sub: '13+ hrs/wk',  color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

// ---------------------------------------------------------------------------
// CONTENT — 12-month full-stack practitioner arc
// ---------------------------------------------------------------------------
const ARC = [
  {
    quarter: 'Q1',
    phase: 'CERT SPRINT',
    subtitle: 'Close Architect Foundations. Stand up all four platforms. Lay the eval foundation.',
    months: [
      {
        n: 1,
        title: 'Claude cert sprint',
        why: 'Everything else is deferred until Architect Foundations closes. It is the early-mover window that does not reopen.',
        load: 'HIGH',
        exam: null,
        weeks: [
          { p: 'C',   text: 'Gap audit: Agent SDK (Task, hooks, fork_session), CLAUDE.md hierarchy, MCP scoping, Message Batches. Write the study plan.' },
          { p: 'C',   text: 'Hands-on Agent SDK exercises — rebuild every example from docs from scratch. No copy-paste.' },
          { p: 'C',   text: 'Mock exam loop × 3. Score each. Document the final weak spots.' },
          { p: 'C',   text: 'Sit Claude Certified Architect Foundations. Pass at ≥720/1000.' },
        ],
        gate: 'Architect Foundations cert in hand. Everything else unblocked.',
      },
      {
        n: 2,
        title: 'Three platforms, first production calls',
        why: 'Cert is closed. Now stand up Gemini and prove Copilot depth beyond what you already ship.',
        load: 'HIGH',
        exam: null,
        weeks: [
          { p: 'G',   text: 'AI Studio onboarding — model lineup, SDK integration, first production call from your stack.' },
          { p: 'CP',  text: 'M365 Copilot fluency: Chat, in-app (Word/Excel/Outlook/Teams), Copilot Pages. Onboard 5+ users.' },
          { p: 'C',   text: 'Post-cert tool design — production-grade tool interfaces, error shapes, tool_choice.' },
          { p: 'G',   text: 'First Gemini feature in production. Diff the output against equivalent Claude call.' },
        ],
        gate: 'Three platforms each with at least one production call. Not notebooks.',
      },
      {
        n: 3,
        title: 'OpenAI starts. Agent foundations across all four.',
        why: 'The full platform surface is now active. Every platform gets its first agentic pattern.',
        load: 'HIGH',
        exam: null,
        weeks: [
          { p: 'CP',  text: 'Copilot Studio depth: topics vs. generative, system prompts, channels. New agent shipped.' },
          { p: 'C',   text: 'Agent SDK: Task tool, hooks, fork_session — production patterns, not docs.' },
          { p: 'G',   text: 'Function calling + structured output comparative — same task, Claude vs. Gemini. Document diff.' },
          { p: 'O',   text: 'OpenAI setup: Responses API as default, first production call, SDK fluency in JS and Python.' },
        ],
        gate: 'All four platforms with working integration in your stack. One agent per platform.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'DEPTH PUSH',
    subtitle: 'Each platform earns its advanced unlock. Eval discipline built across all four.',
    months: [
      {
        n: 4,
        title: 'Context, MCP, and tool mastery',
        why: 'The features that separate production practitioners from demo builders. One advanced unlock per platform.',
        load: 'HIGH',
        exam: null,
        weeks: [
          { p: 'G',   text: 'Gemini context caching deep dive — measure hit rate, model the cost savings. Document the threshold.' },
          { p: 'C',   text: 'MCP server #1. Build it. Use it weekly. Not a tutorial project.' },
          { p: 'O',   text: 'OpenAI structured outputs strict mode + parallel tool use. 5-tool agent, 100 adversarial inputs.' },
          { p: 'CP',  text: 'Copilot plugins + custom connectors. Three connectors in production, one used by another team.' },
        ],
        gate: 'Each platform has one advanced feature shipped in production.',
      },
      {
        n: 5,
        title: 'Multimodal, multi-agent, Power Platform',
        why: 'Multi-step and multimodal capabilities per platform. This is where demo-grade ends.',
        load: 'PEAK',
        exam: null,
        weeks: [
          { p: 'G',   text: 'Gemini Files API + multimodal — one non-text use case (doc, image, or audio) shipped.' },
          { p: 'C',   text: 'Multi-agent orchestration: orchestrator/worker pattern. Ship it at Intinc or FlashFusion.' },
          { p: 'CP',  text: 'Power Platform: agent triggering multi-step Automate flow across 3+ M365 services.' },
          { p: 'O',   text: 'OpenAI Agents SDK: multi-agent with clean handoffs. Traced and recoverable.' },
        ],
        gate: 'Each platform has one multi-step or multimodal feature. Four features, four platforms.',
      },
      {
        n: 6,
        title: 'Evaluation discipline — the cross-platform layer',
        why: 'Without evals, every change to every platform is a guess. This month installs the discipline system-wide.',
        load: 'MED',
        exam: null,
        weeks: [
          { p: 'ALL', text: 'Pick one eval tool (promptfoo or LangSmith). Learn it cold for all four providers.' },
          { p: 'ALL', text: 'LLM-as-judge calibration across providers. Rubric design. Inter-rater reliability check.' },
          { p: 'C',   text: 'OWASP LLM Top 10 red-team run against your own Claude and OpenAI builds. Publish the report.' },
          { p: 'ALL', text: 'Prompt + agent versioning in git. CI eval run on every change. Regression alerts live.' },
        ],
        gate: 'Eval suite running across all active platforms. Every prompt change gets scored.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'GOVERNANCE + EXAMS',
    subtitle: 'Security posture. MS and GCP exams. Provider portability layer built.',
    months: [
      {
        n: 7,
        title: 'Governance, security, and exam prep',
        why: 'Copilot governance + Claude safety together is rare. MS exam prep starts here.',
        load: 'HIGH',
        exam: 'MS AI cert prep starts',
        weeks: [
          { p: 'CP',  text: 'Copilot Studio governance: environments, solutions, ALM pipeline. Dev → test → prod with sign-offs.' },
          { p: 'CP',  text: 'Security: Purview, DLP, audit logs, sensitivity labels for AI. Draft CISO-ready posture doc.' },
          { p: 'C',   text: 'Constitutional AI + safety patterns. Red-team your own production Claude agent. Make it public.' },
          { p: 'CP',  text: 'MS cert practice exam #1 (AI-102 or MB-820). Record baseline score honestly.' },
        ],
        gate: 'MS cert baseline recorded. Security posture doc drafted. Red-team report published.',
      },
      {
        n: 8,
        title: 'Advanced features + MS cert close',
        why: 'Advanced platform features compound, and the MS cert closes this month.',
        load: 'HIGH',
        exam: 'AI-102 or MB-820 → SIT',
        weeks: [
          { p: 'G',   text: 'Gemini grounding with Google Search + Live API prototype. Measure when grounding helps vs. hurts.' },
          { p: 'O',   text: 'OpenAI Realtime API voice agent prototype. Sub-700ms turn latency goal.' },
          { p: 'CP',  text: 'Azure AI Foundry orientation. Decision matrix vs. Copilot Studio. One workload migrated.' },
          { p: 'CP',  text: 'Sit AI-102 or MB-820. MS AI cert closes this month.' },
        ],
        gate: 'MS AI cert in hand. Advanced feature per platform shipped.',
      },
      {
        n: 9,
        title: 'Provider portability + Vertex ramp',
        why: 'The bridge month. Multi-provider routing, Vertex foundation, fine-tuning experiment.',
        load: 'HIGH',
        exam: 'GCP ML Eng prep starts',
        weeks: [
          { p: 'G',   text: 'Vertex AI ramp: IAM, projects, billing, quotas. First Vertex endpoint. GCP ML Eng baseline exam.' },
          { p: 'O',   text: 'OpenAI fine-tuning: one SFT that beats prompting on a clear, measurable metric.' },
          { p: 'ALL', text: 'Provider router: Claude / Gemini / OpenAI backends, policy-based switching. Build it.' },
          { p: 'ALL', text: 'Cost / latency / quality model across all providers. Spreadsheet defensible to Daniel.' },
        ],
        gate: 'Provider router working. Switching providers is a config change, not a rewrite.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'SHIP + CERTIFY',
    subtitle: 'Multi-provider capstone. Google ML Eng cert. Teach everything.',
    months: [
      {
        n: 10,
        title: 'Capstone — multi-provider production system',
        why: 'The single artifact that proves you are a multi-model practitioner. Everything before this was practice.',
        load: 'PEAK',
        exam: null,
        weeks: [
          { p: 'ALL', text: 'Spec the system: real users, real scope, provider assignments by routing policy.' },
          { p: 'ALL', text: 'Build. OpenAI primary, Claude/Gemini fallback by policy. Real data, real failure modes.' },
          { p: 'ALL', text: 'Instrument. Cost telemetry, latency p95, quality drift. Tune routing on real traffic.' },
          { p: 'ALL', text: 'ADR + cost report. Public-shareable. Architecture Decision Record linked from your bio.' },
        ],
        gate: 'Multi-provider system in production. Cost report published. ADR live.',
      },
      {
        n: 11,
        title: 'Google Professional ML Engineer cert',
        why: 'Already on your list. Already started in M9. Close it.',
        load: 'HIGH',
        exam: 'Google ML Engineer → SIT',
        weeks: [
          { p: 'G',   text: 'Practice exam loops. Pull the current exam guide. Rotate question pools.' },
          { p: 'G',   text: 'Close remaining gaps: pipelines, feature stores, MLOps, data engineering patterns.' },
          { p: 'ALL', text: 'Publish: synthesize cross-platform learnings into one public artifact before exam week.' },
          { p: 'G',   text: 'Sit Google Professional ML Engineer. Two certs on the year.' },
        ],
        gate: 'Google ML Eng cert in hand. Two certs closed in 12 months.',
      },
      {
        n: 12,
        title: 'Teach, publish, pitch',
        why: 'Twelve months of multi-platform work becomes a community event, a published guide, and a service-line pitch.',
        load: 'MED',
        exam: null,
        weeks: [
          { p: 'ALL', text: 'Workshop at CLC: "The Multi-Provider AI Practitioner." Community Ambassador anchor event.' },
          { p: 'ALL', text: 'Publish the comparative playbook: Claude vs. Gemini vs. Copilot vs. OpenAI. Practitioner-grade.' },
          { p: 'CP',  text: 'AIaaS service-line pitch to Daniel + Dave + Jackie. Multi-platform depth = higher enterprise value.' },
          { p: 'ALL', text: 'Retrospective. What changed in your mental model? Define Y2. What is the next arc?' },
        ],
        gate: 'Workshop done. Playbook public. AIaaS pitch made. Year synthesized.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// EXAM CALENDAR (for the header strip)
// ---------------------------------------------------------------------------
const EXAMS = [
  { month: 1, label: 'Claude Architect Foundations', color: '#e07856' },
  { month: 8, label: 'AI-102 or MB-820 (MS AI)', color: '#6ba8e8' },
  { month: 11, label: 'Google Professional ML Engineer', color: '#c6f432' },
];

// ---------------------------------------------------------------------------
// STYLES — Combo / warm gold variant
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #060508;
  --bg-2: #0c0a10;
  --fg: #f0ece2;
  --fg-dim: #9e9888;
  --accent: #d4a843;
  --warn: #e85a5a;
  --muted: #5a5248;
  --card: #110f14;
  --border: #221e2a;
  --border-bright: #352f40;
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
    radial-gradient(ellipse 70% 40% at 20% -5%, rgba(212,168,67,0.07), transparent 55%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(107,168,232,0.04), transparent 60%),
    radial-gradient(ellipse 50% 30% at 100% 0%, rgba(198,244,50,0.03), transparent 50%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1200px; margin: 0 auto; }

.header-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: end;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
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
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub {
  font-size: 13px;
  color: var(--fg-dim);
  margin: 16px 0 0;
  max-width: 56ch;
}
.meta {
  text-align: right;
  font-size: 11px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.meta strong { color: var(--accent); font-weight: 500; }

/* platform legend */
.legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: var(--fg-dim);
}
.legend-dot {
  width: 8px; height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* exam calendar strip */
.exam-strip {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.exam-strip-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
  padding: 10px 14px;
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: var(--bg-2);
}
.exam-months {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  flex: 1;
}
.exam-month {
  border-right: 1px solid var(--border);
  padding: 4px 6px;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}
.exam-month:last-child { border-right: none; }
.exam-month-num {
  font-size: 9px;
  color: var(--fg-dim);
  letter-spacing: 0.12em;
}
.exam-badge {
  font-size: 9px;
  padding: 2px 4px;
  border-radius: 2px;
  line-height: 1.3;
  font-weight: 500;
}

/* tradeoff */
.tradeoff {
  border: 1px solid var(--warn);
  border-left-width: 3px;
  background: rgba(232,90,90,0.06);
  padding: 20px 24px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--warn); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--warn);
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

/* quarter tabs */
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
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.1;
  margin: 6px 0 4px;
  font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

/* months */
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
  grid-template-columns: 80px 1fr auto auto;
  gap: 20px;
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
}
.month-why {
  font-size: 12px;
  color: var(--fg-dim);
  margin: 0;
  max-width: 60ch;
}
.month-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}
.load-badge {
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 600;
  white-space: nowrap;
}
.exam-pill {
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 2px;
  white-space: nowrap;
  text-align: right;
  max-width: 160px;
  line-height: 1.4;
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

.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 10px 12px;
  background: var(--bg-2);
  border-left: 2px solid var(--border-bright);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.week.done {
  border-left-color: var(--accent);
  background: rgba(212,168,67,0.05);
}
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.platform-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 2px;
  white-space: nowrap;
  align-self: start;
  margin-top: 2px;
  letter-spacing: 0.06em;
}
.week-text {
  font-size: 12.5px;
  color: var(--fg);
  line-height: 1.55;
}
.week.done .week-text {
  color: var(--fg-dim);
  text-decoration: line-through;
  text-decoration-color: rgba(212,168,67,0.4);
}
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed rgba(212,168,67,0.5);
  background: rgba(212,168,67,0.04);
  align-items: start;
}
.gate-icon { color: var(--accent); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

/* progress */
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

/* claims */
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
.claims code { color: var(--accent); background: rgba(212,168,67,0.1); padding: 1px 6px; font-size: 11px; }
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

@media (max-width: 800px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .tradeoff-grid { grid-template-columns: 1fr; }
  .quarter-rail { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .exam-strip { display: none; }
  .month-head { grid-template-columns: 56px 1fr auto; gap: 14px; padding: 16px; }
  .month-meta { display: none; }
  .month-num { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
  .week { grid-template-columns: auto auto 1fr auto; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function PractitionerArc() {
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

  function PlatformBadge({ p }) {
    const cfg = PLATFORMS[p];
    return (
      <span
        className="platform-badge"
        style={{ color: cfg.color, background: cfg.bg }}
      >
        {p}
      </span>
    );
  }

  function LoadBadge({ level }) {
    const cfg = LOAD_CONFIG[level];
    return (
      <div>
        <span className="load-badge" style={{ color: cfg.color, background: cfg.bg }}>
          {cfg.label}
        </span>
        <div style={{ fontSize: 9, color: cfg.color, textAlign: 'right', marginTop: 2, opacity: 0.7 }}>
          {cfg.sub}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Terminal size={12} /> Learning Ops // Full-Stack Synthesis</p>
              <h1 className="title-serif">The <em>Practitioner</em> Arc.</h1>
              <p className="title-sub">
                All five platforms. One year. Claude, Gemini, Copilot, OpenAI — sequenced by
                priority, exam-collision-aware, with per-week platform tagging and load meters
                so you know exactly what you are committing to each month.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Certs: <strong>3 targeted</strong></div>
              <div style={{ marginTop: 4, fontSize: 10 }}>Architect · MS AI · Google ML Eng</div>
            </div>
          </div>

          {/* PLATFORM LEGEND */}
          <div className="legend stagger">
            {Object.entries(PLATFORMS).map(([key, cfg]) => (
              <div key={key} className="legend-item">
                <div className="legend-dot" style={{ background: cfg.color }} />
                <span style={{ color: cfg.color, fontWeight: 600, marginRight: 2 }}>[{key}]</span>
                <span>{cfg.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              {Object.entries(LOAD_CONFIG).map(([key, cfg]) => (
                <div key={key} className="legend-item">
                  <span className="load-badge" style={{ color: cfg.color, background: cfg.bg, fontSize: 9, padding: '2px 6px' }}>{key}</span>
                  <span style={{ fontSize: 10 }}>{cfg.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EXAM CALENDAR STRIP */}
          <div className="exam-strip">
            <div className="exam-strip-label">
              <BookOpen size={10} style={{ marginRight: 6 }} />
              Exam calendar
            </div>
            <div className="exam-months">
              {Array.from({ length: 12 }, (_, i) => {
                const m = i + 1;
                const exams = EXAMS.filter(e => e.month === m);
                return (
                  <div key={m} className="exam-month">
                    <span className="exam-month-num">M{m}</span>
                    {exams.map((e, ei) => (
                      <span
                        key={ei}
                        className="exam-badge"
                        style={{ color: e.color, background: e.color + '18' }}
                      >
                        {e.label}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>This arc is a real commitment. Read the load math before you say yes.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Running all five platforms in parallel is not a casual side-project. Month 5 and
                Month 10 hit PEAK load (13+ hrs/week on top of your day job). That is the honest number.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Three certs in 12 months — almost no one has this combination right now</li>
                    <li>Multi-provider capstone (M10) is a differentiated artifact with no peer</li>
                    <li>AIaaS service line pitch in M12 lands with genuine platform depth, not marketing</li>
                    <li>The "right tool for the job" positioning becomes verifiable, not claimed</li>
                    <li>Community Ambassador workshop (M12) covers ALL platforms — broadest reach</li>
                  </ul>
                </div>
                <div>
                  <h4>What you risk</h4>
                  <ul>
                    <li>Execution risk is real — 3 exams + 4 platforms + day job + FlashFusion + newsletter</li>
                    <li>Breadth can dilute depth. Each platform gets less time than its individual arc</li>
                    <li>If any exam slips, the cascade delays Q3 and Q4 planning</li>
                    <li>Brand positioning harder to communicate briefly — "what do you specialize in?"</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Honest assessment:</strong> The sustainable version
                of this arc is Claude + Copilot primary, with Gemini and OpenAI as secondary tracks.
                That is still 4 platforms. The load meters per month tell you when it gets real.
              </p>
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
              const loadCfg = LOAD_CONFIG[m.load];
              const examEntry = EXAMS.find(e => e.month === m.n);
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div className="month-head" onClick={() => setOpenMonth(isOpen ? null : m.n)}>
                    <div className="month-num">M{String(m.n).padStart(2, '0')}</div>
                    <div>
                      <h3 className="month-title">{m.title}</h3>
                      <p className="month-why">{m.why}</p>
                    </div>
                    <div className="month-meta">
                      <LoadBadge level={m.load} />
                      {examEntry && (
                        <span
                          className="exam-pill"
                          style={{ color: examEntry.color, background: examEntry.color + '18' }}
                        >
                          📋 {examEntry.label}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="month-chev" size={20} />
                  </div>
                  <div className="month-body">
                    <div className="month-body-inner">
                      <div className="weeks">
                        {m.weeks.map((w, wi) => {
                          const key = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          const pcfg = PLATFORMS[w.p];
                          return (
                            <div
                              key={key}
                              className={`week ${isDone ? 'done' : ''}`}
                              onClick={() => toggleWeek(key)}
                              style={isDone ? {} : { borderLeftColor: pcfg.color + '66' }}
                            >
                              <span className="week-label">W{wi + 1}</span>
                              <PlatformBadge p={w.p} />
                              <span className="week-text">{w.text}</span>
                              {isDone ? <CheckCircle2 size={16} className="week-check" /> : <Circle size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Checkpoint gate · M{m.n}</div>
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
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> CLAIMS &amp; ASSUMPTIONS</h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Load math is honest.</strong> <code>PEAK</code> months
                (M5, M10) are 13+ hrs/week of structured learning activity on top of your day job, newsletter,
                FlashFusion, and ambassador work. That is a real number. If it is not real for your life, extend
                the arc to 18 months or drop one platform track.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Three exams is the ceiling.</strong> Architect Foundations (M1),
                MS AI cert (M8), and Google ML Eng (M11) are the three exam commits. Do not add a fourth mid-arc
                without removing something else.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Exam dates in M1 and M8 are adjacent to PEAK load months.</strong>
                Specifically: M5 is PEAK and M8 is the MS exam. That is three months apart. If M5 slips or burns you out,
                M8 exam prep gets compressed. Plan recovery time after M5 explicitly.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Platform surface areas shift quarterly.</strong> Verify current API
                docs, model names, and exam guides at the START of the relevant month, not now. Do not study from stale
                material.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The [ALL] weeks are the real output.</strong> Platform-specific weeks
                build capability. <code>[ALL]</code> weeks (evaluation, portability, capstone) build
                differentiation. If time compresses, protect the [ALL] weeks first.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Progress state resets on refresh.</strong> Memory only — by design.
                Move this to a Notion table or Craft doc with a weekly check-in if you want persistence.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
