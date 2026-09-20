# Workflow: Employee Onboarding

> **Audience:** ENG | **Phase:** MVP (Week 4) | **Effort:** 3 days

---

## Overview
Full employee provisioning: Azure AD account, Okta apps, Slack/Teams, hardware request, manager notification. Reduces 2–3 day process to <30 minutes.

## Trigger
Manager submits onboarding request via Teams adaptive card (employee name, department, role, start date, manager).

## Steps

| # | Step | Connector | Action | Approval | Timeout |
|---|------|-----------|--------|----------|---------|
| 1 | Create Azure AD user | Azure AD | create_user (name, email, department, title) | Manager + HR | 10s |
| 2 | Configure email | Azure AD | Assign Exchange license, create mailbox | None | 15s |
| 3 | Assign Okta apps | Okta | assign_app for department-standard apps | None | 10s |
| 4 | Request hardware | Jira | Create IT ticket for laptop/equipment provisioning | None | 5s |
| 5 | Add to Slack | Slack | Invite to workspace, add to department channels | None | 5s |
| 6 | Add to Teams | Teams | Add to department team, relevant channels | None | 5s |
| 7 | Notify manager | Slack/Email | Send confirmation with all provisioned accounts/links | None | 5s |

## Acceptance Criteria

```gherkin
Scenario: Full onboarding
  Given manager submits onboarding for "Jane Doe, Engineering, Software Engineer"
  When manager and HR both approve
  Then Azure AD user is created with correct department and title
  And Exchange mailbox is provisioned
  And Okta apps (GitHub, Jira, Slack) are assigned
  And hardware request Jira ticket is created
  And Slack workspace invitation is sent
  And Teams membership is configured
  And manager receives summary email
  And total time <30 minutes (including approval wait)

Scenario: HR denies onboarding
  Given manager approves but HR denies
  Then no accounts are created
  And manager is notified of denial with reason

Scenario: 5 parallel onboardings
  Given 5 onboarding requests submitted simultaneously
  Then all 5 complete without race conditions
  And no duplicate Azure AD users created
```

## Idempotency
Before `create_user`: check `GET /users?$filter=mail eq '{email}'`. If exists, skip creation and continue with existing user ID.

## Rollback
If any step after user creation fails, the partially-provisioned state is documented in the run record. IT admin can manually complete remaining steps or trigger a re-run (idempotent — skips completed steps).
