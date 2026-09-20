---
name: git-pushing
description: Helps build and debug git pushing processes. Git push workflow toolkit for safely pushing changes to remote repositories with proper branch management, conflict resolution, and CI integration. Use when pushing feature branches, managing release workflows, or resolving push conflicts.
---

# Git Push Workflow

Stage all changes, create a conventional commit, and push to the remote branch safely. This skill covers the full spectrum of push operations from simple feature branch pushes to complex multi-branch release workflows.

## When to Use

Automatically activate when the user:
- Explicitly asks to push changes ("push this", "commit and push")
- Mentions saving work to remote ("save to github", "push to remote")
- Completes a feature and wants to share it
- Says phrases like "let's push this up" or "commit these changes"
- Needs to resolve push conflicts or rejected pushes
- Wants to set up branch tracking or upstream configuration

## Core Workflow

1. **Check Repository State** - Run `git status` to see staged, unstaged, and untracked files. Run `git log --oneline -5` to understand recent history. Verify which branch you are on with `git branch --show-current`.

2. **Stage Changes** - Add specific files with `git add <file>` rather than `git add .` to avoid accidentally including sensitive files (.env, credentials, large binaries). Review what is staged with `git diff --cached --stat`.

3. **Write a Conventional Commit Message** - Follow the format: `type(scope): description`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`. Keep the subject line under 72 characters. Add a blank line then a body for complex changes.

4. **Verify Remote State** - Run `git fetch origin` to update remote refs without merging. Run `git log --oneline HEAD..origin/<branch>` to check if the remote has commits you do not have locally. If the remote is ahead, rebase or merge before pushing.

5. **Push to Remote** - Use `git push -u origin <branch>` for the first push to set upstream tracking. Use `git push` for subsequent pushes. Never force push to shared branches without team agreement.

6. **Verify Push Success** - Check that CI/CD pipelines triggered. Verify the commit appears on the remote with `git log --oneline origin/<branch> -3`. If a pull request exists, verify it updated.

7. **Handle Failures** - If the push is rejected, fetch and rebase. If pre-push hooks fail, fix the issues and try again. If CI fails after push, fix and push a follow-up commit.

## Quick Push Script

**ALWAYS use the script when available** - do NOT use manual git commands:

```bash
bash skills/git-pushing/scripts/smart_commit.sh
```

With custom message:
```bash
bash skills/git-pushing/scripts/smart_commit.sh "feat: add user authentication"
```

Script handles: staging, conventional commit message generation, Claude footer, push with -u flag.

## Templates / Frameworks

### Conventional Commit Message Format

```
type(scope): short description (max 72 chars)

Longer explanation of what changed and why. Wrap at 72 characters.
Explain the motivation for the change. What problem does this solve?

- Bullet points are fine for listing changes
- Use a hyphen followed by a space

Refs: #123
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Type Reference

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature for the user | `feat(auth): add OAuth2 login flow` |
| `fix` | Bug fix | `fix(cart): correct tax calculation rounding` |
| `docs` | Documentation only | `docs(readme): add deployment instructions` |
| `style` | Formatting, no logic change | `style: apply prettier formatting` |
| `refactor` | Code change that neither fixes nor adds | `refactor(api): extract validation middleware` |
| `test` | Adding or correcting tests | `test(auth): add login edge case tests` |
| `chore` | Maintenance tasks | `chore(deps): update lodash to 4.17.21` |
| `perf` | Performance improvement | `perf(query): add database index for user lookup` |
| `ci` | CI/CD configuration | `ci: add Node 20 to test matrix` |
| `build` | Build system changes | `build: update webpack to v5` |

### Branch Naming Convention

```
feature/TICKET-123-short-description
bugfix/TICKET-456-fix-login-error
hotfix/TICKET-789-patch-security-vuln
release/v1.2.0
chore/update-dependencies
```

## Best Practices

### Safe Push Strategies

- **Default push**: `git push` pushes current branch to its upstream. Safest option for everyday use.
- **Set upstream on first push**: `git push -u origin feature/my-branch` sets the tracking relationship so subsequent pushes need only `git push`.
- **Force with lease**: `git push --force-with-lease` is safer than `--force` because it fails if the remote has commits you have not fetched. Use this after rebasing a feature branch that only you work on.
- **Never force push to main/master**: This rewrites shared history and can destroy teammates' work. If main needs to be fixed, push a revert commit instead.
- **Push specific branch**: `git push origin feature/my-branch` pushes only the named branch, avoiding accidental pushes of other branches.

### Pre-Push Verification Checklist

Before pushing, verify:
- All tests pass locally (`npm test`, `pytest`, etc.)
- Linter and formatter have been run
- No debug code, console.log statements, or TODO comments left behind
- No sensitive data (API keys, passwords, .env files) in staged changes
- Commit messages follow conventional format
- Branch is up to date with the base branch (rebase or merge)

### Branch Protection and Pull Requests

- Configure branch protection rules on main/master to require pull request reviews before merge.
- Enable required status checks (CI must pass before merge is allowed).
- Enable "Require branches to be up to date before merging" to prevent merge conflicts in main.
- Use `gh pr create` to open a pull request directly from the command line after pushing.

### Pre-Push Hooks

Set up a pre-push hook to catch issues before they reach the remote:

```bash
#!/bin/sh
# .git/hooks/pre-push

echo "Running pre-push checks..."

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint errors found. Push aborted."
  exit 1
fi

# Check for sensitive files
if git diff --cached --name-only | grep -qE '\.env|credentials|secret'; then
  echo "Sensitive files detected in commit. Push aborted."
  exit 1
fi

echo "All pre-push checks passed."
exit 0
```

### CI/CD Integration

After pushing, verify CI/CD pipelines:

```bash
# Check GitHub Actions status
gh run list --branch $(git branch --show-current) --limit 3

# Watch a specific run
gh run watch

# View failed run details
gh run view <run-id> --log-failed
```

Common CI triggers on push:
- **Feature branches**: Run tests, linting, type checking
- **Pull request branches**: Run tests + build + preview deployment
- **main/master**: Run tests + build + deploy to staging
- **Release tags**: Run tests + build + deploy to production

## Common Patterns

### Pattern 1: Standard Feature Branch Push

The most common workflow for daily development:

```bash
# 1. Check what has changed
git status
git diff --stat

# 2. Stage specific files
git add src/components/Header.tsx src/components/Header.test.tsx

# 3. Commit with conventional message
git commit -m "feat(header): add responsive navigation menu"

# 4. Fetch and rebase to stay current
git fetch origin main
git rebase origin/main

# 5. Push with upstream tracking
git push -u origin feature/responsive-nav
```

### Pattern 2: Resolving Rejected Push

When `git push` is rejected because the remote has diverged:

```bash
# 1. Fetch latest remote state
git fetch origin

# 2. Rebase your work on top of remote changes
git rebase origin/feature/my-branch

# 3. Resolve any conflicts if they appear
# Edit conflicted files, then:
git add <resolved-files>
git rebase --continue

# 4. Push again
git push
```

If rebase is too complex, merge instead:

```bash
git pull origin feature/my-branch
# Resolve conflicts, commit the merge
git push
```

### Pattern 3: Push After Interactive Rebase (Squash Commits)

When cleaning up commit history before a pull request:

```bash
# 1. Squash last 3 commits into one
git rebase -i HEAD~3

# 2. Force push with lease (safe for personal branches)
git push --force-with-lease

# IMPORTANT: Only do this on branches where you are the sole contributor
```

### Pattern 4: Hotfix Push to Production

For urgent fixes that must bypass normal workflow:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug

# 2. Make the fix, commit
git add src/auth/login.ts
git commit -m "fix(auth): patch token validation bypass vulnerability"

# 3. Push and create PR immediately
git push -u origin hotfix/fix-critical-bug
gh pr create --title "HOTFIX: patch token validation bypass" --base main

# 4. After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.2.1 -m "Hotfix: token validation"
git push origin v1.2.1
```

### Pattern 5: Push with Multiple Remotes

When working with forks (common in open source):

```bash
# List remotes
git remote -v

# Push to your fork
git push origin feature/my-contribution

# If upstream is configured, keep your fork in sync
git fetch upstream
git rebase upstream/main
git push origin main
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `rejected - non-fast-forward` | Remote has commits you lack | `git pull --rebase` then push |
| `rejected - protected branch` | Branch protection rules | Push to a feature branch and open a PR |
| `push declined due to email privacy` | GitHub email privacy setting | Set `user.email` to your GitHub noreply address |
| `pre-push hook failed` | Tests or lint failing | Fix the issues, amend or new commit, try again |
| `fatal: no upstream branch` | No tracking set | `git push -u origin <branch>` |
| `everything up-to-date` | Nothing new to push | Verify you committed (`git log -1`) |
| `large file detected` | File exceeds GitHub's 100MB limit | Use Git LFS or add to `.gitignore` |

## Keywords
git, push, commit, branch, remote, upstream, force-with-lease, conventional commits, CI/CD, pre-push hook, conflict resolution, pull request
