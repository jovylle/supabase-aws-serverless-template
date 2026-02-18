create extension if not exists "pgcrypto";

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  repo_url text,
  status text not null default 'active',
  priority integer not null default 0,
  tags text[],
  metadata jsonb default '{}'::jsonb,
  created_at timestamp default now()
);

create index if not exists projects_status_idx on projects (status);
create index if not exists projects_priority_idx on projects (priority);
create index if not exists projects_tags_idx on projects using gin (tags);
