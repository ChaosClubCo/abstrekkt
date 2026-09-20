---
name: bid-response-builder
description: Use when responding to a government/GSA or large institutional solicitation, RFP, or RFQ for IRON HORSE Seating. Assembles a structured, formal, fully-sourced draft response. Triggers on RFP, RFQ, solicitation, GSA, government bid, proposal, capability statement.
---

# Bid Response Builder

## What this does
Turns a solicitation + United Group's verified facts into an organized, formal draft
response. Drafting and structuring only — **every factual claim is human-verified before
submission.**

## Hard rules
- Use the "GSA / Formal Bid" Style. Formal, factual, zero marketing adjectives.
- Pull every spec, price, term, and certification from the Government/GSA and Product
  Knowledge Base projects. If a required fact is missing, insert `[VERIFY — NOT IN
  KNOWLEDGE]` — never fabricate.
- Never invent a certification, contract number, compliance attestation, or past-performance claim.

## Steps
1. Parse the solicitation: requirements, format, deadlines, evaluation criteria.
2. Map each requirement to a United Group capability + the source fact.
3. Flag every requirement you cannot substantiate.
4. Draft in the formal Style, section by section.
5. Produce a verification checklist of every claim a human must confirm.

## Output ends with
```
VERIFICATION CHECKLIST (human must confirm before submit):
- [ ] <claim> → source
...
```
