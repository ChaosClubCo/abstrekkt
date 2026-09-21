# Temporal Semantics

## Why Time Matters

AI systems become unreliable when they treat all knowledge as timeless. Business memory must distinguish between current truth, historical truth, stale knowledge, and superseded decisions.

## Temporal Concepts

### Event

A thing that happened at a point in time.

### State

A representation of an entity at a moment or interval.

### Snapshot

A stored copy of an entity or graph at a time.

### Lineage

The history of how an entity, relationship, prompt, decision, or asset evolved.

### Validity Window

The period during which a fact or relationship is considered valid.

## Required Temporal Functions

```txt
entity_at_time(entity_id, timestamp)
relationship_at_time(relationship_id, timestamp)
memory_before_change(entity_id, change_id)
current_state(entity_id)
lineage_for(entity_id)
events_between(start, end, filter)
```

## Required Temporal Fields

- created_at
- updated_at
- valid_from
- valid_to
- superseded_at
- archived_at
- event_time
- observed_at
- migration_run_id

## Rules

- Historical facts must not overwrite current facts without a transition event.
- Stale knowledge must be visible.
- Superseded prompts must remain retrievable.
- Agent actions must be timestamped.
- Migrations must be linked to migration run IDs.
