# Extraction receipt: abstrekkt-private

Date: 2026-11-04
Plan: repository split, decomposition plan 08, option A (approved by Kyle on 2026-11-04)
Status: `VERIFIED` for the target copy. Nothing has been deleted from this repository.

## Receipt fields

| Field | Value |
|---|---|
| source_repository | `ChaosClubCo/abstrekkt` |
| source_revision | `f5e67c436b86ee8cdc64068096fb3ae362866597` |
| source_path | 1,277 files from 165 top-level paths: private material under `abstrekkt-full/` and `project/`, `Memoir/` (imported as `memoir/`), `memoir-source-pack/`, `clinical-source/`, `Sudowrite-braindump/`, and single private folders at the repository root |
| source_hash | `7af9709dbab237f60e5706a28f95be739c26fefa4e7e31e404a11ad76b0f1511` |
| target_repository | `ChaosClubCo/abstrekkt-private` (private) |
| target_revision | `287dee510c79201b59c9454c14411354d7f64c4e` |
| target_path | `/` (repository root, same relative paths as the source, except the rename noted below) |
| target_hash | `7af9709dbab237f60e5706a28f95be739c26fefa4e7e31e404a11ad76b0f1511` |
| verification_status | `PASS` |
| deletion_gate | `target_hash_verified` |

`source_hash` is the SHA-256 of `MANIFEST.sha256`, which lists the SHA-256 of every imported file as read from the source revision. `target_hash` is the SHA-256 of the same manifest read back from a fresh clone of the target. The full per-file list is that manifest, in the target repository.

## What moved

- 1,277 files, with fresh history: the target starts at one import commit, and the full history of these files stays in this repository.
- The target also has `README.md`, `LICENSE` (all rights reserved) and `.gitignore`, which are not part of the manifest.
- Excluded before import: 3 INT-lane files. They stay in this repository only and were not copied anywhere.

## Path changes

48 files under `Memoir/` were imported under `memoir/`, so the folder has one spelling on every operating system. Their content and hashes are unchanged; the source-side re-check below maps each one back to its source path.

## Restricted content

This repository holds private memoir, clinical and family source material (`private_personal_sources` in `repository-registry.yaml`). Nothing in it may be published, quoted or copied into a public repository without Kyle's explicit approval. This receipt names folders only, not files.

## Independent read-back

From a fresh clone, made after the push:

```text
git clone https://github.com/ChaosClubCo/abstrekkt-private
git rev-parse HEAD                  287dee510c79201b59c9454c14411354d7f64c4e  (equals the pushed head)
sha256sum --quiet -c MANIFEST.sha256    exit 0, no failures
sha256sum MANIFEST.sha256           7af9709dbab237f60e5706a28f95be739c26fefa4e7e31e404a11ad76b0f1511  (equals source_hash)
files in clone                      1,281 = 1,277 manifest entries + MANIFEST.sha256, README.md, LICENSE, .gitignore
unlisted files / missing entries    0 / 0
Git LFS pointer files               0
```

## Source-side re-check

Every manifest entry was hashed again against the source checkout at `f5e67c43`: 1,277 match, 0 mismatch, 0 missing.

## Checks not run

- No CI: the target is a private archive with no build. GitHub Actions has also not run for this organization since 2026-10-17 (account level, see the open billing item).

## Deletion gate

This receipt records that the target hash was verified. It does not authorize deleting or rewriting anything in `ChaosClubCo/abstrekkt`. Removing the moved paths from this repository is a separate slim PR, which needs Kyle's own approval. That PR may remove only the paths listed in `MANIFEST.sha256`, because the source folders named above also hold files that did not move.
