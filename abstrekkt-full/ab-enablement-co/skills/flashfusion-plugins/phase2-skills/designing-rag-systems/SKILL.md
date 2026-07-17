---
name: designing-rag-systems
description: >-
  Architects retrieval-augmented generation systems including chunking
  strategies, embedding model selection, vector store configuration,
  retrieval optimization, and hybrid search design. Activates when
  designing RAG architecture, selecting chunking strategies, choosing
  embedding models, configuring vector databases, or optimizing
  retrieval quality. Also triggers on: RAG design, chunking strategy,
  embedding selection, vector store, hybrid search, semantic search
  architecture, retrieval optimization, RAG pipeline, document QA
  architecture, or design a RAG system. Even if someone says 'architect
  the RAG pipeline' or 'which chunking strategy' — use this skill.
version: "1.0.0"
---

# Designing RAG Systems

Designs RAG systems that actually retrieve the right information at Intinc — careful architecture of chunking, embedding, indexing, and retrieval that maximizes answer quality while minimizing hallucination.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New rag systems? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up designing rag systems for our production AI system**
→ Assess current infrastructure → identify gaps in designing rag systems capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our designing rag systems is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our designing rag systems performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define designing rag systems requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish designing rag systems review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — designing rag systems that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure designing rag systems respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design designing rag systems to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — designing rag systems configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All designing rag systems data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core designing rag systems workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation