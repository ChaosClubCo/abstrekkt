# Security Review Checklist — Pre-Launch Audit

> **Audience:** ENG, LEAD
> **Phase:** MVP (Week 4) and RC (Week 15)
> **Last Updated:** 2025-02-13

---

## Usage

This checklist is executed twice:
1. **Week 4 (MVP launch):** All items marked `MVP` must pass before pilot customers go live.
2. **Week 15 (GA launch):** All items must pass before GA. Engage external security firm for items marked `EXT`.

**Scoring:** PASS / FAIL / N/A. Any FAIL on a `CRITICAL` item blocks launch.

---

## 1. Authentication & Authorization

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 1.1 | JWT tokens expire within 24 hours | CRITICAL | MVP | ☐ |
| 1.2 | JWT signing key is stored in environment variable (not code) | CRITICAL | MVP | ☐ |
| 1.3 | JWT signing uses RS256 or HS256 (not `none` algorithm) | CRITICAL | MVP | ☐ |
| 1.4 | All API endpoints require valid JWT (no anonymous access) | CRITICAL | MVP | ☐ |
| 1.5 | Role-based permissions enforced at API layer | CRITICAL | MVP | ☐ |
| 1.6 | RLS policies active on all customer-scoped tables | CRITICAL | MVP | ☐ |
| 1.7 | Cross-tenant access blocked (50 test queries, 0 leaks) | CRITICAL | MVP | ☐ |
| 1.8 | INT support access requires customer consent (time-limited) | HIGH | MVP | ☐ |
| 1.9 | Expired/revoked tokens rejected immediately | HIGH | MVP | ☐ |
| 1.10 | OAuth2 state parameter validated (CSRF protection) | HIGH | GA | ☐ |

---

## 2. Data Protection

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 2.1 | No plaintext secrets in control plane database | CRITICAL | MVP | ☐ |
| 2.2 | No plaintext secrets in any log output (grep verification) | CRITICAL | MVP | ☐ |
| 2.3 | No plaintext secrets in error messages (50 error test) | CRITICAL | MVP | ☐ |
| 2.4 | Error sanitization layer strips all secret patterns | CRITICAL | MVP | ☐ |
| 2.5 | TLS 1.3 enforced on all external connections | CRITICAL | MVP | ☐ |
| 2.6 | mTLS between n8n and control plane | CRITICAL | MVP | ☐ |
| 2.7 | Database encrypted at rest (Supabase default) | HIGH | MVP | ☐ |
| 2.8 | n8n vault uses AES-256 encryption at rest | HIGH | MVP | ☐ |
| 2.9 | Backup data encrypted | HIGH | GA | ☐ |
| 2.10 | PII not stored in control plane (architecture review) | HIGH | MVP | ☐ |

---

## 3. Audit Trail Integrity

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 3.1 | UPDATE permission revoked on audit_log table | CRITICAL | MVP | ☐ |
| 3.2 | DELETE permission revoked on audit_log table | CRITICAL | MVP | ☐ |
| 3.3 | HMAC signatures valid on all audit entries (sample 100) | CRITICAL | MVP | ☐ |
| 3.4 | Chain hash verification passes (full chain test) | HIGH | MVP | ☐ |
| 3.5 | Tamper attempt detected (modify entry, verify signature fails) | HIGH | MVP | ☐ |
| 3.6 | All privileged actions generate audit entries (coverage test) | HIGH | MVP | ☐ |
| 3.7 | Hourly cryptographic anchoring operational | MEDIUM | GA | ☐ |
| 3.8 | Compliance reports generate correctly (monthly automation) | MEDIUM | GA | ☐ |

---

## 4. Approval Engine

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 4.1 | No workflow step executes privileged action without approval | CRITICAL | MVP | ☐ |
| 4.2 | TTL expiry correctly triggers escalation/rejection | HIGH | MVP | ☐ |
| 4.3 | TTL minimum enforced (≥60 seconds, server-side) | HIGH | MVP | ☐ |
| 4.4 | Duplicate approval decisions return 409 (not re-executed) | HIGH | MVP | ☐ |
| 4.5 | No-match policy fallback defaults to REQUIRE_APPROVAL | CRITICAL | MVP | ☐ |
| 4.6 | Context snapshot is immutable after creation | HIGH | MVP | ☐ |
| 4.7 | Approval chain sequential execution verified (2+ approvers) | HIGH | MVP | ☐ |
| 4.8 | 50 approval cycle test passes (see [approval-gates.md](./approval-gates.md)) | HIGH | MVP | ☐ |

---

## 5. Input Validation & Injection Defense

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 5.1 | All API inputs validated against JSON schema | CRITICAL | MVP | ☐ |
| 5.2 | `removeAdditional: true` enabled (unexpected fields stripped) | HIGH | MVP | ☐ |
| 5.3 | SQL injection test (10 payloads, 0 successes) | CRITICAL | MVP | ☐ |
| 5.4 | Prompt injection test (50 payloads, 0 actions executed) | CRITICAL | MVP | ☐ |
| 5.5 | XSS test (10 payloads in context fields, all sanitized) | HIGH | MVP | ☐ |
| 5.6 | Request body size limit enforced (100KB max) | MEDIUM | MVP | ☐ |
| 5.7 | No free-form tool calls in any execution path | CRITICAL | MVP | ☐ |
| 5.8 | Connector inputs only accept schema-validated fields | CRITICAL | MVP | ☐ |

---

## 6. Network Security

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 6.1 | Cloudflare WAF active with rate limiting rules | HIGH | MVP | ☐ |
| 6.2 | No n8n instance publicly accessible (network scan) | CRITICAL | MVP | ☐ |
| 6.3 | Cloudflare Tunnel configured (no open inbound ports) | HIGH | MVP | ☐ |
| 6.4 | Rate limits enforced per customer tier | HIGH | MVP | ☐ |
| 6.5 | DDoS protection active (Cloudflare) | MEDIUM | MVP | ☐ |
| 6.6 | Network egress filtering on n8n (allowlist connector domains) | MEDIUM | GA | ☐ |
| 6.7 | Penetration test completed (external firm) | HIGH | GA/EXT | ☐ |

---

## 7. Secret Management

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 7.1 | Secrets stored only in n8n vault (never in control plane) | CRITICAL | MVP | ☐ |
| 7.2 | Secret rotation tracking operational | HIGH | MVP | ☐ |
| 7.3 | Rotation alerts fire at 14/7/1 day thresholds | MEDIUM | GA | ☐ |
| 7.4 | Overdue secret rotation escalation works | MEDIUM | GA | ☐ |
| 7.5 | No secrets in environment variables of control plane | HIGH | MVP | ☐ |
| 7.6 | HMAC signing key rotated quarterly | HIGH | GA | ☐ |
| 7.7 | JWT signing key rotation procedure documented | HIGH | GA | ☐ |

---

## 8. Operational Security

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 8.1 | Kill-switch tested (activation + recovery) | CRITICAL | MVP | ☐ |
| 8.2 | Kill-switch activates in <30 seconds | HIGH | MVP | ☐ |
| 8.3 | Incident response procedure documented and drilled | HIGH | MVP | ☐ |
| 8.4 | PagerDuty alerts configured for all critical metrics | HIGH | MVP | ☐ |
| 8.5 | On-call rotation established | HIGH | GA | ☐ |
| 8.6 | Database backup/restore tested (RTO <1hr, RPO <5min) | HIGH | GA | ☐ |
| 8.7 | Dependency versions pinned (no floating versions) | MEDIUM | MVP | ☐ |
| 8.8 | npm audit shows 0 critical vulnerabilities | HIGH | MVP | ☐ |
| 8.9 | Docker base image scanned (no critical CVEs) | HIGH | GA | ☐ |

---

## 9. Compliance Readiness

| # | Check | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 9.1 | Data Processing Agreement (DPA) template ready | HIGH | GA | ☐ |
| 9.2 | Privacy policy published | HIGH | GA | ☐ |
| 9.3 | Sub-processor list documented | MEDIUM | GA | ☐ |
| 9.4 | Data export procedure tested (GDPR Art. 15/20) | HIGH | GA | ☐ |
| 9.5 | Data deletion procedure tested (GDPR Art. 17) | HIGH | GA | ☐ |
| 9.6 | Breach notification procedure (72hr GDPR) documented | HIGH | GA | ☐ |
| 9.7 | SOC2 control evidence documented | MEDIUM | GA | ☐ |

---

## Summary Scorecard

| Category | Critical Items | High Items | Medium Items | Total |
|----------|---------------|------------|--------------|-------|
| Auth & Authz | 7 | 3 | 0 | 10 |
| Data Protection | 6 | 4 | 0 | 10 |
| Audit Trail | 3 | 3 | 2 | 8 |
| Approval Engine | 2 | 6 | 0 | 8 |
| Input Validation | 4 | 2 | 2 | 8 |
| Network Security | 1 | 4 | 2 | 7 |
| Secret Management | 1 | 4 | 2 | 7 |
| Operational Security | 1 | 5 | 3 | 9 |
| Compliance | 0 | 4 | 3 | 7 |
| **TOTAL** | **25** | **35** | **14** | **74** |

**MVP Launch Gate:** All 25 CRITICAL items + all HIGH items marked `MVP` must PASS.
**GA Launch Gate:** All 74 items must PASS. External pen test (item 6.7) required.
