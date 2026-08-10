-- ============================================================================
-- BFS Martial Arts — Fotos de productos desde el telefono
--
-- Ejecutar DESPUES de 12-multimedia-y-redes.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE RESUELVE
-- El formulario de producto pedia "Imagen (enlace)": una URL. Para el Sensei,
-- que va a fotografiar la mercancia con su telefono parado en el dojo, eso es
-- inservible — tendria que subir la foto a otro lado primero y copiar la
-- direccion. Ahora las fotos se suben directo, y varias por producto.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Donde viven los archivos                                       ║
-- ║                                                                          ║
-- ║ Bucket publico: las fotos de la tienda estan para verse. Publico aplica  ║
-- ║ solo a LEER; subir y borrar siguen exigiendo sesion, mas abajo.          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "lectura publica de fotos de productos" on storage.objects;
create policy "lectura publica de fotos de productos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'productos');

drop policy if exists "el panel sube fotos de productos" on storage.objects;
create policy "el panel sube fotos de productos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "el panel reemplaza fotos de productos" on storage.objects;
create policy "el panel reemplaza fotos de productos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

drop policy if exists "el panel borra fotos de productos" on storage.objects;
create policy "el panel borra fotos de productos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Varias fotos por producto                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists producto_imagenes (
  id          bigint generated always as identity primary key,
  producto_id bigint not null references productos(id) on delete cascade,
  url         text not null,
  ruta        text not null,
  orden       smallint not null default 0,
  creado_en   timestamptz not null default now()
);

comment on table  producto_imagenes       is 'Fotos de cada producto. La de menor orden es la portada';
comment on column producto_imagenes.ruta  is 'Ruta dentro del bucket. Hace falta para borrar el archivo, no solo la fila';
comment on column producto_imagenes.orden is 'Menor primero. La primera es la que se ve en la tienda';

-- on delete cascade borra las filas al borrar el producto, pero NO los
-- archivos del bucket: eso lo hace el panel antes de borrar el producto.
create index if not exists producto_imagenes_producto_idx
  on producto_imagenes (producto_id, orden);

alter table producto_imagenes enable row level security;

drop policy if exists "lectura publica de imagenes de producto" on producto_imagenes;
create policy "lectura publica de imagenes de producto"
  on producto_imagenes for select
  to anon, authenticated
  using (true);

drop policy if exists "el panel administra imagenes de producto" on producto_imagenes;
create policy "el panel administra imagenes de producto"
  on producto_imagenes for all
  to authenticated
  using (true) with check (true);


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'bucket de fotos' as concepto,
       case when exists (select 1 from storage.buckets where id = 'productos')
            then 'creado' else 'FALTA' end as resultado
union all
select 'tabla producto_imagenes',
       case when exists (select 1 from information_schema.tables where table_name = 'producto_imagenes')
            then 'creada' else 'FALTA' end
union all
select 'fotos guardadas', count(*)::text from producto_imagenes;
