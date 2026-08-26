import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Workflow } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month n8n / Automation Arc
// Kyle-specific: already uses n8n — this arc goes from functional to production-grade
// Stack: n8n, Supabase, Claude API, Cloudflare Workers, Copilot Studio, Teams
// Capstone thread: Drive Automation Chain + FlashFusion delivery workflows
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'PRODUCTION PATTERNS',
    subtitle: 'Make your existing workflows production-grade. AI as orchestration layer. Parallel and sub-workflow patterns.',
    months: [
      {
        n: 1,
        title: 'Production-grade error handling and reliability',
        why: 'Your existing n8n workflows are functional but fragile. Production means retry logic, error notifications, idempotency, and circuit breakers — the things that keep a workflow running at 3am without your intervention. Audit what you have before building anything new.',
        weeks: [
          'Production audit: run your top 5 existing workflows through a 10-point checklist (error workflow attached, retry logic configured, execution logging on, notification on failure, idempotency guaranteed, sensitive data not logged, timeout set, dead-letter path defined, documentation exists, tested against failure). Score each honestly.',
          'Error workflow pattern: build a reusable error-handling sub-workflow that logs to Supabase, sends a Teams or Slack notification with context, and retries up to 3 times with exponential backoff. Attach it to every workflow you audited.',
          'Idempotency: pick your most-used scheduled workflow and make it safe to run twice. What identifier does it need to store to know it has already processed a record? Implement a deduplication layer in Supabase.',
          'Dead-letter queue: build a Supabase table that captures every failed execution payload with enough context to replay it manually or automatically. Wire it to the error workflow from week 2.',
        ],
        gate: 'All 5 audited workflows pass the 10-point production checklist. Error workflow, idempotency, and dead-letter queue live on at least one critical workflow.',
      },
      {
        n: 2,
        title: 'AI-native workflows — Claude as orchestration layer',
        why: 'You have connected Claude to n8n as a text-generation node. That is not the same as using Claude as the reasoning and routing layer. This month is the shift from "Claude generates output" to "Claude decides what happens next."',
        weeks: [
          'Claude as a routing node: incoming webhook payload → Claude classifies intent → IF node routes to the correct branch based on classification. Zero hard-coded routing logic. Build one from a real Intinc or FlashFusion use case.',
          'Structured output from Claude into downstream nodes: JSON mode output from Claude populates an Airtable record, a Supabase row, or a Notion page. The schema is defined in the system prompt. Test robustness against 20 varied inputs.',
          'Context chaining across sequential Claude nodes: how do you pass conversation history or accumulated context between Claude calls without hitting the context window ceiling? Build a sliding-window context management pattern.',
          'The AI agent loop in n8n: trigger → Claude reasons about what tool to call → n8n executes the tool → result feeds back to Claude → repeat until Claude signals completion. Build this pattern for a real Intinc problem — ticket triage, email routing, or document classification.',
        ],
        gate: 'An AI agent loop workflow at Intinc or FlashFusion where Claude routes, reasons, and decides — not just generates text. At least one human-in-the-loop escalation path built in.',
      },
      {
        n: 3,
        title: 'Parallel execution, sub-workflows, and orchestration',
        why: 'Most n8n workflows are linear. The patterns that make automation genuinely powerful — parallel fan-out, sub-workflow composition, dynamic routing — are underused because they require a mental model shift. This month is the shift.',
        weeks: [
          'Parallel execution with SplitInBatches and merge: fan out across a list of items (5, 50, 500), process in parallel, collect results, continue. Build one that processes a real batch (newsletter recipients, client list, document set).',
          'Sub-workflow extraction: identify 3 patterns you have duplicated across multiple workflows. Extract each as a reusable sub-workflow with a clean input/output contract. Call them from a parent.',
          'Dynamic routing: workflow branches determined at runtime by data values, not by hard-coded IF nodes. Use a Switch node with expressions or a Code node with a routing table. Build one that can route to N branches without touching the workflow to add a new route.',
          'Master orchestrator pattern: one workflow that receives a payload, determines the correct sub-workflow to call, calls it, and handles the result. The architecture your production workflows should move toward.',
        ],
        gate: 'A master orchestrator workflow calling at least 3 sub-workflows dynamically. Parallel execution demonstrated on a real batch. Sub-workflows documented with input/output contracts.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'PLATFORM MASTERY',
    subtitle: 'Self-hosted n8n operations. Make comparative knowledge. Zapier and the three-platform decision framework.',
    months: [
      {
        n: 4,
        title: 'n8n self-hosted operations',
        why: 'Intinc clients running n8n on their own infrastructure need someone who can deploy, secure, back up, and monitor it. n8n Cloud is easy. Self-hosted is where the real ops knowledge — and the billable differentiation — lives.',
        weeks: [
          'Docker deployment from scratch: n8n in Docker Compose with PostgreSQL backend (not SQLite), environment variables, volume mounts, log rotation. Deploy a fresh instance without following a tutorial.',
          'Reverse proxy and TLS: n8n behind nginx or Caddy with Let\'s Encrypt. Basic auth on the UI. Firewall rules that expose only what needs to be exposed. Document every port and why it is open.',
          'Backup and recovery: PostgreSQL backup script on a cron, workflow export/import automation, execution history retention policy. Run a full restore from backup before calling this week done.',
          'Monitoring: failed execution alerting to Teams or Slack, disk space and container health checks, a simple execution success-rate dashboard. You should know a workflow failed before anyone else does.',
        ],
        gate: 'A self-hosted n8n instance deployed from scratch — Dockerized, TLS-terminated, backed up, monitored. A runbook someone else could use to redeploy it.',
      },
      {
        n: 5,
        title: 'Make (Integromat) — learn it well enough to recommend it honestly',
        why: 'Your default recommendation is n8n. That is usually correct. But Make has a different cost model, a larger built-in app library, and a visual paradigm that some non-technical users navigate better. Knowing when to recommend Make over n8n is a service differentiator — it signals you are solving for the client, not for your stack preference.',
        weeks: [
          'Make fundamentals in depth: scenarios, modules, operations, routers, iterators, aggregators, error handlers. Rebuild 3 workflows you have already shipped in n8n. Feel where Make is easier and where it frustrates you.',
          'Make-specific features: Data Stores (key-value persistence), custom HTTP modules, built-in app count vs. n8n. The things Make does that n8n does not have a direct equivalent for, and vice versa.',
          'Make pricing model: operations vs. n8n executions vs. Zapier tasks. Cost at 10K, 100K, and 1M operations per month. Build the comparison spreadsheet you would show a client who asks "which one should we use?"',
          'Make vs. n8n decision matrix: team technical level, monthly operation volume, required integrations, self-hosting preference, budget ceiling. Write the rules in plain language — not a matrix that requires interpretation.',
        ],
        gate: 'Three real workflows built in both n8n and Make. A documented recommendation framework for when to use each, written to be shown to a non-technical client.',
      },
      {
        n: 6,
        title: 'Zapier and the three-platform decision framework',
        why: 'Zapier is the market leader. Most of your clients have heard of it. Some are already using it and paying too much for it. Understanding Zapier\'s strengths and limits — and being able to articulate them without just saying "n8n is better" — is what makes you a platform-agnostic automation consultant.',
        weeks: [
          'Zapier fundamentals with hands-on depth: Zaps, multi-step actions, Paths (conditional branching), Filters, Delays, Formatter. Rebuild 3 workflows from your n8n portfolio in Zapier. Note every place where Zapier forced a different architectural choice.',
          'Zapier Tables and Interfaces: the newer product surface beyond basic automations. When this matters for non-technical teams who need lightweight apps without a developer.',
          'Zapier cost at scale: tasks vs. operations vs. executions. The price crossover points where n8n self-hosted wins on cost, where Make wins on value, where Zapier wins on accessibility. A spreadsheet with the actual numbers.',
          'Three-platform decision framework — write the final version: Zapier (non-technical, speed over control, limited budget for developer time), Make (mid-technical, visual, good operations value), n8n (technical team, self-hosted option needed, full control required). One page. Use it in every future client discovery.',
        ],
        gate: 'A three-platform comparison built from your own hands-on work with all three. A one-page decision framework you would hand to a client in a discovery call.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'ECOSYSTEM',
    subtitle: 'Custom node authorship. Webhook-native architecture. n8n as AI agent backbone.',
    months: [
      {
        n: 7,
        title: 'Custom node development',
        why: 'You have hit the ceiling of built-in nodes. Every time you reach for the HTTP Request node to call a service that should have a proper node, you are leaving usability — and marketability — on the table. Custom nodes are how your n8n work becomes impossible to replicate without you.',
        weeks: [
          'Custom node architecture: declarative vs. programmatic node types, credentials types, the n8n node development kit (n8n-node-dev). Set up the dev environment. Read one published community node\'s source code before writing a line of your own.',
          'Build your first custom node: a service from your actual stack that has no built-in n8n integration. Start with one action and one trigger. The test is: does it work identically to how a built-in node would?',
          'Custom credentials type: build a proper credentials implementation for your custom node. Handle OAuth2, API key, and bearer token patterns — not a hardcoded string in the node.',
          'Publish to the n8n community registry: the submission process, documentation requirements (README, parameter descriptions, error messages), and what makes a community node get used vs. ignored.',
        ],
        gate: 'One custom n8n node submitted to the community registry. Full documentation. At least one install from someone other than you.',
      },
      {
        n: 8,
        title: 'Webhook architecture and event-driven design',
        why: 'Most n8n workflows are scheduled. Scheduled workflows are always late. Event-driven workflows respond when something happens — they are faster, more resource-efficient, and more production-grade. The mental model shift from polling to pushing changes what you build and what you sell.',
        weeks: [
          'Webhook security fundamentals: signature verification (HMAC-SHA256), secret token validation, replay attack prevention. Every webhook endpoint you expose should verify the sender. Build and test the pattern.',
          'Webhook relay with Cloudflare Workers: a lightweight worker that verifies, pre-processes, and routes incoming webhook payloads to the correct n8n workflow before they reach n8n. Decouples your n8n instance from the public internet.',
          'Convert three scheduled workflows to event-driven: identify what event should trigger each one instead of a cron. Implement the webhook source. Measure the improvement in response time and elimination of unnecessary runs.',
          'Webhook-native workflow system: inbound events from Copilot Studio, Teams, or a client-facing Cloudflare Worker route to the correct n8n sub-workflow based on payload type. The event bus pattern for your stack.',
        ],
        gate: 'Three workflows converted from scheduled to event-driven with verified webhook security. A Cloudflare Worker relay handling at least two source systems.',
      },
      {
        n: 9,
        title: 'AI agent orchestration — n8n as the backbone',
        why: 'This is the month where everything in the arc converges: parallel execution from M3, sub-workflows from M3, Claude routing from M2, Supabase state from M1, and webhook triggers from M8 — all combined into a multi-agent system. The Drive Automation Chain is the natural reference implementation.',
        weeks: [
          'Agent loop pattern in n8n: trigger → Claude reasons and plans → n8n executes the tool → result returns to Claude → Claude decides next action or signals completion → exit. Build the canonical pattern from scratch, no LangChain or CrewAI wrapper.',
          'Memory management in n8n agents: short-term (execution context in a Set node), long-term (Supabase rows with agent_id and session_id), and episodic (n8n execution logs as a queryable history). Which type for which agent task.',
          'Multi-agent coordination: two n8n workflows acting as two agents, sharing state via a Supabase coordination table, with a mechanism for one to signal the other. Rebuild the Drive Automation Council pattern with proper error handling and observability.',
          'Tool-calling without MCP: Claude receives a structured tool manifest via system prompt, decides which tool to call via structured output, n8n executes the corresponding sub-workflow, result flows back. The pattern for clients who cannot run MCP servers.',
        ],
        gate: 'A multi-agent n8n system with at least two agents coordinating via shared state. One agent calling tools defined in Claude\'s system prompt. Drive Automation Chain or equivalent is the reference.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'CAPSTONE + CERTIFY',
    subtitle: 'Flagship workflow system shipped. n8n cert closed. Template library published. Teach the full arc.',
    months: [
      {
        n: 10,
        title: 'Capstone — flagship workflow system for Intinc or FlashFusion',
        why: 'Twelve months of workflow expertise should produce one system that demonstrates the full range: event-driven triggers, AI reasoning, parallel execution, sub-workflow composition, error handling, and monitoring. The newsletter automation pipeline and the AIaaS service delivery flow are both candidates.',
        weeks: [
          'Spec the system: which process at Intinc or FlashFusion has the highest automation surface? The Prompt newsletter pipeline (research → draft → format → distribute), the AIaaS client onboarding flow, or the FlashFusion order-to-delivery process.',
          'Build it. Every shortcut you would not be comfortable demonstrating to Dave and Jackie gets fixed. No scheduled workflows where event-driven is possible. No linear flows where parallel is correct.',
          'Instrument it: execution success rate, average duration per stage, error frequency by node, cost per run. These numbers go into the AIaaS service line pitch.',
          'Architecture Decision Record: why these workflow patterns for this specific use case? What would v2 add? Published alongside the system — this is the proof artifact.',
        ],
        gate: 'A flagship workflow system in production with monitoring, an ADR, and an executive summary ready for Intinc leadership. The numbers tell a clear story without narration.',
      },
      {
        n: 11,
        title: 'n8n certification and template library',
        why: 'The n8n certification exists and almost no one in the consulting ecosystem has it. The template library is the asset that generates ongoing leads — every download is a potential client who has already seen your work and trusted it enough to use it.',
        weeks: [
          'n8n certification exam prep: pull the current exam objectives, identify the genuine gaps, study those specifically. Do not restudy what you already know.',
          'Sit the n8n certification. Update LinkedIn, Partner Network profile, and capability brief immediately.',
          'Build the template library: 5 production-grade workflow templates covering distinct use cases from your arc (AI routing agent, webhook relay + Cloudflare Worker, parallel document processor, error-handling sub-workflow, multi-agent coordinator). Each with a README that explains the use case and setup.',
          'Publish: n8n template marketplace and your own GitHub repository. Set up a simple landing page or Notion page that presents all 5 templates with the context a new user needs to evaluate them.',
        ],
        gate: 'n8n cert in hand. 5 templates published in the n8n marketplace and on GitHub. At least 3 downloads on the most-used template from someone other than you.',
      },
      {
        n: 12,
        title: 'Teach, publish, and close the arc',
        why: 'You do not own the knowledge until you can transfer it without the safety net of your own implementation history. The workshop closes the Community Ambassador loop. The automation playbook closes the Partner Network loop. The retrospective tells you what the next arc actually is.',
        weeks: [
          'Workshop at CLC, Intinc, or a Community Ambassador event: "AI-native workflow automation for engineering teams." Live demo of the AI agent loop from M9. Hands-on exercise with the error-handling pattern from M1. The template library as the take-home.',
          'Publish the complete automation playbook: n8n production patterns, three-platform decision framework, AI agent orchestration, custom node development, webhook architecture. Every pattern you actually shipped, with the numbers.',
          'Update every positioning surface: Partner Network profile with the template library and capstone ADR linked, LinkedIn with the n8n cert and the workshop, AIaaS capability brief with "workflow automation" as a named service SKU.',
          'Retrospective: what became automatable that surprised you? What resisted automation more than you expected? What is Y2 — heavier orchestration (Temporal, Prefect, Airflow for complex pipelines), deeper AI agent patterns, or broadening to ETL and data engineering?',
        ],
        gate: 'Workshop delivered. Playbook published. Three clients or colleagues are using your templates or your three-platform framework in a real project.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// COMPETENCY ZONES — strip items
// ---------------------------------------------------------------------------
const ZONES = [
  { type: 'skill', label: 'Zone 1', name: 'Production',  sub: 'Q1 · M1–M3',  fill: 100 },
  { type: 'skill', label: 'Zone 2', name: 'AI Workflows', sub: 'Q1 · M2',    fill: 75  },
  { type: 'comp',  label: 'Zone 3', name: 'Make + Zapier', sub: 'Q2 · M5–M6', fill: 50  },
  { type: 'skill', label: 'Zone 4', name: 'Custom Nodes', sub: 'Q3 · M7',    fill: 25  },
  { type: 'cert',  label: 'Cert',   name: 'n8n Certified', sub: 'Sit M11',   fill: 8   },
];

// ---------------------------------------------------------------------------
// STYLES — n8n Automation Arc / electric orange on near-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0d0800;
  --bg-2:         #160e00;
  --fg:           #f5eddc;
  --fg-dim:       #b09060;
  --accent:       #f97316;
  --accent-2:     #fb923c;
  --gate:         #818cf8;
  --comp:         #94a3b8;
  --muted:        #5a3e20;
  --card:         #1a1000;
  --border:       #2e1e08;
  --border-bright:#422d10;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.09), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(129,140,248,0.05), transparent 65%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

/* ---- HEADER ---- */
.header-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: end;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }

/* ---- COMPETENCY ZONES STRIP ---- */
.zones-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  margin-bottom: 48px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.zone {
  padding: 16px 16px 20px;
  border-right: 1px solid var(--border);
  position: relative;
}
.zone:last-child { border-right: none; }
.zone.is-cert { background: rgba(129,140,248,0.04); border-left: 1px solid rgba(129,140,248,0.25); }
.zone.is-comp { background: rgba(148,163,184,0.03); }
.zone-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.zone-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 19px; line-height: 1.2; font-weight: 400; margin-bottom: 3px;
}
.is-skill .zone-name { color: var(--accent); }
.is-comp  .zone-name { color: var(--comp); }
.is-cert  .zone-name { color: var(--gate); }
.zone-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-skill .zone-sub { color: rgba(249,115,22,0.6); }
.is-comp  .zone-sub { color: rgba(148,163,184,0.6); }
.is-cert  .zone-sub { color: rgba(129,140,248,0.7); }
.zone-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-skill .zone-bar-fill { background: var(--accent);  height: 100%; opacity: 0.8; }
.is-comp  .zone-bar-fill { background: var(--comp);    height: 100%; opacity: 0.6; }
.is-cert  .zone-bar-fill { background: var(--gate);    height: 100%; opacity: 0.8; }

/* ---- TRADEOFF ---- */
.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(249,115,22,0.08), rgba(249,115,22,0.01));
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
.tradeoff-grid h4 {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px;
}
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }

/* ---- QUARTER TABS ---- */
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

/* ---- MONTHS ---- */
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

/* ---- WEEKS ---- */
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(249,115,22,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(249,115,22,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* ---- GATE — indigo = workflow executed ---- */
.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(129,140,248,0.35); background: rgba(129,140,248,0.04); align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text {
  font-size: 13px; color: var(--fg); font-family: 'Instrument Serif', serif;
  font-style: italic; line-height: 1.45;
}

/* ---- PROGRESS ---- */
.progress-wrap {
  position: sticky; top: 0; background: var(--bg);
  padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

/* ---- CLAIMS ---- */
.claims {
  margin-top: 72px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(249,115,22,0.1); padding: 1px 6px; font-size: 11px; }
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
  .zones-strip { grid-template-columns: 1fr 1fr; }
  .zone:nth-child(2) { border-right: none; }
  .zone:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function N8NAutomationArc() {
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
              <p className="kicker"><Workflow size={12} /> Learning Ops // Workflow Orchestration Lane</p>
              <h1 className="title-serif">The <em>n8n</em> Arc.</h1>
              <p className="title-sub">
                12 months. From functional to production-grade. Error handling, AI agent loops,
                parallel orchestration, self-hosted ops, Make and Zapier comparative knowledge,
                custom node authorship, and the Drive Automation Chain as the flagship reference.
                One cert. One template library. Everything teachable.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Primary: <strong>n8n + Supabase + Claude</strong></div>
              <div style={{ marginTop: 4 }}>Cert: <strong>n8n Certified, M11</strong></div>
            </div>
          </div>

          {/* COMPETENCY ZONES STRIP */}
          <div className="zones-strip stagger">
            {ZONES.map((z) => (
              <div key={z.name} className={`zone is-${z.type}`}>
                <div className="zone-label">{z.label}</div>
                <div className="zone-name">{z.name}</div>
                <div className="zone-sub">{z.sub}</div>
                <div className="zone-bar">
                  <div className="zone-bar-fill" style={{ width: `${z.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — this arc systematizes what you already do. That has a different risk profile.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                You already use n8n. This arc is not about learning a new tool — it is about making
                your existing n8n work production-grade, teachable, and sellable. The risk here is
                not skill acquisition: it is opportunity cost. Every hour spent on workflow
                reliability is an hour not spent on platform depth or client delivery.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Your existing workflows stop failing silently at 3am — immediate operational ROI</li>
                    <li>The three-platform framework is a direct AIaaS service differentiator in discovery calls</li>
                    <li>Custom nodes and the template library are assets that compound — built once, used repeatedly</li>
                    <li>n8n cert is low-hanging compared to SecAI+ or Google ML Eng — high credential value for the study time</li>
                    <li>The AI agent loop pattern (M9) is the highest-leverage technique in your current stack</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>3–4 hrs/week — less than the platform arcs, but it competes with the same calendar</li>
                    <li>Make and Zapier (M5–M6) require genuine hands-on time to evaluate honestly — not fast weeks</li>
                    <li>Custom node development (M7) has uncertain payoff if the service you target already has a connector</li>
                    <li>n8n self-hosted ops (M4) is ops work — not glamorous, rarely billable directly, always necessary</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Load is LOW (3–4 hrs/week)</strong> — the
                lowest of any arc in the series. Run this in parallel with the Claude or Copilot arc.
                The AI agent loop pattern in M9 directly references Claude arc patterns and the RAG
                arc's Supabase state management. These arcs compound when run together.
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
                          <div className="gate-label">Execution gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>The M1 audit is not optional.</strong> The 10-point production
                checklist applied to your existing workflows is the most immediately valuable week in the entire arc.
                It converts today's fragile workflows into reliable ones before you build anything new. Start there
                even if you never do another month.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Make and Zapier weeks (M5–M6) require real hands-on time.</strong>
                The three-platform framework is only credible if you have actually built the same workflow in all three.
                Summaries and benchmarks from the internet do not count. Clients will ask follow-up questions your own
                experience is the only honest basis for answering.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Custom node target matters.</strong> The M7 custom node payoff
                depends entirely on picking the right target service. If you pick a service that adds a native connector
                six months after you build the custom node, the maintenance burden lands on you. Pick something with a
                stable API and no near-term connector roadmap from n8n.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>n8n cert exam objectives — verify before M11.</strong> n8n updates
                the certification periodically. Pull the current exam guide at the start of M10 prep, not from the arc.
                <code>docs.n8n.io/courses/</code> is the current source.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The AI agent loop (M9) is the cross-arc junction.</strong> It
                directly references the Claude arc's multi-agent patterns, the RAG arc's Supabase state management, and
                the MCP arc's tool-calling design. If you are running multiple arcs, schedule M9 to land after the
                equivalent depth work in the other arcs has shipped.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Drive Automation Chain as the M9 reference assumes it is still
                active.</strong> If it has been deprecated or replaced, substitute the AIaaS service delivery pipeline
                or the FlashFusion client onboarding flow — any system with real parallel agent coordination requirements.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
