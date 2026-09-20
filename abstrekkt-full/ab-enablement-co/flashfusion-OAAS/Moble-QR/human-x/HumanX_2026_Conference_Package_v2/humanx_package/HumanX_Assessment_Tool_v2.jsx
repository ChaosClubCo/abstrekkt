/**
 * HumanX 2026 — Multi-Tenant Architecture Assessment Tool v2.0
 * INT Inc. | Kyle Rosebrook
 *
 * NEW in v2:
 *  • Shadow IT / employee misuse question (#6)
 *  • Supabase lead capture (RLS-protected, consent-gated)
 *  • AWS S3 backup sink (see SETUP NOTES)
 *  • QR code on welcome screen (mobile-first entry point)
 *  • Input sanitization on all fields
 *  • Explicit PII consent before any storage
 *
 * ─── SETUP NOTES ────────────────────────────────────────────────────────────
 *
 * 1. SUPABASE — run this SQL in your project's SQL editor:
 *
 *   CREATE TABLE public.assessments (
 *     id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *     session_id      UUID NOT NULL DEFAULT gen_random_uuid(),
 *     -- Profile (non-PII, always stored)
 *     tenant_count    TEXT,
 *     compliance      TEXT,
 *     isolation       TEXT,
 *     ai_status       TEXT,
 *     cloud_platform  TEXT,
 *     shadow_it       TEXT,
 *     -- Scores (Claude output, always stored)
 *     overall_score   INT,
 *     risk_level      TEXT,
 *     score_isolation NUMERIC(3,1),
 *     score_encrypt   NUMERIC(3,1),
 *     score_ai_risk   NUMERIC(3,1),
 *     score_compliance NUMERIC(3,1),
 *     score_integration NUMERIC(3,1),
 *     score_msp       NUMERIC(3,1),
 *     score_shadow_it NUMERIC(3,1),
 *     top_vendors     JSONB,
 *     key_findings    TEXT[],
 *     next_steps      TEXT[],
 *     exec_summary    TEXT,
 *     -- Contact (PII — only stored when consent = TRUE)
 *     consent         BOOLEAN NOT NULL DEFAULT FALSE,
 *     contact_name    TEXT,
 *     contact_email   TEXT,
 *     contact_company TEXT,
 *     contact_role    TEXT
 *   );
 *
 *   ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
 *
 *   -- Anon users can INSERT only (no SELECT, no UPDATE, no DELETE)
 *   CREATE POLICY "anon_insert_only"
 *     ON public.assessments FOR INSERT TO anon
 *     WITH CHECK (true);
 *
 *   -- Authenticated users (Kyle's dashboard) can SELECT all
 *   CREATE POLICY "auth_select_all"
 *     ON public.assessments FOR SELECT TO authenticated
 *     USING (true);
 *
 * 2. ENV VARS — add to .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *   NEXT_PUBLIC_ASSESSMENT_URL=https://assess.intinc.ai  ← your deploy URL
 *
 * 3. AWS S3 BACKUP (optional) — create an API Gateway → Lambda → S3 endpoint.
 *   The function already calls it if NEXT_PUBLIC_AWS_BACKUP_URL is set.
 *   Lambda pattern:
 *     exports.handler = async (event) => {
 *       const s3 = new AWS.S3();
 *       const body = JSON.parse(event.body);
 *       await s3.putObject({
 *         Bucket: 'int-humanx-assessments',
 *         Key: `assessments/${body.session_id}.json`,
 *         Body: JSON.stringify(body),
 *         ContentType: 'application/json',
 *         ServerSideEncryption: 'aws:kms',  // CMK encryption
 *       }).promise();
 *       return { statusCode: 200 };
 *     };
 *
 * 4. QR CODE — update ASSESSMENT_URL below after deploying to Vercel.
 *    Print or display QR for attendees to scan at the booth.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";

// ─── Config (replace after deploy) ───────────────────────────────────────────
const CONFIG = {
  ASSESSMENT_URL:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ASSESSMENT_URL || "https://assess.intinc.ai"
      : "https://assess.intinc.ai",
  SUPABASE_URL:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      : "",
  SUPABASE_ANON_KEY:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      : "",
  AWS_BACKUP_URL:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_AWS_BACKUP_URL || ""
      : "",
};

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#07090d",
  s1: "#0d1117",
  s2: "#141a23",
  s3: "#1b2333",
  border: "#1f2937",
  border2: "#2d3748",
  tx: "#e2e8f0",
  tx2: "#8892a4",
  tx3: "#4b5563",
  teal: "#2dd4bf",
  tealDim: "rgba(45,212,191,0.1)",
  tealBorder: "rgba(45,212,191,0.22)",
  tealGlow: "rgba(45,212,191,0.05)",
  or: "#f27a1a",
  orDim: "rgba(242,122,26,0.1)",
  orBorder: "rgba(242,122,26,0.22)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.1)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.1)",
  blue: "#60a5fa",
  yellow: "#fbbf24",
};

// ─── Input sanitizer (no DOMPurify needed — strip tags, trim, max length) ────
function sanitize(val, maxLen = 200) {
  if (typeof val !== "string") return "";
  return val
    .replace(/<[^>]*>/g, "")       // strip HTML tags
    .replace(/[<>"'`]/g, "")        // strip dangerous chars
    .trim()
    .slice(0, maxLen);
}

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "tenants",
    q: "How many client tenants do you manage?",
    opts: ["1–10", "11–50", "51–100", "100+"],
    icon: "🏢",
    hint: null,
  },
  {
    id: "compliance",
    q: "Which compliance frameworks apply to your clients?",
    opts: ["HIPAA", "SOC 2", "CMMC", "PCI-DSS", "GDPR", "None yet"],
    multi: true,
    icon: "🔒",
    hint: "Select all that apply",
  },
  {
    id: "isolation",
    q: "What's your current data isolation pattern?",
    opts: [
      "Shared DB (RLS)",
      "Schema per tenant",
      "DB per tenant",
      "Dedicated infra",
      "No formal isolation",
      "Not sure",
    ],
    icon: "🗄️",
    hint: null,
  },
  {
    id: "aiStatus",
    q: "Are you running AI workloads on client data today?",
    opts: ["Yes, in production", "Piloting / testing", "Planning to start", "Not yet"],
    icon: "🤖",
    hint: null,
  },
  {
    id: "cloud",
    q: "What's your primary cloud platform?",
    opts: ["AWS", "Azure", "Google Cloud", "Multi-cloud", "On-prem", "Hybrid"],
    icon: "☁️",
    hint: null,
  },
  {
    id: "shadowIt",
    q: "Do you know which AI tools employees are using with client data?",
    opts: [
      "Yes — fully inventoried and policy-governed",
      "Partially — we know the approved tools, not all unsanctioned ones",
      "No — employees choose their own AI tools",
      "No policy exists yet",
    ],
    icon: "👁️",
    hint: "Shadow IT is the #1 untracked data exposure vector in MSP environments",
    isHighlight: true,
  },
  {
    id: "contact",
    q: "Get your full assessment report",
    icon: "📬",
    isContact: true,
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;600&display=swap');

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
  .ha-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  .ha-welcome-top {
    background: linear-gradient(160deg, #0d1a2e 0%, ${T.bg} 60%);
    padding: 40px 28px 32px;
    border-bottom: 1px solid ${T.border};
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ha-welcome-top::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,212,191,0.08), transparent 70%);
    pointer-events: none;
  }
  .ha-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: ${T.teal};
    background: ${T.tealDim};
    border: 1px solid ${T.tealBorder};
    border-radius: 20px;
    padding: 5px 14px;
    display: inline-block;
    margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-welcome-top h1 {
    font-family: 'Syne', sans-serif;
    font-size: 27px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }
  .ha-welcome-top h1 em {
    font-style: normal;
    color: ${T.teal};
  }
  .ha-welcome-top p {
    font-size: 14px;
    color: ${T.tx2};
    line-height: 1.65;
    max-width: 340px;
    margin: 0 auto;
  }

  /* QR section */
  .ha-qr-section {
    padding: 24px 28px;
    border-bottom: 1px solid ${T.border};
    display: flex;
    gap: 18px;
    align-items: center;
    background: ${T.s1};
  }
  .ha-qr-wrap {
    flex-shrink: 0;
    width: 90px;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid ${T.border2};
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ha-qr-wrap img { width: 86px; height: 86px; }
  .ha-qr-text h3 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .ha-qr-text p {
    font-size: 12px;
    color: ${T.tx2};
    line-height: 1.5;
  }
  .ha-qr-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: ${T.teal};
    margin-top: 6px;
    word-break: break-all;
  }

  /* Trust + CTA */
  .ha-welcome-cta {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .ha-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    width: 100%;
    letter-spacing: 0.2px;
  }
  .ha-btn-primary {
    background: ${T.teal};
    color: #000;
  }
  .ha-btn-primary:hover { filter: brightness(1.08); }
  .ha-btn-primary:active { transform: scale(0.98); }
  .ha-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; filter: none; }
  .ha-btn-ghost {
    background: transparent;
    border: 1px solid ${T.border2};
    color: ${T.tx2};
    font-size: 13px;
    padding: 11px 20px;
  }
  .ha-btn-ghost:hover { border-color: ${T.teal}; color: ${T.tx}; }

  .ha-trust {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .ha-trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: ${T.tx3};
    font-weight: 600;
  }
  .ha-trust-item .dot { color: ${T.teal}; }

  /* ── Progress ── */
  .ha-progress-wrap {
    position: sticky;
    top: 0;
    z-index: 50;
    background: ${T.bg};
    border-bottom: 1px solid ${T.border};
  }
  .ha-progress-bar { height: 2px; background: ${T.border}; }
  .ha-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${T.teal}, ${T.or});
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ha-progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 8px;
    font-size: 11px;
    color: ${T.tx3};
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-progress-meta span:last-child { color: ${T.teal}; }

  /* ── Wizard ── */
  .ha-wizard { flex: 1; display: flex; flex-direction: column; }
  .ha-question {
    flex: 1;
    padding: 28px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .ha-q-icon { font-size: 30px; line-height: 1; }
  .ha-q-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: ${T.teal};
    margin-bottom: 5px;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-q-text {
    font-family: 'Syne', sans-serif;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }
  .ha-q-hint {
    font-size: 12px;
    color: ${T.tx3};
    margin-top: -8px;
  }

  /* Shadow IT highlight */
  .ha-q-highlight {
    background: rgba(242,122,26,0.06);
    border: 1px solid ${T.orBorder};
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 12px;
    color: ${T.or};
    line-height: 1.5;
    display: flex;
    gap: 8px;
  }
  .ha-q-highlight strong { font-weight: 700; }

  .ha-opts { display: flex; flex-direction: column; gap: 8px; }
  .ha-opt {
    padding: 13px 16px;
    background: ${T.s1};
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.14s;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    color: ${T.tx};
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ha-opt:hover { border-color: ${T.border2}; background: ${T.s2}; }
  .ha-opt.selected {
    border-color: ${T.teal};
    background: ${T.tealDim};
  }
  .ha-opt-check {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid ${T.border2};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    transition: all 0.14s;
  }
  .ha-opt.selected .ha-opt-check {
    background: ${T.teal};
    border-color: ${T.teal};
    color: #000;
    font-weight: 800;
  }

  /* Contact form */
  .ha-contact-form { display: flex; flex-direction: column; gap: 10px; }
  .ha-field { display: flex; flex-direction: column; gap: 5px; }
  .ha-field label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: ${T.tx3};
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-field input {
    padding: 11px 14px;
    background: ${T.s1};
    border: 1.5px solid ${T.border};
    border-radius: 8px;
    font-size: 14px;
    color: ${T.tx};
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .ha-field input:focus { border-color: ${T.teal}; }
  .ha-field input::placeholder { color: ${T.tx3}; }
  .ha-field input.err { border-color: ${T.red}; }

  /* Consent */
  .ha-consent {
    display: flex;
    gap: 10px;
    padding: 14px;
    background: ${T.s2};
    border: 1px solid ${T.border};
    border-radius: 10px;
    cursor: pointer;
    align-items: flex-start;
  }
  .ha-consent input[type=checkbox] {
    width: 16px; height: 16px;
    flex-shrink: 0;
    accent-color: ${T.teal};
    margin-top: 2px;
    cursor: pointer;
  }
  .ha-consent-text {
    font-size: 12px;
    color: ${T.tx2};
    line-height: 1.55;
    cursor: pointer;
  }
  .ha-consent-text strong { color: ${T.tx}; font-weight: 600; }
  .ha-pii-notice {
    display: flex;
    gap: 8px;
    padding: 10px 14px;
    background: ${T.tealDim};
    border: 1px solid ${T.tealBorder};
    border-radius: 8px;
    font-size: 11px;
    color: ${T.teal};
    line-height: 1.5;
  }
  .ha-skip-link {
    text-align: center;
    font-size: 12px;
    color: ${T.tx3};
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 4px;
  }
  .ha-skip-link:hover { color: ${T.tx2}; }

  /* Nav */
  .ha-nav { display: flex; gap: 10px; padding: 14px 20px 20px; }
  .ha-nav .ha-btn { flex: 1; }
  .ha-back {
    flex: 0 0 auto !important;
    width: 46px !important;
    padding: 14px 0 !important;
    font-size: 18px !important;
  }

  /* ── Processing ── */
  .ha-processing {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    gap: 32px;
    text-align: center;
  }
  .ha-ring-wrap { position: relative; width: 80px; height: 80px; }
  .ha-ring {
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 2px solid ${T.border};
    border-top-color: ${T.teal};
    animation: ha-spin 1s linear infinite;
  }
  .ha-ring-inner {
    position: absolute; inset: 12px;
    border-radius: 50%;
    border: 2px solid ${T.border};
    border-bottom-color: ${T.or};
    animation: ha-spin 1.6s linear infinite reverse;
  }
  @keyframes ha-spin { to { transform: rotate(360deg); } }
  .ha-proc-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.2px;
  }
  .ha-proc-sub { font-size: 13px; color: ${T.tx2}; }
  .ha-proc-steps { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; }
  .ha-proc-step {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: ${T.tx3};
    transition: color 0.3s;
  }
  .ha-proc-step.active { color: ${T.tx}; }
  .ha-proc-step.done { color: ${T.teal}; }
  .ha-proc-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${T.border2}; flex-shrink: 0;
    transition: background 0.3s;
  }
  .ha-proc-step.done .ha-proc-dot { background: ${T.teal}; }
  .ha-proc-step.active .ha-proc-dot { background: ${T.or}; animation: ha-pulse 1s ease infinite; }
  @keyframes ha-pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }

  /* ── Results ── */
  .ha-results { flex: 1; display: flex; flex-direction: column; }
  .ha-results-header {
    padding: 18px 20px;
    border-bottom: 1px solid ${T.border};
    background: ${T.s1};
  }
  .ha-results-header-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 10px;
  }
  .ha-results-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800;
    letter-spacing: -0.2px;
  }
  .ha-results-sub { font-size: 12px; color: ${T.tx2}; margin-top: 3px; }
  .ha-overall {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-overall-num { font-size: 34px; font-weight: 700; line-height: 1; }
  .ha-overall-denom { font-size: 11px; color: ${T.tx3}; letter-spacing: 0.5px; text-transform: uppercase; }

  .ha-risk-row { display: flex; align-items: center; gap: 10px; }
  .ha-risk-label { font-size: 12px; color: ${T.tx3}; }
  .ha-risk-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.8px;
    font-family: 'JetBrains Mono', monospace;
  }
  .risk-HIGH { background: ${T.redDim}; color: ${T.red}; border: 1px solid rgba(248,113,113,0.25); }
  .risk-MEDIUM { background: rgba(251,191,36,0.1); color: ${T.yellow}; border: 1px solid rgba(251,191,36,0.25); }
  .risk-LOW { background: ${T.greenDim}; color: ${T.green}; border: 1px solid rgba(52,211,153,0.25); }

  /* Shadow IT badge */
  .ha-shadow-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.8px;
    font-family: 'JetBrains Mono', monospace;
    margin-left: 6px;
  }
  .shadow-CRITICAL { background: ${T.redDim}; color: ${T.red}; border: 1px solid rgba(248,113,113,0.25); }
  .shadow-HIGH { background: ${T.orDim}; color: ${T.or}; border: 1px solid ${T.orBorder}; }
  .shadow-MANAGED { background: ${T.greenDim}; color: ${T.green}; border: 1px solid rgba(52,211,153,0.25); }

  .ha-results-body {
    flex: 1; overflow-y: auto;
    padding: 16px 20px 100px;
    display: flex; flex-direction: column; gap: 18px;
  }

  /* Section heading */
  .ha-sec-head {
    font-size: 10px; font-weight: 800;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: ${T.tx3}; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }
  .ha-sec-head::after { content: ''; flex: 1; height: 1px; background: ${T.border}; }

  /* Score grid */
  .ha-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ha-score-card {
    background: ${T.s1}; border: 1px solid ${T.border};
    border-radius: 10px; padding: 12px 14px;
  }
  .ha-score-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
    text-transform: uppercase; color: ${T.tx3};
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .ha-score-val {
    font-size: 26px; font-weight: 700; line-height: 1;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .ha-score-unit { font-size: 12px; color: ${T.tx3}; font-weight: 400; }
  .ha-score-bar { height: 3px; background: ${T.border}; border-radius: 2px; overflow: hidden; }
  .ha-score-fill { height: 100%; border-radius: 2px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* Vendor list */
  .ha-vendor-list { display: flex; flex-direction: column; gap: 8px; }
  .ha-vendor-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
  }
  .ha-vendor-rank {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .vr-1 { background: ${T.tealDim}; color: ${T.teal}; border: 1px solid ${T.tealBorder}; }
  .vr-2 { background: ${T.orDim}; color: ${T.or}; border: 1px solid ${T.orBorder}; }
  .vr-3 { background: rgba(96,165,250,0.08); color: ${T.blue}; border: 1px solid rgba(96,165,250,0.2); }
  .ha-vendor-name { font-size: 14px; font-weight: 700; }
  .ha-vendor-reason { font-size: 12px; color: ${T.tx2}; line-height: 1.4; }
  .ha-vendor-match {
    margin-left: auto; flex-shrink: 0;
    font-size: 16px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Findings / steps */
  .ha-findings { display: flex; flex-direction: column; gap: 8px; }
  .ha-finding {
    display: flex; gap: 10px;
    padding: 12px 14px;
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
    font-size: 13px; line-height: 1.55; color: ${T.tx2};
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
    background: ${T.orDim}; color: ${T.or}; border: 1px solid ${T.orBorder};
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .ha-step-text { font-size: 13px; line-height: 1.55; color: ${T.tx2}; }

  /* Executive summary */
  .ha-exec {
    background: ${T.s1}; border: 1px solid ${T.border}; border-radius: 10px;
    padding: 16px; font-size: 13px; line-height: 1.7; color: ${T.tx2};
  }

  /* INT CTA card */
  .ha-int-cta {
    background: linear-gradient(135deg, rgba(13,26,46,0.8), ${T.s2});
    border: 1px solid ${T.border2}; border-radius: 12px;
    padding: 18px; text-align: center;
  }
  .ha-int-cta h3 {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 800; margin-bottom: 6px;
  }
  .ha-int-cta p {
    font-size: 12px; color: ${T.tx2}; line-height: 1.55; margin-bottom: 12px;
  }
  .ha-int-locate {
    font-size: 11px; font-weight: 700; color: ${T.teal};
    letter-spacing: 0.3px; font-family: 'JetBrains Mono', monospace;
  }

  /* Save status */
  .ha-save-status {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 5px;
  }
  .ha-save-ok { color: ${T.green}; }
  .ha-save-err { color: ${T.red}; }
  .ha-save-ing { color: ${T.tx3}; }

  /* CTA bar */
  .ha-cta-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px;
    padding: 10px 20px 16px;
    background: rgba(7,9,13,0.96); backdrop-filter: blur(20px);
    border-top: 1px solid ${T.border};
    display: flex; gap: 8px; align-items: center; z-index: 10;
  }
  .ha-cta-bar .ha-btn { flex: 1; font-size: 13px; padding: 12px 14px; }

  /* Error screen */
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
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700; margin-top: 4px;
  }
`;

// ─── Score color ──────────────────────────────────────────────────────────────
function scoreColor(v) {
  if (v >= 4) return T.green;
  if (v >= 3) return T.teal;
  if (v >= 2) return T.yellow;
  return T.red;
}

// ─── Shadow IT risk label ─────────────────────────────────────────────────────
function shadowItClass(answer) {
  if (!answer || answer.includes("No policy")) return "shadow-CRITICAL";
  if (answer.includes("No — employees")) return "shadow-CRITICAL";
  if (answer.includes("Partially")) return "shadow-HIGH";
  return "shadow-MANAGED";
}
function shadowItLabel(answer) {
  if (!answer || answer.includes("No policy")) return "CRITICAL";
  if (answer.includes("No — employees")) return "CRITICAL";
  if (answer.includes("Partially")) return "HIGH";
  return "MANAGED";
}

// ─── Supabase capture ─────────────────────────────────────────────────────────
async function saveToSupabase(payload) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = CONFIG;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { ok: false, error: "Supabase not configured" };
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── AWS S3 backup ────────────────────────────────────────────────────────────
async function backupToAws(payload) {
  const { AWS_BACKUP_URL } = CONFIG;
  if (!AWS_BACKUP_URL) return;
  try {
    await fetch(AWS_BACKUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_) { /* silent — Supabase is primary */ }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", email: "", company: "", role: "" });
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [procStep, setProcStep] = useState(0);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'ok' | 'error'
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());

  const PROC = [
    "Evaluating isolation patterns...",
    "Analyzing shadow IT exposure...",
    "Mapping compliance requirements...",
    "Scoring vendor alignment...",
    "Generating architecture recommendations...",
    "Compiling findings...",
  ];

  const q = QUESTIONS[step];

  // ── Wizard navigation ─────────────────────────────────────────────────────
  function toggleOpt(val) {
    if (q.multi) {
      const cur = answers[q.id] || [];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      setAnswers({ ...answers, [q.id]: next });
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
      // Validate email if provided
      const errs = {};
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errs.email = true;
      }
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
      setFieldErrors({});
    }
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else runAssessment();
  }

  function back() {
    if (step === 0) setScreen("welcome");
    else setStep(step - 1);
  }

  function skipContact() {
    setContact({ name: "", email: "", company: "", role: "" });
    setConsent(false);
    runAssessment();
  }

  // ── Run assessment ────────────────────────────────────────────────────────
  async function runAssessment() {
    setScreen("processing");
    setProcStep(0);
    let ps = 0;
    timerRef.current = setInterval(() => {
      ps++;
      if (ps < PROC.length) setProcStep(ps);
    }, 850);

    const shadowItOpt = answers.shadowIt || "No policy exists yet";

    const prompt = `You are an enterprise data architect specializing in multi-tenant isolation for MSP environments with expertise in shadow IT governance. Assess this MSP infrastructure profile and return ONLY valid JSON (no markdown fences, no explanation).

PROFILE:
- Client tenants: ${answers.tenants || "Unknown"}
- Compliance frameworks: ${(answers.compliance || []).join(", ") || "None specified"}
- Current isolation pattern: ${answers.isolation || "Unknown"}
- AI workload status: ${answers.aiStatus || "Unknown"}
- Cloud platform: ${answers.cloud || "Unknown"}
- Shadow IT / employee AI tool visibility: ${shadowItOpt}

SCORING DIMENSIONS (1.0–5.0, one decimal place each):
1. tenant_isolation — strength of data boundaries (5=physical isolation, 1=no isolation)
2. encryption_depth — at-rest/in-transit/CMK support (5=full CMK+rotation, 1=none)
3. ai_exposure_risk — INVERTED: 5=low AI data exposure risk, 1=critical exposure risk
4. compliance_readiness — audit trails, HIPAA/SOC 2 (5=fully automated, 1=none)
5. integration_surface — open standards vs lock-in (5=fully open, 1=fully proprietary)
6. msp_fit — multi-client management suitability (5=purpose-built for MSP, 1=poor fit)
7. shadow_it_score — governance of unsanctioned AI tool usage (5=fully governed, 1=no visibility)

Shadow IT specific scoring guide for shadow_it_score:
- "Yes — fully inventoried and policy-governed" → 4.5–5.0
- "Partially — we know the approved tools..." → 2.5–3.5
- "No — employees choose their own AI tools" → 1.0–1.5
- "No policy exists yet" → 1.0

ALSO PROVIDE:
- overall_score: integer 0–100 (weighted: tenant_isolation 20%, encryption_depth 15%, ai_exposure_risk 20%, compliance_readiness 15%, integration_surface 10%, msp_fit 10%, shadow_it_score 10%)
- exposure_risk_level: "HIGH" | "MEDIUM" | "LOW"
- shadow_it_risk: "CRITICAL" | "HIGH" | "MANAGED"
- top_vendors: array of 3 objects { name, match_pct (integer 65–98), reason (max 12 words) }
  — Choose from: Snowflake, CockroachDB, PlanetScale, AWS Native, Azure, Google Cloud, Rubrik, OneTrust, Skyflow
  — Weight toward vendors that address their specific gaps
- key_findings: array of 5 strings (25–35 words each, specific to their profile, include one about shadow IT)
- next_steps: array of 3 strings (15–22 words each, actionable, at least one addressing shadow IT governance)
- exec_summary: 2 sentences (50–65 words total), professional, specific to their profile

Return ONLY the JSON object.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      clearInterval(timerRef.current);
      setProcStep(PROC.length - 1);

      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);

      // Save to Supabase + AWS
      const dbPayload = buildDbPayload(parsed, sessionId.current);
      setSaveStatus("saving");
      setTimeout(() => setScreen("results"), 500);

      const [sbResult] = await Promise.all([
        saveToSupabase(dbPayload),
        backupToAws(dbPayload),
      ]);
      setSaveStatus(sbResult.ok ? "ok" : "error");
    } catch (e) {
      clearInterval(timerRef.current);
      setError(e.message || "Unknown error");
      setScreen("error");
    }
  }

  // ── Build DB payload (PII only if consent) ────────────────────────────────
  function buildDbPayload(parsed, sid) {
    const base = {
      session_id: sid,
      // Profile — non-PII, always stored
      tenant_count: answers.tenants || null,
      compliance: (answers.compliance || []).join(", ") || null,
      isolation: answers.isolation || null,
      ai_status: answers.aiStatus || null,
      cloud_platform: answers.cloud || null,
      shadow_it: answers.shadowIt || null,
      // Scores
      overall_score: parsed.overall_score,
      risk_level: parsed.exposure_risk_level,
      score_isolation: parsed.tenant_isolation,
      score_encrypt: parsed.encryption_depth,
      score_ai_risk: parsed.ai_exposure_risk,
      score_compliance: parsed.compliance_readiness,
      score_integration: parsed.integration_surface,
      score_msp: parsed.msp_fit,
      score_shadow_it: parsed.shadow_it_score,
      top_vendors: parsed.top_vendors,
      key_findings: parsed.key_findings,
      next_steps: parsed.next_steps,
      exec_summary: parsed.exec_summary,
      // PII gate
      consent: consent && !!contact.email,
    };
    // Only attach contact PII if user explicitly consented
    if (consent && contact.email) {
      base.contact_name = sanitize(contact.name);
      base.contact_email = sanitize(contact.email, 100);
      base.contact_company = sanitize(contact.company);
      base.contact_role = sanitize(contact.role);
    }
    return base;
  }

  function restart() {
    setScreen("welcome");
    setStep(0);
    setAnswers({});
    setContact({ name: "", email: "", company: "", role: "" });
    setConsent(false);
    setResult(null);
    setError("");
    setSaveStatus(null);
    sessionId.current = crypto.randomUUID();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="ha">
        <div className="ha-shell">
          {screen === "welcome" && <Welcome onStart={() => setScreen("wizard")} />}
          {screen === "wizard" && (
            <Wizard
              q={q}
              step={step}
              total={QUESTIONS.length}
              answers={answers}
              contact={contact}
              setContact={setContact}
              consent={consent}
              setConsent={setConsent}
              fieldErrors={fieldErrors}
              onToggle={toggleOpt}
              onAdvance={advance}
              onBack={back}
              onSkip={q.isContact ? skipContact : null}
              canContinue={canContinue}
            />
          )}
          {screen === "processing" && <Processing steps={PROC} current={procStep} />}
          {screen === "results" && result && (
            <Results
              result={result}
              answers={answers}
              saveStatus={saveStatus}
              onRestart={restart}
            />
          )}
          {screen === "error" && <ErrorScreen msg={error} onRestart={restart} />}
        </div>
      </div>
    </>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────────
function Welcome({ onStart }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=ffffff&color=07090d&data=${encodeURIComponent(CONFIG.ASSESSMENT_URL)}`;

  return (
    <div className="ha-welcome">
      <div className="ha-welcome-top">
        <span className="ha-badge">HumanX 2026 × INT Inc.</span>
        <h1>
          Is Your Multi-Tenant<br />
          <em>AI Architecture</em><br />
          Actually Secure?
        </h1>
        <p>
          6 questions. 90 seconds. Personalized assessment of your data isolation,
          compliance posture, and shadow IT exposure — powered by Claude.
        </p>
      </div>

      <div className="ha-qr-section">
        <div className="ha-qr-wrap">
          <img src={qrUrl} alt="QR code to open assessment" />
        </div>
        <div className="ha-qr-text">
          <h3>📱 Open on your phone</h3>
          <p>Scan to take the assessment on your own device. Results stay with you.</p>
          <div className="ha-qr-url">{CONFIG.ASSESSMENT_URL}</div>
        </div>
      </div>

      <div className="ha-welcome-cta">
        <button className="ha-btn ha-btn-primary" onClick={onStart}>
          Start Assessment →
        </button>
        <div className="ha-trust">
          <span className="ha-trust-item"><span className="dot">✓</span> SOC 2 Type II</span>
          <span className="ha-trust-item"><span className="dot">✓</span> No PII without consent</span>
          <span className="ha-trust-item"><span className="dot">✓</span> Claude-powered</span>
          <span className="ha-trust-item"><span className="dot">✓</span> 90 seconds</span>
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
            <span>
              <strong>Shadow IT fact:</strong> 65% of employees use at least one unsanctioned AI tool at work.
              For MSPs, this means client data can leave your governance boundary without a trace.
            </span>
          </div>
        )}

        {!q.isContact ? (
          <div className="ha-opts">
            {q.opts.map((opt) => {
              const sel = q.multi ? (val || []).includes(opt) : val === opt;
              return (
                <button key={opt} className={`ha-opt ${sel ? "selected" : ""}`} onClick={() => onToggle(opt)}>
                  {q.multi && (
                    <span className="ha-opt-check">{sel ? "✓" : ""}</span>
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <ContactForm
            contact={contact}
            setContact={setContact}
            consent={consent}
            setConsent={setConsent}
            fieldErrors={fieldErrors}
            onSkip={onSkip}
          />
        )}
      </div>

      <div className="ha-nav">
        <button className="ha-btn ha-btn-ghost ha-back" onClick={onBack}>←</button>
        <button
          className="ha-btn ha-btn-primary"
          onClick={onAdvance}
          disabled={!canContinue()}
          style={{ opacity: canContinue() ? 1 : 0.35 }}
        >
          {step === QUESTIONS.length - 1 ? "Generate Assessment →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm({ contact, setContact, consent, setConsent, fieldErrors, onSkip }) {
  function update(field, val) {
    setContact((c) => ({ ...c, [field]: sanitize(val) }));
  }

  return (
    <div className="ha-contact-form">
      <div className="ha-pii-notice">
        <span>🔒</span>
        <span>
          Your contact info is stored only if you check the consent box below.
          Non-PII assessment data (scores, architecture profile) is always captured
          anonymously to improve INT's research.
        </span>
      </div>

      {[
        ["name", "Your Name", "text", false],
        ["email", "Work Email", "email", false],
        ["company", "Company / MSP Name", "text", false],
        ["role", "Your Role", "text", false],
      ].map(([field, label, type, req]) => (
        <div className="ha-field" key={field}>
          <label>{label}{req ? " *" : ""}</label>
          <input
            type={type}
            placeholder={label}
            value={contact[field]}
            onChange={(e) => update(field, e.target.value)}
            className={fieldErrors[field] ? "err" : ""}
            maxLength={field === "email" ? 100 : 200}
            autoComplete={field === "email" ? "email" : "off"}
          />
        </div>
      ))}
      {fieldErrors.email && (
        <p style={{ fontSize: 12, color: T.red }}>Please enter a valid email address.</p>
      )}

      <label className="ha-consent" onClick={() => setConsent(!consent)}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="ha-consent-text">
          <strong>I consent to INT Inc. storing my contact info</strong> to send my full
          PDF report and follow up about architecture consultations. I can unsubscribe anytime.
          No data will be sold or shared with third parties.
        </span>
      </label>

      <span className="ha-skip-link" onClick={onSkip}>
        Skip — view results on screen only (no data stored)
      </span>
    </div>
  );
}

// ─── Processing ───────────────────────────────────────────────────────────────
function Processing({ steps, current }) {
  return (
    <div className="ha-processing">
      <div className="ha-ring-wrap">
        <div className="ha-ring" />
        <div className="ha-ring-inner" />
      </div>
      <div>
        <div className="ha-proc-title">Analyzing your architecture...</div>
        <div className="ha-proc-sub" style={{ marginTop: 6 }}>
          Claude is scoring 7 security and governance dimensions
        </div>
      </div>
      <div className="ha-proc-steps">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "active" : "";
          return (
            <div key={i} className={`ha-proc-step ${state}`}>
              <div className="ha-proc-dot" />
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
  const scores = [
    { key: "tenant_isolation", label: "Tenant Isolation" },
    { key: "encryption_depth", label: "Encryption Depth" },
    { key: "ai_exposure_risk", label: "AI Data Safety" },
    { key: "compliance_readiness", label: "Compliance Ready" },
    { key: "integration_surface", label: "Integration Surface" },
    { key: "msp_fit", label: "MSP Fit" },
    { key: "shadow_it_score", label: "Shadow IT Governed" },
  ];

  const overallColor = scoreColor((result.overall_score || 0) / 20);
  const sitClass = shadowItClass(answers.shadowIt);
  const sitLabel = shadowItLabel(answers.shadowIt);

  return (
    <div className="ha-results">
      <div className="ha-results-header">
        <div className="ha-results-header-top">
          <div>
            <div className="ha-results-title">Architecture Assessment</div>
            <div className="ha-results-sub">
              {answers.tenants || "?"} tenants · {answers.cloud || "?"} · {answers.isolation || "?"}
            </div>
          </div>
          <div className="ha-overall">
            <div className="ha-overall-num" style={{ color: overallColor }}>
              {result.overall_score}
            </div>
            <div className="ha-overall-denom">/100</div>
          </div>
        </div>
        <div className="ha-risk-row">
          <span className="ha-risk-label">AI Exposure:</span>
          <span className={`ha-risk-badge risk-${result.exposure_risk_level}`}>
            {result.exposure_risk_level}
          </span>
          <span className="ha-risk-label" style={{ marginLeft: 6 }}>Shadow IT:</span>
          <span className={`ha-shadow-badge ${sitClass}`}>{sitLabel}</span>
        </div>
      </div>

      <div className="ha-results-body">
        {/* Exec summary */}
        <div>
          <div className="ha-sec-head">Executive Summary</div>
          <div className="ha-exec">{result.exec_summary}</div>
        </div>

        {/* Score cards */}
        <div>
          <div className="ha-sec-head">Architecture Scores</div>
          <div className="ha-score-grid">
            {scores.map(({ key, label }) => {
              const v = result[key] || 0;
              const c = scoreColor(v);
              return (
                <div className="ha-score-card" key={key}>
                  <div className="ha-score-label">{label}</div>
                  <div className="ha-score-val" style={{ color: c }}>
                    {Number(v).toFixed(1)}
                    <span className="ha-score-unit">/5</span>
                  </div>
                  <div className="ha-score-bar">
                    <div
                      className="ha-score-fill"
                      style={{ width: `${(v / 5) * 100}%`, background: c }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendors */}
        {result.top_vendors?.length > 0 && (
          <div>
            <div className="ha-sec-head">Vendor Recommendations</div>
            <div className="ha-vendor-list">
              {result.top_vendors.slice(0, 3).map((v, i) => (
                <div className="ha-vendor-item" key={i}>
                  <div className={`ha-vendor-rank vr-${i + 1}`}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ha-vendor-name">{v.name}</div>
                    <div className="ha-vendor-reason">{v.reason}</div>
                  </div>
                  <div
                    className="ha-vendor-match"
                    style={{ color: [T.teal, T.or, T.blue][i] }}
                  >
                    {v.match_pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Findings */}
        {result.key_findings?.length > 0 && (
          <div>
            <div className="ha-sec-head">Key Findings</div>
            <div className="ha-findings">
              {result.key_findings.map((f, i) => (
                <div className="ha-finding" key={i}>
                  <div className="ha-finding-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next steps */}
        {result.next_steps?.length > 0 && (
          <div>
            <div className="ha-sec-head">Recommended Next Steps</div>
            <div className="ha-steps">
              {result.next_steps.map((s, i) => (
                <div className="ha-step" key={i}>
                  <div className="ha-step-num">{i + 1}</div>
                  <div className="ha-step-text">{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INT CTA */}
        <div className="ha-int-cta">
          <h3>Want a full architecture deep-dive?</h3>
          <p>
            INT Inc. builds purpose-built data isolation tools for MSPs — including shadow IT
            governance frameworks. SOC 2 Type II certified. 25+ years of MSP expertise.
          </p>
          <div className="ha-int-locate">
            📍 Find Kyle at the INT Inc. table · HumanX 2026
          </div>
        </div>
      </div>

      <div className="ha-cta-bar">
        {saveStatus && (
          <div className="ha-save-status">
            {saveStatus === "saving" && <span className="ha-save-ing">⏳ Saving...</span>}
            {saveStatus === "ok" && <span className="ha-save-ok">✓ Saved</span>}
            {saveStatus === "error" && <span className="ha-save-err">⚠ Not saved</span>}
          </div>
        )}
        <button className="ha-btn ha-btn-ghost" onClick={onRestart} style={{ flex: "0 0 auto", width: "auto", padding: "12px 14px" }}>
          ↺
        </button>
        <button className="ha-btn ha-btn-primary" onClick={() => window.print()}>
          📥 Save Report
        </button>
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function ErrorScreen({ msg, onRestart }) {
  return (
    <div className="ha-error-screen">
      <span style={{ fontSize: 40 }}>⚠️</span>
      <div className="ha-err-title">Assessment Failed</div>
      <div className="ha-error-card">{msg}</div>
      <button className="ha-btn ha-btn-primary" style={{ width: "100%" }} onClick={onRestart}>
        Try Again
      </button>
    </div>
  );
}
