import { Router } from "express";
import webPush from "web-push";
import { z } from "zod";
import { db } from "../lib/db.js";
import { logger } from "../lib/logger.js";

const router = Router();

// ── VAPID Configuration ──
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_EMAIL = process.env.VAPID_EMAIL ?? "mailto:admin@intinc.com";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

// ── Schemas ──
const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  expirationTime: z.number().nullable().optional(),
});

const notificationSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(500),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  tag: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  actions: z.array(z.object({
    action: z.string(),
    title: z.string(),
  })).optional(),
});

// ── Subscribe ──
router.post("/subscribe", (req, res) => {
  const result = subscriptionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const sub = result.data;
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO subscriptions (endpoint, keys_p256dh, keys_auth, created_at)
     VALUES (?, ?, ?, datetime('now'))`
  );
  stmt.run(sub.endpoint, sub.keys.p256dh, sub.keys.auth);

  logger.info({ endpoint: sub.endpoint.slice(0, 50) }, "Subscription saved");
  res.json({ ok: true });
});

// ── Unsubscribe ──
router.post("/unsubscribe", (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ error: "endpoint required" });

  const stmt = db.prepare("DELETE FROM subscriptions WHERE endpoint = ?");
  const result = stmt.run(endpoint);

  logger.info({ endpoint: endpoint.slice(0, 50), deleted: result.changes }, "Unsubscribed");
  res.json({ ok: true, deleted: result.changes });
});

// ── Send to all subscribers ──
router.post("/send", async (req, res) => {
  const result = notificationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const payload = JSON.stringify(result.data);
  const subs = db.prepare("SELECT endpoint, keys_p256dh, keys_auth FROM subscriptions").all() as Array<{
    endpoint: string;
    keys_p256dh: string;
    keys_auth: string;
  }>;

  let sent = 0;
  let failed = 0;
  const staleEndpoints: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
          },
          payload,
          { TTL: 86400, urgency: "normal" }
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleEndpoints.push(sub.endpoint);
        }
        logger.warn({ endpoint: sub.endpoint.slice(0, 50), statusCode }, "Push delivery failed");
      }
    })
  );

  // Clean up stale subscriptions
  if (staleEndpoints.length > 0) {
    const del = db.prepare("DELETE FROM subscriptions WHERE endpoint = ?");
    for (const ep of staleEndpoints) del.run(ep);
    logger.info({ count: staleEndpoints.length }, "Pruned stale subscriptions");
  }

  logger.info({ sent, failed, pruned: staleEndpoints.length }, "Push broadcast complete");
  res.json({ sent, failed, pruned: staleEndpoints.length });
});

// ── Stats ──
router.get("/stats", (_req, res) => {
  const count = (db.prepare("SELECT COUNT(*) as count FROM subscriptions").get() as { count: number }).count;
  res.json({ subscribers: count });
});

export { router as pushRouter };
