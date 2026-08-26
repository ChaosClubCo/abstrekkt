"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_TIERS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="absolute inset-0 bg-mesh-dark opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-nexora-400 mb-3 tracking-wide uppercase">
            Simple Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            <span className="text-foreground">Start free.</span>{" "}
            <span className="text-gradient">Scale when ready.</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            All prices excl. VAT. Cancel anytime. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
                tier.highlighted
                  ? "border-nexora-500/50 bg-card/80 shadow-xl shadow-nexora-500/10 scale-[1.02]"
                  : "border-border/30 bg-card/40 hover:border-border/60"
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-nexora text-white text-xs font-medium shadow-lg shadow-nexora-500/30">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-display font-bold text-foreground">
                  €{tier.price}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {tier.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-nexora-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth">
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom solution?{" "}
            <Link href="#" className="text-nexora-400 hover:text-nexora-300 font-medium transition-colors">
              Contact us for Enterprise pricing →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
