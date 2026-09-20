import { useState, useCallback } from "react";

const COLORS = {
  bg: "#0F172A", card: "#1E293B", border: "#334155", text: "#E2E8F0", dim: "#94A3B8",
  accent: "#3B82F6", accent2: "#818CF8", green: "#10B981", amber: "#F59E0B", red: "#EF4444",
};

const PHASES = [
  { id: "V", name: "Vision", color: "#8B5CF6", gate: "Overall ≥ 30", weeks: "Week 1" },
  { id: "I", name: "Integration", color: "#6366F1", gate: "Security ≥ 40", weeks: "Week 1-2" },
  { id: "S", name: "Stack", color: "#3B82F6", gate: "Quality ≥ 50", weeks: "Week 2" },
  { id: "T", name: "Testing", color: "#06B6D4", gate: "Testing ≥ 40", weeks: "Week 2-3" },
  { id: "A", name: "AI Impl", color: "#14B8A6", gate: "Production ≥ 50", weeks: "Week 3" },
  { id: "D", name: "Deployment", color: "#10B981", gate: "Target ≥ 60", weeks: "Week 3-4" },
  { id: "E", name: "Evolution", color: "#84CC16", gate: "All ≥ 60 avg", weeks: "Ongoing" },
  { id: "L", name: "Launch", color: "#EAB308", gate: "Overall ≥ 70", weeks: "Week 4" },
];

const TRACKS = [
  {
    id: "foundations",
    title: "Track 1: Foundations",
    subtitle: "Environment, tools, and first audit",
    duration: "Days 1-3",
    modules: [
      { id: "f1", title: "Environment Setup", description: "Install Node 20+, pnpm 9+, clone monorepo, build all packages", est: "1h", type: "hands-on",
        checklist: ["Node.js 20+ installed", "pnpm 9+ installed", "Monorepo cloned and built", "intinc-audit runs successfully", "intinc-scaffold list works", "GitHub token configured", "VS Code extensions installed"] },
      { id: "f2", title: "Reference Library Walkthrough", description: "Read core documentation: decision framework, platform comparison, SW deep dive, security hardening", est: "2h", type: "reading",
        checklist: ["Read 02-pwa-decision-framework.md", "Read 04-native-vs-pwa-vs-electron.md", "Read 07-service-worker-deep-dive.md", "Read 10-security-hardening.md", "Can explain PWA vs Electron trade-offs"] },
      { id: "f3", title: "First Batch Audit", description: "Scan the entire org, generate report, identify patterns", est: "1.5h", type: "hands-on",
        checklist: ["Ran intinc-audit batch --org intinc", "Generated markdown report", "Loaded results into dashboard", "Identified top 5 highest-scoring apps", "Identified apps to discontinue", "Noted most common quality gaps"] },
    ]
  },
  {
    id: "scaffolding",
    title: "Track 2: Scaffolding & Templates",
    subtitle: "Create projects from production templates",
    duration: "Days 3-5",
    modules: [
      { id: "s1", title: "PWA React Scaffold", description: "Create a PWA project, explore generated code, understand service worker lifecycle", est: "1.5h", type: "hands-on",
        checklist: ["Scaffolded pwa-react project", "Dev server running on localhost", "Explored SW code in src/workers/sw.ts", "Tested offline mode in DevTools", "Understand cache strategies (CacheFirst, NetworkFirst, SWR)", "Install prompt working"] },
      { id: "s2", title: "Electron React Scaffold", description: "Create an Electron app, explore IPC bridge, understand security boundaries", est: "1.5h", type: "hands-on",
        checklist: ["Scaffolded electron-react project", "Electron window opens", "IPC bridge working (version, platform)", "Understand contextIsolation + sandbox", "CSP headers configured", "Auto-updater configured"] },
      { id: "s3", title: "Addons Deep Dive", description: "Add Supabase, Stripe, Sentry, PostHog to a scaffolded project", est: "2h", type: "hands-on",
        checklist: ["Added Supabase addon — auth hook working", "Added Sentry — ErrorBoundary catches errors", "Added PostHog — events tracked", "Understand .env.example / .env.local pattern", "RLS migration file reviewed"] },
    ]
  },
  {
    id: "conversion",
    title: "Track 3: App Conversion",
    subtitle: "Convert a vibecoded app to production grade",
    duration: "Week 2",
    modules: [
      { id: "c1", title: "Assess & Plan", description: "Audit a specific vibecoded app, review scores, plan conversion", est: "1h", type: "planning",
        checklist: ["Selected app from audit (score 40-60)", "Ran detailed scan on selected app", "Documented current stack + gaps", "Chose conversion target (PWA/Electron/Tauri)", "Created conversion plan with effort estimate"] },
      { id: "c2", title: "Scaffold & Migrate", description: "Create fresh project, migrate business logic, add missing features", est: "4h", type: "hands-on",
        checklist: ["Scaffolded replacement project", "Copied business logic from original", "Added service worker / IPC bridge", "Wired up Supabase auth + RLS", "Added Sentry error tracking", "All TypeScript errors resolved"] },
      { id: "c3", title: "Test & Verify", description: "Add tests, verify quality gates, run final audit", est: "3h", type: "hands-on",
        checklist: ["Unit tests for all hooks (70%+ coverage)", "E2E test for critical user flow", "CI pipeline green", "Final audit: overall ≥ 70", "Security checklist completed", "Deployed to staging"] },
    ]
  },
  {
    id: "advanced",
    title: "Track 4: Advanced Topics",
    subtitle: "Architecture, security, and team patterns",
    duration: "Week 3-4",
    modules: [
      { id: "a1", title: "Security Hardening", description: "OWASP compliance, RLS patterns, Electron security, CSP configuration", est: "2h", type: "reading",
        checklist: ["Read OWASP Top 10 mapping in docs", "Reviewed Electron security checklist", "Understand CSP header configuration", "Can write RLS policies for multi-tenant", "Know IPC security patterns (invoke/handle only)"] },
      { id: "a2", title: "VISTADEL Phase Gates", description: "Understand each phase gate, know which tools map to which phases", est: "1h", type: "reading",
        checklist: ["Read VISTADEL integration guide", "Can map any tool to its VISTADEL phase", "Understand gate thresholds and blockers", "Know the re-audit cycle for Evolution phase"] },
      { id: "a3", title: "Tauri Alternative", description: "When Tauri beats Electron, Rust basics, Tauri 2.0 plugin system", est: "2h", type: "hands-on",
        checklist: ["Scaffolded tauri-react project", "Tauri dev window opens", "Called Rust function from React (greet command)", "Understand binary size advantage (40MB vs 200MB)", "Know when to choose Tauri over Electron"] },
    ]
  },
];

export default function TrainingCurriculum() {
  const [progress, setProgress] = useState(() => {
    const saved = {};
    TRACKS.forEach(t => t.modules.forEach(m => { saved[m.id] = m.checklist.map(() => false); }));
    return saved;
  });
  const [expandedModule, setExpandedModule] = useState(null);
  const [view, setView] = useState("curriculum");

  const toggleCheck = useCallback((moduleId, idx) => {
    setProgress(p => {
      const next = { ...p, [moduleId]: [...p[moduleId]] };
      next[moduleId][idx] = !next[moduleId][idx];
      return next;
    });
  }, []);

  const getModuleProgress = (moduleId) => {
    const checks = progress[moduleId] || [];
    const done = checks.filter(Boolean).length;
    return { done, total: checks.length, pct: checks.length ? Math.round(done / checks.length * 100) : 0 };
  };

  const getTrackProgress = (track) => {
    let done = 0, total = 0;
    track.modules.forEach(m => {
      const p = getModuleProgress(m.id);
      done += p.done;
      total += p.total;
    });
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  };

  const overallProgress = (() => {
    let done = 0, total = 0;
    TRACKS.forEach(t => {
      const p = getTrackProgress(t);
      done += p.done;
      total += p.total;
    });
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  })();

  const TypeBadge = ({ type }) => {
    const colors = { "hands-on": COLORS.green, "reading": COLORS.accent, "planning": COLORS.amber };
    return <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${colors[type] || COLORS.dim}20`, color: colors[type] || COLORS.dim }}>{type}</span>;
  };

  const ProgressBar = ({ pct, height = 6, color }) => (
    <div style={{ width: "100%", height, background: COLORS.border, borderRadius: height / 2 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color || (pct >= 80 ? COLORS.green : pct >= 40 ? COLORS.amber : COLORS.accent), borderRadius: height / 2, transition: "width 0.3s" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'JetBrains Mono', 'SF Mono', monospace", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            INT Platform Toolkit — Training Curriculum
          </h1>
          <p style={{ fontSize: 12, color: COLORS.dim, margin: "4px 0 0" }}>
            {overallProgress.done}/{overallProgress.total} items complete ({overallProgress.pct}%)
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["curriculum", "vistadel", "cheatsheet"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: view === v ? COLORS.accent : "transparent",
              color: view === v ? "#fff" : COLORS.dim,
              border: `1px solid ${view === v ? "transparent" : COLORS.border}`,
            }}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Overall Progress */}
      <div style={{ marginBottom: 20 }}>
        <ProgressBar pct={overallProgress.pct} height={8} />
      </div>

      {view === "curriculum" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TRACKS.map(track => {
            const tp = getTrackProgress(track);
            return (
              <div key={track.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{track.title}</h2>
                      <p style={{ fontSize: 11, color: COLORS.dim, margin: "2px 0 0" }}>{track.subtitle} — {track.duration}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: tp.pct >= 80 ? COLORS.green : COLORS.accent }}>{tp.pct}%</div>
                      <div style={{ fontSize: 10, color: COLORS.dim }}>{tp.done}/{tp.total}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}><ProgressBar pct={tp.pct} /></div>
                </div>
                <div style={{ padding: "12px 20px" }}>
                  {track.modules.map(mod => {
                    const mp = getModuleProgress(mod.id);
                    const isExpanded = expandedModule === mod.id;
                    return (
                      <div key={mod.id} style={{ marginBottom: 8 }}>
                        <div onClick={() => setExpandedModule(isExpanded ? null : mod.id)} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                          background: isExpanded ? `${COLORS.accent}10` : "transparent",
                          border: `1px solid ${isExpanded ? `${COLORS.accent}30` : "transparent"}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                              background: mp.pct === 100 ? COLORS.green : mp.pct > 0 ? COLORS.accent : COLORS.border,
                              color: "#fff", fontSize: 11, fontWeight: 700 }}>
                              {mp.pct === 100 ? "✓" : `${mp.pct}%`}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{mod.title}</div>
                              <div style={{ fontSize: 10, color: COLORS.dim }}>{mod.description}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <TypeBadge type={mod.type} />
                            <span style={{ fontSize: 10, color: COLORS.dim }}>{mod.est}</span>
                            <span style={{ fontSize: 14, color: COLORS.dim }}>{isExpanded ? "▴" : "▾"}</span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div style={{ padding: "12px 12px 12px 52px" }}>
                            {mod.checklist.map((item, idx) => (
                              <label key={idx} onClick={() => toggleCheck(mod.id, idx)} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer",
                                fontSize: 12, color: progress[mod.id]?.[idx] ? COLORS.green : COLORS.text,
                                textDecoration: progress[mod.id]?.[idx] ? "line-through" : "none",
                                opacity: progress[mod.id]?.[idx] ? 0.7 : 1,
                              }}>
                                <div style={{
                                  width: 18, height: 18, borderRadius: 4, border: `2px solid ${progress[mod.id]?.[idx] ? COLORS.green : COLORS.border}`,
                                  background: progress[mod.id]?.[idx] ? COLORS.green : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                                }}>{progress[mod.id]?.[idx] ? "✓" : ""}</div>
                                {item}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "vistadel" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {PHASES.map(p => (
              <div key={p.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, borderTop: `3px solid ${p.color}` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: p.color }}>{p.id}</div>
                <div style={{ fontSize: 13, fontWeight: 700, margin: "4px 0 8px" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: COLORS.dim, marginBottom: 4 }}>{p.gate}</div>
                <div style={{ fontSize: 10, color: COLORS.dim }}>{p.weeks}</div>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, margin: "0 0 16px" }}>Phase Flow</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              {PHASES.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ padding: "8px 16px", borderRadius: 8, background: `${p.color}20`, border: `1px solid ${p.color}40`, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: p.color }}>{p.id}</div>
                    <div style={{ fontSize: 9, color: COLORS.dim }}>{p.name}</div>
                  </div>
                  {i < PHASES.length - 1 && <span style={{ color: COLORS.dim, fontSize: 16 }}>→</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, fontSize: 12, lineHeight: 1.8, color: COLORS.dim }}>
              <p><strong style={{ color: COLORS.text }}>Key Rule:</strong> Never skip a phase. Each gate exists to catch issues early.</p>
              <p><strong style={{ color: COLORS.text }}>Re-audit:</strong> After every major change, re-run intinc-audit scan to verify scores haven't regressed.</p>
              <p><strong style={{ color: COLORS.text }}>Blocked:</strong> If a gate metric drops below its threshold, the app is blocked from proceeding until fixed.</p>
            </div>
          </div>
        </div>
      )}

      {view === "cheatsheet" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Audit CLI", items: [
              "intinc-audit scan --dir ./app          # Score a local app",
              "intinc-audit scan --repo owner/repo    # Score a GitHub repo",
              "intinc-audit batch --org intinc         # Scan entire org",
              "intinc-audit export -i res.json -f csv  # Export to CSV",
              "intinc-audit report -i res.json         # Markdown report",
            ]},
            { title: "Scaffolder", items: [
              "intinc-scaffold create                  # Interactive mode",
              "intinc-scaffold list                    # Show all templates",
              "--template pwa-react                    # PWA + React",
              "--template electron-react               # Electron + React",
              "--template tauri-react                  # Tauri + React",
              "--addons supabase,stripe,sentry         # Add integrations",
            ]},
            { title: "Templates", items: [
              "pwa-react       → SW + push + offline + install",
              "pwa-vanilla     → Zero-dep PWA modules",
              "electron-react  → IPC + auto-update + security",
              "electron-vanilla→ Minimal Electron shell",
              "tauri-react     → Rust backend + 40MB binary",
              "push-server     → VAPID + SQLite subscriptions",
            ]},
            { title: "Quality Gates", items: [
              "Vision:      Overall ≥ 30   → Worth building?",
              "Integration: Security ≥ 40  → Auth + RLS configured?",
              "Stack:       Quality ≥ 50   → TS strict + linting?",
              "Testing:     Coverage ≥ 40  → Tests + CI green?",
              "AI Impl:     Production ≥ 50 → Monitoring active?",
              "Deployment:  Target ≥ 60    → Platform-specific ready?",
              "Evolution:   All ≥ 60 avg   → No regressions?",
              "Launch:      Overall ≥ 70   → Ship it!",
            ]},
            { title: "Security (Non-Negotiable)", items: [
              "TypeScript strict: true — always",
              "Electron: contextIsolation + sandbox",
              "Electron: IPC via invoke/handle only",
              "Supabase: RLS on all user tables",
              "CSP headers on all production apps",
              "No secrets in source code — .env.local only",
              "Code signing for desktop distributions",
            ]},
            { title: "Dev Workflow", items: [
              "pnpm dev          # Start dev server",
              "pnpm test         # Run unit tests",
              "pnpm test:e2e     # Run E2E tests",
              "pnpm typecheck    # TypeScript strict check",
              "pnpm build        # Production build",
              "pnpm build:electron  # Electron binaries",
              "pnpm build:tauri     # Tauri binary",
            ]},
          ].map((section, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, margin: "0 0 12px" }}>{section.title}</h3>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
                {section.items.map((item, j) => (
                  <div key={j} style={{ color: COLORS.text, padding: "2px 0" }}>{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
