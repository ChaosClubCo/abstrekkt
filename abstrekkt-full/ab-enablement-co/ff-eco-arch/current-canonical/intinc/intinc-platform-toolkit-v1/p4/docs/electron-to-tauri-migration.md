# Electron → Tauri Migration Guide

**For INT Inc engineers converting Electron apps to Tauri 2.0**

This guide maps every Electron concept to its Tauri equivalent, with concrete code examples. The Tauri React hooks in this toolkit are API-compatible with the Electron hooks — swap the import path and most code works unchanged.

---

## Why Migrate?

| Metric | Electron | Tauri | Difference |
|---|---|---|---|
| Binary size | ~150-200MB | ~5-15MB | **90-95% smaller** |
| Memory (idle) | ~150-300MB | ~30-80MB | **50-75% less** |
| Startup time | 2-5s | 0.5-1.5s | **3-4x faster** |
| Backend | Node.js (JS) | Rust | **Memory safe, faster** |
| Renderer | Chromium (bundled) | System WebView | **No bundled browser** |
| Auto-update | electron-updater | Built-in plugin | **Native support** |
| Code signing | electron-builder | cargo-bundle / tauri-cli | **Simpler config** |

**When NOT to migrate:**
- App depends heavily on Node.js native modules (better-sqlite3, sharp, etc.)
- App uses Chromium-specific APIs (WebBluetooth, WebUSB, WebHID)
- Team has zero Rust experience and timeline is tight
- App needs to run on older OS versions (Tauri needs newer WebView)

---

## Step-by-Step Migration

### Phase 1: Frontend (1-2 days)

Your React frontend is **100% reusable**. Tauri renders it in a system WebView.

1. **Replace Vite config:**
```typescript
// Before (electron)
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist/renderer' },
});

// After (tauri) — add Tauri dev host support
const host = process.env.TAURI_DEV_HOST;
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173, strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 5174 } : undefined,
  },
});
```

2. **Swap hook imports:**
```typescript
// Before
import { useFileSystem, useMultiWindow } from '@/electron/hooks';

// After — identical API surface
import { useFileSystem, useMultiWindow } from '@/tauri/hooks';
```

### Phase 2: IPC Bridge → Tauri Commands (2-3 days)

**Electron pattern:** `ipcMain.handle` + `ipcRenderer.invoke` via preload  
**Tauri pattern:** `#[tauri::command]` + `invoke()` from frontend

```
Electron:                          Tauri:
┌──────────┐                      ┌──────────┐
│ Renderer │                      │ Frontend │
│ invoke() │ ← contextBridge →    │ invoke() │ ← direct call →
│          │                      │          │
│ preload  │                      │ (no      │
│ .ts      │                      │  preload)│
└────┬─────┘                      └────┬─────┘
     │ IPC                              │ IPC
┌────▼─────┐                      ┌────▼─────┐
│ Main     │                      │ Rust     │
│ Process  │                      │ Backend  │
│ (Node)   │                      │ (main.rs)│
└──────────┘                      └──────────┘
```

**Mapping each IPC handler:**

| Electron (main/index.ts) | Tauri (main.rs) |
|---|---|
| `ipcMain.handle('fs:read', ...)` | `#[tauri::command] fn fs_read(...)` |
| `ipcMain.handle('dialog:open', ...)` | `tauri_plugin_dialog` |
| `ipcMain.handle('window:open', ...)` | `WindowBuilder::new(...)` |
| `ipcMain.handle('notification:show', ...)` | `tauri::api::notification` |
| `autoUpdater.checkForUpdates()` | `tauri-plugin-updater` |

### Phase 3: Main Process → Rust (3-5 days)

Port each `ipcMain.handle` to a `#[tauri::command]`:

```rust
// Electron equivalent of:
// ipcMain.handle('fs:read', (_, path) => readFile(path, 'utf-8'))

#[tauri::command]
async fn fs_read(app: AppHandle, path: String) -> Result<String, String> {
    validate_path(&app, &path)?;
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}
```

Register all commands in main():
```rust
.invoke_handler(tauri::generate_handler![
    fs_read, fs_write, fs_readdir, fs_stat, fs_exists,
    config_load, config_save,
    window_open, window_close, window_list, window_focus,
    show_notification,
    app_version, app_platform,
])
```

### Phase 4: System Tray (1 day)

```rust
// Electron: new Tray(iconPath) + contextMenu
// Tauri: SystemTray::new().with_menu(menu)

fn build_tray() -> SystemTray {
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("dashboard", "Open Dashboard"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));
    SystemTray::new().with_menu(menu)
}
```

### Phase 5: Protocol Handlers (0.5 day)

```toml
# tauri.conf.json — register deep link protocol
{
  "tauri": {
    "security": {
      "dangerousRemoteUrlAccess": ["intinc://*"]
    }
  }
}
```

### Phase 6: Build & Distribution (1 day)

```bash
# Electron: electron-builder
pnpm build:electron  # outputs release/*.dmg, *.exe, *.AppImage (~200MB each)

# Tauri: tauri build
pnpm build:tauri     # outputs release/*.dmg, *.msi, *.AppImage (~10MB each)
```

---

## API Compatibility Matrix

Both hook sets in this toolkit expose the same interface. Here's what maps 1:1:

| Hook | Electron | Tauri | Notes |
|---|---|---|---|
| `useFileSystem()` | ✅ via IPC | ✅ via invoke | Identical API |
| `useMultiWindow()` | ✅ BrowserWindow | ✅ WindowBuilder | `id` vs `label` naming |
| `useClientConfig()` | ✅ fs in userData | ✅ fs in appConfigDir | Same JSON file |
| `useNotifications()` | ✅ Electron Notification | ✅ tauri notification | Identical API |
| `useAutoUpdate()` | ✅ electron-updater | ✅ tauri-plugin-updater | Different event names |
| `useMenuEvents()` | ✅ Menu + IPC events | ⚠️ Partial (no menu IPC) | Use Tauri menu API |
| `useTenantSwitch()` | ✅ protocol handler | ✅ deep link plugin | Same UX |

**⚠️ Differences to handle:**
- Tauri has no preload script — commands invoke directly
- Tauri menus are declarative in Rust, not dynamic JS
- File watcher requires `notify` crate in Rust (not built-in like Node's `fs.watch`)
- Tauri's WebView doesn't support some Chromium APIs (WebBluetooth, etc.)

---

## Estimated Migration Effort

| App Complexity | Electron LOC | Migration Time | Notes |
|---|---|---|---|
| Simple (< 5K LOC) | 1-3 IPC handlers | 3-5 days | Frontend reuse, minimal Rust |
| Medium (5-20K LOC) | 5-15 IPC handlers | 1-2 weeks | Port handlers, add plugins |
| Complex (20K+ LOC) | 15+ IPC handlers, native modules | 2-4 weeks | May need Rust crate equivalents |
| INT OS Shell | ~35K LOC | 3-4 weeks | Full parity with multi-tenant |

---

## INT OS Specific: Per-Client Config

Both Electron and Tauri versions store per-client config identically:

```json
// ~/.config/int-os/client.json (Linux)
// ~/Library/Application Support/int-os/client.json (macOS)
// %APPDATA%/int-os/client.json (Windows)
{
  "tenant_id": "abc-123",
  "tenant_name": "Martensen IP",
  "mcp_endpoint": "https://mcp.martensen.intinc.com",
  "aws_server_id": "i-0abc123def456"
}
```

The `useClientConfig()` hook reads/writes this file identically in both Electron and Tauri. When migrating INT OS clients, the config file transfers without changes.
