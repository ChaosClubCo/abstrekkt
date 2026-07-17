# Reference · R·03 R-I-S-E Framework
> Role, Input, Stops, Expectation.

## TL;DR
A four-letter prompt or task scaffold. Use it when the request is fuzzy and the responder has no anchor.

## Analogy
Stage directions for an actor. Without them, performances drift; with them, the same script lands the same way every show.

## Concrete example
ROLE: who is responding (engineer, reviewer, writer). INPUT: what context they have. STOPS: what they refuse to do. EXPECTATION: what the output must contain.

## Operational definition
- Role: declared explicitly. 'Senior security reviewer' produces different output than 'helpful assistant'.
- Input: the relevant context — files, constraints, prior decisions. Skip the rest.
- Stops: what's out of scope, what's forbidden. Negative space matters.
- Expectation: the shape of the output — bullet list, code, decision memo, table.

## Anti-patterns
- Role declarations that are flattery rather than constraint.
- Input that's a wall of context instead of the relevant subset.
- Stops missing — leading to scope drift.
- Expectations vague — 'help me with this' instead of 'produce A, B, C'.

## Practitioner checklist
- [ ] Role is named with enough specificity to constrain output style.
- [ ] Input is filtered to what's relevant, not everything available.
- [ ] At least one explicit stop is listed (what NOT to do).
- [ ] Expected output shape is named — format, length, structure.
- [ ] If responses drift, I revise R-I-S-E rather than the responder.

## Related
- reference/flow-framework
- reference/before-every-task

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_