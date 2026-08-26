import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "intinc-app";
const DB_VERSION = 1;

interface StoreSchema {
  keyValue: { key: string; value: unknown; updatedAt: number };
  syncQueue: { id: string; payload: unknown; createdAt: number };
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("keyValue")) {
          db.createObjectStore("keyValue", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("syncQueue")) {
          const store = db.createObjectStore("syncQueue", { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}

/** Generic key-value store backed by IndexedDB */
export const kvStore = {
  async get<T>(key: string): Promise<T | undefined> {
    const db = await getDB();
    const entry = await db.get("keyValue", key);
    return entry?.value as T | undefined;
  },

  async set<T>(key: string, value: T): Promise<void> {
    const db = await getDB();
    await db.put("keyValue", { key, value, updatedAt: Date.now() });
  },

  async delete(key: string): Promise<void> {
    const db = await getDB();
    await db.delete("keyValue", key);
  },

  async keys(): Promise<string[]> {
    const db = await getDB();
    return db.getAllKeys("keyValue") as Promise<string[]>;
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear("keyValue");
  },
};
