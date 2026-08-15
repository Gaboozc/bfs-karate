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
      // Se incluye la consulta y el motivo: un aviso que solo dice "400" no
      // permite distinguir una columna inexistente de un permiso faltante
      const motivo = await res.text().catch(() => "")
      console.warn(`[contenido] ${res.status} en "${ruta}", se usa el respaldo. ${motivo.slice(0, 200)}`)
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
 * Horario real de la academia, en el formato de rejilla que usa el sitio:
 * filas por hora, columnas por dia. Devuelve null si el Sensei no ha cargado
 * ninguna clase.
 *
 * Aqui NO hay respaldo a content.js, a diferencia de eventos o productos. El
 * horario de content.js es relleno inventado, y publicarlo mientras la base
 * esta vacia equivale a anunciar clases que no existen: alguien podria
 * presentarse un sabado a las 9 porque lo leyo en el sitio. Es preferible no
 * mostrar la seccion. Misma regla que pendientes.js.
 */
export const horariosPublicos = async () => {
  const filas = await leer("horarios?select=*&activo=eq.true&order=hora.asc,dia.asc")
  if (!filas?.length) return null

  const CLAVES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  const DIAS   = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
  const porHora = new Map()

  for (const f of filas) {
    const hora = f.hora.slice(0, 5)               // "16:00:00" -> "16:00"
    if (!porHora.has(hora)) {
      porHora.set(hora, { time: hora, mon:null, tue:null, wed:null, thu:null, fri:null, sat:null, sun:null })
    }
    porHora.get(hora)[CLAVES[f.dia - 1]] = f.programa
  }

  return { days: DIAS, slots: [...porHora.values()] }
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
const productoDelSitio = fila => {
  // Las fotos subidas mandan; la de menor orden es la portada. El campo viejo
  // de enlace sigue sirviendo de respaldo para lo capturado antes de que
  // existiera la subida de archivos.
  const subidas = [...(fila.producto_imagenes ?? [])].sort((a, b) => a.orden - b.orden)
  return {
    id:        fila.id,
    name:      fila.nombre,
    // La categoria viene de su propia tabla; el texto suelto es el respaldo
    category:  fila.categorias?.nombre ?? fila.categoria ?? "Sin categoria",
    // Sin precio definido, la tienda muestra "Consultar" por si sola
    price:     fila.precio != null ? `$${Number(fila.precio).toLocaleString("es-MX")}` : "{{pendiente}}",
    desc:      fila.descripcion,
    image:     subidas[0]?.url ?? fila.imagen,
    images:    subidas.map(i => i.url),
    badge:     fila.etiqueta,
    featured:  fila.destacado,
  }
}

/**
 * Productos visibles, con su categoria y sus fotos.
 *
 * El filtro por `disponible` faltaba: la casilla "Visible en la tienda" se
 * guardaba pero no ocultaba nada. Y el orden ahora respeta `destacado`, que
 * tampoco se estaba usando.
 */
export const productosPublicos = async respaldo => {
  let filas = await leer(
    "productos?select=*,categorias(nombre),producto_imagenes(url,orden)" +
    "&disponible=eq.true&order=destacado.desc,nombre.asc",
  )
  // Mientras la tabla de fotos no exista, la consulta falla entera y la
  // tienda mostraria el relleno en vez de los productos reales
  if (!filas) {
    filas = await leer("productos?select=*,categorias(nombre)&disponible=eq.true&order=nombre.asc")
  }
  return filas?.length ? filas.map(productoDelSitio) : respaldo
}

/**
 * Patrocinadores activos para el banner del inicio.
 *
 * Lee la VISTA, no la tabla: sponsors lleva telefono, correo y monto acordado,
 * y RLS no sabe filtrar por columna. La vista solo expone marca, logo, enlace
 * y nivel. Devuelve null si falla, para no borrar el respaldo de content.js.
 */
export const sponsorsPublicos = async () => {
  const filas = await leer("sponsors_publicos?select=marca,logo,url,tier")
  if (!filas) return null
  return filas.map(s => ({
    name: s.marca,
    url:  s.url,
    logo: s.logo,
    tier: { oro:"Oro", plata:"Plata", bronce:"Bronce" }[s.tier] ?? s.tier,
  }))
}

// ── Inscripcion en linea ────────────────────────────────────────────────────

/** Programa de un enlace publico, con su contrato. null si no existe. */
export const programaPorSlug = async slug => {
  const filas = await leer(`programas?select=id,nombre,color,contrato,slug&slug=eq.${encodeURIComponent(slug)}&activo=eq.true`)
  return filas?.[0] ?? null
}

// ── Multimedia y redes ──────────────────────────────────────────────────────

/**
 * Ajustes sueltos del sitio: ID de la playlist de YouTube y URL de las redes.
 * Devuelve {} si la base no responde, y cada bloque se oculta solo.
 */
export const ajustesPublicos = async () => {
  const filas = await leer("ajustes?select=clave,valor")
  // null cuando la consulta falla, {} cuando responde sin datos. Confundirlos
  // haria desaparecer los enlaces que si existen en content.js mientras la
  // tabla no este creada.
  if (!filas) return null
  return Object.fromEntries(filas.map(a => [a.clave, a.valor ?? ""]))
}

/**
 * Publicaciones que el Sensei eligio lucir.
 *
 * No es un feed automatico y no puede serlo sin backend: Instagram y Facebook
 * exigen un token de Meta que caduca cada 60 dias y que aqui quedaria expuesto
 * en el navegador. La unica red incrustable sin llave es YouTube.
 */
export const publicacionesPublicas = async () => {
  const filas = await leer("publicaciones?select=*&publicado=eq.true&order=orden.asc,creado_en.desc")
  return filas ?? []
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
  ajustesPublicos, publicacionesPublicas,
}
