/**
 * A2HS install prompt manager — no framework dependency.
 *
 * @example
 * ```ts
 * const install = new InstallManager();
 * install.on("ready", () => showInstallBanner());
 * install.on("installed", () => hideInstallBanner());
 * ```
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallEvent = "ready" | "installed" | "dismissed";

export class InstallManager {
  private deferred: BeforeInstallPromptEvent | null = null;
  private handlers = new Map<InstallEvent, Set<() => void>>();

  constructor() {
    if (typeof window === "undefined") return;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferred = e as BeforeInstallPromptEvent;
      this.emit("ready");
    });

    window.addEventListener("appinstalled", () => {
      this.deferred = null;
      this.emit("installed");
    });
  }

  on(event: InstallEvent, handler: () => void): this {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return this;
  }

  off(event: InstallEvent, handler: () => void): this {
    this.handlers.get(event)?.delete(handler);
    return this;
  }

  private emit(event: InstallEvent): void {
    this.handlers.get(event)?.forEach((fn) => fn());
  }

  get canInstall(): boolean {
    return this.deferred !== null;
  }

  get isStandalone(): boolean {
    return typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches;
  }

  async prompt(): Promise<"accepted" | "dismissed" | null> {
    if (!this.deferred) return null;
    await this.deferred.prompt();
    const { outcome } = await this.deferred.userChoice;
    this.deferred = null;
    if (outcome === "dismissed") this.emit("dismissed");
    return outcome;
  }
}
