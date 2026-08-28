# Loxihart Production Release Runbook — RG-01 through RG-04

## Frozen candidate

- Product: `loxihart-pilot-console`
- Frozen SHA: `a237db22e7159df2327d0b92ca624079ac124ff8`
- Frozen ref: `release/loxihart-pilot-console-rc-2026-08-16`
- Source branch at freeze: `loxihart-pilot-console-build`
- Release eligibility at freeze: `PENDING_RG01_RG04`

Never move the frozen ref. A new candidate requires a new ref and release-candidate record.

## Execution graph

```text
FREEZE / SAME-SHA
      |
      v
RG-01 Dependency Safety
      | FAIL => STOP
      v
RG-02 Authentication + Tenant Isolation
      | FAIL => STOP
      v
RG-03 Managed Signing-Key Custody
      | FAIL => STOP
      v
RG-04 Demo-Fallback Elimination
      | FAIL => STOP
      v
PRODUCTION-DATA-ELIGIBLE
```

The workflow entry point is `.github/workflows/loxihart-production-release.yml`.

Dispatch with:

```text
candidate_sha=a237db22e7159df2327d0b92ca624079ac124ff8
candidate_ref=release/loxihart-pilot-console-rc-2026-08-16
```

Required GitHub Actions secrets before RG-02+ can execute:

```text
LOXIHART_PROD_CANDIDATE_URL
LOXIHART_TENANT_A_TOKEN
LOXIHART_TENANT_B_TOKEN
LOXIHART_SIGNING_TEST_TOKEN
LOXIHART_PROD_TEST_TOKEN
```

No private signing key belongs in Actions secrets. RG-03 must exercise the managed signer through its runtime identity boundary.

## Same-SHA rule

Every job checks out the candidate SHA directly and executes:

```bash
test "$(git rev-parse HEAD)" = "$CANDIDATE_SHA"
```

Any mismatch is STOP.

Evidence root:

```text
evidence/production-readiness/<candidate-sha>/
```

Evidence from a different SHA is inadmissible.

## RG-01 — Dependency Safety

Exact commands:

```bash
cd loxihart/pilot-console
test -f package-lock.json
npm ci
npm audit --json > dependency-audit.json
npm test
npm run build
```

Workflow policy is strict until a versioned disposition mechanism exists: any High or Critical audit finding fails RG-01.

Evidence:

```text
evidence/production-readiness/<sha>/rg-01/
├── dependency-audit.json
├── vulnerability-summary.json
├── test-results.txt
├── build-result.txt
└── gate-result.json
```

PASS requires lockfile, reproducible install, zero High/Critical, tests PASS, build PASS, and the frozen SHA in the gate result.

STOP on any failure. RG-02 must not run.

## RG-02 — Authentication + Tenant Isolation

Required candidate entry point:

```text
loxihart/pilot-console/tests/release/rg02-tenant-isolation.test.mjs
```

Exact command:

```bash
node --test loxihart/pilot-console/tests/release/rg02-tenant-isolation.test.mjs
```

Required environment:

```text
LOXIHART_PROD_CANDIDATE_URL
LOXIHART_TENANT_A_TOKEN
LOXIHART_TENANT_B_TOKEN
EVIDENCE_OUT
```

Minimum cases:

```text
AUTH-01 anonymous -> 401
AUTH-02 invalid -> 401
AUTH-03 revoked/expired -> deny
AUTH-04 valid same-tenant -> allow
AUTH-05 forged client actor/tenant -> ignore or deny
AUTH-06 valid identity without capability -> 403
TEN-01 A -> A pilot read/mutate -> allow
TEN-02 A -> B pilot read/mutate -> deny
TEN-03 A -> B evidence read/append -> deny
TEN-04 A -> B receipt read -> deny
TEN-05 A -> B stream read -> deny
TEN-06 B -> A symmetric cases -> deny
RLS-01 A -> B SELECT -> deny
RLS-02 A -> B INSERT -> deny
RLS-03 A -> B UPDATE -> deny
RLS-04 A -> B DELETE -> deny
```

Evidence:

```text
evidence/production-readiness/<sha>/rg-02/
├── auth-matrix.json
├── tenant-isolation-matrix.json
├── rls-results.json
├── negative-tests.json
└── gate-result.json
```

Any cross-tenant success is immediate STOP. Missing test file, credentials, or RLS evidence is STOP, never SKIP/PASS.

## RG-03 — Managed Signing-Key Custody

Required candidate entry point:

```text
loxihart/pilot-console/tests/release/rg03-managed-signing.test.mjs
```

Exact command:

```bash
node --test loxihart/pilot-console/tests/release/rg03-managed-signing.test.mjs
```

Static source check:

```bash
grep -RInE --exclude-dir=.git --exclude-dir=node_modules \
  'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|privateKeyJwk|private_key' loxihart
```

Expected grep exit code: `1`.

Minimum runtime cases:

```text
KEY-01 managed signer signs production-like receipt
KEY-02 application cannot retrieve private key
KEY-03 unauthorized signer denied
KEY-04 tampered payload fails
KEY-05 tampered signature fails
KEY-06 unknown key ID fails safely
KEY-07 K1 receipt verifies
KEY-08 rotate K1 -> K2
KEY-09 K2 receipt verifies
KEY-10 historical K1 receipt still verifies
```

Evidence:

```text
evidence/production-readiness/<sha>/rg-03/
├── private-key-scan.txt
├── key-custody-config.json
├── signing-tests.json
├── tamper-tests.json
├── rotation-test.json
├── historical-verification.json
└── gate-result.json
```

Private key exposure, unauthorized signing, tamper acceptance, failed rotation, or failed historical verification is STOP.

## RG-04 — Demo-Fallback Elimination

Required candidate entry point:

```text
loxihart/pilot-console/tests/release/rg04-demo-fallback.test.mjs
```

Exact command:

```bash
node --test loxihart/pilot-console/tests/release/rg04-demo-fallback.test.mjs
```

Static executable-path scan:

```bash
grep -RInE --exclude-dir=.git --exclude-dir=node_modules \
  'lakeview-public-demo-v1|STAGING_DEMO_TOKEN|operator:kyle-demo|org-lakeview-hvac|demo-ed25519-v1' \
  loxihart/pilot-console/src loxihart/pilot-console/netlify
```

Expected grep exit code: `1`.

Minimum runtime cases:

```text
DEMO-01 anonymous -> 401
DEMO-02 old Lakeview demo token -> 401
DEMO-03 invalid token -> 401
DEMO-04 demo organization header grants no authority
DEMO-05 demo actor header grants no authority
DEMO-06 valid production identity works according to policy
DEMO-07 valid user + forged tenant -> deny
DEMO-08 missing production auth configuration -> fail closed
```

Evidence:

```text
evidence/production-readiness/<sha>/rg-04/
├── demo-reference-scan.txt
├── production-auth-negative-tests.json
├── fail-closed-test.json
├── deployed-config-attestation.json
└── gate-result.json
```

Any functioning demo bypass/fallback or missing fail-closed proof is STOP.

## Final eligibility

The final CI job depends on `freeze`, `rg01`, `rg02`, `rg03`, and `rg04`. It may run only if every dependency succeeds.

Final condition:

```text
FREEZE=PASS
AND RG-01=PASS
AND RG-02=PASS
AND RG-03=PASS
AND RG-04=PASS
AND every candidateSha == a237db22e7159df2327d0b92ca624079ac124ff8
```

Only then may the candidate be marked `PRODUCTION-DATA-ELIGIBLE`.

## Invalidation

```text
dependency/lockfile change        => new SHA; rerun RG-01..RG-04
auth/tenant/RLS change           => new SHA; rerun RG-02..RG-04
signing/key policy change         => new SHA; rerun RG-03..RG-04
production auth/fallback config   => new SHA/config attestation; rerun RG-04
cosmetic UI-only change           => no security rerun only when proven unrelated
```

For a new candidate, create a new frozen ref and record. Never edit this candidate record to point to newer code.
