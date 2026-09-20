// ─────────────────────────────────────────────────────────────
// INT OS Shell — Electron Main Process (Advanced)
// Features: Menu/Tray, Multi-Window, File I/O, Protocol Handlers
// Per-client architecture: each client gets own config + MCP endpoint
// ─────────────────────────────────────────────────────────────

import {
  app, BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage,
  session, protocol, shell, Notification,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import { join, extname, basename } from 'path';
import { readFile, writeFile, readdir, stat, watch } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';

// ── Types ────────────────────────────────────────────────

interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

interface ClientConfig {
  tenantId: string;
  tenantName: string;
  mcpEndpoint: string;
  awsServerId: string;
  theme?: Record<string, string>;
}

// ── State ────────────────────────────────────────────────

const windows = new Map<string, BrowserWindow>();
let tray: Tray | null = null;
let clientConfig: ClientConfig | null = null;

const CONFIG_DIR = join(app.getPath('userData'), 'config');
const STATE_FILE = join(CONFIG_DIR, 'window-states.json');

if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });

// ── Window State Persistence ─────────────────────────────

async function loadWindowStates(): Promise<Record<string, WindowState>> {
  try {
    const data = await readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveWindowState(id: string, win: BrowserWindow) {
  const states = await loadWindowStates();
  const bounds = win.getBounds();
  states[id] = {
    x: bounds.x, y: bounds.y,
    width: bounds.width, height: bounds.height,
    isMaximized: win.isMaximized(),
  };
  await writeFile(STATE_FILE, JSON.stringify(states, null, 2));
}

// ── Window Factory ───────────────────────────────────────

async function createWindow(
  id: string,
  opts: {
    route?: string;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    parent?: BrowserWindow;
    modal?: boolean;
    titleBarStyle?: 'default' | 'hidden' | 'hiddenInset';
  } = {},
): Promise<BrowserWindow> {
  // Restore previous state
  const states = await loadWindowStates();
  const saved = states[id];

  const win = new BrowserWindow({
    x: saved?.x,
    y: saved?.y,
    width: saved?.width || opts.width || 1200,
    height: saved?.height || opts.height || 800,
    minWidth: opts.minWidth || 600,
    minHeight: opts.minHeight || 400,
    parent: opts.parent,
    modal: opts.modal || false,
    titleBarStyle: opts.titleBarStyle || (process.platform === 'darwin' ? 'hiddenInset' : 'default'),
    trafficLightPosition: { x: 16, y: 16 },
    show: false, // show after ready-to-show
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  // Restore maximized state
  if (saved?.isMaximized) win.maximize();

  // Show when ready (prevents flash)
  win.once('ready-to-show', () => win.show());

  // CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
          "font-src 'self' data:;"
        ],
      },
    });
  });

  // Block navigation + new windows
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Save state on move/resize
  win.on('resize', () => saveWindowState(id, win));
  win.on('move', () => saveWindowState(id, win));
  win.on('close', () => {
    saveWindowState(id, win);
    windows.delete(id);
  });

  // Load content
  const route = opts.route || '/';
  if (process.env.NODE_ENV === 'development') {
    await win.loadURL(`http://localhost:5173${route}`);
  } else {
    await win.loadFile(join(__dirname, '../renderer/index.html'), { hash: route });
  }

  windows.set(id, win);
  return win;
}

// ── Application Menu ─────────────────────────────────────

function buildAppMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { label: 'Check for Updates...', click: () => autoUpdater.checkForUpdatesAndNotify() },
        { type: 'separator' },
        { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => openSettingsWindow() },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Window', accelerator: 'CmdOrCtrl+N', click: () => createWindow(`main-${Date.now()}`) },
        { label: 'Open File...', accelerator: 'CmdOrCtrl+O', click: () => handleOpenFile() },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => getFocusedWindow()?.webContents.send('menu:save') },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: () => handleSaveAs() },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'forceReload' },
        { role: 'toggleDevTools' }, { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' }, { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' }, { role: 'zoom' },
        { type: 'separator' },
        { label: 'Dashboard', click: () => ensureWindow('dashboard', { route: '/dashboard' }) },
        { label: 'Projects', click: () => ensureWindow('projects', { route: '/projects' }) },
        { label: 'Settings', click: () => openSettingsWindow() },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://docs.intinc.com') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/intinc/platform-toolkit/issues') },
        { type: 'separator' },
        { label: `Version ${app.getVersion()}`, enabled: false },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── System Tray ──────────────────────────────────────────

function createTray() {
  const iconPath = join(__dirname, '../../assets/tray-icon.png');
  // Fallback to empty icon if asset missing
  const icon = existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
    : nativeImage.createEmpty();

  tray = new Tray(icon);
  tray.setToolTip(`INT OS — ${clientConfig?.tenantName || 'Not configured'}`);

  const contextMenu = Menu.buildFromTemplate([
    { label: `INT OS v${app.getVersion()}`, enabled: false },
    { type: 'separator' },
    { label: 'Open Dashboard', click: () => ensureWindow('dashboard', { route: '/dashboard' }) },
    { label: 'Open Projects', click: () => ensureWindow('projects', { route: '/projects' }) },
    { type: 'separator' },
    { label: 'Check for Updates', click: () => autoUpdater.checkForUpdatesAndNotify() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);

  // Click to show/focus main window
  tray.on('click', () => {
    const main = windows.get('main') || windows.values().next().value;
    if (main) {
      main.isVisible() ? main.focus() : main.show();
    }
  });
}

// ── Multi-Window Helpers ─────────────────────────────────

function getFocusedWindow(): BrowserWindow | undefined {
  return BrowserWindow.getFocusedWindow() || undefined;
}

async function ensureWindow(id: string, opts?: Parameters<typeof createWindow>[1]) {
  const existing = windows.get(id);
  if (existing && !existing.isDestroyed()) {
    existing.focus();
    return existing;
  }
  return createWindow(id, opts);
}

function openSettingsWindow() {
  ensureWindow('settings', {
    route: '/settings',
    width: 700,
    height: 500,
    minWidth: 500,
    minHeight: 400,
  });
}

// ── File I/O (Secure) ────────────────────────────────────

async function handleOpenFile() {
  const win = getFocusedWindow();
  if (!win) return;

  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['md', 'txt', 'json', 'yaml', 'yml'] },
      { name: 'Code', extensions: ['ts', 'tsx', 'js', 'jsx', 'css', 'html'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (canceled || filePaths.length === 0) return;

  for (const filePath of filePaths) {
    const content = await readFile(filePath, 'utf-8');
    win.webContents.send('file:opened', {
      path: filePath,
      name: basename(filePath),
      content,
      ext: extname(filePath),
    });
  }
}

async function handleSaveAs() {
  const win = getFocusedWindow();
  if (!win) return;

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'JSON', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (canceled || !filePath) return;
  win.webContents.send('file:save-as-path', filePath);
}

// ── Protocol Handler (intinc://) ─────────────────────────

function registerProtocol() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('intinc', process.execPath, [process.argv[1]]);
    }
  } else {
    app.setAsDefaultProtocolClient('intinc');
  }
}

function handleProtocolUrl(url: string) {
  // intinc://open/project/abc123
  // intinc://settings
  // intinc://tenant/switch/xyz
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.replace(/^\/\//, '').split('/').filter(Boolean);

    if (pathParts[0] === 'open' && pathParts[1] === 'project') {
      ensureWindow('projects', { route: `/projects/${pathParts[2]}` });
    } else if (pathParts[0] === 'settings') {
      openSettingsWindow();
    } else if (pathParts[0] === 'tenant' && pathParts[1] === 'switch') {
      for (const win of windows.values()) {
        win.webContents.send('tenant:switch', pathParts[2]);
      }
    }
  } catch (err) {
    console.error('Invalid protocol URL:', url, err);
  }
}

// ── IPC Handlers ─────────────────────────────────────────

function registerIPC() {
  // App info
  ipcMain.handle('app:version', () => app.getVersion());
  ipcMain.handle('app:platform', () => process.platform);
  ipcMain.handle('app:paths', () => ({
    userData: app.getPath('userData'),
    documents: app.getPath('documents'),
    downloads: app.getPath('downloads'),
    temp: app.getPath('temp'),
  }));

  // Client config (INT OS: per-client)
  ipcMain.handle('config:get', () => clientConfig);
  ipcMain.handle('config:set', async (_, config: ClientConfig) => {
    clientConfig = config;
    await writeFile(join(CONFIG_DIR, 'client.json'), JSON.stringify(config, null, 2));
    tray?.setToolTip(`INT OS — ${config.tenantName}`);
    return true;
  });
  ipcMain.handle('config:load', async () => {
    try {
      const data = await readFile(join(CONFIG_DIR, 'client.json'), 'utf-8');
      clientConfig = JSON.parse(data);
      return clientConfig;
    } catch { return null; }
  });

  // Dialog
  ipcMain.handle('dialog:open', async (_, options) => {
    const win = getFocusedWindow();
    if (!win) return { canceled: true, filePaths: [] };
    return dialog.showOpenDialog(win, options);
  });
  ipcMain.handle('dialog:save', async (_, options) => {
    const win = getFocusedWindow();
    if (!win) return { canceled: true };
    return dialog.showSaveDialog(win, options);
  });
  ipcMain.handle('dialog:message', async (_, options) => {
    const win = getFocusedWindow();
    if (!win) return { response: 0 };
    return dialog.showMessageBox(win, options);
  });

  // Secure File I/O — validate paths, prevent traversal
  ipcMain.handle('fs:read', async (_, filePath: string) => {
    validatePath(filePath);
    return readFile(filePath, 'utf-8');
  });
  ipcMain.handle('fs:write', async (_, filePath: string, content: string) => {
    validatePath(filePath);
    await writeFile(filePath, content, 'utf-8');
    return true;
  });
  ipcMain.handle('fs:readdir', async (_, dirPath: string) => {
    validatePath(dirPath);
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.map(e => ({
      name: e.name,
      isDirectory: e.isDirectory(),
      isFile: e.isFile(),
    }));
  });
  ipcMain.handle('fs:stat', async (_, filePath: string) => {
    validatePath(filePath);
    const s = await stat(filePath);
    return { size: s.size, isDirectory: s.isDirectory(), isFile: s.isFile(),
      created: s.birthtime.toISOString(), modified: s.mtime.toISOString() };
  });
  ipcMain.handle('fs:exists', async (_, filePath: string) => {
    validatePath(filePath);
    return existsSync(filePath);
  });

  // File watcher
  const watchers = new Map<string, AbortController>();

  ipcMain.handle('fs:watch', async (event, dirPath: string, watchId: string) => {
    validatePath(dirPath);
    const ac = new AbortController();
    watchers.set(watchId, ac);

    (async () => {
      try {
        const watcher = watch(dirPath, { recursive: true, signal: ac.signal });
        for await (const change of watcher) {
          const win = BrowserWindow.fromWebContents(event.sender);
          win?.webContents.send(`fs:change:${watchId}`, {
            eventType: change.eventType,
            filename: change.filename,
          });
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Watch error:', err);
      }
    })();

    return true;
  });
  ipcMain.handle('fs:unwatch', (_, watchId: string) => {
    watchers.get(watchId)?.abort();
    watchers.delete(watchId);
    return true;
  });

  // Window management
  ipcMain.handle('window:open', async (_, id: string, route: string, opts?: { width?: number; height?: number }) => {
    const win = await ensureWindow(id, { route, ...opts });
    return win.id;
  });
  ipcMain.handle('window:close', (_, id: string) => {
    windows.get(id)?.close();
    return true;
  });
  ipcMain.handle('window:list', () => {
    return Array.from(windows.entries()).map(([id, win]) => ({
      id, title: win.getTitle(), focused: win.isFocused(),
      bounds: win.getBounds(), isMaximized: win.isMaximized(),
    }));
  });
  ipcMain.handle('window:focus', (_, id: string) => {
    const win = windows.get(id);
    if (win) { win.show(); win.focus(); }
    return !!win;
  });

  // Notifications (native OS)
  ipcMain.handle('notification:show', (_, opts: { title: string; body: string; silent?: boolean }) => {
    if (!Notification.isSupported()) return false;
    const notif = new Notification({ title: opts.title, body: opts.body, silent: opts.silent });
    notif.show();
    return true;
  });

  // Auto-updater
  ipcMain.handle('update:check', () => autoUpdater.checkForUpdates());
  ipcMain.handle('update:install', () => autoUpdater.quitAndInstall());
}

// Path validation — prevent directory traversal
function validatePath(filePath: string) {
  const resolved = require('path').resolve(filePath);
  const allowed = [
    app.getPath('userData'),
    app.getPath('documents'),
    app.getPath('downloads'),
    app.getPath('temp'),
  ];

  // Must be within an allowed directory
  const isAllowed = allowed.some(dir => resolved.startsWith(dir));
  if (!isAllowed) {
    throw new Error(`Path not allowed: ${filePath}. Must be within userData, documents, downloads, or temp.`);
  }
}

// ── App Lifecycle ────────────────────────────────────────

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    // Protocol URL from second instance
    const protocolUrl = commandLine.find(arg => arg.startsWith('intinc://'));
    if (protocolUrl) handleProtocolUrl(protocolUrl);

    // Focus existing window
    const main = windows.get('main');
    if (main) {
      if (main.isMinimized()) main.restore();
      main.focus();
    }
  });

  app.whenReady().then(async () => {
    registerProtocol();
    registerIPC();
    buildAppMenu();

    // Load client config
    try {
      const data = await readFile(join(CONFIG_DIR, 'client.json'), 'utf-8');
      clientConfig = JSON.parse(data);
    } catch { /* first launch */ }

    createTray();
    await createWindow('main');

    autoUpdater.checkForUpdatesAndNotify();
  });

  app.on('window-all-closed', () => {
    // Keep running in tray on macOS
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (windows.size === 0) createWindow('main');
  });

  // Handle protocol URL on macOS
  app.on('open-url', (_event, url) => {
    handleProtocolUrl(url);
  });

  // Auto-updater events → broadcast to all windows
  autoUpdater.on('update-available', (info) => {
    for (const win of windows.values()) {
      win.webContents.send('update:available', info);
    }
  });
  autoUpdater.on('update-downloaded', (info) => {
    for (const win of windows.values()) {
      win.webContents.send('update:downloaded', info);
    }
  });
}
