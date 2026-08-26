# Webhook Security

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Requirements

- HMAC SHA-256 signature header.
- Timestamp header with 5-minute replay window.
- Constant-time signature comparison.
- Idempotency key for state-changing events.
- Audit event for accepted and rejected webhook attempts.

Use `backend/src/webhooks.ts` as the reference implementation.
