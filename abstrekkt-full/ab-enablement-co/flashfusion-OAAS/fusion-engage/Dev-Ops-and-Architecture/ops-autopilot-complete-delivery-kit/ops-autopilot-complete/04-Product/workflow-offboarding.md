# Workflow: Employee Offboarding

> **Audience:** ENG | **Phase:** Beta (Week 5–8) | **Effort:** 3 days

## Overview
Revoke all access, export data, return hardware. 8 steps, manager + security approval.

## Steps
| # | Step | Connector | Action | Approval |
|---|------|-----------|--------|----------|
| 1 | Disable Azure AD | Azure AD | disable_user, revoke sessions | Manager + Security |
| 2 | Revoke Okta apps | Okta | revoke_all_apps, suspend_user | None |
| 3 | Remove Slack | Slack | deactivate_user | None |
| 4 | Remove Teams | Teams | remove_from_all_teams | None |
| 5 | Revoke VPN | FortiNet/custom | revoke_credentials | None |
| 6 | Export data | Azure AD/Email | Export mailbox, OneDrive to manager | None |
| 7 | Hardware return | Jira | Create return ticket, notify employee | None |
| 8 | Notify manager | Email/Slack | Summary of all revocations + data export link | None |

## Key Requirements
- All access revoked within 1 hour of approval
- Data export completed within 24 hours
- Audit trail captures every revocation action
- Manager receives confirmation with checklist of completed items
- Compliance: retain audit records per tier retention policy
