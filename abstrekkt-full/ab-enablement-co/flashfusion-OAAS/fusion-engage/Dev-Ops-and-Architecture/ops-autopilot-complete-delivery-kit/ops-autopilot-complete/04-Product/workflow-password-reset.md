# Workflow: Self-Service Password Reset

> **Audience:** ENG | **Phase:** MVP (Week 4) | **Effort:** 1 day

---

## Overview
Employee resets their own password via Teams/Slack with identity verification. Eliminates helpdesk calls. End-to-end: <2 minutes.

## Trigger
Slack command `/ops-reset-password` or Teams Bot request.

## Steps

| # | Step | Connector | Action | Approval | Timeout |
|---|------|-----------|--------|----------|---------|
| 1 | Verify identity | Internal + SMS | Send OTP via SMS, validate response | None | 60s |
| 2 | Reset password | Azure AD | Generate temp password, force change on next login | None | 10s |
| 3 | Sync MFA | Azure AD/Okta | Reset MFA session, send re-enrollment link | None | 10s |

## Acceptance Criteria

```gherkin
Scenario: Successful password reset
  Given employee requests password reset via Slack
  When they provide correct OTP within 60 seconds
  Then Azure AD password is reset
  And MFA session is cleared
  And employee receives new temp password via secure DM
  And total time <2 minutes

Scenario: Failed OTP verification
  Given employee provides wrong OTP 3 times
  Then the workflow fails
  And employee is directed to contact IT helpdesk
  And a security alert is logged

Scenario: Azure AD unavailable
  Given Azure AD returns 503
  Then retry 3 times with backoff
  And if still failing, notify employee to try again in 30 minutes
```

## Security Notes
- OTP delivered via SMS (not email — email may be compromised if password is)
- Temp password sent via Slack DM (ephemeral message, auto-deletes after 5 min)
- All reset events logged in audit trail
- Rate limit: max 3 resets per user per day
