-- ============================================================================
-- BFS Martial Arts — Patrocinadores y sus pagos
--
-- Ejecutar DESPUES de 14-redes-reales.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE RESUELVE
-- El sitio solo muestra los niveles y sus beneficios; todo lo demas —precio,
-- contrato, condiciones— lo trata el Sensei por WhatsApp. Aqui vive el
-- seguimiento: quien es cada patrocinador, desde cuando, cuanto paga y si
-- esta al corriente.
--
-- SOBRE LOS PAGOS
-- Para alumnos se decidio NO llevar pagos en el panel. Con patrocinadores es
-- distinto: son pocos, el trato es entre empresas y sin registro no hay forma
-- de saber quien debe. Cada pago es una fila con su fecha, editable, porque
-- se registran cuando el Sensei se entera y no siempre el dia que ocurrieron.
--
-- PRIVACIDAD
-- La tabla lleva telefono y correo de contacto: NO se puede leer sin sesion.
-- El sitio publico lee una vista aparte que solo expone marca, logo y nivel.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Patrocinadores                                                 ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists sponsors (
  id             bigint generated always as identity primary key,

  marca          text not null,
  tier           text not null default 'bronce' check (tier in ('bronce','plata','oro')),

  -- Con quien se trata. Solo visible con sesion.
  contacto       text,
  telefono       text,
  email          text,

  -- Para el banner del sitio
  logo           text,
  url            text,

  monto_mensual  numeric(10,2),
  dia_de_pago    smallint check (dia_de_pago between 1 and 31),

  inicio         date not null default current_date,
  fin            date,
  estado         text not null default 'activo' check (estado in ('activo','pausado','baja')),

  notas          text,
  creado_en      timestamptz not null default now()
);

comment on table  sponsors               is 'Patrocinadores de la academia y su seguimiento';
comment on column sponsors.dia_de_pago   is 'Dia del mes en que corresponde pagar. Sirve para saber quien va tarde';
comment on column sponsors.monto_mensual is 'Lo acordado por WhatsApp. El sitio nunca lo muestra';

create index if not exists sponsors_estado_idx on sponsors (estado, tier);

alter table sponsors enable row level security;

-- Sin politica para anon: nadie sin sesion lee contactos ni montos
drop policy if exists "el panel administra sponsors" on sponsors;
create policy "el panel administra sponsors"
  on sponsors for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Pagos                                                          ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists sponsor_pagos (
  id         bigint generated always as identity primary key,
  sponsor_id bigint not null references sponsors(id) on delete cascade,
  fecha      date not null default current_date,
  monto      numeric(10,2),
  metodo     text,
  nota       text,
  creado_en  timestamptz not null default now()
);

comment on table  sponsor_pagos       is 'Un renglon por pago recibido';
comment on column sponsor_pagos.fecha is 'Editable: los pagos se registran cuando uno se entera, no siempre el dia que ocurrieron';

create index if not exists sponsor_pagos_idx on sponsor_pagos (sponsor_id, fecha desc);

alter table sponsor_pagos enable row level security;

drop policy if exists "el panel administra pagos de sponsors" on sponsor_pagos;
create policy "el panel administra pagos de sponsors"
  on sponsor_pagos for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 3 — Lo unico que ve el sitio publico                               ║
-- ║                                                                          ║
-- ║ Una vista con las columnas seguras. RLS no filtra por columna, asi que   ║
-- ║ dar lectura a la tabla completa expondria telefonos y montos. La vista   ║
-- ║ corre con permisos de su dueno y solo devuelve lo que se puede publicar. ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create or replace view sponsors_publicos as
  select id, marca, logo, url, tier
    from sponsors
   where estado = 'activo'
   order by case tier when 'oro' then 1 when 'plata' then 2 else 3 end, marca;

comment on view sponsors_publicos is 'Solo marca, logo, enlace y nivel de los patrocinadores activos';

grant select on sponsors_publicos to anon, authenticated;


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'tabla sponsors' as concepto,
       case when exists (select 1 from information_schema.tables where table_name='sponsors')
            then 'creada' else 'FALTA' end as resultado
union all
select 'tabla sponsor_pagos',
       case when exists (select 1 from information_schema.tables where table_name='sponsor_pagos')
            then 'creada' else 'FALTA' end
union all
select 'vista publica',
       case when exists (select 1 from information_schema.views where table_name='sponsors_publicos')
            then 'creada' else 'FALTA' end
union all
select 'patrocinadores', count(*)::text from sponsors;
