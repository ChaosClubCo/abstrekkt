# Extraction Engine v4.0
**Canonical source:** prompts/extraction-engine-v4.0.md
**Supersedes:** v3.0

---

## WHAT CHANGED FROM v3.0

| Issue | v3.0 | v4.0 |
|---|---|---|
| Role-based framing | "You are an extraction-first AI Architect" | Removed — replaced with constraint block |
| Completeness gate | Single 8-field rubric for all artifact types | Type-aware: code / config / knowledge / prompt |
| Citations | `[MSG:N]` (impractical) | Topic Map built in Step 0; citations use `[TOPIC:name]` |
| Self-validation | Binary PASS/FAIL checklist | Scored rubric (0–2) with explicit pass threshold |
| Multi-run merge | "split and merge" (no spec) | Structured MERGE MANIFEST format defined |
| Mega-prompt quality | Steps 1–8 compete for context | Pre-flight context estimation; Steps 3–4 and 5–6 grouped to reduce interference |

---

## OPERATING CONSTRAINTS

```
SCOPE:           FULL — always. No other modes.
OUTPUT:          Complete, production-grade, deployable artifact set.
PROHIBITED:      Partial outputs. STANDARD summaries. Placeholder files.
CONFIDENCE TAGS: Every output item labeled [V], [I], [G], or [M].
                 Never blend tags without labeling.
SECRETS:         Never inline. Env vars only. .env.template uses placeholder values.
COMPLETENESS:    Gate is mandatory. Cannot be silently bypassed.
HUMAN DECISIONS: Mark [NEEDS_HUMAN_DECISION] — never resolve silently.
CONTRADICTION:   Latest explicit instruction wins. Emit ⚡ CONFLICT note on resolution.
OVERFLOW:        Emit ⚠ OVERFLOW if context is insufficient. Never claim completeness.
ANTI-SYCOPHANCY: Flag bad patterns in Step 3. Do not silently upgrade around them.
```

---

## CONTRADICTION POLICY

When conflicting requirements exist, the LATEST EXPLICIT instruction wins unless a version pin or override persistence is stated.

On resolution, emit:
```
⚡ CONFLICT [topic]: [earlier rule] overridden at [TOPIC:cluster]. Resolved to: [winning rule].
```

Apply before Step 1.

---

## OVERFLOW POLICY

```
⚠ OVERFLOW — processed ~[X]K of ~[Y]K estimated tokens.
  Prioritized: most recent content. Older content may be incomplete.
  Action: run again on remaining content; merge outputs using MERGE MANIFEST format (Step 7).
```

Never claim completeness under overflow conditions.

---

## STEP 0 — PRE-FLIGHT

Before extraction begins, run two checks:

### 0.1 Context Budget Estimation

Estimate conversation size (rough token count). If > 80K tokens:
- Emit ⚠ OVERFLOW proactively
- Partition: process most recent 60K, note what was excluded
- Set `"overflow": true` in manifest

### 0.2 Topic Map

Scan the full conversation and identify 5–15 named topic clusters. These replace MSG:N citations throughout Steps 1–8.

Format:
```
TOPIC MAP:
  [TOPIC:stack]          — technology choices and stack decisions
  [TOPIC:auth]           — authentication and authorization design
  [TOPIC:data-model]     — database schema and data access
  [TOPIC:deployment]     — infra, CI/CD, environment config
  [TOPIC:security]       — OWASP, secrets, threat model
  [TOPIC:ui]             — frontend components, design, UX
  [TOPIC:testing]        — test strategy, coverage, CI gates
  [TOPIC:integrations]   — third-party services, APIs, webhooks
  [TOPIC:requirements]   — product requirements, user stories
  [TOPIC:constraints]    — budget, timeline, scale, compliance
  ... (add/remove as appropriate for this conversation)
```

All citations in subsequent steps use `[TOPIC:name]` format.

---

## STEP 1 — EXTRACTION

Parse the entire conversation and extract ALL of the following. Label each `[V]`, `[I]`, or `[G]` and cite using the Topic Map.

Extract:
- Ideas and concepts
- Systems and architectures
- Code snippets or pseudocode
- Workflows and processes
- Plans, decisions, and commitments
- Tools, APIs, and integrations
- UI/UX concepts
- Business logic and model assumptions
- Open questions and unresolved items

Rules:
- Do NOT invent items not present in the conversation
- Flag implicit attributes: "User implied X based on Y" → `[I]`
- Preserve temporal markers: "decided early", "revised mid-conversation"
- Apply CONTRADICTION POLICY before finalizing
- Normalize and deduplicate; merge overlapping items as `[M]`

---

## STEP 2 — STRUCTURED RECONSTRUCTION

For each distinct system or deliverable, produce a System Card.

```
SYSTEM CARD
  Name:
  Artifact type:            code | config | knowledge | prompt   ← NEW — drives Step 5 gate
  Purpose:                  [V/I/G] — [TOPIC:name]
  Target user:              [V/I/G] — [TOPIC:name]
  Core features:            [V/I/G each item] — [TOPIC:name]
  Architecture:             [V/I/G] — [TOPIC:name]
  Data model:               [V/I/G] — [TOPIC:name]
  API surface:              [V/I/G] — [TOPIC:name]
  Agent roles:              [V/I/G] — [TOPIC:name]  (omit if N/A)
  Key workflows:            [V/I/G] — [TOPIC:name]
  Dependencies:             name@version [V/I/G] — [TOPIC:name]
  Deployment target:        [V/I/G] — [TOPIC:name]
  Spec completeness score:  [N/8] (computed in Step 5)
```

Deduplication: items >80% overlapping → merge as `[M]`, note both source topics.

---

## STEP 3 — GAP + RISK ANALYSIS

For each System Card, produce findings across four categories.

Per finding:
```
[CATEGORY] Description — Severity: HIGH / MED / LOW
Resolution: [fix] or [NEEDS_HUMAN_DECISION]
```

Categories:
- **GAPS** — missing components, incomplete logic, missing integrations
- **BLINDSPOTS** — unvalidated assumptions, hidden complexity, edge cases
- **BOTTLENECKS** — performance, scaling, cost inefficiencies
- **UNKNOWNS** — what breaks at scale, what is required but unspecified

Anti-sycophancy rule: flag bad patterns explicitly. Do not silently improve around them.

---

## STEP 4 — UPGRADE PLAN

For every gap or risk at MED severity or above, produce an Upgrade Card.

```
UPGRADE CARD
  Target:
  Gap addressed:
  Proposed fix:        [V/I/G]
  Tradeoff:            Option A / B / C
  Recommended:         [single pick + rationale]
  Security impact:
  Cost estimate:       [compute / API / infra / LLM tokens]
  Effort:              [hours]
  Rollback plan:
  Acceptance criteria: [testable]
  Blocks:              [what this unblocks]
```

Hardening defaults (apply unless contradicted):
- Auth: JWT + refresh token rotation, RBAC
- Secrets: env vars only, never client-side
- Multi-tenancy: RLS at database layer
- Observability: structured logging + error classification
- Input: validated at boundary, sanitized before LLM context

---

## STEP 5 — TYPE-AWARE COMPLETENESS GATE

**Step 5.1 — Classify artifact type** (from System Card `artifact type` field):

| Type | Codegen eligible? | Scored fields |
|---|---|---|
| `code` | Yes, if score ≥ 8/8 | All 8 (see below) |
| `config` | Yes, always | purpose, deployment target, ≥1 versioned dep |
| `knowledge` | N/A (docs only) | purpose, target user, ≥3 core features |
| `prompt` | N/A (prompt artifacts) | purpose, target user, constraints defined, output format |

**Step 5.2 — Score** (for `code` type only):

| Field | Present? | Score |
|---|---|---|
| purpose | | 1 |
| target user | | 1 |
| ≥3 core features | | 1 |
| architecture (backend) | | 1 |
| data model | | 1 |
| API surface | | 1 |
| ≥1 versioned dependency | | 1 |
| deployment target | | 1 |
| **Total** | | /8 |

**Thresholds (code type):**
- 8/8 → docs + code + config + CI + tests all eligible
- 5–7 → docs + config eligible; code generation BLOCKED
  ```
  ⚠ COMPLETENESS BLOCK — code generation blocked.
    Missing fields: [list]. Fill with [G] + explicit assumptions or resolve via Upgrade Cards.
  ```
- <5 → docs only; code + config + CI BLOCKED

**Override** (use sparingly):
```
⚠ COMPLETENESS OVERRIDE — [reason]
  All generated code labeled [G] with explicit assumption list.
```

---

## STEP 6 — ARTIFACT GENERATION

For each system that passes the Step 5 gate, generate applicable artifacts.

### File Format

```
--- FILE: /path/to/file.ext ---
[complete file content]
--- END FILE ---
```

Every file: fully populated. No placeholders. No "TODO" comments.

### Code Artifacts

- TypeScript or Python (match stack)
- Error handling with classified error types
- Security controls inline
- Config via environment variables only
- Co-located test file required:
  - TypeScript: `<filename>.test.ts` (Vitest)
  - Python: `test_<filename>.py` (pytest)
  - Coverage: happy path + error path + ≥1 edge case
  - If test cannot be meaningfully generated:
    ```
    ⊘ TEST SKIPPED — [filename] — Reason: [explicit reason]
    ```
- DB changes: migration at `migrations/YYYYMMDD_description.sql`

### Documentation Set (per system)

```
README.md          — purpose, quickstart, ASCII architecture diagram
ARCHITECTURE.md    — system diagram, data flow, auth boundaries
SETUP.md           — prerequisites, install, config, first run
API.md             — endpoints, schemas, auth model, error codes
DEPLOYMENT.md      — infra, env requirements, deploy commands, rollback
RUNBOOK.md         — ops procedures, top 5 failure modes + recovery
SECURITY.md        — threat model, attack surface, secrets rotation
TROUBLESHOOTING.md — top 5 failure modes + resolution
CHANGELOG.md       — version history, breaking changes, migration notes
```

### Prompt Artifacts

- Cleaned, reusable, version-labeled
- Header: `[purpose] | [model-target] | [version]`
- Structure: role/constraints, context, output format (no persona-only framing)

### Schema Artifacts

- Database: table, columns, types, constraints, indexes, RLS policies
- API: JSON request/response with types, versioning, error envelope
- Agent: tool definitions, capability manifests (`agents/*.yml`)

### Config + CI Artifacts

- `.env.template` — all required env vars, placeholder values only
- `.github/workflows/ci-cd.yml` — lint, typecheck, test, build, deploy; secrets via GitHub Actions secrets only

---

## STEP 7 — OUTPUT PACKAGING

### Manifest (`manifest.json`)

```json
{
  "version": "4.0",
  "generated_at": "ISO-8601",
  "scope": "FULL",
  "source": "conversation | [session-id]",
  "topic_map": ["topic-1", "topic-2"],
  "completeness_scores": { "system-name": { "type": "code", "score": 8 } },
  "conflicts_resolved": 0,
  "overflow": false,
  "systems": ["system-name"],
  "files": [
    {
      "path": "/path/to/file.ext",
      "status": "generated | skipped",
      "confidence": "V | I | G | M",
      "system": "system-name",
      "test_file": "/path/to/file.test.ts | null",
      "skip_reason": null
    }
  ]
}
```

### MERGE MANIFEST (multi-run scenarios)

When a conversation required multiple extraction runs due to overflow, produce a merge manifest alongside each run's `manifest.json`:

```json
{
  "merge_version": "1.0",
  "runs": [
    { "run_id": "run-1", "manifest": "manifest-run-1.json", "topics_covered": ["stack", "auth"] },
    { "run_id": "run-2", "manifest": "manifest-run-2.json", "topics_covered": ["deployment", "testing"] }
  ],
  "merge_strategy": "latest_wins_on_conflict",
  "conflicts_across_runs": [
    {
      "topic": "[TOPIC:name]",
      "run_1_value": "...",
      "run_2_value": "...",
      "resolved_to": "...",
      "resolution": "latest_wins | [NEEDS_HUMAN_DECISION]"
    }
  ],
  "unified_systems": ["system-name"],
  "unified_files": []
}
```

Merge rule: same `path` in two runs → later run's version wins. Flag any semantic conflicts (not just file-level) as `[NEEDS_HUMAN_DECISION]`.

### DELTA.md Entry

```markdown
## [ISO-8601] — Extraction Engine v4.0 — FULL

**Systems identified:** [list]
**Artifact types:** [code: N | config: N | knowledge: N | prompt: N]
**Files generated:** [count]
**Tests generated:** [count] | **Tests skipped:** [count + reasons]
**Completeness scores:** [system: type/score]
**Conflicts resolved:** [count + summaries or none]
**Overflow:** yes / no
**Multi-run merge:** yes / no
**Validation score:** [N/34] (see Step 8)
**Failures:** [list or none]
**Gaps flagged:** [count + HIGH/MED/LOW breakdown]
**Notes:** [anything notable]
```

### Project Root Structure

```
/project-root
  /apps/[app-name]
  /packages/[shared-libs]
  /services/[backend-services]
  /agents/[agent-definitions]
  /docs/
  /migrations/
  /configs/
    .env.template
    .github/workflows/ci-cd.yml
  /tests/
  /scripts/
    package.sh
  manifest.json
  merge-manifest.json   ← new: only present on multi-run
  DELTA.md
  README.md
```

---

## STEP 8 — SCORED VALIDATION

Score each item 0–2. Pass threshold: **≥ 28 / 34**.

| # | Check | 0 = Fail | 1 = Partial | 2 = Pass |
|---|---|---|---|---|
| 1 | All [G] items labeled, not presented as [V] | Any unlabeled | Some unlabeled | All labeled |
| 2 | All HIGH severity gaps have an Upgrade Card | Any missing | Some missing | All covered |
| 3 | No secrets in generated code | Any present | — | None present |
| 4 | Dependencies have version pins | None pinned | Some pinned | All pinned |
| 5 | Auth model specified for every API endpoint | None specified | Some specified | All specified |
| 6 | Error handling on every external call | None | Some | All |
| 7 | spec_completeness_score computed per system | None | Some | All |
| 8 | COMPLETENESS BLOCK/OVERRIDE emitted where needed | Not emitted | Partially | All emitted |
| 9 | Test file generated or ⊘ SKIPPED with reason | Neither | SKIPPED without reason | Generated or ⊘ SKIPPED with reason |
| 10 | Migration file present if data model changed | Missing | — | Present or N/A |
| 11 | OVERFLOW flag raised if context insufficient | Not raised | — | Raised or N/A |
| 12 | CONFLICT notes emitted for every resolution | None emitted | Some | All emitted |
| 13 | No contradictions between System Cards | Contradictions present | — | None |
| 14 | Upgrade Cards do not conflict with each other | Conflicts present | — | None |
| 15 | All Upgrade Cards include acceptance criteria | None | Some | All |
| 16 | DELTA.md complete with all required fields | Missing | Partial | Complete |
| 17 | manifest.json valid JSON with completeness_scores | Invalid | Partial | Valid |

**Score < 28:** emit `⚠ VALIDATION FAILED — score: [N/34]` with per-item failures listed. Resolve before emitting final output.

**Score ≥ 28:** emit `✓ VALIDATION PASSED — score: [N/34]`.

---

## ACTIVATION

1. Apply CONTRADICTION POLICY to the full conversation.
2. Execute Steps 0 through 8 in order.
3. Begin with Step 0 pre-flight before any extraction.
4. Do not skip steps. Do not produce partial output.

---

*Extraction Engine v4.0*
*Changes from v3.0: constraint-driven header, type-aware completeness gate, Topic Map citations, scored validation rubric (0-2 per item, 34-point total), MERGE MANIFEST for multi-run, pre-flight context estimation*
