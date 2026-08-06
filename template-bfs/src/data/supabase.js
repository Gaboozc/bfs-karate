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
