---
name: security-scanning-framework
description: Automated security scanning with SAST, DAST, SCA, and secrets detection. Integrates with CI/CD pipelines. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Security Scanning Framework

## Overview

## SAST (Static Analysis)

**ESLint Security Plugin**
```json
{
  "extends": ["plugin:security/recommended"],
  "plugins": ["security"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-eval-with-expression": "error"
  }
}
```

**Semgrep**
```yaml
# .semgrep.yml
rules:
  - id: sql-injection
    patterns:
      - pattern: $DB.query("..." + $INPUT + "...")
    message: Possible SQL injection
    severity: ERROR
    languages: [javascript, typescript]
```

```bash
semgrep --config=auto --json --output=report.json
```

## DAST (Dynamic Analysis)

**OWASP ZAP**
```bash
docker run -v $(pwd):/zap/wrk/:rw \
  -t owasp/zap2docker-stable \
  zap-baseline.py -t https://your-app.com -J zap-report.json
```

## SCA (Dependency Scanning)

**npm audit**
```bash
npm audit --json > audit-report.json
npm audit fix
```

**Snyk**
```bash
snyk test --json > snyk-report.json
snyk monitor  # Continuous monitoring
```

**Dependabot (GitHub)**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

## Secrets Detection

**TruffleHog**
```bash
docker run -it --rm trufflesecurity/trufflehog:latest \
  github --repo https://github.com/user/repo
```

**git-secrets**
```bash
git secrets --install
git secrets --register-aws
git secrets --scan
```

**Pre-commit Hook**
```bash
#!/bin/bash
# .git/hooks/pre-commit

if git secrets --scan; then
  exit 0
else
  echo "❌ Secrets detected! Commit blocked."
  exit 1
fi
```

## Container Scanning

**Trivy**
```bash
trivy image --severity HIGH,CRITICAL myapp:latest
trivy fs --security-checks vuln,config .
```

**Dockerfile Best Practices**
```dockerfile
# Use specific versions
FROM node:18.17.0-alpine

# Run as non-root
USER node

# Multi-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
```

## CI/CD Integration

```yaml
# .github/workflows/security.yml
name: Security Scans

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
      
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
```

## Compliance Scanning

**CIS Benchmarks**
```bash
# Docker Bench for Security
docker run --rm --net host --pid host --userns host --cap-add audit_control \
  -v /var/lib:/var/lib -v /var/run/docker.sock:/var/run/docker.sock \
  docker/docker-bench-security
```

## Quality Gates
- ✅ No HIGH/CRITICAL vulnerabilities in dependencies
- ✅ No secrets committed to repository
- ✅ SAST scan passes with zero security issues
- ✅ Container images scanned and patched
- ✅ Security scans run on every commit

## Resources
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Semgrep Rules: https://semgrep.dev/r
- Snyk Docs: https://docs.snyk.io/
