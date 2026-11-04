# Extraction receipt: abstrekkt-archive-renders

Date: 2026-11-04
Plan: repository split, decomposition plan 08, option A (approved by Kyle on 2026-11-04)
Status: `VERIFIED` for the target copy. Nothing has been deleted from this repository.

## Receipt fields

| Field | Value |
|---|---|
| source_repository | `ChaosClubCo/abstrekkt` |
| source_revision | `f5e67c436b86ee8cdc64068096fb3ae362866597` |
| source_path | `abstrekkt-full/` (subset: 83 files in 15 folders of rendered screens, design exports and guides) |
| source_hash | `04f2d710495308dc86a6794224c2a168ee6c11385352cc490dc720e8bd03ea97` |
| target_repository | `ChaosClubCo/abstrekkt-archive-renders` (private) |
| target_revision | `7b8662730ee1c7f7825cf72d48566f1e195c683c` |
| target_path | `/` (repository root, same relative paths as the source) |
| target_hash | `04f2d710495308dc86a6794224c2a168ee6c11385352cc490dc720e8bd03ea97` |
| verification_status | `PASS` |
| deletion_gate | `target_hash_verified` |

`source_hash` is the SHA-256 of `MANIFEST.sha256`, which lists the SHA-256 of every imported file as read from the source revision. `target_hash` is the SHA-256 of the same manifest read back from a fresh clone of the target. The full per-file list is that manifest, in the target repository.

## What moved

- 83 files, with fresh history: the target starts at one import commit, and the full history of these files stays in this repository.
- The target also has `README.md`, `LICENSE` (all rights reserved) and `.gitignore`, which are not part of the manifest.
- Excluded before import: 1 INT-lane file. They stay in this repository only and were not copied anywhere.

## Independent read-back

From a fresh clone, made after the push:

```text
git clone https://github.com/ChaosClubCo/abstrekkt-archive-renders
git rev-parse HEAD                  7b8662730ee1c7f7825cf72d48566f1e195c683c  (equals the pushed head)
sha256sum --quiet -c MANIFEST.sha256    exit 0, no failures
sha256sum MANIFEST.sha256           04f2d710495308dc86a6794224c2a168ee6c11385352cc490dc720e8bd03ea97  (equals source_hash)
files in clone                      87 = 83 manifest entries + MANIFEST.sha256, README.md, LICENSE, .gitignore
unlisted files / missing entries    0 / 0
Git LFS pointer files               0
```

## Source-side re-check

Every manifest entry was hashed again against the source checkout at `f5e67c43`: 83 match, 0 mismatch, 0 missing.

## Checks not run

- No CI: the target is a private archive with no build. GitHub Actions has also not run for this organization since 2026-10-17 (account level, see the open billing item).

## Deletion gate

This receipt records that the target hash was verified. It does not authorize deleting or rewriting anything in `ChaosClubCo/abstrekkt`. Removing the moved paths from this repository is a separate slim PR, which needs Kyle's own approval. That PR may remove only the paths listed in `MANIFEST.sha256`, because the source folders named above also hold files that did not move.
