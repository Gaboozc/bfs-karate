-- ============================================================================
-- BFS Martial Arts — Fase A: contenido publico editable
--
-- Ejecutar en Supabase > SQL Editor > New query > pegar > Run.
--
-- Crea las tres tablas que el Sensei va a administrar desde el panel, con
-- sus politicas de seguridad. Todo el mundo puede LEER lo publicado; solo
-- una sesion autenticada puede escribir.
-- ============================================================================


-- ── EVENTOS ─────────────────────────────────────────────────────────────────
create table if not exists eventos (
  id           bigint generated always as identity primary key,
  titulo       text not null,
  fecha        date not null,
  tipo         text not null default 'Torneo',
  sede         text,
  descripcion  text,
  color        text default '#c0392b',
  resultado    text,                      -- se llena cuando el evento ya paso
  publicado    boolean not null default false,
  creado_en    timestamptz not null default now()
);

comment on column eventos.publicado is 'Permite preparar un evento sin mostrarlo todavia';
comment on column eventos.resultado is 'Medallas o logros. Solo para eventos pasados';

create index if not exists eventos_fecha_idx on eventos (fecha desc);


-- ── HORARIOS ────────────────────────────────────────────────────────────────
create table if not exists horarios (
  id        bigint generated always as identity primary key,
  dia       smallint not null check (dia between 1 and 7),  -- 1 = lunes
  hora      time not null,
  programa  text not null,
  activo    boolean not null default true,
  creado_en timestamptz not null default now(),
  unique (dia, hora, programa)
);

comment on column horarios.dia is '1 = lunes ... 7 = domingo';

create index if not exists horarios_dia_hora_idx on horarios (dia, hora);


-- ── PRODUCTOS ───────────────────────────────────────────────────────────────
create table if not exists productos (
  id           bigint generated always as identity primary key,
  nombre       text not null,
  categoria    text not null default 'Ropa',
  precio       numeric(10,2),             -- null = "Consultar"
  descripcion  text,
  imagen       text,
  etiqueta     text,                      -- "Mas vendido", "Nuevo", etc.
  destacado    boolean not null default false,
  disponible   boolean not null default true,
  creado_en    timestamptz not null default now()
);

comment on column productos.precio is 'Si queda vacio, el sitio muestra "Consultar"';

create index if not exists productos_categoria_idx on productos (categoria);


-- ============================================================================
-- SEGURIDAD
--
-- Row Level Security queda ACTIVO en las tres tablas. Sin una politica que
-- lo permita explicitamente, nadie puede hacer nada.
-- ============================================================================

alter table eventos   enable row level security;
alter table horarios  enable row level security;
alter table productos enable row level security;


-- LECTURA PUBLICA: cualquiera puede ver lo que esta publicado o activo.
-- Es informacion que de todos modos aparece en el sitio.

drop policy if exists "lectura publica de eventos" on eventos;
create policy "lectura publica de eventos"
  on eventos for select
  to anon, authenticated
  using (publicado = true);

drop policy if exists "lectura publica de horarios" on horarios;
create policy "lectura publica de horarios"
  on horarios for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "lectura publica de productos" on productos;
create policy "lectura publica de productos"
  on productos for select
  to anon, authenticated
  using (disponible = true);


-- ESCRITURA Y BORRADORES: solo con sesion iniciada.
-- Esto incluye ver lo NO publicado, que es lo que necesita el panel.

drop policy if exists "el panel administra eventos" on eventos;
create policy "el panel administra eventos"
  on eventos for all
  to authenticated
  using (true) with check (true);

drop policy if exists "el panel administra horarios" on horarios;
create policy "el panel administra horarios"
  on horarios for all
  to authenticated
  using (true) with check (true);

drop policy if exists "el panel administra productos" on productos;
create policy "el panel administra productos"
  on productos for all
  to authenticated
  using (true) with check (true);


-- ============================================================================
-- COMPROBACION
-- Debe devolver las 3 tablas con rowsecurity = true
-- ============================================================================
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('eventos','horarios','productos')
order by tablename;
