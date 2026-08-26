# Settings, Account & Admin Surfaces

Prompts for daily-driver configuration and administration UIs. These are the
highest-value, most state-heavy screens — generate them FIRST so the rest of the
system inherits their component patterns.

> Each prompt assumes the Brand Header + Enforcement Block + Prompt 0 are already
> pasted above it. The "max-depth" variant is the source-1 deep spec; the
> "compact" line is the source-2 paste-ready form for tools that truncate long input.

---

## P01 — Enterprise Settings Console (Account / Privacy / Notifications)
*Audit: states ✓✓✓✓✓✓✓ (full coverage). Generate in Batch 1.*

**COMPACT (paste-ready):**
```
Design a complex Settings panel for a SaaS app with a left nav and right content
pane. Sections: Account, Privacy, Notifications, Billing, Security, Integrations,
Appearance, Accessibility, Advanced.
Requirements:
- Left nav: searchable, collapsible groups, active state, badges ("2 changes pending").
- Right pane: section header, description, grouped cards, inline validation, save/discard sticky bar.
- Controls: toggles, dropdowns, radio groups, text fields, danger-zone destructive actions.
- Include "Reset to defaults" + "Export settings".
- States: default, loading skeleton, error toast, success toast, unsaved changes, disabled.
Output: desktop-first 1440 + responsive notes for 1024/768.
```

**MAX-DEPTH SYSTEM ROLE:** You are a principal product designer + staff frontend
architect. You build enterprise-grade, daily-driver settings experiences comparable
to Stripe, Linear, Notion, and Google Admin.

**INFORMATION ARCHITECTURE**
- A) Global Settings Home — overview cards (Security health, Notification status,
  Active sessions, Plan status, Integration health) + recent-changes feed (audit preview).
- B) Section groups (left nav):
  1. **Account** — Profile, Identity (email/phone verification), Password & MFA,
     Connected accounts (Google/Microsoft/GitHub), Data export, Delete account (danger zone).
  2. **Privacy** — granular data-collection toggles, visibility/discoverability,
     workspace privacy defaults, cookie preferences, data retention (user + org-level).
  3. **Notifications** — channels (email/push/in-app/SMS), per-feature topic
     subscriptions, quiet hours + timezone rules, digest schedule, escalation rules.
  4. **Security** — MFA enforcement policy, SSO/SAML, device management + session
     lifetime, IP allowlist, API keys + rotation, full audit logs.
  5. **Billing** — plan, usage metering, invoices, payment methods, seats & roles.
  6. **Integrations** — marketplace, connected-app detail pages, webhooks config, OAuth scopes viewer.
  7. **Admin (role-gated)** — members & roles, RBAC policy editor, default workspace settings, compliance exports.

**CORE COMPONENTS:** SettingsSearch (fuzzy across labels+descriptions), LeftNavGroup +
LeftNavItem (badges), SettingsSectionHeader (title/description/status pill), SettingsCard;
ControlRow patterns: ToggleRow, SelectRow, TextRow (mask/unmask, copy), RadioRow, SliderRow
(numeric mirror), KeyValueRow; InlineValidation, StickySaveBar, ConfirmationModal,
MFASetupDrawer (stepper), APIKeyManager (create / reveal once / rotate / revoke / scope picker),
SessionsTable (device/IP/location/last-active/revoke), AuditLogTable (filterable + export),
Toast system + ActivityFeed.

**INTERACTION & STATE:** every control gets default/hover/focus/active/disabled/loading;
unsaved changes → field-level dirty indicators + sticky save bar + navigate-away confirm;
**optimistic UI for low-risk toggles, pessimistic for security/billing**; role-gated views
(viewer/editor/admin) show locked rows with "Admin required"; empty/error/retry flows.

**DATA MODEL (realistic, required):** notification topics, quiet hours, digest schedule;
MFA status + backup-codes presence; 3 sessions; 10 audit-log rows; 2 API keys with scopes;
8 privacy toggles. Validation rules: password policy, webhook URL format, IP allowlist CIDR.

**A11Y GUARDRAILS:** WCAG AA contrast; keyboard-only nav across all controls;
labels/aria-describedby for helper + error text; focus traps in modals/drawers (escape closes
where safe); reduced-motion support.

**OUTPUT CONTRACT (return all):** 1) full page map + routes 2) component tree (props + events)
3) interaction spec (states + flows) 4) mock data JSON for all sections 5) error/empty/loading
patterns 6) export-ready Figma frame description + tokens list 7) implementation-ready
React/Angular component plan (no placeholder labels).

---

## P03 — Android Profile Editor (Material 3, offline-safe)
*Audit [FIX-1.3]: Figma output is an intermediate mapping reference, not final Android code.*

**COMPACT:**
```
Create a mobile user profile editing UI for Android (Material 3). Fields: photo
upload, name, username, bio, email, phone, location, pronouns (optional), privacy
toggles.
Requirements:
- Material 3 components: top app bar, filled text fields, segmented buttons,
  date picker, bottom sheet photo picker.
- Validation: inline errors + helper text; "Save" disabled until valid changes.
- States: loading, saving, success snackbar, network error, offline.
Output: export as Figma with Material 3 components clearly labeled (TextInput,
Button, DatePicker, etc.). Developers reference the Figma file to implement in
Android XML/Kotlin (it is a mapping aid, not generated code).
```

**MAX-DEPTH SYSTEM ROLE:** Senior Android product designer (Material You) + mobile
frontend engineer. **Screens:** Profile Overview (view), Edit Profile (form), Edit
Preferences (chips/selects), Security (verify email/phone, password, MFA), Avatar
Update (camera/gallery, crop, permission prompts), Delete Account (danger zone).
**Fields:** display name, username, bio (char count), email (verified badge + change
flow), phone (optional verify), location, pronouns, links (max 2, URL validation).
**Interaction:** autosave drafts + explicit Save; offline banner "Offline — changes
saved locally" + queued-sync indicator; inline + server-error mapping; TalkBack labels,
large touch targets, correct keyboard types. **Output contract:** Material component
mapping (TextInputLayout, chips...), Jetpack Compose equivalents (preferred), Kotlin
data models + validation rules, offline-draft + sync state handling, mock profile data + error cases.

---

## P11 — Admin User Management Console
*Audit: full state coverage ✓. Generate in Batch 2.*

```
Design an admin console for managing users and roles. Screens: User List, User
Detail drawer, Role Editor, Audit Log.
Requirements:
- Table: search, filters (role, status, last active), bulk actions.
- User detail drawer: profile, permissions, activity timeline.
- Role editor: permission matrix + inheritance.
- Strong destructive-confirm patterns (typed confirmation for high-risk).
- States: loading, empty, permission denied, destructive confirm.
- Keyboard-first table navigation.
Output: desktop 1440 + responsive notes. Frame naming [App]/Admin/[Screen]/[State].
```

---

## P20 — Feature Flag & Experiment Manager
*Audit: full state coverage ✓. Security-sensitive — keep permission gates.*

```
Design a UI to manage feature flags and A/B tests. Modules: flag list by
environment, experiment setup (variants, audience), results dashboard.
Requirements:
- Safe rollout controls + kill switch UI.
- Audit-log visibility.
- Permission-gated actions; re-auth for production flag changes.
- States: loading, empty, error, success, disabled, permission-gated.
Output: desktop-first with dense data layout.
```

---

## P26 — Security Center (Risk + Findings)
*Audit: full state coverage ✓. Generate in Batch 2.*

```
Design a security center dashboard. Modules: risk score, findings list,
remediation checklist, device/session view, audit log.
Requirements:
- Severity tags; "mark as resolved" with evidence; export report.
- Color-safe severity indicators (not color-only — pair with icon/label).
- Permission-gated remediation actions.
Output: dense dark-mode-optimized layout; sticky table headers; keyboard nav.
```
