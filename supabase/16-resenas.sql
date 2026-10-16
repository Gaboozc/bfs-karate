-- ============================================================================
-- BFS Martial Arts — Las resenas reales de Google en el sitio
--
-- Ejecutar DESPUES de 15-sponsors.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE RESUELVE
-- La academia tiene 56 opiniones reales con 5.0 en su ficha de Google, y el
-- sitio no mostraba ninguna: las que traia el codigo eran de personas
-- inventadas y se retiraron. Prueba social autentica, sin usar.
-- ============================================================================
--
-- Por que una tabla y no una llamada a Google en vivo:
--
--   La API de Places devuelve maximo 5 resenas, exige una llave con facturacion
--   activa, y esa llave quedaria expuesta en el navegador. Para un sitio sin
--   backend es cambiar una dependencia de pago por un dato que igual hay que
--   curar a mano.
--
--   Aqui el Sensei elige cuales lucir desde el panel. El texto es el de la
--   persona, palabra por palabra, con su nombre y un enlace a la ficha para
--   que cualquiera lo verifique. Nada inventado: misma regla que pendientes.js.
--
-- Ejecutar en el editor SQL de Supabase.

create table if not exists public.resenas (
  id            uuid primary key default gen_random_uuid(),
  autor         text not null,
  calificacion  smallint not null default 5 check (calificacion between 1 and 5),
  texto         text not null,
  -- Google muestra "Hace un mes", no una fecha exacta. Se guarda la fecha
  -- aproximada en que se leyo, y `cuando` conserva el texto tal cual.
  fecha         date,
  cuando        text,
  fuente        text not null default 'google',
  url           text,                      -- enlace a la ficha o a la resena
  publicado     boolean not null default true,
  orden         smallint not null default 0,
  creado_en     timestamptz not null default now()
);

alter table public.resenas enable row level security;

-- Cualquiera lee las publicadas; solo una sesion del panel escribe.
drop policy if exists "resenas lectura publica" on public.resenas;
create policy "resenas lectura publica" on public.resenas
  for select using (publicado = true);

drop policy if exists "resenas administracion" on public.resenas;
create policy "resenas administracion" on public.resenas
  for all to authenticated using (true) with check (true);

-- ── Resenas reales, copiadas de la ficha de Google el 16/10/2026 ───────────
-- Ficha: https://maps.app.goo.gl/QJrgy1DTuhbAYHrE8  (5.0 · 56 opiniones)

insert into public.resenas (autor, calificacion, texto, cuando, fecha, orden)
values
  ('Blanca Favila Dominguez', 5,
   'Te enseñan desde cero y de acuerdo a tu nivel de condición física, te acompañan y te enseñan si es que nunca has realizado ninguna actividad física, las clases de crossfit muy recomendables pues te explican y enseñan para no lesionarte. Las clases de karate muy conscientes sobre el nivel de cada niño y también muy divertidas.',
   'Hace un mes', date '2026-09-16', 1),

  ('Lorena Lopez', 5,
   'Excelente escuela. La recomiendo ampliamente, por el compromiso y la responsabilidad hacia sus alumnos, además con una manera de enseñar súper dinámica y profesional por parte de su Sensei.',
   'Hace un mes', date '2026-09-16', 2),

  ('Marilu Alvarez', 5,
   'Una gran academia BFS, Sensei Zain hace que los niños y adultos saquen lo mejor de ellos. Muy recomendable.',
   'Hace un mes', date '2026-09-16', 3),

  ('Alejandra García Heredia', 5,
   'A mi hijo le gusta mucho. Buen maestro y buenas clases.',
   'Hace un mes', date '2026-09-16', 4),

  ('Nora Vazquez', 5,
   'Excelente sensei, mi esposo y yo tomamos crossfit con él y nos gusta mucho el entrenamiento.',
   'Hace 5 meses', date '2026-05-16', 5)
on conflict do nothing;

-- ── Resumen verificable de la ficha ────────────────────────────────────────
-- La calificacion y el total viven en `ajustes` para que el Sensei los
-- actualice desde el panel conforme lleguen opiniones nuevas.

insert into public.ajustes (clave, valor) values
  ('google_calificacion', '5.0'),
  ('google_total',        '56'),
  ('google_url',          'https://maps.app.goo.gl/QJrgy1DTuhbAYHrE8')
on conflict (clave) do update set valor = excluded.valor;
