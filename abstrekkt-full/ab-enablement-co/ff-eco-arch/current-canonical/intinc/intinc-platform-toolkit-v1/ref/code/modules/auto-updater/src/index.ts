/**
 * @module auto-updater
 * Electron auto-update wrapper with clean event API.
 *
 * @example
 * ```ts
 * import { AutoUpdateManager } from "@intinc/auto-updater";
 *
 * const updater = new AutoUpdateManager({
 *   checkIntervalMs: 3_600_000,
 *   autoDownload: false,
 * });
 *
 * updater.on("update-available", (info) => {
 *   mainWindow.webContents.send("update-available", info);
 * });
 *
 * updater.on("update-downloaded", () => {
 *   mainWindow.webContents.send("update-downloaded");
 * });
 *
 * updater.startChecking();
 * ```
 */

type UpdateEvent = "checking" | "update-available" | "update-not-available" |
                   "download-progress" | "update-downloaded" | "error";

interface UpdateManagerOptions {
  checkIntervalMs?: number;
  autoDownload?: boolean;
}

export class AutoUpdateManager {
  private handlers = new Map<UpdateEvent, Set<(data?: unknown) => void>>();
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly options: UpdateManagerOptions = {}) {}

  on(event: UpdateEvent, handler: (data?: unknown) => void): this {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return this;
  }

  private emit(event: UpdateEvent, data?: unknown): void {
    this.handlers.get(event)?.forEach((fn) => fn(data));
  }

  async check(): Promise<void> {
    this.emit("checking");
    try {
      // In production, use electron-updater:
      // const { autoUpdater } = await import("electron-updater");
      // autoUpdater.autoDownload = this.options.autoDownload ?? false;
      // const result = await autoUpdater.checkForUpdates();
      // if (result?.updateInfo) this.emit("update-available", result.updateInfo);
      // else this.emit("update-not-available");
      this.emit("update-not-available");
    } catch (err) {
      this.emit("error", err);
    }
  }

  startChecking(): void {
    this.check();
    const ms = this.options.checkIntervalMs ?? 3_600_000;
    this.interval = setInterval(() => this.check(), ms);
  }

  stopChecking(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  async download(): Promise<void> {
    // const { autoUpdater } = await import("electron-updater");
    // await autoUpdater.downloadUpdate();
    this.emit("update-downloaded");
  }

  install(): void {
    // const { autoUpdater } = await import("electron-updater");
    // autoUpdater.quitAndInstall(true, true);
  }
}
