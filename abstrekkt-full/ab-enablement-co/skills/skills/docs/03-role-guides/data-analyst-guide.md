# Data Analyst Guide

This guide curates the most valuable skills for data analysts, analytics engineers, and business intelligence professionals. Whether you are building data pipelines, writing SQL, creating dashboards, or presenting insights, these skills cover the full analytics workflow.

---

## Data Infrastructure and Engineering

Skills for building the data platform that powers analytics.

| Skill | Category | Description |
|-------|----------|-------------|
| `analytics-engineering` | ai-agents | Analytics engineering practices including dbt, data modeling, and testing |
| `data-warehousing` | ai-agents | Data warehouse design, schema patterns, and optimization |
| `etl-pipelines` | ai-agents | Building ETL/ELT pipelines for data extraction, transformation, and loading |
| `data-modeling` | ai-agents | Dimensional modeling, star schemas, and entity-relationship design |
| `data-quality` | ai-agents | Data quality monitoring, validation rules, and anomaly detection |
| `data-governance` | ai-agents | Data governance policies, cataloging, lineage, and access controls |
| `database-design` | ai-agents | Database schema design and normalization best practices |
| `database-migration` | ai-agents | Planning and executing database migrations with minimal downtime |

### Suggested Workflow: Setting Up a Data Platform

1. Design the warehouse with `data-warehousing` and `data-modeling`
2. Build ingestion with `etl-pipelines`
3. Implement quality checks with `data-quality`
4. Establish governance with `data-governance`
5. Maintain with `analytics-engineering` practices

---

## SQL and Database Skills

Skills for querying, optimizing, and managing databases.

| Skill | Category | Description |
|-------|----------|-------------|
| `sql-optimization-patterns` | technical | Query optimization including indexing, execution plans, and query rewrites |
| `postgresql` | technical | PostgreSQL administration, advanced queries, and extensions |
| `postgresql-table-design` | ai-agents | PostgreSQL-specific table design including partitioning and indexing strategies |
| `databases` | technical | Database fundamentals including selection criteria and management |
| `supabase-administration` | technical | Supabase database management, row-level security, and real-time features |

### Suggested Workflow: Optimizing Query Performance

1. Review schema with `postgresql-table-design`
2. Analyze queries with `sql-optimization-patterns`
3. Apply PostgreSQL-specific features from `postgresql`
4. Validate data integrity with `data-quality`

---

## Analytics and Reporting

Skills for analyzing data and communicating insights.

| Skill | Category | Description |
|-------|----------|-------------|
| `analytics-reporting` | strategy | Building regular analytics reports for stakeholders |
| `business-dashboards` | strategy | Designing executive and operational dashboards |
| `dashboard-creator` | ai-agents | Creating interactive dashboards with modern BI tools |
| `reporting-automation` | ai-agents | Automating recurring reports and distribution |
| `operational-analytics` | strategy | Analyzing operational data for process improvements and efficiency |
| `product-metrics` | technical | Defining and tracking product performance metrics |
| `kpi-frameworks` | strategy | Building KPI hierarchies and measurement frameworks |
| `saas-metrics` | strategy | SaaS-specific metrics including MRR, ARR, churn, and LTV |

### Suggested Workflow: Building a Reporting Framework

1. Define metrics with `kpi-frameworks` and `product-metrics`
2. Build dashboards with `dashboard-creator` or `business-dashboards`
3. Automate delivery with `reporting-automation`
4. Add operational views with `operational-analytics`
5. Present to stakeholders using `analytics-reporting`

---

## Customer and Business Analytics

Skills for understanding customers, markets, and business performance.

| Skill | Category | Description |
|-------|----------|-------------|
| `customer-analytics` | strategy | Analyzing customer behavior, segments, and lifetime value |
| `customer-segmentation` | strategy | Defining customer segments using behavioral and demographic data |
| `cohort-analysis` | strategy | Tracking user cohorts over time for retention and engagement insights |
| `churn-prevention` | ai-agents | Identifying churn risk factors and building predictive models |
| `attribution-modeling` | ai-agents | Marketing attribution models for channel and campaign effectiveness |
| `forecasting-models` | strategy | Building forecasting models for revenue, demand, and growth |
| `competitive-benchmarking` | strategy | Benchmarking performance against industry standards and competitors |
| `pricing-optimization` | strategy | Data-driven pricing analysis and optimization |

### Suggested Workflow: Customer Analytics Deep Dive

1. Segment users with `customer-segmentation`
2. Analyze behavior by cohort with `cohort-analysis`
3. Build `customer-analytics` profiles for key segments
4. Identify at-risk users with `churn-prevention`
5. Model future behavior with `forecasting-models`

---

## Data Visualization

Skills for presenting data clearly and effectively.

| Skill | Category | Description |
|-------|----------|-------------|
| `data-visualization` | creative | Designing effective charts, graphs, and visual data representations |
| `infographic-design` | creative | Creating infographics that communicate data stories |
| `dashboard-creator` | ai-agents | Building interactive dashboards for self-serve analytics |
| `grafana-dashboards` | ai-agents | Creating Grafana dashboards for infrastructure and application monitoring |
| `mermaidjs-v11` | ai-agents | Creating diagrams and flowcharts with MermaidJS for documentation |
| `flowchart-creator` | ai-agents | Generating flowcharts and process diagrams |
| `presentation-design` | creative | Designing data presentations for stakeholders |

---

## Data Processing and Automation

Skills for automating data workflows and building pipelines.

| Skill | Category | Description |
|-------|----------|-------------|
| `etl-pipelines` | ai-agents | Designing and building data pipelines with modern orchestration tools |
| `reporting-automation` | ai-agents | Automating report generation and distribution |
| `workflow-automation` | technical | Automating repetitive data workflows |
| `workflow-orchestration-patterns` | technical | Orchestrating complex multi-step data workflows |
| `python-performance-optimization` | technical | Optimizing Python data processing for large datasets |
| `async-python-patterns` | technical | Asynchronous Python patterns for concurrent data processing |
| `log-management` | ai-agents | Centralized log collection, parsing, and analysis |

### Suggested Workflow: Automating a Data Pipeline

1. Design the pipeline with `etl-pipelines`
2. Optimize processing with `python-performance-optimization`
3. Orchestrate steps with `workflow-orchestration-patterns`
4. Automate outputs with `reporting-automation`
5. Monitor with `log-management`

---

## Related Guides

- [Developer Guide](developer-guide.md) for Python, SQL, and infrastructure skills
- [Product Manager Guide](product-manager-guide.md) for product metrics and business context
- [DevOps Guide](devops-guide.md) for monitoring dashboards and infrastructure data
- [Category Guides](../04-category-guides/README.md) for browsing by category
