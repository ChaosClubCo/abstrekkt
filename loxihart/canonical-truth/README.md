# Loxihart Canonical Truth Mutation Gate

This package is the enforcement boundary for autonomous canonical mutations.

`executeCanonicalMutation()` verifies a fresh Ed25519-signed conformance result before entering the mutation transaction, then locks and rechecks the canonical head, atomically consumes the result ID to prevent replay, applies the mutation, and appends an immutable decision receipt in the same transaction.

## Required runtime dependencies

- `canonicalStore` with `readHead`, `readHeadForUpdate`, and `applyMutation`
- transactional `replayStore.consumeOnce`
- transactional `receiptSink.append`
- transaction manager
- pinned trusted Ed25519 public keys supplied from the deployment secret/configuration system

Do not store private signing keys or production public-key configuration in this repository. Rotate trusted keys by adding a new `kid`, overlapping validation, then removing the retired key after all issued results expire.

## Verification

```bash
npm test
```

The handler denies mutations when signatures, freshness, suite identity, policy, release lineage, environment, canonical head, evidence hash, assertion completeness, or replay checks fail.
