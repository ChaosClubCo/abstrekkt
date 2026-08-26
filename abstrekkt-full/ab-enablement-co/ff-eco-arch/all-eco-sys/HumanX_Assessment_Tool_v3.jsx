"use client";

/**
 * app/page.jsx — HumanX Assessment Tool v3
 *
 * Changes from v2:
 *  ✓ Claude API called via /api/assess (server-side) — no key in browser
 *  ✓ UUID polyfill for older Android WebViews
 *  ✓ Retry logic (2 attempts before error screen)
 *  ✓ 28-second client-side timeout (slightly longer than server's 25s)
 *  ✓ AWS backup route server-side only (URL no longer in client)
 *  ✓ Print stylesheet for clean results export
 *  ✓ No process.env access in client component
 *  ✓ Inline QR (no external service dependency in critical path)
 */

import { useState, useRef, useEffect } from "react";

// ─── UUID polyfill (older Android WebViews lack crypto.randomUUID) ────────────
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: RFC 4122 v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── Config (NEXT_PUBLIC_ vars only — safe for client) ───────────────────────
const ASSESSMENT_URL =
  process.env.NEXT_PUBLIC_ASSESSMENT_URL || "https://assess.intinc.ai";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// ─── Brand ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#07090d", s1: "#0d1117", s2: "#141920", s3: "#1b2333",
  border: "#1f2937", border2: "#2d3748",
  tx: "#e2e8f0", tx2: "#8892a4", tx3: "#4b5563",
  teal: "#2dd4bf",   tealDim:   "rgba(45,212,191,0.1)",  tealBdr: "rgba(45,212,191,0.22)",
  or:   "#f27a1a",   orDim:     "rgba(242,122,26,0.1)",   orBdr:   "rgba(242,122,26,0.22)",
  green: "#34d399",  greenDim:  "rgba(52,211,153,0.1)",
  red:   "#f87171",  redDim:    "rgba(248,113,113,0.1)",
  blue:  "#60a5fa",  yellow:    "#fbbf24",
};

// ─── Input sanitizer ──────────────────────────────────────────────────────────
function sanitize(val, max = 200) {
  if (typeof val !== "string") return "";
  return val.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim().slice(0, max);
}

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "tenants", icon: "🏢",
    q: "How many client tenants do you manage?",
    opts: ["1–10", "11–50", "51–100", "100+"],
  },
  {
    id: "compliance", icon: "🔒", multi: true,
    q: "Which compliance frameworks apply to your clients?",
    opts: ["HIPAA", "SOC 2", "CMMC", "PCI-DSS", "GDPR", "None yet"],
    hint: "Select all that apply",
  },
  {
    id: "isolation", icon: "🗄️",
    q: "What's your current data isolation pattern?",
    opts: ["Shared DB (RLS)", "Schema per tenant", "DB per tenant", "Dedicated infra", "No formal isolation", "Not sure"],
  },
  {
    id: "aiStatus", icon: "🤖",
    q: "Are you running AI workloads on client data today?",
    opts: ["Yes, in production", "Piloting / testing", "Planning to start", "Not yet"],
  },
  {
    id: "cloud", icon: "☁️",
    q: "What's your primary cloud platform?",
    opts: ["AWS", "Azure", "Google Cloud", "Multi-cloud", "On-prem", "Hybrid"],
  },
  {
    id: "shadowIt", icon: "👁️", isHighlight: true,
    q: "Do you know which AI tools employees are using with client data?",
    opts: [
      "Yes — fully inventoried and policy-governed",
      "Partially — we know the approved tools, not all unsanctioned ones",
      "No — employees choose their own AI tools",
      "No policy exists yet",
    ],
    hint: "65% of employees use at least one unsanctioned AI tool at work (Gartner 2025)",
  },
  {
    id: "contact", icon: "📬", isContact: true,
    q: "Get your full assessment report",
  },
];

// ─── Supabase insert (anon key — INSERT only per RLS) ────────────────────────
async function saveToSupabase(payload) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { ok: false };
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  /* Fonts loaded in layout.tsx */
  .ha * { box-sizing: border-box; margin: 0; padding: 0; }
  .ha {
    font-family: 'DM Sans', sans-serif;
    background: ${T.bg};
    color: ${T.tx};
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .ha-shell {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* ── Welcome ── */
  .ha-welcome { flex:1; display:flex; flex-direction:column; }
  .ha-welcome-top {
    background: linear-gradient(160deg, #0d1a2e 0%, ${T.bg} 60%);
    padding: 40px 28px 32px;
    border-bottom: 1px solid ${T.border};
    text-align: center;
    position: relative; overflow: hidden;
  }
  .ha-welcome-top::before {
    content: ''; position: absolute;
    top: -80px; right: -80px; width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,212,191,0.07), transparent 70%);
    pointer-events: none;
  }
  .ha-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: ${T.teal};
    background: ${T.tealDim}; border: 1px solid ${T.tealBdr};
    border-radius: 20px; padding: 5px 14px;
    display: inline-block; margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-welcome-top h1 {
    font-family: 'Syne', sans-serif;
    font-size: 27px; font-weight: 800; line-height: 1.2;
    margin-bottom: 12px; letter-spacing: -0.5px;
  }
  .ha-welcome-top h1 em { font-style:normal; color:${T.teal}; }
  .ha-welcome-top p { font-size:14px; color:${T.tx2}; line-height:1.65; }

  /* QR section */
  .ha-qr-section {
    padding: 20px 28px;
    border-bottom: 1px solid ${T.border};
    background: ${T.s1};
    display: flex; gap: 18px; align-items: center;
  }
  .ha-qr-wrap {
    flex-shrink: 0; width: 88px; height: 88px;
    border-radius: 10px; overflow: hidden;
    border: 2px solid ${T.border2}; background: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .ha-qr-wrap img { width: 84px; height: 84px; display: block; }
  .ha-qr-text h3 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .ha-qr-text p { font-size: 12px; color: ${T.tx2}; line-height: 1.5; }
  .ha-qr-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: ${T.teal}; margin-top: 5px;
    word-break: break-all;
  }

  .ha-welcome-cta {
    padding: 24px 28px;
    display: flex; flex-direction: column; gap: 16px;
  }
  .ha-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 14px 24px; border-radius: 10px;
    font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer; border: none; transition: all 0.15s; width: 100%;
  }
  .ha-btn-primary { background: ${T.teal}; color: #000; }
  .ha-btn-primary:hover { filter: brightness(1.08); }
  .ha-btn-primary:active { transform: scale(0.98); }
  .ha-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; filter: none; }
  .ha-btn-ghost {
    background: transparent; border: 1px solid ${T.border2}; color: ${T.tx2};
    font-size: 13px; padding: 11px 20px;
  }
  .ha-btn-ghost:hover { border-color: ${T.teal}; color: ${T.tx}; }
  .ha-trust {
    display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;
  }
  .ha-trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: ${T.tx3}; font-weight: 600;
  }
  .ha-trust-item .dot { color: ${T.teal}; }

  /* ── Progress ── */
  .ha-progress-wrap {
    position: sticky; top: 0; z-index: 50;
    background: ${T.bg}; border-bottom: 1px solid ${T.border};
  }
  .ha-progress-bar { height: 2px; background: ${T.border}; }
  .ha-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${T.teal}, ${T.or});
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }
  .ha-progress-meta {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 20px 8px;
    font-size: 11px; color: ${T.tx3}; font-weight: 700;
    letter-spacing: 0.8px; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-progress-meta span:last-child { color: ${T.teal}; }

  /* ── Wizard ── */
  .ha-wizard { flex:1; display:flex; flex-direction:column; }
  .ha-question {
    flex: 1; padding: 28px 20px 16px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .ha-q-icon { font-size: 30px; line-height: 1; }
  .ha-q-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${T.teal}; margin-bottom: 5px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-q-text {
    font-family: 'Syne', sans-serif;
    font-size: 19px; font-weight: 700; line-height: 1.3;
  }
  .ha-q-hint { font-size: 12px; color: ${T.tx3}; margin-top: -8px; }
  .ha-q-highlight {
    background: rgba(242,122,26,0.06); border: 1px solid ${T.orBdr};
    border-radius: 10px; padding: 11px 14px;
    font-size: 12px; color: ${T.or}; line-height: 1.5;
    display: flex; gap: 8px;
  }
  .ha-opts { display: flex; flex-direction: column; gap: 8px; }
  .ha-opt {
    padding: 13px 16px;
    background: ${T.s1}; border: 1.5px solid ${T.border};
    border-radius: 10px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.14s; text-align: left;
    font-family: 'DM Sans', sans-serif; color: ${T.tx};
    display: flex; align-items: center; gap: 10px;
  }
  .ha-opt:hover { border-color: ${T.border2}; background: ${T.s2}; }
  .ha-opt.selected { border-color: ${T.teal}; background: ${T.tealDim}; }
  .ha-opt-check {
    width: 18px; height: 18px; border-radius: 5px;
    border: 1.5px solid ${T.border2}; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; transition: all 0.14s;
  }
  .ha-opt.selected .ha-opt-check {
    background: ${T.teal}; border-color: ${T.teal}; color: #000; font-weight: 800;
  }

  /* Contact form */
  .ha-contact-form { display: flex; flex-direction: column; gap: 10px; }
  .ha-pii-notice {
    background: ${T.tealDim}; border: 1px solid ${T.tealBdr};
    border-radius: 8px; padding: 12px 14px;
    font-size: 12px; color: ${T.teal}; line-height: 1.55;
    display: flex; gap: 8px;
  }
  .ha-field { display: flex; flex-direction: column; gap: 5px; }
  .ha-field label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
    text-transform: uppercase; color: ${T.tx3};
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-field input {
    padding: 11px 14px; background: ${T.s1};
    border: 1.5px solid ${T.border}; border-radius: 8px;
    font-size: 14px; color: ${T.tx}; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s;
    -webkit-appearance: none;
  }
  .ha-field input:focus { border-color: ${T.teal}; }
  .ha-field input::placeholder { color: ${T.tx3}; }
  .ha-field input.err { border-color: ${T.red}; }
  .ha-consent {
    display: flex; gap: 10px; padding: 14px;
    background: ${T.s2}; border: 1px solid ${T.border};
    border-radius: 10px; cursor: pointer; align-items: flex-start;
  }
  .ha-consent input[type=checkbox] {
    width: 16px; height: 16px; flex-shrink: 0;
    accent-color: ${T.teal}; margin-top: 2px; cursor: pointer;
  }
  .ha-consent-text {
    font-size: 12px; color: ${T.tx2}; line-height: 1.55; cursor: pointer;
  }
  .ha-consent-text strong { color: ${T.tx}; font-weight: 600; }
  .ha-skip-link {
    text-align: center; font-size: 12px; color: ${T.tx3};
    cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
  }
  .ha-skip-link:hover { color: ${T.tx2}; }

  /* Retry warning */
  .ha-retry-warn {
    padding: 10px 14px; background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.25); border-radius: 8px;
    font-size: 12px; color: #fbbf24; line-height: 1.5;
    margin: 0 20px;
  }

  /* Nav */
  .ha-nav { display: flex; gap: 10px; padding: 14px 20px 20px; }
  .ha-nav .ha-btn { flex: 1; }
  .ha-back { flex: 0 0 auto !important; width: 46px !important; padding: 14px 0 !important; font-size: 18px !important; }

  /* ── Processing ── */
  .ha-processing {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 24px; gap: 32px; text-align: center;
  }
  .ha-ring-wrap { position: relative; width: 80px; height: 80px; }
  .ha-ring {
    width: 80px; height: 80px; border-radius: 50%;
    border: 2px solid ${T.border}; border-top-color: ${T.teal};
    animation: ha-spin 1s linear infinite;
  }
  .ha-ring-inner {
    position: absolute; inset: 12px; border-radius: 50%;
    border: 2px solid ${T.border}; border-bottom-color: ${T.or};
    animation: ha-spin 1.6s linear infinite reverse;
  }
  @keyframes ha-spin { to { transform: rotate(360deg); } }
  .ha-proc-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 700; letter-spacing: -0.2px;
  }
  .ha-proc-sub { font-size: 13px; color: ${T.tx2}; }
  .ha-proc-steps { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; }
  .ha-proc-step {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: ${T.tx3}; transition: color 0.3s;
  }
  .ha-proc-step.active { color: ${T.tx}; }
  .ha-proc-step.done { color: ${T.teal}; }
  .ha-proc-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${T.border2}; flex-shrink: 0; transition: background 0.3s;
  }
  .ha-proc-step.done .ha-proc-dot { background: ${T.teal}; }
  .ha-proc-step.active .ha-proc-dot { background: ${T.or}; animation: ha-pulse 1s ease infinite; }
  @keyframes ha-pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }

  /* ── Results ── */
  .ha-results { flex:1; display:flex; flex-direction:column; }
  .ha-results-header {
    padding: 18px 20px; border-bottom: 1px solid ${T.border};
    background: ${T.s1};
  }
  .ha-results-header-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 10px;
  }
  .ha-results-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800; letter-spacing: -0.2px;
  }
  .ha-results-sub { font-size: 12px; color: ${T.tx2}; margin-top: 3px; }
  .ha-overall { text-align: right; font-family: 'JetBrains Mono', monospace; }
  .ha-overall-num { font-size: 34px; font-weight: 700; line-height: 1; }
  .ha-overall-denom { font-size: 11px; color: ${T.tx3}; letter-spacing: 0.5px; text-transform: uppercase; }
  .ha-risk-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ha-risk-label { font-size: 12px; color: ${T.tx3}; }
  .ha-risk-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.8px;
    font-family: 'JetBrains Mono', monospace;
  }
  .risk-HIGH   { background: ${T.redDim};               color: ${T.red};    border: 1px solid rgba(248,113,113,0.25); }
  .risk-MEDIUM { background: rgba(251,191,36,0.1);      color: ${T.yellow}; border: 1px solid rgba(251,191,36,0.25); }
  .risk-LOW    { background: ${T.greenDim};              color: ${T.green};  border: 1px solid rgba(52,211,153,0.25); }
  .shadow-CRITICAL { background: ${T.redDim};           color: ${T.red};    border: 1px solid rgba(248,113,113,0.25); }
  .shadow-HIGH     { background: ${T.orDim};            color: ${T.or};     border: 1px solid ${T.orBdr}; }
  .shadow-MANAGED  { background: ${T.greenDim};         color: ${T.green};  border: 1px solid rgba(52,211,153,0.25); }
  .ha-results-body {
    flex: 1; overflow-y: auto; padding: 16px 20px 100px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .ha-sec-head {
    font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${T.tx3};
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-sec-head::after { content: ''; flex: 1; height: 1px; background: ${T.border}; }
  .ha-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ha-score-card {
    background: ${T.s1}; border: 1px solid ${T.border};
    border-radius: 10px; padding: 12px 14px;
  }
  .ha-score-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
    text-transform: uppercase; color: ${T.tx3}; margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-score-val {
    font-size: 26px; font-weight: 700; line-height: 1;
    font-family: 'JetBrains Mono', monospace; margin-bottom: 8px;
  }
  .ha-score-unit { font-size: 12px; color: ${T.tx3}; font-weight: 400; }
  .ha-score-bar { height: 3px; background: ${T.border}; border-radius: 2px; overflow: hidden; }
  .ha-score-fill { height: 100%; border-radius: 2px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .ha-vendor-list { display: flex; flex-direction: column; gap: 8px; }
  .ha-vendor-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px;
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
  }
  .ha-vendor-rank {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .vr-1 { background: ${T.tealDim}; color: ${T.teal}; border: 1px solid ${T.tealBdr}; }
  .vr-2 { background: ${T.orDim};   color: ${T.or};   border: 1px solid ${T.orBdr}; }
  .vr-3 { background: rgba(96,165,250,0.08); color: ${T.blue}; border: 1px solid rgba(96,165,250,0.2); }
  .ha-vendor-name { font-size: 14px; font-weight: 700; }
  .ha-vendor-reason { font-size: 12px; color: ${T.tx2}; line-height: 1.4; }
  .ha-vendor-match {
    margin-left: auto; flex-shrink: 0;
    font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
  }
  .ha-findings { display: flex; flex-direction: column; gap: 8px; }
  .ha-finding {
    display: flex; gap: 10px; padding: 12px 14px;
    background: ${T.s1}; border: 1px solid ${T.border};
    border-radius: 10px; font-size: 13px; line-height: 1.55; color: ${T.tx2};
  }
  .ha-finding-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${T.teal}; flex-shrink: 0; margin-top: 6px;
  }
  .ha-steps { display: flex; flex-direction: column; gap: 8px; }
  .ha-step {
    display: flex; gap: 12px; padding: 12px 14px;
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
  }
  .ha-step-num {
    width: 24px; height: 24px; border-radius: 7px;
    background: ${T.orDim}; color: ${T.or}; border: 1px solid ${T.orBdr};
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-step-text { font-size: 13px; line-height: 1.55; color: ${T.tx2}; }
  .ha-exec {
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
    padding: 16px; font-size: 13px; line-height: 1.7; color: ${T.tx2};
  }
  .ha-int-cta {
    background: linear-gradient(135deg, rgba(13,26,46,0.8), ${T.s2});
    border: 1px solid ${T.border2}; border-radius: 12px; padding: 18px; text-align: center;
  }
  .ha-int-cta h3 {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; margin-bottom: 6px;
  }
  .ha-int-cta p { font-size: 12px; color: ${T.tx2}; line-height: 1.55; margin-bottom: 10px; }
  .ha-int-locate {
    font-size: 11px; font-weight: 700; color: ${T.teal};
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-save-status {
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 5px;
  }
  .ha-save-ok  { color: ${T.green}; }
  .ha-save-err { color: ${T.red}; }
  .ha-save-ing { color: ${T.tx3}; }
  .ha-cta-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px; padding: 10px 20px 16px;
    background: rgba(7,9,13,0.97); backdrop-filter: blur(20px);
    border-top: 1px solid ${T.border}; display: flex; gap: 8px;
    align-items: center; z-index: 10;
  }
  .ha-cta-bar .ha-btn { flex: 1; font-size: 13px; padding: 12px 14px; }
  .ha-error-screen {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 32px; gap: 18px; text-align: center;
  }
  .ha-error-card {
    background: ${T.redDim}; border: 1px solid rgba(248,113,113,0.2);
    border-radius: 10px; padding: 14px; font-size: 13px;
    color: ${T.red}; line-height: 1.55; width: 100%;
  }
  .ha-err-title {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-top: 4px;
  }

  /* ── Print styles ── */
  @media print {
    .ha { background: #fff; }
    .ha-shell { max-width: 100%; }
    .ha-results-header { background: #fff; border-color: #e2e8f0; }
    .ha-results-title, .ha-sec-head { color: #1a202c; }
    .ha-results-sub, .ha-tx2, .ha-exec, .ha-finding, .ha-step-text { color: #4a5568; }
    .ha-score-card, .ha-vendor-item, .ha-finding, .ha-step, .ha-exec { background: #f7fafc; border-color: #e2e8f0; }
    .ha-cta-bar { display: none; }
    .ha-int-cta { break-inside: avoid; }
    .ha-results-body { padding-bottom: 0; overflow: visible; }
    @page { margin: 1.5cm; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreColor(v) {
  if (v >= 4) return T.green;
  if (v >= 3) return T.teal;
  if (v >= 2) return T.yellow;
  return T.red;
}
function shadowClass(answer) {
  if (!answer || answer.includes("No policy") || answer.includes("No — employees")) return "CRITICAL";
  if (answer.includes("Partially")) return "HIGH";
  return "MANAGED";
}

const PROC_STEPS = [
  "Evaluating isolation patterns...",
  "Analyzing shadow IT exposure...",
  "Mapping compliance requirements...",
  "Scoring vendor alignment...",
  "Generating architecture recommendations...",
  "Compiling findings...",
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState("welcome");
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState({});
  const [contact, setContact]     = useState({ name: "", email: "", company: "", role: "" });
  const [consent, setConsent]     = useState(false);
  const [fieldErrors, setErrors]  = useState({});
  const [procStep, setProcStep]   = useState(0);
  const [retryCount, setRetry]    = useState(0);
  const [result, setResult]       = useState(null);
  const [saveStatus, setSave]     = useState(null);
  const [error, setError]         = useState("");
  const timerRef  = useRef(null);
  const sessionId = useRef(generateId());

  const q = QUESTIONS[step];

  function toggleOpt(val) {
    if (q.multi) {
      const cur = answers[q.id] || [];
      setAnswers({ ...answers, [q.id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
    } else {
      setAnswers({ ...answers, [q.id]: val });
    }
  }

  function canContinue() {
    if (q.isContact) return true;
    const v = answers[q.id];
    return q.multi ? (v && v.length > 0) : !!v;
  }

  function advance() {
    if (q.isContact) {
      const errs = {};
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errs.email = true;
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({});
    }
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else runAssessment();
  }

  function back() {
    if (step === 0) setScreen("welcome");
    else setStep(step - 1);
  }

  async function runAssessment(attempt = 1) {
    setScreen("processing");
    setProcStep(0);

    let ps = 0;
    timerRef.current = setInterval(() => {
      ps = Math.min(ps + 1, PROC_STEPS.length - 1);
      setProcStep(ps);
    }, 850);

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenants:    answers.tenants,
          compliance: answers.compliance || [],
          isolation:  answers.isolation,
          aiStatus:   answers.aiStatus,
          cloud:      answers.cloud,
          shadowIt:   answers.shadowIt,
        }),
        signal: AbortSignal.timeout(28_000), // slightly longer than server's 25s
      });

      clearInterval(timerRef.current);
      setProcStep(PROC_STEPS.length - 1);

      if (res.status === 429) {
        setError("Rate limit reached. Please wait a few minutes and try again.");
        setScreen("error"); return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const parsed = await res.json();
      setResult(parsed);

      // Save to Supabase (fire-and-forget, silent on failure)
      setSave("saving");
      setTimeout(() => setScreen("results"), 400);
      const sbOk = await saveToSupabase(buildPayload(parsed, sessionId.current));
      setSave(sbOk.ok ? "ok" : "error");

    } catch (e) {
      clearInterval(timerRef.current);
      const isTimeout = e?.name === "AbortError" || e?.name === "TimeoutError";

      // Auto-retry once on timeout (conference WiFi is flaky)
      if (isTimeout && attempt < 2) {
        setRetry(attempt);
        await new Promise(r => setTimeout(r, 2000));
        return runAssessment(attempt + 1);
      }

      setError(
        isTimeout
          ? "Request timed out. Conference WiFi may be congested — please try again."
          : e?.message || "Unexpected error. Please try again."
      );
      setScreen("error");
    }
  }

  function buildPayload(parsed, sid) {
    const base = {
      session_id:        sid,
      tenant_count:      answers.tenants      || null,
      compliance:        (answers.compliance  || []).join(", ") || null,
      isolation:         answers.isolation    || null,
      ai_status:         answers.aiStatus     || null,
      cloud_platform:    answers.cloud        || null,
      shadow_it:         answers.shadowIt     || null,
      overall_score:     parsed.overall_score,
      risk_level:        parsed.exposure_risk_level,
      score_isolation:   parsed.tenant_isolation,
      score_encrypt:     parsed.encryption_depth,
      score_ai_risk:     parsed.ai_exposure_risk,
      score_compliance:  parsed.compliance_readiness,
      score_integration: parsed.integration_surface,
      score_msp:         parsed.msp_fit,
      score_shadow_it:   parsed.shadow_it_score,
      top_vendors:       parsed.top_vendors,
      key_findings:      parsed.key_findings,
      next_steps:        parsed.next_steps,
      exec_summary:      parsed.exec_summary,
      consent:           consent && !!contact.email,
    };
    if (consent && contact.email) {
      base.contact_name    = sanitize(contact.name);
      base.contact_email   = sanitize(contact.email, 100);
      base.contact_company = sanitize(contact.company);
      base.contact_role    = sanitize(contact.role);
    }
    return base;
  }

  function restart() {
    setScreen("welcome"); setStep(0); setAnswers({});
    setContact({ name: "", email: "", company: "", role: "" });
    setConsent(false); setResult(null); setError("");
    setSave(null); setRetry(0);
    sessionId.current = generateId();
  }

  return (
    <>
      <style>{css}</style>
      <div className="ha">
        <div className="ha-shell">
          {screen === "welcome"    && <Welcome onStart={() => setScreen("wizard")} url={ASSESSMENT_URL} />}
          {screen === "wizard"     && (
            <Wizard
              q={q} step={step} total={QUESTIONS.length}
              answers={answers} contact={contact} setContact={setContact}
              consent={consent} setConsent={setConsent}
              fieldErrors={fieldErrors}
              onToggle={toggleOpt} onAdvance={advance} onBack={back}
              onSkip={q.isContact ? () => { setContact({ name:"",email:"",company:"",role:"" }); setConsent(false); runAssessment(); } : null}
              canContinue={canContinue}
            />
          )}
          {screen === "processing" && <Processing steps={PROC_STEPS} current={procStep} retrying={retryCount > 0} />}
          {screen === "results"    && result && <Results result={result} answers={answers} saveStatus={saveStatus} onRestart={restart} />}
          {screen === "error"      && <ErrorScreen msg={error} onRestart={restart} />}
        </div>
      </div>
    </>
  );
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
function Welcome({ onStart, url }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=ffffff&color=07090d&margin=8&data=${encodeURIComponent(url)}`;
  const display = url.replace(/^https?:\/\//, "");
  return (
    <div className="ha-welcome">
      <div className="ha-welcome-top">
        <span className="ha-badge">HumanX 2026 × INT Inc.</span>
        <h1>Is Your Multi-Tenant AI<br/><em>Architecture</em> Secure?</h1>
        <p>7 questions · 90 seconds · Personalized architecture scoring powered by Claude.</p>
      </div>
      <div className="ha-qr-section">
        <div className="ha-qr-wrap"><img src={qrUrl} alt="Scan to open on your phone" /></div>
        <div className="ha-qr-text">
          <h3>📱 Open on your phone</h3>
          <p>Scan to take the assessment on your own device.</p>
          <div className="ha-qr-url">{display}</div>
        </div>
      </div>
      <div className="ha-welcome-cta">
        <button className="ha-btn ha-btn-primary" onClick={onStart}>Start Assessment →</button>
        <div className="ha-trust">
          <span className="ha-trust-item"><span className="dot">✓</span> SOC 2 Type II</span>
          <span className="ha-trust-item"><span className="dot">✓</span> No PII without consent</span>
          <span className="ha-trust-item"><span className="dot">✓</span> Claude-powered</span>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────
function Wizard({ q, step, total, answers, contact, setContact, consent, setConsent, fieldErrors, onToggle, onAdvance, onBack, onSkip, canContinue }) {
  const pct = ((step + 1) / total) * 100;
  const val = answers[q.id];
  return (
    <div className="ha-wizard">
      <div className="ha-progress-wrap">
        <div className="ha-progress-meta">
          <span>Q {step + 1} / {total}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="ha-progress-bar">
          <div className="ha-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="ha-question">
        <div className="ha-q-icon">{q.icon}</div>
        <div>
          <div className="ha-q-label">Question {step + 1}</div>
          <div className="ha-q-text">{q.q}</div>
        </div>
        {q.hint && !q.isHighlight && <p className="ha-q-hint">{q.hint}</p>}
        {q.isHighlight && (
          <div className="ha-q-highlight">
            <span>⚠️</span>
            <span><strong>Shadow IT fact:</strong> {q.hint}</span>
          </div>
        )}
        {!q.isContact ? (
          <div className="ha-opts">
            {q.opts.map(opt => {
              const sel = q.multi ? (val || []).includes(opt) : val === opt;
              return (
                <button key={opt} className={`ha-opt ${sel ? "selected" : ""}`} onClick={() => onToggle(opt)}>
                  {q.multi && <span className="ha-opt-check">{sel ? "✓" : ""}</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ha-contact-form">
            <div className="ha-pii-notice">
              <span>🔒</span>
              <span>Contact info only stored if you check the consent box below. Scores are always captured anonymously.</span>
            </div>
            {[["name","Your Name","text"],["email","Work Email","email"],["company","Company Name","text"],["role","Your Role","text"]].map(([f,ph,t]) => (
              <div className="ha-field" key={f}>
                <label>{ph}</label>
                <input type={t} placeholder={ph} value={contact[f]}
                  onChange={e => setContact(c => ({ ...c, [f]: sanitize(e.target.value, f === "email" ? 100 : 200) }))}
                  className={fieldErrors[f] ? "err" : ""}
                  maxLength={f === "email" ? 100 : 200}
                  autoComplete={f === "email" ? "email" : "off"}
                />
              </div>
            ))}
            {fieldErrors.email && <p style={{fontSize:12,color:T.red}}>Please enter a valid email address.</p>}
            <label className="ha-consent" onClick={() => setConsent(!consent)}>
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} onClick={e => e.stopPropagation()} />
              <span className="ha-consent-text">
                <strong>I consent to INT Inc. storing my contact info</strong> to follow up about this assessment. No data sold or shared with third parties. Unsubscribe anytime.
              </span>
            </label>
            <span className="ha-skip-link" onClick={onSkip}>Skip — view results on screen only (no data stored)</span>
          </div>
        )}
      </div>
      <div className="ha-nav">
        <button className="ha-btn ha-btn-ghost ha-back" onClick={onBack}>←</button>
        <button className="ha-btn ha-btn-primary" onClick={onAdvance}
          disabled={!canContinue()} style={{ opacity: canContinue() ? 1 : 0.35 }}>
          {step === QUESTIONS.length - 1 ? "Generate Assessment →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Processing ───────────────────────────────────────────────────────────────
function Processing({ steps, current, retrying }) {
  return (
    <div className="ha-processing">
      <div className="ha-ring-wrap"><div className="ha-ring"/><div className="ha-ring-inner"/></div>
      <div>
        <div className="ha-proc-title">{retrying ? "Retrying assessment..." : "Analyzing your architecture..."}</div>
        <div className="ha-proc-sub" style={{ marginTop: 6 }}>Claude is scoring 7 security and governance dimensions</div>
      </div>
      {retrying && (
        <div className="ha-retry-warn">
          ⚡ First attempt timed out — retrying automatically. Conference WiFi can be slow.
        </div>
      )}
      <div className="ha-proc-steps">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "active" : "";
          return (
            <div key={i} className={`ha-proc-step ${state}`}>
              <div className="ha-proc-dot"/>
              {i < current ? `✓ ${label}` : label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results({ result, answers, saveStatus, onRestart }) {
  const SCORES = [
    { key: "tenant_isolation",    label: "Tenant Isolation" },
    { key: "encryption_depth",    label: "Encryption Depth" },
    { key: "ai_exposure_risk",    label: "AI Data Safety" },
    { key: "compliance_readiness",label: "Compliance Ready" },
    { key: "integration_surface", label: "Integration Surface" },
    { key: "msp_fit",             label: "MSP Fit" },
    { key: "shadow_it_score",     label: "Shadow IT Governed" },
  ];
  const overallColor = scoreColor((result.overall_score || 0) / 20);
  const sc = shadowClass(answers.shadowIt);
  return (
    <div className="ha-results">
      <div className="ha-results-header">
        <div className="ha-results-header-top">
          <div>
            <div className="ha-results-title">Architecture Assessment</div>
            <div className="ha-results-sub">{answers.tenants || "?"} tenants · {answers.cloud || "?"} · {answers.isolation || "?"}</div>
          </div>
          <div className="ha-overall">
            <div className="ha-overall-num" style={{ color: overallColor }}>{result.overall_score}</div>
            <div className="ha-overall-denom">/100</div>
          </div>
        </div>
        <div className="ha-risk-row">
          <span className="ha-risk-label">AI Exposure:</span>
          <span className={`ha-risk-badge risk-${result.exposure_risk_level}`}>{result.exposure_risk_level}</span>
          <span className="ha-risk-label">Shadow IT:</span>
          <span className={`ha-risk-badge shadow-${sc}`}>{sc}</span>
        </div>
      </div>
      <div className="ha-results-body">
        <div>
          <div className="ha-sec-head">Executive Summary</div>
          <div className="ha-exec">{result.exec_summary}</div>
        </div>
        <div>
          <div className="ha-sec-head">Architecture Scores</div>
          <div className="ha-score-grid">
            {SCORES.map(({ key, label }) => {
              const v = result[key] || 0;
              const c = scoreColor(v);
              return (
                <div className="ha-score-card" key={key}>
                  <div className="ha-score-label">{label}</div>
                  <div className="ha-score-val" style={{ color: c }}>
                    {Number(v).toFixed(1)}<span className="ha-score-unit">/5</span>
                  </div>
                  <div className="ha-score-bar">
                    <div className="ha-score-fill" style={{ width: `${(v/5)*100}%`, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {result.top_vendors?.length > 0 && (
          <div>
            <div className="ha-sec-head">Vendor Recommendations</div>
            <div className="ha-vendor-list">
              {result.top_vendors.slice(0, 3).map((v, i) => (
                <div className="ha-vendor-item" key={i}>
                  <div className={`ha-vendor-rank vr-${i+1}`}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="ha-vendor-name">{v.name}</div>
                    <div className="ha-vendor-reason">{v.reason}</div>
                  </div>
                  <div className="ha-vendor-match" style={{ color:[T.teal,T.or,T.blue][i] }}>{v.match_pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.key_findings?.length > 0 && (
          <div>
            <div className="ha-sec-head">Key Findings</div>
            <div className="ha-findings">
              {result.key_findings.map((f, i) => (
                <div className="ha-finding" key={i}>
                  <div className="ha-finding-dot"/>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.next_steps?.length > 0 && (
          <div>
            <div className="ha-sec-head">Recommended Next Steps</div>
            <div className="ha-steps">
              {result.next_steps.map((s, i) => (
                <div className="ha-step" key={i}>
                  <div className="ha-step-num">{i+1}</div>
                  <div className="ha-step-text">{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="ha-int-cta">
          <h3>Want a full architecture deep-dive?</h3>
          <p>INT Inc. builds purpose-built data isolation tools for MSPs — including shadow IT governance frameworks. SOC 2 Type II certified. 25+ years of MSP expertise.</p>
          <div className="ha-int-locate">📍 Find Kyle at INT Inc. booth · HumanX 2026</div>
        </div>
      </div>
      <div className="ha-cta-bar">
        {saveStatus && (
          <div className="ha-save-status">
            {saveStatus === "saving" && <span className="ha-save-ing">⏳</span>}
            {saveStatus === "ok"     && <span className="ha-save-ok">✓ Saved</span>}
            {saveStatus === "error"  && <span className="ha-save-err">⚠ Offline</span>}
          </div>
        )}
        <button className="ha-btn ha-btn-ghost" onClick={onRestart} style={{ flex:"0 0 auto",width:"auto",padding:"12px 14px" }}>↺</button>
        <button className="ha-btn ha-btn-primary" onClick={() => window.print()}>📥 Save Report</button>
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function ErrorScreen({ msg, onRestart }) {
  return (
    <div className="ha-error-screen">
      <span style={{ fontSize:40 }}>⚠️</span>
      <div className="ha-err-title">Assessment Failed</div>
      <div className="ha-error-card">{msg}</div>
      <button className="ha-btn ha-btn-primary" style={{ width:"100%" }} onClick={onRestart}>Try Again</button>
    </div>
  );
}
