import { contextBridge, ipcRenderer } from "electron";

/**
 * Preload bridge — exposes a type-safe API to the renderer process.
 * The renderer CANNOT access Node.js or Electron APIs directly.
 *
 * Security model:
 * - contextIsolation: true (renderer runs in isolated context)
 * - nodeIntegration: false (no require/import of Node modules)
 * - sandbox: true (OS-level sandboxing)
 *
 * The only communication channel is this bridge.
 */

const electronAPI = {
  // File system (user-consented paths only)
  openFile: (options?: Electron.OpenDialogOptions) =>
    ipcRenderer.invoke("dialog:open-file", options),
  saveFile: (options?: Electron.SaveDialogOptions) =>
    ipcRenderer.invoke("dialog:save-file", options),
  readFile: (filePath: string) =>
    ipcRenderer.invoke("fs:read-file", filePath),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke("fs:write-file", filePath, content),
  readDir: (dirPath: string) =>
    ipcRenderer.invoke("fs:read-dir", dirPath),

  // Workflow orchestration
  triggerWorkflow: (payload: {
    platform: "n8n" | "make" | "zapier";
    webhookUrl: string;
    data: Record<string, unknown>;
  }) => ipcRenderer.invoke("workflow:trigger", payload),

  // App info
  getAppInfo: () => ipcRenderer.invoke("app:get-info"),

  // Auto-update
  checkForUpdate: () => ipcRenderer.invoke("update:check"),
  downloadUpdate: () => ipcRenderer.invoke("update:download"),
  installUpdate: () => ipcRenderer.invoke("update:install"),

  // Event listeners (main → renderer)
  onUpdateAvailable: (callback: (info: unknown) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, info: unknown) => callback(info);
    ipcRenderer.on("update-available", handler);
    return () => ipcRenderer.removeListener("update-available", handler);
  },
  onUpdateDownloaded: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("update-downloaded", handler);
    return () => ipcRenderer.removeListener("update-downloaded", handler);
  },
  onDeepLink: (callback: (url: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, url: string) => callback(url);
    ipcRenderer.on("deep-link", handler);
    return () => ipcRenderer.removeListener("deep-link", handler);
  },
} as const;

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
