# FlashFusion Claude Rollout Plan (Phased, Gated)

> Reconstructed from the source's flat deployment checklist and 14-role/5-department
> expansion, restructured into **gated waves** with owners and rollback triggers.
> Org size used for sizing: **~41 FTE** (see FTE-drift note in README CLAIMS CHECK).

## Principles

1. **Govern before you deploy.** The governance pack (`../governance/`) must be
   adopted and the audit gates for the wave must PASS first.
2. **Wave by blast radius, not headcount.** Low-risk departments first; regulated /
   high-privilege roles last.
3. **Enforce in the admin console.** Prompts are advisory; entitlements are the
   real control.
4. **Every wave has a rollback trigger.** If a gate fails or an incident occurs,
   revert (see Rollback).

## Departments & roles (from source; reconcile to real org chart)

| Department | Roles | Risk tier |
|------------|-------|-----------|
| Creative & Marketing | Branding & Identity, Content Creation & Strategy, Managed Marketing, Website Design | Low |
| Front of House | Sales, Customer Service, Account Management | Medium |
| Operations | Operations, HR, Product Management | Medium |
| Operations (regulated) | Finance, Legal & Compliance | High |
| Technology | Engineering, Information Security | High |
| Leadership | Executive | High (broad visibility) |

> Full role definitions, capabilities, and connector maps live in the
> `enterprise-claude-profile-builder` package. A condensed crosswalk is in
> `../taxonomy/role-access-crosswalk.md`.

## Waves

### Wave 0 — Foundation (Week 0)
- **Owner:** Implementation lead + InfoSec
- **Entry gate:** Audit categories 1, 2, 5, 6 PASS; governance pack signed off.
- **Activities:**
  - Apply `../prompts/universal-baseline-prompt.md` org-wide (admin console).
  - Configure RBAC + connector entitlements per `../governance/rbac-data-handling.md`.
  - Confirm ZDR/retention contract terms (`../governance/zdr-retention-reality.md`).
- **Exit gate:** Baseline verified active on a test user; RBAC export reviewed.

### Wave 1 — Pilot (Weeks 1–2): Creative & Marketing (Low risk)
- **Owner:** Marketing lead + Implementation lead
- **Entry gate:** Wave 0 exit gate passed.
- **Activities:**
  - Enable roles: Branding, Content, Managed Marketing, Website Design.
  - Apply role sections (`../prompts/role-section-pattern.md`).
  - Run IC training track (30 min); collect feedback.
  - Verify via `deployment-checklist.md`.
- **Exit gate:** ≥80% of pilot users complete setup + self-assessment; zero
  Sev-1 security findings; feedback triaged.

### Wave 2 — Front of House + Operations (Weeks 3–4): Medium risk
- **Owner:** Ops lead + department managers
- **Entry gate:** Wave 1 exit gate passed; no open Sev-1/Sev-2 from pilot.
- **Activities:**
  - Enable Sales, Customer Service, Account Management, Operations, HR, Product.
  - Manager training track (1 hr): cross-functional workflows + escalation rules.
  - Validate connector access (HubSpot, Linear, Slack, etc.) against RBAC.
- **Exit gate:** RBAC entitlements audited; escalation gates tested live.

### Wave 3 — Regulated & High-Privilege (Weeks 5–6): High risk
- **Owner:** InfoSec + Legal + Finance leads
- **Entry gate:** Wave 2 exit gate passed; **all 12 audit categories PASS**;
  empirical-verification log (memory isolation, logging, ZDR) complete.
- **Activities:**
  - Enable Finance, Legal & Compliance, Engineering, Information Security.
  - Stricter defaults: escalation gates mandatory; memory policy reviewed per role.
  - Confirm no connector exposes regulated data beyond its tier.
- **Exit gate:** Security sign-off in `../audit/audit-evidence-template.md`.

### Wave 4 — Leadership + Org-wide steady state (Week 7+)
- **Owner:** Executive sponsor + Implementation lead
- **Entry gate:** Wave 3 exit gate passed.
- **Activities:**
  - Enable Executive role (broad visibility — confirm scope deliberately).
  - Executive training track (1 hr): compliance/security model + rollout approval.
  - Transition to monthly maintenance cadence (see `deployment-checklist.md`).

## Cross-functional workflows to validate during rollout (from source)

- **New customer onboarding:** Sales → Customer Service → Account Mgmt → Finance
- **Product launch:** Product → Marketing → Sales → Engineering
- **Security incident:** InfoSec → Engineering → Legal → Executive
- **Quarterly planning:** Executive → Finance → all departments

For each, confirm escalation handoffs and that each role only sees what its tier
permits.

## RACI (summary)

| Activity | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Governance adoption | Impl. lead | Exec sponsor | InfoSec, Legal | All staff |
| RBAC/entitlements | InfoSec | Impl. lead | Dept managers | Auditors |
| Wave enablement | Dept manager | Impl. lead | InfoSec | Wave users |
| Training | Enablement owner | Dept manager | — | Users |
| Audit/certification | Audit owner | Exec sponsor | InfoSec, Legal | Board |

## Rollback (per wave)

Rolling back is **access-and-prompt reversal, not data deletion**.

**Triggers:** a wave exit gate fails; a Sev-1 security/privacy incident; a
compliance finding; sustained user-blocking issues.

**Procedure:**
1. **Freeze** the affected wave (no further enablement).
2. **Revoke entitlements** for the wave's roles in the admin console (connectors,
   high-risk features) — this is the real rollback.
3. **Revert prompts** to the previous baseline/role-section version (keep versioned
   copies; see `../prompts/`).
4. **Notify** affected users + InfoSec; log in the evidence template.
5. **Root-cause** before re-attempting the gate. Do not skip the gate on retry.

**Note:** User memory and past conversations are retained per the ZDR/retention
policy; rollback does not purge them. If a privacy incident requires deletion, use
the admin console's data-deletion controls per `../governance/zdr-retention-reality.md`.

## Acceptance criteria (rollout complete)

- [ ] All waves passed their exit gates in order
- [ ] All 12 audit categories PASS with evidence
- [ ] Empirical-verification log complete (isolation, logging, ZDR)
- [ ] Governance pack signed off by InfoSec, Legal, Exec sponsor
- [ ] Monthly maintenance cadence active
