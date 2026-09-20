---
title: "Delete a Message Batch (cli)"
source: "https://platform.claude.com/docs/en/api/cli/messages/batches/delete.md"
crawled: "2026-06-07"
content_hash: "sha256:a6e16149bdb8b690ad831b9f6c04b38fed9cc634720481a963df33b4290b6b8d"
category: "api"
audience: "developer"
deprecated: false
---

## Delete a Message Batch

`$ ant messages:batches delete`

**delete** `/v1/messages/batches/{message_batch_id}`

Delete a Message Batch.

Message Batches can only be deleted once they've finished processing. If you'd like to delete an in-progress batch, you must first cancel it.

Learn more about the Message Batches API in our [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)

### Parameters

- `--message-batch-id: string`

  ID of the Message Batch.

### Returns

- `deleted_message_batch: object { id, type }`

  - `id: string`

    ID of the Message Batch.

  - `type: "message_batch_deleted"`

    Deleted object type.

    For Message Batches, this is always `"message_batch_deleted"`.

### Example

```cli
ant messages:batches delete \
  --api-key my-anthropic-api-key \
  --message-batch-id message_batch_id
```

#### Response

```json
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch_deleted"
}
```
