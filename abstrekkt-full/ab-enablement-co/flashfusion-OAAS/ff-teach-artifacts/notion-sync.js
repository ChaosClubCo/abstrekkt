/**
 * notion-sync.js — Shared durable-mirror module for the Enablement Suite
 * ----------------------------------------------------------------------
 * WHY THIS EXISTS
 * The suite stores everything in window.storage. window.storage is:
 *   - per published-artifact, per user
 *   - PERMANENTLY DELETED on unpublish (no recovery)
 *   - invisible to the n8n automation layer
 * This module mirrors every record into a Notion database via the
 * Anthropic Messages API + Notion MCP server, so there is a durable
 * system of record that survives unpublish and that n8n can query.
 *
 * DESIGN: Strategy A — fire-and-forget mirror.
 *   1. window.storage write happens first and is authoritative.
 *   2. Notion mirror runs after, async, NON-BLOCKING.
 *   3. Failure is flagged on the record (_notionSync) — never silent —
 *      and is manually retryable. The session is never blocked on network.
 *
 * SECURITY: No Notion token anywhere. The Anthropic proxy handles auth;
 * the Notion MCP server handles its own OAuth. Zero secrets in this bundle.
 *
 * USAGE (identical in 01, 04, 05):
 *   import { getNotionConfig, setNotionConfig, mirrorToNotion,
 *            SYNC, NotionConfigPanel } from "./notion-sync";
 *   // after a successful window.storage.set(...):
 *   mirrorToNotion("intake", rec, setRecords, allRecords, "intake-records-v1");
 */

import { useState, useEffect } from "react";

/* ---- config (parameterized destination — no hardcoded DB id) ---------- */

const CFG_KEY = "enablement-notion-config-v1";

export const SYNC = {
  UNCONFIGURED: "unconfigured", // no Notion target set — storage-only
  PENDING:      "pending",      // mirror in flight
  SYNCED:       "synced",       // confirmed in Notion
  FAILED:       "failed",       // mirror failed — retryable, NOT silent
};

export async function getNotionConfig() {
  try {
    const r = await window.storage.get(CFG_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

export async function setNotionConfig(cfg) {
  // cfg = { databaseId: string, label: string }
  await window.storage.set(CFG_KEY, JSON.stringify(cfg));
  return cfg;
}

/* ---- the mirror call -------------------------------------------------- */

/**
 * Mirror one record into Notion. Non-blocking by contract: callers do NOT
 * await this for UX-critical paths. It patches the record's _notionSync
 * field in storage + state so status is always visible and recoverable.
 *
 * @param recordType  "intake" | "outcome" | "checkin"
 * @param record      the single record just written
 * @param setRecords  React setter for the records collection (array)
 * @param allRecords  current records array (already includes `record`)
 * @param storageKey  the window.storage key the collection lives under
 */
export async function mirrorToNotion(recordType, record, setRecords, allRecords, storageKey) {
  const cfg = await getNotionConfig();

  const patch = (status, extra = {}) => {
    setRecords(prev => {
      const next = prev.map(r =>
        r.id === record.id ? { ...r, _notionSync: status, ...extra } : r
      );
      window.storage.set(storageKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  if (!cfg?.databaseId) { patch(SYNC.UNCONFIGURED); return SYNC.UNCONFIGURED; }

  patch(SYNC.PENDING);

  // Build a flat, human-readable property map. Notion MCP creates the page;
  // we pass title + a JSON blob so no schema migration is ever required.
  const title = recordTitle(recordType, record);
  const payload = JSON.stringify(record, null, 2);

  const prompt =
    `Use the Notion MCP server to create ONE new page in the Notion ` +
    `database with id "${cfg.databaseId}". ` +
    `Set the page title to: ${title}\n` +
    `Add a code block containing exactly this JSON (do not alter it):\n` +
    "```json\n" + payload + "\n```\n" +
    `Also add these top-level properties if the database has matching ` +
    `columns, otherwise skip silently: ` +
    `Type="${recordType}", RecordId="${record.id}". ` +
    `Reply with exactly the word DONE on success, or ERROR: <reason> on failure.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
        mcp_servers: [
          { type: "url", url: "https://mcp.notion.com/mcp", name: "notion" },
        ],
      }),
    });

    if (!resp.ok) {
      const e = await resp.json().catch(() => ({}));
      throw new Error(e.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join(" ")
      .trim();

    if (/(^|\b)DONE(\b|$)/.test(text) && !/ERROR:/i.test(text)) {
      patch(SYNC.SYNCED, { _notionSyncedAt: new Date().toISOString() });
      return SYNC.SYNCED;
    }
    throw new Error(text.slice(0, 160) || "Notion MCP returned no confirmation");
  } catch (err) {
    patch(SYNC.FAILED, { _notionError: String(err.message || err).slice(0, 200) });
    return SYNC.FAILED;
  }
}

/** Retry every record not yet confirmed in Notion. */
export async function retryUnsynced(recordType, setRecords, allRecords, storageKey) {
  const pending = allRecords.filter(
    r => r._notionSync !== SYNC.SYNCED
  );
  for (const r of pending) {
    // sequential on purpose — avoids hammering the MCP server in parallel
    // eslint-disable-next-line no-await-in-loop
    await mirrorToNotion(recordType, r, setRecords, allRecords, storageKey);
  }
}

function recordTitle(type, r) {
  if (type === "intake")  return `Intake — ${r.name || "Unknown"} (${r.role || "?"})`;
  if (type === "outcome") return `Outcome — ${r.employeeName || r.name || "Unknown"}`;
  if (type === "checkin") return `Check-in — ${r.employeeName || r.name || "Unknown"} ${r.weekLabel || ""}`.trim();
  return `Record ${r.id}`;
}

/* ---- drop-in config + status UI -------------------------------------- */

const UI = {
  navy: "#0E2841", primary: "#156082", muted: "#64748b",
  border: "#e2e8f0", red: "#dc2626", green: "#15803d", amber: "#b45309",
};

/** One-time Notion destination config. Render near the top of each tool. */
export function NotionConfigPanel() {
  const [cfg, setCfg]   = useState(null);
  const [dbId, setDbId] = useState("");
  const [lbl, setLbl]   = useState("");
  const [open, setOpen] = useState(false);
  const [msg, setMsg]   = useState("");

  useEffect(() => { getNotionConfig().then(c => { if (c) { setCfg(c); setDbId(c.databaseId); setLbl(c.label || ""); } }); }, []);

  async function save() {
    const id = dbId.trim();
    if (!id) { setMsg("Database ID required"); return; }
    const saved = await setNotionConfig({ databaseId: id, label: lbl.trim() });
    setCfg(saved); setOpen(false); setMsg("");
  }

  const configured = !!cfg?.databaseId;

  return (
    <div style={{
      background: configured ? "#f0fdf4" : "#fffbeb",
      border: `1px solid ${configured ? UI.green : UI.amber}`,
      borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 700, color: configured ? UI.green : UI.amber }}>
          {configured ? "● Durable mirror ON" : "▲ Storage-only — no backup"}
        </span>
        <span style={{ color: UI.muted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {configured ? (cfg.label || cfg.databaseId) : "Records lost if this artifact is unpublished"}
        </span>
        <button onClick={() => setOpen(o => !o)} style={{
          padding: "3px 9px", borderRadius: 4, border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 600, color: "#fff",
          background: configured ? UI.primary : UI.amber,
        }}>
          {configured ? "Change" : "Configure Notion"}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            value={dbId} onChange={e => setDbId(e.target.value)}
            placeholder="Notion database ID (32-char id from the DB URL)"
            style={{ padding: "6px 9px", borderRadius: 4, border: `1px solid ${UI.border}`, fontSize: 12, fontFamily: "system-ui" }}
          />
          <input
            value={lbl} onChange={e => setLbl(e.target.value)}
            placeholder="Label (optional, e.g. 'INT Enablement DB')"
            style={{ padding: "6px 9px", borderRadius: 4, border: `1px solid ${UI.border}`, fontSize: 12, fontFamily: "system-ui" }}
          />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={save} style={{ padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#fff", background: UI.green }}>Save</button>
            {msg && <span style={{ color: UI.red, fontSize: 11 }}>{msg}</span>}
            <span style={{ color: UI.muted, fontSize: 11 }}>
              The Notion connector must be enabled in this Claude account.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Tiny per-record status badge. Render in list rows. */
export function SyncBadge({ status }) {
  const map = {
    [SYNC.SYNCED]:       { t: "✓ Notion",  c: UI.green },
    [SYNC.PENDING]:      { t: "⟳ syncing", c: UI.primary },
    [SYNC.FAILED]:       { t: "⚠ unsynced", c: UI.red },
    [SYNC.UNCONFIGURED]: { t: "○ local",   c: UI.muted },
  };
  const s = map[status] || map[SYNC.UNCONFIGURED];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: s.c, padding: "1px 6px", borderRadius: 3, border: `1px solid ${s.c}33`, whiteSpace: "nowrap" }}>
      {s.t}
    </span>
  );
}
