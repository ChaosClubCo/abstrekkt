// ─────────────────────────────────────────────────────────────
// Tauri React Hooks — API-compatible with Electron hooks
// Drop-in replacement: swap import path, same interface
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

// ── Base Hook ────────────────────────────────────────────

export function useTauriAPI() {
  const isTauri = '__TAURI__' in window;
  return { isTauri };
}

// ── File System ──────────────────────────────────────────

export function useFileSystem() {
  const readFile = useCallback(async (path: string): Promise<string> => {
    return invoke('fs_read', { path });
  }, []);

  const writeFile = useCallback(async (path: string, content: string): Promise<boolean> => {
    return invoke('fs_write', { path, content });
  }, []);

  const openFile = useCallback(async () => {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const selected = await open({
      multiple: false,
      filters: [{ name: 'All Files', extensions: ['*'] }],
    });
    if (!selected) return null;
    const path = typeof selected === 'string' ? selected : selected[0];
    const content = await invoke<string>('fs_read', { path });
    return { path, content };
  }, []);

  const saveFile = useCallback(async (content: string, _defaultPath?: string) => {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const filePath = await save({
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (!filePath) return null;
    await invoke('fs_write', { path: filePath, content });
    return filePath;
  }, []);

  const listDirectory = useCallback(async (path: string) => {
    return invoke<Array<{ name: string; is_directory: boolean; is_file: boolean; size: number }>>('fs_readdir', { path });
  }, []);

  const fileStat = useCallback(async (path: string) => {
    return invoke<{
      size: number; is_directory: boolean; is_file: boolean; created: string; modified: string;
    }>('fs_stat', { path });
  }, []);

  const fileExists = useCallback(async (path: string): Promise<boolean> => {
    return invoke('fs_exists', { path });
  }, []);

  return { readFile, writeFile, openFile, saveFile, listDirectory, fileStat, fileExists };
}

// ── Multi-Window Management ──────────────────────────────

export function useMultiWindow() {
  const [windowList, setWindowList] = useState<Array<{
    label: string; title: string; is_focused: boolean; is_maximized: boolean;
  }>>([]);

  const refresh = useCallback(async () => {
    const list = await invoke<typeof windowList>('window_list');
    setWindowList(list);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openWindow = useCallback(async (
    label: string, url: string, opts?: { width?: number; height?: number },
  ) => {
    await invoke('window_open', { label, url, width: opts?.width, height: opts?.height });
    await refresh();
  }, [refresh]);

  const closeWindow = useCallback(async (label: string) => {
    await invoke('window_close', { label });
    await refresh();
  }, [refresh]);

  const focusWindow = useCallback(async (label: string) => {
    await invoke('window_focus', { label });
  }, []);

  return { windows: windowList, openWindow, closeWindow, focusWindow, refresh };
}

// ── Client Config (INT OS per-tenant) ────────────────────

interface ClientConfig {
  tenant_id: string;
  tenant_name: string;
  mcp_endpoint: string;
  aws_server_id: string;
}

export function useClientConfig() {
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoke<ClientConfig | null>('config_load')
      .then(c => setConfig(c))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveConfig = useCallback(async (newConfig: ClientConfig) => {
    await invoke('config_save', { config: newConfig });
    setConfig(newConfig);
  }, []);

  return { config, loading, saveConfig };
}

// ── Notifications ────────────────────────────────────────

export function useNotifications() {
  const notify = useCallback(async (title: string, body: string) => {
    return invoke<boolean>('show_notification', { title, body });
  }, []);

  return { notify };
}

// ── Auto-Update ──────────────────────────────────────────

export function useAutoUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    // Tauri updater plugin events
    listen('tauri://update-available', () => setUpdateAvailable(true));
    listen('tauri://update-installed', () => setUpdateReady(true));

    // Check on mount
    invoke('plugin:updater|check').catch(() => {});
  }, []);

  const installUpdate = useCallback(async () => {
    await invoke('plugin:updater|install');
  }, []);

  return { updateAvailable, updateReady, installUpdate };
}
