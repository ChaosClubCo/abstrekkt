# A/B Experiment — Outcome-First vs Standard Onboarding

## Hypothesis
Capturing the user's **outcome first** (then configuring the product around it)
produces a higher 24-hour activation rate than collecting settings first and the
outcome last.

## Arms
- **Control (`standard`):** collect deal criteria / portfolio settings first; outcome
  inferred at the end.
- **Treatment (`outcome_first`):** ask for the single primary outcome first; pre-fill
  everything else from it (core prompt 01).

## Assignment
- Randomize at first session; persist `abVariant` in `onboarding_state` /
  `lifecycle_state`; tag every event (core prompt 08) with the variant.

## Metrics
- **Primary:** 24h activation rate (`activation_reached` within 24h of
  `onboarding_started`).
- **Secondary:** time-to-activation, D7 retention, onboarding completion, upsell
  dismiss rate.
- **Guardrail:** compliance-gate abandonment (treatment must not increase it).

## Sample size (fill before launch — DO NOT skip)
- Decide baseline activation rate `p` and minimum detectable effect (e.g. +5pp).
- Compute n per arm for 80% power at α=0.05 (two-proportion test).
- Define the fixed run length / stop criteria up front to avoid peeking bias.

> The source chat requested this A/B but never specified sample-size math — that gap
> is flagged here because shipping an A/B without it produces unreliable results.

## Analysis & rollout
- Two-proportion z-test on primary metric at the pre-set stop point.
- Promote the winning arm; if inconclusive, keep control and open the next test.
