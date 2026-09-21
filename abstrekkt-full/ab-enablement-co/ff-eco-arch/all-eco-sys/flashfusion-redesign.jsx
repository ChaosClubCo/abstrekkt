import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Palette, ShoppingBag, Zap, Bell, Search, 
  ChevronRight, TrendingUp, Users, Star, ArrowUpRight, ArrowDownRight,
  Play, Image, Type, Sparkles, Plus, MoreHorizontal, Package,
  Tag, BarChart3, Globe, Check, Clock, Filter, Upload, Wand2,
  Layers, FileText, Video, Music, ShoppingCart, Store, Eye,
  DollarSign, Activity, RefreshCw, ChevronDown, X, Rocket,
  BookOpen, Brush, Camera, Layout, Hash
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const tokens = {
  bg: "#080B14",
  surface: "#0E1220",
  surfaceHover: "#131829",
  border: "#1C2236",
  borderHover: "#2A3356",
  accent: "#5B6EF5",
  accentHover: "#6F7FF7",
  accentMuted: "rgba(91,110,245,0.12)",
  accentMutedHover: "rgba(91,110,245,0.2)",
  text: "#E8ECFF",
  textMuted: "#6B7599",
  textDim: "#3D4566",
  green: "#22D3A0",
  greenMuted: "rgba(34,211,160,0.12)",
  amber: "#F59E0B",
  amberMuted: "rgba(245,158,11,0.12)",
  red: "#FF5A6A",
  redMuted: "rgba(255,90,106,0.12)",
  purple: "#A78BFA",
  purpleMuted: "rgba(167,139,250,0.12)",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Aug", revenue: 4200, orders: 38 },
  { month: "Sep", revenue: 5800, orders: 52 },
  { month: "Oct", revenue: 5100, orders: 47 },
  { month: "Nov", revenue: 7400, orders: 68 },
  { month: "Dec", revenue: 9200, orders: 84 },
  { month: "Jan", revenue: 8600, orders: 79 },
];

const creatorData = [
  { week: "W1", content: 12, brands: 3 },
  { week: "W2", content: 18, brands: 5 },
  { week: "W3", content: 24, brands: 4 },
  { week: "W4", content: 31, brands: 7 },
];

const recentContent = [
  { id: 1, title: "Summer Campaign 2025", type: "Brand Kit", status: "published", date: "2h ago", thumbnail: "🎨" },
  { id: 2, title: "Product Launch Video Script", type: "Copy", status: "draft", date: "5h ago", thumbnail: "📝" },
  { id: 3, title: "Social Media Pack – Q1", type: "Graphics", status: "published", date: "1d ago", thumbnail: "🖼️" },
  { id: 4, title: "Email Newsletter Template", type: "Template", status: "review", date: "2d ago", thumbnail: "✉️" },
];

const products = [
  { id: 1, name: "Midnight Hoodie", sku: "APP-001", price: 89, stock: 142, status: "active", revenue: 12638 },
  { id: 2, name: "Brand Kit Pro Bundle", sku: "DIG-002", price: 49, stock: "∞", status: "active", revenue: 8820 },
  { id: 3, name: "Creator Canvas Tee", sku: "APP-003", price: 35, stock: 67, status: "active", revenue: 2345 },
  { id: 4, name: "Foil Logo Snapback", sku: "ACC-004", price: 42, stock: 0, status: "out_of_stock", revenue: 1890 },
  { id: 5, name: "Custom Merch Drop Pack", sku: "BUN-005", price: 129, stock: 28, status: "active", revenue: 3612 },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Badge = ({ children, color = "accent", size = "sm" }) => {
  const colors = {
    accent: { bg: tokens.accentMuted, text: tokens.accent },
    green: { bg: tokens.greenMuted, text: tokens.green },
    amber: { bg: tokens.amberMuted, text: tokens.amber },
    red: { bg: tokens.redMuted, text: tokens.red },
    purple: { bg: tokens.purpleMuted, text: tokens.purple },
    muted: { bg: "#1C2236", text: tokens.textMuted },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 99,
      fontSize: size === "sm" ? 11 : 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>{children}</span>
  );
};

const Stat = ({ label, value, delta, deltaDir, icon: Icon, accent }) => (
  <div style={{
    background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 16, padding: "20px 24px",
    display: "flex", flexDirection: "column", gap: 12,
    transition: "border-color 0.2s",
    cursor: "default",
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = tokens.borderHover}
    onMouseLeave={e => e.currentTarget.style.borderColor = tokens.border}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: tokens.textMuted, fontSize: 13, fontWeight: 500 }}>{label}</span>
      <div style={{ background: accent || tokens.accentMuted, borderRadius: 10, padding: 8, display: "flex" }}>
        <Icon size={16} color={tokens.accent} />
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: "space-between" }}>
      <span style={{ color: tokens.text, fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "'DM Mono', monospace" }}>{value}</span>
      {delta && (
        <span style={{
          color: deltaDir === "up" ? tokens.green : tokens.red,
          fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
          paddingBottom: 4,
        }}>
          {deltaDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}
        </span>
      )}
    </div>
  </div>
);

const Card = ({ children, style = {}, className }) => (
  <div style={{
    background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 16, ...style
  }}>{children}</div>
);

const CardHeader = ({ title, action, sub }) => (
  <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h3 style={{ color: tokens.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{title}</h3>
      {sub && <p style={{ color: tokens.textMuted, fontSize: 12, margin: "2px 0 0" }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#10172B", border: `1px solid ${tokens.border}`,
      borderRadius: 10, padding: "10px 14px",
    }}>
      <p style={{ color: tokens.textMuted, fontSize: 11, margin: "0 0 6px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600, margin: "2px 0" }}>
          {p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value} <span style={{ color: tokens.textMuted, fontWeight: 400 }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
};

// ─── VIEWS ───────────────────────────────────────────────────────────────────

const DashboardView = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    {/* Stats Grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <Stat label="Total Revenue" value="$49.2K" delta="18.4%" deltaDir="up" icon={DollarSign} />
      <Stat label="Active Campaigns" value="12" delta="3 new" deltaDir="up" icon={Sparkles} />
      <Stat label="Products Live" value="38" delta="5.2%" deltaDir="up" icon={Package} />
      <Stat label="Avg. Conversion" value="4.7%" delta="0.3%" deltaDir="down" icon={Activity} />
    </div>

    {/* Charts Row */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <Card>
        <CardHeader title="Revenue Overview" sub="Last 6 months" action={
          <Badge color="green">↑ 18.4% MoM</Badge>
        } />
        <div style={{ padding: "16px 8px 8px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={tokens.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={tokens.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.border} />
              <XAxis dataKey="month" tick={{ fill: tokens.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tokens.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke={tokens.accent} fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="Content Output" sub="This month" />
        <div style={{ padding: "16px 8px 8px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creatorData}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.border} />
              <XAxis dataKey="week" tick={{ fill: tokens.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tokens.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="content" fill={tokens.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="brands" fill={tokens.purple} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>

    {/* Recent Activity */}
    <Card>
      <CardHeader title="Recent Creations" sub="Your latest content and campaigns"
        action={
          <button style={{ color: tokens.accent, fontSize: 13, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
            View all <ChevronRight size={14} />
          </button>
        }
      />
      <div style={{ padding: "12px 0 8px" }}>
        {recentContent.map((item, i) => (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "12px 24px",
            borderTop: i > 0 ? `1px solid ${tokens.border}` : "none",
            transition: "background 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = tokens.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: tokens.accentMuted, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>{item.thumbnail}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: tokens.text, fontSize: 14, fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
              <p style={{ color: tokens.textMuted, fontSize: 12, margin: "2px 0 0" }}>{item.type}</p>
            </div>
            <Badge color={item.status === "published" ? "green" : item.status === "draft" ? "muted" : "amber"}>
              {item.status}
            </Badge>
            <span style={{ color: tokens.textMuted, fontSize: 12, width: 48, textAlign: "right", flexShrink: 0 }}>{item.date}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─── CREATOR STUDIO ───────────────────────────────────────────────────────────

const tools = [
  { icon: Brush, label: "Brand Kit Generator", desc: "Colors, fonts, logos from a single prompt", badge: "AI", color: tokens.purple },
  { icon: Type, label: "Copy Engine", desc: "Headlines, emails, social captions", badge: "AI", color: tokens.accent },
  { icon: Image, label: "Visual Composer", desc: "On-brand graphics and social assets", badge: "AI", color: tokens.green },
  { icon: Video, label: "Video Script", desc: "Hooks, narratives, CTAs structured for production", badge: "AI", color: tokens.amber },
  { icon: Layout, label: "Template Library", desc: "200+ production-ready templates", badge: null, color: tokens.textMuted },
  { icon: BookOpen, label: "Style Guide Builder", desc: "Codify your brand in an exportable doc", badge: "New", color: tokens.green },
];

const brandKits = [
  { name: "Midnight Co.", colors: ["#5B6EF5", "#A78BFA", "#22D3A0", "#080B14"], font: "Satoshi / DM Mono" },
  { name: "Solar Merch", colors: ["#F59E0B", "#FF5A6A", "#1C2236", "#FAFAFA"], font: "Cabinet / Inter" },
  { name: "NorthEdge Studio", colors: ["#22D3A0", "#0E1220", "#5B6EF5", "#E8ECFF"], font: "Mona Sans / Mono" },
];

const CreatorStudioView = () => {
  const [activePrompt, setActivePrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!activePrompt.trim()) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* AI Prompt Bar */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <div style={{ background: tokens.purpleMuted, borderRadius: 10, padding: 8, display: "flex" }}>
            <Wand2 size={18} color={tokens.purple} />
          </div>
          <div>
            <h3 style={{ color: tokens.text, fontSize: 15, fontWeight: 600, margin: 0 }}>AI Creative Console</h3>
            <p style={{ color: tokens.textMuted, fontSize: 12, margin: "2px 0 0" }}>Describe what you need — brand kit, copy, visuals, or campaign</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder='e.g. "Brand kit for a premium streetwear label — dark, bold, editorial"'
            value={activePrompt}
            onChange={e => setActivePrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            style={{
              flex: 1, background: tokens.bg, border: `1px solid ${tokens.border}`,
              borderRadius: 10, padding: "12px 16px", color: tokens.text, fontSize: 14,
              outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={generating || !activePrompt.trim()}
            style={{
              background: generating ? tokens.accentMuted : tokens.accent,
              color: generating ? tokens.accent : "#fff",
              border: "none", borderRadius: 10, padding: "12px 20px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}
          >
            {generating ? <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating…</> : <><Sparkles size={14} /> Generate</>}
          </button>
        </div>
        {generated && (
          <div style={{
            marginTop: 16, padding: 16, background: tokens.greenMuted,
            border: `1px solid rgba(34,211,160,0.2)`, borderRadius: 12,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Check size={16} color={tokens.green} />
            <span style={{ color: tokens.green, fontSize: 13, fontWeight: 500 }}>Brand kit generated — saved to your library</span>
            <button onClick={() => setGenerated(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: tokens.green }}>
              <X size={14} />
            </button>
          </div>
        )}
      </Card>

      {/* Tools Grid */}
      <div>
        <h3 style={{ color: tokens.textMuted, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px" }}>Creation Tools</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {tools.map((tool) => (
            <div key={tool.label} style={{
              background: tokens.surface, border: `1px solid ${tokens.border}`,
              borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.borderHover; e.currentTarget.style.background = tokens.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; e.currentTarget.style.background = tokens.surface; }}
            >
              <div style={{ background: `${tool.color}20`, borderRadius: 10, padding: 10, display: "flex", flexShrink: 0 }}>
                <tool.icon size={18} color={tool.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: tokens.text, fontSize: 14, fontWeight: 600 }}>{tool.label}</span>
                  {tool.badge && <Badge color={tool.badge === "AI" ? "accent" : tool.badge === "New" ? "green" : "muted"}>{tool.badge}</Badge>}
                </div>
                <p style={{ color: tokens.textMuted, fontSize: 12, margin: "4px 0 0", lineHeight: 1.5 }}>{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Kits */}
      <Card>
        <CardHeader title="Brand Kit Library" sub="Saved brand identities"
          action={
            <button style={{
              background: tokens.accent, color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Plus size={14} /> New Kit
            </button>
          }
        />
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {brandKits.map((kit) => (
            <div key={kit.name} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 16px", background: tokens.bg, borderRadius: 12,
              cursor: "pointer", transition: "background 0.15s",
              border: `1px solid transparent`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = tokens.surfaceHover; e.currentTarget.style.borderColor = tokens.border; }}
              onMouseLeave={e => { e.currentTarget.style.background = tokens.bg; e.currentTarget.style.borderColor = "transparent"; }}
            >
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {kit.colors.map((c, i) => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: `1px solid rgba(255,255,255,0.08)` }} />
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: tokens.text, fontSize: 14, fontWeight: 600 }}>{kit.name}</span>
                <p style={{ color: tokens.textMuted, fontSize: 11, margin: "2px 0 0" }}>{kit.font}</p>
              </div>
              <ChevronRight size={16} color={tokens.textMuted} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── ECOM HUB ────────────────────────────────────────────────────────────────

const EcomHubView = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? products : products.filter(p =>
    filter === "active" ? p.status === "active" : p.status === "out_of_stock"
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Ecom Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Stat label="Gross Revenue" value="$29.3K" delta="12.1%" deltaDir="up" icon={DollarSign} />
        <Stat label="Orders This Month" value="247" delta="9.4%" deltaDir="up" icon={ShoppingCart} />
        <Stat label="Active Products" value="34" delta="" icon={Package} />
        <Stat label="Storefront Views" value="18.4K" delta="22%" deltaDir="up" icon={Eye} />
      </div>

      {/* Products Table */}
      <Card>
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ color: tokens.text, fontSize: 15, fontWeight: 600, margin: 0 }}>Product Catalog</h3>
            <p style={{ color: tokens.textMuted, fontSize: 12, margin: "2px 0 0" }}>{products.length} products total</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["all", "active", "out_of_stock"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? tokens.accentMuted : "transparent",
                border: `1px solid ${filter === f ? tokens.accent : tokens.border}`,
                borderRadius: 8, padding: "7px 14px",
                color: filter === f ? tokens.accent : tokens.textMuted,
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}>
                {f === "all" ? "All" : f === "active" ? "Active" : "Out of Stock"}
              </button>
            ))}
            <button style={{
              background: tokens.accent, color: "#fff", border: "none", borderRadius: 8,
              padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Plus size={13} /> Add Product
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 80px 80px 70px 80px 50px",
          padding: "10px 24px", borderTop: `1px solid ${tokens.border}`,
          borderBottom: `1px solid ${tokens.border}`,
        }}>
          {["Product", "SKU", "Price", "Stock", "Revenue", ""].map((h, i) => (
            <span key={i} style={{ color: tokens.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: "grid", gridTemplateColumns: "1fr 80px 80px 70px 80px 50px",
            padding: "14px 24px", borderTop: i > 0 ? `1px solid ${tokens.border}` : "none",
            transition: "background 0.15s", cursor: "pointer", alignItems: "center",
          }}
            onMouseEnter={e => e.currentTarget.style.background = tokens.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: tokens.accentMuted, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Package size={14} color={tokens.accent} />
              </div>
              <div>
                <p style={{ color: tokens.text, fontSize: 13, fontWeight: 500, margin: 0 }}>{p.name}</p>
              </div>
            </div>
            <span style={{ color: tokens.textMuted, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{p.sku}</span>
            <span style={{ color: tokens.text, fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>${p.price}</span>
            <span style={{
              color: p.stock === 0 ? tokens.red : p.stock === "∞" ? tokens.green : tokens.text,
              fontSize: 13, fontFamily: "'DM Mono', monospace",
            }}>{p.stock}</span>
            <span style={{ color: tokens.text, fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>${p.revenue.toLocaleString()}</span>
            <Badge color={p.status === "active" ? "green" : "red"}>
              {p.status === "active" ? "Live" : "OOS"}
            </Badge>
          </div>
        ))}
      </Card>

      {/* Storefront Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ background: tokens.greenMuted, borderRadius: 12, padding: 12, display: "flex", flexShrink: 0 }}>
              <Globe size={20} color={tokens.green} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: tokens.text, fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>Storefront Live</h4>
              <p style={{ color: tokens.textMuted, fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>flashfusion.store is active and serving traffic</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge color="green"><div style={{ width: 6, height: 6, background: tokens.green, borderRadius: "50%" }} />Online</Badge>
                <Badge color="muted">SSL Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ background: tokens.amberMuted, borderRadius: 12, padding: 12, display: "flex", flexShrink: 0 }}>
              <Rocket size={20} color={tokens.amber} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: tokens.text, fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>Next Drop</h4>
              <p style={{ color: tokens.textMuted, fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>3 products scheduled — launching Mar 1</p>
              <button style={{
                background: tokens.amber, color: "#000", border: "none", borderRadius: 8,
                padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>Manage Drop</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── SHELL / LAYOUT ───────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "creator", icon: Palette, label: "Creator Studio" },
  { id: "ecom", icon: ShoppingBag, label: "Ecom Hub" },
];

export default function FlashFusion() {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchFocused, setSearchFocused] = useState(false);

  const viewTitles = {
    dashboard: { title: "Dashboard", sub: "Welcome back — here's your overview" },
    creator: { title: "Creator Studio", sub: "AI-powered brand kits, copy, and visuals" },
    ecom: { title: "Ecom Hub", sub: "Products, storefronts, and revenue" },
  };

  const current = viewTitles[activeView];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${tokens.bg}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${tokens.border}; border-radius: 99px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: ${tokens.textDim}; }
      `}</style>

      <div style={{
        display: "flex", height: "100vh", overflow: "hidden",
        background: tokens.bg, fontFamily: "'DM Sans', sans-serif",
        color: tokens.text,
      }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: 220, flexShrink: 0, background: tokens.surface,
          borderRight: `1px solid ${tokens.border}`,
          display: "flex", flexDirection: "column",
          padding: "0 0 24px",
        }}>
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${tokens.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Zap size={16} color="#fff" fill="#fff" />
              </div>
              <div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: tokens.text, letterSpacing: "-0.01em" }}>FlashFusion</span>
              </div>
            </div>
          </div>

          {/* Workspace badge */}
          <div style={{ padding: "14px 16px 10px" }}>
            <div style={{
              background: tokens.accentMuted, borderRadius: 10, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 20, height: 20, background: tokens.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700 }}>K</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: tokens.text, fontSize: 12, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Kyle's Workspace</p>
                <p style={{ color: tokens.textMuted, fontSize: 10, margin: 0 }}>Pro</p>
              </div>
              <ChevronDown size={12} color={tokens.textMuted} />
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "8px 10px", flex: 1 }}>
            <p style={{ color: tokens.textDim, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 10px 8px" }}>Navigation</p>
            {navItems.map(({ id, icon: Icon, label }) => {
              const active = activeView === id;
              return (
                <button key={id} onClick={() => setActiveView(id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? tokens.accentMuted : "transparent",
                  color: active ? tokens.accent : tokens.textMuted,
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  transition: "all 0.15s", marginBottom: 2, textAlign: "left",
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = tokens.surfaceHover; e.currentTarget.style.color = tokens.text; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = tokens.textMuted; } }}
                >
                  {active && <div style={{ width: 3, height: 16, background: tokens.accent, borderRadius: 99, position: "absolute", left: 10 }} />}
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "0 10px" }}>
            <div style={{
              background: `linear-gradient(135deg, ${tokens.accentMuted}, ${tokens.purpleMuted})`,
              border: `1px solid ${tokens.border}`, borderRadius: 12, padding: "14px 14px",
            }}>
              <p style={{ color: tokens.text, fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>Upgrade to Team</p>
              <p style={{ color: tokens.textMuted, fontSize: 11, margin: "0 0 10px", lineHeight: 1.5 }}>Collaborate with your team and unlock shared brand kits</p>
              <button style={{
                background: tokens.accent, color: "#fff", border: "none", borderRadius: 7,
                padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%",
              }}>Learn More</button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <header style={{
            height: 64, borderBottom: `1px solid ${tokens.border}`,
            display: "flex", alignItems: "center", padding: "0 28px",
            gap: 16, flexShrink: 0, background: tokens.surface,
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: tokens.text, margin: 0, letterSpacing: "-0.01em" }}>{current.title}</h1>
              <p style={{ color: tokens.textMuted, fontSize: 12, margin: 0 }}>{current.sub}</p>
            </div>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: tokens.bg, border: `1px solid ${searchFocused ? tokens.accent : tokens.border}`,
              borderRadius: 10, padding: "8px 14px", width: 260,
              transition: "border-color 0.15s",
            }}>
              <Search size={14} color={tokens.textMuted} />
              <input
                placeholder="Search…"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{ background: "none", border: "none", outline: "none", color: tokens.text, fontSize: 13, flex: 1, fontFamily: "inherit" }}
              />
              <kbd style={{ color: tokens.textDim, fontSize: 10, background: tokens.surface, borderRadius: 4, padding: "2px 5px", border: `1px solid ${tokens.border}` }}>⌘K</kbd>
            </div>

            {/* Notif + Avatar */}
            <button style={{
              background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 10,
              padding: 9, cursor: "pointer", color: tokens.textMuted, position: "relative", display: "flex",
            }}>
              <Bell size={16} />
              <div style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, background: tokens.red, borderRadius: "50%", border: `1.5px solid ${tokens.surface}` }} />
            </button>

            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, cursor: "pointer", flexShrink: 0,
            }}>K</div>
          </header>

          {/* Content */}
          <main style={{
            flex: 1, overflow: "auto", padding: 28,
            animation: "fadeIn 0.25s ease-out",
          }} key={activeView}>
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "creator" && <CreatorStudioView />}
            {activeView === "ecom" && <EcomHubView />}
          </main>
        </div>
      </div>
    </>
  );
}
