/**
 * data.ts — DEMO / MOCK data for the Universal AI App Generator dashboard.
 *
 * ⚠️  EVERYTHING IN THIS FILE IS FAKE.
 * These values were carried over verbatim from the source chat to preserve the
 * original demo. They are NOT real measurements:
 *   - securityScore: 98.5            (mock)
 *   - costOptimizationSaved: $12,847 (mock)
 *   - monthlyActiveUsers: 2.4M       (mock)
 *   - uptime / deployment URLs / user counts / "passed" security checks (all mock)
 *
 * Do not present any of these numbers as real product metrics. Wire the UI to a
 * real telemetry/backend source before using it for anything beyond a demo.
 */
import {
  Brain,
  Code,
  Shield,
  Rocket,
  Database,
  TestTube,
  Palette,
  DollarSign,
  FileText,
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  icon: LucideIcon;
  /** Tailwind gradient classes for the agent badge. */
  color: string;
  status: "active" | "busy" | "idle";
  description: string;
  capabilities: string[];
}

export interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
  tech: string;
  status: "ready" | "beta" | "planned";
  deployment: string[];
  features: string[];
}

export interface SecurityCheck {
  name: string;
  status: "passed" | "warning" | "failed";
  /** MOCK score 0-100. */
  score: number;
  lastCheck: string;
}

export interface DeploymentTarget {
  name: string;
  status: "deployed" | "review" | "configuring";
  url: string;
  cost: string;
  users: string;
  uptime: string;
  lastDeploy: string;
}

export interface ProjectMetric {
  name: string;
  value: string;
  trend: "up" | "down" | "stable";
  good: boolean;
}

/** MOCK aggregate stats shown in the sidebar / analytics hub. */
export interface ProjectStats {
  totalProjects: number;
  activeDeployments: number;
  securityScore: number;
  uptime: string;
  monthlyActiveUsers: string;
  costOptimizationSaved: string;
  codeQualityScore: number;
  testCoverage: number;
}

// --- MOCK aggregate stats -------------------------------------------------
export const initialProjectStats: ProjectStats = {
  totalProjects: 127,
  activeDeployments: 43,
  securityScore: 98.5, // MOCK
  uptime: "99.97%", // MOCK
  monthlyActiveUsers: "2.4M", // MOCK
  costOptimizationSaved: "$12,847", // MOCK
  codeQualityScore: 9.2, // MOCK
  testCoverage: 94, // MOCK
};

// --- Agent fleet ----------------------------------------------------------
export const agents: Agent[] = [
  {
    id: "orchestrator",
    name: "Master Orchestrator",
    icon: Brain,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    status: "active",
    description: "Coordinates all agents and manages project lifecycle",
    capabilities: ["Project Planning", "Agent Coordination", "Risk Assessment", "Quality Control"],
  },
  {
    id: "codegen",
    name: "Code Generation Agent",
    icon: Code,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    status: "active",
    description: "Generates production-ready code across all platforms",
    capabilities: ["Full-Stack Development", "Multi-Language Support", "Framework Integration", "API Development"],
  },
  {
    id: "security",
    name: "Security Guardian",
    icon: Shield,
    color: "bg-gradient-to-r from-red-500 to-rose-500",
    status: "active",
    description: "Ensures enterprise-grade security across all applications",
    capabilities: ["OWASP Compliance", "Penetration Testing", "Compliance Auditing", "Threat Detection"],
  },
  {
    id: "deploy",
    name: "Deployment Specialist",
    icon: Rocket,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    status: "active",
    description: "Handles multi-platform deployment and infrastructure",
    capabilities: ["CI/CD Pipelines", "Cloud Integration", "Auto-Scaling", "Performance Optimization"],
  },
  {
    id: "database",
    name: "Data Architect",
    icon: Database,
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    status: "active",
    description: "Designs and optimizes database architecture",
    capabilities: ["Schema Design", "Query Optimization", "Data Migration", "Real-time Sync"],
  },
  {
    id: "qa",
    name: "Quality Engineer",
    icon: TestTube,
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    status: "active",
    description: "Ensures code quality and comprehensive testing",
    capabilities: ["Automated Testing", "Performance Testing", "A11y Testing", "Visual Regression"],
  },
  {
    id: "ux",
    name: "UX Optimizer",
    icon: Palette,
    color: "bg-gradient-to-r from-pink-500 to-purple-500",
    status: "active",
    description: "Optimizes user experience and interface design",
    capabilities: ["Design Systems", "User Research", "A/B Testing", "Accessibility"],
  },
  {
    id: "cost",
    name: "Cost Intelligence",
    icon: DollarSign,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    status: "active",
    description: "Monitors and optimizes resource costs in real-time",
    capabilities: ["Cost Analysis", "Resource Optimization", "Budget Alerts", "ROI Tracking"],
  },
  {
    id: "docs",
    name: "Documentation AI",
    icon: FileText,
    color: "bg-gradient-to-r from-teal-500 to-green-500",
    status: "active",
    description: "Generates comprehensive documentation and guides",
    capabilities: ["API Documentation", "User Guides", "Code Comments", "Video Tutorials"],
  },
  {
    id: "compliance",
    name: "Compliance Monitor",
    icon: CheckCircle,
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    status: "active",
    description: "Ensures regulatory compliance and governance",
    capabilities: ["GDPR Compliance", "HIPAA Auditing", "SOC2 Standards", "Data Governance"],
  },
];

// --- Platforms ------------------------------------------------------------
export const platforms: Platform[] = [
  {
    id: "web",
    name: "Web Applications",
    icon: Globe,
    tech: "React, Vue, Angular, Next.js",
    status: "ready",
    deployment: ["Vercel", "Netlify", "AWS", "Azure"],
    features: ["PWA Support", "SSR/SSG", "Edge Computing", "Real-time Features"],
  },
  {
    id: "mobile",
    name: "Mobile Applications",
    icon: Smartphone,
    tech: "React Native, Flutter, Ionic",
    status: "ready",
    deployment: ["App Store", "Google Play", "TestFlight", "Firebase"],
    features: ["Native APIs", "Push Notifications", "Offline Sync", "Deep Linking"],
  },
  {
    id: "desktop",
    name: "Desktop Applications",
    icon: Monitor,
    tech: "Electron, Tauri, .NET MAUI",
    status: "ready",
    deployment: ["Windows Store", "Mac App Store", "Linux Repos", "Direct Download"],
    features: ["Auto-Updates", "System Integration", "Native Performance", "Cross-Platform"],
  },
  {
    id: "edge",
    name: "Edge Functions",
    icon: Zap,
    tech: "Cloudflare Workers, Vercel Edge",
    status: "ready",
    deployment: ["Cloudflare", "Vercel", "AWS Lambda@Edge", "Fastly"],
    features: ["Global Distribution", "Sub-50ms Latency", "Auto-Scaling", "Pay-per-Request"],
  },
];

// --- MOCK security checks --------------------------------------------------
export const securityChecks: SecurityCheck[] = [
  { name: "OWASP Top 10", status: "passed", score: 100, lastCheck: "2 min ago" },
  { name: "Dependency Vulnerabilities", status: "passed", score: 98, lastCheck: "5 min ago" },
  { name: "Code Quality Analysis", status: "passed", score: 95, lastCheck: "1 min ago" },
  { name: "Access Control Audit", status: "passed", score: 100, lastCheck: "10 min ago" },
  { name: "Data Encryption Check", status: "passed", score: 100, lastCheck: "3 min ago" },
  { name: "API Security Scan", status: "warning", score: 92, lastCheck: "1 min ago" },
  { name: "Compliance Standards", status: "passed", score: 97, lastCheck: "15 min ago" },
  { name: "Penetration Test", status: "passed", score: 96, lastCheck: "1 hour ago" },
];

// --- MOCK deployment targets ----------------------------------------------
export const deploymentTargets: DeploymentTarget[] = [
  {
    name: "Vercel Production",
    status: "deployed",
    url: "social-app.vercel.app",
    cost: "$12/mo",
    users: "24.5K",
    uptime: "99.9%",
    lastDeploy: "2 hours ago",
  },
  {
    name: "iOS App Store",
    status: "review",
    url: "pending review",
    cost: "$99/year",
    users: "pending",
    uptime: "N/A",
    lastDeploy: "1 day ago",
  },
  {
    name: "Android Play Store",
    status: "deployed",
    url: "play.google.com/store/apps",
    cost: "$25/year",
    users: "15.2K",
    uptime: "99.8%",
    lastDeploy: "3 days ago",
  },
  {
    name: "AWS Production",
    status: "configuring",
    url: "pending",
    cost: "$45/mo",
    users: "pending",
    uptime: "N/A",
    lastDeploy: "never",
  },
];

// --- MOCK real-time project metrics ---------------------------------------
export const projectMetrics: ProjectMetric[] = [
  { name: "Response Time", value: "127ms", trend: "down", good: true },
  { name: "Error Rate", value: "0.02%", trend: "down", good: true },
  { name: "Throughput", value: "2.4K req/min", trend: "up", good: true },
  { name: "Database Queries", value: "156ms avg", trend: "down", good: true },
  { name: "Memory Usage", value: "68%", trend: "stable", good: true },
  { name: "CPU Utilization", value: "23%", trend: "down", good: true },
];

// --- Sidebar navigation ----------------------------------------------------
export interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
  badge: string | null;
}
