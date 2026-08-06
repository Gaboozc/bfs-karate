// adminData.js — datos de demostracion del panel
//
// TEMPORAL: estos alumnos no existen. Estan aqui para que el panel se pueda
// ver y probar mientras se conecta Supabase, que es de donde vendran los
// datos reales. Los nombres van entre llaves dobles siguiendo la misma
// convencion del sitio publico: marcan lo que es material de relleno.
//
// Al conectar la base de datos, este archivo se elimina.
//
// Ya no incluye pagos, mensualidades, asistencia ni clases: esas secciones
// se retiraron del panel por decision del proyecto.

export const adminData = {

  // Padron de alumnos
  alumnos: [
    { id:"A001", nombre:"{{Carlos Ruiz}}",     programa:"Karate Competitivo", edad:14, belt:"Azul",     estado:"activo",   instructor:"Instructor 2" },
    { id:"A002", nombre:"{{Sofia Martinez}}",  programa:"Karate Competitivo", edad:16, belt:"Azul",     estado:"activo",   instructor:"Instructor 2" },
    { id:"A003", nombre:"{{Miguel Torres}}",   programa:"Karate Kids",        edad:8,  belt:"Amarilla", estado:"activo",   instructor:"Instructor 3" },
    { id:"A004", nombre:"{{Ana Lopez}}",       programa:"Adultos",            edad:34, belt:"Naranja",  estado:"activo",   instructor:"Instructor 3" },
    { id:"A005", nombre:"{{Pedro Gomez}}",     programa:"High Performance",   edad:22, belt:"Marron",   estado:"activo",   instructor:"Instructor 1" },
    { id:"A006", nombre:"{{Laura Hernandez}}", programa:"Defensa Personal",   edad:28, belt:"Blanco",   estado:"activo",   instructor:"Instructor 3" },
    { id:"A007", nombre:"{{Diego Sanchez}}",   programa:"Karate Kids",        edad:10, belt:"Morada",   estado:"activo",   instructor:"Instructor 3" },
    { id:"A008", nombre:"{{Roberto Perez}}",   programa:"Adultos",            edad:45, belt:"Negro",    estado:"activo",   instructor:"Instructor 1" },
    { id:"A009", nombre:"{{Valeria Cruz}}",    programa:"Karate Competitivo", edad:13, belt:"Azul",     estado:"activo",   instructor:"Instructor 2" },
    { id:"A010", nombre:"{{Marco Reyes}}",     programa:"High Performance",   edad:25, belt:"Marron",   estado:"inactivo", instructor:"Instructor 1" },
    { id:"A011", nombre:"{{Karla Vargas}}",    programa:"Karate Kids",        edad:7,  belt:"Blanco",   estado:"activo",   instructor:"Instructor 3" },
    { id:"A012", nombre:"{{Luis Morales}}",    programa:"Adultos",            edad:31, belt:"Amarilla", estado:"activo",   instructor:"Instructor 3" },
  ],

  // Datos para las graficas del tablero
  charts: {
    alumnosPorPrograma: [
      { nombre:"Competitivo", valor:24 },
      { nombre:"Kids",        valor:28 },
      { nombre:"Adultos",     valor:18 },
      { nombre:"High Perf.",  valor:12 },
      { nombre:"Defensa P.",  valor:5  },
    ],
    // Cintas del sistema BFS, en orden de progresion
    cinturones: [
      { nombre:"Blanco",   valor:22 },
      { nombre:"Morada",   valor:18 },
      { nombre:"Amarilla", valor:14 },
      { nombre:"Naranja",  valor:12 },
      { nombre:"Azul",     valor:10 },
      { nombre:"Marron",   valor:7  },
      { nombre:"Negro",    valor:4  },
    ],
  },
}

export default adminData
