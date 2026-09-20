# Base44 Migration Governance

## Core Rule

Every record returned by the Base44 SDK has lowercase `id`. That `id` is the Base44 ObjectId and is the only valid field for Base44 cross-entity lookups.

Source IDs such as Salesforce `Id`, HubSpot `hs_object_id`, or other external IDs exist only for traceability unless explicitly mapped.

## Field Naming

Use exact source field API names as entity property names. Preserve original casing.

Do not convert source field names to camelCase unless a versioned mapping layer exists.

## Reference Fields

Reference fields must contain Base44 `id` values after migration.

Correct:

```ts
const account = await Account.get(contact.AccountId);
const owner = await HubSpotOwner.filter({ id: deal.hubspot_owner_id });
```

Wrong:

```ts
const wrong = Account.list().find(a => a.Id === contact.AccountId);
```

## Many-To-Many Fields

Fields prefixed `associated_` are arrays of Base44 `id` values.

Schema:

```json
{
  "type": "array",
  "items": { "type": "string" }
}
```

## UI Rules

### Detail View

Show related records in dedicated sections:

- Companies (3)
- Deals (4)
- Contacts (12)

Never show raw IDs.

### List View

Show compact relationship count badges.

### Reverse Lookups

If Contact.associated_deals includes Deal.id, Deal detail must show linked Contacts.

### Forms

Use dropdowns or multi-selects backed by TargetEntity.list(). Store selected Base44 `id`.

## Performance Rules

- Do not resolve relationships per row.
- Load lookup entities once per page.
- Index by lowercase `id`.
- Paginate list views.
- Virtualize large relationship sections.
- Do not call unbounded list() for large datasets.

## Validation Rules

After migration:

- validate all FK references
- validate all associated_* arrays
- detect orphaned references
- detect invalid target types
- detect unresolved source IDs
- generate integrity report

## Provenance Required

Each migrated entity should store:

- source_system
- source_record_id
- migration_run_id
- migration_version
- migrated_at
- transformed_by
- transformation_hash

## CLAIMS CHECK

This governance file is based on the Base44-specific prompt text provided in the chat plus production migration hardening patterns.
