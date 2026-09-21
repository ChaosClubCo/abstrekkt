---
name: reporting-automation
description: name: reporting-automation description: Scheduled reports, automated dashboards, alerts, and business intelligence delivery. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Reporting Automation

---
name: reporting-automation
description: Scheduled reports, automated dashboards, alerts, and business intelligence delivery
version: 1.0.0
category: data-management
tags: [reporting, automation, dashboards, alerts, bi, scheduling]
related_skills: [analytics-engineering, data-warehousing, monitoring-alerting]
---

## Overview

Reporting Automation encompasses the design and implementation of automated report generation, dashboard creation, and alert-driven notifications. This skill covers building reliable reporting pipelines that deliver insights to stakeholders on schedule without manual intervention.

Effective reporting automation reduces manual work, ensures consistency, and enables timely decision-making. The goal is to deliver the right information to the right people at the right time.

### Key Principles

1. **Self-Service**: Enable users to access data without waiting
2. **Consistency**: Same metrics calculated the same way
3. **Timeliness**: Reports delivered when needed
4. **Reliability**: Reports always run on schedule
5. **Actionability**: Insights that drive decisions

## When to Use This Skill

### Appropriate Scenarios

- Automating recurring business reports
- Building executive dashboards
- Creating data-driven alerts
- Scheduling report distribution
- Generating compliance reports
- Building self-service analytics
- Implementing KPI monitoring
- Creating operational dashboards

### When to Consider Alternatives

- **Ad-hoc analysis**: Self-service BI tools
- **Real-time monitoring**: Use monitoring-alerting skill
- **Complex analysis**: Data science notebooks
- **One-time reports**: Manual reporting

## Core Processes

### 1. Report Scheduling with Airflow

```python
# dags/reporting_pipeline.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.email import EmailOperator
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
from airflow.utils.task_group import TaskGroup
import pandas as pd
from typing import Dict, Any

default_args = {
    'owner': 'analytics',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['reports@company.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=10),
}

def generate_daily_sales_report(**context) -> Dict[str, Any]:
    """Generate daily sales summary report."""
    from sqlalchemy import create_engine
    import io

    execution_date = context['ds']
    engine = create_engine('postgresql://...')

    query = f"""
    SELECT
        DATE(order_date) AS date,
        COUNT(DISTINCT order_id) AS total_orders,
        COUNT(DISTINCT customer_id) AS unique_customers,
        SUM(total_amount) AS gross_revenue,
        SUM(discount_amount) AS total_discounts,
        SUM(total_amount - discount_amount) AS net_revenue,
        AVG(total_amount) AS avg_order_value
    FROM analytics.fct_orders
    WHERE DATE(order_date) = '{execution_date}'
      AND NOT is_cancelled
    GROUP BY DATE(order_date)
    """

    df = pd.read_sql(query, engine)

    # Calculate KPIs
    if not df.empty:
        report_data = {
            'date': execution_date,
            'total_orders': int(df['total_orders'].iloc[0]),
            'unique_customers': int(df['unique_customers'].iloc[0]),
            'gross_revenue': float(df['gross_revenue'].iloc[0]),
            'net_revenue': float(df['net_revenue'].iloc[0]),
            'avg_order_value': float(df['avg_order_value'].iloc[0])
        }
    else:
        report_data = {
            'date': execution_date,
            'total_orders': 0,
            'unique_customers': 0,
            'gross_revenue': 0,
            'net_revenue': 0,
            'avg_order_value': 0
        }

    # Store report data for downstream tasks
    return report_data


def generate_excel_report(**context) -> str:
    """Generate Excel report with multiple sheets."""
    from openpyxl import Workbook
    from openpyxl.styles import Font, Alignment, PatternFill
    from openpyxl.chart import BarChart, Reference
    import tempfile
    import os

    ti = context['ti']
    report_data = ti.xcom_pull(task_ids='generate.sales_summary')
    execution_date = context['ds']

    # Create workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Daily Summary"

    # Header styling
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")

    # Write headers
    headers = ['Metric', 'Value', 'Change vs Yesterday', 'Status']
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center')

    # Write data rows
    metrics = [
        ('Total Orders', report_data['total_orders'], '+5%', 'On Track'),
        ('Unique Customers', report_data['unique_customers'], '+3%', 'On Track'),
        ('Gross Revenue', f"${report_data['gross_revenue']:,.2f}", '+8%', 'Above Target'),
        ('Net Revenue', f"${report_data['net_revenue']:,.2f}", '+7%', 'Above Target'),
        ('Avg Order Value', f"${report_data['avg_order_value']:,.2f}", '+2%', 'On Track'),
    ]

    for row, (metric, value, change, status) in enumerate(metrics, 2):
        ws.cell(row=row, column=1, value=metric)
        ws.cell(row=row, column=2, value=value)
        ws.cell(row=row, column=3, value=change)
        ws.cell(row=row, column=4, value=status)

    # Adjust column widths
    ws.column_dimensions['A'].width = 20
    ws.column_dimensions['B'].width = 15
    ws.column_dimensions['C'].width = 18
    ws.column_dimensions['D'].width = 12

    # Save to temp file
    report_path = f"/tmp/daily_sales_report_{execution_date}.xlsx"
    wb.save(report_path)

    return report_path


def format_slack_message(**context) -> str:
    """Format report for Slack delivery."""
    ti = context['ti']
    report_data = ti.xcom_pull(task_ids='generate.sales_summary')

    message = f"""
:chart_with_upwards_trend: *Daily Sales Report - {report_data['date']}*

*Key Metrics:*
- Orders: *{report_data['total_orders']:,}*
- Customers: *{report_data['unique_customers']:,}*
- Revenue: *${report_data['net_revenue']:,.2f}*
- AOV: *${report_data['avg_order_value']:,.2f}*

<https://dashboard.company.com/daily|View Full Dashboard>
"""
    return message


with DAG(
    dag_id='daily_sales_report',
    default_args=default_args,
    description='Generate and distribute daily sales report',
    schedule_interval='0 8 * * *',  # 8 AM daily
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['reporting', 'daily', 'sales'],
) as dag:

    with TaskGroup(group_id='generate') as generate_group:
        sales_summary = PythonOperator(
            task_id='sales_summary',
            python_callable=generate_daily_sales_report,
        )

        excel_report = PythonOperator(
            task_id='excel_report',
            python_callable=generate_excel_report,
        )

        sales_summary >> excel_report

    with TaskGroup(group_id='distribute') as distribute_group:
        format_slack = PythonOperator(
            task_id='format_slack',
            python_callable=format_slack_message,
        )

        send_slack = SlackWebhookOperator(
            task_id='send_slack',
            webhook_token='{{ var.value.slack_webhook }}',
            message="{{ ti.xcom_pull(task_ids='distribute.format_slack') }}",
            channel='#daily-reports',
        )

        send_email = EmailOperator(
            task_id='send_email',
            to=['executives@company.com'],
            subject='Daily Sales Report - {{ ds }}',
            html_content="""
            <h2>Daily Sales Report</h2>
            <p>Please find attached the daily sales report.</p>
            <p><a href="https://dashboard.company.com/daily">View Dashboard</a></p>
            """,
            files=["{{ ti.xcom_pull(task_ids='generate.excel_report') }}"],
        )

        format_slack >> send_slack
        send_email

    generate_group >> distribute_group
```

### 2. Dashboard Configuration

```python
# dashboard/dashboard_generator.py
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
import json

class ChartType(Enum):
    LINE = "line"
    BAR = "bar"
    PIE = "pie"
    TABLE = "table"
    KPI = "kpi"
    HEATMAP = "heatmap"
    SCATTER = "scatter"

@dataclass
class Metric:
    """Dashboard metric definition."""
    name: str
    query: str
    format: str = "number"  # number, currency, percent
    comparison: Optional[str] = None  # previous_period, previous_year
    thresholds: Dict[str, float] = field(default_factory=dict)

@dataclass
class Chart:
    """Dashboard chart definition."""
    id: str
    title: str
    type: ChartType
    metrics: List[Metric]
    dimensions: List[str] = field(default_factory=list)
    filters: Dict[str, Any] = field(default_factory=dict)
    width: int = 6  # Grid columns (1-12)
    height: int = 4  # Grid rows

@dataclass
class Dashboard:
    """Complete dashboard definition."""
    id: str
    title: str
    description: str
    charts: List[Chart]
    refresh_interval: int = 3600  # seconds
    filters: List[Dict[str, Any]] = field(default_factory=list)
    access_roles: List[str] = field(default_factory=list)


class DashboardBuilder:
    """Builder for creating dashboard configurations."""

    def __init__(self, id: str, title: str):
        self.id = id
        self.title = title
        self.description = ""
        self.charts: List[Chart] = []
        self.filters: List[Dict] = []
        self.access_roles: List[str] = []

    def with_description(self, description: str) -> 'DashboardBuilder':
        self.description = description
        return self

    def add_kpi_card(
        self,
        id: str,
        title: str,
        metric: Metric,
        width: int = 3
    ) -> 'DashboardBuilder':
        self.charts.append(Chart(
            id=id,
            title=title,
            type=ChartType.KPI,
            metrics=[metric],
            width=width,
            height=2
        ))
        return self

    def add_line_chart(
        self,
        id: str,
        title: str,
        metrics: List[Metric],
        time_dimension: str,
        width: int = 6
    ) -> 'DashboardBuilder':
        self.charts.append(Chart(
            id=id,
            title=title,
            type=ChartType.LINE,
            metrics=metrics,
            dimensions=[time_dimension],
            width=width,
            height=4
        ))
        return self

    def add_bar_chart(
        self,
        id: str,
        title: str,
        metric: Metric,
        dimension: str,
        width: int = 6
    ) -> 'DashboardBuilder':
        self.charts.append(Chart(
            id=id,
            title=title,
            type=ChartType.BAR,
            metrics=[metric],
            dimensions=[dimension],
            width=width,
            height=4
        ))
        return self

    def add_table(
        self,
        id: str,
        title: str,
        metrics: List[Metric],
        dimensions: List[str],
        width: int = 12
    ) -> 'DashboardBuilder':
        self.charts.append(Chart(
            id=id,
            title=title,
            type=ChartType.TABLE,
            metrics=metrics,
            dimensions=dimensions,
            width=width,
            height=6
        ))
        return self

    def add_filter(
        self,
        name: str,
        field: str,
        type: str = "select",
        default: Any = None
    ) -> 'DashboardBuilder':
        self.filters.append({
            'name': name,
            'field': field,
            'type': type,
            'default': default
        })
        return self

    def with_access(self, roles: List[str]) -> 'DashboardBuilder':
        self.access_roles = roles
        return self

    def build(self) -> Dashboard:
        return Dashboard(
            id=self.id,
            title=self.title,
            description=self.description,
            charts=self.charts,
            filters=self.filters,
            access_roles=self.access_roles
        )


# Example dashboard definition
def create_sales_dashboard() -> Dashboard:
    """Create the main sales dashboard."""

    revenue_metric = Metric(
        name="revenue",
        query="SUM(net_revenue)",
        format="currency",
        comparison="previous_period",
        thresholds={"warning": 10000, "critical": 5000}
    )

    orders_metric = Metric(
        name="orders",
        query="COUNT(DISTINCT order_id)",
        format="number",
        comparison="previous_period"
    )

    aov_metric = Metric(
        name="aov",
        query="AVG(total_amount)",
        format="currency"
    )

    dashboard = (
        DashboardBuilder("sales-overview", "Sales Overview")
        .with_description("Key sales metrics and trends")
        .add_kpi_card("revenue-kpi", "Total Revenue", revenue_metric)
        .add_kpi_card("orders-kpi", "Total Orders", orders_metric)
        .add_kpi_card("aov-kpi", "Avg Order Value", aov_metric)
        .add_line_chart(
            "revenue-trend",
            "Revenue Trend",
            [revenue_metric],
            "order_date",
            width=8
        )
        .add_bar_chart(
            "revenue-by-channel",
            "Revenue by Channel",
            revenue_metric,
            "order_channel",
            width=4
        )
        .add_table(
            "top-products",
            "Top Products",
            [revenue_metric, orders_metric],
            ["product_name", "category"]
        )
        .add_filter("Date Range", "order_date", "daterange")
        .add_filter("Channel", "order_channel", "multiselect")
        .with_access(["analysts", "executives"])
        .build()
    )

    return dashboard
```

### 3. Alert System

```python
# alerts/alert_system.py
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, Callable
from enum import Enum
from datetime import datetime
import pandas as pd

class AlertSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class AlertCondition(Enum):
    ABOVE_THRESHOLD = "above"
    BELOW_THRESHOLD = "below"
    CHANGE_PERCENT = "change_percent"
    ANOMALY = "anomaly"
    MISSING_DATA = "missing"

@dataclass
class AlertRule:
    """Definition of an alert rule."""
    id: str
    name: str
    description: str
    metric_query: str
    condition: AlertCondition
    threshold: float
    severity: AlertSeverity
    notification_channels: List[str]
    evaluation_window: str = "1h"
    cooldown_minutes: int = 60
    enabled: bool = True

@dataclass
class AlertEvent:
    """An alert event that was triggered."""
    rule_id: str
    rule_name: str
    severity: AlertSeverity
    triggered_at: datetime
    current_value: float
    threshold: float
    message: str
    context: Dict[str, Any]

class AlertEngine:
    """Engine for evaluating and triggering alerts."""

    def __init__(self, db_connection):
        self.conn = db_connection
        self.rules: Dict[str, AlertRule] = {}
        self.last_triggered: Dict[str, datetime] = {}
        self.notification_handlers: Dict[str, Callable] = {}

    def register_rule(self, rule: AlertRule) -> None:
        """Register an alert rule."""
        self.rules[rule.id] = rule

    def register_notification_handler(
        self,
        channel: str,
        handler: Callable[[AlertEvent], None]
    ) -> None:
        """Register a notification handler for a channel."""
        self.notification_handlers[channel] = handler

    def evaluate_rule(self, rule: AlertRule) -> Optional[AlertEvent]:
        """Evaluate a single alert rule."""
        if not rule.enabled:
            return None

        # Check cooldown
        last = self.last_triggered.get(rule.id)
        if last:
            minutes_since = (datetime.utcnow() - last).total_seconds() / 60
            if minutes_since < rule.cooldown_minutes:
                return None

        # Execute metric query
        df = pd.read_sql(rule.metric_query, self.conn)
        if df.empty:
            if rule.condition == AlertCondition.MISSING_DATA:
                return self._create_alert(rule, 0, "No data returned")
            return None

        current_value = df.iloc[0, 0]

        # Evaluate condition
        triggered = False
        message = ""

        if rule.condition == AlertCondition.ABOVE_THRESHOLD:
            triggered = current_value > rule.threshold
            message = f"{rule.name}: {current_value:.2f} exceeds threshold {rule.threshold:.2f}"

        elif rule.condition == AlertCondition.BELOW_THRESHOLD:
            triggered = current_value < rule.threshold
            message = f"{rule.name}: {current_value:.2f} below threshold {rule.threshold:.2f}"

        elif rule.condition == AlertCondition.CHANGE_PERCENT:
            # Assumes query returns current and previous values
            if len(df.columns) >= 2:
                previous_value = df.iloc[0, 1]
                if previous_value != 0:
                    change = abs((current_value - previous_value) / previous_value * 100)
                    triggered = change > rule.threshold
                    message = f"{rule.name}: Changed {change:.1f}% (threshold: {rule.threshold}%)"

        if triggered:
            return self._create_alert(rule, current_value, message)

        return None

    def _create_alert(
        self,
        rule: AlertRule,
        value: float,
        message: str
    ) -> AlertEvent:
        """Create an alert event."""
        self.last_triggered[rule.id] = datetime.utcnow()

        return AlertEvent(
            rule_id=rule.id,
            rule_name=rule.name,
            severity=rule.severity,
            triggered_at=datetime.utcnow(),
            current_value=value,
            threshold=rule.threshold,
            message=message,
            context={'evaluation_window': rule.evaluation_window}
        )

    def send_notifications(self, event: AlertEvent) -> None:
        """Send notifications for an alert event."""
        rule = self.rules.get(event.rule_id)
        if not rule:
            return

        for channel in rule.notification_channels:
            handler = self.notification_handlers.get(channel)
            if handler:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Failed to send to {channel}: {e}")

    def evaluate_all(self) -> List[AlertEvent]:
        """Evaluate all registered rules."""
        events = []
        for rule in self.rules.values():
            event = self.evaluate_rule(rule)
            if event:
                events.append(event)
                self.send_notifications(event)
        return events


# Notification handlers
def slack_notification(event: AlertEvent) -> None:
    """Send alert to Slack."""
    import requests

    severity_emoji = {
        AlertSeverity.INFO: ":information_source:",
        AlertSeverity.WARNING: ":warning:",
        AlertSeverity.CRITICAL: ":rotating_light:"
    }

    payload = {
        "text": f"{severity_emoji[event.severity]} *{event.rule_name}*",
        "attachments": [{
            "color": "danger" if event.severity == AlertSeverity.CRITICAL else "warning",
            "fields": [
                {"title": "Message", "value": event.message, "short": False},
                {"title": "Current Value", "value": str(event.current_value), "short": True},
                {"title": "Threshold", "value": str(event.threshold), "short": True},
                {"title": "Time", "value": event.triggered_at.isoformat(), "short": True}
            ]
        }]
    }

    requests.post("https://hooks.slack.com/services/...", json=payload)


def email_notification(event: AlertEvent) -> None:
    """Send alert via email."""
    import smtplib
    from email.mime.text import MIMEText

    msg = MIMEText(f"""
Alert: {event.rule_name}
Severity: {event.severity.value}
Time: {event.triggered_at}

{event.message}

Current Value: {event.current_value}
Threshold: {event.threshold}
    """)

    msg['Subject'] = f"[{event.severity.value.upper()}] {event.rule_name}"
    msg['From'] = "alerts@company.com"
    msg['To'] = "oncall@company.com"

    # Send email
    with smtplib.SMTP('smtp.company.com') as server:
        server.send_message(msg)


# Example alert rules
def configure_sales_alerts(engine: AlertEngine) -> None:
    """Configure sales-related alerts."""

    engine.register_rule(AlertRule(
        id="low-hourly-revenue",
        name="Low Hourly Revenue",
        description="Revenue in the last hour is below threshold",
        metric_query="""
            SELECT SUM(net_revenue) as revenue
            FROM analytics.fct_orders
            WHERE order_date >= NOW() - INTERVAL '1 hour'
        """,
        condition=AlertCondition.BELOW_THRESHOLD,
        threshold=1000,
        severity=AlertSeverity.WARNING,
        notification_channels=["slack"],
        evaluation_window="1h"
    ))

    engine.register_rule(AlertRule(
        id="revenue-drop",
        name="Revenue Drop Alert",
        description="Revenue dropped significantly vs previous period",
        metric_query="""
            SELECT
                SUM(CASE WHEN order_date >= NOW() - INTERVAL '1 hour' THEN net_revenue ELSE 0 END) as current,
                SUM(CASE WHEN order_date >= NOW() - INTERVAL '2 hours' AND order_date < NOW() - INTERVAL '1 hour' THEN net_revenue ELSE 0 END) as previous
            FROM analytics.fct_orders
        """,
        condition=AlertCondition.CHANGE_PERCENT,
        threshold=30,  # 30% change triggers alert
        severity=AlertSeverity.CRITICAL,
        notification_channels=["slack", "email", "pagerduty"],
        cooldown_minutes=120
    ))

    engine.register_notification_handler("slack", slack_notification)
    engine.register_notification_handler("email", email_notification)
```

## Tools and Technologies

### BI Platforms
| Tool | Strengths | Best For |
|------|-----------|----------|
| Looker | Semantic layer | Enterprise |
| Tableau | Visualization | Exploration |
| Power BI | Microsoft ecosystem | Office users |
| Metabase | Open source | Small teams |

### Scheduling
| Tool | Purpose | Integration |
|------|---------|-------------|
| Airflow | Complex DAGs | Data teams |
| dbt Cloud | dbt jobs | Analytics |
| Cron | Simple scheduling | Linux |
| Cloud Scheduler | Serverless | Cloud native |

## Metrics and Monitoring

### Report Health Metrics

```yaml
# Prometheus metrics for reporting
groups:
  - name: reporting_alerts
    rules:
      - alert: ReportDeliveryFailed
        expr: report_delivery_status != 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Report {{ $labels.report_name }} failed to deliver"

      - alert: ReportDeliveryDelayed
        expr: time() - report_last_delivered_timestamp > 7200
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Report {{ $labels.report_name }} is overdue"

      - alert: DashboardQuerySlow
        expr: dashboard_query_duration_seconds > 30
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Dashboard query taking too long"
```

## Common Pitfalls

### 1. Report Sprawl
**Problem**: Too many reports, nobody uses them
**Solution**: Regular report auditing and cleanup

### 2. Manual Dependencies
**Problem**: Reports require manual data prep
**Solution**: Full automation from source to delivery

### 3. Stale Data
**Problem**: Reports show outdated information
**Solution**: Clear freshness indicators

### 4. Alert Fatigue
**Problem**: Too many alerts, ignored
**Solution**: Tune thresholds, prioritize

### 5. No Mobile Access
**Problem**: Executives can't view on phone
**Solution**: Mobile-friendly dashboards

## Integration Points

### Upstream Dependencies
- **Data Warehouse**: Source data
- **Analytics Models**: Metric definitions
- **Scheduler**: Job orchestration
- **Auth Systems**: Access control

### Downstream Consumers
- **Executives**: Strategic reports
- **Analysts**: Self-service dashboards
- **Operations**: Real-time monitors
- **External**: Customer reports

## Best Practices Checklist

- [ ] Reports scheduled with monitoring
- [ ] Delivery confirmation tracking
- [ ] Metric definitions documented
- [ ] Dashboard performance optimized
- [ ] Alert thresholds tuned
- [ ] Mobile accessibility tested
- [ ] Access controls configured
- [ ] Report usage tracked
- [ ] Stale report cleanup process
- [ ] Disaster recovery for BI tools
