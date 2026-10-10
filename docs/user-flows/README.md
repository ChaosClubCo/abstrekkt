# User Flow Charts — FlashFusion Personas + Loxihart Reference

## Purpose and scope

This directory documents user flows for the three named FlashFusion personas, plus one
reference-only diagram of Loxihart's existing pilot flow. It exists to give a reviewer a
visual map of who does what, in what order, per audience — not to introduce new product
decisions.

## Evidence classification

Per `docs/DOCUMENTATION_STANDARDS.md`, these documents are **HISTORICAL / UNVERIFIED**, not
`IMPLEMENTED` or `VERIFIED`:

- The FlashFusion source docs (`flashfusion-export-v2/flashfusion-export-v2/product/personas.md`,
  `user-flows.md`, `journey-maps.md`) are themselves tagged `[RECONSTRUCTED]` / `[INFERRED]` by
  their own export process, dated 2026-07-09. They describe intended/reconstructed product
  behavior, not confirmed live-system behavior (their own Claims Check note: "live Base44/
  Supabase/Stripe/n8n state may differ").
- Mapping a specific persona onto a specific sequence of flow stages is new synthesis performed
  here, because no source doc states a per-persona flow directly — only generic core flows,
  generic journey maps, and separate persona goal statements. That synthesis is marked
  `[INFERRED]` in each document, distinct from content pulled directly from a source doc.
- The Loxihart reference diagram is sourced from existing frozen code/docs only. It documents
  what the software currently does, not a verified operational runbook, and carries no
  product-decision authority over `Krosebrook/Loxihart`.

## Provenance tags (inherited from source docs)

| Tag | Meaning |
|---|---|
| `[EXACT]` | Directly copied/extracted from a source file. |
| `[RECONSTRUCTED]` | Rebuilt from durable project memory or prior known decisions (source doc's own tag). |
| `[INFERRED]` | Logically completed from verified/reconstructed material — includes new persona-to-flow mapping done in this directory. |
| `[MISSING]` | Known needed, source content unavailable. |

## Files

| File | Subject | Primary source |
|---|---|---|
| `flashfusion-solo-operators.md` | Solo Operators + AI-Native Builders | `product/personas.md`, `product/user-flows.md` |
| `flashfusion-agency-leads.md` | Agency Leads / Small B2B Teams | `product/personas.md`, `product/user-flows.md`, `product/journey-maps.md` |
| `flashfusion-msp-enterprise.md` | MSP-adjacent / Enterprise Clients | `product/personas.md`, `product/user-flows.md`, `product/journey-maps.md` |
| `loxihart-pilot-operator-reference.md` | Loxihart pilot lifecycle (reference only) | `loxihart/pilot-console/src/App.tsx`, `AccessGate.tsx`, service READMEs |

## Boundary notice — Loxihart

Per root `AGENTS.md` / `CLAUDE.md`: Loxihart is owned and operated externally by
`Krosebrook/Loxihart`. `loxihart/` in this repo is frozen historical/reference material. The
Loxihart document in this directory:

- documents existing, already-committed frozen behavior only;
- introduces no new Loxihart product or UX decisions;
- is not authoritative — `Krosebrook/Loxihart` is;
- must not be used to plan new Loxihart work from this repo.

## Out of scope

This pass covers FlashFusion's three named personas plus the Loxihart reference diagram only.
It does not cover the repo's other ~9 distinct app surfaces (a2a-layer, Model Audit Console,
the Kyle Rosebrook portfolio site, audit/remediation sites, operator-console, chapter-reader,
etc.), `project/CANON.md` content lanes, or any INT/Intinc or private/memoir material.
