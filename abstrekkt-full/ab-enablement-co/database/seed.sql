insert into roles (name, description) values
('owner', 'Full organization and billing authority'),
('admin', 'Manage organization delivery settings'),
('operator', 'Run engagements and agent workflows'),
('analyst', 'Analyze workflows and draft findings'),
('client_viewer', 'View approved client deliverables'),
('agent_runtime', 'Scoped runtime identity for agents'),
('auditor', 'Review claims, evidence, and compliance')
on conflict (name) do nothing;

insert into permissions (key, description) values
('lead:read','Read leads'),
('lead:write','Create and update leads'),
('audit:read','Read audit workspaces'),
('audit:write','Modify audit workspaces'),
('artifact:approve','Approve generated artifacts'),
('agent:run','Run scoped agents'),
('settings:manage','Manage organization settings')
on conflict (key) do nothing;
