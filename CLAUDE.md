# CLAUDE.md

This repository is no longer governed as a standalone Claude Design handoff bundle.

Claude Code must use the repository-wide authority model before reading legacy project-specific guidance:

1. Read [`AGENTS.md`](AGENTS.md).
2. Read [`REPOSITORY.md`](REPOSITORY.md).
3. Resolve the requested path/domain through [`repository-registry.yaml`](repository-registry.yaml).
4. If and only if the work belongs to the legacy `project/` content/design corpus, then read [`project/CANON.md`](project/CANON.md) and the nearest project-scoped guidance.

## Critical boundary

- **Do not implement or evolve Loxihart runtime/product code in this repository.** `Krosebrook/Loxihart` is the operating/product owner.
- Existing `loxihart/` paths here are frozen historical/reference material pending verified migration and later archival cleanup.
- INT/Intinc is a separate operating lane and is not authorized by repository residence.
- Private memoir, clinical, family, or other sensitive source material does not become publishable because it exists in the tree.
- Generated, archived, vendored, and historical paths must retain their provenance and lifecycle status.

Legacy design-system and artifact-canonicality rules remain valid **inside their registered `project/` lanes**. They do not override repository-level ownership.
