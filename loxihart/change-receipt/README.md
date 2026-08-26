# Loxihart ChangeReceipt v1

This package freezes the first Loxihart wedge: signed, machine-verifiable evidence that an authorized agent change was applied, tested, and read back from the provider.

## Frozen contract

- Schema ID: `https://abstrekkt.com/schemas/loxihart/change-receipt.v1.schema.json`
- Wire version: `loxihart.change-receipt.v1`
- Signature algorithm: Ed25519
- Verified verdict: requires a result commit, patch hash, tree hash, at least one zero-exit test, all checks passing, and provider read-back matching the result commit.
- Non-verified verdicts: require one or more stable failure reason codes.
- Boundary: receipts contain hashes and evidence references, never raw secrets, command output, patches, or credentials.

The fixtures are synthetic contract examples. They are not production receipts and their placeholder signatures are not cryptographically valid.

## Version policy

The v1 field set, required fields, verdict meanings, canonical signing payload, and validation rules are frozen. Any semantic or structural change requires a new schema ID and `schema_version` (v2 or later). Documentation-only clarifications may be merged into v1 only when they do not change accepted inputs, rejected inputs, signature verification, or meaning.

MVP implementations may consume this package but must not modify the v1 contract. Producers must canonicalize the complete receipt without `signature`, sign those UTF-8 bytes with Ed25519, prefix the base64url result with `base64url:`, then attach `signature`. Public keys belong in trusted runtime configuration; private keys must never be stored in this repository.

## Verification

```bash
npm test
```
