// ─────────────────────────────────────────────────────────────
// INT OS Preload — Complete typed IPC bridge
// ─────────────────────────────────────────────────────────────

import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // ── App ──
  app: {
    version: () => ipcRenderer.invoke('app:version') as Promise<string>,
    platform: () => ipcRenderer.invoke('app:platform') as Promise<NodeJS.Platform>,
    paths: () => ipcRenderer.invoke('app:paths') as Promise<{
      userData: string; documents: string; downloads: string; temp: string;
    }>,
  },

  // ── Client Config (INT OS per-tenant) ──
  config: {
    get: () => ipcRenderer.invoke('config:get'),
    set: (config: { tenantId: string; tenantName: string; mcpEndpoint: string; awsServerId: string }) =>
      ipcRenderer.invoke('config:set', config),
    load: () => ipcRenderer.invoke('config:load'),
  },

  // ── Dialogs ──
  dialog: {
    open: (opts: Electron.OpenDialogOptions) => ipcRenderer.invoke('dialog:open', opts),
    save: (opts: Electron.SaveDialogOptions) => ipcRenderer.invoke('dialog:save', opts),
    message: (opts: Electron.MessageBoxOptions) => ipcRenderer.invoke('dialog:message', opts),
  },

  // ── File System (sandboxed) ──
  fs: {
    read: (path: string) => ipcRenderer.invoke('fs:read', path) as Promise<string>,
    write: (path: string, content: string) => ipcRenderer.invoke('fs:write', path, content) as Promise<boolean>,
    readdir: (path: string) => ipcRenderer.invoke('fs:readdir', path) as Promise<Array<{
      name: string; isDirectory: boolean; isFile: boolean;
    }>>,
    stat: (path: string) => ipcRenderer.invoke('fs:stat', path) as Promise<{
      size: number; isDirectory: boolean; isFile: boolean; created: string; modified: string;
    }>,
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path) as Promise<boolean>,
    watch: (dirPath: string, watchId: string) => ipcRenderer.invoke('fs:watch', dirPath, watchId),
    unwatch: (watchId: string) => ipcRenderer.invoke('fs:unwatch', watchId),
    onFileChange: (watchId: string, cb: (change: { eventType: string; filename: string }) => void) =>
      ipcRenderer.on(`fs:change:${watchId}`, (_, change) => cb(change)),
  },

  // ── Window Management ──
  window: {
    open: (id: string, route: string, opts?: { width?: number; height?: number }) =>
      ipcRenderer.invoke('window:open', id, route, opts) as Promise<number>,
    close: (id: string) => ipcRenderer.invoke('window:close', id),
    list: () => ipcRenderer.invoke('window:list') as Promise<Array<{
      id: string; title: string; focused: boolean;
      bounds: { x: number; y: number; width: number; height: number }; isMaximized: boolean;
    }>>,
    focus: (id: string) => ipcRenderer.invoke('window:focus', id),
  },

  // ── Notifications ──
  notification: {
    show: (opts: { title: string; body: string; silent?: boolean }) =>
      ipcRenderer.invoke('notification:show', opts) as Promise<boolean>,
  },

  // ── Auto-updater ──
  update: {
    check: () => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.invoke('update:install'),
    onAvailable: (cb: (info: unknown) => void) => ipcRenderer.on('update:available', (_, info) => cb(info)),
    onDownloaded: (cb: (info: unknown) => void) => ipcRenderer.on('update:downloaded', (_, info) => cb(info)),
  },

  // ── Menu events ──
  menu: {
    onSave: (cb: () => void) => ipcRenderer.on('menu:save', () => cb()),
    onFileOpened: (cb: (file: { path: string; name: string; content: string; ext: string }) => void) =>
      ipcRenderer.on('file:opened', (_, file) => cb(file)),
    onSaveAsPath: (cb: (path: string) => void) =>
      ipcRenderer.on('file:save-as-path', (_, path) => cb(path)),
  },

  // ── Tenant events ──
  tenant: {
    onSwitch: (cb: (tenantId: string) => void) =>
      ipcRenderer.on('tenant:switch', (_, tenantId) => cb(tenantId)),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

export type ElectronAPI = typeof api;
