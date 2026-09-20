# Reference · R·05 OWASP Checkpoint
> Three categories that catch most of what kills systems: misconfiguration, injection, cryptography.

## TL;DR
A scoped checkpoint pulled from the OWASP Top 10. Not exhaustive — just the three categories that catch the largest share of preventable security failures in everyday work.

## Analogy
A doctor doesn't run every test on every patient. They run the three that catch the most common preventable conditions, then escalate based on what they find.

## Concrete example
A02 Misconfiguration: defaults left on, ports open, headers missing. A03 Injection: user input concatenated into queries, commands, or rendered markup. A05 Cryptography: weak algorithms, missing TLS, secrets in plaintext.

## Operational definition
- A02 — Misconfiguration: review framework defaults; remove unused features; harden HTTP headers; rotate default credentials.
- A03 — Injection: parameterized queries; output escaping appropriate to the context (HTML / SQL / shell / LDAP); content security policy.
- A05 — Cryptography: TLS everywhere; strong algorithms (AES-GCM, Argon2); secrets in env, not in code; key rotation plan.
- Run this checkpoint at end-of-feature, not end-of-quarter.

## Anti-patterns
- String concatenation building any kind of query or command.
- MD5 or SHA-1 used for password hashing.
- Self-signed certs in production.
- 'It's internal so we don't need TLS.'

## Practitioner checklist
- [ ] All queries / commands use parameterized APIs, not string concatenation.
- [ ] All output is escaped for its rendering context.
- [ ] All transport is TLS 1.2+ (TLS 1.3 preferred).
- [ ] Passwords use Argon2id or bcrypt with appropriate work factor.
- [ ] Default credentials, demo accounts, and unused endpoints have been removed.
- [ ] HTTP security headers (CSP, HSTS, X-Content-Type-Options) are set.

## Related
- contract/security-floor
- reference/io-validation

---
_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_