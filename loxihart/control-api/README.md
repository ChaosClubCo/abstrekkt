# Loxihart Control API

Server-authoritative API for the Loxihart Pilot Console, backed by Canonical Pilot Kernel v0.3.0.

The deployable source bundle is `bundle.tgz`; `BUNDLE_SHA256` records its exact SHA-256. The bundle contains the Control API source, file-backed demo control store, HTTP routes, and a pinned Canonical Pilot Kernel v0.3.0 package.

## Trust boundary

Workflow/SOP approvals, baseline locking, change approval, and evidence append are typed append-only server events with optimistic `expectedVersion` checks and hash-chain verification. `verification.commit` assembles evaluation input from server-owned state, then commits through the Canonical Pilot Kernel to produce an Ed25519-signed ChangeReceipt. Browser-supplied verdicts, actors, organizations, canonical versions, hashes, and signatures are not authoritative.

## Routes

- `GET /v1/pilots/:pilotId`
- `POST /v1/pilots/:pilotId/workflow/approve`
- `POST /v1/pilots/:pilotId/sop/approve`
- `POST /v1/pilots/:pilotId/baseline/lock`
- `POST /v1/pilots/:pilotId/change/approve`
- `POST /v1/pilots/:pilotId/evidence`
- `POST /v1/pilots/:pilotId/verification/commit`
- `GET /v1/pilots/:pilotId/receipts/:receiptId`
- `POST /v1/pilots/:pilotId/receipts/:receiptId/verify`
- `GET /v1/pilots/:pilotId/stream/head`
- `GET /v1/pilots/:pilotId/stream`

This deployment profile is for the fictional Lakeview HVAC demo. Before a real customer pilot, replace file-backed persistence and demo headers with PostgreSQL-backed stores and authenticated organization/actor identity.
