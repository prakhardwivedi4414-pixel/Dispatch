-- ==============================================================================
-- THE DISPATCH — Stories That Matter
-- Lightweight Editorial CMS Relational Database Schema (Supabase / PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & DOMAIN TYPES
create type public.user_role as enum ('contributor', 'editor', 'admin');
create type public.story_status as enum ('draft', 'review', 'published');
create type public.story_format as enum ('long-read', 'short', 'photo', 'audio', 'video');
create type public.story_category as enum ('Campus', 'Society', 'Culture', 'Investigations');

-- 3. PROFILES TABLE (Associated with Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  role public.user_role not null default 'contributor',
  avatar_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.profiles is 'Authorized newsroom user accounts and role-based permissions.';

-- 4. CONTRIBUTORS TABLE (Verified editorial staff, photographers, documentarians)
create table if not exists public.contributors (
  id text primary key,
  display_name text not null,
  role text not null,
  bio text,
  profile_image text,
  profile_link text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.contributors is 'Newsroom roster of reporters, photographers, and audio/video producers.';

-- 5. ARTICLES TABLE
create table if not exists public.articles (
  id text primary key,
  slug text unique not null,
  headline text not null,
  subheading text,
  summary text not null,
  body text not null,
  category public.story_category not null,
  format public.story_format not null,
  cover_src text not null,
  cover_alt text not null,
  cover_credit text not null,
  cover_caption text not null,
  media jsonb,
  sources jsonb default '[]'::jsonb,
  source_pdf jsonb,
  pdf_pages jsonb default '[]'::jsonb,
  status public.story_status not null default 'draft',
  published_at text,
  reading_time integer not null default 1,
  is_lead boolean not null default false,
  is_demo boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_articles_status on public.articles (status);
create index if not exists idx_articles_category on public.articles (category);
create index if not exists idx_articles_format on public.articles (format);
create index if not exists idx_articles_slug on public.articles (slug);

comment on table public.articles is 'Editorial articles and multimedia stories published by The Dispatch.';

-- 6. ARTICLE CONTRIBUTORS JOIN TABLE (Many-to-many attribution with specific roles)
create table if not exists public.article_contributors (
  id uuid primary key default gen_random_uuid(),
  article_id text references public.articles(id) on delete cascade not null,
  contributor_id text references public.contributors(id) on delete cascade not null,
  contribution_role text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (article_id, contributor_id)
);

create index if not exists idx_article_contributors_article on public.article_contributors (article_id);
create index if not exists idx_article_contributors_contributor on public.article_contributors (contributor_id);

comment on table public.article_contributors is 'Specific editorial attribution linking contributors to individual stories.';

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.contributors enable row level security;
alter table public.articles enable row level security;
alter table public.article_contributors enable row level security;

-- PROFILES POLICIES
create policy "Public can view staff profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger: Prevent self-promotion to administrator
create or replace function public.check_user_role_update()
returns trigger as $$
begin
  if new.role = 'admin' and (old.role is null or old.role <> 'admin') then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin' and display_name = 'Samridhi'
    ) then
      raise exception 'Unauthorized: Only Administrator Samridhi can grant administrator privileges.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_check_user_role_update on public.profiles;
create trigger trg_check_user_role_update
  before update on public.profiles
  for each row execute function public.check_user_role_update();

-- CONTRIBUTORS POLICIES
create policy "Public can view contributors"
  on public.contributors for select
  using (true);

create policy "Only Samridhi (Administrator) can mutate contributors"
  on public.contributors for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin' and display_name = 'Samridhi'
    )
  );

-- ARTICLES POLICIES
create policy "Public can read published articles"
  on public.articles for select
  using (status = 'published');

create policy "Staff can read all articles"
  on public.articles for select
  using (
    auth.role() = 'authenticated'
  );

create policy "Contributors can create draft articles"
  on public.articles for insert
  with check (
    auth.role() = 'authenticated'
  );

create policy "Contributors can edit their own drafts"
  on public.articles for update
  using (
    created_by = auth.uid() and
    status in ('draft', 'review')
  );

create policy "Only Samridhi (Administrator) has full article publishing control"
  on public.articles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin' and display_name = 'Samridhi'
    )
  );

-- ARTICLE CONTRIBUTORS POLICIES
create policy "Public can read article attribution"
  on public.article_contributors for select
  using (true);

create policy "Only Samridhi (Administrator) can manage attribution"
  on public.article_contributors for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin' and display_name = 'Samridhi'
    )
  );

-- ==============================================================================
-- 8. STORAGE BUCKET CONFIGURATION (Supabase Storage)
-- ==============================================================================
-- Run in Supabase SQL editor:
-- insert into storage.buckets (id, name, public) values ('the-dispatch-covers', 'the-dispatch-covers', true);
--
-- Policy: Public read for cover images
-- create policy "Cover images are publicly readable"
--   on storage.objects for select
--   using (bucket_id = 'the-dispatch-covers');
--
-- Policy: Only Administrator Samridhi can upload cover images
-- create policy "Administrator can upload story covers"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'the-dispatch-covers' and
--     auth.role() = 'authenticated'
--   );

-- ==============================================================================
-- 9. SEED DATA (Confirmed Newsroom roster: Samridhi, Arpita Singh, Kirti)
-- ==============================================================================

insert into public.contributors (id, display_name, role) values
  ('samridhi', 'Samridhi', 'Administrator'),
  ('arpita-singh', 'Arpita Singh', 'Contributor'),
  ('kirti', 'Kirti', 'Contributor')
on conflict (id) do nothing;
