# Architecture — Base44 Onboarding Intelligence System

```
                    ┌─────────────────────────────┐
  Outcome-First ───▶│  onboarding_state (schema)  │
  Wizard (01)       └──────────────┬──────────────┘
                                   ▼
  Activation (02) ──▶ activation_reached ──┐
  Retention (03) ──▶ habit/decay events ───┤
  Org/Team (06)  ──▶ workspace events ──────┤
  Integrations(07)─▶ sync events ───────────┤
                                            ▼
                          ┌─────────────────────────────┐
                          │ Lifecycle Intelligence (05) │  ← orchestration brain
                          │  writes lifecycle_state     │
                          └──────────────┬──────────────┘
                                         ▼
                          next_best_action ─▶ Expansion (04, gated)
                                         │
                          all events ────▼────▶ Instrumentation (08) ─▶ KPI dashboards
                                                      │
                                              A/B variant tag ─▶ outcome-first-vs-standard
```

## Layering rules
- (05) is the only writer of `lifecycle_state`; all behavioral layers read it.
- (08) defines the event envelope; every layer emits against it.
- (04) never fires before `activation_reached`.
- Compliance gate sits between onboarding and any deal/portfolio data.

## Why this shape
Centralizing stage logic in (05) prevents the classic failure of independent
growth tactics colliding (e.g. upsell + win-back to the same user same day).
Centralizing the taxonomy in (08) makes the A/B test and every KPI computable.
