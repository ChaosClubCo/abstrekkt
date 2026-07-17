# Acceptance Criteria

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Release Acceptance Gates

- User can submit lead intake without auth.
- Internal operator can create/edit audit workspace after auth.
- Client user can only view their organization data.
- All tenant tables enforce RLS.
- Every generated artifact stores source, prompt, model, reviewer, confidence, and claim status.
- Paid audit proposal cannot be generated below $4,500 unless marked proof-of-value with zero price.
- Certification language gate blocks “certified” claim before verification.
- IP clause appears in every proposal template.
