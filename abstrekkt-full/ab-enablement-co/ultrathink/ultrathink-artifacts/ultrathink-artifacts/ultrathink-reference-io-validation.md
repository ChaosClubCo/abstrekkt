# Reference · R·06 Input / Output Validation
> Trust nothing crossing a boundary, including what you produced.

## TL;DR
Every input is hostile until validated. Every output is leakage until reviewed. The boundary is the system; everything inside is conditional on the boundary holding.

## Analogy
Customs at a border. Inbound is searched for what's forbidden. Outbound is searched for what's protected. Both are non-optional.

## Concrete example
Inputs: schema validation, length limits, type narrowing, allowlists where possible. Outputs: redact PII, strip stack traces from public errors, scrub debug payloads.

## Operational definition
- Validate at the boundary. The boundary is the controller, the parser, the queue consumer — not 'somewhere deeper'.
- Use a schema library (Zod, Pydantic, JSON Schema). Hand-rolled validators drift.
- Allowlist over blocklist. Every blocklist becomes obsolete.
- Outputs strip secrets, PII, internal paths, stack traces.
- Error messages crossing trust boundaries are sanitized before they leave.

## Anti-patterns
- Trusting the frontend to enforce server constraints.
- Validating in the data layer instead of the boundary.
- Returning raw exceptions to clients.
- Logging sensitive payloads at info level.

## Practitioner checklist
- [ ] Schema validation runs at every public entrypoint.
- [ ] Validation uses a library, not hand-rolled checks.
- [ ] Allowlists are used where possible; blocklists are documented as temporary.
- [ ] Public error messages reveal nothing about internals.
- [ ] Logs are scrubbed of secrets, PII, and full request bodies at non-debug levels.

## Related
- reference/owasp-checkpoint
- contract/security-floor

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_