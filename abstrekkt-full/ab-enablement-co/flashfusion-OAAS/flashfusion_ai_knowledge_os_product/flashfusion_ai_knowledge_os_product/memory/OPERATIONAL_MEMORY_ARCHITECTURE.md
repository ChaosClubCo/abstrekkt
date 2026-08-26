# Operational Memory Architecture

## Stored Memory vs Operational Memory

Stored memory is information saved somewhere.

Operational memory is information that is:

- classified
- related
- provenance-aware
- confidence-scored
- retrievable
- agent-accessible
- governed
- actionable

## Memory Layers

### Raw Memory

Original files, chats, notes, docs, notebooks, artifacts, media, repos.

### Parsed Memory

Extracted text, metadata, summaries, entities, embeddings.

### Structured Memory

Canonical entities, relationships, classifications, ownership.

### Operational Memory

Task-relevant, current, governed, and actionable knowledge.

### Strategic Memory

High-level doctrine, decisions, patterns, playbooks, principles.

## Required Memory Fields

- memory_id
- tenant_id
- source_type
- source_uri
- source_title
- extracted_summary
- canonical_entity_ids
- relationship_ids
- confidence_score
- freshness_score
- provenance_id
- last_reviewed_at
- expires_at
- status

## Memory States

- raw
- parsed
- classified
- linked
- validated
- stale
- conflicted
- archived
- quarantined

## Retrieval Contract

Retrieval must return:

- answer context
- source references
- confidence
- freshness
- contradictions
- related entities
- recommended next action
