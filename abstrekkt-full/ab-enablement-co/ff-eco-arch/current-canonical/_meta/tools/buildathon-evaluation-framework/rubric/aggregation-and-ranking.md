# Aggregation & Ranking Method

How to turn many scorecards into one ranked decision.

## 1. Inputs

One **ranking row** per project (from the scorecard or the evaluator):

```
| Project | Status | Composite | Pain (/5) | Days | Risk (/200) | Fit % | Gates (/9) | Top Risks | Next Actions |
```

## 2. Sort order (apply in sequence)

1. **Status tier:** `SHIP > CONSIDER > NOT READY` (`Spike` is excluded from SHIP
   ranking; list it separately).
2. **Composite** descending.
3. **Tie-breakers**, in order:
   1. lowest **Days** (faster to ship)
   2. highest **Pain** (most validated)
   3. lowest **Risk**
   4. if still tied: pick the one that can produce **user proof fastest** —
      a working demo + 3 real users within 48 hours.

The top SHIP-tier project after sorting is the **SHIP FIRST** recommendation
(subject to the `totalDays > 14` kill switch, which blocks SHIP FIRST).

## 3. Worked example

Three projects, scored independently:

| Project | Pain | Days | Risk | Fit | Gates |
|---------|-----:|-----:|-----:|----:|------:|
| A (strong ship) | 4.5/5 | 9 | 55/200 | 80% | 8/9 |
| B (pretty but dangerous) | 2.0/5 | 12 | 120/200 | 90% | 6/9 |
| C (boring but lethal) | 5.0/5 | 7 | 40/200 | 60% | 9/9 |

### Composite math

**Project A**
```
pain     = (4.5/5)*30          = 27.0
timeline = band(9)             = 20
risk     = (1-55/200)*20       = 14.5
fit      = (80/100)*15         = 12.0
quality  = (8/9)*15            = 13.3
composite                      = 86.8 / 100
kill switches: none breached   -> STATUS = SHIP
```

**Project B**
```
pain     = (2.0/5)*30          = 12.0
timeline = band(12)            = 12
risk     = (1-120/200)*20      = 8.0
fit      = (90/100)*15         = 13.5
quality  = (6/9)*15            = 10.0
composite                      = 55.5 / 100
kill switches: Pain<3 -> max CONSIDER; Gates<7 -> NOT READY (the stricter wins)
                               -> STATUS = NOT READY
```

**Project C**
```
pain     = (5.0/5)*30          = 30.0
timeline = band(7)             = 20
risk     = (1-40/200)*20       = 16.0
fit      = (60/100)*15         = 9.0
quality  = (9/9)*15            = 15.0
composite                      = 90.0 / 100
kill switches: none breached   -> STATUS = SHIP (and SHIP FIRST: Days 7 <= 14)
```

### Final ranking

```
1. C — SHIP FIRST — 90.0/100   (provable AND shippable; wins outright)
2. A — SHIP        — 86.8/100
3. B — NOT READY   — 55.5/100   (slick demo, but kill switches cap it)
```

`Ranking: C > A > B` — matches the source's intent: the flashy, high-Fit Project B
is held back by weak Pain evidence and a failing quality gate, exactly what the
kill switches are designed to catch.

## 4. Reweighting per contest (optional)

If a contest overweights polish, you may temporarily shift weights — e.g.
Platform Fit 25, Execution Risk 10 — **but keep kill switches intact** and record
the reweight on every affected scorecard so comparisons stay honest. Never apply
a reweight to only some projects in the same field.

## 5. Automation equivalent

`automation/scripts/evaluate-project.mjs` emits one ranking row per repo, and
`automation/workflows/multi-repo-ranking.yml` clones N repos, runs the evaluator
in each, parses the composite out of the row, and sorts by the rules in section 2.
