import React, { useState } from "react";
import { Link } from "react-router";
import {
  GitBranch,
  Star,
  GitFork,
  Circle,
  ExternalLink,
  FileText,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  PauseCircle,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  RefreshCw,
  Lock,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Mock data
const repoData = [
  {
    id: 1,
    name: "devhub-core",
    desc: "Core library for DevHub integrations",
    stars: 2840,
    forks: 342,
    lang: "TypeScript",
    langColor: "#3178c6",
    updated: "2h ago",
    private: false,
    topics: ["typescript", "sdk"],
  },
  {
    id: 2,
    name: "ui-components",
    desc: "Shared design system and React components",
    stars: 1290,
    forks: 87,
    lang: "TSX",
    langColor: "#61dafb",
    updated: "5h ago",
    private: false,
    topics: ["react", "design-system"],
  },
  {
    id: 3,
    name: "api-gateway",
    desc: "GraphQL API gateway with rate limiting",
    stars: 980,
    forks: 124,
    lang: "Go",
    langColor: "#00add8",
    updated: "1d ago",
    private: true,
    topics: ["graphql", "api"],
  },
  {
    id: 4,
    name: "data-pipeline",
    desc: "Streaming data processing pipeline",
    stars: 543,
    forks: 61,
    lang: "Python",
    langColor: "#3572A5",
    updated: "3d ago",
    private: true,
    topics: ["python", "streaming"],
  },
  {
    id: 5,
    name: "mobile-app",
    desc: "Cross-platform mobile application",
    stars: 417,
    forks: 39,
    lang: "Swift",
    langColor: "#fa7343",
    updated: "5d ago",
    private: false,
    topics: ["ios", "android"],
  },
  {
    id: 6,
    name: "infra-terraform",
    desc: "Infrastructure as code with Terraform",
    stars: 265,
    forks: 28,
    lang: "HCL",
    langColor: "#7b42bc",
    updated: "1w ago",
    private: true,
    topics: ["terraform", "aws"],
  },
];

const notionDocs = [
  {
    id: 1,
    title: "Product Roadmap Q3 2026",
    icon: "🗺️",
    edited: "Just now",
    by: "You",
    type: "Database",
  },
  {
    id: 2,
    title: "Engineering Design Principles",
    icon: "⚙️",
    edited: "2h ago",
    by: "Alex Chen",
    type: "Doc",
  },
  {
    id: 3,
    title: "API Documentation v2.0",
    icon: "📘",
    edited: "Yesterday",
    by: "Sam Rivera",
    type: "Doc",
  },
  {
    id: 4,
    title: "Sprint Planning — May 2026",
    icon: "📅",
    edited: "2d ago",
    by: "Jordan Lee",
    type: "Page",
  },
  {
    id: 5,
    title: "Onboarding Checklist",
    icon: "✅",
    edited: "3d ago",
    by: "You",
    type: "Template",
  },
  {
    id: 6,
    title: "Team Handbook",
    icon: "📖",
    edited: "1w ago",
    by: "Morgan Kim",
    type: "Doc",
  },
];

const zapierZaps = [
  {
    id: 1,
    name: "GitHub → Slack Alerts",
    trigger: "New PR opened",
    action: "Post message",
    status: "active",
    runs: 1240,
    lastRun: "2m ago",
  },
  {
    id: 2,
    name: "Form → Notion Database",
    trigger: "New submission",
    action: "Create page",
    status: "active",
    runs: 876,
    lastRun: "15m ago",
  },
  {
    id: 3,
    name: "Linear → GitHub Issues",
    trigger: "Issue created",
    action: "Create issue",
    status: "active",
    runs: 542,
    lastRun: "1h ago",
  },
  {
    id: 4,
    name: "Stripe → Email Campaign",
    trigger: "Payment success",
    action: "Send email",
    status: "paused",
    runs: 310,
    lastRun: "2d ago",
  },
  {
    id: 5,
    name: "Calendar → Daily Brief",
    trigger: "Event starts",
    action: "Slack DM",
    status: "error",
    runs: 89,
    lastRun: "4h ago",
  },
];

const activityData = [
  { day: "Mon", commits: 12, prs: 3, reviews: 5 },
  { day: "Tue", commits: 28, prs: 7, reviews: 11 },
  { day: "Wed", commits: 18, prs: 4, reviews: 8 },
  { day: "Thu", commits: 35, prs: 9, reviews: 15 },
  { day: "Fri", commits: 22, prs: 6, reviews: 9 },
  { day: "Sat", commits: 8, prs: 1, reviews: 2 },
  { day: "Sun", commits: 14, prs: 3, reviews: 4 },
];

const stats = [
  {
    label: "Repositories",
    value: "24",
    change: "+3 this month",
    icon: GitBranch,
    color: "#58a6ff",
    bg: "rgba(88,166,255,0.1)",
  },
  {
    label: "Active Docs",
    value: "87",
    change: "+12 this week",
    icon: FileText,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
  },
  {
    label: "Automations",
    value: "19",
    change: "4 need attention",
    icon: Zap,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
  },
  {
    label: "Team Members",
    value: "31",
    change: "+2 this month",
    icon: Users,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { icon: CheckCircle2, color: "#22c55e", label: "Active" },
    paused: { icon: PauseCircle, color: "#f59e0b", label: "Paused" },
    error: { icon: XCircle, color: "#ef4444", label: "Error" },
  }[status] || { icon: Circle, color: "#6b7094", label: status };

  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1">
      <Icon size={11} style={{ color: config.color }} />
      <span style={{ color: config.color, fontSize: "0.7rem", fontWeight: 500 }}>
        {config.label}
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  color,
  linkTo,
  count,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  linkTo: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon size={12} style={{ color }} />
        </div>
        <span
          style={{ color: "#e4e6f0", fontSize: "0.85rem", fontWeight: 600 }}
        >
          {title}
        </span>
        {count !== undefined && (
          <span
            className="px-1.5 py-0.5 rounded"
            style={{
              background: "#1a1b2e",
              color: "#6b7094",
              fontSize: "0.7rem",
            }}
          >
            {count}
          </span>
        )}
      </div>
      <Link
        to={linkTo}
        className="flex items-center gap-1 transition-all"
        style={{ color: "#5e6ad2", fontSize: "0.75rem" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#8b99f5")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#5e6ad2")
        }
      >
        View all <ArrowRight size={11} />
      </Link>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg"
        style={{
          background: "#1a1b2e",
          border: "1px solid #252540",
          fontSize: "0.75rem",
        }}
      >
        <p style={{ color: "#8489a8", marginBottom: 4 }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const [activeRepo, setActiveRepo] = useState<number | null>(null);

  return (
    <div
      className="min-h-full px-6 py-6"
      style={{ maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{
              color: "#e4e6f0",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Good morning, Jordan 👋
          </h1>
          <p style={{ color: "#6b7094", fontSize: "0.82rem", marginTop: 2 }}>
            Sunday, May 10, 2026 · You have 3 PRs awaiting review
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: "#1a1b2e",
            border: "1px solid #252540",
            color: "#8489a8",
            fontSize: "0.8rem",
          }}
        >
          <RefreshCw size={13} />
          Sync all
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="p-4 rounded-xl"
            style={{
              background: "#12121e",
              border: "1px solid #1c1d2e",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={15} style={{ color }} />
              </div>
              <TrendingUp size={12} style={{ color: "#22c55e" }} />
            </div>
            <p
              style={{
                color: "#e4e6f0",
                fontSize: "1.6rem",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {value}
            </p>
            <p style={{ color: "#6b7094", fontSize: "0.72rem", marginTop: 4 }}>
              {label}
            </p>
            <p
              style={{
                color: "#22c55e",
                fontSize: "0.7rem",
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        {/* GitHub Repos */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#12121e", border: "1px solid #1c1d2e" }}
        >
          <SectionHeader
            title="GitHub Repositories"
            icon={GitBranch}
            color="#58a6ff"
            linkTo="/code"
            count={24}
          />
          <div className="flex flex-col gap-2">
            {repoData.map((repo) => (
              <div
                key={repo.id}
                className="p-3 rounded-lg transition-all duration-150 cursor-pointer"
                style={{
                  background:
                    activeRepo === repo.id ? "#1a1b2e" : "#0f1018",
                  border: `1px solid ${activeRepo === repo.id ? "#2d2f4a" : "#16172a"}`,
                }}
                onMouseEnter={() => setActiveRepo(repo.id)}
                onMouseLeave={() => setActiveRepo(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {repo.private ? (
                      <Lock size={11} style={{ color: "#f59e0b" }} />
                    ) : (
                      <Globe size={11} style={{ color: "#22c55e" }} />
                    )}
                    <span
                      style={{
                        color: "#58a6ff",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {repo.name}
                    </span>
                  </div>
                  <ExternalLink size={11} style={{ color: "#3a3c5a" }} />
                </div>
                <p
                  style={{
                    color: "#6b7094",
                    fontSize: "0.72rem",
                    marginBottom: 6,
                  }}
                  className="line-clamp-1"
                >
                  {repo.desc}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: repo.langColor }}
                    />
                    <span style={{ color: "#8489a8", fontSize: "0.68rem" }}>
                      {repo.lang}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={10} style={{ color: "#8489a8" }} />
                    <span style={{ color: "#8489a8", fontSize: "0.68rem" }}>
                      {repo.stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={10} style={{ color: "#8489a8" }} />
                    <span style={{ color: "#8489a8", fontSize: "0.68rem" }}>
                      {repo.forks}
                    </span>
                  </div>
                  <span
                    className="ml-auto"
                    style={{ color: "#4a4f70", fontSize: "0.65rem" }}
                  >
                    {repo.updated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notion Docs */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#12121e", border: "1px solid #1c1d2e" }}
        >
          <SectionHeader
            title="Notion Documents"
            icon={FileText}
            color="#a78bfa"
            linkTo="/docs"
            count={87}
          />
          <div className="flex flex-col gap-1.5">
            {notionDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-150"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1a1b2e";
                  (e.currentTarget as HTMLElement).style.borderColor = "#252540";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "transparent";
                }}
              >
                <span style={{ fontSize: "1rem" }}>{doc.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{ color: "#d4d8f0", fontSize: "0.8rem", fontWeight: 500 }}
                  >
                    {doc.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={9} style={{ color: "#4a4f70" }} />
                    <span style={{ color: "#4a4f70", fontSize: "0.67rem" }}>
                      {doc.edited} · {doc.by}
                    </span>
                  </div>
                </div>
                <span
                  className="px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: "#1a1b2e",
                    color: "#5e6ad2",
                    fontSize: "0.62rem",
                    fontWeight: 500,
                  }}
                >
                  {doc.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Zapier Automations */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#12121e", border: "1px solid #1c1d2e" }}
        >
          <SectionHeader
            title="Zapier Automations"
            icon={Zap}
            color="#fb923c"
            linkTo="/workflow"
            count={19}
          />
          <div className="flex flex-col gap-2">
            {zapierZaps.map((zap) => (
              <div
                key={zap.id}
                className="p-3 rounded-lg transition-all duration-150 cursor-pointer"
                style={{
                  background: "#0f1018",
                  border: "1px solid #16172a",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1a1b2e";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2d2f4a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0f1018";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#16172a";
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p
                    style={{
                      color: "#d4d8f0",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {zap.name}
                  </p>
                  <StatusBadge status={zap.status} />
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(251,146,60,0.1)",
                      color: "#fb923c",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                    }}
                  >
                    {zap.trigger}
                  </span>
                  <ArrowRight size={10} style={{ color: "#4a4f70" }} />
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(94,106,210,0.1)",
                      color: "#5e6ad2",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                    }}
                  >
                    {zap.action}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Activity size={10} style={{ color: "#4a4f70" }} />
                    <span style={{ color: "#4a4f70", fontSize: "0.67rem" }}>
                      {zap.runs.toLocaleString()} runs
                    </span>
                  </div>
                  <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                    {zap.lastRun}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#12121e", border: "1px solid #1c1d2e" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(94,106,210,0.15)" }}
            >
              <Activity size={12} style={{ color: "#5e6ad2" }} />
            </div>
            <span
              style={{
                color: "#e4e6f0",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Activity Overview
            </span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Commits", color: "#5e6ad2" },
              { label: "Pull Requests", color: "#fb923c" },
              { label: "Reviews", color: "#34d399" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span style={{ color: "#6b7094", fontSize: "0.72rem" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={activityData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5e6ad2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5e6ad2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="reviewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1c1d2e"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "#4a4f70", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4a4f70", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#5e6ad2"
              strokeWidth={2}
              fill="url(#commitsGrad)"
            />
            <Area
              type="monotone"
              dataKey="prs"
              name="Pull Requests"
              stroke="#fb923c"
              strokeWidth={2}
              fill="url(#prsGrad)"
            />
            <Area
              type="monotone"
              dataKey="reviews"
              name="Reviews"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#reviewsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
