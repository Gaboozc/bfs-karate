// contenidoPublico.js — lectura del contenido administrable
//
// El sitio publico solo necesita LEER lo que ya esta publicado. Eso es una
// peticion HTTP simple, asi que se hace con fetch en vez de cargar la
// libreria de Supabase: son ~220 kB que no tiene por que descargar alguien
// que solo viene a ver los horarios.
//
// La libreria completa se usa unicamente en el panel, que se carga aparte.
//
// Regla de la casa: si la base no responde, se devuelve el contenido local
// de content.js. El sitio publico nunca se cae por un problema de la base.

const URL   = import.meta.env.VITE_SUPABASE_URL
const CLAVE = import.meta.env.VITE_SUPABASE_KEY

const hayConexion = Boolean(URL && CLAVE)

/** Consulta la API de Supabase. Devuelve null si algo falla. */
const leer = async ruta => {
  if (!hayConexion) return null
  try {
    const res = await fetch(`${URL}/rest/v1/${ruta}`, {
      headers: { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` },
    })
    if (!res.ok) {
      console.warn(`[contenido] la base respondio ${res.status}, se usa el respaldo`)
      return null
    }
    return await res.json()
  } catch (e) {
    console.warn("[contenido] sin conexion, se usa el respaldo:", e.message)
    return null
  }
}

/**
 * Traduce un evento de la base al formato que ya usa el sitio.
 * Las columnas estan en espanol y los componentes venian usando nombres en
 * ingles; adaptar aqui evita reescribirlos.
 */
const aFormatoDelSitio = fila => ({
  id:        fila.id,
  title:     fila.titulo,
  date:      fila.fecha,
  type:      fila.tipo,
  location:  fila.sede,
  desc:      fila.descripcion,
  resultado: fila.resultado,
  color:     fila.color,
  link:      "",
})

/** Eventos publicados. `respaldo` es lo que se muestra si la base falla. */
export const eventosPublicos = async respaldo => {
  const filas = await leer("eventos?select=*&publicado=eq.true&order=fecha.asc")
  // Una tabla vacia tambien cae al respaldo: mientras el Sensei no haya
  // cargado nada, es mejor mostrar el contenido de ejemplo que una pagina
  // en blanco
  return filas?.length ? filas.map(aFormatoDelSitio) : respaldo
}

/**
 * Horario semanal, en el formato de rejilla que usa el sitio:
 * filas por hora, columnas por dia.
 */
export const horariosPublicos = async respaldo => {
  const filas = await leer("horarios?select=*&activo=eq.true&order=hora.asc,dia.asc")
  if (!filas?.length) return respaldo

  const CLAVES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  const porHora = new Map()

  for (const f of filas) {
    const hora = f.hora.slice(0, 5)               // "16:00:00" -> "16:00"
    if (!porHora.has(hora)) {
      porHora.set(hora, { time: hora, mon:null, tue:null, wed:null, thu:null, fri:null, sat:null, sun:null })
    }
    porHora.get(hora)[CLAVES[f.dia - 1]] = f.programa
  }

  return { days: respaldo.days, slots: [...porHora.values()] }
}

/** Traduce un programa de la base al formato que usa el sitio. */
const programaDelSitio = fila => ({
  id:       fila.id,
  title:    fila.nombre,
  ageRange: fila.edades,
  level:    fila.nivel,
  desc:     fila.descripcion,
  price:    fila.precio != null ? `$${Number(fila.precio).toLocaleString("es-MX")}/mes` : "{{pendiente}}",
  duration: fila.duracion,
  schedule: "",                 // el horario real vive en su propia seccion
  color:    fila.color,
  icon:     "trophy",
  featured: fila.destacado,
})

/** Programas activos, en el orden definido por el Sensei. */
export const programasPublicos = async respaldo => {
  const filas = await leer("programas?select=*&activo=eq.true&order=orden.asc,nombre.asc")
  return filas?.length ? filas.map(programaDelSitio) : respaldo
}

/** Traduce un producto de la base al formato que usa la tienda. */
const productoDelSitio = fila => ({
  id:        fila.id,
  name:      fila.nombre,
  // La categoria viene de su propia tabla; el texto suelto es el respaldo
  category:  fila.categorias?.nombre ?? fila.categoria ?? "Sin categoria",
  // Sin precio definido, la tienda muestra "Consultar" por si sola
  price:     fila.precio != null ? `$${Number(fila.precio).toLocaleString("es-MX")}` : "{{pendiente}}",
  desc:      fila.descripcion,
  image:     fila.imagen,
  badge:     fila.etiqueta,
  featured:  fila.destacado,
})

/** Productos disponibles y con existencias, con su categoria. */
export const productosPublicos = async respaldo => {
  const filas = await leer("productos?select=*,categorias(nombre)&order=nombre.asc")
  return filas?.length ? filas.map(productoDelSitio) : respaldo
}

// ── Inscripcion en linea ────────────────────────────────────────────────────

/** Programa de un enlace publico, con su contrato. null si no existe. */
export const programaPorSlug = async slug => {
  const filas = await leer(`programas?select=id,nombre,color,contrato,slug&slug=eq.${encodeURIComponent(slug)}&activo=eq.true`)
  return filas?.[0] ?? null
}

/**
 * Manifiesto y reglamento que le tocan a una disciplina.
 *
 * Un documento sin programa_id aplica a todas; uno con programa_id aplica solo
 * a esa y le gana al general. Asi el manifiesto vive una sola vez y solo el
 * reglamento se desdobla, porque el de karate habla de tatami, examenes y
 * torneos y no describe una clase de acondicionamiento.
 *
 * Devuelve { manifiesto, reglamento } con { titulo, texto }.
 */
export const documentosDePrograma = async programaId => {
  const filtro = programaId
    ? `&or=(programa_id.is.null,programa_id.eq.${programaId})`
    : "&programa_id=is.null"

  // Si la columna programa_id todavia no existe, la consulta falla entera y
  // los documentos desaparecerian de la pagina. En ese caso se piden sin
  // filtrar: es preferible mostrar el reglamento general que ninguno.
  let filas = await leer(`documentos?select=clave,titulo,texto,programa_id&order=orden${filtro}`)
  if (!filas) filas = await leer("documentos?select=clave,titulo,texto&order=orden")

  const porClave = {}
  for (const d of filas ?? []) {
    // El especifico pisa al general, sin importar en que orden lleguen
    if (!porClave[d.clave] || d.programa_id != null) porClave[d.clave] = d
  }
  return porClave
}

/**
 * Envia una solicitud de inscripcion. La politica de la base permite
 * insertar sin sesion, pero no leer: nadie puede consultar los datos de
 * otras personas desde el formulario.
 */
export const enviarSolicitud = async datos => {
  if (!hayConexion) return { error: { message: "Sin conexion" } }
  try {
    const res = await fetch(`${URL}/rest/v1/solicitudes`, {
      method: "POST",
      headers: {
        apikey: CLAVE,
        Authorization: `Bearer ${CLAVE}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(datos),
    })
    if (!res.ok) return { error: { message: `La base respondio ${res.status}` } }
    return { error: null }
  } catch (e) {
    return { error: { message: e.message } }
  }
}

export default {
  eventosPublicos, horariosPublicos, productosPublicos, programasPublicos,
  programaPorSlug, documentosDePrograma, enviarSolicitud,
}
