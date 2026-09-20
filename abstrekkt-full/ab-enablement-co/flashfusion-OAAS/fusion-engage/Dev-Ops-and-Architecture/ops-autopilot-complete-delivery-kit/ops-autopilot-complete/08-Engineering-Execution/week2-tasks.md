# Week 2 Tasks — Approval Engine + Security

> **Audience:** ENG | **Phase:** MVP

---

## Day 1–2: Approval Engine

- [ ] Implement policy matching (nested rule evaluation, first-match-wins)
- [ ] Build POST /approvals/{id}/decision endpoint
- [ ] Implement approval creation with configurable TTL
- [ ] Implement resume/fail logic on approval decision
- [ ] Build TTL expiry cron job (runs every 5 min)
- [ ] Implement reminder notification (TTL - 10 min)
- [ ] Implement escalation to next approver in chain
- [ ] Implement auto-reject at TTL + 30 min
- [ ] Test: 50 approval cycles (approve, deny, expire, escalate, chain)
- **Gate:** <500ms policy match latency, all 50 cycles pass

## Day 3–4: Secrets Vault + Rotation

- [ ] Implement secret_registry table with RLS
- [ ] Build POST /secrets/{id}/rotate endpoint
- [ ] Implement n8n vault integration guide (AES-256 at rest)
- [ ] Implement secret hash registration flow
- [ ] Implement rotation tracking cron (check next_rotation_due)
- [ ] Build error sanitization layer (regex-based secret stripping)
- [ ] Test: No plaintext secrets in any log output (grep verification)
- [ ] Test: Rotate 5 secrets, verify hash update + audit entry
- **Gate:** Zero plaintext in logs after sanitization

## Day 5: Immutable Audit Log

- [ ] Implement audit_log table (REVOKE UPDATE/DELETE)
- [ ] Implement HMAC-SHA256 signing of entries
- [ ] Implement chain hashing (link each entry to previous)
- [ ] Build GET /audit endpoint (paginated, filterable)
- [ ] Implement audit event triggers for all Run/Step/Approval operations
- [ ] Test: Attempt UPDATE → denied. Attempt DELETE → denied.
- [ ] Test: Verify HMAC on 100 entries (all valid)
- [ ] Test: Break chain → detect tampering
- **Gate:** Tamper detection verified, PDF compliance report export working
