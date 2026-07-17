# Security & Privacy Implementation Guide

## Content Security Policy (CSP Level 3)

### Policy Configuration
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.sanity.io;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Nonce Implementation
```tsx
// middleware.ts
const nonce = crypto.randomUUID();
response.headers.set('x-nonce', nonce);

// Use in script tags
<script nonce={nonce}>...</script>
```

## Security Headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Input Validation

### Zod Schema Example
```tsx
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000)
});

// Validate
const result = contactSchema.safeParse(formData);
if (!result.success) {
  return { errors: result.error.flatten() };
}
```

## WebAuthn Implementation

### Registration
```tsx
import { startRegistration } from '@simplewebauthn/browser';

const credential = await startRegistration({
  rp: { name: 'FlashFusion', id: 'flashfusion.com' },
  user: { id: userId, name: email },
  challenge: serverChallenge
});
```

### Authentication
```tsx
import { startAuthentication } from '@simplewebauthn/browser';

const assertion = await startAuthentication({
  challenge: serverChallenge
});
```

## Rate Limiting

### Implementation
```tsx
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
});

// Apply to API routes
const { success } = await ratelimit.limit(ip);
if (!success) {
  return new Response('Too many requests', { status: 429 });
}
```

## GDPR/CCPA Compliance

### Cookie Banner
```tsx
<CookieBanner>
  <h2>Cookie Settings</h2>
  <Toggle name="necessary" disabled checked />
  <Toggle name="analytics" />
  <Toggle name="marketing" />
  
  {/* Global Privacy Control support */}
  {navigator.globalPrivacyControl && (
    <p>GPC signal detected. Tracking disabled.</p>
  )}
</CookieBanner>
```

### Data Retention
| Data Type | Retention |
|-----------|-----------|
| Contact forms | 2 years |
| Analytics | 26 months |
| Session data | 30 days |

## Threat Model

### Attack Vectors
1. XSS - Mitigated by CSP + input sanitization
2. CSRF - Mitigated by SameSite cookies + tokens
3. Injection - Mitigated by parameterized queries + Zod
4. Session Hijacking - Mitigated by secure cookies + rotation

### Monitoring
- Error tracking: Sentry
- Security scans: Snyk, npm audit
- Penetration testing: Annual

---

**Compliance:** GDPR, CCPA, SOC 2 Type II (planned)
