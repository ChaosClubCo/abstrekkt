import React, { useState } from "react";
import { Search } from "lucide-react";

const DOCS = [
  { id: "intro", group: "Start", title: "Introduction", body: "FlashFusion routes every prompt to the best-fit model by cost, latency, and capability. This guide covers setup, routing rules, and observability." },
  { id: "quickstart", group: "Start", title: "Quickstart", body: "Install the SDK, set your server-side API key, and point your first route at a model pool. Your app calls FlashFusion; FlashFusion calls the model." },
  { id: "routes", group: "Core", title: "Routing rules", body: "Routes match on request metadata (tags, token budget, required modality) and select from an ordered model pool with automatic fallback on error or timeout." },
  { id: "fallback", group: "Core", title: "Fallback chains", body: "Each route defines a primary model and ordered fallbacks. On 429/5xx or latency breach, traffic shifts to the next model and emits an event." },
  { id: "caching", group: "Core", title: "Prompt caching", body: "Repeated system prompts are cached at the provider where supported, cutting input cost by up to 90% on cache hits." },
  { id: "keys", group: "Security", title: "API keys", body: "Keys are stored server-side only and never shipped to the browser. Rotate from Settings → API; old keys remain valid for a 24h grace window." },
  { id: "limits", group: "Security", title: "Rate limits", body: "Per-workspace limits are enforced at the proxy. Bursts queue briefly; sustained overage returns 429 with a Retry-After header." },
];

export function Documentation() {
  const [active, setActive] = useState("intro");
  const [q, setQ] = useState("");
  const filtered = DOCS.filter((d) => (d.title + d.body).toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(filtered.map((d) => d.group))];
  const doc = DOCS.find((d) => d.id === active)!;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Documentation</h1>
          <p className="page-sub">Everything to get routing in production.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
        <div className="card card-pad" style={{ position: "sticky", top: 76 }}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: 10, color: "var(--muted-2)" }} />
            <input className="input" style={{ paddingLeft: 30 }} placeholder="Search docs" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {groups.map((g) => (
            <div key={g} style={{ marginBottom: 12 }}>
              <div className="muted" style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "4px 0 6px" }}>{g}</div>
              {filtered.filter((d) => d.group === g).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d.id)}
                  className="btn btn-ghost"
                  style={{ width: "100%", justifyContent: "flex-start", padding: "6px 8px", fontSize: "0.8rem", color: active === d.id ? "var(--text)" : "var(--muted)", background: active === d.id ? "var(--surface-2)" : "transparent" }}
                >
                  {d.title}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="card card-pad" style={{ minHeight: 360 }}>
          <span className="chip" style={{ marginBottom: 12 }}>{doc.group}</span>
          <h2 style={{ margin: "0 0 12px", fontSize: "1.25rem", letterSpacing: "-0.02em" }}>{doc.title}</h2>
          <p style={{ color: "var(--text-dim)", lineHeight: 1.7, fontSize: "0.9rem", maxWidth: "62ch" }}>{doc.body}</p>
        </div>
      </div>
    </div>
  );
}
