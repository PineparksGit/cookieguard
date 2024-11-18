-- Create websites table
create table if not exists public.websites (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    domain text not null,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_scan timestamp with time zone,
    is_active boolean default true,
    settings jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.websites enable row level security;

-- Create policies
create policy "Users can view their own websites"
    on public.websites
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own websites"
    on public.websites
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own websites"
    on public.websites
    for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own websites"
    on public.websites
    for delete
    to authenticated
    using (auth.uid() = user_id);