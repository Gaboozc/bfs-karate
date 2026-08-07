// supabase.js — conexion a la base de datos
//
// El sitio publico lee de aqui el contenido que el Sensei administra desde
// el panel: eventos, horarios y productos.
//
// Principio de diseno: el sitio publico NUNCA debe caerse porque la base de
// datos tuvo un problema. Todas las consultas devuelven el contenido de
// content.js como respaldo si algo falla.

import { createClient } from "@supabase/supabase-js"

const URL   = import.meta.env.VITE_SUPABASE_URL
const CLAVE = import.meta.env.VITE_SUPABASE_KEY

/** ¿Hay credenciales configuradas? Si no, todo funciona con el respaldo. */
export const hayConexion = Boolean(URL && CLAVE)

export const supabase = hayConexion
  ? createClient(URL, CLAVE, {
      auth: {
        // El panel guarda la sesion para no pedir contrasena en cada recarga
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/**
 * Ejecuta una consulta y, si algo sale mal, devuelve el respaldo.
 * Nunca lanza: quien la llama siempre recibe datos utilizables.
 */
export const consultar = async (consulta, respaldo) => {
  if (!supabase) return respaldo
  try {
    const { data, error } = await consulta(supabase)
    if (error) {
      console.warn("[supabase] consulta fallida, se usa el respaldo:", error.message)
      return respaldo
    }
    // Una tabla vacia tambien cae al respaldo: es mas util mostrar el
    // contenido de ejemplo que dejar la seccion en blanco
    return data?.length ? data : respaldo
  } catch (e) {
    console.warn("[supabase] sin conexion, se usa el respaldo:", e.message)
    return respaldo
  }
}

// ── Eventos ─────────────────────────────────────────────────────────────────

// La lectura publica de eventos vive en contenidoPublico.js, que usa fetch
// en vez de esta libreria para no cargarla en el sitio publico.

/** Todos los eventos, incluidos los borradores. Requiere sesion. */
export const eventosTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase.from("eventos").select("*").order("fecha", { ascending: false })
  return { datos: data ?? [], error }
}

export const guardarEvento = async evento => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = evento
  const consulta = id
    ? supabase.from("eventos").update(campos).eq("id", id)
    : supabase.from("eventos").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarEvento = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("eventos").delete().eq("id", id)
  return { error }
}

// ── Programas ───────────────────────────────────────────────────────────────
// Las clases que imparte la academia. Alimentan la pagina de programas del
// sitio y las opciones al armar el horario.

export const programasTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase.from("programas").select("*").order("orden").order("nombre")
  return { datos: data ?? [], error }
}

export const guardarPrograma = async programa => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = programa
  const consulta = id
    ? supabase.from("programas").update(campos).eq("id", id)
    : supabase.from("programas").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarPrograma = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("programas").delete().eq("id", id)
  return { error }
}

// ── Horarios ────────────────────────────────────────────────────────────────

/** Horarios con los datos del programa al que pertenece cada clase. */
export const horariosTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("horarios")
    .select("*, programas(id, nombre, color)")
    .order("dia").order("hora")
  return { datos: data ?? [], error }
}

export const guardarHorario = async horario => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = horario
  const consulta = id
    ? supabase.from("horarios").update(campos).eq("id", id)
    : supabase.from("horarios").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarHorario = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("horarios").delete().eq("id", id)
  return { error }
}

// ── Categorias de la tienda ─────────────────────────────────────────────────

export const categoriasTodas = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase.from("categorias").select("*").order("orden").order("nombre")
  return { datos: data ?? [], error }
}

export const guardarCategoria = async categoria => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = categoria
  const consulta = id
    ? supabase.from("categorias").update(campos).eq("id", id)
    : supabase.from("categorias").insert(campos)
  const { error } = await consulta
  return { error }
}

/** Al borrar, los productos de esa categoria quedan sin categoria, no se borran. */
export const borrarCategoria = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("categorias").delete().eq("id", id)
  return { error }
}

// ── Inventario ──────────────────────────────────────────────────────────────

export const productosTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(id, nombre)")
    .order("nombre")
  return { datos: data ?? [], error }
}

export const guardarProducto = async producto => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = producto
  const consulta = id
    ? supabase.from("productos").update(campos).eq("id", id)
    : supabase.from("productos").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarProducto = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("productos").delete().eq("id", id)
  return { error }
}

/** Ajusta existencias sin abrir el formulario completo. */
export const ajustarExistencias = async (id, existencias) => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("productos").update({ existencias }).eq("id", id)
  return { error }
}

// ── Padron de alumnos ───────────────────────────────────────────────────────
// Estas tablas no tienen lectura publica: sin sesion no devuelven nada.

/** Alumnos con sus programas y su ultimo grado. */
export const alumnosTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("alumnos")
    .select("*, inscripciones(id, programa_id, hasta, programas(id, nombre, color))")
    .order("nombre")
  return { datos: data ?? [], error }
}

export const guardarAlumno = async alumno => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." }, id: null }
  const { id, inscripciones, ...campos } = alumno
  if (id) {
    const { error } = await supabase.from("alumnos").update(campos).eq("id", id)
    return { error, id }
  }
  const { data, error } = await supabase.from("alumnos").insert(campos).select("id").single()
  return { error, id: data?.id ?? null }
}

export const borrarAlumno = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("alumnos").delete().eq("id", id)
  return { error }
}

/**
 * Deja al alumno inscrito exactamente en los programas indicados:
 * agrega los que faltan y quita los que ya no esten.
 */
export const fijarInscripciones = async (alumnoId, programaIds) => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }

  const { data: actuales } = await supabase
    .from("inscripciones").select("id, programa_id").eq("alumno_id", alumnoId)

  const previos = (actuales ?? []).map(i => i.programa_id)
  const porAgregar = programaIds.filter(p => !previos.includes(p))
  const porQuitar  = (actuales ?? []).filter(i => !programaIds.includes(i.programa_id))

  if (porQuitar.length) {
    const { error } = await supabase.from("inscripciones").delete().in("id", porQuitar.map(i => i.id))
    if (error) return { error }
  }
  if (porAgregar.length) {
    const { error } = await supabase.from("inscripciones")
      .insert(porAgregar.map(programa_id => ({ alumno_id: alumnoId, programa_id })))
    if (error) return { error }
  }
  return { error: null }
}

/** Historial de cintas de un alumno, de lo mas reciente a lo mas antiguo. */
export const gradosDeAlumno = async alumnoId => {
  if (!supabase) return { datos: [], error: null }
  const { data, error } = await supabase
    .from("grados").select("*").eq("alumno_id", alumnoId).order("fecha", { ascending: false })
  return { datos: data ?? [], error }
}

/** Registra un cambio de cinta y actualiza la cinta actual del alumno. */
export const registrarGrado = async (alumnoId, cinta, fecha, notas) => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("grados").insert({ alumno_id: alumnoId, cinta, fecha, notas })
  if (error) return { error }
  const { error: error2 } = await supabase.from("alumnos").update({ cinta }).eq("id", alumnoId)
  return { error: error2 }
}

// ── Sesion del panel ────────────────────────────────────────────────────────

export const iniciarSesion = async (email, password) => {
  if (!supabase) return { error: { message: "Falta configurar la conexion a la base de datos." } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { sesion: data?.session ?? null, error }
}

export const cerrarSesion = async () => {
  if (!supabase) return
  await supabase.auth.signOut()
}

export const sesionActual = async () => {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session ?? null
}

/** Avisa cuando la sesion cambia (login, logout, expiracion). */
export const alCambiarSesion = callback => {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => callback(sesion))
  return () => data?.subscription?.unsubscribe()
}

export default supabase
