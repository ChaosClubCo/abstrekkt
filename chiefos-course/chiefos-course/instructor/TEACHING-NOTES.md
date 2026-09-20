# Teaching Notes

## The core thesis (repeat it to students weekly)
"Direct and verify," not "prompt and pray." The survey proved this cohort's prompting
confidence (2.3) exceeds their code-writing (1.7) and bug-fixing (1.6). Left alone, they'd
become fast, confident, and helpless. The entire sequence raises the floor (CLI, Git, reading,
debugging) so AI becomes a supervised tool. Say this out loud often — it reframes every week.

## Phase 1 (Crawl) — the highest-leverage phase
This is where you win or lose the cohort. They are terminal- and Git-shy (Q2 2.4, Q3 1.8).
- Go slow. Reps over concepts. Let them fail at the 15-second challenge and retry.
- Do NOT let anyone skip to AI. Week 4 is deliberately AI-free.
- Watch for the student who quietly copies without typing — that's the future vibe coder. Pair them and make them explain `cd ..`.

## Phase 2 (Walk) — comprehension is the hinge
- Week 5 (reading) is the most under-valued and most important. Insist on **prediction before running.** The skill is predicting, not observing.
- Week 6 (Docker) is the lowest-confidence topic (1.5). Budget extra office hours. Most failures are "Docker Desktop isn't running" or port conflicts — trivial once you know, panic-inducing when you don't.
- Week 8 (debugging) at 1.6 confidence: teach errors as *maps*, not judgment. The hypothesis-before-fix requirement is the whole lesson; enforce it.

## Phase 3 (Run) — delivery
- Week 9: fight overscoping early. The spec + plan-review is where you catch it.
- Week 10: the "explain every file" rule is non-negotiable. It's the firewall against vibe coding. Spot-check by asking them to trace the delete feature live.
- Week 11: the secrets rule is the one security habit that matters most. Any committed secret is a teachable-moment stop-everything.
- Week 12: the defense Q&A decides the grade. A working-but-can't-explain app fails.

## Live session structure (any week, ~90 min)
1. 10 min — recap last week + one student narrates a concept (builds the teaching muscle FSRs need).
2. 25 min — instructor live demo of this week's skill (make mistakes on purpose; model debugging).
3. 40 min — guided reps; you float and unstick.
4. 15 min — set the week's `EXERCISES.md`, preview the `CHECK.md` bar.

## The "explain out loud" tool
Your single best diagnostic all course long: "explain that in your own words." It separates
did-it from understood-it in ten seconds, at every level. Use it constantly.
