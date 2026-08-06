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

/** Traduce un producto de la base al formato que usa la tienda. */
const productoDelSitio = fila => ({
  id:        fila.id,
  name:      fila.nombre,
  category:  fila.categoria,
  // Sin precio definido, la tienda muestra "Consultar" por si sola
  price:     fila.precio != null ? `$${Number(fila.precio).toLocaleString("es-MX")}` : "{{pendiente}}",
  desc:      fila.descripcion,
  image:     fila.imagen,
  badge:     fila.etiqueta,
  featured:  fila.destacado,
})

/** Productos disponibles y con existencias. */
export const productosPublicos = async respaldo => {
  const filas = await leer("productos?select=*&order=categoria.asc,nombre.asc")
  return filas?.length ? filas.map(productoDelSitio) : respaldo
}

export default { eventosPublicos, horariosPublicos, productosPublicos }
