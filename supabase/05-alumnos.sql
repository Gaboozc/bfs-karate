-- ============================================================================
-- BFS Martial Arts — Padron de alumnos
--
-- Ejecutar DESPUES de 04-categorias.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- ⚠️ ANTES DE CARGAR AL PRIMER ALUMNO
-- Esta tabla guarda datos personales de menores de edad, incluidos tres
-- campos de salud (lesiones, alergias, condiciones). Bajo la Ley Federal de
-- Proteccion de Datos Personales, los datos de salud son SENSIBLES y exigen
-- consentimiento expreso y por escrito del padre o tutor.
--
-- La hoja para eso esta en el proyecto. No captures a nadie sin ella firmada.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Padron                                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists alumnos (
  id                bigint generated always as identity primary key,

  -- Identificacion
  nombre            text not null,
  fecha_nacimiento  date,
  cinta             text,
  fecha_inscripcion date not null default current_date,
  estado            text not null default 'activo'
                    check (estado in ('activo','inactivo','baja')),

  -- Contacto del tutor (para menores) o del propio alumno
  tutor_nombre      text,
  tutor_telefono    text,
  direccion         text,
  contacto_emergencia text,

  -- Salud: SOLO lo indispensable para atender una urgencia en clase.
  -- No se piden diagnosticos ni historiales: entre menos se guarde, mejor.
  lesiones_previas  text,
  alergias          text,
  condiciones       text,   -- asma, epilepsia, etc.

  -- Permisos firmados
  autoriza_imagen   boolean not null default false,
  autoriza_salud    boolean not null default false,

  notas             text,
  creado_en         timestamptz not null default now()
);

comment on table  alumnos                  is 'Padron. Contiene datos personales de menores: acceso restringido';
comment on column alumnos.lesiones_previas is 'Solo lo necesario para adaptar el entrenamiento';
comment on column alumnos.alergias         is 'Solo lo necesario para atender una urgencia';
comment on column alumnos.condiciones      is 'Condiciones a considerar en clase, por ejemplo asma';
comment on column alumnos.autoriza_imagen  is 'Hoja de uso de imagen firmada por el tutor';
comment on column alumnos.autoriza_salud   is 'Consentimiento de datos de salud firmado por el tutor';

create index if not exists alumnos_estado_idx on alumnos (estado);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1b — Inscripciones                                                 ║
-- ║                                                                          ║
-- ║ Un alumno puede estar en varios programas a la vez: karate y crossfit,   ║
-- ║ o defensa personal y acondicionamiento. Por eso la inscripcion vive en   ║
-- ║ su propia tabla y no como una columna del alumno.                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists inscripciones (
  id          bigint generated always as identity primary key,
  alumno_id   bigint not null references alumnos(id)   on delete cascade,
  programa_id bigint not null references programas(id) on delete cascade,
  desde       date not null default current_date,
  hasta       date,                    -- null = sigue inscrito
  creado_en   timestamptz not null default now(),
  unique (alumno_id, programa_id)
);

comment on table  inscripciones       is 'Que programas cursa cada alumno. Uno puede tener varios';
comment on column inscripciones.hasta is 'Si tiene fecha, el alumno ya dejo ese programa';

create index if not exists inscripciones_alumno_idx   on inscripciones (alumno_id);
create index if not exists inscripciones_programa_idx on inscripciones (programa_id);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Historial de grados                                            ║
-- ║ Cada cambio de cinta queda registrado: es la trayectoria del alumno y    ║
-- ║ ademas da material para publicar en redes.                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists grados (
  id        bigint generated always as identity primary key,
  alumno_id bigint not null references alumnos(id) on delete cascade,
  cinta     text not null,
  fecha     date not null default current_date,
  notas     text,
  creado_en timestamptz not null default now()
);

create index if not exists grados_alumno_idx on grados (alumno_id, fecha desc);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 3 — SEGURIDAD                                                      ║
-- ║                                                                          ║
-- ║ A diferencia del contenido publico, aqui NO hay lectura anonima.         ║
-- ║ Sin sesion iniciada, estas tablas no devuelven absolutamente nada.       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table alumnos       enable row level security;
alter table grados        enable row level security;
alter table inscripciones enable row level security;

-- Ninguna politica para el rol anonimo: eso ya lo bloquea todo.
-- Solo se concede acceso a sesiones autenticadas.

drop policy if exists "el panel administra alumnos" on alumnos;
create policy "el panel administra alumnos"
  on alumnos for all
  to authenticated
  using (true) with check (true);

drop policy if exists "el panel administra grados" on grados;
create policy "el panel administra grados"
  on grados for all
  to authenticated
  using (true) with check (true);

drop policy if exists "el panel administra inscripciones" on inscripciones;
create policy "el panel administra inscripciones"
  on inscripciones for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ COMPROBACION                                                             ║
-- ║ Las dos tablas deben aparecer con rowsecurity = true                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

select tablename, rowsecurity as seguridad_activa
  from pg_tables
 where schemaname = 'public' and tablename in ('alumnos','grados','inscripciones')
 order by tablename;
