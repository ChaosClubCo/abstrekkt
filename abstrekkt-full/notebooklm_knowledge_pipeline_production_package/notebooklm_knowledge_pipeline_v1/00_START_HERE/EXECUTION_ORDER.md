# Execution Order

## Executive sequence

Run the pipeline in this exact order to avoid chaos, duplicate work, and low-quality memory ingestion.

### Phase 0 — Workspace setup

Create this folder structure locally:

```text
C:\Users\kyler\Downloads\NLM_PIPELINE\
  00_raw\
  01_deduped\
  02_ocr\
  03_transcripts\
  04_visual_extractions\
  05_summaries\
  06_concepts\
  07_graphs\
  08_flashfusion_mapping\
  09_company_brain_ingest\
  10_qa\
  _skip_duplicates\
```

### Phase 1 — Deduplicate

Run `scripts/powershell/01_scan_and_hash_downloads.ps1`. Move duplicate `(1)` files to `_skip_duplicates`. Keep hash evidence in `10_qa/hash_manifest.csv`.

### Phase 2 — OCR foundation PDFs

OCR these first:

1. `The_AI_Operating_System.pdf`
2. `The_Agentic_Stack.pdf`
3. `The_Agentic_Blueprint.pdf`
4. `Agentic_OS_Architecture.pdf`

These create the vocabulary, categories, and architecture skeleton for the rest of the corpus.

### Phase 3 — OCR remaining PDFs

Process the other five decks:

1. `Architecting_Agentic_Systems.pdf`
2. `Agentic_Architecture.pdf`
3. `Architecting_Agentic_AI.pdf`
4. `Architecting_Secure_Autonomy.pdf`
5. `The_Autonomous_AI_Blueprint.pdf`

### Phase 4 — Visual lane

Process all 12 PNG files into visual summaries, diagram entities, relationships, and graph candidates.

### Phase 5 — Audio/video transcripts

Transcribe all M4A and MP4 files into TXT, SRT, and JSON formats. Keep timestamps. Timestamp provenance matters.

### Phase 6 — Normalize concepts

Map extracted terms into `ontology/Master_Ontology.md`. Add aliases, contradictions, and source-backed definitions.

### Phase 7 — Build asset graph

Create source-to-concept and concept-to-workflow relationships using `schemas/relationship.schema.json`.

### Phase 8 — Ingest into Company Brain

Use `database/supabase_schema.sql` and `scripts/python/ingest_manifest_to_supabase.py` as the starting point.

### Phase 9 — QA gate

Run `qa/Production_QA_Checklist.md`. No artifact graduates to canonical memory without passing provenance, duplicate, citation, and security checks.
