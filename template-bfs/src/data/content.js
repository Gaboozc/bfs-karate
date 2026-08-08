// content.js — BFS Martial Arts & High Performance
export const content = {

  business: {
    name:     "BFS Martial Arts",
    nameShort:"BFS",
    tagline:  "Better. Stronger. Faster.",
    sub:      "Martial Arts & High Performance",
    description: "Academia de artes marciales y alto rendimiento. Formamos atletas completos: disciplina mental, tecnica depurada y condicionamiento fisico de elite. Para ninos, jovenes y adultos.",
    founded:  "{{2010}}",
    phone:    "+52 56 3406 4647",
    whatsapp: "525563406647",
    email:    "{{info@bfsmartialart.com}}",
    address:  "Calle Yutes 07-planta alta, Villa de las Flores",
    city:     "San Francisco Coacalco, Estado de Mexico, 55710",
    googleMapsUrl: "https://maps.app.goo.gl/QJrgy1DTuhbAYHrE8",
    hours: {
      weekdays: "Lunes a Viernes: 7:00 AM - 10:00 PM",
      saturday: "Sabado: 8:00 AM - 2:00 PM",
      sunday:   "Domingo: Cerrado",
    },
    social: {
      instagram: "{{https://instagram.com/bfsmartialarts}}",
      facebook:  "https://facebook.com/bfsmartialarts",
      youtube:   "{{https://youtube.com/@bfsmartialarts}}",
    },
    certifications: [
      "Federacion Mexicana de Karate",
      "World Karate Federation (WKF)",
      "Entrenadores certificados CONADE",
      "Primeros auxilios y RCP",
    ],
    stats: [
      { value: "{{+500}}", label: "Atletas formados" },
      { value: "{{15+}}",  label: "Anos de trayectoria" },
      { value: "{{120+}}", label: "Medallas ganadas" },
      { value: "{{8}}",    label: "Instructores certificados" },
    ],
  },

  reviews: [
    { id:1, name:"{{Roberto H.}}",  rating:5, date:"{{2026-06-10}}", text:"{{Excelente academia. El Sensei Zain es un instructor increible, muy dedicado y profesional. Mi hijo ha mejorado muchisimo en disciplina y tecnica.}}" },
    { id:2, name:"{{Sofia M.}}",    rating:5, date:"{{2026-05-28}}", text:"{{Muy buen ambiente y excelentes instructores. Se nota la pasion por las artes marciales. Totalmente recomendado para ninos y adultos.}}" },
    { id:3, name:"{{Marco T.}}",    rating:5, date:"{{2026-04-15}}", text:"{{BFS es de lo mejor que hay en la zona. Los entrenamientos son intensos y bien estructurados. Gran comunidad y ambiente familiar.}}" },
    { id:4, name:"{{Ana L.}}",      rating:5, date:"{{2026-03-20}}", text:"{{Llevo 6 meses entrenando aqui y no me arrepiento. Las instalaciones son excelentes y el trato es inmejorable.}}" },
    { id:5, name:"{{Carlos R.}}",   rating:4, date:"{{2026-02-14}}", text:"{{Buen lugar para aprender karate. Los instructores son pacientes y se adaptan a cada alumno. Recomendado.}}" },
    { id:6, name:"{{Laura S.}}",    rating:5, date:"{{2026-01-30}}", text:"{{Mi hija esta encantada con las clases. Ha ganado confianza y disciplina desde que empezo. Los mejores instructores.}}" },
    { id:7, name:"{{Diego P.}}",    rating:5, date:"{{2025-12-18}}", text:"{{Increible experiencia. El nivel de ensenanza es de competencia real. Aprendi mas en 3 meses aqui que en anos en otros lugares.}}" },
  ],

  hero: {
    eyebrow:    "San Francisco Coacalco · Est. {{2010}}",
    headline:   "BETTER.\nSTRONGER.\nFASTER.",
    subheadline:"Formamos atletas completos. No solo luchadores — personas con disciplina, enfoque y caracter. Clases para todas las edades y niveles.",
    cta:        { primary:"Inscribete Ahora", secondary:"Ver Programas", sponsor:"Vuelvete Sponsor" },
    image:      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=85",
    badge:      "Primera semana GRATIS",
  },

  // Programas / disciplinas
  programs: [
    {
      id: 1,
      title:    "Karate Kids",
      ageRange: "4 - 12 anos",
      level:    "Todos los niveles",
      desc:     "Introduccion al karate con enfasis en disciplina, respeto y coordinacion. Clases divertidas que construyen bases solidas para toda la vida.",
      price:    "${{650}}/mes",
      schedule: "Lun / Mie / Vie",
      duration: "60 min",
      color:    "#f5c518",
      icon:     "star",
      featured: false,
    },
    {
      id: 2,
      title:    "Karate Competitivo",
      ageRange: "10 - 18 anos",
      level:    "Intermedio - Avanzado",
      desc:     "Preparacion para torneos locales, nacionales e internacionales. Kata y Kumite de alto nivel con metodologia WKF.",
      price:    "${{900}}/mes",
      schedule: "Lun a Vie",
      duration: "90 min",
      color:    "#c0392b",
      icon:     "trophy",
      featured: true,
    },
    {
      id: 3,
      title:    "Karate Adultos",
      ageRange: "18+ anos",
      level:    "Todos los niveles",
      desc:     "Tecnica, forma fisica y defensa personal. Sin importar si eres principiante o tienes experiencia — tienes un lugar aqui.",
      price:    "${{750}}/mes",
      schedule: "Lun / Mie / Vie",
      duration: "75 min",
      color:    "#1a5276",
      icon:     "shield",
      featured: false,
    },
    {
      id: 4,
      title:    "High Performance",
      ageRange: "12+ anos",
      level:    "Avanzado",
      desc:     "Entrenamiento de alto rendimiento: fuerza, velocidad, agilidad y resistencia. Complemento ideal para atletas de cualquier disciplina.",
      price:    "${{800}}/mes",
      schedule: "Mar / Jue / Sab",
      duration: "90 min",
      color:    "#6b4c36",
      icon:     "zap",
      featured: false,
    },
    {
      id: 5,
      title:    "Defensa Personal",
      ageRange: "15+ anos",
      level:    "Todos los niveles",
      desc:     "Tecnicas practicas y efectivas de autoproteccion. Ideal para personas que quieren sentirse seguras sin comprometerse con la competencia.",
      price:    "${{600}}/mes",
      schedule: "Sab / Dom",
      duration: "60 min",
      color:    "#2d6a4f",
      icon:     "user-shield",
      featured: false,
    },
    {
      id: 6,
      title:    "Clases Privadas",
      ageRange: "Cualquier edad",
      level:    "Personalizado",
      desc:     "Sesion uno a uno con instructor certificado. Progreso acelerado con plan 100% adaptado a tus objetivos y disponibilidad.",
      price:    "${{400}}/sesion",
      schedule: "A coordinar",
      duration: "60 min",
      color:    "#888888",
      icon:     "user-check",
      featured: false,
    },
  ],

  // Contenido exclusivo de la pagina Programas
  programasPage: {
    intro: "Seis programas, una misma metodologia. Todos comparten la base tecnica de BFS y se diferencian en intensidad, edad y objetivo. Si no sabes cual te toca, escribenos y te ubicamos en la clase correcta desde el primer dia.",
    pasos: {
      title: "Como empezar",
      items: [
        { n:"01", title:"Escribenos por WhatsApp", desc:"Nos dices tu edad, experiencia y que dias puedes. Te sugerimos el programa que te toca." },
        { n:"02", title:"Ven a tu semana gratis",  desc:"Traes ropa comoda y agua. Nada mas. El gi lo necesitas hasta que decidas quedarte." },
        { n:"03", title:"Te inscribes",            desc:"Si te gusto, formalizas la inscripcion y arrancas con tu plan. Sin contratos forzosos." },
      ],
    },
    faq: [
      { q:"Necesito experiencia previa?",                    a:"No. La mayoria de nuestros alumnos empezaron desde cero, incluidos varios que hoy compiten a nivel estatal. Cada clase tiene correccion individual, asi que no te vas a sentir perdido." },
      { q:"Que necesito para la primera clase?",             a:"Ropa deportiva comoda, agua y ganas. El karategi (gi) solo lo vas a necesitar cuando decidas inscribirte formalmente." },
      { q:"Hay limite de edad para empezar?",                a:"Recibimos desde los 4 anos en Karate Kids y no tenemos limite superior. Adultos de 40, 50 y 60+ entrenan en el programa de Karate Adultos a su propio ritmo." },
      { q:"Es obligatorio competir?",                        a:"No. Solo el programa de Karate Competitivo esta orientado a torneos. En el resto puedes entrenar toda tu vida sin pisar una competencia." },
      { q:"Cada cuanto se sube de cinta?",                   a:"Depende del avance individual, no del calendario. En promedio los examenes de grado se presentan cada 4 a 6 meses de entrenamiento constante." },
      { q:"Puedo cambiar de programa?",                      a:"Si, en cualquier momento. Si empezaste en Adultos y te interesa el alto rendimiento, solo se ajusta la mensualidad al nuevo programa." },
      { q:"Hay descuento por hermanos o por pago anual?",    a:"{{Si — consulta el descuento vigente por WhatsApp. Aplican condiciones.}}" },
      { q:"Que pasa si falto varias clases?",                a:"No se pierde la mensualidad ni el avance. Al volver, el instructor te reubica en el punto tecnico donde te quedaste." },
    ],
  },

  // Instructor
  instructors: [
    {
      id: 1,
      name:    "Rafael Zain Pedraza Munguia",
      rank:    "Cinta Negra 4° Dan",
      title:   "Fundador & Director Tecnico",
      bio:     "Fundador de BFS Martial Arts y cabeza tecnica de la academia. Cinturon Negro 4° Dan con trayectoria en competencia nacional e internacional. Atleta Top Ten Mexico en kickboxing y pointfighting bajo la organizacion NASKA, con participacion en torneos de alto nivel a lo largo de su carrera. Su metodologia combina la disciplina tradicional del karate con el dinamismo del alto rendimiento moderno, formando atletas completos — no solo en tecnica, sino en caracter y enfoque mental.",
      quote:   "El karate no es solo una tecnica de combate. Es una forma de vida.",
      photo:   "/instructor-zain.jpg",
      specialties: ["Karate", "Kickboxing", "Pointfighting", "Alto Rendimiento"],
      achievements: [
        "Atleta Top Ten Mexico — Kickboxing & Pointfighting",
        "Competidor NASKA (North American Sport Karate Association)",
        "Cinturon Negro 4° Dan",
        "Fundador de BFS Martial Arts",
      ],
      instagram: "@zainpedraza",
      beltColor: "#0a0a0a",
    },
  ],

  // Contenido exclusivo de la pagina Instructor
  instructorPage: {
    // Linea de tiempo — los anos son estimados, confirmar con el Sensei
    trayectoria: [
      { year:"{{2003}}", title:"Inicio en el karate",              desc:"Comienza su formacion en karate tradicional, enfocado en kata y fundamentos." },
      { year:"{{2009}}", title:"Primer cinturon negro — 1er Dan",  desc:"Obtiene el grado de cinta negra y empieza a asistir en la instruccion de grupos infantiles." },
      { year:"{{2012}}", title:"Entrada a competencia NASKA",      desc:"Debuta en el circuito de la North American Sport Karate Association en pointfighting." },
      { year:"{{2015}}", title:"Top Ten Mexico",                   desc:"Alcanza el ranking Top Ten nacional en kickboxing y pointfighting." },
      { year:"{{2018}}", title:"Fundacion de BFS Martial Arts",    desc:"Abre la academia en San Francisco Coacalco con una metodologia propia: tecnica, fuerza y velocidad en ese orden." },
      { year:"{{2023}}", title:"Cuarto Dan",                       desc:"Recibe el grado de 4° Dan y consolida el programa de alto rendimiento de la academia." },
    ],
    filosofia: {
      title: "Como entrena el Sensei",
      items: [
        { title:"Correccion individual, siempre", desc:"Ningun alumno termina una clase sin al menos una correccion dirigida a el por su nombre. El grupo avanza, pero nadie se queda atras." },
        { title:"Exigencia sin humillacion",      desc:"El nivel de exigencia es alto y no se negocia. El trato, en cambio, nunca se usa como herramienta de presion." },
        { title:"El caracter antes que el trofeo", desc:"Los resultados en competencia llegan solos cuando la disciplina esta bien construida. El proceso no se salta." },
        { title:"Adaptacion por etapa",            desc:"Un nino de 6 anos, un competidor de 16 y un adulto de 45 no entrenan igual. La carga se ajusta a cada cuerpo." },
      ],
    },
  },

  // Horario semanal — filas = clases, columnas = dias
  schedule: {
    days: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    slots: [
      { time:"07:00", mon:"High Perf.", tue:"High Perf.", wed:"High Perf.", thu:"High Perf.", fri:"High Perf.", sat:null, sun:null },
      { time:"09:00", mon:null, tue:null, wed:null, thu:null, fri:null, sat:"Karate Kids", sun:"Defensa P." },
      { time:"10:00", mon:null, tue:null, wed:null, thu:null, fri:null, sat:"Adultos", sun:null },
      { time:"16:00", mon:"Karate Kids", tue:"High Perf.", wed:"Karate Kids", thu:"High Perf.", fri:"Karate Kids", sat:null, sun:null },
      { time:"17:30", mon:"Adultos", tue:"Competitivo", wed:"Adultos", thu:"Competitivo", fri:"Adultos", sat:"Defensa P.", sun:null },
      { time:"19:00", mon:"Competitivo", tue:"Adultos", wed:"Competitivo", thu:"Adultos", fri:"Competitivo", sat:null, sun:null },
      { time:"20:30", mon:"High Perf.", tue:null, wed:"High Perf.", thu:null, fri:"High Perf.", sat:null, sun:null },
    ],
  },

  // Contenido exclusivo de la pagina Horarios
  horariosPage: {
    intro: "Siete bloques de horario al dia, de lunes a domingo. Tu mensualidad cubre todos los horarios de tu programa — puedes venir al que te acomode cada semana.",
    // Como funciona cada tipo de clase
    tiposClase: [
      // Las descripciones NO mencionan dias ni horas: eso lo dice la parrilla
      // que administra el Sensei. Antes prometian "bloques de 07:00 y 20:30" y
      // "sabado por la manana", horarios inventados que seguian anunciandose
      // aunque la parrilla estuviera vacia.
      { name:"High Perf.",   full:"High Performance",  color:"#6b4c36", desc:"Fuerza, velocidad y resistencia. Sin gi.", intensidad:"Alta" },
      { name:"Karate Kids",  full:"Karate Kids",       color:"#f5c518", desc:"Grupos de 4 a 12 anos. Juego dirigido, coordinacion y fundamentos.", intensidad:"Baja - Media" },
      { name:"Adultos",      full:"Karate Adultos",    color:"#1a5276", desc:"Tecnica, forma fisica y defensa personal para 18+. El grupo mas heterogeneo del dojo — desde principiantes hasta cintas cafe.", intensidad:"Media" },
      { name:"Competitivo",  full:"Karate Competitivo",color:"#c0392b", desc:"Kata y kumite bajo reglamento WKF. Requiere aprobacion del instructor para entrar.", intensidad:"Muy alta" },
      { name:"Defensa P.",   full:"Defensa Personal",  color:"#2d6a4f", desc:"Para 15+ anos. Escenarios practicos de autoproteccion. No requiere continuidad ni examen de grado.", intensidad:"Media" },
    ],
    notas: [
      "Puedes asistir a cualquier horario de tu programa — no estas amarrado a un dia fijo.",
      "Karate Competitivo requiere evaluacion previa del instructor antes de integrarte al grupo.",
      "Las clases privadas se coordinan directamente por WhatsApp y no aparecen en esta tabla.",
      "Los horarios de sabado y domingo pueden ajustarse en semanas de torneo o evento.",
    ],
  },

  // Eventos ya realizados — se muestran en la pagina de Eventos
  eventosPasados: [
    { id:101, title:"{{Copa Primavera 2026}}",      date:"{{2026-05-17}}", type:"Competencia", location:"{{Toluca, Estado de Mexico}}", resultado:"{{4 medallas de oro, 6 de plata y 3 de bronce}}", color:"#c0392b" },
    { id:102, title:"{{Examen de Grado — Ciclo 1}}",date:"{{2026-04-25}}", type:"Formacion",   location:"Dojo BFS",                    resultado:"{{28 alumnos promovidos de cinta}}",           color:"#6b4c36" },
    { id:103, title:"{{Seminario de Kumite}}",      date:"{{2026-03-14}}", type:"Seminario",   location:"Dojo BFS",                    resultado:"{{40 asistentes de 5 academias invitadas}}",   color:"#1a5276" },
    { id:104, title:"{{Torneo Interno de Invierno}}",date:"{{2026-01-24}}",type:"Torneo",      location:"Dojo BFS",                    resultado:"{{62 competidores en kata y kumite}}",         color:"#c0392b" },
  ],

  testimonials: [
    { id:1, name:"{{Roberto H.}}", role:"Padre de alumno — Karate Kids", text:"Mi hijo lleva 2 anos en BFS y el cambio ha sido increible. No solo en karate — en escuela, en casa, en todo. La disciplina que aprende aqui se nota en cada aspecto de su vida.", belt:"Cinta Naranja" },
    { id:2, name:"{{Sofia M.}}", role:"Alumna — Karate Competitivo", text:"Clasifique a mi primer torneo nacional despues de 8 meses de entrenamiento. El nivel de los instructores es impresionante. Realmente te exigen y te ven crecer.", belt:"Cinta Azul" },
    { id:3, name:"{{Marco T.}}", role:"Alumno adulto", text:"Llevo 3 anos en BFS y no hay dia que no quiera volver. Me puse en la mejor forma de mi vida y aprendi a defenderme. Un ambiente de familia y competencia perfectamente balanceados.", belt:"Cinta Cafe" },
  ],

  merch: [
    { id:1,  name:"Gi BFS Pro",            category:"Ropa",       price:"${{1,200}}", desc:"Kimono oficial de algodon canvas 12oz. Tallas 00-6. Logo BFS bordado.", image:"https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=500&q=80", featured:true,  badge:"Mas vendido" },
    { id:2,  name:"Playera BFS",           category:"Ropa",       price:"${{350}}",   desc:"Playera tecnica de entrenamiento con logo bordado BFS. Poliester transpirable.", image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", featured:false, badge:null },
    { id:3,  name:"Sudadera BFS",          category:"Ropa",       price:"${{650}}",   desc:"Hoodie de entrenamiento coleccion 2025. Fleece interior, capucha ajustable.", image:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80", featured:true,  badge:"Nuevo" },
    { id:4,  name:"Shorts de Combate",     category:"Ropa",       price:"${{420}}",   desc:"Shorts tecnicos para entrenamiento y competencia. Corte ergonomico.", image:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80", featured:false, badge:null },
    { id:5,  name:"Guantes Kumite WKF",    category:"Equipo",     price:"${{780}}",   desc:"Guantes de competencia aprobados WKF. Tallas S / M / L.", image:"https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=500&q=80", featured:true,  badge:"WKF Approved" },
    { id:6,  name:"Casco Protector",       category:"Equipo",     price:"${{950}}",   desc:"Casco de kumite homologado WKF. Proteccion total, peso ligero.", image:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&q=80", featured:false, badge:null },
    { id:7,  name:"Mitones de Entrenamiento", category:"Equipo",  price:"${{480}}",   desc:"Mitones de practica para ninos y adultos. Par. Varios colores.", image:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80", featured:false, badge:null },
    { id:8,  name:"Bolsa de Deporte BFS",  category:"Accesorios", price:"${{550}}",   desc:"Bolsa grande con compartimentos independientes y logo BFS.", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", featured:false, badge:null },
    { id:9,  name:"Parches BFS",           category:"Accesorios", price:"${{120}}",   desc:"Set de parches bordados: logo BFS y emblema nacional. Pack de 3.", image:"https://images.unsplash.com/photo-1555597673-b21d5c935865?w=500&q=80", featured:false, badge:"Pack x3" },
    { id:10, name:"Cinturon con Nombre",   category:"Accesorios", price:"${{180}}",   desc:"Cinturon oficial con nombre bordado. Disponible en todos los colores.", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80", featured:false, badge:"Personalizado" },
  ],

  // Contenido exclusivo de la pagina Merch
  merchPage: {
    intro: "Equipo oficial de la academia. Todo lo que vendemos es lo mismo que usamos en clase y en competencia — nada de reventa generica.",
    comoComprar: {
      title: "Como comprar",
      items: [
        { n:"01", title:"Consulta por WhatsApp", desc:"Nos escribes por el producto que te interesa. Te confirmamos existencia, talla y precio final." },
        { n:"02", title:"Apartas y pagas",       desc:"Puedes pagar en el dojo o por transferencia. El apartado se sostiene 5 dias." },
        { n:"03", title:"Recoges en el dojo",    desc:"Entrega directa en clase. Los bordados personalizados tardan de 5 a 7 dias habiles." },
      ],
    },
    tallas: {
      title: "Guia rapida de tallas de gi",
      note:  "El gi se mide por estatura, no por edad. Si estas entre dos tallas, siempre sube a la mayor — el algodon encoge en el primer lavado.",
      rows: [
        { talla:"00", estatura:"110 - 120 cm" },
        { talla:"0",  estatura:"120 - 130 cm" },
        { talla:"1",  estatura:"130 - 140 cm" },
        { talla:"2",  estatura:"140 - 150 cm" },
        { talla:"3",  estatura:"150 - 160 cm" },
        { talla:"4",  estatura:"160 - 170 cm" },
        { talla:"5",  estatura:"170 - 180 cm" },
        { talla:"6",  estatura:"180 - 190 cm" },
      ],
    },
  },

  eventos: [
    { id:1, title:"Torneo Interno BFS",        date:"{{2026-07-12}}", type:"Torneo",      location:"Dojo BFS",                   desc:"Competencia interna para alumnos de todos los niveles. Modalidades Kata y Kumite.",               color:"#c0392b", link:"" },
    { id:2, title:"Seminario de Kata",         date:"{{2026-07-26}}", type:"Seminario",   location:"Dojo BFS",                   desc:"Seminario intensivo con maestro invitado. Kata Sentei y Tokui Kata de alto nivel.",             color:"#1a5276", link:"" },
    { id:3, title:"Copa Regional",             date:"{{2026-08-09}}", type:"Competencia", location:"{{Centro Deportivo Municipal}}", desc:"Campeonato regional con participacion de multiples clubes afiliados a la federacion.",         color:"#c0392b", link:"" },
    { id:4, title:"Demo — Feria Municipal",    date:"{{2026-08-16}}", type:"Exhibicion",  location:"{{Plaza Municipal}}",        desc:"Exhibicion de karate y alto rendimiento para la comunidad. Entrada libre.",                      color:"#2d6a4f", link:"" },
    { id:5, title:"Curso de Arbitros",         date:"{{2026-08-23}}", type:"Formacion",   location:"Dojo BFS",                   desc:"Certificacion oficial como arbitro de karate WKF. Cupo limitado.",                              color:"#6b4c36", link:"" },
    { id:6, title:"Campeonato Estatal",        date:"{{2026-09-06}}", type:"Competencia", location:"{{Ciudad, Estado}}",         desc:"Clasificatorio para campeonato nacional. Representacion oficial BFS.",                          color:"#c0392b", link:"" },
  ],

  enroll: {
    headline:    "RECLAMA TU SEMANA GRATIS",
    subheadline: "Primera semana completamente gratis. Sin compromiso, sin excusas. Ven a conocer el dojo y descubre lo que BFS puede hacer por ti.",
    whatsappMessage: "Hola, quiero reclamar mi semana gratis en BFS Martial Arts. Pueden darme informacion?",
    cta:         "Reclamar semana gratis",
    badge:       "Primera semana GRATIS — sin compromiso",

    // Variantes por seccion — el CTA se adapta al contexto de cada pagina
    variants: {
      programas: {
        headline:    "PRUEBA TU PROGRAMA GRATIS",
        subheadline: "Elige el programa que te interese y entrena una semana completa sin pagar nada. Si no es para ti, no pasa nada.",
        badge:       "Primera semana GRATIS en cualquier programa",
        whatsappMessage: "Hola, quiero reclamar mi semana gratis. Me interesa saber que programa me conviene.",
      },
      instructor: {
        headline:    "ENTRENA CON EL SENSEI",
        subheadline: "Una semana gratis para conocer la metodologia de primera mano. Ven, entrena y decide despues.",
        badge:       "Primera semana GRATIS — sin compromiso",
        whatsappMessage: "Hola, quiero reclamar mi semana gratis y conocer la academia.",
      },
      horarios: {
        headline:    "APARTA TU HORARIO",
        subheadline: "Ya viste los horarios. Reclama tu semana gratis y prueba la clase que mejor te acomode.",
        badge:       "Primera semana GRATIS — cualquier horario",
        whatsappMessage: "Hola, quiero reclamar mi semana gratis. Me interesa el horario de ",
      },
      eventos: {
        headline:    "COMPITE CON BFS",
        subheadline: "Nuestros alumnos compiten desde el primer ano. Empieza con tu semana gratis y prepara tu primer torneo.",
        badge:       "Primera semana GRATIS — sin compromiso",
        whatsappMessage: "Hola, quiero reclamar mi semana gratis. Me interesa competir con BFS.",
      },
    },
  },

  // Patrocinios — CTA para empresas y marcas
  sponsor: {
    eyebrow: "Patrocinios",
    title:   "Vuelvete Sponsor",
    subtitle:"Apoya a los atletas de BFS",
    desc:    "Nuestros competidores representan a la academia en torneos regionales, estatales y nacionales. El patrocinio cubre inscripciones, traslados y equipo — y pone tu marca frente a cientos de familias en cada evento.",
    cta:     "Vuelvete Sponsor",
    whatsappMessage: "Hola, me interesa informacion sobre los paquetes de patrocinio de BFS Martial Arts.",
    beneficios: [
      { title:"Tu logo en el gi de competencia", desc:"Bordado en el uniforme oficial que los atletas usan en cada torneo de la temporada." },
      { title:"Presencia en el dojo",            desc:"Lona o placa de patrocinador visible en el area de entrenamiento durante toda la vigencia." },
      { title:"Menciones en redes",              desc:"Tu marca etiquetada en publicaciones de resultados, eventos y contenido de la academia." },
      { title:"Espacio en eventos BFS",          desc:"Stand o activacion de marca en torneos internos y exhibiciones organizadas por la academia." },
    ],
    // PRECIOS PENDIENTES DE DEFINIR — seran mensualidades, no por temporada.
    // Cuando esten listos, agregar `price:"$X,XXX/mes"` a cada paquete y
    // descomentar el bloque de precio en la tarjeta (SponsorSection).
    priceNote: "Cotizacion mensual a la medida. Escribenos y te compartimos los montos vigentes de cada paquete.",
    paquetes: [
      {
        name:  "Bronce",
        color: "#6b4c36",
        tagline:"Apoyo local",
        items: ["Logo en lona del dojo","Mencion en redes sociales","Reconocimiento en torneo interno"],
        whatsappMessage: "Hola, me interesa el paquete de patrocinio BRONCE de BFS Martial Arts. Me pueden compartir el costo mensual y que incluye?",
      },
      {
        name:  "Plata",
        color: "#c0c0c0",
        tagline:"Mayor visibilidad",
        items: ["Todo lo del paquete Bronce","Logo bordado en gi de competencia","Publicacion dedicada en redes","Espacio en 1 evento BFS"],
        whatsappMessage: "Hola, me interesa el paquete de patrocinio PLATA de BFS Martial Arts. Me pueden compartir el costo mensual y que incluye?",
      },
      {
        name:  "Oro",
        color: "#f5c518",
        tagline:"Patrocinador oficial",
        items: ["Todo lo del paquete Plata","Logo principal en uniforme y lona","Stand en todos los eventos BFS","Contenido de video con la marca","Reconocimiento como patrocinador oficial"],
        whatsappMessage: "Hola, me interesa el paquete de patrocinio ORO de BFS Martial Arts. Me pueden compartir el costo mensual y que incluye?",
      },
    ],
  },

  // Multimedia — bloque del inicio. Cada sub-bloque se oculta solo si no tiene
  // datos, asi la seccion se va llenando conforme lleguen los materiales.
  multimedia: {
    eyebrow: "Multimedia",
    title:   "Miranos en Accion",
    desc:    "Videos de entrenamientos, torneos y la vida diaria del dojo.",

    // Playlist de YouTube incrustada. Se necesita SOLO el ID de la playlist,
    // no una API key: es el codigo que sigue a "list=" en la URL de YouTube.
    // Ejemplo: youtube.com/playlist?list=PLxxxxxxxx  ->  "PLxxxxxxxx"
    // Mientras este vacio, el bloque de video no se muestra.
    youtubePlaylistId: "",

    // Galeria. Cada foto: { src, alt }. src apunta a /public.
    // Mientras el arreglo este vacio, la galeria no se muestra.
    // OJO: si aparecen menores de edad hace falta autorizacion de los padres.
    galeria: [],

    // Feed automatico de Instagram: pendiente para la etapa con backend.
    // No se puede hacer en un sitio estatico porque el token de la API de Meta
    // quedaria expuesto en el navegador, y ademas caduca cada 60 dias.
    instagramFeed: { habilitado: false },
  },

  // Patrocinadores actuales — banner de logos en el inicio.
  // Con menos de MIN_LOOP marcas se muestran fijas y centradas; a partir de ahi
  // el banner arranca el desplazamiento en loop automaticamente.
  // `logo`: ruta a un archivo en /public (ej. "/sponsors/alphadev.svg").
  // Si es null se muestra el nombre en tipografia display como respaldo.
  sponsorsActuales: {
    eyebrow: "Con el apoyo de",
    title:   "Nuestros Sponsors",
    desc:    "Marcas que hacen posible que nuestros atletas compitan.",
    marcas: [
      { name:"AlphaDev Studios", url:"https://alphadevstudios.com", logo:null, tier:"Oro" },
    ],
  },

  // Bloque exclusivo del inicio — metodologia BFS
  metodologia: {
    eyebrow: "Por que BFS",
    title:   "El Metodo BFS",
    intro:   "Better. Stronger. Faster. no es un lema — es el orden en que trabajamos. Primero la tecnica correcta, luego la fuerza para sostenerla, y al final la velocidad para aplicarla.",
    pilares: [
      { letter:"B", word:"BETTER",   title:"Tecnica primero", desc:"Nadie avanza de cinta sin dominar la base. Correccion individual en cada clase, sin importar el nivel del grupo.", color:"#c0392b" },
      { letter:"S", word:"STRONGER", title:"Fuerza real",     desc:"Acondicionamiento adaptado por edad y etapa. El cuerpo se prepara para aguantar el entrenamiento, no al reves.", color:"#f5c518" },
      { letter:"F", word:"FASTER",   title:"Velocidad aplicada", desc:"Reaccion, timing y distancia bajo presion. Aqui es donde la tecnica se vuelve util en kumite y en la vida real.", color:"#1a5276" },
    ],
  },

  nav: {
    links: [
      { label:"Inicio",       href:"/"            },
      { label:"Programas",    href:"/programas"   },
      { label:"Instructor",   href:"/instructores"},
      { label:"Horarios",     href:"/horarios"    },
      { label:"Eventos",      href:"/eventos"     },
      { label:"Merch",        href:"/merch"       },
      // button:true — no va en la lista de enlaces del nav, se renderiza como
      // boton rojo junto a "Inscribirse". Si sigue apareciendo en el footer.
      { label:"Sponsors",     href:"/sponsors", button:true },
      { label:"Contacto",     href:"/contacto"    },
    ],
    ctaText: "Inscribirse",
  },

  footer: {
    copyright: `\u00a9 ${new Date().getFullYear()} BFS Martial Arts & High Performance. Todos los derechos reservados.`,
    credit:    "Desarrollado por AlphaDev Studios",
    creditUrl: "https://alphadevstudios.com",
  },
}

export default content
