# Acceptance Criteria

## MVP acceptance criteria

The pipeline is acceptable for first production use when:

1. All 46 unique assets are accounted for in a manifest.
2. Duplicate files are identified by SHA-256 hash.
3. Four foundation PDFs have OCR TXT outputs.
4. All 12 PNG visuals have structured visual summaries.
5. At least one M4A and one MP4 have timestamped transcripts as smoke tests.
6. Concepts are mapped to the master ontology.
7. Every promoted claim has provenance.
8. Supabase schema can be applied without syntax errors.
9. JSON artifacts parse successfully.
10. Security QA confirms no secrets are stored.

## Full production acceptance criteria

The pipeline is fully production-ready when:

1. All 9 PDFs are OCR'd and summarized.
2. All 25 media files are transcribed and summarized.
3. All visuals are processed and renamed.
4. Each source has summary, concepts JSON, relationships JSON, graph markdown, QA markdown, and FlashFusion mapping.
5. The Company Brain contains assets, concepts, relationships, provenance, and derived artifacts.
6. Agent queries can return answer + citation + confidence + contradiction notes.
7. Human review workflow exists for low-confidence OCR, security-sensitive content, and destructive automation.
8. A weekly update process keeps the knowledge base current.
