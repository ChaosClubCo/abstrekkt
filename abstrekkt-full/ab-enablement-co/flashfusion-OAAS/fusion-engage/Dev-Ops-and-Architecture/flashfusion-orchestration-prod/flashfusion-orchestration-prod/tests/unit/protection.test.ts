/**
 * Rate limiter and circuit breaker test suite
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter, RateLimitError } from '../../src/security/rate-limiter.js';
import { CircuitBreaker, CircuitState } from '../../src/security/circuit-breaker.js';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequests: 5,
      windowMs: 1000,
    });
  });

  it('should allow requests under limit', async () => {
    for (let i = 0; i < 5; i++) {
      const result = await rateLimiter.check({});
      expect(result.allowed).toBe(true);
    }
  });

  it('should reject requests over limit', async () => {
    // Fill up the quota
    for (let i = 0; i < 5; i++) {
      await rateLimiter.check({});
    }

    const result = await rateLimiter.check({});
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should reset after window expires', async () => {
    for (let i = 0; i < 5; i++) {
      await rateLimiter.check({});
    }

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const result = await rateLimiter.check({});
    expect(result.allowed).toBe(true);
  });

  it('should track separate keys', async () => {
    const limiter = new RateLimiter({
      maxRequests: 2,
      windowMs: 1000,
      keyGenerator: (ctx) => ctx.userId,
    });

    await limiter.check({ userId: 'user1' });
    await limiter.check({ userId: 'user1' });
    
    const user1Result = await limiter.check({ userId: 'user1' });
    expect(user1Result.allowed).toBe(false);

    const user2Result = await limiter.check({ userId: 'user2' });
    expect(user2Result.allowed).toBe(true);
  });

  it('should provide correct retry-after value', async () => {
    for (let i = 0; i < 5; i++) {
      await rateLimiter.check({});
    }

    const result = await rateLimiter.check({});
    expect(result.retryAfter).toBeLessThanOrEqual(1);
    expect(result.retryAfter).toBeGreaterThan(0);
  });
});

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 100,
      resetTimeout: 50,
    });
  });

  it('should start in CLOSED state', () => {
    expect(breaker.getState()).toBe(CircuitState.CLOSED);
  });

  it('should transition to OPEN after threshold failures', async () => {
    const failingFn = async () => {
      throw new Error('fail');
    };

    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn).catch(() => {});
    }

    expect(breaker.getState()).toBe(CircuitState.OPEN);
  });

  it('should reject requests in OPEN state', async () => {
    const failingFn = async () => {
      throw new Error('fail');
    };

    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn).catch(() => {});
    }

    await expect(breaker.execute(async () => 'success')).rejects.toThrow(
      'Circuit breaker is OPEN'
    );
  });

  it('should transition to HALF_OPEN after timeout', async () => {
    const failingFn = async () => {
      throw new Error('fail');
    };

    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn).catch(() => {});
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(breaker.getState()).toBe(CircuitState.HALF_OPEN);
  });

  it('should close after successful requests in HALF_OPEN', async () => {
    // Open circuit
    const failingFn = async () => {
      throw new Error('fail');
    };
    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn).catch(() => {});
    }

    // Wait for half-open
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Succeed twice to close
    await breaker.execute(async () => 'success');
    await breaker.execute(async () => 'success');

    expect(breaker.getState()).toBe(CircuitState.CLOSED);
  });

  it('should reopen on failure in HALF_OPEN', async () => {
    // Open circuit
    const failingFn = async () => {
      throw new Error('fail');
    };
    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn).catch(() => {});
    }

    // Wait for half-open
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Fail again
    await breaker.execute(failingFn).catch(() => {});
    expect(breaker.getState()).toBe(CircuitState.OPEN);
  });

  it('should provide metrics', () => {
    const metrics = breaker.getMetrics();
    expect(metrics).toHaveProperty('state');
    expect(metrics).toHaveProperty('failureCount');
    expect(metrics).toHaveProperty('successCount');
  });

  it('should reset correctly', () => {
    breaker.reset();
    expect(breaker.getState()).toBe(CircuitState.CLOSED);
    expect(breaker.getMetrics().failureCount).toBe(0);
  });
});
