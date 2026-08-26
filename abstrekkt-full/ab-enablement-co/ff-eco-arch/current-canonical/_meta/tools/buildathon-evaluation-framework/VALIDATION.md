# Validation, Smoke Checks & Acceptance Criteria

## 1. Scoring math — worked example (the canonical smoke test)

These three projects MUST reproduce exactly. If your spreadsheet, JSON, or script
disagrees, the encoding has drifted from `rubric/scoring-rubric.md`.

### Project A (strong ship)
Inputs: Pain 4.5/5, Days 9, Risk 55/200, Fit 80%, Gates 8/9

```
pain     = (4.5/5)*30        = 27.0
timeline = band(9)           = 20      (<=10)
risk     = (1-55/200)*20     = 14.5
fit      = (80/100)*15       = 12.0
quality  = (8/9)*15          = 13.3    (13.333 -> 13.3)
composite                    = 86.8 / 100
kill switches: none          -> SHIP
```

### Project B (pretty but dangerous)
Inputs: Pain 2.0/5, Days 12, Risk 120/200, Fit 90%, Gates 6/9

```
pain     = (2.0/5)*30        = 12.0
timeline = band(12)          = 12      (11-14)
risk     = (1-120/200)*20    = 8.0
fit      = (90/100)*15       = 13.5
quality  = (6/9)*15          = 10.0
composite                    = 55.5 / 100
kill switches: Pain<3 (max CONSIDER) AND Gates<7 (NOT READY) -> NOT READY
```

### Project C (boring but lethal)
Inputs: Pain 5.0/5, Days 7, Risk 40/200, Fit 60%, Gates 9/9

```
pain     = (5.0/5)*30        = 30.0
timeline = band(7)           = 20
risk     = (1-40/200)*20     = 16.0
fit      = (60/100)*15       = 9.0
quality  = (9/9)*15          = 15.0
composite                    = 90.0 / 100
kill switches: none          -> SHIP (and SHIP FIRST: Days 7 <= 14)
```

**Expected ranking:** `C (90.0, SHIP FIRST) > A (86.8, SHIP) > B (55.5, NOT READY)`.
This matches `scorecard/scorecard.csv` and `rubric/aggregation-and-ranking.md`.

## 2. Quick numeric self-check

```
band(totalDays): 10->20, 11->12, 14->12, 15->5, 21->5, 22->0
risk floor:      riskTotal 200 -> riskPoints 0 ; riskTotal 0 -> 20
quality:         gatesPassed 7 -> 11.7 ; 9 -> 15.0
```

## 3. Script smoke checks (no network, read-only)

Run from a sample repo (or this package's automation dir against a test repo):

```bash
node automation/scripts/evaluate-project.mjs
#   expect: a "### Project Evaluation" block, exactly one "| ... |" ranking row,
#           a "Missing quality gates" list, and remediation prompts.

node automation/scripts/replit-readiness-check.mjs
#   expect: "# Replit Mobile Buildathon Readiness", a Status line, per-category
#           checklists, and remediation prompts for each missing item.
```

Pass criteria:
- Both exit 0 with no network access and no project build executed.
- The evaluator emits a single parseable ranking row (the aggregator depends on it).
- Conservative defaults visible (Pain ~1.5/5, Days 12) unless evidence raises them.

## 4. Schema validation

Validate a filled scorecard (or the CSV rows converted to objects) against
`scorecard/scorecard.schema.json`. Composite and breakdown values must be
internally consistent with the inputs (re-derive with the formula in section 1).

## 5. Kill-switch override test

Construct a project with composite ≥ 90 but `gatesPassed = 6`. Expected STATUS =
`NOT READY`, NOT `SHIP`. If the score "wins" over the kill switch, the
enforcement order is wrong.

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Evaluator shows everything UNKNOWN / low Pain | CI can only see committed repo signals | Link issues/PRs citing user pain; run the LLM judge prompt for the deep pass |
| `/evaluate` comment never appears | Workflow token lacks PR-write | Enable "Read and write permissions" for Actions, or use a GitHub App token |
| Multi-repo clone fails on private/cross-org repos | Default `GITHUB_TOKEN` scope | Add a fine-scoped PAT as secret `GH_PAT` |
| Multi-repo row missing for a repo | No evaluator script in that repo | Add `.github/scripts/evaluate-project.mjs` (standardize the path) |
| Readiness checker errors on `src` walk | Missing/odd `src` layout | Script guards missing dirs; confirm `src/` exists or ignore that signal |
| Auto-fix PR auto-merged | Branch protection / auto-merge enabled | Disable auto-merge for `claude-fix/*`; require manual approval (Option B) |
| Claude fix JSON fails to parse | Model returned prose/markdown | Generator strips fences + validates id/filesModified/changes; re-run; pin model |
| Composite differs from this doc | Drift between rubric encodings | Re-derive from section 1; rubric.json + scoring-rubric.md are source of truth |

## 7. Acceptance criteria

- [ ] Section 1 worked example reproduces exactly (A=86.8, B=55.5, C=90.0).
- [ ] Ranking is C > A > B; B is NOT READY despite high Fit (kill switches work).
- [ ] Both scripts run offline, read-only, exit 0, emit the expected markdown.
- [ ] Evaluator emits exactly one parseable ranking row.
- [ ] `scorecard.schema.json` validates a filled scorecard and the CSV examples.
- [ ] UNKNOWN penalties applied (−0.5 validation, +2 days, +10 risk).
- [ ] No secrets from any submission appear in generated artifacts.
- [ ] Eval/readiness workflows use least privilege; only auto-fix has write scope.
- [ ] README CLAIMS CHECK present and split verified/inferred/unresolved/contradictions.
