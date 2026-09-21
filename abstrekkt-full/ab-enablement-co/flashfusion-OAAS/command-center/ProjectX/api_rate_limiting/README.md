# API Rate Limiting Module

Protect APIs from abuse with configurable rate limits.

## Features

- **Request Limiting**: Limit requests per time window
- **Multiple Strategies**: Fixed window, sliding window, token bucket
- **Per-User/IP Limits**: Different limits for different users
- **Plan-Based Limits**: Different limits per subscription plan
- **Real-time Dashboard**: Monitor rate limit usage

## Usage

```tsx
import {
  RateLimitDashboard,
  useRateLimits,
  useRateLimitUsage
} from '@projectx/api_rate_limiting';

// Configure rate limits
const limits = {
  free: { requests: 100, window: '1h' },
  pro: { requests: 1000, window: '1h' },
  enterprise: { requests: 10000, window: '1h' },
};

// Monitor usage in dashboard
function ApiUsage() {
  const { usage, remaining, resetAt } = useRateLimitUsage();

  return (
    <div>
      <p>Used: {usage} / {remaining + usage}</p>
      <p>Resets at: {resetAt}</p>
    </div>
  );
}
```

## Configuration

```typescript
interface RateLimitConfig {
  // Requests per window
  requests: number;

  // Time window (e.g., '1m', '1h', '1d')
  window: string;

  // Strategy: 'fixed' | 'sliding' | 'token-bucket'
  strategy?: string;

  // Key to identify user (default: userId or IP)
  keyGenerator?: (req) => string;

  // Skip rate limiting for certain requests
  skip?: (req) => boolean;
}
```

## Response Headers

Rate limit info is included in API responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1673548800
```

## Error Response

When rate limit is exceeded:

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 42 seconds.",
  "retryAfter": 42
}
```
