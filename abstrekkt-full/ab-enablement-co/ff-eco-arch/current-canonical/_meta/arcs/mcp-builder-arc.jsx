import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Cpu } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month MCP Builder Arc
// Kyle-specific: 50+ connector consumer → ecosystem contributor + server author
// Stack: Claude, Supabase, Cloudflare Workers, n8n, Microsoft Teams, FastMCP/TS SDK
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'FOUNDATIONS',
    subtitle: 'Read the spec before touching the keyboard. First server working. Tool design as craft.',
    months: [
      {
        n: 1,
        title: 'Read the spec — all of it',
        why: 'You have used 50+ MCP connectors. You know the surface. You do not know the protocol. People who build servers without reading the spec build fragile, subtly wrong tools. Forty-five minutes with the spec saves you forty-five hours of debugging.',
        weeks: [
          'Read the MCP specification end to end. Document every concept you could not have defined before: transport lifecycle, capability negotiation, session management, progress notifications.',
          'Transport deep dive: stdio vs. HTTP+SSE vs. WebSocket. Why HTTP+SSE is the default for remote servers, when stdio is correct for local, and what WebSocket buys you.',
          'The three primitives mapped to your existing experience: for each of Tools, Resources, and Prompts, identify one connector in your existing 50+ that uses each well and one that uses it badly.',
          'Capability negotiation and the MCP handshake — document the full exchange from client hello to server ready in a sequence diagram you could teach from.',
        ],
        gate: 'A spec summary in your own words — transport, lifecycle, three primitives, capability negotiation. Something you could use to onboard another developer.',
      },
      {
        n: 2,
        title: 'First server — local, working, tested',
        why: 'Theory ends here. Your first server will not be elegant. That is correct. The goal is working and tested — not beautiful. Pick a real problem you have right now, not a tutorial toy.',
        weeks: [
          'Environment setup: Node/TypeScript MCP SDK AND Python FastMCP. Both connected to a local Claude Desktop session. Understand which SDK to reach for by use case.',
          'First Tool — something you actually use. Not a "get weather" tutorial. A tool that solves a problem in your current stack. One tool, working end to end, with the correct input schema.',
          'First Resource — expose a real data source. Your Supabase schema, a Notion document, or a local file you reference regularly. Static is fine for now.',
          'Write tests before shipping anything. Unit tests for tool execution logic. One integration test that runs the full round-trip against a real Claude Desktop session.',
        ],
        gate: 'A working MCP server — 2 tools and 1 resource, with tests — connected to Claude Desktop and solving a real problem.',
      },
      {
        n: 3,
        title: 'Tool design as craft',
        why: 'Anyone can wrap a function in a tool call. Designing tools that work well with LLMs is a different skill. The description field is a prompt. Schema shape affects reasoning quality. Error responses either help Claude recover or confuse it.',
        weeks: [
          'Description discipline: rewrite the descriptions on your M2 tools as if each one is a system prompt instruction. Test whether Claude uses the tool more accurately after the rewrite.',
          'Input schema design rules: required vs. optional fields, enum vs. open string, nested objects vs. flat. Write down the rules you derive — you will apply them to every tool you build.',
          'Error response design: build a tool that returns structured error shapes. Test which error formats Claude handles gracefully vs. gets confused by. Document the pattern.',
          'Idempotency: build one tool that is safe to call twice and one that is not. Write the side-effect documentation for each. This becomes part of your tool design checklist.',
        ],
        gate: 'A tool design checklist — at least 10 rules you can apply to every tool you write. Applied to your M2 server before moving on.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'BUILD MUSCLE',
    subtitle: 'Auth at production grade. The full primitive surface. Multi-server composition.',
    months: [
      {
        n: 4,
        title: 'Authentication patterns',
        why: 'Every server that connects to a real external service needs auth. Most tutorial MCP servers hardcode an API key in an env file and call it done. Production auth means no key exposure, least-privilege by default, and token rotation that does not break sessions.',
        weeks: [
          'API key auth — the simplest pattern done correctly: key in env, never logged, never echoed in tool responses, never returned in resource content. Build one and audit it deliberately.',
          'OAuth 2.0 for MCP servers — the full flow: authorization endpoint, token exchange, refresh handling, and what happens when the token expires mid-session.',
          'Service principal + managed identity (Microsoft ecosystem) — directly relevant to your Copilot/Azure stack. Build an MCP server that authenticates against a Microsoft API using a service principal.',
          'Scoped token patterns: build a server where different users or contexts get access to different tools. The least-privilege design pattern applied to MCP.',
        ],
        gate: 'Three working auth patterns in your codebase. One documented failure mode per pattern — the thing that will go wrong in production.',
      },
      {
        n: 5,
        title: 'Resources and Prompts — the underused surface',
        why: 'Most public MCP servers are tools-only. Resources and Prompts are underused, which means servers that implement them well stand out in the registry. The full primitive set is also how you build servers that degrade gracefully when a tool is unavailable.',
        weeks: [
          'Resources deep dive — static vs. dynamic resources, subscriptions (resource change notifications), the list-then-read pattern. Build a server where resources update in real time.',
          'Expose a genuinely useful resource from your stack: your Supabase schema as a resource, a live n8n workflow status feed, or a Cloudflare Worker health endpoint.',
          'Prompts primitive — templated prompt patterns exposed via MCP. Build one prompt that encodes a workflow you use repeatedly. Test whether it actually speeds up your Claude usage.',
          'Sampling — the MCP pattern where a server requests LLM completions from the client. Edge case, but essential to understand for agentic server designs. Build a toy implementation.',
        ],
        gate: 'A server using all three primitives (tools + resources + prompts) with a written rationale for why each was the right primitive for its use case.',
      },
      {
        n: 6,
        title: 'Multi-server composition',
        why: 'The real leverage in MCP is composing multiple servers in one session. You have done this as a consumer with 50+ connectors. Doing it with servers you authored is a different experience — you control both sides of every interaction.',
        weeks: [
          'Compose three of your own servers in a single Claude session. Document every namespace collision, every unexpected tool interaction, every capability overlap.',
          'Server naming conventions and namespace design — the decisions that prevent collisions at scale. Write the convention you will use for every server going forward.',
          'Context window pressure under multi-server load — how resource-heavy servers affect reasoning quality when composed with tool-heavy ones. Test it, measure it, write up what you find.',
          'Build a routing server: one MCP server that inspects the request context and delegates to other servers based on domain. The meta-orchestration pattern.',
        ],
        gate: 'A working multi-server composition where you authored all three servers. The routing server is working and dispatching correctly.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'ECOSYSTEM',
    subtitle: 'Production-ready. First registry publish. Five-server portfolio across real domains.',
    months: [
      {
        n: 7,
        title: 'Production-readiness checklist',
        why: 'Local servers are practice. Production means versioning, changelog, backwards compatibility, graceful degradation, and observability. Most public MCP servers in the registry skip every single one of these. Yours will not.',
        weeks: [
          'Versioning strategy: semantic versioning for MCP servers, changelog format, how you communicate breaking changes to consumers. Write the policy before you publish anything.',
          'Error handling at production grade: timeouts with sensible defaults, retry semantics, partial failure handling. What does a consumer do when your tool returns a 503?',
          'Observability: what to log (request shape, response latency, error rate), what never to log (input fields that might contain credentials or PII), and how to surface logs without exposing them.',
          'Backwards compatibility test suite: a set of tests that verify your v2 does not break any v1 consumer. Run this before every release. Automate it.',
        ],
        gate: 'A production-readiness checklist applied to every server you built in Q1–Q2. At least two servers updated as a result.',
      },
      {
        n: 8,
        title: 'First public registry publish',
        why: 'Private servers are practice. A public registry listing is the first real ecosystem contribution — and the thing that makes your Partner Network profile, your Community Ambassador application, and your LinkedIn bio mean something concrete.',
        weeks: [
          'Registry options and submission: Anthropic registry, npm (for TypeScript), PyPI (for Python). Understand each — discoverability, maintenance expectations, versioning policy.',
          'Documentation that actually works: README with a working quick-start that takes under 5 minutes, schema documentation for every tool, example Claude prompts that demonstrate correct usage.',
          'Publish your strongest server — not your first, not your most complex, the one that solves the clearest problem for the widest audience. Run the production checklist from M7 first.',
          'Usage signal: star count, npm/PyPI download count, GitHub issues. Set up a simple way to know if anyone other than you is using it.',
        ],
        gate: 'One server live in a public registry. Complete documentation. At least one person other than you has successfully used it.',
      },
      {
        n: 9,
        title: 'The portfolio — five servers, five domains',
        why: 'One server is a demo. Five servers across distinct domains is a portfolio. Breadth signals that you understand the protocol well enough to apply it to different problem shapes — not just the one you practiced on.',
        weeks: [
          'Portfolio plan: map your stack (Supabase, Microsoft Teams/M365, n8n, Cloudflare Workers, Claude API itself) to four more servers. Each in a different domain, each with a different auth pattern.',
          'Build servers 2 and 3. Different auth patterns from each other. Different primary primitive from server 1. Ship both.',
          'Build servers 4 and 5. At least one must solve a problem you have personally — not a problem you invented for this exercise. Both shipped.',
          'Portfolio presentation: a GitHub repo or landing page that shows all five with a one-paragraph design rationale for each. This is the artifact you link from your bio.',
        ],
        gate: 'Five servers published. Each documented. At least three with measurable external usage (not just your own sessions).',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'DIFFERENTIATION',
    subtitle: 'Flagship reference implementation. Ecosystem contribution. Teach the full arc.',
    months: [
      {
        n: 10,
        title: 'Flagship server — the reference implementation',
        why: 'The portfolio proves breadth. The flagship proves depth. This is the server other developers study — the one that shows what a production-grade, thoughtfully designed MCP server looks like from the inside.',
        weeks: [
          'Spec the flagship: a server that uses tools + resources + prompts + real auth, solves a genuine enterprise problem, and handles failure modes explicitly. Write the spec before writing a line of code.',
          'Build it. Real data, real auth, real error handling, real observability. Every shortcut you would not ship to a client gets fixed before this one goes out.',
          'Architecture Decision Record: why these design choices? Where did you trade simplicity for correctness? What would you do differently in a v2? Published alongside the server.',
          'Write the companion post: "How I designed this MCP server and what I learned." The design rationale, the mistakes, the things the spec does not tell you. Publish it.',
        ],
        gate: 'A flagship server that a thoughtful engineer would study as a reference implementation. ADR and companion post both live.',
      },
      {
        n: 11,
        title: 'Ecosystem contribution — beyond your own servers',
        why: 'The MCP ecosystem is early. The developers who help others get unstuck in year one are remembered in year three. Contributing to others\' work, reviewing designs, and writing the guides that do not exist yet — this is the reputation work that compounds.',
        weeks: [
          'Review five public MCP servers from the registry. Write honest, specific public feedback on at least two — not "great work" but "this error shape will confuse the model because..."',
          'Contribute to one open-source MCP server that is not yours. A real PR that fixes a real problem. Not a typo fix.',
          'Write "MCP server design patterns" — the guide you wish had existed in M1. The naming conventions, the auth patterns, the tool design rules, the multi-server composition patterns. All of it.',
          'Submit a talk or workshop proposal: "MCP server authorship for enterprise developers." CLC, a local tech meetup, or a conference CFP. Get it on a calendar.',
        ],
        gate: 'A public contribution beyond your own servers. A submitted talk proposal with a confirmed date or a live CFP submission.',
      },
      {
        n: 12,
        title: 'Teach, publish, close the arc',
        why: 'You do not own this knowledge until you can transfer it without notes. The workshop closes the Community Ambassador loop, the published guide closes the Partner Network loop, and the retrospective tells you what the next arc actually is.',
        weeks: [
          'Run the MCP server authorship workshop — at CLC, Intinc, or a Community Ambassador event. Use M1–M11 as the curriculum backbone. The spec, the first server, tool design, auth, portfolio.',
          'Publish the complete MCP builder guide: spec → first server → auth → full primitive set → production → portfolio. The definitive practitioner guide. Yours, dated, with real examples.',
          'Update everything: Partner Network profile with portfolio links and the guide, LinkedIn with the five servers and the workshop, Community Ambassador impact report if applicable.',
          'Retrospective: what changed in your mental model of how Claude actually uses tools? What surprised you about the ecosystem? What is Y2 — deeper MCP (framework contributions, spec feedback), or pivot to RAG and the data layer?',
        ],
        gate: 'Workshop delivered. Guide published. Portfolio and Partner Network profile updated. Three developers are building MCP servers because of your work.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES — MCP Builder Arc / electric violet on deep purple-black
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #07060e;
  --bg-2: #0e0c18;
  --fg: #eceaf8;
  --fg-dim: #9b94c4;
  --accent: #8b5cf6;
  --accent-2: #a78bfa;
  --gate: #f472b6;
  --muted: #4a4268;
  --card: #100e1a;
  --border: #1e1a30;
  --border-bright: #2d2845;
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
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.09), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(244,114,182,0.05), transparent 70%),
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

/* ---- PRIMITIVE STRIP ---- */
.primitive-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 48px;
  border: 1px solid var(--border);
}
.primitive {
  padding: 16px 18px;
  border-right: 1px solid var(--border);
  position: relative;
}
.primitive:last-child { border-right: none; }
.prim-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 6px;
}
.prim-name {
  font-family: 'Instrument Serif', serif;
  font-size: 24px;
  font-style: italic;
  color: var(--accent);
  font-weight: 400;
  margin-bottom: 3px;
}
.prim-month {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
.prim-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--border);
}
.prim-bar-fill {
  height: 100%;
  background: var(--accent);
}

/* ---- TRADEOFF ---- */
.tradeoff {
  border: 1px solid var(--accent);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(139,92,246,0.08), rgba(139,92,246,0.01));
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
.qtab:hover { background: var(--bg-2); color: var(--fg); }
.qtab.active { color: var(--fg); background: var(--bg-2); }
.qtab.active::before {
  content: '';
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
}
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
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

/* ---- MONTH CARDS ---- */
.months { display: grid; gap: 16px; }
.month {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 0.2s;
}
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--accent); }

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
.month-why { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }

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
.week.done { border-left-color: var(--accent); background: rgba(139,92,246,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(139,92,246,0.45); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* ---- GATE — rose/pink variant for "shipped artifact" ---- */
.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(244,114,182,0.35);
  background: rgba(244,114,182,0.05);
  align-items: start;
}
.gate-icon { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
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
.progress-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

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
.claims code { color: var(--accent-2); background: rgba(139,92,246,0.12); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.12s; }
.stagger > *:nth-child(3) { animation-delay: 0.20s; }
.stagger > *:nth-child(4) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .primitive-strip { grid-template-columns: 1fr 1fr; }
  .primitive:nth-child(2) { border-right: none; }
  .primitive:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
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
// PRIMITIVES — coverage tracker per quarter
// ---------------------------------------------------------------------------
const PRIMITIVES = [
  { label: 'Primitive',  name: 'Tools',     month: 'M1–M3',  coverage: 100 },
  { label: 'Primitive',  name: 'Resources', month: 'M5',     coverage: 42  },
  { label: 'Primitive',  name: 'Prompts',   month: 'M5',     coverage: 42  },
  { label: 'Primitive',  name: 'Sampling',  month: 'M5',     coverage: 42  },
];

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function MCPBuilderArc() {
  const [activeQ, setActiveQ]   = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done, setDone]         = useState(new Set());

  const totalWeeks = 48;
  const pct        = Math.round((done.size / totalWeeks) * 100);

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
              <p className="kicker"><Cpu size={12} /> Learning Ops // Developer Ecosystem Lane</p>
              <h1 className="title-serif">The <em>MCP Builder</em> Arc.</h1>
              <p className="title-sub">
                12 months. From 50+ connector consumer to ecosystem contributor.
                Protocol foundations, production auth, the full primitive surface, a five-server
                portfolio, and a flagship reference implementation. Four phases, forty-eight
                weekly sprints, twelve gated artifacts.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Registry target: <strong>5 servers published</strong></div>
              <div style={{ marginTop: 4 }}>Gate: <strong>Flagship ADR live, M10</strong></div>
            </div>
          </div>

          {/* PRIMITIVE COVERAGE STRIP */}
          <div className="primitive-strip stagger">
            {PRIMITIVES.map((p) => (
              <div key={p.name} className="primitive">
                <div className="prim-label">{p.label}</div>
                <div className="prim-name">{p.name}</div>
                <div className="prim-month">First covered {p.month}</div>
                <div className="prim-bar">
                  <div className="prim-bar-fill" style={{ width: `${p.coverage}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — this is ecosystem investment, not direct revenue.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Building and publishing MCP servers is reputation work. It does not directly bill to
                Intinc or FlashFusion clients. The payoff is longer-term — Partner Network credibility,
                Community Ambassador proof, and "the person who actually builds the tools" positioning.
                Read both columns before committing hours.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>Partner Network listing gains substance — case studies become registry links</li>
                    <li>Community Ambassador proof — you build the ecosystem, you do not just use it</li>
                    <li>Protocol-level understanding makes you a better consumer of every MCP connector</li>
                    <li>Five public servers is a portfolio no one else in Lake County has right now</li>
                    <li>MCP ecosystem is early — contributing now means being cited when it matures</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>3–5 hrs/week that could go toward billable client delivery or Claude cert depth</li>
                    <li>Publishing requires ongoing maintenance — servers rot when the underlying API changes</li>
                    <li>Registry discoverability is uncertain — you might publish five servers no one finds</li>
                    <li>Protocol spec is evolving — M1 knowledge may shift by M9; plan to re-read the spec mid-arc</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Recommended sequencing:</strong> start
                this arc after Claude Architect Foundations closes (Claude Arc M1). The exam requires
                MCP scoping knowledge — use M1 of this arc to deepen what you studied, not to learn
                it for the first time.
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
                          const key   = `${m.n}-${wi}`;
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
                                : <Circle      size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Shipped artifact gate · M{m.n}</div>
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
                <strong style={{ color: 'var(--fg)' }}>Re-read the spec at M6 and M10.</strong> The MCP specification
                is actively evolving. What you learn in M1 may shift — new transport options, primitive changes, registry
                requirements. Do not treat the spec as static. Schedule a re-read before Q3 and before the flagship build.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Both SDKs are worth learning.</strong> <code>FastMCP</code> (Python)
                is faster to prototype with. The TypeScript SDK gives you better alignment with the Cloudflare Workers and
                n8n parts of your stack. M2 covers both — do not skip one because the other feels more familiar.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The five-server goal is achievable only if server scope is tight.</strong>
                Each server should solve one clearly bounded problem. Scope creep kills the portfolio goal — a server that
                tries to do three things is a server that takes three times as long and ships half as well.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Registry discoverability is not guaranteed.</strong> The Anthropic
                registry is newer than npm or PyPI. Discovery is uncertain. Plan for servers being found via your Partner
                Network profile and LinkedIn, not organic registry search.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Maintenance is the hidden cost.</strong> Five published servers
                means five surface areas that can break when an upstream API changes. Build maintenance-friendly servers
                from M7 onward — versioned, logged, with a clear deprecation protocol.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The flagship (M10) is the artifact that matters externally.</strong>
                If the arc compresses, protect M10, M11, and M12. The portfolio proves you can build. The flagship proves
                you can build well. The ecosystem contribution proves you care about the field, not just your own work.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
