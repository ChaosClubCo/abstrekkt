import { useOnlineStatus } from "@/hooks";

/**
 * Subtle indicator shown when the app is offline.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#e94560",
        color: "#fff",
        textAlign: "center",
        padding: "4px 0",
        fontSize: 13,
        fontWeight: 600,
        zIndex: 9998,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      You are offline — changes will sync when connectivity returns
    </div>
  );
}
