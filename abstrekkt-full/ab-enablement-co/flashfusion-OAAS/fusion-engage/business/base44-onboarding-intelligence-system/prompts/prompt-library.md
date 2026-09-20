# Prompt Library — Consolidated Index

Searchable, cross-referenced index of every prompt in this package. All prompts
share the `onboarding_state` / `lifecycle_state` data models and the event taxonomy
defined in core prompt 08.

## Core (user lifecycle, in dependency order)

| # | Prompt | Reads | Writes / Key event |
|---|---|---|---|
| 01 | [Onboarding Wizard — Outcome-First](core/01-onboarding-wizard-outcome-first.txt) | — | onboarding_state, `onboarding_started` |
| 02 | [Activation System](core/02-activation-system.txt) | onboarding_state | `activation_reached` |
| 03 | [Retention & Habit Loops](core/03-retention-habit-loops.txt) | lifecycle_state | `habit_*`, `retention_decay_detected` |
| 04 | [Power-User Expansion & Monetization](core/04-power-user-expansion-monetization.txt) | lifecycle_state (gated on activation) | `expansion_accepted` |
| 05 | [Lifecycle Intelligence](core/05-lifecycle-intelligence.txt) | all signals | lifecycle_state, `lifecycle_stage_changed` |
| 06 | [Org / Team Expansion](core/06-org-team-expansion.txt) | onboarding_state | `workspace_created`, `member_joined` |
| 07 | [Ecosystem Integrations](core/07-ecosystem-integrations.txt) | — | `integration_connected`, `sync_*` |
| 08 | [Instrumentation & Analytics](core/08-instrumentation-analytics.txt) | all events | defines the taxonomy |

## Enhancements
15 differentiators in [enhancements/enhancement-prompts.md](enhancements/enhancement-prompts.md):
ghost mode, AI personas, time-budgeted workflows, adaptive UI density, explainable
recommendations, education sandbox, signal marketplace, advisor overlay,
gamification, social proof, predictive interventions, smart notifications,
personalized digest, onboarding checklist, referral loops.

## Build order
Schemas (`onboarding-state`, `lifecycle-state`) → 08 (taxonomy) → 01 → 02 → 05
(lifecycle brain) → 03/04/06/07 → enhancements. Lifecycle (05) is the orchestration
hub everything else reads.

## Cross-reference rules
- One primary action per user per window — enforced by Lifecycle Intelligence (05).
- Monetization (04) is hard-gated on `activation_reached` from (02).
- All financial values are hashed/bucketed in events (see Security Review).
