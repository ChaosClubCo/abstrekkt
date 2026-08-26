import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// SMOKE TEST — "working" means:
//   1. Pick Master → answer all → review → kit with 5 copyable sections per platform
//   2. Refresh mid-interview → "Resume draft" banner restores exact question + answers
//   3. Save a Master → start Client → inherit picker pre-fills tone/style/constraints
//   4. Custom-tool field NO LONGER wipes multi-select chips (controlled input)
//   5. Required multi-selects block "Continue" until ≥1 chosen
//   6. Tab/keyboard nav shows a visible focus ring on every control
// ─────────────────────────────────────────────

// ─── DESIGN TOKENS — FlashFusion v3 ───
const C = {
  bg1:"#0B0B14", bg2:"#13131F", bg3:"#1C1C2E",
  border:"rgba(168,85,247,0.12)", borderHi:"rgba(168,85,247,0.35)",
  v:"#A855F7", m:"#EC4899", cy:"#22D3EE",
  t1:"#FFFFFF", t2:"#C7C7D1", t3:"#9A9AA6", // lightened for contrast
  ok:"#10b981", warn:"#f59e0b", err:"#ef4444",
};

// ─── SAFE STORAGE LAYER (feature-detect → in-memory fallback) ───
const _mem = {};
const hasStore = typeof window !== "undefined" && !!window.storage;
const store = {
  async get(key) {
    if (!hasStore) return key in _mem ? _mem[key] : null;
    try { const r = await window.storage.get(key, false); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, value) {
    if (!hasStore) { _mem[key] = value; return; }
    try { await window.storage.set(key, JSON.stringify(value), false); } catch { /* non-fatal */ }
  },
  async del(key) {
    if (!hasStore) { delete _mem[key]; return; }
    try { await window.storage.delete(key, false); } catch { /* non-fatal */ }
  },
  async list(prefix) {
    if (!hasStore) return Object.keys(_mem).filter(k => k.startsWith(prefix));
    try { const r = await window.storage.list(prefix, false); return r?.keys ?? []; } catch { return []; }
  },
};
const DRAFT_KEY = "mpc_draft";
const LIB_PREFIX = "mpc_lib_";

// ─── LAYER 2 — PLATFORM KNOWLEDGE (system-injected) ───
const PLATFORM_KNOWLEDGE = {
  "Google AI Studio": {
    key:"ai_studio", icon:"🔵", color:C.cy,
    tagline:"5-layer prompt structure · Gemini 3 · Structured output",
    settings:[
      "Temperature: 0.2 (code) → 0.0 (strict JSON)",
      "Top-P: 0.9",
      "Max Output Tokens: 8192 (raise to 16K for multi-connector)",
      "Structured Output: ON — paste schema into Edit field",
      "Search Grounding: OFF (enable only to fetch live API docs)",
      "Model: Flash for iteration → Pro for final output",
    ],
    constraints:[
      "Files expire after 48hrs — re-upload every session",
      "Gemini 3 = reasoning model — be concise, cut verbose scaffolding",
      "250 RPD cap on preview models even on Tier 1 paid",
      "Build mode = web container only — no server-side execution",
      "Free tier: Google may train on inputs — Settings → disable toggle",
      "candidateCount > 1 returns 400 on Gemini 3 — don't use it",
    ],
    gems:[
      '"Get Code" exports to Python / curl / Node.js in one click — never retype',
      "JSON + Temp 0.0 = parse-safe output, zero conversational preamble",
      "Flash (1,500 RPD) for iteration — Pro (50 RPD) for final only",
      "Function calling + structured output combinable on Gemini 3",
      "Code Execution tool: Gemini runs Python in-session to pre-process specs",
      "OpenAI compatibility layer: OpenAI params auto-map to Gemini equivalents",
      "Save as Prompt preserves settings; uploaded files still expire (48hr)",
    ],
    format:"5-layer: System Instructions → User Context → Few-Shot → Task → Output Spec",
    sysTemplate:(p)=>buildAIStudioInstructions(p),
  },
  "Claude (claude.ai)": {
    key:"claude", icon:"🟠", color:C.m,
    tagline:"XML tags · Project Instructions · Artifacts · Memory",
    settings:[
      "Context window: 200K tokens",
      "Project Instructions: use for persistent cross-conversation context",
      "Artifacts: render React / HTML / JSX / Mermaid / SVG inline",
      "Web search: available — cite sources, never invent precision",
      "Memory: summaries from past chats — not verbatim recall",
      "window.storage: artifact persistence (NOT localStorage — blocked)",
    ],
    constraints:[
      "Project instructions persist; regular chat context window does not",
      "CLAUDE.md holds standing context for Claude Code sessions",
      "Artifacts can call api.anthropic.com — not external APIs directly",
      "Memory summaries ≠ verbatim recall — don't rely on exact phrasing",
      "Sycophancy is the default failure mode — explicitly prohibit it",
      "project_knowledge_search must run before other tools in Projects",
    ],
    gems:[
      "XML tags are the strongest structural signal — use on every section",
      "TL;DR first enforced via system instructions — followed consistently",
      "CLAIMS/GAPS/[SOURCED]/[GENERATED] footers enforce source discipline",
      "Terse commands ('patch', 'build') = execute without re-explanation",
      "Artifacts support Anthropic API calls for Claude-in-Claude workflows",
      "CLAUDE.md carries standing context across all Claude Code sessions",
    ],
    format:"XML-tagged system prompt + Project Instructions for persistence",
    sysTemplate:(p)=>buildClaudeInstructions(p),
  },
  "Base44": {
    key:"base44", icon:"⚡", color:C.v,
    tagline:"Entity schema · ClientOrg pattern · App structure",
    settings:[
      "Schema first — always define entities before views",
      "ClientOrganization + EmployeeProfile = canonical B2B multi-tenant",
      "RLS: user_id = auth.uid() on all user-owned entities",
      "App-level permissions are separate from entity-level RLS",
      "Verify app IDs before wiring n8n — stale subdomains fail silently",
    ],
    constraints:[
      "Entity model must exist before building any views or workflows",
      "Deprecated apps (0 schemas) are empty shells — scaffold from scratch",
      "Stale subdomain references break n8n workflows without error messages",
      "App IDs are unique per environment — never reuse across apps",
      "ClientOrganization as root tenant — do not flatten into user table",
    ],
    gems:[
      "ClientOrganization + EmployeeProfile = multi-tenant B2B in two entities",
      "LearningPath → CourseModules chain for structured course delivery",
      "PosthogEventSnapshot for analytics event capture without extra setup",
      "CNAME spark.[domain] activates SparkAcademy-style learning delivery",
      "B44 MCP available — use for direct app schema queries in Claude",
      "Vibecode-Workshop pattern = 2-entity minimal scaffold to start fast",
    ],
    format:"Entity schema → App structure → Views → Workflows",
    sysTemplate:(p)=>buildBase44Instructions(p),
  },
  "Lovable.dev": {
    key:"lovable", icon:"💜", color:"#8B5CF6",
    tagline:"Vibe coding · React generation · Supabase integration",
    settings:[
      "Prompt style: describe the UI outcome, not the implementation",
      "Supabase: enable integration for auth + database in one step",
      "Component library: shadcn/ui (pre-integrated)",
      "Deployment: auto-deploy on every accepted generation",
      "GitHub sync: available — connects to your repo",
    ],
    constraints:[
      "Lovable generates full apps, not isolated components — scope accordingly",
      "No direct backend API calls — all data through Supabase or edge functions",
      "Prompt must describe end-user goal, not code structure",
      "Generated code is React + TypeScript + Tailwind — no framework swaps",
      "Changes are accepted or rejected in full — no partial merges",
    ],
    gems:[
      "Describe the end-user flow first, then the data shape — better output",
      "Supabase integration auto-generates RLS and auth — don't hand-code it",
      "Use 'Edit' mode for targeted changes without full regeneration",
      "Prompt with screenshots or wireframes — Lovable reads images",
      "GitHub sync lets you pull generated code into your own workflow",
    ],
    format:"Natural language outcome description → acceptance/rejection loop",
    sysTemplate:(p)=>buildLovableInstructions(p),
  },
  "v0.app": {
    key:"v0", icon:"▲", color:C.t1,
    tagline:"React component generation · shadcn/ui · Vercel-native",
    settings:[
      "Output: React + shadcn/ui + Tailwind — always",
      "Scope: single component or page — not full apps",
      "Iteration: fork and iterate on generated output",
      "Deployment: push to Vercel directly from v0",
      "Code export: always available — copy clean React",
    ],
    constraints:[
      "v0 generates UI only — no backend, no auth, no data fetching",
      "shadcn/ui is the only library — don't request MUI or Radix directly",
      "Prompts work best for layout + interaction, not data logic",
      "No persistent state across sessions — each generation is independent",
      "Complex business logic belongs in your codebase, not the v0 prompt",
    ],
    gems:[
      "Paste a screenshot — v0 reverse-engineers existing UI accurately",
      "Describe layout spatially: 'two-column grid, metric card top-left'",
      "Fork any generation to iterate without losing the original",
      "Request dark mode explicitly — default is light",
      "v0 understands Tailwind utility classes natively — use them in prompts",
    ],
    format:"UI outcome description → component iterations",
    sysTemplate:(p)=>buildV0Instructions(p),
  },

  // ───────── AI ECOSYSTEMS ─────────
  "Gemini (App, Gems & Workspace)": {
    key:"gemini_eco", icon:"✨", color:C.cy, kind:"ai", outputLabel:"Gem Instructions",
    tagline:"Gems · Workspace grounding · Deep Research · Canvas",
    settings:[
      "Gems: save reusable custom-instruction bots in the Gemini app",
      "Workspace: @-mention Docs / Gmail / Drive for grounded context",
      "Deep Research mode for multi-source synthesis reports",
      "Canvas for iterative doc + code editing in-app",
      "Model: 2.5 / 3.x Flash vs Pro selectable per chat",
    ],
    constraints:[
      "Gem instructions are persistent but shorter-form than API system prompts",
      "Consumer app may train on data unless on Workspace / paid tier",
      "No JSON-schema enforcement in-app — use AI Studio/API for strict output",
      "Workspace grounding limited to the connected account",
      "Gems are private unless you share the link",
    ],
    gems:[
      "Gems = save your system prompt once, reuse as a bot",
      "@Workspace grounds answers in your own Docs / Gmail / Drive",
      "Deep Research compiles multi-source briefs with citations",
      "Canvas edits documents and code iteratively without re-prompting",
      "Same Google account = AI Studio (dev) + Gemini app (consumer) share models",
    ],
    format:"Gem custom instructions + Workspace grounding",
    sysTemplate:(p)=>buildGeminiEcosystem(p),
  },
  "OpenAI (ChatGPT, GPTs, API)": {
    key:"openai", icon:"🟢", color:"#74AA9C", kind:"ai", outputLabel:"System / GPT Instructions",
    tagline:"Custom GPTs · Structured Outputs · Assistants/Responses API",
    settings:[
      "Custom GPT builder: instructions + knowledge files + Actions",
      "ChatGPT custom instructions: persistent per-account preferences",
      "API: system-role message for per-call instructions",
      "Structured Outputs: enforce JSON via response_format json_schema",
      "Projects: group chats with shared instructions + files",
    ],
    constraints:[
      "Custom GPT instructions cap ~8k chars — push long refs into knowledge files",
      "Consumer ChatGPT may train on data unless disabled / Team / Enterprise",
      "Shared GPTs are public in the GPT Store",
      "App custom instructions are separate from API system prompts",
      "Actions require an OpenAPI schema for your endpoints",
    ],
    gems:[
      "Custom GPTs bundle instructions + knowledge files + API Actions",
      "Structured Outputs (json_schema) guarantees parseable JSON",
      "Projects share instructions + files across many chats",
      "Actions let a GPT call your own API via an OpenAPI spec",
      "OpenAI-compatible endpoints let you swap in other providers",
    ],
    format:"System prompt / Custom GPT instructions + Structured Outputs",
    sysTemplate:(p)=>buildOpenAIInstructions(p),
  },

  // ───────── SOCIAL — NAMED ─────────
  "Facebook": {
    key:"facebook", icon:"📘", color:"#1877F2", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Pages · Graph API · Meta Business Suite",
    settings:[
      "Meta Business Suite for scheduling + insights (FB + IG together)",
      "Graph API via a Meta App + long-lived Page access token",
      "Assign least-privilege Page roles",
      "Use og: meta tags for rich link previews",
      "Targeted promotion via Ads Manager, not the Boost button",
    ],
    constraints:[
      "Organic reach is low — plan for a small % of followers",
      "Graph API needs App Review for publish permissions",
      "External-link posts are distributed less than native content",
      "Short-lived tokens must be exchanged for long-lived ones",
      "Engagement-bait phrasing is demoted by policy",
    ],
    gems:[
      "Native video + Reels outperform link posts heavily",
      "Put links in the first comment, keep the post body native",
      "Business Suite schedules FB + IG in one pass",
      "Graph API insights endpoint gives true reach data",
      "One Reel upload can cross-post to Instagram",
    ],
    format:"Native posts · Reels · Stories (link in first comment)",
    contentSpec:{
      formats:["Front-load the hook in the first 2 lines (truncation point)","Reels: 9:16, 15-90s, burned-in captions","Stories: 9:16 ephemeral, polls/stickers lift interaction"],
      algo:["Native content > external links","Reels get the widest distribution","Meaningful comments weighted over likes","Consistency beats volume"],
      apiNote:"Graph API requires a Meta App + App Review for pages_manage_posts. Use long-lived Page tokens, server-side only.",
    },
    sysTemplate:(p)=>buildSocialBrief("Facebook", p),
  },
  "Instagram": {
    key:"instagram", icon:"📷", color:"#E4405F", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Business/Creator · Graph API · Reels-first",
    settings:[
      "Business or Creator account linked to a Facebook Page (required for API)",
      "Publish via Instagram Graph API (container → publish flow)",
      "Meta Business Suite or approved scheduler for planning",
      "Link in bio tools for outbound (no clickable links in captions)",
      "Insights via Graph API for reach/saves/shares",
    ],
    constraints:[
      "API publishing requires Business/Creator + linked FB Page",
      "No clickable links in captions — only bio + Stories link sticker",
      "DM automation limited to the Messaging API product",
      "Daily content-publish API limits apply",
      "Reposting watermarked content (e.g. TikTok) is demoted",
    ],
    gems:[
      "Saves + shares + sends outrank likes in the algorithm",
      "Carousels drive dwell time — strong reach format",
      "Reels are the discovery engine; feed posts retain followers",
      "First line of caption is the hook before the '…more' fold",
      "Alt text + keywords now feed IG search/SEO",
    ],
    format:"Reels · Carousels · Stories (bio/Story links only)",
    contentSpec:{
      formats:["Reels: 9:16, hook in first 1s, trending audio, captions","Carousels: first slide is the hook, 7-10 slides","Stories: stickers/polls, link sticker for outbound"],
      algo:["Saves/shares/sends > likes","Carousels + Reels favored for reach","Watermarked reposts demoted","Search/SEO via alt text + keywords"],
      apiNote:"Instagram Graph API: create a media container, then publish. Needs Business/Creator account + FB Page link + App Review.",
    },
    sysTemplate:(p)=>buildSocialBrief("Instagram", p),
  },
  "TikTok": {
    key:"tiktok", icon:"🎵", color:"#FF0050", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Content Posting API · short video · trend-driven",
    settings:[
      "Content Posting API requires an approved TikTok developer app",
      "Business account for analytics + commercial music library",
      "Trending sounds from the Creative Center / Commercial Music Library",
      "Captions + on-screen text for sound-off viewing",
      "Post natively — avoid uploading watermarked exports",
    ],
    constraints:[
      "API access requires developer-app review/approval",
      "Reposted watermarked video is demoted",
      "Commercial use needs licensed/commercial sounds",
      "Aggressive outbound links are throttled",
      "Region-specific content policies vary",
    ],
    gems:[
      "Hook must land in the first 1-3 seconds or watch-time dies",
      "Watch-time + completion rate are the dominant signals",
      "Post consistently — the algorithm rewards cadence",
      "Reply to comments with video to extend a post's life",
      "Native captions boost accessibility and retention",
    ],
    format:"Short vertical video · trend + sound driven",
    contentSpec:{
      formats:["9:16, 15-60s sweet spot","Hook in first 1-3s","On-screen text + captions for sound-off","Trending/commercial audio"],
      algo:["Watch-time + completion rate dominate","Cadence/consistency rewarded","Watermarked reposts demoted","Comment replies (esp. video) extend reach"],
      apiNote:"TikTok Content Posting API needs an approved developer app; commercial posts require licensed sounds.",
    },
    sysTemplate:(p)=>buildSocialBrief("TikTok", p),
  },
  "Twitter / X": {
    key:"twitter", icon:"🐦", color:"#1DA1F2", kind:"social", outputLabel:"Content & API Brief",
    tagline:"API v2 (tiered) · threads · reply-driven reach",
    settings:[
      "API v2 with tiered access (Free / Basic / Pro) — pick by volume",
      "OAuth 2.0 for posting on behalf of an account",
      "Threads for long-form; single posts for hooks",
      "Premium unlocks longer posts + edit + boosted reach",
      "Analytics via the API or native dashboard",
    ],
    constraints:[
      "API pricing tiers are steep above Free; rate limits are strict",
      "Base post limit ~280 chars (longer on Premium)",
      "Outbound links can suppress reach vs native text/media",
      "Free tier is write-limited — Basic+ needed for real automation",
      "Aggressive automation risks suspension",
    ],
    gems:[
      "First post is the hook; thread the payoff below it",
      "Replies and quote-posts drive more reach than likes",
      "Native media + text outperform bare link posts",
      "Post the link in a reply, not the main tweet",
      "Consistent posting windows beat sporadic bursts",
    ],
    format:"Hook post + thread · reply engagement",
    contentSpec:{
      formats:["Hook in post 1 (≤280 chars unless Premium)","Thread: one idea per post, payoff at the end","Native images/video > link cards","Link in a reply, not the main post"],
      algo:["Replies + quote-posts > likes","Native content favored over links","Dwell + conversation weighted","Posting consistency matters"],
      apiNote:"X API v2 is tiered (Free/Basic/Pro). Posting needs OAuth 2.0; Free tier is heavily write-limited.",
    },
    sysTemplate:(p)=>buildSocialBrief("Twitter / X", p),
  },
  "LinkedIn": {
    key:"linkedin", icon:"💼", color:"#0A66C2", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Posts · documents · dwell-time algorithm",
    settings:[
      "Marketing Developer Platform approval needed for API posting",
      "Personal profile vs Company Page — different reach dynamics",
      "Document (carousel) posts for high dwell time",
      "Native video + text; minimize outbound links in the body",
      "Analytics via the API or Page dashboard",
    ],
    constraints:[
      "Posting API requires partner/Marketing Developer Platform approval",
      "~3,000 char post limit",
      "Outbound links in the body suppress reach — use first comment",
      "Over-posting fatigues the feed; 3-5x/week is a common ceiling",
      "B2B audience — overtly casual tone underperforms",
    ],
    gems:[
      "Hook the first 3 lines before the 'see more' fold",
      "Dwell time + early comments drive distribution",
      "Document/carousel posts get outsized reach",
      "Put links in the first comment, not the post body",
      "Reply to every early comment to compound reach",
    ],
    format:"Text hook · document carousels · first-comment links",
    contentSpec:{
      formats:["Hook in first 3 lines (pre-'see more')","≤3,000 chars, whitespace for scannability","Document/carousel PDF for dwell time","Links in first comment, not body"],
      algo:["Dwell time + early comments drive reach","Documents/carousels favored","Native > outbound links","Reply early to compound distribution"],
      apiNote:"LinkedIn posting API requires Marketing Developer Platform approval. Many creators schedule via approved third-party tools instead.",
    },
    sysTemplate:(p)=>buildSocialBrief("LinkedIn", p),
  },

  // ───────── SOCIAL — NEXT LOGICAL 5 ─────────
  "YouTube": {
    key:"youtube", icon:"▶️", color:"#FF0000", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Data API v3 · Shorts + long-form · CTR-driven",
    settings:[
      "YouTube Data API v3 for upload + metadata + analytics",
      "Default quota ~10,000 units/day (uploads are expensive)",
      "Shorts for discovery, long-form for depth + watch-time",
      "Thumbnails + titles are the primary CTR levers",
      "Chapters + end screens to retain and route viewers",
    ],
    constraints:[
      "API quota: uploads cost ~1,600 units each — plan volume",
      "OAuth required for upload; channel must be in good standing",
      "Thumbnails need a verified channel",
      "Copyright/Content ID strikes restrict features",
      "Monetization gated behind YPP thresholds",
    ],
    gems:[
      "First 30 seconds decide retention — front-load value",
      "Thumbnail CTR x retention = the reach formula",
      "Shorts are the discovery funnel into long-form",
      "Title + thumbnail should pose one clear curiosity gap",
      "Chapters improve retention and search surfacing",
    ],
    format:"Shorts (discovery) + long-form (watch-time)",
    contentSpec:{
      formats:["Shorts: 9:16, <60s, hook in 1s","Long-form: 16:9, value in first 30s, chapters","Thumbnail: one focal idea, high contrast","Title: one clear curiosity gap"],
      algo:["CTR x average-view-duration drives reach","First 30s retention is critical","Shorts feed discovery into long-form","Session time (keeping viewers on YT) rewarded"],
      apiNote:"YouTube Data API v3 has a ~10k unit/day quota; uploads (~1,600 units) burn it fast. OAuth required.",
    },
    sysTemplate:(p)=>buildSocialBrief("YouTube", p),
  },
  "Threads": {
    key:"threads", icon:"🧵", color:"#000000", kind:"social", outputLabel:"Content & API Brief",
    tagline:"Threads API · text-first · IG cross-pollination",
    settings:[
      "Threads API available for publishing + insights",
      "Linked to an Instagram account",
      "Text-first, conversational; replies extend reach",
      "Cross-pollinate audience from Instagram",
      "Fast, casual cadence outperforms polished broadcasts",
    ],
    constraints:[
      "~500 char limit per post",
      "API tied to the linked Instagram/Meta account",
      "Newer platform — feature set still shifting",
      "Reach favors replies/conversation over broadcast",
      "Outbound-link behavior less punishing than X but unproven",
    ],
    gems:[
      "Conversational, reply-bait-in-a-good-way prompts work",
      "Riff in threads; one idea per post",
      "Seed early audience from your Instagram following",
      "Higher cadence than X is tolerated and rewarded",
      "Questions and hot-takes drive reply chains",
    ],
    format:"Short text posts · reply chains",
    contentSpec:{
      formats:["≤500 chars, conversational","One idea per post, thread to expand","Questions/hot-takes to spark replies"],
      algo:["Replies + conversation drive reach","Cadence tolerated higher than X","IG cross-pollination boosts cold start"],
      apiNote:"Threads API publishes via the linked Instagram/Meta account; feature set still evolving.",
    },
    sysTemplate:(p)=>buildSocialBrief("Threads", p),
  },
  "Reddit": {
    key:"reddit", icon:"🤖", color:"#FF4500", kind:"social", outputLabel:"Content & API Brief",
    tagline:"OAuth API · subreddit-native · value-first",
    settings:[
      "Reddit API via OAuth; respect per-app rate limits",
      "High-volume/commercial API access is now paid",
      "Every subreddit has its own rules — read them first",
      "Value-first; overt self-promo gets removed/banned",
      "AMAs and genuine participation build standing",
    ],
    constraints:[
      "API is rate-limited; commercial volume requires paid access",
      "Self-promo crackdowns vary by subreddit (often a 9:1 rule)",
      "New/low-karma accounts are auto-filtered",
      "Mods can remove anything — community rules are law",
      "Astroturfing is detected and punished hard",
    ],
    gems:[
      "Lead with value; mention your thing only when asked",
      "Match each subreddit's voice and rules exactly",
      "Comment genuinely for weeks before posting links",
      "AMAs convert when you bring real expertise",
      "Title is everything — it's the whole hook on Reddit",
    ],
    format:"Subreddit-native posts + genuine comments",
    contentSpec:{
      formats:["Title carries the hook — make it specific","Value in the body, link last or in comments","Match subreddit tone + rules precisely"],
      algo:["Upvotes + comment depth drive visibility","Self-promo ratio (~9:1) enforced socially","Account age/karma gate participation"],
      apiNote:"Reddit API needs OAuth; high-volume/commercial use is paid. Subreddit rules override everything.",
    },
    sysTemplate:(p)=>buildSocialBrief("Reddit", p),
  },
  "Pinterest": {
    key:"pinterest", icon:"📌", color:"#E60023", kind:"social", outputLabel:"Content & API Brief",
    tagline:"API · visual search SEO · evergreen pins",
    settings:[
      "Pinterest API for pins, boards, and analytics",
      "Business account for analytics + rich pins",
      "Vertical 2:3 pins with keyword-rich titles + descriptions",
      "Boards organized around searchable themes",
      "Link pins back to owned destinations",
    ],
    constraints:[
      "Pinterest is a visual search engine, not a feed — SEO matters most",
      "API access requires a registered app",
      "Low-res or non-vertical pins underperform",
      "Spammy repinning is demoted",
      "Results compound slowly — it's an evergreen play",
    ],
    gems:[
      "Treat it like SEO: keywords in title, description, board name",
      "Fresh pins (new images) are favored over repins",
      "Vertical 2:3 is the optimal ratio",
      "Pins are evergreen — traffic compounds for months",
      "One strong destination link per pin",
    ],
    format:"Vertical pins · keyword-rich · evergreen",
    contentSpec:{
      formats:["2:3 vertical, high-res","Keyword-rich title + description","Text overlay on the image","Themed boards for search"],
      algo:["Visual-search SEO (keywords) dominates","Fresh pins > repins","Evergreen — traffic compounds slowly","Destination quality matters"],
      apiNote:"Pinterest API needs a registered app + Business account for full analytics and rich pins.",
    },
    sysTemplate:(p)=>buildSocialBrief("Pinterest", p),
  },
  "Bluesky": {
    key:"bluesky", icon:"🦋", color:"#0085FF", kind:"social", outputLabel:"Content & API Brief",
    tagline:"AT Protocol · open API · chronological + custom feeds",
    settings:[
      "AT Protocol: open API, app passwords for posting",
      "Custom feeds let niche communities self-organize",
      "~300 char posts; threads for longer thoughts",
      "Links are not algorithmically suppressed",
      "Dev/early-adopter audience skews technical",
    ],
    constraints:[
      "~300 char limit per post",
      "Smaller audience than incumbents (growing)",
      "Feed dynamics still maturing",
      "App-password auth (full OAuth maturing)",
      "Norms still forming — less established playbook",
    ],
    gems:[
      "Links aren't penalized — share freely vs X",
      "Custom feeds = built-in niche distribution",
      "Chronological-friendly: posting time matters",
      "Technical/builder audience rewards substance",
      "Early-mover advantage on a growing network",
    ],
    format:"Short posts · threads · custom feeds",
    contentSpec:{
      formats:["≤300 chars, thread to expand","Links welcome (no suppression)","Substance over hooks for the dev audience"],
      algo:["More chronological than algorithmic","Custom feeds drive niche reach","Links not penalized","Posting time matters"],
      apiNote:"Bluesky runs on the open AT Protocol; post via app passwords (full OAuth maturing).",
    },
    sysTemplate:(p)=>buildSocialBrief("Bluesky", p),
  },
};

// ─── OUTPUT GENERATORS ───
function flags(p) {
  const f = p.constraints.flags;
  return {
    hasPII: f.includes("High PII sensitivity") || f.includes("HIPAA compliance"),
    serverOnly: f.includes("No client-side API calls") || f.includes("Server-side only"),
    noTraining: f.includes("No model training on inputs"),
    tokenLean: f.includes("Minimize token usage"),
  };
}
const verbosityLine = (v) =>
  v === "comprehensive" ? "Thorough. Include examples, edge cases, and rationale."
  : v === "standard" ? "Moderate depth. Explain decisions briefly."
  : "Lean. Code/answer first, minimal prose.";

function buildAIStudioInstructions(p) {
  const f = flags(p);
  const styleRule = p.style.tone === "direct"
    ? "Terse. TL;DR in 1-2 sentences first. No motivational filler."
    : p.style.tone === "balanced"
    ? "Clear and structured. Moderate explanation depth."
    : "Thorough. Step-by-step with examples.";
  return `# ROLE & CONTEXT
You are ${p.identity.role || "an AI assistant"}${p.identity.company ? ` at ${p.identity.company}` : ""}${p.identity.industry ? ` in the ${p.identity.industry} sector` : ""}.
User expertise level: ${p.identity.expertise_level}.

# PRIMARY GOAL
${p.use_case.goal || "[Define primary goal]"}

# OUTPUT TYPES NEEDED
${p.use_case.outputs.length ? p.use_case.outputs.join(" · ") : "[Define output types]"}

# TOOLS & INTEGRATIONS
${p.integrations.tools.length ? p.integrations.tools.join(", ") : "[Define tools and APIs]"}

# MANDATORY BEHAVIORS
1. ${styleRule}
2. Verbosity: ${verbosityLine(p.style.verbosity)}
3. Production-ready output only — no placeholders, no TODOs, no empty stubs
4. Flag all assumptions explicitly — never invent precision
5. Respond ONLY with valid JSON matching the provided schema — no preamble
6. All TypeScript must be fully typed — no \`any\`
7. Every catch block must have: cause (what), fix (how), retryable (bool)${f.hasPII ? "\n8. Mask all PII in outputs: emails → e***@domain, phones → (***) ***-XXXX" : ""}${f.serverOnly ? "\n9. Never generate code that calls external APIs from the browser/client" : ""}${f.tokenLean ? "\n10. Minimize output length — deliver code directly" : ""}

# WHAT YOU NEVER DO
- Hardcode API keys, tokens, or rate limit numbers
- Use \`any\` in TypeScript output
- Trust client-provided user IDs — always use auth.uid() server-side${f.serverOnly ? "\n- Generate client-side fetch to external APIs" : ""}${f.noTraining ? "\n- Process sensitive data without Temporary Chat enabled" : ""}

# OUTPUT FORMAT
Return valid JSON matching the schema provided via Structured Output.
No markdown fences. No explanatory text outside the JSON object.`;
}

function buildClaudeInstructions(p) {
  const f = flags(p);
  return `<context>
  <identity>
    <name>${p.identity.name || "User"}</name>
    <role>${p.identity.role || "Not specified"}</role>${p.identity.company ? `\n    <company>${p.identity.company}</company>` : ""}${p.identity.industry ? `\n    <industry>${p.identity.industry}</industry>` : ""}
    <expertise>${p.identity.expertise_level}</expertise>
  </identity>

  <primary_goal>${p.use_case.goal || "Not yet defined"}</primary_goal>
  <outputs_needed>${p.use_case.outputs.join(", ") || "Not yet defined"}</outputs_needed>
  <integrations>${p.integrations.tools.join(", ") || "None specified"}</integrations>

  <constraints>
    <pii_sensitivity>${f.hasPII ? "HIGH — mask all PII in every output" : "standard"}</pii_sensitivity>${f.serverOnly ? "\n    <execution>server-side only — never client-side API calls</execution>" : ""}${f.tokenLean ? "\n    <token_budget>lean — code only, omit prose</token_budget>" : ""}
  </constraints>

  <style>
    <tone>${p.style.tone}</tone>
    <verbosity>${p.style.verbosity}</verbosity>
    <format>TL;DR first (1-2 sentences) on all substantive responses</format>
  </style>
</context>

<operating_rules>
  <rule>TL;DR first — 1-2 sentences max, then supporting detail</rule>
  <rule>End deliverables with CLAIMS / GAPS footers — tag each [SOURCED] or [GENERATED]</rule>
  <rule>Production-ready output only — no placeholders, no TODO stubs</rule>
  <rule>Direct pushback when wrong — no sycophancy, no motivational filler</rule>
  <rule>Terse commands ("patch", "build", "continue") = execute without re-explanation</rule>
  <rule>Never invent precision — "I cannot verify this" beats a confident guess</rule>${f.hasPII ? '\n  <rule>Mask all PII before rendering — emails, phones, names</rule>' : ""}
</operating_rules>`;
}

function buildBase44Instructions(p) {
  const f = flags(p);
  return `# B44 APP CONTEXT
Application goal: ${p.use_case.goal || "[Define the app]"}
Industry: ${p.identity.industry || "[Industry]"}
Primary user role: ${p.identity.role || "[Role]"}
Expertise level: ${p.identity.expertise_level}

# ENTITY MODEL
${p.integrations.tools.length
  ? `Entities to scaffold from connected tools:\n${p.integrations.tools.map(t => `- ${t.replace(/\s/g,"").replace(/\//g,"")}Entity`).join("\n")}`
  : "# Define core entities here before building any views"}

# ARCHITECTURE RULES
1. Schema first — define all entities before views, forms, or workflows
2. Use ClientOrganization + EmployeeProfile for any B2B multi-tenant requirement
3. RLS policy: user_id = auth.uid() on every user-owned entity
4. Verify app IDs before wiring to n8n — stale subdomains fail silently
5. Deprecated apps with 0 schemas are empty shells — scaffold from scratch${f.hasPII ? "\n6. PII HIGH: field-level masking required on sensitive columns" : ""}

# STYLE
Tone: ${p.style.tone} · Verbosity: ${p.style.verbosity} · Format: schema-first, then views, then workflows`;
}

function buildLovableInstructions(p) {
  return `# LOVABLE APP CONTEXT
Building: ${p.use_case.goal || "[Describe the app]"}
Industry: ${p.identity.industry || "[Industry]"}
End user: ${p.identity.role || "[Role]"}

# PROMPT STYLE FOR THIS PROJECT
- Describe end-user outcomes, not implementation details
- Specify layout spatially: "left sidebar", "metric card grid", "full-width table"
- Data: use Supabase integration — don't describe schema in prompt
- Iterations: accept/reject in full, then describe the next change
- Verbosity: ${verbosityLine(p.style.verbosity)}

# INTEGRATIONS
${p.integrations.tools.length ? p.integrations.tools.join(", ") : "Supabase (auth + database)"}

# OUTPUTS NEEDED
${p.use_case.outputs.join(" · ") || "[Define outputs]"}`;
}

function buildV0Instructions(p) {
  return `# v0 COMPONENT CONTEXT
Building for: ${p.use_case.goal || "[Describe what you're building]"}
Industry: ${p.identity.industry || "[Industry]"}
User: ${p.identity.role || "[Role]"}

# PROMPTING RULES FOR THIS PROJECT
- Describe layout spatially: grid columns, card positions, sections
- Request dark mode explicitly (default is light)
- One component or page per prompt — don't ask for full apps
- Paste screenshots to reverse-engineer existing UI

# COMPONENT TYPES NEEDED
${p.use_case.outputs.join(" · ") || "[Define component types]"}

# TOOLS TO DISPLAY
${p.integrations.tools.length ? p.integrations.tools.join(", ") : "[Define data sources]"}`;
}

function buildGeminiEcosystem(p) {
  const f = flags(p);
  return `# GEM INSTRUCTIONS — ${p.identity.company || p.identity.name || "Custom Gem"}
You are ${p.identity.role || "an assistant"}${p.identity.industry ? ` for the ${p.identity.industry} sector` : ""}.

# PURPOSE
${p.use_case.goal || "[Define what this Gem does]"}

# OUTPUTS
${p.use_case.outputs.join(" · ") || "[Define outputs]"}

# BEHAVIOR
- ${p.style.tone === "direct" ? "Terse, TL;DR first, no filler." : p.style.tone === "balanced" ? "Clear, structured, moderate depth." : "Thorough, step-by-step with examples."}
- Verbosity: ${verbosityLine(p.style.verbosity)}
- When you need my own data, ask me to @-mention the relevant Doc, Sheet, or Gmail thread.
- Flag assumptions; never invent precision.${f.hasPII ? "\n- Mask PII in any output (emails, phones, names)." : ""}

# GROUNDING
Tools available: ${p.integrations.tools.join(", ") || "Workspace (Docs, Gmail, Drive)"}.
Use Deep Research for multi-source synthesis; Canvas for iterative doc/code editing.

# NOTE
Gems persist as reusable bots but don't enforce JSON schemas — for strict structured
output, use Google AI Studio or the Gemini API instead.`;
}

function buildOpenAIInstructions(p) {
  const f = flags(p);
  return `# SYSTEM / GPT INSTRUCTIONS — ${p.identity.company || p.identity.name || "Custom GPT"}
You are ${p.identity.role || "an assistant"}${p.identity.company ? ` at ${p.identity.company}` : ""}${p.identity.industry ? ` in the ${p.identity.industry} sector` : ""}.
User expertise: ${p.identity.expertise_level}.

# PURPOSE
${p.use_case.goal || "[Define purpose]"}

# OUTPUTS
${p.use_case.outputs.join(" · ") || "[Define outputs]"}

# TOOLS / ACTIONS
${p.integrations.tools.length ? p.integrations.tools.join(", ") : "[Define connected tools]"}

# BEHAVIOR
1. ${p.style.tone === "direct" ? "Terse, TL;DR first, no filler." : p.style.tone === "balanced" ? "Clear, structured, moderate depth." : "Thorough, step-by-step with examples."}
2. Verbosity: ${verbosityLine(p.style.verbosity)}
3. Production-ready output only — no placeholders or TODO stubs.
4. Flag assumptions; never invent precision.${f.hasPII ? "\n5. Mask all PII in outputs (emails, phones, names)." : ""}${f.serverOnly ? "\n6. Never emit client-side calls to external APIs with secrets." : ""}

# STRUCTURED OUTPUT
For machine-readable output, use response_format json_schema (Structured Outputs)
rather than asking for JSON in prose. Custom GPT instructions cap ~8k chars —
move long reference material into a knowledge file.

# WHAT YOU NEVER DO
- Hardcode API keys or tokens
- Use \`any\` in TypeScript output
- Trust client-provided user IDs — use server-side auth`;
}

// Social platforms get a content + API brief, not LLM system instructions.
function buildSocialBrief(name, p) {
  const meta = PLATFORM_KNOWLEDGE[name];
  const cs = (meta && meta.contentSpec) || {};
  const f = flags(p);
  const automation = p.integrations.tools.filter(t => /Zapier|n8n|Make|Buffer|Hootsuite|Sprout/i.test(t));
  const voice = p.style.tone === "direct" ? "Direct, punchy, hook-first. No fluff."
    : p.style.tone === "balanced" ? "Clear, approachable, professional."
    : "Narrative, context-rich, detailed.";
  return `# ${name} — CONTENT & API BRIEF
Account / brand: ${p.identity.company || p.identity.name || "[Brand]"}
Industry: ${p.identity.industry || "[Industry]"}
Goal: ${p.use_case.goal || "[Define content goal]"}

# VOICE
${voice}
Verbosity: ${verbosityLine(p.style.verbosity)}

# FORMAT RULES
${(cs.formats || []).map(x => `- ${x}`).join("\n") || "- [Define formats]"}

# ALGORITHM & CADENCE
${(cs.algo || []).map(x => `- ${x}`).join("\n") || "- [Define cadence]"}

# API / AUTOMATION
${automation.length
  ? `Automate via: ${automation.join(", ")}. Use the official ${name} API only — never scrape.`
  : `Manual posting, or add Zapier / n8n / Make to automate. Official API only — scraping risks a ban.`}
${cs.apiNote ? cs.apiNote : ""}${f.hasPII ? "\n\n# PII\nMask customer names/handles in reposted content. Get consent before featuring user data." : ""}

# DO NOT
- Hardcode access tokens client-side — server-side only
- Violate platform content policy or automation ToS
- Buy engagement or use unofficial scrapers (ban risk)`;
}

// ─── PROFILE DATA MODEL ───
const makeProfile = (type) => ({
  id: `${type}_${Date.now()}`,
  type,
  meta: { name:"", createdAt:new Date().toISOString(), inheritedFrom:null },
  identity: { name:"", role:"", company:"", industry:"", expertise_level:"intermediate" },
  platform: { targets:[] },
  use_case: { goal:"", outputs:[] },
  integrations: { tools:[] },
  constraints: { flags:[] },
  style: { tone:"direct", verbosity:"concise" },
  examples: { good:"" },
});

// ─── INTERVIEW QUESTIONS ───
const ALL_QUESTIONS = [
  { id:"profile_name", bucket:"Profile",      q:"What's the name for this profile?",                 sub:'E.g. "Kyle Master" / "Iron Horse Client"', type:"text",  field:"meta.name",            placeholder:"Profile name...",                req:true,  clientOk:true  },
  { id:"name",         bucket:"Identity",     q:"Your name?",                                        type:"text",  field:"identity.name",            placeholder:"Name...",                        req:true,  clientOk:true  },
  { id:"role",         bucket:"Identity",     q:"Role or job title?",                                type:"text",  field:"identity.role",            placeholder:"AI Consultant / CTO / Founder…", req:true,  clientOk:true  },
  { id:"company",      bucket:"Identity",     q:"Company or organization?",                          type:"text",  field:"identity.company",         placeholder:'Company name or "Personal"…',    req:false, clientOk:true  },
  { id:"industry",     bucket:"Identity",     q:"Industry or vertical?",                             type:"select",field:"identity.industry",        opts:["Real Estate","Custom Furniture / Manufacturing","IT / Managed Services","Education / Training","Restaurant / Hospitality","Retail / E-commerce","Healthcare","Finance / Fintech","Construction","Marketing / Agency","SaaS / Software","Other"], specifyOn:"Other", req:true, clientOk:true },
  { id:"expertise",    bucket:"Identity",     q:"AI expertise level?",                               type:"radio", field:"identity.expertise_level", opts:[{v:"beginner",l:"Beginner",d:"New to AI tools, needs guidance"},{v:"intermediate",l:"Intermediate",d:"Uses AI regularly, familiar with prompting"},{v:"advanced",l:"Advanced",d:"Builds with AI APIs, deep prompt engineering"}], req:true, clientOk:true },
  { id:"platforms",    bucket:"Platform",     q:"Which platforms to configure?",                     type:"multi", field:"platform.targets",         opts:Object.keys(PLATFORM_KNOWLEDGE), req:true, clientOk:true },
  { id:"goal",         bucket:"Use Case",     q:"One sentence: what are you trying to accomplish?",  sub:'E.g. "Generate dashboard connectors from API specs"', type:"text", field:"use_case.goal", placeholder:"Primary goal…", req:true, clientOk:true },
  { id:"outputs",      bucket:"Use Case",     q:"What output types do you need most?",               type:"multi", field:"use_case.outputs",         opts:["Code / Components","Dashboard / UI","Content / Copy","Analysis / Reports","Workflows / Automations","Training Materials","Data Processing","API Integrations"], req:true, clientOk:true },
  { id:"tools",        bucket:"Integrations", q:"Which tools or APIs are in play?",                  type:"multi", field:"integrations.tools",       opts:["HubSpot","Freshdesk","Notion","GitHub","Zapier","n8n","Supabase","Slack","Google Workspace","Claude API","Gemini API","OpenAI API","Stripe","PostHog"], req:false, clientOk:true, allowCustom:true },
  { id:"constraints",  bucket:"Constraints",  q:"Any constraints to enforce?",                       type:"multi", field:"constraints.flags",        opts:["High PII sensitivity","HIPAA compliance","No client-side API calls","Server-side only","No model training on inputs","Minimize token usage","Enterprise security policies"], req:false, clientOk:true },
  { id:"tone",         bucket:"Style",        q:"How should the AI communicate?",                    type:"radio", field:"style.tone",               opts:[{v:"direct",l:"Direct",d:"Terse, TL;DR first, pushback expected"},{v:"balanced",l:"Balanced",d:"Clear and structured, moderate depth"},{v:"detailed",l:"Detailed",d:"Thorough, step-by-step, examples included"}], req:true, clientOk:false },
  { id:"verbosity",    bucket:"Style",        q:"Default output length?",                            type:"radio", field:"style.verbosity",          opts:[{v:"concise",l:"Concise",d:"Answer/code first, minimal prose"},{v:"standard",l:"Standard",d:"Moderate depth, brief rationale"},{v:"comprehensive",l:"Comprehensive",d:"Full detail, examples, edge cases"}], req:true, clientOk:false },
  { id:"examples",     bucket:"Examples",     q:"Optional: describe an example of great output.",   sub:"Skip if you have nothing handy.", type:"textarea", field:"examples.good", placeholder:"Describe what great output looks like…", req:false, clientOk:false },
];

// ─── UTILITIES ───
function deepSet(obj, path, value) {
  const keys = path.split(".");
  const out = { ...obj };
  let cur = out;
  for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = { ...cur[keys[i]] }; cur = cur[keys[i]]; }
  cur[keys[keys.length - 1]] = value;
  return out;
}
const deepGet = (obj, path) => path.split(".").reduce((a, k) => a?.[k], obj);

// ─── STYLE HELPERS ───
const S = {
  wrap:  { background:C.bg1, minHeight:"100vh", fontFamily:"'Geist',system-ui,sans-serif", color:C.t1 },
  inner: { maxWidth:860, margin:"0 auto", padding:"2rem 1.5rem" },
  card:  (hi=false) => ({ background:C.bg2, border:`1px solid ${hi?C.borderHi:C.border}`, borderRadius:12, padding:"1.5rem" }),
  tag:   { display:"inline-block", fontFamily:"monospace", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.12em", color:C.v, background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", padding:"0.2rem 0.75rem", borderRadius:100 },
  h1:    { fontSize:"2rem", fontWeight:600, letterSpacing:"-0.02em", background:`linear-gradient(135deg,${C.v},${C.m},${C.cy})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:"0.6rem 0 0.25rem 0" },
  sub:   { color:C.t3, fontSize:"0.875rem", marginBottom:"2rem" },
  inp:   { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:"0.75rem 1rem", color:C.t1, fontSize:"0.9rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btnPri:{ background:C.v, color:"#fff", border:"none", padding:"0.7rem 1.75rem", borderRadius:100, cursor:"pointer", fontSize:"0.875rem", fontWeight:600, fontFamily:"inherit" },
  btn:   (color=C.v) => ({ background:"rgba(168,85,247,0.1)", color, border:"1px solid rgba(168,85,247,0.3)", padding:"0.55rem 1.25rem", borderRadius:100, cursor:"pointer", fontSize:"0.8rem", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em" }),
  code:  { background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, padding:"1.25rem", fontFamily:"monospace", fontSize:"0.8rem", lineHeight:1.65, color:C.t2, whiteSpace:"pre-wrap", overflowX:"auto", maxHeight:280, overflowY:"auto" },
  label: { fontSize:"0.7rem", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em", color:C.t3, display:"block", marginBottom:"0.35rem" },
};

// Focus ring + reduced motion (inline styles can't do pseudo-classes)
const GLOBAL_CSS = `
  .mpc button:focus-visible, .mpc input:focus-visible,
  .mpc select:focus-visible, .mpc textarea:focus-visible {
    outline: 2px solid ${C.cy}; outline-offset: 2px; border-radius: 8px;
  }
  .mpc *:focus { outline: none; }
  @media (prefers-reduced-motion: reduce) {
    .mpc * { transition: none !important; animation: none !important; }
  }
`;

// ─── HOISTED CONTROLLED INPUT (fixes remount bug) ───
function QuestionInput({ q, value, setValue, customTool, setCustomTool, onSubmit, onSkip }) {
  const inputId = `q-${q.id}`;
  const multiEmpty = q.type === "multi" && q.req && (!Array.isArray(value) || value.length === 0);

  if (q.type === "text") return (
    <div>
      <label htmlFor={inputId} style={S.label}>{q.bucket}</label>
      <input id={inputId} style={S.inp} value={value} autoFocus
        aria-required={q.req} placeholder={q.placeholder}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && value.trim()) onSubmit(value.trim()); }} />
      <div style={{ display:"flex", gap:"0.75rem", marginTop:"1rem" }}>
        <button style={{...S.btnPri, opacity:value.trim()?1:0.4, cursor:value.trim()?"pointer":"not-allowed"}}
          disabled={!value.trim()} onClick={() => value.trim() && onSubmit(value.trim())}>Continue →</button>
        {!q.req && <button style={S.btn(C.t3)} onClick={onSkip}>Skip</button>}
      </div>
    </div>
  );

  if (q.type === "textarea") return (
    <div>
      <label htmlFor={inputId} style={S.label}>{q.bucket}</label>
      <textarea id={inputId} style={{...S.inp, minHeight:90, resize:"vertical"}} value={value}
        placeholder={q.placeholder} onChange={e => setValue(e.target.value)} />
      <div style={{ display:"flex", gap:"0.75rem", marginTop:"1rem" }}>
        <button style={S.btnPri} onClick={() => onSubmit(value)}>Continue →</button>
        <button style={S.btn(C.t3)} onClick={onSkip}>Skip</button>
      </div>
    </div>
  );

  if (q.type === "select") {
    const base = typeof value === "string" ? value : "";
    const isSpecify = q.specifyOn && base.startsWith(q.specifyOn);
    const specifyVal = isSpecify ? base.replace(`${q.specifyOn}: `, "").replace(q.specifyOn, "") : "";
    const selectVal = isSpecify ? q.specifyOn : base;
    return (
      <div>
        <label htmlFor={inputId} style={S.label}>{q.bucket}</label>
        <select id={inputId} style={{...S.inp, cursor:"pointer"}} value={selectVal} aria-required={q.req}
          onChange={e => { const v = e.target.value; setValue(v === q.specifyOn ? `${q.specifyOn}: ` : v); }}>
          <option value="">Select…</option>
          {q.opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {isSpecify && (
          <input style={{...S.inp, marginTop:"0.75rem"}} value={specifyVal} autoFocus
            placeholder="Specify your industry…"
            onChange={e => setValue(`${q.specifyOn}: ${e.target.value}`)} />
        )}
        <div style={{ marginTop:"1rem" }}>
          <button style={{...S.btnPri, opacity:selectVal?1:0.4, cursor:selectVal?"pointer":"not-allowed"}}
            disabled={!selectVal} onClick={() => onSubmit(value)}>Continue →</button>
        </div>
      </div>
    );
  }

  if (q.type === "radio") return (
    <div role="radiogroup" aria-label={q.q} style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {q.opts.map(o => {
        const on = value === o.v;
        return (
          <button key={o.v} role="radio" aria-checked={on} onClick={() => onSubmit(o.v)}
            style={{ background:on?"rgba(168,85,247,0.13)":C.bg3, border:`1px solid ${on?C.v:C.border}`, borderRadius:8, padding:"0.8rem 1rem", cursor:"pointer", textAlign:"left" }}>
            <div style={{ color:on?C.v:C.t1, fontWeight:600, fontSize:"0.875rem" }}>{o.l}</div>
            <div style={{ color:C.t3, fontSize:"0.78rem", marginTop:"0.15rem" }}>{o.d}</div>
          </button>
        );
      })}
    </div>
  );

  if (q.type === "multi") return (
    <div>
      <div role="group" aria-label={q.q} style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem", marginBottom:"1rem" }}>
        {q.opts.map(o => {
          const on = Array.isArray(value) && value.includes(o);
          return (
            <button key={o} aria-pressed={on}
              onClick={() => setValue(on ? value.filter(x => x !== o) : [...(value||[]), o])}
              style={{ background:on?"rgba(168,85,247,0.13)":C.bg3, border:`1px solid ${on?C.v:C.border}`, borderRadius:100, padding:"0.38rem 0.85rem", cursor:"pointer", fontSize:"0.8rem", color:on?C.v:C.t2 }}>
              {on ? "✓ " : ""}{o}
            </button>
          );
        })}
      </div>
      {q.allowCustom && (
        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
          <label htmlFor={`${inputId}-custom`} style={{ position:"absolute", left:-9999 }}>Add custom tool</label>
          <input id={`${inputId}-custom`} style={{...S.inp, flex:1}} value={customTool} placeholder="Add custom tool…"
            onChange={e => setCustomTool(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && customTool.trim()) { setValue([...(value||[]), customTool.trim()]); setCustomTool(""); } }} />
          <button style={S.btn()} onClick={() => { if (customTool.trim()) { setValue([...(value||[]), customTool.trim()]); setCustomTool(""); } }}>+ Add</button>
        </div>
      )}
      <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
        <button style={{...S.btnPri, opacity:multiEmpty?0.4:1, cursor:multiEmpty?"not-allowed":"pointer"}}
          disabled={multiEmpty} onClick={() => !multiEmpty && onSubmit(value||[])}>Continue →</button>
        {!q.req && <button style={S.btn(C.t3)} onClick={onSkip}>Skip</button>}
        {multiEmpty && <span style={{ color:C.warn, fontSize:"0.78rem" }}>Pick at least one</span>}
      </div>
    </div>
  );

  return null;
}

// ─── MAIN ───
export default function ProfileCreator() {
  const [phase,       setPhase]       = useState("type");
  const [profileType, setProfileType] = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [qIndex,      setQIndex]      = useState(0);
  const [profile,     setProfile]     = useState(null);
  const [draftValue,  setDraftValue]  = useState("");
  const [customTool,  setCustomTool]  = useState("");
  const [activeTab,   setActiveTab]   = useState(null);
  const [copied,      setCopied]      = useState({});
  const [library,     setLibrary]     = useState([]);
  const [resumable,   setResumable]   = useState(null);
  const [showLoad,    setShowLoad]    = useState(false);
  const [importText,  setImportText]  = useState("");
  const [importErr,   setImportErr]   = useState("");
  const [inheritFrom, setInheritFrom] = useState(null);
  const bottomRef = useRef(null);

  const qsFor = (type) => type === "master" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.clientOk);

  // Load library + draft on mount
  useEffect(() => {
    (async () => {
      const keys = await store.list(LIB_PREFIX);
      const loaded = [];
      for (const k of keys) { const v = await store.get(k); if (v) loaded.push(v); }
      setLibrary(loaded);
      const draft = await store.get(DRAFT_KEY);
      if (draft?.profile && draft?.profileType) setResumable(draft);
    })();
  }, []);

  // Auto-save draft during interview
  useEffect(() => {
    if (phase === "interview" && profile) store.set(DRAFT_KEY, { profileType, profile, qIndex });
  }, [phase, profile, qIndex, profileType]);

  // Reset transient input when question changes
  useEffect(() => {
    if (phase === "interview" && questions[qIndex]) {
      const existing = deepGet(profile, questions[qIndex].field);
      setDraftValue(existing ?? (questions[qIndex].type === "multi" ? [] : ""));
      setCustomTool("");
    }
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [qIndex, phase]); // eslint-disable-line

  const startInterview = useCallback((type, master = null) => {
    const qs = qsFor(type);
    let p = makeProfile(type);
    if (type === "client" && master) {
      p = { ...p,
        platform:    { targets:[...master.platform.targets] },
        constraints: { flags:[...master.constraints.flags] },
        style:       { ...master.style },
        examples:    { ...master.examples },
        meta:        { ...p.meta, inheritedFrom: master.meta.name },
      };
    }
    setProfileType(type); setQuestions(qs); setProfile(p);
    setQIndex(0); setInheritFrom(null); setShowLoad(false); setPhase("interview");
  }, []);

  function advance(updated) {
    if (qIndex < questions.length - 1) { setProfile(updated); setQIndex(qIndex + 1); }
    else {
      const first = updated.platform.targets[0];
      setActiveTab(first ? PLATFORM_KNOWLEDGE[first]?.key : "ai_studio");
      setProfile(updated); setPhase("review");
    }
  }
  const submit = (val) => advance(deepSet(profile, questions[qIndex].field, val));
  const skip = () => advance(profile);

  async function finalizeToKit() {
    await store.set(`${LIB_PREFIX}${profile.id}`, profile);
    await store.del(DRAFT_KEY);
    setLibrary(lib => [...lib.filter(p => p.id !== profile.id), profile]);
    setPhase("kit");
  }

  function openProfile(p) {
    setProfile(p); setProfileType(p.type); setQuestions(qsFor(p.type));
    const first = p.platform.targets[0];
    setActiveTab(first ? PLATFORM_KNOWLEDGE[first]?.key : "ai_studio");
    setShowLoad(false); setPhase("review");
  }

  function importJSON() {
    setImportErr("");
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.identity || !parsed.platform) throw new Error("Not a valid profile JSON");
      if (!parsed.id) parsed.id = `${parsed.type || "imported"}_${Date.now()}`;
      openProfile(parsed);
    } catch (e) { setImportErr(e.message || "Invalid JSON"); }
  }

  function copyText(key, text) {
    navigator.clipboard.writeText(text);
    setCopied(c => ({ ...c, [key]:true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]:false })), 2000);
  }

  const masters = library.filter(p => p.type === "master");

  // ═══ PHASE: TYPE ═══
  if (phase === "type") return (
    <div className="mpc" style={S.wrap}>
      <style>{GLOBAL_CSS}</style>
      <div style={S.inner}>
        <div style={S.tag}>Meta Template · Profile Creator</div>
        <h1 style={S.h1}>Platform Setup Generator</h1>
        <p style={S.sub}>Answer once. Get a ready-to-paste setup kit for AI Studio, Claude, Base44, and more.</p>

        {resumable && (
          <div style={{ ...S.card(true), marginBottom:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ color:C.cy, fontFamily:"monospace", fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Draft found</div>
              <div style={{ fontSize:"0.9rem", marginTop:"0.2rem" }}>
                Resume <strong>{resumable.profile.meta.name || `${resumable.profileType} profile`}</strong> — question {resumable.qIndex + 1} of {qsFor(resumable.profileType).length}
              </div>
            </div>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button style={S.btnPri} onClick={() => {
                setProfileType(resumable.profileType); setQuestions(qsFor(resumable.profileType));
                setProfile(resumable.profile); setQIndex(resumable.qIndex); setResumable(null); setPhase("interview");
              }}>Resume</button>
              <button style={S.btn(C.t3)} onClick={async () => { await store.del(DRAFT_KEY); setResumable(null); }}>Discard</button>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {[
            { type:"master", icon:"🧠", title:"Master Profile", badge:"all buckets", desc:"Full context: identity, platforms, use cases, integrations, constraints, style, examples. The foundation client profiles inherit from.", color:C.v },
            { type:"client", icon:"🏢", title:"Client Profile",  badge:"inherits master", desc:"Lightweight intake for a specific client. Optionally inherits style, constraints, and platform defaults from a saved master.", color:C.cy },
          ].map(o => (
            <button key={o.type} onClick={() => {
              if (o.type === "client" && masters.length) setInheritFrom("ASK");
              else startInterview(o.type);
            }} style={{ ...S.card(), cursor:"pointer", textAlign:"left" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                <span style={{ fontSize:"2rem" }}>{o.icon}</span>
                <span style={{ fontFamily:"monospace", fontSize:"0.7rem", color:o.color, background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.2)", padding:"0.15rem 0.6rem", borderRadius:100 }}>{o.badge}</span>
              </div>
              <div style={{ fontWeight:600, fontSize:"1.05rem", color:o.color, marginBottom:"0.4rem" }}>{o.title}</div>
              <div style={{ color:C.t3, fontSize:"0.82rem", lineHeight:1.55 }}>{o.desc}</div>
            </button>
          ))}
        </div>

        {inheritFrom === "ASK" && (
          <div style={{ ...S.card(true), marginTop:"1.5rem" }}>
            <div style={{ color:C.cy, fontFamily:"monospace", fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.75rem" }}>Inherit from a master?</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
              {masters.map(mp => (
                <button key={mp.id} style={S.btn(C.cy)} onClick={() => startInterview("client", mp)}>🧠 {mp.meta.name || mp.id}</button>
              ))}
              <button style={S.btn(C.t3)} onClick={() => startInterview("client")}>Start blank</button>
            </div>
          </div>
        )}

        <div style={{ marginTop:"1.5rem" }}>
          <button style={S.btn(C.t3)} onClick={() => setShowLoad(s => !s)}>
            {showLoad ? "▲ Hide saved profiles" : `▾ Load saved profile (${library.length})`}
          </button>
          {showLoad && (
            <div style={{ ...S.card(), marginTop:"1rem" }}>
              {library.length === 0 && <div style={{ color:C.t3, fontSize:"0.85rem", marginBottom:"1rem" }}>No saved profiles yet.</div>}
              {library.map(p => (
                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.5rem 0", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontSize:"0.88rem" }}>{p.type === "master" ? "🧠" : "🏢"} {p.meta.name || p.id}</span>
                    <span style={{ color:C.t3, fontSize:"0.75rem", marginLeft:"0.5rem" }}>{p.identity.industry || "—"}</span>
                  </div>
                  <div style={{ display:"flex", gap:"0.4rem" }}>
                    <button style={S.btn()} onClick={() => openProfile(p)}>Open</button>
                    {p.type === "master" && <button style={S.btn(C.cy)} onClick={() => startInterview("client", p)}>Clone → Client</button>}
                  </div>
                </div>
              ))}
              <div style={{ marginTop:"1rem" }}>
                <label htmlFor="import-json" style={S.label}>Paste profile JSON</label>
                <textarea id="import-json" style={{...S.inp, minHeight:70, resize:"vertical", fontFamily:"monospace", fontSize:"0.75rem"}}
                  value={importText} placeholder='{"type":"master","identity":{...}}' onChange={e => setImportText(e.target.value)} />
                {importErr && <div style={{ color:C.err, fontSize:"0.78rem", marginTop:"0.4rem" }}>{importErr}</div>}
                <button style={{...S.btn(), marginTop:"0.5rem", opacity:importText.trim()?1:0.4}} disabled={!importText.trim()} onClick={importJSON}>Import JSON</button>
              </div>
            </div>
          )}
        </div>

        {!hasStore && (
          <div style={{ marginTop:"1.5rem", padding:"0.75rem 1rem", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:8, color:C.t2, fontSize:"0.8rem" }}>
            ⚠ Persistent storage unavailable here — profiles kept in memory only and clear on reload.
          </div>
        )}
        <div style={{ marginTop:"1.25rem", padding:"0.75rem 1rem", background:"rgba(34,211,238,0.05)", border:`1px solid ${C.border}`, borderRadius:8, color:C.t3, fontSize:"0.78rem" }}>
          🔒 Everything stays local to your browser. Nothing is sent to any server.
        </div>
      </div>
    </div>
  );

  // ═══ PHASE: INTERVIEW ═══
  if (phase === "interview") {
    const q = questions[qIndex];
    const prev = questions.slice(0, qIndex);
    const pct = Math.round((qIndex / questions.length) * 100);
    return (
      <div className="mpc" style={S.wrap}>
        <style>{GLOBAL_CSS}</style>
        <div style={S.inner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <div style={S.tag}>{profileType === "master" ? "🧠 Master" : "🏢 Client"} Profile{profile.meta.inheritedFrom ? ` · inherits ${profile.meta.inheritedFrom}` : ""}</div>
            <span style={{ color:C.t3, fontFamily:"monospace", fontSize:"0.78rem" }}>{qIndex + 1} / {questions.length}</span>
          </div>
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Interview progress"
            style={{ height:3, background:C.bg3, borderRadius:99, marginBottom:"2rem" }}>
            <div style={{ height:3, width:`${pct}%`, background:`linear-gradient(90deg,${C.v},${C.m})`, borderRadius:99, transition:"width 0.25s" }} />
          </div>

          <div role="log" style={{ marginBottom:"1.25rem" }}>
            {prev.map(pq => {
              const ans = deepGet(profile, pq.field);
              const disp = Array.isArray(ans) ? (ans.join(", ") || "—") : (ans || "—");
              return (
                <div key={pq.id} style={{ marginBottom:"0.875rem", opacity:0.75 }}>
                  <div style={{ color:C.t3, fontSize:"0.72rem", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.2rem" }}>{pq.bucket}</div>
                  <div style={{ color:C.t3, fontSize:"0.82rem", marginBottom:"0.25rem" }}>{pq.q}</div>
                  <span style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, padding:"0.35rem 0.75rem", color:disp === "—" ? C.t3 : C.t1, fontSize:"0.82rem", display:"inline-block" }}>{disp}</span>
                </div>
              );
            })}
          </div>

          <div style={S.card(true)}>
            <div style={{ fontSize:"1.1rem", fontWeight:600, marginBottom:q.sub ? "0.3rem" : "1.1rem" }}>{q.q}</div>
            {q.sub && <div style={{ color:C.t3, fontSize:"0.8rem", marginBottom:"1.1rem" }}>{q.sub}</div>}
            <QuestionInput q={q} value={draftValue} setValue={setDraftValue}
              customTool={customTool} setCustomTool={setCustomTool} onSubmit={submit} onSkip={skip} />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    );
  }

  // ═══ PHASE: REVIEW ═══
  if (phase === "review") {
    const askedBuckets = new Set(questions.map(x => x.bucket));
    const inherited = !!profile.meta.inheritedFrom;
    const allBuckets = [
      { label:"Identity",     always:true,  rows:[["Name",profile.identity.name],["Role",profile.identity.role],["Company",profile.identity.company],["Industry",profile.identity.industry],["Expertise",profile.identity.expertise_level]] },
      { label:"Platform",     always:true,  rows:[["Targets",profile.platform.targets.join(", ")||"—"]] },
      { label:"Use Case",     always:true,  rows:[["Goal",profile.use_case.goal],["Outputs",profile.use_case.outputs.join(", ")||"—"]] },
      { label:"Integrations", always:true,  rows:[["Tools",profile.integrations.tools.join(", ")||"—"]] },
      { label:"Constraints",  always:false, rows:[["Flags",profile.constraints.flags.join(", ")||"None"]] },
      { label:"Style",        always:false, rows:[["Tone",profile.style.tone],["Verbosity",profile.style.verbosity]] },
      { label:"Examples",     always:false, rows:[["Good sample",profile.examples.good?"✓ Provided":"—"]] },
    ];
    const buckets = allBuckets.filter(b => b.always || askedBuckets.has(b.label) || inherited);
    return (
      <div className="mpc" style={S.wrap}>
        <style>{GLOBAL_CSS}</style>
        <div style={S.inner}>
          <div style={S.tag}>Review Profile</div>
          <h1 style={S.h1}>{profile.meta.name || "Unnamed Profile"}</h1>
          <p style={S.sub}>
            {profile.type === "master" ? "🧠 Master" : "🏢 Client"}{inherited ? ` · inherits from ${profile.meta.inheritedFrom}` : ""} · Verify before generating.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
            {buckets.map(b => {
              const isInheritedBucket = inherited && !b.always && !askedBuckets.has(b.label);
              return (
                <div key={b.label} style={S.card()}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.6rem" }}>
                    <span style={{ color:C.v, fontFamily:"monospace", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>{b.label}</span>
                    {isInheritedBucket && <span style={{ color:C.cy, fontSize:"0.62rem", fontFamily:"monospace" }}>INHERITED</span>}
                  </div>
                  {b.rows.map(([k,v]) => (
                    <div key={k} style={{ marginBottom:"0.45rem" }}>
                      <div style={{ color:C.t3, fontSize:"0.72rem" }}>{k}</div>
                      <div style={{ color:v ? "#fff" : C.t3, fontSize:"0.85rem", wordBreak:"break-word" }}>{v || "—"}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button style={S.btnPri} onClick={finalizeToKit}>Generate Setup Kit →</button>
            <button style={S.btn(C.t3)} onClick={() => { setQIndex(0); setPhase("interview"); }}>← Redo Interview</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ PHASE: KIT ═══
  if (phase === "kit") {
    const targets = profile.platform.targets.map(t => PLATFORM_KNOWLEDGE[t]).filter(Boolean);
    const displayed = targets.length ? targets : [PLATFORM_KNOWLEDGE["Google AI Studio"]];
    const active = displayed.find(p => p.key === activeTab) || displayed[0];
    const nameOf = (key) => Object.keys(PLATFORM_KNOWLEDGE).find(k => PLATFORM_KNOWLEDGE[k].key === key);
    const sections = [
      { key:"sys",         label:active.outputLabel || "System Instructions",  sub:active.kind === "social" ? "Paste into your scheduler, or use as the brief for content + API setup" : active.key === "ai_studio" ? "Paste into the System Instructions clipboard field — NOT the chat box" : active.key === "claude" ? "Paste into Project Instructions or a new chat system prompt" : active.key === "base44" ? "Use as your B44 app description or CLAUDE.md" : active.key === "gemini_eco" ? "Paste into a Gem's instructions field in the Gemini app" : active.key === "openai" ? "Paste into a Custom GPT, ChatGPT custom instructions, or API system message" : "Paste into the platform's system prompt field", content:active.sysTemplate(profile) },
      { key:"settings",    label:"Platform Settings",     sub:"Configure in the right panel before any generation", content:active.settings.join("\n") },
      { key:"constraints", label:"Constraints & Gotchas", sub:"Hard limits and known failure modes", content:active.constraints.map(c => `• ${c}`).join("\n") },
      { key:"gems",        label:"Pro Moves",             sub:"Hidden features most guides miss", content:active.gems.map(g => `✦ ${g}`).join("\n") },
    ];
    return (
      <div className="mpc" style={S.wrap}>
        <style>{GLOBAL_CSS}</style>
        <div style={S.inner}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={S.tag}>Setup Kit</div>
              <h1 style={{...S.h1, marginBottom:0}}>{profile.meta.name || "Unnamed Profile"}</h1>
              <div style={{ color:C.t3, fontSize:"0.8rem", marginTop:"0.25rem" }}>
                {profile.type === "master" ? "🧠 Master" : "🏢 Client"} · {profile.identity.industry || "No industry"} · {profile.identity.expertise_level}
              </div>
            </div>
            <button style={S.btn(C.t3)} onClick={() => setPhase("review")}>← Edit Profile</button>
          </div>

          <div role="tablist" aria-label="Platforms" style={{ display:"flex", gap:"0.5rem", marginBottom:"1.75rem", flexWrap:"wrap" }}>
            {displayed.map(plt => (
              <button key={plt.key} role="tab" aria-selected={activeTab === plt.key} onClick={() => setActiveTab(plt.key)}
                style={{ background:activeTab === plt.key ? "rgba(168,85,247,0.13)" : C.bg2, border:`1px solid ${activeTab === plt.key ? C.v : C.border}`, borderRadius:100, padding:"0.4rem 1rem", cursor:"pointer", fontSize:"0.82rem", color:activeTab === plt.key ? C.v : C.t2, display:"flex", alignItems:"center", gap:"0.4rem" }}>
                {plt.icon} {nameOf(plt.key)}
              </button>
            ))}
          </div>

          <div style={{ color:active.color, fontFamily:"monospace", fontSize:"0.78rem", marginBottom:"1.5rem", opacity:0.85 }}>
            {active.tagline} · {active.format}
          </div>

          {sections.map(sec => {
            const ck = `${active.key}-${sec.key}`;
            return (
              <div key={sec.key} style={{...S.card(), marginBottom:"1.1rem"}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem", flexWrap:"wrap", gap:"0.5rem" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"0.95rem" }}>{sec.label}</div>
                    <div style={{ color:C.t3, fontSize:"0.78rem", marginTop:"0.15rem" }}>{sec.sub}</div>
                  </div>
                  <button style={S.btn(copied[ck] ? C.ok : C.v)} onClick={() => copyText(ck, sec.content)}>
                    {copied[ck] ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div style={S.code}>{sec.content}</div>
              </div>
            );
          })}

          <div style={{...S.card(), border:"1px solid rgba(34,211,238,0.18)", marginBottom:"2rem"}}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem", flexWrap:"wrap", gap:"0.5rem" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:"0.95rem" }}>Profile JSON</div>
                <div style={{ color:C.t3, fontSize:"0.78rem", marginTop:"0.15rem" }}>Saved to your library — re-import to clone for another client</div>
              </div>
              <button style={S.btn(copied["pj"] ? C.ok : C.cy)} onClick={() => copyText("pj", JSON.stringify(profile, null, 2))}>
                {copied["pj"] ? "✓ Copied" : "Export JSON"}
              </button>
            </div>
            <div style={S.code}>{JSON.stringify(profile, null, 2)}</div>
          </div>

          <div style={{ textAlign:"center" }}>
            <button style={S.btn(C.t3)} onClick={() => { setPhase("type"); setProfile(null); setProfileType(null); setActiveTab(null); }}>
              + Create Another Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
