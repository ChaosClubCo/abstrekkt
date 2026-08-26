---
name: ai-audit-delivery
version: 1.0.0
metadata:
  description: Run FlashFusion AI Setup Audits end-to-end — gap analysis, priority matrix, written report, debrief.
  author: FlashFusion
  category: delivery
  use_when:
    - Running an AI Setup Audit for a client
    - Analyzing audit scorecard responses
    - Producing a gap analysis or priority matrix
    - Writing an audit report
    - Preparing for an audit debrief call
  trigger_phrases:
    - ai-audit-delivery
    - run the audit
    - analyze the scorecard
    - produce the audit report
    - audit gap analysis
    - audit priority matrix
    - audit debrief prep
allowed_tools:
  - read_file
  - create_file
---

# AI Audit Delivery Skill

## Purpose
Run FlashFusion AI Setup Audits from scorecard data to written report. Every audit follows the same methodology — this skill enforces consistency.

## Audit Dimensions (Score 1–10)

1. **Tool selection fit** — Are the right AI tools chosen for the use case?
2. **Prompt quality** — Are prompts structured, specific, and consistent?
3. **Skill deployment** — Are skill packs or custom instructions in use?
4. **Governance and policy** — Are there usage policies, guardrails, and approval flows?
5. **Team training** — Does the team know how to use AI tools effectively?
6. **Measurement** — Are time savings and ROI being tracked?
7. **Stack integration** — Are AI tools connected to existing workflows and systems?
8. **Data security** — Is sensitive data handled according to policy?

## Output Format

### Readiness Score
- Total: X/80
- Percentage: X%
- Level: Strong (80%+) / Developing (60-79%) / Early-stage (40-59%) / Critical gaps (<40%)

### Gap Analysis
List identified gaps by severity (High / Medium / Low). High = blocks ROI or creates risk. Medium = limits value. Low = nice-to-have.

### Priority Matrix
2x2 grid: Impact (vertical) vs. Effort (horizontal). Place top 6 interventions.

### Top Recommendations
3 specific, actionable recommendations. Each recommendation traces to a specific audit signal.

### Recommended Next Step
One of: Enablement Sprint ($5,000), Managed Retainer ($2,000/mo), or Custom. One paragraph.

## Report Structure
1. Executive summary (3 bullets)
2. Dimension scores (table)
3. Gaps identified (severity-ranked list)
4. Priority matrix
5. Recommendations (top 3)
6. Next steps

## Quality Gate
Before delivering any audit report:
- [ ] Every recommendation traces to a specific scorecard signal
- [ ] No generic advice that applies to any company
- [ ] Gaps are severity-rated, not just listed
- [ ] Next step is specific, not vague
