-- Run this in your Supabase SQL editor

-- Workout logs table
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  exercise_name text not null,
  phase int not null,
  week int not null,
  day text not null,
  sets jsonb not null default '[]',
  notes text,
  logged_at timestamptz default now()
);

alter table workout_logs enable row level security;

create policy "Users can manage their own logs"
  on workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User profiles (to store program type: male/female)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  program text check (program in ('male', 'female')) default 'male',
  current_phase int default 1,
  current_week int default 1,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
