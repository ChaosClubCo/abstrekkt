# Target State Blueprint

## Executive Intent
Memoir is the canonical system for project resurrection. It converts fragmented context into traceable decisions, architecture, product specs, security controls, operations runbooks, AI governance, code scaffolds, validation reports, and a repository export.

## Canonical Architecture
- Next.js frontend for workspace, graph, ADR, gap, validation, and export review.
- Fastify API for orchestration, RBAC, project/source/artifact/export operations.
- Queue-backed workers for ingestion, extraction, generation, validation, and export assembly.
- PostgreSQL + pgvector for tenant state, graph nodes/edges, decisions, artifacts, jobs, audit logs, and embeddings.
- Object storage for immutable raw source artifacts and export packages.
- Model provider gateway for structured generation, embeddings, redaction, budget enforcement, and evaluation.

## Canonical Data Flow
1. Create workspace.
2. Import sources.
3. Store immutable source metadata and content checksum.
4. Extract knowledge graph with provenance.
5. Consolidate decisions and detect conflicts.
6. Generate ADRs and archive superseded directions.
7. Discover gaps and generate artifacts.
8. Run validation audits.
9. Assemble signed zip export.

## Deprecated Approaches
Chaos/Khaos and FlashFusion remain archived until stronger source evidence changes canonical naming. Recommendation-only output is explicitly not a valid end state.

## Success Criteria
Zero unresolved critical validation failures, all required directories populated, every risk has mitigation/owner, every conflict has an ADR, every export includes manifest/checksum/source boundary.
