import React, { useState } from 'react';
import { ChevronRight, Compass, Cloud, Layers, Server, ClipboardCheck, Mic, LineChart, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 2 — Next 7 candidate arcs after the foundational thirteen
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'gcp',
    Icon: Cloud,
    title: 'The GCP / Vertex AI Arc',
    titleEm: 'GCP',
    lane: 'Cloud infrastructure · Google ML Engineer cert',
    accent: '#4285f4',
    accentDim: 'rgba(66,133,244,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'Google Professional ML Engineer',
    why:
      "Google ML Engineer is already on your cert list and you've flagged GCP as a 3–6 month ramp given your Microsoft-heavy background. This arc builds that ramp deliberately: Vertex AI, Cloud Run, BigQuery, IAM, Artifact Registry, and the ML pipeline tooling the exam actually tests. Without this arc, the Gemini arc's M11 cert attempt is under-prepared.",
    capstone:
      "Google Professional ML Engineer cert passed. A production Vertex AI pipeline deployed. A comparison doc — 'When to use Azure ML vs. Vertex AI' — that earns Partner Network credibility with multi-cloud clients.",
    buildPrompt: 'Build The GCP / Vertex AI Arc — cloud infrastructure and ML Engineer cert prep',
  },
  {
    id: 'fullstack',
    Icon: Layers,
    title: 'The Full-Stack AI App Arc',
    titleEm: 'App',
    lane: 'Next.js · FastAPI · auth · Vercel',
    accent: '#e879f9',
    accentDim: 'rgba(232,121,249,0.10)',
    load: 'HIGH',
    horizon: '12 mo',
    cert: 'Portfolio-based — no exam',
    why:
      "Every agent you've shipped runs in n8n, Copilot Studio, or Claude Desktop. None of them are user-facing products with auth, a database, and a UI a non-technical user can actually open. The gap between automation and product is a full-stack app. This arc closes it: Next.js or SvelteKit frontend, FastAPI or Hono backend, Supabase for data, Vercel for deployment, Clerk or Auth.js for auth. The output is a product a stranger can use.",
    capstone:
      "A deployed user-facing AI application with real authentication, a real database, and at least one user who didn't know you personally before they signed up. The product that closes the 'can you actually ship a product?' question.",
    buildPrompt: 'Build The Full-Stack AI App Arc — Next.js + FastAPI + auth + Vercel deployment',
  },
  {
    id: 'azure',
    Icon: Server,
    title: 'The Azure AI Foundry Arc',
    titleEm: 'Foundry',
    lane: 'Azure OpenAI · Prompt Flow · enterprise ML',
    accent: '#6366f1',
    accentDim: 'rgba(99,102,241,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'AI-102 deepening',
    why:
      "Copilot Studio is the surface layer. Azure AI Foundry is the engineering layer underneath it — Azure OpenAI Service endpoints, Prompt Flow for multi-step pipelines, Azure ML for model deployment, Semantic Kernel for orchestration. The Head of AIaaS role needs someone who can operate at both layers. This arc separates 'Copilot Studio implementer' from 'Microsoft AI engineer.'",
    capstone:
      "A Foundry-backed agent deployed to an Azure endpoint. A published architecture comparison: Copilot Studio vs. Azure AI Foundry — when to use which and why. The artifact that makes Intinc a credible Microsoft AI partner, not just a Copilot reseller.",
    buildPrompt: 'Build The Azure AI Foundry Arc — Azure OpenAI, Prompt Flow, enterprise ML',
  },
  {
    id: 'eval',
    Icon: ClipboardCheck,
    title: 'The Agentic Evaluation Arc',
    titleEm: 'Evaluation',
    lane: 'LangSmith · Braintrust · CI/CD for AI quality',
    accent: '#eab308',
    accentDim: 'rgba(234,179,8,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No official cert — depth-based',
    why:
      "Your eval work across arcs has been instrumental — a means to prove improvements, not a discipline in itself. This arc makes eval a first-class skill: LangSmith or Braintrust mastered rather than sampled, golden dataset design as a repeatable practice, LLM-as-judge calibration documented and defensible, CI/CD quality gates that catch regressions before production. The rare skill that lets you prove your agents work — not claim they do.",
    capstone:
      "A production eval harness running as CI/CD across your most critical agent. Public LangSmith or Braintrust traces that demonstrate eval methodology. An 'agentic eval playbook' that becomes the most-cited artifact in your Partner Network profile.",
    buildPrompt: 'Build The Agentic Evaluation Arc — LangSmith, Braintrust, CI/CD for AI quality',
  },
  {
    id: 'voice',
    Icon: Mic,
    title: 'The Voice & Realtime Arc',
    titleEm: 'Realtime',
    lane: 'OpenAI Realtime · streaming · sub-700ms agents',
    accent: '#a855f7',
    accentDim: 'rgba(168,85,247,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No official cert — shipped artifact',
    why:
      "Text chat is the current interaction paradigm. Voice is the next one. OpenAI Realtime API, Claude streaming patterns, Whisper for transcription, TTS for response, WebRTC transport, sub-700ms turn latency design. The enterprise use cases — meeting assistants, call center AI, voice-first internal tools — are arriving faster than most practitioners are ready for. Almost nobody on the independent consultant side is actually building them well yet.",
    capstone:
      "A deployed voice agent with measured sub-700ms turn latency. One real workflow that works genuinely better as voice than text — documented with before/after comparison. The proof artifact that the Voice & Realtime lane is yours.",
    buildPrompt: 'Build The Voice & Realtime Arc — OpenAI Realtime, streaming, sub-700ms voice agents',
  },
  {
    id: 'product',
    Icon: LineChart,
    title: 'The AI Product Strategy Arc',
    titleEm: 'Strategy',
    lane: 'PRDs · roadmapping · AI metrics · advisory',
    accent: '#f43f5e',
    accentDim: 'rgba(244,63,94,0.10)',
    load: 'LOW',
    horizon: '9 mo',
    cert: 'PSPO or similar (optional)',
    why:
      "You can build production AI systems. The gap between that and advising enterprise leadership on what AI systems to build — writing PRDs for agentic features, running user research on AI workflows, defining 'done' for an AI product, roadmapping what comes after the pilot — is a product thinking skill, not a technical one. This arc is the fastest path to the strategic advisory layer that the Head of AIaaS role will eventually require. Practitioners who can think in both engineering and product terms are rare.",
    capstone:
      "An AI product strategy document for a real Intinc initiative or FlashFusion client engagement. A PRD template for agentic features that Daniel could hand to a client. The artifact that signals you advise on AI strategy, not just implement it.",
    buildPrompt: 'Build The AI Product Strategy Arc — PRDs, roadmapping, AI metrics, advisory layer',
  },
  {
    id: 'cloudflare',
    Icon: Zap,
    title: 'The Cloudflare Edge AI Arc',
    titleEm: 'Edge',
    lane: 'Workers AI · Vectorize · D1 · AI Gateway',
    accent: '#fb923c',
    accentDim: 'rgba(251,146,60,0.10)',
    load: 'LOW',
    horizon: '9 mo',
    cert: 'No official cert — registry presence',
    why:
      "You already use Cloudflare Workers for webhook relays and proxy patterns. Workers AI, Vectorize (Cloudflare's vector DB), D1 (SQL at the edge), R2 (storage), and AI Gateway let you build AI applications at the edge with sub-50ms response times and no cold starts. The deployment pattern for AI workloads that can't tolerate latency — real-time inference, low-latency RAG, streaming AI responses, agent middleware. The most underused layer in your existing stack.",
    capstone:
      "Five Workers AI deployments to production. An 'AI at the edge' architecture guide published — patterns for when edge inference beats serverless. The Cloudflare AI stack added to your Partner Network capability listing.",
    buildPrompt: 'Build The Cloudflare Edge AI Arc — Workers AI, Vectorize, D1, AI Gateway',
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

/* HEADER */
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

/* CARD GRID */
.cards {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
}

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

.why {
  font-size: 12.5px; color: var(--fg); line-height: 1.65;
  margin: 14px 0 16px;
}

.capstone-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--card-accent); margin-bottom: 5px;
}
.capstone {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 13.5px; color: var(--fg); line-height: 1.5;
  margin: 0 0 16px;
}

.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.pill {
  font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 4px 8px; border: 1px solid var(--border-bright); color: var(--fg-dim);
}
.pill.cert {
  border-color: var(--card-accent-dim); color: var(--card-accent);
  background: var(--card-accent-dim);
}

.build-cta {
  display: block; width: 100%;
  padding: 12px 14px; background: transparent;
  border: 1px solid var(--card-accent); color: var(--card-accent);
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.build-cta:hover { background: var(--card-accent); color: var(--bg); }

.prompt-readout {
  margin-top: 8px; padding: 10px 12px;
  background: var(--bg-2); border: 1px dashed var(--border-bright);
  font-size: 11px; color: var(--fg-dim); line-height: 1.45;
  font-style: italic;
}
.prompt-readout strong { color: var(--fg); font-weight: 500; font-style: normal; }

/* SEQUENCE NOTE */
.note {
  margin-top: 36px; padding: 18px 20px;
  border: 1px solid var(--border); background: var(--bg-2);
  font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.note h4 {
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg); margin: 0 0 10px;
  display: flex; align-items: center; gap: 6px;
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
export default function Series2Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Two</p>
              <h1 className="title-serif">The next <em>seven</em> arcs.</h1>
              <p className="title-sub">
                After the foundational thirteen — platform depth, business formation,
                developer ecosystem, security, knowledge layer, workflow ops, brand,
                and teaching — these are the next layer. Two infrastructure pre-reqs,
                two product-vs-automation gaps, two discipline deepeners, one leverage
                play on a stack you already own.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>02 of N</strong></div>
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
                <strong>GCP and Azure Foundry are pre-reqs for arcs already built.</strong>
                {' '}GCP feeds the Gemini arc's M11 cert attempt. Azure Foundry deepens the
                Copilot arc's Head-of-AIaaS positioning at the engineering layer. Building these
                before the arcs they support is more useful than after.
              </li>
              <li>
                <strong>Two HIGHs do not run in parallel.</strong> GCP and Full-Stack are HIGH-load
                arcs. Running both simultaneously alongside two existing technical arcs and an
                exam window collides on weeks 4–8 of the typical month structure.
              </li>
              <li>
                <strong>Three arcs are LOW or MED load and slot in alongside almost anything.</strong>
                {' '}Cloudflare Edge, AI Product Strategy, and Agentic Evaluation can run beside the
                heavier lanes. They produce different leverage — infrastructure, advisory, and
                quality discipline respectively.
              </li>
              <li>
                <strong>Voice & Realtime is the only arc where the market window matters.</strong>
                {' '}Text-to-voice is the interaction shift. The advantage of being early is real
                but compresses fast. If you build it, build it within the next nine months.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
