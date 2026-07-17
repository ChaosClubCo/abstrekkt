# INT Inc — Staff Engineer Priorities (Next 3 Months)

Post-FlashFusion focus, reconstructed from the source chat's pivot section.

## Primary focus
Build and harden the **Universal MCP Server** to scale from ~10 to ~50 engineers
(see `../universal-mcp-server/`).

## What to focus on
1. **Universal MCP Server** — multi-provider, pluggable adapters, per-engineer
   auth + quota.
2. **Integration test suite (Phase 10)** — make the build trustworthy before
   onboarding more engineers.
3. **Provider fixes (Phase 10.2/10.3)** — the top-3 broken providers, each behind a
   contract test.
4. **Reusable asset migration** — bring FlashFusion's n8n / Supabase / tRPC patterns
   into INT skill packs.

## What NOT to do
- Re-open FlashFusion feature work (it's archived).
- Scale engineer count before Phase 10 is green.

## Definition of done (quarter)
- Phase 10 integration suite green; top-3 providers pass contract tests.
- A documented 10→50 engineer seat/quota model.
- Reusable assets landed as INT skill packs.
