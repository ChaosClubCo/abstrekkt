import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* =====================================================================================
   FlashFusion Growth OS
   Rebuilt from the recovered "Growth OS" build prompt.

   TOKEN NOTE: the recovered prompt hard-coded FlashFusion v2 tokens (#0F0618 bg,
   #F472B6 pink, Poppins/Inter/JetBrains Mono, 90deg gradient). Those are deprecated.
   This build uses the current locked v3 identity instead: #0B0B14 / #13131F,
   magenta #EC4899, 135deg gradient, Geist / Geist Mono, Poppins reserved for the
   logo wordmark only. See the chat response for the full list of substitutions.
===================================================================================== */

/* =====================================================================================
   SECTION 1 — CONFIG
   Single source of truth for project data. Real, memory-grounded FlashFusion context
   where known; every unmeasured figure is explicitly labeled rather than invented.
===================================================================================== */

const CONFIG = {
  project: {
    name: "FlashFusion",
    slug: "flashfusion",
  },

  operator: {
    name: "Kyle Rosebrook",
    role: "Founder / Operator — FlashFusion & Abstrekkt",
    background:
      "Self-taught transition from 10+ years in hospitality management into IT and AI/automation systems. FlashFusion is built solo, on top of a full-time service-desk role — self-initiated work, not an engineering job function.",
    operatingContext:
      "Solo operator building FlashFusion (AI agent platform, Base44 + n8n/Make) and its parent company Abstrekkt while working a full-time day job.",
    teamConstraint: "Solo — no co-founders or hires yet.",
    budgetConstraint: "Bootstrapped — self-funded, no outside capital.",
    timeConstraint:
      "Nights and weekends around a full-time day job. Capacity, not ideas, is the binding constraint.",
    decisionPriority:
      "Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness.",
    period: "July 2026",
    primaryObjective:
      "Convert the FlashFusion infrastructure build-out into a demo-ready, sellable consulting offer and close the first signed engagement.",
    successDefinition:
      "By the end of this period: the open credential exposure is resolved, infrastructure consolidation has no orphaned or deleted apps left unresolved, the sales engine has been run against a real prospect list, and at least one engagement is signed.",
  },

  wheel: {
    rings: [
      {
        id: "target",
        label: "Target",
        innerR: 65,
        outerR: 102,
        segments: [
          {
            id: "target-icp",
            label: "Ops teams evaluating AI/automation adoption",
            shortLabel: "Ops/Automation",
            status: "moderate",
            detail:
              "Small-to-mid-size operational teams evaluating AI and automation adoption, reached through discovery workshops and direct consulting rather than a self-serve funnel. Definition is a working hypothesis synthesized from adjacent tooling, not a validated ICP statement.",
            metric: "Not yet measured — no tracked inbound volume",
            nextAction:
              "Run the sales engine against one real, defined prospect list instead of describing the ICP in the abstract.",
            tags: ["Target", "ICP"],
          },
        ],
      },
      {
        id: "personas",
        label: "Personas",
        innerR: 105,
        outerR: 142,
        segments: [
          {
            id: "persona-ops-lead",
            label: "Ops / IT Lead — Automation-Curious",
            shortLabel: "Ops Lead",
            status: "moderate",
            detail:
              "Owns day-to-day operations at a small org, feels the pain of manual workflows, holds budget authority for tooling but not for headcount. Primary audience for use-case discovery workshops.",
            tags: ["Persona", "Buyer"],
          },
          {
            id: "persona-solo-founder",
            label: "Solo Founder / Builder",
            shortLabel: "Solo Founder",
            status: "moderate",
            detail:
              "Solo or two-person teams needing agent and automation infrastructure without hiring an engineer — closest analog to Kyle's own situation, strongest intuitive fit, least validated with real interviews.",
            tags: ["Persona", "Self-serve"],
          },
          {
            id: "persona-msp-adjacent",
            label: "MSP / IT-Services Operator",
            shortLabel: "MSP Operator",
            status: "poor",
            detail:
              "IT-services and MSP-adjacent operators who could resell or white-label FlashFusion automation into client engagements. Mentioned in passing, not an actively pursued channel yet.",
            tags: ["Persona", "Channel"],
          },
        ],
      },
      {
        id: "insights",
        label: "Insights",
        innerR: 145,
        outerR: 182,
        segments: [
          {
            id: "insight-consulting-proof",
            label: "Consulting Proof Points",
            shortLabel: "Proof Points",
            status: "poor",
            detail:
              "The audit.flashfusion.co consulting platform previously relied on fabricated case studies; that was caught and rebuilt around real experience. Verifiable proof points are still thin — real case studies are the exception, not the norm.",
            metric: "Not yet measured",
            nextAction:
              "Document 1-2 real engagements, even informal ones, as sourced case studies before the next outbound push.",
            tags: ["Evidence", "Consulting"],
          },
          {
            id: "insight-usage-signal",
            label: "Product Usage Signal",
            shortLabel: "Usage Signal",
            status: "critical",
            detail:
              "40+ Base44 apps exist across the portfolio, but they are pre-launch by design — there is no live usage data to lean on. Fit signal has to come from build quality and demo reception, not analytics.",
            metric: "0 tracked active users (pre-launch by design)",
            tags: ["Evidence", "Product"],
          },
          {
            id: "insight-pipeline-signal",
            label: "Sales Pipeline Signal",
            shortLabel: "Pipeline Signal",
            status: "poor",
            detail:
              "A sales engine (n8n workflows + React dashboard) has been built, but there is no evidence yet of it running against a real prospect list or producing qualified conversations.",
            nextAction:
              "Run the sales engine against a small real list and measure response rate before scaling it further.",
            tags: ["Evidence", "Pipeline"],
          },
        ],
      },
      {
        id: "impact",
        label: "Impact",
        innerR: 185,
        outerR: 222,
        segments: [
          {
            id: "impact-revenue",
            label: "Revenue",
            status: "critical",
            detail:
              "No signed FlashFusion consulting engagements yet. Infrastructure and tooling are running ahead of monetization.",
            metric: "$0 signed engagements (as of last review)",
            nextAction: "Prioritize closing one real engagement over building additional infrastructure.",
            tags: ["Impact", "Revenue"],
          },
          {
            id: "impact-delivery-capacity",
            label: "Delivery Capacity",
            shortLabel: "Delivery",
            status: "moderate",
            detail:
              "Substantial infrastructure work has landed: a 21-subdomain flashfusion.co architecture, a live Base44 app audit, and Make-based automation (9 P1 blueprints). Still incomplete — deleted apps, a Manufact/Cloudflare gap, and 65 n8n workflows sitting inactive rather than formally retired.",
            nextAction: "Close the Manufact/Cloudflare gap and formally decommission the remaining inactive n8n workflows.",
            tags: ["Impact", "Infrastructure"],
          },
          {
            id: "impact-security-posture",
            label: "Security Posture",
            shortLabel: "Security",
            status: "critical",
            detail:
              "An open credential-exposure issue is unresolved. Until it's closed, security posture is the single biggest risk on this wheel — bigger than any revenue or delivery item.",
            nextAction: "Rotate the exposed credentials and delete the source document before anything else.",
            tags: ["Impact", "Security"],
          },
        ],
      },
      {
        id: "initiatives",
        label: "Initiatives",
        innerR: 225,
        outerR: 268,
        segments: [
          {
            id: "init-credential-rotation",
            label: "Credential Rotation & Key Exposure Fix",
            shortLabel: "Credential Fix",
            status: "critical",
            detail:
              "A document containing raw API keys remains undeleted and the keys unrotated. Highest-priority open item across the entire platform.",
            owner: "Kyle",
            nextAction: "Delete the source document and rotate every exposed key today.",
            tags: ["Initiative", "Security"],
          },
          {
            id: "init-infra-consolidation",
            label: "FlashFusion Infrastructure Consolidation",
            shortLabel: "Infra Consolidation",
            status: "moderate",
            detail:
              "21-subdomain flashfusion.co architecture mapped against 40+ Base44 apps. Several apps (root, app, client, agents, debate) were found deleted and need rebuilding or formal retirement. A Manufact/Cloudflare gap is still open.",
            owner: "Kyle",
            nextAction: "Rebuild or formally retire the deleted Base44 apps and close the Manufact/Cloudflare gap.",
            tags: ["Initiative", "Infrastructure"],
          },
          {
            id: "init-automation-migration",
            label: "n8n → Make Automation Migration",
            shortLabel: "n8n→Make",
            status: "moderate",
            detail:
              "Make is now the primary automation platform with 9 P1 blueprints built. n8n Cloud remains active but all 65 workflows sit inactive — neither fully retired nor cleanly replaced.",
            owner: "Kyle",
            nextAction: "Wire the Make Team ID for MCP credentials, then formally archive the inactive n8n workflows.",
            tags: ["Initiative", "Automation"],
          },
          {
            id: "init-sales-engine",
            label: "FlashFusion Sales Engine Activation",
            shortLabel: "Sales Engine",
            status: "moderate",
            detail:
              "A sales engine (n8n workflows + React dashboard) is built but has not been run against a real prospect list yet.",
            owner: "Kyle",
            nextAction: "Load a real, small prospect list and run the engine end-to-end before investing further.",
            tags: ["Initiative", "Sales"],
          },
          {
            id: "init-3d-pipeline",
            label: "FlashFusion 3D Asset Pipeline",
            shortLabel: "3D Pipeline",
            status: "good",
            detail:
              "Rebuilt from Hyper3D Rodin to the Meshy API with a full security audit — key validation regex, fail-fast on 4xx, and a race-condition fix. The most hardened initiative on this wheel.",
            owner: "Kyle",
            nextAction: "Wire the pipeline's output into a visible demo surface so it earns its place in the consulting narrative.",
            tags: ["Initiative", "Product"],
          },
          {
            id: "init-base44-rationalization",
            label: "Base44 Portfolio Rationalization",
            shortLabel: "Base44 Cleanup",
            status: "poor",
            detail:
              "40+ Base44 apps exist, several orphaned or deleted. Apps are pre-launch by design, so fit signal matters more than usage data — but the portfolio still needs to be cut to what actually maps to the subdomain architecture.",
            owner: "Kyle",
            nextAction: "Finish the live Base44 audit and cut every app that doesn't map cleanly to the 21-subdomain architecture.",
            tags: ["Initiative", "Base44"],
          },
        ],
      },
    ],
  },

  assistant: {
    // Static identity + rules only. Wheel-derived content (target, personas,
    // insights, impact, initiatives) is generated programmatically from
    // config.wheel by buildStrategySystemPrompt — one source of truth,
    // no risk of this text drifting out of sync with the wheel data.
    identity: [
      "You are the FlashFusion Growth Strategy AI, embedded inside Kyle Rosebrook's Growth OS.",
      "",
      "OPERATOR",
      "Name: Kyle Rosebrook",
      "Role: Founder / Operator — FlashFusion & Abstrekkt (self-initiated work on top of a full-time day job, not an engineering title)",
      "Background: Self-taught transition from hospitality management into IT and AI/automation systems.",
      "Constraints: Solo operator, bootstrapped, nights/weekends capacity only.",
      "Decision priority: Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness.",
      "Primary objective: Convert the FlashFusion infrastructure build-out into a demo-ready, sellable consulting offer and close the first signed engagement.",
      "Success definition: Credential exposure resolved, infrastructure consolidation complete, sales engine proven against a real list, at least one engagement signed.",
    ].join("\n"),
    responseRules: [
      "Reference actual initiatives, personas, evidence, and blockers from the wheel context — never invent progress, customers, metrics, or deadlines.",
      "Prioritize using impact × urgency ÷ effort.",
      "Distinguish verified evidence from assumption; state plainly when evidence is insufficient.",
      "Identify contradictions in the supplied context instead of smoothing over them.",
      "Recommend exactly one primary next executable action per response, with an owner and completion condition when known.",
      "Prefer reversible steps when uncertainty is high.",
      "Default to 3-6 direct sentences. Expand only when asked.",
      "No motivational filler, no generic advice.",
      "End with \"Next action: [one concrete action]\" only when it adds information beyond what's already in the response.",
    ],
  },

  suggestedQuestions: [
    "What is leaking the most growth or revenue right now?",
    "Which initiative should be paused, merged, or killed first?",
    "Where is the evidence weakest in the current strategy?",
    "What is the highest-leverage action I can complete this week?",
  ],

  contextTags: {
    active: ["Security", "Infrastructure", "Revenue"],
    inactive: ["Automation", "Sales", "Base44"],
  },

  branding: {
    logoText: "FlashFusion",
    badgeText: "Growth OS — Kyle Rosebrook",
    aiFooter: "Claude · Artifact runtime",
  },

  behavior: {
    persistUiPreferences: true,
    persistConversation: false,
    submitSuggestionImmediately: true,
    showInspectionCard: true,
    includeSelectedSegmentInAiContext: true,
    maxInputCharacters: 4000,
    maxVisibleMessages: 50,
  },
};

/* Status tokens — extended to 4 severity levels (good/moderate/poor/critical).
   FlashFusion's brand tokens only define 3 semantic levels (success/warning/error);
   accents below stay in-family with those but add a distinct "critical" tier since
   the whole point of this tool is triage between "needs attention" and "on fire". */
const STATUS_TOKENS = {
  good: { accent: "#4ade80", fill: "rgba(74,222,128,0.12)", text: "#bbf7d0", icon: "\u2713", label: "Good", abbr: "Good" },
  moderate: { accent: "#fbbf24", fill: "rgba(251,191,36,0.12)", text: "#fde68a", icon: "!", label: "Moderate", abbr: "Mod." },
  poor: { accent: "#f87171", fill: "rgba(248,113,113,0.14)", text: "#fecaca", icon: "\u2193", label: "Poor", abbr: "Poor" },
  critical: { accent: "#dc2626", fill: "rgba(220,38,38,0.18)", text: "#fda4af", icon: "\u00d7", label: "Critical", abbr: "Crit." },
};
const VALID_STATUSES = new Set(Object.keys(STATUS_TOKENS));
const CENTER = 270;
const VIEWBOX = 540;
const ACTIVITY_STAGES = [
  "Reading selected context",
  "Comparing strategic priorities",
  "Forming an executable recommendation",
  "Preparing the response",
];

/* =====================================================================================
   SECTION 2 — GEOMETRY HELPERS
   0deg = 12 o'clock, increasing angle = clockwise. All arithmetic in degrees.
===================================================================================== */

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function normalizeAngleDeg(angle) {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

function describeDonutSegmentRaw(cx, cy, innerR, outerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

/* Full-circle safety: never let a single SVG arc command attempt to draw an entire
   360deg sweep (undefined/degenerate rendering in some engines). Split defensively
   whenever a span gets within 0.01deg of a full circle. */
function describeDonutSegment(cx, cy, innerR, outerR, startAngle, endAngle) {
  const span = endAngle - startAngle;
  if (span >= 359.99) {
    const mid = startAngle + span / 2;
    return (
      describeDonutSegmentRaw(cx, cy, innerR, outerR, startAngle, mid) +
      " " +
      describeDonutSegmentRaw(cx, cy, innerR, outerR, mid, endAngle)
    );
  }
  return describeDonutSegmentRaw(cx, cy, innerR, outerR, startAngle, endAngle);
}

function getSegmentCentroid(cx, cy, innerR, outerR, startAngle, endAngle) {
  const midAngle = (startAngle + endAngle) / 2;
  const midR = (innerR + outerR) / 2;
  return polarToCartesian(cx, cy, midR, midAngle);
}

/* Angle calculation per the spec: 1 segment -> fixed 2deg/358deg span.
   N segments -> even sectors with a small gap between each. */
function calculateSegmentAngles(segmentCount) {
  if (segmentCount <= 0) return [];
  if (segmentCount === 1) return [{ start: 2, end: 358 }];
  const gap = 1.8;
  const sectorSize = 360 / segmentCount;
  return Array.from({ length: segmentCount }, (_, i) => ({
    start: i * sectorSize + gap / 2,
    end: (i + 1) * sectorSize - gap / 2,
  }));
}

function arcLengthPx(innerR, outerR, startAngle, endAngle) {
  const midR = (innerR + outerR) / 2;
  return ((endAngle - startAngle) * Math.PI) / 180 * midR;
}

function getDisplayLabel(seg, arcPx) {
  if (seg.shortLabel) return seg.shortLabel;
  if (arcPx < 40) return null;
  if (seg.label.length > 13) return seg.label.slice(0, 12) + "\u2026";
  return seg.label;
}

/* Wraps the center-node project name to a maximum of two lines. Single short
   words (like "FlashFusion") return one line unchanged; longer names break on
   whitespace; a single word too long for either line is hard-truncated. */
function wrapCenterLabel(name, maxCharsPerLine) {
  const max = maxCharsPerLine || 14;
  const trimmed = (name || "").trim();
  if (trimmed.length <= max) return [trimmed];
  const words = trimmed.split(/\s+/);
  let line1 = "";
  let i = 0;
  while (i < words.length) {
    const candidate = (line1 + " " + words[i]).trim();
    if (candidate.length > max && line1) break;
    line1 = candidate;
    i += 1;
  }
  if (!line1) {
    return [trimmed.slice(0, max - 1) + "\u2026"];
  }
  const rest = words.slice(i).join(" ");
  if (!rest) return [line1];
  return [line1, rest.length > max ? rest.slice(0, max - 1) + "\u2026" : rest];
}

/* =====================================================================================
   SECTION 3 — CONFIG NORMALIZATION / VALIDATION
   Never throws for recoverable content problems; returns warnings instead.
===================================================================================== */

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeConfig(raw) {
  const warnings = [];
  const seenIds = new Set();

  function uniqueId(base, fallback) {
    let id = slugify(base) || fallback;
    let candidate = id;
    let n = 2;
    while (seenIds.has(candidate)) {
      candidate = `${id}-${n}`;
      n += 1;
    }
    seenIds.add(candidate);
    return candidate;
  }

  const rings = (raw.wheel?.rings || []).map((ring, ringIdx) => {
    let rawSegments = ring.segments && ring.segments.length > 0 ? ring.segments : null;
    if (!rawSegments) {
      warnings.push(`Ring "${ring.label || ring.id}" had no segments — a placeholder was inserted.`);
      rawSegments = [
        {
          label: "Example: configuration incomplete",
          status: "moderate",
          detail: "Example: this ring has no configured segments yet.",
        },
      ];
    }
    let limited = rawSegments;
    if (ring.id === "initiatives" && rawSegments.length > 8) {
      warnings.push(`Initiatives ring had ${rawSegments.length} segments; limited to 8.`);
      limited = rawSegments.slice(0, 8);
    }
    const segments = limited.map((seg, segIdx) => {
      let status = String(seg.status || "moderate").trim().toLowerCase();
      if (!VALID_STATUSES.has(status)) {
        warnings.push(`Segment "${seg.label}" had invalid status "${seg.status}"; defaulted to "moderate".`);
        status = "moderate";
      }
      return {
        id: uniqueId(seg.id || seg.label, `${ring.id || ringIdx}-${segIdx}`),
        label: (seg.label || "Untitled segment").trim(),
        shortLabel: seg.shortLabel ? seg.shortLabel.trim() : undefined,
        status,
        detail: (seg.detail || "").trim(),
        metric: seg.metric,
        owner: seg.owner,
        nextAction: seg.nextAction,
        tags: Array.isArray(seg.tags) ? Array.from(new Set(seg.tags.map((t) => t.trim()))) : [],
      };
    });
    return {
      id: ring.id || uniqueId(ring.label, `ring-${ringIdx}`),
      label: ring.label || `Ring ${ringIdx + 1}`,
      innerR: typeof ring.innerR === "number" ? ring.innerR : 65 + ringIdx * 40,
      outerR: typeof ring.outerR === "number" ? ring.outerR : 100 + ringIdx * 40,
      segments,
    };
  });

  if (rings.length === 0) {
    throw new Error("Growth OS: no rings configured — cannot construct wheel geometry.");
  }

  const activeTags = Array.from(new Set((raw.contextTags?.active || []).map((t) => t.trim())));
  const inactiveTags = Array.from(
    new Set((raw.contextTags?.inactive || []).map((t) => t.trim()).filter((t) => !activeTags.includes(t)))
  );

  return {
    config: {
      ...raw,
      wheel: { rings },
      contextTags: { active: activeTags, inactive: inactiveTags },
    },
    warnings,
  };
}

/* =====================================================================================
   SECTION 4 — PERSISTENCE
   Claude.ai artifacts do not support localStorage/sessionStorage (they fail at
   runtime in this environment). The recovered prompt specified localStorage; this
   uses the actually-supported window.storage bridge instead, same behavior:
   UI prefs persist, conversation never does. Every call is guarded — if the bridge
   is unavailable, the app continues silently with no persistence and no console spam.
===================================================================================== */

function storageKey(slug) {
  return `growth-os:${slug}:v1`;
}

async function loadUiPrefs(slug) {
  if (typeof window === "undefined" || !window.storage || typeof window.storage.get !== "function") {
    return null;
  }
  try {
    const result = await window.storage.get(storageKey(slug), false);
    if (!result || typeof result.value !== "string") return null;
    const parsed = JSON.parse(result.value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_err) {
    return null;
  }
}

async function saveUiPrefs(slug, prefs) {
  if (typeof window === "undefined" || !window.storage || typeof window.storage.set !== "function") {
    return;
  }
  try {
    await window.storage.set(storageKey(slug), JSON.stringify(prefs), false);
  } catch (_err) {
    /* Non-fatal: UI preferences simply won't persist this session. */
  }
}

/* =====================================================================================
   SECTION 5 — AI SYSTEM PROMPT BUILDER
   Wheel-derived sections are generated from config.wheel directly rather than
   hand-duplicated as a second prose block, so there's exactly one source of truth.
===================================================================================== */

function describeSegmentForPrompt(seg, ringLabel) {
  const parts = [`- ${seg.label} [${STATUS_TOKENS[seg.status].label}]: ${seg.detail || "No detail provided."}`];
  if (seg.metric) parts.push(`  Evidence/metric: ${seg.metric}`);
  if (seg.owner) parts.push(`  Owner: ${seg.owner}`);
  if (seg.nextAction) parts.push(`  Next action: ${seg.nextAction}`);
  return parts.join("\n");
}

function buildStrategySystemPrompt(config, activeTags, selectedSegment) {
  const ringById = Object.fromEntries(config.wheel.rings.map((r) => [r.id, r]));
  const section = (ringId, title) => {
    const ring = ringById[ringId];
    if (!ring || ring.segments.length === 0) return `${title}: not configured.`;
    return `${title}:\n${ring.segments.map((s) => describeSegmentForPrompt(s, ring.label)).join("\n")}`;
  };

  const lines = [
    config.assistant.identity,
    "",
    "RESPONSE RULES",
    ...config.assistant.responseRules.map((r) => `- ${r}`),
    "",
    section("target", "TARGET MARKET"),
    "",
    section("personas", "BUYER / USER PERSONAS"),
    "",
    section("insights", "CURRENT INSIGHTS"),
    "",
    section("impact", "CURRENT IMPACT"),
    "",
    section("initiatives", "ACTIVE INITIATIVES"),
    "",
    `ACTIVE CONTEXT TAGS: ${activeTags.length ? activeTags.join(", ") : "none selected"}`,
  ];

  if (selectedSegment) {
    lines.push(
      "",
      "SELECTED WHEEL SEGMENT (operator is currently focused on this)",
      `Ring: ${selectedSegment.ringLabel}`,
      `Label: ${selectedSegment.label}`,
      `Status: ${STATUS_TOKENS[selectedSegment.status].label}`,
      `Detail: ${selectedSegment.detail || "No detail provided."}`,
      selectedSegment.metric ? `Metric: ${selectedSegment.metric}` : null,
      selectedSegment.nextAction ? `Next action on file: ${selectedSegment.nextAction}` : null
    );
  }

  return lines.filter((l) => l !== null).join("\n");
}

/* =====================================================================================
   SECTION 6 — AI REQUEST (sendStrategyMessage)
   ---------------------------------------------------------------------------------
   EXPORTED-APPLICATION COMPATIBILITY
   Inside Claude.ai, this fetch to api.anthropic.com/v1/messages is served through
   the artifact runtime's built-in bridge — no API key is ever present in this file,
   and none should be added. If this component is ever exported and run as a
   standalone application OUTSIDE Claude.ai, that bridge does not exist: this call
   will fail (no proxy, no implicit auth). In that case, replace the fetch below
   with a call to a same-origin backend endpoint, e.g. POST /api/growth-strategy,
   that:
     - keeps the Anthropic API key server-side only, in an environment variable
     - authenticates the calling application user before forwarding the request
     - applies rate limits and request-size limits
     - validates the request body (system length, message count, content length)
       before forwarding anything to the model
   Never call api.anthropic.com directly from exported client-side code with a
   hard-coded key — that is the pattern this comment exists to prevent.
   ---------------------------------------------------------------------------------
*/
async function sendStrategyMessage({ systemPrompt, history, userText }) {
  try {
    const trimmedHistory = (history || []).slice(-20).map((m) => ({ role: m.role, content: m.content }));
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [...trimmedHistory, { role: "user", content: userText }],
      }),
    });

    if (!response.ok) {
      return { text: "", error: `Request failed (${response.status}).` };
    }

    const data = await response.json();
    const textBlocks = Array.isArray(data.content) ? data.content.filter((b) => b.type === "text").map((b) => b.text) : [];
    const text = textBlocks.join("\n").trim();

    if (!text) {
      return { text: "", error: "Empty response from the model." };
    }
    return { text };
  } catch (err) {
    return { text: "", error: err && err.message ? err.message : "Unknown request error." };
  }
}

/* =====================================================================================
   SECTION 7 — SMALL PRESENTATIONAL COMPONENTS
===================================================================================== */

function StatusBadge({ status, compact }) {
  const t = STATUS_TOKENS[status];
  return (
    <span className="status-badge" data-status={status}>
      <span className="status-badge__icon" aria-hidden="true">{t.icon}</span>
      <span className="status-badge__label">{compact ? t.abbr : t.label}</span>
    </span>
  );
}

function LegendItem({ status }) {
  const t = STATUS_TOKENS[status];
  return (
    <li className="legend-item" title={t.label} data-status={status}>
      <span className="legend-dot" aria-hidden="true" />
      <span className="legend-icon" aria-hidden="true">{t.icon}</span>
      <span className="legend-full">{t.label}</span>
      <span className="legend-abbr">{t.abbr}</span>
    </li>
  );
}

function SegmentTooltip({ segment, x, y, onUseInChat }) {
  if (!segment) return null;
  const t = STATUS_TOKENS[segment.status];
  return (
    <div className="tooltip" style={{ left: x, top: y }} role="tooltip">
      <div className="tooltip__ring">{segment.ringLabel}</div>
      <div className="tooltip__title">{segment.label}</div>
      <StatusBadge status={segment.status} />
      <p className="tooltip__detail">{segment.detail}</p>
      {segment.metric && <div className="tooltip__meta">Metric: {segment.metric}</div>}
      {segment.nextAction && <div className="tooltip__meta">Next: {segment.nextAction}</div>}
      <button type="button" className="btn-ghost-sm" onClick={() => onUseInChat(segment)}>
        Use in strategy chat
      </button>
    </div>
  );
}

function InspectionCard({ segment, inAiContext, onAsk, onToggleContext, onClear }) {
  if (!segment) return null;
  return (
    <div className="inspection-card" role="region" aria-label="Selected segment details">
      <div className="inspection-card__header">
        <span className="inspection-card__ring">{segment.ringLabel}</span>
        <button type="button" className="icon-btn" onClick={onClear} aria-label="Clear selection">
          &times;
        </button>
      </div>
      <h3 className="inspection-card__title">{segment.label}</h3>
      <StatusBadge status={segment.status} />
      <p className="inspection-card__detail">{segment.detail}</p>
      <dl className="inspection-card__meta">
        {segment.metric && (<><dt>Metric</dt><dd>{segment.metric}</dd></>)}
        {segment.owner && (<><dt>Owner</dt><dd>{segment.owner}</dd></>)}
        {segment.nextAction && (<><dt>Next action</dt><dd>{segment.nextAction}</dd></>)}
      </dl>
      {segment.tags && segment.tags.length > 0 && (
        <div className="inspection-card__tags">
          {segment.tags.map((tag) => (
            <span className="mini-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}
      <div className="inspection-card__actions">
        <button type="button" className="btn-primary-sm" onClick={() => onAsk(segment)}>
          Ask Claude about this
        </button>
        <button type="button" className="btn-ghost-sm" onClick={() => onToggleContext(segment)}>
          {inAiContext ? "Remove from AI context" : "Add to AI context"}
        </button>
      </div>
    </div>
  );
}

function renderMessageContent(text) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i}>
      {para.split("\n").map((line, j, arr) => (
        <React.Fragment key={j}>
          {line}
          {j < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  ));
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`message-row ${isUser ? "message-row--user" : "message-row--assistant"}`}>
      <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--assistant"}`}>
        {renderMessageContent(message.content)}
      </div>
    </div>
  );
}

function ActivityIndicator({ stage }) {
  return (
    <div className="activity-indicator" role="status" aria-label="Claude is preparing a response">
      {ACTIVITY_STAGES.map((label, i) => {
        const idx = i + 1;
        const state = idx < stage ? "done" : idx === stage ? "active" : "pending";
        return (
          <div className={`activity-stage activity-stage--${state}`} key={label}>
            <span className="activity-stage__marker" aria-hidden="true">
              {state === "done" ? "\u2713" : state === "active" ? <span className="spinner" /> : ""}
            </span>
            <span className="activity-stage__label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ContextTagPill({ tag, active, onToggle }) {
  return (
    <button
      type="button"
      className={`context-tag ${active ? "context-tag--active" : "context-tag--inactive"}`}
      aria-pressed={active}
      onClick={() => onToggle(tag)}
    >
      <span className="context-tag__marker" aria-hidden="true">{active ? "\u2713" : "+"}</span>
      {tag}
    </button>
  );
}

function SuggestedQuestionButton({ question, onSelect }) {
  return (
    <button type="button" className="suggested-question" onClick={() => onSelect(question)}>
      {question}
    </button>
  );
}

/* =====================================================================================
   SECTION 8 — MAIN APP COMPONENT
===================================================================================== */

export default function GrowthOS() {
  const { config: normalizedConfig, warnings: configWarnings } = useMemo(() => normalizeConfig(CONFIG), []);
  const behavior = normalizedConfig.behavior;

  const [panelOpen, setPanelOpen] = useState(true);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [activeTags, setActiveTags] = useState(normalizedConfig.contextTags.active);
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [segmentInAiContext, setSegmentInAiContext] = useState(false);
  const [hoveredSegmentId, setHoveredSegmentId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadStage, setLoadStage] = useState(0);
  const [requestError, setRequestError] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [ariaLiveMsg, setAriaLiveMsg] = useState("");
  const [viewportWidth, setViewportWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [warningsOpen, setWarningsOpen] = useState(false);

  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  const textareaRef = useRef(null);
  const messageListRef = useRef(null);
  const reopenBtnRef = useRef(null);
  const activityTimeoutsRef = useRef([]);

  const isMobile = viewportWidth < 760;

  /* ---------- geometry ---------- */
  const ringGeometry = useMemo(() => {
    return normalizedConfig.wheel.rings.map((ring) => {
      const angles = calculateSegmentAngles(ring.segments.length);
      const segments = ring.segments.map((seg, i) => {
        const { start, end } = angles[i];
        const arcPx = arcLengthPx(ring.innerR, ring.outerR, start, end);
        return {
          ...seg,
          ringId: ring.id,
          ringLabel: ring.label,
          startAngle: start,
          endAngle: end,
          path: describeDonutSegment(CENTER, CENTER, ring.innerR, ring.outerR, start, end),
          centroid: getSegmentCentroid(CENTER, CENTER, ring.innerR, ring.outerR, start, end),
          displayLabel: getDisplayLabel(seg, arcPx),
        };
      });
      return { ...ring, segments };
    });
  }, [normalizedConfig]);

  const segmentLookup = useMemo(() => {
    const map = new Map();
    ringGeometry.forEach((ring) => ring.segments.forEach((seg) => map.set(seg.id, seg)));
    return map;
  }, [ringGeometry]);

  const selectedSegment = selectedSegmentId ? segmentLookup.get(selectedSegmentId) || null : null;
  const hoveredSegment = hoveredSegmentId ? segmentLookup.get(hoveredSegmentId) || null : null;

  const systemPrompt = useMemo(
    () => buildStrategySystemPrompt(normalizedConfig, activeTags, segmentInAiContext ? selectedSegment : null),
    [normalizedConfig, activeTags, segmentInAiContext, selectedSegment]
  );

  const statusCounts = useMemo(() => {
    const counts = { good: 0, moderate: 0, poor: 0, critical: 0 };
    ringGeometry.forEach((ring) => ring.segments.forEach((s) => { counts[s.status] += 1; }));
    return counts;
  }, [ringGeometry]);

  /* ---------- load persisted UI prefs on mount ---------- */
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    (async () => {
      if (!behavior.persistUiPreferences) {
        setPrefsLoaded(true);
        return;
      }
      const prefs = await loadUiPrefs(normalizedConfig.project.slug);
      if (cancelled || !mountedRef.current) return;
      if (prefs) {
        if (typeof prefs.panelOpen === "boolean") setPanelOpen(prefs.panelOpen);
        if (Array.isArray(prefs.activeTags)) setActiveTags(prefs.activeTags);
      }
      setPrefsLoaded(true);
    })();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- persist UI prefs on change ---------- */
  useEffect(() => {
    if (!prefsLoaded || !behavior.persistUiPreferences) return;
    saveUiPrefs(normalizedConfig.project.slug, { panelOpen, activeTags });
  }, [panelOpen, activeTags, prefsLoaded, behavior.persistUiPreferences, normalizedConfig.project.slug]);

  /* ---------- responsive viewport tracking ---------- */
  useEffect(() => {
    let raf = null;
    function handleResize() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setViewportWidth(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- global escape handling ---------- */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "Escape") return;
      if (isMobile && panelOpen) {
        setPanelOpen(false);
        reopenBtnRef.current && reopenBtnRef.current.focus();
        return;
      }
      if (selectedSegmentId) {
        setSelectedSegmentId(null);
        setSegmentInAiContext(false);
        setAriaLiveMsg("Selection cleared.");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, panelOpen, selectedSegmentId]);

  /* ---------- activity stage animation ---------- */
  useEffect(() => {
    activityTimeoutsRef.current.forEach(clearTimeout);
    activityTimeoutsRef.current = [];
    if (!isLoading) {
      setLoadStage(0);
      return;
    }
    setLoadStage(1);
    for (let stage = 2; stage <= ACTIVITY_STAGES.length; stage += 1) {
      const t = setTimeout(() => {
        if (mountedRef.current) setLoadStage(stage);
      }, (stage - 1) * 520);
      activityTimeoutsRef.current.push(t);
    }
    return () => activityTimeoutsRef.current.forEach(clearTimeout);
  }, [isLoading]);

  /* ---------- scroll to latest ---------- */
  useEffect(() => {
    if (!stickToBottom || !messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages.length, stickToBottom]);

  function handleMessageListScroll() {
    const el = messageListRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setStickToBottom(distanceFromBottom < 80);
  }

  /* ---------- interaction handlers ---------- */
  const selectSegment = useCallback(
    (seg) => {
      if (!seg) {
        setSelectedSegmentId(null);
        setSegmentInAiContext(false);
        setAriaLiveMsg("Selection cleared.");
        return;
      }
      setSelectedSegmentId(seg.id);
      if (behavior.includeSelectedSegmentInAiContext) setSegmentInAiContext(true);
      setAriaLiveMsg(`Selected ${seg.ringLabel} segment: ${seg.label}, status ${STATUS_TOKENS[seg.status].label}.`);
    },
    [behavior.includeSelectedSegmentInAiContext]
  );

  const handleSegmentKeyDown = useCallback(
    (e, seg) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSegment(seg);
      }
    },
    [selectSegment]
  );

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) => {
      const isActive = prev.includes(tag);
      const next = isActive ? prev.filter((t) => t !== tag) : [...prev, tag];
      setAriaLiveMsg(`${tag} ${isActive ? "removed from" : "added to"} strategy context.`);
      return next;
    });
  }, []);

  const historyForApi = useCallback((allMessages) => allMessages.map((m) => ({ role: m.role, content: m.content })), []);

  const runStrategyRequest = useCallback(
    async (text, historySoFar) => {
      setIsLoading(true);
      setRequestError(null);
      const myRequestId = ++requestIdRef.current;
      const result = await sendStrategyMessage({
        systemPrompt,
        history: historyForApi(historySoFar),
        userText: text,
      });
      if (!mountedRef.current || myRequestId !== requestIdRef.current) return;
      setIsLoading(false);
      if (result.error) {
        setRequestError({ message: result.error, retryText: text, retryHistory: historySoFar });
        return;
      }
      setMessages((prev) =>
        [...prev, { id: `a-${Date.now()}`, role: "assistant", content: result.text, createdAt: new Date().toISOString() }].slice(
          -behavior.maxVisibleMessages
        )
      );
    },
    [systemPrompt, historyForApi, behavior.maxVisibleMessages]
  );

  const submitDraft = useCallback(
    (textOverride) => {
      const text = (textOverride !== undefined ? textOverride : draft).trim();
      if (!text || isLoading) return;
      const userMsg = { id: `u-${Date.now()}`, role: "user", content: text, createdAt: new Date().toISOString() };
      const nextMessages = [...messages, userMsg].slice(-behavior.maxVisibleMessages);
      setMessages(nextMessages);
      setDraft("");
      setStickToBottom(true);
      runStrategyRequest(text, messages.concat([userMsg]));
    },
    [draft, isLoading, messages, behavior.maxVisibleMessages, runStrategyRequest]
  );

  const handleRetry = useCallback(() => {
    if (!requestError) return;
    const { retryText, retryHistory } = requestError;
    setRequestError(null);
    runStrategyRequest(retryText, retryHistory);
  }, [requestError, runStrategyRequest]);

  const handleComposerKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitDraft();
      }
    },
    [submitDraft]
  );

  const handleResetConversation = useCallback(() => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setMessages([]);
    setRequestError(null);
    setShowResetConfirm(false);
    textareaRef.current && textareaRef.current.focus();
  }, [showResetConfirm]);

  const askAboutSegment = useCallback(
    (seg) => {
      selectSegment(seg);
      setPanelOpen(true);
      setTimeout(() => textareaRef.current && textareaRef.current.focus(), 50);
    },
    [selectSegment]
  );

  const toggleSegmentInContext = useCallback(
    (seg) => {
      setSegmentInAiContext((prev) => !prev);
      setAriaLiveMsg(`${seg.label} ${segmentInAiContext ? "removed from" : "added to"} AI context.`);
    },
    [segmentInAiContext]
  );

  function handleSegmentMouseEnter(seg, e) {
    if (isMobile) return;
    setHoveredSegmentId(seg.id);
    setTooltipPos(clampTooltipPosition(e.clientX, e.clientY));
  }
  function handleSegmentMouseMove(e) {
    if (isMobile || !hoveredSegmentId) return;
    setTooltipPos(clampTooltipPosition(e.clientX, e.clientY));
  }
  function handleSegmentMouseLeave() {
    setHoveredSegmentId(null);
  }
  function clampTooltipPosition(px, py) {
    const tooltipWidth = 260;
    const tooltipHeight = 180;
    const x = Math.max(12, Math.min(px + 16, window.innerWidth - tooltipWidth - 12));
    const y = Math.max(12, Math.min(py + 16, window.innerHeight - tooltipHeight - 12));
    return { x, y };
  }

  const showSuggestions = messages.length === 0;
  const srSummary = `Growth wheel summary: ${statusCounts.critical} critical, ${statusCounts.poor} poor, ${statusCounts.moderate} moderate, ${statusCounts.good} good, across ${ringGeometry.length} rings.`;

  const centerLines = wrapCenterLabel(normalizedConfig.project.name, 14);
  const centerLineHeight = 16;
  const centerProjectY0 = centerLines.length === 1 ? CENTER - 6 : CENTER - 14;
  const centerSubtitleY = centerProjectY0 + (centerLines.length - 1) * centerLineHeight + 22;

  return (
    <div className="growth-os" data-mobile={isMobile ? "true" : "false"}>
      <style>{CSS}</style>

      <div aria-live="polite" className="sr-only">{ariaLiveMsg}</div>
      <p className="sr-only">{srSummary}</p>
      <ul className="sr-only">
        {ringGeometry.map((ring) => (
          <li key={ring.id}>
            {ring.label} ring:
            <ul>
              {ring.segments.map((seg) => (
                <li key={seg.id}>
                  {seg.label} — status {STATUS_TOKENS[seg.status].label}. {seg.detail}
                  {seg.metric ? ` Metric: ${seg.metric}.` : ""}
                  {seg.nextAction ? ` Next action: ${seg.nextAction}.` : ""}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* ---------------- Topbar ---------------- */}
      <header className="topbar">
        <div className="topbar__left">
          <span className="logo">
            <span aria-hidden="true">&#9889;</span> {normalizedConfig.project.name}
          </span>
          <span className="badge">{normalizedConfig.branding.badgeText}</span>
          <span className="context-meta">
            {activeTags[0] || "Strategy"} &middot; <time dateTime="2026-07">{normalizedConfig.operator.period}</time>
          </span>
          {configWarnings.length > 0 && (
            <button type="button" className="config-warning-badge" onClick={() => setWarningsOpen((v) => !v)}>
              Configuration incomplete ({configWarnings.length})
            </button>
          )}
        </div>
        <ul className="legend" aria-label="Status legend">
          {["good", "moderate", "poor", "critical"].map((s) => (
            <LegendItem key={s} status={s} />
          ))}
        </ul>
      </header>

      {warningsOpen && configWarnings.length > 0 && (
        <div className="warnings-panel" role="status">
          <ul>
            {configWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- Main workspace ---------------- */}
      <main className="workspace">
        <section className="wheel-workspace" aria-label="Strategy wheel">
          <div className="wheel-frame">
            <svg
              viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
              preserveAspectRatio="xMidYMid meet"
              className="wheel-svg"
              role="img"
              aria-label={`${normalizedConfig.project.name} growth strategy wheel with ${ringGeometry.length} rings`}
            >
              <title>{normalizedConfig.project.name} Growth Strategy Wheel</title>
              <desc>
                A radial diagram with rings for Target, Personas, Insights, Impact, and Initiatives. Each segment
                shows a status of good, moderate, poor, or critical. Full detail is available in the screen-reader
                summary above this diagram and in the on-screen inspection card when a segment is selected.
              </desc>

              {ringGeometry.map((ring) => {
                const labelPos = polarToCartesian(CENTER, CENTER, ring.outerR - 12, 0);
                return (
                  <g key={ring.id}>
                    <text x={labelPos.x} y={labelPos.y} textAnchor="middle" className="ring-guide-label" pointerEvents="none">
                      {ring.label}
                    </text>
                    {ring.segments.map((seg) => {
                      const isSelected = seg.id === selectedSegmentId;
                      const isHovered = seg.id === hoveredSegmentId;
                      return (
                        <g
                          key={seg.id}
                          className={`segment ${isSelected ? "segment--selected" : ""} ${isHovered ? "segment--hovered" : ""}`}
                          data-status={seg.status}
                          role="button"
                          tabIndex={0}
                          aria-label={`${ring.label}: ${seg.label}. Status: ${STATUS_TOKENS[seg.status].label}. ${seg.detail}`}
                          aria-pressed={isSelected}
                          onClick={() => selectSegment(seg)}
                          onKeyDown={(e) => handleSegmentKeyDown(e, seg)}
                          onMouseEnter={(e) => handleSegmentMouseEnter(seg, e)}
                          onMouseMove={handleSegmentMouseMove}
                          onMouseLeave={handleSegmentMouseLeave}
                        >
                          <path d={seg.path} className="segment__path" />
                          {seg.displayLabel && (
                            <text x={seg.centroid.x} y={seg.centroid.y - 4} textAnchor="middle" className="segment__label">
                              {seg.displayLabel}
                            </text>
                          )}
                          <circle
                            cx={seg.centroid.x}
                            cy={seg.centroid.y + (seg.displayLabel ? 10 : 0)}
                            r="7"
                            className="segment__status-dot"
                          />
                          <text
                            x={seg.centroid.x}
                            y={seg.centroid.y + (seg.displayLabel ? 13 : 3)}
                            textAnchor="middle"
                            className="segment__status-icon"
                            pointerEvents="none"
                          >
                            {STATUS_TOKENS[seg.status].icon}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              <g
                role="button"
                tabIndex={0}
                aria-label={`Clear selection. ${normalizedConfig.project.name} Growth OS center.`}
                onClick={() => selectSegment(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectSegment(null); }
                }}
                className="center-node"
              >
                <circle cx={CENTER} cy={CENTER} r="60" className="center-node__outer" />
                <circle cx={CENTER} cy={CENTER} r="50" className="center-node__inner" />
                {centerLines.map((line, i) => (
                  <text
                    key={i}
                    x={CENTER}
                    y={centerProjectY0 + i * centerLineHeight}
                    textAnchor="middle"
                    className="center-node__project"
                  >
                    {line}
                  </text>
                ))}
                <text x={CENTER} y={centerSubtitleY} textAnchor="middle" className="center-node__subtitle">
                  Growth OS
                </text>
              </g>
            </svg>
          </div>

          {!isMobile && hoveredSegment && !selectedSegmentId && (
            <SegmentTooltip segment={hoveredSegment} x={tooltipPos.x} y={tooltipPos.y} onUseInChat={askAboutSegment} />
          )}

          {behavior.showInspectionCard && selectedSegment && (
            <InspectionCard
              segment={selectedSegment}
              inAiContext={segmentInAiContext}
              onAsk={askAboutSegment}
              onToggleContext={toggleSegmentInContext}
              onClear={() => selectSegment(null)}
            />
          )}
        </section>

        {/* ---------------- AI Strategy Panel ---------------- */}
        {isMobile && panelOpen && <div className="drawer-backdrop" onClick={() => setPanelOpen(false)} />}
        <aside
          className={`ai-panel ${panelOpen ? "ai-panel--open" : "ai-panel--closed"}`}
          aria-hidden={!panelOpen}
        >
          <div className="ai-panel__header">
            <div>
              <span className="ai-panel__spark" aria-hidden="true">&#10022;</span>
              <h2 className="ai-panel__heading">
                Let&rsquo;s ship your<br />growth strategy.
              </h2>
              <p className="ai-panel__subtitle">
                {activeTags[0] || "Strategy"} &middot; {normalizedConfig.operator.period}
              </p>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPanelOpen(false)}
              aria-label="Close AI strategy panel"
              aria-expanded={panelOpen}
            >
              &rsaquo;
            </button>
          </div>

          <div className="ai-panel__body" ref={messageListRef} onScroll={handleMessageListScroll}>
            {showSuggestions && (
              <div className="empty-state">
                <p className="empty-state__intro">
                  This assistant knows {normalizedConfig.project.name}&rsquo;s current wheel: targets, personas,
                  evidence, impact, and initiatives &mdash; including whatever&rsquo;s selected on the wheel right now.
                </p>
                {activeTags.length > 0 && (
                  <p className="empty-state__context">Active context: {activeTags.join(", ")}</p>
                )}
                {selectedSegment && (
                  <p className="empty-state__context">Selected: {selectedSegment.label}</p>
                )}
                <div className="suggested-questions">
                  {normalizedConfig.suggestedQuestions.map((q) => (
                    <SuggestedQuestionButton
                      key={q}
                      question={q}
                      onSelect={(text) =>
                        behavior.submitSuggestionImmediately ? submitDraft(text) : setDraft(text)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isLoading && <ActivityIndicator stage={loadStage} />}

            {requestError && (
              <div className="error-card" role="alert">
                <p>Claude couldn&rsquo;t complete that strategy request. Your context and draft are still here.</p>
                <div className="error-card__actions">
                  <button type="button" className="btn-primary-sm" onClick={handleRetry}>Retry</button>
                  <button type="button" className="btn-ghost-sm" onClick={() => setRequestError(null)}>Dismiss</button>
                </div>
              </div>
            )}
          </div>

          {!stickToBottom && messages.length > 0 && (
            <button
              type="button"
              className="jump-to-latest"
              onClick={() => { setStickToBottom(true); messageListRef.current && (messageListRef.current.scrollTop = messageListRef.current.scrollHeight); }}
            >
              Jump to latest
            </button>
          )}

          <div className="context-tags" role="group" aria-label="Strategy context tags">
            {[...normalizedConfig.contextTags.active, ...normalizedConfig.contextTags.inactive]
              .filter((t, i, arr) => arr.indexOf(t) === i)
              .map((tag) => (
                <ContextTagPill key={tag} tag={tag} active={activeTags.includes(tag)} onToggle={toggleTag} />
              ))}
            {selectedSegment && (
              <span className="context-tag context-tag--segment">
                Segment: {selectedSegment.label}
              </span>
            )}
          </div>

          <div className="composer">
            <textarea
              ref={textareaRef}
              className="composer__textarea"
              value={draft}
              maxLength={behavior.maxInputCharacters}
              placeholder="Ask about the strategy..."
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleComposerKeyDown}
              disabled={isLoading}
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
              }}
            />
            {draft.length > 3200 && (
              <span className="char-count">{draft.length}/{behavior.maxInputCharacters}</span>
            )}
            <div className="composer__row">
              <button
                type="button"
                className={`btn-ghost-sm ${showResetConfirm ? "btn-ghost-sm--confirm" : ""}`}
                onClick={handleResetConversation}
                onBlur={() => setShowResetConfirm(false)}
              >
                {showResetConfirm ? "Confirm reset?" : "Reset conversation"}
              </button>
              <button
                type="button"
                className="send-btn"
                aria-label="Send strategy message"
                disabled={isLoading || draft.trim().length === 0}
                onClick={() => submitDraft()}
              >
                Send
              </button>
            </div>
          </div>
          <div className="ai-panel__footer">{normalizedConfig.branding.aiFooter}</div>
        </aside>

        {!panelOpen && (
          <button
            type="button"
            ref={reopenBtnRef}
            className="reopen-control"
            onClick={() => setPanelOpen(true)}
            aria-label="Open AI strategy panel"
          >
            <span aria-hidden="true">&#10022;</span> AI Strategy
          </button>
        )}
      </main>
    </div>
  );
}

/* =====================================================================================
   SECTION 9 — STYLES
   FlashFusion v3 identity: #0B0B14 / #13131F surfaces, violet #A855F7, magenta
   #EC4899, cyan #22D3EE, 135deg gradient, Geist / Geist Mono, Poppins reserved for
   the logo wordmark only, per the current locked brand profile.
===================================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400;500;600&display=swap');

.growth-os {
  --bg: #0B0B14;
  --surface-1: #13131F;
  --surface-2: rgba(19,19,31,0.72);
  --surface-3: rgba(255,255,255,0.03);
  --border-soft: rgba(139,92,246,0.12);
  --border-strong: rgba(139,92,246,0.35);
  --violet: #A855F7;
  --magenta: #EC4899;
  --cyan: #22D3EE;
  --gradient-accent: linear-gradient(135deg, #A855F7, #EC4899, #22D3EE);
  --text-primary: #FFFFFF;
  --text-secondary: #C7C7D1;
  --text-muted: #8A8A96;
  --text-faint: rgba(138,138,150,0.6);
  --font-logo: 'Poppins', sans-serif;
  --font-heading: 'Instrument Serif', Georgia, serif;
  --font-body: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'Courier New', monospace;

  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  background: var(--bg);
  background-image: radial-gradient(circle at 50% 40%, rgba(168,85,247,0.06), transparent 60%);
  color: var(--text-primary);
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}
.growth-os *, .growth-os *::before, .growth-os *::after { box-sizing: inherit; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ---------- scrollbars ---------- */
.growth-os ::-webkit-scrollbar { width: 4px; }
.growth-os ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 999px; }

/* ---------- focus ---------- */
.growth-os button:focus-visible,
.growth-os textarea:focus-visible,
.growth-os [role="button"]:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ---------- topbar ---------- */
.topbar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 12px; padding: 10px 20px; min-height: 46px;
  background: rgba(11,11,20,0.85); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}
.topbar__left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.logo {
  font-family: var(--font-logo); font-weight: 800; font-size: 18px;
  background: var(--gradient-accent); -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; letter-spacing: -0.01em;
}
.badge {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);
  border: 1px solid var(--border-strong); border-radius: 999px; padding: 3px 10px;
  background: rgba(168,85,247,0.08);
}
.context-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
.config-warning-badge {
  font-family: var(--font-mono); font-size: 10px; color: #fde68a;
  background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.35);
  border-radius: 999px; padding: 3px 10px; cursor: pointer;
}
.warnings-panel {
  padding: 10px 20px; background: rgba(251,191,36,0.08);
  border-bottom: 1px solid rgba(251,191,36,0.25); font-size: 12px; color: #fde68a;
}
.warnings-panel ul { margin: 0; padding-left: 18px; }

.legend { list-style: none; display: flex; gap: 14px; margin: 0; padding: 0; }
.legend-item { display: flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--status-accent, var(--violet)); }
[data-status="good"] { --status-accent: #4ade80; }
[data-status="moderate"] { --status-accent: #fbbf24; }
[data-status="poor"] { --status-accent: #f87171; }
[data-status="critical"] { --status-accent: #dc2626; }
.legend-icon { font-size: 10px; color: var(--status-accent); }
.legend-abbr { display: none; }

/* ---------- workspace layout ---------- */
.workspace { flex: 1; display: flex; min-height: 0; position: relative; }
.wheel-workspace {
  flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
  padding: 16px; min-width: 0;
}
.wheel-frame { width: min(100%, 640px); aspect-ratio: 1 / 1; }
.wheel-svg { width: 100%; height: 100%; display: block; }

/* ---------- wheel segments ---------- */
.ring-guide-label {
  font-family: var(--font-mono); font-size: 9px; fill: var(--text-faint);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.segment { cursor: pointer; transition: transform 160ms ease; transform-box: fill-box; transform-origin: center; }
.segment__path {
  fill: var(--status-fill); stroke: var(--status-accent); stroke-width: 1.5;
  transition: filter 160ms ease, stroke-width 160ms ease;
}
[data-status="good"] .segment__path { --status-fill: rgba(74,222,128,0.12); --status-accent: #4ade80; }
[data-status="moderate"] .segment__path { --status-fill: rgba(251,191,36,0.12); --status-accent: #fbbf24; }
[data-status="poor"] .segment__path { --status-fill: rgba(248,113,113,0.14); --status-accent: #f87171; }
[data-status="critical"] .segment__path { --status-fill: rgba(220,38,38,0.18); --status-accent: #dc2626; }
.segment:hover .segment__path, .segment--hovered .segment__path { filter: brightness(1.25); stroke-width: 2; }
.segment--selected .segment__path { stroke-width: 2.5; filter: brightness(1.3); }
.segment__label {
  font-family: var(--font-mono); font-size: 9.5px; fill: var(--text-primary);
  pointer-events: none;
}
.segment__status-dot { fill: rgba(0,0,0,0.35); stroke: currentColor; pointer-events: none; }
.segment__status-icon { font-size: 8px; fill: var(--text-primary); font-family: var(--font-mono); pointer-events: none; }

.center-node { cursor: pointer; }
.center-node__outer { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1.5; }
.center-node__inner { fill: rgba(255,255,255,0.02); stroke: var(--border-soft); }
.center-node__project { font-family: var(--font-logo); font-weight: 800; font-size: 15px; fill: var(--text-primary); }
.center-node__subtitle { font-family: var(--font-mono); font-size: 9px; fill: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; }

/* ---------- tooltip ---------- */
.tooltip {
  position: fixed; z-index: 50; width: 260px;
  background: var(--surface-2); backdrop-filter: blur(12px);
  border: 1px solid var(--border-strong); border-radius: 12px; padding: 12px 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6); font-size: 12.5px;
}
.tooltip__ring { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.tooltip__title { font-family: var(--font-heading); font-size: 15px; margin: 2px 0 6px; }
.tooltip__detail { color: var(--text-secondary); margin: 6px 0; line-height: 1.4; }
.tooltip__meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 2px; }

/* ---------- status badge ---------- */
.status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; }
[data-status="good"].status-badge { background: rgba(74,222,128,0.12); color: #bbf7d0; }
[data-status="moderate"].status-badge { background: rgba(251,191,36,0.12); color: #fde68a; }
[data-status="poor"].status-badge { background: rgba(248,113,113,0.14); color: #fecaca; }
[data-status="critical"].status-badge { background: rgba(220,38,38,0.18); color: #fda4af; }

/* ---------- inspection card ---------- */
.inspection-card {
  position: absolute; bottom: 16px; left: 16px; width: 280px; max-width: calc(100% - 32px);
  background: var(--surface-2); backdrop-filter: blur(14px); border: 1px solid var(--border-strong);
  border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.inspection-card__header { display: flex; justify-content: space-between; align-items: center; }
.inspection-card__ring { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.inspection-card__title { font-family: var(--font-heading); font-size: 17px; margin: 4px 0 8px; }
.inspection-card__detail { color: var(--text-secondary); font-size: 13px; line-height: 1.45; margin: 8px 0; }
.inspection-card__meta { display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; font-size: 12px; margin: 8px 0; }
.inspection-card__meta dt { color: var(--text-muted); font-family: var(--font-mono); }
.inspection-card__meta dd { margin: 0; color: var(--text-secondary); }
.inspection-card__tags { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0; }
.mini-tag { font-family: var(--font-mono); font-size: 10px; background: rgba(168,85,247,0.1); border: 1px solid var(--border-soft); border-radius: 999px; padding: 2px 8px; color: var(--text-secondary); }
.inspection-card__actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }

/* ---------- buttons ---------- */
.icon-btn {
  background: transparent; border: 1px solid var(--border-soft); color: var(--text-secondary);
  border-radius: 8px; width: 32px; height: 32px; font-size: 16px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.icon-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
.btn-primary-sm, .send-btn {
  font-family: var(--font-mono); font-size: 12px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.04em; border: none; border-radius: 999px; padding: 8px 16px;
  background: var(--gradient-accent); color: #fff; cursor: pointer; transition: opacity 150ms ease;
}
.btn-primary-sm:hover, .send-btn:hover:not(:disabled) { opacity: 0.9; }
.send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-ghost-sm {
  font-family: var(--font-mono); font-size: 12px; border: 1px solid var(--border-soft);
  background: transparent; color: var(--text-secondary); border-radius: 999px; padding: 7px 14px; cursor: pointer;
}
.btn-ghost-sm:hover { border-color: var(--border-strong); color: var(--text-primary); }
.btn-ghost-sm--confirm { border-color: #dc2626; color: #fda4af; }

/* ---------- AI panel ---------- */
.ai-panel {
  width: 400px; flex-shrink: 0; display: flex; flex-direction: column;
  background: rgba(19,19,31,0.85); backdrop-filter: blur(16px);
  border-left: 1px solid var(--border-soft);
  transition: width 220ms ease, opacity 220ms ease;
  overflow: hidden;
}
.ai-panel--closed { width: 0; opacity: 0; pointer-events: none; }
.ai-panel__header { display: flex; justify-content: space-between; align-items: flex-start; padding: 18px 18px 12px; gap: 8px; }
.ai-panel__spark {
  display: inline-block; margin-bottom: 6px; font-size: 16px;
  background: var(--gradient-accent); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.ai-panel__heading { font-family: var(--font-heading); font-size: 20px; line-height: 1.2; margin: 0; font-weight: 400; }
.ai-panel__subtitle { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin: 6px 0 0; }
.ai-panel__body { flex: 1; overflow-y: auto; padding: 4px 18px; min-height: 0; }
.ai-panel__footer { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); text-align: center; padding: 8px 0 12px; }

.empty-state__intro { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
.empty-state__context { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
.suggested-questions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.suggested-question {
  text-align: left; background: var(--surface-3); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 12px; color: var(--text-secondary); font-size: 12.5px;
  cursor: pointer; transition: border-color 150ms ease, color 150ms ease;
}
.suggested-question:hover { border-color: var(--border-strong); color: var(--text-primary); }

.message-row { display: flex; margin: 10px 0; }
.message-row--user { justify-content: flex-end; }
.message-row--assistant { justify-content: flex-start; }
.message-bubble { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
.message-bubble p { margin: 0 0 8px; }
.message-bubble p:last-child { margin-bottom: 0; }
.message-bubble--user { background: rgba(168,85,247,0.16); border: 1px solid var(--border-soft); color: var(--text-primary); }
.message-bubble--assistant { background: var(--surface-3); border: 1px solid var(--border-soft); color: var(--text-secondary); }

.activity-indicator { display: flex; flex-direction: column; gap: 6px; margin: 10px 0; padding: 10px 12px; background: var(--surface-3); border-radius: 10px; }
.activity-stage { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-faint); }
.activity-stage--done { color: #4ade80; }
.activity-stage--active { color: var(--text-primary); }
.activity-stage__marker { width: 14px; display: inline-flex; justify-content: center; }
.spinner {
  width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(168,85,247,0.25);
  border-top-color: var(--violet); animation: spin 800ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-card { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.35); border-radius: 10px; padding: 12px; margin: 10px 0; font-size: 12.5px; color: #fda4af; }
.error-card__actions { display: flex; gap: 8px; margin-top: 8px; }

.jump-to-latest {
  align-self: center; margin: 6px auto; font-family: var(--font-mono); font-size: 11px;
  background: var(--surface-2); border: 1px solid var(--border-strong); color: var(--text-secondary);
  border-radius: 999px; padding: 5px 12px; cursor: pointer;
}

.context-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 18px; border-top: 1px solid var(--border-soft); }
.context-tag {
  font-family: var(--font-mono); font-size: 11px; border-radius: 999px; padding: 5px 10px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
}
.context-tag--active { background: rgba(168,85,247,0.18); border: 1px solid var(--border-strong); color: var(--text-primary); }
.context-tag--inactive { background: transparent; border: 1px dashed var(--border-soft); color: var(--text-muted); }
.context-tag--segment { background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.3); color: #a5f3fc; cursor: default; }

.composer { padding: 10px 18px 4px; }
.composer__textarea {
  width: 100%; min-height: 38px; max-height: 96px; resize: none; background: rgba(11,11,20,0.6);
  border: 1px solid var(--border-soft); border-radius: 10px; padding: 9px 12px; color: var(--text-primary);
  font-family: var(--font-body); font-size: 13px; line-height: 1.4;
}
.composer__textarea:focus { outline: none; border-color: var(--violet); box-shadow: 0 0 0 3px rgba(168,85,247,0.15); }
.char-count { display: block; text-align: right; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-top: 2px; }
.composer__row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }

/* ---------- reopen control ---------- */
.reopen-control {
  position: fixed; bottom: calc(18px + env(safe-area-inset-bottom)); right: 18px; z-index: 40;
  font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: #fff;
  background: var(--gradient-accent); border: none; border-radius: 999px; padding: 11px 18px;
  box-shadow: 0 6px 20px rgba(168,85,247,0.4); cursor: pointer; display: inline-flex; gap: 6px; align-items: center;
}

/* ---------- responsive ---------- */
@media (min-width: 1100px) {
  .workspace { flex-direction: row; }
}
@media (min-width: 760px) and (max-width: 1099px) {
  .workspace { flex-direction: row; }
  .ai-panel { width: clamp(340px, 38vw, 390px); }
  .ai-panel--closed { width: 0; }
}
@media (max-width: 899px) {
  .legend-full { display: none; }
  .legend-abbr { display: inline; }
}
@media (max-width: 759px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .workspace { flex-direction: column; }
  .wheel-workspace { padding: 12px; }
  .drawer-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 45; backdrop-filter: blur(2px);
  }
  .ai-panel {
    position: fixed; top: 0; right: 0; height: 100dvh; width: min(100vw, 430px);
    z-index: 46; border-left: 1px solid var(--border-strong);
    transform: translateX(100%);
  }
  .ai-panel--open { transform: translateX(0); width: min(100vw, 430px); opacity: 1; pointer-events: auto; }
  .ai-panel--closed { transform: translateX(100%); width: min(100vw, 430px); opacity: 1; pointer-events: none; }
  .inspection-card { left: 12px; right: 12px; width: auto; bottom: 12px; }
}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .segment, .ai-panel, .icon-btn, .spinner, .send-btn, .btn-primary-sm { transition: none !important; animation: none !important; }
}
`;
