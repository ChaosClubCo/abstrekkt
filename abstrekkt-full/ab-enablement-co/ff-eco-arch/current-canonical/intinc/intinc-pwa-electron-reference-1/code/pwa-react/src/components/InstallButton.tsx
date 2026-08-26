import { useInstallPrompt } from "@/hooks";

/**
 * A2HS (Add to Home Screen) install prompt button.
 * Only renders when the browser offers installation.
 */
export function InstallButton() {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();

  if (isInstalled || !canInstall) return null;

  return (
    <button
      onClick={promptInstall}
      style={{
        background: "#0f3460",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        cursor: "pointer",
        fontWeight: 600,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Install App
    </button>
  );
}
