# Vision · V·02 Obsess Over Details
> Read the codebase like a masterpiece. Understand its soul.

## TL;DR
Details are the system. The variable name, the order of arguments, the way an error is raised — these compound into either a codebase that teaches or a codebase that resists.

## Analogy
A locksmith doesn't just open the door. They listen to the pins. The same lock failure has six different causes; only one matches the sound.

## Concrete example
Renaming `data` to `parsedInvoiceLines` saves ten minutes for the next reader. Choosing `Result<T, E>` over `T | null` saves a class of bugs. Sorting imports alphabetically saves merge conflicts. None of these are aesthetic.

## Operational definition
- Read the file before changing it. Read the function it calls. Read the test.
- Treat each name, signature, and error message as a load-bearing decision.
- Match the surrounding code's idiom unless you are deliberately replacing it.
- When you spot a ten-second improvement, make it. Compounding starts with the first commit.

## Anti-patterns
- `temp`, `data2`, `helper2` — names that signal the author stopped thinking.
- Try/catch swallowing the error and returning null.
- Mixing camelCase and snake_case in the same module.
- Comments that describe what the code does instead of why.

## Practitioner checklist
- [ ] Every variable I introduced has a name a stranger could decode.
- [ ] Every function returns a result type that distinguishes success from failure.
- [ ] Every error message includes context — what was attempted, what failed, what to try next.
- [ ] I read the surrounding 50 lines before editing.
- [ ] I matched indentation, quote style, and import order to the existing file.

## Related
- vision/simplify-ruthlessly
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_