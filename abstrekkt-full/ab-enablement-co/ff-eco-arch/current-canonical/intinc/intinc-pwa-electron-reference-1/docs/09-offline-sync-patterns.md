# Offline-First Sync Patterns

> **Diagrams**: `diagrams/offline-sync-sequence`.
> **Code**: `code/shared/src/offline-sync.ts`, `code/react-pwa/src/hooks/useOfflineSync.ts`.

---

## Core Principle

**Offline-first** means the app writes to local storage first, then syncs to the server when connectivity is available. The local store is the source of truth during offline periods.

```
User Action → Write to IndexedDB (instant) → Queue sync operation →
  Online? → Process queue → Server confirms → Mark synced
  Offline? → Queue grows → User continues working → Sync when reconnected
```

---

## Architecture Layers

### Layer 1: IndexedDB as Local Store

Why IndexedDB and not localStorage:
- Async (doesn't block UI)
- Stores structured data, binary blobs, files
- Practically unlimited storage (vs. 5MB for localStorage)
- Transactional (ACID within a single DB)

```typescript
// Simplified IndexedDB wrapper — see code/shared/src/offline-sync.ts for full version
class LocalStore<T extends { id: string; updatedAt: string }> {
  constructor(private dbName: string, private storeName: string) {}

  async put(item: T): Promise<void> {
    const db = await this.open();
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).put(item);
    await tx.complete;
  }

  async get(id: string): Promise<T | undefined> {
    const db = await this.open();
    return db.transaction(this.storeName).objectStore(this.storeName).get(id);
  }

  async getAll(): Promise<T[]> {
    const db = await this.open();
    return db.transaction(this.storeName).objectStore(this.storeName).getAll();
  }
}
```

### Layer 2: Sync Queue

Every write operation that needs to reach the server goes into a queue:

```typescript
interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;          // e.g., 'tasks', 'notes'
  payload: unknown;
  createdAt: string;       // ISO timestamp
  retryCount: number;
  status: 'pending' | 'in-flight' | 'failed';
}
```

Queue processing:
1. On reconnect (or on a timer), take oldest pending operation
2. Mark as `in-flight`
3. Send to server
4. On success → remove from queue
5. On failure → increment `retryCount`, mark `failed`, try next
6. After 5 failures → move to dead letter queue, notify user

### Layer 3: Conflict Resolution

When two clients modify the same record offline, you need a merge strategy.

**Strategy 1: Last Write Wins (LWW)**

```typescript
function resolveConflict<T extends { updatedAt: string }>(
  local: T,
  remote: T
): T {
  return new Date(local.updatedAt) > new Date(remote.updatedAt) ? local : remote;
}
```

**Pros**: Simple. **Cons**: Silently drops the earlier change.

**Strategy 2: Server Wins**

Always accept server version on conflict. Client changes are overwritten.

**Pros**: Consistent. **Cons**: User loses offline work.

**Strategy 3: Client Wins**

Always accept client version. Server state may diverge between clients.

**Pros**: User's work is never lost. **Cons**: Another user's changes may be overwritten.

**Strategy 4: Field-Level Merge**

Merge at the property level — if client changed `title` and server changed `status`, keep both changes.

```typescript
function fieldMerge<T extends Record<string, unknown>>(
  base: T,     // Last known synced state
  local: T,    // Client's current state
  remote: T    // Server's current state
): T {
  const merged = { ...remote };
  for (const key of Object.keys(local)) {
    if (local[key] !== base[key] && remote[key] === base[key]) {
      // Client changed it, server didn't → keep client's value
      merged[key] = local[key];
    }
    // If both changed → server wins (or flag for manual resolution)
  }
  return merged as T;
}
```

**Strategy 5: CRDTs (Advanced)**

Conflict-free Replicated Data Types guarantee convergence without coordination. Useful for collaborative editing.

Types:
- **G-Counter**: Increment-only counter (e.g., view counts)
- **PN-Counter**: Increment and decrement
- **LWW-Register**: Single value with timestamp
- **OR-Set**: Add/remove elements from a set
- **RGA**: Replicated Growable Array (for text/lists)

Libraries: Yjs, Automerge, Diamond Types.

**When to use CRDTs**: Multi-user collaborative editing with offline support. Overkill for single-user offline or simple CRUD.

---

## Background Sync API

Chrome and Edge support `BackgroundSync` — the browser retries your sync even after the tab closes.

```typescript
// In your page
const reg = await navigator.serviceWorker.ready;
await reg.sync.register('sync-pending-operations');

// In your service worker
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-pending-operations') {
    event.waitUntil(processSyncQueue());
  }
});
```

**Fallback** for Firefox/Safari (no BackgroundSync):
- Sync on `visibilitychange` (when user tabs back)
- Sync on `online` event
- Sync on a timer when page is visible

---

## Practical Pattern: Offline Task Manager

```typescript
// User creates a task while offline
const task = { id: uuid(), title: 'Review PR', status: 'todo', updatedAt: new Date().toISOString() };

// 1. Write to IndexedDB immediately (UI updates instantly)
await localStore.put(task);

// 2. Queue sync operation
await syncQueue.enqueue({
  type: 'create',
  entity: 'tasks',
  payload: task,
});

// 3. If online, process queue now. If offline, it'll process on reconnect.
if (navigator.onLine) {
  await processSyncQueue();
}
```

---
*Intinc Engineering — Offline Sync Patterns v2.0*
