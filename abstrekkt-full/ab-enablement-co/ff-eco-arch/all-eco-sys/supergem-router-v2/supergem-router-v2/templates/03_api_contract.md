# Template 3: Generate an API Contract + JSON Schemas (Client/Server)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Produce a stable API contract for a feature, including endpoints, request/response schemas, error model, and versioning strategy.

CONTEXT:
- Consumers: web app + background jobs
- Requirements: explicit validation and backwards compatibility

CONSTRAINTS:
- Use consistent error envelope and typed fields
- Include auth model and rate limiting guidance
- No implementation code unless asked

INPUTS:
[Paste: feature description + any existing routes/types + sample payloads (if any)]

OUTPUT NEEDS:
- JSONOnly
- Must include: OpenAPI-like structure OR explicit endpoint list, plus JSON Schema for each payload, plus examples

MODE SWITCHES:
- ReasoningEngine=SkeletonOfThought
- Framework=RTF
- OutputFormat=JSONOnly
```

## USAGE NOTES

- Paste your feature description and any existing API routes into INPUTS
- SkeletonOfThought creates outline first, then fills details
- RTF (Role, Task, Format) keeps output focused on contract generation
- Output will be valid JSON only (no markdown prose)
