# Pull Request Checklist

> **Audience:** ENG | **Phase:** ALL

---

## Before Opening PR

- [ ] Branch is up-to-date with `main`
- [ ] All tests pass locally (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] No console.log or debug statements
- [ ] No hardcoded secrets, URLs, or credentials
- [ ] Environment variables documented in `.env.example`

## Code Quality

- [ ] Functions have clear names and single responsibility
- [ ] TypeScript types defined (no `any` unless justified)
- [ ] Error handling: all async operations have try/catch
- [ ] Input validation: all API inputs validated against schema
- [ ] Logging: meaningful log messages with structured data (customer_id, run_id)

## Security

- [ ] No secrets in code (check for API keys, tokens, passwords)
- [ ] RLS policies updated if new tables added
- [ ] Cross-tenant query impossible (verify with test)
- [ ] Error messages sanitized (no secrets in error output)
- [ ] Input validation blocks injection attempts

## Testing

- [ ] Unit tests for new functions (>80% coverage)
- [ ] Integration tests for new endpoints
- [ ] Edge case tests (null, empty, overflow, timeout)
- [ ] Idempotency tests (duplicate calls produce same result)

## Documentation

- [ ] README updated (if new features or setup changes)
- [ ] API docs updated (if new/changed endpoints)
- [ ] Migration file included (if schema changes)
- [ ] Runbook updated (if new failure modes possible)

## Reviewer Notes

```
## What
[Brief description of changes]

## Why
[Link to ticket/issue/requirement]

## How to Test
[Steps for reviewer to verify]

## Risk
[What could go wrong, rollback plan]
```
