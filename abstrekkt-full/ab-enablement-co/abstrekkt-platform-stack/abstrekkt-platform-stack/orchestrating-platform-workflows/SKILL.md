---
name: orchestrating-platform-workflows
description: >
  Routes and orchestrates content production across Manufact (MCP infrastructure),
  Parallel (web intelligence), Higgsfield (AI video + image), and CodeSandbox
  (isolated execution) for Abstrekkt and FlashFusion workflows. Activates in router
  mode when planning what to produce or selecting a platform. Activates in orchestrator
  mode when executing a specific workflow. Router mode triggers: "which platform for",
  "how should I produce", "what's the best way to", "where does X fit in my stack".
  Orchestrator mode triggers: "run the newsletter workflow", "generate assets for",
  "research this topic for", "enrich this contact", "create KB draft for",
  "social batch for", "case study visuals for", "deploy the MCP".
  Serves four lanes: RR (Load-Bearing newsletter), FF Social (brand content + video),
  FF Client (delivery pipeline), INT (KB article research + visuals).
version: "1.0.0"
---

# Orchestrating Platform Workflows

Dual-mode skill for Abstrekkt's four production lanes.

**Mode 1 — Route** (planning): "which platform / chain / blueprint?"
**Mode 2 — Orchestrate** (execution): runs the workflow step-by-step using connected MCPs.

---

## Mode Detection

Detect from the first sentence of the request:

**Route mode** (answer with platform chain + blueprint reference):
- "which platform should I use for..."
- "what's the best way to produce..."
- "how do I research / create / generate..."
- "where does X fit in my stack"
- "should I use Parallel or..." / "should I use Higgsfield or..."

**Orchestrate mode** (execute the workflow, use MCPs):
- "run the [workflow]"
- "generate [output] for [topic/context]"
- "research [topic]" (newsletter, audit, KB)
- "create assets for [case study / social / newsletter]"
- "enrich [contact / company]"
- "batch [social content / images] for..."
- "deploy [MCP / server]"

---

## Route Mode — Platform Decision Matrix

| I want to produce | Platform chain | Blueprint |
|---|---|---|
| Newsletter research brief | Parallel Search+FindAll → Claude → Notion | 01 |
| Social assets batch | Claude hooks → Higgsfield → Cloudinary → HubSpot | 02 |
| Case study hero + social variants | CS text → Claude → Higgsfield → Cloudinary → Notion | 03 |
| Prospect enrichment | Parallel Entity+Enrich → HubSpot | 04 |
| INT KB article draft | Parallel Research+Extract → Claude → Notion | 05 |
| Deploy or monitor an MCP | Manufact Cloud + Cloud Inspector | — |
| Generate image/video now (ad hoc) | Higgsfield MCP (connected — just ask) | — |
| Parallel eval on agent prompts | CodeSandbox Fork × N → run → compare | — |
| Knowledge source for Copilot Studio | Parallel Extract → clean markdown → Studio | — |
| Client competitive brief | Parallel Research on company → Notion | — |

See `references/routing-matrix.md` for edge cases and lane-specific variants.

---

## Orchestrate Mode — Workflow Chains

### 01 — Newsletter Research (Blueprint 01 or manual)
Trigger: "research [topic] for newsletter" / "run newsletter research"

1. **Parallel Search** — query: `AI news + tools this week [+ topic if provided]`
   - If Parallel MCP not yet connected: remind to run `claude mcp add --transport http parallel-search https://search.parallel.ai/mcp` first; or proceed via Make blueprint 01
2. **Parallel FindAll** — brief: `new AI tools relevant to consultants and creators, past 7 days`
3. **Claude** — synthesize into Load-Bearing research brief: sources cited, counter-patterns flagged, what held under load / what didn't. Load-Bearing voice, not newsletter copy.
4. **Notion MCP** — create page in newsletter research DB with brief + sources
5. If running manually (not via blueprint): note Make blueprint 01 runs this automatically Sunday 9pm

### 02 — Social Content Batch (Blueprint 02 or manual)
Trigger: "social batch for [newsletter/content]" / "generate assets for [topic]"

1. **Claude** — write 5 short-form hooks from input content. LinkedIn format, not sales. Voice: Load-Bearing (what held, what didn't). One per platform variant where relevant.
2. **Higgsfield MCP** — generate one image per hook. System prompt: `FlashFusion brand style — deep void dark (#0B0B14), violet accent, professional editorial, no gradient backgrounds`
3. **Cloudinary MCP** — upload with tags: `flashfusion, social, issue-N` (or `ff-social` for FF content)
4. **HubSpot MCP** — create social post drafts in content calendar (status: needs-review)
5. Return Cloudinary URLs + HubSpot draft IDs for review

### 03 — Case Study Visuals (Blueprint 03 or manual)
Trigger: "case study visuals for [client/project]" / "generate assets for case study"

1. **Claude** — extract from case study text: key transformation claim, before/after contrast, visual brief (not a summary — what a designer would need)
2. **Higgsfield MCP** — hero image: `1200x630, FlashFusion brand style, dark professional, violet accent, no text overlay`
3. **Higgsfield MCP** — 3 social variants: square (1080×1080), portrait (1080×1350), landscape (1200×628)
4. **Cloudinary MCP** — upload all 4 assets. Tags: `flashfusion, case-study, cs-[client-slug]`
5. **Notion MCP** — update case study page with all image URLs

### 04 — Prospect Enrichment (Blueprint 04 or manual)
Trigger: "enrich [company/contact]" / "research [prospect] before outreach"

1. **Parallel via MCP or HTTP** — Entity Search: company name + person name
2. **Parallel Enrichment** — pull: funding stage, tech stack, recent news (≤30 days), employee count, LinkedIn title
3. **HubSpot MCP** — update contact: `parallel_tech_stack`, `parallel_funding_stage`, `parallel_recent_news`, `parallel_employee_count`
4. Return enrichment summary for review
5. ⚠ Lane separation: day-job contacts never enter FlashFusion HubSpot. Absolute.

### 05 — INT KB Article Research (Blueprint 05 or manual)
Trigger: "KB draft for [topic]" / "research [topic] for INT article"

1. **Parallel Research** (Task API, async) — deep research on topic. Structured output: sections + citations
2. **Parallel Extract** — extract top 2-3 source URLs from research output. Returns clean markdown.
3. **Claude** — format to INT KB article template: Intro → Steps (numbered) → Resolution → Notes. All facts tagged [SOURCED] or [GENERATED]. Target audience: L1 technicians unless specified.
4. **Notion MCP** — create draft page in INT KB database with article body + sources
5. Note: all [GENERATED] claims must be verified before article goes live in Copilot Studio

See `references/workflow-chains.md` for exact API parameters, system prompts, and Make variable names.

---

## Connected Platform Status

| Platform | Status | How to use in Claude |
|---|---|---|
| Manufact | ✅ Connected | Ask Claude to deploy, inspect, test |
| Higgsfield | ✅ Connected | Ask Claude to generate image/video |
| Parallel | ⚠ Add MCP | `claude mcp add --transport http parallel-search https://search.parallel.ai/mcp` |
| CodeSandbox | SDK only | Ask Claude to write SDK code; or use via Make HTTP module |

---

## Anti-Patterns

- Don't use Higgsfield NB for SVGs/vectors — use Recraft 4.1 instead
- Don't run Parallel Research API synchronously in Make — async only, set a completion webhook
- Don't seed Copilot Studio with raw HTML — always run Parallel Extract first
- Don't skip CodeSandbox CI before a Manufact Cloud deploy
- Don't run blueprint 01 manually mid-week AND let the Sunday cron also run — double brief
- Don't put day-job contacts in FlashFusion HubSpot — zero tolerance on lane separation

## CLAIMS
- [SOURCED] Higgsfield MCP at mcp.higgsfield.ai/mcp — confirmed in user's connected MCP list
- [SOURCED] Manufact MCP connected — confirmed in user's connected MCP list
- [SOURCED] Parallel free MCP at search.parallel.ai/mcp — from docs.parallel.ai
- [GENERATED] Workflow step sequences inferred from platform docs + project context

## GAPS
- Parallel API endpoint paths for Research, Extract, FindAll, Enrichment: verify at docs.parallel.ai before wiring Make blueprints
- Higgsfield REST API endpoints for direct Make HTTP calls: verify at higgsfield.ai/docs or use MCP route
- Notion DB IDs for newsletter research and INT KB databases: get from Notion settings before blueprint import
