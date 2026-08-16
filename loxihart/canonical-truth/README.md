# Loxihart Canonical Truth Mutation Gate

`createCanonicalMutationCommandHandler()` is the package's sole public entrypoint. Startup fails closed unless the runtime supplies a canonical store, transaction manager, replay store, immutable receipt sink, clock, policy/release/environment bindings, and at least one trusted Ed25519 public key.

Every command must explicitly declare `executionMode: "AUTONOMOUS"`, use an `agent:` actor, and carry a fresh signed `canonical-truth.acceptance.v1` result. The handler then locks and rechecks the canonical head, atomically consumes the result ID, applies the mutation, and appends its receipt in the transaction.

Production private keys must never enter this process or repository. Supply only signer public keys through the deployment secret/configuration system and parse them with `parseTrustedPublicKeys()`.

```bash
npm test
```

This package deliberately does not ship in-memory or filesystem production adapters. The service owning canonical state must inject adapters backed by the same transactional database so replay consumption, mutation, and the allowed receipt commit atomically.
