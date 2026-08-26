---
name: postgresql-table-design
description: Design PostgreSQL schemas including table structure, data types, indexing strategies, constraints, normalization, partitioning, and performance optimization patterns. Use when configuring, building, or troubleshooting AI agent workflows.
---

# PostgreSQL Table Design

## Overview

Schema design is the foundation of every PostgreSQL-backed application. Decisions made at the table level ripple outward into query performance, data integrity, storage costs, and long-term maintainability. A well-designed schema encodes business rules directly into the database through constraints and types, prevents entire categories of bugs before application code is ever written, and allows the query planner to produce efficient execution plans without heroic optimization work later.

Poor schema design, by contrast, compounds over time. Missing constraints lead to silent data corruption. Wrong data types waste storage and block index usage. Absent or excessive indexes degrade write and read throughput respectively. Correcting these problems in production, under load and with live data, is orders of magnitude harder than getting the design right from the start.

This skill covers the principles, patterns, and concrete techniques needed to design PostgreSQL tables that are correct, performant, and resilient to change.

## When to Use

**Primary triggers:**

- Starting a new service or microservice that requires persistent relational storage.
- Adding tables or columns to an existing PostgreSQL database.
- Investigating slow queries that may stem from schema-level issues.
- Reviewing a migration or pull request that modifies database structure.
- Planning a data model for an AI agent's memory, configuration, or task store.

**Specific use cases:**

- Designing a multi-tenant SaaS schema with row-level security.
- Modeling hierarchical data (org charts, category trees, threaded comments).
- Creating audit or event log tables that must handle high write volume.
- Building a vector-search table for AI embeddings alongside relational columns.
- Setting up time-series or append-only tables that will be partitioned by date.
- Defining junction tables for many-to-many relationships with additional attributes.

## Core Processes

### 1. Schema Design Principles

Start every design by identifying entities and their relationships before thinking about columns. Follow these guiding principles:

- **Normalize first, denormalize deliberately.** Begin at third normal form (3NF). Every non-key column should depend on the key, the whole key, and nothing but the key. Only denormalize when you have measured evidence that join performance is a bottleneck, and document the trade-off.
- **Use natural keys when stable, surrogate keys when not.** A two-letter ISO country code is a fine natural primary key. A user-chosen username is not, because it may change. When in doubt, use a surrogate key and enforce uniqueness on the natural candidate with a `UNIQUE` constraint.
- **Prefer `bigint` or `uuid` for surrogate keys.** Sequential `bigint` keys are smaller (8 bytes), faster to index, and friendlier to range scans. UUIDs (16 bytes) avoid coordination in distributed systems but fragment B-tree indexes. Use `gen_random_uuid()` (v4) or `uuid_generate_v7()` (time-ordered, requires the `pg_uuidv7` extension) depending on your access patterns.
- **One schema per bounded context.** Use PostgreSQL schemas (`CREATE SCHEMA`) to namespace tables by domain. This improves discoverability, simplifies `search_path` management, and lays groundwork for future extraction into separate databases.

```sql
CREATE SCHEMA IF NOT EXISTS agents;
CREATE SCHEMA IF NOT EXISTS workflows;
```

### 2. Data Type Selection

Choosing the right data type prevents silent truncation, enables operator and index support, and communicates intent to other developers.

| Category | Recommended Type | Avoid | Rationale |
|---|---|---|---|
| Identifiers | `bigint` / `uuid` | `serial` (prefer `GENERATED ALWAYS AS IDENTITY`) | `serial` creates an implicit sequence with loose ownership; identity columns are SQL-standard and safer. |
| Text | `text` with `CHECK` | `varchar(n)` for arbitrary limits | `varchar(255)` is a carry-over from MySQL. In PostgreSQL, `text` and `varchar` have identical performance. Use a `CHECK` constraint when a real business rule limits length. |
| Money | `numeric(precision, scale)` | `float`, `double precision`, `money` | Floating-point types introduce rounding errors. The `money` type is locale-dependent and hard to work with. |
| Timestamps | `timestamptz` | `timestamp` (without time zone) | Without a time zone, PostgreSQL stores the literal value with no conversion, leading to ambiguity when servers or clients change zones. |
| Booleans | `boolean` | `smallint`, `char(1)` | Use native boolean. Avoid encoding true/false as 0/1 or 'Y'/'N'. |
| JSON data | `jsonb` | `json`, `text` | `jsonb` is parsed on write, enabling indexing and efficient operators. `json` stores raw text and must be re-parsed on every access. |
| Enumerations | `text` with `CHECK` or lookup table | `enum` type | PostgreSQL enums cannot have values removed, making schema evolution painful. A `CHECK` constraint or a foreign key to a reference table is more flexible. |
| IP addresses | `inet` / `cidr` | `text` | Native types support containment and subnet operators and are stored more compactly. |

```sql
CREATE TABLE agents.tasks (
    task_id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    agent_id        uuid        NOT NULL,
    title           text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 500),
    status          text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    priority        smallint    NOT NULL DEFAULT 0 CHECK (priority BETWEEN 0 AND 9),
    payload         jsonb       NOT NULL DEFAULT '{}',
    created_at      timestamptz NOT NULL DEFAULT now(),
    started_at      timestamptz,
    completed_at    timestamptz,
    CONSTRAINT tasks_started_before_completed
        CHECK (started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at)
);
```

### 3. Indexing Strategies

Indexes accelerate reads but slow down writes and consume storage. Every index should be justified by a query pattern.

**B-tree (default):** Supports equality and range queries. Best for high-cardinality columns used in `WHERE`, `ORDER BY`, and `JOIN` conditions.

```sql
-- Composite index for a common query pattern: find pending tasks for a specific agent
CREATE INDEX idx_tasks_agent_status ON agents.tasks (agent_id, status)
    WHERE status IN ('pending', 'running');
```

**Partial indexes:** Include only rows matching a `WHERE` clause. Dramatically smaller and faster when queries always filter on the same condition.

**GIN (Generalized Inverted Index):** Required for `jsonb` containment (`@>`), full-text search (`tsvector`), and array overlap operators.

```sql
-- Index for querying inside JSONB payloads
CREATE INDEX idx_tasks_payload ON agents.tasks USING gin (payload jsonb_path_ops);
```

**GiST:** Used for geometric types, range types, and full-text search (when combined with ranking).

**BRIN (Block Range Index):** Extremely compact index for physically ordered data such as append-only tables with a `created_at` column.

```sql
-- BRIN index on a time-series table where rows are inserted in chronological order
CREATE INDEX idx_events_created_brin ON agents.events USING brin (created_at)
    WITH (pages_per_range = 32);
```

**Covering indexes (INCLUDE):** Store additional columns in the index leaf pages to enable index-only scans without visiting the heap.

```sql
CREATE INDEX idx_tasks_status_covering ON agents.tasks (status)
    INCLUDE (title, created_at);
```

**Key rules of thumb:**

- Index columns that appear in `WHERE`, `JOIN ON`, and `ORDER BY` clauses.
- Put the most selective column first in a composite index.
- Monitor unused indexes with `pg_stat_user_indexes` and drop them.
- Rebuild bloated indexes periodically with `REINDEX CONCURRENTLY`.

### 4. Constraint Patterns

Constraints are executable documentation. They guarantee data integrity at the database level regardless of which application or script writes data.

**Primary keys:** Every table must have a primary key. It uniquely identifies rows and creates an implicit unique B-tree index.

**Foreign keys:** Enforce referential integrity between related tables. Always specify `ON DELETE` and `ON UPDATE` behavior explicitly.

```sql
ALTER TABLE agents.tasks
    ADD CONSTRAINT fk_tasks_agent
    FOREIGN KEY (agent_id) REFERENCES agents.agents (agent_id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT;
```

**Unique constraints:** Enforce business-level uniqueness. Use partial unique indexes when uniqueness applies only to a subset of rows.

```sql
-- Only one running task per agent at a time
CREATE UNIQUE INDEX uq_tasks_one_running_per_agent
    ON agents.tasks (agent_id)
    WHERE status = 'running';
```

**Check constraints:** Validate column values against business rules. They are evaluated on insert and update.

**Exclusion constraints:** Prevent overlapping ranges. Useful for scheduling, booking, and time-range data.

```sql
CREATE TABLE agents.schedules (
    schedule_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    agent_id    uuid NOT NULL,
    active_range tstzrange NOT NULL,
    CONSTRAINT no_overlapping_schedules
        EXCLUDE USING gist (agent_id WITH =, active_range WITH &&)
);
```

**NOT NULL:** Default to `NOT NULL` for every column and only relax it when you have an explicit reason for allowing nulls. Nulls complicate query logic, break equality comparisons, and add storage overhead.

### 5. Partitioning and Performance

Partitioning splits a large logical table into smaller physical tables. PostgreSQL supports declarative partitioning by range, list, or hash.

**When to partition:**

- Tables exceeding tens of millions of rows where queries consistently filter on the partition key.
- Time-series or event log tables where old data is archived or dropped by detaching partitions.
- Multi-tenant tables where each tenant's data can be isolated by list partitioning.

```sql
-- Range partitioning by month for an event log
CREATE TABLE agents.events (
    event_id    bigint GENERATED ALWAYS AS IDENTITY,
    agent_id    uuid        NOT NULL,
    event_type  text        NOT NULL,
    payload     jsonb       NOT NULL DEFAULT '{}',
    created_at  timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

CREATE TABLE agents.events_2025_01 PARTITION OF agents.events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE agents.events_2025_02 PARTITION OF agents.events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

**Performance considerations beyond partitioning:**

- **FILLFACTOR:** Lower the fill factor on tables with heavy `UPDATE` workloads to leave room for heap-only tuple (HOT) updates, reducing index maintenance.
- **TOAST tuning:** Large `jsonb` or `text` values are compressed and stored out-of-line automatically. Be aware of TOAST table bloat during `VACUUM`.
- **Connection pooling:** Use PgBouncer or Supavisor in front of PostgreSQL to avoid connection exhaustion, especially from AI agent workloads that may spin up many concurrent tasks.
- **Autovacuum tuning:** For high-churn tables, lower `autovacuum_vacuum_scale_factor` and `autovacuum_analyze_scale_factor` per-table so dead tuples are reclaimed promptly.

```sql
ALTER TABLE agents.tasks SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_analyze_scale_factor = 0.005
);
```

## Tools and Templates

| Tool | Purpose | Key Strength |
|---|---|---|
| **pgAdmin 4** | GUI administration and query tool | Visual ERD generation, maintenance dashboards |
| **DBeaver** | Cross-platform database IDE | Schema comparison, data migration wizards |
| **DataGrip** | JetBrains database IDE | Intelligent code completion, refactoring support |
| **pg_stat_statements** | Query performance tracking extension | Identifies slow queries and missing indexes |
| **pgHero** | Performance dashboard | One-click index suggestions, bloat detection |
| **pg_partman** | Partition management extension | Automates creation and maintenance of time-based partitions |

**Starter template for an AI agent task table:**

```sql
-- Complete table creation with all recommended patterns
BEGIN;

CREATE SCHEMA IF NOT EXISTS agents;

CREATE TABLE agents.agents (
    agent_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
    config      jsonb NOT NULL DEFAULT '{}',
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE agents.tasks (
    task_id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    agent_id        uuid NOT NULL REFERENCES agents.agents (agent_id) ON DELETE CASCADE,
    title           text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 500),
    status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    priority        smallint NOT NULL DEFAULT 0 CHECK (priority BETWEEN 0 AND 9),
    payload         jsonb NOT NULL DEFAULT '{}',
    result          jsonb,
    error_message   text,
    retry_count     smallint NOT NULL DEFAULT 0,
    max_retries     smallint NOT NULL DEFAULT 3,
    created_at      timestamptz NOT NULL DEFAULT now(),
    started_at      timestamptz,
    completed_at    timestamptz,
    CONSTRAINT tasks_retry_limit CHECK (retry_count <= max_retries),
    CONSTRAINT tasks_timeline CHECK (
        started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at
    )
);

-- Indexes aligned with expected query patterns
CREATE INDEX idx_tasks_agent_status ON agents.tasks (agent_id, status);
CREATE INDEX idx_tasks_pending ON agents.tasks (created_at)
    WHERE status = 'pending';
CREATE INDEX idx_tasks_payload ON agents.tasks USING gin (payload jsonb_path_ops);

-- Trigger to auto-update the updated_at column
CREATE OR REPLACE FUNCTION agents.set_updated_at()
    RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agents_updated_at
    BEFORE UPDATE ON agents.agents
    FOR EACH ROW EXECUTE FUNCTION agents.set_updated_at();

COMMIT;
```

## Common Pitfalls

| Problem | Symptom | Prevention |
|---|---|---|
| **Using `timestamp` instead of `timestamptz`** | Times shift unpredictably when the server timezone changes or clients connect from different zones. | Always use `timestamptz`. Set the session timezone explicitly in application connection strings. |
| **Over-indexing** | Write throughput degrades; `pg_stat_user_indexes` shows indexes with zero scans. | Audit indexes quarterly. Only create indexes backed by a known query pattern. Use `pg_stat_user_indexes.idx_scan` to identify unused indexes. |
| **Missing foreign key indexes** | `DELETE` on a parent table locks and sequentially scans the child table to check references. | Create an index on every foreign key column in the referencing (child) table. PostgreSQL does not do this automatically. |
| **Storing enumerations as PostgreSQL `enum` types** | Adding a value requires `ALTER TYPE ... ADD VALUE`, which cannot run inside a transaction in older versions. Removing a value is not supported at all. | Use a `text` column with a `CHECK` constraint, or a separate reference/lookup table with a foreign key. |
| **Neglecting `NOT NULL` on new columns** | Null values propagate through joins and aggregations, producing unexpected query results and application bugs. | Default every column to `NOT NULL`. Only allow nulls when the business domain explicitly requires the absence of a value, and document why. |

## Integration Points

- **ORM migration tools (Alembic, Prisma Migrate, TypeORM, Knex):** Generate migrations from model definitions but always review the SQL output. ORMs frequently miss partial indexes, exclusion constraints, and storage parameters.
- **CI/CD pipelines:** Run `pg_dump --schema-only` diffs on every pull request to surface unintended schema changes. Tools like `migra` or `pgquarrel` automate schema comparison.
- **Monitoring and observability:** Enable `pg_stat_statements` and route its data to dashboards (Grafana, pgHero). Set alerts on sequential scan ratios and cache hit rates.
- **AI agent frameworks (LangChain, CrewAI, AutoGen):** When agents persist state to PostgreSQL, design the schema to separate agent configuration, conversation history, tool call logs, and task queues into distinct tables with clear foreign key relationships.
- **Vector search (pgvector):** When storing embeddings alongside relational data, add a `vector` column and create an HNSW or IVFFlat index. Keep the embedding dimension consistent and store the model name as metadata for future migration.

```sql
-- Example: adding a vector column for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE agents.tasks ADD COLUMN embedding vector(1536);

CREATE INDEX idx_tasks_embedding ON agents.tasks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
```

- **Backup and disaster recovery:** Use `pg_basebackup` for physical backups and WAL archiving for point-in-time recovery. Test restores regularly. Schema design decisions (such as partitioning) directly affect backup and restore speed.
