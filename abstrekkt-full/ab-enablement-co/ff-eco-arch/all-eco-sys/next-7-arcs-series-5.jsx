import { useState } from "react";
import { ChevronRight, Compass, Building2, Gauge, FlaskConical, Film, Users, Radio, Code2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 5 — Depth, vertical specialization, scaling the practice
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'vertical',
    Icon: Building2,
    title: 'The Vertical AI Arc',
    titleEm: 'Vertical',
    lane: 'Healthcare · legal · finance · regulated-industry depth',
    accent: '#0891b2',
    accentDim: 'rgba(8,145,178,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'Domain-specific cert (e.g. HIMSS AI in Healthcare)',
    why:
      "Every series so far has been horizontal — tools, frameworks, practices that apply across industries. At a certain revenue ceiling, horizontal stops compounding and vertical depth starts. Choosing one regulated vertical — healthcare with HIPAA and PHI constraints, legal with privilege and hallucination risk, financial services with audit requirements and model explainability mandates — and going deep enough to understand the compliance landscape, the buyer language, the specific failure modes, and the approved toolchains changes the client conversation entirely. You stop being a competent generalist and start being the only person they'd call. The Intinc client base includes regulated-industry adjacent organizations. FlashFusion has no vertical identity yet. This arc gives one of them a defensible niche.",
    capstone:
      "A deployed AI system in a regulated-industry context with documented compliance architecture. A vertical-specific AI implementation guide — not a blog post, a practitioner document that demonstrates you understand why 'just use an LLM' fails in that domain. The credential and the proof artifact that closes vertically-specific RFPs that a generalist AI consultant cannot win.",
    buildPrompt: 'Build The Vertical AI Arc — pick one regulated vertical (healthcare/legal/finance), compliance architecture, domain-specific AI implementation guide',
  },
  {
    id: 'infra',
    Icon: Gauge,
    title: 'The AI Infrastructure Arc',
    titleEm: 'Infrastructure',
    lane: 'vLLM · TensorRT · Kubernetes · GPU inference optimization',
    accent: '#dc2626',
    accentDim: 'rgba(220,38,38,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'CKA (Kubernetes) or NVIDIA DLI cert',
    why:
      "There is a hard ceiling on what you can advise when inference cost and latency optimization are on the table and your answer is 'use the OpenAI API.' vLLM for high-throughput batched inference, TensorRT for hardware-optimized model serving, Kubernetes for AI workload orchestration, NVIDIA CUDA profiling for GPU utilization, quantization strategies for cost-at-scale. This is the layer where AI systems become products with real unit economics — not experiments. Enterprise clients with actual inference volume eventually require an infrastructure conversation. This arc makes you the person who can lead it rather than outsource it.",
    capstone:
      "A production vLLM deployment serving a real workload with measured throughput benchmarks. A cost-per-token analysis comparing managed APIs vs. self-hosted inference across three workload profiles. A published 'when to self-host' decision framework — the artifact that closes the infrastructure advisory conversation before the technical team builds it wrong.",
    buildPrompt: 'Build The AI Infrastructure Arc — vLLM deployment, TensorRT optimization, Kubernetes for AI, GPU inference benchmarks, cost-per-token analysis',
  },
  {
    id: 'synthetic',
    Icon: FlaskConical,
    title: 'The Synthetic Data Arc',
    titleEm: 'Synthetic',
    lane: 'Data generation · privacy-preserving · eval dataset design',
    accent: '#7c3aed',
    accentDim: 'rgba(124,58,237,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — published dataset and methodology',
    why:
      "Every fine-tuning arc and every evaluation arc eventually hits the same wall: you don't have enough labeled data, and the data you have contains PII or proprietary information you can't use. Synthetic data generation — using LLMs to produce training examples, adversarial examples for red-teaming, golden evaluation sets, and privacy-preserving dataset variants — is the unlock. The toolchain is Gretel.ai, Mostly AI, LLM-based generation pipelines, and differential privacy frameworks. The clients who need fine-tuned models most are also the clients least likely to have clean, labeled training data. Synthetic data is what makes those engagements possible.",
    capstone:
      "A synthetic dataset pipeline that generates training data for a real task, with documented quality methodology and privacy analysis. A published 'synthetic data playbook' — when it's sufficient, when it's not, and how to evaluate the gap. The capability that makes fine-tuning engagements viable for clients who have the use case but not the labeled corpus.",
    buildPrompt: 'Build The Synthetic Data Arc — Gretel.ai, LLM-based data generation, privacy-preserving techniques, eval dataset design, synthetic data quality methodology',
  },
  {
    id: 'genmedia',
    Icon: Film,
    title: 'The Generative Media Arc',
    titleEm: 'Media',
    lane: 'Sora · Runway · ElevenLabs · image-to-video pipelines',
    accent: '#ec4899',
    accentDim: 'rgba(236,72,153,0.10)',
    load: 'LOW',
    horizon: '6 mo',
    cert: 'No cert — shipped media pipeline',
    why:
      "FlashFusion started as a graphics/merchandise business. The generative media stack — ElevenLabs for voice synthesis, Runway and Sora for video generation, Midjourney and Stable Diffusion for images, and the orchestration pipelines that chain them — is a natural extension of that origin and a capability gap in your current AI stack. Enterprise clients in marketing, training, and communications are spending heavily on generated media. The gap isn't building the models — it's knowing which model for which production use case, how to build reliable pipelines around inherently non-deterministic outputs, and how to QA generated media at scale. This arc closes that.",
    capstone:
      "A production generative media pipeline that takes a brief and produces a complete asset package (image, audio, short video) with documented cost and turnaround benchmarks. A 'generative media tool map' — which model for which creative task, with quality vs. cost vs. control tradeoffs. The FlashFusion service offering that reconnects its AI-platform identity to its original creative industry roots.",
    buildPrompt: 'Build The Generative Media Arc — ElevenLabs, Runway, Sora, image-to-video pipelines, generative media QA, tool selection framework',
  },
  {
    id: 'agenthiring',
    Icon: Users,
    title: 'The Agent Team Arc',
    titleEm: 'Agent',
    lane: 'Multi-agent systems · orchestration · role specialization · HITL',
    accent: '#f59e0b',
    accentDim: 'rgba(245,158,11,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — shipped multi-agent system',
    why:
      "You've shipped single agents. The next architectural challenge isn't making one agent smarter — it's building systems where specialized agents collaborate on tasks too complex or too broad for any single context window. Researcher agents, writer agents, critic agents, executor agents, coordinator agents — each with defined responsibilities, handoff protocols, shared state, and Human-in-the-Loop checkpoints at decision boundaries. LangGraph for stateful multi-agent graphs, CrewAI for role-based crews, AutoGen for conversational agent networks. The agent team is the architecture pattern for enterprise AI workflows that actually replace knowledge work rather than just assist it.",
    capstone:
      "A deployed multi-agent system handling a real workflow end-to-end — research, synthesis, review, and output — with documented orchestration architecture and HITL decision map. A published 'agent team design pattern' library — the five organizational structures that work and the three that fail in production. The architecture reference that becomes the go-to resource in your consulting engagements.",
    buildPrompt: 'Build The Agent Team Arc — LangGraph, CrewAI, AutoGen, role specialization, HITL checkpoints, multi-agent orchestration patterns',
  },
  {
    id: 'community',
    Icon: Radio,
    title: 'The Community Arc',
    titleEm: 'Community',
    lane: 'Discord · cohort learning · peer network · recurring revenue',
    accent: '#8b5cf6',
    accentDim: 'rgba(139,92,246,0.10)',
    load: 'LOW',
    horizon: '12 mo',
    cert: 'No cert — community metrics as proof',
    why:
      "Content builds authority. Community builds leverage. The practitioners who build networks of other practitioners compound their referral velocity, their deal flow, their early access to emerging tools, and their ability to staff engagements at scale — none of which happens through content alone. A Discord server or Slack community for AI practitioners in a specific niche, a cohort-based program running 2-3 times per year, a peer learning network built around your workshops — these produce recurring revenue from memberships and cohorts while simultaneously becoming the most valuable part of your personal network. The Series 3 Publishing arc creates content. This arc creates the channel that distributes it and the community that amplifies it.",
    capstone:
      "A community of 500+ AI practitioners with documented engagement metrics — not follower counts, participation rates. One cohort-based program run to completion with NPS documented. A recurring revenue stream from memberships or cohort tuition that is independent of active client work. The network layer that means your next five engagements find you rather than requiring you to find them.",
    buildPrompt: 'Build The Community Arc — Discord/Slack community design, cohort program structure, engagement metrics, recurring revenue model, peer network flywheel',
  },
  {
    id: 'aidev',
    Icon: Code2,
    title: 'The AI-Assisted Development Arc',
    titleEm: 'Development',
    lane: 'Copilot Enterprise · automated review · test generation · devex metrics',
    accent: '#059669',
    accentDim: 'rgba(5,150,105,0.10)',
    load: 'LOW',
    horizon: '6 mo',
    cert: 'GitHub Copilot certification (when available)',
    why:
      "GitHub Copilot Enterprise, Cursor, and Claude Code are changing what a solo developer can ship. The enterprise version of this story — rolling out AI-assisted development to a 50-person engineering team, measuring the productivity delta, identifying the workflow patterns that accelerate vs. the ones that regress quality, building the tooling and process layer around AI code generation — is a consulting engagement type that barely exists yet and that Intinc's SMB-to-enterprise client base will need answered. You have personal experience with this stack. Systematizing it and adding the enterprise deployment and measurement layer is a low-effort, high-differentiation arc.",
    capstone:
      "An AI-assisted development program deployed to a real engineering team with before/after productivity metrics. A 'developer AI adoption playbook' — onboarding, workflow patterns, measurement framework, common failure modes. The enterprise consulting offering that turns your own development practice into a repeatable program Intinc can deliver to any technology-adjacent client.",
    buildPrompt: 'Build The AI-Assisted Development Arc — GitHub Copilot Enterprise, Cursor, Claude Code workflows, devex metrics, enterprise developer AI adoption playbook',
  },
];

// ---------------------------------------------------------------------------
// STYLES
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
}
.card:hover { border-color: var(--border-bright); border-left-color: var(--card-accent); transform: translateY(-1px); }
.card.open { border-color: var(--card-accent); }

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
  font-size: 22px; line-height: 1.15; font-weight: 400; margin: 0 0 3px; color: var(--fg);
}
.card-title em { color: var(--card-accent); font-style: italic; }
.card-lane { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-dim); }
.card-chev { color: var(--fg-mute); transition: transform 0.25s, color 0.2s; }
.card.open .card-chev { transform: rotate(90deg); color: var(--card-accent); }

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.card.open .card-body { max-height: 800px; }
.card-body-inner { padding: 4px 20px 18px; border-top: 1px dashed var(--border); margin-top: 4px; }

.why { font-size: 12.5px; color: var(--fg); line-height: 1.65; margin: 14px 0 16px; }
.capstone-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--card-accent); margin-bottom: 5px; }
.capstone { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 13.5px; color: var(--fg); line-height: 1.5; margin: 0 0 16px; }
.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.pill { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 8px; border: 1px solid var(--border-bright); color: var(--fg-dim); }
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
.note h4 { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg); margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
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

export default function Series5Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Five</p>
              <h1 className="title-serif">The <em>depth</em> layer.</h1>
              <p className="title-sub">
                Where horizontal stops compounding and vertical starts. One regulated-industry
                niche, the infrastructure layer under managed APIs, synthetic data as a
                service unlock, generative media as a FlashFusion reconnect, multi-agent
                systems for real workflow replacement, community as compounding network,
                and AI-assisted development as an enterprise program.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>05 of N</strong></div>
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
                    <div className="card-icon"><Icon size={18} strokeWidth={1.5} /></div>
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
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(arc.buildPrompt); }}
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
                <strong>Vertical AI is the highest-leverage arc in this series — and the hardest to sequence.</strong>{' '}
                It requires enough breadth from earlier series to pick the right vertical and
                enough depth to credibly claim it. Don't run it first. Run it after RAG,
                Fine-Tuning, and AI Governance are complete.
              </li>
              <li>
                <strong>Generative Media and AI-Assisted Development are quick-cycle arcs.</strong>{' '}
                Both are LOW load, both are 6-month horizons. Run them in the same window —
                they don't compete and the combined surface area of those two capabilities
                adds more consulting surface area than either alone.
              </li>
              <li>
                <strong>Community has a cold-start problem that can't be solved with effort alone.</strong>{' '}
                It requires prior audience from the Teaching & Publishing arc (Series 4).
                The sequencing dependency is real: don't attempt community before you have
                consistent content producing consistent inbound attention.
              </li>
              <li>
                <strong>Agent Team is Series 5's highest technical compound rate.</strong>{' '}
                It directly unlocks more complex client engagements, richer capstones in
                every subsequent arc, and the orchestration patterns that differentiate
                your work from commodity implementation. Strong case for running it early
                in this series, not last.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
