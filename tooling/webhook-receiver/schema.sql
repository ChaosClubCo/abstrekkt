CREATE TABLE IF NOT EXISTS deliveries (
  delivery_id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_name TEXT NOT NULL DEFAULT '',
  payload_sha256 TEXT NOT NULL CHECK (length(payload_sha256) = 64)
);
