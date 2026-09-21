# Memoir Project Export

Generated: 2026-06-22T00:00:00-05:00

Memoir is reconstructed as an AI-assisted project memory and repository resurrection platform. It ingests fragmented project context, builds a provenance-aware knowledge graph, consolidates decisions, resolves conflicts through ADRs, eliminates gaps with generated artifacts, validates completeness, and exports a production-ready repository package.

The export is grounded in accessible project context and the current reconstruction protocol. No uploaded files were discoverable, so generated implementation, business, and operational choices are explicitly tagged as `[ASSUMED]` where they are not directly source-backed.

## Entrypoints

- `PROJECT-KNOWLEDGE-GRAPH.json`
- `DECISIONS-REGISTER.md`
- `TARGET-STATE-BLUEPRINT.md`
- `GAP-REGISTER.md`
- `validation/VALIDATION-REPORT.md`
- `REPOSITORY-TREE.txt`

## Development Baseline

The implementation scaffold uses a TypeScript monorepo with Next.js frontend, Fastify backend, shared Zod schemas, PostgreSQL/pgvector schema, Docker Compose, Kubernetes stubs, CI, RBAC, threat model, AI governance, runbooks, and validation scripts.
