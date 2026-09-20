# Vision · V·04 Iterate Relentlessly
> First version exists to be replaced. Plan for the second.

## TL;DR
Shipping is not the end of the work. The first commit is the worst version of the code that will ever exist; treat it that way.

## Analogy
Sculptors do not chisel marble in one pass. They rough out the form, step back, study the light, and remove material until the figure emerges.

## Concrete example
Write it ugly. Make it work. Read it tomorrow. Refactor in small commits. Each pass should improve one thing — naming, structure, error handling, performance — not all four at once.

## Operational definition
- Get to working before you get to elegant. Ugly code that runs is ahead of beautiful code that doesn't.
- Commit at the smallest unit that compiles and passes tests.
- Schedule a re-read 24 hours later. Most of your improvements will come from that re-read.
- Refactor in single-concern PRs. Mixed PRs hide regressions.

## Anti-patterns
- Holding code locally for a week trying to make it 'right'.
- Refactoring three things in one commit so reviewers can't tell what changed.
- Treating the first design as the final design.
- Skipping the re-read step because 'it works'.

## Practitioner checklist
- [ ] I shipped a working version within the first day.
- [ ] Each commit changes one concern at a time.
- [ ] I scheduled and performed a 24-hour re-read.
- [ ] Each refactor PR has a one-sentence description that names what improved.
- [ ] I deleted code that was wrong instead of leaving it 'for later'.

## Related
- vision/simplify-ruthlessly
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_