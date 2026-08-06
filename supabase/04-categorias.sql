-- ============================================================================
-- BFS Martial Arts — Categorias del inventario administrables
--
-- Ejecutar DESPUES de 03-programas.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- POR QUE ESTE ARCHIVO
-- Las categorias de la tienda (Ropa, Equipo, Accesorios) estaban escritas a
-- mano en el codigo. El Sensei las crea aqui, y varios productos pueden
-- compartir la misma.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Tabla de categorias                                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists categorias (
  id        bigint generated always as identity primary key,
  nombre    text not null unique,
  orden     smallint not null default 0,
  creado_en timestamptz not null default now()
);

comment on table  categorias       is 'Categorias de la tienda. Varios productos comparten una';
comment on column categorias.orden is 'Controla el orden de los filtros en la tienda';

alter table categorias enable row level security;

drop policy if exists "lectura publica de categorias" on categorias;
create policy "lectura publica de categorias"
  on categorias for select
  to anon, authenticated
  using (true);

drop policy if exists "el panel administra categorias" on categorias;
create policy "el panel administra categorias"
  on categorias for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Enlazar los productos con las categorias                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table productos add column if not exists categoria_id bigint references categorias(id) on delete set null;

comment on column productos.categoria_id is 'Al borrar una categoria, sus productos quedan sin categoria en vez de borrarse';

-- La columna vieja de texto deja de ser obligatoria: lo que manda es el enlace
alter table productos alter column categoria drop not null;

create index if not exists productos_categoria_id_idx on productos (categoria_id);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ COMPROBACION                                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

select 'tabla categorias' as concepto,
       case when exists (select 1 from information_schema.tables where table_name='categorias')
            then 'creada' else 'FALTA' end as resultado
union all
select 'enlace en productos',
       case when exists (
         select 1 from information_schema.columns
          where table_name='productos' and column_name='categoria_id'
       ) then 'listo' else 'FALTA' end
union all
select 'categorias cargadas', count(*)::text from categorias;
