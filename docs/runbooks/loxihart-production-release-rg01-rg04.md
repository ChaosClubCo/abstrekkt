# Loxihart Production Release Runbook — RG-01 through RG-04

## Frozen candidate

- Product: `loxihart-pilot-console`
- Frozen SHA: `a237db22e7159df2327d0b92ca624079ac124ff8`
- Frozen ref: `release/loxihart-pilot-console-rc-2026-08-16`
- Source branch at freeze: `loxihart-pilot-console-build`
- Release status at freeze: `PENDING_RG01_RG04`

The frozen ref is evidence only. Never move it to a newer commit. A new candidate requires a new release-candidate record/ref and a complete rerun of every affected gate.

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

Implementation work may happen in parallel, but certification does not. A downstream gate is valid only when every upstream gate is PASS for the exact same candidate SHA.

## Workflow entry point

Workflow file:

`.github/workflows/loxihart-production-release.yml`

Dispatch inputs:

- `candidate_sha`: exact 40-character commit SHA.
- `candidate_ref`: human-readable frozen release ref.

Current default candidate:

```text
a237db22e7159df2327d0b92ca624079ac124ff8
```

Required GitHub Actions secrets before RG-02+ can execute:

```text
LOXIHART_PROD_CANDIDATE_URL
LOXIHART_TENANT_A_TOKEN
LOXIHART_TENANT_B_TOKEN
LOXIHART_SIGNING_TEST_TOKEN
LOXIHART_PROD_TEST_TOKEN
```

No private signing key belongs in GitHub Actions secrets for this run. RG-03 must exercise the managed signer through its production-like API/identity boundary rather than loading signing key material into the test process.

## Same-SHA invariant

Every job checks out `candidate_sha` directly and executes:

```bash
test "$(git rev-parse HEAD)" = "$CANDIDATE_SHA"
```

Any mismatch is an unconditional STOP.

All evidence is namespaced under:

```text
evidence/production-readiness/<candidate-sha>/
```

A gate result is admissible only when its `candidateSha` equals the frozen SHA. Evidence from another SHA is never reused.

---

# RG-01 — Dependency Safety

## Commands

Working directory:

```bash
cd loxihart/pilot-console
```

Release sequence:

```bash
test -f package-lock.json
npm ci
npm audit --json > dependency-audit.json
npm test
npm run build
```

The workflow additionally parses `metadata.vulnerabilities` from `npm audit --json` and fails when:

```text
critical > 0 OR high > 0
```

A future explicit vulnerability-disposition mechanism may replace this strict rule only if it is itself versioned, reviewed, expiring, and included in the evidence artifact. Until then High/Critical means STOP.

## Evidence

```text
evidence/production-readiness/<sha>/rg-01/
├── dependency-audit.json
├── vulnerability-summary.json
├── test-results.txt
├── build-result.txt
└── gate-result.json
```

## PASS

All must hold:

- `package-lock.json` exists on the candidate SHA.
- `npm ci` succeeds.
- zero High vulnerabilities.
- zero Critical vulnerabilities.
- `npm test` succeeds.
- `npm run build` succeeds.
- `gate-result.json.status == PASS` for the frozen SHA.

## STOP

Stop the release immediately if any PASS condition is false. Do not execute RG-02.

---

# RG-02 — Authentication + Tenant Isolation

## Required candidate test entry point

The exact candidate SHA must contain:

```text
loxihart/pilot-console/tests/release/rg02-tenant-isolation.test.mjs
```

Run command:

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

The test suite must cover at minimum:

```text
AUTH-01 no credentials -> 401
AUTH-02 invalid credentials -> 401
AUTH-03 expired/revoked credentials -> deny
AUTH-04 valid tenant A identity -> tenant A resource allowed
AUTH-05 client-forged actor/tenant identity -> ignored or denied
AUTH-06 valid identity without capability -> 403
TEN-01 A -> A pilot read -> allow
TEN-02 A -> A mutation -> allow
TEN-03 A -> B pilot read -> deny
TEN-04 A -> B pilot mutation -> deny
TEN-05 A -> B evidence read/append -> deny
TEN-06 A -> B receipt read -> deny
TEN-07 A -> B stream read -> deny
TEN-08 B -> A symmetric cases -> deny
RLS-01 A -> persistence B SELECT -> deny
RLS-02 A -> persistence B INSERT -> deny
RLS-03 A -> persistence B UPDATE -> deny
RLS-04 A -> persistence B DELETE -> deny
```

The suite must write detailed machine-readable observations to `EVIDENCE_OUT` without writing reusable credentials.

## Evidence

```text
evidence/production-readiness/<sha>/rg-02/
├── auth-matrix.json
├── tenant-isolation-matrix.json
├── rls-results.json
├── negative-tests.json
└── gate-result.json
```

## PASS

- every unauthorized case is denied;
- every required same-tenant permitted case succeeds;
- client-supplied tenant/user identity is never authoritative;
- persistence/RLS independently enforces tenant isolation;
- all evidence identifies the same candidate SHA.

## STOP

Any cross-tenant read or mutation success is an unconditional release STOP. Missing test credentials, missing test entry point, or missing RLS evidence is also STOP, not SKIP/PASS.

---

# RG-03 — Managed Signing-Key Custody

## Required candidate test entry point

```text
loxihart/pilot-console/tests/release/rg03-managed-signing.test.mjs
```

Run command:

```bash
node --test loxihart/pilot-console/tests/release/rg03-managed-signing.test.mjs
```

Required environment:

```text
LOXIHART_PROD_CANDIDATE_URL
LOXIHART_SIGNING_TEST_TOKEN
EVIDENCE_OUT
```

Static repository gate:

```bash
grep -RInE --exclude-dir=.git --exclude-dir=node_modules \
  'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|privateKeyJwk|private_key' loxihart
```

Expected grep exit code: `1` (no match).

Runtime suite must cover:

```text
KEY-01 production receipt signs through managed signer
KEY-02 application/runtime cannot retrieve private key
KEY-03 unauthorized signer identity denied
KEY-04 tampered payload verification fails
KEY-05 tampered signature verification fails
KEY-06 unknown signing key ID fails safely
KEY-07 receipt signed with K1 verifies
KEY-08 rotate to K2
KEY-09 new receipt signed with K2 verifies
KEY-10 old K1 receipt still verifies after rotation
```

## Evidence

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

Evidence may contain public key IDs/fingerprints and signatures. It must never contain private signing material.

## PASS

- no private production key material is found in candidate source;
- managed signer signs successfully;
- unauthorized signing is rejected;
- tampering is detected;
- K1->K2 rotation works;
- historical K1 receipt remains verifiable;
- same candidate SHA recorded in gate result.

## STOP

Any private-key exposure, successful unauthorized signing, tamper acceptance, failed rotation, or historical-verification failure is STOP. RG-04 does not run.

---

# RG-04 — Demo-Fallback Elimination

## Required candidate test entry point

```text
loxihart/pilot-console/tests/release/rg04-demo-fallback.test.mjs
```

Run command:

```bash
node --test loxihart/pilot-console/tests/release/rg04-demo-fallback.test.mjs
```

Required environment:

```text
LOXIHART_PROD_CANDIDATE_URL
LOXIHART_PROD_TEST_TOKEN
EVIDENCE_OUT
```

Static executable-path scan:

```bash
grep -RInE --exclude-dir=.git --exclude-dir=node_modules \
  'lakeview-public-demo-v1|STAGING_DEMO_TOKEN|operator:kyle-demo|org-lakeview-hvac|demo-ed25519-v1' \
  loxihart/pilot-console/src loxihart/pilot-console/netlify
```

Expected grep exit code: `1`.

Runtime suite must cover:

```text
DEMO-01 no credentials -> 401
DEMO-02 old Lakeview demo token -> 401
DEMO-03 invalid token -> 401
DEMO-04 demo organization header grants no authority
DEMO-05 demo actor header grants no authority
DEMO-06 valid production identity succeeds according to policy
DEMO-07 valid user + forged tenant denied
DEMO-08 missing production auth configuration fails closed
```

## Evidence

```text
evidence/production-readiness/<sha>/rg-04/
├── demo-reference-scan.txt
├── production-auth-negative-tests.json
├── fail-closed-test.json
├── deployed-config-attestation.json
└── gate-result.json
```

## PASS

- no executable staging identity/fallback remains in production candidate paths;
- old demo credentials cannot authenticate;
- client-supplied demo identity headers confer no authority;
- production auth works;
- missing auth configuration fails closed;
- all evidence is for the frozen SHA.

## STOP

Any functioning demo bypass, fallback-to-demo behavior, or missing fail-closed proof is STOP.

---

# Final eligibility decision

The final `production-data-eligible` CI job depends on:

```text
freeze
rg01
rg02
rg03
rg04
```

GitHub Actions dependency semantics prevent the final job from running when any required gate fails.

Final release condition:

```text
FREEZE = PASS
AND RG-01 = PASS
AND RG-02 = PASS
AND RG-03 = PASS
AND RG-04 = PASS
AND every gate candidateSha == a237db22e7159df2327d0b92ca624079ac124ff8
```

Only then may the candidate be labeled:

```text
PRODUCTION-DATA-ELIGIBLE
```

## Invalidation / new candidate rule

Never move `release/loxihart-pilot-console-rc-2026-08-16`.

Any code/config/dependency change requires a new candidate SHA. Invalidation scope:

```text
dependency/lockfile change        => rerun RG-01..RG-04
auth/tenant/RLS change           => rerun RG-02..RG-04
signing/key policy change         => rerun RG-03..RG-04
production auth/fallback config   => rerun RG-04
cosmetic UI-only change           => no security-gate invalidation only when proven unrelated
```

For any new candidate, create a new frozen ref and release-candidate JSON instead of editing this record.
