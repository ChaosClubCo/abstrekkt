# Extractable Modules

Drop-in modules you can copy into any project. Each is self-contained with its own package.json.

| Module | Purpose | Framework |
|--------|---------|-----------|
| `sw-manager/` | Service worker lifecycle | Vanilla TS |
| `cache-strategy/` | Multi-tier cache strategies | Vanilla TS |
| `push-client/` | Push subscription management | Vanilla TS |
| `offline-sync/` | IndexedDB queue + conflict resolution | Vanilla TS |
| `ipc-bridge/` | Type-safe Electron IPC | Vanilla TS |
| `auto-updater/` | Electron auto-update wrapper | Vanilla TS |

## Usage

```bash
# Copy a module into your project
cp -r modules/sw-manager/ src/lib/sw-manager/

# Or install as a local dependency
npm install ./modules/sw-manager
```
