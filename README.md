# Abstrekkt

This repository is the governed source and preservation boundary for **Abstrekkt publishing, public-site source, approved editorial artifacts, portfolio/press evidence, and historical material retained for provenance**.

It is **not** the canonical production repository for Loxihart runtime or product code. Loxihart operating/product ownership belongs in [`ChaosClubCo/Loxihart`](https://github.com/ChaosClubCo/Loxihart). Existing `loxihart/` paths in this repository are frozen historical/reference source until their migration and hash verification are complete.

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
| Loxihart runtime/product | External canonical | Owned by `ChaosClubCo/Loxihart`; local copies are frozen reference/history |
| FlashFusion historical material | Historical or subordinate-brand evidence | Classify by role and provenance, never by name alone |
| INT/Intinc | Excluded | Separate operating lane; repository residence does not grant authority |
| Private memoir/clinical/family source | Restricted | Never infer publication authority from presence in this repository |
| Vendored/imported systems | Noncanonical | Preserve provenance; do not silently promote into Abstrekkt architecture |

## Production trust status

The production-trust layer uses strict maturity states. `IMPLEMENTED`, `VERIFIED`, `DEPLOYED`, and `CERTIFIED` are not synonyms and are never inferred from one another.

Audit base for the first production-trust conformance build: `6fbfada9cfd164b08c6941622d882b07c8fde71f`.

| Area | State | Current evidence boundary |
| --- | --- | --- |
| Durable verification-before-completion policy | IMPLEMENTED | Canonical policy, registry source, and acceptance suite under `governance/trust/` |
| Deterministic behavioral evaluator | IMPLEMENTED | Provider-neutral evaluator with fail-closed revision/task/projection/provider binding |
| Distribution conformance | IMPLEMENTED | Anthropic/OpenAI/Gemini adapter projections and deterministic receipt contract; exact-head CI evidence required for VERIFIED |
| Live multi-provider behavioral execution | BLOCKED | No live provider execution receipt has been produced by this layer |
| Production signing | BLOCKED | No external production KMS signature evidence exists in this layer |
| Provenance service | BLOCKED | Read-only provenance runtime is not deployed by this layer |
| Exact live runtime revision | INCONCLUSIVE | Existing deployment workflow is candidate-SHA-aware, but runtime read-back/version evidence is a separate gate |
| Production certification | BLOCKED | Requires compatible live behavior, signing, provenance, and deployment evidence |

See [`docs/PRODUCTION_TRUST_ARCHITECTURE.md`](docs/PRODUCTION_TRUST_ARCHITECTURE.md), [`docs/DOCUMENTATION_STANDARDS.md`](docs/DOCUMENTATION_STANDARDS.md), and [`ROADMAP.md`](ROADMAP.md).

## Mutation rule

**Authority before cleanup.** Do not move, delete, rewrite, or promote material merely because its current path looks untidy. Establish ownership, preserve source revision/hash, migrate, verify target bytes, record a receipt, and only then archive or remove the old location.

The repository intentionally retains a large historical corpus. Clean architecture here means **explicit authority and verified provenance**, not pretending history never happened.
