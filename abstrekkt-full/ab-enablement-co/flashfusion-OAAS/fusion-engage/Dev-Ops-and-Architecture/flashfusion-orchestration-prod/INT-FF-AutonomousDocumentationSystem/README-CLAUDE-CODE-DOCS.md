# Claude Code Documentation System

**Autonomous documentation for your FlashFusion ecosystem**

Transform your 571-repo empire into a self-documenting system using Claude Code CLI with agents, skills, MCPs, and automation hooks.

---

## 🎯 What This Does

Creates an **autonomous documentation engine** that:

- ✅ **Watches your code** for changes (via hooks)
- ✅ **Generates ADRs** for architectural decisions
- ✅ **Creates diagrams** (Mermaid, auto-rendered)
- ✅ **Documents APIs** with TypeScript types
- ✅ **Syncs to GitHub/Notion/Linear** automatically
- ✅ **Never sleeps** - maintains docs 24/7

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

```bash
# 1. Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 2. Verify installation
claude-code --version
```

### Installation

```bash
# 1. Navigate to your project
cd ~/source-of-truth-monorepo

# 2. Run setup script
chmod +x setup-claude-docs.sh
./setup-claude-docs.sh

# 3. Configure MCPs
vi .claude/mcp-config.json
# Add your GitHub personal access token

# 4. Set environment variables
cp .env.example .env
vi .env
# Add ANTHROPIC_API_KEY and other credentials

# 5. Test installation
claude-code
> /doc-update --help

# ✅ If you see help text, you're ready!
```

---

## 📦 What Gets Installed

### Directory Structure

```
.claude/
├── agents/
│   ├── doc-agent.yaml                    # Main orchestrator
│   ├── adr-writer-agent.yaml             # ADR specialist
│   ├── diagram-generator-agent.yaml      # Diagram creator
│   └── api-documenter-agent.yaml         # API docs expert
├── skills/
│   ├── doc-coordinator/SKILL.md          # Workflow coordinator
│   ├── adr-writer/SKILL.md               # ADR templates
│   ├── diagram-generator/SKILL.md        # Mermaid generator
│   └── api-documenter/SKILL.md           # API extraction
├── slash-commands/
│   ├── doc-update.yaml                   # /doc-update
│   ├── create-adr.yaml                   # /create-adr
│   └── diagram.yaml                      # /diagram
├── hooks/
│   ├── pre-commit-doc-check.yaml         # Warns before commit
│   └── post-pr-merge.yaml                # Auto-docs after merge
└── mcp-config.json                       # GitHub/Notion/Linear

docs/
├── README.md                             # This file
├── decisions/                            # ADRs (auto-numbered)
├── diagrams/                             # Mermaid diagrams
├── api/                                  # API documentation
├── errors/                               # Error catalog
├── tutorials/                            # Getting started
├── how-to-guides/                        # Task guides
├── reference/                            # Technical specs
└── explanation/                          # Concepts
```

---

## 🎮 Usage

### Slash Commands

#### 1. `/doc-update` - Update All Documentation

```bash
$ claude-code
> /doc-update

# Analyzes:
# - Last commit
# - Changed files
# - Determines updates needed

# Generates:
# - ADRs (if architecture changed)
# - Diagrams (if structure changed)
# - API docs (if endpoints changed)

# Outputs:
✅ 3 files updated
📝 PR created: #894 "docs: Auto-generated updates"
🔗 https://github.com/krosebrook/source-of-truth-monorepo/pull/894
```

**Options:**
```bash
/doc-update --full      # Update everything
/doc-update --adr       # Only ADRs
/doc-update --diagrams  # Only diagrams
/doc-update --api       # Only API docs
```

#### 2. `/create-adr` - Create Architecture Decision Record

```bash
> /create-adr "Use Redis with BullMQ for background jobs" \
  --context "Need reliable job queue for POD fulfillment, email, AI" \
  --decision "Use Redis + BullMQ instead of database polling"

# Generates:
✅ ADR-012 created
📄 File: docs/decisions/ADR-012-use-redis-bullmq.md
📝 PR: #895 "docs: ADR-012 - Use Redis with BullMQ"
```

#### 3. `/diagram` - Generate Architecture Diagram

```bash
# System context (high-level)
> /diagram system-context

# Container view (internal structure)
> /diagram container

# Sequence diagram (specific flow)
> /diagram sequence --components "user,dashboard,api,supabase,stripe"

# Flowchart (decision logic)
> /diagram flowchart --components "upload,validate,process,save"

# State diagram (lifecycle)
> /diagram state --components "brand"

# Entity Relationship Diagram
> /diagram erd

# Outputs:
✅ Container diagram generated
📊 Local: docs/diagrams/container-view.mmd
🔗 Notion: https://notion.so/flashfusion/architecture
```

---

## 🤖 How Agents Work

### Main Documentation Agent

**Triggered by:** `/doc-update` or hooks

**Workflow:**
1. Analyzes code changes (git diff)
2. Determines what docs need updates
3. Spawns specialized subagents
4. Verifies quality
5. Creates GitHub PR
6. Syncs to Notion/Linear

### Specialized Subagents

#### ADR Writer Agent
- **Purpose:** Creates Architecture Decision Records
- **Uses:** `adr-writer` skill
- **Output:** Markdown files in `docs/decisions/`

#### Diagram Generator Agent
- **Purpose:** Creates Mermaid diagrams
- **Uses:** `diagram-generator` skill
- **Output:** `.mmd` files in `docs/diagrams/`

#### API Documenter Agent
- **Purpose:** Extracts API documentation from code
- **Uses:** `api-documenter` skill
- **Output:** Markdown files in `docs/api/`

---

## 🪝 Automation Hooks

### Pre-Commit Hook

**Triggers:** Before `git commit`

**What it does:**
- Scans staged files
- Detects architecture changes
- Warns if docs needed

**Example:**
```bash
$ git add packages/integrations/printify/
$ git commit -m "feat: add Printify webhook handler"

⚠️  Integration change detected
⚠️  Consider: /create-adr "Printify integration strategy"
⚠️  Consider: /doc-update --api

[Commit proceeds - no blocking]
```

### Post-PR-Merge Hook

**Triggers:** After PR merged to main

**What it does:**
- Analyzes merged files
- Auto-generates missing docs
- Creates follow-up PR

**Example:**
```bash
# You merge PR #890 (adds new tRPC endpoint)

# Hook auto-runs:
⚙️  Analyzing PR #890...
📝 API endpoint changed: /api/brands/generate
✅ Updated: docs/api/brands.md
📝 Created PR: #891 "docs: Update brands API documentation"
```

---

## 🔌 MCP Integrations

### GitHub MCP

**What it does:**
- Creates branches and PRs
- Reads repository files
- Manages issues

**Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "url": "https://github-mcp.anthropic.com/sse",
      "config": {
        "owner": "krosebrook",
        "repos": ["source-of-truth-monorepo"]
      }
    }
  }
}
```

### Notion MCP

**What it does:**
- Syncs diagrams to Notion
- Updates architecture pages
- Creates documentation hierarchy

**Configuration:**
```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp",
      "config": {
        "workspace": "FlashFusion"
      }
    }
  }
}
```

### Linear MCP

**What it does:**
- Creates tickets for missing docs
- Tracks documentation debt
- Links issues to ADRs

**Configuration:**
```json
{
  "mcpServers": {
    "linear": {
      "url": "https://mcp.linear.app/mcp",
      "config": {
        "team": "FlashFusion"
      }
    }
  }
}
```

---

## 📚 Skills System

### doc-coordinator

**Purpose:** Routes documentation tasks to appropriate subagents

**Triggers:**
- User types `/doc-update`
- Code changes detected
- Pre-commit hook fires

**Logic:**
```typescript
// Analyzes changed files
if (apiFilesChanged) → spawn api-documenter-agent
if (architectureChanged) → spawn adr-writer-agent + diagram-generator-agent
if (integrationAdded) → update integration guide
```

### adr-writer

**Purpose:** Generates MADR-compliant Architecture Decision Records

**Templates for:**
- Database/storage decisions
- AI model selection
- Integration/service selection
- Deployment strategy
- Security architecture

### diagram-generator

**Purpose:** Creates Mermaid diagrams

**Supports:**
- System Context (C4 Level 1)
- Container Diagrams (C4 Level 2)
- Sequence Diagrams
- Flowcharts
- State Diagrams
- Entity Relationship Diagrams

### api-documenter

**Purpose:** Extracts API docs from code

**Parses:**
- tRPC routers (`*.router.ts`)
- Express routes (`*.routes.ts`)
- OpenAPI specs

**Generates:**
- TypeScript types
- Request/response examples
- curl commands
- Rate limit info

---

## 🎯 Real-World Examples

### Example 1: Document New Stripe Integration

```bash
# You just added Stripe webhook handler
$ git add packages/integrations/stripe/webhooks.ts
$ git commit -m "feat: add Stripe webhook verification"

⚠️  Integration change detected
⚠️  Consider: /doc-update --api

# You run the command
$ claude-code
> /doc-update --api

# Agent workflow:
# 1. Detects: packages/integrations/stripe/webhooks.ts
# 2. Extracts: POST /api/webhooks/stripe endpoint
# 3. Generates: docs/api/stripe-webhooks.md
# 4. Updates: docs/integrations/stripe.md
# 5. Creates PR: #892

✅ API docs updated
📝 Files: docs/api/stripe-webhooks.md
📝 PR: https://github.com/.../pull/892
```

### Example 2: Create ADR for Redis Decision

```bash
# You decided to use Redis for job queue
> /create-adr "Use Redis with BullMQ for background jobs" \
  --context "Need reliable queue for POD fulfillment, email sending, AI generation. Database polling doesn't scale." \
  --decision "Use Redis + BullMQ instead of polling database or AWS SQS"

# ADR Writer Agent:
# 1. Finds next number: ADR-012
# 2. Fills MADR template:
#    - Context: Queue requirement
#    - Options: Redis, SQS, database polling
#    - Decision: Redis + BullMQ
#    - Consequences: +Reliability +Scale -InfrastructureCost
# 3. Saves: docs/decisions/ADR-012-use-redis-bullmq.md
# 4. Creates branch: docs/adr-012
# 5. Creates PR: #893

✅ ADR-012 created
📄 docs/decisions/ADR-012-use-redis-bullmq.md
📝 PR: #893 "docs: ADR-012 - Use Redis with BullMQ"
```

### Example 3: Auto-Update After Monorepo Refactor

```bash
# You restructured packages/
$ git add packages/
$ git commit -m "refactor: reorganize monorepo packages"
$ git push origin main

# Post-PR-merge hook triggers:
⚙️  Analyzing commit...
📦 Package structure changed
📊 Regenerating container diagram...

# Diagram Generator Agent:
# 1. Scans packages/ directory
# 2. Finds: dashboard, api, workers, ai, integrations
# 3. Extracts dependencies from package.json
# 4. Generates updated Mermaid diagram
# 5. Saves: docs/diagrams/container-view.mmd
# 6. Syncs to Notion
# 7. Creates PR: #894

✅ Container diagram updated
📊 docs/diagrams/container-view.mmd
🔗 Notion: https://notion.so/flashfusion/architecture
📝 PR: #894 "docs: Update architecture diagrams"
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env

# Required
ANTHROPIC_API_KEY=sk-ant-xxxxx          # Claude Code access

# Optional (for full functionality)
GITHUB_TOKEN=ghp_xxxxx                  # GitHub MCP
NOTION_API_KEY=secret_xxxxx             # Notion sync
NOTION_ARCHITECTURE_PAGE_ID=xxxxx       # Notion page
LINEAR_API_KEY=lin_api_xxxxx            # Linear integration

# Project-specific
DATABASE_URL=postgresql://...            # For ERD generation
```

### MCP Configuration

Edit `.claude/mcp-config.json`:

```json
{
  "mcpServers": {
    "github": {
      "url": "https://github-mcp.anthropic.com/sse",
      "config": {
        "owner": "krosebrook",
        "repos": [
          "source-of-truth-monorepo",
          "continuum",
          "interact"
        ]
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Command not found: claude-code"

```bash
# Ensure global install
npm install -g @anthropic-ai/claude-code

# Check PATH
echo $PATH | grep npm

# If missing, add to ~/.bashrc or ~/.zshrc:
export PATH="$PATH:~/.npm-global/bin"
```

### "MCP server unavailable"

```bash
# Check MCP config
cat .claude/mcp-config.json

# Verify GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Test Notion API
curl -H "Authorization: Bearer $NOTION_API_KEY" \
  https://api.notion.com/v1/users/me
```

### "No ADRs generated"

```bash
# Check docs/ directory exists
ls -la docs/decisions/

# Run with verbose logging
claude-code --verbose
> /create-adr "Test ADR"

# Check agent status
ls .claude/agents/
cat .claude/agents/adr-writer-agent.yaml
```

### "Diagrams not rendering"

```bash
# Validate Mermaid syntax
npm install -g @mermaid-js/mermaid-cli
mmdc -i docs/diagrams/container-view.mmd -o /tmp/test.png

# If invalid syntax, regenerate
> /diagram container
```

---

## 📊 Monitoring & Metrics

### Documentation Coverage Report

```bash
$ claude-code
> /doc-coverage

# Outputs:
📊 Documentation Health Report

Coverage:
- ADRs: 12/15 decisions (80%)
- API Docs: 45/52 endpoints (87%)
- Diagrams: Last updated 3 days ago
- Error Catalog: 23/30 errors (77%)

Recommendations:
- [ ] Document ADR for Redis migration
- [ ] Add docs for /api/webhooks/printify
- [ ] Update container diagram (new AI service)

Trend:
📈 +12% documentation coverage this month
```

---

## 🎓 Best Practices

### When to Create ADRs

**Always create ADRs for:**
- ✅ New third-party service integrations
- ✅ Database schema changes
- ✅ Authentication/authorization changes
- ✅ AI model selection
- ✅ Infrastructure/deployment changes
- ✅ Major refactors

**Skip ADRs for:**
- ❌ UI color changes
- ❌ Copy text updates
- ❌ Bug fixes (unless architectural)
- ❌ Dependencies updates (unless breaking)

### Diagram Best Practices

**Do:**
- ✅ Keep diagrams under 10 nodes
- ✅ Use consistent colors
- ✅ Update when structure changes
- ✅ Add descriptions/legends

**Don't:**
- ❌ Create giant monolith diagrams
- ❌ Hard-code IP addresses
- ❌ Include implementation details in system context

### API Documentation

**Include:**
- ✅ TypeScript types (request/response)
- ✅ Auth requirements
- ✅ Rate limits
- ✅ Example curl commands
- ✅ Required env vars

**Avoid:**
- ❌ Exposing internal implementation
- ❌ Hard-coding URLs/IDs
- ❌ Copying old examples

---

## 🚀 Advanced Usage

### Custom Skills

Create your own documentation skills:

```bash
# Create new skill
mkdir -p .claude/skills/my-custom-skill

# Define skill
cat > .claude/skills/my-custom-skill/SKILL.md << 'EOF'
---
name: my-custom-skill
version: 1.0.0
description: Custom documentation skill
triggers:
  keywords:
    - my custom trigger
---

# My Custom Skill

[Skill implementation]
EOF
```

### Custom Agents

```yaml
# .claude/agents/my-agent.yaml
name: my-custom-agent
version: 1.0.0
description: Custom documentation agent

skills:
  - my-custom-skill

mcps:
  - github
```

### Custom Slash Commands

```yaml
# .claude/slash-commands/my-command.yaml
name: my-command
description: My custom command

command: |
  /my-command <arg>

execution:
  agent: my-custom-agent
```

---

## 📖 Resources

- [Claude Code CLI Docs](https://docs.anthropic.com/claude/docs/claude-code)
- [MADR Template](https://adr.github.io/madr/)
- [C4 Model](https://c4model.com/)
- [Mermaid Documentation](https://mermaid.js.org/)
- [Diátaxis Framework](https://diataxis.fr/)

---

## 🤝 Support

### Issues

If you encounter problems:

1. Check [Troubleshooting](#-troubleshooting)
2. Review `.claude/agents/` config
3. Check Claude Code logs: `.claude/logs/`
4. Open issue on GitHub

### Community

- Claude Discord: [discord.gg/anthropic](https://discord.gg/anthropic)
- GitHub Discussions: [github.com/krosebrook/source-of-truth-monorepo/discussions](https://github.com/krosebrook/source-of-truth-monorepo/discussions)

---

## 📄 License

MIT License - See LICENSE file

---

## 🎉 Success Metrics

**After 1 Week:**
- [ ] 5+ ADRs created
- [ ] Container diagram auto-updated
- [ ] All new APIs documented
- [ ] 0 commits without doc check warning

**After 1 Month:**
- [ ] 80% ADR coverage
- [ ] 90% API doc coverage
- [ ] Notion synced daily
- [ ] New devs onboard in <2 hours using docs

**After 3 Months:**
- [ ] Documentation self-maintaining
- [ ] Linear tickets auto-created for doc debt
- [ ] Team consistently uses `/doc-update`
- [ ] Doc-driven development culture established

---

**Built with ❤️ for FlashFusion by Kyle Rosebrook**
