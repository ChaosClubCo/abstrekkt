# Cloudflare Agent Readiness Roadmap

**Status:** Certification in progress  
**Last updated:** 2026-08-27  
**Production mutation gate:** `productionMutationPermitted = false`

## Objective

Establish machine-verifiable provenance, configuration validity, dry-run safety, and immutable evidence for every Cloudflare production resource before allowing an agent to mutate production.

The terminal artifact is `CloudflareAgentReadinessReceipt/v1`. Production mutation remains denied until every required gate below passes against one coherent source/runtime state.

## Current Snapshot

### Verified or strongly established

- `flashnframe`: production Worker deployment directly binds to Git SHA `fc1431430638943f363aaaa5c109f7117940d016` in `ChaosClubCo/flashnframe-app`.
- `flashnframe-staging`: source/config relationship established through the FlashnFrame repository and staging workflow; final receipt must still bind the exact runtime deployment state.
- `containers-template`: repository discovered at `ChaosClubCo/containers-template`; Wrangler configuration exists and Cloudflare deployment history records Wrangler deployment.
- `abstrekkt`: repository and Wrangler deployment lineage established; exact deployed source SHA still requires final binding.
- `loxihart-composio-webhook`: implementation/provisioning evidence exists under `tooling/webhook-receiver`; exact deployed SHA remains to be proven.
- Browser Rendering classification has been completed in the readiness investigation.

### Explicitly unresolved

- `creator-ecosystem-mcp-gateway`: API-created Worker; no repository provenance has yet been proven.
- `infinite-heros-bedtime-chronicles-v5`: Cloudflare resource was created from a dashboard template while the similarly named GitHub application is Vercel-oriented. Name equality is not accepted as provenance.
- Production Pages project/deployment to repository/SHA binding.
- Final exhaustive Worker binding and route evidence reconciliation.
- Wrangler version and authenticated identity receipt for the final execution environment.
- Per-repository validation, builds/tests, and non-mutating deployment dry-runs.
- Final evidence hashing and immutable readiness receipt.

## Certification Invariants

1. **No inferred provenance.** A resource name matching a repository is insufficient.
2. **No cross-account ambiguity.** Every Cloudflare evidence operation must explicitly assert the intended account before execution.
3. **No production mutation during certification.** Validation must remain read-only or use non-mutating dry-run mechanisms until the terminal gate passes.
4. **One coherent revision per source.** Config, tests, build, dry-run, and evidence hashes must reference the same exact Git SHA.
5. **Runtime/source drift fails closed.** Any drift after evidence collection invalidates certification and requires the affected gates to rerun.
6. **Negative evidence is evidence.** API-created, dashboard-created, repositoryless, or externally managed resources must be classified explicitly rather than assigned speculative repositories.
7. **Receipts are derived from evidence.** `productionMutationPermitted` must not be manually flipped.

## Roadmap

### CF-01 — Freeze Resource Inventory

**Goal:** Produce the canonical Cloudflare production inventory.

Required evidence:

- All Workers/scripts.
- Individual Worker bindings.
- Individual Worker routes/custom domains.
- Worker deployment/version metadata.
- Pages projects and production deployments.
- Browser Rendering resources/classification.
- Workers AI inventory/classification.
- Relevant account-level resources used by the Workers.

**Exit criteria:** inventory is exhaustive, timestamped, account-bound, and hashable.

### CF-02 — Resolve 7/7 Worker Provenance

For every Worker, assign exactly one provenance class:

- `REPOSITORY_BOUND`
- `API_CREATED_WITH_SOURCE_ARTIFACT`
- `DASHBOARD_TEMPLATE`
- `EXTERNALLY_MANAGED`
- `REPOSITORYLESS`
- `UNRESOLVED`

For repository-bound Workers capture:

- repository owner/name;
- exact Git SHA;
- config path;
- entrypoint path;
- deployment workflow/script;
- Cloudflare deployment/version ID;
- evidence demonstrating the relationship.

Priority work:

1. Bind `abstrekkt` to an exact deployed SHA.
2. Bind `loxihart-composio-webhook` provisioning/deployment to an exact SHA.
3. Resolve or explicitly classify `creator-ecosystem-mcp-gateway`.
4. Preserve the dashboard-template classification for the Bedtime Worker unless contrary evidence is discovered.
5. Reconcile `containers-template` exact current source revision with the live Worker.
6. Reconfirm FlashnFrame production and staging runtime bindings.

**Exit criteria:** 7/7 Workers have a non-speculative provenance classification and no `UNRESOLVED` entries remain.

### CF-03 — Resolve Pages Provenance

Capture for every relevant Pages project:

- project name;
- production URL/custom domains;
- production deployment ID;
- source provider/repository;
- branch;
- exact commit SHA where available;
- build command;
- output directory;
- environment bindings relevant to deployment.

Cross-check GitHub Pages/Cloudflare Pages assumptions. Repository metadata indicating `has_pages=true` is not itself proof of which platform serves production.

**Exit criteria:** every production Pages surface maps to an authoritative source or is explicitly classified as externally managed.

### CF-04 — Freeze `CloudflareResourceSourceManifest/v1`

Create a machine-readable manifest joining:

`Cloudflare resource -> deployment/version -> bindings/routes -> provenance class -> repository -> exact SHA -> config/workflow evidence`

The manifest becomes the input contract for subsequent validation.

**Exit criteria:** schema-valid manifest, zero unresolved resources, SHA-256 recorded.

### CF-05 — Verify Execution Identity

Capture from the exact environment intended for future Cloudflare operations:

- `wrangler --version`;
- `wrangler whoami`;
- authenticated account identifier;
- explicit assertion that the account equals the production account expected by the manifest;
- Node/package-manager versions where repository tooling depends on them.

**Fail closed** on account mismatch.

### CF-06 — Repository Validation Matrix

For each repository represented in the source manifest, at its frozen SHA:

1. install dependencies using the lockfile-preserving command;
2. validate Wrangler/config schemas;
3. run typecheck;
4. run lint where configured;
5. run repository tests;
6. build production artifacts;
7. run security/dependency checks defined by the repository;
8. verify the working tree remains clean.

Do not suppress failures merely to obtain a green matrix.

**Exit criteria:** every applicable static gate passes at the exact manifest SHA.

### CF-07 — Non-Mutating Cloudflare Dry-Runs

For each repository/deployable Worker:

- run the repository-supported Wrangler deployment dry-run/config validation;
- capture resolved bindings and compatibility settings;
- verify expected routes/resource names;
- confirm no deployment/version/resource mutation occurred;
- compare dry-run configuration with the frozen Cloudflare inventory.

**Exit criteria:** every deployable target passes dry-run with no source/runtime configuration contradiction.

### CF-08 — Runtime Drift Reconciliation

Immediately before certification, re-read:

- Worker deployments/versions;
- bindings;
- routes/custom domains;
- Pages production deployments;
- repository HEAD/SHA state relevant to the candidate.

Compare with `CloudflareResourceSourceManifest/v1`.

**Exit criteria:** zero unexplained drift. Any drift invalidates affected downstream evidence.

### CF-09 — Evidence Bundle and Hashes

Persist normalized evidence for every gate. Compute SHA-256 for:

- resource inventory;
- provenance manifest;
- identity/account assertion;
- repository validation results;
- dry-run results;
- drift reconciliation;
- final receipt payload.

Evidence must be sufficient for an independent verifier to reproduce the verdict without trusting prose summaries.

### CF-10 — Issue `CloudflareAgentReadinessReceipt/v1`

Minimum receipt fields:

```json
{
  "schema": "CloudflareAgentReadinessReceipt/v1",
  "productionMutationPermitted": false,
  "accountAssertion": "PASS|FAIL",
  "resourceInventory": "PASS|FAIL",
  "workerProvenance": "PASS|FAIL",
  "pagesProvenance": "PASS|FAIL",
  "browserRenderingClassification": "PASS|FAIL",
  "workersAIClassification": "PASS|FAIL",
  "repositoryValidation": "PASS|FAIL",
  "nonMutatingDryRuns": "PASS|FAIL",
  "runtimeSourceDrift": "PASS|FAIL",
  "evidenceBundleSha256": "<sha256>"
}
```

`productionMutationPermitted` may derive to `true` only when every required certification gate is `PASS` and no unresolved or stale evidence remains.

## Mutation Authorization Rule

```text
resource inventory PASS
        -> 7/7 provenance PASS
        -> Pages provenance PASS
        -> source manifest frozen
        -> Wrangler identity PASS
        -> production account assertion PASS
        -> config/type/lint/tests/build PASS
        -> non-mutating dry-runs PASS
        -> runtime/source drift PASS
        -> evidence hashes frozen
        -> CloudflareAgentReadinessReceipt/v1 PASS
        -> productionMutationPermitted = true
```

Until that sequence completes:

```text
productionMutationPermitted = false
```

## After Certification

Certification authorizes controlled production operations; it does not authorize arbitrary mutation. Production writes should additionally require:

- explicit target resource;
- bounded intended change;
- pre-mutation state capture;
- change preview/diff where supported;
- rollback strategy;
- post-mutation independent readback;
- immutable mutation receipt;
- idempotency/replay protection for automated operations.

## Definition of Done

Cloudflare agent readiness is complete only when an independent reviewer can start with the final receipt and evidence bundle and prove:

1. which production resources exist;
2. where every deployable resource came from;
3. which exact source revision produced the candidate configuration;
4. which authenticated Cloudflare account was targeted;
5. that source/config/tests/builds passed;
6. that deployment dry-runs were non-mutating and coherent with runtime state;
7. that no source/runtime drift occurred before receipt issuance; and
8. that `productionMutationPermitted=true` was mechanically derived from those facts.