import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import fs from "node:fs/promises";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  mainWindow.on("closed", () => { mainWindow = null; });
}

// ── IPC: File I/O ──
ipcMain.handle("fs:read", async (_e, filePath: string) =>
  fs.readFile(filePath, "utf-8")
);

ipcMain.handle("fs:write", async (_e, filePath: string, data: string) => {
  await fs.writeFile(filePath, data, "utf-8");
  return true;
});

ipcMain.handle("dialog:open", async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, { properties: ["openFile"] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("dialog:save", async (_e, options?: Electron.SaveDialogOptions) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, options ?? {});
  return result.canceled ? null : result.filePath;
});

// ── IPC: Workflow trigger ──
ipcMain.handle("workflow:trigger", async (_e, url: string, data: unknown) => {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { ok: resp.ok, status: resp.status, body: await resp.json() };
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (!mainWindow) createWindow(); });
