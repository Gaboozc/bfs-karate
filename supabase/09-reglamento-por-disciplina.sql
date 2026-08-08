-- ============================================================================
-- BFS Martial Arts — Reglamento adaptado por disciplina
--
-- Ejecutar DESPUES de 08-contrato-completo.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- POR QUE
-- El reglamento original esta escrito para karate: habla del tatami, de
-- examenes y torneos, y prohibe shorts. Aplicado tal cual a acondicionamiento
-- fisico queda mal; la regla de no ingerir bebidas es incluso al reves, porque
-- en entrenamiento funcional la hidratacion es parte de la clase.
--
-- COMO FUNCIONA
-- Un documento con programa_id NULO aplica a todas las disciplinas. Uno con
-- programa_id aplica solo a esa y le gana al general. Asi el manifiesto sigue
-- siendo unico y solo el reglamento se desdobla.
--
-- ATENCION AL EDITAR
-- A partir de aqui existen DOS reglamentos. Un cambio que valga para las dos
-- disciplinas hay que hacerlo en ambos. Es el precio de que cada uno diga la
-- verdad de su clase.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 1 — Un documento puede ser de una disciplina                       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

alter table documentos add column if not exists programa_id bigint
  references programas(id) on delete cascade;

comment on column documentos.programa_id is
  'Nulo = aplica a todas las disciplinas. Con valor = solo esa, y le gana al general';

-- La restriccion vieja impedia tener dos reglamentos. Se sustituye por dos
-- indices parciales: uno solo general por clave, y uno por clave y disciplina.
-- Hacen falta ambos porque en SQL dos NULL no se consideran iguales, asi que
-- un unique normal sobre (clave, programa_id) dejaria colar varios generales.
alter table documentos drop constraint if exists documentos_clave_key;

create unique index if not exists documentos_clave_general_idx
  on documentos (clave) where programa_id is null;

create unique index if not exists documentos_clave_programa_idx
  on documentos (clave, programa_id) where programa_id is not null;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║ PARTE 2 — Reglamento de Acondicionamiento Fisico                         ║
-- ║                                                                          ║
-- ║ Identico al general salvo cinco puntos, marcados abajo. Todo lo demas    ║
-- ║ —derechos, deberes, etica, sanciones, cuotas, incumplimiento— se         ║
-- ║ conserva palabra por palabra.                                            ║
-- ║                                                                          ║
-- ║ CAMBIOS RESPECTO AL DE KARATE, PARA QUE EL SENSEI LOS CONFIRME:          ║
-- ║  Art 8   "tatami" -> "area de entrenamiento"; se quita lo de las unas    ║
-- ║  Art 9   se permite la hidratacion                                       ║
-- ║  Art 10  se permiten shorts; se pide calzado apropiado                   ║
-- ║  Art 26  "examenes, torneos" -> "cualquier actividad extra"              ║
-- ║  Incumpl. se quitan examen y torneo de la lista de eventos              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

insert into documentos (clave, titulo, orden, programa_id, texto)
select 'reglamento',
       'Reglamento general para los estudiantes de BFS Martial Arts and High Performance',
       2,
       p.id,
       $doc$CAPITULO I — DISPOSICIONES GENERALES

Articulo 1. Para los efectos del presente Reglamento se entendera por:

I. BFS Martial Arts and High Performance, a la academia de artes marciales dentro del municipio de Coacalco de Berriozabal.

II. Estudiante, al estudiante regular, debidamente inscrito en BFS, cumpliendo los requisitos del plan de entrenamiento/ensenanza establecida.

III. Periodo, al termino de las mensualidades estipuladas el dia de la inscripcion.

Reglamento, a las normas que regiran a los estudiantes de BFS en cuestiones formativas, fisicas y de disciplina, con el proposito de formar personas con valores y aptitudes fisicas.


CAPITULO II — DE LOS DERECHOS DEL ESTUDIANTE DE BFS

Articulo 2. Todo estudiante inscrito en la academia BFS tiene derecho a recibir informacion adecuada y oportuna para el desempeno de sus actividades, incluyendo las precauciones.

Articulo 3. Todo estudiante inscrito en la academia BFS tiene derecho a ser tratado en forma atenta y respetuosa por parte del profesor a cargo, asi como de los companeros de clase.

Articulo 4. En caso de que el estudiante se sienta intimidado por parte de un companero debera reportarlo inmediatamente con su profesor para la sancion inmediata del usuario.

Articulo 5. Todo estudiante inscrito tiene derecho a disfrutar de periodos vacacionales de acuerdo con fechas oficiales y las marcadas en el calendario BFS.

Articulo 6. Todo estudiante inscrito tiene derecho a recibir retroalimentacion objetiva por parte del profesor durante el horario asignado para su clase.

En caso de que al estudiante se le proporcione retroalimentacion objetiva y no realice las correcciones senaladas, el profesor debera continuar con la clase, a fin de continuar con los demas alumnos para evitar perder tiempo de clase.


CAPITULO III — DEL DEBER DEL ESTUDIANTE DE BFS

Articulo 7. El estudiante de BFS debe mostrar respeto, disciplina, proactividad, responsabilidad, compromiso y humildad; respetando los derechos humanos de toda persona que se encuentre en la academia. En caso de no hacerlo se hara acreedor a un llamado de atencion y sancion que al profesor le parezca pertinente.

Articulo 8. El estudiante debera presentarse al area de entrenamiento aseado y con ropa limpia.

Articulo 9. El estudiante no podra ingerir alimentos dentro del area de entrenamiento. La hidratacion esta permitida y es recomendable durante la clase.

Articulo 10. El estudiante debera portar ropa deportiva adecuada y calzado apropiado para el entrenamiento, o el uniforme oficial de la academia, el cual debera encontrarse limpio.

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

Articulo 22. Se considera la suspension definitiva cuando el estudiante, por decision propia, abuse de su fuerza contra otros companeros o principiantes, poniendo en riesgo su salud.

Articulo 23. Todo lo no enunciado en el presente Reglamento sera resuelto por el profesor; en casos extremos se remitira a las autoridades correspondientes.


CAPITULO VI — DE LAS CUOTAS

Articulo 24. Todo pago debera realizarse a nombre de RAFAEL ZAIN PEDRAZA MUNGUIA por el importe exacto correspondiente, y pueden efectuarse por los siguientes medios:
- deposito bancario
- transferencia bancaria
- efectivo

Articulo 25. Las cuotas por concepto de mensualidad se cubriran de forma puntual (el dia de su inscripcion, que se le creo su credencial).

Articulo 26. Las cuotas por concepto de cualquier actividad extra a clases normales se cubriran exclusivamente en los periodos senalados por el sensei representante de la academia BFS.

Articulo 27. La inasistencia a clases y actividades extra confirmadas, con o sin justificacion, no exime al estudiante del pago de las cuotas correspondientes.

Articulo 28. El estudiante esta obligado a pagar su mensualidad completa en el momento en que realiza un dia de entrenamiento posterior a su dia de pago, sin importar la cantidad de faltas del mes por venir. Ejemplo:
- el dia del pago del practicante "N" es los dias 01 de cada mes; si "N" se presenta a entrenar el dia 02 de febrero estara obligado a pagar su mensualidad completa correspondiente sin importar cuanto vaya a faltar durante ese mes.

Articulo 29. Solo son faltas justificables aquellas por enfermedad o lesion que requieran mas de una semana de ausencia. Se podra reagendar el dia de pago del practicante/estudiante BFS y pausar el pago de su mensualidad hasta que se reincorpore a los entrenamientos. Ejemplo:
- el practicante "N" tiene como dia de pago 01 de cada mes, paga su colegiatura correspondiente a febrero y se presenta a entrenar hasta el dia 10 de febrero pero se enferma por lo que debera reposar 10 dias. "N" se presenta a entrenar nuevamente hasta el dia 20 de febrero con justificante en mano y/o el justificante ya enviado por via celular; ahora su dia de pago se reagendara a los dias 10 de cada mes (por los 10 dias que requirio reposo por enfermedad o lesion) por lo que su proxima mensualidad la pagara hasta el dia 10 de marzo.

Articulo 30. Los dias de Diciembre y Enero incluyen de 8 a 15 dias habiles de vacaciones; esta temporada vacacional no exime al practicante/estudiante BFS de realizar sus pagos de mensualidad completas correspondientes a estos meses.


INCUMPLIMIENTO

- El incumplimiento de las fechas de pago estipuladas causara un incremento del 15% a su mensualidad.
- Si el pago no se ha realizado en un lapso de 10 dias posteriores a su fecha de pago, ya no se le podra dar acceso a las clases al estudiante.
- Para poder participar en cualquier actividad extra el estudiante debera estar al corriente con sus pagos.
- Todo evento extra confirmado por el estudiante, o por el padre, madre o tutor cuando el estudiante sea menor de edad, debera ser pagado al 100% asi hayan cancelado posteriormente a la confirmacion o no hayan asistido a dicho evento (campamento, seminarios, clase extracurricular, entre otros).
- Todo equipo o uniforme confirmado debera ser pagado al 100% asi ya no lo requiera el estudiante.
- Toda inasistencia a clases, con o sin justificacion, NO exime al estudiante del pago de las mensualidades correspondientes, con excepcion de lo senalado en el articulo 29 de este reglamento.
- En ningun caso procedera la devolucion de cuotas.$doc$
  from programas p
 where p.slug = 'acondicionamiento'
on conflict (clave, programa_id) where programa_id is not null
do update set titulo = excluded.titulo, texto = excluded.texto,
              orden = excluded.orden, actualizado_en = now();


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select coalesce(p.nombre, 'TODAS las disciplinas') as aplica_a,
       d.clave,
       length(d.texto)::text || ' caracteres' as largo
  from documentos d
  left join programas p on p.id = d.programa_id
 order by d.clave, p.nombre nulls first;
