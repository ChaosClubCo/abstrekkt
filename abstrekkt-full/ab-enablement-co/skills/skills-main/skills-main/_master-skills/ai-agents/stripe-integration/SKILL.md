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


## References
- `references/process-4-subscription-plan-management.md` — Process 4: Subscription Plan Management
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
