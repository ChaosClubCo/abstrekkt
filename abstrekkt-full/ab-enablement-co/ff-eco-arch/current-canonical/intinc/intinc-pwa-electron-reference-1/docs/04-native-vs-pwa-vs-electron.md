# Native vs PWA vs Electron — Platform Comparison

> **Purpose**: Data-driven platform selection for new projects and migration planning.
> **See also**: `diagrams/platform-selection-tree` and `diagrams/comparison-matrix` for visual references.

---

## Comparison Matrix

| Capability | PWA | Electron | Tauri | Native (iOS/Android) | React Native |
|-----------|-----|----------|-------|---------------------|-------------|
| **Distribution** | URL (instant) | Download / auto-update | Download / auto-update | App Store | App Store |
| **Install size** | 0 MB | 150–200 MB | 40–60 MB | 20–100 MB | 30–80 MB |
| **Offline support** | ✅ (SW caching) | ✅ (full filesystem) | ✅ (full filesystem) | ✅ | ✅ |
| **File system access** | Limited (File System Access API) | ✅ Full (Node.js fs) | ✅ Full (Rust backend) | ✅ Full | ✅ Via native modules |
| **System tray** | ❌ | ✅ | ✅ | N/A | N/A |
| **Notifications** | ✅ Push API | ✅ Native OS | ✅ Native OS | ✅ APNs/FCM | ✅ APNs/FCM |
| **Background processing** | ❌ (limited) | ✅ | ✅ | ✅ | ✅ |
| **Auto-update** | ✅ (SW update) | ✅ (electron-updater) | ✅ (tauri-updater) | App Store | App Store |
| **Cross-platform** | All browsers | Win/Mac/Linux | Win/Mac/Linux | Per-platform | iOS/Android |
| **Code signing** | N/A (web) | Required | Required | Required | Required |
| **Startup time** | < 1s (cached) | 2–5s | < 1s | < 1s | 1–2s |
| **Memory usage** | Browser tab (~100MB) | 150–400MB (Chromium) | 30–80MB | 50–150MB | 80–200MB |
| **Dev cost (team of 2)** | 1–3 months | 2–4 months | 2–4 months | 4–8 months (per platform) | 3–5 months |
| **Maintenance** | Low | Medium (Chromium updates) | Low | High (OS updates × 2) | Medium |

---

## Case Study: Why Claude Desktop Is Electron, Not PWA

Claude Desktop needs:
1. **Code execution** via Claude Code — requires spawning child processes, which PWAs cannot do
2. **Full file system access** — reading/writing arbitrary files, not just user-picked ones
3. **Local model integration** — potential for local inference requires native binary execution
4. **MCP server connections** — stdio-based communication with local servers
5. **System tray** — persistent background presence for quick access
6. **Deep OS integration** — keyboard shortcuts, protocol handlers, auto-start

None of these are achievable with PWA. Electron gives full Node.js access while keeping the web-based UI familiar to the engineering team.

**Why not Tauri?** At the time of architecture decisions, Tauri's ecosystem was less mature. Electron's NPM ecosystem, debugging tools (Chrome DevTools), and community support reduced risk for a product that needed to ship quickly.

---

## Platform Selection Decision Tree

See `diagrams/platform-selection-tree.mermaid` for the full visual. Summary:

```
Does the app need OS-level access (filesystem, shell, system tray)?
  YES → Desktop target?
    YES → Do you need minimal bundle size?
      YES → Tauri
      NO → Electron
    NO (mobile) → Native or React Native
  NO → Does the app need offline support?
    YES → PWA (Path B or C)
    NO → Is installability / home screen presence valuable?
      YES → PWA (Path A or D)
      NO → Standard web app
```

---

## Migration Paths

See `diagrams/migration-paths.mermaid` for visual.

### Web App → PWA
**Effort**: 4–200 hours (see Decision Framework).
**What changes**: Add manifest, service worker, caching. No architectural change.
**Risk**: Low. Additive — existing app continues working.

### PWA → Electron (Wrap)
**Effort**: 8–24 hours for basic wrap, 40–80 hours for native features.
**What changes**: Electron loads your web app in a BrowserWindow. Add IPC for native features.
**Risk**: Low for wrap, medium for IPC-heavy features.

### Electron → Tauri
**Effort**: 80–200 hours (rewrite IPC in Rust, different build system).
**What changes**: Replace Node.js backend with Rust. Frontend stays the same.
**Risk**: Medium-high. Rust learning curve, different plugin ecosystem.

### PWA → Native
**Effort**: 3–6 months (full rewrite).
**What changes**: Everything except business logic concepts.
**Risk**: High. Different language, tools, deployment, testing.

### Electron → PWA (Downgrade)
**Effort**: 16–40 hours to strip Electron-specific code.
**What changes**: Remove IPC calls, replace native file access with File System Access API, remove system tray. Lose capabilities.
**Risk**: Low technically, but feature loss may upset users.

---

## When to Consider Each

| Signal | Platform |
|--------|----------|
| "We need an app but don't want to go through app stores" | PWA |
| "Our web app needs to feel more native" | PWA (installability) |
| "Users need to work offline in the field" | PWA or Electron |
| "We need to read/write local files" | Electron or Tauri |
| "We need background processing when the app is closed" | Electron, Tauri, or Native |
| "Bundle size matters (bandwidth-constrained distribution)" | Tauri or PWA |
| "Our team knows web but not native" | PWA or Electron |
| "We need iOS + Android + Desktop" | PWA (widest reach) or React Native + Electron |
| "We need deep OS integration (HealthKit, Siri, etc.)" | Native |
| "We need to ship fast with minimal team" | PWA Path A or D |

---
*Intinc Engineering — Platform Comparison v2.0*
