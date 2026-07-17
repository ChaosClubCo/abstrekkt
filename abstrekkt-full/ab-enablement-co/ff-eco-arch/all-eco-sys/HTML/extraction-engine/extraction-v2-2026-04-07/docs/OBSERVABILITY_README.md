# AI Orchestration Platform — Observability Stack

## Overview

Complete metrics + logs + traces stack for local and staging environments.

```
App → OTel Collector → Prometheus (metrics)
                     → Loki (logs)
                     → Tempo (traces)
                     ↓
               Grafana (visualization)
                     ↓
               Alertmanager (alerts → Slack)
```

## Prerequisites

- Docker 24+
- Docker Compose v2.20+
- 4GB RAM available

## Quickstart

```bash
# 1. Copy and populate env file
cp configs/.env.template configs/.env
# Edit configs/.env — set Grafana password and Slack webhook

# 2. Start stack
docker compose up -d

# 3. Verify
curl -f http://localhost:9090/-/healthy   # Prometheus
curl -f http://localhost:3000/api/health  # Grafana
curl -f http://localhost:3100/ready       # Loki
curl -f http://localhost:3200/ready       # Tempo

# 4. Open Grafana
open http://localhost:3000
# Login: admin / (password from .env)
```

## Service Ports

| Service | Port | Purpose |
|---|---|---|
| Grafana | 3000 | Dashboards |
| Loki | 3100 | Log ingestion + query |
| Tempo | 3200 | Trace query |
| Prometheus | 9090 | Metrics query + scrape |
| OTel gRPC | 4317 | App → OTel (gRPC) |
| OTel HTTP | 4318 | App → OTel (HTTP) |
| Alertmanager | 9093 | Alert routing |

## Instrument Your App

### Node.js (OTLP HTTP)

```bash
npm install @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http
```

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
  }),
});
sdk.start();
```

## Missing Config Files — Tuning Points

| File | Assumption | Tune If |
|---|---|---|
| prometheus.yml | App exposes /metrics on :8080 | Different port or path |
| otel-collector-config.yaml | App sends OTLP to :4317/:4318 | Different protocol |
| promtail-config.yaml | JSON structured logs with `level` field | Different log format |
| alertmanager.yml | Slack as primary notification | Different receiver needed |

## Rollback

```bash
docker compose down -v   # removes all data volumes — destructive
docker compose down      # stops services, preserves data
```

## Security Notes

- Default Grafana credentials are in `.env` — rotate before any non-local use
- All service communication is on an internal Docker bridge network
- No TLS between services — add Nginx + cert-manager for production
- Alertmanager webhook URLs are secrets — treat `.env` as sensitive
