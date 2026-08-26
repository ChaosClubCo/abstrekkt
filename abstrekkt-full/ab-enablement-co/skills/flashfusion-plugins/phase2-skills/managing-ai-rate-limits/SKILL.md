---
name: managing-ai-rate-limits
description: >-
  Implements rate limiting and quota management for AI services
  including per-tenant quotas, fair usage policies, burst handling, and
  graceful degradation. Activates when implementing AI rate limits,
  designing quota systems, building fair usage policies, handling API
  burst traffic, or managing graceful degradation. Also triggers on:
  rate limiting, quota, fair usage, API throttling, burst handling, rate
  limit, API quota, usage limit, throttle, or too many requests. Even if
  someone says 'rate limit the AI API' or 'one tenant is using all the
  capacity' — use this skill.
version: "1.0.0"
---

# Managing AI Rate Limits

Protects shared AI infrastructure at Intinc — per-tenant quotas, burst handling, and graceful degradation that prevent one client's spike from affecting everyone else.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New ai rate limits? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up managing ai rate limits for our production AI system**
→ Assess current infrastructure → identify gaps in managing ai rate limits capability → select appropriate tools and frameworks → design architecture → implement with CI/CD integration → validate with production-representative load → document runbooks.

**Example 2 — Our managing ai rate limits is failing — diagnose and fix**
→ Collect error logs and metrics → identify root cause category (config, capacity, code, data) → isolate the specific failure → implement fix → validate with regression tests → update monitoring to catch recurrence → document in incident log.

**Example 3 — Improve our managing ai rate limits performance and reliability**
→ Benchmark current performance → identify bottlenecks → evaluate optimization options (cost, complexity, impact) → implement highest-impact changes first → measure improvement → iterate on remaining items → update capacity plan.

## Golden Path Workflow

1. Define managing ai rate limits requirements (scale, latency, reliability, cost)
2. Assess current infrastructure and identify gaps
3. Select tooling and design architecture
4. Implement in staging environment with CI/CD integration
5. Validate with production-representative workloads
6. Deploy to production with monitoring and alerting
7. Document runbooks for operations and on-call
8. Set up automated health checks and drift detection
9. Establish managing ai rate limits review cadence (weekly metrics, monthly deep-dive)

## Edge Cases & Anti-Patterns

- **Scale surprises** — managing ai rate limits that works at 100 QPS may fail at 10,000. Always test at 2-3x projected peak load.
- **Multi-tenant isolation** — Ensure managing ai rate limits respects tenant boundaries. One client's data/traffic must never affect another's.
- **Dependency failures** — Design managing ai rate limits to degrade gracefully when upstream services (model providers, databases) are unavailable.
- **Configuration drift** — managing ai rate limits configs in staging must match production. Use infrastructure-as-code and automated drift detection.

## Cross-Skill References

Works with: `selecting-models`, `defining-ai-metrics`, `building-training-pipelines`, `versioning-models`, `deploying-models`

## Compliance & Security

SOC2 (change management for model deployments, access controls), GDPR (data minimization in training data, right to erasure), HIPAA (PHI handling in training pipelines and inference logs), ISO 27001 (information security controls for ML infrastructure).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All managing ai rate limits data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core managing ai rate limits workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real mlops & ai engineering scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the mlops & ai engineering scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation