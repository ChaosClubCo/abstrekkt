alter table study_data enable row level security;

create policy student_self on study_data
for select using (user_id = auth.uid());

create policy student_self_ins on study_data
for insert with check (user_id = auth.uid());

create policy student_self_upd on study_data
for update using (user_id = auth.uid());
