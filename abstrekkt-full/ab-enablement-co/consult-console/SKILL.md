---
name: warranty-triage
description: Use when a customer reports a problem with an IRON HORSE chair, asks about warranty coverage, or requests a return/RMA. Triages the issue, drafts a brand-voice response, and flags anything needing human approval. Triggers on warranty, return, RMA, broken, defect, replacement part, coverage, "chair stopped working."
---

# Warranty Triage

## What this does
Takes a raw customer warranty/return message and produces: (1) a plain classification,
(2) the likely coverage answer **citing the warranty knowledge**, (3) a drafted response
in brand voice, (4) a clear ESCALATE flag when a human must decide.

## Steps
1. Identify: series/model, component affected, symptom, purchase date if given.
2. Check coverage **only** against the Warranty project knowledge. If terms aren't in
   knowledge, do NOT guess — say what's missing and ask.
3. Classify: `In warranty` / `Out of warranty` / `Need more info` / `Escalate`.
4. Draft a response in the United Group Style — empathetic, specific, no overpromising.
5. Strip customer PII to the minimum.

## Always escalate to a human when
- A refund, credit, or replacement-chair decision is required
- The claim value or customer is significant
- Coverage is ambiguous or terms aren't documented
- Anything legal/liability is implied

## Output format
```
CLASSIFICATION: <one line>
COVERAGE READ: <cite the warranty term, or "not in knowledge base">
DRAFT RESPONSE: <brand-voice reply>
ESCALATE: yes/no — <why>
```
