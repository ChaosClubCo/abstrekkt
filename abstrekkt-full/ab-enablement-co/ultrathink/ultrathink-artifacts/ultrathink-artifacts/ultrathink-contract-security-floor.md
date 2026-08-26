# Contract · C·01 Security Floor
> Security is not a feature. It's the floor everything else is built on.

## TL;DR
Two non-negotiables: no hallucinations passed off as facts, and no secrets in code that ships to a client.

## Analogy
A bridge can be elegant, fast to cross, and beautiful — but if it falls down, none of that mattered. Security is whether the bridge stays up.

## Concrete example
API keys live in environment variables. Database URLs live in environment variables. Service-role keys never appear in frontend bundles. Unverified claims are labeled as estimates, not asserted as facts.

## Operational definition
- Secrets in env vars. No exceptions, no 'just for development', no fallback constants.
- Frontend code uses publishable / anon keys only. Privileged operations route through a server.
- Every assertion is either sourced (with citation) or labeled as a generated estimate.
- If you don't know, say so. 'I cannot verify this' beats a confident wrong answer.

## Anti-patterns
- Hardcoded API keys in source files committed to a repo.
- Service-role / admin keys imported into client code.
- .env files committed alongside .env.example.
- Confident assertion of unverified facts because uncertainty 'feels weak'.

## Practitioner checklist
- [ ] Grep the codebase for the strings sk_, service_role, BEGIN, AKIA — all returned zero results in client code.
- [ ] Every secret is loaded from process.env / equivalent at runtime.
- [ ] .env is in .gitignore; .env.example contains only placeholder values.
- [ ] Every numeric claim in shipped output is labeled SOURCED or GENERATED.
- [ ] Every uncertainty is named, not papered over.

## Related
- reference/owasp-checkpoint
- contract/quality-gates

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_