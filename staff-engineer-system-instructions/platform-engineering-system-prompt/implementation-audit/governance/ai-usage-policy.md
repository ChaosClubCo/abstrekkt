# FlashFusion — Claude Acceptable Use Policy (Template)

> Adoptable governance artifact reconstructed from the source's security/compliance
> model (ZDR, RBAC, escalation gates, compliance framing). Review with Legal and
> InfoSec before adoption. Bracketed fields `[…]` need your real values.

**Version:** v1.0 (template) · **Owner:** `[InfoSec / Legal]` · **Review cadence:** quarterly

## 1. Purpose & scope

Defines how FlashFusion staff may use Claude (web, mobile, desktop, Claude Code, API)
for company work. Applies to all staff and contractors with access. Personal use of
personal accounts is out of scope; **company data must only go through company-
provisioned, RBAC-governed access.**

## 2. Data classification (what may be sent to Claude)

| Tier | Examples | Rule |
|------|----------|------|
| **Public** | Marketing copy, public docs | Allowed |
| **Internal** | Internal plans, non-sensitive code | Allowed for roles whose RBAC permits it |
| **Confidential** | Customer PII, financials, contracts, credentials-adjacent | Allowed **only** for authorized roles; never paste raw secrets; sanitize where possible |
| **Restricted** | Secrets, API keys, tokens, regulated health/payment data | **Never** paste into a prompt. Use references, not values. |

**Hard rule:** No secrets, API keys, tokens, passwords, or private keys in any
prompt, artifact, or shared doc — ever. This applies to humans and to any automation
that constructs prompts.

## 3. Role-based access

Feature and connector access is governed by RBAC (`rbac-data-handling.md`) and
**enforced in the Claude admin console**, not by prompt instructions alone. Users
must not attempt to bypass entitlements.

## 4. Escalation gates (human-in-the-loop required)

Claude output must not be acted on unilaterally for high-risk actions. The
following require human review/approval before execution:

- Production changes (deploys, schema/RLS changes, infra)
- Anything touching customer PII or regulated data
- Contracts, legal commitments, or policy changes
- Financial commitments or external communications representing FlashFusion
- Security incident response actions

## 5. Memory & retention

- Memory is enabled/disabled by role per policy. Users must not store Restricted
  data in memory.
- See `zdr-retention-reality.md` for what is and is not retained. **Do not represent
  "ZDR" as "nothing is stored"** internally or to customers.

## 6. Compliance

Applicable frameworks `[SOC 2 / HIPAA / GDPR / PCI-DSS — select real ones]` are
mapped to control owners and attestation dates in
`../audit/audit-evidence-template.md`. Naming a framework is not a claim of
compliance; cite only attested controls externally.

## 7. Acceptable / prohibited use

**Acceptable:** drafting, analysis, code assistance, research, summarization within
your role's data tier and entitlements.

**Prohibited:** pasting Restricted data; bypassing RBAC; using output for high-risk
actions without an escalation gate; misrepresenting AI output as human-authored
where disclosure is required; using Claude to process data you are not authorized to
access.

## 8. Incidents

Suspected data exposure, prompt-injection, or misuse → report to `[InfoSec contact]`
immediately. See `../rollout/rollout-plan.md` Rollback for containment.

## 9. Acknowledgment

| Name | Role | Date | Acknowledged |
|------|------|------|--------------|
| | | | |
