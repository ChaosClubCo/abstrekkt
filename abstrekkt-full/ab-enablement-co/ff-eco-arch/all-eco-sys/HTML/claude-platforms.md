# Claude Platforms - Complete Guide

**Last Updated:** January 2025  
**Scope:** Claude.ai, Mobile (iOS/Android), Desktop, Claude Code (CLI)

---

## TL;DR

Claude is accessible across four platforms: **claude.ai** (web), **Mobile apps** (iOS/Android), **Claude Desktop** (macOS/Windows), and **Claude Code** (CLI for developers). All platforms share Projects and memory, with Desktop and CLI offering enhanced capabilities via MCP protocol (1,200+ servers).

---

## Platform Overview

| Platform | Access | Free Tier | Pro ($20/mo) | Best For |
|----------|--------|-----------|--------------|----------|
| **Claude.ai** | Web browser | ✅ | ✅ | General use, artifacts, research |
| **Mobile** | iOS/Android app | ✅ | ✅ | On-the-go, voice input, quick tasks |
| **Desktop** | macOS/Windows app | ✅ | ✅ | MCP integrations, local files, power users |
| **Claude Code** | CLI (npm/brew) | ❌ | ❌ | Developer workflows, automation, terminal |

---

## Claude.ai (Web Interface)

**Access:** [claude.ai](https://claude.ai)  
**Requirements:** Web browser, Google/email account

### Core Features

**Chat Interface:**
- Text conversations with all Claude models
- Model selection (Opus 4.1, Sonnet 4.5, Haiku 3.5)
- Streaming responses
- Conversation history
- Share conversations (public links)

**Artifacts:**
- Interactive code execution (HTML, React, SVG, Mermaid)
- Document creation (markdown, reports)
- Data visualization (charts, diagrams)
- Real-time editing and iteration
- Persistent storage for session

**Projects:**
- Up to 5 projects (free), unlimited (Pro)
- Custom instructions per project
- Project knowledge (up to 200K tokens)
- Team collaboration (Pro)
- Project-specific chat history

**File Uploads:**
- PDFs (up to 32MB, 100 pages)
- Images (PNG, JPEG, WebP, GIF - 5MB max)
- Text files (TXT, MD, JSON, CSV, XML)
- Code files (all major languages)
- Multiple files per conversation (up to 5 free, 10 Pro)

**Memory (Beta):**
- Personal preferences stored across conversations
- Context carried between chats
- Opt-in/opt-out control
- Privacy-focused (user controlled)

**Search & Citations:**
- Search past conversations
- Reference previous chats in new conversations
- Built-in web search (beta)

---

### Free vs Pro

| Feature | Free | Pro ($20/mo) |
|---------|------|--------------|
| **Usage** | Limited (varies by demand) | 5× more usage |
| **Priority Access** | ❌ | ✅ (during high demand) |
| **Projects** | 5 max | Unlimited |
| **File Uploads** | 5 per convo | 10 per convo |
| **Early Access** | ❌ | ✅ (new features) |
| **Model Access** | All models | All models + beta features |

---

## Mobile Apps

**Platforms:**
- iOS: [App Store](https://apps.apple.com/app/claude-by-anthropic)
- Android: [Google Play](https://play.google.com/store/apps/details?id=com.anthropic.claude)

### Features

**Core Capabilities:**
- Full chat interface
- Voice input (speech-to-text)
- Photo upload from camera/library
- File upload from cloud storage
- Projects sync with web/desktop
- Conversation history sync
- Memory sync
- Model selection

**Mobile-Specific:**
- Push notifications (conversation updates)
- Share to Claude (from other apps)
- Widget (quick access)
- Offline mode (view past conversations)
- Dark mode

**Limitations:**
- No MCP support
- No computer use
- No artifacts rendering (yet - planned)
- Fewer file uploads (3 per conversation)

---

## Claude Desktop

**Platforms:**
- macOS: [Download](https://claude.ai/download)
- Windows: [Download](https://claude.ai/download)
- Linux: Not officially supported (use web)

**Requirements:**
- macOS 11+ or Windows 10+
- 4GB RAM minimum, 8GB recommended

### Features

**Enhanced Capabilities:**
- **MCP (Model Context Protocol):** Connect to 1,200+ servers
- **Local file access:** Read/write files on your computer
- **System integration:** Terminal, clipboard, notifications
- **Multiple workspaces:** Separate environments
- **Keyboard shortcuts:** Power user efficiency

**MCP Integrations (Examples):**
- **Filesystem:** Read/write local files
- **GitHub:** Repository access, PR creation
- **Google Drive:** File search, document access
- **Slack:** Message search, channel access
- **Notion:** Database queries, page creation
- **PostgreSQL:** Database queries
- **Memory:** Persistent storage across sessions
- **Puppeteer:** Web scraping, browser automation

**How to Enable MCP:**
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// %APPDATA%\Claude\claude_desktop_config.json (Windows)
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Documents"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

**Desktop-Only Features:**
- Drag-and-drop files directly into chat
- System tray integration
- Auto-updates
- Offline conversation viewing

---

## Claude Code (CLI)

**What It Is:**  
Command-line interface for Claude, purpose-built for developer workflows and automation.

**Installation:**
```bash
# npm
npm install -g @anthropic-ai/claude-cli

# Homebrew (macOS/Linux)
brew install claude-cli

# Verify
claude --version
```

**Setup:**
```bash
# Set API key
claude auth login
# or
export ANTHROPIC_API_KEY=your_key_here

# Verify
claude auth status
```

### Core Features

**Interactive Chat:**
```bash
# Start interactive session
claude chat

# Single prompt
claude "Explain quantum computing"

# With file context
claude "Review this code" --file main.py

# Model selection
claude "Complex task" --model claude-opus-4.1
```

**MCP Integration:**
```bash
# List available MCP servers
claude mcp list

# Use MCP server
claude "Search my GitHub repos for auth logic" --mcp github

# Multiple MCP servers
claude "Analyze data.csv and save to Notion" --mcp filesystem,notion
```

**Tool Use:**
```bash
# Enable tool use
claude "What's the weather in SF?" --tools

# Custom tools
claude "Deploy to production" --tools deploy.json
```

**Batch Processing:**
```bash
# Process multiple prompts
cat prompts.txt | claude --batch

# Process files
claude "Summarize these" --files *.md --batch
```

**Streaming:**
```bash
# Enable streaming
claude "Write essay" --stream

# Disable streaming
claude "Quick question" --no-stream
```

**Configuration:**
```bash
# Set default model
claude config set model claude-sonnet-4.5

# Set temperature
claude config set temperature 0.7

# View config
claude config list
```

### Advanced Features

**Projects:**
```bash
# Create project
claude project create "My Project"

# Add knowledge
claude project add-knowledge README.md

# Use project context
claude --project "My Project" "Question about the project"
```

**Prompt Caching:**
```bash
# Enable caching (auto-detects repeated context)
claude "Question 1" --file large-doc.pdf
claude "Question 2" --file large-doc.pdf  # Uses cache

# Explicit cache control
claude "Analyze" --cache-context
```

**Output Formatting:**
```bash
# JSON output
claude "List features" --format json

# Markdown
claude "Write doc" --format markdown

# Plain text
claude "Simple answer" --format text
```

**Plugins (1,200+ Available):**
```bash
# Install plugin
claude plugin install @anthropic/github

# List installed
claude plugin list

# Use plugin
claude "Create PR" --plugin github
```

### Use Cases

**Code Review:**
```bash
# Review changes
git diff | claude "Review these changes for security issues"

# Review PR
claude "Review PR #123" --mcp github --project myrepo
```

**Documentation:**
```bash
# Generate README
claude "Generate README from codebase" --files src/*.ts

# API docs
claude "Generate API docs" --file api.yaml --format markdown > docs/API.md
```

**Data Analysis:**
```bash
# Analyze CSV
claude "Summarize this data" --file data.csv

# Generate SQL
claude "Create SQL query for monthly revenue" --mcp postgres
```

**Automation:**
```bash
#!/bin/bash
# analyze.sh
for file in *.log; do
  claude "Summarize errors in $file" --file $file >> report.md
done
```

---

## Platform Comparison

### Feature Matrix

| Feature | Claude.ai | Mobile | Desktop | Claude Code |
|---------|-----------|--------|---------|-------------|
| **Chat** | ✅ | ✅ | ✅ | ✅ |
| **Vision** | ✅ | ✅ | ✅ | ✅ |
| **Artifacts** | ✅ | ❌ | ✅ | ❌ |
| **Projects** | ✅ | ✅ | ✅ | ✅ |
| **Memory** | ✅ | ✅ | ✅ | ❌ |
| **MCP** | ❌ | ❌ | ✅ | ✅ |
| **Tool Use** | ✅ (beta) | ❌ | ✅ | ✅ |
| **Batch Processing** | ❌ | ❌ | ❌ | ✅ |
| **Automation** | ❌ | ❌ | ❌ | ✅ |
| **Local Files** | Upload only | Upload only | Read/write | Read/write |
| **Voice Input** | ❌ | ✅ | ❌ | ❌ |

### When to Use Which Platform

**Claude.ai:**
- General research and writing
- Creating artifacts (code, docs, visualizations)
- Collaborative work (shared links)
- No installation required

**Mobile:**
- On-the-go access
- Voice input for hands-free
- Quick lookups and tasks
- Photo analysis

**Desktop:**
- Power users with MCP integrations
- Local file manipulation
- System-level tasks
- Heavy research workflows

**Claude Code:**
- Developer workflows
- CI/CD automation
- Batch processing
- Terminal-based tasks
- Scripting and automation

---

## Cross-Platform Features

### Projects (All Platforms)

**What Are Projects:**
- Dedicated workspaces with custom instructions
- Project-specific knowledge base (up to 200K tokens)
- Isolated conversation history
- Team collaboration (Pro)

**How to Use:**
```
1. Create project: "My Research Project"
2. Add custom instructions: "You are a research assistant specializing in climate science"
3. Upload knowledge: research-papers.pdf, dataset.csv
4. Start chatting: Context automatically included
```

**Sync Behavior:**
- Projects sync across claude.ai, mobile, desktop
- Claude Code requires explicit project selection
- Real-time updates across devices

### Memory (All Platforms Except CLI)

**What It Is:**
- Personal preferences stored across conversations
- Automatic context retention
- User-controlled (can view, edit, delete)

**Examples:**
- "I'm a Python developer" → Claude remembers language preference
- "I prefer concise answers" → Adjusts response style
- "I work in healthcare" → Uses domain-appropriate examples

**Privacy:**
- Opt-in feature (disabled by default)
- Stored per user, not shared
- Can be cleared anytime
- Not used for model training

---

## Pricing & Access

| Platform | Free Access | Pro Access ($20/mo) | Enterprise |
|----------|-------------|---------------------|------------|
| **Claude.ai** | ✅ Limited usage | ✅ 5× more usage | Custom |
| **Mobile** | ✅ | ✅ | Custom |
| **Desktop** | ✅ | ✅ | Custom |
| **Claude Code** | ❌ API key required | ❌ API key required | ✅ |

**API Pricing (for Claude Code):**
- Charged per token (see claude-models.md)
- Prompt caching: 90% discount on cached reads
- Batch API: 50% discount

---

## Getting Started

### Quick Start (Claude.ai)
1. Visit [claude.ai](https://claude.ai)
2. Sign in with Google or email
3. Start chatting
4. Create a project (optional)
5. Upload files (optional)

### Quick Start (Mobile)
1. Download app (iOS/Android)
2. Sign in (same account as web)
3. Grant permissions (camera, files)
4. Start chatting
5. Try voice input

### Quick Start (Desktop)
1. Download from [claude.ai/download](https://claude.ai/download)
2. Install and launch
3. Sign in
4. Configure MCP servers (optional)
5. Start chatting with enhanced capabilities

### Quick Start (Claude Code)
1. Install: `npm install -g @anthropic-ai/claude-cli`
2. Authenticate: `claude auth login`
3. Test: `claude "Hello"`
4. Configure MCP: Edit config file
5. Explore: `claude --help`

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Claude Desktop supports MCP with 1,200+ servers  
**SOURCE:** [docs.anthropic.com/mcp](https://docs.anthropic.com/mcp)  
**STATUS:** Verified January 2025

**CLAIM:** Claude Pro costs $20/month  
**SOURCE:** [claude.ai/pricing](https://claude.ai/pricing)  
**STATUS:** Verified January 2025

**CLAIM:** All platforms support Projects and sync  
**SOURCE:** [claude.ai/help](https://claude.ai/help)  
**STATUS:** Verified January 2025

**COUNTEREXAMPLE:** Mobile does NOT support MCP - only Desktop and CLI

**CONTRADICTION:** Some features (artifacts on mobile) may be rolling out - check app version
