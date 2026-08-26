# Playbooks — Strategy / Execution / Measurement / Iteration

Consolidated from the source's "full playbook" requirement. Four phases.

## 1. Strategy
- **Goal:** maximize activated, retained users for a deal-sourcing/portfolio product.
- **Wedge:** Outcome-First onboarding — configure the product around the user's stated
  goal instead of asking for settings first.
- **Bet:** activation-gated monetization + a centralized lifecycle brain reduces churn
  and lifts expansion vs. uncoordinated growth tactics.

## 2. Execution
- Build order: schemas → instrumentation (08) → wizard (01) → activation (02) →
  lifecycle (05) → retention/expansion/team/integrations → enhancements.
- Ship the compliance gate before any real deal data is exposed.
- Wire the A/B harness (variant tag in every event) from day one.

## 3. Measurement
- North-star: **activation rate** + **time-to-activation**.
- Guardrails: D7/D30 retention, expansion rate, churn, upsell-dismiss rate.
- Primary A/B metric: 24h activation rate, Outcome-First vs Standard.
- See `dashboards/kpi-definitions.md` for exact definitions.

## 4. Iteration
- Weekly: review activation funnel drop-off by onboarding branch.
- Act on `retention_decay_detected` → tune cadence before churn.
- Promote winning A/B arm; retire the loser; open the next experiment
  (e.g. persona selection on/off).
