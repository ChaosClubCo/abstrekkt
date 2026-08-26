---
name: etl-pipelines
description: name: etl-pipelines description: Data extraction, transformation, and loading pipeline design and implementation. Use when configuring, building, or troubleshooting AI agent workflows.
---

# ETL Pipelines

---
name: etl-pipelines
description: Data extraction, transformation, and loading pipeline design and implementation
version: 1.0.0
category: data-management
tags: [etl, data-pipeline, extraction, transformation, loading, integration]
related_skills: [data-warehousing, data-quality, analytics-engineering]
---

## Overview

ETL Pipelines encompasses the design and implementation of data extraction, transformation, and loading processes that move data between systems. This skill covers building reliable, scalable, and maintainable data pipelines using modern tools like Apache Airflow, dbt, and cloud-native services.

Modern data engineering has evolved from traditional ETL to ELT patterns, where raw data is loaded first and transformed in the warehouse. Effective pipelines handle schema evolution, data quality, incremental processing, and failure recovery.

### Key Principles

1. **Idempotency**: Running a pipeline multiple times produces the same result
2. **Incremental Processing**: Process only new or changed data when possible
3. **Data Quality**: Validate data at every stage
4. **Observability**: Monitor pipeline health and data freshness
5. **Recovery**: Design for failure with retry and backfill capabilities

## When to Use This Skill

### Appropriate Scenarios

- Building data warehouse ingestion pipelines
- Integrating data from multiple source systems
- Migrating data between platforms
- Real-time and batch data processing
- Data synchronization between systems
- Building analytics-ready datasets
- Event-driven data processing
- CDC (Change Data Capture) implementations

### When to Consider Alternatives

- **Simple file transfers**: Basic scripting may suffice
- **Real-time only**: Consider stream processing (Kafka)
- **API-to-API**: Direct integration may be simpler
- **Single-table sync**: Database replication tools

## Core Processes

### 1. Apache Airflow DAG Design

```python
# dags/ecommerce_etl.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.amazon.aws.transfers.s3_to_redshift import S3ToRedshiftOperator
from airflow.utils.task_group import TaskGroup
from airflow.models import Variable

default_args = {
    'owner': 'data-engineering',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'email': ['data-alerts@company.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(minutes=60),
    'execution_timeout': timedelta(hours=2),
}

with DAG(
    dag_id='ecommerce_daily_etl',
    default_args=default_args,
    description='Daily ETL pipeline for e-commerce data',
    schedule_interval='0 6 * * *',  # 6 AM daily
    start_date=datetime(2024, 1, 1),
    catchup=False,
    max_active_runs=1,
    tags=['ecommerce', 'production', 'daily'],
    doc_md="""
    ## E-commerce Daily ETL Pipeline

    This pipeline extracts data from the production database,
    transforms it, and loads it into the data warehouse.

    ### Data Sources
    - PostgreSQL: orders, customers, products
    - S3: clickstream data

    ### Schedule
    Runs daily at 6 AM UTC, processing previous day's data.
    """,
) as dag:

    start = EmptyOperator(task_id='start')
    end = EmptyOperator(task_id='end', trigger_rule='none_failed')

    # Extraction task group
    with TaskGroup(group_id='extract') as extract_group:

        def extract_orders(**context):
            """Extract orders from source database."""
            from airflow.providers.postgres.hooks.postgres import PostgresHook
            import pandas as pd

            execution_date = context['ds']
            hook = PostgresHook(postgres_conn_id='source_db')

            query = f"""
                SELECT
                    order_id,
                    customer_id,
                    order_date,
                    total_amount,
                    status,
                    created_at,
                    updated_at
                FROM orders
                WHERE DATE(created_at) = '{execution_date}'
                   OR DATE(updated_at) = '{execution_date}'
            """

            df = hook.get_pandas_df(query)

            # Save to staging
            s3_path = f"s3://data-lake/staging/orders/dt={execution_date}/orders.parquet"
            df.to_parquet(s3_path, index=False)

            return {'record_count': len(df), 's3_path': s3_path}

        extract_orders_task = PythonOperator(
            task_id='extract_orders',
            python_callable=extract_orders,
        )

        def extract_customers(**context):
            """Extract customers with CDC logic."""
            from airflow.providers.postgres.hooks.postgres import PostgresHook
            import pandas as pd

            execution_date = context['ds']
            hook = PostgresHook(postgres_conn_id='source_db')

            # Get high watermark from previous run
            prev_watermark = Variable.get(
                'customers_watermark',
                default_var='1970-01-01 00:00:00'
            )

            query = f"""
                SELECT *
                FROM customers
                WHERE updated_at > '{prev_watermark}'
            """

            df = hook.get_pandas_df(query)

            if not df.empty:
                # Update watermark
                new_watermark = df['updated_at'].max().isoformat()
                Variable.set('customers_watermark', new_watermark)

                s3_path = f"s3://data-lake/staging/customers/dt={execution_date}/customers.parquet"
                df.to_parquet(s3_path, index=False)

                return {'record_count': len(df), 's3_path': s3_path}

            return {'record_count': 0, 's3_path': None}

        extract_customers_task = PythonOperator(
            task_id='extract_customers',
            python_callable=extract_customers,
        )

    # Transformation task group
    with TaskGroup(group_id='transform') as transform_group:

        def transform_orders(**context):
            """Transform order data with business logic."""
            import pandas as pd
            from datetime import datetime

            ti = context['ti']
            extract_result = ti.xcom_pull(task_ids='extract.extract_orders')

            if not extract_result or extract_result['record_count'] == 0:
                return {'status': 'skipped', 'reason': 'no data'}

            df = pd.read_parquet(extract_result['s3_path'])

            # Apply transformations
            df['order_date'] = pd.to_datetime(df['order_date'])
            df['day_of_week'] = df['order_date'].dt.day_name()
            df['is_weekend'] = df['order_date'].dt.dayofweek >= 5
            df['order_month'] = df['order_date'].dt.to_period('M')

            # Categorize order size
            df['order_size_category'] = pd.cut(
                df['total_amount'],
                bins=[0, 50, 200, 500, float('inf')],
                labels=['small', 'medium', 'large', 'enterprise']
            )

            # Data quality checks
            assert df['order_id'].notna().all(), "Null order_ids found"
            assert (df['total_amount'] >= 0).all(), "Negative amounts found"

            # Save transformed data
            execution_date = context['ds']
            output_path = f"s3://data-lake/transformed/orders/dt={execution_date}/orders.parquet"
            df.to_parquet(output_path, index=False)

            return {
                'record_count': len(df),
                'output_path': output_path,
                'stats': {
                    'total_revenue': float(df['total_amount'].sum()),
                    'avg_order_value': float(df['total_amount'].mean())
                }
            }

        transform_orders_task = PythonOperator(
            task_id='transform_orders',
            python_callable=transform_orders,
        )

    # Loading task group
    with TaskGroup(group_id='load') as load_group:

        load_orders_to_warehouse = S3ToRedshiftOperator(
            task_id='load_orders_to_redshift',
            schema='staging',
            table='orders',
            s3_bucket='data-lake',
            s3_key='transformed/orders/dt={{ ds }}/',
            redshift_conn_id='redshift',
            aws_conn_id='aws_default',
            copy_options=['FORMAT AS PARQUET'],
            method='UPSERT',
            upsert_keys=['order_id'],
        )

        # Merge into final table
        merge_orders = PostgresOperator(
            task_id='merge_orders_final',
            postgres_conn_id='redshift',
            sql="""
                BEGIN TRANSACTION;

                -- Merge into final table
                MERGE INTO analytics.fact_orders target
                USING staging.orders source
                ON target.order_id = source.order_id
                WHEN MATCHED THEN UPDATE SET
                    status = source.status,
                    total_amount = source.total_amount,
                    updated_at = source.updated_at,
                    etl_updated_at = CURRENT_TIMESTAMP
                WHEN NOT MATCHED THEN INSERT (
                    order_id, customer_id, order_date, total_amount,
                    status, created_at, updated_at, etl_updated_at
                ) VALUES (
                    source.order_id, source.customer_id, source.order_date,
                    source.total_amount, source.status, source.created_at,
                    source.updated_at, CURRENT_TIMESTAMP
                );

                -- Update data quality metrics
                INSERT INTO etl.pipeline_metrics (
                    pipeline_name, execution_date, table_name,
                    records_processed, records_inserted, records_updated
                )
                SELECT
                    'ecommerce_daily_etl',
                    '{{ ds }}',
                    'fact_orders',
                    COUNT(*),
                    SUM(CASE WHEN etl_updated_at = created_at THEN 1 ELSE 0 END),
                    SUM(CASE WHEN etl_updated_at != created_at THEN 1 ELSE 0 END)
                FROM analytics.fact_orders
                WHERE DATE(etl_updated_at) = '{{ ds }}';

                COMMIT;
            """,
        )

        load_orders_to_warehouse >> merge_orders

    # Data quality checks
    with TaskGroup(group_id='quality_checks') as quality_group:

        check_row_count = PostgresOperator(
            task_id='check_row_count',
            postgres_conn_id='redshift',
            sql="""
                DO $$
                DECLARE
                    staging_count INTEGER;
                    warehouse_count INTEGER;
                BEGIN
                    SELECT COUNT(*) INTO staging_count
                    FROM staging.orders WHERE DATE(created_at) = '{{ ds }}';

                    SELECT COUNT(*) INTO warehouse_count
                    FROM analytics.fact_orders WHERE DATE(etl_updated_at) = '{{ ds }}';

                    IF staging_count != warehouse_count THEN
                        RAISE EXCEPTION 'Row count mismatch: staging=%, warehouse=%',
                            staging_count, warehouse_count;
                    END IF;
                END $$;
            """,
        )

        check_null_values = PostgresOperator(
            task_id='check_null_values',
            postgres_conn_id='redshift',
            sql="""
                SELECT
                    CASE WHEN COUNT(*) > 0 THEN
                        RAISE EXCEPTION 'Found % records with null customer_id', COUNT(*)
                    END
                FROM analytics.fact_orders
                WHERE customer_id IS NULL
                  AND DATE(etl_updated_at) = '{{ ds }}';
            """,
        )

    # Define task dependencies
    start >> extract_group >> transform_group >> load_group >> quality_group >> end
```

### 2. dbt Transformation Models

```sql
-- models/staging/stg_orders.sql
{{
    config(
        materialized='incremental',
        unique_key='order_id',
        incremental_strategy='merge',
        on_schema_change='sync_all_columns'
    )
}}

WITH source AS (
    SELECT *
    FROM {{ source('ecommerce', 'orders') }}
    {% if is_incremental() %}
    WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
    {% endif %}
),

renamed AS (
    SELECT
        order_id,
        customer_id,
        order_number,
        CAST(order_date AS DATE) AS order_date,
        CAST(total_amount AS DECIMAL(12, 2)) AS order_total,
        CAST(tax_amount AS DECIMAL(12, 2)) AS tax_amount,
        CAST(shipping_amount AS DECIMAL(12, 2)) AS shipping_amount,
        CAST(discount_amount AS DECIMAL(12, 2)) AS discount_amount,
        status AS order_status,
        created_at,
        updated_at,

        -- Derived fields
        EXTRACT(YEAR FROM order_date) AS order_year,
        EXTRACT(MONTH FROM order_date) AS order_month,
        EXTRACT(DOW FROM order_date) AS day_of_week,
        CASE
            WHEN EXTRACT(DOW FROM order_date) IN (0, 6) THEN TRUE
            ELSE FALSE
        END AS is_weekend_order

    FROM source
)

SELECT * FROM renamed

-- models/marts/fct_orders.sql
{{
    config(
        materialized='table',
        partition_by={
            "field": "order_date",
            "data_type": "date",
            "granularity": "month"
        },
        cluster_by=['customer_id', 'order_status']
    )
}}

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),

customers AS (
    SELECT * FROM {{ ref('dim_customers') }}
),

products AS (
    SELECT * FROM {{ ref('stg_order_items') }}
),

order_items_agg AS (
    SELECT
        order_id,
        COUNT(DISTINCT product_id) AS unique_products,
        SUM(quantity) AS total_items,
        SUM(line_total) AS items_subtotal
    FROM products
    GROUP BY order_id
),

final AS (
    SELECT
        o.order_id,
        o.order_number,
        o.order_date,
        o.order_year,
        o.order_month,
        o.day_of_week,
        o.is_weekend_order,

        -- Customer dimensions
        o.customer_id,
        c.customer_segment,
        c.acquisition_channel,
        c.lifetime_value_tier,

        -- Order metrics
        o.order_total,
        o.tax_amount,
        o.shipping_amount,
        o.discount_amount,
        o.order_total - o.discount_amount AS net_revenue,

        -- Item metrics
        COALESCE(oi.unique_products, 0) AS unique_products,
        COALESCE(oi.total_items, 0) AS total_items,

        -- Status
        o.order_status,
        CASE
            WHEN o.order_status = 'delivered' THEN TRUE
            ELSE FALSE
        END AS is_completed,
        CASE
            WHEN o.order_status IN ('cancelled', 'refunded') THEN TRUE
            ELSE FALSE
        END AS is_cancelled,

        -- Timestamps
        o.created_at,
        o.updated_at,
        CURRENT_TIMESTAMP AS dbt_updated_at

    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN order_items_agg oi ON o.order_id = oi.order_id
)

SELECT * FROM final

-- models/marts/dim_customers.sql
{{
    config(
        materialized='table',
        unique_key='customer_id'
    )
}}

WITH customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
),

orders AS (
    SELECT
        customer_id,
        COUNT(*) AS total_orders,
        SUM(order_total) AS lifetime_value,
        MIN(order_date) AS first_order_date,
        MAX(order_date) AS last_order_date,
        AVG(order_total) AS avg_order_value
    FROM {{ ref('stg_orders') }}
    WHERE order_status NOT IN ('cancelled', 'refunded')
    GROUP BY customer_id
),

final AS (
    SELECT
        c.customer_id,
        c.email,
        c.first_name,
        c.last_name,
        c.phone,
        c.created_at AS customer_since,

        -- Order history
        COALESCE(o.total_orders, 0) AS total_orders,
        COALESCE(o.lifetime_value, 0) AS lifetime_value,
        o.first_order_date,
        o.last_order_date,
        o.avg_order_value,

        -- Segmentation
        CASE
            WHEN o.lifetime_value >= 10000 THEN 'VIP'
            WHEN o.lifetime_value >= 1000 THEN 'Gold'
            WHEN o.lifetime_value >= 100 THEN 'Silver'
            WHEN o.total_orders >= 1 THEN 'Bronze'
            ELSE 'Prospect'
        END AS customer_segment,

        CASE
            WHEN o.last_order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
            WHEN o.last_order_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'At Risk'
            WHEN o.last_order_date IS NOT NULL THEN 'Churned'
            ELSE 'Never Ordered'
        END AS activity_status,

        -- Derived metrics
        DATE_DIFF('day', o.first_order_date, o.last_order_date) AS customer_tenure_days,
        CASE
            WHEN o.total_orders > 1 THEN
                o.lifetime_value / NULLIF(DATE_DIFF('month', o.first_order_date, o.last_order_date), 0)
            ELSE NULL
        END AS monthly_spend_rate

    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
)

SELECT * FROM final
```

### 3. Data Quality Framework

```python
# quality/data_quality_checks.py
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum
import pandas as pd

class CheckSeverity(Enum):
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class QualityCheckResult:
    check_name: str
    passed: bool
    severity: CheckSeverity
    message: str
    details: Optional[Dict[str, Any]] = None

class DataQualityChecker:
    """Framework for data quality validation."""

    def __init__(self, df: pd.DataFrame, table_name: str):
        self.df = df
        self.table_name = table_name
        self.results: List[QualityCheckResult] = []

    def check_not_null(
        self,
        columns: List[str],
        severity: CheckSeverity = CheckSeverity.ERROR
    ) -> 'DataQualityChecker':
        """Check for null values in specified columns."""
        for col in columns:
            null_count = self.df[col].isna().sum()
            passed = null_count == 0

            self.results.append(QualityCheckResult(
                check_name=f"not_null_{col}",
                passed=passed,
                severity=severity,
                message=f"Column {col} has {null_count} null values" if not passed else "OK",
                details={'null_count': int(null_count), 'total_rows': len(self.df)}
            ))

        return self

    def check_unique(
        self,
        columns: List[str],
        severity: CheckSeverity = CheckSeverity.ERROR
    ) -> 'DataQualityChecker':
        """Check for duplicate values."""
        for col in columns:
            duplicate_count = self.df[col].duplicated().sum()
            passed = duplicate_count == 0

            self.results.append(QualityCheckResult(
                check_name=f"unique_{col}",
                passed=passed,
                severity=severity,
                message=f"Column {col} has {duplicate_count} duplicates" if not passed else "OK",
                details={'duplicate_count': int(duplicate_count)}
            ))

        return self

    def check_range(
        self,
        column: str,
        min_value: float = None,
        max_value: float = None,
        severity: CheckSeverity = CheckSeverity.ERROR
    ) -> 'DataQualityChecker':
        """Check if values are within expected range."""
        violations = 0

        if min_value is not None:
            violations += (self.df[column] < min_value).sum()
        if max_value is not None:
            violations += (self.df[column] > max_value).sum()

        passed = violations == 0

        self.results.append(QualityCheckResult(
            check_name=f"range_{column}",
            passed=passed,
            severity=severity,
            message=f"Column {column} has {violations} out-of-range values" if not passed else "OK",
            details={
                'violations': int(violations),
                'min_expected': min_value,
                'max_expected': max_value,
                'actual_min': float(self.df[column].min()),
                'actual_max': float(self.df[column].max())
            }
        ))

        return self

    def check_referential_integrity(
        self,
        column: str,
        reference_df: pd.DataFrame,
        reference_column: str,
        severity: CheckSeverity = CheckSeverity.ERROR
    ) -> 'DataQualityChecker':
        """Check referential integrity between tables."""
        orphan_count = ~self.df[column].isin(reference_df[reference_column])
        orphan_count = orphan_count.sum()
        passed = orphan_count == 0

        self.results.append(QualityCheckResult(
            check_name=f"ref_integrity_{column}",
            passed=passed,
            severity=severity,
            message=f"Column {column} has {orphan_count} orphaned references" if not passed else "OK",
            details={'orphan_count': int(orphan_count)}
        ))

        return self

    def check_freshness(
        self,
        timestamp_column: str,
        max_age_hours: int = 24,
        severity: CheckSeverity = CheckSeverity.WARNING
    ) -> 'DataQualityChecker':
        """Check data freshness."""
        from datetime import datetime, timedelta

        max_timestamp = pd.to_datetime(self.df[timestamp_column]).max()
        age_hours = (datetime.now() - max_timestamp).total_seconds() / 3600
        passed = age_hours <= max_age_hours

        self.results.append(QualityCheckResult(
            check_name=f"freshness_{timestamp_column}",
            passed=passed,
            severity=severity,
            message=f"Data is {age_hours:.1f} hours old (max: {max_age_hours})" if not passed else "OK",
            details={
                'max_timestamp': str(max_timestamp),
                'age_hours': round(age_hours, 2),
                'threshold_hours': max_age_hours
            }
        ))

        return self

    def check_row_count(
        self,
        min_count: int = None,
        max_count: int = None,
        severity: CheckSeverity = CheckSeverity.ERROR
    ) -> 'DataQualityChecker':
        """Check row count is within expected range."""
        row_count = len(self.df)
        passed = True

        if min_count and row_count < min_count:
            passed = False
        if max_count and row_count > max_count:
            passed = False

        self.results.append(QualityCheckResult(
            check_name="row_count",
            passed=passed,
            severity=severity,
            message=f"Row count {row_count} outside expected range" if not passed else "OK",
            details={
                'actual_count': row_count,
                'min_expected': min_count,
                'max_expected': max_count
            }
        ))

        return self

    def validate(self) -> Dict[str, Any]:
        """Run all checks and return summary."""
        failed_checks = [r for r in self.results if not r.passed]
        critical_failures = [r for r in failed_checks if r.severity == CheckSeverity.CRITICAL]
        error_failures = [r for r in failed_checks if r.severity == CheckSeverity.ERROR]

        return {
            'table': self.table_name,
            'total_checks': len(self.results),
            'passed': len(self.results) - len(failed_checks),
            'failed': len(failed_checks),
            'critical_failures': len(critical_failures),
            'error_failures': len(error_failures),
            'all_passed': len(failed_checks) == 0,
            'should_fail_pipeline': len(critical_failures) > 0 or len(error_failures) > 0,
            'results': [
                {
                    'check': r.check_name,
                    'passed': r.passed,
                    'severity': r.severity.value,
                    'message': r.message,
                    'details': r.details
                }
                for r in self.results
            ]
        }


# Usage example
def validate_orders(df: pd.DataFrame, customers_df: pd.DataFrame) -> Dict:
    """Validate order data quality."""
    checker = DataQualityChecker(df, 'orders')

    result = (
        checker
        .check_not_null(['order_id', 'customer_id', 'order_date'])
        .check_unique(['order_id'])
        .check_range('total_amount', min_value=0)
        .check_referential_integrity('customer_id', customers_df, 'customer_id')
        .check_freshness('created_at', max_age_hours=24)
        .check_row_count(min_count=1)
        .validate()
    )

    return result
```

## Tools and Technologies

### Orchestration
| Tool | Strengths | Best For |
|------|-----------|----------|
| Apache Airflow | Mature, extensible | Complex workflows |
| Prefect | Modern, Pythonic | Python teams |
| Dagster | Asset-focused | Data-centric orgs |
| dbt Cloud | Transformation focus | Analytics engineering |

### Extraction
| Tool | Use Case | Data Sources |
|------|----------|--------------|
| Fivetran | Managed ELT | SaaS, databases |
| Airbyte | Open source | Wide variety |
| Stitch | Simple sync | Common sources |
| Custom | Specialized | APIs, files |

### Processing
| Engine | Scale | Use Case |
|--------|-------|----------|
| Spark | Large | Big data |
| dbt | Medium | SQL transforms |
| Pandas | Small | Prototyping |
| DuckDB | Medium | Local analytics |

## Metrics and Monitoring

### Pipeline Health Metrics

```python
# Pipeline monitoring and alerting
from prometheus_client import Counter, Histogram, Gauge

# Metrics
pipeline_runs = Counter(
    'etl_pipeline_runs_total',
    'Total pipeline runs',
    ['pipeline_name', 'status']
)

pipeline_duration = Histogram(
    'etl_pipeline_duration_seconds',
    'Pipeline execution duration',
    ['pipeline_name'],
    buckets=[60, 300, 600, 1800, 3600, 7200]
)

records_processed = Counter(
    'etl_records_processed_total',
    'Records processed',
    ['pipeline_name', 'table_name', 'operation']
)

data_freshness = Gauge(
    'etl_data_freshness_seconds',
    'Data freshness in seconds',
    ['table_name']
)

quality_check_failures = Counter(
    'etl_quality_check_failures_total',
    'Quality check failures',
    ['pipeline_name', 'check_name', 'severity']
)
```

## Common Pitfalls

### 1. No Idempotency
**Problem**: Re-running creates duplicates
**Solution**: Use upserts and unique keys

### 2. Full Reloads Only
**Problem**: Processing all data every run
**Solution**: Implement incremental logic

### 3. Tight Coupling
**Problem**: Source changes break pipeline
**Solution**: Add schema validation and versioning

### 4. Missing Monitoring
**Problem**: Failures discovered late
**Solution**: Comprehensive alerting and dashboards

### 5. No Backfill Support
**Problem**: Cannot reprocess historical data
**Solution**: Design for date-partitioned backfills

## Integration Points

### Upstream Dependencies
- **Source Databases**: Production systems
- **APIs**: Third-party data
- **Files**: CSV, JSON, Parquet
- **Streams**: Kafka, Kinesis

### Downstream Consumers
- **Data Warehouse**: Analytics queries
- **BI Tools**: Dashboards
- **ML Pipelines**: Feature stores
- **Applications**: Derived data

## Best Practices Checklist

- [ ] Pipelines are idempotent
- [ ] Incremental processing where possible
- [ ] Data quality checks at each stage
- [ ] Comprehensive monitoring and alerting
- [ ] Backfill capability for historical data
- [ ] Schema evolution handling
- [ ] Retry logic with exponential backoff
- [ ] Clear documentation and lineage
- [ ] Testing for transformations
- [ ] Version control for all code
