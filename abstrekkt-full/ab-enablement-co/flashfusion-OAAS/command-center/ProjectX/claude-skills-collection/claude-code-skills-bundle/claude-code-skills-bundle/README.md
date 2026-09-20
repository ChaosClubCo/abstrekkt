# 🎯 Claude Code CLI Skills Bundle

**Production-ready, 64 specialized skills** for Claude Code power users.

- **Auto-discovers** when relevant to your task
- **Organized by domain**: document handling, security, development, design, DevOps, AI/ML
- **2025 compliant** with latest Claude Code architecture
- **Zero configuration** - just install and use

---

## 📦 What's Inside

### Document Skills (5)
- **docx** - Create, edit, analyze Word documents with tracked changes & comments
- **pdf** - Extract text, fill forms, merge PDFs
- **pptx** - Generate PowerPoint slides with layouts & animations
- **xlsx** - Create Excel sheets with formulas, charts, data analysis
- **frontend-design** - Professional frontend UI/UX patterns

### Security & Validation (8)
- **backend-dev-guidelines** - Production-grade Node.js/Express/TypeScript patterns
- **error-tracking** - Sentry v8 error tracking integration
- **code-auditor** - Comprehensive codebase security & quality analysis
- **code-transfer** - Line-based precision code transfers between files
- **code-execution** - Execute Python with marketplace API access (90%+ token savings)
- **code-refactor** - Bulk code refactoring (renaming, pattern replacement, updates)
- **route-tester** - Test authenticated routes with cookie-based auth
- **workflow-automation** - n8n, Zapier, Make automation patterns

### AI & Agents (5)
- **ai-agents-workflow** - LangChain, CrewAI, multi-LLM orchestration
- **create-agent-skills** - Expert guidance for building Claude Code Skills
- **create-subagents** - Build specialized agents using Task tool
- **create-meta-prompts** - Optimized prompts for Claude-to-Claude pipelines
- **mcp-builder** - Build MCP (Model Context Protocol) servers

### Code Quality & Testing (4)
- **test-fixing** - Detect & fix failing tests systematically
- **review-implementing** - Process & implement code review feedback
- **debug-like-expert** - Deep analysis debugging methodology
- **webapp-testing** - Playwright-based web app testing toolkit

### Planning & Architecture (7)
- **create-plans** - Hierarchical project plans for agentic development
- **create-slash-commands** - Custom slash commands for Claude Code
- **create-hooks** - PreToolUse/PostToolUse lifecycle hooks
- **feature-planning** - Break down features into implementable tasks
- **project-bootstrapper** - Setup new projects with best practices
- **architecture-diagram-creator** - System architecture visualization
- **codebase-documenter** - Generate codebase documentation

### Design & Content (10)
- **responsive-design-patterns** - CSS Grid, Flexbox, Container Queries for 2025
- **animation-motion-design** - Lottie, Framer Motion, GSAP, performance
- **advanced-ux-patterns** - Accessibility (WCAG 2.2), interaction patterns
- **advanced-visual-design** - Typography systems, color theory, composition
- **design-system-builder** - Scalable design systems & governance
- **dashboard-creator** - KPI cards, charts, data visualizations
- **timeline-creator** - Gantt charts, roadmaps, milestones
- **flowchart-creator** - Process diagrams, decision trees, swimlanes
- **technical-doc-creator** - API docs, syntax highlighting, architecture
- **ui-component-library** - React/Vue/JS reusable components

### Mac & Mobile (2)
- **build-macos-apps** - Native macOS apps in Swift/SwiftUI (CLI-only, no Xcode)
- **build-iphone-apps** - Native iPhone apps in Swift (iOS 18 compatible)

### DevOps & Infrastructure (5)
- **staff-engineer-v3** - Security-first systems architecture, STRIDE, OWASP
- **git-pushing** - Stage, commit, push with conventional commits
- **accountability-buddy** - Track habits, challenges, fitness, learning
- **skill-developer** - Create & manage Claude Code skills
- **skill-creator** - Templates for building skills

### Content & Communication (8)
- **skill-reminder** - Auto-remind Claude to check relevant skills
- **skill-packager** - Package skills for distribution
- **skill-troubleshooter** - Diagnose & fix skill issues
- **doc-coauthoring** - Structured workflow for co-authoring docs
- **internal-comms** - Internal communication templates
- **brand-guidelines** - Apply Anthropic branding
- **canvas-design** - Original visual art & design (PNG/PDF)
- **slack-gif-creator** - Animated GIFs optimized for Slack

### Automation & Utilities (7)
- **conversation-analyzer** - Analyze Claude Code conversation patterns
- **file-operations** - File metadata & analysis (size, line counts, stats)
- **flashfusion-ai-skill-pack** - FlashFusion AI orchestration
- **production-graphics** - Export-ready graphics (web/print/social)
- **professional-web-design** - Industry-standard web patterns
- **algorithmic-art** - p5.js generative art with seeded randomness
- **web-artifacts-builder** - Multi-component HTML artifacts (React, Tailwind, shadcn/ui)

---

## ⚡ Quick Start

### Installation (Choose One)

#### **Option 1: Copy to Personal Skills** (Recommended for individuals)
```bash
# Clone or download this repo
git clone <repo-url> claude-skills
cd claude-skills

# Copy all skills to your personal directory
cp -r skills/* ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/ | head -10
```

#### **Option 2: Copy to Project Skills** (Recommended for teams)
```bash
# In your project root
mkdir -p .claude/skills
cp -r skills/* .claude/skills/

# Commit to git
git add .claude/skills/
git commit -m "Add 64 Claude Code skills"
```

#### **Option 3: Use as Plugin** (Coming soon with marketplace)
```bash
# Inside Claude Code
/plugin marketplace add @anthropic-ai/claude-skills
/plugin install claude-skills
```

### Test Installation
```bash
# In Claude Code, ask it to use a skill
claude -p "Generate a Python FastAPI endpoint with error handling"

# Should auto-trigger: backend-dev-guidelines
```

---

## 🎯 Usage by Domain

### Want to build a web app?
→ Start with **responsive-design-patterns**, **frontend-dev-guidelines**, **professional-web-design**

### Want security?
→ Use **staff-engineer-v3**, **backend-dev-guidelines**, **code-auditor**

### Want to create documents?
→ Use **docx**, **pdf**, **pptx**, **xlsx** + **technical-doc-creator**, **doc-coauthoring**

### Want DevOps/infrastructure?
→ Use **create-plans**, **architecture-diagram-creator**, **skill-developer**

### Want AI agents?
→ Use **ai-agents-workflow**, **create-agent-skills**, **mcp-builder**

### Want to improve code quality?
→ Use **test-fixing**, **debug-like-expert**, **code-auditor**, **review-implementing**

---

## 📋 Skills Discovery

Claude **auto-discovers skills** when relevant. But you can also invoke manually:

```bash
# List all available skills
ls ~/.claude/skills/

# View a specific skill
cat ~/.claude/skills/staff-engineer-v3/SKILL.md

# Search for skills by name
ls ~/.claude/skills/ | grep -i security
```

---

## 🔧 Configuration

Each skill is **zero-config**. However, some skills require external tools:

| Skill | Requires |
|-------|----------|
| `code-execution` | Python 3.11+ |
| `webapp-testing` | Playwright, Node.js |
| `build-macos-apps` | macOS, Swift 5.9+ |
| `build-iphone-apps` | Xcode (via CLI), iOS 18+ SDK |
| `workflow-automation` | n8n, Zapier, Make accounts |

All other skills work **out of the box** with Claude Code.

---

## 📊 Skill Statistics

| Category | Count | Skills |
|----------|-------|--------|
| **Document Handling** | 5 | docx, pdf, pptx, xlsx, frontend-design |
| **Security & Code Quality** | 8 | backend-dev-guidelines, code-auditor, error-tracking, + more |
| **AI & Agents** | 5 | ai-agents-workflow, create-agent-skills, mcp-builder, + more |
| **Testing & Debugging** | 4 | test-fixing, debug-like-expert, webapp-testing, review-implementing |
| **Planning & Architecture** | 7 | create-plans, architecture-diagram-creator, feature-planning, + more |
| **Design & UX** | 10 | responsive-design, animation-motion-design, advanced-ux, + more |
| **DevOps & Infrastructure** | 5 | staff-engineer-v3, git-pushing, skill-developer, + more |
| **Mobile & Desktop** | 2 | build-macos-apps, build-iphone-apps |
| **Content & Communication** | 8 | doc-coauthoring, internal-comms, brand-guidelines, + more |
| **Automation & Utilities** | 7 | conversation-analyzer, production-graphics, algorithmic-art, + more |
| **TOTAL** | **64** | All skills production-ready |

---

## 🚀 Best Practices

### 1. **Discover Automatically**
Skills are designed to **auto-trigger** when relevant. Ask Claude naturally:
```bash
claude -p "I need to refactor this function to use dependency injection"
# → auto-triggers: code-refactor skill
```

### 2. **Read SKILL.md First**
When Claude suggests using a skill, read it first:
```bash
cat ~/.claude/skills/staff-engineer-v3/SKILL.md
```

### 3. **Combine Related Skills**
Chain skills for complex workflows:
```bash
# For API development:
1. Use: backend-dev-guidelines (structure)
2. Use: route-tester (validation)
3. Use: error-tracking (observability)
4. Use: test-fixing (quality gate)
```

### 4. **Keep Skills Current**
Skills follow 2025 Anthropic standards. Update quarterly:
```bash
cd claude-skills
git pull origin main
cp -r skills/* ~/.claude/skills/
```

---

## 🛠️ Maintenance

### Check Skill Health
```bash
# List skills by size
du -sh ~/.claude/skills/* | sort -h

# Find skills with problems
for skill in ~/.claude/skills/*/; do
  [ ! -f "$skill/SKILL.md" ] && echo "Missing SKILL.md: $skill"
done
```

### Remove a Skill
```bash
rm -rf ~/.claude/skills/skill-name/
git commit -m "Remove skill-name"
```

### Update a Skill
```bash
# From this repo
cp -r skills/my-skill ~/.claude/skills/my-skill
git add .claude/skills/my-skill/
git commit -m "Update my-skill"
```

---

## 📚 Documentation

Each skill includes:
- **SKILL.md** - Main instructions (required)
- **scripts/** - Executable code (optional)
- **references/** - Additional documentation (optional)
- **assets/** - Templates, resources (optional)

For detailed guidance on any skill:
```bash
cat ~/.claude/skills/skill-name/SKILL.md
```

---

## 🤝 Contributing

Found a bug or have a skill idea?
1. Open an issue: `github.com/anthropics/skills/issues`
2. Create a PR with your skill (use **skill-creator** skill!)
3. Follow [Contributing Guidelines](CONTRIBUTING.md)

---

## 📄 License

All skills are provided under **Apache 2.0** (public) or **source-available** (enterprise).
See individual skill folders for specific licensing.

---

## ✨ Getting Started

**First time?** Start here:
1. Install skills (Option 1 above)
2. Open Claude Code: `claude`
3. Ask something: `"Generate a TypeScript API with error handling"`
4. Watch Claude auto-trigger **backend-dev-guidelines** skill

**Questions?**
- Read CONTRIBUTING.md
- Check skill READMEs
- See Anthropic docs: https://code.claude.com/docs/en/skills

---

**Last Updated:** December 17, 2025
**Total Skills:** 64 | **Bundle Size:** 12MB | **Format:** Claude Code CLI Compatible
