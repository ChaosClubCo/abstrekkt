# Vision · V·06 Craft Over Speed
> Slowing down at the right moments is the fastest way through.

## TL;DR
Speed is the byproduct of doing the right things in the right order. Optimize for the right things and speed appears; optimize for speed and the right things vanish.

## Analogy
A surgeon does not move quickly during the cut. They move quickly between cuts. Pace varies by phase.

## Concrete example
Spend more time on the data model and less time on the UI. Spend more time on the integration test and less time on the unit test for trivial code. Spend more time on naming and less time on documentation that names would have made redundant.

## Operational definition
- Identify the load-bearing decision in the work. Spend disproportionate care there.
- For everything else, default to working-and-shippable.
- Refuse to be fast where speed produces fragile output: schemas, auth, payment, persistence, public APIs.
- Measure throughput in shipped value, not in commits per day.

## Anti-patterns
- Treating velocity charts as a goal instead of a signal.
- Rushing the schema 'because we'll migrate it later'.
- Skipping code review on the 'small change' that broke production.
- Confusing motion with progress.

## Practitioner checklist
- [ ] I named the load-bearing decision in this work.
- [ ] I spent disproportionate time on it relative to the trivial parts.
- [ ] I did not rush schemas, auth, persistence, or public APIs.
- [ ] My pace varies by phase — slow during decisions, fast during execution.
- [ ] What I shipped today actually changed something for a user, internal or external.

## Related
- vision/plan-like-da-vinci
- grammar/tier-2-decisions

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_