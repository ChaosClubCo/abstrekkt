---
name: ssl-certificates
description: name: ssl-certificates description: Certificate management, renewal automation, and PKI infrastructure. Use when configuring, building, or troubleshooting AI agent workflows.
---

# SSL Certificates

---
name: ssl-certificates
description: Certificate management, renewal automation, and PKI infrastructure
version: 1.0.0
category: infrastructure
tags: [ssl, tls, certificates, pki, security, encryption]
related_skills: [secrets-management, network-configuration, cdn-configuration]
---

## Overview

SSL Certificates management encompasses the lifecycle of digital certificates including provisioning, deployment, renewal, and revocation. This skill covers implementing certificate automation using tools like Let's Encrypt, cert-manager, and enterprise PKI solutions.

Effective certificate management prevents outages from expired certificates while ensuring secure encrypted communications. Modern approaches emphasize automation to eliminate manual renewal processes and reduce security risks.

### Key Principles

1. **Automation First**: Automate all certificate lifecycle operations
2. **Short Validity**: Prefer shorter certificate lifespans with automation
3. **Monitoring**: Alert before certificates expire
4. **Centralized Management**: Track all certificates in one place
5. **Defense in Depth**: Use certificate transparency and CAA records

## When to Use This Skill

### Appropriate Scenarios

- Setting up HTTPS for web applications
- Implementing cert-manager in Kubernetes
- Managing internal PKI infrastructure
- Automating certificate renewal
- Configuring mutual TLS (mTLS)
- Wildcard certificate deployment
- Certificate monitoring and alerting
- Multi-domain certificate management

### When to Consider Alternatives

- **CDN-managed certificates**: Use cdn-configuration skill
- **Cloud-native services**: May have built-in certificate handling
- **Simple static sites**: Platform-provided certificates
- **Internal services only**: Consider service mesh mTLS

## Core Processes

### 1. Let's Encrypt with Certbot

```bash
#!/bin/bash
# Certbot automated certificate management

# Install certbot
apt update && apt install -y certbot python3-certbot-nginx

# Obtain certificate with HTTP challenge
certbot certonly \
  --nginx \
  --non-interactive \
  --agree-tos \
  --email admin@example.com \
  --domains example.com,www.example.com \
  --redirect \
  --staple-ocsp

# Obtain wildcard certificate with DNS challenge
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  --non-interactive \
  --agree-tos \
  --email admin@example.com \
  --domains "*.example.com,example.com" \
  --preferred-challenges dns-01

# Deploy hook for certificate deployment
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
nginx -t && systemctl reload nginx
# Notify monitoring
curl -X POST "https://monitoring.example.com/webhook/cert-renewed" \
  -H "Content-Type: application/json" \
  -d '{"domain": "'"$RENEWED_DOMAINS"'", "timestamp": "'"$(date -Iseconds)"'"}'
EOF
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Test renewal
certbot renew --dry-run

# Set up automatic renewal (already configured by certbot)
systemctl enable --now certbot.timer

echo "Certificate automation configured"
```

### 2. Kubernetes cert-manager

```yaml
# cert-manager installation and configuration
---
apiVersion: v1
kind: Namespace
metadata:
  name: cert-manager
---
# ClusterIssuer for Let's Encrypt Production
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      # HTTP-01 challenge for ingress
      - http01:
          ingress:
            class: nginx
        selector:
          dnsZones:
            - "example.com"
      # DNS-01 challenge for wildcards
      - dns01:
          cloudflare:
            email: admin@example.com
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token
        selector:
          dnsZones:
            - "example.com"

---
# ClusterIssuer for internal CA
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: internal-ca
spec:
  ca:
    secretName: internal-ca-key-pair

---
# Certificate for web application
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-example-com
  namespace: production
spec:
  secretName: api-example-com-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: api.example.com
  dnsNames:
    - api.example.com
    - api-v2.example.com
  duration: 2160h    # 90 days
  renewBefore: 360h  # 15 days before expiry
  privateKey:
    algorithm: ECDSA
    size: 256
  usages:
    - server auth
    - client auth

---
# Wildcard certificate
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard-example-com
  namespace: production
spec:
  secretName: wildcard-example-com-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: "*.example.com"
  dnsNames:
    - "*.example.com"
    - example.com
  duration: 2160h
  renewBefore: 360h

---
# Ingress with automatic TLS
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.example.com
      secretName: api-example-com-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

### 3. Internal PKI Setup

```bash
#!/bin/bash
# Internal PKI with OpenSSL

PKI_DIR="/etc/pki/internal"
mkdir -p ${PKI_DIR}/{certs,crl,newcerts,private,csr}
chmod 700 ${PKI_DIR}/private
touch ${PKI_DIR}/index.txt
echo 1000 > ${PKI_DIR}/serial
echo 1000 > ${PKI_DIR}/crlnumber

# OpenSSL configuration
cat > ${PKI_DIR}/openssl.cnf << 'EOF'
[ca]
default_ca = CA_default

[CA_default]
dir               = /etc/pki/internal
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand
private_key       = $dir/private/ca.key
certificate       = $dir/certs/ca.crt
crlnumber         = $dir/crlnumber
crl               = $dir/crl/ca.crl
crl_extensions    = crl_ext
default_crl_days  = 30
default_md        = sha256
name_opt          = ca_default
cert_opt          = ca_default
default_days      = 365
preserve          = no
policy            = policy_loose

[policy_loose]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[req]
default_bits        = 4096
distinguished_name  = req_distinguished_name
string_mask         = utf8only
default_md          = sha256
x509_extensions     = v3_ca

[req_distinguished_name]
countryName                     = Country Name
stateOrProvinceName             = State
localityName                    = Locality
organizationName                = Organization
organizationalUnitName          = Organizational Unit
commonName                      = Common Name
emailAddress                    = Email

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[v3_intermediate_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[server_cert]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "Internal PKI Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[client_cert]
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "Internal PKI Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection
EOF

# Generate Root CA
openssl genrsa -aes256 -out ${PKI_DIR}/private/ca.key 4096
chmod 400 ${PKI_DIR}/private/ca.key

openssl req -config ${PKI_DIR}/openssl.cnf \
  -key ${PKI_DIR}/private/ca.key \
  -new -x509 -days 7300 -sha256 -extensions v3_ca \
  -out ${PKI_DIR}/certs/ca.crt \
  -subj "/C=US/ST=California/L=San Francisco/O=Example Inc/OU=IT/CN=Example Root CA"

# Generate Intermediate CA
openssl genrsa -aes256 -out ${PKI_DIR}/private/intermediate.key 4096
chmod 400 ${PKI_DIR}/private/intermediate.key

openssl req -config ${PKI_DIR}/openssl.cnf \
  -new -sha256 \
  -key ${PKI_DIR}/private/intermediate.key \
  -out ${PKI_DIR}/csr/intermediate.csr \
  -subj "/C=US/ST=California/L=San Francisco/O=Example Inc/OU=IT/CN=Example Intermediate CA"

openssl ca -config ${PKI_DIR}/openssl.cnf \
  -extensions v3_intermediate_ca -days 3650 -notext -md sha256 \
  -in ${PKI_DIR}/csr/intermediate.csr \
  -out ${PKI_DIR}/certs/intermediate.crt

# Create certificate chain
cat ${PKI_DIR}/certs/intermediate.crt ${PKI_DIR}/certs/ca.crt > ${PKI_DIR}/certs/ca-chain.crt

echo "Internal PKI initialized"
```


## References
- `references/4-certificate-monitoring.md` — 4. Certificate Monitoring
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
