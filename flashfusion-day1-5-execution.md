# FlashFusion Day 1-5: Execution Guide

**Goal:** Revenue flow live + security basics + testers have a link by Day 5
**Stack:** React 18 + Vite + Express 5 + PostgreSQL/Drizzle + Stripe + Claude API
**Repo:** Krosebrook/AffordableStoreStuff (canonical)

---

## Pre-Flight (30 minutes, before Day 1 code)

### 1. Verify your environment

```bash
cd AffordableStoreStuff
git status                    # clean working tree?
node -v                       # should be 20.x
npm -v                        # should be 10.x
npm install                   # ensure deps are current
npm run check                 # TypeScript passes?
```

### 2. Add missing dependencies

```bash
# Claude/Anthropic SDK (the audit found OpenAI but no Anthropic SDK)
npm install @anthropic-ai/sdk

# PDF generation (client-side)
npm install jspdf

# Zod should already be there (used in shared/schema.ts)
# If not: npm install zod
```

### 3. Copy your .env from .env.example and fill in:

```bash
cp .env.example .env
```

**Critical vars to set NOW:**

```env
DATABASE_URL=postgresql://user:pass@host:5432/flashfusion
SESSION_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
STRIPE_SECRET_KEY=sk_live_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
ALLOWED_ORIGINS=http://localhost:5000,https://your-production-url.vercel.app
ENCRYPTION_KEY=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

### 4. Verify Stripe is ready

```bash
# Install Stripe CLI if not present
# macOS: brew install stripe/stripe-cli/stripe
# or: https://docs.stripe.com/stripe-cli

stripe login
stripe listen --forward-to localhost:5000/api/billing/webhook
# Note the webhook signing secret (whsec_...) → put in .env
```

---

## Day 1: Security Fixes (4 hours)

These block everything. No users until these are done.

### File 1: Input Validation Middleware

**Create:** `server/middleware/validate.ts`

```typescript
import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware that validates req.body against a Zod schema.
 * Returns 400 with structured errors on failure.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    req.body = result.data; // Use parsed (sanitized) data
    next();
  };
}
```

### File 2: Auth Validation Schemas

**Create:** `shared/validation.ts`

```typescript
import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be under 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, hyphens'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be under 128 characters'),
});

export const registerSchema = z.object({
  username: loginSchema.shape.username,
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token required'),
  password: registerSchema.shape.password,
});

// AI generation schema
export const aiGenerateSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'gemini']),
  model: z.string().max(100).optional(),
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(10000, 'Prompt must be under 10,000 characters'),
  type: z.enum(['text', 'image', 'audio', 'code']).optional().default('text'),
  maxTokens: z.number().min(1).max(4096).optional().default(2048),
  temperature: z.number().min(0).max(2).optional().default(0.7),
});

// Brand kit generation schema (the revenue flow)
export const brandKitInputSchema = z.object({
  description: z.string()
    .min(10, 'Please describe your brand in at least 10 characters')
    .max(2000, 'Description must be under 2,000 characters'),
  audience: z.string()
    .min(5, 'Please describe your target audience')
    .max(500),
  style: z.enum([
    'modern-minimal',
    'bold-vibrant',
    'natural-organic',
    'luxury-elegant',
    'playful-creative',
    'tech-professional',
  ]),
});

// Platform connection schema
export const platformConnectionSchema = z.object({
  platform: z.enum([
    'printify', 'printful', 'etsy', 'shopify',
    'amazon', 'gumroad', 'tiktok', 'woocommerce',
  ]),
  credentials: z.record(z.string()).optional(),
  name: z.string().max(100).optional(),
});
```

### File 3: Role Middleware

**Create:** `server/middleware/requireRole.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that checks if the authenticated user has one of the allowed roles.
 * Must be used AFTER requireAuth middleware.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(user.role || 'customer')) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: roles,
        current: user.role || 'customer',
      });
    }
    next();
  };
}
```

### Patch 1: Fix auth-routes.ts

**Edit:** `server/routes/auth-routes.ts`

Add validation to login handler (around line 47):

```typescript
// ADD at top of file:
import { validateBody } from '../middleware/validate';
import { loginSchema, registerSchema, resetPasswordSchema } from '../../shared/validation';

// CHANGE the login route from:
//   app.post('/api/auth/login', async (req, res) => {
//     const { username, password } = req.body;
// TO:
app.post('/api/auth/login', validateBody(loginSchema), async (req, res) => {
  const { username, password } = req.body; // now validated + sanitized
  // ... rest of handler unchanged
});

// CHANGE the register route similarly:
app.post('/api/auth/register', validateBody(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  // ... rest of handler unchanged
});

// CHANGE the reset-password route:
app.post('/api/auth/reset-password', validateBody(resetPasswordSchema), async (req, res) => {
  const { token, password } = req.body;
  // ... rest of handler unchanged
});
```

### Patch 2: Fix integrations/routes.ts data leak

**Edit:** `server/integrations/routes.ts` (around line 74)

```typescript
// CHANGE FROM (returns ALL users' connections):
const connections = await db.select().from(platformConnections);

// CHANGE TO (scoped to current user):
const connections = await db.select()
  .from(platformConnections)
  .where(eq(platformConnections.userId, req.userId))
  .orderBy(desc(platformConnections.createdAt));
```

**Also at line 93, add role check:**

```typescript
// CHANGE FROM:
app.post('/api/integrations/connections', requireAuth, async (req, res) => {

// CHANGE TO:
import { requireRole } from '../middleware/requireRole';
import { validateBody } from '../middleware/validate';
import { platformConnectionSchema } from '../../shared/validation';

app.post('/api/integrations/connections',
  requireAuth,
  requireRole('admin', 'pro', 'enterprise'),
  validateBody(platformConnectionSchema),
  async (req, res) => {
```

**Also at line 210, add AI validation:**

```typescript
// CHANGE FROM:
app.post('/api/integrations/ai/generate', requireAuth, async (req, res) => {
  const { provider, model, prompt, type, options, maxTokens, temperature } = req.body;
  if (!provider || !prompt) { ...

// CHANGE TO:
import { aiGenerateSchema } from '../../shared/validation';

app.post('/api/integrations/ai/generate',
  requireAuth,
  validateBody(aiGenerateSchema),
  async (req, res) => {
    const { provider, model, prompt, type, maxTokens, temperature } = req.body;
    // Remove the manual null checks — Zod handles it now
```

### Patch 3: Env validation at startup

**Create:** `server/utils/env-validator.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Always required
  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required')
    .refine(s => s.startsWith('postgres'), 'DATABASE_URL must be a PostgreSQL connection string'),
  SESSION_SECRET: z.string()
    .min(32, 'SESSION_SECRET must be at least 32 characters')
    .refine(
      s => !s.toLowerCase().includes('change') && !s.toLowerCase().includes('dev'),
      'SESSION_SECRET must be changed from default value'
    ),

  // Required in production
  ALLOWED_ORIGINS: z.string().optional(),

  // Feature-gated (warn if missing, don't crash)
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be 64 hex chars').optional(),

  // Optional
  PORT: z.string().optional().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\n❌ Environment validation failed:\n');
    result.error.issues.forEach(issue => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
    console.error('\nFix: Check your .env file against .env.example');
    console.error('Retry: Correct the values and restart the server\n');
    process.exit(1);
  }

  // Warnings for optional but recommended vars
  const warnings: string[] = [];
  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    warnings.push('No AI API key set (ANTHROPIC_API_KEY or OPENAI_API_KEY) — AI features disabled');
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    warnings.push('STRIPE_SECRET_KEY not set — payment features disabled');
  }
  if (!process.env.ENCRYPTION_KEY) {
    warnings.push('ENCRYPTION_KEY not set — platform credentials stored unencrypted');
  }
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
    console.error('❌ ALLOWED_ORIGINS is required in production');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment warnings:');
    warnings.forEach(w => console.warn(`  - ${w}`));
    console.warn('');
  }
}
```

**Then add to `server/index.ts` (line ~15, before any other code):**

```typescript
import { validateEnv } from './utils/env-validator';
validateEnv(); // Exits with error if critical vars missing
```

### Day 1 Acceptance Tests (manual)

```bash
# Start dev server
npm run dev

# Test 1: Login validation rejects bad input
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","password":"x"}'
# Expected: 400 {"success":false,"message":"Validation failed","errors":[...]}

# Test 2: Registration rejects weak password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
# Expected: 400 (password needs uppercase + number + 8 chars)

# Test 3: Health check still works
curl http://localhost:5000/api/health
# Expected: 200 {"status":"ok",...}

# Test 4: Server rejects missing env vars
# Temporarily remove DATABASE_URL from .env, restart → should exit with error
```

---

## Day 2-3: Revenue Flow (8-10 hours)

### File 4: Claude API Service

**Create:** `server/services/claude-service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

// Validate the brand kit response from Claude
const brandKitResponseSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    neutral: z.string(),
    background: z.string(),
  }),
  colorRationale: z.string(),
  logos: z.array(z.object({
    name: z.string(),
    description: z.string(),
    usage: z.string(),
  })).min(2).max(5),
  fonts: z.array(z.object({
    name: z.string(),
    role: z.string(),
    googleFont: z.string(),
    rationale: z.string(),
    sizes: z.string(),
  })).min(2).max(3),
  mockups: z.array(z.object({
    product: z.string(),
    designConcept: z.string(),
    placement: z.string(),
  })).min(3),
  brandVoice: z.object({
    tone: z.string(),
    messaging: z.string(),
    doWrite: z.string(),
    dontWrite: z.string(),
  }),
  usageGuidelines: z.string(),
});

export type BrandKit = z.infer<typeof brandKitResponseSchema>;

interface BrandKitInput {
  description: string;
  audience: string;
  style: string;
}

const SYSTEM_PROMPT = `You are a world-class brand identity designer. Generate complete brand kits in JSON format.

RULES:
- All hex colors must be valid 6-digit hex (e.g., "#4A90D9")
- Google Font names must be real fonts available on fonts.google.com
- Logo concepts should be descriptive enough for a designer to execute
- Mockup ideas should be realistic for print-on-demand products
- Brand voice guidelines should be actionable and specific

Respond with ONLY valid JSON matching this structure (no markdown, no explanation):
{
  "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "neutral": "#hex", "background": "#hex" },
  "colorRationale": "Why these colors work for this brand",
  "logos": [{ "name": "Name", "description": "Visual description", "usage": "Where to use it" }],
  "fonts": [{ "name": "Font Name", "role": "Headlines|Body Text", "googleFont": "Exact Google Font name", "rationale": "Why this font", "sizes": "Recommended sizes" }],
  "mockups": [{ "product": "Product type", "designConcept": "What the design looks like", "placement": "Where on the product" }],
  "brandVoice": { "tone": "Tone description", "messaging": "Key message", "doWrite": "Examples of good copy", "dontWrite": "Examples to avoid" },
  "usageGuidelines": "How to maintain brand consistency"
}`;

export class ClaudeService {
  private client: Anthropic;
  private model = 'claude-sonnet-4-20250514';

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Cause: ANTHROPIC_API_KEY not set. Fix: Add to .env file. Retry: Restart server.'
      );
    }
    this.client = new Anthropic({ apiKey });
  }

  async generateBrandKit(input: BrandKitInput): Promise<BrandKit> {
    const userPrompt = `Create a complete brand kit for the following business:

BUSINESS DESCRIPTION: ${input.description}
TARGET AUDIENCE: ${input.audience}
DESIRED STYLE: ${input.style}

Generate a comprehensive, professional brand identity kit. Include at least 3 logo concepts and 5 product mockup ideas suitable for print-on-demand (t-shirts, mugs, tote bags, phone cases, stickers).`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      // Extract text content
      const textBlock = response.content.find(block => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('Cause: Claude returned no text content. Fix: Check API key and model. Retry: Yes.');
      }

      // Parse JSON from response (strip any markdown fencing)
      const jsonStr = textBlock.text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        throw new Error(
          `Cause: Claude returned invalid JSON. Fix: Retry with different prompt. Retry: Yes, immediately.`
        );
      }

      // Validate against schema
      const result = brandKitResponseSchema.safeParse(parsed);
      if (!result.success) {
        console.error('Brand kit validation errors:', result.error.issues);
        throw new Error(
          `Cause: Brand kit response failed validation (${result.error.issues.length} issues). Fix: Retry. Retry: Yes.`
        );
      }

      return result.data;

    } catch (error: any) {
      if (error instanceof Anthropic.APIError) {
        if (error.status === 429) {
          throw new Error('Cause: Claude API rate limited. Fix: Wait 60 seconds. Retry: Yes, with backoff.');
        }
        if (error.status === 401) {
          throw new Error('Cause: Invalid ANTHROPIC_API_KEY. Fix: Check API key in .env. Retry: After fixing key.');
        }
        throw new Error(`Cause: Claude API error (${error.status}). Fix: Check Anthropic status page. Retry: Yes.`);
      }
      throw error;
    }
  }
}

// Singleton instance
let instance: ClaudeService | null = null;

export function getClaudeService(): ClaudeService {
  if (!instance) {
    instance = new ClaudeService();
  }
  return instance;
}
```

### File 5: Brand Kit API Route

**Create:** `server/routes/brand-kit-routes.ts`

```typescript
import { Express, Request, Response } from 'express';
import { getClaudeService, BrandKit } from '../services/claude-service';
import { validateBody } from '../middleware/validate';
import { brandKitInputSchema } from '../../shared/validation';

// Simple in-memory rate limit for brand kit generation
// (more expensive than normal API calls due to Claude API cost)
const generationLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_GENERATIONS = 5; // per hour per user
const GENERATION_WINDOW = 60 * 60 * 1000; // 1 hour

function checkGenerationLimit(userId: string): boolean {
  const now = Date.now();
  const record = generationLimits.get(userId);

  if (!record || record.resetAt < now) {
    generationLimits.set(userId, { count: 1, resetAt: now + GENERATION_WINDOW });
    return true;
  }

  if (record.count >= MAX_GENERATIONS) {
    return false;
  }

  record.count++;
  return true;
}

export function registerBrandKitRoutes(app: Express, requireAuth: any) {

  /**
   * POST /api/brand-kit/generate
   * Generate a brand kit using Claude API
   * Requires authentication
   * Rate limited: 5 generations per hour per user
   */
  app.post('/api/brand-kit/generate',
    requireAuth,
    validateBody(brandKitInputSchema),
    async (req: Request, res: Response) => {
      const userId = (req as any).userId || (req as any).user?.id;

      // Rate limit check (Claude API costs ~$0.15/call)
      if (!checkGenerationLimit(userId)) {
        return res.status(429).json({
          success: false,
          message: 'Generation limit reached (5 per hour). Try again later.',
        });
      }

      try {
        const claude = getClaudeService();
        const brandKit = await claude.generateBrandKit(req.body);

        // Store generation in session for later purchase
        (req as any).session.pendingBrandKit = {
          kit: brandKit,
          input: req.body,
          generatedAt: new Date().toISOString(),
        };

        return res.json({
          success: true,
          data: brandKit,
        });

      } catch (error: any) {
        console.error('Brand kit generation failed:', error.message);
        return res.status(500).json({
          success: false,
          message: error.message || 'Brand kit generation failed. Please try again.',
        });
      }
    }
  );

  /**
   * POST /api/brand-kit/checkout
   * Create a Stripe checkout session for purchasing a brand kit
   * Requires authentication + a pending brand kit in session
   */
  app.post('/api/brand-kit/checkout',
    requireAuth,
    async (req: Request, res: Response) => {
      const pending = (req as any).session.pendingBrandKit;
      if (!pending) {
        return res.status(400).json({
          success: false,
          message: 'No brand kit to purchase. Generate one first.',
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'FlashFusion Brand Kit',
                description: `Custom brand kit: ${pending.input.description.slice(0, 100)}`,
              },
              unit_amount: 2000, // $20.00
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${process.env.ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:5000'}/brand-kit/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:5000'}/brand-kit/generate`,
          metadata: {
            userId: (req as any).userId,
            generatedAt: pending.generatedAt,
          },
        });

        return res.json({
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        });

      } catch (error: any) {
        console.error('Stripe checkout creation failed:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Payment setup failed. Please try again.',
        });
      }
    }
  );

  /**
   * GET /api/brand-kit/download
   * Verify payment and return brand kit data for PDF generation
   * Client generates PDF (jsPDF) after this confirms payment
   */
  app.get('/api/brand-kit/download',
    requireAuth,
    async (req: Request, res: Response) => {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing session_id parameter',
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
          return res.status(402).json({
            success: false,
            message: 'Payment not completed',
          });
        }

        // Verify this user owns this session
        if (session.metadata.userId !== (req as any).userId) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized',
          });
        }

        const pending = (req as any).session.pendingBrandKit;
        if (!pending) {
          return res.status(404).json({
            success: false,
            message: 'Brand kit data not found in session. It may have expired.',
          });
        }

        return res.json({
          success: true,
          data: pending.kit,
          input: pending.input,
          paid: true,
        });

      } catch (error: any) {
        console.error('Download verification failed:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Could not verify payment. Contact support.',
        });
      }
    }
  );
}
```

### File 6: Register the new routes

**Edit:** `server/routes.ts` (or wherever routes are registered)

Add at the bottom of the route registration:

```typescript
import { registerBrandKitRoutes } from './routes/brand-kit-routes';

// Inside the registerRoutes function:
registerBrandKitRoutes(app, requireAuth);
```

### File 7: Stripe Webhook Signature Verification

**Edit:** the existing webhook handler (likely in `server/routes/billing-routes.ts`)

```typescript
// CRITICAL: Webhook route must use express.raw(), NOT express.json()
// This must be registered BEFORE the global JSON body parser

// In server/index.ts, BEFORE app.use(express.json(...)):
app.post('/api/billing/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the verified event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`✅ Payment received: ${session.id} from user ${session.metadata.userId}`);
        // Future: update DB with purchase record
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);
```

**⚠️ IMPORTANT:** The raw body parser for webhooks MUST be registered before `app.use(express.json())` in `server/index.ts`. Otherwise Express will parse the body as JSON first and Stripe signature verification will fail.

---

## Day 4: Client-Side (Brand Kit Form + Preview + PDF)

### File 8: Brand Kit Page Component

**Create:** `client/src/pages/BrandKitGenerator.tsx`

```tsx
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// Types matching server response
interface BrandKit {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
  };
  colorRationale: string;
  logos: Array<{ name: string; description: string; usage: string }>;
  fonts: Array<{ name: string; role: string; googleFont: string; rationale: string; sizes: string }>;
  mockups: Array<{ product: string; designConcept: string; placement: string }>;
  brandVoice: { tone: string; messaging: string; doWrite: string; dontWrite: string };
  usageGuidelines: string;
}

const STYLE_OPTIONS = [
  { value: 'modern-minimal', label: 'Modern & Minimal' },
  { value: 'bold-vibrant', label: 'Bold & Vibrant' },
  { value: 'natural-organic', label: 'Natural & Organic' },
  { value: 'luxury-elegant', label: 'Luxury & Elegant' },
  { value: 'playful-creative', label: 'Playful & Creative' },
  { value: 'tech-professional', label: 'Tech & Professional' },
];

export default function BrandKitGenerator() {
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('modern-minimal');
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  // Generate brand kit
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/brand-kit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ description, audience, style }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Generation failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setBrandKit(data.data);
      }
    },
  });

  // Purchase flow
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/brand-kit/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Checkout failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Brand Kit Generator</h1>

      {/* Input Form */}
      {!brandKit && (
        <form onSubmit={(e) => { e.preventDefault(); generateMutation.mutate(); }}
              className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe your brand
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Handmade jewelry inspired by ocean waves, targeting women 25-45..."
              className="w-full p-3 border rounded-lg min-h-[120px]"
              required
              minLength={10}
              maxLength={2000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Women 25-45 who love travel and nature"
              className="w-full p-3 border rounded-lg"
              required
              minLength={5}
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Brand style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    style === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={generateMutation.isPending || description.length < 10}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateMutation.isPending ? 'Generating... (15-30 seconds)' : 'Generate Brand Kit'}
          </button>

          {generateMutation.isError && (
            <p className="text-red-600 text-sm">
              {(generateMutation.error as Error).message}
            </p>
          )}
        </form>
      )}

      {/* Preview */}
      {brandKit && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Brand Kit</h2>
            <button
              onClick={() => { setBrandKit(null); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Generate another
            </button>
          </div>

          {/* Color Palette */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Color Palette</h3>
            <div className="flex gap-3 mb-2">
              {Object.entries(brandKit.colors).map(([name, hex]) => (
                <div key={name} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="text-xs mt-1 capitalize">{name}</p>
                  <p className="text-xs text-gray-500">{hex}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">{brandKit.colorRationale}</p>
          </section>

          {/* Logo Concepts */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Logo Concepts</h3>
            <div className="grid gap-4">
              {brandKit.logos.map((logo, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{logo.name}</h4>
                  <p className="text-sm text-gray-600">{logo.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Use for: {logo.usage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Typography</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {brandKit.fonts.map((font, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{font.name}</h4>
                  <p className="text-sm text-gray-500">{font.role}</p>
                  <p className="text-sm">{font.rationale}</p>
                  <p className="text-xs text-gray-400 mt-1">Sizes: {font.sizes}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Mockups */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Product Mockup Ideas</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {brandKit.mockups.map((mockup, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{mockup.product}</h4>
                  <p className="text-sm">{mockup.designConcept}</p>
                  <p className="text-xs text-gray-400 mt-1">Placement: {mockup.placement}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Voice */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Brand Voice</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-700">✅ Do Write</h4>
                <p className="text-sm">{brandKit.brandVoice.doWrite}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-red-700">❌ Don't Write</h4>
                <p className="text-sm">{brandKit.brandVoice.dontWrite}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Tone:</strong> {brandKit.brandVoice.tone}
            </p>
          </section>

          {/* Usage Guidelines */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Usage Guidelines</h3>
            <p className="text-sm text-gray-600">{brandKit.usageGuidelines}</p>
          </section>

          {/* Purchase CTA */}
          <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 mt-8">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="font-semibold">Download Full Brand Kit (PDF)</p>
                <p className="text-sm text-gray-500">Includes all colors, typography, logos, mockups & voice guide</p>
              </div>
              <button
                onClick={() => purchaseMutation.mutate()}
                disabled={purchaseMutation.isPending}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                {purchaseMutation.isPending ? 'Setting up...' : 'Purchase & Download — $20'}
              </button>
            </div>
            {purchaseMutation.isError && (
              <p className="text-red-600 text-sm mt-2">
                {(purchaseMutation.error as Error).message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### File 9: PDF Generation (client-side)

**Create:** `client/src/lib/pdf-generator.ts`

```typescript
import jsPDF from 'jspdf';

interface BrandKit {
  colors: Record<string, string>;
  colorRationale: string;
  logos: Array<{ name: string; description: string; usage: string }>;
  fonts: Array<{ name: string; role: string; googleFont: string; rationale: string; sizes: string }>;
  mockups: Array<{ product: string; designConcept: string; placement: string }>;
  brandVoice: { tone: string; messaging: string; doWrite: string; dontWrite: string };
  usageGuidelines: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  return [
    parseInt(cleaned.substring(0, 2), 16),
    parseInt(cleaned.substring(2, 4), 16),
    parseInt(cleaned.substring(4, 6), 16),
  ];
}

export function generateBrandKitPDF(kit: BrandKit, brandDescription: string): Blob {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: add new page if needed
  function checkPage(needed: number) {
    if (y + needed > pageHeight - 30) {
      doc.addPage();
      y = margin;
    }
  }

  // Helper: section heading
  function heading(text: string) {
    checkPage(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(text, margin, y);
    y += 10;
  }

  // Helper: body text with wrapping
  function body(text: string) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPage(lines.length * 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  }

  // ===== COVER PAGE =====
  const [pr, pg, pb] = hexToRgb(kit.colors.primary);
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('Brand Kit', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(brandDescription, contentWidth - 20);
  doc.text(descLines, pageWidth / 2, pageHeight / 2 + 5, { align: 'center' });

  doc.setFontSize(10);
  doc.text('Generated by FlashFusion', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 14, { align: 'center' });

  // ===== COLOR PALETTE =====
  doc.addPage();
  y = margin;
  heading('Color Palette');

  const swatchSize = 25;
  const swatchGap = 5;
  const colors = Object.entries(kit.colors);
  colors.forEach(([name, hex], i) => {
    const x = margin + i * (swatchSize + swatchGap);
    if (x + swatchSize > pageWidth - margin) return; // skip if overflows
    const [r, g, b] = hexToRgb(hex);
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, swatchSize, swatchSize, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(name.charAt(0).toUpperCase() + name.slice(1), x + swatchSize / 2, y + swatchSize + 5, { align: 'center' });
    doc.text(hex, x + swatchSize / 2, y + swatchSize + 9, { align: 'center' });
  });
  y += swatchSize + 15;
  body(kit.colorRationale);

  // ===== TYPOGRAPHY =====
  y += 5;
  heading('Typography');
  kit.fonts.forEach(font => {
    checkPage(25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${font.name} — ${font.role}`, margin, y);
    y += 6;
    body(font.rationale);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Google Font: ${font.googleFont} | Sizes: ${font.sizes}`, margin, y);
    y += 8;
  });

  // ===== LOGO CONCEPTS =====
  heading('Logo Concepts');
  kit.logos.forEach((logo, i) => {
    checkPage(25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}. ${logo.name}`, margin, y);
    y += 6;
    body(logo.description);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Best for: ${logo.usage}`, margin, y);
    y += 8;
  });

  // ===== PRODUCT MOCKUPS =====
  heading('Product Mockup Ideas');
  kit.mockups.forEach((mockup, i) => {
    checkPage(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}. ${mockup.product}`, margin, y);
    y += 5;
    body(`Design: ${mockup.designConcept}`);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Placement: ${mockup.placement}`, margin, y);
    y += 8;
  });

  // ===== BRAND VOICE =====
  heading('Brand Voice');
  body(`Tone: ${kit.brandVoice.tone}`);
  body(`Key Message: ${kit.brandVoice.messaging}`);
  y += 3;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 0);
  doc.text('Do Write:', margin, y);
  y += 5;
  body(kit.brandVoice.doWrite);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 0, 0);
  doc.text("Don't Write:", margin, y);
  y += 5;
  body(kit.brandVoice.dontWrite);

  // ===== USAGE GUIDELINES =====
  heading('Usage Guidelines');
  body(kit.usageGuidelines);

  // ===== FOOTER ON EVERY PAGE =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by FlashFusion — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename = 'brand-kit.pdf') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### File 10: Success/Download Page

**Create:** `client/src/pages/BrandKitSuccess.tsx`

```tsx
import { useEffect, useState } from 'react';
import { generateBrandKitPDF, downloadPDF } from '../lib/pdf-generator';

export default function BrandKitSuccess() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No payment session found.');
      return;
    }

    fetch(`/api/brand-kit/download?session_id=${sessionId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.paid) {
          const blob = generateBrandKitPDF(data.data, data.input.description);
          downloadPDF(blob, 'FlashFusion-Brand-Kit.pdf');
          setStatus('ready');
        } else {
          setStatus('error');
          setErrorMsg(data.message || 'Payment verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Could not verify payment. Please contact support.');
      });
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 text-center mt-20">
      {status === 'loading' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Verifying payment...</h1>
          <p className="text-gray-500">Your download will start automatically.</p>
        </>
      )}
      {status === 'ready' && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-green-700">🎉 Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your brand kit PDF has been downloaded.</p>
          <p className="text-sm text-gray-400">
            Didn't get the download?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 underline"
            >
              Click here to retry
            </button>
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-red-700">Something went wrong</h1>
          <p className="text-gray-600">{errorMsg}</p>
        </>
      )}
    </div>
  );
}
```

---

## Day 5: Integration Test + Deploy

### Manual smoke test (1 hour)

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:5000
# 3. Register an account
# 4. Navigate to /brand-kit/generate (or wherever you mount the route)
# 5. Fill in: "Handmade jewelry inspired by ocean waves"
#    Audience: "Women 25-45 who love nature and travel"
#    Style: Natural & Organic
# 6. Click Generate → wait 15-30 seconds
# 7. Preview should show colors, logos, fonts, mockups
# 8. Click "Purchase & Download — $20"
# 9. Stripe checkout opens → use test card 4242 4242 4242 4242
# 10. Redirects to success page → PDF downloads
# 11. Open PDF → verify content matches preview
```

### Deploy to production

```bash
# Build
npm run build

# Test production build locally
NODE_ENV=production npm start
# Verify: http://localhost:5000/api/health → {"status":"ok","environment":"production"}

# Deploy to Vercel (or your platform)
vercel --prod

# Set env vars in Vercel dashboard:
# DATABASE_URL, SESSION_SECRET, ANTHROPIC_API_KEY, STRIPE_SECRET_KEY,
# STRIPE_WEBHOOK_SECRET, ALLOWED_ORIGINS, ENCRYPTION_KEY

# Add Stripe production webhook endpoint:
# Stripe Dashboard → Webhooks → Add Endpoint
# URL: https://your-app.vercel.app/api/billing/webhook
# Events: checkout.session.completed
# Copy signing secret → update STRIPE_WEBHOOK_SECRET in Vercel

# Test production:
# 1. Visit https://your-app.vercel.app
# 2. Register → Generate → Purchase with real card ($20) → Download
# 3. Refund yourself in Stripe Dashboard
```

### Send to testers

Message template:

```
Hey! I built something I'd love your feedback on.

FlashFusion generates a complete brand kit for your business in 2 minutes
— colors, logo concepts, fonts, product mockups, and brand voice guide.

Here's how to test:
1. Go to [YOUR URL]
2. Create an account
3. Click "Generate Brand Kit"
4. Describe any business idea (real or made up)
5. Check out the preview
6. If you like it, you can purchase the full PDF for $20

I'd love to know:
- Was the brand kit useful/accurate?
- Would you pay $20 for this?
- What was confusing?

Thanks! 🙏
```

---

## Routing Integration Note

You'll need to add the two new pages to your React Router config. The exact location depends on your app structure, but it'll look something like:

```tsx
// In your router config (likely App.tsx or routes.tsx):
import BrandKitGenerator from './pages/BrandKitGenerator';
import BrandKitSuccess from './pages/BrandKitSuccess';

// Add routes:
<Route path="/brand-kit/generate" element={<BrandKitGenerator />} />
<Route path="/brand-kit/success" element={<BrandKitSuccess />} />
```

Make sure these routes are wrapped in whatever auth/layout wrapper your app uses.

---

## .env.example additions

Add these to the existing `.env.example`:

```env
# ===== BRAND KIT GENERATION (Revenue Flow) =====
# Anthropic API key for Claude (brand kit generation)
# Get from: https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Encryption key for platform credentials at rest
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-character-hex-string-here
```

---

## Day 1-5 Summary Checklist

- [ ] Day 1: npm install @anthropic-ai/sdk jspdf
- [ ] Day 1: Create validate.ts, validation.ts, requireRole.ts
- [ ] Day 1: Patch auth-routes.ts with Zod validation
- [ ] Day 1: Patch integrations/routes.ts (data leak + role check + AI limits)
- [ ] Day 1: Create env-validator.ts, add to index.ts
- [ ] Day 1: Run manual security tests (4 curl commands)
- [ ] Day 2: Create claude-service.ts
- [ ] Day 2: Create brand-kit-routes.ts
- [ ] Day 2: Register routes + add webhook signature verification
- [ ] Day 3: Create BrandKitGenerator.tsx
- [ ] Day 3: Create pdf-generator.ts
- [ ] Day 3: Create BrandKitSuccess.tsx
- [ ] Day 3: Add routes to React Router
- [ ] Day 4: End-to-end test locally (form → generate → preview → pay → download)
- [ ] Day 4: Fix any issues from testing
- [ ] Day 5: Deploy to Vercel
- [ ] Day 5: Set production env vars
- [ ] Day 5: Add Stripe production webhook
- [ ] Day 5: Test with real $20 payment (refund yourself)
- [ ] Day 5: Send link to testers
