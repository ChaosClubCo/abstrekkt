# Cloud/Infrastructure Migration Guide

## Table of Contents

1. [Overview](#overview)
2. [Infrastructure Assessment](#infrastructure-assessment)
3. [On-Premise to Cloud Migration](#on-premise-to-cloud-migration)
4. [Cloud to Cloud Migration](#cloud-to-cloud-migration)
5. [PaaS to Self-Managed Cloud](#paas-to-self-managed-cloud)
6. [Shared Hosting to Containers](#shared-hosting-to-containers)
7. [Vercel/Netlify Considerations](#vercelnetlify-considerations)
8. [Containerization with Docker](#containerization-with-docker)
9. [Kubernetes Deployment](#kubernetes-deployment)
10. [Terraform/IaC Templates](#terraformiac-templates)
11. [Database Migration](#database-migration)
12. [Storage Migration](#storage-migration)
13. [CDN and Edge Deployment](#cdn-and-edge-deployment)
14. [SSL/TLS Certificate Migration](#ssltls-certificate-migration)
15. [DNS Migration](#dns-migration)
16. [CI/CD Pipeline Updates](#cicd-pipeline-updates)
17. [Monitoring and Logging](#monitoring-and-logging)
18. [Cost Estimation](#cost-estimation)
19. [Security Hardening](#security-hardening)
20. [Rollback and Disaster Recovery](#rollback-and-disaster-recovery)

---

## Overview

This guide covers comprehensive migration strategies for moving infrastructure between different environments. Each section includes practical examples, configuration files, and best practices.

### Migration Complexity Matrix

| Source | Target | Complexity | Typical Duration |
|--------|--------|------------|------------------|
| On-premise | AWS/GCP/Azure | High | 3-6 months |
| AWS | GCP/Azure | Medium-High | 2-4 months |
| Heroku | Self-managed | Medium | 1-2 months |
| Shared hosting | Containers | Medium | 2-4 weeks |
| Vercel/Netlify | Self-managed | Low-Medium | 1-2 weeks |

---

## Infrastructure Assessment

### Assessment Checklist

```yaml
# infrastructure-assessment.yaml
assessment:
  compute:
    - current_servers: []
    - cpu_cores: 0
    - memory_gb: 0
    - peak_utilization: 0%

  networking:
    - public_ips: []
    - load_balancers: []
    - vpn_connections: []
    - firewall_rules: []

  storage:
    - block_storage_tb: 0
    - object_storage_tb: 0
    - file_shares: []

  databases:
    - type: ""
    - size_gb: 0
    - connections: 0
    - replication: false

  dependencies:
    - external_apis: []
    - third_party_services: []
    - internal_services: []
```

### Discovery Script

```bash
#!/bin/bash
# infrastructure-discovery.sh

echo "=== Infrastructure Discovery ==="

# CPU and Memory
echo "CPU Cores: $(nproc)"
echo "Memory: $(free -h | grep Mem | awk '{print $2}')"

# Disk Usage
echo "=== Disk Usage ==="
df -h

# Running Services
echo "=== Running Services ==="
systemctl list-units --type=service --state=running

# Open Ports
echo "=== Open Ports ==="
ss -tlnp

# Database Connections
echo "=== Database Info ==="
if command -v psql &> /dev/null; then
    psql -c "SELECT pg_database_size(current_database());"
fi

# Docker containers if present
if command -v docker &> /dev/null; then
    echo "=== Docker Containers ==="
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
fi
```

---

## On-Premise to Cloud Migration

### Phase 1: Planning

```mermaid
graph LR
    A[Assessment] --> B[Design]
    B --> C[Proof of Concept]
    C --> D[Migration]
    D --> E[Optimization]
```

### AWS Migration Example

#### VPC Setup with Terraform

```hcl
# aws/vpc.tf
provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
    Type = "public"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
    Type = "private"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.project_name}-nat"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}
```

#### EC2 Instance Migration

```hcl
# aws/ec2.tf
resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private[0].id
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name               = aws_key_pair.deployer.key_name
  iam_instance_profile   = aws_iam_instance_profile.app.name

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io docker-compose
    systemctl enable docker
    systemctl start docker
  EOF

  tags = {
    Name        = "${var.project_name}-app"
    Environment = var.environment
  }
}

resource "aws_security_group" "app" {
  name        = "${var.project_name}-app-sg"
  description = "Security group for application servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### GCP Migration Example

```hcl
# gcp/main.tf
provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_network" "main" {
  name                    = "${var.project_name}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "${var.project_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/20"
  }
}

resource "google_compute_instance" "app" {
  name         = "${var.project_name}-app"
  machine_type = "e2-medium"
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 50
      type  = "pd-ssd"
    }
  }

  network_interface {
    network    = google_compute_network.main.id
    subnetwork = google_compute_subnetwork.main.id
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io
    systemctl enable docker
    systemctl start docker
  EOF

  service_account {
    scopes = ["cloud-platform"]
  }
}
```

### Azure Migration Example

```hcl
# azure/main.tf
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "${var.project_name}-rg"
  location = var.location
}

resource "azurerm_virtual_network" "main" {
  name                = "${var.project_name}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "main" {
  name                 = "${var.project_name}-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_linux_virtual_machine" "app" {
  name                = "${var.project_name}-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = "Standard_B2s"
  admin_username      = "adminuser"

  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}
```

---

## Cloud to Cloud Migration

### AWS to GCP Migration

#### Data Transfer Script

```bash
#!/bin/bash
# aws-to-gcp-s3-transfer.sh

# Install gsutil and aws cli
pip install gsutil awscli

# Configure credentials
aws configure
gcloud auth login

# Sync S3 to GCS
gsutil -m rsync -r s3://source-bucket gs://destination-bucket

# Verify transfer
aws s3 ls s3://source-bucket --recursive --summarize | tail -1
gsutil du -s gs://destination-bucket
```

#### Database Migration (RDS to Cloud SQL)

```bash
#!/bin/bash
# rds-to-cloudsql.sh

# Export from RDS
pg_dump -h $RDS_HOST -U $RDS_USER -d $RDS_DB -F c -f backup.dump

# Import to Cloud SQL
gcloud sql import sql $CLOUDSQL_INSTANCE \
  gs://$BUCKET/backup.dump \
  --database=$DB_NAME
```

### Service Mapping Reference

| AWS Service | GCP Equivalent | Azure Equivalent |
|-------------|----------------|------------------|
| EC2 | Compute Engine | Virtual Machines |
| EKS | GKE | AKS |
| RDS | Cloud SQL | Azure SQL |
| S3 | Cloud Storage | Blob Storage |
| Lambda | Cloud Functions | Azure Functions |
| CloudFront | Cloud CDN | Azure CDN |
| Route 53 | Cloud DNS | Azure DNS |
| SQS | Pub/Sub | Service Bus |
| SNS | Pub/Sub | Event Grid |
| CloudWatch | Cloud Monitoring | Azure Monitor |

---

## PaaS to Self-Managed Cloud

### Heroku to AWS/GCP Migration

#### Extract Heroku Config

```bash
#!/bin/bash
# heroku-export.sh

# Export environment variables
heroku config -a $APP_NAME --shell > .env.heroku

# Export Procfile
cat Procfile

# Export addons
heroku addons -a $APP_NAME

# Database backup
heroku pg:backups:capture -a $APP_NAME
heroku pg:backups:download -a $APP_NAME
```

#### Equivalent AWS Setup

```hcl
# heroku-to-aws/main.tf

# ECS Cluster (replaces Heroku dynos)
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 8000
  }
}

# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      portMappings = [
        {
          containerPort = 8000
          protocol      = "tcp"
        }
      ]
      environment = [
        for key, value in var.env_vars : {
          name  = key
          value = value
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# RDS (replaces Heroku Postgres)
resource "aws_db_instance" "main" {
  identifier             = "${var.project_name}-db"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = true
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  skip_final_snapshot    = false

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
}

# ElastiCache (replaces Heroku Redis)
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  security_group_ids   = [aws_security_group.redis.id]
  subnet_group_name    = aws_elasticache_subnet_group.main.name
}
```

### Railway/Render to Self-Managed

```yaml
# docker-compose.yml - Local equivalent of Railway/Render
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=app

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs

volumes:
  postgres_data:
  redis_data:
```

---

## Shared Hosting to Containers

### Assessment Script

```bash
#!/bin/bash
# shared-hosting-audit.sh

echo "=== PHP Version ==="
php -v

echo "=== Installed Extensions ==="
php -m

echo "=== Apache Modules ==="
apache2ctl -M 2>/dev/null || httpd -M 2>/dev/null

echo "=== Database Info ==="
mysql --version

echo "=== Cron Jobs ==="
crontab -l

echo "=== File Permissions ==="
find /var/www -type f -perm 777 2>/dev/null | head -20
```

### Dockerfile for PHP Application

```dockerfile
# Dockerfile
FROM php:8.2-fpm-alpine

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli opcache

# Install additional extensions via PECL
RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

# Copy PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Copy application
WORKDIR /var/www/html
COPY --chown=www-data:www-data . .

# Install Composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream php {
        server app:9000;
    }

    server {
        listen 80;
        server_name _;
        root /var/www/html/public;
        index index.php;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass php;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.ht {
            deny all;
        }
    }
}
```

---

## Vercel/Netlify Considerations

### When to Stay on Vercel/Netlify

- Static sites with minimal backend needs
- JAMstack applications
- Budget-conscious projects under free tier limits
- Teams without DevOps expertise

### When to Migrate

- Need for persistent connections (WebSockets)
- Complex backend requirements
- Cost optimization at scale
- Compliance requirements (data residency)
- Need for custom infrastructure

### Vercel to Self-Hosted Next.js

```dockerfile
# Dockerfile.nextjs
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Netlify to Self-Hosted Static

```nginx
# nginx-static.conf
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## Containerization with Docker

### Multi-Stage Dockerfile (Node.js)

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

### Multi-Stage Dockerfile (Python)

```dockerfile
# Dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app

RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.11-slim AS runner
WORKDIR /app

RUN useradd --create-home --shell /bin/bash appuser

COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]
```

### Multi-Stage Dockerfile (Go)

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/server

FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080
ENTRYPOINT ["/server"]
```

### Docker Compose for Development

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app_dev
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=app_dev
    volumes:
      - postgres_dev:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_dev:
```

---

## Kubernetes Deployment

### Deployment Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels:
    app: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: registry.example.com/app:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5
      imagePullSecrets:
        - name: registry-credentials
```

### Service Manifest

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: app-external
spec:
  selector:
    app: app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
```

### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - app.example.com
      secretName: app-tls
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app
                port:
                  number: 80
```

### ConfigMap and Secrets

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "info"
  API_TIMEOUT: "30"
  FEATURE_FLAGS: |
    {
      "new_dashboard": true,
      "beta_features": false
    }
---
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  database-url: "postgresql://user:pass@host:5432/db"
  api-key: "your-api-key"
```

### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### Pod Disruption Budget

```yaml
# k8s/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: app
```

---

## Terraform/IaC Templates

### AWS EKS Cluster

```hcl
# terraform/aws-eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "${var.project_name}-eks"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    default = {
      min_size     = 2
      max_size     = 10
      desired_size = 3

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"

      labels = {
        Environment = var.environment
      }
    }

    spot = {
      min_size     = 0
      max_size     = 10
      desired_size = 2

      instance_types = ["t3.medium", "t3.large"]
      capacity_type  = "SPOT"

      labels = {
        Environment = var.environment
        NodeType    = "spot"
      }

      taints = [
        {
          key    = "spot"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}
```

### GCP GKE Cluster

```hcl
# terraform/gcp-gke/main.tf
resource "google_container_cluster" "primary" {
  name     = "${var.project_name}-gke"
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.main.name
  subnetwork = google_compute_subnetwork.main.name

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }
}

resource "google_container_node_pool" "primary" {
  name       = "${var.project_name}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    preemptible  = false
    machine_type = "e2-medium"

    service_account = google_service_account.gke.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 2
    max_node_count = 10
  }
}
```

### Azure AKS Cluster

```hcl
# terraform/azure-aks/main.tf
resource "azurerm_kubernetes_cluster" "main" {
  name                = "${var.project_name}-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.project_name

  default_node_pool {
    name                = "default"
    node_count          = 3
    vm_size             = "Standard_D2_v2"
    enable_auto_scaling = true
    min_count           = 2
    max_count           = 10
    vnet_subnet_id      = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "spot" {
  name                  = "spot"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = "Standard_D2_v2"
  priority              = "Spot"
  eviction_policy       = "Delete"
  spot_max_price        = -1
  enable_auto_scaling   = true
  min_count             = 0
  max_count             = 10

  node_taints = ["kubernetes.azure.com/scalesetpriority=spot:NoSchedule"]
}
```

---

## Database Migration

### PostgreSQL Migration Script

```bash
#!/bin/bash
# db-migration.sh

set -e

SOURCE_HOST="source-db.example.com"
SOURCE_DB="app_production"
SOURCE_USER="postgres"

TARGET_HOST="target-db.example.com"
TARGET_DB="app_production"
TARGET_USER="postgres"

BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).dump"

echo "Starting database migration..."

# Create backup from source
echo "Creating backup from source database..."
PGPASSWORD=$SOURCE_PASSWORD pg_dump \
  -h $SOURCE_HOST \
  -U $SOURCE_USER \
  -d $SOURCE_DB \
  -F c \
  -f $BACKUP_FILE

# Get backup size
BACKUP_SIZE=$(ls -lh $BACKUP_FILE | awk '{print $5}')
echo "Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Restore to target
echo "Restoring to target database..."
PGPASSWORD=$TARGET_PASSWORD pg_restore \
  -h $TARGET_HOST \
  -U $TARGET_USER \
  -d $TARGET_DB \
  --no-owner \
  --no-acl \
  -j 4 \
  $BACKUP_FILE

echo "Migration completed successfully!"

# Verify row counts
echo "Verifying migration..."
SOURCE_COUNT=$(PGPASSWORD=$SOURCE_PASSWORD psql -h $SOURCE_HOST -U $SOURCE_USER -d $SOURCE_DB -t -c "SELECT COUNT(*) FROM users;")
TARGET_COUNT=$(PGPASSWORD=$TARGET_PASSWORD psql -h $TARGET_HOST -U $TARGET_USER -d $TARGET_DB -t -c "SELECT COUNT(*) FROM users;")

echo "Source users: $SOURCE_COUNT"
echo "Target users: $TARGET_COUNT"

if [ "$SOURCE_COUNT" == "$TARGET_COUNT" ]; then
  echo "Row counts match!"
else
  echo "WARNING: Row counts do not match!"
  exit 1
fi
```

### AWS RDS Setup with Terraform

```hcl
# terraform/rds/main.tf
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az               = var.environment == "production"
  publicly_accessible    = false
  skip_final_snapshot    = var.environment != "production"
  deletion_protection    = var.environment == "production"

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.project_name}-pg15"
  family = "postgres15"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }
}
```

### GCP Cloud SQL Setup

```hcl
# terraform/cloudsql/main.tf
resource "google_sql_database_instance" "main" {
  name             = "${var.project_name}-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-custom-2-4096"
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = 50
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 7
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "1000"
    }

    maintenance_window {
      day  = 1
      hour = 4
    }

    insights_config {
      query_insights_enabled  = true
      record_client_address   = true
      record_application_tags = true
    }
  }

  deletion_protection = var.environment == "production"
}

resource "google_sql_database" "main" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = var.db_username
  instance = google_sql_database_instance.main.name
  password = var.db_password
}
```

---

## Storage Migration

### S3 to GCS Migration

```bash
#!/bin/bash
# s3-to-gcs-migration.sh

# Install gsutil with S3 support
pip install gsutil

# Configure boto for S3
cat > ~/.boto << EOF
[Credentials]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY

[s3]
calling_format = boto.s3.connection.OrdinaryCallingFormat
EOF

# Parallel sync from S3 to GCS
gsutil -m rsync -r -d s3://source-bucket gs://destination-bucket

# Verify sync
echo "Source bucket size:"
aws s3 ls s3://source-bucket --recursive --summarize | grep "Total Size"

echo "Destination bucket size:"
gsutil du -s gs://destination-bucket
```

### AWS S3 Bucket with Terraform

```hcl
# terraform/s3/main.tf
resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-assets"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "archive-old-objects"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

### GCS Bucket with Terraform

```hcl
# terraform/gcs/main.tf
resource "google_storage_bucket" "main" {
  name          = "${var.project_name}-${var.environment}-assets"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 3
    }
    action {
      type = "Delete"
    }
  }

  encryption {
    default_kms_key_name = google_kms_crypto_key.storage.id
  }
}
```

---

## CDN and Edge Deployment

### AWS CloudFront Distribution

```hcl
# terraform/cloudfront/main.tf
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  price_class         = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.main.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "ALB-${aws_lb.main.id}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "ALB-${aws_lb.main.id}"
    viewer_protocol_policy = "https-only"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Origin", "Accept"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}
```

### GCP Cloud CDN

```hcl
# terraform/cloud-cdn/main.tf
resource "google_compute_backend_bucket" "cdn" {
  name        = "${var.project_name}-cdn-backend"
  bucket_name = google_storage_bucket.main.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    client_ttl        = 3600
    default_ttl       = 86400
    max_ttl           = 604800
    serve_while_stale = 86400

    cache_key_policy {
      include_host         = true
      include_protocol     = true
      include_query_string = false
    }
  }
}

resource "google_compute_url_map" "cdn" {
  name            = "${var.project_name}-cdn-urlmap"
  default_service = google_compute_backend_bucket.cdn.id

  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_bucket.cdn.id

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.api.id
    }
  }
}

resource "google_compute_global_forwarding_rule" "cdn" {
  name       = "${var.project_name}-cdn-forwarding"
  target     = google_compute_target_https_proxy.cdn.id
  port_range = "443"
  ip_address = google_compute_global_address.cdn.address
}
```

---

## SSL/TLS Certificate Migration

### Let's Encrypt with Cert-Manager (Kubernetes)

```yaml
# k8s/cert-manager/cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-tls
  namespace: default
spec:
  secretName: app-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - app.example.com
    - www.example.com
```

### AWS ACM Certificate

```hcl
# terraform/acm/main.tf
resource "aws_acm_certificate" "main" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
```

---

## DNS Migration

### Zero-Downtime DNS Migration Script

```bash
#!/bin/bash
# dns-migration.sh

OLD_IP="192.168.1.100"
NEW_IP="10.0.0.100"
DOMAIN="app.example.com"
TTL_CURRENT=3600
TTL_MIGRATION=300
TTL_FINAL=3600

echo "=== DNS Migration Plan ==="
echo "Domain: $DOMAIN"
echo "Old IP: $OLD_IP"
echo "New IP: $NEW_IP"

# Phase 1: Lower TTL
echo "Phase 1: Lowering TTL to ${TTL_MIGRATION}s..."
# Update DNS TTL (provider-specific)
# aws route53 change-resource-record-sets ...

echo "Waiting for old TTL to expire (${TTL_CURRENT}s)..."
sleep $TTL_CURRENT

# Phase 2: Add new IP (weighted routing)
echo "Phase 2: Adding new IP with weighted routing..."
# Both IPs active, traffic split

# Phase 3: Monitor and shift traffic
echo "Phase 3: Monitoring traffic..."
echo "Check logs on both servers to verify traffic distribution"

# Phase 4: Remove old IP
echo "Phase 4: Removing old IP..."
# Remove old A record

# Phase 5: Restore TTL
echo "Phase 5: Restoring TTL to ${TTL_FINAL}s..."
# Update TTL back to original

echo "Migration complete!"
```

### AWS Route 53 Configuration

```hcl
# terraform/route53/main.tf
resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "app" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "app.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "app_weighted_new" {
  zone_id        = aws_route53_zone.main.zone_id
  name           = "app.${var.domain_name}"
  type           = "A"
  set_identifier = "new"

  weighted_routing_policy {
    weight = 100
  }

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_health_check" "app" {
  fqdn              = "app.${var.domain_name}"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30

  tags = {
    Name = "app-health-check"
  }
}
```

---

## CI/CD Pipeline Updates

### GitHub Actions - Multi-Cloud Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}

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
            type=semver,pattern={{version}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-aws:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production-aws

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster ${{ vars.ECS_CLUSTER }} \
            --service ${{ vars.ECS_SERVICE }} \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster ${{ vars.ECS_CLUSTER }} \
            --services ${{ vars.ECS_SERVICE }}

  deploy-gcp:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production-gcp

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ vars.SERVICE_NAME }} \
            --image ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            --region ${{ vars.GCP_REGION }} \
            --platform managed

  deploy-k8s:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production-k8s

    steps:
      - uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > $HOME/.kube/config

      - name: Update image tag
        run: |
          kubectl set image deployment/app \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/app -n production --timeout=300s
```

### GitHub Actions - Terraform Deployment

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [main]
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: terraform

    steps:
      - uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Terraform Init
        run: terraform init

      - name: Terraform Format
        run: terraform fmt -check

      - name: Terraform Validate
        run: terraform validate

      - name: Terraform Plan
        id: plan
        run: terraform plan -no-color -out=tfplan
        continue-on-error: true

      - name: Comment PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const output = `#### Terraform Plan
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve tfplan
```

---

## Monitoring and Logging

### Datadog Agent Deployment (Kubernetes)

```yaml
# k8s/datadog/values.yaml
datadog:
  apiKey: <DATADOG_API_KEY>
  site: datadoghq.com

  logs:
    enabled: true
    containerCollectAll: true

  apm:
    enabled: true
    portEnabled: true

  processAgent:
    enabled: true
    processCollection: true

  networkMonitoring:
    enabled: true

  clusterAgent:
    enabled: true
    metricsProvider:
      enabled: true

agents:
  rbac:
    create: true

  tolerations:
    - operator: Exists
```

### CloudWatch Configuration (Terraform)

```hcl
# terraform/cloudwatch/main.tf
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 30

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "CPU utilization is too high"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "${var.project_name}-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Memory utilization is too high"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.main.name],
            ["AWS/ECS", "MemoryUtilization", "ClusterName", aws_ecs_cluster.main.name]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "ECS Resource Utilization"
        }
      }
    ]
  })
}
```

### Prometheus + Grafana Stack

```yaml
# k8s/monitoring/prometheus-values.yaml
prometheus:
  prometheusSpec:
    retention: 15d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi

    serviceMonitorSelector:
      matchLabels:
        release: prometheus

grafana:
  enabled: true
  adminPassword: admin
  persistence:
    enabled: true
    size: 10Gi

  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
        - name: Prometheus
          type: prometheus
          url: http://prometheus-server
          access: proxy
          isDefault: true

alertmanager:
  enabled: true
  config:
    route:
      receiver: 'slack'
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 4h

    receivers:
      - name: 'slack'
        slack_configs:
          - api_url: 'https://hooks.slack.com/services/xxx'
            channel: '#alerts'
```

---

## Cost Estimation

### AWS Cost Estimation Script

```python
#!/usr/bin/env python3
# cost-estimator.py

import boto3
from datetime import datetime, timedelta

def get_aws_costs(days=30):
    client = boto3.client('ce', region_name='us-east-1')

    end = datetime.now()
    start = end - timedelta(days=days)

    response = client.get_cost_and_usage(
        TimePeriod={
            'Start': start.strftime('%Y-%m-%d'),
            'End': end.strftime('%Y-%m-%d')
        },
        Granularity='MONTHLY',
        Metrics=['UnblendedCost'],
        GroupBy=[
            {'Type': 'DIMENSION', 'Key': 'SERVICE'}
        ]
    )

    print(f"AWS Costs for last {days} days:")
    print("=" * 50)

    total = 0
    for result in response['ResultsByTime']:
        for group in result['Groups']:
            service = group['Keys'][0]
            cost = float(group['Metrics']['UnblendedCost']['Amount'])
            if cost > 0:
                print(f"{service}: ${cost:.2f}")
                total += cost

    print("=" * 50)
    print(f"Total: ${total:.2f}")
    return total

if __name__ == "__main__":
    get_aws_costs()
```

### Cost Comparison Matrix

| Resource | AWS (Monthly) | GCP (Monthly) | Azure (Monthly) |
|----------|--------------|---------------|-----------------|
| Small VM (2 vCPU, 4GB) | $30-40 | $25-35 | $35-45 |
| Medium VM (4 vCPU, 16GB) | $100-120 | $80-100 | $110-130 |
| Managed Postgres (Small) | $25-35 | $30-40 | $30-40 |
| Object Storage (1TB) | $23 | $20 | $18 |
| Load Balancer | $20-30 | $18-25 | $25-35 |
| NAT Gateway | $45-60 | $45 | $45-60 |
| Kubernetes (Control Plane) | $72 | Free | Free |

### Terraform Cost Estimation

```hcl
# Use infracost for cost estimation
# Install: brew install infracost

# Run: infracost breakdown --path .
```

---

## Security Hardening

### Security Checklist

```yaml
# security-checklist.yaml
network:
  - [ ] VPC with private/public subnets
  - [ ] Security groups with least privilege
  - [ ] Network ACLs configured
  - [ ] VPN/bastion host for admin access
  - [ ] WAF enabled for public endpoints

compute:
  - [ ] IMDSv2 required for EC2
  - [ ] No public IPs on application servers
  - [ ] SSH key rotation policy
  - [ ] Patch management automated

data:
  - [ ] Encryption at rest enabled
  - [ ] Encryption in transit (TLS 1.2+)
  - [ ] Database in private subnet
  - [ ] Automated backups configured
  - [ ] Secrets in secrets manager

identity:
  - [ ] MFA enforced for console
  - [ ] IAM roles (not users) for services
  - [ ] Least privilege policies
  - [ ] Regular access reviews

monitoring:
  - [ ] CloudTrail/audit logs enabled
  - [ ] VPC Flow Logs enabled
  - [ ] GuardDuty/Security Hub enabled
  - [ ] Alert on suspicious activity
```

### Security Group Configuration

```hcl
# terraform/security/main.tf
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app" {
  name        = "${var.project_name}-app-sg"
  description = "Security group for application servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### Kubernetes Network Policy

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: app
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8000
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: database
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
```

---

## Rollback and Disaster Recovery

### Rollback Script

```bash
#!/bin/bash
# rollback.sh

set -e

DEPLOYMENT_NAME="app"
NAMESPACE="production"

echo "=== Rollback Procedure ==="

# Check rollout history
echo "Recent deployments:"
kubectl rollout history deployment/$DEPLOYMENT_NAME -n $NAMESPACE

# Get current revision
CURRENT_REVISION=$(kubectl rollout history deployment/$DEPLOYMENT_NAME -n $NAMESPACE | tail -2 | head -1 | awk '{print $1}')
echo "Current revision: $CURRENT_REVISION"

# Rollback to previous version
echo "Rolling back to previous version..."
kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE

# Wait for rollback to complete
echo "Waiting for rollback to complete..."
kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=300s

# Verify new pods are healthy
echo "Verifying pod health..."
kubectl get pods -l app=$DEPLOYMENT_NAME -n $NAMESPACE

echo "Rollback completed successfully!"
```

### Disaster Recovery Terraform

```hcl
# terraform/dr/main.tf

# Cross-region S3 replication
resource "aws_s3_bucket" "dr" {
  provider = aws.dr_region
  bucket   = "${var.project_name}-${var.environment}-dr"
}

resource "aws_s3_bucket_replication_configuration" "main" {
  bucket = aws_s3_bucket.main.id
  role   = aws_iam_role.replication.arn

  rule {
    id     = "replicate-all"
    status = "Enabled"

    destination {
      bucket        = aws_s3_bucket.dr.arn
      storage_class = "STANDARD_IA"
    }
  }
}

# RDS Read Replica in DR region
resource "aws_db_instance" "dr_replica" {
  provider               = aws.dr_region
  identifier             = "${var.project_name}-db-dr"
  replicate_source_db    = aws_db_instance.main.arn
  instance_class         = var.db_instance_class
  storage_encrypted      = true
  vpc_security_group_ids = [aws_security_group.rds_dr.id]
  publicly_accessible    = false
  skip_final_snapshot    = true
}

# Route 53 Health Check and Failover
resource "aws_route53_health_check" "primary" {
  fqdn              = aws_lb.main.dns_name
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
}

resource "aws_route53_record" "failover_primary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "app.${var.domain_name}"
  type    = "A"

  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier  = "primary"
  health_check_id = aws_route53_health_check.primary.id

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "failover_secondary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "app.${var.domain_name}"
  type    = "A"

  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier = "secondary"

  alias {
    name                   = aws_lb.dr.dns_name
    zone_id                = aws_lb.dr.zone_id
    evaluate_target_health = true
  }
}
```

### Backup and Restore Scripts

```bash
#!/bin/bash
# backup-all.sh

set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="s3://backups-bucket"

echo "=== Full Backup - $BACKUP_DATE ==="

# Database backup
echo "Backing up database..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f /tmp/db_$BACKUP_DATE.dump
aws s3 cp /tmp/db_$BACKUP_DATE.dump $BACKUP_BUCKET/database/

# Application config backup
echo "Backing up configuration..."
kubectl get configmaps -n production -o yaml > /tmp/configmaps_$BACKUP_DATE.yaml
kubectl get secrets -n production -o yaml > /tmp/secrets_$BACKUP_DATE.yaml
aws s3 cp /tmp/configmaps_$BACKUP_DATE.yaml $BACKUP_BUCKET/k8s/
aws s3 cp /tmp/secrets_$BACKUP_DATE.yaml $BACKUP_BUCKET/k8s/

# Terraform state backup
echo "Backing up Terraform state..."
aws s3 cp s3://terraform-state-bucket/terraform.tfstate $BACKUP_BUCKET/terraform/terraform_$BACKUP_DATE.tfstate

echo "Backup completed: $BACKUP_DATE"

# Cleanup old backups (keep last 30 days)
aws s3 ls $BACKUP_BUCKET/database/ | while read -r line; do
  file_date=$(echo $line | awk '{print $1}')
  if [[ "$file_date" < $(date -d "30 days ago" +%Y-%m-%d) ]]; then
    file_name=$(echo $line | awk '{print $4}')
    aws s3 rm $BACKUP_BUCKET/database/$file_name
  fi
done
```

---

## Migration Runbook Template

```markdown
# Migration Runbook: [Project Name]

## Pre-Migration Checklist

- [ ] Infrastructure assessment complete
- [ ] Target environment provisioned
- [ ] DNS TTL lowered (72 hours before)
- [ ] Backup verified
- [ ] Rollback plan tested
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled

## Migration Steps

### T-24 Hours
- [ ] Final backup of source system
- [ ] Verify target environment readiness
- [ ] Confirm rollback procedures

### T-1 Hour
- [ ] Enable maintenance mode
- [ ] Take final database snapshot
- [ ] Stop application traffic

### Migration
- [ ] Export data from source
- [ ] Import data to target
- [ ] Verify data integrity
- [ ] Update application configuration
- [ ] Deploy application to target
- [ ] Run smoke tests

### Cutover
- [ ] Update DNS records
- [ ] Monitor traffic shift
- [ ] Verify application functionality
- [ ] Check monitoring dashboards

### Post-Migration
- [ ] Disable maintenance mode
- [ ] Monitor for 24 hours
- [ ] Restore DNS TTL
- [ ] Document lessons learned
- [ ] Decommission source (after stability period)

## Rollback Procedure

1. Revert DNS to source
2. Restore database from pre-migration backup
3. Restart source application
4. Notify stakeholders

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Project Lead | | |
| DBA | | |
| DevOps | | |
| On-call | | |
```

---

## Additional Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [GCP Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Azure Well-Architected Framework](https://docs.microsoft.com/en-us/azure/architecture/framework/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Registry](https://registry.terraform.io/)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
