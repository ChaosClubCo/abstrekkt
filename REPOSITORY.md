# Abstrekkt Repository Authority

## Purpose

`ChaosClubCo/abstrekkt` is the canonical repository for Abstrekkt publishing/public-site source, approved editorial artifacts, portfolio and press evidence, repository-level governance, and historical material retained for provenance.

Historical records that name `Krosebrook/abstrekkt` retain that path where it was true at the time; current operational authority is `ChaosClubCo/abstrekkt`, and historical provenance must not be rewritten.

It is also a preservation corpus. Repository residence alone does **not** make a file current, canonical, publishable, production-ready, or owned by Abstrekkt.

## Authority precedence

When sources disagree, apply authority in this order:

1. Explicit current repository/domain decision in this file or `repository-registry.yaml`.
2. Verified migration/deployment/release receipt bound to an exact source revision.
3. Domain-specific canonical registry, such as `project/CANON.md`.
4. Source-backed historical evidence.
5. Filename, path, repeated sibling references, generated summaries, or design polish.

Lower-precedence evidence cannot silently override higher-precedence authority.

## Domain boundaries

### Abstrekkt public/editorial

Canonical here. Includes public-site source, publishing, press/portfolio material, approved editorial derivatives, and governance describing the relationship between Abstrekkt and other operating entities.

### Legacy `project/` corpus

`project/CANON.md` remains authoritative for artifact identity, lifecycle, and design/content lanes **after** repository-level routing establishes that the requested work belongs to this domain.

Do not treat `project/CANON.md` as authority over Loxihart, INT/Intinc, external systems, or repository-level migration policy.

### Loxihart

`ChaosClubCo/Loxihart` owns Loxihart governance, product/runtime code, control plane, ChangeReceipt/canonical-truth implementation, Pilot Console, experiments, tests, migrations, release gates, and product evidence.

Historical records that name `Krosebrook/Loxihart` retain that path where it was true at the time; current operational authority is `ChaosClubCo/Loxihart`, and historical provenance must not be rewritten.

Existing `loxihart/` paths and Loxihart-specific branches in this repository are frozen migration sources or historical evidence. No feature, runtime, security, release, or product mutation should originate here.

Allowed Abstrekkt-side Loxihart work is limited to:

- migration inventories and receipts;
- source/target hash verification;
- historical provenance references;
- portfolio/publishing relationship material that does not duplicate runtime ownership;
- later archival/removal after target verification.

### FlashFusion

FlashFusion names must be classified by role and provenance. Historical company/business artifacts remain historical. Current subordinate product/platform references belong to the Loxihart authority domain. Fixed technical identifiers are not renamed merely for branding.

### INT / Intinc

Excluded from Abstrekkt authority. Historical mixed-corpus presence is not permission to edit, publish, import, or treat the material as an Abstrekkt asset.

### Private memoir / clinical / family material

Restricted. Presence is not publication authority. Raw private sources must not be promoted into public surfaces without explicit derivative/publication approval and applicable redaction/protection rules.

### Vendored/imported systems

Noncanonical unless an explicit decision promotes them. Preserve provenance and licenses; do not refactor them as if they were first-party Abstrekkt code merely because they are committed here.

## Migration invariant

No source artifact is physically removed or rewritten as historical-only until all applicable conditions pass:

1. target owner is explicit;
2. source repository, revision, path, and hash are recorded;
3. target path is created from the intended source revision;
4. target bytes/hash are independently read back;
5. source and target hashes match, or a documented transformation receipt explains the difference;
6. target repository governance accepts the artifact;
7. migration receipt is committed;
8. only then may the old source be archived or removed in a separate cleanup change.

## Deployment authority

A provider project, config file, successful build, or domain label is not deployment proof by itself.

A current Abstrekkt deployment claim requires an exact-SHA receipt containing at minimum:

- repository and commit SHA;
- provider and provider project/site identifier;
- deployment identifier;
- public URL/domain;
- deployment timestamp;
- verification timestamp;
- health/read-back result;
- content or artifact hash when available.

Until such a receipt exists, deployment authority remains unknown rather than inferred.

## Change discipline

- Prefer small, authority-scoped PRs.
- Keep code files below 400 LOC; refactor before crossing the boundary.
- Never perform bulk destructive cleanup before migration verification.
- New durable governance or evidence artifacts must identify their authority domain and source revision.
- Claims about production, publication, security, or deployment require evidence specific to that claim.
