# Week 8 — Debugging on Purpose 🚶

**Phase:** Walk (gate week) · **Survey gap:** Finding/fixing bugs avg 1.6 (59% "not confident at all" — near the bottom)
**Goal:** Turn "it's broken and I panic" into "it's broken and here's my method."

## TL;DR
Debugging is not guessing. It's a **method**: read the error, form a hypothesis, test it, narrow down. This week you stop fearing red text and start using it.

## Analogy
Debugging is being a **detective**, not a psychic. You don't magically know the culprit. You read the evidence (the error message), form a theory ("the file path is wrong"), and test it ("let me print the path"). Each test rules out suspects until one remains.

## Why this is a gate week
59% of you are "not confident at all" at fixing bugs — nearly the worst score in the survey, worse than writing code. That's because nobody taught you that errors are *information*, not judgment. When you can debug, AI-assisted coding becomes safe: the AI writes fast, you fix what breaks. Without this, you're stranded the moment code doesn't work.

## Read the error (it's telling you the answer)
Most errors tell you: **what** went wrong, **where** (file + line number), and often **why**. Read the LAST line first, then the line number. Example:
```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUser (app.js:14)
```
Translation: on line 14 of app.js, something you expected to be an object was `undefined`, and you tried to read `.name` off nothing. You now know the file, the line, and the cause. That's not a mystery — that's a map.

## The debugging loop
1. **Read the error.** Last line + location. Say it in plain English.
2. **Form ONE hypothesis.** "I think `user` is undefined because the fetch failed."
3. **Test the hypothesis.** Add a `console.log(user)` right before the crash. Look.
4. **Narrow.** Confirmed or ruled out? Move up the chain until you find the source.
5. **Fix the cause, not the symptom.** Don't silence the error — fix why it happened.

## The two most useful tools
- **`console.log()`** everywhere. Print variables right before the crash. See reality vs. assumption.
- **Bisect.** Comment out half the code. Does it still break? That half's fine — problem's in the other half. Repeat. You'll find any bug in a few halvings.

## Debugging AI's code
Same loop — but add: "What did the AI assume that isn't true here?" AI bugs are usually silent assumptions (wrong path, wrong data shape, missing null check).

## Technical definition
**Debugging** is the systematic process of localizing and correcting defects: reproduce, observe, hypothesize, test, isolate via reduction, and fix root cause.

➡️ Do [`EXERCISES.md`](EXERCISES.md). This is your **Phase 2 gate**.
