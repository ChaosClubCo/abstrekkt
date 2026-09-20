# Vision · V·03 Plan Like Da Vinci
> Every function should sing. Every abstraction feel natural.

## TL;DR
Plan in words and sketches before you plan in code. The cost of a bad plan in pseudocode is minutes. The cost of a bad plan in production is weeks.

## Analogy
Da Vinci sketched flying machines for thirty years before any of them flew. He built understanding before he built artifacts.

## Concrete example
Spec → architecture diagram → pseudocode → tests → implementation. Skipping the first three is what produces 'we'll refactor later' codebases.

## Operational definition
- Write the user-facing API or UI first. If it's awkward to describe, it's awkward to use.
- Diagram the data flow. Name every boundary. List every failure mode.
- Pseudocode the hard parts. If you can't pseudocode it, you can't code it.
- Tests describe the contract. Write them before the implementation when the contract matters.

## Anti-patterns
- Diving into implementation before the data model is stable.
- Architecture diagrams generated after the system already exists.
- Speccing only the happy path.
- Treating 'we'll figure it out as we go' as a methodology.

## Practitioner checklist
- [ ] I have a one-paragraph spec a non-engineer could read.
- [ ] I have a diagram or sketch of system boundaries.
- [ ] I have pseudocode for the two hardest functions.
- [ ] I have written tests — or at least a test list — before coding.
- [ ] I have named at least three failure modes and what happens in each.

## Related
- grammar/tier-2-decisions
- contract/response-guarantees

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_