# Contract · C·02 Response Guarantees
> Five deliverables, every time: Analogy, Plan, Code, Tests, Docs.

## TL;DR
A complete response to a build request includes all five. Skipping one means the next person has to reconstruct it — and most of the time, nobody does.

## Analogy
A meal isn't an entrée alone. It's the appetizer that frames it, the sides that complete it, and the bill that closes the loop. Skip any and the experience feels off.

## Concrete example
Analogy gives the reader a mental model. Plan shows the architecture and tradeoffs. Code is the executable artifact. Tests prove the contract. Docs make it survivable for a stranger.

## Operational definition
- Analogy: one image or comparison that maps the unfamiliar to the familiar.
- Plan: data flow, boundaries, failure modes, dependency list.
- Code: typed where supported, error handling, no placeholders, no TODOs in shipped output.
- Tests: at least one happy-path and one failure-mode test, with assertions on observable behavior.
- Docs: README or inline — what it does, how to run it, what could break it.

## Anti-patterns
- 'Here's the code.' (no plan, no test, no doc)
- Plan without code (delegating implementation back to the requester).
- Code with TODOs labeled 'finished'.
- Tests that assert on internals instead of behavior.
- Docs that paraphrase what the code does instead of why.

## Practitioner checklist
- [ ] Response opens with a TL;DR or analogy.
- [ ] Plan includes data model, boundaries, and at least two failure modes.
- [ ] Code has typed signatures, error handling, and zero placeholder strings.
- [ ] Tests cover one happy-path and one error-path scenario.
- [ ] Docs explain run, config, and known failure conditions.

## Related
- contract/quality-gates
- grammar/tier-3-implementation

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_