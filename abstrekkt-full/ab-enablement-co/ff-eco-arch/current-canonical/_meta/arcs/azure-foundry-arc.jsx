import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Server } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Azure AI Foundry Arc
// Kyle-specific: Copilot Studio is the surface, Foundry is the engineering layer
// beneath it. Azure OpenAI, Prompt Flow, Azure ML, AI Search, Semantic Kernel.
// The arc that turns "Copilot Studio implementer" into "Microsoft AI engineer."
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDRY FOUNDATIONS',
    subtitle: 'Azure resource fluency, AI Foundry Hub setup, Azure OpenAI Service mastered as the engine.',
    months: [
      {
        n: 1,
        title: 'Azure resource model — past the Copilot Studio surface',
        why: 'Copilot Studio hides the underlying Azure infrastructure from you. Every Copilot you have built sits on resources you may not have managed directly — App Registrations, managed identities, Key Vaults, Log Analytics workspaces. M1 is the resource layer made explicit. Without this, every later month sits on assumptions you cannot defend in a client architecture conversation.',
        weeks: [
          'Azure CLI and Bicep fundamentals: az login, subscription selection, resource group structure, the Bicep DSL for infrastructure-as-code. Most production Azure work is Bicep, not ARM JSON, not Portal clicks. Build a Bicep template that provisions a resource group, Key Vault, and storage account.',
          'Entra ID + RBAC + managed identities: the auth layer underneath everything. App Registrations vs Service Principals vs Managed Identities — when each is right, what permissions are required for which Foundry operations. The "principle of least privilege" applied to AI workloads.',
          'Key Vault, App Configuration, and secrets discipline: the proper home for API keys, connection strings, model endpoints. Practice the workflow: store a secret, retrieve it from a Function, rotate it, revoke it. Most Copilot Studio integrations leak secrets in custom connectors — fix that pattern now.',
          'Networking baseline: VNets, private endpoints, the "all Azure traffic should travel private network" pattern that enterprise clients require. Most AI Foundry deployments in regulated industries are private-endpoint-only. Document the network architecture before building on it.',
        ],
        gate: 'A Bicep-deployed Azure baseline: resource group, Key Vault, Log Analytics, private VNet. Entra ID auth working with managed identity. The infrastructure foundation that every later Foundry resource will sit on.',
      },
      {
        n: 2,
        title: 'AI Foundry Hub + Project — the Foundry control plane',
        why: 'Azure AI Foundry (formerly Azure AI Studio) is the unified workspace for Azure OpenAI, Azure ML, AI Search, content safety, and evaluations. The Hub is the org-level container; Projects are the workspaces inside. M2 is setting up the Foundry workspace properly so the next 10 months build on a clean foundation, not a Portal-clicked mess.',
        weeks: [
          'AI Foundry Hub creation via Bicep: the proper way, not the Portal way. Hub configuration, storage account binding, Key Vault binding, container registry binding, Application Insights binding. The five resources every Hub depends on, all provisioned together.',
          'Project structure: one Project per use case vs. one Project for everything. The decision tree based on team size, compliance requirements, and resource separation needs. Build one Project for general-purpose work and one for a regulated-data use case.',
          'Connections and credentials: connecting Azure OpenAI, AI Search, and storage to your Project. The managed-identity-based connection pattern (preferred) vs. API key (lazy, leaky). Practice both, document why one is right.',
          'Compute resources: serverless compute for prototyping, compute instances for development, compute clusters for training. The cost model differs significantly per pattern. Spin one up, run a job, shut it down. Verify the cost in the billing dashboard.',
        ],
        gate: 'An AI Foundry Hub deployed via Bicep with two Projects, managed-identity connections to Azure OpenAI and AI Search, and at least one compute resource lifecycle exercised (create, use, shut down). The workspace is production-grade, not Portal-tinkered.',
      },
      {
        n: 3,
        title: 'Azure OpenAI Service — the engine underneath Copilot Studio',
        why: 'Every Copilot you have built calls Azure OpenAI Service underneath. M3 is the direct access to that service — your own deployments, your own model selection, your own quota management. This is where you stop being a Copilot user and start being an AOAI engineer.',
        weeks: [
          'Azure OpenAI deployment: model selection (GPT-4o, GPT-4o-mini, o1, text-embedding-3-large), deployment SKUs (Standard, Provisioned Throughput Units), region selection. Most production deployments are Standard SKU initially; PTU is for predictable high-volume workloads. Deploy GPT-4o and an embedding model.',
          'Quota and rate-limit management: token-per-minute (TPM) quotas per deployment, request-per-minute (RPM) limits, the dynamic quota feature. Production AOAI failures are usually quota failures. Build a small spike that hits the quota limit deliberately and observes the 429 response.',
          'Direct API calls from Python and TypeScript: bypassing Copilot Studio entirely. The SDK patterns (OpenAI Python SDK with Azure config, Azure.AI.OpenAI for .NET), streaming responses, function calling, structured output mode. Build the API patterns once, reuse forever.',
          'Content filtering and safety: AOAI\'s built-in content filters (categories, severity levels), Prompt Shields for jailbreak detection, custom blocklists. Configure each, test with adversarial inputs, document the safety posture. The compliance layer the platform provides for free.',
        ],
        gate: 'Direct Azure OpenAI access from Python and TypeScript SDKs with streaming, function calling, structured output, and content filtering configured. A deliberate quota-limit test documented. The engine layer is now accessible, not abstracted away.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'PROMPT FLOW + RAG',
    subtitle: 'Prompt Flow mastered as orchestration. AI Search as the RAG layer. Hybrid retrieval shipped.',
    months: [
      {
        n: 4,
        title: 'Prompt Flow — Foundry\'s orchestration layer',
        why: 'Prompt Flow is Microsoft\'s answer to LangChain and LlamaIndex — a graph-based orchestration tool for multi-step LLM workflows. It runs inside Foundry, integrates with Azure OpenAI, deploys to managed endpoints. M4 is fluency with Prompt Flow as the orchestration layer for non-Copilot-Studio agent work.',
        weeks: [
          'Prompt Flow fundamentals: the graph model (nodes, edges, variants), the built-in node types (LLM, Python, prompt, embedding, vector index lookup), the Visual Studio Code extension for local development. Build one Prompt Flow end-to-end that takes a query, retrieves context, and generates a response.',
          'Variants and evaluation: Prompt Flow\'s built-in pattern for A/B testing prompts. Define two variants of an LLM node, run evaluation across both with a dataset, compare results in the Foundry UI. This is the eval layer the Eval arc M4 platform decision could also point at.',
          'Custom Python nodes: when the built-in nodes are not enough. Building a custom node that calls an internal API, applies a guardrail, or performs a domain-specific transformation. The extension pattern that makes Prompt Flow viable for real production use cases.',
          'Deployment to managed endpoints: a Prompt Flow deployed as a real-time endpoint, callable via HTTPS, scaled automatically. The deployment that turns a Prompt Flow from a development artifact into a production service. Test it end-to-end with curl.',
        ],
        gate: 'A multi-step Prompt Flow deployed to a managed endpoint, callable via HTTPS, with at least one custom Python node and one A/B variant. The orchestration layer beyond Copilot Studio is now in your toolkit.',
      },
      {
        n: 5,
        title: 'Azure AI Search — the retrieval layer',
        why: 'Azure AI Search (formerly Cognitive Search) is the retrieval service most enterprise Foundry RAG systems use. Hybrid search (vector + keyword), semantic ranking, integrated vectorization, security trimming for multi-tenant scenarios. M5 is the retrieval layer Foundry RAG sits on.',
        weeks: [
          'AI Search basics: indexes, fields, indexers, skillsets. The data model that lets you ingest documents, extract fields, generate embeddings, and store everything in one searchable index. Build one index with a real document corpus.',
          'Integrated vectorization: AI Search calling Azure OpenAI embedding deployments during indexing. The pattern that eliminates the separate embedding-generation pipeline most RAG architectures need. Configure it and ingest a corpus.',
          'Hybrid search and semantic ranker: the combined retrieval pattern that outperforms either vector or keyword alone for most enterprise use cases. The semantic ranker (an L2 reranker) adds another quality boost. Benchmark hybrid vs. vector-only vs. keyword-only on the same query set.',
          'Security trimming: per-document ACLs that let you build multi-tenant RAG where each user only retrieves documents they have access to. This is the pattern almost every enterprise client requires and almost no demo RAG system implements. Build it correctly on one index.',
        ],
        gate: 'An AI Search index with integrated vectorization, hybrid search with semantic ranker, and security trimming for multi-tenant scenarios. The retrieval layer is production-grade, with documented benchmark comparisons across retrieval strategies.',
      },
      {
        n: 6,
        title: 'RAG end-to-end on Foundry',
        why: 'M4 built orchestration. M5 built retrieval. M6 combines them into a complete RAG system on Foundry — Prompt Flow orchestrating AI Search retrieval and Azure OpenAI generation, with eval, monitoring, and the production characteristics enterprise clients require.',
        weeks: [
          'End-to-end RAG architecture: ingestion (data → AI Search index with integrated vectorization), retrieval (Prompt Flow node querying AI Search), generation (Prompt Flow LLM node with retrieved context), evaluation (Prompt Flow eval flow scoring relevance and groundedness). Build the architecture diagram before the implementation.',
          'Implementation: every component from M4-M5 connected in one working system. Real corpus, real queries, real evaluation. By the end of week 2, queries flow from input through retrieval through generation back to the caller, all within Foundry.',
          'Groundedness and relevance metrics: Foundry\'s built-in RAG metrics — groundedness (does the answer cite retrieved context?), relevance (does it answer the question?), retrieval quality. Run the evaluation, document baseline scores, iterate.',
          'Production observability: Application Insights wired up for the RAG endpoint, custom metrics for retrieval latency, generation latency, end-to-end token cost. The observability the M11 polish month will rely on.',
        ],
        gate: 'A complete RAG system on Foundry deployed end-to-end with baseline groundedness, relevance, and retrieval quality metrics measured. Application Insights tracking latency, cost, and quality per request. The pattern that future client engagements will replicate.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'AGENTS + ENTERPRISE',
    subtitle: 'Semantic Kernel for agents. Azure ML for model deployment. Enterprise governance and compliance.',
    months: [
      {
        n: 7,
        title: 'Semantic Kernel — Microsoft\'s agent framework',
        why: 'Semantic Kernel is Microsoft\'s open-source SDK for building AI agents, comparable to LangGraph or the Anthropic SDK\'s agent loop patterns. It is the SDK most Microsoft-stack enterprises will reach for. M7 is fluency with Semantic Kernel as the agent-building primitive for Foundry-stack work.',
        weeks: [
          'Semantic Kernel fundamentals: kernels, plugins, planners, the function-calling pattern. The mental model differs from LangChain — read the docs and the sample repos. Build one kernel with three plugins (a date utility, a search wrapper, an internal API caller).',
          'Multi-step agent patterns: the FunctionCallingStepwisePlanner, the Handlebars planner, custom planners. The "agent decides which tool to call next" pattern that turns SK from an LLM SDK into an agent framework.',
          'Memory and context management: short-term memory (chat history), long-term memory (vector store integration with AI Search or Azure Cosmos DB), the patterns for managing context across conversation turns. Build one agent with persistent memory across sessions.',
          'Process Framework (Semantic Kernel\'s Q4 2024 addition): structured multi-agent orchestration, the state machine model, multi-agent collaboration patterns. The most recent SK feature — exam-relevant if Microsoft adds agent questions to AI-102, client-relevant for advanced agent architectures.',
        ],
        gate: 'A Semantic Kernel agent built end-to-end with plugins, a planner, persistent memory, and at least one multi-agent orchestration via Process Framework. The agent framework on the Microsoft stack is now in your fingers, not just your reading list.',
      },
      {
        n: 8,
        title: 'Azure ML — the deeper model layer',
        why: 'Azure OpenAI is the LLM service. Azure ML is the broader ML platform — custom model training, fine-tuning, model registry, real-time and batch endpoints. M8 is the Azure ML layer underneath AOAI for the cases where you need a custom model, a fine-tune, or a deployment pattern AOAI does not support.',
        weeks: [
          'Azure ML workspace and assets: workspaces (different from Foundry Hubs), models, environments, datasets, jobs. The asset model that lets you version everything that goes into a training run.',
          'Fine-tuning patterns: when to fine-tune vs. when to prompt engineer (almost never the former). For Azure OpenAI, the fine-tuning workflow through Foundry. For open-source models, fine-tuning through Azure ML with proper compute clusters. Run one small fine-tune end-to-end so the workflow is real, not theoretical.',
          'Model deployment patterns: managed online endpoints (real-time, auto-scaling), batch endpoints (high-throughput, scheduled), model serving on Azure Kubernetes Service for advanced cases. Deploy one custom model to a managed online endpoint.',
          'MLflow integration: Azure ML uses MLflow as its tracking layer. Experiments, runs, model registry, the workflow that ties training to deployment. The pattern that makes ML reproducible at the engineering level the M9 governance work depends on.',
        ],
        gate: 'A custom model trained or fine-tuned via Azure ML, registered in the model registry with MLflow tracking, deployed to a managed online endpoint. The deeper ML layer beneath AOAI is operational, not abstract.',
      },
      {
        n: 9,
        title: 'Enterprise governance, compliance, content safety',
        why: 'Enterprise Azure AI work runs under governance that consumer or startup AI work skips entirely. M9 is the governance layer most practitioners learn the hard way — through a client compliance review three months into an engagement. Better to learn it now.',
        weeks: [
          'Content safety in depth: Azure AI Content Safety (text, image, multimodal), Prompt Shields (direct + indirect prompt injection), groundedness detection, protected material detection. Configure each on a real deployment, test with adversarial inputs.',
          'Responsible AI dashboard: Azure ML\'s tooling for fairness, error analysis, model interpretability, counterfactual analysis. The artifacts an enterprise responsible AI review will request. Build the dashboard for one deployed model and walk through it as if presenting to a compliance team.',
          'Compliance frameworks on Azure: HIPAA, FedRAMP, SOC 2, ISO 27001, the EU AI Act considerations. Which Azure services are in-scope for each, what the shared responsibility model looks like. This is the conversation Daniel will need to have with regulated-industry clients — be the one who can have it.',
          'Audit logging and Microsoft Purview integration: tracking who accessed which AI service, which prompts were sent, which data was retrieved. The forensic layer that compliance teams require and most AI deployments skip until forced.',
        ],
        gate: 'A documented enterprise governance posture applied to your M6 RAG system and M8 ML deployment: content safety configured, Responsible AI dashboard built, compliance framework alignment documented, audit logging tested. The compliance-ready pattern Daniel can present to regulated clients.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'POSITION + PUBLISH',
    subtitle: 'AI-102 deepening, the architecture comparison published, the Microsoft AI engineer credential earned.',
    months: [
      {
        n: 10,
        title: 'AI-102 deepening — the cert that validates the credential',
        why: 'The Copilot arc already targets AI-102 at M11 of its own track. This arc gives that cert real weight — instead of passing AI-102 on memorization, you pass it on the genuine engineering depth M1-M9 built. M10 is the exam prep window that turns nine months of Foundry work into the formal Microsoft credential.',
        weeks: [
          'AI-102 exam blueprint review: the four domains (Plan and manage an Azure AI solution, Implement decision support solutions, Implement language solutions, Implement generative AI solutions). Map each domain to the M1-M9 work — most of M1-M3 covers domain 1, M4-M6 covers domain 4, etc.',
          'Microsoft Learn paths: complete the official AI-102 learning paths in Microsoft Learn. Most of the content will be review at this point, but the exam tests Microsoft-specific terminology that only the official content uses correctly.',
          'Practice exams: at least three different practice exam sets, weak-area identification, hands-on remediation. Same diagnostic pattern as the GCP arc M10 — diagnostic first, drill the weak domains, retest.',
          'Mock exam under conditions: full 60-question simulated exam in one sitting, scored honestly. If above 75%, schedule the real exam for early M11. If below 75%, one more week of remediation before scheduling.',
        ],
        gate: 'Three practice exams scored 75%+ on different days. Weak areas remediated with hands-on work in Foundry. Mock exam taken under simulated conditions and passed. Real exam scheduled.',
      },
      {
        n: 11,
        title: 'Sit AI-102, publish the architecture comparison',
        why: 'M11 ships two things simultaneously — the cert sat and earned, and the architecture comparison that turns the cert into competitive positioning. "Copilot Studio vs. Azure AI Foundry — when to use which and why" is the artifact Intinc has needed and that no one outside Microsoft itself has published well.',
        weeks: [
          'Sit AI-102. Same workflow as the GCP arc M11 — schedule early in the week, sit it, document the post-exam experience immediately. Pass or fail, document specifically. Failure is recoverable; not learning from it is not.',
          'Draft the architecture comparison: when does Copilot Studio win? When does Foundry win? The decision framework Intinc clients actually need: workflow complexity, governance requirements, team capability, total cost of ownership over 24 months. Specific examples from your Copilot arc and this arc.',
          'Polish and publish: long-form post or Substack standalone, GitHub repo with the example Bicep templates and Prompt Flow YAML files (sanitized of any client-specific data), architecture diagrams. The artifact that makes Intinc a credible Microsoft AI partner, not just a Copilot reseller.',
          'Distribution: cross-post in Microsoft AI community forums, submit to relevant Microsoft MVP-adjacent newsletters, share with Daniel and the Intinc team. Internal distribution matters as much as external — this is the artifact that changes how Daniel positions Intinc in Microsoft Partner conversations.',
        ],
        gate: 'AI-102 cert credential issued (or clear remediation plan with retake scheduled). Architecture comparison published with at least 2,000 views in the first month or one specific cited reference. Daniel has read it and given specific feedback on positioning.',
      },
      {
        n: 12,
        title: 'AIaaS service line + year retrospective',
        why: 'Twelve months of Foundry work. The cert exists, the architecture comparison exists, the engineering credibility exists. M12 turns the work into business asset — a formal Intinc AIaaS service offering, a Microsoft Partner positioning conversation, and the retrospective that ties this arc to the Head of AIaaS pathway directly.',
        weeks: [
          'AIaaS service line definition: "Enterprise Foundry Implementation" or "Foundry-Based RAG Engagement" as a packaged Intinc offering. The deliverable, the format (8-12 week engagement), the price, the target client profile. Most Microsoft partners offer Copilot Studio implementations — few offer Foundry depth. That is the market.',
          'First Foundry-based client engagement or pitch: pitch the service line to one Intinc client or warm prospect. The deliverable from M6 (RAG end-to-end) and M9 (governance posture) is the demonstrable artifact in the pitch.',
          'Microsoft Partner positioning conversation with Daniel: not a status update, a strategic conversation. What does the Foundry depth add to Intinc\'s Microsoft Partner status? What additional Partner specializations or competencies should Intinc pursue? Is there an AI Solutions Partner designation worth targeting? The conversation that affects Intinc\'s 2-3 year Microsoft strategy.',
          'Year retrospective: what changed in your engineering practice when Foundry became muscle memory? What does Y2 look like — deeper Azure ML specialization, multi-cloud AI architecture lead, formal AI Solutions Partner designation? The retrospective feeds the Personal Brand arc Q4 work and the AIaaS arc Q4 work simultaneously.',
        ],
        gate: 'A defined AIaaS Foundry service line. At least one Foundry-based pitch made (closed or pending). A documented strategic conversation with Daniel on Microsoft Partner positioning. Year retrospective published. The Microsoft AI engineer credential is now operational positioning, not just a credential.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// FOUNDRY STRIP — four services + one orchestration layer
// ---------------------------------------------------------------------------
const FOUNDRY_LANES = [
  { type: 'service', label: 'Service', name: 'Azure OpenAI', sub: 'LLM engine · M3',         fill: 100 },
  { type: 'service', label: 'Service', name: 'Prompt Flow',  sub: 'Orchestration · M4',      fill: 85  },
  { type: 'service', label: 'Service', name: 'AI Search',    sub: 'Retrieval · M5',          fill: 75  },
  { type: 'service', label: 'Service', name: 'Azure ML',     sub: 'Model layer · M8',        fill: 55  },
  { type: 'orch',    label: 'SDK',     name: 'Semantic Kernel', sub: 'Agent framework · M7', fill: 70  },
];

// ---------------------------------------------------------------------------
// STYLES — Azure AI Foundry Arc / indigo on deep navy
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0a0e1f;
  --bg-2:         #0f1530;
  --fg:           #e3e7f5;
  --fg-dim:       #8088b8;
  --accent:       #6366f1;
  --accent-2:     #a5b4fc;
  --accent-dim:   #4f46e5;
  --gate:         #60a5fa;
  --orch:         #c7d2fe;
  --muted:        #2a3055;
  --card:         #11162e;
  --border:       #1a2040;
  --border-bright:#27305a;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(96,165,250,0.05), transparent 65%),
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

.foundry-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.foundry-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.foundry-item:last-child { border-right: none; }
.foundry-item.is-orch { background: rgba(199,210,254,0.05); border-left: 1px solid rgba(199,210,254,0.22); }

.foundry-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.foundry-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-service .foundry-name { color: var(--accent); }
.is-orch    .foundry-name { color: var(--orch); }
.foundry-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-service .foundry-sub { color: rgba(99,102,241,0.65); }
.is-orch    .foundry-sub { color: rgba(199,210,254,0.7); }
.foundry-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-service .foundry-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.is-orch    .foundry-bar-fill { background: var(--orch);   height: 100%; opacity: 0.80; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(99,102,241,0.07), rgba(99,102,241,0.01));
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
.layer-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(99,102,241,0.03);
  font-size: 12.5px; color: var(--fg);
}
.layer-note strong { color: var(--accent); }

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
.week.done  { border-left-color: var(--accent); background: rgba(99,102,241,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(99,102,241,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(96,165,250,0.3); background: rgba(96,165,250,0.04); align-items: start;
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
.claims code { color: var(--accent-2); background: rgba(99,102,241,0.1); padding: 1px 6px; font-size: 11px; }
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
  .foundry-strip { grid-template-columns: 1fr 1fr; }
  .foundry-item:nth-child(2) { border-right: none; }
  .foundry-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function AzureFoundryArc() {
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
              <p className="kicker"><Server size={12} /> Learning Ops // Foundry Lane</p>
              <h1 className="title-serif">The <em>Foundry</em> Arc.</h1>
              <p className="title-sub">
                12 months. From Copilot Studio implementer to Microsoft AI engineer. Azure resource
                fluency, Foundry Hub and Projects, Azure OpenAI direct, Prompt Flow orchestration,
                AI Search retrieval, Semantic Kernel agents, Azure ML model layer, enterprise
                governance — and the architecture comparison that makes Intinc a credible Microsoft
                AI partner, not just a Copilot reseller.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert: <strong>AI-102 · M11</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Architecture comparison</strong></div>
            </div>
          </div>

          <div className="foundry-strip stagger">
            {FOUNDRY_LANES.map((s) => (
              <div key={s.name} className={`foundry-item is-${s.type}`}>
                <div className="foundry-label">{s.label}</div>
                <div className="foundry-name">{s.name}</div>
                <div className="foundry-sub">{s.sub}</div>
                <div className="foundry-bar">
                  <div className="foundry-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — going deeper than the platform expects you to is a positioning move.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Microsoft is happy when Intinc sells Copilot Studio implementations. Microsoft is
                more interested when partners can deliver Foundry-depth engagements. This arc takes
                you from the platform layer Microsoft assumes you will operate at to the engineering
                layer most partners cannot. The positioning win is real — but going deeper than your
                peers means most of the work is invisible until M11.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The engineering credential that makes Intinc a "Microsoft AI partner who actually builds" rather than a "Copilot Studio reseller" — directly affects Daniel\'s Partner Network positioning</li>
                    <li>AI-102 cert with real depth behind it — the difference between a credential and a credential you can defend in any technical conversation</li>
                    <li>Foundry-based engagements are billable at higher rates than Copilot Studio implementations — the service line economics improve as the engineering depth increases</li>
                    <li>The architecture comparison (M11) is genuinely uncommon — Microsoft itself rarely publishes a clear "use Copilot Studio when... use Foundry when..." framework</li>
                    <li>Compounds directly with the existing Copilot arc — the same client conversation now has two depths of answer rather than one</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>MED load (5–7 hrs/week) with M10 exam prep spiking to 10+ hrs/week for the cert window</li>
                    <li>Azure costs are real — hands-on Foundry work runs <code>$50–150/month</code> through Q1–Q2, spiking to <code>$200+</code> in Q3 with real ML training and inference</li>
                    <li>The work compounds slowly — most of the value lands in M11 when the cert and architecture comparison ship together, not month-by-month like product arcs</li>
                    <li>Microsoft moves fast on Foundry — what you learn in M2 may have UI changes by M11. The underlying concepts are stable; the UI is not. Plan for re-learning at the surface level</li>
                  </ul>
                </div>
              </div>
              <div className="layer-note">
                <strong>The positioning rule that determines whether this arc lands:</strong> the
                value of going deeper than your peers is only realized when the depth is visible to
                the people whose decisions it should influence. Daniel needs to know you can have
                a Foundry conversation. Microsoft Partner contacts need to see the architecture
                comparison. Clients need to feel the engineering depth in the first 15 minutes of
                discovery. If the work stays invisible through M12, the arc converted to a credential
                only — half the value. The Q4 publication and Daniel conversation are not optional.
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
                          <div className="gate-label">Engineering gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>This arc sits underneath the Copilot Studio arc, not beside it.</strong>{' '}
                The Copilot arc covers the surface layer Intinc clients see; this arc covers the
                engineering layer Daniel needs to know exists. Running this arc after the Copilot
                arc is the natural sequence. Running it before means most of the Foundry depth has
                no Copilot context to anchor against — possible but harder.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Azure costs are real and accumulate.</strong> Foundry hands-on work runs
                <code>$50–150/month</code> through Q1–Q2, spiking to <code>$200+</code> in Q3 when
                running real ML training jobs and Provisioned Throughput Unit experiments. Set
                budget alerts in M1 alongside the Bicep baseline. Most surprise bills come from
                forgotten compute instances and PTU experiments.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Microsoft\'s product surface changes faster than the underlying concepts.</strong>{' '}
                What you learn in M2-M3 may have UI changes by M11. The underlying concepts (resource
                model, IAM, Entra ID, Prompt Flow architecture, Semantic Kernel patterns) are stable
                across the year. The UI shifts. Build mental models on the stable layer; treat the
                UI as the current convention, not the underlying truth.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>AI-102 deepening, not AI-102 from scratch.</strong> The Copilot arc M11 work
                covers AI-102 cert prep. This arc\'s M10 is deepening — the same exam, but with nine
                months of Foundry depth behind it. The pass rate should be significantly higher than
                a Copilot-only path. If sitting both exams (this arc\'s M10 + Copilot arc\'s M11),
                schedule them in different windows — back-to-back exam prep is counterproductive.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The architecture comparison (M11) is the highest-leverage artifact in this arc.</strong>{' '}
                Microsoft itself rarely publishes a clear "Copilot Studio vs. Foundry" decision
                framework. The artifact you write is genuinely uncommon. Daniel will read it.
                Microsoft Partner contacts may read it. Clients will read it during discovery. The
                M11 publication is what turns this arc from a personal credential into Intinc
                positioning material.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Cross-arc leverage is substantial.</strong> The RAG arc M2 dataset design
                applies to Foundry RAG evaluations. The Eval arc M4 platform decision could point at
                Prompt Flow as the eval platform for Microsoft-stack work. The Security arc M9
                multi-tenant isolation work applies to AI Search security trimming. Running this arc
                alongside or after those compounds leverage.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
