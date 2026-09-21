---
name: devops-practices
description: CI/CD pipelines, infrastructure as code, deployment strategies, and operational practices. Use when setting up automated pipelines, implementing deployment workflows, configuring monitoring, or establishing DevOps practices for development teams.
---

# DevOps Practices

## Overview

DevOps represents the integration of development and operations practices to enable faster, more reliable software delivery. It encompasses automation, monitoring, incident response, and the cultural practices that make engineering teams effective at delivering value continuously.

This skill covers the practical implementation of DevOps: CI/CD pipelines, infrastructure as code, deployment strategies, containerization, and observability. It provides patterns that scale from small teams to enterprise organizations while maintaining the agility that DevOps promises.

The goal is not to adopt every tool and practice simultaneously but to implement the right practices for your team's current needs and maturity level. Good DevOps is about reducing friction in the path from idea to production while maintaining reliability and security.

### Why This Matters
- Automated pipelines reduce deployment time from days to minutes
- Proper CI/CD catches bugs before they reach production, reducing incident rates by 50%+
- Infrastructure as code enables reproducible, auditable infrastructure changes
- Good observability reduces mean time to resolution (MTTR) for incidents

## When to Use

### Primary Triggers
- Setting up CI/CD pipelines for new projects
- Migrating from manual deployments to automated workflows
- Implementing infrastructure as code
- Establishing monitoring and alerting
- Planning deployment strategies for zero-downtime releases

### Specific Use Cases
- "Set up GitHub Actions CI/CD for our Node.js application"
- "Implement blue-green deployment for our production services"
- "Create Terraform modules for our standard infrastructure"
- "Configure Datadog monitoring with appropriate alerts"
- "Establish deployment runbooks for our team"

## Core Processes

### 1. CI/CD Pipeline Architecture

**Pipeline Stages**

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Commit  │──▶│   Build  │──▶│   Test   │──▶│  Deploy  │──▶│  Verify  │
│          │   │          │   │          │   │ Staging  │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                   │
                                                   ▼
                                            ┌──────────┐   ┌──────────┐
                                            │  Approve │──▶│  Deploy  │
                                            │          │   │   Prod   │
                                            └──────────┘   └──────────┘
```

**GitHub Actions Complete Pipeline**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=ref,event=branch
            type=ref,event=pr

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - name: Deploy to staging
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition-staging.json
          service: app-staging
          cluster: staging-cluster
          wait-for-service-stability: true

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition-prod.json
          service: app-production
          cluster: production-cluster
          wait-for-service-stability: true
```

### 2. Deployment Strategies

**Strategy Comparison**

| Strategy | Downtime | Rollback | Risk | Complexity |
|----------|----------|----------|------|------------|
| Rolling | None | Gradual | Low | Low |
| Blue-Green | None | Instant | Low | Medium |
| Canary | None | Instant | Very Low | High |
| Recreate | Yes | Manual | High | Low |

**Blue-Green Deployment Implementation**

```hcl
# Terraform blue-green with ALB
resource "aws_lb_target_group" "blue" {
  name     = "app-blue"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 10
  }
}

resource "aws_lb_target_group" "green" {
  name     = "app-green"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 10
  }
}

resource "aws_lb_listener_rule" "app" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = var.active_target_group == "blue" ? aws_lb_target_group.blue.arn : aws_lb_target_group.green.arn
  }

  condition {
    host_header {
      values = ["app.example.com"]
    }
  }
}

# Switch traffic by changing var.active_target_group
```

**Canary Deployment Script**

```bash
#!/bin/bash
# canary-deploy.sh

set -e

NEW_VERSION=$1
CANARY_PERCENTAGE=10
FULL_ROLLOUT_PERCENTAGE=100

echo "Starting canary deployment of version $NEW_VERSION"

# Deploy new version to canary instances
aws ecs update-service \
  --cluster production \
  --service app-canary \
  --task-definition app:$NEW_VERSION

# Wait for deployment
aws ecs wait services-stable --cluster production --services app-canary

# Route canary traffic
aws elbv2 modify-listener-rule \
  --rule-arn $RULE_ARN \
  --actions Type=forward,ForwardConfig='{
    "TargetGroups": [
      {"TargetGroupArn": "'$MAIN_TG'", "Weight": 90},
      {"TargetGroupArn": "'$CANARY_TG'", "Weight": 10}
    ]
  }'

echo "Canary deployed. Monitoring for 10 minutes..."
sleep 600

# Check error rates
ERROR_RATE=$(get_error_rate $NEW_VERSION)
if [ "$ERROR_RATE" -gt 1 ]; then
  echo "Error rate too high ($ERROR_RATE%). Rolling back..."
  rollback
  exit 1
fi

echo "Canary successful. Proceeding with full rollout..."

# Full rollout
aws ecs update-service \
  --cluster production \
  --service app-main \
  --task-definition app:$NEW_VERSION

echo "Deployment complete!"
```

### 3. Infrastructure as Code Patterns

**Terraform Module Structure**

```
modules/
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
├── ecs-service/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
└── rds/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md

environments/
├── dev/
│   ├── main.tf
│   ├── terraform.tfvars
│   └── backend.tf
├── staging/
│   └── ...
└── production/
    └── ...
```

**Reusable Module Example**

```hcl
# modules/ecs-service/main.tf
variable "name" {
  description = "Service name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "container_image" {
  description = "Docker image to deploy"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 3000
}

variable "cpu" {
  description = "CPU units (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Number of tasks"
  type        = number
  default     = 2
}

resource "aws_ecs_task_definition" "this" {
  family                   = "${var.name}-${var.environment}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([{
    name  = var.name
    image = var.container_image
    portMappings = [{
      containerPort = var.container_port
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.this.name
        awslogs-region        = data.aws_region.current.name
        awslogs-stream-prefix = var.name
      }
    }
    environment = [
      { name = "NODE_ENV", value = var.environment }
    ]
  }])
}

resource "aws_ecs_service" "this" {
  name            = "${var.name}-${var.environment}"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.this.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.name
    container_port   = var.container_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}
```

### 4. Containerization Best Practices

**Optimized Dockerfile**

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER appuser

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

### 5. Monitoring and Alerting

**Structured Logging**

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Usage
logger.info({ userId: user.id, action: 'login' }, 'User logged in');
logger.error({ error: err, requestId }, 'Request failed');
```

**Alert Configuration Template**

```yaml
# datadog-monitors.yml
monitors:
  - name: "High Error Rate - Production"
    type: "metric alert"
    query: "sum(last_5m):sum:http.requests{env:production,status:5xx}.as_rate() / sum:http.requests{env:production}.as_rate() * 100 > 1"
    message: |
      Error rate exceeded 1% in production.
      Current rate: {{value}}%

      Runbook: https://runbooks.company.com/high-error-rate

      @slack-engineering-alerts
      @pagerduty-production
    options:
      thresholds:
        critical: 1
        warning: 0.5
      notify_no_data: false
      evaluation_delay: 60

  - name: "High Latency - API"
    type: "metric alert"
    query: "avg(last_5m):avg:http.request.duration.p99{service:api,env:production} > 500"
    message: |
      P99 latency exceeded 500ms.
      Current: {{value}}ms

      @slack-engineering-alerts
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| GitHub Actions | CI/CD for GitHub | Free tier | Native integration, marketplace |
| ArgoCD | GitOps for Kubernetes | Free | Declarative, auto-sync |
| Terraform | Infrastructure as Code | Free | Multi-cloud, state management |
| Datadog | Full observability | $15/host/mo+ | APM, logs, metrics unified |
| PagerDuty | Incident management | $21/user/mo+ | On-call, escalation |
| Sentry | Error tracking | Free tier | Stack traces, releases |

## Metrics & KPIs

### Deployment Metrics (DORA)
- **Deployment Frequency**: Target daily or more
- **Lead Time for Changes**: Target < 1 day
- **Mean Time to Recovery (MTTR)**: Target < 1 hour
- **Change Failure Rate**: Target < 15%

### Pipeline Metrics
- **Build Duration**: Track and optimize
- **Test Pass Rate**: Target > 99%
- **Pipeline Success Rate**: Target > 95%
- **Queue Time**: Minimize with scaling

## Common Pitfalls

### 1. Flaky Tests in CI
**Problem**: Tests that pass/fail randomly block deployments and erode trust
**Prevention**: Quarantine flaky tests, fix root causes, use test retries sparingly, and track flakiness metrics.

### 2. Secrets in Code
**Problem**: API keys, passwords committed to version control
**Prevention**: Use secret scanning in CI, proper secret management (Parameter Store, Vault), and pre-commit hooks.

### 3. No Rollback Plan
**Problem**: Deployments that can't be quickly reversed when issues occur
**Prevention**: Always have rollback scripts ready. Use blue-green or canary deployments. Keep previous versions available.

### 4. Over-Alerting
**Problem**: Too many alerts cause alert fatigue and missed critical issues
**Prevention**: Alert on symptoms not causes. Use multi-threshold alerts. Regularly review and prune alerts.

## Integration Points

- **Code Review**: PR-based deployments with required reviews
- **Testing Strategies**: Tests run in CI pipeline
- **Cloud Architecture**: IaC deploys cloud infrastructure
- **Technical Documentation**: Runbooks for operational procedures
- **Performance Optimization**: Performance tests in pipeline
- **Database Design**: Database migrations in deployment
