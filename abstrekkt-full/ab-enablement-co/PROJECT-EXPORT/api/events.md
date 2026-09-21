# Event Model

`source.ingested`, `graph.extracted`, `decision.detected`, `conflict.detected`, `gap.detected`, `artifact.generated`, `validation.completed`, and `export.created` use a shared envelope with `id`, `type`, `tenantId`, `projectId`, `occurredAt`, `idempotencyKey`, and `payload`.
