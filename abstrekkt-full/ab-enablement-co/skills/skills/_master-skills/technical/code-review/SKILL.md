---
name: code-review
description: Code review processes, PR templates, quality gates, and best practices for effective collaborative code review. Use when establishing review processes, creating review guidelines, implementing quality gates, or improving team code review practices.
---

# Code Review

## Overview

Code review is one of the most impactful practices for maintaining code quality, sharing knowledge, and building team cohesion. Done well, it catches bugs before production, spreads expertise across the team, and establishes shared standards. Done poorly, it becomes a bottleneck that frustrates developers and slows delivery.

This skill provides frameworks for implementing effective code review processes that balance thoroughness with velocity. It covers what to look for during reviews, how to give constructive feedback, automated quality gates that reduce manual review burden, and PR templates that make reviews more efficient.

The goal is to create a review culture where developers feel supported and code quality continuously improves, not one where reviews are dreaded obstacles to shipping.

### Why This Matters
- Code review catches 60% of defects before they reach production
- Reviews spread knowledge and reduce bus factor across the team
- Consistent standards reduce cognitive load when reading unfamiliar code
- Good review practices improve developer satisfaction and retention

## When to Use

### Primary Triggers
- Establishing code review processes for a new team
- Reviewing pull requests for code quality and correctness
- Creating PR templates and review checklists
- Implementing automated quality gates
- Improving review turnaround time and effectiveness

### Specific Use Cases
- "Create a PR template for our frontend repository"
- "Review this pull request for security and performance issues"
- "Set up required checks before merging to main"
- "Establish code review guidelines for our team"
- "Reduce our average PR review time from 2 days to 4 hours"

## Core Processes

### 1. Code Review Focus Areas

**Review Priority Matrix**

| Priority | Area | What to Check |
|----------|------|---------------|
| Critical | Security | Auth, input validation, data exposure, SQL injection |
| Critical | Correctness | Logic errors, edge cases, error handling |
| High | Performance | N+1 queries, unnecessary computations, memory leaks |
| High | Architecture | Design patterns, separation of concerns, dependencies |
| Medium | Maintainability | Naming, complexity, documentation |
| Medium | Testing | Coverage, edge cases, test quality |
| Low | Style | Formatting (should be automated) |

**Security Review Checklist**

```markdown
## Security Review Checklist

### Authentication & Authorization
- [ ] All endpoints require appropriate authentication
- [ ] Authorization checks verify user has permission for action
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Tokens have appropriate expiration

### Input Validation
- [ ] All user input is validated and sanitized
- [ ] SQL queries use parameterized statements
- [ ] File uploads validate type and size
- [ ] No command injection vulnerabilities

### Data Protection
- [ ] Sensitive data is encrypted at rest
- [ ] PII is not logged or exposed in errors
- [ ] HTTPS enforced for all endpoints
- [ ] Proper CORS configuration

### Dependencies
- [ ] No known vulnerable dependencies (check npm audit, Snyk)
- [ ] Dependencies are from trusted sources
- [ ] Minimal permissions for third-party integrations
```

**Performance Review Checklist**

```markdown
## Performance Review Checklist

### Database
- [ ] Queries are indexed appropriately
- [ ] No N+1 query patterns
- [ ] Pagination implemented for list endpoints
- [ ] Appropriate use of eager/lazy loading

### API
- [ ] Response payloads are appropriately sized
- [ ] Expensive operations are cached
- [ ] Background jobs used for long-running tasks
- [ ] Rate limiting in place

### Frontend
- [ ] Images are optimized and lazy-loaded
- [ ] Components avoid unnecessary re-renders
- [ ] Bundle size impact considered
- [ ] No memory leaks in effects/subscriptions
```

### 2. Pull Request Templates

**Standard PR Template**

```markdown
<!-- .github/pull_request_template.md -->
## Summary
<!-- Brief description of what this PR does -->

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Related Issues
<!-- Link to related issues: Fixes #123, Relates to #456 -->

## Changes Made
<!-- List the specific changes made in this PR -->
-
-
-

## Testing
<!-- Describe the testing you've done -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

### Test Instructions
<!-- Steps for reviewers to test the changes -->
1.
2.
3.

## Screenshots
<!-- If applicable, add screenshots to help explain your changes -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## Deployment Notes
<!-- Any special considerations for deployment -->
- [ ] Database migration required
- [ ] Environment variables added
- [ ] Feature flag configured
- [ ] Third-party service configuration needed
```

**Feature PR Template**

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE/feature.md -->
## Feature: [Feature Name]

### User Story
As a [type of user], I want [goal] so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Implementation
<!-- Describe the technical approach -->

#### Architecture Changes
<!-- Any new patterns, services, or significant changes -->

#### Database Changes
<!-- New tables, columns, migrations -->

#### API Changes
<!-- New endpoints, request/response changes -->

### Testing Strategy
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user flows

### Rollout Plan
- [ ] Feature flag configured
- [ ] Metrics/logging added for monitoring
- [ ] Rollback plan documented

### Documentation
- [ ] README updated
- [ ] API documentation updated
- [ ] Architecture diagrams updated
```

### 3. Automated Quality Gates

**GitHub Actions Quality Checks**

```yaml
# .github/workflows/quality-checks.yml
name: Quality Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  size-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: preactjs/compressed-size-action@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pattern: './dist/**/*.js'
          minimum-change-threshold: 100

  danger:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx danger ci
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Danger.js Rules**

```javascript
// dangerfile.js
import { danger, warn, fail, message } from 'danger';

// Warn if PR is too large
const bigPRThreshold = 500;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(`This PR is quite large (${danger.github.pr.additions + danger.github.pr.deletions} changes). Consider breaking it up.`);
}

// Require description
if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
  fail('Please provide a meaningful PR description.');
}

// Check for console.log statements
const jsFiles = danger.git.modified_files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
jsFiles.forEach(async file => {
  const content = await danger.git.diffForFile(file);
  if (content?.added.includes('console.log')) {
    warn(`Found console.log in ${file}. Consider using proper logging.`);
  }
});

// Require tests for new features
const hasTests = danger.git.modified_files.some(f => f.includes('.test.') || f.includes('.spec.'));
const hasSrcChanges = danger.git.modified_files.some(f => f.includes('/src/') && !f.includes('.test.'));
if (hasSrcChanges && !hasTests) {
  warn('This PR modifies source code but includes no test changes.');
}

// Check for package-lock.json when package.json changes
const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('package-lock.json');
if (packageChanged && !lockfileChanged) {
  fail('package.json was modified but package-lock.json was not updated.');
}

// Celebrate when docs are updated
if (danger.git.modified_files.includes('README.md')) {
  message('Thanks for updating the documentation! 📖');
}
```

### 4. Giving Effective Feedback

**Feedback Framework**

| Type | Prefix | When to Use |
|------|--------|-------------|
| Required | `[Required]` | Must be fixed before merge |
| Suggestion | `[Suggestion]` | Recommended improvement |
| Question | `[Question]` | Seeking clarification |
| Nitpick | `[Nit]` | Minor style/preference |
| Praise | `[Nice!]` | Highlighting good work |

**Constructive Feedback Examples**

```markdown
# Instead of: "This is wrong"
[Required] This approach might cause issues because of X. Consider doing Y instead because [reason].

# Instead of: "Why did you do this?"
[Question] I'm curious about the reasoning for this approach. Was there a specific constraint that led to this design?

# Instead of: "Use a ternary here"
[Nit] This could be simplified with a ternary, but the current version is also fine.
condition ? valueA : valueB

# Good praise example
[Nice!] Great use of the factory pattern here. This will make testing much easier.
```

### 5. Review Process Guidelines

**Review Workflow**

```
1. PR Created
   └── Automated checks run (lint, test, security)

2. Author Self-Review
   └── Author reviews their own diff, adds context comments

3. Reviewer Assigned
   └── Auto-assign based on CODEOWNERS or rotation

4. First Pass Review (< 30 min)
   └── Focus on architecture, security, correctness

5. Author Addresses Feedback
   └── Commit changes, respond to comments

6. Follow-up Review
   └── Verify changes, check for new issues

7. Approval & Merge
   └── Required approvals met, all checks pass
```

**CODEOWNERS File**

```
# .github/CODEOWNERS
# Default owners for everything
* @org/engineering

# Frontend team owns UI code
/src/components/ @org/frontend
/src/pages/ @org/frontend

# Backend team owns API
/src/api/ @org/backend
/src/services/ @org/backend

# DevOps owns infrastructure
/infrastructure/ @org/devops
/.github/ @org/devops

# Security review for auth-related changes
/src/auth/ @org/security
**/auth* @org/security
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| GitHub PR Reviews | Standard code review | Free with GitHub | Inline comments, suggestions |
| Reviewable | Complex reviews | $10/user/mo | Line-by-line tracking |
| Graphite | Stacked PRs | Free tier | Stacked changes, fast review |
| SonarCloud | Automated analysis | Free for open source | Quality gates, debt tracking |
| CodeClimate | Quality metrics | Free tier | Maintainability scores |
| Danger | PR automation | Free | Custom rules, bot comments |

### Branch Protection Rules

```yaml
# Recommended GitHub branch protection settings

main:
  require_pull_request:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
  require_status_checks:
    strict: true  # Require up-to-date before merge
    contexts:
      - lint
      - test
      - security
  require_conversation_resolution: true
  require_linear_history: true  # Enforce squash/rebase
```

## Metrics & KPIs

### Review Efficiency Metrics
- **Review Turnaround Time**: Target < 4 hours for first review
- **Time to Merge**: Target < 1 business day
- **Review Iterations**: Target < 3 rounds
- **PR Size**: Target < 400 lines changed

### Quality Metrics
- **Defect Escape Rate**: Bugs found in production that should have been caught in review
- **Rework Rate**: Percentage of PRs requiring changes after initial review
- **Test Coverage Delta**: Ensure coverage doesn't decrease

## Common Pitfalls

### 1. Nitpicking Instead of Focusing on What Matters
**Problem**: Reviews that focus on formatting while missing logic errors
**Prevention**: Automate style checks. Use [Nit] prefix for preferences. Focus review time on logic, security, and architecture.

### 2. Large PRs That Take Days to Review
**Problem**: Huge PRs that are impossible to review thoroughly
**Prevention**: Enforce PR size limits. Use stacked PRs for large features. Break work into smaller, reviewable chunks.

### 3. Review Bottlenecks
**Problem**: One or two people reviewing all code, creating delays
**Prevention**: Distribute review responsibility. Use CODEOWNERS. Set SLAs for review response time.

### 4. Approval Without Understanding
**Problem**: Rubber-stamping PRs to unblock teammates
**Prevention**: Require meaningful review comments. Track review quality metrics. Create culture where asking questions is encouraged.

## Integration Points

- **DevOps Practices**: Reviews gate CI/CD pipeline progression
- **Testing Strategies**: Verify test coverage in reviews
- **Technical Documentation**: Review documentation changes
- **API Development**: Review API design changes
- **Database Design**: Review migration safety
- **Web Development**: Review frontend code quality
