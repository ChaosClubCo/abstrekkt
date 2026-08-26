import React, { useState } from "react";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  MoreHorizontal,
  Terminal,
  Star,
  Eye,
  GitFork,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Copy,
  Maximize2,
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  ext?: string;
  children?: FileNode[];
  modified?: boolean;
}

const fileTree: FileNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "app",
        name: "app",
        type: "folder",
        children: [
          { id: "app-tsx", name: "App.tsx", type: "file", ext: "tsx", modified: true },
          { id: "routes", name: "routes.tsx", type: "file", ext: "tsx" },
          {
            id: "components",
            name: "components",
            type: "folder",
            children: [
              { id: "navbar", name: "NavBar.tsx", type: "file", ext: "tsx", modified: true },
              { id: "root", name: "Root.tsx", type: "file", ext: "tsx" },
              { id: "feedback", name: "FeedbackModal.tsx", type: "file", ext: "tsx" },
            ],
          },
          {
            id: "pages",
            name: "pages",
            type: "folder",
            children: [
              { id: "dashboard", name: "Dashboard.tsx", type: "file", ext: "tsx" },
              { id: "kanban", name: "KanbanBoard.tsx", type: "file", ext: "tsx" },
              { id: "docs", name: "Documentation.tsx", type: "file", ext: "tsx" },
              { id: "workflow", name: "WorkflowBuilder.tsx", type: "file", ext: "tsx" },
              { id: "code", name: "CodeEditor.tsx", type: "file", ext: "tsx" },
            ],
          },
        ],
      },
      {
        id: "styles",
        name: "styles",
        type: "folder",
        children: [
          { id: "theme", name: "theme.css", type: "file", ext: "css" },
          { id: "global", name: "global.css", type: "file", ext: "css" },
        ],
      },
    ],
  },
  { id: "package", name: "package.json", type: "file", ext: "json" },
  { id: "tsconfig", name: "tsconfig.json", type: "file", ext: "json" },
  { id: "vite", name: "vite.config.ts", type: "file", ext: "ts" },
];

const codeContent: Record<string, { lang: string; code: string }> = {
  "app-tsx": {
    lang: "TypeScript",
    code: `import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}`,
  },
  "navbar": {
    lang: "TypeScript",
    code: `import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  Zap,
  Code2,
  Bell,
  Search,
  MessageSquarePlus,
  GitBranch,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/kanban", label: "Kanban", icon: ListChecks },
  { path: "/docs", label: "Docs", icon: FileText },
  { path: "/workflow", label: "Workflow", icon: Zap },
  { path: "/code", label: "Code", icon: Code2 },
];

interface NavBarProps {
  onFeedback: () => void;
}

export function NavBar({ onFeedback }: NavBarProps) {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-2"
      style={{
        height: 56,
        background: "rgba(8, 9, 14, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1c1d2e",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-3 shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)" }}
        >
          <GitBranch size={14} color="#fff" />
        </div>
        <span style={{ color: "#e4e6f0", fontSize: "0.9rem", fontWeight: 700 }}>
          DevHub
        </span>
      </Link>
    </nav>
  );
}`,
  },
  "dashboard": {
    lang: "TypeScript",
    code: `import React, { useState } from "react";
import { Link } from "react-router";
import {
  GitBranch, Star, GitFork, ExternalLink,
  FileText, Clock, Zap, CheckCircle2,
  TrendingUp, Users, Activity, ArrowRight,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid } from "recharts";

const stats = [
  { label: "Repositories", value: "24", icon: GitBranch, color: "#58a6ff" },
  { label: "Active Docs", value: "87", icon: FileText, color: "#a78bfa" },
  { label: "Automations", value: "19", icon: Zap, color: "#fb923c" },
  { label: "Team Members", value: "31", icon: Users, color: "#34d399" },
];

export function Dashboard() {
  return (
    <div className="min-h-full px-6 py-6">
      <h1>Good morning, Jordan 👋</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl">
            <Icon size={15} style={{ color }} />
            <p>{value}</p>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: GitHub | Notion | Zapier */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* GitHub Repos */}
        {/* Notion Docs */}
        {/* Zapier Automations */}
      </div>
    </div>
  );
}`,
  },
};

const commits = [
  {
    id: "a4f2e1",
    msg: "feat: add kanban drag-and-drop",
    author: "Jordan Lee",
    initials: "JL",
    avatarColor: "#f59e0b",
    time: "2h ago",
    status: "success",
  },
  {
    id: "b8c3d9",
    msg: "fix: auth token refresh logic",
    author: "Alex Chen",
    initials: "AC",
    avatarColor: "#5e6ad2",
    time: "5h ago",
    status: "success",
  },
  {
    id: "c1e7a2",
    msg: "refactor: workflow builder SVG",
    author: "Sam Rivera",
    initials: "SR",
    avatarColor: "#22c55e",
    time: "8h ago",
    status: "failed",
  },
  {
    id: "d5f6b3",
    msg: "docs: update API documentation",
    author: "Morgan Kim",
    initials: "MK",
    avatarColor: "#a78bfa",
    time: "1d ago",
    status: "success",
  },
  {
    id: "e2g4h8",
    msg: "chore: upgrade dependencies",
    author: "Jordan Lee",
    initials: "JL",
    avatarColor: "#f59e0b",
    time: "1d ago",
    status: "success",
  },
  {
    id: "f9i2j1",
    msg: "feat: add notification system",
    author: "Alex Chen",
    initials: "AC",
    avatarColor: "#5e6ad2",
    time: "2d ago",
    status: "success",
  },
];

function getFileIcon(ext?: string) {
  switch (ext) {
    case "tsx":
    case "ts":
      return <FileCode size={13} style={{ color: "#5e6ad2" }} />;
    case "css":
      return <FileText size={13} style={{ color: "#fb923c" }} />;
    case "json":
      return <File size={13} style={{ color: "#22c55e" }} />;
    default:
      return <File size={13} style={{ color: "#6b7094" }} />;
  }
}

function getKeywordColor(token: string): string | null {
  const keywords = ["import", "export", "default", "from", "const", "let", "var", "function", "return", "interface", "type", "class", "extends", "implements", "new", "this", "if", "else", "for", "while", "async", "await", "try", "catch", "throw", "typeof", "null", "undefined", "true", "false"];
  const types = ["string", "number", "boolean", "void", "any", "object", "Array", "Record", "Promise"];
  if (keywords.includes(token)) return "#a78bfa";
  if (types.includes(token)) return "#fb923c";
  return null;
}

function SyntaxLine({ line }: { line: string }) {
  if (line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("/*") || line.trim().startsWith("*/")) {
    return <span style={{ color: "#4a4f70" }}>{line}</span>;
  }
  if (line.trim().startsWith("import ") || line.trim().startsWith("export ")) {
    const parts = line.split(/(".*?"|'.*?')/g);
    return (
      <span>
        {parts.map((part, i) =>
          (part.startsWith('"') && part.endsWith('"')) ||
          (part.startsWith("'") && part.endsWith("'")) ? (
            <span key={i} style={{ color: "#22c55e" }}>{part}</span>
          ) : (
            <span key={i}>
              {part.split(/\b/).map((token, j) => {
                const color = getKeywordColor(token);
                return color ? (
                  <span key={j} style={{ color }}>{token}</span>
                ) : (
                  <span key={j} style={{ color: "#d4d8f0" }}>{token}</span>
                );
              })}
            </span>
          )
        )}
      </span>
    );
  }

  const parts = line.split(/(".*?"|'.*?'|`.*?`)/g);
  return (
    <span>
      {parts.map((part, i) =>
        (part.startsWith('"') && part.endsWith('"')) ||
        (part.startsWith("'") && part.endsWith("'")) ||
        (part.startsWith("`") && part.endsWith("`")) ? (
          <span key={i} style={{ color: "#22c55e" }}>{part}</span>
        ) : (
          <span key={i}>
            {part.split(/\b/).map((token, j) => {
              const color = getKeywordColor(token);
              return color ? (
                <span key={j} style={{ color }}>{token}</span>
              ) : token.match(/^[0-9]+$/) ? (
                <span key={j} style={{ color: "#fb923c" }}>{token}</span>
              ) : (
                <span key={j} style={{ color: "#d4d8f0" }}>{token}</span>
              );
            })}
          </span>
        )
      )}
    </span>
  );
}

function FileTreeNode({
  node,
  depth,
  selectedFile,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedFile: string;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "folder") {
    return (
      <div>
        <button
          className="w-full flex items-center gap-1.5 py-0.5 px-1 rounded transition-all"
          style={{ paddingLeft: depth * 12 + 4 }}
          onClick={() => setExpanded(!expanded)}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          {expanded ? (
            <ChevronDown size={11} style={{ color: "#4a4f70" }} />
          ) : (
            <ChevronRight size={11} style={{ color: "#4a4f70" }} />
          )}
          {expanded ? (
            <FolderOpen size={13} style={{ color: "#fb923c" }} />
          ) : (
            <Folder size={13} style={{ color: "#fb923c" }} />
          )}
          <span style={{ color: "#a0a4c4", fontSize: "0.75rem" }}>
            {node.name}
          </span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="w-full flex items-center gap-1.5 py-0.5 px-1 rounded transition-all"
      style={{
        paddingLeft: depth * 12 + 4,
        background: selectedFile === node.id ? "#1a1b2e" : "transparent",
      }}
      onClick={() => onSelect(node.id)}
      onMouseEnter={(e) => {
        if (selectedFile !== node.id)
          (e.currentTarget as HTMLElement).style.background = "#13141f";
      }}
      onMouseLeave={(e) => {
        if (selectedFile !== node.id)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {getFileIcon(node.ext)}
      <span
        style={{
          color: selectedFile === node.id ? "#e4e6f0" : "#7a7f9a",
          fontSize: "0.75rem",
          flex: 1,
          textAlign: "left",
        }}
      >
        {node.name}
      </span>
      {node.modified && (
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#fb923c", marginRight: 2 }}
        />
      )}
    </button>
  );
}

export function CodeEditor() {
  const [selectedFile, setSelectedFile] = useState("navbar");
  const [activeTab, setSelectedTab] = useState<"editor" | "history">("editor");

  const currentCode = codeContent[selectedFile] || codeContent["dashboard"];
  const codeLines = currentCode.code.split("\n");

  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
    >
      {/* File Tree */}
      <div
        className="flex flex-col"
        style={{
          width: 220,
          borderRight: "1px solid #1c1d2e",
          background: "#0a0b11",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        {/* Repo header */}
        <div
          className="px-3 py-2.5 flex items-center justify-between"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <div className="flex items-center gap-1.5">
            <GitBranch size={12} style={{ color: "#58a6ff" }} />
            <span style={{ color: "#58a6ff", fontSize: "0.75rem", fontWeight: 600 }}>
              devhub-core
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>main</span>
            <ChevronDown size={10} style={{ color: "#4a4f70" }} />
          </div>
        </div>

        {/* Repo stats */}
        <div
          className="flex items-center gap-3 px-3 py-2"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <div className="flex items-center gap-1">
            <Star size={10} style={{ color: "#f59e0b" }} />
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>2.8k</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork size={10} style={{ color: "#4a4f70" }} />
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>342</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={10} style={{ color: "#4a4f70" }} />
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>891</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2" style={{ borderBottom: "1px solid #1c1d2e" }}>
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={{ background: "#1a1b2e", border: "1px solid #252540" }}
          >
            <Search size={11} style={{ color: "#4a4f70" }} />
            <input
              placeholder="Find file..."
              className="bg-transparent outline-none flex-1"
              style={{ color: "#e4e6f0", fontSize: "0.72rem" }}
            />
          </div>
        </div>

        {/* File tree */}
        <div className="p-2 flex flex-col gap-0">
          {fileTree.map((node) => (
            <FileTreeNode
              key={node.id}
              node={node}
              depth={0}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
            />
          ))}
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor header */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid #1c1d2e", background: "#0c0d14" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileCode size={13} style={{ color: "#5e6ad2" }} />
              <span style={{ color: "#d4d8f0", fontSize: "0.78rem", fontWeight: 500 }}>
                {selectedFile === "navbar" ? "NavBar.tsx" : selectedFile === "dashboard" ? "Dashboard.tsx" : "App.tsx"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#fb923c" }} />
              <span style={{ color: "#4a4f70", fontSize: "0.68rem" }}>Modified</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#4a4f70", fontSize: "0.72rem" }}>
              {currentCode.lang}
            </span>
            <button
              className="w-6 h-6 rounded flex items-center justify-center transition-all"
              style={{ color: "#4a4f70" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Copy size={12} />
            </button>
            <button
              className="w-6 h-6 rounded flex items-center justify-center transition-all"
              style={{ color: "#4a4f70" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid #1c1d2e", background: "#0c0d14" }}
        >
          {[
            { id: "editor", label: "Editor", icon: FileCode },
            { id: "history", label: "Commit History", icon: GitCommit },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className="flex items-center gap-1.5 px-4 py-2 transition-all"
              style={{
                color: activeTab === id ? "#e4e6f0" : "#4a4f70",
                borderBottom: `2px solid ${activeTab === id ? "#5e6ad2" : "transparent"}`,
                fontSize: "0.78rem",
                background: "transparent",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto" style={{ background: "#080910" }}>
          {activeTab === "editor" ? (
            <div className="py-4">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className="flex hover:bg-[#1a1b2e]"
                  style={{ paddingRight: 24 }}
                >
                  <span
                    className="select-none shrink-0 text-right pr-4"
                    style={{
                      color: "#2a2c44",
                      fontSize: "0.78rem",
                      fontFamily: "monospace",
                      width: 50,
                      paddingTop: 1,
                      paddingBottom: 1,
                      userSelect: "none",
                    }}
                  >
                    {i + 1}
                  </span>
                  <pre
                    style={{
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      fontSize: "0.78rem",
                      lineHeight: 1.7,
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <SyntaxLine line={line} />
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-3">
              {commits.map((commit) => (
                <div
                  key={commit.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: "#0f1018",
                    border: "1px solid #1c1d2e",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "#252540")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "#1c1d2e")
                  }
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: commit.avatarColor }}
                  >
                    <span
                      style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 700 }}
                    >
                      {commit.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{ color: "#d4d8f0", fontSize: "0.78rem", fontWeight: 500 }}
                    >
                      {commit.msg}
                    </p>
                    <p style={{ color: "#4a4f70", fontSize: "0.68rem", marginTop: 2 }}>
                      {commit.author} ·{" "}
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#58a6ff",
                        }}
                      >
                        {commit.id}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {commit.status === "success" ? (
                      <CheckCircle size={13} style={{ color: "#22c55e" }} />
                    ) : commit.status === "failed" ? (
                      <XCircle size={13} style={{ color: "#ef4444" }} />
                    ) : (
                      <AlertCircle size={13} style={{ color: "#f59e0b" }} />
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={11} style={{ color: "#4a4f70" }} />
                      <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                        {commit.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className="flex items-center gap-4 px-4 py-1.5"
          style={{ borderTop: "1px solid #1c1d2e", background: "#0c0d14" }}
        >
          <div className="flex items-center gap-1.5">
            <GitBranch size={11} style={{ color: "#5e6ad2" }} />
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>main</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
            <span style={{ color: "#22c55e", fontSize: "0.65rem" }}>No issues</span>
          </div>
          <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>UTF-8</span>
          <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>Ln {codeLines.length}, Col 1</span>
          <div className="ml-auto flex items-center gap-1">
            <Terminal size={11} style={{ color: "#4a4f70" }} />
            <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>TypeScript</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Git Info */}
      <div
        className="flex flex-col"
        style={{
          width: 240,
          borderLeft: "1px solid #1c1d2e",
          background: "#0a0b11",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <p style={{ color: "#8489a8", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Source Control
          </p>
        </div>

        {/* Branch info */}
        <div
          className="p-4"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <GitBranch size={12} style={{ color: "#5e6ad2" }} />
              <span style={{ color: "#d4d8f0", fontSize: "0.75rem", fontWeight: 600 }}>
                main
              </span>
            </div>
            <button
              className="flex items-center gap-1 px-2 py-0.5 rounded"
              style={{ background: "#1a1b2e", color: "#6b7094", fontSize: "0.65rem" }}
            >
              <RefreshCw size={10} />
              Sync
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "Ahead", value: "2 commits", color: "#22c55e" },
              { label: "Behind", value: "0 commits", color: "#4a4f70" },
              { label: "Changed files", value: "3 files", color: "#fb923c" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ color: "#4a4f70", fontSize: "0.7rem" }}>{label}</span>
                <span style={{ color, fontSize: "0.7rem", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pull requests */}
        <div className="p-4" style={{ borderBottom: "1px solid #1c1d2e" }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: "#8489a8", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Open PRs
            </span>
            <button
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: "#5e6ad2", color: "#fff" }}
            >
              <Plus size={11} />
            </button>
          </div>
          {[
            { id: "#847", title: "Add kanban DnD", from: "feature/kanban", reviews: 2, color: "#22c55e" },
            { id: "#845", title: "Fix auth bug", from: "fix/auth", reviews: 1, color: "#f59e0b" },
            { id: "#843", title: "API rate limiting", from: "feature/rate-limit", reviews: 0, color: "#ef4444" },
          ].map((pr) => (
            <div
              key={pr.id}
              className="py-2 flex flex-col gap-1 cursor-pointer"
              style={{ borderBottom: "1px solid #1c1d2e" }}
            >
              <div className="flex items-center gap-1.5">
                <GitPullRequest size={11} style={{ color: pr.color }} />
                <span style={{ color: "#d4d8f0", fontSize: "0.73rem", fontWeight: 500 }}>
                  {pr.title}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>{pr.id}</span>
                <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>·</span>
                <span style={{ color: "#58a6ff", fontSize: "0.65rem" }}>{pr.from}</span>
                {pr.reviews > 0 && (
                  <>
                    <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>·</span>
                    <span style={{ color: "#22c55e", fontSize: "0.62rem" }}>
                      {pr.reviews} review{pr.reviews > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 flex flex-col gap-2">
          {[
            { label: "Commit changes", icon: GitCommit, primary: true },
            { label: "Create branch", icon: GitBranch, primary: false },
            { label: "Merge PR", icon: GitMerge, primary: false },
          ].map(({ label, icon: Icon, primary }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{
                background: primary ? "#5e6ad2" : "#1a1b2e",
                border: primary ? "none" : "1px solid #252540",
                color: primary ? "#fff" : "#6b7094",
                fontSize: "0.75rem",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
