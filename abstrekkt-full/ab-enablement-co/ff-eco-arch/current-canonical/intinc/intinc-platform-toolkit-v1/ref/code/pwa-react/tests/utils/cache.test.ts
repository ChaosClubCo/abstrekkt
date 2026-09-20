import { describe, it, expect, vi, beforeEach } from "vitest";
import { pruneOldCaches, getStorageEstimate, getCacheEntryCount } from "../../src/utils/cache";

describe("cache utilities", () => {
  beforeEach(() => {
    vi.stubGlobal("caches", {
      keys: vi.fn().mockResolvedValue(["api-v1", "old-cache-v0", "images-v1"]),
      delete: vi.fn().mockResolvedValue(true),
      open: vi.fn().mockResolvedValue({
        keys: vi.fn().mockResolvedValue([{}, {}, {}]),
      }),
    });
  });

  it("pruneOldCaches deletes caches not in current version set", async () => {
    await pruneOldCaches();
    expect(caches.delete).toHaveBeenCalledWith("old-cache-v0");
    expect(caches.delete).not.toHaveBeenCalledWith("api-v1");
    expect(caches.delete).not.toHaveBeenCalledWith("images-v1");
  });

  it("getCacheEntryCount returns count of cache keys", async () => {
    const count = await getCacheEntryCount("api-v1");
    expect(count).toBe(3);
  });

  it("getStorageEstimate returns usage data", async () => {
    vi.stubGlobal("navigator", {
      storage: {
        estimate: vi.fn().mockResolvedValue({ usage: 1024, quota: 1048576 }),
      },
    });
    const estimate = await getStorageEstimate();
    expect(estimate.usage).toBe(1024);
    expect(estimate.quota).toBe(1048576);
    expect(estimate.percent).toBeCloseTo(0.0977, 2);
  });
});
