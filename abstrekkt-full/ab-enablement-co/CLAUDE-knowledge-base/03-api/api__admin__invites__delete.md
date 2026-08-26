---
title: "Delete Invite"
source: "https://platform.claude.com/docs/en/api/admin/invites/delete.md"
crawled: "2026-06-07"
content_hash: "sha256:065d62c067085dac984448e475ba12f480905f45b3fd94bf6a53d1733f4bb8b6"
category: "api"
audience: "developer"
deprecated: false
---

## Delete Invite

**delete** `/v1/organizations/invites/{invite_id}`

Delete Invite

### Path Parameters

- `invite_id: string`

  ID of the Invite.

### Returns

- `id: string`

  ID of the Invite.

- `type: "invite_deleted"`

  Deleted object type.

  For Invites, this is always `"invite_deleted"`.

  - `"invite_deleted"`

### Example

```http
curl https://api.anthropic.com/v1/organizations/invites/$INVITE_ID \
    -X DELETE \
    -H 'anthropic-version: 2023-06-01' \
    -H "X-Api-Key: $ANTHROPIC_ADMIN_API_KEY"
```

#### Response

```json
{
  "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
  "type": "invite_deleted"
}
```
