# Protocol Deviation Log

## DEV-001 — Repository routing correction

- Date: 2026-08-26
- Artifacts affected: ledger control records and WR-001 Record 0
- What occurred: initial ledger records were written to `Krosebrook/memoir-recorded` before the canonical destination was corrected to `Krosebrook/abstrekkt`.
- Effect on scoring: none. No blind E/M/P/C assessment occurred.
- Disposition: RETAIN provenance; canonicalize the Abstrekkt copy; cease future ledger mutations in the staging repository.

## Future deviation fields

- Date/time
- Artifact(s) affected
- Frozen rule implicated
- What occurred
- Before/after initial score freeze
- Potential effect
- Disposition: RETAIN / QUALIFY / EXCLUDE

Never edit an earlier assessment to conceal a deviation.
