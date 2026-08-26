# Role × Department × Access Crosswalk (Condensed)

> Condensed map of the source's 14 roles / 5 departments, for use **inside this
> playbook** (rollout waves, RBAC, audit). The **full taxonomy** (capabilities,
> escalation rules, detailed connector lists, per-role profiles) lives in the
> `enterprise-claude-profile-builder` package — this file deliberately does not
> restate it. Reconcile both against your real org chart before rollout.

## Departments → roles → risk tier → rollout wave

| Department | Role | Risk tier | Wave | Code exec | Data tier ceiling |
|------------|------|-----------|------|:--:|--|
| Creative & Marketing | Branding & Identity | Low | 1 | off | Internal |
| Creative & Marketing | Content Creation & Strategy | Low | 1 | off | Internal |
| Creative & Marketing | Managed Marketing | Low | 1 | off | Confidential |
| Creative & Marketing | Website Design | Low | 1 | gated | Internal |
| Front of House | Sales | Medium | 2 | off | Confidential |
| Front of House | Customer Service | Medium | 2 | off | Confidential |
| Front of House | Account Management | Medium | 2 | off | Confidential |
| Operations | Operations | Medium | 2 | gated | Confidential |
| Operations | Human Resources | Medium | 2 | off | Confidential (PII) |
| Operations | Product Management | Medium | 2 | gated | Internal |
| Operations (regulated) | Finance | High | 3 | gated | Restricted-adjacent |
| Operations (regulated) | Legal & Compliance | High | 3 | off | Confidential |
| Technology | Engineering | High | 3 | on | Confidential |
| Technology | Information Security | High | 3 | on | Confidential |
| Leadership | Executive | High (broad) | 4 | off | Confidential |

Notes:
- "Restricted-adjacent" (Finance): may discuss sensitive financial data but **never
  raw secrets/credentials** in a prompt.
- Executive has broad visibility — scope deliberately during Wave 4; broad ≠ all.
- Code-exec "gated" = enabled only with an escalation gate for sensitive use.

## Cross-functional workflows (which roles hand off)

| Workflow | Sequence |
|----------|----------|
| New customer onboarding | Sales → Customer Service → Account Mgmt → Finance |
| Product launch | Product → Marketing → Sales → Engineering |
| Security incident | InfoSec → Engineering → Legal → Executive |
| Quarterly planning | Executive → Finance → all departments |

During rollout, validate that each handoff respects the receiving role's data-tier
ceiling and escalation gates.

## Source self-reported coverage (treat as claims, not facts)

The source reported "140+ capabilities, 70+ common tasks, 56+ escalation rules,
80+ tool integrations, 100% of departments, 53,000+ words." These are **self-counts
from the chat**, not independently verified here. Use the profile-builder package as
the authoritative role content and confirm counts there if needed.
