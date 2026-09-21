import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Test validation schemas match expected input shapes
describe("Push API validation", () => {
  const subscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({ p256dh: z.string(), auth: z.string() }),
  });

  it("accepts valid subscription", () => {
    const result = subscriptionSchema.safeParse({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
      keys: { p256dh: "BExR...", auth: "aGV..." },
    });
    expect(result.success).toBe(true);
  });

  it("rejects subscription without endpoint", () => {
    const result = subscriptionSchema.safeParse({
      keys: { p256dh: "BExR...", auth: "aGV..." },
    });
    expect(result.success).toBe(false);
  });

  it("rejects subscription with invalid endpoint URL", () => {
    const result = subscriptionSchema.safeParse({
      endpoint: "not-a-url",
      keys: { p256dh: "BExR...", auth: "aGV..." },
    });
    expect(result.success).toBe(false);
  });

  it("rejects subscription without keys", () => {
    const result = subscriptionSchema.safeParse({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
    });
    expect(result.success).toBe(false);
  });
});
