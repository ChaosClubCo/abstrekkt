# Week 4 Tasks — Workflows + Testing

> **Audience:** ENG | **Phase:** MVP

---

## Day 1–2: Ticket Routing Workflow

- [ ] Build 6-step workflow in n8n (extract → classify → match → capacity → route → notify)
- [ ] Implement keyword classifier (5 categories)
- [ ] Implement agent pool matching (category + availability)
- [ ] Implement escalation logic (capacity exceeded → approval)
- [ ] Configure approval policy for escalation step
- [ ] Test: Route 100 tickets across all categories
- [ ] Verify: P95 latency <5s, <2% classification errors
- **Gate:** 100 tickets routed successfully

## Day 3–4: Password Reset + Onboarding Workflows

**Password Reset (3 steps):**
- [ ] Implement OTP generation + SMS delivery
- [ ] Implement Azure AD password reset + MFA sync
- [ ] Implement secure credential delivery (Slack ephemeral message)
- [ ] Test: 50 resets, <2 min end-to-end, 0 OTP failures
- **Gate:** All 50 pass

**Onboarding (7 steps):**
- [ ] Build full workflow: Azure AD → email → Okta → hardware → Slack → Teams → notify
- [ ] Configure multi-approval: manager + HR
- [ ] Implement idempotency checks at each step
- [ ] Test: 5 parallel onboardings with no race conditions
- [ ] Verify: <30 min end-to-end (including approval wait)
- **Gate:** 5 parallel onboardings succeed, no duplicates

## Day 5: Load Testing + Documentation

- [ ] Load test: All 3 workflows under 10 concurrent runs each
- [ ] Verify: No failures, queue handles load, Redis stable
- [ ] Generate API docs (OpenAPI → Postman collection)
- [ ] Write deployment guide (customer-facing)
- [ ] Write operational runbook (internal)
- [ ] Create sales demo script (5-min walkthrough)
- [ ] Final review: all MVP acceptance criteria passing
- **Gate:** Production-ready for 2 pilot customers
