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


## References
- `references/4-alertmanager-configuration.md` — 4. Alertmanager Configuration
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
