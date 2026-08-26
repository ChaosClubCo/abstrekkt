/**
 * ABSTREKKT CONSOLE KIT — v1.0.0
 * ============================================================================
 * A reusable "diagnose -> decide -> act" / "paste -> surface insight" console.
 * Extracted from the Google Identity Untangler so new tools are content swaps,
 * not rebuilds. The shell (branding, modes, key handling, self-healing, a11y,
 * responsive, export) is shared. A MODULE plugs into one of two engine kinds.
 *
 * ENGINE KINDS
 * ----------------------------------------------------------------------------
 *  kind: "decision"  Gated questionnaire -> pure compute() -> a verdict with
 *                    rationale, ordered steps, and copyable commands. MOCK runs
 *                    the real pure-function logic offline; LIVE adds Claude's read.
 *  kind: "lens"      Paste a corpus -> Claude surfaces findings bucketed by lens
 *                    (e.g. gems / gaps / blindspots). MOCK can't fabricate
 *                    findings, so it emits the exact per-lens PROMPT to run
 *                    anywhere; LIVE runs them and renders findings.
 *
 * HOW TO ADD A MODULE (copy the matching skeleton into the MODULES array)
 * ----------------------------------------------------------------------------
 *  decision: { id, kind:"decision", icon, title, tagline, intro,
 *              questions:(clientMode)=>[{field,prompt,options:[{value,label}]}],
 *              initial:{...}, demo:{...}|null, demoNote,
 *              compute:(answers,clientMode)=>({key,tone,headline,rationale:[],
 *                       steps:[{label,detail}], commands:[{label,cmd,note}]}),
 *              stateMap?:(clientMode)=>({planes,lever}) }   // optional
 *  lens:     { id, kind:"lens", icon, title, tagline, intro,
 *              corpusLabel, corpusPlaceholder, demoCorpus|null,
 *              lenses:[{id,label,icon,tone,guiding}] }
 *  A module appears in the header switcher automatically.
 *
 * SECURITY / THREAT MODEL (FULL scope — handles an API key)
 *  - API key lives ONLY in React state: never localStorage/sessionStorage (also
 *    banned in this runtime), never logged (console.error carries the error only,
 *    never the key/prompt body), never rendered (masked "Key set" confirmation).
 *  - Sent to exactly one endpoint: https://api.anthropic.com/v1/messages.
 *  - In the claude.ai artifact runtime that call is platform-mediated; the key
 *    still gates LIVE per this kit's contract and is the real credential in any
 *    external deployment of the file.
 *  - Prompt-injection: a pasted corpus / situation is sent as a user message only;
 *    the fixed instruction never executes pasted content.
 *
 * Deps: react, lucide-react. Tailwind not required — all brand tokens are inline
 * via BRAND (one-edit re-skin); clientMode swaps to a neutral, unbranded set.
 */

import React, {
  Component,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  GitBranch,
  Network,
  KeyRound,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Power,
  Globe,
  User,
  Lock,
  Building2,
  GitFork,
  Users,
  Server,
  FileWarning,
  Boxes,
  Gem,
  Compass,
  Puzzle,
  Eye,
  Lightbulb,
  Flag,
  Wand2,
  Dices,
  Swords,
  ListChecks,
  Link as LinkIcon,
} from "lucide-react";

const VERSION = "1.1.0";

/* ===========================================================================
 * BRAND — every color/type token lives here. clientMode picks `client`.
 * ========================================================================= */
const BRAND = {
  internal: {
    name: "Abstrekkt",
    suite: "Console Kit",
    fontDisplay: '"Fraunces", Georgia, "Times New Roman", serif',
    fontBody: '"Crimson Pro", Georgia, serif',
    fontMono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    ink: "#1c1917",
    inkRaised: "#26211d",
    inkLine: "#3a332d",
    brass: "#c8a86a",
    brassDim: "#8f7846",
    text: "#ece6dc",
    textMuted: "#9a9085",
    ok: "#8aa06f",
    okDim: "#5f7048",
    danger: "#c08457",
    dangerDim: "#7e5436",
  },
  client: {
    name: "Console",
    suite: "Console Kit",
    fontDisplay: 'ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif',
    fontBody: 'ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif',
    fontMono: 'ui-monospace, "SF Mono", Menlo, monospace',
    ink: "#0f172a",
    inkRaised: "#1e293b",
    inkLine: "#334155",
    brass: "#60a5fa",
    brassDim: "#3b6fb0",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    ok: "#4ade80",
    okDim: "#2f8f54",
    danger: "#fb923c",
    dangerDim: "#b3622a",
  },
};

/* Genericize internal specifics when clientMode is on. */
function ID(clientMode, real, generic) {
  return clientMode ? generic : real;
}

/* ===========================================================================
 * MODULES — the content. Add objects here to grow the suite.
 * ========================================================================= */

/* -- decision: repo / project disposition --------------------------------- */
const repoDisposition = {
  id: "repo-disposition",
  kind: "decision",
  icon: "repo",
  title: "Repo / project disposition",
  tagline: "Keep · archive · make-private · migrate.",
  intro: "Decide what to do with a repository or project. Lane-separation and leaked secrets override everything else.",
  questions: (clientMode) => [
    {
      field: "laneSensitive",
      prompt: ID(clientMode, "Does it contain day-job / lane-sensitive content?", "Does it contain sensitive or restricted content?"),
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      field: "visibility",
      prompt: "Current visibility?",
      options: [
        { value: "public", label: "Public" },
        { value: "private", label: "Private" },
      ],
    },
    {
      field: "secrets",
      prompt: "Does the history contain secrets/keys?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      field: "usage",
      prompt: "Activity level?",
      options: [
        { value: "active", label: "Active" },
        { value: "dormant", label: "Dormant" },
        { value: "dead", label: "Dead" },
      ],
    },
    {
      field: "value",
      prompt: "Reusable value in the code?",
      options: [
        { value: "high", label: "High" },
        { value: "low", label: "Low" },
      ],
    },
  ],
  initial: { laneSensitive: "", visibility: "", secrets: "", usage: "", value: "" },
  demo: { laneSensitive: "yes", visibility: "public", secrets: "unknown", usage: "dormant", value: "low" },
  demoNote: ID(false, "Mirrors your 16 public day-job repos flagged for lane separation.", ""),
  compute: (a, clientMode) => {
    const GH = "gh"; // GitHub CLI
    if (!a.laneSensitive || !a.visibility || !a.usage) {
      return {
        key: "INCOMPLETE",
        tone: "brass",
        headline: "Answer visibility, lane-sensitivity, and activity to get a verdict",
        rationale: ["Lane-sensitivity and public exposure are the override conditions — they decide the outcome before anything else."],
        steps: [],
        commands: [],
      };
    }
    if (a.laneSensitive === "yes" && a.visibility === "public") {
      return {
        key: "MAKE_PRIVATE_NOW",
        tone: "danger",
        headline: "Make it private now — public lane-sensitive content is a breach",
        rationale: [
          ID(clientMode, "Day-job / lane content must never be publicly visible. This is the top-priority fix.", "Sensitive content must not be publicly visible. Highest priority."),
          a.secrets !== "no" ? "It may also contain secrets — rotate them as part of the same pass (see commands)." : "No secrets reported, so visibility is the only fix.",
        ],
        steps: [
          { label: "Flip to private immediately", detail: "One command, below. Do this before auditing anything else." },
          { label: "Check for forks/clones", detail: "A public repo may have been forked; private-ing the origin does not retract forks. Review and request takedown if needed." },
          a.secrets !== "no"
            ? { label: "Rotate any secrets in history", detail: "Treat history-exposed keys as compromised; rotate at the provider and scrub history." }
            : { label: "Confirm no embedded secrets", detail: "Quick scan to be sure nothing slipped in." },
        ],
        commands: [
          { label: "Make private", cmd: `${GH} repo edit ${ID(clientMode, "<owner>/<repo>", "<owner>/<repo>")} --visibility private --accept-visibility-change-consequences` },
          { label: "List forks to review", cmd: `${GH} api repos/${ID(clientMode, "<owner>/<repo>", "<owner>/<repo>")}/forks --jq '.[].full_name'` },
          { label: "Scan history for secrets", cmd: `gitleaks detect --source . --redact` },
        ],
      };
    }
    if (a.secrets === "yes") {
      return {
        key: "SCRUB_AND_ROTATE_FIRST",
        tone: "danger",
        headline: "Scrub + rotate before any keep/archive call",
        rationale: ["Secrets in history are a live risk regardless of activity. Remediate first, then re-run this with secrets = No."],
        steps: [
          { label: "Rotate the exposed credentials", detail: "Revoke and reissue at the provider. Assume they are compromised." },
          { label: "Purge them from history", detail: "Rewrite history to remove the secret, then force-push and invalidate caches/forks." },
          { label: "Re-evaluate disposition", detail: "Once clean, answer secrets = No and take the keep/archive path." },
        ],
        commands: [
          { label: "Scan to locate", cmd: `gitleaks detect --source . --redact --report-path leaks.json` },
          { label: "Purge from history (BFG)", cmd: `bfg --delete-files <secret-file> && git reflog expire --expire=now --all && git gc --prune=now` },
        ],
      };
    }
    if (a.usage === "dead" && a.value === "low") {
      return {
        key: "ARCHIVE",
        tone: "ok",
        headline: "Archive it — dead and low-value",
        rationale: ["Nothing reusable, no activity. Archive keeps the record read-only without cluttering active work; delete only if you are certain."],
        steps: [
          { label: "Archive (reversible)", detail: "Marks it read-only; you can unarchive later. Safer than delete." },
        ],
        commands: [{ label: "Archive", cmd: `${GH} repo archive <owner>/<repo>` }],
      };
    }
    if (a.usage === "dead" && a.value === "high") {
      return {
        key: "EXTRACT_THEN_ARCHIVE",
        tone: "brass",
        headline: "Extract the reusable parts, then archive",
        rationale: ["Dead but valuable. Pull the reusable pieces into a maintained library so the value survives, then archive the husk."],
        steps: [
          { label: "Lift the reusable code", detail: "Move the worth-keeping modules into your shared library/template repo." },
          { label: "Archive the original", detail: "Once extracted, archive it read-only." },
        ],
        commands: [{ label: "Archive after extraction", cmd: `${GH} repo archive <owner>/<repo>` }],
      };
    }
    if (a.usage === "dormant") {
      return {
        key: a.value === "high" ? "KEEP_PRIVATE" : "ARCHIVE",
        tone: "brass",
        headline: a.value === "high" ? "Keep, but make sure it's private and clean" : "Archive — dormant and low-value",
        rationale: [
          a.value === "high" ? "Dormant but valuable — hold it, just confirm hygiene." : "Dormant with little value — archive to reduce surface.",
        ],
        steps:
          a.value === "high"
            ? [{ label: "Confirm private + hygiene", detail: "Ensure visibility is private and no secrets are present." }]
            : [{ label: "Archive", detail: "Read-only; reversible." }],
        commands:
          a.value === "high"
            ? [{ label: "Ensure private", cmd: `${GH} repo edit <owner>/<repo> --visibility private --accept-visibility-change-consequences` }]
            : [{ label: "Archive", cmd: `${GH} repo archive <owner>/<repo>` }],
      };
    }
    // active
    return {
      key: "KEEP",
      tone: "ok",
      headline: "Keep — just hold the hygiene line",
      rationale: ["Active and in use. No disposition action; maintain visibility and secret hygiene."],
      steps: [{ label: "Periodic hygiene check", detail: "Confirm visibility is correct and run a secret scan on a cadence." }],
      commands: [{ label: "Secret scan", cmd: `gitleaks detect --source . --redact` }],
    };
  },
};

/* -- decision: credential exposure triage --------------------------------- */
const credentialTriage = {
  id: "credential-triage",
  kind: "decision",
  icon: "key",
  title: "Credential exposure triage",
  tagline: "Rotate · revoke · scope-down · leave.",
  intro: "Decide how to handle a credential. Any public/shared/client-side exposure means treat it as compromised.",
  questions: (clientMode) => [
    {
      field: "exposure",
      prompt: "Where is it exposed?",
      options: [
        { value: "public", label: "Public repo" },
        { value: "shared", label: "Shared doc" },
        { value: "client", label: "Client bundle" },
        { value: "none", label: "Not exposed" },
      ],
    },
    {
      field: "inUse",
      prompt: "Still in use?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      field: "scope",
      prompt: "Blast radius?",
      options: [
        { value: "broad", label: "Admin / broad" },
        { value: "scoped", label: "Scoped" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      field: "rotatable",
      prompt: "Can you rotate without breakage?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "coord", label: "Needs coordination" },
        { value: "unknown", label: "Unknown" },
      ],
    },
  ],
  initial: { exposure: "", inUse: "", scope: "", rotatable: "" },
  demo: { exposure: "shared", inUse: "unknown", scope: "unknown", rotatable: "unknown" },
  demoNote: "Mirrors raw keys flagged in shared docs.",
  compute: (a, clientMode) => {
    const VAULT = ID(clientMode, "Bitwarden", "your secrets manager");
    if (!a.exposure) {
      return { key: "INCOMPLETE", tone: "brass", headline: "Where is it exposed? Start there", rationale: ["Exposure location sets the urgency."], steps: [], commands: [] };
    }
    if (a.exposure === "public" || a.exposure === "shared" || a.exposure === "client") {
      const where = a.exposure === "public" ? "a public repo" : a.exposure === "shared" ? "a shared document" : "a client-side bundle";
      return {
        key: "REVOKE_ROTATE_NOW",
        tone: "danger",
        headline: "Treat as compromised — revoke/rotate immediately",
        rationale: [
          `It is sitting in ${where}. Assume it has been seen. Speed beats elegance here.`,
          a.scope === "broad" ? "Broad scope makes this worse — reissue with least privilege." : "Reissue and scope to least privilege regardless.",
        ],
        steps: [
          { label: "Revoke at the provider", detail: "Invalidate the exposed key now, before cleanup." },
          { label: "Issue a replacement (least privilege)", detail: `Create a new, narrowly-scoped key and store it server-side / in ${VAULT} — never in client code.` },
          { label: "Scrub from where it leaked", detail: "Remove from the doc/bundle and purge from git history if applicable." },
          { label: "Audit for misuse", detail: "Check provider logs for unexpected calls since the exposure window." },
        ],
        commands: [
          { label: "Scan repo history (if code)", cmd: `gitleaks detect --source . --redact` },
          { label: "Purge from history (BFG)", cmd: `bfg --delete-files <file-with-secret> && git reflog expire --expire=now --all && git gc --prune=now` },
        ],
      };
    }
    if (a.inUse === "no") {
      return {
        key: "REVOKE",
        tone: "ok",
        headline: "Just revoke it — not exposed, not used",
        rationale: ["Dead credential. Revoke to shrink the attack surface; no rotation needed."],
        steps: [{ label: "Revoke at the provider", detail: "Remove it; nothing depends on it." }],
        commands: [],
      };
    }
    if (a.scope === "broad") {
      return {
        key: "ROTATE_SCOPE_DOWN",
        tone: "brass",
        headline: "Rotate and cut the scope down",
        rationale: ["Not exposed, but admin/broad scope is unnecessary standing risk. Reissue least-privilege."],
        steps: [
          { label: "Issue a scoped replacement", detail: "New key with only the permissions actually used." },
          { label: "Swap it in, then revoke the old", detail: a.rotatable === "coord" ? "Coordinate the cutover to avoid breakage, then revoke." : "Swap server-side env and revoke the broad key." },
        ],
        commands: [],
      };
    }
    return {
      key: "ROTATE_ON_SCHEDULE",
      tone: "ok",
      headline: "Healthy — rotate on a schedule, store in the vault",
      rationale: ["No exposure, reasonable scope. Maintain hygiene: scheduled rotation and centralized storage."],
      steps: [
        { label: "Confirm it lives in the vault", detail: `Move it into ${VAULT} if it is loose anywhere.` },
        { label: "Set a rotation reminder", detail: "Pick a cadence and stick to it." },
      ],
      commands: [],
    };
  },
};

/* -- decision: prospect go / no-go ---------------------------------------- */
const prospectGoNoGo = {
  id: "prospect-go-no-go",
  kind: "decision",
  icon: "prospect",
  title: "Prospect go / no-go",
  tagline: "Pursue · nurture · passive-only · decline.",
  intro: "Decide whether to pursue a prospect now. Lane conflict and the price floor are hard gates.",
  questions: (clientMode) => [
    {
      field: "lane",
      prompt: ID(clientMode, "Day-job / lane conflict?", "Conflict of interest?"),
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      field: "intent",
      prompt: "Buying signal?",
      options: [
        { value: "strong", label: "Strong" },
        { value: "lukewarm", label: "Lukewarm" },
        { value: "none", label: "None" },
      ],
    },
    {
      field: "budget",
      prompt: ID(clientMode, "Above the $4,500 floor?", "Above your price floor?"),
      options: [
        { value: "yes", label: "Yes" },
        { value: "unclear", label: "Unclear" },
        { value: "no", label: "No" },
      ],
    },
    {
      field: "fit",
      prompt: "Champion-model fit (one internal owner)?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "partial", label: "Partial" },
        { value: "no", label: "No" },
      ],
    },
    {
      field: "bandwidth",
      prompt: "Concurrent capacity right now?",
      options: [
        { value: "yes", label: "Open slot" },
        { value: "atcap", label: "At cap" },
      ],
    },
  ],
  initial: { lane: "", intent: "", budget: "", fit: "", bandwidth: "" },
  demo: { lane: "no", intent: "strong", budget: "unclear", fit: "yes", bandwidth: "yes" },
  demoNote: "A strong inbound with budget still to confirm.",
  compute: (a, clientMode) => {
    const FLOOR = ID(clientMode, "$4,500", "your floor");
    if (!a.lane || !a.intent) {
      return { key: "INCOMPLETE", tone: "brass", headline: "Set lane + intent first", rationale: ["Lane conflict is an immediate disqualifier; intent gates everything else."], steps: [], commands: [] };
    }
    if (a.lane === "yes") {
      return {
        key: "DECLINE",
        tone: "danger",
        headline: "Decline — lane conflict is non-negotiable",
        rationale: [ID(clientMode, "Never take a client adjacent to the day-job. Hard rule, no exceptions.", "A conflict of interest here is disqualifying.")],
        steps: [{ label: "Decline cleanly", detail: "Polite, brief, no door left ajar. Protect the separation." }],
        commands: [],
      };
    }
    if (a.intent === "none") {
      return {
        key: "PASSIVE_ONLY",
        tone: "brass",
        headline: "Passive only — no pursuit",
        rationale: ["No buying signal. Don't chase; stay reachable for inbound."],
        steps: [{ label: "Leave the door open", detail: "No outreach cadence. If they come to you, then evaluate." }],
        commands: [],
      };
    }
    if (a.budget === "no") {
      return {
        key: "HOLD_BELOW_FLOOR",
        tone: "danger",
        headline: `Hold — below the ${FLOOR} floor`,
        rationale: ["Under the floor isn't a deal. Don't discount; the floor protects every future quote.", "If they're inbound and insistent, the only move is premium pricing, never a discount."],
        steps: [{ label: "Hold or quote at premium", detail: "No work below floor. If inbound, quote up — never down." }],
        commands: [],
      };
    }
    if (a.bandwidth === "atcap") {
      return {
        key: "NURTURE_QUEUE",
        tone: "brass",
        headline: "Nurture and queue — you're at concurrent cap",
        rationale: ["Good prospect, no slot. Taking it now risks delivery quality across everything in flight.", "Queue it; revisit the moment a slot frees."],
        steps: [
          { label: "Set a light-touch nurture", detail: "Keep warm without committing a delivery slot." },
          { label: "Revisit at next opening", detail: "Re-run this when capacity frees up." },
        ],
        commands: [],
      };
    }
    if (a.intent === "strong" && a.fit !== "no" && a.budget !== "no" && a.bandwidth === "yes") {
      return {
        key: "PURSUE_NOW",
        tone: "ok",
        headline: "Pursue now — send the audit offer",
        rationale: [
          "Strong signal, fit, capacity, and budget isn't a blocker. This is a go.",
          a.budget === "unclear" ? "Budget is unconfirmed — qualify it in the same message so you don't sink time below floor." : "Budget clears the floor.",
          a.fit === "partial" ? "Fit is partial — name who the internal champion would be early." : "Champion fit is there.",
        ],
        steps: [
          { label: "Send the audit offer", detail: "Lead with the audit. Anchor on the floor; qualify budget if unclear." },
          { label: "Name the champion", detail: "Identify the one internal owner you'd train — central to the model." },
        ],
        commands: [
          { label: "Audit-offer opener (copy)", cmd: ID(clientMode, "A short, scoped AI audit is the right first step — fixed fee, clear deliverable, and it tells us exactly where the leverage is before any build.", "A short, scoped audit is the right first step — fixed fee, clear deliverable, and it surfaces the leverage before any build.") },
        ],
      };
    }
    return {
      key: "NURTURE",
      tone: "brass",
      headline: "Nurture — promising but not a clean go yet",
      rationale: [
        a.intent === "lukewarm" ? "Signal is lukewarm — warm it before pitching." : "Not all go-conditions are met.",
        a.fit === "no" ? "Champion-model fit is missing — without an internal owner the engagement breaks your model." : "",
      ].filter(Boolean),
      steps: [{ label: "Warm, don't pitch", detail: "Build the relationship and the case; re-run when the signal sharpens." }],
      commands: [],
    };
  },
};

/* -- lens: insight surface (your 7 lenses) -------------------------------- */
const insightSurface = {
  id: "insight-surface",
  kind: "lens",
  icon: "insight",
  title: "Insight surface",
  tagline: "Seven lenses over any corpus.",
  intro: "Paste a document, backlog, or situation. Each selected lens surfaces a different category of insight. Findings require LIVE; without a key you get the exact prompt to run anywhere.",
  corpusLabel: "Material to analyze",
  corpusPlaceholder: "Paste a project state, backlog, doc, or situation here…",
  demoCorpus:
    "Built: a 244-plugin pack (undistributed), ~50 internal skills, a NotebookLM canon, an audit microsite that's noindexed. Pipeline: one active client, several warm leads. Constraints: solo, ~15–20 hrs/wk on this, day-job lane kept fully separate. Goal: turn this into a repeatable consulting motion.",
  lenses: [
    { id: "gems", label: "Hidden gems", icon: "gem", tone: "ok", guiding: "Already-built or already-owned assets with outsized latent value that are underused, undistributed, or invisible. Name the asset and the value it's leaving on the table." },
    { id: "unknowns", label: "Unknown unknowns", icon: "compass", tone: "danger", guiding: "Risks or opportunities not even on the radar — second-order effects, category errors, things the operator wouldn't think to ask about." },
    { id: "gaps", label: "Gaps", icon: "puzzle", tone: "brass", guiding: "Missing pieces between the stated goal and the current state — absent steps, unmet prerequisites, unaddressed requirements." },
    { id: "blindspots", label: "Blindspots", icon: "eye", tone: "danger", guiding: "Things systematically not seen from the operator's vantage point — over-reliance, single points of failure, conflicts they're too close to notice." },
    { id: "augmenters", label: "Augmenters", icon: "lightbulb", tone: "ok", guiding: "Small additions that multiply the value of what already exists — a trigger on a manual process, one automation, a cadence that compounds an existing asset." },
    { id: "promoves", label: "Pro moves", icon: "flag", tone: "brass", guiding: "Non-obvious, high-leverage plays an expert in this situation would make that a novice wouldn't see. Specific and actionable, not generic advice." },
    { id: "connections", label: "Connections I missed", icon: "link", tone: "ok", guiding: "Links between items already present in the corpus — this asset feeds that goal, this lead maps to that case study, these two efforts are secretly the same effort." },
  ],
};

const MODULES = [repoDisposition, credentialTriage, prospectGoNoGo, insightSurface];

/* ===========================================================================
 * Anthropic call with retry + exponential backoff (max 3). Never logs the key.
 * ========================================================================= */
async function callClaude(apiKey, prompt, maxRetries = 3) {
  let attempt = 0;
  let lastErr = null;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1400,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const transient = res.status === 429 || res.status >= 500;
        if (transient) throw new Error(`transient:${res.status}`);
        const err = new Error(`client:${res.status}`);
        err.fatal = true;
        throw err;
      }
      const data = await res.json();
      const text = (data.content || [])
        .filter((b) => b && b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (!text) throw new Error("empty-response");
      return text;
    } catch (e) {
      lastErr = e;
      if ((e && e.fatal) || attempt === maxRetries) break;
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
      attempt++;
    }
  }
  console.error("[ConsoleKit] LIVE call failed:", lastErr && lastErr.message);
  throw lastErr;
}

function labelFor(questions, field, value) {
  const q = questions.find((x) => x.field === field);
  if (!q) return value;
  const o = q.options.find((x) => x.value === value);
  return o ? o.label : value || "(unset)";
}

function buildDecisionPrompt(module, answers, situation, rec, clientMode) {
  const qs = module.questions(clientMode);
  return [
    `You are an advisor for the task: "${module.title}". ${module.intro}`,
    "",
    "The user's inputs:",
    ...qs.map((q) => `- ${q.prompt} ${labelFor(qs, q.field, answers[q.field])}`),
    situation ? `\nExtra context from the user:\n${situation}` : "",
    "",
    `An offline rules engine recommends: ${rec.key.replace(/_/g, " ")} — ${rec.headline}.`,
    "",
    "In 4-7 sentences: state the single decisive factor, agree or disagree with the engine and why, and give the one next action. Direct, no preamble.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildLensPrompt(module, corpus, lensObjs) {
  return [
    "You are surfacing insight from the material below. Be specific to the material — no generic advice.",
    "",
    "MATERIAL:",
    corpus,
    "",
    "For EACH lens, return a section. Format strictly:",
    "### <Lens label>",
    "- finding (one line, specific)",
    "(2-5 bullets per lens; if a lens surfaces nothing, write '- (nothing surfaced)')",
    "",
    "LENSES:",
    ...lensObjs.map((l) => `- ${l.label}: ${l.guiding}`),
    "",
    "No preamble, no closing summary. Start at the first '###'.",
  ].join("\n");
}

function buildSingleLensPrompt(corpus, lens) {
  return [
    `Surface insight from the material below through one lens: ${lens.label}.`,
    `What this lens looks for: ${lens.guiding}`,
    "Be specific to the material, not generic. Return 2-5 one-line bullets.",
    "",
    "MATERIAL:",
    corpus || "(paste your material here)",
  ].join("\n");
}

function parseLensOutput(text, lensObjs) {
  // Split on '### ' headers; map each to a lens by label (case-insensitive).
  const out = {};
  const parts = text.split(/^###\s+/m).map((p) => p.trim()).filter(Boolean);
  let matchedAny = false;
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const header = (nl === -1 ? part : part.slice(0, nl)).trim().toLowerCase();
    const body = nl === -1 ? "" : part.slice(nl + 1).trim();
    const lens = lensObjs.find((l) => header.includes(l.label.toLowerCase()));
    if (lens) {
      matchedAny = true;
      out[lens.id] = body
        .split("\n")
        .map((line) => line.replace(/^[-*]\s?/, "").trim())
        .filter(Boolean);
    }
  }
  return { byLens: out, matchedAny };
}

/* ===========================================================================
 * AI CO-PILOT subsystem (v1.1). Prompt builders are pure; the App owns the
 * fetch + state. Suggestions are explicitly framed as guesses, not ground truth.
 * ========================================================================= */
const PASS_LABEL = { redteam: "Adversarial pass", gaps: "Gap analysis", gems: "Gems & pro moves" };

function buildSuggestPrompt(module, ctx, refreshKey, clientMode) {
  if (module.kind === "decision") {
    const qs = module.questions(clientMode);
    return [
      "You are a co-pilot suggesting plausible INPUTS for a decision tool. You do NOT have ground truth — these are best-guess suggestions the user will verify and confirm.",
      ctx,
      "",
      `This is variation #${refreshKey}. If it is greater than 0, deliberately offer a DIFFERENT plausible scenario than the most obvious one.`,
      "",
      "Fields and their allowed values:",
      ...qs.map((q) => `- ${q.field}: one of [${q.options.map((o) => o.value).join(", ")}]`),
      "",
      'Return STRICT JSON only — no prose, no markdown fence: {"fields":{"<field>":{"value":"<one allowed value>","why":"<=12 words","confidence":"low|medium|high"}},"situation":"<=40 words of context you inferred"}',
    ].join("\n");
  }
  return [
    "You are a co-pilot drafting or expanding the MATERIAL to analyze. Generate concrete, useful content the user can edit. Do not assert invented specifics as fact — keep it clearly a draft.",
    ctx,
    "",
    `This is variation #${refreshKey}. If greater than 0, take a different angle than before.`,
    "",
    'Return STRICT JSON only — no markdown fence: {"corpus":"<drafted or expanded material, 60-160 words>"}',
  ].join("\n");
}

function parseSuggestJSON(text) {
  try {
    const cleaned = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    console.error("[ConsoleKit] suggestion JSON parse failed:", e && e.message);
    return null;
  }
}

function buildPassPrompt(type, ctx) {
  if (type === "redteam") {
    return [
      "Adversarially critique the decision/analysis below. Be specific and concrete — no generic caveats, no hedging.",
      ctx,
      "",
      "Return exactly three sections with these headers:",
      "COUNTEREXAMPLES — where this is wrong or would fail",
      "MISSED — what was not considered",
      "WOULD FLIP IT — the single change that would most alter the conclusion",
    ].join("\n");
  }
  if (type === "gaps") {
    return [
      "Identify the gaps between the current state below and a complete, defensible decision. Specific, not generic.",
      ctx,
      "",
      "Return a short bullet list. For each gap, name what would close it.",
    ].join("\n");
  }
  return [
    "From the situation below, surface two things — specific to this material, never generic advice:",
    ctx,
    "",
    "Return exactly two sections with these headers:",
    "HIDDEN GEMS — already-present assets or angles with outsized latent value",
    "PRO MOVES — non-obvious, high-leverage plays an expert would make here",
    "2-5 one-line bullets under each.",
  ].join("\n");
}

/* ===========================================================================
 * Error boundary — no blank-screen crash.
 * ========================================================================= */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error && error.message ? error.message : "Unknown error" };
  }
  componentDidCatch(error, info) {
    console.error("[ConsoleKit] render error:", error && error.message, info && info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ background: "#1c1917", color: "#ece6dc", fontFamily: "ui-monospace, Menlo, monospace", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 520, border: "1px solid #c08457", borderRadius: 10, padding: 24 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <AlertTriangle size={20} color="#c08457" />
              <strong>The console hit a rendering fault</strong>
            </div>
            <p style={{ color: "#9a9085", lineHeight: 1.5, marginBottom: 16 }}>
              Your inputs and the decision logic are safe — only the view crashed. Restart it below. Fault detail: {this.state.message}
            </p>
            <button onClick={() => this.setState({ hasError: false, message: "" })} style={{ background: "#c8a86a", color: "#1c1917", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
              Restart view
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ===========================================================================
 * Shared presentational helpers.
 * ========================================================================= */
function iconFor(name, color, size = 18) {
  const p = { size, color, strokeWidth: 2 };
  const map = {
    user: <User {...p} />, lock: <Lock {...p} />, building: <Building2 {...p} />, globe: <Globe {...p} />,
    repo: <GitFork {...p} />, key: <KeyRound {...p} />, prospect: <Users {...p} />, server: <Server {...p} />,
    file: <FileWarning {...p} />, insight: <Lightbulb {...p} />,
    gem: <Gem {...p} />, compass: <Compass {...p} />, puzzle: <Puzzle {...p} />, eye: <Eye {...p} />,
    lightbulb: <Lightbulb {...p} />, flag: <Flag {...p} />, link: <LinkIcon {...p} />,
  };
  return map[name] || <Network {...p} />;
}

function CopyButton({ text, t, label }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error("[ConsoleKit] clipboard write failed:", e && e.message);
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  }, [text]);
  return (
    <button type="button" onClick={onCopy} aria-label={label || "Copy"} title={failed ? "Clipboard blocked — select manually" : "Copy"}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: failed ? t.danger : copied ? t.ok : t.textMuted, border: `1px solid ${failed ? t.dangerDim : copied ? t.okDim : t.inkLine}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: t.fontMono, cursor: "pointer" }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {failed ? "Select it" : copied ? "Copied" : "Copy"}
    </button>
  );
}

function Tip({ id, t, children, label }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }} className="ck-tip">
      <span tabIndex={0} role="button" aria-describedby={id} aria-label={label} style={{ display: "inline-flex", cursor: "help", color: t.textMuted, outlineOffset: 2 }}>
        <HelpCircle size={15} />
      </span>
      <span id={id} role="tooltip" className="ck-tip-body"
        style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 264, background: t.inkRaised, color: t.text, border: `1px solid ${t.inkLine}`, borderRadius: 8, padding: "10px 12px", fontSize: 12.5, fontFamily: t.fontBody, lineHeight: 1.45, zIndex: 40, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
        {children}
      </span>
    </span>
  );
}

function Question({ t, q, value, onChange }) {
  return (
    <fieldset style={{ border: "none", margin: 0, padding: 0 }} role="radiogroup" aria-label={q.prompt}>
      <legend style={{ fontFamily: t.fontBody, fontSize: 15, color: t.text, marginBottom: 8, padding: 0 }}>{q.prompt}</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {q.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button key={opt.value} type="button" role="radio" aria-checked={selected} onClick={() => onChange(opt.value)}
              style={{ fontFamily: t.fontMono, fontSize: 12.5, padding: "7px 12px", borderRadius: 7, cursor: "pointer", color: selected ? t.ink : t.text, background: selected ? t.brass : "transparent", border: `1px solid ${selected ? t.brass : t.inkLine}`, transition: "background 120ms ease, color 120ms ease" }}>
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CoPilotBar({ t, hasKey, busy, aiOn, onToggle, onSuggest, onReroll, onPass, suggestActive }) {
  const chip = (active) => ({ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: t.fontMono, fontSize: 12, padding: "6px 10px", borderRadius: 7, cursor: busy ? "wait" : "pointer", color: active ? t.ink : t.text, background: active ? t.brass : "transparent", border: `1px solid ${active ? t.brass : t.inkLine}`, opacity: busy ? 0.7 : 1 });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <button type="button" onClick={onToggle} aria-pressed={aiOn} style={chip(aiOn)}>
        <Wand2 size={14} /> AI co-pilot {aiOn ? "on" : "off"}
      </button>
      {aiOn && !hasKey && <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.textMuted }}>no key → copies a prompt</span>}
      {aiOn && (
        <>
          <button type="button" onClick={onSuggest} disabled={busy} style={chip(false)} aria-label="Suggest field values"><Wand2 size={13} /> Suggest</button>
          <button type="button" onClick={onReroll} disabled={busy || !suggestActive} style={{ ...chip(false), opacity: busy || !suggestActive ? 0.5 : 1, cursor: busy || !suggestActive ? "not-allowed" : "pointer" }} aria-label="Re-roll suggestions (refresh)"><Dices size={13} /> Re-roll</button>
          <span aria-hidden="true" style={{ width: 1, height: 18, background: t.inkLine }} />
          <button type="button" onClick={() => onPass("redteam")} disabled={busy} style={chip(false)} aria-label="Red-team this"><Swords size={13} /> Red-team</button>
          <button type="button" onClick={() => onPass("gaps")} disabled={busy} style={chip(false)} aria-label="Gap analysis"><ListChecks size={13} /> Gaps</button>
          <button type="button" onClick={() => onPass("gems")} disabled={busy} style={chip(false)} aria-label="Gems and pro moves"><Gem size={13} /> Gems &amp; pro moves</button>
          {busy && <RefreshCw size={14} className="ck-spin" color={t.brass} />}
        </>
      )}
    </div>
  );
}

function SuggestChip({ t, q, sug, onApply }) {
  const valLabel = (q.options.find((o) => o.value === sug.value) || {}).label || sug.value;
  const conf = sug.confidence || "medium";
  const confColor = conf === "high" ? t.ok : conf === "low" ? t.danger : t.brass;
  return (
    <button type="button" onClick={onApply} title={sug.why ? `${sug.why} (confidence: ${conf})` : "Apply suggestion"} aria-label={`Apply AI suggestion ${valLabel}, confidence ${conf}`}
      style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: t.fontMono, fontSize: 12, padding: "6px 10px", borderRadius: 7, cursor: "pointer", color: t.text, background: "transparent", border: `1px dashed ${t.brassDim}` }}>
      <Wand2 size={12} color={t.brass} />
      <span style={{ color: t.brass }}>AI ▸ {valLabel}</span>
      {sug.why && <span style={{ color: t.textMuted }}>· {sug.why}</span>}
      <span aria-hidden="true" title={`confidence: ${conf}`} style={{ width: 7, height: 7, borderRadius: "50%", background: confColor, flexShrink: 0 }} />
    </button>
  );
}

function AIPassPanel({ t, pass, onRetry }) {
  const meta = {
    redteam: { label: "Adversarial pass", icon: <Swords size={16} color={t.danger} />, tone: t.danger },
    gaps: { label: "Gap analysis", icon: <ListChecks size={16} color={t.brass} />, tone: t.brass },
    gems: { label: "Gems & pro moves", icon: <Gem size={16} color={t.ok} />, tone: t.ok },
  }[pass.type] || { label: "AI", icon: <Wand2 size={16} color={t.brass} />, tone: t.brass };
  return (
    <section style={{ background: t.inkRaised, border: `1px solid ${t.inkLine}`, borderTop: `3px solid ${meta.tone}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {meta.icon}
        <h2 style={{ fontFamily: t.fontMono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, margin: 0 }}>{meta.label}</h2>
      </div>
      {pass.loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.textMuted, fontSize: 13.5 }}><RefreshCw size={14} className="ck-spin" /> Running {meta.label.toLowerCase()}…</div>
      ) : pass.error ? (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13.5, color: t.text, lineHeight: 1.45 }}>{pass.error}</p>
            <button type="button" onClick={onRetry} style={{ fontFamily: t.fontMono, fontSize: 12.5, padding: "6px 12px", borderRadius: 7, cursor: "pointer", color: t.brass, background: "transparent", border: `1px solid ${t.brassDim}` }}>Retry</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 14, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{pass.text}</p>
      )}
    </section>
  );
}

function MockPromptPanel({ t, mockPrompt, onClear }) {
  return (
    <section style={{ background: t.inkRaised, border: `1px solid ${t.brassDim}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wand2 size={16} color={t.brass} />
          <h2 style={{ fontFamily: t.fontMono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, margin: 0 }}>{mockPrompt.label} — prompt (no key)</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <CopyButton text={mockPrompt.text} t={t} label="Copy prompt" />
          <button type="button" onClick={onClear} aria-label="Dismiss prompt" style={{ fontFamily: t.fontMono, fontSize: 12, padding: "4px 8px", borderRadius: 6, cursor: "pointer", color: t.textMuted, background: "transparent", border: `1px solid ${t.inkLine}` }}>Clear</button>
        </div>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: t.textMuted, lineHeight: 1.45 }}>No API key set — run this in any Claude surface and paste the result back.</p>
      <pre className="ck-scroll" style={{ margin: 0, background: t.ink, border: `1px solid ${t.inkLine}`, borderRadius: 8, padding: "10px 12px", overflowX: "auto", fontFamily: t.fontMono, fontSize: 12, color: t.text, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{mockPrompt.text}</pre>
    </section>
  );
}

/* ===========================================================================
 * App.
 * ========================================================================= */
function ConsoleKitApp() {
  const [clientMode, setClientMode] = useState(false);
  const t = clientMode ? BRAND.client : BRAND.internal;

  const [activeId, setActiveId] = useState(MODULES[0].id);
  const module = useMemo(() => MODULES.find((m) => m.id === activeId) || MODULES[0], [activeId]);

  // Decision state.
  const [answers, setAnswers] = useState(() => ({ ...(MODULES[0].demo || MODULES[0].initial) }));
  const [situation, setSituation] = useState("");
  const [demoActive, setDemoActive] = useState(true);

  // Lens state.
  const [corpus, setCorpus] = useState(() => MODULES[0].demoCorpus || "");
  const [selectedLenses, setSelectedLenses] = useState(() => (MODULES[0].kind === "lens" ? MODULES[0].lenses.map((l) => l.id) : []));
  const [lensFindings, setLensFindings] = useState(null); // { byLens, raw, matchedAny } | null

  // Shared / API.
  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  const [forcedMock, setForcedMock] = useState(false);
  const [liveText, setLiveText] = useState(""); // decision LIVE
  const [liveError, setLiveError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [viewport, setViewport] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [exportText, setExportText] = useState("");

  // AI co-pilot (v1.1) — opt-in; all calls on-demand; key stays in state only.
  const [aiOn, setAiOn] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestBusy, setSuggestBusy] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [pass, setPass] = useState({ type: "", text: "", loading: false, error: "" });
  const [mockPrompt, setMockPrompt] = useState(null);

  const isNarrow = viewport < 768;
  const mode = apiKey && !forcedMock ? "LIVE" : demoActive ? "DEMO" : "MOCK";
  const coPilotBusy = suggestBusy || pass.loading;

  const rec = useMemo(
    () => (module.kind === "decision" ? module.compute(answers, clientMode) : null),
    [module, answers, clientMode]
  );

  // Fonts + base CSS once.
  useEffect(() => {
    if (!document.getElementById("ck-fonts")) {
      const link = document.createElement("link");
      link.id = "ck-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Crimson+Pro:wght@400;600&family=JetBrains+Mono:wght@400;500;700&display=swap";
      link.onerror = () => console.error("[ConsoleKit] web fonts failed; using fallbacks");
      document.head.appendChild(link);
    }
    if (!document.getElementById("ck-base")) {
      const style = document.createElement("style");
      style.id = "ck-base";
      style.textContent = `
        .ck-root *:focus-visible { outline: 2px solid ${BRAND.internal.brass}; outline-offset: 2px; border-radius: 4px; }
        .ck-tip .ck-tip-body { opacity: 0; visibility: hidden; transition: opacity 120ms ease; }
        .ck-tip:hover .ck-tip-body, .ck-tip:focus-within .ck-tip-body { opacity: 1; visibility: visible; }
        .ck-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .ck-scroll::-webkit-scrollbar-thumb { background: #3a332d; border-radius: 8px; }
        @keyframes ck-spin { to { transform: rotate(360deg); } }
        .ck-spin { animation: ck-spin 0.9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ck-root * { transition: none !important; animation: none !important; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Env detection on mount.
  useEffect(() => {
    console.log("[ConsoleKit] env:", { mode: demoActive ? "DEMO" : "MOCK", clientMode, viewport, version: VERSION, module: activeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Switch module → reset working state to that module's defaults.
  const switchModule = useCallback((id) => {
    const m = MODULES.find((x) => x.id === id);
    if (!m) return;
    setActiveId(id);
    setLiveText("");
    setLiveError("");
    setForcedMock(false);
    setLensFindings(null);
    setExportText("");
    setSuggestions(null);
    setSuggestError("");
    setPass({ type: "", text: "", loading: false, error: "" });
    setMockPrompt(null);
    setRefreshKey(0);
    if (m.kind === "decision") {
      const seed = clientMode ? m.initial : m.demo || m.initial;
      setAnswers({ ...seed });
      setDemoActive(!clientMode && !!m.demo);
      setSituation("");
    } else {
      setCorpus(clientMode ? "" : m.demoCorpus || "");
      setSelectedLenses(m.lenses.map((l) => l.id));
      setDemoActive(!clientMode && !!m.demoCorpus);
    }
  }, [clientMode]);

  // clientMode flips strip internal demos and neutralize the active module.
  useEffect(() => {
    if (clientMode && demoActive) {
      if (module.kind === "decision") {
        setAnswers({ ...module.initial });
        setSituation("");
      } else {
        setCorpus("");
      }
      setDemoActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientMode]);

  const onAnswer = (field, value) => {
    setDemoActive(false);
    setAnswers((a) => ({ ...a, [field]: value }));
  };
  const toggleLens = (id) =>
    setSelectedLenses((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const saveKey = () => { setApiKey(keyDraft.trim()); setForcedMock(false); setShowKeyPanel(false); };
  const clearKey = () => { setApiKey(""); setKeyDraft(""); setLiveText(""); setLiveError(""); };

  const runDecisionLive = useCallback(async () => {
    if (!apiKey) { setShowKeyPanel(true); return; }
    setAnalyzing(true); setLiveError("");
    try {
      const text = await callClaude(apiKey, buildDecisionPrompt(module, answers, situation, rec, clientMode));
      setLiveText(text); setForcedMock(false);
    } catch (e) {
      const fatal = e && e.fatal;
      setLiveError(fatal ? `The API rejected the request (${String(e.message).replace("client:", "HTTP ")}). Check the key, then retry.` : "API unreachable after 3 attempts. Switched to MOCK — the offline verdict is unaffected. Retry when ready.");
      if (!fatal) setForcedMock(true);
    } finally { setAnalyzing(false); }
  }, [apiKey, module, answers, situation, rec, clientMode]);

  const runLensLive = useCallback(async () => {
    if (!apiKey) { setShowKeyPanel(true); return; }
    if (!corpus.trim()) { setLiveError("Paste some material first — there's nothing to analyze."); return; }
    const chosen = module.lenses.filter((l) => selectedLenses.includes(l.id));
    if (!chosen.length) { setLiveError("Select at least one lens."); return; }
    setAnalyzing(true); setLiveError("");
    try {
      const text = await callClaude(apiKey, buildLensPrompt(module, corpus, chosen));
      const parsed = parseLensOutput(text, chosen);
      setLensFindings({ ...parsed, raw: text });
      setForcedMock(false);
    } catch (e) {
      const fatal = e && e.fatal;
      setLiveError(fatal ? `The API rejected the request (${String(e.message).replace("client:", "HTTP ")}). Check the key, then retry.` : "API unreachable after 3 attempts. Switched to MOCK — copy the prompts below to run elsewhere. Retry when ready.");
      if (!fatal) setForcedMock(true);
    } finally { setAnalyzing(false); }
  }, [apiKey, module, corpus, selectedLenses]);

  // ---- AI co-pilot handlers ----
  const aiContext = useCallback(() => {
    if (module.kind === "decision") {
      const qs = module.questions(clientMode);
      return [
        `Tool: ${module.title}. ${module.intro}`,
        "Current inputs:",
        ...qs.map((q) => `- ${q.prompt} ${labelFor(qs, q.field, answers[q.field])}`),
        situation ? `Extra context: ${situation}` : "",
        rec ? `Offline verdict: ${rec.key.replace(/_/g, " ")} — ${rec.headline}` : "",
      ].filter(Boolean).join("\n");
    }
    return [`Tool: ${module.title}. ${module.intro}`, "Material:", corpus || "(empty)"].join("\n");
  }, [module, answers, situation, rec, corpus, clientMode]);

  const runSuggest = useCallback(async (key) => {
    const rk = typeof key === "number" ? key : refreshKey;
    const prompt = buildSuggestPrompt(module, aiContext(), rk, clientMode);
    if (!apiKey) { setMockPrompt({ label: "AI suggestions", text: prompt }); return; }
    setSuggestBusy(true); setSuggestError("");
    try {
      const text = await callClaude(apiKey, prompt);
      const json = parseSuggestJSON(text);
      if (!json) throw new Error("unparseable");
      setSuggestions(json);
    } catch (e) {
      setSuggestError(e && e.fatal ? "API rejected the request — check the key." : "Couldn't get suggestions (API or format). Re-roll, or copy the prompt to run elsewhere.");
    } finally {
      setSuggestBusy(false);
    }
  }, [apiKey, module, clientMode, aiContext, refreshKey]);

  const reroll = useCallback(() => {
    const next = refreshKey + 1;
    setRefreshKey(next);
    runSuggest(next);
  }, [refreshKey, runSuggest]);

  const runPass = useCallback(async (type) => {
    const prompt = buildPassPrompt(type, aiContext());
    if (!apiKey) { setMockPrompt({ label: PASS_LABEL[type] || "AI", text: prompt }); return; }
    setPass({ type, text: "", loading: true, error: "" });
    try {
      const text = await callClaude(apiKey, prompt);
      setPass({ type, text, loading: false, error: "" });
    } catch (e) {
      setPass({ type, text: "", loading: false, error: e && e.fatal ? "API rejected the request — check the key." : "API unreachable after 3 attempts. Retry, or copy the prompt to run elsewhere." });
    }
  }, [apiKey, aiContext]);

  const applySuggestion = (field, value) => onAnswer(field, value);
  const applyAllSuggestions = () => {
    if (!suggestions) return;
    setDemoActive(false);
    if (module.kind === "decision") {
      setAnswers((a) => {
        const next = { ...a };
        if (suggestions.fields) {
          for (const f of Object.keys(suggestions.fields)) {
            const v = suggestions.fields[f] && suggestions.fields[f].value;
            if (v !== undefined && v !== null) next[f] = v;
          }
        }
        return next;
      });
      if (suggestions.situation) setSituation(suggestions.situation);
    } else if (suggestions.corpus) {
      setCorpus(suggestions.corpus);
    }
  };

  const doExport = useCallback(async () => {
    let body;
    if (module.kind === "decision") {
      const qs = module.questions(clientMode);
      body = [
        `# ${module.title} — state (v${VERSION})`,
        "",
        "## Inputs",
        ...qs.map((q) => `- ${q.prompt} ${labelFor(qs, q.field, answers[q.field])}`),
        "",
        "## Verdict",
        `**${rec.key.replace(/_/g, " ")} — ${rec.headline}**`,
        ...rec.rationale.map((r) => `- ${r}`),
        rec.steps.length ? "\n### Steps" : "",
        ...rec.steps.map((s, i) => `${i + 1}. ${s.label} — ${s.detail}`),
      ].filter(Boolean).join("\n");
    } else {
      const chosen = module.lenses.filter((l) => selectedLenses.includes(l.id));
      body = [
        `# ${module.title} (v${VERSION})`,
        "",
        "## Material",
        corpus || "(none)",
        "",
        "## Lenses",
        ...chosen.map((l) => `- ${l.label}`),
        lensFindings && lensFindings.byLens ? "\n## Findings" : "",
        ...(lensFindings && lensFindings.byLens
          ? chosen.flatMap((l) => [`\n### ${l.label}`, ...((lensFindings.byLens[l.id] || ["(nothing surfaced)"]).map((f) => `- ${f}`))])
          : []),
      ].filter(Boolean).join("\n");
    }
    try {
      await navigator.clipboard.writeText(body);
      setExportText("__copied__");
      setTimeout(() => setExportText(""), 1600);
    } catch (e) {
      console.error("[ConsoleKit] export clipboard failed:", e && e.message);
      setExportText(body);
    }
  }, [module, answers, rec, clientMode, corpus, selectedLenses, lensFindings]);

  const toneColor = (tone) => (tone === "ok" ? t.ok : tone === "danger" ? t.danger : t.brass);

  const Panel = ({ children, style }) => (
    <section style={{ background: t.inkRaised, border: `1px solid ${t.inkLine}`, borderRadius: 12, padding: isNarrow ? 16 : 20, ...style }}>{children}</section>
  );
  const SectionLabel = ({ icon, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      {icon}
      <h2 style={{ fontFamily: t.fontMono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, margin: 0 }}>{children}</h2>
    </div>
  );

  return (
    <div className="ck-root" style={{ background: t.ink, minHeight: "100vh", color: t.text, fontFamily: t.fontBody }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isNarrow ? "20px 14px 56px" : "28px 28px 72px" }}>
        {/* Header */}
        <header style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end", justifyContent: "space-between", borderBottom: `1px solid ${t.inkLine}`, paddingBottom: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div aria-hidden="true" style={{ width: 42, height: 42, borderRadius: 10, border: `1px solid ${t.brassDim}`, display: "grid", placeItems: "center", color: t.brass }}>
              <GitBranch size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: isNarrow ? 23 : 28, margin: 0, color: t.text }}>{t.suite}</h1>
                <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.textMuted }}>{t.name} · v{VERSION}</span>
              </div>
              <p style={{ margin: "4px 0 0", color: t.textMuted, fontStyle: "italic", fontSize: 14 }}>{module.tagline}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span aria-label={`Mode: ${mode}`} style={{ fontFamily: t.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "5px 10px", borderRadius: 6, color: mode === "LIVE" ? t.ink : t.text, background: mode === "LIVE" ? t.brass : "transparent", border: `1px solid ${mode === "LIVE" ? t.brass : t.inkLine}` }}>{mode}</span>
              <Tip id="mode-tip" t={t} label="What the mode means">
                <strong style={{ color: t.brass }}>LIVE</strong> — key set; Claude runs.{" "}
                <strong style={{ color: t.text }}>DEMO</strong> — built-in example loaded.{" "}
                <strong style={{ color: t.text }}>MOCK</strong> — no key; decision modules run their offline logic, lens modules emit prompts to run elsewhere.
              </Tip>
            </div>
            <button type="button" onClick={() => setShowKeyPanel((v) => !v)} aria-label={apiKey ? "Manage API key" : "Add API key to enable LIVE"}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 12, padding: "6px 10px", borderRadius: 7, cursor: "pointer", color: apiKey ? t.ok : t.textMuted, background: "transparent", border: `1px solid ${apiKey ? t.okDim : t.inkLine}` }}>
              <KeyRound size={14} />{apiKey ? "Key set" : "Add key"}
            </button>
            <button type="button" onClick={() => setClientMode((v) => !v)} aria-pressed={clientMode} aria-label="Toggle client mode"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 12, padding: "6px 10px", borderRadius: 7, cursor: "pointer", color: clientMode ? t.ink : t.textMuted, background: clientMode ? t.brass : "transparent", border: `1px solid ${clientMode ? t.brass : t.inkLine}` }}>
              <Power size={14} />Client {clientMode ? "on" : "off"}
            </button>
          </div>
        </header>

        {/* Module switcher */}
        <nav aria-label="Tools" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: t.textMuted, fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.12em", paddingRight: 4 }}>
            <Boxes size={14} /> TOOL
          </span>
          {MODULES.map((m) => {
            const active = m.id === activeId;
            return (
              <button key={m.id} type="button" onClick={() => switchModule(m.id)} aria-pressed={active}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 12, padding: "7px 11px", borderRadius: 8, cursor: "pointer", color: active ? t.ink : t.text, background: active ? t.brass : "transparent", border: `1px solid ${active ? t.brass : t.inkLine}` }}>
                {iconFor(m.icon, active ? t.ink : toneColor(m.kind === "lens" ? "ok" : "brass"), 14)}
                {m.title}
              </button>
            );
          })}
        </nav>

        {/* Key panel */}
        {showKeyPanel && (
          <Panel style={{ marginBottom: 20, borderColor: t.brassDim }}>
            <SectionLabel icon={<KeyRound size={16} color={t.brass} />}>Anthropic API key — enables LIVE</SectionLabel>
            <p style={{ color: t.textMuted, fontSize: 13.5, lineHeight: 1.5, marginTop: 0, marginBottom: 12 }}>
              Held in memory only. Never stored, never logged, never shown back — sent solely to the Anthropic messages endpoint. Without it, decision modules still run their offline logic.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input type="password" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} placeholder="sk-ant-..." aria-label="Anthropic API key" autoComplete="off" spellCheck={false}
                style={{ flex: "1 1 260px", fontFamily: t.fontMono, fontSize: 13, padding: "9px 12px", borderRadius: 8, background: t.ink, color: t.text, border: `1px solid ${t.inkLine}` }} />
              <button type="button" onClick={saveKey} disabled={!keyDraft.trim()}
                style={{ fontFamily: t.fontMono, fontSize: 13, padding: "9px 16px", borderRadius: 8, cursor: keyDraft.trim() ? "pointer" : "not-allowed", color: t.ink, background: keyDraft.trim() ? t.brass : t.brassDim, border: "none", fontWeight: 700, opacity: keyDraft.trim() ? 1 : 0.6 }}>Save key</button>
              {apiKey && (
                <button type="button" onClick={clearKey} style={{ fontFamily: t.fontMono, fontSize: 13, padding: "9px 16px", borderRadius: 8, cursor: "pointer", color: t.danger, background: "transparent", border: `1px solid ${t.dangerDim}` }}>Remove</button>
              )}
            </div>
          </Panel>
        )}

        {/* Intro strip */}
        <Panel style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {iconFor(module.icon, t.brass, 20)}
            <div>
              <h3 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 20, margin: "0 0 4px", color: t.text }}>{module.title}</h3>
              <p style={{ margin: 0, color: t.textMuted, fontSize: 14, lineHeight: 1.5 }}>{module.intro}</p>
            </div>
          </div>
        </Panel>

        {/* ============ DECISION KIND ============ */}
        {module.kind === "decision" && (
          <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "minmax(0,5fr) minmax(0,7fr)", gap: 20 }}>
            <Panel>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <SectionLabel icon={<HelpCircle size={16} color={t.brass} />}>Inputs</SectionLabel>
                {!clientMode && module.demo && (
                  <button type="button" onClick={() => { setAnswers({ ...module.demo }); setDemoActive(true); setLiveText(""); }} style={{ fontFamily: t.fontMono, fontSize: 11.5, padding: "5px 9px", borderRadius: 6, cursor: "pointer", color: t.textMuted, background: "transparent", border: `1px solid ${t.inkLine}` }}>Load example</button>
                )}
              </div>
              {!clientMode && demoActive && module.demoNote && (
                <p style={{ margin: "0 0 12px", fontSize: 12.5, color: t.brass, fontStyle: "italic" }}>{module.demoNote}</p>
              )}
              <div style={{ borderTop: `1px solid ${t.inkLine}`, paddingTop: 14, marginBottom: 4 }}>
                <CoPilotBar t={t} hasKey={!!apiKey} busy={coPilotBusy} aiOn={aiOn} onToggle={() => setAiOn((v) => !v)} onSuggest={() => runSuggest()} onReroll={reroll} onPass={runPass} suggestActive={!!suggestions} />
                {aiOn && suggestions && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button type="button" onClick={applyAllSuggestions} style={{ fontFamily: t.fontMono, fontSize: 12, padding: "6px 11px", borderRadius: 7, cursor: "pointer", color: t.ink, background: t.brass, border: "none", fontWeight: 700 }}>Apply all suggestions</button>
                  </div>
                )}
                {aiOn && suggestError && (
                  <div role="alert" style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}>
                    <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>{suggestError}</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 14 }}>
                {module.questions(clientMode).map((q) => {
                  const sug = aiOn && suggestions && suggestions.fields ? suggestions.fields[q.field] : null;
                  return (
                    <div key={q.field}>
                      <Question t={t} q={q} value={answers[q.field]} onChange={(v) => onAnswer(q.field, v)} />
                      {sug && sug.value && <SuggestChip t={t} q={q} sug={sug} onApply={() => applySuggestion(q.field, sug.value)} />}
                    </div>
                  );
                })}
              </div>
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Panel style={{ borderTop: `3px solid ${toneColor(rec.tone)}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <SectionLabel icon={<ShieldAlert size={16} color={toneColor(rec.tone)} />}>Verdict</SectionLabel>
                  <button type="button" onClick={doExport} aria-label="Export state" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: t.fontMono, fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", color: exportText === "__copied__" ? t.ok : t.textMuted, background: "transparent", border: `1px solid ${exportText === "__copied__" ? t.okDim : t.inkLine}` }}>
                    {exportText === "__copied__" ? <Check size={13} /> : <Download size={13} />}{exportText === "__copied__" ? "Copied" : "Export"}
                  </button>
                </div>
                <div style={{ display: "inline-block", fontFamily: t.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: t.ink, background: toneColor(rec.tone), borderRadius: 6, padding: "4px 9px", marginBottom: 10 }}>{rec.key.replace(/_/g, " ")}</div>
                <h3 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 21, margin: "0 0 10px", color: t.text, lineHeight: 1.25 }}>{rec.headline}</h3>
                <ul style={{ margin: "0 0 4px", paddingLeft: 18, color: t.textMuted, fontSize: 14, lineHeight: 1.6 }}>
                  {rec.rationale.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
                </ul>
                {rec.steps.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 10px" }}>STEPS</p>
                    <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {rec.steps.map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                          <span aria-hidden="true" style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 6, border: `1px solid ${t.brassDim}`, color: t.brass, fontFamily: t.fontMono, fontSize: 12, display: "grid", placeItems: "center" }}>{i + 1}</span>
                          <div>
                            <div style={{ fontSize: 14.5, color: t.text, fontWeight: 600 }}>{s.label}</div>
                            <div style={{ fontSize: 13.5, color: t.textMuted, lineHeight: 1.5 }}>{s.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {rec.commands.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 10px" }}>COMMANDS</p>
                    {rec.commands.map((cmd, i) => (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                          <span style={{ fontSize: 12.5, color: t.text }}>{cmd.label}</span>
                          <CopyButton text={cmd.cmd} t={t} label={`Copy: ${cmd.label}`} />
                        </div>
                        <pre className="ck-scroll" style={{ margin: 0, background: t.ink, border: `1px solid ${t.inkLine}`, borderRadius: 8, padding: "10px 12px", overflowX: "auto", fontFamily: t.fontMono, fontSize: 12.5, color: t.brass, lineHeight: 1.5, whiteSpace: "pre" }}>{cmd.cmd}</pre>
                        {cmd.note && <p style={{ margin: "5px 0 0", fontSize: 12, color: t.textMuted, lineHeight: 1.45 }}>{cmd.note}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              {/* LIVE for decision */}
              <Panel>
                <SectionLabel icon={<Sparkles size={16} color={t.brass} />}>Live second opinion {mode !== "LIVE" && "(needs a key)"}</SectionLabel>
                <textarea value={situation} onChange={(e) => setSituation(e.target.value)} rows={isNarrow ? 4 : 2} aria-label="Extra context"
                  placeholder="Optional: add context Claude should weigh…"
                  style={{ width: "100%", boxSizing: "border-box", fontFamily: t.fontBody, fontSize: 14, padding: "10px 12px", borderRadius: 8, background: t.ink, color: t.text, border: `1px solid ${t.inkLine}`, resize: "vertical" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={runDecisionLive} disabled={analyzing}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 13, padding: "9px 16px", borderRadius: 8, cursor: analyzing ? "wait" : "pointer", color: t.ink, background: t.brass, border: "none", fontWeight: 700, opacity: analyzing ? 0.7 : 1 }}>
                    {analyzing ? <RefreshCw size={14} className="ck-spin" /> : <Sparkles size={14} />}{analyzing ? "Analyzing…" : apiKey ? "Ask Claude" : "Add key to analyze"}
                  </button>
                  {liveError && <button type="button" onClick={runDecisionLive} style={{ fontFamily: t.fontMono, fontSize: 12.5, padding: "8px 12px", borderRadius: 7, cursor: "pointer", color: t.brass, background: "transparent", border: `1px solid ${t.brassDim}` }}>Retry</button>}
                </div>
                {forcedMock && (
                  <div role="status" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}>
                    <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>Fell back to MOCK after a failed call. The verdict above is unaffected — retry when ready.</span>
                  </div>
                )}
                {liveError && !forcedMock && (
                  <div role="alert" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}>
                    <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>{liveError}</span>
                  </div>
                )}
                {liveText && (
                  <div style={{ marginTop: 14, background: t.ink, border: `1px solid ${t.inkLine}`, borderLeft: `3px solid ${t.brass}`, borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Sparkles size={14} color={t.brass} /><span style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted }}>CLAUDE'S READ</span></div>
                    <p style={{ margin: 0, fontSize: 14.5, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{liveText}</p>
                  </div>
                )}
              </Panel>
              {pass.type && <AIPassPanel t={t} pass={pass} onRetry={() => runPass(pass.type)} />}
              {mockPrompt && <MockPromptPanel t={t} mockPrompt={mockPrompt} onClear={() => setMockPrompt(null)} />}
            </div>
          </div>
        )}

        {/* ============ LENS KIND ============ */}
        {module.kind === "lens" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Panel>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <SectionLabel icon={<HelpCircle size={16} color={t.brass} />}>{module.corpusLabel}</SectionLabel>
                <button type="button" onClick={doExport} aria-label="Export" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: t.fontMono, fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", color: exportText === "__copied__" ? t.ok : t.textMuted, background: "transparent", border: `1px solid ${exportText === "__copied__" ? t.okDim : t.inkLine}` }}>
                  {exportText === "__copied__" ? <Check size={13} /> : <Download size={13} />}{exportText === "__copied__" ? "Copied" : "Export"}
                </button>
              </div>
              <textarea value={corpus} onChange={(e) => { setCorpus(e.target.value); setDemoActive(false); }} rows={isNarrow ? 6 : 5} aria-label={module.corpusLabel}
                placeholder={module.corpusPlaceholder}
                style={{ width: "100%", boxSizing: "border-box", fontFamily: t.fontBody, fontSize: 14, padding: "10px 12px", borderRadius: 8, background: t.ink, color: t.text, border: `1px solid ${t.inkLine}`, resize: "vertical" }} />
              <div style={{ marginTop: 14 }}>
                <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 10px" }}>LENSES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {module.lenses.map((l) => {
                    const on = selectedLenses.includes(l.id);
                    const c = toneColor(l.tone);
                    return (
                      <button key={l.id} type="button" onClick={() => toggleLens(l.id)} aria-pressed={on}
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 12, padding: "7px 11px", borderRadius: 8, cursor: "pointer", color: on ? t.ink : t.text, background: on ? c : "transparent", border: `1px solid ${on ? c : t.inkLine}` }}>
                        {iconFor(l.icon, on ? t.ink : c, 14)}{l.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button type="button" onClick={runLensLive} disabled={analyzing}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: t.fontMono, fontSize: 13, padding: "9px 16px", borderRadius: 8, cursor: analyzing ? "wait" : "pointer", color: t.ink, background: t.brass, border: "none", fontWeight: 700, opacity: analyzing ? 0.7 : 1 }}>
                  {analyzing ? <RefreshCw size={14} className="ck-spin" /> : <Sparkles size={14} />}{analyzing ? "Surfacing…" : apiKey ? "Surface findings" : "Add key to run"}
                </button>
                {liveError && <button type="button" onClick={runLensLive} style={{ fontFamily: t.fontMono, fontSize: 12.5, padding: "8px 12px", borderRadius: 7, cursor: "pointer", color: t.brass, background: "transparent", border: `1px solid ${t.brassDim}` }}>Retry</button>}
              </div>
              {(forcedMock || liveError) && (
                <div role={forcedMock ? "status" : "alert"} style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}>
                  <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>{liveError || "Fell back to MOCK — copy the prompts below to run elsewhere."}</span>
                </div>
              )}
              <div style={{ marginTop: 16, borderTop: `1px solid ${t.inkLine}`, paddingTop: 14 }}>
                <CoPilotBar t={t} hasKey={!!apiKey} busy={coPilotBusy} aiOn={aiOn} onToggle={() => setAiOn((v) => !v)} onSuggest={() => runSuggest()} onReroll={reroll} onPass={runPass} suggestActive={!!suggestions} />
                {aiOn && suggestions && suggestions.corpus && (
                  <div style={{ marginTop: 10, background: t.ink, border: `1px solid ${t.inkLine}`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted }}>AI DRAFT MATERIAL</span>
                      <button type="button" onClick={applyAllSuggestions} style={{ fontFamily: t.fontMono, fontSize: 12, padding: "5px 10px", borderRadius: 6, cursor: "pointer", color: t.ink, background: t.brass, border: "none", fontWeight: 700 }}>Use this</button>
                    </div>
                    <p style={{ margin: 0, fontSize: 13.5, color: t.text, lineHeight: 1.5 }}>{suggestions.corpus}</p>
                  </div>
                )}
                {aiOn && suggestError && (
                  <div role="alert" style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}>
                    <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>{suggestError}</span>
                  </div>
                )}
              </div>
            </Panel>

            {/* Findings (LIVE) or prompts (MOCK) */}
            <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr", gap: 16 }}>
              {module.lenses.filter((l) => selectedLenses.includes(l.id)).map((l) => {
                const c = toneColor(l.tone);
                const findings = lensFindings && lensFindings.byLens ? lensFindings.byLens[l.id] : null;
                const live = mode === "LIVE" && lensFindings && lensFindings.matchedAny;
                return (
                  <Panel key={l.id} style={{ borderTop: `3px solid ${c}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{iconFor(l.icon, c, 16)}<span style={{ fontFamily: t.fontDisplay, fontSize: 16, color: t.text }}>{l.label}</span></div>
                      {!live && <CopyButton text={buildSingleLensPrompt(corpus, l)} t={t} label={`Copy ${l.label} prompt`} />}
                    </div>
                    {live ? (
                      findings && findings.length ? (
                        <ul style={{ margin: 0, paddingLeft: 18, color: t.text, fontSize: 14, lineHeight: 1.55 }}>
                          {findings.map((f, i) => <li key={i} style={{ marginBottom: 5 }}>{f}</li>)}
                        </ul>
                      ) : (
                        <p style={{ margin: 0, color: t.textMuted, fontSize: 13.5, fontStyle: "italic" }}>Nothing surfaced for this lens.</p>
                      )
                    ) : (
                      <>
                        <p style={{ margin: "0 0 8px", color: t.textMuted, fontSize: 13.5, lineHeight: 1.5 }}>{l.guiding}</p>
                        <p style={{ margin: 0, color: c, fontSize: 12.5, fontStyle: "italic" }}>{apiKey ? "Run to surface findings, or copy this lens's prompt." : "No key — copy this lens's prompt to run anywhere."}</p>
                      </>
                    )}
                  </Panel>
                );
              })}
            </div>

            {lensFindings && lensFindings.raw && !lensFindings.matchedAny && (
              <Panel style={{ borderColor: t.dangerDim }}>
                <SectionLabel icon={<AlertTriangle size={16} color={t.danger} />}>Unparsed output (shown raw)</SectionLabel>
                <p style={{ margin: 0, fontSize: 13.5, color: t.text, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{lensFindings.raw}</p>
              </Panel>
            )}
            {pass.type && <AIPassPanel t={t} pass={pass} onRetry={() => runPass(pass.type)} />}
            {mockPrompt && <MockPromptPanel t={t} mockPrompt={mockPrompt} onClear={() => setMockPrompt(null)} />}
          </div>
        )}

        {/* Export fallback (clipboard blocked) */}
        {exportText && exportText !== "__copied__" && (
          <Panel style={{ marginTop: 20, borderColor: t.brassDim }}>
            <SectionLabel icon={<Download size={16} color={t.brass} />}>Copy this manually (clipboard was blocked)</SectionLabel>
            <textarea readOnly value={exportText} onFocus={(e) => e.target.select()} rows={10}
              style={{ width: "100%", boxSizing: "border-box", fontFamily: t.fontMono, fontSize: 12, padding: "10px 12px", borderRadius: 8, background: t.ink, color: t.text, border: `1px solid ${t.inkLine}` }} />
          </Panel>
        )}

        <footer style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${t.inkLine}`, color: t.textMuted, fontSize: 12, fontFamily: t.fontMono, lineHeight: 1.5 }}>
          {clientMode
            ? "Client mode: branding and internal specifics stripped. Decision logic runs locally; the key (if set) stays in memory and is never stored."
            : "Internal. Decision logic runs locally; the key (if set) stays in memory and is never stored. Add a module to the registry to grow the suite."}
        </footer>
      </div>
    </div>
  );
}

/*
 * SELF-REVIEW (internal pass):
 *  - Faithful extraction: BRAND, mode logic, key handling, ErrorBoundary, retry/
 *    backoff, a11y, responsive, export are the Untangler's, generalized. The
 *    Untangler is now reproducible as a decision module (its data + a stateMap).
 *  - Anti-patterns: no generic scaffolding — every module encodes real domain
 *    logic (repo lane/secret overrides, credential compromise rules, the $4,500
 *    floor + lane + concurrent-cap gates, the 7 named lenses). No buzzword filler.
 *  - No TODO/placeholder code. The only "<...>" tokens are command fill-ins
 *    (e.g. <owner>/<repo>) the user supplies — intentional, not stubs — and
 *    clientMode genericizations. The "HOW TO ADD A MODULE" block is documentation.
 *  - Every catch handled: callClaude (transient/fatal split + console.error, never
 *    the key/prompt), clipboard (CopyButton + export fallback), ErrorBoundary,
 *    font load (onerror → fallbacks), lens parse (raw fallback panel).
 *  - Lens MOCK never fabricates findings — it emits the exact prompt to run.
 *  - Security: key in state only; never logged/rendered/persisted; one endpoint.
 *  - v1.1 AI co-pilot: opt-in toggle; on-demand calls only (never on mount);
 *    refresh key (counter) rotates suggestions; radio suggestions are tap-to-apply
 *    guesses with confidence dots (never silent fabrication); red-team/gaps/gems
 *    passes reuse callClaude's retry/backoff; MOCK degrades every AI action to a
 *    copyable prompt; suggestion JSON parse has a null-safe fallback.
 *  - Caught in review: inline-rendered engines (not nested components) to avoid
 *    textarea focus loss on re-render; module switch resets all working state.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ConsoleKitApp />
    </ErrorBoundary>
  );
}
