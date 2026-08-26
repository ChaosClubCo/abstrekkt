# Judge Guidelines

How a human (or LLM acting as judge) applies this rubric consistently across a
field of submissions. The goal is **apples-to-apples**: same evidence bar, same
scoring math, same decision thresholds.

## 1. The one rule: no evidence, no points

For every YES/MAYBE you record, cite the artifact you saw — an interview note, a
support ticket, a metric, a GitHub issue/PR, or an observed workflow. If you
cannot point to it, mark `UNKNOWN` and apply the penalty. Do **not** award points
for intent, ambition, or a good pitch. The score reflects evidence, not optimism.

## 2. Procedure (per submission)

1. **Read the repo/submission first.** Extract project name, owner, status, stack,
   and any signals (issues citing pain, tests, observability, security config).
2. **Fill the scorecard top-to-bottom.** Don't skip sections. Use `UNKNOWN` freely.
3. **Apply penalties as you go** — `−0.5` validation per UNKNOWN discovery item,
   `+2` days per UNKNOWN phase, `+10` risk per UNKNOWN risk row.
4. **Mark quality gates conservatively.** "Planned" ≠ "passed". Only mark a gate
   true if it is implemented **and** verifiable in the artifact.
5. **Compute the composite** with the canonical formula (do not eyeball it).
6. **Apply kill switches AFTER the composite.** A high score never overrides them.
7. **Write the verdict + 2-line confidence justification**, then emit the row.

## 3. Verifiable-only quality gates

- **Input validation:** schema/zod present and used, not just imported.
- **Error handling:** real error boundaries / Cause→Fix→Retry, not bare try/catch.
- **Observability:** wired end-to-end — error captured, session context attached,
  visible in a dashboard. "Sentry installed" alone is not enough.
- **Performance:** only mark passed if you actually checked for N+1 / unbounded
  lists / sync loops. Unchecked = not passed.
- **Security:** no secrets in code, TLS, scoped auth, RLS for multi-tenant.

## 4. Status thresholds

| Composite (after kill switches) | Typical verdict |
|---------------------------------|-----------------|
| ≥ 80 and no kill switch tripped | SHIP (top → SHIP FIRST) |
| 60–79 | CONSIDER |
| < 60, or any kill switch tripped to NOT READY | NOT READY |

Kill switches always win: a 90-composite project with Gates 6/9 is **NOT READY**,
not SHIP.

## 5. Conflict of interest

- A judge **must recuse** from scoring any project they (a) built or contributed
  to, (b) have a financial stake in, or (c) mentored during the build.
- Recused projects are scored by a different judge; if the field is small, use a
  second independent scorer for the affected entries.
- Record recusals on the ranking sheet for auditability.

## 6. Calibration before the real field

Before scoring submissions that count, two or more judges independently score the
**same** sample project and compare. If composites differ by more than ~10 points
or statuses disagree, reconcile the evidence interpretation before proceeding.
See `bias-and-fairness-checklist.md`.

## 7. Tie-breakers

When two projects tie on Status and Composite, break ties by: lowest Days →
highest Pain → lowest Risk → fastest user proof (demo + 3 real users in 48h).
See `rubric/aggregation-and-ranking.md`.

## 8. Handling R&D spikes and strategic bets

- True exploration with thin Pain evidence: label `Spike`, exclude from SHIP
  ranking, revisit after a 48-hour validation sprint.
- A strategically important project with weak early evidence is **not exempt**
  from kill switches — run the validation sprint, then re-score.

## 9. LLM-as-judge notes

If you delegate scoring to Copilot/Claude, force **repo-first analysis**, require
file/issue references in every non-numeric field, compute the math deterministically,
and enforce kill switches explicitly. Keep the LLM in **read-only** mode while
judging — never let an evaluation run mutate the repo.
