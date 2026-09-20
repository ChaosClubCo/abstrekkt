# Decision Log

Two kinds of entries: **[LOCKED]** decisions already made in the KB (recorded for portability), and **[PACKAGE]** decisions this package makes on Kyle's behalf where the mega-prompt authorized resolution. Each package decision carries rationale, options, tradeoffs, and reversal cost.

## Locked decisions (from the KB)

| ID | Decision | Source | Confidence |
|---|---|---|---|
| D-L1 | Abstrekkt is the parent brand; ChaosClub* retired permanently | instructions | High |
| D-L2 | Brand: "Reading Room at Midnight" — ink #1C1917, brass #C8A86A, Fraunces/Crimson Pro/JetBrains Mono | instructions | High |
| D-L3 | FlashFusion runs a separate void-dark brand system (#0B0B14 / #A855F7 / #EC4899 / #22D3EE) | instructions | High |
| D-L4 | $4,500 audit floor; one documented exception max (Ryan) | instructions, flashfusion-arc | High |
| D-L5 | Solo founder; no partners unless offer heavily in Kyle's favor | instructions | High |
| D-L6 | Absolute lane separation from the day-job firm | instructions | High |
| D-L7 | No credential claims before 2026-07-20 pass | instructions | High |
| D-L8 | E&O with affirmative-AI rider required before first paid contract | instructions | High |
| D-L9 | Anthropic API default provider (sonnet-4-6; opus for max tier) | WorkstreamMapper | Medium |
| D-L10 | RLS never disabled; migrations immutable; no secrets in client | AGENTS.md | High |

## Package decisions (made on Kyle's behalf)

### D-P1 · Employment-IP review is a first-class pre-revenue blocker
- **Context:** buried in the LLC kit; absent from the instructions' gate list.
- **Options:** (a) leave as kit detail; (b) elevate to a named blocker.
- **Decision:** (b) — elevate to B-4 with CRITICAL severity.
- **Rationale:** it is the highest-consequence, longest-lead item and directly protects lane separation.
- **Reversal cost:** trivial (demote if attorney says the employment agreement is clean).

### D-P2 · Consulting-first sequencing (Path A)
- **Context:** three viable go-to-market lanes (consulting / product / content).
- **Decision:** consulting-first; product + content trail first revenue.
- **Rationale:** only lane with live priced demand; funds the others without capital.
- **Tradeoff:** Kyle's time caps throughput (~3 concurrent).
- **Reversal cost:** low — a product or content breakout can re-sequence at any quarter retro.

### D-P3 · Treat Ryan as *free* pending reconciliation
- **Context:** C-1 contradiction (free vs $3,000).
- **Decision:** follow the governing instructions (free) until the boundary doc reconciles it.
- **Rationale:** governing doc outranks the arc doc; avoids inventing a $3,000 precedent.
- **Reversal cost:** low — flip if the boundary doc confirms $3,000.

### D-P4 · Memoir excluded from this package
- **Context:** *Tax the Damage* is a separate voice register; the instructions forbid cross-pollination with business content.
- **Decision:** log status only; do not reconstruct.
- **Rationale:** including it in an ops package would violate the register-separation rule and add no operational value.
- **Reversal cost:** none — it can be packaged separately on request.

### D-P5 · Package tier = Complete, not exhaustive-for-its-own-sake
- **Context:** default was EXHAUSTIVE; org spans 5 workstreams.
- **Decision:** deep on FlashFusion + blockers; thin on the rest; no padded files.
- **Rationale:** matches Kyle's anti-padding preference and concentrates effort where revenue/risk is.
- **Reversal cost:** low — any thin section can be deepened on request.
