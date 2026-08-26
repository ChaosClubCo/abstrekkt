# ERD

```mermaid
erDiagram
  tenants ||--o{ projects : owns
  users ||--o{ tenant_memberships : joins
  tenants ||--o{ tenant_memberships : has
  projects ||--o{ source_records : contains
  projects ||--o{ graph_nodes : derives
  graph_nodes ||--o{ graph_edges : from
  graph_nodes ||--o{ graph_edges : to
  projects ||--o{ decisions : records
  projects ||--o{ adrs : resolves
  projects ||--o{ gaps : tracks
  projects ||--o{ generated_artifacts : outputs
  projects ||--o{ jobs : runs
```
