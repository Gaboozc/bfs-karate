-- ============================================================================
-- BFS Martial Arts — Las horas de la parrilla se guardan
--
-- Ejecutar DESPUES de 10-reglamento-tal-cual.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- EL PROBLEMA
-- La parrilla del panel arma sus filas con las horas que ya tienen clase, mas
-- una lista fija escrita en el codigo. El boton "Agregar hora" solo metia la
-- hora en esa lista en memoria: si el Sensei agregaba tres horas y recargaba
-- antes de asignarles clase, las perdia sin aviso.
--
-- LA SOLUCION
-- Una hora vacia es informacion: significa "aqui quiero poner algo". Necesita
-- donde vivir. No sirve guardarla en la tabla de horarios, porque ahi cada
-- fila es una clase concreta con dia y programa; una hora suelta no lo es.
--
-- ACCESO
-- Solo el panel. El sitio publico arma su horario desde las clases reales, asi
-- que no necesita leer esto.
-- ============================================================================

create table if not exists franjas (
  id        bigint generated always as identity primary key,
  hora      time not null unique,
  creado_en timestamptz not null default now()
);

comment on table  franjas      is 'Horas visibles en la parrilla del panel, tengan clase o no';
comment on column franjas.hora is 'Sin dia ni programa: es solo el renglon de la parrilla';

alter table franjas enable row level security;

drop policy if exists "el panel administra franjas" on franjas;
create policy "el panel administra franjas"
  on franjas for all
  to authenticated
  using (true) with check (true);


-- Las siete horas que hasta hoy vivian escritas en el codigo. Se siembran para
-- que la parrilla se vea igual que siempre la primera vez, con la diferencia
-- de que ahora el Sensei puede quitarlas si no le sirven.
insert into franjas (hora) values
  ('07:00'), ('09:00'), ('10:00'), ('16:00'), ('17:30'), ('19:00'), ('20:30')
on conflict (hora) do nothing;


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'franjas guardadas' as concepto,
       string_agg(to_char(hora, 'HH12:MI AM'), ', ' order by hora) as resultado
  from franjas;
