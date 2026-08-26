# VIBECODED SAAS PLAYBOOK - CHAPTER 3

**Part I: Foundations - Networking & Security Baselines**

*Production-Grade Networking, TLS, Ingress, and Defense Against Common Attacks*

---

## CHAPTER 3: NETWORKING & SECURITY BASELINES

### TL;DR

Implement production-grade networking with HTTPS/TLS, ingress controllers, DDoS protection, rate limiting, and Content Security Policy. This chapter transforms your Kubernetes cluster from "can serve traffic" to "can serve traffic securely at scale with protection against common web attacks."

---

### 3.1 HTTPS/TLS Configuration with Certificate Management

**Duration:** 2 days | **Priority:** Critical | **Prerequisites:** 2.2 Kubernetes cluster operational

#### Overview

HTTPS is non-negotiable for production. Without TLS encryption, all traffic between users and your API is plaintext—passwords, session tokens, user data, everything visible to anyone on the network path. Think of HTTP as sending postcards (anyone can read) versus HTTPS as sealed envelopes (only sender and recipient can read).

**Why HTTPS matters for Vibecoded:**
- **Security:** Prevents man-in-the-middle attacks, credential theft, session hijacking
- **Trust:** Browsers show "Not Secure" warnings for HTTP sites, users don't trust them
- **SEO:** Google penalizes HTTP sites in search rankings (HTTPS is ranking factor)
- **Features:** Modern web APIs (WebRTC, geolocation, service workers, HTTP/2) require HTTPS
- **Compliance:** PCI-DSS, HIPAA, SOC 2 all require TLS for data in transit

**Certificate Management Challenges:**
- Certificates expire (90 days for Let's Encrypt, 1 year for commercial)
- Manual renewal is error-prone (expired cert = site down)
- Multiple domains need multiple certificates
- Wildcard certificates need DNS validation

**Solution:** cert-manager automates certificate lifecycle—provisioning, renewal, rotation.

This section implements:
- Automatic certificate provisioning via Let's Encrypt
- Wildcard certificates for *.vibecoded.com
- Certificate rotation 30 days before expiry
- Multiple certificate issuers (staging for testing, production for real)
- Certificate monitoring and alerting

#### How to Implement

**Step 1: Install cert-manager**

```bash
#!/bin/bash
# install-cert-manager.sh - Install cert-manager for automated TLS

set -euo pipefail

echo "Installing cert-manager..."

# Add Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager CRDs
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.crds.yaml

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.0 \
  --set installCRDs=false \
  --set prometheus.enabled=true \
  --set webhook.timeoutSeconds=30

# Wait for cert-manager to be ready
kubectl wait --for=condition=available --timeout=300s \
  deployment/cert-manager -n cert-manager

kubectl wait --for=condition=available --timeout=300s \
  deployment/cert-manager-webhook -n cert-manager

kubectl wait --for=condition=available --timeout=300s \
  deployment/cert-manager-cainjector -n cert-manager

echo "cert-manager installed successfully!"

# Verify installation
kubectl get pods -n cert-manager
```

**Step 2: Create ClusterIssuers (Let's Encrypt)**

```yaml
# kubernetes/cert-manager/letsencrypt-staging.yaml
# Staging issuer for testing (uses Let's Encrypt staging API)

apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    # Let's Encrypt staging server (for testing, higher rate limits)
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    
    # Email for expiry notifications
    email: ops@vibecoded.com
    
    # Secret to store ACME account private key
    privateKeySecretRef:
      name: letsencrypt-staging-key
    
    # HTTP-01 challenge solver (for single domain certs)
    solvers:
    - http01:
        ingress:
          class: nginx
          podTemplate:
            metadata:
              labels:
                app: cert-manager-solver
            spec:
              # Security: Run solver pod as non-root
              securityContext:
                runAsNonRoot: true
                runAsUser: 1000
                fsGroup: 1000
              # Resource limits for solver pods
              containers:
              - name: acme-http-solver
                resources:
                  requests:
                    cpu: 10m
                    memory: 64Mi
                  limits:
                    cpu: 100m
                    memory: 128Mi

---
# kubernetes/cert-manager/letsencrypt-production.yaml
# Production issuer (uses Let's Encrypt production API)

apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    # Let's Encrypt production server (lower rate limits, real certs)
    server: https://acme-v02.api.letsencrypt.org/directory
    
    email: ops@vibecoded.com
    
    privateKeySecretRef:
      name: letsencrypt-production-key
    
    solvers:
    # HTTP-01 solver (for api.vibecoded.com, app.vibecoded.com)
    - http01:
        ingress:
          class: nginx
    
    # DNS-01 solver (for wildcard certs like *.vibecoded.com)
    - dns01:
        route53:
          region: us-east-1
          # IAM role for cert-manager (via IRSA)
          # Allows cert-manager to create TXT records for DNS validation
          hostedZoneID: Z1234567890ABC
      selector:
        dnsZones:
        - "vibecoded.com"

---
# kubernetes/cert-manager/route53-iam-policy.yaml
# IAM policy for cert-manager to manage Route53 records

apiVersion: v1
kind: ConfigMap
metadata:
  name: cert-manager-route53-policy
  namespace: cert-manager
data:
  policy.json: |
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "route53:GetChange",
          "Resource": "arn:aws:route53:::change/*"
        },
        {
          "Effect": "Allow",
          "Action": [
            "route53:ChangeResourceRecordSets",
            "route53:ListResourceRecordSets"
          ],
          "Resource": "arn:aws:route53:::hostedzone/Z1234567890ABC"
        },
        {
          "Effect": "Allow",
          "Action": "route53:ListHostedZonesByName",
          "Resource": "*"
        }
      ]
    }
```

**Create IAM Role for cert-manager (AWS):**

```bash
#!/bin/bash
# create-cert-manager-iam.sh - Create IAM role for cert-manager

set -euo pipefail

CLUSTER_NAME="vibecoded-prod"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create IAM policy
aws iam create-policy \
  --policy-name CertManagerRoute53Policy \
  --policy-document file://route53-policy.json \
  --region ${REGION} || true

# Create service account with IAM role
eksctl create iamserviceaccount \
  --cluster=${CLUSTER_NAME} \
  --namespace=cert-manager \
  --name=cert-manager \
  --attach-policy-arn=arn:aws:iam::${ACCOUNT_ID}:policy/CertManagerRoute53Policy \
  --override-existing-serviceaccounts \
  --approve

echo "IAM role created for cert-manager"
```

**Step 3: Request Certificates**

```yaml
# kubernetes/certificates/wildcard-certificate.yaml
# Wildcard certificate for *.vibecoded.com

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: vibecoded-wildcard
  namespace: production
spec:
  # Secret where certificate will be stored
  secretName: vibecoded-wildcard-tls
  
  # Certificate issuer
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  
  # Common name
  commonName: "*.vibecoded.com"
  
  # DNS names covered by certificate
  dnsNames:
  - "*.vibecoded.com"
  - "vibecoded.com"  # Include apex domain
  
  # Certificate duration (Let's Encrypt issues 90-day certs)
  duration: 2160h  # 90 days
  
  # Renew 30 days before expiry (60 days into 90-day cert)
  renewBefore: 720h  # 30 days
  
  # Subject Alternative Names (SANs)
  subject:
    organizations:
    - Vibecoded Inc.
  
  # Private key configuration
  privateKey:
    algorithm: RSA
    encoding: PKCS1
    size: 2048
    rotationPolicy: Always  # Generate new key on renewal

---
# kubernetes/certificates/api-certificate.yaml
# Specific certificate for api.vibecoded.com

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-vibecoded
  namespace: production
spec:
  secretName: api-vibecoded-tls
  
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  
  commonName: api.vibecoded.com
  
  dnsNames:
  - api.vibecoded.com
  
  duration: 2160h
  renewBefore: 720h
  
  # Use HTTP-01 challenge for single domain (faster than DNS-01)
  usages:
  - digital signature
  - key encipherment
  - server auth

---
# kubernetes/certificates/user-subdomain-certificate.yaml
# Certificate for user subdomains (*.user-123.vibecoded.com)

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: user-subdomain-wildcard
  namespace: production
spec:
  secretName: user-subdomain-tls
  
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  
  # Pattern: *.user-{id}.vibecoded.com
  # This requires a wildcard at second level, needs DNS-01
  commonName: "*.*.vibecoded.com"
  
  dnsNames:
  - "*.*.vibecoded.com"
  
  duration: 2160h
  renewBefore: 720h
```

**Step 4: Verify Certificate Provisioning**

```bash
#!/bin/bash
# verify-certificates.sh - Check certificate status

set -euo pipefail

echo "=== Certificate Status ==="
kubectl get certificate -A

echo ""
echo "=== Certificate Details ==="
kubectl describe certificate vibecoded-wildcard -n production

echo ""
echo "=== Certificate Secret Contents ==="
kubectl get secret vibecoded-wildcard-tls -n production -o yaml

echo ""
echo "=== Check Certificate Expiry ==="
kubectl get secret vibecoded-wildcard-tls -n production -o jsonpath='{.data.tls\.crt}' | \
  base64 -d | \
  openssl x509 -noout -dates

# Expected output:
# notBefore=Dec 15 12:00:00 2024 GMT
# notAfter=Mar 15 12:00:00 2025 GMT

echo ""
echo "=== Test Certificate Validity ==="
kubectl get secret vibecoded-wildcard-tls -n production -o jsonpath='{.data.tls\.crt}' | \
  base64 -d | \
  openssl x509 -noout -text | \
  grep -A 2 "Subject Alternative Name"

# Expected output:
# Subject Alternative Name:
#   DNS:*.vibecoded.com, DNS:vibecoded.com
```

**Step 5: Certificate Monitoring & Alerting**

```yaml
# monitoring/certificate-alerts.yaml
# Prometheus alerts for certificate expiry

apiVersion: v1
kind: ConfigMap
metadata:
  name: certificate-alerts
  namespace: monitoring
data:
  alerts.yaml: |
    groups:
    - name: certificates
      interval: 1m
      rules:
      
      # Alert: Certificate expiring soon
      - alert: CertificateExpiringSoon
        expr: |
          certmanager_certificate_expiration_timestamp_seconds - time() < 7 * 24 * 60 * 60
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Certificate {{ $labels.name }} expiring soon"
          description: |
            Certificate {{ $labels.name }} in namespace {{ $labels.namespace }}
            will expire in less than 7 days.
            Current expiry: {{ $value | humanizeDuration }}
      
      # Alert: Certificate failed to renew
      - alert: CertificateRenewalFailed
        expr: |
          certmanager_certificate_ready_status{condition="False"} == 1
        for: 15m
        labels:
          severity: critical
        annotations:
          summary: "Certificate {{ $labels.name }} renewal failed"
          description: |
            Certificate {{ $labels.name }} in namespace {{ $labels.namespace }}
            failed to renew. Check cert-manager logs.
      
      # Alert: Certificate not ready
      - alert: CertificateNotReady
        expr: |
          certmanager_certificate_ready_status{condition="True"} == 0
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "Certificate {{ $labels.name }} not ready"
          description: |
            Certificate {{ $labels.name }} in namespace {{ $labels.namespace }}
            is not ready. Check certificate status and cert-manager logs.
```

**Certificate Renewal Testing:**

```bash
#!/bin/bash
# test-certificate-renewal.sh - Force certificate renewal to test automation

set -euo pipefail

CERT_NAME="api-vibecoded"
NAMESPACE="production"

echo "Testing certificate renewal for ${CERT_NAME}..."

# Delete existing certificate secret (forces renewal)
kubectl delete secret ${CERT_NAME}-tls -n ${NAMESPACE}

# Wait for cert-manager to recreate certificate
echo "Waiting for certificate to be issued..."
kubectl wait --for=condition=ready certificate/${CERT_NAME} \
  -n ${NAMESPACE} \
  --timeout=5m

# Verify new certificate
echo "New certificate issued!"
kubectl get secret ${CERT_NAME}-tls -n ${NAMESPACE} -o jsonpath='{.data.tls\.crt}' | \
  base64 -d | \
  openssl x509 -noout -dates

echo "Certificate renewal test successful!"
```

#### Why This Matters

**Business Rationale:**

1. **Trust & Conversion:** Browsers show "Not Secure" warning for HTTP sites. Studies show 85% of users abandon sites with security warnings. HTTPS removes this barrier.

2. **SEO Impact:** Google's HTTPS ranking signal affects search position. Sites with HTTPS rank higher than identical HTTP sites. For SaaS products, organic search is major acquisition channel—can't afford SEO penalty.

3. **Compliance Requirements:** 
   - **PCI-DSS Requirement 4.1:** "Use strong cryptography and security protocols to safeguard sensitive cardholder data during transmission"
   - **HIPAA Security Rule:** "Transmission Security" requires encryption of ePHI in transit
   - **SOC 2:** TLS encryption is control evidence for Trust Service Criteria CC6.7

4. **Feature Access:** Modern browser APIs require HTTPS:
   - Service Workers (for PWAs)
   - WebRTC (for video calls)
   - Geolocation API
   - Camera/microphone access
   - HTTP/2 and HTTP/3 (performance benefits)

5. **Operational Simplicity:** cert-manager automation means zero operational overhead for certificate management. Pre-cert-manager: engineers spent 2-4 hours per quarter managing certificate renewals. Post-cert-manager: zero time (automated).

**Technical Rationale:**

1. **Defense Against Man-in-the-Middle (MITM):** Without TLS:
   - User → [Attacker intercepts] → Your server
   - Attacker sees passwords, session tokens, API keys, user data
   
   With TLS:
   - User → [Encrypted tunnel] → Your server
   - Attacker sees encrypted gibberish, can't decrypt without private key

2. **Certificate Pinning:** Advanced security measure where client validates server's certificate matches expected value. Prevents MITM even if attacker has valid certificate from trusted CA. Useful for mobile apps.

3. **Perfect Forward Secrecy (PFS):** TLS 1.3 provides PFS—even if attacker records encrypted traffic and later steals private key, they can't decrypt past traffic. Each session uses ephemeral keys.

4. **Zero-Downtime Renewals:** cert-manager renews certificates 30 days before expiry. New certificate is issued and stored in Kubernetes Secret. Ingress controller automatically reloads. Users never see expired certificate.

5. **Rate Limiting Protection:** Let's Encrypt has rate limits:
   - 50 certificates per registered domain per week
   - 5 duplicate certificates per week
   
   cert-manager handles this by:
   - Reusing certificates when possible
   - Renewing at optimal time (30 days before expiry)
   - Using staging issuer for testing (unlimited rate)

#### What Happens If You Don't

**If you use HTTP (no TLS):**
- **Attack Example (2017):** Equifax breach started with unencrypted internal traffic. Attacker gained initial access, moved laterally, intercepted unencrypted database connections, stole 147 million records.
- **User Impact:** Modern browsers show "Not Secure" in address bar. 85% of users don't proceed past warning.
- **Compliance Failure:** Immediate failure of PCI-DSS audit (cannot process payments). HIPAA fine risk ($100–$50,000 per violation).

**If you manage certificates manually:**
- **Expired Certificate Incident:** 2020, Microsoft Teams went down for 2 hours due to expired certificate. Affected 12 million users. Root cause: manual renewal process, engineer forgot to renew.
- **Operational Burden:** Engineer spends 2–4 hours per quarter per certificate. At 10 certificates: 20–40 hours/year. With cert-manager: 0 hours (automated).
- **Outage Risk:** Manual process means human error. Forgotten renewal = expired cert = site down = lost revenue.

**If you use self-signed certificates:**
- **Browser Warnings:** All browsers show scary "Your connection is not private" warning. Users must click "Advanced" → "Proceed to site (unsafe)". Conversion rate drops to near zero.
- **API Clients Break:** Most API clients reject self-signed certificates by default. Users must add `--insecure` flag or disable certificate validation (trains bad security habits).

**If you use long-lived certificates (1+ year):**
- **Compromise Window:** If private key is compromised, attacker can impersonate your site for entire certificate validity period. With 90-day certs (Let's Encrypt), compromise window is 90 days max.
- **Rotation Discipline:** Short-lived certificates force automation. Long-lived certificates lead to "set it and forget it" mentality, then panic when renewal date arrives.

#### Resources Required

**Skills:**
- TLS/HTTPS fundamentals (1 day learning)
- Kubernetes basics (already covered in Chapter 2)
- DNS management (1 day if unfamiliar)

**Tools:**
- **cert-manager:** Free, open-source
- **Let's Encrypt:** Free, automated CA
- **DNS provider:** AWS Route53, Cloudflare, Google Cloud DNS (for DNS-01 validation)

**Time Investment:**
- cert-manager installation: 1 hour
- ClusterIssuer configuration: 2 hours
- Certificate creation: 1 hour
- Testing and verification: 2 hours
- Monitoring setup: 1 hour
- **Total:** 1 day

**Costs:**
- **Let's Encrypt certificates:** Free
- **DNS API calls:** ~$0.50/month (AWS Route53: $0.40 per hosted zone + $0.50 per million queries)
- **Alternative (commercial certificates):** $50–$500/year per certificate

**Ongoing:**
- Certificate monitoring: Automated (Prometheus alerts)
- Certificate renewal: Automated (cert-manager)
- Time spent: 0 hours/month (fully automated)

#### Verification Checklist

Before production:

- [ ] **cert-manager installed** (`kubectl get pods -n cert-manager`)
- [ ] **ClusterIssuers created** (`kubectl get clusterissuer`)
- [ ] **Staging issuer tested** (request test certificate, verify provisioning)
- [ ] **Production issuer working** (request real certificate, verify in browser)
- [ ] **Wildcard certificates provisioned** (for *.vibecoded.com)
- [ ] **Certificates automatically renewing** (test with cert 30 days from expiry)
- [ ] **Certificate monitoring active** (Prometheus alerts configured)
- [ ] **Certificate expiry notifications** (alerts going to Slack/PagerDuty)
- [ ] **DNS-01 validation working** (for wildcard certs)
- [ ] **HTTP-01 validation working** (for single-domain certs)

**Testing Procedures:**

```bash
# Test 1: Verify cert-manager can issue certificate
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: test-cert
  namespace: default
spec:
  secretName: test-cert-tls
  issuerRef:
    name: letsencrypt-staging
    kind: ClusterIssuer
  commonName: test.vibecoded.com
  dnsNames:
  - test.vibecoded.com
EOF

# Wait and check
kubectl wait --for=condition=ready certificate/test-cert --timeout=5m
kubectl describe certificate test-cert

# Clean up
kubectl delete certificate test-cert

# Test 2: Verify certificate in browser
# 1. Deploy test ingress with TLS
# 2. Visit https://test.vibecoded.com in browser
# 3. Check certificate details (click lock icon)
# 4. Verify issuer is Let's Encrypt
# 5. Verify expiry date is ~90 days from now

# Test 3: Test automatic renewal
# See test-certificate-renewal.sh above

# Test 4: Verify cert-manager metrics
kubectl port-forward -n cert-manager svc/cert-manager 9402:9402 &
curl -s http://localhost:9402/metrics | grep certmanager_certificate
```

---

### 3.2 Ingress Controllers and Load Balancing

**Duration:** 2 days | **Priority:** High | **Prerequisites:** 3.1 TLS certificates working

#### Overview

An ingress controller is Kubernetes' traffic cop—it routes external HTTP/HTTPS requests to the correct internal services. Think of it as the front door to your cluster: users access vibecoded.com, ingress controller examines the request (hostname, path), and routes to the appropriate service (API, app, etc.).

**Why ingress matters for Vibecoded:**
- **Single IP for multiple services:** One load balancer IP serves api.vibecoded.com, app.vibecoded.com, user-123.vibecoded.com
- **TLS termination:** Ingress handles HTTPS, services inside cluster use HTTP (simpler)
- **Path-based routing:** /api/* → API service, /static/* → CDN, /admin/* → Admin service
- **Virtual hosting:** Different domains route to different services (multi-tenancy)

**Ingress Controller Options:**

| Controller | Best For | Pros | Cons |
|------------|----------|------|------|
| **NGINX** | General purpose | Battle-tested, feature-rich, most popular | Basic L7 features |
| **Traefik** | Cloud-native, dynamic | Auto-config, built-in dashboard, Let's Encrypt | Newer, smaller community |
| **HAProxy** | Performance | Fastest, advanced load balancing | Complex config |
| **AWS ALB** | AWS-native | Native AWS integration, WAF support | AWS-only, slower updates |
| **Envoy/Istio** | Service mesh | Full mesh capabilities, observability | Complex, heavyweight |

**Recommendation for Vibecoded:** Start with **NGINX Ingress Controller** (most mature, largest community, works everywhere). Add **Traefik** later if you need advanced routing (regex paths, middleware chains).

This section implements:
- NGINX Ingress Controller with production configs
- Multiple ingress resources (API, app, user subdomains)
- Load balancing strategies (round-robin, least-connections, IP hash)
- Session affinity (sticky sessions)
- Request/response modification (headers, rewrites)
- Rate limiting per client IP/path

#### How to Implement

**Step 1: Install NGINX Ingress Controller**

```bash
#!/bin/bash
# install-nginx-ingress.sh - Install NGINX Ingress Controller

set -euo pipefail

echo "Installing NGINX Ingress Controller..."

# Add NGINX Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --version 4.9.0 \
  --set controller.replicaCount=3 \
  --set controller.nodeSelector."kubernetes\.io/os"=linux \
  --set controller.admissionWebhooks.enabled=true \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-cross-zone-load-balancing-enabled"="true" \
  --set controller.metrics.enabled=true \
  --set controller.metrics.serviceMonitor.enabled=true \
  --set controller.podAnnotations."prometheus\.io/scrape"="true" \
  --set controller.podAnnotations."prometheus\.io/port"="10254" \
  --set defaultBackend.enabled=true \
  --set controller.config.use-forwarded-headers="true" \
  --set controller.config.compute-full-forwarded-for="true" \
  --set controller.config.use-proxy-protocol="false"

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

echo "NGINX Ingress Controller installed!"

# Get load balancer IP/hostname
echo ""
echo "Load Balancer endpoint:"
kubectl get service ingress-nginx-controller \
  -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}{.status.loadBalancer.ingress[0].ip}'
echo ""
```

**Step 2: Create Ingress Resources**

```yaml
# kubernetes/ingress/api-ingress.yaml
# Ingress for API service (api.vibecoded.com)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    # TLS certificate from cert-manager
    cert-manager.io/cluster-issuer: "letsencrypt-production"
    
    # NGINX-specific annotations
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    
    # Rate limiting (100 requests per minute per IP)
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-burst-multiplier: "5"
    
    # Request size limit (10MB)
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    
    # Timeouts
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "5"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    
    # CORS headers (if API called from browser)
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://app.vibecoded.com"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-credentials: "true"
    
    # Security headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
spec:
  ingressClassName: nginx
  
  tls:
  - hosts:
    - api.vibecoded.com
    secretName: api-vibecoded-tls  # Certificate from cert-manager
  
  rules:
  - host: api.vibecoded.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vibecoded-api
            port:
              number: 80

---
# kubernetes/ingress/app-ingress.yaml
# Ingress for frontend application (app.vibecoded.com)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-production"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    
    # Enable compression for frontend assets
    nginx.ingress.kubernetes.io/enable-compression: "true"
    
    # Cache static assets
    nginx.ingress.kubernetes.io/configuration-snippet: |
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
      }
      
      # Don't cache HTML (for SPA routing)
      location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
      }
    
    # Security headers
    nginx.ingress.kubernetes.io/server-snippet: |
      more_set_headers "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.vibecoded.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.vibecoded.com; frame-ancestors 'none'";
      more_set_headers "X-Frame-Options: DENY";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
      more_set_headers "Permissions-Policy: geolocation=(), microphone=(), camera=()";
spec:
  ingressClassName: nginx
  
  tls:
  - hosts:
    - app.vibecoded.com
    secretName: app-vibecoded-tls
  
  rules:
  - host: app.vibecoded.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vibecoded-frontend
            port:
              number: 80

---
# kubernetes/ingress/user-apps-ingress.yaml
# Ingress for user-generated apps (*.user-{id}.vibecoded.com)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: user-apps-ingress
  namespace: user-apps
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-production"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    
    # Stricter rate limiting for user apps (prevent abuse)
    nginx.ingress.kubernetes.io/limit-rps: "50"
    
    # Isolate user apps (different backend per user)
    nginx.ingress.kubernetes.io/configuration-snippet: |
      # Extract user ID from subdomain
      # Format: something.user-123.vibecoded.com → 123
      set $user_id "";
      if ($host ~* "\.user-(\d+)\.vibecoded\.com$") {
        set $user_id $1;
      }
      
      # Route to user-specific service
      proxy_pass http://user-app-$user_id;
spec:
  ingressClassName: nginx
  
  tls:
  - hosts:
    - "*.vibecoded.com"
    secretName: user-subdomain-tls
  
  rules:
  - host: "*.user-*.vibecoded.com"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: user-app-router  # Service that handles routing
            port:
              number: 80

---
# kubernetes/ingress/admin-ingress.yaml
# Ingress for admin panel (admin.vibecoded.com)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: admin-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-production"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    
    # IP whitelist (only allow from office/VPN)
    nginx.ingress.kubernetes.io/whitelist-source-range: "203.0.113.0/24,198.51.100.0/24"
    
    # Basic auth as additional layer
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: admin-basic-auth
    nginx.ingress.kubernetes.io/auth-realm: "Admin Access - Authentication Required"
    
    # Very strict rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "10"
spec:
  ingressClassName: nginx
  
  tls:
  - hosts:
    - admin.vibecoded.com
    secretName: admin-vibecoded-tls
  
  rules:
  - host: admin.vibecoded.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vibecoded-admin
            port:
              number: 80
```

**Step 3: Advanced Routing Patterns**

```yaml
# kubernetes/ingress/api-advanced-routing.yaml
# Advanced routing with path-based rules

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-advanced
  namespace: production
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    # Example: /api/v1/users → /users (removes /api/v1 prefix)
spec:
  ingressClassName: nginx
  rules:
  - host: api.vibecoded.com
    http:
      paths:
      # Public API (no auth required)
      - path: /api/v1/public(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: public-api
            port:
              number: 80
      
      # Authenticated API
      - path: /api/v1/auth(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: auth-api
            port:
              number: 80
      
      # Admin API (stricter rate limits)
      - path: /api/v1/admin(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: admin-api
            port:
              number: 80
      
      # Webhooks (different timeout settings)
      - path: /webhooks(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: webhook-handler
            port:
              number: 80

---
# kubernetes/ingress/canary-ingress.yaml
# Canary deployment with traffic splitting

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-canary
  namespace: production
  annotations:
    # Route 10% of traffic to canary version
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
    
    # Alternative: Route based on header
    # nginx.ingress.kubernetes.io/canary-by-header: "X-Canary"
    # nginx.ingress.kubernetes.io/canary-by-header-value: "always"
    
    # Alternative: Route based on cookie
    # nginx.ingress.kubernetes.io/canary-by-cookie: "canary"
spec:
  ingressClassName: nginx
  rules:
  - host: api.vibecoded.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vibecoded-api-canary  # Canary version
            port:
              number: 80
```

**Step 4: Session Affinity (Sticky Sessions)**

```yaml
# kubernetes/ingress/sticky-sessions.yaml
# Enable sticky sessions for stateful applications

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sticky-ingress
  namespace: production
  annotations:
    # Enable cookie-based session affinity
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/affinity-mode: "persistent"
    nginx.ingress.kubernetes.io/session-cookie-name: "INGRESSCOOKIE"
    nginx.ingress.kubernetes.io/session-cookie-expires: "172800"  # 48 hours
    nginx.ingress.kubernetes.io/session-cookie-max-age: "172800"
    nginx.ingress.kubernetes.io/session-cookie-path: "/"
    nginx.ingress.kubernetes.io/session-cookie-change-on-failure: "true"
    nginx.ingress.kubernetes.io/session-cookie-samesite: "Lax"
    nginx.ingress.kubernetes.io/session-cookie-conditional-samesite-none: "true"
spec:
  # ... rest of ingress config
```

**Step 5: Custom Error Pages**

```yaml
# kubernetes/ingress/custom-errors.yaml
# Custom error pages for better UX

apiVersion: v1
kind: ConfigMap
metadata:
  name: custom-error-pages
  namespace: ingress-nginx
data:
  404.html: |
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Page Not Found</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </body>
    </html>
  
  503.html: |
    <!DOCTYPE html>
    <html>
    <head>
      <title>503 - Service Temporarily Unavailable</title>
      <meta http-equiv="refresh" content="30">
    </head>
    <body>
      <h1>503 - Service Temporarily Unavailable</h1>
      <p>We're performing maintenance. Please try again in a few minutes.</p>
    </body>
    </html>

---
# Mount custom error pages in default backend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: default-backend
  namespace: ingress-nginx
spec:
  template:
    spec:
      containers:
      - name: default-backend
        image: registry.k8s.io/defaultbackend-amd64:1.5
        volumeMounts:
        - name: error-pages
          mountPath: /www
      volumes:
      - name: error-pages
        configMap:
          name: custom-error-pages
```

**Step 6: Monitoring & Metrics**

```yaml
# monitoring/ingress-dashboard.yaml
# Grafana dashboard for NGINX Ingress metrics

apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-dashboard
  namespace: monitoring
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "NGINX Ingress Controller",
        "panels": [
          {
            "title": "Requests per Second",
            "targets": [{
              "expr": "sum(rate(nginx_ingress_controller_requests[5m])) by (host)"
            }]
          },
          {
            "title": "Request Duration (p95)",
            "targets": [{
              "expr": "histogram_quantile(0.95, sum(rate(nginx_ingress_controller_request_duration_seconds_bucket[5m])) by (host, le))"
            }]
          },
          {
            "title": "Response Codes",
            "targets": [{
              "expr": "sum(rate(nginx_ingress_controller_requests[5m])) by (status)"
            }]
          },
          {
            "title": "Ingress Controller Memory",
            "targets": [{
              "expr": "process_resident_memory_bytes{job='ingress-nginx-controller-metrics'}"
            }]
          },
          {
            "title": "SSL Certificate Expiry",
            "targets": [{
              "expr": "(nginx_ingress_controller_ssl_expire_time_seconds - time()) / 86400"
            }]
          },
          {
            "title": "Upstream Response Time",
            "targets": [{
              "expr": "histogram_quantile(0.95, sum(rate(nginx_ingress_controller_response_duration_seconds_bucket[5m])) by (host, le))"
            }]
          }
        ]
      }
    }

---
# monitoring/ingress-alerts.yaml
# Prometheus alerts for ingress issues

apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-alerts
  namespace: monitoring
data:
  alerts.yaml: |
    groups:
    - name: ingress
      interval: 1m
      rules:
      
      # Alert: High 5xx error rate
      - alert: IngressHighErrorRate
        expr: |
          sum(rate(nginx_ingress_controller_requests{status=~"5.."}[5m])) by (host)
          /
          sum(rate(nginx_ingress_controller_requests[5m])) by (host)
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate on {{ $labels.host }}"
          description: "{{ $labels.host }} has {{ $value | humanizePercentage }} 5xx errors"
      
      # Alert: High latency
      - alert: IngressHighLatency
        expr: |
          histogram_quantile(0.95,
            sum(rate(nginx_ingress_controller_request_duration_seconds_bucket[5m])) by (host, le)
          ) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.host }}"
          description: "P95 latency is {{ $value }}s"
      
      # Alert: SSL certificate expiring
      - alert: IngressCertificateExpiringSoon
        expr: |
          (nginx_ingress_controller_ssl_expire_time_seconds - time()) / 86400 < 14
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "SSL certificate for {{ $labels.host }} expiring soon"
          description: "Certificate expires in {{ $value }} days"
      
      # Alert: Ingress controller down
      - alert: IngressControllerDown
        expr: |
          up{job="ingress-nginx-controller-metrics"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Ingress controller is down"
          description: "No metrics from ingress controller"
```

#### Why This Matters

**Business Rationale:**

1. **Cost Savings:** Single load balancer for all services:
   - Without ingress: 10 services × $20/month per load balancer = $200/month
   - With ingress: 1 load balancer = $20/month
   - **Savings: $180/month = $2,160/year**

2. **Performance:** NGINX is optimized for high throughput:
   - Handles 10,000+ requests/second per instance
   - Connection pooling to backends
   - HTTP/2 and HTTP/3 support (faster page loads)
   - Compression (gzip, brotli) reduces bandwidth costs

3. **Flexibility:** Change routing without changing code:
   - A/B testing: Route 10% to new version
   - Blue-green: Switch traffic instantly
   - Maintenance: Route to maintenance page without deployment

4. **DDoS Protection:** Rate limiting at ingress level:
   - Per-IP rate limits (100 req/min)
   - Per-path rate limits (/api/expensive-query limited to 10 req/min)
   - Prevents single client from overwhelming backend

**Technical Rationale:**

1. **TLS Termination:** Ingress handles HTTPS, backends use HTTP:
   - Simpler backend code (no TLS libraries needed)
   - Easier to rotate certificates (one place, not 10 services)
   - Better performance (TLS overhead at edge, not every service)

2. **Connection Pooling:** Ingress maintains persistent connections to backends:
   ```
   Without pooling:
   1,000 client requests → 1,000 backend connections (overhead)
   
   With pooling:
   1,000 client requests → 10 persistent connections to backends (efficient)
   ```

3. **Load Balancing Algorithms:**
   - **Round-robin (default):** Fair distribution, good for stateless
   - **Least connections:** Route to backend with fewest active connections
   - **IP hash:** Same client IP always goes to same backend (sticky without cookies)

4. **Health Checks:** Ingress only routes to healthy backends:
   - Passive health checks: Mark backend unhealthy after N consecutive errors
   - Active health checks: Periodically probe backends
   - Automatic removal from rotation when unhealthy

#### What Happens If You Don't

**If you use NodePort (no ingress):**
- Every service needs separate port (30000–32767 range)
- Users access awkward URLs: http://vibecoded.com:30001
- No TLS termination (must handle in every service)
- No unified rate limiting or security headers

**If you use separate LoadBalancers per service:**
- Cost: $20/month × 10 services = $200/month
- Management overhead: 10 load balancers to monitor
- No unified logging (logs scattered across 10 load balancers)
- No traffic splitting (each load balancer independent)

**If you skip rate limiting:**
- Attack: Single malicious client sends 10,000 req/sec
- Without rate limiting: All requests reach backend → backend overloaded → service down for everyone
- With rate limiting: After 100 req/sec, ingress returns 429 Too Many Requests → backend protected

**If you skip security headers:**
- **XSS attack:** Attacker injects script, steals user session
- Without headers: Browser executes attacker's script
- With Content-Security-Policy: Browser blocks script execution

**If you skip session affinity for stateful apps:**
- User request → Pod A (session created in memory)
- Next request → Pod B (no session, user logged out)
- User experience: Constantly logged out, forms lose data
- With session affinity: All user's requests go to same pod → stable session

#### Resources Required

**Skills:**
- HTTP/HTTPS fundamentals (1 day if needed)
- Ingress concepts (1 day learning)
- NGINX configuration basics (1 day practice)

**Tools:**
- **NGINX Ingress Controller:** Free, open-source
- **Load balancer (AWS NLB/ALB):** ~$20/month

**Time Investment:**
- NGINX Ingress installation: 1 hour
- Basic ingress resources: 2 hours
- Advanced routing (canary, sticky sessions): 2 hours
- Rate limiting and security: 2 hours
- Monitoring setup: 2 hours
- Testing and verification: 2 hours
- **Total:** 1.5 days

**Costs:**
- **Load balancer:** $20/month (AWS NLB) or $25/month (AWS ALB)
- **Data transfer:** $0.09/GB out (AWS)
- **Total:** ~$50–$100/month depending on traffic

**Ongoing:**
- Monitor ingress metrics: Automated (Prometheus/Grafana)
- Update ingress configs: As needed when adding services
- Time spent: 1–2 hours/month

#### Verification Checklist

- [ ] **Ingress controller installed** (`kubectl get pods -n ingress-nginx`)
- [ ] **Load balancer created** (AWS NLB/ALB provisioned)
- [ ] **DNS pointing to load balancer** (api.vibecoded.com → LB IP)
- [ ] **TLS working** (https://api.vibecoded.com shows valid certificate)
- [ ] **HTTP redirects to HTTPS** (http:// → https://)
- [ ] **Rate limiting working** (test with load generator, verify 429 responses)
- [ ] **Security headers present** (curl -I, check X-Frame-Options, CSP, etc.)
- [ ] **Session affinity working** (if enabled, same user hits same pod)
- [ ] **Custom error pages** (visit non-existent URL, see custom 404)
- [ ] **Metrics exposed** (Prometheus scraping ingress-nginx metrics)
- [ ] **Alerts configured** (high error rate, high latency alerts)

**Testing Procedures:**

```bash
# Test 1: Verify ingress routes traffic
curl -H "Host: api.vibecoded.com" http://<LOAD_BALANCER_IP>/health
# Expected: 200 OK from backend service

# Test 2: Verify TLS termination
curl -I https://api.vibecoded.com/health
# Expected: 200 OK, valid TLS certificate

# Test 3: Verify HTTP redirects to HTTPS
curl -I http://api.vibecoded.com/health
# Expected: 301 or 302 redirect to https://

# Test 4: Test rate limiting
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.vibecoded.com/health
done
# Expected: First 100 return 200, rest return 429

# Test 5: Verify security headers
curl -I https://api.vibecoded.com
# Expected: X-Frame-Options, X-Content-Type-Options, etc. present

# Test 6: Load test
hey -n 10000 -c 100 https://api.vibecoded.com/health
# Monitor ingress metrics during test

# Test 7: Verify custom error page
curl https://api.vibecoded.com/nonexistent-path
# Expected: Custom 404 page HTML
```

---

Due to token limits approaching, I'll create a condensed version of the remaining sections (3.3 Rate Limiting, 3.4 DDoS Protection, 3.5 Content Security Policy) in a follow-up file to complete Chapter 3.

Would you like me to:
1. **Complete Chapter 3 now** with sections 3.3–3.5 in a new file
2. **Pause here** and let you review 3.1–3.2 first
3. **Continue to Chapter 4** (whatever comes next in Part I)

Which would you prefer?