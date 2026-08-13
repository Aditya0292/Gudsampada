-- ═══════════════════════════════════════════════════
-- GudSampada — Primary PostgreSQL & Supabase Database Schema
-- SOURCE OF TRUTH — Production & Local Environment Sync
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── 1. ORDERS TABLE ───
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number varchar(50) unique not null,
  customer_name varchar(255) not null,
  customer_phone varchar(50) not null,
  customer_email varchar(255),
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  shipping_fee numeric(10,2) not null default 0 check (shipping_fee >= 0),
  total numeric(10,2) not null check (total >= 0),
  payment_status varchar(20) not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status varchar(20) not null default 'placed' check (order_status in ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  checkout_method varchar(50) default 'razorpay',
  razorpay_order_id varchar(100),
  razorpay_payment_id varchar(100),
  razorpay_signature varchar(255),
  tracking_number varchar(100),
  email_sent boolean default false,
  email_sent_at timestamptz,
  shiprocket_order_id varchar(100),
  shiprocket_shipment_id varchar(100),
  awb_number varchar(100),
  courier_name varchar(100),
  tracking_url text,
  shipment_status varchar(50) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 2. PRODUCTS TABLE ───
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  price_250g numeric(10,2) not null default 149.00 check (price_250g >= 0),
  price_500g numeric(10,2) not null default 279.00 check (price_500g >= 0),
  original_price_250g numeric(10,2),
  original_price_500g numeric(10,2),
  stock_250g integer not null default 100 check (stock_250g >= 0),
  stock_500g integer not null default 100 check (stock_500g >= 0),
  weight_grams integer not null default 300 check (weight_grams >= 0),
  image_url text not null,
  images text[],
  category varchar(100),
  tagline varchar(255),
  badge varchar(50),
  how_to_use text,
  benefits text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 3. SHIPROCKET AUTH TOKEN CACHE TABLE ───
create table if not exists public.shiprocket_auth (
  id integer primary key default 1,
  token text not null,
  expires_at timestamptz not null
);

-- ─── 4. B2B ENQUIRIES TABLE ───
create table if not exists public.b2b_enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type varchar(50) not null check (enquiry_type in ('distributor', 'corporate_gifting', 'white_label', 'bulk_raw')),
  contact_name varchar(255) not null,
  company_name varchar(255),
  phone varchar(50) not null,
  email varchar(255),
  city varchar(100) not null,
  message text not null,
  estimated_quantity varchar(100),
  status varchar(20) not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 4. ROW LEVEL SECURITY (RLS) ───
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.b2b_enquiries enable row level security;

-- Products Policies
drop policy if exists "Allow public read access to products" on public.products;
create policy "Allow public read access to products"
  on public.products for select
  using (true);

-- Orders Policies
drop policy if exists "Allow public insert for orders" on public.orders;
create policy "Allow public insert for orders"
  on public.orders for insert
  with check (
    payment_status = 'pending' 
    and order_status = 'placed'
    and char_length(customer_name) > 0
    and char_length(customer_phone) > 0
  );

drop policy if exists "Allow update on orders for payment verification" on public.orders;
-- Note: Payment updates are executed server-side via Supabase service_role or authenticated admin context

-- B2B Enquiries Policies
drop policy if exists "Allow public insert for b2b enquiries" on public.b2b_enquiries;
create policy "Allow public insert for b2b enquiries"
  on public.b2b_enquiries for insert
  with check (
    status = 'new'
    and char_length(contact_name) > 0
    and char_length(phone) > 0
  );

-- ─── 5. SEED INITIAL PRODUCTS DATA ───
insert into public.products (id, name, slug, description, price_250g, price_500g, image_url)
values 
  (
    '00000000-0000-0000-0000-000000000001',
    'Ginger Jaggery Powder',
    'ginger-jaggery-powder',
    'Infused with sun-dried ginger spice and native Kolhapuri sugarcane molasses.',
    149.00,
    279.00,
    '/images/ginger-jaggery-powder-front.png'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Paan Jaggery Bites',
    'paan-jaggery-bites',
    'Hand-cut jaggery bites infused with organic betel leaf and cardamom extracts.',
    149.00,
    279.00,
    '/images/paan-jaggery-bites.png'
  )
on conflict (slug) do update set
  price_250g = excluded.price_250g,
  price_500g = excluded.price_500g;

-- ─── 6. ADMIN AUTH RLS POLICIES & STORAGE BUCKET ───
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public bucket allows asset serving via URL; list objects restricted to authenticated admins
drop policy if exists "Allow public read access on product-images" on storage.objects;
drop policy if exists "Allow authenticated admin listing on product-images" on storage.objects;
create policy "Allow authenticated admin listing on product-images"
  on storage.objects for select
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin upload on product-images" on storage.objects;
create policy "Allow authenticated admin upload on product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin delete on product-images" on storage.objects;
create policy "Allow authenticated admin delete on product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin full access on orders" on public.orders;
create policy "Allow authenticated admin full access on orders"
  on public.orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin full access on products" on public.products;
create policy "Allow authenticated admin full access on products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated admin full access on b2b_enquiries" on public.b2b_enquiries;
create policy "Allow authenticated admin full access on b2b_enquiries"
  on public.b2b_enquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Revoke public execution of security definer helper function if exists
do $$
begin
  if exists (select 1 from pg_proc join pg_namespace n on n.oid = pg_proc.pronamespace where proname = 'rls_auto_enable' and n.nspname = 'public') then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated;';
  end if;
end $$;
