# Workflow: Security Incident Response

> **Audience:** ENG | **Phase:** Open Beta (Week 9–12) | **Effort:** 3 days

## Trigger
Webhook from SIEM/MDR, manual trigger from security team, or automated phishing detection.

## Steps
| # | Step | Connector | Action | Approval |
|---|------|-----------|--------|----------|
| 1 | Classify incident | Internal | Parse SIEM payload, determine type (phishing, malware, unauthorized access) | None |
| 2 | Containment (auto) | Azure AD/Okta | Disable affected user, revoke sessions | None (auto for containment) |
| 3 | Quarantine device | Custom/MDR | Isolate endpoint from network | None |
| 4 | Notify security team | Slack | Alert #security channel with incident details | None |
| 5 | Create incident ticket | Jira | Create SEV-1 ticket with timeline, affected assets | None |
| 6 | Forensics collection | Internal | Snapshot audit logs, login history, access patterns | Security Officer |
| 7 | Notify affected users | Email | Inform users whose data may have been compromised | Security Officer |
| 8 | Post-incident review | Jira | Create follow-up ticket for post-mortem | None |

## Key Design: Containment Is Automatic
Steps 1–4 execute without approval to minimize damage window. Forensics and communication require Security Officer approval to ensure proper handling.
