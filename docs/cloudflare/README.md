# Cloudflare Readiness Evidence

The canonical frozen resource/source classification is `CloudflareResourceSourceManifest.v1.json`.

The manifest distinguishes **provenance classification** from **exact source-SHA binding**. A resource can be fully classified as API-created, dashboard-template, or repositoryless without pretending it came from a Git repository.

Current certification gate remains:

```text
productionMutationPermitted = false
```

The next gates are exact-SHA closure where applicable, Wrangler identity/account assertion, repository validation, non-mutating dry-runs, runtime/source drift reconciliation, evidence hashing, and `CloudflareAgentReadinessReceipt/v1`.
