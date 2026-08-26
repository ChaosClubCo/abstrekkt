import {
  MessageCircle,
  Code,
  Database,
  Rocket,
  Shield,
  BarChart3,
  TestTube,
  Layers,
  Settings,
  Brain,
  User,
} from "lucide-react";
import type { NavItem, ProjectStats } from "../data";
import type { TabId } from "../types";

const navItems: NavItem[] = [
  { id: "chat", name: "AI Command Center", icon: MessageCircle, badge: "4" },
  { id: "editor", name: "Code Studio", icon: Code, badge: null },
  { id: "database", name: "Data Architect", icon: Database, badge: null },
  { id: "deploy", name: "Global Deploy", icon: Rocket, badge: "3" },
  { id: "security", name: "Security Shield", icon: Shield, badge: null },
  { id: "analytics", name: "Intelligence Hub", icon: BarChart3, badge: null },
  { id: "testing", name: "Quality Labs", icon: TestTube, badge: "12" },
  { id: "projects", name: "Project Galaxy", icon: Layers, badge: null },
  { id: "settings", name: "Command Center", icon: Settings, badge: null },
];

interface NavigationSidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  projectStats: ProjectStats;
}

export function NavigationSidebar({ activeTab, onSelectTab, projectStats }: NavigationSidebarProps) {
  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white h-full flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Universal AI Generator
          </span>
        </h1>
        <div className="text-xs text-gray-400 mt-1">Enterprise Edition v2.1 (Demo)</div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as TabId)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-[1.02]"
                : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`w-5 h-5 ${
                  activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-purple-400"
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              {/* Demo persona from source */}
              <div className="text-sm font-semibold text-white">Sarah Chen</div>
              <div className="text-xs text-purple-300">Enterprise Developer</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/20 rounded-lg p-2 text-center">
              <div className="text-purple-300 font-bold">{projectStats.totalProjects}</div>
              <div className="text-gray-400">Projects</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2 text-center">
              {/* MOCK security score */}
              <div className="text-green-300 font-bold">{projectStats.securityScore}%</div>
              <div className="text-gray-400">Security</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
