# BRAND_CONFIG

This repository's active deliverables have been **genericized into templates**. All
client-specific values are replaced with `{{DOUBLE_BRACE}}` placeholders. This file is the
single source of truth that maps each placeholder to the original engagement value, so the
template can be re-instantiated for any client (or reverted).

> **To instantiate for a client:** search-and-replace each `{{PLACEHOLDER}}` below with the
> client's value across the active deliverables.
> **To reproduce the original INT Inc deployment:** replace each placeholder with the
> "Original value" column.

## Placeholder map

| Placeholder | Original value (INT Inc engagement) | Notes |
|---|---|---|
| `{{COMPANY_NAME}}` | INT Inc | Also appeared in prose as "Intinc" |
| `{{COMPANY_LEGAL_NAME}}` | INT Business Solutions | Registered/legal entity name |
| `{{COMPANY_DOMAIN}}` | intinc.com | Public website domain (also appeared capitalized as "Intinc.com") |
| `{{COMPANY_SLUG}}` | intinc | Lowercase identifier — SSO/IdP group names (`intinc-*`), GitHub org |
| `{{HQ_ADDRESS}}` | 251 Milwaukee Ave, Suite 200, Buffalo Grove, Illinois 60089 | Full HQ address |
| `{{HQ_CITY}}` | Buffalo Grove | ⚠️ Source docs were inconsistent — implementation guide said "Lincolnshire, IL"; both mapped to this placeholder |
| `{{HQ_STATE}}` | IL | Spelled "Illinois" in the full address |
| `{{FOUNDED_YEAR}}` | 1999 | |
| `{{INDUSTRY}}` | B2B Business Solutions, IT Services, Technical Consulting | |
| `{{COMPANY_STATUS}}` | Women-owned, diverse, remote-first | Also phrased "Women-owned business, DEI commitment" |
| `{{EMPLOYEE_COUNT}}` | 41 | FTE headcount; drives seat/training/adoption figures |
| `{{ANNUAL_REVENUE}}` | $7.1M | Private, approximate |
| `{{DEPARTMENT_COUNT}}` | 7 | Sales, Delivery, Engineering, Marketing, Ops, Finance, Executive |
| `{{DEPLOYMENT_OWNER}}` | Kyle | Named deployment/technical lead (full name in source: "Kyle Stabenow") |
| `{{DEPLOYMENT_OWNER_ROLE}}` | Chief Technology Officer (CTO) | System-prompt "Owner" field |
| `{{DEPLOYMENT_OWNER_EMAIL}}` | kyle@intinc.com | Owner contact in deployment/validation guides |
| `{{CEO_NAME}}` | Diane Weigle | Leadership PII (implementation guide org chart) |
| `{{PRESIDENT_NAME}}` | Dave Linderman | Leadership PII |
| `{{VP_FINANCE_NAME}}` | Stacy Mueller | Leadership PII |
| `{{VP_CLIENT_SERVICES_NAME}}` | Shari Aronson | Leadership PII |
| `{{LEADER_NAME}}` | Claudia Hicks | Leadership PII ("+ others") |

> **Note:** A few placeholders above (`{{COMPANY_LEGAL_NAME}}`, `{{HQ_ADDRESS}}`, `{{INDUSTRY}}`,
> `{{FOUNDED_YEAR}}`) do not currently appear in the active deliverables — those exact values lived
> only in the out-of-scope `CLARIFIERS*` history. They are retained here as the complete brand vocabulary.

## Scope of the rebrand

**Genericized (active deliverables, 9 files):**
- `intinc-role-taxonomy-v3.1-FINAL.html`
- `INT_INC_CLAUDE_TAXONOMY_v4.2_COMPREHENSIVE_FINAL.md`
- `INT_INC_ENTERPRISE_CLAUDE_PROFILE_BUILDER_v1.0.md`
- `CLAUDE_ROLE_TAXONOMY_GUIDE.md`
- `INTINC_DEPLOYMENT_GUIDE_v2.2.md`
- `INTINC_IMPLEMENTATION_GUIDE.md`
- `INT_INC_CLAUDE_RED_TEAM_PLAYBOOK_v1.0.md`
- `AUDITING_FRAMEWORKS_UNKNOWN_UNKNOWNS_INT_AUDIT_PLAN.md`
- `INTINC_TEST_VALIDATION_GUIDE_v3.1.md`

**Intentionally left as-is:**
- **Filenames** — kept with `INT_INC_*` / `intinc-*` / `INTINC_*` prefixes (contents-only rebrand).
  The case-sensitive replace deliberately ignores these filename tokens.
- **Version snapshots** — `*v2.x*`, `*v3.0*`, `*v4.0*`, `*v4.1*` files are frozen historical records.
- **Decision history** — `CLARIFIERS.md`, `CLARIFIERS_1_3_RESOLVED.md`,
  `CLARIFIERS_5_GROUND_v3.1_IN_BEST_PRACTICES.md` preserve the original engagement context.

## Rollback

Because every placeholder is a unique 1:1 token, the rebrand is reversible by replacing each
`{{PLACEHOLDER}}` with its "Original value" above. The rebrand was applied in two passes,
`rebrand.ps1` (name/firmographics, case-sensitive) then `rebrand-pass2.ps1` (lowercase
domain/slug, owner email, leadership names, secondary HQ city). Pristine pre-rebrand copies of all
9 files are in `_rebrand_backup/` — the fastest rollback is to restore from there.
