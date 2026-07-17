# Testing Guide

Testing infrastructure and coverage status for ProjectX.

---

## Current Status

| Metric | Value |
|--------|-------|
| Test Framework | Vitest 1.2.2 (configured) |
| Projects with Tests | 3 of 77 (4%) |
| Total Test Files | 115 |
| Core Modules Tested | 0 of 50 |

**⚠️ Critical Gap**: All 50 ProjectX modules have **zero test coverage**.

---

## Running Tests

```bash
# Root project (Vitest)
npm test
npm run test:coverage

# Watch mode
npm test -- --watch
```

---

## Test Configuration

### Root Vitest Setup
```javascript
// vite.config.ts includes test config
// Uses jsdom environment for React components
```

### CI/CD Module Config
Location: `ci_cd_setup/src/vitest.config.ts`
- Environment: jsdom
- Coverage: c8 provider
- Output: ./coverage/

---

## Projects WITH Tests

| Project | Files | Framework | Coverage Target |
|---------|-------|-----------|-----------------|
| react-boilerplate-master | 101 | Jest | 98% |
| claude-code-templates/cli-tool | 13 | Jest | 70-80% |
| claude-code-templates/api | 1 | Jest | - |

### Reference: react-boilerplate Testing
Best testing patterns in the codebase:
```
react-boilerplate-master/
├── app/components/*/tests/   # Component tests
├── app/containers/*/tests/   # Container tests
├── app/utils/tests/          # Utility tests
├── internals/mocks/          # CSS/image mocks
└── jest.config.js            # 98% coverage config
```

---

## Coverage Gaps - Action Required

### P0 - Security Critical (No Tests)
- `auth_module` - Authentication flows
- `two_factor_auth` - 2FA implementation
- `session_management` - Session handling
- `api_rate_limiting` - Rate limiting
- `sso_saml` - SSO authentication

### P1 - Core Business Logic (No Tests)
- `billing_management` - Payment processing
- `multi_tenancy` - Tenant isolation
- `roles_management` - RBAC
- All 50 modules...

---

## Recommended Test Structure

```
module_name/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       └── Component.test.tsx
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useHook.test.ts
│   └── utils/
│       └── __tests__/
│           └── utils.test.ts
└── package.json
```

---

## Test Template

```typescript
// Example: auth_module/src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should sign in successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(result.current.user).toBeDefined();
  });
});
```

---

## Coverage Targets

| Module Type | Minimum | Target |
|-------------|---------|--------|
| Security modules | 90% | 95% |
| Core business | 80% | 90% |
| UI components | 70% | 80% |
| Utilities | 90% | 95% |

---

## Next Steps

1. **Sprint 1**: Add tests for auth_module, two_factor_auth
2. **Sprint 2**: Add tests for billing, multi_tenancy
3. **Sprint 3**: Expand to remaining modules
4. **Ongoing**: Maintain 80% minimum coverage

---

## Related Files

- `package.json` - Test scripts
- `ci_cd_setup/src/vitest.config.ts` - Vitest config example
- `react-boilerplate-master/jest.config.js` - Jest patterns

---

*Last updated: January 19, 2026*
