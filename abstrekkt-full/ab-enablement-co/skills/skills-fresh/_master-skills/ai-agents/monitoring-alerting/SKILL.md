---
name: monitoring-alerting
description: name: monitoring-alerting description: Prometheus, Grafana, PagerDuty setup for comprehensive observability and incident response. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Monitoring and Alerting

---
name: monitoring-alerting
description: Prometheus, Grafana, PagerDuty setup for comprehensive observability and incident response
version: 1.0.0
category: infrastructure
tags: [monitoring, alerting, prometheus, grafana, observability, pagerduty]
related_skills: [log-management, server-administration, incident-response]
---

## Overview

Monitoring and Alerting provides the observability foundation for reliable systems. This skill covers the implementation of metrics collection, visualization dashboards, alerting rules, and incident notification systems using industry-standard tools like Prometheus, Grafana, and PagerDuty.

Effective monitoring goes beyond simple health checks to provide deep insights into system behavior, enabling proactive problem detection and rapid incident response. The goal is to detect issues before users notice them and provide the data needed for quick resolution.

### Key Principles

1. **Four Golden Signals**: Monitor latency, traffic, errors, and saturation
2. **Symptom-Based Alerting**: Alert on user-facing symptoms, not causes
3. **Actionable Alerts**: Every alert should have a clear response action
4. **Appropriate Granularity**: Balance detail with signal-to-noise ratio
5. **Service Level Objectives**: Define and measure reliability targets

## When to Use This Skill

### Appropriate Scenarios

- Setting up observability for new services
- Implementing SLO-based monitoring
- Creating operational dashboards
- Configuring on-call alerting workflows
- Troubleshooting performance issues
- Capacity planning and trend analysis
- Incident post-mortem analysis
- Compliance audit support

### When to Consider Alternatives

- **Simple static sites**: Basic uptime monitoring may suffice
- **Managed services**: Cloud-native monitoring often included
- **Log-centric issues**: Use log-management skill
- **Security events**: Use specialized SIEM tools

## Core Processes

### 1. Prometheus Configuration

```yaml
# prometheus.yml - Complete configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: production
    env: prod

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093
      timeout: 10s
      api_version: v2

# Rule files
rule_files:
  - /etc/prometheus/rules/*.yml

# Scrape configurations
scrape_configs:
  # Prometheus self-monitoring
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]

  # Kubernetes service discovery
  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: pod

  # Node exporter for system metrics
  - job_name: node-exporter
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
      - source_labels: [__address__]
        regex: ([^:]+):.*
        replacement: $1:9100
        target_label: __address__

  # Application endpoints
  - job_name: api-service
    metrics_path: /metrics
    static_configs:
      - targets:
          - api-service.production.svc:8080
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: go_.*
        action: drop
```

### 2. Alerting Rules

```yaml
# alerts.yml - Production alerting rules
groups:
  - name: slo_alerts
    rules:
      # Error budget alerts
      - alert: ErrorBudgetBurn
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[1h]))
          / sum(rate(http_requests_total[1h])) > 0.001
        for: 5m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "Error rate exceeds SLO for {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }}, exceeding 0.1% SLO"
          runbook_url: "https://runbooks.example.com/error-budget"

      # Latency SLO
      - alert: LatencySLOViolation
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
          ) > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "P99 latency exceeds 500ms for {{ $labels.service }}"
          description: "P99 latency is {{ $value | humanizeDuration }}"

  - name: availability_alerts
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.instance }} has been unreachable for more than 1 minute"

      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          / sum(rate(http_requests_total[5m])) by (service) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: PodCrashLooping
        expr: |
          increase(kube_pod_container_status_restarts_total[1h]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"

  - name: resource_alerts
    rules:
      - alert: HighCPUUsage
        expr: |
          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is {{ $value | humanize }}%"

      - alert: HighMemoryUsage
        expr: |
          (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: |
          (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 15
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
          description: "Only {{ $value | humanize }}% disk space remaining"

      - alert: DiskSpaceCritical
        expr: |
          (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Critical disk space on {{ $labels.instance }}"
```

### 3. Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Service Overview",
    "tags": ["production", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{ service }}"
          }
        ],
        "yAxes": [
          { "label": "requests/sec", "min": 0 }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "gridPos": { "x": 12, "y": 0, "w": 12, "h": 8 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) * 100",
            "legendFormat": "{{ service }}"
          }
        ],
        "yAxes": [
          { "label": "error %", "min": 0, "max": 100 }
        ],
        "thresholds": [
          { "value": 1, "colorMode": "warning" },
          { "value": 5, "colorMode": "critical" }
        ]
      },
      {
        "title": "Latency Distribution",
        "type": "heatmap",
        "gridPos": { "x": 0, "y": 8, "w": 24, "h": 8 },
        "targets": [
          {
            "expr": "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)",
            "format": "heatmap",
            "legendFormat": "{{ le }}"
          }
        ],
        "options": {
          "calculate": true,
          "yAxis": {
            "unit": "s"
          }
        }
      },
      {
        "title": "SLO Status",
        "type": "stat",
        "gridPos": { "x": 0, "y": 16, "w": 6, "h": 4 },
        "targets": [
          {
            "expr": "(1 - (sum(rate(http_requests_total{status=~\"5..\"}[30d])) / sum(rate(http_requests_total[30d])))) * 100",
            "legendFormat": "Availability"
          }
        ],
        "options": {
          "colorMode": "background",
          "thresholds": {
            "steps": [
              { "value": 99, "color": "red" },
              { "value": 99.5, "color": "yellow" },
              { "value": 99.9, "color": "green" }
            ]
          }
        },
        "unit": "percent"
      }
    ],
    "templating": {
      "list": [
        {
          "name": "service",
          "type": "query",
          "query": "label_values(http_requests_total, service)",
          "multi": true,
          "includeAll": true
        }
      ]
    }
  }
}
```

### 4. Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/xxx'
  pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'

templates:
  - '/etc/alertmanager/templates/*.tmpl'

route:
  receiver: 'default-receiver'
  group_by: ['alertname', 'service', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    # Critical alerts go to PagerDuty
    - receiver: 'pagerduty-critical'
      match:
        severity: critical
      continue: true

    # All alerts to Slack
    - receiver: 'slack-alerts'
      match_re:
        severity: warning|critical

    # Database alerts to DBA team
    - receiver: 'dba-team'
      match:
        team: database
      group_by: ['alertname', 'database']

    # Silence during maintenance windows
    - receiver: 'null'
      match:
        maintenance: 'true'

receivers:
  - name: 'default-receiver'
    slack_configs:
      - channel: '#alerts'

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<pagerduty-service-key>'
        severity: critical
        description: '{{ .CommonAnnotations.summary }}'
        details:
          firing: '{{ template "pagerduty.instances" .Alerts.Firing }}'
          resolved: '{{ template "pagerduty.instances" .Alerts.Resolved }}'
          num_firing: '{{ .Alerts.Firing | len }}'
          num_resolved: '{{ .Alerts.Resolved | len }}'

  - name: 'slack-alerts'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true
        title: '{{ if eq .Status "firing" }}:fire:{{ else }}:white_check_mark:{{ end }} {{ .CommonLabels.alertname }}'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Severity:* {{ .Labels.severity }}
          *Description:* {{ .Annotations.description }}
          {{ if .Annotations.runbook_url }}*Runbook:* {{ .Annotations.runbook_url }}{{ end }}
          {{ end }}

  - name: 'dba-team'
    email_configs:
      - to: 'dba-team@example.com'
        send_resolved: true

  - name: 'null'

inhibit_rules:
  # Inhibit warning if critical is firing
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'service']

  # Inhibit all if cluster is down
  - source_match:
      alertname: 'ClusterDown'
    target_match_re:
      alertname: '.*'
    equal: ['cluster']
```

### 5. PagerDuty Integration

```python
# pagerduty_integration.py
import json
import requests
from datetime import datetime

class PagerDutyClient:
    def __init__(self, routing_key: str):
        self.routing_key = routing_key
        self.events_url = "https://events.pagerduty.com/v2/enqueue"

    def trigger_incident(
        self,
        summary: str,
        source: str,
        severity: str = "critical",
        custom_details: dict = None
    ) -> dict:
        """Trigger a PagerDuty incident."""
        payload = {
            "routing_key": self.routing_key,
            "event_action": "trigger",
            "dedup_key": f"{source}-{summary}",
            "payload": {
                "summary": summary,
                "source": source,
                "severity": severity,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "custom_details": custom_details or {}
            },
            "links": [
                {
                    "href": f"https://grafana.example.com/d/overview",
                    "text": "View Dashboard"
                }
            ],
            "images": [
                {
                    "src": "https://grafana.example.com/render/d/overview",
                    "alt": "Service Overview"
                }
            ]
        }

        response = requests.post(
            self.events_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )
        return response.json()

    def resolve_incident(self, dedup_key: str) -> dict:
        """Resolve a PagerDuty incident."""
        payload = {
            "routing_key": self.routing_key,
            "event_action": "resolve",
            "dedup_key": dedup_key
        }

        response = requests.post(
            self.events_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload)
        )
        return response.json()

# On-call schedule management
def get_current_oncall(api_key: str, schedule_id: str) -> dict:
    """Get the current on-call engineer."""
    headers = {
        "Authorization": f"Token token={api_key}",
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"https://api.pagerduty.com/schedules/{schedule_id}/users",
        headers=headers,
        params={"since": datetime.utcnow().isoformat()}
    )

    data = response.json()
    if data.get("users"):
        return data["users"][0]
    return None
```

## Tools and Technologies

### Metrics Collection
| Tool | Strengths | Use Case |
|------|-----------|----------|
| Prometheus | Pull-based, reliable | Kubernetes native |
| Datadog | SaaS, full-featured | Enterprise monitoring |
| InfluxDB | Time-series database | IoT and custom metrics |
| StatsD | Push-based, simple | Application metrics |

### Visualization
| Tool | Strengths | Best For |
|------|-----------|----------|
| Grafana | Flexible, open-source | Custom dashboards |
| Datadog | Integrated platform | Full-stack observability |
| Kibana | Log visualization | ELK stack users |
| Chronograf | InfluxDB native | InfluxDB users |

### Alerting Platforms
| Platform | Strengths | Use Case |
|----------|-----------|----------|
| PagerDuty | Mature, reliable | Enterprise on-call |
| Opsgenie | Atlassian integration | Jira users |
| VictorOps | DevOps focused | Incident automation |
| Alertmanager | Prometheus native | Open-source stack |

## Metrics and Monitoring

### SLO Calculation

```yaml
# Recording rules for SLO calculations
groups:
  - name: slo_recording_rules
    interval: 1m
    rules:
      # Availability SLO (target: 99.9%)
      - record: slo:availability:ratio
        expr: |
          sum(rate(http_requests_total{status!~"5.."}[5m]))
          / sum(rate(http_requests_total[5m]))

      # Error budget remaining
      - record: slo:error_budget:remaining
        expr: |
          1 - (
            (1 - slo:availability:ratio)
            / (1 - 0.999)
          )

      # Latency SLO (target: 99% under 200ms)
      - record: slo:latency:ratio
        expr: |
          sum(rate(http_request_duration_seconds_bucket{le="0.2"}[5m]))
          / sum(rate(http_request_duration_seconds_count[5m]))

      # Burn rate (1h window)
      - record: slo:burn_rate:1h
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[1h]))
          / sum(rate(http_requests_total[1h]))
          / 0.001
```

## Common Pitfalls

### 1. Alert Fatigue
**Problem**: Too many alerts lead to ignored notifications
**Solution**: Reduce noise with proper thresholds and deduplication

### 2. Missing Context in Alerts
**Problem**: Alerts lack information for diagnosis
**Solution**: Include runbook URLs, dashboards, and relevant metrics

### 3. Monitoring Only Happy Path
**Problem**: Missing edge cases and failure modes
**Solution**: Monitor dependencies, error paths, and queue depths

### 4. High Cardinality Labels
**Problem**: Unbounded labels explode metric storage
**Solution**: Use bounded, meaningful labels; avoid user IDs

### 5. No Alert Ownership
**Problem**: Unclear who responds to alerts
**Solution**: Define team ownership and escalation paths

## Integration Points

### Upstream Dependencies
- **Infrastructure**: Servers, containers, cloud services
- **Applications**: Custom metrics endpoints
- **Third-party Services**: APIs, SaaS dependencies
- **Network**: Connectivity and DNS

### Downstream Consumers
- **On-call Engineers**: Incident notifications
- **Dashboards**: Visualization for all teams
- **Automation**: Auto-remediation systems
- **Reporting**: SLO compliance reports

### Observability Stack
```
[Applications] --> [Prometheus/Collectors] --> [Time-Series DB]
                                                      |
                                                      v
                                               [Alert Rules]
                                                      |
                              +---------------+-------+-------+
                              |               |               |
                      [Alertmanager]    [Grafana]      [Recording Rules]
                              |               |
                    [PagerDuty/Slack]  [Dashboards]
```

## Best Practices Checklist

- [ ] Four golden signals monitored for all services
- [ ] SLOs defined with error budgets
- [ ] Alerts have runbooks and clear ownership
- [ ] Dashboard hierarchy: overview to detail
- [ ] Alert deduplication and grouping configured
- [ ] Escalation policies tested regularly
- [ ] Metrics retention appropriate for use case
- [ ] High cardinality labels avoided
- [ ] Synthetic monitoring for critical paths
- [ ] Regular alert review and pruning
