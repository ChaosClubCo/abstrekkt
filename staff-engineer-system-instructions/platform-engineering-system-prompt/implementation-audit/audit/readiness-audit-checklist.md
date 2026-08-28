# Claude Enterprise Readiness Audit — 12-Category Checklist

> Source: reconstructed from the FlashFusion audit (uuid `6b4ef510`). The source ran
> these 12 categories and **self-assigned 98/100 (A+)**. This version removes the
> self-grade. Each item is **PASS / PARTIAL / FAIL against evidence** — record the
> proof in `audit-evidence-template.md`. "I wrote a doc about it" is not a PASS;
> the control being live and verifiable is.

## How to score

- **PASS** — control exists, is enforced where it matters (admin console, not just
  a prompt), and you can point at evidence.
- **PARTIAL** — documented or partially deployed; gaps listed.
- **FAIL** — absent or unverifiable.

A category passes only if every **[gate]** item passes. A wave in the rollout plan
cannot start until its required categories pass (see `../rollout/rollout-plan.md`).

---

## 1. Baseline System Preferences
- [ ] Org-wide system-prompt baseline exists and is version-stamped **[gate]**
- [ ] A health-check command verifies the baseline is active
      (e.g., ask: "What is the current system-prompt baseline version?")
- [ ] Baseline is applied via admin console or a controlled distribution method,
      not copy-paste folklore **[gate]**
- [ ] Tone/format defaults documented (concision, citation expectations)

## 2. Role Context
- [ ] Each user mapped to a role from the taxonomy **[gate]**
- [ ] Role definition includes responsibilities, allowed features, escalation
      triggers
- [ ] Security-sensitive roles (InfoSec, Finance, Legal) flagged for stricter
      defaults **[gate]**
- [ ] Role data reconciled with the real org chart (not the starter 14)

## 3. Memory System
- [ ] Memory enabled per policy (on/off by role) **[gate]**
- [ ] What-to-store / what-not-to-store guidance published
- [ ] Memory audit cadence scheduled (monthly: review, archive >90d, remove stale)
- [ ] "Memory isolation between roles" claim **verified empirically**, not assumed
      (see caveat in `../governance/zdr-retention-reality.md`) **[gate]**

## 4. Available Skills
- [ ] Approved skill list published per role
- [ ] Unapproved/experimental skills gated or disabled **[gate]**
- [ ] Skill usage reviewed monthly (underused / risky)

## 5. MCP Connectors
- [ ] Every connector classified by data tier before enablement **[gate]**
- [ ] Connector→role mapping enforced in admin console **[gate]**
- [ ] No connector secrets/keys stored in prompts or docs **[gate]**
- [ ] Connector inventory current (the source listed ~23; verify live count + URLs)
- [ ] Each connector has a named owner

## 6. Security Guardrails
- [ ] RBAC enforced at admin layer (prompts are defense-in-depth only) **[gate]**
- [ ] Prompt-injection / data-exfiltration guidance in baseline prompt
- [ ] Escalation gates defined for high-risk actions (prod changes, customer data,
      contracts, financial commitments) **[gate]**
- [ ] Compliance framing (SOC 2 / HIPAA / GDPR / PCI-DSS) mapped to **real control
      owners + attestation dates**, not just named **[gate]**

## 7. Prompting Frameworks
- [ ] Documented frameworks (e.g., R-I-S-E, F-L-O-W, Perspective Mirror) available
- [ ] Request-format prefixes defined and explained ([PROD], [SPIKE], [SKEPTIC], …)
- [ ] Worked examples per framework

## 8. Workload / Product Context
- [ ] Org/product-specific context captured (the source captured FlashFusion:
      Next.js / tRPC / Supabase) **without leaking secrets** **[gate]**
- [ ] Sensitive-context prompts (e.g., RLS audits) use sanitized baselines

## 9. Quick Reference Guide
- [ ] One-page per-role quick reference exists
- [ ] Includes emergency/verification commands and escalation paths **[gate]**

## 10. Platform-Specific Setup
- [ ] Setup documented for each surface in use: Web, Mobile, Desktop, Claude Code
      (CLI), API **[gate]**
- [ ] API key management guidance is **policy only — no real keys in docs** **[gate]**
- [ ] Rate-limit / error-handling guidance present for API/CLI users

## 11. Extensions & Integrations
- [ ] Approved extensions/integrations listed (browser, IDE, Slack, automation,
      CI/CD)
- [ ] Each integration's data flow classified by tier **[gate]**
- [ ] Webhook/automation patterns reviewed for secret leakage **[gate]**

## 12. Interactive Prompting / Enablement
- [ ] Self-serve enablement material exists (guide or interactive hub)
- [ ] Self-assessment for users to confirm competence
- [ ] Training tracks defined for IC / manager / executive (see rollout plan)

---

## Scoring summary (fill in)

| # | Category | PASS/PARTIAL/FAIL | Gate items pass? | Evidence ref |
|---|----------|-------------------|------------------|--------------|
| 1 | Baseline System Preferences | | | |
| 2 | Role Context | | | |
| 3 | Memory System | | | |
| 4 | Available Skills | | | |
| 5 | MCP Connectors | | | |
| 6 | Security Guardrails | | | |
| 7 | Prompting Frameworks | | | |
| 8 | Workload/Product Context | | | |
| 9 | Quick Reference Guide | | | |
| 10 | Platform-Specific Setup | | | |
| 11 | Extensions & Integrations | | | |
| 12 | Interactive Prompting/Enablement | | | |

**Readiness rule (replaces the source's "98/100 A+"):**
- *Pilot-ready* = categories 1, 2, 5, 6 all PASS (gates).
- *Org-wide-ready* = all 12 PASS.
- Do not assert a numeric/letter grade. Cite the table + evidence log instead.
