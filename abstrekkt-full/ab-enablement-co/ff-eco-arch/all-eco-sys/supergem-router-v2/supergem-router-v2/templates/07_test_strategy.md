# Template 7: Test Strategy + Minimal CI Gate (Fast, Deterministic)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Create a pragmatic test strategy and CI gate that prevents regressions with minimal runtime and high signal.

CONTEXT:
- Repo uses TypeScript/JS (or specify)
- Need unit + integration + smoke checks

CONSTRAINTS:
- Keep CI under 10 minutes where possible
- Deterministic tests only; no flaky network dependencies
- Include security scanning steps (secret scan, dependency scan)

INPUTS:
[Paste: stack, existing tests, CI provider (GitHub Actions, etc.), and constraints]

OUTPUT NEEDS:
- Markdown
- Must include: test pyramid; exact commands; CI steps; sample thresholds; failure triage flow; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=SkeletonOfThought
- Framework=RISEN
- OutputFormat=Markdown
```

## USAGE NOTES

- Paste your stack, existing test files, and CI config
- SkeletonOfThought outlines test structure before filling implementation
- RISEN framework ensures complete test strategy from role to end goal
- Output includes exact CI commands and pass/fail thresholds
