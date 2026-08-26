---
name: stripe-integration
description: Comprehensive Stripe payments integration covering one-time payments, subscriptions, billing management, webhooks, and compliance. Includes implementation patterns for checkout flows, customer portals, and revenue operations. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Stripe Integration

## Overview

Stripe integration enables secure payment processing, subscription management, and billing operations for modern applications. This skill covers the complete spectrum of Stripe capabilities, from simple checkout implementations to complex subscription billing with metered usage and multi-party payments.

Effective Stripe integration requires understanding both the technical implementation patterns and the business logic surrounding payments. This includes handling edge cases like failed payments, subscription upgrades/downgrades, prorations, tax calculations, and compliance requirements across different jurisdictions.

This skill provides battle-tested patterns for common payment scenarios while addressing the nuanced requirements of production payment systems. Beyond basic implementation, it covers webhook handling for reliable event processing, testing strategies, and operational concerns like refunds, disputes, and revenue recovery.

### Why This Matters

- **Revenue enablement**: Proper payment integration directly impacts conversion and revenue collection
- **Customer experience**: Smooth checkout reduces cart abandonment; easy billing management reduces churn
- **Compliance**: PCI DSS compliance is mandatory; Stripe handles most requirements when implemented correctly
- **Operational efficiency**: Automated billing, dunning, and invoicing reduce manual finance operations
- **Scalability**: Stripe's infrastructure handles payment volume growth without architecture changes

## When to Use

### Primary Triggers

- "Add payment processing to our application"
- "Set up subscription billing"
- "Implement Stripe Checkout"
- "Create a customer billing portal"
- "Handle payment webhooks"
- "Set up usage-based billing"
- "Implement payment methods management"

### Specific Use Cases

1. **One-time Payments**: Product purchases, donations, pay-what-you-want
2. **Subscription Billing**: SaaS plans, memberships, recurring services
3. **Metered Billing**: API usage, consumption-based pricing
4. **Marketplace Payments**: Multi-party payments with Stripe Connect
5. **Invoice Management**: B2B invoicing, net terms, manual billing
6. **Customer Portal**: Self-service billing management

## Core Processes

### Process 1: Stripe Checkout Implementation

**Objective**: Implement a secure, conversion-optimized checkout flow.

**Server-Side Session Creation**:

```typescript
// app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerId, metadata } = await req.json();

    // Create or retrieve customer
    let customer = customerId;
    if (!customer) {
      const user = await getCurrentUser(); // Your auth logic
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customer = stripeCustomer.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer,
      mode: 'subscription', // or 'payment' for one-time
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/canceled`,
      metadata,
      subscription_data: {
        metadata,
        trial_period_days: 14, // Optional trial
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

**Client-Side Redirect**:

```typescript
// components/CheckoutButton.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe Now'}
    </button>
  );
}
```

### Process 2: Webhook Handler Implementation

**Objective**: Reliably process Stripe events for subscription lifecycle management.

**Webhook Endpoint**:

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialEnding(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handler implementations
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as Stripe.Customer).metadata.userId;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as Stripe.Customer).metadata.userId;

  // Send payment failed notification
  await sendEmail({
    to: (customer as Stripe.Customer).email!,
    template: 'payment-failed',
    data: {
      invoiceUrl: invoice.hosted_invoice_url,
      amount: (invoice.amount_due / 100).toFixed(2),
      currency: invoice.currency.toUpperCase(),
    },
  });

  // Update internal status
  await prisma.user.update({
    where: { id: userId },
    data: { paymentStatus: 'failed' },
  });
}
```

### Process 3: Customer Portal Integration

**Objective**: Enable self-service subscription management.

**Portal Session Creation**:

```typescript
// app/api/billing/portal/route.ts
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: 'No billing account found' },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return NextResponse.json({ url: session.url });
}
```

**Portal Configuration (Dashboard or API)**:

```typescript
// scripts/configure-portal.ts
const portalConfig = await stripe.billingPortal.configurations.create({
  business_profile: {
    headline: 'Manage your subscription',
    privacy_policy_url: 'https://yoursite.com/privacy',
    terms_of_service_url: 'https://yoursite.com/terms',
  },
  features: {
    subscription_cancel: {
      enabled: true,
      mode: 'at_period_end',
      cancellation_reason: {
        enabled: true,
        options: [
          'too_expensive',
          'missing_features',
          'switched_service',
          'unused',
          'other',
        ],
      },
    },
    subscription_update: {
      enabled: true,
      default_allowed_updates: ['price', 'quantity'],
      proration_behavior: 'create_prorations',
      products: [
        {
          product: 'prod_xxx',
          prices: ['price_monthly', 'price_yearly'],
        },
      ],
    },
    payment_method_update: { enabled: true },
    invoice_history: { enabled: true },
  },
});
```

### Process 4: Subscription Plan Management

**Objective**: Handle plan changes, trials, and prorations.

**Plan Change Handler**:

```typescript
// lib/stripe/subscriptions.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string,
  options: {
    prorate?: boolean;
    billingCycleAnchor?: 'now' | 'unchanged';
  } = {}
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: options.prorate ? 'create_prorations' : 'none',
    billing_cycle_anchor: options.billingCycleAnchor,
  });

  return updatedSubscription;
}

export async function cancelSubscription(
  subscriptionId: string,
  options: {
    immediate?: boolean;
    feedback?: string;
  } = {}
) {
  if (options.immediate) {
    return stripe.subscriptions.cancel(subscriptionId, {
      cancellation_details: {
        comment: options.feedback,
      },
    });
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
    cancellation_details: {
      comment: options.feedback,
    },
  });
}

export async function resumeSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Preview proration before plan change
export async function previewPlanChange(
  customerId: string,
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const invoice = await stripe.invoices.createPreview({
    customer: customerId,
    subscription: subscriptionId,
    subscription_details: {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    },
  });

  return {
    amount: invoice.total / 100,
    currency: invoice.currency,
    lines: invoice.lines.data.map(line => ({
      description: line.description,
      amount: line.amount / 100,
    })),
  };
}
```

### Process 5: Usage-Based Billing

**Objective**: Implement metered/consumption-based pricing.

**Usage Reporting**:

```typescript
// lib/stripe/usage.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function reportUsage(
  subscriptionItemId: string,
  quantity: number,
  options: {
    action?: 'increment' | 'set';
    timestamp?: number;
    idempotencyKey?: string;
  } = {}
) {
  return stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      action: options.action || 'increment',
      timestamp: options.timestamp || Math.floor(Date.now() / 1000),
    },
    {
      idempotencyKey: options.idempotencyKey,
    }
  );
}

// Batch usage reporting for API calls
export class UsageTracker {
  private buffer: Map<string, number> = new Map();
  private flushInterval: NodeJS.Timer;

  constructor(private flushIntervalMs = 60000) {
    this.flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  track(subscriptionItemId: string, quantity: number = 1) {
    const current = this.buffer.get(subscriptionItemId) || 0;
    this.buffer.set(subscriptionItemId, current + quantity);
  }

  async flush() {
    const entries = Array.from(this.buffer.entries());
    this.buffer.clear();

    await Promise.all(
      entries.map(([itemId, quantity]) =>
        reportUsage(itemId, quantity, { action: 'increment' })
      )
    );
  }

  destroy() {
    clearInterval(this.flushInterval);
    this.flush();
  }
}
```

**Metered Price Configuration**:

```typescript
// Create metered price
const price = await stripe.prices.create({
  product: 'prod_xxx',
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum',
  },
  billing_scheme: 'tiered',
  tiers_mode: 'graduated',
  tiers: [
    { up_to: 1000, unit_amount: 0 },           // First 1000 free
    { up_to: 10000, unit_amount: 10 },         // $0.001 per unit
    { up_to: 100000, unit_amount: 8 },         // $0.0008 per unit
    { up_to: 'inf', unit_amount: 5 },          // $0.0005 per unit
  ],
});
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Stripe CLI | Local webhook testing | Development |
| Stripe Dashboard | Manual operations, debugging | Support, debugging |
| stripe-node SDK | API integration | All server-side operations |
| @stripe/stripe-js | Client-side tokenization | Payment forms |
| @stripe/react-stripe-js | React components | Checkout UIs |

### Key Templates

**Pricing Table Component**:
```typescript
// Embed Stripe's hosted pricing table
<stripe-pricing-table
  pricing-table-id="prctbl_xxx"
  publishable-key="pk_live_xxx"
  customer-email={user.email}
/>
```

**Subscription Status Hook**:
```typescript
export function useSubscription() {
  const { data, isLoading } = useSWR('/api/subscription', fetcher);

  return {
    subscription: data?.subscription,
    isActive: data?.subscription?.status === 'active',
    isTrial: data?.subscription?.status === 'trialing',
    isPastDue: data?.subscription?.status === 'past_due',
    isLoading,
  };
}
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Checkout Conversion | > 70% | Sessions completed / started |
| Payment Success Rate | > 98% | Successful / attempted |
| Churn Rate | < 5% monthly | Cancellations / active subs |
| Failed Payment Recovery | > 40% | Recovered / failed |
| Time to First Payment | < 2 minutes | Signup to payment |

## Common Pitfalls

1. **Webhook Reliability**: Always return 200 quickly; process async. Implement idempotency.
2. **Customer Mismatch**: Always link Stripe customers to your user records via metadata.
3. **Proration Surprises**: Preview prorations before plan changes to avoid billing confusion.
4. **Test vs Live Keys**: Use environment variables; never hardcode. Check mode before production.
5. **Missing Webhook Events**: Subscribe to all lifecycle events, not just success paths.

## Integration Points

- **Authentication**: Link Stripe customers to authenticated users
- **Database**: Sync subscription status for feature gating
- **Email**: Transactional emails for billing events
- **Analytics**: Track conversion, churn, and revenue metrics
- **Support**: Customer portal for self-service; admin tools for support team
