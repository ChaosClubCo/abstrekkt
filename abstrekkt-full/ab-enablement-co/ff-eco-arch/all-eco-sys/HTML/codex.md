# Codex: AI Coding Agent

## Overview

Codex is OpenAI's agentic coding assistant available through CLI, IDE extensions, and cloud-based autonomous agents. Powered by specialized GPT-5 Codex models, it can understand codebases, make multi-file edits, execute commands, and integrate with developer workflows.

**Launched:** November 2024  
**Current version:** Codex 2.0 (December 2025)

---

## Three Ways to Access Codex

### 1. Codex CLI (Command Line)
**Open-source terminal agent**

- **Language:** Rust
- **Repository:** [github.com/openai/codex](https://github.com/openai/codex)
- **Platforms:** macOS, Linux, Windows (experimental/WSL)
- **Installation:**
  ```bash
  # macOS / Linux
  curl -fsSL https://cli.openai.com/install.sh | sh
  
  # Or via Homebrew
  brew install openai/tap/codex
  
  # Windows (WSL or experimental native)
  curl -fsSL https://cli.openai.com/install.ps1 | powershell
  ```

**Best for:**
- Terminal-first workflows
- Command execution
- File system operations
- Scripting and automation

### 2. Codex IDE Extension
**Integrated development environment plugin**

- **Supported IDEs:**
  - Visual Studio Code
  - Cursor
  - Windsurf
  - IntelliJ IDEA (experimental)

- **Installation:**
  - VS Code: Extensions → Search "OpenAI Codex"
  - Cursor: Built-in (enable in settings)
  - Windsurf: Built-in (enable in settings)

**Best for:**
- Code review and suggestions
- Inline completions
- Refactoring within IDE
- Context-aware code generation

### 3. Codex Cloud
**Autonomous multi-task agent with sandboxed environments**

- **Access:** [cloud.openai.com/codex](https://cloud.openai.com/codex)
- **Duration:** 1-30 minute tasks
- **Capabilities:**
  - Full repository cloning
  - Command execution in sandbox
  - Multi-step autonomous workflows
  - GitHub integration (PRs, issues)

**Best for:**
- Long-running tasks
- Complex multi-file refactors
- Autonomous bug fixing
- CI/CD integration

---

## Models

### GPT-5.2-Codex (Default)
**Most capable coding model with context compaction**

- **Context:** 196,000 tokens (effective: unlimited via compaction)
- **Features:**
  - Context compaction for hours-long refactors
  - Full Windows support (no WSL required)
  - Advanced cybersecurity capabilities
  - Multi-file understanding

**Best for:**
- Production codebases
- Enterprise development
- Security-sensitive projects
- Long refactoring sessions

**Pricing:**
- **ChatGPT:** Included in Plus/Pro/Business/Enterprise
- **API:** $30/$120 per 1M input/output tokens
- **On-demand credits:** Available for CLI users

### GPT-5-Codex
**Balanced coding agent**

- **Context:** 196,000 tokens
- **Features:**
  - General coding tasks
  - Standard tool integrations
  - Good performance/cost ratio

**Best for:**
- General development
- Smaller projects
- Prototyping

**Pricing:**
- Same as GPT-5.2-Codex
- More cost-effective for simple tasks

### GPT-5-Codex-Mini
**Fast, cost-effective variant**

- **Context:** 128,000 tokens
- **Cost:** 50% cheaper than GPT-5-Codex
- **Speed:** 40% faster

**Best for:**
- Quick fixes
- Scripts and utilities
- Simple refactors
- Learning and experimentation

**Pricing:**
- **API:** $15/$60 per 1M input/output tokens

---

## Codex CLI

### Setup

```bash
# Install
curl -fsSL https://cli.openai.com/install.sh | sh

# Login
codex auth login

# Verify installation
codex --version
```

### Configuration

**Config location:** `~/.codex/config.toml`

```toml
# Default model
model = "gpt-5.2-codex"

# Approval mode
# - "read-only": Requires approval for file changes
# - "auto": Auto-approves read operations, asks for writes
# - "full": Auto-approves everything (use with caution)
approval_mode = "auto"

# Skills directory
skills_dir = "~/.codex/skills"

# Enable MCP servers
mcp_servers = true

# Integrations
[integrations]
github = true
slack = false
linear = false
```

### Basic Usage

```bash
# Start chat session
codex chat

# One-off command
codex "refactor the auth module to use async/await"

# Work on specific files
codex --file src/auth.ts "add error handling"

# Execute with image context
codex --image screenshot.png "implement this UI component"

# Review mode (read-only)
codex --read-only "explain how the payment flow works"
```

### Approval Modes

**Read-only (safest):**
```bash
codex --read-only
```
- Can read files and execute safe commands
- Requires approval for any writes
- Good for code review and understanding

**Auto (recommended):**
```bash
codex --auto
# or set in config.toml: approval_mode = "auto"
```
- Auto-approves read operations
- Asks for confirmation on writes
- Balanced security/productivity

**Full (advanced):**
```bash
codex --full
# or set in config.toml: approval_mode = "full"
```
- Auto-approves all operations
- Use only in sandboxed environments
- High productivity, higher risk

### File Operations

```bash
# Edit specific files
codex --file src/components/Button.tsx "add dark mode support"

# Multiple files
codex --file src/**/*.ts "update to TypeScript 5.0"

# Glob patterns
codex --file "**/*.test.ts" "fix failing tests"

# Create new file
codex "create a new React component for user profile"

# Delete files
codex --full "remove unused CSS files"
```

### Command Execution

Codex can execute shell commands:

```bash
# Run tests
codex "run the test suite and fix any failures"

# Install dependencies
codex "add react-query and configure it"

# Git operations
codex "create a new branch, commit changes, and push"

# Build and deploy
codex "build the project and deploy to Vercel"
```

**Safety:** Commands shown before execution (unless `--full` mode).

---

## Codex Skills

### What are Skills?

Skills are reusable instruction bundles stored in `~/.codex/skills/` or `.codex/skills` (project-specific).

**Format:** Markdown files with frontmatter

**Example: `~/.codex/skills/react-component.md`**

```markdown
---
name: react-component
description: Create a new React component with TypeScript
---

# React Component Generator

When creating a new React component:

1. Create file in `src/components/`
2. Use TypeScript (.tsx)
3. Use functional component with hooks
4. Include PropTypes
5. Add Tailwind CSS for styling
6. Export as default
7. Create companion test file

## Template

\`\`\`tsx
import React from 'react';

interface Props {
  // Define props here
}

export default function ComponentName({ }: Props) {
  return (
    <div className="">
      {/* Component content */}
    </div>
  );
}
\`\`\`

## Test Template

\`\`\`tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
\`\`\`
```

### Using Skills

```bash
# Use a skill
codex --skill react-component "create a UserProfile component"

# List available skills
codex skills list

# View skill details
codex skills show react-component

# Create new skill
codex skills create my-skill

# Install skill from URL
codex skills install https://github.com/user/skill.md
```

### Built-in Skills

Codex includes several built-in skills:

- **$skill-creator:** Create new skills
- **$skill-installer:** Install skills from URLs
- **$create-plan:** (Experimental) Plan complex tasks

### Skill Management Tools

```bash
# Skill creator (interactive)
codex "$skill-creator create a skill for API endpoint generation"

# Install community skill
codex "$skill-installer https://gist.github.com/user/skill.md"

# Create plan for complex task
codex "$create-plan implement OAuth authentication"
```

### Project-Specific Skills

Store skills in `.codex/skills/` at project root:

```
my-project/
├── .codex/
│   └── skills/
│       ├── deploy.md
│       ├── test-pattern.md
│       └── migration.md
├── src/
└── package.json
```

**Usage:**
```bash
cd my-project
codex --skill deploy "deploy to staging"
```

---

## MCP Integration

Codex supports MCP (Model Context Protocol) servers for extended capabilities.

### Enabling MCP

**In config.toml:**
```toml
mcp_servers = true

[mcp.filesystem]
enabled = true
root_dir = "~/"

[mcp.github]
enabled = true
token_env = "GITHUB_TOKEN"

[mcp.notion]
enabled = true
token_env = "NOTION_TOKEN"
```

### Available MCP Servers

**Built-in:**
- Filesystem operations
- Git integration
- Web search
- Database connections

**Community:**
- GitHub (issues, PRs, repos)
- Notion (pages, databases)
- Slack (messages, channels)
- Linear (tasks, projects)
- Stripe (payments, subscriptions)
- Vercel (deployments)
- And 1,400+ more

### Using MCP Tools

```bash
# GitHub integration
codex "create a PR for these changes"

# Notion integration
codex "update the project roadmap in Notion"

# Web search
codex "research best practices for React 19"

# Database
codex "analyze the users table and optimize slow queries"
```

---

## GitHub Integration

### Setup

```bash
# Install GitHub CLI
brew install gh  # macOS
# or download from cli.github.com

# Authenticate
gh auth login

# Enable in Codex config
# config.toml: github = true
```

### Features

#### @codex Mentions in PRs
Mention Codex in PR comments:

```
@codex review this code for security issues

@codex add tests for the new authentication flow

@codex refactor to use TypeScript 5.0 features
```

**Process:**
1. Codex reads PR diff
2. Analyzes code changes
3. Creates new commits or comments
4. Tags you for approval

#### @codex Mentions in Issues
Mention Codex in GitHub issues:

```
@codex implement the user profile feature from this spec

@codex fix bug #1234 - login fails on Safari

@codex migrate from Express to Fastify
```

**Process:**
1. Codex reads issue description
2. Creates implementation plan
3. Opens draft PR
4. Requests review

### Configuration

```toml
[integrations.github]
enabled = true
default_branch = "main"
require_approval = true  # Require human approval before pushing
auto_assign = true       # Assign PR to issue author
labels = ["codex", "ai"]  # Auto-add labels
```

### Workflows

**Code Review:**
```bash
# CLI
codex "review PR #123 for security and performance"

# In GitHub
# Comment on PR: @codex review this code
```

**Bug Fixing:**
```bash
# CLI
codex "fix issue #456"

# In GitHub
# Comment on issue: @codex please fix this bug
```

**Feature Implementation:**
```bash
# CLI
codex "implement feature from issue #789"

# In GitHub
# Comment on issue: @codex implement this feature
```

---

## Slack Integration

### Setup

```bash
# Install Codex Slack app
# Visit: https://slack.openai.com/install

# Configure in config.toml
[integrations.slack]
enabled = true
workspace_id = "T1234567890"
default_channel = "#dev"
```

### Usage

**In Slack channels:**
```
@codex help with this error: [paste error]

@codex review the code in PR #123

@codex explain how the authentication flow works
```

**DM Codex:**
```
/codex start session

@codex fix the failing tests in the CI pipeline

@codex refactor the payment processing module
```

### Notifications

Codex can send notifications to Slack:

```toml
[integrations.slack.notifications]
on_task_complete = true
on_error = true
on_approval_needed = true
channel = "#dev-notifications"
```

**Example notification:**
```
✅ Codex completed task: "Refactor auth module"
🔗 View changes: https://github.com/org/repo/pull/123
⏱️ Duration: 5m 32s
```

---

## Linear Integration

### Setup

```bash
# Get Linear API key
# Visit: linear.app/settings/api

# Configure in config.toml
[integrations.linear]
enabled = true
api_key_env = "LINEAR_API_KEY"
team_id = "TEAM123"
```

### Usage

**Assign tasks to Codex:**

In Linear, assign issue to "Codex Bot":
- Codex reads issue description
- Creates implementation plan
- Opens PR in linked GitHub repo
- Updates Linear issue with progress

**From CLI:**
```bash
# Work on Linear task
codex "implement Linear task PROJ-123"

# Update Linear issue
codex "update PROJ-456 with progress: authentication complete"

# Create new task
codex "create Linear task: add dark mode to dashboard"
```

### Workflows

**Automatic:**
1. Developer creates Linear issue
2. Assigns to Codex
3. Codex analyzes requirements
4. Creates PR
5. Updates Linear issue with PR link
6. Moves issue to "In Review"

**Manual:**
```bash
# From CLI
codex --linear PROJ-123 "implement this feature"

# From GitHub PR
# Comment: @codex link this to Linear issue PROJ-123
```

---

## Codex Cloud

### What is Codex Cloud?

Web-based autonomous coding agent for long-running tasks (1-30 minutes).

**Access:** [cloud.openai.com/codex](https://cloud.openai.com/codex)

### Features

**Sandboxed Environment:**
- Isolated container per task
- Full repository access
- Command execution
- Test running
- Build verification

**Autonomous Operation:**
- Multi-step planning
- Self-correction
- Progress tracking
- Error recovery

**GitHub Integration:**
- Clone any public/private repo
- Create branches
- Make commits
- Open PRs

### Usage

1. **Create Task:**
   ```
   Title: Migrate from Express to Fastify
   Description: Refactor all routes and middleware
   Repository: github.com/myorg/api
   Branch: feature/fastify-migration
   Time limit: 20 minutes
   ```

2. **Codex Plans:**
   - Analyze codebase
   - Identify all Express dependencies
   - Create migration steps
   - Estimate time

3. **Autonomous Execution:**
   - Install Fastify
   - Refactor route handlers
   - Update middleware
   - Run tests
   - Fix failures
   - Commit changes

4. **Results:**
   - PR opened
   - Test results
   - Migration notes
   - Recommendations

### Task Types

**Code Refactoring:**
```
Refactor authentication to use JWT instead of sessions
Estimated time: 15 minutes
```

**Bug Fixing:**
```
Fix memory leak in WebSocket handler (issue #789)
Estimated time: 10 minutes
```

**Feature Implementation:**
```
Add OAuth2 authentication with Google/GitHub
Estimated time: 25 minutes
```

**Testing:**
```
Add integration tests for payment flow
Estimated time: 20 minutes
```

### Monitoring

**Real-time progress:**
- View live logs
- See file changes
- Watch test execution
- Pause/resume/cancel

**Notifications:**
- Email on completion
- Slack notification
- GitHub PR created
- Linear issue updated

---

## Advanced Features

### Context Compaction (GPT-5.2-Codex)

For tasks requiring >196k tokens:

1. Codex reads entire codebase
2. Identifies relevant sections
3. Compacts context intelligently
4. Maintains full understanding

**Result:** Can refactor codebases for hours without losing context.

### Multi-File Editing

Codex can edit multiple files atomically:

```bash
codex "update all API routes to use Zod validation"
```

**Process:**
1. Analyze all route files
2. Generate Zod schemas
3. Update imports
4. Add validation middleware
5. Update tests
6. Create single atomic commit

### Image Understanding

```bash
# Screenshot to code
codex --image design.png "implement this UI"

# Error screenshot
codex --image error-screenshot.png "fix this error"

# Architecture diagram
codex --image architecture.png "implement this system"
```

### Code Review

```bash
# Security review
codex --review security "analyze for SQL injection, XSS, CSRF"

# Performance review
codex --review performance "identify bottlenecks"

# Best practices
codex --review standards "check against React best practices"
```

---

## Pricing

### ChatGPT Plans

| Plan | Codex Access | Monthly Cost |
|------|--------------|--------------|
| Free | ❌ | $0 |
| Plus | ✅ CLI + IDE | $20 |
| Pro | ✅ CLI + IDE + Cloud | $200 |
| Team | ✅ All features | $30/user |
| Business | ✅ All features + Admin | $60/user |
| Enterprise | ✅ All + Custom | Custom |

**What's included:**
- Unlimited Codex CLI usage
- IDE extension access
- MCP server integration
- GitHub/Slack/Linear integration

**Cloud limits:**
- Plus: 10 tasks/month
- Pro: 100 tasks/month
- Team/Business/Enterprise: Unlimited

### API Pricing

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| GPT-5.2-Codex | $30/1M | $120/1M | Production |
| GPT-5-Codex | $30/1M | $120/1M | General |
| GPT-5-Codex-Mini | $15/1M | $60/1M | Simple tasks |

**Batch API:** 50% discount (24-hour turnaround)

### On-Demand Credits

For CLI users without ChatGPT subscription:

- $10 = 100,000 tokens
- $50 = 600,000 tokens (20% bonus)
- $100 = 1,500,000 tokens (50% bonus)

**Estimate:**
- Simple task: 5,000-10,000 tokens ($0.50-$1)
- Medium refactor: 50,000-100,000 tokens ($5-$10)
- Large migration: 200,000-500,000 tokens ($20-$50)

---

## Best Practices

### Security

**DO:**
- Use `--read-only` for untrusted codebases
- Review all changes before committing
- Enable approval mode for writes
- Use environment variables for secrets
- Run in containers/VMs when possible

**DON'T:**
- Use `--full` mode in production repos
- Share your API keys with Codex
- Auto-approve destructive operations
- Run on live databases without backups

### Performance

**Optimize context:**
```bash
# Specify relevant files
codex --file src/auth/** "refactor authentication"

# Use skills for common patterns
codex --skill api-endpoint "create user CRUD endpoints"

# Provide clear instructions
codex "add error handling to payment flow - wrap in try/catch, 
log errors with Sentry, return user-friendly messages"
```

**Avoid:**
```bash
# Too vague
codex "make it better"

# Too broad
codex --file ** "update everything"
```

### Collaboration

**Team workflows:**
1. Create project-specific skills in `.codex/skills/`
2. Document patterns and standards
3. Use GitHub integration for PR reviews
4. Set up Slack notifications
5. Track Codex usage in Linear

**Example team skill:**

`.codex/skills/team-standards.md`:
```markdown
---
name: team-standards
description: Our team's coding standards
---

# Team Standards

- Use TypeScript strict mode
- All functions must have JSDoc comments
- Test coverage >80%
- Use Prettier for formatting
- Commit messages follow Conventional Commits
- No console.log in production code
```

---

## Troubleshooting

### Common Issues

**"Authentication failed"**
```bash
# Re-authenticate
codex auth logout
codex auth login
```

**"Context limit exceeded"**
```bash
# Use more specific file patterns
codex --file src/components/Button.tsx "add dark mode"

# Or use GPT-5.2-Codex with context compaction
codex --model gpt-5.2-codex "refactor entire auth system"
```

**"File changes not applied"**
```bash
# Check approval mode
codex config show approval_mode

# Ensure auto or full mode for writes
codex config set approval_mode auto
```

**"GitHub integration not working"**
```bash
# Verify GitHub CLI is authenticated
gh auth status

# Re-enable in config
codex config set integrations.github true

# Test connection
codex "list my GitHub repositories"
```

### Debugging

```bash
# Enable verbose logging
codex --verbose chat

# View logs
tail -f ~/.codex/logs/codex.log

# Check configuration
codex config show

# Test MCP servers
codex mcp list
codex mcp test filesystem
```

---

## Roadmap

### Confirmed (2026)

- **Mobile apps** (iOS, Android)
- **More IDE integrations** (JetBrains, Xcode)
- **Custom model fine-tuning**
- **Team dashboards** (usage, analytics)
- **Advanced security scanning**

### Rumored

- **Real-time pair programming**
- **Visual code generation** (Figma → code)
- **Automated testing framework**
- **CI/CD pipeline generation**
- **Multi-repo operations**

---

## Resources

### Official Documentation
- [Codex CLI Docs](https://docs.openai.com/codex/cli)
- [GitHub](https://github.com/openai/codex)
- [API Reference](https://platform.openai.com/docs/codex)

### Community
- [Codex Subreddit](https://reddit.com/r/OpenAICodex)
- [Discord](https://discord.gg/openai)
- [Forum](https://community.openai.com/c/codex)

### Learning
- [Video Tutorials](https://youtube.com/@OpenAI/codex)
- [Example Skills](https://github.com/openai/codex-skills)
- [Best Practices Guide](https://docs.openai.com/codex/best-practices)

---

**Last updated:** December 27, 2025
