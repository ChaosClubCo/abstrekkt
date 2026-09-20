# Grammar · G·03 Tier 2 — Decisions
> Architecture is a sequence of recorded choices. Record them.

## TL;DR
When multiple valid approaches exist, name them, list tradeoffs, pick one, justify it. The decision record is more durable than the diagram.

## Analogy
A judge's opinion isn't valuable for the verdict. It's valuable for the reasoning future judges can cite or distinguish.

## Concrete example
ADRs (Architecture Decision Records). Three approaches considered. Tradeoffs along axes that matter — maintainability, performance, security, cost. Decision named, owner named, date named.

## Operational definition
- When choices exist, present A / B / C with tradeoffs, then pick one.
- Justify in terms of priority order: maintainability → correctness → security → observability → scalability → performance → cleverness.
- Record the decision, not just the conclusion.
- Old decisions don't get deleted. They get superseded with a forward link.

## Anti-patterns
- Architecture diagrams without the why.
- Decisions made in chat that nobody can find six months later.
- Choosing the new option because it's new.
- Choosing the old option because it's familiar.

## Practitioner checklist
- [ ] Decision is named in one sentence.
- [ ] At least two alternatives were named and rejected.
- [ ] Tradeoffs are listed along the priority axes.
- [ ] Decision has an owner and a date.
- [ ] Decision is filed where future readers will find it (repo, wiki, notebook).

## Related
- vision/think-different
- vision/plan-like-da-vinci

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_