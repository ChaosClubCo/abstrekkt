# Runbook: Azure AD Throttling (429)

> **Severity:** HIGH | **Detection:** Connector returns HTTP 429

## Symptoms
- Step failures with error code `AZURE_AD_429`
- Multiple onboarding workflows stuck at `create_user` step
- Prometheus: `ops_step_error_total{connector_type="azure_ad", error_code="429"}` spiking

## Automated Response
1. Exponential backoff: 2s → 4s → 8s (max 3 retries)
2. After 3 failures: job moves to DLQ
3. Alert fires to on-call + customer IT admin

## Manual Recovery
1. Check customer's Azure AD quota: `GET https://graph.microsoft.com/v1.0/reports/getTeamsUserActivityCounts`
2. Check if other integrations (non-OpsAutopilot) are consuming quota
3. If quota exhausted: reschedule onboarding workflows to off-peak hours
4. If persistent: contact Microsoft support for quota increase
5. Resume DLQ jobs: process manually or re-queue with delay

## Prevention
- Rate limiter in n8n: max 10 user creates per 60 seconds
- Batch onboardings: spread across 30-minute windows
- Monitor `ops_connector_latency_seconds{connector="azure_ad"}` for early warning
- Document customer's Azure AD limits during onboarding

## Resolution Verification
- 10 consecutive Azure AD calls succeed without 429
- DLQ is empty for this customer
- Success rate returns to >99%
