---
name: github-workflows
description: Comprehensive GitHub Actions expertise covering CI/CD pipelines, PR automation, repository management, security workflows, and advanced automation patterns for development teams. Use when building, debugging, or optimizing technical implementations.
---

# Claude Code Essentials for GitHub Workflows

When building and maintaining GitHub Actions workflows, Claude Code transforms what was once a tedious cycle of commit-push-wait-debug into an interactive, local-first development experience. By combining terminal execution with checkpoint safety and intelligent planning, you can author, test, and deploy complex CI/CD pipelines without ever leaving your development environment.

## Why These 12 Concepts Matter

**Core concepts** form the foundation of every workflow authoring session: Code Execution lets you validate YAML syntax and test actions locally, Terminal CLI puts GitHub's own `gh` tool at your fingertips, and Checkpoints protect you from breaking changes as you iterate.

**Power concepts** accelerate multi-file workflow design: GitHub Actions integration means Claude can trigger and monitor real CI runs, Inline Diffs show you exactly what changed in each workflow file before you commit, and Git Worktrees let you test workflow variants on parallel branches simultaneously.

**Advanced concepts** enable full automation pipelines: Headless Mode lets you run Claude in your own CI to auto-fix failing workflows, Hooks enforce validation rules before any workflow file is saved, and Plan Mode maps out complex multi-job dependency chains before writing a single line of YAML.

## The 12 Concepts

### 1. Code Execution
**What it is:** Claude runs shell commands directly in your environment -- linting YAML, testing with `act`, and validating workflow syntax in real-time.
**Why it matters:** Workflow YAML errors are notoriously hard to debug from GitHub's UI alone. Local execution catches issues before they ever reach CI.
**Example:**
```bash
# Claude validates your workflow locally before pushing
actionlint .github/workflows/ci.yml
act push --job test --dry-run
```

### 2. Terminal CLI
**What it is:** Command-line interface for running Claude Code directly in your terminal alongside GitHub CLI tools.
**Why it matters:** You can chain `gh` commands with Claude's intelligence -- querying workflow run status, downloading logs, and diagnosing failures all in one session.
**Example:**
```bash
# Claude uses gh CLI to inspect failing workflow runs
gh run list --workflow=ci.yml --status=failure --limit=5
gh run view 12345 --log-failed
```

### 3. Checkpoints
**What it is:** Git-based snapshots that let you undo changes and restore to a known good state instantly.
**Why it matters:** When experimenting with workflow concurrency groups, matrix strategies, or caching configurations, checkpoints let you roll back failed experiments without losing progress.
**Example:**
```
# Claude creates a checkpoint before restructuring your CI pipeline
# If the new matrix strategy breaks, revert instantly to the working version
```

### 4. GitHub Actions
**What it is:** CI/CD integration that runs Claude Code agents automatically on GitHub events like pushes, PRs, and issues.
**Why it matters:** Claude can be embedded directly into your GitHub Actions as a step -- reviewing PRs, auto-fixing lint errors, or generating release notes on every push.
**Example:**
```yaml
# Claude Code as a GitHub Action step
- name: Auto-fix workflow issues
  uses: anthropics/claude-code-action@v1
  with:
    prompt: "Review and fix any issues in the workflow files"
```

### 5. Inline Diffs
**What it is:** Side-by-side visualization of code changes Claude proposes before applying them to workflow files.
**Why it matters:** Workflow changes can have cascading effects across jobs and environments. Reviewing diffs before applying ensures you understand every modification to your CI pipeline.
**Example:**
```
# Claude shows the diff before modifying your release workflow:
# - runs-on: ubuntu-latest
# + runs-on: ubuntu-22.04
# Adding explicit version pin for reproducibility
```

### 6. Git Worktrees
**What it is:** Multiple working directories from the same repo, enabling parallel work on different branches.
**Why it matters:** Test a workflow refactor on one branch while keeping your stable CI running on another -- no stashing, no context switching.
**Example:**
```bash
# Claude creates a worktree to test a new caching strategy
git worktree add ../my-app-workflow-test feature/optimize-ci
# Test the new workflow independently while main stays clean
```

### 7. Plan Mode
**What it is:** Claude explores and plans before making changes, creating a step-by-step strategy for complex workflow modifications.
**Why it matters:** Multi-job CI pipelines with dependencies, matrix builds, and conditional execution require careful planning to avoid breaking the dependency graph.
**Example:**
```
Plan: Restructure CI pipeline for parallelism
1. Analyze current job dependency chain
2. Identify independent jobs that can run in parallel
3. Add path-based change detection to skip unnecessary jobs
4. Implement shared dependency caching across jobs
5. Add concurrency groups to prevent resource waste
```

### 8. Headless Mode
**What it is:** Run Claude Code non-interactively for scripting, CI/CD, and automation pipelines.
**Why it matters:** Use Claude in your own CI to auto-detect and fix workflow issues, generate changelogs, or validate workflow configurations on every commit.
**Example:**
```bash
# Auto-fix workflow lint errors in CI
claude -p "Fix all actionlint errors in .github/workflows/" --output-format json
```

### 9. Hooks
**What it is:** Shell commands that execute automatically before or after Claude Code events like file writes.
**Why it matters:** Enforce workflow validation rules automatically -- run `actionlint` before any `.yml` file under `.github/workflows/` is saved.
**Example:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit",
      "command": "if echo '$FILE_PATH' | grep -q '.github/workflows'; then actionlint '$FILE_PATH'; fi"
    }]
  }
}
```

### 10. CLAUDE.md
**What it is:** A project configuration file that tells Claude your workflow conventions, naming patterns, and CI requirements.
**Why it matters:** Ensures every workflow Claude generates follows your team's standards for runner selection, caching strategies, and notification patterns.
**Example:**
```markdown
# CLAUDE.md
## CI/CD Conventions
- Use ubuntu-22.04 (not ubuntu-latest) for reproducibility
- All workflows must include concurrency groups
- Use pnpm with frozen lockfile for Node.js projects
- Required status checks: typecheck, lint, test, build
```

### 11. Slash Commands
**What it is:** Quick shortcuts that invoke predefined skills or workflows with a single command.
**Why it matters:** Create a `/fix-ci` command that automatically diagnoses and repairs failing workflows, or `/new-workflow` to scaffold a complete pipeline from a template.
**Example:**
```bash
# Custom slash command: .claude/commands/fix-ci.md
# "Analyze the most recent failed CI run and fix the issues"
claude> /fix-ci
```

### 12. Artifacts
**What it is:** Standalone content blocks that Claude creates alongside conversation for review and iteration.
**Why it matters:** Claude can generate complete workflow files as artifacts, letting you preview the full YAML structure before committing it to your repository.
**Example:**
```
# Claude generates a complete release workflow as an artifact
# You review the full YAML, request changes, then apply it
```

## How These Concepts Work Together

A typical GitHub workflow development session with Claude Code follows a natural progression. You start in **Plan Mode** to map out a complex CI pipeline restructuring, identifying which jobs can run in parallel and where caching will have the most impact. **CLAUDE.md** ensures Claude follows your team's conventions from the start.

Claude then uses **Code Execution** to validate each change locally with `actionlint` and test runs via `act`, while **Checkpoints** protect your progress at each successful step. **Inline Diffs** let you review every YAML modification before it lands, and **Git Worktrees** allow testing the new pipeline on a feature branch without disrupting the stable CI on main.

Once the workflow is ready, **Hooks** automatically validate the YAML on every save, **GitHub Actions** integration can embed Claude directly into your pipeline for ongoing maintenance, and **Headless Mode** enables automated workflow health checks in CI.

### Quick Workflow
1. Plan the pipeline structure with **Plan Mode**
2. Generate workflow YAML with **Code Execution** for local validation
3. Review changes via **Inline Diffs** before committing
4. Test on a parallel branch using **Git Worktrees**
5. Protect progress with **Checkpoints** at each milestone
6. Enforce standards with **Hooks** and **CLAUDE.md**
7. Automate ongoing maintenance with **Headless Mode** and **GitHub Actions**

## Next Steps

- **gitops-workflow** -- Connect your GitHub workflows to GitOps deployment pipelines
- **test-fixing** -- Use Claude to diagnose and fix test failures surfaced by CI
- **bash-defensive-patterns** -- Write robust shell scripts for your workflow steps

---

# GitHub Workflows

## Overview

GitHub Workflows enable powerful automation for software development lifecycles through GitHub Actions. This skill covers the complete spectrum of workflow automation, from basic CI/CD pipelines to advanced multi-repository orchestration and security scanning.

Effective GitHub automation transforms manual, error-prone processes into reliable, repeatable workflows. Beyond simple build-and-test pipelines, modern GitHub workflows encompass dependency management, security scanning, release automation, and cross-repository coordination.

This skill provides production-tested patterns for common automation scenarios while addressing advanced topics like workflow composition, matrix builds, caching strategies, and self-hosted runners. The focus is on maintainable, efficient workflows that scale with team growth.

### Why This Matters

- **Developer velocity**: Automated checks provide instant feedback on code quality
- **Consistency**: Every PR goes through identical validation regardless of author
- **Security**: Automated scanning catches vulnerabilities before they reach production
- **Release reliability**: Automated releases reduce human error in deployment processes
- **Collaboration**: PR automation keeps reviews moving and stakeholders informed

## When to Use

### Primary Triggers

- "Set up CI/CD for our repository"
- "Automate our release process"
- "Add security scanning to our workflows"
- "Create automated PR checks"
- "Set up dependency updates"
- "Automate issue management"
- "Configure branch protection with required checks"

### Specific Use Cases

1. **CI Pipeline**: Build, test, lint on every push and PR
2. **CD Pipeline**: Automated deployments to staging/production
3. **Release Automation**: Version bumping, changelog generation, GitHub releases
4. **Security Workflows**: Dependency scanning, SAST, secret detection
5. **PR Automation**: Labeling, assignment, stale PR handling
6. **Repository Maintenance**: Dependency updates, issue templates

## Core Processes

### Process 1: Comprehensive CI Pipeline

**Objective**: Create a robust CI pipeline with caching, matrix builds, and parallel jobs.

**Full CI Workflow**:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  # Determine what changed to optimize pipeline
  changes:
    runs-on: ubuntu-latest
    outputs:
      src: ${{ steps.changes.outputs.src }}
      docs: ${{ steps.changes.outputs.docs }}
      deps: ${{ steps.changes.outputs.deps }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            src:
              - 'src/**'
              - 'app/**'
              - 'lib/**'
            docs:
              - 'docs/**'
              - '*.md'
            deps:
              - 'package.json'
              - 'pnpm-lock.yaml'

  # Install dependencies (shared across jobs)
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

  # Type checking
  typecheck:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

      - run: pnpm typecheck

  # Linting
  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

      - run: pnpm lint

  # Unit tests with coverage
  test:
    needs: [setup, changes]
    if: needs.changes.outputs.src == 'true' || needs.changes.outputs.deps == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Run tests
        run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info

  # Build verification
  build:
    needs: [typecheck, lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Build
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next
          retention-days: 7

  # E2E tests (only on main branch or labeled PRs)
  e2e:
    needs: build
    if: github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'run-e2e')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps chromium

      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: .next

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

### Process 2: Release Automation

**Objective**: Automate versioning, changelog generation, and release publishing.

**Release Workflow**:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version type (patch, minor, major)'
        required: true
        default: 'patch'
        type: choice
        options:
          - patch
          - minor
          - major

permissions:
  contents: write
  pull-requests: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    outputs:
      released: ${{ steps.release.outputs.released }}
      version: ${{ steps.release.outputs.version }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: pnpm/action-setup@v3
        with:
          version: '8'

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Create Release
        id: release
        uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          token: ${{ secrets.GITHUB_TOKEN }}

      # Additional steps after release
      - name: Build package
        if: steps.release.outputs.released == 'true'
        run: pnpm build

      - name: Publish to npm
        if: steps.release.outputs.released == 'true'
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  # Notify on successful release
  notify:
    needs: release
    if: needs.release.outputs.released == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "New release published: v${{ needs.release.outputs.version }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*New Release* :rocket:\nVersion `v${{ needs.release.outputs.version }}` has been published!"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Process 3: PR Automation

**Objective**: Automate PR labeling, assignment, and review workflows.

**PR Labeler**:

```yaml
# .github/workflows/pr-automation.yml
name: PR Automation

on:
  pull_request:
    types: [opened, edited, synchronize, ready_for_review]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Label based on files
        uses: actions/labeler@v5
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Label based on size
        uses: codelytv/pr-size-labeler@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          xs_label: 'size/xs'
          xs_max_size: 10
          s_label: 'size/s'
          s_max_size: 100
          m_label: 'size/m'
          m_max_size: 500
          l_label: 'size/l'
          l_max_size: 1000
          xl_label: 'size/xl'

  # Auto-assign reviewers based on CODEOWNERS
  assign:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - name: Auto-assign reviewers
        uses: kentaro-m/auto-assign-action@v1
        with:
          configuration-path: '.github/auto-assign.yml'

  # Check PR title follows conventional commits
  title-check:
    runs-on: ubuntu-latest
    steps:
      - uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            perf
            test
            build
            ci
            chore
            revert
          requireScope: false
          subjectPattern: ^(?![A-Z]).+$
          subjectPatternError: |
            The subject "{subject}" should not start with an uppercase letter.

  # Add helpful comment for new contributors
  welcome:
    runs-on: ubuntu-latest
    if: github.event.action == 'opened'
    steps:
      - uses: actions/first-interaction@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pr-message: |
            Thanks for your first PR! A maintainer will review it soon.

            While you wait, please make sure:
            - [ ] Tests pass
            - [ ] Code follows our style guide
            - [ ] PR title follows conventional commits
```

**Labeler Configuration**:

```yaml
# .github/labeler.yml
documentation:
  - changed-files:
    - any-glob-to-any-file: ['docs/**', '*.md', '**/*.md']

frontend:
  - changed-files:
    - any-glob-to-any-file: ['app/**', 'components/**', 'styles/**']

backend:
  - changed-files:
    - any-glob-to-any-file: ['api/**', 'lib/**', 'server/**']

tests:
  - changed-files:
    - any-glob-to-any-file: ['**/*.test.ts', '**/*.spec.ts', 'tests/**']

dependencies:
  - changed-files:
    - any-glob-to-any-file: ['package.json', 'pnpm-lock.yaml', 'yarn.lock']

infrastructure:
  - changed-files:
    - any-glob-to-any-file: ['.github/**', 'docker/**', 'terraform/**']
```

### Process 4: Security Scanning

**Objective**: Implement comprehensive security scanning in CI.

**Security Workflow**:

```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday

permissions:
  security-events: write
  contents: read
  actions: read

jobs:
  # Dependency vulnerability scanning
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  # Code scanning with CodeQL
  codeql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  # Secret scanning
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: TruffleHog secret scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  # License compliance
  licenses:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: '8'

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Check licenses
        run: npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD'
```

### Process 5: Dependabot and Dependency Management

**Objective**: Automate dependency updates with intelligent grouping.

**Dependabot Configuration**:

```yaml
# .github/dependabot.yml
version: 2
updates:
  # JavaScript/TypeScript dependencies
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
      day: 'monday'
      time: '09:00'
      timezone: 'America/New_York'
    groups:
      # Group minor/patch updates for faster merging
      production-dependencies:
        patterns:
          - '*'
        exclude-patterns:
          - '@types/*'
          - 'eslint*'
          - 'prettier'
          - 'typescript'
        update-types:
          - 'minor'
          - 'patch'
      dev-dependencies:
        patterns:
          - '@types/*'
          - 'eslint*'
          - 'prettier'
          - 'typescript'
    commit-message:
      prefix: 'deps'
    labels:
      - 'dependencies'
      - 'automated'
    reviewers:
      - 'team-leads'
    open-pull-requests-limit: 10

  # GitHub Actions
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'weekly'
    commit-message:
      prefix: 'ci'
    labels:
      - 'github-actions'
      - 'automated'

  # Docker
  - package-ecosystem: 'docker'
    directory: '/'
    schedule:
      interval: 'weekly'
    commit-message:
      prefix: 'docker'
```

**Auto-merge for Dependabot**:

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot Auto-merge

on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Auto-merge minor/patch updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-minor' || steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| GitHub Actions | Workflow automation | All CI/CD tasks |
| GitHub CLI (gh) | Command-line operations | Scripting, local dev |
| act | Local workflow testing | Development |
| actionlint | Workflow linting | PR validation |

### Reusable Workflow Template

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      app_name:
        required: true
        type: string
    secrets:
      DEPLOY_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: echo "Deploying ${{ inputs.app_name }} to ${{ inputs.environment }}"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| CI Duration | < 10 minutes | Workflow run time |
| PR Merge Time | < 24 hours | Opened to merged |
| Test Coverage | > 80% | Codecov reports |
| Failed Builds | < 5% | Failed / total runs |
| Security Issues | 0 critical | Security scan results |

## Common Pitfalls

1. **No Caching**: Always cache dependencies; rebuilding is expensive.
2. **Sequential Jobs**: Parallelize independent jobs for faster pipelines.
3. **Secrets in Logs**: Never echo secrets; use masks and environment files.
4. **Unlimited Concurrency**: Set concurrency groups to prevent resource waste.
5. **Missing Permissions**: Use minimal permissions with explicit declarations.

## Integration Points

- **Vercel/Netlify**: Deployment triggers from workflows
- **Slack/Discord**: Notifications for releases and failures
- **Codecov/Coveralls**: Coverage reporting
- **Sentry**: Release tracking and source maps
- **npm/Docker Hub**: Package publishing
