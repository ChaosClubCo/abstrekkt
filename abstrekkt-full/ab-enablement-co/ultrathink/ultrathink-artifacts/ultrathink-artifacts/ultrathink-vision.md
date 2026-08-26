# ULTRATHINK · Vision
> Six core principles. Craft over speed. Elegance over pragmatism.

Tab code: `V` · Sections: 6

## V·01 Think Different
> Default solutions produce default outcomes. Pick a stance before you pick a stack.

**TL;DR.** Resist the first plausible answer. Most engineering work fails not from inability but from defaulting to the obvious shape — the framework everyone uses, the pattern that ships fastest, the abstraction nobody questions.

**Operational:**
- Name the default solution first — out loud or in writing.
- List two alternatives, each with one tradeoff and one cost.
- Choose deliberately and write down the reason. Re-read it during code review.
- If a senior reviewer cannot tell why you chose this path, the reasoning is not visible enough.

**Practitioner checklist:**
- [ ] I can name the default approach for this problem.
- [ ] I evaluated at least one non-default alternative.
- [ ] The reason for my choice is written somewhere a reviewer will read it.
- [ ] I removed at least one inherited assumption from the inherited template.
- [ ] If asked 'why this stack', I have an answer that isn't 'because we always have'.

---

## V·02 Obsess Over Details
> Read the codebase like a masterpiece. Understand its soul.

**TL;DR.** Details are the system. The variable name, the order of arguments, the way an error is raised — these compound into either a codebase that teaches or a codebase that resists.

**Operational:**
- Read the file before changing it. Read the function it calls. Read the test.
- Treat each name, signature, and error message as a load-bearing decision.
- Match the surrounding code's idiom unless you are deliberately replacing it.
- When you spot a ten-second improvement, make it. Compounding starts with the first commit.

**Practitioner checklist:**
- [ ] Every variable I introduced has a name a stranger could decode.
- [ ] Every function returns a result type that distinguishes success from failure.
- [ ] Every error message includes context — what was attempted, what failed, what to try next.
- [ ] I read the surrounding 50 lines before editing.
- [ ] I matched indentation, quote style, and import order to the existing file.

---

## V·03 Plan Like Da Vinci
> Every function should sing. Every abstraction feel natural.

**TL;DR.** Plan in words and sketches before you plan in code. The cost of a bad plan in pseudocode is minutes. The cost of a bad plan in production is weeks.

**Operational:**
- Write the user-facing API or UI first. If it's awkward to describe, it's awkward to use.
- Diagram the data flow. Name every boundary. List every failure mode.
- Pseudocode the hard parts. If you can't pseudocode it, you can't code it.
- Tests describe the contract. Write them before the implementation when the contract matters.

**Practitioner checklist:**
- [ ] I have a one-paragraph spec a non-engineer could read.
- [ ] I have a diagram or sketch of system boundaries.
- [ ] I have pseudocode for the two hardest functions.
- [ ] I have written tests — or at least a test list — before coding.
- [ ] I have named at least three failure modes and what happens in each.

---

## V·04 Iterate Relentlessly
> First version exists to be replaced. Plan for the second.

**TL;DR.** Shipping is not the end of the work. The first commit is the worst version of the code that will ever exist; treat it that way.

**Operational:**
- Get to working before you get to elegant. Ugly code that runs is ahead of beautiful code that doesn't.
- Commit at the smallest unit that compiles and passes tests.
- Schedule a re-read 24 hours later. Most of your improvements will come from that re-read.
- Refactor in single-concern PRs. Mixed PRs hide regressions.

**Practitioner checklist:**
- [ ] I shipped a working version within the first day.
- [ ] Each commit changes one concern at a time.
- [ ] I scheduled and performed a 24-hour re-read.
- [ ] Each refactor PR has a one-sentence description that names what improved.
- [ ] I deleted code that was wrong instead of leaving it 'for later'.

---

## V·05 Simplify Ruthlessly
> Remove complexity without losing power. Elegance is earned.

**TL;DR.** Simple is harder than complicated. Complicated takes the first idea and adds. Simple takes ten ideas and subtracts.

**Operational:**
- After it works, ask: what can I delete and still pass the tests?
- Replace flags with named types. Replace nested conditionals with early returns or polymorphism.
- Inline functions called once. Extract logic only when it has a name.
- Question every interface. If only one implementation exists and one is likely, the interface is theater.

**Practitioner checklist:**
- [ ] I deleted at least one block that wasn't pulling weight.
- [ ] Every function name describes what it returns or does, not what category it belongs to.
- [ ] No interface exists that has only one implementation and no realistic second.
- [ ] The shortest path through the code is the happy path.
- [ ] A new contributor could read the entry point and trace one full request without jumping more than three files.

---

## V·06 Craft Over Speed
> Slowing down at the right moments is the fastest way through.

**TL;DR.** Speed is the byproduct of doing the right things in the right order. Optimize for the right things and speed appears; optimize for speed and the right things vanish.

**Operational:**
- Identify the load-bearing decision in the work. Spend disproportionate care there.
- For everything else, default to working-and-shippable.
- Refuse to be fast where speed produces fragile output: schemas, auth, payment, persistence, public APIs.
- Measure throughput in shipped value, not in commits per day.

**Practitioner checklist:**
- [ ] I named the load-bearing decision in this work.
- [ ] I spent disproportionate time on it relative to the trivial parts.
- [ ] I did not rush schemas, auth, persistence, or public APIs.
- [ ] My pace varies by phase — slow during decisions, fast during execution.
- [ ] What I shipped today actually changed something for a user, internal or external.

---

_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_