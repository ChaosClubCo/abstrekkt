# Schema Evolution Policy

## Purpose

Schema evolution prevents long-term entity drift and preserves migration compatibility.

## Versioning

Every schema must include:

- schema_name
- version
- owner
- compatibility_notes
- breaking_change_flag
- migration_required
- rollback_strategy

## Change Classes

### Patch

Non-breaking additions.

### Minor

Backward-compatible structural changes.

### Major

Breaking changes requiring migration.

## Breaking Changes

Breaking changes include:

- field deletion
- field type change
- relationship direction change
- required field addition without default
- source mapping change
- tenant isolation change
- Base44 id semantics change

## Deprecation Rules

Deprecated fields require:

- replacement field
- sunset date
- migration plan
- consumer impact list
- rollback plan

## AI Schema Mutation Policy

AI agents may propose schema changes but must not autonomously apply breaking schema changes without approval.
