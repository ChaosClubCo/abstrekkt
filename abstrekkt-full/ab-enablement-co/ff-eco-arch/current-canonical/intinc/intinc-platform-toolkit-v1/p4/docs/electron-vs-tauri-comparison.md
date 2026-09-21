# Electron vs Tauri: Side-by-Side Comparison

**Decision guide for INT engineers choosing between Electron and Tauri for desktop apps**

---

## Architecture

```
ELECTRON                              TAURI
┌────────────────────────┐           ┌────────────────────────┐
│    Your React App      │           │    Your React App      │
│    (identical code)    │           │    (identical code)    │
├────────────────────────┤           ├────────────────────────┤
│   Chromium Renderer    │           │   System WebView       │
│   (bundled ~120MB)     │           │   (OS-provided, 0MB)   │
├────────────────────────┤           ├────────────────────────┤
│   Preload Script       │           │   (no preload needed)  │
│   (contextBridge)      │           │                        │
├────────────────────────┤           ├────────────────────────┤
│   Node.js Main Process │           │   Rust Backend         │
│   (V8 + libuv)         │           │   (compiled binary)    │
└────────────────────────┘           └────────────────────────┘
     ~200MB binary                        ~10MB binary
```

## Feature Comparison

| Feature | Electron | Tauri | INT Recommendation |
|---|---|---|---|
| **Binary size** | 150-200MB | 5-15MB | Tauri wins massively |
| **Memory usage** | 150-300MB | 30-80MB | Tauri for resource-constrained |
| **Startup time** | 2-5s | 0.5-1.5s | Tauri for user-facing apps |
| **File system access** | ✅ Node.js fs | ✅ Rust std::fs + plugin | Both work, Tauri more secure |
| **System tray** | ✅ Tray class | ✅ SystemTray | Equivalent |
| **Multi-window** | ✅ BrowserWindow | ✅ WindowBuilder | Equivalent |
| **Notifications** | ✅ Notification class | ✅ Plugin | Equivalent |
| **Auto-update** | ✅ electron-updater | ✅ Built-in plugin | Tauri simpler |
| **Protocol handlers** | ✅ protocol.handle | ✅ Deep link plugin | Equivalent |
| **Code signing** | ✅ electron-builder | ✅ tauri-cli | Both work |
| **Node.js modules** | ✅ Full access | ❌ Not available | Electron if needed |
| **WebBluetooth/USB** | ✅ Chromium APIs | ❌ Not in system WebView | Electron only |
| **Clipboard** | ✅ clipboard module | ✅ Plugin | Equivalent |
| **Keyboard shortcuts** | ✅ globalShortcut | ✅ Plugin | Equivalent |
| **Developer experience** | JS/TS only | JS/TS + Rust | Electron easier to start |
| **Security model** | contextIsolation | Rust sandbox | Tauri stronger by default |
| **Cross-compilation** | ❌ Need each OS | ❌ Need each OS | Same limitation |
| **Linux support** | ✅ AppImage, deb, snap | ✅ AppImage, deb | Equivalent |
| **macOS universal** | ✅ electron-builder | ✅ tauri-cli | Both support arm64+x64 |
| **Windows support** | ✅ NSIS, MSI | ✅ MSI, NSIS | Equivalent |

## IPC Patterns

### Electron: preload + contextBridge

```typescript
// preload.ts
contextBridge.exposeInMainWorld('api', {
  readFile: (path: string) => ipcRenderer.invoke('fs:read', path),
});

// main.ts
ipcMain.handle('fs:read', (_, path) => readFile(path, 'utf-8'));

// renderer
const content = await window.api.readFile('/path/to/file');
```

### Tauri: direct invoke

```typescript
// main.rs
#[tauri::command]
async fn fs_read(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

// renderer (no preload needed)
import { invoke } from '@tauri-apps/api/core';
const content = await invoke<string>('fs_read', { path: '/path/to/file' });
```

## Security Comparison

| Security Feature | Electron | Tauri |
|---|---|---|
| Renderer sandbox | Opt-in (`sandbox: true`) | Default (system WebView) |
| Context isolation | Opt-in (`contextIsolation: true`) | Default (no shared context) |
| Node.js in renderer | Must explicitly disable | Never available |
| CSP | Manual via `webRequest` | Built-in via tauri.conf.json |
| IPC validation | Manual (validate in handlers) | Rust type system enforces |
| Path traversal | Manual path validation | Rust path validation + scope |
| Memory safety | V8 garbage collection | Rust ownership model |
| Supply chain risk | Large npm dependency tree | Minimal Rust dependencies |

**INT policy:** Both require the security checklist. Tauri has a stronger security posture by default, but both can achieve equivalent security with proper configuration.

## When to Choose Each

### Choose Electron when:
- App needs Node.js native modules (better-sqlite3, sharp, node-pty)
- Team is JS/TS-only, no Rust experience, and deadline is tight
- App uses Chromium-specific APIs (WebBluetooth, WebUSB, WebHID, WebRTC with specific codec needs)
- Existing Electron codebase is mature and working — migration cost outweighs benefits
- App is internal-only and binary size doesn't matter

### Choose Tauri when:
- Binary size matters (client distribution, slow networks, disk-constrained)
- Performance matters (fast startup, low memory, battery life on laptops)
- Security is paramount (Rust's memory safety, minimal attack surface)
- App is user-facing / client-delivered (smaller install = better UX)
- Team can invest in learning basic Rust (commands are simple to write)
- Starting from scratch (no migration cost)

### INT OS Recommendation:
**Electron for the initial launch, Tauri migration planned for v2.** Rationale: the INT OS shell has complex MCP integration that benefits from Node.js ecosystem access now, but the per-client binary distribution would benefit massively from Tauri's ~10MB binaries in the future. The hooks in this toolkit are API-compatible to make this migration straightforward.
