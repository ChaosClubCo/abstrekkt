/**
 * TabPanels.tsx — static content for the non-chat tabs.
 *
 * These panels render MOCK data (security scores, platform cards, aggregate
 * stats). They are illustrative dashboards, not connected to any backend.
 */
import { Code, Database, CheckCircle, Settings } from "lucide-react";
import { platforms, securityChecks, type ProjectStats } from "../data";

function PanelShell({
  title,
  subtitle,
  children,
  headerRight,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg h-full overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {headerRight}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EditorPanel() {
  return (
    <PanelShell title="Code Studio" subtitle="Multi-language IDE with AI-powered code generation (demo)">
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono">
        <div className="text-center py-12">
          <Code className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-bold text-white mb-2">Advanced Code Editor</h3>
          <p className="text-gray-400">Full-featured IDE with real-time collaboration (placeholder)</p>
        </div>
      </div>
    </PanelShell>
  );
}

export function DatabasePanel() {
  return (
    <PanelShell title="Data Architect" subtitle="Visual database design and optimization (demo)">
      <div className="text-center py-12">
        <Database className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Database Designer</h3>
        <p className="text-gray-600">Visual schema builder with AI optimization (placeholder)</p>
      </div>
    </PanelShell>
  );
}

export function SecurityPanel({ projectStats }: { projectStats: ProjectStats }) {
  return (
    <PanelShell
      title="Security Command Center"
      subtitle="Enterprise-grade security monitoring (MOCK data)"
      headerRight={
        <div className="text-center">
          {/* MOCK security score */}
          <div className="text-3xl font-bold text-green-600">{projectStats.securityScore}%</div>
          <div className="text-sm text-gray-500">Security Score (mock)</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityChecks.slice(0, 4).map((check) => (
          <div key={check.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{check.name}</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{check.score}%</div>
            <div className="text-xs text-green-600">All checks passed (demo)</div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function DeployPanel() {
  return (
    <PanelShell
      title="Global Deployment Center"
      subtitle="Multi-platform deployment with intelligent optimization (demo)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <div key={platform.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <platform.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{platform.name}</h3>
                <div className="text-sm text-gray-600">{platform.tech}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{platform.features.join(" • ")}</div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function AnalyticsPanel({ projectStats }: { projectStats: ProjectStats }) {
  return (
    <PanelShell title="Intelligence Hub" subtitle="Real-time analytics and insights (MOCK data)">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(projectStats)
          .slice(0, 8)
          .map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{String(value)}</div>
              <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
            </div>
          ))}
      </div>
    </PanelShell>
  );
}

export function ComingSoonPanel({ title }: { title: string }) {
  return (
    <PanelShell title={title.charAt(0).toUpperCase() + title.slice(1)}>
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Settings className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600">This feature is being developed by our AI agents (placeholder).</p>
      </div>
    </PanelShell>
  );
}
