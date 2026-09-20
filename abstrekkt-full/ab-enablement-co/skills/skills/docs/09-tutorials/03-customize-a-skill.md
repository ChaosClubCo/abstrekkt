# Tutorial 03: Customize a Skill

Fork an existing skill to create a specialized variant tailored to your workflow.
In this tutorial you will take the `api-design-principles` skill and create a
`api-design-graphql-first` variant focused exclusively on GraphQL-first API
development.

---

## Prerequisites

- Completed [Tutorial 01](./01-create-your-first-skill.md) or familiarity with
  the SKILL.md format
- Python 3.10+, `PYTHONIOENCODING=utf-8` set on Windows

---

## Step 1: Read the Source Skill

Start by examining the original skill:

```bash
$ cat _master-skills/technical/api-design-principles/SKILL.md | head -5
```

Expected output:

```
---
name: api-design-principles
description: Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards.
---
```

Review the full file to understand its structure:

```bash
$ wc -l _master-skills/technical/api-design-principles/SKILL.md
```

Expected output (approximately):

```
531 _master-skills/technical/api-design-principles/SKILL.md
```

The skill covers both REST and GraphQL. Your customized version will focus
entirely on GraphQL-first design.

---

## Step 2: Create the New Skill Directory

```bash
$ mkdir -p _master-skills/technical/api-design-graphql-first
```

---

## Step 3: Copy and Modify

Copy the source skill as a starting point:

```bash
$ cp _master-skills/technical/api-design-principles/SKILL.md \
     _master-skills/technical/api-design-graphql-first/SKILL.md
```

Now edit `_master-skills/technical/api-design-graphql-first/SKILL.md`. Make these
changes:

### 3a: Update the Frontmatter

Replace the frontmatter block at the top of the file:

```yaml
---
name: api-design-graphql-first
description: Design and implement GraphQL-first APIs with schema-driven development, efficient resolver patterns, and production-ready performance optimizations. Use when building new GraphQL services, migrating from REST to GraphQL, or establishing GraphQL design standards for your team.
---
```

Key rules for the frontmatter:
- `name` must match the directory slug exactly (`api-design-graphql-first`)
- `description` must be 20-500 characters
- `description` must contain at least one action verb (design, build, implement, etc.)

### 3b: Update the Title and Overview

Replace the `# API Design Principles` heading with:

```markdown
# GraphQL-First API Design
```

Replace the Overview section:

```markdown
## Overview

Build APIs using a GraphQL-first approach where the schema serves as the
contract between frontend and backend teams. This skill covers schema design,
resolver architecture, performance optimization (DataLoaders, query complexity
analysis), and migration strategies from REST.
```

### 3c: Update When to Use

Replace the "When to Use" section to focus on GraphQL scenarios:

```markdown
## When to Use This Skill

- Starting a new API project and evaluating GraphQL as the primary interface
- Migrating an existing REST API to GraphQL
- Designing a GraphQL schema for a new domain model
- Optimizing GraphQL resolver performance (N+1 problems, caching)
- Setting up GraphQL subscriptions for real-time features
- Implementing federation for a multi-service GraphQL architecture
- Reviewing a GraphQL schema for consistency and best practices
```

### 3d: Modify Core Content

Remove or reduce REST-specific sections. Keep and expand:
- GraphQL Schema Design patterns
- Resolver Design patterns
- DataLoader (N+1 Problem Prevention) patterns

Add new sections specific to GraphQL-first development:

```markdown
### Query Complexity Analysis

```python
from graphql import GraphQLError

def complexity_limit_middleware(max_complexity=1000):
    """Reject queries that exceed complexity threshold."""
    def middleware(resolve, obj, info, **args):
        complexity = calculate_query_complexity(info)
        if complexity > max_complexity:
            raise GraphQLError(
                f"Query complexity {complexity} exceeds maximum {max_complexity}"
            )
        return resolve(obj, info, **args)
    return middleware
```

### Federation Pattern

```graphql
# Users service schema
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}

# Orders service schema
type Order @key(fields: "id") {
  id: ID!
  user: User!   # resolved via federation
  total: Money!
}
```
```

### 3e: Update Integration Points

Update the Integration Points section to reference related skills:

```markdown
## Integration Points

- **api-design-principles** -- Broader API design patterns including REST
- **microservices-architecture** -- Service decomposition for federated GraphQL
- **performance-optimization** -- Caching and query optimization strategies
- **e2e-testing-patterns** -- Testing GraphQL endpoints with integration tests
- **typescript-advanced-types** -- Type-safe GraphQL clients with codegen
```

---

## Step 4: Validate

```bash
$ python lib/skill_validator.py --skill technical/api-design-graphql-first
```

Expected output:

```
[PASS] technical/api-design-graphql-first (score: 92)
```

If validation fails, check the error messages:
- "name contains forbidden characters" -- ensure the name is lowercase hyphenated
- "description is too short" -- expand the description to at least 20 characters
- "description lacks action verbs" -- include verbs like "design", "build", "implement"
- "Body: too short" -- the body must have at least 50 lines

---

## Step 5: Convert to All Platforms

```bash
$ python sync-skills.py --skill technical/api-design-graphql-first --targets all
```

Expected output:

```
Syncing skill: technical/api-design-graphql-first
  [1/1] technical/api-design-graphql-first
    -> Claude/ClaudeSkills/skills/technical/api-design-graphql-first/SKILL.md
    -> Gemini/GeminiSkills/gems/technical/api-design-graphql-first.gem.json
    -> GithubCopilot/CopilotSkills/custom-instructions/technical/api-design-graphql-first.md
    -> GithubCopilot/CopilotSkills/agent-skills/technical/api-design-graphql-first/SKILL.md
    -> Codex/CodexSkills/api-design-graphql-first.response.json
    ...
```

---

## Step 6: Deploy

Copy the CLI variant for your preferred platform:

```bash
$ cp -r Claude/ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

Or for other platforms:

```bash
$ cp -r Gemini/GeminiSkills-CLI/.gemini ~/.gemini
$ cp -r GithubCopilot/CopilotSkills-CLI/.github .github
$ cp -r Codex/CodexSkills-CLI/.codex ~/.codex
```

Test the skill by asking your AI assistant to design a GraphQL schema for a
project.

---

## Tips for Customizing Skills

1. **Always start from a copy.** Editing the original master skill affects all
   platform outputs on the next pipeline run.

2. **Keep the slug unique.** If your custom slug matches an existing skill in a
   different category, the dedup prefix (`{category}--{slug}`) will be applied
   automatically.

3. **Preserve the section structure.** The validator expects `##` headings. At a
   minimum, include Overview, When to Use, and one content section.

4. **Validate before converting.** Running `skill_validator.py` first catches
   formatting issues that would produce broken platform outputs.

5. **Test with `--dry-run`.** Both `sync-skills.py` and `populate_all.py`
   support `--dry-run` to preview changes without writing files.

---

## What You Learned

1. How to fork an existing skill as a starting point for customization.
2. Which parts of the SKILL.md file to modify (frontmatter, title, sections).
3. How to validate and convert a customized skill.
4. Best practices for maintaining customized skills alongside the master library.

## Next Steps

- [Tutorial 04: Create a Bundle](./04-create-a-bundle.md) -- Package your custom
  skill with related skills
- [Tutorial 05: Debug Common Issues](./05-debug-common-issues.md) -- Troubleshooting
  reference
