# Reusable Assets — FlashFusion → INT

Extraction mapping: what moves from the archived FlashFusion repo into INT skill
packs, and the criterion for "reusable."

## Criterion
An asset is reusable if it is **decoupled from FlashFusion-specific concerns**
(Stripe/Printify/POD) and expresses a general pattern. Coupled assets stay archived.

| Asset | Source | Reusable? | Destination |
|---|---|---|---|
| n8n workflow patterns | FlashFusion automations | ✅ general orchestration | INT skill pack: workflow-patterns |
| Supabase schema + RLS conventions | FlashFusion data layer | ✅ general multi-tenant | INT skill pack: supabase-rls (see charter) |
| tRPC error-handling patterns | FlashFusion API | ✅ general | INT skill pack: api-patterns |
| Stripe billing integration | FlashFusion | ❌ coupled to FF product | stays archived |
| Printify/POD integration | FlashFusion | ❌ coupled | stays archived |
| Universal MCP Server scaffold | pivot build | ✅ this IS the new project | INT primary repo |

## Open question (flagged in source)
Which components are *truly* reusable vs. coupled was never fully resolved — confirm
each row against the real FlashFusion code before promoting.
