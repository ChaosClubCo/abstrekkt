# Base44 User-Onboarding Intelligence System — ZIP_SPEC Package

> Reconstructed by the Claude Chat Extraction Kit from source chat
> `Clarifying-deliverables-for-zip-generation` (uuid `d04c593c…`, 2026-01-19).
> The original session was **cut off mid-build**; this package reconstructs the
> full intended deliverable rather than summarizing the partial output.

## 1. Executive Summary

A production-grade deliverable package for an **AI-powered user-onboarding
intelligence system** layered on a **deal-sourcing / portfolio-management
platform** built in **Base44**. The system personalizes a new user's deal
criteria, portfolio goals, and community preferences, then drives them through
activation, retention, and power-user expansion using an "Outcome-First"
onboarding mode. The deliverable is meant to serve four audiences at once:
direct Base44 paste-in (atomic prompts), team handoff (rationale + decision
trees), client presentation (polished, executive-ready), and an internal
searchable reference library.

## 2. Extracted Systems Inventory

| Component | Type | Purpose | Confidence |
|---|---|---|---|
| Onboarding Wizard (Outcome-First mode) | prompt/feature | Personalized first-run flow | high (stated) |
| Activation System | prompt/feature | Get users to first value fast | high |
| Retention & Habit Loops | prompt/feature | Recurring engagement | high |
| Power-User Expansion (monetization triggers) | prompt/feature | Upsell at value moments | high |
| Lifecycle Intelligence | prompt/feature | Stage detection + next-best-action | high |
| Org / Team Expansion | prompt/feature | Seat growth, shared workspaces | high |
| Ecosystem Integrations | prompt/feature | Connect Supabase/Vercel/n8n/etc. | high |
| Instrumentation & Analytics | prompt/feature | Event taxonomy, KPI capture | high |
| 15+ enhancement prompts | prompt set | Differentiators (see §5) | medium (named, not detailed) |
| Onboarding-state / Lifecycle-state schemas | JSON schema | Data models | high (requested) |

## 3. Gap & Risk Audit

- **Gaps:** original chat never produced the JSON schemas, visual flowcharts,
  A/B specs, or integration guides — it stopped during file creation. Base44's
  actual data-model constraints were never inspected.
- **Blindspots:** "Outcome-First vs Standard" A/B framing assumes enough traffic
  for significance — no sample-size math was discussed. Monetization triggers
  risk firing before the activation threshold (churn risk).
- **Bottlenecks:** 8 core + 15 enhancement prompts at full depth is a large
  generation job; that is exactly what cut the original session short.
- **Unknown-unknowns:** Base44 platform limits (prompt length, schema typing,
  component primitives) may force restructuring; compliance needs for a
  *deal-sourcing/portfolio* product (KYC, accredited-investor gating) were never
  raised and may be mandatory.
- **Contradictions:** none detected in source.

## 4. Upgraded Architecture

```
Outcome-First Onboarding  ──┐
                            ├─► Onboarding State (schema) ─► Lifecycle Engine
Activation / Habit Loops  ──┘                                   │
                                                                ▼
                          Instrumentation (event taxonomy) ─► KPI Dashboards
                                                                │
            Power-User / Monetization triggers ◄── Lifecycle stage transitions
```

**Added beyond the original ask (production hardening):**
- An explicit **event taxonomy** (`onboarding_started`, `step_completed`,
  `activation_reached`, `expansion_offer_shown`, …) so every prompt emits
  consistent analytics.
- **Compliance gate** before portfolio features (accredited-investor / KYC flag).
- **Activation-threshold guard** on monetization triggers to prevent premature upsell.

## 5. Production Deliverables (file tree)

```
base44-onboarding-intelligence-system/
├── README.md                      (this file)
├── prompts/
│   ├── core/                      8 atomic .txt prompts (one per system above)
│   │   └── 01-onboarding-wizard-outcome-first.txt   ← sample included
│   ├── enhancements/              15 differentiators: ghost/observer mode,
│   │   │                          AI strategy personas, time-budgeted workflows,
│   │   │                          adaptive UI density, explainable recommendations,
│   │   │                          education sandbox, signal marketplace,
│   │   │                          advisor/coach overlay, gamification, social-proof
│   │   │                          engine, predictive interventions, …
│   └── prompt-library.md          consolidated, cross-referenced index
├── schemas/
│   ├── onboarding-state.schema.json   ← sample included
│   └── lifecycle-state.schema.json
├── docs/
│   ├── technical-spec.md
│   ├── ARCHITECTURE.md
│   ├── decision-trees.md
│   └── playbooks/                 strategy / execution / measurement / iteration
├── integrations/                  supabase, vercel, n8n, microsoft, claude, google, aws
├── experiments/
│   └── outcome-first-vs-standard.md   A/B design + sample-size math
└── dashboards/
    └── kpi-definitions.md
```

Two signature artifacts are materialized in this package as runnable examples:
`prompts/core/01-onboarding-wizard-outcome-first.txt` and
`schemas/onboarding-state.schema.json`. The remaining files are specified above
for completion in a follow-up build pass.

## 6. Validation Checklist

- [ ] All 8 core prompts paste into Base44 and generate without truncation
- [ ] `onboarding-state` / `lifecycle-state` schemas validate against sample events
- [ ] Monetization triggers gated behind activation threshold
- [ ] Compliance gate present before any portfolio/deal feature
- [ ] A/B spec includes sample size + primary metric + stop criteria
- [ ] Each prompt has implementation notes + example output
- [ ] Claims check completed (below)

## 7. Security Review

- Deal-sourcing/portfolio data is **financial PII** — flag for KYC/accredited
  gating and Supabase RLS per-user isolation before launch.
- No secrets appeared in the source chat; none copied here.
- Analytics events must avoid logging raw financial figures (hash/bucket instead).

## 8. Recommended Next Steps

1. Confirm Base44 schema/prompt-length limits, then generate the 8 core prompts.
2. Author the two JSON schemas and wire the event taxonomy.
3. Build the Outcome-First vs Standard A/B spec with real sample-size math.
4. Add the compliance gate before deep-extracting the portfolio features.

## 9. CLAIMS CHECK

- **Verified (from source chat):** the 4-audience requirement, the 8 core systems,
  the request for 15+ enhancements, JSON schemas for onboarding/lifecycle state,
  integration targets (Supabase/Vercel/n8n/Microsoft/Claude/Google/AWS), and the
  Outcome-First vs Standard A/B ask.
- **Inferred:** the event taxonomy, compliance gate, and activation-threshold
  guard are this kit's production upgrades, not present in the original chat.
- **Unresolved:** Base44's concrete data-model/primitive limits; whether this is a
  real launch or an archive (the model explicitly asked and the thread cut off).
- **Contradictions:** none detected.
