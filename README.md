# Abstrekkt

This repository is the governed source and preservation boundary for **Abstrekkt publishing, public-site source, approved editorial artifacts, portfolio/press evidence, and historical material retained for provenance**.

It is **not** the canonical production repository for Loxihart runtime or product code. Loxihart operating/product ownership belongs in [`Krosebrook/Loxihart`](https://github.com/Krosebrook/Loxihart). Existing `loxihart/` paths in this repository are frozen historical/reference source until their migration and hash verification are complete.

## Start here

Repository work must follow this authority order:

1. [`AGENTS.md`](AGENTS.md) — mutation rules and agent bootstrap.
2. [`REPOSITORY.md`](REPOSITORY.md) — repository purpose, boundaries, and source-authority model.
3. [`repository-registry.yaml`](repository-registry.yaml) — machine-readable domain ownership.
4. [`project/CANON.md`](project/CANON.md) — canonical artifact registry **only for the legacy `project/` content/design corpus**.
5. [`docs/export/`](docs/export/) — forensic inventory, migration contradictions, and evidence receipts.

## Repository boundary

| Domain | Authority here | Notes |
| --- | --- | --- |
| Abstrekkt public/editorial | Canonical | Publishing, public-site source, press/portfolio, approved derivatives |
| `project/` design/content corpus | Canonical within its lane | Governed by `project/CANON.md` after repository-level routing |
| Loxihart runtime/product | External canonical | Owned by `Krosebrook/Loxihart`; local copies are frozen reference/history |
| FlashFusion historical material | Historical or subordinate-brand evidence | Classify by role and provenance, never by name alone |
| INT/Intinc | Excluded | Separate operating lane; repository residence does not grant authority |
| Private memoir/clinical/family source | Restricted | Never infer publication authority from presence in this repository |
| Vendored/imported systems | Noncanonical | Preserve provenance; do not silently promote into Abstrekkt architecture |

## Mutation rule

**Authority before cleanup.** Do not move, delete, rewrite, or promote material merely because its current path looks untidy. Establish ownership, preserve source revision/hash, migrate, verify target bytes, record a receipt, and only then archive or remove the old location.

The repository intentionally retains a large historical corpus. Clean architecture here means **explicit authority and verified provenance**, not pretending history never happened.
