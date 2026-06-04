// adminData.js — Panel admin de BFS Martial Arts
export const adminData = {

  kpis: {
    alumnosActivos:  { value:87,      label:"Alumnos Activos",      delta:"+5 este mes",   up:true  },
    ingresosHoy:     { value:"$3,200",label:"Ingresos del Dia",     delta:"+400 vs ayer",  up:true  },
    clasesHoy:       { value:6,       label:"Clases Hoy",           delta:"3 manana, 3 tarde", up:true },
    pagosVencidos:   { value:7,       label:"Pagos Vencidos",       delta:"Requiere accion",   up:false },
  },

  // Alumnos registrados
  alumnos: [
    { id:"A001", nombre:"{{Carlos Ruiz}}",    programa:"Karate Competitivo", edad:14, belt:"Azul",    estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:92, instructor:"Instructor 2" },
    { id:"A002", nombre:"{{Sofia Martinez}}", programa:"Karate Competitivo", edad:16, belt:"Verde",   estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:88, instructor:"Instructor 2" },
    { id:"A003", nombre:"{{Miguel Torres}}",  programa:"Karate Kids",        edad:8,  belt:"Amarillo",estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:95, instructor:"Instructor 3" },
    { id:"A004", nombre:"{{Ana Lopez}}",      programa:"Adultos",            edad:34, belt:"Naranja", estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:78, instructor:"Instructor 3" },
    { id:"A005", nombre:"{{Pedro Gomez}}",    programa:"High Performance",   edad:22, belt:"Cafe",    estado:"activo",   mensualidad:"Vencida",   vence:"2025-05-31", asistencia:81, instructor:"Instructor 1" },
    { id:"A006", nombre:"{{Laura Hernandez}}",programa:"Defensa Personal",   edad:28, belt:"Blanco",  estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:70, instructor:"Instructor 3" },
    { id:"A007", nombre:"{{Diego Sanchez}}",  programa:"Karate Kids",        edad:10, belt:"Verde",   estado:"activo",   mensualidad:"Vencida",   vence:"2025-05-15", asistencia:85, instructor:"Instructor 3" },
    { id:"A008", nombre:"{{Roberto Perez}}",  programa:"Adultos",            edad:45, belt:"Negro",   estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:96, instructor:"Instructor 1" },
    { id:"A009", nombre:"{{Valeria Cruz}}",   programa:"Karate Competitivo", edad:13, belt:"Azul",    estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:91, instructor:"Instructor 2" },
    { id:"A010", nombre:"{{Marco Reyes}}",    programa:"High Performance",   edad:25, belt:"Cafe",    estado:"inactivo", mensualidad:"Vencida",   vence:"2025-04-30", asistencia:45, instructor:"Instructor 1" },
    { id:"A011", nombre:"{{Karla Vargas}}",   programa:"Karate Kids",        edad:7,  belt:"Blanco",  estado:"activo",   mensualidad:"Pagada",    vence:"2025-06-30", asistencia:88, instructor:"Instructor 3" },
    { id:"A012", nombre:"{{Luis Morales}}",   programa:"Adultos",            edad:31, belt:"Amarillo",estado:"activo",   mensualidad:"Vencida",   vence:"2025-05-20", asistencia:62, instructor:"Instructor 3" },
  ],

  // Clases del dia
  clasesHoy: [
    { id:"C001", hora:"07:00", clase:"High Performance",   instructor:"Instructor 1", inscritos:8,  asistentes:7,  sala:"Dojo Principal",  estado:"done"      },
    { id:"C002", hora:"09:00", clase:"Karate Kids",        instructor:"Instructor 3", inscritos:12, asistentes:10, sala:"Dojo Jr.",        estado:"done"      },
    { id:"C003", hora:"16:00", clase:"Karate Kids",        instructor:"Instructor 3", inscritos:15, asistentes:null, sala:"Dojo Jr.",      estado:"scheduled" },
    { id:"C004", hora:"17:30", clase:"Adultos",            instructor:"Instructor 3", inscritos:10, asistentes:null, sala:"Dojo Principal",estado:"scheduled" },
    { id:"C005", hora:"19:00", clase:"Karate Competitivo", instructor:"Instructor 2", inscritos:14, asistentes:null, sala:"Dojo Principal",estado:"scheduled" },
    { id:"C006", hora:"20:30", clase:"High Performance",   instructor:"Instructor 1", inscritos:9,  asistentes:null, sala:"Sala Fitness",  estado:"scheduled" },
  ],

  // Membresias y pagos
  membresias: [
    { id:"M001", alumno:"{{Carlos Ruiz}}",     programa:"Karate Competitivo", monto:"$900", fecha:"2025-06-01", estado:"activo",   metodo:"Transferencia" },
    { id:"M002", alumno:"{{Sofia Martinez}}",  programa:"Karate Competitivo", monto:"$900", fecha:"2025-06-01", estado:"activo",   metodo:"Efectivo"      },
    { id:"M003", alumno:"{{Miguel Torres}}",   programa:"Karate Kids",        monto:"$650", fecha:"2025-06-01", estado:"activo",   metodo:"Transferencia" },
    { id:"M004", alumno:"{{Ana Lopez}}",       programa:"Adultos",            monto:"$750", fecha:"2025-06-01", estado:"activo",   metodo:"Efectivo"      },
    { id:"M005", alumno:"{{Pedro Gomez}}",     programa:"High Performance",   monto:"$800", fecha:"2025-05-01", estado:"vencida",  metodo:"Pendiente"     },
    { id:"M006", alumno:"{{Diego Sanchez}}",   programa:"Karate Kids",        monto:"$650", fecha:"2025-05-01", estado:"vencida",  metodo:"Pendiente"     },
    { id:"M007", alumno:"{{Laura Hernandez}}",  programa:"Defensa Personal",   monto:"$600", fecha:"2025-06-01", estado:"activo",   metodo:"Transferencia" },
    { id:"M008", alumno:"{{Roberto Perez}}",   programa:"Adultos",            monto:"$750", fecha:"2025-06-01", estado:"activo",   metodo:"Efectivo"      },
    { id:"M009", alumno:"{{Valeria Cruz}}",    programa:"Karate Competitivo", monto:"$900", fecha:"2025-06-01", estado:"activo",   metodo:"Transferencia" },
    { id:"M010", alumno:"{{Marco Reyes}}",     programa:"High Performance",   monto:"$800", fecha:"2025-04-01", estado:"vencida",  metodo:"Pendiente"     },
    { id:"M011", alumno:"{{Karla Vargas}}",    programa:"Karate Kids",        monto:"$650", fecha:"2025-06-01", estado:"activo",   metodo:"Efectivo"      },
    { id:"M012", alumno:"{{Luis Morales}}",    programa:"Adultos",            monto:"$750", fecha:"2025-05-01", estado:"vencida",  metodo:"Pendiente"     },
  ],

  // Datos para graficas
  charts: {
    ingresos7dias: [
      { dia:"Lun",total:2800 },{ dia:"Mar",total:1200 },{ dia:"Mie",total:3100 },
      { dia:"Jue",total:900  },{ dia:"Vie",total:3600 },{ dia:"Sab",total:4200 },
      { dia:"Hoy",total:3200 },
    ],
    alumnosPorPrograma: [
      { nombre:"Competitivo", valor:24 },
      { nombre:"Kids",        valor:28 },
      { nombre:"Adultos",     valor:18 },
      { nombre:"High Perf.",  valor:12 },
      { nombre:"Defensa P.",  valor:5  },
    ],
    asistenciaSemana: [
      { dia:"Lun",total:31 },{ dia:"Mar",total:18 },{ dia:"Mie",total:34 },
      { dia:"Jue",total:20 },{ dia:"Vie",total:38 },{ dia:"Sab",total:22 },
    ],
    cinturones: [
      { nombre:"Blanco",  valor:22 },
      { nombre:"Amarillo",valor:18 },
      { nombre:"Naranja", valor:14 },
      { nombre:"Verde",   valor:12 },
      { nombre:"Azul",    valor:10 },
      { nombre:"Cafe",    valor:7  },
      { nombre:"Negro",   valor:4  },
    ],
  },
}

export default adminData
