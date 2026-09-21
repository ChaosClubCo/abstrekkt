# Abstrekkt Production Trust Roadmap

This roadmap is dependency-driven. A phase exits only when its evidence gate is satisfied; dates and implementation enthusiasm do not substitute for proof.

## Phase 0 — Protect the credential and trust boundary

### Objective

Ensure untrusted pull-request code cannot obtain production/provider credentials and that protected source changes cannot bypass required deterministic checks.

### Entry conditions

- canonical repository and default branch identified;
- exact default-branch SHA recorded;
- current workflows and rulesets inspected.

### Deliverables

- uncredentialed PR verification;
- exact-head SHA checkout/read-back in production-trust conformance CI;
- required deterministic source/integrity checks;
- documented trusted-manual boundary for secret-bearing execution;
- investigation of workflow registration anomalies;
- ruleset review for required checks, approvals, and thread resolution.

### Exit gate

Every secret-bearing production workflow is demonstrably isolated from arbitrary PR/push execution, and the required main ruleset covers the deterministic trust gate with no unexplained execution-path anomalies.

### Evidence required

- ruleset JSON/state;
- workflow trigger definitions;
- exact-head CI run IDs;
- credential boundary documentation;
- blocker/incident records for anomalies.

### Blockers / dependencies

- current Loxihart production-release workflow is registering push-event failures despite source declaring `workflow_dispatch`; this requires resolution or authoritative explanation before Phase 0 closes;
- current main ruleset does not yet require the new Production Trust Conformance check;
- human approval/thread-resolution requirements are currently weak.

### Non-goals

- live provider behavior;
- production KMS signing;
- public runtime certification.

## Phase 1 — First genuine multi-provider behavioral proof

### Objective

Prove that Anthropic, OpenAI, and Gemini execute the same disposable behavior task under the same ACTIVE policy projection and are evaluated by deterministic code.

### Entry conditions

- Phase 0 exit gate PASS;
- first durable policy is ACTIVE and distribution-conformant;
- provider-neutral task/evidence/result/receipt contracts are VERIFIED;
- provider credentials are available only through the trusted execution boundary.

### Deliverables

- thin Anthropic runner;
- thin OpenAI runner;
- thin Gemini runner;
- isolated disposable fixture sandbox per provider;
- normalized action evidence;
- deterministic evaluator;
- `LiveAgentBehaviorConformanceReceipt/v1`.

### Exit gate

All selected providers have status `EXECUTED`, each executed evidence hash verifies, each deterministic verdict is PASS, `allProvidersExecuted=true`, and `behaviorallyConformant=true` on one exact source SHA.

### Evidence required

- provider/model IDs;
- adapter versions;
- task/projection hashes;
- normalized evidence;
- evidence SHA-256 values;
- live receipt ID/hash;
- trusted workflow/run identity.

### Blockers / dependencies

- real provider credentials and current API/model availability;
- provider runtime failures are INCONCLUSIVE rather than PASS.

### Non-goals

- production signing;
- canonical repository mutation by provider agents.

## Phase 2 — Real production signing root

### Objective

Establish externally custodied asymmetric production signing and offline verification.

### Entry conditions

- Phase 1 PASS;
- external KMS account/authority available;
- least-privilege signing identity design approved.

### Deliverables

- asymmetric `SIGN_VERIFY` key, preferably P-256 / ECDSA-SHA-256 where supported by the selected KMS contract;
- public-key retrieval and fingerprinting;
- `VerificationKeyRegistry/v1`;
- trusted/revoked/unknown-key semantics;
- offline verifier;
- real canonical checkpoint/signature receipt.

### Exit gate

Real KMS signing PASS, offline public-key verification PASS, tampered payload FAIL, revoked key FAIL, unknown key FAIL, and all evidence binds the same source SHA and payload hash.

### Evidence required

- KMS key ID/ARN metadata;
- public-key fingerprint;
- key-registry hash;
- payload hash;
- real signature;
- acceptance-test receipts.

### Blockers / dependencies

- KMS credentials/tool access;
- approved key lifecycle and rotation policy.

### Non-goals

- local/test signing presented as production evidence.

## Phase 3 — Deploy read-only provenance service

### Objective

Expose verification and lineage without granting mutation or signing authority.

### Entry conditions

- Phase 2 PASS;
- read-only service identity and hosting target defined.

### Deliverables

- ACTIVE registry/projection inspection;
- asset lineage/status inspection;
- checkpoint/signature verification;
- health endpoint;
- MCP-compatible read-only surface where useful;
- explicit absence of mutation/signing credentials.

### Exit gate

Runtime read-back confirms the exact deployed revision, health reports read-only mode and absent signing/mutation credentials, and verification smoke tests pass against real preserved evidence.

### Evidence required

- source SHA;
- deployment/version ID;
- published URL;
- runtime identity;
- health response;
- tool inventory;
- read-back/smoke-test receipt.

### Blockers / dependencies

- deployment environment;
- runtime identity/secret configuration;
- signed evidence from Phase 2.

### Non-goals

- promotion, append, or signing capabilities.

## Phase 4 — First Production Trust Receipt

### Objective

Produce the first top-level immutable trust decision from subordinate evidence rather than duplicated narrative claims.

### Entry conditions

- Phases 1–3 PASS on mutually compatible exact revisions/evidence identities.

### Deliverables

- `ProductionTrustReceipt/v1`;
- deterministic cross-reference validation;
- mismatch/downgrade reason codes.

### Exit gate

Every subordinate receipt hash, source SHA, registry projection, provider/task identity, signing payload, and deployment binding verifies consistently; overall verdict is computed deterministically.

### Evidence required

- immutable subordinate receipt IDs/hashes;
- source SHA;
- key registry hash/fingerprint;
- live behavior receipt;
- deployment/provenance verification evidence.

### Blockers / dependencies

- any missing or mismatched subordinate evidence.

### Non-goals

- replacing subordinate receipts with a monolithic duplicate blob.

## Phase 5 — Operational reliability, retention, and rotation

### Objective

Make trust evidence sustainable under retries, failures, retention limits, key rotation, and service degradation.

### Entry conditions

- first Production Trust Receipt PASS.

### Deliverables

- evidence retention policy;
- key rotation/revocation runbooks;
- backup/restore verification;
- idempotent receipt persistence;
- alerting and structured operational telemetry;
- incident/recovery semantics.

### Exit gate

Failure, recovery, rotation, and retention exercises produce deterministic evidence without rewriting historical receipts.

### Evidence required

- recovery drills;
- rotation receipts;
- restore validation;
- alert tests;
- retention-policy checks.

### Blockers / dependencies

- storage and observability ownership.

### Non-goals

- adding new asset classes before core reliability is proven.

## Phase 6 — Expand durable asset classes

### Objective

Apply the proven lifecycle to additional SKILL, POLICY, SOP, SCHEMA/CONTRACT, TEST/EVALUATION, and DOCUMENTATION assets.

### Entry conditions

- Phase 5 PASS;
- promotion and verification machinery stable.

### Deliverables

- evidence-backed promotion candidates;
- per-class acceptance contracts;
- deprecation/supersession semantics;
- registry lineage.

### Exit gate

New classes can move through `CANDIDATE -> PROMOTED -> TESTED -> VERIFIED -> ACTIVE -> DEPRECATED` with deterministic receipts and no provider-specific divergence.

### Evidence required

- occurrence references;
- promotion authority;
- source/content hashes;
- acceptance receipts;
- adapter projection conformance.

### Blockers / dependencies

- real repeated-use evidence for ordinary promotion.

### Non-goals

- promoting every repeated sentence into a bureaucracy collectible.

## Phase 7 — Product and UI integration

### Objective

Expose trust/evidence state in Abstrekkt product surfaces without weakening the underlying deterministic contracts.

### Entry conditions

- stable production trust APIs/receipts;
- accessibility and authorization model defined.

### Deliverables

- evidence inspector;
- claim/source/verification views;
- receipt lineage;
- stale/conflict indicators;
- accessible list/table fallbacks for graphs.

### Exit gate

Users can answer what happened, on which revision, under whose authority, with what evidence, and what remains unproven without privileged raw-storage access.

### Evidence required

- authorization tests;
- WCAG 2.2 AA-oriented checks;
- runtime integration tests;
- provenance read-back.

### Blockers / dependencies

- Phases 3–6 stable APIs and data contracts.

### Non-goals

- UI-generated trust decisions.

## Phase 8 — Scale and interoperability

### Objective

Support additional providers, repositories, environments, and external verifiers while preserving deterministic trust semantics.

### Entry conditions

- product integration and operational reliability PASS;
- stable versioning/compatibility policy.

### Deliverables

- provider/plugin conformance contract;
- multi-repository/runtime bindings;
- portability/export format;
- verifier compatibility suite;
- performance/cost controls.

### Exit gate

New integrations can prove contract compatibility without changing the core evaluator or weakening source/task/provider identity checks.

### Evidence required

- compatibility matrices;
- cross-implementation fixtures;
- load/latency results;
- cost/retention observations;
- interoperability receipts.

### Blockers / dependencies

- mature operational evidence from earlier phases.

### Non-goals

- scale for its own sake.
