CREATE TABLE IF NOT EXISTS permissions (id TEXT PRIMARY KEY, description TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS role_permissions (role TEXT NOT NULL, permission_id TEXT NOT NULL REFERENCES permissions(id), PRIMARY KEY(role, permission_id));
INSERT INTO permissions (id, description) VALUES
('tenant.manage','Manage tenant settings'),('users.manage','Manage users'),('project.create','Create project'),('sources.import','Import sources'),('sources.view','View sources'),('facts.approve','Approve facts'),('adr.accept','Accept ADRs'),('artifacts.generate','Generate artifacts'),('validation.run','Run validation'),('exports.create','Create exports'),('audit.view','View audit logs') ON CONFLICT DO NOTHING;
