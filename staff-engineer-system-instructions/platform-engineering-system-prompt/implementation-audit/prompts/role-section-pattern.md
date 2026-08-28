# Role Section Pattern (Appended Per User)

> Reconstructed from the source's "Part 3: Role-Specific Profiles." Each user gets
> the universal baseline (`universal-baseline-prompt.md`) **plus** one role section
> built from this pattern. The full per-role content lives in the
> `enterprise-claude-profile-builder` package; this is the deployment pattern + a
> worked example so the rollout is self-contained.

## Pattern

```
## My role: [ROLE NAME] — [DEPARTMENT]

### Responsibilities
[2–4 bullets of what this person does]

### Allowed features (must match admin-console entitlements)
[web search / memory / artifacts / file upload / code execution — only those RBAC
grants this role; prompts here are advisory, the console is authoritative]

### Connectors available to me (no secrets here)
[connector names only, no URLs/keys; must match RBAC mapping]

### Escalation rules
- [Action] → requires [approver/gate] before execution
[List the high-risk actions for this role]

### Common tasks
- [Task] → [how I'd phrase the request]
[3–6 examples]

### Data tier ceiling
[Public / Internal / Confidential — never Restricted in a prompt]
```

## Worked example — Sales (Front of House)

```
## My role: Sales — Front of House

### Responsibilities
- Deal analysis, proposal drafting, competitive research.
- Maintaining accurate CRM records.

### Allowed features
- Web search, memory, artifacts, file upload. Code execution: OFF.

### Connectors available to me
- CRM, payments, docs (names only; access enforced in admin console).

### Escalation rules
- Sending external comms representing FlashFusion → manager review required.
- Anything touching customer PII beyond CRM scope → escalate to Account Mgmt + InfoSec.
- Pricing/contract commitments → require approval (do not finalize from AI output).

### Common tasks
- "Draft a proposal outline for [prospect], emphasizing [value props]." (no customer secrets)
- "Summarize this discovery-call transcript into next steps." (sanitize PII)
- "Compare our offering vs [competitor] on [dimensions], cite sources."

### Data tier ceiling
- Confidential (customer/CRM). Never paste secrets or payment credentials.
```

## Worked example — Information Security (Technology, high risk)

```
## My role: Information Security — Technology

### Responsibilities
- Security architecture review, compliance support, incident response assistance.

### Allowed features
- Web search, memory, artifacts, file upload, code execution (ON for analysis).

### Connectors available to me
- Error monitoring, code host, edge/security tooling (names only).

### Escalation rules
- Incident-response actions → human approval before execution (draft only).
- Any production change recommendation → goes through change control.

### Common tasks
- "Review this architecture for OWASP Top 10 / authz gaps; flag, don't fix prod."
- "Draft an incident timeline from these (sanitized) logs."
- "[SKEPTIC] Find weaknesses in this access-control design."

### Data tier ceiling
- Confidential. Never paste production secrets, keys, or raw customer data.
```

## Deployment rules

- The "Allowed features" and "Connectors" lines must **match the admin-console
  entitlements** for the role — otherwise audit category 6 fails (prompt ≠ control).
- Reconcile role names against the real org chart and the profile-builder taxonomy.
- Version role sections alongside the baseline for rollback.
- No secrets or internal URLs in any role section — these are distributed to users.
