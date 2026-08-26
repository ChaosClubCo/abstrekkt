# Beta Onboarding Checklist (7-Day Process)

> **Audience:** ENG, SALES | **Phase:** Beta

---

## Day 1: Kickoff
- [ ] Kickoff call (60 min): product demo, architecture overview, expectations
- [ ] Sign NDA + Data Processing Agreement
- [ ] Assign POCs: customer IT admin, INT support engineer, INT success manager
- [ ] Collect infrastructure details: Docker version, OS, memory, network topology
- [ ] Collect identity details: Azure AD tenant ID, Okta org URL, Slack workspace
- [ ] Schedule daily check-in (15 min) for first week

## Days 2–3: Infrastructure Setup
- [ ] Customer provisions VM/container host for n8n (4GB RAM, 20GB disk)
- [ ] Customer installs Docker + Docker Compose
- [ ] INT provides Docker Compose template + environment variables
- [ ] Customer runs `docker-compose up -d` to deploy n8n + Redis
- [ ] Customer opens outbound HTTPS (443) for Cloudflare Tunnel
- [ ] INT configures Cloudflare Tunnel + mTLS certificates
- [ ] Customer creates service accounts: Azure AD app registration, Slack bot, Jira API token
- [ ] Customer provides API keys (entered directly into n8n vault — INT never sees them)
- [ ] INT verifies n8n health check passes from control plane

## Day 4: Configuration + Testing
- [ ] INT imports workflow definitions into n8n
- [ ] INT configures connectors (Azure AD, Slack, Jira) in n8n
- [ ] INT configures approval policies in control plane
- [ ] End-to-end test: trigger each workflow → verify all steps complete
- [ ] 60-min training session: how to use Teams/Slack triggers, how to approve, how to view dashboard
- [ ] Customer IT admin tests independently: creates test ticket, resets test password

## Day 5: Soft Launch
- [ ] Enable 1 workflow for 10% of users (e.g., Ticket Routing for 1 team)
- [ ] 24-hour monitoring (INT watches dashboard closely)
- [ ] Address any issues found during soft launch

## Days 6–7: Full Launch
- [ ] Enable all workflows for all users
- [ ] Weekly sync scheduled (every Tuesday 2pm ET)
- [ ] Baseline metrics captured: runs/day, success rate, approval time
- [ ] Customer satisfaction check (quick call or Slack message)
- [ ] Transition from daily to weekly check-ins

## Onboarding Success Criteria
- [ ] All purchased workflows active and executing
- [ ] Success rate >95% in first week
- [ ] No unresolved critical/high issues
- [ ] Customer IT admin can independently troubleshoot basic issues
- [ ] Customer knows how to escalate to INT support
