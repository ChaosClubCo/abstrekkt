import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  readFile: (path: string) => ipcRenderer.invoke("fs:read", path),
  writeFile: (path: string, data: string) => ipcRenderer.invoke("fs:write", path, data),
  openDialog: () => ipcRenderer.invoke("dialog:open"),
  saveDialog: (opts?: unknown) => ipcRenderer.invoke("dialog:save", opts),
  triggerWorkflow: (url: string, data: unknown) => ipcRenderer.invoke("workflow:trigger", url, data),
});
