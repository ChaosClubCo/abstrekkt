import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface InstallPromptState {
  /** Whether the browser supports and is offering installation */
  canInstall: boolean;
  /** Whether the app is already installed (standalone mode) */
  isInstalled: boolean;
  /** Trigger the browser install prompt */
  promptInstall: () => Promise<"accepted" | "dismissed" | null>;
}

/**
 * Manages the PWA install prompt lifecycle.
 *
 * @example
 * ```tsx
 * function InstallBanner() {
 *   const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
 *
 *   if (isInstalled || !canInstall) return null;
 *
 *   return (
 *     <div className="install-banner">
 *       <p>Install this app for a better experience</p>
 *       <button onClick={promptInstall}>Install</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect post-install
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const mqHandler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mediaQuery.addEventListener("change", mqHandler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      mediaQuery.removeEventListener("change", mqHandler);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<
    "accepted" | "dismissed" | null
  > => {
    if (!deferredPrompt) return null;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt]);

  return {
    canInstall: deferredPrompt !== null,
    isInstalled,
    promptInstall,
  };
}
