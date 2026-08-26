# Grammar · G·04 Tier 3 — Implementation
> Now you write the code. The hard work was done in tiers 0–2.

## TL;DR
Implementation is mechanical when the contract, grammar, and decisions are settled. Most pain in implementation is unfinished work from earlier tiers leaking down.

## Analogy
Pouring concrete is fast. The slow work was the survey, the rebar, and the form. Pour without those and you have a slab that doesn't stand.

## Concrete example
Code that matches the contract. Names that match the grammar. Patterns that match the decisions. Smoke test that proves the path. PR that documents what changed and why.

## Operational definition
- Write the test from the contract before the implementation.
- Write the implementation in small commits, one concern per commit.
- Run the smoke test continuously — not just once at the end.
- Open the PR with a description that links back to the decision and the contract.

## Anti-patterns
- Long-lived branches with hundreds of unrelated changes.
- Implementation that drifts from the contract and updates the contract to match.
- Skipping the smoke test because 'unit tests pass'.
- PR descriptions that say 'fixes the thing' with no context.

## Practitioner checklist
- [ ] Tests exist before or alongside the implementation.
- [ ] Each commit is single-concern.
- [ ] Smoke test runs end-to-end with realistic data.
- [ ] PR description names the contract, the decision, and the change.
- [ ] If the contract changed, the contract document was updated in the same PR.

## Related
- contract/quality-gates
- vision/iterate-relentlessly

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_