# What Changed — Service Desk Skill Routing Fix

**Date:** 2026-06-16
**Lane:** PERSONAL (repo: github-stage-clean) — note: `operating-int-service-desk` is INT-lane content colocated here.
**Operator:** Claude (Cowork)

## Goal
Stop `operating-int-service-desk` and `unifying-service-desk` from cross-firing. Both fired on identical
triggers ("service desk", "ticket", "triage", "VPN issue", "headset", "escalation") with no routing guard.

## Change (additive only — zero procedure content changed)
For BOTH skills, in all three repo copies:
1. **Scope Lock** section inserted as the first section after frontmatter (routing guard).
2. **Evals** section inserted immediately after Scope Lock (3 positive + 2 negative).
3. **Description** frontmatter extended with a NOT-trigger routing clause.
4. **Version** bumped: operating-int-service-desk 4.0.0 → 4.1.0; unifying-service-desk 1.0.0 → 1.1.0.
5. operating-int-service-desk only: added a `4.1.0` Version History entry.

Routing is now bidirectional:
- operating-int-service-desk → defers to unifying-service-desk when NO INT/FreshService/Kaseya/MSM context.
- unifying-service-desk → defers to operating-int-service-desk when INT/FreshService/Kaseya/MSM IS named.

## Files touched (6)
- skills/staging/ff-cc-skills/operating-int-service-desk/SKILL.md            (LF)
- skills/staging/ff-cc-skills/unifying-service-desk/SKILL.md                 (LF)
- skills-fresh/staging/ff-cc-skills/operating-int-service-desk/SKILL.md      (CRLF preserved)
- skills-fresh/staging/ff-cc-skills/unifying-service-desk/SKILL.md           (CRLF preserved)
- skills-main/staging/ff-cc-skills/operating-int-service-desk/SKILL.md       (LF)
- skills-main/staging/ff-cc-skills/unifying-service-desk/SKILL.md            (LF)

## Backups
Every original saved to: outputs/source-backups/<copy>__<skill>.SKILL.md.orig (6 files).

## Pre-existing git quirks surfaced (NOT caused by this edit — flagged for you)
1. **skills/** repo: INT SKILL.md shows in index as staged-deletion + untracked ("D" + "??").
   The working file is correct; you'll need `git add staging/ff-cc-skills/operating-int-service-desk/SKILL.md`.
   (Sandbox could not touch .git/index.lock — git plumbing left untouched on purpose.)
2. **skills-fresh/** repo: working tree is CRLF while committed blob appears LF, so `git diff` looks like a
   full-file rewrite. Real change (via `git diff --ignore-cr-at-eol`) is +23/-1 (INT) and +21/-1 (unifying).
   Consider a `.gitattributes` (`*.md text eol=lf`) or normalize before committing.

## Not done (your call)
- No git commits made (2 repos, index lock blocked, lane/commit-message is your decision).
- Live Cowork skill cache is read-only and was NOT modified — re-run your install pipeline
  (install_phantom_skills.py / run-pipeline) to rebuild the cache from this patched source,
  or install the `.skill` packages in outputs/ via the Save-skill button.
