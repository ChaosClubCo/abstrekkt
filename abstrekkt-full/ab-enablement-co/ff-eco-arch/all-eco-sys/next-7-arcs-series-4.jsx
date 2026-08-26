import { useState } from "react";
import { ChevronRight, Compass, Briefcase, BookOpen, Network, Cpu, Terminal, Share2, PenTool } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 4 — Enterprise layer, governance, memory, channels, authority
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'enterprise-sales',
    Icon: Briefcase,
    title: 'The Enterprise Sales Arc',
    titleEm: 'Sales',
    lane: 'Discovery · RFP · procurement cycles · $50K+ deals',
    accent: '#f59e0b',
    accentDim: 'rgba(245,158,11,0.10)',
    load: 'LOW',
    horizon: '9 mo',
    cert: 'No cert — closed deal as proof',
    why:
      "You can build the solution. The gap is enterprise procurement — how large organizations buy consulting services, what procurement cycles look like, how RFP responses are structured, what legal and security reviews add to deal timelines, how to navigate multi-stakeholder decisions where the technical buyer isn't the budget owner. Intinc operates in this motion. The Head of AIaaS role requires understanding sales as well as delivery. The difference between a $5K project and a $50K engagement is almost never the technical work — it's the sales process surrounding it.",
    capstone:
      "One $50K+ engagement closed through a formal procurement process. A documented enterprise sales playbook — discovery to close for AI consulting — including stakeholder map template, RFP response framework, and an objection library. The proof that you can sell what you build, not just hand it off to someone else to sell.",
    buildPrompt: 'Build The Enterprise Sales Arc — discovery to close for AI consulting, RFP response, stakeholder mapping, $50K+ deal playbook',
  },
  {
    id: 'governance',
    Icon: BookOpen,
    title: 'The AI Governance Arc',
    titleEm: 'Governance',
    lane: 'EU AI Act · model cards · bias testing · compliance docs',
    accent: '#64748b',
    accentDim: 'rgba(100,116,139,0.10)',
    load: 'LOW',
    horizon: '9 mo',
    cert: 'No cert — published governance framework',
    why:
      "Enterprise clients are asking about AI governance before they sign contracts. The EU AI Act is enforceable. US executive order requirements are producing procurement checklists. Model cards, bias evaluation documentation, audit trails for AI decisions, data lineage for training data — these are becoming table stakes for any AI system touching HR, finance, legal, or customer-facing workflows. Most AI practitioners cannot answer these questions in a client meeting. This arc makes you the person who can — and who arrives with documentation rather than just reassurances.",
    capstone:
      "A published responsible AI framework template for client deployments. Model cards for your three most critical agents. A governance checklist mapped to EU AI Act risk tiers. The compliance layer that closes enterprise deals that technical capability alone can't — and that lets Intinc bid on regulated-industry clients.",
    buildPrompt: 'Build The AI Governance Arc — EU AI Act compliance, model cards, bias evaluation, audit trails, responsible AI framework',
  },
  {
    id: 'memory',
    Icon: Network,
    title: 'The Agentic Memory & State Arc',
    titleEm: 'Memory',
    lane: 'Long-term memory · episodic state · MemGPT · persistent agents',
    accent: '#8b5cf6',
    accentDim: 'rgba(139,92,246,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — shipped persistent agent',
    why:
      "Every agent you've built resets. State lives in the conversation window or in a hacky external JSON store. Production agents for enterprise clients need persistent memory — user preferences remembered across sessions, task history that informs future actions, organizational context that outlasts the prompt window. MemGPT, LangMem, Zep, and the emerging memory primitives from OpenAI and Anthropic define where this goes. The capability that separates a chatbot from an AI coworker is almost entirely a memory and state architecture question.",
    capstone:
      "A production agent with persistent episodic and semantic memory — user context that survives session resets, task history that measurably improves future performance. A published 'memory architecture decision guide' — in-context vs. external vs. retrieval-augmented vs. fine-tuned memory, with latency and cost tradeoffs. The capability that justifies enterprise retainer pricing.",
    buildPrompt: 'Build The Agentic Memory & State Arc — MemGPT, LangMem, Zep, persistent episodic memory, memory architecture decision guide',
  },
  {
    id: 'local-ai',
    Icon: Cpu,
    title: 'The Local & Private AI Arc',
    titleEm: 'Private',
    lane: 'Ollama · llama.cpp · Apple Silicon · on-prem inference',
    accent: '#10b981',
    accentDim: 'rgba(16,185,129,0.10)',
    load: 'MED',
    horizon: '9 mo',
    cert: 'No cert — deployed on-prem system',
    why:
      "Not every client can send data to OpenAI or Anthropic. Healthcare, legal, defense, and financial services clients have data residency requirements that make cloud LLMs a non-starter before the technical conversation even begins. Ollama for local model serving, llama.cpp for optimized inference, Apple Silicon MPS and NVIDIA CUDA inference paths, Hugging Face model selection under on-prem constraints — this is the unlock for a segment of enterprise clients that currently can't say yes to AI consulting at all. The gap in the market is real and mostly unserved by generalist AI practitioners.",
    capstone:
      "A deployed on-premises AI system for a real use case with zero cloud LLM dependencies. A 'cloud vs. on-prem AI decision framework' — when private inference is worth the capability and cost tradeoff. The capability that opens the regulated-industry client segment that your current cloud-dependent stack cannot touch.",
    buildPrompt: 'Build The Local & Private AI Arc — Ollama, llama.cpp, Apple Silicon inference, on-prem deployment, cloud vs. on-prem decision framework',
  },
  {
    id: 'devex',
    Icon: Terminal,
    title: 'The Developer Experience & MCP Arc',
    titleEm: 'MCP',
    lane: 'Claude Code · MCP servers · DX design · tooling telemetry',
    accent: '#06b6d4',
    accentDim: 'rgba(6,182,212,0.10)',
    load: 'LOW',
    horizon: '6 mo',
    cert: 'No cert — published MCP server registry presence',
    why:
      "You use Claude Code. You've built MCP servers. You haven't systematized the developer experience layer — how to design MCP tools that AI agents actually invoke correctly, how to build Claude Code workflows that compound rather than just assist, how to instrument developer tooling with the same observability you'd apply to production services. The meta-skill of making AI-assisted development better at scale is increasingly valuable as engineering teams adopt agentic workflows. It's also a FlashFusion service offering that doesn't require enterprise procurement cycles to sell.",
    capstone:
      "Three published, documented MCP servers with usage telemetry attached. A 'Claude Code workflow guide' — the compound patterns vs. the stalling ones. A DX audit framework for AI-assisted development teams. The tooling layer that becomes a repeatable FlashFusion advisory offering delivered in days, not weeks.",
    buildPrompt: 'Build The Developer Experience & MCP Arc — MCP server design, Claude Code workflow patterns, DX audit framework, tooling telemetry',
  },
  {
    id: 'partner',
    Icon: Share2,
    title: 'The Partner Ecosystem Arc',
    titleEm: 'Ecosystem',
    lane: 'Microsoft Solutions Partner · Google Cloud Partner · co-sell',
    accent: '#0ea5e9',
    accentDim: 'rgba(14,165,233,0.10)',
    load: 'LOW',
    horizon: '12 mo',
    cert: 'Microsoft Solutions Partner designation',
    why:
      "You're doing work that qualifies for Microsoft Partner Network benefits and co-sell eligibility. You're not capturing them. Partner programs — Microsoft Solutions Partner designation, Google Cloud Partner, Anthropic's early partner programs — provide deal registration, co-sell support, MDF (marketing development funds), SPIFF incentives, and enterprise introductions that cold outreach cannot replicate. Intinc is already in this motion. This arc builds your personal partner stack: credentials claimed, marketplace listings live, co-sell pipelines opened. The channel leverage that multiplies individual deal capacity without proportionally multiplying effort.",
    capstone:
      "Microsoft Solutions Partner designation achieved. Google Cloud Partner application submitted. At least one co-sell opportunity registered and advanced through the pipeline. A partner ecosystem map — which programs produce which deal types — published as an Intinc resource. The channel infrastructure that makes enterprise introductions systematic rather than accidental.",
    buildPrompt: 'Build The Partner Ecosystem Arc — Microsoft Solutions Partner, Google Cloud Partner, co-sell pipelines, marketplace listings, MDF capture',
  },
  {
    id: 'teaching',
    Icon: PenTool,
    title: 'The Teaching & Publishing Arc',
    titleEm: 'Publishing',
    lane: 'Workshops · writing · content system · authority compounding',
    accent: '#d946ef',
    accentDim: 'rgba(217,70,239,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — published body of work',
    why:
      "You've facilitated AI workshops. You've built skill libraries. You've written runbooks, frameworks, and playbooks. None of it compounds publicly yet. This arc systematizes the teaching layer: a workshop curriculum that can be licensed or delivered repeatedly without rebuilding from scratch, a writing cadence that builds domain authority, a technical publishing practice that produces inbound leads rather than requiring outbound effort. The practitioners who become the people others learn from compound their network effects in ways that pure builders don't. The window to be early in this is narrower than it looks.",
    capstone:
      "A licensable AI workshop curriculum — at least three modules, each deliverable in 90 minutes without customization. A publishing cadence producing one substantive piece per week for six months. An inbound pipeline producing at least one qualified client conversation per month from content alone. The authority layer that makes future sales easier and future rates higher.",
    buildPrompt: 'Build The Teaching & Publishing Arc — licensable workshop curriculum, writing cadence, authority building, inbound pipeline from content',
  },
];

// ---------------------------------------------------------------------------
// STYLES (identical token system)
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
export default function Series4Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Four</p>
              <h1 className="title-serif">The <em>principal</em> layer.</h1>
              <p className="title-sub">
                The arcs that turn a practitioner into someone clients refer to other
                clients. Enterprise sales motion, governance documentation, persistent
                agent memory, private inference for regulated industries, developer
                tooling authority, partner channel leverage, and the publishing practice
                that compounds everything else.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>04 of N</strong></div>
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
                <strong>Six of seven arcs in this series are LOW or MED load.</strong>{' '}
                Series 4 is the first batch where the heavy lifting is positioning and
                infrastructure, not technical depth. These run alongside active technical
                arcs without collision — that's intentional.
              </li>
              <li>
                <strong>Teaching & Publishing has the longest compounding window.</strong>{' '}
                It's marked Ongoing because the returns are time-weighted. Starting it
                in month one produces more value than starting it in month nine — even
                at the same absolute effort level.
              </li>
              <li>
                <strong>Enterprise Sales and Partner Ecosystem reinforce each other.</strong>{' '}
                Partner co-sell pipelines produce enterprise introductions. Enterprise
                sales skills close them. Run both within the same 9-12 month window
                rather than sequentially.
              </li>
              <li>
                <strong>Local & Private AI is a segment unlock, not a replacement stack.</strong>{' '}
                It doesn't replace cloud LLM work — it adds the client tier that cloud
                work categorically cannot serve. The incremental effort is MED-load.
                The incremental addressable market is substantial.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
