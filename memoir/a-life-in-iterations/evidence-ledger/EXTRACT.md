# Evidence Ledger Extract

Distilled snapshot of the current ledger state for quick reference. Source of truth remains the canonical files in this directory.

## Protocol status

- Protocol is frozen and append-only.
- Blind cross-domain interpretation is blocked until all five initial records are frozen.

## Frozen controls

- Historical comparison window: **2015-01-01 through 2019-12-31** (inclusive).
- Canonical artifact precedence is deterministic and must be applied before promotion/scoring.
- Ownership/authentication is a prerequisite to admissibility and scoring.
- Missing evidence remains `NOT SCORED` (never treated as zero).

## Domain state extract

| Artifact | Domain | Current state | Next required action |
|---|---|---|---|
| WR-001 | Cognitive / Writing | Record 0 frozen: `UNVERIFIED / NOT ADMISSIBLE / NOT SCORED` | Locate an exact 2015-2019 writing artifact with provenance, preservation, and exposure history |
| COM-001 | Relational / Communication | Artifact not selected | Identify an authenticated 2015-2019 primary communication artifact |
| PHO-001 | Experiential / Photography | Artifact not selected | Identify an authenticated 2015-2019 photograph with date/location/person provenance |
| EDU-001 | Developmental / Education | Artifact not selected | Identify an authenticated 2015-2019 education artifact or work product |
| EMP-001 | Functional / Employment | Artifact not selected | Identify a primary authenticated 2015-2019 employment artifact |

## WR-001 frozen pre-assessment extract

- Artifact content is absent.
- Authentication/provenance/preservation are not established.
- Prior exposure/contamination are unknown.
- Initial scoring fields (`E/M/P/C`) are all `NOT SCORED`.
- Initial classification is `UNVERIFIED`.
- Initial record is frozen and must never be overwritten.

## Deviation extract

- `DEV-001` logged a repository routing correction from `Krosebrook/memoir-recorded` to `Krosebrook/abstrekkt`.
- Effect on scoring: none.
- Disposition: retain provenance and continue canonical mutations only in this repository.
