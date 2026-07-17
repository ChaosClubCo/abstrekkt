# Grammar · G·02 Tier 1 — Grammar
> Naming, signatures, and shape come before logic.

## TL;DR
Grammar is the vocabulary the system uses to describe itself. Get it right and the code documents itself; get it wrong and no amount of comments will save it.

## Analogy
In a novel, the difference between 'sprinted' and 'jogged' is a paragraph of context. Same in code: `getUser` and `fetchUserOrThrow` carry different contracts in their names alone.

## Concrete example
Verbs for actions. Nouns for entities. Booleans named to read like statements (`isActive`, not `active` or `flag`). Result types for operations that fail. Plural names for collections.

## Operational definition
- Verbs first: `parse`, `validate`, `dispatch`, `persist`.
- Booleans state truth: `isExpired`, `hasAccess`, `wasRetried`.
- Errors carry context: `OrderNotFoundError`, not `Error`.
- Types narrow scope: prefer `OrderId` over `string`, `Email` over `string`.
- Collections are plural; singletons are not.

## Anti-patterns
- `data`, `info`, `result`, `temp`, `obj` as names that survive past the first draft.
- Boolean parameters that read backward at the call site (`drawCircle(true, false, true)`).
- Functions named after their category (`UserUtil.process`) instead of their action.
- Mixing tense and voice across a module.

## Practitioner checklist
- [ ] Every name reads as a sentence at the call site.
- [ ] Booleans are predicates (`is`, `has`, `was`, `should`).
- [ ] No type is `string` or `any` if a narrower type would carry the meaning.
- [ ] Errors carry context in their type name.
- [ ] Module names describe domain, not layer ('Billing', not 'Services').

## Related
- vision/obsess-over-details
- grammar/tier-2-decisions

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_