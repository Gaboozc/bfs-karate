-- ============================================================================
-- BFS Martial Arts — Ajustes segun la planilla real de la academia
--
-- Ejecutar DESPUES de 05-alumnos.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- POR QUE
-- La hoja de inscripcion que ya usa BFS pide cosas que el formulario no
-- contemplaba: dos tutores, dos telefonos, experiencia previa en deportes de
-- contacto, y la aceptacion del reglamento interno. Estas columnas lo alinean
-- para que capturar sea leer la hoja de arriba a abajo.
-- ============================================================================


-- ── Segundo tutor y segundo telefono ────────────────────────────────────────
-- La hoja tiene dos renglones de PADRE/MADRE/TUTOR y dos numeros de contacto
alter table alumnos add column if not exists tutor2_nombre  text;
alter table alumnos add column if not exists telefono2      text;

comment on column alumnos.tutor2_nombre is 'Segundo renglon de PADRE/MADRE/TUTOR de la hoja';
comment on column alumnos.telefono2     is '2DO NUMERO DE CONTACTO de la hoja';


-- ── Cuestionario de la hoja ─────────────────────────────────────────────────
-- "El alumno ha hecho algun tipo de deporte de contacto anteriormente?"
-- Sirve para ubicarlo en el grupo correcto desde el primer dia
alter table alumnos add column if not exists deporte_previo text;

comment on column alumnos.deporte_previo is 'Deportes de contacto que ha practicado antes';


-- ── Reglamento interno ──────────────────────────────────────────────────────
-- El reglamento cubre pagos, recargo del 15%, faltas justificadas y no
-- reembolso. Se firma aparte de los permisos de imagen y salud.
alter table alumnos add column if not exists acepta_reglamento boolean not null default false;

comment on column alumnos.acepta_reglamento is 'Firmo el reglamento interno de la academia';


-- ── Consentimiento por programa ─────────────────────────────────────────────
-- La academia firma una hoja por disciplina (karate, entrenamiento funcional).
-- Queda registrado en la inscripcion, no en el alumno.
alter table inscripciones add column if not exists carta_firmada boolean not null default false;
alter table inscripciones add column if not exists firmada_el    date;

comment on column inscripciones.carta_firmada is 'Firmo la carta de consentimiento de ese programa';


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'columnas nuevas en alumnos' as concepto,
       string_agg(column_name, ', ' order by column_name) as resultado
  from information_schema.columns
 where table_name = 'alumnos'
   and column_name in ('tutor2_nombre','telefono2','deporte_previo','acepta_reglamento')
union all
select 'columnas nuevas en inscripciones',
       string_agg(column_name, ', ' order by column_name)
  from information_schema.columns
 where table_name = 'inscripciones'
   and column_name in ('carta_firmada','firmada_el');
