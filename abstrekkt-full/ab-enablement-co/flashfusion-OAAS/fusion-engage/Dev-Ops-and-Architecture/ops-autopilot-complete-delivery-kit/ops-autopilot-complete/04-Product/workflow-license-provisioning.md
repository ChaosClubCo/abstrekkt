# Workflow: Software License Provisioning

> **Audience:** ENG | **Phase:** Beta (Week 5–8) | **Effort:** 2 days

## Steps
| # | Step | Connector | Action | Approval |
|---|------|-----------|--------|----------|
| 1 | Validate software | Internal | Check if software is in approved catalog | None |
| 2 | Manager approval | N/A | Approve license request | Manager (+ Finance if >$500) |
| 3 | Check availability | Internal | Query license pool for available seats | None |
| 4 | Create account | Okta/Custom | Assign app in Okta or create vendor account | None |
| 5 | Assign license | Okta | assign_app with license tier | None |
| 6 | Send credentials | Slack/Email | Secure DM with login instructions | None |
| 7 | Update finance | Email/API | Notify finance of license allocation + cost | None |

## Auto-Approve Logic
- Software in approved catalog AND cost <$50/mo AND manager pre-authorized → auto_approve
- Software not in catalog OR cost >$500 → require Finance approval
- Default: require manager approval
