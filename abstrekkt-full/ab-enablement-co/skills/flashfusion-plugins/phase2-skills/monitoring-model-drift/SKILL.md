---
name: monitoring-model-drift
description: >-
  Detects and responds to model performance degradation including data
  drift, concept drift, and prediction quality monitoring. Activates
  when monitoring model drift, detecting data distribution changes,
  tracking prediction quality, setting up drift alerts, or diagnosing
  model degradation. Also triggers on: model drift, data drift, concept
  drift, model degradation, performance monitoring, prediction quality,
  drift detection, model decay, distribution shift, or why is the model
  getting worse. Even if someone says 'the model accuracy is dropping'
  or 'detect drift' — use this skill.
version: "1.0.0"
---

# Monitoring Model Drift

Catches model degradation before users notice at Intinc — continuous monitoring for data drift, concept drift, and prediction quality changes with automated alerting and response playbooks.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New model drift? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up monitoring model drift for our production AI system**
→ Assess current infrastructure → identify gaps in monitoring model drift capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our monitoring model drift is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our monitoring model drift performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define monitoring model drift requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish monitoring model drift review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — monitoring model drift that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure monitoring model drift respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design monitoring model drift to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — monitoring model drift configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All monitoring model drift data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core monitoring model drift workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation