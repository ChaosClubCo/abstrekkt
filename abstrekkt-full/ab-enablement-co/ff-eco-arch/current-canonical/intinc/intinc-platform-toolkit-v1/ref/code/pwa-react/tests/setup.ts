import "@testing-library/jest-dom/vitest";

// Polyfill for service worker APIs in jsdom
Object.defineProperty(navigator, "serviceWorker", {
  value: {
    register: async () => ({
      installing: null,
      waiting: null,
      active: null,
      addEventListener: () => {},
      update: async () => {},
    }),
    ready: Promise.resolve({
      pushManager: {
        subscribe: async () => ({}),
        getSubscription: async () => null,
      },
    }),
    addEventListener: () => {},
    controller: null,
  },
  writable: true,
});

// Polyfill Notification
if (typeof Notification === "undefined") {
  (globalThis as unknown as Record<string, unknown>).Notification = {
    permission: "default",
    requestPermission: async () => "default" as NotificationPermission,
  };
}
