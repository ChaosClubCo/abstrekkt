"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Ambient Mesh Background */}
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-nexora-500/5 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-electric-500/5 blur-[100px] animate-glow-pulse animate-delay-500" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm mb-8 opacity-0 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-nexora-400" />
          <span className="text-xs font-medium text-muted-foreground">
            AI-Powered Business Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-6 opacity-0 animate-slide-up animate-delay-100">
          <span className="block text-foreground">One platform.</span>
          <span className="block text-gradient mt-1">Your entire business.</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 opacity-0 animate-slide-up animate-delay-300">
          CRM, Calendar, AI Assistant, Learning, Community — stop juggling 10+ tools.
          <span className="text-foreground font-medium"> Nexora unifies everything</span> for
          Coaches, Creators & Entrepreneurs.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-slide-up animate-delay-400">
          <Link href="/auth">
            <Button size="xl" className="group">
              Start Free Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="glass" size="xl">
              See What&apos;s Inside
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground opacity-0 animate-fade-in animate-delay-600">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            GDPR Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Setup in 5 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-nexora-400" />
            No credit card required
          </span>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl opacity-0 animate-slide-up animate-delay-700">
          <div className="glow-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="bg-card border border-border/30 rounded-2xl p-1">
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-muted/50 rounded-md px-3 py-1.5 text-[11px] text-muted-foreground text-center">
                    app.nexora.io/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard Mockup */}
              <div className="aspect-[16/9] bg-gradient-to-b from-background to-card/80 rounded-b-xl p-6 md:p-8">
                <div className="grid grid-cols-12 gap-4 h-full">
                  {/* Sidebar */}
                  <div className="col-span-2 hidden md:block">
                    <div className="space-y-2">
                      {["Dashboard", "Contacts", "Pipeline", "Calendar", "AI Chat"].map((item, i) => (
                        <div
                          key={item}
                          className={`h-8 rounded-lg ${i === 0 ? "bg-nexora-500/20 border border-nexora-500/30" : "bg-muted/30"} flex items-center px-3`}
                        >
                          <div className={`w-3 h-3 rounded ${i === 0 ? "bg-nexora-400" : "bg-muted-foreground/20"} mr-2`} />
                          <span className={`text-[10px] ${i === 0 ? "text-nexora-300" : "text-muted-foreground/40"}`}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="col-span-12 md:col-span-10 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Contacts", value: "2,847", color: "text-nexora-400" },
                        { label: "Open Deals", value: "23", color: "text-electric-400" },
                        { label: "Revenue", value: "€12.4k", color: "text-emerald-400" },
                        { label: "Tasks", value: "8", color: "text-amber-400" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-muted/20 border border-border/20 rounded-xl p-3 md:p-4">
                          <div className={`text-base md:text-xl font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-[9px] md:text-[11px] text-muted-foreground/50 mt-0.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Content Area */}
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      <div className="col-span-2 bg-muted/10 border border-border/10 rounded-xl p-4">
                        <div className="text-[11px] font-medium text-muted-foreground/40 mb-3">Pipeline Overview</div>
                        <div className="flex gap-2 h-20">
                          {[60, 45, 75, 35, 55, 80, 40].map((h, i) => (
                            <div key={i} className="flex-1 flex items-end">
                              <div
                                className="w-full rounded-t bg-gradient-to-t from-nexora-500/40 to-nexora-400/20"
                                style={{ height: `${h}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-muted/10 border border-border/10 rounded-xl p-4">
                        <div className="text-[11px] font-medium text-muted-foreground/40 mb-3">AI Assistant</div>
                        <div className="space-y-2">
                          <div className="bg-nexora-500/10 rounded-lg p-2 text-[9px] text-nexora-300">
                            3 contacts need follow-up today
                          </div>
                          <div className="bg-muted/30 rounded-lg p-2 text-[9px] text-muted-foreground/60">
                            Draft email for deal #247...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Reflection/Glow under preview */}
          <div className="absolute -bottom-8 left-1/4 right-1/4 h-16 bg-nexora-500/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
}
