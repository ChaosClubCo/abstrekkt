# what-changed.md — github-stage cleanup (2026-06-05)

Lane: PERSONAL (ChaosClubCo repos). All changes made on a sandbox copy of the uploaded zip.
Original upload untouched. Nothing pushed, nothing committed — index staged only, you review and commit.

## 1. INTINC quarantine (423 files moved, 0 deleted)

Moved to `_intinc-quarantine/` at stage root (outside both repos). Relocate to your INTINC lane.

From `skills/_master-skills/`:
- intinc-claude-skills-governance-role-bundles/ (4 files)
- operations/int-ai-enablement-pm/, operations/int-data-analyst/
- technical/int-kb-articles/

From `skills/staging/`:
- 209pack/ (entire — 8 intinc-* bundles, 189 skills) + 209pack-manifest.txt + 209pack-install-recommendations.md

From `skills/staging/ff-cc-skills/`:
- generating-intinc-documents, generating-kb-articles (INT brand), generating-msm-documents,
  int-ai-enablement-pm, int-data-analyst, operating-int-service-desk

From `skills/archives/individual/`:
- intinc-doc-generator/

Kept (generic, not INT-branded): internal-comms, kb-screenshot-automator, producing-ai-newsletter
(producing-ai-newsletter contains INT config sections — review before publishing).

## 2. Line-ending normalization

- All text files in both repos: CRLF → LF (verified zero CRLF residue).
- Added `.gitattributes` (`* text=auto eol=lf`, binary rules) to both repos.
- Ran `git add --renormalize` to clear index. Result: all 1,704 phantom modifications gone.
  - flashfusion-plugins: clean except new untracked `.gitattributes`.
  - skills: 433 staged deletions (= quarantined files + orphan-skill move below), 1 staged M (README), 2 untracked (.gitattributes, relocated skill).

## 3. Orphan skill relocated

- `skills/launching-digital-products/` → `skills/_master-skills/creative/launching-digital-products/`

## 4. README counts corrected (skills/README.md)

- Master skills 514 → 513 (actual, post-quarantine: 233 ai-agents / 130 technical / 59 strategy / 41 creative / 25 operations / 25 industry).
- creative 40→41, operations 27→25 in table and structure diagram.

## NOT changed (flagged only)

- 380 files still *mention* "Intinc" in text (lane-rule warnings, deployment plan docs in docs/planning referencing \\intinc-share\ paths, cross-references). No credentials among them. Review docs/planning/ before making the repo public.
- 29 drifted duplicate skills between staging/ff-cc-skills and _master-skills — untouched per your call. See drift-report.md.
- skills-pipeline/ — broken .git-only clone, left as-is per your call. Re-clone from ChaosClubCo/skills-pipeline to fix.
- Internal identifiers that remain: `oorstbwcydxwiojrsoim` (5 files, all as "do NOT use" warnings), `krosebrook.app.n8n` references in ff-cc-skills/running-drive-automation.
