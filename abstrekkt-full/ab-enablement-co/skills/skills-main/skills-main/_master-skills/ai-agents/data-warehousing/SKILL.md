---
name: data-warehousing
description: Helps configure and build data warehousing processes. name: data-warehousing description: Snowflake, BigQuery, Redshift patterns and data warehouse architecture. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Data Warehousing

---
name: data-warehousing
description: Snowflake, BigQuery, Redshift patterns and data warehouse architecture
version: 1.0.0
category: data-management
tags: [data-warehouse, snowflake, bigquery, redshift, analytics, olap]
related_skills: [data-modeling, etl-pipelines, analytics-engineering]
---

## Overview

Data Warehousing encompasses the design, implementation, and optimization of analytical data platforms. This skill covers building scalable data warehouses using modern cloud platforms like Snowflake, BigQuery, and Redshift, including schema design, query optimization, and cost management.

Modern data warehouses have evolved from traditional on-premises systems to cloud-native platforms that separate compute from storage, enabling unprecedented scalability and flexibility. Effective warehousing balances performance, cost, and maintainability.

### Key Principles

1. **Separation of Concerns**: Compute and storage should scale independently
2. **Query Performance**: Design for analytical query patterns
3. **Cost Optimization**: Manage compute costs through efficient design
4. **Data Organization**: Partition and cluster for performance
5. **Governance**: Implement access controls and auditing

## When to Use This Skill

### Appropriate Scenarios

- Building enterprise analytics platforms
- Consolidating data from multiple sources
- Supporting BI and reporting workloads
- Historical data analysis
- Complex aggregations and joins
- Self-service analytics enablement
- Data science feature engineering
- Regulatory reporting requirements

### When to Consider Alternatives

- **Real-time analytics**: Consider streaming solutions
- **Simple queries**: Operational databases may suffice
- **Small data**: Single database adequate
- **Unstructured data**: Data lake approach

## Core Processes

### 1. Snowflake Architecture

```sql
-- Snowflake warehouse and database setup

-- Create data warehouse with auto-scaling
CREATE WAREHOUSE analytics_wh
    WITH WAREHOUSE_SIZE = 'MEDIUM'
    AUTO_SUSPEND = 300
    AUTO_RESUME = TRUE
    MIN_CLUSTER_COUNT = 1
    MAX_CLUSTER_COUNT = 4
    SCALING_POLICY = 'ECONOMY'
    INITIALLY_SUSPENDED = TRUE
    COMMENT = 'Analytics workload warehouse';

-- Separate warehouse for ETL
CREATE WAREHOUSE etl_wh
    WITH WAREHOUSE_SIZE = 'LARGE'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    COMMENT = 'ETL processing warehouse';

-- Database structure
CREATE DATABASE analytics;
CREATE SCHEMA analytics.raw;        -- Raw ingested data
CREATE SCHEMA analytics.staging;    -- Intermediate transformations
CREATE SCHEMA analytics.marts;      -- Business-ready models
CREATE SCHEMA analytics.reference;  -- Reference/lookup data

-- Data organization with clustering
CREATE TABLE analytics.marts.fact_orders (
    order_id VARCHAR(36) NOT NULL,
    order_date DATE NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    order_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP_NTZ NOT NULL,
    updated_at TIMESTAMP_NTZ NOT NULL,

    -- ETL metadata
    _loaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    _source_file VARCHAR(500)
)
CLUSTER BY (order_date, customer_id)
DATA_RETENTION_TIME_IN_DAYS = 90
COMMENT = 'Order fact table clustered by date and customer';

-- Automatic clustering for large tables
ALTER TABLE analytics.marts.fact_orders
    RESUME RECLUSTER;

-- Time travel for recovery
CREATE TABLE analytics.marts.dim_customers
    CLONE analytics.staging.customers
    AT(OFFSET => -3600);  -- Clone from 1 hour ago

-- Materialized views for performance
CREATE MATERIALIZED VIEW analytics.marts.mv_daily_sales
    CLUSTER BY (order_date)
AS
SELECT
    order_date,
    COUNT(DISTINCT order_id) AS order_count,
    COUNT(DISTINCT customer_id) AS customer_count,
    SUM(quantity) AS total_items,
    SUM(total_amount) AS gross_revenue,
    SUM(total_amount - discount_amount) AS net_revenue,
    AVG(total_amount) AS avg_order_value
FROM analytics.marts.fact_orders
GROUP BY order_date;

-- Resource monitors for cost control
CREATE RESOURCE MONITOR analytics_monitor
    WITH CREDIT_QUOTA = 1000
    FREQUENCY = MONTHLY
    START_TIMESTAMP = IMMEDIATELY
    TRIGGERS
        ON 75 PERCENT DO NOTIFY
        ON 90 PERCENT DO NOTIFY
        ON 100 PERCENT DO SUSPEND;

ALTER WAREHOUSE analytics_wh
    SET RESOURCE_MONITOR = analytics_monitor;

-- Row-level security
CREATE ROW ACCESS POLICY region_policy AS (region_code VARCHAR)
    RETURNS BOOLEAN ->
    CASE
        WHEN CURRENT_ROLE() = 'ADMIN' THEN TRUE
        WHEN region_code = CURRENT_USER_REGION() THEN TRUE
        ELSE FALSE
    END;

ALTER TABLE analytics.marts.fact_orders
    ADD ROW ACCESS POLICY region_policy ON (region_code);
```

### 2. BigQuery Architecture

```sql
-- BigQuery dataset and table setup

-- Create datasets with appropriate settings
CREATE SCHEMA IF NOT EXISTS `project.raw_data`
OPTIONS(
    description = 'Raw ingested data',
    default_table_expiration_days = 90,
    labels = [('env', 'production'), ('team', 'data-engineering')]
);

CREATE SCHEMA IF NOT EXISTS `project.analytics`
OPTIONS(
    description = 'Analytics-ready models',
    labels = [('env', 'production'), ('team', 'analytics')]
);

-- Partitioned and clustered table
CREATE TABLE `project.analytics.fact_orders`
(
    order_id STRING NOT NULL,
    order_date DATE NOT NULL,
    customer_id STRING NOT NULL,
    product_id STRING NOT NULL,
    quantity INT64 NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    order_status STRING NOT NULL,
    region_code STRING,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    _loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY order_date
CLUSTER BY customer_id, product_id
OPTIONS(
    description = 'Order fact table',
    partition_expiration_days = 365,
    require_partition_filter = TRUE,
    labels = [('pii', 'false')]
);

-- Partitioned by ingestion time for streaming
CREATE TABLE `project.raw_data.events`
(
    event_id STRING,
    event_type STRING,
    event_data JSON,
    user_id STRING,
    timestamp TIMESTAMP
)
PARTITION BY _PARTITIONTIME
CLUSTER BY event_type, user_id
OPTIONS(
    partition_expiration_days = 30
);

-- Materialized view
CREATE MATERIALIZED VIEW `project.analytics.mv_customer_metrics`
PARTITION BY DATE(last_order_date)
CLUSTER BY customer_segment
OPTIONS(
    enable_refresh = TRUE,
    refresh_interval_minutes = 60
)
AS
SELECT
    customer_id,
    customer_segment,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS lifetime_value,
    MAX(order_date) AS last_order_date,
    MIN(order_date) AS first_order_date,
    AVG(total_amount) AS avg_order_value
FROM `project.analytics.fact_orders`
GROUP BY customer_id, customer_segment;

-- Authorized views for data access control
CREATE VIEW `project.analytics.v_orders_masked`
OPTIONS(
    description = 'Orders with PII masked'
)
AS
SELECT
    order_id,
    order_date,
    -- Mask customer ID
    CONCAT(SUBSTR(customer_id, 1, 4), '****') AS customer_id_masked,
    product_id,
    total_amount,
    order_status
FROM `project.analytics.fact_orders`;

-- Grant access to specific roles
GRANT `roles/bigquery.dataViewer`
ON TABLE `project.analytics.v_orders_masked`
TO 'group:analysts@company.com';

-- Scheduled query for aggregations
CREATE SCHEDULED QUERY daily_aggregation
OPTIONS(
    schedule = 'every 24 hours',
    destination_table_name_template = 'project.analytics.daily_summary_{run_date}',
    write_disposition = 'WRITE_TRUNCATE'
)
AS
SELECT
    CURRENT_DATE() AS report_date,
    COUNT(DISTINCT order_id) AS orders,
    SUM(total_amount) AS revenue
FROM `project.analytics.fact_orders`
WHERE order_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY);

-- Query with cost controls
SELECT
    customer_id,
    SUM(total_amount) AS total_spend
FROM `project.analytics.fact_orders`
WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY customer_id
ORDER BY total_spend DESC
LIMIT 100
OPTIONS(
    maximum_bytes_billed = 10737418240  -- 10 GB limit
);
```

### 3. Redshift Architecture

```sql
-- Redshift cluster and table design

-- Create schema structure
CREATE SCHEMA IF NOT EXISTS raw;
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Distribution and sort key design
CREATE TABLE analytics.fact_orders (
    order_id VARCHAR(36) NOT NULL ENCODE zstd,
    order_date DATE NOT NULL ENCODE az64,
    customer_id VARCHAR(36) NOT NULL ENCODE zstd,
    product_id VARCHAR(36) NOT NULL ENCODE zstd,
    quantity INTEGER NOT NULL ENCODE az64,
    unit_price DECIMAL(10, 2) NOT NULL ENCODE az64,
    total_amount DECIMAL(12, 2) NOT NULL ENCODE az64,
    discount_amount DECIMAL(10, 2) DEFAULT 0 ENCODE az64,
    order_status VARCHAR(20) NOT NULL ENCODE bytedict,
    region_code CHAR(2) ENCODE bytedict,
    created_at TIMESTAMP NOT NULL ENCODE az64,
    updated_at TIMESTAMP NOT NULL ENCODE az64,
    _loaded_at TIMESTAMP DEFAULT GETDATE() ENCODE az64,

    PRIMARY KEY (order_id)
)
DISTSTYLE KEY
DISTKEY (customer_id)
SORTKEY (order_date, customer_id);

-- Dimension table with ALL distribution for small tables
CREATE TABLE analytics.dim_products (
    product_id VARCHAR(36) PRIMARY KEY ENCODE zstd,
    sku VARCHAR(50) NOT NULL ENCODE zstd,
    product_name VARCHAR(255) NOT NULL ENCODE zstd,
    category VARCHAR(100) ENCODE zstd,
    subcategory VARCHAR(100) ENCODE zstd,
    brand VARCHAR(100) ENCODE zstd,
    unit_cost DECIMAL(10, 2) ENCODE az64,
    unit_price DECIMAL(10, 2) ENCODE az64,
    is_active BOOLEAN DEFAULT TRUE ENCODE raw,
    created_at TIMESTAMP ENCODE az64,
    updated_at TIMESTAMP ENCODE az64
)
DISTSTYLE ALL
SORTKEY (category, subcategory);

-- Large dimension with KEY distribution
CREATE TABLE analytics.dim_customers (
    customer_id VARCHAR(36) PRIMARY KEY ENCODE zstd,
    email VARCHAR(255) ENCODE zstd,
    first_name VARCHAR(100) ENCODE zstd,
    last_name VARCHAR(100) ENCODE zstd,
    customer_segment VARCHAR(50) ENCODE bytedict,
    acquisition_channel VARCHAR(50) ENCODE bytedict,
    region_code CHAR(2) ENCODE bytedict,
    lifetime_value DECIMAL(12, 2) ENCODE az64,
    first_order_date DATE ENCODE az64,
    last_order_date DATE ENCODE az64,
    total_orders INTEGER ENCODE az64,
    created_at TIMESTAMP ENCODE az64,
    updated_at TIMESTAMP ENCODE az64
)
DISTSTYLE KEY
DISTKEY (customer_id)
SORTKEY (customer_segment, region_code);

-- Workload Management (WLM) queue configuration
CREATE USER GROUP analysts;
CREATE USER GROUP etl_users;

-- Concurrency Scaling for burst capacity
ALTER SYSTEM SET max_concurrency_scaling_clusters = 5;

-- Maintenance: VACUUM and ANALYZE
VACUUM FULL analytics.fact_orders TO 100 PERCENT;
ANALYZE analytics.fact_orders PREDICATE COLUMNS;

-- Spectrum for external data lake queries
CREATE EXTERNAL SCHEMA lake_data
FROM DATA CATALOG
DATABASE 'analytics_lake'
IAM_ROLE 'arn:aws:iam::123456789:role/RedshiftSpectrum'
REGION 'us-east-1';

-- Query spanning warehouse and lake
SELECT
    f.order_date,
    f.customer_id,
    f.total_amount,
    e.event_type,
    e.event_timestamp
FROM analytics.fact_orders f
JOIN lake_data.user_events e
    ON f.customer_id = e.user_id
    AND f.order_date = DATE(e.event_timestamp)
WHERE f.order_date >= DATEADD(day, -7, CURRENT_DATE);

-- Materialized view
CREATE MATERIALIZED VIEW analytics.mv_monthly_revenue
DISTSTYLE ALL
SORTKEY (order_month)
AUTO REFRESH YES
AS
SELECT
    DATE_TRUNC('month', order_date) AS order_month,
    region_code,
    COUNT(DISTINCT order_id) AS order_count,
    SUM(total_amount) AS gross_revenue,
    SUM(total_amount - discount_amount) AS net_revenue,
    AVG(total_amount) AS avg_order_value
FROM analytics.fact_orders
GROUP BY DATE_TRUNC('month', order_date), region_code;
```


## References
- `references/4-cost-optimization.md` — 4. Cost Optimization
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
