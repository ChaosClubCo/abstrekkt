# Cloud Functions Outline — trusted server logic

> The source mentioned Cloud Functions for "order processing, payment webhook
> handling, email triggers". This outlines the functions that MUST exist so the
> locked-down Firestore rules work: clients can't write money/trust fields, so a
> trusted server (Admin SDK, which bypasses rules) has to.
>
> Code below is an **outline/skeleton**, not a paste-and-run product. Treat it as
> untrusted until you review it. Requires the Firebase **Blaze** plan.

---

## Why these are required (not optional)

`firestore.rules` deliberately rejects client writes to:
- `orders.status`, `orders.amount`, `orders.platformFee`, `orders.paymentIntentId`
- `users.isVerified`, `users.ratingAvg`, `users.ratingCount`, `users.stripeAccountId`

So something trusted must set them. That something is these functions.

---

## F1. `createPaymentIntent` (callable / HTTPS)

Called by FlutterFlow when the buyer taps Buy. Creates a Stripe PaymentIntent
for the order amount; returns the client secret.

```js
// functions/index.js (outline) — Node 18+, firebase-functions v2
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
admin.initializeApp();

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');

exports.createPaymentIntent = onCall(
  { secrets: [STRIPE_SECRET_KEY] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());

    const { orderId } = req.data;
    const orderRef = admin.firestore().doc(`orders/${orderId}`);
    const order = (await orderRef.get()).data();

    // Trust the server's copy of the price, NOT a client-supplied amount.
    if (!order || order.buyerId !== req.auth.uid) {
      throw new HttpsError('permission-denied', 'Not your order');
    }
    if (order.status !== 'pending') {
      throw new HttpsError('failed-precondition', 'Order not payable');
    }

    const intent = await stripe.paymentIntents.create({
      amount: order.amount,            // integer cents, from Firestore
      currency: order.currency.toLowerCase(),
      metadata: { orderId, buyerId: order.buyerId, sellerId: order.sellerId },
      // For Connect payouts: application_fee_amount + transfer_data.destination
    });

    return { clientSecret: intent.client_secret };
  }
);
```

> The amount comes from the **server's** order doc, never from the request body.
> A client that sends `amount: 1` must not be able to buy a $500 item.

---

## F2. `stripeWebhook` (HTTPS) — the only thing that marks an order paid

Stripe calls this. It verifies the signature, then flips order status.

```js
const { onRequest } = require('firebase-functions/v2/https');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (request, response) => {
    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,                       // raw body required for signature
        request.headers['stripe-signature'],
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      response.status(400).send(`Webhook signature failed: ${err.message}`);
      return;
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const orderId = pi.metadata.orderId;
      await admin.firestore().doc(`orders/${orderId}`).update({
        status: 'paid',
        paymentIntentId: pi.id,
        platformFee: Math.round(pi.amount * 0.10), // example 10% commission
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    // handle payment_intent.payment_failed, charge.refunded, etc.

    response.json({ received: true }); // idempotency: ignore duplicate event ids
  }
);
```

> Never trust a client claim of payment. **Only** a signature-verified webhook
> flips `status` to `paid`.

---

## F3. `onReviewWrite` (Firestore trigger) — maintain seller rating

```js
const { onDocumentWritten } = require('firebase-functions/v2/firestore');

exports.onReviewWrite = onDocumentWritten('reviews/{reviewId}', async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  const sellerId = (after || event.data.before.data()).sellerId;

  const snap = await admin.firestore()
    .collection('reviews').where('sellerId', '==', sellerId).get();

  let sum = 0;
  snap.forEach((d) => { sum += d.data().rating; });
  const count = snap.size;
  await admin.firestore().doc(`users/${sellerId}`).update({
    ratingAvg: count ? sum / count : 0,
    ratingCount: count,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

---

## F4. `mirrorPublicProfile` (Firestore trigger) — optional

On `users/{uid}` write, mirror only public fields to `publicProfiles/{uid}` so
the catalog can show seller name/avatar/rating without exposing email/tokens.

---

## Observability & ops (the source omitted these)

- **Logging**: every function logs orderId + outcome. Use Cloud Logging.
- **Alerting**: alert on webhook signature failures and `payment_intent.payment_failed` spikes (possible fraud/card testing).
- **Idempotency**: store processed Stripe `event.id`s (or rely on the update being naturally idempotent) so retried webhooks don't double-apply fees.
- **Rate limiting**: throttle `createPaymentIntent` per user to blunt card-testing abuse.

## Rollback

- Functions are versioned. Redeploy the prior source or `firebase functions:delete <name>` to remove a bad function.
- Webhook endpoint can be disabled in the Stripe dashboard instantly if it misbehaves; orders simply stay `pending` until re-enabled (no data loss).
