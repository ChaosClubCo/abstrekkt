# Security and Tenant Isolation

## Core Principle

No agent, UI, migration script, or relationship resolver may cross tenant boundaries without explicit authorization.

## Required Security Fields

- tenant_id
- organization_id
- owner_id
- visibility_scope
- access_policy_id
- created_by
- updated_by

## Tenant Rules

- Every entity must have tenant_id.
- Every relationship must have tenant_id.
- Source and target entities must belong to the same tenant unless cross-tenant sharing is explicitly approved.
- Agent memory access must be scoped to tenant and role.
- UI relationship traversal must respect RLS.

## RLS Policies

Minimum Supabase RLS concepts:

- users can read entities in their tenant
- users can mutate entities they own or are authorized to edit
- agents can only operate under delegated scopes
- audit logs are append-only
- secrets are never exposed through entity views

## Sensitive Data

Never expose:

- API keys
- raw OAuth tokens
- private environment variables
- hidden audit data
- cross-tenant identifiers
- internal security metadata

## Destructive Actions

Require:

- confirmation
- audit record
- rollback state
- actor identity
- reason
- timestamp
