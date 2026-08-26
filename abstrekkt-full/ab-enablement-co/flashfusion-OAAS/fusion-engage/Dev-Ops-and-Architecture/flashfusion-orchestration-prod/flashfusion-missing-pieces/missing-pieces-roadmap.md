# FlashFusion Missing Pieces Roadmap (Fully Populated)

## 1) Security & Compliance
- **Auth & Roles**: `student`, `teacher`, `owner`, `admin` via Supabase Auth; RLS across tables.
- **Secrets**: `.env.example`, gitleaks CI, monthly rotation.
- **Compliance**: GDPR delete `/account/delete`; COPPA/FERPA age-gating; PCI via Stripe Checkout.
- **Audit Logs**: `audit_logs(user_id, action, metadata, ts)`; anomaly alerts for bursty AI usage.

### Seeds
- RLS sample: `create policy student_self on study_data for select using (user_id = auth.uid());`
- `.env.example` mock secrets and keys.

### Verification & Acceptance
- `npm run db:reset` → role isolation confirmed.
- Commit fake secret → CI blocks.
- GDPR delete removes user + cascades.

### Troubleshooting
- **Leak**: Missing RLS predicate → Add `user_id = auth.uid()` predicates; re-run `npm run db:reset`.

## 2) Growth
- Onboarding wizard (persona → first generation → share/export);
- Referrals: +50 credits for inviter+invitee;
- Distribution: Etsy/Gumroad starter bundles; Product Hunt checklist.

### Seeds
- Templates: SAT Math, Grade‑3 Science, Influencer Calendar.

### Verify/Accept
- New user to first export <5 min; referrals visible in dashboard.

## 3) Monetization
- Tiers: Free(10 credits), Pro($19), Enterprise($199 SSO);
- Webhook‑driven credits; Marketplace fee 20% (15% HV sellers).

### Verify/Accept
- $1 test purchase updates credits; free tier hard‑limits usage.

## 4) Analytics & Feedback
- PostHog events: `lesson_created`, `export_pdf`, `share_link_clicked`;
- Inline thumbs feedback; churn alert after 7 days inactivity.

## 5) Extensions & API
- Public API: `/api/generate/lesson`, `/api/generate/flashcards`;
- CLI: `ff generate lesson --topic "Photosynthesis"`.

## 6) Knowledge & Ops
- Docs hub; Incident & Rollback playbooks; ADR log; Governance policy.
