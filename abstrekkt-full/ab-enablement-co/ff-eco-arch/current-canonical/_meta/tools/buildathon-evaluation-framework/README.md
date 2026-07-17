# Buildathon Evaluation Framework (ZIP_SPEC)

> Reconstructed from source chat
> `Project evaluation framework for buildathon submissions` (uuid `18cf22cf…`, batch-0001).
> The source iterated a deterministic project-scoring system (ChatGPT → GitHub
> Copilot → Claude) that ranks repos, checks Replit Mobile Buildathon readiness,
> and auto-generates remediation prompts. It progressed across four turns from a
> manual "extraction prompt" to a fully-automated, tests-as-guardrail CI pipeline.
> This package consolidates that into a working, vendor-neutral evaluation kit:
> a scoring rubric, scorecard templates (Markdown + CSV + JSON schema), judge
> guidelines, a ranking/aggregation method, and the automation scripts — with the
> source's own honesty caveats and kill switches preserved.

## 1. Executive Summary

A **deterministic project-evaluation framework** for ranking hackathon/buildathon
submissions (and internal repos) on a **0–100 composite score** built from five
weighted dimensions: Pain-Point Validation (30), Timeline Reality (20), Execution
Risk (20), Platform Fit (15), and Quality Gates (15). The scoring is anchored by
an **evidence standard** ("no evidence, no points"), **UNKNOWN penalties** that
punish optimism bias, and three **kill switches** that stop flashy-but-nonviable
projects from ranking high regardless of composite.

The kit ships:

- a **machine-readable rubric** (`rubric/`) with criteria, weights, scales, and
  the exact composite formula and kill-switch logic;
- **scorecard templates** (`scorecard/`) in Markdown (human fill-in), CSV
  (spreadsheet ranking), and a **JSON Schema** (machine validation + automation);
- **judge guidelines** (`judging/`) covering the evidence bar, bias/fairness
  controls, conflict-of-interest handling, and a tie-breaker procedure;
- an **aggregation/ranking method** (`rubric/aggregation-and-ranking.md`) that
  sorts by Status → Composite → tie-breakers across many scorecards;
- the **automation** the chat described (`automation/`): a deterministic repo
  evaluator, a Replit-buildathon readiness checker, a multi-repo aggregator
  workflow, and the Claude/Copilot remediation-prompt pack — plus the auto-fix
  options A/B/C with their safety model intact.

Crucially, the source's caveats are kept visible: CI scoring is **conservative**
(it can only see repo signals, so Pain defaults low), timeline estimates remain
**heuristic**, Replit's official rules were **not fully fetchable** at authoring
time (so external items are marked UNKNOWN until linked), and the "zero-review"
auto-fix path is gated behind **tests + auto-revert**, never blind trust.

## 2. What it produces

- A **single composite score /100 per project** plus a one-line ranking row:
  `| Project | Status | Composite | Pain (/5) | Days | Risk (/200) | Fit % | Gates (/9) | Top Risks | Next Actions |`
- A **STATUS verdict** — `SHIP` / `CONSIDER` / `NOT READY` (and `SHIP FIRST` when
  sorting) — bounded by kill switches, so the verdict can never overstate readiness.
- A **ranked table across many projects** (multi-repo aggregator) sorted
  `SHIP > CONSIDER > NOT READY`, then by composite descending, then tie-breakers.
- A **Replit Buildathon readiness report** (18-item checklist by category +
  severity) with PASS/FAIL and per-gap **remediation prompts** ready to paste
  into Claude or Copilot.
- **Remediation prompts** auto-derived from the exact gaps found, so closing a
  gap and re-scoring is a tight loop.

## 3. Scoring model (at a glance)

```
                       weight   scale → points
  Pain-Point Validation  30     (validationScore / 5) * 30
  Timeline Reality       20     <=10d:20 | 11-14:12 | 15-21:5 | >21:0
  Execution Risk         20     (1 - riskTotal/200) * 20   (floor 0)
  Platform Fit           15     (fit% / 100) * 15
  Quality Gates          15     (gatesPassed / 9) * 15
                       -----
  Composite             100     sum of the above

  KILL SWITCHES (applied AFTER composite):
    validationScore < 3  -> STATUS max = CONSIDER
    gatesPassed     < 7  -> STATUS cannot be SHIP   (=> NOT READY)
    totalDays      > 14  -> cannot be SHIP FIRST    (=> CONSIDER)

  EVIDENCE RULE: blank/UNKNOWN field = penalty, never "TBD optimism".
    - each UNKNOWN user-discovery item:  -0.5 validation
    - any UNKNOWN timeline phase:         +2 days
    - each UNKNOWN risk row:              +10 risk
```

Three honest design constraints carried from source:

1. **CI scoring is intentionally conservative** — a repo rarely contains user
   interviews, so the automated evaluator defaults Pain to ~1.5/5. Raise it by
   linking issues/PRs that cite real user pain; don't game it.
2. **Timeline is heuristic** — inferred from TODO density, missing tests/infra.
   Treat "UNKNOWN timeline" as a real risk; it expands scope silently.
3. **Kill switches can be unfair to R&D spikes** — label genuine exploration as
   `Spike` and exclude it from SHIP ranking until it graduates with evidence.

## 4. Production Deliverables (file tree)

```
buildathon-evaluation-framework/
├── README.md                               (this file)
├── rubric/
│   ├── scoring-rubric.md                    criteria, weights, scales, formula, kill switches
│   ├── rubric.json                          machine-readable rubric (criteria + scoring fns)
│   └── aggregation-and-ranking.md           multi-project sort + tie-breaker method + worked example
├── scorecard/
│   ├── scorecard-template.md                human fill-in scorecard (single project)
│   ├── scorecard.csv                        spreadsheet template / ranking sheet (header + examples)
│   └── scorecard.schema.json                JSON Schema validating one scorecard
├── judging/
│   ├── judge-guidelines.md                  evidence bar, scoring procedure, conflict-of-interest
│   └── bias-and-fairness-checklist.md       fairness, calibration, bias controls for scorers
├── automation/
│   ├── README.md                            how the scripts/workflows fit together + safety model
│   ├── scripts/
│   │   ├── evaluate-project.mjs             deterministic repo evaluator (score + prompts)
│   │   └── replit-readiness-check.mjs       18-item buildathon readiness checker
│   └── workflows/
│       ├── project-eval-comment.yml         posts/updates eval comment on /evaluate
│       ├── multi-repo-ranking.yml           ranks N repos into one table (workflow_dispatch)
│       └── claude-auto-fix.yml              semi-auto: Claude generates fix -> draft PR (Option B)
├── prompts/
│   └── remediation-prompts.md               Copilot/Claude prompt pack (gaps -> fixes); auto-fix A/B/C
├── VALIDATION.md                            worked scoring math + smoke checks + acceptance criteria
└── SECURITY.md                              untrusted-input handling, secrets, least-privilege CI
```

## 5. Implementation Considerations

- **Run at feature freeze, not mid-spike.** The evaluator under-scores work that
  lives locally and isn't committed; it reads repo signals only.
- **Standardize the evaluator path** (`.github/scripts/evaluate-project.mjs`)
  across repos so the multi-repo aggregator can find it; repos without it rank
  low by design.
- **Let the deep pass be human/LLM.** Keep CI conservative; use Claude/Copilot
  Chat to enrich Pain/Risk from issues and PR discussion, then re-score.
- **Re-weight per contest if needed** (e.g., bump Platform Fit to 25, drop Risk
  to 10) — but keep kill switches intact and document the reweight on the scorecard.
- **Reproducibility:** the rubric is the single source of truth; the Markdown,
  CSV, JSON, and scripts all encode the *same* formula. Change one, change all.

## 6. Performance / Security Notes

- **Untrusted input.** Treat every repo/submission as untrusted. The evaluator
  and readiness checker **only read files** — they never execute project build
  scripts or untrusted code. See `SECURITY.md`.
- **Least privilege CI.** Eval/readiness workflows use `contents: read` +
  `pull-requests: write` only — no `actions: write`, no extra secrets beyond the
  default `GITHUB_TOKEN`. The auto-fix workflow needs `contents: write` and an
  `ANTHROPIC_API_KEY` secret; that is the only place a credential appears.
- **Secrets hygiene.** Generated `.env.example` files use placeholders only
  (`sk_test_xxx`, `https://xxx`); never real keys. The kit flags secrets in
  submissions rather than copying them into artifacts.
- **Auto-fix safety ladder.** Option A (manual review) and B (draft PR review)
  are recommended; Option C / zero-review is gated behind **lint + typecheck +
  tests** with **auto-revert + issue-on-failure**, and is restricted to low-risk
  changes (env files, docs, config) — never auth, schema, or business logic.
- **Multi-org cloning** needs a fine-scoped PAT (`GH_PAT`), not the default token.

## 7. Recommended Next Steps

1. Drop `automation/scripts/*` and `automation/workflows/project-eval-comment.yml`
   into one repo, open a PR, comment `/evaluate`, confirm the bot comments.
2. Add the multi-repo ranking workflow to a control repo; dispatch it with 3 repos.
3. Calibrate scorers: have 2+ judges score the same sample project and compare
   (see `judging/bias-and-fairness-checklist.md`) before scoring the real field.
4. Tailor the risk model and Platform Fit weight to the specific contest/stack.
5. Wire Option B auto-fix on production repos; keep Option C limited to `.env.example`.

## 8. Validation Checklist

- [ ] Composite math reproduces the worked example in `VALIDATION.md` exactly
- [ ] Kill switches override composite (a 90-composite project with Gates<7 ≠ SHIP)
- [ ] `scorecard.schema.json` validates `scorecard.csv` example rows / a filled scorecard
- [ ] `evaluate-project.mjs` runs with no network and emits one ranking row
- [ ] `replit-readiness-check.mjs` emits status + remediation prompts for missing items
- [ ] UNKNOWN penalties are applied (not silently dropped)
- [ ] No secrets copied from submissions into any artifact
- [ ] CLAIMS CHECK completed (below)

## 9. CLAIMS CHECK

- **Verified (in source):** the five-dimension composite (30/20/20/15/15) and its
  exact formula; the three kill switches (Pain<3, Gates<7, Days>14); the
  evidence/UNKNOWN-penalty rule; the deterministic `evaluate-project.mjs` repo
  evaluator with stack/quality-gate detection; the 18-item Replit readiness
  checker with severities and per-gap Copilot prompts; the multi-repo aggregator
  workflow; the `/evaluate` PR-comment workflow; the remediation prompt pack; and
  auto-fix Options A (manual), B (draft-PR semi-auto), C (full-auto, low-risk),
  plus the zero-review tests-as-guardrail variant. The tie-breaker
  (Status → Composite → lowest Days → highest Pain → lowest Risk → fastest user
  proof) is from source.
- **Inferred (this kit):** the consolidated file layout; the vendor-neutral
  framing (the kit presents Copilot/Claude as interchangeable executors); the
  CSV + JSON-Schema scorecard encodings (source had Markdown scorecard + ranking
  row only); the judge-guidelines and bias/fairness docs (source mentioned
  fairness counterexamples but did not ship judge docs); and `rubric.json`.
- **Unresolved / caveats (flagged by source itself):** Replit's official
  buildathon rules pages were client-rendered and **could not be fully
  extracted**, so the readiness checklist uses "safe, generally required"
  submission items and marks external ones (demo video, TestFlight link) UNKNOWN
  until linked; CI scoring under-scores uncommitted local work; timeline
  estimates are heuristic; kill switches may unfairly penalize strategic R&D
  spikes (mitigate by labeling `Spike` and running a 48h validation sprint first);
  Claude-generated fixes have "no real understanding of your domain" and may emit
  suboptimal code (review for business logic). The web "Replit judging criteria"
  the source cited were **not re-fetched** during reconstruction.
- **Contradictions:** one tension is preserved rather than smoothed — the user
  explicitly asked for **zero manual review** while the source's own security
  guidance recommends review for anything beyond low-risk changes. The kit keeps
  both: zero-review is documented but fenced behind tests + auto-revert and a
  low-risk-only allowlist, with the disagreement stated in `SECURITY.md` and the
  automation README.
