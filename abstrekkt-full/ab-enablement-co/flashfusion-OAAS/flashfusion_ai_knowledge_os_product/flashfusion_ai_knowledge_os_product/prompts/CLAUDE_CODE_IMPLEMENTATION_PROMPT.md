# Claude Code Implementation Prompt

You are operating in an existing repository.

SCOPE_MODE: FULL

Analyze repo/code first, then generate missing files only; do not rewrite unchanged files.

## Mission

Implement the FlashFusion AI-Native Knowledge OS scaffold using the files and contracts from this package.

## Required Actions

1. Inspect repository structure.
2. Identify missing folders:
   - docs
   - doctrine
   - ontology
   - governance
   - memory
   - agents
   - ux
   - observability
   - schemas
   - src/contracts
   - prompts
   - examples
3. Add missing files only.
4. Add TypeScript contracts.
5. Add SQL schema and RLS starter.
6. Add validation utilities.
7. Add tests or smoke checks if the repo has a test framework.
8. Do not delete existing work.
9. Do not overwrite secrets.
10. Do not claim deployment unless deployment is actually performed.

## Safety Rules

- Ask before destructive changes.
- Preserve existing repo conventions.
- Keep generated files versioned.
- Add README links.
- Add acceptance checklist.

## Output

Return:

- files created
- files skipped
- risks found
- next commands
- verification steps
