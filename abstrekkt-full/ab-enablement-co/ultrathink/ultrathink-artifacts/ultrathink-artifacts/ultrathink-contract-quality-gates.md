# Contract · C·03 Quality Gates
> If it didn't run, it isn't done. If it didn't pass review, it isn't shipped.

## TL;DR
Five gates between draft and merged: it compiles, it runs, it passes tests, it passes review, it's been re-read by the author.

## Analogy
Customs is not theater. Each checkpoint catches a different category of problem. Skip one and you don't speed up — you just push the failure downstream.

## Concrete example
Compile catches syntax. Runtime catches integration. Tests catch contract drift. Review catches design and naming. Author re-read catches the obvious thing the author missed in flow.

## Operational definition
- Gate 1: compiles / type-checks. No warnings suppressed silently.
- Gate 2: runs locally with realistic data. Synthetic data masks bugs.
- Gate 3: tests pass — the relevant ones, not just whatever was already there.
- Gate 4: peer or adversarial review. The reviewer should ask 'what could go wrong here'.
- Gate 5: 24-hour author re-read. Eyes that have been away find the obvious flaws.

## Anti-patterns
- `@ts-ignore` / `// eslint-disable` instead of fixing the underlying issue.
- Tests that assert on the implementation, not the behavior.
- 'LGTM' reviews on PRs the reviewer didn't read.
- Same-day merges of work the author has been heads-down on for hours.

## Practitioner checklist
- [ ] Build passes with zero suppressed warnings.
- [ ] Code ran locally against realistic data, not just synthetic fixtures.
- [ ] Tests pass and at least one new test was added or modified.
- [ ] A reviewer left at least one substantive comment.
- [ ] I re-read the diff at least 12 hours after writing it.

## Related
- contract/response-guarantees
- vision/iterate-relentlessly

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_