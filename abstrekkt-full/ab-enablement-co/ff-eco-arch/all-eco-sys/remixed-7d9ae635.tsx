import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Users, Lock, Activity, GitBranch, Server, Bug, Clock, Key, Eye, FileWarning, Zap, RefreshCw, Terminal, GitPullRequest, AlertCircle, TrendingUp, Database, Cloud, Settings, Plug, Github, FileText, Webhook, CreditCard, Globe, Box } from 'lucide-react';

// INT Inc Brand Colors
const BRAND = {
  primary: '#1e3a5f',
  secondary: '#2563eb',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  neutral: '#64748b',
  light: '#f1f5f9',
  dark: '#0f172a'
};

// Integration Configuration
const INTEGRATIONS = {
  github: { name: 'GitHub', icon: Github, color: '#24292f', status: 'configurable', description: 'PRs, Issues, Security Alerts' },
  n8n: { name: 'n8n', icon: Webhook, color: '#ea4b71', status: 'configurable', description: 'Workflow automation & webhooks' },
  notion: { name: 'Notion', icon: FileText, color: '#000000', status: 'configurable', description: 'Project documentation sync' },
  vercel: { name: 'Vercel', icon: Cloud, color: '#000000', status: 'available', description: 'Deployments & runtime logs' },
  linear: { name: 'Linear', icon: Box, color: '#5e6ad2', status: 'available', description: 'Issue tracking & sprints' },
  stripe: { name: 'Stripe', icon: CreditCard, color: '#635bff', status: 'available', description: 'Revenue & subscription metrics' },
  cloudflare: { name: 'Cloudflare', icon: Globe, color: '#f38020', status: 'available', description: 'CDN & security analytics' },
  sentry: { name: 'Sentry', icon: Bug, color: '#362d59', status: 'available', description: 'Error monitoring & performance' },
  aws: { name: 'AWS', icon: Server, color: '#ff9900', status: 'available', description: 'Infrastructure & costs' },
  zapier: { name: 'Zapier', icon: Zap, color: '#ff4a00', status: 'connected', description: 'Cross-platform automation' }
};

// Sample data structure (will be replaced by real API calls)
const createEmptyState = () => ({
  securityMetrics: { vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 }, patchCompliance: 0, incidentsThisMonth: 0, meanTimeToRemediate: 0, secretsRotated: 0, scansConducted: 0 },
  github: { pullRequests: [], issues: [], securityAlerts: [], commits: [] },
  n8n: { workflows: [], executions: [], errors: [] },
  notion: { projects: [], docs: [], updates: [] },
  vercel: { deployments: [], logs: [], domains: [] },
  linear: { issues: [], sprints: [], projects: [] },
  stripe: { mrr: 0, customers: 0, churn: 0 },
  cloudflare: { requests: 0, threats: 0, bandwidth: 0 },
  sentry: { errors: [], performance: {} },
  aws: { costs: 0, services: [] }
});

// Mock data for demonstration
const DEMO_DATA = {
  securityMetrics: {
    vulnerabilities: { critical: 2, high: 8, medium: 23, low: 45 },
    patchCompliance: 94,
    incidentsThisMonth: 3,
    meanTimeToRemediate: 4.2,
    secretsRotated: 847,
    scansConducted: 156
  },
  github: {
    pullRequests: [
      { id: 'PR-892', title: 'feat: Add MFA enforcement for admin routes', author: 'Kyle', status: 'Approved', reviewers: 2, changes: '+342 -89', repo: 'intinc-platform' },
      { id: 'PR-891', title: 'fix: Patch CVE-2025-1234 in auth module', author: 'Sarah', status: 'In Review', reviewers: 1, changes: '+56 -23', repo: 'intinc-auth' },
      { id: 'PR-890', title: 'chore: Rotate API keys for prod services', author: 'Marcus', status: 'Merged', reviewers: 2, changes: '+12 -12', repo: 'intinc-secrets' },
      { id: 'PR-889', title: 'feat: Implement audit log streaming', author: 'Elena', status: 'Draft', reviewers: 0, changes: '+567 -34', repo: 'intinc-logging' }
    ],
    securityAlerts: [
      { id: 'GHSA-001', severity: 'High', package: 'lodash', version: '4.17.20', fixed: '4.17.21', repo: 'intinc-platform' },
      { id: 'GHSA-002', severity: 'Medium', package: 'axios', version: '0.21.0', fixed: '0.21.1', repo: 'intinc-api' }
    ],
    commits: [
      { date: 'Mon', count: 12 }, { date: 'Tue', count: 18 }, { date: 'Wed', count: 8 },
      { date: 'Thu', count: 22 }, { date: 'Fri', count: 15 }, { date: 'Sat', count: 3 }, { date: 'Sun', count: 5 }
    ]
  },
  n8n: {
    workflows: [
      { id: 'wf-001', name: 'Security Alert Slack Notifier', status: 'active', executions: 47, errors: 0, lastRun: '5m ago' },
      { id: 'wf-002', name: 'Daily Vulnerability Scan Trigger', status: 'active', executions: 30, errors: 1, lastRun: '2h ago' },
      { id: 'wf-003', name: 'PR Review Assignment', status: 'active', executions: 156, errors: 3, lastRun: '15m ago' },
      { id: 'wf-004', name: 'Incident Response Pipeline', status: 'active', executions: 8, errors: 0, lastRun: '1d ago' },
      { id: 'wf-005', name: 'Compliance Report Generator', status: 'paused', executions: 4, errors: 0, lastRun: '7d ago' }
    ],
    recentExecutions: [
      { workflow: 'Security Alert Slack Notifier', status: 'success', duration: '1.2s', time: '5m ago' },
      { workflow: 'PR Review Assignment', status: 'success', duration: '0.8s', time: '15m ago' },
      { workflow: 'Daily Vulnerability Scan Trigger', status: 'error', duration: '45s', time: '2h ago' },
      { workflow: 'Incident Response Pipeline', status: 'success', duration: '3.4s', time: '1d ago' }
    ]
  },
  notion: {
    projects: [
      { id: 'proj-001', name: 'Zero Trust Implementation', status: 'In Progress', docs: 12, lastUpdate: '2h ago' },
      { id: 'proj-002', name: 'SOC 2 Automation', status: 'Planning', docs: 8, lastUpdate: '1d ago' },
      { id: 'proj-003', name: 'MCP Server Optimization', status: 'In Progress', docs: 5, lastUpdate: '4h ago' },
      { id: 'proj-004', name: 'Secret Rotation Pipeline', status: 'Review', docs: 3, lastUpdate: '30m ago' }
    ],
    recentDocs: [
      { title: 'Zero Trust Architecture RFC', project: 'Zero Trust Implementation', author: 'Kyle', updated: '2h ago' },
      { title: 'Compliance Checklist Q1', project: 'SOC 2 Automation', author: 'Sarah', updated: '1d ago' },
      { title: 'MCP Performance Benchmarks', project: 'MCP Server Optimization', author: 'Kyle', updated: '4h ago' }
    ]
  },
  vercel: {
    deployments: [
      { env: 'Production', project: 'intinc-dashboard', version: 'v2.4.1', status: 'success', time: '2h ago', by: 'Kyle' },
      { env: 'Staging', project: 'intinc-dashboard', version: 'v2.4.2-rc1', status: 'success', time: '45m ago', by: 'Sarah' },
      { env: 'Preview', project: 'intinc-api', version: 'pr-892', status: 'building', time: '5m ago', by: 'Marcus' }
    ],
    metrics: { requests: '2.4M', p99Latency: '145ms', errorRate: '0.02%', edgeFunctions: 12 }
  },
  linear: {
    issues: [
      { id: 'INT-234', title: 'Implement rate limiting for API Gateway', status: 'In Progress', priority: 'High', assignee: 'Kyle' },
      { id: 'INT-235', title: 'Add audit logging for admin actions', status: 'Todo', priority: 'Medium', assignee: 'Elena' },
      { id: 'INT-236', title: 'Review and update RBAC policies', status: 'In Review', priority: 'High', assignee: 'Marcus' }
    ],
    sprint: { name: 'Sprint 24', progress: 67, daysLeft: 5, velocity: 34 }
  },
  stripe: { mrr: 12450, customers: 47, churn: 2.1, growth: 15.3 },
  cloudflare: { requests: '14.2M', threats: 1247, bandwidth: '892GB', cacheHit: 94.2 },
  sentry: { errors: 23, p50: '124ms', p99: '890ms', crashFree: 99.2 },
  aws: { costs: 4280, trend: -8.2, services: ['EC2', 'RDS', 'S3', 'Lambda', 'CloudFront'] },
  platformHealth: [
    { service: 'Auth Service', uptime: 99.99, latency: 45, status: 'healthy', region: 'us-east-1' },
    { service: 'API Gateway', uptime: 99.95, latency: 23, status: 'healthy', region: 'us-east-1' },
    { service: 'Data Pipeline', uptime: 99.87, latency: 120, status: 'degraded', region: 'us-west-2' },
    { service: 'CI/CD Pipeline', uptime: 99.92, latency: 0, status: 'healthy', region: 'us-east-1' },
    { service: 'Secrets Manager', uptime: 100, latency: 12, status: 'healthy', region: 'us-east-1' },
    { service: 'Log Aggregator', uptime: 99.98, latency: 89, status: 'healthy', region: 'us-west-2' }
  ],
  complianceStatus: [
    { framework: 'SOC 2 Type II', status: 'Compliant', lastAudit: '2025-01-15', score: 98, controls: 89 },
    { framework: 'HIPAA', status: 'Compliant', lastAudit: '2024-12-01', score: 96, controls: 54 },
    { framework: 'PCI-DSS', status: 'In Progress', lastAudit: '2024-11-20', score: 89, controls: 78 },
    { framework: 'ISO 27001', status: 'Compliant', lastAudit: '2024-10-15', score: 94, controls: 114 }
  ],
  securityTrend: [
    { month: 'Sep', critical: 5, high: 15, resolved: 18 },
    { month: 'Oct', critical: 4, high: 12, resolved: 22 },
    { month: 'Nov', critical: 3, high: 10, resolved: 25 },
    { month: 'Dec', critical: 3, high: 9, resolved: 28 },
    { month: 'Jan', critical: 2, high: 8, resolved: 32 }
  ],
  securityPosture: [
    { subject: 'Identity', score: 92 },
    { subject: 'Network', score: 88 },
    { subject: 'Data', score: 95 },
    { subject: 'Application', score: 85 },
    { subject: 'Endpoint', score: 90 },
    { subject: 'Cloud', score: 87 }
  ],
  engineeringProjects: [
    { id: 1, name: 'Zero Trust Implementation', lead: 'Kyle', deadline: '2025-03-15', status: 'In Progress', priority: 'Critical', progress: 65, tasks: 24, completed: 16 },
    { id: 2, name: 'MCP Server Optimization', lead: 'Kyle', deadline: '2025-02-28', status: 'In Progress', priority: 'High', progress: 40, tasks: 18, completed: 7 },
    { id: 3, name: 'SOC 2 Automation', lead: 'Sarah', deadline: '2025-04-01', status: 'Planning', priority: 'High', progress: 15, tasks: 32, completed: 5 },
    { id: 4, name: 'Secret Rotation Pipeline', lead: 'Marcus', deadline: '2025-02-20', status: 'In Review', priority: 'Critical', progress: 90, tasks: 12, completed: 11 }
  ],
  recentIncidents: [
    { id: 'INC-2025-047', title: 'Elevated API Latency', severity: 'Medium', status: 'Resolved', time: '2h ago', assignee: 'Kyle' },
    { id: 'INC-2025-046', title: 'Failed Secret Rotation', severity: 'High', status: 'Resolved', time: '1d ago', assignee: 'Marcus' },
    { id: 'INC-2025-045', title: 'Suspicious Login Attempts', severity: 'Critical', status: 'Monitoring', time: '2d ago', assignee: 'Kyle' }
  ],
  secretsHealth: [
    { category: 'API Keys', total: 47, rotated: 45, expiring: 2, avgAge: 23 },
    { category: 'Database Creds', total: 12, rotated: 12, expiring: 0, avgAge: 15 },
    { category: 'Service Accounts', total: 28, rotated: 26, expiring: 2, avgAge: 31 },
    { category: 'SSL Certificates', total: 18, rotated: 17, expiring: 1, avgAge: 45 }
  ]
};

const INTDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(DEMO_DATA);
  const [filter, setFilter] = useState({ priority: '', status: '', lead: '' });
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [integrationConfig, setIntegrationConfig] = useState({});
  const [showIntegrations, setShowIntegrations] = useState(false);

  // Simulated data refresh
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    // In production, this would call actual APIs
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
  }, []);

  const filteredProjects = useMemo(() => {
    return data.engineeringProjects.filter(project => {
      return (
        (filter.priority === '' || project.priority === filter.priority) &&
        (filter.status === '' || project.status === filter.status) &&
        (filter.lead === '' || project.lead === filter.lead)
      );
    });
  }, [data.engineeringProjects, filter]);

  const totalVulns = Object.values(data.securityMetrics.vulnerabilities).reduce((a, b) => a + b, 0);
  const criticalCount = data.securityMetrics.vulnerabilities.critical + data.securityMetrics.vulnerabilities.high;

  const vulnPieData = [
    { name: 'Critical', value: data.securityMetrics.vulnerabilities.critical, color: BRAND.danger },
    { name: 'High', value: data.securityMetrics.vulnerabilities.high, color: '#f97316' },
    { name: 'Medium', value: data.securityMetrics.vulnerabilities.medium, color: BRAND.warning },
    { name: 'Low', value: data.securityMetrics.vulnerabilities.low, color: BRAND.accent }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'github', label: 'GitHub', icon: Github },
    { id: 'n8n', label: 'n8n', icon: Webhook },
    { id: 'notion', label: 'Notion', icon: FileText },
    { id: 'platform', label: 'Platform', icon: Server },
    { id: 'projects', label: 'Projects', icon: GitBranch },
    { id: 'integrations', label: 'Integrations', icon: Plug }
  ];

  // Integration Panel Component
  const IntegrationPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Connected Integrations</h3>
        <p className="text-sm text-slate-500 mb-6">Configure data sources for your dashboard</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(INTEGRATIONS).map(([key, integration]) => {
            const Icon = integration.icon;
            return (
              <div key={key} className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                integration.status === 'connected' ? 'border-emerald-300 bg-emerald-50' :
                integration.status === 'configurable' ? 'border-blue-300 bg-blue-50' :
                'border-slate-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: integration.color + '15' }}>
                      <Icon className="w-5 h-5" style={{ color: integration.color }} />
                    </div>
                    <span className="font-medium text-slate-900">{integration.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    integration.status === 'connected' ? 'bg-emerald-100 text-emerald-700' :
                    integration.status === 'configurable' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {integration.status === 'connected' ? '✓ Connected' : 
                     integration.status === 'configurable' ? 'Configure' : 'Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{integration.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Setup Guide */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Quick Setup Guide
        </h3>
        <div className="space-y-4 text-sm">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-medium text-blue-300 mb-2">1. GitHub Integration</p>
            <code className="text-xs text-slate-300 block">
              • Connect via Zapier GitHub tools<br/>
              • Fetch PRs, Issues, Security Alerts<br/>
              • Webhook: github.com/settings/hooks
            </code>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-medium text-pink-300 mb-2">2. n8n Workflows</p>
            <code className="text-xs text-slate-300 block">
              • Create webhook triggers for dashboard updates<br/>
              • POST to /api/webhooks/n8n<br/>
              • Templates: Security alerts, PR assignments
            </code>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-medium text-slate-300 mb-2">3. Notion Sync</p>
            <code className="text-xs text-slate-300 block">
              • Connect project databases<br/>
              • Auto-sync engineering docs<br/>
              • Bi-directional updates
            </code>
          </div>
        </div>
      </div>

      {/* Suggested Additional Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended for INT</h3>
        <div className="space-y-3">
          {[
            { name: 'Vercel', desc: 'Already in your MCP servers - deployments, logs, edge functions', priority: 'High' },
            { name: 'Linear', desc: 'Issue tracking for engineering sprints', priority: 'High' },
            { name: 'Stripe', desc: 'FlashFusion revenue metrics when you launch', priority: 'Medium' },
            { name: 'Cloudflare', desc: 'Security analytics, threat blocking, WAF rules', priority: 'High' },
            { name: 'Sentry', desc: 'Error monitoring across all services', priority: 'High' },
            { name: 'AWS CloudWatch', desc: 'Infrastructure metrics, cost optimization', priority: 'Medium' },
            { name: 'PagerDuty', desc: 'On-call scheduling, incident escalation', priority: 'Medium' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="font-medium text-slate-900">{item.name}</span>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>{item.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-10 bg-blue-500 rounded-sm"></div>
                <div className="w-1.5 h-10 bg-blue-400 rounded-sm"></div>
                <div className="w-1.5 h-10 bg-blue-500 rounded-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">INT Inc.</h1>
                <p className="text-slate-400 text-xs">AppSec & Platform Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-slate-700 border-0 text-sm rounded-lg px-3 py-1.5 text-white">
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Last sync</p>
                <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
              </div>
              <button onClick={refreshData} className={`p-2 hover:bg-slate-700 rounded-lg transition-colors ${isLoading ? 'animate-spin' : ''}`}>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-slate-50 text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-slate-500">Vulnerabilities</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{totalVulns}</div>
                <span className="text-xs text-red-600">{criticalCount} critical/high</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-500">Patch Status</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{data.securityMetrics.patchCompliance}%</div>
                <span className="text-xs text-emerald-600">↑ 2% this week</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Github className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-medium text-slate-500">Open PRs</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{data.github.pullRequests.filter(p => p.status !== 'Merged').length}</div>
                <span className="text-xs text-blue-600">{data.github.pullRequests.filter(p => p.status === 'Approved').length} approved</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Webhook className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-medium text-slate-500">n8n Workflows</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{data.n8n.workflows.filter(w => w.status === 'active').length}</div>
                <span className="text-xs text-slate-500">active</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-black" />
                  <span className="text-xs font-medium text-slate-500">Deployments</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{data.vercel.deployments.length}</div>
                <span className="text-xs text-emerald-600">All healthy</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-medium text-slate-500">Notion Docs</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{data.notion.projects.reduce((a, p) => a + p.docs, 0)}</div>
                <span className="text-xs text-slate-500">{data.notion.projects.length} projects</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Security Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.securityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="resolved" stroke={BRAND.accent} fill={BRAND.accent} fillOpacity={0.2} name="Resolved" />
                    <Area type="monotone" dataKey="high" stroke="#f97316" fill="#f97316" fillOpacity={0.4} name="High" />
                    <Area type="monotone" dataKey="critical" stroke={BRAND.danger} fill={BRAND.danger} fillOpacity={0.6} name="Critical" />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">GitHub Activity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.github.commits}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="count" fill={BRAND.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-purple-600" />
                  Recent PRs
                </h3>
                <div className="space-y-3">
                  {data.github.pullRequests.slice(0, 3).map((pr, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{pr.id}</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                          pr.status === 'Merged' ? 'bg-purple-100 text-purple-700' :
                          pr.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{pr.status}</span>
                      </div>
                      <p className="text-sm text-slate-900 truncate">{pr.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{pr.author} • {pr.repo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-pink-600" />
                  n8n Executions
                </h3>
                <div className="space-y-3">
                  {data.n8n.recentExecutions.map((exec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                          exec.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>{exec.status}</span>
                        <span className="text-xs text-slate-500">{exec.time}</span>
                      </div>
                      <p className="text-sm text-slate-900 truncate">{exec.workflow}</p>
                      <p className="text-xs text-slate-500 mt-1">Duration: {exec.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  Notion Updates
                </h3>
                <div className="space-y-3">
                  {data.notion.recentDocs.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-900 truncate font-medium">{doc.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{doc.project}</p>
                      <p className="text-xs text-slate-400 mt-1">{doc.author} • {doc.updated}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* GitHub Tab */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-purple-600" />
                  Pull Requests
                </h3>
                <div className="space-y-3">
                  {data.github.pullRequests.map((pr, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">{pr.id}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            pr.status === 'Merged' ? 'bg-purple-100 text-purple-700' :
                            pr.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            pr.status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>{pr.status}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{pr.changes}</span>
                      </div>
                      <p className="text-sm text-slate-900">{pr.title}</p>
                      <p className="text-xs text-slate-500 mt-2">{pr.author} • {pr.repo} • {pr.reviewers} reviewer(s)</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Security Alerts
                </h3>
                <div className="space-y-3">
                  {data.github.securityAlerts.map((alert, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'High' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-slate-500">{alert.id}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          alert.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>{alert.severity}</span>
                      </div>
                      <p className="text-sm text-slate-900 font-medium">{alert.package}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alert.version} → {alert.fixed} • {alert.repo}
                      </p>
                    </div>
                  ))}
                  {data.github.securityAlerts.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                      <p className="text-sm">No security alerts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Commit Activity (7 days)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.github.commits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill={BRAND.secondary} radius={[4, 4, 0, 0]} name="Commits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* n8n Tab */}
        {activeTab === 'n8n' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Active Workflows</p>
                <p className="text-3xl font-bold text-slate-900">{data.n8n.workflows.filter(w => w.status === 'active').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Total Executions</p>
                <p className="text-3xl font-bold text-slate-900">{data.n8n.workflows.reduce((a, w) => a + w.executions, 0)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-emerald-600">98.2%</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Errors (24h)</p>
                <p className="text-3xl font-bold text-amber-600">{data.n8n.workflows.reduce((a, w) => a + w.errors, 0)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Webhook className="w-4 h-4 text-pink-600" />
                Workflows
              </h3>
              <div className="space-y-3">
                {data.n8n.workflows.map((wf, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${wf.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <div>
                        <p className="font-medium text-slate-900">{wf.name}</p>
                        <p className="text-xs text-slate-500">Last run: {wf.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{wf.executions}</p>
                        <p className="text-xs text-slate-500">executions</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${wf.errors > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{wf.errors}</p>
                        <p className="text-xs text-slate-500">errors</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        wf.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{wf.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Executions</h3>
              <div className="space-y-2">
                {data.n8n.recentExecutions.map((exec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${exec.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-slate-900">{exec.workflow}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{exec.duration}</span>
                      <span>{exec.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notion Tab */}
        {activeTab === 'notion' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                Engineering Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.notion.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{proj.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        proj.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        proj.status === 'Review' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{proj.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{proj.docs} documents</span>
                      <span>Updated {proj.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {data.notion.recentDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{doc.project}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{doc.author}</p>
                      <p>{doc.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Platform Tab */}
        {activeTab === 'platform' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Vercel Requests</p>
                <p className="text-2xl font-bold text-slate-900">{data.vercel.metrics.requests}</p>
                <p className="text-xs text-slate-500">this month</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">P99 Latency</p>
                <p className="text-2xl font-bold text-slate-900">{data.vercel.metrics.p99Latency}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Error Rate</p>
                <p className="text-2xl font-bold text-emerald-600">{data.vercel.metrics.errorRate}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">Edge Functions</p>
                <p className="text-2xl font-bold text-slate-900">{data.vercel.metrics.edgeFunctions}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Platform Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.platformHealth.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${service.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <div>
                        <span className="font-medium text-slate-900">{service.service}</span>
                        <p className="text-xs text-slate-500">{service.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{service.uptime}%</p>
                        <p className="text-xs text-slate-500">uptime</p>
                      </div>
                      {service.latency > 0 && (
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${service.latency > 100 ? 'text-amber-600' : 'text-slate-900'}`}>{service.latency}ms</p>
                          <p className="text-xs text-slate-500">latency</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Recent Deployments
              </h3>
              <div className="space-y-3">
                {data.vercel.deployments.map((deploy, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        deploy.status === 'success' ? 'bg-emerald-500' : 
                        deploy.status === 'building' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
                      }`} />
                      <div>
                        <span className="font-medium text-slate-900">{deploy.env}</span>
                        <p className="text-xs text-slate-500">{deploy.project}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-slate-700">{deploy.version}</p>
                      <p className="text-xs text-slate-500">{deploy.by} • {deploy.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex flex-wrap gap-3">
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm" value={filter.priority} onChange={(e) => setFilter({...filter, priority: e.target.value})}>
                  <option value="">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm" value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
                  <option value="">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                  <option value="In Review">In Review</option>
                </select>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm" value={filter.lead} onChange={(e) => setFilter({...filter, lead: e.target.value})}>
                  <option value="">All Leads</option>
                  {[...new Set(data.engineeringProjects.map(p => p.lead))].map(lead => (
                    <option key={lead} value={lead}>{lead}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredProjects.map(project => (
                  <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-900">{project.name}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          project.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          project.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>{project.priority}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'In Review' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>{project.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                      <span>Lead: {project.lead}</span>
                      <span>Due: {project.deadline}</span>
                      <span>Tasks: {project.completed}/{project.tasks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-600 w-12 text-right">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && <IntegrationPanel />}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">INT Inc. • Business Solutions You CAN Take for Granted</p>
          <p className="text-xs text-slate-400 mt-1">AppSec & Platform Engineering Dashboard v3.0 • 10 Integrations</p>
        </div>
      </div>
    </div>
  );
};

export default INTDashboard;