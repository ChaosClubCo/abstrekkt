# KPI Definitions & Dashboard Spec

Exact, computable definitions for every KPI the Instrumentation layer (core prompt
08) feeds. Each KPI is sliceable by `abVariant` and onboarding branch.

| KPI | Definition | Source events | Target |
|---|---|---|---|
| **Activation rate** | users with `activation_reached` ÷ users with `onboarding_started` | 01, 02 | set baseline, then ↑ |
| **Time-to-activation** | median(`activation_reached.ts` − `onboarding_started.ts`) | 01, 02 | ↓ |
| **Onboarding completion** | users reaching final wizard step ÷ started | 01 (`step_completed`) | ↑ |
| **D7 / D30 retention** | active on day 7 / 30 ÷ activated cohort | session events | ↑ |
| **Habit strength** | median sessions/week among habitual+ | 03 | ↑ |
| **Expansion rate** | `expansion_accepted` ÷ activation-gated eligible | 04 | ↑ |
| **Upsell dismiss rate** | `expansion_dismissed` ÷ `expansion_offer_shown` | 04 | ↓ (too high = premature) |
| **Churn rate** | users entering `churned` ÷ cohort | 05 | ↓ |
| **Integration health** | `sync_succeeded` ÷ (`sync_succeeded`+`sync_failed`) per service | 07 | ↑ |

## Dashboard views
1. **Activation funnel:** started → step_completed (per step) → activation_reached,
   split by A/B arm and onboarding branch.
2. **Lifecycle distribution:** count of users per `lifecycle_state.stage` over time.
3. **A/B scorecard:** primary + secondary metrics per arm with confidence interval.
4. **Integration health:** success ratio + last-sync age per service.

## Privacy
No raw financial/deal values in any event or view — hash/bucket at emission
(enforced by core prompt 08).
