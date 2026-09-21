# Decisions Register

| ID | Decision | Status | Source | Date | Rationale | Impact |
|---|---|---|---|---|---|---|
| DEC-001 | Canonical project name is Memoir | Accepted | Project context | 2026-06-22 | Active context names Memoir; no stronger source exists. | Names docs/code/API/export. |
| DEC-002 | Chaos/Khaos remains archived brand exploration | Archived | Prior conversation | 2026-06-06 | Explored but no adoption signal; user rejected generic names. | Preserves memory without canonical use. |
| DEC-003 | FlashFusion paths treated as template/legacy namespace | Archived | Current protocol | 2026-06-22 | Protocol lists conditional examples; active context is Memoir. | Boundary mapping preserved. |
| DEC-004 | Monorepo-first, multi-repo-ready architecture | Accepted | Synthesis | 2026-06-22 | Reduces early coordination while preserving split boundaries. | Workspace packages and ownership map. |
| DEC-005 | PostgreSQL + pgvector canonical data layer | Accepted | Synthesis | 2026-06-22 | Supports relational provenance, events, graph edges, embeddings. | DB schema and migrations. |
| DEC-006 | Object storage for raw sources/exports | Accepted | Synthesis | 2026-06-22 | Large immutable artifacts should not live in database rows. | Storage URI model. |
| DEC-007 | Queue-backed workflow orchestration | Accepted | Protocol+synthesis | 2026-06-22 | Long-running reconstruction requires durable, retryable jobs. | Jobs/events/idempotency. |
| DEC-008 | Model provider abstraction | Accepted | AI architecture synthesis | 2026-06-22 | Avoid lock-in; centralize policy and evals. | Provider gateway. |
| DEC-009 | Schema-first API contracts | Accepted | Engineering synthesis | 2026-06-22 | Prevents frontend/backend drift. | OpenAPI + Zod schemas. |
| DEC-010 | RBAC and tenant isolation from day one | Accepted | Security synthesis | 2026-06-22 | Project sources can contain sensitive IP/secrets. | Security artifacts and tests. |
| DEC-011 | Validation gates block critical failures | Accepted | Current protocol | 2026-06-22 | User requires no unresolved critical items. | Validation scripts/reports. |
| DEC-012 | Assumptions are explicit, not hidden | Accepted | Integrity requirement | 2026-06-22 | No uploaded files were found. | Confidence tagging. |
