# Scoring Rubric

The single source of truth for how a project is scored. The Markdown scorecard,
CSV, JSON Schema, and `evaluate-project.mjs` all encode the **same** formula below.

## Operating principle: no evidence, no points

Every YES/MAYBE must cite an artifact: an interview note, a support ticket, a
metric, an issue link, or an observed workflow. If you cannot point to it, write
`UNKNOWN` and take the penalty. **A blank field is a risk multiplier, not "TBD
optimism."**

---

## 1. Dimensions, weights, and scales

| # | Dimension | Weight (pts) | Raw scale | Points formula |
|---|-----------|-------------:|-----------|----------------|
| 1 | Pain-Point Validation | 30 | `validationScore` 0–5 | `(validationScore / 5) * 30` |
| 2 | Timeline Reality | 20 | `totalDays` realistic | banded (see 2.2) |
| 3 | Execution Risk | 20 | `riskTotal` 0–200 (lower better) | `clamp((1 - riskTotal/200) * 20, 0, 20)` |
| 4 | Platform Fit | 15 | `fitPct` 0–100 | `(fitPct / 100) * 15` |
| 5 | Quality Gates | 15 | `gatesPassed` 0–9 | `(gatesPassed / 9) * 15` |
| | **Composite** | **100** | — | sum of 1–5 |

### 1.1 Pain-Point Validation (0–5)

Score five user-discovery questions. **Y = 1, MAYBE = 0.5, N = 0, UNKNOWN = 0**:

- A) You personally feel this pain (firsthand)?
- B) Real users told you (interviews, tickets, surveys) — give count + where?
- C) Quantified cost exists (hours, $, churn %)?
- D) Solving it unlocks something bigger (cascade effect)?
- E) Current workaround is painful (manual, or skipped entirely)?

**Penalty:** subtract `0.5` from `validationScore` for **each** item left UNKNOWN.

Interpretation: 5/5 = definitely real; 3–4 = probably real (validate 1–2 more);
1–2 = assumed (risky); 0 = hypothetical (not a candidate).

### 1.2 Timeline Reality (banded)

Estimate realistic `totalDays` (Phase 1 days 1–3, Phase 2 days 4–7, Phase 3 days
8–10, plus buffer). For repos, infer from TODO density, missing tests/infra/auth,
incomplete features.

| totalDays | Points |
|-----------|-------:|
| ≤ 10 | 20 |
| 11–14 | 12 |
| 15–21 | 5 |
| > 21 | 0 |

**Penalty:** for **any** phase whose effort is UNKNOWN, add `+2 days` before banding.

### 1.3 Execution Risk (0–200, lower is better)

Eight rows, each `probability (1–5) × impact (1–5)` = up to 25, summed to /200:

1. Unfamiliar library/framework
2. External API dependency (rate limits, auth, downtime)
3. Heavy polish/design work
4. Compliance/security gates (HIPAA, GDPR, PCI, SOC2)
5. Scale concerns (breaks at 100 concurrent?)
6. User-research gap (assuming the problem?)
7. Data migration / legacy integration
8. Team/dependency blocker

**Penalty:** for **each** UNKNOWN risk row, add `+10` to `riskTotal`.

Bands (for reference): <50 low · 50–100 medium · >100 high.

### 1.4 Platform Fit (0–100%)

For a **Replit Mobile Buildathon**, rate six criteria 1–5 and compute
`fitPct = sum/30 * 100`:

- Native device features (camera, GPS, sensors, notifications)
- Backend + real integration (DB, auth, payments, API)
- Visual polish (App-Store-ready)
- Real-world use case (not a generic todo app)
- Ship-ready in timeline (MVP in 10 days?)
- Novel / differentiated vs existing apps

For other platforms, define equivalent criteria and compute the same way.
Bands: >80% strong · 60–80% decent · 40–60% risky · <40% weak fit.

### 1.5 Quality Gates (0–9)

Mark a gate **passed only if implemented AND verifiable** ("RLS planned" ≠ "RLS
exists"). The nine gates:

1. Input validation (sanitized, type-checked, length-bounded; zod present)
2. Error handling (every path has Cause → Fix → Retry / error boundaries)
3. Security / secrets (no secrets in code, TLS, auth scoped, `.env.example`)
4. Testing (≥1 happy path + ≥1 edge case per feature)
5. Observability (Sentry errors + PostHog analytics, wired end-to-end)
6. Documentation (README, `.env.example`, deploy/rollback steps)
7. Performance (no obvious N+1, no unbounded lists, reasonable load)
8. Mobile-ready (responsive, touch-friendly, tested on real device)
9. Accessibility (WCAG AA: labels, alt text, focus indicators)

Bands: 9/9 ship · 7–8 ship with documented gaps · <7 not public-ready.

> Note: the deterministic CI evaluator uses a 9-gate proxy set
> (input_validation, error_handling, secrets_protected, testing, observability,
> documentation, linting, ci, accessibility). It is conservative — it only marks
> a gate true on obvious evidence. Use the human rubric above for final scoring.

---

## 2. Composite computation (canonical)

```
painPoints     = (validationScore / 5) * 30
timelinePoints = band(totalDays)                         // 20 / 12 / 5 / 0
riskPoints     = clamp((1 - (riskTotal / 200)) * 20, 0, 20)
platformPoints = (fitPct / 100) * 15
qualityPoints  = (gatesPassed / 9) * 15

composite = painPoints + timelinePoints + riskPoints + platformPoints + qualityPoints
          (rounded to 1 decimal)
```

---

## 3. Kill switches (applied AFTER composite)

A high composite is **not** a license to ship. Apply, in order:

```
if validationScore < 3  -> STATUS max = CONSIDER     (cannot SHIP / SHIP FIRST)
if gatesPassed     < 7  -> STATUS = NOT READY        (cannot SHIP)
if totalDays      > 14  -> STATUS max = CONSIDER      (cannot SHIP FIRST)
otherwise                -> STATUS = desired (SHIP)
```

### Kill-switch escape hatches (fairness)

- A genuine **R&D spike** may legitimately have low Pain evidence. Label it
  `Spike` and **exclude it from SHIP ranking** until it graduates with evidence.
- A **strategically valuable** project with thin early Pain evidence should run a
  **48-hour validation sprint** (demo + 3 real users) and be **re-scored**, not
  exempted from the rule.

---

## 4. Status definitions

- **SHIP / SHIP FIRST** — high confidence, good state; deploy.
- **CONSIDER** — shippable with known gaps; mitigate or consciously accept.
- **NOT READY** — data missing, timeline unrealistic, or quality too low.
- **Spike** — deliberate R&D; not eligible for SHIP ranking yet.

## 5. Output: the ranking row

Each scored project emits exactly one row:

```
| Project | Status | Composite | Pain (/5) | Days | Risk (/200) | Fit % | Gates (/9) | Top Risks | Next Actions |
```
