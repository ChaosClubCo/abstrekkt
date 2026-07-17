import { useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

// ── Sample data (paste your audit-results.json or use the import prompt) ──
const SAMPLE_DATA = [
  { name: "crm-dashboard", origin: "lovable", framework: "react", language: "typescript", bundler: "vite", pwa: 45, electron: 68, tauri: 52, quality: 60, security: 35, testing: 15, production: 42, overall: 48, target: "electron", effort: "moderate", pwaH: 32, electronH: 48, tauriH: 60, files: 87, deps: 34, loc: 12400 },
  { name: "inv-tracker", origin: "base44", framework: "react", language: "javascript", bundler: "webpack", pwa: 22, electron: 38, tauri: 25, quality: 28, security: 18, testing: 5, production: 20, overall: 24, target: "pwa", effort: "heavy", pwaH: 60, electronH: 80, tauriH: 95, files: 42, deps: 52, loc: 6800 },
  { name: "client-portal", origin: "bolt", framework: "next", language: "typescript", bundler: "vite", pwa: 72, electron: 75, tauri: 60, quality: 78, security: 65, testing: 45, production: 68, overall: 68, target: "electron", effort: "light", pwaH: 16, electronH: 24, tauriH: 40, files: 156, deps: 28, loc: 22100 },
  { name: "form-builder", origin: "v0", framework: "react", language: "typescript", bundler: "vite", pwa: 58, electron: 62, tauri: 55, quality: 65, security: 45, testing: 30, production: 52, overall: 54, target: "electron", effort: "moderate", pwaH: 28, electronH: 36, tauriH: 52, files: 68, deps: 22, loc: 9200 },
  { name: "analytics-dash", origin: "lovable", framework: "react", language: "typescript", bundler: "vite", pwa: 80, electron: 55, tauri: 48, quality: 72, security: 58, testing: 40, production: 65, overall: 62, target: "pwa", effort: "light", pwaH: 12, electronH: 32, tauriH: 48, files: 94, deps: 30, loc: 14800 },
  { name: "doc-editor", origin: "bolt", framework: "react", language: "typescript", bundler: "vite", pwa: 35, electron: 82, tauri: 70, quality: 70, security: 55, testing: 35, production: 58, overall: 60, target: "electron", effort: "moderate", pwaH: 40, electronH: 28, tauriH: 36, files: 120, deps: 36, loc: 18500 },
  { name: "email-templates", origin: "replit", framework: "vue", language: "javascript", bundler: "webpack", pwa: 15, electron: 20, tauri: 12, quality: 18, security: 10, testing: 0, production: 12, overall: 14, target: "discontinue", effort: "rebuild", pwaH: 80, electronH: 100, tauriH: 120, files: 18, deps: 45, loc: 2200 },
  { name: "schedule-mgr", origin: "base44", framework: "react", language: "javascript", bundler: "none", pwa: 28, electron: 32, tauri: 20, quality: 22, security: 15, testing: 8, production: 18, overall: 22, target: "pwa", effort: "heavy", pwaH: 55, electronH: 72, tauriH: 88, files: 35, deps: 48, loc: 5400 },
  { name: "intinc-os-shell", origin: "manual", framework: "next", language: "typescript", bundler: "vite", pwa: 65, electron: 88, tauri: 75, quality: 85, security: 78, testing: 62, production: 80, overall: 78, target: "electron", effort: "light", pwaH: 20, electronH: 16, tauriH: 28, files: 245, deps: 25, loc: 35200 },
  { name: "onboarding-wiz", origin: "lovable", framework: "react", language: "typescript", bundler: "vite", pwa: 70, electron: 48, tauri: 42, quality: 55, security: 40, testing: 20, production: 45, overall: 48, target: "pwa", effort: "moderate", pwaH: 24, electronH: 40, tauriH: 55, files: 52, deps: 18, loc: 7600 },
  { name: "ticket-system", origin: "bolt", framework: "react", language: "typescript", bundler: "vite", pwa: 55, electron: 70, tauri: 58, quality: 68, security: 52, testing: 38, production: 58, overall: 58, target: "electron", effort: "moderate", pwaH: 30, electronH: 32, tauriH: 44, files: 110, deps: 32, loc: 16200 },
  { name: "pos-terminal", origin: "manual", framework: "react", language: "typescript", bundler: "vite", pwa: 40, electron: 90, tauri: 82, quality: 82, security: 75, testing: 55, production: 76, overall: 74, target: "electron", effort: "trivial", pwaH: 35, electronH: 12, tauriH: 20, files: 188, deps: 20, loc: 28400 },
];

const COLORS = {
  pwa: "#3B82F6", electron: "#A855F7", tauri: "#F59E0B",
  "keep-web": "#10B981", discontinue: "#EF4444",
  low: "#10B981", medium: "#F59E0B", high: "#EF4444", critical: "#7C2D12",
  trivial: "#10B981", light: "#34D399", moderate: "#FBBF24", heavy: "#F97316", rebuild: "#EF4444",
  bg: "#0B1120", card: "#111827", border: "#1E293B", text: "#E2E8F0", dim: "#64748B",
  accent: "#38BDF8", accent2: "#818CF8",
};

const PIE_COLORS = ["#3B82F6", "#A855F7", "#F59E0B", "#10B981", "#EF4444", "#EC4899"];

export default function AuditDashboard() {
  const [data, setData] = useState(SAMPLE_DATA);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ target: "all", origin: "all", effort: "all" });
  const [sortBy, setSortBy] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");
  const [view, setView] = useState("overview");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filter.target !== "all") items = items.filter(d => d.target === filter.target);
    if (filter.origin !== "all") items = items.filter(d => d.origin === filter.origin);
    if (filter.effort !== "all") items = items.filter(d => d.effort === filter.effort);
    items.sort((a, b) => {
      const av = a[sortBy] ?? 0, bv = b[sortBy] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return items;
  }, [data, filter, sortBy, sortDir]);

  const stats = useMemo(() => {
    const t = data.length;
    const targets = {};
    const efforts = {};
    const origins = {};
    data.forEach(d => {
      targets[d.target] = (targets[d.target] || 0) + 1;
      efforts[d.effort] = (efforts[d.effort] || 0) + 1;
      origins[d.origin] = (origins[d.origin] || 0) + 1;
    });
    const avgOverall = Math.round(data.reduce((s, d) => s + d.overall, 0) / t);
    const totalPWAH = data.reduce((s, d) => s + d.pwaH, 0);
    const totalElH = data.reduce((s, d) => s + d.electronH, 0);
    return { total: t, targets, efforts, origins, avgOverall, totalPWAH, totalElH };
  }, [data]);

  const handleImport = useCallback(() => {
    try {
      const parsed = JSON.parse(importText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const mapped = items.map(r => ({
        name: r.name, origin: r.origin,
        framework: r.detectedStack?.framework || r.framework || "unknown",
        language: r.detectedStack?.language || r.language || "unknown",
        bundler: r.detectedStack?.bundler || r.bundler || "none",
        pwa: r.scores?.pwaReadiness ?? r.pwa ?? 0,
        electron: r.scores?.electronReadiness ?? r.electron ?? 0,
        tauri: r.scores?.tauriReadiness ?? r.tauri ?? 0,
        quality: r.scores?.codeQuality ?? r.quality ?? 0,
        security: r.scores?.securityPosture ?? r.security ?? 0,
        testing: r.scores?.testCoverage ?? r.testing ?? 0,
        production: r.scores?.productionReadiness ?? r.production ?? 0,
        overall: r.scores?.overall ?? r.overall ?? 0,
        target: r.recommendation?.primary ?? r.target ?? "unknown",
        effort: r.effort?.tier ?? r.effort ?? "unknown",
        pwaH: r.effort?.pwaHours ?? r.pwaH ?? 0,
        electronH: r.effort?.electronHours ?? r.electronH ?? 0,
        tauriH: r.effort?.tauriHours ?? r.tauriH ?? 0,
        files: r.detectedStack?.fileCount ?? r.files ?? 0,
        deps: r.detectedStack?.depCount ?? r.deps ?? 0,
        loc: r.detectedStack?.locEstimate ?? r.loc ?? 0,
      }));
      setData(mapped);
      setShowImport(false);
      setImportText("");
    } catch (e) { alert("Invalid JSON — paste your audit-results.json content"); }
  }, [importText]);

  const ScoreBar = ({ value, max = 100, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 120, height: 6, background: COLORS.border, borderRadius: 3 }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color || (value >= 70 ? "#10B981" : value >= 40 ? "#FBBF24" : "#EF4444"), borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 12, color: COLORS.dim, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );

  const Chip = ({ label, color, onClick, active }) => (
    <button onClick={onClick} style={{
      padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: active ? (color || COLORS.accent) : "transparent",
      color: active ? "#fff" : COLORS.dim,
      border: `1px solid ${active ? "transparent" : COLORS.border}`,
      cursor: "pointer", transition: "all 0.15s",
    }}>{label}</button>
  );

  const targetPieData = Object.entries(stats.targets).map(([name, value], i) => ({ name, value, fill: PIE_COLORS[i % PIE_COLORS.length] }));
  const effortPieData = Object.entries(stats.efforts).map(([name, value]) => ({ name, value, fill: COLORS[name] || COLORS.dim }));

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", margin: 0, background: "linear-gradient(135deg, #38BDF8, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            INT App Audit Dashboard
          </h1>
          <p style={{ fontSize: 12, color: COLORS.dim, margin: "4px 0 0" }}>{stats.total} apps scanned · avg {stats.avgOverall}/100</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["overview", "table", "compare"].map(v => (
            <Chip key={v} label={v.toUpperCase()} active={view === v} color={COLORS.accent} onClick={() => { setView(v); setSelected(null); }} />
          ))}
          <Chip label="IMPORT" active={showImport} color="#F59E0B" onClick={() => setShowImport(!showImport)} />
        </div>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: COLORS.dim, margin: "0 0 8px" }}>Paste your audit-results.json from the CLI tool:</p>
          <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder='[{"name":"my-app","scores":{"pwaReadiness":45,...},...}]'
            style={{ width: "100%", height: 100, background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 8, fontFamily: "inherit", fontSize: 11, resize: "vertical" }} />
          <button onClick={handleImport} style={{ marginTop: 8, padding: "6px 16px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Load Data</button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Apps", value: stats.total, sub: "scanned" },
          { label: "Avg Score", value: `${stats.avgOverall}/100`, sub: "overall" },
          { label: "PWA Candidates", value: stats.targets["pwa"] || 0, sub: "recommended" },
          { label: "Electron Candidates", value: stats.targets["electron"] || 0, sub: "recommended" },
          { label: "Total Effort", value: `${Math.round(stats.totalPWAH)}h`, sub: "PWA path" },
        ].map((s, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent, margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: COLORS.dim }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.dim, marginRight: 4 }}>TARGET:</span>
          {["all", "pwa", "electron", "tauri", "keep-web", "discontinue"].map(t => (
            <Chip key={t} label={t} active={filter.target === t} color={COLORS[t] || COLORS.accent} onClick={() => setFilter(f => ({ ...f, target: t }))} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.dim, marginRight: 4 }}>EFFORT:</span>
          {["all", "trivial", "light", "moderate", "heavy", "rebuild"].map(t => (
            <Chip key={t} label={t} active={filter.effort === t} color={COLORS[t] || COLORS.accent} onClick={() => setFilter(f => ({ ...f, effort: t }))} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.dim, marginRight: 4 }}>ORIGIN:</span>
          {["all", ...Object.keys(stats.origins)].map(t => (
            <Chip key={t} label={t} active={filter.origin === t} onClick={() => setFilter(f => ({ ...f, origin: t }))} />
          ))}
        </div>
      </div>

      {/* Views */}
      {view === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Score Distribution Bar Chart */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px", color: COLORS.accent }}>Score Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filtered} onClick={(e) => e?.activePayload && setSelected(e.activePayload[0].payload)}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: COLORS.dim }} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: COLORS.dim }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="pwa" fill={COLORS.pwa} name="PWA" radius={[2, 2, 0, 0]} />
                <Bar dataKey="electron" fill={COLORS.electron} name="Electron" radius={[2, 2, 0, 0]} />
                <Bar dataKey="tauri" fill={COLORS.tauri} name="Tauri" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Target Recommendation Pie */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px", color: COLORS.accent }}>Recommendation Split</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={targetPieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: COLORS.dim }} style={{ fontSize: 10 }}>
                  {targetPieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Effort vs Quality Scatter */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px", color: COLORS.accent }}>Quality vs Effort</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <XAxis dataKey="quality" name="Quality" tick={{ fontSize: 10, fill: COLORS.dim }} label={{ value: "Quality Score", position: "bottom", fontSize: 10, fill: COLORS.dim }} />
                <YAxis dataKey="electronH" name="Electron Hours" tick={{ fontSize: 10, fill: COLORS.dim }} label={{ value: "Electron Hours", angle: -90, position: "left", fontSize: 10, fill: COLORS.dim }} />
                <ZAxis dataKey="loc" range={[40, 400]} name="LOC" />
                <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11 }}
                  formatter={(val, name) => [val, name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""} />
                <Scatter data={filtered} fill={COLORS.accent2} opacity={0.8} onClick={(e) => setSelected(e)} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Effort Pie */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px", color: COLORS.accent }}>Effort Tiers</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={effortPieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: COLORS.dim }} style={{ fontSize: 10 }}>
                  {effortPieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "table" && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {[
                  { key: "name", label: "App" }, { key: "origin", label: "Origin" },
                  { key: "overall", label: "Overall" }, { key: "pwa", label: "PWA" },
                  { key: "electron", label: "Electron" }, { key: "tauri", label: "Tauri" },
                  { key: "quality", label: "Quality" }, { key: "security", label: "Security" },
                  { key: "target", label: "Target" }, { key: "effort", label: "Effort" },
                  { key: "pwaH", label: "PWA hrs" }, { key: "electronH", label: "El hrs" },
                ].map(col => (
                  <th key={col.key} onClick={() => { setSortBy(col.key); setSortDir(d => d === "desc" ? "asc" : "desc"); }}
                    style={{ padding: "10px 8px", textAlign: "left", color: sortBy === col.key ? COLORS.accent : COLORS.dim, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", fontWeight: 600, letterSpacing: "0.3px" }}>
                    {col.label} {sortBy === col.key ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} onClick={() => setSelected(d)} style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", background: selected?.name === d.name ? `${COLORS.accent}15` : "transparent" }}>
                  <td style={{ padding: "8px", fontWeight: 600, color: COLORS.text }}>{d.name}</td>
                  <td style={{ padding: "8px", color: COLORS.dim }}>{d.origin}</td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.overall} /></td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.pwa} color={COLORS.pwa} /></td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.electron} color={COLORS.electron} /></td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.tauri} color={COLORS.tauri} /></td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.quality} /></td>
                  <td style={{ padding: "8px" }}><ScoreBar value={d.security} /></td>
                  <td style={{ padding: "8px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${COLORS[d.target] || COLORS.dim}25`, color: COLORS[d.target] || COLORS.dim }}>{d.target}</span></td>
                  <td style={{ padding: "8px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${COLORS[d.effort] || COLORS.dim}25`, color: COLORS[d.effort] || COLORS.dim }}>{d.effort}</span></td>
                  <td style={{ padding: "8px", fontVariantNumeric: "tabular-nums" }}>{d.pwaH}h</td>
                  <td style={{ padding: "8px", fontVariantNumeric: "tabular-nums" }}>{d.electronH}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "compare" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map((d, i) => (
            <div key={i} onClick={() => setSelected(d)} style={{
              background: selected?.name === d.name ? `${COLORS.accent}12` : COLORS.card,
              border: `1px solid ${selected?.name === d.name ? COLORS.accent : COLORS.border}`,
              borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.15s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{d.name}</h4>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${COLORS[d.target] || COLORS.dim}25`, color: COLORS[d.target] || COLORS.dim }}>{d.target}</span>
              </div>
              <div style={{ fontSize: 10, color: COLORS.dim, marginBottom: 8 }}>{d.origin} · {d.framework} · {d.language}</div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={[
                  { axis: "PWA", val: d.pwa }, { axis: "Electron", val: d.electron },
                  { axis: "Tauri", val: d.tauri }, { axis: "Quality", val: d.quality },
                  { axis: "Security", val: d.security }, { axis: "Testing", val: d.testing },
                ]}>
                  <PolarGrid stroke={COLORS.border} />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: COLORS.dim }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="val" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 10 }}>
                <div><span style={{ color: COLORS.dim }}>Overall:</span> <span style={{ fontWeight: 700 }}>{d.overall}</span></div>
                <div><span style={{ color: COLORS.dim }}>Effort:</span> <span style={{ fontWeight: 700, color: COLORS[d.effort] }}>{d.effort}</span></div>
                <div><span style={{ color: COLORS.dim }}>PWA hrs:</span> {d.pwaH}h</div>
                <div><span style={{ color: COLORS.dim }}>El hrs:</span> {d.electronH}h</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}40`, borderRadius: 10, padding: 20, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.accent }}>{selected.name}</h3>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.dim, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>✕ Close</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 11, color: COLORS.dim, margin: "0 0 8px", textTransform: "uppercase" }}>Stack</h4>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div>Framework: <strong>{selected.framework}</strong></div>
                <div>Language: <strong>{selected.language}</strong></div>
                <div>Bundler: <strong>{selected.bundler}</strong></div>
                <div>Origin: <strong>{selected.origin}</strong></div>
                <div>Files: <strong>{selected.files}</strong> · Deps: <strong>{selected.deps}</strong></div>
                <div>~LOC: <strong>{selected.loc?.toLocaleString()}</strong></div>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 11, color: COLORS.dim, margin: "0 0 8px", textTransform: "uppercase" }}>Scores</h4>
              {[
                { label: "PWA", value: selected.pwa, color: COLORS.pwa },
                { label: "Electron", value: selected.electron, color: COLORS.electron },
                { label: "Tauri", value: selected.tauri, color: COLORS.tauri },
                { label: "Quality", value: selected.quality },
                { label: "Security", value: selected.security },
                { label: "Testing", value: selected.testing },
                { label: "Production", value: selected.production },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: COLORS.dim }}>{s.label}</span>
                  <ScoreBar value={s.value} color={s.color} />
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, color: COLORS.dim, margin: "0 0 8px", textTransform: "uppercase" }}>Conversion</h4>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div>Target: <strong style={{ color: COLORS[selected.target] }}>{selected.target?.toUpperCase()}</strong></div>
                <div>Effort: <strong style={{ color: COLORS[selected.effort] }}>{selected.effort}</strong></div>
                <div>PWA path: <strong>{selected.pwaH}h</strong></div>
                <div>Electron path: <strong>{selected.electronH}h</strong></div>
                <div>Tauri path: <strong>{selected.tauriH}h</strong></div>
                <div style={{ marginTop: 8, padding: "8px 10px", background: `${COLORS.accent}10`, borderRadius: 6, fontSize: 11, lineHeight: 1.6 }}>
                  Overall score <strong>{selected.overall}/100</strong>. {selected.overall >= 70 ? "Ready for conversion." : selected.overall >= 40 ? "Needs prep work before conversion." : "Major refactoring needed or consider discontinuing."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
