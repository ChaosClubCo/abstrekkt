# Grammar · G·01 Tier 0 — Contract
> Before pseudocode, before architecture, before names: what does done look like?

## TL;DR
The contract is the agreement between the work and the world. What inputs does it accept? What outputs does it guarantee? Under what conditions does it fail?

## Analogy
A construction contract names the building, the deadline, and the penalties. The blueprint comes after. The contract is what gets enforced.

## Concrete example
For an API endpoint: request schema, response schema, status codes, rate limits, auth requirements. For a function: parameter types, return type, thrown errors, side effects.

## Operational definition
- Write the contract before the code. One paragraph or one type signature is enough.
- Name observable behavior, not implementation. 'Returns user by ID' not 'queries the user table'.
- Enumerate failure modes: not-found, unauthorized, rate-limited, malformed.
- If you can't write the contract, you don't understand the work yet.

## Anti-patterns
- Starting with implementation and inferring the contract afterward.
- Contracts that describe internal structure instead of external behavior.
- Skipping failure modes because the happy path 'always works'.
- Contracts written as marketing copy.

## Practitioner checklist
- [ ] Inputs: typed and named.
- [ ] Outputs: typed, named, and distinguishing success from failure.
- [ ] Failure modes: enumerated with the conditions that produce each.
- [ ] Side effects: listed if any (logs, writes, network calls).
- [ ] Auth and rate context: explicit if relevant.

## Related
- grammar/tier-1-grammar
- contract/response-guarantees

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_