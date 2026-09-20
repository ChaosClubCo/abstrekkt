# Phase T: Testing

**"If it isn't tested, it doesn't work — you just haven't found the bug yet."**

---

## What This Phase Is

Testing is where you build the safety net that lets you move fast without breaking things. It's not about achieving a coverage number for its own sake — it's about creating the confidence to refactor, deploy, and iterate without fear.

Phase S gave you a running project with a chosen stack. Phase T adds the infrastructure that catches problems before users do: unit tests for logic, integration tests for boundaries, end-to-end tests for workflows, and a CI pipeline that enforces all of it on every commit.

For prototype conversions, this phase is especially important. Your prototype has no tests — that's normal for prototypes. But production code without tests is production code you can't safely change. Phase T is where you close that gap.

### Phase Gate

Do not proceed to Phase A (AI Implementation) until:

- **Test coverage score ≥ 40** (measured by the audit CLI or your coverage tool)
- **Unit tests exist** for all hooks, utilities, and business logic functions
- **At least one E2E test** covering the critical user path
- **CI pipeline running** that blocks merges on test failure

---

## Step 1: Decide What to Test

Not everything needs a test. Testing everything equally is a waste of time. The goal is to test the things that matter most — the things that would hurt most if they broke.

### The Testing Priority Stack

Ranked by impact per hour invested:

| Priority | What | Why | Example |
|---|---|---|---|
| **1. Business logic** | Pure functions that compute, transform, or validate | These are the heart of your app. If they're wrong, everything downstream is wrong. | Scoring engine, price calculator, validation rules, data transformers |
| **2. Data boundaries** | Functions that read/write to databases or APIs | Boundary failures cause data corruption or loss. | Supabase queries, API call wrappers, offline queue sync |
| **3. Auth flows** | Login, signup, role checks, session management | Auth bugs are security bugs. | Sign in, sign out, role-gated access, token refresh |
| **4. Critical user paths** | The one workflow your app exists to serve | If the primary use case breaks, the app is broken. | The complete flow from Phase V's MVP promise |
| **5. Edge cases** | Empty states, error states, offline behavior, concurrent access | These are where real-world usage diverges from happy-path development. | No data, network timeout, expired token, duplicate submit |

### What NOT to Test (Yet)

- **UI layout and styling** — unless layout is your core feature, visual regression testing adds overhead without proportional value at this stage
- **Third-party library internals** — test your integration with the library, not the library itself
- **One-off scripts and migrations** — test them manually, run them once, move on
- **Generated code from the scaffolder** — the scaffolder is tested in the toolkit's CI. Trust it until you modify it.

---

## Step 2: Write Unit Tests

Unit tests cover individual functions in isolation. They're fast, reliable, and the highest-value tests you can write.

### Test Setup

The toolkit scaffolder generates test infrastructure automatically. If you scaffolded with `intinc-scaffold create`, you already have:

- `vitest.config.ts` — configured with jsdom environment, path aliases, and coverage thresholds
- `tests/setup.ts` — global test setup (DOM cleanup, mock resets)
- Starter test files in `tests/` for hooks and utilities

If you're adding tests to an existing project:

```bash
pnpm add -D vitest @vitest/coverage-v8 jsdom
```

### What Good Unit Tests Look Like

A unit test has three parts: arrange, act, assert. No more.

```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from '@/utils/scoring';

describe('calculateScore', () => {
  it('returns 0 for empty input', () => {
    const result = calculateScore([]);
    expect(result).toBe(0);
  });

  it('weights security higher than styling', () => {
    const withSecurity = calculateScore([{ category: 'security', value: 50 }]);
    const withStyling = calculateScore([{ category: 'styling', value: 50 }]);
    expect(withSecurity).toBeGreaterThan(withStyling);
  });

  it('caps at 100', () => {
    const result = calculateScore([
      { category: 'security', value: 100 },
      { category: 'quality', value: 100 },
      { category: 'testing', value: 100 },
    ]);
    expect(result).toBeLessThanOrEqual(100);
  });
});
```

### What to Unit Test by App Type

**PWA apps:**
- Cache utility functions (storage estimation, pruning logic)
- Offline queue operations (enqueue, dequeue, retry logic)
- Feature detection (what capabilities the browser supports)
- Push subscription management (subscribe, unsubscribe, permission checks)

**Electron apps:**
- IPC message handlers (validate that each handler returns expected data)
- File path validation (ensure directory traversal is blocked)
- Window state serialization (save/restore position and size)
- Auto-update state machine (check, download, install transitions)

**Tauri apps:**
- Rust command wrappers (the TypeScript invoke calls)
- Same file path validation as Electron
- Config serialization (load/save client config)

**All apps:**
- Auth state management (login, logout, session refresh, role checks)
- Data transformation functions (anything that maps, filters, or computes)
- Form validation rules
- API response parsers

### Testing Hooks

React hooks need a wrapper to test. Use `@testing-library/react`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

describe('useOnlineStatus', () => {
  it('returns true when online', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('updates when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus());
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);
  });
});
```

The reference library includes example hook tests in `ref/code/pwa-react/tests/hooks/`.

---

## Step 3: Write Integration Tests

Integration tests verify that components work together — that your app talks to the database correctly, that API calls return expected data, and that auth flows complete successfully.

### Mocking External Dependencies

Integration tests shouldn't hit real APIs or databases. Use mocks for external boundaries:

**Supabase:** Mock the client at the module level.

```typescript
import { vi } from 'vitest';

vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [{ id: '1', name: 'Test' }], error: null }),
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    },
  },
}));
```

**Fetch/API calls:** Use MSW (Mock Service Worker) for intercepting network requests.

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/projects', () => {
    return HttpResponse.json([{ id: '1', name: 'Test Project' }]);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### What to Integration Test

- **Data layer:** Query builders return expected shapes. RLS policies filter correctly (test with different mock user roles).
- **Auth flow:** Login sets session, logout clears it, expired tokens trigger refresh.
- **API endpoints:** Request validation rejects bad input, success responses have correct shape, error responses have appropriate status codes.
- **Offline queue:** Items enqueue when offline, dequeue and send when online, retry on failure.

---

## Step 4: Write End-to-End Tests

E2E tests simulate real user behavior in a real browser. They're slower and more brittle than unit tests, but they catch integration issues that nothing else can.

### E2E Setup

The toolkit uses Playwright for E2E testing. Scaffolded PWA projects include `playwright.config.ts` with multi-browser configuration.

```bash
pnpm add -D @playwright/test
npx playwright install
```

### What to E2E Test

Test the critical user path — the one workflow that represents your MVP promise from Phase V. Not every feature. Not every edge case. The one path that, if broken, means your app doesn't work.

**Example: PWA app with offline support**

```typescript
import { test, expect } from '@playwright/test';

test('critical path: create item online, verify offline access', async ({ page }) => {
  // Navigate and sign in
  await page.goto('/');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'testpass');
  await page.click('[data-testid="login"]');
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

  // Create an item
  await page.click('[data-testid="new-item"]');
  await page.fill('[data-testid="item-name"]', 'Test Item');
  await page.click('[data-testid="save"]');
  await expect(page.locator('text=Test Item')).toBeVisible();

  // Go offline and verify item is still accessible
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('text=Test Item')).toBeVisible();
});
```

### PWA-Specific E2E Tests

The reference library includes PWA E2E tests in `ref/code/pwa-react/e2e/pwa.spec.ts` covering:

- Web app manifest is valid and accessible
- Service worker registers and activates
- App loads in offline mode after initial cache
- Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1)

### Electron E2E Tests

Electron apps can use Playwright with the Electron-specific launcher:

```typescript
import { _electron as electron } from '@playwright/test';

test('app launches and shows main window', async () => {
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();
  await expect(window.locator('h1')).toBeVisible();
  await app.close();
});
```

### How Many E2E Tests?

Start with one. The critical path. Add more only when:

- A bug reaches production that a unit or integration test couldn't have caught
- A new critical path emerges (a second core workflow)
- The team has spare capacity and existing tests are stable

E2E tests that are flaky are worse than no E2E tests. They train the team to ignore failures.

---

## Step 5: Set Up CI

Tests that only run on your machine don't protect the team. CI makes tests automatic, consistent, and blocking.

### CI Pipeline Structure

The toolkit includes GitHub Actions workflows for each platform type. The structure is the same:

```
Push/PR → Lint → Typecheck → Unit Tests → E2E Tests → Build → (Lighthouse for PWA)
```

Every stage must pass before the next runs. A failure at any stage blocks the merge.

### CI Configs from the Toolkit

| File | What It Does |
|---|---|
| `ref/ci/.github/workflows/pwa-ci.yml` | Lint, typecheck, unit tests, E2E, build, Lighthouse check |
| `ref/ci/.github/workflows/electron-ci.yml` | Multi-OS matrix (ubuntu, windows, macos), build artifacts |
| `ref/ci/.github/workflows/push-server-ci.yml` | Lint, typecheck, unit tests, build |

### Coverage Thresholds

The scaffolder configures vitest with coverage thresholds in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

These thresholds are aspirational — your starting point will be lower. The Phase T gate requires 40% as a minimum to proceed. Raise thresholds as the test suite matures.

### Enforcing the Pipeline

Configure branch protection rules so that merges to `main` require:

- CI pipeline passes (all stages green)
- At least one approval on the PR
- No unresolved conversations

This is non-negotiable for production branches. Development branches can be looser, but `main` is always protected.

---

## Testing Prototypes Being Rebuilt

If you're converting a prototype to production, the testing strategy is different from a greenfield project. The prototype has working functionality but no tests. The temptation is to write tests for everything at once. Don't.

### The Incremental Approach

1. **Scaffold the new project** with the toolkit (Phase S). It comes with starter tests.
2. **Migrate one feature at a time** from the prototype to the new project.
3. **Write tests for each feature as you migrate it** — not after.
4. **Run the audit CLI after each migration** to track your coverage score climbing.

This approach means you're never more than one feature away from a fully-tested state. Every feature that exists in the new project has tests. The unmigrated features in the old prototype don't need tests because they haven't moved yet.

### What to Test First

Start with whatever your MVP promise from Phase V describes. If the MVP promise is "users can track client interactions," the first tests cover the interaction tracking flow — the data model, the API, the UI, the offline behavior. Everything else waits.

---

## Phase T Checklist

- [ ] Testing priority stack defined (which functions/flows to test first)
- [ ] Unit tests written for all business logic functions
- [ ] Unit tests written for all hooks
- [ ] Unit tests written for data transformation and validation utilities
- [ ] Integration tests for auth flow (login, logout, session, roles)
- [ ] Integration tests for data layer (queries, mutations, RLS behavior)
- [ ] External dependencies mocked (Supabase, APIs, network)
- [ ] At least one E2E test covering the critical user path
- [ ] Playwright configured for target platforms (browser, mobile, Electron)
- [ ] CI pipeline running on GitHub Actions (or equivalent)
- [ ] Pipeline blocks merges on failure
- [ ] Coverage thresholds configured (starting at 40%, targeting 70%)
- [ ] Branch protection enabled on main
- [ ] For prototypes: incremental migration with tests per feature
- [ ] Test coverage audit score ≥ 40

---

## Common Failures

**"We'll write tests after we finish the features."**
You won't. And if you do, you'll be writing tests for code you've already forgotten the intent of. Write tests alongside features, not after.

**"100% coverage means the app works."**
Coverage measures which lines execute during tests, not whether the tests verify correct behavior. A test that calls a function without asserting anything adds coverage but no confidence. Focus on meaningful assertions over coverage numbers.

**"E2E tests keep failing randomly."**
Flaky E2E tests are worse than none — they train the team to ignore red CI. If a test is flaky, either fix the root cause (usually timing) or delete it. Never leave a flaky test in the pipeline.

**"We don't need CI for a small project."**
CI catches issues before they reach production regardless of project size. It takes 15 minutes to set up GitHub Actions with the toolkit's configs. There is no project too small for CI.

**"The prototype works, so we don't need tests."**
The prototype works for you, in your environment, with your data. Tests verify it works for everyone, in every environment, with unexpected data. That's the difference between a personal tool and a production application.

---

## AI Your BI℠: Claude in Phase T

Three specific uses:

**Test Generation** — Describe a function's purpose, inputs, and expected outputs, and ask Claude to generate a comprehensive test suite including edge cases. Claude is particularly good at identifying boundary conditions you haven't considered — empty arrays, null values, maximum lengths, concurrent operations.

**Mock Design** — Describe an external dependency (API, database, auth provider) and ask Claude to generate a mock implementation that covers happy paths, error cases, and edge conditions.

**CI Configuration** — Describe your stack, platform target, and deployment model, and ask Claude to generate a GitHub Actions workflow. The toolkit includes starter configs, but Claude can customize them for non-standard setups.

Example prompt:

```
Here is my function:
[paste function code]

It is used in [context].
The inputs come from [source].
Edge cases I'm aware of: [list any].

Generate a vitest test suite that covers:
1. Happy path (typical inputs)
2. Empty/null/undefined inputs
3. Boundary values (min, max, overflow)
4. Error conditions (what should throw)
5. Any edge cases I've missed
```

---

## References

- `ref/code/pwa-react/vitest.config.ts` — Vitest configuration with coverage thresholds
- `ref/code/pwa-react/tests/` — Example unit tests for hooks and utilities
- `ref/code/pwa-react/e2e/pwa.spec.ts` — PWA-specific E2E tests
- `ref/code/pwa-react/playwright.config.ts` — Multi-browser Playwright configuration
- `ref/ci/.github/workflows/pwa-ci.yml` — Full CI pipeline with Lighthouse
- `ref/ci/.github/workflows/electron-ci.yml` — Multi-OS Electron CI
- `ref/ci/scripts/lighthouse-check.sh` — Performance gate script

---

**Previous Phase:** [← Phase S: Stack](./S-stack.md)
**Next Phase:** [Phase A: AI Implementation →](./A-ai-implementation.md)
