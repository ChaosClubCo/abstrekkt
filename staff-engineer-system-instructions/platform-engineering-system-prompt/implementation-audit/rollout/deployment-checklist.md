# Deployment & Verification Checklist

> Per-user / per-wave deploy steps + verification, reconstructed from the source's
> immediate / 24h / 7d / monthly checklist and hardened with admin-console
> enforcement and a secrets guard. Use alongside `rollout-plan.md`.

## Pre-flight (per wave, before enabling users)

- [ ] Audit gates for this wave PASS (`../audit/readiness-audit-checklist.md`)
- [ ] RBAC entitlements set in admin console for the wave's roles **[enforced, not prompt]**
- [ ] Connectors for the wave classified by data tier and owner-assigned
- [ ] Role section(s) prepared from `../prompts/role-section-pattern.md`
- [ ] Versioned copy of current baseline + role prompts saved (for rollback)
- [ ] **Secrets guard:** no API keys, tokens, or internal URLs in any distributed
      doc or prompt — confirmed

## Per-user setup (Immediate, ~5 min)

- [ ] User assigned to the correct role in the admin console
- [ ] Org baseline confirmed active — verification prompt:
      `"What is the current system-prompt baseline version and my role?"`
      Expected: baseline version + correct role + correct department
- [ ] Quick reference for the user's role bookmarked
- [ ] Memory enabled/disabled per role policy (confirm, don't assume)

## First 24 hours

- [ ] Platform setup for surfaces the user actually uses: Web / Mobile / Desktop /
      Claude Code (CLI) / API
- [ ] API users: key issued **through the proper secrets channel** (never pasted in
      chat/docs); rate-limit + error-handling guidance reviewed
- [ ] Connector authorization tested for the user's role (only the connectors RBAC
      allows should appear)
- [ ] Core features exercised: web search, artifacts, file upload (and code
      execution only if the role permits)
- [ ] Prompting guide Part 1 read; one framework tried

## First 7 days

- [ ] Memory reviewed once; stale/irrelevant entries removed
- [ ] Approved extensions/integrations configured (IDE, Slack, automation) — each
      verified against the integration data-tier list
- [ ] Self-assessment completed (user can confirm setup works)
- [ ] Escalation paths understood (who to contact, what triggers a gate)

## Monthly maintenance (steady state — this is a recurring control)

- [ ] **Memory audit (1st of month):** review "top of mind," archive completed
      projects, remove entries >90 days old
- [ ] **Entitlement review:** RBAC export reviewed; departed users removed; role
      changes reflected
- [ ] **Connector health:** each connector still works; **expired credentials
      rotated through the secrets channel** (not in docs); changed URLs updated
- [ ] **Skills refresh:** new skills reviewed/approved; risky skills gated
- [ ] **Audit-log spot check:** confirm interactions are appearing where claimed
      (verifies the source's "logged to Sentry" assertion stays true)

## Verification matrix (what "deployed" means)

| Layer | How to verify | Authoritative source |
|-------|---------------|----------------------|
| Baseline prompt active | Ask the version/role question | User transcript |
| RBAC enforced | Try a disallowed feature/connector → blocked | Admin console export |
| Memory policy | Memory present/absent per role | Admin console |
| Connector access | Only allowed connectors authorize | Admin console |
| Logging | Interaction appears in log sink | Log system + admin audit log |

## Rollback (deployment-level)

If verification fails for a user or wave:
1. Revoke the affected entitlements in the admin console (real rollback).
2. Restore the previous versioned baseline/role prompt.
3. Log the failure + cause in `../audit/audit-evidence-template.md`.
4. Re-run the failed checklist items before re-enabling.

User data is **not** deleted by rollback; use admin data-deletion controls only for
a genuine privacy incident (see `../governance/zdr-retention-reality.md`).

## Acceptance criteria (deployment)

- [ ] Verification matrix all green for the user/wave
- [ ] No secrets present in any distributed artifact
- [ ] Rollback path tested at least once (revoke + restore + verify)
