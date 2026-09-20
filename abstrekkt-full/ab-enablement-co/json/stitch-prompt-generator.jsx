import { useState, useMemo, useRef, useCallback, useEffect } from "react";

// ─── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#08091A", surface: "#0D0F24", card: "#12142E", cardHi: "#171A3E",
  border: "rgba(244,114,182,.13)", borderHi: "rgba(244,114,182,.28)",
  rose: "#F472B6", cyan: "#22D3EE", ember: "#D4651C",
  text: "#F0ECF7", text2: "#9B93B0", text3: "#3C3760",
};

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORMS = ["iOS", "Android", "Web"];
const MOODS = ["warm","polished","intelligent","calm","premium","playful","focused","minimal","bold","cinematic","trustworthy","spacious"];
const FONTS = ["Inter","Poppins","DM Sans","Plus Jakarta Sans","Outfit","Nunito","Geist"];
const CATS = ["Onboarding","Auth","Home","Core Feature","Secondary","Profile","Settings","Empty State"];
const ICON_STYLES = ["thin-line modern","rounded filled","outlined sharp","phosphor icons"];
const NAV_STYLES = ["bottom tab bar","top navigation bar","hamburger drawer","tab bar + FAB","no persistent nav"];

const PRESET_THEMES = [
  { name: "Signal",        primary: "#F472B6", secondary: "#22D3EE", bg: "#FBF8F4", card: "#FFFFFF", textPrimary: "#0F0F1A", textSecondary: "#6B7280", font: "Inter",    radius: 12, iconStyle: "thin-line modern", navStyle: "bottom tab bar" },
  { name: "Warm Consumer", primary: "#E8725A", secondary: "#A8C5B0", bg: "#FBF8F4", card: "#FFFFFF", textPrimary: "#1E2A3A", textSecondary: "#6B7280", font: "Poppins",  radius: 16, iconStyle: "rounded filled",   navStyle: "bottom tab bar" },
  { name: "Fintech Trust", primary: "#2563EB", secondary: "#10B981", bg: "#F8FAFC", card: "#FFFFFF", textPrimary: "#0F172A", textSecondary: "#64748B", font: "DM Sans",  radius: 8,  iconStyle: "outlined sharp",    navStyle: "tab bar + FAB" },
  { name: "Midnight Op.",  primary: "#A855F7", secondary: "#3DD9B3", bg: "#0B0B09", card: "#1A1A17", textPrimary: "#F0ECF7", textSecondary: "#9B93B0", font: "Poppins",  radius: 14, iconStyle: "thin-line modern", navStyle: "bottom tab bar" },
];

const PRESET_SCREENS = {
  Productivity: [
    { name: "Onboarding — Welcome",     cat: "Onboarding",   desc: "Hero illustration, app value prop headline, 2-line subtext, primary CTA 'Get started', secondary 'Sign in'" },
    { name: "Onboarding — Permissions", cat: "Onboarding",   desc: "Notification permission request card, icon, benefit copy, Allow / Skip buttons" },
    { name: "Sign In",                  cat: "Auth",          desc: "Email + password inputs, 'Forgot password' link, primary Sign In CTA, divider, OAuth row (Google / Apple)" },
    { name: "Dashboard",                cat: "Home",          desc: "Greeting header with avatar, Today's summary card, task progress ring, quick-add FAB, recent activity list" },
    { name: "Task Detail",              cat: "Core Feature",  desc: "Task title editable, description textarea, due date picker row, priority selector chips, subtask checklist, assignee avatar row, CTA bar: Complete / Delete" },
    { name: "Profile",                  cat: "Profile",       desc: "Avatar + name + role, stats row (tasks/streak/completed), settings list, sign out row" },
  ],
  Social: [
    { name: "Onboarding — Value",  cat: "Onboarding",  desc: "Full-bleed imagery, headline, subtext, Next CTA, skip link" },
    { name: "Create Account",      cat: "Auth",         desc: "Username, email, password inputs, Terms checkbox, Create Account CTA, already have account link" },
    { name: "Feed",                cat: "Home",         desc: "Stories row, post cards (avatar + name + time + content + media + like/comment/share row), FAB compose" },
    { name: "Post Detail",         cat: "Core Feature", desc: "Post content full-width, like/comment counts, comments list, comment input pinned bottom" },
    { name: "Profile",             cat: "Profile",      desc: "Cover image, avatar, name, bio, follower/following stats, post grid, follow/message buttons" },
    { name: "Notifications",       cat: "Secondary",    desc: "Grouped notifications: Today / Earlier, each row: avatar, action text, time, dot for unread" },
  ],
  Fintech: [
    { name: "Onboarding — Trust",  cat: "Onboarding",  desc: "Security badges, 3-feature highlight row, Get started CTA, regulatory footnote" },
    { name: "Verify Identity",     cat: "Auth",         desc: "Progress steps header, document type selector cards, upload area, Continue CTA" },
    { name: "Balance Overview",    cat: "Home",         desc: "Total balance card with show/hide toggle, accounts list per account, quick actions: Send/Receive/Pay/Top up, recent transactions" },
    { name: "Send Money",          cat: "Core Feature", desc: "Recipient search input, recent contacts row, amount input with currency selector, note field, fee breakdown, Confirm CTA" },
    { name: "Transaction Detail",  cat: "Secondary",    desc: "Status badge, amount large, merchant logo + name, date/time, reference number, category tag, receipt upload area" },
    { name: "Settings",            cat: "Settings",     desc: "Account section: profile, security, linked accounts. App: notifications, appearance, language. Support: help, feedback, logout" },
  ],
};

const CAT_DEFAULTS = {
  Onboarding:     "Hero visual, headline H1, supporting 2-line subtext, primary CTA, skip/back link, progress dots",
  Auth:           "Input fields with labels and validation states, primary CTA, secondary link, optional OAuth row",
  Home:           "Personalized greeting header, summary metric card(s), primary content list or feed, FAB, bottom navigation",
  "Core Feature": "Content header with back navigation, main content area, action bar pinned bottom, contextual overflow menu",
  Secondary:      "List or grid of items, filter/sort bar, item cards with thumbnail + metadata, empty state",
  Profile:        "Avatar + name + metadata header, stats row, content section list, edit/settings CTA",
  Settings:       "Grouped settings list with section headers, toggle rows, disclosure rows, destructive action at bottom",
  "Empty State":  "Centered illustration (80px), descriptive headline, supportive subtext, primary action CTA",
};

// ─── AI API helper ────────────────────────────────────────────────────────────
async function callClaude(prompt, maxTokens = 600) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  return text.replace(/```json|```/g, "").trim();
}

// ─── Style helpers ────────────────────────────────────────────────────────────
const inp = {
  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6,
  color: T.text, fontFamily: "'Inter',sans-serif", fontSize: 12,
  padding: "7px 10px", width: "100%", outline: "none", boxSizing: "border-box",
};
const monoLabel = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: T.text2,
  letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 5,
};
const aiBtn = (loading) => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  background: loading ? "rgba(212,101,28,.05)" : "rgba(212,101,28,.1)",
  border: `1px solid ${loading ? "rgba(212,101,28,.15)" : "rgba(212,101,28,.35)"}`,
  borderRadius: 4, color: loading ? T.text3 : T.ember,
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: ".06em",
  padding: "3px 9px", cursor: loading ? "not-allowed" : "pointer",
  transition: "all .15s", flexShrink: 0,
});

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ num, children, extra }) {
  return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: T.rose, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
      <span>{num}</span><span style={{ color: T.text3 }}>—</span><span>{children}</span>
      {extra && <span style={{ marginLeft: "auto", color: T.text2, fontSize: 9 }}>{extra}</span>}
    </div>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", ...style }}>
      {children}
    </div>
  );
}

function AiLabel({ loading, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: T.ember, fontSize: 9 }}>{loading ? "⟳" : "✦"}</span>
      <span>{loading ? "thinking…" : label}</span>
    </span>
  );
}

function ErrorPill({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(192,80,80,.12)", border: "1px solid rgba(192,80,80,.25)", borderRadius: 5, padding: "4px 10px", marginTop: 6 }}>
      <span style={{ fontSize: 10, color: "#F87171", flex: 1, fontFamily: "'IBM Plex Mono',monospace" }}>⚠ {msg}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss error" style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>
    </div>
  );
}

function StepBar({ step }) {
  const steps = ["Basics", "Mood", "Screens", "Design", "Copy"];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 18, background: T.card, borderRadius: 8, padding: "8px 12px", border: `1px solid ${T.border}` }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step > i ? "rgba(244,114,182,.2)" : step === i ? "rgba(244,114,182,.1)" : "transparent", border: `1px solid ${step >= i ? T.rose : T.border}`, fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: step >= i ? T.rose : T.text3, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 10, color: step >= i ? T.text : T.text3, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: step > i ? "rgba(244,114,182,.3)" : T.border, margin: "0 8px" }} />}
        </div>
      ))}
    </div>
  );
}

// ─── Prompt generators ────────────────────────────────────────────────────────
function genPhase0(s) {
  return `You are a senior mobile product designer and UX architect.

I am designing a ${s.platform} app in Google Stitch${s.appName ? ` called "${s.appName}"` : ""}. Help me plan the full screen system before generating anything.

App concept: ${s.concept || "[describe your app]"}
Target users: ${s.targetUser || "[who uses it]"}
Platform: ${s.platStr}
Visual mood: ${s.moodStr}

Output:

1. Complete screen inventory grouped by user journey
   (Onboarding · Auth · Home · Core Features · Secondary · Profile/Settings · Empty/Error)

2. Screen-by-screen component plan
   For each screen: header, content sections, cards, buttons, inputs,
   navigation, AI/helper elements, empty/loading/error states, primary CTA, secondary CTA

3. Shared design system:
   Primary:       ${s.primary}
   Secondary:     ${s.secondary}
   Background:    ${s.bg}
   Card surface:  ${s.cardColor}
   Text primary:  ${s.textPrimary}
   Text secondary:${s.textSecondary}
   Font:          ${s.font}
   Radius:        ${s.radius}px
   Icon style:    ${s.iconStyle}
   Navigation:    ${s.navStyle}

4. Batch plan — split screens into groups of 2–4 related screens

5. Copy-paste-ready Stitch prompt per batch using:
   Context / Screens / Components / Style / Platform

Keep design language consistent across all prompts. Use exact hex codes only.`;
}

function genBatches(s) {
  if (!s.batches.length) return "Add screens in section 03 to generate batch prompts.";
  return s.batches.map((b, i) => {
    const screenList = b.screens.map((sc, j) => `${j + 1}. ${sc.name}`).join("\n");
    const components = b.screens.map(sc => {
      const desc = sc.desc?.trim() ? sc.desc.trim() : CAT_DEFAULTS[sc.cat] || "Header, main content area, primary CTA, empty/loading state";
      return `${sc.name}:\n${desc}`;
    }).join("\n\n");
    return `BATCH ${i + 1} — ${b.cat}
${"─".repeat(42)}
Context:
Design ${b.screens.length} ${s.platform} screen${b.screens.length > 1 ? "s" : ""} for ${s.appName || "[App Name]"}, ${s.concept || "a [product type]"} for ${s.targetUser || "[target users]"}. Visual mood: ${s.moodStr}. All screens must share an identical visual language.

Screens to generate:
${screenList}

Components:
${components}

Style:
— Background:     ${s.bg}
— Card surface:   ${s.cardColor}, subtle shadow, ${s.radius}px border radius
— Primary:        ${s.primary} — buttons, active states, FABs, CTAs, progress
— Secondary:      ${s.secondary} — chips, highlights, success, accents
— Text primary:   ${s.textPrimary}
— Text secondary: ${s.textSecondary}
— Font:           ${s.font}
— Buttons:        ${s.radius}px radius, primary bg, white text, medium weight, 48px height
— Inputs:         ${Math.max(s.radius - 2, 4)}px radius, light border, clear labels, validation states
— Icons:          ${s.iconStyle}
— Navigation:     ${s.navStyle}
— Spacing:        16px screen padding, 12px between cards, 20px section gaps
— Mood:           ${s.moodStr}
— Avoid: inconsistent fonts, arbitrary gradients, missing navigation,
  mismatched icon weights, oversized decorative elements

Platform: ${s.platStr}, high-fidelity UI, production-ready, app-store-quality polish.`;
  }).join("\n\n\n");
}

function genTheme(s) {
  return `Apply a consistent visual design system across ALL selected screens.

Do not change screen content or user flows. Normalize only:
color, typography, spacing, components, icons, and navigation.

Design system:
— Background:     ${s.bg}
— Card surface:   ${s.cardColor}, subtle shadow, ${s.radius}px border radius
— Primary:        ${s.primary}
   → buttons, FABs, active nav states, progress indicators, key CTAs
— Secondary:      ${s.secondary}
   → chips, highlights, success states, secondary accents
— Text primary:   ${s.textPrimary}
— Text secondary: ${s.textSecondary}
— Muted text:     ~40% opacity of text primary
— Font:           ${s.font} — headings semibold, body regular, labels medium
— Buttons:        ${s.radius}px radius, primary bg, white text, 48px height
— Inputs:         ${Math.max(s.radius - 2, 4)}px radius, 1px light border, clear placeholder, 48px height
— Icons:          ${s.iconStyle}, consistent stroke, 24px standard
— Navigation:     ${s.navStyle}
   active = ${s.primary} · inactive = ${s.textSecondary}
— Spacing:        16px outer padding, 12px between cards, 20px between sections
— Cards:          consistent padding 16px, same radius and shadow throughout
— Mood:           ${s.moodStr}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StitchGenerator() {
  const idRef        = useRef(0);
  const copyTimerRef = useRef(null);

  // App basics
  const [appName,    setAppName]    = useState("");
  const [concept,    setConcept]    = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [platform,   setPlatform]   = useState("iOS");

  // Mood
  const [moods, setMoods] = useState(["polished", "focused"]);

  // Screens
  const [screens,          setScreens]          = useState([]);
  const [newScreen,        setNewScreen]        = useState("");
  const [newCat,           setNewCat]           = useState("Home");
  const [expandedScreenId, setExpandedScreenId] = useState(null);

  // Design system
  const [dsPreset,       setDsPreset]       = useState(null);
  const [primary,        setPrimary]        = useState("#E8725A");
  const [secondary,      setSecondary]      = useState("#A8C5B0");
  const [bg,             setBg]             = useState("#FBF8F4");
  const [cardColor,      setCardColor]      = useState("#FFFFFF");
  const [textPrimary,    setTextPrimary]    = useState("#1E2A3A");
  const [textSecondary,  setTextSecondary]  = useState("#6B7280");
  const [font,           setFont]           = useState("Inter");
  const [radius,         setRadius]         = useState(12);
  const [iconStyle,      setIconStyle]      = useState("thin-line modern");
  const [navStyle,       setNavStyle]       = useState("bottom tab bar");

  // Output
  const [tab,    setTab]    = useState("phase0");
  const [copied, setCopied] = useState(false);

  // AI loading + error state — keyed by action
  const [aiLoading, setAiLoading] = useState({});
  const [aiErrors,  setAiErrors]  = useState({});

  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);

  const setLoading = (key, val) => setAiLoading(p => ({ ...p, [key]: val }));
  const setError   = (key, msg) => setAiErrors(p => ({ ...p, [key]: msg }));
  const clearError = (key)      => setAiErrors(p => { const n = { ...p }; delete n[key]; return n; });

  // ─── Derived ──────────────────────────────────────────────────────────────
  const moodStr = moods.length ? moods.join(", ") : "polished, focused";
  const platStr = platform === "iOS" ? "iOS mobile, 393px width"
                : platform === "Android" ? "Android mobile, 411px width"
                : "responsive web app, 390px mobile-first";

  const batches = useMemo(() => {
    const byCat = {};
    screens.forEach(s => { (byCat[s.cat] = byCat[s.cat] || []).push(s); });
    const out = [];
    Object.entries(byCat).forEach(([cat, ss]) => {
      for (let i = 0; i < ss.length; i += 3) out.push({ cat, screens: ss.slice(i, i + 3) });
    });
    return out;
  }, [screens]);

  const currentStep = useMemo(() => {
    if (tab !== "phase0" || batches.length > 0) return 4;
    if (screens.length > 0) return 3;
    if (moods.length > 0) return 2;
    if (appName || concept) return 1;
    return 0;
  }, [appName, concept, moods, screens, tab, batches]);

  const state = { appName, concept, targetUser, platform, moodStr, platStr, primary, secondary, bg, cardColor, textPrimary, textSecondary, font, radius, iconStyle, navStyle, batches };

  const outputText = useMemo(() => {
    if (tab === "phase0") return genPhase0(state);
    if (tab === "batches") return genBatches(state);
    return genTheme(state);
  }, [tab, appName, concept, targetUser, platform, moods, screens, primary, secondary, bg, cardColor, textPrimary, textSecondary, font, radius, iconStyle, navStyle]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const toggleMood = useCallback(m => {
    setMoods(prev => {
      if (prev.includes(m)) return prev.filter(x => x !== m);
      if (prev.length >= 4) return prev;
      return [...prev, m];
    });
  }, []);

  const addScreen = useCallback(() => {
    const name = newScreen.trim();
    if (!name) return;
    const id = ++idRef.current;
    setScreens(prev => [...prev, { name, cat: newCat, desc: "", id }]);
    setNewScreen("");
  }, [newScreen, newCat]);

  const removeScreen = useCallback(id => {
    setScreens(prev => prev.filter(s => s.id !== id));
    setExpandedScreenId(prev => prev === id ? null : prev);
  }, []);

  const updateScreenDesc = useCallback((id, desc) => {
    setScreens(prev => prev.map(s => s.id === id ? { ...s, desc } : s));
  }, []);

  const moveScreen = useCallback((id, dir) => {
    setScreens(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const applyPreset = useCallback((preset) => {
    setDsPreset(preset.name);
    setPrimary(preset.primary); setSecondary(preset.secondary);
    setBg(preset.bg); setCardColor(preset.card);
    setTextPrimary(preset.textPrimary); setTextSecondary(preset.textSecondary);
    setFont(preset.font); setRadius(preset.radius);
    setIconStyle(preset.iconStyle); setNavStyle(preset.navStyle);
  }, []);

  const loadPresetScreens = useCallback(key => {
    const list = PRESET_SCREENS[key];
    if (!list) return;
    setScreens(list.map(s => ({ ...s, id: ++idRef.current })));
  }, []);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [outputText]);

  const download = useCallback(() => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `stitch-${tab}-${Date.now()}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }, [outputText, tab]);

  // ─── AI actions ──────────────────────────────────────────────────────────

  // Fill basics from concept
  const aiBasics = useCallback(async () => {
    if (!concept.trim()) { setError("basics", "Add a concept first"); return; }
    setLoading("basics", true); clearError("basics");
    try {
      const raw = await callClaude(
        `You are a product naming assistant. Given this app concept, return ONLY valid JSON with no explanation, no markdown, no extra text:\n\nConcept: "${concept}"\nPlatform: ${platform}\n\nReturn this exact JSON shape:\n{"name":"short memorable app name (1-2 words)","targetUser":"specific user description (10-25 words)"}`,
        200
      );
      const parsed = JSON.parse(raw);
      if (parsed.name)       setAppName(parsed.name);
      if (parsed.targetUser) setTargetUser(parsed.targetUser);
    } catch (e) { setError("basics", "Couldn't parse response — try again"); }
    setLoading("basics", false);
  }, [concept, platform]);

  // Suggest moods from concept + app name
  const aiMoods = useCallback(async () => {
    const ctx = [appName, concept].filter(Boolean).join(" — ");
    if (!ctx.trim()) { setError("moods", "Add a concept first"); return; }
    setLoading("moods", true); clearError("moods");
    try {
      const raw = await callClaude(
        `You are a UX designer selecting visual moods for a mobile app.\n\nApp: "${ctx}"\nPlatform: ${platform}\nAvailable moods: ${MOODS.join(", ")}\n\nReturn ONLY valid JSON, no explanation:\n{"moods":["mood1","mood2","mood3"]}\n\nPick exactly 3 moods that best fit the app's personality. Only use words from the available list.`,
        150
      );
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.moods)) {
        const valid = parsed.moods.filter(m => MOODS.includes(m)).slice(0, 4);
        if (valid.length) setMoods(valid);
      }
    } catch (e) { setError("moods", "Couldn't parse response — try again"); }
    setLoading("moods", false);
  }, [appName, concept, platform]);

  // Generate full screen list from concept
  const aiScreens = useCallback(async () => {
    const ctx = [appName, concept, targetUser].filter(Boolean).join(" · ");
    if (!ctx.trim()) { setError("screens", "Add a concept first"); return; }
    setLoading("screens", true); clearError("screens");
    try {
      const raw = await callClaude(
        `You are a senior mobile UX architect planning screens for a ${platform} app.\n\nApp: "${ctx}"\n\nReturn ONLY valid JSON, no explanation, no markdown:\n{"screens":[{"name":"Screen Name","cat":"Category","desc":"specific component description"}]}\n\nRules:\n- 6–10 screens total\n- cat must be one of: Onboarding, Auth, Home, Core Feature, Secondary, Profile, Settings, Empty State\n- desc should be specific UI components for THIS app (2-4 components per screen)\n- Always include: one Onboarding, one Auth, one Home, one Core Feature\n- Name screens specifically for this app, not generically`,
        800
      );
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.screens) && parsed.screens.length) {
        setScreens(parsed.screens.map(s => ({
          name: s.name || "Untitled",
          cat:  CATS.includes(s.cat) ? s.cat : "Home",
          desc: s.desc || "",
          id:   ++idRef.current,
        })));
      }
    } catch (e) { setError("screens", "Couldn't parse response — try again"); }
    setLoading("screens", false);
  }, [appName, concept, targetUser, platform]);

  // Generate component description for a single screen
  const aiScreenDesc = useCallback(async (screen) => {
    const ctx = [appName, concept].filter(Boolean).join(" — ");
    const key = `desc_${screen.id}`;
    setLoading(key, true); clearError(key);
    try {
      const raw = await callClaude(
        `You are a senior mobile UI designer writing a component specification for a ${platform} app screen.\n\nApp: "${ctx || "mobile app"}"\nScreen: "${screen.name}" (category: ${screen.cat})\n\nReturn ONLY valid JSON, no markdown:\n{"desc":"component description"}\n\nThe desc should:\n- List 3–5 specific UI components for this exact screen\n- Be written as comma-separated component descriptions\n- Be specific to the app concept, not generic\n- Be under 80 words\n- Include: layout anchors (header/bottom bar), primary content, key CTAs`,
        250
      );
      const parsed = JSON.parse(raw);
      if (parsed.desc) updateScreenDesc(screen.id, parsed.desc);
    } catch (e) { setError(key, "Try again"); }
    setLoading(key, false);
  }, [appName, concept, platform, updateScreenDesc]);

  // Suggest design system from concept + moods
  const aiDesignSystem = useCallback(async () => {
    const ctx = [appName, concept].filter(Boolean).join(" — ");
    if (!ctx.trim()) { setError("design", "Add a concept first"); return; }
    setLoading("design", true); clearError("design");
    try {
      const raw = await callClaude(
        `You are a senior UI designer choosing a design system for a mobile app.\n\nApp: "${ctx}"\nMood: ${moodStr}\nPlatform: ${platform}\n\nReturn ONLY valid JSON, no markdown, no explanation:\n{"primary":"#hex","secondary":"#hex","bg":"#hex","card":"#hex","textPrimary":"#hex","textSecondary":"#hex","font":"FontName","radius":12,"iconStyle":"style","navStyle":"style"}\n\nRules:\n- All colors as 6-digit hex codes\n- bg should be light (luminance > 0.8) unless mood is dark/midnight/cinematic\n- primary must contrast 4.5:1 against bg\n- font must be one of: Inter, Poppins, DM Sans, Plus Jakarta Sans, Outfit, Nunito, Geist\n- iconStyle one of: thin-line modern, rounded filled, outlined sharp, phosphor icons\n- navStyle one of: bottom tab bar, top navigation bar, hamburger drawer, tab bar + FAB, no persistent nav\n- radius between 4 and 24`,
        300
      );
      const p = JSON.parse(raw);
      if (p.primary)       setPrimary(p.primary);
      if (p.secondary)     setSecondary(p.secondary);
      if (p.bg)            setBg(p.bg);
      if (p.card)          setCardColor(p.card);
      if (p.textPrimary)   setTextPrimary(p.textPrimary);
      if (p.textSecondary) setTextSecondary(p.textSecondary);
      if (p.font && FONTS.includes(p.font)) setFont(p.font);
      if (typeof p.radius === "number") setRadius(Math.min(24, Math.max(0, p.radius)));
      if (p.iconStyle && ICON_STYLES.includes(p.iconStyle)) setIconStyle(p.iconStyle);
      if (p.navStyle && NAV_STYLES.includes(p.navStyle))   setNavStyle(p.navStyle);
      setDsPreset(null);
    } catch (e) { setError("design", "Couldn't parse response — try again"); }
    setLoading("design", false);
  }, [appName, concept, moodStr, platform]);

  const TAB_LABELS = [
    ["phase0",  "① Planning"],
    ["batches", `② Batches${batches.length ? ` (${batches.length})` : ""}`],
    ["theme",   "③ Normalize"],
  ];

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ background: T.bg, minHeight: "100%", fontFamily: "'Inter',sans-serif", color: T.text, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        input:focus,textarea:focus,select:focus{border-color:rgba(244,114,182,.4)!important;outline:none}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3C3760;border-radius:2px}
        input[type=color]{-webkit-appearance:none;appearance:none}
        input[type=color]::-webkit-color-swatch-wrapper{padding:0}
        input[type=color]::-webkit-color-swatch{border:none;border-radius:4px}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        .ai-pulse{animation:pulse 1.2s ease-in-out infinite}
      `}</style>

      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 65% 45% at 8% 0%,rgba(244,114,182,.07) 0%,transparent 60%),radial-gradient(ellipse 55% 40% at 92% 95%,rgba(34,211,238,.06) 0%,transparent 55%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: T.rose, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: T.rose }}>FlashFusion</span>
          <span aria-hidden="true" style={{ color: T.text3 }}>·</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15 }}>Stitch Prompt Generator</span>
          <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: T.text3 }}>v3.0</span>
        </div>

        <StepBar step={currentStep} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, alignItems: "start" }}>

          {/* ── LEFT ───────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* 01 Basics */}
            <Panel>
              <SectionLabel num="01">App Basics</SectionLabel>
              <div style={{ marginBottom: 10 }}>
                <span style={monoLabel}>App Name</span>
                <input style={inp} value={appName} maxLength={60} onChange={e => setAppName(e.target.value)} placeholder="e.g. Lumin" aria-label="App name" />
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ ...monoLabel, marginBottom: 0, flex: 1 }}>Concept <span style={{ color: T.text3 }}>({concept.length}/500)</span></span>
                </div>
                <textarea style={{ ...inp, resize: "vertical", minHeight: 58, lineHeight: 1.55 }} value={concept} maxLength={500} onChange={e => setConcept(e.target.value)} placeholder="A calm focus timer for remote workers who struggle with context switching" aria-label="App concept" />
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={monoLabel}>Target User</span>
                <input style={inp} value={targetUser} maxLength={120} onChange={e => setTargetUser(e.target.value)} placeholder="Freelancers and remote workers, 25–40" aria-label="Target user" />
              </div>

              {/* AI fill basics */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                <button type="button" onClick={aiBasics} disabled={aiLoading.basics} style={aiBtn(aiLoading.basics)} aria-label="AI: fill name and target user from concept">
                  <span className={aiLoading.basics ? "ai-pulse" : ""}><AiLabel loading={aiLoading.basics} label="Fill name + user" /></span>
                </button>
                <span style={{ fontSize: 9, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>from concept</span>
              </div>
              <ErrorPill msg={aiErrors.basics} onDismiss={() => clearError("basics")} />

              <div style={{ marginTop: 12 }}>
                <span style={monoLabel}>Platform</span>
                <div style={{ display: "flex", gap: 6 }} role="group" aria-label="Platform">
                  {PLATFORMS.map(p => (
                    <button key={p} type="button" onClick={() => setPlatform(p)} aria-pressed={platform === p}
                      style={{ background: platform === p ? "rgba(244,114,182,.15)" : "transparent", border: `1px solid ${platform === p ? T.rose : T.border}`, borderRadius: 5, color: platform === p ? T.rose : T.text2, fontFamily: "'Inter',sans-serif", fontSize: 11, padding: "5px 14px", cursor: "pointer" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

            {/* 02 Mood */}
            <Panel>
              <SectionLabel num="02" extra={`${moods.length}/4`}>Mood</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }} role="group" aria-label="Mood — pick up to 4">
                {MOODS.map(m => {
                  const on = moods.includes(m);
                  const maxed = !on && moods.length >= 4;
                  return (
                    <button key={m} type="button" onClick={() => toggleMood(m)} disabled={maxed} aria-pressed={on}
                      style={{ background: on ? "rgba(244,114,182,.12)" : "transparent", border: `1px solid ${on ? T.rose : T.border}`, borderRadius: 4, color: on ? T.rose : maxed ? T.text3 : T.text2, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "3px 9px", cursor: maxed ? "not-allowed" : "pointer", opacity: maxed ? 0.4 : 1 }}>
                      {m}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                <button type="button" onClick={aiMoods} disabled={aiLoading.moods} style={aiBtn(aiLoading.moods)} aria-label="AI: suggest moods from concept">
                  <AiLabel loading={aiLoading.moods} label="Suggest moods" />
                </button>
                <span style={{ fontSize: 9, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>picks 3 that fit your concept</span>
              </div>
              <ErrorPill msg={aiErrors.moods} onDismiss={() => clearError("moods")} />
            </Panel>

            {/* 03 Screens */}
            <Panel>
              <SectionLabel num="03" extra={`${screens.length} screens · ${batches.length} batches`}>Screens</SectionLabel>

              {/* Preset packs */}
              <div style={{ marginBottom: 10 }}>
                <span style={monoLabel}>Quick-add preset</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {Object.keys(PRESET_SCREENS).map(key => (
                    <button key={key} type="button" onClick={() => loadPresetScreens(key)}
                      style={{ background: "rgba(34,211,238,.06)", border: "1px solid rgba(34,211,238,.2)", borderRadius: 4, color: T.cyan, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>
                      {key}
                    </button>
                  ))}
                  {screens.length > 0 && (
                    <button type="button" onClick={() => setScreens([])} aria-label="Clear all screens"
                      style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 4, color: T.text3, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* AI generate screens */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 10px", background: T.surface, borderRadius: 6, border: `1px solid rgba(212,101,28,.15)` }}>
                <button type="button" onClick={aiScreens} disabled={aiLoading.screens} style={aiBtn(aiLoading.screens)} aria-label="AI: generate screen list from concept">
                  <AiLabel loading={aiLoading.screens} label="Generate screens" />
                </button>
                <span style={{ fontSize: 9, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>builds full list + descriptions from concept</span>
              </div>
              <ErrorPill msg={aiErrors.screens} onDismiss={() => clearError("screens")} />

              {/* Manual add */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 6, marginBottom: 6 }}>
                <input style={inp} value={newScreen} maxLength={60} onChange={e => setNewScreen(e.target.value)} onKeyDown={e => e.key === "Enter" && addScreen()} placeholder="Screen name" aria-label="New screen name" />
                <select style={{ ...inp, cursor: "pointer" }} value={newCat} onChange={e => setNewCat(e.target.value)} aria-label="Screen category">
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="button" onClick={addScreen}
                style={{ width: "100%", background: "rgba(244,114,182,.08)", border: "1px solid rgba(244,114,182,.28)", borderRadius: 6, color: T.rose, fontFamily: "'Inter',sans-serif", fontSize: 11, padding: "6px", cursor: "pointer", marginBottom: 10 }}>
                + Add screen
              </button>

              {/* Screen list */}
              {screens.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflowY: "auto" }}>
                  {screens.map((s, idx) => {
                    const descKey = `desc_${s.id}`;
                    const isExpanded = expandedScreenId === s.id;
                    return (
                      <div key={s.id} style={{ background: T.surface, borderRadius: 6, border: `1px solid ${isExpanded ? "rgba(244,114,182,.2)" : T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <button type="button" onClick={() => moveScreen(s.id, -1)} disabled={idx === 0} aria-label={`Move ${s.name} up`}
                              style={{ background: "none", border: "none", color: idx === 0 ? T.text3 : T.text2, cursor: idx === 0 ? "default" : "pointer", fontSize: 8, padding: 0, lineHeight: 1 }}>▲</button>
                            <button type="button" onClick={() => moveScreen(s.id, 1)} disabled={idx === screens.length - 1} aria-label={`Move ${s.name} down`}
                              style={{ background: "none", border: "none", color: idx === screens.length - 1 ? T.text3 : T.text2, cursor: idx === screens.length - 1 ? "default" : "pointer", fontSize: 8, padding: 0, lineHeight: 1 }}>▼</button>
                          </div>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: T.cyan, minWidth: 66, flexShrink: 0 }}>{s.cat}</span>
                          <span style={{ flex: 1, fontSize: 11 }}>{s.name}</span>
                          <button type="button" onClick={() => setExpandedScreenId(prev => prev === s.id ? null : s.id)}
                            aria-label={`${isExpanded ? "Collapse" : "Edit"} ${s.name}`}
                            style={{ background: "none", border: "none", color: s.desc ? T.rose : T.text3, cursor: "pointer", fontSize: 10, padding: "0 3px" }}>
                            {isExpanded ? "▾" : "✎"}
                          </button>
                          <button type="button" onClick={() => removeScreen(s.id)} aria-label={`Remove ${s.name}`}
                            style={{ background: "none", border: "none", color: T.text3, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: "0 8px 8px" }}>
                            <textarea
                              value={s.desc}
                              onChange={e => updateScreenDesc(s.id, e.target.value)}
                              placeholder={CAT_DEFAULTS[s.cat] || "Describe UI components for this screen"}
                              maxLength={400}
                              aria-label={`Components for ${s.name}`}
                              style={{ ...inp, fontSize: 11, lineHeight: 1.5, minHeight: 60, resize: "vertical", borderColor: "rgba(244,114,182,.2)" }}
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                              <button type="button" onClick={() => aiScreenDesc(s)} disabled={aiLoading[descKey]}
                                style={aiBtn(aiLoading[descKey])} aria-label={`AI: generate description for ${s.name}`}>
                                <AiLabel loading={aiLoading[descKey]} label="Generate description" />
                              </button>
                              <span style={{ marginLeft: "auto", fontSize: 9, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>{s.desc.length}/400</span>
                            </div>
                            <ErrorPill msg={aiErrors[descKey]} onDismiss={() => clearError(descKey)} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* 04 Design System */}
            <Panel>
              <SectionLabel num="04">Design System</SectionLabel>

              {/* Presets */}
              <div style={{ marginBottom: 12 }}>
                <span style={monoLabel}>Theme preset</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {PRESET_THEMES.map(p => (
                    <button key={p.name} type="button" onClick={() => applyPreset(p)} aria-pressed={dsPreset === p.name}
                      style={{ background: dsPreset === p.name ? "rgba(244,114,182,.12)" : "rgba(244,114,182,.04)", border: `1px solid ${dsPreset === p.name ? T.rose : T.border}`, borderRadius: 4, color: dsPreset === p.name ? T.rose : T.text2, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}>
                      {p.name}
                    </button>
                  ))}
                  {dsPreset && (
                    <button type="button" onClick={() => setDsPreset(null)}
                      style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 4, color: T.text3, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "4px 10px", cursor: "pointer" }}>
                      Custom
                    </button>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[["Primary", primary, setPrimary], ["Secondary", secondary, setSecondary], ["Background", bg, setBg], ["Card", cardColor, setCardColor], ["Text primary", textPrimary, setTextPrimary], ["Text secondary", textSecondary, setTextSecondary]].map(([label, val, fn]) => (
                  <div key={label}>
                    <span style={monoLabel}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <input type="color" value={val} onChange={e => { fn(e.target.value); setDsPreset(null); }} aria-label={`${label} color`}
                        style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0, borderRadius: 4 }} />
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: T.text2 }}>{val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Font + Radius */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <span style={monoLabel}>Font</span>
                  <select style={{ ...inp, cursor: "pointer" }} value={font} onChange={e => { setFont(e.target.value); setDsPreset(null); }} aria-label="Font">
                    {FONTS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <span style={monoLabel}>Radius — {radius}px</span>
                  <input type="range" min={0} max={24} step={1} value={radius} onChange={e => { setRadius(+e.target.value); setDsPreset(null); }} aria-label={`Border radius ${radius}px`} style={{ width: "100%", marginTop: 7 }} />
                </div>
              </div>

              {/* Icon + Nav */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div>
                  <span style={monoLabel}>Icon style</span>
                  <select style={{ ...inp, cursor: "pointer", fontSize: 11 }} value={iconStyle} onChange={e => { setIconStyle(e.target.value); setDsPreset(null); }} aria-label="Icon style">
                    {ICON_STYLES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <span style={monoLabel}>Navigation</span>
                  <select style={{ ...inp, cursor: "pointer", fontSize: 11 }} value={navStyle} onChange={e => { setNavStyle(e.target.value); setDsPreset(null); }} aria-label="Navigation style">
                    {NAV_STYLES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* AI design system */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                <button type="button" onClick={aiDesignSystem} disabled={aiLoading.design} style={aiBtn(aiLoading.design)} aria-label="AI: suggest design system from concept">
                  <AiLabel loading={aiLoading.design} label="Suggest design system" />
                </button>
                <span style={{ fontSize: 9, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>colors, font, radius, icons, nav</span>
              </div>
              <ErrorPill msg={aiErrors.design} onDismiss={() => clearError("design")} />
            </Panel>
          </div>

          {/* ── RIGHT: Output ─────────────────────────────────────────── */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", position: "sticky", top: 16 }}>

            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }} role="tablist">
              {TAB_LABELS.map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
                  style={{ flex: 1, background: tab === key ? "rgba(244,114,182,.07)" : "transparent", border: "none", borderBottom: `2px solid ${tab === key ? T.rose : "transparent"}`, color: tab === key ? T.rose : T.text2, fontFamily: "'Inter',sans-serif", fontSize: 10, padding: "10px 4px", cursor: "pointer", fontWeight: tab === key ? 600 : 400 }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding: "8px 14px 2px", fontSize: 10, color: T.text3, fontFamily: "'IBM Plex Mono',monospace" }}>
              {tab === "phase0" && "① run in Claude or ChatGPT before opening Stitch"}
              {tab === "batches" && "② paste each batch into Stitch — one at a time"}
              {tab === "theme"   && "③ shift+click all screens → paste once to normalize"}
            </div>

            <div style={{ display: "flex", gap: 6, padding: "8px 12px 6px", justifyContent: "flex-end" }}>
              <button type="button" onClick={download} aria-label="Download as .txt"
                style={{ background: "rgba(34,211,238,.06)", border: "1px solid rgba(34,211,238,.2)", borderRadius: 4, color: T.cyan, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: ".08em", padding: "4px 10px", cursor: "pointer" }}>
                ↓ .TXT
              </button>
              <button type="button" onClick={copy} aria-label="Copy to clipboard"
                style={{ background: copied ? "rgba(34,211,238,.1)" : "rgba(244,114,182,.08)", border: `1px solid ${copied ? "rgba(34,211,238,.4)" : "rgba(244,114,182,.28)"}`, borderRadius: 4, color: copied ? T.cyan : T.rose, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: ".08em", padding: "4px 12px", cursor: "pointer" }}>
                {copied ? "COPIED ✓" : "COPY ALL"}
              </button>
            </div>

            <pre role="region" aria-label="Generated prompt" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, margin: "0 12px 14px", padding: "12px 14px", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: T.text2, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 580, overflowY: "auto" }}>
              {outputText}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
