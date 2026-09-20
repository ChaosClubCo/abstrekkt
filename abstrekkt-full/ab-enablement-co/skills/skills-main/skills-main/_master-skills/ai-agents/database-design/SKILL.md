---
name: database-design
description: Database schema design, normalization, indexing strategies, and query optimization. Use when designing new databases, optimizing existing schemas, planning migrations, implementing data models, or troubleshooting performance issues related to database operations.
---

# Database Design

## Overview

Database design is the foundation upon which applications are built. Decisions made at the schema level ripple through every layer of the application, affecting query performance, data integrity, development velocity, and long-term maintainability. A well-designed database makes complex operations simple; a poorly designed one makes simple operations complex.

This skill covers relational database design principles, normalization strategies, indexing optimization, and modern approaches including document databases and hybrid solutions. It provides frameworks for making decisions about data modeling that balance theoretical correctness with practical performance requirements.

Understanding database design is essential for building applications that scale. The difference between a query that takes 10ms and one that takes 10 seconds is often a missing index or an improperly structured table. This skill helps identify and prevent these issues before they become production problems.

### Why This Matters
- Database schema changes in production are expensive and risky
- Poor indexing strategies can make applications 100x slower than necessary
- Proper normalization prevents data anomalies that corrupt business logic
- Strategic denormalization can improve read performance dramatically

## When to Use

### Primary Triggers
- Designing a new database schema from requirements
- Optimizing slow queries through indexing or restructuring
- Planning database migrations or schema changes
- Evaluating SQL vs NoSQL database selection
- Troubleshooting data integrity issues

### Specific Use Cases
- "Design a database schema for our multi-tenant SaaS application"
- "This query is taking 30 seconds - help me optimize it"
- "Should we normalize this data or denormalize for performance?"
- "Create indexes for our most common query patterns"
- "Migrate from MySQL to PostgreSQL with minimal downtime"

## Core Processes

### 1. Database Selection Framework

**SQL vs NoSQL Decision Matrix**

| Factor | Relational (PostgreSQL/MySQL) | Document (MongoDB) | Key-Value (Redis) |
|--------|------------------------------|--------------------|--------------------|
| Data relationships | Excellent | Requires denormalization | None |
| Schema flexibility | Structured (can use JSONB) | Highly flexible | Schema-less |
| ACID transactions | Full support | Limited | Limited |
| Query complexity | SQL - very powerful | Aggregation pipeline | Simple lookups |
| Horizontal scaling | Challenging | Built-in sharding | Cluster mode |
| Best for | Transactional, complex queries | Flexible documents | Caching, sessions |

**Recommended Database by Use Case**

| Use Case | Primary DB | Supporting DB |
|----------|------------|---------------|
| SaaS Application | PostgreSQL | Redis (cache/sessions) |
| E-commerce | PostgreSQL | Redis + Elasticsearch |
| Content Platform | PostgreSQL | MongoDB (flexible content) |
| Real-time Analytics | ClickHouse | PostgreSQL (transactional) |
| IoT/Time Series | TimescaleDB | Redis (real-time) |
| Session/Cache | Redis | - |

### 2. Schema Design Process

**Step 1: Identify Entities and Relationships**

```
Requirements: "We need to track customers, their orders, and the products in each order"

Entities:
- Customer (id, email, name, created_at)
- Order (id, customer_id, status, total, created_at)
- Product (id, name, price, inventory)
- OrderItem (order_id, product_id, quantity, unit_price)

Relationships:
- Customer 1:N Orders
- Order N:M Products (through OrderItems)
```

**Step 2: Apply Normalization Rules**

| Normal Form | Rule | Example Violation |
|-------------|------|-------------------|
| 1NF | Atomic values, no repeating groups | `tags: "red,blue,green"` |
| 2NF | No partial dependencies | Product name stored in OrderItem |
| 3NF | No transitive dependencies | City stored with customer, not derived from zip |
| BCNF | Every determinant is a candidate key | Rare edge cases |

**Step 3: Create Schema with Constraints**

```sql
-- PostgreSQL schema
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    UNIQUE (order_id, product_id)
);

-- Indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### 3. Indexing Strategies

**Index Types and Use Cases**

| Index Type | Best For | PostgreSQL Syntax |
|------------|----------|-------------------|
| B-tree (default) | Equality, range, sorting | `CREATE INDEX` |
| Hash | Equality only (faster) | `USING hash` |
| GIN | JSONB, arrays, full-text | `USING gin` |
| GiST | Geometric, range types | `USING gist` |
| BRIN | Large, naturally ordered data | `USING brin` |

**Index Design Rules**

```sql
-- 1. Index columns used in WHERE clauses
CREATE INDEX idx_orders_status ON orders(status);

-- 2. Composite indexes for multi-column queries (order matters!)
-- Query: WHERE customer_id = ? AND status = ?
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- 3. Include columns to create covering indexes
-- Query: SELECT id, status, total FROM orders WHERE customer_id = ?
CREATE INDEX idx_orders_customer_covering
    ON orders(customer_id) INCLUDE (status, total);

-- 4. Partial indexes for filtered queries
-- Query: WHERE status = 'pending'
CREATE INDEX idx_orders_pending ON orders(created_at)
    WHERE status = 'pending';

-- 5. JSONB indexing
CREATE INDEX idx_orders_shipping_city ON orders
    USING gin ((shipping_address->'city'));
```

**Query Analysis Process**

```sql
-- 1. Explain the query
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.*, c.name as customer_name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
  AND o.created_at > NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC
LIMIT 20;

-- Look for:
-- - Sequential scans on large tables (need index)
-- - High "rows" estimates vs "actual rows" (statistics stale)
-- - Nested loops with high row counts (need different join)
-- - Sort operations (may need index for ORDER BY)

-- 2. Update statistics if needed
ANALYZE orders;

-- 3. Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE tablename = 'orders'
ORDER BY idx_scan DESC;
```

### 4. Multi-Tenant Data Design

**Tenant Isolation Strategies**

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| Shared tables | tenant_id column | Simple, cost-effective | Risk of data leaks |
| Schema per tenant | Separate schemas | Good isolation | Migration complexity |
| Database per tenant | Separate databases | Complete isolation | High operational cost |

**Row-Level Security Implementation**

```sql
-- Enable RLS on table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation ON orders
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Application sets tenant context
SET app.current_tenant = 'tenant-uuid-here';

-- All queries now automatically filtered
SELECT * FROM orders; -- Only returns current tenant's orders

-- Create tenant-aware indexes
CREATE INDEX idx_orders_tenant_created
    ON orders(tenant_id, created_at DESC);
```

### 5. Migration Strategies

**Safe Migration Patterns**

```sql
-- Pattern 1: Add nullable column, then backfill, then add constraint
-- Step 1: Add column (fast, no lock)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Backfill in batches (no lock, can be slow)
UPDATE users SET phone = 'unknown'
WHERE phone IS NULL AND id IN (
    SELECT id FROM users WHERE phone IS NULL LIMIT 1000
);

-- Step 3: Add constraint after all data migrated
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

-- Pattern 2: Create index concurrently (no table lock)
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone);

-- Pattern 3: Rename with view for zero-downtime
-- Old name: user_email, New name: email
ALTER TABLE users RENAME COLUMN user_email TO email;
CREATE VIEW users_compat AS
    SELECT *, email as user_email FROM users;
```

**Migration Checklist**

- [ ] Test migration on production-size dataset
- [ ] Measure migration duration
- [ ] Plan for rollback
- [ ] Schedule during low-traffic window
- [ ] Monitor database metrics during migration
- [ ] Verify application compatibility

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| pgAdmin | PostgreSQL management | Free | Query editor, visual design |
| DBeaver | Multi-database client | Free | Universal, ERD generation |
| DataGrip | Professional development | $89/yr | Refactoring, intelligent completion |
| Prisma | ORM with migrations | Free | Type-safe, schema first |
| Flyway | Migration management | Free tier | Version control for DB |
| pg_stat_statements | Query analysis | Free (extension) | Query performance stats |

### Schema Documentation Template

```markdown
## Table: orders

### Description
Stores customer orders and their status through fulfillment.

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| customer_id | UUID | NO | - | FK to customers |
| status | VARCHAR(50) | NO | 'pending' | Order status |
| total | DECIMAL(10,2) | NO | 0 | Order total |

### Indexes
| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| idx_orders_customer_id | customer_id | B-tree | Customer order lookup |
| idx_orders_status | status | B-tree | Status filtering |

### Relationships
- `customer_id` -> `customers.id` (N:1)
- `order_items.order_id` -> `id` (1:N)
```

## Metrics & KPIs

### Database Performance Metrics
- **Query Latency**: p50 < 10ms, p99 < 100ms
- **Connection Pool Utilization**: < 80% capacity
- **Cache Hit Ratio**: > 99% for buffer cache
- **Index Usage**: All indexes should have scans > 0
- **Table Bloat**: < 20% dead tuples

### Data Quality Metrics
- **Constraint Violations**: 0 (caught before insert)
- **Orphaned Records**: 0 (proper FK constraints)
- **Duplicate Detection**: Regular audits
- **Null Rate by Column**: Track unexpected nulls

## Common Pitfalls

### 1. Missing Indexes on Foreign Keys
**Problem**: Foreign key columns without indexes cause slow joins and cascading deletes
**Prevention**: Always create indexes on foreign key columns. Check with: `SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;`

### 2. Over-Indexing
**Problem**: Too many indexes slow down writes and waste storage
**Prevention**: Monitor index usage. Remove indexes with zero scans. Consider covering indexes instead of multiple single-column indexes.

### 3. N+1 Query Patterns
**Problem**: ORM generates separate query for each related record
**Prevention**: Use eager loading (`include`/`join`), write explicit joins, or use DataLoader pattern for GraphQL.

### 4. Using TEXT for Everything
**Problem**: No length constraints allow unbounded data growth
**Prevention**: Use appropriate VARCHAR lengths. Add CHECK constraints. Validate at application layer.

## Integration Points

- **API Development**: Database schema informs API resource design
- **Performance Optimization**: Query optimization is key performance lever
- **Cloud Architecture**: Database hosting and scaling decisions
- **DevOps Practices**: Database migrations in CI/CD pipelines
- **Testing Strategies**: Database testing and seeding strategies
- **Supabase Administration**: PostgreSQL-based database management
