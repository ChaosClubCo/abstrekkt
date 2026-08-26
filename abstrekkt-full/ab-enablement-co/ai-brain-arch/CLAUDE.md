# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`ai-brain-arch` is a **design bundle**, not a buildable application. It specifies an "AI Brain"
automation system that bridges an **Obsidian vault**, **n8n**, and the **Claude API**, with
GitHub as the sync/trigger transport and Supabase as an audit store. The whole point of the
design is its safety model: stateless, token-budgeted subagents that write only to a
human-review folder, behind four validation gates.

There is **no build, lint, or test** here. The one runnable artifact is the n8n workflow JSON,
which implements all four designed subagents. This directory sits inside the
`D:\02_Homebase` git repo (`git rev-parse --show-toplevel` → `D:\02_Homebase`); the repo-root
`CLAUDE.md` rules apply here (allow-list `.gitignore`, never stage `**/.env`, secrets stay
server-side, Homebase = planning/knowledge, not ship-from-here).

## The three files are one coupled artifact

Editing any one usually means reconciling the other two — the folder names, the
`SpecOutputSchema`, the `OUTPUT/pending-review/` → `OUTPUT/approved/` gate, and the Claude
model ID are duplicated across all three.

- **`AI_BRAIN_ARCHITECTURE.md`** — the canonical spec and source of truth. Authored to live
  *inside an Obsidian vault* (YAML frontmatter, ` ```dataview ` query blocks, `[[wikilinks]]`),
  so it is Obsidian-native, not generic markdown. Contains: the 5-layer architecture
  (Foundation → Persistent Memory → MCP Bridge → Subagent Orchestration → Safety Gates); the
  four subagents (Task Analyzer, Spec Generator, Validator, Auditor) with JSON input/output
  contracts and per-agent token budgets; the four safety gates; the Supabase
  `ai_brain_audit_trail` table (RLS read-only); a red-team threat table; and the WSJF
  implementation sequence. Treat its tables as authoritative — point to them rather than
  restating them.
- **`n8n_ai_brain_workflow.json`** — importable workflow "AI Brain — Agent Pipeline v2" (32 nodes).
  One GitHub webhook fans out to three folder filters, one per agent trigger; each lane self-halts
  if its folder wasn't touched (single file per push — single-writer). All four subagents are built
  and share the lane pattern: **Obsidian read → merge → Gate 1 sanitize → Claude call (structured
  outputs) → Gate 2 (business rules + write-path) → Supabase audit → format → Obsidian write**, with
  a shared Error Handler that every read/merge/gate/agent/write routes failures to.
  - **Agent 1 Task Analyzer** — `TASKS/*.md` → SPEC in `OUTPUT/pending-review/` (5000 tok).
  - **Agent 2 Spec Generator** — `OUTPUT/approved/*.md` → PLAN in `RESULTS/` (8000 tok, triggers Agent 3).
  - **Agent 3 Validator** — `RESULTS/*.md` → report in `RESULTS/reports/` (3000 tok).
  - **Agent 4 Auditor** — chained after the Validator → Supabase audit summary (2000 tok).
  Regenerate it with `node build_workflow.js` (authors code nodes as functions via
  `Function.prototype.toString`, then syntax-checks every embedded snippet before writing) rather
  than hand-editing the escaped JS-in-JSON — `build_workflow.js` is the source of truth, the JSON
  is generated.
- **`setup_ai_brain_vault.ps1`** — idempotent scaffolder (safe to re-run; skips existing files).
  Creates the `SPECS/ TASKS/ OUTPUT/{pending-review,approved}/ RESULTS/ CONTEXT/` folders plus
  template files (`TASKS/_template.md`, `CONTEXT/glossary.md`, `CONTEXT/active-projects.md`) in
  a target vault.

## Working with each file

- **Run the scaffolder** (PowerShell): `.\setup_ai_brain_vault.ps1 -VaultPath "C:\path\to\Obsidian\Main"`.
  `-VaultPath` is mandatory and must already exist.
- **Deploy the workflow**: import the JSON via n8n UI → Workflows → Import from file. It needs
  env vars `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OBSIDIAN_API_URL`,
  and `OBSIDIAN_API_KEY` set in n8n, plus a GitHub push webhook pointed at the workflow (setup
  steps are in the JSON's `_notes` block).
- **Edit the spec** as an Obsidian note — its Dataview blocks and `[[wikilinks]]` only render
  inside a vault, so don't "fix" them into plain markdown.

## Conventions & cautions

- **The pending-review gate is a convention, not an enforced boundary.** The spec's own
  CONTRADICTIONS section flags that an agent with escalated MCP permissions could bypass it —
  do not describe it as hard-enforced.
- **Secrets are referenced only as env vars** (`ANTHROPIC_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `OBSIDIAN_API_KEY`, `N8N_WEBHOOK_SECRET`). Keep the service-role key
  and Obsidian token server-side.
- **Real hardcoded values live in the workflow** — model `claude-sonnet-5` and the n8n cloud
  webhook `https://krosebrook.app.n8n.cloud/webhook/ai-brain-task-trigger`. Flag before changing.
  Any model change is governed by the `claude-api` skill (Sonnet-tier fits this token-budgeted,
  structured-JSON Task Analyzer; the skill otherwise defaults to `claude-opus-4-8`).
- **Every agent sets `thinking: {type: "disabled"}` deliberately.** Sonnet 5 turns on adaptive
  thinking whenever `thinking` is omitted, and thinking shares each agent's hard `max_tokens`
  budget with the output — which would truncate the JSON. Keep it disabled unless you also raise
  `max_tokens`.
- **All agents use `output_config.format` (structured outputs), so the API guarantees JSON shape
  and enums.** The Gate 2 nodes therefore enforce only what a schema can't: non-empty arrays and
  the write-path boundary (`OUTPUT/pending-review/` for Agent 1, `RESULTS/` for Agents 2–3). Don't
  re-add fence-stripping or shape checks to Gate 2 — that's the API layer's job now.
- **File I/O is the Obsidian Local REST API** — the concrete transport for the spec's "MCP bridge"
  layer. Each lane reads its file (`GET /vault/{path}` → `file_content`, since the push payload
  carries only paths) and writes its output (`PUT /vault/{path}` ← `markdown_content`), authed with
  `OBSIDIAN_API_KEY`. If you swap in a true MCP client or the GitHub contents API, keep the same
  read-before-Gate-1 / write-after-format placement.
- **Loop guard — don't remove it.** Agent 2's PLAN write to `RESULTS/` *intentionally* triggers the
  Validator, but the Validator writes its report to `RESULTS/reports/`, which `Filter Result Files`
  **excludes** — otherwise the report would re-trigger the Validator forever. Any new writer under
  `RESULTS/` must either land outside the filter's match or be added to that exclusion.
- **Format/Auditor nodes reference their Gate node by name** (`$('Gate 2 — …')`), not positional
  `$json`, because the immediately-preceding node is an audit/write HTTP call whose response would
  otherwise clobber the parsed fields. Preserve that when reordering a lane.
