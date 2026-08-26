/**
 * @module ipc-bridge
 * Type-safe bidirectional IPC bridge for Electron apps.
 *
 * Define your IPC contract once, get type safety in main, preload, AND renderer.
 *
 * @example
 * ```ts
 * // shared/ipc-contract.ts
 * import { createIPCContract } from "@intinc/ipc-bridge";
 *
 * export const contract = createIPCContract({
 *   "fs:read": {
 *     input: {} as { path: string },
 *     output: {} as string,
 *   },
 *   "fs:write": {
 *     input: {} as { path: string; content: string },
 *     output: {} as boolean,
 *   },
 * });
 * ```
 */

export type IPCContract = Record<string, { input: unknown; output: unknown }>;

export function createIPCContract<T extends IPCContract>(contract: T): T {
  return contract;
}

/** Type-safe handler registration for main process */
export type IPCHandlers<T extends IPCContract> = {
  [K in keyof T]: (input: T[K]["input"]) => Promise<T[K]["output"]> | T[K]["output"];
};

/** Type-safe client for renderer process */
export type IPCClient<T extends IPCContract> = {
  [K in keyof T]: (input: T[K]["input"]) => Promise<T[K]["output"]>;
};

/**
 * Register all IPC handlers in main process.
 *
 * @example
 * ```ts
 * // main/index.ts
 * import { ipcMain } from "electron";
 * import { registerHandlers } from "@intinc/ipc-bridge";
 * import { contract } from "../shared/ipc-contract";
 *
 * registerHandlers(ipcMain, contract, {
 *   "fs:read": async ({ path }) => fs.readFile(path, "utf-8"),
 *   "fs:write": async ({ path, content }) => {
 *     await fs.writeFile(path, content);
 *     return true;
 *   },
 * });
 * ```
 */
export function registerHandlers<T extends IPCContract>(
  ipcMain: { handle: (channel: string, handler: (event: unknown, ...args: unknown[]) => unknown) => void },
  _contract: T,
  handlers: IPCHandlers<T>
): void {
  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, (_event: unknown, input: unknown) =>
      (handler as (input: unknown) => unknown)(input)
    );
  }
}

/**
 * Create a type-safe client for the renderer process.
 *
 * @example
 * ```ts
 * // preload/index.ts
 * import { contextBridge } from "electron";
 * import { createClient } from "@intinc/ipc-bridge";
 * import { contract } from "../shared/ipc-contract";
 *
 * contextBridge.exposeInMainWorld("api", createClient(ipcRenderer, contract));
 * ```
 */
export function createClient<T extends IPCContract>(
  ipcRenderer: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> },
  contract: T
): IPCClient<T> {
  const client = {} as Record<string, unknown>;
  for (const channel of Object.keys(contract)) {
    client[channel] = (input: unknown) => ipcRenderer.invoke(channel, input);
  }
  return client as IPCClient<T>;
}
