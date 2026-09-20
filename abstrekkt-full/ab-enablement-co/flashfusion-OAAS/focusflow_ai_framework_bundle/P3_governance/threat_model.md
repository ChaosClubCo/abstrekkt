# STRIDE Snapshot
- Spoofing: OAuth + signed webhooks
- Tampering: RLS + least-priv env keys
- Repudiation: request ids + OTEL trace ids
- Information Disclosure: redact logs, encrypt at rest
- Denial of Service: rate limits, 429 with Retry-After
- Elevation of Privilege: server-side entitlement checks
