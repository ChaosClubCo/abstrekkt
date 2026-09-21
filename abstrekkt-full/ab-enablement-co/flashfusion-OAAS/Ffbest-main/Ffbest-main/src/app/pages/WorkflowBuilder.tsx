import React, { useState } from "react";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  ChevronRight,
  GitBranch,
  Mail,
  MessageSquare,
  Database,
  Filter,
  ArrowRight,
  Check,
  X,
  Activity,
  Clock,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
  Search,
  Webhook,
  Bell,
  FileText,
  Globe,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "filter" | "action" | "delay";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
  config?: Record<string, string>;
  active?: boolean;
}

const workflows = [
  {
    id: "wf1",
    name: "GitHub → Slack Alerts",
    desc: "Notifies team when PRs are opened",
    status: "active" as const,
    runs: 1240,
    lastRun: "2 min ago",
    nodes: [
      {
        id: "n1",
        type: "trigger" as const,
        title: "GitHub",
        subtitle: "New Pull Request",
        icon: GitBranch,
        iconBg: "rgba(255,255,255,0.05)",
        iconColor: "#e4e6f0",
        config: { repo: "devhub-core", branch: "main", event: "pull_request.opened" },
        active: true,
      },
      {
        id: "n2",
        type: "filter" as const,
        title: "Filter",
        subtitle: "Check conditions",
        icon: Filter,
        iconBg: "rgba(94,106,210,0.1)",
        iconColor: "#5e6ad2",
        config: { condition: "author != bot", filter: "Label contains 'urgent'" },
        active: true,
      },
      {
        id: "n3",
        type: "action" as const,
        title: "Slack",
        subtitle: "Send message",
        icon: MessageSquare,
        iconBg: "rgba(74,21,75,0.3)",
        iconColor: "#e01e5a",
        config: { channel: "#engineering", template: "New PR: {{pr.title}} by {{pr.author}}" },
        active: true,
      },
      {
        id: "n4",
        type: "action" as const,
        title: "Linear",
        subtitle: "Create issue",
        icon: Activity,
        iconBg: "rgba(94,106,210,0.15)",
        iconColor: "#5e6ad2",
        config: { project: "DevHub", team: "Engineering", priority: "Medium" },
        active: true,
      },
    ],
  },
  {
    id: "wf2",
    name: "Form → Notion Database",
    desc: "Saves form submissions to Notion",
    status: "active" as const,
    runs: 876,
    lastRun: "15 min ago",
    nodes: [
      {
        id: "n5",
        type: "trigger" as const,
        title: "Webhook",
        subtitle: "Form submission",
        icon: Webhook,
        iconBg: "rgba(34,197,94,0.1)",
        iconColor: "#22c55e",
        config: { endpoint: "/webhook/form-submit" },
        active: true,
      },
      {
        id: "n6",
        type: "action" as const,
        title: "Notion",
        subtitle: "Create page",
        icon: FileText,
        iconBg: "rgba(167,139,250,0.1)",
        iconColor: "#a78bfa",
        config: { database: "Customer Feedback", template: "Feedback Form" },
        active: true,
      },
      {
        id: "n7",
        type: "action" as const,
        title: "Email",
        subtitle: "Send confirmation",
        icon: Mail,
        iconBg: "rgba(251,146,60,0.1)",
        iconColor: "#fb923c",
        config: { to: "{{user.email}}", subject: "We received your submission" },
        active: true,
      },
    ],
  },
  {
    id: "wf3",
    name: "Stripe → Email Campaign",
    desc: "Sends emails on successful payments",
    status: "paused" as const,
    runs: 310,
    lastRun: "2 days ago",
    nodes: [
      {
        id: "n8",
        type: "trigger" as const,
        title: "Stripe",
        subtitle: "Payment succeeded",
        icon: Globe,
        iconBg: "rgba(99,91,255,0.1)",
        iconColor: "#635bff",
        config: { event: "payment_intent.succeeded" },
        active: false,
      },
      {
        id: "n9",
        type: "delay" as const,
        title: "Delay",
        subtitle: "Wait 5 minutes",
        icon: Clock,
        iconBg: "rgba(107,112,148,0.1)",
        iconColor: "#6b7094",
        config: { duration: "5", unit: "minutes" },
        active: false,
      },
      {
        id: "n10",
        type: "action" as const,
        title: "SendGrid",
        subtitle: "Send email",
        icon: Mail,
        iconBg: "rgba(29,169,158,0.1)",
        iconColor: "#1da99e",
        config: { template: "purchase-confirmation", from: "noreply@devhub.io" },
        active: false,
      },
    ],
  },
];

function WorkflowNode({
  node,
  isSelected,
  onClick,
  isLast,
}: {
  node: WorkflowNode;
  isSelected: boolean;
  onClick: () => void;
  isLast: boolean;
}) {
  const Icon = node.icon;
  const typeColors = {
    trigger: "#fb923c",
    filter: "#5e6ad2",
    action: "#22c55e",
    delay: "#f59e0b",
  };

  return (
    <div className="flex items-center gap-0">
      <div className="flex flex-col items-center gap-0">
        {/* Node badge */}
        <div
          className="px-1.5 py-0.5 rounded mb-1.5"
          style={{
            background: `${typeColors[node.type]}18`,
            color: typeColors[node.type],
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {node.type}
        </div>

        {/* Node card */}
        <button
          onClick={onClick}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-150"
          style={{
            background: isSelected ? "#1a1b2e" : "#12121e",
            border: `1.5px solid ${isSelected ? "#5e6ad2" : "#1c1d2e"}`,
            width: 130,
            boxShadow: isSelected
              ? "0 0 0 3px rgba(94,106,210,0.15)"
              : "none",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: node.iconBg }}
          >
            <Icon size={18} style={{ color: node.iconColor }} />
          </div>
          <div className="text-center">
            <p
              style={{
                color: "#d4d8f0",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              {node.title}
            </p>
            <p
              style={{
                color: "#4a4f70",
                fontSize: "0.65rem",
                lineHeight: 1.3,
                marginTop: 2,
              }}
            >
              {node.subtitle}
            </p>
          </div>
        </button>

        {/* Active indicator */}
        {node.active && (
          <div className="flex items-center gap-1 mt-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e" }}
            />
            <span style={{ color: "#22c55e", fontSize: "0.6rem" }}>Active</span>
          </div>
        )}
      </div>

      {/* Connector */}
      {!isLast && (
        <div className="flex items-center mx-1 mt-4">
          <div style={{ width: 24, height: 1.5, background: "#252540" }} />
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#1a1b2e", border: "1px solid #252540" }}
          >
            <ArrowRight size={10} style={{ color: "#4a4f70" }} />
          </div>
          <div style={{ width: 24, height: 1.5, background: "#252540" }} />
        </div>
      )}
    </div>
  );
}

export function WorkflowBuilder() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkflows = workflows.filter(
    (wf) =>
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
    >
      {/* Left: Workflow List */}
      <div
        className="flex flex-col"
        style={{
          width: 280,
          borderRight: "1px solid #1c1d2e",
          background: "#0a0b11",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <span
            style={{
              color: "#e4e6f0",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Workflows
          </span>
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{
              background: "#5e6ad2",
              color: "#fff",
            }}
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="px-3 pt-3">
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3"
            style={{ background: "#1a1b2e", border: "1px solid #252540" }}
          >
            <Search size={12} style={{ color: "#4a4f70" }} />
            <input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1"
              style={{ color: "#e4e6f0", fontSize: "0.75rem" }}
            />
          </div>
        </div>

        <div className="px-3 flex flex-col gap-1.5">
          {filteredWorkflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => {
                setSelectedWorkflow(wf);
                setSelectedNode(null);
              }}
              className="p-3 rounded-xl text-left transition-all duration-150"
              style={{
                background:
                  selectedWorkflow.id === wf.id ? "#1a1b2e" : "transparent",
                border: `1px solid ${
                  selectedWorkflow.id === wf.id ? "#252540" : "transparent"
                }`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{
                    color: "#d4d8f0",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {wf.name}
                </span>
                <div className="flex items-center gap-1">
                  {wf.status === "active" ? (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#22c55e" }}
                      />
                      <span style={{ color: "#22c55e", fontSize: "0.62rem" }}>
                        On
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#f59e0b" }}
                      />
                      <span style={{ color: "#f59e0b", fontSize: "0.62rem" }}>
                        Off
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p
                className="line-clamp-1"
                style={{ color: "#4a4f70", fontSize: "0.7rem", marginBottom: 6 }}
              >
                {wf.desc}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Activity size={10} style={{ color: "#4a4f70" }} />
                  <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                    {wf.runs.toLocaleString()} runs
                  </span>
                </div>
                <span style={{ color: "#2a2c44", fontSize: "0.65rem" }}>·</span>
                <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                  {wf.lastRun}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Add new */}
        <div className="p-3 mt-auto" style={{ borderTop: "1px solid #1c1d2e" }}>
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all"
            style={{
              background: "rgba(94,106,210,0.1)",
              border: "1px dashed #252540",
              color: "#5e6ad2",
              fontSize: "0.78rem",
            }}
          >
            <Plus size={13} />
            Create workflow
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Canvas Header */}
        <div
          className="flex items-center justify-between px-6 py-3.5"
          style={{ borderBottom: "1px solid #1c1d2e", background: "#0c0d14" }}
        >
          <div>
            <h2
              style={{
                color: "#e4e6f0",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {selectedWorkflow.name}
            </h2>
            <p style={{ color: "#4a4f70", fontSize: "0.72rem" }}>
              {selectedWorkflow.desc} ·{" "}
              <span style={{ color: "#22c55e" }}>
                {selectedWorkflow.runs.toLocaleString()} runs
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "#1a1b2e",
                border: "1px solid #252540",
                color: "#6b7094",
                fontSize: "0.78rem",
              }}
            >
              <RefreshCw size={12} />
              Test
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "#1a1b2e",
                border: "1px solid #252540",
                color: "#6b7094",
                fontSize: "0.78rem",
              }}
            >
              <Settings size={12} />
              Settings
            </button>
            {selectedWorkflow.status === "active" ? (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#f59e0b",
                  fontSize: "0.78rem",
                }}
              >
                <Pause size={12} />
                Pause
              </button>
            ) : (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "#5e6ad2",
                  color: "#fff",
                  fontSize: "0.78rem",
                }}
              >
                <Play size={12} />
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Canvas Content */}
        <div
          className="flex-1 overflow-auto flex flex-col"
          style={{ background: "#09090f" }}
        >
          {/* Flow diagram */}
          <div className="flex items-start justify-center px-10 py-16 gap-0">
            {selectedWorkflow.nodes.map((node, i) => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={() =>
                  setSelectedNode(
                    selectedNode?.id === node.id ? null : (node as WorkflowNode)
                  )
                }
                isLast={i === selectedWorkflow.nodes.length - 1}
              />
            ))}

            {/* Add step button */}
            <div className="flex items-center ml-4">
              <div style={{ width: 20, height: 1.5, background: "#252540" }} />
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: "#1a1b2e",
                  border: "1px dashed #252540",
                  color: "#4a4f70",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#5e6ad2";
                  (e.currentTarget as HTMLElement).style.color = "#5e6ad2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#252540";
                  (e.currentTarget as HTMLElement).style.color = "#4a4f70";
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Run history */}
          <div
            className="mx-10 mb-8 rounded-2xl p-5"
            style={{ background: "#0f1018", border: "1px solid #1c1d2e" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                style={{
                  color: "#d4d8f0",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Run History
              </span>
              <span style={{ color: "#4a4f70", fontSize: "0.72rem" }}>
                Last 5 runs
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { time: "2 min ago", duration: "1.2s", status: "success", trigger: "PR #847 opened" },
                { time: "18 min ago", duration: "0.8s", status: "success", trigger: "PR #846 opened" },
                { time: "1h ago", duration: "1.5s", status: "success", trigger: "PR #845 opened" },
                { time: "3h ago", duration: "0.9s", status: "error", trigger: "PR #844 opened" },
                { time: "5h ago", duration: "1.1s", status: "success", trigger: "PR #843 opened" },
              ].map((run, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-3 py-2 rounded-lg"
                  style={{ background: "#12121e", border: "1px solid #1c1d2e" }}
                >
                  <div className="flex items-center gap-1.5">
                    {run.status === "success" ? (
                      <Check size={12} style={{ color: "#22c55e" }} />
                    ) : (
                      <AlertCircle size={12} style={{ color: "#ef4444" }} />
                    )}
                    <span
                      style={{
                        color: run.status === "success" ? "#22c55e" : "#ef4444",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {run.status}
                    </span>
                  </div>
                  <span
                    className="flex-1"
                    style={{ color: "#8489a8", fontSize: "0.72rem" }}
                  >
                    {run.trigger}
                  </span>
                  <span style={{ color: "#4a4f70", fontSize: "0.68rem" }}>
                    {run.duration}
                  </span>
                  <span style={{ color: "#4a4f70", fontSize: "0.68rem" }}>
                    {run.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Node Config Panel */}
      {selectedNode && (
        <div
          className="flex flex-col"
          style={{
            width: 280,
            borderLeft: "1px solid #1c1d2e",
            background: "#0a0b11",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #1c1d2e" }}
          >
            <span
              style={{ color: "#d4d8f0", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Node Config
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ color: "#4a4f70" }}
            >
              <X size={13} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Node info */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: selectedNode.iconBg }}
              >
                <selectedNode.icon
                  size={16}
                  style={{ color: selectedNode.iconColor }}
                />
              </div>
              <div>
                <p
                  style={{
                    color: "#e4e6f0",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  {selectedNode.title}
                </p>
                <p style={{ color: "#4a4f70", fontSize: "0.7rem" }}>
                  {selectedNode.subtitle}
                </p>
              </div>
            </div>

            {/* Config fields */}
            {selectedNode.config && (
              <div className="flex flex-col gap-3">
                <p
                  style={{
                    color: "#6b7094",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Configuration
                </p>
                {Object.entries(selectedNode.config).map(([key, value]) => (
                  <div key={key}>
                    <label
                      style={{
                        color: "#6b7094",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        display: "block",
                        marginBottom: 4,
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      defaultValue={value}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{
                        background: "#1a1b2e",
                        border: "1px solid #252540",
                        color: "#d4d8f0",
                        fontSize: "0.75rem",
                      }}
                      onFocus={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          "#5e6ad2")
                      }
                      onBlur={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          "#252540")
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              className="py-2 rounded-xl transition-all"
              style={{
                background: "#5e6ad2",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 500,
              }}
            >
              Save Changes
            </button>

            <button
              className="py-2 rounded-xl transition-all"
              style={{
                background: "#1a1b2e",
                color: "#ef4444",
                fontSize: "0.78rem",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              Remove step
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
