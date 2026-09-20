import { useState, useEffect } from "react";
import { Terminal, Zap, BookOpen, Clock, Copy, Check, ChevronRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// WEEK CONTENT
// ═══════════════════════════════════════════════════════════════════════════
// To produce next week's editions: replace this entire constant with new
// content matching the same shape. The renderer below does not need to change.
// Schema documented in newsletter-system-manual.md section 5.
// ═══════════════════════════════════════════════════════════════════════════

const WEEK_CONTENT = {
  meta: {
    week: "2026-w17",
    dateLabel: "Week of April 27, 2026",
  },

  intT1: {
    headline: "Vendor lock-in is loosening at the model layer and tightening at the cloud layer. When clients ask which AI to bet on this quarter, the honest answer is: it depends on their cloud.",
    stories: [
      {
        title: "Google committed up to $40B to Anthropic.",
        body: "Largest single AI investment on record. The practical effect: Claude gets stitched deeper into Google Cloud, and clients on GCP will see Anthropic models surfaced as the default in more places. Not a reason to switch clouds. Is a reason to expect the AI conversation to feel different inside GCP versus AWS over the next two quarters.",
      },
      {
        title: "OpenAI shipped GPT-5.5 natively inside AWS Bedrock.",
        body: "This is the procurement unlock to watch. Until this week, AWS clients in finance, healthcare, and legal had to route data outside their AWS environment to use OpenAI — a real compliance blocker that paused projects. That blocker is gone. Expect three or four \"we're ready to revisit that AI initiative\" calls in the next 60 days from clients who said no in 2025.",
      },
      {
        title: "Meta and Microsoft announced 20,000+ layoffs together.",
        body: "Public messaging blamed AI efficiency. The data underneath says only a small minority of companies report AI actually replacing roles. Most are using the AI narrative to explain decisions driven by macro cost pressure. When a client raises this, the steady framing is: AI is changing what work looks like, but this round of layoffs is mostly cost discipline wearing an AI mask.",
      },
    ],
    numberToKnow: {
      value: "$267.2B",
      context: "total AI venture funding for Q1 2026. Useful in any \"is this still worth investing in\" client conversation.",
    },
    clientQAs: [
      {
        question: "Should we worry we standardized on the wrong AI vendor?",
        answer: "Probably not. The performance gap between the top four models is now small enough that over-engineering vendor strategy costs more than it saves. Pick the one that fits your cloud and your compliance posture. Make the integration boring. Revisit in twelve months.",
      },
      {
        question: "Should we be cutting headcount because of AI?",
        answer: "Cut for the right reason or don't cut. AI is real, but this week's headlines are mostly cost cuts dressed up as transformation. If your AI investments aren't yet producing measurable productivity lift, layoffs framed as AI-driven won't make them produce it.",
      },
    ],
    editorNote: "This is the first edition in this format. Future weeks will include \"Last Week We Said\" callbacks and running story threads. The Google-Anthropic deal and the GPT-5.5 / Bedrock story are both threads worth tracking — expect them in next week's brief.",
    ccc: {
      claims: "Cloud-vendor coupling is now the dominant variable in client AI vendor decisions.",
      counter: "Cross-cloud AI via API gateway has been viable for 18+ months — for many shops, the \"AWS compliance unlock\" is real but not the whole story.",
      contradictions: "\"Lock-in is loosening\" lives next to \"pick one and don't switch\" in the same edition. Both true at different time horizons.",
    },
  },

  intT2: {
    intro: "API changes, benchmark deltas, integration paths, what to test before next Friday. Nothing critical for emergency action. Two items worth scheduling time for.",
    updates: [
      {
        title: "GPT-5.5 — released April 23",
        headlineNumbers: "12M token context window, 88.7% on SWE-bench Verified, 92.4% on MMLU, 82.7% on Terminal-Bench 2.0, 60% reduction in hallucinations vs the prior generation. Codename \"Spud.\"",
        access: "ChatGPT Plus / Pro / Business / Enterprise on web, plus first-time native availability inside AWS Bedrock. OpenAI also brought Codex to AWS the same day.",
        whatToTest: [
          "If you have integrations on GPT-4o or 5.4, run your existing eval set against 5.5 before changing the model parameter in production. The hallucination claim is worth your own verification on customer-facing flows.",
          "The 12M context window changes what's possible for full-codebase refactor and long-document analysis. Worth a focused test if you've been chunking around the prior limit.",
          "Bedrock integration path for any AWS client who paused OpenAI work due to data-residency or compliance scoping. That blocker is gone.",
        ],
      },
      {
        title: "Eight Claude connectors landed on the same day",
        headlineNumbers: "Adobe (50 tools across Photoshop, Illustrator, Firefly, Premiere, Lightroom), Blender, Autodesk, Ableton, Splice, Affinity, Resolume, SketchUp. Anthropic also joined the Blender Development Fund as a patron.",
        access: "Available now via the Anthropic connector marketplace and through each vendor's own integration channel.",
        whatToTest: [
          "For workflows currently using Zapier-style automation between creative tools, evaluate whether MCP-based orchestration replaces the gateway layer. Latency and audit-trail are the variables to watch.",
          "Each connector ships its own auth scope. Audit which connectors have file system or cloud access vs read-only API calls. The Adobe connector specifically has wide local access by default.",
          "Highest-value automation candidate: batch operations on creative assets (\"rename + resize + export 200 files\"). That's where the time savings show up immediately.",
        ],
      },
      {
        title: "DeepSeek V4 went open-weight on April 24",
        headlineNumbers: "MIT license. V4-Pro is 1.6T total params with 49B active. V4-Flash is 284B / 13B active. Both support 1M token context with dual thinking/non-thinking modes. Architecture: Compressed Sparse Attention + Heavily Compressed Attention hybrid — 27% FLOP reduction and 90% KV cache reduction vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding competitions.",
        access: "Open-weights on Hugging Face. API access via DeepSeek's hosted endpoint.",
        whatToTest: [
          "For cost-sensitive batch workloads currently on GPT-5.4 or Claude Sonnet 4.6, run a head-to-head on V4-Flash. The economics may have moved.",
          "The 90% KV cache reduction is real and material for self-hosted deployments. If you've held off on self-hosting due to memory cost, this is a re-evaluation moment.",
          "Note: this is the first DeepSeek model optimized for Huawei Ascend chips. For deployments outside China that's mostly informational; for clients with regulatory exposure to Chinese-origin software, raise the question early.",
        ],
      },
      {
        title: "ml-intern — open-source autonomous post-training",
        headlineNumbers: "Released April 21. Runs the full post-training workflow autonomously: literature review, dataset discovery, GRPO-based RLHF, eval. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on a single H100.",
        access: "GitHub, MIT license.",
        whatToTest: [
          "If your team does in-house fine-tuning at any scale, this is a force multiplier worth piloting on a non-critical model first.",
        ],
      },
    ],
    migrationWatch: "Nothing emergency-critical this week. Heads-up: at Cloud Next, Google rebranded Vertex AI to Gemini Enterprise Agent Platform. The rebrand is mostly cosmetic, but verify Vertex AI documentation links in your runbooks still resolve. Update internal naming as you encounter it; no need for a sprint.",
    security: "No active vendor advisories. Standing reminder: when wiring up the new Claude connectors, default to least-privilege. Several connectors ship with broad scopes by default — scope down to what you actually need before deploying anywhere production-adjacent.",
  },

  intT3: {
    strategicFrame: "Three structural shifts this week, each affecting how we should advise clients on AI vendor strategy through Q3. Below: what changed, what to do about it, updated vendor matrix, and an internal action list.",
    shifts: [
      {
        title: "1. The Google–Anthropic deal is a cloud-coupling event, not an investment story",
        whatChanged: "$40B from Google to Anthropic — the largest single AI investment recorded. The press framing is \"bet on Anthropic.\" The framing for our work is different: this binds Claude tighter to Google Cloud at the same moment OpenAI is binding tighter to AWS. Cloud-vendor coupling is now the dominant variable in AI architecture decisions for the next 2–3 quarters.",
        meaning: "GCP clients can expect Anthropic surfaced as default in more places. Multi-cloud AI strategies that worked in 2025 face more friction in 2026 because cloud-native integrations are deepening on both sides. \"Swap models cleanly via API gateway\" is still viable but now needs explicit defense.",
        whatToDo: [
          "Re-validate active vendor recommendations against the cloud-native option for each client's primary cloud.",
          "For clients on multi-cloud architectures, document the use-case justification in case they ask why we're not consolidating.",
        ],
        clientAdvisoryDraft: "The Google-Anthropic deal does not change which model is best for your use case. It does change which model will be easiest to deploy inside your existing cloud. We recommend re-validating your AI architecture against the cloud-native option before defaulting to a cross-cloud setup — and defending the cross-cloud architecture deliberately if that's where the use case lands.",
      },
      {
        title: "2. OpenAI inside AWS Bedrock unlocks the regulated-industry pause",
        whatChanged: "Until April 28, AWS clients in finance, healthcare, and legal could not use OpenAI without piping data outside their AWS environment. That broke compliance posture for many of them. We have a meaningful number of paused 2025 initiatives sitting on this exact blocker.",
        meaning: "The unlock package: GPT-5.5 and earlier OpenAI models native in Bedrock; Codex available in AWS; Bedrock Managed Agents for orchestration with AWS-native security, governance, and IAM.",
        whatToDo: [
          "Audit our paused 2025 client AI initiatives. Identify the ones blocked specifically by the AWS-OpenAI data-residency issue.",
          "Draft a 30-day outreach sequence to those accounts: \"this changed, want to revisit?\"",
          "For active vendor evaluations, this materially shifts the OpenAI vs Anthropic vs native-Bedrock-Claude calculus. Re-score recommendations in flight.",
        ],
      },
      {
        title: "3. DeepSeek V4 + Huawei Ascend = open-weight pricing pressure with a geopolitical wrinkle",
        whatChanged: "V4-Pro at 1.6T params (49B active), V4-Flash at 284B (13B active), MIT license, 1M context, 27% FLOP reduction and 90% KV cache reduction vs V3.2. V4-Pro reportedly matches GPT-5.4 on coding. The technical efficiency gains are material for self-hosted deployments.",
        meaning: "The geopolitical layer not in the headlines: this is the first DeepSeek model optimized for Huawei Ascend chips — a coordinated push toward Chinese semiconductor independence.",
        whatToDo: [
          "Cost-conscious clients will increasingly ask about open-weight alternatives. We need a default position by next week — one-pager.",
          "Clients in regulated, government-adjacent, or critical-infrastructure verticals will have new compliance questions about open-weight models from Chinese labs. Don't dismiss the question — answer it with a documented risk framework.",
        ],
      },
    ],
    vendorMatrix: [
      { scenario: "Greenfield, GCP-native", recommendation: "Anthropic Claude via Gemini Enterprise Agent Platform" },
      { scenario: "Greenfield, AWS-native", recommendation: "OpenAI via Bedrock or Anthropic via Bedrock — model choice now turns on use case, not compliance" },
      { scenario: "Cost-sensitive batch workloads", recommendation: "DeepSeek V4-Flash self-hosted, or Claude Haiku via API" },
      { scenario: "Highest-stakes reasoning", recommendation: "GPT-5.5 Thinking or Claude Opus 4.7 — head-to-head on the client's actual eval set" },
      { scenario: "Multi-cloud requirement", recommendation: "Defend the API gateway architecture deliberately. Don't let cloud-native temptations erode it without a use-case justification." },
    ],
    platformObservation: "Eight creative software companies shipped Claude connectors on the same day. Adobe alone exposed 50 pro-grade tools. Anthropic also became a patron of the Blender Development Fund. The pattern: AI labs are buying their way into the open creative stack the same way OS vendors competed for desktop developer mindshare in the 90s. The unit of integration has moved from \"can your AI access this tool's API\" to \"is your AI a first-class citizen inside the customer's existing software.\" Worth raising proactively in any current engagement that's mid-deployment on a chat-centric AI strategy.",
    narrativeOfWeek: "Meta + Microsoft announced 20,000+ layoffs jointly. Public framing: AI efficiency. The data underneath: only ~9% of companies report AI has actually replaced specific roles. Dominant cause is macro cost discipline using AI as a public-facing rationale. Number to keep in your pocket: ~92,000 tech jobs eliminated in 2026 so far, with nearly half of companies citing AI in their layoff rationale despite the much smaller number actually attributing displacement to it. When clients raise it: AI is changing the shape of work meaningfully, but it is not yet replacing the bulk of knowledge worker headcount in any sector we cover.",
    actionList: [
      "Run paused-account audit for AWS-OpenAI compliance unlock candidates.",
      "Update default vendor-recommendation matrix in the engagement playbook.",
      "Draft one-page client advisory on the open-weight question (DeepSeek V4 specifically).",
      "Update connector evaluation framework to cover the new Adobe / Blender / Autodesk / Ableton / Splice / Affinity / Resolume / SketchUp surface.",
      "Consider proactive outreach to clients mid-deployment on chat-centric AI strategies — the platform play above changes their roadmap.",
    ],
    ccc: {
      claims: "Cloud-vendor coupling is now the dominant variable in AI vendor strategy for 2–3 quarters. Open-weight models from Chinese labs entering serious enterprise consideration for the first time.",
      counter: "Mature enterprise AI deployments using API gateway patterns can absorb cloud-coupling pressure without re-architecting. Several gateway products have actually improved during the same window.",
      contradictions: "We are simultaneously advising clients to \"make integration boring\" (pick one cloud-native option) and to \"defend multi-cloud architecture deliberately.\" Both stances are correct for different client profiles — own the tension.",
    },
  },

  flashFusion: {
    issueNumber: 17,
    leadHeadline: ["Eight creative tools", "just grew Claude hands."],
    leadBody: [
      "On Tuesday, eight creative software companies shipped Claude connectors at the same time — Adobe, Blender, Autodesk, Ableton, Splice, Affinity, Resolume, and SketchUp. Adobe's package alone exposes 50 pro-grade tools across Photoshop, Illustrator, Firefly, Premiere, and Lightroom.",
      "The change isn't that AI can use creative tools. It's that the tools dropped the seam. You describe the outcome, Claude picks the toolchain, the file comes back finished. The part of creative work that was \"remembering which menu the action lives under\" — gone for the week, probably for good.",
      "Anthropic also joined the Blender Development Fund as a patron, which is the tell. This isn't a one-off integration play. The AI labs are buying their way into the open creative stack.",
    ],
    threeThingsTitle: "Three things to test before Friday",
    threeThings: [
      { name: "Logo iteration speed.", body: "Hand Claude a brand brief through the Photoshop + Illustrator connectors and ask for ten lockup variations. The unlock is iteration count per hour, not raw quality." },
      { name: "Procedural Blender from text.", body: "Describe the motion. The connector hands back documented Python you can re-run, modify, or ship to a 3D artist. The artist's job got better, not gone." },
      { name: "Sample-to-arrangement in one prompt.", body: "Splice + Ableton: \"Pull five lo-fi drum loops at 85 BPM, layer the cleanest two, drop a Rhodes pad on bar 9.\" First prompt is rough. Third one is usable." },
    ],
    leadCloser: "Pattern across all eight: taste stays human, everything else gets faster.",
    quickHits: [
      { title: "GPT-5.5 shipped Wednesday", body: "12M token context, 88.7% on SWE-bench Verified, 60% fewer hallucinations than 5.4. Codename 'Spud.' My read: this is the first model where dropping a whole repo into context and asking for a refactor isn't theater — it actually works. Worth a Plus subscription if you've been holding off." },
      { title: "DeepSeek V4 went open-weight", body: "MIT license, 1.6T params, 49B active. Matches GPT-5.4 on coding. Buried in the technical news: it's the first DeepSeek tuned for Huawei chips. The geopolitical story (Chinese semiconductor independence) is bigger than the model itself." },
      { title: "gpt-image-2 thinks before it draws", body: "First image model with reasoning baked in. Plans the layout, batches variants, verifies output before finalizing. The honest comparison isn't 'better than Midjourney' — it's 'closer to art directing than prompting.' Different muscle." },
      { title: "ml-intern is the workflow eater of the week", body: "Open-source agent (April 21) that runs the whole post-training loop — paper review, dataset selection, RLHF, eval. Took Qwen3-1.7B from ~10% to 32% on GPQA in under 10 hours on one H100. If you fine-tune for a living, the ground just moved." },
      { title: "Snapchat is renting your DMs to brand agents", body: "AI Sponsored Snaps drops advertisers' agents directly into chats. The ad-as-agent merge has been sitting on the runway for two years. It's airborne now. Browse your DMs accordingly." },
    ],
    workflow: {
      title: "Reference image → 15-second hero spot",
      intro: "Multi-MCP creative pipeline. Paste-ready. Tested this week.",
      steps: [
        { description: "Drop a reference image into Claude (Photoshop connector active).", prompt: "\"Extract the dominant 5-color palette as hex. Identify the primary subject silhouette.\"" },
        { description: "Hand the palette + silhouette to Blender.", prompt: "\"Build a procedural 3D version of this subject. Use the palette as material inputs. Camera: slow orbit, 3 second loop. Render at 1080p.\"" },
        { description: "Pipe the render to Premiere.", prompt: "\"Cut a 15-second hero spot. Kinetic type for the brand name on bar 4. Sync to a 110 BPM track from Splice. End on the brand mark for 1.5 seconds.\"" },
      ],
      closer: "What used to be a four-tool, half-day workflow runs in under twenty minutes if your prompt is specific. The bottleneck moved from software to language.",
    },
    freeTier: {
      title: "Splice's free tier — unlocked by the connector",
      body: "Splice's free tier was always limited because browsing a million samples by hand is exhausting and most people quit before they find anything. Now you describe what you want and Claude pulls. Same library, completely different ergonomics. Test the connector on the free tier before you commit to Sounds Plus — the value calculation just shifted.",
    },
    whatBuilding: {
      title: "chaosclub.co — the lyric and audio platform",
      paragraphs: [
        "Stack this week: React 19 + Vite, Firebase auth, Cloudflare R2 for audio, Lyria 3 Pro for generation, Gemini Flash for mood tagging, Stripe for the $4.99 premium tier. Aesthetic locked in: \"Reading Room at Midnight\" — dark editorial, slow scroll, deliberately not feed-shaped.",
        "The thing I'm trying to prove: lyrics belong in the same shelf as poetry, not in a TikTok caption. 100+ originals already in. If that sentence makes sense to you, beta access is opening soon — reply and I'll add you.",
      ],
    },
  },

  fieldNotes: {
    issueNumber: 1,
    titleLine1: "The week the APIs",
    titleLine2: "said no.",
    paragraphs: [
      { text: "Three times this week, I tried to script something and the API said no.", style: "drop-cap" },
      { text: "FlashFusion has a Wix Velo provisioning step that returns a 500 every time. The shipping carrier update endpoint rejects the appId I'm legally allowed to send. Click tracking has no REST endpoint at all. So at some point Tuesday afternoon, I closed the script, opened the Wix dashboard, and clicked through three forms by hand. That's not a failure of the work. That's the shape of the work.", style: "normal" },
      { text: "n8n was the same story in a different costume. The MCP integration I love can't pass full node parameters yet — so I'd build a workflow with a placeholder URL, drag it into the n8n UI, and finish the configuration manually. Five workflows half-shipped. Each one blocked not by my plan or my skill but by a seam between two APIs that haven't quite met each other yet.", style: "normal" },
      { text: "I used to find this maddening. The intellectual side of me wants every system end-to-end composable: drag-and-drop, fully scripted, audit trail clean. The actual work most weeks is 80% scripted, 20% finger-walked through a dashboard. I'd spent years trying to get that ratio to 100/0. This week I stopped trying.", style: "normal" },
      { text: "Here's what shifted:", style: "pivot" },
      { text: "Manual steps aren't a bug in the system. They're the system telling you where the next layer of value is going to get built. Every place I'm clicking through a Wix form by hand is — three to nine months from now — a SaaS opportunity, an MCP server someone's about to ship, or an n8n node that doesn't exist yet. The dashboards I'm filling in are next year's APIs.", style: "normal" },
      { text: "Two of the gaps from this week stayed with me. The Wix Velo provisioning hole — that's the kind of thing where if you asked me to predict who builds the wrapper that fixes it, I'd guess inside two quarters someone does and gets paid for it. And the Notion property creation flow, where you can build a database via API but still have to add four properties one at a time through the UI — that's exactly the kind of seam an MCP server could close in a weekend.", style: "normal" },
      { text: "The other thing I noticed, which surprised me more: the manual steps are where I learned the most about what these platforms actually are. The Wix dashboard taught me something about Velo the docs never made clear. Adding Notion properties one at a time surfaced four schema decisions I'd been making wrong in my own task system for months. When I'm in the API, I'm composing. When I'm in the dashboard, I'm reading the platform. They're different skills, and I'd been treating one as superior to the other.", style: "normal" },
      { text: "So this week I shipped less than I planned. FlashFusion still has those three pending manual steps. chaosclub.co is in build, not launch. n8n has five workflows half-finished. None of it is on the internet yet.", style: "normal" },
      { text: "But I have a sharper map than I did Monday. And I have two specific gaps — Wix Velo provisioning, Notion property creation — that I now believe will be somebody's product within a year. That counts as progress, even when no commit lands.", style: "normal" },
      { text: "If you're building something this week and you're stuck at an integration seam — write the seam down. The frustration is signal, not noise.", style: "italic-closer" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// RENDERER (do not edit when producing weekly content — edit WEEK_CONTENT above)
// ═══════════════════════════════════════════════════════════════════════════

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
                Newsletter System · {WEEK_CONTENT.meta.week} · v4 (data-driven)
              </div>
              <div className="text-zinc-100 text-lg font-semibold mt-0.5">{WEEK_CONTENT.meta.dateLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-mono uppercase">Edit content</div>
              <div className="text-zinc-300 text-sm font-mono">WEEK_CONTENT object</div>
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
                    active ? "border-zinc-600 bg-zinc-900 text-zinc-100" : "border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
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
                { id: "t1", label: "Tier 1 · Non-Tech" },
                { id: "t2", label: "Tier 2 · Tech Dept" },
                { id: "t3", label: "Tier 3 · AI Team" },
              ].map((tier) => {
                const a = activeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTier(tier.id)}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition ${
                      a ? "bg-orange-900/40 text-orange-200 border border-orange-800/60" : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {activeTab === "int" && activeTier === "t1" && <IntTier1 data={WEEK_CONTENT.intT1} dateLabel={WEEK_CONTENT.meta.dateLabel} cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "int" && activeTier === "t2" && <IntTier2 data={WEEK_CONTENT.intT2} dateLabel={WEEK_CONTENT.meta.dateLabel} cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "int" && activeTier === "t3" && <IntTier3 data={WEEK_CONTENT.intT3} dateLabel={WEEK_CONTENT.meta.dateLabel} cursorOn={cursorOn} onCopy={handleCopy} copied={copied} />}
        {activeTab === "ff" && <FlashFusionEdition data={WEEK_CONTENT.flashFusion} dateLabel={WEEK_CONTENT.meta.dateLabel} onCopy={handleCopy} copied={copied} />}
        {activeTab === "personal" && <PersonalEdition data={WEEK_CONTENT.fieldNotes} dateLabel={WEEK_CONTENT.meta.dateLabel} onCopy={handleCopy} copied={copied} />}
      </div>

      <div className="border-t border-zinc-800 bg-black/40 mt-8">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <div className="text-[10px] tracking-[0.25em] text-zinc-500 font-mono uppercase mb-2">how to use</div>
          <ul className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Edit the WEEK_CONTENT constant at the top of this file. The renderer never needs to change.</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Schema documented in newsletter-system-manual.md section 5.</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Weekly procedure documented in newsletter-system-manual.md section 2.</li>
            <li className="flex gap-2"><ChevronRight size={12} className="mt-0.5 flex-shrink-0 text-zinc-600" /> Hit Copy on each edition to get plain text for the delivery surface.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Render components
// ═══════════════════════════════════════════════════════════════════════════

function IntShell({ cursorOn, label, dateLabel, copyId, copyText, onCopy, copied, children }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#1f3a4d", background: "linear-gradient(180deg, #001a26 0%, #00263a 100%)" }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "#1f3a4d", background: "#000c14" }}>
        <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: LIGHTBLUE }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a3a3a" }} />
          <span className="ml-3 tracking-widest">~/the-prompt/{copyId}</span>
        </div>
        <button onClick={() => onCopy(copyId, copyText)} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono hover:bg-white/5 transition" style={{ color: LIGHTBLUE }}>
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
          <div className="mt-1 text-xs tracking-[0.2em] uppercase" style={{ color: LIGHTBLUE }}>Your weekly AI intelligence brief</div>
          <div className="mt-1 text-xs" style={{ color: "#7a9aa8" }}>{dateLabel} · {label}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function IntTier1({ data, dateLabel, cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  const text = serializeIntT1(data, dateLabel);

  return (
    <IntShell cursorOn={cursorOn} label="Tier 1 · Non-Tech Edition" dateLabel={dateLabel} copyId="t1" copyText={text} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> The headline:</p>
        <p>{data.headline}</p>

        <p><span style={{ color: ORANGE }}>$</span> What changed this week:</p>
        <div className="pl-4 border-l space-y-4" style={{ borderColor: ORANGE }}>
          {data.stories.map((s, i) => (
            <div key={i}>
              <p className="font-semibold" style={{ color: "#f4ddc6" }}>{s.title}</p>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p><span style={{ color: ORANGE }}>$</span> The number to know:</p>
          <p className="mt-1"><span className="text-2xl font-bold" style={{ color: ORANGE }}>{data.numberToKnow.value}</span> — {data.numberToKnow.context}</p>
        </div>

        <div className="mt-7">
          <p><span style={{ color: ORANGE }}>$</span> What to say when clients ask:</p>
          {data.clientQAs.map((q, i) => (
            <div key={i}>
              <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>"{q.question}"</p>
              <p className="mt-1">→ {q.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t" style={{ borderColor: "#1f3a4d" }}>
          <p><span style={{ color: ORANGE }}>$</span> Note from the editor:</p>
          <p className="mt-1">{data.editorNote}</p>
        </div>

        <div className="mt-10 pt-5 border-t text-[11px]" style={{ borderColor: "#1f3a4d", color: "#7a9aa8" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CLAIMS</div><p>{data.ccc.claims}</p></div>
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>COUNTEREXAMPLE</div><p>{data.ccc.counter}</p></div>
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CONTRADICTIONS</div><p>{data.ccc.contradictions}</p></div>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Tier 1</span><span className="opacity-50">·</span><span>{wordCount(text)} words</span>
        </div>
      </div>
    </IntShell>
  );
}

function IntTier2({ data, dateLabel, cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  const LIGHTBLUE = "#5391AA";
  const text = serializeIntT2(data, dateLabel);

  return (
    <IntShell cursorOn={cursorOn} label="Tier 2 · Tech Department Edition" dateLabel={dateLabel} copyId="t2" copyText={text} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> What's in this brief:</p>
        <p>{data.intro}</p>

        {data.updates.map((u, i) => (
          <div key={i} className="mt-6">
            <p style={{ color: ORANGE }} className="font-semibold">$ {u.title}</p>
            <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
              <p>{u.headlineNumbers}</p>
              <p style={{ color: LIGHTBLUE }}>{u.access}</p>
              <p style={{ color: "#a8c5d2" }} className="font-semibold mt-3">What to test:</p>
              <ul className="space-y-1.5">
                {u.whatToTest.map((b, j) => (<li key={j}>— {b}</li>))}
              </ul>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ Migration / deprecation watch</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}><p>{data.migrationWatch}</p></div>
        </div>

        <div className="mt-6">
          <p style={{ color: ORANGE }} className="font-semibold">$ Security advisory</p>
          <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}><p>{data.security}</p></div>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Tier 2</span><span className="opacity-50">·</span><span>{wordCount(text)} words</span>
        </div>
      </div>
    </IntShell>
  );
}

function IntTier3({ data, dateLabel, cursorOn, onCopy, copied }) {
  const ORANGE = "#E2690E";
  const text = serializeIntT3(data, dateLabel);

  return (
    <IntShell cursorOn={cursorOn} label="Tier 3 · AI Team Edition" dateLabel={dateLabel} copyId="t3" copyText={text} onCopy={onCopy} copied={copied}>
      <div className="space-y-5">
        <p><span style={{ color: ORANGE }}>$</span> Strategic frame:</p>
        <p>{data.strategicFrame}</p>

        {data.shifts.map((s, i) => (
          <div key={i} className="mt-6">
            <p style={{ color: ORANGE }} className="font-semibold">{s.title}</p>
            <div className="mt-2 pl-4 border-l space-y-2" style={{ borderColor: "#1f3a4d" }}>
              <p>{s.whatChanged}</p>
              <p>{s.meaning}</p>
              <p style={{ color: "#a8c5d2" }} className="font-semibold mt-2">What to do:</p>
              <ul className="space-y-1.5">{s.whatToDo.map((b, j) => (<li key={j}>— {b}</li>))}</ul>
              {s.clientAdvisoryDraft && (
                <>
                  <p className="mt-3 italic" style={{ color: "#a8c5d2" }}>Client advisory draft:</p>
                  <p className="italic">"{s.clientAdvisoryDraft}"</p>
                </>
              )}
            </div>
          </div>
        ))}

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
                {data.vendorMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 border-b align-top" style={{ borderColor: "#1f3a4d" }}>{row.scenario}</td>
                    <td className="p-2.5 border-b" style={{ borderColor: "#1f3a4d" }}>{row.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ Platform observation:</p>
          <p className="mt-2">{data.platformObservation}</p>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ Narrative of the week:</p>
          <p className="mt-2">{data.narrativeOfWeek}</p>
        </div>

        <div className="mt-7">
          <p style={{ color: ORANGE }} className="font-semibold">$ Internal action list this week:</p>
          <ul className="mt-2 space-y-1.5">{data.actionList.map((a, i) => (<li key={i}>— {a}</li>))}</ul>
        </div>

        <div className="mt-10 pt-5 border-t text-[11px]" style={{ borderColor: "#1f3a4d", color: "#7a9aa8" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CLAIMS</div><p>{data.ccc.claims}</p></div>
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>COUNTEREXAMPLE</div><p>{data.ccc.counter}</p></div>
            <div><div className="uppercase tracking-widest mb-1" style={{ color: ORANGE }}>CONTRADICTIONS</div><p>{data.ccc.contradictions}</p></div>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 text-[11px]" style={{ color: "#7a9aa8" }}>
          <Clock size={12} /><span>Tier 3</span><span className="opacity-50">·</span><span>{wordCount(text)} words</span>
        </div>
      </div>
    </IntShell>
  );
}

function FlashFusionEdition({ data, dateLabel, onCopy, copied }) {
  const NEON = "#a855f7";
  const ACCENT = "#ec4899";
  const text = serializeFF(data, dateLabel);

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#27272a", background: "#0a0a0a" }}>
      <div className="px-7 md:px-10 py-9 border-b" style={{ borderColor: "#27272a", background: "radial-gradient(circle at 0% 0%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(236,72,153,0.12) 0%, transparent 50%), #0a0a0a" }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: NEON }}>FlashFusion · Issue {data.issueNumber}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-2 tracking-tight leading-tight">
              {data.leadHeadline[0]}<br />{data.leadHeadline[1]}
            </h1>
            <div className="text-zinc-400 mt-2 text-sm">{dateLabel}</div>
          </div>
          <button onClick={() => onCopy("ff", text)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition">
            {copied === "ff" ? <Check size={12} /> : <Copy size={12} />}{copied === "ff" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="px-7 md:px-10 py-8 text-zinc-300 leading-relaxed">
        <div className="mb-10">
          {data.leadBody.map((p, i) => (
            <p key={i} className={`mb-4 ${i === 0 ? "text-zinc-200 text-lg" : ""}`}>{p}</p>
          ))}

          <div className="my-6 pl-5 border-l-2" style={{ borderColor: NEON }}>
            <div className="text-xs tracking-widest uppercase mb-3 font-semibold" style={{ color: NEON }}>{data.threeThingsTitle}</div>
            <ul className="space-y-3 text-zinc-300">
              {data.threeThings.map((t, i) => (
                <li key={i}><span className="text-zinc-100 font-medium">{t.name}</span> {t.body}</li>
              ))}
            </ul>
          </div>

          <p className="text-zinc-400 italic">{data.leadCloser}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-5" style={{ color: ACCENT }}>Quick Hits</h2>
          <div className="space-y-4">
            {data.quickHits.map((h, i) => (
              <div key={i} className="border-l-2 pl-4" style={{ borderColor: "#27272a" }}>
                <div className="text-zinc-100 font-semibold text-sm mb-1">{h.title}</div>
                <div className="text-zinc-400 text-sm">{h.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 p-6 rounded-lg" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}>
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-4" style={{ color: NEON }}>Workflow of the Week</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-3">{data.workflow.title}</h3>
          <p className="text-zinc-300 mb-4">{data.workflow.intro}</p>
          <ol className="space-y-3 text-zinc-300 text-sm">
            {data.workflow.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs mt-0.5" style={{ color: NEON }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-zinc-200">{s.description}</div>
                  <div className="text-zinc-500 text-xs mt-1 font-mono">{s.prompt}</div>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-zinc-400 text-sm mt-4 italic">{data.workflow.closer}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-3" style={{ color: ACCENT }}>Free Tier Spotlight</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-2">{data.freeTier.title}</h3>
          <p className="text-zinc-400">{data.freeTier.body}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs tracking-[0.3em] uppercase font-bold mb-3" style={{ color: ACCENT }}>What I'm Building</h2>
          <h3 className="text-zinc-100 text-lg font-semibold mb-3">{data.whatBuilding.title}</h3>
          {data.whatBuilding.paragraphs.map((p, i) => (
            <p key={i} className="text-zinc-400 mb-3">{p}</p>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t flex items-center gap-2 text-xs text-zinc-500" style={{ borderColor: "#27272a" }}>
          <Clock size={12} /><span>FlashFusion</span><span className="opacity-50">·</span><span>{wordCount(text)} words</span>
        </div>
      </div>
    </div>
  );
}

function PersonalEdition({ data, dateLabel, onCopy, copied }) {
  const PAPER = "#f5f1ea";
  const INK = "#1c1917";
  const ACCENT = "#9a3412";
  const text = serializeFN(data, dateLabel);

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#3a3530", background: PAPER }}>
      <div className="px-7 md:px-12 py-10" style={{ color: INK }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase font-semibold" style={{ color: ACCENT }}>Field Notes · No. {data.issueNumber}</div>
            <div className="text-xs mt-1 tracking-wide" style={{ color: "#57534e" }}>kylerosebrook.com · {dateLabel}</div>
          </div>
          <button onClick={() => onCopy("personal", text)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:bg-stone-200 border border-stone-300 transition" style={{ color: "#57534e" }}>
            {copied === "personal" ? <Check size={12} /> : <Copy size={12} />}{copied === "personal" ? "Copied" : "Copy"}
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] mb-2 tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: INK }}>
          {data.titleLine1}<br /><span className="italic" style={{ color: ACCENT }}>{data.titleLine2}</span>
        </h1>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "#a8a29e" }} />
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#78716c" }}>An essay</div>
          <div className="h-px flex-1" style={{ background: "#a8a29e" }} />
        </div>

        <article className="space-y-5 text-[17px] leading-[1.75]" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#292524" }}>
          {data.paragraphs.map((p, i) => {
            if (p.style === "drop-cap") {
              return <p key={i} className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1" style={{ color: "#292524" }}>{p.text}</p>;
            }
            if (p.style === "pivot") {
              return <p key={i} className="font-semibold pt-2" style={{ color: ACCENT, fontFamily: "Georgia, serif" }}>{p.text}</p>;
            }
            if (p.style === "italic-closer") {
              return <p key={i} className="italic pt-2" style={{ color: "#57534e", borderTop: "1px solid #d6d3d1" }}>{p.text}</p>;
            }
            return <p key={i}>{p.text}</p>;
          })}
          <div className="pt-4 text-sm" style={{ color: "#78716c" }}>— Kyle</div>
        </article>

        <div className="mt-8 pt-4 border-t flex items-center gap-2 text-xs" style={{ borderColor: "#d6d3d1", color: "#78716c" }}>
          <Clock size={12} /><span>Field Notes</span><span className="opacity-50">·</span><span>{wordCount(text)} words</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Plain-text serializers (used by Copy buttons)
// ═══════════════════════════════════════════════════════════════════════════

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function serializeIntT1(d, dateLabel) {
  return `> THE PROMPT — Tier 1 · Non-Tech Edition
${dateLabel}

THE HEADLINE
${d.headline}

WHAT CHANGED THIS WEEK

${d.stories.map((s) => `${s.title}\n${s.body}`).join("\n\n")}

THE NUMBER TO KNOW
${d.numberToKnow.value} — ${d.numberToKnow.context}

WHAT TO SAY WHEN CLIENTS ASK

${d.clientQAs.map((q) => `"${q.question}"\n→ ${q.answer}`).join("\n\n")}

NOTE FROM THE EDITOR
${d.editorNote}

CLAIMS: ${d.ccc.claims}
COUNTEREXAMPLE: ${d.ccc.counter}
CONTRADICTIONS: ${d.ccc.contradictions}`;
}

function serializeIntT2(d, dateLabel) {
  return `> THE PROMPT — Tier 2 · Tech Department Edition
${dateLabel}

WHAT'S IN THIS BRIEF
${d.intro}

${d.updates.map((u) => `${u.title.toUpperCase()}
${u.headlineNumbers}
${u.access}

What to test:
${u.whatToTest.map((b) => `- ${b}`).join("\n")}`).join("\n\n")}

MIGRATION / DEPRECATION WATCH
${d.migrationWatch}

SECURITY ADVISORY
${d.security}`;
}

function serializeIntT3(d, dateLabel) {
  const matrix = d.vendorMatrix.map((r) => `| ${r.scenario} | ${r.recommendation} |`).join("\n");
  return `> THE PROMPT — Tier 3 · AI Team Edition
${dateLabel}

STRATEGIC FRAME
${d.strategicFrame}

${d.shifts.map((s) => `${s.title.toUpperCase()}
${s.whatChanged}

${s.meaning}

What to do:
${s.whatToDo.map((b) => `- ${b}`).join("\n")}${s.clientAdvisoryDraft ? `\n\nClient advisory draft:\n"${s.clientAdvisoryDraft}"` : ""}`).join("\n\n")}

UPDATED VENDOR RECOMMENDATION MATRIX

| Scenario | Recommendation |
|---|---|
${matrix}

PLATFORM OBSERVATION
${d.platformObservation}

NARRATIVE OF THE WEEK
${d.narrativeOfWeek}

INTERNAL ACTION LIST
${d.actionList.map((a) => `- ${a}`).join("\n")}

CLAIMS: ${d.ccc.claims}
COUNTEREXAMPLE: ${d.ccc.counter}
CONTRADICTIONS: ${d.ccc.contradictions}`;
}

function serializeFF(d, dateLabel) {
  return `FlashFusion · Issue ${d.issueNumber}
${dateLabel}

LEAD: ${d.leadHeadline.join(" ")}

${d.leadBody.join("\n\n")}

${d.threeThingsTitle}:
${d.threeThings.map((t) => `- ${t.name} ${t.body}`).join("\n")}

${d.leadCloser}

QUICK HITS

${d.quickHits.map((h) => `${h.title}. ${h.body}`).join("\n\n")}

WORKFLOW OF THE WEEK: ${d.workflow.title}
${d.workflow.intro}

${d.workflow.steps.map((s, i) => `${String(i + 1).padStart(2, "0")}. ${s.description}\n    ${s.prompt}`).join("\n\n")}

${d.workflow.closer}

FREE TIER SPOTLIGHT: ${d.freeTier.title}
${d.freeTier.body}

WHAT I'M BUILDING: ${d.whatBuilding.title}
${d.whatBuilding.paragraphs.join("\n\n")}`;
}

function serializeFN(d, dateLabel) {
  return `Field Notes · No. ${d.issueNumber}
kylerosebrook.com · ${dateLabel}

${d.titleLine1.toUpperCase()} ${d.titleLine2.toUpperCase()}
An essay.

${d.paragraphs.map((p) => p.text).join("\n\n")}

— Kyle`;
}
