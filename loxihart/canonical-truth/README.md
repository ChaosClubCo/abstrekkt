# Loxihart Canonical Truth Mutation Gate

`createCanonicalMutationCommandHandler()` is the sole mutation entrypoint. It verifies a fresh Ed25519-signed `canonical-truth.acceptance.v1` result before any autonomous command can reach storage.

Version 0.3 adds a production D1 adapter at `@loxihart/canonical-truth/d1`. The adapter commits canonical state, the one-time conformance claim, the operation record, and the allowed receipt in one D1 batch guarded by compare-and-swap and a database constraint. Exact retries return the stored outcome; a reused result, changed head, conflicting operation ID, inactive signer, or failed atomic guard is denied.

```js
import { createCanonicalMutationCommandHandler } from "@loxihart/canonical-truth";
import { createD1CanonicalStateAdapter } from "@loxihart/canonical-truth/d1";

const atomicMutationStore = createD1CanonicalStateAdapter({
  database: env.DB,
  transition(currentState, mutation) {
    return applyCanonicalTransition(currentState, mutation);
  },
});

const handler = createCanonicalMutationCommandHandler({
  atomicMutationStore,
  trustedPublicKeys,
  policyVersion: "canonical-policy.v1",
  releaseLineage,
  environment: "production",
  clock: { now: () => new Date() },
});
```

Apply `sql/d1/0001_canonical_state.sql` before starting the handler. Replace the seeded policy, lineage, and environment in a reviewed migration when release configuration changes. Register trusted Ed25519 public keys in `canonical_trusted_signers`; private keys must never enter this process, database, or repository.

The runtime status method is read-only. It reports database state but cannot authorize or execute a mutation.

```bash
npm test
```
