# RG-01 Evidence Note

## Frozen-candidate provenance

The successful candidate build artifact from GitHub Actions run `31977104955` contains:

- original `package.json` SHA-256 `dd29e2e9154642ff33a63c66b79196f05232963b425c026e2f1663290ca889cf`
- original `package-lock.json` SHA-256 `992551ebb4df726bf5e762a6005437f983a952caab6bb0c4fb68d5baad7e20ca`

The package declarations matched the frozen candidate source package metadata. The exact artifact lockfile was imported after hash and file-diff verification, restoring reproducible installation evidence.

## First reproducible RG-01 execution

GitHub-hosted execution proved:

- committed lockfile: PASS
- `npm ci`: PASS
- existing tests: `26/26 PASS`
- production build: PASS
- dependency audit: FAIL (`5 HIGH`, `2 LOW`, `0 CRITICAL`)

The high-severity dependency chain resolved to `@netlify/functions` 4.x and its transitive dependencies (`@netlify/blobs`, `@netlify/dev-utils`, `extract-zip`, `image-size`). The npm audit result identified `@netlify/functions@6.0.0` as the supported remediation path.

## Remediation candidate

The remediation workflow upgraded the direct dependency to exact `@netlify/functions@6.0.0` and committed the resulting package metadata/lockfile at branch commit `55c44bd208b8c95b7f352c8189b3fc2d396ed735` only after its guarded install/audit/test/build path reached the commit step.

This note intentionally does **not** mark RG-01 PASS. A normal GitHub-hosted RG-01 evidence run must execute against the upgraded branch state and prove HIGH/CRITICAL = 0, tests PASS, and production build PASS.
