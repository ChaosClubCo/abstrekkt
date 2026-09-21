# OCR Deck Extraction Prompt

```text
You are processing an OCR'd NotebookLM deck.

SCOPE_MODE: FULL

Input: OCR text from an image-based PDF deck.

Task: Reconstruct the deck into a clean, source-grounded knowledge artifact.

Produce:
1. Deck title and likely topic cluster.
2. Slide-by-slide reconstruction if page markers exist.
3. Key claims and where they appear.
4. Core architecture patterns.
5. Agent, workflow, MCP, memory, security, and tool references.
6. Missing/garbled OCR sections.
7. A concept list normalized to the master ontology.
8. A relationship list with source references.
9. FlashFusion implementation relevance.
10. A CLAIMS CHECK with contradictions and counterexamples.

Do not assume unreadable text. Mark it as [OCR unclear].
```
