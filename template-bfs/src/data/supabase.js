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

// ── Patrocinadores ──────────────────────────────────────────────────────────

/**
 * Patrocinadores con sus pagos.
 *
 * Los pagos vienen en la misma consulta: la lista necesita mostrar cuando fue
 * el ultimo de cada uno, y pedirlos aparte serian N consultas mas para algo
 * que siempre se muestra junto.
 */
export const sponsorsTodos = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("sponsors")
    .select("*, sponsor_pagos(id, fecha, monto, metodo, nota)")
    .order("estado").order("marca")
  return { datos: data ?? [], error }
}

export const guardarSponsor = async sponsor => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, sponsor_pagos, ...campos } = sponsor
  const consulta = id
    ? supabase.from("sponsors").update(campos).eq("id", id)
    : supabase.from("sponsors").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarSponsor = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("sponsors").delete().eq("id", id)
  return { error }
}

/** Registra un pago. La fecha llega desde el formulario y se puede cambiar. */
export const registrarPagoSponsor = async pago => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = pago
  const consulta = id
    ? supabase.from("sponsor_pagos").update(campos).eq("id", id)
    : supabase.from("sponsor_pagos").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarPagoSponsor = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("sponsor_pagos").delete().eq("id", id)
  return { error }
}

// ── Fotos de productos ──────────────────────────────────────────────────────

export const imagenesDeProducto = async productoId => {
  if (!supabase || !productoId) return { datos: [], error: null }
  const { data, error } = await supabase
    .from("producto_imagenes").select("*")
    .eq("producto_id", productoId).order("orden").order("id")
  return { datos: data ?? [], error }
}

/**
 * Sube una foto ya comprimida y la registra.
 *
 * Si la subida al bucket funciona pero la fila falla, se borra el archivo:
 * sin fila nadie lo va a mostrar ni encontrar, y quedaria ocupando espacio
 * para siempre.
 */
export const subirFotoProducto = async (productoId, blob, ruta, orden) => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }

  const { error: errorSubida } = await supabase.storage
    .from("productos").upload(ruta, blob, { contentType: blob.type || "image/jpeg", upsert: false })
  if (errorSubida) return { error: errorSubida }

  const { data: publica } = supabase.storage.from("productos").getPublicUrl(ruta)

  const { error } = await supabase.from("producto_imagenes").insert({
    producto_id: productoId, url: publica.publicUrl, ruta, orden,
  })
  if (error) {
    await supabase.storage.from("productos").remove([ruta])
    return { error }
  }
  return { error: null, url: publica.publicUrl }
}

/** Borra la fila y tambien el archivo: quitar solo la fila deja basura. */
export const borrarFotoProducto = async imagen => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("producto_imagenes").delete().eq("id", imagen.id)
  if (error) return { error }
  await supabase.storage.from("productos").remove([imagen.ruta])
  return { error: null }
}

/** Reordena las fotos. La de orden 0 es la portada de la tienda. */
export const reordenarFotos = async imagenes => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const cambios = imagenes.map((img, i) =>
    supabase.from("producto_imagenes").update({ orden: i }).eq("id", img.id))
  const resultados = await Promise.all(cambios)
  return { error: resultados.find(r => r.error)?.error ?? null }
}

// ── Multimedia y redes ──────────────────────────────────────────────────────

/** Ajustes sueltos, como { youtube_playlist: "PL...", red_tiktok: "https://…" } */
export const ajustesTodos = async () => {
  if (!supabase) return { datos: {}, error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase.from("ajustes").select("clave, valor")
  return { datos: Object.fromEntries((data ?? []).map(a => [a.clave, a.valor ?? ""])), error }
}

/** Guarda varios ajustes de una vez. Recibe { clave: valor, … } */
export const guardarAjustes = async cambios => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const filas = Object.entries(cambios).map(([clave, valor]) => ({
    clave, valor, actualizado_en: new Date().toISOString(),
  }))
  const { error } = await supabase.from("ajustes").upsert(filas, { onConflict: "clave" })
  return { error }
}

export const publicacionesTodas = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("publicaciones").select("*")
    .order("orden").order("creado_en", { ascending: false })
  return { datos: data ?? [], error }
}

export const guardarPublicacion = async publicacion => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { id, ...campos } = publicacion
  const consulta = id
    ? supabase.from("publicaciones").update(campos).eq("id", id)
    : supabase.from("publicaciones").insert(campos)
  const { error } = await consulta
  return { error }
}

export const borrarPublicacion = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("publicaciones").delete().eq("id", id)
  return { error }
}

// ── Franjas horarias ────────────────────────────────────────────────────────
//
// Los renglones de la parrilla, tengan clase o no. Una hora vacia significa
// "aqui quiero poner algo" y eso es informacion que hay que conservar; no cabe
// en la tabla de horarios, donde cada fila es una clase con dia y programa.

export const franjasTodas = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase.from("franjas").select("*").order("hora")
  return { datos: data ?? [], error }
}

export const guardarFranja = async hora => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("franjas").insert({ hora })
  // Agregar una hora que ya estaba no es un fallo: el renglon ya existe, que
  // es justo lo que se pedia
  if (error?.code === "23505") return { error: null }
  return { error }
}

export const borrarFranja = async hora => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("franjas").delete().eq("hora", hora)
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

  // Los archivos se borran ANTES que el producto. La base borra sola las
  // filas de producto_imagenes en cascada, pero el bucket no se entera: si
  // se hiciera al reves, las rutas ya no existirian y las fotos quedarian
  // ocupando espacio para siempre, sin nada que las apunte.
  const { data: fotos } = await supabase
    .from("producto_imagenes").select("ruta").eq("producto_id", id)
  if (fotos?.length) {
    await supabase.storage.from("productos").remove(fotos.map(f => f.ruta))
  }

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

// ── Bandeja de inscripciones ────────────────────────────────────────────────

export const solicitudesTodas = async () => {
  if (!supabase) return { datos: [], error: { message: "Sin conexion a la base de datos." } }
  const { data, error } = await supabase
    .from("solicitudes")
    .select("*, programas(id, nombre, color)")
    .order("creado_en", { ascending: false })
  return { datos: data ?? [], error }
}

/**
 * Convierte una solicitud en alumno: crea la ficha con los mismos datos, lo
 * inscribe en el programa y marca la solicitud como aprobada.
 */
export const aprobarSolicitud = async solicitud => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }

  const { error: errorAlumno, id: alumnoId } = await guardarAlumno({
    nombre:            solicitud.nombre,
    fecha_nacimiento:  solicitud.fecha_nacimiento,
    fecha_inscripcion: solicitud.creado_en?.slice(0, 10),
    tutor_nombre:      solicitud.tutor_nombre,
    tutor2_nombre:     solicitud.tutor2_nombre,
    tutor_telefono:    solicitud.tutor_telefono,
    telefono2:         solicitud.telefono2,
    lesiones_previas:  solicitud.lesiones_previas,
    deporte_previo:    solicitud.deporte_previo,
    alergias:          solicitud.alergias,
    condiciones:       solicitud.condiciones,
    autoriza_imagen:   solicitud.acepto_imagen,
    autoriza_salud:    solicitud.acepto_salud,
    // El reglamento se acepta aparte del contrato de la disciplina: son
    // documentos distintos y la ficha debe reflejar cual firmo cada quien
    acepta_reglamento: solicitud.acepto_reglamento,
    estado:            "activo",
  })
  if (errorAlumno) return { error: errorAlumno }

  if (solicitud.programa_id && alumnoId) {
    await supabase.from("inscripciones").insert({
      alumno_id:     alumnoId,
      programa_id:   solicitud.programa_id,
      carta_firmada: solicitud.acepto_contrato,
      firmada_el:    solicitud.creado_en?.slice(0, 10),
    })
  }

  const { error } = await supabase.from("solicitudes")
    .update({ estado: "aprobada", alumno_id: alumnoId, resuelto_en: new Date().toISOString() })
    .eq("id", solicitud.id)
  return { error }
}

export const rechazarSolicitud = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("solicitudes")
    .update({ estado: "rechazada", resuelto_en: new Date().toISOString() })
    .eq("id", id)
  return { error }
}

export const borrarSolicitud = async id => {
  if (!supabase) return { error: { message: "Sin conexion a la base de datos." } }
  const { error } = await supabase.from("solicitudes").delete().eq("id", id)
  return { error }
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
