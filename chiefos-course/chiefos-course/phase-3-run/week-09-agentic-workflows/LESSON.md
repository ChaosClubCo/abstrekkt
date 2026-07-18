# Week 9 — Agentic Workflows 🏃

**Phase:** Run · **Survey gap:** #1 stated goal ("learn AI for coding + understand agentic workflows")
**Goal:** Drive an AI agent through a real multi-step task using the plan → execute → review loop.

## TL;DR
An **agentic workflow** is when you give an AI a goal and it takes multiple steps on its own — planning, running commands, checking its work — instead of answering one question at a time. Your job shifts from "typing code" to "directing and reviewing an agent." Everything you learned in Phases 1–2 is what lets you do that safely.

## Analogy
Weeks 1–8 you were the cook. Now you're the **head chef running a line**. You don't chop every onion yourself; you give clear tickets ("table 4, two steaks medium"), the line executes, and you *inspect every plate before it leaves the kitchen*. The agent is your line cook. You still get fired if a bad plate goes out — so you check.

## The agentic loop (this is the heart of the course name)
```
GOAL → PLAN → EXECUTE → REVIEW → (correct) → REPEAT → DONE
```
- **Goal:** what you want, stated clearly (you learned specificity in Week 7).
- **Plan:** the agent proposes steps. You read the plan and approve/adjust (Week 5 reading).
- **Execute:** the agent runs steps — writes files, runs commands (Weeks 1–6 let you follow along).
- **Review:** you verify each result (Week 8 debugging mindset). Nothing ships unread.

## Why your fundamentals are the whole game here
An agent will run terminal commands, edit files, make Git commits, spin up containers. If you didn't do Phases 1–2, you'd have no idea whether the agent did the right thing — you'd be back to "prompt and pray," just faster and more dangerous. Because you *can* read code, run Docker, and debug, you can actually supervise an agent. That's the payoff.

## The three human bottlenecks (real industry framing)
Even with great agents, three jobs stay human — they need judgment, not typing:
1. **Goal communication** — saying clearly what you actually want.
2. **Spec refinement** — making decisions as the agent hits ambiguity.
3. **Output review** — catching what's wrong before it ships.
Notice all three are things this course trained: clear prompts, reading, debugging.

## A worked example: the Real-Estate lead agent
Look at `reference/n8n-agent-diagram.md`. It's a real agent workflow: a message comes in → extract details → an AI agent answers questions and collects info → qualify the lead → branch (`IF qualified?`) → either search listings and update the CRM, or hand off to a human. Study how it's a *chain of small verifiable steps with a human-handoff escape hatch* — not one giant magic prompt. That's how real agentic systems are built, including ChiefOS.

## HITL: the human handoff
Notice node 15 in that diagram: **Human Handover (Optional)**. Good agentic systems always have an escape hatch to a human for the cases the agent shouldn't decide alone. Designing *where* the human stays in the loop is a core skill — and a safety requirement for anything sold to the Army.

## Technical definition
An **agentic workflow** is an AI system that autonomously executes multi-step tasks toward a goal via iterative planning, tool use, and self-review, with human oversight at goal-setting, specification, and output-review checkpoints.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
