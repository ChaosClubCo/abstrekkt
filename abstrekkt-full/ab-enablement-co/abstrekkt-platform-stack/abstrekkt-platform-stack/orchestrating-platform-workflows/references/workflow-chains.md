# Workflow Chains — API Parameters and System Prompts

## Make Variable Names (set in Make → Variables before importing blueprints)

| Variable | Used by | Where to get it |
|---|---|---|
| `PARALLEL_API_KEY` | Blueprints 01, 04, 05 | platform.parallel.ai → API Keys |
| `ANTHROPIC_API_KEY` | Blueprints 01, 02, 03, 05 | console.anthropic.com → API Keys |
| `NOTION_DB_NEWSLETTER_ID` | Blueprint 01 | Notion → newsletter research DB → Share → Copy link → extract ID |
| `NOTION_DB_CASE_STUDY_ID` | Blueprint 03 | Notion → case study DB → Share → Copy link → extract ID |
| `NOTION_DB_KB_ID` | Blueprint 05 | Notion → INT KB database → Share → Copy link → extract ID |
| `CLOUDINARY_CLOUD_NAME` | Blueprints 02, 03 | Cloudinary → Dashboard → Cloud name |
| `CLOUDINARY_API_KEY` | Blueprints 02, 03 | Cloudinary → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Blueprints 02, 03 | Cloudinary → Settings → API Keys |
| `HUBSPOT_PORTAL_ID` | Blueprint 04 | HubSpot → Settings → Account → Hub ID |

---

## Workflow 01 — Newsletter Research Batch

### Parallel Search request body
```json
{
  "query": "AI tools and automation news this week",
  "num_results": 10,
  "include_raw_content": false
}
```
Verify endpoint at docs.parallel.ai — expected path: `POST /search`

### Parallel FindAll request body
```json
{
  "brief": "New AI tools, automations, and frameworks relevant to consultants and creators. Released or updated in the past 7 days. Include pricing signals where available.",
  "num_results": 8
}
```
Verify endpoint: `POST /findall`

### Claude synthesis system prompt
```
You are a research synthesizer for Load-Bearing, a newsletter that tests AI tools under real-world load.

Given search results and a list of new tools, produce a research brief with these sections:
1. This week's signal (1-2 sentences: the most important shift in the landscape)
2. Tools worth testing (3-5 items: name, what it does, why it matters for consultants/creators, pricing)
3. Counter-patterns (1-2 things that tools claim to do but the reality is more complicated)
4. Counter-examples (1-2 examples where the hype doesn't match real-world use)

Voice: diagnostic, not celebratory. What holds under load, what doesn't, what I'd do differently.
Format: markdown. Cite sources inline [Source: URL]. Tag every factual claim [SOURCED] or [GENERATED].
Length: 400-600 words.
```

### Notion page structure
- Title: `Load-Bearing Research Brief — [Week of DATE]`
- Properties: `Status: draft`, `Lane: RR`, `Issue: pending`
- Content: Research brief markdown

---

## Workflow 02 — Social Content Batch

### Claude hook-writing system prompt
```
You are a social content writer for FlashFusion, a B2B AI enablement consultancy.

Given newsletter content or a topic, write 5 social media hooks. Each hook should:
- Make a specific, earned claim (not hype)
- Be grounded in real work, not marketing speak
- LinkedIn format: 150-200 chars for the hook line, 2-3 lines max total
- Voice: practitioner authority — "I tested this" / "This is what actually happened"

Output format: 5 numbered hooks, each followed by a 1-sentence rationale for why it works.
```

### Higgsfield image generation prompt template
```
FlashFusion brand editorial image. Deep void dark background (#0B0B14). 
Violet accent (#A855F7). Professional, minimal. No floating shapes or decorative gradients.
No text overlay. Aspect ratio 1:1 for social square.
Theme: [INSERT HOOK THEME]
Style: editorial tech, modern consultant aesthetic.
```

### Cloudinary upload tags
`flashfusion,social,[lane],[issue-N]`
Example: `flashfusion,social,rr,issue-12`

### HubSpot social post structure
- Name: `[LANE] Social — [Hook first 40 chars]`
- Status: `DRAFT`
- Campaign: `Newsletter Issue N` or `FF Social Batch`

---

## Workflow 03 — Case Study Visuals

### Claude visual brief extraction system prompt
```
You are extracting a visual brief from a FlashFusion case study.

From the case study text provided, extract:
1. The core transformation claim (one sentence: "X went from Y to Z")
2. The before state (2-3 words)
3. The after state (2-3 words)
4. The primary emotion the image should evoke (e.g., clarity, momentum, precision)
5. Any specific visual metaphors suggested by the content

Output as JSON:
{
  "transformation_claim": "...",
  "before": "...",
  "after": "...",
  "emotion": "...",
  "visual_metaphor": "..."
}
```

### Higgsfield hero image prompt template
```
FlashFusion case study hero image. Deep void dark background (#0B0B14).
Violet-to-magenta gradient accent (#A855F7 to #EC4899). 
Professional editorial. No text. 1200x630 pixels.
Theme: [transformation_claim from Claude output]
Emotion: [emotion from Claude output]
Style: B2B tech editorial, consultant authority aesthetic.
```

### Cloudinary upload tags
`flashfusion,case-study,cs-[client-slug],[variant]`
Example: `flashfusion,case-study,cs-iron-horse,hero`
Variants: `hero`, `social-square`, `social-portrait`, `social-landscape`

---

## Workflow 04 — Prospect Enrichment

### Parallel Entity Search request
```json
{
  "query": "{{company_name}} {{person_first_name}} {{person_last_name}}",
  "type": "entity"
}
```
Verify endpoint: `POST /entity-search` or `GET /entity-search?q=...`

### Parallel Enrichment request
```json
{
  "company": "{{company_name}}",
  "person": {
    "first_name": "{{person_first_name}}",
    "last_name": "{{person_last_name}}"
  },
  "fields": ["funding_stage", "tech_stack", "recent_news", "employee_count", "linkedin_title"]
}
```
Verify endpoint: `POST /enrich` or via Task API

### HubSpot contact properties to update
```json
{
  "parallel_enriched_at": "{{now}}",
  "parallel_tech_stack": "{{enrichment.tech_stack}}",
  "parallel_funding_stage": "{{enrichment.funding_stage}}",
  "parallel_recent_news": "{{enrichment.recent_news}}",
  "parallel_employee_count": "{{enrichment.employee_count}}"
}
```
Note: these are custom properties — create them in HubSpot → Properties before the blueprint runs.

---

## Workflow 05 — INT KB Article Research

### Parallel Research (Task API) request
```json
{
  "task": "research",
  "query": "{{topic}} for IT managed services environment",
  "structured_output": true,
  "sections": ["overview", "steps", "troubleshooting", "best_practices", "references"],
  "webhook_url": "{{MAKE_WEBHOOK_COMPLETION_URL}}"
}
```
Note: Research API is async. Set `webhook_url` to a Make webhook that receives the completed report.
Verify endpoint: `POST /task`

### Parallel Extract request (run on top 2-3 sources from research output)
```json
{
  "url": "{{source_url}}",
  "include_metadata": false,
  "format": "markdown"
}
```
Verify endpoint: `POST /extract`

### Claude article formatting system prompt
```
You are writing an INT Knowledge Base article for L1 service desk technicians at a managed IT firm.

Given research content, write an article with these exact sections:
## [Article Title]
**Issue:** [one sentence: what problem this solves]
**Applies to:** [systems/software this covers]

### Overview
[2-3 sentences: what this is and why it matters to L1 techs]

### Steps
1. [Step 1 — include exact commands, paths, or UI text where relevant]
2. [Step 2]
[continue as needed]

### Verification
[How to confirm the fix worked]

### Notes
- [Edge case or caveat]
- [When to escalate to L2/L3]

---
**Sources:** [list all [SOURCED] references]
**[GENERATED] claims:** [list any inferences not from sources]

Voice: Clear, direct, technical but not condescending. Assumes Windows environment unless specified.
No marketing language. No "in conclusion." No "it is important to note."
```

### Notion KB page structure
- Title: `[Article Title] — DRAFT`
- Properties: `Status: draft`, `Lane: INT`, `Audience: L1` (or as specified), `Reviewed: false`
- Content: Formatted article body
- Note block at top: `⚠ Review all [GENERATED] claims before publishing to Copilot Studio`
