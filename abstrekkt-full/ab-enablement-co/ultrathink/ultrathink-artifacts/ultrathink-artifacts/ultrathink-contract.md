# ULTRATHINK · Contract
> What every response must guarantee. The contract is the floor, not the ceiling.

Tab code: `C` · Sections: 4

## C·01 Security Floor
> Security is not a feature. It's the floor everything else is built on.

**TL;DR.** Two non-negotiables: no hallucinations passed off as facts, and no secrets in code that ships to a client.

**Operational:**
- Secrets in env vars. No exceptions, no 'just for development', no fallback constants.
- Frontend code uses publishable / anon keys only. Privileged operations route through a server.
- Every assertion is either sourced (with citation) or labeled as a generated estimate.
- If you don't know, say so. 'I cannot verify this' beats a confident wrong answer.

**Practitioner checklist:**
- [ ] Grep the codebase for the strings sk_, service_role, BEGIN, AKIA — all returned zero results in client code.
- [ ] Every secret is loaded from process.env / equivalent at runtime.
- [ ] .env is in .gitignore; .env.example contains only placeholder values.
- [ ] Every numeric claim in shipped output is labeled SOURCED or GENERATED.
- [ ] Every uncertainty is named, not papered over.

---

## C·02 Response Guarantees
> Five deliverables, every time: Analogy, Plan, Code, Tests, Docs.

**TL;DR.** A complete response to a build request includes all five. Skipping one means the next person has to reconstruct it — and most of the time, nobody does.

**Operational:**
- Analogy: one image or comparison that maps the unfamiliar to the familiar.
- Plan: data flow, boundaries, failure modes, dependency list.
- Code: typed where supported, error handling, no placeholders, no TODOs in shipped output.
- Tests: at least one happy-path and one failure-mode test, with assertions on observable behavior.
- Docs: README or inline — what it does, how to run it, what could break it.

**Practitioner checklist:**
- [ ] Response opens with a TL;DR or analogy.
- [ ] Plan includes data model, boundaries, and at least two failure modes.
- [ ] Code has typed signatures, error handling, and zero placeholder strings.
- [ ] Tests cover one happy-path and one error-path scenario.
- [ ] Docs explain run, config, and known failure conditions.

---

## C·03 Quality Gates
> If it didn't run, it isn't done. If it didn't pass review, it isn't shipped.

**TL;DR.** Five gates between draft and merged: it compiles, it runs, it passes tests, it passes review, it's been re-read by the author.

**Operational:**
- Gate 1: compiles / type-checks. No warnings suppressed silently.
- Gate 2: runs locally with realistic data. Synthetic data masks bugs.
- Gate 3: tests pass — the relevant ones, not just whatever was already there.
- Gate 4: peer or adversarial review. The reviewer should ask 'what could go wrong here'.
- Gate 5: 24-hour author re-read. Eyes that have been away find the obvious flaws.

**Practitioner checklist:**
- [ ] Build passes with zero suppressed warnings.
- [ ] Code ran locally against realistic data, not just synthetic fixtures.
- [ ] Tests pass and at least one new test was added or modified.
- [ ] A reviewer left at least one substantive comment.
- [ ] I re-read the diff at least 12 hours after writing it.

---

## C·04 Gaps & Blindspots
> What you didn't consider is what will break you.

**TL;DR.** Every deliverable closes with what wasn't covered: known gaps, things outside scope, things outside visibility. The footer is the most honest part of the document.

**Operational:**
- Close every substantive deliverable with a footer: GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS.
- GAPS: list what was scoped out and why. Make scope visible.
- BLINDSPOTS: name domains you didn't have authority over — security review needed, ops review needed, legal review needed.
- UNKNOWN-UNKNOWNS: stay humble. State the category and what would prompt a re-review.

**Practitioner checklist:**
- [ ] GAPS section names at least one thing scoped out and why.
- [ ] BLINDSPOTS section names at least one expert review still owed.
- [ ] UNKNOWN-UNKNOWNS section names a re-review trigger.
- [ ] Footer is specific to this deliverable, not boilerplate.
- [ ] If a reviewer asks 'what could go wrong', the footer already answers.

---

_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_