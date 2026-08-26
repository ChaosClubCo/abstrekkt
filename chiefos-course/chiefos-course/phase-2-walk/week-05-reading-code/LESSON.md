# Week 5 — Reading Code You Didn't Write 🚶

**Phase:** Walk · **Survey gap:** Reading others' code avg 2.0 ("awareness")
**Goal:** Trace, annotate, and summarize code you didn't write — the skill AI-assisted work depends on most.

## TL;DR
You will spend far more time *reading* code than writing it — especially code an AI wrote for you. This week you learn to read a file top-to-bottom and explain what it does, without running it in your head perfectly.

## Analogy
Reading code is like **reading a recipe you didn't cook before**. You don't need to have invented it. You scan the ingredients (imports/variables), read the steps in order (functions), and figure out what comes out at the end (the return/output). You can understand a recipe without being a chef.

## Why this is the hinge of the whole course
The survey shows prompting confidence (2.3) is *higher* than reading confidence (2.0). That's backwards and dangerous: people accept AI code they can't read. If you can read code, you can supervise AI. If you can't, the AI supervises you. This week flips it.

## A reading method (use it every time)
1. **Skim top-down.** Note imports, then the big named things (functions, classes).
2. **Find the entry point.** What runs first? (`main`, the top-level calls, the route handler.)
3. **Follow one path.** Pick the main flow and trace it call by call. Ignore edge cases first.
4. **Name the inputs and outputs.** What goes in, what comes out?
5. **Summarize in one sentence.** "This file takes X and produces Y by doing Z."

## Annotate as you go
Add `// comments` in your own words as you read. If you can't write the comment, you don't
understand that line yet — that's the signal to slow down or ask.

## Reading AI-generated code specifically
AI writes plausible-looking code that's sometimes subtly wrong. Read it the same way, but
add: "Does this actually do what I asked? What did it assume? What did it silently skip?"

## Technical definition
**Code comprehension** is building an accurate mental model of a program's behavior from its
source: control flow (what runs when), data flow (how values move), and interfaces (inputs/outputs).

➡️ Do [`EXERCISES.md`](EXERCISES.md).
