# Vision · V·05 Simplify Ruthlessly
> Remove complexity without losing power. Elegance is earned.

## TL;DR
Simple is harder than complicated. Complicated takes the first idea and adds. Simple takes ten ideas and subtracts.

## Analogy
A bonsai tree is small not because it grew small but because the master spent decades pruning what didn't belong.

## Concrete example
Three abstractions explaining one operation can usually become one. A flag with three values can usually become a typed enum with named cases. A 200-line function with 40 lines of branching is two functions pretending to be one.

## Operational definition
- After it works, ask: what can I delete and still pass the tests?
- Replace flags with named types. Replace nested conditionals with early returns or polymorphism.
- Inline functions called once. Extract logic only when it has a name.
- Question every interface. If only one implementation exists and one is likely, the interface is theater.

## Anti-patterns
- Premature abstraction — building a generic solution to a problem you have once.
- Configuration that nobody configures.
- Layers added because 'we might need to swap this someday'.
- Names like `Manager`, `Helper`, `Util` that describe nothing.

## Practitioner checklist
- [ ] I deleted at least one block that wasn't pulling weight.
- [ ] Every function name describes what it returns or does, not what category it belongs to.
- [ ] No interface exists that has only one implementation and no realistic second.
- [ ] The shortest path through the code is the happy path.
- [ ] A new contributor could read the entry point and trace one full request without jumping more than three files.

## Related
- vision/obsess-over-details
- vision/iterate-relentlessly

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_