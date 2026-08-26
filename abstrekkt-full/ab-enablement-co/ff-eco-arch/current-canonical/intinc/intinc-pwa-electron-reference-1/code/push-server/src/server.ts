import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pushRouter } from "./routes/push.js";
import { logger } from "./lib/logger.js";
import { initDB } from "./lib/db.js";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

// ── Security ──
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") ?? "*" }));
app.use(express.json({ limit: "10kb" }));

// ── Routes ──
app.use("/api/push", pushRouter);

// ── Health check ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Init & Start ──
initDB();

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Push server started");
});

export { app };
