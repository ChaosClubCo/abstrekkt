# Week 9 — Exercises

You'll drive an AI agent through a real multi-step build, reviewing every step.

## Drill 1 — Write a goal + spec (the human's real job)
Pick a small tool (e.g., "a CLI script that takes a folder and lists every file over 1MB").
In `spec.md`, write:
- **Goal:** one sentence.
- **Inputs / outputs:** exactly what goes in and comes out.
- **Constraints:** language, no external libraries, error handling for a missing folder.
- **Done means:** the acceptance criteria — how you'll know it works.
This spec is the deliverable, not the code. Specs are the human bottleneck.

## Drill 2 — Have the agent plan first
Give the agent your spec and say: "Before writing code, give me a numbered plan of the steps you'll take. Do not write code yet." Read the plan. In `plan-review.md`, note anything you'd change and why. Approve or correct.

## Drill 3 — Execute step by step, reviewing each
Let the agent implement. After each step, actually run/read the result. When it produces the script:
- Read it (Week 5).
- Run it against a real folder AND a missing folder (Week 8 edge cases).
- Log any bug and how you or the agent fixed it in `run-log.md`.

## Drill 4 — Map a human-in-the-loop point
Look again at `reference/n8n-agent-diagram.md`. In `spec.md`, add: "If I turned this into an automated agent that deletes big files, WHERE would I require a human to approve before it acts, and why?" One paragraph.

## Submit → [`CHECK.md`](CHECK.md)
