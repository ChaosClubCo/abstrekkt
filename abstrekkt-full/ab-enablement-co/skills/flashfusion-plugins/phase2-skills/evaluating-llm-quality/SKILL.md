---
name: evaluating-llm-quality
description: >-
  Implements LLM evaluation frameworks including automated scoring
  (RAGAS, LangSmith), human evaluation protocols, and benchmark design.
  Activates when evaluating LLM outputs, implementing RAGAS or LangSmith
  evaluation, designing human evaluation protocols, building evaluation
  benchmarks, or comparing model quality. Also triggers on: LLM
  evaluation, RAGAS, LangSmith, eval framework, human evaluation,
  benchmark, evaluation suite, quality scoring, model quality, or how
  good is the output. Even if someone says 'evaluate our LLM quality' or
  'set up automated evals' — use this skill.
version: "1.0.0"
---

# Evaluating LLM Quality

Measures LLM quality rigorously at Intinc — combining automated metrics (RAGAS, custom scorers) with human evaluation to produce quality signals you can actually trust and act on.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New llm quality? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up evaluating llm quality for our production AI system**
→ Assess current infrastructure → identify gaps in evaluating llm quality capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our evaluating llm quality is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our evaluating llm quality performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define evaluating llm quality requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish evaluating llm quality review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — evaluating llm quality that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure evaluating llm quality respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design evaluating llm quality to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — evaluating llm quality configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All evaluating llm quality data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core evaluating llm quality workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation