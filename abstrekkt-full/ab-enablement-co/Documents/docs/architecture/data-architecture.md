# Data Architecture

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Canonical Data Model

FlashFusion uses Postgres as the source of truth for organizations, users, engagements, audits, workflows, opportunities, prompts, agents, generated artifacts, events, and logs.

## Memory and Provenance

The memory model separates raw storage from intelligence metadata. A source document has storage location, hash, owner, sensitivity, provenance, review status, extracted entities, summaries, embeddings, and relationship edges. Agents retrieve only approved chunks scoped to tenant, purpose, sensitivity, and task.

## Graph Path

Start with `relationship_edges` in Postgres. Move to Neo4j only if graph traversal needs exceed SQL ergonomics.
