-- A&A Inmobiliaria — Supabase Schema
-- Run this in the Supabase SQL editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users (admin accounts)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz default now()
);

-- Departments catalog
create table if not exists departamentos (
  code text primary key,
  name text not null
);

insert into departamentos (code, name) values
  ('FM', 'Francisco Morazán'),
  ('CO', 'Cortés'),
  ('ATL', 'Atlántida'),
  ('CM', 'Comayagua'),
  ('YO', 'Yoro'),
  ('CH', 'Choluteca'),
  ('OL', 'Olancho'),
  ('LP', 'La Paz'),
  ('IN', 'Intibucá'),
  ('EP', 'El Paraíso'),
  ('CP', 'Copán'),
  ('SB', 'Santa Bárbara'),
  ('LE', 'Lempira'),
  ('OC', 'Ocotepeque'),
  ('CL', 'Colón'),
  ('VA', 'Valle'),
  ('GD', 'Gracias a Dios'),
  ('IB', 'Islas de la Bahía')
on conflict do nothing;

-- Lotifications (parent projects)
create table if not exists lotifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  departamento text references departamentos(code),
  municipio text,
  total_lots int default 0,
  created_at timestamptz default now()
);

-- Properties
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null check (type in ('Terreno', 'Lote', 'Casa', 'Comercial', 'Propiedad')),
  municipio text not null,
  departamento text not null,
  dep_code text references departamentos(code),
  price numeric not null,
  currency text default 'L',
  area_varas text,
  area_m2 text,
  financing boolean default false,
  description text,
  highlights text[] default '{}',
  lotification_id uuid references lotifications(id),
  lotification_name text,
  status text default 'disponible' check (status in ('disponible', 'apartado', 'vendido', 'borrador')),
  payment_methods text[] default '{contado}',
  financing_prima numeric,
  financing_plazo_meses int,
  financing_tasa_anual numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property images
create table if not exists property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  public_id text,
  "order" int default 0,
  created_at timestamptz default now()
);

-- Leads
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  property_id uuid references properties(id),
  property_title text,
  status text default 'pendiente' check (status in ('pendiente', 'en-conversacion', 'agendado', 'cerrado', 'no-prospera')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales
create table if not exists sales (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null,
  property_id uuid references properties(id),
  property_title text not null,
  buyer_name text not null,
  buyer_email text,
  buyer_phone text,
  price numeric not null,
  payment_method text not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_properties_dep_code on properties(dep_code);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_financing on properties(financing);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_sales_date on sales(date desc);

-- Seed demo data
insert into properties (title, type, municipio, departamento, dep_code, price, currency, area_varas, area_m2, financing, description, highlights, status) values
  ('Terreno residencial en Valle de Ángeles', 'Terreno', 'Valle de Ángeles', 'Francisco Morazán', 'FM', 1850000, 'L', '1,250 varas²', '872 m²', true, 'Terreno urbano de 1,250 varas² con vista a la montaña y acceso a calle pavimentada. Servicios de agua potable y electricidad conectados.', '{Vista a la montaña,Calle pavimentada,Agua y electricidad,Escrituración al día}', 'disponible'),
  ('Terreno frente a playa · Tela', 'Terreno', 'Tela', 'Atlántida', 'ATL', 4200000, 'L', '2,100 varas²', '1,465 m²', false, 'Terreno con 42 metros de frente de playa en Tela. Acceso directo desde carretera CA-13.', '{42m de playa,Acceso CA-13,Solo contado,Escritura pública}', 'disponible'),
  ('Terreno agrícola en Siguatepeque', 'Terreno', 'Siguatepeque', 'Comayagua', 'CM', 2450000, 'L', '3,800 varas²', '2,651 m²', true, 'Parcela agrícola con suelo fértil, ideal para café o cultivo mixto.', '{Suelo fértil,Quebrada natural,Acceso vehicular,Clima fresco}', 'disponible'),
  ('Terreno comercial · San Pedro Sula', 'Comercial', 'San Pedro Sula', 'Cortés', 'CO', 3800000, 'L', '980 varas²', '683 m²', false, 'Terreno de uso comercial sobre boulevard principal. Alto flujo vehicular.', '{Uso comercial,Sobre boulevard,Licencia vigente,Solo contado}', 'disponible')
on conflict do nothing;

-- Site settings (single row configuration)
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_phone text not null default '50499383699',
  updated_at timestamptz default now()
);

insert into site_settings (id, whatsapp_phone) values (1, '50499383699') on conflict do nothing;

