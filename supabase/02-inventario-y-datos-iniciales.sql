-- ============================================================================
-- BFS Martial Arts — Inventario y carga inicial
--
-- Ejecutar DESPUES de 01-contenido-publico.sql
-- Supabase > SQL Editor > New query > pegar > Run
--
-- 1. Agrega control de existencias a los productos
-- 2. Carga el horario actual de la academia, para no capturarlo a mano
-- ============================================================================


-- ── Existencias ─────────────────────────────────────────────────────────────
-- null = no se lleva control de ese producto (por ejemplo, algo bajo pedido)
-- 0    = agotado, deja de mostrarse en el sitio

alter table productos add column if not exists existencias integer;
alter table productos add column if not exists alerta_minima integer default 3;

comment on column productos.existencias   is 'null = sin control de inventario. 0 = agotado';
comment on column productos.alerta_minima is 'Debajo de este numero, el panel avisa que hay poco';


-- El sitio publico deja de mostrar lo agotado, sin que nadie tenga que
-- desmarcarlo a mano.
drop policy if exists "lectura publica de productos" on productos;
create policy "lectura publica de productos"
  on productos for select
  to anon, authenticated
  using (disponible = true and (existencias is null or existencias > 0));


-- ── Horario actual de la academia ───────────────────────────────────────────
-- Se carga el que ya estaba en el sitio. 1 = lunes ... 7 = domingo

insert into horarios (dia, hora, programa) values
  -- High Performance, manana
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
on conflict (dia, hora, programa) do nothing;


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'horarios cargados' as concepto, count(*)::text as valor from horarios
union all
select 'columnas de inventario', string_agg(column_name, ', ')
  from information_schema.columns
  where table_name = 'productos' and column_name in ('existencias','alerta_minima');
