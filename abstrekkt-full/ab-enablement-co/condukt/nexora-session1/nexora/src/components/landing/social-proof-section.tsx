"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Nexora completely transformed how I manage my coaching business. All-in-one CRM, automations, and AI assistant — I finally stopped juggling 8 different tools.",
    name: "Sarah K.",
    role: "Business Coach",
    avatar: "SK",
  },
  {
    quote: "The AI agent is unreal. It drafts my follow-up emails, analyzes my pipeline, and even reminds me who to call. Like having a virtual assistant that actually works.",
    name: "Marcus T.",
    role: "Network Marketing Leader",
    avatar: "MT",
  },
  {
    quote: "We moved our entire community from Skool to Nexora. The learning platform, achievements system, and built-in CRM gave us everything in one place.",
    name: "Jessica R.",
    role: "Course Creator",
    avatar: "JR",
  },
  {
    quote: "The booking pages and calendar sync saved me hours every week. My clients love the seamless scheduling experience, and I love the automatic reminders.",
    name: "David L.",
    role: "Life Coach",
    avatar: "DL",
  },
  {
    quote: "Finally a platform that understands network marketing. The pipeline, contact stages, and team management features are exactly what our industry needed.",
    name: "Anna M.",
    role: "Team Leader, MLM",
    avatar: "AM",
  },
  {
    quote: "From proposal creation to invoicing — Nexora handles the entire client journey. The social inbox alone replaced three separate apps for us.",
    name: "Tom B.",
    role: "Consultant & Trainer",
    avatar: "TB",
  },
];

const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "2.5M+", label: "Contacts Managed" },
  { value: "85+", label: "AI Tools" },
  { value: "99.9%", label: "Uptime" },
];

export function SocialProofSection() {
  return (
    <section id="community" className="relative py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-nexora-400 mb-3 tracking-wide uppercase">
            Loved by Thousands
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight">
            <span className="text-foreground">Real results from </span>
            <span className="text-gradient">real businesses.</span>
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative p-6 rounded-2xl border border-border/30 bg-card/30 hover:bg-card/50 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-nexora flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
