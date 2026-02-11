-- Connections: persists source/destination project pairing per user
create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  from_project_gid text not null,
  from_project_name text not null,
  to_project_gid text not null,
  to_project_name text not null,
  last_polled_at timestamptz,
  created_at timestamptz default now() not null
);

-- One active connection per user
create unique index connections_user_id_idx on connections(user_id);

alter table connections enable row level security;

create policy "Users can manage their own connections"
  on connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Skills: versioned classification criteria linked to a connection
create table skills (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references connections(id) on delete cascade not null,
  version int not null default 1,
  criteria jsonb not null,
  created_at timestamptz default now() not null,
  unique(connection_id, version)
);

alter table skills enable row level security;

create policy "Users can read their own skills"
  on skills for select
  using (
    connection_id in (
      select id from connections where user_id = auth.uid()
    )
  );

create policy "Users can insert their own skills"
  on skills for insert
  with check (
    connection_id in (
      select id from connections where user_id = auth.uid()
    )
  );

-- Task candidates: source tasks evaluated by the AI
create table task_candidates (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references connections(id) on delete cascade not null,
  task_gid text not null,
  task_name text not null,
  task_notes text,
  ai_score float not null,
  ai_reasoning text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'moved')),
  user_comment text,
  reviewed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(connection_id, task_gid)
);

alter table task_candidates enable row level security;

create policy "Users can read their own candidates"
  on task_candidates for select
  using (
    connection_id in (
      select id from connections where user_id = auth.uid()
    )
  );

create policy "Users can insert their own candidates"
  on task_candidates for insert
  with check (
    connection_id in (
      select id from connections where user_id = auth.uid()
    )
  );

create policy "Users can update their own candidates"
  on task_candidates for update
  using (
    connection_id in (
      select id from connections where user_id = auth.uid()
    )
  );
