import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Cloudflare Edge AI Arc
// Kyle-specific: already uses Workers for webhook relays. This arc goes
// deeper — Workers AI, Vectorize, D1, R2, AI Gateway — and ships 5 production
// edge AI deployments + a published "AI at the Edge" architecture guide.
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'EDGE PRIMITIVES',
    subtitle: 'Workers deeper, the storage primitives, Workers AI + AI Gateway as the inference layer.',
    months: [
      {
        n: 1,
        title: 'Workers deeper — past webhook relays into production patterns',
        why: 'You already use Cloudflare Workers for webhook relays and proxy patterns. That use is a fraction of what Workers actually is. This month is the upgrade from "I can deploy a Worker" to "I can architect production systems on the Workers runtime" — TypeScript discipline, observability, secrets management, and the constraint-aware design that edge runtime requires.',
        weeks: [
          'Workers in TypeScript: wrangler with TypeScript scaffolding, types for env bindings, the development loop with wrangler dev. Most production Workers are TypeScript — vanilla JS is fine for spikes but harder to maintain past the first 200 lines. Migrate one of your existing Workers to TypeScript.',
          'Edge runtime constraints as design principles: CPU time per request (10ms free, 50ms paid bundled, longer with paid unbound), no Node.js APIs (use Web APIs or Cloudflare-specific bindings), request-scoped lifecycle (no persistent state between requests). These constrain the design — they are not bugs to work around.',
          'Secrets, environment variables, and bindings: wrangler secret put, environment-specific config, the bindings model (env.AI, env.DB, env.VECTORIZE) that injects services into Workers. Secrets management is more deliberate at the edge than in long-running services.',
          'Observability and debugging: wrangler tail for live logs, Workers Analytics Engine for metrics, Logpush for shipping logs to your aggregator. Edge debugging is harder than centralized debugging because every edge node is its own runtime — observability is non-optional.',
        ],
        gate: 'A Worker deployed in TypeScript with proper bindings, secrets management, and structured logging shipping to an aggregator. Constraint awareness documented — what your design assumes about CPU time, memory, and request lifecycle.',
      },
      {
        n: 2,
        title: 'Storage primitives — D1, R2, KV — when each is right',
        why: 'Cloudflare has three storage primitives plus Vectorize. Choosing wrong burns a quarter rebuilding. D1 is SQLite-as-a-service for relational workloads. R2 is S3-compatible blob storage with no egress fees. KV is eventually consistent key-value for read-heavy caching. This month is the decision tree internalized through real builds, not docs.',
        weeks: [
          'D1 deep dive: SQLite-based, replicated read replicas, the migration model with wrangler d1 migrations, the limits (10GB per database currently, adjust to actual at the time of building). Build a small CRUD app on D1 with proper migrations. The relational answer for most edge apps under 10GB.',
          'R2 deep dive: S3-compatible API, no egress fees (the actual differentiator from S3), public buckets with custom domains, lifecycle policies. Build one service that uploads and serves files via R2. The storage layer for AI training data, model artifacts, and generated outputs.',
          'KV deep dive: eventually consistent, optimized for high-read workloads, the latency characteristics (writes propagate within 60 seconds globally). KV is wrong for transactional data and right for cached config, session tokens, and feature flags. Build one service that uses KV correctly.',
          'The decision tree: when to use each storage primitive. Build a one-page reference document with concrete examples — "Bitwarden migration metadata: D1 (relational, transactional). User-uploaded files: R2 (binary, no egress). Cached API responses: KV (read-heavy, tolerant of staleness)." The reference becomes muscle memory.',
        ],
        gate: 'Three small services demonstrating D1, R2, and KV in their right contexts. A documented decision tree for storage primitive selection. Migration discipline working for D1 (apply, rollback, redeploy in under 5 minutes).',
      },
      {
        n: 3,
        title: 'Workers AI + AI Gateway — the inference layer',
        why: 'Workers AI is Cloudflare\'s managed inference platform — Llama, Mistral, Whisper, embedding models, image models. Pricing is per-token-equivalent, often cheaper than OpenAI/Anthropic for comparable open-source models. AI Gateway sits in front of any AI provider (Workers AI, OpenAI, Anthropic) and adds caching, rate limiting, observability, fallbacks. Together they are the inference control plane.',
        weeks: [
          'Workers AI capabilities survey: text generation models (Llama 3, Mistral), embedding models (BGE, E5), Whisper for transcription, image models for generation and analysis. Build one spike calling each model type. Note latency from your closest Cloudflare PoP.',
          'Workers AI cost vs API providers: Llama 3.1 8B on Workers AI vs Claude Haiku vs GPT-4o-mini. For each, run the same evaluation prompt 100 times and document cost, latency, and quality. The cost-quality tradeoff is real and use-case-specific.',
          'AI Gateway setup: a gateway in front of Workers AI, Claude, and OpenAI. Caching configuration, rate limiting per user/IP, observability dashboards. AI Gateway makes multi-provider AI architecture cheap to implement — the abstraction other arcs assume but rarely build.',
          'Fallback patterns through AI Gateway: if Claude is unavailable, fall back to GPT-4o-mini; if both unavailable, fall back to Workers AI Llama. The reliability pattern that turns AI from "single point of failure" to "graceful degradation."',
        ],
        gate: 'Workers AI integrated with at least 3 model types tested for your use cases. AI Gateway in front of multi-provider AI with caching, rate limiting, and fallback configured. Cost comparison documented across providers for one representative workload.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'VECTOR & RAG AT THE EDGE',
    subtitle: 'Vectorize mastered. Edge RAG patterns. First production edge AI app shipped.',
    months: [
      {
        n: 4,
        title: 'Vectorize — Cloudflare\'s vector database',
        why: 'Vector DBs at centralized providers (Pinecone, Qdrant Cloud, Weaviate) add latency to every retrieval — 100-200ms minimum. Vectorize runs at the edge with sub-30ms retrieval. For latency-sensitive RAG and semantic search, edge vector DB changes the architecture. This month is Vectorize fluency.',
        weeks: [
          'Vectorize fundamentals: index creation, dimension specification, metric selection (cosine, dot product, euclidean), the wrangler vectorize commands. Build one index with a small dataset. Note the dimensions and metric tradeoffs.',
          'Embedding generation strategies: Workers AI embedding models (BGE-small, E5) for in-platform generation, OpenAI/Cohere/Voyage embeddings for higher quality. The cost vs quality vs latency tradeoff for embeddings is different from the LLM tradeoff. Build one of each pattern.',
          'Hybrid search patterns: Vectorize for semantic similarity + D1 full-text search for keyword matching. The combined retrieval pattern that outperforms either alone for most production RAG. Implement the hybrid retrieval and benchmark against pure vector search.',
          'Vectorize at scale: index size limits, query throughput, the cost model. Vectorize is priced per-query and per-stored-vector — at large scale the math differs from self-hosted alternatives. Document the break-even points for your likely use cases.',
        ],
        gate: 'A working Vectorize index with embeddings generated via at least two providers compared. Hybrid search (vector + full-text) pattern implemented and benchmarked against pure vector search. Cost model documented for scaling scenarios.',
      },
      {
        n: 5,
        title: 'Edge RAG — sub-50ms retrieval + generation',
        why: 'Most RAG systems run with 200-500ms time-to-first-token because retrieval happens at a centralized DB and generation happens at a centralized model. Edge RAG runs both at the edge — Vectorize retrieval (sub-30ms) + Workers AI generation (sub-100ms first token) = a different architecture entirely. This month builds the edge RAG pattern that almost no practitioner has built well yet.',
        weeks: [
          'The edge RAG architecture: ingestion pipeline (offline, runs anywhere), retrieval at the edge (Vectorize), generation at the edge (Workers AI or AI Gateway to Anthropic). Build the architecture diagram and identify the latency budget for each component.',
          'Ingestion pipeline: documents → chunking → embedding → Vectorize index. The ingestion can run offline on any platform; only the serving runs at the edge. Build one pipeline that ingests a real document corpus (Intinc internal docs, your existing project documentation, or a public dataset).',
          'Retrieval pattern: query → embedding → Vectorize search → re-ranking (if needed) → context assembly. Measure end-to-end retrieval latency from at least three geographic locations. The latency win over centralized vector DB should be visible.',
          'Generation pattern: assembled context + user query → Workers AI or AI Gateway → streaming response back to the user. End-to-end edge RAG measured at sub-700ms time-to-first-token. The architecture that makes RAG feel instant rather than laggy.',
        ],
        gate: 'A working edge RAG system end-to-end with measured sub-700ms time-to-first-token from three geographic locations. Documented architecture with latency budget per component. Comparison against centralized RAG showing the latency delta.',
      },
      {
        n: 6,
        title: 'First production edge AI app',
        why: 'M1-M5 builds the foundation. M6 ships the first real production app on the edge AI stack. Pick a use case where edge latency genuinely matters — internal tool that runs everywhere, public-facing semantic search, AI middleware that wraps an existing API. The use case must justify the edge architecture, not just deploy to it.',
        weeks: [
          'Pick the use case: an internal Intinc tool that benefits from low latency globally, a Customization Service deliverable that needs sub-100ms response times, a public AI middleware product. The latency advantage must be the differentiator, not an afterthought.',
          'Architecture and build: combining M1-M5 components into one production app. Workers + D1 + Vectorize + Workers AI + AI Gateway working together. The architecture is the product — the choices about which primitive does what define the system.',
          'Deployment and observability: production deployment with proper environment management (dev, staging, prod), Workers Analytics Engine dashboards, error tracking, cost monitoring. Edge cost is per-request — track it per-feature to know where the spend goes.',
          'First user and iteration: deploy to one real user (Intinc colleague, FlashFusion client, or one external user). Measure usage, gather feedback, ship v1.1. The iteration cycle proves the edge stack works for real workloads, not just demos.',
        ],
        gate: 'A first production edge AI app deployed and used by at least one real user. Documented architecture with measured latency. Cost-per-request tracked. v1.1 shipped based on real feedback.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'STATEFUL EDGE',
    subtitle: 'Durable Objects, Workflows, Queues, AI middleware patterns — the advanced edge primitives.',
    months: [
      {
        n: 7,
        title: 'Durable Objects — stateful coordination at the edge',
        why: 'Workers are stateless by design. Durable Objects are the escape hatch when stateful coordination is required — chat rooms, real-time multi-user state, agent session management, rate limiters that need consistency. Durable Objects are the most powerful and most misunderstood Cloudflare primitive. This month makes them muscle memory.',
        weeks: [
          'Durable Objects fundamentals: the actor model, single-instance consistency, the storage API, the lifecycle (sleep, wake, eviction). Most edge developers never reach for Durable Objects because the mental model is unfamiliar. Build one DO that maintains a counter across requests.',
          'Real-time patterns with WebSockets: a chat room or live collaboration session backed by a Durable Object. WebSocket hibernation for connections that idle. The pattern that makes real-time AI agents possible at the edge.',
          'Agent session management: a voice agent or chat agent backed by one Durable Object per session. The DO holds conversation state, tool call history, and session metadata. The pattern that makes the Voice arc M6 deployment patterns work at the edge.',
          'Rate limiting and quota enforcement: per-user rate limits backed by Durable Objects (consistent, exact) vs KV (eventually consistent, approximate). When each is appropriate. Build one strict-consistency rate limiter using Durable Objects.',
        ],
        gate: 'At least three Durable Objects implementations covering counter/state, real-time WebSockets, and agent session management. The patterns documented as reusable templates. The mental model is in your fingers, not just the docs.',
      },
      {
        n: 8,
        title: 'Workflows + Queues — durable async work at the edge',
        why: 'Workers run for milliseconds. Real systems often need work that runs for minutes, hours, or days — document processing, model retraining triggers, batch operations, multi-step agent flows. Cloudflare Workflows (durable execution) and Queues (message-based async) are the answer. This month is the async layer.',
        weeks: [
          'Cloudflare Workflows fundamentals: durable execution, automatic retries, sleep/wait primitives, the programming model. Workflows is Cloudflare\'s answer to Temporal — long-running work with guaranteed completion, but with edge-native pricing and integration.',
          'Build a multi-step workflow: document ingestion that runs across hours — chunk, embed, index, summarize, notify. Each step is a durable function that survives Worker restarts and platform failures. The pattern that makes batch ML pipelines at the edge possible.',
          'Cloudflare Queues: message-based async with FIFO ordering, batch consumption, dead-letter queues. The pattern for "this work needs to happen but does not need to happen synchronously." Build one Queue-backed service that processes events asynchronously.',
          'Workflows vs Queues vs Durable Objects: the decision tree. Each solves a different async problem. Durable Objects: stateful coordination. Queues: message-based async. Workflows: long-running multi-step durable execution. Document when each is right with concrete examples from your work.',
        ],
        gate: 'One Workflows-based multi-step pipeline running end-to-end. One Queues-based async service. A decision tree document for choosing between Workflows, Queues, and Durable Objects with concrete examples.',
      },
      {
        n: 9,
        title: 'AI middleware patterns — the edge as control plane',
        why: 'Cloudflare\'s most underused capability for AI is as middleware — the layer that sits between client and AI provider, adding auth, caching, rate limiting, transformations, fallbacks, and observability. AI middleware at the edge runs in front of every AI request without latency penalty. This month is the middleware patterns that turn the edge into the AI control plane.',
        weeks: [
          'Authentication middleware: Workers in front of AI APIs that handle auth, user identification, quota enforcement before forwarding to the upstream AI provider. The pattern that prevents API key leakage and enables per-user quota.',
          'Caching middleware: AI Gateway caching for deterministic prompts, custom Worker caching for semi-deterministic patterns, the cache hit rate optimization. Real-world caching can reduce AI cost by 30-50% on production workloads — most practitioners under-implement this.',
          'Transformation middleware: Workers that intercept AI requests and responses to add system prompts, redact PII, enforce output formats, or apply guardrails. The "every AI request goes through our quality gate" pattern that makes safety policies enforceable at infrastructure level.',
          'Fallback and circuit-breaker middleware: when the upstream AI fails or is slow, route to a backup. AI Gateway handles basic fallbacks; advanced patterns (model selection based on prompt complexity, cost optimization based on user tier) require custom Workers. Build the advanced version.',
        ],
        gate: 'A complete AI middleware layer deployed: auth, caching, transformation, and fallback. Measurable cache hit rate, documented fallback behavior, observable PII redaction. The middleware is reusable across multiple AI applications, not coupled to one.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'FLAGSHIP & PUBLISH',
    subtitle: 'Five production deployments. Optimization pass. "AI at the Edge" architecture guide published.',
    months: [
      {
        n: 10,
        title: 'Build the flagship — five production Workers AI deployments',
        why: 'M6 shipped the first production edge AI app. By M10 the goal is five total production deployments — different use cases, different patterns, all running at the edge. Five is the number that proves the patterns generalize. The goal is breadth across the edge AI stack, not one polished demo.',
        weeks: [
          'Inventory existing deployments: M3 Workers AI work, M5 edge RAG, M6 first production app. That is three. M10 needs two more. Pick two use cases that exercise patterns not yet shipped — maybe a Workflows-based batch pipeline and an AI middleware proxy.',
          'Build deployment 4: a use case that exercises Workflows + Workers AI for a real batch processing pipeline. Document ingestion, summary generation across thousands of documents, scheduled retraining triggers. The pattern Cloudflare\'s edge async makes possible.',
          'Build deployment 5: an AI middleware proxy that sits in front of Anthropic and OpenAI for a real client or internal use case. Auth, caching, transformation, fallback all working. The deployment that proves the M9 middleware patterns work in production.',
          'Cross-deployment observability: a unified dashboard showing health, latency, and cost across all five deployments. The pattern that makes operating multiple edge AI apps tractable rather than chaotic.',
        ],
        gate: 'Five production Workers AI deployments live. Cross-deployment observability dashboard. Each deployment exercises a different pattern (inference-only, RAG, stateful, async, middleware). The breadth is the proof the patterns generalize.',
      },
      {
        n: 11,
        title: 'Performance, observability, cost optimization',
        why: 'Five production deployments running. Some are fast and cheap; others are likely neither. M11 is the optimization pass — measure everything, optimize the hot paths, control the cost. Edge cost compounds differently than centralized cost; per-request economics demand different discipline.',
        weeks: [
          'Latency optimization across all five: measure p50, p95, p99 for each. Identify the slowest deployment and the slowest path within it. Optimize one component at a time, re-measure, document the delta. The edge advantage is sub-100ms — anywhere a deployment exceeds 200ms is an optimization target.',
          'Cost optimization: per-deployment cost analysis, identifying the most expensive call patterns, applying AI Gateway caching where caching hit rate could be high. Workers AI cost vs API provider cost — for each deployment, is the cheapest model still good enough?',
          'Observability deepening: structured logging, distributed tracing across multi-service deployments, alert thresholds that fire before users notice. The "we know there\'s an issue before the user reports it" capability that distinguishes production-grade from demo-grade.',
          'Documentation: every deployment has a README with architecture, key decisions, runbook for common failures, cost expectations. The documentation that lets a future-you (or a teammate) maintain the system without rediscovering everything.',
        ],
        gate: 'All five deployments meeting documented latency and cost targets. Observability dashboards alerting before issues become user-visible. Each deployment has a complete README with architecture, runbook, and cost model. The production-grade bar is met across the portfolio.',
      },
      {
        n: 12,
        title: 'Publish "AI at the Edge" guide and brand integration',
        why: 'Twelve months of edge AI work. Five production deployments. The published architecture guide is what turns the body of work into brand asset. "AI at the Edge: When and how to choose Cloudflare for AI workloads" is the artifact that joins the Partner Network listing and gets cited by other practitioners building in the same space.',
        weeks: [
          'Draft the architecture guide: when does edge AI win? When does it lose? The decision framework other practitioners need: workload latency requirements, geographic distribution, cost model, vendor lock-in considerations. Specific examples from your five deployments.',
          'Polish and publish: long-form post or Substack standalone, GitHub repo with the example code from your deployments (sanitized), architecture diagrams. Cross-link to the Partner Network profile and the AIaaS service offerings.',
          'Cloudflare community presence: contribute to the Workers Discord, answer questions on the Cloudflare community forums, submit a talk to a Workers community event or Cloudflare Connect. The presence that turns "I built things on Workers" into "I am known in the Workers community."',
          'Year retrospective: what changed in your understanding when edge became a paradigm? What does Y2 look like — deeper specialization in one Cloudflare service, contribution to open-source Cloudflare tooling, or branching into edge ML training (Constellation)? The retro feeds the Personal Brand arc Q4 work.',
        ],
        gate: 'The "AI at the Edge" architecture guide published. GitHub repo with example code public. Active presence in Cloudflare community (Discord/forums/event submission). Cloudflare AI stack added to the Partner Network capability listing. The arc work is now leverage, not just deployments.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLOUDFLARE STRIP — four primitives + one control plane
// ---------------------------------------------------------------------------
const CF_PRIMITIVES = [
  { type: 'primitive', label: 'Inference', name: 'Workers AI', sub: 'Managed models · M3',     fill: 100 },
  { type: 'primitive', label: 'Vector',    name: 'Vectorize',  sub: 'Edge vector DB · M4',     fill: 90  },
  { type: 'primitive', label: 'Relational', name: 'D1',        sub: 'SQLite at the edge · M2', fill: 70  },
  { type: 'primitive', label: 'Storage',   name: 'R2 + KV',    sub: 'Blob + cache · M2',       fill: 55  },
  { type: 'control',   label: 'Control',   name: 'AI Gateway', sub: 'Cache · fallback · M3',   fill: 80  },
];

// ---------------------------------------------------------------------------
// STYLES — Cloudflare Edge AI Arc / deep orange-red on warm dark
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0d0805;
  --bg-2:         #160d07;
  --fg:           #f5e6d8;
  --fg-dim:       #b08868;
  --accent:       #ea580c;
  --accent-2:     #fb923c;
  --accent-dim:   #c2410c;
  --gate:         #06b6d4;
  --control:      #fdba74;
  --muted:        #4a2818;
  --card:         #150c07;
  --border:       #281607;
  --border-bright:#3a210e;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(234,88,12,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(6,182,212,0.05), transparent 65%),
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

.cf-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.cf-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.cf-item:last-child { border-right: none; }
.cf-item.is-control { background: rgba(253,186,116,0.05); border-left: 1px solid rgba(253,186,116,0.22); }

.cf-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.cf-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-primitive .cf-name { color: var(--accent); }
.is-control   .cf-name { color: var(--control); }
.cf-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-primitive .cf-sub { color: rgba(234,88,12,0.65); }
.is-control   .cf-sub { color: rgba(253,186,116,0.7); }
.cf-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-primitive .cf-bar-fill { background: var(--accent);  height: 100%; opacity: 0.85; }
.is-control   .cf-bar-fill { background: var(--control); height: 100%; opacity: 0.80; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(234,88,12,0.07), rgba(234,88,12,0.01));
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
.constraint-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(234,88,12,0.03);
  font-size: 12.5px; color: var(--fg);
}
.constraint-note strong { color: var(--accent); }

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
.week.done  { border-left-color: var(--accent); background: rgba(234,88,12,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(234,88,12,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(6,182,212,0.3); background: rgba(6,182,212,0.04); align-items: start;
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
.claims code { color: var(--accent-2); background: rgba(234,88,12,0.1); padding: 1px 6px; font-size: 11px; }
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
  .cf-strip { grid-template-columns: 1fr 1fr; }
  .cf-item:nth-child(2) { border-right: none; }
  .cf-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function CloudflareEdgeAiArc() {
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
              <p className="kicker"><Zap size={12} /> Learning Ops // Edge Lane</p>
              <h1 className="title-serif">The <em>Edge</em> Arc.</h1>
              <p className="title-sub">
                12 months. Past webhook relays into production edge AI infrastructure. Workers AI,
                Vectorize, D1, R2, AI Gateway, Durable Objects, Workflows, Queues. Five production
                deployments shipped. The "AI at the Edge" architecture guide published. Cloudflare
                AI added as a named capability on the Partner Network listing.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Target: <strong>5 production deployments</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Architecture guide · community</strong></div>
            </div>
          </div>

          <div className="cf-strip stagger">
            {CF_PRIMITIVES.map((s) => (
              <div key={s.name} className={`cf-item is-${s.type}`}>
                <div className="cf-label">{s.label}</div>
                <div className="cf-name">{s.name}</div>
                <div className="cf-sub">{s.sub}</div>
                <div className="cf-bar">
                  <div className="cf-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — edge runtime constraints are the operating principle, not friction.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Most cloud arcs assume ample CPU, persistent state, full Node.js runtime. Edge arcs
                invert that: limited CPU per request, no Node APIs, request-scoped lifecycle, eventual
                consistency on most storage. The practitioners who succeed at edge embrace those
                constraints as design principles. The ones who fight them rebuild centralized cloud
                patterns at the edge and lose the edge advantage entirely.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Sub-50ms response times globally that no centralized architecture can match — the latency advantage is real and measurable, not theoretical</li>
                    <li>Workers AI cost is often 30-60% lower than equivalent OpenAI/Anthropic calls — the cost advantage compounds at scale</li>
                    <li>You already use Workers — this arc has the lowest learning curve of the entire series, building on existing fluency rather than starting fresh</li>
                    <li>"AI at the edge" is a genuinely uncommon Partner Network capability — almost every competitor offers centralized cloud AI, very few offer edge AI</li>
                    <li>The five production deployments become the most demonstrable portfolio in the series — clients can experience them in 30 seconds rather than reading documentation</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>LOW load (3–4 hrs/week) but the cognitive overhead is moderate — edge constraints require constant awareness, not occasional</li>
                    <li>Workers AI model selection is narrower than Bedrock or Vertex AI — for cutting-edge models you still need OpenAI/Anthropic, which AI Gateway addresses but doesn\'t eliminate</li>
                    <li>Edge debugging is harder than centralized debugging because every PoP is its own runtime — observability investment from M1 is non-negotiable</li>
                    <li>Vectorize and Workflows are newer products with smaller communities than Pinecone or Temporal — finding answers requires more first-principles thinking and more time in the source code</li>
                  </ul>
                </div>
              </div>
              <div className="constraint-note">
                <strong>The rule that prevents the worst failure mode:</strong> if you find yourself
                wishing Workers had Node APIs, persistent processes, or unlimited CPU, you are
                designing the wrong architecture. Edge AI is not "centralized cloud but smaller" — it
                is a fundamentally different deployment model where statelessness, request-scoping,
                and global distribution are the design surface. The five production deployments in
                M10 should each exercise an edge-native pattern, not work around the edge model.
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
                          <div className="gate-label">Edge gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>This is the lowest-friction arc in the series for you specifically.</strong>{' '}
                You already use Cloudflare Workers. The mental model exists. M1-M2 are deepening
                rather than introducing. Most arcs require 2-3 weeks of "feeling slow" — this one
                should not. If it does, the scope is too aggressive — drop to slower pacing rather
                than push through.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Cost is dramatically lower than other AI arcs.</strong> Workers AI pricing
                is per-token at lower rates than OpenAI/Anthropic for comparable open-source models.
                Vectorize, D1, R2 all have generous free tiers. Realistic monthly cost for the arc:
                <code>$5-30/month</code> through Q1-Q3, <code>$20-80/month</code> in Q4 with five
                production deployments running. Set budget alerts but the financial pressure is
                meaningfully lower than GCP, Voice, or Full-Stack arcs.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Workers AI model selection is narrower than centralized AI providers.</strong>{' '}
                Llama, Mistral, BGE embeddings, Whisper — covers most use cases but not the latest
                Claude or GPT-5. AI Gateway in M3 addresses this by routing to Anthropic/OpenAI when
                needed, but you should not assume Workers AI alone covers every workload. The
                multi-provider architecture is the realistic production pattern.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Vectorize and Workflows are newer products with smaller communities.</strong>{' '}
                Pinecone, Qdrant, and Temporal have larger ecosystems. When you hit an unusual
                problem, the answer may not be on Stack Overflow. Plan for more first-principles
                thinking and more time in the Cloudflare source code than equivalent centralized
                products would require. The community presence work in M12 contributes to fixing
                that gap.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc cross-leverages three other arcs.</strong> The RAG arc M4-M6 work
                on chunking, embedding, and retrieval applies directly to Vectorize patterns. The
                Voice arc M6 transport and deployment patterns are simpler when running on Workers.
                The MCP Builder arc servers can be deployed as Workers for low-latency MCP. Run
                this arc alongside or after those for compounding leverage.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The five production deployments are the proof, not the published guide.</strong>{' '}
                The temptation will be to spend M11-M12 polishing the architecture guide before the
                deployments are bulletproof. Resist it. Five live, observable, debugged deployments
                are the credibility behind every claim in the guide. Without them, the guide is
                theory. With them, every claim is defensible because you have run it.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
