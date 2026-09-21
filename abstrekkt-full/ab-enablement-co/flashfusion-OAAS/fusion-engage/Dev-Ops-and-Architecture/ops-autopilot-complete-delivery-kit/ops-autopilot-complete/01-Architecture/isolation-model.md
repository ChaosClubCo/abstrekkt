# Isolation Model — Multi-Tenant Security

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 1)

---

## Four Layers of Isolation

### Layer 1: Network
- Each n8n in customer's private network (VPN/VPC/on-prem)
- Cloudflare Tunnel: outbound-only, no inbound ports
- mTLS between n8n and control plane (per-customer certificates)
- WAF: rate limit per source IP, geo-blocking
- No customer-to-customer network path exists

### Layer 2: Data (RLS)
All customer-scoped tables have Row-Level Security:
```sql
CREATE POLICY customer_isolation ON [table]
  FOR ALL USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
```
**Testing:** 50 cross-tenant queries across 5 test customers → all blocked.

**What control plane stores per customer:** Run IDs + status, step names + timing, approval decisions, audit events, secret hashes. **Never:** PII, API keys, business data, ticket contents.

### Layer 3: Execution
Each customer: dedicated n8n Docker (or cluster), dedicated Redis, dedicated Bull queue. No shared state. Cost: ~$20/mo per instance (minimal).

### Layer 4: Observability
All metrics/logs/traces tagged with `customer_id`. Grafana dashboards auto-filter. LogQL queries auto-inject customer filter from JWT. No cross-customer data visible.

## INT Support Access

**Default:** Aggregated anonymous metrics only.
**With consent:** Customer grants 4-hour read-only JWT. All actions logged. Customer can revoke anytime. INT cannot: view secrets, modify data, trigger workflows, delete audit entries.

## Compliance Mapping

| Control | Implementation |
|---------|---------------|
| SOC2 CC6.1 (Logical access) | RLS + JWT + RBAC |
| SOC2 CC6.3 (Authorization) | Role-based JWT claims |
| GDPR Art. 25 (By design) | Zero-knowledge, RLS |
| GDPR Art. 32 (Security) | TLS 1.3, mTLS, AES-256 |
