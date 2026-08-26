# RBAC & Data-Handling Model

> Reconstructed from the source's role→feature→connector mappings and "RBAC /
> memory isolation / escalation gates" model, corrected so that **enforcement lives
> in the admin console** and "memory isolation" is described honestly.

## Control-plane principle

> **The prompt is not the boundary. The admin console is.**

A role section that says "Sales cannot use Code Execution" is *defense-in-depth*.
The actual restriction must be set as an entitlement in the Claude Team/Enterprise
admin console. Audit category 6 fails if access is only enforced in prompts.

## Data tiers (recap from usage policy)

`Public → Internal → Confidential → Restricted` (Restricted = never in a prompt).
Every feature and connector below inherits the tier of the data it can touch.

## Role → feature access matrix (starter; reconcile to real org)

Legend: ● enforced-on · ○ off · △ on with escalation gate

| Role | Web search | Memory | Artifacts | File upload | Code execution | Connectors (data tier ceiling) |
|------|:--:|:--:|:--:|:--:|:--:|--|
| Branding & Identity | ● | ● | ● | ● | ○ | Internal |
| Content & Strategy | ● | ● | ● | ● | ○ | Internal |
| Managed Marketing | ● | ● | ● | ● | ○ | Confidential (analytics) |
| Website Design | ● | ● | ● | ● | △ | Internal |
| Sales | ● | ● | ● | ● | ○ | Confidential (CRM) |
| Customer Service | ● | ● | ● | ● | ○ | Confidential (customer) |
| Account Management | ● | ● | ● | ● | ○ | Confidential (customer) |
| Operations | ● | ● | ● | ● | △ | Confidential |
| Human Resources | ● | ● | ● | ● | ○ | Confidential (PII) |
| Product Management | ● | ● | ● | ● | △ | Internal |
| Finance | ● | ● | ● | ● | △ | Restricted-adjacent (no raw secrets) |
| Legal & Compliance | ● | ● | ● | ● | ○ | Confidential (contracts) |
| Engineering | ● | ● | ● | ● | ● | Confidential (no prod secrets) |
| Information Security | ● | ● | ● | ● | ● | Confidential (no prod secrets) |
| Executive | ● | ● | ● | ● | ○ | Confidential (broad — scope deliberately) |

> Code execution is gated (△) for roles that may touch sensitive data through it,
> and on (●) only for engineering roles. Reconcile every cell with your real
> entitlements during Wave 0.

## Role → connector mapping (from source; **no secrets/URLs reproduced**)

The source listed ~23 MCP connectors with URLs and referenced API keys. **None of
those URLs or keys are reproduced here.** Map connectors to roles, classify the data
tier, assign an owner, and store credentials in the secrets manager — not here.

| Role | Typical connectors (illustrative) | Data tier | Owner |
|------|-----------------------------------|-----------|-------|
| Sales | CRM, payments, docs | Confidential | `[ ]` |
| InfoSec | error monitoring, code host, edge/security | Confidential | `[ ]` |
| Engineering | code host, deploy, issue tracker, monitoring | Confidential | `[ ]` |
| Marketing | CRM, asset/media, docs | Confidential | `[ ]` |
| Finance | payments, docs | Restricted-adjacent | `[ ]` |
| Operations | issue tracker, chat, automation | Confidential | `[ ]` |

Rule: **a connector is not enabled for a role until it has a data-tier
classification and a named owner** (audit category 5 gate).

## "Memory isolation" — stated honestly

The source claimed "Sales can't see Finance memories" as a security property.
Reality:

- Claude memory is **per-user / per-workspace**, not a cross-tenant security kernel.
- Cross-role non-leakage is an outcome of **configuration + policy + user
  discipline**, not a hard isolation boundary you can assume.
- Therefore: (a) treat memory as *not* a place for Restricted data; (b) **verify**
  isolation empirically (see `../audit/audit-evidence-template.md`) before citing it
  as a control.

## Escalation gates (where △/high-risk actions stop)

High-risk actions (prod changes, customer PII, contracts, financial commitments,
incident response) require human approval regardless of role. Document the approver
per department in the rollout plan's cross-functional workflows.

## Review

RBAC entitlements are reviewed **monthly** (departures, role changes) and on any
org change. Export and attach to the evidence log.
