---
name: auditing-and-rewriting-skills
description: >
  Audits and rewrites broken or under-performing SKILL.md files. Diagnoses
  the six most common failure modes and produces a hardened replacement with
  explicit FAIL conditions. Use when the user says "rewrite this SKILL.md",
  "this skill is broken", "fix this skill", "harden this skill", "audit this
  skill", "the checklist doesn't enforce", or hands over a skill file with a
  list of complaints.
when_to_use: >
  Also triggers on: skill audit, rewrite SKILL, fix skill trigger, conditional
  gate, enforceable checklist, inline the audit, output mode gate, skill
  version bump, harden enforcement, trigger logic vs gate logic, this skill is
  too aggressive, the gate fires on everything, this skill ships slop, this
  skill depends on a file that doesn't exist.
allowed-tools: Read Write Bash
disable-model-invocation: true
metadata:
  version: "2.0.0"
---

# Auditing and Rewriting Skills

Diagnoses why an existing SKILL.md misfires in practice — gates that block trivial work, triggers that fire on the wrong things, audits that silently skip, checklists that self-rate "pass" — and produces a tightened rewrite with FAIL conditions instead of vibes.

## TL;DR

Six failure modes cover almost every broken skill. Run the diagnostic script, map findings to fix patterns, build the rewrite, run the script on your own output before shipping.

## Supporting Files

- `scripts/diagnose.py` — automated 6-mode diagnostic against any SKILL.md; run first, every time
- `scripts/validate-structure.sh` — 8-component structure compliance check for any skill directory
- `scripts/bulk-remediate-structure.sh` — create missing directories and pattern stubs across a library (dry-run supported)
- `references/fix-patterns.md` — complete fix pattern catalog with copy-paste templates
- `references/failure-mode-signals.md` — detailed signal checklists per mode for manual review
- `references/before-after-rewrites.md` — before/after examples for each failure mode
- `references/8-component-standard.md` — canonical structure definition and rules
- `templates/rewrite-skeleton.md` — template for constructing a rewritten SKILL.md
- `templates/audit-report.md` — template for presenting diagnostic findings before rewriting
- `workflows/full-audit-workflow.md` — complete 8-step audit process (decision tree is the compressed version)
- `patterns/good-examples.md` — what correct audits and rewrites look like
- `patterns/anti-patterns.md` — common audit mistakes that produce broken rewrites

---

## Decision Tree

```
Step 1 — Run the diagnostic:
  python3 ${CLAUDE_SKILL_DIR}/scripts/diagnose.py <path-to-SKILL.md>
  Output: which modes are present with line references

Step 2 — Cross-reference with user complaints (if any):
  ├─ Complaint maps to flagged mode → proceed
  ├─ Complaint NOT flagged by script → investigate; may be mode 6+
  └─ Script flags mode user didn't mention → address it anyway

Step 3 — For each flagged mode:
  Read matching fix pattern from references/fix-patterns.md
  Apply to rewrite

Step 4 — Output routing:
  ├─ Source folder writable → Write in place
  └─ Read-only (/mnt/skills/ usual) → write to outputs/<skill-name>/SKILL.md
     and tell the user the path + install instruction

Step 5 — Version bump (semver):
  ├─ Cleanup, behavior unchanged → patch (x.y.Z)
  ├─ New rule added              → minor (x.Y.0)
  └─ Trigger or gate logic changed → major (X.0.0)

Step 6 — Self-check:
  python3 ${CLAUDE_SKILL_DIR}/scripts/diagnose.py outputs/<skill-name>/SKILL.md
  Expected: 0 modes flagged. Fix any that fire before delivering.
```

---

## Mode Quick Reference

Full signals + copy-paste fix templates → `references/fix-patterns.md`
Before/after examples per mode → `examples/`

| Mode | Name | Fastest signal |
|------|------|----------------|
| 1 | Output routing undefined | Skill produces code but never decides file vs inline |
| 2 | Gate fires unconditionally | "No work done until gate passed" for every request |
| 3 | Trigger forces gate onto everything | Description says "even small requests need the gate" |
| 4 | Audit depends on missing file | "read workflows/X.md before delivery" |
| 5 | Checklist is aspirational | Lines like "Is this good?" / no FAIL condition per line |
| 6 | Missing 8-component structure | Skill directory lacks mandatory subdirectories or patterns/ files |

---

## Rewrite Field Order

When constructing the new SKILL.md:

1. YAML frontmatter — bump version; fix `allowed-tools` (space-separated, no quotes); add `disable-model-invocation: true` if skill has side effects
2. Rule 0 — Output mode gate (Mode 1 fix)
3. Rule 1 — Conditional gate + "just do it" override (Mode 2 fix)
4. Rule 2 — Profile/token/standard application (preserved verbatim content here)
5. Rule 3 — Inlined audit, no external file deps (Mode 4 fix)
6. Rule 4 — Anti-pattern blacklist (preserved)
7. Rule 5 — Code standards (preserved)
8. Delivery Checklist — every line with `FAIL:` clause (Mode 5 fix)

**Preserve verbatim:** token blocks, brand colors, source-verified constants, anti-pattern tables, code standards with specific values. Character-for-character. Do not improve formatting on preserved blocks.

---

## Gotchas

1. **Skill mounts are read-only.** `/mnt/skills/` paths mount `dr-x------`. Route to `outputs/` from the start.
2. **Trigger ≠ gate.** Skill triggers broadly; gate executes narrowly. Conflating = interrogation on every request.
3. **Aspirational checklists self-grade pass.** "Is this distinctive?" is not enforceable. Every line needs an observable FAIL.
4. **External file deps fail silently.** Workflow/ folders are often stripped by packagers. Inline load-bearing content.
5. **Preserve verbatim = verbatim.** One changed hex silently breaks downstream. Don't improve formatting on preserved blocks.
6. **`allowed-tools` is space-separated, no quotes.** `Read Write Bash` not `"Read, Write, Bash"`. Quoted/comma form is ignored.
7. **"Just do it" override is mandatory.** Every conditional gate needs an escape hatch or it eventually traps the user.
8. **Run diagnostic on your own output.** Step 6 self-check catches regressions introduced during the rewrite. Don't skip it.
9. **Don't add rules the user didn't ask for.** Put suggestions in GAPS, not the rewrite body.

---

## Self-Verification Checklist

- [ ] **Diagnostic script run on source file.** FAIL: diagnostic skipped; rewrite based on reading or complaint list alone.
- [ ] **All 6 modes checked, not just user-named ones.** FAIL: script flagged a mode the complaint list didn't name and it was not addressed.
- [ ] **8-component structure verified.** FAIL: output skill directory missing any of: references/, templates/, workflows/, scripts/, assets/, patterns/ (with good-examples.md + anti-patterns.md).
- [ ] **Each complaint maps to a Rule or Checklist change.** FAIL: any complaint has no corresponding modified section.
- [ ] **Preserved content is character-for-character identical.** FAIL: any token block, brand color, or user-specified constant altered.
- [ ] **No load-bearing rule depends on an external file.** FAIL: output SKILL.md contains "workflows/", "read this file", or "see also" outside of teaching examples.
- [ ] **Every Delivery Checklist line has a `FAIL:` clause.** FAIL: any checklist line has no observable failure condition.
- [ ] **Trigger description distinct from gate-execution rule.** FAIL: description and Rule 1 both say gate always fires.
- [ ] **"Just do it" override on every conditional gate.** FAIL: any gate rule has no escape-hatch sentence.
- [ ] **`allowed-tools` is space-separated, no quotes.** FAIL: commas or quotes present in the field value.
- [ ] **`version` is top-level in YAML frontmatter.** FAIL: version nested under any parent key.
- [ ] **Output location stated to user with install instruction.** FAIL: file delivered without path disclosure.
- [ ] **Diagnostic run on output file (Step 6 self-check).** FAIL: self-check skipped.
- [ ] **GAPS section present and populated.** FAIL: section missing or empty.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- [SOURCED] `allowed-tools` must be space-separated — per official Claude Code skills docs: `allowed-tools: Read Grep` (no quotes, no commas).
- [SOURCED] `disable-model-invocation: true` prevents automatic skill loading — per official docs; recommended for workflows with side effects.
- [SOURCED] `when_to_use` is a valid frontmatter field appended to description in skill listing, counts toward 1,536-char cap — per official Claude Code skills docs.
- [SOURCED] `${CLAUDE_SKILL_DIR}` resolves the skill's own directory at any install level — required for portable script references.
- [SOURCED] Skill mounts read-only — verified empirically via `ls -la` on `/mnt/.claude/skills/` showing `dr-x------`.
- [GENERATED] "6 modes cover almost every broken skill" — original 5 modes from detailed case + pattern recognition, Mode 6 (structure compliance) added after January 2026 standardization audit revealed 0/59 skills compliant.
- ! CONTRADICTION: "Inline everything load-bearing" (Mode 4) vs. "500-line ceiling" (developing-skills). Resolution: inline wins for correctness — move non-load-bearing supplementary content to `references/` if ceiling hit, never the gate/audit logic.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **Empty directory: assets/.** This skill operates on text (SKILL.md files) and produces text (rewritten SKILL.md files). No binary dependencies, no source templates, no logos. If a visual audit report format (PDF, DOCX) is added later, the template goes here.
- **No hook blocking delivery on checklist failures.** A `hooks: post-tool-use` entry greping the output for FAIL signals (TODO, missing FAIL: clause) would convert honor-system to hard gate.
- **Diagnostic doesn't cover content-producing skills.** Mode scoring is biased toward code/UI skills. Newsletter/doc/analysis skills have different dominant failure modes (fabricated citations, missing CLAIMS footer).
- **No changelog written during version bump.** Agents cached on prior version won't know what changed.
- **`description` + `when_to_use` combined cap is 1,536 chars.** Run `/doctor` to verify budget not overflowing as trigger phrases accumulate.
- **7th mode candidate: stale brand-token drift.** Skills embedding brand tokens have no mechanism to detect upstream design system updates.
