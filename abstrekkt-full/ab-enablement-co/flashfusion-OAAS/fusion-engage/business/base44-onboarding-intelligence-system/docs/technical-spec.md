# Technical Specification — Base44 Onboarding Intelligence System

## Purpose
Personalize and operate the full user lifecycle (onboarding → activation →
retention → expansion) for a deal-sourcing / portfolio-management app built on
Base44, with consistent instrumentation and an Outcome-First A/B test.

## Data models
- `onboarding-state.schema.json` — per-user onboarding progress + compliance gate.
- `lifecycle-state.schema.json` — stage + next-best-action; written by prompt 05,
  read by 02/03/04/06.

## Components
8 core Base44 prompts (see `prompts/prompt-library.md`) + 15 enhancements. Lifecycle
Intelligence (05) is the orchestration hub; Instrumentation (08) defines the shared
event taxonomy that makes every layer measurable.

## Key invariants
1. `activationReached` = first-win task complete, **not** form complete.
2. Monetization (04) is hard-gated on `activation_reached`.
3. One primary action per user per window (enforced by 05).
4. No raw financial values in analytics events (hash/bucket).
5. Compliance (KYC/accredited) gate precedes any deal/portfolio data.

## External dependencies
Supabase (data + RLS), Vercel, n8n, plus optional Microsoft/Claude/Google/AWS
integrations (see `integrations/README.md`). All external data is untrusted input.

## Open platform questions (verify against Base44)
Prompt-length limits, schema typing support, and component primitives may force
restructuring — confirm before full build.
