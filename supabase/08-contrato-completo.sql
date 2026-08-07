-- ============================================================================
-- BFS Martial Arts — Contrato completo y firma
--
-- Ejecutar DESPUES de 07-inscripcion-en-linea.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- QUE HACE
-- El Sensei hace firmar 11 hojas: la de inscripcion, el contrato de la
-- disciplina, el manifiesto y el reglamento completo. Aqui entra todo eso,
-- mas el trazo de la firma.
--
-- COMO SE REPARTE
-- Solo el contrato de la hoja 2 cambia segun la disciplina, y ese ya vive en
-- cada programa. El manifiesto y el reglamento son identicos para karate y
-- para acondicionamiento, asi que viven UNA sola vez en la tabla documentos.
-- Si vivieran duplicados por programa, cambiar un articulo obligaria a
-- editarlo dos veces y tarde o temprano quedarian distintos.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Documentos comunes a todas las disciplinas                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

create table if not exists documentos (
  id            bigint generated always as identity primary key,
  clave         text not null unique,
  titulo        text not null,
  texto         text not null,
  orden         smallint not null default 0,
  actualizado_en timestamptz not null default now()
);

comment on table  documentos       is 'Manifiesto y reglamento: mismos para toda disciplina';
comment on column documentos.clave is 'Identificador estable que usa el formulario: manifiesto, reglamento';
comment on column documentos.orden is 'Orden en que se muestran al inscribirse';

alter table documentos enable row level security;

drop policy if exists "lectura publica de documentos" on documentos;
create policy "lectura publica de documentos"
  on documentos for select
  to anon, authenticated
  using (true);

drop policy if exists "el panel administra documentos" on documentos;
create policy "el panel administra documentos"
  on documentos for all
  to authenticated
  using (true) with check (true);


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — La firma y la constancia ampliada                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- El trazo se guarda como imagen PNG en texto (data URL). Va junto a la
-- solicitud, no aparte, porque su valor esta en que consta QUE se firmo, QUE
-- decia lo firmado y CUANDO. Separarlos rompe esa cadena.
alter table solicitudes add column if not exists firma text;

comment on column solicitudes.firma is 'Trazo de la firma en PNG (data URL)';

-- Copia literal de lo que la persona tuvo enfrente ese dia. Igual que con el
-- contrato: si manana se edita un articulo, esto no cambia.
alter table solicitudes add column if not exists manifiesto_texto  text;
alter table solicitudes add column if not exists reglamento_texto  text;
alter table solicitudes add column if not exists acepto_manifiesto boolean not null default false;
alter table solicitudes add column if not exists acepto_reglamento boolean not null default false;

comment on column solicitudes.manifiesto_texto is 'Copia literal del manifiesto aceptado';
comment on column solicitudes.reglamento_texto is 'Copia literal del reglamento aceptado';


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 3 — Manifiesto (hoja 3)                                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

insert into documentos (clave, titulo, orden, texto) values
('manifiesto', 'Manifiesto', 1, $doc$1. Que para la participacion en las clases de BFS se me ha informado suficientemente y en un lenguaje comprensible sobre las caracteristicas de la actividad deportiva en la que voy a participar y sobre las condiciones fisicas requeridas para dicha participacion.

2. Que se me ha informado de forma suficiente y clara sobre los riesgos de dicha actividad y sobre las medidas de seguridad a adoptar en la realizacion de la misma.

3. Que he realizado el obligatorio reconocimiento medico de aptitud para la realizacion de tal actividad deportiva y que carezco de contraindicacion medica alguna.

4. Que conozco y entiendo las normas reguladoras de la actividad deportiva y que estoy plenamente conforme con las mismas, sometiendome a la potestad de direccion y/o disciplinaria de la organizacion.

5. Que asumo voluntariamente los riesgos de la actividad y, en consecuencia, eximo a la organizacion o al profesor de cualquier dano o perjuicio que pueda sufrir en el desarrollo de la actividad. Tal exencion no comprende los danos y perjuicios que sean consecuencia de culpa o negligencia de la academia.$doc$)
on conflict (clave) do update
  set titulo = excluded.titulo, texto = excluded.texto,
      orden = excluded.orden, actualizado_en = now();


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 4 — Reglamento general (hojas 4 a 10)                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

insert into documentos (clave, titulo, orden, texto) values
('reglamento', 'Reglamento general para los estudiantes de BFS Martial Arts and High Performance', 2, $doc$CAPITULO I — DISPOSICIONES GENERALES

Articulo 1. Para los efectos del presente Reglamento se entendera por:

I. BFS Martial Arts and High Performance, a la academia de artes marciales dentro del municipio de Coacalco de Berriozabal.

II. Estudiante, al estudiante regular, debidamente inscrito en BFS, cumpliendo los requisitos del plan de entrenamiento/ensenanza establecida.

III. Periodo, al termino de las mensualidades estipuladas el dia de la inscripcion.

Reglamento, a las normas que regiran a los estudiantes de BFS en cuestiones formativas, fisicas y de disciplina, con el proposito de formar personas con valores y aptitudes fisicas.


CAPITULO II — DE LOS DERECHOS DEL ESTUDIANTE DE BFS

Articulo 2. Todo estudiante inscrito en la academia BFS tiene derecho a recibir informacion adecuada y oportuna para el desempeno de sus actividades, incluyendo las precauciones.

Articulo 3. Todo estudiante inscrito en la academia BFS tiene derecho a ser tratado en forma atenta y respetuosa por parte del profesor a cargo, asi como de los padres y companeros de clase.

Articulo 4. En caso de que el estudiante se sienta intimidado por parte de un companero o padre de familia debera reportarlo inmediatamente con su profesor para la sancion inmediata del usuario.

Articulo 5. Todo estudiante inscrito tiene derecho a disfrutar de periodos vacacionales de acuerdo con fechas oficiales y las marcadas en el calendario BFS.

Articulo 6. Todo estudiante inscrito tiene derecho a recibir retroalimentacion objetiva por parte del profesor durante el horario asignado para su clase.

En caso de que al estudiante se le proporcione retroalimentacion objetiva y no realice las correcciones senaladas, el profesor debera continuar con la clase, a fin de continuar con los demas alumnos para evitar perder tiempo de clase.


CAPITULO III — DEL DEBER DEL ESTUDIANTE DE BFS

Articulo 7. El estudiante de BFS debe mostrar respeto, disciplina, proactividad, responsabilidad, compromiso y humildad; respetando los derechos humanos de toda persona que se encuentre en la academia. En caso de no hacerlo se hara acreedor a un llamado de atencion y sancion que al profesor le parezca pertinente.

Articulo 8. El estudiante debera presentarse dentro del tatami aseado, con unas cortas y limpias en manos y pies.

Articulo 9. El estudiante no podra ingerir alimentos o bebidas dentro del tatami.

Articulo 10. El estudiante debera portar la ropa deportiva adecuada (no shorts, no tops) o el oficial de la academia, el cual debera encontrarse limpio.

Articulo 11. Dentro de la hora de clase, no se permite el uso de aparatos electronicos tales como telefonos celulares, tabletas, computadoras, relojes inteligentes o cualquier otro similar.

Articulo 12. El estudiante no podra hacer menos a otro por motivo de su genero, religion, edad, o cualquier otro rasgo. En caso de incurrir, sera dado de baja de la academia.

Articulo 13. El estudiante debera tratar los materiales de la academia BFS con sumo cuidado y responsabilidad bajo las indicaciones que le brinde el profesor sobre cada uno de ellos para su correcto uso; de no ser asi y provocar algun dano por descuido, el alumno se hara acreedor a un cargo en su mensualidad dependiendo el valor del material danado.


CAPITULO IV — COMPORTAMIENTO ETICO DEL ESTUDIANTE

Articulo 14. En ninguna circunstancia el estudiante podra sustraer de la academia material.

Articulo 15. No incurrir en actos de violencia, amagos, palabras inapropiadas, injurias o malos tratos contra su profesor, companeros, o acompanantes, ya sea dentro o fuera de la academia. En caso de incurrir en un acto de amago o palabras inapropiadas, el estudiante se hara acreedor a baja automatica de la academia BFS.

Articulo 16. El estudiante tiene prohibido ingresar a sus actividades bajo los efectos de bebidas embriagantes, estupefacientes o psicotropicas, con aliento alcoholico, asi como en la posesion de cualquiera de dichas sustancias. En caso de encontrarse en tales efectos se realizara la baja automatica de la academia BFS.

Articulo 17. El estudiante debera evitar comprometer la seguridad del profesor, companeros y de toda persona que se encuentre haciendo uso de las instalaciones de la academia BFS.


CAPITULO V — DE LA DISCIPLINA Y SANCIONES

Articulo 18. Las medidas disciplinarias que se aplicaran a los estudiantes que infrinjan las disposiciones que regulan la practica de acuerdo con el presente Reglamento son:

I. Amonestacion verbal;
II. Amonestacion por escrito;
III. Suspension definitiva.

Articulo 19. La amonestacion verbal se realizara siempre en privado con el profesor cuando el estudiante incurra en el incumplimiento de cualquiera de las obligaciones especificadas en los capitulos III y IV.

Articulo 20. La amonestacion por escrito procedera cuando se incurra en faltas que asi lo ameriten y se extendera por parte del profesor.

Articulo 21. Se procedera a la suspension definitiva cuando el estudiante incurra en faltas consideradas como graves, por lo que el estudiante no podra continuar realizando sus entrenamientos. Dependiendo de la gravedad, el caso sera revisado por el profesor para determinar si el estudiante podra o no reincorporarse en un futuro.

Articulo 22. Se considera la suspension definitiva cuando el estudiante, por decision propia, abuse de su fuerza contra alumnos mas pequenos o principiantes, poniendo en riesgo la salud de sus companeros.

Articulo 23. Todo lo no enunciado en el presente Reglamento sera resuelto por el profesor; en casos extremos se remitira a las autoridades correspondientes.


CAPITULO VI — DE LAS CUOTAS

Articulo 24. Todo pago debera realizarse a nombre de RAFAEL ZAIN PEDRAZA MUNGUIA por el importe exacto correspondiente, y pueden efectuarse por los siguientes medios:
- deposito bancario
- transferencia bancaria
- efectivo

Articulo 25. Las cuotas por concepto de mensualidad se cubriran de forma puntual (el dia de su inscripcion, que se le creo su credencial).

Articulo 26. Las cuotas por conceptos de examenes, torneos o cualquier actividad extra a clases normales se cubriran exclusivamente en los periodos senalados por el sensei representante de la academia BFS.

Articulo 27. La inasistencia a clases, torneos y actividades extra confirmadas, con o sin justificacion, no exime al estudiante del pago de las cuotas correspondientes.

Articulo 28. El estudiante esta obligado a pagar su mensualidad completa en el momento en que realiza un dia de entrenamiento posterior a su dia de pago, sin importar la cantidad de faltas del mes por venir. Ejemplo:
- el dia del pago del practicante "N" es los dias 01 de cada mes; si "N" se presenta a entrenar el dia 02 de febrero estara obligado a pagar su mensualidad completa correspondiente sin importar cuanto vaya a faltar durante ese mes.

Articulo 29. Solo son faltas justificables aquellas por enfermedad o lesion que requieran mas de una semana de ausencia. Se podra reagendar el dia de pago del practicante/estudiante BFS y pausar el pago de su mensualidad hasta que se reincorpore a los entrenamientos. Ejemplo:
- el practicante "N" tiene como dia de pago 01 de cada mes, paga su colegiatura correspondiente a febrero y se presenta a entrenar hasta el dia 10 de febrero pero se enferma por lo que debera reposar 10 dias. "N" se presenta a entrenar nuevamente hasta el dia 20 de febrero con justificante en mano y/o el justificante ya enviado por via celular; ahora su dia de pago se reagendara a los dias 10 de cada mes (por los 10 dias que requirio reposo por enfermedad o lesion) por lo que su proxima mensualidad la pagara hasta el dia 10 de marzo.

Articulo 30. Los dias de Diciembre y Enero incluyen de 8 a 15 dias habiles de vacaciones; esta temporada vacacional no exime al practicante/estudiante BFS de realizar sus pagos de mensualidad completas correspondientes a estos meses.


INCUMPLIMIENTO

- El incumplimiento de las fechas de pago estipuladas causara un incremento del 15% a su mensualidad.
- Si el pago no se ha realizado en un lapso de 10 dias posteriores a su fecha de pago, ya no se le podra dar acceso a las clases al estudiante.
- Para poder realizar examen o torneo el estudiante debera estar al corriente con sus pagos.
- Todo evento extra confirmado por el padre, madre o tutor del estudiante, o por el mismo estudiante mayor a 18 anos, debera ser pagado al 100% asi hayan cancelado posteriormente a la confirmacion o no hayan asistido a dicho evento (examen, campamento, torneo, seminarios, clase extracurricular, entre otros).
- Todo equipo o uniforme confirmado debera ser pagado al 100% asi ya no lo requiera el estudiante.
- Toda inasistencia a clases, con o sin justificacion, NO exime al estudiante del pago de las mensualidades correspondientes, con excepcion de lo senalado en el articulo 29 de este reglamento.
- En ningun caso procedera la devolucion de cuotas.$doc$)
on conflict (clave) do update
  set titulo = excluded.titulo, texto = excluded.texto,
      orden = excluded.orden, actualizado_en = now();


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select 'documentos cargados' as concepto, string_agg(clave, ', ' order by orden) as resultado
  from documentos
union all
select 'largo del reglamento', length(texto)::text || ' caracteres'
  from documentos where clave = 'reglamento'
union all
select 'columnas nuevas en solicitudes',
       string_agg(column_name, ', ' order by column_name)
  from information_schema.columns
 where table_name = 'solicitudes'
   and column_name in ('firma','manifiesto_texto','reglamento_texto','acepto_manifiesto','acepto_reglamento');
