---
name: data-modeling
description: name: data-modeling description: ERD design, data dictionaries, schema design, and database modeling best practices. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Data Modeling

---
name: data-modeling
description: ERD design, data dictionaries, schema design, and database modeling best practices
version: 1.0.0
category: data-management
tags: [data-modeling, erd, schema, database, design, architecture]
related_skills: [data-warehousing, data-quality, analytics-engineering]
---

## Overview

Data Modeling encompasses the process of designing database structures that accurately represent business entities, relationships, and constraints. This skill covers creating entity-relationship diagrams (ERDs), data dictionaries, normalization techniques, and both transactional (OLTP) and analytical (OLAP) schema designs.

Effective data modeling is foundational to building reliable, performant, and maintainable data systems. Good models reduce data redundancy, ensure data integrity, and make systems easier to understand and evolve.

### Key Principles

1. **Business First**: Models should reflect business concepts, not implementation
2. **Normalization Balance**: Normalize for integrity, denormalize for performance
3. **Documentation**: Every model needs a data dictionary
4. **Evolution**: Design for change with versioning and migrations
5. **Consistency**: Use naming conventions and standards

## When to Use This Skill

### Appropriate Scenarios

- Designing new database schemas
- Documenting existing data structures
- Planning data warehouse dimensions
- Creating API data contracts
- Database refactoring projects
- Data integration planning
- Performance optimization through restructuring
- Compliance and data governance documentation

### When to Consider Alternatives

- **Schemaless needs**: Consider document databases
- **Rapid prototyping**: Start with simple structures
- **Graph relationships**: Use graph databases
- **Time-series data**: Specialized time-series databases

## Core Processes

### 1. Entity-Relationship Modeling

```sql
-- E-commerce ERD implementation

-- Core Entities
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

    -- Audit fields
    created_by UUID,
    updated_by UUID
);

CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping', 'both')),
    street_line1 VARCHAR(255) NOT NULL,
    street_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Composite unique for default address per type
    UNIQUE (customer_id, address_type, is_default) WHERE is_default = TRUE
);

-- Product catalog with hierarchical categories
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_category_id UUID REFERENCES categories(category_id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    -- Materialized path for efficient hierarchy queries
    path LTREE,
    depth INTEGER GENERATED ALWAYS AS (nlevel(path)) STORED
);

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(category_id),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
    weight_kg DECIMAL(8, 3),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Full-text search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED
);

-- Product variants (size, color, etc.)
CREATE TABLE product_variants (
    variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 10,
    attributes JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,

    -- Prevent duplicate attribute combinations
    UNIQUE (product_id, attributes)
);

-- Orders with proper state management
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (
        subtotal + tax_amount + shipping_amount - discount_amount
    ) STORED,
    currency_code CHAR(3) NOT NULL DEFAULT 'USD',

    -- Shipping info (denormalized for order immutability)
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,

    -- Timestamps
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

    -- Snapshot of product at order time
    product_snapshot JSONB NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_categories_path ON categories USING GIST(path);
```

### 2. Data Dictionary Template

```yaml
# data_dictionary.yaml - Comprehensive data dictionary

database:
  name: ecommerce_production
  version: "2.5.0"
  last_updated: "2024-01-15"
  owner: "Data Engineering Team"
  description: "Primary e-commerce transactional database"

tables:
  customers:
    description: "Customer master data including contact information and status"
    schema: public
    type: transactional
    pii_level: high
    retention_policy: "7 years after last activity"
    data_classification: confidential

    columns:
      customer_id:
        type: UUID
        nullable: false
        primary_key: true
        description: "Unique identifier for customer"
        example: "550e8400-e29b-41d4-a716-446655440000"

      email:
        type: VARCHAR(255)
        nullable: false
        unique: true
        pii: true
        description: "Customer email address, used for login and communication"
        validation: "Valid email format"
        example: "customer@example.com"

      first_name:
        type: VARCHAR(100)
        nullable: false
        pii: true
        description: "Customer first name"
        example: "John"

      last_name:
        type: VARCHAR(100)
        nullable: false
        pii: true
        description: "Customer last name"
        example: "Smith"

      phone:
        type: VARCHAR(20)
        nullable: true
        pii: true
        description: "Customer phone number in E.164 format"
        example: "+1-555-123-4567"

      status:
        type: VARCHAR(20)
        nullable: false
        default: "active"
        description: "Current customer account status"
        allowed_values:
          - value: active
            description: "Customer can make purchases"
          - value: inactive
            description: "Customer opted out or dormant"
          - value: suspended
            description: "Account suspended for policy violation"

      created_at:
        type: TIMESTAMP WITH TIME ZONE
        nullable: false
        default: CURRENT_TIMESTAMP
        description: "Timestamp when customer record was created"

    indexes:
      - name: customers_pkey
        columns: [customer_id]
        type: btree
        unique: true
      - name: customers_email_key
        columns: [email]
        type: btree
        unique: true

    relationships:
      - name: customer_addresses
        type: one_to_many
        target_table: addresses
        foreign_key: customer_id
        on_delete: CASCADE

    business_rules:
      - "Email must be verified before customer can complete purchases"
      - "Inactive customers cannot login but data is retained"
      - "Suspended customers require manual review for reactivation"

  orders:
    description: "Customer orders with complete transaction history"
    schema: public
    type: transactional
    pii_level: medium
    retention_policy: "10 years for financial compliance"
    data_classification: confidential

    columns:
      order_id:
        type: UUID
        nullable: false
        primary_key: true
        description: "Unique order identifier"

      order_number:
        type: VARCHAR(50)
        nullable: false
        unique: true
        description: "Human-readable order number displayed to customers"
        format: "ORD-YYYYMMDD-XXXXX"
        example: "ORD-20240115-A1B2C"

      customer_id:
        type: UUID
        nullable: false
        foreign_key: customers.customer_id
        description: "Reference to customer who placed the order"

      status:
        type: VARCHAR(30)
        nullable: false
        default: pending
        description: "Current order fulfillment status"
        state_machine:
          initial: pending
          transitions:
            pending: [confirmed, cancelled]
            confirmed: [processing, cancelled]
            processing: [shipped, cancelled]
            shipped: [delivered]
            delivered: [refunded]
            cancelled: []
            refunded: []

      total_amount:
        type: DECIMAL(12,2)
        nullable: false
        computed: true
        formula: "subtotal + tax_amount + shipping_amount - discount_amount"
        description: "Final order total after all adjustments"

    business_rules:
      - "Orders cannot be modified after status changes to 'shipped'"
      - "Cancellation requires customer request or admin action"
      - "Refunds only allowed within 30 days of delivery"

glossary:
  SKU:
    definition: "Stock Keeping Unit - unique product identifier for inventory"
    example: "SHIRT-BLU-M-001"

  PII:
    definition: "Personally Identifiable Information"
    handling: "Must be encrypted at rest and masked in non-production"

  OLTP:
    definition: "Online Transaction Processing - optimized for fast writes"
```

### 3. Dimensional Modeling (Star Schema)

```sql
-- Data warehouse star schema for analytics

-- Dimension tables
CREATE TABLE dim_date (
    date_key INTEGER PRIMARY KEY,  -- YYYYMMDD format
    full_date DATE NOT NULL UNIQUE,
    day_of_week SMALLINT NOT NULL,
    day_name VARCHAR(10) NOT NULL,
    day_of_month SMALLINT NOT NULL,
    day_of_year SMALLINT NOT NULL,
    week_of_year SMALLINT NOT NULL,
    month_number SMALLINT NOT NULL,
    month_name VARCHAR(10) NOT NULL,
    quarter SMALLINT NOT NULL,
    year INTEGER NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name VARCHAR(50),
    fiscal_year INTEGER,
    fiscal_quarter SMALLINT
);

CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,  -- Natural key from source
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    customer_segment VARCHAR(50),  -- Derived: VIP, Regular, New
    acquisition_channel VARCHAR(50),
    acquisition_date DATE,
    lifetime_value_tier VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(50),

    -- SCD Type 2 fields
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,

    -- Row versioning
    version INTEGER DEFAULT 1,
    source_system VARCHAR(50),
    etl_batch_id BIGINT
);

CREATE TABLE dim_product (
    product_key SERIAL PRIMARY KEY,
    product_id UUID NOT NULL,
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_level1 VARCHAR(100),
    category_level2 VARCHAR(100),
    category_level3 VARCHAR(100),
    brand VARCHAR(100),
    supplier VARCHAR(100),
    unit_cost DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    margin_percent DECIMAL(5, 2),
    weight_kg DECIMAL(8, 3),
    is_active BOOLEAN,

    -- SCD Type 2
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE
);

CREATE TABLE dim_geography (
    geography_key SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    sub_region VARCHAR(50),
    state_province VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    timezone VARCHAR(50)
);

-- Fact table
CREATE TABLE fact_orders (
    order_key BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL,  -- Degenerate dimension
    order_number VARCHAR(50) NOT NULL,

    -- Dimension keys
    order_date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
    ship_date_key INTEGER REFERENCES dim_date(date_key),
    customer_key INTEGER NOT NULL REFERENCES dim_customer(customer_key),
    product_key INTEGER NOT NULL REFERENCES dim_product(product_key),
    geography_key INTEGER REFERENCES dim_geography(geography_key),

    -- Measures
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    gross_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    net_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price - discount_amount) STORED,
    profit_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * (unit_price - unit_cost) - discount_amount) STORED,

    -- Status at time of order
    order_status VARCHAR(30),
    is_returned BOOLEAN DEFAULT FALSE,

    -- ETL metadata
    etl_batch_id BIGINT NOT NULL,
    etl_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common query patterns
CREATE INDEX idx_fact_orders_date ON fact_orders(order_date_key);
CREATE INDEX idx_fact_orders_customer ON fact_orders(customer_key);
CREATE INDEX idx_fact_orders_product ON fact_orders(product_key);
CREATE INDEX idx_fact_orders_composite ON fact_orders(order_date_key, customer_key, product_key);

-- Aggregate table for common rollups
CREATE MATERIALIZED VIEW agg_daily_sales AS
SELECT
    order_date_key,
    d.full_date,
    d.year,
    d.month_number,
    d.week_of_year,
    COUNT(DISTINCT order_id) AS order_count,
    COUNT(DISTINCT customer_key) AS customer_count,
    SUM(quantity) AS total_quantity,
    SUM(gross_amount) AS gross_sales,
    SUM(net_amount) AS net_sales,
    SUM(profit_amount) AS total_profit,
    AVG(net_amount) AS avg_order_value
FROM fact_orders f
JOIN dim_date d ON f.order_date_key = d.date_key
GROUP BY order_date_key, d.full_date, d.year, d.month_number, d.week_of_year;

CREATE UNIQUE INDEX idx_agg_daily_sales ON agg_daily_sales(order_date_key);
```

### 4. Schema Evolution and Migrations

```sql
-- migrations/V001__initial_schema.sql
-- Flyway/Liquibase compatible migration

-- Migration metadata
-- Version: 1.0.0
-- Author: data-team
-- Date: 2024-01-01
-- Description: Initial e-commerce schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Base tables (simplified for migration example)
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- migrations/V002__add_customer_fields.sql
-- Version: 1.1.0
-- Description: Add customer profile fields

ALTER TABLE customers
    ADD COLUMN first_name VARCHAR(100),
    ADD COLUMN last_name VARCHAR(100),
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Backfill existing records
UPDATE customers
SET status = 'active'
WHERE status IS NULL;

-- Add NOT NULL constraint after backfill
ALTER TABLE customers
    ALTER COLUMN status SET NOT NULL;

-- migrations/V003__add_customer_audit.sql
-- Version: 1.2.0
-- Description: Add audit fields and triggers

ALTER TABLE customers
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN created_by UUID,
    ADD COLUMN updated_by UUID;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_modtime
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
```

## Tools and Technologies

### Modeling Tools
| Tool | Strengths | Best For |
|------|-----------|----------|
| dbdiagram.io | Simple, code-based | Quick diagrams |
| Lucidchart | Collaboration | Team modeling |
| ERDPlus | Educational | Learning |
| DataGrip | IDE integration | Development |

### Schema Management
| Tool | Type | Use Case |
|------|------|----------|
| Flyway | Migrations | Version control |
| Liquibase | Migrations | Enterprise |
| Alembic | Python | SQLAlchemy |
| Atlas | Declarative | Modern approach |

## Metrics and Monitoring

### Data Model Quality Metrics

```sql
-- Model health check queries

-- Table size and bloat
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;

-- Orphaned foreign keys
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Index usage statistics
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

## Common Pitfalls

### 1. Over-Normalization
**Problem**: Too many joins hurt query performance
**Solution**: Strategic denormalization for read-heavy tables

### 2. Missing Documentation
**Problem**: Schema becomes tribal knowledge
**Solution**: Maintain data dictionary alongside schema

### 3. Poor Naming Conventions
**Problem**: Inconsistent or unclear column names
**Solution**: Establish and enforce naming standards

### 4. Ignoring NULL Semantics
**Problem**: NULL handling causes unexpected results
**Solution**: Explicit NULL policies per column

### 5. No Change History
**Problem**: Cannot track data changes
**Solution**: Implement audit logging or CDC

## Integration Points

### Upstream Dependencies
- **Business Requirements**: Domain modeling input
- **Source Systems**: Data discovery
- **Compliance**: Regulatory constraints
- **Architecture**: System boundaries

### Downstream Consumers
- **Applications**: ORM mappings
- **Analytics**: Warehouse models
- **APIs**: Contract definitions
- **Reports**: Query requirements

## Best Practices Checklist

- [ ] Entity-relationship diagram current
- [ ] Data dictionary maintained
- [ ] Naming conventions documented
- [ ] Primary keys defined (preferably UUID)
- [ ] Foreign keys with proper cascades
- [ ] Indexes for common queries
- [ ] Check constraints for data integrity
- [ ] Audit fields on mutable tables
- [ ] Migration scripts versioned
- [ ] Model reviewed for normalization
