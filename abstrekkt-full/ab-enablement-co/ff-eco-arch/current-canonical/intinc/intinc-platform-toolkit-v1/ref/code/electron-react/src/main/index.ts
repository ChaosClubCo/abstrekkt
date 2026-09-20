import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "node:path";
import fs from "node:fs/promises";

// ── Logging ──
log.transports.file.level = "info";
autoUpdater.logger = log;

// ── Security hardening ──
app.on("web-contents-created", (_event, contents) => {
  // Block navigation to external URLs
  contents.on("will-navigate", (event, url) => {
    const parsed = new URL(url);
    if (parsed.origin !== "http://localhost:5173" && parsed.origin !== new URL(getRendererUrl()).origin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Block new window creation
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
});

function getRendererUrl(): string {
  if (process.env.VITE_DEV_SERVER_URL) {
    return process.env.VITE_DEV_SERVER_URL;
  }
  return `file://${path.join(__dirname, "../dist/index.html")}`;
}

let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    show: false,
  });

  // Graceful show to avoid white flash
  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => { mainWindow = null; });

  await mainWindow.loadURL(getRendererUrl());

  // Dev tools in development only
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

// ── IPC Handlers ──

// File system operations (sandboxed to user-selected paths)
ipcMain.handle("dialog:open-file", async (_event, options?: Electron.OpenDialogOptions) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    ...options,
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle("dialog:save-file", async (_event, options?: Electron.SaveDialogOptions) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, options ?? {});
  if (result.canceled || !result.filePath) return null;
  return result.filePath;
});

ipcMain.handle("fs:read-file", async (_event, filePath: string) => {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err) {
    log.error("Failed to read file:", filePath, err);
    throw err;
  }
});

ipcMain.handle("fs:write-file", async (_event, filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  } catch (err) {
    log.error("Failed to write file:", filePath, err);
    throw err;
  }
});

ipcMain.handle("fs:read-dir", async (_event, dirPath: string) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.map((e) => ({ name: e.name, isDirectory: e.isDirectory() }));
});

// Workflow orchestration (for Make/n8n/Zapier triggers)
ipcMain.handle("workflow:trigger", async (_event, payload: {
  platform: "n8n" | "make" | "zapier";
  webhookUrl: string;
  data: Record<string, unknown>;
}) => {
  try {
    const response = await fetch(payload.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    });
    return { ok: response.ok, status: response.status, body: await response.json() };
  } catch (err) {
    log.error("Workflow trigger failed:", err);
    throw err;
  }
});

// App info
ipcMain.handle("app:get-info", () => ({
  version: app.getVersion(),
  name: app.getName(),
  platform: process.platform,
  arch: process.arch,
  electronVersion: process.versions.electron,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome,
}));

// Auto-update
ipcMain.handle("update:check", async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return result?.updateInfo ?? null;
  } catch (err) {
    log.error("Update check failed:", err);
    return null;
  }
});

ipcMain.handle("update:download", async () => {
  await autoUpdater.downloadUpdate();
});

ipcMain.handle("update:install", () => {
  autoUpdater.quitAndInstall(true, true);
});

// ── App Lifecycle ──
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Check for updates on startup (production only)
app.on("ready", () => {
  if (!process.env.VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
