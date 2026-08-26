import { useState, useCallback, useEffect } from "react";

export interface PushSubscriptionState {
  /** Current push subscription, null if not subscribed */
  subscription: PushSubscription | null;
  /** Whether the user has granted notification permission */
  permissionGranted: boolean;
  /** Whether a subscribe/unsubscribe operation is in progress */
  loading: boolean;
  /** Any error from the last operation */
  error: Error | null;
  /** Subscribe to push notifications */
  subscribe: () => Promise<void>;
  /** Unsubscribe from push notifications */
  unsubscribe: () => Promise<void>;
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

/**
 * Manages the full push subscription lifecycle.
 *
 * Requires:
 * - VITE_VAPID_PUBLIC_KEY env var set
 * - A registered service worker
 * - A /api/push/subscribe endpoint to receive the subscription
 *
 * @example
 * ```tsx
 * function PushToggle() {
 *   const { subscription, subscribe, unsubscribe, loading } = usePushSubscription();
 *   return (
 *     <button onClick={subscription ? unsubscribe : subscribe} disabled={loading}>
 *       {subscription ? "Disable" : "Enable"} Notifications
 *     </button>
 *   );
 * }
 * ```
 */
export function usePushSubscription(): PushSubscriptionState {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check existing subscription on mount
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    setPermissionGranted(Notification.permission === "granted");

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setSubscription(sub);
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) {
      setError(new Error("VAPID public key not configured"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      setPermissionGranted(permission === "granted");

      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to backend
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      setSubscription(sub);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    setLoading(true);
    setError(null);

    try {
      await subscription.unsubscribe();

      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setSubscription(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  return { subscription, permissionGranted, loading, error, subscribe, unsubscribe };
}
