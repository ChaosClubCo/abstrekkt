# Extraction receipt — `<target-repo-name>`

Fields required by `repository-registry.yaml:66-77`. Fill every field; do not commit with `TBD` left in place. File this completed receipt under `docs/migrations/<target-repo-name>/receipt.md` in `ChaosClubCo/abstrekkt`.

| Field | Value |
| --- | --- |
| `source_repository` | `ChaosClubCo/abstrekkt` |
| `source_revision` | `<git SHA at time of extraction>` |
| `source_path` | `<path extracted, e.g. project/deploy/abstrekkt-com/>` |
| `source_hash` | `<sha256 of MANIFEST.sha256 itself, or per-file hashes attached>` |
| `target_repository` | `<owner/target-repo-name>` |
| `target_revision` | `<git SHA of the first commit in the target repo>` |
| `target_path` | `<path in the target repo, usually / or a subdir>` |
| `target_hash` | `<sha256 re-computed against the pushed target repo, independently>` |
| `verification_status` | `PASS` / `FAIL` / `PENDING` |

## Independent read-back

Describe how `target_hash` was computed **without** reusing the same working copy used to push (e.g., a fresh `git clone` of the target repo, then `sha256sum` against that clone). State the command run and its output.

## Deletion gate

Per `repository-registry.yaml:77` (`deletion_gate: target_hash_verified`): the source path in `ChaosClubCo/abstrekkt` may only be archived or removed in a **separate, later, explicitly-approved change** after this receipt's `verification_status` is `PASS`. This receipt alone does not authorize deletion.
