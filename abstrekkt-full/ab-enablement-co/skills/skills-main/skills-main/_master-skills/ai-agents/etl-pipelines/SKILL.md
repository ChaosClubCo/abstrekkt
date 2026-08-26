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


## References
- `references/2-dbt-transformation-models.md` — 2. dbt Transformation Models
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
