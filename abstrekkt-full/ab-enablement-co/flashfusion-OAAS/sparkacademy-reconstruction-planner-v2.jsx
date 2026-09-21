import { useState, useMemo } from "react";

// ── LIVE SCHEMA STATE (pulled 2026-05-17 from B44 app 69180d077a5cbed7242f90ab) ──
const TOTAL_ENTITIES = 113;
const ORIGINAL_COUNT = 85;
const NEW_ENTITIES_ADDED = 28;

const ENTITY_INVENTORY = [
  // ── ACTIVE — CORE LMS (keep, no changes needed) ─────────────────────────
  { name: "Course", group: "Core LMS", status: "extended", note: "Added: track, target_personas, risk_classification, sandbox_required, version, review_cadence_days, business_outcome, confidence_outcome, content_status, responsible_use_checkpoint, owner_email, last_reviewed_at" },
  { name: "Lesson", group: "Core LMS", status: "extended", note: "Added: teacher_script, student_worksheet, safety_warning, responsible_use_checkpoint, bad/better/best_example, answer_key, next_action, discussion_questions, practice_prompt, reflection_question" },
  { name: "Enrollment", group: "Core LMS", status: "keep", note: "Reuse as-is. Progress array maps cleanly to lesson completion tracking." },
  { name: "Certificate", group: "Core LMS", status: "keep", note: "Keep. NFT fields dormant (nft_enabled defaults false). Add content_hash + cert_number when needed." },
  { name: "Badge", group: "Core LMS", status: "keep", note: "Reuse for certification badges and milestone recognition." },
  { name: "UserBadge", group: "Core LMS", status: "keep", note: "Reuse as-is." },
  { name: "LearningPath", group: "Core LMS", status: "keep", note: "Reuse. Populate persona_slug, cert_id fields when building V1 paths." },
  { name: "CourseFeedback", group: "Core LMS", status: "keep", note: "Reuse as-is for module-level feedback collection." },
  { name: "LearningGoal", group: "Core LMS", status: "keep", note: "Reuse for adoption layer goal tracking." },
  { name: "ProjectSubmission", group: "Core LMS", status: "keep", note: "Keep for lab portfolio artifact submissions." },
  { name: "CourseAnalytics", group: "Core LMS", status: "keep", note: "Keep as primary analytics store. Feeds AdoptionHealth calculation." },
  { name: "CareerPath", group: "Core LMS", status: "keep", note: "Keep for SkillsPathway graduation path planning." },
  { name: "CourseDiscussion", group: "Core LMS", status: "keep", note: "Keep for in-module community discussion." },
  { name: "LearningStreak", group: "Core LMS", status: "keep", note: "Keep (replaces deprecated CourseStreak). Use scope=global/course." },
  { name: "StudyGroup", group: "Core LMS", status: "keep", note: "Keep for cohort and team learning groups." },
  // ── ACTIVE — B2B / ORG LAYER ─────────────────────────────────────────────
  { name: "Organization", group: "B2B / Org", status: "extended", note: "Added: subscription_tier, seat_limit, billing_email, industry, org_size, feature_flags, regulatory_profile_id, us_regulatory_flags (7 booleans), SCIM fields in sso_config (9 fields), sso_provider extended with jumpcloud/onelogin/ping" },
  { name: "Team", group: "B2B / Org", status: "keep", note: "Reuse for department/cohort groups within orgs." },
  { name: "TeamMembership", group: "B2B / Org", status: "keep", note: "Reuse as-is." },
  { name: "EmployeeProfile", group: "B2B / Org", status: "extended", note: "Added: ai_comfort (1-5), technical_level (1-5), persona_slug, onboarding_path, onboarding_completed_at, last_adoption_health_score" },
  { name: "ClientOrganization", group: "B2B / Org", status: "extended", note: "Added: invoke_engagement_tier, ai_readiness_score, regulatory_scope (12 US regs array), uses_ai_in_hiring, government/nonprofit to org_type enum" },
  { name: "SkillsPathway", group: "B2B / Org", status: "keep", note: "Keep for role-based learning path plans per employee." },
  { name: "SkillGapAnalysis", group: "B2B / Org", status: "keep", note: "Keep for org-level skill gap reporting and curriculum prioritization." },
  { name: "ClientAILiteracyBenchmark", group: "B2B / Org", status: "keep", note: "Keep as B2B proof asset for Invoke QBRs." },
  { name: "ClientOnboardingPlan", group: "B2B / Org", status: "keep", note: "Keep for Invoke engagement planning (Launchpad deliverable template)." },
  // ── ACTIVE — HR / INTEGRATION ─────────────────────────────────────────────
  { name: "HRIntegration", group: "HR / Integration", status: "extended", note: "Added: ADP, UKG, Rippling to hr_system enum; scim_integration_id link; cost_center_field, hire_date_field, job_title_field to field_mappings" },
  { name: "HRSyncLog", group: "HR / Integration", status: "keep", note: "Reuse. Extend sync_type enum with scim_provision/scim_deprovision in next pass." },
  { name: "Integration", group: "HR / Integration", status: "keep", note: "Keep. Add 'idp' to category enum in next pass." },
  // ── ACTIVE — MENTOR / COMMUNITY ──────────────────────────────────────────
  { name: "MentorSession", group: "Mentor / Community", status: "keep", note: "Keep for CS touchpoints and AI Champion mentorship sessions." },
  { name: "MentorProfile", group: "Mentor / Community", status: "keep", note: "Keep for AI Champion and CS team mentor profiles." },
  { name: "MentorshipPair", group: "Mentor / Community", status: "keep", note: "Keep for structured AI Champion mentorship pairing." },
  // ── ACTIVE — ANALYTICS / DASHBOARDS ──────────────────────────────────────
  { name: "AnalyticsInsight", group: "Analytics", status: "keep", note: "Keep. Maps to observability anomaly detection layer." },
  { name: "DashboardTemplate", group: "Analytics", status: "keep", note: "Keep. Pre-populate with 7 role-based dashboard templates from 21_DASHBOARD_DEFINITIONS.json." },
  { name: "UserDashboard", group: "Analytics", status: "keep", note: "Keep for per-user customizable dashboard views." },
  { name: "ContentAnalysis", group: "Analytics", status: "keep", note: "Keep for lesson-level engagement and drop-off analysis." },
  // ── ACTIVE — NOTIFICATIONS ───────────────────────────────────────────────
  { name: "Notification", group: "Notifications", status: "extended", note: "Extended type enum: added churn_risk, shadow_ai_detected, policy_review_due, vendor_approved, vendor_rejected, cert_earned, cost_anomaly, regulatory_update, scim_error, lab_quota_warning, compliance_violation, ccpa_request" },
  { name: "UserProfile", group: "Other", status: "repurpose", note: "Still has investment-platform fields (community_preferences, deal tracking). Repurpose in next pass: strip deal-flow fields, add persona_slug, ai_comfort, technical_level." },
  { name: "ComplianceReport", group: "Other", status: "repurpose", note: "Still framed as investment compliance (SEC filings). Repurpose: reuse risk_summary, compliance_concerns structure for AI governance reports." },
  { name: "StudentPoints", group: "Other", status: "keep", note: "Keep for learner gamification points." },
  // ── NEW — GOVERNANCE ──────────────────────────────────────────────────────
  { name: "GovernancePolicy", group: "Governance (NEW)", status: "new", note: "17 policy_type enum values. Machine-readable enforcement_logic. INSERT-ONLY readable by published status or admin." },
  { name: "VendorProfile", group: "Governance (NEW)", status: "new", note: "Vendor intake + risk tier + DDQ storage + approval status tracking. Linked to VendorApprovalEvent chain." },
  { name: "VendorApprovalEvent", group: "Governance (NEW)", status: "new", note: "INSERT-ONLY audit chain. No UPDATE, no DELETE. 7 event types." },
  { name: "ComplianceRule", group: "Governance (NEW)", status: "new", note: "Machine-readable rules with us_regulatory_basis array (12 US regulations)." },
  { name: "ComplianceViolation", group: "Governance (NEW)", status: "new", note: "Rule → violation → remediation tracking. 5 status values." },
  { name: "ShadowAIEvent", group: "Governance (NEW)", status: "new", note: "5 shadow AI event types. Risk level + investigation status. Admin-only read." },
  { name: "AuditLog", group: "Governance (NEW)", status: "new", note: "INSERT-ONLY enforced by RLS. No UPDATE policy. No DELETE policy. Admin read only." },
  { name: "PolicyAcknowledgment", group: "Governance (NEW)", status: "new", note: "INSERT-ONLY user acknowledgments. Links policy_id + version. Timestamp immutable." },
  // ── NEW — US REGULATORY ───────────────────────────────────────────────────
  { name: "RegulatoryProfile", group: "US Regulatory (NEW)", status: "new", note: "Per-org posture: 12 US regulation flags + policy_templates_recommended auto-selection." },
  { name: "CCPARequest", group: "US Regulatory (NEW)", status: "new", note: "CCPA consumer rights requests. 45-day SLA enforced via response_due_at. 5 request types." },
  { name: "EEOCComplianceRecord", group: "US Regulatory (NEW)", status: "new", note: "EEOC + NYC LL144 + CO SB25-318 + IL AIEA attestation records for AI hiring tool use." },
  { name: "DataProcessingAgreement", group: "US Regulatory (NEW)", status: "new", note: "DPAs per vendor: CCPA service provider, HIPAA BAA, FERPA school official, GDPR DPA." },
  // ── NEW — PRACTICE / SANDBOX ──────────────────────────────────────────────
  { name: "LabSession", group: "Practice (NEW)", status: "new", note: "30-min TTL. Status machine: pending→active→completed/failed/expired/reset. FERPA: no PII in sessions." },
  { name: "LabEvent", group: "Practice (NEW)", status: "new", note: "INSERT-ONLY per-call event log. Unsafe prompt detection → feeds AuditLog." },
  { name: "SandboxQuota", group: "Practice (NEW)", status: "new", note: "Per-tenant/user token + call limits by billing period. Enforced at Cloudflare proxy." },
  { name: "PromptLog", group: "Practice (NEW)", status: "new", note: "Every LLM call: cost_usd, latency_ms, safety_flags. user_deletion_requested flag for CCPA." },
  // ── NEW — OBSERVABILITY ───────────────────────────────────────────────────
  { name: "TelemetryEvent", group: "Observability (NEW)", status: "new", note: "layer.entity.action naming. INSERT-ONLY. ~30 event types across 6 layers. CCPA deletion applies." },
  { name: "AdoptionHealth", group: "Observability (NEW)", status: "new", note: "Composite 0-100 score. module(30%)+lab(20%)+confidence(20%)+login(15%)+goals(15%). Org-level or user-level." },
  { name: "CostTracking", group: "Observability (NEW)", status: "new", note: "Daily token spend by tenant/user/model/context. Feeds anomaly detection." },
  { name: "AnomalyEvent", group: "Observability (NEW)", status: "new", note: "5 anomaly types. Cost spike > 2x 7-day average triggers Slack alert." },
  // ── NEW — COMMERCIAL ──────────────────────────────────────────────────────
  { name: "Lead", group: "Commercial (NEW)", status: "new", note: "Public insert (scorecard). ccpa_consent + email_opt_in + can_spam_compliant flags. Admin-only read." },
  { name: "Engagement", group: "Commercial (NEW)", status: "new", note: "Invoke engagement lifecycle: launchpad→deploy→assure. Status pipeline, SOW URL, milestones." },
  { name: "ROICalculation", group: "Commercial (NEW)", status: "new", note: "Shareable via share_token. is_public=true allows anonymous link access." },
  // ── NEW — ADOPTION ────────────────────────────────────────────────────────
  { name: "OnboardingSession", group: "Adoption (NEW)", status: "new", note: "10 onboarding paths. coppa_verified boolean. Tracks completed_steps + current_step." },
  { name: "ConfidenceScore", group: "Adoption (NEW)", status: "new", note: "5 domains. eeoc_advisory=true embedded in schema (EEOC: not for employment decisions)." },
  { name: "ChurnSignal", group: "Adoption (NEW)", status: "new", note: "6 signal types. churn_risk 0-1. >0.7 triggers CS intervention task (via AnomalyEvent)." },
  // ── NEW — SCIM ────────────────────────────────────────────────────────────
  { name: "SCIMProvision", group: "SCIM (NEW)", status: "new", note: "bearer_token_ref = KMS reference ONLY. 6 IdP providers. is_active=false by default (explicit activation required). Group sync support." },
  { name: "SCIMSyncLog", group: "SCIM (NEW)", status: "new", note: "INSERT-ONLY sync log. No UPDATE, no DELETE. Tracks provisioned/updated/deprovisioned counts." },
  // ── DEPRECATED ────────────────────────────────────────────────────────────
  { name: "CertificateNFT", group: "Deprecated", status: "deprecated", note: "Was already deprecated in original schema. NFT fields on Certificate directly." },
  { name: "CourseStreak", group: "Deprecated", status: "deprecated", note: "Replaced by LearningStreak with scope field." },
  { name: "CourseEngagementMetrics", group: "Deprecated", status: "deprecated", note: "Merged into CourseAnalytics." },
  { name: "TimeCapsule", group: "Deprecated", status: "deprecated", note: "V2+ video reflection feature." },
  { name: "DebateSession", group: "Deprecated", status: "deprecated", note: "V2+ AI debate feature." },
  { name: "Whiteboard", group: "Deprecated", status: "deprecated", note: "V2+ collaborative whiteboard." },
  { name: "TeamCompetition", group: "Deprecated", status: "deprecated", note: "Phase 3+ gamification." },
  { name: "PromotionCampaign", group: "Deprecated", status: "deprecated", note: "Handled by n8n + Resend." },
  { name: "LeaderboardEntry", group: "Deprecated", status: "deprecated", note: "V2 community feature." },
  { name: "LeaderboardReward", group: "Deprecated", status: "deprecated", note: "V2 community feature." },
  { name: "TrendingCourse", group: "Deprecated", status: "deprecated", note: "V1 not needed — TelemetryEvent handles analytics." },
  { name: "DailyChallenge", group: "Deprecated", status: "deprecated", note: "Phase 3+ gamification." },
  { name: "PeerReview", group: "Deprecated", status: "deprecated", note: "Phase 3 community feature." },
  { name: "ContentImprovement", group: "Deprecated", status: "deprecated", note: "Replaced by Supabase content_versions." },
  { name: "AIContentRevision", group: "Deprecated", status: "deprecated", note: "Handled by SK-002 skill layer." },
  { name: "AIContentEngagement", group: "Deprecated", status: "deprecated", note: "Duplicate of CourseAnalytics." },
  { name: "AIContentAsset", group: "Deprecated", status: "deprecated", note: "Replaced by Supabase Storage + content_versions." },
  { name: "ContentVersion", group: "Deprecated", status: "deprecated", note: "Duplicate of Supabase content_versions (authoritative)." },
  { name: "CourseVersion", group: "Deprecated", status: "deprecated", note: "Handled by Supabase content_versions." },
  { name: "SavedResource", group: "Deprecated", status: "deprecated", note: "V2 personal resource library." },
  { name: "InteractiveGuide", group: "Deprecated", status: "deprecated", note: "Onboarding tooltips at component layer." },
  { name: "OnboardingNudge", group: "Deprecated", status: "deprecated", note: "Replaced by Resend + n8n sequences." },
  { name: "ActivationState", group: "Deprecated", status: "deprecated", note: "Investment-platform model → replaced by OnboardingSession + AdoptionHealth." },
  { name: "RetentionState", group: "Deprecated", status: "deprecated", note: "Investment-platform model → replaced by ChurnSignal + AdoptionHealth." },
  { name: "PowerUserState", group: "Deprecated", status: "deprecated", note: "Replaced by AdoptionHealth composite score." },
  { name: "LifecycleState", group: "Deprecated", status: "deprecated", note: "Investment-platform lifecycle → replaced by AdoptionHealth + ChurnSignal." },
  { name: "TutorCheckIn", group: "Deprecated", status: "deprecated", note: "Replaced by ChurnSignal + SupportTicket intervention playbook." },
  { name: "StudentLearningPath", group: "Deprecated", status: "deprecated", note: "Duplicate of LearningPath + Enrollment progress." },
  { name: "LearningPathProgress", group: "Deprecated", status: "deprecated", note: "Merged into Enrollment.progress array." },
  { name: "LearningStats", group: "Deprecated", status: "deprecated", note: "Annual stats → TelemetryEvent + AdoptionHealth." },
  { name: "CreatorPoints", group: "Deprecated", status: "deprecated", note: "Creator monetization economy not relevant to B2B." },
  { name: "RewardItem", group: "Deprecated", status: "deprecated", note: "Reward catalog — V2." },
  { name: "PointsTransaction", group: "Deprecated", status: "deprecated", note: "Points economy — V2." },
  { name: "CourseRecommendation", group: "Deprecated", status: "deprecated", note: "Handled by SK-012 skills layer in Supabase." },
  { name: "StudentPortfolio", group: "Deprecated", status: "deprecated", note: "V2 feature." },
  { name: "SocialPost", group: "Deprecated", status: "deprecated", note: "V2 social feed." },
  { name: "SharedResource", group: "Deprecated", status: "deprecated", note: "V2 resource sharing." },
  { name: "CollaborativeDocument", group: "Deprecated", status: "deprecated", note: "V2 collaborative docs." },
  { name: "LiveQASession", group: "Deprecated", status: "deprecated", note: "External via Crowdcast/Zoom." },
  { name: "InstructorForum", group: "Deprecated", status: "deprecated", note: "V2 instructor community." },
  { name: "PersonalChallenge", group: "Deprecated", status: "deprecated", note: "V2 gamification." },
  { name: "TeamChallenge", group: "Deprecated", status: "deprecated", note: "V2 gamification." },
  { name: "CRMCustomer", group: "Deprecated", status: "deprecated", note: "CRM handled by HubSpot MCP." },
  { name: "CRMSegment", group: "Deprecated", status: "deprecated", note: "CRM handled by HubSpot MCP." },
  { name: "CRMWorkflow", group: "Deprecated", status: "deprecated", note: "CRM workflows → HubSpot + n8n." },
  { name: "CRMProduct", group: "Deprecated", status: "deprecated", note: "Product catalog → HubSpot MCP." },
];

const US_REGS = [
  { id: "CCPA", label: "CCPA / CPRA", color: "#06B6D4", entities: ["Lead", "PromptLog", "TelemetryEvent", "CCPARequest"], desc: "California Consumer Privacy Act. ccpa_consent on Lead. user_deletion_requested on PromptLog. CCPARequest entity with 45-day SLA." },
  { id: "EEOC", label: "EEOC + AI Hiring", color: "#EC4899", entities: ["EEOCComplianceRecord", "ConfidenceScore"], desc: "ConfidenceScore has eeoc_advisory=true embedded. EEOCComplianceRecord tracks NYC LL144 bias audit + human review documentation." },
  { id: "FERPA", label: "FERPA", color: "#A855F7", entities: ["LabSession", "OnboardingSession"], desc: "LabSession design: no PII in fake datasets. OnboardingSession has coppa_verified flag. DataProcessingAgreement.dpa_type=ferpa_school_official." },
  { id: "COPPA", label: "COPPA", color: "#F59E0B", entities: ["OnboardingSession"], desc: "OnboardingSession.coppa_verified: user confirmed age ≥ 13. School tier must enforce this before any data collection." },
  { id: "HIPAA-AI", label: "HIPAA (AI Context)", color: "#10B981", entities: ["DataProcessingAgreement", "VendorProfile"], desc: "DataProcessingAgreement.dpa_type=hipaa_baa. VendorProfile.handles_phi flag. Not a BAA substitute — records that tooling is covered." },
  { id: "NIST-RMF", label: "NIST AI RMF", color: "#6366F1", entities: ["GovernancePolicy", "ComplianceRule", "AuditLog"], desc: "Govern function: GovernancePolicy + PolicyAcknowledgment. Map function: RegulatoryProfile. Measure function: AdoptionHealth + ComplianceViolation. Manage: AuditLog + ShadowAIEvent." },
  { id: "NYC-LL144", label: "NYC Local Law 144", color: "#EF4444", entities: ["EEOCComplianceRecord"], desc: "EEOCComplianceRecord.nyc_ll144_applicable boolean. Requires annual bias audit by independent auditor for automated employment decision tools." },
  { id: "CO-SB169", label: "CO SB25-318", color: "#8B5CF6", entities: ["EEOCComplianceRecord", "RegulatoryProfile"], desc: "EEOCComplianceRecord.co_sb169_applicable. Active Feb 2026. Consequential AI decisions require consumer notification + appeal rights + impact assessments." },
  { id: "IL-AIEA", label: "IL AI Employment Act", color: "#F97316", entities: ["EEOCComplianceRecord"], desc: "EEOCComplianceRecord.il_aiea_applicable. Effective Jan 2026. Employers must notify applicants of AI use in employment decisions." },
  { id: "CAN-SPAM", label: "CAN-SPAM", color: "#84CC16", entities: ["Lead"], desc: "Lead.email_opt_in + Lead.can_spam_compliant flags. Required before any Resend nurture sequence fires." },
  { id: "ADA", label: "ADA / WCAG 2.1 AA", color: "#22D3EE", entities: [], desc: "Platform requirement: WCAG 2.1 AA compliance. Screen reader support, keyboard navigation, accessible color contrast. Not a schema concern — component layer." },
  { id: "PCI-DSS", label: "PCI DSS", color: "#FB923C", entities: ["Lead"], desc: "No card data stored in B44 schema — all billing via Stripe. BillingEvent in Supabase stores only event IDs." },
];

const REMAINING_TASKS = [
  { id: "T-01", task: "UserProfile: strip investment-platform fields, add persona_slug + ai_comfort + technical_level", priority: "P1", group: "Extensions" },
  { id: "T-02", task: "ComplianceReport: repurpose from SEC-filing to AI governance report (update field descriptions)", priority: "P1", group: "Extensions" },
  { id: "T-03", task: "HRSyncLog: extend sync_type enum with scim_provision + scim_deprovision", priority: "P2", group: "Extensions" },
  { id: "T-04", task: "Integration: add 'idp' to category enum for SCIM/SSO provider entries", priority: "P2", group: "Extensions" },
  { id: "T-05", task: "LearningPath: add persona_slug, onboarding_path, cert_id fields", priority: "P1", group: "Extensions" },
  { id: "T-06", task: "Certificate: add content_hash (SHA-256 tamper detection) + cert_number (human-readable FF-2026-XXXXXX)", priority: "P1", group: "Extensions" },
  { id: "T-07", task: "Enrollment: add tenant_id, assigned_by, onboarding_path fields", priority: "P1", group: "Extensions" },
  { id: "T-08", task: "Seed GovernancePolicy: 17 platform-level policy templates (policy_type enum populated, status=published, tenant_id=null)", priority: "P0", group: "Seed Data" },
  { id: "T-09", task: "Seed ComplianceRule: platform-level rules per regulation (CCPA data handling, EEOC human review, FERPA student data, COPPA age gate)", priority: "P0", group: "Seed Data" },
  { id: "T-10", task: "Seed VendorProfile: 15 pre-approved vendors from 11_VENDOR_PROFILE_LIBRARY.md (Anthropic, Google, Microsoft, etc.)", priority: "P1", group: "Seed Data" },
  { id: "T-11", task: "Seed DashboardTemplate: 7 role-based templates from 21_DASHBOARD_DEFINITIONS.json", priority: "P1", group: "Seed Data" },
  { id: "T-12", task: "Seed LearningPath: 3 core paths (Flash Builder, Fusion Team Lead, INT Enterprise)", priority: "P1", group: "Seed Data" },
  { id: "T-13", task: "Build AI Adoption OS UI on top of updated B44 schema (or migrate to Next.js + Supabase production schema)", priority: "P0", group: "Build" },
  { id: "T-14", task: "Connect Cloudflare Worker proxy → LabSession token quota enforcement", priority: "P0", group: "Build" },
  { id: "T-15", task: "Wire TelemetryEvent → PostHog (non-PII event mirror)", priority: "P1", group: "Build" },
  { id: "T-16", task: "Wire Lead → Resend nurture sequence trigger on scorecard completion", priority: "P0", group: "Build" },
  { id: "T-17", task: "Wire ChurnSignal → n8n re-engagement workflow (WF-05 or dedicated churn flow)", priority: "P1", group: "Build" },
  { id: "T-18", task: "SCIM: implement SCIM 2.0 adapter (POST /scim/v2/Users, PATCH, DELETE) → SCIMProvision + SCIMSyncLog", priority: "P2", group: "Build" },
  { id: "T-19", task: "Content: write first 5 modules (AI Fundamentals, Prompt Engineering, Responsible AI, AI for Business, AI for Managers) per 06_MODULE_LIBRARY.md", priority: "P0", group: "Content" },
  { id: "T-20", task: "Content: build 5 labs (Prompt Playground, Email Assistant, Meeting Summary, Customer Support, Sales Outreach) per 08_LAB_AND_SANDBOX_LIBRARY.md", priority: "P1", group: "Content" },
];

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  new:        { label: "NEW",      bg: "rgba(236,72,153,0.15)", border: "#EC4899", text: "#F9A8D4" },
  extended:   { label: "EXTENDED", bg: "rgba(99,102,241,0.15)", border: "#6366F1", text: "#A5B4FC" },
  keep:       { label: "KEEP",     bg: "rgba(16,185,129,0.12)", border: "#10B981", text: "#6EE7B7" },
  repurpose:  { label: "REPURPOSE",bg: "rgba(245,158,11,0.15)", border: "#F59E0B", text: "#FCD34D" },
  deprecated: { label: "DEPRECATED",bg:"rgba(239,68,68,0.08)",  border: "#EF444440",text: "#FDA4AF" },
};

const PRIO_CFG = {
  P0: { bg: "rgba(239,68,68,0.2)",  text: "#FCA5A5" },
  P1: { bg: "rgba(245,158,11,0.2)", text: "#FCD34D" },
  P2: { bg: "rgba(99,102,241,0.2)", text: "#A5B4FC" },
};

export default function SparkReconstructionPlanner() {
  const [tab, setTab] = useState("overview");
  const [entityFilter, setEntityFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all");
  const [expandedReg, setExpandedReg] = useState(null);
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const counts = useMemo(() => ({
    new: ENTITY_INVENTORY.filter(e => e.status === "new").length,
    extended: ENTITY_INVENTORY.filter(e => e.status === "extended").length,
    keep: ENTITY_INVENTORY.filter(e => e.status === "keep").length,
    repurpose: ENTITY_INVENTORY.filter(e => e.status === "repurpose").length,
    deprecated: ENTITY_INVENTORY.filter(e => e.status === "deprecated").length,
  }), []);

  const groups = useMemo(() => [...new Set(ENTITY_INVENTORY.map(e => e.group))], []);
  const taskGroups = useMemo(() => [...new Set(REMAINING_TASKS.map(t => t.group))], []);

  const filteredEntities = useMemo(() => {
    let e = ENTITY_INVENTORY;
    if (entityFilter !== "all") e = e.filter(x => x.status === entityFilter);
    if (groupFilter !== "all") e = e.filter(x => x.group === groupFilter);
    return e;
  }, [entityFilter, groupFilter]);

  const filteredTasks = useMemo(() =>
    taskFilter === "all" ? REMAINING_TASKS : REMAINING_TASKS.filter(t => t.group === taskFilter),
    [taskFilter]);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  const tabs = [
    { id: "overview",   label: "Overview" },
    { id: "inventory",  label: `Entity State (${ENTITY_INVENTORY.length})` },
    { id: "remaining",  label: `Remaining Tasks (${REMAINING_TASKS.length})` },
    { id: "regulatory", label: `US Regulatory (${US_REGS.length})` },
  ];

  return (
    <div style={{ fontFamily: "'Geist', system-ui, sans-serif", background: "#0B0B14", color: "#F1F5F9", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 100%)", borderBottom: "1px solid rgba(139,92,246,0.2)", padding: "20px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "4px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#A855F7", fontWeight: 600, marginBottom: "4px" }}>
              SparkAcademy · B44 app 69180d077a5cbed7242f90ab · Last synced 2026-05-17
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>AI Adoption OS — Schema Reconstruction Planner</h1>
            <p style={{ fontSize: "12px", color: "#64748B", margin: "3px 0 0" }}>
              {TOTAL_ENTITIES} total entities · {NEW_ENTITIES_ADDED} added this session · USA regulatory coverage
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[["new","NEW",counts.new],["extended","EXTENDED",counts.extended],["keep","KEEP",counts.keep],["repurpose","REPURPOSE",counts.repurpose],["deprecated","DEPRECATED",counts.deprecated]].map(([k,l,v]) => (
              <div key={k} style={{ background: STATUS_CFG[k].bg, border: `1px solid ${STATUS_CFG[k].border}`, borderRadius: "6px", padding: "4px 10px", textAlign: "center", minWidth: "52px" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: STATUS_CFG[k].text }}>{v}</div>
                <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.08em", color: STATUS_CFG[k].text, opacity: 0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "2px", marginTop: "16px", overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 500, background: tab === t.id ? "rgba(139,92,246,0.25)" : "transparent", color: tab === t.id ? "#C4B5FD" : "#64748B", border: "none", borderBottom: tab === t.id ? "2px solid #A855F7" : "2px solid transparent", cursor: "pointer", borderRadius: "4px 4px 0 0", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "Total Live Entities", value: TOTAL_ENTITIES, color: "#A855F7", sub: "confirmed via B44 API" },
                { label: "Added This Session", value: NEW_ENTITIES_ADDED, color: "#EC4899", sub: "28 new schemas" },
                { label: "Governance Entities", value: "8", color: "#EF4444", sub: "Policy → AuditLog" },
                { label: "US Regulatory Entities", value: "4", color: "#F59E0B", sub: "CCPA · EEOC · DPA · RegProfile" },
                { label: "Practice/Sandbox", value: "4", color: "#10B981", sub: "Session · Event · Quota · Log" },
                { label: "Observability", value: "4", color: "#6366F1", sub: "Telemetry · Health · Cost · Anomaly" },
                { label: "Commercial/Invoke", value: "3", color: "#22D3EE", sub: "Lead · Engagement · ROI" },
                { label: "SCIM Entities", value: "2", color: "#84CC16", sub: "Provision · SyncLog" },
              ].map(s => (
                <div key={s.label} style={{ background: "#13131F", border: "1px solid rgba(139,92,246,0.12)", borderRadius: "8px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#E2E8F0", marginTop: "2px" }}>{s.label}</div>
                  <div style={{ fontSize: "10px", color: "#475569" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#13131F", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "10px", padding: "16px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#A855F7", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>SCIM — What Was Added</h3>
                {[
                  ["Organization.sso_config", "9 SCIM fields: scim_enabled, scim_endpoint, bearer_token_ref (KMS only), attribute_map, provision_on_create, deprovision_on_delete, last_sync, sync_status. 3 new IdP providers: jumpcloud, onelogin, ping."],
                  ["SCIMProvision entity", "Full SCIM 2.0 provisioning config. bearer_token_ref enforced as KMS reference — raw token never stored. is_active=false by default."],
                  ["SCIMSyncLog entity", "INSERT-ONLY sync log. No UPDATE, no DELETE. Tracks users_provisioned, updated, deprovisioned per sync run."],
                  ["HRIntegration", "scim_integration_id links to SCIMProvision. ADP, UKG, Rippling added to hr_system enum."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#C4B5FD", fontFamily: "monospace", marginBottom: "3px" }}>{title}</div>
                    <div style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#13131F", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "10px", padding: "16px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>US Regulatory — Live Entities</h3>
                {US_REGS.slice(0, 6).map(r => (
                  <div key={r.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, background: `${r.color}22`, color: r.color, padding: "2px 6px", borderRadius: "4px", flexShrink: 0, marginTop: "1px" }}>{r.id}</span>
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                      {r.entities.length > 0 ? r.entities.map(e => (
                        <code key={e} style={{ background: "#1E1E2E", padding: "0 3px", borderRadius: "2px", fontSize: "10px", marginRight: "3px" }}>{e}</code>
                      )) : <span style={{ color: "#475569" }}>Component layer (no schema entity)</span>}
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>+{US_REGS.length - 6} more in Regulatory tab</div>
              </div>
            </div>

            <div style={{ marginTop: "12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "8px", padding: "12px 14px", fontSize: "11px", color: "#6EE7B7", lineHeight: 1.7 }}>
              <strong>Session complete.</strong> 28 entities created · 7 entities extended · 44 entities deprecated with _deprecated flags.
              {" "}<strong>Remaining:</strong> {REMAINING_TASKS.filter(t => t.priority === "P0").length} P0 tasks before first build.
              Seed GovernancePolicy + ComplianceRule tables, then start Phase 0 implementation (P0-01 through P0-11 in 26_TODO.md).
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab === "inventory" && (
          <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
              <select onChange={e => setEntityFilter(e.target.value)} value={entityFilter}
                style={{ padding: "5px 10px", fontSize: "11px", background: "#13131F", color: "#CBD5E1", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "5px", cursor: "pointer" }}>
                <option value="all">All statuses ({ENTITY_INVENTORY.length})</option>
                {Object.entries(counts).map(([k, v]) => (
                  <option key={k} value={k}>{STATUS_CFG[k].label} ({v})</option>
                ))}
              </select>
              <select onChange={e => setGroupFilter(e.target.value)} value={groupFilter}
                style={{ padding: "5px 10px", fontSize: "11px", background: "#13131F", color: "#CBD5E1", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "5px", cursor: "pointer" }}>
                <option value="all">All groups</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div style={{ fontSize: "11px", color: "#475569", display: "flex", alignItems: "center", marginLeft: "4px" }}>
                Showing {filteredEntities.length} of {ENTITY_INVENTORY.length}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "6px" }}>
              {filteredEntities.map(e => {
                const cfg = STATUS_CFG[e.status];
                return (
                  <div key={e.name} style={{ background: "#13131F", border: `1px solid ${cfg.border}22`, borderLeft: `3px solid ${cfg.border}`, borderRadius: "7px", padding: "9px 12px", opacity: e.status === "deprecated" ? 0.6 : 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#F1F5F9", fontFamily: "monospace" }}>{e.name}</span>
                      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                        <span style={{ fontSize: "8px", fontWeight: 700, background: "rgba(255,255,255,0.06)", color: "#475569", padding: "1px 5px", borderRadius: "3px" }}>{e.group.split(" ")[0]}</span>
                        <span style={{ fontSize: "8px", fontWeight: 700, background: cfg.bg, color: cfg.text, padding: "1px 5px", borderRadius: "3px" }}>{cfg.label}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "10px", color: "#475569", margin: 0, lineHeight: 1.5 }}>{e.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REMAINING TASKS ── */}
        {tab === "remaining" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ fontSize: "12px", color: "#64748B" }}>
                <span style={{ color: "#A855F7", fontWeight: 700 }}>{checkedCount}</span> / {REMAINING_TASKS.length} done
              </div>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {["all", ...taskGroups].map(g => (
                  <button key={g} onClick={() => setTaskFilter(g)}
                    style={{ padding: "4px 10px", fontSize: "10px", background: taskFilter === g ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.04)", color: taskFilter === g ? "#C4B5FD" : "#64748B", border: `1px solid ${taskFilter === g ? "#A855F7" : "rgba(139,92,246,0.12)"}`, borderRadius: "5px", cursor: "pointer" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {filteredTasks.map(t => {
                const pc = PRIO_CFG[t.priority];
                const done = checked[t.id];
                return (
                  <div key={t.id} onClick={() => toggle(t.id)}
                    style={{ background: done ? "rgba(16,185,129,0.06)" : "#13131F", border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.12)"}`, borderRadius: "7px", padding: "9px 12px", cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "3px", border: `2px solid ${done ? "#10B981" : "#475569"}`, background: done ? "#10B981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      {done && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "5px", alignItems: "center", marginBottom: "3px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, background: pc.bg, color: pc.text, padding: "1px 5px", borderRadius: "3px" }}>{t.priority}</span>
                        <span style={{ fontSize: "9px", color: "#475569", background: "rgba(255,255,255,0.04)", padding: "1px 5px", borderRadius: "3px" }}>{t.group}</span>
                      </div>
                      <p style={{ fontSize: "11px", color: done ? "#475569" : "#CBD5E1", margin: 0, lineHeight: 1.5, textDecoration: done ? "line-through" : "none" }}>{t.task}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REGULATORY ── */}
        {tab === "regulatory" && (
          <div>
            <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 14px" }}>
              US regulatory coverage as implemented in the live schema. Not legal advice — verify with qualified counsel.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {US_REGS.map(r => (
                <div key={r.id} style={{ background: "#13131F", border: `1px solid ${r.color}22`, borderLeft: `3px solid ${r.color}`, borderRadius: "8px", overflow: "hidden" }}>
                  <div onClick={() => setExpandedReg(expandedReg === r.id ? null : r.id)}
                    style={{ padding: "11px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, background: `${r.color}22`, color: r.color, padding: "2px 8px", borderRadius: "4px" }}>{r.id}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#E2E8F0" }}>{r.label}</span>
                      {r.entities.length > 0 && (
                        <span style={{ fontSize: "10px", color: "#475569" }}>{r.entities.length} entit{r.entities.length === 1 ? "y" : "ies"}</span>
                      )}
                    </div>
                    <span style={{ color: "#475569", fontSize: "12px" }}>{expandedReg === r.id ? "▲" : "▼"}</span>
                  </div>
                  {expandedReg === r.id && (
                    <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${r.color}15` }}>
                      <p style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.6, margin: "10px 0 8px" }}>{r.desc}</p>
                      {r.entities.length > 0 && (
                        <div style={{ fontSize: "10px", color: "#475569" }}>
                          <strong style={{ color: "#64748B" }}>Live entities: </strong>
                          {r.entities.map(e => (
                            <code key={e} style={{ background: "#1E1E2E", padding: "1px 5px", borderRadius: "3px", marginRight: "4px", color: "#A5B4FC" }}>{e}</code>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
