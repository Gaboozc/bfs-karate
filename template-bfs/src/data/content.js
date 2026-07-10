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
    email:    "{{info@bfsmartialarts.com}}",
    address:  "Calle Yutes 07-planta alta, Villa de las Flores",
    city:     "San Francisco Coacalco, Estado de Mexico, 55710",
    googleMapsUrl: "https://maps.app.goo.gl/QJrgy1DTuhbAYHrE8",
    hours: {
      weekdays: "Lunes a Viernes: 7:00 - 22:00",
      saturday: "Sabado: 8:00 - 14:00",
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
    cta:        { primary:"Inscribete Ahora", secondary:"Ver Programas" },
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

  eventos: [
    { id:1, title:"Torneo Interno BFS",        date:"{{2026-07-12}}", type:"Torneo",      location:"Dojo BFS",                   desc:"Competencia interna para alumnos de todos los niveles. Modalidades Kata y Kumite.",               color:"#c0392b", link:"" },
    { id:2, title:"Seminario de Kata",         date:"{{2026-07-26}}", type:"Seminario",   location:"Dojo BFS",                   desc:"Seminario intensivo con maestro invitado. Kata Sentei y Tokui Kata de alto nivel.",             color:"#1a5276", link:"" },
    { id:3, title:"Copa Regional",             date:"{{2026-08-09}}", type:"Competencia", location:"{{Centro Deportivo Municipal}}", desc:"Campeonato regional con participacion de multiples clubes afiliados a la federacion.",         color:"#c0392b", link:"" },
    { id:4, title:"Demo — Feria Municipal",    date:"{{2026-08-16}}", type:"Exhibicion",  location:"{{Plaza Municipal}}",        desc:"Exhibicion de karate y alto rendimiento para la comunidad. Entrada libre.",                      color:"#2d6a4f", link:"" },
    { id:5, title:"Curso de Arbitros",         date:"{{2026-08-23}}", type:"Formacion",   location:"Dojo BFS",                   desc:"Certificacion oficial como arbitro de karate WKF. Cupo limitado.",                              color:"#6b4c36", link:"" },
    { id:6, title:"Campeonato Estatal",        date:"{{2026-09-06}}", type:"Competencia", location:"{{Ciudad, Estado}}",         desc:"Clasificatorio para campeonato nacional. Representacion oficial BFS.",                          color:"#c0392b", link:"" },
  ],

  enroll: {
    headline:    "EMPIEZA AHORA",
    subheadline: "Primera semana completamente gratis. Sin compromiso, sin excusas. Ven a conocer el dojo y descubre lo que BFS puede hacer por ti.",
    whatsappMessage: "Hola, me interesa inscribirme en BFS Martial Arts. Pueden darme informacion?",
    cta:         "Inscribirse por WhatsApp",
    badge:       "Primera semana GRATIS — sin compromiso",
  },

  nav: {
    links: [
      { label:"Inicio",       href:"/"            },
      { label:"Programas",    href:"/programas"   },
      { label:"Instructor",   href:"/instructores"},
      { label:"Horarios",     href:"/horarios"    },
      { label:"Eventos",      href:"/eventos"     },
      { label:"Merch",        href:"/merch"       },
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
