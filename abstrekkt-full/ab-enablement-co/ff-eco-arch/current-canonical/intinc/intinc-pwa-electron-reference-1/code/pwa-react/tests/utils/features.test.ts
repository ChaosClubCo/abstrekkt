import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectCapabilities, getSupportReport } from "../../src/utils/features";

describe("detectCapabilities", () => {
  it("returns an object with all expected keys", () => {
    const caps = detectCapabilities();
    const expectedKeys = [
      "serviceWorker", "pushManager", "notifications", "backgroundSync",
      "periodicBackgroundSync", "indexedDB", "cacheAPI", "webShare",
      "webShareFiles", "mediaSession", "badging", "persistentStorage",
      "storageEstimate", "beforeInstallPrompt", "displayModeStandalone",
    ];
    for (const key of expectedKeys) {
      expect(caps).toHaveProperty(key);
      expect(typeof (caps as Record<string, unknown>)[key]).toBe("boolean");
    }
  });
});

describe("getSupportReport", () => {
  it("returns a string with checkmarks and crosses", () => {
    const report = getSupportReport();
    expect(report).toContain("serviceWorker");
    expect(report.split("\n").length).toBeGreaterThan(10);
  });
});
