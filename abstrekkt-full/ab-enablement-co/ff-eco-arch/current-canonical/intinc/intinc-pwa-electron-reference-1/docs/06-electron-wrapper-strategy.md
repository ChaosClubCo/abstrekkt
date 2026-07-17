# Electron Wrapper Strategy

> **Purpose**: Wrapping existing web-based workflow tools (Make/n8n/Zapier) with Electron desktop UIs.
> **Audience**: Engineers building desktop orchestration dashboards for workflow platforms.

---

## Use Case

You have workflows running in n8n, Make, or Zapier. You want a desktop app that:
- Triggers workflows via API
- Shows execution status and results
- Reads/writes local files (drag-drop input, save results)
- Runs without a browser tab (system tray, dedicated window)
- Works across engineering and non-technical users

---

## Architecture Options

### Option A: Monolithic (Simple)

```
Electron Main Process
  ├── BrowserWindow → React UI
  ├── IPC handlers → workflow triggers, file I/O
  └── Direct HTTP calls to n8n/Make/Zapier APIs
```

**Pros**: Simplest. Single process manages everything.
**Cons**: Main process does too much. API keys in main process. Hard to test.

### Option B: Frontend + Backend Split (Recommended)

```
Electron Main Process
  ├── BrowserWindow → React UI (renderer)
  ├── Preload bridge → typed IPC
  └── IPC handlers → delegates to WorkflowService

WorkflowService (in main process)
  ├── n8n client (REST API)
  ├── Make client (REST API)
  ├── Zapier client (webhook triggers)
  └── Local file manager
```

**Pros**: Clean separation. Testable services. API keys isolated in main process.
**Cons**: More boilerplate than Option A.

### Option C: Hybrid with Local Server

```
Electron Main Process
  ├── BrowserWindow → React UI
  └── Spawns local Express server (port 3100)

Local Express Server
  ├── /api/workflows → proxy to n8n/Make/Zapier
  ├── /api/files → local file operations
  └── WebSocket → real-time execution updates
```

**Pros**: React app talks to local API (same patterns as web). Easy to add more integrations.
**Cons**: Two processes. Port conflicts. More complex packaging.

**We recommend Option B** for Intinc projects.

---

## Implementation

See `code/electron-app/src/main/workflow-bridge.ts` for the complete WorkflowService.

### Workflow Trigger Pattern

```typescript
// In main process
ipcMain.handle('workflow:trigger', async (_event, payload: WorkflowTriggerPayload) => {
  const { platform, workflowId, inputData } = payload;

  switch (platform) {
    case 'n8n':
      return n8nClient.triggerWebhook(workflowId, inputData);
    case 'make':
      return makeClient.triggerScenario(workflowId, inputData);
    case 'zapier':
      return zapierClient.triggerWebhook(workflowId, inputData);
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
});
```

### File I/O Integration

```typescript
// Drag-drop handler in renderer → IPC → main process reads file
ipcMain.handle('file:read-dropped', async (_event, filePath: string) => {
  if (!isAllowedPath(filePath)) throw new Error('Path not allowed');
  const content = await readFile(filePath);
  const stat = await fsStat(filePath);
  return {
    content: content.toString('base64'),
    name: path.basename(filePath),
    size: stat.size,
    mimeType: mime.lookup(filePath) || 'application/octet-stream',
  };
});

// Save workflow results to local file
ipcMain.handle('file:save-result', async (_event, payload: SavePayload) => {
  const { suggestedName, content, filters } = payload;
  const result = await dialog.showSaveDialog({
    defaultPath: suggestedName,
    filters: filters || [{ name: 'All Files', extensions: ['*'] }],
  });
  if (result.canceled || !result.filePath) return null;
  await writeFile(result.filePath, Buffer.from(content, 'base64'));
  return result.filePath;
});
```

---

## Multi-Platform Orchestration Dashboard

For teams using multiple workflow platforms, the Electron wrapper becomes a unified dashboard:

```
┌─────────────────────────────────────────────────┐
│  Intinc Workflow Dashboard                  ─ □ ×│
├─────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  n8n    │ │  Make   │ │ Zapier  │  [+Add]  │
│  └────┬────┘ └────┬────┘ └────┬────┘          │
│       └────────────┼──────────┘                │
│                    ▼                            │
│  ┌─────────────────────────────────────────┐   │
│  │  Active Workflows                        │   │
│  │  ● Deploy Client Site    [n8n]  Running  │   │
│  │  ● Process Invoices      [Make] Complete │   │
│  │  ● Sync CRM Data        [Zapier] Queued │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │  📁 Drop files here to process          │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Platform Assessment Template

Before wrapping a workflow platform with Electron, evaluate:

| Question | n8n | Make | Zapier |
|----------|-----|------|--------|
| Has REST API for triggering? | ✅ webhook + API | ✅ webhook + API | ✅ webhook only |
| Can query execution status? | ✅ execution API | ✅ scenario API | ❌ limited |
| Supports webhook input? | ✅ | ✅ | ✅ |
| Supports file upload? | ✅ binary data | ✅ via upload step | ⚠️ limited |
| Self-hosted option? | ✅ | ❌ | ❌ |
| Rate limits | Self-hosted: none | 10K ops/month (pro) | 750 tasks/month (free) |

---
*Intinc Engineering — Electron Wrapper Strategy v2.0*
