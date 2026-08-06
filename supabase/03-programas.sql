-- ============================================================================
-- BFS Martial Arts — Programas administrables
--
-- Ejecutar DESPUES de 02-inventario-y-datos-iniciales.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- POR QUE ESTE ARCHIVO
-- Los programas (Karate Kids, Adultos, etc.) estaban escritos a mano en el
-- codigo, y el horario que se cargo antes salio del contenido de ejemplo del
-- template. Nada de eso lo dio el Sensei.
--
-- Aqui los programas pasan a ser una tabla que el se administra: puede crear
-- crossfit, acondicionamiento fisico o lo que imparta, con su propio color.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Tabla de programas                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists programas (
  id           bigint generated always as identity primary key,
  nombre       text not null unique,
  color        text not null default '#c0392b',
  edades       text,                    -- "4 a 12 anos"
  nivel        text,                    -- "Todos los niveles"
  descripcion  text,
  precio       numeric(10,2),           -- null = "Consultar"
  duracion     text,                    -- "60 min"
  destacado    boolean not null default false,
  activo       boolean not null default true,
  orden        smallint not null default 0,
  creado_en    timestamptz not null default now()
);

comment on table  programas          is 'Clases que imparte la academia. Las administra el Sensei';
comment on column programas.orden    is 'Controla el orden en que aparecen en el sitio';
comment on column programas.precio   is 'Si queda vacio, el sitio muestra "Consultar"';

alter table programas enable row level security;

drop policy if exists "lectura publica de programas" on programas;
create policy "lectura publica de programas"
  on programas for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "el panel administra programas" on programas;
create policy "el panel administra programas"
  on programas for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Limpiar el horario de ejemplo                                  ║
-- ║                                                                          ║
-- ║ Las 27 clases cargadas antes salieron del contenido de relleno del       ║
-- ║ template, no del Sensei. Se borran para que el arme el suyo.             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

delete from horarios;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 3 — Enlazar horarios con programas                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- El horario deja de guardar el nombre del programa como texto suelto y pasa
-- a apuntar a la tabla. Asi, si el Sensei renombra una clase, el horario se
-- actualiza solo.
alter table horarios add column if not exists programa_id bigint references programas(id) on delete cascade;

-- La columna vieja de texto se conserva por compatibilidad, pero deja de ser
-- obligatoria: lo que manda es programa_id
alter table horarios alter column programa drop not null;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ COMPROBACION                                                             ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

select 'tabla programas' as concepto,
       case when exists (select 1 from information_schema.tables where table_name='programas')
            then 'creada' else 'FALTA' end as resultado
union all
select 'horarios (deben ser 0)', count(*)::text from horarios
union all
select 'programas cargados', count(*)::text from programas;
