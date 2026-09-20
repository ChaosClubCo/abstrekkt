# Routing Matrix — Edge Cases and Lane Variants

## When Two Platforms Could Both Work

| Situation | Choose | Reason |
|---|---|---|
| Need current news on a topic | Parallel Search | Higgsfield can't search; Parallel returns cited excerpts |
| Need an image for a newsletter post | Higgsfield MCP | Already connected; faster than opening browser |
| Need a vector/logo/SVG | Recraft 4.1 (in Higgsfield) | Nano Banana is photorealistic; Recraft is for vectors |
| Need to test MCP before shipping | CodeSandbox CI → Manufact Cloud | CSB CI first, Cloud deploy after pass — not reversed |
| Need a research brief for a client pitch | Parallel Research (async) | Fire before the meeting; report arrives in Notion |
| Need to generate a Sandpack embed | Ask Claude to write the React component | No MCP needed; Claude writes the code inline |
| Need to deploy kyle-mcp changes | Manufact Cloud via connected MCP | git push → auto-deploy; use Inspector to verify |

---

## Lane-Specific Routing Rules

### RR — Load-Bearing Newsletter

**Voice in Claude prompts:**
- Research synthesis: "Load-Bearing research voice — what held under load, what didn't, what I'd do differently. Sources cited. Counter-patterns flagged. Not a summary of AI news — a diagnostic."
- Social hooks: "Load-Bearing social hook — specific claim, not hype. What the tool actually does vs. what marketing says. Under 280 chars."

**Platform priority order:**
1. Parallel (research) — every issue starts here
2. Higgsfield (social assets) — after draft exists
3. HubSpot (scheduling) — after assets exist
4. Manufact, CodeSandbox — not relevant to RR lane

**When NOT to use Parallel:**
- If the issue is opinion/perspective-based (no research needed) — skip blueprint 01 and go straight to draft
- If you have enough material from a recent client engagement — don't duplicate research already done

---

### FF Social + Video

**Voice in Claude prompts:**
- Social hooks: "FlashFusion brand voice — consultant authority, not cheerleader. Specific claim from real work. No 'AI is changing everything.' LinkedIn-native length."
- Image generation: "FlashFusion brand style — void-dark base (#0B0B14), violet accent (#A855F7), professional editorial. No decorative gradients. No floating orbs."

**Platform priority order:**
1. Higgsfield MCP (images/video) — primary
2. Cloudinary (storage) — every asset
3. HubSpot (scheduling) — drafts only
4. Parallel — only if you need research to inform the content

**HeyGen workflow note:**
- Higgsfield supplies thumbnails and B-roll; HeyGen supplies the scripted avatar video
- Don't use Higgsfield for the talking head; don't use HeyGen for the background/thumbnail
- Order: Higgsfield thumbnail first → import into HeyGen project → HeyGen renders full video

---

### FF Client Delivery

**Voice in Claude prompts:**
- Prospect brief: "Pre-meeting intelligence brief. FlashFusion framing: AI readiness signals, likely use cases, tech stack gaps. Sourced facts, flagged assumptions. Not a sales pitch — a diagnostic."
- Engagement research: "Competitive brief. What this company's AI landscape looks like today. What FlashFusion can realistically deliver. Red flags and disqualifiers included."

**Lane separation rules (hard):**
- Art (real estate champion): anonymize all public-facing output. "A real estate owner" in any content, never named.
- Ryan Anderskow / Iron Horse: rate conflict unresolved (free vs $3K) — confirm before any billing reference in briefs
- Day-job contacts: absolute zero. Never in FlashFusion HubSpot, never in Parallel enrichment runs that write to FlashFusion CRM.

**Platform priority order:**
1. Parallel (prospect intel, competitive brief) — pre-engagement
2. Manufact (MCP deployment, Inspector) — during delivery
3. CodeSandbox (CI gate) — before every Manufact deploy
4. Higgsfield — only for case study assets post-delivery

---

### INT KB Articles

**Voice in Claude prompts:**
- Article format: "INT KB article — audience is L1 service desk technicians unless specified. Intro (what this solves + why it matters to them), Steps (numbered, specific commands included), Resolution (how to verify it worked), Notes (edge cases, escalation path). Facts tagged [SOURCED] or [GENERATED]."
- Diagram request: "Clean infographic process diagram, white background, INT professional style. Step-by-step flow. No decorative elements. Suitable for embedding in a knowledge base article."

**Critical rule — Extract before Studio:**
Always run Parallel Extract on any URL before feeding to Copilot Studio. Raw HTML breaks retrieval. There are no exceptions to this.

**Copilot Studio integration path:**
URL → Parallel Extract → clean markdown → paste into Studio knowledge source content field (not the URL field). The URL field re-fetches raw HTML; the content field takes clean markdown.

**Platform priority order:**
1. Parallel (research + extract) — all KB articles
2. Higgsfield MCP (process diagrams) — complex multi-step articles only
3. Cloudinary (diagram storage) — always tag with `int-kb, article-[slug]`
4. Manufact, CodeSandbox — not relevant to INT KB lane

---

## When to Use Make Blueprint vs. Manual Claude Conversation

| Use blueprint when | Use manual Claude when |
|---|---|
| It's a recurring workflow (weekly, per trigger) | It's a one-off or exploratory task |
| The output needs to land in Notion/HubSpot/Cloudinary automatically | You want to iterate on the output before storing |
| You're not at your desk when it should run | You need to review/adjust mid-workflow |
| The workflow has 4+ steps that are always the same | The workflow varies by context |
| You want it to run without thinking about it | You want to prompt-engineer the output |

**Rule of thumb:** If you've manually run a workflow 3+ times and it always looks the same, blueprint it.
