# Scaling to 100+ Students

The grading model is designed to survive scale because it grades **understanding via short
artifacts**, not line-by-line code review.

## Grading strategy
1. **Weekly reps: spot-check + self-attest.** Students submit output + a 2–3 sentence
   explanation. You skim the explanation (10–20 sec each) — that's where understanding shows.
   Full code review is unnecessary and doesn't scale; the written explanation is the signal.
2. **Gates: full review, but only 3 times.** Weeks 4, 8, 12 get real attention. That's where
   pass/not-yet decisions matter.
3. **Peer teaching as force multiplier.** Ahead students help behind students (Week 1 README
   sets this expectation). Teaching is an FSR skill and it offloads you.

## Cohort structure at 100+
- Split into pods of ~15–20 with a TA or peer lead each.
- Pods do reps together; you run the main live session for everyone.
- A shared class channel for setup issues (most Phase 1–2 pain is environment, not concept).

## Triage: where your attention pays off most
- **Phase 1** — highest ROI. A student who leaves Phase 1 shaky on Git/terminal will fail
  Phase 3. Over-invest here.
- **Docker week (6)** and **debugging week (8)** — the two lowest-confidence topics; pre-stage
  extra office hours.
- **The quiet copier** — the student sailing through by pasting. The "explain out loud" tool
  finds them. Catch them in Phase 1, not the capstone.

## Automatable pieces
- Setup verification (the `git/node/docker/code --version` block) — self-serve, auto-checkable.
- The FLOOR-CHECK is self-scored; no grading load.
- Gate criteria are checklists — a TA can apply them consistently.
