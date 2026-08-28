import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Cloud } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month GCP / Vertex AI Arc
// Kyle-specific: Microsoft-heavy practitioner ramps to GCP fluency, sits the
// Google Professional ML Engineer cert, ships multi-cloud comparison capstone
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'GCP FOUNDATIONS',
    subtitle: 'Project structure, IAM, networking, compute, data layer — the cloud underneath every later month.',
    months: [
      {
        n: 1,
        title: 'GCP fundamentals — port the Azure mental model',
        why: 'Microsoft-heavy practitioners arrive at GCP with Azure muscle memory: resource groups, ARM templates, RBAC, AAD. GCP works differently — orgs/folders/projects, IAM with predefined and custom roles, gcloud CLI, Deployment Manager and Terraform. This month is about building the GCP mental model deliberately, not by accident over six months of confused googling.',
        weeks: [
          'gcloud CLI fundamentals and the GCP resource hierarchy: organization → folders → projects → resources. Practice creating a project structure for a hypothetical multi-tenant client. Learn the "organization-only," "folder-only," and "project-only" boundaries because IAM behaves differently at each layer.',
          'IAM deep dive: predefined roles vs custom roles, service accounts vs user accounts, workload identity federation (the keyless auth pattern that GitHub Actions uses), conditional IAM. Build the principle-of-least-privilege pattern for an ML workload before you have ML workloads to apply it to.',
          'Networking on GCP: VPCs, subnets, firewall rules, Cloud NAT, Private Google Access, VPC Service Controls. Map every concept to the Azure VNet equivalent so you can translate between client conversations on either cloud. The vocabulary differs more than the architecture does.',
          'Operational hygiene: billing setup, budget alerts, quotas, region/zone selection, the cost-tracking labels pattern. A GCP project running for six months without budget alerts is a $400 bill waiting to surprise you. Set them now.',
        ],
        gate: 'A GCP project deployed via Terraform with proper organization placement, IAM with workload identity federation, networking baseline, budget alerts, and cost labels. The foundation that every later month builds on.',
      },
      {
        n: 2,
        title: 'Compute layer — Cloud Run, Functions, Compute Engine',
        why: 'Most ML workloads on GCP run on serverless compute. Vertex AI itself is built on Cloud Run, GKE, and managed services. This month is the compute layer — knowing when to reach for Cloud Run vs Cloud Functions vs Compute Engine for an ML workload, with cost and operational tradeoffs internalized.',
        weeks: [
          'Cloud Run deep dive: deploying containerized services, request-based scaling, cold start mitigation, custom domains, identity-aware proxy in front. Deploy a Claude API proxy on Cloud Run with proper auth, custom domain, and 99% uptime over a week.',
          'Cloud Functions 2nd gen: triggers (HTTP, Pub/Sub, Cloud Storage events), the cost model vs Cloud Run, when functions beat services. Build one Cloud Function that processes a Cloud Storage upload and writes metadata to BigQuery.',
          'Compute Engine fundamentals: when you actually need a VM. GPU instances for ML training, the preemptible VM cost pattern, instance templates and managed instance groups. Most ML training in 2026 runs on Vertex AI managed services rather than raw VMs, but the exam still tests Compute Engine.',
          'Artifact Registry and container lifecycle: push from local docker, push from Cloud Build, image scanning, vulnerability triage, cleanup policies. The container layer that sits between every Cloud Run deploy and the actual running service.',
        ],
        gate: 'A Cloud Run service deployed with custom domain, IAM-authenticated, observability via Cloud Logging. One Cloud Function processing storage events. Artifact Registry with scanning enabled.',
      },
      {
        n: 3,
        title: 'Data layer — BigQuery, Cloud Storage, Dataflow, Pub/Sub',
        why: 'ML on GCP starts with data, and data on GCP lives in BigQuery and Cloud Storage. The Professional ML Engineer exam weights data preparation pipelines heavily — Dataflow, Pub/Sub, BigQuery transformations. This month is the data layer that every later ML pipeline assumes you have already mastered.',
        weeks: [
          'BigQuery fundamentals: datasets, tables, views, materialized views. Partitioning vs clustering — when to use each. Slot reservation vs on-demand pricing. The query optimizer enough to read EXPLAIN plans. Most ML data prep questions on the exam are BigQuery questions in disguise.',
          'Cloud Storage: buckets, multi-region vs region vs nearline vs coldline storage classes, lifecycle policies, signed URLs, Object Versioning. The storage tier where training data and model artifacts actually live.',
          'Dataflow basics: Apache Beam programming model, batch vs streaming, the templates Google maintains for common patterns (BigQuery → Pub/Sub, GCS → BigQuery, etc.). Build one batch Dataflow job from CSV in GCS to a BigQuery table.',
          'Pub/Sub: topics, subscriptions, push vs pull, dead-letter topics, exactly-once delivery semantics. The event backbone for ML pipelines that react to new data arrival rather than running on schedule.',
        ],
        gate: 'A data pipeline running end-to-end: data lands in Cloud Storage → Pub/Sub event triggers Dataflow → transformed data lands in BigQuery → BigQuery view exposes the analytics. All on a schedule, all monitored.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'VERTEX AI CORE',
    subtitle: 'Notebooks, AutoML, custom training, model deployment, online serving — the ML platform itself.',
    months: [
      {
        n: 4,
        title: 'Vertex AI Workbench + Pre-trained APIs + AutoML',
        why: 'Vertex AI is GCP\'s unified ML platform — the answer to Azure ML and SageMaker. Workbench is the managed Jupyter environment most ML engineers live in day-to-day. Pre-trained APIs cover the vision/speech/language tasks where you should never train a custom model. AutoML covers the cases where managed training beats custom code. Most exam questions assume daily fluency with all three.',
        weeks: [
          'Vertex AI Workbench: instance types, environment management, GitHub integration, the persistent vs ephemeral notebook patterns. Set up a workbench that becomes your daily driver for the rest of the arc — the one where every later experiment runs.',
          'Pre-trained APIs survey: Vision API, Translation API, Speech-to-Text, Natural Language API, Document AI. For each, build a small spike that calls the API on a realistic task. The exam tests "given this scenario, which pre-trained API fits?" repeatedly — internalize the decision tree.',
          'AutoML Tabular for structured data: upload a CSV, train a model, evaluate, deploy to an endpoint. Note training time and cost. AutoML is the floor — your custom models from M5 must beat AutoML to justify the engineering cost.',
          'Model Garden: GCP\'s catalog of pre-trained models including Gemini, open-source models like Llama, and Google research models. The "which model fits the use case" decision now includes pre-trained Garden models alongside AutoML and custom training.',
        ],
        gate: 'A Workbench instance running daily. One AutoML model deployed to a Vertex AI endpoint. Pre-trained API decision tree documented. Model Garden surveyed and the three most relevant Garden models for your use cases identified.',
      },
      {
        n: 5,
        title: 'Custom training — bring your own model',
        why: 'AutoML covers the floor. Custom training is where ML Engineers earn their title. Vertex AI Training supports custom containers, pre-built containers, distributed training, hyperparameter tuning. The exam weights this domain heavily — every "design a training pipeline that..." question is in this territory.',
        weeks: [
          'Custom training jobs: pre-built TensorFlow/PyTorch containers, custom containers from Artifact Registry, training data sources from BigQuery and Cloud Storage. Build a custom training job that fine-tunes a small model on real data.',
          'Hyperparameter tuning with Vertex Vizier: defining the search space, choosing the search algorithm (random, grid, Bayesian), parallel trials, early stopping. Run a tuning job with 20 trials and analyze the convergence pattern.',
          'Distributed training: when to use TPUs vs GPUs vs CPU clusters, the strategy parameter for TensorFlow, PyTorch DDP, the cost-vs-speed tradeoffs. Most ML practitioners never do real distributed training — the exam expects you to know when you would and how it scales.',
          'Training pipelines vs custom jobs vs notebook execution: the three patterns, when each is right, and the lineage tracking that comes free with Vertex AI Pipelines but not with notebook execution. This is the bridge to M7.',
        ],
        gate: 'A custom-trained model with documented hyperparameter tuning, deployed to a Vertex AI endpoint. Cost and training time benchmarked against the M4 AutoML baseline. Distributed training pattern explained in writing even if not run end-to-end.',
      },
      {
        n: 6,
        title: 'Model deployment, monitoring, and serving',
        why: 'Building models is half the job. Deploying them at scale with proper monitoring, traffic splitting, drift detection, and rollback — the production half — is what separates ML Engineers from data scientists. The exam treats deployment and monitoring as distinct domains. Both are heavily weighted.',
        weeks: [
          'Vertex AI Endpoints: online serving for low-latency, batch prediction for high-throughput. Traffic splitting between model versions for A/B testing. Auto-scaling configuration. The deployment patterns that production ML systems actually use.',
          'Model Registry: versioning, lineage, the deployment workflow from registry to endpoint. Model cards documenting intended use, training data, evaluation metrics, fairness assessment. The governance layer the exam tests as part of deployment.',
          'Vertex AI Model Monitoring: feature skew between training and serving data, prediction drift over time, alerting thresholds, the runbook for "drift detected — what now?" Drift detection is one of the highest-value production patterns and one of the least practiced.',
          'Edge deployment: Vertex AI Edge Manager for on-device inference, the use cases (low-latency, intermittent connectivity, data sovereignty), the tradeoffs vs cloud endpoints. Lightly weighted on the exam but worth the chapter.',
        ],
        gate: 'A model deployed with traffic splitting between v1 and v2. Drift monitoring active and alerting tested. Model Registry populated with versions and model cards. Production runbook documented for "drift detected" and "endpoint failing health check" scenarios.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'PIPELINES & MLOPS',
    subtitle: 'Vertex AI Pipelines, Cloud Build CI/CD, governance, monitoring, the production ML practice.',
    months: [
      {
        n: 7,
        title: 'Vertex AI Pipelines (Kubeflow + TFX)',
        why: 'The exam weights pipelines heavily — the highest-weighted single domain at roughly 23-26% depending on the version. Vertex AI Pipelines (managed Kubeflow Pipelines + TFX components) is how production ML on GCP gets orchestrated. This is the orchestration layer that ties M3 data, M5 training, and M6 deployment into one repeatable system.',
        weeks: [
          'Kubeflow Pipelines fundamentals: components (containerized steps), pipelines (DAGs of components), artifacts (typed inputs/outputs), lineage (the auto-tracked graph of who produced what). The mental model that makes the rest of the month make sense.',
          'Vertex AI Pipelines specifically: the managed runtime, the SDK (kfp.v2), pipeline parameters, conditional branches, parallel execution. Build a small pipeline with three components — data prep, training, evaluation — running end-to-end.',
          'TFX components: ExampleGen, StatisticsGen, SchemaGen, Transform, Trainer, Evaluator, Pusher. The pre-built components that most production ML pipelines use rather than reinventing. Each component is exam-relevant individually.',
          'Pipeline triggers and orchestration: schedule-based (Cloud Scheduler), event-based (Pub/Sub, Cloud Storage triggers), manual triggers from CI/CD. Build one scheduled pipeline that retrains a model weekly and conditionally deploys based on eval metrics.',
        ],
        gate: 'A Vertex AI Pipeline running end-to-end: data ingestion → preparation → training → evaluation → conditional deployment. Scheduled to run weekly. Lineage visible in the GCP console for every artifact produced.',
      },
      {
        n: 8,
        title: 'CI/CD for ML — Cloud Build, GitHub Actions, testing strategies',
        why: 'ML Engineer is fundamentally an MLOps role. Cloud Build for GCP-native pipelines, GitHub Actions for repos that need broader CI/CD, workload identity federation for keyless authentication, and the testing strategies that make ML systems actually reliable. This month applies engineering discipline to ML systems.',
        weeks: [
          'Cloud Build: build configurations, triggers, custom builders, the integration with Artifact Registry and Cloud Run. The native GCP CI/CD that most exam scenarios assume.',
          'GitHub Actions ↔ GCP via workload identity federation: keyless authentication, the OIDC trust setup, the deployment patterns. For a Microsoft-heavy practitioner with GitHub repos, this is the bridge between worlds.',
          'Container security in the pipeline: Artifact Registry vulnerability scanning, Binary Authorization, the policy that prevents unsigned images from deploying to Cloud Run. Security shifted left in the ML deployment flow.',
          'Testing strategies for ML: unit tests for data transformations, schema validation tests, model performance regression tests, integration tests for end-to-end pipelines. Coverage of the four critical paths that breaking would cause user-facing failures.',
        ],
        gate: 'A complete CI/CD pipeline: PR triggers Cloud Build → tests run → image builds → deploys to staging Vertex AI endpoint → eval tests run → manual approval promotes to prod. Workload identity federation working for GitHub Actions integration.',
      },
      {
        n: 9,
        title: 'Model governance, security, and the cross-arc Security work',
        why: 'Enterprise ML on GCP runs under governance: who can train, who can deploy, who accesses training data, what gets logged for compliance, who reviews model cards. The exam tests this lightly. Enterprise practice tests it heavily. This month also ties directly into the Security Arc work — the AI security posture you build in the Security Arc applies here.',
        weeks: [
          'Vertex AI Model Cards in production: documentation, intended use, training data sources, evaluation results, fairness assessments, known limitations. The artifact that lets a security or compliance team approve a model for production.',
          'Customer-managed encryption keys (CMEK), VPC Service Controls perimeters, Private Service Connect for Vertex AI endpoints. The patterns enterprise clients require for any ML workload touching regulated data.',
          'Audit logging and Cloud Logging for ML systems: Admin Activity logs, Data Access logs, the cost vs visibility tradeoff, BigQuery export for long-term retention. The forensic layer that makes incident response possible.',
          'Compliance frameworks on GCP: HIPAA, FedRAMP, SOC2, GDPR considerations, the GCP services that are in-scope for each. Lightly weighted on the exam, heavily relevant for any AIaaS client engagement that mentions compliance.',
        ],
        gate: 'A documented model governance pattern applied to your M5-M7 work: model cards filled out, CMEK encryption applied, audit logging enabled and tested, compliance framework alignment documented. The pattern Daniel could hand to a regulated-industry client.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'EXAM & LEVERAGE',
    subtitle: 'Eight-week prep intensive, sit the exam, multi-cloud comparison capstone published.',
    months: [
      {
        n: 10,
        title: 'Exam prep intensive — eight weeks before the seat',
        why: 'The Google Professional ML Engineer exam is 60 multiple-choice questions, 2 hours, passing roughly 70%. The exam guide is published. Microsoft-heavy practitioners typically need 40+ hours of focused prep on top of the M1-M9 hands-on work. This month is the structured preparation window that makes the difference between sitting the exam confident and sitting it hopeful.',
        weeks: [
          'Official Google Cloud Skills Boost ML Engineer learning path: complete every module, every quest, every hands-on lab. The labs in particular are exam-relevant because the exam tests applied knowledge. Skip the labs and you skip the exam preparation.',
          'Practice exams: at least three different practice exam sets (Whizlabs, ExamPro, Tutorials Dojo). Score each, identify the three lowest-scoring domains, do additional labs in each. Practice exams are diagnostic, not predictive.',
          'Weak area drills: for each weak domain identified in week 2, build a 2-hour hands-on drill. Most weak areas resolve with hands-on practice rather than re-reading documentation. Trust the diagnostic.',
          'Mock exam simulation: take a full 60-question, 2-hour exam in one sitting under exam conditions. Score it. If above 75%, schedule the real exam. If below 75%, identify the gap and run the drill cycle one more week before scheduling.',
        ],
        gate: 'Three practice exams scored 75%+ on different days. Weak areas remediated with hands-on labs. Mock exam taken under simulated conditions and passed. Confidence to schedule the real exam.',
      },
      {
        n: 11,
        title: 'Sit the exam',
        why: 'The cert is paid for, scheduled, and sat in a single month so the prep pressure produces the credential rather than dissipating into endless preparation. Pearson VUE proctored either at a test center or online. The exam is real, and so is the post-exam analysis whether pass or fail.',
        weeks: [
          'Final review week: domain-by-domain checklist of objectives, three-page summary notes that compress everything into a single document. Light review only — heavy cramming the week of the exam costs more than it gains.',
          'Schedule the exam at a Pearson VUE center or remote-proctored online. Time it for early in the week so the rest of the week is buffer. Set up the test environment 24 hours before if remote.',
          'Sit the exam. Document the experience immediately afterward — which questions surprised you, which domains felt under-prepared, what you would do differently. The post-exam writeup is useful whether you passed or not.',
          'Pass: update the Partner Network profile, update LinkedIn, plan the M12 capstone. Fail: identify the specific domain gaps from the score report, plan a 30-day remediation, schedule the retake. Either outcome is a defined next step, not a stall.',
        ],
        gate: 'Google Professional ML Engineer cert credential issued (or a clear remediation plan with retake scheduled). Partner Network profile updated. LinkedIn announcement drafted. The M12 capstone work scoped.',
      },
      {
        n: 12,
        title: 'Multi-cloud comparison capstone and brand leverage',
        why: 'Holding a cert is one thing. Turning it into competitive positioning — multi-cloud expertise that no single-cloud practitioner can claim — is what makes the cert work for the Personal Brand arc, the AIaaS service line, and the Partner Network listing. This month produces the artifact that Anthropic Partner Network clients actually need.',
        weeks: [
          'Multi-cloud comparison document: "When to use Vertex AI vs Azure ML vs AWS SageMaker." The artifact written from a practitioner who has actually used both Azure ML (from the Copilot/Azure arc) and Vertex AI (this arc). The framework: workload type, compliance requirements, existing stack, team skill set, cost model.',
          'Apply the comparison to a real engagement: pick one Intinc client or FlashFusion engagement and map "if this were on GCP instead of Azure, what would change?" The applied analysis makes the comparison document real, not theoretical.',
          'Publish the comparison: LinkedIn long-form article (the M7 flagship piece in Personal Brand arc terms), Prompt edition, GitHub gist of the architecture diagrams. Cross-link to the Partner Network profile and the AIaaS service offerings.',
          'Year-end retrospective: the 12-month GCP arc, what changed in your practice, what conversations the cert unlocks that were previously closed, what the Y2 plan looks like (advanced certs? specialization? deeper Vertex AI work?). Published as the Personal Brand arc Q4 retrospective material.',
        ],
        gate: 'Published multi-cloud comparison referenced in the Partner Network profile, the AIaaS positioning materials, and at least one client conversation. The cert is now leverage for billable work, not just a credential on a wall.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// GCP STRIP — four service surfaces + cert track
// ---------------------------------------------------------------------------
const GCP_LANES = [
  { type: 'service', label: 'Service', name: 'Vertex AI',     sub: 'Core ML platform · M4–M6',  fill: 100 },
  { type: 'service', label: 'Service', name: 'BigQuery',      sub: 'Data + Storage · M3',       fill: 75  },
  { type: 'service', label: 'Service', name: 'Pipelines',     sub: 'Kubeflow + TFX · M7–M8',    fill: 70  },
  { type: 'service', label: 'Service', name: 'IAM + VPC',     sub: 'Governance · M1, M9',       fill: 50  },
  { type: 'cert',    label: 'Cert',    name: 'ML Engineer',   sub: 'Exam · M11',                fill: 95  },
];

// ---------------------------------------------------------------------------
// STYLES — GCP / Vertex AI Arc / Google blue on deep navy
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0a1020;
  --bg-2:         #0f1730;
  --fg:           #e2eaf5;
  --fg-dim:       #7892b8;
  --accent:       #4285f4;
  --accent-2:     #8ab4f8;
  --accent-dim:   #1a73e8;
  --gate:         #facc15;
  --service:      #4285f4;
  --muted:        #2a3a5a;
  --card:         #11192e;
  --border:       #1a2540;
  --border-bright:#27365a;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(66,133,244,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(250,204,21,0.05), transparent 65%),
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

.gcp-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.gcp-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.gcp-item:last-child { border-right: none; }
.gcp-item.is-cert { background: rgba(250,204,21,0.04); border-left: 1px solid rgba(250,204,21,0.22); }

.gcp-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.gcp-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-service .gcp-name { color: var(--accent); }
.is-cert    .gcp-name { color: var(--gate); }
.gcp-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-service .gcp-sub { color: rgba(66,133,244,0.65); }
.is-cert    .gcp-sub { color: rgba(250,204,21,0.7); }
.gcp-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-service .gcp-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.is-cert    .gcp-bar-fill { background: var(--gate);   height: 100%; opacity: 0.85; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(66,133,244,0.07), rgba(66,133,244,0.01));
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
.multicloud-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(66,133,244,0.03);
  font-size: 12.5px; color: var(--fg);
}
.multicloud-note strong { color: var(--accent); }

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
.week.done  { border-left-color: var(--accent); background: rgba(66,133,244,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(66,133,244,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(250,204,21,0.3); background: rgba(250,204,21,0.04); align-items: start;
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
.claims code { color: var(--accent-2); background: rgba(66,133,244,0.1); padding: 1px 6px; font-size: 11px; }
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
  .gcp-strip { grid-template-columns: 1fr 1fr; }
  .gcp-item:nth-child(2) { border-right: none; }
  .gcp-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
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
export default function GcpVertexAiArc() {
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
              <p className="kicker"><Cloud size={12} /> Learning Ops // Cloud Lane</p>
              <h1 className="title-serif">The <em>GCP</em> Arc.</h1>
              <p className="title-sub">
                12 months. From Microsoft-heavy practitioner to Google Cloud fluent. GCP fundamentals,
                Vertex AI core, ML pipelines and MLOps, the Professional ML Engineer cert sat and
                passed in M11, and a published multi-cloud comparison capstone that turns the
                credential into competitive positioning.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert: <strong>Google Pro ML Eng · M11</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Multi-cloud comparison · M12</strong></div>
            </div>
          </div>

          <div className="gcp-strip stagger">
            {GCP_LANES.map((s) => (
              <div key={s.name} className={`gcp-item is-${s.type}`}>
                <div className="gcp-label">{s.label}</div>
                <div className="gcp-name">{s.name}</div>
                <div className="gcp-sub">{s.sub}</div>
                <div className="gcp-bar">
                  <div className="gcp-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — multi-cloud cognitive load is the hidden cost.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Adding GCP to your stack does not replace your Azure mental model — it adds a parallel
                one. Resource groups vs projects, RBAC vs IAM, ARM vs Deployment Manager, AKS vs GKE,
                Azure ML vs Vertex AI. Every conversation, document, and architecture diagram now
                requires a context-switch between two mental models. The cost is real and persistent.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Google Professional ML Engineer credential — one of three certs already on your target list, the hardest one for Microsoft-heavy candidates</li>
                    <li>Multi-cloud positioning that no single-cloud practitioner can claim — directly differentiates the Partner Network listing</li>
                    <li>Vertex AI fluency unlocks Gemini access at the API layer, deepening the Mastery arc work and feeding the Mastery M11 cert attempt</li>
                    <li>BigQuery + Pipelines patterns are reusable across every AIaaS data engagement, regardless of which cloud the client chose</li>
                    <li>The M12 multi-cloud comparison becomes the most-cited brand artifact for enterprise AI conversations</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>HIGH load — 8–10 hrs/week, with M10 exam prep spiking to 15+ hrs/week for an eight-week window</li>
                    <li>The cognitive context-switching cost across two clouds compounds over the year — every architecture conversation now has two answers, not one</li>
                    <li>GCP costs are real. Plan <code>$30–80/month</code> for hands-on lab work; spike to $200+ in M5–M7 if running real training jobs</li>
                    <li>The exam pass rate for Microsoft-heavy candidates is meaningfully lower on first attempt — plan for the possibility of an M11 retake without it being a failure of the arc</li>
                  </ul>
                </div>
              </div>
              <div className="multicloud-note">
                <strong>The mental model that prevents the worst failure mode:</strong> stop trying to
                map every GCP concept to its Azure equivalent. Some map cleanly (Compute Engine ≈ VMs,
                Cloud Storage ≈ Blob Storage). Some do not (BigQuery has no clean Azure equivalent;
                Vertex AI Pipelines and Azure ML pipelines work differently in important ways). The
                practitioners who learn GCP fastest stop forcing the comparison and let GCP have its
                own model. The comparison comes back in M12 — but as analysis, not as scaffolding.
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
                          <div className="gate-label">Cloud gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>This is a HIGH-load arc with a real cost component.</strong> 8–10 hrs/week
                study, 15+ hrs/week during the M10 exam prep window. GCP hands-on lab costs of
                roughly <code>$30–80/month</code> through Q1–Q2, spiking to <code>$200+</code> in
                M5–M7 if running real training jobs. Set the budget alerts in M1 and check them
                monthly — the bills compound silently.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Do not run this arc parallel to the Full-Stack AI App arc.</strong> Both are
                HIGH-load. Both require Q1 ramp-up on unfamiliar territory. Running them in the same
                12-month window is the most likely way either arc fails. If both are priorities, run
                Full-Stack first (M1–M12), then GCP (M13–M24). Or run GCP first if the cert deadline
                pressure is greater.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Microsoft-heavy candidates have a lower first-attempt pass rate.</strong> The
                Professional ML Engineer exam tests applied GCP knowledge, and habit-driven Azure
                answers cost points on questions where the GCP-specific answer differs. Plan for the
                possibility of an M11 retake — schedule it as M12 if needed, with the M12 capstone
                pushed to M13. The cert is the gate, not the calendar.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The exam guide changes periodically.</strong> Google updates the Professional
                ML Engineer exam blueprint roughly every 12–18 months. Verify the current exam guide
                against your prep plan in M9 — if there has been a recent update, the practice exams
                from third parties may be out of date. Use Google Cloud Skills Boost as the source
                of truth, not third-party material.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc directly feeds three other arcs.</strong> M3 BigQuery work feeds the
                RAG arc's data layer. M4 Gemini access via Vertex AI feeds the Mastery arc's M11
                cert attempt. M12 multi-cloud comparison becomes Personal Brand arc M7 flagship
                long-form material. Sequence accordingly — running GCP after Mastery foundations
                are set produces a stronger combined outcome than running them isolated.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Multi-cloud cognitive load is the persistent cost.</strong> By M6 you will
                catch yourself reaching for the wrong cloud's pattern in a client conversation.
                Build a personal cheat sheet of "Azure to GCP equivalence" early — not because the
                concepts always map, but because having the cheat sheet prevents the wrong-cloud
                slip in real conversations. The Microsoft muscle memory is an asset; let it reduce
                without forcing it to disappear.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
