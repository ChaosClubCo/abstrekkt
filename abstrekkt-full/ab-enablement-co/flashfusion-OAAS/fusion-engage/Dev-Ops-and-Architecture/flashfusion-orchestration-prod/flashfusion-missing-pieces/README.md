# FlashFusion — Missing Pieces Roadmap Repo

This repo adds production-grade **Security, Growth, Monetization, Analytics, Extensions, and Ops** layers to FlashFusion.

## Quick Start
1. Copy `.env.example` → `.env.local` and adjust as needed.
2. `npm i`
3. `npm run db:reset` (provisions schema + RLS)
4. `npm run dev` (starts API + CLI link)
5. Run smoke checks: `npm run verify`

## What You Get
- **Security & Compliance**: RLS, audit logs, secret scanning, GDPR delete.
- **Growth**: Onboarding flows, referral credits, Etsy/Gumroad scaffolds.
- **Monetization**: Tiers, credit metering, Stripe webhooks.
- **Analytics**: PostHog events, feedback capture, A/B hooks.
- **Extensions**: Public API + CLI seeds, Plugin SDK stub.
- **Ops**: Incident playbooks, rollback, ADRs, CI security gates.

## Acceptance Criteria
- Auth roles enforced by RLS; cross-tenant access impossible.
- Free tier limited to 10 credits/month; Stripe webhooks update balances.
- Events visible in PostHog within 60s; feedback stored per output.
- API returns valid JSON <2s P95; CLI commands function locally.
- Docs lint clean; incident + rollback playbooks executable.
