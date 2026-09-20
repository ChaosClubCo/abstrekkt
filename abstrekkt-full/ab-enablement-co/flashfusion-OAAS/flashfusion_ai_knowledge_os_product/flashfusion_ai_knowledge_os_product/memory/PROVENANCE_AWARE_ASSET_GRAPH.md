# Provenance-Aware Asset Graph

## Purpose

The asset graph maps artifacts, documents, prompts, files, apps, outputs, and decisions into one navigable memory graph.

## Asset Types

- document
- prompt
- image
- video
- code
- HTML artifact
- interactive artifact
- dashboard
- workflow
- note
- notebook
- repository
- schema
- migration
- decision
- meeting
- automation

## Required Asset Fields

- asset_id
- tenant_id
- title
- asset_type
- source_system
- source_uri
- owner_id
- created_at
- modified_at
- ingested_at
- summary
- tags
- canonical_entity_ids
- provenance_id
- confidence_score
- freshness_score
- status

## Graph Edges

- derived_from
- duplicates
- supersedes
- references
- contradicts
- supports
- implements
- documents
- generated_by
- used_by
- belongs_to
- version_of

## UI Requirements

The asset graph UI must show:

- source
- owner
- freshness
- confidence
- related assets
- relationship type
- lineage
- agent usage
- last reviewed date
