---
name: sparc-methodology-coach
description: Guide structured development through SPARC's 5 phases — Specification, Pseudocode, Architecture, Refinement (TDD), Completion — with per-phase time budgets and a 6-persona staff audit at Completion. Use when building a feature, module, API, or system that benefits from spec-before-code discipline. Triggers on: SPARC, spec this out, TDD, test-driven, pseudocode, structured development, Red Green Refactor. Activates inside staff-engineer-v4 STANDARD/FULL. Skip for quick fixes or LITE tasks.
---

# SPARC Methodology Coach

## Essential Principles

1. **Coding before thinking is the most expensive mistake in software.** SPARC enforces structured phases that catch 80% of bugs before production and eliminate rework from unclear requirements or premature architecture.

2. **The 5 phases nest inside staff-engineer-v4.** Staff-engineer-v4 decides *what* to build (scope, stack, file plan). SPARC decides *how to build each piece* (spec → algorithm → structure → tests → ship). They layer naturally: staff-engineer-v4 Step 4 (Implement) → SPARC activates per feature.

3. **Time budgets are guardrails, not rituals.** S: 20% / P: 15% / A: 20% / R: 35% / C: 10%. They prevent two failure modes: over-planning (60%+ in S/P/A, 30% left for code) and under-specifying (80%+ in R/C, making it up as you go).

4. **The audit loop at Completion is a ship gate.** P0 findings block the feature. No exceptions. The audit runs even when the user says "just build it" — they opted out of ceremony, not out of quality.

5. **"Just build it" is valid.** Compress S and P into a brief internal plan (don't show it). Proceed to Architecture → TDD → Completion + Audit. Respect the request, preserve the quality.

## Intake

**Activate when:**
- New feature, module, API endpoint, or system component
- Anything >30 minutes to build
- Explicit TDD / spec-first / structured development request
- Inside staff-engineer-v4 STANDARD or FULL scope Implement phase
- User says "I keep rewriting this" or "this got messy"

**Do NOT activate when:**
- LITE scope / quick fix / patch
- Single function under 30 lines with no novel logic
- Bug fix where the problem is already identified
- Refactoring without design change (rename, extract, simplify)
- User says "just do it" or "skip the ceremony" — still run, but compress S and P

**Time budget by task estimate:**

| Estimate | S (20%) | P (15%) | A (20%) | R (35%) | C (10%) |
|---|---|---|---|---|---|
| 2 hours | 25 min | 18 min | 25 min | 42 min | 12 min |
| 8 hours | 1.6h | 1.2h | 1.6h | 2.8h | 0.8h |
| 1 day | 1.6h | 1.2h | 1.6h | 2.8h | 0.8h |

## Core Workflow

Run the 5 phases in order. Load each workflow file as you *enter* that phase — do not pre-load.

| Phase | Workflow | Output |
|---|---|---|
| **S — Specification** | `workflows/specification.md` | Testable requirements, acceptance criteria, unknowns log |
| **P — Pseudocode** | `workflows/pseudocode.md` | Algorithm in structured English, no syntax yet |
| **A — Architecture** | `workflows/architecture.md` | Components, data flow, integration points, security surface |
| **R — Refinement (TDD)** | `workflows/refinement-tdd.md` | Red → Green → Refactor cycle, all tests passing |
| **C — Completion + Audit** | `workflows/completion-audit.md` | Completion checklist + 6-persona staff audit (P0 = ship gate) |

```text
SPARC quick reference (per feature):
  [S] What are we building? Why? How will we know it works?
  [P] How does it work, in plain language?
  [A] Where do the pieces live and how do they connect?
  [R] Write a failing test. Make it pass. Make it clean. Repeat.
  [C] Run the audit. Block on P0. Ship.
```

## Reference Index

| Reference | Purpose |
|-----------|---------|
| `references/patterns.md` | Pseudocode examples, TDD cycle patterns, decisions log format, SPARC + staff-engineer-v4 integration map |

## Workflows Index

| Workflow | Purpose |
|----------|---------|
| `workflows/specification.md` | Phase S — testable requirements, acceptance criteria, unknowns |
| `workflows/pseudocode.md` | Phase P — algorithm design in structured English before any syntax |
| `workflows/architecture.md` | Phase A — components, data flow, integration points, security |
| `workflows/refinement-tdd.md` | Phase R — Red → Green → Refactor TDD cycle |
| `workflows/completion-audit.md` | Phase C — completion checklist + 6-persona staff audit loop |
