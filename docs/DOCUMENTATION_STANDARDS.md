# Documentation Standards

## Purpose

Documentation in Abstrekkt is part of the evidence layer. It must help another reviewer determine what exists, what was verified, which revision was involved, what authority applied, and what remains unproven.

## Claim states

Use these states precisely:

- `IMPLEMENTED`: source or configuration exists.
- `VERIFIED`: deterministic checks passed for an identified revision.
- `DEPLOYED`: an identified runtime is serving the referenced revision.
- `CERTIFIED`: the complete defined trust/release gate passed.
- `BLOCKED`: a named dependency prevents progress.
- `INCONCLUSIVE`: a validation attempt ran but could not produce a meaningful verdict.

For public/business claims, also preserve the project evidence classification when relevant: `VERIFIED`, `SUPPORTED`, `INTERNAL`, `PROVISIONAL`, `HISTORICAL`, or `UNVERIFIED`.

Do not silently translate one vocabulary into the other. Engineering maturity describes system state; claim classification describes evidentiary support.

## One canonical source per fact

Every durable fact must have one canonical owner. Secondary documents should link to or identify the canonical source rather than copy mutable values.

Examples:

- code/runtime behavior -> source + tests;
- asset lifecycle -> durable asset registry;
- branch requirements -> GitHub ruleset;
- release candidate -> release receipt;
- runtime revision -> deployment binding receipt;
- public claim -> evidence/claim registry where available.

If two sources conflict, record the contradiction. Do not pick whichever version is more convenient.

## Volatile facts

Volatile facts should include, where applicable:

- `source`;
- `checked_at`;
- `verification_method`;
- `refresh_interval` or expiry semantics;
- exact environment/runtime identity.

Examples include model IDs, provider API assumptions, plan limits, pricing, deployment URLs, credential scopes, branch/ruleset state, and third-party lifecycle status.

## Revision-bound evidence

Any document that says a check passed must identify enough evidence to reproduce or inspect the claim:

- repository SHA;
- workflow/test name;
- workflow run or receipt ID where available;
- artifact/evidence SHA-256 where applicable;
- schema/contract version;
- deployment/version ID for runtime claims.

Do not describe a branch name such as `main` as immutable evidence. Record the exact SHA observed at the time.

## Generated evidence

Generated evidence is not documentation until it actually exists. Never link to an expected generated file that has not been created and preserved.

Receipts must be append-only historical evidence. Do not edit an old receipt to represent a new run.

## GitBook publication boundary

The public GitBook publication surface is intentionally narrow and repository-controlled.

- GitBook imports only from `docs/gitbook/public`, as defined by the root `.gitbook.yaml`.
- `docs/gitbook/public/SUMMARY.md` is the explicit navigation authority for the published GitBook. A public page is not considered part of the intended navigation until it is linked from `SUMMARY.md`.
- Any change that adds, renames, moves, or removes a public GitBook page must update `SUMMARY.md` in the same change when navigation is affected.
- Externally publishable architecture, engineering guidance, and approved project documentation belong under `docs/gitbook/public`.
- Internal registries, evidence and receipts, operational notes and runbooks, unpublished drafts, investigation material, and security-sensitive working documentation must remain outside `docs/gitbook/public`.
- `docs/gitbook/registry` is not part of the public publication root and must remain non-public unless an explicit publication decision changes that boundary.
- Do not broaden `.gitbook.yaml` to `docs`, the repository root, or another larger subtree merely to make a page visible. Move or curate approved public content into `docs/gitbook/public` instead.
- A decision to widen the GitBook publication root is an architecture and information-boundary change and should be reviewed as such.

This separation is a publication control, not a claim that content outside the public root is secret. Sensitive material must still follow the security rules below.

## Security-sensitive documentation

Documentation may name credential variables but must never include their values. Examples:

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- deployment tokens
- KMS key IDs/ARN metadata where disclosure is permitted

Never include private keys, OAuth secrets, passwords, session tokens, backup codes, environment dumps, or credential-bearing screenshots.

When describing a credential boundary, distinguish:

- configured;
- authenticated;
- tested;
- operational.

They are not synonyms, despite decades of software documentation trying very hard to make them so.

## API and provider assumptions

For current external APIs, models, pricing, lifecycle, limits, and security guidance:

1. prefer current primary/official sources;
2. record the date checked;
3. separate provider API translation from project policy/verdict logic;
4. mark assumptions PROVISIONAL until exercised when runtime behavior matters.

## Required architecture topics

Production-relevant architecture documentation should identify:

- purpose and scope;
- data/control flow;
- lifecycle/state machine;
- authority boundaries;
- credential boundaries;
- deterministic versus model-controlled decisions;
- failure semantics;
- retry/idempotency behavior where applicable;
- logging/observability;
- evidence retention;
- deployment proof requirements;
- current blockers and non-goals.

## ADR threshold

Create an ADR when a decision is durable, non-obvious, expensive to reverse, or establishes a security/trust boundary.

An ADR should contain:

- decision;
- context;
- alternatives considered;
- consequences;
- reversibility;
- verification/evidence expectations;
- status and date.

## Runbooks

Operational runbooks must distinguish preparation, execution, verification, rollback/recovery, and evidence preservation. A command returning zero is not sufficient runtime proof when the operation has an external effect.

## Roadmaps

Roadmaps are dependency-driven. Each phase requires:

- Objective
- Entry conditions
- Deliverables
- Exit gate
- Evidence required
- Blockers/dependencies
- Non-goals where scope can drift

Calendar quarters may be recorded for coordination, but dates do not replace exit gates.

## Completion reports

Every production/release completion report ends with a `CLAIMS CHECK` containing at least:

- Implemented
- Verified
- Merged
- Exact SHA
- CI jobs
- Artifacts preserved
- Live provider execution
- Production signing
- Deployment
- Certified: YES/NO
- Blocked by

Missing evidence must remain explicit rather than being compressed into a broad `done` statement.
