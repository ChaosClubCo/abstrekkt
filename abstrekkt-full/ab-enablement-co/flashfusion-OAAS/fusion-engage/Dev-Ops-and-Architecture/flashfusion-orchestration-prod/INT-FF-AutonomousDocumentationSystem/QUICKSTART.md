# Claude Code Documentation System - Quick Reference

**2-Minute Cheat Sheet**

---

## 🚀 Installation (30 seconds)

```bash
cd ~/source-of-truth-monorepo
chmod +x setup-claude-docs.sh
./setup-claude-docs.sh
```

---

## ⚡ Essential Commands

### Update All Documentation
```bash
$ claude-code
> /doc-update
```

### Create Architecture Decision Record
```bash
> /create-adr "Title here" \
  --context "Why we need this decision" \
  --decision "What we decided"
```

### Generate Diagram
```bash
> /diagram container
> /diagram system-context
> /diagram sequence
```

---

## 🎯 Common Workflows

### Workflow 1: After Adding New Feature
```bash
# 1. Commit your code
git add .
git commit -m "feat: add new feature"

# 2. Get doc warning
⚠️  API change detected. Consider: /doc-update --api

# 3. Update docs
$ claude-code
> /doc-update --api

# 4. Review and merge PR
```

### Workflow 2: Documenting Architectural Decision
```bash
# 1. Make decision (e.g., use Redis)
# 2. Create ADR
> /create-adr "Use Redis for job queue" \
  --context "Need reliable queue for POD" \
  --decision "Redis + BullMQ"

# 3. Review PR
# 4. Merge
```

### Workflow 3: Monthly Documentation Review
```bash
# 1. Generate coverage report
> /doc-coverage

# 2. Update stale diagrams
> /diagram container

# 3. Create missing ADRs
> /create-adr [title]

# 4. Update API docs
> /doc-update --api
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| ADRs | `docs/decisions/ADR-XXX-*.md` |
| Diagrams | `docs/diagrams/*.mmd` |
| API Docs | `docs/api/*.md` |
| Error Catalog | `docs/errors/*.md` |
| Getting Started | `docs/tutorials/*.md` |

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.claude/mcp-config.json` | GitHub/Notion/Linear integration |
| `.env` | API keys and secrets |
| `.claude/agents/*.yaml` | Agent configurations |
| `.claude/skills/*/SKILL.md` | Skill definitions |

---

## 🐛 Quick Fixes

### Command not found
```bash
npm install -g @anthropic-ai/claude-code
```

### MCP not working
```bash
# Check token
echo $GITHUB_TOKEN

# Test connection
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user
```

### Diagram not rendering
```bash
# Validate syntax
npm install -g @mermaid-js/mermaid-cli
mmdc -i docs/diagrams/container-view.mmd -o /tmp/test.png
```

---

## 📊 Quality Checklist

Before merging documentation PR:

- [ ] No secrets exposed (check all .md files)
- [ ] All diagrams render correctly
- [ ] TypeScript types in API docs
- [ ] ADRs follow MADR template
- [ ] Cross-references are valid

---

## 🎓 Templates

### ADR Template
```markdown
# ADR-XXX: [Title]

## Status
Accepted | 2025-02-05

## Context
[Problem description]

## Decision Drivers
* [Requirement 1]
* [Constraint 1]

## Considered Options
1. [Option 1]
2. [Option 2]

## Decision Outcome
**Chosen:** [Option]

**Rationale:** [Why]

**Consequences:**
* ✅ [Benefit]
* ❌ [Trade-off] → Mitigation: [How]
```

### API Doc Template
```markdown
### GET /api/resource/:id

**Purpose:** [One sentence]

**Auth Required:** Yes

**Request:**
```typescript
interface Request {
  params: { id: string };
}
```

**Response (200):**
```typescript
interface Response {
  id: string;
  // ...
}
```

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.com/resource/123
```
```

---

## 🔗 Quick Links

- Full README: `README-CLAUDE-CODE-DOCS.md`
- Setup Script: `setup-claude-docs.sh`
- Documentation: `docs/README.md`

---

**Save this file for quick reference!**
