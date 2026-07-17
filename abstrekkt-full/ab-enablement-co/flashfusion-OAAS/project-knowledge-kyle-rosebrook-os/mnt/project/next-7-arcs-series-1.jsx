import { useState } from "react";
import {
  ChevronRight, Compass, MessageSquare, Cpu, Code, Monitor,
  Cloud, Workflow, BookOpen, GitBranch, Shield, Network, Briefcase, Megaphone, GraduationCap
} from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 1 — The foundational thirteen. Where everything starts.
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'prompt',
    Icon: MessageSquare,
    title: 'The Prompt Engineering Arc',
    titleEm: 'Prompt',
    lane: 'Systematic prompting · few-shot · chain-of-thought · evals',
    accent: '#f59e0b',
    accentDim: 'rgba(245,158,11,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — documented prompt library as proof',
    why:
      "Everything downstream of this arc assumes you can write a prompt that does what you intend reliably, not occasionally. That means understanding the difference between zero-shot and few-shot, when chain-of-thought reasoning helps vs. when it inflates token cost without improving output, how to structure system prompts for different model behaviors, and how to evaluate prompt quality beyond 'it seemed to work.' The practitioners who skip this arc and build agents directly produce agents that fail in ways they can't diagnose. This is the debugging vocabulary. Learn it before you need to debug production.",
    capstone:
      "A personal prompt library covering your five most common task types, each with documented few-shot examples, a system prompt, and a simple eval showing why it beats the naive version. The habit of treating prompts as code — versioned, testable, improvable — established before the first agent is built.",
    buildPrompt: 'Build The Prompt Engineering Arc — few-shot, chain-of-thought, system prompt design, basic prompt eval methodology',
  },
  {
    id: 'foundations',
    Icon: Cpu,
    title: 'The AI Foundations Arc',
    titleEm: 'Foundations',
    lane: 'LLM mechanics · tokens · context windows · model selection',
    accent: '#6366f1',
    accentDim: 'rgba(99,102,241,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — conceptual fluency as proof',
    why:
      "You don't need to understand backpropagation to build production AI systems. You do need to understand tokens and what they cost, context windows and what happens when you exceed them, the difference between temperature and top-p sampling and when each matters, why the same model behaves differently at different versions, and how retrieval augmentation changes the cost-quality tradeoff. These aren't academic questions — they show up in every architecture decision, every cost estimate, and every client conversation about why something isn't working. Building on top of a technology you don't understand mechanically produces brittle systems you can't explain when they break.",
    capstone:
      "A personal reference document covering token economics, context window management, model selection criteria, and sampling parameters — written in your own words, tested against three real decisions you've had to make. The mental model that makes every tool and framework you learn after this faster to understand.",
    buildPrompt: 'Build The AI Foundations Arc — token mechanics, context windows, model selection framework, sampling parameters, LLM behavior fundamentals',
  },
  {
    id: 'python',
    Icon: Code,
    title: 'The Python Fundamentals Arc',
    titleEm: 'Python',
    lane: 'Scripting · data structures · APIs · first automation',
    accent: '#3b82f6',
    accentDim: 'rgba(59,130,246,0.10)',
    load: 'MED',
    horizon: '6 mo',
    cert: 'No cert — first shipped script as proof',
    why:
      "Every AI framework worth using has a Python API. Every data pipeline runs on Python. Every automation that goes beyond what no-code tools can do requires Python. This isn't about becoming a software engineer — it's about having enough Python to read documentation, modify examples, write a script that hits an API and processes the response, and not be blocked by syntax when the no-code tool runs out of capability. The specific skills that matter for AI work: functions, dictionaries, file I/O, HTTP requests via requests or httpx, JSON parsing, virtual environments, and enough comfort with error messages to debug your own code. Everything else can be looked up as needed.",
    capstone:
      "A Python script that hits a real API, processes the response, and writes structured output — built without copying a tutorial, fixed without asking anyone. The ability to read a LangChain or Anthropic SDK code example and understand what every line does. The floor below which you are blocked by syntax rather than by problems worth solving.",
    buildPrompt: 'Build The Python Fundamentals Arc — functions, data structures, HTTP requests, JSON, file I/O, virtual environments, first API automation script',
  },
  {
    id: 'copilot',
    Icon: Monitor,
    title: 'The Microsoft / Copilot Arc',
    titleEm: 'Copilot',
    lane: 'Copilot Studio · Microsoft 365 · Teams AI · Power Platform',
    accent: '#0078d4',
    accentDim: 'rgba(0,120,212,0.10)',
    load: 'MED',
    horizon: '6 mo',
    cert: 'AI-102 (Azure AI Engineer Associate)',
    why:
      "The majority of enterprise organizations run on Microsoft infrastructure. Copilot Studio is the deployment target for more enterprise AI projects than any other platform. AI-102 is the credential that opens the door to Microsoft Partner Network conversations and validates Azure AI competency to clients who know what certifications mean and which ones don't. This arc is not about Copilot being the best tool — it's about speaking the language of the organizations that are actively buying AI consulting right now. If you can deploy, configure, and troubleshoot Copilot Studio agents in a Microsoft 365 environment and explain what each component costs, you can have a revenue-generating conversation with 60% of the enterprise IT organizations in North America.",
    capstone:
      "AI-102 passed. A Copilot Studio agent deployed in a Microsoft 365 environment with documented architecture and cost model. A clear personal map of what Copilot Studio does well, where it hits walls, and what requires moving to Azure AI Foundry — the comparison that makes you useful to clients who've already bought into the Microsoft stack.",
    buildPrompt: 'Build The Microsoft / Copilot Arc — Copilot Studio deployment, Microsoft 365 AI integration, Teams AI, AI-102 cert prep',
  },
  {
    id: 'cloud',
    Icon: Cloud,
    title: 'The Cloud Fundamentals Arc',
    titleEm: 'Cloud',
    lane: 'AZ-900 · compute · storage · networking · IAM basics',
    accent: '#0ea5e9',
    accentDim: 'rgba(14,165,233,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'AZ-900 (Azure Fundamentals)',
    why:
      "Every AI service runs on cloud infrastructure. Every production deployment requires understanding compute options, storage tiers, network access controls, and identity management well enough to make the right architectural choices and spot the wrong ones in client environments. AZ-900 is not an advanced certification — it's the vocabulary test that proves you understand what you're talking about when the conversation turns to infrastructure. Given the Microsoft-heavy enterprise landscape and the Intinc environment you're operating in, Azure is the right first cloud. The GCP and broader cloud work comes later — this arc builds the mental model that makes every cloud platform easier to understand.",
    capstone:
      "AZ-900 passed. A personal reference covering Azure compute, storage, networking, and IAM concepts with real examples from a deployed resource. The cloud literacy that means you never have to ask what a VNET or a managed identity is in a client meeting.",
    buildPrompt: 'Build The Cloud Fundamentals Arc — Azure compute, storage, networking, IAM, AZ-900 cert prep',
  },
  {
    id: 'workflow',
    Icon: Workflow,
    title: 'The Workflow Automation Arc',
    titleEm: 'Workflow',
    lane: 'n8n · webhooks · triggers · first production automation',
    accent: '#f97316',
    accentDim: 'rgba(249,115,22,0.10)',
    load: 'MED',
    horizon: '6 mo',
    cert: 'No cert — production workflow as proof',
    why:
      "Automation is the most immediately billable AI-adjacent skill available to someone at this stage. n8n covers the widest range of integration patterns with the most flexibility — webhooks, cron triggers, API calls, conditional logic, error handling, and data transformation — without requiring code for the majority of use cases. The first production workflow that saves someone ten hours a week changes how you think about everything else. It's also the layer that makes AI capabilities actually land in real business processes: an LLM call in isolation is a demo; an LLM call wired into a workflow that handles a real business process is a product. Build the automation muscle before the AI muscle, and every AI capability you add after has somewhere to plug into.",
    capstone:
      "Three production n8n workflows running in a real environment, each with error handling, documented trigger logic, and a measured time-savings estimate. The ability to diagram any business process and identify where automation replaces manual steps — before writing a single node. The workflow layer that every future AI capability plugs into.",
    buildPrompt: 'Build The Workflow Automation Arc — n8n production workflows, webhook handling, error logic, API integrations, first automation that saves measurable time',
  },
  {
    id: 'knowledge',
    Icon: BookOpen,
    title: 'The Knowledge Management Arc',
    titleEm: 'Knowledge',
    lane: 'Notion · PKM fundamentals · capture system · retrieval habits',
    accent: '#8b5cf6',
    accentDim: 'rgba(139,92,246,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — consistent system in use as proof',
    why:
      "A self-taught practitioner whose cognitive profile includes 12th-percentile recall memory has one real options: build an external system good enough to compensate, or stay perpetually at the mercy of what happens to surface. This arc builds the foundation of that system — not the mature AI Personal OS that comes in Series 7, but the minimum viable knowledge infrastructure that makes everything else learnable without re-learning it. Notion as the primary store. A capture habit that takes less than 30 seconds. A weekly review that keeps the system honest. The discipline of writing things down not because you're organized, but because you can't afford not to. Everything you learn in every subsequent arc has a home or it evaporates.",
    capstone:
      "A Notion workspace with a working capture inbox, a project tracker, a resource library, and a weekly review protocol — all in active use for 90 consecutive days. The system that means you never spend twenty minutes looking for something you wrote down three weeks ago. The foundation the Personal OS arc builds on top of in Series 7.",
    buildPrompt: 'Build The Knowledge Management Arc — Notion workspace design, capture habit, weekly review, resource library, 90-day usage proof',
  },
  {
    id: 'devtools',
    Icon: GitBranch,
    title: 'The Developer Ecosystem Arc',
    titleEm: 'Developer',
    lane: 'Git · GitHub · VS Code · environment setup · dev hygiene',
    accent: '#ec4899',
    accentDim: 'rgba(236,72,153,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — clean GitHub profile as proof',
    why:
      "The developer toolchain is not the job — it's the infrastructure the job runs on. Git for version control means you can recover from mistakes and collaborate on code without fear. GitHub for remote storage and portfolio visibility means your work is demonstrable to anyone who asks for it. VS Code for a consistent development environment means you're not fighting your tools when you're trying to think. Environment setup hygiene — .env files, virtual environments, .gitignore, SSH keys — means you don't leak secrets or break things in ways that take days to diagnose. These are not advanced skills. They're the defaults that let everything else go faster and safer.",
    capstone:
      "A clean GitHub profile with at least five repositories — including the scripts and automations from the Python arc. A documented personal dev environment setup checklist that takes a new machine from zero to productive in under two hours. The Git workflow that means you've never lost work to a mistake you couldn't reverse.",
    buildPrompt: 'Build The Developer Ecosystem Arc — Git workflow, GitHub profile, VS Code setup, environment hygiene, .env and secrets management',
  },
  {
    id: 'security',
    Icon: Shield,
    title: 'The Security Fundamentals Arc',
    titleEm: 'Security',
    lane: 'CompTIA Security+ · threat modeling · MSP security patterns',
    accent: '#ef4444',
    accentDim: 'rgba(239,68,68,0.10)',
    load: 'MED',
    horizon: '6 mo',
    cert: 'CompTIA Security+',
    why:
      "The managed IT environment you work in treats security as the floor, not a feature. Security+ is the credential that proves you understand that floor: threat vectors, authentication patterns, network security, incident response, and the vocabulary that lets you have a technical security conversation without faking it. For someone who builds AI systems that sit on top of enterprise infrastructure and handle sensitive data, the security baseline isn't optional — it's the thing that prevents you from building something that creates a liability for a client. It also opens doors at Intinc that are currently closed to people without it and positions AI system designs you propose as credible to the security teams who will review them.",
    capstone:
      "Security+ passed. A personal threat model template for AI system deployments — the five attack surfaces that matter most when an LLM is in the stack — applied to one real system you've built. The security vocabulary that means you're the person who raises the right concerns in an architecture review rather than the person who gets surprised by them later.",
    buildPrompt: 'Build The Security Fundamentals Arc — Security+ cert prep, threat modeling for AI systems, authentication patterns, MSP security context',
  },
  {
    id: 'langchain',
    Icon: Network,
    title: 'The LLM Framework Arc',
    titleEm: 'Framework',
    lane: 'LangChain · LlamaIndex · tool calling · first agent',
    accent: '#10b981',
    accentDim: 'rgba(16,185,129,0.10)',
    load: 'MED',
    horizon: '6 mo',
    cert: 'No cert — first shipped agent as proof',
    why:
      "The jump from raw API calls to agents requires a framework unless you want to rebuild routing logic, memory management, and tool calling from scratch on every project. LangChain is the most widely used; LlamaIndex specializes in retrieval-heavy architectures. Learning one well enough to understand its abstractions — chains, tools, retrievers, agents, memory — teaches you the vocabulary the entire AI engineering ecosystem uses. The first agent you build with a framework will be worse than you expected. That's the point. The gap between expectation and output is the real curriculum: understanding what the framework does automatically vs. what you have to design deliberately.",
    capstone:
      "A LangChain agent with at least two tools, a memory layer, and a system prompt that produces consistent behavior across twenty test runs — not just a demo that worked once. A personal 'when to use LangChain vs. raw API vs. n8n' decision framework built from doing all three. The foundation the RAG, Eval, and Multi-Agent arcs in later series build directly on.",
    buildPrompt: 'Build The LLM Framework Arc — LangChain chains and agents, LlamaIndex retrieval basics, tool calling, memory, first production-grade agent',
  },
  {
    id: 'bizformation',
    Icon: Briefcase,
    title: 'The Business Formation Arc',
    titleEm: 'Formation',
    lane: 'LLC · EIN · business banking · contracts · basic accounting',
    accent: '#64748b',
    accentDim: 'rgba(100,116,139,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — operating entity as proof',
    why:
      "The legal and financial infrastructure of a consulting practice is not complicated, but it is load-bearing. An LLC separates personal liability from business liability. An EIN separates personal taxes from business taxes. A business bank account separates personal finances from client revenue and makes accounting tractable. A simple master services agreement prevents the most common consulting disputes before they happen. A basic understanding of pass-through taxation prevents surprises in April. None of this requires a lawyer or an accountant to get right initially — it requires doing the steps in the right order and not skipping any of them. FlashFusion needs this infrastructure in place before the first invoice goes out.",
    capstone:
      "A registered LLC, an EIN, a business bank account, and a signed first MSA — all in place before the first paid engagement. A basic accounting system with income and expense tracking that takes less than 30 minutes per week. The legal and financial foundation that means the first client relationship doesn't create a personal liability.",
    buildPrompt: 'Build The Business Formation Arc — LLC formation, EIN registration, business banking, MSA template, basic bookkeeping system',
  },
  {
    id: 'brand',
    Icon: Megaphone,
    title: 'The Brand & Identity Arc',
    titleEm: 'Brand',
    lane: 'LinkedIn · personal site · positioning statement · content presence',
    accent: '#0891b2',
    accentDim: 'rgba(8,145,178,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — inbound inquiry as proof',
    why:
      "A practitioner with no public presence has to explain who they are in every conversation. A practitioner with a clear, consistent, specific public presence arrives pre-explained. The brand arc is not about audience building — that's the Teaching & Publishing arc in Series 4. It's about having a LinkedIn profile that says something specific rather than nothing in particular, a personal site that demonstrates rather than claims, and a positioning statement that differentiates rather than describes. The specific claim that matters: self-taught AI practitioner building production systems for enterprise clients, with the proof of work visible to anyone who looks. FlashFusion's public identity and your personal identity need to be coherent before the first outbound conversation.",
    capstone:
      "A LinkedIn profile that a prospect can read in two minutes and understand exactly what you do, who you do it for, and why that's different from every other AI consultant they've talked to. A personal site with three proof-of-work artifacts linked. A positioning statement that you can say out loud in 15 seconds and that doesn't sound like it came from a branding workshop. The public presence that makes cold outreach warm before the first word is typed.",
    buildPrompt: 'Build The Brand & Identity Arc — LinkedIn profile optimization, personal site with proof of work, positioning statement, FlashFusion public identity coherence',
  },
  {
    id: 'teaching',
    Icon: GraduationCap,
    title: 'The Teaching Foundations Arc',
    titleEm: 'Teaching',
    lane: 'Workshop facilitation · skill transfer · curriculum basics · first delivery',
    accent: '#d946ef',
    accentDim: 'rgba(217,70,239,0.10)',
    load: 'LOW',
    horizon: '3 mo',
    cert: 'No cert — delivered workshop as proof',
    why:
      "The ability to transfer what you know to someone who doesn't know it yet is a separate skill from knowing it. Most technical practitioners discover this the hard way when they try to explain something they understand deeply and watch the other person's eyes go blank. Teaching foundations covers the mechanics of that transfer: how to structure a workshop so people leave with something they can use rather than a list of things they've been told, how to read a room and adjust rather than delivering the prepared material into a wall of polite confusion, how to design exercises that produce learning rather than just fill time. The consulting model you're building depends on this skill at every level — client discovery, stakeholder alignment, workshop delivery, and the teaching arc in Series 4 that builds the scalable curriculum.",
    capstone:
      "One delivered workshop — 90 minutes minimum, at least five participants who didn't owe you attendance — with a written reflection on what landed and what didn't. A personal facilitation checklist covering room setup, exercise design, timing, and feedback collection. The evidence that you can transfer knowledge under pressure to people with varying starting points.",
    buildPrompt: 'Build The Teaching Foundations Arc — workshop design, facilitation mechanics, exercise design, delivery practice, post-session feedback loop',
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
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 60ch; }
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
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
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

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.45s ease; }
.card.open .card-body { max-height: 900px; }
.card-body-inner { padding: 4px 20px 18px; border-top: 1px dashed var(--border); margin-top: 4px; }

.why { font-size: 12.5px; color: var(--fg); line-height: 1.68; margin: 14px 0 16px; }
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
.note li { margin-bottom: 6px; }
.note strong { color: var(--fg); font-weight: 500; }

.seq-grid {
  margin-top: 20px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.seq-block {
  padding: 12px 14px; border: 1px solid var(--border-bright);
  background: var(--bg);
}
.seq-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 6px; }
.seq-items { font-size: 11px; color: var(--fg); line-height: 1.7; }

@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.5s ease forwards; }
.stagger > *:nth-child(1)  { animation-delay: 0.03s; }
.stagger > *:nth-child(2)  { animation-delay: 0.06s; }
.stagger > *:nth-child(3)  { animation-delay: 0.09s; }
.stagger > *:nth-child(4)  { animation-delay: 0.12s; }
.stagger > *:nth-child(5)  { animation-delay: 0.15s; }
.stagger > *:nth-child(6)  { animation-delay: 0.18s; }
.stagger > *:nth-child(7)  { animation-delay: 0.21s; }
.stagger > *:nth-child(8)  { animation-delay: 0.24s; }
.stagger > *:nth-child(9)  { animation-delay: 0.27s; }
.stagger > *:nth-child(10) { animation-delay: 0.30s; }
.stagger > *:nth-child(11) { animation-delay: 0.33s; }
.stagger > *:nth-child(12) { animation-delay: 0.36s; }
.stagger > *:nth-child(13) { animation-delay: 0.39s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .cards { grid-template-columns: 1fr; }
  .card-head { padding: 16px; }
  .card-title { font-size: 19px; }
  .card-body-inner { padding: 4px 16px 16px; }
  .seq-grid { grid-template-columns: 1fr; }
}
`;

export default function Series1Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series One</p>
              <h1 className="title-serif">The <em>foundation.</em></h1>
              <p className="title-sub">
                Thirteen arcs. Not the most interesting work — the most necessary.
                The vocabulary every subsequent arc assumes. The infrastructure every
                subsequent build runs on. Prompt engineering, AI mechanics, Python,
                the Microsoft stack, cloud basics, workflow automation, knowledge
                management, developer toolchain, security, LLM frameworks, business
                formation, brand, and teaching. In that order, or close to it.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>01 of 07</strong></div>
              <div style={{ marginTop: 4 }}>Total arcs: <strong>13</strong></div>
              <div style={{ marginTop: 4 }}>Tap a card to expand</div>
            </div>
          </div>

          <div className="cards stagger">
            {ARCS.map((arc, i) => {
              const isOpen = open === i;
              const Icon = arc.Icon;
              const style = { ['--card-accent']: arc.accent, ['--card-accent-dim']: arc.accentDim };
              const parts = arc.title.split(arc.titleEm);

              return (
                <div
                  key={arc.id}
                  className={`card ${isOpen ? 'open' : ''}`}
                  style={style}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="card-head">
                    <div className="card-icon"><Icon size={18} strokeWidth={1.5} /></div>
                    <div>
                      <h3 className="card-title">{parts[0]}<em>{arc.titleEm}</em>{parts[1]}</h3>
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
                <strong>Eight arcs can start in month one without prerequisites.</strong>{' '}
                Prompt Engineering, AI Foundations, Cloud Fundamentals, Knowledge Management,
                Developer Ecosystem, Business Formation, Brand, and Teaching Foundations
                have no sequencing dependencies on each other. They can run in parallel
                or in any order.
              </li>
              <li>
                <strong>Python unlocks everything downstream.</strong> The LLM Framework
                arc, the workflow automation arc's advanced patterns, and every S2+ arc
                that involves code assumes Python fluency. If one arc gets focused sprint
                time in month one, it should be this one.
              </li>
              <li>
                <strong>Microsoft / Copilot and Security are the two certification arcs
                in this series.</strong> AI-102 and Security+ both have exam fees, study
                windows, and scheduling constraints. Set the exam date before you start
                studying — it creates the deadline that makes the studying happen.
              </li>
              <li>
                <strong>Business Formation is the only arc that has a hard deadline:
                before the first invoice.</strong> Everything else can be sequenced around
                learning pace. This one is gated by a legal and financial event. Don't
                send an invoice as an individual when you should be sending it as an LLC.
              </li>
            </ul>

            <div className="seq-grid">
              <div className="seq-block">
                <div class="seq-label">Month 1–3 (no prereqs)</div>
                <div class="seq-items">
                  Prompt Engineering<br />
                  AI Foundations<br />
                  Cloud Fundamentals (AZ-900)<br />
                  Knowledge Management<br />
                  Developer Ecosystem<br />
                  Business Formation<br />
                  Brand &amp; Identity<br />
                  Teaching Foundations
                </div>
              </div>
              <div className="seq-block">
                <div class="seq-label">Month 3–9 (after Python)</div>
                <div class="seq-items">
                  Python Fundamentals<br />
                  ↓<br />
                  Workflow Automation<br />
                  Microsoft / Copilot (AI-102)<br />
                  Security Fundamentals (Security+)<br />
                  LLM Framework (LangChain)
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
