/**
 * IndexedDB-backed offline mutation queue.
 * Queue failed requests when offline, replay when connectivity returns.
 *
 * @example
 * ```ts
 * const queue = new OfflineQueue("my-app-queue");
 * await queue.init();
 *
 * // In your fetch wrapper:
 * try {
 *   await fetch(url, init);
 * } catch {
 *   await queue.enqueue({ url, method: init.method, body: init.body });
 * }
 *
 * // Auto-flush on reconnect
 * window.addEventListener("online", () => queue.flush());
 * ```
 */

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
  retries: number;
}

export class OfflineQueue {
  private db: IDBDatabase | null = null;
  private readonly storeName = "requests";

  constructor(
    private readonly dbName: string,
    private readonly maxRetries = 5
  ) {}

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" });
          store.createIndex("timestamp", "timestamp");
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async enqueue(req: Omit<QueuedRequest, "id" | "timestamp" | "retries">): Promise<string> {
    const entry: QueuedRequest = {
      ...req,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
    };

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).put(entry);
      tx.oncomplete = () => resolve(entry.id);
      tx.onerror = () => reject(tx.error);
    });
  }

  async flush(): Promise<{ succeeded: number; failed: number; dropped: number }> {
    const entries = await this.getAll();
    let succeeded = 0, failed = 0, dropped = 0;

    for (const entry of entries) {
      try {
        const resp = await fetch(entry.url, {
          method: entry.method,
          headers: entry.headers,
          body: entry.method !== "GET" ? entry.body : undefined,
        });

        if (resp.ok) {
          await this.delete(entry.id);
          succeeded++;
        } else if (entry.retries >= this.maxRetries) {
          await this.delete(entry.id);
          dropped++;
        } else {
          await this.incrementRetry(entry);
          failed++;
        }
      } catch {
        // Still offline — stop flushing
        failed++;
        break;
      }
    }

    return { succeeded, failed, dropped };
  }

  async count(): Promise<number> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readonly");
      const req = tx.objectStore(this.storeName).count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async getAll(): Promise<QueuedRequest[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readonly");
      const req = tx.objectStore(this.storeName).index("timestamp").getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async incrementRetry(entry: QueuedRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).put({ ...entry, retries: entry.retries + 1 });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
