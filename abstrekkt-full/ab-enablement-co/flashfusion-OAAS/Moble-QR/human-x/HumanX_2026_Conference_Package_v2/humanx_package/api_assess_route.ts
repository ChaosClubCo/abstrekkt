/**
 * app/api/assess/route.ts
 *
 * Server-side proxy for Claude API calls.
 * - API key never leaves the server
 * - Rate limiting: 10 requests per IP per hour (in-memory, resets on cold start)
 * - Input validation and sanitization before hitting Anthropic
 * - 25-second timeout with graceful error response
 * - CORS locked to same origin (Vercel handles this via same-domain deployment)
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AssessPayload {
  tenants: string;
  compliance: string[];
  isolation: string;
  aiStatus: string;
  cloud: string;
  shadowIt: string;
}

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Resets on Vercel cold start (fine for conference use).
// For production, swap this for Upstash Redis.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;        // max requests
const RATE_WINDOW = 3600_000; // 1 hour in ms

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// ─── Allowed values (whitelist everything — reject unknowns) ─────────────────
const ALLOWED = {
  tenants:    ["1–10", "11–50", "51–100", "100+"],
  isolation:  ["Shared DB (RLS)", "Schema per tenant", "DB per tenant", "Dedicated infra", "No formal isolation", "Not sure"],
  aiStatus:   ["Yes, in production", "Piloting / testing", "Planning to start", "Not yet"],
  cloud:      ["AWS", "Azure", "Google Cloud", "Multi-cloud", "On-prem", "Hybrid"],
  compliance: ["HIPAA", "SOC 2", "CMMC", "PCI-DSS", "GDPR", "None yet"],
  shadowIt:   [
    "Yes — fully inventoried and policy-governed",
    "Partially — we know the approved tools, not all unsanctioned ones",
    "No — employees choose their own AI tools",
    "No policy exists yet",
  ],
};

function validatePayload(body: unknown): AssessPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const tenants    = typeof b.tenants   === "string" ? b.tenants.trim()   : "";
  const isolation  = typeof b.isolation === "string" ? b.isolation.trim() : "";
  const aiStatus   = typeof b.aiStatus  === "string" ? b.aiStatus.trim()  : "";
  const cloud      = typeof b.cloud     === "string" ? b.cloud.trim()     : "";
  const shadowIt   = typeof b.shadowIt  === "string" ? b.shadowIt.trim()  : "";
  const compliance = Array.isArray(b.compliance) ? b.compliance : [];

  // Whitelist check
  if (tenants   && !ALLOWED.tenants.includes(tenants))    return null;
  if (isolation && !ALLOWED.isolation.includes(isolation)) return null;
  if (aiStatus  && !ALLOWED.aiStatus.includes(aiStatus))  return null;
  if (cloud     && !ALLOWED.cloud.includes(cloud))         return null;
  if (shadowIt  && !ALLOWED.shadowIt.includes(shadowIt))   return null;

  const validCompliance = compliance
    .filter((c) => typeof c === "string" && ALLOWED.compliance.includes(c as string))
    as string[];

  return {
    tenants:    tenants    || "Not specified",
    compliance: validCompliance.length ? validCompliance : ["Not specified"],
    isolation:  isolation  || "Not specified",
    aiStatus:   aiStatus   || "Not specified",
    cloud:      cloud      || "Not specified",
    shadowIt:   shadowIt   || "No policy exists yet",
  };
}

// ─── Build Claude prompt ──────────────────────────────────────────────────────
function buildPrompt(p: AssessPayload): string {
  return `You are an enterprise data architect specializing in multi-tenant isolation for MSP environments with expertise in shadow IT governance. Assess this MSP infrastructure profile and return ONLY valid JSON — no markdown, no explanation, no code fences.

PROFILE:
- Client tenants: ${p.tenants}
- Compliance frameworks: ${p.compliance.join(", ")}
- Current isolation pattern: ${p.isolation}
- AI workload status: ${p.aiStatus}
- Cloud platform: ${p.cloud}
- Shadow IT / employee AI tool visibility: ${p.shadowIt}

SCORING DIMENSIONS (1.0–5.0, one decimal place):
1. tenant_isolation — strength of data boundaries (5=physical, 1=none)
2. encryption_depth — at-rest/in-transit/CMK support (5=full CMK+rotation, 1=none)
3. ai_exposure_risk — INVERTED: 5=low risk, 1=critical exposure risk
4. compliance_readiness — audit trails, HIPAA/SOC2 (5=fully automated, 1=none)
5. integration_surface — open standards vs lock-in (5=fully open, 1=proprietary)
6. msp_fit — multi-client management suitability (5=purpose-built, 1=poor)
7. shadow_it_score — governance of unsanctioned AI tool usage:
   "Yes — fully inventoried" → 4.5–5.0
   "Partially" → 2.5–3.5
   "No — employees choose" → 1.0–1.5
   "No policy exists" → 1.0

Return this exact JSON structure:
{
  "overall_score": <integer 0-100, weighted: tenant_isolation 20%, encryption_depth 15%, ai_exposure_risk 20%, compliance_readiness 15%, integration_surface 10%, msp_fit 10%, shadow_it_score 10%>,
  "exposure_risk_level": <"HIGH" | "MEDIUM" | "LOW">,
  "shadow_it_risk": <"CRITICAL" | "HIGH" | "MANAGED">,
  "tenant_isolation": <number>,
  "encryption_depth": <number>,
  "ai_exposure_risk": <number>,
  "compliance_readiness": <number>,
  "integration_surface": <number>,
  "msp_fit": <number>,
  "shadow_it_score": <number>,
  "top_vendors": [
    { "name": <string from: Snowflake|CockroachDB|PlanetScale|AWS Native|Azure|Google Cloud|Rubrik|OneTrust|Skyflow>, "match_pct": <integer 65-98>, "reason": <string, max 12 words> }
  ],
  "key_findings": [<5 strings, 25-35 words each, specific to profile, one about shadow IT>],
  "next_steps": [<3 strings, 15-22 words each, actionable, one addressing shadow IT governance>],
  "exec_summary": <string, 2 sentences, 50-65 words, professional, specific to this profile>
}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Same-origin check (belt + suspenders with Vercel's same-domain deploy)
  const origin = req.headers.get("origin");
  const host   = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "3600",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 3. Parse and validate body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = validatePayload(rawBody);
  if (!payload) {
    return NextResponse.json({ error: "Invalid payload values" }, { status: 400 });
  }

  // 4. Check API key exists server-side
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set");
    return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
  }

  // 5. Call Claude with 25s timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages:   [{ role: "user", content: buildPrompt(payload) }],
      }),
    });

    clearTimeout(timeout);

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic error:", anthropicRes.status, errText);
      return NextResponse.json(
        { error: "Assessment service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await anthropicRes.json();
    const raw  = data?.content?.[0]?.text || "";

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/gi, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw:", raw.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to parse assessment result. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        // No caching — every assessment is unique
        "Cache-Control": "no-store",
      },
    });

  } catch (err: unknown) {
    clearTimeout(timeout);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout
          ? "Assessment timed out. Conference WiFi may be slow — please try again."
          : "Unexpected error. Please try again." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
