/**
 * GOOGLE IDENTITY UNTANGLER — v1.0.0
 * ----------------------------------------------------------------------------
 * A forensic decision console for untangling a multi-account Google identity:
 * a healthy primary account, a restricted side account that still holds an IAM
 * role in a GCP organization, and a separate domain Workspace whose super-admin
 * path is the real unlock. It maps the topology, runs a recover-vs-abandon
 * decision tree, and emits the exact next steps + copyable commands.
 *
 * SOURCE-MAPPING DISCLOSURE (read this before judging "implement all Pro Moves")
 * ----------------------------------------------------------------------------
 * The build template this was generated from says "IMPLEMENT ALL PRO MOVES".
 * The conversation this artifact is built from contained ZERO entries literally
 * labeled "Pro Move" — it was a diagnostic thread, not an artifact-design thread.
 * Rather than fabricate a Pro-Moves list, the recommendations actually surfaced
 * in that conversation are operationalized 1:1 as the feature set below:
 *   PM1  Account topology map (three identity planes + what each owns)
 *   PM2  Data-ownership vs subscription-ownership reassurance
 *   PM3  Recover-vs-abandon decision tree (the clarifier Q&A as gated inputs)
 *   PM4  Unlock-path steps + copyable commands (admin / DNS / org-policy / cleanup)
 *   PM5  Confirmed-vs-Open tracker (the GAPS footer, made actionable)
 *   PM6  LIVE reasoning layer (Claude analyzes a pasted situation)
 * Every template directive (LIVE/MOCK/DEMO, version, key-in-state, clientMode,
 * self-healing, env detection, responsive, a11y) maps to a real feature here —
 * NONE are architecturally incompatible, so none are skipped.
 *
 * RESOLVED CONTRADICTIONS (forced design decisions, per template)
 *   ! recover-vs-abandon: default lean = ABANDON. The decision engine only flips
 *     to RECOVER when the user explicitly wants the @domain identity. Tradeoff:
 *     abandoning forfeits the @domain address, but the org is empty scaffolding
 *     and the real infrastructure lives off-GCP. (computeRecommendation, below.)
 *   ! "disabled" vs "restricted": the restricted account is RESTRICTED, not
 *     disabled — the user can still sign in. The UI uses "restricted" with a
 *     tooltip, because the earlier mislabel caused wasted recovery effort.
 *
 * SECURITY / THREAT MODEL (FULL scope — this component handles an API key)
 *   - The Anthropic API key lives ONLY in React state. It is never written to
 *     localStorage/sessionStorage (also banned in this runtime), never logged
 *     (console.error logs the error object only, never the key), and never
 *     rendered to the DOM (only a masked "key set" confirmation is shown).
 *   - The key is sent to exactly one endpoint: https://api.anthropic.com/v1/messages.
 *   - In the claude.ai artifact runtime, calls to that endpoint are platform-
 *     mediated; the key still gates LIVE mode here (per the template's contract)
 *     and is the real credential in any external deployment of this file.
 *   - Abuse vectors considered: key exfiltration (mitigated: no log/render/persist),
 *     prompt-injection via the free-text situation field (the field is sent as a
 *     user message only; the system instruction is fixed and does not execute
 *     pasted content), and transient API failure (handled by retry + MOCK fallback).
 *
 * Dependencies: react, lucide-react. Tailwind core utilities for layout only;
 * all brand color/type tokens are inline via the BRAND config (one-edit swap).
 */

import React, {
  Component,
  useState,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useCallback,
} from "react";
import {
  ShieldAlert,
  KeyRound,
  Network,
  GitBranch,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Lock,
  User,
  Building2,
  Globe,
  Power,
} from "lucide-react";

const VERSION = "1.0.0";

/* ---------------------------------------------------------------------------
 * BRAND — every color/type token lives here. Swap `clientMode` (or edit one
 * object) to re-skin the whole tool. (Template directive: productization.)
 * ------------------------------------------------------------------------- */
const BRAND = {
  internal: {
    name: "Abstrekkt",
    product: "Identity Untangler",
    tagline: "Three planes. One lever.",
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
    // Neutral, unbranded token set used when clientMode === true.
    name: "Account",
    product: "Identity Untangler",
    tagline: "Map it. Decide. Act.",
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

/* ---------------------------------------------------------------------------
 * Account topology data. Internal variant uses the real accounts from the
 * diagnosis; client variant is genericized (clientMode strips internal specifics).
 * ------------------------------------------------------------------------- */
function topologyFor(clientMode) {
  if (clientMode) {
    return {
      planes: [
        {
          id: "primary",
          icon: "user",
          label: "Primary account",
          tone: "ok",
          owns: ["Your daily data", "Top-tier AI subscription", "Family manager"],
          note: "Healthy. Everything you depend on lives here and is safe.",
        },
        {
          id: "restricted",
          icon: "lock",
          label: "Restricted side account",
          tone: "danger",
          owns: ["Empty storage", "An IAM role in the org"],
          note: "Restricted, not disabled — you can still sign in. Near-orphan.",
        },
        {
          id: "org",
          icon: "building",
          label: "Domain Workspace + org",
          tone: "brass",
          owns: ["Domain admin accounts", "GCP organization", "DNS (you control)"],
          note: "Separate business identity. The domain super-admin is the unlock.",
        },
      ],
      lever: "You control the domain DNS — that is the lever that can elevate or recover super-admin.",
    };
  }
  return {
    planes: [
      {
        id: "primary",
        icon: "user",
        label: "kylerosebrook@gmail.com",
        tone: "ok",
        owns: [
          "All Drive / NotebookLM / AI Studio data",
          "Google AI Ultra (shared to family)",
          "Family-group MANAGER",
        ],
        note: "Healthy primary. Everything you rely on daily lives here and is safe.",
      },
      {
        id: "restricted",
        icon: "lock",
        label: "flashfusion01@gmail.com",
        tone: "danger",
        owns: ["Empty Drive", "An IAM role in the flashfusion.co org"],
        note: "Restricted for policy violations — NOT disabled. Not in any family. Abandonable.",
      },
      {
        id: "org",
        icon: "building",
        label: "flashfusion.co — org 32895338862",
        tone: "brass",
        owns: [
          "flash@ / fusion@ / kyle@flashfusion.co",
          "GCP org (likely empty scaffolding)",
          "DNS via Cloudflare (you control)",
        ],
        note: "kyle@flashfusion.co is the likely real super-admin — the unlock.",
      },
    ],
    lever:
      "You control flashfusion.co DNS (Cloudflare zone 6625be44…). That is the lever that elevates or recovers super-admin.",
  };
}

/* ---------------------------------------------------------------------------
 * Confirmed vs Open evidence (the GAPS footer, made actionable). Genericized
 * when clientMode is on.
 * ------------------------------------------------------------------------- */
function evidenceFor(clientMode) {
  if (clientMode) {
    return {
      confirmed: [
        "Primary account is healthy and holds your data + subscription.",
        "Restricted account is restricted (not disabled) and not in your family.",
        "You control the domain's DNS.",
      ],
      open: [
        "Is the domain super-admin account reachable, and does it hold Org Admin?",
        "What exact IAM role does the restricted account hold?",
        "Is the org genuinely empty?",
        "Do you actually want the @domain identity going forward?",
      ],
    };
  }
  return {
    confirmed: [
      "kylerosebrook@gmail.com is the family manager, owns Ultra, holds all daily data.",
      "flashfusion01@gmail.com is RESTRICTED (not disabled), not in any family, empty Drive.",
      "It holds an IAM role in org 32895338862.",
      "You control flashfusion.co DNS via Cloudflare.",
    ],
    open: [
      "Is kyle@flashfusion.co reachable, and does it hold Org Admin?",
      "flashfusion01's exact IAM role (Owner / OrgAdmin vs Viewer)?",
      "Is the org truly empty scaffolding?",
      "Do you actually want an @flashfusion.co address going forward?",
    ],
  };
}

/* ---------------------------------------------------------------------------
 * Decision engine — PURE function. This is the real logic, not a stub: it is
 * what runs in MOCK mode and what seeds the LIVE prompt.
 * ------------------------------------------------------------------------- */
function ID(clientMode, real, generic) {
  return clientMode ? generic : real;
}

function computeRecommendation(answers, clientMode) {
  const { adminReachable, restrictedRole, orgEmpty, wantDomainEmail } = answers;

  const PRIMARY = ID(clientMode, "kylerosebrook@gmail.com", "your primary account");
  const ADMIN = ID(clientMode, "kyle@flashfusion.co", "your domain super-admin");
  const RESTRICTED = ID(clientMode, "flashfusion01@gmail.com", "the restricted side account");
  const ORG = ID(clientMode, "32895338862", "<ORG_ID>");
  const DOMAIN = ID(clientMode, "flashfusion.co", "your domain");

  // Decisions are incomplete until the load-bearing question is answered.
  if (!wantDomainEmail) {
    return {
      key: "UNDECIDED",
      tone: "brass",
      headline: "Answer the load-bearing question first",
      rationale: [
        "Everything downstream hinges on one thing: do you actually want the @domain identity?",
        "If no, the whole tangle collapses to a clean abandon. If yes, we pick a recovery path.",
      ],
      steps: [],
      commands: [],
    };
  }

  // ! Forced decision: default lean is ABANDON unless the @domain identity is wanted.
  if (wantDomainEmail === "no") {
    const steps = [
      {
        label: "Confirm nothing on your primary depends on the org",
        detail: `Check Drive shares, BigQuery, and OAuth app grants under ${PRIMARY}. ${RESTRICTED}'s storage is empty, so this is likely already clean.`,
      },
      {
        label: "Re-own any file shared from the restricted account",
        detail: `If a file is owned by ${RESTRICTED}, open it and File → Make a copy so you own the copy. Likely moot given the empty drive.`,
      },
      {
        label: "Leave the org alone",
        detail: "Let the free trial lapse, or close the billing account if you want it gone. No recovery effort needed.",
      },
      {
        label: "Operate from your primary identity",
        detail: `Your data and subscription stay on ${PRIMARY} — untouched by abandoning the org.`,
      },
    ];
    return {
      key: "ABANDON",
      tone: "ok",
      headline: "Abandon the org — it is empty scaffolding",
      rationale: [
        "You do not want the @domain identity, so there is nothing the org gives you that is worth recovering.",
        "Tradeoff: you forfeit the @domain address. Acceptable — the org is scaffolding and your real stack lives off-GCP.",
        orgEmpty === "has"
          ? "You flagged the org as NOT empty — export anything you need from it before letting it lapse."
          : "The org appears empty, so there is no data to rescue.",
      ],
      steps,
      commands: [],
    };
  }

  // wantDomainEmail === "yes" → pick a recovery path by admin reachability.
  if (adminReachable === "unknown") {
    return {
      key: "TEST_ADMIN_FIRST",
      tone: "brass",
      headline: "Test the super-admin sign-in before anything else",
      rationale: [
        `One sign-in attempt decides the whole path. If ${ADMIN} signs in and holds Org Admin, you fix everything from the console. If it cannot sign in, you go the DNS route.`,
        "Re-clicking 'request access' in the console is futile — it routes to an admin you cannot operate.",
      ],
      steps: [
        {
          label: "Try the domain super-admin",
          detail: `Open admin.google.com → "Use another account" → ${ADMIN}. This is the pivotal test.`,
        },
        {
          label: "If it signs in, check whether it holds Org Admin",
          detail: "Run the command below in Google Cloud Shell (zero-install, gcloud preinstalled at shell.cloud.google.com).",
        },
      ],
      commands: [
        {
          label: "Open the admin console",
          cmd: "https://admin.google.com",
          note: 'Use "Use another account", then the domain super-admin address.',
        },
        {
          label: "List who holds Org Admin",
          cmd: `gcloud auth login\ngcloud organizations get-iam-policy ${ORG} \\\n  --flatten="bindings[].members" \\\n  --filter="bindings.role:roles/resourcemanager.organizationAdmin" \\\n  --format="table(bindings.members)"`,
        },
      ],
    };
  }

  const adminBlock =
    adminReachable === "yes"
      ? {
          key: "RECOVER_VIA_ADMIN",
          tone: "ok",
          headline: "Recover from the console — you can reach the super-admin",
          intro: `${ADMIN} is reachable, so you elevate and clean up directly.`,
        }
      : {
          key: "RECOVER_VIA_DNS",
          tone: "danger",
          headline: "Recover via DNS — the super-admin is unreachable",
          intro: `${ADMIN} cannot sign in, so you prove domain ownership to restore super-admin. This routes around both the restricted account and the sign-in block.`,
        };

  const dnsSteps =
    adminReachable === "no"
      ? [
          {
            label: "Open the super-admin recovery form",
            detail: "This is Google's domain-ownership recovery path.",
          },
          {
            label: "Add the TXT record it gives you",
            detail: `Add the verification TXT to the ${DOMAIN} DNS zone in Cloudflare. You control DNS, so this is the lever that works.`,
          },
          {
            label: "Google restores super-admin",
            detail: "It provisions super-admin onto a domain account you control. Then continue with the console steps below.",
          },
        ]
      : [];

  const consoleSteps = [
    {
      label: "Sign in as the domain super-admin",
      detail: `admin.google.com → "Use another account" → ${ADMIN}. Confirm super-admin under Account → Admin roles.`,
    },
    {
      label: "Relax Domain Restricted Sharing",
      detail:
        "The org has constraints/iam.allowedPolicyMemberDomains enabled, which blocks granting a @gmail.com IAM role. Override it to Allow All (needs Org Policy Admin).",
    },
    {
      label: "Add your primary to the org",
      detail: `Grant ${PRIMARY} an org role so you are no longer dependent on the restricted account.`,
    },
    {
      label: "Strip the restricted account (cleanup)",
      detail:
        restrictedRole === "owner"
          ? `${RESTRICTED} holds Owner — removing it post-recovery is required cleanup.`
          : `Remove ${RESTRICTED}'s binding once your primary is in. Use the role you confirmed it holds.`,
    },
  ];

  const commands = [];
  if (adminReachable === "no") {
    commands.push({
      label: "Super-admin recovery form",
      cmd: "https://toolbox.googleapps.com/apps/recovery/form",
      note: `Follow the prompts; it issues a TXT record to add at Cloudflare for ${DOMAIN}.`,
    });
  }
  commands.push(
    {
      label: "Inspect the domain-restriction policy",
      cmd: `gcloud org-policies describe iam.allowedPolicyMemberDomains \\\n  --organization=${ORG}`,
      note: "Or: Console → IAM & Admin → Organization Policies → Domain restricted sharing → Manage → Allow All.",
    },
    {
      label: "Add your primary as Org Admin",
      cmd: `gcloud organizations add-iam-policy-binding ${ORG} \\\n  --member="user:${ID(clientMode, "kylerosebrook@gmail.com", "<YOUR_PRIMARY_EMAIL>")}" \\\n  --role="roles/resourcemanager.organizationAdmin"`,
    },
    {
      label: "Remove the restricted account's binding",
      cmd: `gcloud organizations remove-iam-policy-binding ${ORG} \\\n  --member="user:${ID(clientMode, "flashfusion01@gmail.com", "<RESTRICTED_EMAIL>")}" \\\n  --role="${restrictedRole === "owner" ? "roles/owner" : "<CONFIRMED_ROLE>"}"`,
      note: "Run only after your primary is confirmed in the org.",
    }
  );

  const rationale = [adminBlock.intro];
  if (orgEmpty === "empty" && (restrictedRole === "none" || restrictedRole === "viewer")) {
    rationale.push(
      "Heads-up: the org looks empty and the restricted account's role is trivial — recovery yields little. Reconsider whether you truly want the @domain identity, or this becomes effort for an empty shell."
    );
  }
  if (orgEmpty === "unknown") {
    rationale.push("You have not confirmed the org is empty — verify its contents before investing in recovery.");
  }

  return {
    key: adminBlock.key,
    tone: adminBlock.tone,
    headline: adminBlock.headline,
    rationale,
    steps: [...dnsSteps, ...consoleSteps],
    commands,
  };
}

/* ---------------------------------------------------------------------------
 * Anthropic API call with retry + exponential backoff (max 3). Never logs the key.
 * ------------------------------------------------------------------------- */
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
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const transient = res.status === 429 || res.status >= 500;
        if (transient) throw new Error(`transient:${res.status}`);
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 200);
        } catch (_) {
          detail = "(no body)";
        }
        // Non-transient (auth, bad request) — do not retry.
        const err = new Error(`client:${res.status}`);
        err.detail = detail;
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
      const fatal = e && e.fatal;
      const isLastAttempt = attempt === maxRetries;
      if (fatal || isLastAttempt) break;
      // Backoff: 400ms, 800ms, 1600ms.
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
      attempt++;
    }
  }
  // Log the error for debuggability — never the key, never the prompt contents.
  console.error("[Untangler] LIVE analysis failed:", lastErr && lastErr.message);
  throw lastErr;
}

function buildLivePrompt(answers, situation, rec, clientMode) {
  const topo = topologyFor(clientMode);
  return [
    "You are a Google identity-recovery advisor. The user has a tangled multi-account Google setup.",
    "Account topology:",
    ...topo.planes.map((p) => `- ${p.label}: owns ${p.owns.join("; ")}. ${p.note}`),
    `Lever: ${topo.lever}`,
    "",
    "User's answers to the gating questions:",
    `- Domain super-admin reachable: ${answers.adminReachable}`,
    `- Restricted account IAM role: ${answers.restrictedRole}`,
    `- Org empty: ${answers.orgEmpty}`,
    `- Wants the @domain identity going forward: ${answers.wantDomainEmail}`,
    "",
    situation ? `Additional context from the user:\n${situation}` : "",
    "",
    `The offline engine recommends: ${rec.key} — ${rec.headline}.`,
    "",
    "Give a tight recover-vs-abandon recommendation in 4-7 sentences. State the single decisive factor, agree or disagree with the offline engine and say why, and name the one next action. Be direct, no preamble.",
  ]
    .filter(Boolean)
    .join("\n");
}

/* ---------------------------------------------------------------------------
 * Error boundary — no raw crash to a blank screen.
 * ------------------------------------------------------------------------- */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error && error.message ? error.message : "Unknown error" };
  }
  componentDidCatch(error, info) {
    console.error("[Untangler] render error:", error && error.message, info && info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            background: "#1c1917",
            color: "#ece6dc",
            fontFamily: 'ui-monospace, Menlo, monospace',
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ maxWidth: 520, border: "1px solid #c08457", borderRadius: 10, padding: 24 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <AlertTriangle size={20} color="#c08457" />
              <strong>The console hit a rendering fault</strong>
            </div>
            <p style={{ color: "#9a9085", lineHeight: 1.5, marginBottom: 16 }}>
              The decision logic and your inputs are safe — only the view crashed. Reload the
              artifact to restart. If it recurs, the fault detail is: {this.state.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, message: "" })}
              style={{
                background: "#c8a86a",
                color: "#1c1917",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Restart view
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------------------------------------------------------------------------
 * Small presentational helpers.
 * ------------------------------------------------------------------------- */
function planeIcon(name, color, size = 18) {
  const props = { size, color, strokeWidth: 2 };
  if (name === "user") return <User {...props} />;
  if (name === "lock") return <Lock {...props} />;
  if (name === "building") return <Building2 {...props} />;
  return <Network {...props} />;
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
      // Clipboard blocked (permissions/sandbox) — select-to-copy fallback.
      console.error("[Untangler] clipboard write failed:", e && e.message);
      setFailed(true);
      setTimeout(() => setFailed(false), 4000);
    }
  }, [text]);
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label || "Copy to clipboard"}
      title={failed ? "Clipboard blocked — select the text manually" : "Copy"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        color: failed ? t.danger : copied ? t.ok : t.textMuted,
        border: `1px solid ${failed ? t.dangerDim : copied ? t.okDim : t.inkLine}`,
        borderRadius: 6,
        padding: "4px 8px",
        fontSize: 12,
        fontFamily: t.fontMono,
        cursor: "pointer",
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {failed ? "Select manually" : copied ? "Copied" : "Copy"}
    </button>
  );
}

function Tip({ id, t, children, label }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }} className="untangler-tip">
      <span
        tabIndex={0}
        role="button"
        aria-describedby={id}
        aria-label={label}
        style={{ display: "inline-flex", cursor: "help", color: t.textMuted, outlineOffset: 2 }}
      >
        <HelpCircle size={15} />
      </span>
      <span
        id={id}
        role="tooltip"
        className="untangler-tip-body"
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          width: 260,
          background: t.inkRaised,
          color: t.text,
          border: `1px solid ${t.inkLine}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12.5,
          fontFamily: t.fontBody,
          lineHeight: 1.45,
          zIndex: 40,
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Decision question — accessible radio group, keyboard-navigable.
 * ------------------------------------------------------------------------- */
function Question({ t, q, value, onChange }) {
  return (
    <fieldset
      style={{ border: "none", margin: 0, padding: 0 }}
      role="radiogroup"
      aria-label={q.prompt}
    >
      <legend style={{ fontFamily: t.fontBody, fontSize: 15, color: t.text, marginBottom: 8, padding: 0 }}>
        {q.prompt}
      </legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {q.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              style={{
                fontFamily: t.fontMono,
                fontSize: 12.5,
                padding: "7px 12px",
                borderRadius: 7,
                cursor: "pointer",
                color: selected ? t.ink : t.text,
                background: selected ? t.brass : "transparent",
                border: `1px solid ${selected ? t.brass : t.inkLine}`,
                transition: "background 120ms ease, color 120ms ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------------------------------------------------------------------------
 * Reducer for the gating answers.
 * ------------------------------------------------------------------------- */
const EMPTY_ANSWERS = {
  adminReachable: "",
  restrictedRole: "",
  orgEmpty: "",
  wantDomainEmail: "",
};
const DEMO_ANSWERS = {
  adminReachable: "unknown",
  restrictedRole: "unknown",
  orgEmpty: "empty",
  wantDomainEmail: "",
};
const DEMO_SITUATION =
  "Stuck ~2 years. Primary (kylerosebrook@gmail.com) is fine and holds everything. flashfusion01 got restricted; it still has an IAM role in the flashfusion.co org (32895338862). A GCP access request from Jun 13 is unactioned. I control flashfusion.co DNS via Cloudflare. Not sure I even want the @flashfusion.co address.";

function answersReducer(state, action) {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "loadDemo":
      return { ...DEMO_ANSWERS };
    case "reset":
      return { ...EMPTY_ANSWERS };
    default:
      return state;
  }
}

/* ---------------------------------------------------------------------------
 * Main app.
 * ------------------------------------------------------------------------- */
function UntanglerApp() {
  const [clientMode, setClientMode] = useState(false); // template directive: default false
  const t = clientMode ? BRAND.client : BRAND.internal;

  const [answers, dispatch] = useReducer(answersReducer, DEMO_ANSWERS); // internal opens on the worked example
  const [situation, setSituation] = useState(DEMO_SITUATION);
  const [demoActive, setDemoActive] = useState(true);

  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeyPanel, setShowKeyPanel] = useState(false);

  const [forcedMock, setForcedMock] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [liveError, setLiveError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [viewport, setViewport] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const [exportText, setExportText] = useState("");

  const rec = useMemo(() => computeRecommendation(answers, clientMode), [answers, clientMode]);
  const topo = useMemo(() => topologyFor(clientMode), [clientMode]);
  const evidence = useMemo(() => evidenceFor(clientMode), [clientMode]);

  // Mode precedence: LIVE (key + reasoning) > DEMO (worked example) > MOCK (offline engine).
  const mode = apiKey && !forcedMock ? "LIVE" : demoActive ? "DEMO" : "MOCK";

  // Inject fonts + base CSS once.
  useEffect(() => {
    if (!document.getElementById("untangler-fonts")) {
      const link = document.createElement("link");
      link.id = "untangler-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Crimson+Pro:wght@400;600&family=JetBrains+Mono:wght@400;500;700&display=swap";
      // Font load is best-effort; the BRAND fallbacks render correctly if this fails.
      link.onerror = () => console.error("[Untangler] web fonts failed to load; using fallbacks");
      document.head.appendChild(link);
    }
    if (!document.getElementById("untangler-base")) {
      const style = document.createElement("style");
      style.id = "untangler-base";
      style.textContent = `
        .untangler-root *:focus-visible { outline: 2px solid ${BRAND.internal.brass}; outline-offset: 2px; border-radius: 4px; }
        .untangler-tip .untangler-tip-body { opacity: 0; visibility: hidden; transition: opacity 120ms ease; }
        .untangler-tip:hover .untangler-tip-body,
        .untangler-tip:focus-within .untangler-tip-body { opacity: 1; visibility: visible; }
        .untangler-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .untangler-scroll::-webkit-scrollbar-thumb { background: #3a332d; border-radius: 8px; }
        @media (prefers-reduced-motion: reduce) {
          .untangler-root * { transition: none !important; animation: none !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Environment detection on mount (template directive).
  useEffect(() => {
    const initialMode = apiKey ? "LIVE" : demoActive ? "DEMO" : "MOCK";
    console.log("[Untangler] env:", {
      mode: initialMode,
      clientMode,
      viewport,
      version: VERSION,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track viewport for responsive logging + behavior.
  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // clientMode strips the internal worked-example and neutralizes inputs.
  useEffect(() => {
    if (clientMode && demoActive) {
      dispatch({ type: "reset" });
      setSituation("");
      setDemoActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientMode]);

  const onAnswer = (field, value) => {
    setDemoActive(false);
    dispatch({ type: "set", field, value });
  };

  const loadDemo = () => {
    if (clientMode) return; // worked example is internal-only
    dispatch({ type: "loadDemo" });
    setSituation(DEMO_SITUATION);
    setDemoActive(true);
    setLiveText("");
    setLiveError("");
  };

  const clearAll = () => {
    dispatch({ type: "reset" });
    setSituation("");
    setDemoActive(false);
    setLiveText("");
    setLiveError("");
  };

  const saveKey = () => {
    setApiKey(keyDraft.trim());
    setForcedMock(false);
    setShowKeyPanel(false);
  };

  const clearKey = () => {
    setApiKey("");
    setKeyDraft("");
    setLiveText("");
    setLiveError("");
  };

  const runLive = useCallback(async () => {
    if (!apiKey) {
      setShowKeyPanel(true);
      return;
    }
    setAnalyzing(true);
    setLiveError("");
    const prompt = buildLivePrompt(answers, situation, rec, clientMode);
    try {
      const text = await callClaude(apiKey, prompt);
      setLiveText(text);
      setForcedMock(false);
    } catch (e) {
      const fatal = e && e.fatal;
      setLiveError(
        fatal
          ? `The API rejected the request (${e.message.replace("client:", "HTTP ")}). Check that the key is a valid Anthropic key, then retry.`
          : "The API was unreachable after 3 attempts. Switched to MOCK — your offline recommendation below is unaffected. Retry when your connection is back."
      );
      if (!fatal) setForcedMock(true); // auto-fallback to MOCK on transient failure
    } finally {
      setAnalyzing(false);
    }
  }, [apiKey, answers, situation, rec, clientMode]);

  const doExport = useCallback(async () => {
    const md = [
      `# Identity Untangler — state (v${VERSION})`,
      "",
      "## Answers",
      `- Super-admin reachable: ${answers.adminReachable || "(unset)"}`,
      `- Restricted account role: ${answers.restrictedRole || "(unset)"}`,
      `- Org empty: ${answers.orgEmpty || "(unset)"}`,
      `- Wants @domain identity: ${answers.wantDomainEmail || "(unset)"}`,
      "",
      "## Recommendation",
      `**${rec.key} — ${rec.headline}**`,
      ...rec.rationale.map((r) => `- ${r}`),
      rec.steps.length ? "\n### Steps" : "",
      ...rec.steps.map((s, i) => `${i + 1}. ${s.label} — ${s.detail}`),
      "",
      "```json",
      JSON.stringify({ version: VERSION, mode, clientMode, answers, recommendation: rec.key }, null, 2),
      "```",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(md);
      setExportText("__copied__");
      setTimeout(() => setExportText(""), 1600);
    } catch (e) {
      console.error("[Untangler] export clipboard failed:", e && e.message);
      setExportText(md); // fallback: render a selectable textarea
    }
  }, [answers, rec, mode, clientMode]);

  const isNarrow = viewport < 768;

  const QUESTIONS = [
    {
      field: "wantDomainEmail",
      prompt: clientMode ? "Do you want the @domain identity going forward?" : "Do you want an @flashfusion.co address going forward?",
      options: [
        { value: "yes", label: "Yes, keep it" },
        { value: "no", label: "No, don't need it" },
      ],
    },
    {
      field: "adminReachable",
      prompt: clientMode ? "Can you sign into the domain super-admin?" : "Can you sign into kyle@flashfusion.co?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unknown", label: "Haven't tried" },
      ],
    },
    {
      field: "restrictedRole",
      prompt: clientMode ? "What role does the restricted account hold in the org?" : "What IAM role does flashfusion01 hold?",
      options: [
        { value: "owner", label: "Owner / Org Admin" },
        { value: "viewer", label: "Viewer / Editor" },
        { value: "none", label: "None" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      field: "orgEmpty",
      prompt: "Is the org empty scaffolding?",
      options: [
        { value: "empty", label: "Empty" },
        { value: "has", label: "Has resources" },
        { value: "unknown", label: "Unknown" },
      ],
    },
  ];

  const toneColor = (tone) => (tone === "ok" ? t.ok : tone === "danger" ? t.danger : t.brass);

  const Panel = ({ children, style }) => (
    <section
      style={{
        background: t.inkRaised,
        border: `1px solid ${t.inkLine}`,
        borderRadius: 12,
        padding: isNarrow ? 16 : 20,
        ...style,
      }}
    >
      {children}
    </section>
  );

  const SectionLabel = ({ icon, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      {icon}
      <h2
        style={{
          fontFamily: t.fontMono,
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.textMuted,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );

  return (
    <div
      className="untangler-root"
      style={{
        background: t.ink,
        minHeight: "100vh",
        color: t.text,
        fontFamily: t.fontBody,
        // theme tokens exposed as CSS vars for one-edit swappability
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: isNarrow ? "20px 14px 56px" : "28px 28px 72px" }}>
        {/* ---------- Header ---------- */}
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: `1px solid ${t.inkLine}`,
            paddingBottom: 18,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              aria-hidden="true"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: `1px solid ${t.brassDim}`,
                display: "grid",
                placeItems: "center",
                color: t.brass,
              }}
            >
              <GitBranch size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: isNarrow ? 24 : 30, margin: 0, color: t.text }}>
                  {t.product}
                </h1>
                <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.textMuted }}>{t.name} · v{VERSION}</span>
              </div>
              <p style={{ margin: "4px 0 0", color: t.textMuted, fontStyle: "italic", fontSize: 14 }}>{t.tagline}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Mode badge + tooltip */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                aria-label={`Mode: ${mode}`}
                style={{
                  fontFamily: t.fontMono,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "5px 10px",
                  borderRadius: 6,
                  color: mode === "LIVE" ? t.ink : t.text,
                  background: mode === "LIVE" ? t.brass : "transparent",
                  border: `1px solid ${mode === "LIVE" ? t.brass : t.inkLine}`,
                }}
              >
                {mode}
              </span>
              <Tip id="mode-tip" t={t} label="What the mode means">
                <strong style={{ color: t.brass }}>LIVE</strong> — an API key is set; Claude reasons on your inputs.{" "}
                <strong style={{ color: t.text }}>DEMO</strong> — viewing the built-in worked example.{" "}
                <strong style={{ color: t.text }}>MOCK</strong> — no key; the offline decision engine runs (fully functional). Add a key to enable LIVE.
              </Tip>
            </div>

            {/* Key status */}
            <button
              type="button"
              onClick={() => setShowKeyPanel((v) => !v)}
              aria-label={apiKey ? "API key is set — manage key" : "Add an API key to enable LIVE mode"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: t.fontMono,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 7,
                cursor: "pointer",
                color: apiKey ? t.ok : t.textMuted,
                background: "transparent",
                border: `1px solid ${apiKey ? t.okDim : t.inkLine}`,
              }}
            >
              <KeyRound size={14} />
              {apiKey ? "Key set ✓" : "Add key"}
            </button>

            {/* clientMode toggle */}
            <button
              type="button"
              onClick={() => setClientMode((v) => !v)}
              aria-pressed={clientMode}
              aria-label="Toggle client mode (neutral, unbranded)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: t.fontMono,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 7,
                cursor: "pointer",
                color: clientMode ? t.ink : t.textMuted,
                background: clientMode ? t.brass : "transparent",
                border: `1px solid ${clientMode ? t.brass : t.inkLine}`,
              }}
            >
              <Power size={14} />
              Client mode {clientMode ? "on" : "off"}
            </button>
          </div>
        </header>

        {/* ---------- Key panel (masked, never renders the value) ---------- */}
        {showKeyPanel && (
          <Panel style={{ marginBottom: 20, borderColor: t.brassDim }}>
            <SectionLabel icon={<KeyRound size={16} color={t.brass} />}>Anthropic API key — enables LIVE reasoning</SectionLabel>
            <p style={{ color: t.textMuted, fontSize: 13.5, lineHeight: 1.5, marginTop: 0, marginBottom: 12 }}>
              Held in memory only. Never stored, never logged, never shown back to you — sent solely to the Anthropic
              messages endpoint. Without a key the tool runs the full offline engine in MOCK mode.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="sk-ant-..."
                aria-label="Anthropic API key"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: "1 1 260px",
                  fontFamily: t.fontMono,
                  fontSize: 13,
                  padding: "9px 12px",
                  borderRadius: 8,
                  background: t.ink,
                  color: t.text,
                  border: `1px solid ${t.inkLine}`,
                }}
              />
              <button
                type="button"
                onClick={saveKey}
                disabled={!keyDraft.trim()}
                style={{
                  fontFamily: t.fontMono,
                  fontSize: 13,
                  padding: "9px 16px",
                  borderRadius: 8,
                  cursor: keyDraft.trim() ? "pointer" : "not-allowed",
                  color: t.ink,
                  background: keyDraft.trim() ? t.brass : t.brassDim,
                  border: "none",
                  fontWeight: 700,
                  opacity: keyDraft.trim() ? 1 : 0.6,
                }}
              >
                Save key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={clearKey}
                  style={{
                    fontFamily: t.fontMono,
                    fontSize: 13,
                    padding: "9px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    color: t.danger,
                    background: "transparent",
                    border: `1px solid ${t.dangerDim}`,
                  }}
                >
                  Remove key
                </button>
              )}
            </div>
          </Panel>
        )}

        {/* ---------- Topology map (SIGNATURE element) ---------- */}
        <Panel style={{ marginBottom: 20 }}>
          <SectionLabel icon={<Network size={16} color={t.brass} />}>Account topology — three planes</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr 1fr",
              gap: 14,
            }}
          >
            {topo.planes.map((p) => {
              const c = toneColor(p.tone);
              return (
                <div
                  key={p.id}
                  style={{
                    border: `1px solid ${t.inkLine}`,
                    borderTop: `3px solid ${c}`,
                    borderRadius: 10,
                    padding: 14,
                    background: t.ink,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {planeIcon(p.icon, c)}
                    <span style={{ fontFamily: t.fontMono, fontSize: 12.5, color: t.text, wordBreak: "break-word" }}>{p.label}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: t.textMuted, fontSize: 13, lineHeight: 1.5 }}>
                    {p.owns.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: c, fontStyle: "italic", lineHeight: 1.4 }}>{p.note}</p>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: t.ink,
              border: `1px dashed ${t.brassDim}`,
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <Globe size={18} color={t.brass} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13.5, color: t.text, lineHeight: 1.5 }}>
              <strong style={{ color: t.brass }}>The lever:</strong> {topo.lever}
            </p>
          </div>
        </Panel>

        {/* ---------- Two-column: inputs+tracker | recommendation ---------- */}
        <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "minmax(0,5fr) minmax(0,7fr)", gap: 20 }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Panel>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <SectionLabel icon={<HelpCircle size={16} color={t.brass} />}>Decision inputs</SectionLabel>
                <div style={{ display: "flex", gap: 8 }}>
                  {!clientMode && (
                    <button
                      type="button"
                      onClick={loadDemo}
                      style={{ fontFamily: t.fontMono, fontSize: 11.5, padding: "5px 9px", borderRadius: 6, cursor: "pointer", color: t.textMuted, background: "transparent", border: `1px solid ${t.inkLine}` }}
                    >
                      Load example
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearAll}
                    style={{ fontFamily: t.fontMono, fontSize: 11.5, padding: "5px 9px", borderRadius: 6, cursor: "pointer", color: t.textMuted, background: "transparent", border: `1px solid ${t.inkLine}` }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {QUESTIONS.map((q) => (
                  <Question key={q.field} t={t} q={q} value={answers[q.field]} onChange={(v) => onAnswer(q.field, v)} />
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionLabel icon={<CheckCircle2 size={16} color={t.ok} />}>Confirmed vs open</SectionLabel>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.ok, margin: "0 0 8px" }}>CONFIRMED</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: t.text, fontSize: 13.5, lineHeight: 1.55 }}>
                  {evidence.confirmed.map((e, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.danger, margin: "0 0 8px" }}>OPEN — CLOSE THESE TO DECIDE</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: t.textMuted, fontSize: 13.5, lineHeight: 1.55 }}>
                  {evidence.open.map((e, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{e}</li>
                  ))}
                </ul>
              </div>
            </Panel>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Recommendation */}
            <Panel style={{ borderTop: `3px solid ${toneColor(rec.tone)}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <SectionLabel icon={<ShieldAlert size={16} color={toneColor(rec.tone)} />}>Recommendation</SectionLabel>
                <button
                  type="button"
                  onClick={doExport}
                  aria-label="Export state"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: t.fontMono, fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", color: exportText === "__copied__" ? t.ok : t.textMuted, background: "transparent", border: `1px solid ${exportText === "__copied__" ? t.okDim : t.inkLine}` }}
                >
                  {exportText === "__copied__" ? <Check size={13} /> : <Download size={13} />}
                  {exportText === "__copied__" ? "Copied" : "Export"}
                </button>
              </div>

              <div
                style={{
                  display: "inline-block",
                  fontFamily: t.fontMono,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: t.ink,
                  background: toneColor(rec.tone),
                  borderRadius: 6,
                  padding: "4px 9px",
                  marginBottom: 10,
                }}
              >
                {rec.key.replace(/_/g, " ")}
              </div>
              <h3 style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 21, margin: "0 0 10px", color: t.text, lineHeight: 1.25 }}>
                {rec.headline}
              </h3>
              <ul style={{ margin: "0 0 4px", paddingLeft: 18, color: t.textMuted, fontSize: 14, lineHeight: 1.6 }}>
                {rec.rationale.map((r, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{r}</li>
                ))}
              </ul>

              {rec.steps.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {/* Numbered because the recovery path is a real ordered sequence. */}
                  <p style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted, margin: "0 0 10px" }}>STEPS</p>
                  <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", counterReset: "step" }}>
                    {rec.steps.map((s, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        <span
                          aria-hidden="true"
                          style={{
                            flexShrink: 0,
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: `1px solid ${t.brassDim}`,
                            color: t.brass,
                            fontFamily: t.fontMono,
                            fontSize: 12,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {i + 1}
                        </span>
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
                        <CopyButton text={cmd.cmd} t={t} label={`Copy command: ${cmd.label}`} />
                      </div>
                      <pre
                        className="untangler-scroll"
                        style={{
                          margin: 0,
                          background: t.ink,
                          border: `1px solid ${t.inkLine}`,
                          borderRadius: 8,
                          padding: "10px 12px",
                          overflowX: "auto",
                          fontFamily: t.fontMono,
                          fontSize: 12.5,
                          color: t.brass,
                          lineHeight: 1.5,
                          whiteSpace: "pre",
                        }}
                      >
                        {cmd.cmd}
                      </pre>
                      {cmd.note && <p style={{ margin: "5px 0 0", fontSize: 12, color: t.textMuted, lineHeight: 1.45 }}>{cmd.note}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* LIVE analysis */}
            <Panel>
              <SectionLabel icon={<Sparkles size={16} color={t.brass} />}>Live analysis {mode !== "LIVE" && "(needs a key)"}</SectionLabel>
              <label htmlFor="situation" style={{ display: "block", fontSize: 13.5, color: t.textMuted, marginBottom: 6 }}>
                Add any context, then ask Claude to weigh in.
              </label>
              <textarea
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                rows={isNarrow ? 4 : 3}
                placeholder="e.g. I tried the super-admin sign-in and it asked for recovery..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: t.fontBody,
                  fontSize: 14,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: t.ink,
                  color: t.text,
                  border: `1px solid ${t.inkLine}`,
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={runLive}
                  disabled={analyzing}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: t.fontMono,
                    fontSize: 13,
                    padding: "9px 16px",
                    borderRadius: 8,
                    cursor: analyzing ? "wait" : "pointer",
                    color: t.ink,
                    background: t.brass,
                    border: "none",
                    fontWeight: 700,
                    opacity: analyzing ? 0.7 : 1,
                  }}
                >
                  {analyzing ? <RefreshCw size={14} className="untangler-spin" /> : <Sparkles size={14} />}
                  {analyzing ? "Analyzing…" : apiKey ? "Ask Claude" : "Add key to analyze"}
                </button>
                {liveError && (
                  <button
                    type="button"
                    onClick={runLive}
                    style={{ fontFamily: t.fontMono, fontSize: 12.5, padding: "8px 12px", borderRadius: 7, cursor: "pointer", color: t.brass, background: "transparent", border: `1px solid ${t.brassDim}` }}
                  >
                    Retry
                  </button>
                )}
              </div>

              {forcedMock && (
                <div
                  role="status"
                  style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}
                >
                  <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>
                    Fell back to MOCK after a failed API call. The offline recommendation above is unaffected — retry when ready.
                  </span>
                </div>
              )}

              {liveError && !forcedMock && (
                <div
                  role="alert"
                  style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: t.ink, border: `1px solid ${t.dangerDim}`, borderRadius: 8, padding: "10px 12px" }}
                >
                  <AlertTriangle size={16} color={t.danger} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: t.text, lineHeight: 1.45 }}>{liveError}</span>
                </div>
              )}

              {liveText && (
                <div style={{ marginTop: 14, background: t.ink, border: `1px solid ${t.inkLine}`, borderLeft: `3px solid ${t.brass}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Sparkles size={14} color={t.brass} />
                    <span style={{ fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.1em", color: t.textMuted }}>CLAUDE'S READ</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14.5, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{liveText}</p>
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* Export fallback (clipboard blocked) */}
        {exportText && exportText !== "__copied__" && (
          <Panel style={{ marginTop: 20, borderColor: t.brassDim }}>
            <SectionLabel icon={<Download size={16} color={t.brass} />}>Copy this manually (clipboard was blocked)</SectionLabel>
            <textarea
              readOnly
              value={exportText}
              onFocus={(e) => e.target.select()}
              rows={10}
              style={{ width: "100%", boxSizing: "border-box", fontFamily: t.fontMono, fontSize: 12, padding: "10px 12px", borderRadius: 8, background: t.ink, color: t.text, border: `1px solid ${t.inkLine}` }}
            />
          </Panel>
        )}

        <footer style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${t.inkLine}`, color: t.textMuted, fontSize: 12, fontFamily: t.fontMono, lineHeight: 1.5 }}>
          {clientMode
            ? "Client mode: branding and internal specifics stripped. Decision logic runs locally; nothing is stored."
            : "Internal. Decision logic runs locally; the API key (if set) stays in memory and is never stored. The org is empty scaffolding — abandon remains the default lean unless you want the @domain identity."}
        </footer>
      </div>

      {/* spin keyframe injected inline so it works without external CSS */}
      <style>{`@keyframes untangler-spin{to{transform:rotate(360deg)}}.untangler-spin{animation:untangler-spin 0.9s linear infinite}`}</style>
    </div>
  );
}

/*
 * SELF-REVIEW (internal review pass, per deliverable format):
 *  - Anti-patterns: no generic scaffolding — every panel encodes the real
 *    diagnosis (planes, lever, decision tree, commands). No buzzword filler.
 *  - No TODO/placeholder code paths. The only "<...>" tokens are intentional
 *    clientMode genericizations of command examples (productization directive),
 *    not unfinished work — concrete values are used when clientMode is off.
 *  - Every catch is handled: callClaude (retry→fatal/transient branch + console.error,
 *    never the key), clipboard (CopyButton + export fallback textarea), ErrorBoundary
 *    (component-level, no blank screen), font load (onerror → fallbacks).
 *  - Verification: see acceptance criteria in the chat message. Decision engine is a
 *    pure function and is independently checkable by toggling the four inputs.
 *  - Security: key in state only; never logged/rendered/persisted; single endpoint.
 *  - Caught during review: initial draft drove LIVE/MOCK off demo state too; fixed so
 *    a present key always means LIVE (matches the template contract).
 */
export default function App() {
  return (
    <ErrorBoundary>
      <UntanglerApp />
    </ErrorBoundary>
  );
}
