import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_NAME = "Nexora";
export const APP_DESCRIPTION = "The AI Business Engine. CRM, Calendar, Learning & Community — all in one place.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nexora.app";

export const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with the essentials",
    features: [
      "Up to 100 contacts",
      "Basic CRM & Pipeline",
      "Calendar with 1 booking page",
      "Community access (1 team)",
      "5 AI credits/month",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 22,
    period: "/month",
    description: "For growing coaches & creators",
    features: [
      "Up to 2,500 contacts",
      "Full CRM with automations",
      "Unlimited booking pages",
      "Email integration",
      "100 AI credits/month",
      "3 community teams",
      "Learning courses (5 modules)",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 44,
    period: "/month",
    description: "Unlimited power for professionals",
    features: [
      "Unlimited contacts",
      "Advanced automations",
      "Social inbox (IG, FB, WhatsApp)",
      "Unlimited AI credits",
      "Unlimited teams & courses",
      "Proposals & invoicing",
      "Custom branding",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: 88,
    period: "/month",
    description: "Scale with your organization",
    features: [
      "Everything in Pro",
      "Team management & roles",
      "Shared pipelines & contacts",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Dedicated success manager",
    ],
    cta: "Start Team",
    highlighted: false,
  },
] as const;

export const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
] as const;

export const DASHBOARD_NAV = [
  { section: "Core", items: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Contacts", href: "/dashboard/contacts", icon: "Users" },
    { label: "Pipeline", href: "/dashboard/pipeline", icon: "Kanban" },
    { label: "Deals", href: "/dashboard/deals", icon: "Handshake" },
    { label: "Calendar", href: "/dashboard/calendar", icon: "Calendar" },
    { label: "Email", href: "/dashboard/email", icon: "Mail" },
    { label: "Todos", href: "/dashboard/todos", icon: "CheckSquare" },
  ]},
  { section: "AI & Tools", items: [
    { label: "Nexus AI", href: "/dashboard/inbox", icon: "Bot" },
    { label: "Automations", href: "/dashboard/automations", icon: "Zap" },
    { label: "Toolbox", href: "/dashboard/toolbox", icon: "Wrench" },
  ]},
  { section: "Growth", items: [
    { label: "Community", href: "/dashboard/community", icon: "Globe" },
    { label: "Learning", href: "/dashboard/learning", icon: "GraduationCap" },
    { label: "Products", href: "/dashboard/products", icon: "Package" },
    { label: "Proposals", href: "/dashboard/proposals", icon: "FileText" },
    { label: "Reviews", href: "/dashboard/reviews", icon: "Star" },
  ]},
  { section: "Presence", items: [
    { label: "ProfileTree", href: "/dashboard/profile-tree", icon: "Link" },
    { label: "PageTree", href: "/dashboard/page-tree", icon: "Layout" },
    { label: "Social Inbox", href: "/dashboard/social-inbox", icon: "MessageCircle" },
  ]},
  { section: "Insights", items: [
    { label: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
    { label: "Goals", href: "/dashboard/goals", icon: "Target" },
  ]},
] as const;
