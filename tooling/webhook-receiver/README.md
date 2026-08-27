# Abstrekkt Webhook Receiver

Authority domain: Abstrekkt repository tooling  
Base revision: `8875176468c403903b48d02a5c25400c0949d5c6`

This receiver is designed for `.github/workflows/repository-webhooks.yml`.
It verifies the sender's HMAC over the exact raw request bytes before parsing JSON and uses a persistent D1 uniqueness constraint to reject replayed delivery IDs.

## Runtime bindings

- `WEBHOOK_SECRET`: secret value shared only with GitHub Actions secret `ABSTREKKT_WEBHOOK_SECRET`.
- `DB`: Cloudflare D1 binding containing the `deliveries` table from `schema.sql`.

Do not commit either the secret or a bearer/API token.

## Required request contract

- Method: `POST`
- `X-Abstrekkt-Signature-256: sha256=<64 hex chars>`
- `X-Abstrekkt-Delivery: <stable delivery id>`
- Optional `X-Abstrekkt-Event` must match signed `event_name` when supplied.
- Maximum body size: 64 KiB.

The signed JSON must contain `delivery_id` matching `X-Abstrekkt-Delivery`.

## Verification order

1. Reject unsupported method or missing runtime bindings.
2. Validate required headers and body-size boundary.
3. Capture the exact request bytes with `request.arrayBuffer()`.
4. Verify HMAC-SHA256 with Web Crypto.
5. Only after successful verification, parse JSON.
6. Validate delivery/event header consistency.
7. Hash the exact raw body with SHA-256.
8. Atomically `INSERT OR IGNORE` the delivery ID into D1.
9. Return `409` when the delivery ID already exists.
10. Return `2xx` only for an accepted delivery.

## Local tests

Requires Node.js 22+.

```bash
cd tooling/webhook-receiver
npm test
```

The tests cover method rejection, missing configuration, header validation, signature-before-parse ordering, invalid JSON, delivery/event mismatches, successful delivery, replay rejection, and oversized bodies.

## Deployment gate

Do not mark the receiver production-ready until all of these are independently proven against the deployed HTTPS endpoint:

- valid signature accepted;
- invalid signature rejected;
- malformed JSON with invalid signature returns signature rejection, proving raw-body verification precedes parsing;
- first delivery ID accepted;
- same delivery ID replay returns `409`;
- GitHub sender treats the replay response as failure;
- receiver URL and secret are stored in GitHub Actions as `ABSTREKKT_WEBHOOK_URL` and `ABSTREKKT_WEBHOOK_SECRET`;
- no secret value appears in repository content or logs.

This receiver is infrastructure for repository event delivery. It does not change the frozen Abstrekkt Pages release candidate SHA.
