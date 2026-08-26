---
name: monitoring-observability
description: Production monitoring with Prometheus, Grafana, ELK stack, and distributed tracing. Includes alerting and incident response. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Monitoring & Observability

## Overview

## Metrics (Prometheus + Grafana)

**Node.js Instrumentation**
```javascript
const promClient = require('prom-client');
const express = require('express');
const app = express();

// Default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.send(await promClient.register.metrics());
});
```

**Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
```

## Logging (ELK Stack)

**Winston Logger**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api', environment: process.env.NODE_ENV },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Usage
logger.info('User logged in', { userId: '123', ip: req.ip });
logger.error('Database connection failed', { error: err.message });
```

**Filebeat Configuration**
```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    json.keys_under_root: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "app-logs-%{+yyyy.MM.dd}"
```

## Distributed Tracing (Jaeger)

**OpenTelemetry Instrumentation**
```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const provider = new NodeTracerProvider();

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://jaeger:14268/api/traces'
    })
  )
);

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});
```

## Alerting (Alertmanager)

```yaml
# alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'slack-notifications'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

**Prometheus Alert Rules**
```yaml
# alerts.yml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}%"
      
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "P95 latency is {{ $value }}s"
```

## Health Checks

```javascript
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    services: {}
  };
  
  // Database check
  try {
    await db.query('SELECT 1');
    checks.services.database = 'healthy';
  } catch (err) {
    checks.services.database = 'unhealthy';
    checks.status = 'degraded';
  }
  
  // Redis check
  try {
    await redis.ping();
    checks.services.redis = 'healthy';
  } catch (err) {
    checks.services.redis = 'unhealthy';
    checks.status = 'degraded';
  }
  
  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});
```

## Grafana Dashboards

```json
{
  "dashboard": {
    "title": "API Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
        }]
      },
      {
        "title": "P95 Latency",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
        }]
      }
    ]
  }
}
```

## Quality Gates
- ✅ All services expose /health and /metrics endpoints
- ✅ Alerts configured for critical metrics
- ✅ Logs centralized and searchable
- ✅ Distributed tracing for all requests
- ✅ Dashboards show SLIs (latency, error rate, throughput)

## Resources
- Prometheus Docs: https://prometheus.io/docs/
- Grafana: https://grafana.com/docs/
- OpenTelemetry: https://opentelemetry.io/docs/
