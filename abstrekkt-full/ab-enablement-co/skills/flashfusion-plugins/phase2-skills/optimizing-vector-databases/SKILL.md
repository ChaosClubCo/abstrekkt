---
name: optimizing-vector-databases
description: >-
  Tunes vector database performance including index configuration,
  embedding dimensions, query optimization, and scaling strategies for
  Pinecone, Weaviate, Qdrant, and pgvector. Activates when optimizing
  vector databases, tuning index configuration, selecting embedding
  dimensions, optimizing vector queries, or scaling vector
  infrastructure. Also triggers on: vector database, Pinecone, Weaviate,
  Qdrant, pgvector, vector index, embedding dimension, ANN search,
  vector query performance, or vector DB is slow. Even if someone says
  'optimize our vector database' or 'search is too slow' — use this
  skill.
version: "1.0.0"
---

# Optimizing Vector Databases

Squeezes maximum performance from vector infrastructure at Intinc — tuning indexes, dimensions, and query strategies for the sweet spot between recall quality and latency.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New vector databases? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up optimizing vector databases for our production AI system**
→ Assess current infrastructure → identify gaps in optimizing vector databases capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our optimizing vector databases is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our optimizing vector databases performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define optimizing vector databases requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish optimizing vector databases review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — optimizing vector databases that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure optimizing vector databases respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design optimizing vector databases to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — optimizing vector databases configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All optimizing vector databases data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core optimizing vector databases workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation