# Test Strategy

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Test Layers

- Unit: authz, pricing, claims, policy, webhooks.
- Integration: Supabase RLS, API contracts, agent run creation.
- E2E: lead intake, audit workspace, artifact review.
- Security: webhook signatures, role denials, unauthenticated mutation attempts.
- AI evals: regression cases for claims, pricing, IP, and evidence.
