-- Couchgut – Schema, Rollen, RLS
-- Anwenden via Lovable Cloud / Supabase SQL Editor oder `supabase db push`.

-- ---------- Rollen ----------
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer, damit RLS-Policies die Rolle prüfen können,
-- ohne rekursiv an user_roles-Policies zu scheitern.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create policy "Admins read roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or user_id = auth.uid());

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.email
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Couches ----------
create table public.couches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'EUR',
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold')),
  description text not null default '',
  dimensions jsonb not null default '{}'::jsonb, -- { w, d, h, seatH } in cm
  material text not null default '',
  color text not null default '',
  style text not null default '',
  year integer,
  condition text not null default '',
  story text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.couches enable row level security;

create policy "Couches are public"
  on public.couches for select
  to anon, authenticated
  using (true);

create policy "Admins insert couches"
  on public.couches for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins update couches"
  on public.couches for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete couches"
  on public.couches for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---------- Orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  couch_id uuid not null references public.couches (id),
  buyer_user_id uuid references auth.users (id) on delete set null,
  guest_email text,
  guest_name text,
  shipping_address jsonb not null,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  -- entweder eingeloggter Käufer oder Gast mit E-Mail
  check (buyer_user_id is not null or guest_email is not null)
);

alter table public.orders enable row level security;

create policy "Users read own orders"
  on public.orders for select
  to authenticated
  using (buyer_user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users create own orders"
  on public.orders for insert
  to authenticated
  with check (buyer_user_id = auth.uid());

-- Gast-Bestellungen laufen über die Server-Function mit Service-Role-Key
-- (umgeht RLS bewusst); es gibt daher KEINE anon-Insert-Policy.

create policy "Admins update orders"
  on public.orders for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---------- Storage ----------
insert into storage.buckets (id, name, public)
values ('couch-images', 'couch-images', true)
on conflict (id) do nothing;

create policy "Couch images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'couch-images');

create policy "Admins manage couch images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'couch-images' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'couch-images' and public.has_role(auth.uid(), 'admin'));

-- ---------- Admin bootstrap ----------
-- Nach dem ersten Signup deines eigenen Accounts einmalig ausführen:
-- insert into public.user_roles (user_id, role)
-- values ('<DEINE-USER-ID>', 'admin');
