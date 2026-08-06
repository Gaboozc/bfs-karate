-- ============================================================================
-- BFS Martial Arts — Inventario y carga inicial
--
-- Ejecutar DESPUES de 01-contenido-publico.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- Va en dos partes. Si algo falla, ejecuta la PARTE 1 sola, comprueba, y
-- luego la PARTE 2. Asi se ve cual es la que da problema.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Control de existencias                                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table productos add column if not exists existencias   integer;
alter table productos add column if not exists alerta_minima integer default 3;

comment on column productos.existencias   is 'null = sin control de inventario. 0 = agotado';
comment on column productos.alerta_minima is 'Debajo de este numero, el panel avisa que hay poco';

-- El sitio publico deja de mostrar lo agotado, sin que nadie lo oculte a mano
drop policy if exists "lectura publica de productos" on productos;
create policy "lectura publica de productos"
  on productos for select
  to anon, authenticated
  using (disponible = true and (existencias is null or existencias > 0));


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Horario actual de la academia                                  ║
-- ║ 1 = lunes, 2 = martes ... 7 = domingo                                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Se asegura de que exista la restriccion que evita clases duplicadas.
-- Si ya existe, no pasa nada.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'horarios_dia_hora_programa_key'
  ) then
    alter table horarios
      add constraint horarios_dia_hora_programa_key unique (dia, hora, programa);
  end if;
end $$;

insert into horarios (dia, hora, programa) values
  -- High Performance, manana (lunes a viernes)
  (1,'07:00','High Perf.'), (2,'07:00','High Perf.'), (3,'07:00','High Perf.'),
  (4,'07:00','High Perf.'), (5,'07:00','High Perf.'),

  -- Fin de semana por la manana
  (6,'09:00','Karate Kids'), (7,'09:00','Defensa P.'), (6,'10:00','Adultos'),

  -- Vespertino
  (1,'16:00','Karate Kids'), (3,'16:00','Karate Kids'), (5,'16:00','Karate Kids'),
  (2,'16:00','High Perf.'),  (4,'16:00','High Perf.'),

  (1,'17:30','Adultos'),     (3,'17:30','Adultos'),     (5,'17:30','Adultos'),
  (2,'17:30','Competitivo'), (4,'17:30','Competitivo'), (6,'17:30','Defensa P.'),

  (1,'19:00','Competitivo'), (3,'19:00','Competitivo'), (5,'19:00','Competitivo'),
  (2,'19:00','Adultos'),     (4,'19:00','Adultos'),

  (1,'20:30','High Perf.'),  (3,'20:30','High Perf.'),  (5,'20:30','High Perf.')
on conflict do nothing;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ COMPROBACION — debe mostrar 27 horarios y las 2 columnas nuevas          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

select 'clases cargadas' as concepto, count(*)::text as resultado from horarios
union all
select 'columnas de inventario',
       coalesce(string_agg(column_name, ', '), 'NINGUNA — la parte 1 fallo')
  from information_schema.columns
 where table_name = 'productos'
   and column_name in ('existencias','alerta_minima');
