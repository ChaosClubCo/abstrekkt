# ULTRATHINK · Reference
> Pocket frameworks, security checkpoints, and analogies for the work in front of you.

Tab code: `R` · Sections: 6

## R·01 Quick Analogies
> Borrow vocabulary from older disciplines. They've been at it longer.

**TL;DR.** Software borrows from finance, medicine, civil engineering, and athletics because those fields figured out reliability before we did. Use the borrowed words on purpose.

**Operational:**
- SLOs / error budgets — treat reliability as a budget you spend, not an absolute.
- Rest days — recovery is part of the cycle, not the absence of work.
- Defense in depth — never one layer; always at least two.
- Capacity planning — same as personal energy. You don't max out; you leave headroom.
- Pre-mortem — assume the project failed; explain why.

**Practitioner checklist:**
- [ ] I'm using the borrowed term in the way the source field uses it, not as marketing.
- [ ] When the metaphor stops fitting, I drop it instead of forcing it.
- [ ] I have at least two analogies for the same concept — one technical, one accessible.
- [ ] If a stakeholder doesn't get the technical version, I have the accessible version ready.

---

## R·02 Before Every Task
> Five questions, then start.

**TL;DR.** A short pre-flight checklist run before any non-trivial work. Catches the obvious before it becomes expensive.

**Operational:**
- Problem: stated in one sentence, in the user's words.
- Audience: who feels the impact when this ships or when it breaks.
- Done: observable, testable, time-bounded.
- Risk: top three failure modes named.
- Reviewer: a name, not a role.

**Practitioner checklist:**
- [ ] Problem statement fits in one sentence.
- [ ] Audience is named — a person, role, or system.
- [ ] Done is observable and has a verification step.
- [ ] Top three risks are named with the conditions that trigger them.
- [ ] Reviewer is a person who will actually read the diff.

---

## R·03 R-I-S-E Framework
> Role, Input, Stops, Expectation.

**TL;DR.** A four-letter prompt or task scaffold. Use it when the request is fuzzy and the responder has no anchor.

**Operational:**
- Role: declared explicitly. 'Senior security reviewer' produces different output than 'helpful assistant'.
- Input: the relevant context — files, constraints, prior decisions. Skip the rest.
- Stops: what's out of scope, what's forbidden. Negative space matters.
- Expectation: the shape of the output — bullet list, code, decision memo, table.

**Practitioner checklist:**
- [ ] Role is named with enough specificity to constrain output style.
- [ ] Input is filtered to what's relevant, not everything available.
- [ ] At least one explicit stop is listed (what NOT to do).
- [ ] Expected output shape is named — format, length, structure.
- [ ] If responses drift, I revise R-I-S-E rather than the responder.

---

## R·04 F-L-O-W Framework
> Focus, Layers, Outcomes, Waypoints.

**TL;DR.** A four-letter execution scaffold. Use it when work is multi-step and you need to maintain direction across hours or days.

**Operational:**
- Focus: name it before you start. Defaults to whatever's loudest otherwise.
- Layers: prerequisites, supporting work, fallback plans.
- Outcomes: phrased as observable artifacts, not activities.
- Waypoints: small, frequent. Every 30–60 minutes if the work is dense.

**Practitioner checklist:**
- [ ] Focus is one sentence and one thing.
- [ ] Layers list names dependencies and at least one fallback.
- [ ] Outcomes are artifacts (file exists, test passes, deploy succeeds), not verbs.
- [ ] Waypoints are scheduled and frequent.
- [ ] When a waypoint is missed, I adjust the plan rather than push through.

---

## R·05 OWASP Checkpoint
> Three categories that catch most of what kills systems: misconfiguration, injection, cryptography.

**TL;DR.** A scoped checkpoint pulled from the OWASP Top 10. Not exhaustive — just the three categories that catch the largest share of preventable security failures in everyday work.

**Operational:**
- A02 — Misconfiguration: review framework defaults; remove unused features; harden HTTP headers; rotate default credentials.
- A03 — Injection: parameterized queries; output escaping appropriate to the context (HTML / SQL / shell / LDAP); content security policy.
- A05 — Cryptography: TLS everywhere; strong algorithms (AES-GCM, Argon2); secrets in env, not in code; key rotation plan.
- Run this checkpoint at end-of-feature, not end-of-quarter.

**Practitioner checklist:**
- [ ] All queries / commands use parameterized APIs, not string concatenation.
- [ ] All output is escaped for its rendering context.
- [ ] All transport is TLS 1.2+ (TLS 1.3 preferred).
- [ ] Passwords use Argon2id or bcrypt with appropriate work factor.
- [ ] Default credentials, demo accounts, and unused endpoints have been removed.
- [ ] HTTP security headers (CSP, HSTS, X-Content-Type-Options) are set.

---

## R·06 Input / Output Validation
> Trust nothing crossing a boundary, including what you produced.

**TL;DR.** Every input is hostile until validated. Every output is leakage until reviewed. The boundary is the system; everything inside is conditional on the boundary holding.

**Operational:**
- Validate at the boundary. The boundary is the controller, the parser, the queue consumer — not 'somewhere deeper'.
- Use a schema library (Zod, Pydantic, JSON Schema). Hand-rolled validators drift.
- Allowlist over blocklist. Every blocklist becomes obsolete.
- Outputs strip secrets, PII, internal paths, stack traces.
- Error messages crossing trust boundaries are sanitized before they leave.

**Practitioner checklist:**
- [ ] Schema validation runs at every public entrypoint.
- [ ] Validation uses a library, not hand-rolled checks.
- [ ] Allowlists are used where possible; blocklists are documented as temporary.
- [ ] Public error messages reveal nothing about internals.
- [ ] Logs are scrubbed of secrets, PII, and full request bodies at non-debug levels.

---

_Generated from ULTRATHINK Framework v1.0.0 · 2026-05-09_