"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, FormEvent } from "react";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredEmail() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("abstrekkt_dispatch_email") || "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

export default function KyleRosebrookLandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSubscribed, setCustomSubscribed] = useState<boolean | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const storedEmail = useSyncExternalStore(
    subscribeStorage,
    getStoredEmail,
    getServerSnapshot
  );

  const isSubscribed = customSubscribed !== null ? customSubscribed : Boolean(storedEmail);
  const displayEmail = email || storedEmail;

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCustomSubscribed(true);
      try {
        localStorage.setItem("abstrekkt_dispatch_email", email);
      } catch {
        // Ignore local storage error
      }
    }, 600);
  };

  const handleCopyEmail = async () => {
    const contactEmail = "KyleRosebrook@gmail.com";
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(contactEmail);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <main
      id="kyle-rosebrook-landing"
      className="min-h-screen bg-ink text-paper selection:bg-ember selection:text-ink flex flex-col justify-between"
    >
      {/* Container with accessible responsive padding */}
      <div className="w-full max-w-[620px] mx-auto px-5 sm:px-8 py-12 sm:py-20 md:py-24 flex-1">
        {/* Header card */}
        <div
          id="profile-hero-card"
          className="border border-paper/10 bg-surface/75 backdrop-blur-sm rounded-lg p-6 sm:p-9 shadow-lg relative overflow-hidden"
        >
          {/* Subtle ember accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ember/20 via-ember-bright to-ember/20" />

          {/* Wordmark */}
          <div
            id="brand-wordmark"
            className="font-mono text-[clamp(11px,2.2vw,12px)] tracking-[0.2em] uppercase text-paper-dim mb-6 flex items-center gap-2 flex-wrap"
          >
            <span className="font-semibold text-ember-bright">ABSTREKKT</span>
            <span className="text-paper-faint">·</span>
            <span>KYLE ROSEBROOK</span>
          </div>

          {/* Main Display Name */}
          <h1
            id="page-title"
            className="font-display text-[clamp(2.15rem,6.5vw,3.2rem)] font-bold leading-[1.08] text-paper mb-5 tracking-[-0.015em]"
          >
            Kyle Rosebrook
          </h1>

          {/* Lead Bio Line */}
          <p
            id="page-lead"
            className="font-body text-[clamp(1.1rem,2.8vw,1.24rem)] text-paper-dim leading-[1.65] mb-8"
          >
            Self-taught AI practitioner. I build AI-assisted systems and write about{" "}
            <strong className="text-paper font-semibold">
              what holds under load
            </strong>{" "}
            — the failure modes, the audits, and the discipline that keeps fast tools
            from shipping slow problems.
          </p>

          {/* Featured Works / Playbook Section */}
          <section id="featured-links-section" aria-label="Featured content" className="mb-8">
            <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-paper-faint mb-3">
              Works & Publications
            </div>

            {/* Vibe Coding Playbook Link with in-progress & coming-soon status indicators */}
            <Link
              href="/playbook"
              id="vibe-coding-playbook-link"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-md border border-paper/10 bg-surface-2/60 hover:bg-surface-2 hover:border-ember-bright/50 transition-all duration-200 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg sm:text-[1.18rem] font-semibold text-paper group-hover:text-ember-bright transition-colors">
                    Vibe Coding Playbook
                  </span>
                  <span className="text-paper-dim group-hover:translate-x-1 transition-transform text-sm">
                    →
                  </span>
                </div>
                <span className="font-body text-sm sm:text-base text-paper-dim mt-0.5">
                  AppSec-first AI development
                </span>
              </div>

              {/* Status indicator: 'In Progress' badge with subtle pulse, hover reveal */}
              <div
                id="playbook-status-indicator"
                className="self-start sm:self-center shrink-0"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono tracking-wider uppercase border border-ember/30 bg-ember-dim text-ember-bright group-hover:border-ember group-hover:bg-ember/20 transition-all">
                  <span className="w-2 h-2 rounded-full bg-ember-bright animate-pulse" />
                  <span className="group-hover:hidden">In Progress</span>
                  <span className="hidden group-hover:inline">Read Draft · v0.9</span>
                </div>
              </div>
            </Link>
          </section>

          {/* Contact Section */}
          <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="pt-7 border-t border-paper/10 mb-8"
          >
            <div
              id="contact-heading"
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-ember-bright mb-2 font-medium"
            >
              Contact & Engagement
            </div>
            <p className="font-body text-sm sm:text-base text-paper-dim mb-4 leading-relaxed">
              Available for AI pipeline architecture reviews, AppSec audits, and private technical advisory for engineering teams.
            </p>

            {/* Email Contact Card with tap-to-copy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
              <a
                id="primary-email-link"
                href="mailto:KyleRosebrook@gmail.com"
                className="flex-1 flex items-center justify-between px-4 py-3 min-h-[44px] rounded border border-paper/10 bg-surface-2/40 hover:border-ember/40 hover:text-ember-bright text-paper font-mono text-xs sm:text-sm tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <span className="flex items-center gap-2">
                  <span className="text-paper-faint">✉</span>
                  <span>KyleRosebrook@gmail.com</span>
                </span>
                <span className="text-[10px] uppercase text-paper-faint tracking-wider">
                  Open Mail
                </span>
              </a>

              <button
                type="button"
                id="copy-email-button"
                onClick={handleCopyEmail}
                aria-label="Copy email address to clipboard"
                className="px-4 py-3 min-h-[44px] rounded border border-paper/15 bg-surface hover:border-ember text-paper-dim hover:text-paper font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember shrink-0"
              >
                {copiedEmail ? (
                  <>
                    <span className="text-ember-bright font-semibold">✓</span>
                    <span className="text-ember-bright">Copied</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Profile Handles with accessible touch targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                id="social-link-github"
                href="https://github.com/Krosebrook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between sm:justify-center gap-2 px-3 py-2.5 min-h-[44px] rounded border border-paper/10 bg-surface-2/30 hover:border-paper/30 hover:text-white text-paper-dim font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <span className="text-paper-faint">github</span>
                <span className="text-paper font-medium">@Krosebrook</span>
              </a>

              <a
                id="social-link-linkedin"
                href="https://linkedin.com/in/kylerosebrook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between sm:justify-center gap-2 px-3 py-2.5 min-h-[44px] rounded border border-paper/10 bg-surface-2/30 hover:border-paper/30 hover:text-white text-paper-dim font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <span className="text-paper-faint">in</span>
                <span className="text-paper font-medium">kylerosebrook</span>
              </a>

              <Link
                id="social-link-flashfusion"
                href="/flashfusion"
                className="flex items-center justify-between sm:justify-center gap-2 px-3 py-2.5 min-h-[44px] rounded border border-paper/10 bg-surface-2/30 hover:border-paper/30 hover:text-white text-paper-dim font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <span className="text-paper-faint">project</span>
                <span className="text-paper font-medium">flashfusion</span>
              </Link>
            </div>
          </section>

          {/* Email Collection Form */}
          <section
            id="newsletter-section"
            aria-labelledby="newsletter-heading"
            className="pt-7 border-t border-paper/10"
          >
            <div
              id="newsletter-heading"
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-ember-bright mb-1 font-medium"
            >
              Field Dispatches
            </div>
            <p className="font-body text-sm sm:text-base text-paper-dim mb-4 leading-relaxed">
              Updates on AI-assisted systems, security failure modes, and infrastructure that holds under load.
            </p>

            {isSubscribed ? (
              <div
                id="newsletter-success-alert"
                className="p-4 rounded border border-ember/30 bg-ember-dim text-paper flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span className="text-ember-bright font-bold">✓</span>
                  <span>Subscribed as <strong className="text-paper">{displayEmail}</strong>. High signal only.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomSubscribed(false);
                    try {
                      localStorage.removeItem("abstrekkt_dispatch_email");
                    } catch {
                      // Ignore
                    }
                  }}
                  className="font-mono text-[10px] uppercase text-paper-faint hover:text-paper tracking-wider underline min-h-[44px] flex items-center"
                >
                  Change
                </button>
              </div>
            ) : (
              <form
                id="newsletter-form"
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <label htmlFor="newsletter-email-input" className="sr-only">
                  Email address for updates
                </label>
                <input
                  id="newsletter-email-input"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded bg-surface-2 border border-paper/15 text-paper placeholder:text-paper-faint font-mono text-xs sm:text-sm focus:outline-none focus:border-ember-bright focus:ring-1 focus:ring-ember-bright transition-all"
                />
                <button
                  id="newsletter-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2.5 rounded bg-ember hover:bg-ember-bright text-ink font-mono text-xs tracking-wider uppercase font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* Minimal Footer */}
        <footer
          id="page-footer"
          className="mt-8 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-paper-faint tracking-wider"
        >
          <span>Kyle Rosebrook · kyle.abstrekkt.com</span>
          <span>© 2026 Abstrekkt LLC</span>
        </footer>
      </div>
    </main>
  );
}
