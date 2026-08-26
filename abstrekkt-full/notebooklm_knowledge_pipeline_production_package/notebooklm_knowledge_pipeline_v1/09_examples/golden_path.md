# Golden Path

## Scenario

You want to transform one OCR'd foundation deck into canonical Company Brain memory.

## Steps

1. OCR `The_AI_Operating_System.pdf` through Google Drive.
2. Export TXT as `The_AI_Operating_System.txt`.
3. Run `OCR_DECK_EXTRACTION_PROMPT.md` against the TXT.
4. Save outputs:
   - `05_summaries/The_AI_Operating_System_Summary.md`
   - `06_concepts/The_AI_Operating_System_Concepts.json`
   - `07_graphs/The_AI_Operating_System_Graph.md`
   - `08_flashfusion_mapping/The_AI_Operating_System_FlashFusion.md`
5. Validate JSON using `validate_json_artifacts.py`.
6. Create provenance records for each promoted claim.
7. Run `Production_QA_Checklist.md`.
8. Mark asset as `qa_passed`.
9. Ingest into Supabase.
10. Test an agent query: "What does the corpus say about AI operating systems, and where did that claim come from?"

## Expected result

The agent answers with source-backed concepts, citations, confidence, and contradictions instead of generic AI commentary.
