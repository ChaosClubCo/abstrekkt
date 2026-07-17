# Reference · R·02 Before Every Task
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