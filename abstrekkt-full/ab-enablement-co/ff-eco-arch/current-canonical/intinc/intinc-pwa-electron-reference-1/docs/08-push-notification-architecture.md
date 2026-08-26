# Push Notification Architecture

> **Diagrams**: `diagrams/push-notification-sequence` for full flow.
> **Code**: `code/push-server/` for server, `code/react-pwa/src/hooks/usePushNotifications.ts` for client.

---

## End-to-End Flow

```
1. Client: Request notification permission (user gesture required)
2. Client: Subscribe via Push API → gets PushSubscription (endpoint + keys)
3. Client: Send subscription to your server (POST /api/push/subscribe)
4. Server: Store subscription in database
5. Server: When event occurs → create payload → encrypt with subscription keys → POST to push service endpoint
6. Push Service (FCM/APNs): Queue → deliver to device
7. Service Worker: Receive 'push' event → parse payload → showNotification()
8. User: Sees notification → clicks → 'notificationclick' event → open/focus app
```

---

## VAPID Authentication

VAPID (Voluntary Application Server Identification) proves your server is authorized to send push messages.

```bash
npx web-push generate-vapid-keys
# Output:
# Public Key: BNx8h...
# Private Key: your_private_key_here
```

- **Public key**: Goes in your frontend code. Used when subscribing.
- **Private key**: Stays on your server. Used to sign push messages. Treat as a secret.

---

## Client-Side Implementation

### Permission Strategy

**Never request on page load.** Acceptance rates:

| Timing | Acceptance Rate |
|--------|----------------|
| Page load (cold prompt) | 3–8% |
| After first meaningful interaction | 15–25% |
| After user enables a feature that implies push | 30–50% |
| After user explicitly clicks "Enable Notifications" | 50–70% |

**Best practice**: Wait for user intent signal, then explain value before requesting.

```typescript
// Show a pre-permission UI FIRST
"Get notified when your deployment finishes?"
[Yes, notify me] [No thanks]

// Only on "Yes" → request browser permission
const permission = await Notification.requestPermission();
```

### Subscription Management

See `code/react-pwa/src/hooks/usePushNotifications.ts` for the complete React hook.

Key concerns:
- Subscriptions can expire or be revoked. Check on each app load.
- Store subscription server-side with user ID for targeted sends.
- Handle `pushsubscriptionchange` event in SW for automatic re-subscription.

---

## Server-Side Implementation

See `code/push-server/` for complete Express + TypeScript server.

### Sending a Notification

```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:engineering@intinc.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

async function sendNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<SendResult> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      TTL: payload.ttl || 86400,        // Time to live: 24 hours default
      urgency: payload.urgency || 'normal', // low, normal, high, very-low
      topic: payload.topic,              // Replaces previous with same topic
    });
    return { success: true };
  } catch (error: any) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription expired or invalid — remove from database
      await removeSubscription(subscription.endpoint);
      return { success: false, reason: 'expired' };
    }
    if (error.statusCode === 429) {
      // Rate limited — retry with backoff
      return { success: false, reason: 'rate-limited', retryAfter: error.headers?.['retry-after'] };
    }
    throw error;
  }
}
```

### Retry Logic

```typescript
async function sendWithRetry(
  subscription: PushSubscription,
  payload: NotificationPayload,
  maxRetries = 3
): Promise<void> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await sendNotification(subscription, payload);
    if (result.success) return;
    if (result.reason === 'expired') return; // Don't retry expired
    // Exponential backoff: 1s, 2s, 4s
    await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
  }
}
```

### Batch Sending

For sending to many subscribers (e.g., broadcast):

```typescript
async function broadcastNotification(
  payload: NotificationPayload,
  batchSize = 100
): Promise<BroadcastResult> {
  const subscriptions = await getAllActiveSubscriptions();
  const results = { sent: 0, failed: 0, expired: 0 };

  for (let i = 0; i < subscriptions.length; i += batchSize) {
    const batch = subscriptions.slice(i, i + batchSize);
    const promises = batch.map((sub) => sendNotification(sub, payload));
    const batchResults = await Promise.allSettled(promises);

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value.success) results.sent++;
      else if (result.status === 'fulfilled' && result.value.reason === 'expired') results.expired++;
      else results.failed++;
    }

    // Respect rate limits between batches
    await new Promise((r) => setTimeout(r, 100));
  }

  return results;
}
```

---

## Safari Push Specifics

Safari 16.4+ supports web push, but with requirements:
1. App must be added to Home Screen first (iOS)
2. Permission must be requested during a user gesture
3. Uses the same Push API as other browsers (finally)
4. `navigator.standalone` must be `true` (running from Home Screen)

---

## Notification Payload Design

```typescript
interface NotificationPayload {
  title: string;          // Required. Keep under 50 chars.
  body: string;           // 2-3 sentences max
  icon?: string;          // 192x192 PNG
  badge?: string;         // 72x72 monochrome (Android status bar)
  image?: string;         // Large image (expanded notification)
  tag?: string;           // Groups — same tag replaces previous
  renotify?: boolean;     // Re-alert even if same tag
  data?: {
    url: string;          // Where to navigate on click
    [key: string]: any;
  };
  actions?: Array<{       // Max 2 action buttons
    action: string;
    title: string;
    icon?: string;
  }>;
  ttl?: number;           // Seconds until push service discards
  urgency?: 'very-low' | 'low' | 'normal' | 'high';
  topic?: string;         // Server-side replacement key
}
```

---

## Monitoring & Analytics

Track these metrics:
- **Permission grant rate**: How many users accept notification permission
- **Subscription churn**: How many subscriptions expire per week
- **Delivery rate**: Sent vs. successfully delivered
- **Click-through rate**: Notifications clicked / notifications shown
- **Opt-out rate**: Users who revoke permission after granting

---
*Intinc Engineering — Push Architecture v2.0*
