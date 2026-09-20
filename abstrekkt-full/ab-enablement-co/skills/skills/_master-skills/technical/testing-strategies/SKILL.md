---
name: testing-strategies
description: Unit, integration, and E2E testing strategies, TDD practices, test coverage, and testing best practices. Use when establishing testing strategies, implementing test suites, improving test coverage, or debugging test-related issues.
---

# Testing Strategies

## Overview

Testing is the practice of verifying that software behaves as intended. A comprehensive testing strategy catches bugs early, enables confident refactoring, documents expected behavior, and provides a safety net for continuous deployment. Without tests, every change is a risk; with good tests, teams can move fast without breaking things.

This skill covers the testing pyramid and its modern interpretations, test-driven development, mocking strategies, and the practical implementation of tests at every level from unit to end-to-end. It provides guidance on what to test, how much to test, and how to write tests that remain valuable as systems evolve.

The goal is not 100% coverage for its own sake but a testing strategy that maximizes confidence in the system while minimizing maintenance burden. Good tests are fast, reliable, and focused on behavior rather than implementation details.

### Why This Matters
- Comprehensive testing reduces production bugs by 40-80%
- Test suites enable confident refactoring and rapid iteration
- TDD improves code design by forcing consideration of interfaces first
- Fast, reliable tests are prerequisite for continuous deployment

## When to Use

### Primary Triggers
- Establishing testing strategy for a new project
- Writing tests for existing features
- Debugging flaky or slow tests
- Improving test coverage in critical areas
- Implementing test-driven development practices

### Specific Use Cases
- "Set up testing infrastructure for our React/Node application"
- "Write integration tests for our order processing API"
- "Fix flaky tests that are blocking our CI pipeline"
- "Implement E2E tests for our critical user flows"
- "Should we use mocks or real database in our tests?"

## Core Processes

### 1. Testing Pyramid and Strategy

**Modern Testing Pyramid**

```
                    ┌─────────────────┐
                    │      E2E        │  Few, slow, high confidence
                    │    Tests        │  Critical user journeys
                    └────────┬────────┘
                             │
              ┌──────────────▼──────────────┐
              │     Integration Tests       │  Moderate, API/DB boundaries
              │                             │  Component interactions
              └──────────────┬──────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │            Unit Tests                   │  Many, fast, isolated
        │         Business logic, utilities       │  Individual functions/classes
        └─────────────────────────────────────────┘
```

**Test Type Guidelines**

| Test Type | Speed | Isolation | Coverage | When to Write |
|-----------|-------|-----------|----------|---------------|
| Unit | < 10ms | Complete | Logic branches | All business logic |
| Integration | < 1s | Partial | API contracts | Service boundaries |
| E2E | < 30s | None | User flows | Critical paths |

**What to Test at Each Level**

```typescript
// Unit Tests - Pure business logic
// ✓ Calculations, transformations, validation
// ✓ State transitions
// ✓ Error handling logic
// ✗ Database calls, API calls, file system

// Integration Tests - Boundaries
// ✓ API endpoints with real database
// ✓ Service method with dependencies
// ✓ Queue consumers with real messages
// ✗ External APIs (mock those)

// E2E Tests - User journeys
// ✓ Complete signup flow
// ✓ Purchase checkout flow
// ✓ Critical business processes
// ✗ Edge cases (cover in lower levels)
```

### 2. Unit Testing Patterns

**Test Structure (AAA Pattern)**

```typescript
// user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'plaintext123',
        name: 'Test User',
      };

      // Act
      const result = await userService.createUser(input);

      // Assert
      expect(result.email).toBe(input.email);
      expect(result.password).not.toBe(input.password);
      expect(result.password).toMatch(/^\$2[aby]?\$/); // bcrypt hash
    });

    it('should throw ValidationError for invalid email', async () => {
      // Arrange
      const input = {
        email: 'not-an-email',
        password: 'password123',
        name: 'Test User',
      };

      // Act & Assert
      await expect(userService.createUser(input))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw ConflictError for duplicate email', async () => {
      // Arrange
      const input = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };
      mockUserRepository.findByEmail.mockResolvedValue({ id: '123' });

      // Act & Assert
      await expect(userService.createUser(input))
        .rejects
        .toThrow(ConflictError);
    });
  });
});
```

**Testing React Components**

```typescript
// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('UserProfile', () => {
  it('should display user information after loading', async () => {
    renderWithProviders(<UserProfile userId="123" />);

    // Shows loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Shows user data after fetch
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return HttpResponse.error();
      })
    );

    renderWithProviders(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });
  });

  it('should allow editing user name', async () => {
    const user = userEvent.setup();

    server.use(
      http.patch('/api/users/:id', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ ...body, id: '123' });
      })
    );

    renderWithProviders(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });
});
```

### 3. Integration Testing

**API Integration Tests**

```typescript
// orders.integration.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import { app } from '../app';
import { db } from '../database';
import { createTestUser, createTestProduct } from './factories';

describe('Orders API', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let authToken: string;
  let testUser: User;
  let testProduct: Product;

  beforeAll(async () => {
    await db.migrate.latest();
    request = supertest(app);
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db('order_items').delete();
    await db('orders').delete();
    await db('products').delete();
    await db('users').delete();

    testUser = await createTestUser(db);
    testProduct = await createTestProduct(db, { inventory: 10 });
    authToken = generateToken(testUser);
  });

  describe('POST /orders', () => {
    it('should create an order and decrement inventory', async () => {
      const response = await request
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: testProduct.id, quantity: 2 }],
        })
        .expect(201);

      expect(response.body.data).toMatchObject({
        status: 'pending',
        items: [
          {
            productId: testProduct.id,
            quantity: 2,
            unitPrice: testProduct.price,
          },
        ],
        total: testProduct.price * 2,
      });

      // Verify inventory was decremented
      const updatedProduct = await db('products')
        .where({ id: testProduct.id })
        .first();
      expect(updatedProduct.inventory).toBe(8);
    });

    it('should return 422 when inventory is insufficient', async () => {
      const response = await request
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: testProduct.id, quantity: 15 }],
        })
        .expect(422);

      expect(response.body.error.code).toBe('INSUFFICIENT_INVENTORY');
      expect(response.body.error.details[0]).toMatchObject({
        productId: testProduct.id,
        requested: 15,
        available: 10,
      });
    });

    it('should rollback on payment failure', async () => {
      // Mock payment service to fail
      mockPaymentService.processPayment.mockRejectedValue(
        new Error('Payment declined')
      );

      await request
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: testProduct.id, quantity: 2 }],
        })
        .expect(402);

      // Verify inventory was not decremented
      const product = await db('products')
        .where({ id: testProduct.id })
        .first();
      expect(product.inventory).toBe(10);

      // Verify no order was created
      const orders = await db('orders').where({ user_id: testUser.id });
      expect(orders).toHaveLength(0);
    });
  });
});
```

### 4. End-to-End Testing

**Playwright E2E Tests**

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Seed test data via API
    await page.request.post('/api/test/seed', {
      data: { scenario: 'checkout' },
    });
  });

  test('should complete checkout as logged-in user', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Add item to cart
    await page.goto('/products/test-product');
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.cart-count')).toHaveText('1');

    // Proceed to checkout
    await page.click('a:has-text("Cart")');
    await page.click('button:has-text("Checkout")');

    // Fill shipping information
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="city"]', 'Test City');
    await page.fill('[name="zipCode"]', '12345');
    await page.click('button:has-text("Continue")');

    // Confirm order
    await page.click('button:has-text("Place Order")');

    // Verify success
    await expect(page).toHaveURL(/\/orders\/ord_/);
    await expect(page.locator('h1')).toContainText('Order Confirmed');
    await expect(page.locator('.order-status')).toHaveText('Processing');
  });

  test('should handle out-of-stock during checkout', async ({ page }) => {
    // Login and add item
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('/products/limited-stock-product');
    await page.click('button:has-text("Add to Cart")');

    // Simulate stock being depleted by another user
    await page.request.post('/api/test/deplete-stock', {
      data: { productId: 'limited-stock-product' },
    });

    // Try to checkout
    await page.click('a:has-text("Cart")');
    await page.click('button:has-text("Checkout")');

    // Should show error
    await expect(page.locator('.error-message'))
      .toContainText('Some items in your cart are no longer available');
  });
});
```

### 5. Test Configuration and Infrastructure

**Vitest Configuration**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Test Setup File**

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Vitest | Unit/integration tests | Free | Fast, Vite-native, compatible |
| Playwright | E2E testing | Free | Cross-browser, auto-wait |
| Testing Library | Component testing | Free | User-centric queries |
| MSW | API mocking | Free | Service worker based |
| Faker.js | Test data generation | Free | Realistic fake data |
| Allure | Test reporting | Free | Rich reports, history |

## Metrics & KPIs

### Coverage Metrics
- **Line Coverage**: Target 80%+ for critical paths
- **Branch Coverage**: Target 80%+ for business logic
- **Function Coverage**: Track uncovered functions

### Quality Metrics
- **Test Flakiness Rate**: Target < 1%
- **Test Suite Duration**: Track and optimize
- **Tests per Feature**: Ensure new features have tests
- **Bug Escape Rate**: Bugs that could have been caught by tests

## Common Pitfalls

### 1. Testing Implementation Details
**Problem**: Tests break when refactoring even though behavior is unchanged
**Prevention**: Test behavior, not implementation. Focus on inputs and outputs. Use Testing Library's user-centric queries.

### 2. Flaky Tests
**Problem**: Tests that pass/fail randomly, eroding trust in the suite
**Prevention**: Avoid time dependencies, use proper waiting, isolate tests, investigate and fix root causes immediately.

### 3. Slow Test Suites
**Problem**: Tests take too long, developers skip running them
**Prevention**: Parallelize tests, mock expensive operations, use appropriate test levels, profile and optimize slow tests.

### 4. Over-Mocking
**Problem**: Tests pass but real integrations fail
**Prevention**: Use integration tests for boundaries. Mock only what you must. Use contract testing for external APIs.

## Integration Points

- **Code Review**: Require tests in PR reviews
- **DevOps Practices**: Tests run in CI pipeline
- **API Development**: API tests verify contracts
- **Database Design**: Test database interactions
- **Performance Optimization**: Performance testing
- **Technical Documentation**: Tests document expected behavior
