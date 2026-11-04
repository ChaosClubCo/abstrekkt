# CanonicalMemoryVerifier/v1

Status: FROZEN CANDIDATE  
Owner: Abstrekkt  
Canonical durable memory target: Mem  
Cross-system execution authority: n8n / ACP / TESSA

## Purpose

CanonicalMemoryVerifier/v1 is an authorization and validation layer for durable-memory mutations. It never becomes a storage authority and never silently promotes working notes into canonical memory.

## Input

A `MemoryCandidate/v1` object plus available source evidence and the current canonical Mem state for the subject.

## Decision pipeline

1. Validate the candidate envelope and schema.
2. Reject forbidden runtime classes, credentials, tokens, secrets, locks, leases, retry counters, pending transaction state, and idempotency state.
3. Resolve whether the source is authoritative enough for the claimed knowledge class.
4. Classify sensitivity and block unsafe projection targets.
5. Search canonical memory for duplicates, superseded records, and contradictions.
6. Compare source revision and freshness where available.
7. Canonically serialize the candidate and compute `proposal_hash = sha256:<hex>`.
8. Return exactly one decision: `ALLOW`, `DENY`, `REVIEW`, `NOOP`, or `FAILED`.
9. Only `ALLOW` may write to Mem.
10. After a Mem write, independently read back the stored record, canonicalize the observed value, compare hashes, and emit `MemoryReceipt/v1`.
11. A consequential write is not complete until reconciliation is `MATCH`.

## Decision rules

- `ALLOW`: candidate is supported, non-conflicting, policy-compliant, and authorized for durable memory.
- `DENY`: candidate violates schema, authority, sensitivity, or forbidden-class policy.
- `REVIEW`: evidence is materially ambiguous or contradicts canonical memory without enough authority to supersede it.
- `NOOP`: candidate is semantically equivalent to the current canonical record and would add no durable value.
- `FAILED`: verifier or target operation failed technically; never reinterpret as authorization.

## Promotion directions

- Notion -> Verifier -> Mem: allowed after verification.
- GitBook -> Verifier -> Mem: correction candidate only; never automatic authority inversion.
- GitHub governance -> Verifier -> Mem: allowed when bound to immutable repository evidence and consistent with frozen authority rules.
- Mem -> GitBook: approved documentation projection.
- Mem -> Basic Memory Cloud: cold export/recovery projection only when that service is active.

## Fail-closed invariants

- No automatic bidirectional memory synchronization.
- No raw private draft or source note is promoted merely because it exists in a connected workspace.
- No contradiction may silently overwrite a canonical record.
- No stale source may supersede a newer canonical decision without explicit review.
- No secret, provider token, runtime authorization, workflow lease, retry counter, or pending transaction belongs in Mem.
- Every successful write must produce immutable evidence sufficient to identify candidate, proposal hash, target record, decision, and reconciliation result.

## Automation contract

Automation may discover candidates and produce recommendations without operator involvement. Automatic durable writes are permitted only for classes explicitly allowlisted by policy and when all evidence is machine-verifiable. Ambiguous, sensitive, contradictory, or authority-changing candidates must return `REVIEW`.

Initial policy is conservative: automated cross-system discovery is read-only and produces drift reports. Promotion to Mem remains explicitly governed until a deployed n8n/ACP implementation passes its acceptance matrix.

## Acceptance matrix

1. Valid non-conflicting GovernancePolicy candidate -> ALLOW.
2. Exact semantic duplicate -> NOOP.
3. Candidate containing a runtime secret -> DENY.
4. Candidate containing lease/retry/idempotency runtime state -> DENY.
5. Stale source attempting to supersede newer canonical record -> REVIEW or DENY.
6. Contradictory equal-authority evidence -> REVIEW.
7. Unauthorized source attempting authority change -> DENY.
8. Mem write followed by matching readback -> MATCH receipt.
9. Mem write followed by mismatched readback -> MISMATCH receipt and incomplete operation.
10. GitBook and Basic Memory projections cannot mutate canonical authority.

All ten cases must pass in one bounded verification run before automated durable-memory promotion is enabled.
