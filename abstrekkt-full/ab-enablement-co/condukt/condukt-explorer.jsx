import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════
// DESIGN TOKENS - Condukt Brand
// ═══════════════════════════════════════════════
const T = {
  bg: "#0A0A1A",
  bgSurface: "#0F0F1F",
  bgCard: "#141428",
  bgCardHover: "#1A1A35",
  bgElevated: "#1E1E3A",
  accent: "#E94560",
  accentMuted: "#E9456040",
  accentGlow: "#E9456025",
  navy: "#0F3460",
  navyLight: "#1A4A7A",
  teal: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  blue: "#3B82F6",
  text: "#E8ECF1",
  textMuted: "#8892A4",
  textDim: "#4A5568",
  border: "#1E2A42",
  borderHover: "#2E3F5A",
  white: "#FFFFFF",
};

const PHASES = [
  {
    num: 1, name: "Foundation + Landing", weeks: "Wk 1–3", color: T.accent,
    deliverables: ["Design system + UI library", "Auth flow (register → verify → login)", "Tenant config + RLS", "Marketing site + SEO", "CI/CD pipeline", "Vercel deployment"],
    intincValue: "Multi-tenant RLS, design system tokenization, CI/CD pipeline",
    serviceValue: "Sellable landing page + auth system",
    exitCriteria: ["LCP < 2.5s, CLS < 0.1", "Auth E2E passes", "Tenant isolation proven", "White-label theme swap works", "CI/CD green", "Live on Vercel"],
  },
  {
    num: 2, name: "Core CRM + Calendar", weeks: "Wk 4–9", color: T.blue,
    deliverables: ["Contact CRUD + search/filter", "Company records", "Calendar views (month/week/day)", "Booking page builder", "Todo manager", "Link tree builder", "Settings + billing (Stripe)"],
    intincValue: "Complex CRUD with search, calendar/scheduling, Stripe billing",
    serviceValue: "Core product — CRM + booking is sellable standalone",
    exitCriteria: ["Contact import/export works", "Booking flow E2E", "Stripe Checkout integration", "Calendar drag-and-drop", "Settings fully functional"],
  },
  {
    num: 3, name: "Pipeline + Communication", weeks: "Wk 10–15", color: T.purple,
    deliverables: ["Deal pipeline (Kanban)", "Email composer + inbox", "Community spaces", "Product catalog", "Goal tracking"],
    intincValue: "Event-driven architecture, optimistic updates, WebSocket patterns",
    serviceValue: "Full CRM offering — deals + email + community",
    exitCriteria: ["Kanban drag-and-drop", "Email send/receive", "Realtime updates via Supabase", "Space creation + membership"],
  },
  {
    num: 4, name: "Automation + Intelligence", weeks: "Wk 16–23", color: T.amber,
    deliverables: ["Visual workflow builder", "Reporting engine", "Course builder (LMS)", "Admin dashboards", "Advanced analytics"],
    intincValue: "Complex state machines, data visualization, admin panel patterns",
    serviceValue: "Premium tier features — automation + learning",
    exitCriteria: ["Workflow executes end-to-end", "Reports generate from live data", "Course enrollment flow", "Admin RBAC enforced"],
  },
  {
    num: 5, name: "AI + Optimization", weeks: "Wk 24–29", color: T.teal,
    deliverables: ["AI assistant (Nexus)", "Semantic search (embeddings)", "Performance optimization", "Load testing", "Security hardening"],
    intincValue: "AI/RAG integration, vector databases, performance engineering",
    serviceValue: "Competitive differentiator — AI-powered features",
    exitCriteria: ["RAG pipeline functional", "Search returns relevant results", "Lighthouse 90+ all metrics", "Load test passes 1K concurrent"],
  },
];

const MODULES = [
  { name: "core/auth", desc: "Authentication, sessions, MFA", deps: "Supabase Auth, Redis", color: T.accent },
  { name: "core/tenant", desc: "Multi-tenant config, theming", deps: "Supabase DB, Redis", color: T.accent },
  { name: "core/ui", desc: "Shared Radix component library", deps: "None (leaf)", color: T.accent },
  { name: "features/crm", desc: "Contacts, companies, tags", deps: "core/auth, core/tenant", color: T.blue },
  { name: "features/calendar", desc: "Scheduling, booking, availability", deps: "core/auth, features/crm", color: T.blue },
  { name: "features/deals", desc: "Deal tracking, pipeline stages", deps: "features/crm", color: T.purple },
  { name: "features/email", desc: "Compose, inbox, templates", deps: "features/crm, Resend", color: T.purple },
  { name: "features/automations", desc: "Workflow builder, triggers", deps: "All feature modules", color: T.amber },
  { name: "features/spaces", desc: "Community, discussions", deps: "core/auth, core/tenant", color: T.purple },
  { name: "features/learning", desc: "Courses, lessons, progress", deps: "core/auth, features/spaces", color: T.amber },
  { name: "features/links", desc: "Link tree, short URLs", deps: "core/auth", color: T.blue },
  { name: "features/admin", desc: "Platform admin, user mgmt", deps: "All modules (read-only)", color: T.amber },
];

const THREATS = [
  { threat: "Tenant Data Leak", vector: "Broken access control", severity: "critical", mitigation: "RLS on every table, tenant_id in JWT, server-side validation" },
  { threat: "XSS", vector: "User-generated content", severity: "high", mitigation: "CSP headers, DOMPurify, no dangerouslySetInnerHTML" },
  { threat: "CSRF", vector: "Cross-origin requests", severity: "high", mitigation: "SameSite cookies, CSRF tokens on state-changing ops" },
  { threat: "Auth Bypass", vector: "Token manipulation", severity: "critical", mitigation: "JWT verification per request, 15min access / 7d refresh" },
  { threat: "Rate Abuse", vector: "API flooding", severity: "medium", mitigation: "Redis rate limiting per tenant + user, progressive backoff" },
  { threat: "Data Exfil", vector: "Bulk export abuse", severity: "high", mitigation: "Rate-limited exports, audit logging, anomaly detection" },
  { threat: "Privilege Escalation", vector: "Role manipulation", severity: "critical", mitigation: "Admin-only role changes, audit log, no client-side roles" },
  { threat: "Supply Chain", vector: "Dependency vulns", severity: "medium", mitigation: "Dependabot, npm audit in CI, lockfile integrity" },
];

const STACK = [
  { layer: "Framework", tech: "React 18 + Vite", keep: true },
  { layer: "UI Library", tech: "Radix UI", keep: true },
  { layer: "State", tech: "TanStack Query", keep: true },
  { layer: "Backend", tech: "Supabase", keep: true },
  { layer: "Animation", tech: "Framer Motion", keep: true },
  { layer: "Styling", tech: "Tailwind CSS", keep: true },
  { layer: "Language", tech: "TypeScript (strict)", keep: true },
  { layer: "Billing", tech: "Stripe", keep: true },
  { layer: "Analytics", tech: "PostHog", keep: false, replacing: "Lovable Flock.js" },
  { layer: "Hosting", tech: "Vercel", keep: false, replacing: "Lovable.dev" },
  { layer: "Email", tech: "Resend", keep: true },
  { layer: "Monitoring", tech: "Sentry", keep: true },
];

const BRAND_COLORS = [
  { token: "--bg-primary", from: "#18181B", to: "#0F0F1A", label: "App Background" },
  { token: "--bg-secondary", from: "#27272A", to: "#1A1A2E", label: "Card Surface" },
  { token: "--accent-primary", from: "#E91E63", to: "#E94560", label: "Primary Accent" },
  { token: "--accent-secondary", from: "#374151", to: "#0F3460", label: "Secondary" },
  { token: "--text-primary", from: "#FAFAFA", to: "#F8FAFC", label: "Body Text" },
  { token: "--text-secondary", from: "#A1A1AA", to: "#94A3B8", label: "Captions" },
  { token: "--success", from: "#16A34A", to: "#10B981", label: "Success" },
  { token: "--destructive", from: "#EF4444", to: "#EF4444", label: "Error" },
];

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function Badge({ children, color = T.accent, style }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 12px", borderRadius: 100,
      background: color + "18", border: `1px solid ${color}35`,
      color, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      fontFamily: "'DM Mono', monospace", ...style,
    }}>{children}</span>
  );
}

function SectionTitle({ badge, badgeColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {badge && <Badge color={badgeColor}>{badge}</Badge>}
      <h2 style={{
        fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: T.white,
        margin: "14px 0 8px", letterSpacing: "-0.02em", lineHeight: 1.15,
        fontFamily: "'Outfit', sans-serif",
      }}>{title}</h2>
      {subtitle && <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.6, maxWidth: 680 }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style, onClick, interactive = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        background: h && interactive ? T.bgCardHover : T.bgCard,
        border: `1px solid ${h && interactive ? T.borderHover : T.border}`,
        borderRadius: 14, padding: 24,
        transition: "all 0.25s ease",
        cursor: interactive ? "pointer" : "default",
        transform: h && interactive ? "translateY(-2px)" : "none",
        boxShadow: h && interactive ? `0 8px 32px ${T.bg}90` : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Pill({ active, onClick, children, color }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: 10, border: "none",
      background: active ? (color || T.accent) + "22" : "transparent",
      color: active ? (color || T.accent) : T.textMuted,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      transition: "all 0.2s", fontFamily: "inherit",
      outline: active ? `1px solid ${(color || T.accent)}40` : "1px solid transparent",
    }}>{children}</button>
  );
}

function ProgressBar({ percent, color, height = 6 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: height, background: T.border, overflow: "hidden" }}>
      <div style={{
        width: `${percent}%`, height: "100%", borderRadius: height,
        background: `linear-gradient(90deg, ${color}, ${color}AA)`,
        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
    </div>
  );
}

function Stat({ value, label, color = T.accent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB SECTIONS
// ═══════════════════════════════════════════════

function OverviewTab() {
  return (
    <div>
      <SectionTitle badge="Executive Summary" badgeColor={T.accent}
        title={<>See it. Plan it. <span style={{ color: T.accent }}>Build it.</span></>}
        subtitle="Condukt is a full-stack rebuild of Creativable — a 60+ route SaaS platform — rebranded, re-architected, and white-labeled for dual deployment as an Intinc engineering capability and Customization Service revenue product." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { v: "60+", l: "Routes", c: T.accent },
          { v: "12", l: "Feature Domains", c: T.blue },
          { v: "5", l: "Build Phases", c: T.purple },
          { v: "29", l: "Weeks Total", c: T.amber },
          { v: "2", l: "Deployment Lanes", c: T.teal },
        ].map(s => (
          <Card key={s.l} style={{ padding: 20 }}>
            <Stat value={s.v} label={s.l} color={s.c} />
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: T.blue }} />
            <span style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>Lane 1 — Intinc</span>
          </div>
          <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7 }}>
            Internal engineering capability. Teaching platform for modern SaaS architecture — multi-tenant RLS, event-driven pipelines, observability patterns. Each phase maps to specific patterns senior engineers can study and apply.
          </p>
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: T.teal }} />
            <span style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>Lane 2 — Customization Service</span>
          </div>
          <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7 }}>
            White-label product template. Strip brand, inject client identity, deploy as managed instance. Revenue: $5K–$15K setup + $500–$2K/mo hosting. Target turnaround: 5–10 business days.
          </p>
        </Card>
      </div>

      <Card style={{ marginTop: 20, background: T.accent + "08", border: `1px solid ${T.accent}20` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>
          <div>
            <div style={{ color: T.accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Source Platform</div>
            <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              Creativable (creativable.de) — German-market all-in-one business platform for coaches, networkers, and entrepreneurs. Built on Lovable.dev with React/Vite, Supabase, Radix UI, TanStack Query, Framer Motion. Dark neumorphic glass-morphism design with pink (#E91E63) accent.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BrandTab() {
  const [showFrom, setShowFrom] = useState(false);
  return (
    <div>
      <SectionTitle badge="Rebrand" badgeColor={T.purple}
        title={<>Creativable → <span style={{ color: T.accent }}>Condukt</span></>}
        subtitle="Orchestrate Everything. — Conducting an orchestra of features into unified performance. The 'k' gives it a distinctive, modern edge." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { name: "Condukt", tag: "Orchestrate Everything.", status: "PRIMARY", statusColor: T.teal, pros: "Memorable, modern, white-label friendly, strong metaphor", cons: "Unconventional spelling" },
          { name: "Vantage", tag: "See the Full Picture.", status: "BACKUP", statusColor: T.amber, pros: "Clean, professional, implies strategic overview", cons: "Common word, harder to trademark" },
          { name: "Zentra", tag: "Calm Control. Total Platform.", status: "CONSIDERED", statusColor: T.textDim, pros: "Zen + Central, focus and centrality", cons: "Too abstract, weaker verb energy" },
        ].map(b => (
          <Card key={b.name} style={b.status === "PRIMARY" ? { border: `1px solid ${T.accent}40` } : {}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.white, fontFamily: "'Outfit', sans-serif" }}>{b.name}</div>
              <Badge color={b.statusColor} style={{ fontSize: 10 }}>{b.status}</Badge>
            </div>
            <div style={{ color: T.accent, fontSize: 13, fontStyle: "italic", marginBottom: 12 }}>{b.tag}</div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
              <span style={{ color: T.teal }}>+</span> {b.pros}<br />
              <span style={{ color: T.accent }}>−</span> {b.cons}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ color: T.white, fontWeight: 700, fontSize: 15 }}>Color System</span>
        <Pill active={!showFrom} onClick={() => setShowFrom(false)} color={T.teal}>Condukt (Target)</Pill>
        <Pill active={showFrom} onClick={() => setShowFrom(true)} color={T.amber}>Creativable (Source)</Pill>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {BRAND_COLORS.map(c => {
          const color = showFrom ? c.from : c.to;
          const isLight = ["#FAFAFA", "#F8FAFC", "#A1A1AA", "#94A3B8", "#EF4444", "#16A34A", "#10B981"].includes(color);
          return (
            <div key={c.token} style={{
              borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`,
              background: T.bgCard,
            }}>
              <div style={{
                height: 56, background: color,
                display: "flex", alignItems: "flex-end", padding: "0 12px 6px",
              }}>
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: isLight ? "#333" : "#ffffffCC" }}>{color}</span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{c.label}</div>
                <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: T.textDim }}>{c.token}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Card style={{ marginTop: 20 }}>
        <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Typography</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { role: "Display", from: "Kalam (handwriting)", to: "Space Grotesk → Outfit", why: "Enterprise feel" },
            { role: "Body", from: "Inter", to: "Inter (retained)", why: "Excellent SaaS readability" },
            { role: "Monospace", from: "System default", to: "DM Mono / JetBrains Mono", why: "Dev-friendly data display" },
          ].map(f => (
            <div key={f.role} style={{ padding: "12px 0" }}>
              <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.role}</div>
              <div style={{ color: T.white, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{f.to}</div>
              <div style={{ color: T.textDim, fontSize: 11, marginTop: 2 }}>was: {f.from} · {f.why}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ArchTab() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [stackFilter, setStackFilter] = useState("all");

  const filtered = stackFilter === "all" ? STACK : stackFilter === "keep" ? STACK.filter(s => s.keep) : STACK.filter(s => !s.keep);

  return (
    <div>
      <SectionTitle badge="Architecture" badgeColor={T.blue}
        title={<>Modular Monolith<span style={{ color: T.accent }}>.</span></>}
        subtitle="Single deployable artifact with clearly defined internal module boundaries. Multi-tenant PostgreSQL with RLS on every table. Security modeled at every layer." />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <Pill active={stackFilter === "all"} onClick={() => setStackFilter("all")}>All Stack ({STACK.length})</Pill>
        <Pill active={stackFilter === "keep"} onClick={() => setStackFilter("keep")} color={T.teal}>Retained ({STACK.filter(s => s.keep).length})</Pill>
        <Pill active={stackFilter === "replace"} onClick={() => setStackFilter("replace")} color={T.amber}>Replaced ({STACK.filter(s => !s.keep).length})</Pill>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 32 }}>
        {filtered.map(s => (
          <div key={s.layer} style={{
            padding: "14px 16px", borderRadius: 10,
            background: T.bgCard, border: `1px solid ${T.border}`,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.layer}</div>
            <div style={{ fontSize: 14, color: T.white, fontWeight: 700 }}>{s.tech}</div>
            {!s.keep && <div style={{ fontSize: 10, color: T.amber, fontFamily: "'DM Mono', monospace" }}>↺ replaces {s.replacing}</div>}
            {s.keep && <div style={{ fontSize: 10, color: T.teal, fontFamily: "'DM Mono', monospace" }}>✓ retained</div>}
          </div>
        ))}
      </div>

      <div style={{ color: T.white, fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Application Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {MODULES.map(m => {
          const active = selectedModule === m.name;
          return (
            <Card key={m.name} interactive onClick={() => setSelectedModule(active ? null : m.name)}
              style={active ? { border: `1px solid ${m.color}50`, background: m.color + "0A" } : {}}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: m.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.white, fontFamily: "'DM Mono', monospace" }}>{m.name}</span>
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{m.desc}</div>
              {active && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, marginBottom: 4 }}>DEPENDENCIES</div>
                  <div style={{ fontSize: 12, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.deps}</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RoadmapTab() {
  const [expandedPhase, setExpandedPhase] = useState(1);

  return (
    <div>
      <SectionTitle badge="Roadmap" badgeColor={T.amber}
        title={<>5 Phases. 29 Weeks<span style={{ color: T.accent }}>.</span></>}
        subtitle="Progressive delivery — each phase is deployable and testable. Phase gates with exit criteria prevent runaway scope." />

      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{
          position: "absolute", left: 11, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(180deg, ${T.accent}, ${T.blue}, ${T.purple}, ${T.amber}, ${T.teal})`,
          borderRadius: 1, opacity: 0.4,
        }} />

        {PHASES.map(p => {
          const expanded = expandedPhase === p.num;
          return (
            <div key={p.num} style={{ marginBottom: 12, position: "relative" }}>
              <div style={{
                position: "absolute", left: -22, top: 18,
                width: 18, height: 18, borderRadius: 9,
                background: expanded ? p.color : T.bgCard,
                border: `2px solid ${p.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1,
              }}>
                {expanded && <div style={{ width: 6, height: 6, borderRadius: 3, background: T.white }} />}
              </div>

              <Card interactive onClick={() => setExpandedPhase(expanded ? null : p.num)}
                style={expanded ? { border: `1px solid ${p.color}40`, background: p.color + "08" } : {}}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: p.color, fontFamily: "'DM Mono', monospace" }}>0{p.num}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: T.textDim }}>{p.weeks}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
                </div>

                {expanded && (
                  <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Deliverables</div>
                      {p.deliverables.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                          <span style={{ color: p.color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                          <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Exit Criteria</div>
                      {p.exitCriteria.map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                          <span style={{ color: T.teal, fontSize: 10, marginTop: 3, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{c}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 8, background: T.bgElevated }}>
                        <div style={{ fontSize: 10, color: T.blue, fontWeight: 700, marginBottom: 4 }}>INTINC VALUE</div>
                        <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{p.intincValue}</div>
                      </div>
                      <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: T.bgElevated }}>
                        <div style={{ fontSize: 10, color: T.teal, fontWeight: 700, marginBottom: 4 }}>SERVICE VALUE</div>
                        <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{p.serviceValue}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [expandedThreat, setExpandedThreat] = useState(null);
  const severityColor = { critical: T.accent, high: T.amber, medium: T.blue };
  const severityOrder = { critical: 0, high: 1, medium: 2 };
  const sorted = [...THREATS].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div>
      <SectionTitle badge="Security" badgeColor={T.teal}
        title={<>Threat Model<span style={{ color: T.accent }}>.</span></>}
        subtitle="Security modeled at every layer — database (RLS), API (rate limiting, CSRF), client (CSP, DOMPurify), auth (JWT rotation), and CI/CD (supply chain)." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Critical", count: THREATS.filter(t => t.severity === "critical").length, color: T.accent },
          { label: "High", count: THREATS.filter(t => t.severity === "high").length, color: T.amber },
          { label: "Medium", count: THREATS.filter(t => t.severity === "medium").length, color: T.blue },
        ].map(s => (
          <Card key={s.label} style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.count}</div>
            <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((t, i) => {
          const expanded = expandedThreat === i;
          const color = severityColor[t.severity];
          return (
            <Card key={i} interactive onClick={() => setExpandedThreat(expanded ? null : i)}
              style={expanded ? { border: `1px solid ${color}40` } : {}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, background: color,
                    boxShadow: `0 0 8px ${color}60`,
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>{t.threat}</span>
                  <Badge color={color} style={{ fontSize: 9 }}>{t.severity}</Badge>
                </div>
                <span style={{ color: T.textDim, fontSize: 12 }}>{expanded ? "−" : "+"}</span>
              </div>
              {expanded && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", marginBottom: 4 }}>Attack Vector</div>
                    <div style={{ fontSize: 13, color: T.text }}>{t.vector}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", marginBottom: 4 }}>Mitigation</div>
                    <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>{t.mitigation}</div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card style={{ marginTop: 20, background: T.teal + "08", border: `1px solid ${T.teal}20` }}>
        <div style={{ color: T.teal, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Architecture Principles (Non-Negotiable)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
          {[
            "RLS on every table — no exceptions",
            "UUID PKs — no sequential integers",
            "Soft deletes via deleted_at",
            "Audit log captures all mutations",
            "JWT: 15min access / 7d refresh",
            "OWASP Top 10 mitigations baked in",
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: T.teal, fontSize: 11, flexShrink: 0 }}>◆</span>
              <span style={{ fontSize: 12, color: T.textMuted }}>{p}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RevenueTab() {
  return (
    <div>
      <SectionTitle badge="Dual-Lane Revenue" badgeColor={T.teal}
        title={<>Build once. Deploy twice<span style={{ color: T.accent }}>.</span></>}
        subtitle="Same codebase, separate deployments. Intinc learns from the build. Customization Service earns from the deployment." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { name: "Setup Fee", price: "$5K – $15K", margin: "90%+", note: "Brand config, domain, data migration", color: T.accent },
          { name: "Monthly Hosting", price: "$500 – $2K/mo", margin: "70–80%", note: "Managed Vercel + Supabase + monitoring", color: T.blue },
          { name: "Feature Add-ons", price: "$2K – $10K/module", margin: "80%+", note: "Custom modules, integrations, automations", color: T.purple },
          { name: "Support SLA", price: "$200 – $500/mo", margin: "60–70%", note: "Email + Slack support, SLA-backed", color: T.teal },
        ].map(r => (
          <Card key={r.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: T.white, fontWeight: 700, fontSize: 14 }}>{r.name}</span>
              <Badge color={T.teal} style={{ fontSize: 10 }}>{r.margin} margin</Badge>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: r.color, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{r.price}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{r.note}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>White-Label Deployment Process</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { step: "1", label: "Onboard", desc: "Collect brand assets — logo, colors, fonts, copy" },
            { step: "2", label: "Provision", desc: "Create Supabase tenant, configure theme JSON, set feature flags" },
            { step: "3", label: "Domain", desc: "Client domain → Vercel project with custom domain + SSL" },
            { step: "4", label: "Seed", desc: "Import contacts, verify email domain via Resend" },
            { step: "5", label: "QA", desc: "Visual regression, E2E auth, billing integration test" },
            { step: "6", label: "Launch", desc: "DNS cutover, monitoring verify, client handoff call" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: T.accent + "15", border: `1px solid ${T.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: T.accent, fontFamily: "'DM Mono', monospace",
                flexShrink: 0,
              }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{s.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: T.teal + "10", border: `1px solid ${T.teal}20` }}>
          <span style={{ fontSize: 12, color: T.teal, fontWeight: 700 }}>Target turnaround: 5–10 business days</span>
          <span style={{ fontSize: 12, color: T.textMuted }}> from signed contract to live instance</span>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: T.white, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Context Separation (Lane Bleed Prevention)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {[
            { guard: "GitHub Branches", detail: "main (prod), intinc-demo, client/* forks" },
            { guard: "Vercel Projects", detail: "condukt-prod, condukt-intinc, condukt-client-{name}" },
            { guard: "Supabase Projects", detail: "Full project isolation per client — not shared DB" },
            { guard: "Feature Flags", detail: "intinc.* vs client.{name}.* namespacing" },
          ].map(g => (
            <div key={g.guard} style={{ padding: "10px 14px", borderRadius: 8, background: T.bgElevated }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.amber }}>{g.guard}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{g.detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════

const TABS = [
  { key: "overview", label: "Overview", icon: "◎" },
  { key: "brand", label: "Rebrand", icon: "◈" },
  { key: "arch", label: "Architecture", icon: "⬡" },
  { key: "roadmap", label: "Roadmap", icon: "▸" },
  { key: "security", label: "Security", icon: "◇" },
  { key: "revenue", label: "Revenue", icon: "◉" },
];

export default function ConduktExplorer() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabContent = {
    overview: <OverviewTab />,
    brand: <BrandTab />,
    arch: <ArchTab />,
    roadmap: <RoadmapTab />,
    security: <SecurityTab />,
    revenue: <RevenueTab />,
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: T.bg, color: T.text, minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${T.accent}40; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.borderHover}; }
      `}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: T.bg + "E8", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 20px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${T.accent}, ${T.navy})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900, color: T.white, fontFamily: "'DM Mono', monospace",
            }}>K</div>
            <div>
              <span style={{ fontWeight: 800, fontSize: 17, color: T.white, fontFamily: "'Outfit', sans-serif" }}>
                Condukt
              </span>
              <span style={{ display: "block", fontSize: 9, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -2 }}>Architecture Explorer</span>
            </div>
          </div>
          <Badge color={T.amber}>v1.0 — Feb 2026</Badge>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        position: "sticky", top: 61, zIndex: 40,
        background: T.bgSurface + "F0", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "0 20px",
        overflowX: "auto",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "12px 16px", border: "none", cursor: "pointer",
              background: "transparent", fontFamily: "inherit",
              color: activeTab === t.key ? T.accent : T.textDim,
              fontWeight: activeTab === t.key ? 700 : 500,
              fontSize: 13, whiteSpace: "nowrap",
              borderBottom: activeTab === t.key ? `2px solid ${T.accent}` : "2px solid transparent",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>
        {tabContent[activeTab]}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${T.border}`,
        padding: "20px", textAlign: "center",
      }}>
        <div style={{ fontSize: 11, color: T.textDim }}>
          Condukt Architecture Document v1.0 — Intinc + Customization Service — Feb 2026
        </div>
      </footer>
    </div>
  );
}
