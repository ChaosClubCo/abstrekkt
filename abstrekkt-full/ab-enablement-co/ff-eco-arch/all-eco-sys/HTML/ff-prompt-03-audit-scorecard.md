# FlashFusion Prompt Registry
## Prompt 03: AI Setup Audit Scorecard
**Version:** 1.0 | **Status:** Draft | **Model:** claude-sonnet-4-20250514 | **Updated:** 2026-05-13

---

### What this prompt actually does

Takes a completed Lumina audit intake (30 questions across 6 dimensions) and produces a scored assessment: dimension scores, a composite readiness score, a prioritized gap list, and a recommended 90-day roadmap. This is the deliverable engine behind the $15K Lumina AI Readiness Audit.

**Source:** FlashFusion product spec — Base44 AI Setup Audit Scorecard app (`69c440b10249984f1114bc4b`). The audit intake questions exist in Base44; this prompt processes their answers.

**What it is not:** the intake form itself. That's handled by Base44 (FreeAssessment form). This prompt runs after submission — it turns raw answers into a scored, actionable client deliverable.

---

## 0. Pre-Prompt Intake

| Item | This prompt |
|------|------------|
| **Task** | Score a completed Lumina audit intake; return dimension scores, composite score, gap analysis, and 90-day roadmap |
| **Input** | 30 structured audit responses across 6 dimensions |
| **Output** | JSON: dimension_scores (6), composite_score, maturity_tier, top_gaps (5), quick_wins (3), roadmap_90_day, exec_summary |
| **Success metric** | Composite score correlates with human expert assessment on 80%+ of test submissions; top_gaps are specific (not "improve your AI strategy"); roadmap is sequenced with dependencies noted |
| **Audience** | Kyle reviewing with client at audit debrief; client receives cleaned HTML version |
| **Failure mode** | All scores clustering in the 60-70 range regardless of inputs (score compression); generic gaps that could apply to any company; roadmap that lists "implement AI" as a step |

---

## I. Prompt Anatomy

### System Prompt / Role

```
You are a FlashFusion AI readiness assessor. You score client audit responses against a 
six-dimension framework and produce an honest, specific assessment. You do not inflate scores 
to make clients feel good. You do not soften gap findings. Your job is to produce an assessment 
that a client can act on — not one that makes them feel validated.

Scoring is calibrated against this distribution, based on the FlashFusion client baseline:
- 0-39: Pre-AI (most SMBs with <6 months of AI exposure)
- 40-59: Early Stage (AI experimentation, limited operational integration)
- 60-74: Developing (some production use, governance gaps, inconsistent adoption)
- 75-84: Advancing (operational integration, measurable outcomes, some governance)
- 85-100: Leading (enterprise-grade governance, measurable ROI, documented playbooks)

The benchmark: most SMB clients score 40-65 at first Lumina assessment. Score honestly against 
this distribution — a client with no governance, no measurement, and generic Copilot usage 
should score in the 35-55 range, not 65-70 because their answers sound optimistic.
```

### Why this system prompt matters

The calibration benchmark is the key element. Without it, Claude compresses scores toward the middle — everyone lands 60-72 regardless of their actual maturity. The explicit distribution anchors the model's scoring behavior to FlashFusion's client baseline.

---

### Six Dimensions and Weighting

```
DIMENSION 1: Tool Coverage & Integration (weight: 20%)
Questions assess: which AI tools are deployed, whether they're integrated with operational 
systems, whether data flows across tools or stays siloed.
Score drivers: +cross-system integration, +production deployment, +API/MCP connectivity
Score detractors: -single-tool only, -no operational integration, -consumer tools in enterprise

DIMENSION 2: Governance & Security (weight: 20%)
Questions assess: acceptable use policy, data handling rules, prompt injection awareness, 
RBAC, audit trails, approved tool list.
Score drivers: +written policy exists, +security team involved, +audit trail
Score detractors: -no policy, -shadow AI usage unaddressed, -no security review for agents

DIMENSION 3: Team Capability & Training (weight: 18%)
Questions assess: whether training has occurred, whether it was role-specific or generic, 
90-day adoption tracking, skill gap awareness.
Score drivers: +role-specific training, +adoption tracked, +skill gap mapped
Score detractors: -one-time generic session, -no tracking, -"people figured it out themselves"

DIMENSION 4: Use Case Clarity (weight: 17%)
Questions assess: whether use cases are documented, prioritized by ROI potential, and scoped 
to specific workflows rather than general "productivity."
Score drivers: +documented use cases, +ROI projections per use case, +workflow-specific
Score detractors: -vague ("improve productivity"), -no documentation, -no prioritization

DIMENSION 5: Measurement & ROI Tracking (weight: 15%)
Questions assess: whether baselines were established before deployment, what metrics are 
tracked, whether leading indicators are measured.
Score drivers: +baseline established, +leading indicators tracked, +P&L attribution attempted
Score detractors: -no baseline, -activity metrics only (prompts sent), -no measurement

DIMENSION 6: Roadmap & Executive Alignment (weight: 10%)
Questions assess: whether there's a documented AI roadmap, whether leadership is actively 
involved, whether budget is committed vs. experimental.
Score drivers: +documented roadmap, +executive sponsor, +committed budget
Score detractors: -no roadmap, -grassroots only, -"we're figuring it out"
```

---

### Task Specification

```
Score the following audit intake responses using the six-dimension framework.

AUDIT RESPONSES:
{audit_responses}

For each dimension:
1. Score 0-100 based on the evidence in the responses for that dimension
2. Identify the specific response(s) that most influenced the score (quote or closely paraphrase)
3. Note one concrete finding — what this score means for this client specifically

Then:
4. Calculate composite_score as the weighted average across all six dimensions
5. Assign maturity_tier based on the calibration benchmark
6. Identify top_gaps: the 5 most actionable gaps, ranked by estimated ROI impact if addressed
7. Identify quick_wins: 3 improvements achievable in <30 days with no new budget
8. Draft a 90-day roadmap with three phases (30/60/90 day milestones)
9. Write an exec_summary: 3-4 sentences a non-technical executive can read in 30 seconds

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "dimension_scores": {
    "tool_coverage": { "score": 0-100, "key_evidence": "string", "finding": "string" },
    "governance_security": { ... },
    "team_capability": { ... },
    "use_case_clarity": { ... },
    "measurement_roi": { ... },
    "roadmap_alignment": { ... }
  },
  "composite_score": 0-100,
  "maturity_tier": "Pre-AI|Early Stage|Developing|Advancing|Leading",
  "top_gaps": [
    { "gap": "string", "impact": "High|Medium|Low", "effort": "Low|Medium|High", "rationale": "string" }
  ],
  "quick_wins": [
    { "action": "string", "timeline": "string (<30 days)", "owner": "string" }
  ],
  "roadmap_90_day": {
    "days_1_30": ["string"],
    "days_31_60": ["string"],
    "days_61_90": ["string"]
  },
  "exec_summary": "string (3-4 sentences)"
}
```

---

### Input Format

The `audit_responses` object contains 30 responses. Each question maps to one of the six dimensions. Responses are either:
- Scale (1-5 Likert)
- Multiple choice (single answer)
- Free text (open-ended)

Example partial input:
```json
{
  "audit_responses": {
    "D1_Q1": "We use Microsoft Copilot for M365 and ChatGPT Business. No other AI tools are sanctioned.",
    "D1_Q2": "2 — Copilot works within M365 only. Our CRM (Salesforce) and accounting (Xero) are not connected.",
    "D2_Q1": "We have no formal AI policy. People use what works for them.",
    "D2_Q2": "1 — No, our security team has not reviewed any AI deployments.",
    "D3_Q1": "We did a 2-hour AI overview session in October 2025. That's all.",
    "D3_Q2": "2 — There was no follow-up or tracking.",
    "D4_Q1": "We haven't documented specific use cases. People use AI for emails and meeting notes.",
    "D5_Q1": "1 — We didn't establish a baseline before we started using AI.",
    "D5_Q2": "We track how many people have Copilot licenses active. That's it.",
    "D6_Q1": "No roadmap. Our CEO is interested but hasn't committed budget specifically for AI."
  }
}
```

Expected scoring for this input:
- tool_coverage: ~35 (Copilot only, no cross-system integration)
- governance_security: ~15 (no policy, no security review)
- team_capability: ~25 (one generic session, no tracking)
- use_case_clarity: ~20 (no documentation, generic usage)
- measurement_roi: ~10 (no baseline, activity metrics only)
- roadmap_alignment: ~30 (CEO interest, no budget, no roadmap)
- composite: ~24 → Pre-AI / Early Stage boundary

---

### Constraints

**Hard:**
- Composite score must be the weighted average — don't round to a "nice" number like 50 or 75
- `quick_wins` must require zero new budget and be completable by a single person in <30 days
- `top_gaps` must be specific to this client's responses — never generic ("improve your AI governance")
- `exec_summary` must be written for a non-technical audience — no jargon, no acronyms

**Soft:**
- If composite_score is below 40, don't list "establish a measurement framework" as a quick win — the client needs governance before measurement
- If governance_security is below 30, flag in the roadmap that this must be addressed before expanding deployment
- Don't list more than 2 items per roadmap phase — clients don't execute 8-item lists

---

### Testing Strategy

**Happy path:**
- Input: complete 30-response set with clear patterns (strong governance, weak measurement)
- Expected: governance score ~75, measurement score ~20, gap #1 = measurement, roadmap sequence starts with baseline establishment
- Validate: composite = weighted average (±2 points); maturity_tier matches score range

**Score compression test:**
- Input: weak response set (generic answers, no specifics)
- Expected: composite ≤ 45
- Red flag: composite scores 60+ on weak inputs → the calibration benchmark isn't holding

**Adversarial — overconfident self-assessment:**
- Input: client rates themselves 5/5 on everything in Likert questions, but free text reveals no documentation, no policy, no baseline
- Expected: model uses free text evidence to override the self-reported Likert scores; scores in 30-50 range despite 5/5 self-rating
- Validate: `key_evidence` fields quote the contradictory free text, not the Likert scores

---

### Platform Notes

**Claude Sonnet 4 (current):**
- Score calibration: tends to cluster in 55-70 range without the explicit distribution anchor in system prompt; with anchor, distribution widens appropriately
- Adversarial override: handles self-report vs. free-text contradiction well when the contradiction is explicit in the input; misses subtle contradictions
- JSON output at this depth (6 scored dimensions + gaps + roadmap + exec_summary): can fail to close the JSON structure at `max_tokens: 2000` — use 3000

**Known issue:** The 90-day roadmap phases sometimes contain redundant items between 30-60 and 60-90 day phases. Instruction to not repeat items across phases helps.

---

### Success Criteria

- Composite score correlation with expert assessment: ≥80% within ±10 points
- quick_wins require no new budget: 100%
- top_gaps are client-specific (not generic): ≥90% pass rate on audit review
- JSON parse success: ≥98% (3 retries allowed)

---

### Gaps & Blindspots

- **30 questions don't exist yet.** The Base44 app is seeded but the audit intake form (FreeAssessment) is untested end-to-end. The prompt is specced for a complete 30-response input that doesn't yet exist in production. The prompt will need to be adjusted once actual intake responses are collected and their format is confirmed.
- **Calibration is theoretical.** The benchmark distribution ("most SMB clients score 40-65") is a hypothesis based on market research, not FlashFusion's own client data. It may need recalibration after the first 10-15 real audits.
- **No handling for incomplete submissions.** The prompt assumes 30 complete responses. Partial submissions (skipped questions, empty fields) are not handled — the model will silently ignore missing data rather than flagging incompleteness.
- **Self-reported data reliability.** All 30 responses are self-reported. Companies consistently overrate their governance and underrate their measurement maturity. The adversarial test above partially addresses this, but systematic bias in self-reporting will distort scores across all clients until we have validation data.

---

### Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-13 | Initial v2.0 specification (Base44 audit scorecard product) |

---

*Documented from source: FlashFusion Base44 AI Setup Audit Scorecard (`69c440b10249984f1114bc4b`) + product spec*
