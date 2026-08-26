---
title: "Delete Session (Beta) (cli)"
source: "https://platform.claude.com/docs/en/api/cli/beta/sessions/delete.md"
crawled: "2026-06-07"
content_hash: "sha256:cad83dec21a763134c6ad7d6b71b1b52fe3afeff49b8ce37f5ba76a46b33e528"
category: "api"
audience: "developer"
deprecated: false
---

## Delete Session

`$ ant beta:sessions delete`

**delete** `/v1/sessions/{session_id}`

Delete Session

### Parameters

- `--session-id: string`

  Path parameter session_id

- `--beta: optional array of AnthropicBeta`

  Optional header to specify the beta version(s) you want to use.

### Returns

- `beta_managed_agents_deleted_session: object { id, type }`

  Confirmation that a `session` has been permanently deleted.

  - `id: string`

  - `type: "session_deleted"`

    - `"session_deleted"`

### Example

```cli
ant beta:sessions delete \
  --api-key my-anthropic-api-key \
  --session-id sesn_011CZkZAtmR3yMPDzynEDxu7
```

#### Response

```json
{
  "id": "sesn_011CZkZAtmR3yMPDzynEDxu7",
  "type": "session_deleted"
}
```
