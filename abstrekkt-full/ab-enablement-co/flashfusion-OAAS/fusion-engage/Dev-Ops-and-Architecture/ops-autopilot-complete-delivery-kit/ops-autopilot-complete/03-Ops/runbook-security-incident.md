# Runbook: Security Incident — Compromised n8n Instance

> **Severity:** CRITICAL | **Detection:** Anomaly alert, customer report, or kill-switch trigger

## Immediate Response (0–15 minutes)
1. Activate kill-switch for affected customer (pause all workflows)
2. Page: on-call + VP Engineering + CISO
3. Kill Cloudflare Tunnel for affected instance (sever network link)
4. Revoke all API tokens for affected customer
5. Preserve evidence: snapshot audit log, run/step records, queue state

## Containment (15–30 minutes)
1. Customer: revoke ALL secrets in source systems (Azure AD, Okta, Jira, etc.)
2. Customer: disable compromised service accounts
3. INT: mark all customer secrets as REVOKED in registry
4. INT: verify no cross-tenant impact (RLS test suite)
5. INT: check other customers for similar anomaly patterns

## Investigation (30 min – 4 hours)
1. How did attacker access n8n? (network breach, credential theft, insider)
2. What actions were taken? (audit log: all events for customer in window)
3. What data was accessed? (connector calls, step outputs)
4. What secrets were exposed? (vault contents)
5. Was control plane affected? (RLS integrity, audit chain verification)

## Recovery
1. Customer redeploys clean n8n instance from template
2. Customer registers new secrets (fresh credentials everywhere)
3. INT restores customer configuration from backup
4. Verify: 10 workflow executions succeed with new credentials
5. Resume service, deactivate kill-switch

## Post-Incident
- Post-mortem within 48 hours (blameless, systems-focused)
- Customer notification: what happened, impact, prevention
- Regulatory notification if required (GDPR 72hr)
- Update threat model with new attack vector
