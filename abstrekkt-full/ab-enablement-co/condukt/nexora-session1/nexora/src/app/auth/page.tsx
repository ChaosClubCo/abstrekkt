"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-mesh-dark items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-nexora-500/8 blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-electric-500/6 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-nexora flex items-center justify-center shadow-lg shadow-nexora-500/20">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-display font-semibold">Nexora</span>
          </Link>
          <h1 className="font-display text-4xl tracking-tight mb-4">
            <span className="text-foreground">Your business,</span>
            <br />
            <span className="text-gradient">unified.</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            CRM, Calendar, AI Assistant, Learning, and Community — all in one platform
            designed for coaches, creators, and entrepreneurs.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Free plan with no credit card",
              "Setup in under 5 minutes",
              "GDPR compliant & secure",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-nexora-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-nexora-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-nexora flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-display font-semibold">Nexora</span>
            </Link>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-8">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                  mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-display font-semibold mb-2">
            {mode === "login" ? "Welcome back" : "Get started free"}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "login"
              ? "Sign in to your Nexora account"
              : "Create your free account — no credit card needed"}
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="space-y-4"
          >
            {mode === "register" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/50 bg-card/30 text-sm focus:outline-none focus:ring-2 focus:ring-nexora-500/50 focus:border-nexora-500/50 transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/50 bg-card/30 text-sm focus:outline-none focus:ring-2 focus:ring-nexora-500/50 focus:border-nexora-500/50 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-border/50 bg-card/30 text-sm focus:outline-none focus:ring-2 focus:ring-nexora-500/50 focus:border-nexora-500/50 transition-all placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <Link href="#" className="text-xs text-nexora-400 hover:text-nexora-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full h-11 group">
              {mode === "login" ? "Sign In" : "Create Free Account"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          {mode === "register" && (
            <p className="mt-4 text-xs text-muted-foreground text-center">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-nexora-400 hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-nexora-400 hover:underline">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
