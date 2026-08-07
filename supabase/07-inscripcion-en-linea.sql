-- ============================================================================
-- BFS Martial Arts — Inscripcion en linea
--
-- Ejecutar DESPUES de 06-ajustes-planilla-real.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE HACE
-- Permite que la gente se inscriba desde un enlace, sin que el Sensei capture
-- nada. Las solicitudes llegan a una bandeja del panel; el las revisa y las
-- aprueba, y hasta entonces pasan al padron.
--
-- SEGURIDAD
-- El formulario es publico, asi que cualquiera puede ENVIAR una solicitud.
-- Pero nadie sin sesion puede LEER ninguna: no se pueden consultar los datos
-- de otras personas ni comprobar si alguien esta inscrito.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Texto del contrato, por programa                               ║
-- ║ Karate y Acondicionamiento tienen textos distintos, asi que vive en el   ║
-- ║ programa y el Sensei puede editarlo sin tocar codigo.                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table programas add column if not exists contrato text;
alter table programas add column if not exists slug     text unique;

comment on column programas.contrato is 'Texto que la persona acepta al inscribirse a este programa';
comment on column programas.slug     is 'Identificador para el enlace publico: /inscripcion/karate';


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Bandeja de solicitudes                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists solicitudes (
  id                bigint generated always as identity primary key,

  -- Los mismos campos de la hoja de inscripcion
  nombre            text not null,
  fecha_nacimiento  date,
  tutor_nombre      text,
  tutor2_nombre     text,
  tutor_telefono    text,
  telefono2         text,
  lesiones_previas  text,
  deporte_previo    text,
  alergias          text,
  condiciones       text,

  -- A que programa se inscribe
  programa_id       bigint references programas(id) on delete set null,

  -- Constancia de lo aceptado: se guarda el texto tal cual estaba el dia
  -- que firmo, no una referencia. Si el contrato cambia despues, lo que
  -- esta persona acepto sigue siendo consultable.
  contrato_texto    text,
  contrato_firmante text,              -- quien declaro estar firmando
  acepto_contrato   boolean not null default false,
  acepto_imagen     boolean not null default false,
  acepto_salud      boolean not null default false,

  -- Flujo
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente','aprobada','rechazada')),
  alumno_id         bigint references alumnos(id) on delete set null,
  nota_interna      text,

  creado_en         timestamptz not null default now(),
  resuelto_en       timestamptz
);

comment on table  solicitudes                is 'Inscripciones recibidas desde el sitio, a la espera de revision';
comment on column solicitudes.contrato_texto is 'Copia literal del contrato aceptado. Es la constancia';
comment on column solicitudes.alumno_id      is 'Se llena al aprobar: enlaza con el alumno creado';

create index if not exists solicitudes_estado_idx on solicitudes (estado, creado_en desc);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 3 — SEGURIDAD                                                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table solicitudes enable row level security;

-- Cualquiera puede ENVIAR una solicitud...
drop policy if exists "cualquiera puede solicitar inscripcion" on solicitudes;
create policy "cualquiera puede solicitar inscripcion"
  on solicitudes for insert
  to anon, authenticated
  with check (true);

-- ...pero NADIE sin sesion puede leerlas, cambiarlas ni borrarlas.
-- Al no existir politica de select para anon, queda bloqueado.
drop policy if exists "el panel revisa solicitudes" on solicitudes;
create policy "el panel revisa solicitudes"
  on solicitudes for select
  to authenticated
  using (true);

drop policy if exists "el panel resuelve solicitudes" on solicitudes;
create policy "el panel resuelve solicitudes"
  on solicitudes for update
  to authenticated
  using (true) with check (true);

drop policy if exists "el panel descarta solicitudes" on solicitudes;
create policy "el panel descarta solicitudes"
  on solicitudes for delete
  to authenticated
  using (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 4 — Los dos programas con sus contratos                            ║
-- ║                                                                          ║
-- ║ Texto tomado de las hojas que ya usa la academia. Se corrigieron solo    ║
-- ║ errores de ortografia, sin cambiar el sentido. CONVIENE QUE EL SENSEI    ║
-- ║ LO REVISE antes de publicarlo.                                           ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

insert into programas (nombre, slug, color, activo, orden, contrato) values
(
  'Karate', 'karate', '#c0392b', true, 1,
  'Yo, el padre, madre o tutor que firma, soy consciente de que mi hijo o hija forma parte desde hoy de la ACADEMIA BFS MARTIAL ARTS & HIGH PERFORMANCE, dejando al instructor —totalmente capacitado— llevarlo a un nivel superior fisica y mentalmente.

Entiendo y estoy al tanto de que se trata de un deporte de contacto y de que puede ocurrir algun tipo de lesion, por lo que la academia queda exenta de responsabilidad por cualquier accidente que ocurra dentro o fuera de ella.

Me comprometo a pagar toda mensualidad, evento o producto de la academia en tiempo y forma. Si llego a atrasarme, soy consciente de que se cobrara un recargo del 15%.

Soy consciente de que la Academia BFS MARTIAL ARTS & HIGH PERFORMANCE no se hace cargo de ningun tipo de reembolso.

La Academia BFS se compromete a dar siempre la mayor calidad dentro y fuera de clases, para que todo estudiante se sienta comodo y feliz.'
),
(
  'Acondicionamiento Fisico', 'acondicionamiento', '#6b4c36', true, 2,
  'Yo, quien firma, formo parte de la academia BFS MARTIAL ARTS & HIGH PERFORMANCE desde hoy, y dejo en manos del instructor llevarme a otro nivel fisico y mental. El se compromete a ayudarme a cumplir mis metas.

Por mi parte me comprometo a cumplir puntualmente con cualquier pago, ya sea mensualidad, evento o cualquier producto de la academia. Si llego a atrasarme, soy consciente de que se cobrara un recargo del 15%.

La Academia BFS se compromete a mantenerte en un lugar comodo y feliz, para que puedas sentirte en casa y enfocado en ser MEJOR QUE AYER.'
)
on conflict (nombre) do update
  set slug     = excluded.slug,
      contrato = excluded.contrato;


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'tabla solicitudes' as concepto,
       case when exists (select 1 from information_schema.tables where table_name='solicitudes')
            then 'creada' else 'FALTA' end as resultado
union all
select 'programas con enlace', string_agg(slug, ', ' order by orden)
  from programas where slug is not null
union all
select 'contratos cargados', count(*)::text
  from programas where contrato is not null;
