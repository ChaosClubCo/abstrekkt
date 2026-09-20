# Template 10: Build a "Prompt for Another Agent" (Copilot/Claude/Gemini)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Create a single prompt I can paste into another agent (Copilot/Claude/Gemini) to execute a defined task with production constraints.

CONTEXT:
- The downstream agent will do implementation; we produce the instruction package

CONSTRAINTS:
- Must include guardrails: no breaking changes, no secret leakage, add tests, add docs
- Must include explicit deliverables and validation commands

INPUTS:
[Paste: task description + repo context + any files or errors]

OUTPUT NEEDS:
- Markdown
- Output: one copy-paste prompt block + acceptance criteria + failure recovery steps + CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=ReActLoop
- Framework=RISEN
- OutputFormat=Markdown
```

## USAGE NOTES

- Paste your task description, repo context, and any error messages
- ReActLoop structures as Thought/Action/Observation cycles
- RISEN ensures complete prompt with role, instructions, steps, end goal
- Output is a single prompt block ready to paste into another AI agent
- Includes safety guardrails and validation steps
