declare global {
  interface Window {
    api: {
      readFile: (path: string) => Promise<string>;
      writeFile: (path: string, data: string) => Promise<boolean>;
      openDialog: () => Promise<string | null>;
      saveDialog: (opts?: unknown) => Promise<string | null>;
      triggerWorkflow: (url: string, data: unknown) => Promise<{ ok: boolean; status: number; body: unknown }>;
    };
  }
}

const output = document.getElementById("output")!;

function log(msg: string): void {
  output.textContent += `\n${new Date().toISOString().slice(11, 19)} ${msg}`;
}

document.getElementById("btn-open")?.addEventListener("click", async () => {
  const path = await window.api.openDialog();
  if (!path) return log("Open cancelled");
  const content = await window.api.readFile(path);
  log(`Opened: ${path} (${content.length} chars)`);
});

document.getElementById("btn-save")?.addEventListener("click", async () => {
  const path = await window.api.saveDialog({ defaultPath: "output.txt" });
  if (!path) return log("Save cancelled");
  await window.api.writeFile(path, "Hello from Electron!");
  log(`Saved: ${path}`);
});

document.getElementById("btn-workflow")?.addEventListener("click", async () => {
  try {
    const result = await window.api.triggerWorkflow(
      "https://httpbin.org/post",
      { action: "test", timestamp: Date.now() }
    );
    log(`Workflow: ${result.status} ${result.ok ? "OK" : "FAIL"}`);
  } catch (err) {
    log(`Workflow error: ${err}`);
  }
});

export {};
