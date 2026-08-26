// ─────────────────────────────────────────────────────────────
// Electron Renderer Hooks — File I/O, Multi-Window, Config, etc.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ElectronAPI } from '../../preload/index';

declare global { interface Window { electronAPI?: ElectronAPI; } }

// ── Base Hook ────────────────────────────────────────────

export function useElectronAPI() {
  const isElectron = !!window.electronAPI;
  return { isElectron, api: window.electronAPI };
}

// ── File System ──────────────────────────────────────────

export function useFileSystem() {
  const { api } = useElectronAPI();

  const readFile = useCallback(async (path: string) => {
    if (!api) throw new Error('Not in Electron');
    return api.fs.read(path);
  }, [api]);

  const writeFile = useCallback(async (path: string, content: string) => {
    if (!api) throw new Error('Not in Electron');
    return api.fs.write(path, content);
  }, [api]);

  const openFile = useCallback(async (filters?: Electron.FileFilter[]) => {
    if (!api) return null;
    const { canceled, filePaths } = await api.dialog.open({
      properties: ['openFile'],
      filters: filters || [
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (canceled || filePaths.length === 0) return null;
    const path = filePaths[0];
    const content = await api.fs.read(path);
    return { path, content };
  }, [api]);

  const saveFile = useCallback(async (content: string, defaultPath?: string) => {
    if (!api) return null;
    const { canceled, filePath } = await api.dialog.save({
      defaultPath,
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (canceled || !filePath) return null;
    await api.fs.write(filePath, content);
    return filePath;
  }, [api]);

  const listDirectory = useCallback(async (path: string) => {
    if (!api) throw new Error('Not in Electron');
    return api.fs.readdir(path);
  }, [api]);

  const fileStat = useCallback(async (path: string) => {
    if (!api) throw new Error('Not in Electron');
    return api.fs.stat(path);
  }, [api]);

  const fileExists = useCallback(async (path: string) => {
    if (!api) return false;
    return api.fs.exists(path);
  }, [api]);

  return { readFile, writeFile, openFile, saveFile, listDirectory, fileStat, fileExists };
}

// ── File Watcher ─────────────────────────────────────────

export function useFileWatcher(
  dirPath: string | null,
  onChanged: (event: { eventType: string; filename: string }) => void,
) {
  const { api } = useElectronAPI();
  const watchId = useRef(`watch-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!api || !dirPath) return;

    const id = watchId.current;
    api.fs.watch(dirPath, id);
    api.fs.onFileChange(id, onChanged);

    return () => {
      api.fs.unwatch(id);
    };
  }, [api, dirPath, onChanged]);
}

// ── Multi-Window Management ──────────────────────────────

export function useMultiWindow() {
  const { api } = useElectronAPI();
  const [windowList, setWindowList] = useState<Array<{
    id: string; title: string; focused: boolean;
    bounds: { x: number; y: number; width: number; height: number };
    isMaximized: boolean;
  }>>([]);

  const refresh = useCallback(async () => {
    if (!api) return;
    const list = await api.window.list();
    setWindowList(list);
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  const openWindow = useCallback(async (
    id: string, route: string, opts?: { width?: number; height?: number },
  ) => {
    if (!api) return;
    await api.window.open(id, route, opts);
    await refresh();
  }, [api, refresh]);

  const closeWindow = useCallback(async (id: string) => {
    if (!api) return;
    await api.window.close(id);
    await refresh();
  }, [api, refresh]);

  const focusWindow = useCallback(async (id: string) => {
    if (!api) return;
    await api.window.focus(id);
  }, [api]);

  return { windows: windowList, openWindow, closeWindow, focusWindow, refresh };
}

// ── Client Config (INT OS per-tenant) ────────────────────

interface ClientConfig {
  tenantId: string;
  tenantName: string;
  mcpEndpoint: string;
  awsServerId: string;
  theme?: Record<string, string>;
}

export function useClientConfig() {
  const { api } = useElectronAPI();
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) { setLoading(false); return; }
    api.config.load()
      .then(c => setConfig(c))
      .finally(() => setLoading(false));
  }, [api]);

  const saveConfig = useCallback(async (newConfig: ClientConfig) => {
    if (!api) return;
    await api.config.set(newConfig);
    setConfig(newConfig);
  }, [api]);

  return { config, loading, saveConfig };
}

// ── Notifications ────────────────────────────────────────

export function useNotifications() {
  const { api } = useElectronAPI();

  const notify = useCallback(async (title: string, body: string, silent = false) => {
    if (!api) {
      // Fallback to Web Notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, silent });
        return true;
      }
      return false;
    }
    return api.notification.show({ title, body, silent });
  }, [api]);

  return { notify };
}

// ── Auto-Update ──────────────────────────────────────────

export function useAutoUpdate() {
  const { api } = useElectronAPI();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!api) return;
    api.update.onAvailable(() => setUpdateAvailable(true));
    api.update.onDownloaded(() => setUpdateReady(true));
    api.update.check();
  }, [api]);

  const installUpdate = useCallback(() => api?.update.install(), [api]);

  return { updateAvailable, updateReady, installUpdate };
}

// ── Menu Events ──────────────────────────────────────────

export function useMenuEvents(handlers: {
  onSave?: () => void;
  onFileOpened?: (file: { path: string; name: string; content: string; ext: string }) => void;
  onSaveAsPath?: (path: string) => void;
}) {
  const { api } = useElectronAPI();

  useEffect(() => {
    if (!api) return;
    if (handlers.onSave) api.menu.onSave(handlers.onSave);
    if (handlers.onFileOpened) api.menu.onFileOpened(handlers.onFileOpened);
    if (handlers.onSaveAsPath) api.menu.onSaveAsPath(handlers.onSaveAsPath);
  }, [api, handlers.onSave, handlers.onFileOpened, handlers.onSaveAsPath]);
}

// ── Protocol Handler Events ──────────────────────────────

export function useTenantSwitch(onSwitch: (tenantId: string) => void) {
  const { api } = useElectronAPI();

  useEffect(() => {
    if (!api) return;
    api.tenant.onSwitch(onSwitch);
  }, [api, onSwitch]);
}
