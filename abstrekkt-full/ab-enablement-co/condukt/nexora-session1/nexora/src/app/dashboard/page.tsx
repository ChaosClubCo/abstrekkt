"use client";

import {
  Users, Handshake, TrendingUp, CheckSquare,
  ArrowUpRight, ArrowDownRight, Clock, MessageCircle,
  Calendar, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { label: "Total Contacts", value: "2,847", change: "+12.3%", up: true, icon: Users, color: "text-nexora-400", bg: "bg-nexora-500/10" },
  { label: "Open Deals", value: "23", change: "+3", up: true, icon: Handshake, color: "text-electric-400", bg: "bg-electric-500/10" },
  { label: "Revenue (MTD)", value: "€12,480", change: "+8.7%", up: true, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Open Tasks", value: "8", change: "-2", up: false, icon: CheckSquare, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const recentActivity = [
  { type: "deal", text: "Deal \"Enterprise Package\" moved to Negotiation", time: "2 min ago", icon: Handshake },
  { type: "contact", text: "New contact: Sarah Johnson added from web form", time: "15 min ago", icon: Users },
  { type: "calendar", text: "Coaching call with Marcus T. in 30 minutes", time: "28 min ago", icon: Calendar },
  { type: "ai", text: "Nexus AI drafted 3 follow-up emails for review", time: "1 hour ago", icon: Bot },
  { type: "message", text: "New Instagram DM from @coachlife_academy", time: "2 hours ago", icon: MessageCircle },
];

const upcomingTasks = [
  { title: "Follow up with lead: Anna M.", due: "Today, 2:00 PM", priority: "high" },
  { title: "Prepare Q1 community event outline", due: "Today, 5:00 PM", priority: "medium" },
  { title: "Review proposal #247 (Consulting Corp)", due: "Tomorrow", priority: "medium" },
  { title: "Record Module 3 video for Elevate course", due: "Wed, Feb 18", priority: "low" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Good afternoon, Kyle</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your business today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/inbox">
            <Button variant="outline" size="sm" className="gap-2">
              <Bot className="w-4 h-4" />
              Ask Nexus AI
            </Button>
          </Link>
          <Link href="/dashboard/contacts">
            <Button size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Add Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl border border-border/30 bg-card/40 hover:bg-card/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-400" : "text-amber-400"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-border/30 bg-card/30 p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-nexora-500/10 group-hover:text-nexora-400 transition-colors shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80">{activity.text}</p>
                    <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-2xl border border-border/30 bg-card/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Upcoming Tasks</h3>
            <Link href="/dashboard/todos" className="text-xs text-nexora-400 hover:text-nexora-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  task.priority === "high" ? "bg-red-400" :
                  task.priority === "medium" ? "bg-amber-400" : "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/80">{task.title}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{task.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "New Contact", href: "/dashboard/contacts", icon: Users },
          { label: "New Deal", href: "/dashboard/deals", icon: Handshake },
          { label: "Book Meeting", href: "/dashboard/calendar", icon: Calendar },
          { label: "Ask AI", href: "/dashboard/inbox", icon: Bot },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/20 bg-card/20 hover:bg-card/50 hover:border-border/40 transition-all group"
            >
              <div className="p-2 rounded-lg bg-muted/40 group-hover:bg-nexora-500/10 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-nexora-400 transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
