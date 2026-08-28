# DevEx Guardrails — FlashFusion

"Bumpers at the bowling alley": keep engineers out of the gutter without slowing
the strike. All enforced in CI / pre-commit, on by default.

## 1. Pre-commit secret scan (`.husky/pre-commit`)

Blocks commits containing known secret patterns:

- AWS keys (`AKIA…`)
- GitHub tokens (`ghp_…`)
- Stripe live keys (`sk_live_…`)
- Private keys (`-----BEGIN RSA PRIVATE KEY-----`)

If found: **❌ block commit** — "Secrets detected in [file]. Remove before
committing." If a secret was already committed: rotate it (or ask the platform
team to) and update the audit trail.

## 2. Coverage gate

```bash
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

`< 80%` → **❌ tests fail**, merge blocked.

## 3. SAST (static analysis)

Detects and **blocks on critical**: SQL injection (string-concatenated queries),
XSS (unsanitized HTML), weak crypto (MD5/DES), insecure deserialization, missing
input validation. Message: run `npm audit fix` or update `package.json`.

## 4. RLS verification (multi-tenant safety)

Required tests before merge:
1. User A **cannot** read User B's data.
2. User **cannot** bypass RLS via a direct API call.
3. Service account has properly **scoped** access.
4. Row-level policies cover **all** tables.

```bash
# Example: verify RLS prevents cross-user access
npm run test:rls   # fails the build if any cross-tenant read succeeds
```

## 5. CI quality-gate workflow (`.github/workflows/quality-gate.yml`)

Order: lint → typecheck → unit tests (`--coverage`) → secret scan → SAST → RLS
verification. Any step fails → **merge blocked**. AI-generated PRs are treated as
untrusted and run the same gate.

## 6. CODEOWNERS

Auto-request reviews from the owning team on protected paths; no self-merge on
security-sensitive files.
