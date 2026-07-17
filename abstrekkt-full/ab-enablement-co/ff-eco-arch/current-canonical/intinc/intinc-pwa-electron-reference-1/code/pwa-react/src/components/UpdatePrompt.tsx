import { useSWRegistration } from "@/hooks";

/**
 * Floating banner that appears when a new service worker is waiting.
 * Clicking "Update" triggers skipWaiting → page reload.
 */
export function UpdatePrompt() {
  const { updateAvailable, installing, applyUpdate } = useSWRegistration();

  if (!updateAvailable && !installing) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1a1a2e",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {installing ? (
        <span>Installing update…</span>
      ) : (
        <>
          <span>A new version is available</span>
          <button
            onClick={applyUpdate}
            style={{
              background: "#e94560",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Update
          </button>
        </>
      )}
    </div>
  );
}
