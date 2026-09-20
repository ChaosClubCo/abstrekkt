create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text check (role in ('student','teacher','owner','admin')) not null default 'student',
  created_at timestamptz default now()
);

create table if not exists study_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  user_id uuid,
  action text not null,
  metadata jsonb,
  ts timestamptz default now()
);
