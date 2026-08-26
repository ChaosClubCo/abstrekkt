---
name: selecting-models
description: >-
  Evaluates and selects AI/ML models for product features using
  structured comparison frameworks covering capability, cost, latency,
  licensing, and compliance. Activates when choosing between GPT-4,
  Claude, Llama, Gemini, or other models, benchmarking model
  performance, evaluating model providers, comparing open-source vs
  proprietary, or making build vs buy decisions for AI capabilities.
  Also triggers on: model selection, model comparison, GPT vs Claude,
  which model, model benchmark, LLM evaluation, model provider, open
  source LLM, model tradeoffs, or best model for this. Even if someone
  says 'which AI should we use' or 'compare these models' — use this
  skill.
version: "1.0.0"
---

# Selecting Models

Provides structured model selection at Intinc — moving beyond hype to evidence-based comparisons across capability, cost, latency, compliance, and operational burden. Ensures every model choice has a documented rationale that can withstand stakeholder and audit scrutiny.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New capability needed? ───── Requirements → Candidate List → Benchmark → Select
  ├─ Replace existing model? ──── Gap Analysis → Migration Assessment → A/B Plan
  ├─ Cost optimization? ────────── Usage Audit → Smaller Model Test → Routing Strategy
  ├─ Compliance constraint? ────── Data Residency Check → Provider Audit → Approved List
  └─ Client-facing decision? ───── Risk Matrix → SLA Mapping → Recommendation Deck
```

## Usage Examples

**Example 1 — We need an LLM for our customer support chatbot — GPT-4 or Claude?**
→ Define requirements (latency <2s, context window >100K, HIPAA ok) → run identical test suite on both → compare accuracy, cost per 1K tokens, p95 latency, content policy alignment → score against weighted criteria → recommend with data table and fallback strategy.

**Example 2 — Should we use an open-source model for internal document Q&A?**
→ Assess data sensitivity (can data leave our network?) → if not, open-source is mandatory → evaluate Llama 3, Mistral, Qwen on our benchmark → compare hosting cost (GPU hours) vs API cost → factor in ops burden (patching, scaling) → recommend with TCO comparison.

**Example 3 — Our current model is too expensive at scale — find alternatives**
→ Pull current usage metrics (tokens/day, p50/p95 latency, accuracy) → identify candidate smaller/cheaper models → run regression tests on critical use cases → calculate cost savings at current and projected volume → propose routing strategy (cheap model for easy queries, expensive for hard ones).

## Golden Path Workflow

1. Define functional requirements (task type, accuracy threshold, latency SLA)
2. List non-functional requirements (data residency, compliance, licensing)
3. Build candidate shortlist (max 5 models)
4. Design benchmark suite with representative production data
5. Run standardized evaluation (accuracy, latency, cost, safety)
6. Score against weighted criteria matrix
7. Assess operational requirements (hosting, scaling, monitoring)
8. Calculate TCO for top 2-3 candidates at projected scale
9. Produce recommendation with data, rationale, and migration plan
10. Document decision in ADR format for future reference

## Edge Cases & Anti-Patterns

- **Multi-model architectures** — Don't assume one model fits all use cases. Route by complexity/cost using a classifier or rule engine.
- **Vendor lock-in** — Abstract the model layer behind a standard interface. Never hard-code provider-specific features without an escape hatch.
- **Benchmark gaming** — Models optimized for public benchmarks may underperform on your actual data. Always test with production-representative samples.
- **Compliance changes** — Model providers update terms of service. Re-evaluate quarterly for data handling and IP ownership changes.

## Cross-Skill References

Works with: `optimizing-ai-costs`, `evaluating-llm-quality`, `orchestrating-multi-models`, `assessing-ai-maturity`

## Compliance & Security

SOC2 (vendor risk assessment for model providers), GDPR (data processing agreements with providers), HIPAA (BAA requirements for health data), export controls (open-source model distribution).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All selecting models data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core selecting models workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real ai product management scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the ai product management scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation