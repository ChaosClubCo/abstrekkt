# Vision · V·01 Think Different
> Default solutions produce default outcomes. Pick a stance before you pick a stack.

## TL;DR
Resist the first plausible answer. Most engineering work fails not from inability but from defaulting to the obvious shape — the framework everyone uses, the pattern that ships fastest, the abstraction nobody questions.

## Analogy
A chef who only cooks recipes from one cookbook makes competent food. A chef who borrows from four cuisines — and knows why each technique exists — makes memorable food.

## Concrete example
Before reaching for Redux, ask whether the state needs to be global. Before adding a microservice, ask whether the boundary is real or imagined. Before standing up Kafka, ask whether you have more than 10 events per second.

## Operational definition
- Name the default solution first — out loud or in writing.
- List two alternatives, each with one tradeoff and one cost.
- Choose deliberately and write down the reason. Re-read it during code review.
- If a senior reviewer cannot tell why you chose this path, the reasoning is not visible enough.

## Anti-patterns
- Reaching for the most popular framework without naming the second-best option.
- Copying patterns from a previous project that solved a different problem.
- Optimizing for a future that hasn't been requested.
- Treating boilerplate as architecture.

## Practitioner checklist
- [ ] I can name the default approach for this problem.
- [ ] I evaluated at least one non-default alternative.
- [ ] The reason for my choice is written somewhere a reviewer will read it.
- [ ] I removed at least one inherited assumption from the inherited template.
- [ ] If asked 'why this stack', I have an answer that isn't 'because we always have'.

## Related
- vision/simplify-ruthlessly
- vision/plan-like-da-vinci

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_