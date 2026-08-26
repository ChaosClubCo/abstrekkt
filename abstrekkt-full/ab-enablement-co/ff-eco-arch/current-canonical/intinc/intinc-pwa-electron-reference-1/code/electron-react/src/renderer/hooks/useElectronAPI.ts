/**
 * Type-safe access to the Electron IPC bridge.
 *
 * @example
 * ```tsx
 * function FileReader() {
 *   const api = useElectronAPI();
 *
 *   const handleOpen = async () => {
 *     const path = await api.openFile({ filters: [{ name: "JSON", extensions: ["json"] }] });
 *     if (path) {
 *       const content = await api.readFile(path);
 *       console.log(content);
 *     }
 *   };
 *
 *   return <button onClick={handleOpen}>Open File</button>;
 * }
 * ```
 */

// Import the type from preload (build-time only)
import type { ElectronAPI } from "../../preload/index";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export function useElectronAPI(): ElectronAPI {
  if (typeof window === "undefined" || !window.electronAPI) {
    throw new Error(
      "electronAPI not available. Are you running inside Electron with the correct preload script?"
    );
  }
  return window.electronAPI;
}
