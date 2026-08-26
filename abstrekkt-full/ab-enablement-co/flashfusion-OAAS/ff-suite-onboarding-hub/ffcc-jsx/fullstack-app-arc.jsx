import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Layers } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Full-Stack AI App Arc
// Kyle-specific: bridges from automation (n8n, Copilot Studio, Claude Desktop)
// to user-facing products with auth, database, UI, payments, real users.
// Stack: Next.js + FastAPI/Hono + Supabase + Auth.js/Clerk + Vercel + Stripe
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATIONS',
    subtitle: 'Each stack layer mastered through working spikes — not tutorials. Frontend, backend, data, auth.',
    months: [
      {
        n: 1,
        title: 'Next.js & React — frontend craft, not just HTML+CSS',
        why: 'Your existing builds use Copilot Studio chat surfaces, Claude Desktop, or n8n form embeds. None of those required real frontend craft. Next.js App Router with Server Components, Client Components, Server Actions, and proper hydration boundaries is the foundation under every modern AI product. This is the month where your component thinking shifts from "HTML page" to "composable UI tree."',
        weeks: [
          'Next.js App Router fundamentals: app/ directory structure, server vs client components, the rules around use client and where state can live. Build a small spike with three routes, two layouts, and one server action that reads from a database. The spike is the curriculum.',
          'TypeScript foundations applied to React: prop typing, generic components, useState/useReducer with proper types, and the discriminated union pattern for component variants. Your Microsoft-heavy stack has C# muscle memory — TypeScript will feel familiar but the React patterns are different.',
          'Tailwind CSS + shadcn/ui setup: the component library that lets you ship without designing from scratch. Install shadcn, add 5 components (button, card, dialog, form, table), build a static dashboard layout with them. This becomes the visual shorthand for every later app.',
          'Deploy spike to Vercel: connect a GitHub repo, push to main, see the preview URL. Configure environment variables. The deploy step should feel routine by the end of week 4 — every later month assumes you can ship to a URL in under five minutes.',
        ],
        gate: 'A small Next.js app deployed to a public Vercel URL with three routes, server actions, shadcn/ui components, and TypeScript typing throughout. Pushed to main = automatically deployed.',
      },
      {
        n: 2,
        title: 'API design & streaming — the backend layer for AI',
        why: 'Your n8n workflows and Copilot Studio agents handle backend implicitly. A real product has an explicit backend with versioned APIs, rate limiting, error handling, and streaming responses. This month you build that layer once — properly — so every subsequent app reuses the patterns instead of reinventing them.',
        weeks: [
          'API design fundamentals: REST vs RPC vs Server Actions vs tRPC, when each is the right call. For AI products, Server Actions in Next.js cover 70% of cases; the other 30% need a dedicated backend. Build a Server Action that calls Claude and returns structured output.',
          'FastAPI or Hono for the AI backend layer: pick one based on language preference. FastAPI if you want the Python ecosystem and your future ML Engineer cert work; Hono if you want edge-native and the Cloudflare arc compatibility. Build a backend with /chat, /generate, /healthz endpoints, proper status codes, error responses.',
          'Streaming responses (Server-Sent Events): the pattern that makes AI UIs feel alive. SSE from backend, fetch with a ReadableStream on the frontend, token-by-token rendering. This is the hardest pattern in the arc — get it working in week 3, refine through every later project.',
          'Rate limiting, API key management, and observability: Upstash Redis for rate limits, env-based API key management, basic request logging. Send one rate-limited request and watch the 429 come back. Send a malformed request and watch the structured error response.',
        ],
        gate: 'A backend API with at least 3 endpoints, streaming Claude responses via SSE, rate-limiting working, and structured error responses. Tested with curl and from the M1 frontend.',
      },
      {
        n: 3,
        title: 'Supabase & auth — the data layer for multi-tenant products',
        why: 'You already use Supabase for the Drive Automation Chain. That use is single-tenant — your data, your queries. A user-facing product is multi-tenant by default: every query needs to know who is asking, what they own, and what they can see. This month is when Supabase RLS stops being theory and becomes the default mental model.',
        weeks: [
          'Supabase deeper: Row Level Security policies, Postgres functions, database triggers, realtime subscriptions. Build a schema with users, workspaces, and resources. Write RLS policies that prevent any user from reading another user\'s data. Test the policies with two real test accounts.',
          'Auth.js (NextAuth) or Clerk: pick based on control vs. speed. Auth.js gives you full control and lives in your codebase; Clerk gives you speed and a hosted UI. For a portfolio of multiple apps, Clerk is the faster path. Build sign-up, sign-in, sign-out, password reset, and a protected dashboard route.',
          'Multi-tenancy at the data layer: workspaces table, workspace_members table, the join pattern for "all resources in workspaces I belong to." Test the SQL queries directly in Supabase before wiring them to the UI. This is the pattern under almost every B2B SaaS product.',
          'Migrations and schema management: Supabase migrations with the CLI, version-controlled schema, the workflow for "I changed the schema in dev, now apply it to prod." Practice the migration apply / rollback cycle three times until it is muscle memory.',
        ],
        gate: 'A Next.js app with Clerk or Auth.js auth, Supabase data layer with RLS policies preventing cross-tenant reads, and a working migration workflow. Two test users cannot see each other\'s data.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'FIRST APP',
    subtitle: 'A real product, end-to-end. One Claude-powered feature, real auth, real users, real deployment.',
    months: [
      {
        n: 4,
        title: 'Build app v1 — vertical slice from auth to AI feature',
        why: 'The fastest way to learn a stack is to build a real product end-to-end. This month is the v1 of the first app. Pick something narrow: a writing assistant for a specific job role, a structured extractor for a specific document type, a Claude-powered tool for a workflow you already do manually. The narrowness is the point — a focused v1 ships, a broad v1 stalls.',
        weeks: [
          'Pick the problem and write the spec: one paragraph describing what the app does and who uses it. Define the v1 scope as a single Claude-powered feature plus auth plus history. If the spec exceeds three sentences, the scope is too big for v1.',
          'Build vertical slice 1 — auth + landing page + protected dashboard with a "no data yet" empty state. The spine of the app exists before any AI feature is wired up. Most full-stack projects fail because the AI feature is built before the app skeleton.',
          'Build vertical slice 2 — the Claude-powered feature: input form → API call → streamed output → save to database → display in history. End to end. One feature, working all the way through, not three half-features.',
          'Polish week: empty states for new users, error states for Claude API failures, loading states with skeleton UIs from shadcn/ui. The difference between a tutorial app and a real app is what happens when things go wrong. Handle three failure modes: bad input, API timeout, rate limit hit.',
        ],
        gate: 'A v1 app with auth, one working Claude-powered feature, history, and three handled failure modes. Deployed to a Vercel URL. You can demo it to a non-technical person without disclaimers.',
      },
      {
        n: 5,
        title: 'Deployment, observability, and operational hygiene',
        why: 'Shipping to Vercel once is a milestone. Operating a deployed app — watching errors, managing environments, recovering from failures — is the discipline. This month builds the operational layer that turns a working deploy into a maintainable product.',
        weeks: [
          'Vercel deployment patterns: preview deployments per branch, environment variables per environment (dev/preview/prod), promotion flow from preview to production. Push a feature branch, get a preview URL with isolated env vars, merge to main, watch it promote.',
          'Sentry or similar error tracking: install the Sentry SDK, capture an unhandled error in development, see it in the dashboard. Trigger a real production error, see it tracked. The first time you see a user error you didn\'t experience yourself is the moment observability earns its weight.',
          'Vercel Analytics or PostHog for user analytics: page views, custom events for "user submitted prompt," "AI response completed," "history viewed." The data tells you what users actually do vs. what you assumed they would do.',
          'Database backups and restore drills: Supabase point-in-time recovery, the manual backup workflow, the restore-to-staging drill. Run the drill once. The backup that has never been tested is not a backup.',
        ],
        gate: 'Sentry catching production errors. Analytics showing real user events. Preview-to-production promotion working. One successful database restore drill documented.',
      },
      {
        n: 6,
        title: 'Polish, accessibility, and the first real user',
        why: 'The v1 app from M4 works. M5 makes it operationally sound. This month is the difference between "engineer-built" and "professional product." Accessibility, SEO, performance, and one non-Kyle user actually using it for a real task. The first user feedback rewires every assumption you made in M4.',
        weeks: [
          'Accessibility audit: WCAG 2.1 AA basics. Keyboard navigation through every interaction. Screen reader testing on three critical flows. Color contrast checks. Most of this is fixed by using shadcn/ui components correctly — the audit reveals where you went off-pattern.',
          'SEO and metadata: proper page titles, descriptions, og:image, twitter:card. Sitemap and robots.txt. A Google Search Console property verified for the production domain. The product gets indexed before anyone searches for it.',
          'First real user — not Kyle, not Daniel, not someone obligated to give kind feedback. Find one person who has the problem the app solves. Watch them use it without explaining anything. Write down every moment of confusion. The watching is more valuable than the talking.',
          'v1.1 ship: apply the top three changes from the user observation. Re-deploy. Send to the user, see if v1.1 unblocked the confusion. The cycle observation → fix → re-test is the product development loop in miniature.',
        ],
        gate: 'A WCAG 2.1 AA-compliant app with proper SEO. One real user has used it for a real task. Top three friction points fixed and shipped as v1.1. Honest user-observation notes documented.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'SCALE THE STACK',
    subtitle: 'Streaming UI, multi-tenancy, payments, and the production hardening that separates a product from a prototype.',
    months: [
      {
        n: 7,
        title: 'Streaming AI UI — the pattern that makes AI feel native',
        why: 'The M2 SSE backend was infrastructure. This month is the UI layer that consumes it elegantly: token-by-token rendering with smooth transitions, optimistic UI for assistant responses, cancelable streams, partial-render error recovery. The difference between an AI app that feels alive and one that feels like a form submission.',
        weeks: [
          'useStream and Server Actions with streaming: the Vercel AI SDK\'s useChat / useCompletion hooks, OR custom hooks built on the Fetch ReadableStream API. Build a generation UI where text appears word-by-word as Claude produces it. Smooth, no flicker.',
          'Optimistic UI patterns: when a user sends a message, the UI updates instantly to show their message before the server responds. When Claude responds, the assistant message appears in a "thinking" state, then streams content. The perceived latency drops by 60% even when actual latency is unchanged.',
          'Cancelable streams: a stop button that actually stops the stream. AbortController on the frontend, propagating cancellation to the backend, partial response handling on cancel. Users will stop bad generations — your app needs to handle that gracefully.',
          'Multi-turn conversation UI: the chat-style interface that keeps context across turns. Message history rendering, conversation persistence to the database, scroll-to-bottom behavior, auto-resize input. The Claude.ai pattern, in your own product.',
        ],
        gate: 'A streaming AI UI with token-by-token rendering, optimistic UI, working cancel, and multi-turn conversation. Indistinguishable from Claude.ai or ChatGPT in feel. Deployed and tested with a real user.',
      },
      {
        n: 8,
        title: 'Multi-tenancy and payments — the SaaS layer',
        why: 'A product that does not collect money is a portfolio piece. A product that does is a business. This month adds the SaaS scaffolding: workspaces, team members, Stripe subscriptions, usage-based billing, quota enforcement. Most of these patterns are well-trodden — execute them correctly once and they become reusable across every future app.',
        weeks: [
          'Workspaces and team patterns: workspaces table, workspace_members table with role enums (owner, admin, member), invitation flow with email tokens, RLS policies that scope every query to "my workspaces." This is the pattern under almost every B2B SaaS.',
          'Stripe integration: Stripe Checkout for subscriptions, Stripe Customer Portal for self-service, webhook handler for subscription lifecycle events (created, updated, canceled, payment_failed). The webhook handler is where 80% of payment bugs live — log every event, replay them in dev.',
          'Quota enforcement: free tier vs paid tier limits, usage tracking in the database, the API-layer guard that returns 402 when over quota. The user must hit the quota wall and see a clear upgrade path, not a confusing error.',
          'The pricing page: a real pricing page with three tiers (free, pro, team). Linked to Stripe products. Users can click "upgrade" and complete checkout in under 90 seconds. Test the full flow in production with a real card and refund yourself afterward.',
        ],
        gate: 'A multi-tenant app with workspaces, Stripe subscriptions working end-to-end, quota enforcement preventing free-tier abuse, and a pricing page that converts at least one real test purchase. Webhook handler logged and tested.',
      },
      {
        n: 9,
        title: 'Production hardening — security, testing, recovery',
        why: 'Most apps fail in production because of issues nobody tested for. This month applies the Security Arc work to your own codebase, builds the test coverage that catches regressions, and runs the recovery drills that turn "we lost data" into "we restored from backup." The discipline that lets you sleep.',
        weeks: [
          'Security review applied to your own app: OWASP ASVS basic checklist, input validation on every endpoint, output sanitization, rate limiting verified, auth bypass attempts tested. This is the Security Arc M2-M4 work applied to the artifact you built. Every finding becomes a backlog item or a ticket-now item.',
          'Test coverage for critical paths: Vitest for unit tests, Playwright for end-to-end tests of the auth flow + the AI feature flow + the payment flow. Not 100% coverage — coverage of the three paths that breaking would refund the customer.',
          'Backup and recovery drill in production: simulate a database failure, restore from point-in-time backup, verify the data is intact, document the runbook. The first real drill takes 4 hours; the second takes 30 minutes; the third never happens because nothing breaks.',
          'Monitoring and alerting: Sentry alerts for critical errors, uptime monitoring (Better Stack or UptimeRobot), Slack or email notifications for production issues. The alert that wakes you up at 3am should be the same alert you can fix from your phone in 10 minutes.',
        ],
        gate: 'A security review documented with all findings addressed or backlogged. End-to-end tests covering auth, AI, and payment flows. One successful production recovery drill. Alerting working and tested.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'FLAGSHIP',
    subtitle: 'The portfolio piece. A product worth paying for, launched publicly, with real users and a public retrospective.',
    months: [
      {
        n: 10,
        title: 'Build the flagship — the product worth paying for',
        why: 'The M4 v1 app proved you can ship. The M7-M9 work proved you can operate. This is the product you want in your portfolio when an enterprise client asks "show me what you have built." Pick the problem worth solving — for Intinc, FlashFusion, or your own consulting brand. Build it for real, not as a tutorial output.',
        weeks: [
          'Pick the problem with stakes: an internal Intinc tool that automates a real process, a FlashFusion client tool that delivers real value, or a public product targeting your security-first AI practitioner audience. The problem must have a user willing to pay for the solution — even if "pay" means time saved or budget allocated, not dollars.',
          'Design before code: figure pages or even Excalidraw mockups of every screen before any code. The interaction patterns, the empty states, the error states. The design phase prevents three weeks of "this doesn\'t feel right" rebuilds in M11.',
          'Build the spine — auth, dashboard, the primary feature working end-to-end with the real Claude integration. Deploy to a custom domain (not a vercel.app subdomain). The product looks and feels like a product, not a project.',
          'Build the secondary features — settings, export, sharing, history, anything the primary user needs beyond the core feature. By the end of M10, every flow a user could plausibly want is implemented at least once.',
        ],
        gate: 'A flagship product on a custom domain with auth, primary feature, secondary features, and the design quality of a real SaaS app. One internal stakeholder (Daniel, a client, or a partner) has used it for a real task and given specific feedback.',
      },
      {
        n: 11,
        title: 'Performance, accessibility, and pre-launch polish',
        why: 'A product can ship at 70% polish and learn from users, or it can ship at 90% polish and earn trust on day one. For a flagship, the second path matters. This month is the audit and remediation work that turns a working product into a professional one — the difference between "engineer made this" and "you would not know an engineer made this."',
        weeks: [
          'Performance audit: Lighthouse 90+ across performance, accessibility, best practices, SEO. Bundle analysis with @next/bundle-analyzer, code splitting where bundles are large, image optimization with next/image, font optimization with next/font.',
          'Accessibility deep pass: WCAG 2.1 AA verified with automated tools (axe DevTools) and manual keyboard testing on every flow. Screen reader testing on the critical paths. Real disabled users use AI tools — exclusion is a product flaw, not a checkbox.',
          'Copy and content polish: every error message rewritten to be helpful, every empty state given a clear next action, every email template (welcome, password reset, payment receipt) on-brand and clear. The words a user reads define their experience as much as the UI.',
          'Brand and visual polish: a real logo (even if AI-generated and refined), consistent use of brand colors, a polished marketing page that explains what the product is in 10 seconds. The marketing page is the conversion gate — a confused visitor does not sign up.',
        ],
        gate: 'Lighthouse 90+ across all categories. WCAG 2.1 AA verified. Marketing page that converts a non-technical visitor in 10 seconds. Copy reviewed and rewritten for clarity. The product is launch-ready.',
      },
      {
        n: 12,
        title: 'Launch and the year-one retrospective',
        why: 'The product is built, polished, and operational. The launch is what turns it into something that exists in the world. Public launch, real users, first paying customer (or first equivalent commitment), and a written retrospective that ties the arc to the next year of work — including how the flagship feeds the AIaaS and Personal Brand arcs.',
        weeks: [
          'Soft launch: send to your existing audience first — The Prompt subscribers, LinkedIn followers, Intinc colleagues, Community Ambassador network. Collect 20-50 active users in the first week. Watch the analytics, fix the bugs that emerge, refine onboarding before going broader.',
          'Public launch: ProductHunt, Hacker News (Show HN), LinkedIn announcement, Prompt edition with the full story. The launch post is half "here is what I built" and half "here is what I learned" — the second half is what makes it shareable to other builders.',
          'First paying customer or commitment: a real Stripe charge, an Intinc internal budget allocation, or a FlashFusion client retainer that includes the product. The number on the line item validates the product as a business, not just a portfolio piece.',
          'Year-one retrospective: published as a Prompt edition or LinkedIn post. What you built, what worked, what failed, how the stack feels after 12 months, what the Y2 plan is. Public accountability ties the arc to the next year — and feeds the Personal Brand arc directly.',
        ],
        gate: 'A flagship product launched publicly with at least 50 real users in the first month and at least one paying customer or paid commitment. A published retrospective. The artifact that the AIaaS service line and Partner Network listing both reference as proof of capability.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STACK STRIP — five layers of the full-stack
// ---------------------------------------------------------------------------
const STACK = [
  { type: 'foundation', label: 'Layer 1', name: 'Frontend',  sub: 'Next.js · M1 onward',     fill: 100 },
  { type: 'foundation', label: 'Layer 2', name: 'Backend',   sub: 'FastAPI · Hono · M2',     fill: 88  },
  { type: 'foundation', label: 'Layer 3', name: 'Data',      sub: 'Supabase · Auth · M3',    fill: 76  },
  { type: 'production', label: 'Layer 4', name: 'Deploy',    sub: 'Vercel · Sentry · M5',    fill: 60  },
  { type: 'scale',      label: 'Layer 5', name: 'Ship',      sub: 'Stripe · Launch · M8+',   fill: 42  },
];

// ---------------------------------------------------------------------------
// STYLES — Full-Stack AI App Arc / fuchsia on deep magenta-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #150a1f;
  --bg-2:         #1d1029;
  --fg:           #f3e6f9;
  --fg-dim:       #a586b6;
  --accent:       #e879f9;
  --accent-2:     #f0abfc;
  --accent-dim:   #c026d3;
  --gate:         #34d399;
  --prod:         #c084fc;
  --scale:        #f9a8d4;
  --muted:        #4a2c54;
  --card:         #1c0f28;
  --border:       #2a1a38;
  --border-bright:#3d2a4f;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,121,249,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(52,211,153,0.05), transparent 65%),
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

.stack-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.stack-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.stack-item:last-child { border-right: none; }
.stack-item.is-production { background: rgba(192,132,252,0.04); }
.stack-item.is-scale      { background: rgba(249,168,212,0.05); border-left: 1px solid rgba(249,168,212,0.22); }

.stack-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.stack-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-foundation .stack-name { color: var(--accent); }
.is-production .stack-name { color: var(--prod); }
.is-scale      .stack-name { color: var(--scale); }
.stack-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-foundation .stack-sub { color: rgba(232,121,249,0.6); }
.is-production .stack-sub { color: rgba(192,132,252,0.65); }
.is-scale      .stack-sub { color: rgba(249,168,212,0.7); }
.stack-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-foundation .stack-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.is-production .stack-bar-fill { background: var(--prod);   height: 100%; opacity: 0.75; }
.is-scale      .stack-bar-fill { background: var(--scale);  height: 100%; opacity: 0.80; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(232,121,249,0.07), rgba(232,121,249,0.01));
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
.completion-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(232,121,249,0.03);
  font-size: 12.5px; color: var(--fg);
}
.completion-note strong { color: var(--accent); }

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
.week.done  { border-left-color: var(--accent); background: rgba(232,121,249,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(232,121,249,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(52,211,153,0.3); background: rgba(52,211,153,0.04); align-items: start;
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
.claims code { color: var(--accent-2); background: rgba(232,121,249,0.1); padding: 1px 6px; font-size: 11px; }
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
  .stack-strip { grid-template-columns: 1fr 1fr; }
  .stack-item:nth-child(2) { border-right: none; }
  .stack-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function FullStackAppArc() {
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
              <p className="kicker"><Layers size={12} /> Learning Ops // Product Lane</p>
              <h1 className="title-serif">The <em>App</em> Arc.</h1>
              <p className="title-sub">
                12 months. The bridge from automation to product. Next.js, FastAPI or Hono,
                Supabase with multi-tenant RLS, Auth.js or Clerk, Vercel deployment, Stripe
                payments, real users. Three apps shipped — a foundation v1, a multi-tenant SaaS,
                and a flagship that earns revenue or significant adoption.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Apps shipped: <strong>3 production</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Live flagship · paying users</strong></div>
            </div>
          </div>

          <div className="stack-strip stagger">
            {STACK.map((s) => (
              <div key={s.name} className={`stack-item is-${s.type}`}>
                <div className="stack-label">{s.label}</div>
                <div className="stack-name">{s.name}</div>
                <div className="stack-sub">{s.sub}</div>
                <div className="stack-bar">
                  <div className="stack-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — completion matters more than depth in this arc.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Every other technical arc in your series rewards depth. This one rewards completion.
                A half-finished app teaches almost nothing about product; a shipped flawed app
                teaches more than a perfect prototype that never launched. The failure mode is
                spending Q1 perfecting Next.js while skipping the M4 ship. Resist it.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Bridges the automation-to-product gap that no other arc closes — the ability to build software a stranger pays to use</li>
                    <li>Three shipped apps with real users become your strongest Partner Network proof point — the directory listing converts on portfolio, not credentials</li>
                    <li>Multi-tenant SaaS patterns from M8 are reusable across every future client engagement and every internal Intinc tool</li>
                    <li>The flagship becomes the first AIaaS productized SKU — a service line that does not require Kyle in the room to scale</li>
                    <li>Streaming UI patterns from M7 make Voice & Realtime arc (Series 2) a fraction of the work it would otherwise be</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load — 8–12 hrs/week including weekends. Q1 is the steepest ramp because the stack is genuinely new ground</li>
                    <li>The completion-over-depth tradeoff cuts both ways: you will ship apps with code that makes a senior engineer wince. That is correct for this arc, painful for your AppSec instincts</li>
                    <li>Frontend craft is genuinely a different muscle from backend engineering. Expect 2–3 weeks of feeling slow in M1 before App Router clicks</li>
                    <li>Three shipped apps means three operational surfaces. Every shipped app needs ongoing maintenance — plan for ~30 min/week per live app from M6 onward</li>
                  </ul>
                </div>
              </div>
              <div className="completion-note">
                <strong>The rule that overrides everything else in this arc:</strong> if you are
                ever choosing between adding one more feature or shipping the version you have, ship
                the version you have. The user feedback on a flawed shipped product is more valuable
                than every refinement you could make alone. M4 ships at 70% polish. M10 ships at 90%.
                Both are correct for their phase.
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
                          <div className="gate-label">Ship gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>This is a HIGH-load arc and the load is real.</strong> 8–12 hrs/week including weekend
                build sessions. Q1 is the steepest because the stack is new ground. M4 onward is more
                manageable — you are iterating on existing apps, not learning new layers. Do not run
                this arc alongside another HIGH-load arc (GCP/Vertex AI Series 2) without a calendar
                review. The failure mode is two HIGHs colliding on weeks 4–8 when both arcs ramp.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Three apps shipped is the realistic ceiling for 12 months.</strong> The arc plans
                for v1 (M4), multi-tenant SaaS (M8), and flagship (M10). Each subsequent app reuses
                infrastructure from the prior. Attempting four apps means none reach the polish bar
                that makes them portfolio-worthy.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Frontend craft is the unfamiliar muscle.</strong> Your existing builds did not
                require it. Expect 2–3 weeks of feeling slow in M1 before App Router clicks. The
                feeling is normal and resolves. The tactical advice: build small spikes constantly,
                do not try to architect a perfect app structure before you have shipped a small one.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Three live apps means three maintenance surfaces.</strong> Plan ~30 min/week
                per shipped app from M6 onward for monitoring, security patches, dependency updates,
                and small bug fixes. By M12 this is ~90 min/week of background ops on top of the
                arc work. Build the runbooks early — the M5 work pays off through M12.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The flagship must connect to revenue or a real organizational outcome.</strong>
                A portfolio piece with no users is a failed flagship by this arc's standard. The gate
                requires <code>50+ active users</code> AND <code>at least one paying customer or paid commitment</code>. If the flagship cannot meet that, pick a different
                flagship in M10 — even if it means restarting that quarter.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc feeds three other arcs directly.</strong> M7 streaming UI patterns
                make Voice & Realtime (Series 2) significantly easier. M8 multi-tenancy patterns
                feed every future Customization Service client. M12 launch and retrospective
                directly fuel the Personal Brand arc Q4 work. Sequence accordingly.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
