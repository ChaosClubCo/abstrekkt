# Prompt Audit Report
## Staff-Level Debugging Agent: Original → v2
**Date:** 2026-05-17
**Auditor:** Claude (Staff-level Prompt Audit)

---

## Executive Summary

The original prompt is structurally sound but self-contradicting, redundant, and too long to reliably execute. Six structural defects and four content defects were identified. The rebuilt v2 resolves all ten, cuts ~40% of word count, and adds per-phase acceptance criteria and a triage gate without removing any meaningful coverage.

---

## Structural Defects Found

### SD-1 — PRIMARY DIRECTIVE Contradicts Phase 3
**Severity:** High
**Evidence:**
- PRIMARY DIRECTIVE: `"generate missing files only; do not rewrite unchanged files"`
- Phase 3: explicitly authorizes refactoring working code with no scope qualifier

**Root cause:** Two independently authored sections with no reconciliation pass.
**Fix in v2:** Unified under a single principle — inspect first, fix proven issues, refactor is conditionally allowed with evidence requirement.

---

### SD-2 — FIRST ACTIONS and PHASE 1 are Duplicate Inspection Protocols
**Severity:** Medium
**Evidence:**
- FIRST ACTIONS: lists inspection targets and commands
- PHASE 1 — REPOSITORY AUDIT: lists the same inspection targets in different structure

**Root cause:** Phase 0 was likely split into two sections during drafting and never merged.
**Fix in v2:** Merged into single Phase 0 — INSPECTION. PHASE 1 becomes Audit Map only (what you do with inspection results, not the inspection itself).

---

### SD-3 — SCOPE_MODE Declared But Never Wired
**Severity:** Medium
**Evidence:**
- `SCOPE_MODE: FULL` appears in header
- No phase has any conditional logic referencing SCOPE_MODE
- The variable is decorative

**Root cause:** Feature declared, never implemented.
**Fix in v2:** Each phase header includes `Runs in: [LITE | STANDARD | FULL]`. Table maps scope modes to phase sets.

---

### SD-4 — Two Conflicting Output Format Sections
**Severity:** High
**Evidence:**
- Phase 6 defines a 13-section Final Report
- OUTPUT REQUIREMENTS (bottom of prompt) defines a different 10-section format
- Both sections claim to define "the" output format

**Root cause:** Two passes at output spec, never reconciled.
**Fix in v2:** Single canonical output format lives in Phase 6. OUTPUT REQUIREMENTS section removed.

---

### SD-5 — Approval Gate Has No Defined Behavior
**Severity:** High
**Evidence:**
- NON-NEGOTIABLE RULES: `"Require human approval before destructive changes"`
- Phase 6: `"Human Approval Needed"` section
- Neither section specifies what the agent should DO when it hits an approval boundary (pause? list and continue? stop entirely?)

**Root cause:** Policy declared without mechanics.
**Fix in v2:** Explicit three-step Approval Gate: (1) list in Patch Plan, (2) mark NEEDS APPROVAL, (3) do not execute until user confirms.

---

### SD-6 — CLAIMS CHECK Defined Twice With Different Schemas
**Severity:** Low
**Evidence:**
- NON-NEGOTIABLE RULES implies claims labeling
- PHASE 6 FINAL REPORT defines one CLAIMS CHECK schema
- OUTPUT REQUIREMENTS defines a slightly different CLAIMS CHECK schema

**Root cause:** Same as SD-4 — two output spec sections.
**Fix in v2:** Single CLAIMS CHECK format in Phase 6 with `[SAFE DEFAULT]` / `[UNCERTAIN]` assumption labels and `!` contradiction prefix.

---

## Content Defects Found

### CD-1 — Phase 4 Demands 9 Complete Documents Per Run
**Severity:** High
**Evidence:** Phase 4 lists 9 required documents with no triage, no priority order, and no scope gate.
**Risk:** Will either produce hallucinated/placeholder docs (violating NON-NEGOTIABLE RULES) or consume the entire output budget before fixes are shipped.
**Fix in v2:** Priority-ordered table (1–9). README + CHANGELOG always required. Others gated by scope and content availability. ADRs only for decisions made this session.

---

### CD-2 — No Triage Order
**Severity:** High
**Evidence:** No ordering between "build is broken" and "write ADRs." A broken build + full ADR output is worse than useless.
**Fix in v2:** Tier 0–6 triage gate. Blockers must be resolved before advancing to the next tier.

---

### CD-3 — ~30% Content Redundancy
**Severity:** Low
**Evidence:**
- "Do not invent project state" appears in NON-NEGOTIABLE RULES and is re-implied by every phase check
- "Do not expose secrets" appears in rules, Phase 4, and SECURITY.md spec
- Phase 2 defect checklist and NON-NEGOTIABLE RULES overlap significantly

**Fix in v2:** Single NON-NEGOTIABLE block. Phases reference it implicitly. No repeated rules.

---

### CD-4 — No Happy-Path / Nothing-Broken Behavior
**Severity:** Low
**Evidence:** If the repo is clean, the prompt provides no guidance. Implicit risk: agent generates all 9 docs anyway.
**Fix in v2:** Implicit via "generate or update only what is missing or stale" + triage gate that produces no Tier 5/6 work when nothing is wrong.

---

## Unchanged Decisions (Preserved from Original)

These were correct and carried forward without modification:

| Decision | Rationale |
|---|---|
| Evidence-first debugging | Correct — prevents speculative changes |
| Allowed vs disallowed refactor lists | Correct — right scope boundaries |
| Per-defect structured output (severity, evidence, root cause, fix) | Correct — reviewable format |
| CLAIMS CHECK requirement | Correct — adversarial review standard |
| No placeholder docs rule | Correct — critical quality gate |
| Secrets / client-side key prohibition | Correct — hard security rule |

---

## Change Summary

| # | Problem | Fix | Impact |
|---|---|---|---|
| SD-1 | PRIMARY DIRECTIVE contradicts Phase 3 | Unified principle | Eliminates contradiction |
| SD-2 | FIRST ACTIONS duplicates PHASE 1 | Merged into Phase 0 | Eliminates duplication |
| SD-3 | SCOPE_MODE unused | Wired to phase gates | Makes feature functional |
| SD-4 | Two output format sections | Single format in Phase 6 | Eliminates contradiction |
| SD-5 | Approval gate undefined | Explicit 3-step mechanic | Makes policy enforceable |
| SD-6 | CLAIMS CHECK defined twice | Single schema | Eliminates contradiction |
| CD-1 | 9 docs demanded unconditionally | Priority order + scope gate | Prevents hallucinated docs |
| CD-2 | No triage order | Tier 0–6 gate | Prevents wasted work on broken builds |
| CD-3 | ~30% redundancy | DRY rules block | Reduces prompt length ~40% |
| CD-4 | No happy path | Implicit via triage + "missing or stale" | Prevents unnecessary doc generation |

---

## Known Limitations Carried Into v2

These are not fixable inside the prompt itself. They require invoker-level decisions.

1. **Approval gate is advisory in autonomous loops.** Without a real interrupt mechanism (human-in-the-loop pause point), `NEEDS APPROVAL` items must be enforced by the human reviewing the Patch Plan before execution begins.

2. **Token budget is not solved.** A full Phase 1–6 run on a large codebase may exceed output limits. Mitigation added: compress Phase 4 to README + CHANGELOG if limits are hit. A `max_phases_per_run` parameter could be added by the invoker.

3. **Repo access method is not specified.** Whether the agent operates in Claude Code (filesystem), a file upload, a pasted codebase, or via MCP determines which inspection commands are valid. This context must be supplied at invocation, not inside the prompt.

---

## Files in This Package

| File | Description |
|---|---|
| `staff-debug-agent-original.md` | Original prompt, unmodified |
| `staff-debug-agent-v2.md` | Rebuilt prompt with all defects resolved |
| `prompt-audit-report.md` | This document — full audit findings and change log |

---

## CLAIMS CHECK

**Verified by content analysis:**
- All 10 defects (SD-1 through CD-4) were identified by direct text inspection of the original prompt
- All "preserved" decisions were confirmed present in the original and carried to v2

**Verified by diff:**
- v2 eliminates the FIRST ACTIONS / PHASE 1 duplication
- v2 wires SCOPE_MODE to phase headers
- v2 removes the OUTPUT REQUIREMENTS section

**Not verified:**
- ~40% word count reduction is an estimate, not a counted diff

**Assumptions:**
- [SAFE DEFAULT] "SCOPE_MODE: FULL" in original was intended as a default, not a hard lock
- [SAFE DEFAULT] Phase 4 doc list was intended as "generate if missing" not "always regenerate"
- [UNCERTAIN] The original prompt was authored for Claude Code / filesystem access — no explicit statement found

**Contradictions:**
- ! PRIMARY DIRECTIVE says "do not rewrite unchanged files" but Phase 3 authorizes refactoring working code — resolved in v2
- ! Two output format sections both claim to be authoritative — resolved in v2

**Remaining unknowns:**
- Whether the invoker needs a `SCOPE_MODE` override mechanism per-invocation (or whether it should always be set in the header) — verify by testing with a real repo at LITE scope
- Whether the token budget mitigation (compress Phase 4 to README + CHANGELOG) is sufficient for very large monorepos — verify empirically
