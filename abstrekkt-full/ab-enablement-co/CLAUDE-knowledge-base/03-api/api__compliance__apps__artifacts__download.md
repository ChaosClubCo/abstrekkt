---
title: "Download artifact content"
source: "https://platform.claude.com/docs/en/api/compliance/apps/artifacts/download.md"
crawled: "2026-06-07"
content_hash: "sha256:a40df7ffba80c819b655b6777c4b3ba379fd20f1ccf9ba72b6926ae9bc2e6119"
category: "api"
audience: "developer"
deprecated: false
---

## Download artifact content

**get** `/v1/compliance/apps/artifacts/{artifact_version_id}/content`

Download the content of an artifact version for compliance purposes.

Returns the full text content of the artifact version.

### Path Parameters

- `artifact_version_id: string`

  The artifact version ID (tagged ID, e.g., claude_artifact_version_abc123)

### Header Parameters

- `"x-api-key": optional string`

### Example

```http
curl https://api.anthropic.com/v1/compliance/apps/artifacts/$ARTIFACT_VERSION_ID/content \
    -H "Authorization: Bearer $ANTHROPIC_COMPLIANCE_API_KEY"
```
