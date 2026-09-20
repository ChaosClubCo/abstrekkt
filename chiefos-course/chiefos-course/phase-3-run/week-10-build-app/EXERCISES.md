# Week 10 — Exercises

Build the Task Tracker. Web or CLI — your call. Fixed requirements below.

## Requirements (your acceptance criteria)
- [ ] Add a task
- [ ] List all tasks
- [ ] Mark a task done
- [ ] Delete a task
- [ ] Tasks persist across restart (file or simple DB — no requirement on which)
- [ ] Runs with a single documented command

## Step 1 — Spec (before any code)
`spec.md`: list the 5 features, and for each, a one-line "done means..." acceptance test.

## Step 2 — Architecture (one page)
`architecture.md`: name your pieces (UI? backend? storage file?), one small diagram (ASCII is fine), and answer: "What happens to tasks when the app restarts, and why?"

## Step 3 — Build slice by slice
For EACH feature, in order:
1. Prompt your AI for just that slice, with your spec as context.
2. Read every line it returns. Comment anything unclear.
3. Run it. Test the happy path and one edge case (empty input, deleting a missing task).
4. Fix what breaks (debugging loop).
5. `git commit -m "Add <feature>, working"`.

Do not move to the next slice until the current one works and is committed.

## Step 4 — Explain-back
In `walkthrough.md`, explain each file in 1–3 sentences: what it does and why it exists. If you can't, go read it (Week 5) until you can.

## Step 5 — README
Write a `README.md`: what the app does, how to run it (the single command), and one known limitation you'd fix with more time.

## Submit → [`CHECK.md`](CHECK.md)
