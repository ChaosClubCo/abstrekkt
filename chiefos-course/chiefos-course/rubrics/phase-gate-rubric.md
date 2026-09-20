# Phase Gate Rubric

Gates are pass/not-yet, not scored on a curve. "Not yet" means specific, fixable feedback and
a resubmit — nobody advances phases without the floor skill, because the next phase depends on it.

## Phase 1 Gate (Week 4) — 10%
PASS requires ALL:
- [ ] Repo live on GitHub, 5+ meaningful commits.
- [ ] A branch opened and merged **via pull request** (not a direct push).
- [ ] Page renders in a browser.
- [ ] Student can narrate the loop `branch → edit → commit → push → PR → merge` in own words.

NOT YET triggers: pushed straight to main (the PR is the lesson); can't explain the loop.

## Phase 2 Gate (Week 8) — 10%
PASS requires ALL:
- [ ] All 3 planted bugs fixed; program runs clean.
- [ ] `debug-log.md` shows a hypothesis BEFORE each fix.
- [ ] Fixes address cause, not symptom.
- [ ] Fixed program runs in a container the student built.

NOT YET triggers: bugs fixed by random editing with no hypotheses (method is the point);
"I asked AI to fix it" with no understanding.

## Phase 3 Gate (folded into Capstone, Week 12) — see capstone-rubric.md
PASS requires a deployed, defended app. Detailed in the capstone rubric.

## Why gates are hard stops
The survey showed a cohort that skips fundamentals and stalls. Gates exist so that the
stalling happens *here*, with a resubmit and support, instead of silently in Phase 3 when the
student can't build because they never really got Git or debugging.
