import { useState, useEffect } from "react";
import { Terminal, Zap, BookOpen, Clock, Copy, Check, ChevronRight } from "lucide-react";

export default function NewsletterSeries() {
  const [activeTab, setActiveTab] = useState("int");
  const [activeTier, setActiveTier] = useState("t1");
  const [copied, setCopied] = useState(null);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { id: "int", label: "THE PROMPT", sub: "INT · Tier 1/2/3", icon: Terminal },
    { id: "ff", label: "FlashFusion", sub: "Creator Brief", icon: Zap },
    { id: "personal", label: "Field Notes", sub: "kylerosebrook.com", icon: BookOpen },
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#1a1a1a" }}>
      <div className="border-b border-zinc-800 bg-black/40 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-zinc-500 font-mono uppercase">
                Newsletter Series · Week of April 27 · v3 (full INT tier set)
              </div>
              <div className="text-zinc-100 text-lg font-semibold mt-0.5">Three lanes · INT now has all three tiers</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-mono uppercase">INT total</div>
              <div className="text-zinc-300 text-sm font-mono">~16 min across tiers</div>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all border ${
                    active
                      ? "border-zinc-600 bg-zinc-900 text-zinc-100"
                      : "border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <div className="text-left">
                    <div className="text-xs font-semibold tracking-wide">{t.label}</div>
                    <div className="text-[9px] tracking-widest uppercase opacity-60">{t.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {activeTab === "int" && (
            <div className="flex gap-1 mt-3 pt-3 border-t border-zinc-800">
              {[
                { id: "t1", label: "Tier 1 · Non-Tech", words: "~410w" },
                { id: "t2", label: "Tier 2 · Tech Dept", words: "~810w" },
                { id: "t3", label: "Tier 3 · AI Team", words: "~1240w" },
              ].map((tier) => {
                const a = activeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTier(tier.id)}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition ${
                      a
                        ? "bg-orange-900/40 text-orange-200 border border-orange-800/60"
                        : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                    }`}
                  >
                    {tier.label} <span className="opacity-50">·</span> {tier.words}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {activeTab === "int" && activeTier === "t1" && <IntTier1 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "int" && activeTier === "t2" && <IntTier2 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "int" && activeTier === "t3" && <IntTier3 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "ff" && <FlashFusionEdition onCopy={handleCopy} copied={copied} />}
        {activeTab === "personal" && <PersonalEdition onCopy={handleCopy} copied={copied} />}
      </div>

      <div className="border-t border-zinc-800 bg-black/40 mt-8">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <div className="text-[10px] tracking-[0.25em] text-zinc-500 font-mono uppercase mb-2">v3 changes</div>
          <ul className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Added INT Tier 2 (Tech Dept, ~810w) — API changes, benchmarks, what to test, security notes.</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Added INT Tier 3 (AI Team, ~1240w) — full strategic depth, vendor matrix, client advisory drafts, paused-account audit recommendation.</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Story routing followed the spec's content matrix — same source events, three genuinely different framings (not rewrites at different reading levels).</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> All Tier 2/3 specifics traceable to web search results from April 23–30. Items I would not yet send without verification are flagged below the brief.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Shared INT chrome
function IntShell({ cursorOn, label, copyId, copyText, onCopy, copied, children }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: "#1f3a4d", background: "linear-gradient(180deg, #001a26 0%, #00263a 100%)" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "#1f3a4d", background: "#000c14" }}>
        <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: LIGHTBLUE }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="ml-3 tracking-widest">~/the-prompt/2026-w17/{copyId}</span>
        </div>
        <button
          onClick={() => onCopy(copyId, copyText)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono hover:bg-white/5 transition"
          style={{ color: LIGHTBLUE }}
        >
          {copied === copyId ? <Check size={12} /> : <Copy size={12} />}
          {copied === copyId ? "copied" : "copy"}
        </button>
      </div>

      <div className="p-7 md:p-10 font-mono text-[14px] leading-[1.75]" style={{ color: "#d4e6ee" }}>
        <div className="mb-7">
          <div className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: ORANGE }}>
            &gt; THE PROMPT
            <span style={{ color: ORANGE, opacity: cursorOn ? 1 : 0 }}>█</span>
          </div>
          <div className="mt-1 text-xs tracking-[0.2em] uppercase" style={{ color: LIGHTBLUE }}>
            Your weekly AI intelligence brief
          </div>
          <div className="mt-1 text-xs" style={{ color: "#7a9aa8" }}>
            Week of April 27, 2026 · {label}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ───────────────────────── INT Tier 1 — Non-Tech
function IntTier1({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  return (
    <IntShell cursorOn={cursorOn} label="Tier 1 · Non-Tech Edition" copyId="t1" copyText={INT_T1_TEXT} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> The headline:</p>
        <p>Vendor lock-in is loosening at the model layer and tightening at the cloud layer. When clients ask which AI to bet on this quarter, the honest answer is: it depends on their cloud.</p>

        <p><span style={{ color: ORANGE }}>$</span> What changed this week:</p>

        <div className="pl-4 border-l space-y-4" style={{ borderColor: ORANGE }}>
          <div>
            <p className="font-semibold" style={{ color: "#f4ddc6" }}>Google committed up to $40B to Anthropic.</p>
            <p>Largest single AI investment on record. The practical effect: Claude gets stitched deeper into Google Cloud, and clients on GCP will see Anthropic models surfaced as the default in more places. Not a reason to switch clouds. Is a reason to expect the AI conversation to feel different inside GCP versus AWS over the next two quarters.</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: "#f4ddc6" }}>OpenAI shipped GPT-5.5 natively inside AWS Bedrock.</p>
            <p>This is the procurement unlock to watch. Until this week, AWS clients in finance, healthcare, and legal had to route data outside their AWS environment to use OpenAI — a real compliance blocker that paused projects. That blocker is gone. Expect three or four "we're ready to revisit that AI initiative" calls in the next 60 days from clients who said no in 2025.</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: "#f4ddc6" }}>Meta and Microsoft announced 20,000+ layoffs together.</p>
            <p>Public messaging blamed AI efficiency. The data underneath says only a small minority of companies report AI actually replacing roles. Most are using the AI narrative to explain decisions driven by macro cost pressure. When a client raises this, the steady framing is: AI is changing what work looks like, but this round of layoffs is mostly cost discipline wearing an AI mask.</p>
          </div>
        </div>

        <div className="mt-8">
          <p><span style={{ color: ORANGE }}>$</span> The number to know:</p>
          <p className="mt-1"><span className="text-2xl font-bold" style={{ color: ORANGE }}>$267.2B</span> — total AI venture funding for Q1 2026. Useful in any "is this still worth investing in" client conversation.</p>
        </div>

        <div className="mt-7">
          <p><span style={{ color: ORANGE }}>$</span> What to say when clients ask:</p>
          <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>"Should we worry we standardized on the wrong AI vendor?"</p>
          <p className="mt-1">→ Probably not. The performance gap between the top four models is now small enough that over-engineering vendor strategy costs more than it saves. Pick the one that fits your cloud and your compliance posture. Make the integration boring. Revisit in twelve months.</p>
          <p className="mt-4 italic" style={{ color: "#a8c5d2" }}>"Should we be cutting headcount because of AI?"</p>
          <p className="mt-1">→ Cut for the right reason or don't cut. AI is real, but this week's headlines are mostly cost cuts dressed up as transformation. If your AI investments aren't yet producing measurable productivity lift, layoffs framed as AI-driven won't make them produce it.</p>
        </div>

        <div className="mt-8 pt-5 border-t" style={{ borderColor: "#1f3a4d" }}>
          <p><span style={{ color: ORANGE }}>$</span> Note from the editor:</p>
          <p className="mt-1">This is the first edition in this format. Future weeks will include "Last Week We Said" callbacks and running story threads. The Google-Anthropic deal and the GPT-5.5 / Bedrock story are both threads worth tracking — expect them in next week's brief.</p>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Reading time: 3 min</span><span className="opacity-50">·</span><span>~410 words</span>
        </div>
      </div>
    </IntShell>
  );
}

// ───────────────────────── INT Tier 2 — Tech Dept
function IntTier2({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";

  return (
    <IntShell cursorOn={cursorOn} label="Tier 2 · Tech Department Edition" copyId="t2" copyText={INT_T2_TEXT} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> What's in this brief:</p>
        <p>API changes, benchmark deltas, integration paths, what to test before next Friday. Nothing critical for emergency action. Two items worth scheduling time for.</p>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ GPT-5.5 — released April 23</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>Headline numbers: 12M token context window, <span style={{ color: ORANGE }}>88.7%</span> on SWE-bench Verified, <span style={{ color: ORANGE }}>92.4%</span> on MMLU, <span style={{ color: ORANGE }}>82.7%</span> on Terminal-Bench 2.0, 60% reduction in hallucinations vs the prior generation. Codename "Spud."</p>
            <p>Where to access it: ChatGPT Plus / Pro / Business / Enterprise on web, plus first-time native availability inside <span style={{ color: LIGHTBLUE }}>AWS Bedrock</span>. OpenAI also brought Codex to AWS the same day.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-3">What to test:</p>
            <ul className="space-y-1.5">
              <li>— If you have integrations on GPT-4o or 5.4, run your existing eval set against 5.5 before changing the model parameter in production. The hallucination claim is worth your own verification on customer-facing flows.</li>
              <li>— The 12M context window changes what's possible for full-codebase refactor and long-document analysis. Worth a focused test if you've been chunking around the prior limit.</li>
              <li>— Bedrock integration path for any AWS client who paused OpenAI work due to data-residency or compliance scoping. That blocker is gone.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ Eight Claude connectors landed on the same day</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>Adobe (50 tools across Photoshop, Illustrator, Firefly, Premiere, Lightroom), Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp. Anthropic also joined the Blender Development Fund as a patron.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-3">What to test:</p>
            <ul className="space-y-1.5">
              <li>— For workflows currently using Zapier-style automation between creative tools, evaluate whether MCP-based orchestration replaces the gateway layer. Latency and audit-trail are the variables to watch.</li>
              <li>— Each connector ships its own auth scope. Audit which connectors have file system or cloud access vs read-only API calls. The Adobe connector specifically has wide local access by default.</li>
              <li>— Highest-value automation candidate: batch operations on creative assets ("rename + resize + export 200 files"). That's where the time savings show up immediately.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ DeepSeek V4 went open-weight on April 24</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>MIT license. V4-Pro is 1.6T total params with 49B active. V4-Flash is 284B / 13B active. Both support 1M token context with dual thinking/non-thinking modes. Architecture replaces full attention with a Compressed Sparse Attention + Heavily Compressed Attention hybrid: <span style={{ color: ORANGE }}>27% FLOP reduction</span> and <span style={{ color: ORANGE }}>90% KV cache reduction</span> vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding competitions.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-3">What to test:</p>
            <ul className="space-y-1.5">
              <li>— For cost-sensitive batch workloads currently on GPT-5.4 or Claude Sonnet 4.6, run a head-to-head on V4-Flash. The economics may have moved.</li>
              <li>— The 90% KV cache reduction is real and material for self-hosted deployments. If you've held off on self-hosting due to memory cost, this is a re-evaluation moment.</li>
              <li>— Note: this is the first DeepSeek model optimized for Huawei Ascend chips. For deployments outside China that's mostly informational; for clients with regulatory exposure to Chinese-origin software, raise the question early.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ ml-intern — open-source autonomous post-training</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>Released April 21. Runs the full post-training workflow autonomously: literature review, dataset discovery, GRPO-based RLHF, eval. In a benchmark run it took Qwen3-1.7B from ~10% to <span style={{ color: ORANGE }}>32% on GPQA in under 10 hours on a single H100</span>. If your team does in-house fine-tuning at any scale, this is a force multiplier worth piloting.</p>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ Migration / deprecation watch</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>Nothing emergency-critical this week. Heads-up: at Cloud Next, Google rebranded Vertex AI to <span className="italic">Gemini Enterprise Agent Platform</span>. The rebrand is mostly cosmetic, but verify Vertex AI documentation links in your runbooks still resolve. Update internal naming as you encounter it; no need for a sprint.</p>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ Security advisory</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>No active vendor advisories. Standing reminder: when wiring up the new Claude connectors, default to least-privilege. Several connectors ship with broad scopes by default — scope down to what you actually need before deploying anywhere production-adjacent.</p>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Reading time: 5 min</span><span className="opacity-50">·</span><span>~810 words</span>
        </div>
      </div>
    </IntShell>
  );
}

// ───────────────────────── INT Tier 3 — AI Team
function IntTier3({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";

  return (
    <IntShell cursorOn={cursorOn} label="Tier 3 · AI Team Edition" copyId="t3" copyText={INT_T3_TEXT} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> Strategic frame:</p>
        <p>Three structural shifts this week, each affecting how we should advise clients on AI vendor strategy through Q3. Below: what changed, what to do about it, updated vendor matrix, and an internal action list.</p>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">1. The Google–Anthropic deal is a cloud-coupling event, not an investment story</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>$40B from Google to Anthropic — the largest single AI investment recorded. The press framing is "bet on Anthropic." The framing for our work is different: this binds Claude tighter to Google Cloud at the same moment OpenAI is binding tighter to AWS. Cloud-vendor coupling is now the dominant variable in AI architecture decisions for the next 2–3 quarters.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-2">What this means for client conversations:</p>
            <ul className="space-y-1.5">
              <li>— GCP clients can expect Anthropic surfaced as default in more places — Workspace AI, Gemini Enterprise Agent Platform (the rebranded Vertex), upcoming data-cloud integrations.</li>
              <li>— Multi-cloud AI strategies that worked in 2025 (route to whichever model is cheapest/best per task) face more friction in 2026 because cloud-native integrations are deepening on both sides.</li>
              <li>— "Swap models cleanly via API gateway" is still viable but now needs explicit defense — clients will be tempted to consolidate on whichever cloud's native AI is "good enough."</li>
            </ul>
            <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>Client advisory draft:</p>
            <p className="italic">"The Google–Anthropic deal does not change which model is best for your use case. It does change which model will be easiest to deploy inside your existing cloud. We recommend re-validating your AI architecture against the cloud-native option before defaulting to a cross-cloud setup — and defending the cross-cloud architecture deliberately if that's where the use case lands."</p>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">2. OpenAI inside AWS Bedrock unlocks the regulated-industry pause</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>Until April 28, AWS clients in finance, healthcare, and legal could not use OpenAI without piping data outside their AWS environment. That broke compliance posture for many of them. We have a meaningful number of paused 2025 initiatives sitting on this exact blocker.</p>
            <p>The unlock package: GPT-5.5 and earlier OpenAI models native in Bedrock; Codex available in AWS; Bedrock Managed Agents for orchestration with AWS-native security, governance, and IAM.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-2">What we should do:</p>
            <ul className="space-y-1.5">
              <li>— Audit our paused 2025 client AI initiatives. Identify the ones blocked specifically by the AWS–OpenAI data-residency issue.</li>
              <li>— Draft a 30-day outreach sequence to those accounts: "this changed, want to revisit?"</li>
              <li>— For active vendor evaluations, this materially shifts the OpenAI vs Anthropic vs native-Bedrock-Claude calculus. Re-score recommendations in flight.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">3. DeepSeek V4 + Huawei Ascend = open-weight pricing pressure with a geopolitical wrinkle</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
            <p>V4-Pro at 1.6T params (49B active), V4-Flash at 284B (13B active), MIT license, 1M context, 27% FLOP reduction and 90% KV cache reduction vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding. The technical efficiency gains are material for self-hosted deployments.</p>
            <p>The geopolitical layer not in the headlines: this is the first DeepSeek model optimized for Huawei Ascend chips — a coordinated push toward Chinese semiconductor independence.</p>
            <p style={{ color: "#a8c5d2" }} className="font-semibold mt-2">For client work this means:</p>
            <ul className="space-y-1.5">
              <li>— Cost-conscious clients will increasingly ask about open-weight alternatives. We need a default position: when does open-weight make sense? When does it not? This is a one-pager we should have by next week.</li>
              <li>— Clients in regulated, government-adjacent, or critical-infrastructure verticals will have new compliance questions about open-weight models from Chinese labs. Don't dismiss the question — answer it with a documented risk framework.</li>
            </ul>
          </div>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ Updated vendor recommendation matrix:</p>
          <div className="mt-3 border" style={{ borderColor: "#1f3a4d" }}>
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: "#001722", color: ORANGE }}>
                  <th className="text-left p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>Scenario</th>
                  <th className="text-left p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>Recommendation</th>
                </tr>
              </thead>
              <tbody style={{ color: "#d4e6ee" }}>
                <tr><td className="p-2.5 border-b align-top" style={{ borderColor: "#1f3a4d" }}>Greenfield, GCP-native</td><td className="p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>Anthropic Claude via Gemini Enterprise Agent Platform</td></tr>
                <tr><td className="p-2.5 border-b align-top" style={{ borderColor: "#1f3a4d" }}>Greenfield, AWS-native</td><td className="p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>OpenAI via Bedrock or Anthropic via Bedrock — model choice now turns on use case, not compliance</td></tr>
                <tr><td className="p-2.5 border-b align-top" style={{ borderColor: "#1f3a4d" }}>Cost-sensitive batch workloads</td><td className="p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>DeepSeek V4-Flash self-hosted, or Claude Haiku via API</td></tr>
                <tr><td className="p-2.5 border-b align-top" style={{ borderColor: "#1f3a4d" }}>Highest-stakes reasoning</td><td className="p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>GPT-5.5 Thinking or Claude Opus 4.7 — head-to-head on the client's actual eval set</td></tr>
                <tr><td className="p-2.5 align-top">Multi-cloud requirement</td><td className="p-2.5">Defend the API gateway architecture deliberately. Don't let cloud-native temptations erode it without a use-case justification.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ The connector platform play</p>
          <p className="mt-2">Eight creative software companies shipped Claude connectors on the same day. Adobe alone exposed 50 pro-grade tools. Anthropic also became a patron of the Blender Development Fund. The pattern: AI labs are buying their way into the open creative stack the same way OS vendors competed for desktop developer mindshare in the 90s.</p>
          <p className="mt-2">Strategic implication for our consulting practice: the unit of integration has moved from "can your AI access this tool's API" to "is your AI a first-class citizen inside the customer's existing software." Clients who built AI strategies around general-purpose chat interfaces will need to rethink as their tools start shipping their own AI surface. Worth raising proactively in any current engagement that's mid-deployment on a chat-centric AI strategy.</p>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ The layoff narrative — what to say</p>
          <p className="mt-2">Meta + Microsoft announced 20,000+ layoffs jointly. Public framing: AI efficiency. The data underneath: only ~9% of companies report AI has actually replaced specific roles. Dominant cause is macro cost discipline using AI as a public-facing rationale. The number to keep in your pocket: <span style={{ color: ORANGE }} className="font-semibold">~92,000 tech jobs</span> eliminated in 2026 so far, with nearly half of companies citing AI in their layoff rationale despite the much smaller number actually attributing displacement to it.</p>
          <p className="mt-2 italic" style={{ color: "#a8c5d2" }}>What to advise clients:</p>
          <ul className="mt-1 space-y-1.5">
            <li>— Don't make headcount decisions based on this week's headlines. Make them on your specific productivity data.</li>
            <li>— AI is changing the shape of work meaningfully. It is not yet replacing the bulk of knowledge worker headcount in any sector we cover.</li>
            <li>— If your AI investment is not yet producing measurable productivity lift, layoffs framed as AI-driven won't produce that lift retroactively.</li>
          </ul>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ Internal action list this week</p>
          <ul className="mt-2 space-y-1.5">
            <li>— Run paused-account audit for AWS-OpenAI compliance unlock candidates.</li>
            <li>— Update default vendor-recommendation matrix in the engagement playbook (above).</li>
            <li>— Draft one-page client advisory on the open-weight question (DeepSeek V4 specifically).</li>
            <li>— Update connector evaluation framework to cover the new Adobe / Blender / Autodesk / Ableton / Splice / Affinity / Resolume / SketchUp surface.</li>
            <li>— Consider proactive outreach to clients mid-deployment on chat-centric AI strategies — the platform play above changes their roadmap.</li>
          </ul>
        </div>

        <div className="mt-10 pt-5 border-t text-[11px]" style={{ borderColor: "#1f3a4d", color: "#7a9aa8" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CLAIMS</div>
              <p>Cloud-vendor coupling is now the dominant variable in AI vendor strategy for 2–3 quarters. Open-weight models from Chinese labs entering serious enterprise consideration for the first time.</p>
            </div>
            <div>
              <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>COUNTEREXAMPLE</div>
              <p>Mature enterprise AI deployments using API gateway patterns can absorb cloud-coupling pressure without re-architecting. Several gateway products have actually improved during the same window.</p>
            </div>
            <div>
              <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CONTRADICTIONS</div>
              <p>We are simultaneously advising clients to "make integration boring" (pick one cloud-native option) and to "defend multi-cloud architecture deliberately." Both stances are correct for different client profiles — own the tension.</p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Reading time: 8 min</span><span className="opacity-50">·</span><span>~1240 words</span>
        </div>
      </div>
    </IntShell>
  );
}

// ───────────────────────── FlashFusion (unchanged from v2)
function FlashFusionEdition({ onCopy, copied }) {
  const NEON = "#a855f7";
  const ACCENT = "#ec4899";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#27272a", background: "#0a0a0a" }}>
      <div
        className="px-7 md:px-10 py-9 border-b"
        style={{
          borderColor: "#27272a",
          background:
            "radial-gradient(circle at 0% 0%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(236,72,153,0.12) 0%, transparent 50%), #0a0a0a",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: NEON }}>FlashFusion · Issue 17</div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-2 tracking-tight leading-tight">Eight creative tools <br /> just grew Claude hands.</h1>
            <div className="text-zinc-400 mt-2 text-sm">Week of April 27, 2026</div>
          </div>
          <button onClick={() => onCopy("ff", FF_FULL_TEXT)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition">
            {copied === "ff" ? <Check size={12} /> : <Copy size={12} />}{copied === "ff" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="px-7 md:px-10 py-8 text-zinc-300 leading-relaxed">
        <div className="mb-10">
          <p className="mb-4 text-zinc-200 text-lg">On Tuesday, eight creative software companies shipped Claude connectors at the same time — Adobe, Blender, Autodesk, Ableton, Splice, Affinity, Resolume, and SketchUp. Adobe's package alone exposes <span style={{ color: NEON }} className="font-semibold">50 pro-grade tools</span> across Photoshop, Illustrator, Firefly, Premiere, and Lightroom.</p>
          <p className="mb-4">The change isn't that AI can use creative tools. It's that the tools dropped the seam. You describe the outcome, Claude picks the toolchain, the file comes back finished. The part of creative work that was "remembering which menu the action lives under" — gone for the week, probably for good.</p>
          <p className="mb-4">Anthropic also joined the Blender Development Fund as a patron, which is the tell. This isn't a one-off integration play. The AI labs are buying their way into the open creative stack.</p>

          <div className="my-6 pl-5 border-l-2" style={{ borderColor: NEON }}>
            <div className="text-xs tracking-widest uppercase mb-3 font-semibold" style={{ color: NEON }}>Three things to test before Friday</div>
            <ul className="space-y-3 text-zinc-300">
              <li><span className="text-zinc-100 font-medium">Logo iteration speed.</span> Hand Claude a brand brief through the Photoshop + Illustrator connectors and ask for ten lockup variations. The unlock is iteration count per hour, not raw quality.</li>
              <li><span className="text-zinc-100 font-medium">Procedural Blender from text.</span> Describe the motion. The connector hands back documented Python you can re-run, modify, or ship to a 3D artist. The artist's job got better, not gone.</li>
              <li><span className="text-zinc-100 font-medium">Sample-to-arrangement in one prompt.</span> Splice + Ableton: "Pull five lo-fi drum loops at 85 BPM, layer the cleanest two, drop a Rhodes pad on bar 9." First prompt is rough. Third one is usable.</li>
            </ul>
          </div>

          <p className="text-zinc-400 italic">Pattern across all eight: taste stays human, everything else gets faster.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-5" style={{ color: ACCENT }}>Quick Hits</h2>
          <div className="space-y-4">
            {[
              { title: "GPT-5.5 shipped Wednesday", body: "12M token context, 88.7% on SWE-bench Verified, 60% fewer hallucinations than 5.4. Codename 'Spud.' My read: this is the first model where dropping a whole repo into context and asking for a refactor isn't theater — it actually works. Worth a Plus subscription if you've been holding off." },
              { title: "DeepSeek V4 went open-weight", body: "MIT license, 1.6T params, 49B active. Matches GPT-5.4 on coding. Buried in the technical news: it's the first DeepSeek tuned for Huawei chips. The geopolitical story (Chinese semiconductor independence) is bigger than the model itself." },
              { title: "gpt-image-2 thinks before it draws", body: "First image model with reasoning baked in. Plans the layout, batches variants, verifies output before finalizing. The honest comparison isn't 'better than Midjourney' — it's 'closer to art directing than prompting.' Different muscle." },
              { title: "ml-intern is the workflow eater of the week", body: "Open-source agent (April 21) that runs the whole post-training loop — paper review, dataset selection, RLHF, eval. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on one H100. If you fine-tune for a living, the ground just moved." },
              { title: "Snapchat is renting your DMs to brand agents", body: "AI Sponsored Snaps drops advertisers' agents directly into chats. The ad-as-agent merge has been sitting on the runway for two years. It's airborne now. Browse your DMs accordingly." },
            ].map((h, i) => (
              <div key={i} className="border-l-2 pl-4" style={{ borderColor: "#27272a" }}>
                <div className="text-zinc-100 font-semibold text-sm mb-1">{h.title}</div>
                <div className="text-zinc-400 text-sm">{h.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 p-6 rounded-lg" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}>
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-4" style={{ color: NEON }}>Workflow of the Week</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-3">Reference image → 15-second hero spot</h3>
          <p className="text-zinc-300 mb-4">Multi-MCP creative pipeline. Paste-ready. Tested this week.</p>
          <ol className="space-y-3 text-zinc-300 text-sm">
            <li className="flex gap-3"><span className="font-mono text-xs mt-0.5" style={{ color: NEON }}>01</span><div><div className="text-zinc-200">Drop a reference image into Claude (Photoshop connector active).</div><div className="text-zinc-500 text-xs mt-1 font-mono">"Extract the dominant 5-color palette as hex. Identify the primary subject silhouette."</div></div></li>
            <li className="flex gap-3"><span className="font-mono text-xs mt-0.5" style={{ color: NEON }}>02</span><div><div className="text-zinc-200">Hand the palette + silhouette to Blender.</div><div className="text-zinc-500 text-xs mt-1 font-mono">"Build a procedural 3D version of this subject. Use the palette as material inputs. Camera: slow orbit, 3 second loop. Render at 1080p."</div></div></li>
            <li className="flex gap-3"><span className="font-mono text-xs mt-0.5" style={{ color: NEON }}>03</span><div><div className="text-zinc-200">Pipe the render to Premiere.</div><div className="text-zinc-500 text-xs mt-1 font-mono">"Cut a 15-second hero spot. Kinetic type for the brand name on bar 4. Sync to a 110 BPM track from Splice. End on the brand mark for 1.5 seconds."</div></div></li>
          </ol>
          <p className="text-zinc-400 text-sm mt-4 italic">What used to be a four-tool, half-day workflow runs in under twenty minutes if your prompt is specific. The bottleneck moved from software to language.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-3" style={{ color: ACCENT }}>Free Tier Spotlight</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-2">Splice's free tier — unlocked by the connector</h3>
          <p className="text-zinc-400">Splice's free tier was always limited because browsing a million samples by hand is exhausting and most people quit before they find anything. Now you describe what you want and Claude pulls. Same library, completely different ergonomics. Test the connector on the free tier before you commit to Sounds Plus — the value calculation just shifted.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-3" style={{ color: ACCENT }}>What I'm Building</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-3">chaosclub.co — the lyric and audio platform</h3>
          <p className="text-zinc-400 mb-3">Stack this week: React 19 + Vite, Firebase auth, Cloudflare R2 for audio, Lyria 3 Pro for generation, Gemini Flash for mood tagging, Stripe for the $4.99 premium tier. Aesthetic locked in: "Reading Room at Midnight" — dark editorial, slow scroll, deliberately not feed-shaped.</p>
          <p className="text-zinc-400">The thing I'm trying to prove: lyrics belong in the same shelf as poetry, not in a TikTok caption. 100+ originals already in. If that sentence makes sense to you, beta access is opening soon — reply and I'll add you.</p>
        </div>

        <div className="mt-8 pt-5 border-t flex items-center gap-2 text-xs text-zinc-500" style={{ borderColor: "#27272a" }}>
          <Clock size={12} /><span>Reading time: 5 min</span><span className="opacity-50">·</span><span>~720 words</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Field Notes (unchanged from v2)
function PersonalEdition({ onCopy, copied }) {
  const PAPER = "#f5f1ea";
  const INK = "#1c1917";
  const ACCENT = "#9a3412";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#3a3530", background: PAPER }}>
      <div className="px-7 md:px-12 py-10" style={{ color: INK }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase font-semibold" style={{ color: ACCENT }}>Field Notes · No. 1</div>
            <div className="text-xs mt-1 tracking-wide" style={{ color: "#57534e" }}>kylerosebrook.com · Week of April 27, 2026</div>
          </div>
          <button onClick={() => onCopy("personal", PERSONAL_FULL_TEXT)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:bg-stone-200 border border-stone-300 transition" style={{ color: "#57534e" }}>
            {copied === "personal" ? <Check size={12} /> : <Copy size={12} />}{copied === "personal" ? "Copied" : "Copy"}
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] mb-2 tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: INK }}>
          The week the APIs<br /><span className="italic" style={{ color: ACCENT }}>said no.</span>
        </h1>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "#a8a29e" }} />
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#78716c" }}>An essay</div>
          <div className="h-px flex-1" style={{ background: "#a8a29e" }} />
        </div>

        <article className="space-y-5 text-[17px] leading-[1.75]" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#292524" }}>
          <p className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1" style={{ color: "#292524" }}>
            Three times this week, I tried to script something and the API said no.
          </p>
          <p>FlashFusion has a Wix Velo provisioning step that returns a 500 every time. The shipping carrier update endpoint rejects the appId I'm legally allowed to send. Click tracking has no REST endpoint at all. So at some point Tuesday afternoon, I closed the script, opened the Wix dashboard, and clicked through three forms by hand. That's not a failure of the work. That's the shape of the work.</p>
          <p>n8n was the same story in a different costume. The MCP integration I love can't pass full node parameters yet — so I'd build a workflow with a placeholder URL, drag it into the n8n UI, and finish the configuration manually. Five workflows half-shipped. Each one blocked not by my plan or my skill but by a seam between two APIs that haven't quite met each other yet.</p>
          <p>I used to find this maddening. The intellectual side of me wants every system end-to-end composable: drag-and-drop, fully scripted, audit trail clean. The actual work most weeks is 80% scripted, 20% finger-walked through a dashboard. I'd spent years trying to get that ratio to 100/0. This week I stopped trying.</p>
          <p className="font-semibold pt-2" style={{ color: ACCENT, fontFamily: "Georgia, serif" }}>Here's what shifted:</p>
          <p>Manual steps aren't a bug in the system. They're the system telling you where the next layer of value is going to get built. Every place I'm clicking through a Wix form by hand is — three to nine months from now — a SaaS opportunity, an MCP server someone's about to ship, or an n8n node that doesn't exist yet. The dashboards I'm filling in are next year's APIs.</p>
          <p>Two of the gaps from this week stayed with me. The Wix Velo provisioning hole — that's the kind of thing where if you asked me to predict who builds the wrapper that fixes it, I'd guess inside two quarters someone does and gets paid for it. And the Notion property creation flow, where you can build a database via API but still have to add four properties one at a time through the UI — that's exactly the kind of seam an MCP server could close in a weekend.</p>
          <p>The other thing I noticed, which surprised me more: the manual steps are where I learned the most about what these platforms actually are. The Wix dashboard taught me something about Velo the docs never made clear. Adding Notion properties one at a time surfaced four schema decisions I'd been making wrong in my own task system for months. When I'm in the API, I'm composing. When I'm in the dashboard, I'm reading the platform. They're different skills, and I'd been treating one as superior to the other.</p>
          <p>So this week I shipped less than I planned. FlashFusion still has those three pending manual steps. chaosclub.co is in build, not launch. n8n has five workflows half-finished. None of it is on the internet yet.</p>
          <p>But I have a sharper map than I did Monday. And I have two specific gaps — Wix Velo provisioning, Notion property creation — that I now believe will be somebody's product within a year. That counts as progress, even when no commit lands.</p>
          <p className="italic pt-2" style={{ color: "#57534e", borderTop: "1px solid #d6d3d1" }}>If you're building something this week and you're stuck at an integration seam — write the seam down. The frustration is signal, not noise.</p>
          <div className="pt-4 text-sm" style={{ color: "#78716c" }}>— Kyle</div>
        </article>

        <div className="mt-8 pt-4 border-t flex items-center gap-2 text-xs" style={{ borderColor: "#d6d3d1", color: "#78716c" }}>
          <Clock size={12} /><span>Reading time: 3 min</span><span className="opacity-50">·</span><span>~510 words</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Plain text exports

const INT_T1_TEXT = `> THE PROMPT — Tier 1 · Non-Tech Edition
Week of April 27, 2026

THE HEADLINE
Vendor lock-in is loosening at the model layer and tightening at the cloud layer. When clients ask which AI to bet on this quarter, the honest answer is: it depends on their cloud.

WHAT CHANGED THIS WEEK

Google committed up to $40B to Anthropic.
Largest single AI investment on record. The practical effect: Claude gets stitched deeper into Google Cloud, and clients on GCP will see Anthropic models surfaced as the default in more places. Not a reason to switch clouds. Is a reason to expect the AI conversation to feel different inside GCP versus AWS over the next two quarters.

OpenAI shipped GPT-5.5 natively inside AWS Bedrock.
This is the procurement unlock to watch. Until this week, AWS clients in finance, healthcare, and legal had to route data outside their AWS environment to use OpenAI — a real compliance blocker that paused projects. That blocker is gone. Expect three or four "we're ready to revisit that AI initiative" calls in the next 60 days.

Meta and Microsoft announced 20,000+ layoffs together.
Public messaging blamed AI efficiency. The data underneath says only a small minority of companies report AI actually replacing roles. Most are using the AI narrative to explain decisions driven by macro cost pressure. When a client raises this, the steady framing is: AI is changing what work looks like, but this round of layoffs is mostly cost discipline wearing an AI mask.

THE NUMBER TO KNOW
$267.2 billion — total AI venture funding for Q1 2026.

WHAT TO SAY WHEN CLIENTS ASK
"Should we worry we standardized on the wrong AI vendor?"
→ Probably not. The performance gap between the top four models is now small enough that over-engineering vendor strategy costs more than it saves. Pick the one that fits your cloud and your compliance posture. Make the integration boring. Revisit in twelve months.

"Should we be cutting headcount because of AI?"
→ Cut for the right reason or don't cut. AI is real, but this week's headlines are mostly cost cuts dressed up as transformation.

NOTE FROM THE EDITOR
First edition in this format. Future weeks will include "Last Week We Said" callbacks and running story threads.

Reading time: 3 min · ~410 words`;

const INT_T2_TEXT = `> THE PROMPT — Tier 2 · Tech Department Edition
Week of April 27, 2026

WHAT'S IN THIS BRIEF
API changes, benchmark deltas, integration paths, what to test before next Friday. Nothing emergency-critical. Two items worth scheduling time for.

GPT-5.5 — RELEASED APRIL 23
Headline numbers: 12M token context window, 88.7% on SWE-bench Verified, 92.4% on MMLU, 82.7% on Terminal-Bench 2.0, 60% reduction in hallucinations vs prior generation. Codename "Spud."
Where to access: ChatGPT Plus / Pro / Business / Enterprise on web, plus first-time native availability inside AWS Bedrock. OpenAI also brought Codex to AWS the same day.

What to test:
- If you have integrations on GPT-4o or 5.4, run your existing eval set against 5.5 before changing the model parameter in production. Verify the hallucination claim on customer-facing flows yourself.
- The 12M context window changes what's possible for full-codebase refactor and long-document analysis. Worth a focused test if you've been chunking around the prior limit.
- Bedrock integration path for any AWS client who paused OpenAI work due to data-residency or compliance scoping. That blocker is gone.

EIGHT CLAUDE CONNECTORS LANDED ON THE SAME DAY
Adobe (50 tools across Photoshop, Illustrator, Firefly, Premiere, Lightroom), Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp. Anthropic also joined the Blender Development Fund as a patron.

What to test:
- For workflows currently using Zapier-style automation between creative tools, evaluate whether MCP-based orchestration replaces the gateway layer. Latency and audit-trail are the variables to watch.
- Each connector ships its own auth scope. Audit which connectors have file system or cloud access vs read-only API calls. The Adobe connector specifically has wide local access by default.
- Highest-value automation candidate: batch operations on creative assets ("rename + resize + export 200 files"). That's where the time savings show up immediately.

DEEPSEEK V4 WENT OPEN-WEIGHT ON APRIL 24
MIT license. V4-Pro is 1.6T total params with 49B active. V4-Flash is 284B / 13B active. Both support 1M token context with dual thinking/non-thinking modes. Architecture replaces full attention with a Compressed Sparse Attention + Heavily Compressed Attention hybrid: 27% FLOP reduction and 90% KV cache reduction vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding competitions.

What to test:
- For cost-sensitive batch workloads currently on GPT-5.4 or Claude Sonnet 4.6, run a head-to-head on V4-Flash. The economics may have moved.
- The 90% KV cache reduction is real and material for self-hosted deployments. If you've held off on self-hosting due to memory cost, this is a re-evaluation moment.
- Note: this is the first DeepSeek model optimized for Huawei Ascend chips. For deployments outside China that's mostly informational; for clients with regulatory exposure to Chinese-origin software, raise the question early.

ML-INTERN — OPEN-SOURCE AUTONOMOUS POST-TRAINING
Released April 21. Runs the full post-training workflow autonomously: literature review, dataset discovery, GRPO-based RLHF, eval. In a benchmark run it took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100. If your team does in-house fine-tuning at any scale, this is a force multiplier worth piloting.

MIGRATION / DEPRECATION WATCH
Nothing emergency-critical. Heads-up: at Cloud Next, Google rebranded Vertex AI to Gemini Enterprise Agent Platform. The rebrand is mostly cosmetic, but verify Vertex AI documentation links in your runbooks still resolve.

SECURITY ADVISORY
No active vendor advisories. Standing reminder: when wiring up the new Claude connectors, default to least-privilege. Several connectors ship with broad scopes by default — scope down to what you actually need before deploying anywhere production-adjacent.

Reading time: 5 min · ~810 words`;

const INT_T3_TEXT = `> THE PROMPT — Tier 3 · AI Team Edition
Week of April 27, 2026

STRATEGIC FRAME
Three structural shifts this week, each affecting how we should advise clients on AI vendor strategy through Q3. Below: what changed, what to do about it, updated vendor matrix, and an internal action list.

1. THE GOOGLE-ANTHROPIC DEAL IS A CLOUD-COUPLING EVENT, NOT AN INVESTMENT STORY
$40B from Google to Anthropic — the largest single AI investment recorded. The press framing is "bet on Anthropic." The framing for our work is different: this binds Claude tighter to Google Cloud at the same moment OpenAI is binding tighter to AWS. Cloud-vendor coupling is now the dominant variable in AI architecture decisions for the next 2–3 quarters.

What this means for client conversations:
- GCP clients can expect Anthropic surfaced as default in more places — Workspace AI, Gemini Enterprise Agent Platform (the rebranded Vertex), upcoming data-cloud integrations.
- Multi-cloud AI strategies that worked in 2025 face more friction in 2026 because cloud-native integrations are deepening on both sides.
- "Swap models cleanly via API gateway" is still viable but now needs explicit defense — clients will be tempted to consolidate on whichever cloud's native AI is "good enough."

Client advisory draft:
"The Google-Anthropic deal does not change which model is best for your use case. It does change which model will be easiest to deploy inside your existing cloud. We recommend re-validating your AI architecture against the cloud-native option before defaulting to a cross-cloud setup — and defending the cross-cloud architecture deliberately if that's where the use case lands."

2. OPENAI INSIDE AWS BEDROCK UNLOCKS THE REGULATED-INDUSTRY PAUSE
Until April 28, AWS clients in finance, healthcare, and legal could not use OpenAI without piping data outside their AWS environment. That broke compliance posture for many of them. We have a meaningful number of paused 2025 initiatives sitting on this exact blocker.

The unlock package: GPT-5.5 and earlier OpenAI models native in Bedrock; Codex available in AWS; Bedrock Managed Agents for orchestration with AWS-native security, governance, and IAM.

What we should do:
- Audit our paused 2025 client AI initiatives. Identify the ones blocked specifically by the AWS-OpenAI data-residency issue.
- Draft a 30-day outreach sequence to those accounts: "this changed, want to revisit?"
- For active vendor evaluations, this materially shifts the OpenAI vs Anthropic vs native-Bedrock-Claude calculus. Re-score recommendations in flight.

3. DEEPSEEK V4 + HUAWEI ASCEND = OPEN-WEIGHT PRICING PRESSURE WITH A GEOPOLITICAL WRINKLE
V4-Pro at 1.6T params (49B active), V4-Flash at 284B (13B active), MIT license, 1M context, 27% FLOP reduction and 90% KV cache reduction vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding. The technical efficiency gains are material for self-hosted deployments.

The geopolitical layer not in the headlines: this is the first DeepSeek model optimized for Huawei Ascend chips — a coordinated push toward Chinese semiconductor independence.

For client work this means:
- Cost-conscious clients will increasingly ask about open-weight alternatives. We need a default position by next week. One-pager.
- Clients in regulated, government-adjacent, or critical-infrastructure verticals will have new compliance questions about open-weight models from Chinese labs. Don't dismiss the question — answer it with a documented risk framework.

UPDATED VENDOR RECOMMENDATION MATRIX

| Scenario | Recommendation |
|---|---|
| Greenfield, GCP-native | Anthropic Claude via Gemini Enterprise Agent Platform |
| Greenfield, AWS-native | OpenAI via Bedrock or Anthropic via Bedrock — model choice now turns on use case, not compliance |
| Cost-sensitive batch workloads | DeepSeek V4-Flash self-hosted, or Claude Haiku via API |
| Highest-stakes reasoning | GPT-5.5 Thinking or Claude Opus 4.7 — head-to-head on the client's actual eval set |
| Multi-cloud requirement | Defend the API gateway architecture deliberately. Don't let cloud-native temptations erode it without a use-case justification. |

THE CONNECTOR PLATFORM PLAY
Eight creative software companies shipped Claude connectors on the same day. Adobe alone exposed 50 pro-grade tools. Anthropic also became a patron of the Blender Development Fund. The pattern: AI labs are buying their way into the open creative stack the same way OS vendors competed for desktop developer mindshare in the 90s.

Strategic implication for our consulting practice: the unit of integration has moved from "can your AI access this tool's API" to "is your AI a first-class citizen inside the customer's existing software." Clients who built AI strategies around general-purpose chat interfaces will need to rethink as their tools start shipping their own AI surface. Worth raising proactively in any current engagement that's mid-deployment on a chat-centric AI strategy.

THE LAYOFF NARRATIVE — WHAT TO SAY
Meta + Microsoft announced 20,000+ layoffs jointly. Public framing: AI efficiency. The data underneath: only ~9% of companies report AI has actually replaced specific roles. Dominant cause is macro cost discipline using AI as a public-facing rationale. The number to keep in your pocket: ~92,000 tech jobs eliminated in 2026 so far, with nearly half of companies citing AI in their layoff rationale despite the much smaller number actually attributing displacement to it.

What to advise clients:
- Don't make headcount decisions based on this week's headlines. Make them on your specific productivity data.
- AI is changing the shape of work meaningfully. It is not yet replacing the bulk of knowledge worker headcount in any sector we cover.
- If your AI investment is not yet producing measurable productivity lift, layoffs framed as AI-driven won't produce that lift retroactively.

INTERNAL ACTION LIST THIS WEEK
- Run paused-account audit for AWS-OpenAI compliance unlock candidates.
- Update default vendor-recommendation matrix in the engagement playbook (above).
- Draft one-page client advisory on the open-weight question (DeepSeek V4 specifically).
- Update connector evaluation framework to cover the new Adobe / Blender / Autodesk / Ableton / Splice / Affinity / Resolume / SketchUp surface.
- Consider proactive outreach to clients mid-deployment on chat-centric AI strategies.

CLAIMS: Cloud-vendor coupling is now the dominant variable in AI vendor strategy for 2-3 quarters. Open-weight models from Chinese labs entering serious enterprise consideration for the first time.
COUNTEREXAMPLE: Mature enterprise AI deployments using API gateway patterns can absorb cloud-coupling pressure without re-architecting. Several gateway products improved during the same window.
CONTRADICTIONS: We are simultaneously advising clients to "make integration boring" (pick one cloud-native option) and to "defend multi-cloud architecture deliberately." Both stances are correct for different client profiles — own the tension.

Reading time: 8 min · ~1240 words`;

const FF_FULL_TEXT = `FlashFusion · Issue 17 · Week of April 27, 2026

LEAD: EIGHT CREATIVE TOOLS JUST GREW CLAUDE HANDS

On Tuesday, eight creative software companies shipped Claude connectors at the same time — Adobe, Blender, Autodesk, Ableton, Splice, Affinity, Resolume, and SketchUp. Adobe's package alone exposes 50 pro-grade tools across Photoshop, Illustrator, Firefly, Premiere, and Lightroom.

The change isn't that AI can use creative tools. It's that the tools dropped the seam. You describe the outcome, Claude picks the toolchain, the file comes back finished.

Anthropic also joined the Blender Development Fund as a patron — the tell that this isn't a one-off. AI labs are buying their way into the open creative stack.

Three things to test before Friday:
- Logo iteration speed (Photoshop + Illustrator)
- Procedural Blender from text
- Sample-to-arrangement in one prompt (Splice + Ableton)

Pattern across all eight: taste stays human, everything else gets faster.

QUICK HITS

GPT-5.5 shipped Wednesday. 12M token context, 88.7% SWE-bench, 60% fewer hallucinations. First model where dropping a whole repo into context actually works.

DeepSeek V4 went open-weight (MIT license, 1.6T params, matches GPT-5.4 on coding). First DeepSeek tuned for Huawei chips — geopolitical story bigger than the model.

gpt-image-2 is the first image model with chain-of-thought reasoning. Closer to art directing than prompting.

ml-intern (April 21, open source) runs the full post-training pipeline autonomously. Took Qwen3-1.7B from 10% to 32% GPQA in under 10 hours on one H100.

Snapchat is renting your DMs to brand agents. AI Sponsored Snaps drops advertisers' agents into chats.

WORKFLOW OF THE WEEK: Reference image → 15-second hero spot
01. Drop reference into Claude (Photoshop). Extract palette + silhouette.
02. Hand to Blender. "Procedural 3D, palette as material inputs, slow orbit, 3 sec loop, 1080p."
03. Pipe to Premiere. "15-sec hero spot, kinetic type bar 4, 110 BPM Splice track, 1.5 sec end card."

Four-tool half-day workflow → under 20 minutes if your prompt is specific.

FREE TIER SPOTLIGHT
Splice's free tier was always limited because browsing a million samples by hand is exhausting. The connector changes the ergonomics. Test before committing to Sounds Plus.

WHAT I'M BUILDING: chaosclub.co
React 19 + Vite, Firebase, Cloudflare R2, Lyria 3 Pro, Gemini Flash, Stripe ($4.99/mo). "Reading Room at Midnight" aesthetic. Lyrics belong in the same shelf as poetry, not in a TikTok caption. 100+ originals in. Beta soon.

Reading time: 5 min · ~720 words`;

const PERSONAL_FULL_TEXT = `Field Notes · No. 1
kylerosebrook.com · Week of April 27, 2026

THE WEEK THE APIS SAID NO.
An essay.

Three times this week, I tried to script something and the API said no.

FlashFusion has a Wix Velo provisioning step that returns a 500 every time. The shipping carrier update endpoint rejects the appId I'm legally allowed to send. Click tracking has no REST endpoint at all. So at some point Tuesday afternoon, I closed the script, opened the Wix dashboard, and clicked through three forms by hand. That's not a failure of the work. That's the shape of the work.

n8n was the same story in a different costume. The MCP integration I love can't pass full node parameters yet — so I'd build a workflow with a placeholder URL, drag it into the n8n UI, and finish the configuration manually. Five workflows half-shipped. Each one blocked not by my plan or my skill but by a seam between two APIs that haven't quite met each other yet.

I used to find this maddening. The intellectual side of me wants every system end-to-end composable. The actual work most weeks is 80% scripted, 20% finger-walked through a dashboard. I'd spent years trying to get that ratio to 100/0. This week I stopped trying.

Here's what shifted:

Manual steps aren't a bug in the system. They're the system telling you where the next layer of value is going to get built. Every place I'm clicking through a Wix form by hand is — three to nine months from now — a SaaS opportunity, an MCP server someone's about to ship, or an n8n node that doesn't exist yet. The dashboards I'm filling in are next year's APIs.

Two of the gaps from this week stayed with me. The Wix Velo provisioning hole — that's the kind of thing where if you asked me to predict who builds the wrapper that fixes it, I'd guess inside two quarters someone does and gets paid for it. And the Notion property creation flow, where you can build a database via API but still have to add four properties one at a time through the UI — that's exactly the kind of seam an MCP server could close in a weekend.

The other thing I noticed, which surprised me more: the manual steps are where I learned the most about what these platforms actually are. The Wix dashboard taught me something about Velo the docs never made clear. Adding Notion properties one at a time surfaced four schema decisions I'd been making wrong in my own task system for months. When I'm in the API, I'm composing. When I'm in the dashboard, I'm reading the platform. They're different skills, and I'd been treating one as superior to the other.

So this week I shipped less than I planned. FlashFusion still has those three pending manual steps. chaosclub.co is in build, not launch. n8n has five workflows half-finished. None of it is on the internet yet.

But I have a sharper map than I did Monday. And I have two specific gaps — Wix Velo provisioning, Notion property creation — that I now believe will be somebody's product within a year. That counts as progress, even when no commit lands.

If you're building something this week and you're stuck at an integration seam — write the seam down. The frustration is signal, not noise.

— Kyle

Reading time: 3 min · ~510 words`;
