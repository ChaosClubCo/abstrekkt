---
title: "Delete a memory store (Beta) (php)"
source: "https://platform.claude.com/docs/en/api/php/beta/memory_stores/delete.md"
crawled: "2026-06-07"
content_hash: "sha256:5674e4ae7774542e462d685b70f4524d7da895be6b9c69c3d07620abc67a747f"
category: "api"
audience: "developer"
deprecated: false
---

## Delete a memory store

`$client->beta->memoryStores->delete(string memoryStoreID, ?list<AnthropicBeta> betas): BetaManagedAgentsDeletedMemoryStore`

**delete** `/v1/memory_stores/{memory_store_id}`

Delete a memory store

### Parameters

- `memoryStoreID: string`

- `betas?:optional list<AnthropicBeta>`

  Optional header to specify the beta version(s) you want to use.

### Returns

- `BetaManagedAgentsDeletedMemoryStore`

  - `string id`

    ID of the deleted memory store (a `memstore_...` identifier). The store and all its memories and versions are no longer retrievable.

  - `Type type`

### Example

```php
<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

$client = new Client(apiKey: 'my-anthropic-api-key');

$betaManagedAgentsDeletedMemoryStore = $client->beta->memoryStores->delete(
  'memory_store_id', betas: ['message-batches-2024-09-24']
);

var_dump($betaManagedAgentsDeletedMemoryStore);
```

#### Response

```json
{
  "id": "id",
  "type": "memory_store_deleted"
}
```
