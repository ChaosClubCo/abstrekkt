# INT Skill-Pack Mapping (ask #4: extract reusable components)

How extracted components map into INT Inc skill packs. "Reusable" = decoupled from
any single product, expresses a general pattern, and passes its module's `validate`.

| Extracted component | Source module | INT skill pack |
|---|---|---|
| Workflow orchestration templates | FlashFusion Pattern (mod 1) | `workflow-patterns` |
| n8n importable workflows | n8n Integration (mod 2) | `n8n-automation` |
| JSON Schemas for data models | Schema Extraction (mod 3) | `schema-library` |
| Atomic prompt library + index | Prompt-Library (mod 4) | `prompt-library` |
| Standard doc set generator | Doc-Generator (mod 5) | `doc-templates` |

## Promotion criteria (deterministic)
1. No product-specific coupling (no Stripe/Printify/Base44-only logic).
2. Has tests or a `validate` report that passes.
3. Documented entry point + example.

Components failing any criterion stay in the source package, not the shared skill pack.
