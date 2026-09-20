---
name: terraform-iac-deployment
description: Infrastructure as Code with Terraform for AWS, GCP, Azure. Includes state management, modules, and CI/CD integration. Use when building, debugging, or optimizing technical implementations.
---

# Claude Code Essentials for Terraform IaC Deployment

Infrastructure as Code with Terraform involves managing complex state, multi-environment configurations, and CI/CD pipelines that demand precision. Claude Code transforms Terraform workflows by reading your existing HCL files, understanding module relationships, validating configurations, and executing plans -- all within your terminal. These 12 concepts give you the tools to manage infrastructure safely and efficiently with AI assistance.

## Why These 12 Concepts Matter

Think of these concepts as layers in your Terraform deployment toolkit. **Plan Mode** and **Ultrathink** handle the architectural reasoning before you touch any infrastructure. **Terminal CLI** and **Code Execution** let you run `terraform plan` and `terraform apply` directly. **Checkpoints** protect you from destructive changes. **CLAUDE.md** encodes your team's cloud conventions. **Hooks** enforce safety guardrails. **MCP Servers** connect to cloud provider APIs. **GitHub Actions** and **Headless Mode** automate your CI/CD pipeline. **Context Window** lets Claude reason across entire module trees. **Permissions** ensure destructive operations require explicit approval.

## The 12 Concepts

### 1. Plan Mode
**What:** A mode where Claude explores and plans before making changes, creating a step-by-step implementation strategy for approval.
**Why:** Terraform changes can destroy infrastructure. Plan Mode lets Claude analyze your state, map dependencies, and propose a migration strategy before writing a single resource block.
**Example:**
```hcl
# Claude in Plan Mode analyzes your current state and proposes:
# Step 1: Add new module for RDS with read replicas
# Step 2: Update security groups to allow new CIDR ranges
# Step 3: Modify ALB target groups for blue-green deployment
# Step 4: Run terraform plan to verify no destructive changes

# After approval, Claude executes each step with checkpoints
module "rds" {
  source = "./modules/rds"

  instance_class    = var.db_instance_class
  allocated_storage = var.db_storage
  multi_az          = var.environment == "prod"
  read_replicas     = var.environment == "prod" ? 2 : 0

  tags = merge(var.common_tags, {
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}
```

### 2. Terminal CLI
**What:** Command-line interface for running Claude Code directly in your terminal for coding tasks.
**Why:** Terraform workflows are terminal-native. You run `terraform init`, `plan`, `apply`, and `state` commands from the CLI. Claude Code lives in the same terminal, reading output and iterating on configurations.
**Example:**
```bash
# Start Claude Code in your Terraform project
claude

# Or run a one-shot command
claude --print "review this terraform plan output and identify risks"

# Pipe terraform plan output to Claude for analysis
terraform plan -no-color 2>&1 | claude --print "analyze this plan for security risks"
```

### 3. Code Execution
**What:** Claude's ability to run code directly in your environment, executing tests, builds, and scripts in real-time.
**Why:** Claude can run `terraform validate`, `terraform plan`, `terraform fmt`, and `tflint` to catch errors immediately, then fix them and re-run until everything passes.
**Example:**
```bash
# Claude runs these commands in sequence, fixing issues as they arise:
terraform fmt -check -recursive
# -> Found formatting issues in modules/vpc/main.tf
# Claude fixes formatting, then continues:
terraform validate
# -> Error: Missing required argument "subnet_id"
# Claude adds the missing argument, then re-validates
terraform plan -out=tfplan
# -> Plan: 3 to add, 1 to change, 0 to destroy
```

### 4. Checkpoints
**What:** Git-based snapshots of progress that let you undo changes and restore to a known good state.
**Why:** Infrastructure changes are high-stakes. Checkpoints let you snapshot your Terraform configurations before each major change, so you can revert if a plan reveals unintended resource destruction.
**Example:**
```bash
# Claude creates checkpoints at each stage:
# Checkpoint 1: Before VPC module refactoring
# Checkpoint 2: After VPC passes terraform plan
# Checkpoint 3: Before adding ECS service definitions
# Checkpoint 4: After full plan validates cleanly

# If the ECS changes break something:
# "Revert to checkpoint 2" -> instantly back to working VPC state
```

### 5. CLAUDE.md
**What:** A configuration file that provides project context, coding conventions, and instructions to Claude Code automatically.
**Why:** Every infrastructure team has conventions: naming patterns, tagging standards, backend configurations, provider version constraints. CLAUDE.md encodes these so Claude follows them automatically.
**Example:**
```markdown
# CLAUDE.md for Terraform project

## Conventions
- All resources must include tags: Environment, Team, ManagedBy
- Use snake_case for resource names, kebab-case for resource Name tags
- Backend state stored in s3://company-tf-state/{env}/{service}
- Provider versions pinned to minor version (~> 5.0)
- Modules must have README.md with input/output documentation

## Commands
- Validate: terraform validate && tflint --recursive
- Plan: terraform plan -var-file=envs/${ENV}.tfvars -out=tfplan
- Apply: terraform apply tfplan (never use -auto-approve in prod)

## Security
- Never hardcode secrets -- use aws_secretsmanager_secret_version
- All S3 buckets must have encryption and versioning enabled
- IAM policies must follow least privilege principle
```

### 6. Hooks
**What:** Shell commands that execute automatically before/after Claude Code events like tool calls.
**Why:** Prevent dangerous Terraform operations. A hook can block `terraform destroy` or `terraform apply -auto-approve` on production workspaces, requiring explicit human confirmation.
**Example:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "python .claude/hooks/tf-safety.py \"$TOOL_INPUT\"",
        "description": "Block dangerous terraform commands on prod workspace"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "python .claude/hooks/tf-audit.py \"$TOOL_INPUT\" \"$TOOL_OUTPUT\"",
        "description": "Log all terraform state changes to audit trail"
      }
    ]
  }
}
```

### 7. MCP Servers
**What:** Services that expose tools and data to Claude via the MCP protocol, extending Claude's capabilities.
**Why:** Connect Claude to AWS, Azure, or GCP APIs directly. Query running infrastructure, check resource states, read CloudWatch metrics, and pull secrets -- all without leaving the conversation.
**Example:**
```json
{
  "mcpServers": {
    "aws": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-aws"],
      "env": { "AWS_PROFILE": "production" }
    },
    "terraform-cloud": {
      "command": "npx",
      "args": ["-y", "mcp-server-terraform-cloud"],
      "env": { "TFC_TOKEN": "${TFC_TOKEN}" }
    }
  }
}
```

### 8. Permissions
**What:** Access control model with three levels: Allow (automatic), Ask (user confirmation), Deny (blocked).
**Why:** Terraform operations range from harmless reads to infrastructure-destroying applies. Permissions let you auto-approve `terraform plan` but require confirmation for `terraform apply`.
**Example:**
```json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep"],
    "ask": ["Bash(terraform apply*)", "Bash(terraform destroy*)", "Edit"],
    "deny": ["Bash(terraform apply -auto-approve*)"]
  }
}
```

### 9. GitHub Actions
**What:** CI/CD integration that runs Claude Code agents automatically on GitHub events.
**Why:** Automate Terraform PR reviews. When a PR modifies `.tf` files, Claude Code reviews the plan output, checks for security issues, validates naming conventions, and posts review comments.
**Example:**
```yaml
# .github/workflows/terraform-review.yml
name: Terraform PR Review
on:
  pull_request:
    paths: ['**/*.tf', '**/*.tfvars']

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init && terraform plan -no-color -out=tfplan > plan.txt
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Review the terraform plan in plan.txt.
            Check for: security issues, cost implications,
            naming convention violations, missing tags.
```

### 10. Headless Mode
**What:** Run Claude Code non-interactively via CLI flags for scripting, CI/CD, and automation pipelines.
**Why:** Integrate Claude into existing Terraform automation. Validate modules, generate documentation, or analyze drift without human interaction.
**Example:**
```bash
# Automated Terraform module documentation generation
claude -p "read all .tf files in modules/ and generate README.md \
  with inputs, outputs, and usage examples" --output-format json

# Automated drift detection analysis
terraform plan -no-color -detailed-exitcode > plan.txt 2>&1
claude -p "analyze plan.txt and report any configuration drift \
  that needs attention" --output-format text
```

### 11. Context Window
**What:** The amount of text Claude can see and reason about at once (200K tokens).
**Why:** Large Terraform projects have dozens of modules, hundreds of resources, and complex variable hierarchies. The 200K context window lets Claude reason across your entire infrastructure definition at once.
**Example:**
```hcl
# Claude can simultaneously analyze:
# - main.tf (root module with 15 module calls)
# - modules/vpc/main.tf (VPC with 20+ resources)
# - modules/ecs/main.tf (ECS with task definitions)
# - modules/rds/main.tf (RDS with replicas)
# - variables.tf, outputs.tf, terraform.tfvars
# - .github/workflows/terraform.yml
# All within a single context, understanding how changes
# in one module cascade to others
```

### 12. Ultrathink
**What:** Extended thinking mode that gives Claude more reasoning tokens for complex problems.
**Why:** Complex Terraform migrations -- like moving from a monolithic configuration to modular architecture, or planning a zero-downtime database migration -- need deep analysis of state dependencies and resource lifecycles.
**Example:**
```bash
# For complex infrastructure decisions, enable extended thinking:
claude "We need to migrate our monolithic main.tf (2000 lines)
  into separate modules without destroying existing resources.
  Analyze the state file, identify dependency graphs, and create
  a step-by-step migration plan with terraform state mv commands."

# Claude uses extended thinking to:
# 1. Map all resource dependencies
# 2. Identify safe migration order
# 3. Generate terraform state mv commands
# 4. Plan for zero-downtime cutover
```

## How These Concepts Work Together

A typical Terraform workflow with Claude Code:

1. **CLAUDE.md** loads your infrastructure conventions when Claude starts
2. **Plan Mode** analyzes the current state and proposes changes
3. **Ultrathink** reasons through complex dependency chains
4. **Context Window** holds your entire module tree for cross-cutting analysis
5. **Code Execution** runs `terraform validate` and `terraform plan`
6. **Checkpoints** snapshot after each successful step
7. **MCP Servers** query live AWS/Azure/GCP resources for drift detection
8. **Hooks** block dangerous operations on production workspaces
9. **Permissions** require confirmation before `terraform apply`
10. **GitHub Actions** + **Headless Mode** automate PR reviews in CI/CD
11. **Terminal CLI** ties it all together in your existing workflow

### Quick Workflow
```bash
# 1. Start Claude in your Terraform project
cd infrastructure/ && claude

# 2. "Plan a migration from single-AZ to multi-AZ for our RDS instance"
#    -> Claude enters Plan Mode, reads state, proposes steps

# 3. "Execute step 1"
#    -> Claude modifies HCL, runs terraform plan, creates checkpoint

# 4. "Apply if the plan looks safe"
#    -> Permissions prompt for confirmation before apply
```

## Next Steps

- Set up a `CLAUDE.md` in your Terraform repository root with naming and tagging conventions
- Configure **Hooks** to block dangerous operations on production workspaces
- Add an **MCP Server** for your primary cloud provider
- Create a **GitHub Actions** workflow for automated Terraform PR reviews
- See `terraform-module-library` for reusable module patterns
- See `multi-cloud-architecture` for cross-provider infrastructure design

---

# Terraform IaC Deployment

## Overview

## Basic Structure

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
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
    encrypt = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr
  azs  = var.availability_zones
  
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment == "dev"
  
  tags = merge(var.common_tags, {
    Environment = var.environment
  })
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
  
  enable_deletion_protection = var.environment == "prod"
}
```

## Variables & Outputs

```hcl
# variables.tf
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod"
  }
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

# outputs.tf
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "alb_dns" {
  value = aws_lb.main.dns_name
}
```

## Modules

```hcl
# modules/ecs-service/main.tf
resource "aws_ecs_task_definition" "main" {
  family                   = var.service_name
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = var.cpu
  memory                  = var.memory
  execution_role_arn      = aws_iam_role.execution.arn
  task_role_arn           = aws_iam_role.task.arn
  
  container_definitions = jsonencode([{
    name  = var.service_name
    image = var.image
    portMappings = [{
      containerPort = var.container_port
      protocol      = "tcp"
    }]
    environment = [
      for key, value in var.environment_variables : {
        name  = key
        value = value
      }
    ]
    secrets = [
      for key, value in var.secrets : {
        name      = key
        valueFrom = value
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.main.name
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}
```

## State Management

```bash
# Initialize with remote backend
terraform init

# Import existing resource
terraform import aws_s3_bucket.example my-bucket-name

# State commands
terraform state list
terraform state show aws_instance.example
terraform state mv aws_instance.old aws_instance.new
terraform state rm aws_instance.example
```

## Workspaces

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
terraform workspace select dev
terraform workspace list
```

## CI/CD Integration

```yaml
# .github/workflows/terraform.yml
name: Terraform
on:
  push:
    branches: [main]
  pull_request:

jobs:
  terraform:
    runs-on: ubuntu-latest
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
      
      - name: Terraform Format
        run: terraform fmt -check
      
      - name: Terraform Init
        run: terraform init
      
      - name: Terraform Validate
        run: terraform validate
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan
```

## Security Best Practices

```hcl
# Use AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "prod/db/password"
}

# Encryption at rest
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# IAM least privilege
resource "aws_iam_role_policy" "task" {
  role = aws_iam_role.task.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject"
      ]
      Resource = "${aws_s3_bucket.data.arn}/*"
    }]
  })
}
```

## Quality Gates
- ✅ `terraform fmt` passes
- ✅ `terraform validate` passes
- ✅ State stored in remote backend with locking
- ✅ Secrets in AWS Secrets Manager
- ✅ Encryption enabled for all data stores
- ✅ IAM roles follow least privilege

## Resources
- Terraform Docs: https://www.terraform.io/docs
- AWS Provider: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
