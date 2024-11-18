-- Create the allowed_email_domains table if it doesn't exist
create table if not exists public.allowed_email_domains (
    id uuid default gen_random_uuid() primary key,
    domain text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.allowed_email_domains enable row level security;

-- Create policy for anonymous read access
create policy "Allow anonymous read access"
    on public.allowed_email_domains
    for select
    to anon
    using (true);

-- Insert initial allowed domains
insert into public.allowed_email_domains (domain)
values 
    ('pineparks.com'),
    ('gmail.com')
on conflict (domain) do nothing;