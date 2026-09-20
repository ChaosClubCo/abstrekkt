# NotebookLM Knowledge Pipeline — Production Package v1.0

Built for Kyle Rosebrook's Downloads batch scan dated 2026-04-24. This package converts NotebookLM exports into an AI knowledge infrastructure with four durable outcomes: operational memory systems, provenance-aware asset graphs, agent-accessible business memory, and repeatable ingestion workflows.

## What this package contains

This ZIP contains a production-grade operating system for the 46 unique NotebookLM assets discovered in `C:\Users\kyler\Downloads\`:

- 9 image-based PDF decks requiring OCR.
- 12 PNG visuals immediately processable.
- 15 M4A audio overviews requiring transcription.
- 10 MP4 video overviews requiring transcription.
- Duplicate-skip rules for six exact-size duplicate exports.
- Folder structure, file naming conventions, QA gates, prompts, schemas, SQL, scripts, and acceptance criteria.

## Primary output target

The final system is not a folder of summaries. It is a source-grounded knowledge layer where every claim can point back to a source asset, page, timestamp, visual, transcript section, or derived artifact.

## First production run

Start with this sequence:

1. OCR the four foundation decks: `The_AI_Operating_System.pdf`, `The_Agentic_Stack.pdf`, `The_Agentic_Blueprint.pdf`, and `Agentic_OS_Architecture.pdf`.
2. Process all 12 PNG visuals because they are already unblocked.
3. Transcribe the 25 audio/video assets with Whisper or another transcript system.
4. Normalize extracted concepts against `ontology/Master_Ontology.md`.
5. Ingest outputs into the SQL schema in `database/supabase_schema.sql`.
6. Run the QA checklist before using the content as agent memory.

## Non-negotiables

- Do not overwrite raw files.
- Do not ingest duplicates.
- Do not store secrets, API keys, tokens, client credentials, or private passwords.
- Do not accept uncited claims into the canonical knowledge base.
- Do not treat OCR text as perfect; mark OCR confidence and review dense diagrams manually.
- Do not flatten everything into one summary. Preserve source, chunk, concept, relationship, and provenance.
