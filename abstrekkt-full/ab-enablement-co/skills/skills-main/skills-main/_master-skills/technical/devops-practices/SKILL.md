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


## References
- `references/3-infrastructure-as-code-patterns.md` — 3. Infrastructure as Code Patterns
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
