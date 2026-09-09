# Engineering Standards

Abstrekkt projects favor deterministic, reviewable engineering practices.

## Baseline expectations

- Typed interfaces where the stack supports them
- Dependency locking and reproducible builds
- Automated linting, tests, and production builds
- Least-privilege authorization
- Secrets externalized from source and documentation
- Idempotent handling for consequential repeated operations
- Explicit failure behavior and observable evidence
- Immutable candidate identity for governed releases

## AI systems

AI-generated output is untrusted until validated. Prompts and skills guide behavior but do not replace runtime security, authorization, validation, or release controls.

## Release claims

`IMPLEMENTED`, `VERIFIED`, `DEPLOYED`, and `CERTIFIED` are distinct maturity states. A stronger state is never inferred solely from a weaker one.
