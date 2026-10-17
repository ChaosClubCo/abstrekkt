# Extraction runbook — generic procedure

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Applies to every EXTRACT row in `01-DECOMPOSITION_PLAN.md`. Follow `repository-registry.yaml:66-77`'s migration contract: no source is deleted or archived until a target hash is independently verified.

## Steps

1. **Denylist check.** Confirm the source path (and everything under it) is not in `never-extract.denylist`. Run `scripts/extract-subtree.sh --dry-run <source> <target-staging-dir>` — it refuses and exits non-zero on any denylist match.
2. **Copy.** Run the script for real (no `--dry-run`) to copy the source into a local staging directory outside this repo, and write `MANIFEST.sha256` (one line per file, `sha256sum` format) alongside it.
3. **Fresh repo.** `git init` a new, empty repository at the target name (see `01-DECOMPOSITION_PLAN.md` for the name and host). Do not `git clone` or fork this repo. Copy the staged files in as the first commit.
4. **Add repo scaffolding.** `LICENSE` (per `01-DECOMPOSITION_PLAN.md`'s license default unless told otherwise), `README.md` stating provenance (source repo, source revision, extraction date), `.gitignore` appropriate to the stack.
5. **CI.** One workflow: build/test on PR, deploy on push to the new repo's `main`, matching the surface-specific runbook (`04`/`05`/`06`).
6. **First deploy.** Follow the surface-specific runbook's deploy + read-back steps.
7. **Receipt.** Fill `EXTRACTION_RECEIPT_TEMPLATE.md` with the source hash from step 2's manifest and the target hash (re-run `sha256sum` against the pushed target repo). Commit the completed receipt to **this** repo under `docs/migrations/<target-repo-name>/`.
8. **No deletion here.** The source path in this repo (`ChaosClubCo/abstrekkt`) is never modified or removed as part of extraction. Archival/removal is a separate, later, explicitly-approved change, gated on `deletion_gate: target_hash_verified` (`repository-registry.yaml:77`).

## What the script does and does not do

`scripts/extract-subtree.sh`:

- Takes a list of source paths and a target staging directory.
- Refuses (exit 1, prints the matching denylist pattern) if any resolved source path matches `never-extract.denylist`.
- In `--dry-run` mode: lists what would be copied and exits 0 without touching disk.
- In normal mode: copies files (not a `git` operation — no history is carried) and writes `MANIFEST.sha256`.
- Makes no network calls, pushes nothing, deletes nothing, and never touches paths outside the given source list and the target staging directory.
- Is under 400 LOC per `AGENTS.md:50` / `REPOSITORY.md:96`.

## Verification per extraction

- `sha256sum -c MANIFEST.sha256` passes against the staged copy before it's committed to the new repo.
- The new repo's CI is green on its first commit.
- The receipt in `docs/migrations/<target>/` has all nine required fields from `repository-registry.yaml:67-76` populated, none left as `TBD`.
- `python3 scripts/repo_integrity.py` still passes in this repo after the receipt is added (no source files were touched).
