# Security and Privacy Model

## Primary risks

1. Secrets accidentally entering OCR or transcript outputs.
2. Private client data being uploaded into third-party OCR/transcription systems.
3. Agents retrieving unreviewed or low-confidence content as fact.
4. Tool-enabled agents taking destructive actions without approval.
5. Prompt injection embedded in source documents.

## Controls

### Secret scanning

Before ingestion, manually review raw and derived text for API keys, tokens, credentials, OAuth secrets, private URLs, and client passwords. Quarantine any suspicious source.

### Provenance enforcement

No claim becomes canonical unless it has a provenance record.

### Review status

Every concept starts as `draft`. It can only become `canonical` after QA.

### Human approval gates

Require approval for:

- deleting files
- modifying external systems
- sending email
- committing code
- changing database schemas
- updating client-facing documentation
- publishing generated content

### Least privilege

Agents should retrieve only the knowledge required for the task. Do not hand an entire raw corpus to an agent when a scoped concept query is sufficient.

## Agent retrieval rule

Agent answers must include:

- answer
- sources
- confidence
- contradictions or limitations
- whether the answer is fact, inference, or recommendation
