# ULTRATHINK · Grammar
> Four tiers of structured thinking, from contract to keystrokes.

Tab code: `G` · Sections: 4

## G·01 Tier 0 — Contract
> Before pseudocode, before architecture, before names: what does done look like?

**TL;DR.** The contract is the agreement between the work and the world. What inputs does it accept? What outputs does it guarantee? Under what conditions does it fail?

**Operational:**
- Write the contract before the code. One paragraph or one type signature is enough.
- Name observable behavior, not implementation. 'Returns user by ID' not 'queries the user table'.
- Enumerate failure modes: not-found, unauthorized, rate-limited, malformed.
- If you can't write the contract, you don't understand the work yet.

**Practitioner checklist:**
- [ ] Inputs: typed and named.
- [ ] Outputs: typed, named, and distinguishing success from failure.
- [ ] Failure modes: enumerated with the conditions that produce each.
- [ ] Side effects: listed if any (logs, writes, network calls).
- [ ] Auth and rate context: explicit if relevant.

---

## G·02 Tier 1 — Grammar
> Naming, signatures, and shape come before logic.

**TL;DR.** Grammar is the vocabulary the system uses to describe itself. Get it right and the code documents itself; get it wrong and no amount of comments will save it.

**Operational:**
- Verbs first: `parse`, `validate`, `dispatch`, `persist`.
- Booleans state truth: `isExpired`, `hasAccess`, `wasRetried`.
- Errors carry context: `OrderNotFoundError`, not `Error`.
- Types narrow scope: prefer `OrderId` over `string`, `Email` over `string`.
- Collections are plural; singletons are not.

**Practitioner checklist:**
- [ ] Every name reads as a sentence at the call site.
- [ ] Booleans are predicates (`is`, `has`, `was`, `should`).
- [ ] No type is `string` or `any` if a narrower type would carry the meaning.
- [ ] Errors carry context in their type name.
- [ ] Module names describe domain, not layer ('Billing', not 'Services').

---

## G·03 Tier 2 — Decisions
> Architecture is a sequence of recorded choices. Record them.

**TL;DR.** When multiple valid approaches exist, name them, list tradeoffs, pick one, justify it. The decision record is more durable than the diagram.

**Operational:**
- When choices exist, present A / B / C with tradeoffs, then pick one.
- Justify in terms of priority order: maintainability → correctness → security → observability → scalability → performance → cleverness.
- Record the decision, not just the conclusion.
- Old decisions don't get deleted. They get superseded with a forward link.

**Practitioner checklist:**
- [ ] Decision is named in one sentence.
- [ ] At least two alternatives were named and rejected.
- [ ] Tradeoffs are listed along the priority axes.
- [ ] Decision has an owner and a date.
- [ ] Decision is filed where future readers will find it (repo, wiki, notebook).

---

## G·04 Tier 3 — Implementation
> Now you write the code. The hard work was done in tiers 0–2.

**TL;DR.** Implementation is mechanical when the contract, grammar, and decisions are settled. Most pain in implementation is unfinished work from earlier tiers leaking down.

**Operational:**
- Write the test from the contract before the implementation.
- Write the implementation in small commits, one concern per commit.
- Run the smoke test continuously — not just once at the end.
- Open the PR with a description that links back to the decision and the contract.

**Practitioner checklist:**
- [ ] Tests exist before or alongside the implementation.
- [ ] Each commit is single-concern.
- [ ] Smoke test runs end-to-end with realistic data.
- [ ] PR description names the contract, the decision, and the change.
- [ ] If the contract changed, the contract document was updated in the same PR.

---

_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_