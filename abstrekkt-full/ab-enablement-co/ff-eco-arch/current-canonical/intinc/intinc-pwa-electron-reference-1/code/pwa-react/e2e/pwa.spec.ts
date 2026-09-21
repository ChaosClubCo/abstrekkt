import { test, expect } from "@playwright/test";

test.describe("PWA Integration", () => {
  test("serves valid manifest", async ({ page }) => {
    await page.goto("/");
    const manifest = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]');
      if (!link) return null;
      const resp = await fetch((link as HTMLLinkElement).href);
      return resp.json();
    });

    expect(manifest).toBeTruthy();
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest.start_url).toBe("/");
  });

  test("registers service worker", async ({ page }) => {
    await page.goto("/");
    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const reg = await navigator.serviceWorker.ready;
      return !!reg.active;
    });

    expect(swRegistered).toBe(true);
  });

  test("app shell loads offline", async ({ page, context }) => {
    // First visit to populate cache
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Go offline
    await context.setOffline(true);

    // Reload — should serve from cache
    await page.reload();
    const title = await page.title();
    expect(title).toBeTruthy();

    await context.setOffline(false);
  });

  test("shows offline indicator when disconnected", async ({ page, context }) => {
    await page.goto("/");
    await context.setOffline(true);
    window.dispatchEvent(new Event("offline"));

    // The OfflineIndicator component should appear
    const indicator = page.locator("[role=status]");
    await expect(indicator).toBeVisible({ timeout: 5000 });

    await context.setOffline(false);
  });
});

test.describe("Performance", () => {
  test("meets Core Web Vitals thresholds", async ({ page }) => {
    await page.goto("/");

    const metrics = await page.evaluate(() =>
      new Promise<{ lcp: number; cls: number }>((resolve) => {
        let lcp = 0;
        let cls = 0;

        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          lcp = entries[entries.length - 1]?.startTime ?? 0;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
              cls += (entry as PerformanceEntry & { value: number }).value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });

        setTimeout(() => resolve({ lcp, cls }), 3000);
      })
    );

    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1
  });
});
