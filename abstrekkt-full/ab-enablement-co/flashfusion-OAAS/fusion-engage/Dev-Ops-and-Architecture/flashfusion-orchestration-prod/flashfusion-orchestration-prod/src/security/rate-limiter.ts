/**
 * Token bucket rate limiter with sliding window
 * Global: 100 req/min, Expensive ops: 10 req/min
 */

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (context: any) => string;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  /**
   * Checks if request is allowed under rate limit
   * @returns {allowed: boolean, retryAfter?: number}
   */
  async check(context: any): Promise<{ allowed: boolean; retryAfter?: number }> {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(context)
      : 'global';
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing timestamps for this key
    const timestamps = this.requests.get(key) || [];

    // Remove expired timestamps (outside window)
    const validTimestamps = timestamps.filter((ts) => ts > windowStart);

    // Check if under limit
    if (validTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = Math.min(...validTimestamps);
      const retryAfter = Math.ceil(
        (oldestTimestamp + this.config.windowMs - now) / 1000
      );
      return { allowed: false, retryAfter };
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return { allowed: true };
  }

  /**
   * Clears rate limit for a specific key (for testing)
   */
  clear(key: string = 'global'): void {
    this.requests.delete(key);
  }

  /**
   * Gets current request count for a key
   */
  getCount(key: string = 'global'): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const timestamps = this.requests.get(key) || [];
    return timestamps.filter((ts) => ts > windowStart).length;
  }
}

/**
 * Pre-configured rate limiters
 */
export const globalRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
});

export const expensiveOpRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  keyGenerator: (context) => context.operation || 'expensive',
});

/**
 * Rate limit error with Retry-After header
 */
export class RateLimitError extends Error {
  constructor(
    public retryAfter: number,
    message: string = 'Rate limit exceeded'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}
