# Production QA Checklist

## Source integrity

- [ ] Original raw files are preserved and unmodified.
- [ ] SHA-256 hash manifest exists.
- [ ] Duplicate `(1)` files are skipped unless SHA-256 differs.
- [ ] Each derived artifact links to a parent source asset.

## OCR QA

- [ ] OCR TXT exists for each PDF deck.
- [ ] Page 1 title is captured.
- [ ] At least 80% of visible slide headings are captured.
- [ ] Dense diagrams are manually reviewed.
- [ ] Garbled sections are marked `[OCR unclear]`.

## Transcript QA

- [ ] TXT transcript exists.
- [ ] SRT or VTT timestamp transcript exists.
- [ ] Three timestamp spot-checks are complete.
- [ ] Inaudible sections are marked rather than guessed.

## Visual QA

- [ ] Original PNG is preserved.
- [ ] Proposed renamed filename exists.
- [ ] Visible text is separated from interpretation.
- [ ] Low-confidence regions are listed.

## Knowledge QA

- [ ] Concepts map to `Master_Ontology.md`.
- [ ] Relationships use allowed predicates from schema.
- [ ] Claims have provenance records.
- [ ] Unsupported claims are excluded from canonical memory.
- [ ] Contradictions are logged.

## Security QA

- [ ] No API keys, tokens, credentials, or private secrets are present.
- [ ] Any client-sensitive content is marked private.
- [ ] Agent-accessible outputs are least-privilege by default.
- [ ] Human approval gates are defined for destructive or external actions.

## Acceptance gate

A source graduates to canonical memory only when all applicable checks above are complete and the artifact status is updated to `qa_passed`.
