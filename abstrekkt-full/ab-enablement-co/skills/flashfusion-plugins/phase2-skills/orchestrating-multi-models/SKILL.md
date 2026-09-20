---
name: orchestrating-multi-models
description: >-
  Designs multi-model architectures including routing logic, fallback
  chains, ensemble strategies, and model composition patterns. Activates
  when designing multi-model systems, implementing model routing,
  building fallback chains, creating ensemble strategies, or
  orchestrating model pipelines. Also triggers on: multi-model, model
  routing, fallback chain, ensemble, model composition, model pipeline,
  orchestration, model chain, sequential models, or use multiple models.
  Even if someone says 'route between models' or 'set up fallback
  chains' — use this skill.
version: "1.0.0"
---

# Orchestrating Multi-Models

Builds resilient multi-model systems at Intinc — routing requests to the right model based on complexity, cost, and capability with graceful fallbacks that prevent single-model failures from causing outages.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New multi models? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up orchestrating multi-models for our production AI system**
→ Assess current infrastructure → identify gaps in orchestrating multi-models capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our orchestrating multi-models is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our orchestrating multi-models performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define orchestrating multi-models requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish orchestrating multi-models review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — orchestrating multi-models that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure orchestrating multi-models respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design orchestrating multi-models to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — orchestrating multi-models configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All orchestrating multi-models data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core orchestrating multi-models workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation