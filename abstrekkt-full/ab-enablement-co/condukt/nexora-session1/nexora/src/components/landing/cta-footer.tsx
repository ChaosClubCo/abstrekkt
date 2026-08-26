"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-nexora-500/8 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
          <span className="text-foreground">Ready to </span>
          <span className="text-gradient">simplify everything?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of coaches, creators, and entrepreneurs who run their
          entire business from one platform. Start free — upgrade when you&apos;re ready.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth">
            <Button size="xl" className="group">
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Free forever plan available · No credit card required · GDPR compliant
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
    Resources: ["Help Center", "API Docs", "Blog", "Community", "Status"],
    Company: ["About", "Careers", "Press", "Contact", "Partners"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Imprint"],
  };

  return (
    <footer id="about" className="border-t border-border/30 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-nexora flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-display font-semibold">Nexora</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The AI Business Engine for Coaches, Creators & Entrepreneurs.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nexora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
