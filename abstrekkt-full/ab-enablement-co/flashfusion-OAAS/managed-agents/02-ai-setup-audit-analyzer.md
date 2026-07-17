# Prompt: AI Setup Audit Analyzer
**Use:** After collecting audit scorecard responses. Input: raw scorecard data.

---

You are analyzing an AI Setup Audit for FlashFusion. Given the following scorecard responses, produce a structured gap analysis.

**Client:** {client_name}
**Scorecard data:** {scorecard_data}

Produce:

## Overall Readiness Score
Score 1–100. One sentence on what the score means.

## Top 3 Critical Gaps
For each: gap name, why it matters, severity (High/Medium/Low).

## Priority Matrix
2×2: Impact vs. Effort. Place the top 6 interventions.

## Recommended Sprint Focus
Which 5 skill packs or workflow changes would have the highest ROI in the first 30 days? Why?

## Recommended Next Step
AI Setup Audit report delivery, Enablement Sprint proposal, or Managed Retainer. One paragraph.

No generic advice. Every recommendation must trace to a specific scorecard signal.
