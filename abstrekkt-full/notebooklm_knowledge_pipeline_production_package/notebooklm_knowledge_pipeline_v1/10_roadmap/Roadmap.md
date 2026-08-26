# Roadmap — NotebookLM to Agentic Knowledge Infrastructure

## Week 1 — Ingestion foundation

- Create folders and hash manifest.
- OCR four foundation PDFs.
- Process 12 PNG visuals.
- Transcribe one M4A and one MP4 as smoke tests.
- Finalize ontology v1.

## Week 2 — Full extraction

- OCR remaining PDFs.
- Transcribe all media.
- Generate summaries, concept JSON, relationships JSON, graph markdown, and FlashFusion maps.
- Apply QA gates.

## Week 3 — Company Brain ingestion

- Apply Supabase schema.
- Ingest assets and derived artifacts.
- Ingest reviewed concepts and relationships.
- Build simple query interface.
- Add provenance display.

## Week 4 — Agent-accessible memory

- Add retrieval by concept, source, topic cluster, and confidence.
- Add contradiction search.
- Add human review queue.
- Connect to FlashFusion Agent Ops Dashboard.
- Create client-facing examples from the knowledge base.

## WSJF backlog

| Item | BV | TC | RR/OE | Size | WSJF | Notes |
|---|---:|---:|---:|---:|---:|---|
| OCR foundation decks | 9 | 8 | 7 | 3 | 8.00 | Unlocks vocabulary and architecture |
| Process visual lane | 8 | 7 | 6 | 2 | 10.50 | Immediate progress, high context value |
| Transcript smoke test | 7 | 7 | 6 | 3 | 6.67 | Validates media workflow |
| Supabase schema | 8 | 6 | 8 | 5 | 4.40 | Enables durable Company Brain |
| Full transcript batch | 8 | 5 | 7 | 8 | 2.50 | High value but larger workload |
| Agent query interface | 9 | 5 | 8 | 8 | 2.75 | Depends on clean ingestion |
