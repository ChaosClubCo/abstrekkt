# Contributing to @flashfusion/orchestration

Thank you for your interest in contributing! This guide will get you productive in 2 hours.

## Quick Start

```bash
# Prerequisites
node --version  # >= 20.0.0
pnpm --version  # >= 8.0.0

# Clone
git clone https://github.com/flashfusion/orchestration.git
cd orchestration

# Install
pnpm install

# Start development server (hot reload)
pnpm dev

# Run tests
pnpm test:watch
```

## Development Workflow

1. **Create feature branch**: `git checkout -b feat/your-feature`
2. **Make changes**: Edit files, tests auto-run
3. **Commit**: Pre-commit hooks run (lint, format, test, secrets scan)
4. **Push**: CI/CD pipeline runs (tests, security, build)
5. **Create PR**: Request review

## Project Structure

```
src/
├── core/          # Role matrix, RACI chart, prompt generation
├── security/      # Rate limiting, circuit breakers, XSS prevention
├── observability/ # Metrics, logging, health checks
├── mcp/           # MCP server implementation
└── types/         # TypeScript types and Zod schemas

tests/
├── unit/          # Unit tests (fast, isolated)
├── integration/   # Integration tests (MCP end-to-end)
└── performance/   # Benchmarks and load tests

docs/             # Documentation
.github/workflows/ # CI/CD pipelines
docker/           # Docker configuration
config/           # Tool configurations (Artillery, gitleaks, alerts)
scripts/          # Build and deployment scripts
```

## Code Standards

### TypeScript

- **Strict mode**: All compiler strict flags enabled
- **No `any`**: Use `unknown` or proper types
- **Explicit return types**: For exported functions
- **Immutability**: Use `Readonly`, `deepFreeze()` for data

### Testing

- **Coverage**: ≥90% lines, functions, statements; ≥85% branches
- **Test structure**: Arrange-Act-Assert
- **Naming**: `describe('Feature')` → `it('should do X')`
- **Mocking**: Minimize, prefer real implementations

### Security

- **Input validation**: Zod schemas for all external input
- **XSS prevention**: `escapeXSS()` for user-generated content
- **Secrets**: Never commit, use `.env.example`
- **Dependencies**: Review before adding, check licenses

### Documentation

- **TSDoc**: For public APIs
- **Examples**: Include usage examples
- **Why over what**: Explain reasoning, not mechanics

## Pre-Commit Checks

Automated via Husky:

1. **Lint**: ESLint with security plugin
2. **Format**: Prettier
3. **Type check**: TypeScript compiler
4. **Tests**: Related tests only (fast)
5. **Secrets scan**: Gitleaks
6. **License check**: Ensure MIT/Apache-2.0/BSD-3-Clause only

## Common Tasks

### Add a new role

1. Edit `src/core/data.ts` - add to `ROLE_MATRIX_MUTABLE`
2. Add corresponding RACI entry to `RACI_CHART_MUTABLE`
3. Add tests in `tests/unit/core.test.ts`
4. Run `pnpm test` - ensure all pass

### Add a new prompt template

1. Edit `src/core/data.ts` - add to `PROMPT_TEMPLATES_MUTABLE`
2. Add tests for variable substitution
3. Test XSS escaping with malicious input

### Add a new MCP tool

1. Edit `src/mcp/server.ts` - add handler to `registerTools()`
2. Add rate limiting (global or expensive)
3. Add circuit breaker protection
4. Add tests in `tests/integration/`
5. Update README.md with tool documentation

### Fix a security vulnerability

1. Run `pnpm security:scan` to identify
2. Review CVE details, assess impact
3. Update dependency or apply patch
4. Re-scan, ensure cleared
5. Add regression test

## IDE Setup

### VS Code (Recommended)

Install extensions (auto-suggested on open):

- ESLint
- Prettier
- TypeScript + JavaScript Language Features
- Vitest
- GitLens

Configuration in `.vscode/`:
- `settings.json` - Auto-format on save, organize imports
- `launch.json` - Debugger configs (MCP server, tests)
- `extensions.json` - Recommended extensions

### Cursor

Same as VS Code - configuration files work identically.

## Debugging

### MCP Server

```bash
# Option 1: VS Code debugger
F5 or "Run > Start Debugging"

# Option 2: Command line
pnpm mcp:inspect
# Then open chrome://inspect in Chrome
```

### Tests

```bash
# Option 1: VS Code Test Explorer
Click on beaker icon in sidebar

# Option 2: Command line with filter
pnpm test -- -t "rate limiter"
```

### Performance Issues

```bash
# Generate CPU profile
pnpm perf:profile

# Run benchmark suite
pnpm perf:benchmark

# Load test
pnpm perf:load
```

## Pull Request Guidelines

### PR Title Format

```
<type>(<scope>): <description>

Types: feat, fix, docs, refactor, test, perf, chore
Scopes: core, security, observability, mcp, docs
```

Examples:
- `feat(security): add HMAC signature validation`
- `fix(mcp): handle SIGTERM gracefully`
- `docs(readme): add deployment cost breakdown`

### PR Description Template

```markdown
## Problem
Brief description of issue being solved

## Solution
High-level approach

## Testing
How was this tested? Include test scenarios

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Bundle size unchanged or decreased
```

### Review Process

1. **Automated checks**: CI must pass (tests, lint, security)
2. **Code review**: 1 approval required
3. **Security review**: For security-sensitive changes
4. **Merge**: Squash and merge to main

## Release Process

1. **Version bump**: `pnpm version [major|minor|patch]`
2. **Changelog**: Update CHANGELOG.md
3. **Tag**: `git tag v1.2.3 && git push --tags`
4. **CI/CD**: Automatically builds, tests, deploys
5. **Publish**: `pnpm publish` (requires npm auth)

## Getting Help

- **Questions**: GitHub Discussions
- **Bugs**: GitHub Issues
- **Security**: security@flashfusion.com (private disclosure)
- **Slack**: #orchestration-dev (for team members)

## License

By contributing, you agree your contributions will be licensed under MIT.
