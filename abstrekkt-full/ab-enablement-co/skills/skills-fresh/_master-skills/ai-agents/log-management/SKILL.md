---
name: log-management
description: name: log-management description: ELK stack, log aggregation, analysis, and operational logging best practices. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Log Management

---
name: log-management
description: ELK stack, log aggregation, analysis, and operational logging best practices
version: 1.0.0
category: infrastructure
tags: [logging, elk, elasticsearch, kibana, observability, troubleshooting]
related_skills: [monitoring-alerting, incident-response, audit-logging]
---

## Overview

Log Management encompasses the collection, aggregation, storage, and analysis of log data from applications and infrastructure. This skill covers implementing centralized logging solutions using the ELK stack (Elasticsearch, Logstash, Kibana) and modern alternatives, enabling effective troubleshooting, security analysis, and operational insights.

Effective log management transforms raw log data into actionable intelligence, supporting incident response, performance optimization, and compliance requirements. The goal is to make finding the needle in the haystack fast and reliable.

### Key Principles

1. **Structured Logging**: Use consistent, parseable log formats (JSON)
2. **Centralized Collection**: Aggregate logs from all sources
3. **Correlation**: Enable tracing across services with request IDs
4. **Retention Policies**: Balance storage costs with compliance needs
5. **Access Control**: Protect sensitive log data appropriately

## When to Use This Skill

### Appropriate Scenarios

- Setting up centralized logging infrastructure
- Troubleshooting production issues
- Implementing log-based alerting
- Security event investigation
- Performance analysis and optimization
- Compliance and audit trail requirements
- Debugging distributed systems
- Root cause analysis

### When to Consider Alternatives

- **Simple applications**: Cloud-native logging may suffice
- **Metrics-focused analysis**: Use monitoring-alerting skill
- **Security-specific**: Consider SIEM platforms
- **Cost-constrained**: Evaluate log sampling strategies

## Core Processes

### 1. Structured Logging Implementation

```python
# Python structured logging configuration
import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict
import traceback

class JSONFormatter(logging.Formatter):
    """Custom JSON log formatter for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add correlation IDs if present
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
        if hasattr(record, 'trace_id'):
            log_data['trace_id'] = record.trace_id
        if hasattr(record, 'span_id'):
            log_data['span_id'] = record.span_id

        # Add exception info if present
        if record.exc_info:
            log_data['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'stacktrace': traceback.format_exception(*record.exc_info)
            }

        # Add extra fields
        if hasattr(record, 'extra_fields'):
            log_data.update(record.extra_fields)

        return json.dumps(log_data)


def configure_logging(service_name: str, log_level: str = "INFO"):
    """Configure structured logging for a service."""
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level))

    # Remove existing handlers
    root_logger.handlers = []

    # Console handler with JSON format
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(console_handler)

    # Add service context
    old_factory = logging.getLogRecordFactory()

    def record_factory(*args, **kwargs):
        record = old_factory(*args, **kwargs)
        record.service = service_name
        return record

    logging.setLogRecordFactory(record_factory)


class ContextLogger:
    """Logger with automatic context injection."""

    def __init__(self, logger: logging.Logger):
        self.logger = logger
        self.context: Dict[str, Any] = {}

    def bind(self, **kwargs) -> 'ContextLogger':
        """Add context that will be included in all log messages."""
        new_logger = ContextLogger(self.logger)
        new_logger.context = {**self.context, **kwargs}
        return new_logger

    def _log(self, level: int, message: str, **kwargs):
        extra = {'extra_fields': {**self.context, **kwargs}}
        self.logger.log(level, message, extra=extra)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log(logging.ERROR, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)


# Usage example
configure_logging("api-service")
logger = ContextLogger(logging.getLogger(__name__))

# Bind request context
request_logger = logger.bind(
    request_id="abc-123",
    user_id="user-456",
    endpoint="/api/orders"
)

request_logger.info("Processing order", order_id="order-789", items=3)
```

### 2. Elasticsearch Cluster Configuration

```yaml
# elasticsearch.yml - Production configuration
cluster.name: production-logs
node.name: ${HOSTNAME}

# Paths
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch

# Network
network.host: 0.0.0.0
http.port: 9200
transport.port: 9300

# Discovery
discovery.seed_hosts:
  - es-node-1.internal
  - es-node-2.internal
  - es-node-3.internal
cluster.initial_master_nodes:
  - es-node-1
  - es-node-2
  - es-node-3

# Node roles (configure per node type)
node.roles: [master, data, ingest]

# Memory
bootstrap.memory_lock: true

# Security
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: /etc/elasticsearch/certs/elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: /etc/elasticsearch/certs/elastic-certificates.p12

xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: /etc/elasticsearch/certs/http.p12

# Index settings
action.auto_create_index: +logs-*,-*

# Shard allocation
cluster.routing.allocation.awareness.attributes: zone
cluster.routing.allocation.awareness.force.zone.values: zone-a,zone-b,zone-c
```

### 3. Logstash Pipeline

```ruby
# logstash.conf - Log processing pipeline
input {
  beats {
    port => 5044
    ssl => true
    ssl_certificate => "/etc/logstash/certs/logstash.crt"
    ssl_key => "/etc/logstash/certs/logstash.key"
  }

  kafka {
    bootstrap_servers => "kafka:9092"
    topics => ["application-logs", "system-logs"]
    codec => json
    group_id => "logstash-consumer"
    consumer_threads => 3
  }
}

filter {
  # Parse JSON logs
  if [message] =~ /^\{/ {
    json {
      source => "message"
      target => "parsed"
    }
    mutate {
      rename => { "[parsed][timestamp]" => "@timestamp" }
      rename => { "[parsed][level]" => "level" }
      rename => { "[parsed][message]" => "log_message" }
      remove_field => ["message"]
    }
  }

  # Parse nginx access logs
  if [fields][type] == "nginx-access" {
    grok {
      match => {
        "message" => '%{IPORHOST:client_ip} - %{DATA:user_name} \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{DATA:request} HTTP/%{NUMBER:http_version}" %{NUMBER:response_code} %{NUMBER:bytes} "%{DATA:referrer}" "%{DATA:user_agent}" %{NUMBER:request_time}'
      }
    }
    date {
      match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    }
    geoip {
      source => "client_ip"
      target => "geoip"
    }
    useragent {
      source => "user_agent"
      target => "user_agent_parsed"
    }
  }

  # Parse application error logs
  if [level] == "ERROR" {
    mutate {
      add_tag => ["error"]
    }
    if [parsed][exception] {
      mutate {
        add_field => {
          "exception_type" => "%{[parsed][exception][type]}"
          "exception_message" => "%{[parsed][exception][message]}"
        }
      }
    }
  }

  # Add environment metadata
  mutate {
    add_field => {
      "environment" => "${ENVIRONMENT:production}"
      "cluster" => "${CLUSTER:default}"
    }
  }

  # Mask sensitive data
  mutate {
    gsub => [
      "log_message", "password[=:]\s*\S+", "password=REDACTED",
      "log_message", "api[_-]?key[=:]\s*\S+", "api_key=REDACTED",
      "log_message", "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", "[EMAIL_REDACTED]"
    ]
  }

  # Calculate request duration bucket
  if [request_time] {
    ruby {
      code => '
        request_time = event.get("request_time").to_f
        if request_time < 0.1
          bucket = "fast"
        elsif request_time < 0.5
          bucket = "normal"
        elsif request_time < 2.0
          bucket = "slow"
        else
          bucket = "very_slow"
        end
        event.set("latency_bucket", bucket)
      '
    }
  }
}

output {
  elasticsearch {
    hosts => ["https://elasticsearch:9200"]
    user => "${ES_USER}"
    password => "${ES_PASSWORD}"
    ssl => true
    cacert => "/etc/logstash/certs/ca.crt"
    index => "logs-%{[fields][type]}-%{+YYYY.MM.dd}"
    ilm_enabled => true
    ilm_rollover_alias => "logs-%{[fields][type]}"
    ilm_pattern => "000001"
    ilm_policy => "logs-policy"
  }

  # Send errors to dedicated index
  if "error" in [tags] {
    elasticsearch {
      hosts => ["https://elasticsearch:9200"]
      user => "${ES_USER}"
      password => "${ES_PASSWORD}"
      ssl => true
      cacert => "/etc/logstash/certs/ca.crt"
      index => "errors-%{+YYYY.MM.dd}"
    }
  }
}
```

### 4. Index Lifecycle Management

```json
// ILM Policy for log retention
PUT _ilm/policy/logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_primary_shard_size": "50gb",
            "max_age": "1d"
          },
          "set_priority": {
            "priority": 100
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          },
          "forcemerge": {
            "max_num_segments": 1
          },
          "set_priority": {
            "priority": 50
          },
          "allocate": {
            "require": {
              "data": "warm"
            }
          }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "set_priority": {
            "priority": 0
          },
          "allocate": {
            "require": {
              "data": "cold"
            }
          },
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}

// Index template
PUT _index_template/logs-template
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "index.lifecycle.name": "logs-policy",
      "index.lifecycle.rollover_alias": "logs"
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "service": { "type": "keyword" },
        "request_id": { "type": "keyword" },
        "trace_id": { "type": "keyword" },
        "log_message": { "type": "text" },
        "client_ip": { "type": "ip" },
        "response_code": { "type": "integer" },
        "request_time": { "type": "float" },
        "geoip": {
          "properties": {
            "location": { "type": "geo_point" }
          }
        }
      }
    }
  },
  "priority": 200
}
```

### 5. Kibana Saved Searches and Visualizations

```json
// Kibana saved search for error investigation
{
  "title": "Application Errors - Last 24h",
  "columns": [
    "@timestamp",
    "service",
    "level",
    "log_message",
    "exception_type",
    "request_id"
  ],
  "sort": [["@timestamp", "desc"]],
  "query": {
    "language": "kuery",
    "query": "level: ERROR"
  },
  "filter": [
    {
      "meta": {
        "index": "logs-*",
        "type": "range"
      },
      "range": {
        "@timestamp": {
          "gte": "now-24h",
          "lte": "now"
        }
      }
    }
  ]
}

// Kibana lens visualization for error trends
{
  "title": "Error Rate by Service",
  "visualizationType": "lnsXY",
  "state": {
    "datasourceStates": {
      "indexpattern": {
        "layers": {
          "layer1": {
            "columns": {
              "x-axis": {
                "operationType": "date_histogram",
                "sourceField": "@timestamp",
                "params": {
                  "interval": "auto"
                }
              },
              "breakdown": {
                "operationType": "terms",
                "sourceField": "service",
                "params": {
                  "size": 10
                }
              },
              "y-axis": {
                "operationType": "count"
              }
            }
          }
        }
      }
    },
    "visualization": {
      "layers": [{
        "layerId": "layer1",
        "seriesType": "bar_stacked",
        "xAccessor": "x-axis",
        "splitAccessor": "breakdown",
        "accessors": ["y-axis"]
      }]
    },
    "query": {
      "language": "kuery",
      "query": "level: ERROR"
    }
  }
}
```

## Tools and Technologies

### Log Collection
| Tool | Use Case | Deployment |
|------|----------|------------|
| Filebeat | File-based collection | Agent on hosts |
| Fluentd | Flexible routing | Kubernetes native |
| Fluent Bit | Lightweight collection | Edge/IoT |
| Vector | High-performance | All environments |

### Log Storage
| Platform | Strengths | Best For |
|----------|-----------|----------|
| Elasticsearch | Full-text search | General purpose |
| Loki | Label-based, efficient | Kubernetes/Grafana |
| CloudWatch Logs | AWS native | AWS workloads |
| Splunk | Enterprise features | Large enterprises |

### Log Analysis
| Tool | Purpose | Integration |
|------|---------|-------------|
| Kibana | Visualization | Elasticsearch |
| Grafana | Dashboards | Loki/Elasticsearch |
| Jaeger | Distributed tracing | OpenTelemetry |

## Metrics and Monitoring

### Logging Infrastructure Health

```yaml
# Prometheus alerting for logging infrastructure
groups:
  - name: logging_alerts
    rules:
      - alert: ElasticsearchClusterRed
        expr: elasticsearch_cluster_health_status{color="red"} == 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Elasticsearch cluster is RED"

      - alert: ElasticsearchHighHeapUsage
        expr: |
          elasticsearch_jvm_memory_used_bytes{area="heap"}
          / elasticsearch_jvm_memory_max_bytes{area="heap"} > 0.9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Elasticsearch heap usage above 90%"

      - alert: LogstashPipelineBacklog
        expr: logstash_node_pipeline_events_in_total - logstash_node_pipeline_events_out_total > 10000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Logstash pipeline has significant backlog"

      - alert: LogIngestionDrop
        expr: |
          rate(logs_ingested_total[5m]) < rate(logs_ingested_total[5m] offset 1h) * 0.5
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Log ingestion rate dropped significantly"
```

## Common Pitfalls

### 1. Unstructured Logs
**Problem**: Free-form text logs are hard to parse and query
**Solution**: Implement structured JSON logging from the start

### 2. Missing Correlation IDs
**Problem**: Cannot trace requests across services
**Solution**: Propagate request/trace IDs through all services

### 3. Excessive Logging
**Problem**: Log volume creates storage and performance issues
**Solution**: Use appropriate log levels and sampling

### 4. Sensitive Data in Logs
**Problem**: PII or secrets accidentally logged
**Solution**: Implement log sanitization and redaction

### 5. No Retention Policy
**Problem**: Logs grow unbounded consuming storage
**Solution**: Implement ILM policies with clear retention rules

## Integration Points

### Upstream Dependencies
- **Applications**: Structured log output
- **Infrastructure**: System and container logs
- **Cloud Services**: Cloud provider logs
- **Third-party**: API and SaaS logs

### Downstream Consumers
- **Operations**: Troubleshooting and debugging
- **Security**: Threat detection and investigation
- **Compliance**: Audit and regulatory requirements
- **Analytics**: Business intelligence

### Log Pipeline Architecture
```
[Applications] --> [Filebeat/Fluentd] --> [Kafka/Buffer]
                                               |
                                               v
                                         [Logstash/Vector]
                                               |
                              +----------------+----------------+
                              |                |                |
                      [Elasticsearch]     [S3 Archive]    [SIEM]
                              |
                         [Kibana]
```

## Best Practices Checklist

- [ ] Structured JSON logging implemented
- [ ] Correlation IDs propagated across services
- [ ] Sensitive data redaction configured
- [ ] Index lifecycle management active
- [ ] Log levels appropriately configured
- [ ] Centralized collection from all sources
- [ ] Retention policies documented and enforced
- [ ] Alerting on logging infrastructure health
- [ ] Regular capacity planning reviews
- [ ] Security access controls implemented
