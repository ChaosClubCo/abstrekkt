# Week 10 — Build a Real App 🏃

**Phase:** Run · **Survey gap:** Q10 — 66% have NEVER built an app; only 7% shipped one
**Goal:** Build a complete, working application end-to-end, AI-assisted but human-owned.

## TL;DR
This is the week the 66% becomes 0%. You build a real app — front to back — using everything: terminal, Git, reading code, Docker, AI pairing, debugging, and agentic workflow. AI helps you go fast; you own every decision and can explain every part.

## Analogy
You've practiced knife skills, read recipes, run the line. This week you **cook a full meal and put it on a plate**. Not a drill — a dish you'd actually serve.

## Why "a real app" and not another exercise
The survey's starkest number: 66% have never built an application, 7% have shipped one. Building something whole — with a UI, some logic, and data that persists — is a different skill than doing isolated drills. It's where "I know commands" becomes "I can make software." Employers (and the Army) buy the second thing.

## The app you'll build: a Task Tracker
Small enough to finish, real enough to matter. Requirements:
- Add a task, list tasks, mark a task done, delete a task.
- Tasks persist (survive a refresh / restart).
- Runs locally, and (next week) deploys.

You can build it as a simple web app (HTML + JS + a small Node/Express backend) or a CLI app — your choice. The requirements are fixed; the approach is yours.

## The build method (you already know all of it)
1. **Spec it** (Week 9). Write `spec.md` with features and done-criteria BEFORE coding.
2. **Architect it** (new, lightly). Sketch the pieces: what's the UI, what stores the data, how do they talk? One diagram in `architecture.md`.
3. **Build in slices.** One feature at a time: add-task working end to end, commit, then list, then done, then delete. Never build everything then debug everything.
4. **Pair with AI per slice** (Week 7). Prompt for one slice, read it, run it, fix it, commit it.
5. **Debug with method** (Week 8) when a slice breaks.
6. **Commit constantly** (Week 3). Every working slice is a commit.

## The one rule that separates you from a vibe coder
**You must be able to explain every file.** If AI wrote a piece you can't explain, you stop and read it until you can (Week 5), or you rewrite it. An app you can't explain is an app you can't fix in the field.

## Architecture-first, briefly
Before features, answer in `architecture.md`: Where does data live? What happens when two things need the same data? What breaks if the app restarts? Thinking about failure modes before coding is what senior devs do — and you're allowed to think like one now.

## Technical definition
An **application** is a complete program delivering user-facing functionality, typically combining a user interface, business logic, and persistent state, runnable as a unit.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
