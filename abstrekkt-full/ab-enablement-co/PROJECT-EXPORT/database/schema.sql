CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE tenants (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email CITEXT UNIQUE NOT NULL, display_name TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE tenant_memberships (tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK (role IN ('owner','admin','architect','contributor','reviewer','auditor','viewer')), PRIMARY KEY(tenant_id,user_id));
CREATE TABLE projects (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name TEXT NOT NULL, slug TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(tenant_id,slug));
CREATE TABLE source_records (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, kind TEXT NOT NULL, title TEXT NOT NULL, storage_uri TEXT, content_sha256 TEXT NOT NULL, sensitivity TEXT NOT NULL DEFAULT 'internal', metadata JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE graph_nodes (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, node_type TEXT NOT NULL, label TEXT NOT NULL, body JSONB NOT NULL DEFAULT '{}'::jsonb, confidence TEXT NOT NULL CHECK(confidence IN ('VERIFIED','INFERRED','ASSUMED')), source_ids UUID[] NOT NULL DEFAULT '{}', embedding vector(1536), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE graph_edges (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, from_node_id UUID REFERENCES graph_nodes(id) ON DELETE CASCADE, to_node_id UUID REFERENCES graph_nodes(id) ON DELETE CASCADE, relationship TEXT NOT NULL, confidence TEXT NOT NULL CHECK(confidence IN ('VERIFIED','INFERRED','ASSUMED')), source_ids UUID[] NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE decisions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, decision_key TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL, rationale TEXT NOT NULL, impact TEXT NOT NULL, source_ids UUID[] NOT NULL DEFAULT '{}', decided_at DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(project_id,decision_key));
CREATE TABLE adrs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, adr_number INTEGER NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL, markdown TEXT NOT NULL, confidence_score NUMERIC(4,2) NOT NULL CHECK(confidence_score BETWEEN 0 AND 1), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(project_id, adr_number));
CREATE TABLE gaps (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, domain TEXT NOT NULL, description TEXT NOT NULL, severity TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', artifact_path TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE generated_artifacts (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, path TEXT NOT NULL, artifact_type TEXT NOT NULL, content_sha256 TEXT NOT NULL, confidence TEXT NOT NULL CHECK(confidence IN ('VERIFIED','INFERRED','ASSUMED')), validation_status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(project_id,path));
CREATE TABLE jobs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, job_type TEXT NOT NULL, status TEXT NOT NULL, idempotency_key TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(tenant_id,idempotency_key));
CREATE TABLE audit_logs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL, actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL, action TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id UUID, metadata JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_source_records_project ON source_records(project_id);
CREATE INDEX idx_graph_nodes_project_type ON graph_nodes(project_id,node_type);
CREATE INDEX idx_graph_edges_from ON graph_edges(from_node_id);
CREATE INDEX idx_generated_artifacts_project ON generated_artifacts(project_id);
CREATE INDEX idx_jobs_status ON jobs(status,created_at);
