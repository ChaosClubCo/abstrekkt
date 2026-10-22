# Loxihart handoff — sources to migrate to `Krosebrook/Loxihart`

Authority domain boundary: `repository-registry.yaml`'s `loxihart_operating_product` domain (`authority: external_canonical`, `owner_repository: Krosebrook/Loxihart`). This document is paperwork only — no code moves out of `ChaosClubCo/abstrekkt` as a result of it. It exists so this repo's side of the handoff is ready to paste into an issue on the owning repository, per the pattern already used for `docs/loxihart/EXPORT_ONLY_NOTICE.md` and `docs/export/MIGRATION_CONTRADICTIONS.md` (contradiction C-0014).

Source revision for every hash below: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.

## Sources proposed for migration

| Source path (this repo) | What it is | Why it's Loxihart-lane |
| --- | --- | --- |
| `Unicorn-maybe/flashfusion-web/` | Next.js + three.js marketing site, has lockfile | Current FlashFusion product/platform surface; `repository-registry.yaml:40-43` routes current subordinate product material to Loxihart |
| `project/remediation/clean/website/` (keep this copy; `project/audit/src/website/` is a near-duplicate, do not migrate both) | Turborepo/Next 14/Supabase marketing+app site | Same |
| `project/remediation/clean/dashboard/` | Vite kanban dashboard | Same |

## Already frozen, not part of this handoff batch

`loxihart/pilot-console/` and its siblings (`canonical-truth`, `change-receipt`, `floot-proxy-reference`, `control-api`) are already governed as frozen migration sources under `AGENTS.md:16-22` and `repository-registry.yaml:29-38`. `docs/export/MIGRATION_CONTRADICTIONS.md` records this migration as blocked on contradiction C-0014 (target-repo hash read-back unavailable). This handoff document does not attempt to unblock that — it is a separate, already-tracked item.

## What Loxihart's owner needs to do before any code moves

Per `repository-registry.yaml:66-77`'s migration contract:

1. Confirm `Krosebrook/Loxihart` accepts each source path as canonical there (explicit target owner).
2. This repo computes and publishes `source_hash` for each path (via `scripts/extract-subtree.sh --dry-run` + `sha256sum`, same as any other extraction).
3. Target repo creates the path from that exact source revision.
4. Independent read-back of target bytes/hash from the target repo.
5. Hashes match, or a documented transformation receipt explains any difference.
6. A migration receipt (same template as `EXTRACTION_RECEIPT_TEMPLATE.md`, with `target_repository: Krosebrook/Loxihart`) is committed to **this** repo under `docs/migrations/loxihart/`.
7. Only after that receipt exists may these paths be archived or removed here — in a separate, later, explicitly-approved change.

## Suggested issue text for `Krosebrook/Loxihart`

> Abstrekkt repo audit (2026-09-18) identified three source paths in `ChaosClubCo/abstrekkt` that read as current FlashFusion/Loxihart product surfaces rather than Abstrekkt publishing content, per Abstrekkt's own `repository-registry.yaml` domain boundaries: `Unicorn-maybe/flashfusion-web/`, `project/remediation/clean/website/`, `project/remediation/clean/dashboard/`. Requesting confirmation these belong here so a hash-verified migration receipt can be produced on the Abstrekkt side per its migration contract. No code has moved yet.

## Note on `.cursor/environment.json`

This repo's Cloud Agent dev environment (`.cursor/install.sh:4-12`) currently treats `Unicorn-maybe/flashfusion-web` as one of two "runnable, secret-free" apps it bootstraps. That configuration was not changed by this audit. If the handoff above is accepted, `.cursor/environment.json` should be updated in a follow-up change to stop pointing at a path that no longer belongs to this repo's active development surface — flagged here, not fixed here.
