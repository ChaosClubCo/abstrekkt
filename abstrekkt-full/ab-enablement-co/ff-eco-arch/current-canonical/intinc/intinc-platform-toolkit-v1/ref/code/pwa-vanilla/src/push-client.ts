/**
 * Push subscription manager — no framework dependencies.
 *
 * @example
 * ```ts
 * const push = new PushClient({
 *   vapidPublicKey: "BExRb...",
 *   subscribeEndpoint: "/api/push/subscribe",
 *   unsubscribeEndpoint: "/api/push/unsubscribe",
 * });
 * await push.subscribe();
 * ```
 */

export interface PushClientOptions {
  vapidPublicKey: string;
  subscribeEndpoint: string;
  unsubscribeEndpoint: string;
}

export class PushClient {
  private subscription: PushSubscription | null = null;

  constructor(private readonly options: PushClientOptions) {}

  private urlBase64ToUint8Array(base64: string): Uint8Array {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(b64);
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }

  async getExistingSubscription(): Promise<PushSubscription | null> {
    const reg = await navigator.serviceWorker.ready;
    this.subscription = await reg.pushManager.getSubscription();
    return this.subscription;
  }

  async subscribe(): Promise<PushSubscription> {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error(`Notification permission: ${permission}`);
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.options.vapidPublicKey),
    });

    await fetch(this.options.subscribeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });

    this.subscription = sub;
    return sub;
  }

  async unsubscribe(): Promise<void> {
    if (!this.subscription) {
      this.subscription = await this.getExistingSubscription();
    }
    if (!this.subscription) return;

    const endpoint = this.subscription.endpoint;
    await this.subscription.unsubscribe();

    await fetch(this.options.unsubscribeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    });

    this.subscription = null;
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }
}
