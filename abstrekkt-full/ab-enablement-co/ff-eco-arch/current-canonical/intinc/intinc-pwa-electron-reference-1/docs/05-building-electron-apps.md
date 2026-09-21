# Building Electron Apps

> **Audience**: Engineers building desktop applications with Electron.
> **Code references**: `code/electron-app/` (React + TS) and `code/vanilla-electron/` (Vanilla TS).
> **Diagrams**: `diagrams/ipc-architecture` and `diagrams/security-boundaries`.

---

## Electron Architecture in 60 Seconds

Electron = Chromium (renders your UI) + Node.js (accesses the OS).

Two process types:
- **Main process**: Node.js. Creates windows, handles system events, accesses filesystem/network/OS APIs. One per app.
- **Renderer process**: Chromium. Runs your React/HTML app. One per window. Sandboxed by default.

They communicate via **IPC** (Inter-Process Communication) through a **preload script** that bridges the two worlds.

```
┌─────────────────────────────────────────────────────┐
│ Renderer Process (Chromium sandbox)                 │
│   React App → calls window.electronAPI.readFile()   │
│                        ↓                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Preload Script (contextBridge)                  │ │
│ │   Exposes safe API surface via ipcRenderer      │ │
│ └─────────────────────────────────────────────────┘ │
│                        ↓ IPC channel                │
├─────────────────────────────────────────────────────┤
│ Main Process (Node.js — full OS access)             │
│   ipcMain.handle('read-file') → fs.readFile()       │
└─────────────────────────────────────────────────────┘
```

See `diagrams/ipc-architecture.mermaid` for the full visual.

---

## Scaffolding Options

| Approach | Setup Time | Best For |
|----------|-----------|----------|
| Vite + Electron (recommended) | 2–4h | TypeScript/React projects, fastest DX |
| Electron Forge | 3–5h | Official tooling, good for publishing |
| Electron Builder | 3–5h | Flexible packaging, enterprise distribution |
| Tauri | 4–6h | Small bundle size, Rust backend (not Electron) |

**We recommend Vite + Electron** for Intinc projects — matches our existing Vite/React/TS stack.

See `code/electron-app/` for the complete scaffold.

---

## IPC Deep Dive

### The Rule: Never Expose Node.js to Renderer

```typescript
// ❌ NEVER DO THIS
new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,    // Gives renderer full Node.js access
    contextIsolation: false,  // No boundary between renderer and preload
  }
});

// ✅ ALWAYS DO THIS
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
  }
});
```

### Preload Script Pattern

The preload script uses `contextBridge` to expose a typed API to the renderer:

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (path: string) => ipcRenderer.invoke('fs:read-file', path),
  writeFile: (path: string, data: string) => ipcRenderer.invoke('fs:write-file', path, data),
  pickFile: (filters?: FileFilter[]) => ipcRenderer.invoke('dialog:pick-file', filters),
  onUpdateAvailable: (cb: () => void) => {
    ipcRenderer.on('update-available', cb);
    return () => ipcRenderer.removeListener('update-available', cb);
  },
});
```

### Main Process Handlers

```typescript
// main.ts — IPC handlers
import { ipcMain, dialog } from 'electron';
import { readFile, writeFile } from 'fs/promises';

ipcMain.handle('fs:read-file', async (_event, filePath: string) => {
  // VALIDATE: Never allow arbitrary path access
  if (!isAllowedPath(filePath)) throw new Error('Path not allowed');
  return readFile(filePath, 'utf-8');
});

ipcMain.handle('dialog:pick-file', async (_event, filters) => {
  const result = await dialog.showOpenDialog({ filters, properties: ['openFile'] });
  if (result.canceled) return null;
  return result.filePaths[0];
});
```

### Type Safety Across IPC

See `code/electron-app/src/shared/types.ts` — shared type definitions that both main and renderer import, ensuring IPC channels are typed end-to-end.

---

## Auto-Update

Use `electron-updater` with a GitHub Releases backend (free) or your own update server.

See `code/electron-app/src/main/auto-updater.ts` for the complete implementation.

**Key behaviors**:
- Check for updates on launch and every 4 hours
- Download in background
- Prompt user to restart (never force-restart — they might have unsaved work)
- Show progress for large updates
- Rollback mechanism: if new version crashes on first launch, revert

---

## Packaging & Distribution

### Code Signing (Required)

- **macOS**: Apple Developer ID certificate ($99/year). Without it, Gatekeeper blocks your app.
- **Windows**: EV code signing certificate (~$400/year). Without it, SmartScreen warns users.
- **Linux**: No signing needed, but provide `.AppImage`, `.deb`, and `.rpm`.

### Build Configuration

See `code/electron-app/electron-builder.json` for the complete config.

### CI/CD

See `ci/github-actions/electron-ci.yml` — builds for all three platforms, signs, and publishes to GitHub Releases.

---

## Production Checklist

```
□ contextIsolation: true, nodeIntegration: false, sandbox: true
□ All IPC channels validated (path allowlisting, input sanitization)
□ CSP header set (no inline scripts, no eval)
□ Auto-updater configured and tested
□ Code signing for macOS + Windows
□ Crash reporter configured (Sentry or similar)
□ App protocol handler registered (e.g., yourapp://)
□ Dock/taskbar badge for notifications
□ Tested on Windows 10+, macOS 12+, Ubuntu 22+
□ Memory profiled under sustained usage (watch for leaks)
□ Deep links tested (if applicable)
□ Uninstaller tested (clean removal)
```

---
*Intinc Engineering — Electron Guide v2.0*
