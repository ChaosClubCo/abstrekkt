import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Database } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month RAG & Data Arc
// Kyle-specific: Supabase pgvector as primary, Bitwarden migration KB as capstone
// Stack: Supabase, Claude API, n8n, Cloudflare Workers, Copilot Studio
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'EMBEDDINGS FIRST',
    subtitle: 'Understand the vector space before touching a database. Ship on Supabase pgvector. Master chunking.',
    months: [
      {
        n: 1,
        title: 'Embeddings — what they actually are',
        why: 'Most RAG tutorials tell you to call embed() and move on. If you do not understand what embeddings encode, why cosine similarity works, or what dimensionality means in practice — you will not know why your retrieval is failing or how to fix it.',
        weeks: [
          'Vector space and semantic similarity from first principles: what does it mean for two text chunks to be "close"? Build the intuition with toy examples and cosine similarity by hand before touching any API.',
          'Embedding model comparison on your own corpus: text-embedding-3-small, text-embedding-3-large, Gemini text-embedding-004, Voyage AI (Anthropic\'s recommended embedder). Same 200 chunks, same 20 queries. Measure quality, cost, and latency for each.',
          'Embed a real document set you use: the Bitwarden migration KB, The Prompt newsletter archive, or Intinc SOP documents. Store the embeddings in flat files first — no vector DB yet. Understand the raw representation.',
          'Semantic search without a database: cosine similarity in Python or JS, top-5 retrieval for 10 real queries from your corpus. Score the results honestly. This baseline becomes your benchmark for every improvement made in Q2 and Q3.',
        ],
        gate: 'A working embedding pipeline on a real document corpus. Semantic search returning results without a vector DB. Embedding model chosen with a documented rationale you could defend to a client.',
      },
      {
        n: 2,
        title: 'Supabase pgvector — your natural first vector DB',
        why: 'You already run Supabase. pgvector turns it into a vector database without adding a new system to your stack. Start here — not with Pinecone, not with a new hosted service. Build on infrastructure you already understand, own, and pay for.',
        weeks: [
          'pgvector setup in your existing Supabase instance: enable the extension, create your first vector column, run your first similarity query with the results you embedded in M1.',
          'Schema design for RAG: how do you store embeddings alongside source metadata (document ID, chunk index, source URL, created_at, content hash) so retrieval is fast and filterable? Write the migration.',
          'Index selection: ivfflat vs. hnsw on your data size and query pattern. Run both. Measure query latency at 10K, 50K, and 100K rows. Document the crossover point.',
          'First RAG-backed Claude agent: knowledge base in Supabase pgvector, retrieval in a Supabase function or Edge Function, generation in Claude. End to end, working, on the Bitwarden migration KB or equivalent real document set.',
        ],
        gate: 'A working RAG pipeline backed by Supabase pgvector. A Claude agent using it in production or staging. Retrieval latency at p95 measured and documented.',
      },
      {
        n: 3,
        title: 'Chunking — the factor that moves quality most',
        why: 'Chunking strategy determines retrieval quality more than any other single decision. Fixed-size is the default and it is often wrong. The right strategy depends on document structure, query patterns, and how your model uses retrieved context. Most RAG tutorials skip this almost entirely.',
        weeks: [
          'Fixed-size chunking baselines: 256, 512, and 1024 tokens with 10–20% overlap. Measure retrieval quality at each size on your corpus using the M1 query set. The number that surprises you is the one to investigate.',
          'Semantic chunking: split on meaning boundaries using an LLM or sentence transformer, not on token counts. More expensive, often better for narrative documents. Measure whether it beats your best fixed-size on your actual queries.',
          'Hierarchical (parent-child) chunking: embed small chunks (128–256 tokens) for retrieval precision, return larger parent chunks (512–1024 tokens) for generation context. The pattern that reduces fragmentation without losing recall.',
          'Chunking decision matrix: build the rule set you apply when a new document type arrives. Columns: document type (narrative / structured / code / table), query type (factual / exploratory / comparative), and the recommended strategy. This becomes your reusable reference artifact.',
        ],
        gate: 'Three chunking strategies benchmarked on the same corpus with the same 20 queries, scored by a consistent metric. A documented decision matrix for when to use each strategy.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'RETRIEVAL PATTERNS',
    subtitle: 'Hybrid search. Reranking. Advanced patterns for the queries basic RAG fails on.',
    months: [
      {
        n: 4,
        title: 'Hybrid search and metadata filtering',
        why: 'Similarity search alone fails on queries with specific entities, dates, product names, or structured facts. Hybrid search (dense + sparse) and metadata filtering close most of the gap between a demo RAG system and a production one.',
        weeks: [
          'Sparse retrieval: BM25 and keyword search as a complement to dense embeddings. Build a BM25 baseline on your corpus. Measure whether it beats semantic search on entity-heavy queries — it usually does.',
          'Hybrid search with Reciprocal Rank Fusion: merge dense and sparse result lists using RRF. Implement it from scratch before reaching for a library. Measure whether it beats either baseline alone on your query set.',
          'Metadata filtering: pre-filter before vector search by date range, document type, source, status, or any structured field. Build a retrieval function that accepts a filter object and applies it efficiently against your Supabase schema.',
          'Query analysis: build a classifier that routes queries to different retrieval strategies based on query type. Entity-heavy queries → hybrid with sparse boost. Abstract queries → dense only. Date-bounded queries → metadata filter first.',
        ],
        gate: 'A hybrid search pipeline (dense + BM25 + RRF) with metadata filtering. Benchmarked against pure similarity search on your real query set. Quality delta documented.',
      },
      {
        n: 5,
        title: 'Reranking — the improvement most people skip',
        why: 'Embedding similarity is a proxy for relevance, not relevance itself. A cross-encoder reranker scores query-chunk pairs directly and consistently improves end-to-end answer quality. It is slower and more expensive — but the quality delta justifies the cost in almost every production deployment.',
        weeks: [
          'Bi-encoder vs. cross-encoder architecture: why embedders (bi-encoders) are fast but approximate, and why rerankers (cross-encoders) are slower but more accurate. The quality/latency tradeoff in plain terms.',
          'Cohere Rerank and Voyage Rerank: API setup, latency at different top-k values (retrieve top-20, rerank to top-5 vs. top-3), cost per query. Run both on your query set.',
          'Two-stage pipeline: retrieval (fast, high recall, top-20) → reranking (slow, high precision, top-5) → generation. Build it. Measure end-to-end latency. Verify it fits your latency budget from M2.',
          'LLM-as-judge evaluation: score 50 answers with and without reranking using Claude as judge. Document the quality delta. If reranking does not improve scores on your corpus, investigate why — the answer is usually in the chunking.',
        ],
        gate: 'A two-stage retrieval pipeline with reranking. Quality improvement measured over pure similarity search on at least 50 real queries, scored by LLM-as-judge.',
      },
      {
        n: 6,
        title: 'Advanced retrieval — HyDE, multi-query, compression',
        why: 'These are not exotic techniques — they are the patterns you reach for when basic RAG returns the wrong chunks on well-formed queries. Knowing when each helps and when each hurts is the practitioner skill that separates you from someone who just followed a tutorial.',
        weeks: [
          'HyDE (Hypothetical Document Embeddings): generate a hypothetical perfect-answer document, embed it, retrieve by that embedding instead of the raw query. Test on abstract and exploratory queries. Measure whether it helps on your corpus.',
          'Multi-query retrieval: generate 3–5 reformulations of the user query using Claude, retrieve for each, deduplicate with RRF. More expensive, more robust on ambiguous queries. Measure cost overhead vs. quality gain.',
          'Contextual compression: after retrieval, use Claude to extract only the query-relevant sentences from each chunk before passing to generation. Reduces context window noise. Measure whether it improves faithfulness scores.',
          'Configurable retrieval module: one function, strategy selectable by config flag (base / hybrid / HyDE / multi-query / compressed). Every pipeline from this month forward uses this module. Standardize the interface.',
        ],
        gate: 'A configurable retrieval module with at least four selectable strategies. Strategy selection documented with the query types each strategy is best suited for.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'PRODUCTION RAG',
    subtitle: 'Evaluation harness. Latency and cost budgets. Cross-modal and multi-vector retrieval.',
    months: [
      {
        n: 7,
        title: 'Evaluation — RAG quality measured end to end',
        why: 'Without evaluation, every pipeline change is a guess. RAG eval has two distinct measurement problems: retrieval quality (did you find the right chunks?) and generation quality (did the model use them faithfully?). Both require separate metrics and different golden datasets.',
        weeks: [
          'Retrieval metrics from scratch: precision@k, recall@k, Mean Reciprocal Rank, NDCG. Build a golden dataset of (query, expected chunk IDs) from 50 real queries against your corpus. Score your current best pipeline.',
          'Generation metrics: faithfulness (is the answer grounded in the retrieved context?), answer relevance (does it address the query?), context utilization (did it actually use the chunks?). LLM-as-judge rubric for each.',
          'RAGAs or ARES: pick one evaluation framework, implement it on your production pipeline, and run a full sweep across your golden dataset. Document the baseline scores.',
          'CI regression suite: a test set that runs automatically on every pipeline change — chunking config, retrieval strategy, model swap — and flags quality regressions before they reach production. The RAG equivalent of a test suite.',
        ],
        gate: 'An end-to-end RAG evaluation pipeline with a golden dataset, automated regression tests, and baseline scores documented for every pipeline variant built so far.',
      },
      {
        n: 8,
        title: 'Production patterns — latency, cost, freshness',
        why: 'A RAG system that works in a notebook is not a RAG system. Production means SLA-defensible latency, cost telemetry per query, document freshness tracking, and graceful degradation that does not hallucinate when retrieval fails.',
        weeks: [
          'Latency profiling per stage: embed query → retrieve (DB query) → rerank → generate. Where is the time going? What is the p50 and p95 for each stage? Which stage has the most variance?',
          'Cost modeling per query: embedding tokens + vector DB queries + reranker API calls + generation tokens. Build a spreadsheet defensible to Daniel for any deployment decision. Cost at 100, 1K, 10K queries per day.',
          'Document freshness: how do you detect when a source document changes and a stored chunk is stale? Change detection triggers, re-embedding queues, and content hash comparison in Supabase.',
          'Graceful degradation: what does your agent return when retrieval confidence is low? Explicit "I did not find enough context" responses beat hallucinated confident answers. Build the fallback. Test it deliberately.',
        ],
        gate: 'A production-readiness checklist for your RAG pipeline: latency p95 measured, cost per query modeled, freshness monitoring live, degradation path tested and documented.',
      },
      {
        n: 9,
        title: 'Cross-modal and multi-vector retrieval',
        why: 'Most RAG systems embed plain text. Your real document corpus — Intinc SOPs, migration KB, newsletter archives — includes tables, structured data, and sometimes images. Single-vector text search handles these badly. Cross-modal retrieval is where the next quality gains are.',
        weeks: [
          'Table retrieval: how do you embed and retrieve structured records, spreadsheet rows, or database tables? Text serialization strategies (row-as-sentence, column headers as context) vs. structured query hybrid approaches.',
          'Multi-vector retrieval (ColBERT / late interaction models): embed queries and documents into multiple token-level vectors instead of one chunk-level vector. When it outperforms single-vector and at what latency and cost.',
          'Image retrieval (CLIP-style): multimodal embeddings for document screenshots, diagrams, and images. Experimental in most stacks but directionally important. Build a minimal prototype.',
          'Pick the one cross-modal type most relevant to your actual corpus — likely tables or structured records from Supabase — and build a production retrieval path for it. Benchmark against text-only retrieval.',
        ],
        gate: 'A working retrieval pipeline for at least one non-text document type from your real corpus. Benchmarked against text-only on the same queries.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'CAPSTONE + TEACH',
    subtitle: 'Production system shipped. Provider comparison published. The RAG playbook in the world.',
    months: [
      {
        n: 10,
        title: 'Capstone — upgrade the Bitwarden migration agent',
        why: 'Everything before this was practice. The capstone is a real system with real users and real consequences if retrieval fails. The Bitwarden migration agent is the natural target — it has a knowledge base, real queries from staff, and a measurable success condition: does the agent return the right migration step?',
        weeks: [
          'Audit the current migration agent retrieval layer. What is the existing chunking strategy, retrieval method, and (if any) evaluation baseline? Document the pre-capstone state honestly.',
          'Rebuild the retrieval layer: hybrid search on the migration KB, parent-child chunking for the longer procedural documents, reranking before generation. Apply every pattern from Q1–Q3 that is appropriate.',
          'Instrument and deploy: p95 latency, cost per query, retrieval quality score from the evaluation harness. Measure the pre/post delta explicitly.',
          'Architecture Decision Record: why these chunking, retrieval, and reranking choices for this specific corpus and query distribution? What would v3 look like? Published alongside the deployment.',
        ],
        gate: 'The upgraded migration agent in production with measured retrieval quality improvement over the pre-capstone baseline. ADR published. Real users using it.',
      },
      {
        n: 11,
        title: 'Vector DB comparison — the honest benchmark',
        why: 'You have built your RAG skills on Supabase pgvector. You now need to know when to recommend a different vector DB and how to defend that recommendation to a client who is already paying for something else.',
        weeks: [
          'Pinecone: setup, indexing, query patterns, managed namespace model, cost at three scale tiers. Run your M1 benchmark corpus through it. Compare to pgvector on latency, quality, and cost.',
          'Qdrant: self-hosted or cloud, payload filtering, named vectors, on-disk indexes for large corpora. Run the same benchmark. What does it do better than pgvector and at what operational cost?',
          'Weaviate and brief coverage of Chroma, LanceDB, and Milvus: not deep dives — enough to place each on the decision matrix.',
          'Publish the comparison: "Which vector database for which problem?" — a practitioner guide built from your own benchmarks, not from vendor documentation. The decision matrix, the benchmark data, your honest recommendation.',
        ],
        gate: 'A published vector database comparison built from your own benchmark data. A decision matrix you would use in a real client engagement.',
      },
      {
        n: 12,
        title: 'Teach the knowledge layer and close the arc',
        why: 'Twelve months of applied knowledge: embeddings, chunking, hybrid search, reranking, HyDE, multi-query, evaluation, production patterns, cross-modal retrieval, and a live capstone. You do not own this until you have transferred it to someone who did not already know it.',
        weeks: [
          'Workshop at CLC, Intinc, or a Community Ambassador event: "Knowledge layers for AI engineers." Hands-on: the chunking decision matrix, a live retrieval quality comparison, and the cost-per-query spreadsheet from M8.',
          'Publish the complete RAG practitioner guide: embeddings → chunking → hybrid search → reranking → evaluation → production → cross-modal. Every pattern you actually shipped. Real numbers, real tradeoffs.',
          'Update Partner Network profile, LinkedIn, and the AIaaS capability brief: link the capstone ADR, the vector DB comparison, and the playbook. "RAG-backed deployments" as a named service SKU.',
          'Retrospective: what surprised you most about where RAG fails in practice? Was it chunking, reranking, or evaluation that moved quality most on your actual corpus? What is Y2 — GraphRAG, agentic RAG, or pivot to the broader data engineering layer?',
        ],
        gate: 'Workshop delivered. Playbook published. Three practitioners are using your chunking decision matrix. The migration agent retrieval quality is measurably better than it was in M1.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KNOWLEDGE STACK — 5 RAG competency layers
// ---------------------------------------------------------------------------
const STACK_LAYERS = [
  { label: 'Layer 1', name: 'Embeddings', phase: 'Q1',    quarter: 'M1–M2', fill: 100 },
  { label: 'Layer 2', name: 'Chunking',   phase: 'Q1',    quarter: 'M3',    fill: 75  },
  { label: 'Layer 3', name: 'Retrieval',  phase: 'Q2',    quarter: 'M4–M6', fill: 50  },
  { label: 'Layer 4', name: 'Evaluation', phase: 'Q3',    quarter: 'M7',    fill: 25  },
  { label: 'Layer 5', name: 'Production', phase: 'Q3–Q4', quarter: 'M8–M10', fill: 8  },
];

// ---------------------------------------------------------------------------
// STYLES — RAG & Data Arc / deep teal on near-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #050e0d;
  --bg-2:         #0b1614;
  --fg:           #e2f4f2;
  --fg-dim:       #7ab0aa;
  --accent:       #14b8a6;
  --accent-2:     #2dd4bf;
  --gate:         #f59e0b;
  --muted:        #3a6660;
  --card:         #0e1917;
  --border:       #1a2e2c;
  --border-bright:#274442;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,184,166,0.09), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(245,158,11,0.05), transparent 65%),
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
  color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub {
  font-size: 13px;
  color: var(--fg-dim);
  margin: 16px 0 0;
  max-width: 54ch;
}
.meta {
  text-align: right;
  font-size: 11px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.meta strong { color: var(--accent); font-weight: 500; }

/* ---- KNOWLEDGE STACK STRIP ---- */
.stack-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  margin-bottom: 48px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.stack-layer {
  padding: 16px 16px 20px;
  border-right: 1px solid var(--border);
  position: relative;
}
.stack-layer:last-child { border-right: none; }
.layer-label {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 5px;
}
.layer-name {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  line-height: 1.2;
  color: var(--accent);
  font-weight: 400;
  margin-bottom: 3px;
}
.layer-phase {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 2px;
}
.layer-quarter {
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(20,184,166,0.6);
  text-transform: uppercase;
}
.layer-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--border);
}
.layer-bar-fill {
  height: 100%;
  background: var(--accent);
  opacity: 0.8;
}

/* ---- TRADEOFF ---- */
.tradeoff {
  border: 1px solid var(--accent);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(20,184,166,0.07), rgba(20,184,166,0.01));
  padding: 20px 24px;
  margin-bottom: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--accent);
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

/* ---- QUARTER TABS ---- */
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
.qtab:hover  { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before {
  content: '';
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
}
.qtab-num   { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.1;
  margin: 6px 0 4px;
  color: inherit;
  font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

/* ---- MONTHS ---- */
.months { display: grid; gap: 16px; }
.month {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 0.2s;
}
.month:hover { border-color: var(--border-bright); }
.month.open  { border-color: var(--accent); }

.month-head {
  padding: 20px 24px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
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
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why   { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev  { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner {
  padding: 4px 24px 24px;
  border-top: 1px dashed var(--border);
  margin-top: 4px;
}

/* ---- WEEKS ---- */
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 10px 12px;
  background: var(--bg-2);
  border-left: 2px solid var(--border-bright);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(20,184,166,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(20,184,166,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* ---- GATE — amber = knowledge grounded ---- */
.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(245,158,11,0.35);
  background: rgba(245,158,11,0.04);
  align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--gate);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

/* ---- PROGRESS ---- */
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
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

/* ---- CLAIMS ---- */
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
.claims code { color: var(--accent-2); background: rgba(20,184,166,0.1); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }
.stagger > *:nth-child(4) { animation-delay: 0.22s; }
.stagger > *:nth-child(5) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid   { grid-template-columns: 1fr; }
  .meta          { text-align: left; }
  .stack-strip   { grid-template-columns: 1fr 1fr; }
  .stack-layer:nth-child(2) { border-right: none; }
  .stack-layer:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
  .tradeoff-grid { grid-template-columns: 1fr; }
  .quarter-rail  { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .month-head    { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; }
  .month-num     { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function RAGDataArc() {
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
              <p className="kicker"><Database size={12} /> Learning Ops // Knowledge Layer</p>
              <h1 className="title-serif">The <em>RAG &amp; Data</em> Arc.</h1>
              <p className="title-sub">
                12 months. The knowledge layer underneath every agent you have ever shipped.
                Embeddings, chunking strategy, hybrid search, reranking, cross-modal retrieval,
                and production evaluation — all applied to your real stack, with the Bitwarden
                migration KB as the capstone target.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Primary DB: <strong>Supabase pgvector</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Migration KB upgraded, M10</strong></div>
            </div>
          </div>

          {/* KNOWLEDGE STACK STRIP */}
          <div className="stack-strip stagger">
            {STACK_LAYERS.map((layer) => (
              <div key={layer.name} className="stack-layer">
                <div className="layer-label">{layer.label}</div>
                <div className="layer-name">{layer.name}</div>
                <div className="layer-phase">{layer.phase}</div>
                <div className="layer-quarter">{layer.quarter}</div>
                <div className="layer-bar">
                  <div className="layer-bar-fill" style={{ width: `${layer.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — this arc fixes a silent quality ceiling on everything you have already built.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Every agent you have shipped that retrieves information has a retrieval layer. Most of
                those layers are fragile and uneval'd. This arc fixes that — but it is infrastructure
                work, not visible feature work. The improvements compound invisibly unless you instrument
                and measure them.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Retrieval quality improvements compound across every agent you have ever shipped</li>
                    <li>Chunking and hybrid search expertise is rare — most practitioners skip both</li>
                    <li>Supabase pgvector as a primary vector DB is a defensible cost story for enterprise clients</li>
                    <li>Evaluation harness from M7 applies to every future RAG deployment — one build, permanent reuse</li>
                    <li>The vector DB comparison (M11) becomes a Partner Network artifact and a client deliverable</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>3–5 hrs/week of infrastructure and measurement work with less visible output than building features</li>
                    <li>Chunking and retrieval benchmarking is iterative and slow — quality gains are incremental, not step-change</li>
                    <li>No cert target in this arc — the credential is the published capstone and comparison, not an exam</li>
                    <li>Cross-modal retrieval (M9) is partially experimental — production payoff depends on your actual document types</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Where this arc compounds hardest:</strong> pair it with
                the Claude arc's multi-agent work. Agents that retrieve well are categorically better than agents
                that hallucinate. The evaluation harness from M7 also plugs directly into the Claude arc's eval
                discipline from its M8 month — build it once, use it across both arcs.
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
                          <div className="gate-label">Knowledge gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>Supabase pgvector is the right starting point — with a ceiling.</strong> At
                under ~1M vectors with moderate query load, pgvector is cost-effective and operationally simple. Above that scale,
                or with high-concurrency retrieval workloads, dedicated vector DBs (Qdrant, Pinecone) become worth their overhead.
                M11 tells you exactly where that line is for your actual usage patterns.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The M1 semantic search baseline is not optional.</strong> Every quality
                improvement in Q2 and Q3 is measured against this baseline. If you skip it and go straight to pgvector in M2,
                you lose the ability to attribute quality gains to specific changes. Do the baseline measurement first.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Chunking (M3) is where most quality gains actually live.</strong> The literature
                and your own benchmarks will likely confirm: chunking strategy moves retrieval quality more than embedding model choice
                or retrieval algorithm. If the arc compresses, protect M3. Everything after it depends on it.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The Bitwarden migration KB as capstone assumes it stays active.</strong> If the
                migration completes before M10, pick the next real document corpus with real queries — The Prompt newsletter archive,
                Intinc SOP documents, or the FlashFusion client knowledge base. The capstone criteria is: real users, real queries,
                measurable quality before and after.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Reranker APIs (Cohere, Voyage) add cost and latency.</strong> Model the full
                pipeline cost in M5 before committing to reranking in production. The quality improvement is real — but if your
                latency budget is under 500ms end-to-end, reranking may not fit without optimization.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>No cert target in this arc.</strong> The credential is the published capstone ADR,
                the vector DB comparison, and the retrieval playbook — all indexed and linkable. If a formal certification matters for
                a specific opportunity, the closest path is <code>Google Professional ML Engineer</code> (from the Gemini arc) which
                covers embeddings and retrieval at the ML level.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
