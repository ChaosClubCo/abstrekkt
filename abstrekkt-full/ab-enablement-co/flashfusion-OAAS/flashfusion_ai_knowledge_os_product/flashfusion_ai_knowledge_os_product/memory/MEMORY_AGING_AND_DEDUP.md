# Memory Aging and Deduplication

## Aging Signals

- last reviewed date
- source modified date
- conflicting newer source
- low confidence
- low usage
- obsolete project
- superseded prompt
- archived workflow

## Freshness Score

Suggested formula:

```txt
freshness_score =
  source_recency_weight +
  review_recency_weight +
  usage_weight -
  contradiction_penalty -
  supersession_penalty
```

## Deduplication Signals

- same source URI
- high semantic similarity
- same title
- same checksum
- same canonical entity set
- same source record ID
- same prompt body hash

## Dedup Actions

- merge
- mark duplicate
- preserve both with relationship
- supersede
- quarantine
- require human review

## Rule

Never delete potential duplicates automatically without preserving lineage.
