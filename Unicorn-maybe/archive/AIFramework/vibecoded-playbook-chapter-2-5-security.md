# VIBECODED SAAS PLAYBOOK - CHAPTER 2.5

**Part I: Foundations - Security Hardening for Kubernetes**

*Advanced Security Patterns for Production Kubernetes*

---

## 2.5 Security Hardening for Production Kubernetes

**Duration:** 4 days | **Priority:** Critical | **Prerequisites:** 2.2–2.4 Complete

### Overview

Kubernetes security hardening transforms your cluster from "it works" to "it's production-ready and audit-proof." Think of it as the difference between a house with doors (basic functionality) versus a house with locks, deadbolts, alarm system, cameras, and safe room (defense in depth). A default Kubernetes cluster has significant security gaps: pods can access the API server with excessive permissions, network traffic is unrestricted, secrets are stored in plaintext in etcd, and containers run as root.

**Why security hardening matters for Vibecoded:**
- **User-Generated Code:** Your platform runs user-built apps. One malicious user could compromise your entire cluster without proper isolation.
- **Multi-Tenancy:** Tenant A's app must be completely isolated from Tenant B's app. Network policies, RBAC, and pod security prevent cross-tenant attacks.
- **Compliance Requirements:** SOC 2, ISO 27001, PCI-DSS all require documented security controls. Kubernetes security features provide evidence for audits.
- **Incident Response:** When (not if) a pod is compromised, security hardening limits the blast radius and provides forensic data.

**The Defense in Depth Model:**

```
Layer 1: Network Policies (Firewall rules between pods)
Layer 2: Pod Security Standards (Prevent privileged containers)
Layer 3: RBAC (Limit API access)
Layer 4: Secrets Management (Encrypt sensitive data)
Layer 5: Audit Logging (Track all API calls)
Layer 6: Runtime Security (Detect anomalous behavior)
Layer 7: Image Security (Scan for vulnerabilities)
```

**Common Security Mistakes:**
- Running pods as root (default Kubernetes behavior)
- No network policies (all pods can talk to all pods)
- Service accounts with cluster-admin (excessive permissions)
- Secrets in ConfigMaps or environment variables (plaintext)
- No audit logs (can't investigate incidents)

This section implements all 7 layers with production-tested configurations.

### How to Implement

**Layer 1: Network Policies - Pod-to-Pod Firewall**

We covered basic network policies in Chapter 2.2. Here are advanced patterns:

#### Zero-Trust Network Policy Architecture

```yaml
# kubernetes/network-policies/00-default-deny-all.yaml
# Step 1: Deny all traffic by default (whitelist approach)

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}  # Applies to all pods
  policyTypes:
  - Ingress
  - Egress
  # No ingress/egress rules = deny all

---
# kubernetes/network-policies/01-allow-dns.yaml
# Step 2: Allow DNS for all pods (required for service discovery)

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53

---
# kubernetes/network-policies/02-allow-api-to-db.yaml
# Step 3: Allow API pods to database (specific ports only)

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: vibecoded-api
  policyTypes:
  - Egress
  egress:
  # PostgreSQL
  - to:
    - podSelector:
        matchLabels:
          app: postgresql
    ports:
    - protocol: TCP
      port: 5432
  
  # Redis
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379

---
# kubernetes/network-policies/03-allow-ingress-to-api.yaml
# Step 4: Allow ingress controller to API pods

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: vibecoded-api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app.kubernetes.io/name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000

---
# kubernetes/network-policies/04-allow-external-https.yaml
# Step 5: Allow API pods to external HTTPS (for third-party APIs)

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-external-https
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: vibecoded-api
  policyTypes:
  - Egress
  egress:
  # Allow HTTPS to anywhere (restrict to specific IPs if possible)
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - 169.254.169.254/32  # Block AWS metadata service
        - 10.0.0.0/8          # Block internal networks
        - 172.16.0.0/12
        - 192.168.0.0/16
    ports:
    - protocol: TCP
      port: 443

---
# kubernetes/network-policies/05-isolate-user-apps.yaml
# Step 6: Isolate user-generated apps from each other

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: isolate-user-apps
  namespace: user-apps
spec:
  podSelector:
    matchLabels:
      app-type: user-generated
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Only allow traffic from API gateway
  - from:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: api-gateway
  
  egress:
  # Allow DNS
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
  
  # Allow external HTTPS (for user apps calling APIs)
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - 169.254.169.254/32  # Block metadata service
        - 10.0.0.0/8
    ports:
    - protocol: TCP
      port: 443
    - protocol: TCP
      port: 80
  
  # Block all pod-to-pod communication (user apps can't talk to each other)
```

**Network Policy Testing:**

```bash
#!/bin/bash
# test-network-policies.sh - Verify network isolation

set -euo pipefail

echo "Testing network policies..."

# Test 1: API can reach database
echo "Test 1: API -> Database (should succeed)"
kubectl exec -n production deployment/vibecoded-api -- \
  nc -zv postgresql.production.svc.cluster.local 5432

# Test 2: API cannot reach other API pods directly (only via service)
echo "Test 2: API -> API pod directly (should fail)"
API_POD_IP=$(kubectl get pod -n production -l app=vibecoded-api -o jsonpath='{.items[0].status.podIP}')
kubectl exec -n production deployment/vibecoded-api -- \
  timeout 5 nc -zv ${API_POD_IP} 3000 || echo "Blocked (expected)"

# Test 3: User app cannot reach API pods
echo "Test 3: User app -> API (should fail)"
kubectl exec -n user-apps deployment/user-app-123 -- \
  timeout 5 nc -zv vibecoded-api.production.svc.cluster.local 3000 || echo "Blocked (expected)"

# Test 4: User app cannot reach other user apps
echo "Test 4: User app -> Other user app (should fail)"
USER_APP_IP=$(kubectl get pod -n user-apps -l app-id=app-456 -o jsonpath='{.items[0].status.podIP}')
kubectl exec -n user-apps deployment/user-app-123 -- \
  timeout 5 nc -zv ${USER_APP_IP} 8080 || echo "Blocked (expected)"

# Test 5: User app can reach external HTTPS
echo "Test 5: User app -> External HTTPS (should succeed)"
kubectl exec -n user-apps deployment/user-app-123 -- \
  curl -s -o /dev/null -w "%{http_code}" https://api.github.com

echo "Network policy tests complete!"
```

**Layer 2: Pod Security Standards - Enforce Secure Pod Configurations**

Pod Security Standards (PSS) replace deprecated Pod Security Policies. We covered basic PSS in 2.2, here are advanced patterns:

#### Policy Enforcement with Kyverno

Kyverno is a Kubernetes-native policy engine that enforces rules beyond PSS.

```bash
# Install Kyverno
kubectl create -f https://github.com/kyverno/kyverno/releases/latest/download/install.yaml
```

```yaml
# kubernetes/kyverno-policies/require-labels.yaml
# Policy: All pods must have required labels

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
  annotations:
    policies.kyverno.io/title: Require Labels
    policies.kyverno.io/severity: medium
    policies.kyverno.io/description: |
      All pods must have app, version, and owner labels for tracking and auditing.
spec:
  validationFailureAction: Enforce  # Reject pods without labels
  background: true
  rules:
  - name: check-for-labels
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Pods must have labels: app, version, owner"
      pattern:
        metadata:
          labels:
            app: "?*"
            version: "?*"
            owner: "?*"

---
# kubernetes/kyverno-policies/block-latest-tag.yaml
# Policy: Block images using :latest tag

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-latest-tag
  annotations:
    policies.kyverno.io/title: Disallow Latest Tag
    policies.kyverno.io/severity: high
    policies.kyverno.io/description: |
      Using :latest tag in production is dangerous. Images must use
      specific version tags for traceability and rollback.
spec:
  validationFailureAction: Enforce
  background: true
  rules:
  - name: require-image-tag
    match:
      any:
      - resources:
          kinds:
          - Pod
          namespaces:
          - production
    validate:
      message: "Image tag 'latest' is not allowed in production"
      pattern:
        spec:
          containers:
          - image: "!*:latest"

---
# kubernetes/kyverno-policies/block-host-namespaces.yaml
# Policy: Block host namespace usage

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-host-namespaces
  annotations:
    policies.kyverno.io/title: Disallow Host Namespaces
    policies.kyverno.io/severity: high
    policies.kyverno.io/description: |
      Pods should not use host namespaces (hostPID, hostIPC, hostNetwork)
      as this breaks container isolation.
spec:
  validationFailureAction: Enforce
  background: true
  rules:
  - name: host-namespaces
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Using host namespaces is disallowed"
      pattern:
        spec:
          =(hostPID): "false"
          =(hostIPC): "false"
          =(hostNetwork): "false"

---
# kubernetes/kyverno-policies/require-resource-limits.yaml
# Policy: Require resource limits (prevent resource exhaustion)

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
  annotations:
    policies.kyverno.io/title: Require Resource Limits
    policies.kyverno.io/severity: medium
spec:
  validationFailureAction: Enforce
  background: true
  rules:
  - name: check-container-resources
    match:
      any:
      - resources:
          kinds:
          - Pod
          namespaces:
          - production
    validate:
      message: "Containers must have CPU and memory limits"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"

---
# kubernetes/kyverno-policies/block-privileged-containers.yaml
# Policy: Block privileged containers

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged-containers
  annotations:
    policies.kyverno.io/title: Disallow Privileged Containers
    policies.kyverno.io/severity: critical
spec:
  validationFailureAction: Enforce
  background: true
  rules:
  - name: privileged-containers
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Privileged containers are not allowed"
      pattern:
        spec:
          containers:
          - =(securityContext):
              =(privileged): "false"

---
# kubernetes/kyverno-policies/auto-add-network-policy.yaml
# Policy: Automatically add default-deny network policy to new namespaces

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-networkpolicy
  annotations:
    policies.kyverno.io/title: Add Network Policy
    policies.kyverno.io/severity: medium
spec:
  rules:
  - name: default-deny-all
    match:
      any:
      - resources:
          kinds:
          - Namespace
    generate:
      kind: NetworkPolicy
      name: default-deny-all
      namespace: "{{request.object.metadata.name}}"
      synchronize: true
      data:
        spec:
          podSelector: {}
          policyTypes:
          - Ingress
          - Egress
```

**Layer 3: RBAC - Principle of Least Privilege**

We covered basic RBAC in 2.2. Here are advanced patterns for production:

#### Service Account RBAC with Minimal Permissions

```yaml
# kubernetes/rbac/api-service-account-minimal.yaml
# Minimal RBAC for API service account

apiVersion: v1
kind: ServiceAccount
metadata:
  name: vibecoded-api
  namespace: production
automountServiceAccountToken: false  # Don't auto-mount (explicitly mount only when needed)

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: vibecoded-api-role
  namespace: production
rules:
# ONLY allow reading specific ConfigMaps (not all)
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames:
  - app-config
  - feature-flags
  verbs: ["get", "watch"]

# ONLY allow reading specific Secrets
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames:
  - database-credentials
  - redis-credentials
  verbs: ["get"]

# Allow reading own pod info (for leader election)
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
  # Further restrict with fieldSelector in actual API calls

# Allow creating events (for logging/debugging)
- apiGroups: [""]
  resources: ["events"]
  verbs: ["create", "patch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: vibecoded-api-binding
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: vibecoded-api-role
subjects:
- kind: ServiceAccount
  name: vibecoded-api
  namespace: production

---
# kubernetes/rbac/user-app-service-account.yaml
# Even more restrictive RBAC for user-generated apps

apiVersion: v1
kind: ServiceAccount
metadata:
  name: user-app-sa
  namespace: user-apps
automountServiceAccountToken: false  # User apps should NOT access K8s API

---
# No Role or RoleBinding = zero API access
# User apps run with this service account and have NO Kubernetes API permissions
```

#### Audit Who Has What Permissions

```bash
#!/bin/bash
# audit-rbac.sh - Audit RBAC permissions across cluster

set -euo pipefail

echo "=== Cluster-wide Admin Access ==="
kubectl get clusterrolebindings -o json | \
  jq -r '.items[] | select(.roleRef.name=="cluster-admin") | 
  "User/Group: \(.subjects[].name) | Namespace: \(.subjects[].namespace // "N/A")"'

echo ""
echo "=== Service Accounts with Broad Permissions ==="
for sa in $(kubectl get sa --all-namespaces -o json | jq -r '.items[] | "\(.metadata.namespace)/\(.metadata.name)"'); do
  NAMESPACE=$(echo $sa | cut -d/ -f1)
  SA_NAME=$(echo $sa | cut -d/ -f2)
  
  # Check if SA has list/watch on secrets (potential security issue)
  if kubectl auth can-i list secrets --as=system:serviceaccount:${NAMESPACE}:${SA_NAME} -n ${NAMESPACE} 2>/dev/null | grep -q yes; then
    echo "WARNING: ${NAMESPACE}/${SA_NAME} can list all secrets"
  fi
done

echo ""
echo "=== Users with delete permissions on pods ==="
kubectl get rolebindings,clusterrolebindings --all-namespaces -o json | \
  jq -r '.items[] | select(.roleRef.kind=="Role" or .roleRef.kind=="ClusterRole") | 
  .subjects[]? | select(.kind=="User") | .name' | sort -u
```

**Layer 4: Secrets Management - Encrypt Sensitive Data**

We covered basic secrets management in 2.2. Here are production patterns:

#### External Secrets Operator with AWS Secrets Manager

```yaml
# kubernetes/external-secrets/cluster-secret-store.yaml
# ClusterSecretStore for AWS Secrets Manager

apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: aws-secrets-manager
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
            namespace: external-secrets-system

---
# kubernetes/external-secrets/database-secret.yaml
# Sync database credentials from AWS Secrets Manager

apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: database-credentials
    creationPolicy: Owner
    template:
      engineVersion: v2
      data:
        # Template allows transforming secrets
        DATABASE_URL: "postgresql://{{ .username }}:{{ .password }}@{{ .host }}:{{ .port }}/{{ .database }}"
  dataFrom:
  - extract:
      key: prod/vibecoded/database  # AWS Secrets Manager secret name

---
# kubernetes/external-secrets/rotation-notification.yaml
# Alert when secrets are rotated

apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: stripe-api-key
  namespace: production
  annotations:
    notify-slack: "true"
spec:
  refreshInterval: 5m  # Check more frequently for sensitive secrets
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: stripe-api-key
    creationPolicy: Owner
  data:
  - secretKey: api-key
    remoteRef:
      key: prod/vibecoded/stripe
      property: secret_key
```

**Secret Rotation Script:**

```bash
#!/bin/bash
# rotate-secret.sh - Rotate a secret with zero downtime

set -euo pipefail

SECRET_NAME=$1
NAMESPACE=${2:-production}

echo "Rotating secret: ${SECRET_NAME} in namespace: ${NAMESPACE}"

# Step 1: Update secret in AWS Secrets Manager
echo "Step 1: Update secret in AWS Secrets Manager (manual step)"
echo "Run: aws secretsmanager update-secret --secret-id prod/vibecoded/${SECRET_NAME} --secret-string '{\"new\":\"value\"}'"
read -p "Press enter after updating AWS Secrets Manager..."

# Step 2: Trigger External Secrets Operator to sync
echo "Step 2: Triggering sync..."
kubectl annotate externalsecret ${SECRET_NAME} \
  -n ${NAMESPACE} \
  force-sync="$(date +%s)" \
  --overwrite

# Step 3: Wait for sync
echo "Step 3: Waiting for sync..."
sleep 10

# Step 4: Verify secret updated
NEW_VERSION=$(kubectl get secret ${SECRET_NAME} -n ${NAMESPACE} -o jsonpath='{.metadata.resourceVersion}')
echo "Secret updated to version: ${NEW_VERSION}"

# Step 5: Rolling restart of pods using this secret
echo "Step 5: Rolling restart of pods..."
kubectl rollout restart deployment -n ${NAMESPACE} -l uses-secret=${SECRET_NAME}

# Step 6: Verify rollout
kubectl rollout status deployment -n ${NAMESPACE} -l uses-secret=${SECRET_NAME}

echo "Secret rotation complete!"
```

#### Secret Scanning in Git

```yaml
# .github/workflows/secret-scan.yml
# GitHub Actions workflow to scan for committed secrets

name: Secret Scanning

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Full history for Gitleaks
    
    - name: Run Gitleaks
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
    
    - name: Fail if secrets found
      if: failure()
      run: |
        echo "Secrets detected in commit history!"
        echo "Follow remediation: https://docs.github.com/en/code-security/secret-scanning/managing-alerts-from-secret-scanning"
        exit 1
```

**Layer 5: Audit Logging - Track All API Activity**

Enable Kubernetes audit logs to track who did what, when:

```yaml
# kubernetes/audit-policy.yaml
# Kubernetes audit policy

apiVersion: audit.k8s.io/v1
kind: Policy
rules:
# Don't log read requests on certain resources
- level: None
  resources:
  - group: ""
    resources: ["events"]

# Don't log watch requests
- level: None
  verbs: ["watch"]

# Don't log system component requests
- level: None
  users:
  - "system:kube-proxy"
  - "system:kube-scheduler"
  - "system:kube-controller-manager"
  userGroups:
  - "system:nodes"

# Log metadata for all other requests
- level: Metadata
  omitStages:
  - RequestReceived

# Log request and response for secrets
- level: RequestResponse
  resources:
  - group: ""
    resources: ["secrets"]

# Log request and response for RBAC changes
- level: RequestResponse
  resources:
  - group: "rbac.authorization.k8s.io"
    resources: ["clusterroles", "clusterrolebindings", "roles", "rolebindings"]

# Log request and response for authentication/authorization
- level: RequestResponse
  verbs: ["create", "update", "patch", "delete"]
  resources:
  - group: "authentication.k8s.io"
  - group: "authorization.k8s.io"
```

**Enable Audit Logs in EKS:**

```hcl
# terraform/modules/eks/main.tf
# Enable audit logs in EKS cluster

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_enabled_log_types = [
    "api",
    "audit",           # <-- Audit logs
    "authenticator",
    "controllerManager",
    "scheduler"
  ]
  
  # ... rest of config ...
}
```

**Query Audit Logs:**

```bash
#!/bin/bash
# query-audit-logs.sh - Search Kubernetes audit logs

# Who deleted a pod?
aws logs filter-log-events \
  --log-group-name /aws/eks/vibecoded-prod/cluster \
  --log-stream-name-prefix kube-apiserver-audit \
  --filter-pattern '{ $.verb = "delete" && $.objectRef.resource = "pods" }' \
  --start-time $(date -u -d '1 hour ago' +%s)000 \
  | jq '.events[] | {time: .timestamp, user: .message | fromjson | .user.username, pod: .message | fromjson | .objectRef.name}'

# Who accessed secrets?
aws logs filter-log-events \
  --log-group-name /aws/eks/vibecoded-prod/cluster \
  --log-stream-name-prefix kube-apiserver-audit \
  --filter-pattern '{ $.objectRef.resource = "secrets" }' \
  --start-time $(date -u -d '24 hours ago' +%s)000 \
  | jq '.events[] | {time: .timestamp, user: .message | fromjson | .user.username, verb: .message | fromjson | .verb, secret: .message | fromjson | .objectRef.name}'
```

**Layer 6: Runtime Security - Detect Anomalous Behavior**

Falco is an open-source runtime security tool that detects anomalous behavior:

```bash
# Install Falco
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set falcosidekick.enabled=true \
  --set falcosidekick.webui.enabled=true
```

```yaml
# kubernetes/falco/custom-rules.yaml
# Custom Falco rules for Vibecoded

apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-rules
  namespace: falco
data:
  custom-rules.yaml: |
    # Rule: Detect shell spawned in container
    - rule: Shell Spawned in Container
      desc: A shell was spawned in a container (potential compromise)
      condition: >
        spawned_process and
        container and
        shell_procs and
        proc.pname exists and
        not user_known_shell_spawn_binaries
      output: >
        Shell spawned in container (user=%user.name container=%container.name
        shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline)
      priority: WARNING
      tags: [shell, container]
    
    # Rule: Detect sensitive file access
    - rule: Read Sensitive File
      desc: Detected attempt to read sensitive files
      condition: >
        open_read and
        container and
        (fd.name startswith /etc/shadow or
         fd.name startswith /etc/sudoers or
         fd.name startswith /root/.ssh)
      output: >
        Sensitive file opened for reading (user=%user.name container=%container.name
        file=%fd.name command=%proc.cmdline)
      priority: WARNING
      tags: [filesystem, sensitive]
    
    # Rule: Detect outbound connection to suspicious IP
    - rule: Outbound Connection to Suspicious IP
      desc: Detected outbound connection to known malicious IP
      condition: >
        outbound and
        container and
        fd.sip in (suspicious_ips)
      output: >
        Suspicious outbound connection (container=%container.name
        destination=%fd.sip:%fd.sport command=%proc.cmdline)
      priority: CRITICAL
      tags: [network, malware]
    
    # Rule: Detect container escape attempt
    - rule: Container Escape Attempt
      desc: Detected attempt to escape container
      condition: >
        spawned_process and
        container and
        (proc.name = "nsenter" or
         proc.name = "unshare" or
         proc.cmdline contains "docker.sock")
      output: >
        Container escape attempt detected (user=%user.name container=%container.name
        command=%proc.cmdline)
      priority: CRITICAL
      tags: [container_escape]
```

**Falco Alert Integration with Slack:**

```yaml
# kubernetes/falco/falcosidekick-config.yaml
# Configure Falco to send alerts to Slack

apiVersion: v1
kind: ConfigMap
metadata:
  name: falcosidekick-config
  namespace: falco
data:
  config.yaml: |
    slack:
      webhookurl: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
      minimumpriority: "warning"
      messageformat: |
        :warning: *Falco Alert*
        *Rule:* {{.Rule}}
        *Priority:* {{.Priority}}
        *Container:* {{.Output.container_name}}
        *Command:* {{.Output.proc_cmdline}}
        *Time:* {{.Time}}
```

**Layer 7: Image Security - Scan Container Images**

We covered basic image scanning in 2.1. Here's production integration:

```yaml
# .github/workflows/image-scan.yml
# Automated image scanning in CI/CD

name: Container Image Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build image
      run: docker build -t vibecoded/api:${{ github.sha }} .
    
    - name: Scan with Trivy
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: vibecoded/api:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH'
        exit-code: '1'  # Fail build if vulnerabilities found
    
    - name: Upload Trivy results to GitHub Security
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Scan with Grype
      uses: anchore/scan-action@v3
      with:
        image: vibecoded/api:${{ github.sha }}
        fail-build: true
        severity-cutoff: high
    
    - name: Push image (only if scans pass)
      if: success()
      run: |
        docker push vibecoded/api:${{ github.sha }}
```

**Image Signing with Cosign:**

```bash
#!/bin/bash
# sign-image.sh - Sign container images for supply chain security

set -euo pipefail

IMAGE=$1

# Generate keypair (one-time setup)
# cosign generate-key-pair

# Sign image
cosign sign --key cosign.key ${IMAGE}

# Verify signature
cosign verify --key cosign.pub ${IMAGE}

echo "Image signed: ${IMAGE}"
```

**Admission Controller to Enforce Signed Images:**

```yaml
# kubernetes/admission/require-signed-images.yaml
# Kyverno policy to require signed images

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
  annotations:
    policies.kyverno.io/title: Verify Image Signature
    policies.kyverno.io/severity: critical
spec:
  validationFailureAction: Enforce
  background: false
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
          namespaces:
          - production
    verifyImages:
    - imageReferences:
      - "ghcr.io/vibecoded/*"
      attestors:
      - count: 1
        entries:
        - keys:
            publicKeys: |
              -----BEGIN PUBLIC KEY-----
              MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
              -----END PUBLIC KEY-----
```

### Why This Matters

**Business Rationale:**

1. **Compliance & Audits:** SOC 2, ISO 27001, HIPAA, PCI-DSS all require:
   - Network segmentation (Network Policies)
   - Least-privilege access (RBAC)
   - Audit trails (Kubernetes Audit Logs)
   - Secrets encryption (External Secrets, KMS)
   - Incident detection (Falco)
   
   Companies without these controls fail audits, delaying enterprise deals by 6–12 months.

2. **Incident Response:** When security incident occurs:
   - Audit logs show who/what/when (5-minute investigation vs 5-hour guessing)
   - Network policies limit lateral movement (attacker compromises one pod, can't reach others)
   - Falco detects anomalies in real-time (shells in containers trigger alerts)
   - RBAC limits blast radius (compromised service account can't delete cluster)

3. **Insurance & Legal:** Cyber insurance requires demonstrable security controls. Post-breach:
   - With controls: "We followed industry best practices" (defensible)
   - Without controls: "We had no security measures" (negligence claim)

**Technical Rationale:**

1. **Defense in Depth:** Each layer catches different attack vectors:
   ```
   Attack: Attacker compromises API pod
   Layer 1 (Network): Can't reach database (Network Policy blocks)
   Layer 2 (Pod Security): Can't escalate to root (runs as non-root user)
   Layer 3 (RBAC): Can't access secrets of other apps
   Layer 4 (Secrets): Database password encrypted at rest, not in env vars
   Layer 5 (Audit): Attack logged for forensics
   Layer 6 (Runtime): Falco detects shell spawn, alerts on-call
   Layer 7 (Image): Signed images prevent supply-chain attack
   ```

2. **Automated Enforcement:** Policies enforce automatically:
   - Developer tries to deploy pod without resource limits → Kyverno rejects
   - Someone pushes secret to Git → GitHub Actions scan fails
   - Pod tries to access blocked IP → Network Policy drops packets
   
   No manual review needed, scales to 100s of developers.

### What Happens If You Don't

**If you skip Network Policies:**
- Default: All pods can talk to all pods (flat network)
- Attack: Attacker compromises user app pod → directly connects to database pod → dumps all data
- With Network Policies: User app pod can't reach database → attack contained

**If you skip Pod Security Standards:**
- Default: Pods can run as root, mount host filesystem, use privileged mode
- Attack: Attacker escapes container → gains root on host node → accesses all pods on node → cluster-wide compromise
- With PSS: Pods forced to run non-root, no host access → container escape doesn't gain host access

**If you skip RBAC hardening:**
- Default: Service accounts get default permissions (can list pods, services)
- Attack: Attacker compromises pod → uses service account token → lists all secrets → steals credentials
- With RBAC: Service account can only read specific secrets → attacker gains nothing

**If you skip Secrets Management:**
- Default: Secrets in plaintext in etcd, visible in `kubectl get secret`
- Attack: Attacker gets etcd backup → extracts all secrets → compromises database, APIs, etc.
- With KMS encryption: Secrets encrypted at rest → etcd backup useless without KMS keys

**If you skip Audit Logging:**
- Incident: Something deleted production database
- Without logs: "We don't know who did it" → 5-hour investigation → no conclusion
- With logs: Query audit logs → "User john@company.com ran kubectl delete..." → 5-minute investigation

**If you skip Runtime Security:**
- Attack: Attacker spawns reverse shell in container
- Without Falco: Attack undetected for days/weeks (until damage done)
- With Falco: Alert within seconds → on-call responds → attacker ejected

### Resources Required

**Skills:**
- Kubernetes security fundamentals (2 days learning)
- Network policies syntax (1 day practice)
- RBAC understanding (1 day)
- Policy engines (Kyverno/OPA) (2 days)

**Tools:**
- Kyverno: Free, open-source
- External Secrets Operator: Free, open-source
- Falco: Free, open-source
- Trivy/Grype: Free, open-source
- Cosign: Free, open-source

**Time Investment:**
- Network Policies: 1 day (write, test, document)
- Kyverno policies: 1 day (install, create policies)
- RBAC audit and hardening: 1 day
- External Secrets Operator: 0.5 days (setup, migrate secrets)
- Audit logging: 0.5 days (enable, test queries)
- Falco: 1 day (install, configure, test alerts)
- Image scanning CI: 0.5 days (integrate into pipeline)
- **Total:** 4–5 days

**Ongoing:**
- Review audit logs weekly: 30 minutes
- Review Falco alerts daily: 10 minutes
- Update policies quarterly: 2 hours
- Rotate secrets quarterly: 1 hour per secret

### Verification Checklist

**Before production:**
- [ ] Network Policies enforced (default-deny + explicit allows)
- [ ] Network Policies tested (verify isolation with nc/curl)
- [ ] Pod Security Standards enforced (Restricted in production namespace)
- [ ] Kyverno policies active (verify with test pod creation)
- [ ] RBAC minimized (service accounts have only required permissions)
- [ ] Secrets externalized (no secrets in Git, use External Secrets)
- [ ] Secrets encrypted at rest (KMS enabled)
- [ ] Audit logging enabled (EKS control plane logs to CloudWatch)
- [ ] Audit log queries tested (can find who did what)
- [ ] Falco deployed and alerting (test with shell in container)
- [ ] Image scanning in CI/CD (build fails on HIGH/CRITICAL CVEs)
- [ ] Images signed (Cosign signatures verified)

### Emerging Alternatives

**Cilium (eBPF-based Networking):**
- Replaces kube-proxy and traditional Network Policies
- Uses eBPF for kernel-level enforcement (faster, more secure)
- Provides identity-based security (not just IP-based)
- Integrates with service mesh (Cilium Service Mesh)
- **Track:** Cilium v1.15+, eBPF adoption in managed K8s

**Sigstore (Keyless Signing):**
- Simplifies image signing (no key management)
- OIDC-based identity for signing
- Public transparency log (Rekor)
- **Track:** Sigstore adoption by registries, GitHub integration

**Policy as Code (OPA/Cedar maturity):**
- Centralized policy engine for all authorization decisions
- Not just Kubernetes, but also API, database, etc.
- **Track:** OPA Gatekeeper v4, AWS Cedar expansion

---

## CHAPTER 2 COMPLETE ✅

**What We've Built:**
- Secure, production-ready container images (2.1)
- Production-grade Kubernetes cluster (2.2)
- Zero-downtime deployment strategies (2.3)
- Comprehensive auto-scaling (2.4)
- Defense-in-depth security hardening (2.5)

**Next: Chapter 3 - Networking & Security Baselines** (coming in next section)

Or proceed to **Part II: Secure Software Delivery (CI/CD & Supply Chain)**

---

# END OF CHAPTER 2.5
