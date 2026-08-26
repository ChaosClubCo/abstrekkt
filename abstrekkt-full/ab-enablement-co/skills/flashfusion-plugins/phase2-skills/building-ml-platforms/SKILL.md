---
name: building-ml-platforms
description: >-
  Designs internal ML platforms that standardize model development,
  training, deployment, and monitoring across teams. Activates when
  building ML platforms, designing MLOps infrastructure, standardizing
  ML workflows across teams, selecting ML platform tools, or building
  self-service ML capabilities. Also triggers on: ML platform, MLOps
  platform, internal ML tooling, ML infrastructure, platform engineering
  ML, self-service ML, ML developer experience, model factory, ML
  standardization, or build an ML platform. Even if someone says
  'standardize how we do ML' or 'build an internal ML platform' — use
  this skill.
version: "1.0.0"
---

# Building ML Platforms

Builds the ML platform that makes everything else faster at Intinc — standardized tooling, self-service workflows, and paved paths that let teams ship models without reinventing infrastructure.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New ml platforms? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up building ml platforms for our production AI system**
→ Assess current infrastructure → identify gaps in building ml platforms capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our building ml platforms is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our building ml platforms performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define building ml platforms requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish building ml platforms review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — building ml platforms that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure building ml platforms respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design building ml platforms to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — building ml platforms configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All building ml platforms data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core building ml platforms workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation