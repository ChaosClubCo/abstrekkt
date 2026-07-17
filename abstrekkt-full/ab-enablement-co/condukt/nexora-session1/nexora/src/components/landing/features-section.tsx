"use client";

import {
  Users, Kanban, Calendar, Bot, GraduationCap, Globe,
  Mail, Zap, MessageCircle, Link, BarChart3, Package,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Smart CRM",
    description: "Track every contact, deal, and interaction. Visual pipeline with drag & drop stages.",
    color: "text-nexora-400",
    bg: "bg-nexora-500/10",
    span: "md:col-span-2",
  },
  {
    icon: Bot,
    title: "Nexus AI Agent",
    description: "85+ AI tools at your fingertips. Draft emails, analyze pipelines, research leads — all by chat.",
    color: "text-electric-400",
    bg: "bg-electric-500/10",
    span: "md:col-span-2",
  },
  {
    icon: Calendar,
    title: "Calendar & Booking",
    description: "Custom booking pages, Google/Outlook sync, appointment types with automated reminders.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    span: "",
  },
  {
    icon: Globe,
    title: "Community Hub",
    description: "Build engaged communities with teams, posts, events, achievements, and gamification.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    span: "",
  },
  {
    icon: GraduationCap,
    title: "Learning Platform",
    description: "Create courses, modules, and video content. Track student progress with certificates.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    span: "",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description: "Connect Gmail & Google Workspace. Read, send, and manage emails without leaving Nexora.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    span: "",
  },
  {
    icon: Zap,
    title: "Automations",
    description: "Visual workflow builder. Trigger actions on events, dates, or conditions. Zero code required.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    span: "",
  },
  {
    icon: MessageCircle,
    title: "Social Inbox",
    description: "Instagram, Facebook Messenger & WhatsApp — unified in one inbox. Never miss a message.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    span: "",
  },
  {
    icon: Kanban,
    title: "Pipeline & Deals",
    description: "Visual deal tracking with custom stages, probability scoring, and revenue forecasting.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    span: "",
  },
  {
    icon: Link,
    title: "ProfileTree",
    description: "Your link-in-bio page. Showcase products, booking links, and social proof in one URL.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Reports & Goals",
    description: "Real-time analytics on contacts, deals, revenue, and team performance. Set and track goals.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    span: "",
  },
  {
    icon: Package,
    title: "Products & Proposals",
    description: "Product catalog, professional proposals with line items, and integrated invoicing.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    span: "",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-medium text-nexora-400 mb-3 tracking-wide uppercase">
            Everything You Need
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            <span className="text-foreground">One platform.</span>{" "}
            <span className="text-gradient">Zero compromises.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Stop juggling 10+ tools. Nexora replaces your CRM, calendar, email client,
            course platform, community tool, and more — all connected with AI.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl border border-border/30 bg-card/40 hover:bg-card/60 transition-all duration-300 hover:border-border/60 hover:shadow-xl hover:shadow-black/10 ${feature.span}`}
              >
                <div className={`inline-flex p-2.5 rounded-xl ${feature.bg} mb-4`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(337 82% 55% / 0.04), transparent 60%)`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
