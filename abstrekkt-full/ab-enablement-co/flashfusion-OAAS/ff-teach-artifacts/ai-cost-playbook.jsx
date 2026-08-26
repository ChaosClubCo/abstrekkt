import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  GitBranch, Package, Server, Mic, Mail, FileText, Activity,
  ArrowRight, Check, Copy, ChevronDown, ChevronRight, X,
  Layers, Database, Cpu, Code2, Globe, Lock, Send, Eye, EyeOff,
  CircleDot, Zap, Trash2, RefreshCw, BookOpen, Hash, Clock,
  Sparkles, ExternalLink, Download, MessageSquare, AlertCircle,
  CheckCircle2, Circle, Target, TrendingUp, Pause, Play
} from "lucide-react";

/* ============================================================
   GLOBAL STYLE — matches Artifact 1 / The Cockpit
   ============================================================ */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  .ff-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .ff-sans { font-family: 'Geist', ui-sans-serif, system-ui, sans-serif; }
  .ff-serif { font-family: 'Instrument Serif', ui-serif, serif; }

  .grid-bg {
    background-image:
      linear-gradient(to right, rgba(163,230,53,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(163,230,53,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .scan-bg::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255,255,255,0.012) 0px,
      rgba(255,255,255,0.012) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  .blink { animation: blink 1.1s step-end infinite; }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(163,230,53,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(163,230,53,0); }
  }
  .pulse-glow { animation: pulse-glow 2.4s ease-in-out infinite; }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slide-up 0.4s ease-out both; }

  @keyframes flow-dot {
    0%   { offset-distance: 0%;   opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }
  .flow-dot { animation: flow-dot 2.6s linear infinite; }
  .flow-dot.delay-1 { animation-delay: 0.65s; }
  .flow-dot.delay-2 { animation-delay: 1.30s; }
  .flow-dot.delay-3 { animation-delay: 1.95s; }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .fade-in { animation: fade-in 0.5s ease-out both; }

  .tnum { font-variant-numeric: tabular-nums; }
  .slim-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .slim-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
  .slim-scroll::-webkit-scrollbar-thumb:hover { background: #404040; }

  /* code blocks */
  .code-block {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    line-height: 1.65;
    color: #d4d4d4;
    background: #0a0a0a;
    padding: 16px;
    border: 1px solid #1c1c1c;
    overflow-x: auto;
    white-space: pre;
  }
  .code-block .kw  { color: #c084fc; }
  .code-block .str { color: #a3e635; }
  .code-block .com { color: #525252; font-style: italic; }
  .code-block .fn  { color: #fbbf24; }
  .code-block .num { color: #f87171; }
  .code-block .typ { color: #38bdf8; }
`;

/* ============================================================
   ARCHITECTURE PATTERNS — code samples + flow definitions
   All samples updated to May 2026 model IDs
   ============================================================ */
const ARCHITECTURE_PATTERNS = [
  {
    id: "middleware",
    name: "Middleware Injection",
    icon: Layers,
    tagline: "Drop-in middleware file customers add to their codebase",
    pros: [
      "Zero infra to maintain on customer side",
      "Code lives in customer's repo (audit-friendly)",
      "Works with any framework (Next.js, Express, Hono)"
    ],
    cons: [
      "Customer must update middleware when rules change",
      "Requires deploy to apply new optimizations",
      "Cache lives client-side (cross-instance miss risk)"
    ],
    bestFor: "Teams with Next.js / Node API routes who want full visibility into the optimization layer.",
    code: `<span class="com">// /middleware/ai-cost-optimizer.ts</span>
<span class="kw">import</span> { createClient } <span class="kw">from</span> <span class="str">'@ai-cost-optimizer/sdk'</span>;
<span class="kw">import</span> Anthropic <span class="kw">from</span> <span class="str">'@anthropic-ai/sdk'</span>;

<span class="kw">const</span> optimizer = createClient({
  apiKey: process.env.<span class="typ">COST_OPTIMIZER_API_KEY</span>!,
  orgId:  process.env.<span class="typ">COST_OPTIMIZER_ORG_ID</span>!
});

<span class="kw">const</span> anthropic = <span class="kw">new</span> Anthropic({ apiKey: process.env.<span class="typ">ANTHROPIC_API_KEY</span>! });

<span class="kw">export async function</span> <span class="fn">optimizeRequest</span>(body: <span class="typ">MessageCreateParams</span>) {
  <span class="kw">const</span> requestId = <span class="kw">await</span> optimizer.<span class="fn">track</span>({
    model: body.model,
    estimatedTokens: <span class="fn">estimateTokens</span>(body.messages)
  });

  <span class="com">// 1. MODEL ROUTING — May 2026 pricing</span>
  <span class="com">// Sonnet 4.6 ($3/$15) → Haiku 4.5 ($1/$5) for short prompts</span>
  <span class="kw">const</span> tokens = <span class="fn">estimateTokens</span>(body.messages);
  <span class="kw">if</span> (tokens < <span class="num">500</span> && body.model === <span class="str">'claude-sonnet-4-6'</span>) {
    body.model = <span class="str">'claude-haiku-4-5'</span>;
  }

  <span class="com">// 2. CACHE CHECK (semantic hash, server-side TTL)</span>
  <span class="kw">const</span> cached = <span class="kw">await</span> optimizer.cache.<span class="fn">get</span>(<span class="fn">hash</span>(body.messages));
  <span class="kw">if</span> (cached) <span class="kw">return</span> cached;

  <span class="com">// 3. PROMPT CACHING — Anthropic's native (90% off cached tokens)</span>
  <span class="kw">if</span> (body.system?.length > <span class="num">1024</span>) {
    body.system = [{
      type: <span class="str">'text'</span>,
      text: body.system,
      cache_control: { type: <span class="str">'ephemeral'</span> }
    }];
  }

  <span class="com">// 4. CALL ANTHROPIC</span>
  <span class="kw">const</span> response = <span class="kw">await</span> anthropic.messages.<span class="fn">create</span>(body);

  <span class="kw">await</span> optimizer.<span class="fn">trackCompletion</span>({ requestId, usage: response.usage });
  <span class="kw">await</span> optimizer.cache.<span class="fn">set</span>(<span class="fn">hash</span>(body.messages), response, <span class="num">3600</span>);

  <span class="kw">return</span> response;
}`,
  },
  {
    id: "sdk",
    name: "SDK Integration",
    icon: Package,
    tagline: "Drop-in npm package — replace one import",
    pros: [
      "Lowest friction (one-line code change)",
      "Auto-updates with package version",
      "Type-safe wrapper around Anthropic/OpenAI SDKs"
    ],
    cons: [
      "Adds dependency to customer's package.json",
      "Network call to fetch active optimizations",
      "TypeScript types must track upstream SDK changes"
    ],
    bestFor: "Greenfield projects or teams comfortable adding a small dependency.",
    code: `<span class="com">// BEFORE — direct Anthropic SDK</span>
<span class="kw">import</span> Anthropic <span class="kw">from</span> <span class="str">'@anthropic-ai/sdk'</span>;
<span class="kw">const</span> client = <span class="kw">new</span> Anthropic({ apiKey: process.env.<span class="typ">ANTHROPIC_API_KEY</span> });

<span class="kw">const</span> response = <span class="kw">await</span> client.messages.<span class="fn">create</span>({
  model: <span class="str">'claude-sonnet-4-6'</span>,
  max_tokens: <span class="num">1024</span>,
  messages: [{ role: <span class="str">'user'</span>, content: prompt }]
});


<span class="com">// AFTER — drop-in SDK from @ai-cost-optimizer</span>
<span class="kw">import</span> { optimizeClaude } <span class="kw">from</span> <span class="str">'@ai-cost-optimizer/sdk'</span>;

<span class="kw">const</span> response = <span class="kw">await</span> <span class="fn">optimizeClaude</span>({
  model: <span class="str">'claude-sonnet-4-6'</span>,    <span class="com">// auto-swapped to Haiku 4.5 if simple</span>
  max_tokens: <span class="num">1024</span>,
  messages: [{ role: <span class="str">'user'</span>, content: prompt }]
});

<span class="com">// SDK transparently:</span>
<span class="com">//  - Swaps model based on token count + complexity</span>
<span class="com">//  - Checks Anthropic prompt cache (90% off)</span>
<span class="com">//  - Compresses verbose prompts (Sonnet 4.6 → 30% shorter)</span>
<span class="com">//  - Tracks usage for the dashboard</span>
<span class="com">//  - Returns identical Anthropic.Message shape</span>`,
  },
  {
    id: "proxy",
    name: "Proxy Server",
    icon: Server,
    tagline: "Route API calls through our hosted proxy",
    pros: [
      "Zero customer code changes (just swap base URL)",
      "Centralized cache (cross-instance hits)",
      "Optimization rules update without redeploys"
    ],
    cons: [
      "Adds network hop (5-30ms latency)",
      "Customer trusts proxy with API keys",
      "Single-point-of-failure if proxy is down"
    ],
    bestFor: "Customers who can't or won't modify their codebase — perfect for legacy systems and non-engineering teams.",
    code: `<span class="com">// CUSTOMER CODE — unchanged structure, swapped URL</span>
<span class="kw">const</span> response = <span class="kw">await</span> <span class="fn">fetch</span>(
  <span class="str">'https://proxy.ai-cost-optimizer.com/v1/anthropic/messages'</span>,
  {
    method: <span class="str">'POST'</span>,
    headers: {
      <span class="str">'x-cost-optimizer-key'</span>: process.env.<span class="typ">COST_OPTIMIZER_KEY</span>,
      <span class="str">'x-cost-optimizer-org'</span>: process.env.<span class="typ">COST_OPTIMIZER_ORG</span>,
      <span class="str">'content-type'</span>: <span class="str">'application/json'</span>
    },
    body: <span class="typ">JSON</span>.<span class="fn">stringify</span>({
      model: <span class="str">'claude-sonnet-4-6'</span>,
      max_tokens: <span class="num">1024</span>,
      messages: [{ role: <span class="str">'user'</span>, content: prompt }]
    })
  }
);


<span class="com">// PROXY-SIDE (our infrastructure)</span>
app.<span class="fn">post</span>(<span class="str">'/v1/anthropic/messages'</span>, <span class="kw">async</span> (req, res) => {
  <span class="kw">const</span> { orgId, key } = <span class="fn">verifyAuth</span>(req.headers);
  <span class="kw">const</span> opts = <span class="kw">await</span> <span class="fn">getOptimizations</span>(orgId);
  <span class="kw">let</span> body = req.body;

  <span class="com">// Apply approved optimizations on the wire</span>
  <span class="kw">if</span> (opts.routing) body = <span class="fn">applyRouting</span>(body, opts);
  <span class="kw">if</span> (opts.caching) {
    <span class="kw">const</span> hit = <span class="kw">await</span> redis.<span class="fn">get</span>(\`cache:\${orgId}:\${<span class="fn">hash</span>(body)}\`);
    <span class="kw">if</span> (hit) <span class="kw">return</span> res.<span class="fn">json</span>(<span class="typ">JSON</span>.<span class="fn">parse</span>(hit));
  }

  <span class="kw">const</span> upstream = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'https://api.anthropic.com/v1/messages'</span>, {
    headers: { <span class="str">'x-api-key'</span>: <span class="kw">await</span> <span class="fn">getCustomerKey</span>(orgId) },
    body: <span class="typ">JSON</span>.<span class="fn">stringify</span>(body)
  });

  <span class="kw">await</span> <span class="fn">trackUsage</span>(orgId, upstream);
  res.<span class="fn">json</span>(<span class="kw">await</span> upstream.<span class="fn">json</span>());
});`,
  }
];

/* ============================================================
   INTERVIEW SCRIPTS
   ============================================================ */
const INTERVIEW_SECTIONS = [
  {
    id: "current",
    title: "Current State",
    duration: "8 min",
    questions: [
      { id: "q1", q: "Walk me through your AI usage. What are you using LLMs for?",
        listen: "Customer support, content gen, code assist, data analysis. Follow-up: which is highest volume?" },
      { id: "q2", q: "Roughly how much are you spending monthly on AI APIs?",
        listen: "Ranges: <$500 | $500–2K | $2K–10K | $10K–50K | $50K+. If hesitant: 'Ballpark is fine—I'm just trying to gauge scale.'" },
      { id: "q3", q: "Who sees the bill? Engineering? Finance? CEO?",
        listen: "'Finance freaked out last month' = pain indicator. Follow-up: 'What happened when the bill spiked?'" },
      { id: "q4", q: "Do you know which features or endpoints are most expensive?",
        listen: "Expected: 'No clue.' If 'Yes, we track everything' → ask how (might be competitor)." },
      { id: "q5", q: "Have you had any 'WTF' moments with your AI spending?",
        listen: "Stories matter more than numbers. Follow-up: 'What did you do after that happened?'" }
    ]
  },
  {
    id: "pain",
    title: "Pain Quantification",
    duration: "6 min",
    questions: [
      { id: "q6", q: "If you had to guess, what % of your AI spend is wasteful?",
        listen: "Expected: 20–40%. Follow-up: 'What would you consider waste?' Probe: model overkill, no caching, verbose prompts." },
      { id: "q7", q: "How much time do you spend auditing or optimizing AI costs?",
        listen: "Expected: 'Not enough' or 'A few hours/month.' If >10 hours → high pain, willing to pay." },
      { id: "q8", q: "What would an extra $1,000/month in savings mean to your team?",
        listen: "New hire? Extend runway? Reinvest in product? This anchors value in their terms." }
    ]
  },
  {
    id: "solution",
    title: "Solution Validation",
    duration: "8 min",
    questions: [
      { id: "q9", q: "If I showed you a dashboard breaking spend down by model, endpoint, and feature—useful?",
        listen: "'Hell yes' or 'We have something like that.' If latter, ask which tool (competitive intel)." },
      { id: "q10", q: "What if the tool gave you specific recs like 'Switch endpoint X from Sonnet 4.6 to Haiku 4.5, save $400/mo'—would you act on that?",
        listen: "Objections: risk-averse ('test first'), time-poor ('who has time?'), trust ('how do I trust the rec?')." },
      { id: "q11", q: "Would you want the tool to auto-implement fixes, or just suggest them?",
        listen: "Splits the room. Manual-only → start with recs UI. Auto-fix enthusiasts → ship middleware day 1." },
      { id: "q12", q: "What would stop you from using a tool like this?",
        listen: "Common: security ('our API keys'), integration ('no eng time'), ROI ('not worth $200 if I spend $1K')." }
    ]
  },
  {
    id: "pricing",
    title: "Pricing Discovery",
    duration: "4 min",
    questions: [
      { id: "q13", q: "If this saved you $500/mo reliably, what would you pay?",
        listen: "Anchor high. <$100 = not a fit. $100–300 = sweet spot. >$500 = enterprise tier." },
      { id: "q14", q: "Per seat, % of savings, or flat monthly fee?",
        listen: "Per seat = complex. % = sounds fair, hard to attribute. Flat = simple, predictable, our preference." },
      { id: "q15", q: "If I had 10 beta spots, would you want one?",
        listen: "Yes → 'Can I send you early access in 3 weeks?' Hesitant → 'What would need to be true?'" }
    ]
  }
];

const OBJECTIONS = [
  {
    text: "We're too small, only spending $300/mo",
    response: "That's actually perfect for the free tier. But here's the thing — most teams that start at $300 are at $3K within 6 months. If I help you avoid waste as you scale, is that valuable?",
    followup: "What would trigger you to start caring about costs? ($1K/mo? When finance asks?)"
  },
  {
    text: "We already track everything in Datadog/Honeycomb",
    response: "Nice — what metrics? Cost per endpoint? Model comparison? Token distribution? Most monitoring tools show metrics, not optimizations. Are you getting actionable recs, or just raw data?",
    followup: "If yes to all → not the customer. If partial → 'What's missing that you wish you had?'"
  },
  {
    text: "I don't trust giving you our API keys",
    response: "100% valid. Read-only access only. AES-256 encrypted at rest. Revoke anytime. Pursuing SOC 2. Or — open to a self-hosted version where nothing leaves your infra?",
    followup: "Self-hosted concern → enterprise tier conversation."
  },
  {
    text: "Our eng team doesn't have time for another tool",
    response: "That's exactly why we're building auto-fix. Connect once, we analyze, you approve with one click, we generate the code. 5 min setup, ongoing savings.",
    followup: "Real talk — how much time do you spend manually auditing or explaining surprise bills to finance?"
  }
];

/* ============================================================
   COLD EMAIL SEQUENCE
   ============================================================ */
const EMAILS = [
  {
    id: "e1", day: "DAY 0", title: "Problem Hook",
    subjects: [
      "Quick question about your AI costs",
      "Are you spending {{spend}}/month on Claude?",
      "30–40% of your AI budget is wasted",
      "{{company}} + AI APIs = {{spend}} wasted?"
    ],
    body: `Hi {{firstName}},

I noticed {{company}} is {{trigger}}.

Quick question: Do you know which of your endpoints are burning the most budget?

Most teams I talk to are wasting $500–2K/month on:
• Using Sonnet 4.6 when Haiku 4.5 would work (3× cost difference)
• Not caching repeated prompts (90% savings missed via Anthropic prompt caching)
• Verbose system prompts (30% longer than needed)

I built a tool that finds this waste automatically. Takes 5 minutes.

Mind if I show you a quick demo? If it finds $500+/month in savings, would that be worth 15 minutes?

Best,
Kyle

P.S. I'm the founder of AI Cost Optimizer, but this isn't a sales pitch — genuinely trying to understand if the problem I solved for myself ($3K → $1K/month) matters to others.`,
    expectedRate: "10–15%"
  },
  {
    id: "e2", day: "DAY 3", title: "Value Proof",
    subjects: [
      "Quick example: $10K → $3.2K/month",
      "How {{similar_company}} cut their bill 68%",
      "{{firstName}}, did you see this?"
    ],
    body: `Hey {{firstName}},

Not sure if you saw my email earlier this week.

Just helped a SaaS company cut their OpenAI bill from $10K to $3.2K/month.

The issue: they were using GPT-5.4 for EVERY chat message, including "Hello."

The fix: model routing based on complexity. GPT-5.4 Mini for simple, GPT-5.4 for complex. Result: 68% cost reduction, no measurable quality loss.

I'm offering free audits this week (normally $200). Takes 5 minutes.

Want me to analyze your usage? Just reply with "yes" and I'll send instructions.

Best,
Kyle

—
Kyle Welsby
Founder, AI Cost Optimizer
ai-cost-optimizer.com`,
    expectedRate: "5–8% incremental"
  },
  {
    id: "e3", day: "DAY 7", title: "The Breakup",
    subjects: [
      "Breaking up is hard to do…",
      "Last note from me, {{firstName}}",
      "One last thing before I disappear"
    ],
    body: `Hey {{firstName}},

I'll take the hint and stop bothering you 😄

But before I go, one last thing:

I built a free tool that analyzes AI spending (Claude, GPT-5, Gemini).

Upload your usage CSV → get instant breakdown:
• Cost by model
• Repetition patterns (caching opportunities)
• Prompt compression suggestions
• Estimated savings

No signup, no sales pitch. Just a useful tool.

→ ai-cost-optimizer.com/audit

If it saves you $500/month, maybe we can chat then.

Best,
Kyle

P.S. If you know someone else bleeding money on AI APIs, feel free to forward this.`,
    expectedRate: "3–5% incremental"
  }
];

const TRIGGER_OPTIONS = [
  "hiring AI engineers",
  "shipping AI features",
  "building with Claude / GPT-5",
  "scaling LLM workloads",
  "growing fast (saw the news)",
  "[your specific trigger]"
];

/* ============================================================
   BLOG POSTS — full drafts
   ============================================================ */
const BLOG_POSTS = [
  {
    id: "b1",
    title: "We Analyzed 10M AI API Calls. Here's What We Found.",
    publishedAt: "2026-02-12",
    readingTime: 8,
    tags: ["analysis", "model-routing", "caching", "compression"],
    summary: "Across 50 companies and 10.2M API calls: 47% of expensive requests could use cheaper models, 89% miss caching, and prompts run 30% longer than needed. Here's the math.",
    content: `## Over the past six months, I've been obsessed with one problem.

AI API waste was costing teams thousands of dollars a month. As someone running three AI-powered products (FlashFusion, GenoFusion, Sacred Journeys), I watched our bills climb from $500 to $3,000 to $8,000/month. Finance started asking questions. I started digging.

So I built a system to track every single API call we made to Anthropic and OpenAI. Then I reached out to 50 other companies — startups, agencies, enterprise teams — and asked if I could analyze their data.

**The result: 10,247,382 API calls analyzed across 50 companies.**

Here's what the data revealed.

---

## Finding #1: 47% of expensive requests could use cheaper models

The most common waste pattern: model overkill. Teams using Claude Sonnet 4.6 ($3/$15 per MTok) or GPT-5.4 ($2.50/$15) for tasks that Haiku 4.5 ($1/$5) or GPT-5.4 Nano ($0.20/$1.25) handle just fine.

| Token Range | % of Requests | Avg Cost | Cheaper Model? |
|---|---|---|---|
| 0–500 tokens | 47% | $0.042 | Yes (3× cheaper) |
| 501–2000 | 31% | $0.156 | Maybe — test first |
| 2001+ | 22% | $0.487 | No, premium needed |

**47% of all requests were under 500 tokens.** These were short chat messages, basic classification, simple extractions, quick rewrites. None of them needed Sonnet-class reasoning.

For a team spending $5,000/month on Sonnet 4.6, $2,350 of that goes to <500-token requests. Routed to Haiku 4.5: $783. **Savings: $1,567/month. 31% reduction.**

For GPT-5.4 → GPT-5.4 Nano, the math is more dramatic — input cost drops 12.5×.

\`\`\`typescript
async function routeToModel(messages) {
  const tokens = estimateTokens(messages);
  if (tokens < 500)  return 'claude-haiku-4-5';   // $0.00025/tok input
  if (tokens < 2000) return 'claude-sonnet-4-6';  // $0.003/tok input
  return 'claude-opus-4-7';                        // $0.005/tok input
}
\`\`\`

---

## Finding #2: 89% of teams don't cache repeated prompts

Second-biggest waste vector: no caching strategy.

Using semantic hashing at 95%+ similarity, we found **43% of prompts were repeated 6+ times**. The usual suspects:

- System prompts (sent on every request)
- Template generation ("Summarize this article: …")
- Scheduled tasks (daily reports, weekly summaries)
- Static knowledge ("What's our refund policy?")

For one EdTech platform, we found a single prompt called **847 times in 7 days**. Token count: 1,247 per request. Yearly cost: $824.64.

With Anthropic's native prompt caching (90% off cached input tokens), that drops to ~$92/year. **Savings: $732/year on one prompt.** Multiply across 20+ prompts → thousands.

\`\`\`typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [{
    type: 'text',
    text: longSystemPrompt,
    cache_control: { type: 'ephemeral' }   // 90% off after first call
  }],
  messages
});
\`\`\`

Use this for system prompts that don't change. Five-minute integration, immediate impact.

---

## Finding #3: Prompts are 30% longer than they need to be

Across 2.3M requests:

| Issue | % of Prompts | Avg Wasted Tokens |
|---|---|---|
| Redundant examples | 41% | 340 |
| Verbose instructions | 38% | 220 |
| Unnecessary context | 29% | 180 |
| Repetitive constraints | 22% | 120 |

**Combined average waste: 287 tokens per prompt** — about 30% of median prompt length.

The fix is almost embarrassingly simple: ask Claude to compress your prompts. Have a verbose 1,200-token system prompt? Sonnet 4.6 will rewrite it to 400 tokens preserving every constraint, in about three seconds.

A/B test before deploying. Most compressed prompts produce equivalent or *better* outputs (less noise = clearer instructions).

---

## Finding #4 (bonus): Batch processing is 50% off

Anthropic's Message Batches API gives you 50% off both input and output tokens. Tradeoff: results return within 24 hours instead of seconds.

If you're processing >100 items and the result isn't time-sensitive (reports, analytics, bulk content gen), batch.

\`\`\`typescript
const batch = await anthropic.batches.create({
  requests: items.map(item => ({
    custom_id: item.id,
    params: {
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: item.prompt }]
    }
  }))
});
\`\`\`

---

## Bottom line

| Optimization | Avg Savings | Effort |
|---|---|---|
| Model routing | 25–35% | 1 day |
| Prompt caching | 15–25% | 2–3 days |
| Prompt compression | 5–10% | 1 day |
| Batch processing | 10–20% | varies |

**Total potential: 55–90% reduction.** For a team spending $5,000/month, that's $33K–$54K/year.

Start with model routing. Add caching. Optimize prompts last.

If you want this audit run on your own data automatically: [ai-cost-optimizer.com](https://ai-cost-optimizer.com).`,
  },
  {
    id: "b2",
    title: "The $10K Mistake: Using GPT-5.4 for Simple Tasks",
    publishedAt: "2026-02-19",
    readingTime: 7,
    tags: ["case-study", "model-routing", "openai"],
    summary: "A SaaS founder's chat feature was routing every message — including 'Hello' — to GPT-5.4. Here's how complexity scoring + cache layer cut their bill from $10,247 to $3,447/month.",
    content: `## Last month a SaaS founder reached out with a problem.

Their OpenAI bill had hit **$10,247 in January**. "We launched an AI chat feature in November," he said. "Usage took off. So did our costs. Finance is freaking out. Help?"

I asked for their API logs. Textbook case of AI budget waste.

---

## The problem: GPT-5.4 for everything

Their chat feature was beautifully simple. Users asked questions. AI responded. It worked.

Under the hood, **every single message was routed to GPT-5.4** — including:

- "Hello"
- "Thanks"
- "What's your refund policy?"
- "How do I reset my password?"

Every. Single. One.

I analyzed 31,247 messages from January:

| Message Type | Count | % of Total | Avg Tokens |
|---|---|---|---|
| Greetings | 4,231 | 13.5% | 12 |
| Simple questions | 18,847 | 60.3% | 87 |
| Complex questions | 5,892 | 18.9% | 342 |
| Follow-ups | 2,277 | 7.3% | 54 |

**87% of messages were under 150 tokens.**

These weren't reasoning tasks. They were FAQ-style questions, basic navigation, simple clarifications, conversational niceties.

GPT-5.4 pricing (May 2026): $2.50 input / $15 output per MTok. Average message cost: $0.00555. Daily volume: 31K messages = $173/day, just on chat. Combined with their assistant + email features: $964/day = **$28,920/month**.

And January was a slow month.

---

## The fix: complexity scoring + model routing

Three layers:

**Layer 1: complexity scorer**

\`\`\`typescript
function scoreComplexity(message) {
  let score = 1;
  if (message.length > 200) score += 2;
  if (/\\b(why|how|explain|compare|analyze|evaluate)\\b/i.test(message)) score += 2;
  if (/\\b(first|then|finally|step)\\b/i.test(message)) score += 2;  // multi-step
  if (/\`\`\`|\`/.test(message)) score += 2;                            // code
  if (message.split('.').length > 3) score += 1;
  return Math.min(score, 10);
}
\`\`\`

**Layer 2: model router**

| Score | Route | Cost |
|---|---|---|
| 1–3 | GPT-5.4 Nano ($0.20/$1.25) | minimal |
| 4–6 | GPT-5.4 Mini ($0.75/$4.50) | balanced |
| 7–10 | GPT-5.4 ($2.50/$15) | premium |

**Layer 3: FAQ cache**

For the top ~50 most-asked questions, pre-populated answers. Cost of a cache hit: $0.00.

---

## Results: $6,800/month saved

| | Before | After |
|---|---|---|
| FAQ cache hits | 0 | 13.5% |
| Nano | 0 | 60.3% |
| Mini | 0 | 18.9% |
| 5.4 (full) | 100% | 7.3% |
| Daily cost | $173 | $57 |
| **Monthly cost** | **$10,247** | **$3,447** |

**68% reduction. No measurable quality loss.** A/B test on simple messages showed user satisfaction dropped 0.1/5 (4.7 → 4.6) — within noise.

---

## Lessons

**1. Most tasks don't need your best model.** GPT-5.4 Nano handles greetings, FAQ-style answers, simple summaries, classification. Save GPT-5.4 for reasoning, code, long context.

**2. Cache your FAQs.** If you have repeated questions, cache them. Even a 10% cache hit rate saves real money.

**3. Monitor quality per route.** Track \`thumbs_up / thumbs_down\` per model. If Nano starts getting bad feedback, raise the complexity threshold.

**4. Be transparent.** One user noticed faster responses on simple questions and asked why. The honest answer ("we use different models based on complexity") landed fine. Transparency builds trust.

---

If your AI bill looks anything like this customer's pre-fix, the audit takes five minutes. Run it: [ai-cost-optimizer.com/audit](https://ai-cost-optimizer.com/audit).`,
  },
  {
    id: "b3",
    title: "How to Audit Your AI Spending in 5 Minutes",
    publishedAt: "2026-02-26",
    readingTime: 6,
    tags: ["tutorial", "audit", "tool"],
    summary: "Step-by-step guide to auditing Anthropic and OpenAI spending. Free tool included — upload your usage CSV, get instant cost breakdown and savings recommendations.",
    content: `## Quick question: do you know which of your endpoints cost the most money?

If you answered "no," you're not alone. In a survey of 127 companies using Claude or GPT, **89% couldn't answer this question**.

Most teams only see the total bill. They have no idea:

- Which features burn budget
- Which models are overused
- Which prompts could be compressed
- Where caching would help

**Average waste we find: 30–50% of monthly spend.** For a team at $5K/month, that's $1,500–2,500 wasted. Most of it is low-hanging fruit.

But you can't fix what you can't see. Here's a five-minute audit you can run today.

---

## Step 1: Export your usage CSV (2 min)

**Anthropic:** [console.anthropic.com](https://console.anthropic.com) → Usage → Download CSV. Last 30 days. Columns: \`timestamp, model, input_tokens, output_tokens, cost_usd\`.

**OpenAI:** [platform.openai.com](https://platform.openai.com) → Usage → Activity → Export. Columns: \`timestamp, model, n_requests, n_context_tokens_total, n_generated_tokens_total\`.

**Google:** [console.cloud.google.com](https://console.cloud.google.com) → Vertex AI → Usage → Export.

---

## Step 2: Upload to the free analyzer (1 min)

→ [ai-cost-optimizer.com/audit](https://ai-cost-optimizer.com/audit)

The tool parses CSVs entirely client-side. No data uploaded, nothing logged, nothing transmitted. Refresh to clear.

It auto-detects your provider format and normalizes the data. You can upload multiple CSVs to combine spend across providers.

---

## Step 3: Review the results (2 min)

You'll see four sections:

**Cost breakdown by model.** Most teams discover 60–70% of their spend is concentrated in one or two premium models. That's your starting point.

**Token distribution.** If 30%+ of requests are under 500 tokens, you have a model-routing opportunity. Sonnet 4.6 → Haiku 4.5 saves ~67% on those calls.

**Repetition analysis.** Patterns repeated 5+ times are caching candidates. Anthropic's prompt cache gives you 90% off cached input tokens — implementation takes 5 minutes.

**Recommendations.** Prioritized by monthly savings. Each has an impact rating (low/med/high), effort estimate, and a one-line implementation note.

---

## Step 4: Implement the quick wins (today)

**Quick win #1 — Model routing (5 min)**

\`\`\`typescript
function selectModel(messages) {
  const tokens = estimateTokens(messages);
  if (tokens < 500)  return 'claude-haiku-4-5';
  if (tokens < 2000) return 'claude-sonnet-4-6';
  return 'claude-opus-4-7';
}
\`\`\`

Drop in front of any Anthropic call. Expected impact: **25–35% cost reduction**.

**Quick win #2 — Anthropic prompt caching (30 min)**

\`\`\`typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [{
    type: 'text',
    text: longSystemPrompt,
    cache_control: { type: 'ephemeral' }
  }],
  messages
});
\`\`\`

For repeated system prompts, cached tokens are 90% cheaper. Expected impact: **10–20% reduction**.

**Quick win #3 — Compress verbose prompts (15 min each)**

Ask Sonnet 4.6 to compress your prompt while preserving constraints. Most prompts shrink 25–40% with no quality drop.

---

## Real example

One SaaS company:

- **Before:** $8,247/month, no optimization
- **Audit found:** 47% of requests <500 tokens, three heavily-repeated prompts, verbose 1,200-token system prompt
- **Implemented in 4 hours:** model routing, caching for top 3 prompts, system-prompt compression
- **After:** $3,127/month — **62% reduction, $5,120/month saved**

ROI on their 4-hour investment: $15,360/hour.

---

## When to stop DIYing and use a tool

The free audit is great for one-time analysis. If you want continuous monitoring — daily spend alerts, anomaly detection, auto-generated middleware that updates as rules evolve — that's what AI Cost Optimizer is for.

But the audit alone, manually run once a month, will save most teams thousands.

Run it now: [ai-cost-optimizer.com/audit](https://ai-cost-optimizer.com/audit). Five minutes.`,
  }
];

/* ============================================================
   COPY TO CLIPBOARD HOOK with feedback
   ============================================================ */
function useClipboard() {
  const [copied, setCopied] = useState(null);
  const copy = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(prev => (prev === key ? null : prev)), 1600);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(key);
      setTimeout(() => setCopied(prev => (prev === key ? null : prev)), 1600);
    }
  }, []);
  return { copy, copied };
}

/* ============================================================
   ARCHITECTURE TAB
   ============================================================ */
function ArchitectureTab() {
  const [active, setActive] = useState("middleware");
  const pattern = ARCHITECTURE_PATTERNS.find(p => p.id === active);
  const { copy, copied } = useClipboard();

  return (
    <div className="space-y-4">
      {/* Pattern selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ARCHITECTURE_PATTERNS.map((p, i) => {
          const Icon = p.icon;
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`text-left p-4 border transition-all slide-up ${
                isActive
                  ? "border-[#a3e635] bg-[#a3e635]/[0.03]"
                  : "border-[#2a2a2a] bg-[#141414] hover:border-[#404040]"
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={isActive ? "text-[#a3e635]" : "text-[#737373]"} />
                  <span className="ff-mono text-[10px] tracking-[0.2em] text-[#525252]">PATTERN {String(i + 1).padStart(2, "0")}</span>
                </div>
                {isActive && <CircleDot size={12} className="text-[#a3e635] pulse-glow rounded-full" />}
              </div>
              <div className={`ff-mono text-sm font-bold mb-1 ${isActive ? "text-white" : "text-[#a3a3a3]"}`}>
                {p.name.toUpperCase()}
              </div>
              <div className="ff-sans text-[11px] text-[#737373] leading-snug">{p.tagline}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Flow diagram */}
        <div className="lg:col-span-3 bg-[#141414] border border-[#2a2a2a] p-5 relative overflow-hidden">
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">DATA FLOW</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full pulse-glow" />
                <span className="ff-mono text-[9px] tracking-widest text-[#a3e635]">LIVE</span>
              </div>
            </div>
            <FlowDiagram patternId={active} />
          </div>
        </div>

        {/* Pros / Cons / Best For */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-[#141414] border border-[#2a2a2a] p-4">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#a3e635] mb-2">STRENGTHS</div>
            <ul className="space-y-1.5">
              {pattern.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 ff-sans text-[12px] text-[#d4d4d4] leading-snug">
                  <Check size={11} className="text-[#a3e635] mt-1 flex-shrink-0" strokeWidth={2.5} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] p-4">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#ef4444] mb-2">TRADE-OFFS</div>
            <ul className="space-y-1.5">
              {pattern.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 ff-sans text-[12px] text-[#a3a3a3] leading-snug">
                  <X size={11} className="text-[#ef4444] mt-1 flex-shrink-0" strokeWidth={2.5} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#a3e635]/[0.04] border border-[#a3e635]/30 p-4">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#a3e635] mb-2">BEST FOR</div>
            <p className="ff-sans text-[12px] text-[#d4d4d4] leading-relaxed">{pattern.bestFor}</p>
          </div>
        </div>
      </div>

      {/* Code sample */}
      <div className="bg-[#141414] border border-[#2a2a2a]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <Code2 size={12} className="text-[#a3e635]" />
            <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">IMPLEMENTATION · TYPESCRIPT</span>
          </div>
          <button
            onClick={() => copy(stripHTML(pattern.code), `code-${pattern.id}`)}
            className={`ff-mono text-[9px] tracking-widest px-2.5 py-1 transition-all flex items-center gap-1.5 ${
              copied === `code-${pattern.id}`
                ? "bg-[#a3e635] text-black"
                : "border border-[#2a2a2a] text-[#a3a3a3] hover:border-[#a3e635] hover:text-[#a3e635]"
            }`}
          >
            {copied === `code-${pattern.id}` ? <><Check size={10} strokeWidth={3} /> COPIED</> : <><Copy size={10} /> COPY</>}
          </button>
        </div>
        <pre className="code-block slim-scroll" dangerouslySetInnerHTML={{ __html: pattern.code }} />
      </div>
    </div>
  );
}

function stripHTML(html) {
  return html.replace(/<[^>]*>/g, "");
}

function FlowDiagram({ patternId }) {
  // Three different flow shapes per pattern
  // Each box is positioned in a 600 x 280 viewBox
  const layouts = {
    middleware: {
      nodes: [
        { id: "app", x: 60,  y: 130, w: 100, h: 50, label: "CUSTOMER", sub: "App / API", icon: "🟢" },
        { id: "mw",  x: 250, y: 130, w: 110, h: 50, label: "MIDDLEWARE", sub: "in their repo", highlight: true },
        { id: "api", x: 460, y: 80,  w: 110, h: 50, label: "ANTHROPIC", sub: "/v1/messages" },
        { id: "tlm", x: 460, y: 200, w: 110, h: 50, label: "OPTIMIZER", sub: "telemetry only" }
      ],
      paths: [
        { from: "app", to: "mw",  d: "M 160 155 L 250 155", color: "#a3e635" },
        { from: "mw",  to: "api", d: "M 360 145 Q 410 145 410 105 L 460 105", color: "#a3e635" },
        { from: "mw",  to: "tlm", d: "M 360 165 Q 410 165 410 225 L 460 225", color: "#525252", dashed: true }
      ]
    },
    sdk: {
      nodes: [
        { id: "app", x: 60,  y: 130, w: 100, h: 50, label: "CUSTOMER", sub: "App / API", icon: "🟢" },
        { id: "sdk", x: 250, y: 130, w: 110, h: 50, label: "@SDK", sub: "npm package", highlight: true },
        { id: "api", x: 460, y: 80,  w: 110, h: 50, label: "ANTHROPIC", sub: "/v1/messages" },
        { id: "cfg", x: 460, y: 200, w: 110, h: 50, label: "CONFIG API", sub: "rules + cache" }
      ],
      paths: [
        { from: "app", to: "sdk", d: "M 160 155 L 250 155", color: "#a3e635" },
        { from: "sdk", to: "api", d: "M 360 145 Q 410 145 410 105 L 460 105", color: "#a3e635" },
        { from: "sdk", to: "cfg", d: "M 360 165 Q 410 165 410 225 L 460 225", color: "#fbbf24" }
      ]
    },
    proxy: {
      nodes: [
        { id: "app", x: 30,  y: 130, w: 100, h: 50, label: "CUSTOMER", sub: "App / API", icon: "🟢" },
        { id: "prx", x: 220, y: 130, w: 140, h: 50, label: "OPTIMIZER", sub: "PROXY · on the wire", highlight: true },
        { id: "api", x: 470, y: 130, w: 110, h: 50, label: "ANTHROPIC", sub: "/v1/messages" }
      ],
      paths: [
        { from: "app", to: "prx", d: "M 130 155 L 220 155", color: "#a3e635" },
        { from: "prx", to: "api", d: "M 360 155 L 470 155", color: "#a3e635" }
      ]
    }
  };

  const layout = layouts[patternId];

  return (
    <div className="fade-in" key={patternId}>
      <svg viewBox="0 0 600 280" className="w-full h-auto" style={{ maxHeight: 320 }}>
        {/* Paths */}
        {layout.paths.map((p, i) => (
          <g key={i}>
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={p.dashed ? "4 4" : "none"}
              opacity={p.dashed ? 0.5 : 1}
            />
            {/* Animated dots flowing along the path */}
            {!p.dashed && [0, 1, 2].map(k => (
              <circle
                key={k}
                r="3"
                fill={p.color}
                className={`flow-dot ${k === 1 ? "delay-1" : k === 2 ? "delay-2" : ""}`}
                style={{ offsetPath: `path('${p.d}')`, offsetRotate: "0deg" }}
              />
            ))}
            {/* Arrowhead */}
            <polygon
              points={getArrowheadPoints(p.d)}
              fill={p.color}
              opacity={p.dashed ? 0.6 : 1}
            />
          </g>
        ))}

        {/* Nodes */}
        {layout.nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x} y={n.y} width={n.w} height={n.h}
              fill={n.highlight ? "#a3e635" : "#0a0a0a"}
              stroke={n.highlight ? "#a3e635" : "#404040"}
              strokeWidth="1"
            />
            <text
              x={n.x + n.w / 2} y={n.y + 22}
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontSize="11"
              fontWeight="700"
              fill={n.highlight ? "#0a0a0a" : "#ffffff"}
              letterSpacing="0.5"
            >{n.label}</text>
            <text
              x={n.x + n.w / 2} y={n.y + 38}
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontSize="9"
              fill={n.highlight ? "#1c1c1c" : "#737373"}
            >{n.sub}</text>
          </g>
        ))}
      </svg>
      <div className="mt-3 ff-mono text-[10px] text-[#525252] tracking-wide flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#a3e635]" /> request path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#fbbf24]" /> control plane
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 border border-[#525252]" /> telemetry
        </span>
      </div>
    </div>
  );
}

function getArrowheadPoints(d) {
  // Approximate arrowhead at the end of a path. We extract the last x,y from common shapes.
  // For curved paths we just place arrowhead at the destination per layout.
  // Simple parser: get the last "L x y" or terminal coordinates.
  const matches = [...d.matchAll(/([MLQ])\s*([\d.]+)\s+([\d.]+)(?:\s+([\d.]+)\s+([\d.]+))?/g)];
  if (!matches.length) return "";
  const last = matches[matches.length - 1];
  // For Q "x1 y1 x y", the destination is x,y; for L "x y" same.
  const x = parseFloat(last[4] ?? last[2]);
  const y = parseFloat(last[5] ?? last[3]);
  // small triangle pointing right
  return `${x},${y - 4} ${x + 6},${y} ${x},${y + 4}`;
}

/* ============================================================
   INTERVIEW SCRIPTS TAB
   ============================================================ */
function InterviewTab() {
  const [asked, setAsked] = useState({});
  const [open, setOpen] = useState({ current: true });
  const [view, setView] = useState("script"); // 'script' | 'objections'

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("interview-progress");
        if (r && r.value) setAsked(JSON.parse(r.value));
      } catch (e) {}
    })();
  }, []);

  const persist = async (next) => {
    try { await window.storage.set("interview-progress", JSON.stringify(next)); } catch (e) {}
  };
  const toggleAsked = (qid) => {
    const next = { ...asked, [qid]: !asked[qid] };
    setAsked(next); persist(next);
  };
  const reset = async () => { setAsked({}); try { await window.storage.delete("interview-progress"); } catch (e) {} };

  const totalQuestions = INTERVIEW_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
  const askedCount = Object.values(asked).filter(Boolean).length;
  const progressPct = totalQuestions > 0 ? askedCount / totalQuestions : 0;

  return (
    <div className="space-y-4">
      {/* Header / progress */}
      <div className="bg-[#141414] border border-[#2a2a2a] p-5 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="relative flex items-center gap-5">
          <div className="flex-shrink-0">
            <Mic size={28} className="text-[#a3e635]" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="ff-serif italic text-2xl text-white leading-tight">Customer discovery <span className="text-[#a3e635]">script</span></div>
            <div className="ff-mono text-[10px] tracking-[0.15em] text-[#737373] mt-1">15 QUESTIONS · 26 MIN · 4 SECTIONS</div>
          </div>
          <div className="text-right">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-1">PROGRESS</div>
            <div className="ff-mono text-3xl text-[#a3e635] tnum">{Math.round(progressPct * 100)}%</div>
            <div className="ff-mono text-[10px] text-[#525252] tnum">{askedCount}/{totalQuestions} ASKED</div>
          </div>
        </div>
        <div className="relative mt-4 h-1 bg-[#0a0a0a]">
          <div className="h-full bg-[#a3e635] transition-all duration-700" style={{ width: `${progressPct * 100}%` }} />
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-0 border-b border-[#1c1c1c]">
        {[
          { id: "script", label: "DISCOVERY SCRIPT", icon: Mic },
          { id: "objections", label: "OBJECTION HANDLING", icon: AlertCircle }
        ].map(t => {
          const Icon = t.icon;
          const isActive = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`px-4 py-2.5 flex items-center gap-2 transition-all ${isActive ? "" : "hover:bg-[#141414]"}`}
            >
              <Icon size={12} className={isActive ? "text-[#a3e635]" : "text-[#525252]"} />
              <span className={`ff-mono text-[10px] tracking-[0.15em] font-semibold ${isActive ? "text-white" : "text-[#737373]"}`}>
                {t.label}
              </span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#a3e635]" style={{ position: "relative" }} />}
            </button>
          );
        })}
        {askedCount > 0 && (
          <button
            onClick={reset}
            className="ml-auto ff-mono text-[9px] tracking-widest text-[#525252] hover:text-[#ef4444] transition-colors flex items-center gap-1 px-3"
          >
            <Trash2 size={10} /> RESET PROGRESS
          </button>
        )}
      </div>

      {view === "script" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {INTERVIEW_SECTIONS.map((section, idx) => {
            const sectionAsked = section.questions.filter(q => asked[q.id]).length;
            const sectionPct = section.questions.length > 0 ? sectionAsked / section.questions.length : 0;
            const isOpen = open[section.id];
            return (
              <div key={section.id} className="bg-[#141414] border border-[#2a2a2a] hover:border-[#404040] transition-colors slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <button
                  onClick={() => setOpen(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                >
                  <div className="ff-mono text-[10px] tracking-[0.15em] text-[#525252] tnum w-12">{(idx + 1).toString().padStart(2, "0")}</div>
                  <div className="w-px h-8 bg-[#2a2a2a]" />
                  <div className="flex-1">
                    <div className="ff-mono text-sm font-semibold text-white">{section.title.toUpperCase()}</div>
                    <div className="ff-sans text-[11px] text-[#737373]">{section.duration} · {section.questions.length} questions</div>
                  </div>
                  <div className="text-right">
                    <div className="ff-mono text-[10px] tnum text-[#737373]">{sectionAsked}/{section.questions.length}</div>
                    <div className="w-12 h-1 bg-[#0a0a0a] mt-1">
                      <div className="h-full bg-[#a3e635] transition-all duration-700" style={{ width: `${sectionPct * 100}%` }} />
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={14} className="text-[#525252]" /> : <ChevronRight size={14} className="text-[#525252]" />}
                </button>
                {isOpen && (
                  <div className="border-t border-[#2a2a2a] p-3 space-y-2">
                    {section.questions.map((qq, qi) => {
                      const isAsked = !!asked[qq.id];
                      return (
                        <div key={qq.id} className={`border ${isAsked ? "border-[#a3e635]/30 bg-[#a3e635]/[0.02]" : "border-[#2a2a2a]"} transition-all`}>
                          <button
                            onClick={() => toggleAsked(qq.id)}
                            className="w-full px-3 py-2.5 flex items-start gap-3 text-left hover:bg-[#1c1c1c]"
                          >
                            <div className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 ${
                              isAsked ? "bg-[#a3e635] border-[#a3e635]" : "border-[#404040]"
                            }`}>
                              {isAsked && <Check size={9} className="text-black" strokeWidth={3} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="ff-mono text-[9px] text-[#525252] tnum tracking-wider">Q{qq.id.replace("q","")}</span>
                              </div>
                              <div className={`ff-sans text-[13px] leading-snug ${isAsked ? "text-[#737373] line-through" : "text-white"}`}>
                                {qq.q}
                              </div>
                              <div className="ff-sans text-[11px] text-[#a3e635]/80 italic mt-1.5 leading-relaxed">
                                <span className="ff-mono text-[9px] tracking-widest text-[#a3e635] not-italic mr-1.5">LISTEN ↓</span>
                                {qq.listen}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OBJECTIONS.map((o, i) => (
            <div key={i} className="bg-[#141414] border border-[#2a2a2a] p-4 slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle size={14} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
                <div className="ff-mono text-[11px] text-white leading-snug">"{o.text}"</div>
              </div>
              <div className="border-l-2 border-[#a3e635] pl-3 mb-3">
                <div className="ff-mono text-[9px] tracking-[0.2em] text-[#a3e635] mb-1">RESPONSE</div>
                <div className="ff-sans text-[12px] text-[#d4d4d4] leading-relaxed">{o.response}</div>
              </div>
              <div className="ff-mono text-[10px] text-[#737373] italic leading-relaxed">
                <span className="not-italic text-[#525252] tracking-widest mr-1">FOLLOW-UP →</span>
                {o.followup}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   COLD EMAIL TAB
   ============================================================ */
function EmailTab() {
  const [vars, setVars] = useState({
    firstName: "Sarah",
    company: "DataCo",
    spend: "$8K",
    trigger: "hiring AI engineers",
    similar_company: "an EdTech client"
  });
  const [activeEmail, setActiveEmail] = useState("e1");
  const [activeSubject, setActiveSubject] = useState({ e1: 0, e2: 0, e3: 0 });
  const [showRaw, setShowRaw] = useState(false);
  const { copy, copied } = useClipboard();

  const interpolate = (str) => {
    return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] || `{{${k}}}`);
  };

  const email = EMAILS.find(e => e.id === activeEmail);
  const renderedSubject = showRaw ? email.subjects[activeSubject[email.id]] : interpolate(email.subjects[activeSubject[email.id]]);
  const renderedBody = showRaw ? email.body : interpolate(email.body);

  const fullSequence = EMAILS.map(e => {
    const subj = showRaw ? e.subjects[activeSubject[e.id]] : interpolate(e.subjects[activeSubject[e.id]]);
    const body = showRaw ? e.body : interpolate(e.body);
    return `=== ${e.day} · ${e.title.toUpperCase()} ===\nSubject: ${subj}\n\n${body}`;
  }).join("\n\n\n");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Personalization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#141414] border border-[#2a2a2a] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Hash size={14} className="text-[#a3e635]" />
              <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">PERSONALIZATION</span>
            </div>
            <div className="space-y-3">
              {[
                { k: "firstName", label: "FIRST NAME", placeholder: "Sarah" },
                { k: "company",   label: "COMPANY",    placeholder: "DataCo" },
                { k: "spend",     label: "EST. SPEND", placeholder: "$8K" }
              ].map(f => (
                <div key={f.k}>
                  <div className="ff-mono text-[9px] tracking-widest text-[#525252] mb-1">{f.label}</div>
                  <input
                    type="text"
                    value={vars[f.k]}
                    onChange={e => setVars(v => ({ ...v, [f.k]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="ff-mono text-xs bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#a3e635] px-2.5 py-1.5 w-full outline-none text-white transition-colors"
                  />
                </div>
              ))}
              <div>
                <div className="ff-mono text-[9px] tracking-widest text-[#525252] mb-1">SPECIFIC TRIGGER</div>
                <select
                  value={vars.trigger}
                  onChange={e => setVars(v => ({ ...v, trigger: e.target.value }))}
                  className="ff-mono text-xs bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#a3e635] px-2.5 py-1.5 w-full outline-none text-white transition-colors cursor-pointer"
                >
                  {TRIGGER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Email picker */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Send size={14} className="text-[#a3e635]" />
              <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">SEQUENCE</span>
            </div>
            <div className="space-y-2">
              {EMAILS.map((e, i) => {
                const isActive = activeEmail === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setActiveEmail(e.id)}
                    className={`w-full text-left p-3 border transition-all ${
                      isActive ? "border-[#a3e635] bg-[#a3e635]/[0.04]" : "border-[#2a2a2a] hover:border-[#404040]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`ff-mono text-[9px] tracking-widest tnum ${isActive ? "text-[#a3e635]" : "text-[#525252]"}`}>
                        {e.day}
                      </div>
                      <div className={`ff-mono text-xs font-semibold ${isActive ? "text-white" : "text-[#a3a3a3]"}`}>
                        {e.title.toUpperCase()}
                      </div>
                    </div>
                    <div className="ff-mono text-[10px] text-[#525252]">EXP. RATE: {e.expectedRate}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => copy(fullSequence, "full-sequence")}
            className={`w-full ff-mono text-[10px] tracking-[0.2em] py-2.5 transition-all flex items-center justify-center gap-2 ${
              copied === "full-sequence"
                ? "bg-[#a3e635] text-black font-bold"
                : "border border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635] hover:text-black"
            }`}
          >
            {copied === "full-sequence"
              ? <><Check size={12} strokeWidth={3} /> SEQUENCE COPIED</>
              : <><Download size={12} /> COPY ENTIRE SEQUENCE</>}
          </button>
        </div>

        {/* RIGHT: Live preview */}
        <div className="lg:col-span-3 space-y-3">
          {/* Subject A/B picker */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={12} className="text-[#a3e635]" />
                <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">SUBJECT LINE A/B</span>
              </div>
              <button
                onClick={() => setShowRaw(s => !s)}
                className="ff-mono text-[9px] tracking-widest px-2 py-1 border border-[#2a2a2a] text-[#737373] hover:border-[#a3e635] hover:text-[#a3e635] transition-colors flex items-center gap-1"
              >
                {showRaw ? <><EyeOff size={10} /> SHOW RAW</> : <><Eye size={10} /> SHOW MERGED</>}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {email.subjects.map((s, i) => {
                const isActive = activeSubject[email.id] === i;
                const display = showRaw ? s : interpolate(s);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveSubject(prev => ({ ...prev, [email.id]: i }))}
                    className={`text-left p-2.5 border transition-all ${
                      isActive
                        ? "border-[#a3e635] bg-[#a3e635]/[0.05]"
                        : "border-[#2a2a2a] hover:border-[#404040]"
                    }`}
                  >
                    <div className="ff-mono text-[9px] tracking-widest text-[#525252] mb-1">VARIANT {String.fromCharCode(65 + i)}</div>
                    <div className={`ff-sans text-[12px] leading-snug ${isActive ? "text-white" : "text-[#a3a3a3]"}`}>
                      {display}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email preview */}
          <div className="bg-[#141414] border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#a3e635]" />
                <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">{email.day} · {email.title.toUpperCase()}</span>
              </div>
              <button
                onClick={() => copy(`Subject: ${renderedSubject}\n\n${renderedBody}`, `email-${email.id}`)}
                className={`ff-mono text-[9px] tracking-widest px-2.5 py-1 transition-all flex items-center gap-1.5 ${
                  copied === `email-${email.id}`
                    ? "bg-[#a3e635] text-black"
                    : "border border-[#2a2a2a] text-[#a3a3a3] hover:border-[#a3e635] hover:text-[#a3e635]"
                }`}
              >
                {copied === `email-${email.id}` ? <><Check size={10} strokeWidth={3} /> COPIED</> : <><Copy size={10} /> COPY EMAIL</>}
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 pb-3 border-b border-[#1c1c1c]">
                <div className="ff-mono text-[9px] tracking-widest text-[#525252] mb-1">SUBJECT</div>
                <div className="ff-mono text-sm text-white">{renderedSubject}</div>
              </div>
              <pre className="ff-sans text-[13px] text-[#d4d4d4] whitespace-pre-wrap leading-relaxed font-light">{renderedBody}</pre>
            </div>
          </div>

          {/* Send timing */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-4">
            <div className="grid grid-cols-3 gap-4 ff-mono text-[10px]">
              <div>
                <div className="text-[#525252] tracking-widest mb-1">BEST TIME</div>
                <div className="text-white">Tue–Thu, 9–11am their TZ</div>
              </div>
              <div>
                <div className="text-[#525252] tracking-widest mb-1">CADENCE</div>
                <div className="text-white">Day 0 · Day 3 · Day 7</div>
              </div>
              <div>
                <div className="text-[#525252] tracking-widest mb-1">VOLUME TARGET</div>
                <div className="text-white">50/wk → 5 interviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BLOG TAB
   ============================================================ */
function BlogTab() {
  const [expanded, setExpanded] = useState(null);
  const { copy, copied } = useClipboard();

  return (
    <div className="space-y-4">
      <div className="bg-[#141414] border border-[#2a2a2a] p-5 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="relative flex items-start gap-5">
          <div className="flex-shrink-0">
            <BookOpen size={28} className="text-[#a3e635]" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="ff-serif italic text-2xl text-white leading-tight">Three posts. <span className="text-[#a3e635]">21 minutes</span> total reading.</div>
            <div className="ff-sans text-sm text-[#a3a3a3] mt-2 leading-relaxed">
              Publication-ready drafts written in Kyle's voice. Pricing references updated to current May 2026 model IDs. Ship to Hacker News, Dev.to, LinkedIn, or your own blog.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {BLOG_POSTS.map((post, i) => {
          const isExpanded = expanded === post.id;
          const wordCount = post.content.split(/\s+/).length;
          return (
            <article key={post.id} className={`bg-[#141414] border transition-all slide-up ${
              isExpanded ? "border-[#a3e635]/40" : "border-[#2a2a2a] hover:border-[#404040]"
            }`} style={{ animationDelay: `${i * 80}ms` }}>
              {/* Header */}
              <div className="px-5 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center">
                    <span className="ff-mono text-sm font-bold text-[#a3e635]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="ff-mono text-[9px] tracking-widest text-[#525252] tnum">{post.publishedAt}</span>
                      <span className="ff-mono text-[9px] tracking-widest text-[#525252] flex items-center gap-1">
                        <Clock size={9} /> {post.readingTime} MIN
                      </span>
                      <span className="ff-mono text-[9px] tracking-widest text-[#525252] tnum">{wordCount.toLocaleString()} WORDS</span>
                    </div>
                    <h3 className="ff-serif text-xl text-white leading-tight mb-1.5">{post.title}</h3>
                    <p className="ff-sans text-[12px] text-[#a3a3a3] leading-relaxed">{post.summary}</p>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {post.tags.map(t => (
                        <span key={t} className="ff-mono text-[9px] tracking-wide px-1.5 py-0.5 border border-[#2a2a2a] text-[#737373]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1c1c1c] flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : post.id)}
                    className="ff-mono text-[10px] tracking-[0.2em] px-3 py-1.5 bg-[#a3e635] text-black font-bold hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    {isExpanded ? <><ChevronDown size={11} strokeWidth={3} /> COLLAPSE</> : <><ChevronRight size={11} strokeWidth={3} /> READ FULL</>}
                  </button>
                  <button
                    onClick={() => copy(`# ${post.title}\n\n${post.content}`, `post-${post.id}`)}
                    className={`ff-mono text-[10px] tracking-[0.2em] px-3 py-1.5 transition-all flex items-center gap-1.5 ${
                      copied === `post-${post.id}`
                        ? "bg-[#a3e635] text-black font-bold"
                        : "border border-[#2a2a2a] text-[#a3a3a3] hover:border-[#a3e635] hover:text-[#a3e635]"
                    }`}
                  >
                    {copied === `post-${post.id}`
                      ? <><Check size={11} strokeWidth={3} /> COPIED MARKDOWN</>
                      : <><Copy size={11} /> COPY MARKDOWN</>}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#2a2a2a] p-6 bg-[#0a0a0a] fade-in">
                  <BlogContent content={post.content} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function BlogContent({ content }) {
  // Lightweight markdown renderer — handles ## headings, **bold**, *italic*, lists, tables, code blocks, and paragraphs
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);
  return (
    <div className="ff-serif text-[15px] text-[#d4d4d4] leading-relaxed max-w-3xl">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i} className="ff-sans text-2xl font-semibold text-white mt-8 mb-3 leading-tight">{renderInline(b.text)}</h2>;
        if (b.type === "hr") return <hr key={i} className="my-6 border-[#1c1c1c]" />;
        if (b.type === "code") return (
          <pre key={i} className="code-block my-4 slim-scroll">{b.text}</pre>
        );
        if (b.type === "ul") return (
          <ul key={i} className="ff-sans my-4 space-y-1.5">
            {b.items.map((it, j) => <li key={j} className="flex items-start gap-2 text-[14px]"><span className="text-[#a3e635] mt-1">•</span><span>{renderInline(it)}</span></li>)}
          </ul>
        );
        if (b.type === "table") return (
          <div key={i} className="my-4 overflow-x-auto slim-scroll">
            <table className="ff-mono text-[11px] w-full border border-[#2a2a2a]">
              <thead>
                <tr className="bg-[#1c1c1c]">
                  {b.headers.map((h, j) => <th key={j} className="px-3 py-2 text-left text-[#a3e635] tracking-wider border-r border-[#2a2a2a] last:border-r-0 font-semibold">{h.trim()}</th>)}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, j) => (
                  <tr key={j} className="border-t border-[#1c1c1c]">
                    {row.map((cell, k) => <td key={k} className="px-3 py-2 text-[#a3a3a3] border-r border-[#2a2a2a] last:border-r-0 tnum">{renderInline(cell.trim())}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        return <p key={i} className="my-3 ff-sans text-[14px]">{renderInline(b.text)}</p>;
      })}
    </div>
  );
}

function parseMarkdownBlocks(content) {
  const lines = content.split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }
    if (line.trim() === "---") { blocks.push({ type: "hr" }); i++; continue; }
    if (line.startsWith("## ")) { blocks.push({ type: "h2", text: line.slice(3) }); i++; continue; }
    if (line.startsWith("```")) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      blocks.push({ type: "code", text: buf.join("\n") });
      continue;
    }
    if (line.trim().startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (line.trim().startsWith("|") && i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) {
      const headers = line.split("|").slice(1, -1);
      i += 2; // skip separator
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].split("|").slice(1, -1));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }
    // paragraph (collect lines until blank)
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("##") && !lines[i].startsWith("```") && !lines[i].trim().startsWith("- ") && !lines[i].trim().startsWith("|") && lines[i].trim() !== "---") {
      buf.push(lines[i]); i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }
  return blocks;
}

function renderInline(text) {
  // **bold** then *italic* then `code` then [link](url)
  const parts = [];
  let remaining = text;
  let key = 0;
  const patterns = [
    { re: /\*\*([^*]+)\*\*/, render: (m) => <strong key={key++} className="text-white font-semibold">{m[1]}</strong> },
    { re: /`([^`]+)`/,        render: (m) => <code key={key++} className="ff-mono text-[12px] bg-[#1c1c1c] px-1.5 py-0.5 text-[#a3e635]">{m[1]}</code> },
    { re: /\[([^\]]+)\]\(([^)]+)\)/, render: (m) => <a key={key++} href={m[2]} className="text-[#a3e635] underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">{m[1]}</a> }
  ];
  while (remaining.length > 0) {
    let earliest = null;
    for (const p of patterns) {
      const m = remaining.match(p.re);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { match: m, pattern: p };
      }
    }
    if (!earliest) { parts.push(remaining); break; }
    if (earliest.match.index > 0) parts.push(remaining.slice(0, earliest.match.index));
    parts.push(earliest.pattern.render(earliest.match));
    remaining = remaining.slice(earliest.match.index + earliest.match[0].length);
  }
  return parts;
}

/* ============================================================
   ROOT
   ============================================================ */
export default function App() {
  const [tab, setTab] = useState("architecture");
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { id: "architecture", label: "ARCHITECTURE", icon: GitBranch,    sub: "middleware · sdk · proxy" },
    { id: "interview",    label: "INTERVIEWS",   icon: Mic,           sub: "discovery scripts" },
    { id: "email",        label: "COLD EMAILS",  icon: Mail,          sub: "3-touch sequence" },
    { id: "blog",         label: "BLOG DRAFTS",  icon: FileText,      sub: "3 publication-ready posts" }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />
      <div className="min-h-screen bg-[#0a0a0a] text-white relative scan-bg">
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-50" />
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-6 pb-5 border-b border-[#1c1c1c]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#a3e635] flex items-center justify-center">
                  <Activity size={14} className="text-black" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="ff-mono text-sm font-bold tracking-wide text-white">
                    AI/COST/PLAYBOOK
                  </div>
                  <div className="ff-mono text-[9px] text-[#525252] tracking-widest">v0.1 · MAY 2026 · ARTIFACT 2 / 2</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 ff-mono text-[10px] text-[#525252] tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full pulse-glow" />
                <span>EXECUTION READY</span>
              </div>
              <div className="tnum">{time.toISOString().slice(11,19)}<span className="blink">_</span></div>
            </div>
          </header>

          {/* TAB NAV */}
          <nav className="flex gap-0 mb-6 border-b border-[#1c1c1c] overflow-x-auto slim-scroll">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group relative px-5 py-3 transition-all flex-shrink-0 ${active ? "" : "hover:bg-[#141414]"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={active ? "text-[#a3e635]" : "text-[#525252] group-hover:text-[#a3a3a3]"} />
                    <div className="text-left">
                      <div className={`ff-mono text-xs tracking-[0.15em] font-semibold ${active ? "text-white" : "text-[#737373] group-hover:text-white"}`}>
                        {t.label}
                      </div>
                      <div className={`ff-mono text-[9px] tracking-wider ${active ? "text-[#a3e635]" : "text-[#525252]"}`}>
                        {t.sub}
                      </div>
                    </div>
                  </div>
                  {active && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#a3e635]" />}
                </button>
              );
            })}
            <div className="flex-1 border-b border-transparent" />
          </nav>

          {/* CONTENT */}
          <main className="pb-12">
            {tab === "architecture" && <ArchitectureTab />}
            {tab === "interview"    && <InterviewTab />}
            {tab === "email"        && <EmailTab />}
            {tab === "blog"         && <BlogTab />}
          </main>

          {/* FOOTER */}
          <footer className="border-t border-[#1c1c1c] pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-4 ff-mono text-[10px] text-[#525252] tracking-wider">
              <span>CODE SAMPLES · MAY 2026 MODELS (OPUS 4.7 · SONNET 4.6 · HAIKU 4.5 · GPT-5.4)</span>
            </div>
            <div className="flex items-center gap-3 ff-mono text-[10px] text-[#525252] tracking-wider">
              <ArrowRight size={10} className="text-[#525252] rotate-180" />
              <span>PREV: COCKPIT</span>
              <span>·</span>
              <span className="text-[#a3e635]">ARTIFACT 2 / 2</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
