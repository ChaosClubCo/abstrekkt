# Week 7 — AI Pairing Done Right 🚶

**Phase:** Walk · **Survey gap:** AI while coding (2.3) + reviewing AI output (2.3)
**Goal:** Use AI as a supervised pair partner — prompt, review, and catch its mistakes.

## TL;DR
Now that you can read code (Week 5) and run it (Weeks 1–6), you've earned the right to pair with AI. The skill is not "ask and paste." It's a loop: **prompt → read what it wrote → verify it runs → catch what's wrong → correct.**

## Analogy
AI is a **fast, confident intern**. It types quickly and knows a lot, but it will occasionally hand you something that looks perfect and is quietly wrong. You are the senior on the pair. You never merge the intern's work without reading it.

## The dangerous gap in this cohort
Your prompting confidence (2.3) is higher than your bug-fixing confidence (1.6). That means the average student here is *more* comfortable asking AI for code than fixing what it breaks. That's the "prompt-and-pray" trap. This week converts prompting from a crutch into a supervised tool.

## The prompt → verify loop
1. **Prompt with specifics.** Not "make a login." Instead: "Write a Node function `isValidEmail(str)` that returns true/false, handles empty input, and has no external libraries."
2. **Read every line** it returns (Week 5 method). Comment anything you're unsure of.
3. **Run it** against real inputs, including edge cases (empty, weird, huge).
4. **Catch mistakes.** Did it assume something? Skip validation? Invent a library that doesn't exist?
5. **Correct by prompting or by hand.** Give the AI the failing case; or fix it yourself.

## Good prompting habits
- State inputs, outputs, and constraints explicitly.
- Give it context: paste the relevant file, say what the code around it does.
- Ask it to explain its own code — then check the explanation against the code.
- One task at a time. Big vague prompts produce big vague bugs.

## The three lies AI tells
1. **Hallucinated APIs** — functions/libraries that don't exist. (Verify by running.)
2. **Silent assumptions** — it guesses your intent and doesn't say so.
3. **Confident wrongness** — it will defend a bug in fluent English. Trust the runtime, not the prose.

## Technical definition
**AI pair programming** is an interaction pattern where a human specifies intent and reviews/validates AI-generated code, retaining accountability for correctness, security, and design.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
