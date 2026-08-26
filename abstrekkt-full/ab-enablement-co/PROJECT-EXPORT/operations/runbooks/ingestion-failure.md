# Runbook: Ingestion Failure

Check job attempts, object storage checksum, parser errors, secret/malware quarantine, then retry with same idempotency key.

## Owner
Assigned domain owner must review before production release.
