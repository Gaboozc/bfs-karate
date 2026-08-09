-- ============================================================================
-- BFS Martial Arts — Multimedia y redes administrables
--
-- Ejecutar DESPUES de 11-franjas-horarias.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE RESUELVE
-- El bloque de multimedia del inicio vivia escrito en el codigo: el Sensei no
-- podia tocarlo. Pasa a la base, junto con los enlaces a las redes.
--
-- COMO SE MUESTRA LO RECIENTE
-- Con solo la direccion del perfil, cada red muestra sus publicaciones
-- recientes mediante su widget incrustable, que NO lleva llave de API. Eso es
-- distinto de la API: la API exige un token que caduca cada 60 dias y que en
-- un sitio sin backend quedaria expuesto en el navegador.
--
-- Las publicaciones destacadas son otra cosa: sirven para fijar un post
-- concreto y que no lo tape lo mas reciente.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Ajustes sueltos del sitio                                      ║
-- ║                                                                          ║
-- ║ Pares clave/valor en vez de una columna por dato: el ID de la playlist   ║
-- ║ y las URL de redes son valores unicos, y una tabla de una sola fila con  ║
-- ║ una columna por ajuste obliga a migrar cada vez que aparece uno nuevo.   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists ajustes (
  clave          text primary key,
  valor          text,
  actualizado_en timestamptz not null default now()
);

comment on table  ajustes       is 'Valores sueltos que el panel edita: redes, playlist, etc.';
comment on column ajustes.clave is 'Identificador estable que usa el codigo';

alter table ajustes enable row level security;

drop policy if exists "lectura publica de ajustes" on ajustes;
create policy "lectura publica de ajustes"
  on ajustes for select to anon, authenticated using (true);

drop policy if exists "el panel administra ajustes" on ajustes;
create policy "el panel administra ajustes"
  on ajustes for all to authenticated using (true) with check (true);

-- Se siembran vacios para que el panel los muestre como campos por llenar en
-- vez de una pantalla en blanco
insert into ajustes (clave, valor) values
  ('youtube_playlist', ''),
  ('red_instagram',    ''),
  ('red_facebook',     'https://facebook.com/bfsmartialarts'),
  ('red_tiktok',       ''),
  ('red_youtube',      '')
on conflict (clave) do nothing;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Publicaciones destacadas de redes                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists publicaciones (
  id        bigint generated always as identity primary key,
  red       text not null check (red in ('instagram','facebook','tiktok','youtube','otra')),
  url       text not null,
  titulo    text,
  imagen    text,
  orden     smallint not null default 0,
  publicado boolean not null default true,
  creado_en timestamptz not null default now()
);

comment on table  publicaciones        is 'Publicaciones de redes que el Sensei elige lucir en el sitio';
comment on column publicaciones.imagen is 'Miniatura opcional. Sin ella se muestra el logo de la red';
comment on column publicaciones.orden  is 'Menor primero. Empatados, gana la mas reciente';

create index if not exists publicaciones_orden_idx
  on publicaciones (publicado, orden, creado_en desc);

alter table publicaciones enable row level security;

drop policy if exists "lectura publica de publicaciones" on publicaciones;
create policy "lectura publica de publicaciones"
  on publicaciones for select to anon, authenticated using (publicado);

drop policy if exists "el panel administra publicaciones" on publicaciones;
create policy "el panel administra publicaciones"
  on publicaciones for all to authenticated using (true) with check (true);


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'ajustes sembrados' as concepto, string_agg(clave, ', ' order by clave) as resultado
  from ajustes
union all
select 'publicaciones', count(*)::text from publicaciones;
