import React from "react";
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
  Settings,
} from "lucide-react";

const navItems = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/kanban", label: "Kanban", icon: ListChecks },
  { path: "/app/docs", label: "Docs", icon: FileText },
  { path: "/app/workflow", label: "Workflow", icon: Zap },
  { path: "/app/code", label: "Code", icon: Code2 },
];

const UNREAD_COUNT = 4;

interface NavBarProps {
  onFeedback: () => void;
  onNotifications?: () => void;
  onCommandPalette?: () => void;
}

export function NavBar({ onFeedback, onNotifications, onCommandPalette }: NavBarProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/app"
      ? location.pathname === "/app" || location.pathname === "/app/"
      : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-2"
      style={{
        height: 56,
        background: "rgba(8,9,14,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1c1d2e",
      }}
    >
      {/* Logo */}
      <Link to="/app" className="flex items-center gap-2 mr-3 shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)" }}
        >
          <GitBranch size={14} color="#fff" />
        </div>
        <span style={{ color: "#e4e6f0", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          FlashFusion
        </span>
      </Link>

      <div className="h-5 w-px shrink-0 mr-1" style={{ background: "#1c1d2e" }} />

      {/* Nav links */}
      <div className="flex items-center gap-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-150"
              style={{
                color: active ? "#e4e6f0" : "#6b7094",
                background: active ? "#1a1b2e" : "transparent",
                fontSize: "0.8rem",
                fontWeight: active ? 500 : 400,
                border: active ? "1px solid #252540" : "1px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#b0b4d4"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#6b7094"; }}
            >
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-0.5">
        {/* Cmd+K trigger */}
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md mr-1 transition-all"
          style={{ background: "#12121e", border: "1px solid #1c1d2e", color: "#4a4f70" }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#252540"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#1c1d2e"}
        >
          <Search size={12} />
          <span style={{ fontSize: "0.72rem" }}>Search</span>
          <span className="px-1 py-0.5 rounded ml-1" style={{ background: "#1a1b2e", fontSize: "0.6rem", border: "1px solid #252540" }}>⌘K</span>
        </button>

        {/* Notifications bell */}
        <button
          onClick={onNotifications}
          className="relative p-2 rounded-md transition-all duration-150"
          style={{ color: "#6b7094" }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "#1a1b2e"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <Bell size={15} />
          <span
            className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: "#5e6ad2", fontSize: "0.52rem", color: "#fff", fontWeight: 700 }}
          >
            {UNREAD_COUNT}
          </span>
        </button>

        {/* Settings icon */}
        <Link
          to="/app/settings"
          className="p-2 rounded-md transition-all duration-150"
          style={{
            color: isActive("/app/settings") ? "#e4e6f0" : "#6b7094",
            background: isActive("/app/settings") ? "#1a1b2e" : "transparent",
            display: "flex",
          }}
          onMouseEnter={(e) => { if (!isActive("/app/settings")) (e.currentTarget as HTMLElement).style.background = "#1a1b2e"; }}
          onMouseLeave={(e) => { if (!isActive("/app/settings")) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <Settings size={15} />
        </Link>

        {/* Feedback */}
        <button
          onClick={onFeedback}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md ml-1 transition-all duration-150"
          style={{ background: "#5e6ad2", color: "#fff", fontSize: "0.8rem", fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "#6b79e4"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "#5e6ad2"}
        >
          <MessageSquarePlus size={13} />
          Feedback
        </button>

        {/* Avatar → Settings */}
        <Link
          to="/app/settings"
          className="w-7 h-7 rounded-full flex items-center justify-center ml-1 shrink-0"
          style={{ background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)" }}
        >
          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>JL</span>
        </Link>
      </div>
    </nav>
  );
}
