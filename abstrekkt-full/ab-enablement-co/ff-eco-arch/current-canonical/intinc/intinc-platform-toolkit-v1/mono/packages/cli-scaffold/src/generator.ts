// ─────────────────────────────────────────────────────────────
// Generator — writes project files from template + addons
// ─────────────────────────────────────────────────────────────

import { mkdirSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { render } from 'ejs';
import { TEMPLATES, ADDONS, type ScaffoldOptions } from '@intinc/shared';

interface ScaffoldResult {
  projectDir: string;
  filesCreated: number;
  template: string;
  addons: string[];
}

export async function scaffoldProject(opts: ScaffoldOptions): Promise<ScaffoldResult> {
  const tmpl = TEMPLATES[opts.template];
  const projectDir = join(opts.outputDir, opts.projectName);

  if (existsSync(projectDir)) {
    throw new Error(`Directory already exists: ${projectDir}`);
  }

  mkdirSync(projectDir, { recursive: true });

  const ctx = {
    name: opts.projectName,
    template: opts.template,
    framework: tmpl.framework,
    category: tmpl.category,
    addons: opts.addons,
    hasSupabase: opts.addons.includes('supabase'),
    hasStripe: opts.addons.includes('stripe'),
    hasSentry: opts.addons.includes('sentry'),
    hasPosthog: opts.addons.includes('posthog'),
    supabaseUrl: opts.supabaseUrl || 'YOUR_SUPABASE_URL',
    supabaseAnonKey: opts.supabaseAnonKey || 'YOUR_SUPABASE_ANON_KEY',
    stripePublicKey: opts.stripePublicKey || 'YOUR_STRIPE_PUBLISHABLE_KEY',
    sentryDsn: opts.sentryDsn || 'YOUR_SENTRY_DSN',
    vapidPublicKey: opts.vapidPublicKey || 'YOUR_VAPID_PUBLIC_KEY',
    vapidPrivateKey: opts.vapidPrivateKey || 'YOUR_VAPID_PRIVATE_KEY',
    year: new Date().getFullYear(),
  };

  let filesCreated = 0;

  // Generate package.json
  const allDeps = { ...tmpl.dependencies };
  const allDevDeps = { ...tmpl.devDependencies };
  const allScripts = { ...tmpl.scripts };

  for (const addonId of opts.addons) {
    const addon = ADDONS[addonId];
    if (addon) {
      Object.assign(allDeps, addon.dependencies);
    }
  }

  writeFile(projectDir, 'package.json', JSON.stringify({
    name: opts.projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: allScripts,
    dependencies: sortKeys(allDeps),
    devDependencies: sortKeys(allDevDeps),
  }, null, 2));
  filesCreated++;

  // Generate tsconfig.json
  writeFile(projectDir, 'tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      jsx: tmpl.framework === 'react' ? 'react-jsx' : undefined,
      outDir: './dist',
      rootDir: './src',
      baseUrl: '.',
      paths: { '@/*': ['./src/*'] },
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  }, null, 2));
  filesCreated++;

  // Generate template-specific files
  const generators: Record<string, () => number> = {
    'pwa-react': () => generatePWAReact(projectDir, ctx),
    'pwa-vanilla': () => generatePWAVanilla(projectDir, ctx),
    'electron-react': () => generateElectronReact(projectDir, ctx),
    'electron-vanilla': () => generateElectronVanilla(projectDir, ctx),
    'tauri-react': () => generateTauriReact(projectDir, ctx),
    'push-server': () => generatePushServer(projectDir, ctx),
  };

  if (generators[opts.template]) {
    filesCreated += generators[opts.template]();
  }

  // Generate addon files
  for (const addonId of opts.addons) {
    filesCreated += generateAddon(projectDir, addonId, ctx);
  }

  // Generate common files
  filesCreated += generateCommonFiles(projectDir, ctx);

  // Git init
  if (opts.gitInit) {
    try {
      execSync('git init', { cwd: projectDir, stdio: 'ignore' });
      execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
      execSync('git commit -m "feat: initial scaffold from @intinc/cli-scaffold"', {
        cwd: projectDir, stdio: 'ignore',
      });
    } catch { /* git not available */ }
  }

  // Install dependencies
  if (opts.installDeps) {
    try {
      const cmd = opts.packageManager === 'npm' ? 'npm install'
        : opts.packageManager === 'yarn' ? 'yarn'
        : opts.packageManager === 'bun' ? 'bun install'
        : 'pnpm install';
      execSync(cmd, { cwd: projectDir, stdio: 'inherit' });
    } catch { /* install failed — user can retry */ }
  }

  return { projectDir, filesCreated, template: opts.template, addons: opts.addons };
}

// ── File Writer ──────────────────────────────────────────────

function writeFile(root: string, path: string, content: string) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf-8');
}

function sortKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}

// ── PWA React Generator ──────────────────────────────────────

function generatePWAReact(root: string, ctx: Record<string, unknown>): number {
  let n = 0;

  // Vite config
  writeFile(root, 'vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/workers',
      filename: 'sw.ts',
      registerType: 'prompt',
      manifest: {
        name: '${ctx.name}',
        short_name: '${ctx.name}',
        theme_color: '#0B1120',
        background_color: '#0B1120',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      devOptions: { enabled: true, type: 'module' },
    }),
  ],
  resolve: { alias: { '@': '/src' } },
});
`); n++;

  // Service worker
  writeFile(root, 'src/workers/sw.ts', `/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  })
);

// Background sync for POST/PUT/DELETE
const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/') && request.method !== 'GET',
  new NetworkFirst({ plugins: [bgSyncPlugin] }),
  'POST'
);

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? { title: 'Notification', body: '' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.url ? { url: data.url } : undefined,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
`); n++;

  // Hooks
  const hooks = [
    ['src/hooks/useSWRegistration.ts', `import { useState, useEffect } from 'react';

export function useSWRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready.then(setRegistration);
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  }, []);

  useEffect(() => {
    if (!registration) return;
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
        }
      });
    });
  }, [registration]);

  const applyUpdate = () => registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });

  return { registration, updateAvailable, applyUpdate };
}
`],
    ['src/hooks/useOnlineStatus.ts', `import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return isOnline;
}
`],
    ['src/hooks/useInstallPrompt.ts', `import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
    return outcome === 'accepted';
  };

  return { isInstallable, install };
}
`],
    ['src/hooks/index.ts', `export { useSWRegistration } from './useSWRegistration';
export { useOnlineStatus } from './useOnlineStatus';
export { useInstallPrompt } from './useInstallPrompt';
`],
  ];

  for (const [path, content] of hooks) { writeFile(root, path, content); n++; }

  // Components
  writeFile(root, 'src/components/UpdatePrompt.tsx', `import { useSWRegistration } from '@/hooks';

export function UpdatePrompt() {
  const { updateAvailable, applyUpdate } = useSWRegistration();
  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
      <span className="text-sm">Update available</span>
      <button onClick={applyUpdate} className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold">
        Refresh
      </button>
    </div>
  );
}
`); n++;

  writeFile(root, 'src/components/OfflineIndicator.tsx', `import { useOnlineStatus } from '@/hooks';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black text-center py-1 text-sm font-medium z-50">
      You're offline — changes will sync when reconnected
    </div>
  );
}
`); n++;

  // App entry
  writeFile(root, 'src/App.tsx', `import { UpdatePrompt } from '@/components/UpdatePrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
${ctx.hasSentry ? "import { ErrorBoundary } from '@/components/ErrorBoundary';" : ''}
${ctx.hasPosthog ? "import { useEffect } from 'react';\nimport { initPosthog } from '@/lib/posthog';" : ''}

export default function App() {
  ${ctx.hasPosthog ? 'useEffect(() => { initPosthog(); }, []);' : ''}

  return (
    ${ctx.hasSentry ? '<ErrorBoundary>' : '<>'}
      <OfflineIndicator />
      <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">${ctx.name}</h1>
        <p className="text-gray-400">Scaffolded with @intinc/cli-scaffold — PWA React template</p>
      </main>
      <UpdatePrompt />
    ${ctx.hasSentry ? '</ErrorBoundary>' : '</>'}
  );
}
`); n++;

  writeFile(root, 'src/main.tsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
${ctx.hasSentry ? "import { initSentry } from '@/lib/sentry';" : ''}
import App from './App';
import './index.css';

${ctx.hasSentry ? 'initSentry();' : ''}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
`); n++;

  writeFile(root, 'src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;
`); n++;

  writeFile(root, 'index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0B1120" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/icon-192.png" />
  <title>${ctx.name}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`); n++;

  // Tests
  writeFile(root, 'vitest.config.ts', `import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: { provider: 'v8', thresholds: { branches: 70, functions: 70, lines: 70, statements: 70 } },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
`); n++;

  writeFile(root, 'tests/setup.ts', `import { afterEach } from 'vitest';
afterEach(() => { document.body.innerHTML = ''; });
`); n++;

  writeFile(root, 'tests/hooks/useOnlineStatus.test.ts', `import { describe, it, expect } from 'vitest';
describe('useOnlineStatus', () => {
  it('should detect online status', () => { expect(navigator.onLine).toBeDefined(); });
});
`); n++;

  return n;
}

// ── Electron React Generator ─────────────────────────────────

function generateElectronReact(root: string, ctx: Record<string, unknown>): number {
  let n = 0;

  writeFile(root, 'electron-builder.yml', `appId: com.intinc.${ctx.name}
productName: "${ctx.name}"
directories:
  output: release
mac:
  target: [{ target: dmg, arch: [universal] }]
  category: public.app-category.productivity
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: entitlements.mac.plist
  entitlementsInherit: entitlements.mac.plist
win:
  target: [{ target: nsis, arch: [x64, arm64] }]
linux:
  target: [AppImage, deb]
  category: Utility
publish:
  provider: github
  releaseType: release
asar: true
`); n++;

  writeFile(root, 'src/main/index.ts', `import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 800, minWidth: 800, minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // CSP
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co"
        ],
      },
    });
  });

  // Block navigation
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });

// IPC Handlers
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:platform', () => process.platform);
ipcMain.handle('dialog:open', async (_, options) => dialog.showOpenDialog(mainWindow!, options));
ipcMain.handle('dialog:save', async (_, options) => dialog.showSaveDialog(mainWindow!, options));
ipcMain.handle('update:check', async () => autoUpdater.checkForUpdates());
ipcMain.handle('update:install', () => autoUpdater.quitAndInstall());

autoUpdater.on('update-available', () => mainWindow?.webContents.send('update:available'));
autoUpdater.on('update-downloaded', () => mainWindow?.webContents.send('update:downloaded'));
`); n++;

  writeFile(root, 'src/preload/index.ts', `import { contextBridge, ipcRenderer } from 'electron';

const api = {
  version: () => ipcRenderer.invoke('app:version'),
  platform: () => ipcRenderer.invoke('app:platform'),
  dialog: {
    open: (opts: Electron.OpenDialogOptions) => ipcRenderer.invoke('dialog:open', opts),
    save: (opts: Electron.SaveDialogOptions) => ipcRenderer.invoke('dialog:save', opts),
  },
  update: {
    check: () => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.invoke('update:install'),
    onAvailable: (cb: () => void) => ipcRenderer.on('update:available', cb),
    onDownloaded: (cb: () => void) => ipcRenderer.on('update:downloaded', cb),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

export type ElectronAPI = typeof api;
`); n++;

  writeFile(root, 'src/renderer/hooks/useElectronAPI.ts', `import { useState, useEffect } from 'react';
import type { ElectronAPI } from '../../preload/index';

declare global { interface Window { electronAPI?: ElectronAPI; } }

export function useElectronAPI() {
  const [isElectron] = useState(() => !!window.electronAPI);
  const api = window.electronAPI;

  return { isElectron, api };
}
`); n++;

  writeFile(root, 'src/renderer/hooks/useAutoUpdate.ts', `import { useState, useEffect } from 'react';
import { useElectronAPI } from './useElectronAPI';

export function useAutoUpdate() {
  const { isElectron, api } = useElectronAPI();
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!isElectron || !api) return;
    api.update.onDownloaded(() => setUpdateReady(true));
    api.update.check();
  }, [isElectron, api]);

  const installUpdate = () => api?.update.install();

  return { updateReady, installUpdate };
}
`); n++;

  // Vite config
  writeFile(root, 'vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { outDir: 'dist/renderer' },
});
`); n++;

  return n;
}

// ── Tauri React Generator ────────────────────────────────────

function generateTauriReact(root: string, ctx: Record<string, unknown>): number {
  let n = 0;

  writeFile(root, 'src-tauri/tauri.conf.json', JSON.stringify({
    $schema: 'https://raw.githubusercontent.com/nicegoodman/tauri-v2/main/core/tauri-config-schema/schema.json',
    productName: ctx.name,
    version: '0.1.0',
    identifier: `com.intinc.${ctx.name}`,
    build: { frontendDist: '../dist', devUrl: 'http://localhost:5173', beforeDevCommand: 'pnpm dev', beforeBuildCommand: 'pnpm build' },
    app: {
      windows: [{ title: String(ctx.name), width: 1200, height: 800, minWidth: 800, minHeight: 600 }],
      security: { csp: "default-src 'self'; img-src 'self' asset: https://asset.localhost; connect-src ipc: http://ipc.localhost" },
    },
    bundle: { active: true, targets: 'all', icon: ['icons/32x32.png', 'icons/128x128.png', 'icons/icon.icns', 'icons/icon.ico'] },
    plugins: { shell: { open: true }, fs: { scope: ['$APPDATA/**', '$DOWNLOAD/**'] }, dialog: {} },
  }, null, 2)); n++;

  writeFile(root, 'src-tauri/src/main.rs', `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! From Rust with love.", name)
}
`); n++;

  writeFile(root, 'src-tauri/Cargo.toml', `[package]
name = "${ctx.name}"
version = "0.1.0"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
tauri-plugin-fs = "2"
tauri-plugin-dialog = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
`); n++;

  writeFile(root, 'src-tauri/build.rs', `fn main() { tauri_build::build() }
`); n++;

  // React frontend for Tauri
  writeFile(root, 'src/App.tsx', `import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
${ctx.hasSentry ? "import { ErrorBoundary } from '@/components/ErrorBoundary';" : ''}

export default function App() {
  const [greeting, setGreeting] = useState('');

  const greet = async () => {
    const result = await invoke<string>('greet', { name: 'INT' });
    setGreeting(result);
  };

  return (
    ${ctx.hasSentry ? '<ErrorBoundary>' : '<>'}
      <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">${ctx.name}</h1>
        <p className="text-gray-400 mb-4">Tauri 2.0 + React — scaffolded with @intinc/cli-scaffold</p>
        <button onClick={greet} className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500">
          Greet from Rust
        </button>
        {greeting && <p className="mt-4 text-green-400">{greeting}</p>}
      </main>
    ${ctx.hasSentry ? '</ErrorBoundary>' : '</>'}
  );
}
`); n++;

  writeFile(root, 'vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  clearScreen: false,
  server: { port: 5173, strictPort: true, host: host || false, hmr: host ? { protocol: 'ws', host, port: 5174 } : undefined },
});
`); n++;

  return n;
}

// ── Stub generators for vanilla/push ─────────────────────────

function generatePWAVanilla(root: string, ctx: Record<string, unknown>): number {
  let n = 0;
  writeFile(root, 'src/sw-manager.ts', `export class SWManager {
  private registration: ServiceWorkerRegistration | null = null;
  async register(swUrl = '/sw.js'): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) throw new Error('Service workers not supported');
    this.registration = await navigator.serviceWorker.register(swUrl);
    return this.registration;
  }
  async unregister(): Promise<boolean> {
    return this.registration?.unregister() ?? false;
  }
}
`); n++;
  writeFile(root, 'src/index.ts', `export { SWManager } from './sw-manager';
`); n++;
  return n;
}

function generateElectronVanilla(root: string, ctx: Record<string, unknown>): number {
  let n = 0;
  writeFile(root, 'src/main/index.ts', `import { app, BrowserWindow } from 'electron';
import { join } from 'path';

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: { preload: join(__dirname, '../preload/index.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.loadFile(join(__dirname, '../renderer/index.html'));
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
`); n++;
  return n;
}

function generatePushServer(root: string, ctx: Record<string, unknown>): number {
  let n = 0;
  writeFile(root, 'src/server.ts', `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pushRouter } from './routes/push';
import { logger } from './lib/logger';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/push', pushRouter);
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(\`Push server running on :\${PORT}\`));
`); n++;
  writeFile(root, 'src/routes/push.ts', `import { Router } from 'express';
export const pushRouter = Router();
pushRouter.post('/subscribe', (req, res) => { res.json({ ok: true }); });
pushRouter.post('/send', (req, res) => { res.json({ sent: true }); });
`); n++;
  writeFile(root, 'src/lib/logger.ts', `import pino from 'pino';
export const logger = pino({ transport: { target: 'pino-pretty' } });
`); n++;
  return n;
}

// ── Addon Generator ──────────────────────────────────────────

function generateAddon(root: string, addonId: string, ctx: Record<string, unknown>): number {
  let n = 0;

  if (addonId === 'supabase') {
    writeFile(root, 'src/lib/supabase.ts', `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '${ctx.supabaseUrl}';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '${ctx.supabaseAnonKey}';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`); n++;

    writeFile(root, 'src/hooks/useAuth.ts', `import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  return { user, session, loading, signIn, signUp, signOut };
}
`); n++;

    writeFile(root, 'supabase/migrations/001_init.sql', `-- Initial schema
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
`); n++;
  }

  if (addonId === 'stripe') {
    writeFile(root, 'src/lib/stripe.ts', `import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '${ctx.stripePublicKey}';
export const stripePromise = loadStripe(stripeKey);
`); n++;

    writeFile(root, 'src/components/CheckoutButton.tsx', `import { stripePromise } from '@/lib/stripe';

interface Props { priceId: string; label?: string; }

export function CheckoutButton({ priceId, label = 'Subscribe' }: Props) {
  const handleClick = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;
    // Redirect to Stripe Checkout (needs server-side session creation)
    console.log('Checkout for price:', priceId);
  };

  return (
    <button onClick={handleClick} className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500">
      {label}
    </button>
  );
}
`); n++;
  }

  if (addonId === 'sentry') {
    writeFile(root, 'src/lib/sentry.ts', `import * as Sentry from '@sentry/react';

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '${ctx.sentryDsn}',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
`); n++;

    writeFile(root, 'src/components/ErrorBoundary.tsx', `import * as Sentry from '@sentry/react';
import type { ReactNode } from 'react';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={({ error }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400">{error?.toString()}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 px-4 py-2 rounded">
            Reload
          </button>
        </div>
      </div>
    )}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
`); n++;
  }

  if (addonId === 'posthog') {
    writeFile(root, 'src/lib/posthog.ts', `import posthog from 'posthog-js';

export function initPosthog() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'YOUR_POSTHOG_KEY', {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

export { posthog };
`); n++;

    writeFile(root, 'src/hooks/useFeatureFlag.ts', `import { useState, useEffect } from 'react';
import { posthog } from '@/lib/posthog';

export function useFeatureFlag(key: string, defaultValue = false): boolean {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    const value = posthog.isFeatureEnabled(key);
    if (value !== undefined) setEnabled(value);
  }, [key]);

  return enabled;
}
`); n++;
  }

  return n;
}

// ── Common Files ─────────────────────────────────────────────

function generateCommonFiles(root: string, ctx: Record<string, unknown>): number {
  let n = 0;
  const tmpl = TEMPLATES[ctx.template as string];

  // .env.example
  const envLines = [
    '# Generated by @intinc/cli-scaffold',
    `# Template: ${ctx.template}`,
    '',
  ];
  if (ctx.hasSupabase) {
    envLines.push('VITE_SUPABASE_URL=', 'VITE_SUPABASE_ANON_KEY=', '');
  }
  if (ctx.hasStripe) {
    envLines.push('VITE_STRIPE_PUBLISHABLE_KEY=', '');
  }
  if (ctx.hasSentry) {
    envLines.push('VITE_SENTRY_DSN=', '');
  }
  if (ctx.hasPosthog) {
    envLines.push('VITE_POSTHOG_KEY=', 'VITE_POSTHOG_HOST=https://us.i.posthog.com', '');
  }
  for (const env of tmpl?.requiredEnv || []) {
    envLines.push(`${env}=`);
  }
  writeFile(root, '.env.example', envLines.join('\n')); n++;

  // .gitignore
  writeFile(root, '.gitignore', `node_modules/
dist/
.env
.env.local
*.local
coverage/
release/
src-tauri/target/
.DS_Store
*.log
`); n++;

  // README
  writeFile(root, 'README.md', `# ${ctx.name}

> Scaffolded with [\`@intinc/cli-scaffold\`](https://github.com/intinc/platform-toolkit) — ${tmpl?.name || ctx.template}

## Quick Start

\`\`\`bash
cp .env.example .env.local   # fill in secrets
pnpm install
pnpm dev
\`\`\`

## Features

${(tmpl?.features || []).map((f: string) => `- ${f}`).join('\n')}
${(ctx.addons as string[]).map(a => `- ${ADDONS[a]?.name || a}`).join('\n')}

## Testing

\`\`\`bash
pnpm test          # unit tests
pnpm test:e2e      # E2E tests (if available)
pnpm typecheck     # type checking
\`\`\`

## VISTADEL Phase

This project was created at **Phase S (Stack)** of the VISTADEL framework.
Run \`intinc-audit scan --dir .\` to check readiness for the next phase.

## License

MIT © INT Inc. ${ctx.year}
`); n++;

  return n;
}
