# Deployment Guide

Deployment instructions for @flashfusion/orchestration across multiple platforms.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional)

## Quick Start

### npm Package

```bash
npm install @flashfusion/orchestration
```

### Run MCP Server

```bash
# Using npx
npx @flashfusion/orchestration

# Or after installation
node node_modules/@flashfusion/orchestration/dist/mcp/server.js
```

## Claude Desktop Integration

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "flashfusion-orchestration": {
      "command": "npx",
      "args": ["@flashfusion/orchestration"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Config File Locations

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

## Docker Deployment

### Build Image

```bash
docker build -t flashfusion-orchestration:latest .
```

### Run Container

```bash
docker run -d \
  --name flashfusion-mcp \
  -e LOG_LEVEL=info \
  -e ENABLE_METRICS=true \
  flashfusion-orchestration:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  flashfusion-mcp:
    build: .
    image: flashfusion-orchestration:latest
    container_name: flashfusion-mcp
    restart: unless-stopped
    environment:
      - LOG_LEVEL=info
      - ENABLE_METRICS=true
      - ENABLE_HEALTH_CHECK=true
    healthcheck:
      test: ["CMD", "node", "-e", "process.exit(0)"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

## Kubernetes Deployment

### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flashfusion-orchestration
  labels:
    app: flashfusion-orchestration
spec:
  replicas: 1
  selector:
    matchLabels:
      app: flashfusion-orchestration
  template:
    metadata:
      labels:
        app: flashfusion-orchestration
    spec:
      containers:
      - name: mcp-server
        image: flashfusion-orchestration:latest
        imagePullPolicy: Always
        env:
        - name: LOG_LEVEL
          value: "info"
        - name: ENABLE_METRICS
          value: "true"
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - node
            - -e
            - "process.exit(0)"
          initialDelaySeconds: 5
          periodSeconds: 30
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
```

## systemd Service (Linux)

### Service File

Create `/etc/systemd/system/flashfusion-mcp.service`:

```ini
[Unit]
Description=FlashFusion Orchestration MCP Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/flashfusion-orchestration
ExecStart=/usr/bin/node dist/mcp/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=flashfusion-mcp
Environment=NODE_ENV=production
Environment=LOG_LEVEL=info

[Install]
WantedBy=multi-user.target
```

### Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable flashfusion-mcp
sudo systemctl start flashfusion-mcp
sudo systemctl status flashfusion-mcp
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging verbosity | `info` |
| `SERVICE_NAME` | Service identifier | `flashfusion-orchestration` |
| `ENABLE_HEALTH_CHECK` | Enable health endpoint | `true` |
| `ENABLE_METRICS` | Enable metrics collection | `true` |
| `SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout | `10000` |
| `SECURITY_STRICT_MODE` | Strict security validation | `true` |

## Health Checks

### Programmatic Health Check

```typescript
import { performHealthCheck } from '@flashfusion/orchestration';

const health = performHealthCheck();
console.log(health.status); // 'healthy' | 'degraded' | 'unhealthy'
```

### MCP Tool

Use the `health_check` tool via MCP client:

```json
{
  "name": "health_check",
  "arguments": {}
}
```

## Monitoring

### Metrics Available

- Tool call counts per tool
- Latency percentiles (p50, p95, p99) per tool
- Error counts per tool
- Server uptime
- Memory usage

### Retrieve Metrics

```typescript
import { getMetrics } from '@flashfusion/orchestration';

const metrics = getMetrics();
console.log(metrics);
```

## Troubleshooting

### Common Issues

**Server not starting**
- Check Node.js version: `node --version` (requires 20+)
- Verify dependencies: `npm ci`
- Check logs: `journalctl -u flashfusion-mcp` (systemd)

**High memory usage**
- Check metrics: memory samples are bounded to 1000 per tool
- Restart server to clear metrics

**Slow tool execution**
- Check latency percentiles via metrics
- Review input size (max 10,000 characters)

### Debug Mode

```bash
LOG_LEVEL=debug node dist/mcp/server.js
```

## Security Considerations

1. Run as non-root user
2. Use read-only filesystem in containers
3. Limit resource usage (memory/CPU)
4. Enable strict mode: `SECURITY_STRICT_MODE=true`
5. Regular security audits: `npm audit`
