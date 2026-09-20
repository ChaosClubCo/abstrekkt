# Abstrekkt Platform Stack Package
## Manufact · Parallel · Higgsfield · CodeSandbox

Version 1.0.0 — June 2026

---

## What's in this package

```
abstrekkt-platform-stack/
├── README.md                                  ← you are here
├── platform-guide.html                        ← production manual (open in browser)
├── orchestrating-platform-workflows/          ← Claude skill
│   ├── SKILL.md
│   └── references/
│       ├── routing-matrix.md                  ← routing edge cases + lane rules
│       └── workflow-chains.md                 ← exact API params + system prompts
└── blueprints/                                ← Make scenarios (import-ready JSON)
    ├── 01-newsletter-research-batch.json
    ├── 02-social-content-batch.json
    ├── 03-case-study-visuals.json
    ├── 04-prospect-enrichment.json
    ├── 05-kb-article-research.json
    └── 05b-kb-article-completion.json
```

---

## Component 1 — Platform Guide (HTML)

**File:** `platform-guide.html`

Open in any browser. No server needed. This is your quick-reference production manual.

Organized by lane (RR, FF Social, FF Client, INT) — not by platform. Each workflow shows the chain, the trigger type, and which blueprint handles the automated version.

---

## Component 2 — Claude Skill

**Directory:** `orchestrating-platform-workflows/`

### Install in Claude Cowork

1. Zip the `orchestrating-platform-workflows/` folder:
   ```bash
   cd abstrekkt-platform-stack
   zip -r orchestrating-platform-workflows.zip orchestrating-platform-workflows/
   ```
2. In Claude Cowork → Settings → Skills → Install skill → upload the zip

### What it does

**Route mode** (planning): Tell Claude what you're trying to produce → it returns the platform chain + blueprint reference.

**Orchestrate mode** (execution): Describe the output you need → Claude runs the workflow using connected MCPs (Manufact and Higgsfield are already connected).

### Trigger phrases
- Route: "which platform should I use for...", "what's the best way to produce...", "where does X fit"
- Orchestrate: "run the newsletter research", "generate assets for [topic]", "research [topic] for newsletter", "enrich [contact]", "KB draft for [topic]"

---

## Component 3 — Make Blueprints

**Directory:** `blueprints/`

### Before importing any blueprint

Set these Make Variables (Make → Variables, not inside scenarios):

| Variable | Blueprints | Where to get it |
|---|---|---|
| `PARALLEL_API_KEY` | 01, 04, 05, 05b | platform.parallel.ai → API Keys |
| `ANTHROPIC_API_KEY` | 01, 02, 03, 05b | console.anthropic.com → API Keys |
| `NOTION_DB_NEWSLETTER_ID` | 01 | Notion DB → Share → copy link → extract ID between `notion.so/` and `?v=` |
| `NOTION_DB_CASE_STUDY_ID` | 03 | same method |
| `NOTION_DB_KB_ID` | 05b | same method |
| `CLOUDINARY_CLOUD_NAME` | 02, 03 | Cloudinary dashboard → Cloud name |
| `CLOUDINARY_API_KEY` | 02, 03 | Cloudinary → Settings → API Keys |
| `HUBSPOT_CONNECTION_ID` | 04 | Make → Connections → HubSpot → connection ID |

### Import order

| Order | Blueprint | Trigger type | Status |
|---|---|---|---|
| 1 | 04 — Prospect Enrichment | HubSpot contact created | ✅ Ready after setup |
| 2 | 01 — Newsletter Research | Clock — Sunday 9pm | ✅ Ready after setup |
| 3 | 05 + 05b — KB Research (pair) | Webhook | ⚠ Parallel endpoint verify |
| 4 | 02 — Social Content Batch | Webhook | ⚠ Higgsfield endpoint needed |
| 5 | 03 — Case Study Visuals | Webhook | ⚠ Higgsfield endpoint needed |

### How to import a blueprint

1. Make → Scenarios → Create new scenario
2. Click the three-dot menu → Import blueprint
3. Select the `.json` file
4. Set all connection references inside the scenario
5. Activate

---

## Platform Connection Status

| Platform | Claude Session | Make HTTP | Notes |
|---|---|---|---|
| Manufact | ✅ Connected | n/a — use MCP | MCP handles deploy + inspect |
| Higgsfield | ✅ Connected | ⚠ Endpoint unconfirmed | Use MCP for now; wire HTTP when endpoint confirmed at higgsfield.ai/docs |
| Parallel | ⚠ Add MCP | ✅ Use HTTP module | API key required for Research/Extract/FindAll/Enrich |
| CodeSandbox | SDK only | ✅ Use HTTP module | No MCP; write SDK code via Claude |

### Add Parallel MCP to Claude Code
```bash
claude mcp add --transport http parallel-search https://search.parallel.ai/mcp
```
This gives free search in every Claude Code session. No API key needed for the MCP version.

### Higgsfield REST API (placeholder)
Blueprints 02 and 03 have `HIGGSFIELD_API_ENDPOINT` placeholders. Until the REST endpoint is confirmed:
- Use Higgsfield MCP in Claude for manual generation
- Or: make a Claude API call with Higgsfield MCP configured and parse the image URL from the response

---

## Pre-Activation Checklist for Each Blueprint

### Blueprint 01 (Newsletter Research)
- [ ] `PARALLEL_API_KEY` set in Make Variables
- [ ] `ANTHROPIC_API_KEY` set in Make Variables
- [ ] `NOTION_DB_NEWSLETTER_ID` set in Make Variables
- [ ] Notion newsletter research DB has properties: `Status` (select), `Lane` (select), `Week` (date)
- [ ] Parallel endpoint paths verified at docs.parallel.ai (`/search`, `/findall`)
- [ ] Test with a manual run before Sunday cron activates

### Blueprint 04 (Prospect Enrichment)
- [ ] `PARALLEL_API_KEY` set
- [ ] HubSpot connection active in Make → Connections
- [ ] 5 custom HubSpot contact properties created: `parallel_enriched_at`, `parallel_tech_stack`, `parallel_funding_stage`, `parallel_recent_news`, `parallel_employee_count`
- [ ] Parallel enrichment endpoint verified at docs.parallel.ai
- [ ] ⚠ Lane separation filter added: ensure day-job contacts cannot trigger this blueprint

### Blueprint 05 + 05b (KB Research)
- [ ] `PARALLEL_API_KEY` set
- [ ] `ANTHROPIC_API_KEY` set
- [ ] `NOTION_DB_KB_ID` set
- [ ] Notion INT KB DB has properties: `Status`, `Lane`, `Audience`, `Slug`, `Reviewed`
- [ ] Two Make webhooks created (05-trigger + 05-completion) and their hook IDs set in Variables
- [ ] Parallel Task API (`/task`) endpoint and async webhook pattern verified at docs.parallel.ai

### Blueprints 02 + 03 (Social Batch, Case Study Visuals)
- [ ] `ANTHROPIC_API_KEY` set
- [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` set
- [ ] Cloudinary upload presets created: `flashfusion_social`, `flashfusion_case_study`
- [ ] Higgsfield REST API endpoint confirmed and `HIGGSFIELD_API_KEY` obtained
- [ ] Or: run manually via Higgsfield MCP in Claude until endpoint is confirmed

---

## Known Gaps (verify before activating)

1. **Parallel endpoint paths** — all blueprint calls use best-guess paths. Verify `/search`, `/findall`, `/extract`, `/task`, `/enrich`, `/entity-search` at docs.parallel.ai before activating.
2. **Parallel async Task API** — the Research API (used in blueprint 05) is async. The completion webhook pattern used here is inferred from the API structure. Confirm with Parallel docs that `webhook_url` in the task payload is supported.
3. **Higgsfield REST API** — no confirmed REST endpoint. Blueprints 02 and 03 have `HIGGSFIELD_API_ENDPOINT` placeholders. Use MCP in Claude for manual runs until confirmed.
4. **Make Notion module names** — `notion:CreateADatabaseItem`, `notion:UpdateADatabaseItem` are estimated module names. Confirm in your Make org under Apps → Notion.
5. **Make HubSpot module names** — `hubspot:WatchCRMObjects`, `hubspot:GetCRMRecord`, `hubspot:UpdateCRMRecord`, `hubspot:CreateaCRMRecord` are estimated. Confirm in Make → Apps → HubSpot.
6. **CCA-F exam constraint** — July 20, 2026. No new platform credentials or complex wiring during exam week. Set blueprint 01 to skip July 13-20 or manually disable.

---

## Skill Validation (packaging spec compliance)

Run this to validate the skill before re-packaging:

```bash
cd abstrekkt-platform-stack
# Check line count — must be ≤ 500
wc -l orchestrating-platform-workflows/SKILL.md

# Check for secrets (should return nothing)
grep -r "sk-ant\|Bearer\|api_key" orchestrating-platform-workflows/

# Check references exist
ls orchestrating-platform-workflows/references/
```

Expected: SKILL.md ~140 lines, no secrets, references/ has routing-matrix.md and workflow-chains.md.
