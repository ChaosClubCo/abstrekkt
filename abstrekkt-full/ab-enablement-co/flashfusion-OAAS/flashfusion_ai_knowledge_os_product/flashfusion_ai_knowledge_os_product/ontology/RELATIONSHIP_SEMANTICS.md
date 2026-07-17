# Relationship Semantics

## Purpose

Relationships must be typed, directional, auditable, and confidence-aware.

## Required Relationship Fields

- id
- tenant_id
- source_entity_id
- source_entity_type
- target_entity_id
- target_entity_type
- relationship_type
- directionality
- confidence_score
- provenance_id
- created_at
- updated_at
- valid_from
- valid_to
- status
- created_by_actor_type
- created_by_actor_id

## Relationship Types

### Structural

- owns
- contains
- belongs_to
- parent_of
- child_of

### Operational

- uses
- depends_on
- triggers
- blocks
- escalates_to
- routes_to

### Knowledge

- references
- summarizes
- contradicts
- supports
- duplicates
- derives_from

### Governance

- governed_by
- authorizes
- restricts
- approves
- violates

### Temporal

- supersedes
- previous_version_of
- next_version_of
- occurred_before
- occurred_after

### AI-Specific

- generated_by
- reviewed_by
- hallucination_risk_for
- confidence_source_for
- memory_source_for

## Relationship Rules

- Do not create relationships without provenance.
- Do not infer strong relationships from weak semantic similarity.
- Do not render raw IDs in UI.
- Always show unresolved relationships as unresolved, not absent.
- Reverse relationships must be queryable.
- Relationship confidence must propagate into UX.
