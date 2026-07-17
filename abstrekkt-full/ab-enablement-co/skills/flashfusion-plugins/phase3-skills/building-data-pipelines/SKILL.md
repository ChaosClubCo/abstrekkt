---
name: building-data-pipelines
description: >
  Builds ETL/ELT data pipelines with orchestration, quality checks, and monitoring for analytics and ML workloads. Activates when building data ingestion, implementing ETL/ELT, orchestrating with Airflow/Dagster, or designing data transformation logic. Also triggers on: data pipeline, ETL, ELT, Airflow, Dagster, dbt, data ingestion, data transformation, batch processing, or stream processing. Even if someone says 'move data from A to B' or 'build the pipeline' — use this skill.
version: 1.0.0
category: Data Engineering & Storage
---

# Building Data Pipelines

> **Category:** Data Engineering & Storage | **Scope:** Intinc Platform | **Version:** 1.0.0

Guides data pipeline design at Intinc — orchestration patterns, transformation logic, quality gates, monitoring, and cost optimization for batch and streaming workloads.

---

## Quick-Start Decision Tree

```
Building Data Pipelines request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Design building data pipelines for the analytics platform."**

> Gather requirements from stakeholders → model data flows → design schema/architecture → implement with validation → load test with production-scale data → optimize and monitor.

**Example 2: "Performance issues with our current building data pipelines."**

> Collect query metrics → identify slow paths → analyze execution plans → design targeted optimizations → implement and benchmark → set up continuous monitoring.

**Example 3: "Need to support multi-tenant building data pipelines."**

> Assess isolation requirements → evaluate patterns (shared vs dedicated) → design RLS/partition strategy → implement with security tests → validate tenant isolation → document operational procedures.

---

## Golden Path Workflow

1. Assess current state and requirements for building data pipelines
2. Review Intinc standards and existing patterns for data architecture and storage
3. Design approach using proven patterns (PostgreSQL, Redis, Elasticsearch, Kafka, Snowflake, dbt)
4. Document architecture decisions with rationale
5. Implement with tests (unit, integration, security)
6. Validate against data integrity, performance, compliance, cost criteria
7. Code review with security and architecture focus
8. Deploy to staging with monitoring
9. Production rollout with rollback plan
10. Post-deployment validation and documentation update

---

## Edge Cases & Anti-Patterns

**Schema changes without migration plan** — Never alter building data pipelines schemas in place. Always use versioned migrations with rollback.
**Ignoring data volume growth** — What works for 1M rows may fail at 100M. Design building data pipelines for 10x projected growth.
**Missing data validation** — Garbage in, garbage out. Validate at ingestion for building data pipelines, not after processing.
**Cross-tenant data leakage** — Multi-tenant building data pipelines must be tested with adversarial queries. RLS is necessary but not sufficient.

---

## Cross-Skill References

- **designing-multi-tenant-data** — Related data architecture and storage skill for comprehensive coverage
- **implementing-caching-layers** — Related data architecture and storage skill for comprehensive coverage
- **optimizing-query-performance** — Related data architecture and storage skill for comprehensive coverage
- **managing-secrets** — Credential management for database connections
- **implementing-observability** — Monitoring for data pipeline health

---

## Compliance & Security

- PII must be identified and tagged in all schemas
- Data retention policies must be implemented and enforced
- Cross-tenant data access must be prevented by design
- Backup and recovery procedures must meet RPO/RTO targets

**Security Checklist:**
- [ ] Threat model reviewed for this change
- [ ] Secrets and credentials handled per Intinc policy
- [ ] Access follows principle of least privilege
- [ ] Changes logged for audit trail

---

## Self-Verification Checklist

- [ ] Solution follows Intinc standards for data engineering & storage
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation updated (API docs, runbooks, ADRs)
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Stakeholders notified of changes
- [ ] Performance validated under expected load

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **CLAIMS:** All guidance follows Intinc engineering standards for data engineering & storage. Patterns are production-proven at scale. [GENERATED]
- **COUNTEREXAMPLE:** Specific tooling recommendations (e.g., framework versions) may change. Always verify against current Intinc tech radar.
- **CONTRADICTIONS:** None known. This skill complements rather than replaces existing data engineering & storage documentation.
