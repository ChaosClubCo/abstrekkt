-- ─── HumanX Assessment Tool — Supabase Schema ─────────────────────────────────
-- Run this in Supabase SQL Editor: https://app.supabase.com → your project → SQL Editor

CREATE TABLE public.assessments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id        UUID        NOT NULL DEFAULT gen_random_uuid(),

  -- Profile (non-PII — always stored regardless of consent)
  tenant_count      TEXT,
  compliance        TEXT,
  isolation         TEXT,
  ai_status         TEXT,
  cloud_platform    TEXT,
  shadow_it         TEXT,

  -- Scores from Claude (always stored — no PII)
  overall_score     INT,
  risk_level        TEXT,         -- HIGH / MEDIUM / LOW
  score_isolation   NUMERIC(3,1),
  score_encrypt     NUMERIC(3,1),
  score_ai_risk     NUMERIC(3,1),
  score_compliance  NUMERIC(3,1),
  score_integration NUMERIC(3,1),
  score_msp         NUMERIC(3,1),
  score_shadow_it   NUMERIC(3,1),
  top_vendors       JSONB,
  key_findings      TEXT[],
  next_steps        TEXT[],
  exec_summary      TEXT,

  -- Contact PII — only populated when consent = TRUE
  consent           BOOLEAN     NOT NULL DEFAULT FALSE,
  contact_name      TEXT,
  contact_email     TEXT,
  contact_company   TEXT,
  contact_role      TEXT
);

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Anonymous users (conference attendees) can INSERT only
-- They cannot read, update, or delete any rows
CREATE POLICY "anon_insert_only"
  ON public.assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (Kyle's dashboard login) can SELECT all rows
CREATE POLICY "auth_select_all"
  ON public.assessments
  FOR SELECT
  TO authenticated
  USING (true);

-- No UPDATE or DELETE policies = nobody can modify or remove records
-- (Append-only audit trail)

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_assessments_created_at ON public.assessments (created_at DESC);
CREATE INDEX idx_assessments_risk_level ON public.assessments (risk_level);
CREATE INDEX idx_assessments_shadow_it  ON public.assessments (shadow_it);
CREATE INDEX idx_assessments_consent    ON public.assessments (consent) WHERE consent = TRUE;

-- ─── Verification (run after setup) ──────────────────────────────────────────
-- SELECT count(*) FROM public.assessments;
-- SELECT id, created_at, overall_score, risk_level, score_shadow_it, consent 
--   FROM public.assessments 
--   ORDER BY created_at DESC 
--   LIMIT 20;

-- ─── ENV VARS for .env.local ──────────────────────────────────────────────────
-- NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          ← safe to expose (RLS protects reads)
-- NEXT_PUBLIC_ASSESSMENT_URL=https://assess.intinc.ai
-- NEXT_PUBLIC_AWS_BACKUP_URL=https://api.xxxx.execute-api.us-east-1.amazonaws.com/prod/capture
