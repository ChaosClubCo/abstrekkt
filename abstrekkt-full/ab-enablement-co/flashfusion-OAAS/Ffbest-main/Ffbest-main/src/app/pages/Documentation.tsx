import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Folder,
  Plus,
  Search,
  MoreHorizontal,
  Hash,
  Link2,
  Code,
  Quote,
  List,
  ListOrdered,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Smile,
  Calendar,
  Star,
  Clock,
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  content: string;
  type: "text" | "code" | "callout" | "list";
  open?: boolean;
}

interface DocPage {
  id: string;
  title: string;
  icon: string;
  sections: DocSection[];
  lastEdited: string;
  author: string;
}

const docPages: DocPage[] = [
  {
    id: "roadmap",
    title: "Product Roadmap Q3 2026",
    icon: "🗺️",
    lastEdited: "Just now",
    author: "You",
    sections: [
      {
        id: "s1",
        title: "Executive Summary",
        type: "text",
        content:
          "This document outlines our strategic product initiatives for Q3 2026. Our primary focus areas are user experience improvements, API performance optimization, and expanding our integration ecosystem. We aim to increase monthly active users by 40% while reducing support ticket volume by 25%.",
        open: true,
      },
      {
        id: "s2",
        title: "Key Objectives",
        type: "list",
        content:
          "• Launch redesigned onboarding flow by June 15\n• Complete GraphQL API migration by July 1\n• Ship mobile app v2.0 with offline support by July 30\n• Integrate 10 new third-party services by August 15\n• Achieve 99.99% API uptime SLA by September 1",
        open: true,
      },
      {
        id: "s3",
        title: "Technical Architecture",
        type: "code",
        content:
          "// New microservices architecture\nconst services = {\n  auth: 'auth-service.internal:3001',\n  users: 'users-service.internal:3002',\n  notifications: 'notif-service.internal:3003',\n  billing: 'billing-service.internal:3004',\n};\n\n// API Gateway config\nexport const gateway = {\n  rateLimit: 1000, // req/min\n  timeout: 30000,  // ms\n  retries: 3,\n};",
        open: false,
      },
      {
        id: "s4",
        title: "Risk Assessment",
        type: "callout",
        content:
          "⚠️ Critical Path: The GraphQL migration depends on completing the API versioning work first. Any delays in v1 deprecation will push back the migration timeline by 2-3 weeks. Escalate blockers immediately to engineering lead.",
        open: false,
      },
      {
        id: "s5",
        title: "Team Allocations",
        type: "text",
        content:
          "Frontend team (6 engineers): Focus on redesign and mobile app. Backend team (8 engineers): API migration and performance work. DevOps team (3 engineers): Infrastructure scaling and monitoring. Design team (4 designers): User research and new feature designs.",
        open: false,
      },
    ],
  },
  {
    id: "api-docs",
    title: "API Documentation v2.0",
    icon: "📘",
    lastEdited: "2h ago",
    author: "Sam Rivera",
    sections: [
      {
        id: "a1",
        title: "Authentication",
        type: "text",
        content:
          "DevHub uses OAuth 2.0 for API authentication. All requests must include a valid Bearer token in the Authorization header. Tokens expire after 24 hours and must be refreshed using the /auth/refresh endpoint.",
        open: true,
      },
      {
        id: "a2",
        title: "Base URL",
        type: "code",
        content:
          "// Production\nhttps://api.devhub.io/v2\n\n// Staging\nhttps://api-staging.devhub.io/v2\n\n// Example request\ncurl -X GET 'https://api.devhub.io/v2/users/me' \\\n  -H 'Authorization: Bearer YOUR_TOKEN' \\\n  -H 'Content-Type: application/json'",
        open: false,
      },
    ],
  },
];

const sidebarTree = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: "🚀",
    expanded: true,
    children: [
      { id: "overview", label: "Overview", icon: "📄" },
      { id: "installation", label: "Installation", icon: "📦" },
      { id: "quick-start", label: "Quick Start", icon: "⚡" },
    ],
  },
  {
    id: "product",
    label: "Product",
    icon: "🎯",
    expanded: true,
    children: [
      { id: "roadmap", label: "Product Roadmap Q3 2026", icon: "🗺️" },
      { id: "sprint", label: "Sprint Planning — May 2026", icon: "📅" },
      { id: "principles", label: "Engineering Design Principles", icon: "⚙️" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: "🔧",
    expanded: false,
    children: [
      { id: "api-docs", label: "API Documentation v2.0", icon: "📘" },
      { id: "architecture", label: "System Architecture", icon: "🏗️" },
      { id: "deployment", label: "Deployment Guide", icon: "🚀" },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: "👥",
    expanded: false,
    children: [
      { id: "handbook", label: "Team Handbook", icon: "📖" },
      { id: "onboarding", label: "Onboarding Checklist", icon: "✅" },
    ],
  },
];

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0a0b11", border: "1px solid #1c1d2e" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: "#0f1018", borderBottom: "1px solid #1c1d2e" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <span style={{ color: "#4a4f70", fontSize: "0.7rem" }}>JavaScript</span>
        </div>
        <button style={{ color: "#4a4f70", fontSize: "0.7rem" }}>Copy</button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span
                style={{
                  color: "#2a2c44",
                  fontSize: "0.78rem",
                  userSelect: "none",
                  minWidth: 20,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  color: line.startsWith("//")
                    ? "#4a4f70"
                    : line.includes("'") || line.includes('"')
                    ? "#e4e6f0"
                    : "#e4e6f0",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                }}
              >
                {line.startsWith("//") ? (
                  <span style={{ color: "#4a4f70" }}>{line}</span>
                ) : line.includes("const ") || line.includes("export ") || line.includes("https") ? (
                  <span>
                    {line.split(/(\bconst\b|\bexport\b|\bhttps\b|\bcurl\b)/).map((part, j) =>
                      ["const", "export", "curl"].includes(part) ? (
                        <span key={j} style={{ color: "#a78bfa" }}>{part}</span>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </span>
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function CollapsibleSection({ section }: { section: DocSection }) {
  const [open, setOpen] = useState(section.open ?? false);

  const getIcon = () => {
    switch (section.type) {
      case "code": return <Code size={13} style={{ color: "#fb923c" }} />;
      case "callout": return <Quote size={13} style={{ color: "#f59e0b" }} />;
      case "list": return <List size={13} style={{ color: "#22c55e" }} />;
      default: return <AlignLeft size={13} style={{ color: "#5e6ad2" }} />;
    }
  };

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button
          className="w-full flex items-center gap-2 py-2.5 group transition-all"
          style={{ borderBottom: `1px solid ${open ? "transparent" : "#1c1d2e"}` }}
        >
          <span style={{ color: "#4a4f70" }}>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          {getIcon()}
          <span
            style={{
              color: "#d4d8f0",
              fontSize: "0.88rem",
              fontWeight: 600,
              flex: 1,
              textAlign: "left",
            }}
          >
            {section.title}
          </span>
          <span
            className="px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all"
            style={{
              background: "#1a1b2e",
              color: "#4a4f70",
              fontSize: "0.62rem",
            }}
          >
            {section.type}
          </span>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pb-4 pt-2 pl-5" style={{ borderBottom: "1px solid #1c1d2e" }}>
          {section.type === "code" ? (
            <CodeBlock code={section.content} />
          ) : section.type === "callout" ? (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <p
                style={{
                  color: "#d4a84b",
                  fontSize: "0.82rem",
                  lineHeight: 1.7,
                }}
              >
                {section.content}
              </p>
            </div>
          ) : section.type === "list" ? (
            <div className="flex flex-col gap-1">
              {section.content.split("\n").map((item, i) => (
                <p
                  key={i}
                  style={{
                    color: "#b0b4d4",
                    fontSize: "0.83rem",
                    lineHeight: 1.7,
                    paddingLeft: 4,
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          ) : (
            <p
              style={{
                color: "#b0b4d4",
                fontSize: "0.83rem",
                lineHeight: 1.8,
              }}
            >
              {section.content}
            </p>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function Documentation() {
  const [selectedDoc, setSelectedDoc] = useState(docPages[0]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["getting-started", "product"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <div
        className="flex flex-col"
        style={{
          width: 240,
          borderRight: "1px solid #1c1d2e",
          background: "#0a0b11",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #1c1d2e" }}
        >
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{ background: "#1a1b2e", border: "1px solid #252540" }}
          >
            <Search size={12} style={{ color: "#4a4f70" }} />
            <input
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1"
              style={{ color: "#e4e6f0", fontSize: "0.75rem" }}
            />
          </div>
        </div>

        {/* New Page */}
        <button
          className="mx-3 mt-3 mb-2 flex items-center gap-2 px-2 py-1.5 rounded-md transition-all"
          style={{
            color: "#5e6ad2",
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <Plus size={13} />
          New page
        </button>

        {/* Tree */}
        <div className="px-3 flex flex-col gap-0.5">
          {sidebarTree.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all"
                style={{ color: "#6b7094" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                {expandedFolders.has(folder.id) ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <span style={{ fontSize: "0.9rem" }}>{folder.icon}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                  {folder.label}
                </span>
              </button>
              {expandedFolders.has(folder.id) && (
                <div className="pl-4 flex flex-col gap-0.5 mt-0.5 mb-1">
                  {folder.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        const found = docPages.find((d) => d.id === child.id);
                        if (found) setSelectedDoc(found);
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-left transition-all"
                      style={{
                        background:
                          selectedDoc?.id === child.id ? "#1a1b2e" : "transparent",
                        color:
                          selectedDoc?.id === child.id ? "#d4d8f0" : "#5a5f7a",
                        fontSize: "0.75rem",
                        border: `1px solid ${
                          selectedDoc?.id === child.id
                            ? "#252540"
                            : "transparent"
                        }`,
                      }}
                    >
                      <span style={{ fontSize: "0.8rem" }}>{child.icon}</span>
                      <span className="truncate">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar */}
        <div
          className="flex items-center gap-1 px-4 py-2"
          style={{
            borderBottom: "1px solid #1c1d2e",
            background: "#0c0d14",
          }}
        >
          {[
            { icon: Bold, title: "Bold" },
            { icon: Italic, title: "Italic" },
            { icon: Underline, title: "Underline" },
          ].map(({ icon: Icon, title }) => (
            <button
              key={title}
              title={title}
              className="w-7 h-7 rounded flex items-center justify-center transition-all"
              style={{ color: "#6b7094" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Icon size={13} />
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ background: "#1c1d2e" }} />
          {[
            { icon: Hash, title: "Heading" },
            { icon: List, title: "Bullet list" },
            { icon: ListOrdered, title: "Numbered list" },
            { icon: Quote, title: "Blockquote" },
            { icon: Code, title: "Code block" },
          ].map(({ icon: Icon, title }) => (
            <button
              key={title}
              title={title}
              className="w-7 h-7 rounded flex items-center justify-center transition-all"
              style={{ color: "#6b7094" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Icon size={13} />
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ background: "#1c1d2e" }} />
          {[
            { icon: Link2, title: "Link" },
            { icon: Image, title: "Image" },
            { icon: Smile, title: "Emoji" },
          ].map(({ icon: Icon, title }) => (
            <button
              key={title}
              title={title}
              className="w-7 h-7 rounded flex items-center justify-center transition-all"
              style={{ color: "#6b7094" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Icon size={13} />
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-all"
              style={{
                background: "#1a1b2e",
                color: "#6b7094",
                fontSize: "0.72rem",
              }}
            >
              <Star size={11} />
              Favorite
            </button>
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition-all"
              style={{
                background: "#5e6ad2",
                color: "#fff",
                fontSize: "0.72rem",
              }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Doc Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: "#0c0d14" }}
        >
          <div
            className="mx-auto py-10 px-8"
            style={{ maxWidth: 780 }}
          >
            {/* Doc Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: "2.5rem" }}>{selectedDoc.icon}</span>
              </div>
              <h1
                style={{
                  color: "#e8eaf5",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {selectedDoc.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#5e6ad2" }}
                  >
                    <span style={{ color: "#fff", fontSize: "0.5rem", fontWeight: 700 }}>
                      {selectedDoc.author === "You" ? "JD" : selectedDoc.author.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <span style={{ color: "#4a4f70", fontSize: "0.75rem" }}>
                    {selectedDoc.author}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={11} style={{ color: "#4a4f70" }} />
                  <span style={{ color: "#4a4f70", fontSize: "0.72rem" }}>
                    Edited {selectedDoc.lastEdited}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={11} style={{ color: "#4a4f70" }} />
                  <span style={{ color: "#4a4f70", fontSize: "0.72rem" }}>
                    May 10, 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col">
              {selectedDoc.sections.map((section) => (
                <CollapsibleSection key={section.id} section={section} />
              ))}
            </div>

            {/* Add block */}
            <button
              className="mt-6 flex items-center gap-2 py-2 px-3 rounded-lg transition-all w-full"
              style={{ color: "#3a3c5a" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1a1b2e";
                (e.currentTarget as HTMLElement).style.color = "#6b7094";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#3a3c5a";
              }}
            >
              <Plus size={14} />
              <span style={{ fontSize: "0.8rem" }}>Add a block</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
