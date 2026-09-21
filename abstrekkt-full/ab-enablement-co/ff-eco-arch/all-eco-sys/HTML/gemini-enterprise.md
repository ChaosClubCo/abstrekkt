# Gemini Enterprise - Vertex AI & Compliance

**Last Updated:** December 2025  
**Scope:** Vertex AI platform, SOC 2/HIPAA/GDPR compliance, VPC-SC, CMEK, provisioned throughput

---

## Vertex AI Platform

### Key Features

- **Managed infrastructure** (no API key management)
- **SLAs** (99.9% uptime guarantee)
- **VPC integration** (private networking)
- **IAM controls** (fine-grained permissions)
- **Compliance** (SOC 2, HIPAA, GDPR, ISO 27001)
- **Provisioned throughput** (guaranteed QPS)

### Enable Vertex AI

```bash
gcloud services enable aiplatform.googleapis.com
```

### Python SDK (Vertex AI)

```python
from vertexai.generative_models import GenerativeModel

model = GenerativeModel("gemini-3-flash")
response = model.generate_content("Your prompt")
print(response.text)
```

---

## Compliance & Security

### SOC 2 Type II
- Security controls audited annually
- Incident response procedures
- Change management policies

### HIPAA
- BAA available for healthcare customers
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Audit logs (90-day retention minimum)
- Access controls (RBAC)

### GDPR
- Data residency controls (EU, US, Asia regions)
- Right to erasure (delete user data)
- Data processing agreements (DPA)
- Breach notification (72-hour SLA)

### ISO 27001
- Information security management
- Risk assessment procedures
- Continuous monitoring

---

## Enterprise Features

### VPC Service Controls (VPC-SC)
- Network perimeter for API access
- Block exfiltration of data
- Private Google Access (no public internet)

### Customer-Managed Encryption Keys (CMEK)
- Bring your own encryption keys
- Control key rotation, revocation
- Cloud KMS integration

### Provisioned Throughput
- Reserved capacity (guaranteed QPS)
- Predictable latency
- No rate limiting
- Custom pricing

### Custom Quotas
- Higher rate limits (>2,000 req/min)
- Dedicated IP ranges
- Priority support

---

## Pricing (Vertex AI)

Contact Google Cloud sales for enterprise pricing (custom contracts, volume discounts).

**Typical enterprise setup:**
- Provisioned throughput: $X/hour + standard token costs
- CMEK: No additional cost
- VPC-SC: Included
- Premium support: $X/month per seat

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Vertex AI supports SOC 2, HIPAA, GDPR compliance
**SOURCE:** [cloud.google.com/vertex-ai/docs/quotas](https://cloud.google.com/vertex-ai/docs/quotas)
**STATUS:** Verified December 2025
