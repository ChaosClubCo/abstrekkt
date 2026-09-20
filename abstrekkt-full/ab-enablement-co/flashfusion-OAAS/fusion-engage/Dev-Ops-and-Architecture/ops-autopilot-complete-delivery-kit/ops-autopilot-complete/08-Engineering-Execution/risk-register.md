# Risk Register — Technical Risks

> **Audience:** LEAD | **Phase:** ALL

---

| # | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|---|------|-----------|--------|-------|------------|-------|--------|
| R1 | Azure AD integration delays (undocumented API behavior) | Medium | High | 12 | 2-day buffer in Week 3, test with 100 users, document throttle handling | Eng Lead | Open |
| R2 | Supabase RLS multi-tenant isolation gap | Low | Critical | 10 | Automated test suite (50 queries daily), RLS review in every migration PR | Eng Lead | Open |
| R3 | n8n Docker instability on customer infrastructure | Medium | Medium | 9 | Docker Compose template, pre-flight checklist, health monitoring | Support | Open |
| R4 | Approval timeout causing workflow abandonment | Medium | Medium | 9 | Configurable TTL, multi-channel notifications, escalation chain | Product | Open |
| R5 | Security vulnerability discovered in beta | Low | Critical | 10 | Pre-launch security checklist, responsible disclosure process, hot-fix <30min | Security | Open |
| R6 | Timeline slip (20–30% likely) | High | Medium | 12 | 4 weeks minimum (6 realistic), 1-week buffer, scope negotiation if needed | Eng Lead | Open |
| R7 | n8n concurrency limits at scale | Medium | High | 12 | Cluster deployment for Enterprise, load test at Week 15 | Eng Lead | Open |
| R8 | Cloudflare Tunnel reliability | Low | High | 8 | Auto-reconnect (3 attempts), fallback health check, customer-side monitoring | Eng Lead | Open |
| R9 | Single-point-of-failure in engineering knowledge | High | High | 16 | Document everything in this kit, pair programming, hire Eng #2 by Q3 | VP Eng | Open |
| R10 | Beta customer adoption slower than projected | Medium | Medium | 9 | Aggressive feedback loop, save offers, weekly syncs, adjustable timeline | Product | Open |

---

## Risk Response Plans

**R1 (Azure AD):** If Week 3 Day 2 and Azure AD connector not working → descope to Okta-only for MVP, add Azure AD in Week 5.

**R5 (Security vuln):** If critical finding → pause beta, deploy fix, conduct post-mortem, extend beta by 2 weeks.

**R6 (Timeline):** If Week 3 behind → cut VPN workflow from MVP, shift to Beta. Core 3 workflows are non-negotiable.

**R9 (SPOF):** This is the highest-risk item. Mitigation: comprehensive documentation (this kit), recorded Loom walkthroughs, structured onboarding plan for Eng #2.
