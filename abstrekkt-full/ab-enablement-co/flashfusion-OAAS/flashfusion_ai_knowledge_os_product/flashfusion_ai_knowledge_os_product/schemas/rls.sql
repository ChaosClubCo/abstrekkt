-- FlashFusion RLS Starter Policies
-- Review before production. Assumes app.current_tenant_id is set per request.

alter table tenants enable row level security;
alter table actors enable row level security;
alter table provenance_records enable row level security;
alter table canonical_entities enable row level security;
alter table relationships enable row level security;
alter table memory_records enable row level security;
alter table prompt_registry enable row level security;
alter table agent_registry enable row level security;
alter table agent_runs enable row level security;
alter table audit_events enable row level security;

create policy tenant_isolation_entities on canonical_entities
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_relationships on relationships
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_memory on memory_records
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_prompts on prompt_registry
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_agents on agent_registry
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_agent_runs on agent_runs
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_provenance on provenance_records
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_actors on actors
  for all using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_audit_read on audit_events
  for select using (tenant_id::text = current_setting('app.current_tenant_id', true));

-- Audit events should generally be append-only.
create policy tenant_isolation_audit_insert on audit_events
  for insert with check (tenant_id::text = current_setting('app.current_tenant_id', true));
