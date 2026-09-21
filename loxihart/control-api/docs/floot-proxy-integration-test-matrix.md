# Floot Loxihart Proxy Integration-Test Matrix

## Purpose

This is the release gate for any Floot server-side proxy placed in front of the deployed Loxihart Control API. The proxy is transport only. It may not reinterpret canonical state, verdicts, hashes, receipts, signatures, or version semantics.

## Core invariant

If the upstream Control API returned a valid HTTP response, the Floot proxy MUST preserve the upstream HTTP status and JSON body exactly. The proxy may generate `502 CONTROL_API_UNREACHABLE` only when no upstream HTTP response is received because of a network/transport failure, and `504 CONTROL_API_TIMEOUT` only when the proxy timeout fires before a response is received.

The proxy MUST NOT automatically retry canonical mutations.

## Mandatory matrix

| ID | Scenario | Upstream | Proxy expected | Body rule | Retry |
|---|---|---|---|---|---|
| PX-403-01 | Identity rejected | 403 `UNAUTHORIZED` | 403 | exact JSON | never |
| PX-404-01 | Pilot missing | 404 `NOT_FOUND` | 404 | exact JSON | never |
| PX-404-02 | Receipt missing | 404 `RECEIPT_NOT_FOUND` | 404 | exact JSON | never |
| PX-409-01 | Stale control version | 409 `STALE_VERSION` | 409 | exact JSON incl. `currentVersion` | never |
| PX-409-02 | Duplicate mutation | 409 `DUPLICATE_MUTATION` | 409 | exact JSON | never |
| PX-422-01 | Invalid lifecycle transition | 422 `INVALID_TRANSITION` | 422 | exact JSON | never |
| PX-422-02 | Invalid input | 422 `VALIDATION_ERROR` | 422 | exact JSON | never |
| PX-500-01 | Persistence integrity failure | 500 `PERSISTENCE_INTEGRITY` | 500 | exact JSON | never |
| PX-500-02 | Receipt/integrity failure | 500 `INTEGRITY_ERROR` | 500 | exact JSON | never |
| PX-502-01 | DNS/connect/TLS failure before response | no HTTP response | 502 | proxy-generated canonical body | never |
| PX-502-02 | Connection reset before response | no HTTP response | 502 | proxy-generated canonical body | never |
| PX-504-01 | Upstream exceeds timeout | no completed response | 504 | proxy-generated canonical body | never |
| PX-504-02 | Mutation times out after send | ambiguous commit | 504 | proxy-generated canonical body | never |
| PX-NET-01 | Slow upstream 500 arrives before timeout | real 500 | 500 | exact JSON | never |
| PX-NET-02 | Any real 403/404/409/422/500 | real response | same status | exact JSON | never |
| PX-HDR-01 | Browser attempts authority-header injection | n/a | upstream gets server-owned identity only | browser values ignored/rejected | n/a |
| PX-HDR-02 | Upstream JSON content type | real response | preserve JSON content type | no rewriting | n/a |

## Exact bodies

### 403

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid demo identity."
  }
}
```

### 404 pilot

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Pilot not found."
  }
}
```

### 404 receipt

```json
{
  "error": {
    "code": "RECEIPT_NOT_FOUND",
    "message": "Receipt not found."
  }
}
```

### 409 stale version

```json
{
  "error": {
    "code": "STALE_VERSION",
    "message": "expectedVersion 3 does not match current version 4.",
    "currentVersion": 4
  }
}
```

### 409 duplicate mutation

```json
{
  "error": {
    "code": "DUPLICATE_MUTATION",
    "message": "Mutation already exists."
  }
}
```

### 422 invalid transition

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "sop.approve requires CURRENT_WORKFLOW_APPROVED; current stage is DISCOVERY_ACTIVE."
  }
}
```

### 422 validation

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "expectedVersion must be a non-negative integer."
  }
}
```

### 500 persistence

```json
{
  "error": {
    "code": "PERSISTENCE_INTEGRITY",
    "message": "Canonical chain is invalid."
  }
}
```

### 500 integrity

```json
{
  "error": {
    "code": "INTEGRITY_ERROR",
    "message": "New receipt failed verification: signature_invalid"
  }
}
```

### 502 network failure

```json
{
  "error": {
    "code": "CONTROL_API_UNREACHABLE",
    "message": "The Loxihart Control API could not be reached."
  }
}
```

### 504 timeout

```json
{
  "error": {
    "code": "CONTROL_API_TIMEOUT",
    "message": "The Loxihart Control API did not respond before the proxy timeout."
  }
}
```

## Required assertions

For preserved upstream responses (`403`, `404`, `409`, `422`, `500`):

1. `proxyResponse.status === upstreamResponse.status`.
2. Parsed JSON deep-equals upstream JSON.
3. Raw response text equals upstream response text where the proxy forwards raw text.
4. `currentVersion` survives `STALE_VERSION` unchanged.
5. Upstream mutation call count is exactly `1`.
6. No response is converted to `200`, `502`, or `504`.

For network failures:

1. A thrown fetch/connection failure before any upstream HTTP response yields `502`.
2. Response body is exactly `CONTROL_API_UNREACHABLE`.
3. Mutation call count remains exactly `1`.

For timeout:

1. Abort/timeout before an upstream response yields `504`.
2. Response body is exactly `CONTROL_API_TIMEOUT`.
3. Mutation call count remains exactly `1`.
4. No automatic retry is permitted because commit state is ambiguous.

For headers:

1. Browser-supplied `X-Loxihart-Demo-Token`, `X-Loxihart-Organization`, or `X-Loxihart-Actor` MUST NOT become authoritative upstream headers.
2. The Floot backend injects server-owned identity values.
3. Secrets/tokens are never logged.

## Release aggregation

FAIL if any mandatory status/body preservation test fails.

FAIL if `502` is generated for any real upstream HTTP response.

FAIL if `504` is generated when a real upstream response arrived before the timeout fired.

FAIL if any canonical mutation is automatically retried.

FAIL if browser authority headers can override the server-owned upstream identity.

PASS only when all mandatory cases pass.

## Trust boundary

Floot may transport an action. Floot may not decide whether the action is canonical.

The Loxihart Control API remains the sole authority for canonical progress, expected-version enforcement, transition validity, evidence, PASS/FAIL/INCONCLUSIVE, receipt identity, authoritative hashes, Ed25519 signing, receipt verification, and canonical history.
