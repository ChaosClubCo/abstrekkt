# Project Scorecard

> Fill this out per project. Be ruthlessly honest. If a field is unknown, write
> `UNKNOWN` and apply the penalty noted in `rubric/scoring-rubric.md`. No optimism
> points. Every YES/MAYBE must cite evidence (issue link, ticket, metric, note).

```
SCOPE_MODE: STANDARD
ROLE: Ruthless Project Evaluator.
GOAL: Fill this scorecard with evidence, compute composite /100, emit one ranking row.
RULE: Unknown field -> write "UNKNOWN" + apply penalty. No optimism points.
```

## Project baseline (facts)

- **Project name:**
- **Owner(s):**
- **Status:** Idea / Spike / MVP / Alpha / Beta / Shipped
- **One-sentence problem (who + cost):**

## User discovery (Y / N / M + evidence)

| # | Question | Y/N/M | Evidence (link / count / metric) |
|---|----------|-------|----------------------------------|
| A | I personally feel this pain? | | |
| B | Real users told me? (count + where) | | |
| C | Quantified cost exists? (numbers) | | |
| D | Solving unlocks something bigger? | | |
| E | Current workaround is painful? | | |

- **Validation score** (Y=1, M=0.5, N=0, UNKNOWN=0): ____ / 5
- **Penalty:** −0.5 per UNKNOWN item. **Final validation score:** ____ / 5

## MVP (week-1 ship: 3–5 features)

1.
2.
3.
4.
5.

- **Phase 2 (everything else):**

## Tech stack

- **Default stack used?** YES / NO
- If NO — deviations + risk (L/M/H) + mitigation:

## Timeline (realistic)

| Phase | Days | Estimated hours |
|-------|------|-----------------|
| Phase 1 (scaffold, data model, core logic, auth) | 1–3 | |
| Phase 2 (MVP features, UI, error handling, basic tests) | 4–7 | |
| Phase 3 (polish, QA, deploy, docs) | 8–10 | |
| Buffer | | |

- **TOTAL realistic days:** ____  (penalty: +2 days per UNKNOWN phase)
- **Can ship MVP in 10 days?** YES / NO / MAYBE — why:

## Execution risks (prob 1–5 × impact 1–5)

| Risk | Prob | Impact | Score (/25) | Mitigation |
|------|------|--------|-------------|------------|
| Unfamiliar library/framework | | | | |
| External API dependency | | | | |
| Heavy polish/design | | | | |
| Compliance/security gates | | | | |
| Scale concerns | | | | |
| User-research gap | | | | |
| Data migration/integration | | | | |
| Team/dependency blocker | | | | |

- **Sum total risk:** ____ / 200  (penalty: +10 per UNKNOWN row)

## Platform fit

- If Replit Buildathon — score each 1–5: native features, backend integration,
  visual polish, real-world use case, ship-ready, novelty.
- **Platform fit:** ____ %  ( = sum/30 × 100 for Replit, or platform-specific )

## Shipping readiness

- **Blockers** (each needs owner + date):
- **Quality gates passed:** ____ / 9 — list missing gates explicitly:
  - [ ] Input validation  - [ ] Error handling  - [ ] Security/secrets
  - [ ] Testing  - [ ] Observability  - [ ] Documentation
  - [ ] Performance  - [ ] Mobile-ready  - [ ] Accessibility

## Composite score (0–100)

```
1) Pain Points  = (validationScore / 5) * 30          = ____
2) Timeline     = band(totalDays)  (20/12/5/0)        = ____
3) Risk         = (1 - riskTotal/200) * 20  (floor 0) = ____
4) Platform Fit = (fitPct / 100) * 15                 = ____
5) Quality      = (gatesPassed / 9) * 15              = ____
                                  Raw Composite       = ____ / 100
```

## Kill switches (enforce)

- [ ] validationScore < 3 → STATUS max = CONSIDER
- [ ] gatesPassed < 7 → STATUS = NOT READY (cannot SHIP)
- [ ] totalDays > 14 → cannot be SHIP FIRST

## Final verdict

- **STATUS:** SHIP / CONSIDER / NOT READY
- **CONFIDENCE:** High / Medium / Low (2-line justification):

## Output (paste-ready ranking row)

```
| Project | Status | Composite | Pain (/5) | Days | Risk (/200) | Fit % | Gates (/9) | Top 2 Risks | Next 2 Actions |
| <name>  | <S>    | <n>/100   | <p>/5     | <d>  | <r>/200     | <f>%  | <g>/9      | <r1; r2>    | <a1; a2>       |
```
