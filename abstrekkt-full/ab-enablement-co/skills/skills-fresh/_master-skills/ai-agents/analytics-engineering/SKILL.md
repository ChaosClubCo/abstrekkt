---
name: analytics-engineering
description: name: analytics-engineering description: dbt, data transformation, metrics layers, and analytics-ready data modeling. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Analytics Engineering

---
name: analytics-engineering
description: dbt, data transformation, metrics layers, and analytics-ready data modeling
version: 1.0.0
category: data-management
tags: [dbt, analytics, transformation, metrics, data-modeling, sql]
related_skills: [data-warehousing, etl-pipelines, data-modeling]
---

## Overview

Analytics Engineering bridges the gap between data engineering and data analysis by applying software engineering best practices to data transformation. This skill covers using dbt (data build tool) for transformation, building semantic layers, defining metrics, and creating analytics-ready data models.

Analytics engineers own the transformation layer, ensuring data is accurate, documented, tested, and accessible for analysts and data scientists. The focus is on building trustworthy, reusable data assets.

### Key Principles

1. **Version Control**: All transformations in git
2. **Testing**: Every model has tests
3. **Documentation**: Self-documenting data
4. **Modularity**: Reusable, composable models
5. **Single Source of Truth**: One definition per metric

## When to Use This Skill

### Appropriate Scenarios

- Building transformation layers in data warehouses
- Defining business metrics consistently
- Creating self-service analytics datasets
- Implementing data contracts
- Building semantic layers
- Documenting data models
- Testing data transformations
- Managing data dependencies

### When to Consider Alternatives

- **Real-time transformations**: Stream processing
- **Complex ETL**: Traditional ETL tools
- **Simple queries**: Direct SQL
- **ML feature engineering**: Feature stores

## Core Processes

### 1. dbt Project Structure

```yaml
# dbt_project.yml
name: 'analytics'
version: '1.0.0'
config-version: 2

profile: 'production'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]

target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"

vars:
  start_date: '2020-01-01'
  currency: 'USD'

models:
  analytics:
    +materialized: view
    +persist_docs:
      relation: true
      columns: true

    staging:
      +schema: staging
      +materialized: view
      +tags: ['staging']

    intermediate:
      +schema: intermediate
      +materialized: ephemeral

    marts:
      +schema: marts
      +materialized: table
      +tags: ['marts']

      core:
        +materialized: table

      finance:
        +materialized: table
        +tags: ['finance', 'pii']

      marketing:
        +materialized: table

seeds:
  analytics:
    +schema: seeds

snapshots:
  analytics:
    +strategy: timestamp
    +updated_at: updated_at

on-run-start:
  - "{{ log('Starting dbt run', info=True) }}"

on-run-end:
  - "{{ log('Completed dbt run', info=True) }}"
  - "{{ grant_select_on_schemas(['marts'], 'analysts') }}"
```

### 2. Staging Models

```sql
-- models/staging/ecommerce/stg_ecommerce__orders.sql
{{
    config(
        materialized='view',
        tags=['ecommerce', 'orders']
    )
}}

WITH source AS (
    SELECT * FROM {{ source('ecommerce', 'orders') }}
),

renamed AS (
    SELECT
        -- Primary key
        {{ dbt_utils.generate_surrogate_key(['order_id']) }} AS order_key,
        order_id,

        -- Foreign keys
        customer_id,
        {{ dbt_utils.generate_surrogate_key(['customer_id']) }} AS customer_key,

        -- Dates
        CAST(order_date AS DATE) AS order_date,
        CAST(created_at AS TIMESTAMP) AS created_at,
        CAST(updated_at AS TIMESTAMP) AS updated_at,

        -- Order details
        order_number,
        UPPER(TRIM(status)) AS order_status,
        LOWER(TRIM(channel)) AS order_channel,

        -- Amounts (standardize to cents then to dollars)
        ROUND(CAST(subtotal AS DECIMAL(12, 2)), 2) AS subtotal_amount,
        ROUND(CAST(tax_amount AS DECIMAL(12, 2)), 2) AS tax_amount,
        ROUND(CAST(shipping_amount AS DECIMAL(12, 2)), 2) AS shipping_amount,
        ROUND(CAST(discount_amount AS DECIMAL(12, 2)), 2) AS discount_amount,
        ROUND(CAST(total_amount AS DECIMAL(12, 2)), 2) AS total_amount,

        -- Metadata
        currency_code,
        CURRENT_TIMESTAMP AS _loaded_at

    FROM source
    WHERE order_id IS NOT NULL
)

SELECT * FROM renamed

-- models/staging/ecommerce/stg_ecommerce__orders.yml
version: 2

models:
  - name: stg_ecommerce__orders
    description: "Staged orders from the e-commerce platform"
    columns:
      - name: order_key
        description: "Surrogate key for orders"
        tests:
          - unique
          - not_null

      - name: order_id
        description: "Natural key from source system"
        tests:
          - unique
          - not_null

      - name: customer_id
        description: "Reference to customer"
        tests:
          - not_null
          - relationships:
              to: ref('stg_ecommerce__customers')
              field: customer_id

      - name: order_status
        description: "Current order status"
        tests:
          - accepted_values:
              values: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

      - name: total_amount
        description: "Order total in dollars"
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
```

### 3. Intermediate Models

```sql
-- models/intermediate/int_orders__enriched.sql
{{
    config(
        materialized='ephemeral'
    )
}}

WITH orders AS (
    SELECT * FROM {{ ref('stg_ecommerce__orders') }}
),

customers AS (
    SELECT * FROM {{ ref('stg_ecommerce__customers') }}
),

order_items AS (
    SELECT
        order_id,
        COUNT(DISTINCT product_id) AS unique_products,
        SUM(quantity) AS total_items,
        SUM(line_total) AS items_total
    FROM {{ ref('stg_ecommerce__order_items') }}
    GROUP BY order_id
),

enriched AS (
    SELECT
        o.*,

        -- Customer attributes
        c.customer_segment,
        c.acquisition_channel,
        c.first_order_date AS customer_first_order_date,

        -- Order item aggregates
        COALESCE(oi.unique_products, 0) AS unique_products,
        COALESCE(oi.total_items, 0) AS total_items,

        -- Calculated fields
        CASE
            WHEN o.order_date = c.first_order_date THEN TRUE
            ELSE FALSE
        END AS is_first_order,

        CASE
            WHEN o.total_amount >= 500 THEN 'Large'
            WHEN o.total_amount >= 100 THEN 'Medium'
            ELSE 'Small'
        END AS order_size_bucket,

        -- Date parts for aggregation
        {{ dbt_date.day_of_week('o.order_date') }} AS order_day_of_week,
        {{ dbt_date.week_of_year('o.order_date') }} AS order_week_of_year,
        DATE_TRUNC('month', o.order_date) AS order_month

    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
)

SELECT * FROM enriched
```

### 4. Mart Models

```sql
-- models/marts/core/fct_orders.sql
{{
    config(
        materialized='incremental',
        unique_key='order_key',
        incremental_strategy='merge',
        cluster_by=['order_date', 'customer_key'],
        tags=['core', 'incremental']
    )
}}

WITH enriched_orders AS (
    SELECT * FROM {{ ref('int_orders__enriched') }}
    {% if is_incremental() %}
    WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
    {% endif %}
),

final AS (
    SELECT
        -- Keys
        order_key,
        order_id,
        customer_key,
        customer_id,

        -- Dimensions
        order_date,
        order_status,
        order_channel,
        order_size_bucket,
        customer_segment,
        is_first_order,

        -- Metrics
        subtotal_amount,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        total_amount - discount_amount AS net_revenue,
        unique_products,
        total_items,

        -- Status flags
        order_status = 'DELIVERED' AS is_completed,
        order_status IN ('CANCELLED', 'REFUNDED') AS is_cancelled,

        -- Timestamps
        created_at,
        updated_at,
        CURRENT_TIMESTAMP AS dbt_updated_at

    FROM enriched_orders
)

SELECT * FROM final

-- models/marts/core/dim_customers.sql
{{
    config(
        materialized='table',
        tags=['core', 'dimensions']
    )
}}

WITH customers AS (
    SELECT * FROM {{ ref('stg_ecommerce__customers') }}
),

order_metrics AS (
    SELECT
        customer_id,
        COUNT(DISTINCT order_id) AS total_orders,
        SUM(total_amount) AS lifetime_value,
        SUM(net_revenue) AS lifetime_revenue,
        AVG(total_amount) AS avg_order_value,
        MIN(order_date) AS first_order_date,
        MAX(order_date) AS last_order_date,
        SUM(CASE WHEN is_first_order THEN total_amount ELSE 0 END) AS first_order_value
    FROM {{ ref('fct_orders') }}
    WHERE NOT is_cancelled
    GROUP BY customer_id
),

final AS (
    SELECT
        c.customer_key,
        c.customer_id,
        c.email,
        c.first_name,
        c.last_name,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,

        -- Acquisition
        c.acquisition_channel,
        c.created_at AS customer_since,

        -- Order history
        COALESCE(om.total_orders, 0) AS total_orders,
        COALESCE(om.lifetime_value, 0) AS lifetime_value,
        COALESCE(om.lifetime_revenue, 0) AS lifetime_revenue,
        om.avg_order_value,
        om.first_order_date,
        om.last_order_date,

        -- Segmentation
        {{ customer_segment('om.lifetime_value', 'om.total_orders') }} AS customer_segment,
        {{ customer_lifecycle_stage('om.last_order_date', 'om.total_orders') }} AS lifecycle_stage,

        -- Recency metrics
        {{ dbt.datediff('om.last_order_date', dbt.current_timestamp(), 'day') }} AS days_since_last_order,

        c._loaded_at,
        CURRENT_TIMESTAMP AS dbt_updated_at

    FROM customers c
    LEFT JOIN order_metrics om ON c.customer_id = om.customer_id
)

SELECT * FROM final
```

### 5. Metrics Layer

```yaml
# models/metrics/metrics.yml
version: 2

metrics:
  - name: revenue
    label: Total Revenue
    model: ref('fct_orders')
    description: "Sum of all order revenue"
    calculation_method: sum
    expression: net_revenue
    timestamp: order_date
    time_grains: [day, week, month, quarter, year]
    dimensions:
      - customer_segment
      - order_channel
      - order_size_bucket
    filters:
      - field: is_cancelled
        operator: '='
        value: 'false'
    meta:
      owner: finance_team
      tier: gold

  - name: orders
    label: Order Count
    model: ref('fct_orders')
    description: "Count of completed orders"
    calculation_method: count_distinct
    expression: order_id
    timestamp: order_date
    time_grains: [day, week, month]
    dimensions:
      - customer_segment
      - order_channel
    filters:
      - field: is_cancelled
        operator: '='
        value: 'false'

  - name: average_order_value
    label: Average Order Value
    description: "Average revenue per order"
    calculation_method: derived
    expression: "{{ metric('revenue') }} / {{ metric('orders') }}"
    timestamp: order_date
    time_grains: [day, week, month]

  - name: customers
    label: Active Customers
    model: ref('fct_orders')
    description: "Count of unique customers with orders"
    calculation_method: count_distinct
    expression: customer_id
    timestamp: order_date
    time_grains: [day, week, month]

  - name: revenue_per_customer
    label: Revenue per Customer
    description: "Average revenue per active customer"
    calculation_method: derived
    expression: "{{ metric('revenue') }} / {{ metric('customers') }}"
    timestamp: order_date
    time_grains: [month, quarter, year]
```

### 6. Custom Macros

```sql
-- macros/customer_segment.sql
{% macro customer_segment(lifetime_value, total_orders) %}
    CASE
        WHEN {{ lifetime_value }} >= 10000 AND {{ total_orders }} >= 20 THEN 'VIP'
        WHEN {{ lifetime_value }} >= 5000 OR {{ total_orders }} >= 10 THEN 'Gold'
        WHEN {{ lifetime_value }} >= 1000 OR {{ total_orders }} >= 5 THEN 'Silver'
        WHEN {{ total_orders }} >= 1 THEN 'Bronze'
        ELSE 'Prospect'
    END
{% endmacro %}

-- macros/customer_lifecycle_stage.sql
{% macro customer_lifecycle_stage(last_order_date, total_orders) %}
    CASE
        WHEN {{ total_orders }} = 0 OR {{ total_orders }} IS NULL THEN 'Never Ordered'
        WHEN {{ dbt.datediff(last_order_date, dbt.current_timestamp(), 'day') }} <= 30 THEN 'Active'
        WHEN {{ dbt.datediff(last_order_date, dbt.current_timestamp(), 'day') }} <= 90 THEN 'At Risk'
        WHEN {{ dbt.datediff(last_order_date, dbt.current_timestamp(), 'day') }} <= 180 THEN 'Lapsing'
        ELSE 'Churned'
    END
{% endmacro %}

-- macros/grant_select_on_schemas.sql
{% macro grant_select_on_schemas(schemas, role) %}
    {% for schema in schemas %}
        GRANT USAGE ON SCHEMA {{ target.schema }}_{{ schema }} TO ROLE {{ role }};
        GRANT SELECT ON ALL TABLES IN SCHEMA {{ target.schema }}_{{ schema }} TO ROLE {{ role }};
        GRANT SELECT ON ALL VIEWS IN SCHEMA {{ target.schema }}_{{ schema }} TO ROLE {{ role }};
    {% endfor %}
{% endmacro %}

-- macros/generate_schema_name.sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}
        {{ default_schema }}
    {%- else -%}
        {{ default_schema }}_{{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

## Tools and Technologies

### Transformation Tools
| Tool | Strengths | Best For |
|------|-----------|----------|
| dbt Core | Open source, flexible | All warehouses |
| dbt Cloud | Managed, IDE | Enterprise teams |
| SQLMesh | Virtual environments | Large projects |
| Dataform | BigQuery native | GCP shops |

### Semantic Layers
| Tool | Purpose | Integration |
|------|---------|-------------|
| dbt Metrics | Native metrics | dbt ecosystem |
| Looker | Modeling + BI | Full stack |
| Cube.js | Headless BI | APIs |
| Metriql | Open source | dbt compatible |

## Metrics and Monitoring

### dbt Run Monitoring

```python
# dbt run analytics and alerting
from dataclasses import dataclass
from typing import List, Dict
import json

@dataclass
class ModelResult:
    name: str
    status: str
    execution_time: float
    rows_affected: int

def parse_run_results(run_results_path: str) -> List[ModelResult]:
    """Parse dbt run_results.json."""
    with open(run_results_path) as f:
        results = json.load(f)

    return [
        ModelResult(
            name=r['unique_id'],
            status=r['status'],
            execution_time=r['execution_time'],
            rows_affected=r.get('adapter_response', {}).get('rows_affected', 0)
        )
        for r in results['results']
    ]

def generate_run_summary(results: List[ModelResult]) -> Dict:
    """Generate summary of dbt run."""
    return {
        'total_models': len(results),
        'success': sum(1 for r in results if r.status == 'success'),
        'error': sum(1 for r in results if r.status == 'error'),
        'skipped': sum(1 for r in results if r.status == 'skipped'),
        'total_time': sum(r.execution_time for r in results),
        'slowest_models': sorted(
            results, key=lambda x: x.execution_time, reverse=True
        )[:5]
    }
```

## Common Pitfalls

### 1. Monolithic Models
**Problem**: Single huge SQL file
**Solution**: Break into staging, intermediate, marts

### 2. Missing Tests
**Problem**: Data quality issues undetected
**Solution**: Test every model and column

### 3. Undocumented Models
**Problem**: No one knows what data means
**Solution**: Document descriptions, sources

### 4. Hardcoded Values
**Problem**: Difficult to maintain
**Solution**: Use variables and macros

### 5. No Incremental Strategy
**Problem**: Full refresh takes too long
**Solution**: Implement incremental models

## Integration Points

### Upstream Dependencies
- **Data Warehouse**: Target platform
- **Source Systems**: Raw data
- **ETL Pipelines**: Data loading
- **Schema Registry**: Contracts

### Downstream Consumers
- **BI Tools**: Dashboards
- **Data Science**: ML features
- **Operational Systems**: Reverse ETL
- **APIs**: Data products

## Best Practices Checklist

- [ ] Models follow naming conventions
- [ ] Every model has documentation
- [ ] Primary key tests on all models
- [ ] Referential integrity tests
- [ ] Staging layer for each source
- [ ] Metrics defined centrally
- [ ] Macros for repeated logic
- [ ] Incremental models for large tables
- [ ] CI/CD for dbt runs
- [ ] Lineage documented in DAG
