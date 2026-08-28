# FlashFusion Internal Platform-Engineering System Prompt + Multi-CLI Installer (ZIP_SPEC)

> Reconstructed from source chat
> `System-prompt-audit-and-expansion-roadmap` (uuid `ce154e77…`, batch-0001).
> The source audited and rebuilt a tiered engineering system prompt for
> **FlashFusion internal platform tooling** (Node/AWS/Supabase/k8s/Microsoft/Claude
> Enterprise/GitHub/Vercel, SOC2 + PCI), then designed a **Replit multi-CLI
> installer** that ships to **AWS ECS**. This package consolidates both.

## 1. Executive Summary

Two coupled deliverables for a 50–200-engineer internal platform org:

1. **A tiered system prompt** (`system-prompt/flashfusion-system-prompt.md`) that
   governs how an AI coding assistant behaves for FlashFusion engineers — a security
   floor, a response grammar, a decision framework, and **paved roads** (golden
   self-service patterns), with SOC2/PCI compliance and full logging/audit-trail
   baked in. The stack defaults are FlashFusion-native (Next.js/tRPC/Supabase on
   Node/AWS).
2. **A Replit multi-CLI installer** (`replit-installer/`) that stands up Claude
   Code CLI + Gemini CLI + Codex CLI in a Replit runtime with multi-tenant RBAC,
   a ChatGPT MCP connector, and audit logging shipped to **S3 + Sentry** — then a
   **Phase-2 AWS ECS** production path (Terraform, RDS, ALB, RLS, JWT rotation).

## 2. The system prompt — four tiers

| Tier | Purpose |
|------|---------|
| **TIER 0 — The Contract** | Security floor (validation, error handling, TLS+auth, no hallucinations) + the guarantee structure for non-trivial answers |
| **TIER 1 — Response Grammar** | TL;DR → Analogy → Map → Example → Definition → Deep-dive; communication rules ("I cannot verify this", Cause→Fix→Retry, never echo secrets) |
| **TIER 2 — Decision Framework** | Priority order (security > compliance > clarity > tools > brevity), auto-clarify questions, FlashFusion stack defaults, tool-checking workflow |
| **TIER 3 — Paved Roads** | Golden self-service patterns (e.g. "Add a Node.js service") with CI quality gates, k8s/Helm, Vault, RBAC, audit logging |

## 3. Production Deliverables (file tree)

```
flashfusion-platform-engineering-system-prompt/
├── README.md                              (this file)
├── system-prompt/
│   └── flashfusion-system-prompt.md       the full tiered prompt (T0–T3) — signature artifact
├── paved-roads/
│   └── add-node-service.md                golden path: new Node service → prod
├── devex/
│   └── guardrails.md                      pre-commit secret scan, RLS tests, coverage gates, CI
├── compliance/
│   └── soc2-pci-mapping.md                SOC2 Type II + PCI-DSS control mapping
├── runbooks/
│   └── incident-runbooks.md               P0–P3 incident procedures + postmortem template
├── replit-installer/
│   └── README.md                          multi-CLI installer: personas, ChatGPT MCP, audit→S3/Sentry
└── aws-deploy/
    └── terraform-ecs.md                   Phase-2: ECS + RDS + ALB + RLS + JWT rotation
```

## 4. Implementation Considerations

- **Adopt the prompt incrementally.** TIER 0 (security floor) is non-negotiable
  day one; paved roads (TIER 3) can land per-pattern as you standardize them.
- **The installer is two phases.** Phase 1 (Replit spike) proves the multi-CLI +
  MCP + audit pipeline cheaply; Phase 2 (AWS ECS) is the production transition.
  Don't ship the Replit spike as production.
- **Personas/variants are expected.** The installer is meant for FlashFusion's team
  first with future B2B-client resale — design persona configs as data, not forks.

## 5. Performance / Security Notes

- **Security floor is absolute:** input validation, error handling
  (Cause→Fix→Retry), TLS+auth, RLS on every table/query, no hallucinations even
  in spike mode.
- **Secrets:** pre-commit hook blocks AWS/GitHub/Stripe/private keys; never echo
  secrets; env vars + placeholders only.
- **Audit trail:** all CLI executions logged → S3 + Sentry; logs retained per
  policy; "black-box flight recorder" — immutable, encrypted, authorized access
  only.
- **Targets (from source):** API p95 < 500ms, error rate < 1%, **zero critical
  security findings** before production.

## 6. Validation Checklist

- [ ] TIER 0 security floor enforced (no skipping validation/auth/error handling)
- [ ] Coverage gate ≥80% (branches/functions/lines) enforced in CI
- [ ] Pre-commit secret scan blocks known key patterns
- [ ] RLS verified: user A cannot read user B's rows; no bypass via direct API
- [ ] Audit logs ship to S3 + Sentry and are immutable
- [ ] Load test passes at 500 concurrent users within p95 < 500ms
- [ ] Claims check completed (below)

## 7. Recommended Next Steps

1. Land TIER 0–2 of the system prompt as the team default; socialize the
   analogies and communication rules.
2. Stand up the Replit spike: multi-CLI + ChatGPT MCP + audit→S3/Sentry.
3. Build the first paved road end-to-end ("Add a Node service") and dogfood it.
4. Execute the 3–4 week AWS ECS transition (staging → load test → harden → prod).

## 8. Security Review (summary)

- **Tenant isolation:** RLS on every table; multi-tenant RBAC in the installer.
- **AuthN/Z:** JWT with rotation; SSO/RBAC for engineers.
- **Auditability:** immutable audit trail (S3 + Sentry); 2-year retention noted.
- **Compliance:** SOC2 Type II + PCI-DSS controls mapped (see compliance doc).
- **Supply chain:** AI-generated code treated as untrusted; CI gates + review.

## 9. CLAIMS CHECK

- **Verified (in source):** the four-tier prompt structure and its contents
  (security floor, analogy formula, communication rules, priority order,
  auto-clarify, FlashFusion stack defaults), the paved-road pattern, the DevEx
  guardrails (pre-commit secret scan, RLS tests, ≥80% coverage), SOC2/PCI
  mapping, P0–P3 runbooks, and the Replit→AWS-ECS installer plan (multi-CLI,
  ChatGPT MCP, audit→S3/Sentry, Terraform/RDS/ALB/JWT).
- **Inferred (this kit):** consolidation into one package, the file layout, and
  any prose smoothing between the source's many "nudge"-driven iterations.
- **Unresolved (flagged in source):** FlashFusion's exact internal stack specifics
  were partly assumed (Next.js/tRPC/Supabase on Node/AWS is the canonical baseline);
  the Replit-vs-production reliability question and the precise database choice were
  open. Web "how to set up for Replit" research was **not re-fetched** during
  reconstruction.
- **Contradictions:** none; conflicting drafts were resolved to the latest
  FlashFusion-native version.
