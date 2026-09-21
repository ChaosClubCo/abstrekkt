/**
 * Framework-agnostic Service Worker lifecycle manager.
 * Handles registration, update detection, and controlled activation.
 *
 * @example
 * ```ts
 * const sw = new SWManager({ swUrl: "/sw.js" });
 * sw.on("updateAvailable", () => {
 *   if (confirm("New version available. Reload?")) sw.applyUpdate();
 * });
 * sw.register();
 * ```
 */

export interface SWManagerOptions {
  swUrl: string;
  scope?: string;
  type?: "classic" | "module";
  updateIntervalMs?: number;
}

export interface SWManagerEvents {
  registered: (reg: ServiceWorkerRegistration) => void;
  updateAvailable: (reg: ServiceWorkerRegistration) => void;
  activated: (reg: ServiceWorkerRegistration) => void;
  error: (err: Error) => void;
}

export class SWManager {
  private registration: ServiceWorkerRegistration | null = null;
  private listeners = new Map<string, Set<Function>>();
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly options: SWManagerOptions) {}

  on<K extends keyof SWManagerEvents>(event: K, handler: SWManagerEvents[K]): this {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return this;
  }

  off<K extends keyof SWManagerEvents>(event: K, handler: SWManagerEvents[K]): this {
    this.listeners.get(event)?.delete(handler);
    return this;
  }

  private emit<K extends keyof SWManagerEvents>(
    event: K,
    ...args: Parameters<SWManagerEvents[K]>
  ): void {
    this.listeners.get(event)?.forEach((fn) => (fn as Function)(...args));
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
      this.emit("error", new Error("Service workers not supported"));
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register(this.options.swUrl, {
        scope: this.options.scope ?? "/",
        type: this.options.type ?? "module",
      });

      this.registration = reg;
      this.emit("registered", reg);

      // Check for waiting worker
      if (reg.waiting) {
        this.emit("updateAvailable", reg);
      }

      // Listen for new installations
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            this.emit("updateAvailable", reg);
          }
        });
      });

      // Reload on controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Periodic update checks
      const interval = this.options.updateIntervalMs ?? 3_600_000;
      this.updateInterval = setInterval(() => reg.update().catch(() => {}), interval);

      return reg;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.emit("error", error);
      return null;
    }
  }

  applyUpdate(): void {
    this.registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
  }

  async unregister(): Promise<boolean> {
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (!this.registration) return false;
    return this.registration.unregister();
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}
