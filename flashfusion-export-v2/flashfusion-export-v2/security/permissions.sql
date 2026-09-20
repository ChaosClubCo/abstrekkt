-- Provenance: [INFERRED]. Seed roles/permissions and helper functions.
insert into roles(key,name,description) values
('owner','Owner','Full platform owner'),('platform_admin','Platform Admin','Operational admin'),('consultant','Consultant','Delivery role'),('client_admin','Client Admin','Client tenant owner'),('client_user','Client User','Standard client'),('learner','Learner','Learning user'),('agent_service','Agent Service','Scoped runtime')
on conflict (key) do update set name=excluded.name, description=excluded.description;
create or replace function is_member_of(check_tenant uuid) returns boolean language sql security definer stable as $$ select exists(select 1 from memberships where tenant_id=check_tenant and user_id=auth.uid() and status='active') $$;
create or replace function has_role(check_tenant uuid, role_keys text[]) returns boolean language sql security definer stable as $$ select exists(select 1 from memberships where tenant_id=check_tenant and user_id=auth.uid() and role_key=any(role_keys) and status='active') $$;
-- Example policies to adapt after table ownership review.
create policy if not exists tenant_read_assessments on assessments for select using (tenant_id is null or is_member_of(tenant_id));
create policy if not exists tenant_read_reports on assessment_reports for select using (tenant_id is not null and is_member_of(tenant_id));
create policy if not exists admin_manage_engagements on engagements for all using (has_role(tenant_id,array['owner','platform_admin','consultant'])) with check (has_role(tenant_id,array['owner','platform_admin','consultant']));
-- No update/delete policies for audit_logs; append-only by default.
