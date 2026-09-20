import { useState, useCallback, useEffect, useRef } from "react";
import { openDB, type IDBPDatabase } from "idb";

export interface OfflineMutation {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
  retries: number;
}

interface OfflineQueueState {
  /** Number of queued mutations */
  queueSize: number;
  /** Whether the queue is currently replaying */
  syncing: boolean;
  /** Queue a fetch request for later replay */
  enqueue: (request: Request) => Promise<void>;
  /** Manually trigger queue replay */
  flush: () => Promise<void>;
  /** Clear all queued mutations */
  clear: () => Promise<void>;
}

const DB_NAME = "intinc-offline-queue";
const STORE_NAME = "mutations";
const MAX_RETRIES = 5;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }
    },
  });
}

/**
 * Offline mutation queue backed by IndexedDB.
 * Automatically replays queued requests when connectivity returns.
 *
 * @example
 * ```tsx
 * function SaveButton({ data }: { data: FormData }) {
 *   const isOnline = useOnlineStatus();
 *   const { enqueue, queueSize } = useOfflineQueue();
 *
 *   const handleSave = async () => {
 *     const req = new Request("/api/data", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(data),
 *     });
 *
 *     if (isOnline) {
 *       await fetch(req);
 *     } else {
 *       await enqueue(req);
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleSave}>Save</button>
 *       {queueSize > 0 && <span>{queueSize} pending changes</span>}
 *     </>
 *   );
 * }
 * ```
 */
export function useOfflineQueue(): OfflineQueueState {
  const [queueSize, setQueueSize] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);

  const refreshCount = useCallback(async () => {
    const db = await getDB();
    const count = await db.count(STORE_NAME);
    setQueueSize(count);
  }, []);

  const enqueue = useCallback(
    async (request: Request) => {
      const db = await getDB();
      const mutation: OfflineMutation = {
        id: crypto.randomUUID(),
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: await request.text(),
        timestamp: Date.now(),
        retries: 0,
      };
      await db.put(STORE_NAME, mutation);
      await refreshCount();
    },
    [refreshCount]
  );

  const flush = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);

    try {
      const db = await getDB();
      const mutations = await db.getAllFromIndex(STORE_NAME, "timestamp");

      for (const mutation of mutations) {
        try {
          const response = await fetch(mutation.url, {
            method: mutation.method,
            headers: mutation.headers,
            body: mutation.method !== "GET" ? mutation.body : undefined,
          });

          if (response.ok) {
            await db.delete(STORE_NAME, mutation.id);
          } else if (mutation.retries < MAX_RETRIES) {
            await db.put(STORE_NAME, {
              ...mutation,
              retries: mutation.retries + 1,
            });
          } else {
            // Max retries exceeded — move to dead letter or discard
            console.warn(`[OfflineQueue] Dropping mutation ${mutation.id} after ${MAX_RETRIES} retries`);
            await db.delete(STORE_NAME, mutation.id);
          }
        } catch {
          // Network still down — stop replay
          break;
        }
      }
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      await refreshCount();
    }
  }, [refreshCount]);

  const clear = useCallback(async () => {
    const db = await getDB();
    await db.clear(STORE_NAME);
    setQueueSize(0);
  }, []);

  // Refresh count on mount
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Auto-flush when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (queueSize > 0) flush();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [flush, queueSize]);

  return { queueSize, syncing, enqueue, flush, clear };
}
