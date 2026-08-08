-- ============================================================================
-- BFS Martial Arts — El reglamento queda tal cual lo tiene el Sensei
--
-- Ejecutar DESPUES de 09-reglamento-por-disciplina.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- POR QUE
-- El 09 creo un segundo reglamento con cinco articulos adaptados a
-- acondicionamiento fisico (tatami, hidratacion, shorts, examenes y torneos).
-- Esa fue una interpretacion mia, no del Sensei. Se elimina: las dos
-- disciplinas vuelven a usar su texto original, palabra por palabra.
--
-- QUE SE CONSERVA
-- La columna programa_id y los indices se quedan. No estorban, y dejan la
-- puerta abierta por si el Sensei decide mas adelante que una disciplina
-- necesite su propia version. Lo que se borra es el contenido que invente,
-- no la posibilidad.
--
-- Lo unico que sigue separado por disciplina es el contrato de la hoja 2,
-- que el Sensei ya tenia escrito en dos versiones distintas.
-- ============================================================================

delete from documentos
 where programa_id is not null;


-- ============================================================================
-- COMPROBACION
-- Debe quedar un manifiesto y un reglamento, ambos para TODAS las disciplinas.
-- ============================================================================
select coalesce(p.nombre, 'TODAS las disciplinas') as aplica_a,
       d.clave,
       length(d.texto)::text || ' caracteres' as largo
  from documentos d
  left join programas p on p.id = d.programa_id
 order by d.orden;
