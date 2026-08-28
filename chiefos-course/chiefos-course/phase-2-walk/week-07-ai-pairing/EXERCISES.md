# Week 7 — Exercises

Use any AI assistant (Claude, Copilot, Cursor). Save your prompts AND the outputs.

## Drill 1 — Specific vs vague (feel the difference)
Ask your AI both:
- Vague: "make an email checker"
- Specific: "Write a JavaScript function `isValidEmail(str)` returning a boolean. Handle empty string and missing @. No external libraries. Include 3 example calls."

Save both outputs to `prompt-compare.md`. Write 2 sentences on how the outputs differed.

## Drill 2 — Review and catch
Take the specific `isValidEmail` and put it in `email.js`. Read every line. Then test it hard:
```javascript
console.log(isValidEmail("a@b.com"));   // expect true
console.log(isValidEmail(""));          // expect false
console.log(isValidEmail("no-at"));     // expect false
console.log(isValidEmail("a@@b.com"));  // ??? test it
console.log(isValidEmail("a@b"));       // ??? test it
```
Run it. Find at least one input where the AI's logic is weaker than you'd want. Write it down. (Most simple versions mishandle `a@b` or double @.)

## Drill 3 — Make the AI explain itself
Paste the function back and ask: "Explain line by line what this does and list one case where it fails." Compare its answer to what you found in Drill 2. Did it admit the weakness or defend the bug?

## Drill 4 — Hallucination hunt
Ask: "Write Node code to read a file using the `readFileMagic` function." There is no such function. Does your AI invent it, or push back? Record what happened in `prompt-compare.md`. This is why you always run the code.

## Submit → [`CHECK.md`](CHECK.md)
