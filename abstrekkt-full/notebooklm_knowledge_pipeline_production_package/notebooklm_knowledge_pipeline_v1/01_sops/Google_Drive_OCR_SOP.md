# Google Drive OCR SOP

## Goal

Convert image-based NotebookLM PDF decks into text-bearing Google Docs and export clean TXT/DOCX derivatives for downstream analysis.

## When to use

Use this SOP for all files in the DECK lane when Google Drive is working.

## Inputs

- 9 unique PDF decks from Downloads batch.
- A Google Drive folder named `NotebookLM-OCR`.

## Steps

1. Create a Google Drive folder: `NotebookLM-OCR`.
2. Upload only the 9 unique deck PDFs. Do not upload duplicate `(1)` copies.
3. For each PDF, right-click the file.
4. Choose `Open with` → `Google Docs`.
5. Wait for Google Docs to create an OCR document.
6. Rename the generated Google Doc using this pattern: `<original_name>__OCR_DOC`.
7. Export the Google Doc as plain text: `File` → `Download` → `Plain Text (.txt)`.
8. Export a DOCX copy if you want editable review: `File` → `Download` → `Microsoft Word (.docx)`.
9. Store exported TXT in `02_ocr/txt/` and DOCX in `02_ocr/docx/`.
10. Record completion in `10_qa/ocr_completion_log.csv`.

## QA checks

- Search the TXT for the title visible on page 1.
- Confirm at least 80% of slide headings are captured.
- Check dense diagrams manually.
- Mark any page with low OCR quality in the QA log.

## Failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Google Doc is mostly blank | OCR failed on low-contrast slides | Try Adobe OCR or local OCR |
| Diagrams are unreadable | Small labels or compressed screenshot | Manually inspect visual slide or use multimodal extraction |
| Text order is scrambled | Multi-column slide layout | Clean TXT manually before canonical ingestion |
| Duplicate docs appear | Uploaded duplicate `(1)` files | Move duplicates to skip folder and remove derived docs |
