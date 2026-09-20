import { useState } from "react";
import { ChevronRight, Compass, Database, Eye, Sliders, Shield, GitMerge, Activity, FileText } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 3 — Production depth, new modalities, ops discipline, business plumbing
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'rag',
    Icon: Database,
    title: 'The RAG & Knowledge Systems Arc',
    titleEm: 'Knowledge',
    lane: 'Pinecone · pgvector · hybrid search · reranking',
    accent: '#06b6d4',
    accentDim: 'rgba(6,182,212,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No official cert — depth-based',
    why:
      "Your agents retrieve. None of them retrieve well. The gap between a demo RAG pipeline and a production one is chunking strategy, embedding model selection, hybrid BM25+vector search, metadata filtering, and reranker layers. You've shipped RAG on top of n8n and LangChain but haven't systematized the quality evaluation loop or the architecture decisions. This arc makes retrieval a discipline: Pinecone or Weaviate, pgvector for Supabase-native patterns, LlamaIndex retrieval chains, RAGAS for evaluation. Every future agent you ship becomes smarter as a direct result.",
    capstone:
      "A production RAG system with measured retrieval precision and recall. A published 'RAG decision tree' — when to use dense vs. sparse vs. hybrid vs. reranker — that becomes the most-linked artifact in your consulting portfolio. Every future agent you ship runs on this system.",
    buildPrompt: 'Build The RAG & Knowledge Systems Arc — Pinecone, pgvector, hybrid search, reranking, RAGAS evaluation',
  },
  {
    id: 'multimodal',
    Icon: Eye,
    title: 'The Multimodal AI Arc',
    titleEm: 'Multimodal',
    lane: 'Vision · document AI · image understanding · OCR pipelines',
    accent: '#14b8a6',
    accentDim: 'rgba(20,184,166,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No official cert — shipped pipeline',
    why:
      "Every enterprise client has documents. PDFs, scanned forms, screenshots, invoices, contracts. The ability to ingest visual documents — not just text — is becoming a baseline expectation for AI consultants. GPT-4V, Claude Vision, Gemini Pro Vision, Azure Document Intelligence, and Tesseract-based OCR pipelines handle different parts of this problem. The unlock is knowing which tool for which document type at which cost point. FlashFusion's service catalog and Intinc client workflows both have immediate multimodal use cases sitting unused.",
    capstone:
      "A document intelligence pipeline that ingests mixed-format enterprise documents (PDF, image, screenshot) and returns structured data. A 'multimodal tool selection guide' — which vision model for which document type, with cost benchmarks. A deployed Intinc use case as the proof artifact that closes the capability question.",
    buildPrompt: 'Build The Multimodal AI Arc — vision, document intelligence, OCR pipelines, cost benchmarks',
  },
  {
    id: 'finetune',
    Icon: Sliders,
    title: 'The Fine-Tuning & Model Customization Arc',
    titleEm: 'Fine-Tuning',
    lane: 'LoRA · QLoRA · OpenAI fine-tuning · Hugging Face',
    accent: '#f97316',
    accentDim: 'rgba(249,115,22,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'Hugging Face NLP Course (optional depth)',
    why:
      "Prompting has a ceiling. For clients with proprietary terminology, specialized workflows, or latency and cost constraints that make GPT-4 impractical, fine-tuning is the answer — not a bigger system prompt. This arc covers OpenAI's fine-tuning API for production-grade custom models, LoRA and QLoRA for open-weight models on constrained hardware, dataset curation and quality standards, and the evaluation protocol that tells you when fine-tuning actually helped vs. when prompt engineering would have been cheaper. The inflection point where you stop working within the model and start shaping it.",
    capstone:
      "A fine-tuned model deployed on a real use case — Intinc ticket classification or FlashFusion client intent detection. A published 'fine-tuning decision framework' — when prompting is enough vs. when fine-tuning earns its cost. The capability that separates prompt engineers from model engineers in a client conversation.",
    buildPrompt: 'Build The Fine-Tuning & Model Customization Arc — LoRA, QLoRA, OpenAI fine-tuning API, dataset curation, eval',
  },
  {
    id: 'aisec',
    Icon: Shield,
    title: 'The AI Security & Red-Teaming Arc',
    titleEm: 'Red-Teaming',
    lane: 'OWASP LLM Top 10 · prompt injection · adversarial eval',
    accent: '#ef4444',
    accentDim: 'rgba(239,68,68,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — published red-team report',
    why:
      "You've been building security-aware systems. This arc makes AI security a named, billable capability. OWASP LLM Top 10 applied to your actual agent stack — not to a theoretical one. Prompt injection and jailbreak taxonomy documented. Adversarial eval integrated into your CI/CD pipeline. Data exfiltration patterns in RAG systems understood and mitigated. Enterprise clients are starting to require AI security documentation as part of procurement. This arc makes you the person who can produce it, and who can audit someone else's stack for it.",
    capstone:
      "A red-team report on one of your production agents — real vulnerabilities found and patched, not theoretical. A published 'AI security checklist' mapped to OWASP LLM Top 10. The artifact that lets Intinc lead the 'secure AI deployment' conversation with enterprise clients rather than answer questions about it.",
    buildPrompt: 'Build The AI Security & Red-Teaming Arc — OWASP LLM Top 10, prompt injection, adversarial eval, CI/CD security gates',
  },
  {
    id: 'dataeng',
    Icon: GitMerge,
    title: 'The Data Engineering for AI Arc',
    titleEm: 'Data',
    lane: 'dbt · Airflow · feature stores · ETL for AI',
    accent: '#3b82f6',
    accentDim: 'rgba(59,130,246,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'dbt Fundamentals (free cert)',
    why:
      "Every production AI system is downstream of a data pipeline. Your agents run on retrieved context, webhook payloads, and manually curated test sets — none of it is systematically governed, versioned, or monitored. This arc covers the plumbing: dbt for data transformation and lineage, Airflow or Prefect for orchestration, feature stores for ML feature management, data quality with Great Expectations. The gap between 'my agent works in dev' and 'my agent works reliably in prod' is almost always a data engineering gap — not a model gap and not a prompt gap.",
    capstone:
      "A dbt project with documented lineage running against your Supabase data. An Airflow or Prefect pipeline orchestrating a real AI workload. A 'data contract template for AI systems' — the thing enterprise clients need before they can trust production AI outputs. The infrastructure that makes every downstream agent more reliable.",
    buildPrompt: 'Build The Data Engineering for AI Arc — dbt, Airflow/Prefect, feature stores, data contracts, Great Expectations',
  },
  {
    id: 'mlops',
    Icon: Activity,
    title: 'The LLM Observability & MLOps Arc',
    titleEm: 'Observability',
    lane: 'LangSmith · cost monitoring · drift detection · prod ops',
    accent: '#22c55e',
    accentDim: 'rgba(34,197,94,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — instrumented production system',
    why:
      "You have agents in production that you cannot fully see. Token costs accumulate without attribution. Prompt drift happens silently when model versions update. Quality regressions surface in user feedback, not in monitoring dashboards. This arc makes your production AI stack observable: LangSmith traces across every agent, token cost attribution by workflow and client, latency histograms that catch degradation before users notice it, alert thresholds that page you before clients do. The operational discipline that makes AI consulting defensible as a managed service and not just a best-effort engagement.",
    capstone:
      "Full LangSmith instrumentation across your critical agent stack. A cost dashboard attributing token spend by client, workflow, and model. An alerting runbook that catches the three most common production failure modes before users report them. The ops layer that lets you SLA-back your AI services and charge retainer rates with confidence.",
    buildPrompt: 'Build The LLM Observability & MLOps Arc — LangSmith, token cost attribution, drift detection, prod alerting runbook',
  },
  {
    id: 'consulting',
    Icon: FileText,
    title: 'The Consulting Infrastructure Arc',
    titleEm: 'Infrastructure',
    lane: 'SOW templates · pricing models · legal · CRM',
    accent: '#94a3b8',
    accentDim: 'rgba(148,163,184,0.10)',
    load: 'LOW',
    horizon: '6 mo',
    cert: 'No cert — business infrastructure',
    why:
      "You are consulting on AI. The professional infrastructure around that — Statement of Work templates for agentic projects, pricing models for retainer vs. milestone vs. outcome-based engagements, IP ownership clauses for AI-generated work, data processing agreements for clients with sensitive data, a CRM that doesn't live in your head — is not optional past a certain revenue threshold. Without it, every new engagement starts from scratch and every contract negotiation invents new risk. This arc builds the paper stack that turns individual consulting into a repeatable practice.",
    capstone:
      "A complete consulting kit: SOW template for agentic AI projects, IP and data ownership addendum, pricing model decision tree, and a lightweight CRM workflow. The infrastructure that makes FlashFusion a practice with repeatable margins — not a freelance operation that reinvents itself per client.",
    buildPrompt: 'Build The Consulting Infrastructure Arc — SOW templates, pricing models, IP/data agreements, CRM workflow',
  },
];

// ---------------------------------------------------------------------------
// STYLES (identical token system as Series 2)
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0a0e12;
  --bg-2:         #101620;
  --fg:           #e2e8ec;
  --fg-dim:       #7a8a98;
  --fg-mute:      #4a5560;
  --card:         #0f1620;
  --border:       #1a2330;
  --border-bright:#2a3850;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(125,148,180,0.06), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 40px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--fg-dim); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(40px, 5.6vw, 68px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 58ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.card {
  background: var(--card); border: 1px solid var(--border);
  border-left: 3px solid var(--card-accent);
  cursor: pointer; transition: border-color 0.2s, transform 0.15s;
  position: relative;
}
.card:hover { border-color: var(--border-bright); border-left-color: var(--card-accent); transform: translateY(-1px); }
.card.open  { border-color: var(--card-accent); }

.card-head {
  padding: 18px 20px; display: grid;
  grid-template-columns: 36px 1fr auto; gap: 14px; align-items: center;
}
.card-icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--card-accent-dim); color: var(--card-accent);
  border: 1px solid var(--card-accent-dim);
}
.card-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; line-height: 1.15; font-weight: 400; margin: 0 0 3px;
  color: var(--fg);
}
.card-title em { color: var(--card-accent); font-style: italic; }
.card-lane {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--fg-dim);
}
.card-chev { color: var(--fg-mute); transition: transform 0.25s, color 0.2s; }
.card.open .card-chev { transform: rotate(90deg); color: var(--card-accent); }

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.card.open .card-body { max-height: 800px; }
.card-body-inner {
  padding: 4px 20px 18px; border-top: 1px dashed var(--border); margin-top: 4px;
}
.why { font-size: 12.5px; color: var(--fg); line-height: 1.65; margin: 14px 0 16px; }
.capstone-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--card-accent); margin-bottom: 5px;
}
.capstone {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 13.5px; color: var(--fg); line-height: 1.5; margin: 0 0 16px;
}
.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.pill {
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 4px 8px; border: 1px solid var(--border-bright); color: var(--fg-dim);
}
.pill.cert { border-color: var(--card-accent-dim); color: var(--card-accent); background: var(--card-accent-dim); }
.build-cta {
  display: block; width: 100%; padding: 12px 14px; background: transparent;
  border: 1px solid var(--card-accent); color: var(--card-accent);
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.build-cta:hover { background: var(--card-accent); color: var(--bg); }
.prompt-readout {
  margin-top: 8px; padding: 10px 12px;
  background: var(--bg-2); border: 1px dashed var(--border-bright);
  font-size: 11px; color: var(--fg-dim); line-height: 1.45; font-style: italic;
}
.prompt-readout strong { color: var(--fg); font-weight: 500; font-style: normal; }

.note {
  margin-top: 36px; padding: 18px 20px;
  border: 1px solid var(--border); background: var(--bg-2);
  font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.note h4 {
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg); margin: 0 0 10px; display: flex; align-items: center; gap: 6px;
}
.note ul { margin: 6px 0 0; padding-left: 18px; }
.note li { margin-bottom: 5px; }
.note strong { color: var(--fg); font-weight: 500; }

@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.5s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.08s; }
.stagger > *:nth-child(3) { animation-delay: 0.12s; }
.stagger > *:nth-child(4) { animation-delay: 0.16s; }
.stagger > *:nth-child(5) { animation-delay: 0.20s; }
.stagger > *:nth-child(6) { animation-delay: 0.24s; }
.stagger > *:nth-child(7) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .cards { grid-template-columns: 1fr; }
  .card-head { padding: 16px; }
  .card-title { font-size: 19px; }
  .card-body-inner { padding: 4px 16px 16px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function Series3Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Three</p>
              <h1 className="title-serif">The <em>production</em> layer.</h1>
              <p className="title-sub">
                Two infrastructure-to-production upgrades, two capability expansions
                into modalities you haven't systematized, two operational disciplines
                that make deployed agents defensible, and the business plumbing that
                makes consulting repeatable past the first few engagements.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>03 of N</strong></div>
              <div style={{ marginTop: 4 }}>Total candidates: <strong>7</strong></div>
              <div style={{ marginTop: 4 }}>Tap a card to expand</div>
            </div>
          </div>

          <div className="cards stagger">
            {ARCS.map((arc, i) => {
              const isOpen = open === i;
              const Icon = arc.Icon;
              const cardStyle = {
                ['--card-accent']: arc.accent,
                ['--card-accent-dim']: arc.accentDim,
              };
              const titleParts = arc.title.split(arc.titleEm);

              return (
                <div
                  key={arc.id}
                  className={`card ${isOpen ? 'open' : ''}`}
                  style={cardStyle}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="card-head">
                    <div className="card-icon">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="card-title">
                        {titleParts[0]}<em>{arc.titleEm}</em>{titleParts[1]}
                      </h3>
                      <div className="card-lane">{arc.lane}</div>
                    </div>
                    <ChevronRight className="card-chev" size={18} />
                  </div>

                  <div className="card-body">
                    <div className="card-body-inner">
                      <p className="why">{arc.why}</p>
                      <div className="capstone-label">Capstone output</div>
                      <p className="capstone">{arc.capstone}</p>
                      <div className="meta-row">
                        <span className="pill">Load: {arc.load}</span>
                        <span className="pill">{arc.horizon}</span>
                        <span className="pill cert">{arc.cert}</span>
                      </div>
                      <button
                        className="build-cta"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard?.writeText(arc.buildPrompt);
                        }}
                      >
                        Copy build prompt →
                      </button>
                      <div className="prompt-readout">
                        <strong>Prompt:</strong> {arc.buildPrompt}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="note">
            <h4><Compass size={11} /> Sequencing notes</h4>
            <ul>
              <li>
                <strong>RAG and MLOps are immediate-value arcs.</strong> Both upgrade
                agents already in production without requiring net-new infrastructure.
                Run them first or alongside whatever technical arc is already active.
              </li>
              <li>
                <strong>Two HIGHs again — don't stack them.</strong> Fine-Tuning and
                Data Engineering are both 12-month HIGH-load arcs. Treat them as
                sequential choices, not parallel ones.
              </li>
              <li>
                <strong>AI Security pairs with any arc that ships production code.</strong>{' '}
                Red-teaming is a lens, not a standalone track. Run it alongside
                whatever you're deploying — RAG, fine-tuned models, voice agents.
              </li>
              <li>
                <strong>Consulting Infrastructure is the lowest-effort, highest-leverage arc in this series.</strong>{' '}
                Six months, LOW load, no cert required. The business infrastructure
                it produces unlocks better pricing on every engagement that follows.
                There is no good argument for deferring it past Q3.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
