# Week 3 Tasks — Connectors + n8n

> **Audience:** ENG | **Phase:** MVP

---

## Day 1–2: Azure AD Connector

- [ ] Create n8n credential type for Microsoft OAuth2
- [ ] Implement create_user action (display_name, mail, department, title)
- [ ] Implement disable_user action
- [ ] Implement assign_group / remove_group actions
- [ ] Implement reset_password action
- [ ] Add error handling: 409 (duplicate), 429 (rate limit), 401 (auth expired)
- [ ] Add idempotency: check user exists before create
- [ ] Test: Create 100 users with 0 duplicates on retry
- **Gate:** All 5 actions working, error handling verified

## Day 3–4: Slack + Jira Connectors

- [ ] Slack: Implement send_message, send_modal (approval UI), update_message
- [ ] Slack: Build approval modal template (Block Kit)
- [ ] Slack: Implement approval callback handler (button clicks → POST /approvals/decision)
- [ ] Jira: Implement create_ticket, get_ticket, update_ticket, transition_status, add_comment
- [ ] Jira: Add error handling for rate limits and auth failures
- [ ] Test: Send 20 approval modals, receive 20 decisions
- [ ] Test: Create 50 Jira tickets, update status on each
- **Gate:** All 3 connectors integrated, <2s per operation

## Day 5: n8n Provisioning

- [ ] Create Docker Compose template (n8n + Redis + Promtail)
- [ ] Create .env.example with all required variables
- [ ] Implement auto-import of workflow definitions on first boot
- [ ] Implement connector configuration from control plane catalog
- [ ] Implement Cloudflare Tunnel setup script
- [ ] Test: Provision new n8n instance from scratch in <10 minutes
- [ ] Document: step-by-step deployment guide for customers
- **Gate:** Clean install → health check pass → workflows imported in <10 min
