# Extraction receipt: abstrekkt-studio

Date: 2026-11-04
Plan: repository split, decomposition plan 08, option A (approved by Kyle on 2026-11-04)
Status: `VERIFIED` for the target copy. Nothing has been deleted from this repository.

## Receipt fields

| Field | Value |
|---|---|
| source_repository | `ChaosClubCo/abstrekkt` |
| source_revision | `f5e67c436b86ee8cdc64068096fb3ae362866597` |
| source_path | `project/` (subset: 176 files in 3 studio and design canvas folders, for example `project/loadbearing/`, `project/stitch_memory_corridor_studio/` and `project/corridor/`) |
| source_hash | `b73cda16ee2c753b39bd5ac564219c3daac18c6f7f7de19d81404efce7c14a6f` |
| target_repository | `ChaosClubCo/abstrekkt-studio` (private) |
| target_revision | `afc8d73e6c600cb69b62a9f674eb6683f37e4a15` |
| target_path | `/` (repository root, same relative paths as the source) |
| target_hash | `b73cda16ee2c753b39bd5ac564219c3daac18c6f7f7de19d81404efce7c14a6f` |
| verification_status | `PASS` |
| deletion_gate | `target_hash_verified` |

`source_hash` is the SHA-256 of `MANIFEST.sha256`, which lists the SHA-256 of every imported file as read from the source revision. `target_hash` is the SHA-256 of the same manifest read back from a fresh clone of the target. The full per-file list is that manifest, in the target repository.

## What moved

- 176 files, with fresh history: the target starts at one import commit, and the full history of these files stays in this repository.
- The target also has `README.md`, `LICENSE` (all rights reserved) and `.gitignore`, which are not part of the manifest.
- Excluded before import: 0 INT-lane files. None matched in this folder.

## Independent read-back

From a fresh clone, made after the push:

```text
git clone https://github.com/ChaosClubCo/abstrekkt-studio
git rev-parse HEAD                  afc8d73e6c600cb69b62a9f674eb6683f37e4a15  (equals the pushed head)
sha256sum --quiet -c MANIFEST.sha256    exit 0, no failures
sha256sum MANIFEST.sha256           b73cda16ee2c753b39bd5ac564219c3daac18c6f7f7de19d81404efce7c14a6f  (equals source_hash)
files in clone                      180 = 176 manifest entries + MANIFEST.sha256, README.md, LICENSE, .gitignore
unlisted files / missing entries    0 / 0
Git LFS pointer files               0
```

## Source-side re-check

Every manifest entry was hashed again against the source checkout at `f5e67c43`: 176 match, 0 mismatch, 0 missing.

## Checks not run

- No CI: the target is a private archive with no build. GitHub Actions has also not run for this organization since 2026-10-17 (account level, see the open billing item).

## Deletion gate

This receipt records that the target hash was verified. It does not authorize deleting or rewriting anything in `ChaosClubCo/abstrekkt`. Removing the moved paths from this repository is a separate slim PR, which needs Kyle's own approval. That PR may remove only the paths listed in `MANIFEST.sha256`, because the source folders named above also hold files that did not move.
