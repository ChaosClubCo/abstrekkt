---
name: container-orchestration
description: name: container-orchestration description: Docker, Kubernetes, and container management for scalable application deployment and operations. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Container Orchestration

---
name: container-orchestration
description: Docker, Kubernetes, and container management for scalable application deployment and operations
version: 1.0.0
category: infrastructure
tags: [containers, docker, kubernetes, orchestration, microservices, devops]
related_skills: [server-administration, monitoring-alerting, network-configuration]
---

## Overview

Container Orchestration enables automated deployment, scaling, and management of containerized applications across clusters of hosts. This skill covers Docker container fundamentals, Kubernetes architecture, service mesh integration, and operational patterns for running production container workloads.

Modern container orchestration has become the foundation for cloud-native applications, providing consistent deployment environments, automatic scaling, self-healing capabilities, and declarative infrastructure management.

### Key Principles

1. **Declarative Configuration**: Define desired state, let the orchestrator handle reconciliation
2. **Immutable Containers**: Never modify running containers; replace with new versions
3. **Microservices Architecture**: Design for distributed, loosely-coupled services
4. **Horizontal Scaling**: Scale by adding containers, not by making them larger
5. **Health-First Operations**: Rely on probes and self-healing mechanisms

## When to Use This Skill

### Appropriate Scenarios

- Deploying microservices architectures
- Scaling applications dynamically based on demand
- Implementing blue-green or canary deployments
- Managing multi-environment application deployments
- Running stateless web applications
- Orchestrating batch processing workloads
- Building development and staging environments

### When to Consider Alternatives

- **Simple static sites**: CDN or serverless hosting more appropriate
- **Single monolithic application**: May not need orchestration complexity
- **Strict compliance requirements**: Some industries require traditional VMs
- **GPU-intensive workloads**: May require specialized infrastructure
- **Legacy applications**: Migration cost may outweigh benefits

## Core Processes

### 1. Docker Image Building

```dockerfile
# Multi-stage Dockerfile for production builds
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production
WORKDIR /app

# Security: Run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy only production artifacts
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

### 2. Kubernetes Deployment

```yaml
# Complete Kubernetes deployment with best practices
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  labels:
    app: api-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
    spec:
      serviceAccountName: api-service
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001

      containers:
        - name: api
          image: registry.example.com/api-service:v1.2.3
          imagePullPolicy: Always

          ports:
            - containerPort: 3000
              name: http

          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: database-url

          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi

          livenessProbe:
            httpGet:
              path: /health/live
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL

          volumeMounts:
            - name: tmp
              mountPath: /tmp
            - name: config
              mountPath: /app/config
              readOnly: true

      volumes:
        - name: tmp
          emptyDir: {}
        - name: config
          configMap:
            name: api-config

      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: api-service
                topologyKey: kubernetes.io/hostname

      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app: api-service

---
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api-service
  ports:
    - port: 80
      targetPort: 3000
      name: http
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-service
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 3
  maxReplicas: 20
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
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
```

### 3. Helm Chart Structure

```yaml
# Chart.yaml
apiVersion: v2
name: api-service
description: A Helm chart for the API service
type: application
version: 1.0.0
appVersion: "1.2.3"

---
# values.yaml
replicaCount: 3

image:
  repository: registry.example.com/api-service
  pullPolicy: Always
  tag: ""

serviceAccount:
  create: true
  name: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-tls
      hosts:
        - api.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70

podDisruptionBudget:
  enabled: true
  minAvailable: 2

env:
  NODE_ENV: production

secrets:
  - name: DATABASE_URL
    secretName: api-secrets
    secretKey: database-url
```

### 4. Service Mesh Configuration

```yaml
# Istio VirtualService for traffic management
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: api-service
spec:
  hosts:
    - api-service
  http:
    - match:
        - headers:
            x-canary:
              exact: "true"
      route:
        - destination:
            host: api-service
            subset: canary
    - route:
        - destination:
            host: api-service
            subset: stable
          weight: 95
        - destination:
            host: api-service
            subset: canary
          weight: 5

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: api-service
spec:
  host: api-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
  subsets:
    - name: stable
      labels:
        version: stable
    - name: canary
      labels:
        version: canary
```

### 5. GitOps Deployment Pipeline

```yaml
# ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: api-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default

  source:
    repoURL: https://github.com/company/k8s-manifests.git
    targetRevision: main
    path: apps/api-service/overlays/production

  destination:
    server: https://kubernetes.default.svc
    namespace: production

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m

  revisionHistoryLimit: 10
```

## Tools and Technologies

### Container Runtimes
| Runtime | Use Case | Notes |
|---------|----------|-------|
| containerd | Production Kubernetes | Industry standard |
| Docker | Development | Familiar tooling |
| CRI-O | OpenShift | Red Hat ecosystem |
| Podman | Rootless containers | Docker alternative |

### Orchestration Platforms
| Platform | Strengths | Best For |
|----------|-----------|----------|
| Kubernetes | Feature-rich, ecosystem | Large-scale production |
| Docker Swarm | Simplicity | Small deployments |
| Nomad | Multi-workload | Mixed container/VM |
| ECS/Fargate | AWS native | AWS-centric shops |

### Supporting Tools
| Tool | Purpose |
|------|---------|
| Helm | Package management |
| Kustomize | Configuration overlays |
| ArgoCD | GitOps deployment |
| Istio | Service mesh |
| Linkerd | Lightweight service mesh |
| Cert-Manager | Certificate automation |

## Metrics and Monitoring

### Key Performance Indicators

```yaml
# Prometheus rules for container monitoring
groups:
  - name: container_health
    rules:
      - record: container:cpu_usage:percent
        expr: |
          sum(rate(container_cpu_usage_seconds_total[5m])) by (pod, namespace)
          / sum(container_spec_cpu_quota/container_spec_cpu_period) by (pod, namespace) * 100

      - record: container:memory_usage:percent
        expr: |
          sum(container_memory_working_set_bytes) by (pod, namespace)
          / sum(container_spec_memory_limit_bytes) by (pod, namespace) * 100

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"

      - alert: PodNotReady
        expr: |
          sum by (pod, namespace) (kube_pod_status_ready{condition="true"}) == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.pod }} has been not ready for 5 minutes"

      - alert: DeploymentReplicasMismatch
        expr: |
          kube_deployment_spec_replicas != kube_deployment_status_replicas_available
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Deployment {{ $labels.deployment }} has mismatched replicas"
```

### Resource Optimization

```bash
#!/bin/bash
# Script to analyze container resource usage

kubectl top pods --all-namespaces --containers | \
  awk 'NR>1 {
    namespace=$1
    pod=$2
    container=$3
    cpu=$4
    memory=$5
    printf "%-20s %-40s %-20s %s %s\n", namespace, pod, container, cpu, memory
  }' | sort -k4 -h -r | head -20

echo ""
echo "Pods with high memory usage:"
kubectl get pods --all-namespaces -o json | \
  jq -r '.items[] | select(.status.phase=="Running") |
    "\(.metadata.namespace)/\(.metadata.name): \(.spec.containers[].resources.limits.memory // "no limit")"' | \
  sort
```

## Common Pitfalls

### 1. Resource Limits Not Set
**Problem**: Containers without limits can starve other workloads
**Solution**: Always define resource requests and limits

### 2. Missing Health Probes
**Problem**: Kubernetes cannot detect unhealthy containers
**Solution**: Implement comprehensive liveness and readiness probes

### 3. Running as Root
**Problem**: Security vulnerability if container is compromised
**Solution**: Use non-root users and security contexts

### 4. No Pod Disruption Budgets
**Problem**: Deployments can take down all replicas simultaneously
**Solution**: Define PDBs to maintain availability during updates

### 5. Ignoring Pod Anti-Affinity
**Problem**: All replicas scheduled on same node
**Solution**: Use anti-affinity to spread across nodes/zones

## Integration Points

### Upstream Dependencies
- **Container Registries**: Docker Hub, ECR, GCR, Harbor
- **CI/CD Systems**: GitHub Actions, GitLab CI, Jenkins
- **Secret Management**: Vault, AWS Secrets Manager, External Secrets
- **Certificate Authorities**: Let's Encrypt, cert-manager

### Downstream Consumers
- **Applications**: Microservices, APIs, workers
- **Monitoring**: Prometheus, Datadog, New Relic
- **Logging**: Fluentd, Loki, CloudWatch
- **Tracing**: Jaeger, Zipkin, Tempo

### Architecture Flow
```
[CI/CD Pipeline] --> [Container Registry] --> [Kubernetes Cluster]
                                                      |
                    +----------------+----------------+
                    |                |                |
              [Ingress]        [Services]       [Jobs/CronJobs]
                    |                |                |
              [Pods] <---------> [Pods] <---------> [Pods]
                    |                |
            [ConfigMaps]       [Secrets]
                    |                |
            [PersistentVolumes]  [External Services]
```

## Best Practices Checklist

- [ ] Multi-stage Dockerfiles for minimal images
- [ ] Non-root container execution
- [ ] Resource requests and limits defined
- [ ] Liveness and readiness probes configured
- [ ] Pod disruption budgets in place
- [ ] Anti-affinity rules for high availability
- [ ] Secrets managed externally (not in manifests)
- [ ] Network policies for microsegmentation
- [ ] Image scanning in CI/CD pipeline
- [ ] GitOps for deployment management
