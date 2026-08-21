# RG-01 Evidence Note

The successful candidate build artifact from GitHub Actions run `31977104955` contains:

- `package.json` SHA-256 `dd29e2e9154642ff33a63c66b79196f05232963b425c026e2f1663290ca889cf`
- `package-lock.json` SHA-256 `992551ebb4df726bf5e762a6005437f983a952caab6bb0c4fb68d5baad7e20ca`

The package declarations match the frozen candidate source package metadata. The branch workflow imports only this exact lockfile after hash and file-diff verification.

Local re-execution of the artifact test suite on Node 22 produced `26/26 PASS`.

Local `npm audit` could not reach `registry.npmjs.org` in the execution environment, so dependency vulnerability status is not promoted from historical evidence to a fresh PASS. RG-01 remains open until GitHub-hosted execution completes the audit.
