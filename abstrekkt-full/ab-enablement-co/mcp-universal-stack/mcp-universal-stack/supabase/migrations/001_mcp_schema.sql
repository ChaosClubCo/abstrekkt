-- ==============================================================================
-- MCP Universal Stack - Supabase Schema Migration
-- ==============================================================================
-- Creates tables for data sync, incident logging, and audit trails
-- Run this in Supabase SQL Editor or via migrations
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- SYNC TABLES (populated by n8n data-sync workflow)
-- ==============================================================================

-- GitHub repositories sync
CREATE TABLE IF NOT EXISTS sync_repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'github',
  type TEXT NOT NULL DEFAULT 'repository',
  name TEXT NOT NULL,
  full_name TEXT,
  description TEXT,
  url TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_repos_source ON sync_repositories(source);
CREATE INDEX IF NOT EXISTS idx_sync_repos_name ON sync_repositories(name);
CREATE INDEX IF NOT EXISTS idx_sync_repos_synced ON sync_repositories(synced_at);

-- GitHub issues sync
CREATE TABLE IF NOT EXISTS sync_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'github',
  type TEXT NOT NULL DEFAULT 'issue',
  number INTEGER,
  title TEXT NOT NULL,
  body TEXT,
  state TEXT,
  url TEXT,
  repository TEXT,
  author TEXT,
  labels TEXT,
  assignees TEXT,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_issues_state ON sync_issues(state);
CREATE INDEX IF NOT EXISTS idx_sync_issues_repo ON sync_issues(repository);
CREATE INDEX IF NOT EXISTS idx_sync_issues_author ON sync_issues(author);

-- Slack channels sync
CREATE TABLE IF NOT EXISTS sync_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'slack',
  type TEXT NOT NULL DEFAULT 'channel',
  name TEXT NOT NULL,
  topic TEXT,
  purpose TEXT,
  is_private BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_channels_name ON sync_channels(name);

-- Sync execution logs
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_id TEXT NOT NULL,
  status TEXT NOT NULL,
  total_batches INTEGER DEFAULT 0,
  successful INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  tables_synced JSONB,
  errors JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_completed ON sync_logs(completed_at DESC);

-- ==============================================================================
-- INCIDENT TABLES (populated by incident-response workflow)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id TEXT UNIQUE NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  error_rate NUMERIC(5,2),
  affected_users INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  root_cause TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC);

-- Incident timeline/updates
CREATE TABLE IF NOT EXISTS incident_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id TEXT NOT NULL REFERENCES incidents(incident_id),
  update_type TEXT NOT NULL, -- 'status_change', 'note', 'escalation', 'resolution'
  content TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_updates_incident ON incident_updates(incident_id);

-- ==============================================================================
-- AUDIT TABLES (for security and compliance)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS mcp_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bridge TEXT NOT NULL,
  operation TEXT NOT NULL,
  endpoint TEXT,
  request_id TEXT,
  user_id TEXT,
  ip_address TEXT,
  request_params JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_bridge ON mcp_audit_log(bridge);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON mcp_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_created ON mcp_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON mcp_audit_log(user_id);

-- Partition by month for large deployments (optional)
-- CREATE TABLE mcp_audit_log_2024_01 PARTITION OF mcp_audit_log
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ==============================================================================
-- HEALTH CHECK HISTORY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS health_check_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bridge TEXT NOT NULL,
  status TEXT NOT NULL, -- 'healthy', 'unhealthy', 'degraded'
  response_time_ms INTEGER,
  details JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_bridge ON health_check_history(bridge);
CREATE INDEX IF NOT EXISTS idx_health_status ON health_check_history(status);
CREATE INDEX IF NOT EXISTS idx_health_checked ON health_check_history(checked_at DESC);

-- Keep only last 30 days (run periodically)
-- DELETE FROM health_check_history WHERE checked_at < NOW() - INTERVAL '30 days';

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE sync_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check_history ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for n8n workflows)
CREATE POLICY "Service role full access" ON sync_repositories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON sync_issues
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON sync_channels
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON sync_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON incidents
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON incident_updates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON mcp_audit_log
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON health_check_history
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read (for dashboards)
CREATE POLICY "Authenticated users can read sync data" ON sync_repositories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read incidents" ON incidents
  FOR SELECT USING (auth.role() = 'authenticated');

-- ==============================================================================
-- FUNCTIONS
-- ==============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to incidents table
CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate incident MTTR (Mean Time To Resolution)
CREATE OR REPLACE FUNCTION calculate_mttr(time_period INTERVAL DEFAULT '30 days')
RETURNS TABLE(
  severity TEXT,
  avg_resolution_time_hours NUMERIC,
  incident_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.severity,
    ROUND(AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at)) / 3600)::NUMERIC, 2) as avg_resolution_time_hours,
    COUNT(*) as incident_count
  FROM incidents i
  WHERE i.resolved_at IS NOT NULL
    AND i.created_at > NOW() - time_period
  GROUP BY i.severity
  ORDER BY 
    CASE i.severity 
      WHEN 'P0' THEN 1 
      WHEN 'P1' THEN 2 
      WHEN 'P2' THEN 3 
      ELSE 4 
    END;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- VIEWS
-- ==============================================================================

-- Active incidents view
CREATE OR REPLACE VIEW active_incidents AS
SELECT 
  incident_id,
  severity,
  title,
  source,
  error_rate,
  affected_users,
  status,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 60 as minutes_open
FROM incidents
WHERE status NOT IN ('resolved', 'closed')
ORDER BY 
  CASE severity 
    WHEN 'P0' THEN 1 
    WHEN 'P1' THEN 2 
    WHEN 'P2' THEN 3 
    ELSE 4 
  END,
  created_at ASC;

-- Bridge health summary view
CREATE OR REPLACE VIEW bridge_health_summary AS
SELECT 
  bridge,
  COUNT(*) FILTER (WHERE status = 'healthy') as healthy_checks,
  COUNT(*) FILTER (WHERE status = 'unhealthy') as unhealthy_checks,
  ROUND(AVG(response_time_ms)) as avg_response_time_ms,
  MAX(checked_at) as last_checked
FROM health_check_history
WHERE checked_at > NOW() - INTERVAL '24 hours'
GROUP BY bridge;

-- Sync status summary view
CREATE OR REPLACE VIEW sync_status_summary AS
SELECT
  'repositories' as entity,
  COUNT(*) as total,
  MAX(synced_at) as last_synced
FROM sync_repositories
UNION ALL
SELECT
  'issues' as entity,
  COUNT(*) as total,
  MAX(synced_at) as last_synced
FROM sync_issues
UNION ALL
SELECT
  'channels' as entity,
  COUNT(*) as total,
  MAX(synced_at) as last_synced
FROM sync_channels;

-- ==============================================================================
-- COMMENTS
-- ==============================================================================

COMMENT ON TABLE sync_repositories IS 'GitHub repositories synced via MCP data-sync workflow';
COMMENT ON TABLE sync_issues IS 'GitHub issues synced via MCP data-sync workflow';
COMMENT ON TABLE sync_channels IS 'Slack channels synced via MCP data-sync workflow';
COMMENT ON TABLE incidents IS 'Incidents created via MCP incident-response workflow';
COMMENT ON TABLE mcp_audit_log IS 'Audit trail for all MCP bridge operations';
COMMENT ON TABLE health_check_history IS 'Historical health check results for all bridges';
