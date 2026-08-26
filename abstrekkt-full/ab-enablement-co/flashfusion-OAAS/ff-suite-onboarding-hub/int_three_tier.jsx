import { useState, useEffect } from "react";
import { Terminal, Clock, Copy, Check, ChevronRight, Layers } from "lucide-react";

export default function IntTriptych() {
  const [activeTab, setActiveTab] = useState("t1");
  const [copied, setCopied] = useState(null);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  const tiers = [
    { id: "t1", label: "Tier 1", sub: "Non-Tech · ~410w · 3 min" },
    { id: "t2", label: "Tier 2", sub: "Tech Dept · ~810w · 5 min" },
    { id: "t3", label: "Tier 3", sub: "AI Team · ~1,180w · 7 min" },
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
              <div className="text-[10px] tracking-[0.3em] text-zinc-500 font-mono uppercase flex items-center gap-2">
                <Terminal size={11} /> The Prompt · Week of April 27, 2026
              </div>
              <div className="text-zinc-100 text-lg font-semibold mt-0.5">Three tiers, one research base</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-mono uppercase">Combined</div>
              <div className="text-zinc-300 text-sm font-mono">~2,400 words</div>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {tiers.map((t) => {
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
                  <Layers size={14} strokeWidth={1.5} />
                  <div className="text-left">
                    <div className="text-xs font-semibold tracking-wide">{t.label}</div>
                    <div className="text-[9px] tracking-widest uppercase opacity-60">{t.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {activeTab === "t1" && <Tier1 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "t2" && <Tier2 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "t3" && <Tier3 cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
      </div>

      <div className="border-t border-zinc-800 bg-black/40 mt-8">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <div className="text-[10px] tracking-[0.25em] text-zinc-500 font-mono uppercase mb-2">How the same research differs across tiers</div>
          <ul className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> <span><span className="text-zinc-300 font-semibold">Google–Anthropic $40B:</span> Tier 1 frames as "what does this mean for our clients" / Tier 2 skips it / Tier 3 treats it as a vendor strategy thesis with multi-cloud advisory implications.</span></li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> <span><span className="text-zinc-300 font-semibold">GPT-5.5 in Bedrock:</span> Tier 1 = procurement story to watch / Tier 2 = lead story with concrete tests / Tier 3 = parallel positioning move framed against the Google–Anthropic deal.</span></li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> <span><span className="text-zinc-300 font-semibold">DeepSeek V4:</span> Tier 1 skips entirely / Tier 2 = self-host evaluation candidate with concrete tests / Tier 3 = architecture pattern shift + service-line repositioning trigger.</span></li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> <span><span className="text-zinc-300 font-semibold">Meta/MS layoffs:</span> Tier 1 = client conversation handling only / Tier 2 + 3 skip — no operational or strategic action.</span></li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> <span><span className="text-zinc-300 font-semibold">Sources to verify before send:</span> $40B Google–Anthropic deal structure (loan vs equity vs cloud commit), $267B Q1 VC total (one source had unrelated fabrications — drop or hedge in Tier 3).</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Shared chrome
function TerminalChrome({ path, onCopy, copyId, copied }) {
  const LIGHTBLUE = "#5391AA";
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "#1f3a4d", background: "#000c14" }}>
      <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: LIGHTBLUE }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
        <span className="ml-3 tracking-widest">{path}</span>
      </div>
      <button
        onClick={onCopy}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono hover:bg-white/5 transition"
        style={{ color: LIGHTBLUE }}
      >
        {copied === copyId ? <Check size={12} /> : <Copy size={12} />}
        {copied === copyId ? "copied" : "copy"}
      </button>
    </div>
  );
}

function Masthead({ tier, cursorOn }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";
  return (
    <div className="mb-7">
      <div className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: ORANGE }}>
        &gt; THE PROMPT
        <span style={{ color: ORANGE, opacity: cursorOn ? 1 : 0 }}>█</span>
      </div>
      <div className="mt-1 text-xs tracking-[0.2em] uppercase" style={{ color: LIGHTBLUE }}>
        Your weekly AI intelligence brief
      </div>
      <div className="mt-1 text-xs" style={{ color: "#7a9aa8" }}>
        Week of April 27, 2026 · {tier}
      </div>
    </div>
  );
}

// ───────────────────────── Tier 1 (carried over from v2)
function Tier1({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#1f3a4d", background: "linear-gradient(180deg, #001a26 0%, #00263a 100%)" }}>
      <TerminalChrome path="~/the-prompt/2026-w17/tier-1-nontech.md" onCopy={() => onCopy("t1", T1_TEXT)} copyId="t1" copied={copied} />
      <div className="p-7 md:p-10 font-mono text-[14px] leading-[1.75]" style={{ color: "#d4e6ee" }}>
        <Masthead tier="Tier 1 · Non-Tech Edition" cursorOn={cursorOn} />

        <div className="space-y-5">
          <p><span style={{ color: ORANGE }}>$</span> The headline:</p>
          <p>Vendor lock-in is loosening at the model layer and tightening at the cloud layer. When clients ask which AI to bet on this quarter, the honest answer is: it depends on their cloud.</p>

          <p><span style={{ color: ORANGE }}>$</span> What changed this week:</p>

          <div className="pl-4 border-l space-y-4" style={{ borderColor: ORANGE }}>
            <div>
              <p className="font-semibold" style={{ color: "#f4ddc6" }}>Google committed up to $40B to Anthropic.</p>
              <p>Largest single AI investment on record. Claude gets stitched deeper into Google Cloud, and clients on GCP will see Anthropic models surfaced as the default in more places. Not a reason to switch clouds. Is a reason to expect the AI conversation to feel different inside GCP versus AWS over the next two quarters.</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "#f4ddc6" }}>OpenAI shipped GPT-5.5 natively inside AWS Bedrock.</p>
              <p>The procurement unlock to watch. Until this week, AWS clients in finance, healthcare, and legal had to route data outside their AWS environment to use OpenAI — a real compliance blocker that paused projects. That blocker is gone. Expect three or four "we're ready to revisit that AI initiative" calls in the next 60 days from clients who said no in 2025.</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "#f4ddc6" }}>Meta and Microsoft announced 20,000+ layoffs together.</p>
              <p>Public messaging blamed AI efficiency. The data underneath says only a small minority of companies report AI actually replacing roles. Most are using the AI narrative to explain decisions driven by macro cost pressure. When a client raises this, the steady framing is: AI is changing what work looks like, but this round of layoffs is mostly cost discipline wearing an AI mask.</p>
            </div>
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
            <p className="mt-1">First edition in this format. Future weeks will include "Last Week We Said" callbacks and running story threads. The Google–Anthropic deal and the GPT-5.5 / Bedrock story are both threads worth tracking — expect them in next week's brief.</p>
          </div>

          <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
            <Clock size={12} />
            <span>Reading time: 3 minutes</span>
            <span className="opacity-50">·</span>
            <span>~410 words</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Tier 2 — Tech Department
function Tier2({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#1f3a4d", background: "linear-gradient(180deg, #001a26 0%, #00263a 100%)" }}>
      <TerminalChrome path="~/the-prompt/2026-w17/tier-2-techdept.md" onCopy={() => onCopy("t2", T2_TEXT)} copyId="t2" copied={copied} />
      <div className="p-7 md:p-10 font-mono text-[14px] leading-[1.75]" style={{ color: "#d4e6ee" }}>
        <Masthead tier="Tier 2 · Tech Department Edition" cursorOn={cursorOn} />

        <div className="space-y-5">
          <p><span style={{ color: ORANGE }}>$</span> This week's takeaway:</p>
          <p>Two procurement paths opened up that change what we can recommend. GPT-5.5 is now native in AWS Bedrock, removing a real compliance friction. DeepSeek V4 is open-weight under MIT license, putting frontier-class coding capability within reach of self-hosted deployments. Plan accordingly.</p>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> GPT-5.5 in AWS Bedrock — what we should test</p>
            <p className="mt-2">Released April 23. Specs that matter:</p>
            <ul className="mt-2 space-y-0.5 pl-4">
              <li>· 12 million token context window (up from 1M on 5.4)</li>
              <li>· SWE-bench Verified: 88.7%</li>
              <li>· Terminal-Bench 2.0: 82.7%</li>
              <li>· Hallucination rate: 60% reduction vs 5.4</li>
              <li>· Codename "Spud"</li>
            </ul>
            <p className="mt-3">Available now in ChatGPT Plus/Pro/Business and through Bedrock. Bedrock Managed Agents in limited preview.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>What to test this week:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· Drop a current client repo (with NDA/permission) into the 12M context. We've been running hybrid retrieval workflows for clients hitting context ceilings; if 5.5 in Bedrock holds quality at 8M+ tokens, that whole pattern simplifies.</li>
              <li>· Run our standard prompt suite against the 5.4 baseline. Capture latency p50/p99 and token economics. We need a ground-truth comparison sheet before the next AI vendor review.</li>
              <li>· Evaluate Bedrock Managed Agents against the orchestration patterns we currently build manually. If their managed orchestration is solid, we may be able to deprecate some wrapper code.</li>
            </ul>

            <p className="mt-3" style={{ color: "#a8c5d2" }}>Migration note: If we have clients running on Bedrock Anthropic models who ask about switching to GPT-5.5, the cross-model evaluation needs to happen before any production change. The Sonnet 4.6 → GPT-5.5 swap is not 1:1 on tool-calling behavior.</p>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> DeepSeek V4 — open-weight you can actually evaluate</p>
            <p className="mt-2">Released April 24, MIT License.</p>
            <ul className="mt-2 space-y-0.5 pl-4">
              <li>· V4-Pro: 1.6T total params, 49B active</li>
              <li>· V4-Flash: 284B total, 13B active</li>
              <li>· Both: 1M context, dual thinking/non-thinking modes</li>
            </ul>
            <p className="mt-3">Architecture note: replaces standard full attention with hybrid Compressed Sparse Attention + Heavily Compressed Attention. 27% FLOP reduction and 90% KV cache reduction relative to V3.2. That last number matters — KV cache is the dominant memory cost at long context, and 90% off changes the deployment math.</p>
            <p className="mt-2">Reportedly matches GPT-5.4 on coding competitions. First DeepSeek model optimized for Huawei Ascend chips, which is a procurement signal worth flagging in any sovereignty-sensitive client conversation.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>What to test:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· Stand up V4-Flash on test infra. Pro is too large for most internal eval boxes; Flash at 13B active is workable.</li>
              <li>· Run our standard coding eval. We have baselines for GPT-5.4, Claude Sonnet 4.6, and Llama 4. Add V4-Flash and V4-Pro (via API initially) to the comparison sheet.</li>
              <li>· Document the deployment story for clients with data sovereignty requirements. This is the first time in 18 months we can credibly recommend a fully self-hosted frontier-class coding model.</li>
            </ul>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> Tool ecosystem update — Claude creative connectors</p>
            <p className="mt-2">Tuesday: eight creative software vendors shipped Claude connectors at once — Adobe (50 tools across Creative Cloud), Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp.</p>
            <p className="mt-2">Service desk implications: zero direct impact this week. But expect questions from clients in marketing/creative ops about "can our agents drive Photoshop?" The answer is yes; the procurement question is whether they need Claude Pro/Team, MCP infrastructure, or both. Loop AI Team in for those conversations.</p>
            <p className="mt-2" style={{ color: "#a8c5d2" }}>Security note: each connector is an OAuth/MCP integration. Standard MCP server review applies — auth scopes, data egress, audit logging.</p>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> ml-intern — agent that runs post-training autonomously</p>
            <p className="mt-2">Open-source release April 21. Runs the full post-training pipeline: arXiv paper traversal, Hugging Face dataset discovery, GRPO-based RLHF, eval. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100.</p>
            <p className="mt-2">Why we care: this is the category that eats the "fine-tune a small model for client X" service line. If a client asks for fine-tuning advice, the answer increasingly is "spin this up against your domain data" rather than "let us run a 6-week engagement." We need a position on this before next month's client review.</p>
          </div>

          <div className="mt-8 pt-5 border-t" style={{ borderColor: "#1f3a4d" }}>
            <p><span style={{ color: ORANGE }}>$</span> Action items for this week</p>
            <ol className="mt-2 space-y-1 pl-4">
              <li>1. Stand up GPT-5.5 / Bedrock test harness. Owner: TBD. By Friday.</li>
              <li>2. Add DeepSeek V4-Flash to the model comparison sheet. Owner: TBD. By Friday.</li>
              <li>3. Audit current MCP server inventory for any creative connector overlap. Owner: TBD. Before next sprint.</li>
              <li>4. Brief AI Team on ml-intern category before they take any new fine-tuning scoping calls.</li>
            </ol>
          </div>

          <div className="mt-6">
            <p><span style={{ color: ORANGE }}>$</span> Heads up</p>
            <p className="mt-1">Bedrock Managed Agents docs are in limited preview — request access via the AWS account team if you need to evaluate before the public docs land.</p>
          </div>

          <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
            <Clock size={12} />
            <span>Reading time: 5 minutes</span>
            <span className="opacity-50">·</span>
            <span>~810 words</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Tier 3 — AI Team
function Tier3({ cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#1f3a4d", background: "linear-gradient(180deg, #001a26 0%, #00263a 100%)" }}>
      <TerminalChrome path="~/the-prompt/2026-w17/tier-3-aiteam.md" onCopy={() => onCopy("t3", T3_TEXT)} copyId="t3" copied={copied} />
      <div className="p-7 md:p-10 font-mono text-[14px] leading-[1.75]" style={{ color: "#d4e6ee" }}>
        <Masthead tier="Tier 3 · AI Team Edition" cursorOn={cursorOn} />

        <div className="space-y-5">
          <p><span style={{ color: ORANGE }}>$</span> The thesis:</p>
          <p>This was a cloud-vendor coupling week. Two of the largest AI commercial moves in industry history landed in parallel — Google's $40B commitment to Anthropic and OpenAI's native deployment in AWS Bedrock — and they reshape how we should be advising clients on multi-cloud AI strategy. Underneath that: open-weight frontier capability is now real, and the agent-orchestrated tool layer is consolidating fast. Three threads we need positions on by next sprint.</p>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> Vendor strategy: lock-in is loosening at the model layer and tightening at the cloud layer</p>
            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>What happened:</p>
            <ul className="mt-1 space-y-1 pl-4">
              <li>· Google committed up to $40B to Anthropic — largest single AI investment recorded.</li>
              <li>· OpenAI shipped GPT-5.5 natively in AWS Bedrock, with Bedrock Managed Agents in limited preview.</li>
            </ul>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>What this changes:</p>
            <p className="mt-1">The model-layer choice (Claude vs GPT vs Gemini) is now substantially decoupled from raw capability — the top four sit within performance-evaluable distance of each other on most benchmarks our clients care about. The cloud-layer choice is increasingly the dominant variable. Where a client's primary cloud is, the AI capability surface is now optimized to that vendor's preferred frontier model.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>Implications for advisory work:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· For clients on GCP, Anthropic is the default forward-looking recommendation. The integration story will get progressively richer. This is a positioning shift — Claude is no longer "the good model you can also run on GCP," it's becoming "the model GCP is built around."</li>
              <li>· For clients on AWS, the GPT-5.5 / Bedrock release removes the compliance friction that paused several enterprise AI initiatives in 2025. Expect inbound from the regulated-industry book in the next 60 days. Pre-stage Bedrock-specific deployment patterns now.</li>
              <li>· For clients on Azure, the picture is most complicated. Microsoft's positioning relative to OpenAI continues to shift; the GPT-5.5 / Bedrock deal arguably weakens Azure's exclusive-OpenAI narrative.</li>
            </ul>

            <p className="mt-3" style={{ color: "#a8c5d2" }}>Architecture pattern shift: We've historically advocated for an abstraction layer that lets clients swap models without code changes. That recommendation still holds, but the new variable to factor in is cloud-locality of the model gateway. A multi-cloud abstraction layer that pretends the cloud doesn't matter is now leaving meaningful capability on the table.</p>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> Open-source disruption: DeepSeek V4 and the new self-host viability</p>
            <p className="mt-2">Released April 24 under MIT license. V4-Pro (1.6T total / 49B active) reportedly matches GPT-5.4 on coding competitions. V4-Flash (284B / 13B active) is the practical deployment target for most enterprise self-hosted scenarios.</p>
            <p className="mt-2">The architecture is the bigger story. The Compressed Sparse Attention + Heavily Compressed Attention hybrid delivers 27% FLOP reduction and 90% KV cache reduction at long context relative to V3.2. KV cache is the dominant memory bottleneck for production inference; that 90% number changes the economics of long-context deployments meaningfully.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>Strategic implications:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· For data-sovereignty-sensitive clients (regulated industries, certain government work, EU clients with strict residency requirements), a credible self-hosted frontier-class option now exists. Update the standard solution architecture decks to include this as a tier.</li>
              <li>· The Huawei Ascend optimization is a procurement signal. Clients with China exposure or those navigating semiconductor sanctions environments should be briefed.</li>
              <li>· The "fine-tune a small open model for our domain" service line is being reshaped from two directions simultaneously — DeepSeek V4 raises the open-source quality bar, and ml-intern automates the fine-tuning pipeline. We need a 90-day reposition on this offering.</li>
            </ul>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> The agent-orchestrated tool layer is consolidating</p>
            <p className="mt-2">Tuesday's eight-vendor Claude connector drop (Adobe with 50 CC tools, plus Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp) is the most consequential creative-tooling news in years. Anthropic also joined the Blender Development Fund as a patron — that's the strategic tell, not the connectors themselves.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>What this is actually about:</p>
            <p className="mt-1">The model labs are buying their way into the application layer. The connector ecosystem is OpenAI's GPT/Codex strategy in mirror image — where OpenAI is consolidating coding workflows, Anthropic is consolidating creative production workflows. The Blender patronage signals the play is durable, not opportunistic.</p>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>Architecture patterns to teach clients:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· The agent-orchestrated tool chain is now a primary architecture, not a research curiosity. A pipeline of "describe outcome → agent picks toolchain → asset returns finished" is shippable today for several creative workflows.</li>
              <li>· The bottleneck is no longer software capability. It is prompt quality and outcome specification. This shifts where we add value in implementations — less time on integration plumbing, more time on prompt architecture and evaluation harnesses.</li>
            </ul>

            <p className="mt-3 font-semibold" style={{ color: "#f4ddc6" }}>Competitive intelligence:</p>
            <ul className="mt-1 space-y-2 pl-4">
              <li>· Third quarter in a row where Anthropic's enterprise positioning has been tighter than OpenAI's. Pattern: OpenAI ships consumer-facing capability faster, Anthropic builds deeper integration with the tools enterprises actually use.</li>
              <li>· Expect a counter-move from OpenAI in the creative-tools space within the next two quarters. Plausible candidates: an Adobe deal that constrains exclusivity, an in-house creative agent platform, or a Microsoft-bundled creative agent suite.</li>
            </ul>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> ml-intern and the fine-tuning service-line problem</p>
            <p className="mt-2">Released April 21. Open-source agent that runs the complete post-training workflow autonomously — paper review, dataset discovery, RLHF implementation, evaluation. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100.</p>
            <p className="mt-2">This is a category, not a tool. The category is "agent that automates a previously consultative workflow." Expect equivalents for retrieval architecture, eval design, and agent topology design within 12 months.</p>
            <p className="mt-2">The service-line implication: any offering whose value proposition is "we run the technical loop for you" is in slow-motion disruption. The defensible offerings are domain expertise, evaluation rigor, and integration into the client's broader operating environment. The technical loop itself is becoming a commodity we orchestrate, not a service we sell.</p>
          </div>

          <div className="mt-8 pt-5 border-t" style={{ borderColor: "#1f3a4d" }}>
            <p><span style={{ color: ORANGE }}>$</span> What to brief clients on this week</p>

            <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>For clients on GCP considering AI consolidation:</p>
            <p className="mt-1">"Google's commitment to Anthropic locks in Claude as the default forward-looking model on your cloud. For new initiatives, this simplifies vendor strategy. For existing OpenAI workloads, the question is whether the cross-cloud overhead is still worth carrying."</p>

            <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>For clients on AWS who paused AI initiatives in 2025 over compliance:</p>
            <p className="mt-1">"GPT-5.5 is now natively available inside Bedrock with the same compliance posture as your other AWS workloads. The friction that paused your previous initiative may no longer exist. Worth a 60-minute scoping call."</p>

            <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>For clients in regulated industries asking about self-hosted frontier capability:</p>
            <p className="mt-1">"DeepSeek V4 under MIT license is the first credible self-hosted option that matches proprietary frontier models on coding tasks. Architecture and deployment story is materially different from anything we could recommend last quarter."</p>
          </div>

          <div className="mt-8">
            <p><span style={{ color: ORANGE }}>$</span> Tracking forward</p>
            <p className="mt-2">Threads to monitor over the next two weeks:</p>
            <ul className="mt-1 space-y-1 pl-4">
              <li>· OpenAI counter-move in creative tools.</li>
              <li>· DeepSeek V4 production deployment patterns from early adopters.</li>
              <li>· Bedrock Managed Agents general availability timeline.</li>
              <li>· The next ml-intern-pattern release (likely retrieval or eval automation).</li>
            </ul>
          </div>

          <div className="mt-10 pt-5 border-t text-[11px]" style={{ borderColor: "#1f3a4d", color: "#7a9aa8" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CLAIMS</div>
                <p>Cloud-vendor coupling is now the dominant variable in client AI advisory work, displacing model-capability selection as the primary decision input.</p>
              </div>
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>COUNTEREXAMPLE</div>
                <p>For clients with hybrid or multi-cloud strategies in place, the "pick the model that fits your cloud" framing oversimplifies; cross-cloud AI orchestration via API gateway has been viable for 18+ months and remains the right pattern for some.</p>
              </div>
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CONTRADICTIONS</div>
                <p>Recommending cloud-locked AI for new initiatives while continuing to advocate model-abstraction layers for existing workloads creates a layered guidance posture that will need to be defended in client conversations.</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
            <Clock size={12} />
            <span>Reading time: 7 minutes</span>
            <span className="opacity-50">·</span>
            <span>~1,180 words</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Plain text exports

const T1_TEXT = `> THE PROMPT — Tier 1 · Non-Tech Edition
Week of April 27, 2026

THE HEADLINE
Vendor lock-in is loosening at the model layer and tightening at the cloud layer. When clients ask which AI to bet on this quarter, the honest answer is: it depends on their cloud.

WHAT CHANGED THIS WEEK

Google committed up to $40B to Anthropic. Largest single AI investment on record. Claude gets stitched deeper into Google Cloud, and clients on GCP will see Anthropic models surfaced as the default in more places. Not a reason to switch clouds. Is a reason to expect the AI conversation to feel different inside GCP versus AWS over the next two quarters.

OpenAI shipped GPT-5.5 natively inside AWS Bedrock. The procurement unlock to watch. Until this week, AWS clients in finance, healthcare, and legal had to route data outside their AWS environment to use OpenAI — a real compliance blocker that paused projects. That blocker is gone. Expect three or four "we're ready to revisit that AI initiative" calls in the next 60 days from clients who said no in 2025.

Meta and Microsoft announced 20,000+ layoffs together. Public messaging blamed AI efficiency. The data underneath says only a small minority of companies report AI actually replacing roles. Most are using the AI narrative to explain decisions driven by macro cost pressure. When a client raises this, the steady framing is: AI is changing what work looks like, but this round of layoffs is mostly cost discipline wearing an AI mask.

WHAT TO SAY WHEN CLIENTS ASK

"Should we worry we standardized on the wrong AI vendor?"
→ Probably not. The performance gap between the top four models is now small enough that over-engineering vendor strategy costs more than it saves. Pick the one that fits your cloud and your compliance posture. Make the integration boring. Revisit in twelve months.

"Should we be cutting headcount because of AI?"
→ Cut for the right reason or don't cut. AI is real, but this week's headlines are mostly cost cuts dressed up as transformation. If your AI investments aren't yet producing measurable productivity lift, layoffs framed as AI-driven won't make them produce it.

NOTE FROM THE EDITOR
First edition in this format. Future weeks will include "Last Week We Said" callbacks and running story threads. The Google–Anthropic deal and the GPT-5.5 / Bedrock story are both threads worth tracking — expect them in next week's brief.

Reading time: 3 minutes · ~410 words`;

const T2_TEXT = `> THE PROMPT — Tier 2 · Tech Department Edition
Week of April 27, 2026

THIS WEEK'S TAKEAWAY
Two procurement paths opened up that change what we can recommend. GPT-5.5 is now native in AWS Bedrock, removing a real compliance friction. DeepSeek V4 is open-weight under MIT license, putting frontier-class coding capability within reach of self-hosted deployments. Plan accordingly.

GPT-5.5 IN AWS BEDROCK — WHAT WE SHOULD TEST
Released April 23. Specs that matter:
- 12 million token context window (up from 1M on 5.4)
- SWE-bench Verified: 88.7%
- Terminal-Bench 2.0: 82.7%
- Hallucination rate: 60% reduction vs 5.4
- Codename "Spud"

Available now in ChatGPT Plus/Pro/Business and through Bedrock. Bedrock Managed Agents in limited preview.

What to test this week:
- Drop a current client repo (with NDA/permission) into the 12M context. We've been running hybrid retrieval workflows for clients hitting context ceilings; if 5.5 in Bedrock holds quality at 8M+ tokens, that whole pattern simplifies.
- Run our standard prompt suite against the 5.4 baseline. Capture latency p50/p99 and token economics. We need a ground-truth comparison sheet before the next AI vendor review.
- Evaluate Bedrock Managed Agents against the orchestration patterns we currently build manually. If their managed orchestration is solid, we may be able to deprecate some wrapper code.

Migration note: If we have clients running on Bedrock Anthropic models who ask about switching to GPT-5.5, the cross-model evaluation needs to happen before any production change. The Sonnet 4.6 → GPT-5.5 swap is not 1:1 on tool-calling behavior.

DEEPSEEK V4 — OPEN-WEIGHT YOU CAN ACTUALLY EVALUATE
Released April 24, MIT License.
- V4-Pro: 1.6T total params, 49B active
- V4-Flash: 284B total, 13B active
- Both: 1M context, dual thinking/non-thinking modes

Architecture note: replaces standard full attention with hybrid Compressed Sparse Attention + Heavily Compressed Attention. 27% FLOP reduction and 90% KV cache reduction relative to V3.2. KV cache is the dominant memory cost at long context, and 90% off changes the deployment math.

Reportedly matches GPT-5.4 on coding competitions. First DeepSeek model optimized for Huawei Ascend chips, which is a procurement signal worth flagging in any sovereignty-sensitive client conversation.

What to test:
- Stand up V4-Flash on test infra. Pro is too large for most internal eval boxes; Flash at 13B active is workable.
- Run our standard coding eval. We have baselines for GPT-5.4, Claude Sonnet 4.6, and Llama 4. Add V4-Flash and V4-Pro (via API initially) to the comparison sheet.
- Document the deployment story for clients with data sovereignty requirements. This is the first time in 18 months we can credibly recommend a fully self-hosted frontier-class coding model.

TOOL ECOSYSTEM UPDATE — CLAUDE CREATIVE CONNECTORS
Tuesday: eight creative software vendors shipped Claude connectors at once — Adobe (50 tools across Creative Cloud), Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp.

Service desk implications: zero direct impact this week. But expect questions from clients in marketing/creative ops about "can our agents drive Photoshop?" The answer is yes; the procurement question is whether they need Claude Pro/Team, MCP infrastructure, or both. Loop AI Team in for those conversations.

Security note: each connector is an OAuth/MCP integration. Standard MCP server review applies — auth scopes, data egress, audit logging.

ML-INTERN — AGENT THAT RUNS POST-TRAINING AUTONOMOUSLY
Open-source release April 21. Runs the full post-training pipeline: arXiv paper traversal, Hugging Face dataset discovery, GRPO-based RLHF, eval. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100.

Why we care: this is the category that eats the "fine-tune a small model for client X" service line. If a client asks for fine-tuning advice, the answer increasingly is "spin this up against your domain data" rather than "let us run a 6-week engagement." We need a position on this before next month's client review.

ACTION ITEMS FOR THIS WEEK
1. Stand up GPT-5.5 / Bedrock test harness. Owner: TBD. By Friday.
2. Add DeepSeek V4-Flash to the model comparison sheet. Owner: TBD. By Friday.
3. Audit current MCP server inventory for any creative connector overlap. Owner: TBD. Before next sprint.
4. Brief AI Team on ml-intern category before they take any new fine-tuning scoping calls.

HEADS UP
Bedrock Managed Agents docs are in limited preview — request access via the AWS account team if you need to evaluate before the public docs land.

Reading time: 5 minutes · ~810 words`;

const T3_TEXT = `> THE PROMPT — Tier 3 · AI Team Edition
Week of April 27, 2026

THE THESIS
This was a cloud-vendor coupling week. Two of the largest AI commercial moves in industry history landed in parallel — Google's $40B commitment to Anthropic and OpenAI's native deployment in AWS Bedrock — and they reshape how we should be advising clients on multi-cloud AI strategy. Underneath that: open-weight frontier capability is now real, and the agent-orchestrated tool layer is consolidating fast. Three threads we need positions on by next sprint.

VENDOR STRATEGY: LOCK-IN IS LOOSENING AT THE MODEL LAYER AND TIGHTENING AT THE CLOUD LAYER

What happened:
- Google committed up to $40B to Anthropic — largest single AI investment recorded.
- OpenAI shipped GPT-5.5 natively in AWS Bedrock, with Bedrock Managed Agents in limited preview.

What this changes:
The model-layer choice (Claude vs GPT vs Gemini) is now substantially decoupled from raw capability — the top four sit within performance-evaluable distance of each other on most benchmarks our clients care about. The cloud-layer choice is increasingly the dominant variable. Where a client's primary cloud is, the AI capability surface is now optimized to that vendor's preferred frontier model.

Implications for advisory work:
- For clients on GCP, Anthropic is the default forward-looking recommendation. The integration story will get progressively richer. This is a positioning shift — Claude is no longer "the good model you can also run on GCP," it's becoming "the model GCP is built around."
- For clients on AWS, the GPT-5.5 / Bedrock release removes the compliance friction that paused several enterprise AI initiatives in 2025. Expect inbound from the regulated-industry book in the next 60 days. Pre-stage Bedrock-specific deployment patterns now.
- For clients on Azure, the picture is most complicated. Microsoft's positioning relative to OpenAI continues to shift; the GPT-5.5 / Bedrock deal arguably weakens Azure's exclusive-OpenAI narrative.

Architecture pattern shift: We've historically advocated for an abstraction layer that lets clients swap models without code changes. That recommendation still holds, but the new variable to factor in is cloud-locality of the model gateway. A multi-cloud abstraction layer that pretends the cloud doesn't matter is now leaving meaningful capability on the table.

OPEN-SOURCE DISRUPTION: DEEPSEEK V4 AND THE NEW SELF-HOST VIABILITY

Released April 24 under MIT license. V4-Pro (1.6T total / 49B active) reportedly matches GPT-5.4 on coding competitions. V4-Flash (284B / 13B active) is the practical deployment target for most enterprise self-hosted scenarios.

The architecture is the bigger story. The Compressed Sparse Attention + Heavily Compressed Attention hybrid delivers 27% FLOP reduction and 90% KV cache reduction at long context relative to V3.2. KV cache is the dominant memory bottleneck for production inference; that 90% number changes the economics of long-context deployments meaningfully.

Strategic implications:
- For data-sovereignty-sensitive clients (regulated industries, certain government work, EU clients with strict residency requirements), a credible self-hosted frontier-class option now exists. Update the standard solution architecture decks to include this as a tier.
- The Huawei Ascend optimization is a procurement signal. Clients with China exposure or those navigating semiconductor sanctions environments should be briefed.
- The "fine-tune a small open model for our domain" service line is being reshaped from two directions simultaneously — DeepSeek V4 raises the open-source quality bar, and ml-intern automates the fine-tuning pipeline. We need a 90-day reposition on this offering.

THE AGENT-ORCHESTRATED TOOL LAYER IS CONSOLIDATING

Tuesday's eight-vendor Claude connector drop (Adobe with 50 CC tools, plus Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp) is the most consequential creative-tooling news in years. Anthropic also joined the Blender Development Fund as a patron — that's the strategic tell, not the connectors themselves.

What this is actually about:
The model labs are buying their way into the application layer. The connector ecosystem is OpenAI's GPT/Codex strategy in mirror image — where OpenAI is consolidating coding workflows, Anthropic is consolidating creative production workflows. The Blender patronage signals the play is durable, not opportunistic.

Architecture patterns to teach clients:
- The agent-orchestrated tool chain is now a primary architecture, not a research curiosity. A pipeline of "describe outcome → agent picks toolchain → asset returns finished" is shippable today for several creative workflows.
- The bottleneck is no longer software capability. It is prompt quality and outcome specification. This shifts where we add value in implementations — less time on integration plumbing, more time on prompt architecture and evaluation harnesses.

Competitive intelligence:
- Third quarter in a row where Anthropic's enterprise positioning has been tighter than OpenAI's. Pattern: OpenAI ships consumer-facing capability faster, Anthropic builds deeper integration with the tools enterprises actually use.
- Expect a counter-move from OpenAI in the creative-tools space within the next two quarters. Plausible candidates: an Adobe deal that constrains exclusivity, an in-house creative agent platform, or a Microsoft-bundled creative agent suite.

ML-INTERN AND THE FINE-TUNING SERVICE-LINE PROBLEM

Released April 21. Open-source agent that runs the complete post-training workflow autonomously — paper review, dataset discovery, RLHF implementation, evaluation. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100.

This is a category, not a tool. The category is "agent that automates a previously consultative workflow." Expect equivalents for retrieval architecture, eval design, and agent topology design within 12 months.

The service-line implication: any offering whose value proposition is "we run the technical loop for you" is in slow-motion disruption. The defensible offerings are domain expertise, evaluation rigor, and integration into the client's broader operating environment. The technical loop itself is becoming a commodity we orchestrate, not a service we sell.

WHAT TO BRIEF CLIENTS ON THIS WEEK

For clients on GCP considering AI consolidation:
"Google's commitment to Anthropic locks in Claude as the default forward-looking model on your cloud. For new initiatives, this simplifies vendor strategy. For existing OpenAI workloads, the question is whether the cross-cloud overhead is still worth carrying."

For clients on AWS who paused AI initiatives in 2025 over compliance:
"GPT-5.5 is now natively available inside Bedrock with the same compliance posture as your other AWS workloads. The friction that paused your previous initiative may no longer exist. Worth a 60-minute scoping call."

For clients in regulated industries asking about self-hosted frontier capability:
"DeepSeek V4 under MIT license is the first credible self-hosted option that matches proprietary frontier models on coding tasks. Architecture and deployment story is materially different from anything we could recommend last quarter."

TRACKING FORWARD

Threads to monitor over the next two weeks:
- OpenAI counter-move in creative tools.
- DeepSeek V4 production deployment patterns from early adopters.
- Bedrock Managed Agents general availability timeline.
- The next ml-intern-pattern release (likely retrieval or eval automation).

CLAIMS: Cloud-vendor coupling is now the dominant variable in client AI advisory work, displacing model-capability selection as the primary decision input.
COUNTEREXAMPLE: For clients with hybrid or multi-cloud strategies in place, the "pick the model that fits your cloud" framing oversimplifies; cross-cloud AI orchestration via API gateway has been viable for 18+ months and remains the right pattern for some.
CONTRADICTIONS: Recommending cloud-locked AI for new initiatives while continuing to advocate model-abstraction layers for existing workloads creates a layered guidance posture that will need to be defended in client conversations.

Reading time: 7 minutes · ~1,180 words`;
