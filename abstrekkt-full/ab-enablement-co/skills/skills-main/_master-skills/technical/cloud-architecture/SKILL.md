---
name: cloud-architecture
description: AWS, Azure, and GCP architecture patterns, service selection, cost optimization, and infrastructure design. Use when designing cloud infrastructure, selecting services, optimizing costs, planning migrations, or implementing scalable, reliable cloud solutions.
---

# Cloud Architecture

## Overview

Cloud architecture is the art of assembling managed services into systems that are scalable, reliable, secure, and cost-effective. The major cloud providers offer hundreds of services; knowing which to use, how to combine them, and when managed services justify their cost premium is essential for modern application development.

This skill provides frameworks for making cloud architecture decisions that balance immediate needs with long-term flexibility. It covers the major cloud providers (AWS, Azure, GCP), common architectural patterns, cost optimization strategies, and migration approaches.

The goal is not to memorize every service but to understand the categories of services, their trade-offs, and patterns for combining them effectively. Whether building a startup MVP or enterprise-scale platform, the principles of good cloud architecture remain consistent: design for failure, optimize for cost, and maintain operational simplicity.

### Why This Matters
- Cloud infrastructure costs can easily exceed development costs for successful products
- Poor architecture decisions create operational burden that compounds over time
- Proper service selection reduces development time by leveraging managed services
- Multi-region and high-availability designs prevent costly outages

## When to Use

### Primary Triggers
- Designing infrastructure for a new application
- Migrating from on-premises or between cloud providers
- Optimizing cloud costs that have grown unexpectedly
- Implementing high-availability or disaster recovery
- Selecting between managed services and self-hosted alternatives

### Specific Use Cases
- "Design AWS infrastructure for our SaaS application with 10K daily users"
- "Our cloud bill doubled - help identify optimization opportunities"
- "Should we use Lambda or ECS for our API backend?"
- "Implement multi-region failover for our critical services"
- "Migrate our application from Heroku to AWS"

## Core Processes

### 1. Cloud Provider Selection

**Provider Comparison Matrix**

| Factor | AWS | Azure | GCP |
|--------|-----|-------|-----|
| Market share | Largest | Second | Third |
| Service breadth | Most complete | Strong enterprise | Strong data/ML |
| Learning curve | Steeper | Moderate | Easier |
| Enterprise integration | Good | Best (Microsoft) | Growing |
| Startup credits | $100K (activate) | $150K (BizSpark) | $200K (startups) |
| Pricing | Complex | Complex | More predictable |

**When to Choose Each Provider**

| Choose | When |
|--------|------|
| AWS | Default choice, broadest ecosystem, most tutorials |
| Azure | Microsoft shop, .NET applications, enterprise AD integration |
| GCP | Data/ML workloads, Kubernetes-native, BigQuery needs |
| Multi-cloud | Compliance requirements, vendor lock-in concerns |

### 2. Common Architecture Patterns

**Three-Tier Web Application (AWS)**

```
                    ┌─────────────────────────────────────────┐
                    │              CloudFront                 │
                    │           (CDN + WAF)                   │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────▼───────────────────────┐
                    │       Application Load Balancer         │
                    └─────────────────┬───────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│   ECS/Fargate   │        │   ECS/Fargate   │        │   ECS/Fargate   │
│   (App Tier)    │        │   (App Tier)    │        │   (App Tier)    │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
         ┌─────────────────┐              ┌─────────────────┐
         │   RDS Aurora    │              │  ElastiCache    │
         │  (PostgreSQL)   │              │    (Redis)      │
         └─────────────────┘              └─────────────────┘
```

**Serverless Architecture**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  API Gateway │────▶│    Lambda    │────▶│   DynamoDB   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │     SQS      │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Lambda    │
                     │  (Worker)    │
                     └──────────────┘
```

**Infrastructure as Code (Terraform)**

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "terraform-state-bucket"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "production-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false  # One per AZ for HA

  tags = {
    Environment = "production"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "production-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS
module "rds" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "8.0.0"

  name           = "production-db"
  engine         = "aurora-postgresql"
  engine_version = "15.4"
  instance_class = "db.r6g.large"
  instances      = { 1 = {}, 2 = {} }  # Multi-AZ

  vpc_id               = module.vpc.vpc_id
  db_subnet_group_name = module.vpc.database_subnet_group_name
  security_group_rules = {
    ingress = {
      source_security_group_id = aws_security_group.app.id
    }
  }

  storage_encrypted   = true
  apply_immediately   = false
  skip_final_snapshot = false
}
```

### 3. Service Selection Guide

**Compute Options**

| Service | Best For | Cost Model | Scaling |
|---------|----------|------------|---------|
| EC2 | Full control, persistent workloads | Per hour | Manual/Auto |
| ECS/Fargate | Containers, managed orchestration | Per vCPU/memory | Auto |
| Lambda | Event-driven, sporadic workloads | Per invocation | Instant |
| App Runner | Simple containers, PaaS-like | Per vCPU/memory | Auto |

**Database Options**

| Service | Type | Best For | Cost Consideration |
|---------|------|----------|-------------------|
| RDS | Managed SQL | Standard relational needs | Reserved instances |
| Aurora | Enhanced MySQL/PostgreSQL | High performance SQL | Serverless v2 for variable |
| DynamoDB | NoSQL key-value | Simple queries, scale | On-demand vs provisioned |
| ElastiCache | In-memory | Caching, sessions | Reserved nodes |
| DocumentDB | MongoDB compatible | MongoDB migration | Often over-provisioned |

**Storage Options**

| Service | Best For | Cost/GB/Month | Access Pattern |
|---------|----------|---------------|----------------|
| S3 Standard | Frequently accessed | $0.023 | Low latency |
| S3 Infrequent | Monthly access | $0.0125 | Retrieval fee |
| S3 Glacier | Archives | $0.004 | Minutes to hours |
| EBS gp3 | Block storage | $0.08 | Attached to EC2 |
| EFS | Shared file system | $0.30 | Multi-AZ |

### 4. Cost Optimization Strategies

**Immediate Wins**

```bash
# 1. Identify unused resources
aws ec2 describe-volumes --filters "Name=status,Values=available"
aws ec2 describe-addresses --filters "Name=domain,Values=vpc"
aws rds describe-db-instances --query 'DBInstances[?DBInstanceStatus==`available`]'

# 2. Right-size instances
# Use AWS Compute Optimizer recommendations
aws compute-optimizer get-ec2-instance-recommendations

# 3. Enable S3 lifecycle policies
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-bucket \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "Move to IA after 30 days",
      "Status": "Enabled",
      "Transitions": [{
        "Days": 30,
        "StorageClass": "STANDARD_IA"
      }]
    }]
  }'
```

**Cost Optimization Checklist**

| Area | Action | Savings Potential |
|------|--------|-------------------|
| Compute | Use Reserved Instances (1-3 year) | 30-60% |
| Compute | Use Spot for fault-tolerant workloads | 60-90% |
| Compute | Right-size over-provisioned instances | 20-40% |
| Storage | Implement S3 lifecycle policies | 40-70% |
| Storage | Delete unused EBS volumes/snapshots | Varies |
| Database | Use Reserved Instances | 30-50% |
| Database | Aurora Serverless for variable workloads | Varies |
| Network | Use VPC endpoints for AWS services | 50%+ on NAT |
| Network | CloudFront for static content | Reduced origin traffic |

**Cost Monitoring Setup**

```hcl
# AWS Budget alert
resource "aws_budgets_budget" "monthly" {
  name         = "monthly-budget"
  budget_type  = "COST"
  limit_amount = "5000"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = ["team@company.com"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_email_addresses = ["team@company.com"]
  }
}
```

### 5. High Availability Patterns

**Multi-AZ Deployment**

```
Region: us-east-1
├── AZ: us-east-1a
│   ├── Public Subnet (NAT Gateway, ALB nodes)
│   ├── Private Subnet (App servers, ECS tasks)
│   └── Database Subnet (RDS primary)
├── AZ: us-east-1b
│   ├── Public Subnet (NAT Gateway, ALB nodes)
│   ├── Private Subnet (App servers, ECS tasks)
│   └── Database Subnet (RDS standby)
└── AZ: us-east-1c
    ├── Public Subnet (NAT Gateway, ALB nodes)
    ├── Private Subnet (App servers, ECS tasks)
    └── Database Subnet (RDS read replica)
```

**Multi-Region Active-Passive**

```
Primary: us-east-1
├── Full application stack
├── RDS with cross-region read replica
└── Route 53 health checks

Secondary: us-west-2
├── Warm standby (reduced capacity)
├── RDS read replica (promote on failover)
└── Route 53 failover routing

Recovery:
1. Route 53 detects primary failure
2. DNS fails over to secondary
3. Promote RDS read replica to primary
4. Scale up secondary capacity
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Terraform | Infrastructure as Code | Free | Multi-cloud, state management |
| Pulumi | IaC with real languages | Free tier | TypeScript/Python/Go |
| AWS CDK | AWS-specific IaC | Free | TypeScript, higher abstraction |
| Infracost | Cost estimation | Free tier | PR cost comments |
| Steampipe | Cloud compliance/query | Free | SQL for cloud APIs |
| AWS Trusted Advisor | Optimization | Included | Cost, security, performance |

## Metrics & KPIs

### Infrastructure Metrics
- **Availability**: Target 99.9%+ uptime
- **Latency**: p99 response time < 500ms
- **Error Rate**: < 0.1% 5xx responses
- **Resource Utilization**: 60-80% average CPU/memory

### Cost Metrics
- **Cost per Request**: Track over time
- **Reserved Instance Coverage**: Target 70%+ for steady-state
- **Unused Resources**: $0 target
- **Cost Trend**: Month-over-month change

## Common Pitfalls

### 1. Over-Provisioning for "Future Scale"
**Problem**: Paying for capacity that won't be needed for years
**Prevention**: Start small, use auto-scaling, right-size based on actual metrics. It's easier to scale up than to negotiate refunds.

### 2. Ignoring Data Transfer Costs
**Problem**: Unexpected bills from cross-AZ, cross-region, or internet egress
**Prevention**: Use VPC endpoints, colocate services, implement caching, understand data flow patterns.

### 3. Single-AZ Deployments
**Problem**: Single points of failure causing outages during AZ issues
**Prevention**: Always deploy across multiple AZs. Use managed services that handle this automatically.

### 4. Hardcoded Configuration
**Problem**: Environment-specific values embedded in code or infrastructure
**Prevention**: Use Parameter Store/Secrets Manager, environment variables, and proper templating in IaC.

## Integration Points

- **DevOps Practices**: CI/CD pipelines deploy to cloud infrastructure
- **Database Design**: Cloud database selection and configuration
- **Performance Optimization**: Cloud-specific performance tuning
- **Supabase Administration**: Managed cloud database alternative
- **Firebase Deployment**: GCP-based application deployment
- **Technical Documentation**: Architecture documentation and diagrams
