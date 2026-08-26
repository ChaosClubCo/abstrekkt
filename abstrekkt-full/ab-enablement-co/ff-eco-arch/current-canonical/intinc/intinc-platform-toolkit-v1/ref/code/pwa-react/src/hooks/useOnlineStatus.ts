import { useState, useEffect } from "react";

/**
 * Tracks `navigator.onLine` reactively.
 *
 * @returns `true` when browser reports online, `false` when offline.
 *
 * @example
 * ```tsx
 * function StatusBar() {
 *   const isOnline = useOnlineStatus();
 *   return <span>{isOnline ? "🟢 Online" : "🔴 Offline"}</span>;
 * }
 * ```
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
