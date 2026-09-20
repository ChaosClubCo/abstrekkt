# Loxihart Floot Proxy Reference

This package is the transport reference and executable release gate for the future Floot-hosted Loxihart Pilot Console.

## Trust boundary

Floot transports requests. The deployed Loxihart Control API remains authoritative for lifecycle transitions, expected-version checks, evidence, PASS/FAIL/INCONCLUSIVE, hashes, ChangeReceipts, Ed25519 signatures, receipt verification, and canonical history.

## Required Floot shape

Use a same-origin Floot server-side proxy. Do not call the Supabase Control API directly from the browser.

Fixed Floot endpoints:

- `GET /_api/loxihart/health`
- `GET /_api/loxihart/pilot`
- `GET /_api/loxihart/stream?mode=head|history`
- `POST /_api/loxihart/mutate`
- `POST /_api/loxihart/verification`
- `POST /_api/loxihart/receipt`

The Floot backend injects server-owned Loxihart identity headers and forwards responses without rewriting real upstream statuses/bodies.

## Transport rule

If upstream returns an HTTP response, preserve its status and response text. In particular, preserve `403`, `404`, `409`, `422`, and `500` exactly.

Generate `502 CONTROL_API_UNREACHABLE` only when no upstream response exists because the request failed at the network/transport layer.

Generate `504 CONTROL_API_TIMEOUT` only when the proxy timeout aborts before a response is received.

Never automatically retry canonical mutations.

## Test

```bash
npm test
```

The release matrix is documented at:

`../control-api/docs/floot-proxy-integration-test-matrix.md`

## Floot adaptation

When a Floot project slot is available, port `LoxihartUpstream.mjs` into a Floot helper named `helpers/LoxihartUpstream.tsx` and port the tests into `helpers/LoxihartUpstream.spec.tsx` using Jasmine globals. Keep the transport behavior identical.
