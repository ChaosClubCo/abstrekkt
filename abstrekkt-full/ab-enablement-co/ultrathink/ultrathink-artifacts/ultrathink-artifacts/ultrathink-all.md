# ULTRATHINK
> Security-first. Craft-first. Reality-first.

Version 1.0.0 · 2026-05-09

## Table of contents
- **Vision** — Six core principles. Craft over speed. Elegance over pragmatism.
  - V·01 Think Different
  - V·02 Obsess Over Details
  - V·03 Plan Like Da Vinci
  - V·04 Iterate Relentlessly
  - V·05 Simplify Ruthlessly
  - V·06 Craft Over Speed
- **Contract** — What every response must guarantee. The contract is the floor, not the ceiling.
  - C·01 Security Floor
  - C·02 Response Guarantees
  - C·03 Quality Gates
  - C·04 Gaps & Blindspots
- **Grammar** — Four tiers of structured thinking, from contract to keystrokes.
  - G·01 Tier 0 — Contract
  - G·02 Tier 1 — Grammar
  - G·03 Tier 2 — Decisions
  - G·04 Tier 3 — Implementation
- **Reference** — Pocket frameworks, security checkpoints, and analogies for the work in front of you.
  - R·01 Quick Analogies
  - R·02 Before Every Task
  - R·03 R-I-S-E Framework
  - R·04 F-L-O-W Framework
  - R·05 OWASP Checkpoint
  - R·06 Input / Output Validation

---

# Vision
> Six core principles. Craft over speed. Elegance over pragmatism.

## Vision · V·01 Think Different
> Default solutions produce default outcomes. Pick a stance before you pick a stack.

## TL;DR
Resist the first plausible answer. Most engineering work fails not from inability but from defaulting to the obvious shape — the framework everyone uses, the pattern that ships fastest, the abstraction nobody questions.

## Analogy
A chef who only cooks recipes from one cookbook makes competent food. A chef who borrows from four cuisines — and knows why each technique exists — makes memorable food.

## Concrete example
Before reaching for Redux, ask whether the state needs to be global. Before adding a microservice, ask whether the boundary is real or imagined. Before standing up Kafka, ask whether you have more than 10 events per second.

## Operational definition
- Name the default solution first — out loud or in writing.
- List two alternatives, each with one tradeoff and one cost.
- Choose deliberately and write down the reason. Re-read it during code review.
- If a senior reviewer cannot tell why you chose this path, the reasoning is not visible enough.

## Anti-patterns
- Reaching for the most popular framework without naming the second-best option.
- Copying patterns from a previous project that solved a different problem.
- Optimizing for a future that hasn't been requested.
- Treating boilerplate as architecture.

## Practitioner checklist
- [ ] I can name the default approach for this problem.
- [ ] I evaluated at least one non-default alternative.
- [ ] The reason for my choice is written somewhere a reviewer will read it.
- [ ] I removed at least one inherited assumption from the inherited template.
- [ ] If asked 'why this stack', I have an answer that isn't 'because we always have'.

## Related
- vision/simplify-ruthlessly
- vision/plan-like-da-vinci

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Vision · V·02 Obsess Over Details
> Read the codebase like a masterpiece. Understand its soul.

## TL;DR
Details are the system. The variable name, the order of arguments, the way an error is raised — these compound into either a codebase that teaches or a codebase that resists.

## Analogy
A locksmith doesn't just open the door. They listen to the pins. The same lock failure has six different causes; only one matches the sound.

## Concrete example
Renaming `data` to `parsedInvoiceLines` saves ten minutes for the next reader. Choosing `Result<T, E>` over `T | null` saves a class of bugs. Sorting imports alphabetically saves merge conflicts. None of these are aesthetic.

## Operational definition
- Read the file before changing it. Read the function it calls. Read the test.
- Treat each name, signature, and error message as a load-bearing decision.
- Match the surrounding code's idiom unless you are deliberately replacing it.
- When you spot a ten-second improvement, make it. Compounding starts with the first commit.

## Anti-patterns
- `temp`, `data2`, `helper2` — names that signal the author stopped thinking.
- Try/catch swallowing the error and returning null.
- Mixing camelCase and snake_case in the same module.
- Comments that describe what the code does instead of why.

## Practitioner checklist
- [ ] Every variable I introduced has a name a stranger could decode.
- [ ] Every function returns a result type that distinguishes success from failure.
- [ ] Every error message includes context — what was attempted, what failed, what to try next.
- [ ] I read the surrounding 50 lines before editing.
- [ ] I matched indentation, quote style, and import order to the existing file.

## Related
- vision/simplify-ruthlessly
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Vision · V·03 Plan Like Da Vinci
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

## Vision · V·04 Iterate Relentlessly
> First version exists to be replaced. Plan for the second.

## TL;DR
Shipping is not the end of the work. The first commit is the worst version of the code that will ever exist; treat it that way.

## Analogy
Sculptors do not chisel marble in one pass. They rough out the form, step back, study the light, and remove material until the figure emerges.

## Concrete example
Write it ugly. Make it work. Read it tomorrow. Refactor in small commits. Each pass should improve one thing — naming, structure, error handling, performance — not all four at once.

## Operational definition
- Get to working before you get to elegant. Ugly code that runs is ahead of beautiful code that doesn't.
- Commit at the smallest unit that compiles and passes tests.
- Schedule a re-read 24 hours later. Most of your improvements will come from that re-read.
- Refactor in single-concern PRs. Mixed PRs hide regressions.

## Anti-patterns
- Holding code locally for a week trying to make it 'right'.
- Refactoring three things in one commit so reviewers can't tell what changed.
- Treating the first design as the final design.
- Skipping the re-read step because 'it works'.

## Practitioner checklist
- [ ] I shipped a working version within the first day.
- [ ] Each commit changes one concern at a time.
- [ ] I scheduled and performed a 24-hour re-read.
- [ ] Each refactor PR has a one-sentence description that names what improved.
- [ ] I deleted code that was wrong instead of leaving it 'for later'.

## Related
- vision/simplify-ruthlessly
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Vision · V·05 Simplify Ruthlessly
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

## Vision · V·06 Craft Over Speed
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


# Contract
> What every response must guarantee. The contract is the floor, not the ceiling.

## Contract · C·01 Security Floor
> Security is not a feature. It's the floor everything else is built on.

## TL;DR
Two non-negotiables: no hallucinations passed off as facts, and no secrets in code that ships to a client.

## Analogy
A bridge can be elegant, fast to cross, and beautiful — but if it falls down, none of that mattered. Security is whether the bridge stays up.

## Concrete example
API keys live in environment variables. Database URLs live in environment variables. Service-role keys never appear in frontend bundles. Unverified claims are labeled as estimates, not asserted as facts.

## Operational definition
- Secrets in env vars. No exceptions, no 'just for development', no fallback constants.
- Frontend code uses publishable / anon keys only. Privileged operations route through a server.
- Every assertion is either sourced (with citation) or labeled as a generated estimate.
- If you don't know, say so. 'I cannot verify this' beats a confident wrong answer.

## Anti-patterns
- Hardcoded API keys in source files committed to a repo.
- Service-role / admin keys imported into client code.
- .env files committed alongside .env.example.
- Confident assertion of unverified facts because uncertainty 'feels weak'.

## Practitioner checklist
- [ ] Grep the codebase for the strings sk_, service_role, BEGIN, AKIA — all returned zero results in client code.
- [ ] Every secret is loaded from process.env / equivalent at runtime.
- [ ] .env is in .gitignore; .env.example contains only placeholder values.
- [ ] Every numeric claim in shipped output is labeled SOURCED or GENERATED.
- [ ] Every uncertainty is named, not papered over.

## Related
- reference/owasp-checkpoint
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Contract · C·02 Response Guarantees
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

## Contract · C·03 Quality Gates
> If it didn't run, it isn't done. If it didn't pass review, it isn't shipped.

## TL;DR
Five gates between draft and merged: it compiles, it runs, it passes tests, it passes review, it's been re-read by the author.

## Analogy
Customs is not theater. Each checkpoint catches a different category of problem. Skip one and you don't speed up — you just push the failure downstream.

## Concrete example
Compile catches syntax. Runtime catches integration. Tests catch contract drift. Review catches design and naming. Author re-read catches the obvious thing the author missed in flow.

## Operational definition
- Gate 1: compiles / type-checks. No warnings suppressed silently.
- Gate 2: runs locally with realistic data. Synthetic data masks bugs.
- Gate 3: tests pass — the relevant ones, not just whatever was already there.
- Gate 4: peer or adversarial review. The reviewer should ask 'what could go wrong here'.
- Gate 5: 24-hour author re-read. Eyes that have been away find the obvious flaws.

## Anti-patterns
- `@ts-ignore` / `// eslint-disable` instead of fixing the underlying issue.
- Tests that assert on the implementation, not the behavior.
- 'LGTM' reviews on PRs the reviewer didn't read.
- Same-day merges of work the author has been heads-down on for hours.

## Practitioner checklist
- [ ] Build passes with zero suppressed warnings.
- [ ] Code ran locally against realistic data, not just synthetic fixtures.
- [ ] Tests pass and at least one new test was added or modified.
- [ ] A reviewer left at least one substantive comment.
- [ ] I re-read the diff at least 12 hours after writing it.

## Related
- contract/response-guarantees
- vision/iterate-relentlessly

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Contract · C·04 Gaps & Blindspots
> What you didn't consider is what will break you.

## TL;DR
Every deliverable closes with what wasn't covered: known gaps, things outside scope, things outside visibility. The footer is the most honest part of the document.

## Analogy
A pilot's pre-flight checklist ends with 'anything unusual' — not because everything has been listed, but because the discipline of looking for the unlisted is the safety mechanism.

## Concrete example
GAPS = known unknowns the author hasn't filled in. BLINDSPOTS = things outside the author's expertise or context that should be reviewed by someone else. UNKNOWN-UNKNOWNS = the category itself; you can't enumerate them but naming the category prompts a final scan.

## Operational definition
- Close every substantive deliverable with a footer: GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS.
- GAPS: list what was scoped out and why. Make scope visible.
- BLINDSPOTS: name domains you didn't have authority over — security review needed, ops review needed, legal review needed.
- UNKNOWN-UNKNOWNS: stay humble. State the category and what would prompt a re-review.

## Anti-patterns
- 'Done' deliverables with no acknowledgment of scope edges.
- Hiding incomplete work behind confident framing.
- Treating the footer as ceremonial — copy-pasting the same gaps every time.
- Confusing 'I didn't think of it' with 'it's not relevant'.

## Practitioner checklist
- [ ] GAPS section names at least one thing scoped out and why.
- [ ] BLINDSPOTS section names at least one expert review still owed.
- [ ] UNKNOWN-UNKNOWNS section names a re-review trigger.
- [ ] Footer is specific to this deliverable, not boilerplate.
- [ ] If a reviewer asks 'what could go wrong', the footer already answers.

## Related
- contract/response-guarantees
- reference/before-every-task

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_


# Grammar
> Four tiers of structured thinking, from contract to keystrokes.

## Grammar · G·01 Tier 0 — Contract
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

## Grammar · G·02 Tier 1 — Grammar
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

## Grammar · G·03 Tier 2 — Decisions
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

## Grammar · G·04 Tier 3 — Implementation
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


# Reference
> Pocket frameworks, security checkpoints, and analogies for the work in front of you.

## Reference · R·01 Quick Analogies
> Borrow vocabulary from older disciplines. They've been at it longer.

## TL;DR
Software borrows from finance, medicine, civil engineering, and athletics because those fields figured out reliability before we did. Use the borrowed words on purpose.

## Analogy
Engineers calling code 'tech debt' is a finance analogy that worked. SLOs as 'error budgets' is another. Borrow more.

## Concrete example
SLOs are budgets. Errors are spend. Rest days are recovery. Security layers are defense in depth. LLM safety is a load-bearing assumption you have to test, not believe.

## Operational definition
- SLOs / error budgets — treat reliability as a budget you spend, not an absolute.
- Rest days — recovery is part of the cycle, not the absence of work.
- Defense in depth — never one layer; always at least two.
- Capacity planning — same as personal energy. You don't max out; you leave headroom.
- Pre-mortem — assume the project failed; explain why.

## Anti-patterns
- Importing a metaphor without importing its discipline (calling something 'agile' without a feedback loop).
- Treating analogies as decoration instead of infrastructure.
- Stretching one metaphor past its useful range.

## Practitioner checklist
- [ ] I'm using the borrowed term in the way the source field uses it, not as marketing.
- [ ] When the metaphor stops fitting, I drop it instead of forcing it.
- [ ] I have at least two analogies for the same concept — one technical, one accessible.
- [ ] If a stakeholder doesn't get the technical version, I have the accessible version ready.

## Related
- reference/before-every-task
- contract/security-floor

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Reference · R·02 Before Every Task
> Five questions, then start.

## TL;DR
A short pre-flight checklist run before any non-trivial work. Catches the obvious before it becomes expensive.

## Analogy
Pilots run a pre-flight every time. Not because they don't trust the plane — because they don't trust the absence of attention.

## Concrete example
What problem? For whom? Done means what? What could break this? Who reviews it?

## Operational definition
- Problem: stated in one sentence, in the user's words.
- Audience: who feels the impact when this ships or when it breaks.
- Done: observable, testable, time-bounded.
- Risk: top three failure modes named.
- Reviewer: a name, not a role.

## Anti-patterns
- Starting work with no written problem statement.
- 'Done' meaning 'the code is written'.
- Risk lists that read like generic security templates.
- Reviews where the reviewer is 'the team'.

## Practitioner checklist
- [ ] Problem statement fits in one sentence.
- [ ] Audience is named — a person, role, or system.
- [ ] Done is observable and has a verification step.
- [ ] Top three risks are named with the conditions that trigger them.
- [ ] Reviewer is a person who will actually read the diff.

## Related
- reference/rise-framework
- reference/flow-framework

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Reference · R·03 R-I-S-E Framework
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

## Reference · R·04 F-L-O-W Framework
> Focus, Layers, Outcomes, Waypoints.

## TL;DR
A four-letter execution scaffold. Use it when work is multi-step and you need to maintain direction across hours or days.

## Analogy
A long-distance hike. You name the destination, plan the layers (clothing, food, water), commit to outcomes by daylight, and set waypoints to course-correct.

## Concrete example
FOCUS: the one thing that matters most this session. LAYERS: dependencies and prerequisites. OUTCOMES: what 'done' looks like for this session. WAYPOINTS: checkpoints to verify you're still on the path.

## Operational definition
- Focus: name it before you start. Defaults to whatever's loudest otherwise.
- Layers: prerequisites, supporting work, fallback plans.
- Outcomes: phrased as observable artifacts, not activities.
- Waypoints: small, frequent. Every 30–60 minutes if the work is dense.

## Anti-patterns
- Focus that's actually three things in a trench coat.
- Layers skipped because 'I'll figure them out as I go'.
- Outcomes phrased as 'work on X' instead of 'X exists and does Y'.
- Waypoints set so far apart that drift compounds.

## Practitioner checklist
- [ ] Focus is one sentence and one thing.
- [ ] Layers list names dependencies and at least one fallback.
- [ ] Outcomes are artifacts (file exists, test passes, deploy succeeds), not verbs.
- [ ] Waypoints are scheduled and frequent.
- [ ] When a waypoint is missed, I adjust the plan rather than push through.

## Related
- reference/rise-framework
- reference/before-every-task

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Reference · R·05 OWASP Checkpoint
> Three categories that catch most of what kills systems: misconfiguration, injection, cryptography.

## TL;DR
A scoped checkpoint pulled from the OWASP Top 10. Not exhaustive — just the three categories that catch the largest share of preventable security failures in everyday work.

## Analogy
A doctor doesn't run every test on every patient. They run the three that catch the most common preventable conditions, then escalate based on what they find.

## Concrete example
A02 Misconfiguration: defaults left on, ports open, headers missing. A03 Injection: user input concatenated into queries, commands, or rendered markup. A05 Cryptography: weak algorithms, missing TLS, secrets in plaintext.

## Operational definition
- A02 — Misconfiguration: review framework defaults; remove unused features; harden HTTP headers; rotate default credentials.
- A03 — Injection: parameterized queries; output escaping appropriate to the context (HTML / SQL / shell / LDAP); content security policy.
- A05 — Cryptography: TLS everywhere; strong algorithms (AES-GCM, Argon2); secrets in env, not in code; key rotation plan.
- Run this checkpoint at end-of-feature, not end-of-quarter.

## Anti-patterns
- String concatenation building any kind of query or command.
- MD5 or SHA-1 used for password hashing.
- Self-signed certs in production.
- 'It's internal so we don't need TLS.'

## Practitioner checklist
- [ ] All queries / commands use parameterized APIs, not string concatenation.
- [ ] All output is escaped for its rendering context.
- [ ] All transport is TLS 1.2+ (TLS 1.3 preferred).
- [ ] Passwords use Argon2id or bcrypt with appropriate work factor.
- [ ] Default credentials, demo accounts, and unused endpoints have been removed.
- [ ] HTTP security headers (CSP, HSTS, X-Content-Type-Options) are set.

## Related
- contract/security-floor
- reference/io-validation

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

## Reference · R·06 Input / Output Validation
> Trust nothing crossing a boundary, including what you produced.

## TL;DR
Every input is hostile until validated. Every output is leakage until reviewed. The boundary is the system; everything inside is conditional on the boundary holding.

## Analogy
Customs at a border. Inbound is searched for what's forbidden. Outbound is searched for what's protected. Both are non-optional.

## Concrete example
Inputs: schema validation, length limits, type narrowing, allowlists where possible. Outputs: redact PII, strip stack traces from public errors, scrub debug payloads.

## Operational definition
- Validate at the boundary. The boundary is the controller, the parser, the queue consumer — not 'somewhere deeper'.
- Use a schema library (Zod, Pydantic, JSON Schema). Hand-rolled validators drift.
- Allowlist over blocklist. Every blocklist becomes obsolete.
- Outputs strip secrets, PII, internal paths, stack traces.
- Error messages crossing trust boundaries are sanitized before they leave.

## Anti-patterns
- Trusting the frontend to enforce server constraints.
- Validating in the data layer instead of the boundary.
- Returning raw exceptions to clients.
- Logging sensitive payloads at info level.

## Practitioner checklist
- [ ] Schema validation runs at every public entrypoint.
- [ ] Validation uses a library, not hand-rolled checks.
- [ ] Allowlists are used where possible; blocklists are documented as temporary.
- [ ] Public error messages reveal nothing about internals.
- [ ] Logs are scrubbed of secrets, PII, and full request bodies at non-debug levels.

## Related
- reference/owasp-checkpoint
- contract/security-floor

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_

