---
name: testing-ai-systems
description: >-
  Designs test strategies for AI-powered systems including unit tests
  for deterministic components, statistical tests for model outputs,
  integration tests, and end-to-end validation. Activates when testing
  AI systems, designing AI test strategies, building model test suites,
  implementing regression tests for AI, or creating AI CI/CD pipelines.
  Also triggers on: AI testing, model testing, LLM testing, test
  strategy AI, regression test model, AI CI/CD, output validation, non-
  deterministic testing, snapshot testing AI, or how do we test AI. Even
  if someone says 'test the AI features' or 'build a test suite for the
  model' — use this skill.
version: "1.0.0"
---

# Testing AI Systems

Makes AI systems testable at Intinc — combining deterministic unit tests, statistical output validation, and regression suites that catch quality regressions before they reach production.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New ai systems? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up testing ai systems for our production AI system**
→ Assess current infrastructure → identify gaps in testing ai systems capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our testing ai systems is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our testing ai systems performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define testing ai systems requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish testing ai systems review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — testing ai systems that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure testing ai systems respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design testing ai systems to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — testing ai systems configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All testing ai systems data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core testing ai systems workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation