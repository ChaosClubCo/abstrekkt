# Extraction receipt: abstrekkt-archive-enablement

Date: 2026-11-04
Plan: repository split, decomposition plan 08, option A (approved by Kyle on 2026-11-04)
Status: `VERIFIED` for the target copy. Nothing has been deleted from this repository.

## Receipt fields

| Field | Value |
|---|---|
| source_repository | `ChaosClubCo/abstrekkt` |
| source_revision | `f5e67c436b86ee8cdc64068096fb3ae362866597` |
| source_path | `abstrekkt-full/ab-enablement-co/` (subset: 8,761 files in 56 folders; the rest of the folder did not move, see "Not moved" below) |
| source_hash | `ddcc6011da600c9d1b53f8d1e360e60499da1943edc27ff46f628e158d4108d6` |
| target_repository | `ChaosClubCo/abstrekkt-archive-enablement` (private) |
| target_revision | `ea4dda9ced7554a826988ac242f3cba56de33287` |
| target_path | `/` (repository root, same relative paths as the source) |
| target_hash | `ddcc6011da600c9d1b53f8d1e360e60499da1943edc27ff46f628e158d4108d6` |
| verification_status | `PASS` |
| deletion_gate | `target_hash_verified` |

`source_hash` is the SHA-256 of `MANIFEST.sha256`, which lists the SHA-256 of every imported file as read from the source revision. `target_hash` is the SHA-256 of the same manifest read back from a fresh clone of the target. The full per-file list is that manifest, in the target repository.

## What moved

- 8,761 files, with fresh history: the target starts at one import commit, and the full history of these files stays in this repository.
- The target also has `README.md`, `LICENSE` (all rights reserved) and `.gitignore`, which are not part of the manifest.
- Excluded before import: 597 INT-lane files. They stay in this repository only and were not copied anywhere.

## Not moved

10,007 files under `abstrekkt-full/ab-enablement-co/` were outside this extraction (in 122 second-level folders). They stay only in this repository. 67 of them are Git LFS media pointers (1,400,237,574 bytes of media), which also stay here. The slim PR must remove only the paths listed in `MANIFEST.sha256`, never the whole `ab-enablement-co/` folder.

## Held back: Git LFS media

The source keeps large personal media in Git LFS. Per Kyle's decision (option A), the media inside this extraction was not imported here, and the target stays plain Git.

- Files held back: 69, 2,347,182,829 bytes in total (about 2.35 GB).
- The list of held-back files, with their SHA-256 and size, is `held-back-lfs.tsv` next to this receipt. Two paths contain a retired product name, so those names are shown as `[retired-name]`; the hash still identifies each file.
- Destination: separate storage that Kyle chooses. Until the media is copied there and checked against these hashes, the source copy in this repository is the only one.
- All Git LFS media in the source: 136 files, 3,747,420,403 bytes (about 3.75 GB): the 69 held-back files above plus the 67 in folders that did not move.

## Credential-pattern scan

A pattern scan of the staged files found 204 matches for credential-like strings. They were spot-reviewed during the extraction and read as placeholders, templates and examples; no live value was identified. That review was a sample, not a proof. Turning on GitHub secret scanning for the target repository is the recommended follow-up.

## Independent read-back

From a fresh clone, made after the push:

```text
git clone https://github.com/ChaosClubCo/abstrekkt-archive-enablement
git rev-parse HEAD                  ea4dda9ced7554a826988ac242f3cba56de33287  (equals the pushed head)
sha256sum --quiet -c MANIFEST.sha256    exit 0, no failures
sha256sum MANIFEST.sha256           ddcc6011da600c9d1b53f8d1e360e60499da1943edc27ff46f628e158d4108d6  (equals source_hash)
files in clone                      8,765 = 8,761 manifest entries + MANIFEST.sha256, README.md, LICENSE, .gitignore
unlisted files / missing entries    0 / 0
Git LFS pointer files               0
```

## Source-side re-check

Every manifest entry was hashed again against the source checkout at `f5e67c43`: 8,761 match, 0 mismatch, 0 missing.

## Checks not run

- No CI: the target is a private archive with no build. GitHub Actions has also not run for this organization since 2026-10-17 (account level, see the open billing item).

## Deletion gate

This receipt records that the target hash was verified. It does not authorize deleting or rewriting anything in `ChaosClubCo/abstrekkt`. Removing the moved paths from this repository is a separate slim PR, which needs Kyle's own approval. That PR may remove only the paths listed in `MANIFEST.sha256`, because the source folders named above also hold files that did not move.
