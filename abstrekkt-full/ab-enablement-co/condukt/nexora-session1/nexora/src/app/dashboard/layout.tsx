"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Kanban, Handshake, Calendar, Mail,
  CheckSquare, Bot, Zap, Wrench, Globe, GraduationCap, Package,
  FileText, Star, Link as LinkIcon, Layout, MessageCircle,
  BarChart3, Target, Settings, CreditCard, HelpCircle,
  ChevronLeft, ChevronRight, Bell, Search, Menu,
  LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Users, Kanban, Handshake, Calendar, Mail,
  CheckSquare, Bot, Zap, Wrench, Globe, GraduationCap, Package,
  FileText, Star, Link: LinkIcon, Layout, MessageCircle,
  BarChart3, Target,
};

const navSections = [
  {
    section: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Contacts", href: "/dashboard/contacts", icon: "Users" },
      { label: "Pipeline", href: "/dashboard/pipeline", icon: "Kanban" },
      { label: "Deals", href: "/dashboard/deals", icon: "Handshake" },
      { label: "Calendar", href: "/dashboard/calendar", icon: "Calendar" },
      { label: "Email", href: "/dashboard/email", icon: "Mail" },
      { label: "Todos", href: "/dashboard/todos", icon: "CheckSquare" },
    ],
  },
  {
    section: "AI & Tools",
    items: [
      { label: "Nexus AI", href: "/dashboard/inbox", icon: "Bot" },
      { label: "Automations", href: "/dashboard/automations", icon: "Zap" },
      { label: "Toolbox", href: "/dashboard/toolbox", icon: "Wrench" },
    ],
  },
  {
    section: "Growth",
    items: [
      { label: "Community", href: "/dashboard/community", icon: "Globe" },
      { label: "Learning", href: "/dashboard/learning", icon: "GraduationCap" },
      { label: "Products", href: "/dashboard/products", icon: "Package" },
      { label: "Proposals", href: "/dashboard/proposals", icon: "FileText" },
      { label: "Reviews", href: "/dashboard/reviews", icon: "Star" },
    ],
  },
  {
    section: "Presence",
    items: [
      { label: "ProfileTree", href: "/dashboard/profile-tree", icon: "Link" },
      { label: "PageTree", href: "/dashboard/page-tree", icon: "Layout" },
      { label: "Social Inbox", href: "/dashboard/social-inbox", icon: "MessageCircle" },
    ],
  },
  {
    section: "Insights",
    items: [
      { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
      { label: "Goals", href: "/dashboard/goals", icon: "Target" },
    ],
  },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { label: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative z-50 h-full flex flex-col border-r border-border/30 bg-card/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn("flex items-center h-16 border-b border-border/20 px-4", collapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-nexora flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            {!collapsed && (
              <span className="text-base font-display font-semibold">Nexora</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {section.section}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg transition-all duration-200",
                        collapsed ? "justify-center p-2.5" : "px-3 py-2",
                        isActive
                          ? "bg-nexora-500/10 text-nexora-400 border border-nexora-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-border/20 p-3 space-y-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg transition-all duration-200",
                  collapsed ? "justify-center p-2.5" : "px-3 py-2",
                  isActive
                    ? "bg-accent/60 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}

          {/* User Avatar */}
          <div className={cn(
            "flex items-center gap-3 mt-3 pt-3 border-t border-border/20",
            collapsed ? "justify-center" : "px-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-nexora flex items-center justify-center text-white text-xs font-bold shrink-0">
              KR
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">Kyle R.</div>
                <div className="text-xs text-muted-foreground truncate">Pro Plan</div>
              </div>
            )}
            {!collapsed && (
              <button className="p-1 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border/30 bg-card/40 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent/50 text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contacts, deals, emails..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border/30 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-nexora-500/30 focus:border-nexora-500/30 transition-all placeholder:text-muted-foreground/40"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 rounded border border-border/50 bg-muted/50 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-nexora-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
