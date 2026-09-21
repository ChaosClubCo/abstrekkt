# VIBECODED SAAS PLAYBOOK - CHAPTER 2 CONTINUATION

**Part I: Foundations - Containerization & Orchestration (Continued)**

*Deployment Strategies, Auto-Scaling, and Security Hardening*

---

## CHAPTER 2: CONTAINERIZATION & ORCHESTRATION (CONTINUED)

### 2.3 Deployment Strategies for Zero-Downtime Updates

**Duration:** 3 days | **Priority:** High | **Prerequisites:** 2.2 Kubernetes cluster operational

#### Overview

A deployment strategy is your plan for releasing new code to production without disrupting users. The naive approach—"stop old version, start new version"—causes downtime. Production-grade strategies ensure users never notice deployments happening. Think of it like renovating a restaurant: you don't close for months and lose customers; you renovate one section at a time while keeping the restaurant open.

**Why deployment strategies matter for Vibecoded:**
- You'll deploy 5–20× per day (modern CI/CD velocity). Each deployment must be invisible to users.
- When a bad deployment happens (and it will), you need instant rollback. Time to detect + rollback should be <5 minutes.
- Different features require different strategies: critical payment flow (canary), UI change (rolling), infrastructure upgrade (blue-green).

**The Three Production Strategies:**

1. **Rolling Update (Default, 90% of deployments):** Replace pods gradually, old and new versions coexist temporarily
2. **Blue-Green (High-stakes, zero-risk tolerance):** Run both versions simultaneously, instant cutover, instant rollback
3. **Canary (Experimental, gradual risk):** Route small % of traffic to new version, gradually increase if metrics look good

**Common Anti-Patterns to Avoid:**
- **Recreate strategy:** Delete all old pods, then create new pods. Causes downtime. Never use in production.
- **No health checks:** Kubernetes routes traffic before app is ready. Users hit errors during deployment.
- **No rollback automation:** Manual rollback takes 10–30 minutes. Automated rollback takes 30 seconds.

This section gives you all three strategies with production-tested configurations, automated rollbacks, and observability.

#### How to Implement

**Strategy 1: Rolling Update (Default for Most Deployments)**

Rolling updates gradually replace old pods with new pods. Kubernetes ensures minimum availability throughout the process.

```yaml
# kubernetes/deployments/api-rolling-update.yaml
# Production rolling update configuration with optimal settings

apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibecoded-api
  namespace: production
  labels:
    app: vibecoded-api
    deployment-strategy: rolling
spec:
  # Number of replicas (HPA will override this, but set baseline)
  replicas: 5
  
  # Rolling update strategy configuration
  strategy:
    type: RollingUpdate
    rollingUpdate:
      # maxSurge: Maximum extra pods during update
      # Formula: Allows up to replicas + maxSurge pods temporarily
      # Example: 5 replicas + 2 surge = 7 pods max during update
      # Tradeoff: Higher = faster rollout, more resource usage
      maxSurge: 2  # 40% surge (2/5 = 0.4)
      
      # maxUnavailable: Maximum pods that can be down during update
      # Formula: Minimum available = replicas - maxUnavailable
      # Example: 5 replicas - 0 unavailable = 5 pods always available
      # Tradeoff: 0 = zero downtime, slower rollout
      maxUnavailable: 0
      
      # Why these values:
      # - maxUnavailable: 0 guarantees zero downtime
      # - maxSurge: 2 provides 40% extra capacity during rollout
      # - Rollout speed: 5 pods / 2 surge = 3 batches (~90 seconds total)
  
  # Minimum time a new pod must be ready before considered available
  minReadySeconds: 10
  # Why: Prevents rapid rollout of broken deployments
  # Kubernetes waits 10s after readiness probe passes before continuing
  
  # Number of old ReplicaSets to keep (for rollback)
  revisionHistoryLimit: 10
  # Why: Allows rollback to any of last 10 deployments
  # Each ReplicaSet is ~1KB, so 10 = 10KB overhead
  
  # Progress deadline (rollout must complete within this time)
  progressDeadlineSeconds: 600  # 10 minutes
  # Why: If rollout stalls (image pull errors, insufficient resources),
  # fail the deployment instead of hanging indefinitely
  
  selector:
    matchLabels:
      app: vibecoded-api
  
  template:
    metadata:
      labels:
        app: vibecoded-api
        version: "1.2.4"  # Update this with each deployment
      annotations:
        # Track deployment metadata
        deployment.kubernetes.io/revision: "47"
        deployment.kubernetes.io/timestamp: "2024-12-15T10:30:00Z"
        deployment.kubernetes.io/git-commit: "abc123f"
    
    spec:
      # Graceful shutdown configuration
      terminationGracePeriodSeconds: 60
      # Why: Gives app 60 seconds to:
      # 1. Stop accepting new connections
      # 2. Finish in-flight requests
      # 3. Close database connections gracefully
      # 4. Flush logs/metrics
      # After 60s, Kubernetes sends SIGKILL (force termination)
      
      containers:
      - name: api
        image: ghcr.io/vibecoded/api:v1.2.4-abc123f
        
        # CRITICAL: Proper health checks for zero-downtime
        # Without these, Kubernetes routes traffic to pods before they're ready
        
        # Startup probe: Allows slow startup (up to 5 minutes)
        startupProbe:
          httpGet:
            path: /health/startup
            port: 3000
            httpHeaders:
            - name: X-Healthcheck-Type
              value: startup
          initialDelaySeconds: 0
          periodSeconds: 10
          failureThreshold: 30  # 30 * 10s = 300s (5 min) max startup
          timeoutSeconds: 3
          # Why: Some apps take 2-3 minutes to start (load data, warm caches)
          # Startup probe prevents liveness/readiness from killing during startup
        
        # Liveness probe: Is the app alive? (restart if fails)
        livenessProbe:
          httpGet:
            path: /health/liveness
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3  # 3 consecutive failures = restart pod
          timeoutSeconds: 3
          successThreshold: 1
          # Why: Detects deadlocks, infinite loops, total failures
          # Conservative thresholds prevent flapping (rapid restart cycles)
        
        # Readiness probe: Is the app ready for traffic?
        readinessProbe:
          httpGet:
            path: /health/readiness
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5  # Check more frequently than liveness
          failureThreshold: 3
          timeoutSeconds: 2
          successThreshold: 1
          # Why: Removes pod from load balancer if unhealthy
          # Prevents routing traffic to pods that can't handle requests
        
        # Lifecycle hooks for graceful shutdown
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - |
                # Stop accepting new connections
                echo "Stopping new connections..."
                # Give load balancer time to remove from pool (15s)
                sleep 15
                # Signal app to start graceful shutdown
                kill -SIGTERM 1
          # Why: Ensures zero dropped requests during rollout
          # Sequence: preStop -> SIGTERM -> wait up to terminationGracePeriodSeconds -> SIGKILL
        
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 2Gi
        
        env:
        - name: NODE_ENV
          value: production
        - name: GRACEFUL_SHUTDOWN_TIMEOUT
          value: "50000"  # 50s (less than terminationGracePeriodSeconds)

---
# kubernetes/services/api-service.yaml
# Service configuration for rolling updates

apiVersion: v1
kind: Service
metadata:
  name: vibecoded-api
  namespace: production
spec:
  type: ClusterIP
  
  # Session affinity (optional, use for stateful apps)
  sessionAffinity: None
  # Options: None (round-robin), ClientIP (sticky sessions)
  # For stateless APIs, use None for better load distribution
  
  selector:
    app: vibecoded-api
    # Note: Does NOT include 'version' label
    # Why: Service routes to both old and new versions during rollout
  
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
```

**Health Check Endpoint Implementation:**

Your application must implement these health check endpoints correctly:

```typescript
// server.ts - Health check endpoints for Kubernetes

import express from 'express';
import { Pool } from 'pg';

const app = express();
const dbPool = new Pool({ /* config */ });

// Track readiness state
let isShuttingDown = false;

// /health/startup - Only fails if app fundamentally broken
app.get('/health/startup', async (req, res) => {
  // Check critical dependencies are available
  try {
    // Can we connect to database?
    const dbCheck = await dbPool.query('SELECT 1');
    
    // Can we reach Redis?
    const redisCheck = await redis.ping();
    
    // Are required environment variables set?
    if (!process.env.DATABASE_URL || !process.env.REDIS_URL) {
      throw new Error('Missing required environment variables');
    }
    
    res.status(200).json({ 
      status: 'ok',
      checks: {
        database: 'connected',
        redis: 'connected',
        config: 'valid'
      }
    });
  } catch (error) {
    // Startup failure - Kubernetes will restart pod
    res.status(503).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// /health/liveness - Is the app responsive?
app.get('/health/liveness', (req, res) => {
  // Simple check: Can we respond to HTTP requests?
  // This endpoint should be FAST (<100ms)
  
  if (isShuttingDown) {
    // We're shutting down, but still alive
    return res.status(200).json({ status: 'shutting_down' });
  }
  
  // Check event loop isn't blocked
  const start = Date.now();
  setImmediate(() => {
    const delay = Date.now() - start;
    if (delay > 1000) {
      // Event loop blocked for >1 second = unhealthy
      return res.status(503).json({ 
        status: 'unhealthy',
        reason: 'event_loop_blocked',
        delay_ms: delay
      });
    }
    
    res.status(200).json({ status: 'ok' });
  });
});

// /health/readiness - Can we handle traffic?
app.get('/health/readiness', async (req, res) => {
  if (isShuttingDown) {
    // Shutting down - remove from load balancer
    return res.status(503).json({ 
      status: 'not_ready',
      reason: 'shutting_down'
    });
  }
  
  try {
    // Check dependencies are healthy
    // These checks should be FAST (<500ms total)
    
    // Database connection pool healthy?
    if (dbPool.totalCount === 0) {
      throw new Error('No database connections available');
    }
    
    // Redis responsive?
    const redisStart = Date.now();
    await redis.ping();
    const redisLatency = Date.now() - redisStart;
    
    if (redisLatency > 500) {
      throw new Error(`Redis latency too high: ${redisLatency}ms`);
    }
    
    // Check we're not overloaded
    const memUsage = process.memoryUsage();
    const memPercent = memUsage.heapUsed / memUsage.heapTotal;
    
    if (memPercent > 0.95) {
      throw new Error(`Memory usage critical: ${Math.round(memPercent * 100)}%`);
    }
    
    res.status(200).json({ 
      status: 'ready',
      checks: {
        database: 'healthy',
        redis: `healthy (${redisLatency}ms)`,
        memory: `${Math.round(memPercent * 100)}%`
      }
    });
  } catch (error) {
    // Not ready for traffic
    res.status(503).json({ 
      status: 'not_ready',
      error: error.message 
    });
  }
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, starting graceful shutdown...');
  isShuttingDown = true;
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connections
    await dbPool.end();
    console.log('Database pool closed');
    
    // Close Redis connections
    await redis.quit();
    console.log('Redis connection closed');
    
    // Exit process
    process.exit(0);
  });
  
  // Force exit after timeout (safety net)
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 55000);  // 55s (less than Kubernetes terminationGracePeriodSeconds)
});

const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

**Rolling Update Workflow:**

```bash
#!/bin/bash
# deploy-rolling.sh - Rolling update deployment script

set -euo pipefail

VERSION=$1
IMAGE="ghcr.io/vibecoded/api:${VERSION}"

echo "🚀 Starting rolling update to ${VERSION}..."

# 1. Update deployment with new image
kubectl set image deployment/vibecoded-api \
  api=${IMAGE} \
  --namespace=production \
  --record

# 2. Watch rollout progress
kubectl rollout status deployment/vibecoded-api \
  --namespace=production \
  --timeout=10m

# 3. Verify rollout success
if [ $? -eq 0 ]; then
  echo "✅ Rollout successful!"
  
  # Get new pods
  echo ""
  echo "New pods:"
  kubectl get pods -n production -l app=vibecoded-api
  
  # Check pod logs for errors
  echo ""
  echo "Checking for errors in new pods..."
  kubectl logs -n production -l app=vibecoded-api \
    --tail=50 \
    --timestamps \
    | grep -i error || echo "No errors found"
  
else
  echo "❌ Rollout failed!"
  
  # Automatic rollback
  echo "Rolling back to previous version..."
  kubectl rollout undo deployment/vibecoded-api \
    --namespace=production
  
  exit 1
fi

# 4. Monitor error rate for 5 minutes
echo ""
echo "Monitoring error rate for 5 minutes..."
for i in {1..10}; do
  ERROR_RATE=$(curl -s "http://prometheus:9090/api/v1/query?query=rate(http_requests_total{status=~\"5..\"}[1m])" \
    | jq -r '.data.result[0].value[1]' \
    | cut -d. -f1)
  
  echo "Error rate: ${ERROR_RATE} errors/sec"
  
  if [ "${ERROR_RATE}" -gt 10 ]; then
    echo "❌ Error rate too high! Rolling back..."
    kubectl rollout undo deployment/vibecoded-api --namespace=production
    exit 1
  fi
  
  sleep 30
done

echo "✅ Deployment stable. Monitoring continues in background."
```

**Rollback Commands:**

```bash
# View rollout history
kubectl rollout history deployment/vibecoded-api -n production

# Output:
# REVISION  CHANGE-CAUSE
# 45        kubectl set image...
# 46        kubectl set image...
# 47        kubectl set image... (current)

# Rollback to previous version (revision 46)
kubectl rollout undo deployment/vibecoded-api -n production

# Rollback to specific revision
kubectl rollout undo deployment/vibecoded-api -n production --to-revision=45

# Check rollback status
kubectl rollout status deployment/vibecoded-api -n production
```

**Strategy 2: Blue-Green Deployment (High-Stakes, Zero-Risk)**

Blue-Green deployments run two complete environments side-by-side. Traffic is instantly switched from old (Blue) to new (Green). If issues arise, instantly switch back.

```yaml
# kubernetes/deployments/api-blue.yaml
# Blue deployment (current production)

apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibecoded-api-blue
  namespace: production
  labels:
    app: vibecoded-api
    version: blue
    deployment-strategy: blue-green
spec:
  replicas: 5
  
  selector:
    matchLabels:
      app: vibecoded-api
      version: blue
  
  template:
    metadata:
      labels:
        app: vibecoded-api
        version: blue
    spec:
      containers:
      - name: api
        image: ghcr.io/vibecoded/api:v1.2.3-old
        # ... same config as rolling update ...

---
# kubernetes/deployments/api-green.yaml
# Green deployment (new version)

apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibecoded-api-green
  namespace: production
  labels:
    app: vibecoded-api
    version: green
    deployment-strategy: blue-green
spec:
  replicas: 5
  
  selector:
    matchLabels:
      app: vibecoded-api
      version: green
  
  template:
    metadata:
      labels:
        app: vibecoded-api
        version: green
    spec:
      containers:
      - name: api
        image: ghcr.io/vibecoded/api:v1.2.4-new
        # ... same config as rolling update ...

---
# kubernetes/services/api-service-blue-green.yaml
# Service that switches between blue and green

apiVersion: v1
kind: Service
metadata:
  name: vibecoded-api
  namespace: production
  labels:
    deployment-strategy: blue-green
spec:
  type: ClusterIP
  
  # Initially points to blue
  selector:
    app: vibecoded-api
    version: blue  # <-- Change this to 'green' to cutover
  
  ports:
  - name: http
    port: 80
    targetPort: 3000
```

**Blue-Green Deployment Workflow:**

```bash
#!/bin/bash
# deploy-blue-green.sh - Blue-Green deployment script

set -euo pipefail

NEW_VERSION=$1
OLD_VERSION=$(kubectl get deployment vibecoded-api-blue -n production -o jsonpath='{.spec.template.spec.containers[0].image}' | cut -d: -f2)

echo "🔵 Current (Blue): ${OLD_VERSION}"
echo "🟢 New (Green): ${NEW_VERSION}"

# Step 1: Deploy green environment
echo ""
echo "Step 1: Deploying green environment..."
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibecoded-api-green
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: vibecoded-api
      version: green
  template:
    metadata:
      labels:
        app: vibecoded-api
        version: green
    spec:
      containers:
      - name: api
        image: ghcr.io/vibecoded/api:${NEW_VERSION}
        # ... rest of spec ...
EOF

# Step 2: Wait for green to be ready
echo ""
echo "Step 2: Waiting for green pods to be ready..."
kubectl wait --for=condition=available --timeout=10m \
  deployment/vibecoded-api-green -n production

# Step 3: Smoke test green environment
echo ""
echo "Step 3: Smoke testing green environment..."

GREEN_POD=$(kubectl get pod -n production -l version=green -o jsonpath='{.items[0].metadata.name}')

# Port-forward to test directly
kubectl port-forward -n production ${GREEN_POD} 8888:3000 &
PF_PID=$!
sleep 5

# Run smoke tests
for endpoint in /health /api/apps /api/users; do
  echo "Testing ${endpoint}..."
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8888${endpoint})
  
  if [ "${STATUS}" != "200" ]; then
    echo "❌ Smoke test failed on ${endpoint} (HTTP ${STATUS})"
    kill ${PF_PID}
    
    # Delete green deployment (rollback)
    kubectl delete deployment vibecoded-api-green -n production
    exit 1
  fi
done

kill ${PF_PID}
echo "✅ Smoke tests passed"

# Step 4: Switch traffic to green (CUTOVER)
echo ""
echo "Step 4: Switching traffic to green..."
read -p "Ready to cutover to green? (yes/no) " -n 3 -r
echo
if [[ ! $REPLY =~ ^yes$ ]]; then
  echo "Cutover aborted"
  exit 1
fi

# Patch service selector to point to green
kubectl patch service vibecoded-api -n production \
  -p '{"spec":{"selector":{"version":"green"}}}'

echo "🟢 Traffic now routed to green!"

# Step 5: Monitor for 5 minutes
echo ""
echo "Step 5: Monitoring green for 5 minutes..."
echo "If issues arise, run: ./rollback-blue-green.sh"

for i in {1..10}; do
  # Check error rate
  ERROR_COUNT=$(kubectl logs -n production -l version=green --tail=100 \
    | grep -i error | wc -l)
  
  echo "[${i}/10] Error count in last 100 lines: ${ERROR_COUNT}"
  
  if [ "${ERROR_COUNT}" -gt 20 ]; then
    echo "❌ Too many errors! Automatic rollback..."
    kubectl patch service vibecoded-api -n production \
      -p '{"spec":{"selector":{"version":"blue"}}}'
    echo "🔵 Rolled back to blue"
    exit 1
  fi
  
  sleep 30
done

# Step 6: Decomission blue
echo ""
echo "Step 6: Green is stable. Decomissioning blue..."
read -p "Delete blue deployment? (yes/no) " -n 3 -r
echo
if [[ $REPLY =~ ^yes$ ]]; then
  kubectl delete deployment vibecoded-api-blue -n production
  
  # Rename green to blue (for next deployment)
  kubectl patch deployment vibecoded-api-green -n production \
    -p '{"metadata":{"name":"vibecoded-api-blue"},"spec":{"selector":{"matchLabels":{"version":"blue"}},"template":{"metadata":{"labels":{"version":"blue"}}}}}'
  
  kubectl patch service vibecoded-api -n production \
    -p '{"spec":{"selector":{"version":"blue"}}}'
  
  echo "✅ Blue-Green deployment complete!"
else
  echo "Blue deployment preserved for manual cleanup"
fi
```

**Instant Rollback Script:**

```bash
#!/bin/bash
# rollback-blue-green.sh - Instant rollback for blue-green

set -euo pipefail

echo "🔵 Rolling back to blue..."

# Switch service back to blue
kubectl patch service vibecoded-api -n production \
  -p '{"spec":{"selector":{"version":"blue"}}}'

echo "✅ Rollback complete! Traffic routed to blue."

# Verify
kubectl get service vibecoded-api -n production -o jsonpath='{.spec.selector}'
```

**Strategy 3: Canary Deployment (Gradual, Metrics-Driven)**

Canary deployments gradually shift traffic from old to new version, monitoring metrics at each step. If metrics degrade, rollback automatically.

**Using Argo Rollouts (Recommended for Canary):**

```bash
# Install Argo Rollouts
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

# Install Argo Rollouts CLI
brew install argoproj/tap/kubectl-argo-rollouts  # macOS
# or download from GitHub releases
```

```yaml
# kubernetes/rollouts/api-canary.yaml
# Canary deployment with Argo Rollouts

apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: vibecoded-api
  namespace: production
spec:
  replicas: 5
  
  # Rollout strategy: canary
  strategy:
    canary:
      # Canary steps (gradual traffic shift)
      steps:
      # Step 1: Deploy canary with 10% traffic
      - setWeight: 10
      - pause: {duration: 5m}  # Monitor for 5 minutes
      
      # Step 2: Increase to 25% traffic
      - setWeight: 25
      - pause: {duration: 5m}
      
      # Step 3: Increase to 50% traffic
      - setWeight: 50
      - pause: {duration: 10m}
      
      # Step 4: Increase to 75% traffic
      - setWeight: 75
      - pause: {duration: 5m}
      
      # Step 5: Full rollout (100%)
      - setWeight: 100
      
      # Traffic routing via Ingress/Service Mesh
      trafficRouting:
        nginx:
          stableIngress: vibecoded-api-stable
          annotationPrefix: nginx.ingress.kubernetes.io
      
      # Automatic rollback on failure
      analysis:
        templates:
        - templateName: success-rate
        - templateName: latency-p95
        startingStep: 1  # Start analysis after first step
        
        # Rollback thresholds
        failureLimit: 3  # Fail after 3 consecutive failures
        successThreshold: 3  # Require 3 consecutive successes
  
  revisionHistoryLimit: 10
  
  selector:
    matchLabels:
      app: vibecoded-api
  
  template:
    metadata:
      labels:
        app: vibecoded-api
    spec:
      containers:
      - name: api
        image: ghcr.io/vibecoded/api:v1.2.4
        # ... same config as before ...

---
# kubernetes/rollouts/analysis-template-success-rate.yaml
# Analysis template for success rate monitoring

apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
  namespace: production
spec:
  metrics:
  - name: success-rate
    # Query Prometheus for success rate
    provider:
      prometheus:
        address: http://prometheus.monitoring:9090
        query: |
          sum(rate(http_requests_total{namespace="production",app="vibecoded-api",status!~"5.."}[5m]))
          /
          sum(rate(http_requests_total{namespace="production",app="vibecoded-api"}[5m]))
    
    # Success criteria
    successCondition: result >= 0.95  # 95% success rate minimum
    failureLimit: 3
    interval: 1m
    count: 5  # Check 5 times

---
# kubernetes/rollouts/analysis-template-latency.yaml
# Analysis template for latency monitoring

apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: latency-p95
  namespace: production
spec:
  metrics:
  - name: latency-p95
    provider:
      prometheus:
        address: http://prometheus.monitoring:9090
        query: |
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket{namespace="production",app="vibecoded-api"}[5m])) by (le)
          )
    
    # Success criteria
    successCondition: result <= 0.5  # P95 latency < 500ms
    failureLimit: 3
    interval: 1m
    count: 5
```

**Canary Deployment Workflow:**

```bash
#!/bin/bash
# deploy-canary.sh - Canary deployment with Argo Rollouts

set -euo pipefail

NEW_VERSION=$1

echo "🐤 Starting canary deployment to ${NEW_VERSION}..."

# Update Rollout with new image
kubectl argo rollouts set image vibecoded-api \
  api=ghcr.io/vibecoded/api:${NEW_VERSION} \
  -n production

# Watch rollout progress
kubectl argo rollouts get rollout vibecoded-api -n production --watch

# If you need to manually promote at any step:
# kubectl argo rollouts promote vibecoded-api -n production

# If you need to abort (automatic rollback):
# kubectl argo rollouts abort vibecoded-api -n production
```

**Canary Monitoring Dashboard (Example Prometheus Queries):**

```yaml
# monitoring/canary-dashboard.yaml
# Grafana dashboard for canary monitoring

apiVersion: v1
kind: ConfigMap
metadata:
  name: canary-dashboard
  namespace: monitoring
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "Canary Deployment Monitoring",
        "panels": [
          {
            "title": "Traffic Split",
            "targets": [{
              "expr": "sum(rate(http_requests_total{namespace='production',app='vibecoded-api'}[1m])) by (version)"
            }]
          },
          {
            "title": "Success Rate by Version",
            "targets": [{
              "expr": "sum(rate(http_requests_total{namespace='production',app='vibecoded-api',status!~'5..'}[5m])) by (version) / sum(rate(http_requests_total{namespace='production',app='vibecoded-api'}[5m])) by (version)"
            }]
          },
          {
            "title": "P95 Latency by Version",
            "targets": [{
              "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{namespace='production',app='vibecoded-api'}[5m])) by (le, version))"
            }]
          },
          {
            "title": "Error Rate by Version",
            "targets": [{
              "expr": "sum(rate(http_requests_total{namespace='production',app='vibecoded-api',status=~'5..'}[5m])) by (version)"
            }]
          }
        ]
      }
    }
```

#### Why This Matters

**Business Rationale:**

1. **User Experience:** Zero-downtime deployments mean users never see errors during releases. Companies with poor deployment practices average 2–5 minutes of downtime per deployment. At 10 deployments/day × 2 minutes = 20 minutes/day = 121 hours/year of downtime. That's 5 days/year your service is down due to deployments alone.

2. **Release Velocity:** Fast, safe deployments enable rapid iteration:
   - **Rolling updates:** Deploy in 2–3 minutes, rollback in 30 seconds
   - **Blue-green:** Deploy in 5–10 minutes, rollback instantly (1 second)
   - **Canary:** Deploy in 30–60 minutes (gradual), automatic rollback on metrics degradation
   
   Compare to manual deployments (SSH to servers, run scripts): 30–60 minutes per deployment, 10–30 minute manual rollback.

3. **Risk Reduction:** Canary deployments catch issues before they affect all users:
   - Bug affects 10% of traffic (canary) → Detected in 5 minutes → Automatic rollback
   - Without canary → Bug affects 100% of traffic → Support tickets flood in → Manual investigation → 30-minute rollback → All users impacted

4. **Audit & Compliance:** Deployment history is immutable and auditable:
   ```bash
   kubectl rollout history deployment/vibecoded-api -n production
   # Shows who deployed what, when, and allows instant rollback to any version
   ```
   SOC 2 requires change management processes. Kubernetes Deployment history provides audit trail automatically.

**Technical Rationale:**

1. **Self-Healing During Rollout:** If a pod crashes during rolling update, Kubernetes:
   - Marks pod as unhealthy (readiness probe fails)
   - Removes from load balancer (no traffic routed)
   - Creates replacement pod
   - Continues rollout once replacement is ready
   
   Without health checks: Crashed pod receives traffic → users get 502 errors → manual intervention required.

2. **Automatic Rollback:** Argo Rollouts monitors Prometheus metrics during canary:
   ```
   If error_rate > 5% for 3 consecutive checks:
     - Pause canary
     - Rollback to stable version
     - Alert on-call engineer
   ```
   Without automation: On-call engineer notices issue → manually triggers rollback → 10–30 minutes to rollback.

3. **Declarative State:** You declare desired state (YAML), Kubernetes figures out how to get there:
   ```yaml
   replicas: 5
   image: v1.2.4
   ```
   Kubernetes calculates:
   - Current state: 5 pods running v1.2.3
   - Desired state: 5 pods running v1.2.4
   - Actions: Create 2 v1.2.4 pods → verify healthy → delete 2 v1.2.3 pods → repeat

4. **Traffic Shifting:** Different strategies use different mechanisms:
   - **Rolling:** Service selector matches both old and new pods, Kubernetes load balances randomly
   - **Blue-green:** Service selector switched via label (instant cutover)
   - **Canary:** Ingress/Service Mesh routes X% to canary, (100-X)% to stable

#### What Happens If You Don't

**If you use Recreate strategy (stop all old, start all new):**

1. **Guaranteed Downtime:** All old pods terminate before new pods start. If you have 5 pods:
   - Old pods: 5 → 0 (10 seconds to terminate)
   - New pods: 0 → 5 (60 seconds to start + become ready)
   - **Total downtime: 70 seconds**
   
   At 10 deployments/day: 700 seconds/day = 11.7 minutes/day = 71 hours/year of downtime.

2. **All-or-Nothing Risk:** If new version has a bug, 100% of traffic hits broken version immediately. No gradual rollout, no canary testing, no early warning.

**If you don't configure health checks:**

1. **Traffic to Unready Pods:** Kubernetes routes traffic before app is ready:
   - Pod starts → Kubernetes adds to Service → Traffic routed → App still loading → Users get errors
   - Real example: Node.js app takes 30 seconds to load (database connection pool, cache warmup). Without readiness probe, first 30 seconds of traffic fails.

2. **Cascading Failures:** One unhealthy pod receives traffic → times out → retries hit same pod → timeouts accumulate → circuit breaker triggers → entire service appears down.

**If you skip graceful shutdown:**

1. **Dropped Requests:** During rollout:
   - Kubernetes sends SIGTERM to old pod
   - Pod exits immediately (no graceful shutdown)
   - In-flight requests are aborted mid-processing
   - Database transactions left open
   - Users get 502 errors
   
   At 1,000 requests/second × 5 pods × 2-second avg request time = 10,000 in-flight requests during rollout. Without graceful shutdown, all 10,000 fail.

2. **Data Corruption:** Database connection closed mid-transaction:
   ```sql
   BEGIN;
   UPDATE accounts SET balance = balance - 100 WHERE id = 'user-123';
   -- SIGKILL here --
   -- ROLLBACK never executed, transaction orphaned
   ```

**If you don't have rollback automation:**

1. **Mean Time to Recovery (MTTR):** Manual rollback steps:
   - Engineer notices issue (Slack alert, PagerDuty) → 2–5 minutes
   - Engineer determines rollback needed → 2–5 minutes
   - Engineer finds previous version tag → 1–2 minutes
   - Engineer runs kubectl rollout undo → 2–3 minutes
   - **Total MTTR: 7–15 minutes**
   
   Automated rollback (Argo Rollouts):
   - Metrics exceed threshold → 1 minute
   - Automatic rollback triggered → 30 seconds
   - **Total MTTR: 1.5 minutes**

2. **Human Error:** Manual rollback to wrong version:
   - Engineer under pressure → selects wrong revision number → rollback to version with different bug → second rollback required → 20+ minute incident

**If you don't monitor metrics during canary:**

1. **Slow Issue Detection:** Canary deployed to 10% of traffic, issue affects 10% of users:
   - Without metrics: Issue reported by users → support tickets come in → engineering investigates → 30–60 minutes to detect
   - With metrics: Error rate spike detected in 1–2 minutes → automatic rollback

2. **Blast Radius:** Without canary, issue deployed to 100% of traffic immediately. With canary, issue limited to 10% while detected and rolled back.

#### Resources Required

**Skills:**
- **Kubernetes Deployments:** Understanding replicas, selectors, rolling updates (2 days practice)
- **Health Checks:** Implementing liveness/readiness/startup probes correctly (4 hours)
- **Monitoring:** Basic Prometheus query language (PromQL) for canary metrics (1 day)
- **Argo Rollouts:** Advanced canary deployments (2 days if using canary strategy)

**Tools:**
- **kubectl:** Kubernetes CLI (included with cluster setup)
- **Argo Rollouts:** For advanced canary deployments (optional, free)
  - Install: `kubectl create namespace argo-rollouts && kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml`
- **Prometheus:** Metrics for canary analysis (covered in Chapter 7 Observability)
- **Grafana:** Canary dashboards (optional, free)

**Time Investment:**
- **Rolling update setup:** 4 hours (health checks, graceful shutdown, service config)
- **Blue-green setup:** 2 hours (two deployments, service switching script)
- **Canary setup with Argo:** 8 hours (install Argo, configure AnalysisTemplates, test)
- **Testing & verification:** 4 hours (deploy, rollback, verify monitoring)
- **Total:** 2–3 days for all three strategies

**Ongoing:**
- Deploy 5–20× per day (rolling updates), fully automated
- Blue-green for major releases: 1× per month
- Canary for experimental features: 2–4× per month
- Rollback when needed: <5 minutes automated

#### Verification Checklist

Before using in production:

**Rolling Updates:**
- [ ] **Health checks implemented** (startup, liveness, readiness endpoints)
- [ ] **Graceful shutdown configured** (preStop hook, SIGTERM handler, terminationGracePeriodSeconds)
- [ ] **maxUnavailable: 0** (zero-downtime guarantee)
- [ ] **minReadySeconds configured** (prevents rapid rollout of broken versions)
- [ ] **Rolling update tested** (deploy new version, verify zero dropped requests)
- [ ] **Rollback tested** (`kubectl rollout undo`, verify it works)
- [ ] **Rollout history preserved** (revisionHistoryLimit ≥ 10)

**Blue-Green:**
- [ ] **Both deployments functional** (blue and green can run simultaneously)
- [ ] **Service selector switching works** (traffic instantly moves to green)
- [ ] **Smoke tests automated** (test green before switching traffic)
- [ ] **Instant rollback tested** (switch service back to blue in <10 seconds)
- [ ] **Resource capacity verified** (cluster can run both blue and green simultaneously)

**Canary:**
- [ ] **Argo Rollouts installed** (if using canary)
- [ ] **AnalysisTemplates configured** (success rate, latency metrics)
- [ ] **Prometheus integration working** (metrics queries return data)
- [ ] **Traffic splitting functional** (can route X% to canary)
- [ ] **Automatic rollback tested** (trigger metric failure, verify auto-rollback)
- [ ] **Manual promote tested** (`kubectl argo rollouts promote`)
- [ ] **Monitoring dashboard created** (visualize canary progress)

**Testing Procedures:**

```bash
# Test 1: Zero-downtime rolling update
# Terminal 1: Continuous traffic
while true; do
  curl -s http://api.vibecoded.com/health || echo "FAILED"
  sleep 0.1
done

# Terminal 2: Deploy new version
kubectl set image deployment/vibecoded-api api=new-image -n production
kubectl rollout status deployment/vibecoded-api -n production

# Expected: Zero "FAILED" messages during rollout

# Test 2: Rollback speed
# Start timer
time kubectl rollout undo deployment/vibecoded-api -n production
# Expected: Complete in <60 seconds

# Test 3: Health check failure handling
# Deploy version with broken health check
kubectl set image deployment/vibecoded-api api=broken-image -n production

# Watch rollout
kubectl rollout status deployment/vibecoded-api -n production
# Expected: Rollout fails, old pods remain running (progressDeadlineSeconds)

# Test 4: Graceful shutdown
# Terminal 1: Long-running request (60 seconds)
curl http://api.vibecoded.com/slow-endpoint

# Terminal 2: Delete pod during request
kubectl delete pod <pod-name> -n production

# Expected: Request completes successfully (preStop hook + terminationGracePeriodSeconds)

# Test 5: Pod crash handling during rollout
# Deploy new version, then crash a pod
kubectl set image deployment/vibecoded-api api=new-image -n production
sleep 10
kubectl exec -it <new-pod> -n production -- kill 1

# Expected: Kubernetes restarts pod, continues rollout
```

#### Emerging Alternatives to Watch

**Progressive Delivery Platforms (Flagger, Argo Rollouts mature features):**

The deployment strategy landscape is evolving toward "progressive delivery" — automated, metrics-driven rollouts with multiple strategies (canary, A/B, blue-green) orchestrated by a single platform.

**Flagger (Flux ecosystem):**
- GitOps-native canary deployments
- Integrates with Istio, Linkerd, App Mesh, NGINX for traffic shifting
- Automated rollback based on Prometheus/Datadog/New Relic metrics
- Webhook notifications (Slack, Teams, PagerDuty)

```yaml
# Example Flagger canary
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: vibecoded-api
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vibecoded-api
  progressDeadlineSeconds: 60
  service:
    port: 80
  analysis:
    interval: 1m
    threshold: 10
    iterations: 5
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: 500
      interval: 1m
  canaryAnalysis:
    stepWeight: 10
    maxWeight: 50
```

**When to consider:**
- You're using service mesh (Istio/Linkerd) for advanced traffic management
- You want A/B testing (route specific user segments to canary)
- You need multi-cluster deployments
- You're already using GitOps (Flux/ArgoCD)

**Track:** Flagger v1.x stabilization, integration with OpenTelemetry for metrics.

**Lambda-style Instant Rollback (AWS Lambda Versions, Google Cloud Run Revisions):**

Serverless platforms like AWS Lambda and Google Cloud Run have instant version switching built-in:
- Deploy new version → it gets a new immutable identifier
- Traffic routing is instantaneous (no pod scheduling, just pointer update)
- Rollback is instantaneous (change pointer back)
- No resource overhead (don't run two versions simultaneously like blue-green)

**Vibecoded application:**
- Consider serverless (Cloud Run, Lambda) for user app runtime (not core API)
- User's app deployed to Cloud Run → instant version switching → instant rollback
- Core API stays on Kubernetes (need persistent connections, complex networking)

**Track:** Cloud Run v2 features, Lambda container image support maturity.

**Feature Flags for Gradual Rollout (LaunchDarkly, Split, Unleash):**

Decouple deployment from release:
- Deploy new code to 100% of pods (disabled via feature flag)
- Gradually enable feature flag for 10% → 25% → 50% → 100% of users
- If issues, disable flag instantly (no redeployment needed)
- Allows A/B testing (show feature to specific user segments)

```typescript
// Example: LaunchDarkly feature flag in code
import LaunchDarkly from 'launchdarkly-node-server-sdk';

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);

app.get('/api/new-feature', async (req, res) => {
  const user = {
    key: req.user.id,
    email: req.user.email,
    custom: {
      tenant: req.user.tenantId,
      plan: req.user.planTier
    }
  };
  
  // Check if new feature is enabled for this user
  const newFeatureEnabled = await ldClient.variation('new-feature-flag', user, false);
  
  if (newFeatureEnabled) {
    // Use new implementation
    return res.json(newImplementation());
  } else {
    // Use old implementation
    return res.json(oldImplementation());
  }
});
```

**When to consider:**
- You want to decouple deployment from feature release
- You need user segmentation (premium users get feature first)
- You want instant kill switch (disable feature without redeployment)
- You need A/B testing with metrics

**Track:** Open-source alternatives (Unleash, Flagsmith), cost vs build-your-own.

---

### 2.4 Auto-Scaling for Dynamic Resource Management

**Duration:** 2 days | **Priority:** High | **Prerequisites:** 2.3 Deployment strategies working

#### Overview

Auto-scaling automatically adjusts the number of pod replicas or node capacity based on demand. Think of it like a thermostat for your infrastructure: when load increases (more traffic, higher CPU), scaling adds resources; when load decreases, scaling removes resources to save cost. Without auto-scaling, you either:
- **Over-provision** (run 50 pods 24/7 to handle peak) → waste money during low traffic
- **Under-provision** (run 5 pods to save cost) → service crashes during traffic spikes

**Three Types of Auto-Scaling:**

1. **Horizontal Pod Autoscaler (HPA):** Scales number of pod replicas (3 pods → 10 pods)
2. **Vertical Pod Autoscaler (VPA):** Scales pod resource requests (500m CPU → 1000m CPU)
3. **Cluster Autoscaler:** Scales number of nodes in cluster (3 nodes → 10 nodes)

**For Vibecoded:**
- **HPA** for API services (traffic varies by time of day, viral apps)
- **Cluster Autoscaler** to add nodes when pods can't schedule
- **VPA** for workloads with unpredictable resource needs (user app execution)

**The Auto-Scaling Challenge:**
Scaling too fast = wasted resources and cost. Scaling too slow = degraded performance and lost users. The goal is responsive scaling with stable behavior (no flapping: scale up → scale down → scale up repeatedly).

This section gives you production-tuned auto-scaling with:
- Metric-based scaling (CPU, memory, custom metrics)
- Stable behavior (prevent flapping)
- Cost-aware limits (never scale beyond budget)
- Integration with deployment strategies (scaling during rollouts)

#### How to Implement

**Step 1: Horizontal Pod Autoscaler (HPA) - Scale Pod Replicas**

HPA watches metrics (CPU, memory, custom) and adjusts replica count automatically.

```yaml
# kubernetes/hpa/api-hpa.yaml
# Horizontal Pod Autoscaler for API deployment

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vibecoded-api-hpa
  namespace: production
spec:
  # Target deployment
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vibecoded-api
  
  # Replica limits
  minReplicas: 3  # Never scale below 3 (for HA across 3 AZs)
  maxReplicas: 50  # Never scale above 50 (cost limit + cluster capacity)
  
  # Scaling metrics
  metrics:
  
  # Metric 1: CPU utilization
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Target 70% CPU utilization
        # Why 70% not 100%: Leave headroom for traffic spikes
        # If target is 100%, any spike causes immediate overload
  
  # Metric 2: Memory utilization
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80  # Target 80% memory utilization
        # Why 80% not 100%: Memory is less elastic than CPU
        # At 100%, pods risk OOM kills
  
  # Metric 3: Custom metric - request rate
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"  # 1,000 requests/second per pod
        # Why: CPU/memory don't always correlate with load
        # A GET /health request uses less CPU than POST /api/apps
  
  # Metric 4: Custom metric - queue depth
  - type: Object
    object:
      metric:
        name: queue_depth
      describedObject:
        apiVersion: v1
        kind: Service
        name: vibecoded-queue
      target:
        type: Value
        value: "100"  # Scale when queue >100 messages per pod
        # Why: Proactive scaling before users feel latency
        # If queue depth rising, scale before it becomes backlog
  
  # Scaling behavior (prevent flapping)
  behavior:
    scaleDown:
      # How fast to scale down
      stabilizationWindowSeconds: 300  # 5 minutes
      # Why: Prevent flapping during temporary traffic dips
      # Without this: Traffic drops 10% for 1 minute → scale down → traffic returns → scale up → repeat
      
      policies:
      # Policy 1: Conservative scale-down
      - type: Percent
        value: 10  # Remove max 10% of pods at once
        periodSeconds: 60  # Every minute
      
      # Policy 2: Absolute scale-down limit
      - type: Pods
        value: 2  # Remove max 2 pods at once
        periodSeconds: 60
      
      selectPolicy: Min  # Use whichever policy is MORE conservative
      # Why: Scaling down too fast can cause overload if traffic returns
    
    scaleUp:
      # How fast to scale up
      stabilizationWindowSeconds: 60  # 1 minute
      # Why: React quickly to traffic increases (user experience)
      # But not instantly (prevent scaling on single spike)
      
      policies:
      # Policy 1: Aggressive scale-up
      - type: Percent
        value: 50  # Add up to 50% more pods at once
        periodSeconds: 60
      
      # Policy 2: Absolute scale-up limit
      - type: Pods
        value: 5  # Add max 5 pods at once
        periodSeconds: 60
      
      selectPolicy: Max  # Use whichever policy is MORE aggressive
      # Why: Better to over-provision temporarily than drop requests
```

**Custom Metrics for HPA (Prometheus Adapter):**

HPA can scale based on any Prometheus metric. Install Prometheus Adapter to expose metrics to HPA:

```bash
# Install Prometheus Adapter
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus-adapter prometheus-community/prometheus-adapter \
  --namespace monitoring \
  --set prometheus.url=http://prometheus.monitoring:9090
```

```yaml
# kubernetes/hpa/prometheus-adapter-config.yaml
# Configure Prometheus Adapter to expose custom metrics

apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitoring
data:
  config.yaml: |
    rules:
    # Rule 1: HTTP requests per second
    - seriesQuery: 'http_requests_total{namespace="production",app="vibecoded-api"}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        matches: "^http_requests_total"
        as: "http_requests_per_second"
      metricsQuery: 'sum(rate(http_requests_total{<<.LabelMatchers>>}[2m])) by (<<.GroupBy>>)'
    
    # Rule 2: Queue depth
    - seriesQuery: 'queue_depth{namespace="production"}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          service: {resource: "service"}
      name:
        as: "queue_depth"
      metricsQuery: 'sum(queue_depth{<<.LabelMatchers>>}) by (<<.GroupBy>>)'
    
    # Rule 3: Database connection pool usage
    - seriesQuery: 'db_pool_active_connections{namespace="production",app="vibecoded-api"}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        as: "db_pool_utilization_percent"
      metricsQuery: '(sum(db_pool_active_connections{<<.LabelMatchers>>}) by (<<.GroupBy>>) / sum(db_pool_max_connections{<<.LabelMatchers>>}) by (<<.GroupBy>>)) * 100'
```

**Verify HPA is Working:**

```bash
# Check HPA status
kubectl get hpa -n production

# Output:
# NAME                  REFERENCE                 TARGETS                      MINPODS   MAXPODS   REPLICAS
# vibecoded-api-hpa     Deployment/vibecoded-api  65%/70%, 72%/80%, 800/1000  3         50        5

# Describe HPA for detailed metrics
kubectl describe hpa vibecoded-api-hpa -n production

# Watch HPA in real-time
watch kubectl get hpa -n production

# Test scale-up: Generate load
kubectl run -it --rm load-generator \
  --image=busybox \
  --restart=Never \
  -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://vibecoded-api; done"

# Watch pods scale up
kubectl get pods -n production -l app=vibecoded-api -w
```

**Step 2: Vertical Pod Autoscaler (VPA) - Scale Pod Resources**

VPA adjusts pod CPU/memory requests automatically based on usage. Use for workloads where replica scaling doesn't help (single-pod services, stateful workloads).

**⚠️ VPA conflicts with HPA on CPU/memory metrics. Use VPA in "recommendation" mode with HPA, or use VPA only for non-HPA workloads.**

```bash
# Install VPA
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-up.sh
```

```yaml
# kubernetes/vpa/worker-vpa.yaml
# VPA for background worker (single replica, unpredictable resource needs)

apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: vibecoded-worker-vpa
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vibecoded-worker
  
  # Update policy
  updatePolicy:
    updateMode: "Auto"  # Options: Off, Initial, Recreate, Auto
    # Off: Only provide recommendations (no changes)
    # Initial: Set requests on pod creation only
    # Recreate: Update by deleting and recreating pods
    # Auto: Update in-place if possible (requires VPA admission controller)
  
  # Resource policy (constraints)
  resourcePolicy:
    containerPolicies:
    - containerName: worker
      
      # Minimum requests (never go below)
      minAllowed:
        cpu: 100m
        memory: 128Mi
      
      # Maximum requests (never exceed)
      maxAllowed:
        cpu: 4000m  # 4 cores
        memory: 8Gi
      
      # Controlled resources
      controlledResources:
      - cpu
      - memory
      
      # Mode per resource
      mode: Auto
```

**VPA Recommendation Mode (Safe with HPA):**

```yaml
# kubernetes/vpa/api-vpa-recommender.yaml
# VPA in recommendation mode (doesn't modify pods, just suggests)

apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: vibecoded-api-vpa-recommender
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vibecoded-api
  
  # Recommendation mode (doesn't modify pods)
  updatePolicy:
    updateMode: "Off"
  
  resourcePolicy:
    containerPolicies:
    - containerName: api
      minAllowed:
        cpu: 250m
        memory: 512Mi
      maxAllowed:
        cpu: 2000m
        memory: 4Gi

---
# View VPA recommendations
# kubectl describe vpa vibecoded-api-vpa-recommender -n production
#
# Output shows:
# Recommendation:
#   Container Recommendations:
#     Container Name: api
#     Lower Bound:
#       Cpu: 500m
#       Memory: 1Gi
#     Target:
#       Cpu: 750m    # <-- Update your deployment to this
#       Memory: 1.5Gi
#     Uncapped Target:
#       Cpu: 900m
#       Memory: 1.8Gi
#     Upper Bound:
#       Cpu: 2000m
#       Memory: 4Gi
```

**Step 3: Cluster Autoscaler - Scale Number of Nodes**

Cluster Autoscaler adds nodes when pods can't schedule (insufficient resources) and removes nodes when underutilized.

We already installed Cluster Autoscaler in section 2.2. Here's how to tune it:

```yaml
# kubernetes/cluster-autoscaler/configmap.yaml
# Cluster Autoscaler tuning

apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-config
  namespace: kube-system
data:
  # Scale-down behavior
  scale-down-enabled: "true"
  scale-down-delay-after-add: "10m"  # Wait 10min after scale-up before scale-down
  scale-down-delay-after-failure: "3m"
  scale-down-unneeded-time: "10m"  # Node must be underutilized for 10min before removal
  scale-down-utilization-threshold: "0.5"  # Remove node if <50% utilized
  
  # Scale-up behavior
  max-node-provision-time: "15m"  # Fail if node takes >15min to provision
  
  # Node group limits (per node group)
  # Set in Terraform/CloudFormation, not here
```

**Node Group Configuration (Terraform):**

```hcl
# terraform/modules/eks/node-groups.tf
# Configure node groups with proper auto-scaling tags

resource "aws_eks_node_group" "general" {
  # ... basic config ...
  
  scaling_config {
    min_size     = 3   # Minimum nodes (one per AZ for HA)
    max_size     = 10  # Maximum nodes (cost limit)
    desired_size = 3   # Initial size
  }
  
  # Tags for Cluster Autoscaler discovery
  tags = {
    "k8s.io/cluster-autoscaler/enabled" = "true"
    "k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
    
    # Cluster Autoscaler priority (lower = remove first during scale-down)
    "k8s.io/cluster-autoscaler/priority" = "10"
  }
}

resource "aws_eks_node_group" "compute_spot" {
  # ... basic config ...
  
  capacity_type = "SPOT"  # Use spot instances (70% cheaper)
  
  scaling_config {
    min_size     = 0   # Scale to zero when not needed
    max_size     = 20
    desired_size = 0
  }
  
  # Taint so only user workloads schedule here
  taint {
    key    = "workload"
    value  = "user-apps"
    effect = "NO_SCHEDULE"
  }
  
  tags = {
    "k8s.io/cluster-autoscaler/enabled" = "true"
    "k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
    "k8s.io/cluster-autoscaler/priority" = "5"  # Lower priority = scale down first
  }
}
```

**Pod Priority Classes (Control What Scales First):**

```yaml
# kubernetes/priority-classes.yaml
# Define pod priorities for scheduling and eviction

apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical-system
value: 1000000  # Highest priority
globalDefault: false
description: "Critical system components (never evict)"

---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: production-high
value: 10000
globalDefault: false
description: "Production services (high priority)"

---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: production-normal
value: 1000
globalDefault: true  # Default for pods without explicit priority
description: "Production services (normal priority)"

---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: batch-jobs
value: 100
globalDefault: false
description: "Batch jobs (low priority, can be evicted)"

---
# Use in deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibecoded-api
spec:
  template:
    spec:
      priorityClassName: production-high  # <-- Set priority
      containers:
      - name: api
        # ...
```

**How Cluster Autoscaler Uses Priority:**

1. **Scale-up:** When pods are unschedulable (no node has capacity):
   - Cluster Autoscaler simulates adding nodes
   - Prioritizes scheduling high-priority pods
   - Adds enough nodes to schedule all high-priority pods
   - Low-priority pods may remain pending

2. **Scale-down:** When nodes are underutilized:
   - Cluster Autoscaler identifies nodes to remove
   - Checks if pods on node can be rescheduled elsewhere
   - **Never evicts high-priority pods unless necessary**
   - Prefers evicting low-priority pods (batch jobs)

**Step 4: Pod Disruption Budgets (Prevent Scaling from Breaking Service)**

PodDisruptionBudgets (PDB) ensure minimum availability during voluntary disruptions (node drain, cluster autoscaler scale-down, etc.).

```yaml
# kubernetes/pdb/api-pdb.yaml
# Pod Disruption Budget for API deployment

apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: vibecoded-api-pdb
  namespace: production
spec:
  # Minimum available pods during disruption
  minAvailable: 3
  # Alternative: maxUnavailable: 1 (max 1 pod down at a time)
  
  selector:
    matchLabels:
      app: vibecoded-api
  
  # Why: Prevents Cluster Autoscaler from draining nodes if it would
  # violate minAvailable. If you have 5 pods across 3 nodes, and
  # Cluster Autoscaler wants to remove a node with 2 pods, it will
  # check if moving those 2 pods leaves ≥3 available. If not, scale-down
  # is blocked until more nodes are available.
```

**PDB Best Practices:**

```yaml
# For HA services (require multiple replicas)
minAvailable: 2  # or N-1 where N is number of AZs

# For services that can tolerate brief unavailability
maxUnavailable: 1

# For single-replica services (stateful, can't scale)
minAvailable: 1  # Blocks all voluntary disruptions
# Warning: This prevents node upgrades. Use only for truly critical, non-scalable services.

# For batch jobs (can be interrupted)
maxUnavailable: 100%  # Allow draining all pods
```

**Step 5: Monitoring Auto-Scaling Decisions**

```yaml
# monitoring/auto-scaling-dashboard.yaml
# Grafana dashboard for auto-scaling monitoring

apiVersion: v1
kind: ConfigMap
metadata:
  name: autoscaling-dashboard
  namespace: monitoring
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "Auto-Scaling Monitoring",
        "panels": [
          {
            "title": "HPA Current Replicas",
            "targets": [{
              "expr": "kube_horizontalpodautoscaler_status_current_replicas{namespace='production'}"
            }]
          },
          {
            "title": "HPA Desired Replicas",
            "targets": [{
              "expr": "kube_horizontalpodautoscaler_status_desired_replicas{namespace='production'}"
            }]
          },
          {
            "title": "HPA CPU Target vs Actual",
            "targets": [
              {"expr": "kube_horizontalpodautoscaler_spec_target_metric{metric_name='cpu'}", "legendFormat": "Target"},
              {"expr": "kube_horizontalpodautoscaler_status_current_metric{metric_name='cpu'}", "legendFormat": "Current"}
            ]
          },
          {
            "title": "Cluster Autoscaler Activity",
            "targets": [{
              "expr": "sum(rate(cluster_autoscaler_scaled_up_nodes_total[5m]))"
            }]
          },
          {
            "title": "Pending Pods (Unschedulable)",
            "targets": [{
              "expr": "sum(kube_pod_status_phase{phase='Pending'})"
            }]
          },
          {
            "title": "Node CPU Utilization",
            "targets": [{
              "expr": "(1 - avg(rate(node_cpu_seconds_total{mode='idle'}[5m]))) * 100"
            }]
          },
          {
            "title": "Node Memory Utilization",
            "targets": [{
              "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
            }]
          }
        ]
      }
    }
```

**Alerting Rules for Auto-Scaling Issues:**

```yaml
# monitoring/autoscaling-alerts.yaml
# Prometheus alerting rules for auto-scaling

apiVersion: v1
kind: ConfigMap
metadata:
  name: autoscaling-alerts
  namespace: monitoring
data:
  alerts.yaml: |
    groups:
    - name: autoscaling
      interval: 1m
      rules:
      
      # Alert: HPA at maximum replicas
      - alert: HPAMaxedOut
        expr: |
          kube_horizontalpodautoscaler_status_current_replicas
          >=
          kube_horizontalpodautoscaler_spec_max_replicas
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "HPA {{ $labels.horizontalpodautoscaler }} at maximum replicas"
          description: "HPA has been at max replicas for 5 minutes. Consider increasing maxReplicas."
      
      # Alert: Cluster Autoscaler at maximum nodes
      - alert: ClusterAutoscalerMaxedOut
        expr: |
          sum(kube_node_info) >= 10  # Adjust to your max nodes
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Cluster at maximum node count"
          description: "Cluster has reached max nodes. Pods may be pending."
      
      # Alert: Pods pending for too long
      - alert: PodsPendingTooLong
        expr: |
          sum(kube_pod_status_phase{phase="Pending"}) > 0
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Pods have been pending for 10+ minutes"
          description: "Check Cluster Autoscaler logs and node capacity."
      
      # Alert: HPA flapping (scaling up/down repeatedly)
      - alert: HPAFlapping
        expr: |
          abs(delta(kube_horizontalpodautoscaler_status_desired_replicas[10m])) > 5
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "HPA {{ $labels.horizontalpodautoscaler }} is flapping"
          description: "Desired replicas changed by >5 in last 10 minutes repeatedly. Check HPA behavior config."
      
      # Alert: Node NotReady
      - alert: NodeNotReady
        expr: |
          kube_node_status_condition{condition="Ready",status="true"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.node }} is NotReady"
          description: "Node has been NotReady for 5+ minutes. Check node health."
```

#### Why This Matters

**Business Rationale:**

1. **Cost Optimization:** Auto-scaling saves 40–70% on compute costs:
   - **Static provisioning:** Run 50 pods 24/7 to handle peak (2pm) = 50 × 24 × $0.05/hour = $60/day
   - **Auto-scaling:** Average 10 pods (3 at night, 50 at peak) = 10 × 24 × $0.05/hour = $12/day
   - **Savings:** $48/day × 30 days = $1,440/month = $17,280/year per service

   Industry data: Companies report 50–65% cost reduction after implementing proper auto-scaling (AWS case studies, Google Cloud efficiency reports).

2. **User Experience:** Auto-scaling prevents degraded performance during traffic spikes:
   - Without auto-scaling: Viral app launches → 10× traffic → fixed 5 pods → each pod overloaded → response time 10× slower → users abandon
   - With auto-scaling: Traffic spike detected → HPA scales to 50 pods in 2 minutes → response time remains <500ms

3. **Resource Efficiency:** Right-sizing via VPA prevents waste:
   - Developer guesses: "Let's request 1GB RAM to be safe" → actual usage 200MB → 800MB wasted per pod × 10 pods = 8GB wasted
   - VPA recommendation: 300MB request (with 50MB buffer) → 700MB saved per pod × 10 pods = 7GB saved
   - At $0.01/GB/hour: 7GB × 24h × 30d × $0.01 = $50/month saved per service

4. **Operational Simplicity:** Set policies once, auto-scaling runs forever:
   - No manual capacity planning: "Will Black Friday traffic be 2× or 5× normal?" → Don't need to know, HPA handles it
   - No manual intervention: 3am traffic spike → HPA scales up automatically → on-call engineer sleeps through it

**Technical Rationale:**

1. **Reactive Scaling Logic:** HPA uses simple proportional scaling algorithm:
   ```
   desiredReplicas = currentReplicas × (currentMetric / targetMetric)
   
   Example:
   - Current: 5 replicas, CPU at 90%
   - Target: 70% CPU
   - desiredReplicas = 5 × (90 / 70) = 6.4 → round up to 7
   ```
   This formula is stable (converges to target quickly without oscillation).

2. **Stabilization Windows Prevent Flapping:** Without stabilization:
   ```
   Traffic spike → Scale from 5 to 10 pods → Pods start → Load distributes → CPU drops below target → Scale down to 6 → Load concentrates → CPU spikes → Scale up to 9 → repeat
   ```
   With stabilization (5-minute window):
   ```
   Traffic spike → Scale from 5 to 10 pods → Wait 5 minutes before considering scale-down → Traffic settles at 10 pods → Stable
   ```

3. **Cluster Autoscaler Node Simulation:** Before adding nodes, Cluster Autoscaler:
   - Simulates scheduling pending pods onto hypothetical new nodes
   - Chooses node type that best fits pending pods (minimize waste)
   - Adds only enough nodes to schedule all pending pods
   - This prevents over-provisioning (adding 10 nodes when 2 would suffice)

4. **Pod Disruption Budgets as Safety Net:** During scale-down:
   ```
   Cluster Autoscaler: "Can I remove node-3?"
   Check 1: Are there pods on node-3? Yes (3 pods)
   Check 2: Can those 3 pods reschedule to other nodes? Yes
   Check 3: Will moving those 3 pods violate any PDBs? Let's check...
     - vibecoded-api PDB: minAvailable=3, current=5, after move=5 ✓
     - vibecoded-db PDB: minAvailable=1, current=1, after move=0 ✗
   Decision: Cannot remove node-3 (would violate DB PDB)
   ```

#### What Happens If You Don't

**If you don't use HPA (fixed replica count):**

1. **Cost Waste:** Traffic patterns vary 10× between peak and off-peak:
   - Fixed at peak capacity: 50 pods × 24 hours/day × 30 days = 36,000 pod-hours/month
   - With HPA: Average 15 pods × 24 hours/day × 30 days = 10,800 pod-hours/month
   - **Waste: 25,200 pod-hours/month** = 70% over-provisioning

2. **Performance Degradation:** Traffic exceeds fixed capacity:
   - Fixed 5 pods, each can handle 1,000 req/sec = 5,000 req/sec total
   - Viral app launches, traffic goes to 15,000 req/sec
   - Without HPA: 5 pods try to handle 15,000 req/sec = 3,000 req/sec per pod = extreme overload = timeouts, errors, crashes
   - With HPA: Scales to 15 pods in 2 minutes = traffic handled smoothly

**If you don't use Cluster Autoscaler:**

1. **Pods Stuck Pending:** Nodes at capacity, new pods can't schedule:
   - HPA scales from 10 to 20 pods
   - Nodes only have capacity for 12 pods
   - 8 pods remain in "Pending" state indefinitely
   - Users experience degraded service (only 12 pods handling load meant for 20)

2. **Manual Intervention Required:** On-call engineer gets paged:
   - 2am alert: "Pods pending for 10 minutes"
   - Engineer logs in, checks node capacity, manually adds nodes via AWS console
   - Nodes provision (5 minutes), pods schedule, issue resolved
   - Total time: 20–30 minutes of degraded service
   - With Cluster Autoscaler: Automatic in 5 minutes, no engineer intervention

**If you don't use VPA (or set resource requests incorrectly):**

1. **Under-Provisioned Requests:** Developer sets `requests: {cpu: 100m, memory: 128Mi}` but actual usage is `{cpu: 500m, memory: 1Gi}`:
   - Kubernetes thinks pod uses 100m CPU, schedules 10 pods per node
   - Reality: Each pod uses 500m CPU = 5 pods worth = node overloaded
   - Consequence: CPU throttling (pods get less CPU than needed), OOM kills (pods evicted due to memory pressure)

2. **Over-Provisioned Requests:** Developer sets `requests: {cpu: 2000m, memory: 4Gi}` but actual usage is `{cpu: 200m, memory: 512Mi}`:
   - Kubernetes reserves 2 cores and 4GB per pod
   - Only 2-3 pods fit per node (despite having capacity for 20)
   - Cluster Autoscaler adds nodes unnecessarily
   - Cost: 10× higher than necessary

**If you don't configure HPA behavior (stabilization, policies):**

1. **Flapping:** Traffic oscillates slightly (normal), HPA reacts to every fluctuation:
   ```
   10:00 - 5 pods, CPU 72% → Scale to 6 pods
   10:01 - 6 pods, CPU 65% → Scale to 5 pods
   10:02 - 5 pods, CPU 71% → Scale to 6 pods
   10:03 - 6 pods, CPU 66% → Scale to 5 pods
   ... repeat forever
   ```
   Consequence: Pods constantly starting/stopping, wasted CPU on pod churn, unstable performance.

2. **Scaling Too Fast Down:** Traffic drops briefly (1 minute lull), HPA scales down immediately:
   ```
   10:00 - 10 pods handling 10,000 req/sec
   10:01 - Traffic drops to 5,000 req/sec (someone ran a big query, temporary drop)
   10:01 - HPA scales down to 5 pods
   10:02 - Traffic returns to 10,000 req/sec
   10:02 - 5 pods overloaded, users see errors
   10:03 - HPA scales back up to 10 pods (but 2 minutes of errors already occurred)
   ```
   With stabilization: Wait 5 minutes before scaling down, so temporary drops don't cause issues.

**If you don't set PodDisruptionBudgets:**

1. **Service Unavailable During Scale-Down:** Cluster Autoscaler removes node:
   ```
   Current state: 5 pods (vibecoded-api) across 3 nodes (2, 2, 1 pods each)
   Cluster Autoscaler: "Node 3 is underutilized (1 pod), removing it"
   Action: Drain node 3 (delete 1 pod), don't wait for replacement to start
   Result: 4 pods for ~30 seconds while new pod starts
   If minAvailable was 5: Brief unavailability (all 5 pods not ready simultaneously)
   ```
   With PDB: Cluster Autoscaler blocked from removing node until replacement pod is running elsewhere.

#### Resources Required

**Skills:**
- **Kubernetes basics:** Pods, Deployments, ReplicaSets, Resources (covered in 2.2)
- **Metrics understanding:** CPU/memory utilization, percentiles, rates (1 day)
- **Prometheus basics:** For custom HPA metrics (2 days, covered in Chapter 7)

**Tools:**
- **Metrics Server:** Installed in 2.2 (provides CPU/memory metrics for HPA)
- **Prometheus:** For custom metrics (installed in Chapter 7)
- **Prometheus Adapter:** For exposing Prometheus metrics to HPA (1 hour install)
- **VPA:** Optional, for vertical scaling (1 hour install)
- **Cluster Autoscaler:** Installed in 2.2

**Time Investment:**
- **HPA setup:** 4 hours (configure metrics, test scaling, tune behavior)
- **Custom metrics:** 4 hours (Prometheus Adapter, create custom metrics)
- **VPA setup:** 2 hours (optional, for non-HPA workloads)
- **Cluster Autoscaler tuning:** 2 hours (verify configs, test node scaling)
- **PDB creation:** 1 hour (create for all critical services)
- **Monitoring setup:** 2 hours (dashboard, alerts)
- **Testing & verification:** 4 hours (load tests, verify scaling)
- **Total:** 2–3 days

**Ongoing:**
- Review HPA settings quarterly (adjust based on traffic patterns)
- Review VPA recommendations monthly (update resource requests if needed)
- Monitor auto-scaling dashboards weekly (check for flapping, maxed-out HPAs)
- Tune on incidents (if scaling too slow/fast, adjust behavior)

#### Verification Checklist

Before relying on auto-scaling in production:

**HPA:**
- [ ] **Metrics Server installed and working** (`kubectl top nodes` shows CPU/memory)
- [ ] **HPA created for all scalable services** (`kubectl get hpa -A`)
- [ ] **Metrics targets realistic** (70–80% CPU, not 95% or 50%)
- [ ] **Min/max replicas set appropriately** (min ≥ number of AZs for HA, max within budget/capacity)
- [ ] **Stabilization windows configured** (prevent flapping)
- [ ] **Scale-up tested** (generate load, verify HPA scales up in 2–5 minutes)
- [ ] **Scale-down tested** (remove load, verify HPA scales down after stabilization window)
- [ ] **Custom metrics working** (if using, verify metrics appear in `kubectl get hpa`)

**Cluster Autoscaler:**
- [ ] **Cluster Autoscaler deployed** (`kubectl get pods -n kube-system -l app=cluster-autoscaler`)
- [ ] **Node groups have auto-scaling tags** (k8s.io/cluster-autoscaler/enabled=true)
- [ ] **Min/max nodes set per node group** (in Terraform/CloudFormation)
- [ ] **Scale-up tested** (create many pods, verify nodes add automatically)
- [ ] **Scale-down tested** (delete pods, verify nodes remove after 10 minutes)
- [ ] **Logs monitored** (`kubectl logs -n kube-system -l app=cluster-autoscaler --tail=100`)

**PDB:**
- [ ] **PDBs created for all critical services** (`kubectl get pdb -A`)
- [ ] **minAvailable or maxUnavailable set appropriately** (never 0 available)
- [ ] **Tested during node drain** (`kubectl drain <node>`, verify PDB prevents unavailability)

**Testing Procedures:**

```bash
# Test 1: HPA scale-up
# Generate load
kubectl run -it --rm load-generator \
  --image=busybox \
  --restart=Never \
  -- /bin/sh -c "while true; do wget -q -O- http://vibecoded-api; done"

# Watch HPA scale up
watch kubectl get hpa vibecoded-api-hpa -n production
# Expected: Current replicas increases from 3 to 5-10 within 2-3 minutes

# Test 2: HPA scale-down
# Stop load (Ctrl+C on load generator)
watch kubectl get hpa vibecoded-api-hpa -n production
# Expected: After stabilization window (5 minutes), replicas decrease

# Test 3: Cluster Autoscaler scale-up
# Create many large pods (will exceed node capacity)
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-hog
  namespace: default
spec:
  replicas: 20
  selector:
    matchLabels:
      app: resource-hog
  template:
    metadata:
      labels:
        app: resource-hog
    spec:
      containers:
      - name: hog
        image: nginx
        resources:
          requests:
            cpu: 2000m
            memory: 4Gi
EOF

# Watch nodes scale up
watch kubectl get nodes
# Expected: New nodes appear within 5-10 minutes

# Watch pods schedule
watch kubectl get pods -l app=resource-hog
# Expected: Pending pods become Running as nodes are added

# Clean up
kubectl delete deployment resource-hog -n default

# Test 4: Cluster Autoscaler scale-down
watch kubectl get nodes
# Expected: After 10 minutes of low utilization, extra nodes are removed

# Test 5: PDB prevents disruption
# Try to drain node with production pods
kubectl drain <node-name> --ignore-daemonsets

# Check if drain is blocked
kubectl get events -n production --sort-by='.metadata.creationTimestamp'
# Expected: Events show "Cannot evict pod: would violate PDB vibecoded-api-pdb"
```

#### Emerging Alternatives to Watch

**KEDA (Kubernetes Event-Driven Autoscaling):**

KEDA extends HPA to scale based on external metrics and events (not just CPU/memory):
- Queue depth (SQS, RabbitMQ, Kafka)
- Database query load (PostgreSQL connections)
- HTTP request rate (from external load balancer)
- Cron schedules (scale up before known traffic spike)
- Cloud metrics (AWS CloudWatch, GCP Monitoring, Azure Monitor)

```yaml
# Example: KEDA ScaledObject for queue-based scaling
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: vibecoded-worker-scaler
  namespace: production
spec:
  scaleTargetRef:
    name: vibecoded-worker
  minReplicaCount: 1
  maxReplicaCount: 50
  triggers:
  - type: aws-sqs-queue
    metadata:
      queueURL: https://sqs.us-east-1.amazonaws.com/123456789/vibecoded-jobs
      queueLength: "5"  # Scale 1 pod per 5 messages
      awsRegion: "us-east-1"
  - type: cron
    metadata:
      timezone: America/New_York
      start: 0 8 * * *  # Scale up at 8am
      end: 0 20 * * *    # Scale down at 8pm
      desiredReplicas: "10"
```

**When to consider:**
- You have event-driven workloads (queue consumers, stream processors)
- You want to scale based on business metrics (orders/minute, API keys created/hour)
- You have predictable traffic patterns (scale up before known spike)

**Track:** KEDA v2.x maturity, integration with AWS EventBridge/GCP Pub/Sub, community scalers.

**Karpenter (Advanced Node Autoscaling for AWS):**

Karpenter is a Kubernetes node autoscaler that replaces Cluster Autoscaler with:
- Faster provisioning (launches nodes directly, no Auto Scaling Groups)
- Better bin-packing (chooses node size based on pending pod requirements)
- Multi-instance-type support (can provision c5.xlarge, m5.2xlarge, r5.large in same cluster)
- Spot instance support (automatic fallback to on-demand if spot unavailable)

```yaml
# Example: Karpenter Provisioner
apiVersion: karpenter.sh/v1alpha5
kind: Provisioner
metadata:
  name: default
spec:
  # Instance types Karpenter can choose from
  requirements:
  - key: karpenter.sh/capacity-type
    operator: In
    values: ["spot", "on-demand"]
  - key: node.kubernetes.io/instance-type
    operator: In
    values: ["c5.large", "c5.xlarge", "m5.large", "m5.xlarge"]
  
  # Node limits
  limits:
    resources:
      cpu: 1000  # Max 1000 CPUs across all nodes
  
  # TTL (remove nodes after this duration if underutilized)
  ttlSecondsAfterEmpty: 30  # 30 seconds (faster than Cluster Autoscaler's 10 min)
```

**When to consider:**
- You're on AWS EKS (Karpenter is AWS-specific currently)
- You have diverse workload types (some need CPU-optimized, some memory-optimized)
- You want faster scaling (Karpenter provisions nodes in ~2 minutes vs 5-10 for Cluster Autoscaler)
- You want to mix spot and on-demand (Karpenter handles fallback automatically)

**Track:** Karpenter v1.0 (currently v0.x), Azure/GCP versions (community-driven), integration with Pod Topology Spread.

**VPA Recommender Mode + Automated Updates via GitOps:**

Instead of VPA automatically updating pods (risky in production), use VPA in recommendation mode and automate updates via GitOps:
1. VPA generates recommendations
2. CI/CD pipeline reads recommendations
3. Pipeline updates Deployment YAML in Git
4. ArgoCD/Flux deploys updated YAML
5. Gradual rollout with normal deployment strategy

This gives you:
- Human review of resource changes (Git PR)
- Audit trail (Git history)
- Rollback ability (Git revert)
- No surprises (VPA won't suddenly change prod resources)

**Track:** Tooling for VPA → GitOps integration (Fairwinds Goldilocks, Robusta's VPA recommender).

---

Due to token limits, I need to create Section 2.5 (Security Hardening) in a follow-up response. Would you like me to continue with 2.5 immediately?
