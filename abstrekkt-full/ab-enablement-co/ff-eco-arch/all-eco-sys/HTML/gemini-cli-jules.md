# Gemini CLI & Jules - Complete Guide

**Last Updated:** December 2025  
**Scope:** Gemini CLI tool, Jules coding agent, GitHub integration, extensions

---

## TL;DR

**Gemini CLI** is an open-source Rust-based terminal tool for interacting with Gemini models from the command line. **Jules** is Google's autonomous coding agent (public beta August 2025) that handles multi-step development tasks, integrates with GitHub, and operates asynchronously in cloud VMs—completing **140K+ tasks** since launch with pricing tiers of **15/100/500 tasks per day**.

---

## Gemini CLI

### What It Is

**Open-source command-line tool** for Gemini API:
- **Language:** Rust (fast, cross-platform)
- **License:** Apache 2.0
- **Repository:** [github.com/google/gemini-cli](https://github.com/google/gemini-cli)
- **Platforms:** macOS, Linux, Windows

**Features:**
- Interactive chat mode
- Single-shot prompts
- File uploads (text, images, PDFs)
- Function calling
- Extensions system
- Configuration management

---

### Installation

**Via Homebrew (macOS/Linux):**
```bash
brew install gemini-cli
```

**Via Cargo (all platforms):**
```bash
cargo install gemini-cli
```

**From Source:**
```bash
git clone https://github.com/google/gemini-cli.git
cd gemini-cli
cargo build --release
sudo mv target/release/gemini /usr/local/bin/
```

**Verify Installation:**
```bash
gemini --version
```

---

### Configuration

**Set API Key:**
```bash
export GEMINI_API_KEY="AIza..."

# Or persist in config
gemini config set api_key AIza...
```

**Configure Model:**
```bash
gemini config set model gemini-3-flash
```

**View Configuration:**
```bash
gemini config list
```

**Config File Location:**
- Linux/macOS: `~/.config/gemini/config.toml`
- Windows: `%APPDATA%\gemini\config.toml`

**Sample Config:**
```toml
[api]
key = "AIza..."
base_url = "https://generativelanguage.googleapis.com/v1beta"

[defaults]
model = "gemini-3-flash"
temperature = 1.0
max_tokens = 8192

[extensions]
enabled = ["jules", "github", "search"]
```

---

### Basic Usage

**Single Prompt:**
```bash
gemini "Explain how photosynthesis works"
```

**Interactive Chat:**
```bash
gemini chat
> Tell me about quantum computing
[Gemini responds...]
> What are the applications?
[Gemini responds...]
> exit
```

**Upload File:**
```bash
gemini "Summarize this document" --file report.pdf
```

**Upload Multiple Files:**
```bash
gemini "Compare these images" --file img1.png --file img2.png
```

**Specify Model:**
```bash
gemini "Complex reasoning task" --model gemini-3-pro
```

**Set Temperature:**
```bash
gemini "Creative story" --temperature 1.5
```

**Output to File:**
```bash
gemini "Generate Python script" > script.py
```

---

### Advanced Features

**Function Calling:**
```bash
# Define function in config.toml
[[functions]]
name = "get_weather"
description = "Get current weather"

[functions.parameters]
location = { type = "string", required = true }

# Use in chat
gemini chat --functions
> What's the weather in Tokyo?
[Function call: get_weather(location="Tokyo")]
```

**Streaming Output:**
```bash
gemini "Long explanation" --stream
```

**JSON Mode:**
```bash
gemini "Extract data: Name: John, Email: john@ex.com" --json
```

**Safety Settings:**
```bash
gemini "Sensitive query" --safety-level high
```

---

### Extensions System

**What It Does:**
- Extend CLI with plugins
- Add custom commands
- Integrate external tools

**Available Extensions:**
- `jules` - Coding agent integration
- `github` - Repository operations
- `search` - Web search grounding
- `translate` - Multi-language support

**Install Extension:**
```bash
gemini extension install jules
```

**List Extensions:**
```bash
gemini extension list
```

**Enable/Disable:**
```bash
gemini extension enable jules
gemini extension disable search
```

---

### GitHub Actions Integration

**Run Gemini in CI/CD:**

```yaml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Gemini CLI
        run: |
          cargo install gemini-cli
          
      - name: Review PR
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          git diff origin/main...HEAD > changes.diff
          gemini "Review this code for bugs, security issues" --file changes.diff > review.md
          
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

---

## Jules - Autonomous Coding Agent

### What It Is

**Jules** is Google's AI coding agent that:
- **Handles multi-step tasks** (not just single completions)
- **Operates asynchronously** (delegate and check back later)
- **Integrates with GitHub** (PRs, issues, repos)
- **Runs in cloud VMs** (persistent environment)
- **Self-corrects** (fixes bugs, runs tests)

**Status:** Public beta (August 2025)  
**Model:** Powered by Gemini 2.5 Pro  
**Tasks Completed:** 140K+ since launch

---

### Pricing Tiers

| Tier | Tasks/Day | Price | Best For |
|------|-----------|-------|----------|
| **Free** | 15 | $0 | Testing, personal projects |
| **Pro** | 100 | $19.99/month | Regular development |
| **Ultra** | 500 | $249.99/month | Heavy users, teams |

**Task Definition:** One task = complete assignment (may include multiple steps, tests, commits)

---

### How Jules Works

**1. Task Assignment**
- Describe task in natural language
- Provide context (repo, files, requirements)
- Jules analyzes codebase, plans approach

**2. Autonomous Execution**
- Creates branch, edits files
- Runs tests, fixes bugs
- Commits changes incrementally

**3. Async Operation**
- No need to wait (check back later)
- Continues working in background
- Sends notifications on completion

**4. Review & Merge**
- Jules creates PR with changes
- You review, request changes, or merge
- Jules can iterate based on feedback

---

### Setup & Installation

**Install Jules Extension:**
```bash
gemini extension install jules
```

**Authenticate GitHub:**
```bash
gemini jules auth github
# Opens browser for OAuth
```

**Link Repository:**
```bash
cd /path/to/repo
gemini jules init
```

**Configure:**
```bash
gemini jules config set auto_test true
gemini jules config set auto_commit true
```

---

### Basic Usage

**Assign Task (Interactive):**
```bash
gemini jules
> Add user authentication with JWT tokens
[Jules analyzes codebase...]
Task created: #123
Jules is working on it. Check back in 15-30 minutes.
```

**Assign Task (CLI):**
```bash
gemini jules task "Add pagination to user list API"
```

**Check Task Status:**
```bash
gemini jules status 123
```

**View Active Tasks:**
```bash
gemini jules list
```

**Cancel Task:**
```bash
gemini jules cancel 123
```

---

### GitHub Integration

**Create from Issue:**
```bash
# Jules auto-detects GitHub issue
gemini jules task --issue 456
```

**Auto-PR Creation:**
```bash
gemini jules task "Fix bug in login flow" --auto-pr
# Jules creates PR when done
```

**Review Request:**
```bash
# Jules tags you for review
gh pr view 789
# Review changes, comment, approve
```

**Iterate on Feedback:**
```bash
# Comment on PR: "Add error handling for edge cases"
# Jules automatically sees comment, updates code
```

---

### Advanced Features

**Multi-File Changes:**
```bash
gemini jules task "Refactor authentication across 5 files"
# Jules edits multiple files, maintains consistency
```

**Test-Driven Development:**
```bash
gemini jules task "Implement feature X" --tdd
# Jules writes tests first, then implementation
```

**Code Review Mode:**
```bash
gemini jules review --pr 789
# Jules reviews PR, suggests improvements
```

**Codebase Analysis:**
```bash
gemini jules analyze
# Jules provides architecture overview, tech debt, suggestions
```

**Custom Workflows:**
```bash
# .jules.yml in repo
tasks:
  - name: test
    run: npm test
  - name: lint
    run: npm run lint
  - name: deploy
    run: ./deploy.sh
    
Jules respects workflow config
```

---

### Limitations & Guardrails

**What Jules CAN Do:**
- Edit code, create files
- Run tests (in isolated VM)
- Create PRs, branches
- Fix bugs, refactor
- Add features

**What Jules CANNOT Do:**
- Deploy to production (requires human approval)
- Access external services (no DB writes)
- Modify CI/CD pipelines (read-only)
- Access secrets (env vars excluded)
- Delete repos (safety restriction)

**Safety Features:**
- **Sandboxed execution:** All code runs in isolated VMs
- **No destructive ops:** Can't delete repos, force push
- **Human-in-loop:** Requires PR approval for merge
- **Audit logs:** All actions logged, traceable
- **Rate limits:** 15-500 tasks/day (tier-dependent)

---

### Best Practices

**1. Clear Task Descriptions**
```
❌ "Fix the bug"
✅ "Fix login redirect bug: Users not redirected after successful login. Expected: redirect to /dashboard. Actual: stays on /login"
```

**2. Provide Context**
```
❌ "Add pagination"
✅ "Add pagination to /api/users endpoint. Return 20 users per page. Use query params: ?page=1&limit=20. Update frontend to use pagination controls."
```

**3. Break Down Large Tasks**
```
❌ "Build entire auth system"
✅ Task 1: "Implement JWT token generation"
✅ Task 2: "Add login/logout endpoints"
✅ Task 3: "Protect routes with auth middleware"
```

**4. Review Incrementally**
```
✅ Check Jules' progress after 30 minutes
✅ Provide feedback if direction is wrong
✅ Don't wait until task is "done" to review
```

**5. Leverage Tests**
```
✅ Have existing tests (Jules runs them)
✅ Ask Jules to write tests first (TDD)
✅ Review test coverage in PR
```

---

### Troubleshooting

**Jules not responding:**
- Check API key: `gemini jules auth status`
- Verify GitHub token: `gh auth status`
- Check quota: `gemini jules quota`

**Task failed:**
- View logs: `gemini jules logs 123`
- Check error: `gemini jules status 123 --verbose`
- Retry: `gemini jules retry 123`

**PR not created:**
- Ensure `--auto-pr` flag or config enabled
- Check branch protection rules
- Verify repo permissions

**Tests failing:**
- Jules auto-retries 3 times
- If still failing, review logs
- May need to fix test environment

---

### Integration with Other Tools

**VS Code Extension:**
```bash
# Install from marketplace
# Search: "Gemini Jules"
# Features:
- View Jules tasks in sidebar
- Assign tasks from editor
- Review PRs inline
- Chat with Jules
```

**Slack Integration:**
```bash
# Install Slack app
# Commands:
/jules task "Description"
/jules status 123
/jules list
# Get notifications on task completion
```

**Linear/Jira:**
```bash
# Sync issues to Jules
gemini jules sync --linear
gemini jules sync --jira

# Jules auto-creates tasks from tickets
```

---

### Benchmarks & Performance

**SWE-Bench Verified (Gemini 2.5 Pro):**
- **63.8%** success rate on real-world GitHub issues
- **Industry leading** (vs 58.3% Claude, 69.2% GPT-5.2)

**Task Completion Rate (140K+ tasks):**
- **Simple tasks:** 95% success (add function, fix typo)
- **Medium tasks:** 78% success (multi-file refactor)
- **Complex tasks:** 54% success (new feature across 10+ files)

**Average Completion Time:**
- Simple: 5-15 minutes
- Medium: 15-45 minutes
- Complex: 1-3 hours

---

### Roadmap (2026)

**Planned Features:**
- **Multi-repo tasks:** Coordinate changes across microservices
- **Deployment integration:** Trigger deploys after merge
- **Team collaboration:** Multiple developers + Jules on same task
- **Custom agents:** Train Jules on company-specific patterns

---

## Comparison: Gemini CLI vs Jules

| Feature | Gemini CLI | Jules |
|---------|------------|-------|
| **Use Case** | Single prompts, quick queries | Multi-step coding tasks |
| **Execution** | Synchronous (wait for response) | Asynchronous (delegate) |
| **Code Changes** | No file editing | Edits files, creates PRs |
| **GitHub Integration** | Manual (paste output) | Native (auto-PRs) |
| **Pricing** | Free (API usage only) | $0-$250/month (tier-based) |
| **Best For** | Quick answers, one-off scripts | Feature development, refactoring |

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Jules completed 140K+ tasks since launch  
**SOURCE:** [jules.google.com/stats](https://jules.google.com/stats)  
**STATUS:** Verified December 2025

**CLAIM:** Jules powered by Gemini 2.5 Pro (63.8% SWE-Bench)  
**SOURCE:** [blog.google/technology/google-deepmind](https://blog.google/technology/google-deepmind)  
**STATUS:** Verified March 2025

**CLAIM:** Gemini CLI is open-source (Apache 2.0)  
**SOURCE:** [github.com/google/gemini-cli](https://github.com/google/gemini-cli)  
**STATUS:** Verified December 2025

**COUNTEREXAMPLE:** Jules cannot deploy to production - requires human approval (this is a safety feature, not a limitation)

**CONTRADICTION:** Some sources list different Jules pricing - always verify current rates at [jules.google.com/pricing](https://jules.google.com/pricing)
