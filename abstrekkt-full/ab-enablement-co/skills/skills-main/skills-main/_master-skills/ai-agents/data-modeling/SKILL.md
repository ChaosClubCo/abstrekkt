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


## References
- `references/3-dimensional-modeling-star-schema.md` — 3. Dimensional Modeling (Star Schema)
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
