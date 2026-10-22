# Canonical Work / Task Operating System

**Authority:** `Krosebrook/abstrekkt/governance/execution-architect/`  
**Status:** ACTIVE governance contract  
**Scope:** Cross-project work continuity for Abstrekkt, Loxihart/Manifold, Tax the Damage, and supporting execution infrastructure.

The machine-readable reconciled projection is [`canonical-work-state.v1.json`](canonical-work-state.v1.json).

> `canonical-work-state.v1.json` is provisional canonical state until `TSYS-001` proves the append-only event ledger, deterministic writer, evidence binding, deterministic replay, and projection-hash invariants. Conversation or document reconstruction must never be represented as equivalent to verified ledger replay.

## State model

Every task projection must carry:

`task_id`, `title`, `domain_project`, `description`, `source_context`, `created_at`, `updated_at`, `status`, `evidence_state`, `priority_tier`, `urgency_score`, `revenue_impact_score`, `production_risk_score`, `strategic_leverage_score`, `effort_score`, `priority_score`, `dependency_ids`, `blocker_ids`, `owner`, `next_action`, `expected_artifact_result`, `completion_condition`, `required_verification_evidence`, `last_activity_at`, `stale_after_days`, `supersedes`, `superseded_by`, `duplicate_of`, and `notes`.

Unknown values remain `null`; never invent them to make the projection appear complete.

## Status enum

Use only:

`PROPOSED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `UNVERIFIED`, `VERIFIED_DONE`, `DEFERRED`, `DROPPED`, `SUPERSEDED`.

`STALE_REVIEW` is not a status. It is a derived review flag.

## Evidence model

- `PROPOSED` — discussed or specified, but execution is not established.
- `EXECUTED` — an action/mutation occurred, but the required outcome is not proven.
- `VERIFIED` — task-specific behavioral or artifact evidence satisfies the completion condition.

Never mark `VERIFIED_DONE` without evidence bound to the exact artifact, revision, environment, target, and acceptance rule actually evaluated. If evidence is missing, stale, conflicting, or bound elsewhere, use a non-complete status.

## Six-step preflight

1. Harvest recent commitments, decisions, deliverables, blockers, explicit next steps, and newly surfaced work.
2. Reconcile execution/completion evidence and downgrade unsupported completion claims.
3. Detect duplicates, stale work, abandoned threads, superseded requirements, and conflicting task definitions. Merge without losing provenance.
4. Rebuild dependencies. Block work on missing access, approval, evidence, another task, code, environment, or information.
5. Re-score supported active work on 1–5 scales for urgency, revenue impact, production risk, strategic leverage, and effort using:

   `priority_score = (urgency*3) + (revenue_impact*3) + (production_risk*2) + (strategic_leverage*2) - effort`

   If component inputs are not evidence-supported, leave the score fields `null` rather than fabricating values.
6. Convert highest-priority executable work into one concrete next action, one expected result, one completion condition, and required verification evidence.

## Priority tiers

Use `MUST_DO`, `NEXT`, `LATER`, or `DROP`.

A high priority score never overrides a hard dependency.

## Canonical list rules

- Preserve stable `task_id` values across runs.
- Add a new task only for genuinely distinct work.
- Merge duplicates without losing requirements or source provenance.
- Preserve history via `SUPERSEDED`, `DEFERRED`, or `DROPPED`; never silently delete state.
- `DROPPED` requires an explicit reason.
- Keep the full backlog in machine-readable state while surfacing only relevant executable work in summaries.

## Stale-work policy

Default thresholds:

- `MUST_DO`: 3 days
- `NEXT`: 7 days
- `LATER`: 21 days

A READY or IN_PROGRESS task is eligible for `stale_review=true` only when reliable `last_activity_at` evidence exists and exceeds the threshold. Stale does not mean done or dropped. Required disposition: resume, defer, supersede, or drop.

## Conflict policy

If two tasks conflict, prefer the newest explicit decision only when it clearly supersedes the older requirement. Otherwise preserve both and record the conflict. Propagate explicit product/project/platform/release-target changes through dependent tasks and mark incompatible older work `SUPERSEDED`.

## Dependency validation

Before surfacing a task as executable:

- every hard dependency must be `VERIFIED_DONE` or independently proven satisfied;
- otherwise surface the prerequisite;
- circular dependencies are integrity errors;
- downstream blocked work never becomes READY merely because it scores highly.

## Next-action contract

Every active high-priority task requires:

1. one concrete `next_action`;
2. one `expected_artifact_result`;
3. one `completion_condition`;
4. one `required_verification_evidence` definition.

Avoid vague actions such as “continue,” “review,” or “work on X” unless the inspection target and ending decision/artifact are explicit.

## Independent critical paths

### Manifold technical proof

`MPG1-HS-ENV-001 → MPG1-HS-001 → MPG1-HS-002 → MPG1-P2-001 → MPG1-PORT-001`

### Loxihart commercial proof

`LOX-OFFER-001 → LOX-MSP-VAL-001 → LOX-OPS-REF-001 → LOX-PILOT-001`

### Tax the Damage evidence workflow

`TTD-CANON-001 → TTD-DOMAIN-001 → TTD-EMPC-001 → TTD-EVIDENCE-001 → TTD-OPENING-001 → TTD-THESIS-001 → TTD-MANUSCRIPT-001`

### Supporting task-system infrastructure

`TSYS-001 → TSYS-AUTO-001`

These tracks remain independent unless a later explicit decision adds a cross-track dependency.

## Tax the Damage governed sequence

Track the memoir as a distinct project while keeping private source content out of this task projection. Store only metadata, evidence references, hashes, and governed state here.

1. Resolve canonical source/version conflicts across memoir instructions, pre-injury records, style, outline, evidence board, and session-memory families.
2. Select one strongest authenticated artifact for each domain: Writing→Cognitive, Communication→Relational, Photography→Experiential, Education→Developmental, Employment→Functional.
3. Execute the frozen E/M/P/C audit. Never invent first reactions. Never average domains.
4. Classify evidence as predominant continuity, strong discontinuity, asynchronous identity, or insufficient evidence.
5. Select opening architecture from the frozen evidence rule.
6. Adversarially reconcile the governing thesis with the existing *Construction, Not Recovery* framing.
7. Mutate manuscript, scene bank, or claims ledger only after the evidence gate passes.
8. Evidence-check revised opening/manuscript work and return `PASS`, `FAIL`, or `BLOCKED`.

Preserve provenance and distinguish IMPLEMENTED, TESTED, VERIFIED, and DOCUMENTED maturity.

## Required recurring report order

A. EXECUTIVE SNAPSHOT  
B. MUST DO NOW — maximum 3, dependency-safe  
C. BLOCKED — only material blockers to top-priority work  
D. VERIFIED COMPLETIONS  
E. UNVERIFIED / EXECUTED  
F. NEXT QUEUE — maximum 5  
G. STALE / DEFER / DROP REVIEW  
H. CHANGELOG  
I. INTEGRITY CHECK

## Change detection

Compare against the previous canonical projection when available. Report only meaningful deltas. Preserve unchanged tasks silently except where needed for dependency or priority context.

## Guardrails

Never:

- manufacture progress, execution, verification, deadlines, ownership, approval, or evidence;
- infer implementation from a proposal;
- mark downstream work READY while a hard prerequisite is unsatisfied;
- silently waive failed acceptance criteria;
- verify a different revision, artifact, provider, environment, or target;
- collapse distinct tasks because their titles sound similar;
- copy private memoir/client/source content into the work-state projection when a reference/hash is sufficient.

## Operating goal

Continuously reduce ambiguity and work-in-progress, protect evidence integrity, preserve context across days, and force attention toward the smallest dependency-safe actions that create the most revenue, production safety, strategic leverage, or memoir-evidence clarity.
