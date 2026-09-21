import { useState, useEffect, useCallback, useRef } from "react";

export interface SWRegistrationState {
  /** Registration object, null until ready */
  registration: ServiceWorkerRegistration | null;
  /** A new SW is installed and waiting to activate */
  updateAvailable: boolean;
  /** SW is currently installing */
  installing: boolean;
  /** Trigger skip-waiting on the waiting SW */
  applyUpdate: () => void;
  /** Any registration error */
  error: Error | null;
}

/**
 * Manages the full service worker lifecycle with update prompting.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { updateAvailable, applyUpdate } = useSWRegistration();
 *   return updateAvailable ? (
 *     <Banner onClick={applyUpdate}>New version available — click to update</Banner>
 *   ) : null;
 * }
 * ```
 */
export function useSWRegistration(): SWRegistrationState {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          type: "module",
          scope: "/",
        });

        setRegistration(reg);

        // Check for waiting worker on load (e.g., refresh after update)
        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        // Listen for new installations
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          setInstalling(true);

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              setInstalling(false);
            }
          });
        });

        // Poll for updates every 60 minutes
        intervalRef.current = setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    register();

    // Reload on controller change (after skipWaiting)
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  }, [registration]);

  return { registration, updateAvailable, installing, applyUpdate, error };
}
