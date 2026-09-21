import React, { useState } from "react";
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
  X,
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
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)" }}
        >
          <GitBranch size={14} color="#fff" />
        </div>
        <span
          style={{
            color: "#e4e6f0",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          DevHub
        </span>
      </Link>

      {/* Separator */}
      <div
        className="h-5 w-px shrink-0 mr-1"
        style={{ background: "#1c1d2e" }}
      />

      {/* Nav Items */}
      <div className="flex items-center gap-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-150"
              style={{
                color: isActive ? "#e4e6f0" : "#6b7094",
                background: isActive ? "#1a1b2e" : "transparent",
                fontSize: "0.8rem",
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.color = "#b0b4d4";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.color = "#6b7094";
              }}
            >
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        {searchOpen ? (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md"
            style={{ background: "#1a1b2e", border: "1px solid #2d2f4a" }}
          >
            <Search size={13} style={{ color: "#6b7094" }} />
            <input
              autoFocus
              placeholder="Search..."
              className="bg-transparent outline-none"
              style={{ color: "#e4e6f0", fontSize: "0.8rem", width: 160 }}
              onBlur={() => setSearchOpen(false)}
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={12} style={{ color: "#6b7094" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md transition-all duration-150"
            style={{ color: "#6b7094" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            <Search size={15} />
          </button>
        )}

        {/* Notifications */}
        <button
          className="relative p-2 rounded-md transition-all duration-150"
          style={{ color: "#6b7094" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
          onClick={() => setNotifications(0)}
        >
          <Bell size={15} />
          {notifications > 0 && (
            <span
              className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{
                background: "#5e6ad2",
                fontSize: "0.55rem",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {notifications}
            </span>
          )}
        </button>

        {/* Feedback Button */}
        <button
          onClick={onFeedback}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md ml-1 transition-all duration-150"
          style={{
            background: "#5e6ad2",
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#6b79e4")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#5e6ad2")
          }
        >
          <MessageSquarePlus size={13} />
          Feedback
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center ml-1 shrink-0 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)" }}
        >
          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
            JD
          </span>
        </div>
      </div>
    </nav>
  );
}
